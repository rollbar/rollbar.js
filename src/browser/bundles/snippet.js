/* globals __DEFAULT__ROLLBARJS_URL__ */
/* globals _rollbarConfig */

var RollbarShim = require('../shim');
var snippetCallback = require('../snippet_callback');

_rollbarConfig = _rollbarConfig || {};
_rollbarConfig.rollbarJsUrl = _rollbarConfig.rollbarJsUrl || __DEFAULT_ROLLBARJS_URL__;
_rollbarConfig.async = _rollbarConfig.async === undefined || _rollbarConfig.async;

var shim = RollbarShim.init(window, _rollbarConfig);
var callback = snippetCallback(_rollbarConfig);

shim.loadFull(window, document, !_rollbarConfig.async, _rollbarConfig, callback);
