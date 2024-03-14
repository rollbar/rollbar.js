var rollbar = require('../rollbar');

var options = (typeof window !== 'undefined') && window._rollbarConfig;
var alias = options && options.globalAlias || 'Rollbar';
var shimRunning = (typeof window !== 'undefined') && window[alias] && typeof window[alias].shimId === 'function' && window[alias].shimId() !== undefined;

if ((typeof window !== 'undefined') && !window._rollbarStartTime) {
  window._rollbarStartTime = (new Date()).getTime();
}

if (!shimRunning && options) {
  var Rollbar = new rollbar(options);
  window[alias] = Rollbar;
} else if (typeof window !== 'undefined') {
  window.rollbar = rollbar;
  window._rollbarDidLoad = true;
} else if (typeof self !== 'undefined') {
  self.rollbar = rollbar;
  self._rollbarDidLoad = true;
}

module.exports = rollbar;
