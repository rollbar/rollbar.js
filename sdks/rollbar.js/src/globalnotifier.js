// Create the global notifier
var globalNotifier = new Notifier();

// Stub out the wrapped error which is set 
window._rollbarWrappedError = null;

// Global window.onerror handler
function _rollbarWindowOnError(client, old, args) {
  if (!args[4] && window._rollbarWrappedError) {
    args[4] = window._rollbarWrappedError;
    window._rollbarWrappedError = null;
  }

  globalNotifier.uncaughtError.apply(globalNotifier, args);
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
      oldRemoveEventListener.call(this, event, callback._wrapped || callback, bubble);
    };
  }
}

// Add an init() method to do the same things that the shim would do
globalNotifier.init = function(config) {
  this.configure(config); 

  if (config.captureUncaught) {
    // Set the global onerror handler
    var old = window.onerror;

    window.onerror = function() {
      var args = Array.prototype.slice.call(arguments, 0);
      _rollbarWindowOnError(globalNotifier, old, args);
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
        _extendListenerPrototype(this, window[global].prototype);
      }
    }
  }

  // Finally, start processing payloads using the global notifier
  Notifier.processPayloads();
};
