if (!window._rollbarInitialized) {
  var shim = window.Rollbar;
  var fullRollbar = new Notifier(shim);
  fullRollbar._processShimQueue(window.RollbarShimQueue || []);
  window.Rollbar = fullRollbar;
  window._rollbarInitialized = true;
}
