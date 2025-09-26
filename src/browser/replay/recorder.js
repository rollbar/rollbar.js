import { record as rrwebRecordFn } from '@rrweb/record';
import { EventType } from '@rrweb/types';

import hrtime from '../../tracing/hrtime.js';
import logger from '../../logger.js';

export default class Recorder {
  _options;
  _rrwebOptions;
  _stopFn = null;
  _recordFn;
  _events = {
    previous: [],
    current: [],
  };

  /**
   * Creates a new Recorder instance for capturing DOM events
   *
   * @param {Object} options - Configuration options for the recorder
   * @param {Function} [recordFn=rrwebRecordFn] - The recording function to use
   */
  constructor(options, recordFn = rrwebRecordFn) {
    if (!recordFn) {
      throw new TypeError("Expected 'recordFn' to be provided");
    }

    this.options = options;
    this._recordFn = recordFn;
    this._isReady = false;
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
      triggers,
      debug,

      // disallowed rrweb options
      emit,
      checkoutEveryNms,

      // rrweb options
      ...rrwebOptions
    } = newOptions;
    this._options = { enabled, autoStart, maxSeconds, triggers, debug };
    this._rrwebOptions = rrwebOptions;

    if (this.isRecording && newOptions.enabled === false) {
      this.stop();
    }
  }

  checkoutEveryNms() {
    // Recording may be up to two checkout intervals, therefore the checkout
    // interval is set to half of the maxSeconds.
    return ((this.options.maxSeconds || 10) * 1000) / 2;
  }

  /**
   * Exports the recording span with all recorded events.
   *
   * This method takes the recorder's stored events, creates a new span with the
   * provided tracing context, attaches all events with their timestamps as span
   * events, and exports the span to the tracing exporter. This is a side-effect
   * function that doesn't return anything - the span is exported internally.
   *
   * @param {Object} tracing - The tracing system instance to create spans
   * @param {Object} attributes - Attributes to add to the span
   *  (e.g., rollbar.replay.id, rollbar.occurrence.uuid)
   */
  exportRecordingSpan(tracing, attributes = {}) {
    const events = this._collectEvents();

    if (events.length < 3) {
      // TODO(matux): improve how we consider a recording valid
      throw new Error('Replay recording cannot have less than 3 events');
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
        if (!this._ready && event.type === EventType.FullSnapshot) {
          this._isReady = true;
        }
        if (this.options.debug?.logEmits) {
          this._logEvent(event, isCheckout);
        }

        if (isCheckout && event.type === EventType.Meta) {
          this._events.previous = this._events.current;
          this._events.current = [];
        }

        this._events.current.push(event);
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
    this._events = {
      previous: [],
      current: [],
    };
    this._isReady = false;
  }

  _collectEvents() {
    const events = this._events.previous.concat(this._events.current);

    // Helps the application correctly align playback by adding a noop event
    // to the end of the recording.
    events.push({
      timestamp: Date.now(),
      type: EventType.Custom,
      data: { tag: 'replay.end', payload: {} },
    });

    return events;
  }

  _logEvent(event, isCheckout) {
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
