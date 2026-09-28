// Child process for the #1108 tests in server.rollbar.handlers.test.js.
// Installs Rollbar's process handlers and then throws or rejects, so the test
// can see what a developer (or nodemon) would see on stderr.
import process from 'node:process';

import Rollbar from '../../../src/server/rollbar.js';

new Rollbar({
  accessToken: 'abc123',
  enabled: false,
  logLevel: 'disable',
  captureUncaught: true,
  captureUnhandledRejections: true,
});

setTimeout(function () {
  if (process.argv[2] === 'reject') {
    Promise.reject(new Error('child reject'));
  } else {
    throw new Error('child error');
  }
}, 10);
