(function(window, document){
_shimCounter = 0;

function Rollbar(parentShim) {
  this.shimId = ++_shimCounter;
  this.notifier = null;
  this.parentShim = parentShim;
}

// Updated by the build process to match package.json
Rollbar.VERSION = '0.10.8';

Rollbar.init = function(window, config) {
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

  // Expose Rollbar globally
  window.Rollbar = client;
  return client;
};

Rollbar.prototype.loadFull = function(window, document, immediate) {
  // Create the main rollbar script loader
  var loader = function() {
    var s = document.createElement("script");
    var f = document.getElementsByTagName("script")[0];
    s.src = "../dist/rollbar.js";
    s.async = !immediate;
    f.parentNode.insertBefore(s, f);
  };

  if (immediate) {
    loader();
  } else {
    // Have the window load up the script ASAP
    if (window.addEventListener) {
      console.log('loading with addEventListener');
      window.addEventListener("load", loader, false);
    } else { 
      console.log('loading with attachEvent');
      window.attachEvent("onload", loader);
    }
  }
};

// Stub out rollbar.js methods
function stub(method) {
  var R = Rollbar;
  return function() {
    if (this.notifier) {
      this.notifier[method].apply(this.notifier, arguments);
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

var _methods = ['log', 'debug', 'info', 'warning', 'error', 'critical', 'configure', 'scope', 'uncaughtError'];
for (var i = 0; i < _methods.length; ++i) {
  Rollbar.prototype[_methods[i]] = stub(_methods[i]);
}

var config = {
  accessToken: 'ACCESS_TOKEN',
  captureUncaught: true
};

var r = Rollbar.init(window, config);
r.loadFull(window, document);
})(window, document);