import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  files: [
    'test/**/*.test.js',
    // Exclude server and React Native tests
    '!test/server.*.test.js',
    '!test/react-native.*.test.js',
    // Exclude tests blocked by error-stack-parser ESM issue
    '!test/browser.core.test.js',
    '!test/browser.rollbar.test.js',
    '!test/browser.transforms.test.js',
    '!test/browser.replay.recorder.test.js',
    // Exclude tests that hang or have issues
    '!test/queue.test.js',
    '!test/notifier.test.js',
    '!test/telemetry.test.js',
    '!test/truncation.test.js',
    // Exclude unmigrated test directories
    '!test/replay/**/*.test.js',
    '!test/tracing/**/*.test.js',
    '!test/examples/**/*.test.js',
  ],

  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },

  browsers: [
    playwrightLauncher({
      product: 'chromium',
      launchOptions: {
        headless: true,
      },
    }),
  ],

  testFramework: {
    config: {
      ui: 'bdd',
      timeout: 5000,
      reporter: 'spec',
      allowUncaught: true,
    },
  },

  concurrency: 4,
  concurrentBrowsers: 2,
};
