<p align="center">
  <img alt="rollbar-logo" src="https://user-images.githubusercontent.com/3300063/207964480-54eda665-d6fe-4527-ba51-b0ab3f41f10b.png" />
</p>

<h1 align="center">Rollbar.js</h1>

<p align="center">
  <strong>Proactively discover, predict, and resolve errors in real-time with <a href="https://rollbar.com">Rollbar’s</a> error monitoring platform. <a href="https://rollbar.com/signup/">Start tracking errors today</a>!</strong>
</p>

![Build Status](https://github.com/rollbar/rollbar.js/workflows/Rollbar.js%20CI/badge.svg?tag=latest)
[![npm version](https://img.shields.io/npm/v/rollbar.svg)](https://www.npmjs.com/package/rollbar)
[![npm downloads](https://img.shields.io/npm/dm/rollbar.svg)](https://www.npmjs.com/package/rollbar)

---

## Key benefits of using Rollbar.js are:

- **Cross platform:** Rollbar.js supports both server-side and client-side Javascript, including frameworks such as <a href="https://docs.rollbar.com/docs/react-ts">React</a>, <a href="https://docs.rollbar.com/docs/angular">Angular</a>, <a href="https://docs.rollbar.com/docs/nodejs#using-express">Express</a>, <a href="https://docs.rollbar.com/docs/nextjs">Next.js</a> and more.
- **Telemetry:** The telemetry timeline provides a list of “breadcrumbs” events that can help developers understand and fix problems in their client-side javascript. <a href="https://docs.rollbar.com/docs/rollbarjs-telemetry">Learn more about telemetry</a>.
- **Automatic error grouping:** Rollbar aggregates Occurrences caused by the same error into Items that represent application issues. <a href="https://docs.rollbar.com/docs/grouping-occurrences">Learn more about reducing log noise</a>.
- **Advanced search:** Filter items by many different properties. <a href="https://docs.rollbar.com/docs/search-items">Learn more about search</a>.
- **Customizable notifications:** Rollbar supports several messaging and incident management tools where your team can get notified about errors and important events by real-time alerts. <a href="https://docs.rollbar.com/docs/notifications">Learn more about Rollbar notifications</a>.

## Installation

Using npm:

```bash
npm install --save rollbar
```

Using yarn:

```bash
yarn add rollbar
```

For CDN/script tag installation, see [Quick Start → Browser](#browser)

## Quick Start

First, [**sign up for a Rollbar account**](https://rollbar.com/signup) if you haven't already.

### Browser

For the recommended snippet-based installation with automatic error capture and telemetry, see our [Browser JS – Quick Start documentation](https://docs.rollbar.com/docs/browser-js#quick-start).

### Node.js

```javascript
const Rollbar = require('rollbar');

const rollbar = new Rollbar({
  accessToken: 'POST_SERVER_ITEM_ACCESS_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: { code_version: '1.0.0' },
});

// log a generic message and send to rollbar
rollbar.log('Hello world!');
```

For **framework** integrations (**Express**, **Koa**, **Hapi**, and more), custom error handlers, and advanced configuration, see our [Node.js server configuration documentation](https://docs.rollbar.com/docs/nodejs#server-configuration).

## Usage and Reference

For complete usage instructions and configuration reference, see our [Javascript SDK docs](https://docs.rollbar.com/docs/javascript).

### Examples

See the [examples directory](./examples/) for detailed integration examples with various frameworks and build tools including **React**, **Angular**, **Vue.js**, **Next.js**, and more.

## Release History & Changelog

See our [Releases](https://github.com/rollbar/rollbar.js/releases) page for a list of all releases, including changes.

## Help / Support

If you run into any issues, please email us at [support@rollbar.com](mailto:support@rollbar.com).

For bug reports, please [open an issue on GitHub](https://github.com/rollbar/rollbar.js/issues/new).

## Developing and Contributing

For development setup, guidelines, and instructions on submitting pull requests, please see our [Contributing Guide](CONTRIBUTING.md).
