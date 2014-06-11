var rollbar = require('../../dist/rollbar.require.min.js');

var rollbarConfig = {
  accessToken: 'POST_CLIENT_ACCESS_TOKEN',
  captureUncaught: true,
  payload: {
    environment: 'development',
  }
};
rollbar.init(rollbarConfig);
window.rollbar = rollbar;
