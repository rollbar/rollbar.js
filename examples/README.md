# Rollbar.js Integration Examples

This directory contains examples demonstrating various ways to integrate Rollbar.js into different JavaScript environments and frameworks.

## Integration Compatibility Matrix

The following table shows all supported integration methods across different platforms:

| Environment           | Script Tag                                                      | CommonJS                | ESM Import                                                                                                                                   | TypeScript     | AMD                           |
| --------------------- | --------------------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ----------------------------- |
| **Browser**           | ✅ [script.html](./script.html)<br>✅ [snippet.html](./snippet.html) | —                       | ✅ via bundler                                                                                                                               | ✅ via bundler | ✅ [requirejs/](./requirejs/) |
| **Node.js**           | —                                                               | ✅ `require('rollbar')` | ✅ [`import`](https://github.com/rollbar/rollbar.js/blob/6bc51c1840a6fed64e40fa4e6481f5bc990f82d0/examples/README.md#es-modules--typescript) | ✅             | —                             |
| **React Native**      | —                                                               | ✅                      | ✅                                                                                                                                           | ✅             | —                             |
| **React**             | ✅                                                              | ✅ [react/](./react/)   | ✅                                                                                                                                           | ✅             | —                             |
| **Angular**           | —                                                               | —                       | ✅ [angular/](./angular/)                                                                                                                    | ✅             | —                             |
| **Vue.js**            | ✅                                                              | ✅                      | ✅ [vuejs3/](./vuejs3/)                                                                                                                      | ✅             | —                             |
| **Next.js**           | —                                                               | ✅ SSR/Client           | ✅ SSR/Client                                                                                                                                | ✅             | —                             |
| **Browser Extension** | ✅ [v2](./browser_extension_v2/), [v3](./browser_extension_v3/) | —                       | ✅                                                                                                                                           | ✅             | —                             |

## Quick Start

First, [sign up for a Rollbar account](https://rollbar.com/signup) if you haven't already. Each example includes its own README with specific setup instructions.

Common patterns:

### Browser (Script Tag)

For the recommended snippet-based installation with automatic error capture and telemetry, see our [Browser JS – Quick Start documentation](https://docs.rollbar.com/docs/browser-js#quick-start).

### Node.js / CommonJS

```javascript
const Rollbar = require('rollbar');

const rollbar = new Rollbar({
  accessToken: 'POST_SERVER_ITEM_ACCESS_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: { code_version: '1.0.0' },
});
```

### ES Modules / TypeScript

```javascript
import Rollbar from 'rollbar';

const rollbar = new Rollbar({
  accessToken: 'POST_SERVER_ITEM_ACCESS_TOKEN',
  environment: 'production',
});
```

## Available Examples

### Framework Examples

- **[angular/](./angular/)** - Angular 18+ with TypeScript and error handlers
- **[react/](./react/)** - React with error boundaries
- **[vuejs3/](./vuejs3/)** - Vue.js 3 with Vite

### Build Tool Examples

- **[browserify/](./browserify/)** - Browserify bundler integration
- **[webpack/](./webpack/)** - Webpack bundler configuration
- **[requirejs/](./requirejs/)** - AMD/RequireJS loader

### Environment Examples

- **[universal-browser/](./universal-browser/)** - Isomorphic JavaScript (browser)
- **[universal-node/](./universal-node/)** - Isomorphic JavaScript (Node.js)
- **[browser_extension_v2/](./browser_extension_v2/)** - Chrome extension (Manifest V2)
- **[browser_extension_v3/](./browser_extension_v3/)** - Chrome extension (Manifest V3)
- **[no-conflict/](./no-conflict/)** - Using Rollbar with noConflict mode

### Basic Examples

- **[snippet.html](./snippet.html)** - Async snippet integration
- **[script.html](./script.html)** - Direct script tag
- **[error.html](./error.html)** - Error handling examples
- **[test.html](./test.html)** - Test page
- **[itemsPerMinute.html](./itemsPerMinute.html)** - Rate limiting demo
- **[csp-errors.html](./csp-errors.html)** - Content Security Policy testing
- **[include_custom_object.html](./include_custom_object.html)** - Custom data example

## Testing Examples

To test these examples with your local Rollbar.js build:

1. Build the library:

   ```bash
   npm run build
   ```

2. For Node.js examples:

   ```bash
   cd examples/universal-node
   npm install
   npm start
   ```

3. For browser examples, start a local server:
   ```bash
   python3 -m http.server 8000
   # Visit http://localhost:8000/examples/
   ```

## Package Entry Points

Rollbar.js uses conditional exports to provide the right module format for each environment:

### Automatic Resolution (Recommended)

When you use `require('rollbar')` or `import Rollbar from 'rollbar'`, you automatically get:

- **Node.js**:
  - `import` → ES module (`src/server/rollbar.js`)
  - `require()` → CommonJS wrapper (`src/server/rollbar.cjs`)
- **Browsers/Bundlers**:
  - `import` → ES module (`src/browser/rollbar.js`)
  - `require()` → UMD bundle (`dist/rollbar.umd.min.js`)
- **TypeScript**: Type definitions from `index.d.ts`

### Direct Imports - Source Files (ES modules)

- `rollbar/src/server/rollbar.js` - Server-side source
- `rollbar/src/browser/rollbar.js` - Browser-side source
- `rollbar/src/react-native/rollbar.js` - React Native source

### Direct Imports - Distribution Files (Pre-built bundles)

- `rollbar/dist/rollbar.umd.js` - Universal (CommonJS/AMD/global)
- `rollbar/dist/rollbar.umd.min.js` - Universal minified
- `rollbar/dist/rollbar.js` - Vanilla (script tag only)
- `rollbar/dist/rollbar.min.js` - Vanilla minified
- `rollbar/dist/rollbar.snippet.js` - Async snippet loader
- `rollbar/dist/rollbar.named-amd.js` - AMD/RequireJS
