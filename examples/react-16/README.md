# React Rollbar Integration

This project demonstrates rollbar.js in a basic React app configuration.

## Rollbar configuration

To send live reports to Rollbar, replace `POST_CLIENT_ITEM_TOKEN` in index.js
with your valid client token before building your webpack bundle.

## Node modules

This example installs rollbar.js from `../rollbar.tgz`, a tarball of the local
SDK that is not checked in. Create it first by running this from the repository
root:

```
npm run pack
```

(`npm run build` at the root also creates it, after rebuilding `dist/`.)

Then run `npm install` in this directory to install node modules. If the
tarball is missing, npm fails with a misleading `ERESOLVE` error about
`rollbar@undefined` and the `@rollbar/react` peer dependency.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

Run `npm start` to build a development bundle into `dev/` and rebuild it on
every change, then open `dev/index.html` in a browser. This keeps the committed
`dist/` bundle untouched.

## Preparing for rollbar.js tests

(For rollbar.js maintainers)

Rollbar.js test automation includes tests that load and exercise this example app.
For those tests to work, main.js must be available and up to date in ./examples/react-16/dist/.
If the example app has changed or changes to rollbar.js need to be pulled in,
update and commit a new main.js.

```
# Build the rollbar.js dist if needed. This also creates examples/rollbar.tgz.
npm run build

# Prepare the example's npm bundle.
cd examples/react-16 && npm install

# Build the output files.
npm run build

# The rollbar.js dist is no longer needed, and can be reverted.
cd ../.. && git checkout dist
```
