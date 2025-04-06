import { ReplayRecorder } from './recorder';
import { TracingReplayIntegration } from './tracingIntegration';

export function createReplayRecorder(rollbar) {
  if (!rollbar || !rollbar.options) {
    throw new Error('Rollbar instance is required to create a ReplayRecorder');
  }
  
  const options = rollbar.options.replay || {};
  
  // If tracing is available, create the integration
  if (rollbar.tracing) {
    return new TracingReplayIntegration(rollbar.tracing, options);
  }
  
  // Fallback to basic recorder if tracing isn't available
  return new ReplayRecorder(options);
}

// Export the classes for direct use if needed
export { ReplayRecorder, TracingReplayIntegration };