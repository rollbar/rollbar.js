// Child process for the #1108 tests in server.rollbar.handlers.test.js.
// Installs Rollbar's process handlers and then throws or rejects, so the test
// can see what a developer (or nodemon) would see on stderr.
//
// Usage: unhandled.js <throw|reject> [app-listener|uninspectable]
// With `app-listener`, the app also registers its own no-op listeners, which
// is what switches Node's own printing off. With `uninspectable`, the thrown
// value's custom inspect method throws, and Rollbar's logger is left on so
// the test can see it report the failed print.
import process from 'node:process';
import util from 'node:util';

import Rollbar from '../../../src/server/rollbar.js';

const [, , mode, variant] = process.argv;

new Rollbar({
  accessToken: 'abc123',
  enabled: false,
  logLevel: variant === 'uninspectable' ? 'error' : 'disable',
  captureUncaught: true,
  captureUnhandledRejections: true,
});

if (variant === 'app-listener') {
  process.on('uncaughtException', function () {});
  process.on('unhandledRejection', function () {});
}

setTimeout(function () {
  const err = new Error(mode === 'reject' ? 'child reject' : 'child error');
  if (variant === 'uninspectable') {
    err[util.inspect.custom] = function () {
      throw new Error('inspect failed');
    };
  }
  if (mode === 'reject') {
    Promise.reject(err);
  } else {
    throw err;
  }
}, 10);
