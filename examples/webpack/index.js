var rollbarConfig = {
  accessToken: 'POST_CLIENT_ACCESS_TOKEN',
  captureUncaught: true,
  payload: {
    environment: 'development',
  }
};

var rollbar = require('../../dist/rollbar.umd');
var Rollbar = new rollbar(rollbarConfig);
