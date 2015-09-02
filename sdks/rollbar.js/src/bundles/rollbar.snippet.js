/* globals __DEFAULT_ROLLBARJS_URL__ */
/* globals _rollbarConfig */

var RollbarShim = require('../shim').Rollbar;
var snippetCallback = require('../snippet_callback');

var defaultRollbarJsUrl = __DEFAULT_ROLLBARJS_URL__;
_rollbarConfig.rollbarJsUrl = _rollbarConfig.rollbarJsUrl || defaultRollbarJsUrl;

var shim = RollbarShim.init(window, _rollbarConfig);
var callback = snippetCallback(shim, _rollbarConfig);

shim.loadFull(window, document, false, _rollbarConfig, callback);
