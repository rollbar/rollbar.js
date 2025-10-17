/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/

// UNUSED EXPORTS: default

// NAMESPACE OBJECT: ./src/browser/url.js
var url_namespaceObject = {};
__webpack_require__.r(url_namespaceObject);
__webpack_require__.d(url_namespaceObject, {
  parse: function() { return parse; }
});

;// ./src/merge.js
var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var isPlainObject = function isPlainObject(obj) {
  if (!obj || toStr.call(obj) !== '[object Object]') {
    return false;
  }
  var hasOwnConstructor = hasOwn.call(obj, 'constructor');
  var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
  // Not own constructor property must be Object
  if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
    return false;
  }

  // Own properties are enumerated firstly, so to speed up,
  // if last one is own, then all properties are own.
  var key;
  for (key in obj) {
    /**/
  }
  return typeof key === 'undefined' || hasOwn.call(obj, key);
};
function merge() {
  var i,
    src,
    copy,
    clone,
    name,
    result = Object.create(null),
    // no prototype pollution on Object
    current = null,
    length = arguments.length;
  for (i = 0; i < length; i++) {
    current = arguments[i];
    if (current == null) {
      continue;
    }
    for (name in current) {
      src = result[name];
      copy = current[name];
      if (result !== copy) {
        if (copy && isPlainObject(copy)) {
          clone = src && isPlainObject(src) ? src : {};
          result[name] = merge(clone, copy);
        } else if (typeof copy !== 'undefined') {
          result[name] = copy;
        }
      }
    }
  }
  return result;
}
/* harmony default export */ var src_merge = (merge);
;// ./src/utility.js
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }


/*
 * isType - Given a Javascript value and a string, returns true if the type of the value matches the
 * given string.
 *
 * @param x - any value
 * @param t - a lowercase string containing one of the following type names:
 *    - undefined
 *    - null
 *    - error
 *    - number
 *    - boolean
 *    - string
 *    - symbol
 *    - function
 *    - object
 *    - array
 * @returns true if x is of type t, otherwise false
 */
function isType(x, t) {
  return t === typeName(x);
}

/*
 * typeName - Given a Javascript value, returns the type of the object as a string
 */
function typeName(x) {
  var name = _typeof(x);
  if (name !== 'object') {
    return name;
  }
  if (!x) {
    return 'null';
  }
  if (x instanceof Error) {
    return 'error';
  }
  return {}.toString.call(x).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

/* isFunction - a convenience function for checking if a value is a function
 *
 * @param f - any value
 * @returns true if f is a function, otherwise false
 */
function isFunction(f) {
  return isType(f, 'function');
}

/* isNativeFunction - a convenience function for checking if a value is a native JS function
 *
 * @param f - any value
 * @returns true if f is a native JS function, otherwise false
 */
function isNativeFunction(f) {
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var funcMatchString = Function.prototype.toString.call(Object.prototype.hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?');
  var reIsNative = RegExp('^' + funcMatchString + '$');
  return isObject(f) && reIsNative.test(f);
}

/* isObject - Checks if the argument is an object
 *
 * @param value - any value
 * @returns true is value is an object function is an object)
 */
function isObject(value) {
  var type = _typeof(value);
  return value != null && (type == 'object' || type == 'function');
}

/* isString - Checks if the argument is a string
 *
 * @param value - any value
 * @returns true if value is a string
 */
function isString(value) {
  return typeof value === 'string' || value instanceof String;
}

/**
 * isFiniteNumber - determines whether the passed value is a finite number
 *
 * @param {*} n - any value
 * @returns true if value is a finite number
 */
function isFiniteNumber(n) {
  return Number.isFinite(n);
}

/*
 * isDefined - a convenience function for checking if a value is not equal to undefined
 *
 * @param u - any value
 * @returns true if u is anything other than undefined
 */
function isDefined(u) {
  return !isType(u, 'undefined');
}

/*
 * isIterable - convenience function for checking if a value can be iterated, essentially
 * whether it is an object or an array.
 *
 * @param i - any value
 * @returns true if i is an object or an array as determined by `typeName`
 */
function isIterable(i) {
  var type = typeName(i);
  return type === 'object' || type === 'array';
}

/*
 * isError - convenience function for checking if a value is of an error type
 *
 * @param e - any value
 * @returns true if e is an error
 */
function isError(e) {
  // Detect both Error and Firefox Exception type
  return isType(e, 'error') || isType(e, 'exception');
}

/* isPromise - a convenience function for checking if a value is a promise
 *
 * @param p - any value
 * @returns true if f is a function, otherwise false
 */
function isPromise(p) {
  return isObject(p) && isType(p.then, 'function');
}

/**
 * isBrowser - a convenience function for checking if the code is running in a browser
 *
 * @returns true if the code is running in a browser environment
 */
function isBrowser() {
  return typeof window !== 'undefined';
}
function redact() {
  return '********';
}

// from http://stackoverflow.com/a/8809472/1138191
function uuid4() {
  var d = utility_now();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : r & 0x7 | 0x8).toString(16);
  });
  return uuid;
}
var LEVELS = {
  debug: 0,
  info: 1,
  warning: 2,
  error: 3,
  critical: 4
};
function sanitizeHref(url) {
  try {
    var urlObject = new URL(url);
    if (urlObject.password) {
      urlObject.password = redact();
    }
    if (urlObject.search) {
      urlObject.search = redact();
    }
    return urlObject.toString();
  } catch (_) {
    return url; // Return original URL if parsing fails
  }
}
function sanitizeUrl(url) {
  var baseUrlParts = parseUri(url);
  if (!baseUrlParts) {
    return '(unknown)';
  }

  // remove a trailing # if there is no anchor
  if (baseUrlParts.anchor === '') {
    baseUrlParts.source = baseUrlParts.source.replace('#', '');
  }
  url = baseUrlParts.source.replace('?' + baseUrlParts.query, '');
  return url;
}
var parseUriOptions = {
  strictMode: false,
  key: ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'],
  q: {
    name: 'queryKey',
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};
function parseUri(str) {
  if (!isType(str, 'string')) {
    return undefined;
  }
  var o = parseUriOptions;
  var m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str);
  var uri = {};
  for (var i = 0, l = o.key.length; i < l; ++i) {
    uri[o.key[i]] = m[i] || '';
  }
  uri[o.q.name] = {};
  uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
    if ($1) {
      uri[o.q.name][$1] = $2;
    }
  });
  return uri;
}
function addParamsAndAccessTokenToPath(accessToken, options, params) {
  params = params || {};
  params.access_token = accessToken;
  var paramsArray = [];
  var k;
  for (k in params) {
    if (Object.prototype.hasOwnProperty.call(params, k)) {
      paramsArray.push([k, params[k]].join('='));
    }
  }
  var query = '?' + paramsArray.sort().join('&');
  options = options || {};
  options.path = options.path || '';
  var qs = options.path.indexOf('?');
  var h = options.path.indexOf('#');
  var p;
  if (qs !== -1 && (h === -1 || h > qs)) {
    p = options.path;
    options.path = p.substring(0, qs) + query + '&' + p.substring(qs + 1);
  } else {
    if (h !== -1) {
      p = options.path;
      options.path = p.substring(0, h) + query + p.substring(h);
    } else {
      options.path = options.path + query;
    }
  }
}
function formatUrl(u, protocol) {
  protocol = protocol || u.protocol;
  if (!protocol && u.port) {
    if (u.port === 80) {
      protocol = 'http:';
    } else if (u.port === 443) {
      protocol = 'https:';
    }
  }
  protocol = protocol || 'https:';
  if (!u.hostname) {
    return null;
  }
  var result = protocol + '//' + u.hostname;
  if (u.port) {
    result = result + ':' + u.port;
  }
  if (u.path) {
    result = result + u.path;
  }
  return result;
}
function stringify(obj, backup) {
  var value, error;
  try {
    value = JSON.stringify(obj);
  } catch (jsonError) {
    if (backup && isFunction(backup)) {
      try {
        value = backup(obj);
      } catch (backupError) {
        error = backupError;
      }
    } else {
      error = jsonError;
    }
  }
  return {
    error: error,
    value: value
  };
}
function maxByteSize(string) {
  // The transport will use utf-8, so assume utf-8 encoding.
  //
  // This minimal implementation will accurately count bytes for all UCS-2 and
  // single code point UTF-16. If presented with multi code point UTF-16,
  // which should be rare, it will safely overcount, not undercount.
  //
  // While robust utf-8 encoders exist, this is far smaller and far more performant.
  // For quickly counting payload size for truncation, smaller is better.

  var count = 0;
  var length = string.length;
  for (var i = 0; i < length; i++) {
    var code = string.charCodeAt(i);
    if (code < 128) {
      // up to 7 bits
      count = count + 1;
    } else if (code < 2048) {
      // up to 11 bits
      count = count + 2;
    } else if (code < 65536) {
      // up to 16 bits
      count = count + 3;
    }
  }
  return count;
}
function jsonParse(s) {
  var value, error;
  try {
    value = JSON.parse(s);
  } catch (e) {
    error = e;
  }
  return {
    error: error,
    value: value
  };
}
function makeUnhandledStackInfo(message, url, lineno, colno, error, mode, backupMessage, errorParser) {
  var location = {
    url: url || '',
    line: lineno,
    column: colno
  };
  location.func = errorParser.guessFunctionName(location.url, location.line);
  location.context = errorParser.gatherContext(location.url, location.line);
  var href = typeof document !== 'undefined' && document && document.location && document.location.href;
  var useragent = typeof window !== 'undefined' && window && window.navigator && window.navigator.userAgent;
  return {
    mode: mode,
    message: error ? String(error) : message || backupMessage,
    url: href,
    stack: [location],
    useragent: useragent
  };
}
function wrapCallback(logger, f) {
  return function (err, resp) {
    try {
      f(err, resp);
    } catch (e) {
      logger.error(e);
    }
  };
}
function nonCircularClone(obj) {
  var seen = [obj];
  function clone(obj, seen) {
    var value,
      name,
      newSeen,
      result = {};
    try {
      for (name in obj) {
        value = obj[name];
        if (value && (isType(value, 'object') || isType(value, 'array'))) {
          if (seen.includes(value)) {
            result[name] = 'Removed circular reference: ' + typeName(value);
          } else {
            newSeen = seen.slice();
            newSeen.push(value);
            result[name] = clone(value, newSeen);
          }
          continue;
        }
        result[name] = value;
      }
    } catch (e) {
      result = 'Failed cloning custom data: ' + e.message;
    }
    return result;
  }
  return clone(obj, seen);
}
function createItem(args, logger, notifier, requestKeys, lambdaContext) {
  var message, err, custom, callback, request;
  var arg;
  var extraArgs = [];
  var diagnostic = {};
  var argTypes = [];
  for (var i = 0, l = args.length; i < l; ++i) {
    arg = args[i];
    var typ = typeName(arg);
    argTypes.push(typ);
    switch (typ) {
      case 'undefined':
        break;
      case 'string':
        message ? extraArgs.push(arg) : message = arg;
        break;
      case 'function':
        callback = wrapCallback(logger, arg);
        break;
      case 'date':
        extraArgs.push(arg);
        break;
      case 'error':
      case 'domexception':
      case 'exception':
        // Firefox Exception type
        err ? extraArgs.push(arg) : err = arg;
        break;
      case 'object':
      case 'array':
        if (arg instanceof Error || typeof DOMException !== 'undefined' && arg instanceof DOMException) {
          err ? extraArgs.push(arg) : err = arg;
          break;
        }
        if (requestKeys && typ === 'object' && !request) {
          for (var j = 0, len = requestKeys.length; j < len; ++j) {
            if (arg[requestKeys[j]] !== undefined) {
              request = arg;
              break;
            }
          }
          if (request) {
            break;
          }
        }
        custom ? extraArgs.push(arg) : custom = arg;
        break;
      default:
        if (arg instanceof Error || typeof DOMException !== 'undefined' && arg instanceof DOMException) {
          err ? extraArgs.push(arg) : err = arg;
          break;
        }
        extraArgs.push(arg);
    }
  }

  // if custom is an array this turns it into an object with integer keys
  if (custom) custom = nonCircularClone(custom);
  if (extraArgs.length > 0) {
    if (!custom) custom = nonCircularClone({});
    custom.extraArgs = nonCircularClone(extraArgs);
  }
  var item = {
    message: message,
    err: err,
    custom: custom,
    timestamp: utility_now(),
    callback: callback,
    notifier: notifier,
    diagnostic: diagnostic,
    uuid: uuid4()
  };
  item.data = item.data || {};
  setCustomItemKeys(item, custom);
  if (requestKeys && request) {
    item.request = request;
  }
  if (lambdaContext) {
    item.lambdaContext = lambdaContext;
  }
  item._originalArgs = args;
  item.diagnostic.original_arg_types = argTypes;
  return item;
}
function setCustomItemKeys(item, custom) {
  if (custom && custom.level !== undefined) {
    item.level = custom.level;
    delete custom.level;
  }
  if (custom && custom.skipFrames !== undefined) {
    item.skipFrames = custom.skipFrames;
    delete custom.skipFrames;
  }
}
function addErrorContext(item, errors) {
  var custom = item.data.custom || {};
  var contextAdded = false;
  try {
    for (var i = 0; i < errors.length; ++i) {
      if (errors[i].hasOwnProperty('rollbarContext')) {
        custom = src_merge(custom, nonCircularClone(errors[i].rollbarContext));
        contextAdded = true;
      }
    }

    // Avoid adding an empty object to the data.
    if (contextAdded) {
      item.data.custom = custom;
    }
  } catch (e) {
    item.diagnostic.error_context = 'Failed: ' + e.message;
  }
}
var TELEMETRY_TYPES = ['log', 'network', 'dom', 'navigation', 'error', 'manual'];
var TELEMETRY_LEVELS = ['critical', 'error', 'warning', 'info', 'debug'];
function arrayIncludes(arr, val) {
  for (var k = 0; k < arr.length; ++k) {
    if (arr[k] === val) {
      return true;
    }
  }
  return false;
}
function createTelemetryEvent(args) {
  var type, metadata, level;
  var arg;
  for (var i = 0, l = args.length; i < l; ++i) {
    arg = args[i];
    var typ = typeName(arg);
    switch (typ) {
      case 'string':
        if (!type && arrayIncludes(TELEMETRY_TYPES, arg)) {
          type = arg;
        } else if (!level && arrayIncludes(TELEMETRY_LEVELS, arg)) {
          level = arg;
        }
        break;
      case 'object':
        metadata = arg;
        break;
      default:
        break;
    }
  }
  var event = {
    type: type || 'manual',
    metadata: metadata || {},
    level: level
  };
  return event;
}
function addItemAttributes(itemData, attributes) {
  itemData.attributes = itemData.attributes || [];
  var _iterator = _createForOfIteratorHelper(attributes),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var a = _step.value;
      if (a.value === undefined) {
        continue;
      }
      itemData.attributes.push(a);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

/*
 * get - given an obj/array and a keypath, return the value at that keypath or
 *       undefined if not possible.
 *
 * @param obj - an object or array
 * @param path - a string of keys separated by '.' such as 'plugin.jquery.0.message'
 *    which would correspond to 42 in `{plugin: {jquery: [{message: 42}]}}`
 */
function get(obj, path) {
  if (!obj) {
    return undefined;
  }
  var keys = path.split('.');
  var result = obj;
  try {
    for (var i = 0, len = keys.length; i < len; ++i) {
      result = result[keys[i]];
    }
  } catch (e) {
    result = undefined;
  }
  return result;
}
function set(obj, path, value) {
  if (!obj) {
    return;
  }

  // Prevent prototype pollution by setting the prototype to null.
  Object.setPrototypeOf(obj, null);
  var keys = path.split('.');
  var len = keys.length;
  if (len < 1) {
    return;
  }
  if (len === 1) {
    obj[keys[0]] = value;
    return;
  }
  try {
    var temp = obj[keys[0]] || {};
    var replacement = temp;
    for (var i = 1; i < len - 1; ++i) {
      temp[keys[i]] = temp[keys[i]] || {};
      temp = temp[keys[i]];
    }
    temp[keys[len - 1]] = value;
    obj[keys[0]] = replacement;
  } catch (e) {
    return;
  }
}
function formatArgsAsString(args) {
  var i, len, arg;
  var result = [];
  for (i = 0, len = args.length; i < len; ++i) {
    arg = args[i];
    switch (typeName(arg)) {
      case 'object':
        arg = stringify(arg);
        arg = arg.error || arg.value;
        if (arg.length > 500) {
          arg = arg.substr(0, 497) + '...';
        }
        break;
      case 'null':
        arg = 'null';
        break;
      case 'undefined':
        arg = 'undefined';
        break;
      case 'symbol':
        arg = arg.toString();
        break;
    }
    result.push(arg);
  }
  return result.join(' ');
}
function utility_now() {
  if (Date.now) {
    return +Date.now();
  }
  return +new Date();
}
function filterIp(requestData, captureIp) {
  if (!requestData || !requestData['user_ip'] || captureIp === true) {
    return;
  }
  var newIp = requestData['user_ip'];
  if (!captureIp) {
    newIp = null;
  } else {
    try {
      var parts;
      if (newIp.indexOf('.') !== -1) {
        parts = newIp.split('.');
        parts.pop();
        parts.push('0');
        newIp = parts.join('.');
      } else if (newIp.indexOf(':') !== -1) {
        parts = newIp.split(':');
        if (parts.length > 2) {
          var beginning = parts.slice(0, 3);
          var slashIdx = beginning[2].indexOf('/');
          if (slashIdx !== -1) {
            beginning[2] = beginning[2].substring(0, slashIdx);
          }
          var terminal = '0000:0000:0000:0000:0000';
          newIp = beginning.concat(terminal).join(':');
        }
      } else {
        newIp = null;
      }
    } catch (e) {
      newIp = null;
    }
  }
  requestData['user_ip'] = newIp;
}
function handleOptions(current, input, payload, logger) {
  var result = src_merge(current, input, payload);
  result = updateDeprecatedOptions(result, logger);
  if (!input || input.overwriteScrubFields) {
    return result;
  }
  if (input.scrubFields) {
    result.scrubFields = (current.scrubFields || []).concat(input.scrubFields);
  }
  return result;
}
function updateDeprecatedOptions(options, logger) {
  if (options.hostWhiteList && !options.hostSafeList) {
    options.hostSafeList = options.hostWhiteList;
    options.hostWhiteList = undefined;
    logger && logger.log('hostWhiteList is deprecated. Use hostSafeList.');
  }
  if (options.hostBlackList && !options.hostBlockList) {
    options.hostBlockList = options.hostBlackList;
    options.hostBlackList = undefined;
    logger && logger.log('hostBlackList is deprecated. Use hostBlockList.');
  }
  return options;
}

;// ./src/rateLimiter.js


/*
 * RateLimiter - an object that encapsulates the logic for counting items sent to Rollbar
 *
 * @param options - the same options that are accepted by configureGlobal offered as a convenience
 */
function RateLimiter(options) {
  this.startTime = utility_now();
  this.counter = 0;
  this.perMinCounter = 0;
  this.platform = null;
  this.platformOptions = {};
  this.configureGlobal(options);
}
RateLimiter.globalSettings = {
  startTime: utility_now(),
  maxItems: undefined,
  itemsPerMinute: undefined
};

/*
 * configureGlobal - set the global rate limiter options
 *
 * @param options - Only the following values are recognized:
 *    startTime: a timestamp of the form returned by (new Date()).getTime()
 *    maxItems: the maximum items
 *    itemsPerMinute: the max number of items to send in a given minute
 */
RateLimiter.prototype.configureGlobal = function (options) {
  if (options.startTime !== undefined) {
    RateLimiter.globalSettings.startTime = options.startTime;
  }
  if (options.maxItems !== undefined) {
    RateLimiter.globalSettings.maxItems = options.maxItems;
  }
  if (options.itemsPerMinute !== undefined) {
    RateLimiter.globalSettings.itemsPerMinute = options.itemsPerMinute;
  }
};

/*
 * shouldSend - determine if we should send a given item based on rate limit settings
 *
 * @param item - the item we are about to send
 * @returns An object with the following structure:
 *  error: (Error|null)
 *  shouldSend: bool
 *  payload: (Object|null)
 *  If shouldSend is false, the item passed as a parameter should not be sent to Rollbar, and
 *  exactly one of error or payload will be non-null. If error is non-null, the returned Error will
 *  describe the situation, but it means that we were already over a rate limit (either globally or
 *  per minute) when this item was checked. If error is null, and therefore payload is non-null, it
 *  means this item put us over the global rate limit and the payload should be sent to Rollbar in
 *  place of the passed in item.
 */
RateLimiter.prototype.shouldSend = function (item, now) {
  now = now || utility_now();
  var elapsedTime = now - this.startTime;
  if (elapsedTime < 0 || elapsedTime >= 60000) {
    this.startTime = now;
    this.perMinCounter = 0;
  }
  var globalRateLimit = RateLimiter.globalSettings.maxItems;
  var globalRateLimitPerMin = RateLimiter.globalSettings.itemsPerMinute;
  if (checkRate(item, globalRateLimit, this.counter)) {
    return shouldSendValue(this.platform, this.platformOptions, globalRateLimit + ' max items reached', false);
  } else if (checkRate(item, globalRateLimitPerMin, this.perMinCounter)) {
    return shouldSendValue(this.platform, this.platformOptions, globalRateLimitPerMin + ' items per minute reached', false);
  }
  this.counter++;
  this.perMinCounter++;
  var shouldSend = !checkRate(item, globalRateLimit, this.counter);
  var perMinute = shouldSend;
  shouldSend = shouldSend && !checkRate(item, globalRateLimitPerMin, this.perMinCounter);
  return shouldSendValue(this.platform, this.platformOptions, null, shouldSend, globalRateLimit, globalRateLimitPerMin, perMinute);
};
RateLimiter.prototype.setPlatformOptions = function (platform, options) {
  this.platform = platform;
  this.platformOptions = options;
};

/* Helpers */

function checkRate(item, limit, counter) {
  return !item.ignoreRateLimit && limit >= 1 && counter > limit;
}
function shouldSendValue(platform, options, error, shouldSend, globalRateLimit, limitPerMin, perMinute) {
  var payload = null;
  if (error) {
    error = new Error(error);
  }
  if (!error && !shouldSend) {
    payload = rateLimitPayload(platform, options, globalRateLimit, limitPerMin, perMinute);
  }
  return {
    error: error,
    shouldSend: shouldSend,
    payload: payload
  };
}
function rateLimitPayload(platform, options, globalRateLimit, limitPerMin, perMinute) {
  var environment = options.environment || options.payload && options.payload.environment;
  var msg;
  if (perMinute) {
    msg = 'item per minute limit reached, ignoring errors until timeout';
  } else {
    msg = 'maxItems has been hit, ignoring errors until reset.';
  }
  var item = {
    body: {
      message: {
        body: msg,
        extra: {
          maxItems: globalRateLimit,
          itemsPerMinute: limitPerMin
        }
      }
    },
    language: 'javascript',
    environment: environment,
    notifier: {
      version: options.notifier && options.notifier.version || options.version
    }
  };
  if (platform === 'browser') {
    item.platform = 'browser';
    item.framework = 'browser-js';
    item.notifier.name = 'rollbar-browser-js';
  } else if (platform === 'server') {
    item.framework = options.framework || 'node-js';
    item.notifier.name = options.notifier.name;
  } else if (platform === 'react-native') {
    item.framework = options.framework || 'react-native';
    item.notifier.name = options.notifier.name;
  }
  return item;
}
/* harmony default export */ var rateLimiter = (RateLimiter);
;// ./src/queue.js
function queue_typeof(o) { "@babel/helpers - typeof"; return queue_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, queue_typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == queue_typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != queue_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != queue_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


/**
 * Queue - an object which handles which handles a queue of items to be sent to Rollbar.
 *   This object handles rate limiting via a passed in rate limiter, retries based on connection
 *   errors, and filtering of items based on a set of configurable predicates. The communication to
 *   the backend is performed via a given API object.
 */
var Queue = /*#__PURE__*/function () {
  /**
   * @param rateLimiter - An object which conforms to the interface
   *    `rateLimiter.shouldSend(item) -> bool`
   * @param api - An object which conforms to the interface
   *    `api.postItem(payload, function(err, response))`
   * @param logger - An object used to log verbose messages if desired
   * @param options - see `Queue.prototype.configure`
   * @param replay - Optional `Replay` for coordinating session replay with error occurrences
   */
  function Queue(rateLimiter, api, logger, options, replay) {
    _classCallCheck(this, Queue);
    this.rateLimiter = rateLimiter;
    this.api = api;
    this.logger = logger;
    this.options = options;
    this.replay = replay;
    this.predicates = [];
    this.pendingItems = [];
    this.pendingRequests = [];
    this.retryQueue = [];
    this.retryHandle = null;
    this.waitCallback = null;
    this.waitIntervalID = null;
  }

  /**
   * configure - updates the options this queue uses
   *
   * @param options
   */
  return _createClass(Queue, [{
    key: "configure",
    value: function configure(options) {
      var _this$api;
      (_this$api = this.api) === null || _this$api === void 0 || _this$api.configure(options);
      var oldOptions = this.options;
      this.options = src_merge(oldOptions, options);
      return this;
    }

    /**
     * addPredicate - adds a predicate to the end of the list of predicates for this queue
     *
     * @param predicate - function(item, options) -> (bool|{err: Error})
     *  Returning true means that this predicate passes and the item is okay to go on the queue
     *  Returning false means do not add the item to the queue, but it is not an error
     *  Returning {err: Error} means do not add the item to the queue, and the given error explains why
     *  Returning {err: undefined} is equivalent to returning true but don't do that
     */
  }, {
    key: "addPredicate",
    value: function addPredicate(predicate) {
      if (isFunction(predicate)) {
        this.predicates.push(predicate);
      }
      return this;
    }
  }, {
    key: "addPendingItem",
    value: function addPendingItem(item) {
      this.pendingItems.push(item);
    }
  }, {
    key: "removePendingItem",
    value: function removePendingItem(item) {
      var idx = this.pendingItems.indexOf(item);
      if (idx !== -1) {
        this.pendingItems.splice(idx, 1);
      }
    }

    /**
     * addItem - Send an item to the Rollbar API if all of the predicates are satisfied
     *
     * @param item - Item instance with the payload to send to the backend
     * @param callback - function(error, repsonse) which will be called with the response from the API
     *  in the case of a success, otherwise response will be null and error will have a value. If both
     *  error and response are null then the item was stopped by a predicate which did not consider this
     *  to be an error condition, but nonetheless did not send the item to the API.
     * @param originalError - The original error before any transformations that is to be logged if any
     * @param originalItem - The original item before transforms, used in pendingItems queue
     */
  }, {
    key: "addItem",
    value: function addItem(item, callback, originalError, originalItem) {
      var _this = this;
      if (!callback || !isFunction(callback)) {
        callback = function callback() {
          return;
        };
      }
      var data = item.data;
      var predicateResult = this._applyPredicates(data);
      if (predicateResult.stop) {
        this.removePendingItem(originalItem);
        callback(predicateResult.err);
        return;
      }
      this._maybeLog(data, originalError);
      this.removePendingItem(originalItem);
      if (!this.options.transmit) {
        callback(new Error('Transmit disabled'));
        return;
      }
      if (this.replay && data.body) {
        item.replayId = this.replay.capture(null, data.uuid, {
          type: 'occurrence',
          level: item.level
        });
        if (item.replayId) {
          addItemAttributes(item.data, [{
            key: 'replay_id',
            value: item.replayId
          }]);
        }
      }
      this.pendingRequests.push(data);
      try {
        this._makeApiRequest(data, function (err, resp, headers) {
          _this._dequeuePendingRequest(data);
          if (item.replayId) {
            _this.replay.sendOrDiscardReplay(item.replayId, err, resp, headers);
          }
          callback(err, resp);
        });
      } catch (err) {
        this._dequeuePendingRequest(data);
        if (item.replayId) {
          var _this$replay;
          (_this$replay = this.replay) === null || _this$replay === void 0 || _this$replay.discard(item.replayId);
        }
        callback(err);
      }
    }

    /**
     * wait - Stop any further errors from being added to the queue, and get called back when all items
     *   currently processing have finished sending to the backend.
     *
     * @param callback - function() called when all pending items have been sent
     */
  }, {
    key: "wait",
    value: function wait(callback) {
      var _this2 = this;
      if (!isFunction(callback)) {
        return;
      }
      this.waitCallback = callback;
      if (this._maybeCallWait()) {
        return;
      }
      if (this.waitIntervalID) {
        this.waitIntervalID = clearInterval(this.waitIntervalID);
      }
      this.waitIntervalID = setInterval(function () {
        _this2._maybeCallWait();
      }, 500);
    }

    /**
     * Sequentially applies the predicates that have been added to the queue to the
     * given item with the currently configured options.
     *
     * @param item - An item in the queue
     * @returns {stop: bool, err: (Error|null)} - stop being true means do not add item to the queue,
     *   the error value should be passed up to a callbak if we are stopping.
     */
  }, {
    key: "_applyPredicates",
    value: function _applyPredicates(item) {
      var p = null;
      for (var i = 0, len = this.predicates.length; i < len; i++) {
        p = this.predicates[i](item, this.options);
        if (!p || p.err !== undefined) {
          return {
            stop: true,
            err: p.err
          };
        }
      }
      return {
        stop: false,
        err: null
      };
    }

    /**
     * Send an item to Rollbar, callback when done, if there is an error make an
     * effort to retry if we are configured to do so.
     *
     * @param item - an item ready to send to the backend
     * @param callback - function(err, response)
     */
  }, {
    key: "_makeApiRequest",
    value: function _makeApiRequest(item, callback) {
      var _this3 = this;
      var rateLimitResponse = this.rateLimiter.shouldSend(item);
      if (rateLimitResponse.shouldSend) {
        this.api.postItem(item, function (err, resp, headers) {
          if (err) {
            _this3._maybeRetry(err, item, callback);
          } else {
            callback(err, resp, headers);
          }
        });
      } else if (rateLimitResponse.error) {
        callback(rateLimitResponse.error);
      } else {
        this.api.postItem(rateLimitResponse.payload, callback);
      }
    }

    // These are errors basically mean there is no internet connection
  }, {
    key: "_maybeRetry",
    value:
    /**
     * Given the error returned by the API, decide if we should retry or just callback
     * with the error.
     *
     * @param err - an error returned by the API transport
     * @param item - the item that was trying to be sent when this error occured
     * @param callback - function(err, response)
     */
    function _maybeRetry(err, item, callback) {
      var shouldRetry = false;
      if (this.options.retryInterval) {
        for (var i = 0, len = Queue.RETRIABLE_ERRORS.length; i < len; i++) {
          if (err.code === Queue.RETRIABLE_ERRORS[i]) {
            shouldRetry = true;
            break;
          }
        }
        if (shouldRetry && isFiniteNumber(this.options.maxRetries)) {
          item.retries = item.retries ? item.retries + 1 : 1;
          if (item.retries > this.options.maxRetries) {
            shouldRetry = false;
          }
        }
      }
      if (shouldRetry) {
        this._retryApiRequest(item, callback);
      } else {
        callback(err);
      }
    }

    /**
     * Add an item and a callback to a queue and possibly start a timer to process
     * that queue based on the retryInterval in the options for this queue.
     *
     * @param item - an item that failed to send due to an error we deem retriable
     * @param callback - function(err, response)
     */
  }, {
    key: "_retryApiRequest",
    value: function _retryApiRequest(item, callback) {
      var _this4 = this;
      this.retryQueue.push({
        item: item,
        callback: callback
      });
      if (!this.retryHandle) {
        this.retryHandle = setInterval(function () {
          while (_this4.retryQueue.length) {
            var retryObject = _this4.retryQueue.shift();
            _this4._makeApiRequest(retryObject.item, retryObject.callback);
          }
        }, this.options.retryInterval);
      }
    }

    /**
     * Removes the item from the pending request queue, this queue is used to
     * enable to functionality of providing a callback that clients can pass to `wait` to be notified
     * when the pending request queue has been emptied. This must be called when the API finishes
     * processing this item. If a `wait` callback is configured, it is called by this function.
     *
     * @param item - the item previously added to the pending request queue
     */
  }, {
    key: "_dequeuePendingRequest",
    value: function _dequeuePendingRequest(item) {
      var idx = this.pendingRequests.indexOf(item);
      if (idx !== -1) {
        this.pendingRequests.splice(idx, 1);
        this._maybeCallWait();
      }
    }
  }, {
    key: "_maybeLog",
    value: function _maybeLog(data, originalError) {
      if (this.logger && this.options.verbose) {
        var message = originalError || get(data, 'body.trace.exception.message') || get(data, 'body.trace_chain.0.exception.message');
        if (message) {
          this.logger.error(message);
          return;
        }
        message = get(data, 'body.message.body');
        if (message) {
          this.logger.log(message);
        }
      }
    }
  }, {
    key: "_maybeCallWait",
    value: function _maybeCallWait() {
      if (isFunction(this.waitCallback) && this.pendingItems.length === 0 && this.pendingRequests.length === 0) {
        if (this.waitIntervalID) {
          this.waitIntervalID = clearInterval(this.waitIntervalID);
        }
        this.waitCallback();
        return true;
      }
      return false;
    }
  }]);
}();
_defineProperty(Queue, "RETRIABLE_ERRORS", ['ECONNRESET', 'ENOTFOUND', 'ESOCKETTIMEDOUT', 'ETIMEDOUT', 'ECONNREFUSED', 'EHOSTUNREACH', 'EPIPE', 'EAI_AGAIN']);
/* harmony default export */ var queue = (Queue);
;// ./src/notifier.js


/*
 * Notifier - the internal object responsible for delegating between the client exposed API, the
 * chain of transforms necessary to turn an item into something that can be sent to Rollbar, and the
 * queue which handles the communcation with the Rollbar API servers.
 *
 * @param queue - an object that conforms to the interface: addItem(item, callback)
 * @param options - an object representing the options to be set for this notifier, this should have
 * any defaults already set by the caller
 */
function Notifier(queue, options) {
  this.queue = queue;
  this.options = options;
  this.transforms = [];
  this.diagnostic = {};
}

/*
 * configure - updates the options for this notifier with the passed in object
 *
 * @param options - an object which gets merged with the current options set on this notifier
 * @returns this
 */
Notifier.prototype.configure = function (options) {
  this.queue && this.queue.configure(options);
  var oldOptions = this.options;
  this.options = src_merge(oldOptions, options);
  return this;
};

/*
 * addTransform - adds a transform onto the end of the queue of transforms for this notifier
 *
 * @param transform - a function which takes three arguments:
 *    * item: An Object representing the data to eventually be sent to Rollbar
 *    * options: The current value of the options for this notifier
 *    * callback: function(err: (Null|Error), item: (Null|Object)) the transform must call this
 *    callback with a null value for error if it wants the processing chain to continue, otherwise
 *    with an error to terminate the processing. The item should be the updated item after this
 *    transform is finished modifying it.
 */
Notifier.prototype.addTransform = function (transform) {
  if (isFunction(transform)) {
    this.transforms.push(transform);
  }
  return this;
};

/*
 * log - the internal log function which applies the configured transforms and then pushes onto the
 * queue to be sent to the backend.
 *
 * @param item - An object with the following structure:
 *    message [String] - An optional string to be sent to rollbar
 *    error [Error] - An optional error
 *
 * @param callback - A function of type function(err, resp) which will be called with exactly one
 * null argument and one non-null argument. The callback will be called once, either during the
 * transform stage if an error occurs inside a transform, or in response to the communication with
 * the backend. The second argument will be the response from the backend in case of success.
 */
Notifier.prototype.log = function (item, callback) {
  if (!callback || !isFunction(callback)) {
    callback = function callback() {};
  }
  if (!this.options.enabled) {
    return callback(new Error('Rollbar is not enabled'));
  }
  this.queue.addPendingItem(item);
  var originalError = item.err;
  this._applyTransforms(item, function (err, i) {
    if (err) {
      this.queue.removePendingItem(item);
      return callback(err, null);
    }
    this.queue.addItem(i, callback, originalError, item);
  }.bind(this));
};

/* Internal */

/*
 * _applyTransforms - Applies the transforms that have been added to this notifier sequentially. See
 * `addTransform` for more information.
 *
 * @param item - An item to be transformed
 * @param callback - A function of type function(err, item) which will be called with a non-null
 * error and a null item in the case of a transform failure, or a null error and non-null item after
 * all transforms have been applied.
 */
Notifier.prototype._applyTransforms = function (item, callback) {
  var transformIndex = -1;
  var transformsLength = this.transforms.length;
  var transforms = this.transforms;
  var options = this.options;
  var _cb = function cb(err, i) {
    if (err) {
      callback(err, null);
      return;
    }
    transformIndex++;
    if (transformIndex === transformsLength) {
      callback(null, i);
      return;
    }
    transforms[transformIndex](i, options, _cb);
  };
  _cb(null, item);
};
/* harmony default export */ var notifier = (Notifier);
;// ./src/rollbar.js





/*
 * Rollbar - the interface to Rollbar
 *
 * @param options
 * @param api
 * @param logger
 */
function Rollbar(options, api, logger, telemeter, tracing, replay, platform) {
  this.options = src_merge(options);
  this.logger = logger;
  Rollbar.rateLimiter.configureGlobal(this.options);
  Rollbar.rateLimiter.setPlatformOptions(platform, this.options);
  this.api = api;
  this.queue = new queue(Rollbar.rateLimiter, api, logger, this.options, replay);
  this.tracing = tracing;

  // Legacy OpenTracing support
  // This must happen before the Notifier is created
  var tracer = this.options.tracer || null;
  if (validateTracer(tracer)) {
    this.tracer = tracer;
    // set to a string for api response serialization
    this.options.tracer = 'opentracing-tracer-enabled';
    this.options._configuredOptions.tracer = 'opentracing-tracer-enabled';
  } else {
    this.tracer = null;
  }
  this.notifier = new notifier(this.queue, this.options);
  this.telemeter = telemeter;
  setStackTraceLimit(options);
  this.lastError = null;
  this.lastErrorHash = 'none';
}
var defaultOptions = {
  maxItems: 0,
  itemsPerMinute: 60
};
Rollbar.rateLimiter = new rateLimiter(defaultOptions);
Rollbar.prototype.global = function (options) {
  Rollbar.rateLimiter.configureGlobal(options);
  return this;
};
Rollbar.prototype.configure = function (options, payloadData) {
  var oldOptions = this.options;
  var payload = {};
  if (payloadData) {
    payload = {
      payload: payloadData
    };
  }
  this.options = src_merge(oldOptions, options, payload);

  // Legacy OpenTracing support
  // This must happen before the Notifier is configured
  var tracer = this.options.tracer || null;
  if (validateTracer(tracer)) {
    this.tracer = tracer;
    // set to a string for api response serialization
    this.options.tracer = 'opentracing-tracer-enabled';
    this.options._configuredOptions.tracer = 'opentracing-tracer-enabled';
  } else {
    this.tracer = null;
  }
  this.notifier && this.notifier.configure(this.options);
  this.telemeter && this.telemeter.configure(this.options);
  setStackTraceLimit(options);
  this.global(this.options);
  if (validateTracer(options.tracer)) {
    this.tracer = options.tracer;
  }
  return this;
};
Rollbar.prototype.log = function (item) {
  var level = this._defaultLogLevel();
  return this._log(level, item);
};
Rollbar.prototype.debug = function (item) {
  this._log('debug', item);
};
Rollbar.prototype.info = function (item) {
  this._log('info', item);
};
Rollbar.prototype.warn = function (item) {
  this._log('warning', item);
};
Rollbar.prototype.warning = function (item) {
  this._log('warning', item);
};
Rollbar.prototype.error = function (item) {
  this._log('error', item);
};
Rollbar.prototype.critical = function (item) {
  this._log('critical', item);
};
Rollbar.prototype.wait = function (callback) {
  this.queue.wait(callback);
};
Rollbar.prototype.captureEvent = function (type, metadata, level) {
  return this.telemeter && this.telemeter.captureEvent(type, metadata, level);
};
Rollbar.prototype.captureDomContentLoaded = function (ts) {
  return this.telemeter && this.telemeter.captureDomContentLoaded(ts);
};
Rollbar.prototype.captureLoad = function (ts) {
  return this.telemeter && this.telemeter.captureLoad(ts);
};
Rollbar.prototype.buildJsonPayload = function (item) {
  return this.api.buildJsonPayload(item);
};
Rollbar.prototype.sendJsonPayload = function (jsonPayload) {
  this.api.postJsonPayload(jsonPayload);
};

/* Internal */

Rollbar.prototype._log = function (defaultLevel, item) {
  var callback;
  if (item.callback) {
    callback = item.callback;
    delete item.callback;
  }
  if (this.options.ignoreDuplicateErrors && this._sameAsLastError(item)) {
    if (callback) {
      var error = new Error('ignored identical item');
      error.item = item;
      callback(error);
    }
    return;
  }
  try {
    item.level = item.level || defaultLevel;
    this._addTracingAttributes(item);

    // Legacy OpenTracing support
    this._addTracingInfo(item);
    var telemeter = this.telemeter;
    if (telemeter) {
      telemeter._captureRollbarItem(item);
      item.telemetryEvents = telemeter.copyEvents() || [];
    }
    this.notifier.log(item, callback);
  } catch (e) {
    if (callback) {
      callback(e);
    }
    this.logger.error(e);
  }
};
Rollbar.prototype._addTracingAttributes = function (item) {
  var _this$tracing, _this$tracing2;
  var span = (_this$tracing = this.tracing) === null || _this$tracing === void 0 ? void 0 : _this$tracing.getSpan();
  var attributes = [{
    key: 'session_id',
    value: (_this$tracing2 = this.tracing) === null || _this$tracing2 === void 0 ? void 0 : _this$tracing2.sessionId
  }, {
    key: 'span_id',
    value: span === null || span === void 0 ? void 0 : span.spanId
  }, {
    key: 'trace_id',
    value: span === null || span === void 0 ? void 0 : span.traceId
  }];
  addItemAttributes(item.data, attributes);
  span === null || span === void 0 || span.addEvent('rollbar.occurrence', [{
    key: 'rollbar.occurrence.uuid',
    value: item.uuid
  }]);
};
Rollbar.prototype._defaultLogLevel = function () {
  return this.options.logLevel || 'debug';
};
Rollbar.prototype._sameAsLastError = function (item) {
  if (!item._isUncaught) {
    return false;
  }
  var itemHash = generateItemHash(item);
  if (this.lastErrorHash === itemHash) {
    return true;
  }
  this.lastError = item.err;
  this.lastErrorHash = itemHash;
  return false;
};
Rollbar.prototype._addTracingInfo = function (item) {
  // Tracer validation occurs in the constructor
  // or in the Rollbar.prototype.configure methods
  if (this.tracer) {
    // add rollbar occurrence uuid to span
    var span = this.tracer.scope().active();
    if (validateSpan(span)) {
      span.setTag('rollbar.error_uuid', item.uuid);
      span.setTag('rollbar.has_error', true);
      span.setTag('error', true);
      span.setTag('rollbar.item_url', "https://rollbar.com/item/uuid/?uuid=".concat(item.uuid));
      span.setTag('rollbar.occurrence_url', "https://rollbar.com/occurrence/uuid/?uuid=".concat(item.uuid));

      // add span ID & trace ID to occurrence
      var opentracingSpanId = span.context().toSpanId();
      var opentracingTraceId = span.context().toTraceId();
      if (item.custom) {
        item.custom.opentracing_span_id = opentracingSpanId;
        item.custom.opentracing_trace_id = opentracingTraceId;
      } else {
        item.custom = {
          opentracing_span_id: opentracingSpanId,
          opentracing_trace_id: opentracingTraceId
        };
      }
    }
  }
};
function generateItemHash(item) {
  var message = item.message || '';
  var stack = (item.err || {}).stack || String(item.err);
  return message + '::' + stack;
}

// Node.js, Chrome, Safari, and some other browsers support this property
// which globally sets the number of stack frames returned in an Error object.
// If a browser can't use it, no harm done.
function setStackTraceLimit(options) {
  if (options.stackTraceLimit) {
    Error.stackTraceLimit = options.stackTraceLimit;
  }
}

/**
 * Validate the Tracer object provided to the Client
 * is valid for our Opentracing use case.
 * @param {opentracer.Tracer} tracer
 */
function validateTracer(tracer) {
  if (!tracer) {
    return false;
  }
  if (!tracer.scope || typeof tracer.scope !== 'function') {
    return false;
  }
  var scope = tracer.scope();
  if (!scope || !scope.active || typeof scope.active !== 'function') {
    return false;
  }
  return true;
}

/**
 * Validate the Span object provided
 * @param {opentracer.Span} span
 */
function validateSpan(span) {
  if (!span || !span.context || typeof span.context !== 'function') {
    return false;
  }
  var spanContext = span.context();
  if (!spanContext || !spanContext.toSpanId || !spanContext.toTraceId || typeof spanContext.toSpanId !== 'function' || typeof spanContext.toTraceId !== 'function') {
    return false;
  }
  return true;
}
/* harmony default export */ var src_rollbar = (Rollbar);
;// ./src/apiUtility.js

function buildPayload(data) {
  if (!isType(data.context, 'string')) {
    var contextResult = stringify(data.context);
    if (contextResult.error) {
      data.context = "Error: could not serialize 'context'";
    } else {
      data.context = contextResult.value || '';
    }
    if (data.context.length > 255) {
      data.context = data.context.substr(0, 255);
    }
  }
  return {
    data: data
  };
}
function getTransportFromOptions(options, defaults, url) {
  var hostname = defaults.hostname;
  var protocol = defaults.protocol;
  var port = defaults.port;
  var path = defaults.path;
  var search = defaults.search;
  var timeout = options.timeout;
  var transport = detectTransport(options);
  var proxy = options.proxy;
  if (options.endpoint) {
    var opts = url.parse(options.endpoint);
    hostname = opts.hostname;
    protocol = opts.protocol;
    port = opts.port;
    path = opts.pathname;
    search = opts.search;
  }
  return {
    timeout: timeout,
    hostname: hostname,
    protocol: protocol,
    port: port,
    path: path,
    search: search,
    proxy: proxy,
    transport: transport
  };
}
function detectTransport(options) {
  var gWindow = typeof window != 'undefined' && window || typeof self != 'undefined' && self;
  var transport = options.defaultTransport || 'xhr';
  if (typeof gWindow.fetch === 'undefined') transport = 'xhr';
  if (typeof gWindow.XMLHttpRequest === 'undefined') transport = 'fetch';
  return transport;
}
function apiUtility_transportOptions(transport, method) {
  var protocol = transport.protocol || 'https:';
  var port = transport.port || (protocol === 'http:' ? 80 : protocol === 'https:' ? 443 : undefined);
  var hostname = transport.hostname;
  var path = transport.path;
  var timeout = transport.timeout;
  var transportAPI = transport.transport;
  if (transport.search) {
    path = path + transport.search;
  }
  if (transport.proxy) {
    path = protocol + '//' + hostname + path;
    hostname = transport.proxy.host || transport.proxy.hostname;
    port = transport.proxy.port;
    protocol = transport.proxy.protocol || protocol;
  }
  return {
    timeout: timeout,
    protocol: protocol,
    hostname: hostname,
    path: path,
    port: port,
    method: method,
    transport: transportAPI
  };
}
function appendPathToPath(base, path) {
  var baseTrailingSlash = /\/$/.test(base);
  var pathBeginningSlash = /^\//.test(path);
  if (baseTrailingSlash && pathBeginningSlash) {
    path = path.substring(1);
  } else if (!baseTrailingSlash && !pathBeginningSlash) {
    path = '/' + path;
  }
  return base + path;
}

;// ./src/api.js
function api_typeof(o) { "@babel/helpers - typeof"; return api_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, api_typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { api_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function api_defineProperty(e, r, t) { return (r = api_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function api_toPropertyKey(t) { var i = api_toPrimitive(t, "string"); return "symbol" == api_typeof(i) ? i : i + ""; }
function api_toPrimitive(t, r) { if ("object" != api_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != api_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == api_typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(api_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }


var api_defaultOptions = {
  hostname: 'api.rollbar.com',
  path: '/api/1/item/',
  search: null,
  version: '1',
  protocol: 'https:',
  port: 443
};
var OTLPDefaultOptions = {
  hostname: 'api.rollbar.com',
  path: '/api/1/session/',
  search: null,
  version: '1',
  protocol: 'https:',
  port: 443
};

/**
 * Api is an object that encapsulates methods of communicating with
 * the Rollbar API.  It is a standard interface with some parts implemented
 * differently for server or browser contexts.  It is an object that should
 * be instantiated when used so it can contain non-global options that may
 * be different for another instance of RollbarApi.
 *
 * @param options {
 *    accessToken: the accessToken to use for posting items to rollbar
 *    endpoint: an alternative endpoint to send errors to
 *        must be a valid, fully qualified URL.
 *        The default is: https://api.rollbar.com/api/1/item
 *    proxy: if you wish to proxy requests provide an object
 *        with the following keys:
 *          host or hostname (required): foo.example.com
 *          port (optional): 123
 *          protocol (optional): https
 * }
 */
function Api(options, transport, urllib, truncation) {
  this.options = options;
  this.transport = transport;
  this.url = urllib;
  this.truncation = truncation;
  this.accessToken = options.accessToken;
  this.transportOptions = _getTransport(options, urllib);
  this.OTLPTransportOptions = _getOTLPTransport(options, urllib);
}

/**
 * Wraps transport.post in a Promise to support async/await
 *
 * @param {Object} options - Options for the API request
 * @param {string} options.accessToken - The access token for authentication
 * @param {Object} options.transportOptions - Options for the transport
 * @param {Object} options.payload - The data payload to send
 * @returns {Promise} A promise that resolves with the response or rejects with an error
 * @private
 */
Api.prototype._postPromise = function (_ref) {
  var accessToken = _ref.accessToken,
    options = _ref.options,
    payload = _ref.payload,
    headers = _ref.headers;
  var self = this;
  return new Promise(function (resolve, reject) {
    self.transport.post({
      accessToken: accessToken,
      options: options,
      payload: payload,
      headers: headers,
      callback: function callback(err, resp) {
        return err ? reject(err) : resolve(resp);
      }
    });
  });
};

/**
 *
 * @param data
 * @param callback
 */
Api.prototype.postItem = function (data, callback) {
  var options = apiUtility_transportOptions(this.transportOptions, 'POST');
  var payload = buildPayload(data);
  var self = this;

  // ensure the network request is scheduled after the current tick.
  setTimeout(function () {
    self.transport.post({
      accessToken: self.accessToken,
      options: options,
      payload: payload,
      callback: callback
    });
  }, 0);
};

/**
 * Posts spans to the Rollbar API using the session endpoint
 *
 * @param {Array} payload - The spans to send
 * @returns {Promise<Object>} A promise that resolves with the API response
 */
Api.prototype.postSpans = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(payload) {
    var headers,
      options,
      _args = arguments;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          headers = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
          options = apiUtility_transportOptions(this.OTLPTransportOptions, 'POST');
          _context.next = 4;
          return this._postPromise({
            accessToken: this.accessToken,
            options: options,
            payload: payload,
            headers: headers
          });
        case 4:
          return _context.abrupt("return", _context.sent);
        case 5:
        case "end":
          return _context.stop();
      }
    }, _callee, this);
  }));
  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 *
 * @param data
 * @param callback
 */
Api.prototype.buildJsonPayload = function (data, callback) {
  var payload = buildPayload(data);
  var stringifyResult;
  if (this.truncation) {
    stringifyResult = this.truncation.truncate(payload);
  } else {
    stringifyResult = stringify(payload);
  }
  if (stringifyResult.error) {
    if (callback) {
      callback(stringifyResult.error);
    }
    return null;
  }
  return stringifyResult.value;
};

/**
 *
 * @param jsonPayload
 * @param callback
 */
Api.prototype.postJsonPayload = function (jsonPayload, callback) {
  var transportOptions = apiUtility_transportOptions(this.transportOptions, 'POST');
  this.transport.postJsonPayload(this.accessToken, transportOptions, jsonPayload, callback);
};
Api.prototype.configure = function (options) {
  var oldOptions = this.oldOptions;
  this.options = src_merge(oldOptions, options);
  this.transportOptions = _getTransport(this.options, this.url);
  this.OTLPTransportOptions = _getOTLPTransport(this.options, this.url);
  if (this.options.accessToken !== undefined) {
    this.accessToken = this.options.accessToken;
  }
  return this;
};
function _getTransport(options, url) {
  return getTransportFromOptions(options, api_defaultOptions, url);
}
function _getOTLPTransport(options, url) {
  var _options$tracing;
  options = _objectSpread(_objectSpread({}, options), {}, {
    endpoint: (_options$tracing = options.tracing) === null || _options$tracing === void 0 ? void 0 : _options$tracing.endpoint
  });
  return getTransportFromOptions(options, OTLPDefaultOptions, url);
}
/* harmony default export */ var src_api = (Api);
;// ./src/logger.js
var _log = function log() {};
var levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  disable: 4
};
var logger = {
  error: function error() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return _log('error', args);
  },
  warn: function warn() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return _log('warn', args);
  },
  info: function info() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    return _log('info', args);
  },
  debug: function debug() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return _log('debug', args);
  },
  log: function log() {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }
    return _log('info', args);
  },
  init: function init(_ref) {
    var logLevel = _ref.logLevel;
    _log = function _log(level, args) {
      if (levels[level] < levels[logLevel]) return;
      args.unshift('Rollbar:');
      console[level].apply(console, args);
    };
  }
};
/* harmony default export */ var src_logger = (logger);
;// ./src/browser/globalSetup.js
function captureUncaughtExceptions(window, handler, shim) {
  if (!window) {
    return;
  }
  var oldOnError;
  if (typeof handler._rollbarOldOnError === 'function') {
    oldOnError = handler._rollbarOldOnError;
  } else if (window.onerror) {
    oldOnError = window.onerror;
    while (oldOnError._rollbarOldOnError) {
      oldOnError = oldOnError._rollbarOldOnError;
    }
    handler._rollbarOldOnError = oldOnError;
  }
  handler.handleAnonymousErrors();
  var fn = function fn() {
    var args = Array.prototype.slice.call(arguments, 0);
    _rollbarWindowOnError(window, handler, oldOnError, args);
  };
  if (shim) {
    fn._rollbarOldOnError = oldOnError;
  }
  window.onerror = fn;
}
function _rollbarWindowOnError(window, r, old, args) {
  if (window._rollbarWrappedError) {
    if (!args[4]) {
      args[4] = window._rollbarWrappedError;
    }
    if (!args[5]) {
      args[5] = window._rollbarWrappedError._rollbarContext;
    }
    window._rollbarWrappedError = null;
  }
  var ret = r.handleUncaughtException.apply(r, args);
  if (old) {
    old.apply(window, args);
  }

  // Let other chained onerror handlers above run before setting this.
  // If an error is thrown and caught within a chained onerror handler,
  // Error.prepareStackTrace() will see that one before the one we want.
  if (ret === 'anonymous') {
    r.anonymousErrorsPending += 1; // See Rollbar.prototype.handleAnonymousErrors()
  }
}
function captureUnhandledRejections(window, handler, shim) {
  if (!window) {
    return;
  }
  if (typeof window._rollbarURH === 'function' && window._rollbarURH.belongsToShim) {
    window.removeEventListener('unhandledrejection', window._rollbarURH);
  }
  var rejectionHandler = function rejectionHandler(evt) {
    var reason, promise, detail;
    try {
      reason = evt.reason;
    } catch (e) {
      reason = undefined;
    }
    try {
      promise = evt.promise;
    } catch (e) {
      promise = '[unhandledrejection] error getting `promise` from event';
    }
    try {
      detail = evt.detail;
      if (!reason && detail) {
        reason = detail.reason;
        promise = detail.promise;
      }
    } catch (e) {
      // Ignore
    }
    if (!reason) {
      reason = '[unhandledrejection] error getting `reason` from event';
    }
    if (handler && handler.handleUnhandledRejection) {
      handler.handleUnhandledRejection(reason, promise);
    }
  };
  rejectionHandler.belongsToShim = shim;
  window._rollbarURH = rejectionHandler;
  window.addEventListener('unhandledrejection', rejectionHandler);
}

;// ./src/browser/transport/fetch.js
function fetch_typeof(o) { "@babel/helpers - typeof"; return fetch_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, fetch_typeof(o); }
function fetch_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function fetch_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? fetch_ownKeys(Object(t), !0).forEach(function (r) { fetch_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : fetch_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function fetch_defineProperty(e, r, t) { return (r = fetch_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function fetch_toPropertyKey(t) { var i = fetch_toPrimitive(t, "string"); return "symbol" == fetch_typeof(i) ? i : i + ""; }
function fetch_toPrimitive(t, r) { if ("object" != fetch_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != fetch_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


function makeFetchRequest(_ref) {
  var accessToken = _ref.accessToken,
    url = _ref.url,
    method = _ref.method,
    payload = _ref.payload,
    headers = _ref.headers,
    callback = _ref.callback,
    timeout = _ref.timeout;
  var controller;
  var timeoutId;
  if (isFiniteNumber(timeout)) {
    controller = new AbortController();
    timeoutId = setTimeout(function () {
      controller.abort();
    }, timeout);
  }
  headers = fetch_objectSpread({
    'Content-Type': 'application/json',
    'X-Rollbar-Access-Token': accessToken,
    signal: controller && controller.signal
  }, headers);
  fetch(url, {
    method: method,
    headers: headers,
    body: payload
  }).then(function (response) {
    if (timeoutId) clearTimeout(timeoutId);
    var respHeaders = response.headers;
    var isItemRoute = url.endsWith('/api/1/item/');
    var headers = isItemRoute ? {
      'Rollbar-Replay-Enabled': respHeaders.get('Rollbar-Replay-Enabled'),
      'Rollbar-Replay-RateLimit-Remaining': respHeaders.get('Rollbar-Replay-RateLimit-Remaining'),
      'Rollbar-Replay-RateLimit-Reset': respHeaders.get('Rollbar-Replay-RateLimit-Reset')
    } : {};
    var json = response.json();
    callback(null, json, headers);
  }).catch(function (error) {
    src_logger.error(error.message);
    callback(error);
  });
}
/* harmony default export */ var transport_fetch = (makeFetchRequest);
;// ./src/browser/transport/xhr.js
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || xhr_unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function xhr_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return xhr_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? xhr_arrayLikeToArray(r, a) : void 0; } }
function xhr_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/*global XDomainRequest*/



function makeXhrRequest(_ref) {
  var accessToken = _ref.accessToken,
    url = _ref.url,
    method = _ref.method,
    payload = _ref.payload,
    headers = _ref.headers,
    callback = _ref.callback,
    requestFactory = _ref.requestFactory,
    timeout = _ref.timeout;
  var request;
  if (requestFactory) {
    request = requestFactory();
  } else {
    request = _createXMLHTTPObject();
  }
  if (!request) {
    // Give up, no way to send requests
    return callback(new Error('No way to send a request'));
  }
  try {
    try {
      var _onreadystatechange = function onreadystatechange() {
        try {
          if (_onreadystatechange && request.readyState === 4) {
            _onreadystatechange = undefined;
            var parseResponse = jsonParse(request.responseText);
            if (_isSuccess(request)) {
              var isItemRoute = url.endsWith('/api/1/item/');
              var _headers = isItemRoute ? {
                'Rollbar-Replay-Enabled': request.getResponseHeader('Rollbar-Replay-Enabled'),
                'Rollbar-Replay-RateLimit-Remaining': request.getResponseHeader('Rollbar-Replay-RateLimit-Remaining'),
                'Rollbar-Replay-RateLimit-Reset': request.getResponseHeader('Rollbar-Replay-RateLimit-Reset')
              } : {};
              callback(parseResponse.error, parseResponse.value, _headers);
              return;
            } else if (_isNormalFailure(request)) {
              if (request.status === 403) {
                // likely caused by using a server access token
                var message = parseResponse.value && parseResponse.value.message;
                src_logger.error(message);
              }
              // return valid http status codes
              callback(new Error(String(request.status)));
            } else {
              // IE will return a status 12000+ on some sort of connection failure,
              // so we return a blank error
              // http://msdn.microsoft.com/en-us/library/aa383770%28VS.85%29.aspx
              var msg = 'XHR response had no status code (likely connection failure)';
              callback(_newRetriableError(msg));
            }
          }
        } catch (ex) {
          //jquery source mentions firefox may error out while accessing the
          //request members if there is a network error
          //https://github.com/jquery/jquery/blob/a938d7b1282fc0e5c52502c225ae8f0cef219f0a/src/ajax/xhr.js#L111
          var exc;
          if (ex && ex.stack) {
            exc = ex;
          } else {
            exc = new Error(ex);
          }
          callback(exc);
        }
      };
      request.open(method, url, true);
      if (request.setRequestHeader) {
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('X-Rollbar-Access-Token', accessToken);
        for (var _i = 0, _Object$entries = Object.entries(headers !== null && headers !== void 0 ? headers : {}); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            h = _Object$entries$_i[0],
            v = _Object$entries$_i[1];
          request.setRequestHeader(h, v);
        }
      }
      if (isFiniteNumber(timeout)) {
        request.timeout = timeout;
      }
      request.onreadystatechange = _onreadystatechange;
      request.send(payload);
    } catch (e1) {
      // Sending using the normal xmlhttprequest object didn't work, try XDomainRequest
      if (typeof XDomainRequest !== 'undefined') {
        // Assume we are in a really old browser which has a bunch of limitations:
        // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx

        // Extreme paranoia: if we have XDomainRequest then we have a window, but just in case
        if (!window || !window.location) {
          return callback(new Error('No window available during request, unknown environment'));
        }

        // If the current page is http, try and send over http
        if (window.location.href.substring(0, 5) === 'http:' && url.substring(0, 5) === 'https') {
          url = 'http' + url.substring(5);
        }
        var xdomainrequest = new XDomainRequest();
        xdomainrequest.onprogress = function () {};
        xdomainrequest.ontimeout = function () {
          var msg = 'Request timed out';
          var code = 'ETIMEDOUT';
          callback(_newRetriableError(msg, code));
        };
        xdomainrequest.onerror = function () {
          callback(new Error('Error during request'));
        };
        xdomainrequest.onload = function () {
          var parseResponse = jsonParse(xdomainrequest.responseText);
          callback(parseResponse.error, parseResponse.value);
        };
        xdomainrequest.open(method, url, true);
        xdomainrequest.send(payload);
      } else {
        callback(new Error('Cannot find a method to transport a request'));
      }
    }
  } catch (e2) {
    callback(e2);
  }
}
function _createXMLHTTPObject() {
  /* global ActiveXObject:false */

  var factories = [function () {
    return new XMLHttpRequest();
  }, function () {
    return new ActiveXObject('Msxml2.XMLHTTP');
  }, function () {
    return new ActiveXObject('Msxml3.XMLHTTP');
  }, function () {
    return new ActiveXObject('Microsoft.XMLHTTP');
  }];
  var xmlhttp;
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
}
function _isSuccess(r) {
  return r && r.status && r.status === 200;
}
function _isNormalFailure(r) {
  return r && isType(r.status, 'number') && r.status >= 400 && r.status < 600;
}
function _newRetriableError(message, code) {
  var err = new Error(message);
  err.code = code || 'ENOTFOUND';
  return err;
}
/* harmony default export */ var xhr = (makeXhrRequest);
;// ./src/browser/transport.js




/*
 * accessToken may be embedded in payload but that should not
 *   be assumed
 *
 * options: {
 *   hostname
 *   protocol
 *   path
 *   port
 *   method
 *   transport ('xhr' | 'fetch')
 * }
 *
 *  params is an object containing key/value pairs. These
 *    will be appended to the path as 'key=value&key=value'
 *
 * payload is an unserialized object
 */
function Transport(truncation) {
  this.truncation = truncation;
}
Transport.prototype.get = function (accessToken, options, params, callback, requestFactory) {
  if (!callback || !isFunction(callback)) {
    callback = function callback() {};
  }
  addParamsAndAccessTokenToPath(accessToken, options, params);
  var method = 'GET';
  var url = formatUrl(options);
  this._makeZoneRequest({
    accessToken: accessToken,
    url: url,
    method: method,
    callback: callback,
    requestFactory: requestFactory,
    timeout: options.timeout,
    transport: options.transport
  });
};
Transport.prototype.post = function (_ref) {
  var _this = this;
  var accessToken = _ref.accessToken,
    options = _ref.options,
    payload = _ref.payload,
    headers = _ref.headers,
    callback = _ref.callback,
    requestFactory = _ref.requestFactory;
  return function (payload) {
    if (!callback || !isFunction(callback)) {
      callback = function callback() {};
    }
    if (!payload) {
      return callback(new Error('Cannot send empty request'));
    }
    var stringifyResult;
    // Check payload.body to ensure only items are truncated.
    if (_this.truncation && payload.body) {
      stringifyResult = _this.truncation.truncate(payload);
    } else {
      stringifyResult = stringify(payload);
    }
    if (stringifyResult.error) {
      return callback(stringifyResult.error);
    }
    var payload = stringifyResult.value;
    var method = 'POST';
    var url = formatUrl(options);
    _this._makeZoneRequest({
      accessToken: accessToken,
      url: url,
      method: method,
      payload: payload,
      headers: headers,
      callback: callback,
      requestFactory: requestFactory,
      timeout: options.timeout,
      transport: options.transport
    });
  }(payload);
};
Transport.prototype.postJsonPayload = function (accessToken, options, payload, callback, requestFactory) {
  if (!callback || !isFunction(callback)) {
    callback = function callback() {};
  }
  var method = 'POST';
  var url = formatUrl(options);
  this._makeZoneRequest({
    accessToken: accessToken,
    url: url,
    method: method,
    payload: payload,
    callback: callback,
    requestFactory: requestFactory,
    timeout: options.timeout,
    transport: options.transport
  });
};

// Wraps `_makeRequest` if zone.js is being used, ensuring that Rollbar
// API calls are not intercepted by any child forked zones.
// This is equivalent to `NgZone.runOutsideAngular` in Angular.
Transport.prototype._makeZoneRequest = function () {
  var gWindow = typeof window != 'undefined' && window || typeof self != 'undefined' && self;
  // Whenever zone.js is loaded and `Zone` is exposed globally, access
  // the root zone to ensure that requests are always made within it.
  // This approach is framework-agnostic, regardless of which
  // framework zone.js is used with.
  var rootZone = gWindow && gWindow.Zone && gWindow.Zone.root;
  var args = Array.prototype.slice.call(arguments);
  if (rootZone) {
    var self = this;
    rootZone.run(function () {
      self._makeRequest.apply(undefined, args);
    });
  } else {
    this._makeRequest.apply(undefined, args);
  }
};
Transport.prototype._makeRequest = function (params) {
  var payload = params.payload,
    callback = params.callback,
    transport = params.transport;
  if (typeof RollbarProxy !== 'undefined') {
    return _proxyRequest(payload, callback);
  }
  if (transport === 'fetch') {
    transport_fetch(params);
  } else {
    xhr(params);
  }
};

/* global RollbarProxy */
function _proxyRequest(json, callback) {
  var rollbarProxy = new RollbarProxy();
  rollbarProxy.sendJsonPayload(json, function (_msg) {
    /* do nothing */
  }, function (err) {
    callback(new Error(err));
  });
}
/* harmony default export */ var browser_transport = (Transport);
;// ./src/browser/url.js
// See https://nodejs.org/docs/latest/api/url.html
function parse(url) {
  var result = {
    protocol: null,
    auth: null,
    host: null,
    path: null,
    hash: null,
    href: url,
    hostname: null,
    port: null,
    pathname: null,
    search: null,
    query: null
  };
  var i, last;
  i = url.indexOf('//');
  if (i !== -1) {
    result.protocol = url.substring(0, i);
    last = i + 2;
  } else {
    last = 0;
  }
  i = url.indexOf('@', last);
  if (i !== -1) {
    result.auth = url.substring(last, i);
    last = i + 1;
  }
  i = url.indexOf('/', last);
  if (i === -1) {
    i = url.indexOf('?', last);
    if (i === -1) {
      i = url.indexOf('#', last);
      if (i === -1) {
        result.host = url.substring(last);
      } else {
        result.host = url.substring(last, i);
        result.hash = url.substring(i);
      }
      result.hostname = result.host.split(':')[0];
      result.port = result.host.split(':')[1];
      if (result.port) {
        result.port = parseInt(result.port, 10);
      }
      return result;
    } else {
      result.host = url.substring(last, i);
      result.hostname = result.host.split(':')[0];
      result.port = result.host.split(':')[1];
      if (result.port) {
        result.port = parseInt(result.port, 10);
      }
      last = i;
    }
  } else {
    result.host = url.substring(last, i);
    result.hostname = result.host.split(':')[0];
    result.port = result.host.split(':')[1];
    if (result.port) {
      result.port = parseInt(result.port, 10);
    }
    last = i;
  }
  i = url.indexOf('#', last);
  if (i === -1) {
    result.path = url.substring(last);
  } else {
    result.path = url.substring(last, i);
    result.hash = url.substring(i);
  }
  if (result.path) {
    var pathParts = result.path.split('?');
    result.pathname = pathParts[0];
    result.query = pathParts[1];
    result.search = result.query ? '?' + result.query : null;
  }
  return result;
}

;// ./node_modules/error-stack-parser-es/dist/lite.mjs
var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code\])?$/;
function lite_parse(error, options) {
  if (typeof error.stacktrace !== "undefined" || typeof error["opera#sourceloc"] !== "undefined") return parseOpera(error, options);else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) return parseV8OrIE(error, options);else if (error.stack) return parseFFOrSafari(error, options);else if (options !== null && options !== void 0 && options.allowEmpty) return [];else throw new Error("Cannot parse given Error object");
}
function parseStack(stackString, options) {
  if (stackString.match(CHROME_IE_STACK_REGEXP)) return parseV8OrIeString(stackString, options);else return parseFFOrSafariString(stackString, options);
}
function extractLocation(urlLike) {
  if (!urlLike.includes(":")) return [urlLike, undefined, undefined];
  var regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
  var parts = regExp.exec(urlLike.replace(/[()]/g, ""));
  return [parts[1], parts[2] || undefined, parts[3] || undefined];
}
function applySlice(lines, options) {
  if (options && options.slice != null) {
    if (Array.isArray(options.slice)) return lines.slice(options.slice[0], options.slice[1]);
    return lines.slice(0, options.slice);
  }
  return lines;
}
function parseV8OrIE(error, options) {
  return parseV8OrIeString(error.stack, options);
}
function parseV8OrIeString(stack, options) {
  var filtered = applySlice(stack.split("\n").filter(function (line) {
    return !!line.match(CHROME_IE_STACK_REGEXP);
  }), options);
  return filtered.map(function (line) {
    if (line.includes("(eval ")) {
      line = line.replace(/eval code/g, "eval").replace(/(\(eval at [^()]*)|(,.*$)/g, "");
    }
    var sanitizedLine = line.replace(/^\s+/, "").replace(/\(eval code/g, "(").replace(/^.*?\s+/, "");
    var location = sanitizedLine.match(/ (\(.+\)$)/);
    sanitizedLine = location ? sanitizedLine.replace(location[0], "") : sanitizedLine;
    var locationParts = extractLocation(location ? location[1] : sanitizedLine);
    var functionName = location && sanitizedLine || undefined;
    var fileName = ["eval", "<anonymous>"].includes(locationParts[0]) ? undefined : locationParts[0];
    return {
      function: functionName,
      file: fileName,
      line: locationParts[1] ? +locationParts[1] : undefined,
      col: locationParts[2] ? +locationParts[2] : undefined,
      raw: line
    };
  });
}
function parseFFOrSafari(error, options) {
  return parseFFOrSafariString(error.stack, options);
}
function parseFFOrSafariString(stack, options) {
  var filtered = applySlice(stack.split("\n").filter(function (line) {
    return !line.match(SAFARI_NATIVE_CODE_REGEXP);
  }), options);
  return filtered.map(function (line) {
    if (line.includes(" > eval")) line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ":$1");
    if (!line.includes("@") && !line.includes(":")) {
      return {
        function: line
      };
    } else {
      var functionNameRegex = /(([^\n\r"\u2028\u2029]*".[^\n\r"\u2028\u2029]*"[^\n\r@\u2028\u2029]*(?:@[^\n\r"\u2028\u2029]*"[^\n\r@\u2028\u2029]*)*(?:[\n\r\u2028\u2029][^@]*)?)?[^@]*)@/;
      var matches = line.match(functionNameRegex);
      var functionName = matches && matches[1] ? matches[1] : undefined;
      var locationParts = extractLocation(line.replace(functionNameRegex, ""));
      return {
        function: functionName,
        file: locationParts[0],
        line: locationParts[1] ? +locationParts[1] : undefined,
        col: locationParts[2] ? +locationParts[2] : undefined,
        raw: line
      };
    }
  });
}
function parseOpera(e, options) {
  if (!e.stacktrace || e.message.includes("\n") && e.message.split("\n").length > e.stacktrace.split("\n").length) return parseOpera9(e);else if (!e.stack) return parseOpera10(e);else return parseOpera11(e, options);
}
function parseOpera9(e, options) {
  var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
  var lines = e.message.split("\n");
  var result = [];
  for (var i = 2, len = lines.length; i < len; i += 2) {
    var match = lineRE.exec(lines[i]);
    if (match) {
      result.push({
        file: match[2],
        line: +match[1],
        raw: lines[i]
      });
    }
  }
  return applySlice(result, options);
}
function parseOpera10(e, options) {
  var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
  var lines = e.stacktrace.split("\n");
  var result = [];
  for (var i = 0, len = lines.length; i < len; i += 2) {
    var match = lineRE.exec(lines[i]);
    if (match) {
      result.push({
        function: match[3] || undefined,
        file: match[2],
        line: match[1] ? +match[1] : undefined,
        raw: lines[i]
      });
    }
  }
  return applySlice(result, options);
}
function parseOpera11(error, options) {
  var filtered = applySlice(
  // @ts-expect-error missing stack property
  error.stack.split("\n").filter(function (line) {
    return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
  }), options);
  return filtered.map(function (line) {
    var tokens = line.split("@");
    var locationParts = extractLocation(tokens.pop());
    var functionCall = tokens.shift() || "";
    var functionName = functionCall.replace(/<anonymous function(: (\w+))?>/, "$2").replace(/\([^)]*\)/g, "") || undefined;
    var argsRaw;
    if (functionCall.match(/\(([^)]*)\)/)) argsRaw = functionCall.replace(/^[^(]+\(([^)]*)\)$/, "$1");
    var args = argsRaw === undefined || argsRaw === "[arguments not available]" ? undefined : argsRaw.split(",");
    return {
      function: functionName,
      args: args,
      file: locationParts[0],
      line: locationParts[1] ? +locationParts[1] : undefined,
      col: locationParts[2] ? +locationParts[2] : undefined,
      raw: line
    };
  });
}

;// ./node_modules/error-stack-parser-es/dist/index.mjs


function stackframesLiteToStackframes(liteStackframes) {
  return liteStackframes.map(function (liteStackframe) {
    return {
      functionName: liteStackframe.function,
      args: liteStackframe.args,
      fileName: liteStackframe.file,
      lineNumber: liteStackframe.line,
      columnNumber: liteStackframe.col,
      source: liteStackframe.raw
    };
  });
}
function dist_parse(error, options) {
  return stackframesLiteToStackframes(lite_parse(error, options));
}
function dist_parseV8OrIE(error) {
  return stackframesLiteToStackframes(parseV8OrIE$1(error));
}
function dist_parseFFOrSafari(error) {
  return stackframesLiteToStackframes(parseFFOrSafari$1(error));
}
function dist_parseOpera(e) {
  return stackframesLiteToStackframes(parseOpera$1(e));
}
function dist_parseOpera9(e) {
  return stackframesLiteToStackframes(parseOpera9$1(e));
}
function dist_parseOpera10(e) {
  return stackframesLiteToStackframes(parseOpera10$1(e));
}
function dist_parseOpera11(error) {
  return stackframesLiteToStackframes(parseOpera11$1(error));
}

;// ./src/errorParser.js

var UNKNOWN_FUNCTION = '?';
var ERR_CLASS_REGEXP = new RegExp('^(([a-zA-Z0-9-_$ ]*): *)?(Uncaught )?([a-zA-Z0-9-_$ ]*): ');
function guessFunctionName() {
  return UNKNOWN_FUNCTION;
}
function gatherContext() {
  return null;
}
function Frame(stackFrame) {
  var data = {};
  data._stackFrame = stackFrame;
  data.url = stackFrame.fileName;
  data.line = stackFrame.lineNumber;
  data.func = stackFrame.functionName;
  data.column = stackFrame.columnNumber;
  data.args = stackFrame.args;
  data.context = gatherContext();
  return data;
}
function Stack(exception, skip) {
  function getStack() {
    var parserStack = [];
    skip = skip || 0;
    try {
      parserStack = dist_parse(exception);
    } catch (e) {
      parserStack = [];
    }
    var stack = [];
    for (var i = skip; i < parserStack.length; i++) {
      stack.push(new Frame(parserStack[i]));
    }
    return stack;
  }
  return {
    stack: getStack(),
    message: exception.message,
    name: _mostSpecificErrorName(exception),
    rawStack: exception.stack,
    rawException: exception
  };
}
function errorParser_parse(e, skip) {
  var err = e;
  if (err.nested || err.cause) {
    var traceChain = [];
    while (err) {
      traceChain.push(new Stack(err, skip));
      err = err.nested || err.cause;
      skip = 0; // Only apply skip value to primary error
    }

    // Return primary error with full trace chain attached.
    traceChain[0].traceChain = traceChain;
    return traceChain[0];
  } else {
    return new Stack(err, skip);
  }
}
function guessErrorClass(errMsg) {
  if (!errMsg || !errMsg.match) {
    return ['Unknown error. There was no error message to display.', ''];
  }
  var errClassMatch = errMsg.match(ERR_CLASS_REGEXP);
  var errClass = '(unknown)';
  if (errClassMatch) {
    errClass = errClassMatch[errClassMatch.length - 1];
    errMsg = errMsg.replace((errClassMatch[errClassMatch.length - 2] || '') + errClass + ':', '');
    errMsg = errMsg.replace(/(^[\s]+|[\s]+$)/g, '');
  }
  return [errClass, errMsg];
}

// * Prefers any value over an empty string
// * Prefers any value over 'Error' where possible
// * Prefers name over constructor.name when both are more specific than 'Error'
function _mostSpecificErrorName(error) {
  var name = error.name && error.name.length && error.name;
  var constructorName = error.constructor.name && error.constructor.name.length && error.constructor.name;
  if (!name || !constructorName) {
    return name || constructorName;
  }
  if (name === 'Error') {
    return constructorName;
  }
  return name;
}
/* harmony default export */ var errorParser = ({
  guessFunctionName: guessFunctionName,
  guessErrorClass: guessErrorClass,
  gatherContext: gatherContext,
  parse: errorParser_parse,
  Stack: Stack,
  Frame: Frame
});
;// ./src/browser/transforms.js



function handleDomException(item, options, callback) {
  if (item.err && errorParser.Stack(item.err).name === 'DOMException') {
    var originalError = new Error();
    originalError.name = item.err.name;
    originalError.message = item.err.message;
    originalError.stack = item.err.stack;
    originalError.nested = item.err;
    item.err = originalError;
  }
  callback(null, item);
}
function handleItemWithError(item, options, callback) {
  item.data = item.data || {};
  if (item.err) {
    try {
      item.stackInfo = item.err._savedStackTrace || errorParser.parse(item.err, item.skipFrames);
      if (options.addErrorContext) {
        transforms_addErrorContext(item);
      }
    } catch (e) {
      src_logger.error('Error while parsing the error object.', e);
      try {
        item.message = item.err.message || item.err.description || item.message || String(item.err);
      } catch (e2) {
        item.message = String(item.err) || String(e2);
      }
      delete item.err;
    }
  }
  callback(null, item);
}
function transforms_addErrorContext(item) {
  var chain = [];
  var err = item.err;
  chain.push(err);
  while (err.nested || err.cause) {
    err = err.nested || err.cause;
    chain.push(err);
  }
  addErrorContext(item, chain);
}
function ensureItemHasSomethingToSay(item, options, callback) {
  if (!item.message && !item.stackInfo && !item.custom) {
    callback(new Error('No message, stack info, or custom data'), null);
  }
  callback(null, item);
}
function addBaseInfo(item, options, callback) {
  var environment = options.payload && options.payload.environment || options.environment;
  item.data = src_merge(item.data, {
    environment: environment,
    level: item.level,
    endpoint: options.endpoint,
    platform: 'browser',
    framework: 'browser-js',
    language: 'javascript',
    server: {},
    uuid: item.uuid,
    notifier: {
      name: 'rollbar-browser-js',
      version: options.version
    },
    custom: item.custom
  });
  callback(null, item);
}
function addRequestInfo(window) {
  return function (item, options, callback) {
    var requestInfo = {};
    if (window && window.location) {
      requestInfo.url = window.location.href;
      requestInfo.query_string = window.location.search;
    }
    var remoteString = '$remote_ip';
    if (!options.captureIp) {
      remoteString = null;
    } else if (options.captureIp !== true) {
      remoteString += '_anonymize';
    }
    if (remoteString) requestInfo.user_ip = remoteString;
    if (Object.keys(requestInfo).length > 0) {
      set(item, 'data.request', requestInfo);
    }
    callback(null, item);
  };
}
function addClientInfo(window) {
  return function (item, options, callback) {
    if (!window) {
      return callback(null, item);
    }
    var nav = window.navigator || {};
    var scr = window.screen || {};
    set(item, 'data.client', {
      runtime_ms: item.timestamp - window._rollbarStartTime,
      timestamp: Math.round(item.timestamp / 1000),
      javascript: {
        browser: nav.userAgent,
        language: nav.language,
        cookie_enabled: nav.cookieEnabled,
        screen: {
          width: scr.width,
          height: scr.height
        }
      }
    });
    callback(null, item);
  };
}
function addPluginInfo(window) {
  return function (item, options, callback) {
    if (!window || !window.navigator) {
      return callback(null, item);
    }
    var plugins = [];
    var navPlugins = window.navigator.plugins || [];
    var cur;
    for (var i = 0, l = navPlugins.length; i < l; ++i) {
      cur = navPlugins[i];
      plugins.push({
        name: cur.name,
        description: cur.description
      });
    }
    set(item, 'data.client.javascript.plugins', plugins);
    callback(null, item);
  };
}
function addBody(item, options, callback) {
  if (item.stackInfo) {
    if (item.stackInfo.traceChain) {
      addBodyTraceChain(item, options, callback);
    } else {
      addBodyTrace(item, options, callback);
    }
  } else {
    addBodyMessage(item, options, callback);
  }
}
function addBodyMessage(item, options, callback) {
  var message = item.message;
  var custom = item.custom;
  if (!message) {
    message = 'Item sent with null or missing arguments.';
  }
  var result = {
    body: message
  };
  if (custom) {
    result.extra = src_merge(custom);
  }
  set(item, 'data.body', {
    message: result
  });
  callback(null, item);
}
function stackFromItem(item) {
  // Transform a TraceKit stackInfo object into a Rollbar trace
  var stack = item.stackInfo.stack;
  if (stack && stack.length === 0 && item._unhandledStackInfo && item._unhandledStackInfo.stack) {
    stack = item._unhandledStackInfo.stack;
  }
  return stack;
}
function addBodyTraceChain(item, options, callback) {
  var traceChain = item.stackInfo.traceChain;
  var traces = [];
  var traceChainLength = traceChain.length;
  for (var i = 0; i < traceChainLength; i++) {
    var trace = buildTrace(item, traceChain[i], options);
    traces.push(trace);
  }
  set(item, 'data.body', {
    trace_chain: traces
  });
  callback(null, item);
}
function addBodyTrace(item, options, callback) {
  var stack = stackFromItem(item);
  if (stack) {
    var trace = buildTrace(item, item.stackInfo, options);
    set(item, 'data.body', {
      trace: trace
    });
    callback(null, item);
  } else {
    var stackInfo = item.stackInfo;
    var guess = errorParser.guessErrorClass(stackInfo.message);
    var className = errorClass(stackInfo, guess[0], options);
    var message = guess[1];
    item.message = className + ': ' + message;
    addBodyMessage(item, options, callback);
  }
}
function buildTrace(item, stackInfo, options) {
  var description = item && item.data.description;
  var custom = item && item.custom;
  var stack = stackFromItem(item);
  var guess = errorParser.guessErrorClass(stackInfo.message);
  var className = errorClass(stackInfo, guess[0], options);
  var message = guess[1];
  var trace = {
    exception: {
      class: className,
      message: message
    }
  };
  if (description) {
    trace.exception.description = description;
  }
  if (stack) {
    if (stack.length === 0) {
      trace.exception.stack = stackInfo.rawStack;
      trace.exception.raw = String(stackInfo.rawException);
    }
    var stackFrame;
    var frame;
    var code;
    var pre;
    var post;
    var contextLength;
    var i, mid;
    trace.frames = [];
    for (i = 0; i < stack.length; ++i) {
      stackFrame = stack[i];
      frame = {
        filename: stackFrame.url ? sanitizeUrl(stackFrame.url) : '(unknown)',
        lineno: stackFrame.line || null,
        method: !stackFrame.func || stackFrame.func === '?' ? '[anonymous]' : stackFrame.func,
        colno: stackFrame.column
      };
      if (options.sendFrameUrl) {
        frame.url = stackFrame.url;
      }
      if (frame.method && frame.method.endsWith && frame.method.endsWith('_rollbar_wrapped')) {
        continue;
      }
      code = pre = post = null;
      contextLength = stackFrame.context ? stackFrame.context.length : 0;
      if (contextLength) {
        mid = Math.floor(contextLength / 2);
        pre = stackFrame.context.slice(0, mid);
        code = stackFrame.context[mid];
        post = stackFrame.context.slice(mid);
      }
      if (code) {
        frame.code = code;
      }
      if (pre || post) {
        frame.context = {};
        if (pre && pre.length) {
          frame.context.pre = pre;
        }
        if (post && post.length) {
          frame.context.post = post;
        }
      }
      if (stackFrame.args) {
        frame.args = stackFrame.args;
      }
      trace.frames.push(frame);
    }

    // NOTE(cory): reverse the frames since rollbar.com expects the most recent call last
    trace.frames.reverse();
    if (custom) {
      trace.extra = src_merge(custom);
    }
  }
  return trace;
}
function errorClass(stackInfo, guess, options) {
  if (stackInfo.name) {
    return stackInfo.name;
  } else if (options.guessErrorClass) {
    return guess;
  } else {
    return '(unknown)';
  }
}
function addScrubber(scrubFn) {
  return function (item, options, callback) {
    if (scrubFn) {
      var scrubFields = options.scrubFields || [];
      var scrubPaths = options.scrubPaths || [];
      item.data = scrubFn(item.data, scrubFields, scrubPaths);
    }
    callback(null, item);
  };
}

;// ./src/transforms.js

function itemToPayload(item, options, callback) {
  if (item._isUncaught) {
    item.data._isUncaught = true;
  }
  if (item._originalArgs) {
    item.data._originalArgs = item._originalArgs;
  }
  callback(null, item);
}
function addPayloadOptions(item, options, callback) {
  var payloadOptions = options.payload || {};
  if (payloadOptions.body) {
    delete payloadOptions.body;
  }
  item.data = src_merge(item.data, payloadOptions);
  callback(null, item);
}
function addTelemetryData(item, options, callback) {
  if (item.telemetryEvents) {
    set(item, 'data.body.telemetry', item.telemetryEvents);
  }
  callback(null, item);
}
function addMessageWithError(item, options, callback) {
  if (!item.message) {
    callback(null, item);
    return;
  }
  var tracePath = 'data.body.trace_chain.0';
  var trace = get(item, tracePath);
  if (!trace) {
    tracePath = 'data.body.trace';
    trace = get(item, tracePath);
  }
  if (trace) {
    if (!(trace.exception && trace.exception.description)) {
      set(item, tracePath + '.exception.description', item.message);
      callback(null, item);
      return;
    }
    var extra = get(item, tracePath + '.extra') || {};
    var newExtra = src_merge(extra, {
      message: item.message
    });
    set(item, tracePath + '.extra', newExtra);
  }
  callback(null, item);
}
function userTransform(logger) {
  return function (item, options, callback) {
    var newItem = src_merge(item);
    var response = null;
    try {
      if (isFunction(options.transform)) {
        response = options.transform(newItem.data, item);
      }
    } catch (e) {
      options.transform = null;
      logger.error('Error while calling custom transform() function. Removing custom transform().', e);
      callback(null, item);
      return;
    }
    if (isPromise(response)) {
      response.then(function (promisedItem) {
        if (promisedItem) {
          newItem.data = promisedItem;
        }
        callback(null, newItem);
      }, function (error) {
        callback(error, item);
      });
    } else {
      callback(null, newItem);
    }
  };
}
function addConfigToPayload(item, options, callback) {
  if (!options.sendConfig) {
    return callback(null, item);
  }
  var configKey = '_rollbarConfig';
  var custom = get(item, 'data.custom') || {};
  custom[configKey] = options;
  item.data.custom = custom;
  callback(null, item);
}
function addFunctionOption(options, name) {
  if (isFunction(options[name])) {
    options[name] = options[name].toString();
  }
}
function addConfiguredOptions(item, options, callback) {
  var configuredOptions = options._configuredOptions;

  // These must be stringified or they'll get dropped during serialization.
  addFunctionOption(configuredOptions, 'transform');
  addFunctionOption(configuredOptions, 'checkIgnore');
  addFunctionOption(configuredOptions, 'onSendCallback');
  delete configuredOptions.accessToken;
  item.data.notifier.configured_options = configuredOptions;
  callback(null, item);
}
function addDiagnosticKeys(item, options, callback) {
  var diagnostic = src_merge(item.notifier.client.notifier.diagnostic, item.diagnostic);
  if (get(item, 'err._isAnonymous')) {
    diagnostic.is_anonymous = true;
  }
  if (item._isUncaught) {
    diagnostic.is_uncaught = item._isUncaught;
  }
  if (item.err) {
    try {
      diagnostic.raw_error = {
        message: item.err.message,
        name: item.err.name,
        constructor_name: item.err.constructor && item.err.constructor.name,
        filename: item.err.fileName,
        line: item.err.lineNumber,
        column: item.err.columnNumber,
        stack: item.err.stack
      };
    } catch (e) {
      diagnostic.raw_error = {
        failed: String(e)
      };
    }
  }
  item.data.notifier.diagnostic = src_merge(item.data.notifier.diagnostic, diagnostic);
  callback(null, item);
}

;// ./src/browser/predicates.js

function checkIgnore(item, settings) {
  if (get(settings, 'plugins.jquery.ignoreAjaxErrors')) {
    return !get(item, 'body.message.extra.isAjax');
  }
  return true;
}

;// ./src/predicates.js

function checkLevel(item, settings) {
  var level = item.level;
  var levelVal = LEVELS[level] || 0;
  var reportLevel = settings.reportLevel;
  var reportLevelVal = LEVELS[reportLevel] || 0;
  if (levelVal < reportLevelVal) {
    return false;
  }
  return true;
}
function userCheckIgnore(logger) {
  return function (item, settings) {
    var isUncaught = !!item._isUncaught;
    delete item._isUncaught;
    var args = item._originalArgs;
    delete item._originalArgs;
    try {
      if (isFunction(settings.onSendCallback)) {
        settings.onSendCallback(isUncaught, args, item);
      }
    } catch (e) {
      settings.onSendCallback = null;
      logger.error('Error while calling onSendCallback, removing', e);
    }
    try {
      if (isFunction(settings.checkIgnore) && settings.checkIgnore(isUncaught, args, item)) {
        return false;
      }
    } catch (e) {
      settings.checkIgnore = null;
      logger.error('Error while calling custom checkIgnore(), removing', e);
    }
    return true;
  };
}
function urlIsNotBlockListed(logger) {
  return function (item, settings) {
    return !urlIsOnAList(item, settings, 'blocklist', logger);
  };
}
function urlIsSafeListed(logger) {
  return function (item, settings) {
    return urlIsOnAList(item, settings, 'safelist', logger);
  };
}
function matchFrames(trace, list, block) {
  if (!trace) {
    return !block;
  }
  var frames = trace.frames;
  if (!frames || frames.length === 0) {
    return !block;
  }
  var frame, filename, url, urlRegex;
  var listLength = list.length;
  var frameLength = frames.length;
  for (var i = 0; i < frameLength; i++) {
    frame = frames[i];
    filename = frame.filename;
    if (!isType(filename, 'string')) {
      return !block;
    }
    for (var j = 0; j < listLength; j++) {
      url = list[j];
      urlRegex = new RegExp(url);
      if (urlRegex.test(filename)) {
        return true;
      }
    }
  }
  return false;
}
function urlIsOnAList(item, settings, safeOrBlock, logger) {
  // safelist is the default
  var block = false;
  if (safeOrBlock === 'blocklist') {
    block = true;
  }
  var list, traces;
  try {
    list = block ? settings.hostBlockList : settings.hostSafeList;
    traces = get(item, 'body.trace_chain') || [get(item, 'body.trace')];

    // These two checks are important to come first as they are defaults
    // in case the list is missing or the trace is missing or not well-formed
    if (!list || list.length === 0) {
      return !block;
    }
    if (traces.length === 0 || !traces[0]) {
      return !block;
    }
    var tracesLength = traces.length;
    for (var i = 0; i < tracesLength; i++) {
      if (matchFrames(traces[i], list, block)) {
        return true;
      }
    }
  } catch (e
  /* istanbul ignore next */) {
    if (block) {
      settings.hostBlockList = null;
    } else {
      settings.hostSafeList = null;
    }
    var listName = block ? 'hostBlockList' : 'hostSafeList';
    logger.error("Error while reading your configuration's " + listName + ' option. Removing custom ' + listName + '.', e);
    return !block;
  }
  return false;
}
function messageIsIgnored(logger) {
  return function (item, settings) {
    var i, j, ignoredMessages, len, messageIsIgnored, rIgnoredMessage, messages;
    try {
      messageIsIgnored = false;
      ignoredMessages = settings.ignoredMessages;
      if (!ignoredMessages || ignoredMessages.length === 0) {
        return true;
      }
      messages = messagesFromItem(item);
      if (messages.length === 0) {
        return true;
      }
      len = ignoredMessages.length;
      for (i = 0; i < len; i++) {
        rIgnoredMessage = new RegExp(ignoredMessages[i], 'gi');
        for (j = 0; j < messages.length; j++) {
          messageIsIgnored = rIgnoredMessage.test(messages[j]);
          if (messageIsIgnored) {
            return false;
          }
        }
      }
    } catch (e
    /* istanbul ignore next */) {
      settings.ignoredMessages = null;
      logger.error("Error while reading your configuration's ignoredMessages option. Removing custom ignoredMessages.");
    }
    return true;
  };
}
function messagesFromItem(item) {
  var body = item.body;
  var messages = [];

  // The payload schema only allows one of trace_chain, message, or trace.
  // However, existing test cases are based on having both trace and message present.
  // So here we preserve the ability to collect strings from any combination of these keys.
  if (body.trace_chain) {
    var traceChain = body.trace_chain;
    for (var i = 0; i < traceChain.length; i++) {
      var trace = traceChain[i];
      messages.push(get(trace, 'exception.message'));
    }
  }
  if (body.trace) {
    messages.push(get(body, 'trace.exception.message'));
  }
  if (body.message) {
    messages.push(get(body, 'message.body'));
  }
  return messages;
}

;// ./src/browser/replay/defaults.js
/**
 * Default session replay recording options
 * See https://github.com/rrweb-io/rrweb/blob/master/guide.md#options for details
 */
/* harmony default export */ var defaults = ({
  enabled: false,
  // Whether recording is enabled
  autoStart: true,
  // Start recording automatically when Rollbar initializes

  // defaults used by triggers that don't specify them
  triggerDefaults: {
    samplingRatio: 1.0,
    preDuration: 300,
    postDuration: 5
  },
  triggers: [{
    type: 'occurrence',
    level: ['error', 'critical']
  }],
  debug: {
    logErrors: true,
    // Whether to log errors emitted by rrweb.
    logEmits: false // Whether to log emitted events
  },
  // Recording options
  inlineStylesheet: true,
  // Whether to inline stylesheets to improve replay accuracy
  inlineImages: false,
  // Whether to record the image content
  collectFonts: true,
  // Whether to collect fonts in the website

  // Privacy options
  // Fine-grained control over which input types to mask
  // By default only password inputs are masked if maskInputs is true
  maskInputOptions: {
    password: true,
    email: false,
    tel: false,
    text: false,
    color: false,
    date: false,
    'datetime-local': false,
    month: false,
    number: false,
    range: false,
    search: false,
    time: false,
    url: false,
    week: false
  },
  // Mask all input values
  maskAllInputs: false,
  // Class names to block, mask, or ignore the content of elements.
  blockClass: 'rb-block',
  maskTextClass: 'rb-mask',
  ignoreClass: 'rb-ignore',
  // Remove unnecessary parts of the DOM
  // By default all removable elements are removed
  slimDOMOptions: {
    script: true,
    // Remove script elements
    comment: true,
    // Remove comments
    headFavicon: true,
    // Remove favicons in the head
    headWhitespace: true,
    // Remove whitespace in head
    headMetaDescKeywords: true,
    // Remove meta description and keywords
    headMetaSocial: true,
    // Remove social media meta tags
    headMetaRobots: true,
    // Remove robots meta directives
    headMetaHttpEquiv: true,
    // Remove http-equiv meta directives
    headMetaAuthorship: true,
    // Remove authorship meta directives
    headMetaVerification: true // Remove verification meta directives
  }

  // Custom callbacks for advanced use cases
  // These are undefined by default and can be set programmatically
  // maskInputFn: undefined,      // Custom function to mask input values
  // maskTextFn: undefined,       // Custom function to mask text content
  // errorHandler: undefined,     // Custom error handler for recording errors

  // Plugin system
  // plugins: []                  // List of plugins to use (must be set programmatically)
});
;// ./src/tracing/defaults.js
/**
 * Default tracing options
 */
/* harmony default export */ var tracing_defaults = ({
  enabled: false,
  endpoint: 'api.rollbar.com/api/1/session/'
});
;// ./src/defaults.js
/**
 * Default options shared across platforms
 */
var version = '3.0.0-beta.5';
var endpoint = 'api.rollbar.com/api/1/item/';
var logLevel = 'debug';
var reportLevel = 'debug';
var uncaughtErrorLevel = 'error';
var maxItems = 0;
var itemsPerMin = 60;
var commonScrubFields = ['pw', 'pass', 'passwd', 'password', 'secret', 'confirm_password', 'confirmPassword', 'password_confirmation', 'passwordConfirmation', 'access_token', 'accessToken', 'X-Rollbar-Access-Token', 'secret_key', 'secretKey', 'secretToken'];
var apiScrubFields = (/* unused pure expression or super */ null && (['api_key', 'authenticity_token', 'oauth_token', 'token', 'user_session_secret']));
var requestScrubFields = (/* unused pure expression or super */ null && (['request.session.csrf', 'request.session._csrf', 'request.params._csrf', 'request.cookie', 'request.cookies']));
var commonScrubHeaders = (/* unused pure expression or super */ null && (['authorization', 'www-authorization', 'http_authorization', 'omniauth.auth', 'cookie', 'oauth-access-token', 'x-access-token', 'x_csrf_token', 'http_x_csrf_token', 'x-csrf-token']));

// For backward compatibility with default export
/* harmony default export */ var src_defaults = ({
  version: version,
  endpoint: endpoint,
  logLevel: logLevel,
  reportLevel: reportLevel,
  uncaughtErrorLevel: uncaughtErrorLevel,
  maxItems: maxItems,
  itemsPerMin: itemsPerMin
});
;// ./src/browser/defaults.js
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || defaults_unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function defaults_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return defaults_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? defaults_arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return defaults_arrayLikeToArray(r); }
function defaults_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * Default browser options
 */

var scrubFields = [].concat(_toConsumableArray(commonScrubFields), ['cc-number', 'card number', 'cardnumber', 'cardnum', 'ccnum', 'ccnumber', 'cc num', 'creditcardnumber', 'credit card number', 'newcreditcardnumber', 'new credit card', 'creditcardno', 'credit card no', 'card#', 'card #', 'cc-csc', 'cvc', 'cvc2', 'cvv2', 'ccv2', 'security code', 'card verification', 'name on credit card', 'name on card', 'nameoncard', 'cardholder', 'card holder', 'name des karteninhabers', 'ccname', 'card type', 'cardtype', 'cc type', 'cctype', 'payment type', 'expiration date', 'expirationdate', 'expdate', 'cc-exp', 'ccmonth', 'ccyear']);

// For compatibility with existing code that expects default export with scrubFields property
/* harmony default export */ var browser_defaults = ({
  scrubFields: scrubFields
});
;// ./src/browser/core.js
var _Rollbar;
function core_typeof(o) { "@babel/helpers - typeof"; return core_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, core_typeof(o); }
function core_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function core_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? core_ownKeys(Object(t), !0).forEach(function (r) { core_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : core_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function core_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function core_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, core_toPropertyKey(o.key), o); } }
function core_createClass(e, r, t) { return r && core_defineProperties(e.prototype, r), t && core_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function core_defineProperty(e, r, t) { return (r = core_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function core_toPropertyKey(t) { var i = core_toPrimitive(t, "string"); return "symbol" == core_typeof(i) ? i : i + ""; }
function core_toPrimitive(t, r) { if ("object" != core_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != core_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }















// Used to support global `Rollbar` instance.
var _instance = null;
var core_Rollbar = /*#__PURE__*/function () {
  function Rollbar(options, client) {
    core_classCallCheck(this, Rollbar);
    src_logger.init({
      logLevel: options.logLevel || 'error'
    });
    this.options = handleOptions(core_defaultOptions, options, null, src_logger);
    this.options._configuredOptions = options;
    this.components = this.components || {};
    var Telemeter = this.components.telemeter;
    var Instrumenter = this.components.instrumenter;
    this.wrapGlobals = this.components.wrapGlobals;
    this.scrub = this.components.scrub;
    var truncation = this.components.truncation;
    var Tracing = this.components.tracing;
    var Replay = this.components.replay;
    var transport = new browser_transport(truncation);
    var api = new src_api(this.options, transport, url_namespaceObject, truncation);
    if (Tracing) {
      this.tracing = new Tracing(_gWindow(), api, this.options);
      this.tracing.initSession();
    }
    if (Telemeter) {
      this.telemeter = new Telemeter(this.options, this.tracing);
    }
    if (Replay && isBrowser()) {
      var replayOptions = this.options.replay;
      this.replay = new Replay({
        tracing: this.tracing,
        telemeter: this.telemeter,
        options: replayOptions
      });
      if (replayOptions.enabled && replayOptions.autoStart) {
        this.replay.recorder.start();
      }
    }
    this.client = client || new src_rollbar(this.options, api, src_logger, this.telemeter, this.tracing, this.replay, 'browser');
    var gWindow = _gWindow();
    var gDocument = typeof document != 'undefined' && document;
    this.isChrome = gWindow.chrome && gWindow.chrome.runtime; // check .runtime to avoid Edge browsers
    this.anonymousErrorsPending = 0;
    addTransformsToNotifier(this.client.notifier, this, gWindow);
    addPredicatesToQueue(this.client.queue);
    this.setupUnhandledCapture();
    if (Instrumenter) {
      this.instrumenter = new Instrumenter(this.options, this.client.telemeter, this, gWindow, gDocument);
      this.instrumenter.instrument();
    }
    this.setSessionAttributesFromOptions(options);

    // Used with rollbar-react for rollbar-react-native compatibility.
    this.rollbar = this;
  }
  return core_createClass(Rollbar, [{
    key: "global",
    value: function global(options) {
      this.client.global(options);
      return this;
    }
  }, {
    key: "configure",
    value: function configure(options, payloadData) {
      var _this$tracing, _this$replay, _this$instrumenter;
      if (options.logLevel) {
        src_logger.init({
          logLevel: options.logLevel
        });
      }
      this.setSessionAttributesFromOptions(options);
      var oldOptions = this.options;
      var payload = {};
      if (payloadData) {
        payload = {
          payload: payloadData
        };
      }
      this.options = handleOptions(oldOptions, options, payload, src_logger);
      this.options._configuredOptions = handleOptions(oldOptions._configuredOptions, options, payload);
      (_this$tracing = this.tracing) === null || _this$tracing === void 0 || _this$tracing.configure(this.options);
      (_this$replay = this.replay) === null || _this$replay === void 0 || _this$replay.configure(this.options);
      this.client.configure(this.options, payloadData);
      (_this$instrumenter = this.instrumenter) === null || _this$instrumenter === void 0 || _this$instrumenter.configure(this.options);
      this.setupUnhandledCapture();
      return this;
    }
  }, {
    key: "lastError",
    value: function lastError() {
      return this.client.lastError;
    }
  }, {
    key: "log",
    value: function log() {
      var item = this._createItem(arguments);
      var uuid = item.uuid;
      this.client.log(item);
      return {
        uuid: uuid
      };
    }
  }, {
    key: "debug",
    value: function debug() {
      var item = this._createItem(arguments);
      var uuid = item.uuid;
      this.client.debug(item);
      return {
        uuid: uuid
      };
    }
  }, {
    key: "info",
    value: function info() {
      var item = this._createItem(arguments);
      var uuid = item.uuid;
      this.client.info(item);
      return {
        uuid: uuid
      };
    }
  }, {
    key: "warn",
    value: function warn() {
      var item = this._createItem(arguments);
      var uuid = item.uuid;
      this.client.warn(item);
      return {
        uuid: uuid
      };
    }
  }, {
    key: "warning",
    value: function warning() {
      var item = this._createItem(arguments);
      var uuid = item.uuid;
      this.client.warning(item);
      return {
        uuid: uuid
      };
    }
  }, {
    key: "error",
    value: function error() {
      var item = this._createItem(arguments);
      var uuid = item.uuid;
      this.client.error(item);
      return {
        uuid: uuid
      };
    }
  }, {
    key: "critical",
    value: function critical() {
      var item = this._createItem(arguments);
      var uuid = item.uuid;
      this.client.critical(item);
      return {
        uuid: uuid
      };
    }
  }, {
    key: "buildJsonPayload",
    value: function buildJsonPayload(item) {
      return this.client.buildJsonPayload(item);
    }
  }, {
    key: "sendJsonPayload",
    value: function sendJsonPayload(jsonPayload) {
      return this.client.sendJsonPayload(jsonPayload);
    }
  }, {
    key: "triggerDirectReplay",
    value: function triggerDirectReplay(context) {
      return this.triggerReplay(core_objectSpread({
        type: 'direct'
      }, context));
    }
  }, {
    key: "triggerReplay",
    value: function triggerReplay(context) {
      if (!this.replay) return null;
      return this.replay.triggerReplay(context);
    }
  }, {
    key: "setupUnhandledCapture",
    value: function setupUnhandledCapture() {
      var gWindow = _gWindow();
      if (!this.unhandledExceptionsInitialized) {
        if (this.options.captureUncaught || this.options.handleUncaughtExceptions) {
          captureUncaughtExceptions(gWindow, this);
          if (this.wrapGlobals && this.options.wrapGlobalEventHandlers) {
            this.wrapGlobals(gWindow, this);
          }
          this.unhandledExceptionsInitialized = true;
        }
      }
      if (!this.unhandledRejectionsInitialized) {
        if (this.options.captureUnhandledRejections || this.options.handleUnhandledRejections) {
          captureUnhandledRejections(gWindow, this);
          this.unhandledRejectionsInitialized = true;
        }
      }
    }
  }, {
    key: "handleUncaughtException",
    value: function handleUncaughtException(message, url, lineno, colno, error, context) {
      if (!this.options.captureUncaught && !this.options.handleUncaughtExceptions) {
        return;
      }

      // Chrome will always send 5+ arguments and error will be valid or null, not undefined.
      // If error is undefined, we have a different caller.
      // Chrome also sends errors from web workers with null error, but does not invoke
      // prepareStackTrace() for these. Test for empty url to skip them.
      if (this.options.inspectAnonymousErrors && this.isChrome && error === null && url === '') {
        return 'anonymous';
      }
      var item;
      var stackInfo = makeUnhandledStackInfo(message, url, lineno, colno, error, 'onerror', 'uncaught exception', errorParser);
      if (isError(error)) {
        item = this._createItem([message, error, context]);
        item._unhandledStackInfo = stackInfo;
      } else if (isError(url)) {
        item = this._createItem([message, url, context]);
        item._unhandledStackInfo = stackInfo;
      } else {
        item = this._createItem([message, context]);
        item.stackInfo = stackInfo;
      }
      item.level = this.options.uncaughtErrorLevel;
      item._isUncaught = true;
      this.client.log(item);
    }

    /**
     * Chrome only. Other browsers will ignore.
     *
     * Use Error.prepareStackTrace to extract information about errors that
     * do not have a valid error object in onerror().
     *
     * In tested version of Chrome, onerror is called first but has no way
     * to communicate with prepareStackTrace. Use a counter to let this
     * handler know which errors to send to Rollbar.
     *
     * In config options, set inspectAnonymousErrors to enable.
     */
  }, {
    key: "handleAnonymousErrors",
    value: function handleAnonymousErrors() {
      if (!this.options.inspectAnonymousErrors || !this.isChrome) {
        return;
      }
      var r = this;
      function prepareStackTrace(error, _stack) {
        if (r.options.inspectAnonymousErrors) {
          if (r.anonymousErrorsPending) {
            // This is the only known way to detect that onerror saw an anonymous error.
            // It depends on onerror reliably being called before Error.prepareStackTrace,
            // which so far holds true on tested versions of Chrome. If versions of Chrome
            // are tested that behave differently, this logic will need to be updated
            // accordingly.
            r.anonymousErrorsPending -= 1;
            if (!error) {
              // Not likely to get here, but calling handleUncaughtException from here
              // without an error object would throw off the anonymousErrorsPending counter,
              // so return now.
              return;
            }

            // Allow this to be tracked later.
            error._isAnonymous = true;

            // url, lineno, colno shouldn't be needed for these errors.
            // If that changes, update this accordingly, using the unused
            // _stack param as needed (rather than parse error.toString()).
            r.handleUncaughtException(error.message, null, null, null, error);
          }
        }

        // Workaround to ensure stack is preserved for normal errors.
        return error.stack;
      }

      // https://v8.dev/docs/stack-trace-api
      try {
        Error.prepareStackTrace = prepareStackTrace;
      } catch (e) {
        this.options.inspectAnonymousErrors = false;
        this.error('anonymous error handler failed', e);
      }
    }
  }, {
    key: "handleUnhandledRejection",
    value: function handleUnhandledRejection(reason, promise) {
      if (!this.options.captureUnhandledRejections && !this.options.handleUnhandledRejections) {
        return;
      }
      var message = 'unhandled rejection was null or undefined!';
      if (reason) {
        if (reason.message) {
          message = reason.message;
        } else {
          var reasonResult = stringify(reason);
          if (reasonResult.value) {
            message = reasonResult.value;
          }
        }
      }
      var context = reason && reason._rollbarContext || promise && promise._rollbarContext;
      var item;
      if (isError(reason)) {
        item = this._createItem([message, reason, context]);
      } else {
        item = this._createItem([message, reason, context]);
        item.stackInfo = makeUnhandledStackInfo(message, '', 0, 0, null, 'unhandledrejection', '', errorParser);
      }
      item.level = this.options.uncaughtErrorLevel;
      item._isUncaught = true;
      item._originalArgs = item._originalArgs || [];
      item._originalArgs.push(promise);
      this.client.log(item);
    }
  }, {
    key: "wrap",
    value: function wrap(f, context, _before) {
      try {
        var ctxFn;
        if (isFunction(context)) {
          ctxFn = context;
        } else {
          ctxFn = function ctxFn() {
            return context || {};
          };
        }
        if (!isFunction(f)) {
          return f;
        }
        if (f._isWrap) {
          return f;
        }
        if (!f._rollbar_wrapped) {
          f._rollbar_wrapped = function () {
            if (_before && isFunction(_before)) {
              _before.apply(this, arguments);
            }
            try {
              return f.apply(this, arguments);
            } catch (exc) {
              var e = exc;
              if (e && window._rollbarWrappedError !== e) {
                if (isType(e, 'string')) {
                  e = new String(e);
                }
                e._rollbarContext = ctxFn() || {};
                e._rollbarContext._wrappedSource = f.toString();
                window._rollbarWrappedError = e;
              }
              throw e;
            }
          };
          f._rollbar_wrapped._isWrap = true;
          if (f.hasOwnProperty) {
            for (var prop in f) {
              if (f.hasOwnProperty(prop) && prop !== '_rollbar_wrapped') {
                f._rollbar_wrapped[prop] = f[prop];
              }
            }
          }
        }
        return f._rollbar_wrapped;
      } catch (e) {
        // Return the original function if the wrap fails.
        return f;
      }
    }
  }, {
    key: "captureEvent",
    value: function captureEvent() {
      var event = createTelemetryEvent(arguments);
      return this.client.captureEvent(event.type, event.metadata, event.level);
    }
  }, {
    key: "setSessionUser",
    value: function setSessionUser(user) {
      var _this$tracing2;
      if (!((_this$tracing2 = this.tracing) !== null && _this$tracing2 !== void 0 && _this$tracing2.session)) return;
      this.tracing.session.setUser(user);
    }
  }, {
    key: "setSessionAttributes",
    value: function setSessionAttributes(attrs) {
      var _this$tracing3;
      if (!((_this$tracing3 = this.tracing) !== null && _this$tracing3 !== void 0 && _this$tracing3.session)) return;
      attrs = core_objectSpread({}, attrs);
      this.tracing.session.setAttributes(attrs);
    }
  }, {
    key: "setSessionAttributesFromOptions",
    value: function setSessionAttributesFromOptions(options) {
      var _options$payload, _options$client, _options$payload2, _options$payload3, _options$payload4;
      var person = options.person || ((_options$payload = options.payload) === null || _options$payload === void 0 ? void 0 : _options$payload.person);
      if (person) {
        this.setSessionUser(person);
      }
      var code_version = ((_options$client = options.client) === null || _options$client === void 0 || (_options$client = _options$client.javascript) === null || _options$client === void 0 ? void 0 : _options$client.code_version) || options.codeVersion || options.code_version || ((_options$payload2 = options.payload) === null || _options$payload2 === void 0 || (_options$payload2 = _options$payload2.client) === null || _options$payload2 === void 0 || (_options$payload2 = _options$payload2.javascript) === null || _options$payload2 === void 0 ? void 0 : _options$payload2.code_version) || ((_options$payload3 = options.payload) === null || _options$payload3 === void 0 ? void 0 : _options$payload3.code_version) || ((_options$payload4 = options.payload) === null || _options$payload4 === void 0 ? void 0 : _options$payload4.codeVersion);
      this.setSessionAttributes({
        'rollbar.codeVersion': code_version,
        'rollbar.notifier.name': 'rollbar-browser-js',
        'rollbar.notifier.version': options.version
      });
    }

    // The following two methods are used internally and are not meant for public use
  }, {
    key: "captureDomContentLoaded",
    value: function captureDomContentLoaded(e, ts) {
      if (!ts) {
        ts = new Date();
      }
      return this.client.captureDomContentLoaded(ts);
    }
  }, {
    key: "captureLoad",
    value: function captureLoad(e, ts) {
      if (!ts) {
        ts = new Date();
      }
      return this.client.captureLoad(ts);
    }
  }, {
    key: "loadFull",
    value: function loadFull() {
      src_logger.info('Unexpected Rollbar.loadFull() called on a Notifier instance. This can happen when Rollbar is loaded multiple times.');
    }
  }, {
    key: "_createItem",
    value: function _createItem(args) {
      return createItem(args, src_logger, this);
    }

    // Static version of instance methods support the legacy pattern of a
    // global `Rollbar` instance, where after calling `Rollbar.init()`,
    // `Rollbar` can be used as if it were an instance.
    // If support for this pattern is dropped, these static methods can be removed.
  }], [{
    key: "init",
    value: function init(options, client) {
      if (_instance) {
        return _instance.global(options).configure(options);
      }
      _instance = new Rollbar(options, client);
      return _instance;
    }
  }, {
    key: "setComponents",
    value: function setComponents(components) {
      Rollbar.prototype.components = components;
    }
  }, {
    key: "callInstance",
    value: function callInstance(method, args) {
      if (!_instance) {
        var message = 'Rollbar is not initialized';
        src_logger.error(message);
        var maybeCallback = _getFirstFunction(args);
        if (maybeCallback) {
          maybeCallback(new Error(message));
        }
        return;
      }
      return _instance[method].apply(_instance, args);
    }
  }]);
}();
/* Internal */
_Rollbar = core_Rollbar;
core_defineProperty(core_Rollbar, "global", function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return _Rollbar.callInstance('global', args);
});
core_defineProperty(core_Rollbar, "configure", function () {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }
  return _Rollbar.callInstance('configure', args);
});
core_defineProperty(core_Rollbar, "lastError", function () {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }
  return _Rollbar.callInstance('lastError', args);
});
core_defineProperty(core_Rollbar, "log", function () {
  for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }
  return _Rollbar.callInstance('log', args);
});
core_defineProperty(core_Rollbar, "debug", function () {
  for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    args[_key5] = arguments[_key5];
  }
  return _Rollbar.callInstance('debug', args);
});
core_defineProperty(core_Rollbar, "info", function () {
  for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    args[_key6] = arguments[_key6];
  }
  return _Rollbar.callInstance('info', args);
});
core_defineProperty(core_Rollbar, "warn", function () {
  for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
    args[_key7] = arguments[_key7];
  }
  return _Rollbar.callInstance('warn', args);
});
core_defineProperty(core_Rollbar, "warning", function () {
  for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
    args[_key8] = arguments[_key8];
  }
  return _Rollbar.callInstance('warning', args);
});
core_defineProperty(core_Rollbar, "error", function () {
  for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
    args[_key9] = arguments[_key9];
  }
  return _Rollbar.callInstance('error', args);
});
core_defineProperty(core_Rollbar, "critical", function () {
  for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
    args[_key10] = arguments[_key10];
  }
  return _Rollbar.callInstance('critical', args);
});
core_defineProperty(core_Rollbar, "buildJsonPayload", function () {
  for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
    args[_key11] = arguments[_key11];
  }
  return _Rollbar.callInstance('buildJsonPayload', args);
});
core_defineProperty(core_Rollbar, "sendJsonPayload", function () {
  for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
    args[_key12] = arguments[_key12];
  }
  return _Rollbar.callInstance('sendJsonPayload', args);
});
core_defineProperty(core_Rollbar, "wrap", function () {
  for (var _len13 = arguments.length, args = new Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
    args[_key13] = arguments[_key13];
  }
  return _Rollbar.callInstance('wrap', args);
});
core_defineProperty(core_Rollbar, "captureEvent", function () {
  for (var _len14 = arguments.length, args = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
    args[_key14] = arguments[_key14];
  }
  return _Rollbar.callInstance('captureEvent', args);
});
function addTransformsToNotifier(notifier, rollbar, gWindow) {
  notifier.addTransform(handleDomException).addTransform(handleItemWithError).addTransform(ensureItemHasSomethingToSay).addTransform(addBaseInfo).addTransform(addRequestInfo(gWindow)).addTransform(addClientInfo(gWindow)).addTransform(addPluginInfo(gWindow)).addTransform(addBody).addTransform(addMessageWithError).addTransform(addTelemetryData).addTransform(addConfigToPayload).addTransform(addScrubber(rollbar.scrub)).addTransform(addPayloadOptions).addTransform(userTransform(src_logger)).addTransform(addConfiguredOptions).addTransform(addDiagnosticKeys).addTransform(itemToPayload);
}
function addPredicatesToQueue(queue) {
  queue.addPredicate(checkLevel).addPredicate(checkIgnore).addPredicate(userCheckIgnore(src_logger)).addPredicate(urlIsNotBlockListed(src_logger)).addPredicate(urlIsSafeListed(src_logger)).addPredicate(messageIsIgnored(src_logger));
}
function _getFirstFunction(args) {
  for (var i = 0, len = args.length; i < len; ++i) {
    if (isFunction(args[i])) {
      return args[i];
    }
  }
  return undefined;
}
function _gWindow() {
  return typeof window != 'undefined' && window || typeof self != 'undefined' && self;
}


var core_defaultOptions = {
  environment: 'unknown',
  version: version,
  scrubFields: browser_defaults.scrubFields,
  logLevel: logLevel,
  reportLevel: reportLevel,
  uncaughtErrorLevel: uncaughtErrorLevel,
  endpoint: endpoint,
  verbose: false,
  enabled: true,
  transmit: true,
  sendConfig: false,
  includeItemsInTelemetry: true,
  captureIp: true,
  inspectAnonymousErrors: true,
  ignoreDuplicateErrors: true,
  wrapGlobalEventHandlers: false,
  replay: defaults,
  tracing: tracing_defaults
};
/* harmony default export */ var core = (core_Rollbar);
;// ./src/telemetry.js
var _excluded = ["otelAttributes"];
function telemetry_typeof(o) { "@babel/helpers - typeof"; return telemetry_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, telemetry_typeof(o); }
function telemetry_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function telemetry_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? telemetry_ownKeys(Object(t), !0).forEach(function (r) { telemetry_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : telemetry_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function telemetry_defineProperty(e, r, t) { return (r = telemetry_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function telemetry_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function telemetry_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, telemetry_toPropertyKey(o.key), o); } }
function telemetry_createClass(e, r, t) { return r && telemetry_defineProperties(e.prototype, r), t && telemetry_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function telemetry_toPropertyKey(t) { var i = telemetry_toPrimitive(t, "string"); return "symbol" == telemetry_typeof(i) ? i : i + ""; }
function telemetry_toPrimitive(t, r) { if ("object" != telemetry_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != telemetry_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var MAX_EVENTS = 100;

// Temporary workaround while solving commonjs -> esm issues in Node 18 - 20.
function fromMillis(millis) {
  return [Math.trunc(millis / 1000), Math.round(millis % 1000 * 1e6)];
}
var Telemeter = /*#__PURE__*/function () {
  function Telemeter(options, tracing) {
    var _this$tracing;
    telemetry_classCallCheck(this, Telemeter);
    this.queue = [];
    this.options = src_merge(options);
    var maxTelemetryEvents = this.options.maxTelemetryEvents || MAX_EVENTS;
    this.maxQueueSize = Math.max(0, Math.min(maxTelemetryEvents, MAX_EVENTS));
    this.tracing = tracing;
    this.telemetrySpan = (_this$tracing = this.tracing) === null || _this$tracing === void 0 ? void 0 : _this$tracing.startSpan('rollbar-telemetry', {});
  }
  return telemetry_createClass(Telemeter, [{
    key: "configure",
    value: function configure(options) {
      var oldOptions = this.options;
      this.options = src_merge(oldOptions, options);
      var maxTelemetryEvents = this.options.maxTelemetryEvents || MAX_EVENTS;
      var newMaxEvents = Math.max(0, Math.min(maxTelemetryEvents, MAX_EVENTS));
      var deleteCount = 0;
      if (this.queue.length > newMaxEvents) {
        deleteCount = this.queue.length - newMaxEvents;
      }
      this.maxQueueSize = newMaxEvents;
      this.queue.splice(0, deleteCount);
    }
  }, {
    key: "copyEvents",
    value: function copyEvents() {
      var events = Array.prototype.slice.call(this.queue, 0);
      if (isFunction(this.options.filterTelemetry)) {
        try {
          var i = events.length;
          while (i--) {
            if (this.options.filterTelemetry(events[i])) {
              events.splice(i, 1);
            }
          }
        } catch (e) {
          this.options.filterTelemetry = null;
        }
      }

      // Filter until supported in legacy telemetry
      events = events.filter(function (e) {
        return e.type !== 'connectivity';
      });

      // Remove internal keys from output
      events = events.map(function (_ref) {
        var otelAttributes = _ref.otelAttributes,
          event = _objectWithoutProperties(_ref, _excluded);
        return event;
      });
      return events;
    }
  }, {
    key: "exportTelemetrySpan",
    value: function exportTelemetrySpan() {
      var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (this.telemetrySpan) {
        this.telemetrySpan.end(attributes);
        this.telemetrySpan = this.tracing.startSpan('rollbar-telemetry', {});
      }
    }
  }, {
    key: "capture",
    value: function capture(type, metadata, level, rollbarUUID) {
      var timestamp = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var otelAttributes = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
      var e = {
        level: getLevel(type, level),
        type: type,
        timestamp_ms: timestamp || utility_now(),
        body: metadata,
        source: 'client'
      };
      if (rollbarUUID) {
        e.uuid = rollbarUUID;
      }
      if (otelAttributes) {
        e.otelAttributes = otelAttributes;
      }
      try {
        if (isFunction(this.options.filterTelemetry) && this.options.filterTelemetry(e)) {
          return false;
        }
      } catch (exc) {
        this.options.filterTelemetry = null;
      }
      this.push(e);
      return e;
    }
  }, {
    key: "captureEvent",
    value: function captureEvent(type, metadata, level, rollbarUUID) {
      return this.capture(type, metadata, level, rollbarUUID);
    }
  }, {
    key: "captureError",
    value: function captureError(err, level, rollbarUUID, timestamp) {
      var _this$telemetrySpan;
      var message = err.message || String(err);
      var metadata = {
        message: message
      };
      if (err.stack) {
        metadata.stack = err.stack;
      }
      var otelAttributes = {
        message: message,
        level: level,
        type: 'error',
        uuid: rollbarUUID
      };
      (_this$telemetrySpan = this.telemetrySpan) === null || _this$telemetrySpan === void 0 || _this$telemetrySpan.addEvent('rollbar-occurrence-event', otelAttributes, fromMillis(timestamp));
      return this.capture('error', metadata, level, rollbarUUID, timestamp, otelAttributes);
    }
  }, {
    key: "captureLog",
    value: function captureLog(message, level, rollbarUUID, timestamp) {
      var otelAttributes = null;

      // If the uuid is present, this is a message occurrence.
      if (rollbarUUID) {
        var _this$telemetrySpan2;
        otelAttributes = {
          message: message,
          level: level,
          type: 'message',
          uuid: rollbarUUID
        }, (_this$telemetrySpan2 = this.telemetrySpan) === null || _this$telemetrySpan2 === void 0 ? void 0 : _this$telemetrySpan2.addEvent('rollbar-occurrence-event', otelAttributes, fromMillis(timestamp));
      } else {
        var _this$telemetrySpan3;
        otelAttributes = {
          message: message,
          level: level
        };
        (_this$telemetrySpan3 = this.telemetrySpan) === null || _this$telemetrySpan3 === void 0 || _this$telemetrySpan3.addEvent('rollbar-log-event', otelAttributes, fromMillis(timestamp));
      }
      return this.capture('log', {
        message: message
      }, level, rollbarUUID, timestamp, otelAttributes);
    }
  }, {
    key: "captureNetwork",
    value: function captureNetwork(metadata, subtype, rollbarUUID, requestData) {
      var _metadata$response, _this$telemetrySpan4;
      subtype = subtype || 'xhr';
      metadata.subtype = metadata.subtype || subtype;
      if (requestData) {
        metadata.request = requestData;
      }
      var level = this.levelFromStatus(metadata.status_code);
      var endTimeNano = (metadata.end_time_ms || 0) * 1e6;
      var otelAttributes = {
        type: metadata.subtype,
        method: metadata.method,
        url: metadata.url,
        statusCode: metadata.status_code,
        'request.headers': JSON.stringify(metadata.request_headers || {}),
        'response.headers': JSON.stringify(((_metadata$response = metadata.response) === null || _metadata$response === void 0 ? void 0 : _metadata$response.headers) || {}),
        'response.timeUnixNano': endTimeNano.toString()
      };
      (_this$telemetrySpan4 = this.telemetrySpan) === null || _this$telemetrySpan4 === void 0 || _this$telemetrySpan4.addEvent('rollbar-network-event', otelAttributes, fromMillis(metadata.start_time_ms));
      return this.capture('network', metadata, level, rollbarUUID, metadata.start_time_ms, otelAttributes);
    }
  }, {
    key: "levelFromStatus",
    value: function levelFromStatus(statusCode) {
      if (statusCode >= 200 && statusCode < 400) {
        return 'info';
      }
      if (statusCode === 0 || statusCode >= 400) {
        return 'error';
      }
      return 'info';
    }
  }, {
    key: "captureDom",
    value: function captureDom(subtype, element, value, checked, rollbarUUID) {
      var metadata = {
        subtype: subtype,
        element: element
      };
      if (value !== undefined) {
        metadata.value = value;
      }
      if (checked !== undefined) {
        metadata.checked = checked;
      }
      return this.capture('dom', metadata, 'info', rollbarUUID);
    }
  }, {
    key: "captureInput",
    value: function captureInput(_ref2) {
      var _this$telemetrySpan5;
      var type = _ref2.type,
        isSynthetic = _ref2.isSynthetic,
        element = _ref2.element,
        value = _ref2.value,
        timestamp = _ref2.timestamp;
      var name = 'rollbar-input-event';
      var metadata = {
        type: name,
        subtype: type,
        element: element,
        value: value
      };
      var otelAttributes = {
        type: type,
        isSynthetic: isSynthetic,
        element: element,
        value: value,
        endTimeUnixNano: fromMillis(timestamp)
      };
      var event = this._getRepeatedEvent(name, otelAttributes);
      if (event) {
        return this._updateRepeatedEvent(event, otelAttributes, timestamp);
      }
      (_this$telemetrySpan5 = this.telemetrySpan) === null || _this$telemetrySpan5 === void 0 || _this$telemetrySpan5.addEvent(name, otelAttributes, fromMillis(timestamp));
      return this.capture('dom', metadata, 'info', null, timestamp, otelAttributes);
    }
  }, {
    key: "captureClick",
    value: function captureClick(_ref3) {
      var _this$telemetrySpan6;
      var type = _ref3.type,
        isSynthetic = _ref3.isSynthetic,
        element = _ref3.element,
        timestamp = _ref3.timestamp;
      var name = 'rollbar-click-event';
      var metadata = {
        type: name,
        subtype: type,
        element: element
      };
      var otelAttributes = {
        type: type,
        isSynthetic: isSynthetic,
        element: element,
        endTimeUnixNano: fromMillis(timestamp)
      };
      var event = this._getRepeatedEvent(name, otelAttributes);
      if (event) {
        return this._updateRepeatedEvent(event, otelAttributes, timestamp);
      }
      (_this$telemetrySpan6 = this.telemetrySpan) === null || _this$telemetrySpan6 === void 0 || _this$telemetrySpan6.addEvent(name, otelAttributes, fromMillis(timestamp));
      return this.capture('dom', metadata, 'info', null, timestamp, otelAttributes);
    }
  }, {
    key: "_getRepeatedEvent",
    value: function _getRepeatedEvent(name, attributes) {
      var lastEvent = this._lastEvent(this.queue);
      if (lastEvent && lastEvent.body.type === name && lastEvent.otelAttributes.target === attributes.target) {
        return lastEvent;
      }
    }
  }, {
    key: "_updateRepeatedEvent",
    value: function _updateRepeatedEvent(event, attributes, timestamp) {
      var duration = Math.max(timestamp - event.timestamp_ms, 1);
      event.body.value = attributes.value;
      event.otelAttributes.value = attributes.value;
      event.otelAttributes.height = attributes.height;
      event.otelAttributes.width = attributes.width;
      event.otelAttributes.textZoomRatio = attributes.textZoomRatio;
      event.otelAttributes['endTimeUnixNano'] = fromMillis(timestamp);
      event.otelAttributes['durationUnixNano'] = fromMillis(duration);
      event.otelAttributes.count = (event.otelAttributes.count || 1) + 1;
      event.otelAttributes.rate = event.otelAttributes.count / (duration / 1000);
    }
  }, {
    key: "_lastEvent",
    value: function _lastEvent(list) {
      return list.length > 0 ? list[list.length - 1] : null;
    }
  }, {
    key: "captureFocus",
    value: function captureFocus(_ref4) {
      var _this$telemetrySpan7;
      var type = _ref4.type,
        isSynthetic = _ref4.isSynthetic,
        element = _ref4.element,
        timestamp = _ref4.timestamp;
      var name = 'rollbar-focus-event';
      var metadata = {
        type: name,
        subtype: type,
        element: element
      };
      var otelAttributes = {
        type: type,
        isSynthetic: isSynthetic,
        element: element
      };
      (_this$telemetrySpan7 = this.telemetrySpan) === null || _this$telemetrySpan7 === void 0 || _this$telemetrySpan7.addEvent(name, otelAttributes, fromMillis(timestamp));
      return this.capture('dom', metadata, 'info', null, timestamp, otelAttributes);
    }
  }, {
    key: "captureResize",
    value: function captureResize(_ref5) {
      var _this$telemetrySpan8;
      var type = _ref5.type,
        isSynthetic = _ref5.isSynthetic,
        width = _ref5.width,
        height = _ref5.height,
        textZoomRatio = _ref5.textZoomRatio,
        timestamp = _ref5.timestamp;
      var name = 'rollbar-resize-event';
      var metadata = {
        type: name,
        subtype: type,
        width: width,
        height: height,
        textZoomRatio: textZoomRatio
      };
      var otelAttributes = {
        type: type,
        isSynthetic: isSynthetic,
        width: width,
        height: height,
        textZoomRatio: textZoomRatio
      };
      var event = this._getRepeatedEvent(name, otelAttributes);
      if (event) {
        return this._updateRepeatedEvent(event, otelAttributes, timestamp);
      }
      (_this$telemetrySpan8 = this.telemetrySpan) === null || _this$telemetrySpan8 === void 0 || _this$telemetrySpan8.addEvent(name, otelAttributes, fromMillis(timestamp));
      return this.capture('dom', metadata, 'info', null, timestamp, otelAttributes);
    }
  }, {
    key: "captureDragDrop",
    value: function captureDragDrop(_ref6) {
      var _this$telemetrySpan9;
      var type = _ref6.type,
        isSynthetic = _ref6.isSynthetic,
        element = _ref6.element,
        dropEffect = _ref6.dropEffect,
        effectAllowed = _ref6.effectAllowed,
        kinds = _ref6.kinds,
        mediaTypes = _ref6.mediaTypes,
        timestamp = _ref6.timestamp;
      var name = 'rollbar-dragdrop-event';
      var metadata = {
        type: name,
        subtype: type,
        isSynthetic: isSynthetic
      };
      var otelAttributes = {
        type: type,
        isSynthetic: isSynthetic
      };
      if (type === 'dragstart') {
        metadata = telemetry_objectSpread(telemetry_objectSpread({}, metadata), {}, {
          element: element,
          dropEffect: dropEffect,
          effectAllowed: effectAllowed
        });
        otelAttributes = telemetry_objectSpread(telemetry_objectSpread({}, otelAttributes), {}, {
          element: element,
          dropEffect: dropEffect,
          effectAllowed: effectAllowed
        });
      }
      if (type === 'drop') {
        metadata = telemetry_objectSpread(telemetry_objectSpread({}, metadata), {}, {
          element: element,
          dropEffect: dropEffect,
          effectAllowed: effectAllowed,
          kinds: kinds,
          mediaTypes: mediaTypes
        });
        otelAttributes = telemetry_objectSpread(telemetry_objectSpread({}, otelAttributes), {}, {
          element: element,
          dropEffect: dropEffect,
          effectAllowed: effectAllowed,
          kinds: kinds,
          mediaTypes: mediaTypes
        });
      }
      (_this$telemetrySpan9 = this.telemetrySpan) === null || _this$telemetrySpan9 === void 0 || _this$telemetrySpan9.addEvent(name, otelAttributes, fromMillis(timestamp));
      return this.capture('dom', metadata, 'info', null, timestamp, otelAttributes);
    }
  }, {
    key: "captureNavigation",
    value: function captureNavigation(from, to, rollbarUUID, timestamp) {
      var _this$telemetrySpan10;
      (_this$telemetrySpan10 = this.telemetrySpan) === null || _this$telemetrySpan10 === void 0 || _this$telemetrySpan10.addEvent('rollbar-navigation-event', {
        'previous.url.full': from,
        'url.full': to
      }, fromMillis(timestamp));
      return this.capture('navigation', {
        from: from,
        to: to
      }, 'info', rollbarUUID, timestamp);
    }
  }, {
    key: "captureDomContentLoaded",
    value: function captureDomContentLoaded(ts) {
      return this.capture('navigation', {
        subtype: 'DOMContentLoaded'
      }, 'info', undefined, ts && ts.getTime());
      /**
       * If we decide to make this a dom event instead, then use the line below:
      return this.capture('dom', {subtype: 'DOMContentLoaded'}, 'info', undefined, ts && ts.getTime());
      */
    }
  }, {
    key: "captureLoad",
    value: function captureLoad(ts) {
      return this.capture('navigation', {
        subtype: 'load'
      }, 'info', undefined, ts && ts.getTime());
      /**
       * If we decide to make this a dom event instead, then use the line below:
      return this.capture('dom', {subtype: 'load'}, 'info', undefined, ts && ts.getTime());
      */
    }
  }, {
    key: "captureConnectivityChange",
    value: function captureConnectivityChange(_ref7) {
      var _this$telemetrySpan11;
      var type = _ref7.type,
        isSynthetic = _ref7.isSynthetic,
        timestamp = _ref7.timestamp;
      var name = 'rollbar-connectivity-event';
      var metadata = {
        type: name,
        subtype: type
      };
      var otelAttributes = {
        type: type,
        isSynthetic: isSynthetic
      };
      (_this$telemetrySpan11 = this.telemetrySpan) === null || _this$telemetrySpan11 === void 0 || _this$telemetrySpan11.addEvent(name, otelAttributes, fromMillis(timestamp));
      return this.capture('connectivity', metadata, 'info', null, timestamp, otelAttributes);
    }

    // Only intended to be used internally by the notifier
  }, {
    key: "_captureRollbarItem",
    value: function _captureRollbarItem(item) {
      if (!this.options.includeItemsInTelemetry) {
        return;
      }
      if (item.err) {
        return this.captureError(item.err, item.level, item.uuid, item.timestamp);
      }
      if (item.message) {
        return this.captureLog(item.message, item.level, item.uuid, item.timestamp);
      }
      if (item.custom) {
        return this.capture('log', item.custom, item.level, item.uuid, item.timestamp);
      }
    }
  }, {
    key: "push",
    value: function push(e) {
      this.queue.push(e);
      if (this.queue.length > this.maxQueueSize) {
        this.queue.shift();
      }
    }
  }]);
}();
function getLevel(type, level) {
  if (level) {
    return level;
  }
  var defaultLevel = {
    error: 'error',
    manual: 'info'
  };
  return defaultLevel[type] || 'info';
}
/* harmony default export */ var telemetry = (Telemeter);
;// ./src/utility/headers.js
/*
 * headers - Detect when fetch Headers are undefined and use a partial polyfill.
 *
 * A full polyfill is not used in order to keep package size as small as possible.
 * Since this is only used internally and is not added to the window object,
 * the full interface doesn't need to be supported.
 *
 * This implementation is modified from whatwg-fetch:
 * https://github.com/github/fetch
 */
function headers(headers) {
  if (typeof Headers === 'undefined') {
    return new FetchHeaders(headers);
  }
  return new Headers(headers);
}
function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name);
  }
  return name.toLowerCase();
}
function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value);
  }
  return value;
}
function iteratorFor(items) {
  var iterator = {
    next: function next() {
      var value = items.shift();
      return {
        done: value === undefined,
        value: value
      };
    }
  };
  return iterator;
}
function FetchHeaders(headers) {
  this.map = {};
  if (headers instanceof FetchHeaders) {
    headers.forEach(function (value, name) {
      this.append(name, value);
    }, this);
  } else if (Array.isArray(headers)) {
    headers.forEach(function (header) {
      this.append(header[0], header[1]);
    }, this);
  } else if (headers) {
    Object.getOwnPropertyNames(headers).forEach(function (name) {
      this.append(name, headers[name]);
    }, this);
  }
}
FetchHeaders.prototype.append = function (name, value) {
  name = normalizeName(name);
  value = normalizeValue(value);
  var oldValue = this.map[name];
  this.map[name] = oldValue ? oldValue + ', ' + value : value;
};
FetchHeaders.prototype.get = function (name) {
  name = normalizeName(name);
  return this.has(name) ? this.map[name] : null;
};
FetchHeaders.prototype.has = function (name) {
  return this.map.hasOwnProperty(normalizeName(name));
};
FetchHeaders.prototype.forEach = function (callback, thisArg) {
  for (var name in this.map) {
    if (this.map.hasOwnProperty(name)) {
      callback.call(thisArg, this.map[name], name, this);
    }
  }
};
FetchHeaders.prototype.entries = function () {
  var items = [];
  this.forEach(function (value, name) {
    items.push([name, value]);
  });
  return iteratorFor(items);
};
/* harmony default export */ var utility_headers = (headers);
;// ./src/utility/replace.js
function replace(obj, name, replacement, replacements, type) {
  var orig = obj[name];
  obj[name] = replacement(orig);
  if (replacements) {
    replacements[type].push([obj, name, orig]);
  }
}
/* harmony default export */ var utility_replace = (replace);
;// ./src/utility/traverse.js

function traverse(obj, func, seen) {
  var k, v, i;
  var isObj = isType(obj, 'object');
  var isArray = isType(obj, 'array');
  var keys = [];
  var seenIndex;

  // Best might be to use Map here with `obj` as the keys, but we want to support IE < 11.
  seen = seen || {
    obj: [],
    mapped: []
  };
  if (isObj) {
    seenIndex = seen.obj.indexOf(obj);
    if (isObj && seenIndex !== -1) {
      // Prefer the mapped object if there is one.
      return seen.mapped[seenIndex] || seen.obj[seenIndex];
    }
    seen.obj.push(obj);
    seenIndex = seen.obj.length - 1;
  }
  if (isObj) {
    for (k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        keys.push(k);
      }
    }
  } else if (isArray) {
    for (i = 0; i < obj.length; ++i) {
      keys.push(i);
    }
  }
  var result = isObj ? {} : [];
  var same = true;
  for (i = 0; i < keys.length; ++i) {
    k = keys[i];
    v = obj[k];
    result[k] = func(k, v, seen);
    same = same && result[k] === obj[k];
  }
  if (isObj && !same) {
    seen.mapped[seenIndex] = result;
  }
  return !same ? result : obj;
}
/* harmony default export */ var utility_traverse = (traverse);
;// ./src/scrub.js


function scrub(data, scrubFields, scrubPaths) {
  scrubFields = scrubFields || [];
  if (scrubPaths) {
    for (var i = 0; i < scrubPaths.length; ++i) {
      scrubPath(data, scrubPaths[i]);
    }
  }
  var paramRes = _getScrubFieldRegexs(scrubFields);
  var queryRes = _getScrubQueryParamRegexs(scrubFields);
  function redactQueryParam(dummy0, paramPart) {
    return paramPart + redact();
  }
  function paramScrubber(v) {
    var i;
    if (isType(v, 'string')) {
      for (i = 0; i < queryRes.length; ++i) {
        v = v.replace(queryRes[i], redactQueryParam);
      }
    }
    return v;
  }
  function valScrubber(k, v) {
    var i;
    for (i = 0; i < paramRes.length; ++i) {
      if (paramRes[i].test(k)) {
        v = redact();
        break;
      }
    }
    return v;
  }
  function scrubber(k, v, seen) {
    var tmpV = valScrubber(k, v);
    if (tmpV === v) {
      if (isType(v, 'object') || isType(v, 'array')) {
        return utility_traverse(v, scrubber, seen);
      }
      return paramScrubber(tmpV);
    } else {
      return tmpV;
    }
  }
  return utility_traverse(data, scrubber);
}
function scrubPath(obj, path) {
  var keys = path.split('.');
  var last = keys.length - 1;
  try {
    for (var i = 0; i <= last; ++i) {
      if (i < last) {
        obj = obj[keys[i]];
      } else {
        obj[keys[i]] = redact();
      }
    }
  } catch (e) {
    // Missing key is OK;
  }
}
function _getScrubFieldRegexs(scrubFields) {
  var ret = [];
  var pat;
  for (var i = 0; i < scrubFields.length; ++i) {
    pat = '^\\[?(%5[bB])?' + scrubFields[i] + '\\[?(%5[bB])?\\]?(%5[dD])?$';
    ret.push(new RegExp(pat, 'i'));
  }
  return ret;
}
function _getScrubQueryParamRegexs(scrubFields) {
  var ret = [];
  var pat;
  for (var i = 0; i < scrubFields.length; ++i) {
    pat = '\\[?(%5[bB])?' + scrubFields[i] + '\\[?(%5[bB])?\\]?(%5[dD])?';
    ret.push(new RegExp('(' + pat + '=)([^&\\n]+)', 'igm'));
  }
  return ret;
}
/* harmony default export */ var src_scrub = (scrub);
;// ./src/browser/domUtility.js
function domUtility_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = domUtility_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function domUtility_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return domUtility_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? domUtility_arrayLikeToArray(r, a) : void 0; } }
function domUtility_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function getElementType(e) {
  return (e.getAttribute('type') || '').toLowerCase();
}
function isDescribedElement(element, type, subtypes) {
  if (element.tagName.toLowerCase() !== type.toLowerCase()) {
    return false;
  }
  if (!subtypes) {
    return true;
  }
  element = getElementType(element);
  for (var i = 0; i < subtypes.length; i++) {
    if (subtypes[i] === element) {
      return true;
    }
  }
  return false;
}
function getElementFromEvent(evt, doc) {
  if (evt.target) {
    return evt.target;
  }
  if (doc && doc.elementFromPoint) {
    return doc.elementFromPoint(evt.clientX, evt.clientY);
  }
  return undefined;
}
function treeToArray(elem) {
  var MAX_HEIGHT = 5;
  var out = [];
  var nextDescription;
  for (var height = 0; elem && height < MAX_HEIGHT; height++) {
    nextDescription = describeElement(elem);
    if (nextDescription.tagName === 'html') {
      break;
    }
    out.unshift(nextDescription);
    elem = elem.parentNode;
  }
  return out;
}
function elementArrayToString(a) {
  var MAX_LENGTH = 80;
  var separator = ' > ',
    separatorLength = separator.length;
  var out = [],
    len = 0,
    nextStr,
    totalLength;
  for (var i = a.length - 1; i >= 0; i--) {
    nextStr = descriptionToString(a[i]);
    totalLength = len + out.length * separatorLength + nextStr.length;
    if (i < a.length - 1 && totalLength >= MAX_LENGTH + 3) {
      out.unshift('...');
      break;
    }
    out.unshift(nextStr);
    len += nextStr.length;
  }
  return out.join(separator);
}
function domUtility_elementString(elem) {
  return elementArrayToString(treeToArray(elem));
}
function descriptionToString(desc) {
  if (!desc || !desc.tagName) {
    return '';
  }
  var out = [desc.tagName];
  if (desc.id) {
    out.push('#' + desc.id);
  }
  if (desc.classes) {
    out.push('.' + desc.classes.join('.'));
  }
  for (var i = 0; i < desc.attributes.length; i++) {
    out.push('[' + desc.attributes[i].key + '="' + desc.attributes[i].value + '"]');
  }
  return out.join('');
}

/**
 * Input: a dom element
 * Output: null if tagName is falsey or input is falsey, else
 *  {
 *    tagName: String,
 *    id: String | undefined,
 *    classes: [String] | undefined,
 *    attributes: [
 *      {
 *        key: OneOf(type, name, title, alt),
 *        value: String
 *      }
 *    ]
 *  }
 */
function describeElement(elem) {
  if (!elem || !elem.tagName) {
    return null;
  }
  var out = {},
    className,
    key,
    attr,
    i;
  out.tagName = elem.tagName.toLowerCase();
  if (elem.id) {
    out.id = elem.id;
  }
  className = elem.className;
  if (className && typeof className === 'string') {
    out.classes = className.split(/\s+/);
  }
  var attributes = ['type', 'name', 'title', 'alt'];
  out.attributes = [];
  for (i = 0; i < attributes.length; i++) {
    key = attributes[i];
    attr = elem.getAttribute(key);
    if (attr) {
      out.attributes.push({
        key: key,
        value: attr
      });
    }
  }
  return out;
}

/*
 * Detects if the given element matches any of the given class names (string or regex),
 * or CSS selectors.
 * @param {HTMLElement} element - The DOM element to check.
 * @param {Array<string|RegExp>} classes - An array of class names (string or regex) to match against.
 * @param {Array<string>} selectors - An array of CSS selectors to match against.
 * @return {boolean} - True if the element matches any of the classes or selectors, false otherwise.
 */
function isMatchingElement(element, classes, selectors) {
  try {
    var _iterator = domUtility_createForOfIteratorHelper(classes),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var cls = _step.value;
        if (typeof cls === 'string') {
          if (element.classList.contains(cls)) {
            return true;
          }
        } else {
          var _iterator3 = domUtility_createForOfIteratorHelper(element.classList),
            _step3;
          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var c = _step3.value;
              if (cls.test(c)) {
                return true;
              }
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var _iterator2 = domUtility_createForOfIteratorHelper(selectors),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var sel = _step2.value;
        if (element.matches(sel)) {
          return true;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  } catch (e) {
    // ignore errors from invalid arguments
  }
  return false;
}

;// ./src/browser/telemetry.js
function browser_telemetry_typeof(o) { "@babel/helpers - typeof"; return browser_telemetry_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, browser_telemetry_typeof(o); }
function telemetry_toConsumableArray(r) { return telemetry_arrayWithoutHoles(r) || telemetry_iterableToArray(r) || telemetry_unsupportedIterableToArray(r) || telemetry_nonIterableSpread(); }
function telemetry_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function telemetry_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function telemetry_arrayWithoutHoles(r) { if (Array.isArray(r)) return telemetry_arrayLikeToArray(r); }
function browser_telemetry_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function browser_telemetry_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, browser_telemetry_toPropertyKey(o.key), o); } }
function browser_telemetry_createClass(e, r, t) { return r && browser_telemetry_defineProperties(e.prototype, r), t && browser_telemetry_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function browser_telemetry_defineProperty(e, r, t) { return (r = browser_telemetry_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function browser_telemetry_toPropertyKey(t) { var i = browser_telemetry_toPrimitive(t, "string"); return "symbol" == browser_telemetry_typeof(i) ? i : i + ""; }
function browser_telemetry_toPrimitive(t, r) { if ("object" != browser_telemetry_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != browser_telemetry_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function telemetry_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = telemetry_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function telemetry_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return telemetry_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? telemetry_arrayLikeToArray(r, a) : void 0; } }
function telemetry_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }






var telemetry_defaults = {
  network: true,
  networkResponseHeaders: false,
  networkResponseBody: false,
  networkRequestHeaders: false,
  networkRequestBody: false,
  networkErrorOnHttp5xx: false,
  networkErrorOnHttp4xx: false,
  networkErrorOnHttp0: false,
  log: true,
  dom: true,
  navigation: true,
  connectivity: true,
  contentSecurityPolicy: true,
  errorOnContentSecurityPolicy: false
};
function restore(replacements, type) {
  var b;
  while (replacements[type].length) {
    b = replacements[type].shift();
    b[0][b[1]] = b[2];
  }
}
function nameFromDescription(description) {
  if (!description || !description.attributes) {
    return null;
  }
  var attrs = description.attributes;
  var _iterator = telemetry_createForOfIteratorHelper(attrs),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var a = _step.value;
      if (a.key === 'name') {
        return a.value;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return null;
}
function defaultValueScrubber(scrubFields) {
  var patterns = [];
  var _iterator2 = telemetry_createForOfIteratorHelper(scrubFields),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var field = _step2.value;
      patterns.push(new RegExp(field, 'i'));
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return function (description) {
    var name = nameFromDescription(description);
    if (!name) {
      return false;
    }
    for (var _i = 0, _patterns = patterns; _i < _patterns.length; _i++) {
      var p = _patterns[_i];
      if (p.test(name)) {
        return true;
      }
    }
    return false;
  };
}
var Instrumenter = /*#__PURE__*/function () {
  function Instrumenter(options, telemeter, rollbar, _window, _document) {
    browser_telemetry_classCallCheck(this, Instrumenter);
    browser_telemetry_defineProperty(this, "deinstrumentConnectivity", function () {
      this.removeListeners('connectivity');
    });
    this.options = options;
    var autoInstrument = options.autoInstrument;
    if (options.enabled === false || autoInstrument === false) {
      this.autoInstrument = {};
    } else {
      if (!isType(autoInstrument, 'object')) {
        autoInstrument = telemetry_defaults;
      }
      this.autoInstrument = src_merge(telemetry_defaults, autoInstrument);
    }
    this.configureScrubbing();
    this.telemeter = telemeter;
    this.rollbar = rollbar;
    this.diagnostic = rollbar.client.notifier.diagnostic;
    this._window = _window || {};
    this._document = _document || {};
    this.replacements = {
      network: [],
      log: [],
      navigation: [],
      connectivity: []
    };
    this.eventRemovers = {
      dom: [],
      connectivity: [],
      contentsecuritypolicy: []
    };
    this._location = this._window.location;
    this._lastHref = this._location && this._location.href;
  }
  return browser_telemetry_createClass(Instrumenter, [{
    key: "configureScrubbing",
    value: function configureScrubbing() {
      var _options$scrubTelemet, _options$replay, _options$replay2, _options$replay3, _options$replay4, _options$replay5, _options$replay6, _options$replay7, _options$replay8, _options$replay9;
      var options = this.options;
      this.scrubTelemetryInputs = !!((_options$scrubTelemet = options.scrubTelemetryInputs) !== null && _options$scrubTelemet !== void 0 ? _options$scrubTelemet : (_options$replay = options.replay) === null || _options$replay === void 0 ? void 0 : _options$replay.maskAllInputs);
      this.telemetryScrubber = options.telemetryScrubber;
      this.defaultValueScrubber = defaultValueScrubber(options.scrubFields);
      this.maskInputFn = (_options$replay2 = options.replay) === null || _options$replay2 === void 0 ? void 0 : _options$replay2.maskInputFn;
      this.maskInputOptions = ((_options$replay3 = options.replay) === null || _options$replay3 === void 0 ? void 0 : _options$replay3.maskInputOptions) || {};
      this.scrubClasses = [(_options$replay4 = options.replay) === null || _options$replay4 === void 0 ? void 0 : _options$replay4.blockClass, (_options$replay5 = options.replay) === null || _options$replay5 === void 0 ? void 0 : _options$replay5.ignoreClass, (_options$replay6 = options.replay) === null || _options$replay6 === void 0 ? void 0 : _options$replay6.maskTextClass].filter(Boolean);
      this.scrubSelectors = [(_options$replay7 = options.replay) === null || _options$replay7 === void 0 ? void 0 : _options$replay7.blockSelector, (_options$replay8 = options.replay) === null || _options$replay8 === void 0 ? void 0 : _options$replay8.ignoreSelector, (_options$replay9 = options.replay) === null || _options$replay9 === void 0 ? void 0 : _options$replay9.maskTextSelector].filter(Boolean);
    }
  }, {
    key: "configure",
    value: function configure(options) {
      this.options = src_merge(this.options, options);
      var autoInstrument = options.autoInstrument;
      var oldSettings = src_merge(this.autoInstrument);
      if (options.enabled === false || autoInstrument === false) {
        this.autoInstrument = {};
      } else {
        if (!isType(autoInstrument, 'object')) {
          autoInstrument = telemetry_defaults;
        }
        this.autoInstrument = src_merge(telemetry_defaults, autoInstrument);
      }
      this.configureScrubbing();
      this.instrument(oldSettings);
    }

    // eslint-disable-next-line complexity
  }, {
    key: "instrument",
    value: function instrument(oldSettings) {
      if (this.autoInstrument.network && !(oldSettings && oldSettings.network)) {
        this.instrumentNetwork();
      } else if (!this.autoInstrument.network && oldSettings && oldSettings.network) {
        this.deinstrumentNetwork();
      }
      if (this.autoInstrument.log && !(oldSettings && oldSettings.log)) {
        this.instrumentConsole();
      } else if (!this.autoInstrument.log && oldSettings && oldSettings.log) {
        this.deinstrumentConsole();
      }
      if (this.autoInstrument.dom && !(oldSettings && oldSettings.dom)) {
        this.instrumentDom();
      } else if (!this.autoInstrument.dom && oldSettings && oldSettings.dom) {
        this.deinstrumentDom();
      }
      if (this.autoInstrument.navigation && !(oldSettings && oldSettings.navigation)) {
        this.instrumentNavigation();
      } else if (!this.autoInstrument.navigation && oldSettings && oldSettings.navigation) {
        this.deinstrumentNavigation();
      }
      if (this.autoInstrument.connectivity && !(oldSettings && oldSettings.connectivity)) {
        this.instrumentConnectivity();
      } else if (!this.autoInstrument.connectivity && oldSettings && oldSettings.connectivity) {
        this.deinstrumentConnectivity();
      }
      if (this.autoInstrument.contentSecurityPolicy && !(oldSettings && oldSettings.contentSecurityPolicy)) {
        this.instrumentContentSecurityPolicy();
      } else if (!this.autoInstrument.contentSecurityPolicy && oldSettings && oldSettings.contentSecurityPolicy) {
        this.deinstrumentContentSecurityPolicy();
      }
    }
  }, {
    key: "deinstrumentNetwork",
    value: function deinstrumentNetwork() {
      restore(this.replacements, 'network');
    }
  }, {
    key: "instrumentNetwork",
    value: function instrumentNetwork() {
      var self = this;
      function wrapProp(prop, xhr) {
        if (prop in xhr && isFunction(xhr[prop])) {
          utility_replace(xhr, prop, function (orig) {
            return self.rollbar.wrap(orig);
          });
        }
      }
      if ('XMLHttpRequest' in this._window) {
        var xhrp = this._window.XMLHttpRequest.prototype;
        utility_replace(xhrp, 'open', function (orig) {
          return function (method, url) {
            var isUrlObject = _isUrlObject(url);
            if (isType(url, 'string') || isUrlObject) {
              url = isUrlObject ? url.toString() : url;
              if (this.__rollbar_xhr) {
                this.__rollbar_xhr.method = method;
                this.__rollbar_xhr.url = url;
                this.__rollbar_xhr.status_code = null;
                this.__rollbar_xhr.start_time_ms = utility_now();
                this.__rollbar_xhr.end_time_ms = null;
              } else {
                this.__rollbar_xhr = {
                  method: method,
                  url: url,
                  status_code: null,
                  start_time_ms: utility_now(),
                  end_time_ms: null
                };
              }
            }
            return orig.apply(this, arguments);
          };
        }, this.replacements, 'network');
        utility_replace(xhrp, 'setRequestHeader', function (orig) {
          return function (header, value) {
            // If xhr.open is async, __rollbar_xhr may not be initialized yet.
            if (!this.__rollbar_xhr) {
              this.__rollbar_xhr = {};
            }
            if (isType(header, 'string') && isType(value, 'string')) {
              if (self.autoInstrument.networkRequestHeaders) {
                if (!this.__rollbar_xhr.request_headers) {
                  this.__rollbar_xhr.request_headers = {};
                }
                this.__rollbar_xhr.request_headers[header] = value;
              }
              // We want the content type even if request header telemetry is off.
              if (header.toLowerCase() === 'content-type') {
                this.__rollbar_xhr.request_content_type = value;
              }
            }
            return orig.apply(this, arguments);
          };
        }, this.replacements, 'network');
        utility_replace(xhrp, 'send', function (orig) {
          return function (data) {
            var xhr = this;
            function onreadystatechangeHandler() {
              if (xhr.__rollbar_xhr) {
                if (xhr.__rollbar_xhr.status_code === null) {
                  xhr.__rollbar_xhr.status_code = 0;
                  if (self.autoInstrument.networkRequestBody) {
                    xhr.__rollbar_xhr.request = data;
                  }
                  xhr.__rollbar_event = self.captureNetwork(xhr.__rollbar_xhr, 'xhr', undefined);
                }
                if (xhr.readyState < 2) {
                  xhr.__rollbar_xhr.start_time_ms = utility_now();
                }
                if (xhr.readyState > 3) {
                  var end_time_ms = utility_now();
                  xhr.__rollbar_xhr.end_time_ms = end_time_ms;
                  var _headers = null;
                  xhr.__rollbar_xhr.response_content_type = xhr.getResponseHeader('Content-Type');
                  if (self.autoInstrument.networkResponseHeaders) {
                    var headersConfig = self.autoInstrument.networkResponseHeaders;
                    _headers = {};
                    try {
                      var header;
                      if (headersConfig === true) {
                        var allHeaders = xhr.getAllResponseHeaders();
                        if (allHeaders) {
                          var arr = allHeaders.trim().split(/[\r\n]+/);
                          var parts, value;
                          var _iterator3 = telemetry_createForOfIteratorHelper(arr),
                            _step3;
                          try {
                            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                              var h = _step3.value;
                              parts = h.split(': ');
                              header = parts.shift();
                              value = parts.join(': ');
                              _headers[header] = value;
                            }
                          } catch (err) {
                            _iterator3.e(err);
                          } finally {
                            _iterator3.f();
                          }
                        }
                      } else {
                        var _iterator4 = telemetry_createForOfIteratorHelper(headersConfig),
                          _step4;
                        try {
                          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                            var _h = _step4.value;
                            _headers[_h] = xhr.getResponseHeader(_h);
                          }
                        } catch (err) {
                          _iterator4.e(err);
                        } finally {
                          _iterator4.f();
                        }
                      }
                    } catch (e) {
                      /* we ignore the errors here that could come from different
                       * browser issues with the xhr methods */
                    }
                  }
                  var body = null;
                  if (self.autoInstrument.networkResponseBody) {
                    try {
                      body = xhr.responseText;
                    } catch (e) {
                      /* ignore errors from reading responseText */
                    }
                  }
                  var response = null;
                  if (body || _headers) {
                    response = {};
                    if (body) {
                      if (self.isJsonContentType(xhr.__rollbar_xhr.response_content_type)) {
                        response.body = self.scrubJson(body);
                      } else {
                        response.body = body;
                      }
                    }
                    if (_headers) {
                      response.headers = _headers;
                    }
                  }
                  if (response) {
                    xhr.__rollbar_xhr.response = response;
                  }
                  try {
                    var code = xhr.status;
                    code = code === 1223 ? 204 : code;
                    xhr.__rollbar_xhr.status_code = code;
                    self.addOtelNetworkResponse(xhr.__rollbar_event, end_time_ms, code);
                    xhr.__rollbar_event.level = self.telemeter.levelFromStatus(code);
                    self.errorOnHttpStatus(xhr.__rollbar_xhr);
                  } catch (e) {
                    /* ignore possible exception from xhr.status */
                  }
                }
              }
            }
            wrapProp('onload', xhr);
            wrapProp('onerror', xhr);
            wrapProp('onprogress', xhr);
            if ('onreadystatechange' in xhr && isFunction(xhr.onreadystatechange)) {
              utility_replace(xhr, 'onreadystatechange', function (orig) {
                return self.rollbar.wrap(orig, undefined, onreadystatechangeHandler);
              });
            } else {
              xhr.onreadystatechange = onreadystatechangeHandler;
            }
            if (xhr.__rollbar_xhr && self.trackHttpErrors()) {
              xhr.__rollbar_xhr.stack = new Error().stack;
            }
            return orig.apply(this, arguments);
          };
        }, this.replacements, 'network');
      }
      if ('fetch' in this._window) {
        utility_replace(this._window, 'fetch', function (orig) {
          return function (fn, t) {
            var args = Array.prototype.slice.call(arguments);
            var input = args[0];
            var method = 'GET';
            var url;
            var isUrlObject = _isUrlObject(input);
            if (isType(input, 'string') || isUrlObject) {
              url = isUrlObject ? input.toString() : input;
            } else if (input) {
              url = input.url;
              if (input.method) {
                method = input.method;
              }
            }
            if (args[1] && args[1].method) {
              method = args[1].method;
            }
            var metadata = {
              method: method,
              url: url,
              status_code: null,
              start_time_ms: utility_now(),
              end_time_ms: null
            };
            if (args[1] && args[1].headers) {
              // Argument may be a Headers object, or plain object. Ensure here that
              // we are working with a Headers object with case-insensitive keys.
              var reqHeaders = utility_headers(args[1].headers);
              metadata.request_content_type = reqHeaders.get('Content-Type');
              if (self.autoInstrument.networkRequestHeaders) {
                metadata.request_headers = self.fetchHeaders(reqHeaders, self.autoInstrument.networkRequestHeaders);
              }
            }
            if (self.autoInstrument.networkRequestBody) {
              if (args[1] && args[1].body) {
                metadata.request = args[1].body;
              } else if (args[0] && !isType(args[0], 'string') && args[0].body) {
                metadata.request = args[0].body;
              }
            }
            var telemetryEvent = self.captureNetwork(metadata, 'fetch', undefined);
            if (self.trackHttpErrors()) {
              metadata.stack = new Error().stack;
            }

            // Start our handler before returning the promise. This allows resp.clone()
            // to execute before other handlers touch the response.
            return orig.apply(this, args).then(function (resp) {
              var end_time_ms = utility_now();
              metadata.end_time_ms = end_time_ms;
              metadata.status_code = resp.status;
              self.addOtelNetworkResponse(telemetryEvent, end_time_ms, resp.status);
              metadata.response_content_type = resp.headers.get('Content-Type');
              var headers = null;
              if (self.autoInstrument.networkResponseHeaders) {
                headers = self.fetchHeaders(resp.headers, self.autoInstrument.networkResponseHeaders);
              }
              var body = null;
              if (self.autoInstrument.networkResponseBody) {
                if (typeof resp.text === 'function') {
                  // Response.text() is not implemented on some platforms
                  // The response must be cloned to prevent reading (and locking) the original stream.
                  // This must be done before other handlers touch the response.
                  body = resp.clone().text(); //returns a Promise
                }
              }
              if (headers || body) {
                metadata.response = {};
                if (body) {
                  // Test to ensure body is a Promise, which it should always be.
                  if (typeof body.then === 'function') {
                    body.then(function (text) {
                      if (text && self.isJsonContentType(metadata.response_content_type)) {
                        metadata.response.body = self.scrubJson(text);
                      } else {
                        metadata.response.body = text;
                      }
                    });
                  } else {
                    metadata.response.body = body;
                  }
                }
                if (headers) {
                  metadata.response.headers = headers;
                }
              }
              self.errorOnHttpStatus(metadata);
              return resp;
            });
          };
        }, this.replacements, 'network');
      }
    }
  }, {
    key: "captureNetwork",
    value: function captureNetwork(metadata, subtype, rollbarUUID) {
      if (metadata.request && this.isJsonContentType(metadata.request_content_type)) {
        metadata.request = this.scrubJson(metadata.request);
      }
      return this.telemeter.captureNetwork(metadata, subtype, rollbarUUID);
    }
  }, {
    key: "isJsonContentType",
    value: function isJsonContentType(contentType) {
      return contentType && isType(contentType, 'string') && contentType.toLowerCase().includes('json') ? true : false;
    }
  }, {
    key: "addOtelNetworkResponse",
    value: function addOtelNetworkResponse(event, endTimeMs, statusCode) {
      if (event.otelAttributes) {
        event.otelAttributes['response.timeUnixNano'] = (endTimeMs * 1e6).toString();
        event.otelAttributes.statusCode = statusCode;
      }
    }
  }, {
    key: "scrubJson",
    value: function scrubJson(json) {
      return JSON.stringify(src_scrub(JSON.parse(json), this.options.scrubFields));
    }
  }, {
    key: "fetchHeaders",
    value: function fetchHeaders(inHeaders, headersConfig) {
      var outHeaders = {};
      try {
        if (headersConfig === true) {
          if (typeof inHeaders.entries === 'function') {
            // Headers.entries() is not implemented in IE
            var allHeaders = inHeaders.entries();
            var currentHeader = allHeaders.next();
            while (!currentHeader.done) {
              outHeaders[currentHeader.value[0]] = currentHeader.value[1];
              currentHeader = allHeaders.next();
            }
          }
        } else {
          var _iterator5 = telemetry_createForOfIteratorHelper(headersConfig),
            _step5;
          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var h = _step5.value;
              outHeaders[h] = inHeaders.get(h);
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
        }
      } catch (e) {
        /* ignore probable IE errors */
      }
      return outHeaders;
    }
  }, {
    key: "trackHttpErrors",
    value: function trackHttpErrors() {
      return this.autoInstrument.networkErrorOnHttp5xx || this.autoInstrument.networkErrorOnHttp4xx || this.autoInstrument.networkErrorOnHttp0;
    }
  }, {
    key: "errorOnHttpStatus",
    value: function errorOnHttpStatus(metadata) {
      var status = metadata.status_code;
      if (status >= 500 && this.autoInstrument.networkErrorOnHttp5xx || status >= 400 && this.autoInstrument.networkErrorOnHttp4xx || status === 0 && this.autoInstrument.networkErrorOnHttp0) {
        var error = new Error('HTTP request failed with Status ' + status);
        error.stack = metadata.stack;
        this.rollbar.error(error, {
          skipFrames: 1
        });
      }
    }
  }, {
    key: "deinstrumentConsole",
    value: function deinstrumentConsole() {
      var b;
      while (this.replacements['log'].length) {
        b = this.replacements['log'].shift();
        this._window.console[b[0]] = b[1];
      }
    }
  }, {
    key: "instrumentConsole",
    value: function instrumentConsole() {
      var _this$_window;
      if (!((_this$_window = this._window) !== null && _this$_window !== void 0 && (_this$_window = _this$_window.console) !== null && _this$_window !== void 0 && _this$_window.log)) {
        return;
      }
      var self = this;
      var c = this._window.console;
      function wrapConsole(method) {
        'use strict';

        // See https://github.com/rollbar/rollbar.js/pull/778
        var orig = c[method];
        var origConsole = c;
        var level = method === 'warn' ? 'warning' : method;
        c[method] = function () {
          var args = Array.prototype.slice.call(arguments);
          var message = formatArgsAsString(args);
          self.telemeter.captureLog(message, level, null, utility_now());
          if (orig) {
            Function.prototype.apply.call(orig, origConsole, args);
          }
        };
        self.replacements['log'].push([method, orig]);
      }
      var methods = ['debug', 'info', 'warn', 'error', 'log'];
      try {
        for (var _i2 = 0, _methods = methods; _i2 < _methods.length; _i2++) {
          var m = _methods[_i2];
          wrapConsole(m);
        }
      } catch (e) {
        this.diagnostic.instrumentConsole = {
          error: e.message
        };
      }
    }
  }, {
    key: "deinstrumentDom",
    value: function deinstrumentDom() {
      this.removeListeners('dom');
    }
  }, {
    key: "instrumentDom",
    value: function instrumentDom() {
      var _this = this;
      var self = this;
      this.addListener('dom', this._window, ['click', 'dblclick', 'contextmenu'], function (e) {
        return _this.handleEvent('click', e);
      });
      this.addListener('dom', this._window, ['dragstart', 'dragend', 'dragenter', 'dragleave', 'drop'], function (e) {
        return _this.handleEvent('dragdrop', e);
      });
      this.addListener('dom', this._window, ['blur', 'focus'], function (e) {
        return _this.handleEvent('focus', e);
      });
      this.addListener('dom', this._window, ['submit', 'invalid'], function (e) {
        return _this.handleEvent('form', e);
      });
      this.addListener('dom', this._window, ['input', 'change'], function (e) {
        return _this.handleEvent('input', e);
      });
      this.addListener('dom', this._window, ['resize'], function (e) {
        return _this.handleEvent('resize', e);
      });
      this.addListener('dom', this._document, ['DOMContentLoaded'], function (e) {
        return _this.handleEvent('contentLoaded', e);
      });
    }
  }, {
    key: "handleEvent",
    value: function handleEvent(name, evt) {
      try {
        return {
          click: this.handleClick,
          dragdrop: this.handleDrag,
          focus: this.handleFocus,
          form: this.handleForm,
          input: this.handleInput,
          resize: this.handleResize,
          contentLoaded: this.handleContentLoaded
        }[name].call(this, evt);
      } catch (exc) {
        console.log("".concat(name, " handler error"), evt, exc, exc.stack);
      }
    }
  }, {
    key: "handleContentLoaded",
    value: function handleContentLoaded(evt) {
      var replayId = this.rollbar.triggerReplay({
        type: 'navigation',
        path: new URL(this._location.href).pathname
      });
    }
  }, {
    key: "handleClick",
    value: function handleClick(evt) {
      var _evt$target;
      var tagName = (_evt$target = evt.target) === null || _evt$target === void 0 ? void 0 : _evt$target.tagName.toLowerCase();
      if (['input', 'select', 'textarea'].includes(tagName)) return;
      this.telemeter.captureClick({
        type: evt.type,
        isSynthetic: !evt.isTrusted,
        element: domUtility_elementString(evt.target),
        timestamp: utility_now()
      });
    }
  }, {
    key: "handleFocus",
    value: function handleFocus(evt) {
      var _evt$target2;
      var type = evt.type;
      var element = (_evt$target2 = evt.target) !== null && _evt$target2 !== void 0 && _evt$target2.window ? 'window' : domUtility_elementString(evt.target);
      this.telemeter.captureFocus({
        type: type,
        isSynthetic: !evt.isTrusted,
        element: element,
        timestamp: utility_now()
      });
    }
  }, {
    key: "handleForm",
    value: function handleForm(evt) {
      var _evt$target3;
      // TODO: implement form event handling
      var type = evt.type;
      var elementString = (_evt$target3 = evt.target) !== null && _evt$target3 !== void 0 && _evt$target3.window ? 'window' : domUtility_elementString(evt.target);
      console.log('handleForm', type, elementString, evt);
    }
  }, {
    key: "handleResize",
    value: function handleResize(evt) {
      var textZoomRatio = window.screen.width / window.innerWidth;
      this.telemeter.captureResize({
        type: evt.type,
        isSynthetic: !evt.isTrusted,
        width: window.innerWidth,
        height: window.innerHeight,
        textZoomRatio: textZoomRatio,
        timestamp: utility_now()
      });
    }
  }, {
    key: "handleDrag",
    value: function handleDrag(evt) {
      var type = evt.type;
      var kinds, mediaTypes, dropEffect, effectAllowed;
      if (type === 'drop') {
        kinds = [];
        mediaTypes = [];
        var objs = [].concat(telemetry_toConsumableArray(evt.dataTransfer.files), telemetry_toConsumableArray(evt.dataTransfer.items));
        var _iterator6 = telemetry_createForOfIteratorHelper(objs),
          _step6;
        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var o = _step6.value;
            if (o.kind && o.type) {
              kinds.push(o.kind);
              mediaTypes.push(o.type);
            }
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }
      }
      if (['drop', 'dragstart'].includes(type)) {
        var _evt$dataTransfer, _evt$dataTransfer2;
        dropEffect = (_evt$dataTransfer = evt.dataTransfer) === null || _evt$dataTransfer === void 0 ? void 0 : _evt$dataTransfer.dropEffect;
        effectAllowed = (_evt$dataTransfer2 = evt.dataTransfer) === null || _evt$dataTransfer2 === void 0 ? void 0 : _evt$dataTransfer2.effectAllowed;
      }
      this.telemeter.captureDragDrop({
        type: type,
        isSynthetic: !evt.isTrusted,
        element: domUtility_elementString(evt.target),
        dropEffect: dropEffect,
        effectAllowed: effectAllowed,
        kinds: JSON.stringify(kinds),
        mediaTypes: JSON.stringify(mediaTypes),
        timestamp: utility_now()
      });
    }

    /*
     * Applies Rollbar telemetry scrubbing options to the dom input value.
     * When replay options are present, applies those as well.
     */
  }, {
    key: "scrubInputValue",
    value: function scrubInputValue(value, element, tagName, inputType) {
      var mask = '******';
      if (inputType === 'password') {
        return mask;
      }
      if (this.scrubTelemetryInputs) {
        return mask;
      } else {
        var description = describeElement(element);
        if (this.telemetryScrubber) {
          if (this.telemetryScrubber(description)) {
            return mask;
          }
        } else if (this.defaultValueScrubber(description)) {
          return mask;
        }
      }

      // Apply replay options regardless of other scrubbing
      if (isMatchingElement(element, this.scrubClasses, this.scrubSelectors)) {
        return mask;
      }

      // This check is last since maskInputFn returns a modified value rather
      // than a boolean, which would cause an early return even if the value
      // was not scrubbed.
      if (this.maskInputOptions[tagName.toLowerCase()] || this.maskInputOptions[inputType]) {
        if (this.maskInputFn) {
          return this.maskInputFn(value, element);
        } else {
          return mask;
        }
      }
      return value;
    }

    /*
     * Uses the `input` event for everything except radio and checkbox inputs.
     * For those, it uses the `change` event.
     */
  }, {
    key: "handleInput",
    value: function handleInput(evt) {
      var _evt$target4, _evt$target5, _evt$target6, _evt$target7;
      var type = evt.type;
      var tagName = (_evt$target4 = evt.target) === null || _evt$target4 === void 0 ? void 0 : _evt$target4.tagName.toLowerCase();
      var value = (_evt$target5 = evt.target) === null || _evt$target5 === void 0 ? void 0 : _evt$target5.value;
      var inputType = ((_evt$target6 = evt.target) === null || _evt$target6 === void 0 || (_evt$target6 = _evt$target6.attributes) === null || _evt$target6 === void 0 || (_evt$target6 = _evt$target6.type) === null || _evt$target6 === void 0 ? void 0 : _evt$target6.value) || ((_evt$target7 = evt.target) === null || _evt$target7 === void 0 ? void 0 : _evt$target7.type);
      if (value !== undefined) {
        value = this.scrubInputValue(value, evt.target, tagName, inputType);
      }
      switch (type) {
        case 'input':
          if (['radio', 'checkbox'].includes(inputType)) return;
          if (['select', 'textarea'].includes(tagName)) {
            inputType = tagName;
          }
          break;
        case 'change':
          if (!['radio', 'checkbox'].includes(inputType)) return;
          if (inputType === 'checkbox') {
            var _evt$target8;
            value = (_evt$target8 = evt.target) === null || _evt$target8 === void 0 ? void 0 : _evt$target8.checked;
          }
          break;
      }
      this.telemeter.captureInput({
        type: inputType,
        isSynthetic: !evt.isTrusted,
        element: domUtility_elementString(evt.target),
        value: value,
        timestamp: utility_now()
      });
    }
  }, {
    key: "deinstrumentNavigation",
    value: function deinstrumentNavigation() {
      var chrome = this._window.chrome;
      var chromePackagedApp = chrome && chrome.app && chrome.app.runtime;
      // See https://github.com/angular/angular.js/pull/13945/files
      var hasPushState = !chromePackagedApp && this._window.history && this._window.history.pushState;
      if (!hasPushState) {
        return;
      }
      restore(this.replacements, 'navigation');
    }
  }, {
    key: "instrumentNavigation",
    value: function instrumentNavigation() {
      var chrome = this._window.chrome;
      var chromePackagedApp = chrome && chrome.app && chrome.app.runtime;
      // See https://github.com/angular/angular.js/pull/13945/files
      var hasPushState = !chromePackagedApp && this._window.history && this._window.history.pushState;
      if (!hasPushState) {
        return;
      }
      var self = this;
      utility_replace(this._window, 'onpopstate', function (orig) {
        return function () {
          var current = self._location.href;
          self.handleUrlChange(self._lastHref, current);
          if (orig) {
            orig.apply(this, arguments);
          }
        };
      }, this.replacements, 'navigation');
      utility_replace(this._window.history, 'pushState', function (orig) {
        return function () {
          var url = arguments.length > 2 ? arguments[2] : undefined;
          if (url) {
            self.handleUrlChange(self._lastHref, url + '');
          }
          return orig.apply(this, arguments);
        };
      }, this.replacements, 'navigation');
    }
  }, {
    key: "handleUrlChange",
    value: function handleUrlChange(from, to) {
      var parsedHref = parse(this._location.href);
      var parsedTo = parse(to);
      var parsedFrom = parse(from);
      this._lastHref = to;
      if (parsedHref.protocol === parsedTo.protocol && parsedHref.host === parsedTo.host) {
        to = parsedTo.path + (parsedTo.hash || '');
      }
      if (parsedHref.protocol === parsedFrom.protocol && parsedHref.host === parsedFrom.host) {
        from = parsedFrom.path + (parsedFrom.hash || '');
      }
      this.telemeter.captureNavigation(from, to, null, utility_now());
      var replayId = this.rollbar.triggerReplay({
        type: 'navigation',
        path: to
      });
    }
  }, {
    key: "instrumentConnectivity",
    value: function instrumentConnectivity() {
      var self = this;
      this.addListener('connectivity', this._window, ['online', 'offline'], function (evt) {
        return self.handleConnectivity(evt);
      });
    }
  }, {
    key: "handleConnectivity",
    value: function handleConnectivity(evt) {
      var type = evt.type;
      this.telemeter.captureConnectivityChange({
        type: type,
        isSynthetic: !evt.isTrusted,
        timestamp: utility_now()
      });
    }
  }, {
    key: "handleCspEvent",
    value: function handleCspEvent(cspEvent) {
      var message = 'Security Policy Violation: ' + 'blockedURI: ' + cspEvent.blockedURI + ', ' + 'violatedDirective: ' + cspEvent.violatedDirective + ', ' + 'effectiveDirective: ' + cspEvent.effectiveDirective + ', ';
      if (cspEvent.sourceFile) {
        message += 'location: ' + cspEvent.sourceFile + ', ' + 'line: ' + cspEvent.lineNumber + ', ' + 'col: ' + cspEvent.columnNumber + ', ';
      }
      message += 'originalPolicy: ' + cspEvent.originalPolicy;
      this.telemeter.captureLog(message, 'error', null, utility_now());
      this.handleCspError(message);
    }
  }, {
    key: "handleCspError",
    value: function handleCspError(message) {
      if (this.autoInstrument.errorOnContentSecurityPolicy) {
        this.rollbar.error(message);
      }
    }
  }, {
    key: "deinstrumentContentSecurityPolicy",
    value: function deinstrumentContentSecurityPolicy() {
      this.removeListeners('contentsecuritypolicy');
    }
  }, {
    key: "instrumentContentSecurityPolicy",
    value: function instrumentContentSecurityPolicy() {
      if (!('addEventListener' in this._document)) {
        return;
      }
      var cspHandler = this.handleCspEvent.bind(this);
      this.addListener('contentsecuritypolicy', this._document, ['securitypolicyviolation'], cspHandler);
    }
  }, {
    key: "addListener",
    value: function addListener(section, obj, types, handler) {
      var _this2 = this;
      if (obj.addEventListener) {
        var _iterator7 = telemetry_createForOfIteratorHelper(types),
          _step7;
        try {
          var _loop = function _loop() {
            var t = _step7.value;
            var options = {
              capture: true,
              passive: true
            };
            obj.addEventListener(t, handler, options, true);
            _this2.eventRemovers[section].push(function () {
              obj.removeEventListener(t, handler, options);
            });
          };
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            _loop();
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }
      }
    }
  }, {
    key: "removeListeners",
    value: function removeListeners(section) {
      var r;
      while (this.eventRemovers[section].length) {
        r = this.eventRemovers[section].shift();
        r();
      }
    }
  }]);
}();
function _isUrlObject(input) {
  return typeof URL !== 'undefined' && input instanceof URL;
}
/* harmony default export */ var browser_telemetry = (Instrumenter);
;// ./src/browser/wrapGlobals.js
function wrapGlobals(window, handler, shim) {
  if (!window) {
    return;
  }
  // Adapted from https://github.com/bugsnag/bugsnag-js
  var globals = 'EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload'.split(',');
  var i, global;
  for (i = 0; i < globals.length; ++i) {
    global = globals[i];
    if (window[global] && window[global].prototype) {
      _extendListenerPrototype(handler, window[global].prototype, shim);
    }
  }
}
function _extendListenerPrototype(handler, prototype, shim) {
  if (prototype.hasOwnProperty && prototype.hasOwnProperty('addEventListener')) {
    var oldAddEventListener = prototype.addEventListener;
    while (oldAddEventListener._rollbarOldAdd && oldAddEventListener.belongsToShim) {
      oldAddEventListener = oldAddEventListener._rollbarOldAdd;
    }
    var addFn = function addFn(event, callback, bubble) {
      oldAddEventListener.call(this, event, handler.wrap(callback), bubble);
    };
    addFn._rollbarOldAdd = oldAddEventListener;
    addFn.belongsToShim = shim;
    prototype.addEventListener = addFn;
    var oldRemoveEventListener = prototype.removeEventListener;
    while (oldRemoveEventListener._rollbarOldRemove && oldRemoveEventListener.belongsToShim) {
      oldRemoveEventListener = oldRemoveEventListener._rollbarOldRemove;
    }
    var removeFn = function removeFn(event, callback, bubble) {
      oldRemoveEventListener.call(this, event, callback && callback._rollbar_wrapped || callback, bubble);
    };
    removeFn._rollbarOldRemove = oldRemoveEventListener;
    removeFn.belongsToShim = shim;
    prototype.removeEventListener = removeFn;
  }
}
/* harmony default export */ var browser_wrapGlobals = (wrapGlobals);
;// ./src/truncation.js


function raw(payload, jsonBackup) {
  return [payload, stringify(payload, jsonBackup)];
}
function selectFrames(frames, range) {
  var len = frames.length;
  if (len > range * 2) {
    return frames.slice(0, range).concat(frames.slice(len - range));
  }
  return frames;
}
function truncateFrames(payload, jsonBackup, range) {
  range = typeof range === 'undefined' ? 30 : range;
  var body = payload.data.body;
  var frames;
  if (body.trace_chain) {
    var chain = body.trace_chain;
    for (var i = 0; i < chain.length; i++) {
      frames = chain[i].frames;
      frames = selectFrames(frames, range);
      chain[i].frames = frames;
    }
  } else if (body.trace) {
    frames = body.trace.frames;
    frames = selectFrames(frames, range);
    body.trace.frames = frames;
  }
  return [payload, stringify(payload, jsonBackup)];
}
function maybeTruncateValue(len, val) {
  if (!val) {
    return val;
  }
  if (val.length > len) {
    return val.slice(0, len - 3).concat('...');
  }
  return val;
}
function truncateStrings(len, payload, jsonBackup) {
  function truncator(k, v, seen) {
    switch (typeName(v)) {
      case 'string':
        return maybeTruncateValue(len, v);
      case 'object':
      case 'array':
        return utility_traverse(v, truncator, seen);
      default:
        return v;
    }
  }
  payload = utility_traverse(payload, truncator);
  return [payload, stringify(payload, jsonBackup)];
}
function truncateTraceData(traceData) {
  if (traceData.exception) {
    delete traceData.exception.description;
    traceData.exception.message = maybeTruncateValue(255, traceData.exception.message);
  }
  traceData.frames = selectFrames(traceData.frames, 1);
  return traceData;
}
function minBody(payload, jsonBackup) {
  var body = payload.data.body;
  if (body.trace_chain) {
    var chain = body.trace_chain;
    for (var i = 0; i < chain.length; i++) {
      chain[i] = truncateTraceData(chain[i]);
    }
  } else if (body.trace) {
    body.trace = truncateTraceData(body.trace);
  }
  return [payload, stringify(payload, jsonBackup)];
}
function needsTruncation(payload, maxSize) {
  return maxByteSize(payload) > maxSize;
}
function truncate(payload, jsonBackup, maxSize) {
  maxSize = typeof maxSize === 'undefined' ? 512 * 1024 : maxSize;
  var strategies = [raw, truncateFrames, truncateStrings.bind(null, 1024), truncateStrings.bind(null, 512), truncateStrings.bind(null, 256), minBody];
  var strategy, results, result;
  while (strategy = strategies.shift()) {
    results = strategy(payload, jsonBackup);
    payload = results[0];
    result = results[1];
    if (result.error || !needsTruncation(result.value, maxSize)) {
      return result;
    }
  }
  return result;
}
/* harmony default export */ var truncation = ({
  truncate: truncate,
  /* for testing */
  raw: raw,
  truncateFrames: truncateFrames,
  truncateStrings: truncateStrings,
  maybeTruncateValue: maybeTruncateValue
});
;// ./src/tracing/context.js
function context_typeof(o) { "@babel/helpers - typeof"; return context_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, context_typeof(o); }
function context_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function context_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, context_toPropertyKey(o.key), o); } }
function context_createClass(e, r, t) { return r && context_defineProperties(e.prototype, r), t && context_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function context_toPropertyKey(t) { var i = context_toPrimitive(t, "string"); return "symbol" == context_typeof(i) ? i : i + ""; }
function context_toPrimitive(t, r) { if ("object" != context_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != context_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Context = /*#__PURE__*/function () {
  function Context(parentContext) {
    context_classCallCheck(this, Context);
    this._currentContext = parentContext ? new Map(parentContext) : new Map();
  }
  return context_createClass(Context, [{
    key: "getValue",
    value: function getValue(key) {
      return this._currentContext.get(key);
    }
  }, {
    key: "setValue",
    value: function setValue(key, value) {
      var context = new Context(this._currentContext);
      context._currentContext.set(key, value);
      return context;
    }
  }, {
    key: "deleteValue",
    value: function deleteValue(key) {
      var context = new Context(self._currentContext);
      context._currentContext.delete(key);
      return context;
    }
  }]);
}();
var ROOT_CONTEXT = new Context();
;// ./src/tracing/contextManager.js
function contextManager_typeof(o) { "@babel/helpers - typeof"; return contextManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, contextManager_typeof(o); }
function contextManager_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function contextManager_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, contextManager_toPropertyKey(o.key), o); } }
function contextManager_createClass(e, r, t) { return r && contextManager_defineProperties(e.prototype, r), t && contextManager_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function contextManager_toPropertyKey(t) { var i = contextManager_toPrimitive(t, "string"); return "symbol" == contextManager_typeof(i) ? i : i + ""; }
function contextManager_toPrimitive(t, r) { if ("object" != contextManager_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != contextManager_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var ContextManager = /*#__PURE__*/function () {
  function ContextManager() {
    contextManager_classCallCheck(this, ContextManager);
    this.currentContext = ROOT_CONTEXT;
  }
  return contextManager_createClass(ContextManager, [{
    key: "active",
    value: function active() {
      return this.currentContext;
    }
  }, {
    key: "enterContext",
    value: function enterContext(context) {
      var previousContext = this.currentContext;
      this.currentContext = context || ROOT_CONTEXT;
      return previousContext;
    }
  }, {
    key: "exitContext",
    value: function exitContext(context) {
      this.currentContext = context;
      return this.currentContext;
    }
  }, {
    key: "with",
    value: function _with(context, fn, thisArg) {
      var previousContext = this.enterContext(context);
      try {
        for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
          args[_key - 3] = arguments[_key];
        }
        return fn.call.apply(fn, [thisArg].concat(args));
      } finally {
        this.exitContext(previousContext);
      }
    }
  }]);
}();
function createContextKey(key) {
  // Use Symbol for OpenTelemetry compatibility.
  return Symbol.for(key);
}
;// ./src/tracing/id.js
/**
 * Generate a random hexadecimal ID of specified byte length
 *
 * @param {number} bytes - Number of bytes for the ID (default: 16)
 * @returns {string} - Hexadecimal string representation
 */
function gen() {
  var bytes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
  var randomBytes = new Uint8Array(bytes);
  crypto.getRandomValues(randomBytes);
  var randHex = Array.from(randomBytes, function (byte) {
    return byte.toString(16).padStart(2, '0');
  }).join('');
  return randHex;
}

/**
 * Tracing id generation utils
 *
 * @example
 * import id from './id.js';
 *
 * const spanId = id.gen(8); // => "a1b2c3d4e5f6..."
 */
/* harmony default export */ var id = ({
  gen: gen
});
;// ./src/tracing/session.js
function session_typeof(o) { "@babel/helpers - typeof"; return session_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, session_typeof(o); }
function session_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function session_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? session_ownKeys(Object(t), !0).forEach(function (r) { session_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : session_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function session_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function session_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, session_toPropertyKey(o.key), o); } }
function session_createClass(e, r, t) { return r && session_defineProperties(e.prototype, r), t && session_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function session_defineProperty(e, r, t) { return (r = session_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function session_toPropertyKey(t) { var i = session_toPrimitive(t, "string"); return "symbol" == session_typeof(i) ? i : i + ""; }
function session_toPrimitive(t, r) { if ("object" != session_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != session_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var SESSION_KEY = 'RollbarSession';
var Session = /*#__PURE__*/function () {
  function Session(tracing, options) {
    session_classCallCheck(this, Session);
    session_defineProperty(this, "_attributes", void 0);
    this.options = options;
    this.tracing = tracing;
    this.window = tracing.window;
    this.session = null;
    this._attributes = {};
  }
  return session_createClass(Session, [{
    key: "init",
    value: function init() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (this.session) {
        return this;
      }
      this.getSession() || this.createSession();
      this.initSessionAttributes(attrs);
      return this;
    }
  }, {
    key: "getSession",
    value: function getSession() {
      try {
        var serializedSession = this.window.sessionStorage.getItem(SESSION_KEY);
        if (!serializedSession) {
          return null;
        }
        this.session = JSON.parse(serializedSession);
      } catch (_unused) {
        return null;
      }
      return this;
    }
  }, {
    key: "createSession",
    value: function createSession() {
      this.session = {
        id: id.gen(),
        createdAt: Date.now()
      };
      return this.setSession(this.session);
    }
  }, {
    key: "setSession",
    value: function setSession(session) {
      var sessionString = JSON.stringify(session);
      try {
        this.window.sessionStorage.setItem(SESSION_KEY, sessionString);
      } catch (_unused2) {
        return null;
      }
      return this;
    }
  }, {
    key: "attributes",
    get: function get() {
      return this._attributes;
    }
  }, {
    key: "setAttributes",
    value: function setAttributes(attributes) {
      this._attributes = session_objectSpread(session_objectSpread({}, this._attributes), attributes);
      return this;
    }
  }, {
    key: "setUser",
    value: function setUser(user) {
      this.setAttributes({
        'user.id': user === null || user === void 0 ? void 0 : user.id,
        'user.email': user === null || user === void 0 ? void 0 : user.email,
        'user.name': (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username)
      });
      return this;
    }
  }, {
    key: "initSessionAttributes",
    value: function initSessionAttributes(attrs) {
      var _navigator$userAgentD, _navigator$userAgentD2, _navigator$userAgentD3;
      this.setAttributes(session_objectSpread({
        'session.id': this.session.id,
        'browser.brands': (_navigator$userAgentD = navigator.userAgentData) === null || _navigator$userAgentD === void 0 ? void 0 : _navigator$userAgentD.brands,
        'browser.language': navigator.language,
        'browser.mobile': (_navigator$userAgentD2 = navigator.userAgentData) === null || _navigator$userAgentD2 === void 0 ? void 0 : _navigator$userAgentD2.mobile,
        'browser.platform': (_navigator$userAgentD3 = navigator.userAgentData) === null || _navigator$userAgentD3 === void 0 ? void 0 : _navigator$userAgentD3.platform,
        'client.address': '$remote_ip',
        // updated at the API
        'rollbar.notifier.framework': 'browser-js',
        'user_agent.original': navigator.userAgent
      }, attrs));
      return this;
    }
  }]);
}();
;// ./src/tracing/hrtime.js
/**
 * @module hrtime
 *
 * @description Methods for handling OpenTelemetry hrtime.
 */

/**
 * Convert a duration in milliseconds to an OpenTelemetry hrtime tuple.
 *
 * @param {number} millis - The duration in milliseconds.
 * @returns {[number, number]} An array where the first element is seconds
 *   and the second is nanoseconds.
 */
function hrtime_fromMillis(millis) {
  return [Math.trunc(millis / 1000), Math.round(millis % 1000 * 1e6)];
}

/**
 * Convert an OpenTelemetry hrtime tuple back to a duration in milliseconds.
 *
 * @param {[number, number]} hrtime - The hrtime tuple [seconds, nanoseconds].
 * @returns {number} The total duration in milliseconds.
 */
function toMillis(hrtime) {
  return hrtime[0] * 1e3 + Math.round(hrtime[1] / 1e6);
}

/**
 * Convert an OpenTelemetry hrtime tuple back to a duration in nanoseconds.
 *
 * @param {[number, number]} hrtime - The hrtime tuple [seconds, nanoseconds].
 * @returns {number} The total duration in nanoseconds.
 */
function toNanos(hrtime) {
  return hrtime[0] * 1e9 + hrtime[1];
}

/**
 * Adds two OpenTelemetry hrtime tuples.
 *
 * @param {[number, number]} a - The first hrtime tuple [s, ns].
 * @param {[number, number]} b - The second hrtime tuple [s, ns].
 * @returns {[number, number]} Summed hrtime tuple, normalized.
 *
 */
function add(a, b) {
  return [a[0] + b[0] + Math.trunc((a[1] + b[1]) / 1e9), (a[1] + b[1]) % 1e9];
}

/**
 * Get the current high-resolution time as an OpenTelemetry hrtime tuple.
 *
 * @param {boolean} usePerformance=false - If true, uses the Performance API (timeOrigin + now()).
 *
 * @returns {[number, number]} The current hrtime tuple [s, ns].
 */
function now() {
  var usePerformance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  if (usePerformance) {
    return add(hrtime_fromMillis(performance.timeOrigin), hrtime_fromMillis(performance.now()));
  }
  return hrtime_fromMillis(Date.now());
}

/**
 * Check if a value is a valid OpenTelemetry hrtime tuple.
 *
 * An hrtime tuple is an Array of exactly two numbers:
 *   [seconds, nanoseconds]
 *
 * @param {*} value – anything to test
 * @returns {boolean} true if `value` is a [number, number] array of length 2
 *
 * @example
 * isHrTime([ 1, 500 ]);         // true
 * isHrTime([ 0, 1e9 ]);         // true
 * isHrTime([ '1', 500 ]);       // false
 * isHrTime({ 0: 1, 1: 500 });   // false
 */
function isHrTime(value) {
  return Array.isArray(value) && value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number';
}

/**
 * Methods for handling hrtime. OpenTelemetry uses the [seconds, nanoseconds]
 * format for hrtime in the `ReadableSpan` interface.
 *
 * @example
 * import hrtime from '@tracing/hrtime.js';
 *
 * hrtime.fromMillis(1000);
 * hrtime.toMillis([0, 1000]);
 * hrtime.add([0, 0], [0, 1000]);
 * hrtime.now();
 * hrtime.isHrTime([0, 1000]);
 */
/* harmony default export */ var hrtime = ({
  fromMillis: hrtime_fromMillis,
  toMillis: toMillis,
  toNanos: toNanos,
  add: add,
  now: now,
  isHrTime: isHrTime
});
;// ./src/tracing/exporter.js
function exporter_typeof(o) { "@babel/helpers - typeof"; return exporter_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, exporter_typeof(o); }
function exporter_slicedToArray(r, e) { return exporter_arrayWithHoles(r) || exporter_iterableToArrayLimit(r, e) || exporter_unsupportedIterableToArray(r, e) || exporter_nonIterableRest(); }
function exporter_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function exporter_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function exporter_arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function exporter_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = exporter_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function exporter_toConsumableArray(r) { return exporter_arrayWithoutHoles(r) || exporter_iterableToArray(r) || exporter_unsupportedIterableToArray(r) || exporter_nonIterableSpread(); }
function exporter_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function exporter_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return exporter_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? exporter_arrayLikeToArray(r, a) : void 0; } }
function exporter_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function exporter_arrayWithoutHoles(r) { if (Array.isArray(r)) return exporter_arrayLikeToArray(r); }
function exporter_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function exporter_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function exporter_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, exporter_toPropertyKey(o.key), o); } }
function exporter_createClass(e, r, t) { return r && exporter_defineProperties(e.prototype, r), t && exporter_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function exporter_toPropertyKey(t) { var i = exporter_toPrimitive(t, "string"); return "symbol" == exporter_typeof(i) ? i : i + ""; }
function exporter_toPrimitive(t, r) { if ("object" != exporter_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != exporter_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


/**
 * SpanExporter is responsible for exporting ReadableSpan objects
 * and transforming them into the OTLP-compatible format.
 */
var SpanExporter = /*#__PURE__*/function () {
  function SpanExporter(api) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    exporter_classCallCheck(this, SpanExporter);
    this.api = api;
    this.options = options;
  }

  /**
   * Export spans to the span export queue
   *
   * @param {Array} spans - Array of ReadableSpan objects to export
   * @param {Function} _resultCallback - Optional callback (not used)
   */
  return exporter_createClass(SpanExporter, [{
    key: "export",
    value: function _export(spans, _resultCallback) {
      spanExportQueue.push.apply(spanExportQueue, exporter_toConsumableArray(spans));
    }

    /**
     * Transforms an array of ReadableSpan objects into the OTLP format payload
     * compatible with the Rollbar API. This follows the OpenTelemetry protocol
     * specification for traces.
     *
     * @returns {Object} OTLP format payload for API transmission
     */
  }, {
    key: "toPayload",
    value: function toPayload() {
      var _this = this;
      var spans = spanExportQueue.slice();
      spanExportQueue.length = 0;
      if (!spans || !spans.length) {
        return {
          resourceSpans: []
        };
      }
      var resource = spans[0] && spans[0].resource || {};
      var scopeMap = new Map();
      var _iterator = exporter_createForOfIteratorHelper(spans),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var span = _step.value;
          var scopeKey = span.instrumentationScope ? "".concat(span.instrumentationScope.name, ":").concat(span.instrumentationScope.version) : 'default:1.0.0';
          if (!scopeMap.has(scopeKey)) {
            scopeMap.set(scopeKey, {
              scope: span.instrumentationScope || {
                name: 'default',
                version: '1.0.0',
                attributes: []
              },
              spans: []
            });
          }
          scopeMap.get(scopeKey).spans.push(this._transformSpan(span));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return {
        resourceSpans: [{
          resource: this._transformResource(resource),
          scopeSpans: Array.from(scopeMap.values()).map(function (scopeData) {
            return {
              scope: _this._transformInstrumentationScope(scopeData.scope),
              spans: scopeData.spans
            };
          })
        }]
      };
    }

    /**
     * Sends the given payload to the Rollbar API.
     *
     * @param {String} payload - Serialized OTLP format payload
     * @param {Object} headers - Optional request headers
     * @returns {Promise} Promise that resolves when the request completes
     */
  }, {
    key: "post",
    value: function post(payload) {
      var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.api.postSpans(payload, headers);
    }

    /**
     * Transforms a ReadableSpan into the OTLP Span format
     *
     * @private
     * @param {Object} span - ReadableSpan object to transform
     * @returns {Object} OTLP Span format
     */
  }, {
    key: "_transformSpan",
    value: function _transformSpan(span) {
      var _this2 = this;
      var transformAttributes = function transformAttributes(attributes) {
        return Object.entries(attributes || {}).map(function (_ref) {
          var _ref2 = exporter_slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];
          return {
            key: key,
            value: _this2._transformAnyValue(value)
          };
        });
      };
      var transformEvents = function transformEvents(events) {
        return (events || []).map(function (event) {
          return {
            timeUnixNano: hrtime.toNanos(event.time),
            name: event.name,
            attributes: transformAttributes(event.attributes)
          };
        });
      };
      return {
        traceId: span.spanContext.traceId,
        spanId: span.spanContext.spanId,
        parentSpanId: span.parentSpanId || '',
        name: span.name,
        kind: span.kind || 1,
        // INTERNAL by default
        startTimeUnixNano: hrtime.toNanos(span.startTime),
        endTimeUnixNano: hrtime.toNanos(span.endTime),
        attributes: transformAttributes(span.attributes),
        events: transformEvents(span.events)
      };
    }

    /**
     * Transforms a resource object into OTLP Resource format
     *
     * @private
     * @param {Object} resource - Resource information
     * @returns {Object} OTLP Resource format
     */
  }, {
    key: "_transformResource",
    value: function _transformResource(resource) {
      var _this3 = this;
      var attributes = resource.attributes || {};
      var keyValues = Object.entries(attributes).map(function (_ref3) {
        var _ref4 = exporter_slicedToArray(_ref3, 2),
          key = _ref4[0],
          value = _ref4[1];
        return {
          key: key,
          value: _this3._transformAnyValue(value)
        };
      });
      return {
        attributes: keyValues
      };
    }

    /**
     * Transforms an instrumentation scope into OTLP InstrumentationScope format
     *
     * @private
     * @param {Object} scope - Instrumentation scope information
     * @returns {Object} OTLP InstrumentationScope format
     */
  }, {
    key: "_transformInstrumentationScope",
    value: function _transformInstrumentationScope(scope) {
      var _this4 = this;
      return {
        name: scope.name || '',
        version: scope.version || '',
        attributes: (scope.attributes || []).map(function (attr) {
          return {
            key: attr.key,
            value: _this4._transformAnyValue(attr.value)
          };
        })
      };
    }

    /**
     * Transforms a JavaScript value into an OTLP AnyValue
     *
     * @private
     * @param {any} value - Value to transform
     * @returns {Object} OTLP AnyValue format
     */
  }, {
    key: "_transformAnyValue",
    value: function _transformAnyValue(value) {
      var _this5 = this;
      if (value === null || value === undefined) {
        return {
          stringValue: ''
        };
      }
      var type = exporter_typeof(value);
      if (type === 'string') {
        return {
          stringValue: value
        };
      } else if (type === 'number') {
        if (Number.isInteger(value)) {
          return {
            intValue: value.toString()
          };
        } else {
          return {
            doubleValue: value
          };
        }
      } else if (type === 'boolean') {
        return {
          boolValue: value
        };
      } else if (Array.isArray(value)) {
        return {
          arrayValue: {
            values: value.map(function (v) {
              return _this5._transformAnyValue(v);
            })
          }
        };
      } else if (type === 'object') {
        return {
          kvlistValue: {
            values: Object.entries(value).map(function (_ref5) {
              var _ref6 = exporter_slicedToArray(_ref5, 2),
                k = _ref6[0],
                v = _ref6[1];
              return {
                key: k,
                value: _this5._transformAnyValue(v)
              };
            })
          }
        };
      }
      return {
        stringValue: String(value)
      };
    }
  }]);
}();
var spanExportQueue = [];
;// ./src/tracing/spanProcessor.js
function spanProcessor_typeof(o) { "@babel/helpers - typeof"; return spanProcessor_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, spanProcessor_typeof(o); }
function spanProcessor_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = spanProcessor_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function spanProcessor_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return spanProcessor_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? spanProcessor_arrayLikeToArray(r, a) : void 0; } }
function spanProcessor_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function spanProcessor_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function spanProcessor_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, spanProcessor_toPropertyKey(o.key), o); } }
function spanProcessor_createClass(e, r, t) { return r && spanProcessor_defineProperties(e.prototype, r), t && spanProcessor_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function spanProcessor_toPropertyKey(t) { var i = spanProcessor_toPrimitive(t, "string"); return "symbol" == spanProcessor_typeof(i) ? i : i + ""; }
function spanProcessor_toPrimitive(t, r) { if ("object" != spanProcessor_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != spanProcessor_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var SpanProcessor = /*#__PURE__*/function () {
  function SpanProcessor(exporter) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    spanProcessor_classCallCheck(this, SpanProcessor);
    this.exporter = exporter;
    this.options = options;
    this.pendingSpans = new Map();
    this.transforms = [this.userTransform.bind(this)];
  }
  return spanProcessor_createClass(SpanProcessor, [{
    key: "addTransform",
    value: function addTransform(transformFn) {
      this.transforms.unshift(transformFn);
    }
  }, {
    key: "userTransform",
    value: function userTransform(span) {
      if (this.options.transformSpan) {
        this.options.transformSpan({
          span: span
        });
      }
    }
  }, {
    key: "applyTransforms",
    value: function applyTransforms(span) {
      var _iterator = spanProcessor_createForOfIteratorHelper(this.transforms),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var transform = _step.value;
          try {
            transform(span);
          } catch (e) {
            src_logger.error('Error running span transform callback', e);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "onStart",
    value: function onStart(span, _parentContext) {
      this.pendingSpans.set(span.span.spanContext.spanId, span);
    }
  }, {
    key: "onEnd",
    value: function onEnd(span) {
      this.applyTransforms(span.span);
      this.exporter.export([span.export()]);
      this.pendingSpans.delete(span.span.spanContext.spanId);
    }
  }]);
}();
;// ./src/tracing/span.js
function span_typeof(o) { "@babel/helpers - typeof"; return span_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, span_typeof(o); }
function span_slicedToArray(r, e) { return span_arrayWithHoles(r) || span_iterableToArrayLimit(r, e) || span_unsupportedIterableToArray(r, e) || span_nonIterableRest(); }
function span_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function span_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return span_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? span_arrayLikeToArray(r, a) : void 0; } }
function span_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function span_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function span_arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function span_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function span_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, span_toPropertyKey(o.key), o); } }
function span_createClass(e, r, t) { return r && span_defineProperties(e.prototype, r), t && span_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function span_toPropertyKey(t) { var i = span_toPrimitive(t, "string"); return "symbol" == span_typeof(i) ? i : i + ""; }
function span_toPrimitive(t, r) { if ("object" != span_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != span_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var Span = /*#__PURE__*/function () {
  function Span(options) {
    span_classCallCheck(this, Span);
    this.usePerformance = options.usePerformance;
    this.initReadableSpan(options);
    this.spanProcessor = options.spanProcessor;
    this.spanProcessor.onStart(this, options.context);
    if (options.attributes) {
      this.setAttributes(options.attributes);
    }
    return this;
  }
  return span_createClass(Span, [{
    key: "initReadableSpan",
    value: function initReadableSpan(options) {
      var _options$session;
      this.span = {
        name: options.name,
        kind: options.kind,
        spanContext: options.spanContext,
        parentSpanId: options.parentSpanId,
        startTime: options.startTime || hrtime.now(options.usePerformance),
        endTime: [0, 0],
        status: {
          code: 0,
          message: ''
        },
        attributes: {
          'session.id': (_options$session = options.session) === null || _options$session === void 0 ? void 0 : _options$session.id
        },
        links: [],
        events: [],
        duration: 0,
        ended: false,
        resource: options.resource,
        instrumentationScope: options.scope,
        droppedAttributesCount: 0,
        droppedEventsCount: 0,
        droppedLinksCount: 0
      };
    }
  }, {
    key: "spanContext",
    value: function spanContext() {
      return this.span.spanContext;
    }
  }, {
    key: "spanId",
    get: function get() {
      return this.span.spanContext.spanId;
    }
  }, {
    key: "traceId",
    get: function get() {
      return this.span.spanContext.traceId;
    }
  }, {
    key: "setAttribute",
    value: function setAttribute(key, value) {
      if (value == null || this.span.ended) return this;
      if (key.length === 0) return this;
      this.span.attributes[key] = value;
      return this;
    }
  }, {
    key: "setAttributes",
    value: function setAttributes(attributes) {
      for (var _i = 0, _Object$entries = Object.entries(attributes); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = span_slicedToArray(_Object$entries[_i], 2),
          k = _Object$entries$_i[0],
          v = _Object$entries$_i[1];
        this.setAttribute(k, v);
      }
      return this;
    }
  }, {
    key: "addEvent",
    value: function addEvent(name) {
      var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var time = arguments.length > 2 ? arguments[2] : undefined;
      if (this.span.ended) return this;
      this.span.events.push({
        name: name,
        attributes: attributes,
        time: time || hrtime.now(),
        droppedAttributesCount: 0
      });
      return this;
    }
  }, {
    key: "isRecording",
    value: function isRecording() {
      return this.span.ended === false;
    }
  }, {
    key: "end",
    value: function end(attributes, time) {
      if (attributes) this.setAttributes(attributes);
      this.span.endTime = time || hrtime.now(this.usePerformance);
      this.span.ended = true;
      this.spanProcessor.onEnd(this);
    }
  }, {
    key: "export",
    value: function _export() {
      return this.span;
    }
  }]);
}();
;// ./src/tracing/tracer.js
function tracer_typeof(o) { "@babel/helpers - typeof"; return tracer_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, tracer_typeof(o); }
function tracer_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function tracer_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? tracer_ownKeys(Object(t), !0).forEach(function (r) { tracer_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : tracer_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function tracer_defineProperty(e, r, t) { return (r = tracer_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function tracer_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function tracer_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, tracer_toPropertyKey(o.key), o); } }
function tracer_createClass(e, r, t) { return r && tracer_defineProperties(e.prototype, r), t && tracer_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function tracer_toPropertyKey(t) { var i = tracer_toPrimitive(t, "string"); return "symbol" == tracer_typeof(i) ? i : i + ""; }
function tracer_toPrimitive(t, r) { if ("object" != tracer_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != tracer_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var Tracer = /*#__PURE__*/function () {
  function Tracer(tracing, spanProcessor) {
    tracer_classCallCheck(this, Tracer);
    this.spanProcessor = spanProcessor;
    this.tracing = tracing;
  }
  return tracer_createClass(Tracer, [{
    key: "startSpan",
    value: function startSpan(name) {
      var _this$tracing$resourc, _options$resource;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.tracing.contextManager.active();
      var parentSpan = this.tracing.getSpan(context);
      var parentSpanContext = parentSpan === null || parentSpan === void 0 ? void 0 : parentSpan.spanContext();
      var spanId = id.gen(8);
      var traceId;
      var traceFlags = 0;
      var traceState = null;
      var parentSpanId;
      if (parentSpanContext) {
        traceId = parentSpanContext.traceId;
        traceState = parentSpanContext.traceState;
        parentSpanId = parentSpanContext.spanId;
      } else {
        traceId = id.gen(16);
      }
      var kind = 0;
      var spanContext = {
        traceId: traceId,
        spanId: spanId,
        traceFlags: traceFlags,
        traceState: traceState
      };
      var resource = {
        attributes: tracer_objectSpread(tracer_objectSpread({}, ((_this$tracing$resourc = this.tracing.resource) === null || _this$tracing$resourc === void 0 ? void 0 : _this$tracing$resourc.attributes) || {}), ((_options$resource = options.resource) === null || _options$resource === void 0 ? void 0 : _options$resource.attributes) || {})
      };
      var span = new Span({
        resource: resource,
        scope: this.tracing.scope,
        session: this.tracing.session.session,
        context: context,
        spanContext: spanContext,
        name: name,
        kind: kind,
        parentSpanId: parentSpanId,
        spanProcessor: this.spanProcessor,
        startTime: options.startTime,
        usePerformance: options.usePerformance
      });
      return span;
    }
  }]);
}();
;// ./src/tracing/tracing.js
function tracing_typeof(o) { "@babel/helpers - typeof"; return tracing_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, tracing_typeof(o); }
function tracing_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function tracing_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? tracing_ownKeys(Object(t), !0).forEach(function (r) { tracing_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : tracing_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function tracing_defineProperty(e, r, t) { return (r = tracing_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function tracing_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function tracing_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, tracing_toPropertyKey(o.key), o); } }
function tracing_createClass(e, r, t) { return r && tracing_defineProperties(e.prototype, r), t && tracing_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function tracing_toPropertyKey(t) { var i = tracing_toPrimitive(t, "string"); return "symbol" == tracing_typeof(i) ? i : i + ""; }
function tracing_toPrimitive(t, r) { if ("object" != tracing_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != tracing_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }






var SPAN_KEY = createContextKey('Rollbar Context Key SPAN');
var Tracing = /*#__PURE__*/function () {
  function Tracing(gWindow, api, options) {
    tracing_classCallCheck(this, Tracing);
    this.api = api;
    this.options = options;
    this.window = gWindow;
    if (this.window.sessionStorage) {
      this.session = new Session(this, options);
    }
    this.createTracer();
  }
  return tracing_createClass(Tracing, [{
    key: "configure",
    value: function configure(options) {
      // Options merge happens before configure is called, so we can just replace.
      this.options = options;
    }
  }, {
    key: "initSession",
    value: function initSession() {
      if (this.session) {
        this.session.init();
      }
    }
  }, {
    key: "sessionId",
    get: function get() {
      if (this.session) {
        return this.session.session.id;
      }
      return null;
    }
  }, {
    key: "resource",
    get: function get() {
      var _this$options$payload, _this$options$payload2;
      return {
        attributes: tracing_objectSpread(tracing_objectSpread({}, this.options.resource || {}), {}, {
          'rollbar.environment': (_this$options$payload = (_this$options$payload2 = this.options.payload) === null || _this$options$payload2 === void 0 ? void 0 : _this$options$payload2.environment) !== null && _this$options$payload !== void 0 ? _this$options$payload : this.options.environment
        })
      };
    }
  }, {
    key: "scope",
    get: function get() {
      return {
        name: 'rollbar-browser-js',
        version: this.options.version
      };
    }
  }, {
    key: "idGen",
    value: function idGen() {
      var bytes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
      return id.gen(bytes);
    }
  }, {
    key: "createTracer",
    value: function createTracer() {
      this.contextManager = new ContextManager();
      this.exporter = new SpanExporter(this.api, this.options);
      this.spanProcessor = new SpanProcessor(this.exporter, this.options.tracing);
      this.tracer = new Tracer(this, this.spanProcessor);
    }
  }, {
    key: "getTracer",
    value: function getTracer() {
      return this.tracer;
    }
  }, {
    key: "addSpanTransform",
    value: function addSpanTransform(transformFn) {
      this.spanProcessor.addTransform(transformFn);
    }
  }, {
    key: "getSpan",
    value: function getSpan() {
      var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.contextManager.active();
      return context.getValue(SPAN_KEY);
    }
  }, {
    key: "setSpan",
    value: function setSpan() {
      var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.contextManager.active();
      var span = arguments.length > 1 ? arguments[1] : undefined;
      return context.setValue(SPAN_KEY, span);
    }
  }, {
    key: "startSpan",
    value: function startSpan(name) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.contextManager.active();
      return this.tracer.startSpan(name, options, context);
    }
  }, {
    key: "with",
    value: function _with(context, fn, thisArg) {
      var _this$contextManager;
      for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        args[_key - 3] = arguments[_key];
      }
      return (_this$contextManager = this.contextManager).with.apply(_this$contextManager, [context, fn, thisArg].concat(args));
    }
  }, {
    key: "withSpan",
    value: function withSpan(name, options, fn, thisArg) {
      var span = this.startSpan(name, options);
      return this.with(this.setSpan(this.contextManager.active(), span), fn, thisArg, span);
    }
  }]);
}();

;// ./src/browser/rollbar.js







core.setComponents({
  telemeter: telemetry,
  instrumenter: browser_telemetry,
  wrapGlobals: browser_wrapGlobals,
  scrub: src_scrub,
  truncation: truncation,
  tracing: Tracing
});
/* harmony default export */ var browser_rollbar = (core);
;// ./src/browser/bundles/rollbar.js

var options = typeof window !== 'undefined' && window._rollbarConfig;
var alias = options && options.globalAlias || 'Rollbar';
var shimRunning = typeof window !== 'undefined' && window[alias] && typeof window[alias].shimId === 'function' && window[alias].shimId() !== undefined;
if (typeof window !== 'undefined' && !window._rollbarStartTime) {
  window._rollbarStartTime = new Date().getTime();
}
if (!shimRunning && options) {
  var rollbar_Rollbar = new browser_rollbar(options);
  window[alias] = rollbar_Rollbar;
} else if (typeof window !== 'undefined') {
  window.rollbar = browser_rollbar;
  window._rollbarDidLoad = true;
} else if (typeof self !== 'undefined') {
  self.rollbar = browser_rollbar;
  self._rollbarDidLoad = true;
}
/* harmony default export */ var bundles_rollbar = ((/* unused pure expression or super */ null && (rollbar)));
/******/ })()
;