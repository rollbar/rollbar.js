import { record as rrwebRecordFn } from '@rrweb/record';
import { EventType } from '@rrweb/types';

import hrtime from '../../tracing/hrtime.js';
import logger from '../logger.js';

export default class Recorder {
  #options;
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

    this.#options = options ?? {};
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
    if (this.isRecording && newOptions.enabled === false) {
      this.stop();
    }

    this.#options = newOptions;
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
      logger.error('Recorder: Cannot dump less than 2 events.');
      return null;
    }

    const recordingSpan = tracing.startSpan('rrweb-replay-recording', {});

    recordingSpan.setAttribute('rollbar.replay.id', replayId);

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
          'rollbar.replay.id': replayId,
        },
        hrtime.fromMillis(event.timestamp),
      );
    }

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
      checkoutEveryNms: 5 * 60 * 1000, // 5 minutes
      errorHandler: (error) => {
        if (this.options.debug?.logErrors) {
          logger.error('Error during replay recording', error);
        }
        return true; // swallow the error instead of throwing it to the window
      },
      ...this.options,
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
}
