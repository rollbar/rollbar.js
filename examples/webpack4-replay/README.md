# Webpack Rollbar Integration

This project demonstrates rollbar.js in a basic webpack configuration.

## Rollbar configuration

To send live reports to Rollbar, replace `POST_CLIENT_ITEM_TOKEN` in index.js
with your valid client token before building your webpack bundle.

## Node modules

Run `npm install` to install node modules.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Preparing for rollbar.js tests

(For rollbar.js maintainers)

Rollbar.js test automation includes tests that load and exercise this example app.
For those tests to work, the webpack bundle.js must be available and up to date in ./examples/webpack/dist/.
If the example app has changed or changes to rollbar.js need to be pulled in,
update and commit a new bundle.js.

```
# Build the rollbar.js dist if needed.
npm run build

# Prepare the example's npm bundle.
cd examples/webpack && npm install

# Build the webpack output files.
npm run build

# The rollbar.js dist is no longer needed, and can be reverted.
cd ../.. && git checkout dist
```
