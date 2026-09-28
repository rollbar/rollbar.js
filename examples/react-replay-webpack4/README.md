# React Rollbar Integration

This project demonstrates rollbar.js in a basic React app configuration.

## Rollbar configuration

To send live reports to Rollbar, replace `POST_CLIENT_ITEM_TOKEN` in index.js
with your valid client token before building your webpack bundle.

## Node modules

Run `npm install` to install node modules.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

Run `npm run start` to launch index.html in a browser.

## For rollbar.js maintainers

`dist/` is not committed. CI's `npm run validate:examples` installs and builds
this example against the current SDK, which checks that webpack 4 still resolves
`rollbar/replay` through `replay/package.json`.

The production build uses an absolute `publicPath`,
`/examples/react-replay-webpack4/dist/`, so a browser test can load it from the
repository root the way `test/examples/react.test.ts` loads `react-16`.
