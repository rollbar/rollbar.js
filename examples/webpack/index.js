var rollbarConfig = {
  accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
  captureUncaught: true,
  payload: {
    environment: 'development',
  }
};

var rollbar = require("../../dist/rollbar.umd.min.js");
rollbar.init(rollbarConfig);
