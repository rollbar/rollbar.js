import { ReplayRecorder } from './recorder';

export function createReplayRecorder(rollbar) {
  if (!rollbar || !rollbar.options) {
    throw new Error('Rollbar instance is required to create a ReplayRecorder');
  }
  
  if (!rollbar.tracing) {
    throw new Error('Tracing must be available to create a ReplayRecorder');
  }
  
  const options = rollbar.options.replay || {};
  return new ReplayRecorder(rollbar.tracing, options);
}

// Export the classes for direct use if needed
export { ReplayRecorder };