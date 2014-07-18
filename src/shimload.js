var defaultRollbarJsUrl = '//d37gvrvc0wt4s1.cloudfront.net/js/v1.1/rollbar.min.js';
_rollbarConfig.rollbarJsUrl = _rollbarConfig.rollbarJsUrl || defaultRollbarJsUrl;
var r = Rollbar.init(window, _rollbarConfig);
r.loadFull(window, document, false, _rollbarConfig);
