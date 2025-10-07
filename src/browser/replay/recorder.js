import { record as rrwebRecordFn } from '@rrweb/record';
import { EventType } from '@rrweb/types';

import hrtime from '../../tracing/hrtime.js';
import logger from '../../logger.js';

/** @typedef {import('./recorder.js').BufferCursor} BufferCursor */

export default class Recorder {
  _options;
  _rrwebOptions;

  _isReady = false;
  _stopFn = null;
  _recordFn;

  /** A two-slot ring buffer for storing events. */
  _buffers = [[], []];
  /** Active slot index (0|1). Stores new events until next checkout. */
  _currentSlot = 0;
  /** Index of the finalized inactive slot (0|1). Frozen until next checkout. */
  get _previousSlot() {
    return this._currentSlot ^ 1;
  }

  /**
   * Creates a new Recorder instance for capturing DOM events
   *
   * @param {Object} options - Configuration options for the recorder
   */
  constructor(options) {
    this.options = options;

    // Tests inject a custom rrweb record function or mock.
    this._recordFn = options.recordFn ||rrwebRecordFn;
  }

  get isRecording() {
    return this._stopFn !== null;
  }

  get isReady() {
    return this._isReady;
  }

  get options() {
    return this._options;
  }

  set options(newOptions) {
    this.configure(newOptions);
  }

  configure(newOptions) {
    const {
      // Rollbar options
      enabled,
      autoStart,
      maxSeconds,
      postDuration,
      triggers,
      debug,

      // disallowed rrweb options
      emit,
      checkoutEveryNms,

      // rrweb options
      ...rrwebOptions
    } = newOptions;

    this._options = {
      enabled,
      autoStart,
      maxSeconds,
      postDuration,
      triggers,
      debug,
    };

    this._rrwebOptions = rrwebOptions;

    if (this.isRecording && newOptions.enabled === false) {
      this.stop();
    }
  }

  /**
   * Calculates the checkout interval in milliseconds.
   *
   * Recording may span up to two checkout intervals, so the interval is set
   * to half of maxSeconds to ensure coverage.
   *
   * @returns {number} Checkout interval in milliseconds
   */
  checkoutEveryNms() {
    return ((this.options.maxSeconds || 10) * 1000) / 2;
  }

  /**
   * Returns a point-in-time cursor for the active buffer.
   *
   * Used to capture a stable cursor that survives a single checkout.
   *
   * @remarks
   *
   * While offset can be `-1` if the buffer is empty, this cannot occur when
   * `_isReady` is `true`. The emit callback always pushes the triggering event
   * after any buffer reset, ensuring the active buffer has at least one event.
   *
   * @returns {BufferCursor} Buffer slot and event exclusive offset.
   */
  bufferCursor() {
    return {
      slot: this._currentSlot,
      offset: this._buffers[this._currentSlot].length - 1,
    };
  }

  /**
   * Exports the recording span with all recorded events or events after a cursor.
   *
   * @param {Object} tracing - The tracing system instance to create spans
   * @param {Object} attributes - Span attributes (rollbar.replay.id, etc.)
   * @param {BufferCursor} [cursor] - Cursor position to start from (exclusive), or all if not provided
   */
  exportRecordingSpan(tracing, attributes = {}, cursor) {
    const events = cursor
      ? this._collectEventsFromCursor(cursor)
      : this._collectAll();

    if (events.length === 0) {
      throw new Error('Replay recording has no events');
    }

    const recordingSpan = tracing.startSpan('rrweb-replay-recording', {});

    recordingSpan.setAttributes({
      ...(tracing.session?.attributes ?? {}),
      ...attributes,
    });

    const earliestEvent = events.reduce((earliestEvent, event) =>
      event.timestamp < earliestEvent.timestamp ? event : earliestEvent,
    );

    recordingSpan.span.startTime = hrtime.fromMillis(earliestEvent.timestamp);

    for (const event of events) {
      recordingSpan.addEvent(
        'rrweb-replay-events',
        {
          eventType: event.type,
          json: JSON.stringify(event.data),
        },
        hrtime.fromMillis(event.timestamp),
      );
    }

    recordingSpan.end();
  }

  start() {
    if (this.isRecording || this.options.enabled === false) {
      return;
    }

    this.clear();

    this._stopFn = this._recordFn({
      emit: (event, isCheckout) => {
        if (!this._isReady && event.type === EventType.FullSnapshot) {
          this._isReady = true;
        }

        if (this.options.debug?.logEmits) {
          Recorder._logEvent(event, isCheckout);
        }

        if (isCheckout && event.type === EventType.Meta) {
          this._currentSlot = this._previousSlot;
          this._buffers[this._currentSlot] = [];
        }

        this._buffers[this._currentSlot].push(event);
      },
      checkoutEveryNms: this.checkoutEveryNms(),
      errorHandler: (error) => {
        if (this.options.debug?.logErrors) {
          logger.error('Error during replay recording', error);
        }
        return true; // swallow the error instead of throwing it to the window
      },
      ...this._rrwebOptions,
    });

    return this;
  }

  stop() {
    if (!this.isRecording) {
      return;
    }

    this._stopFn();
    this._stopFn = null;
    this._isReady = false;

    return this;
  }

  clear() {
    this._buffers = [[], []];
    this._currentSlot = 0;
    this._isReady = false;
  }

  /**
   * Collects all events (previous ⊕ current) and returns a new array with a
   * trailing `replay.end` marker.
   *
   * @returns {Array} All events with replay.end marker
   * @private
   */
  _collectAll() {
    const previousEvents = this._buffers[this._previousSlot];
    const currentEvents = this._buffers[this._currentSlot];
    const allEvents = previousEvents.concat(currentEvents);

    if (allEvents.length > 0) {
      allEvents.push(Recorder._replayEndEvent());
    }

    return allEvents;
  }

  /**
   * Collects events strictly after `cursor` (exclusive) and returns a new
   * array with `replay.end`.
   *
   * @param {BufferCursor} cursor - Cursor position to collect from
   * @returns {Array} Events after cursor with replay.end marker
   * @private
   */
  _collectEventsFromCursor(cursor) {
    const currentSlot = this._currentSlot;
    const capturedBuffer = this._buffers[cursor.slot] ?? [];
    const currentBuffer = this._buffers[currentSlot];
    const head = capturedBuffer.slice(Math.max(0, cursor.offset + 1));
    const tail = cursor.slot === currentSlot ? [] : currentBuffer;

    const events = head.concat(tail);

    if (this.options.debug?.logErrors) {
      if (cursor.slot !== currentSlot && head.length === 0) {
        logger.warn('Captured lead buffer cleared by multiple checkouts');
      }
    }

    if (events.length > 0) {
      events.push(Recorder._replayEndEvent());
    }

    return events;
  }

  /**
   * Creates a replay.end noop marker event.
   *
   * Helps the application correctly align playback when added at the end of
   * the recording.
   *
   * @returns {Object} replay.end event
   * @private
   */
  static _replayEndEvent() {
    return {
      type: EventType.Custom,
      timestamp: Date.now(),
      data: { tag: 'replay.end', payload: {} },
    };
  }

  /**
   * Logs an event for debugging purposes.
   *
   * @param {Object} event - The event to log
   * @param {boolean} isCheckout - Whether this is a checkout event
   * @private
   */
  static _logEvent(event, isCheckout) {
    logger.log(
      `Recorder: ${isCheckout ? 'checkout' : ''} event\n`,
      ((e) => {
        const seen = new WeakSet();
        return JSON.stringify(
          e,
          (_, v) => {
            if (typeof v === 'object' && v !== null) {
              if (seen.has(v)) return '[Circular]';
              seen.add(v);
            }
            return v;
          },
          2,
        );
      })(event),
    );
  }
}
