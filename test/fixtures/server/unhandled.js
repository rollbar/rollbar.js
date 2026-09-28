// Child process for the #1108 tests in server.rollbar.handlers.test.js.
// Installs Rollbar's process handlers and then throws or rejects, so the test
// can see what a developer (or nodemon) would see on stderr.
//
// Usage: unhandled.js <throw|reject> [variant]
// Variants:
//   app-listener   The app also registers its own no-op listeners, which is
//                  what switches Node's own printing off.
//   app-once       As app-listener, but with `process.once`, registered
//                  before Rollbar's listeners.
//   domain         Node's `domain` module is loaded before Rollbar.
//   uninspectable  The thrown value's custom inspect method throws.
//   no-inspect     `util.inspect` throws, so only the stack is available.
//   unprintable    `util.inspect` throws and the value has no stack.
//   string         The thrown value or rejection reason is a plain string.
// For the last three, Rollbar's logger is left on so the test can see whether
// it reports a failed print.
import process from 'node:process';
import util from 'node:util';

import Rollbar from '../../../src/server/rollbar.js';

const [, , mode, variant] = process.argv;
const inspectFails = ['no-inspect', 'unprintable'].includes(variant);

if (variant === 'app-once') {
  process.once('uncaughtException', function () {});
  process.once('unhandledRejection', function () {});
}
if (variant === 'domain') {
  await import('node:domain');
}

new Rollbar({
  accessToken: 'abc123',
  enabled: false,
  logLevel:
    variant === 'uninspectable' || inspectFails ? 'error' : 'disable',
  captureUncaught: true,
  captureUnhandledRejections: true,
});

if (variant === 'app-listener') {
  process.on('uncaughtException', function () {});
  process.on('unhandledRejection', function () {});
}

setTimeout(function () {
  const message = mode === 'reject' ? 'child reject' : 'child error';
  let err = new Error(message);
  if (variant === 'unprintable') {
    err = { message };
  } else if (variant === 'string') {
    err = message;
  }
  if (variant === 'uninspectable') {
    err[util.inspect.custom] = function () {
      throw new Error('inspect failed');
    };
  }
  if (inspectFails) {
    util.inspect = Object.assign(
      function () {
        throw new Error('inspect failed');
      },
      { defaultOptions: util.inspect.defaultOptions },
    );
  }
  if (mode === 'reject') {
    Promise.reject(err);
  } else {
    throw err;
  }
}, 10);
