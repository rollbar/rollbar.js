var rollbarConfig = {
  accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
  captureUncaught: true,
  payload: {
    environment: 'development',
  }
};
var rollbar = require("expose?rollbar!../../dist/rollbar.commonjs.min.js"); // Use the expose-loader to expose the global
rollbar.init(rollbarConfig);
