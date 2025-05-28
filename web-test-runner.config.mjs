import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  browsers: [playwrightLauncher({ product: 'chromium' })],
  
  // Look for bundled test files
  files: 'test-dist/**/*.js',
  
  // Basic test framework config
  testFramework: {
    config: { 
      ui: 'bdd',
      timeout: 10000, // Match Karma timeout
    },
  },

  // Load test framework libraries globally (like Karma did)
  testRunnerHtml: testFramework => `
    <html>
      <body>
        <script src="/node_modules/chai/chai.js"></script>
        <script src="/node_modules/sinon/pkg/sinon.js"></script>
        <script src="/node_modules/expect.js/index.js"></script>
        <script>
          window.expect = chai.expect;
          window.assert = chai.assert;
        </script>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `,
};