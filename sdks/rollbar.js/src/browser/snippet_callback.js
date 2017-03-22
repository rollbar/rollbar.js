module.exports = function(shim, options) {
  return function(err) {
    if (err) {
      return;
    }

    if (!window._rollbarInitialized) {
      var options = options || {};
      var alias = options.globalAlias || 'Rollbar';

      var rollbar = window._rollbar.init(options, shim);
      var Rollbar = rollbar._processShims(window._rollbarShims || {});
      window[alias] = Rollbar;
      window._rollbarInitialized = true;
    }
  };
};
