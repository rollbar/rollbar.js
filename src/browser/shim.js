var globals = require('./globalSetup');

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

var _shimIdCounter = 0;
function Shim(options, wrap) {
  this.options = options;
  this._rollbarOldOnError = null;
  var shimId = _shimIdCounter++;
  this.shimId = function() { return shimId; };
  if (window && window._rollbarShims) {
    window._rollbarShims[shimId] = {handler: wrap, messages: []};
  }
}

var Wrapper = require('./rollbarWrapper');
var ShimImpl = function(options, wrap) {
  return new Shim(options, wrap);
};
var Rollbar = Wrapper.bind(null, ShimImpl);

function setupShim(window, options) {
  var alias = options.globalAlias || 'Rollbar';
  if (typeof window[alias] === 'object') {
    return window[alias];
  }

  window._rollbarShims = {}; 
  window._rollbarWrappedError = null;

  var handler = new Rollbar(options);
  return _wrapInternalErr(function() {
    if (options.captureUncaught) {
      handler._rollbarOldOnError = window.onerror;
      globals.captureUncaughtExceptions(window, handler);
      globals.wrapGlobals(window, handler);
    }

    if (options.captureUnhandledRejections) {
      globals.captureUnhandledRejections(window, handler);
    }

    window[alias] = handler;
    return handler;
  })();
};

Shim.prototype.loadFull = function(window, document, immediate, options, callback) {
  var onload = function () {
    var err;
    if (window._rollbarDidLoad === undefined) {
      err = new Error('rollbar.js did not load');
      var i=0, queue, obj, args, cb;
      while ((queue = window._rollbarShims[i++])) {
        queue = queue.messages || [];
        while ((obj = queue.shift())) {
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
  if (!immediate) {
    s.async = true;
  }

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

Shim.prototype.wrap = function(f, context) {
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

function stub(method) {
  return _wrapInternalErr(function() {
    var shim = this;
    var args = Array.prototype.slice.call(arguments, 0);
    var data = {shim: shim, method: method, args: args, ts: new Date()};
    window._rollbarShims[this.shimId()].messages.push(data);
  });
}

var _methods = 
  'log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleUnhandledRejection'.split(',');

for (var i = 0; i < _methods.length; ++i) {
  Shim.prototype[_methods[i]] = stub(_methods[i]);
}

module.exports = {
  setupShim: setupShim,
  Rollbar: Rollbar
};
