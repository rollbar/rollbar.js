import { esbuildPlugin } from '@web/dev-server-esbuild';
import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  files: [
    'test/**/*.test.js',
    'test/**/*.test.ts',
    // Exclude server and React Native tests
    '!test/server.*.test.js',
    '!test/react-native.*.test.js',
  ],

  nodeResolve: true,

  plugins: [
    esbuildPlugin({
      ts: true,
    }),
  ],

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
