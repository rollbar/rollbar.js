/* globals __DEFAULT_ROLLBARJS_URL__ */
/* globals _rollbarConfig */

var RollbarShim = require('../shim').Rollbar;
var snippetCallback = require('../snippet_callback');

_rollbarConfig.rollbarJsUrl = _rollbarConfig.rollbarJsUrl || __DEFAULT_ROLLBARJS_URL__;

var shim = RollbarShim.init(window, _rollbarConfig);
var callback = snippetCallback(shim, _rollbarConfig);

shim.loadFull(window, document, !_rollbarConfig.async, _rollbarConfig, callback);
