function captureUncaughtExceptions(window, handler, belongsToShim) {
  if (!window) { return; }
  var oldOnError;

  if (typeof handler._rollbarOldOnError === 'function') {
    oldOnError = handler._rollbarOldOnError;
  } else if (window.onerror && !window.onerror.belongsToShim) {
    oldOnError = window.onerror;
    handler._rollbarOldOnError = oldOnError;
  }

  var fn = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    _rollbarWindowOnError(window, handler, oldOnError, args);
  };
  fn.belongsToShim = !!belongsToShim;
  window.onerror = fn;
}

function _rollbarWindowOnError(window, r, old, args) {
  if (window._rollbarWrappedError) {
    if (!args[4]) {
      args[4] = window._rollbarWrappedError;
    }
    if (!args[5]) {
      args[5] = window._rollbarWrappedError._rollbarContext;
    }
    window._rollbarWrappedError = null;
  }

  r.handleUncaughtException.apply(r, args);
  if (old) {
    old.apply(window, args);
  }
}

function captureUnhandledRejections(window, handler, shim) {
  if (!window) { return; }

  if (shim && typeof shim._unhandledRejectionHandler === 'function') {
    window.removeEventListener('unhandledrejection', shim._unhandledRejectionHandler);
  }

  handler._unhandledRejectionHandler = function (event) {
    var reason = event.reason;
    var promise = event.promise;
    var detail = event.detail;

    if (!reason && detail) {
      reason = detail.reason;
      promise = detail.promise;
    }

    handler.handleUnhandledRejection(reason, promise);
  };
  window.addEventListener('unhandledrejection', handler._unhandledRejectionHandler);
}

function wrapGlobals(window, handler) {
  if (!window) { return; }
  // Adapted from https://github.com/bugsnag/bugsnag-js
  var globals = 'EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload'.split(',');
  var i, global;
  for (i = 0; i < globals.length; ++i) {
    global = globals[i];

    if (window[global] && window[global].prototype) {
      _extendListenerPrototype(handler, window[global].prototype);
    }
  }
}

function _extendListenerPrototype(handler, prototype) {
  if (prototype.hasOwnProperty && prototype.hasOwnProperty('addEventListener')) {
    var oldAddEventListener = prototype.addEventListener;
    prototype.addEventListener = function(event, callback, bubble) {
      oldAddEventListener.call(this, event, handler.wrap(callback), bubble);
    };

    var oldRemoveEventListener = prototype.removeEventListener;
    prototype.removeEventListener = function(event, callback, bubble) {
      oldRemoveEventListener.call(this, event, callback && callback._wrapped || callback, bubble);
    };
  }
}

module.exports = {
  captureUncaughtExceptions: captureUncaughtExceptions,
  captureUnhandledRejections: captureUnhandledRejections,
  wrapGlobals: wrapGlobals
};
