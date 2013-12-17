(function(window, document){
function Notifier(parentNotifier) {
  this.payloadQueue = [];
  this.plugins = {};

  if (parentNotifier) {
    // If the parent notifier has the shimQueue
    // property it means that it's the Rollbar shim.
    if (parentNotifier.hasOwnProperty('shimQueue')) {
      // After we set this, the shim is just a proxy to this
      // Notifier instance.
      parentNotifier.notifier = this;

      // Process all of the shim's payload
      this.payloadQueue = this._processShimQueue(parentNotifier.shimQueue);
      return;
    } else {
      this.configure(parentNotifier.options);
    }
  }
}

Notifier._generateLogFn = function(level) {
  return function() {
    var args = Notifier._getLogArgs(arguments);
    level = level || args.level || this.options.level || 'debug';
    message = args.message;
    err = args.err;
    custom = args.custom;
    callback = args.callback;

    return this._log(level, message, err, custom, callback);
  };
};

/*
 * Returns an Object with keys:
 * {
 *  message: String,
 *  err: Error,
 *  custom: Object
 * }
 */
Notifier._getLogArgs = function(args) {
  var level = this.options.level || 'debug';
  var message;
  var err;
  var custom;
  var callback;

  args.each(function(arg) {
    var argT = typeof arg;
    if (argT === 'string') {
      message = argT;
    } else if (argT === 'function') {
      callback = argT;
    } else if (argT === 'object') {
      if (argT.hasOwnProperty('stack')) {
        err = argT;
      } else {
        custom = argT;
      }
    }
  });
  return [level, message, err, custom, callback];
};

/*
 * Given a queue containing each call to the shim, call the
 * corresponding method on this instance.
 *
 * shim queue contains:
 *
 * {method: 'info', args: ['hello world', exc], ts: ms_timestamp}
 */
Notifier.prototype._processShimQueue = function(shimQueue) {
  // implement me
};

/*
 * Logs stuff to Rollbar and console.log using the default
 * logging level.
 *
 * Can be called with the following, (order doesn't matter but type does):
 * - message: String
 * - err: Error object, must have a .stack property or it will be
 *   treated as custom data
 * - custom: Object containing custom data to be sent along with
 *   the item
 * - callback: Function to call once the item is reported to Rollbar
 */
Notifier.prototype._log = function(level, message, err, custom, callback) {
  // Implement me
};

Notifier.prototype.route = function(path) {
  return this.options.endpoint + path;
};

Notifier.prototype.log = Notifier._generateLogFn();
Notifier.prototype.debug = Notifier._generateLogFn('debug');
Notifier.prototype.info = Notifier._generateLogFn('info');
Notifier.prototype.warning = Notifier._generateLogFn('warning');
Notifier.prototype.error = Notifier._generateLogFn('error');
Notifier.prototype.critical = Notifier._generateLogFn('critical');

Notifier.prototype.configure = function(options) {
  this.options = options;
};

/*
 * Create a new Notifier instance which has the same options
 * as the current notifier + options to override them.
 */
Notifier.prototype.scope = function(options) {
  var scopedNotifier = new Notifier();

  // Set the payloadQueue of the scoped notifier to
  // be the same one as this notifier so we can have
  // a single queue where we process payloads.
  scopedNotifier.payloadQueue = this.payloadQueue;

  // Create an object from this.options
  // and merge in options and call configure() on
  // the scoped notifier.
  // Make sure to copy the original options so we don't
  // permanently override them.
  var scopedOptions = {};
  scopedNotifier.configure(scopedOptions);

  return scopedNotifier;
};
;var Util = {
  merge: function(to, from) {
    var k;
    for (k in from) {
      if (from[k].constructor == Object) {
        if (!to.hasOwnProperty(k)) {
          to[k] = from[k];
        } else {
          to[k] = merge(to[k], from[k]);
        }
      } else {
        to[k] = from[k];
      }
    }
    return to;
  },

  copy: function(obj) {
    var dest = {};
    Util.merge(dest, obj);
    return dest;
  },

  parseUriOptions: {
    strictMode: false,
    key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
    q:   {
      name:   "queryKey",
      parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
  },

  parseUri: function(str) {
    var o = Util.parseUriOptions;
    var m = o.parser[o.strictMode ? "strict" : "loose"].exec(str);
    var uri = {};
    var i = 14;

    while (i--) {
      uri[o.key[i]] = m[i] || "";
    }

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
      if ($1) {
        uri[o.q.name][$1] = $2;
      }
    });

    return uri;
  },

  sanitizeUrl: function(url) {
    if (url) {
      var baseUrlParts = Util.parseUri(url);
      // remove a trailing # if there is no anchor
      if (baseUrlParts.anchor === '') {
        baseUrlParts.source = baseUrlParts.source.replace('#', '');
      }
      var baseUrl = baseUrlParts.source.replace('?' + baseUrlParts.query, ''); 
      url = baseUrl;
    }
    return url;
  }
};
;var XHR = {
  XMLHttpFactories: [
      function () {return new XMLHttpRequest();},
      function () {return new ActiveXObject("Msxml2.XMLHTTP");},
      function () {return new ActiveXObject("Msxml3.XMLHTTP");},
      function () {return new ActiveXObject("Microsoft.XMLHTTP");}
  ],
  createXMLHTTPObject: function() {
    var xmlhttp = false;
    var factories = XHR.XMLHttpFactories;
    var i;
    var numFactories = factories.length;
    for (i = 0; i < numFactories; i++) {
      try {
        xmlhttp = factories[i]();
        break;
      } catch (e) {
        // pass
      }
    }
    return xmlhttp;
  },
  post: function(url, payload, callback) {
    var request = XHR.createXMLHTTPObject();
    if (request) {
      try {
        try {
          var onreadystatechange = function(args) {
            try {
              if (callback && onreadystatechange && request.readyState === 4) {
                onreadystatechange = undefined;

                if (request.status === 200) {
                  callback(null);
                } else if (typeof(request.status) === "number" &&
                            request.status >= 400  && request.status < 600) {
                  //return valid http status codes
                  callback(new Error(request.status.toString()));
                } else {
                  //IE will return a status 12000+ on some sort of connection failure,
                  //so we return a blank error
                  //http://msdn.microsoft.com/en-us/library/aa383770%28VS.85%29.aspx
                  callback(new Error());
                }
              }
            } catch (firefoxAccessException) {
              //jquery source mentions firefox may error out while accessing the
              //request members if there is a network error
              //https://github.com/jquery/jquery/blob/a938d7b1282fc0e5c52502c225ae8f0cef219f0a/src/ajax/xhr.js#L111
              if (callback) {
                callback(new Error());
              }
            }
          };

          request.open('POST', url, true);
          if (request.setRequestHeader) {
            request.setRequestHeader('Content-Type', 'application/json');
          }
          request.onreadystatechange = onreadystatechange;
          request.send(payload);
        } catch (e1) {
          // Sending using the normal xmlhttprequest object didn't work, try XDomainRequest
          if (typeof XDomainRequest !== "undefined") {
            var ontimeout = function(args) {
              if (callback) {
                callback(new Error());
              }
            };

            var onerror = function(args) {
              if (callback) {
                callback(new Error());
              }
            };

            var onload = function(args) {
              if (callback) {
                callback(null);
              }
            };

            request = new XDomainRequest();
            request.onprogress = function() {};
            request.ontimeout = ontimeout;
            request.onerror = onerror;
            request.onload = onload;
            request.open('POST', url, true);
            request.send(payload);
          }
        }
      } catch (e2) {
        // ignore
      }
    }
  }
};
;if (!window._rollbarInitialized) {
  var shim = window.Rollbar;
  var fullRollbar = new Notifier(shim);
  window.Rollbar = fullRollbar;
  window._rollbarInitialized = true;
}
})(window, document);