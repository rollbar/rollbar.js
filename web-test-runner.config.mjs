import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  files: 'test/**/*.test.js',
  exclude: ['test/server.*.test.js', 'test/react-native.*.test.js'],

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
