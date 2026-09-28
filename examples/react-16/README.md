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
every change, then open `dev/index.html` in a browser. This keeps it separate
from the production `dist/` build that the rollbar.js tests load.

## For rollbar.js maintainers

`test/examples/react.test.ts` loads this app's production build from `dist/`,
which is not committed.

From the repository root, `npm run build:test-examples` packs the SDK's current
`dist/` and builds this app against it. Run `npm run build` first if you've
changed the SDK's source. `npm test` and CI run it before the browser tests.

The production build uses an absolute `publicPath`, `/examples/react-16/dist/`,
because the test loads the page from the repository root.
