var rollbar = require('../dist/rollbar.require.js');

var rollbarConfig = {
  accessToken: '...',
  captureUncaught: true,
  payload: {
    environment: 'development',
  }
};
rollbar.init(rollbarConfig);
window.rollbar = rollbar;
