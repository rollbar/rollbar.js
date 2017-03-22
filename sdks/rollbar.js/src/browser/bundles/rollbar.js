var globalRollbar = require('../globalRollbar');

var options = window._rollbarOptions;
var alias = options && options.globalAlias || 'Rollbar';
var shimRunning = window[alias] && typeof window[alias].shimId !== 'undefined';

if (!shimRunning && options) {
  var rollbar = globalRollbar.wrapper.init(options);
  module.exports = rollbar;
} else {
  window._rollbar = globalRollbar.wrapper;
  module.exports = globalRollbar.wrapper;
}
