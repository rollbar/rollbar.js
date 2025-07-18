# Rollbar.js Integration Examples

This directory contains examples demonstrating various ways to integrate Rollbar.js into different JavaScript environments and frameworks.

## Integration Compatibility Matrix

The following table shows all supported integration methods across different platforms:

| Environment | Script Tag | CommonJS | ESM Import | TypeScript | AMD |
|-------------|------------|----------|------------|------------|-----|
| **Browser** | ✅ [script.html](./script.html) | — | ✅ via bundler | ✅ via bundler | ✅ [requirejs/](./requirejs/) |
| **Node.js** | — | ✅ `require('rollbar')` | ✅ `import` | ✅ | — |
| **React** | ✅ | ✅ [react/](./react/) | ✅ | ✅ | — |
| **Angular** | — | — | ✅ [angular/](./angular/) | ✅ | — |
| **Vue.js** | ✅ | ✅ | ✅ [vuejs3/](./vuejs3/) | ✅ | — |
| **Next.js** | — | ✅ SSR/Client | ✅ SSR/Client | ✅ | — |
| **Browser Extension** | ✅ [v2](./browser_extension_v2/), [v3](./browser_extension_v3/) | — | ✅ | ✅ | — |

## Quick Start

Each example includes its own README with specific setup instructions. Common patterns:

### Browser (Script Tag)
```html
<script src="https://cdn.rollbar.com/rollbarjs/refs/tags/v2.26.4/rollbar.min.js"></script>
<script>
  var _rollbarConfig = {
    accessToken: "YOUR_ACCESS_TOKEN",
    captureUncaught: true,
    captureUnhandledRejections: true
  };
</script>
```

### Node.js / CommonJS
```javascript
const Rollbar = require('rollbar');
const rollbar = new Rollbar({
  accessToken: 'YOUR_ACCESS_TOKEN',
  environment: 'production'
});
```

### ES Modules / TypeScript
```javascript
import Rollbar from 'rollbar';
const rollbar = new Rollbar({
  accessToken: 'YOUR_ACCESS_TOKEN',
  environment: 'production'
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

Rollbar.js provides different entry points for different environments:

- **Main package**: `require('rollbar')` or `import Rollbar from 'rollbar'`
  - Node.js: `src/server/rollbar.js`
  - Browser (with bundler): `dist/rollbar.umd.min.js`

- **Direct imports - Source files** (ES modules):
  - `rollbar/src/server/rollbar.js` - Server-side source
  - `rollbar/src/browser/rollbar.js` - Browser-side source
  - `rollbar/src/react-native/rollbar.js` - React Native source

- **Direct imports - Distribution files** (pre-built bundles):
  - `rollbar/dist/rollbar.umd.js` - Universal (CommonJS/AMD/global)
  - `rollbar/dist/rollbar.umd.min.js` - Universal minified
  - `rollbar/dist/rollbar.js` - Vanilla (script tag only)
  - `rollbar/dist/rollbar.min.js` - Vanilla minified
  - `rollbar/dist/rollbar.snippet.js` - Async snippet loader
  - `rollbar/dist/rollbar.named-amd.js` - AMD/RequireJS

- **CDN**: `https://cdn.rollbar.com/rollbarjs/refs/tags/vVERSION/rollbar.min.js`
