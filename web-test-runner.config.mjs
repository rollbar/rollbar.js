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
      allowUncaught: false,
    },
  },

  concurrency: 4,
  concurrentBrowsers: 2,
};
