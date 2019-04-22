var rollbar = require('rollbar');

var rollbarConfig = {
  accessToken: 'POST_CLIENT_ITEM_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true,
  checkIgnore: function (_isUncaught, _args, payload) {
    // Example checkIgnore: take action and tell rollbar.js to ignore event if
    // condition is met, else return false.
    if (payload.body.message && payload.body.message.extra && payload.body.message.extra.storePayload) {
      // Example building fully prepared json from the payload object.
      window.jsonPayload = window.Rollbar.buildJsonPayload(payload);

      return true;
    }

    return false;
  }
};

window.Rollbar = new rollbar(rollbarConfig);

window.rollbarInfo = function rollbarInfo() {
  // Example log event using the rollbar object.
  Rollbar.info('webpack test log');
};

window.throwError = function throwError() {
  // Example error, which will be reported to rollbar when `captureUncaught`
  // is true in the config.
  throw new Error('webpack test error');
};

window.rollbarInfoWithExtra = function rollbarInfoWithExtra() {
  // Example log event with custom data.
  Rollbar.info('webpack test log', { storePayload: true });
};

window.sendJson = function sendJson() {
  // Example sending fully prepared json payload to Rollbar API.
  Rollbar.sendJsonPayload(window.jsonPayload);
};
