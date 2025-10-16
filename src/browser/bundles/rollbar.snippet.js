/* global _rollbarConfig:true */

import * as Shim from '../shim.js';
import snippetCallback from '../snippet_callback.js';
import { defaultRollbarJsUrl } from './defaults.js';

_rollbarConfig = _rollbarConfig || {};
if (!_rollbarConfig.rollbarJsUrl) {
  const needsReplay = 'replay' in _rollbarConfig;
  _rollbarConfig.rollbarJsUrl = needsReplay
    ? defaultRollbarJsUrl.replace('rollbar.min.js', 'rollbar.replay.min.js')
    : defaultRollbarJsUrl;
}
_rollbarConfig.async = _rollbarConfig.async === undefined || _rollbarConfig.async;

const shim = Shim.setupShim(window, _rollbarConfig);
const callback = snippetCallback(_rollbarConfig);
window.rollbar = Shim.Rollbar;

shim.loadFull(window, document, !_rollbarConfig.async, _rollbarConfig, callback);
