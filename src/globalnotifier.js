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
wrapper.init = function(config) {
  var notifier = new Notifier();
  notifier.configure(config); 

  if (config.captureUncaught) {
    // Set the global onerror handler
    var old = window.onerror;

    window.onerror = function() {
      var args = Array.prototype.slice.call(arguments, 0);
      _rollbarWindowOnError(notifier, old, args);
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
        _extendListenerPrototype(notifier, window[global].prototype);
      }
    }
  }

  // Finally, start processing payloads using the global notifier
  Notifier.processPayloads();
  return notifier;
};
