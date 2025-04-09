import * as record from '@rrweb/record';
import { Tracing } from '../../tracing/tracing';

export class ReplayRecorder {
  tracing = null;
  options = {};
  stopFn = null;

  #eventsMatrix = [[]];
  #recordingSpan = null;

  constructor(tracing, options) {
    if (!(tracing instanceof Tracing)) {
      throw new Error('tracing must be an instance of Tracing');
    }

    this.tracing = tracing;
    this.options = options ?? {};
  }

  get isRecording() {
    return this.recordingSpan !== null;
  }

  get events() {
    return this.eventsMatrix.flat();
  }

  start() {
    if (this.isRecording) {
      return;
    }

    // Reset events matrix when starting recording
    this.eventsMatrix = [[]];

    this.stopFn = record.record({
      emit: (event, isCheckout) => {
        // If this is a checkout event, start a new array in the matrix
        if (isCheckout) {
          this.eventsMatrix.push([]);
        }

        // Add the event to the latest array in the matrix
        const lastEvents = this.eventsMatrix[this.eventsMatrix.length - 1];
        lastEvents.push(event);
      },
      checkoutEveryNms: this.options.checkoutEveryNms,
      ...this.options,
    });

    // Create a span for the recording session
    this.recordingSpan = this.tracing.startSpan('replay.recording');

    return this;
  }

  stop() {
    if (!this.isRecording || !this.stopFn) {
      return;
    }

    this.stopFn();
    this.stopFn = null;

    // End the recording span if it exists
    if (this.recordingSpan) {
      this.recordingSpan.end();
      this.recordingSpan = null;
    }

    return this;
  }

  clear() {
    this.eventsMatrix = [[]];
    return this;
  }
}
