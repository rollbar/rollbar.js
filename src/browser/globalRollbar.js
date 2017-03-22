var rollbar = require('./rollbar');
var _ = require('../utility');

window._rollbarWrappedError = null;

function _rollbarWindowOnError(r, old, args) {
  if (window._rollbarWrappedError) {
    if (!args[4]) {
      args[4] = window._rollbarWrappedError;
    }
    if (!args[5]) {
      args[5] = window._rollbarWrappedError._rollbarContext;
    }
    window._rollbarWrappedError = null;
  }

  r.handleUncaughtError.apply(r, args);
  if (old) {
    old.apply(window, args);
  }
}

function _extendListenerPrototype(client, prototype) {
  if (prototype.hasOwnProperty && prototype.hasOwnProperty('addEventListener')) {
    var oldAddEventListener = prototype.addEventListener;
    prototype.addEventListener = function(event, callback, bubble) {
      oldAddEventListener.call(this, event, client.wrap(callback), bubble);
    };

    var oldRemoveEventListener = prototype.removeEventListener;
    prototype.removeEventListener = function(event, callback, bubble) {
      oldRemoveEventListener.call(this, event, callback && callback._wrapped || callback, bubble);
    };
  }
}


// Add an init() method to do the same things that the shim would do
var wrapper = {};
wrapper.init = function(options, shim) {
  var Rollbar = new Rollbar(options);

  if (options.captureUncaught) {
    var oldOnError;

    if (shim && _.isFunction(shim._rollbarOldOnError)) {
      oldOnError = shim._rollbarOldOnError;
    } else if (window.onerror && !window.onerror.belongsToShim) {
      oldOnError = window.onerror;
    }

    window.onerror = function() {
      var args = Array.prototype.slice.call(arguments, 0);
      _rollbarWindowOnError(Rollbar, oldOnError, args);
    };

    // Adapted from https://github.com/bugsnag/bugsnag-js
    var globals = ['EventTarget', 'Window', 'Node', 'ApplicationCache', 'AudioTrackList', 'ChannelMergerNode', 'CryptoOperation', 'EventSource',
     'FileReader', 'HTMLUnknownElement', 'IDBDatabase', 'IDBRequest', 'IDBTransaction', 'KeyOperation', 'MediaController',
     'MessagePort', 'ModalWindow', 'Notification', 'SVGElementInstance', 'Screen', 'TextTrack', 'TextTrackCue',
     'TextTrackList', 'WebSocket', 'WebSocketWorker', 'Worker', 'XMLHttpRequest', 'XMLHttpRequestEventTarget',
     'XMLHttpRequestUpload'];

    var i, global, globalLength = globals.length;
    for (i = 0; i < globalLength; ++i) {
      global = globals[i];
      if (window[global] && window[global].prototype) {
        _extendListenerPrototype(Rollbar, window[global].prototype);
      }
    }
  }

  if (options.captureUnhandledRejections) {
    if (shim && _.isFunction(shim._unhandledRejectionHandler)) {
      window.removeEventListener('unhandledrejection', shim._unhandledRejectionHandler)
    }

    Rollbar._unhandledRejectionHandler = function (event) {
      var reason = event.reason;
      var promise = event.promise;
      var detail = event.detail;

      if (!reason && detail) {
        reason = detail.reason;
        promise = detail.promise;
      }

      Rollbar.handleUnhandledRejection(reason, promise);
    };

    window.addEventListener('unhandledrejection', client._unhandledRejectionHandler);
  }

  window.Rollbar = Rollbar;
  return rollbar;
};

module.exports = {
  wrapper: wrapper
};
