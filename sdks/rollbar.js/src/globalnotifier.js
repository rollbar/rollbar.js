var notifier = require('./notifier');
var Util = require('./util');

var Notifier = notifier.Notifier;
// Stub out the wrapped error which is set
window._rollbarWrappedError = null;


// Global window.onerror handler
function _rollbarWindowOnError(client, old, args) {
  if (!args[4] && window._rollbarWrappedError) {
    args[4] = window._rollbarWrappedError;
    window._rollbarWrappedError = null;
  }

  client.uncaughtError.apply(client, args);
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
wrapper.init = function(config, parent) {
  var client = new Notifier(parent);
  client.configure(config);

  if (config.captureUncaught) {
    // Set the global onerror handler
    var oldOnError;

    // If the parent, probably a shim, stores an oldOnError function, use that one
    if (parent && Util.isType(parent._rollbarOldOnError, 'function')) {
      oldOnError = parent._rollbarOldOnError;
    }
    // If window.onerror doesn't belongs to our shim then we save it. This avoids
    // using the shim onerror and send reports twice.
    else if (window.onerror && !window.onerror.belongsToShim) {
      oldOnError = window.onerror;
    }

    window.onerror = function() {
      var args = Array.prototype.slice.call(arguments, 0);
      _rollbarWindowOnError(client, oldOnError, args);
    };

    // Adapted from https://github.com/bugsnag/bugsnag-js
    var globals = ['EventTarget', 'Window', 'Node', 'ApplicationCache', 'AudioTrackList', 'ChannelMergerNode', 'CryptoOperation', 'EventSource',
     'FileReader', 'HTMLUnknownElement', 'IDBDatabase', 'IDBRequest', 'IDBTransaction', 'KeyOperation', 'MediaController',
     'MessagePort', 'ModalWindow', 'Notification', 'SVGElementInstance', 'Screen', 'TextTrack', 'TextTrackCue',
     'TextTrackList', 'WebSocket', 'WebSocketWorker', 'Worker', 'XMLHttpRequest', 'XMLHttpRequestEventTarget',
     'XMLHttpRequestUpload'];

    var i;
    var global;
    for (i = 0; i < globals.length; ++i) {
      global = globals[i];

      if (window[global] && window[global].prototype) {
        _extendListenerPrototype(client, window[global].prototype);
      }
    }
  }

  if (config.captureUnhandledRejections) {
    if (parent && Util.isType(parent._unhandledRejectionHandler, 'function')) {
      window.removeEventListener('unhandledrejection', parent._unhandledRejectionHandler)
    }

    client._unhandledRejectionHandler = function (event) {
      var reason = event.reason;
      var promise = event.promise;
      // Some Promise libraries do not yet conform to the standard and place the reason and promise inside
      // a detail attribute
      var detail = event.detail;

      if (!reason && detail) {
        reason = detail.reason;
        promise = detail.promise;
      }

      client.unhandledRejection(reason, promise);
    };

    window.addEventListener('unhandledrejection', client._unhandledRejectionHandler);
  }

  window.Rollbar = client;
  // Finally, start processing payloads using the global notifier
  Notifier.processPayloads();
  return client;
};


module.exports = {
  wrapper: wrapper,
  setupJSON: notifier.setupJSON
};
