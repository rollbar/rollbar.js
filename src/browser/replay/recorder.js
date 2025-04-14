import * as record from '@rrweb/record';

export default class Recorder {
  #options = {};

  #tracing = null;
  #stopFn = null;
  #eventsMatrix = [[]];

  constructor(tracing, options) {
    console.log('Recorder: Initializing...');
    console.log('options', options);
    this.#tracing = tracing;
    this.#options = options ?? {};
  }

  get isRecording() {
    return this.#stopFn !== null;
  }

  get options() {
    return this.#options;
  }

  set options(newOptions) {
    this.#options = newOptions;
  }

  get events() {
    return this.#eventsMatrix.flat();
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
    if (!this.#tracing) {
      console.error(
        'Recorder.dump: Cannot dump events - tracing is not initialized',
      );
      return null;
    }

    const events = this.events;

    if (events.length === 0) {
      console.warn('Recorder.dump: No events to dump');
      return null;
    }

    console.log(`Recorder.dump: Dumping ${events.length} events`);

    const { earliestEvent, latestEvent } = events.reduce(
      (acc, event) => ({
        earliestEvent:
          event.timestamp < acc.earliestEvent.timestamp
            ? event
            : acc.earliestEvent,
        latestEvent:
          event.timestamp > acc.latestEvent.timestamp ? event : acc.latestEvent,
      }),
      { earliestEvent: events[0], latestEvent: events[0] },
    );

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

  configure(newOptions) {
    if (this.isRecording && newOptions.enabled === false) {
      this.stop();
    }

    this.options = newOptions;
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

    this.#eventsMatrix = [[]];

    this.#stopFn = record.record({
      emit: (event, isCheckout) => {
        if (isCheckout) {
          this.#eventsMatrix.push([]);
        }

        const lastEvents = this.#eventsMatrix[this.#eventsMatrix.length - 1];
        lastEvents.push(event);
      },
      checkoutEveryNms: 300000,
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
    this.#eventsMatrix = [[]];
    return this;
  }
}
