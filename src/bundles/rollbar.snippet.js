var Rollbar = require('../shim');

var defaultRollbarJsUrl = '//d37gvrvc0wt4s1.cloudfront.net/js/v1.2/rollbar.min.js';
_rollbarConfig.rollbarJsUrl = _rollbarConfig.rollbarJsUrl || defaultRollbarJsUrl;

var client = Rollbar.init(window, _rollbarConfig);
client.loadFull(window, document, false, _rollbarConfig);


