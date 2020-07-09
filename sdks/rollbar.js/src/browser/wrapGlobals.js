function wrapGlobals(window, handler, shim) {
  if (!window) { return; }
  // Adapted from https://github.com/bugsnag/bugsnag-js
  var globals = 'EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload'.split(',');
  var i, global;
  for (i = 0; i < globals.length; ++i) {
    global = globals[i];

    if (window[global] && window[global].prototype) {
      _extendListenerPrototype(handler, window[global].prototype, shim);
    }
  }
}

function _extendListenerPrototype(handler, prototype, shim) {
  if (prototype.hasOwnProperty && prototype.hasOwnProperty('addEventListener')) {
    var oldAddEventListener = prototype.addEventListener;
    while (oldAddEventListener._rollbarOldAdd && oldAddEventListener.belongsToShim) {
      oldAddEventListener = oldAddEventListener._rollbarOldAdd;
    }
    var addFn = function(event, callback, bubble) {
      oldAddEventListener.call(this, event, handler.wrap(callback), bubble);
    };
    addFn._rollbarOldAdd = oldAddEventListener;
    addFn.belongsToShim = shim;
    prototype.addEventListener = addFn;

    var oldRemoveEventListener = prototype.removeEventListener;
    while (oldRemoveEventListener._rollbarOldRemove && oldRemoveEventListener.belongsToShim) {
      oldRemoveEventListener = oldRemoveEventListener._rollbarOldRemove;
    }
    var removeFn = function(event, callback, bubble) {
      oldRemoveEventListener.call(this, event, callback && callback._rollbar_wrapped || callback, bubble);
    };
    removeFn._rollbarOldRemove = oldRemoveEventListener;
    removeFn.belongsToShim = shim;
    prototype.removeEventListener = removeFn;
  }
}

module.exports = wrapGlobals;
