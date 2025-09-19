import { record as rrwebRecordFn } from '@rrweb/record';
import { EventType } from '@rrweb/types';

import hrtime from '../../tracing/hrtime.js';
import logger from '../logger.js';

export default class Recorder {
  #options;
  #rrwebOptions;
  #stopFn = null;
  #recordFn;
  #events = {
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
    this.#recordFn = recordFn;
  }

  get isRecording() {
    return this.#stopFn !== null;
  }

  get options() {
    return this.#options;
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
    this.#options = { enabled, autoStart, maxSeconds, triggers, debug };
    this.#rrwebOptions = rrwebOptions;

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
   * Converts recorded events into a formatted payload ready for transport.
   *
   * This method takes the recorder's stored events, creates a new span with the
   * provided tracing context, attaches all events with their timestamps as span
   * events, and then returns a payload ready for transport to the server.
   *
   * @param {Object} tracing - The tracing system instance to create spans
   * @param {string} replayId - Unique identifier to associate with this replay recording
   * @returns {Object|null} A formatted payload containing spans data in OTLP format, or null if no events exist
   */
  dump(tracing, replayId, occurrenceUuid) {
    const events = this.#events.previous.concat(this.#events.current);

    if (events.length < 2) {
      logger.error('Replay recording cannot have less than 2 events');
      return null;
    }

    const recordingSpan = tracing.startSpan('rrweb-replay-recording', {});

    recordingSpan.setAttributes({
      ...(tracing.session?.attributes ?? {}),
      'rollbar.replay.id': replayId,
    });

    if (occurrenceUuid) {
      recordingSpan.setAttribute('rollbar.occurrence.uuid', occurrenceUuid);
    }

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

    this._addEndEvent(recordingSpan, replayId);

    recordingSpan.end();

    return tracing.exporter.toPayload();
  }

  start() {
    if (this.isRecording || this.options.enabled === false) {
      return;
    }

    this.clear();

    this.#stopFn = this.#recordFn({
      emit: (event, isCheckout) => {
        if (this.options.debug?.logEmits) {
          this._logEvent(event, isCheckout);
        }

        if (isCheckout && event.type === EventType.Meta) {
          this.#events.previous = this.#events.current;
          this.#events.current = [];
        }

        this.#events.current.push(event);
      },
      checkoutEveryNms: this.checkoutEveryNms(),
      errorHandler: (error) => {
        if (this.options.debug?.logErrors) {
          logger.error('Error during replay recording', error);
        }
        return true; // swallow the error instead of throwing it to the window
      },
      ...this.#rrwebOptions,
    });

    return this;
  }

  stop() {
    if (!this.isRecording) {
      return;
    }

    this.#stopFn();
    this.#stopFn = null;

    return this;
  }

  clear() {
    this.#events = {
      previous: [],
      current: [],
    };
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

  /**
   * Helps the application correctly align playback by adding a noop event
   * to the end of the recording.
   **/
  _addEndEvent(recordingSpan, replayId) {
    recordingSpan.addEvent(
      'rrweb-replay-events',
      {
        eventType: 5,
        json: JSON.stringify({ tag: 'replay.end', payload: {} }),
      },
      hrtime.fromMillis(Date.now()),
    );
  }
}
