var rollbar = require('../rollbar');
var globals = require('../globalSetup');

var options = window._rollbarConfig;
var alias = options && options.globalAlias || 'Rollbar';
var shimRunning = window[alias] && typeof window[alias].shimId !== 'undefined';

if (!shimRunning && options) {
  var Rollbar = new rollbar(options);
  if (options.captureUncaught) {
    globals.captureUncaughtExceptions(window, Rollbar);
    globals.wrapGlobals(window, Rollbar);
  }
  if (options.captureUnhandledRejections) {
    globals.captureUnhandledRejections(window, Rollbar);
  }
  window[alias] = Rollbar;
} else {
  window._rollbar = rollbar;
  window._rollbarDidLoad = true;
}

module.exports = rollbar;
