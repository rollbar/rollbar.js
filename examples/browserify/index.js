var rollbar = require('rollbar');

var rollbarConfig = {
  accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
  captureUncaught: true,
  payload: {
    environment: 'development',
  },
};

var Rollbar = rollbar.init(rollbarConfig);

window.Rollbar = Rollbar;
