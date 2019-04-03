var rollbar = require('rollbar');

var rollbarConfig = {
  accessToken: 'POST_CLIENT_ITEM_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true,
};

window.Rollbar = new rollbar(rollbarConfig);

window.rollbarInfo = function rollbarInfo() {
  // Example log event using the rollbar object.
  Rollbar.info('webpack test log');
};

window.throwError = function throwError() {
  // Example error, which will be reported to rollbar.
  throw new Error('webpack test error');
};
