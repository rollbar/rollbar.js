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
      this.environment = environment || params['server.environment'] || 'unspecified';
      this.defaultLevel = params.level || this.defaultLevel;
      this.itemsPerMinute = (params.itemsPerMinute || params.itemsPerMinute == 0 ? params.itemsPerMinute : this.itemsPerMinute);
      this.extraParams = {};
      this.startTime = (new Date()).getTime();
      this.logger = logger || (window.console ? function(args) { window.console.log(args); } : function(){});
      this.checkIgnore = params.checkIgnore || this.checkIgnore;
      this.scrubFields = params.scrubFields || ['passwd', 'password', 'secret', 'confirm_password', 'password_confirmation'];
      this.scrubQueryParamRes = [];
      this.scrubParamRes = [];

      var numFields = this.scrubFields.length;
      var paramPat;
      var i;

      // Build two lists of regular expression objects. The first will be used to see
      // if the key's name matches something that we want to scrub. The second is for
      // scrubbing things that look like query params.
      for (i = 0; i < numFields; ++i) {
        paramPat = '\\[?(%5[bB])?' + this.scrubFields[i] + '\\[?(%5[bB])?\\]?(%5[dD])?';
        this.scrubParamRes.push(new RegExp(paramPat, 'i'));
        this.scrubQueryParamRes.push(new RegExp('(' + paramPat + '=)([^&\\n]+)', 'igm'));
      }
      
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
      var numPlugins = navPlugins.length;
      for (i = 0; i < numPlugins; ++i) {
        cur = navPlugins[i];
        this.browserPlugins.push({name: cur.name, description: cur.description});
      }
      
      // merge in user-supplied params
      var k;
      for (k in params) {
        if (params.hasOwnProperty(k)) {
          this.parseParam(k, params[k]);
        }
      }
    },
    
    parseParam: function(key, value) {
      var path = key.split(".");
      
      // traverse the path to second-to-last elem
      var target = this.extraParams;
      var i;
      for (i = 0; i < path.length - 1; i++) {
        if (!target.hasOwnProperty(path[i])) {
          target[path[i]] = {};
        }
        target = target[path[i]];
      }

      // now save
      target[path[path.length - 1]] = value;
    },
    
    mergeObjects: function(obj1, obj2) {
      var k;
      for (k in obj2) {
        if (obj2[k].constructor == Object) {
          if (!obj1.hasOwnProperty(k)) {
            obj1[k] = obj2[k];
          } else {
            obj1[k] = RollbarNotifier.mergeObjects(obj1[k], obj2[k]);
          }
        } else {
          obj1[k] = obj2[k];
        }
      }
      
      return obj1;
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
      if (typeof args === 'object' && args._rollbarParams) {
        var k;
        for (k in args._rollbarParams) {
          this.parseParam(k, args._rollbarParams[k]);
        }
      } else if (args instanceof Error) {
        this.handleError(args, callback);
      } else if (typeof args == 'object' && 
        !args.hasOwnProperty('msg') &&
        args.hasOwnProperty(0) && args.hasOwnProperty(1) && args.hasOwnProperty(2)) {
        // 'args instanceof Array' for above check doesn't work.
        this.handleUncaughtError(args[0], args[1], args[2]);
      } else if (typeof args == 'object' &&
        args.hasOwnProperty("_t") &&
        args['_t'] === 'uncaught') {
        this.handleUncaughtError(args.e, args.u, args.l, args.c, args.err);
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
    
    handleUncaughtError: function(errMsg, url, lineNo, colNo, error) {

      errMsg = errMsg || 'uncaught exception';
      url = url || '(unknown)';
      lineNo = lineNo || 0;

      if (this.checkIgnore !== null) {
        try {
          if (this.checkIgnore(errMsg, url, lineNo, colNo, error) === true) {
            return;
          }
        } catch (e) {
          this.logger('Exception during check ignore: ' + e);
        }
      }

      // Make sure this is a valid uncaught error.
      // NOTE(cory): sometimes users will trigger an "error" event
      // on the window object directly which will result in errMsg
      // being an Object instead of a string.
      //
      if (url && url.hasOwnProperty('stack')) {
        // If this is not actually an uncaught error, we'll have a
        // valid stack trace so let's _rollbar.push() the error.
        this.push(url);
        return;
      } else if (error && error.hasOwnProperty('stack')) {
        // Newer versions of browsers are sending through the column number
        // and the error.
        this.push(error);
        return;
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

      var item = {body: {trace: obj.trace}};
      if (callback) {
        item.callback = callback;
      }

      // merge other props as top-level
      for (var k in obj) {
        if (k !== 'trace' && k !== '_t') {
          item[k] = obj[k];
        }
      }

      this.items.push(item);
      this.handleEvents();
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
    
    internalCheckIgnore: function(item) {
      var plugins = null;
      try {
        plugins = RollbarNotifier.extraParams.notifier.plugins;
      } catch (e) {
        // pass
      }
      
      if (plugins && plugins.jquery && plugins.jquery.ignoreAjaxErrors
          && item.body.message && item.body.message.jquery_ajax_error) {
        return true;
      }
      
      return false;
    },
    
    asyncHandler: function() {
      var item;
      var payload;
      var buildPayload = RollbarNotifier.buildPayload;
      var postItem = RollbarNotifier.postItem;
      try {
        item = RollbarNotifier.items.shift();
        while (item) {
          if (!RollbarNotifier.internalCheckIgnore(item)) {
            var uuid = RollbarNotifier.uuid4();
            var origCallback = item.callback;
            var wrappedCallback;

            if (origCallback) {
              wrappedCallback = function(err) {
                return origCallback(err, uuid);
              }
            }

            item.uuid = uuid;
            payload = buildPayload(item);
            RollbarNotifier.postItem(payload, wrappedCallback);
          }
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
                  itemCallback(null);
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
          notifier: {name: 'rollbar-browser-js', version: '0.10.8'}
        }
      };

      RollbarNotifier.mergeObjects(payload.data, RollbarNotifier.extraParams);

      // grab body, any other params set
      var k;
      for (k in item) {
        if (item.hasOwnProperty(k)) {
          payload.data[k] = item[k];
        }
      }

      RollbarNotifier.scrubObj(payload);

      return RollbarNotifier.stringify(payload);
    },

    scrubObj: function(obj) {
      var traverse = function(o, func) {
        var k;
        var v;
        for (k in o) {
          if (o.hasOwnProperty(k)) {
            v = o[k];
            if (v !== null && typeof(v) === 'object') {
              traverse(v, func);
            } else {
              o[k] = func.apply(this, [k, v]);
            }
          }
        }
      };

      var redactVal = function(val) {
        val = new String(val);
        return new Array(val.length + 1).join('*');
      };

      var redactQueryParam = function(match, paramPart, dummy1,
          dummy2, dummy3, valPart, offset, string) {
        return paramPart + redactVal(valPart);
      };

      var scrubFields = RollbarNotifier.scrubFields;
      var queryRes = RollbarNotifier.scrubQueryParamRes;
      var paramRes = RollbarNotifier.scrubParamRes;
      var paramScrubber = function(v) {
        var i;
        if (typeof(v) === 'string') {
          for (i = 0; i < queryRes.length; ++i) {
            v = v.replace(queryRes[i], redactQueryParam);
          }
        }
        return v;
      };

      var valScrubber = function(k, v) {
        var i;
        for (i = 0; i < paramRes.length; ++i) {
          if (paramRes[i].test(k)) {
            v = redactVal(v);
            break;
          }
        }
        return v;
      };

      var scrubber = function(k, v) {
        var tmpV = valScrubber(k, v);
        if (tmpV === v) {
          return paramScrubber(tmpV);
        } else {
          return tmpV;
        }
      };

      traverse(obj, scrubber);
    },

    printInternalError: function(exc) {
      if (RollbarNotifier.logger) {
        RollbarNotifier.logger('Internal rollbar error: ' + exc);
      }
    },

    // from http://stackoverflow.com/a/8809472/1138191
    uuid4: function() {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
      });
      return uuid;
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
  
  // Export `RollbarNotifier` to window
  // (Used for embedded implemetations and other instances where 
  // the library is loaded before `_rollbar` is setup)
  window['RollbarNotifier'] = RollbarNotifier;

  /*** END rollbar.js ***/

})(window, document);
