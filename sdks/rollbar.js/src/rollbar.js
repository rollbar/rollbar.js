/*jslint continue: true, nomen: true, plusplus: true, regexp: true, vars: true, white: true, passfail: false, indent: 2 */
(function(window, document) {
  'use strict';

  var parseUriOptions = {
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
  };

  function parseUri(str) {
    var o = parseUriOptions;
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
  }

  function sanitizeUrl(url) {
    if (url) {
      var baseUrlParts = parseUri(url);
      // remove a trailing # if there is no anchor
      if (baseUrlParts.anchor === '') {
        baseUrlParts.source = baseUrlParts.source.replace('#', '');
      }
      var baseUrl = baseUrlParts.source.replace('?' + baseUrlParts.query, ''); 
      url = baseUrl;
    }
    return url;
  }
  

  /*
   * Derived work from raven-js at https://github.com/lincolnloop/raven-js
   */

  var StackTrace = function(exc) {
    var frames = [];

    if (exc.arguments && exc.stack) {
      frames = this.parseChromeExc(exc);
    } else if (exc.stack) {
      if (exc.stack.indexOf('@') === -1) {
        frames = this.parseChromeExc(exc);
      } else {
        frames = this.parseFirefoxOrSafariExc(exc);
      }
    } else {
      var lineno = parseInt(typeof exc.line !== 'undefined' ? exc.line : exc.lineNumber, 10) || 0;
      var fileUrl = sanitizeUrl((typeof exc.sourceURL !== 'undefined' ? exc.sourceURL : exc.fileName) || null);

      frames = [{filename: fileUrl, lineno: lineno}];
    }
    this.frames = frames.reverse();
  };

  StackTrace.prototype.parseChromeExc = function(e) {
    var chunks, fn, filename, lineno, colno,
        traceback = [],
        lines = e.stack.split('\n'),
        i, line, len = lines.length, frames = [];

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
        fn = chunks[0];
        filename = chunks.slice(1).join(' ');
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
        var lineNoRegex = /:([0-9]+(:([0-9]+))?)$/;
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
          filename = sanitizeUrl(filename.slice(0, filename.indexOf(lineNoMatch[0])));
        } else {
          lineno = 0;
          colno = null;
        }
      }

      frames.push({filename: filename, lineno: lineno, colno: colno, method: fn});
    } 
    return frames;
  };

  StackTrace.prototype.parseFirefoxOrSafariExc = function(e) {
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
          filename = sanitizeUrl(filename.slice(0, -1).join(':')) || '<native code>';
        } else if (chunks[0] === '[native code]') {
          fn = null;
          filename = '<native code>';
          lineno = 0;
        }
        
        var frame = {filename: filename, lineno: lineno, method: fn};
        
        // Firefox gives a column number for the first frame
        if (i == 0 && e.columnNumber) {
          // Add 1 to represent a column number starting from 1 since Firefox
          // provides a 0-based column number
          frame.colno = e.columnNumber + 1;
        }
        
        frames.push(frame);
      }
    }
    return frames;
  };


  /*
   * Derived work from json2.js at http://www.JSON.org/js.html
   */

  function setupCustomStringify() {

    function f(n) {
      // Format integers to have at least two digits.
      return n < 10 ? '0' + n : n;
    }

    Date.prototype.toRollbarJSON = function (key) {

        return isFinite(this.valueOf())
            ? this.getUTCFullYear()     + '-' +
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
        return typeof c === 'string'
            ? c
            : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
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

            v = partial.length === 0
                ? '[]'
                : gap
                ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                : '[' + partial.join(',') + ']';
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

          v = partial.length === 0
              ? '{}'
              : gap
              ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
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

  /*** END json2.js ***/

  var ERR_CLASS_REGEXP = new RegExp('^(([a-zA-Z0-9-_$ ]*): *)?(Uncaught )?([a-zA-Z0-9-_$ ]*): ');

  var RollbarNotifier = {
    accessToken: null,
    extraParams: null,
    handler: null,
    items: [],
    browserPlugins: [],
    logger: null,
    defaultLevel: 'warning',
    itemsPerMinute: 5,
    pastMinuteItems: 0,
    checkIgnore: null,
    
    initialize: function(accessToken, params, environment, logger) {
      this.accessToken = accessToken;
      this.environment = environment || params['server.environment'];
      this.defaultLevel = params.level || this.defaultLevel;
      this.itemsPerMinute = (params.itemsPerMinute || params.itemsPerMinute == 0 ? params.itemsPerMinute : this.itemsPerMinute);
      this.extraParams = params;
      this.startTime = (new Date()).getTime();
      this.logger = logger || (window.console ? function(args) { window.console.log(args); } : function(){});
      this.checkIgnore = params.checkIgnore || this.checkIgnore;
      
      if (params.endpoint) {
        this.endpoint = params.endpoint;
      } else {
        var protocol;
        if (window.location.protocol.indexOf('http') === 0) {
          protocol = window.location.protocol;
        } else {
          protocol = 'https:';
        }
        this.endpoint = protocol + '//api.rollbar.com/api/1/';
      }

      var navPlugins = (window.navigator.plugins || []);
      var cur;
      var i;
      var numPlugins = navPlugins.length;
      for (i = 0; i < numPlugins; ++i) {
        cur = navPlugins[i];
        this.browserPlugins.push({name: cur.name, description: cur.description});
      }
    },

    XMLHttpFactories: [
        function () {return new XMLHttpRequest();},
        function () {return new ActiveXObject("Msxml2.XMLHTTP");},
        function () {return new ActiveXObject("Msxml3.XMLHTTP");},
        function () {return new ActiveXObject("Microsoft.XMLHTTP");}
    ],

    createXMLHTTPObject: function() {
      var xmlhttp = false;
      var factories = RollbarNotifier.XMLHttpFactories;
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
    
    push: function(args, callback) {
      if (args instanceof Error) {
        this.handleError(args, callback);
      } else if (typeof args == 'object' && 
        !args.hasOwnProperty('msg') &&
        args.hasOwnProperty(0) && args.hasOwnProperty(1) && args.hasOwnProperty(2)) {
        // 'args instanceof Array' for above check doesn't work.
        this.handleUncaughtError(args[0], args[1], args[2]);
      } else if (typeof args == 'object' &&
        args.hasOwnProperty("_t") &&
        args['_t'] === 'uncaught') {
        this.handleUncaughtError(args.e, args.u, args.l);
      } else if (typeof args == 'object' &&
        args.hasOwnProperty("_t") &&
        args['_t'] === 'trace') {
        this.handleErrorTrace(args, callback);
      } else if (typeof args == 'object') {
        this.handleMessage(args, callback);
      } else {
        this.handleMessage({level: 'info', msg: args.toString()}, callback);
      }
    },

    // obj should be an object with the following keys. only 'msg' is required.
    // msg: the message string
    // level: one of ['critical', 'error', 'warning', 'info', 'debug'] (defaults to 'info')
    // can also contain any additional arbitrary keys, which will be included as well.
    handleMessage: function(obj, callback) {
      if (!obj.msg) {
        var errorMsg = "Object argument must contain the property 'msg'";
        this.logger(errorMsg);
        if (callback) {
          callback(new Error(errorMsg));
        }
        
        return;
      }
      
      var k;
      var level = obj.level || 'info';
      var item = {
        level: level,
        body: {
          message: { body: obj.msg }
        }
      };
      if (obj._fingerprint) {
        item.fingerprint = obj._fingerprint;
      }
      
      // add other keys to body.message
      for (k in obj) {
        if (obj.hasOwnProperty(k) && k !== 'level' && k !== 'msg' && k !== '_fingerprint') {
          item.body.message[k] = obj[k];
        }
      }
      
      if (callback) {
        item.callback = callback;
      }
      
      this.items.push(item);
      this.handleEvents();
    },
    
    handleUncaughtError: function(errMsg, url, lineNo) {
      errMsg = errMsg || 'uncaught exception';
      url = url || '(unknown)';
      lineNo = lineNo || 0;

      if (this.checkIgnore !== null) {
        try {
          if (this.checkIgnore(errMsg, url, lineNo) === true) {
            return;
          }
        } catch (e) {
          this.logger('Exception during check ignore: ' + e);
        }
      }
      
      var baseUrl = sanitizeUrl(url);
      var frames = [{filename: baseUrl, lineno: parseInt(lineNo, 10) || null}];
      var errClassMatch = errMsg.match(ERR_CLASS_REGEXP);
      var errClass = '(unknown)';
      
      if (errClassMatch) {
        errClass = errClassMatch[errClassMatch.length - 1];
        errMsg = errMsg.replace((errClassMatch[errClassMatch.length - 2] || '') + errClass + ':', '');
        errMsg = errMsg.replace(/(^[\s]+|[\s]+$)/g, '');
      }

      this._pushTrace({
        exception: {
          'class': errClass,
          message: errMsg
        },
        frames: frames
      }, null);
    },
    
    handleError: function(err, callback) {
      var className = err.name || typeof err;
      var message = err.message || err.toString();
      var trace = {
        exception: {
          'class': className,
          message: message
        }
      };

      if (err.stack) {
        var st = new StackTrace(err);
        var frames = st.frames;
        if (frames) {
          trace.frames = frames;
        } 
      }

      if (!trace.frames) {
        // no frames - not useful as a trace. just report as a message.
        this.handleMessage({msg: className + ': ' + message, level: 'error'}, callback);
      } else {
        this._pushTrace(trace, callback);
      }
    },
    
    /*
    * Reports raw trace objects. This is used for building enhanced or modified stack traces.
    *
    * var trace = {
    *  exception: {'class': 'TypeError', 'message': 'blah'},
    *  frames: [{filename: 'http://example.com/script.js', method: 'doSomething', lineno: 55}, ...]
    * }
    *
    * To call via _rollbar.push():
    * _rollbar.push({_t: 'trace', trace: trace});
    *
    */
    handleErrorTrace: function(obj, callback) {
      if (!obj.trace) {
        var errorMsg = "Trace objects must contain the property 'trace'";
        this.logger(errorMsg);
        if (callback) {
          callback(new Error(errorMsg));
        }
        return;
      }

      this._pushTrace(obj.trace, callback);
    },

    /*
    * Pushes a trace object onto the queue and calls handleEvents()
    */
    _pushTrace: function(trace, callback) {
      var item = {body: {trace: trace}};
      if (callback) {
        item.callback = callback;
      }

      this.items.push(item);
      this.handleEvents();
    },

    handleEvents: function() {
      if (this.handler) {
        clearTimeout(this.handler);
      }
      this.handler = setTimeout(this.asyncHandler, 200);
    },
    
    asyncHandler: function() {
      var item;
      var payload;
      var buildPayload = RollbarNotifier.buildPayload;
      var postItem = RollbarNotifier.postItem;
      try {
        item = RollbarNotifier.items.shift();
        while (item) {
          payload = buildPayload(item);
          RollbarNotifier.postItem(payload, item.callback);
          item = RollbarNotifier.items.shift();
        }
      } catch (exc) {
        RollbarNotifier.printInternalError(exc);
      }
    },

    postItem: function(payload, itemCallback) {
      // Only send this item if there have been less than itemsPerMinute in the
      // past minute
      if (this.pastMinuteItems < this.itemsPerMinute) {
        var context = this;
        
        if (this.pastMinuteItems === 0) {
          setTimeout(function() {
            context.pastMinuteItems = 0;
          }, 60000);
        }
        
        this.pastMinuteItems++;
      } else if (this.itemsPerMinute > 0) {
        return;
      }
      
      var request = RollbarNotifier.createXMLHTTPObject();
      if (request) {
        
        try {
          try {
            var onreadystatechange = function(args) {
              try {
                if (itemCallback && onreadystatechange && request.readyState === 4) {
                  onreadystatechange = undefined;
                  
                  if (request.status === 200) {
                    itemCallback(null);
                  } else if (typeof(request.status) === "number"
                             && request.status >= 400  && request.status < 600) {
                    //return valid http status codes
                    itemCallback(new Error(request.status.toString()));
                  } else {
                    //IE will return a status 12000+ on some sort of connection failure,
                    //so we return a blank error
                    //http://msdn.microsoft.com/en-us/library/aa383770%28VS.85%29.aspx
                    itemCallback(new Error());
                  }
                }
              } catch (firefoxAccessException) {
                //jquery source mentions firefox may error out while accessing the
                //request members if there is a network error
                //https://github.com/jquery/jquery/blob/a938d7b1282fc0e5c52502c225ae8f0cef219f0a/src/ajax/xhr.js#L111
                itemCallback(new Error());
              }
            };
            
            request.open('POST', RollbarNotifier.endpoint + 'item/', true);
            if (request.setRequestHeader) {
              request.setRequestHeader('Content-Type', 'application/json');
            }
            request.onreadystatechange = onreadystatechange;
            request.send(payload);
          } catch (e1) {
            // Sending using the normal xmlhttprequest object didn't work, try XDomainRequest
            if (typeof XDomainRequest !== "undefined") {
              var ontimeout = function(args) {
                if (itemCallback) {
                  itemCallback(new Error());
                }
              };
              
              var onerror = function(args) {
                if (itemCallback) {
                  itemCallback(new Error());
                }
              };
              
              var onload = function(args) {
                if (itemCallback) {
                  itemCallback();
                }
              };
            
              request = new XDomainRequest();
              request.onprogress = function() {};
              request.ontimeout = ontimeout;
              request.onerror = onerror;
              request.onload = onload;
              request.open('POST', RollbarNotifier.endpoint + 'item/', true);
              request.send(payload);
            }
          }
        } catch (e2) {
          // ignore
        }
      }
    },
    
    buildPayload: function(item) {
      var payload = {
        access_token: RollbarNotifier.accessToken,
        data: {
          environment: RollbarNotifier.environment,
          level: RollbarNotifier.defaultLevel,
          platform: 'browser',
          framework: 'browser-js',
          language: 'javascript',
          request: {
            url: window.location.href,
            query_string: window.location.search,
            user_ip: "$remote_ip"
          },
          client: {
            runtime_ms: (new Date()).getTime() - RollbarNotifier.startTime,
            timestamp: Math.round((new Date()).getTime() / 1000),
            javascript: {
              browser: window.navigator.userAgent,
              language: window.navigator.language,
              cookie_enabled: window.navigator.cookieEnabled,
              screen: {
                width: window.screen.width,
                height: window.screen.height
              },
              plugins: RollbarNotifier.browserPlugins
            }
          },
          server: {},
          notifier: {name: 'rollbar-browser-js', version: '0.9.6'}
        }
      };
      var k;
      var i;
      var value;
      var path;
      var target;

      // grab body, any other params set
      for (k in item) {
        if (item.hasOwnProperty(k)) {
          payload.data[k] = item[k];
        }
      }

      // merge in user-supplied params
      var extraParams = RollbarNotifier.extraParams;
      for (k in extraParams) {
        if (extraParams.hasOwnProperty(k)) {
          value = extraParams[k];
          path = k.split(".");
          
          // traverse the path to second-to-last elem
          target = payload.data;
          for (i = 0; i < path.length - 1; i++) {
            target = target[path[i]];
          }

          // now save
          target[path[path.length - 1]] = value;
        }
      }

      return RollbarNotifier.stringify(payload);
    },

    printInternalError: function(exc) {
      if (RollbarNotifier.logger) {
        RollbarNotifier.logger('Internal rollbar error: ' + exc);
      }
    }
    
  };

  // test JSON.stringify since some old libraries don't implement it correctly
  var testData = {a:[{b:1}]};
  try {
    var serialized = JSON.stringify(testData);
    if (serialized !== '{"a":[{"b":1}]}') {
      RollbarNotifier.stringify = setupCustomStringify();
    } else {
      RollbarNotifier.stringify = JSON.stringify;
    }
  } catch (e) {
    RollbarNotifier.stringify = setupCustomStringify();
  }

  // Initialize the global rollbar notifier instance
  var _global = window._rollbar || window._ratchet;
  if (typeof _global !== 'undefined' && _global.shift) {
    var accessToken = _global.shift();
    var extraParams = _global.shift();
    var notifier = RollbarNotifier;
    var preSetupErrors = _global;
    var err = preSetupErrors.shift();
    notifier.initialize(accessToken, extraParams);

    // Initialize window._rollbar and window._ratchet to support older versions of rollbar
    window._rollbar = notifier;
    window._ratchet = notifier;

    while (err) {
      notifier.push(err);
      err = preSetupErrors.shift();
    }
  }

  /*** END rollbar.js ***/

})(window, document);
