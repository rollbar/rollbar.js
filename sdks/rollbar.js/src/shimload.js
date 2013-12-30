var defaultRollbarJsUrl = '//d37gvrvc0wt4s1.cloudfront.net/js/v1.0/rollbar.min.js';
var r = Rollbar.init(window, _rollbarConfig);
r.loadFull(window, document, true, defaultRollbarJsUrl);
