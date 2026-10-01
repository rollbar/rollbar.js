# Webpack Rollbar Integration

This project demonstrates rollbar.js in a basic webpack configuration.

## Rollbar configuration

To send live reports to Rollbar, replace `POST_CLIENT_ITEM_TOKEN` in index.js
with your valid client token before building your webpack bundle.

## Node modules

Run `npm install` to install node modules.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## For rollbar.js maintainers

`test/examples/webpack.test.ts` loads `src/index.html`, which loads this app's
build from `dist/bundle.js`. The build is not committed.

From the repository root, `npm run build:test-examples` packs the SDK's current
`dist/` and builds this app against it. Run `npm run build` first if you've
changed the SDK's source. `npm test` and CI run it before the browser tests.
