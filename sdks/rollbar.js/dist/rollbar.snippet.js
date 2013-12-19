(function(window, document){
_shimCounter = 0;

var Rollbar = function(parentShim) {
  this.shimId = ++_shimCounter;
  this.notifier = null;
  this.parentShim = parentShim;
};

Rollbar.init = function(window, config) {
  if (typeof window.Rollbar === 'object') {
    return window.Rollbar;
  }

  // Expose the global shim queue
  window.RollbarShimQueue = [];

  var client = new Rollbar();
  client.configure(config);

  if (!config || (config && config.captureUncaught)) {
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
};

Rollbar.load = function(window, document) {
  // Create the main rollbar script loader
  var loader = function() {
    var s = document.createElement("script");
    var f = document.getElementsByTagName("script")[0];
    s.src = "../src/rollbar.js";
    s.async = true;
    f.parentNode.insertBefore(s, f);
  };

  // Have the window load up the script ASAP
  if (window.addEventListener) {
    window.addEventListener("load", loader, false);
  } else { 
    window.attachEvent("onload", loader);
  }
};

// Stub out rollbar.js methods
function stub(method) {
  var R = Rollbar;
  return function() {
    if (this.notifier) {
      this.notifier[method].apply(this, arguments);
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

Rollbar.init(window, config);
Rollbar.load(window, document);
})(window, document);