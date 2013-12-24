_shimCounter = 0;

function Rollbar(parentShim) {
  this.shimId = ++_shimCounter;
  this.notifier = null;
  this.parentShim = parentShim;
}

// Updated by the build process to match package.json
Rollbar.VERSION = '1.0.0-beta1';

Rollbar.init = function(window, config) {
  console.log('Rollbar.init()');
  if (typeof window.Rollbar === 'object') {
    return window.Rollbar;
  }

  // Expose the global shim queue
  window.RollbarShimQueue = [];

  config = config || {};

  var client = new Rollbar();
  client.configure(config);

  if (config.captureUncaught) {
    // Create the client and set the onerror handler
    var old = window.onerror;
    window.onerror = function() {
      client.uncaughtError.apply(client, arguments); 
      if (old) {
        old.apply(window, arguments);
      }
    };
  }

  console.log('Rollbar.init() setting window.Rollbar to a ' + client.constructor.name);

  // Expose Rollbar globally
  window.Rollbar = client;
  return client;
};

Rollbar.prototype.loadFull = function(window, document, immediate, rollbarJsSrc) {
  // Create the main rollbar script loader
  var loader = function() {
    console.log('Rollbar.loadFull() loading ' + (immediate ? 'immediately' : 'async'));
    var s = document.createElement("script");
    var f = document.getElementsByTagName("script")[0];
    s.src = rollbarJsSrc;
    s.async = !immediate;

    // NOTE(cory): this may not work for some versions of IE
    s.onload = handleLoadErr;

    f.parentNode.insertBefore(s, f);
  };

  var handleLoadErr = function() {
    console.log('Rollbar.loadFull().handleLoadErr() rollbar.js is' + (window._rollbarPayloadQueue === undefined ? ' not' : '') + ' fully loaded');
    if (window._rollbarPayloadQueue === undefined) {
      // rollbar.js did not load correctly, call any queued callbacks
      // with an error.
      var obj;
      var cb;
      var args;
      var i;
      var err = new Error('rollbar.js did not load');

      // Go through each of the shim objects. If one of their args
      // was a function, treat it as the callback and call it with
      // err as the first arg.
      while ((obj = window.RollbarShimQueue.shift())) {
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
  };

  if (immediate) {
    loader();
  } else {
    // Have the window load up the script ASAP
    if (window.addEventListener) {
      window.addEventListener("load", loader, false);
    } else { 
      window.attachEvent("onload", loader);
    }
  }
};

// Stub out rollbar.js methods
function stub(method) {
  var R = Rollbar;
  return function() {
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
      window.RollbarShimQueue.push(data);

      if (isScope) {
        return shim;
      }
    }
  };
}

var _methods = 'log,debug,info,warning,error,critical,global,configure,scope,uncaughtError'.split(',');
for (var i = 0; i < _methods.length; ++i) {
  Rollbar.prototype[_methods[i]] = stub(_methods[i]);
}
