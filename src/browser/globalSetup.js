function captureUncaughtExceptions(window, handler) {
  if (!window) { return; }
  var oldOnError;

  if (typeof handler._rollbarOldOnError === 'function') {
    oldOnError = handler._rollbarOldOnError;
  } else if (window.onerror && !window.onerror.belongsToRollbar) {
    oldOnError = window.onerror;
    handler._rollbarOldOnError = oldOnError;
  }

  var fn = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    _rollbarWindowOnError(window, handler, oldOnError, args);
  };
  fn.belongsToRollbar = true;
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

function captureUnhandledRejections(window, handler) {
  if (!window) { return; }

  if (typeof window._rollbarURH === 'function') {
    window.removeEventListner('unhandledrejection', window._rollbarURH);
  }

  var rejectionHandler = function (event) {
    var reason = event.reason;
    var promise = event.promise;
    var detail = event.detail;

    if (!reason && detail) {
      reason = detail.reason;
      promise = detail.promise;
    }

    handler.handleUnhandledRejection(reason, promise);
  };
  window._rollbarURH = rejectionHandler;
  window.addEventListener('unhandledrejection', rejectionHandler);
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
    if (oldAddEventListener._rollbarOldAdd) {
      oldAddEventListener = oldAddEventListener._rollbarOldAdd;
    }
    var addFn = function(event, callback, bubble) {
      oldAddEventListener.call(this, event, handler.wrap(callback), bubble);
    };
    addFn._rollbarOldAdd = oldAddEventListener;
    prototype.addEventListener = addFn;

    var oldRemoveEventListener = prototype.removeEventListener;
    if (oldRemoveEventListener._rollbarOldRemove) {
      oldRemoveEventListener = oldRemoveEventListener._rollbarOldRemove;
    }
    var removeFn = function(event, callback, bubble) {
      oldRemoveEventListener.call(this, event, callback && callback._wrapped || callback, bubble);
    };
    removeFn._rollbarOldRemove = oldRemoveEventListener;
    prototype.removeEventListener = removeFn;
  }
}

module.exports = {
  captureUncaughtExceptions: captureUncaughtExceptions,
  captureUnhandledRejections: captureUnhandledRejections,
  wrapGlobals: wrapGlobals
};
