import Rollbar from 'rollbar/replay';

const rollbarConfig = {
  accessToken: 'POST_CLIENT_ITEM_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true,
  replay: {
    enabled: true,
    autoStart: true,
  },
  checkIgnore: (_isUncaught, _args, payload) => {
    // Example checkIgnore: take action and tell rollbar.js to ignore event if
    // condition is met, else return false.
    if (
      payload.body.message &&
      payload.body.message.extra &&
      payload.body.message.extra.storePayload
    ) {
      // Example building fully prepared json from the payload object.
      window.jsonPayload = rollbar.buildJsonPayload(payload);

      return true;
    }

    return false;
  },
};

const rollbar = new Rollbar(rollbarConfig);
window.Rollbar = rollbar;

window.rollbarInfo = () => {
  // Example log event using the rollbar object.
  rollbar.info('webpack test log');
};

window.throwError = () => {
  // Example error, which will be reported to rollbar when `captureUncaught`
  // is true in the config.
  throw new Error('webpack test error');
};

window.rollbarInfoWithExtra = () => {
  // Example log event with custom data.
  rollbar.info('webpack test log', { storePayload: true });
};

window.sendJson = () => {
  // Example sending fully prepared json payload to Rollbar API.
  rollbar.sendJsonPayload(window.jsonPayload);
};
