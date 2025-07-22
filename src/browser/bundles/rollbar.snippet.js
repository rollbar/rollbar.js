/* global _rollbarConfig:true */

import * as Shim from '../shim.js';
import snippetCallback from '../snippet_callback.js';
import { defaultRollbarJsUrl } from './defaults.js';

_rollbarConfig = _rollbarConfig || {};
_rollbarConfig.rollbarJsUrl = _rollbarConfig.rollbarJsUrl || defaultRollbarJsUrl;
_rollbarConfig.async = _rollbarConfig.async === undefined || _rollbarConfig.async;

var shim = Shim.setupShim(window, _rollbarConfig);
var callback = snippetCallback(_rollbarConfig);
window.rollbar = Shim.Rollbar;

shim.loadFull(window, document, !_rollbarConfig.async, _rollbarConfig, callback);
