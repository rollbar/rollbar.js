import { ReplayRecorder } from './recorder';

export class TracingReplayIntegration {
  constructor(tracing, options = {}) {
    this.tracing = tracing;
    this.recorder = new ReplayRecorder(options.replay || {});
    this.options = {
      // Enable replay integration
      enabled: true,
      // Associate replay events with spans
      associateWithSpans: true,
      // Start recording automatically
      autoStart: true,
      // Number of checkpoints to include when getting recordings
      includeCheckpoints: 2,
      ...options
    };
    
    // Holds the current session ID when recording started
    this.sessionId = null;
    
    if (this.options.enabled && this.options.autoStart) {
      this.start();
    }
  }

  start() {
    if (!this.options.enabled) {
      return this;
    }
    
    // Get the current session ID from tracing
    if (this.tracing && this.tracing.session) {
      this.tracing.session.init();
      this.sessionId = this.tracing.session.session.id;
    }
    
    // Start replay recording
    this.recorder.start();
    
    // Create a span for the recording session if tracing is available
    if (this.tracing && this.options.associateWithSpans) {
      this.recordingSpan = this.tracing.startSpan('replay.recording', {
        attributes: {
          'replay.sessionId': this.sessionId,
          'replay.startTime': Date.now()
        }
      });
    }
    
    return this;
  }

  stop() {
    this.recorder.stop();
    
    // End the recording span if it exists
    if (this.recordingSpan) {
      this.recordingSpan.end();
      this.recordingSpan = null;
    }
    
    return this;
  }

  getSessionEvents() {
    return {
      sessionId: this.sessionId,
      events: this.recorder.getAllEvents()
    };
  }

  getLastNMinutes(minutes = 5) {
    return {
      sessionId: this.sessionId,
      events: this.recorder.getLastNMinutes(minutes)
    };
  }
  
  getLatestCheckpoints(count = 2) {
    return {
      sessionId: this.sessionId,
      events: this.recorder.getLatestCheckpoints(count)
    };
  }
}