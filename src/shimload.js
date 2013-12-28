var config = {
  accessToken: 'ACCESS_TOKEN',
  captureUncaught: true
};

var defaultRollbarJsUrl = '//d37gvrvc0wt4s1.cloudfront.net/js/v1.0/rollbar.min.js';
var r = Rollbar.init(window, config);
r.loadFull(window, document, true, defaultRollbarJsUrl);
