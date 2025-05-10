import { record as rrwebRecordFn } from '@rrweb/record';
import { EventType } from '@rrweb/types';

import hrtime from '../../tracing/hrtime.js';

export default class Recorder {
  #tracing;
  #options;
  #stopFn = null;
  #recordFn;
  #events = {
    previous: [],
    current: [],
  };

  constructor(tracing, options, recordFn = rrwebRecordFn) {
    if (!tracing) {
      throw new TypeError("Expected 'tracing' to be provided");
    }

    if (!recordFn) {
      throw new TypeError("Expected 'recordFn' to be provided");
    }

    console.log('Recorder: Initializing...');
    console.log('options', options);

    this.#tracing = tracing;
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
   * Dumps the recorded events into a span that can be exported
   * Creates a span for the recording session and adds all events as span events
   *
   * @param {Object} context - The tracing context to use for the span
   * @param {Object} [options] - Options for dumping
   * @param {boolean} [options.clear=false] - Whether to clear the events after dumping
   * @returns {Object} The created span
   */
  dump(context, options = {}) {
    const events = this.#events.previous.concat(this.#events.current);

    if (events.length === 0) {
      console.warn('Recorder.dump: No events to dump');
      return null;
    }

    console.log(`Recorder.dump: Dumping ${events.length} events`);

    const recordingSpan = this.#tracing.startSpan(
      'rrweb-replay-recording',
      {},
      context,
    );

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

    if (options.clear) {
      this.clear();
    }

    return recordingSpan;
  }

  start() {
    if (this.isRecording || this.options.enabled === false) {
      if (this.isRecording) {
        console.log('Recorder: Already started');
      } else {
        console.log('Recorder: Disabled');
      }
      return;
    }

    console.log('Recorder: Starting...');

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
      ...this.options,
    });

    console.log('Recorder: Started');

    return this;
  }

  stop() {
    if (!this.isRecording) {
      console.log('Recorder: Already stopped');
      return;
    }

    console.log('Recorder: Stopping...');

    this.#stopFn();
    this.#stopFn = null;

    console.log('Recorder: Stopped');

    return this;
  }

  clear() {
    this.#events = {
      previous: [],
      current: [],
    };
  }

  _logEvent(event, isCheckout) {
    console.log(
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
