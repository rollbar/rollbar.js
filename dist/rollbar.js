(function(window, document){
function Notifier(parentNotifier) {
  if (parentNotifier) {
    // If the parent notifier has the shimQueue
    // property it means that it's the Rollbar shim.
    if (parentNotifier.hasOwnProperty('shimQueue')) {
      // After we set this, the shim is just a proxy to this
      // Notifier instance.
      parentNotifier.notifier = this;

      // Process all of the shim's payload
      this.payloadQueue = this._processShimQueue(parentNotifier.shimQueue);
      return;
    } else {
      this.configure(parentNotifier.options);
    }
  }
  this.payloadQueue = [];
  this.plugins = {};
}

Notifier._generateLogFn = function(level) {
  return function() {
    var args = Notifier._getLogArgs(arguments);
    level = level || args.level || this.options.level || 'debug';
    message = args.message;
    err = args.err;
    custom = args.custom;
    callback = args.callback;

    return this._log(level, message, err, custom, callback);
  };
};

/*
 * Returns an Object with keys:
 * {
 *  message: String,
 *  err: Error,
 *  custom: Object
 * }
 */
Notifier._getLogArgs = function(args) {
  var level = this.options.level || 'debug';
  var message;
  var err;
  var custom;
  var callback;

  args.each(function(arg) {
    var argT = typeof arg;
    if (argT === 'string') {
      message = argT;
    } else if (argT === 'function') {
      callback = argT;
    } else if (argT === 'object') {
      if (argT.hasOwnProperty('stack')) {
        err = argT;
      } else {
        custom = argT;
      }
    }
  });
  return [level, message, err, custom, callback];
};

/*
 * Given a queue containing each call to the shim, call the
 * corresponding method on this instance.
 *
 * shim queue contains:
 *
 * {method: 'info', args: ['hello world', exc], ts: ms_timestamp}
 */
Notifier.prototype._processShimQueue = function(shimQueue) {
  // implement me
};

/*
 * Logs stuff to Rollbar and console.log using the default
 * logging level.
 *
 * Can be called with the following, (order doesn't matter but type does):
 * - message: String
 * - err: Error object, must have a .stack property or it will be
 *   treated as custom data
 * - custom: Object containing custom data to be sent along with
 *   the item
 * - callback: Function to call once the item is reported to Rollbar
 */
Notifier.prototype._log = function(level, message, err, custom, callback) {
  // Implement me
};

Notifier.prototype.log = Notifier._generateLogFn();
Notifier.prototype.debug = Notifier._generateLogFn('debug');
Notifier.prototype.info = Notifier._generateLogFn('info');
Notifier.prototype.warning = Notifier._generateLogFn('warning');
Notifier.prototype.error = Notifier._generateLogFn('error');
Notifier.prototype.critical = Notifier._generateLogFn('critical');

Notifier.prototype.configure = function(options) {
  this.options = options;
};

/*
 * Create a new Notifier instance which has the same options
 * as the current notifier + options to override them.
 */
Notifier.prototype.scope = function(options) {
  var scopedNotifier = new Notifier();

  // Set the payloadQueue of the scoped notifier to
  // be the same one as this notifier so we can have
  // a single queue where we process payloads.
  scopedNotifier.payloadQueue = this.payloadQueue;

  // Create an object from this.options
  // and merge in options and call configure() on
  // the scoped notifier.
  // Make sure to copy the original options so we don't
  // permanently override them.
  var scopedOptions = {};
  scopedNotifier.configure(scopedOptions);

  return scopedNotifier;
};
;if (!window._rollbarInitialized) {
  var shim = window.Rollbar;
  var fullRollbar = new Notifier(shim);
  window.Rollbar = fullRollbar;
  window._rollbarInitialized = true;
}
})(window, document);