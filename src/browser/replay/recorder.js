import { record as rrwebRecordFn } from '@rrweb/record';

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
   * Find the earliest and latest events in a list of events based on timestamp
   *
   * @param {Array} events - Array of events with timestamp property
   * @returns {Object} Object containing the earliest and latest events
   */
  findEventBoundaries(events) {
    if (!events || events.length === 0) {
      return { earliest: null, latest: null };
    }

    return events.reduce(
      (acc, e) => ({
        earliest: e.timestamp < acc.earliest.timestamp ? e : acc.earliest,
        latest: e.timestamp > acc.latest.timestamp ? e : acc.latest,
      }),
      { earliest: events[0], latest: events[0] },
    );
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

    const { earliest: earliestEvent, latest: latestEvent } =
      this.findEventBoundaries(events);

    console.log(`Recorder.dump: Earliest event: ${earliestEvent}`);
    console.log(`Recorder.dump: Latest event: ${latestEvent}`);

    const recordingSpan = this.#tracing.startSpan(
      'rrweb-replay-recording',
      {},
      context,
    );

    for (const event of events) {
      recordingSpan.addEvent(
        'rrweb-replay-events',
        {
          eventType: event.type,
          json: JSON.stringify(event.data),
        },
        event.timestamp ? recordingSpan.toHrTime(event.timestamp) : null,
      );
    }

    if (earliestEvent) {
      recordingSpan.span.startTime = recordingSpan.toHrTime(
        earliestEvent.timestamp,
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

        if (isCheckout) {
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
