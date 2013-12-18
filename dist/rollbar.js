(function(window, document){
function Notifier(parentNotifier) {
  this.options = {};
  this.plugins = {};
  this.parentNotifier = parentNotifier;

  if (parentNotifier) {
    // If the parent notifier has the shimId
    // property it means that it's a Rollbar shim.
    if (parentNotifier.hasOwnProperty('shimId')) {
      // After we set this, the shim is just a proxy to this
      // Notifier instance.
      parentNotifier.notifier = this;
    } else {
      this.configure(parentNotifier.options);
    }
  }
}

// This is the global queue where all notifiers will put their
// payloads to be sent to Rollbar.
Notifier.payloadQueue = [];

Notifier._generateLogFn = function(level) {
  return function() {
    var args = this._getLogArgs(arguments);

    return this._log(args.level || this.options.level || 'debug',
        args.message, args.err, args.custom, args.callback);
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
Notifier.prototype._getLogArgs = function(args) {
  console.log(args);
  var level = this.options.level || 'debug';
  var ts;
  var message;
  var err;
  var custom;
  var callback;

  var argT;
  var arg;
  for (var i = 0; i < args.length; ++i) {
    arg = args[i];
    argT = typeof arg;
    if (argT === 'string') {
      message = arg;
    } else if (argT === 'function') {
      callback = arg;
    } else if (argT === 'object') {
      if (arg.constructor.name === 'Date') {
        ts = arg;
      } else if (arg.hasOwnProperty('stack')) {
        err = arg;
      } else {
        custom = arg;
      }
    }
  }

  // TODO(cory): somehow pass in timestamp too...
  
  return {
    level: level,
    message: message,
    err: err,
    custom: custom,
    callback: callback
  };
};


Notifier.prototype._route = function(path) {
  // TODO(cory): make this work well with path/, /path, /path/, etc...
  return this.options.endpoint + path;
};


/*
 * Given a queue containing each call to the shim, call the
 * corresponding method on this instance.
 *
 * shim queue contains:
 *
 * {shim: Rollbar, method: 'info', args: ['hello world', exc], ts: Date}
 */
Notifier.prototype._processShimQueue = function(shimQueue) {
  // implement me
  var shim;
  var obj;
  var tmp;
  var method;
  var args;
  var shimToNotifier = {};
  var parentShim;
  var parentNotifier;
  var notifier;

  // For each of the messages in the shimQueue we need to:
  // 1. get/create the notifier for that shim
  // 2. apply the message to the notifier
  while ((obj = shimQueue.shift())) {
    shim = obj.shim;
    method = obj.method;
    args = obj.args;
    parentShim = shim.parentShim;

    // Get the current notifier based on the shimId
    notifier = shimToNotifier[shim.shimId];
    if (!notifier) {

      // If there is no notifier associated with the shimId
      // Check to see if there's a parent shim
      if (parentShim) {

        // If there is a parent shim, get the parent notifier
        // and create a new notifier for the current shim.
        parentNotifier = shimToNotifier[parentShim.shimId];

        // Create a new Notifier which will process all of the shim's
        // messages
        notifier = new Notifier(parentNotifier);
      } else {
        // If there is no parent, assume the shim is the top
        // level shim and thus, should use this as the notifier.
        notifier = this;
      }

      // Save off the shimId->notifier mapping
      shimToNotifier[shim.shimId] = notifier;
    }

    if (notifier[method] && typeof notifier[method] === 'function') {
      notifier[method].apply(notifier, args);
    }
  }
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
  console.log('IMPLEMENT ME', level, message, err, custom);
};

Notifier.prototype.log = Notifier._generateLogFn();
Notifier.prototype.debug = Notifier._generateLogFn('debug');
Notifier.prototype.info = Notifier._generateLogFn('info');
Notifier.prototype.warning = Notifier._generateLogFn('warning');
Notifier.prototype.error = Notifier._generateLogFn('error');
Notifier.prototype.critical = Notifier._generateLogFn('critical');

Notifier.prototype.uncaughtError = function(message, url, lineNo, colNo, err) {
  // Implement me
  console.log(message, url, lineNo, colNo, err);
};

Notifier.prototype.configure = function(options) {
  // Make a copy of the options object for this notifier
  this.options = Util.copy(options);
};

/*
 * Create a new Notifier instance which has the same options
 * as the current notifier + options to override them.
 */
Notifier.prototype.scope = function(options) {
  var scopedNotifier = new Notifier(this);
  return scopedNotifier;
};

/*
 * Derived work from raven-js at https://github.com/lincolnloop/raven-js
 *
 * Requires Util.sanitizeUrl
 */

function StackTrace(exc) {
  var frames = [];

  if (exc.arguments && exc.stack) {
    frames = _parseChromeExc(exc);
  } else if (exc.stack) {
    if (exc.stack.indexOf('@') === -1) {
      frames = _parseChromeExc(exc);
    } else {
      frames = _parseFirefoxOrSafariExc(exc);
    }
  } else {
    var lineno = parseInt(typeof exc.line !== 'undefined' ? exc.line : exc.lineNumber, 10) || 0;
    var fileUrl = Util.sanitizeUrl((typeof exc.sourceURL !== 'undefined' ? exc.sourceURL : exc.fileName) || null);

    frames = [{filename: fileUrl, lineno: lineno}];
  }
  this.frames = frames.reverse();
}


function _parseChromeExc(e) {
  var chunks, fn, filename, lineno, colno,
      traceback = [],
      lines = e.stack.split('\n'),
      i, line, len = lines.length, frames = [];

  var lineNoRegex = /:([0-9]+(:([0-9]+))?)$/;

  // Skip the first line
  for (i = 1; i < len; ++i) {
    line = lines[i];
    chunks = line.replace(/^\s+|\s+$/g, '').slice(3);
    if (chunks === 'unknown source') {
      continue;
    } else {
      chunks = chunks.split(' ');
    }

    if (chunks.length > 2) {
      fn = chunks.slice(0, -1).join(' ');
      filename = chunks.slice(-1)[0];
      lineno = 0;
    } else if (chunks.length === 2) {
      fn = chunks[0];
      filename = chunks[1];
    } else {
      fn = null;
      filename = chunks[0];
    }

    if (filename && filename !== '(unknown source)') {
      if (filename[0] === '(') {
        filename = filename.slice(1, -1);
      }
      var lineNoMatch = lineNoRegex.exec(filename);
      if (lineNoMatch) {
        lineno = lineNoMatch[1];
        lineno = lineno.split(':');
        if (lineno.length > 1) {
          colno = parseInt(lineno[1], 10);
        } else {
          colno = null;
        }
        lineno = parseInt(lineno[0], 10);
        filename = Util.sanitizeUrl(filename.slice(0, filename.indexOf(lineNoMatch[0])));
      } else {
        lineno = 0;
        colno = null;
      }
    }

    frames.push({filename: filename, lineno: lineno, colno: colno, method: fn});
  } 
  return frames;
}


function _parseFirefoxOrSafariExc(e) {
  var chunks, fn, filename, lineno,
      traceback = [],
      lines = e.stack.split('\n'),
      i, line, len = lines.length, frames = [];

  for (i = 0; i < len; ++i) {
    line = lines[i];

    if (line) {
      chunks = line.split('@');
      if (chunks[0]) {
        fn = chunks[0].split('(');
        fn = (typeof fn[0] !== 'undefined' && String(fn[0]).length) ? fn[0] : null;
      } else {
        fn = null;
      }

      if (chunks.length > 1) {
        filename = chunks[1].split(':');
        lineno = parseInt(filename.slice(-1)[0], 10) || 0;
        filename = Util.sanitizeUrl(filename.slice(0, -1).join(':')) || '<native code>';
      } else if (chunks[0] === '[native code]') {
        fn = null;
        filename = '<native code>';
        lineno = 0;
      }
      
      var frame = {filename: filename, lineno: lineno, method: fn};
      
      // Firefox gives a column number for the first frame
      if (i === 0 && e.columnNumber) {
        // Add 1 to represent a column number starting from 1 since Firefox
        // provides a 0-based column number
        frame.colno = e.columnNumber + 1;
      }
      
      frames.push(frame);
    }
  }
  return frames;
}

var Util = {
  merge: function(to, from) {
    var k;
    for (k in from) {
      if (from[k].constructor == Object) {
        if (!to.hasOwnProperty(k)) {
          to[k] = from[k];
        } else {
          to[k] = this.merge(to[k], from[k]);
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

var XHR = {
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

var RollbarJSON = {
  /*
   * Derived work from json2.js at http://www.JSON.org/js.html
   */

  setupCustomStringify: function() {
    function f(n) {
      // Format integers to have at least two digits.
      return n < 10 ? '0' + n : n;
    }

    Date.prototype.toRollbarJSON = function (key) {

        return isFinite(this.valueOf()) ?
                this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z'
            : null;
    };

    String.prototype.toRollbarJSON      =
        Number.prototype.toRollbarJSON  =
        Boolean.prototype.toRollbarJSON = function (key) {
          return this.valueOf();
        };

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

      escapable.lastIndex = 0;
      return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
        var c = meta[a];
        return typeof c === 'string' ?
          c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
      }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

      var i,          // The loop counter.
          k,          // The member key.
          v,          // The member value.
          length,
          mind = gap,
          partial,
          value = holder[key];

      if (value && typeof value === 'object' &&
              typeof value.toRollbarJSON === 'function') {
        value = value.toRollbarJSON(key);
      }

      if (typeof rep === 'function') {
        value = rep.call(holder, key, value);
      }

      switch (typeof value) {
        case 'string':
          return quote(value);
        case 'number':
          return isFinite(value) ? String(value) : 'null';
        case 'boolean':
        case 'null':
          return String(value);
        case 'object':

          if (!value) {
              return 'null';
          }

          gap += indent;
          partial = [];

          if (Object.prototype.toString.apply(value) === '[object Array]') {

            length = value.length;
            for (i = 0; i < length; i += 1) {
                partial[i] = str(i, value) || 'null';
            }

            v = partial.length === 0 ?
                '[]' : gap ?
                '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                '[' + partial.join(',') + ']';
            gap = mind;
            return v;
          }

          if (rep && typeof rep === 'object') {
            length = rep.length;
            for (i = 0; i < length; i += 1) {
              if (typeof rep[i] === 'string') {
                k = rep[i];
                v = str(k, value);
                if (v) {
                  partial.push(quote(k) + (gap ? ': ' : ':') + v);
                }
              }
            }
          } else {

            for (k in value) {
              if (Object.prototype.hasOwnProperty.call(value, k)) {
                v = str(k, value);
                if (v) {
                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                }
              }
            }
          }

          v = partial.length === 0 ?
              '{}' : gap ?
            '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
              : '{' + partial.join(',') + '}';
          gap = mind;
          return v;
      }
    }

    return function (value, replacer, space) {

      var i;
      gap = '';
      indent = '';

      if (typeof space === 'number') {
        for (i = 0; i < space; i += 1) {
          indent += ' ';
        }
      } else if (typeof space === 'string') {
        indent = space;
      }

      rep = replacer;
      if (replacer && typeof replacer !== 'function' &&
              (typeof replacer !== 'object' ||
              typeof replacer.length !== 'number')) {
        throw new Error('JSON.stringify');
      }
      return str('', {'': value});
    };
  }
};

// test JSON.stringify since some old libraries don't implement it correctly
var testData = {a:[{b:1}]};
try {
  var serialized = JSON.stringify(testData);
  if (serialized !== '{"a":[{"b":1}]}') {
    RollbarJSON.stringify = RollbarJSON.setupCustomStringify();
  } else {
    RollbarJSON.stringify = JSON.stringify;
  }
} catch (e) {
  RollbarJSON.stringify = RollbarJSON.setupCustomStringify();
}

if (!window._rollbarInitialized) {
  var shim = window.Rollbar;
  var fullRollbar = new Notifier(shim);
  fullRollbar._processShimQueue(window.RollbarShimQueue || []);
  window.Rollbar = fullRollbar;
  window._rollbarInitialized = true;
}
})(window, document);