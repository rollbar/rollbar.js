var rollbarConfig = {
  accessToken: 'POST_CLIENT_ACCESS_TOKEN',
  captureUncaught: true,
  payload: {
    environment: 'development',
  }
};

var Rollbar = require('../../dist/rollbar.umd.min.js').init(rollbarConfig);
