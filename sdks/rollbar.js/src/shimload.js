var config = {
  accessToken: 'ACCESS_TOKEN',
  captureUncaught: true
};

Rollbar.init(window, config);
Rollbar.load(window, document);
