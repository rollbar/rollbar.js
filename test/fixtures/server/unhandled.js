// Child process for the #1108 tests in server.rollbar.handlers.test.js.
// Installs Rollbar's process handlers and then throws or rejects, so the test
// can see what a developer (or nodemon) would see on stderr.
//
// Usage: unhandled.js <throw|reject> [app-listener]
// With `app-listener`, the app also registers its own no-op listeners, which
// is what switches Node's own printing off.
import process from 'node:process';

import Rollbar from '../../../src/server/rollbar.js';

new Rollbar({
  accessToken: 'abc123',
  enabled: false,
  logLevel: 'disable',
  captureUncaught: true,
  captureUnhandledRejections: true,
});

if (process.argv[3] === 'app-listener') {
  process.on('uncaughtException', function () {});
  process.on('unhandledRejection', function () {});
}

setTimeout(function () {
  if (process.argv[2] === 'reject') {
    Promise.reject(new Error('child reject'));
  } else {
    throw new Error('child error');
  }
}, 10);
