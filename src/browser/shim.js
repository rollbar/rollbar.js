function _wrapInternalErr(f) {
  return function() {
    try {
      return f.apply(this, arguments);
    } catch (e) {
      try {
        console.error('[Rollbar]: Internal error', e);
      } catch (e2) {
        // Ignore
      }
    }
  };
}

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

function _buildOnErrorFn(r) {
  var fn = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    _rollbarWindowOnError(r, r._rollbarOldOnError, args);
  };
  fn.belongsToShim = true;
  return fn;
}

var _shimIdCounter = 0;
function rollbar(options) {
  this.options = options;
  this._rollbarOldOnError = null;
  this.shimId = _shimIdCounter++;
  if (window && window._rollbarShims) {
    window._rollbarShims[this.shimId] = [];
  }
}

rollbar.init = function(window, options) {
  var alias = options.globalAlias || 'Rollbar';
  if (typeof window[alias] === 'object') {
    return window[alias];
  }

  window._rollbarShims = {}; 
  window._rollbarWrappedError = null;

  var Rollbar = new rollbar(options);
  return _wrapInternalError(function() {
    if (options.captureUncaught) {
      Rollbar._rollbarOldOnError = window.onerror;
      window.onerror = _buildOnErrorFn(Rollbar);

      var globals = 'EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload'.split(',');
      var i, global, globalLength = globals.length;
      for (i = 0; i < globalLength; ++i) {
        global = globals[i];
        if (window[global] && window[global].prototype) {
          _extendListenerPrototype(Rollbar, window[global].prototype);
        }
      }
    }

    if (options.captureUnhandledRejections) {
      Rollbar._unhandledRejectionHandler = function(event) {
        var reason = event.reason;
        var promise = event.promise;
        var detail = event.detail;
        if (!reason && detail) {
          reason = detail.reason;
          promise = detaili.promise;
        }
        Rollbar.handleUnhandledRejection(reason, promise);
      }

      window.addEventListener('unhandledrejection', Rollbar._unhandledRejectionHandler);
    }

    window[alias] = Rollbar;
    return Rollbar;
  })();
};

rollbar.prototype.loadFull = function(window, document, immediate, options, callback) {
  var onload = function () {
    var err;
    if (window._rollbarDidLoad === undefined) {
      var obj;
      var cb;
      var args;
      var i;

      err = new Error('rollbar.js did not load');
      while ((obj = window._rollbarShimQueue.shift())) {
        args = obj.args || [];
        for (i = 0; i < args.length; ++i) {
          cb = args[i];
          if (typeof cb === 'function') {
            cb(err);
            break;
          }
        }
      }
    }
    if (typeof callback === 'function') {
      callback(err);
    }
  };

  // Load the full rollbar.js source
  var done = false;
  var s = document.createElement('script');
  var f = document.getElementsByTagName('script')[0];
  var parentNode = f.parentNode;

  s.crossOrigin = '';
  s.src = options.rollbarJsUrl;
  s.async = !immediate;

  s.onload = s.onreadystatechange = _wrapInternalErr(function() {
    if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
      s.onload = s.onreadystatechange = null;
      try {
        parentNode.removeChild(s);
      } catch (e) {
        // pass
      }
      done = true;

      onload();
    }
  });
  parentNode.insertBefore(s, f);
};

rollbar.prototype.wrap = function(f, context) {
  try {
    var ctxFn;
    if (typeof context === 'function') {
      ctxFn = context;
    } else {
      ctxFn = function() { return context || {}; };
    }

    if (typeof f !== 'function') {
      return f;
    }

    if (f._isWrap) {
      return f;
    }

    if (!f._wrapped) {
      f._wrapped = function () {
        try {
          return f.apply(this, arguments);
        } catch(e) {
          if (typeof e === 'string') {
            e = new String(e);
          }
          e._rollbarContext = ctxFn() || {};
          e._rollbarContext._wrappedSource = f.toString();

          window._rollbarWrappedError = e;
          throw e;
        }
      };

      f._wrapped._isWrap = true;

      for (var prop in f) {
        if (f.hasOwnProperty(prop)) {
          f._wrapped[prop] = f[prop];
        }
      }
    }

    return f._wrapped;
  } catch (e) {
    // Return the original function if the wrap fails.
    return f;
  }
};

// Stub out rollbar.js methods
function stub(method) {
  return _wrapInternalErr(function() {
    var shim = this;
    var args = Array.prototype.slice.call(arguments, 0);
    var data = {shim: shim, method: method, args: args, ts: new Date()};
    window._rollbarShims[shim.shimId].push(data);
  });
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

var _methods = 
  'log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleUnhandledRejection'.split(',');

for (var i = 0; i < _methods.length; ++i) {
  rollbar.prototype[_methods[i]] = stub(_methods[i]);
}

module.exports = rollbar;
