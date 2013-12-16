if (!window._rollbarInitialized) {
  var shim = window.Rollbar;
  var fullRollbar = new Notifier(shim);
  window.Rollbar = fullRollbar;
  window._rollbarInitialized = true;
}
