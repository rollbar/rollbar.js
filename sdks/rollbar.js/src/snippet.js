(function(w, d) {
  if (w.Rollbar) {
    return w.Rollbar;
  }
  var Rollbar = function() {
    this.initTs = new Date().getTime();
    this.shimQueue = [];
    this.notifier = null;
  };
  var methods = ['log', 'debug', 'info', 'warning', 'error', 'critical', 'configure', 'scope', 'uncaughtError'];
  for (var i = 0; i < methods.length; ++i) {
    Rollbar.prototype[methods[i]] = function(method) {
      return function() {
        if (this.notifier) {
          this.notifier[method].apply(this, arguments);
        } else {
          var data = {method: method, args: arguments, ts: new Date().getTime()};
          this.shimQueue.push(data);
        }
        if (method === 'scope') {
          return this;
        }
      };
    }(methods[i]);
  }

  // Create the client and set the onerror handler
  var client = new Rollbar();
  var old = w.onerror;
  w.onerror = function() {
    client.uncaughtError.apply(client, arguments); 
    old && old.apply(w, arguments);
  };

  // Create the main rollbar script loader
  var loader = function() {
    var s = d.createElement("script");
    var f = d.getElementsByTagName("script")[0];
    s.src = "../src/rollbar.js";
    s.async = true;
    f.parentNode.insertBefore(s, f);
  };

  // Have the window load up the script ASAP
  if (w.addEventListener) {
    w.addEventListener("load", loader, false);
  } else { 
    w.attachEvent("onload", loader);
  }

  // Expose Rollbar globally
  w.Rollbar = Rollbar;

  // Finally, return the new client
  return client;
})(window, document);
