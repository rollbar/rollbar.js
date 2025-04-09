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

  // Get last N minutes of events (approximately)
  // This returns the last 1-2 checkpoints which should cover roughly the requested time
  getLastNMinutes(minutes = 5) {
    const checkpointsToInclude = Math.max(
      2, // Always include at least 2 checkpoints for proper replay
      Math.ceil((minutes * 60 * 1000) / this.options.checkoutEveryNms),
    );

    // Get the last N checkpoints (or all if we have fewer)
    const startIdx = Math.max(
      0,
      this.eventsMatrix.length - checkpointsToInclude,
    );
    const relevantCheckpoints = this.eventsMatrix.slice(startIdx);

    // Flatten the checkpoints into a single array of events
    return relevantCheckpoints.flat();
  }

  // Get the events since the last checkpoint
  // This is useful for getting just the most recent events
  getRecentEvents() {
    if (this.eventsMatrix.length === 0) {
      return [];
    }
    return this.eventsMatrix[this.eventsMatrix.length - 1];
  }

  // Get the latest N checkpoints of events
  getLatestCheckpoints(count = 2) {
    const startIdx = Math.max(0, this.eventsMatrix.length - count);
    return this.eventsMatrix.slice(startIdx).flat();
  }

  clear() {
    this.eventsMatrix = [[]];
    return this;
  }
}
