import * as record from '@rrweb/record';

export class ReplayRecorder {
  constructor(options = {}) {
    this.options = {
      // Default replay options
      checkoutEveryNms: 5 * 60 * 1000, // Checkout every 5 minutes (for time-based approach)
      blockClass: 'rr-block',
      maskTextClass: 'rr-mask',
      maskInputs: true,
      recordCanvas: false,
      // Override with user options
      ...options
    };
    
    // We use a two-dimensional array to store events by checkpoint
    this.eventsMatrix = [[]];
    this.stopFn = null;
    this.isRecording = false;
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
      ...this.options
    });
    
    this.isRecording = true;
    return this;
  }

  stop() {
    if (!this.isRecording || !this.stopFn) {
      return;
    }
    
    this.stopFn();
    this.isRecording = false;
    this.stopFn = null;
    return this;
  }

  // Get all recorded events flattened into a single array
  getAllEvents() {
    return this.eventsMatrix.flat();
  }

  // Get last N minutes of events (approximately)
  // This returns the last 1-2 checkpoints which should cover roughly the requested time
  getLastNMinutes(minutes = 5) {
    const checkpointsToInclude = Math.max(
      2, // Always include at least 2 checkpoints for proper replay
      Math.ceil((minutes * 60 * 1000) / this.options.checkoutEveryNms)
    );
    
    // Get the last N checkpoints (or all if we have fewer)
    const startIdx = Math.max(0, this.eventsMatrix.length - checkpointsToInclude);
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