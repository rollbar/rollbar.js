import { ReplayRecorder } from './recorder';

export function createReplayRecorder(rollbar) {
  if (!rollbar || !rollbar.options) {
    throw new Error('Rollbar instance is required to create a ReplayRecorder');
  }

  return new ReplayRecorder(rollbar.tracing, rollbar.options.replay);
}

// Export the classes for direct use if needed
export { ReplayRecorder };
