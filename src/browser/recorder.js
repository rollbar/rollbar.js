import * as record from '@rrweb/record';

export default class Recorder {
  #options = {};

  #tracing = null;
  #stopFn = null;
  #earliestTimestamp = 0;
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

  // dump(context) {
  //   // Create a span for the recording session
  //   this.recordingSpan = this.tracing.startSpan('replay.recording');
  //   this.recordingSpan.startTime = earliestTimestamp;
  //   this.recordingSpan.endTime = events[-1].endTime;

  //   for event in events {
  //     this.recordingSpan.addEvent('rrweb-replay-events', {
  //       eventType: event.type,
  //       json: event.data,
  //     });
  //   }
  // }

  configure(options) {
    // ...
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

    this.stopFn = record.record({
      emit: (event, isCheckout) => {
        if (isCheckout) {
          this.#eventsMatrix.push([]);
        }

        // Add the event to the latest array in the matrix
        const lastEvents = this.#eventsMatrix[this.#eventsMatrix.length - 1];
        lastEvents.push(event);
      },
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
