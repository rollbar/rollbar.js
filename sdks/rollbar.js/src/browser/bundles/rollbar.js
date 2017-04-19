var rollbar = require('../rollbar');
var globals = require('../globalSetup');

var options = window && window._rollbarConfig;
var alias = options && options.globalAlias || 'Rollbar';
var shimRunning = window && window[alias] && typeof window[alias].shimId !== 'undefined';

if (window && !window._rollbarStartTime) {
  window._rollbarStartTime = (new Date()).getTime();
}

if (!shimRunning && options) {
  var Rollbar = new rollbar(options);
  window[alias] = Rollbar;
} else {
  window.rollbar = rollbar;
  window._rollbarDidLoad = true;
}

module.exports = rollbar;
