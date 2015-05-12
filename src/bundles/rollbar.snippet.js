var RollbarShim = require('../shim').Rollbar;
var snippetCallback = require('../snippet_callback');

var defaultRollbarJsUrl = '//d37gvrvc0wt4s1.cloudfront.net/js/v1.2/rollbar.min.js';
_rollbarConfig.rollbarJsUrl = _rollbarConfig.rollbarJsUrl || defaultRollbarJsUrl;

var shim = RollbarShim.init(window, _rollbarConfig);
var callback = snippetCallback(shim, _rollbarConfig);

shim.loadFull(window, document, false, _rollbarConfig, callback);
