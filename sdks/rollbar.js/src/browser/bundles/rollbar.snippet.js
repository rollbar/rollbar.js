/* global __DEFAULT_ROLLBARJS_URL__:false */
/* global _rollbarConfig:true */

var Shim = require('../shim');
var snippetCallback = require('../snippet_callback');

_rollbarConfig = _rollbarConfig || {};
_rollbarConfig.rollbarJsUrl = _rollbarConfig.rollbarJsUrl || __DEFAULT_ROLLBARJS_URL__;
_rollbarConfig.async = _rollbarConfig.async === undefined || _rollbarConfig.async;

var shim = Shim.setupShim(window, _rollbarConfig);
var callback = snippetCallback(_rollbarConfig);
window.rollbar = Shim.Rollbar;

shim.loadFull(window, document, !_rollbarConfig.async, _rollbarConfig, callback);
