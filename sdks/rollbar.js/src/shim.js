var _shimCounter = 0;

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


function _rollbarWindowOnError(client, old, args) {
  if (window._rollbarWrappedError) {
    if (!args[4]) {
      args[4] = window._rollbarWrappedError;
    }
    if (!args[5]) {
      args[5] = window._rollbarWrappedError._rollbarContext;
    }
    window._rollbarWrappedError = null;
  }

  client.uncaughtError.apply(client, args);
  if (old) {
    old.apply(window, args);
  }
}

function _buildOnErrorFn(client) {
  var fn = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    _rollbarWindowOnError(client, client._rollbarOldOnError, args);
  };

  fn.belongsToShim = true;

  return fn;
}

function Rollbar(parentShim) {
  this.shimId = ++_shimCounter;
  this.notifier = null;
  this.parentShim = parentShim;
  this._rollbarOldOnError = null;
}



Rollbar.init = function(window, config) {
  var alias = config.globalAlias || 'Rollbar';
  if (typeof window[alias] === 'object') {
    return window[alias];
  }

  // Expose the global shim queue
  window._rollbarShimQueue = [];
  window._rollbarWrappedError = null;

  config = config || {};

  var client = new Rollbar();

  return _wrapInternalErr(function() {
    client.configure(config);

    if (config.captureUncaught) {
      // Create the client and set the onerror handler
      client._rollbarOldOnError = window.onerror;

      window.onerror = _buildOnErrorFn(client);

      // Adapted from https://github.com/bugsnag/bugsnag-js
      var globals = 'EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload'.split(',');

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
      // Create an event based handler for the shim and expose it so that it can unregister it
      // before creating its own handler.
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

    // Expose Rollbar globally
    window[alias] = client;
    return client;
  })();
};


Rollbar.prototype.loadFull = function(window, document, immediate, config, callback) {
  var onload = function () {
    var err;
    if (window._rollbarPayloadQueue === undefined) {
      // rollbar.js did not load correctly, call any queued callbacks
      // with an error.
      var obj;
      var cb;
      var args;
      var i;

      err = new Error('rollbar.js did not load');

      // Go through each of the shim objects. If one of their args
      // was a function, treat it as the callback and call it with
      // err as the first arg.
      while ((obj = window._rollbarShimQueue.shift())) {
        args = obj.args;
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
  s.src = config.rollbarJsUrl;
  s.async = !immediate;

  // From http://stackoverflow.com/questions/4845762/onload-handler-for-script-tag-in-internet-explorer
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


Rollbar.prototype.wrap = function(f, context) {
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
    // Try-catch here is to work around issue where wrap() fails when used inside Selenium.
    // Return the original function if the wrap fails.
    return f;
  }
};

// Stub out rollbar.js methods
function stub(method) {
  var R = Rollbar;
  return _wrapInternalErr(function() {
    if (this.notifier) {
      return this.notifier[method].apply(this.notifier, arguments);
    } else {
      var shim = this;
      var isScope = method === 'scope';
      if (isScope) {
        shim = new R(this);
      }
      var args = Array.prototype.slice.call(arguments, 0);
      var data = {shim: shim, method: method, args: args, ts: new Date()};
      window._rollbarShimQueue.push(data);

      if (isScope) {
        return shim;
      }
    }
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
      oldRemoveEventListener.call(this, event, (callback && callback._wrapped) ? callback._wrapped : callback, bubble);
    };
  }
}


var _methods = 
  'log,debug,info,warn,warning,error,critical,global,configure,scope,uncaughtError,unhandledRejection'.split(',');

for (var i = 0; i < _methods.length; ++i) {
  Rollbar.prototype[_methods[i]] = stub(_methods[i]);
}


module.exports = {
  Rollbar: Rollbar,
  _rollbarWindowOnError: _rollbarWindowOnError
};
