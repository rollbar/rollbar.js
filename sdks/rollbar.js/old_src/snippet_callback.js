module.exports = function(shim, _config) {
  return function(err) {
    if (err) {
      // do something?
      return;
    }

    if (!window._rollbarInitialized) {
      var Notifier = window.RollbarNotifier; // This is exposed by UMD bundle.
      var config = _config || {};
      var alias = config.globalAlias || 'Rollbar';

      // At this time window.Rollbar is globalnotifier.wrapper
      var fullRollbar = window.Rollbar.init(config, shim);

      fullRollbar._processShimQueue(window._rollbarShimQueue || []);

      window[alias] = fullRollbar;

      window._rollbarInitialized = true;

      Notifier.processPayloads();
    }
  };
};
