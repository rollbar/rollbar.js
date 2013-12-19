var config = {
  accessToken: 'ACCESS_TOKEN',
  captureUncaught: true
};

var r = Rollbar.init(window, config);
r.loadFull(window, document);
