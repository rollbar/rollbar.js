(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["rollbar"] = factory();
	else
		root["rollbar"] = factory();
})(this, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because 'output.globalObject' reads 'this'.
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = function(exports, definition) {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); };
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
!function() {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ bundles_rollbarReplay; }
});

// NAMESPACE OBJECT (decoupled): ./src/browser/url.js
var url_namespaceObject = {};
__webpack_require__.r(url_namespaceObject);
__webpack_require__.d(url_namespaceObject, {
  parse: function() { return url_parse; }
});

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
  var match = {}.toString.call(x).match(/\s([a-zA-Z]+)/);
  // A custom Symbol.toStringTag like '' or '123' leaves nothing to match.
  return match ? match[1].toLowerCase() : 'object';
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
  return value != null && (_typeof(value) == 'object' || typeof value == 'function');
}

/* hasOwn - safe helper around Object.hasOwnProperty */
function hasOwn(obj, prop) {
  if (obj == null) {
    return false;
  }
  if (Object.hasOwn) {
    return Object.hasOwn(obj, prop);
  }
  return Object.prototype.hasOwnProperty.call(obj, prop);
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
function isRequestObject(input) {
  return typeof Request !== 'undefined' && input instanceof Request;
}
function redact() {
  return '********';
}

// from http://stackoverflow.com/a/8809472/1138191
function uuid4() {
  var d = now();
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
    strict: /^(?:([^:/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:/?#]*)(?::(\d*))?))?((((?:[^?#/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose: /^(?:(?![^:@]+:[^:@/]*@)([^:/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#/]*\.[^?#/.]+(?:[?#]|$)))*\/?)?([^?#/]*))(?:\?([^#]*))?(?:#(.*))?)/
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
        if (message) {
          extraArgs.push(arg);
        } else {
          message = arg;
        }
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
        if (err) {
          extraArgs.push(arg);
        } else {
          err = arg;
        }
        break;
      case 'object':
      case 'array':
        if (arg instanceof Error || typeof DOMException !== 'undefined' && arg instanceof DOMException) {
          if (err) {
            extraArgs.push(arg);
          } else {
            err = arg;
          }
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
        if (custom) {
          extraArgs.push(arg);
        } else {
          custom = arg;
        }
        break;
      default:
        if (arg instanceof Error || typeof DOMException !== 'undefined' && arg instanceof DOMException) {
          if (err) {
            extraArgs.push(arg);
          } else {
            err = arg;
          }
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
    timestamp: now(),
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
    var _iterator = _createForOfIteratorHelper(errors),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var error = _step.value;
        if (hasOwn(error, 'rollbarContext')) {
          custom = merge(custom, nonCircularClone(error.rollbarContext));
          contextAdded = true;
        }
      }

      // Avoid adding an empty object to the data.
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
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
  var _iterator2 = _createForOfIteratorHelper(arr),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var entry = _step2.value;
      if (entry === val) {
        return true;
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
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
  var _iterator3 = _createForOfIteratorHelper(attributes),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var a = _step3.value;
      if (a.value === undefined) {
        continue;
      }
      itemData.attributes.push(a);
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
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
  } catch (_e) {
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
  } catch (_e) {
    return;
  }
}

/**
 * formatArgsAsString - Formats console method arguments as a single message.
 *
 * Never throws, so it is safe to call from the console wrapper. An argument
 * that can't be formatted is replaced with a placeholder, so the rest of the
 * message is kept.
 *
 * @param {Array} args - The arguments passed to a console method.
 * @returns {string} The arguments formatted and joined by spaces.
 */
function formatArgsAsString(args) {
  var result = [];
  for (var i = 0, len = args.length; i < len; ++i) {
    var str;
    try {
      str = formatArgAsString(args[i]);
    } catch (_e) {
      // e.g. a Proxy whose traps throw, or a revoked Proxy.
      str = '[unformattable ' + _typeof(args[i]) + ']';
    }
    result.push(str);
  }
  return result.join(' ');
}

/**
 * formatArgAsString - Formats a single console argument as a string.
 *
 * @param {*} arg - Any value.
 * @returns {string} The formatted value.
 */
function formatArgAsString(arg) {
  // Checked directly, not via typeName, which an object can spoof with a
  // Symbol.toStringTag like 'Null' or 'Symbol'.
  if (arg === null || arg === undefined || _typeof(arg) === 'symbol') {
    return String(arg);
  }
  var type = typeName(arg);
  // Module namespace objects have no toString/valueOf, so String() would
  // throw on them (#1127).
  if (type === 'object' || type === 'module') {
    return stringifyArg(arg);
  }
  try {
    return String(arg);
  } catch (_e) {
    // Other values with no toString/valueOf, like Object.create(null) with a
    // custom Symbol.toStringTag, can't be converted to a primitive either.
    return stringifyArg(arg);
  }
}

/**
 * stringifyArg - JSON-encodes a console argument, truncated to 500 chars.
 *
 * @param {*} arg - Any value.
 * @returns {string} The JSON, or the serialization error message.
 */
function stringifyArg(arg) {
  var result = stringify(arg);
  // Check the value rather than the error, since the thrown value can be
  // falsy (e.g. `throw 0` from a getter).
  var str = String(result.value !== undefined ? result.value : result.error);
  if (str.length > 500) {
    var end = 497;
    var lastCode = str.charCodeAt(end - 1);
    // Don't cut a surrogate pair in half, which leaves an ill-formed string.
    if (lastCode >= 0xd800 && lastCode <= 0xdbff) {
      end -= 1;
    }
    str = str.slice(0, end) + '...';
  }
  return str;
}
function now() {
  if (Date.now) {
    return Date.now();
  }
  return Number(new Date());
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
    } catch (_e) {
      newIp = null;
    }
  }
  requestData['user_ip'] = newIp;
}
function handleOptions(current, input, payload, logger) {
  var result = merge(current, input, payload);
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
function merge() {
  function isPlainObject(obj) {
    if (!obj || Object.prototype.toString.call(obj) !== '[object Object]') {
      return false;
    }
    var hasOwnConstructor = hasOwn(obj, 'constructor');
    var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn(obj.constructor.prototype, 'isPrototypeOf');
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
    return typeof key === 'undefined' || hasOwn(obj, key);
  }
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
    if (current === null || current === undefined) {
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
function shouldAddBaggageHeader(options, tracing, url) {
  var _options$tracing;
  if (!(tracing !== null && tracing !== void 0 && tracing.sessionId) || !url) {
    return false;
  }
  var propagation = options === null || options === void 0 || (_options$tracing = options.tracing) === null || _options$tracing === void 0 ? void 0 : _options$tracing.propagation;
  var enabledHeaders = propagation === null || propagation === void 0 ? void 0 : propagation.enabledHeaders;
  if (!Array.isArray(enabledHeaders) || !enabledHeaders.includes('baggage')) {
    return false;
  }
  var enabledCorsUrls = propagation === null || propagation === void 0 ? void 0 : propagation.enabledCorsUrls;
  if (!Array.isArray(enabledCorsUrls) || enabledCorsUrls.length === 0) {
    return false;
  }
  return enabledCorsUrls.some(function (pattern) {
    if (isType(pattern, 'string')) {
      return url === pattern;
    }
    if (isType(pattern, 'regexp')) {
      return pattern.test(url);
    }
    return false;
  });
}
function addHeadersToFetch(args, newHeaders) {
  var _init;
  // Headers may be in the request object or the init object.
  // If present in both places, the init object must be used.
  //
  var init = args[1];
  var initHeaders = (_init = init) === null || _init === void 0 ? void 0 : _init.headers;
  var reqHeaders = isRequestObject(args[0]) && args[0].headers;
  var headers = initHeaders || reqHeaders;

  // If headers are not present in either place, they are added to the init object.
  // If there is no init object, one must be created and added to args.
  if (!headers) {
    if (!init) {
      args[1] = init = {};
    }
    headers = init.headers = {};
  }

  // `headers` may be a Headers object or a plain object.
  if (headers instanceof Headers) {
    for (var _i = 0, _Object$keys = Object.keys(newHeaders); _i < _Object$keys.length; _i++) {
      var key = _Object$keys[_i];
      headers.append(key, newHeaders[key]);
    }
  } else if (isObject(headers)) {
    for (var _i2 = 0, _Object$keys2 = Object.keys(newHeaders); _i2 < _Object$keys2.length; _i2++) {
      var _key = _Object$keys2[_i2];
      headers[_key] = newHeaders[_key];
    }
  }
}
function getSessionIdFromAsyncLocalStorage(client) {
  var storage = client.asyncLocalStorage;
  if (!storage || typeof storage.getStore !== 'function') {
    return null;
  }
  var store = storage.getStore();
  return (store === null || store === void 0 ? void 0 : store.sessionId) || null;
}
var LOG_METHODS = ['log', 'debug', 'info', 'warn', 'warning', 'error', 'critical'];

/*
 * bindLogMethods - Give an instance its own copies of the level methods that
 * keep `this` pointing at the instance, so they still work when detached,
 * e.g. `promise.catch(rollbar.error)` or `const { error } = rollbar`.
 * Each copy looks the method up on the prototype at call time, so subclass
 * overrides and stubs on the prototype still apply.
 *
 * @param instance - a Rollbar instance
 */
function bindLogMethods(instance) {
  LOG_METHODS.forEach(function (method) {
    instance[method] = function () {
      return Object.getPrototypeOf(instance)[method].apply(instance, arguments);
    };
  });
}

;// ./src/utility/commonjsDefault.js


/**
 * Adds a non-enumerable `default` property that points back at `value`.
 *
 * The CommonJS and UMD bundles export the Rollbar constructor itself as
 * `module.exports`, which is what `require('rollbar')` expects. TypeScript with
 * `esModuleInterop` off (its default for `"module": "commonjs"`) compiles
 * `import Rollbar from 'rollbar'` to `require('rollbar').default` instead, and
 * `index.d.ts` declares a default export, so that form type-checks and then
 * throws `rollbar_1.default is not a constructor` at runtime. Exposing both
 * shapes lets either form construct Rollbar.
 *
 * See https://github.com/rollbar/rollbar.js/issues/1089.
 *
 * @param {Function} value - The value a bundle exports as `module.exports`.
 * @returns {Function} The same value, for use in an `export default` statement.
 */
function withCommonJSDefault(value) {
  if (!hasOwn(value, 'default')) {
    Object.defineProperty(value, 'default', {
      value: value,
      configurable: true,
      writable: true
    });
  }
  return value;
}
/* harmony default export */ var commonjsDefault = (withCommonJSDefault);
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
      if (hasOwn(obj, k)) {
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
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || scrub_unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function scrub_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = scrub_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function scrub_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return scrub_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? scrub_arrayLikeToArray(r, a) : void 0; } }
function scrub_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
;

function scrub(data, scrubFields, scrubPaths) {
  scrubFields = scrubFields || [];
  if (scrubPaths) {
    var _iterator = scrub_createForOfIteratorHelper(scrubPaths),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var path = _step.value;
        scrubPath(data, path);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  var paramRes = _getScrubFieldRegexs(scrubFields);
  var queryRes = _getScrubQueryParamRegexs(scrubFields);
  function redactQueryParam(dummy0, paramPart) {
    return paramPart + redact();
  }
  function paramScrubber(v) {
    if (isType(v, 'string')) {
      var _iterator2 = scrub_createForOfIteratorHelper(queryRes),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var regex = _step2.value;
          v = v.replace(regex, redactQueryParam);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
    return v;
  }
  function valScrubber(k, v) {
    var _iterator3 = scrub_createForOfIteratorHelper(paramRes),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var regex = _step3.value;
        if (regex.test(k)) {
          v = redact();
          break;
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
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
    var _iterator4 = scrub_createForOfIteratorHelper(keys.entries()),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var _step4$value = _slicedToArray(_step4.value, 2),
          index = _step4$value[0],
          key = _step4$value[1];
        if (index < last) {
          obj = obj[key];
        } else {
          obj[key] = redact();
        }
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
  } catch (_e) {
    // Missing key is OK;
  }
}
function _getScrubFieldRegexs(scrubFields) {
  var ret = [];
  var _iterator5 = scrub_createForOfIteratorHelper(scrubFields),
    _step5;
  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var field = _step5.value;
      var pat = '^\\[?(%5[bB])?' + field + '\\[?(%5[bB])?\\]?(%5[dD])?$';
      ret.push(new RegExp(pat, 'i'));
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
  return ret;
}
function _getScrubQueryParamRegexs(scrubFields) {
  var ret = [];
  var _iterator6 = scrub_createForOfIteratorHelper(scrubFields),
    _step6;
  try {
    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
      var field = _step6.value;
      var pat = '\\[?(%5[bB])?' + field + '\\[?(%5[bB])?\\]?(%5[dD])?';
      ret.push(new RegExp('(' + pat + '=)([^&\\n]+)', 'igm'));
    }
  } catch (err) {
    _iterator6.e(err);
  } finally {
    _iterator6.f();
  }
  return ret;
}
/* harmony default export */ var src_scrub = (scrub);
;// ./src/telemetry.js
var _excluded = ["otelAttributes"];
function telemetry_typeof(o) { "@babel/helpers - typeof"; return telemetry_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, telemetry_typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == telemetry_typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != telemetry_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != telemetry_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
;
var MAX_EVENTS = 100;

// Upper bound on events held by the `rollbar-telemetry` span. The span is only
// ended (and its events released) when Session Replay exports it, so without a
// cap it grows for the lifetime of the page. The bound is larger than
// MAX_EVENTS so a replay's default 300s pre-duration keeps its telemetry
// timeline on busy pages.
var MAX_SPAN_EVENTS = 1000;

// Temporary workaround while solving commonjs -> esm issues in Node 18 - 20.
function fromMillis(millis) {
  return [Math.trunc(millis / 1000), Math.round(millis % 1000 * 1e6)];
}
var Telemeter = /*#__PURE__*/function () {
  function Telemeter(options, tracing) {
    _classCallCheck(this, Telemeter);
    this.queue = [];
    this.options = merge(options);
    var maxTelemetryEvents = this.options.maxTelemetryEvents || MAX_EVENTS;
    this.maxQueueSize = Math.max(0, Math.min(maxTelemetryEvents, MAX_EVENTS));
    this.tracing = tracing;
    this.telemetrySpan = this.startTelemetrySpan();
  }
  return _createClass(Telemeter, [{
    key: "startTelemetrySpan",
    value: function startTelemetrySpan() {
      var _this$tracing;
      return (_this$tracing = this.tracing) === null || _this$tracing === void 0 ? void 0 : _this$tracing.startSpan('rollbar-telemetry', {
        maxEvents: MAX_SPAN_EVENTS
      });
    }
  }, {
    key: "configure",
    value: function configure(options) {
      var oldOptions = this.options;
      this.options = merge(oldOptions, options);
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
        } catch (_e) {
          this.options.filterTelemetry = null;
        }
      }

      // Filter until supported in legacy telemetry
      events = events.filter(function (e) {
        return e.type !== 'connectivity';
      });

      // Remove internal keys from output
      events = events.map(function (_ref) {
        var _otelAttributes = _ref.otelAttributes,
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
        this.telemetrySpan = this.startTelemetrySpan();
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
        timestamp_ms: timestamp || now(),
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
      } catch (_exc) {
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
      var _this$telemetrySpan2;
      var event = rollbarUUID ? 'rollbar-occurrence-event' : 'rollbar-log-event';
      var otelAttributes = _objectSpread({
        message: message,
        level: level
      }, rollbarUUID ? {
        type: 'message',
        uuid: rollbarUUID
      } : {});
      (_this$telemetrySpan2 = this.telemetrySpan) === null || _this$telemetrySpan2 === void 0 || _this$telemetrySpan2.addEvent(event, otelAttributes, fromMillis(timestamp));
      return this.capture('log', {
        message: message
      }, level, rollbarUUID, timestamp, otelAttributes);
    }
  }, {
    key: "captureNetwork",
    value: function captureNetwork(metadata, subtype, rollbarUUID, requestData) {
      var _metadata$response, _metadata$response2, _this$telemetrySpan3;
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
      var requestBody = metadata.request;
      var responseBody = (_metadata$response2 = metadata.response) === null || _metadata$response2 === void 0 ? void 0 : _metadata$response2.body;
      if (requestBody) {
        otelAttributes['request.body'] = JSON.stringify(requestBody);
      }
      if (responseBody) {
        otelAttributes['response.body'] = JSON.stringify(responseBody);
      }
      (_this$telemetrySpan3 = this.telemetrySpan) === null || _this$telemetrySpan3 === void 0 || _this$telemetrySpan3.addEvent('rollbar-network-event', otelAttributes, fromMillis(metadata.start_time_ms));
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
      var _this$telemetrySpan4;
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
      (_this$telemetrySpan4 = this.telemetrySpan) === null || _this$telemetrySpan4 === void 0 || _this$telemetrySpan4.addEvent(name, otelAttributes, fromMillis(timestamp));
      return this.capture('dom', metadata, 'info', null, timestamp, otelAttributes);
    }
  }, {
    key: "captureClick",
    value: function captureClick(_ref3) {
      var _this$telemetrySpan5;
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
      (_this$telemetrySpan5 = this.telemetrySpan) === null || _this$telemetrySpan5 === void 0 || _this$telemetrySpan5.addEvent(name, otelAttributes, fromMillis(timestamp));
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
      var _this$telemetrySpan6;
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
      (_this$telemetrySpan6 = this.telemetrySpan) === null || _this$telemetrySpan6 === void 0 || _this$telemetrySpan6.addEvent(name, otelAttributes, fromMillis(timestamp));
      return this.capture('dom', metadata, 'info', null, timestamp, otelAttributes);
    }
  }, {
    key: "captureResize",
    value: function captureResize(_ref5) {
      var _this$telemetrySpan7;
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
      (_this$telemetrySpan7 = this.telemetrySpan) === null || _this$telemetrySpan7 === void 0 || _this$telemetrySpan7.addEvent(name, otelAttributes, fromMillis(timestamp));
      return this.capture('dom', metadata, 'info', null, timestamp, otelAttributes);
    }
  }, {
    key: "captureDragDrop",
    value: function captureDragDrop(_ref6) {
      var _this$telemetrySpan8;
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
        metadata = _objectSpread(_objectSpread({}, metadata), {}, {
          element: element,
          dropEffect: dropEffect,
          effectAllowed: effectAllowed
        });
        otelAttributes = _objectSpread(_objectSpread({}, otelAttributes), {}, {
          element: element,
          dropEffect: dropEffect,
          effectAllowed: effectAllowed
        });
      }
      if (type === 'drop') {
        metadata = _objectSpread(_objectSpread({}, metadata), {}, {
          element: element,
          dropEffect: dropEffect,
          effectAllowed: effectAllowed,
          kinds: kinds,
          mediaTypes: mediaTypes
        });
        otelAttributes = _objectSpread(_objectSpread({}, otelAttributes), {}, {
          element: element,
          dropEffect: dropEffect,
          effectAllowed: effectAllowed,
          kinds: kinds,
          mediaTypes: mediaTypes
        });
      }
      (_this$telemetrySpan8 = this.telemetrySpan) === null || _this$telemetrySpan8 === void 0 || _this$telemetrySpan8.addEvent(name, otelAttributes, fromMillis(timestamp));
      return this.capture('dom', metadata, 'info', null, timestamp, otelAttributes);
    }
  }, {
    key: "captureNavigation",
    value: function captureNavigation(from, to, rollbarUUID, timestamp) {
      var _this$telemetrySpan9;
      (_this$telemetrySpan9 = this.telemetrySpan) === null || _this$telemetrySpan9 === void 0 || _this$telemetrySpan9.addEvent('rollbar-navigation-event', {
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
      var _this$telemetrySpan0;
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
      (_this$telemetrySpan0 = this.telemetrySpan) === null || _this$telemetrySpan0 === void 0 || _this$telemetrySpan0.addEvent(name, otelAttributes, fromMillis(timestamp));
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
;
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
function hrtime_now() {
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
  now: hrtime_now,
  isHrTime: isHrTime
});
;// ./src/tracing/exporter.js
function exporter_typeof(o) { "@babel/helpers - typeof"; return exporter_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, exporter_typeof(o); }
function exporter_slicedToArray(r, e) { return exporter_arrayWithHoles(r) || exporter_iterableToArrayLimit(r, e) || exporter_unsupportedIterableToArray(r, e) || exporter_nonIterableRest(); }
function exporter_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function exporter_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function exporter_arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function exporter_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = exporter_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || exporter_unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function exporter_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return exporter_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? exporter_arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return exporter_arrayLikeToArray(r); }
function exporter_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function exporter_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function exporter_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, exporter_toPropertyKey(o.key), o); } }
function exporter_createClass(e, r, t) { return r && exporter_defineProperties(e.prototype, r), t && exporter_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function exporter_toPropertyKey(t) { var i = exporter_toPrimitive(t, "string"); return "symbol" == exporter_typeof(i) ? i : i + ""; }
function exporter_toPrimitive(t, r) { if ("object" != exporter_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != exporter_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
;

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
      spanExportQueue.push.apply(spanExportQueue, _toConsumableArray(spans));
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
;
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

      // eslint-disable-next-line no-console
      console[level].apply(console, args);
    };
  }
};
/* harmony default export */ var src_logger = (logger);
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
;
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
;
var Span = /*#__PURE__*/function () {
  function Span(options) {
    span_classCallCheck(this, Span);
    this.usePerformance = options.usePerformance;
    this.maxEvents = options.maxEvents;
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

    /**
     * Adds an event to the span.
     *
     * When the span was started with a positive `maxEvents`, the events list
     * behaves as a ring buffer: once full, the oldest event is dropped and
     * `droppedEventsCount` is incremented, so a long-lived span stays bounded.
     *
     * @param {string} name - Event name
     * @param {Object} [attributes] - Event attributes
     * @param {Array<number>} [time] - Event time as an hrtime tuple
     * @returns {Span} This span
     */
  }, {
    key: "addEvent",
    value: function addEvent(name) {
      var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var time = arguments.length > 2 ? arguments[2] : undefined;
      if (this.span.ended) return this;
      if (this.maxEvents > 0 && this.span.events.length >= this.maxEvents) {
        this.span.events.shift();
        this.span.droppedEventsCount++;
      }
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
;

var Tracer = /*#__PURE__*/function () {
  function Tracer(tracing, spanProcessor) {
    tracer_classCallCheck(this, Tracer);
    this.spanProcessor = spanProcessor;
    this.tracing = tracing;
  }
  return tracer_createClass(Tracer, [{
    key: "startSpan",
    value: function startSpan(name) {
      var _this$tracing$resourc, _options$resource, _this$tracing$session;
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
        session: (_this$tracing$session = this.tracing.session) === null || _this$tracing$session === void 0 ? void 0 : _this$tracing$session.session,
        context: context,
        spanContext: spanContext,
        name: name,
        kind: kind,
        parentSpanId: parentSpanId,
        spanProcessor: this.spanProcessor,
        startTime: options.startTime,
        usePerformance: options.usePerformance,
        maxEvents: options.maxEvents
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
;





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

;// ./src/truncation.js
function truncation_slicedToArray(r, e) { return truncation_arrayWithHoles(r) || truncation_iterableToArrayLimit(r, e) || truncation_unsupportedIterableToArray(r, e) || truncation_nonIterableRest(); }
function truncation_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function truncation_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function truncation_arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function truncation_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = truncation_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function truncation_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return truncation_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? truncation_arrayLikeToArray(r, a) : void 0; } }
function truncation_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
;

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
    var _iterator = truncation_createForOfIteratorHelper(chain),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var trace = _step.value;
        frames = trace.frames;
        frames = selectFrames(frames, range);
        trace.frames = frames;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
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
    var _iterator2 = truncation_createForOfIteratorHelper(chain.entries()),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _step2$value = truncation_slicedToArray(_step2.value, 2),
          index = _step2$value[0],
          trace = _step2$value[1];
        chain[index] = truncateTraceData(trace);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
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
  var gWindow = typeof window !== 'undefined' && window || typeof self !== 'undefined' && self;
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
function api_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function api_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? api_ownKeys(Object(t), !0).forEach(function (r) { api_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : api_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function api_defineProperty(e, r, t) { return (r = api_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function api_typeof(o) { "@babel/helpers - typeof"; return api_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, api_typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function api_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function api_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, api_toPropertyKey(o.key), o); } }
function api_createClass(e, r, t) { return r && api_defineProperties(e.prototype, r), t && api_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function api_toPropertyKey(t) { var i = api_toPrimitive(t, "string"); return "symbol" == api_typeof(i) ? i : i + ""; }
function api_toPrimitive(t, r) { if ("object" != api_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != api_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
;

var defaultOptions = {
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
 * Api encapsulates methods of communicating with the Rollbar API.  It is a
 * standard interface with some parts implemented differently for server or
 * browser contexts.  It is an object that should be instantiated when used so
 * it can contain non-global options that may be different for another instance
 * of RollbarApi.
 */
var Api = /*#__PURE__*/function () {
  /**
   * @param {Object} options - Configuration supplied from the parent Rollbar instance.
   * @param {string} options.accessToken - Token used to authenticate API calls.
   * @param {string} [options.endpoint] - Optional fully qualified URL overriding
   *   the default `https://api.rollbar.com/api/1/item`.
   * @param {Object} [options.proxy] - Optional proxy descriptor containing:
   *   `host`/`hostname` (required), `port`, and `protocol`.
   * @param {Object} transport - Adapter implementing `post` and `postJsonPayload`.
   * @param {Object} urllib - Minimal URL helper used for option normalization.
   * @param {Object} truncation - Optional truncation helper for payload size enforcement.
   */
  function Api(options, transport, urllib, truncation) {
    api_classCallCheck(this, Api);
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
  return api_createClass(Api, [{
    key: "_postPromise",
    value: function _postPromise(_ref) {
      var _this = this;
      var accessToken = _ref.accessToken,
        options = _ref.options,
        payload = _ref.payload,
        headers = _ref.headers;
      return new Promise(function (resolve, reject) {
        _this.transport.post({
          accessToken: accessToken,
          options: options,
          payload: payload,
          headers: headers,
          callback: function callback(err, resp) {
            return err ? reject(err) : resolve(resp);
          }
        });
      });
    }

    /**
     *
     * @param data
     * @param callback
     */
  }, {
    key: "postItem",
    value: function postItem(data, callback) {
      var _this2 = this;
      var options = apiUtility_transportOptions(this.transportOptions, 'POST');
      var payload = buildPayload(data);

      // ensure the network request is scheduled after the current tick.
      setTimeout(function () {
        _this2.transport.post({
          accessToken: _this2.accessToken,
          options: options,
          payload: payload,
          callback: callback
        });
      }, 0);
    }

    /**
     * Posts spans to the Rollbar API using the session endpoint
     *
     * @param {Array} payload - The spans to send
     * @returns {Promise<Object>} A promise that resolves with the API response
     */
  }, {
    key: "postSpans",
    value: (function () {
      var _postSpans = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(payload) {
        var headers,
          options,
          _args = arguments;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              headers = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
              options = apiUtility_transportOptions(this.OTLPTransportOptions, 'POST');
              return _context.a(2, this._postPromise({
                accessToken: this.accessToken,
                options: options,
                payload: payload,
                headers: headers
              }));
          }
        }, _callee, this);
      }));
      function postSpans(_x) {
        return _postSpans.apply(this, arguments);
      }
      return postSpans;
    }()
    /**
     *
     * @param data
     * @param callback
     */
    )
  }, {
    key: "buildJsonPayload",
    value: function buildJsonPayload(data, callback) {
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
    }

    /**
     *
     * @param jsonPayload
     * @param callback
     */
  }, {
    key: "postJsonPayload",
    value: function postJsonPayload(jsonPayload, callback) {
      var transportOptions = apiUtility_transportOptions(this.transportOptions, 'POST');
      this.transport.postJsonPayload(this.accessToken, transportOptions, jsonPayload, callback);
    }
  }, {
    key: "configure",
    value: function configure(options) {
      var oldOptions = this.options;
      this.options = merge(oldOptions, options);
      this.transportOptions = _getTransport(this.options, this.url);
      this.OTLPTransportOptions = _getOTLPTransport(this.options, this.url);
      if (this.options.accessToken !== undefined) {
        this.accessToken = this.options.accessToken;
      }
      return this;
    }
  }]);
}();
function _getTransport(options, url) {
  return getTransportFromOptions(options, defaultOptions, url);
}
function _getOTLPTransport(options, url) {
  var _options$tracing;
  options = api_objectSpread(api_objectSpread({}, options), {}, {
    endpoint: (_options$tracing = options.tracing) === null || _options$tracing === void 0 ? void 0 : _options$tracing.endpoint
  });
  return getTransportFromOptions(options, OTLPDefaultOptions, url);
}
/* harmony default export */ var src_api = (Api);
;// ./src/defaults.js
/**
 * Default options shared across platforms
 */
var version = '4.2.1';
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
/* harmony default export */ var defaults = ({
  version: version,
  endpoint: endpoint,
  logLevel: logLevel,
  reportLevel: reportLevel,
  uncaughtErrorLevel: uncaughtErrorLevel,
  maxItems: maxItems,
  itemsPerMin: itemsPerMin
});
;// ./node_modules/error-stack-parser-es/dist/lite.mjs
var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code\])?$/;
function parse(error, options) {
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
/* unused harmony import specifier */ var parseV8OrIE$1;
/* unused harmony import specifier */ var parseFFOrSafari$1;
/* unused harmony import specifier */ var parseOpera$1;
/* unused harmony import specifier */ var parseOpera9$1;
/* unused harmony import specifier */ var parseOpera10$1;
/* unused harmony import specifier */ var parseOpera11$1;


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
  return stackframesLiteToStackframes(parse(error, options));
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
    } catch (_e) {
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
;// ./src/predicates.js
function predicates_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = predicates_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function predicates_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return predicates_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? predicates_arrayLikeToArray(r, a) : void 0; } }
function predicates_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
;
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

/**
 * Copies an item's original log arguments into a new array for a user hook.
 *
 * Log methods store their `arguments` object, which has no array methods,
 * but the hooks are typed as receiving `LogArgument[]`. Each hook gets its
 * own copy so that changes one hook makes don't reach the next.
 *
 * @param {ArrayLike<*>|undefined} args - The item's `_originalArgs`.
 * @returns {Array<*>} A new array of the arguments, empty if there are none.
 */
function copyArgs(args) {
  return Array.prototype.slice.call(args || []);
}

/**
 * Creates the predicate that runs the user's `onSendCallback` and
 * `checkIgnore` options.
 *
 * @param {Object} logger - Logger used to report a hook that throws.
 * @returns {function(Object, Object): boolean} A predicate that returns
 *   false when `checkIgnore` asks for the item to be dropped.
 */
function userCheckIgnore(logger) {
  return function (item, settings) {
    var isUncaught = Boolean(item._isUncaught);
    delete item._isUncaught;
    var args = item._originalArgs;
    delete item._originalArgs;
    try {
      if (isFunction(settings.onSendCallback)) {
        settings.onSendCallback(isUncaught, copyArgs(args), item);
      }
    } catch (e) {
      settings.onSendCallback = null;
      logger.error('Error while calling onSendCallback, removing', e);
    }
    try {
      if (isFunction(settings.checkIgnore) && settings.checkIgnore(isUncaught, copyArgs(args), item)) {
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
    } catch (_e
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
    var _iterator = predicates_createForOfIteratorHelper(traceChain),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var trace = _step.value;
        messages.push(get(trace, 'exception.message'));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
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

;// ./src/notifier.js
function notifier_typeof(o) { "@babel/helpers - typeof"; return notifier_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, notifier_typeof(o); }
function notifier_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function notifier_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, notifier_toPropertyKey(o.key), o); } }
function notifier_createClass(e, r, t) { return r && notifier_defineProperties(e.prototype, r), t && notifier_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function notifier_toPropertyKey(t) { var i = notifier_toPrimitive(t, "string"); return "symbol" == notifier_typeof(i) ? i : i + ""; }
function notifier_toPrimitive(t, r) { if ("object" != notifier_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != notifier_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
;

/*
 * Notifier - delegates between the client exposed API, the chain of transforms
 * necessary to turn an item into something that can be sent to Rollbar, and the
 * queue which handles the communcation with the Rollbar API servers.
 */
var Notifier = /*#__PURE__*/function () {
  /**
   *
   * @param {Object} queue - an object that conforms to the interface:
   *    `addItem(item, callback)`
   * @param {Object} options - an object representing the options to be set for
   *    this notifier, this should have any defaults already set by the caller
   */
  function Notifier(queue, options) {
    notifier_classCallCheck(this, Notifier);
    this.queue = queue;
    this.options = options;
    this.transforms = [];
    this.diagnostic = {};
  }

  /**
   * configure - updates the options for this notifier with the passed in object
   *
   * @param {Object} options - an object which gets merged with the current
   *    options set on this notifier
   * @returns this
   */
  return notifier_createClass(Notifier, [{
    key: "configure",
    value: function configure(options) {
      var _this$queue;
      (_this$queue = this.queue) === null || _this$queue === void 0 || _this$queue.configure(options);
      var oldOptions = this.options;
      this.options = merge(oldOptions, options);
      return this;
    }

    /**
     * Adds a transform onto the end of the queue of transforms for this notifier
     *
     * @param {Function} transform - a function which takes three arguments:
     *    - item: An Object representing the data to eventually be sent to Rollbar
     *    - options: The current value of the options for this notifier
     *    - callback: `function(err: (Null|Error), item: (Null|Object))` the
     *      transform must call this callback with a null value for error if it
     *      wants the processing chain to continue, otherwise with an error to
     *      terminate the processing. The item should be the updated item after
     *      this transform is finished modifying it.
     */
  }, {
    key: "addTransform",
    value: function addTransform(transform) {
      if (isFunction(transform)) {
        this.transforms.push(transform);
      }
      return this;
    }

    /**
     * The internal log function which applies the configured transforms and then
     * pushes onto the queue to be sent to the backend.
     *
     * @param {Object} item - An object with the following structure:
     *    - message [String] - An optional string to be sent to rollbar
     *    - error [Error] - An optional error
     * @param {Function} callback - A function of type `function(err, resp)` which
     *    will be called with exactly one null argument and one non-null argument.
     *    The callback will be called once, either during the transform stage if
     *    an error occurs inside a transform, or in response to the communication
     *    with the backend. The second argument will be the response from the
     *    backend in case of success.
     */
  }, {
    key: "log",
    value: function log(item, callback) {
      var _this = this;
      callback = isFunction(callback) ? callback : function () {};
      if (!this.options.enabled) {
        return callback(new Error('Rollbar is not enabled'), null);
      }
      this.queue.addPendingItem(item);
      var originalError = item.err;
      this._applyTransforms(item, function (err, i) {
        if (err) {
          _this.queue.removePendingItem(item);
          return callback(err, null);
        }
        _this.queue.addItem(i, callback, originalError, item);
      });
    }

    /* Internal */

    /**
     * Applies the transforms that have been added to this notifier sequentially.
     * See `addTransform` for more information.
     *
     * @param {Object} item - An item to be transformed
     * @param {Function} callback - A function of type `function(err, item)` which
     *    will be called with a non-null error and a null item in the case of a
     *    transform failure, or a null error and non-null item after all
     *    transforms have been applied.
     */
  }, {
    key: "_applyTransforms",
    value: function _applyTransforms(item, callback) {
      var transformIndex = -1;
      var transformsLength = this.transforms.length;
      var transforms = this.transforms;
      var options = this.options;
      var _next = function next(err, i) {
        if (err) {
          callback(err, null);
          return;
        }
        transformIndex++;
        if (transformIndex === transformsLength) {
          callback(null, i);
          return;
        }
        transforms[transformIndex](i, options, _next);
      };
      _next(null, item);
    }
  }]);
}();

;// ./src/queue.js
function queue_typeof(o) { "@babel/helpers - typeof"; return queue_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, queue_typeof(o); }
function queue_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function queue_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, queue_toPropertyKey(o.key), o); } }
function queue_createClass(e, r, t) { return r && queue_defineProperties(e.prototype, r), t && queue_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function queue_defineProperty(e, r, t) { return (r = queue_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function queue_toPropertyKey(t) { var i = queue_toPrimitive(t, "string"); return "symbol" == queue_typeof(i) ? i : i + ""; }
function queue_toPrimitive(t, r) { if ("object" != queue_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != queue_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
;

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
    queue_classCallCheck(this, Queue);
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
  return queue_createClass(Queue, [{
    key: "configure",
    value: function configure(options) {
      var _this$api;
      (_this$api = this.api) === null || _this$api === void 0 || _this$api.configure(options);
      var oldOptions = this.options;
      this.options = merge(oldOptions, options);
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
queue_defineProperty(Queue, "RETRIABLE_ERRORS", ['ECONNRESET', 'ENOTFOUND', 'ESOCKETTIMEDOUT', 'ETIMEDOUT', 'ECONNREFUSED', 'EHOSTUNREACH', 'EPIPE', 'EAI_AGAIN']);
/* harmony default export */ var queue = (Queue);
;// ./src/rateLimiter.js
function rateLimiter_typeof(o) { "@babel/helpers - typeof"; return rateLimiter_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, rateLimiter_typeof(o); }
function _readOnlyError(r) { throw new TypeError('"' + r + '" is read-only'); }
function rateLimiter_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function rateLimiter_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, rateLimiter_toPropertyKey(o.key), o); } }
function rateLimiter_createClass(e, r, t) { return r && rateLimiter_defineProperties(e.prototype, r), t && rateLimiter_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function rateLimiter_defineProperty(e, r, t) { return (r = rateLimiter_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function rateLimiter_toPropertyKey(t) { var i = rateLimiter_toPrimitive(t, "string"); return "symbol" == rateLimiter_typeof(i) ? i : i + ""; }
function rateLimiter_toPrimitive(t, r) { if ("object" != rateLimiter_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != rateLimiter_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*
 * RateLimiter - encapsulates the logic for counting items sent to Rollbar.
 *
 * @param options - the same options that are accepted by configureGlobal offered as a convenience
 */
var RateLimiter = /*#__PURE__*/function () {
  function RateLimiter() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    rateLimiter_classCallCheck(this, RateLimiter);
    this.startTime = Date.now();
    this.counter = 0;
    this.perMinCounter = 0;
    this.platform = null;
    this.platformOptions = {};
    this.configureGlobal(options);
  }

  /*
   * configureGlobal - set the global rate limiter options
   *
   * @param options - Only the following values are recognized:
   *    startTime: a timestamp of the form returned by (new Date()).getTime()
   *    maxItems: the maximum items
   *    itemsPerMinute: the max number of items to send in a given minute
   */
  return rateLimiter_createClass(RateLimiter, [{
    key: "configureGlobal",
    value: function configureGlobal() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var startTime = options.startTime,
        maxItems = options.maxItems,
        itemsPerMinute = options.itemsPerMinute;
      if (startTime !== undefined) {
        RateLimiter.globalSettings.startTime = startTime;
      }
      if (maxItems !== undefined) {
        RateLimiter.globalSettings.maxItems = maxItems;
      }
      if (itemsPerMinute !== undefined) {
        RateLimiter.globalSettings.itemsPerMinute = itemsPerMinute;
      }
    }

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
  }, {
    key: "shouldSend",
    value: function shouldSend(item) {
      var now = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Date.now();
      var elapsedTime = now - this.startTime;
      if (elapsedTime < 0 || elapsedTime >= 60000) {
        this.startTime = now;
        this.perMinCounter = 0;
      }
      var globalRateLimit = RateLimiter.globalSettings.maxItems;
      var globalRateLimitPerMin = RateLimiter.globalSettings.itemsPerMinute;
      if (checkRate(item, globalRateLimit, this.counter)) {
        return shouldSendValue(this.platform, this.platformOptions, "".concat(globalRateLimit, " max items reached"), false);
      }
      if (checkRate(item, globalRateLimitPerMin, this.perMinCounter)) {
        return shouldSendValue(this.platform, this.platformOptions, "".concat(globalRateLimitPerMin, " items per minute reached"), false);
      }
      this.counter += 1;
      this.perMinCounter += 1;
      var underGlobalLimit = !checkRate(item, globalRateLimit, this.counter);
      var perMinute = underGlobalLimit;
      var shouldSend = underGlobalLimit && !checkRate(item, globalRateLimitPerMin, this.perMinCounter);
      return shouldSendValue(this.platform, this.platformOptions, null, shouldSend, globalRateLimit, globalRateLimitPerMin, perMinute);
    }
  }, {
    key: "setPlatformOptions",
    value: function setPlatformOptions(platform, options) {
      this.platform = platform;
      this.platformOptions = options;
    }
  }]);
}();
/* Helpers */
rateLimiter_defineProperty(RateLimiter, "globalSettings", {
  startTime: Date.now(),
  maxItems: undefined,
  itemsPerMinute: undefined
});
function checkRate(item, limit, counter) {
  return !item.ignoreRateLimit && limit >= 1 && counter > limit;
}
function shouldSendValue(platform, options, error, shouldSend, globalRateLimit, limitPerMin, perMinute) {
  var payload = null;
  var errorResult = error ? new Error(error) : null;
  if (!errorResult && !shouldSend) {
    payload = rateLimitPayload(platform, options, globalRateLimit, limitPerMin, perMinute);
  }
  return {
    error: errorResult,
    shouldSend: shouldSend,
    payload: payload
  };
}
function rateLimitPayload(platform, options, globalRateLimit, limitPerMin, perMinute) {
  var environment = options.environment || options.payload && options.payload.environment;
  var msg = perMinute ? 'item per minute limit reached, ignoring errors until timeout' : 'maxItems has been hit, ignoring errors until reset.';
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
;// ./src/rollbar.js





/*
 * Rollbar - the interface to Rollbar
 *
 * @param options
 * @param api
 * @param logger
 */
function Rollbar(options, api, logger, telemeter, tracing, replay, platform) {
  this.options = merge(options);
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
  this.notifier = new Notifier(this.queue, this.options);
  this.telemeter = telemeter;
  setStackTraceLimit(options);
  this.lastError = null;
  this.lastErrorHash = 'none';
}
var rollbar_defaultOptions = {
  maxItems: 0,
  itemsPerMinute: 60
};
Rollbar.rateLimiter = new rateLimiter(rollbar_defaultOptions);
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
  this.options = merge(oldOptions, options, payload);

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
    this._addItemAttributes(item);

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
Rollbar.prototype._addItemAttributes = function (item) {
  var _this$tracing, _this$tracing2;
  var span = (_this$tracing = this.tracing) === null || _this$tracing === void 0 ? void 0 : _this$tracing.getSpan();
  var asyncLocalSessionId = getSessionIdFromAsyncLocalStorage(this);
  var sessionId = asyncLocalSessionId || ((_this$tracing2 = this.tracing) === null || _this$tracing2 === void 0 ? void 0 : _this$tracing2.sessionId);
  var attributes = [{
    key: 'session_id',
    value: sessionId
  }, {
    key: 'span_id',
    value: span === null || span === void 0 ? void 0 : span.spanId
  }, {
    key: 'trace_id',
    value: span === null || span === void 0 ? void 0 : span.traceId
  }];
  if (item._isUncaught) {
    attributes.push({
      key: 'is_uncaught',
      value: 'true'
    });
  }
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
/* harmony default export */ var rollbar = (Rollbar);
;// ./src/tracing/defaults.js
/**
 * Default tracing options
 */
/* harmony default export */ var tracing_defaults = ({
  enabled: false,
  endpoint: 'api.rollbar.com/api/1/session/'
});
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
  item.data = merge(item.data, payloadOptions);
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
    var newExtra = merge(extra, {
      message: item.message
    });
    set(item, tracePath + '.extra', newExtra);
  }
  callback(null, item);
}
function userTransform(logger) {
  return function (item, options, callback) {
    var newItem = merge(item);
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
  var diagnostic = merge(item.notifier.client.notifier.diagnostic, item.diagnostic);
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
  item.data.notifier.diagnostic = merge(item.data.notifier.diagnostic, diagnostic);
  callback(null, item);
}

;// ./src/browser/defaults.js
function defaults_toConsumableArray(r) { return defaults_arrayWithoutHoles(r) || defaults_iterableToArray(r) || defaults_unsupportedIterableToArray(r) || defaults_nonIterableSpread(); }
function defaults_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function defaults_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return defaults_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? defaults_arrayLikeToArray(r, a) : void 0; } }
function defaults_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function defaults_arrayWithoutHoles(r) { if (Array.isArray(r)) return defaults_arrayLikeToArray(r); }
function defaults_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * Default browser options
 */
;
var scrubFields = [].concat(defaults_toConsumableArray(commonScrubFields), ['cc-number', 'card number', 'cardnumber', 'cardnum', 'ccnum', 'ccnumber', 'cc num', 'creditcardnumber', 'credit card number', 'newcreditcardnumber', 'new credit card', 'creditcardno', 'credit card no', 'card#', 'card #', 'cc-csc', 'cvc', 'cvc2', 'cvv2', 'ccv2', 'security code', 'card verification', 'name on credit card', 'name on card', 'nameoncard', 'cardholder', 'card holder', 'name des karteninhabers', 'ccname', 'card type', 'cardtype', 'cc type', 'cctype', 'payment type', 'expiration date', 'expirationdate', 'expdate', 'cc-exp', 'ccmonth', 'ccyear']);

// For compatibility with existing code that expects default export with scrubFields property
/* harmony default export */ var browser_defaults = ({
  scrubFields: scrubFields
});
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
    } catch (_e) {
      reason = undefined;
    }
    try {
      promise = evt.promise;
    } catch (_e) {
      promise = '[unhandledrejection] error getting `promise` from event';
    }
    try {
      detail = evt.detail;
      if (!reason && detail) {
        reason = detail.reason;
        promise = detail.promise;
      }
    } catch (_e) {
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

;// ./src/browser/predicates.js

function checkIgnore(item, settings) {
  if (get(settings, 'plugins.jquery.ignoreAjaxErrors')) {
    return !get(item, 'body.message.extra.isAjax');
  }
  return true;
}

// Safari replaces the URLs of extension scripts with webkit-masked-url://hidden/
// in stack traces, so that scheme is treated as an extension too. Scripts an
// extension loads from blob URLs it created appear as blob:<extension-origin>.
var EXTENSION_URL_REGEX = /^(?:blob:)?(?:(?:chrome|moz|safari|safari-web|ms-browser)-extension|webkit-masked-url):\/\//i;
// Any `scheme:` counts as a URL, including blob: and data: scripts. Built-in
// and unknown frames such as `(native)`, `[native code]` and `(unknown)` don't.
var URL_REGEX = /^[a-z][a-z0-9+.-]*:/i;

/**
 * Finds the frame an error was thrown from. Rollbar orders frames with the
 * most recent call last. Frames without a URL, such as `(native)` or
 * `[native code]`, are skipped because they only show that the error passed
 * through a built-in, not where the calling code lives.
 *
 * @param {Object} trace - A Rollbar trace with a `frames` array.
 * @returns {Object|undefined} The originating frame, if one has a URL.
 */
function originatingFrame(trace) {
  var frames = trace && trace.frames;
  if (!frames) {
    return undefined;
  }
  for (var i = frames.length - 1; i >= 0; i--) {
    var filename = frames[i] && frames[i].filename;
    if (isType(filename, 'string') && URL_REGEX.test(filename)) {
      return frames[i];
    }
  }
  return undefined;
}

/**
 * Predicate for the `ignoreBrowserExtensions` option. Drops an error when the
 * frame it was thrown from belongs to a browser extension.
 *
 * Only the originating frame of the primary error is checked. Extensions
 * commonly wrap `addEventListener`, `setTimeout` and `fetch`, so extension
 * frames often sit lower in the stacks of errors thrown by application code;
 * matching any frame, as `hostBlockList` does, would drop those errors.
 *
 * @param {Object} item - The item about to be queued.
 * @param {Object} settings - The current Rollbar options.
 * @returns {boolean} false if the item should be ignored.
 */
function checkBrowserExtension(item, settings) {
  if (!settings.ignoreBrowserExtensions) {
    return true;
  }
  var trace = get(item, 'body.trace') || get(item, 'body.trace_chain.0');
  var frame = originatingFrame(trace);
  return !(frame && EXTENSION_URL_REGEX.test(frame.filename));
}

;// ./src/browser/replay/defaults.js
/**
 * Default session replay recording options
 * See https://github.com/rrweb-io/rrweb/blob/master/guide.md#options for details
 */
/* harmony default export */ var replay_defaults = ({
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
  item.data = merge(item.data, {
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
var USER_AGENT_HIGH_ENTROPY_HINTS = ['architecture', 'bitness', 'fullVersionList', 'model', 'platformVersion'];

/**
 * Formats User-Agent Client Hints values for the item payload.
 *
 * @param {Object} values - A `NavigatorUAData` object or the result of
 *   `getHighEntropyValues()`.
 * @returns {Object} The values with the payload's snake_case keys.
 */
function formatUserAgentData(values) {
  // The browser returns frozen arrays; copy them so transforms and user
  // callbacks that run later can modify the payload.
  var copyBrands = function copyBrands(brands) {
    return brands && brands.map(function (_ref) {
      var brand = _ref.brand,
        version = _ref.version;
      return {
        brand: brand,
        version: version
      };
    });
  };
  return {
    brands: copyBrands(values.brands),
    mobile: values.mobile,
    platform: values.platform,
    platform_version: values.platformVersion,
    architecture: values.architecture,
    bitness: values.bitness,
    model: values.model,
    full_version_list: copyBrands(values.fullVersionList)
  };
}

/**
 * Creates a reader for the browser's User-Agent Client Hints.
 *
 * Chromium browsers freeze the OS version and browser minor version in
 * `navigator.userAgent`; the real values are only exposed through
 * `navigator.userAgentData.getHighEntropyValues()`, which is asynchronous.
 * The high-entropy values are requested once, when the transform is created,
 * so items never wait on them. Items logged before that request resolves get
 * the synchronously available low-entropy values instead.
 *
 * @param {Object} nav - The `navigator` to read from.
 * @returns {Function} Returns the formatted Client Hints, or `undefined` when
 *   the browser doesn't support them.
 */
function userAgentDataReader(nav) {
  var uaData = nav && nav.userAgentData;
  if (!uaData) {
    return function () {
      return undefined;
    };
  }
  var values = uaData;
  if (typeof uaData.getHighEntropyValues === 'function') {
    try {
      uaData.getHighEntropyValues(USER_AGENT_HIGH_ENTROPY_HINTS).then(function (highEntropyValues) {
        values = highEntropyValues;
      },
      // Rejected with NotAllowedError when the browser declines to share
      // the hints; keep the low-entropy values.
      function () {});
    } catch (e) {
      src_logger.error('Error while reading User-Agent Client Hints.', e);
    }
  }

  // Format per item so no two payloads share (and can mutate) the same object.
  return function () {
    return formatUserAgentData(values);
  };
}
function addClientInfo(window) {
  var getUserAgentData = userAgentDataReader(window && window.navigator);
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
        user_agent_data: getUserAgentData(),
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
    result.extra = merge(custom);
  }
  set(item, 'data.body', {
    message: result
  });
  callback(null, item);
}
function stackFromItem(item) {
  var stackInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  // Transform a TraceKit stackInfo object into a Rollbar trace
  var stack = (stackInfo || item.stackInfo).stack;
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
  var stack = stackFromItem(item, stackInfo);
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
      trace.extra = merge(custom);
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

;// ./src/browser/transport/fetch.js
function fetch_typeof(o) { "@babel/helpers - typeof"; return fetch_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, fetch_typeof(o); }
function fetch_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function fetch_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? fetch_ownKeys(Object(t), !0).forEach(function (r) { fetch_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : fetch_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function fetch_defineProperty(e, r, t) { return (r = fetch_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function fetch_toPropertyKey(t) { var i = fetch_toPrimitive(t, "string"); return "symbol" == fetch_typeof(i) ? i : i + ""; }
function fetch_toPrimitive(t, r) { if ("object" != fetch_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != fetch_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
;

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
function xhr_slicedToArray(r, e) { return xhr_arrayWithHoles(r) || xhr_iterableToArrayLimit(r, e) || xhr_unsupportedIterableToArray(r, e) || xhr_nonIterableRest(); }
function xhr_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function xhr_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return xhr_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? xhr_arrayLikeToArray(r, a) : void 0; } }
function xhr_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function xhr_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function xhr_arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/*global XDomainRequest*/

;

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
          var _Object$entries$_i = xhr_slicedToArray(_Object$entries[_i], 2),
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
    } catch (_e1) {
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
    } catch (_e) {
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
  var accessToken = _ref.accessToken,
    options = _ref.options,
    payload = _ref.payload,
    headers = _ref.headers,
    callback = _ref.callback,
    requestFactory = _ref.requestFactory;
  if (!callback || !isFunction(callback)) {
    callback = function callback() {};
  }
  if (!payload) {
    return callback(new Error('Cannot send empty request'));
  }
  var stringifyResult;
  // Check payload.body to ensure only items are truncated.
  if (this.truncation && payload.body) {
    stringifyResult = this.truncation.truncate(payload);
  } else {
    stringifyResult = stringify(payload);
  }
  if (stringifyResult.error) {
    return callback(stringifyResult.error);
  }
  var method = 'POST';
  var url = formatUrl(options);
  this._makeZoneRequest({
    accessToken: accessToken,
    url: url,
    method: method,
    payload: stringifyResult.value,
    headers: headers,
    callback: callback,
    requestFactory: requestFactory,
    timeout: options.timeout,
    transport: options.transport
  });
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
  var _this = this;
  var gWindow = typeof window !== 'undefined' && window || typeof self !== 'undefined' && self;
  // Whenever zone.js is loaded and `Zone` is exposed globally, access
  // the root zone to ensure that requests are always made within it.
  // This approach is framework-agnostic, regardless of which
  // framework zone.js is used with.
  var rootZone = gWindow && gWindow.Zone && gWindow.Zone.root;
  var args = Array.prototype.slice.call(arguments);
  if (rootZone) {
    rootZone.run(function () {
      _this._makeRequest.apply(undefined, args);
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
function url_parse(url) {
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
;
















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
    this.client = client || new rollbar(this.options, api, src_logger, this.telemeter, this.tracing, this.replay, 'browser');
    var gWindow = _gWindow();
    var gDocument = typeof document !== 'undefined' && document;
    this.isChrome = gWindow.chrome && gWindow.chrome.runtime; // check .runtime to avoid Edge browsers
    this.anonymousErrorsPending = 0;
    addTransformsToNotifier(this.client.notifier, this, gWindow);
    addPredicatesToQueue(this.client.queue);
    bindLogMethods(this);
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
      (_this$replay = this.replay) === null || _this$replay === void 0 || _this$replay.configure(this.options.replay);
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
    key: "wait",
    value: function wait(callback) {
      this.client.wait(callback);
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
      var _this = this;
      if (!this.options.inspectAnonymousErrors || !this.isChrome) {
        return;
      }
      var prepareStackTrace = function prepareStackTrace(error, _stack) {
        if (_this.options.inspectAnonymousErrors) {
          if (_this.anonymousErrorsPending) {
            // This is the only known way to detect that onerror saw an anonymous error.
            // It depends on onerror reliably being called before Error.prepareStackTrace,
            // which so far holds true on tested versions of Chrome. If versions of Chrome
            // are tested that behave differently, this logic will need to be updated
            // accordingly.
            _this.anonymousErrorsPending -= 1;
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
            _this.handleUncaughtException(error.message, null, null, null, error);
          }
        }

        // Workaround to ensure stack is preserved for normal errors.
        return error.stack;
      };

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
          for (var prop in f) {
            if (hasOwn(f, prop) && prop !== '_rollbar_wrapped') {
              f._rollbar_wrapped[prop] = f[prop];
            }
          }
        }
        return f._rollbar_wrapped;
      } catch (_e) {
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
  for (var _len0 = arguments.length, args = new Array(_len0), _key0 = 0; _key0 < _len0; _key0++) {
    args[_key0] = arguments[_key0];
  }
  return _Rollbar.callInstance('critical', args);
});
core_defineProperty(core_Rollbar, "buildJsonPayload", function () {
  for (var _len1 = arguments.length, args = new Array(_len1), _key1 = 0; _key1 < _len1; _key1++) {
    args[_key1] = arguments[_key1];
  }
  return _Rollbar.callInstance('buildJsonPayload', args);
});
core_defineProperty(core_Rollbar, "sendJsonPayload", function () {
  for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
    args[_key10] = arguments[_key10];
  }
  return _Rollbar.callInstance('sendJsonPayload', args);
});
core_defineProperty(core_Rollbar, "wait", function () {
  for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
    args[_key11] = arguments[_key11];
  }
  return _Rollbar.callInstance('wait', args);
});
core_defineProperty(core_Rollbar, "wrap", function () {
  for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
    args[_key12] = arguments[_key12];
  }
  return _Rollbar.callInstance('wrap', args);
});
core_defineProperty(core_Rollbar, "captureEvent", function () {
  for (var _len13 = arguments.length, args = new Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
    args[_key13] = arguments[_key13];
  }
  return _Rollbar.callInstance('captureEvent', args);
});
function addTransformsToNotifier(notifier, rollbar, gWindow) {
  notifier.addTransform(handleDomException).addTransform(handleItemWithError).addTransform(ensureItemHasSomethingToSay).addTransform(addBaseInfo).addTransform(addRequestInfo(gWindow)).addTransform(addClientInfo(gWindow)).addTransform(addPluginInfo(gWindow)).addTransform(addBody).addTransform(addMessageWithError).addTransform(addTelemetryData).addTransform(addConfigToPayload).addTransform(addScrubber(rollbar.scrub)).addTransform(addPayloadOptions).addTransform(userTransform(src_logger)).addTransform(addConfiguredOptions).addTransform(addDiagnosticKeys).addTransform(itemToPayload);
}
function addPredicatesToQueue(queue) {
  queue.addPredicate(checkLevel).addPredicate(checkIgnore).addPredicate(checkBrowserExtension).addPredicate(userCheckIgnore(src_logger)).addPredicate(urlIsNotBlockListed(src_logger)).addPredicate(urlIsSafeListed(src_logger)).addPredicate(messageIsIgnored(src_logger));
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
  return typeof window !== 'undefined' && window || typeof self !== 'undefined' && self;
}
var core_defaultOptions = {
  environment: 'unknown',
  version: defaults.version,
  scrubFields: browser_defaults.scrubFields,
  logLevel: defaults.logLevel,
  reportLevel: defaults.reportLevel,
  uncaughtErrorLevel: defaults.uncaughtErrorLevel,
  endpoint: defaults.endpoint,
  verbose: false,
  enabled: true,
  transmit: true,
  sendConfig: false,
  includeItemsInTelemetry: true,
  captureIp: true,
  inspectAnonymousErrors: true,
  ignoreBrowserExtensions: false,
  ignoreDuplicateErrors: true,
  wrapGlobalEventHandlers: false,
  replay: replay_defaults,
  tracing: tracing_defaults
};
/* harmony default export */ var core = (core_Rollbar);
;// ./node_modules/@rrweb/record/dist/record.js
var record_excluded = ["type"];
function record_objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = record_objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function record_objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function record_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return record_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (record_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, record_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, record_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), record_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", record_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), record_regeneratorDefine2(u), record_regeneratorDefine2(u, o, "Generator"), record_regeneratorDefine2(u, n, function () { return this; }), record_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (record_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function record_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } record_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { record_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, record_regeneratorDefine2(e, r, n, t); }
function record_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function record_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { record_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { record_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function record_typeof(o) { "@babel/helpers - typeof"; return record_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, record_typeof(o); }
function record_toConsumableArray(r) { return record_arrayWithoutHoles(r) || record_iterableToArray(r) || record_unsupportedIterableToArray(r) || record_nonIterableSpread(); }
function record_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function record_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function record_arrayWithoutHoles(r) { if (Array.isArray(r)) return record_arrayLikeToArray(r); }
function record_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function record_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? record_ownKeys(Object(t), !0).forEach(function (r) { record_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : record_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function record_slicedToArray(r, e) { return record_arrayWithHoles(r) || record_iterableToArrayLimit(r, e) || record_unsupportedIterableToArray(r, e) || record_nonIterableRest(); }
function record_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function record_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function record_arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function record_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = record_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n2 = 0, F = function F() {}; return { s: F, n: function n() { return _n2 >= r.length ? { done: !0 } : { done: !1, value: r[_n2++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function record_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return record_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? record_arrayLikeToArray(r, a) : void 0; } }
function record_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function record_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function record_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, record_toPropertyKey(o.key), o); } }
function record_createClass(e, r, t) { return r && record_defineProperties(e.prototype, r), t && record_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function record_defineProperty(e, r, t) { return (r = record_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function record_toPropertyKey(t) { var i = record_toPrimitive(t, "string"); return "symbol" == record_typeof(i) ? i : i + ""; }
function record_toPrimitive(t, r) { if ("object" != record_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != record_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// ../types/dist/types.js
var EventType = /* @__PURE__ */function (EventType) {
  EventType[EventType["DomContentLoaded"] = 0] = "DomContentLoaded";
  EventType[EventType["Load"] = 1] = "Load";
  EventType[EventType["FullSnapshot"] = 2] = "FullSnapshot";
  EventType[EventType["IncrementalSnapshot"] = 3] = "IncrementalSnapshot";
  EventType[EventType["Meta"] = 4] = "Meta";
  EventType[EventType["Custom"] = 5] = "Custom";
  EventType[EventType["Plugin"] = 6] = "Plugin";
  EventType[EventType["Asset"] = 7] = "Asset";
  EventType[EventType["Annotation"] = 8] = "Annotation";
  return EventType;
}({});
var IncrementalSource = /* @__PURE__ */function (IncrementalSource) {
  IncrementalSource[IncrementalSource["Mutation"] = 0] = "Mutation";
  IncrementalSource[IncrementalSource["MouseMove"] = 1] = "MouseMove";
  IncrementalSource[IncrementalSource["MouseInteraction"] = 2] = "MouseInteraction";
  IncrementalSource[IncrementalSource["Scroll"] = 3] = "Scroll";
  IncrementalSource[IncrementalSource["ViewportResize"] = 4] = "ViewportResize";
  IncrementalSource[IncrementalSource["Input"] = 5] = "Input";
  IncrementalSource[IncrementalSource["TouchMove"] = 6] = "TouchMove";
  IncrementalSource[IncrementalSource["MediaInteraction"] = 7] = "MediaInteraction";
  IncrementalSource[IncrementalSource["StyleSheetRule"] = 8] = "StyleSheetRule";
  IncrementalSource[IncrementalSource["CanvasMutation"] = 9] = "CanvasMutation";
  IncrementalSource[IncrementalSource["Font"] = 10] = "Font";
  IncrementalSource[IncrementalSource["Log"] = 11] = "Log";
  IncrementalSource[IncrementalSource["Drag"] = 12] = "Drag";
  IncrementalSource[IncrementalSource["StyleDeclaration"] = 13] = "StyleDeclaration";
  IncrementalSource[IncrementalSource["Selection"] = 14] = "Selection";
  IncrementalSource[IncrementalSource["AdoptedStyleSheet"] = 15] = "AdoptedStyleSheet";
  IncrementalSource[IncrementalSource["CustomElement"] = 16] = "CustomElement";
  return IncrementalSource;
}({});
var MouseInteractions = /* @__PURE__ */function (MouseInteractions) {
  MouseInteractions[MouseInteractions["MouseUp"] = 0] = "MouseUp";
  MouseInteractions[MouseInteractions["MouseDown"] = 1] = "MouseDown";
  MouseInteractions[MouseInteractions["Click"] = 2] = "Click";
  MouseInteractions[MouseInteractions["ContextMenu"] = 3] = "ContextMenu";
  MouseInteractions[MouseInteractions["DblClick"] = 4] = "DblClick";
  MouseInteractions[MouseInteractions["Focus"] = 5] = "Focus";
  MouseInteractions[MouseInteractions["Blur"] = 6] = "Blur";
  MouseInteractions[MouseInteractions["TouchStart"] = 7] = "TouchStart";
  MouseInteractions[MouseInteractions["TouchMove_Departed"] = 8] = "TouchMove_Departed";
  MouseInteractions[MouseInteractions["TouchEnd"] = 9] = "TouchEnd";
  MouseInteractions[MouseInteractions["TouchCancel"] = 10] = "TouchCancel";
  return MouseInteractions;
}({});
var PointerTypes = /* @__PURE__ */function (PointerTypes) {
  PointerTypes[PointerTypes["Mouse"] = 0] = "Mouse";
  PointerTypes[PointerTypes["Pen"] = 1] = "Pen";
  PointerTypes[PointerTypes["Touch"] = 2] = "Touch";
  return PointerTypes;
}({});
var CanvasContext = /* @__PURE__ */function (CanvasContext) {
  CanvasContext[CanvasContext["2D"] = 0] = "2D";
  CanvasContext[CanvasContext["WebGL"] = 1] = "WebGL";
  CanvasContext[CanvasContext["WebGL2"] = 2] = "WebGL2";
  return CanvasContext;
}({});
var MediaInteractions = /* @__PURE__ */function (MediaInteractions) {
  MediaInteractions[MediaInteractions["Play"] = 0] = "Play";
  MediaInteractions[MediaInteractions["Pause"] = 1] = "Pause";
  MediaInteractions[MediaInteractions["Seeked"] = 2] = "Seeked";
  MediaInteractions[MediaInteractions["VolumeChange"] = 3] = "VolumeChange";
  MediaInteractions[MediaInteractions["RateChange"] = 4] = "RateChange";
  return MediaInteractions;
}({});
var NodeType = /* @__PURE__ */function (NodeType) {
  NodeType[NodeType["Document"] = 0] = "Document";
  NodeType[NodeType["DocumentType"] = 1] = "DocumentType";
  NodeType[NodeType["Element"] = 2] = "Element";
  NodeType[NodeType["Text"] = 3] = "Text";
  NodeType[NodeType["CDATA"] = 4] = "CDATA";
  NodeType[NodeType["Comment"] = 5] = "Comment";
  return NodeType;
}({});
// ../utils/dist/utils.js
var testableAccessors = {
  Node: ["childNodes", "parentNode", "parentElement", "textContent", "ownerDocument", "firstChild", "lastChild", "nextSibling", "previousSibling"],
  ShadowRoot: ["host", "styleSheets"],
  Element: ["shadowRoot", "querySelector", "querySelectorAll"],
  MutationObserver: []
};
var testableMethods = {
  Node: ["contains", "getRootNode"],
  ShadowRoot: ["getSelection"],
  Element: [],
  MutationObserver: ["constructor"]
};
var untaintedBasePrototype = {};
var untaintedBaseIframeCleanup = {};
var mutationObserverUsers = 0;
function angularZoneUnpatchedAlternative(key) {
  var _globalThis$Zone, _globalThis$Zone$__sy;
  var angularUnpatchedVersionSymbol = globalThis === null || globalThis === void 0 || (_globalThis$Zone = globalThis.Zone) === null || _globalThis$Zone === void 0 || (_globalThis$Zone$__sy = _globalThis$Zone.__symbol__) === null || _globalThis$Zone$__sy === void 0 ? void 0 : _globalThis$Zone$__sy.call(_globalThis$Zone, key);
  if (angularUnpatchedVersionSymbol && globalThis[angularUnpatchedVersionSymbol]) return globalThis[angularUnpatchedVersionSymbol];else return;
}
function getUntaintedPrototype(key) {
  if (untaintedBasePrototype[key]) return untaintedBasePrototype[key];
  var defaultObj = angularZoneUnpatchedAlternative(key) || globalThis[key];
  var defaultPrototype = defaultObj.prototype;
  var accessorNames = key in testableAccessors ? testableAccessors[key] : void 0;
  var isUntaintedAccessors = Boolean(accessorNames && accessorNames.every(function (accessor) {
    var _Object$getOwnPropert;
    return Boolean((_Object$getOwnPropert = Object.getOwnPropertyDescriptor(defaultPrototype, accessor)) === null || _Object$getOwnPropert === void 0 || (_Object$getOwnPropert = _Object$getOwnPropert.get) === null || _Object$getOwnPropert === void 0 ? void 0 : _Object$getOwnPropert.toString().includes("[native code]"));
  }));
  var methodNames = key in testableMethods ? testableMethods[key] : void 0;
  var isUntaintedMethods = Boolean(methodNames && methodNames.every(function (method) {
    var _defaultPrototype$met;
    return typeof defaultPrototype[method] === "function" && ((_defaultPrototype$met = defaultPrototype[method]) === null || _defaultPrototype$met === void 0 ? void 0 : _defaultPrototype$met.toString().includes("[native code]"));
  }));
  if (isUntaintedAccessors && isUntaintedMethods) {
    untaintedBasePrototype[key] = defaultObj.prototype;
    return defaultObj.prototype;
  }
  try {
    var iframeEl = document.createElement("iframe");
    iframeEl.style.display = "none";
    document.body.appendChild(iframeEl);
    var win = iframeEl.contentWindow;
    if (!win) return defaultObj.prototype;
    var untaintedObject = win[key].prototype;
    if (!untaintedObject) {
      iframeEl.remove();
      return defaultPrototype;
    }
    var ua = navigator.userAgent;
    if (ua.includes("Safari") && !ua.includes("Chrome")) {
      iframeEl.classList.add("rr-block");
      iframeEl.setAttribute("__rrwebUntaintedMutationObserver", "");
      untaintedBaseIframeCleanup[key] = function () {
        return iframeEl.remove();
      };
    } else iframeEl.remove();
    return untaintedBasePrototype[key] = untaintedObject;
  } catch (_unused) {
    return defaultPrototype;
  }
}
var untaintedAccessorCache = {};
function getUntaintedAccessor(key, instance, accessor) {
  var _untaintedAccessorCac, _Object$getOwnPropert2;
  var cached = (_untaintedAccessorCac = untaintedAccessorCache[key]) === null || _untaintedAccessorCac === void 0 ? void 0 : _untaintedAccessorCac[accessor];
  if (cached) return cached.call(instance);
  var untaintedPrototype = getUntaintedPrototype(key);
  var untaintedAccessor = (_Object$getOwnPropert2 = Object.getOwnPropertyDescriptor(untaintedPrototype, accessor)) === null || _Object$getOwnPropert2 === void 0 ? void 0 : _Object$getOwnPropert2.get;
  if (!untaintedAccessor) return instance[accessor];
  (untaintedAccessorCache[key] || (untaintedAccessorCache[key] = {}))[accessor] = untaintedAccessor;
  return untaintedAccessor.call(instance);
}
var untaintedMethodCache = {};
function getUntaintedMethod(key, instance, method) {
  var cacheKey = "".concat(key, ".").concat(String(method));
  if (untaintedMethodCache[cacheKey]) return untaintedMethodCache[cacheKey].bind(instance);
  var untaintedMethod = getUntaintedPrototype(key)[method];
  if (typeof untaintedMethod !== "function") return instance[method];
  untaintedMethodCache[cacheKey] = untaintedMethod;
  return untaintedMethod.bind(instance);
}
function ownerDocument(n) {
  return getUntaintedAccessor("Node", n, "ownerDocument");
}
function childNodes(n) {
  return getUntaintedAccessor("Node", n, "childNodes");
}
function parentNode(n) {
  return getUntaintedAccessor("Node", n, "parentNode");
}
function parentElement(n) {
  return getUntaintedAccessor("Node", n, "parentElement");
}
function textContent(n) {
  return getUntaintedAccessor("Node", n, "textContent");
}
function firstChild(n) {
  return getUntaintedAccessor("Node", n, "firstChild");
}
function lastChild(n) {
  return getUntaintedAccessor("Node", n, "lastChild");
}
function nextSibling(n) {
  return getUntaintedAccessor("Node", n, "nextSibling");
}
function previousSibling(n) {
  return getUntaintedAccessor("Node", n, "previousSibling");
}
function contains(n, other) {
  return getUntaintedMethod("Node", n, "contains")(other);
}
function getRootNode(n) {
  return getUntaintedMethod("Node", n, "getRootNode")();
}
function host(n) {
  if (!n || !("host" in n)) return null;
  return getUntaintedAccessor("ShadowRoot", n, "host");
}
function styleSheets(n) {
  return n.styleSheets;
}
function shadowRoot(n) {
  if (!n || !("shadowRoot" in n)) return null;
  return getUntaintedAccessor("Element", n, "shadowRoot");
}
function querySelector(n, selectors) {
  return getUntaintedAccessor("Element", n, "querySelector")(selectors);
}
function querySelectorAll(n, selectors) {
  return getUntaintedAccessor("Element", n, "querySelectorAll")(selectors);
}
function mutationObserverCtor() {
  var prototype = getUntaintedPrototype("MutationObserver");
  mutationObserverUsers++;
  var stopCalled = false;
  return [prototype.constructor, function () {
    if (stopCalled) return;
    stopCalled = true;
    if (--mutationObserverUsers !== 0) return;
    var cleanup = untaintedBaseIframeCleanup["MutationObserver"];
    if (!cleanup) return;
    try {
      cleanup();
    } finally {
      delete untaintedBasePrototype["MutationObserver"];
      delete untaintedBaseIframeCleanup["MutationObserver"];
    }
  }];
}
var nowTimestamp = Date.now;
if (! /*@__PURE__*//[1-9][0-9]{12}/.test(Date.now().toString())) nowTimestamp = function nowTimestamp() {
  return (/* @__PURE__ */new Date()).getTime();
};
function patch(source, name, replacement) {
  try {
    if (!(name in source)) return function () {};
    var original = source[name];
    var wrapped = replacement(original);
    if (typeof wrapped === "function") {
      wrapped.prototype = wrapped.prototype || {};
      Object.defineProperties(wrapped, {
        __rrweb_original__: {
          enumerable: false,
          value: original
        }
      });
    }
    source[name] = wrapped;
    return function () {
      source[name] = original;
    };
  } catch (_unused2) {
    return function () {};
  }
}
var src_default = {
  ownerDocument: ownerDocument,
  childNodes: childNodes,
  parentNode: parentNode,
  parentElement: parentElement,
  textContent: textContent,
  firstChild: firstChild,
  lastChild: lastChild,
  nextSibling: nextSibling,
  previousSibling: previousSibling,
  contains: contains,
  getRootNode: getRootNode,
  host: host,
  styleSheets: styleSheets,
  shadowRoot: shadowRoot,
  querySelector: querySelector,
  querySelectorAll: querySelectorAll,
  nowTimestamp: nowTimestamp,
  mutationObserverCtor: mutationObserverCtor,
  patch: patch
};
// ../rrweb-snapshot/src/utils.ts
function isElement(n) {
  return n.nodeType === n.ELEMENT_NODE;
}
function isShadowRoot(n) {
  var hostEl = n && "host" in n && "mode" in n && src_default.host(n) || null;
  return Boolean(hostEl && "shadowRoot" in hostEl && src_default.shadowRoot(hostEl) === n);
}
/**
* To fix the issue https://github.com/rrweb-io/rrweb/issues/933.
* Some websites use polyfilled shadow dom and this function is used to detect this situation.
*/
function isNativeShadowDom(shadowRoot) {
  return Object.prototype.toString.call(shadowRoot) === "[object ShadowRoot]";
}
/**
* Browsers sometimes destructively modify the css rules they receive.
* This function tries to rectify the modifications the browser made to make it more cross platform compatible.
* @param cssText - output of `CSSStyleRule.cssText`
* @returns `cssText` with browser inconsistencies fixed.
*/
function fixBrowserCompatibilityIssuesInCSS(cssText) {
  /**
  * Chrome outputs `-webkit-background-clip` as `background-clip` in `CSSStyleRule.cssText`.
  * But then Chrome ignores `background-clip` as css input.
  * Re-introduce `-webkit-background-clip` to fix this issue.
  */
  if (cssText.includes(" background-clip: text;") && !cssText.includes(" -webkit-background-clip: text;")) cssText = cssText.replace(/\sbackground-clip:\s*text;/g, " -webkit-background-clip: text; background-clip: text;");
  return cssText;
}
/**
* Browsers sometimes incorrectly escape `@import` on `.cssText` statements.
* This function tries to correct the escaping.
* more info: https://bugs.chromium.org/p/chromium/issues/detail?id=1472259
* @param cssImportRule
* @returns `cssText` with browser inconsistencies fixed, or null if not applicable.
*/
function escapeImportStatement(rule) {
  var cssText = rule.cssText;
  if (cssText.split("\"").length < 3) return cssText;
  var statement = ["@import", "url(".concat(JSON.stringify(rule.href), ")")];
  if (rule.layerName === "") statement.push("layer");else if (rule.layerName) statement.push("layer(".concat(rule.layerName, ")"));
  if (rule.supportsText) statement.push("supports(".concat(rule.supportsText, ")"));
  if (rule.media.length) statement.push(rule.media.mediaText);
  return statement.join(" ") + ";";
}
function stringifyStylesheet(s) {
  try {
    var rules = s.rules || s.cssRules;
    if (!rules) return null;
    var sheetHref = s.href;
    if (!sheetHref && s.ownerNode) sheetHref = s.ownerNode.baseURI;
    return fixBrowserCompatibilityIssuesInCSS(Array.from(rules, function (rule) {
      return stringifyRule(rule, sheetHref);
    }).join(""));
  } catch (error) {
    return null;
  }
}
function stringifyRule(rule, sheetHref) {
  if (isCSSImportRule(rule)) {
    var importStringified;
    try {
      importStringified = stringifyStylesheet(rule.styleSheet) || escapeImportStatement(rule);
    } catch (error) {
      importStringified = rule.cssText;
    }
    if (rule.styleSheet.href) return absolutifyURLs(importStringified, rule.styleSheet.href);
    return importStringified;
  } else {
    var ruleStringified = rule.cssText;
    if (isCSSStyleRule(rule) && rule.selectorText.includes(":")) ruleStringified = fixSafariColons(ruleStringified);
    if (sheetHref) return absolutifyURLs(ruleStringified, sheetHref);
    return ruleStringified;
  }
}
function fixSafariColons(cssStringified) {
  return cssStringified.replace(/(\[(?:[\w-]+)[^\\])(:(?:[\w-]+)\])/gm, "$1\\$2");
}
function isCSSImportRule(rule) {
  return "styleSheet" in rule;
}
function isCSSStyleRule(rule) {
  return "selectorText" in rule;
}
var Mirror = /*#__PURE__*/function () {
  function Mirror() {
    record_classCallCheck(this, Mirror);
    record_defineProperty(this, "idNodeMap", /* @__PURE__ */new Map());
    record_defineProperty(this, "nodeMetaMap", /* @__PURE__ */new WeakMap());
  }
  return record_createClass(Mirror, [{
    key: "getId",
    value: function getId(n) {
      var _this$getMeta$id, _this$getMeta;
      if (!n) return -1;
      return (_this$getMeta$id = (_this$getMeta = this.getMeta(n)) === null || _this$getMeta === void 0 ? void 0 : _this$getMeta.id) !== null && _this$getMeta$id !== void 0 ? _this$getMeta$id : -1;
    }
  }, {
    key: "getNode",
    value: function getNode(id) {
      return this.idNodeMap.get(id) || null;
    }
  }, {
    key: "getIds",
    value: function getIds() {
      return Array.from(this.idNodeMap.keys());
    }
  }, {
    key: "getMeta",
    value: function getMeta(n) {
      return this.nodeMetaMap.get(n) || null;
    }
  }, {
    key: "removeNodeFromMap",
    value: function removeNodeFromMap(n) {
      var _this = this;
      var id = this.getId(n);
      this.idNodeMap.delete(id);
      if (n.childNodes) n.childNodes.forEach(function (childNode) {
        return _this.removeNodeFromMap(childNode);
      });
      var shadowRoot = src_default.shadowRoot(n);
      if (shadowRoot) this.removeNodeFromMap(shadowRoot);
    }
  }, {
    key: "has",
    value: function has(id) {
      return this.idNodeMap.has(id);
    }
  }, {
    key: "hasNode",
    value: function hasNode(node) {
      return this.nodeMetaMap.has(node);
    }
  }, {
    key: "add",
    value: function add(n, meta) {
      var id = meta.id;
      this.idNodeMap.set(id, n);
      this.nodeMetaMap.set(n, meta);
    }
  }, {
    key: "replace",
    value: function replace(id, n) {
      var oldNode = this.getNode(id);
      if (oldNode) {
        var meta = this.nodeMetaMap.get(oldNode);
        if (meta) this.nodeMetaMap.set(n, meta);
      }
      this.idNodeMap.set(id, n);
    }
  }, {
    key: "reset",
    value: function reset() {
      this.idNodeMap = /* @__PURE__ */new Map();
      this.nodeMetaMap = /* @__PURE__ */new WeakMap();
    }
  }]);
}();
function createMirror() {
  return new Mirror();
}
function maskInputValue(_ref) {
  var element = _ref.element,
    maskInputOptions = _ref.maskInputOptions,
    tagName = _ref.tagName,
    type = _ref.type,
    value = _ref.value,
    maskInputFn = _ref.maskInputFn;
  var text = value || "";
  var actualType = type && toLowerCase(type);
  if (maskInputOptions[tagName.toLowerCase()] || actualType && maskInputOptions[actualType]) {
    if (maskInputFn) text = maskInputFn(text, element);else text = "*".repeat(text.length);
  }
  return text;
}
function toLowerCase(str) {
  return str.toLowerCase();
}
var ORIGINAL_ATTRIBUTE_NAME = "__rrweb_original__";
function is2DCanvasBlank(canvas) {
  var ctx = canvas.getContext("2d");
  if (!ctx) return true;
  var chunkSize = 50;
  for (var x = 0; x < canvas.width; x += chunkSize) for (var y = 0; y < canvas.height; y += chunkSize) {
    var getImageData = ctx.getImageData;
    var originalGetImageData = ORIGINAL_ATTRIBUTE_NAME in getImageData ? getImageData[ORIGINAL_ATTRIBUTE_NAME] : getImageData;
    if (new Uint32Array(originalGetImageData.call(ctx, x, y, Math.min(chunkSize, canvas.width - x), Math.min(chunkSize, canvas.height - y)).data.buffer).some(function (pixel) {
      return pixel !== 0;
    })) return false;
  }
  return true;
}
/**
* Get the type of an input element.
* This takes care of the case where a password input is changed to a text input.
* In this case, we continue to consider this of type password, in order to avoid leaking sensitive data
* where passwords should be masked.
*/
function getInputType(element) {
  var type = element.type;
  return element.hasAttribute("data-rr-is-password") ? "password" : type ? toLowerCase(type) : null;
}
/**
* Extracts the file extension from an a path, considering search parameters and fragments.
* @param path - Path to file
* @param baseURL - [optional] Base URL of the page, used to resolve relative paths. Defaults to current page URL.
*/
function extractFileExtension(path, baseURL) {
  var _url$pathname$match$, _url$pathname$match;
  var url;
  try {
    url = new URL(path, baseURL !== null && baseURL !== void 0 ? baseURL : window.location.href);
  } catch (err) {
    return null;
  }
  return (_url$pathname$match$ = (_url$pathname$match = url.pathname.match(/\.([0-9a-z]+)(?:$)/i)) === null || _url$pathname$match === void 0 ? void 0 : _url$pathname$match[1]) !== null && _url$pathname$match$ !== void 0 ? _url$pathname$match$ : null;
}
function extractOrigin(url) {
  var origin = "";
  if (url.indexOf("//") > -1) origin = url.split("/").slice(0, 3).join("/");else origin = url.split("/")[0];
  origin = origin.split("?")[0];
  return origin;
}
var URL_IN_CSS_REF = /url\((?:(')([^']*)'|(")(.*?)"|([^)]*))\)/gm;
var URL_PROTOCOL_MATCH = /^(?:[a-z+]+:)?\/\//i;
var URL_WWW_MATCH = /^www\..*/i;
var DATA_URI = /^(data:)([^,]*),(.*)/i;
var BLOB_URI = /^blob:/i;
function absolutifyURLs(cssText, href) {
  return (cssText || "").replace(URL_IN_CSS_REF, function (origin, quote1, path1, quote2, path2, path3) {
    var filePath = path1 || path2 || path3;
    var maybeQuote = quote1 || quote2 || "";
    if (!filePath) return origin;
    if (URL_PROTOCOL_MATCH.test(filePath) || URL_WWW_MATCH.test(filePath)) return "url(".concat(maybeQuote).concat(filePath).concat(maybeQuote, ")");
    if (DATA_URI.test(filePath) || BLOB_URI.test(filePath)) return "url(".concat(maybeQuote).concat(filePath).concat(maybeQuote, ")");
    if (filePath[0] === "#") return "url(".concat(maybeQuote).concat(filePath).concat(maybeQuote, ")");
    if (filePath[0] === "/") return "url(".concat(maybeQuote).concat(extractOrigin(href) + filePath).concat(maybeQuote, ")");
    var filePathNoHash = filePath.split("#")[0];
    var maybeHash = filePath.substring(filePathNoHash.length);
    var stack = href.split("#")[0].split("/");
    var parts = filePathNoHash.split("/");
    stack.pop();
    var _iterator = record_createForOfIteratorHelper(parts),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var part = _step.value;
        if (part === ".") continue;else if (part === "..") stack.pop();else stack.push(part);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return "url(".concat(maybeQuote).concat(stack.join("/")).concat(maybeHash).concat(maybeQuote, ")");
  });
}
var cssNormalizeBase = "(?:/\\*[^*]*\\*/)|[\\s;]";
var cssNormalizeRe = new RegExp("".concat(cssNormalizeBase, "|\\b(0)px?"), "g");
var cssNormalizeReNoPx = new RegExp(cssNormalizeBase, "g");
/**
* Intention is to normalize by remove spaces, semicolons and CSS comments
* so that we can compare css as authored vs. output of stringifyStylesheet
*/
function normalizeCssString(cssText) {
  var _testNoPxNorm = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return _testNoPxNorm ? cssText.replace(cssNormalizeReNoPx, "") : cssText.replace(cssNormalizeRe, "$1");
}
/**
* Maps the output of stringifyStylesheet to individual text nodes of a <style> element
* which occurs when javascript is used to append to the style element
* and may also occur when browsers opt to break up large text nodes
* performance needs to be considered, see e.g. #1603
*/
function splitCssText(cssText, style) {
  var _testNoPxNorm = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var childNodes = Array.from(style.childNodes);
  var splits = [];
  var iterCount = 0;
  if (childNodes.length > 1 && cssText && typeof cssText === "string") {
    var cssTextNorm = normalizeCssString(cssText, _testNoPxNorm);
    var normFactor = cssTextNorm.length / cssText.length;
    for (var _i = 1; _i < childNodes.length; _i++) if (childNodes[_i].textContent && typeof childNodes[_i].textContent === "string") {
      var textContentNorm = normalizeCssString(childNodes[_i].textContent, _testNoPxNorm);
      var jLimit = 100;
      var j = 3;
      for (; j < textContentNorm.length; j++) {
        if (textContentNorm[j].match(/[a-zA-Z0-9]/) || textContentNorm.indexOf(textContentNorm.substring(0, j), 1) !== -1) continue;
        break;
      }
      for (; j < textContentNorm.length; j++) {
        var startSubstring = textContentNorm.substring(0, j);
        var cssNormSplits = cssTextNorm.split(startSubstring);
        var splitNorm = -1;
        if (cssNormSplits.length === 2) splitNorm = cssNormSplits[0].length;else if (cssNormSplits.length > 2 && cssNormSplits[0] === "" && childNodes[_i - 1].textContent !== "") splitNorm = cssTextNorm.indexOf(startSubstring, 1);else if (cssNormSplits.length === 1) {
          startSubstring = startSubstring.substring(0, startSubstring.length - 1);
          cssNormSplits = cssTextNorm.split(startSubstring);
          if (cssNormSplits.length <= 1) {
            splits.push(cssText);
            return splits;
          }
          j = 101;
        } else if (j === textContentNorm.length - 1) splitNorm = cssTextNorm.indexOf(startSubstring);
        if (cssNormSplits.length >= 2 && j > jLimit) {
          var prevTextContent = childNodes[_i - 1].textContent;
          if (prevTextContent && typeof prevTextContent === "string") {
            var prevMinLength = normalizeCssString(prevTextContent).length;
            splitNorm = cssTextNorm.indexOf(startSubstring, prevMinLength);
          }
          if (splitNorm === -1) splitNorm = cssNormSplits[0].length;
        }
        if (splitNorm !== -1) {
          var k = Math.floor(splitNorm / normFactor);
          for (; k > 0 && k < cssText.length;) {
            iterCount += 1;
            if (iterCount > 50 * childNodes.length) {
              splits.push(cssText);
              return splits;
            }
            var normPart = normalizeCssString(cssText.substring(0, k), _testNoPxNorm);
            if (normPart.length === splitNorm) {
              splits.push(cssText.substring(0, k));
              cssText = cssText.substring(k);
              cssTextNorm = cssTextNorm.substring(splitNorm);
              break;
            } else if (normPart.length < splitNorm) k += Math.max(1, Math.floor((splitNorm - normPart.length) / normFactor));else k -= Math.max(1, Math.floor((normPart.length - splitNorm) * normFactor));
          }
          break;
        }
      }
    }
  }
  splits.push(cssText);
  return splits;
}
function markCssSplits(cssText, style) {
  return splitCssText(cssText, style).join("/* rr_split */");
}
// ../rrweb-snapshot/src/snapshot.ts
var _id = 1;
var tagNameRegex = /* @__PURE__ */new RegExp("[^a-z0-9-_:]");
function genId() {
  return _id++;
}
function getValidTagName(element) {
  if (element instanceof HTMLFormElement) return "form";
  var processedTagName = toLowerCase(element.tagName);
  if (tagNameRegex.test(processedTagName)) return "div";
  return processedTagName;
}
var canvasService;
var canvasCtx;
var SRCSET_NOT_SPACES = /^[^ \t\n\r\u000c]+/;
var SRCSET_COMMAS_OR_SPACES = /^[, \t\n\r\u000c]+/;
function getAbsoluteSrcsetString(doc, attributeValue) {
  if (attributeValue.trim() === "") return attributeValue;
  var pos = 0;
  function collectCharacters(regEx) {
    var chars;
    var match = regEx.exec(attributeValue.substring(pos));
    if (match) {
      chars = match[0];
      pos += chars.length;
      return chars;
    }
    return "";
  }
  var output = [];
  while (true) {
    collectCharacters(SRCSET_COMMAS_OR_SPACES);
    if (pos >= attributeValue.length) break;
    var url = collectCharacters(SRCSET_NOT_SPACES);
    if (url.slice(-1) === ",") {
      url = absoluteToDoc(doc, url.substring(0, url.length - 1));
      output.push(url);
    } else {
      var descriptorsStr = "";
      url = absoluteToDoc(doc, url);
      var inParens = false;
      while (true) {
        var c = attributeValue.charAt(pos);
        if (c === "") {
          output.push((url + descriptorsStr).trim());
          break;
        } else if (!inParens) {
          if (c === ",") {
            pos += 1;
            output.push((url + descriptorsStr).trim());
            break;
          } else if (c === "(") inParens = true;
        } else if (c === ")") inParens = false;
        descriptorsStr += c;
        pos += 1;
      }
    }
  }
  return output.join(", ");
}
var cachedDocument = /* @__PURE__ */new WeakMap();
function absoluteToDoc(doc, attributeValue) {
  if (!attributeValue || attributeValue.trim() === "") return attributeValue;
  return getHref(doc, attributeValue);
}
function isSVGElement(el) {
  return Boolean(el.tagName === "svg" || el.ownerSVGElement);
}
function getHref(doc, customHref) {
  var a = cachedDocument.get(doc);
  if (!a) {
    a = doc.createElement("a");
    cachedDocument.set(doc, a);
  }
  if (!customHref) customHref = "";else if (customHref.startsWith("blob:") || customHref.startsWith("data:")) return customHref;
  a.setAttribute("href", customHref);
  return a.href;
}
function transformAttribute(doc, tagName, name, value) {
  if (!value) return value;
  if (name === "src" || name === "href" && !(tagName === "use" && value[0] === "#")) return absoluteToDoc(doc, value);else if (name === "xlink:href" && value[0] !== "#") return absoluteToDoc(doc, value);else if (name === "background" && ["table", "td", "th"].includes(tagName)) return absoluteToDoc(doc, value);else if (name === "srcset") return getAbsoluteSrcsetString(doc, value);else if (name === "style") return absolutifyURLs(value, getHref(doc));else if (tagName === "object" && name === "data") return absoluteToDoc(doc, value);
  return value;
}
function ignoreAttribute(tagName, name, _value) {
  return ["video", "audio"].includes(tagName) && toLowerCase(name) === "autoplay";
}
function _isBlockedElement(element, blockClass, blockSelector) {
  try {
    if (typeof blockClass === "string") {
      if (element.classList.contains(blockClass)) return true;
    } else for (var eIndex = element.classList.length; eIndex--;) {
      var className = element.classList[eIndex];
      if (blockClass.test(className)) return true;
    }
    if (blockSelector) return element.matches(blockSelector);
  } catch (e) {}
  return false;
}
function classMatchesRegex(node, regex, checkAncestors) {
  if (!node) return false;
  if (node.nodeType !== node.ELEMENT_NODE) {
    if (!checkAncestors) return false;
    return classMatchesRegex(src_default.parentNode(node), regex, checkAncestors);
  }
  for (var eIndex = node.classList.length; eIndex--;) {
    var className = node.classList[eIndex];
    if (regex.test(className)) return true;
  }
  if (!checkAncestors) return false;
  return classMatchesRegex(src_default.parentNode(node), regex, checkAncestors);
}
function needMaskingText(node, maskTextClass, maskTextSelector, checkAncestors) {
  var el;
  if (isElement(node)) {
    el = node;
    if (!src_default.childNodes(el).length) return false;
  } else if (src_default.parentElement(node) === null) return false;else el = src_default.parentElement(node);
  try {
    if (typeof maskTextClass === "string") {
      if (checkAncestors) {
        if (el.closest(".".concat(maskTextClass))) return true;
      } else if (el.classList.contains(maskTextClass)) return true;
    } else if (classMatchesRegex(el, maskTextClass, checkAncestors)) return true;
    if (maskTextSelector) {
      if (checkAncestors) {
        if (el.closest(maskTextSelector)) return true;
      } else if (el.matches(maskTextSelector)) return true;
    }
  } catch (e) {}
  return false;
}
function onceIframeLoaded(iframeEl, listener, iframeLoadTimeout) {
  var win = iframeEl.contentWindow;
  if (!win) return;
  var fired = false;
  var readyState;
  try {
    readyState = win.document.readyState;
  } catch (error) {
    return;
  }
  if (readyState !== "complete") {
    var timer = setTimeout(function () {
      if (!fired) {
        listener();
        fired = true;
      }
    }, iframeLoadTimeout);
    iframeEl.addEventListener("load", function () {
      clearTimeout(timer);
      fired = true;
      listener();
    });
    return;
  }
  var blankUrl = "about:blank";
  if (win.location.href !== blankUrl || iframeEl.src === blankUrl || iframeEl.src === "") {
    setTimeout(listener, 0);
    return iframeEl.addEventListener("load", listener);
  }
  iframeEl.addEventListener("load", listener);
}
function onceStylesheetLoaded(link, listener, styleSheetLoadTimeout) {
  var fired = false;
  var styleSheetLoaded;
  try {
    styleSheetLoaded = link.sheet;
  } catch (error) {
    return;
  }
  if (styleSheetLoaded) return;
  var timer = setTimeout(function () {
    if (!fired) {
      listener();
      fired = true;
    }
  }, styleSheetLoadTimeout);
  link.addEventListener("load", function () {
    clearTimeout(timer);
    fired = true;
    listener();
  });
}
function serializeNode(n, options) {
  var doc = options.doc,
    mirror = options.mirror,
    blockClass = options.blockClass,
    blockSelector = options.blockSelector,
    needsMask = options.needsMask,
    inlineStylesheet = options.inlineStylesheet,
    _options$maskInputOpt = options.maskInputOptions,
    maskInputOptions = _options$maskInputOpt === void 0 ? {} : _options$maskInputOpt,
    maskTextFn = options.maskTextFn,
    maskInputFn = options.maskInputFn,
    _options$dataURLOptio = options.dataURLOptions,
    dataURLOptions = _options$dataURLOptio === void 0 ? {} : _options$dataURLOptio,
    inlineImages = options.inlineImages,
    recordCanvas = options.recordCanvas,
    keepIframeSrcFn = options.keepIframeSrcFn,
    _options$newlyAddedEl = options.newlyAddedElement,
    newlyAddedElement = _options$newlyAddedEl === void 0 ? false : _options$newlyAddedEl,
    _options$cssCaptured = options.cssCaptured,
    cssCaptured = _options$cssCaptured === void 0 ? false : _options$cssCaptured;
  var rootId = getRootId(doc, mirror);
  switch (n.nodeType) {
    case n.DOCUMENT_NODE:
      if (n.compatMode !== "CSS1Compat") return {
        type: NodeType.Document,
        childNodes: [],
        compatMode: n.compatMode
      };else return {
        type: NodeType.Document,
        childNodes: []
      };
    case n.DOCUMENT_TYPE_NODE:
      return {
        type: NodeType.DocumentType,
        name: n.name,
        publicId: n.publicId,
        systemId: n.systemId,
        rootId: rootId
      };
    case n.ELEMENT_NODE:
      return serializeElementNode(n, {
        doc: doc,
        blockClass: blockClass,
        blockSelector: blockSelector,
        inlineStylesheet: inlineStylesheet,
        maskInputOptions: maskInputOptions,
        maskInputFn: maskInputFn,
        dataURLOptions: dataURLOptions,
        inlineImages: inlineImages,
        recordCanvas: recordCanvas,
        keepIframeSrcFn: keepIframeSrcFn,
        newlyAddedElement: newlyAddedElement,
        rootId: rootId
      });
    case n.TEXT_NODE:
      return serializeTextNode(n, {
        doc: doc,
        needsMask: needsMask,
        maskTextFn: maskTextFn,
        rootId: rootId,
        cssCaptured: cssCaptured
      });
    case n.CDATA_SECTION_NODE:
      return {
        type: NodeType.CDATA,
        textContent: "",
        rootId: rootId
      };
    case n.COMMENT_NODE:
      return {
        type: NodeType.Comment,
        textContent: src_default.textContent(n) || "",
        rootId: rootId
      };
    default:
      return false;
  }
}
function getRootId(doc, mirror) {
  if (!mirror.hasNode(doc)) return void 0;
  var docId = mirror.getId(doc);
  return docId === 1 ? void 0 : docId;
}
function serializeTextNode(n, options) {
  var needsMask = options.needsMask,
    maskTextFn = options.maskTextFn,
    rootId = options.rootId,
    cssCaptured = options.cssCaptured;
  var parent = src_default.parentNode(n);
  var parentTagName = parent && parent.tagName;
  var textContent = "";
  var isStyle = parentTagName === "STYLE" ? true : void 0;
  var isScript = parentTagName === "SCRIPT" ? true : void 0;
  if (isScript) textContent = "SCRIPT_PLACEHOLDER";else if (!cssCaptured) {
    textContent = src_default.textContent(n);
    if (isStyle && textContent) textContent = absolutifyURLs(textContent, getHref(options.doc));
  }
  if (!isStyle && !isScript && textContent && needsMask) textContent = maskTextFn ? maskTextFn(textContent, src_default.parentElement(n)) : textContent.replace(/[\S]/g, "*");
  return {
    type: NodeType.Text,
    textContent: textContent || "",
    rootId: rootId
  };
}
function serializeElementNode(n, options) {
  var doc = options.doc,
    blockClass = options.blockClass,
    blockSelector = options.blockSelector,
    inlineStylesheet = options.inlineStylesheet,
    _options$maskInputOpt2 = options.maskInputOptions,
    maskInputOptions = _options$maskInputOpt2 === void 0 ? {} : _options$maskInputOpt2,
    maskInputFn = options.maskInputFn,
    _options$dataURLOptio2 = options.dataURLOptions,
    dataURLOptions = _options$dataURLOptio2 === void 0 ? {} : _options$dataURLOptio2,
    inlineImages = options.inlineImages,
    recordCanvas = options.recordCanvas,
    keepIframeSrcFn = options.keepIframeSrcFn,
    _options$newlyAddedEl2 = options.newlyAddedElement,
    newlyAddedElement = _options$newlyAddedEl2 === void 0 ? false : _options$newlyAddedEl2,
    rootId = options.rootId;
  var needBlock = _isBlockedElement(n, blockClass, blockSelector);
  var tagName = getValidTagName(n);
  var attributes = {};
  var len = n.attributes.length;
  for (var _i2 = 0; _i2 < len; _i2++) {
    var attr = n.attributes[_i2];
    if (!ignoreAttribute(tagName, attr.name, attr.value)) attributes[attr.name] = transformAttribute(doc, tagName, toLowerCase(attr.name), attr.value);
  }
  if (tagName === "link" && inlineStylesheet) {
    var stylesheet = Array.from(doc.styleSheets).find(function (s) {
      return s.href === n.href;
    });
    var cssText = null;
    if (stylesheet) cssText = stringifyStylesheet(stylesheet);
    if (cssText) {
      delete attributes.rel;
      delete attributes.href;
      attributes._cssText = cssText;
    }
  }
  if (tagName === "style" && n.sheet) {
    var _cssText = stringifyStylesheet(n.sheet);
    if (_cssText) {
      if (n.childNodes.length > 1) _cssText = markCssSplits(_cssText, n);
      attributes._cssText = _cssText;
    }
  }
  if (["input", "textarea", "select"].includes(tagName)) {
    var value = n.value;
    var checked = n.checked;
    if (attributes.type !== "radio" && attributes.type !== "checkbox" && attributes.type !== "submit" && attributes.type !== "button" && value) attributes.value = maskInputValue({
      element: n,
      type: getInputType(n),
      tagName: tagName,
      value: value,
      maskInputOptions: maskInputOptions,
      maskInputFn: maskInputFn
    });else if (checked) attributes.checked = checked;
  }
  if (tagName === "option") {
    if (n.selected && !maskInputOptions["select"]) attributes.selected = true;else delete attributes.selected;
  }
  if (tagName === "dialog" && n.open) attributes.rr_open_mode = n.matches("dialog:modal") ? "modal" : "non-modal";
  if (tagName === "canvas" && recordCanvas) {
    if (n.__context === "2d") {
      if (!is2DCanvasBlank(n)) attributes.rr_dataURL = n.toDataURL(dataURLOptions.type, dataURLOptions.quality);
    } else if (!("__context" in n)) {
      var canvasDataURL = n.toDataURL(dataURLOptions.type, dataURLOptions.quality);
      var blankCanvas = doc.createElement("canvas");
      blankCanvas.width = n.width;
      blankCanvas.height = n.height;
      if (canvasDataURL !== blankCanvas.toDataURL(dataURLOptions.type, dataURLOptions.quality)) attributes.rr_dataURL = canvasDataURL;
    }
  }
  if (tagName === "img" && inlineImages) {
    if (!canvasService) {
      canvasService = doc.createElement("canvas");
      canvasCtx = canvasService.getContext("2d");
    }
    var image = n;
    var imageSrc = image.currentSrc || image.getAttribute("src") || "<unknown-src>";
    var priorCrossOrigin = image.crossOrigin;
    var _recordInlineImage = function recordInlineImage() {
      image.removeEventListener("load", _recordInlineImage);
      try {
        canvasService.width = image.naturalWidth;
        canvasService.height = image.naturalHeight;
        canvasCtx.drawImage(image, 0, 0);
        attributes.rr_dataURL = canvasService.toDataURL(dataURLOptions.type, dataURLOptions.quality);
      } catch (err) {
        if (image.crossOrigin !== "anonymous") {
          image.crossOrigin = "anonymous";
          if (image.complete && image.naturalWidth !== 0) _recordInlineImage();else image.addEventListener("load", _recordInlineImage);
          return;
        } else console.warn("Cannot inline img src=".concat(imageSrc, "! Error: ").concat(err));
      }
      if (image.crossOrigin === "anonymous") priorCrossOrigin ? attributes.crossOrigin = priorCrossOrigin : image.removeAttribute("crossorigin");
    };
    if (image.complete && image.naturalWidth !== 0) _recordInlineImage();else image.addEventListener("load", _recordInlineImage);
  }
  if (["audio", "video"].includes(tagName)) {
    var mediaAttributes = attributes;
    mediaAttributes.rr_mediaState = n.paused ? "paused" : "played";
    mediaAttributes.rr_mediaCurrentTime = n.currentTime;
    mediaAttributes.rr_mediaPlaybackRate = n.playbackRate;
    mediaAttributes.rr_mediaMuted = n.muted;
    mediaAttributes.rr_mediaLoop = n.loop;
    mediaAttributes.rr_mediaVolume = n.volume;
  }
  if (!newlyAddedElement) {
    if (n.scrollLeft) attributes.rr_scrollLeft = n.scrollLeft;
    if (n.scrollTop) attributes.rr_scrollTop = n.scrollTop;
  }
  if (needBlock) {
    var _n$getBoundingClientR = n.getBoundingClientRect(),
      width = _n$getBoundingClientR.width,
      height = _n$getBoundingClientR.height;
    attributes = {
      class: attributes.class,
      rr_width: "".concat(width, "px"),
      rr_height: "".concat(height, "px")
    };
  }
  if (tagName === "iframe" && !keepIframeSrcFn(attributes.src)) {
    if (!n.contentDocument) attributes.rr_src = attributes.src;
    delete attributes.src;
  }
  var isCustomElement;
  try {
    if (customElements.get(tagName)) isCustomElement = true;
  } catch (e) {}
  return {
    type: NodeType.Element,
    tagName: tagName,
    attributes: attributes,
    childNodes: [],
    isSVG: isSVGElement(n) || void 0,
    needBlock: needBlock,
    rootId: rootId,
    isCustom: isCustomElement
  };
}
function lowerIfExists(maybeAttr) {
  if (maybeAttr === void 0 || maybeAttr === null) return "";else return maybeAttr.toLowerCase();
}
function slimDOMDefaults(_slimDOMOptions) {
  if (_slimDOMOptions === true || _slimDOMOptions === "all") return {
    script: true,
    comment: true,
    headFavicon: true,
    headWhitespace: true,
    headMetaSocial: true,
    headMetaRobots: true,
    headMetaHttpEquiv: true,
    headMetaVerification: true,
    headMetaAuthorship: _slimDOMOptions === "all",
    headMetaDescKeywords: _slimDOMOptions === "all",
    headTitleMutations: _slimDOMOptions === "all"
  };else if (_slimDOMOptions) return _slimDOMOptions;
  return {};
}
function slimDOMExcluded(sn, slimDOMOptions) {
  if (slimDOMOptions.comment && sn.type === NodeType.Comment) return true;else if (sn.type === NodeType.Element) {
    if (slimDOMOptions.script && (sn.tagName === "script" || sn.tagName === "link" && (sn.attributes.rel === "preload" && sn.attributes.as === "script" || sn.attributes.rel === "modulepreload") || sn.tagName === "link" && sn.attributes.rel === "prefetch" && typeof sn.attributes.href === "string" && extractFileExtension(sn.attributes.href) === "js")) return true;else if (slimDOMOptions.headFavicon && (sn.tagName === "link" && sn.attributes.rel === "shortcut icon" || sn.tagName === "meta" && (lowerIfExists(sn.attributes.name).match(/^msapplication-tile(image|color)$/) || lowerIfExists(sn.attributes.name) === "application-name" || lowerIfExists(sn.attributes.rel) === "icon" || lowerIfExists(sn.attributes.rel) === "apple-touch-icon" || lowerIfExists(sn.attributes.rel) === "shortcut icon"))) return true;else if (sn.tagName === "meta") {
      if (slimDOMOptions.headMetaDescKeywords && lowerIfExists(sn.attributes.name).match(/^description|keywords$/)) return true;else if (slimDOMOptions.headMetaSocial && (lowerIfExists(sn.attributes.property).match(/^(og|twitter|fb):/) || lowerIfExists(sn.attributes.name).match(/^(og|twitter):/) || lowerIfExists(sn.attributes.name) === "pinterest")) return true;else if (slimDOMOptions.headMetaRobots && (lowerIfExists(sn.attributes.name) === "robots" || lowerIfExists(sn.attributes.name) === "googlebot" || lowerIfExists(sn.attributes.name) === "bingbot")) return true;else if (slimDOMOptions.headMetaHttpEquiv && sn.attributes["http-equiv"] !== void 0) return true;else if (slimDOMOptions.headMetaAuthorship && (lowerIfExists(sn.attributes.name) === "author" || lowerIfExists(sn.attributes.name) === "generator" || lowerIfExists(sn.attributes.name) === "framework" || lowerIfExists(sn.attributes.name) === "publisher" || lowerIfExists(sn.attributes.name) === "progid" || lowerIfExists(sn.attributes.property).match(/^article:/) || lowerIfExists(sn.attributes.property).match(/^product:/))) return true;else if (slimDOMOptions.headMetaVerification && (lowerIfExists(sn.attributes.name) === "google-site-verification" || lowerIfExists(sn.attributes.name) === "yandex-verification" || lowerIfExists(sn.attributes.name) === "csrf-token" || lowerIfExists(sn.attributes.name) === "p:domain_verify" || lowerIfExists(sn.attributes.name) === "verify-v1" || lowerIfExists(sn.attributes.name) === "verification" || lowerIfExists(sn.attributes.name) === "shopify-checkout-api-token")) return true;
    }
  }
  return false;
}
function serializeNodeWithId(n, options) {
  var doc = options.doc,
    mirror = options.mirror,
    blockClass = options.blockClass,
    blockSelector = options.blockSelector,
    maskTextClass = options.maskTextClass,
    maskTextSelector = options.maskTextSelector,
    _options$skipChild = options.skipChild,
    skipChild = _options$skipChild === void 0 ? false : _options$skipChild,
    _options$inlineStyles = options.inlineStylesheet,
    inlineStylesheet = _options$inlineStyles === void 0 ? true : _options$inlineStyles,
    _options$maskInputOpt3 = options.maskInputOptions,
    maskInputOptions = _options$maskInputOpt3 === void 0 ? {} : _options$maskInputOpt3,
    maskTextFn = options.maskTextFn,
    maskInputFn = options.maskInputFn,
    slimDOMOptions = options.slimDOMOptions,
    _options$dataURLOptio3 = options.dataURLOptions,
    dataURLOptions = _options$dataURLOptio3 === void 0 ? {} : _options$dataURLOptio3,
    _options$inlineImages = options.inlineImages,
    inlineImages = _options$inlineImages === void 0 ? false : _options$inlineImages,
    _options$recordCanvas = options.recordCanvas,
    recordCanvas = _options$recordCanvas === void 0 ? false : _options$recordCanvas,
    onSerialize = options.onSerialize,
    onIframeLoad = options.onIframeLoad,
    _options$iframeLoadTi = options.iframeLoadTimeout,
    iframeLoadTimeout = _options$iframeLoadTi === void 0 ? 5e3 : _options$iframeLoadTi,
    onStylesheetLoad = options.onStylesheetLoad,
    _options$stylesheetLo = options.stylesheetLoadTimeout,
    stylesheetLoadTimeout = _options$stylesheetLo === void 0 ? 5e3 : _options$stylesheetLo,
    _options$keepIframeSr = options.keepIframeSrcFn,
    keepIframeSrcFn = _options$keepIframeSr === void 0 ? function () {
      return false;
    } : _options$keepIframeSr,
    _options$newlyAddedEl3 = options.newlyAddedElement,
    newlyAddedElement = _options$newlyAddedEl3 === void 0 ? false : _options$newlyAddedEl3,
    _options$cssCaptured2 = options.cssCaptured,
    cssCaptured = _options$cssCaptured2 === void 0 ? false : _options$cssCaptured2;
  var needsMask = options.needsMask;
  var _options$preserveWhit = options.preserveWhiteSpace,
    preserveWhiteSpace = _options$preserveWhit === void 0 ? true : _options$preserveWhit;
  if (!needsMask) needsMask = needMaskingText(n, maskTextClass, maskTextSelector, needsMask === void 0);
  var _serializedNode = serializeNode(n, {
    doc: doc,
    mirror: mirror,
    blockClass: blockClass,
    blockSelector: blockSelector,
    needsMask: needsMask,
    inlineStylesheet: inlineStylesheet,
    maskInputOptions: maskInputOptions,
    maskTextFn: maskTextFn,
    maskInputFn: maskInputFn,
    dataURLOptions: dataURLOptions,
    inlineImages: inlineImages,
    recordCanvas: recordCanvas,
    keepIframeSrcFn: keepIframeSrcFn,
    newlyAddedElement: newlyAddedElement,
    cssCaptured: cssCaptured
  });
  if (!_serializedNode) {
    console.warn(n, "not serialized");
    return null;
  }
  var id;
  if (mirror.hasNode(n)) id = mirror.getId(n);else if (slimDOMExcluded(_serializedNode, slimDOMOptions) || !preserveWhiteSpace && _serializedNode.type === NodeType.Text && !_serializedNode.textContent.replace(/^\s+|\s+$/gm, "").length) id = -2;else id = genId();
  var serializedNode = Object.assign(_serializedNode, {
    id: id
  });
  mirror.add(n, serializedNode);
  if (id === -2) return null;
  if (onSerialize) onSerialize(n);
  var recordChild = !skipChild;
  if (serializedNode.type === NodeType.Element) {
    recordChild = recordChild && !serializedNode.needBlock;
    delete serializedNode.needBlock;
    var shadowRootEl = src_default.shadowRoot(n);
    if (shadowRootEl && isNativeShadowDom(shadowRootEl)) serializedNode.isShadowHost = true;
  }
  if ((serializedNode.type === NodeType.Document || serializedNode.type === NodeType.Element) && recordChild) {
    if (slimDOMOptions.headWhitespace && serializedNode.type === NodeType.Element && serializedNode.tagName === "head") preserveWhiteSpace = false;
    var bypassOptions = {
      doc: doc,
      mirror: mirror,
      blockClass: blockClass,
      blockSelector: blockSelector,
      needsMask: needsMask,
      maskTextClass: maskTextClass,
      maskTextSelector: maskTextSelector,
      skipChild: skipChild,
      inlineStylesheet: inlineStylesheet,
      maskInputOptions: maskInputOptions,
      maskTextFn: maskTextFn,
      maskInputFn: maskInputFn,
      slimDOMOptions: slimDOMOptions,
      dataURLOptions: dataURLOptions,
      inlineImages: inlineImages,
      recordCanvas: recordCanvas,
      preserveWhiteSpace: preserveWhiteSpace,
      onSerialize: onSerialize,
      onIframeLoad: onIframeLoad,
      iframeLoadTimeout: iframeLoadTimeout,
      onStylesheetLoad: onStylesheetLoad,
      stylesheetLoadTimeout: stylesheetLoadTimeout,
      keepIframeSrcFn: keepIframeSrcFn,
      cssCaptured: false
    };
    if (serializedNode.type === NodeType.Element && serializedNode.tagName === "textarea" && serializedNode.attributes.value !== void 0) {} else {
      if (serializedNode.type === NodeType.Element && serializedNode.attributes._cssText !== void 0 && typeof serializedNode.attributes._cssText === "string") bypassOptions.cssCaptured = true;
      for (var _i3 = 0, _Array$from = Array.from(src_default.childNodes(n)); _i3 < _Array$from.length; _i3++) {
        var childN = _Array$from[_i3];
        var serializedChildNode = serializeNodeWithId(childN, bypassOptions);
        if (serializedChildNode) serializedNode.childNodes.push(serializedChildNode);
      }
    }
    var _shadowRootEl = null;
    if (isElement(n) && (_shadowRootEl = src_default.shadowRoot(n))) for (var _i4 = 0, _Array$from2 = Array.from(src_default.childNodes(_shadowRootEl)); _i4 < _Array$from2.length; _i4++) {
      var _childN = _Array$from2[_i4];
      var _serializedChildNode = serializeNodeWithId(_childN, bypassOptions);
      if (_serializedChildNode) {
        isNativeShadowDom(_shadowRootEl) && (_serializedChildNode.isShadow = true);
        serializedNode.childNodes.push(_serializedChildNode);
      }
    }
  }
  var parent = src_default.parentNode(n);
  if (parent && isShadowRoot(parent) && isNativeShadowDom(parent)) serializedNode.isShadow = true;
  if (serializedNode.type === NodeType.Element && serializedNode.tagName === "iframe" && !_isBlockedElement(n, blockClass, blockSelector)) onceIframeLoaded(n, function () {
    var iframeDoc = n.contentDocument;
    if (iframeDoc && onIframeLoad) {
      var serializedIframeNode = serializeNodeWithId(iframeDoc, {
        doc: iframeDoc,
        mirror: mirror,
        blockClass: blockClass,
        blockSelector: blockSelector,
        needsMask: needsMask,
        maskTextClass: maskTextClass,
        maskTextSelector: maskTextSelector,
        skipChild: false,
        inlineStylesheet: inlineStylesheet,
        maskInputOptions: maskInputOptions,
        maskTextFn: maskTextFn,
        maskInputFn: maskInputFn,
        slimDOMOptions: slimDOMOptions,
        dataURLOptions: dataURLOptions,
        inlineImages: inlineImages,
        recordCanvas: recordCanvas,
        preserveWhiteSpace: preserveWhiteSpace,
        onSerialize: onSerialize,
        onIframeLoad: onIframeLoad,
        iframeLoadTimeout: iframeLoadTimeout,
        onStylesheetLoad: onStylesheetLoad,
        stylesheetLoadTimeout: stylesheetLoadTimeout,
        keepIframeSrcFn: keepIframeSrcFn
      });
      if (serializedIframeNode) onIframeLoad(n, serializedIframeNode);
    }
  }, iframeLoadTimeout);
  if (serializedNode.type === NodeType.Element && serializedNode.tagName === "link" && typeof serializedNode.attributes.rel === "string" && (serializedNode.attributes.rel === "stylesheet" || serializedNode.attributes.rel === "preload" && typeof serializedNode.attributes.href === "string" && extractFileExtension(serializedNode.attributes.href) === "css")) onceStylesheetLoaded(n, function () {
    if (onStylesheetLoad) {
      var serializedLinkNode = serializeNodeWithId(n, {
        doc: doc,
        mirror: mirror,
        blockClass: blockClass,
        blockSelector: blockSelector,
        needsMask: needsMask,
        maskTextClass: maskTextClass,
        maskTextSelector: maskTextSelector,
        skipChild: false,
        inlineStylesheet: inlineStylesheet,
        maskInputOptions: maskInputOptions,
        maskTextFn: maskTextFn,
        maskInputFn: maskInputFn,
        slimDOMOptions: slimDOMOptions,
        dataURLOptions: dataURLOptions,
        inlineImages: inlineImages,
        recordCanvas: recordCanvas,
        preserveWhiteSpace: preserveWhiteSpace,
        onSerialize: onSerialize,
        onIframeLoad: onIframeLoad,
        iframeLoadTimeout: iframeLoadTimeout,
        onStylesheetLoad: onStylesheetLoad,
        stylesheetLoadTimeout: stylesheetLoadTimeout,
        keepIframeSrcFn: keepIframeSrcFn
      });
      if (serializedLinkNode) onStylesheetLoad(n, serializedLinkNode);
    }
  }, stylesheetLoadTimeout);
  return serializedNode;
}
function snapshot(n, options) {
  var _ref2 = options || {},
    _ref2$mirror = _ref2.mirror,
    mirror = _ref2$mirror === void 0 ? new Mirror() : _ref2$mirror,
    _ref2$blockClass = _ref2.blockClass,
    blockClass = _ref2$blockClass === void 0 ? "rr-block" : _ref2$blockClass,
    _ref2$blockSelector = _ref2.blockSelector,
    blockSelector = _ref2$blockSelector === void 0 ? null : _ref2$blockSelector,
    _ref2$maskTextClass = _ref2.maskTextClass,
    maskTextClass = _ref2$maskTextClass === void 0 ? "rr-mask" : _ref2$maskTextClass,
    _ref2$maskTextSelecto = _ref2.maskTextSelector,
    maskTextSelector = _ref2$maskTextSelecto === void 0 ? null : _ref2$maskTextSelecto,
    _ref2$inlineStyleshee = _ref2.inlineStylesheet,
    inlineStylesheet = _ref2$inlineStyleshee === void 0 ? true : _ref2$inlineStyleshee,
    _ref2$inlineImages = _ref2.inlineImages,
    inlineImages = _ref2$inlineImages === void 0 ? false : _ref2$inlineImages,
    _ref2$recordCanvas = _ref2.recordCanvas,
    recordCanvas = _ref2$recordCanvas === void 0 ? false : _ref2$recordCanvas,
    _ref2$maskAllInputs = _ref2.maskAllInputs,
    maskAllInputs = _ref2$maskAllInputs === void 0 ? false : _ref2$maskAllInputs,
    maskTextFn = _ref2.maskTextFn,
    maskInputFn = _ref2.maskInputFn,
    _ref2$slimDOM = _ref2.slimDOM,
    slimDOM = _ref2$slimDOM === void 0 ? false : _ref2$slimDOM,
    dataURLOptions = _ref2.dataURLOptions,
    preserveWhiteSpace = _ref2.preserveWhiteSpace,
    onSerialize = _ref2.onSerialize,
    onIframeLoad = _ref2.onIframeLoad,
    iframeLoadTimeout = _ref2.iframeLoadTimeout,
    onStylesheetLoad = _ref2.onStylesheetLoad,
    stylesheetLoadTimeout = _ref2.stylesheetLoadTimeout,
    _ref2$keepIframeSrcFn = _ref2.keepIframeSrcFn,
    keepIframeSrcFn = _ref2$keepIframeSrcFn === void 0 ? function () {
      return false;
    } : _ref2$keepIframeSrcFn;
  return serializeNodeWithId(n, {
    doc: n,
    mirror: mirror,
    blockClass: blockClass,
    blockSelector: blockSelector,
    maskTextClass: maskTextClass,
    maskTextSelector: maskTextSelector,
    skipChild: false,
    inlineStylesheet: inlineStylesheet,
    maskInputOptions: maskAllInputs === true ? {
      color: true,
      date: true,
      "datetime-local": true,
      email: true,
      month: true,
      number: true,
      range: true,
      search: true,
      tel: true,
      text: true,
      time: true,
      url: true,
      week: true,
      textarea: true,
      select: true,
      password: true
    } : maskAllInputs === false ? {
      password: true
    } : maskAllInputs,
    maskTextFn: maskTextFn,
    maskInputFn: maskInputFn,
    slimDOMOptions: slimDOMDefaults(slimDOM),
    dataURLOptions: dataURLOptions,
    inlineImages: inlineImages,
    recordCanvas: recordCanvas,
    preserveWhiteSpace: preserveWhiteSpace,
    onSerialize: onSerialize,
    onIframeLoad: onIframeLoad,
    iframeLoadTimeout: iframeLoadTimeout,
    onStylesheetLoad: onStylesheetLoad,
    stylesheetLoadTimeout: stylesheetLoadTimeout,
    keepIframeSrcFn: keepIframeSrcFn,
    newlyAddedElement: false
  });
}
// ../rrdom/src/document.ts
/**
* This is designed as an abstract class so it should never be instantiated.
*/
var BaseRRNode = /*#__PURE__*/function () {
  function BaseRRNode() {
    record_classCallCheck(this, BaseRRNode);
    record_defineProperty(this, "parentElement", null);
    record_defineProperty(this, "parentNode", null);
    record_defineProperty(this, "ownerDocument", void 0);
    record_defineProperty(this, "firstChild", null);
    record_defineProperty(this, "lastChild", null);
    record_defineProperty(this, "previousSibling", null);
    record_defineProperty(this, "nextSibling", null);
    record_defineProperty(this, "ELEMENT_NODE", 1);
    record_defineProperty(this, "TEXT_NODE", 3);
    record_defineProperty(this, "nodeType", void 0);
    record_defineProperty(this, "nodeName", void 0);
    record_defineProperty(this, "RRNodeType", void 0);
  }
  return record_createClass(BaseRRNode, [{
    key: "childNodes",
    get: function get() {
      var childNodes = [];
      var childIterator = this.firstChild;
      while (childIterator) {
        childNodes.push(childIterator);
        childIterator = childIterator.nextSibling;
      }
      return childNodes;
    }
  }, {
    key: "contains",
    value: function contains(node) {
      if (!(node instanceof BaseRRNode)) return false;else if (node.ownerDocument !== this.ownerDocument) return false;else if (node === this) return true;
      while (node.parentNode) {
        if (node.parentNode === this) return true;
        node = node.parentNode;
      }
      return false;
    }
  }, {
    key: "appendChild",
    value: function appendChild(_newChild) {
      throw new Error("RRDomException: Failed to execute 'appendChild' on 'RRNode': This RRNode type does not support this method.");
    }
  }, {
    key: "insertBefore",
    value: function insertBefore(_newChild, _refChild) {
      throw new Error("RRDomException: Failed to execute 'insertBefore' on 'RRNode': This RRNode type does not support this method.");
    }
  }, {
    key: "removeChild",
    value: function removeChild(_node) {
      throw new Error("RRDomException: Failed to execute 'removeChild' on 'RRNode': This RRNode type does not support this method.");
    }
  }, {
    key: "toString",
    value: function toString() {
      return "RRNode";
    }
  }]);
}();
// ../rrweb/src/utils.ts
function on(type, fn) {
  var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;
  var options = {
    capture: true,
    passive: true
  };
  target.addEventListener(type, fn, options);
  return function () {
    return target.removeEventListener(type, fn, options);
  };
}
var DEPARTED_MIRROR_ACCESS_WARNING = "Please stop import mirror directly. Instead of that,\r\nnow you can use replayer.getMirror() to access the mirror instance of a replayer,\r\nor you can use record.mirror to access the mirror instance during recording.";
/** @deprecated */
var _mirror = {
  map: {},
  getId: function getId() {
    console.error(DEPARTED_MIRROR_ACCESS_WARNING);
    return -1;
  },
  getNode: function getNode() {
    console.error(DEPARTED_MIRROR_ACCESS_WARNING);
    return null;
  },
  removeNodeFromMap: function removeNodeFromMap() {
    console.error(DEPARTED_MIRROR_ACCESS_WARNING);
  },
  has: function has() {
    console.error(DEPARTED_MIRROR_ACCESS_WARNING);
    return false;
  },
  reset: function reset() {
    console.error(DEPARTED_MIRROR_ACCESS_WARNING);
  }
};
if (typeof window !== "undefined" && window.Proxy && window.Reflect) _mirror = new Proxy(_mirror, {
  get: function get(target, prop, receiver) {
    if (prop === "map") console.error(DEPARTED_MIRROR_ACCESS_WARNING);
    return Reflect.get(target, prop, receiver);
  }
});
function throttle(func, wait) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var timeout = null;
  var previous = 0;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    var context = this;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
    } else if (!timeout && options.trailing !== false) timeout = setTimeout(function () {
      previous = options.leading === false ? 0 : Date.now();
      timeout = null;
      func.apply(context, args);
    }, remaining);
  };
}
function hookSetter(target, key, d, isRevoked) {
  var win = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : window;
  var original = win.Object.getOwnPropertyDescriptor(target, key);
  win.Object.defineProperty(target, key, isRevoked ? d : {
    set: function set(value) {
      var _this2 = this;
      setTimeout(function () {
        d.set.call(_this2, value);
      }, 0);
      if (original && original.set) original.set.call(this, value);
    }
  });
  return function () {
    return hookSetter(target, key, original || {}, true);
  };
}
function getWindowScroll(win) {
  var _src_default$parentEl, _doc$body, _src_default$parentEl2, _doc$body2;
  var doc = win.document;
  return {
    left: doc.scrollingElement ? doc.scrollingElement.scrollLeft : win.pageXOffset !== void 0 ? win.pageXOffset : doc.documentElement.scrollLeft || (doc === null || doc === void 0 ? void 0 : doc.body) && ((_src_default$parentEl = src_default.parentElement(doc.body)) === null || _src_default$parentEl === void 0 ? void 0 : _src_default$parentEl.scrollLeft) || (doc === null || doc === void 0 || (_doc$body = doc.body) === null || _doc$body === void 0 ? void 0 : _doc$body.scrollLeft) || 0,
    top: doc.scrollingElement ? doc.scrollingElement.scrollTop : win.pageYOffset !== void 0 ? win.pageYOffset : (doc === null || doc === void 0 ? void 0 : doc.documentElement.scrollTop) || (doc === null || doc === void 0 ? void 0 : doc.body) && ((_src_default$parentEl2 = src_default.parentElement(doc.body)) === null || _src_default$parentEl2 === void 0 ? void 0 : _src_default$parentEl2.scrollTop) || (doc === null || doc === void 0 || (_doc$body2 = doc.body) === null || _doc$body2 === void 0 ? void 0 : _doc$body2.scrollTop) || 0
  };
}
function getWindowHeight() {
  return window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body && document.body.clientHeight;
}
function getWindowWidth() {
  return window.innerWidth || document.documentElement && document.documentElement.clientWidth || document.body && document.body.clientWidth;
}
/**
* Returns the given node as an HTMLElement if it is one, otherwise the parent node as an HTMLElement
* @param node - node to check
* @returns HTMLElement or null
*/
function closestElementOfNode(node) {
  if (!node) return null;
  return node.nodeType === node.ELEMENT_NODE ? node : src_default.parentElement(node);
}
/**
* Checks if the given element set to be blocked by rrweb
* @param node - node to check
* @param blockClass - class name to check
* @param blockSelector - css selectors to check
* @param checkAncestors - whether to search through parent nodes for the block class
* @returns true/false if the node was blocked or not
*/
function isBlocked(node, blockClass, blockSelector, checkAncestors) {
  if (!node) return false;
  var el = closestElementOfNode(node);
  if (!el) return false;
  try {
    if (typeof blockClass === "string") {
      if (el.classList.contains(blockClass)) return true;
      if (checkAncestors && el.closest("." + blockClass) !== null) return true;
    } else if (classMatchesRegex(el, blockClass, checkAncestors)) return true;
  } catch (e) {}
  if (blockSelector) {
    if (el.matches(blockSelector)) return true;
    if (checkAncestors && el.closest(blockSelector) !== null) return true;
  }
  return false;
}
function isSerialized(n, mirror) {
  return mirror.getId(n) !== -1;
}
function isIgnored(n, mirror, slimDOMOptions) {
  if (n.tagName === "TITLE" && slimDOMOptions.headTitleMutations) return true;
  return mirror.getId(n) === -2;
}
function isAncestorRemoved(target, mirror) {
  if (isShadowRoot(target)) return false;
  var id = mirror.getId(target);
  if (!mirror.has(id)) return true;
  var parent = src_default.parentNode(target);
  if (parent && parent.nodeType === target.DOCUMENT_NODE) return false;
  if (!parent) return true;
  return isAncestorRemoved(parent, mirror);
}
function legacy_isTouchEvent(event) {
  return Boolean(event.changedTouches);
}
function polyfill() {
  var win = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
  if ("NodeList" in win && !win.NodeList.prototype.forEach) win.NodeList.prototype.forEach = Array.prototype.forEach;
  if ("DOMTokenList" in win && !win.DOMTokenList.prototype.forEach) win.DOMTokenList.prototype.forEach = Array.prototype.forEach;
}
function isSerializedIframe(n, mirror) {
  return Boolean(n.nodeName === "IFRAME" && mirror.getMeta(n));
}
function isSerializedStylesheet(n, mirror) {
  return Boolean(n.nodeName === "LINK" && n.nodeType === n.ELEMENT_NODE && n.getAttribute && n.getAttribute("rel") === "stylesheet" && mirror.getMeta(n));
}
function hasShadowRoot(n) {
  if (!n) return false;
  if (n instanceof BaseRRNode && "shadowRoot" in n) return Boolean(n.shadowRoot);
  return Boolean(src_default.shadowRoot(n));
}
var StyleSheetMirror = /*#__PURE__*/function () {
  function StyleSheetMirror() {
    record_classCallCheck(this, StyleSheetMirror);
    record_defineProperty(this, "id", 1);
    record_defineProperty(this, "styleIDMap", /* @__PURE__ */new WeakMap());
    record_defineProperty(this, "idStyleMap", /* @__PURE__ */new Map());
  }
  return record_createClass(StyleSheetMirror, [{
    key: "getId",
    value: function getId(stylesheet) {
      var _this$styleIDMap$get;
      return (_this$styleIDMap$get = this.styleIDMap.get(stylesheet)) !== null && _this$styleIDMap$get !== void 0 ? _this$styleIDMap$get : -1;
    }
  }, {
    key: "has",
    value: function has(stylesheet) {
      return this.styleIDMap.has(stylesheet);
    }
    /**
    * @returns If the stylesheet is in the mirror, returns the id of the stylesheet. If not, return the new assigned id.
    */
  }, {
    key: "add",
    value: function add(stylesheet, id) {
      if (this.has(stylesheet)) return this.getId(stylesheet);
      var newId;
      if (id === void 0) newId = this.id++;else newId = id;
      this.styleIDMap.set(stylesheet, newId);
      this.idStyleMap.set(newId, stylesheet);
      return newId;
    }
  }, {
    key: "getStyle",
    value: function getStyle(id) {
      return this.idStyleMap.get(id) || null;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.styleIDMap = /* @__PURE__ */new WeakMap();
      this.idStyleMap = /* @__PURE__ */new Map();
      this.id = 1;
    }
  }, {
    key: "generateId",
    value: function generateId() {
      return this.id++;
    }
  }]);
}();
/**
* Get the direct shadow host of a node in shadow dom. Returns null if it is not in a shadow dom.
*/
function getShadowHost(n) {
  var _src_default$getRootN;
  var shadowHost = null;
  if ("getRootNode" in n && ((_src_default$getRootN = src_default.getRootNode(n)) === null || _src_default$getRootN === void 0 ? void 0 : _src_default$getRootN.nodeType) === Node.DOCUMENT_FRAGMENT_NODE && src_default.host(src_default.getRootNode(n))) shadowHost = src_default.host(src_default.getRootNode(n));
  return shadowHost;
}
/**
* Get the root shadow host of a node in nested shadow doms. Returns the node itself if it is not in a shadow dom.
*/
function getRootShadowHost(n) {
  var rootShadowHost = n;
  var shadowHost;
  while (shadowHost = getShadowHost(rootShadowHost)) rootShadowHost = shadowHost;
  return rootShadowHost;
}
function shadowHostInDom(n) {
  var doc = src_default.ownerDocument(n);
  if (!doc) return false;
  var shadowHost = getRootShadowHost(n);
  return src_default.contains(doc, shadowHost);
}
function inDom(n) {
  var doc = src_default.ownerDocument(n);
  if (!doc) return false;
  return src_default.contains(doc, n) || shadowHostInDom(n);
}
// ../rrweb/src/record/mutation.ts
var moveKey = function moveKey(id, parentId) {
  return "".concat(id, "@").concat(parentId);
};
/**
* controls behaviour of a MutationObserver
*/
var MutationBuffer = /*#__PURE__*/function () {
  function MutationBuffer() {
    var _this3 = this;
    record_classCallCheck(this, MutationBuffer);
    record_defineProperty(this, "frozen", false);
    record_defineProperty(this, "locked", false);
    record_defineProperty(this, "texts", []);
    record_defineProperty(this, "attributes", []);
    record_defineProperty(this, "attributeMap", /* @__PURE__ */new WeakMap());
    record_defineProperty(this, "removes", []);
    record_defineProperty(this, "mapRemoves", []);
    record_defineProperty(this, "movedMap", {});
    /**
    * the browser MutationObserver emits multiple mutations after
    * a delay for performance reasons, making tracing added nodes hard
    * in our `processMutations` callback function.
    * For example, if we append an element el_1 into body, and then append
    * another element el_2 into el_1, these two mutations may be passed to the
    * callback function together when the two operations were done.
    * Generally we need to trace child nodes of newly added nodes, but in this
    * case if we count el_2 as el_1's child node in the first mutation record,
    * then we will count el_2 again in the second mutation record which was
    * duplicated.
    * To avoid of duplicate counting added nodes, we use a Set to store
    * added nodes and its child nodes during iterate mutation records. Then
    * collect added nodes from the Set which have no duplicate copy. But
    * this also causes newly added nodes will not be serialized with id ASAP,
    * which means all the id related calculation should be lazy too.
    */
    record_defineProperty(this, "addedSet", /* @__PURE__ */new Set());
    record_defineProperty(this, "movedSet", /* @__PURE__ */new Set());
    record_defineProperty(this, "droppedSet", /* @__PURE__ */new Set());
    record_defineProperty(this, "removesSubTreeCache", /* @__PURE__ */new Set());
    record_defineProperty(this, "mutationCb", void 0);
    record_defineProperty(this, "blockClass", void 0);
    record_defineProperty(this, "blockSelector", void 0);
    record_defineProperty(this, "maskTextClass", void 0);
    record_defineProperty(this, "maskTextSelector", void 0);
    record_defineProperty(this, "inlineStylesheet", void 0);
    record_defineProperty(this, "maskInputOptions", void 0);
    record_defineProperty(this, "maskTextFn", void 0);
    record_defineProperty(this, "maskInputFn", void 0);
    record_defineProperty(this, "keepIframeSrcFn", void 0);
    record_defineProperty(this, "recordCanvas", void 0);
    record_defineProperty(this, "inlineImages", void 0);
    record_defineProperty(this, "slimDOMOptions", void 0);
    record_defineProperty(this, "dataURLOptions", void 0);
    record_defineProperty(this, "doc", void 0);
    record_defineProperty(this, "mirror", void 0);
    record_defineProperty(this, "iframeManager", void 0);
    record_defineProperty(this, "stylesheetManager", void 0);
    record_defineProperty(this, "shadowDomManager", void 0);
    record_defineProperty(this, "processedNodeManager", void 0);
    record_defineProperty(this, "unattachedDoc", void 0);
    record_defineProperty(this, "processMutations", function (mutations) {
      mutations.forEach(_this3.processMutation);
      _this3.emit();
    });
    record_defineProperty(this, "emit", function () {
      if (_this3.frozen || _this3.locked) return;
      var adds = [];
      var addedIds = /* @__PURE__ */new Set();
      while (_this3.mapRemoves.length) _this3.mirror.removeNodeFromMap(_this3.mapRemoves.shift());
      var _iterator2 = record_createForOfIteratorHelper(_this3.movedSet),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _n = _step2.value;
          var _parentNode = src_default.parentNode(_n);
          if (_this3.removesSubTreeCache.has(_parentNode) && !_this3.movedSet.has(_parentNode)) continue;
          _this3.addedSet.add(_n);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      var n = null;
      var parentNode = null;
      var parentId = -1;
      var nextSibling = null;
      var ancestorBad = false;
      var missingParents = /* @__PURE__ */new Set();
      var iter = _this3.addedSet.values();
      var curr = iter.next();
      while (_this3.addedSet.size) {
        if (n !== null && _this3.addedSet.has(src_default.previousSibling(n))) {
          nextSibling = n;
          n = src_default.previousSibling(n);
        } else {
          if (!_this3.addedSet.has(curr.value)) curr = iter.next();
          n = curr.value;
          while (true) {
            parentNode = src_default.parentNode(n);
            if (_this3.addedSet.has(parentNode)) {
              n = parentNode;
              continue;
            }
            break;
          }
          if (missingParents.has(parentNode)) parentNode = null;else if (parentNode) {
            if (!inDom(parentNode)) ancestorBad = true;else {
              ancestorBad = isSelfOrAncestorInSet(_this3.droppedSet, parentNode) || _this3.removesSubTreeCache.has(parentNode);
              if (ancestorBad && isSelfOrAncestorInSet(_this3.movedSet, n)) ancestorBad = false;
            }
            if (_this3.addedSet.has(src_default.lastChild(parentNode))) {
              n = src_default.lastChild(parentNode);
              nextSibling = null;
            } else while (true) {
              nextSibling = src_default.nextSibling(n);
              if (_this3.addedSet.has(nextSibling)) {
                n = nextSibling;
                continue;
              }
              break;
            }
            parentId = isShadowRoot(parentNode) ? _this3.mirror.getId(getShadowHost(n)) : _this3.mirror.getId(parentNode);
            if (parentId === -1 && parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
              var shadowHost = src_default.host(parentNode);
              parentId = _this3.mirror.getId(shadowHost);
            }
          }
        }
        _this3.addedSet.delete(n);
        if (!parentNode || parentId === -1) {
          missingParents.add(n);
          continue;
        } else if (ancestorBad) {
          _this3.droppedSet.add(n);
          continue;
        }
        var cssCaptured = false;
        if (n.nodeType === Node.TEXT_NODE) {
          var parentTag = parentNode.tagName;
          if (parentTag === "TEXTAREA") continue;else if (parentTag === "STYLE" && addedIds.has(parentId)) cssCaptured = true;
        }
        var nextId = nextSibling ? _this3.mirror.getId(nextSibling) : null;
        while (nextId === -2) {
          nextSibling = nextSibling && src_default.nextSibling(nextSibling);
          nextId = nextSibling && _this3.mirror.getId(nextSibling);
        }
        if (nextId === -1) {
          console.warn("Couldn't record new node. Couldn't find mirror id for nextSibling:", nextSibling);
          n = null;
          continue;
        }
        var sn = serializeNodeWithId(n, {
          doc: _this3.doc,
          mirror: _this3.mirror,
          blockClass: _this3.blockClass,
          blockSelector: _this3.blockSelector,
          maskTextClass: _this3.maskTextClass,
          maskTextSelector: _this3.maskTextSelector,
          skipChild: true,
          newlyAddedElement: true,
          inlineStylesheet: _this3.inlineStylesheet,
          maskInputOptions: _this3.maskInputOptions,
          maskTextFn: _this3.maskTextFn,
          maskInputFn: _this3.maskInputFn,
          slimDOMOptions: _this3.slimDOMOptions,
          dataURLOptions: _this3.dataURLOptions,
          recordCanvas: _this3.recordCanvas,
          inlineImages: _this3.inlineImages,
          onSerialize: function onSerialize(currentN) {
            if (isSerializedIframe(currentN, _this3.mirror)) _this3.iframeManager.addIframe(currentN);
            if (isSerializedStylesheet(currentN, _this3.mirror)) _this3.stylesheetManager.trackLinkElement(currentN);
            if (hasShadowRoot(n)) _this3.shadowDomManager.addShadowRoot(src_default.shadowRoot(n), _this3.doc);
          },
          onIframeLoad: function onIframeLoad(iframe, childSn) {
            _this3.iframeManager.attachIframe(iframe, childSn);
            _this3.shadowDomManager.observeAttachShadow(iframe);
          },
          onStylesheetLoad: function onStylesheetLoad(link, childSn) {
            _this3.stylesheetManager.attachLinkElement(link, childSn);
          },
          cssCaptured: cssCaptured
        });
        if (sn) {
          adds.push({
            parentId: parentId,
            nextId: nextId,
            node: sn
          });
          addedIds.add(sn.id);
        }
      }
      var payload = {
        texts: _this3.texts.map(function (text) {
          var n = text.node;
          var parent = src_default.parentNode(n);
          if (parent && parent.tagName === "TEXTAREA") _this3.genTextAreaValueMutation(parent);
          return {
            id: _this3.mirror.getId(n),
            value: text.value
          };
        }).filter(function (text) {
          return !addedIds.has(text.id);
        }).filter(function (text) {
          return _this3.mirror.has(text.id);
        }),
        attributes: _this3.attributes.map(function (attribute) {
          var attributes = attribute.attributes;
          if (typeof attributes.style === "string") {
            var diffAsStr = JSON.stringify(attribute.styleDiff);
            var unchangedAsStr = JSON.stringify(attribute._unchangedStyles);
            if (diffAsStr.length < attributes.style.length) {
              if ((diffAsStr + unchangedAsStr).split("var(").length === attributes.style.split("var(").length) attributes.style = attribute.styleDiff;
            }
          }
          return {
            id: _this3.mirror.getId(attribute.node),
            attributes: attributes
          };
        }).filter(function (attribute) {
          return !addedIds.has(attribute.id);
        }).filter(function (attribute) {
          return _this3.mirror.has(attribute.id);
        }),
        removes: _this3.removes,
        adds: adds
      };
      if (!payload.texts.length && !payload.attributes.length && !payload.removes.length && !payload.adds.length) return;
      _this3.texts = [];
      _this3.attributes = [];
      _this3.attributeMap = /* @__PURE__ */new WeakMap();
      _this3.removes = [];
      _this3.addedSet = /* @__PURE__ */new Set();
      _this3.movedSet = /* @__PURE__ */new Set();
      _this3.droppedSet = /* @__PURE__ */new Set();
      _this3.removesSubTreeCache = /* @__PURE__ */new Set();
      _this3.movedMap = {};
      _this3.mutationCb(payload);
    });
    record_defineProperty(this, "genTextAreaValueMutation", function (textarea) {
      var item = _this3.attributeMap.get(textarea);
      if (!item) {
        item = {
          node: textarea,
          attributes: {},
          styleDiff: {},
          _unchangedStyles: {}
        };
        _this3.attributes.push(item);
        _this3.attributeMap.set(textarea, item);
      }
      var value = Array.from(src_default.childNodes(textarea), function (cn) {
        return src_default.textContent(cn) || "";
      }).join("");
      item.attributes.value = maskInputValue({
        element: textarea,
        maskInputOptions: _this3.maskInputOptions,
        tagName: textarea.tagName,
        type: getInputType(textarea),
        value: value,
        maskInputFn: _this3.maskInputFn
      });
    });
    record_defineProperty(this, "processMutation", function (m) {
      if (isIgnored(m.target, _this3.mirror, _this3.slimDOMOptions)) return;
      switch (m.type) {
        case "characterData":
          {
            var value = src_default.textContent(m.target);
            if (!isBlocked(m.target, _this3.blockClass, _this3.blockSelector, false) && value !== m.oldValue) _this3.texts.push({
              value: needMaskingText(m.target, _this3.maskTextClass, _this3.maskTextSelector, true) && value ? _this3.maskTextFn ? _this3.maskTextFn(value, closestElementOfNode(m.target)) : value.replace(/[\S]/g, "*") : value,
              node: m.target
            });
            break;
          }
        case "attributes":
          {
            var target = m.target;
            var tagNameLower = toLowerCase(target.tagName);
            var attributeName = m.attributeName;
            var _value2 = m.target.getAttribute(attributeName);
            if (attributeName === "value") {
              var type = getInputType(target);
              _value2 = maskInputValue({
                element: target,
                maskInputOptions: _this3.maskInputOptions,
                tagName: target.tagName,
                type: type,
                value: _value2,
                maskInputFn: _this3.maskInputFn
              });
            }
            if (isBlocked(m.target, _this3.blockClass, _this3.blockSelector, false) || _value2 === m.oldValue) return;
            var item = _this3.attributeMap.get(m.target);
            if (tagNameLower === "iframe" && attributeName === "src" && !_this3.keepIframeSrcFn(_value2)) {
              if (!target.contentDocument) attributeName = "rr_src";else return;
            }
            if (!item) {
              item = {
                node: m.target,
                attributes: {},
                styleDiff: {},
                _unchangedStyles: {}
              };
              _this3.attributes.push(item);
              _this3.attributeMap.set(m.target, item);
            }
            if (attributeName === "type" && tagNameLower === "input" && (m.oldValue || "").toLowerCase() === "password") target.setAttribute("data-rr-is-password", "true");
            if (!ignoreAttribute(tagNameLower, attributeName, _value2)) {
              item.attributes[attributeName] = transformAttribute(_this3.doc, tagNameLower, toLowerCase(attributeName), _value2);
              if (attributeName === "style") {
                if (!_this3.unattachedDoc) try {
                  _this3.unattachedDoc = document.implementation.createHTMLDocument();
                } catch (e) {
                  _this3.unattachedDoc = _this3.doc;
                }
                var old = _this3.unattachedDoc.createElement("span");
                if (m.oldValue) old.setAttribute("style", m.oldValue);
                for (var _i5 = 0, _Array$from3 = Array.from(target.style); _i5 < _Array$from3.length; _i5++) {
                  var pname = _Array$from3[_i5];
                  var newValue = target.style.getPropertyValue(pname);
                  var newPriority = target.style.getPropertyPriority(pname);
                  if (newValue !== old.style.getPropertyValue(pname) || newPriority !== old.style.getPropertyPriority(pname)) {
                    if (newPriority === "") item.styleDiff[pname] = newValue;else item.styleDiff[pname] = [newValue, newPriority];
                  } else item._unchangedStyles[pname] = [newValue, newPriority];
                }
                for (var _i6 = 0, _Array$from4 = Array.from(old.style); _i6 < _Array$from4.length; _i6++) {
                  var _pname = _Array$from4[_i6];
                  if (target.style.getPropertyValue(_pname) === "") item.styleDiff[_pname] = false;
                }
              } else if (attributeName === "open" && target.tagName === "DIALOG") {
                if (target.matches("dialog:modal")) item.attributes["rr_open_mode"] = "modal";else item.attributes["rr_open_mode"] = "non-modal";
              }
            }
            break;
          }
        case "childList":
          /**
          * Parent is blocked, ignore all child mutations
          */
          if (isBlocked(m.target, _this3.blockClass, _this3.blockSelector, true)) return;
          if (m.target.tagName === "TEXTAREA") {
            _this3.genTextAreaValueMutation(m.target);
            return;
          }
          m.addedNodes.forEach(function (n) {
            return _this3.genAdds(n, m.target);
          });
          m.removedNodes.forEach(function (n) {
            if (!inDom(n)) _this3.shadowDomManager.removeShadowRootsIn(n);
            var nodeId = _this3.mirror.getId(n);
            var parentId = isShadowRoot(m.target) ? _this3.mirror.getId(src_default.host(m.target)) : _this3.mirror.getId(m.target);
            if (isBlocked(m.target, _this3.blockClass, _this3.blockSelector, false) || isIgnored(n, _this3.mirror, _this3.slimDOMOptions) || !isSerialized(n, _this3.mirror)) return;
            if (_this3.addedSet.has(n)) {
              deepDelete(_this3.addedSet, n);
              _this3.droppedSet.add(n);
            } else if (_this3.addedSet.has(m.target) && nodeId === -1) {} else if (isAncestorRemoved(m.target, _this3.mirror)) {} else if (_this3.movedSet.has(n) && _this3.movedMap[moveKey(nodeId, parentId)]) deepDelete(_this3.movedSet, n);else {
              _this3.removes.push({
                parentId: parentId,
                id: nodeId,
                isShadow: isShadowRoot(m.target) && isNativeShadowDom(m.target) ? true : void 0
              });
              processRemoves(n, _this3.removesSubTreeCache);
            }
            _this3.mapRemoves.push(n);
          });
      }
    });
    /**
    * Make sure you check if `n`'s parent is blocked before calling this function
    * */
    record_defineProperty(this, "genAdds", function (n, target) {
      if (_this3.processedNodeManager.inOtherBuffer(n, _this3)) return;
      if (_this3.addedSet.has(n) || _this3.movedSet.has(n)) return;
      if (_this3.mirror.hasNode(n)) {
        if (isIgnored(n, _this3.mirror, _this3.slimDOMOptions)) return;
        _this3.movedSet.add(n);
        var targetId = null;
        if (target && _this3.mirror.hasNode(target)) targetId = _this3.mirror.getId(target);
        if (targetId && targetId !== -1) _this3.movedMap[moveKey(_this3.mirror.getId(n), targetId)] = true;
      } else {
        _this3.addedSet.add(n);
        _this3.droppedSet.delete(n);
      }
      if (!isBlocked(n, _this3.blockClass, _this3.blockSelector, false)) {
        src_default.childNodes(n).forEach(function (childN) {
          return _this3.genAdds(childN);
        });
        if (hasShadowRoot(n)) src_default.childNodes(src_default.shadowRoot(n)).forEach(function (childN) {
          _this3.processedNodeManager.add(childN, _this3);
          _this3.genAdds(childN, n);
        });
      }
    });
  }
  return record_createClass(MutationBuffer, [{
    key: "init",
    value: function init(options) {
      var _this4 = this;
      ["mutationCb", "blockClass", "blockSelector", "maskTextClass", "maskTextSelector", "inlineStylesheet", "maskInputOptions", "maskTextFn", "maskInputFn", "keepIframeSrcFn", "recordCanvas", "inlineImages", "slimDOMOptions", "dataURLOptions", "doc", "mirror", "iframeManager", "stylesheetManager", "shadowDomManager", "processedNodeManager"].forEach(function (key) {
        _this4[key] = options[key];
      });
    }
  }, {
    key: "freeze",
    value: function freeze() {
      this.frozen = true;
    }
  }, {
    key: "unfreeze",
    value: function unfreeze() {
      this.frozen = false;
      this.emit();
    }
  }, {
    key: "isFrozen",
    value: function isFrozen() {
      return this.frozen;
    }
  }, {
    key: "lock",
    value: function lock() {
      this.locked = true;
    }
  }, {
    key: "unlock",
    value: function unlock() {
      this.locked = false;
      this.emit();
    }
  }]);
}();
/**
* Some utils to handle the mutation observer DOM records.
* It should be more clear to extend the native data structure
* like Set and Map, but currently Typescript does not support
* that.
*/
function deepDelete(addsSet, n) {
  addsSet.delete(n);
  src_default.childNodes(n).forEach(function (childN) {
    return deepDelete(addsSet, childN);
  });
}
function processRemoves(n, cache) {
  var queue = [n];
  while (queue.length) {
    var next = queue.pop();
    if (cache.has(next)) continue;
    cache.add(next);
    src_default.childNodes(next).forEach(function (n) {
      return queue.push(n);
    });
  }
}
function isSelfOrAncestorInSet(set, n) {
  if (set.size === 0) return false;
  return _isSelfOrAncestorInSet(set, n);
}
function _isSelfOrAncestorInSet(set, n) {
  if (set.has(n)) return true;
  var parent = src_default.parentNode(n);
  if (!parent) return false;
  return _isSelfOrAncestorInSet(set, parent);
}
// ../rrweb/src/record/error-handler.ts
var errorHandler;
function registerErrorHandler(handler) {
  errorHandler = handler;
}
function unregisterErrorHandler() {
  errorHandler = void 0;
}
/**
* Wrap callbacks in a wrapper that allows to pass errors to a configured `errorHandler` method.
*/
var callbackWrapper = function callbackWrapper(cb) {
  if (!errorHandler) return cb;
  var rrwebWrapped = function rrwebWrapped() {
    try {
      return cb.apply(void 0, arguments);
    } catch (error) {
      if (errorHandler && errorHandler(error) === true) return;
      throw error;
    }
  };
  return rrwebWrapped;
};
// ../rrweb/src/record/observer.ts
var mutationBuffers = /* @__PURE__ */new Set();
function getEventTarget(event) {
  try {
    if ("composedPath" in event) {
      var path = event.composedPath();
      if (path.length) return path[0];
    } else if ("path" in event && event.path.length) return event.path[0];
  } catch (_unused3) {}
  return event && event.target;
}
function initMutationObserver(options, rootEl) {
  var mutationBuffer = new MutationBuffer();
  mutationBuffers.add(mutationBuffer);
  mutationBuffer.init(options);
  var _mutationObserverCtor = mutationObserverCtor(),
    _mutationObserverCtor2 = record_slicedToArray(_mutationObserverCtor, 2),
    ObserverCtor = _mutationObserverCtor2[0],
    releaseObserverConstructor = _mutationObserverCtor2[1];
  var observer = new ObserverCtor(callbackWrapper(mutationBuffer.processMutations.bind(mutationBuffer)));
  observer.observe(rootEl, {
    attributes: true,
    attributeOldValue: true,
    characterData: true,
    characterDataOldValue: true,
    childList: true,
    subtree: true
  });
  var stop = function stop() {
    observer.disconnect();
    mutationBuffers.delete(mutationBuffer);
    releaseObserverConstructor();
  };
  return stop;
}
function initMoveObserver(_ref3) {
  var mousemoveCb = _ref3.mousemoveCb,
    sampling = _ref3.sampling,
    doc = _ref3.doc,
    mirror = _ref3.mirror;
  if (sampling.mousemove === false) return function () {};
  var threshold = typeof sampling.mousemove === "number" ? sampling.mousemove : 50;
  var callbackThreshold = typeof sampling.mousemoveCallback === "number" ? sampling.mousemoveCallback : 500;
  var positions = [];
  var timeBaseline;
  var wrappedCb = throttle(callbackWrapper(function (source) {
    var totalOffset = Date.now() - timeBaseline;
    mousemoveCb(positions.map(function (p) {
      p.timeOffset -= totalOffset;
      return p;
    }), source);
    positions = [];
    timeBaseline = null;
  }), callbackThreshold);
  var updatePosition = callbackWrapper(throttle(callbackWrapper(function (evt) {
    var target = getEventTarget(evt);
    var _ref4 = legacy_isTouchEvent(evt) ? evt.changedTouches[0] : evt,
      clientX = _ref4.clientX,
      clientY = _ref4.clientY;
    if (!timeBaseline) timeBaseline = nowTimestamp();
    positions.push({
      x: clientX,
      y: clientY,
      id: mirror.getId(target),
      timeOffset: nowTimestamp() - timeBaseline
    });
    wrappedCb(typeof DragEvent !== "undefined" && evt instanceof DragEvent ? IncrementalSource.Drag : evt instanceof MouseEvent ? IncrementalSource.MouseMove : IncrementalSource.TouchMove);
  }), threshold, {
    trailing: false
  }));
  var handlers = [on("mousemove", updatePosition, doc), on("touchmove", updatePosition, doc), on("drag", updatePosition, doc)];
  return callbackWrapper(function () {
    handlers.forEach(function (h) {
      return h();
    });
  });
}
function initMouseInteractionObserver(_ref5) {
  var mouseInteractionCb = _ref5.mouseInteractionCb,
    doc = _ref5.doc,
    mirror = _ref5.mirror,
    blockClass = _ref5.blockClass,
    blockSelector = _ref5.blockSelector,
    sampling = _ref5.sampling;
  if (sampling.mouseInteraction === false) return function () {};
  var disableMap = sampling.mouseInteraction === true || sampling.mouseInteraction === void 0 ? {} : sampling.mouseInteraction;
  var handlers = [];
  var currentPointerType = null;
  var getHandler = function getHandler(eventKey) {
    return function (event) {
      var target = getEventTarget(event);
      if (isBlocked(target, blockClass, blockSelector, true)) return;
      var pointerType = null;
      var thisEventKey = eventKey;
      if ("pointerType" in event) {
        switch (event.pointerType) {
          case "mouse":
            pointerType = PointerTypes.Mouse;
            break;
          case "touch":
            pointerType = PointerTypes.Touch;
            break;
          case "pen":
            pointerType = PointerTypes.Pen;
        }
        if (pointerType === PointerTypes.Touch) {
          if (MouseInteractions[eventKey] === MouseInteractions.MouseDown) thisEventKey = "TouchStart";else if (MouseInteractions[eventKey] === MouseInteractions.MouseUp) thisEventKey = "TouchEnd";
        } else if (pointerType === PointerTypes.Pen) {}
      } else if (legacy_isTouchEvent(event)) pointerType = PointerTypes.Touch;
      if (pointerType !== null) {
        currentPointerType = pointerType;
        if (thisEventKey.startsWith("Touch") && pointerType === PointerTypes.Touch || thisEventKey.startsWith("Mouse") && pointerType === PointerTypes.Mouse) pointerType = null;
      } else if (MouseInteractions[eventKey] === MouseInteractions.Click) {
        pointerType = currentPointerType;
        currentPointerType = null;
      }
      var e = legacy_isTouchEvent(event) ? event.changedTouches[0] : event;
      if (!e) return;
      var id = mirror.getId(target);
      var clientX = e.clientX,
        clientY = e.clientY;
      callbackWrapper(mouseInteractionCb)(record_objectSpread({
        type: MouseInteractions[thisEventKey],
        id: id,
        x: clientX,
        y: clientY
      }, pointerType !== null && {
        pointerType: pointerType
      }));
    };
  };
  Object.keys(MouseInteractions).filter(function (key) {
    return Number.isNaN(Number(key)) && !key.endsWith("_Departed") && disableMap[key] !== false;
  }).forEach(function (eventKey) {
    var eventName = toLowerCase(eventKey);
    var handler = getHandler(eventKey);
    if (window.PointerEvent) switch (MouseInteractions[eventKey]) {
      case MouseInteractions.MouseDown:
      case MouseInteractions.MouseUp:
        eventName = eventName.replace("mouse", "pointer");
        break;
      case MouseInteractions.TouchStart:
      case MouseInteractions.TouchEnd:
        return;
    }
    handlers.push(on(eventName, handler, doc));
  });
  return callbackWrapper(function () {
    handlers.forEach(function (h) {
      return h();
    });
  });
}
function initScrollObserver(_ref6) {
  var scrollCb = _ref6.scrollCb,
    doc = _ref6.doc,
    mirror = _ref6.mirror,
    blockClass = _ref6.blockClass,
    blockSelector = _ref6.blockSelector,
    sampling = _ref6.sampling;
  return on("scroll", callbackWrapper(throttle(callbackWrapper(function (evt) {
    var target = getEventTarget(evt);
    if (!target || isBlocked(target, blockClass, blockSelector, true)) return;
    var id = mirror.getId(target);
    if (target === doc && doc.defaultView) {
      var scrollLeftTop = getWindowScroll(doc.defaultView);
      scrollCb({
        id: id,
        x: scrollLeftTop.left,
        y: scrollLeftTop.top
      });
    } else scrollCb({
      id: id,
      x: target.scrollLeft,
      y: target.scrollTop
    });
  }), sampling.scroll || 100)), doc);
}
function initViewportResizeObserver(_ref7, _ref8) {
  var viewportResizeCb = _ref7.viewportResizeCb;
  var win = _ref8.win;
  var lastH = -1;
  var lastW = -1;
  return on("resize", callbackWrapper(throttle(callbackWrapper(function () {
    var height = getWindowHeight();
    var width = getWindowWidth();
    if (lastH !== height || lastW !== width) {
      viewportResizeCb({
        width: Number(width),
        height: Number(height)
      });
      lastH = height;
      lastW = width;
    }
  }), 200)), win);
}
var INPUT_TAGS = ["INPUT", "TEXTAREA", "SELECT"];
var lastInputValueMap = /* @__PURE__ */new WeakMap();
function initInputObserver(_ref9) {
  var inputCb = _ref9.inputCb,
    doc = _ref9.doc,
    mirror = _ref9.mirror,
    blockClass = _ref9.blockClass,
    blockSelector = _ref9.blockSelector,
    ignoreClass = _ref9.ignoreClass,
    ignoreSelector = _ref9.ignoreSelector,
    maskInputOptions = _ref9.maskInputOptions,
    maskInputFn = _ref9.maskInputFn,
    sampling = _ref9.sampling,
    userTriggeredOnInput = _ref9.userTriggeredOnInput;
  function eventHandler(event) {
    var target = getEventTarget(event);
    var userTriggered = event.isTrusted;
    var tagName = target && target.tagName;
    /**
    * If a site changes the value 'selected' of an option element, the value of its parent element, usually a select element, will be changed as well.
    * We can treat this change as a value change of the select element the current target belongs to.
    */
    if (target && tagName === "OPTION") target = src_default.parentElement(target);
    if (!target || !tagName || INPUT_TAGS.indexOf(tagName) < 0 || isBlocked(target, blockClass, blockSelector, true)) return;
    if (target.classList.contains(ignoreClass) || ignoreSelector && target.matches(ignoreSelector)) return;
    var text = target.value;
    var isChecked = false;
    var type = getInputType(target) || "";
    if (type === "radio" || type === "checkbox") isChecked = target.checked;else if (maskInputOptions[tagName.toLowerCase()] || maskInputOptions[type]) text = maskInputValue({
      element: target,
      maskInputOptions: maskInputOptions,
      tagName: tagName,
      type: type,
      value: text,
      maskInputFn: maskInputFn
    });
    cbWithDedup(target, userTriggeredOnInput ? {
      text: text,
      isChecked: isChecked,
      userTriggered: userTriggered
    } : {
      text: text,
      isChecked: isChecked
    });
    var name = target.name;
    if (type === "radio" && name && isChecked) doc.querySelectorAll("input[type=\"radio\"][name=\"".concat(name, "\"]")).forEach(function (el) {
      if (el !== target) {
        var _text = el.value;
        cbWithDedup(el, userTriggeredOnInput ? {
          text: _text,
          isChecked: !isChecked,
          userTriggered: false
        } : {
          text: _text,
          isChecked: !isChecked
        });
      }
    });
  }
  function cbWithDedup(target, v) {
    var lastInputValue = lastInputValueMap.get(target);
    if (!lastInputValue || lastInputValue.text !== v.text || lastInputValue.isChecked !== v.isChecked) {
      lastInputValueMap.set(target, v);
      var id = mirror.getId(target);
      callbackWrapper(inputCb)(record_objectSpread(record_objectSpread({}, v), {}, {
        id: id
      }));
    }
  }
  var handlers = (sampling.input === "last" ? ["change"] : ["input", "change"]).map(function (eventName) {
    return on(eventName, callbackWrapper(eventHandler), doc);
  });
  var currentWindow = doc.defaultView;
  if (!currentWindow) return function () {
    handlers.forEach(function (h) {
      return h();
    });
  };
  var propertyDescriptor = currentWindow.Object.getOwnPropertyDescriptor(currentWindow.HTMLInputElement.prototype, "value");
  var hookProperties = [[currentWindow.HTMLInputElement.prototype, "value"], [currentWindow.HTMLInputElement.prototype, "checked"], [currentWindow.HTMLSelectElement.prototype, "value"], [currentWindow.HTMLTextAreaElement.prototype, "value"], [currentWindow.HTMLSelectElement.prototype, "selectedIndex"], [currentWindow.HTMLOptionElement.prototype, "selected"]];
  if (propertyDescriptor && propertyDescriptor.set) handlers.push.apply(handlers, record_toConsumableArray(hookProperties.map(function (p) {
    return hookSetter(p[0], p[1], {
      set: function set() {
        callbackWrapper(eventHandler)({
          target: this,
          isTrusted: false
        });
      }
    }, false, currentWindow);
  })));
  return callbackWrapper(function () {
    handlers.forEach(function (h) {
      return h();
    });
  });
}
function getNestedCSSRulePositions(rule) {
  var positions = [];
  function recurse(childRule, pos) {
    if (hasNestedCSSRule("CSSGroupingRule") && childRule.parentRule instanceof CSSGroupingRule || hasNestedCSSRule("CSSMediaRule") && childRule.parentRule instanceof CSSMediaRule || hasNestedCSSRule("CSSSupportsRule") && childRule.parentRule instanceof CSSSupportsRule || hasNestedCSSRule("CSSConditionRule") && childRule.parentRule instanceof CSSConditionRule) {
      var index = Array.from(childRule.parentRule.cssRules).indexOf(childRule);
      pos.unshift(index);
      return recurse(childRule.parentRule, pos);
    } else if (childRule.parentStyleSheet) {
      var _index = Array.from(childRule.parentStyleSheet.cssRules).indexOf(childRule);
      pos.unshift(_index);
    }
    return pos;
  }
  return recurse(rule, positions);
}
/**
* For StyleSheets in Element, this function retrieves id of its host element.
* For adopted StyleSheets, this function retrieves its styleId from a styleMirror.
*/
function getIdAndStyleId(sheet, mirror, styleMirror) {
  var id, styleId;
  if (!sheet) return {};
  if (sheet.ownerNode) id = mirror.getId(sheet.ownerNode);else styleId = styleMirror.getId(sheet);
  return {
    styleId: styleId,
    id: id
  };
}
function initStyleSheetObserver(_ref0, _ref1) {
  var styleSheetRuleCb = _ref0.styleSheetRuleCb,
    mirror = _ref0.mirror,
    stylesheetManager = _ref0.stylesheetManager;
  var win = _ref1.win;
  if (!win.CSSStyleSheet || !win.CSSStyleSheet.prototype) return function () {};
  var insertRule = win.CSSStyleSheet.prototype.insertRule;
  win.CSSStyleSheet.prototype.insertRule = new Proxy(insertRule, {
    apply: callbackWrapper(function (target, thisArg, argumentsList) {
      var _argumentsList = record_slicedToArray(argumentsList, 2),
        rule = _argumentsList[0],
        index = _argumentsList[1];
      var _getIdAndStyleId = getIdAndStyleId(thisArg, mirror, stylesheetManager.styleMirror),
        id = _getIdAndStyleId.id,
        styleId = _getIdAndStyleId.styleId;
      if (id && id !== -1 || styleId && styleId !== -1) styleSheetRuleCb({
        id: id,
        styleId: styleId,
        adds: [{
          rule: rule,
          index: index
        }]
      });
      return target.apply(thisArg, argumentsList);
    })
  });
  win.CSSStyleSheet.prototype.addRule = function (selector, styleBlock) {
    var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.cssRules.length;
    var rule = "".concat(selector, " { ").concat(styleBlock, " }");
    return win.CSSStyleSheet.prototype.insertRule.apply(this, [rule, index]);
  };
  var deleteRule = win.CSSStyleSheet.prototype.deleteRule;
  win.CSSStyleSheet.prototype.deleteRule = new Proxy(deleteRule, {
    apply: callbackWrapper(function (target, thisArg, argumentsList) {
      var _argumentsList2 = record_slicedToArray(argumentsList, 1),
        index = _argumentsList2[0];
      var _getIdAndStyleId2 = getIdAndStyleId(thisArg, mirror, stylesheetManager.styleMirror),
        id = _getIdAndStyleId2.id,
        styleId = _getIdAndStyleId2.styleId;
      if (id && id !== -1 || styleId && styleId !== -1) styleSheetRuleCb({
        id: id,
        styleId: styleId,
        removes: [{
          index: index
        }]
      });
      return target.apply(thisArg, argumentsList);
    })
  });
  win.CSSStyleSheet.prototype.removeRule = function (index) {
    return win.CSSStyleSheet.prototype.deleteRule.apply(this, [index]);
  };
  var replace;
  if (win.CSSStyleSheet.prototype.replace) {
    replace = win.CSSStyleSheet.prototype.replace;
    win.CSSStyleSheet.prototype.replace = new Proxy(replace, {
      apply: callbackWrapper(function (target, thisArg, argumentsList) {
        var _argumentsList3 = record_slicedToArray(argumentsList, 1),
          text = _argumentsList3[0];
        var _getIdAndStyleId3 = getIdAndStyleId(thisArg, mirror, stylesheetManager.styleMirror),
          id = _getIdAndStyleId3.id,
          styleId = _getIdAndStyleId3.styleId;
        if (id && id !== -1 || styleId && styleId !== -1) styleSheetRuleCb({
          id: id,
          styleId: styleId,
          replace: text
        });
        return target.apply(thisArg, argumentsList);
      })
    });
  }
  var replaceSync;
  if (win.CSSStyleSheet.prototype.replaceSync) {
    replaceSync = win.CSSStyleSheet.prototype.replaceSync;
    win.CSSStyleSheet.prototype.replaceSync = new Proxy(replaceSync, {
      apply: callbackWrapper(function (target, thisArg, argumentsList) {
        var _argumentsList4 = record_slicedToArray(argumentsList, 1),
          text = _argumentsList4[0];
        var _getIdAndStyleId4 = getIdAndStyleId(thisArg, mirror, stylesheetManager.styleMirror),
          id = _getIdAndStyleId4.id,
          styleId = _getIdAndStyleId4.styleId;
        if (id && id !== -1 || styleId && styleId !== -1) styleSheetRuleCb({
          id: id,
          styleId: styleId,
          replaceSync: text
        });
        return target.apply(thisArg, argumentsList);
      })
    });
  }
  var supportedNestedCSSRuleTypes = {};
  if (canMonkeyPatchNestedCSSRule("CSSGroupingRule")) supportedNestedCSSRuleTypes.CSSGroupingRule = win.CSSGroupingRule;else {
    if (canMonkeyPatchNestedCSSRule("CSSMediaRule")) supportedNestedCSSRuleTypes.CSSMediaRule = win.CSSMediaRule;
    if (canMonkeyPatchNestedCSSRule("CSSConditionRule")) supportedNestedCSSRuleTypes.CSSConditionRule = win.CSSConditionRule;
    if (canMonkeyPatchNestedCSSRule("CSSSupportsRule")) supportedNestedCSSRuleTypes.CSSSupportsRule = win.CSSSupportsRule;
  }
  var unmodifiedFunctions = {};
  Object.entries(supportedNestedCSSRuleTypes).forEach(function (_ref10) {
    var _ref11 = record_slicedToArray(_ref10, 2),
      typeKey = _ref11[0],
      type = _ref11[1];
    unmodifiedFunctions[typeKey] = {
      insertRule: type.prototype.insertRule,
      deleteRule: type.prototype.deleteRule
    };
    type.prototype.insertRule = new Proxy(unmodifiedFunctions[typeKey].insertRule, {
      apply: callbackWrapper(function (target, thisArg, argumentsList) {
        var _argumentsList5 = record_slicedToArray(argumentsList, 2),
          rule = _argumentsList5[0],
          index = _argumentsList5[1];
        var _getIdAndStyleId5 = getIdAndStyleId(thisArg.parentStyleSheet, mirror, stylesheetManager.styleMirror),
          id = _getIdAndStyleId5.id,
          styleId = _getIdAndStyleId5.styleId;
        if (id && id !== -1 || styleId && styleId !== -1) styleSheetRuleCb({
          id: id,
          styleId: styleId,
          adds: [{
            rule: rule,
            index: [].concat(record_toConsumableArray(getNestedCSSRulePositions(thisArg)), [index || 0])
          }]
        });
        return target.apply(thisArg, argumentsList);
      })
    });
    type.prototype.deleteRule = new Proxy(unmodifiedFunctions[typeKey].deleteRule, {
      apply: callbackWrapper(function (target, thisArg, argumentsList) {
        var _argumentsList6 = record_slicedToArray(argumentsList, 1),
          index = _argumentsList6[0];
        var _getIdAndStyleId6 = getIdAndStyleId(thisArg.parentStyleSheet, mirror, stylesheetManager.styleMirror),
          id = _getIdAndStyleId6.id,
          styleId = _getIdAndStyleId6.styleId;
        if (id && id !== -1 || styleId && styleId !== -1) styleSheetRuleCb({
          id: id,
          styleId: styleId,
          removes: [{
            index: [].concat(record_toConsumableArray(getNestedCSSRulePositions(thisArg)), [index])
          }]
        });
        return target.apply(thisArg, argumentsList);
      })
    });
  });
  return callbackWrapper(function () {
    win.CSSStyleSheet.prototype.insertRule = insertRule;
    win.CSSStyleSheet.prototype.deleteRule = deleteRule;
    replace && (win.CSSStyleSheet.prototype.replace = replace);
    replaceSync && (win.CSSStyleSheet.prototype.replaceSync = replaceSync);
    Object.entries(supportedNestedCSSRuleTypes).forEach(function (_ref12) {
      var _ref13 = record_slicedToArray(_ref12, 2),
        typeKey = _ref13[0],
        type = _ref13[1];
      type.prototype.insertRule = unmodifiedFunctions[typeKey].insertRule;
      type.prototype.deleteRule = unmodifiedFunctions[typeKey].deleteRule;
    });
  });
}
function initAdoptedStyleSheetObserver(_ref14, host) {
  var _host$defaultView, _host$ownerDocument;
  var mirror = _ref14.mirror,
    stylesheetManager = _ref14.stylesheetManager;
  var hostId = null;
  if (host.nodeName === "#document") hostId = mirror.getId(host);else hostId = mirror.getId(src_default.host(host));
  var patchTarget = host.nodeName === "#document" ? (_host$defaultView = host.defaultView) === null || _host$defaultView === void 0 ? void 0 : _host$defaultView.Document : (_host$ownerDocument = host.ownerDocument) === null || _host$ownerDocument === void 0 || (_host$ownerDocument = _host$ownerDocument.defaultView) === null || _host$ownerDocument === void 0 ? void 0 : _host$ownerDocument.ShadowRoot;
  var originalPropertyDescriptor = patchTarget !== null && patchTarget !== void 0 && patchTarget.prototype ? Object.getOwnPropertyDescriptor(patchTarget === null || patchTarget === void 0 ? void 0 : patchTarget.prototype, "adoptedStyleSheets") : void 0;
  if (hostId === null || hostId === -1 || !patchTarget || !originalPropertyDescriptor) return function () {};
  Object.defineProperty(host, "adoptedStyleSheets", {
    configurable: originalPropertyDescriptor.configurable,
    enumerable: originalPropertyDescriptor.enumerable,
    get: function get() {
      var _originalPropertyDesc;
      return (_originalPropertyDesc = originalPropertyDescriptor.get) === null || _originalPropertyDesc === void 0 ? void 0 : _originalPropertyDesc.call(this);
    },
    set: function set(sheets) {
      var _originalPropertyDesc2;
      var result = (_originalPropertyDesc2 = originalPropertyDescriptor.set) === null || _originalPropertyDesc2 === void 0 ? void 0 : _originalPropertyDesc2.call(this, sheets);
      if (hostId !== null && hostId !== -1) try {
        stylesheetManager.adoptStyleSheets(sheets, hostId);
      } catch (e) {}
      return result;
    }
  });
  return callbackWrapper(function () {
    Object.defineProperty(host, "adoptedStyleSheets", {
      configurable: originalPropertyDescriptor.configurable,
      enumerable: originalPropertyDescriptor.enumerable,
      get: originalPropertyDescriptor.get,
      set: originalPropertyDescriptor.set
    });
  });
}
function initStyleDeclarationObserver(_ref15, _ref16) {
  var styleDeclarationCb = _ref15.styleDeclarationCb,
    mirror = _ref15.mirror,
    ignoreCSSAttributes = _ref15.ignoreCSSAttributes,
    stylesheetManager = _ref15.stylesheetManager;
  var win = _ref16.win;
  var setProperty = win.CSSStyleDeclaration.prototype.setProperty;
  win.CSSStyleDeclaration.prototype.setProperty = new Proxy(setProperty, {
    apply: callbackWrapper(function (target, thisArg, argumentsList) {
      var _thisArg$parentRule;
      var _argumentsList7 = record_slicedToArray(argumentsList, 3),
        property = _argumentsList7[0],
        value = _argumentsList7[1],
        priority = _argumentsList7[2];
      if (ignoreCSSAttributes.has(property)) return setProperty.apply(thisArg, [property, value, priority]);
      var _getIdAndStyleId7 = getIdAndStyleId((_thisArg$parentRule = thisArg.parentRule) === null || _thisArg$parentRule === void 0 ? void 0 : _thisArg$parentRule.parentStyleSheet, mirror, stylesheetManager.styleMirror),
        id = _getIdAndStyleId7.id,
        styleId = _getIdAndStyleId7.styleId;
      if (id && id !== -1 || styleId && styleId !== -1) styleDeclarationCb({
        id: id,
        styleId: styleId,
        set: {
          property: property,
          value: value,
          priority: priority
        },
        index: getNestedCSSRulePositions(thisArg.parentRule)
      });
      return target.apply(thisArg, argumentsList);
    })
  });
  var removeProperty = win.CSSStyleDeclaration.prototype.removeProperty;
  win.CSSStyleDeclaration.prototype.removeProperty = new Proxy(removeProperty, {
    apply: callbackWrapper(function (target, thisArg, argumentsList) {
      var _thisArg$parentRule2;
      var _argumentsList8 = record_slicedToArray(argumentsList, 1),
        property = _argumentsList8[0];
      if (ignoreCSSAttributes.has(property)) return removeProperty.apply(thisArg, [property]);
      var _getIdAndStyleId8 = getIdAndStyleId((_thisArg$parentRule2 = thisArg.parentRule) === null || _thisArg$parentRule2 === void 0 ? void 0 : _thisArg$parentRule2.parentStyleSheet, mirror, stylesheetManager.styleMirror),
        id = _getIdAndStyleId8.id,
        styleId = _getIdAndStyleId8.styleId;
      if (id && id !== -1 || styleId && styleId !== -1) styleDeclarationCb({
        id: id,
        styleId: styleId,
        remove: {
          property: property
        },
        index: getNestedCSSRulePositions(thisArg.parentRule)
      });
      return target.apply(thisArg, argumentsList);
    })
  });
  return callbackWrapper(function () {
    win.CSSStyleDeclaration.prototype.setProperty = setProperty;
    win.CSSStyleDeclaration.prototype.removeProperty = removeProperty;
  });
}
function initMediaInteractionObserver(_ref17) {
  var mediaInteractionCb = _ref17.mediaInteractionCb,
    blockClass = _ref17.blockClass,
    blockSelector = _ref17.blockSelector,
    mirror = _ref17.mirror,
    sampling = _ref17.sampling,
    doc = _ref17.doc;
  var handler = callbackWrapper(function (type) {
    return throttle(callbackWrapper(function (event) {
      var target = getEventTarget(event);
      if (!target || !(target instanceof HTMLMediaElement) || isBlocked(target, blockClass, blockSelector, true)) return;
      var currentTime = target.currentTime,
        volume = target.volume,
        muted = target.muted,
        playbackRate = target.playbackRate,
        loop = target.loop;
      mediaInteractionCb({
        type: type,
        id: mirror.getId(target),
        currentTime: currentTime,
        volume: volume,
        muted: muted,
        playbackRate: playbackRate,
        loop: loop
      });
    }), sampling.media || 500);
  });
  var handlers = [on("play", handler(MediaInteractions.Play), doc), on("pause", handler(MediaInteractions.Pause), doc), on("seeked", handler(MediaInteractions.Seeked), doc), on("volumechange", handler(MediaInteractions.VolumeChange), doc), on("ratechange", handler(MediaInteractions.RateChange), doc)];
  return callbackWrapper(function () {
    handlers.forEach(function (h) {
      return h();
    });
  });
}
function initFontObserver(_ref18) {
  var fontCb = _ref18.fontCb,
    doc = _ref18.doc;
  var win = doc.defaultView;
  if (!win) return function () {};
  var handlers = [];
  var fontMap = /* @__PURE__ */new WeakMap();
  var originalFontFace = win.FontFace;
  win.FontFace = function FontFace(family, source, descriptors) {
    var fontFace = new originalFontFace(family, source, descriptors);
    fontMap.set(fontFace, {
      family: family,
      buffer: typeof source !== "string",
      descriptors: descriptors,
      fontSource: typeof source === "string" ? source : JSON.stringify(Array.from(new Uint8Array(source)))
    });
    return fontFace;
  };
  var restoreHandler = patch(doc.fonts, "add", function (original) {
    return function (fontFace) {
      setTimeout(callbackWrapper(function () {
        var p = fontMap.get(fontFace);
        if (p) {
          fontCb(p);
          fontMap.delete(fontFace);
        }
      }), 0);
      return original.apply(this, [fontFace]);
    };
  });
  handlers.push(function () {
    win.FontFace = originalFontFace;
  });
  handlers.push(restoreHandler);
  return callbackWrapper(function () {
    handlers.forEach(function (h) {
      return h();
    });
  });
}
function initSelectionObserver(param) {
  var doc = param.doc,
    mirror = param.mirror,
    blockClass = param.blockClass,
    blockSelector = param.blockSelector,
    selectionCb = param.selectionCb;
  var collapsed = true;
  var updateSelection = callbackWrapper(function () {
    var selection = doc.getSelection();
    if (!selection || collapsed && selection !== null && selection !== void 0 && selection.isCollapsed) return;
    collapsed = selection.isCollapsed || false;
    var ranges = [];
    var count = selection.rangeCount || 0;
    for (var _i7 = 0; _i7 < count; _i7++) {
      var _selection$getRangeAt = selection.getRangeAt(_i7),
        startContainer = _selection$getRangeAt.startContainer,
        startOffset = _selection$getRangeAt.startOffset,
        endContainer = _selection$getRangeAt.endContainer,
        endOffset = _selection$getRangeAt.endOffset;
      if (isBlocked(startContainer, blockClass, blockSelector, true) || isBlocked(endContainer, blockClass, blockSelector, true)) continue;
      ranges.push({
        start: mirror.getId(startContainer),
        startOffset: startOffset,
        end: mirror.getId(endContainer),
        endOffset: endOffset
      });
    }
    selectionCb({
      ranges: ranges
    });
  });
  updateSelection();
  return on("selectionchange", updateSelection);
}
function initCustomElementObserver(_ref19) {
  var doc = _ref19.doc,
    customElementCb = _ref19.customElementCb;
  var win = doc.defaultView;
  if (!win || !win.customElements) return function () {};
  return patch(win.customElements, "define", function (original) {
    return function (name, constructor, options) {
      try {
        customElementCb({
          define: {
            name: name
          }
        });
      } catch (e) {
        console.warn("Custom element callback failed for ".concat(name));
      }
      return original.apply(this, [name, constructor, options]);
    };
  });
}
function mergeHooks(o, hooks) {
  var mutationCb = o.mutationCb,
    mousemoveCb = o.mousemoveCb,
    mouseInteractionCb = o.mouseInteractionCb,
    scrollCb = o.scrollCb,
    viewportResizeCb = o.viewportResizeCb,
    inputCb = o.inputCb,
    mediaInteractionCb = o.mediaInteractionCb,
    styleSheetRuleCb = o.styleSheetRuleCb,
    styleDeclarationCb = o.styleDeclarationCb,
    canvasMutationCb = o.canvasMutationCb,
    fontCb = o.fontCb,
    selectionCb = o.selectionCb,
    customElementCb = o.customElementCb;
  o.mutationCb = function () {
    if (hooks.mutation) hooks.mutation.apply(hooks, arguments);
    mutationCb.apply(void 0, arguments);
  };
  o.mousemoveCb = function () {
    if (hooks.mousemove) hooks.mousemove.apply(hooks, arguments);
    mousemoveCb.apply(void 0, arguments);
  };
  o.mouseInteractionCb = function () {
    if (hooks.mouseInteraction) hooks.mouseInteraction.apply(hooks, arguments);
    mouseInteractionCb.apply(void 0, arguments);
  };
  o.scrollCb = function () {
    if (hooks.scroll) hooks.scroll.apply(hooks, arguments);
    scrollCb.apply(void 0, arguments);
  };
  o.viewportResizeCb = function () {
    if (hooks.viewportResize) hooks.viewportResize.apply(hooks, arguments);
    viewportResizeCb.apply(void 0, arguments);
  };
  o.inputCb = function () {
    if (hooks.input) hooks.input.apply(hooks, arguments);
    inputCb.apply(void 0, arguments);
  };
  o.mediaInteractionCb = function () {
    if (hooks.mediaInteaction) hooks.mediaInteaction.apply(hooks, arguments);
    mediaInteractionCb.apply(void 0, arguments);
  };
  o.styleSheetRuleCb = function () {
    if (hooks.styleSheetRule) hooks.styleSheetRule.apply(hooks, arguments);
    styleSheetRuleCb.apply(void 0, arguments);
  };
  o.styleDeclarationCb = function () {
    if (hooks.styleDeclaration) hooks.styleDeclaration.apply(hooks, arguments);
    styleDeclarationCb.apply(void 0, arguments);
  };
  o.canvasMutationCb = function () {
    if (hooks.canvasMutation) hooks.canvasMutation.apply(hooks, arguments);
    canvasMutationCb.apply(void 0, arguments);
  };
  o.fontCb = function () {
    if (hooks.font) hooks.font.apply(hooks, arguments);
    fontCb.apply(void 0, arguments);
  };
  o.selectionCb = function () {
    if (hooks.selection) hooks.selection.apply(hooks, arguments);
    selectionCb.apply(void 0, arguments);
  };
  o.customElementCb = function () {
    if (hooks.customElement) hooks.customElement.apply(hooks, arguments);
    customElementCb.apply(void 0, arguments);
  };
}
function initObservers(o) {
  var hooks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var currentWindow = o.doc.defaultView;
  if (!currentWindow) return function () {};
  mergeHooks(o, hooks);
  var stopMutationObserver;
  if (o.recordDOM) stopMutationObserver = initMutationObserver(o, o.doc);
  var mousemoveHandler = initMoveObserver(o);
  var mouseInteractionHandler = initMouseInteractionObserver(o);
  var scrollHandler = initScrollObserver(o);
  var viewportResizeHandler = initViewportResizeObserver(o, {
    win: currentWindow
  });
  var inputHandler = initInputObserver(o);
  var mediaInteractionHandler = initMediaInteractionObserver(o);
  var styleSheetObserver = function styleSheetObserver() {};
  var adoptedStyleSheetObserver = function adoptedStyleSheetObserver() {};
  var styleDeclarationObserver = function styleDeclarationObserver() {};
  var fontObserver = function fontObserver() {};
  if (o.recordDOM) {
    styleSheetObserver = initStyleSheetObserver(o, {
      win: currentWindow
    });
    adoptedStyleSheetObserver = initAdoptedStyleSheetObserver(o, o.doc);
    styleDeclarationObserver = initStyleDeclarationObserver(o, {
      win: currentWindow
    });
    if (o.collectFonts) fontObserver = initFontObserver(o);
  }
  var selectionObserver = initSelectionObserver(o);
  var customElementObserver = initCustomElementObserver(o);
  var pluginHandlers = [];
  var _iterator3 = record_createForOfIteratorHelper(o.plugins),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var plugin = _step3.value;
      pluginHandlers.push(plugin.observer(plugin.callback, currentWindow, plugin.options));
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  return callbackWrapper(function () {
    var _stopMutationObserver;
    (_stopMutationObserver = stopMutationObserver) === null || _stopMutationObserver === void 0 || _stopMutationObserver();
    mousemoveHandler();
    mouseInteractionHandler();
    scrollHandler();
    viewportResizeHandler();
    inputHandler();
    mediaInteractionHandler();
    styleSheetObserver();
    adoptedStyleSheetObserver();
    styleDeclarationObserver();
    fontObserver();
    selectionObserver();
    customElementObserver();
    pluginHandlers.forEach(function (h) {
      return h();
    });
  });
}
function hasNestedCSSRule(prop) {
  return typeof window[prop] !== "undefined";
}
function canMonkeyPatchNestedCSSRule(prop) {
  return Boolean(typeof window[prop] !== "undefined" && window[prop].prototype && "insertRule" in window[prop].prototype && "deleteRule" in window[prop].prototype);
}
// ../rrweb/src/record/cross-origin-iframe-mirror.ts
var CrossOriginIframeMirror = /*#__PURE__*/function () {
  function CrossOriginIframeMirror(generateIdFn) {
    record_classCallCheck(this, CrossOriginIframeMirror);
    record_defineProperty(this, "generateIdFn", void 0);
    record_defineProperty(this, "iframeIdToRemoteIdMap", /* @__PURE__ */new WeakMap());
    record_defineProperty(this, "iframeRemoteIdToIdMap", /* @__PURE__ */new WeakMap());
    this.generateIdFn = generateIdFn;
  }
  return record_createClass(CrossOriginIframeMirror, [{
    key: "getId",
    value: function getId(iframe, remoteId, idToRemoteMap, remoteToIdMap) {
      var idToRemoteIdMap = idToRemoteMap || this.getIdToRemoteIdMap(iframe);
      var remoteIdToIdMap = remoteToIdMap || this.getRemoteIdToIdMap(iframe);
      var id = idToRemoteIdMap.get(remoteId);
      if (!id) {
        id = this.generateIdFn();
        idToRemoteIdMap.set(remoteId, id);
        remoteIdToIdMap.set(id, remoteId);
      }
      return id;
    }
  }, {
    key: "getIds",
    value: function getIds(iframe, remoteId) {
      var _this5 = this;
      var idToRemoteIdMap = this.getIdToRemoteIdMap(iframe);
      var remoteIdToIdMap = this.getRemoteIdToIdMap(iframe);
      return remoteId.map(function (id) {
        return _this5.getId(iframe, id, idToRemoteIdMap, remoteIdToIdMap);
      });
    }
  }, {
    key: "getRemoteId",
    value: function getRemoteId(iframe, id, map) {
      var remoteIdToIdMap = map || this.getRemoteIdToIdMap(iframe);
      if (typeof id !== "number") return id;
      var remoteId = remoteIdToIdMap.get(id);
      if (!remoteId) return -1;
      return remoteId;
    }
  }, {
    key: "getRemoteIds",
    value: function getRemoteIds(iframe, ids) {
      var _this6 = this;
      var remoteIdToIdMap = this.getRemoteIdToIdMap(iframe);
      return ids.map(function (id) {
        return _this6.getRemoteId(iframe, id, remoteIdToIdMap);
      });
    }
  }, {
    key: "reset",
    value: function reset(iframe) {
      if (!iframe) {
        this.iframeIdToRemoteIdMap = /* @__PURE__ */new WeakMap();
        this.iframeRemoteIdToIdMap = /* @__PURE__ */new WeakMap();
        return;
      }
      this.iframeIdToRemoteIdMap.delete(iframe);
      this.iframeRemoteIdToIdMap.delete(iframe);
    }
  }, {
    key: "getIdToRemoteIdMap",
    value: function getIdToRemoteIdMap(iframe) {
      var idToRemoteIdMap = this.iframeIdToRemoteIdMap.get(iframe);
      if (!idToRemoteIdMap) {
        idToRemoteIdMap = /* @__PURE__ */new Map();
        this.iframeIdToRemoteIdMap.set(iframe, idToRemoteIdMap);
      }
      return idToRemoteIdMap;
    }
  }, {
    key: "getRemoteIdToIdMap",
    value: function getRemoteIdToIdMap(iframe) {
      var remoteIdToIdMap = this.iframeRemoteIdToIdMap.get(iframe);
      if (!remoteIdToIdMap) {
        remoteIdToIdMap = /* @__PURE__ */new Map();
        this.iframeRemoteIdToIdMap.set(iframe, remoteIdToIdMap);
      }
      return remoteIdToIdMap;
    }
  }]);
}();
// ../rrweb/src/record/iframe-manager.ts
var IframeManager = /*#__PURE__*/function () {
  function IframeManager(options) {
    var _this7 = this;
    record_classCallCheck(this, IframeManager);
    record_defineProperty(this, "iframes", /* @__PURE__ */new WeakMap());
    record_defineProperty(this, "crossOriginIframeMap", /* @__PURE__ */new WeakMap());
    record_defineProperty(this, "crossOriginIframeMirror", new CrossOriginIframeMirror(genId));
    record_defineProperty(this, "crossOriginIframeStyleMirror", void 0);
    record_defineProperty(this, "crossOriginIframeRootIdMap", /* @__PURE__ */new WeakMap());
    record_defineProperty(this, "mirror", void 0);
    record_defineProperty(this, "mutationCb", void 0);
    record_defineProperty(this, "wrappedEmit", void 0);
    record_defineProperty(this, "loadListener", void 0);
    record_defineProperty(this, "unloadListener", void 0);
    record_defineProperty(this, "attachedWindows", /* @__PURE__ */new Map());
    record_defineProperty(this, "messageHandler", function (message) {
      return _this7.handleMessage(message);
    });
    record_defineProperty(this, "stylesheetManager", void 0);
    record_defineProperty(this, "recordCrossOriginIframes", void 0);
    this.mutationCb = options.mutationCb;
    this.wrappedEmit = options.wrappedEmit;
    this.stylesheetManager = options.stylesheetManager;
    this.recordCrossOriginIframes = options.recordCrossOriginIframes;
    this.crossOriginIframeStyleMirror = new CrossOriginIframeMirror(this.stylesheetManager.styleMirror.generateId.bind(this.stylesheetManager.styleMirror));
    this.mirror = options.mirror;
    if (this.recordCrossOriginIframes) window.addEventListener("message", this.messageHandler);
  }
  return record_createClass(IframeManager, [{
    key: "addIframe",
    value: function addIframe(iframeEl) {
      this.iframes.set(iframeEl, true);
      if (iframeEl.contentWindow) this.crossOriginIframeMap.set(iframeEl.contentWindow, iframeEl);
    }
  }, {
    key: "addLoadListener",
    value: function addLoadListener(cb) {
      this.loadListener = cb;
    }
  }, {
    key: "addUnloadListener",
    value: function addUnloadListener(cb) {
      this.unloadListener = cb;
    }
  }, {
    key: "attachIframe",
    value: function attachIframe(iframeEl, childSn) {
      var _this$loadListener;
      this.mutationCb({
        adds: [{
          parentId: this.mirror.getId(iframeEl),
          nextId: null,
          node: childSn
        }],
        removes: [],
        texts: [],
        attributes: [],
        isAttachIframe: true
      });
      this.watchIframeWindow(iframeEl);
      (_this$loadListener = this.loadListener) === null || _this$loadListener === void 0 || _this$loadListener.call(this, iframeEl);
      if (iframeEl.contentDocument && iframeEl.contentDocument.adoptedStyleSheets && iframeEl.contentDocument.adoptedStyleSheets.length > 0) this.stylesheetManager.adoptStyleSheets(iframeEl.contentDocument.adoptedStyleSheets, this.mirror.getId(iframeEl.contentDocument));
    }
  }, {
    key: "destroy",
    value: function destroy() {
      window.removeEventListener("message", this.messageHandler);
      this.attachedWindows.forEach(function (stop) {
        return stop();
      });
    }
  }, {
    key: "watchIframeWindow",
    value: function watchIframeWindow(iframeEl) {
      var _this8 = this;
      var win = iframeEl.contentWindow;
      if (!win || this.attachedWindows.has(win)) return;
      var handlers = [];
      var stop = function stop() {
        _this8.attachedWindows.delete(win);
        handlers.forEach(function (handler) {
          try {
            handler();
          } catch (_unused4) {}
        });
      };
      this.attachedWindows.set(win, stop);
      if (this.recordCrossOriginIframes) handlers.push(on("message", this.messageHandler, win));
      handlers.push(on("pagehide", function (event) {
        var _this8$unloadListener;
        if (event.persisted) return;
        var doc = win.document;
        stop();
        (_this8$unloadListener = _this8.unloadListener) === null || _this8$unloadListener === void 0 || _this8$unloadListener.call(_this8, doc);
      }, win));
    }
  }, {
    key: "handleMessage",
    value: function handleMessage(message) {
      var crossOriginMessageEvent = message;
      if (crossOriginMessageEvent.data.type !== "rrweb" || crossOriginMessageEvent.origin !== crossOriginMessageEvent.data.origin) return;
      if (!message.source) return;
      var iframeEl = this.crossOriginIframeMap.get(message.source);
      if (!iframeEl) return;
      var transformedEvent = this.transformCrossOriginEvent(iframeEl, crossOriginMessageEvent.data.event);
      if (transformedEvent) this.wrappedEmit(transformedEvent, crossOriginMessageEvent.data.isCheckout);
    }
  }, {
    key: "transformCrossOriginEvent",
    value: function transformCrossOriginEvent(iframeEl, e) {
      var _this9 = this,
        _e$data$styles;
      switch (e.type) {
        case EventType.FullSnapshot:
          {
            this.crossOriginIframeMirror.reset(iframeEl);
            this.crossOriginIframeStyleMirror.reset(iframeEl);
            /**
            * Replaces the original id of the iframe with a new set of unique ids
            */
            this.replaceIdOnNode(e.data.node, iframeEl);
            var rootId = e.data.node.id;
            this.crossOriginIframeRootIdMap.set(iframeEl, rootId);
            this.patchRootIdOnNode(e.data.node, rootId);
            return {
              timestamp: e.timestamp,
              type: EventType.IncrementalSnapshot,
              data: {
                source: IncrementalSource.Mutation,
                adds: [{
                  parentId: this.mirror.getId(iframeEl),
                  nextId: null,
                  node: e.data.node
                }],
                removes: [],
                texts: [],
                attributes: [],
                isAttachIframe: true
              }
            };
          }
        case EventType.Meta:
        case EventType.Load:
        case EventType.DomContentLoaded:
          return false;
        case EventType.Annotation:
        case EventType.Plugin:
          return e;
        case EventType.Custom:
          this.replaceIds(e.data.payload, iframeEl, ["id", "parentId", "previousId", "nextId"]);
          return e;
        case EventType.IncrementalSnapshot:
          switch (e.data.source) {
            case IncrementalSource.Mutation:
              e.data.adds.forEach(function (n) {
                _this9.replaceIds(n, iframeEl, ["parentId", "nextId", "previousId"]);
                _this9.replaceIdOnNode(n.node, iframeEl);
                var rootId = _this9.crossOriginIframeRootIdMap.get(iframeEl);
                rootId && _this9.patchRootIdOnNode(n.node, rootId);
              });
              e.data.removes.forEach(function (n) {
                _this9.replaceIds(n, iframeEl, ["parentId", "id"]);
              });
              e.data.attributes.forEach(function (n) {
                _this9.replaceIds(n, iframeEl, ["id"]);
              });
              e.data.texts.forEach(function (n) {
                _this9.replaceIds(n, iframeEl, ["id"]);
              });
              return e;
            case IncrementalSource.Drag:
            case IncrementalSource.TouchMove:
            case IncrementalSource.MouseMove:
              e.data.positions.forEach(function (p) {
                _this9.replaceIds(p, iframeEl, ["id"]);
              });
              return e;
            case IncrementalSource.ViewportResize:
              return false;
            case IncrementalSource.MediaInteraction:
            case IncrementalSource.MouseInteraction:
            case IncrementalSource.Scroll:
            case IncrementalSource.CanvasMutation:
            case IncrementalSource.Input:
              this.replaceIds(e.data, iframeEl, ["id"]);
              return e;
            case IncrementalSource.StyleSheetRule:
            case IncrementalSource.StyleDeclaration:
              this.replaceIds(e.data, iframeEl, ["id"]);
              this.replaceStyleIds(e.data, iframeEl, ["styleId"]);
              return e;
            case IncrementalSource.Font:
              return e;
            case IncrementalSource.Selection:
              e.data.ranges.forEach(function (range) {
                _this9.replaceIds(range, iframeEl, ["start", "end"]);
              });
              return e;
            case IncrementalSource.AdoptedStyleSheet:
              this.replaceIds(e.data, iframeEl, ["id"]);
              this.replaceStyleIds(e.data, iframeEl, ["styleIds"]);
              (_e$data$styles = e.data.styles) === null || _e$data$styles === void 0 || _e$data$styles.forEach(function (style) {
                _this9.replaceStyleIds(style, iframeEl, ["styleId"]);
              });
              return e;
          }
      }
      return false;
    }
  }, {
    key: "replace",
    value: function replace(iframeMirror, obj, iframeEl, keys) {
      var _iterator4 = record_createForOfIteratorHelper(keys),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var key = _step4.value;
          if (!Array.isArray(obj[key]) && typeof obj[key] !== "number") continue;
          if (Array.isArray(obj[key])) obj[key] = iframeMirror.getIds(iframeEl, obj[key]);else obj[key] = iframeMirror.getId(iframeEl, obj[key]);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      return obj;
    }
  }, {
    key: "replaceIds",
    value: function replaceIds(obj, iframeEl, keys) {
      return this.replace(this.crossOriginIframeMirror, obj, iframeEl, keys);
    }
  }, {
    key: "replaceStyleIds",
    value: function replaceStyleIds(obj, iframeEl, keys) {
      return this.replace(this.crossOriginIframeStyleMirror, obj, iframeEl, keys);
    }
  }, {
    key: "replaceIdOnNode",
    value: function replaceIdOnNode(node, iframeEl) {
      var _this0 = this;
      this.replaceIds(node, iframeEl, ["id", "rootId"]);
      if ("childNodes" in node) node.childNodes.forEach(function (child) {
        _this0.replaceIdOnNode(child, iframeEl);
      });
    }
  }, {
    key: "patchRootIdOnNode",
    value: function patchRootIdOnNode(node, rootId) {
      var _this1 = this;
      if (node.type !== NodeType.Document && !node.rootId) node.rootId = rootId;
      if ("childNodes" in node) node.childNodes.forEach(function (child) {
        _this1.patchRootIdOnNode(child, rootId);
      });
    }
  }]);
}();
// ../rrweb/src/record/shadow-dom-manager.ts
var ShadowDomManager = /*#__PURE__*/function () {
  function ShadowDomManager(options) {
    record_classCallCheck(this, ShadowDomManager);
    /** Observed shadow roots and the handlers that stop observing them. */
    record_defineProperty(this, "shadowDoms", /* @__PURE__ */new Map());
    record_defineProperty(this, "mutationCb", void 0);
    record_defineProperty(this, "scrollCb", void 0);
    record_defineProperty(this, "bypassOptions", void 0);
    record_defineProperty(this, "mirror", void 0);
    record_defineProperty(this, "restoreHandlers", []);
    this.mutationCb = options.mutationCb;
    this.scrollCb = options.scrollCb;
    this.bypassOptions = options.bypassOptions;
    this.mirror = options.mirror;
    this.init();
  }
  return record_createClass(ShadowDomManager, [{
    key: "init",
    value: function init() {
      this.reset();
      this.patchAttachShadow(Element, document);
    }
  }, {
    key: "addShadowRoot",
    value: function addShadowRoot(shadowRoot, doc) {
      var _this10 = this;
      if (!isNativeShadowDom(shadowRoot)) return;
      if (this.shadowDoms.has(shadowRoot)) return;
      var handlers = [];
      this.shadowDoms.set(shadowRoot, handlers);
      var stopMutationObserver = initMutationObserver(record_objectSpread(record_objectSpread({}, this.bypassOptions), {}, {
        doc: doc,
        mutationCb: this.mutationCb,
        mirror: this.mirror,
        shadowDomManager: this
      }), shadowRoot);
      handlers.push(stopMutationObserver);
      handlers.push(initScrollObserver(record_objectSpread(record_objectSpread({}, this.bypassOptions), {}, {
        scrollCb: this.scrollCb,
        doc: shadowRoot,
        mirror: this.mirror
      })));
      setTimeout(function () {
        if (_this10.shadowDoms.get(shadowRoot) !== handlers) return;
        if (shadowRoot.adoptedStyleSheets && shadowRoot.adoptedStyleSheets.length > 0) _this10.bypassOptions.stylesheetManager.adoptStyleSheets(shadowRoot.adoptedStyleSheets, _this10.mirror.getId(src_default.host(shadowRoot)));
        handlers.push(initAdoptedStyleSheetObserver({
          mirror: _this10.mirror,
          stylesheetManager: _this10.bypassOptions.stylesheetManager
        }, shadowRoot));
      }, 0);
    }
  }, {
    key: "removeShadowRootsIn",
    value: function removeShadowRootsIn(n) {
      var _this11 = this;
      if (this.shadowDoms.size === 0) return;
      var shadowRoot = src_default.shadowRoot(n);
      if (shadowRoot) {
        if (this.shadowDoms.has(shadowRoot)) this.removeShadowRoot(shadowRoot);
        this.removeShadowRootsIn(shadowRoot);
      }
      src_default.childNodes(n).forEach(function (child) {
        return _this11.removeShadowRootsIn(child);
      });
    }
  }, {
    key: "removeShadowRoot",
    value: function removeShadowRoot(shadowRoot) {
      var handlers = this.shadowDoms.get(shadowRoot);
      this.shadowDoms.delete(shadowRoot);
      handlers === null || handlers === void 0 || handlers.forEach(runHandler);
    }
    /**
    * Monkey patch 'attachShadow' of an IFrameElement to observe newly added shadow doms.
    */
  }, {
    key: "observeAttachShadow",
    value: function observeAttachShadow(iframeElement) {
      if (!iframeElement.contentWindow || !iframeElement.contentDocument) return;
      this.patchAttachShadow(iframeElement.contentWindow.Element, iframeElement.contentDocument);
    }
    /**
    * Patch 'attachShadow' to observe newly added shadow doms.
    */
  }, {
    key: "patchAttachShadow",
    value: function patchAttachShadow(element, doc) {
      var manager = this;
      this.restoreHandlers.push(patch(element.prototype, "attachShadow", function (original) {
        return function (option) {
          var sRoot = original.call(this, option);
          var shadowRootEl = src_default.shadowRoot(this);
          if (shadowRootEl && inDom(this)) manager.addShadowRoot(shadowRootEl, doc);
          return sRoot;
        };
      }));
    }
  }, {
    key: "reset",
    value: function reset() {
      this.restoreHandlers.forEach(runHandler);
      this.restoreHandlers = [];
      var shadowDoms = this.shadowDoms;
      this.shadowDoms = /* @__PURE__ */new Map();
      shadowDoms.forEach(function (handlers) {
        return handlers.forEach(runHandler);
      });
    }
  }]);
}();
function runHandler(handler) {
  try {
    handler();
  } catch (e) {}
}
// ../../node_modules/base64-arraybuffer/dist/base64-arraybuffer.es5.js
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var lookup = typeof Uint8Array === "undefined" ? [] : /* @__PURE__ */new Uint8Array(256);
for (var i = 0; i < chars.length; i++) lookup[chars.charCodeAt(i)] = i;
var encode = function encode(arraybuffer) {
  var bytes = new Uint8Array(arraybuffer),
    i,
    len = bytes.length,
    base64 = "";
  for (i = 0; i < len; i += 3) {
    base64 += chars[bytes[i] >> 2];
    base64 += chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
    base64 += chars[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
    base64 += chars[bytes[i + 2] & 63];
  }
  if (len % 3 === 2) base64 = base64.substring(0, base64.length - 1) + "=";else if (len % 3 === 1) base64 = base64.substring(0, base64.length - 2) + "==";
  return base64;
};
// ../rrweb/src/record/observers/canvas/serialize-args.ts
var canvasVarMap = /* @__PURE__ */new Map();
function variableListFor(ctx, ctor) {
  var contextMap = canvasVarMap.get(ctx);
  if (!contextMap) {
    contextMap = /* @__PURE__ */new Map();
    canvasVarMap.set(ctx, contextMap);
  }
  if (!contextMap.has(ctor)) contextMap.set(ctor, []);
  return contextMap.get(ctor);
}
var saveWebGLVar = function saveWebGLVar(value, win, ctx) {
  if (!value || !(isInstanceOfWebGLObject(value, win) || record_typeof(value) === "object")) return;
  var name = value.constructor.name;
  var list = variableListFor(ctx, name);
  var index = list.indexOf(value);
  if (index === -1) {
    index = list.length;
    list.push(value);
  }
  return index;
};
function serializeArg(value, win, ctx) {
  if (value instanceof Array) return value.map(function (arg) {
    return serializeArg(arg, win, ctx);
  });else if (value === null) return value;else if (value instanceof Float32Array || value instanceof Float64Array || value instanceof Int32Array || value instanceof Uint32Array || value instanceof Uint8Array || value instanceof Uint16Array || value instanceof Int16Array || value instanceof Int8Array || value instanceof Uint8ClampedArray) return {
    rr_type: value.constructor.name,
    args: [Object.values(value)]
  };else if (value instanceof ArrayBuffer) return {
    rr_type: value.constructor.name,
    base64: encode(value)
  };else if (value instanceof DataView) return {
    rr_type: value.constructor.name,
    args: [serializeArg(value.buffer, win, ctx), value.byteOffset, value.byteLength]
  };else if (value instanceof HTMLImageElement) {
    var name = value.constructor.name;
    var src = value.src;
    return {
      rr_type: name,
      src: src
    };
  } else if (value instanceof HTMLCanvasElement) return {
    rr_type: "HTMLImageElement",
    src: value.toDataURL()
  };else if (value instanceof ImageData) return {
    rr_type: value.constructor.name,
    args: [serializeArg(value.data, win, ctx), value.width, value.height]
  };else if (isInstanceOfWebGLObject(value, win) || record_typeof(value) === "object") return {
    rr_type: value.constructor.name,
    index: saveWebGLVar(value, win, ctx)
  };
  return value;
}
var serializeArgs = function serializeArgs(args, win, ctx) {
  return args.map(function (arg) {
    return serializeArg(arg, win, ctx);
  });
};
var isInstanceOfWebGLObject = function isInstanceOfWebGLObject(value, win) {
  var supportedWebGLConstructorNames = ["WebGLActiveInfo", "WebGLBuffer", "WebGLFramebuffer", "WebGLProgram", "WebGLRenderbuffer", "WebGLShader", "WebGLShaderPrecisionFormat", "WebGLTexture", "WebGLUniformLocation", "WebGLVertexArrayObject", "WebGLVertexArrayObjectOES"].filter(function (name) {
    return typeof win[name] === "function";
  });
  return Boolean(supportedWebGLConstructorNames.find(function (name) {
    return value instanceof win[name];
  }));
};
// ../rrweb/src/record/observers/canvas/2d.ts
function initCanvas2DMutationObserver(cb, win, blockClass, blockSelector) {
  var handlers = [];
  var props2D = Object.getOwnPropertyNames(win.CanvasRenderingContext2D.prototype);
  var _iterator5 = record_createForOfIteratorHelper(props2D),
    _step5;
  try {
    var _loop = function _loop() {
      var prop = _step5.value;
      try {
        if (typeof win.CanvasRenderingContext2D.prototype[prop] !== "function") return 1; // continue
        var restoreHandler = patch(win.CanvasRenderingContext2D.prototype, prop, function (original) {
          return function () {
            var _this12 = this;
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }
            if (!isBlocked(this.canvas, blockClass, blockSelector, true)) setTimeout(function () {
              var recordArgs = serializeArgs(args, win, _this12);
              cb(_this12.canvas, {
                type: CanvasContext["2D"],
                property: prop,
                args: recordArgs
              });
            }, 0);
            return original.apply(this, args);
          };
        });
        handlers.push(restoreHandler);
      } catch (_unused5) {
        var hookHandler = hookSetter(win.CanvasRenderingContext2D.prototype, prop, {
          set: function set(v) {
            cb(this.canvas, {
              type: CanvasContext["2D"],
              property: prop,
              args: [v],
              setter: true
            });
          }
        });
        handlers.push(hookHandler);
      }
    };
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      if (_loop()) continue;
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
  return function () {
    handlers.forEach(function (h) {
      return h();
    });
  };
}
// ../rrweb/src/record/observers/canvas/canvas.ts
function getNormalizedContextName(contextType) {
  return contextType === "experimental-webgl" ? "webgl" : contextType;
}
function initCanvasContextObserver(win, blockClass, blockSelector, setPreserveDrawingBufferToTrue) {
  var handlers = [];
  try {
    var restoreHandler = patch(win.HTMLCanvasElement.prototype, "getContext", function (original) {
      return function (contextType) {
        for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }
        if (!isBlocked(this, blockClass, blockSelector, true)) {
          var ctxName = getNormalizedContextName(contextType);
          if (!("__context" in this)) this.__context = ctxName;
          if (setPreserveDrawingBufferToTrue && ["webgl", "webgl2"].includes(ctxName)) {
            if (args[0] && record_typeof(args[0]) === "object") {
              var contextAttributes = args[0];
              if (!contextAttributes.preserveDrawingBuffer) contextAttributes.preserveDrawingBuffer = true;
            } else args.splice(0, 1, {
              preserveDrawingBuffer: true
            });
          }
        }
        return original.apply(this, [contextType].concat(args));
      };
    });
    handlers.push(restoreHandler);
  } catch (_unused6) {
    console.error("failed to patch HTMLCanvasElement.prototype.getContext");
  }
  return function () {
    handlers.forEach(function (h) {
      return h();
    });
  };
}
// ../rrweb/src/record/observers/canvas/webgl.ts
function patchGLPrototype(prototype, type, cb, blockClass, blockSelector, win) {
  var handlers = [];
  var props = Object.getOwnPropertyNames(prototype);
  var _iterator6 = record_createForOfIteratorHelper(props),
    _step6;
  try {
    var _loop2 = function _loop2() {
        var prop = _step6.value;
        if (["isContextLost", "canvas", "drawingBufferWidth", "drawingBufferHeight"].includes(prop)) return 0; // continue
        try {
          if (typeof prototype[prop] !== "function") return 0; // continue
          var restoreHandler = patch(prototype, prop, function (original) {
            return function () {
              for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
              }
              var result = original.apply(this, args);
              saveWebGLVar(result, win, this);
              if ("tagName" in this.canvas && !isBlocked(this.canvas, blockClass, blockSelector, true)) {
                var recordArgs = serializeArgs(args, win, this);
                var mutation = {
                  type: type,
                  property: prop,
                  args: recordArgs
                };
                cb(this.canvas, mutation);
              }
              return result;
            };
          });
          handlers.push(restoreHandler);
        } catch (_unused7) {
          var hookHandler = hookSetter(prototype, prop, {
            set: function set(v) {
              cb(this.canvas, {
                type: type,
                property: prop,
                args: [v],
                setter: true
              });
            }
          });
          handlers.push(hookHandler);
        }
      },
      _ret;
    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
      _ret = _loop2();
      if (_ret === 0) continue;
    }
  } catch (err) {
    _iterator6.e(err);
  } finally {
    _iterator6.f();
  }
  return handlers;
}
function initCanvasWebGLMutationObserver(cb, win, blockClass, blockSelector) {
  var handlers = [];
  if (typeof win.WebGLRenderingContext !== "undefined") handlers.push.apply(handlers, record_toConsumableArray(patchGLPrototype(win.WebGLRenderingContext.prototype, CanvasContext.WebGL, cb, blockClass, blockSelector, win)));
  if (typeof win.WebGL2RenderingContext !== "undefined") handlers.push.apply(handlers, record_toConsumableArray(patchGLPrototype(win.WebGL2RenderingContext.prototype, CanvasContext.WebGL2, cb, blockClass, blockSelector, win)));
  return function () {
    handlers.forEach(function (h) {
      return h();
    });
  };
}
// ../rrweb/src/record/workers/image-bitmap-data-url-worker.ts?worker&inline
var jsContent = "(function() {\n	// ../../node_modules/base64-arraybuffer/dist/base64-arraybuffer.es5.js\n	var chars = \"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\";\n	var lookup = typeof Uint8Array === \"undefined\" ? [] : /* @__PURE__ */ new Uint8Array(256);\n	for (var i = 0; i < chars.length; i++) lookup[chars.charCodeAt(i)] = i;\n	var encode = function(arraybuffer) {\n		var bytes = new Uint8Array(arraybuffer), i, len = bytes.length, base64 = \"\";\n		for (i = 0; i < len; i += 3) {\n			base64 += chars[bytes[i] >> 2];\n			base64 += chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];\n			base64 += chars[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];\n			base64 += chars[bytes[i + 2] & 63];\n		}\n		if (len % 3 === 2) base64 = base64.substring(0, base64.length - 1) + \"=\";\n		else if (len % 3 === 1) base64 = base64.substring(0, base64.length - 2) + \"==\";\n		return base64;\n	};\n	// ../rrweb/src/record/workers/image-bitmap-data-url-worker.ts\n	const lastBlobMap = /* @__PURE__ */ new Map();\n	const transparentBlobMap = /* @__PURE__ */ new Map();\n	async function getTransparentBlobFor(width, height, dataURLOptions) {\n		const id = `${width}-${height}`;\n		if (\"OffscreenCanvas\" in globalThis) {\n			if (transparentBlobMap.has(id)) return transparentBlobMap.get(id);\n			const offscreen = new OffscreenCanvas(width, height);\n			offscreen.getContext(\"2d\");\n			const base64 = encode(await (await offscreen.convertToBlob(dataURLOptions)).arrayBuffer());\n			transparentBlobMap.set(id, base64);\n			return base64;\n		} else return \"\";\n	}\n	const worker = self;\n	worker.onmessage = async function(e) {\n		if (\"OffscreenCanvas\" in globalThis) {\n			const { id, bitmap, width, height, dataURLOptions } = e.data;\n			const transparentBase64 = getTransparentBlobFor(width, height, dataURLOptions);\n			const offscreen = new OffscreenCanvas(width, height);\n			offscreen.getContext(\"2d\").drawImage(bitmap, 0, 0);\n			bitmap.close();\n			const blob = await offscreen.convertToBlob(dataURLOptions);\n			const type = blob.type;\n			const base64 = encode(await blob.arrayBuffer());\n			if (!lastBlobMap.has(id) && await transparentBase64 === base64) {\n				lastBlobMap.set(id, base64);\n				return worker.postMessage({ id });\n			}\n			if (lastBlobMap.get(id) === base64) return worker.postMessage({ id });\n			worker.postMessage({\n				id,\n				type,\n				base64,\n				width,\n				height\n			});\n			lastBlobMap.set(id, base64);\n		} else return worker.postMessage({ id: e.data.id });\n	};\n})();\n\n//# sourceMappingURL=image-bitmap-data-url-worker-DVcMqE1_.js.map";
var blob = typeof self !== "undefined" && self.Blob && new Blob(["(self.URL || self.webkitURL).revokeObjectURL(self.location.href);", jsContent], {
  type: "text/javascript;charset=utf-8"
});
function WorkerWrapper(options) {
  var objURL;
  try {
    objURL = blob && (self.URL || self.webkitURL).createObjectURL(blob);
    if (!objURL) throw "";
    var worker = new Worker(objURL, {
      name: options === null || options === void 0 ? void 0 : options.name
    });
    worker.addEventListener("error", function () {
      (self.URL || self.webkitURL).revokeObjectURL(objURL);
    });
    return worker;
  } catch (e) {
    return new Worker("data:text/javascript;charset=utf-8," + encodeURIComponent(jsContent), {
      name: options === null || options === void 0 ? void 0 : options.name
    });
  }
}
// ../rrweb/src/record/observers/canvas/canvas-manager.ts
var CanvasManager = /*#__PURE__*/function () {
  function CanvasManager(options) {
    var _this13 = this;
    record_classCallCheck(this, CanvasManager);
    record_defineProperty(this, "pendingCanvasMutations", /* @__PURE__ */new Map());
    record_defineProperty(this, "rafStamps", {
      latestId: 0,
      invokeId: null
    });
    record_defineProperty(this, "mirror", void 0);
    record_defineProperty(this, "mutationCb", void 0);
    record_defineProperty(this, "resetObservers", void 0);
    record_defineProperty(this, "frozen", false);
    record_defineProperty(this, "locked", false);
    record_defineProperty(this, "processMutation", function (target, mutation) {
      if (_this13.rafStamps.invokeId && _this13.rafStamps.latestId !== _this13.rafStamps.invokeId || !_this13.rafStamps.invokeId) _this13.rafStamps.invokeId = _this13.rafStamps.latestId;
      if (!_this13.pendingCanvasMutations.has(target)) _this13.pendingCanvasMutations.set(target, []);
      _this13.pendingCanvasMutations.get(target).push(mutation);
    });
    var _options$sampling = options.sampling,
      sampling = _options$sampling === void 0 ? "all" : _options$sampling,
      win = options.win,
      blockClass = options.blockClass,
      blockSelector = options.blockSelector,
      recordCanvas = options.recordCanvas,
      dataURLOptions = options.dataURLOptions;
    this.mutationCb = options.mutationCb;
    this.mirror = options.mirror;
    if (recordCanvas && sampling === "all") this.initCanvasMutationObserver(win, blockClass, blockSelector);
    if (recordCanvas && typeof sampling === "number") this.initCanvasFPSObserver(sampling, win, blockClass, blockSelector, {
      dataURLOptions: dataURLOptions
    });
  }
  return record_createClass(CanvasManager, [{
    key: "reset",
    value: function reset() {
      this.pendingCanvasMutations.clear();
      this.resetObservers && this.resetObservers();
    }
  }, {
    key: "freeze",
    value: function freeze() {
      this.frozen = true;
    }
  }, {
    key: "unfreeze",
    value: function unfreeze() {
      this.frozen = false;
    }
  }, {
    key: "lock",
    value: function lock() {
      this.locked = true;
    }
  }, {
    key: "unlock",
    value: function unlock() {
      this.locked = false;
    }
  }, {
    key: "initCanvasFPSObserver",
    value: function initCanvasFPSObserver(fps, win, blockClass, blockSelector, options) {
      var _this14 = this;
      var canvasContextReset = initCanvasContextObserver(win, blockClass, blockSelector, true);
      var snapshotInProgressMap = /* @__PURE__ */new Map();
      var worker = new WorkerWrapper();
      worker.onmessage = function (e) {
        var id = e.data.id;
        snapshotInProgressMap.set(id, false);
        if (!("base64" in e.data)) return;
        var _e$data = e.data,
          base64 = _e$data.base64,
          type = _e$data.type,
          width = _e$data.width,
          height = _e$data.height;
        _this14.mutationCb({
          id: id,
          type: CanvasContext["2D"],
          commands: [{
            property: "clearRect",
            args: [0, 0, width, height]
          }, {
            property: "drawImage",
            args: [{
              rr_type: "ImageBitmap",
              args: [{
                rr_type: "Blob",
                data: [{
                  rr_type: "ArrayBuffer",
                  base64: base64
                }],
                type: type
              }]
            }, 0, 0]
          }]
        });
      };
      var timeBetweenSnapshots = 1e3 / fps;
      var lastSnapshotTime = 0;
      var rafId;
      var getCanvas = function getCanvas() {
        var matchedCanvas = [];
        win.document.querySelectorAll("canvas").forEach(function (canvas) {
          if (!isBlocked(canvas, blockClass, blockSelector, true)) matchedCanvas.push(canvas);
        });
        return matchedCanvas;
      };
      var _takeCanvasSnapshots = function takeCanvasSnapshots(timestamp) {
        if (lastSnapshotTime && timestamp - lastSnapshotTime < timeBetweenSnapshots) {
          rafId = requestAnimationFrame(_takeCanvasSnapshots);
          return;
        }
        lastSnapshotTime = timestamp;
        getCanvas().forEach(/*#__PURE__*/function () {
          var _ref20 = record_asyncToGenerator(/*#__PURE__*/record_regenerator().m(function _callee(canvas) {
            var id, _context$getContextAt, context, bitmap;
            return record_regenerator().w(function (_context) {
              while (1) switch (_context.n) {
                case 0:
                  id = _this14.mirror.getId(canvas);
                  if (!snapshotInProgressMap.get(id)) {
                    _context.n = 1;
                    break;
                  }
                  return _context.a(2);
                case 1:
                  if (!(canvas.width === 0 || canvas.height === 0)) {
                    _context.n = 2;
                    break;
                  }
                  return _context.a(2);
                case 2:
                  snapshotInProgressMap.set(id, true);
                  if (["webgl", "webgl2"].includes(canvas.__context)) {
                    context = canvas.getContext(canvas.__context);
                    if ((context === null || context === void 0 || (_context$getContextAt = context.getContextAttributes()) === null || _context$getContextAt === void 0 ? void 0 : _context$getContextAt.preserveDrawingBuffer) === false) context.clear(context.COLOR_BUFFER_BIT);
                  }
                  _context.n = 3;
                  return createImageBitmap(canvas);
                case 3:
                  bitmap = _context.v;
                  worker.postMessage({
                    id: id,
                    bitmap: bitmap,
                    width: canvas.width,
                    height: canvas.height,
                    dataURLOptions: options.dataURLOptions
                  }, [bitmap]);
                case 4:
                  return _context.a(2);
              }
            }, _callee);
          }));
          return function (_x) {
            return _ref20.apply(this, arguments);
          };
        }());
        rafId = requestAnimationFrame(_takeCanvasSnapshots);
      };
      rafId = requestAnimationFrame(_takeCanvasSnapshots);
      this.resetObservers = function () {
        canvasContextReset();
        cancelAnimationFrame(rafId);
      };
    }
  }, {
    key: "initCanvasMutationObserver",
    value: function initCanvasMutationObserver(win, blockClass, blockSelector) {
      this.startRAFTimestamping();
      this.startPendingCanvasMutationFlusher();
      var canvasContextReset = initCanvasContextObserver(win, blockClass, blockSelector, false);
      var canvas2DReset = initCanvas2DMutationObserver(this.processMutation.bind(this), win, blockClass, blockSelector);
      var canvasWebGL1and2Reset = initCanvasWebGLMutationObserver(this.processMutation.bind(this), win, blockClass, blockSelector);
      this.resetObservers = function () {
        canvasContextReset();
        canvas2DReset();
        canvasWebGL1and2Reset();
      };
    }
  }, {
    key: "startPendingCanvasMutationFlusher",
    value: function startPendingCanvasMutationFlusher() {
      var _this15 = this;
      requestAnimationFrame(function () {
        return _this15.flushPendingCanvasMutations();
      });
    }
  }, {
    key: "startRAFTimestamping",
    value: function startRAFTimestamping() {
      var _this16 = this;
      var _setLatestRAFTimestamp = function setLatestRAFTimestamp(timestamp) {
        _this16.rafStamps.latestId = timestamp;
        requestAnimationFrame(_setLatestRAFTimestamp);
      };
      requestAnimationFrame(_setLatestRAFTimestamp);
    }
  }, {
    key: "flushPendingCanvasMutations",
    value: function flushPendingCanvasMutations() {
      var _this17 = this;
      this.pendingCanvasMutations.forEach(function (_values, canvas) {
        var id = _this17.mirror.getId(canvas);
        _this17.flushPendingCanvasMutationFor(canvas, id);
      });
      requestAnimationFrame(function () {
        return _this17.flushPendingCanvasMutations();
      });
    }
  }, {
    key: "flushPendingCanvasMutationFor",
    value: function flushPendingCanvasMutationFor(canvas, id) {
      if (this.frozen || this.locked) return;
      var valuesWithType = this.pendingCanvasMutations.get(canvas);
      if (!valuesWithType || id === -1) return;
      var values = valuesWithType.map(function (value) {
        var type = value.type,
          rest = record_objectWithoutProperties(value, record_excluded);
        return rest;
      });
      var type = valuesWithType[0].type;
      this.mutationCb({
        id: id,
        type: type,
        commands: values
      });
      this.pendingCanvasMutations.delete(canvas);
    }
  }]);
}();
// ../rrweb/src/record/stylesheet-manager.ts
var StylesheetManager = /*#__PURE__*/function () {
  function StylesheetManager(options) {
    record_classCallCheck(this, StylesheetManager);
    record_defineProperty(this, "trackedLinkElements", /* @__PURE__ */new WeakSet());
    record_defineProperty(this, "mutationCb", void 0);
    record_defineProperty(this, "adoptedStyleSheetCb", void 0);
    record_defineProperty(this, "styleMirror", new StyleSheetMirror());
    this.mutationCb = options.mutationCb;
    this.adoptedStyleSheetCb = options.adoptedStyleSheetCb;
  }
  return record_createClass(StylesheetManager, [{
    key: "attachLinkElement",
    value: function attachLinkElement(linkEl, childSn) {
      if ("_cssText" in childSn.attributes) this.mutationCb({
        adds: [],
        removes: [],
        texts: [],
        attributes: [{
          id: childSn.id,
          attributes: childSn.attributes
        }]
      });
      this.trackLinkElement(linkEl);
    }
  }, {
    key: "trackLinkElement",
    value: function trackLinkElement(linkEl) {
      if (this.trackedLinkElements.has(linkEl)) return;
      this.trackedLinkElements.add(linkEl);
      this.trackStylesheetInLinkElement(linkEl);
    }
  }, {
    key: "adoptStyleSheets",
    value: function adoptStyleSheets(sheets, hostId) {
      var _this18 = this;
      if (sheets.length === 0) return;
      var adoptedStyleSheetData = {
        id: hostId,
        styleIds: []
      };
      var styles = [];
      var _iterator7 = record_createForOfIteratorHelper(sheets),
        _step7;
      try {
        var _loop3 = function _loop3() {
          var sheet = _step7.value;
          var styleId;
          if (!_this18.styleMirror.has(sheet)) {
            styleId = _this18.styleMirror.add(sheet);
            styles.push({
              styleId: styleId,
              rules: Array.from(sheet.rules || CSSRule, function (r, index) {
                return {
                  rule: stringifyRule(r, sheet.href),
                  index: index
                };
              })
            });
          } else styleId = _this18.styleMirror.getId(sheet);
          adoptedStyleSheetData.styleIds.push(styleId);
        };
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          _loop3();
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
      if (styles.length > 0) adoptedStyleSheetData.styles = styles;
      this.adoptedStyleSheetCb(adoptedStyleSheetData);
    }
  }, {
    key: "reset",
    value: function reset() {
      this.styleMirror.reset();
      this.trackedLinkElements = /* @__PURE__ */new WeakSet();
    }
  }, {
    key: "trackStylesheetInLinkElement",
    value: function trackStylesheetInLinkElement(_linkEl) {}
  }]);
}();
// ../rrweb/src/record/processed-node-manager.ts
/**
* Keeps a log of nodes that could show up in multiple mutation buffer but shouldn't be handled twice.
*/
var ProcessedNodeManager = /*#__PURE__*/function () {
  function ProcessedNodeManager() {
    record_classCallCheck(this, ProcessedNodeManager);
    record_defineProperty(this, "nodeMap", /* @__PURE__ */new WeakMap());
    record_defineProperty(this, "active", false);
  }
  return record_createClass(ProcessedNodeManager, [{
    key: "inOtherBuffer",
    value: function inOtherBuffer(node, thisBuffer) {
      var buffers = this.nodeMap.get(node);
      return buffers && Array.from(buffers).some(function (buffer) {
        return buffer !== thisBuffer;
      });
    }
  }, {
    key: "add",
    value: function add(node, buffer) {
      var _this19 = this;
      if (!this.active) {
        this.active = true;
        requestAnimationFrame(function () {
          _this19.nodeMap = /* @__PURE__ */new WeakMap();
          _this19.active = false;
        });
      }
      this.nodeMap.set(node, (this.nodeMap.get(node) || /* @__PURE__ */new Set()).add(buffer));
    }
  }, {
    key: "destroy",
    value: function destroy() {}
  }]);
}();
// ../rrweb/src/record/index.ts
var wrappedEmit;
var takeFullSnapshot;
var canvasManager;
var recording = false;
try {
  if (Array.from([1], function (x) {
    return x * 2;
  })[0] !== 2) {
    var _cleanFrame$contentWi;
    var cleanFrame = document.createElement("iframe");
    document.body.appendChild(cleanFrame);
    Array.from = ((_cleanFrame$contentWi = cleanFrame.contentWindow) === null || _cleanFrame$contentWi === void 0 ? void 0 : _cleanFrame$contentWi.Array.from) || Array.from;
    document.body.removeChild(cleanFrame);
  }
} catch (err) {
  console.debug("Unable to override Array.from", err);
}
var mirror = createMirror();
function record() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var emit = options.emit,
    checkoutEveryNms = options.checkoutEveryNms,
    checkoutEveryNth = options.checkoutEveryNth,
    _options$blockClass = options.blockClass,
    blockClass = _options$blockClass === void 0 ? "rr-block" : _options$blockClass,
    _options$blockSelecto = options.blockSelector,
    blockSelector = _options$blockSelecto === void 0 ? null : _options$blockSelecto,
    _options$ignoreClass = options.ignoreClass,
    ignoreClass = _options$ignoreClass === void 0 ? "rr-ignore" : _options$ignoreClass,
    _options$ignoreSelect = options.ignoreSelector,
    ignoreSelector = _options$ignoreSelect === void 0 ? null : _options$ignoreSelect,
    _options$maskTextClas = options.maskTextClass,
    maskTextClass = _options$maskTextClas === void 0 ? "rr-mask" : _options$maskTextClas,
    _options$maskTextSele = options.maskTextSelector,
    maskTextSelector = _options$maskTextSele === void 0 ? null : _options$maskTextSele,
    _options$inlineStyles2 = options.inlineStylesheet,
    inlineStylesheet = _options$inlineStyles2 === void 0 ? true : _options$inlineStyles2,
    maskAllInputs = options.maskAllInputs,
    _maskInputOptions = options.maskInputOptions,
    _slimDOMOptions = options.slimDOMOptions,
    maskInputFn = options.maskInputFn,
    maskTextFn = options.maskTextFn,
    hooks = options.hooks,
    packFn = options.packFn,
    _options$sampling2 = options.sampling,
    sampling = _options$sampling2 === void 0 ? {} : _options$sampling2,
    _options$dataURLOptio4 = options.dataURLOptions,
    dataURLOptions = _options$dataURLOptio4 === void 0 ? {} : _options$dataURLOptio4,
    mousemoveWait = options.mousemoveWait,
    _options$recordDOM = options.recordDOM,
    recordDOM = _options$recordDOM === void 0 ? true : _options$recordDOM,
    _options$recordCanvas2 = options.recordCanvas,
    recordCanvas = _options$recordCanvas2 === void 0 ? false : _options$recordCanvas2,
    _options$recordCrossO = options.recordCrossOriginIframes,
    recordCrossOriginIframes = _options$recordCrossO === void 0 ? false : _options$recordCrossO,
    _options$recordAfter = options.recordAfter,
    recordAfter = _options$recordAfter === void 0 ? options.recordAfter === "DOMContentLoaded" ? options.recordAfter : "load" : _options$recordAfter,
    _options$userTriggere = options.userTriggeredOnInput,
    userTriggeredOnInput = _options$userTriggere === void 0 ? false : _options$userTriggere,
    _options$collectFonts = options.collectFonts,
    collectFonts = _options$collectFonts === void 0 ? false : _options$collectFonts,
    _options$inlineImages2 = options.inlineImages,
    inlineImages = _options$inlineImages2 === void 0 ? false : _options$inlineImages2,
    plugins = options.plugins,
    _options$keepIframeSr2 = options.keepIframeSrcFn,
    keepIframeSrcFn = _options$keepIframeSr2 === void 0 ? function () {
      return false;
    } : _options$keepIframeSr2,
    _options$ignoreCSSAtt = options.ignoreCSSAttributes,
    ignoreCSSAttributes = _options$ignoreCSSAtt === void 0 ? /* @__PURE__ */new Set([]) : _options$ignoreCSSAtt,
    errorHandler = options.errorHandler;
  registerErrorHandler(errorHandler);
  var inEmittingFrame = recordCrossOriginIframes ? window.parent === window : true;
  var passEmitsToParent = false;
  if (!inEmittingFrame) try {
    if (window.parent.document) passEmitsToParent = false;
  } catch (e) {
    passEmitsToParent = true;
  }
  if (inEmittingFrame && !emit) throw new Error("emit function is required");
  if (!inEmittingFrame && !passEmitsToParent) return function () {};
  if (mousemoveWait !== void 0 && sampling.mousemove === void 0) sampling.mousemove = mousemoveWait;
  mirror.reset();
  var maskInputOptions = maskAllInputs === true ? {
    color: true,
    date: true,
    "datetime-local": true,
    email: true,
    month: true,
    number: true,
    range: true,
    search: true,
    tel: true,
    text: true,
    time: true,
    url: true,
    week: true,
    textarea: true,
    select: true,
    password: true
  } : _maskInputOptions !== void 0 ? _maskInputOptions : {
    password: true
  };
  var slimDOMOptions = slimDOMDefaults(_slimDOMOptions);
  polyfill();
  var lastFullSnapshotEvent;
  var incrementalSnapshotCount = 0;
  var eventProcessor = function eventProcessor(e) {
    var _iterator8 = record_createForOfIteratorHelper(plugins || []),
      _step8;
    try {
      for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
        var plugin = _step8.value;
        if (plugin.eventProcessor) e = plugin.eventProcessor(e);
      }
    } catch (err) {
      _iterator8.e(err);
    } finally {
      _iterator8.f();
    }
    if (packFn && !passEmitsToParent) e = packFn(e);
    return e;
  };
  wrappedEmit = function wrappedEmit(r, isCheckout) {
    var e = r;
    e.timestamp = nowTimestamp();
    if (e.type !== EventType.FullSnapshot && !(e.type === EventType.IncrementalSnapshot && e.data.source === IncrementalSource.Mutation)) {
      canvasManager.unfreeze();
      var _iterator9 = record_createForOfIteratorHelper(mutationBuffers),
        _step9;
      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var buf = _step9.value;
          if (buf.isFrozen()) buf.unfreeze();else break;
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }
    }
    if (inEmittingFrame) emit === null || emit === void 0 || emit(eventProcessor(e), isCheckout);else if (passEmitsToParent) {
      var message = {
        type: "rrweb",
        event: eventProcessor(e),
        origin: window.location.origin,
        isCheckout: isCheckout
      };
      window.parent.postMessage(message, "*");
    }
    if (e.type === EventType.FullSnapshot) {
      lastFullSnapshotEvent = e;
      incrementalSnapshotCount = 0;
    } else if (e.type === EventType.IncrementalSnapshot) {
      if (e.data.source === IncrementalSource.Mutation && e.data.isAttachIframe) return;
      incrementalSnapshotCount++;
      var exceedCount = checkoutEveryNth && incrementalSnapshotCount >= checkoutEveryNth;
      var exceedTime = checkoutEveryNms && e.timestamp - lastFullSnapshotEvent.timestamp > checkoutEveryNms;
      if (exceedCount || exceedTime) takeFullSnapshot(true);
    }
  };
  var wrappedMutationEmit = function wrappedMutationEmit(m) {
    wrappedEmit({
      type: EventType.IncrementalSnapshot,
      data: record_objectSpread({
        source: IncrementalSource.Mutation
      }, m)
    });
  };
  var wrappedScrollEmit = function wrappedScrollEmit(p) {
    return wrappedEmit({
      type: EventType.IncrementalSnapshot,
      data: record_objectSpread({
        source: IncrementalSource.Scroll
      }, p)
    });
  };
  var wrappedCanvasMutationEmit = function wrappedCanvasMutationEmit(p) {
    return wrappedEmit({
      type: EventType.IncrementalSnapshot,
      data: record_objectSpread({
        source: IncrementalSource.CanvasMutation
      }, p)
    });
  };
  var wrappedAdoptedStyleSheetEmit = function wrappedAdoptedStyleSheetEmit(a) {
    return wrappedEmit({
      type: EventType.IncrementalSnapshot,
      data: record_objectSpread({
        source: IncrementalSource.AdoptedStyleSheet
      }, a)
    });
  };
  var stylesheetManager = new StylesheetManager({
    mutationCb: wrappedMutationEmit,
    adoptedStyleSheetCb: wrappedAdoptedStyleSheetEmit
  });
  var iframeManager = new IframeManager({
    mirror: mirror,
    mutationCb: wrappedMutationEmit,
    stylesheetManager: stylesheetManager,
    recordCrossOriginIframes: recordCrossOriginIframes,
    wrappedEmit: wrappedEmit
  });
  /**
  * Exposes mirror to the plugins
  */
  var _iterator0 = record_createForOfIteratorHelper(plugins || []),
    _step0;
  try {
    for (_iterator0.s(); !(_step0 = _iterator0.n()).done;) {
      var plugin = _step0.value;
      if (plugin.getMirror) plugin.getMirror({
        nodeMirror: mirror,
        crossOriginIframeMirror: iframeManager.crossOriginIframeMirror,
        crossOriginIframeStyleMirror: iframeManager.crossOriginIframeStyleMirror
      });
    }
  } catch (err) {
    _iterator0.e(err);
  } finally {
    _iterator0.f();
  }
  var processedNodeManager = new ProcessedNodeManager();
  canvasManager = new CanvasManager({
    recordCanvas: recordCanvas,
    mutationCb: wrappedCanvasMutationEmit,
    win: window,
    blockClass: blockClass,
    blockSelector: blockSelector,
    mirror: mirror,
    sampling: sampling.canvas,
    dataURLOptions: dataURLOptions
  });
  var shadowDomManager = new ShadowDomManager({
    mutationCb: wrappedMutationEmit,
    scrollCb: wrappedScrollEmit,
    bypassOptions: {
      blockClass: blockClass,
      blockSelector: blockSelector,
      maskTextClass: maskTextClass,
      maskTextSelector: maskTextSelector,
      inlineStylesheet: inlineStylesheet,
      maskInputOptions: maskInputOptions,
      dataURLOptions: dataURLOptions,
      maskTextFn: maskTextFn,
      maskInputFn: maskInputFn,
      recordCanvas: recordCanvas,
      inlineImages: inlineImages,
      sampling: sampling,
      slimDOMOptions: slimDOMOptions,
      iframeManager: iframeManager,
      stylesheetManager: stylesheetManager,
      canvasManager: canvasManager,
      keepIframeSrcFn: keepIframeSrcFn,
      processedNodeManager: processedNodeManager
    },
    mirror: mirror
  });
  takeFullSnapshot = function takeFullSnapshot() {
    var isCheckout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (!recordDOM) return;
    wrappedEmit({
      type: EventType.Meta,
      data: {
        href: window.location.href,
        width: getWindowWidth(),
        height: getWindowHeight()
      }
    }, isCheckout);
    stylesheetManager.reset();
    shadowDomManager.init();
    canvasManager.lock();
    mutationBuffers.forEach(function (buf) {
      return buf.lock();
    });
    var node = snapshot(document, {
      mirror: mirror,
      blockClass: blockClass,
      blockSelector: blockSelector,
      maskTextClass: maskTextClass,
      maskTextSelector: maskTextSelector,
      inlineStylesheet: inlineStylesheet,
      maskAllInputs: maskInputOptions,
      maskTextFn: maskTextFn,
      maskInputFn: maskInputFn,
      slimDOM: slimDOMOptions,
      dataURLOptions: dataURLOptions,
      recordCanvas: recordCanvas,
      inlineImages: inlineImages,
      onSerialize: function onSerialize(n) {
        if (isSerializedIframe(n, mirror)) iframeManager.addIframe(n);
        if (isSerializedStylesheet(n, mirror)) stylesheetManager.trackLinkElement(n);
        if (hasShadowRoot(n)) shadowDomManager.addShadowRoot(src_default.shadowRoot(n), document);
      },
      onIframeLoad: function onIframeLoad(iframe, childSn) {
        iframeManager.attachIframe(iframe, childSn);
        shadowDomManager.observeAttachShadow(iframe);
      },
      onStylesheetLoad: function onStylesheetLoad(linkEl, childSn) {
        stylesheetManager.attachLinkElement(linkEl, childSn);
      },
      keepIframeSrcFn: keepIframeSrcFn
    });
    if (!node) return console.warn("Failed to snapshot the document");
    wrappedEmit({
      type: EventType.FullSnapshot,
      data: {
        node: node,
        initialOffset: getWindowScroll(window)
      }
    }, isCheckout);
    canvasManager.unlock();
    mutationBuffers.forEach(function (buf) {
      return buf.unlock();
    });
    if (document.adoptedStyleSheets && document.adoptedStyleSheets.length > 0) stylesheetManager.adoptStyleSheets(document.adoptedStyleSheets, mirror.getId(document));
  };
  try {
    var handlers = [];
    var observe = function observe(doc) {
      var _plugins$filter;
      return callbackWrapper(initObservers)({
        mutationCb: wrappedMutationEmit,
        mousemoveCb: function mousemoveCb(positions, source) {
          return wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: {
              source: source,
              positions: positions
            }
          });
        },
        mouseInteractionCb: function mouseInteractionCb(d) {
          return wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: record_objectSpread({
              source: IncrementalSource.MouseInteraction
            }, d)
          });
        },
        scrollCb: wrappedScrollEmit,
        viewportResizeCb: function viewportResizeCb(d) {
          return wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: record_objectSpread({
              source: IncrementalSource.ViewportResize
            }, d)
          });
        },
        inputCb: function inputCb(v) {
          return wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: record_objectSpread({
              source: IncrementalSource.Input
            }, v)
          });
        },
        mediaInteractionCb: function mediaInteractionCb(p) {
          return wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: record_objectSpread({
              source: IncrementalSource.MediaInteraction
            }, p)
          });
        },
        styleSheetRuleCb: function styleSheetRuleCb(r) {
          return wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: record_objectSpread({
              source: IncrementalSource.StyleSheetRule
            }, r)
          });
        },
        styleDeclarationCb: function styleDeclarationCb(r) {
          return wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: record_objectSpread({
              source: IncrementalSource.StyleDeclaration
            }, r)
          });
        },
        canvasMutationCb: wrappedCanvasMutationEmit,
        fontCb: function fontCb(p) {
          return wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: record_objectSpread({
              source: IncrementalSource.Font
            }, p)
          });
        },
        selectionCb: function selectionCb(p) {
          wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: record_objectSpread({
              source: IncrementalSource.Selection
            }, p)
          });
        },
        customElementCb: function customElementCb(c) {
          wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: record_objectSpread({
              source: IncrementalSource.CustomElement
            }, c)
          });
        },
        blockClass: blockClass,
        ignoreClass: ignoreClass,
        ignoreSelector: ignoreSelector,
        maskTextClass: maskTextClass,
        maskTextSelector: maskTextSelector,
        maskInputOptions: maskInputOptions,
        inlineStylesheet: inlineStylesheet,
        sampling: sampling,
        recordDOM: recordDOM,
        recordCanvas: recordCanvas,
        inlineImages: inlineImages,
        userTriggeredOnInput: userTriggeredOnInput,
        collectFonts: collectFonts,
        doc: doc,
        maskInputFn: maskInputFn,
        maskTextFn: maskTextFn,
        keepIframeSrcFn: keepIframeSrcFn,
        blockSelector: blockSelector,
        slimDOMOptions: slimDOMOptions,
        dataURLOptions: dataURLOptions,
        mirror: mirror,
        iframeManager: iframeManager,
        stylesheetManager: stylesheetManager,
        shadowDomManager: shadowDomManager,
        processedNodeManager: processedNodeManager,
        canvasManager: canvasManager,
        ignoreCSSAttributes: ignoreCSSAttributes,
        plugins: (plugins === null || plugins === void 0 || (_plugins$filter = plugins.filter(function (p) {
          return p.observer;
        })) === null || _plugins$filter === void 0 ? void 0 : _plugins$filter.map(function (p) {
          return {
            observer: p.observer,
            options: p.options,
            callback: function callback(payload) {
              return wrappedEmit({
                type: EventType.Plugin,
                data: {
                  plugin: p.name,
                  payload: payload
                }
              });
            }
          };
        })) || []
      }, hooks);
    };
    var iframeObservers = /* @__PURE__ */new Map();
    iframeManager.addLoadListener(function (iframeEl) {
      try {
        var doc = iframeEl.contentDocument;
        if (iframeObservers.has(doc)) return;
        iframeObservers.set(doc, observe(doc));
      } catch (error) {
        console.warn(error);
      }
    });
    iframeManager.addUnloadListener(function (doc) {
      var stopObserving = iframeObservers.get(doc);
      if (!stopObserving) return;
      iframeObservers.delete(doc);
      stopObserving();
      shadowDomManager.removeShadowRootsIn(doc);
      mirror.removeNodeFromMap(doc);
    });
    var init = function init() {
      takeFullSnapshot();
      handlers.push(observe(document));
      recording = true;
    };
    if (["interactive", "complete"].includes(document.readyState)) init();else {
      handlers.push(on("DOMContentLoaded", function () {
        wrappedEmit({
          type: EventType.DomContentLoaded,
          data: {}
        });
        if (recordAfter === "DOMContentLoaded") init();
      }));
      handlers.push(on("load", function () {
        wrappedEmit({
          type: EventType.Load,
          data: {}
        });
        if (recordAfter === "load") init();
      }, window));
    }
    return function () {
      [].concat(handlers, record_toConsumableArray(iframeObservers.values())).forEach(function (handler) {
        try {
          handler();
        } catch (error) {
          /**
          * https://github.com/rrweb-io/rrweb/pull/1695
          * This error can occur in a known scenario:
          * If an iframe is initially same-origin and observed, but later its 
          location is changed in an opaque way to a cross-origin URL (perhaps within the iframe via its `document.location` or a redirect) 
          * attempting to execute the handler in the stop record function will 
          throw a "cannot access cross-origin frame" error.
          * This error is expected and can be safely ignored.
          */
          if (!String(error).toLowerCase().includes("cross-origin")) console.warn(error);
        }
      });
      iframeObservers.clear();
      iframeManager.destroy();
      processedNodeManager.destroy();
      shadowDomManager.reset();
      canvasManager.reset();
      recording = false;
      unregisterErrorHandler();
    };
  } catch (error) {
    console.warn(error);
  }
}
record.addCustomEvent = function (tag, payload) {
  if (!recording) throw new Error("please add custom event after start recording");
  wrappedEmit({
    type: EventType.Custom,
    data: {
      tag: tag,
      payload: payload
    }
  });
};
record.addAnnotation = function (annotation) {
  if (!recording) throw new Error("please add annotation after recording started");
  wrappedEmit({
    type: EventType.Annotation,
    data: annotation
  });
};
record.freezePage = function () {
  canvasManager.freeze();
  mutationBuffers.forEach(function (buf) {
    return buf.freeze();
  });
};
record.takeFullSnapshot = function (isCheckout) {
  if (!recording) throw new Error("please take full snapshot after start recording");
  takeFullSnapshot(isCheckout);
};
record.mirror = mirror;

;// ./node_modules/@rrweb/types/dist/types.js
// src/index.ts
var types_EventType = /* @__PURE__ */function (EventType) {
  EventType[EventType["DomContentLoaded"] = 0] = "DomContentLoaded";
  EventType[EventType["Load"] = 1] = "Load";
  EventType[EventType["FullSnapshot"] = 2] = "FullSnapshot";
  EventType[EventType["IncrementalSnapshot"] = 3] = "IncrementalSnapshot";
  EventType[EventType["Meta"] = 4] = "Meta";
  EventType[EventType["Custom"] = 5] = "Custom";
  EventType[EventType["Plugin"] = 6] = "Plugin";
  EventType[EventType["Asset"] = 7] = "Asset";
  EventType[EventType["Annotation"] = 8] = "Annotation";
  return EventType;
}({});
var types_IncrementalSource = /* @__PURE__ */(/* unused pure expression or super */ null && (function (IncrementalSource) {
  IncrementalSource[IncrementalSource["Mutation"] = 0] = "Mutation";
  IncrementalSource[IncrementalSource["MouseMove"] = 1] = "MouseMove";
  IncrementalSource[IncrementalSource["MouseInteraction"] = 2] = "MouseInteraction";
  IncrementalSource[IncrementalSource["Scroll"] = 3] = "Scroll";
  IncrementalSource[IncrementalSource["ViewportResize"] = 4] = "ViewportResize";
  IncrementalSource[IncrementalSource["Input"] = 5] = "Input";
  IncrementalSource[IncrementalSource["TouchMove"] = 6] = "TouchMove";
  IncrementalSource[IncrementalSource["MediaInteraction"] = 7] = "MediaInteraction";
  IncrementalSource[IncrementalSource["StyleSheetRule"] = 8] = "StyleSheetRule";
  IncrementalSource[IncrementalSource["CanvasMutation"] = 9] = "CanvasMutation";
  IncrementalSource[IncrementalSource["Font"] = 10] = "Font";
  IncrementalSource[IncrementalSource["Log"] = 11] = "Log";
  IncrementalSource[IncrementalSource["Drag"] = 12] = "Drag";
  IncrementalSource[IncrementalSource["StyleDeclaration"] = 13] = "StyleDeclaration";
  IncrementalSource[IncrementalSource["Selection"] = 14] = "Selection";
  IncrementalSource[IncrementalSource["AdoptedStyleSheet"] = 15] = "AdoptedStyleSheet";
  IncrementalSource[IncrementalSource["CustomElement"] = 16] = "CustomElement";
  return IncrementalSource;
}({})));
var types_MouseInteractions = /* @__PURE__ */(/* unused pure expression or super */ null && (function (MouseInteractions) {
  MouseInteractions[MouseInteractions["MouseUp"] = 0] = "MouseUp";
  MouseInteractions[MouseInteractions["MouseDown"] = 1] = "MouseDown";
  MouseInteractions[MouseInteractions["Click"] = 2] = "Click";
  MouseInteractions[MouseInteractions["ContextMenu"] = 3] = "ContextMenu";
  MouseInteractions[MouseInteractions["DblClick"] = 4] = "DblClick";
  MouseInteractions[MouseInteractions["Focus"] = 5] = "Focus";
  MouseInteractions[MouseInteractions["Blur"] = 6] = "Blur";
  MouseInteractions[MouseInteractions["TouchStart"] = 7] = "TouchStart";
  MouseInteractions[MouseInteractions["TouchMove_Departed"] = 8] = "TouchMove_Departed";
  MouseInteractions[MouseInteractions["TouchEnd"] = 9] = "TouchEnd";
  MouseInteractions[MouseInteractions["TouchCancel"] = 10] = "TouchCancel";
  return MouseInteractions;
}({})));
var types_PointerTypes = /* @__PURE__ */(/* unused pure expression or super */ null && (function (PointerTypes) {
  PointerTypes[PointerTypes["Mouse"] = 0] = "Mouse";
  PointerTypes[PointerTypes["Pen"] = 1] = "Pen";
  PointerTypes[PointerTypes["Touch"] = 2] = "Touch";
  return PointerTypes;
}({})));
var types_CanvasContext = /* @__PURE__ */(/* unused pure expression or super */ null && (function (CanvasContext) {
  CanvasContext[CanvasContext["2D"] = 0] = "2D";
  CanvasContext[CanvasContext["WebGL"] = 1] = "WebGL";
  CanvasContext[CanvasContext["WebGL2"] = 2] = "WebGL2";
  return CanvasContext;
}({})));
var types_MediaInteractions = /* @__PURE__ */(/* unused pure expression or super */ null && (function (MediaInteractions) {
  MediaInteractions[MediaInteractions["Play"] = 0] = "Play";
  MediaInteractions[MediaInteractions["Pause"] = 1] = "Pause";
  MediaInteractions[MediaInteractions["Seeked"] = 2] = "Seeked";
  MediaInteractions[MediaInteractions["VolumeChange"] = 3] = "VolumeChange";
  MediaInteractions[MediaInteractions["RateChange"] = 4] = "RateChange";
  return MediaInteractions;
}({})));
var ReplayerEvents = /* @__PURE__ */(/* unused pure expression or super */ null && (function (ReplayerEvents) {
  ReplayerEvents["Start"] = "start";
  ReplayerEvents["Pause"] = "pause";
  /**
  * @deprecated use Play instead
  */
  ReplayerEvents["Resume"] = "resume";
  ReplayerEvents["Resize"] = "resize";
  ReplayerEvents["Finish"] = "finish";
  ReplayerEvents["FullsnapshotRebuilded"] = "fullsnapshot-rebuilded";
  ReplayerEvents["LoadStylesheetStart"] = "load-stylesheet-start";
  ReplayerEvents["LoadStylesheetEnd"] = "load-stylesheet-end";
  ReplayerEvents["SkipStart"] = "skip-start";
  ReplayerEvents["SkipEnd"] = "skip-end";
  ReplayerEvents["MouseInteraction"] = "mouse-interaction";
  ReplayerEvents["EventCast"] = "event-cast";
  ReplayerEvents["CustomEvent"] = "custom-event";
  ReplayerEvents["Annotation"] = "annotation";
  ReplayerEvents["Flush"] = "flush";
  ReplayerEvents["StateChange"] = "state-change";
  ReplayerEvents["PlayBack"] = "play-back";
  ReplayerEvents["Destroy"] = "destroy";
  return ReplayerEvents;
}({})));
var types_NodeType = /* @__PURE__ */(/* unused pure expression or super */ null && (function (NodeType) {
  NodeType[NodeType["Document"] = 0] = "Document";
  NodeType[NodeType["DocumentType"] = 1] = "DocumentType";
  NodeType[NodeType["Element"] = 2] = "Element";
  NodeType[NodeType["Text"] = 3] = "Text";
  NodeType[NodeType["CDATA"] = 4] = "CDATA";
  NodeType[NodeType["Comment"] = 5] = "Comment";
  return NodeType;
}({})));

;// ./src/browser/replay/checkoutWatchdog.js
function checkoutWatchdog_typeof(o) { "@babel/helpers - typeof"; return checkoutWatchdog_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, checkoutWatchdog_typeof(o); }
function checkoutWatchdog_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function checkoutWatchdog_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, checkoutWatchdog_toPropertyKey(o.key), o); } }
function checkoutWatchdog_createClass(e, r, t) { return r && checkoutWatchdog_defineProperties(e.prototype, r), t && checkoutWatchdog_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function checkoutWatchdog_defineProperty(e, r, t) { return (r = checkoutWatchdog_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function checkoutWatchdog_toPropertyKey(t) { var i = checkoutWatchdog_toPrimitive(t, "string"); return "symbol" == checkoutWatchdog_typeof(i) ? i : i + ""; }
function checkoutWatchdog_toPrimitive(t, r) { if ("object" != checkoutWatchdog_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != checkoutWatchdog_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
;

/**
 * Schedules forced rrweb checkouts when the recorder has been idle too long.
 *
 * Recorder notifies the watchdog whenever rrweb performs a checkout. If
 * another checkout doesn't happen within the configured window, the watchdog
 * calls `forceCheckout` so buffers stay within max pre-duration limits.
 */
var CheckoutWatchdog = /*#__PURE__*/function () {
  /**
   * @param {Object} params
   * @param {() => number} params.getIntervalMs - Returns checkout interval
   * @param {() => void} params.forceCheckout - Invoked to force a checkout
   * @param {number} [params.marginMs] - Safety margin before forcing checkout, default: 1000ms
   * @param {() => number} [params.now] - Clock function (primarily for tests), default: Date.now
   */
  function CheckoutWatchdog(_ref) {
    var getIntervalMs = _ref.getIntervalMs,
      forceCheckout = _ref.forceCheckout,
      _ref$marginMs = _ref.marginMs,
      marginMs = _ref$marginMs === void 0 ? 1000 : _ref$marginMs,
      _ref$now = _ref.now,
      now = _ref$now === void 0 ? function () {
        return Date.now();
      } : _ref$now;
    checkoutWatchdog_classCallCheck(this, CheckoutWatchdog);
    checkoutWatchdog_defineProperty(this, "_getIntervalMs", void 0);
    checkoutWatchdog_defineProperty(this, "_forceCheckout", void 0);
    checkoutWatchdog_defineProperty(this, "_marginMs", void 0);
    checkoutWatchdog_defineProperty(this, "_now", void 0);
    checkoutWatchdog_defineProperty(this, "_timerId", null);
    checkoutWatchdog_defineProperty(this, "_lastCheckoutAt", null);
    checkoutWatchdog_defineProperty(this, "_running", false);
    this._getIntervalMs = getIntervalMs;
    this._forceCheckout = forceCheckout;
    this._marginMs = marginMs;
    this._now = now;
  }
  return checkoutWatchdog_createClass(CheckoutWatchdog, [{
    key: "start",
    value: function start() {
      if (this._running) return;
      this._running = true;
      this._lastCheckoutAt = this._now();
      this._arm();
    }
  }, {
    key: "stop",
    value: function stop() {
      if (!this._running) return;
      this._running = false;
      this._lastCheckoutAt = null;
      this._clearTimer();
    }

    /**
     * Notifies the watchdog that rrweb just performed a checkout.
     *
     * @param {number} [timestamp] - Timestamp of checkout (ms)
     */
  }, {
    key: "notify",
    value: function notify() {
      var timestamp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._now();
      if (!this._running) return;
      this._lastCheckoutAt = timestamp;
      this._arm();
    }
  }, {
    key: "_arm",
    value: function _arm() {
      var _this = this;
      this._clearTimer();
      if (!this._running) return;
      var delay = this._getIntervalMs() + this._marginMs;
      this._timerId = setTimeout(function () {
        return _this._maybeForceCheckout();
      }, delay);
    }
  }, {
    key: "_maybeForceCheckout",
    value: function _maybeForceCheckout() {
      var _this$_lastCheckoutAt;
      if (!this._running) return;
      var interval = this._getIntervalMs();
      var lastCheckoutAt = (_this$_lastCheckoutAt = this._lastCheckoutAt) !== null && _this$_lastCheckoutAt !== void 0 ? _this$_lastCheckoutAt : this._now();
      var delta = this._now() - lastCheckoutAt;
      if (delta < interval) {
        this._arm();
        return;
      }
      try {
        this._forceCheckout();
      } catch (error) {
        src_logger.error('Replay: Forced checkout failed', error);
      }
      this._lastCheckoutAt = this._now();
      this._arm();
    }
  }, {
    key: "_clearTimer",
    value: function _clearTimer() {
      if (this._timerId) {
        clearTimeout(this._timerId);
        this._timerId = null;
      }
    }
  }]);
}();

;// ./src/browser/replay/recorder.js
var recorder_excluded = ["enabled", "autoStart", "maxPreDuration", "debug", "emit", "checkoutEveryNms"];
function recorder_typeof(o) { "@babel/helpers - typeof"; return recorder_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, recorder_typeof(o); }
function recorder_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = recorder_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function recorder_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return recorder_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? recorder_arrayLikeToArray(r, a) : void 0; } }
function recorder_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function recorder_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function recorder_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? recorder_ownKeys(Object(t), !0).forEach(function (r) { recorder_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : recorder_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function recorder_objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = recorder_objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function recorder_objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function recorder_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function recorder_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, recorder_toPropertyKey(o.key), o); } }
function recorder_createClass(e, r, t) { return r && recorder_defineProperties(e.prototype, r), t && recorder_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function recorder_defineProperty(e, r, t) { return (r = recorder_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function recorder_toPropertyKey(t) { var i = recorder_toPrimitive(t, "string"); return "symbol" == recorder_typeof(i) ? i : i + ""; }
function recorder_toPrimitive(t, r) { if ("object" != recorder_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != recorder_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
;






/** @typedef {import('./recorder.js').BufferCursor} BufferCursor */
var Recorder = /*#__PURE__*/function () {
  /**
   * Creates a new Recorder instance for capturing DOM events
   *
   * @param {Object} options - Configuration options for the recorder
   */
  function Recorder() {
    var _this$_recordFn,
      _this = this;
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    recorder_classCallCheck(this, Recorder);
    recorder_defineProperty(this, "_options", void 0);
    recorder_defineProperty(this, "_rrwebOptions", void 0);
    recorder_defineProperty(this, "_isReady", false);
    recorder_defineProperty(this, "_stopFn", null);
    recorder_defineProperty(this, "_recordFn", void 0);
    recorder_defineProperty(this, "_checkoutWatchdog", void 0);
    /** A two-slot ring buffer for storing events. */
    recorder_defineProperty(this, "_buffers", [[], []]);
    /** Active slot index (0|1). Stores new events until next checkout. */
    recorder_defineProperty(this, "_currentSlot", 0);
    this.options = options;

    // Tests inject a custom rrweb record function or mock.
    this._recordFn = options.recordFn || record;
    if (!isFunction((_this$_recordFn = this._recordFn) === null || _this$_recordFn === void 0 ? void 0 : _this$_recordFn.takeFullSnapshot)) {
      throw new Error('Recorder requires a valid rrweb record function');
    }
    this._checkoutWatchdog = new CheckoutWatchdog({
      getIntervalMs: function getIntervalMs() {
        return _this.checkoutEveryNms();
      },
      forceCheckout: function forceCheckout() {
        return _this._recordFn.takeFullSnapshot(true);
      }
    });
  }
  return recorder_createClass(Recorder, [{
    key: "_previousSlot",
    get: /** Index of the finalized inactive slot (0|1). Frozen until next checkout. */
    function get() {
      return this._currentSlot ^ 1;
    }
  }, {
    key: "isRecording",
    get: function get() {
      return this._stopFn !== null;
    }
  }, {
    key: "isReady",
    get: function get() {
      return this._isReady;
    }
  }, {
    key: "options",
    get: function get() {
      return this._options;
    },
    set: function set(newOptions) {
      this.configure(newOptions);
    }
  }, {
    key: "configure",
    value: function configure(newOptions) {
      var enabled = newOptions.enabled,
        autoStart = newOptions.autoStart,
        maxPreDuration = newOptions.maxPreDuration,
        debug = newOptions.debug,
        _emit = newOptions.emit,
        _checkoutEveryNms = newOptions.checkoutEveryNms,
        rrwebOptions = recorder_objectWithoutProperties(newOptions, recorder_excluded);
      this._options = {
        enabled: enabled,
        autoStart: autoStart,
        maxPreDuration: maxPreDuration,
        debug: debug
      };
      this._rrwebOptions = rrwebOptions;
      if (this.isRecording && newOptions.enabled === false) {
        this.stop();
      }
    }

    /**
     * Calculates the checkout interval in milliseconds.
     *
     * Recording may span up to two checkout intervals, so the interval is set
     * to half of maxPreDuration to ensure coverage.
     *
     * @returns {number} Checkout interval in milliseconds
     */
  }, {
    key: "checkoutEveryNms",
    value: function checkoutEveryNms() {
      return (this.options.maxPreDuration || 10) * 1000 / 2;
    }

    /**
     * Returns a point-in-time cursor for the active buffer.
     *
     * Used to capture a stable cursor that survives a single checkout.
     *
     * @remarks
     *
     * While offset can be `-1` if the buffer is empty, this cannot occur when
     * `_isReady` is `true`. The emit callback always pushes the triggering event
     * after any buffer reset, ensuring the active buffer has at least one event.
     *
     * @returns {BufferCursor} Buffer slot and event exclusive offset.
     */
  }, {
    key: "bufferCursor",
    value: function bufferCursor() {
      return {
        slot: this._currentSlot,
        offset: this._buffers[this._currentSlot].length - 1
      };
    }

    /**
     * Exports the recording span with all recorded events or events after a cursor.
     *
     * @param {Object} tracing - The tracing system instance to create spans
     * @param {Object} attributes - Span attributes (rollbar.replay.id, etc.)
     * @param {BufferCursor} [cursor] - Cursor position to start from (exclusive), or all if not provided
     */
  }, {
    key: "exportRecordingSpan",
    value: function exportRecordingSpan(tracing) {
      var _tracing$session$attr, _tracing$session;
      var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var cursor = arguments.length > 2 ? arguments[2] : undefined;
      var events = cursor ? this._collectEventsFromCursor(cursor) : this._collectAll();
      if (events.length === 0) {
        throw new Error('Replay recording has no events');
      }
      var recordingSpan = tracing.startSpan('rrweb-replay-recording', {});
      recordingSpan.setAttributes(recorder_objectSpread(recorder_objectSpread({}, (_tracing$session$attr = (_tracing$session = tracing.session) === null || _tracing$session === void 0 ? void 0 : _tracing$session.attributes) !== null && _tracing$session$attr !== void 0 ? _tracing$session$attr : {}), attributes));
      var earliestEvent = events.reduce(function (earliestEvent, event) {
        return event.timestamp < earliestEvent.timestamp ? event : earliestEvent;
      });
      recordingSpan.span.startTime = hrtime.fromMillis(earliestEvent.timestamp);
      var _iterator = recorder_createForOfIteratorHelper(events),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var event = _step.value;
          recordingSpan.addEvent('rrweb-replay-events', {
            eventType: event.type,
            json: JSON.stringify(event.data)
          }, hrtime.fromMillis(event.timestamp));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      recordingSpan.end();
    }
  }, {
    key: "start",
    value: function start() {
      var _this2 = this;
      if (this.isRecording || this.options.enabled === false) {
        return;
      }
      this.clear();
      this._stopFn = this._recordFn(recorder_objectSpread({
        emit: function emit(event, isCheckout) {
          var _this2$options$debug;
          if (!_this2._isReady && event.type === types_EventType.FullSnapshot) {
            _this2._isReady = true;
          }
          if ((_this2$options$debug = _this2.options.debug) !== null && _this2$options$debug !== void 0 && _this2$options$debug.logEmits) {
            Recorder._logEvent(event, isCheckout);
          }
          if (isCheckout && event.type === types_EventType.Meta) {
            _this2._currentSlot = _this2._previousSlot;
            _this2._buffers[_this2._currentSlot] = [];
            _this2._checkoutWatchdog.notify(event.timestamp);
          }
          _this2._buffers[_this2._currentSlot].push(event);
        },
        checkoutEveryNms: this.checkoutEveryNms(),
        errorHandler: function errorHandler(error) {
          var _this2$options$debug2;
          if ((_this2$options$debug2 = _this2.options.debug) !== null && _this2$options$debug2 !== void 0 && _this2$options$debug2.logErrors) {
            src_logger.error('Error during replay recording', error);
          }
          return true; // swallow the error instead of throwing it to the window
        }
      }, this._rrwebOptions));
      this._checkoutWatchdog.start();
      return this;
    }
  }, {
    key: "stop",
    value: function stop() {
      if (!this.isRecording) {
        return;
      }
      this._stopFn();
      this._stopFn = null;
      this._isReady = false;
      this._checkoutWatchdog.stop();
      return this;
    }
  }, {
    key: "clear",
    value: function clear() {
      this._buffers = [[], []];
      this._currentSlot = 0;
      this._isReady = false;
      this._checkoutWatchdog.stop();
    }

    /**
     * Collects all events (previous ⊕ current) and returns a new array with a
     * trailing `replay.end` marker.
     *
     * @returns {Array} All events with replay.end marker
     * @private
     */
  }, {
    key: "_collectAll",
    value: function _collectAll() {
      var previousEvents = this._buffers[this._previousSlot];
      var currentEvents = this._buffers[this._currentSlot];
      var allEvents = previousEvents.concat(currentEvents);
      if (allEvents.length > 0) {
        allEvents.push(Recorder._replayEndEvent());
      }
      return allEvents;
    }

    /**
     * Collects events strictly after `cursor` (exclusive) and returns a new
     * array with `replay.end`.
     *
     * @param {BufferCursor} cursor - Cursor position to collect from
     * @returns {Array} Events after cursor with replay.end marker
     * @private
     */
  }, {
    key: "_collectEventsFromCursor",
    value: function _collectEventsFromCursor(cursor) {
      var _this$_buffers$cursor, _this$options$debug;
      var currentSlot = this._currentSlot;
      var capturedBuffer = (_this$_buffers$cursor = this._buffers[cursor.slot]) !== null && _this$_buffers$cursor !== void 0 ? _this$_buffers$cursor : [];
      var currentBuffer = this._buffers[currentSlot];
      var head = capturedBuffer.slice(Math.max(0, cursor.offset + 1));
      var tail = cursor.slot === currentSlot ? [] : currentBuffer;
      var events = head.concat(tail);
      if ((_this$options$debug = this.options.debug) !== null && _this$options$debug !== void 0 && _this$options$debug.logErrors) {
        if (cursor.slot !== currentSlot && head.length === 0) {
          src_logger.warn('Captured lead buffer cleared by multiple checkouts');
        }
      }
      if (events.length > 0) {
        events.push(Recorder._replayEndEvent());
      }
      return events;
    }

    /**
     * Creates a replay.end noop marker event.
     *
     * Helps the application correctly align playback when added at the end of
     * the recording.
     *
     * @returns {Object} replay.end event
     * @private
     */
  }], [{
    key: "_replayEndEvent",
    value: function _replayEndEvent() {
      return {
        type: types_EventType.Custom,
        timestamp: Date.now(),
        data: {
          tag: 'replay.end',
          payload: {}
        }
      };
    }

    /**
     * Logs an event for debugging purposes.
     *
     * @param {Object} event - The event to log
     * @param {boolean} isCheckout - Whether this is a checkout event
     * @private
     */
  }, {
    key: "_logEvent",
    value: function _logEvent(event, isCheckout) {
      src_logger.log("Recorder: ".concat(isCheckout ? 'checkout' : '', " event\n"), function (e) {
        var seen = new WeakSet();
        return JSON.stringify(e, function (_, v) {
          if (recorder_typeof(v) === 'object' && v !== null) {
            if (seen.has(v)) return '[Circular]';
            seen.add(v);
          }
          return v;
        }, 2);
      }(event));
    }
  }]);
}();

;// ./src/browser/replay/replayPredicates.js
function replayPredicates_typeof(o) { "@babel/helpers - typeof"; return replayPredicates_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, replayPredicates_typeof(o); }
function replayPredicates_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = replayPredicates_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function replayPredicates_toConsumableArray(r) { return replayPredicates_arrayWithoutHoles(r) || replayPredicates_iterableToArray(r) || replayPredicates_unsupportedIterableToArray(r) || replayPredicates_nonIterableSpread(); }
function replayPredicates_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function replayPredicates_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return replayPredicates_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? replayPredicates_arrayLikeToArray(r, a) : void 0; } }
function replayPredicates_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function replayPredicates_arrayWithoutHoles(r) { if (Array.isArray(r)) return replayPredicates_arrayLikeToArray(r); }
function replayPredicates_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function replayPredicates_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function replayPredicates_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? replayPredicates_ownKeys(Object(t), !0).forEach(function (r) { replayPredicates_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : replayPredicates_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function replayPredicates_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function replayPredicates_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, replayPredicates_toPropertyKey(o.key), o); } }
function replayPredicates_createClass(e, r, t) { return r && replayPredicates_defineProperties(e.prototype, r), t && replayPredicates_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function replayPredicates_defineProperty(e, r, t) { return (r = replayPredicates_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function replayPredicates_toPropertyKey(t) { var i = replayPredicates_toPrimitive(t, "string"); return "symbol" == replayPredicates_typeof(i) ? i : i + ""; }
function replayPredicates_toPrimitive(t, r) { if ("object" != replayPredicates_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != replayPredicates_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * ReplayPredicates - Determine if replay is enabled for a given trigger type.
 *
 */
var ReplayPredicates = /*#__PURE__*/function () {
  /*
   * Constructor for ReplayPredicates.
   *
   * @param {Object} config - Configuration object containing replay settings.
   */
  function ReplayPredicates(config) {
    replayPredicates_classCallCheck(this, ReplayPredicates);
    replayPredicates_defineProperty(this, "maxAdjustedCount", Math.pow(2, 56));
    this.configure(config);
    this.predicates = {
      occurrence: [this.isLevelMatching.bind(this), this.isPredicateFnMatching.bind(this), this.isSampled.bind(this)],
      navigation: [this.isPathMatching.bind(this), this.isPredicateFnMatching.bind(this), this.isSampled.bind(this)],
      direct: [this.isTagMatching.bind(this), this.isPredicateFnMatching.bind(this), this.isSampled.bind(this)]
    };
  }
  return replayPredicates_createClass(ReplayPredicates, [{
    key: "configure",
    value: function configure(config) {
      this.config = config || {};
      this.triggers = this._triggersWithDefaults(config);
      this.maxPreDuration = this._maxPreDuration();
    }
  }, {
    key: "_triggersWithDefaults",
    value: function _triggersWithDefaults(config) {
      var triggers = (config === null || config === void 0 ? void 0 : config.triggers) || [];
      return triggers.map(function (t) {
        return replayPredicates_objectSpread(replayPredicates_objectSpread({}, config.triggerDefaults), t);
      });
    }
  }, {
    key: "_maxPreDuration",
    value: function _maxPreDuration() {
      if (!this.triggers) return 0;
      return Math.max.apply(Math, replayPredicates_toConsumableArray(this.triggers.map(function (t) {
        return t.preDuration || 0;
      })).concat([0]));
    }

    /**
     * shouldCaptureForTriggerContext - Checks if replay is enabled for a given trigger type.
     * Applies all predicates for that trigger type and returns true if all predicates pass
     * for any matching trigger.
     *
     * @param {Object} context - Context object containing state used by predicates.
     * @return {Object} - The first matching trigger if enabled, otherwise null.
     */
  }, {
    key: "shouldCaptureForTriggerContext",
    value: function shouldCaptureForTriggerContext(context) {
      var predicates = this.predicates[context.type];
      var _iterator = replayPredicates_createForOfIteratorHelper(this.triggers),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var t = _step.value;
          if (t.type === context.type && this.isEnabledForTrigger(t, predicates, context)) {
            return t;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return null;
    }
  }, {
    key: "isEnabledForTrigger",
    value: function isEnabledForTrigger(trigger, predicates, context) {
      if (predicates.find(function (p) {
        return !p(trigger, context);
      })) {
        return false;
      }
      return true;
    }

    /**
     * isLevelMatching - Checks if the trigger's level matches the context item's level.
     * If no level is specified in the trigger, it defaults to matching all levels.
     * @param {Object} trigger - The trigger object containing the level.
     * @param {Object} context - The context object containing state for the trigger to match.
     * @return {boolean} - True if the trigger's level matches the context item's level, false otherwise.
     */
  }, {
    key: "isLevelMatching",
    value: function isLevelMatching(trigger, context) {
      if (!trigger.level || trigger.level.includes(context.level)) {
        return true;
      }
      return false;
    }

    /**
     * isPathMatching - Checks if the trigger's pathMatch regex matches the context item's path.
     * If no pathMatch is specified in the trigger, it defaults to matching all paths.
     * @param {Object} trigger - The trigger object containing the pathMatch regex or string.
     * @param {Object} context - The context object containing state for the trigger to match.
     * @return {boolean} - True if no trigger or the trigger's pathMatch matches the context item's path, false otherwise.
     */
  }, {
    key: "isPathMatching",
    value: function isPathMatching(trigger, context) {
      var path = context.path;
      var pathMatch = trigger.pathMatch;
      if (!pathMatch) return true;
      if (!path) return false;
      if (typeof pathMatch === 'string') {
        if (path.includes(pathMatch)) {
          return true;
        }
      } else {
        if (path.match(pathMatch)) {
          return true;
        }
      }
      return false;
    }

    /**
     * isTagMatching - Checks if the trigger's tags match any of the context item's tags.
     * If no tags are specified in the trigger, it defaults to matching all tags.
     * @param {Object} trigger - The trigger object containing the tags.
     * @param {Object} context - The context object containing state for the trigger to match.
     * @return {boolean} - True if the trigger's tags match any of the context item's tags, false otherwise.
     */
  }, {
    key: "isTagMatching",
    value: function isTagMatching(trigger, context) {
      var _context$tags;
      if (!trigger.tags) return true;
      if ((_context$tags = context.tags) !== null && _context$tags !== void 0 && _context$tags.some(function (t) {
        return trigger.tags.includes(t);
      })) {
        return true;
      }
      return false;
    }

    /**
     * isPredicateFnMatching - Checks if the trigger's custom predicate function returns true.
     * If no predicate function is specified in the trigger, it defaults to true.
     * @param {Object} trigger - The trigger object containing the predicate function.
     * @param {Object} context - The context object containing state for the trigger to match.
     * @return {boolean} - True if the trigger's predicate function returns true, false otherwise.
     */
  }, {
    key: "isPredicateFnMatching",
    value: function isPredicateFnMatching(trigger, context) {
      if (typeof trigger.predicateFn !== 'function') return true;
      return trigger.predicateFn(trigger, context);
    }

    /**
     * isSampled - Determines if the trigger should be sampled based on its sampling ratio.
     * If no ratio is specified, defaults to 1 (always sampled).
     *
     * Sampling algorithm is based on OTel probability sampling as described in
     * * https://opentelemetry.io/docs/specs/otel/trace/tracestate-probability-sampling/
     * * https://opentelemetry.io/docs/specs/otel/trace/tracestate-handling/
     *
     * Note: String compare is more performant than conversion to float,
     * assuming the `th` calculation will be moved to the trigger configuration.
     * This allows `toString` to be called once, rather than `parseInt` to be called on
     * each replay.
     *
     * @param {Object} trigger - The trigger object containing the sampling ratio.
     * @param {Object} context - The context object containing the replayId.
     * @returns {boolean} - True if the trigger is sampled, false otherwise.
     */
  }, {
    key: "isSampled",
    value: function isSampled(trigger, context) {
      var _trigger$samplingRati;
      var ratio = (_trigger$samplingRati = trigger.samplingRatio) !== null && _trigger$samplingRati !== void 0 ? _trigger$samplingRati : 1;
      if (ratio === 1) {
        return true;
      }
      var rv = context.replayId.slice(-14);
      var th = (this.maxAdjustedCount * (1 - ratio)).toString(16).padStart(14, '0');
      return rv >= th;
    }
  }]);
}();

;// ./src/browser/replay/scheduledStreamCapture.js
function scheduledStreamCapture_typeof(o) { "@babel/helpers - typeof"; return scheduledStreamCapture_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, scheduledStreamCapture_typeof(o); }
function scheduledStreamCapture_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = scheduledStreamCapture_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function scheduledStreamCapture_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return scheduledStreamCapture_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? scheduledStreamCapture_arrayLikeToArray(r, a) : void 0; } }
function scheduledStreamCapture_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function scheduledStreamCapture_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return scheduledStreamCapture_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (scheduledStreamCapture_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, scheduledStreamCapture_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, scheduledStreamCapture_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), scheduledStreamCapture_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", scheduledStreamCapture_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), scheduledStreamCapture_regeneratorDefine2(u), scheduledStreamCapture_regeneratorDefine2(u, o, "Generator"), scheduledStreamCapture_regeneratorDefine2(u, n, function () { return this; }), scheduledStreamCapture_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (scheduledStreamCapture_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function scheduledStreamCapture_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } scheduledStreamCapture_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { scheduledStreamCapture_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, scheduledStreamCapture_regeneratorDefine2(e, r, n, t); }
function scheduledStreamCapture_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function scheduledStreamCapture_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? scheduledStreamCapture_ownKeys(Object(t), !0).forEach(function (r) { scheduledStreamCapture_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : scheduledStreamCapture_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function scheduledStreamCapture_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function scheduledStreamCapture_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { scheduledStreamCapture_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { scheduledStreamCapture_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function scheduledStreamCapture_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function scheduledStreamCapture_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, scheduledStreamCapture_toPropertyKey(o.key), o); } }
function scheduledStreamCapture_createClass(e, r, t) { return r && scheduledStreamCapture_defineProperties(e.prototype, r), t && scheduledStreamCapture_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function scheduledStreamCapture_defineProperty(e, r, t) { return (r = scheduledStreamCapture_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function scheduledStreamCapture_toPropertyKey(t) { var i = scheduledStreamCapture_toPrimitive(t, "string"); return "symbol" == scheduledStreamCapture_typeof(i) ? i : i + ""; }
function scheduledStreamCapture_toPrimitive(t, r) { if ("object" != scheduledStreamCapture_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != scheduledStreamCapture_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
;

/** @typedef {import('./recorder.js').BufferCursor} BufferCursor */
/** @typedef {import('./recorder.js').Recorder} Recorder */

/**
 * A utility for coordinating streaming, cursor-based captures over extended
 * durations.
 *
 * Unlike ScheduledCapture (single delayed export), this class exports multiple
 * chunks at intervals to prevent event loss during long postDuration windows.
 * Chunks are queued during capture and sent sequentially after coordination
 * requirements are met.
 */
var ScheduledStreamCapture = /*#__PURE__*/function () {
  /**
   * Creates a new ScheduledStreamCapture instance
   *
   * @param {Object} props - Configuration object
   * @param {Object} props.recorder - Recorder instance for capturing events
   * @param {Object} props.tracing - Tracing instance for span management
   * @param {Object} props.telemeter - Optional telemeter for telemetry spans
   * @param {Function} props.shouldSend - Function to check if replay can be sent
   * @param {Function} props.onComplete - Function to call when capture completes
   */
  function ScheduledStreamCapture(_ref) {
    var recorder = _ref.recorder,
      tracing = _ref.tracing,
      telemeter = _ref.telemeter,
      shouldSend = _ref.shouldSend,
      onComplete = _ref.onComplete;
    scheduledStreamCapture_classCallCheck(this, ScheduledStreamCapture);
    /** @type {Recorder} */
    scheduledStreamCapture_defineProperty(this, "_recorder", void 0);
    scheduledStreamCapture_defineProperty(this, "_tracing", void 0);
    scheduledStreamCapture_defineProperty(this, "_telemeter", void 0);
    scheduledStreamCapture_defineProperty(this, "_pending", new Map());
    scheduledStreamCapture_defineProperty(this, "_shouldSend", void 0);
    scheduledStreamCapture_defineProperty(this, "_onComplete", void 0);
    this._recorder = recorder;
    this._tracing = tracing;
    this._telemeter = telemeter;
    this._shouldSend = shouldSend;
    this._onComplete = onComplete;
  }

  /**
   * Schedules streaming chunk captures over the specified duration.
   *
   * Starts a periodic interval that exports chunks at safe intervals to
   * prevent event loss during buffer checkouts. Chunks are queued for later
   * sequential sending.
   *
   * @param {string} replayId - The replay ID
   * @param {string} occurrenceUuid - The occurrence UUID
   * @param {number} postDuration - Duration in seconds to capture
   * @param {Object} [attributes] - Extra attributes to set on every chunk's
   *   recording span
   */
  return scheduledStreamCapture_createClass(ScheduledStreamCapture, [{
    key: "schedule",
    value: function schedule(replayId, occurrenceUuid, postDuration) {
      var _this = this;
      var attributes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var startTime = Date.now();
      var endAt = startTime + postDuration * 1000;
      var chunkMs = this._recorder.checkoutEveryNms();
      var cursor = this._recorder.bufferCursor();
      var intervalId = setInterval(function () {
        _this._export(replayId);
      }, chunkMs);
      var endTimerId = setTimeout(function () {
        _this._finalExport(replayId);
      }, postDuration * 1000);
      this._pending.set(replayId, {
        intervalId: intervalId,
        endTimerId: endTimerId,
        startTime: startTime,
        endAt: endAt,
        postDuration: postDuration,
        occurrenceUuid: occurrenceUuid,
        attributes: attributes,
        cursor: cursor,
        chunkQueue: [],
        sending: false,
        aborted: false,
        finished: false
      });
    }

    /**
     * Exports a chunk and adds it to the send queue.
     *
     * Called periodically by the interval timer. Captures events from the last
     * cursor position to current, exports as a span, and queues the payload.
     * Stops the interval when postDuration is exceeded.
     *
     * @param {string} replayId - The replay ID
     * @private
     */
  }, {
    key: "_export",
    value: (function () {
      var _export2 = scheduledStreamCapture_asyncToGenerator(/*#__PURE__*/scheduledStreamCapture_regenerator().m(function _callee(replayId) {
        var _this$_telemeter;
        var ctx, before, after, payload, _t;
        return scheduledStreamCapture_regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              ctx = this._pending.get(replayId);
              if (!(!ctx || ctx.aborted || ctx.finished || Date.now() >= ctx.endAt)) {
                _context.n = 1;
                break;
              }
              return _context.a(2);
            case 1:
              before = ctx.cursor;
              after = this._recorder.bufferCursor();
              _context.p = 2;
              this._recorder.exportRecordingSpan(this._tracing, scheduledStreamCapture_objectSpread(scheduledStreamCapture_objectSpread({}, ctx.attributes), {}, {
                'rollbar.replay.id': replayId,
                'rollbar.occurrence.uuid': ctx.occurrenceUuid
              }), before);
              _context.n = 4;
              break;
            case 3:
              _context.p = 3;
              _t = _context.v;
              src_logger.debug('Error exporting leading chunk (tick):', _t);
              return _context.a(2);
            case 4:
              (_this$_telemeter = this._telemeter) === null || _this$_telemeter === void 0 || _this$_telemeter.exportTelemetrySpan({
                'rollbar.replay.id': replayId
              });
              payload = this._tracing.exporter.toPayload();
              ctx.chunkQueue.push({
                payload: payload,
                cursor: before
              });
              ctx.cursor = after;
              _context.n = 5;
              return this.sendIfReady(replayId);
            case 5:
              return _context.a(2);
          }
        }, _callee, this, [[2, 3]]);
      }));
      function _export(_x) {
        return _export2.apply(this, arguments);
      }
      return _export;
    }())
  }, {
    key: "_finalExport",
    value: function () {
      var _finalExport2 = scheduledStreamCapture_asyncToGenerator(/*#__PURE__*/scheduledStreamCapture_regenerator().m(function _callee2(replayId) {
        var ctx, before, after, _this$_telemeter2, payload, _this$_onComplete;
        return scheduledStreamCapture_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              ctx = this._pending.get(replayId);
              if (!(!ctx || ctx.aborted)) {
                _context2.n = 1;
                break;
              }
              return _context2.a(2);
            case 1:
              if (ctx.intervalId) clearInterval(ctx.intervalId);
              if (ctx.endTimerId) clearTimeout(ctx.endTimerId);
              ctx.finished = true;
              before = ctx.cursor;
              after = this._recorder.bufferCursor();
              try {
                this._recorder.exportRecordingSpan(this._tracing, scheduledStreamCapture_objectSpread(scheduledStreamCapture_objectSpread({}, ctx.attributes), {}, {
                  'rollbar.replay.id': replayId,
                  'rollbar.occurrence.uuid': ctx.occurrenceUuid
                }), before);
                (_this$_telemeter2 = this._telemeter) === null || _this$_telemeter2 === void 0 || _this$_telemeter2.exportTelemetrySpan({
                  'rollbar.replay.id': replayId
                });
                payload = this._tracing.exporter.toPayload();
                ctx.chunkQueue.push({
                  payload: payload,
                  cursor: before
                });
                ctx.cursor = after;
              } catch (error) {
                // TODO(matux): No events probably, this is expected, be more graceful.
                src_logger.debug('Error exporting leading chunk (final):', error);
              }
              if (!(!ctx.sending && ctx.chunkQueue.length === 0)) {
                _context2.n = 2;
                break;
              }
              this._pending.delete(replayId);
              (_this$_onComplete = this._onComplete) === null || _this$_onComplete === void 0 || _this$_onComplete.call(this, replayId);
              return _context2.a(2);
            case 2:
              _context2.n = 3;
              return this.sendIfReady(replayId);
            case 3:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function _finalExport(_x2) {
        return _finalExport2.apply(this, arguments);
      }
      return _finalExport;
    }()
    /**
     * Sends queued chunks if ready and coordination allows it.
     *
     * Called by Replay after trailing replay succeeds. Sends chunks
     * sequentially, waiting for each to complete before sending the next. If any
     * chunk fails to send, aborts the entire stream.
     *
     * @param {string} replayId - The replay ID
     * @returns {Promise<void>}
     */
  }, {
    key: "sendIfReady",
    value: (function () {
      var _sendIfReady = scheduledStreamCapture_asyncToGenerator(/*#__PURE__*/scheduledStreamCapture_regenerator().m(function _callee3(replayId) {
        var ctx, _this$_onComplete2, _iterator, _step, chunk, _this$_onComplete3, _t2, _t3;
        return scheduledStreamCapture_regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              ctx = this._pendingContextIfReady(replayId);
              if (ctx) {
                _context3.n = 1;
                break;
              }
              return _context3.a(2);
            case 1:
              if (!(ctx.finished && !ctx.sending && ctx.chunkQueue.length === 0)) {
                _context3.n = 2;
                break;
              }
              this._pending.delete(replayId);
              (_this$_onComplete2 = this._onComplete) === null || _this$_onComplete2 === void 0 || _this$_onComplete2.call(this, replayId);
              return _context3.a(2);
            case 2:
              ctx.sending = true;
              _iterator = scheduledStreamCapture_createForOfIteratorHelper(ctx.chunkQueue);
              _context3.p = 3;
              _iterator.s();
            case 4:
              if ((_step = _iterator.n()).done) {
                _context3.n = 10;
                break;
              }
              chunk = _step.value;
              if (!ctx.aborted) {
                _context3.n = 5;
                break;
              }
              return _context3.a(3, 10);
            case 5:
              if (this._shouldSend(replayId)) {
                _context3.n = 6;
                break;
              }
              src_logger.error('Coordination check failed during chunk send');
              this.discard(replayId);
              throw new Error('Coordination check failed during chunk send');
            case 6:
              _context3.p = 6;
              _context3.n = 7;
              return this._tracing.exporter.post(chunk.payload, {
                'X-Rollbar-Replay-Id': replayId
              });
            case 7:
              _context3.n = 9;
              break;
            case 8:
              _context3.p = 8;
              _t2 = _context3.v;
              src_logger.error('Failed to send leading replay:', _t2);
              this.discard(replayId);
              throw _t2;
            case 9:
              _context3.n = 4;
              break;
            case 10:
              _context3.n = 12;
              break;
            case 11:
              _context3.p = 11;
              _t3 = _context3.v;
              _iterator.e(_t3);
            case 12:
              _context3.p = 12;
              _iterator.f();
              return _context3.f(12);
            case 13:
              ctx.sending = false;
              ctx.chunkQueue = [];
              if (ctx.finished) {
                this._pending.delete(replayId);
                (_this$_onComplete3 = this._onComplete) === null || _this$_onComplete3 === void 0 || _this$_onComplete3.call(this, replayId);
              }
            case 14:
              return _context3.a(2);
          }
        }, _callee3, this, [[6, 8], [3, 11, 12, 13]]);
      }));
      function sendIfReady(_x3) {
        return _sendIfReady.apply(this, arguments);
      }
      return sendIfReady;
    }()
    /**
     * Aborts the streaming capture and cleans up all state.
     *
     * Stops the interval timer, discards all queued chunks, and marks the
     * capture as aborted. This is called on send failures or explicit discard.
     *
     * @param {string} replayId - The replay ID to abort
     */
    )
  }, {
    key: "discard",
    value: function discard(replayId) {
      var _this$_onComplete4;
      var ctx = this._pending.get(replayId);
      if (!ctx) return;
      ctx.aborted = true;
      if (ctx.intervalId) clearInterval(ctx.intervalId);
      if (ctx.endTimerId) clearTimeout(ctx.endTimerId);
      ctx.chunkQueue = [];
      this._pending.delete(replayId);
      (_this$_onComplete4 = this._onComplete) === null || _this$_onComplete4 === void 0 || _this$_onComplete4.call(this, replayId);
    }

    /**
     * Returns the pending context for the given replayId if it's ready to be sent.
     *
     * @param {string} replayId - The replay ID
     * @returns {Object|null} The pending context if ready, otherwise null
     */
  }, {
    key: "_pendingContextIfReady",
    value: function _pendingContextIfReady(replayId) {
      var ctx = this._pending.get(replayId);
      return ctx && !ctx.aborted && !ctx.sending && ctx.chunkQueue.length > 0 && this._shouldSend(replayId) ? ctx : null;
    }
  }]);
}();

;// ./src/browser/replay/replay.js
function replay_typeof(o) { "@babel/helpers - typeof"; return replay_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, replay_typeof(o); }
function replay_slicedToArray(r, e) { return replay_arrayWithHoles(r) || replay_iterableToArrayLimit(r, e) || replay_unsupportedIterableToArray(r, e) || replay_nonIterableRest(); }
function replay_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function replay_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return replay_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? replay_arrayLikeToArray(r, a) : void 0; } }
function replay_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function replay_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function replay_arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function replay_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return replay_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (replay_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, replay_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, replay_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), replay_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", replay_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), replay_regeneratorDefine2(u), replay_regeneratorDefine2(u, o, "Generator"), replay_regeneratorDefine2(u, n, function () { return this; }), replay_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (replay_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function replay_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } replay_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { replay_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, replay_regeneratorDefine2(e, r, n, t); }
function replay_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function replay_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { replay_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { replay_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function replay_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function replay_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? replay_ownKeys(Object(t), !0).forEach(function (r) { replay_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : replay_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function replay_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function replay_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, replay_toPropertyKey(o.key), o); } }
function replay_createClass(e, r, t) { return r && replay_defineProperties(e.prototype, r), t && replay_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function replay_defineProperty(e, r, t) { return (r = replay_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function replay_toPropertyKey(t) { var i = replay_toPrimitive(t, "string"); return "symbol" == replay_typeof(i) ? i : i + ""; }
function replay_toPrimitive(t, r) { if ("object" != replay_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != replay_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
;







/** @typedef {import('./recorder.js').BufferCursor} BufferCursor */
/** @typedef {import('./recorder.js').Recorder} Recorder */

/**
 * Enum for tracking the status of trailing replay sends.
 * Used to coordinate between trailing and leading replay captures.
 */
var TrailingStatus = Object.freeze({
  PENDING: 'pending',
  // Trailing not yet sent
  SENT: 'sent',
  // Trailing successfully sent
  FAILED: 'failed',
  // Trailing failed to send
  SKIPPED: 'skipped' // Trailing was skipped (replay is leading only)
});

/**
 * Replay - Manages the mapping between error occurrences and their associated
 * session recordings. This class handles the coordination between when recordings
 * are dumped and when they are eventually sent to the backend.
 */
var Replay = /*#__PURE__*/function () {
  /**
   * Creates a new Replay instance
   *
   * @param {Object} [props.tracing] - The tracing instance used to create spans and manage context
   * @param {Object} [props.telemeter] - Optional telemeter instance for capturing telemetry events
   * @param {Object} [props.options] - Configuration options
   */
  function Replay(_ref) {
    var tracing = _ref.tracing,
      telemeter = _ref.telemeter,
      options = _ref.options;
    replay_classCallCheck(this, Replay);
    replay_defineProperty(this, "_map", void 0);
    replay_defineProperty(this, "_options", void 0);
    /** @type {Recorder} */
    replay_defineProperty(this, "_recorder", void 0);
    replay_defineProperty(this, "_tracing", void 0);
    replay_defineProperty(this, "_telemeter", void 0);
    replay_defineProperty(this, "_scheduledCapture", void 0);
    replay_defineProperty(this, "_trailingStatus", void 0);
    if (!tracing) {
      throw new TypeError("Expected 'tracing' to be provided");
    }
    this._map = new Map();
    this._options = options;
    this._predicates = new ReplayPredicates(options);
    this._recorder = new Recorder(replay_objectSpread(replay_objectSpread({}, options), {}, {
      maxPreDuration: this._predicates.maxPreDuration
    }));
    this._tracing = tracing;
    this._telemeter = telemeter;
    this._trailingStatus = new Map();
    this._scheduledCapture = new ScheduledStreamCapture({
      recorder: this._recorder,
      tracing: this._tracing,
      telemeter: this._telemeter,
      shouldSend: this._shouldSendScheduled.bind(this),
      onComplete: this._onScheduledComplete.bind(this)
    });
    this._tracing.addSpanTransform(this.uuidsTransform.bind(this));
  }

  /**
   * Called when a scheduled capture completes (sent or discarded).
   * Cleans up the trailing status coordination state.
   *
   * @param {string} replayId - The replay ID
   * @private
   */
  return replay_createClass(Replay, [{
    key: "_onScheduledComplete",
    value: function _onScheduledComplete(replayId) {
      this._trailingStatus.delete(replayId);
    }

    /**
     * Determines if a scheduled replay should be sent based on coordination state.
     *
     * Scheduled replays can only be sent after the trailing replay has been
     * successfully sent or explicitly skipped (for leading-only captures).
     *
     * @param {string} replayId - The replay ID
     * @returns {boolean} True if scheduled replay can be sent
     * @private
     */
  }, {
    key: "_shouldSendScheduled",
    value: function _shouldSendScheduled(replayId) {
      var status = this._trailingStatus.get(replayId);
      return status === TrailingStatus.SENT || status === TrailingStatus.SKIPPED;
    }
  }, {
    key: "configure",
    value: function configure(options) {
      this._options = options;
      this._predicates.configure(options);
      this._recorder.configure(replay_objectSpread(replay_objectSpread({}, options), {}, {
        maxPreDuration: this._predicates.maxPreDuration
      }));
    }

    /**
     * Exports recording and telemetry spans, then stores the tracing payload in the map.
     *
     * Exports both telemetry and recording spans, then generates the complete payload
     * using the tracing exporter and stores it in the map using replayId as the key.
     * This is an async operation that runs in the background.
     *
     * @param {string} replayId - The unique ID for this replay
     * @param {string} occurrenceUuid - The UUID of the associated error occurrence
     * @private
     */
  }, {
    key: "_exportSpansAndAddTracingPayload",
    value: (function () {
      var _exportSpansAndAddTracingPayload2 = replay_asyncToGenerator(/*#__PURE__*/replay_regenerator().m(function _callee(replayId, occurrenceUuid, trigger, triggerContext) {
        var _this$_telemeter;
        var payload, leadingSeconds, _t;
        return replay_regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              this._recorder.exportRecordingSpan(this._tracing, replay_objectSpread({
                'rollbar.replay.id': replayId,
                'rollbar.occurrence.uuid': occurrenceUuid
              }, this._triggerAttributes(trigger, triggerContext)));
              _context.n = 2;
              break;
            case 1:
              _context.p = 1;
              _t = _context.v;
              // TODO(matux): No events probably, this is expected, be more graceful.
              src_logger.debug('Error exporting recording span:', _t);
              return _context.a(2);
            case 2:
              (_this$_telemeter = this._telemeter) === null || _this$_telemeter === void 0 || _this$_telemeter.exportTelemetrySpan({
                'rollbar.replay.id': replayId
              });
              payload = this._tracing.exporter.toPayload();
              this._map.set(replayId, payload);
              leadingSeconds = (trigger === null || trigger === void 0 ? void 0 : trigger.postDuration) || 0;
              if (leadingSeconds > 0) {
                this._scheduledCapture.schedule(replayId, occurrenceUuid, leadingSeconds);
                this._trailingStatus.set(replayId, TrailingStatus.PENDING);
              }
            case 3:
              return _context.a(2);
          }
        }, _callee, this, [[0, 1]]);
      }));
      function _exportSpansAndAddTracingPayload(_x, _x2, _x3, _x4) {
        return _exportSpansAndAddTracingPayload2.apply(this, arguments);
      }
      return _exportSpansAndAddTracingPayload;
    }()
    /**
     * Builds the span attributes that identify what triggered a replay and
     * where it started.
     *
     * @param {Object} trigger - The matching trigger configuration
     * @param {Object} triggerContext - The context the trigger matched against
     * @returns {Object} The trigger, starting URL and options span attributes
     * @private
     */
    )
  }, {
    key: "_triggerAttributes",
    value: function _triggerAttributes(trigger, triggerContext) {
      return {
        'rollbar.replay.trigger.type': trigger.type,
        'rollbar.replay.trigger.context': JSON.stringify(triggerContext),
        'rollbar.replay.trigger': JSON.stringify(trigger),
        'rollbar.replay.url.full': sanitizeHref(window.location.href),
        'rollbar.replay.options': JSON.stringify(this._options || {})
      };
    }

    /**
     * Captures a replay and returns a uniquely generated replay ID.
     *
     * This method immediately returns the replayId and asynchronously processes
     * the replay data in the background. The processing involves converting
     * recorder events into a payload format and storing it in the map.
     *
     * @returns {string} A unique identifier for this replay
     */
  }, {
    key: "capture",
    value: function capture(replayId, occurrenceUuid, triggerContext) {
      if (!this._recorder.isReady) {
        src_logger.warn('Replay.capture: Recorder is not ready, cannot export replay');
        return null;
      }
      replayId = replayId || id.gen(8);

      /*
       * trigger.preDuration and trigger.postDuration are the requested capture
       * durations for the trigger. The recorder buffers have been configured to
       * handle the max preDuration across all triggers.
       */
      var trigger = this._predicates.shouldCaptureForTriggerContext(replay_objectSpread(replay_objectSpread({}, triggerContext), {}, {
        replayId: replayId
      }));
      if (!trigger) {
        return null;
      }

      // Start processing the replay in the background
      this._exportSpansAndAddTracingPayload(replayId, occurrenceUuid, trigger, triggerContext);
      return replayId;
    }

    /**
     * On a matching trigger condition, captures and sends a replay.
     * This method handles the non-occurrence based triggers, which don't require
     * special occurrence-specific handling.
     *
     * When the recorder is not ready yet (e.g. a navigation trigger fired on
     * DOMContentLoaded, before rrweb's first full snapshot), there is no
     * trailing replay to send, so only the leading capture is scheduled.
     *
     * @returns {string} A unique identifier for this replay or null if not sent.
     */
  }, {
    key: "triggerReplay",
    value: (function () {
      var _triggerReplay = replay_asyncToGenerator(/*#__PURE__*/replay_regenerator().m(function _callee2(triggerContext) {
        var replayId, trigger, _t2;
        return replay_regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              replayId = id.gen(8);
              trigger = this._predicates.shouldCaptureForTriggerContext(replay_objectSpread(replay_objectSpread({}, triggerContext), {}, {
                replayId: replayId
              }));
              if (trigger) {
                _context2.n = 1;
                break;
              }
              return _context2.a(2, null);
            case 1:
              if (this._recorder.isReady) {
                _context2.n = 2;
                break;
              }
              return _context2.a(2, this._scheduleLeadingOnlyCapture(replayId, trigger, triggerContext));
            case 2:
              _context2.n = 3;
              return this._exportSpansAndAddTracingPayload(replayId, null, trigger, triggerContext);
            case 3:
              if (this._map.has(replayId)) {
                _context2.n = 4;
                break;
              }
              return _context2.a(2, null);
            case 4:
              _context2.p = 4;
              _context2.n = 5;
              return this.send(replayId);
            case 5:
              _context2.n = 7;
              break;
            case 6:
              _context2.p = 6;
              _t2 = _context2.v;
              this.discard(replayId);
              return _context2.a(2, null);
            case 7:
              return _context2.a(2, replayId);
          }
        }, _callee2, this, [[4, 6]]);
      }));
      function triggerReplay(_x5) {
        return _triggerReplay.apply(this, arguments);
      }
      return triggerReplay;
    }()
    /**
     * Schedules a leading-only capture for a trigger that fired before the
     * recorder was ready. The trailing capture is marked as skipped so the
     * leading chunks may be sent on their own.
     *
     * Without a trailing recording span, the leading chunks are the only spans
     * for this replay, so they carry the trigger and starting URL attributes
     * the trailing span would otherwise have.
     *
     * @param {string} replayId - The replay ID
     * @param {Object} trigger - The matching trigger configuration
     * @param {Object} triggerContext - The context the trigger matched against
     * @returns {string|null} The replay ID if a leading capture was scheduled,
     *   otherwise null (including when the trigger attributes can't be
     *   serialised).
     * @private
     */
    )
  }, {
    key: "_scheduleLeadingOnlyCapture",
    value: function _scheduleLeadingOnlyCapture(replayId, trigger, triggerContext) {
      var leadingSeconds = trigger.postDuration || 0;
      if (!this._recorder.isRecording || leadingSeconds <= 0) {
        return null;
      }

      // Built before any state is recorded, so a context that can't be
      // serialised drops the replay the same way it does on the ready path.
      var attributes;
      try {
        attributes = this._triggerAttributes(trigger, triggerContext);
      } catch (error) {
        src_logger.debug('Error building replay trigger attributes:', error);
        return null;
      }
      this._trailingStatus.set(replayId, TrailingStatus.SKIPPED);
      this._scheduledCapture.schedule(replayId, null, leadingSeconds, attributes);
      return replayId;
    }

    /**
     * Determines if a replay can be sent based on API response and headers.
     *
     * @param {Error|null} err - Any error that occurred during the API request
     * @param {Object|null} resp - The API response object
     * @param {Object|null} hs - The response headers
     * @returns {boolean} true if the replay can be sent, false otherwise.
     * @private
     */
  }, {
    key: "sendOrDiscardReplay",
    value: (
    /**
     * Sends or discards a replay based on whether it can be sent.
     *
     * The criteria for sending a replay are:
     * - No error occurred during the API request
     * - The response indicates success (err === 0)
     * - Replay is enabled on the server
     * - Rate limit quota is not exhausted
     *
     * Called by Queue after determining replay eligibility from API response.
     *
     * @param {string} replayId - The ID of the replay to send or discard
     * @param {Error|null} err - Any error that occurred during the API request
     * @param {Object|null} resp - The API response object
     * @param {Object|null} headers - The response headers
     * @returns {Promise<void>} A promise that resolves when the operation is complete
     */
    function () {
      var _sendOrDiscardReplay = replay_asyncToGenerator(/*#__PURE__*/replay_regenerator().m(function _callee3(replayId, err, resp, headers) {
        var canSendReplay, _t3;
        return replay_regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              canSendReplay = Replay._canSendReplay(err, resp, headers);
              if (!canSendReplay) {
                _context3.n = 5;
                break;
              }
              _context3.p = 1;
              _context3.n = 2;
              return this.send(replayId);
            case 2:
              _context3.n = 4;
              break;
            case 3:
              _context3.p = 3;
              _t3 = _context3.v;
              src_logger.error('Failed to send replay:', _t3);
              this.discard(replayId);
            case 4:
              _context3.n = 6;
              break;
            case 5:
              this.discard(replayId);
            case 6:
              return _context3.a(2);
          }
        }, _callee3, this, [[1, 3]]);
      }));
      function sendOrDiscardReplay(_x6, _x7, _x8, _x9) {
        return _sendOrDiscardReplay.apply(this, arguments);
      }
      return sendOrDiscardReplay;
    }()
    /**
     * Sends the replay payload associated with the given replayId to the backend
     * and removes it from the map.
     *
     * Retrieves the payload from the map, checks if it's valid, then sends it
     * to the API endpoint for processing. The payload can be either a spans array
     * or a formatted OTLP payload object.
     *
     * @param {string} replayId - The ID of the replay to send
     * @returns {Promise<boolean>} A promise that resolves to true if the payload was found and sent, false otherwise
     */
    )
  }, {
    key: "send",
    value: (function () {
      var _send = replay_asyncToGenerator(/*#__PURE__*/replay_regenerator().m(function _callee4(replayId) {
        var payload, isEmpty;
        return replay_regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              if (replayId) {
                _context4.n = 1;
                break;
              }
              throw Error('Replay.send: No replayId provided');
            case 1:
              if (this._map.has(replayId)) {
                _context4.n = 2;
                break;
              }
              throw Error("Replay.send: No replay found for id: ".concat(replayId));
            case 2:
              payload = this._map.get(replayId);
              this._map.delete(replayId);

              // Check if payload is empty (could be raw spans array or OTLP payload)
              isEmpty = !payload || Array.isArray(payload) && payload.length === 0 || payload.resourceSpans && payload.resourceSpans.length === 0;
              if (!isEmpty) {
                _context4.n = 3;
                break;
              }
              throw Error("Replay.send: No payload found for id: ".concat(replayId));
            case 3:
              _context4.n = 4;
              return this._tracing.exporter.post(payload, {
                'X-Rollbar-Replay-Id': replayId
              });
            case 4:
              this._trailingStatus.set(replayId, TrailingStatus.SENT);
              _context4.n = 5;
              return this._scheduledCapture.sendIfReady(replayId);
            case 5:
              return _context4.a(2);
          }
        }, _callee4, this);
      }));
      function send(_x0) {
        return _send.apply(this, arguments);
      }
      return send;
    }()
    /**
     * Discards the replay associated with the given replay ID by removing
     * it from the map without sending it.
     *
     * @param {string} replayId - The ID of the replay to discard
     * @returns {boolean} True if a replay was found and discarded, false otherwise
     */
    )
  }, {
    key: "discard",
    value: function discard(replayId) {
      if (!replayId) {
        src_logger.error('Replay.discard: No replayId provided');
        return false;
      }
      this._trailingStatus.set(replayId, TrailingStatus.FAILED);
      this._scheduledCapture.discard(replayId);
      if (!this._map.has(replayId)) {
        src_logger.error("Replay.discard: No replay found for replayId: ".concat(replayId));
        return false;
      }
      this._map.delete(replayId);
      this._trailingStatus.delete(replayId);
      return true;
    }
  }, {
    key: "uuidsTransform",
    value: function uuidsTransform(span) {
      var startTime = hrtime.toMillis(span.startTime);
      var uuidEvents = this._telemeter.queue.filter(function (e) {
        return e.timestamp_ms >= startTime && e.uuid;
      });
      var uuids = uuidEvents.map(function (e) {
        return e.uuid;
      });
      span.attributes['rollbar.occurrence.uuids'] = JSON.stringify(uuids);
    }

    /**
     * Gets spans for the given replay ID
     *
     * @param {string} replayId - The ID to retrieve spans for
     * @returns {Array|null} The spans array or null if not found
     */
  }, {
    key: "getSpans",
    value: function getSpans(replayId) {
      var _this$_map$get;
      return (_this$_map$get = this._map.get(replayId)) !== null && _this$_map$get !== void 0 ? _this$_map$get : null;
    }

    /**
     * Sets spans for a given replay ID
     *
     * @param {string} replayId - The ID to set spans for
     * @param {Array} spans - The spans to set
     */
  }, {
    key: "setSpans",
    value: function setSpans(replayId, spans) {
      this._map.set(replayId, spans);
    }

    /**
     * Clears all stored replays without sending them
     */
  }, {
    key: "clear",
    value: function clear() {
      this._map.clear();
    }

    /**
     * Returns the size of the map (number of stored replays)
     *
     * @returns {number} The number of replays currently stored
     */
  }, {
    key: "size",
    get: function get() {
      return this._map.size;
    }

    /**
     * Returns the Recorder instance used by this manager
     *
     * @returns {Recorder} The Recorder instance
     */
  }, {
    key: "recorder",
    get: function get() {
      return this._recorder;
    }
  }], [{
    key: "_canSendReplay",
    value: function _canSendReplay(err, resp, hs) {
      if (!hs) return false;
      var hasNoErrors = !err && (resp === null || resp === void 0 ? void 0 : resp.err) === 0;
      var headers = Object.fromEntries(Object.entries(hs).map(function (_ref2) {
        var _ref3 = replay_slicedToArray(_ref2, 2),
          k = _ref3[0],
          v = _ref3[1];
        return [k.toLowerCase(), String(v).trim()];
      }));
      var headersAreValid = headers['rollbar-replay-enabled'] === 'true' && headers['rollbar-replay-ratelimit-remaining'] !== '0';
      return hasNoErrors && headersAreValid;
    }
  }]);
}();

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
  return hasOwn(this.map, normalizeName(name));
};
FetchHeaders.prototype.forEach = function (callback, thisArg) {
  for (var name in this.map) {
    if (hasOwn(this.map, name)) {
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
/**
 * Replaces `obj[name]` with `replacement(obj[name])`, optionally recording the
 * original so it can be restored later.
 *
 * Some pages (or older browsers) expose properties we instrument as read-only,
 * e.g. a non-writable `XMLHttpRequest.prototype.open` or a frozen object. In
 * strict mode assigning to those throws, and since instrumentation runs inside
 * the Rollbar constructor that would break the host page. Instead the property
 * is left untouched and nothing is recorded.
 *
 * @param {Object} obj - The object that owns (or inherits) the property.
 * @param {string} name - The property to replace.
 * @param {Function} replacement - Receives the original value, returns the new one.
 * @param {Object} [replacements] - Map of type to `[obj, name, orig]` restore entries.
 * @param {string} [type] - Key in `replacements` to record the original under.
 * @returns {boolean} Whether the property was replaced.
 */
function replace(obj, name, replacement, replacements, type) {
  var orig = obj[name];
  var wrapped = replacement(orig);
  try {
    obj[name] = wrapped;
  } catch (_e) {
    return false;
  }
  if (replacements) {
    replacements[type].push([obj, name, orig]);
  }
  return true;
}
/* harmony default export */ var utility_replace = (replace);
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
  var elementType = getElementType(element);
  var _iterator = domUtility_createForOfIteratorHelper(subtypes),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var subtype = _step.value;
      if (subtype === elementType) {
        return true;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
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
    if (!nextDescription || nextDescription.tagName === 'html') {
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
function elementString(elem) {
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
  var _iterator2 = domUtility_createForOfIteratorHelper(desc.attributes),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var attribute = _step2.value;
      out.push('[' + attribute.key + '="' + attribute.value + '"]');
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
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
    className;
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
  for (var _i = 0, _attributes = attributes; _i < _attributes.length; _i++) {
    var attribute = _attributes[_i];
    var attr = elem.getAttribute(attribute);
    if (attr) {
      out.attributes.push({
        key: attribute,
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
    var _iterator3 = domUtility_createForOfIteratorHelper(classes),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var cls = _step3.value;
        if (typeof cls === 'string') {
          if (element.classList.contains(cls)) {
            return true;
          }
        } else {
          var _iterator5 = domUtility_createForOfIteratorHelper(element.classList),
            _step5;
          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var c = _step5.value;
              if (cls.test(c)) {
                return true;
              }
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    var _iterator4 = domUtility_createForOfIteratorHelper(selectors),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var sel = _step4.value;
        if (element.matches(sel)) {
          return true;
        }
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
  } catch (_e) {
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
function telemetry_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function telemetry_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, telemetry_toPropertyKey(o.key), o); } }
function telemetry_createClass(e, r, t) { return r && telemetry_defineProperties(e.prototype, r), t && telemetry_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function telemetry_defineProperty(e, r, t) { return (r = telemetry_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function telemetry_toPropertyKey(t) { var i = telemetry_toPrimitive(t, "string"); return "symbol" == browser_telemetry_typeof(i) ? i : i + ""; }
function telemetry_toPrimitive(t, r) { if ("object" != browser_telemetry_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != browser_telemetry_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function telemetry_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = telemetry_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function telemetry_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return telemetry_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? telemetry_arrayLikeToArray(r, a) : void 0; } }
function telemetry_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/* eslint-disable @typescript-eslint/no-this-alias */
// TODO(matux): refactor to remove no-this-alias disable

;






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
    telemetry_classCallCheck(this, Instrumenter);
    telemetry_defineProperty(this, "deinstrumentConnectivity", function () {
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
      this.autoInstrument = merge(telemetry_defaults, autoInstrument);
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
  return telemetry_createClass(Instrumenter, [{
    key: "configureScrubbing",
    value: function configureScrubbing() {
      var _options$scrubTelemet, _options$replay, _options$replay2, _options$replay3, _options$replay4, _options$replay5, _options$replay6, _options$replay7, _options$replay8, _options$replay9;
      var options = this.options;
      this.scrubTelemetryInputs = Boolean((_options$scrubTelemet = options.scrubTelemetryInputs) !== null && _options$scrubTelemet !== void 0 ? _options$scrubTelemet : (_options$replay = options.replay) === null || _options$replay === void 0 ? void 0 : _options$replay.maskAllInputs);
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
      this.options = merge(this.options, options);
      var autoInstrument = options.autoInstrument;
      var oldSettings = merge(this.autoInstrument);
      if (options.enabled === false || autoInstrument === false) {
        this.autoInstrument = {};
      } else {
        if (!isType(autoInstrument, 'object')) {
          autoInstrument = telemetry_defaults;
        }
        this.autoInstrument = merge(telemetry_defaults, autoInstrument);
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
        var xhrReplacements = {
          xhr: []
        };
        utility_replace(xhrp, 'open', function (orig) {
          return function (method, url) {
            var isUrlObject = _isUrlObject(url);
            if (isType(url, 'string') || isUrlObject) {
              url = isUrlObject ? url.toString() : url;
              if (this.__rollbar_xhr) {
                this.__rollbar_xhr.method = method;
                this.__rollbar_xhr.url = url;
                this.__rollbar_xhr.status_code = null;
                this.__rollbar_xhr.start_time_ms = now();
                this.__rollbar_xhr.end_time_ms = null;
              } else {
                this.__rollbar_xhr = {
                  method: method,
                  url: url,
                  status_code: null,
                  start_time_ms: now(),
                  end_time_ms: null
                };
              }
            }
            return orig.apply(this, arguments);
          };
        }, xhrReplacements, 'xhr');
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
        }, xhrReplacements, 'xhr');
        utility_replace(xhrp, 'send', function (orig) {
          return function (data) {
            var _self$rollbar, _xhr$__rollbar_xhr;
            var xhr = this;
            var tracing = (_self$rollbar = self.rollbar) === null || _self$rollbar === void 0 ? void 0 : _self$rollbar.tracing;
            if (shouldAddBaggageHeader(self.options, tracing, (_xhr$__rollbar_xhr = xhr.__rollbar_xhr) === null || _xhr$__rollbar_xhr === void 0 ? void 0 : _xhr$__rollbar_xhr.url)) {
              try {
                xhr.setRequestHeader('baggage', "rollbar.session.id=".concat(tracing.sessionId));
              } catch (_e) {
                /* ignore errors from adding baggage header */
              }
            }
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
                  xhr.__rollbar_xhr.start_time_ms = now();
                }
                if (xhr.readyState > 3) {
                  var end_time_ms = now();
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
                    } catch (_e) {
                      /* we ignore the errors here that could come from different
                       * browser issues with the xhr methods */
                    }
                  }
                  var body = null;
                  if (self.autoInstrument.networkResponseBody) {
                    try {
                      body = xhr.responseText;
                    } catch (_e) {
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
                  } catch (_e) {
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
        }, xhrReplacements, 'xhr');

        // open, setRequestHeader and send share __rollbar_xhr state, so a
        // partially patched prototype would record broken telemetry. If any of
        // them is read-only (#1451), leave XHR uninstrumented entirely.
        if (xhrReplacements.xhr.length === 3) {
          var _this$replacements$ne;
          (_this$replacements$ne = this.replacements.network).push.apply(_this$replacements$ne, telemetry_toConsumableArray(xhrReplacements.xhr));
        } else {
          var patched = xhrReplacements.xhr.map(function (r) {
            return r[1];
          });
          var readOnly = ['open', 'setRequestHeader', 'send'].filter(function (m) {
            return !patched.includes(m);
          });
          restore(xhrReplacements, 'xhr');
          // Recorded in notifier.diagnostic so the missing XHR telemetry is
          // explained on every occurrence (see addDiagnosticKeys). An injected
          // client may not provide one, and this runs in the constructor.
          if (this.diagnostic) {
            this.diagnostic.instrumentNetwork = {
              xhr: "skipped: XMLHttpRequest.prototype not writable (".concat(readOnly.join(', '), ")")
            };
          }
        }
      }
      if ('fetch' in this._window) {
        utility_replace(this._window, 'fetch', function (orig) {
          return function (_fn, _t) {
            var _self$rollbar2;
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
            var tracing = (_self$rollbar2 = self.rollbar) === null || _self$rollbar2 === void 0 ? void 0 : _self$rollbar2.tracing;
            if (shouldAddBaggageHeader(self.options, tracing, url)) {
              var _headers2 = {
                baggage: "rollbar.session.id=".concat(tracing.sessionId)
              };
              addHeadersToFetch(args, _headers2);
            }
            var metadata = {
              method: method,
              url: url,
              status_code: null,
              start_time_ms: now(),
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
              var end_time_ms = now();
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
      } catch (_e) {
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
        // eslint-disable-next-line strict
        'use strict';

        // See https://github.com/rollbar/rollbar.js/pull/778
        var orig = c[method];
        var origConsole = c;
        var level = method === 'warn' ? 'warning' : method;
        c[method] = function () {
          var args = Array.prototype.slice.call(arguments);
          try {
            var message = formatArgsAsString(args);
            self.telemeter.captureLog(message, level, null, now());
          } catch (e) {
            // Telemetry must never prevent the app's own console call. Record
            // the failure in the payload diagnostics instead of logging it,
            // since logging would call back into this wrapper.
            self.diagnostic.captureLog = {
              error: e === null || e === void 0 ? void 0 : e.message
            };
          }
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
        src_logger.log("".concat(name, " handler error"), evt, exc, exc.stack);
      }
    }
  }, {
    key: "handleContentLoaded",
    value: function handleContentLoaded(_evt) {
      this.rollbar.triggerReplay({
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
        element: elementString(evt.target),
        timestamp: now()
      });
    }
  }, {
    key: "handleFocus",
    value: function handleFocus(evt) {
      var _evt$target2;
      var type = evt.type;
      var element = (_evt$target2 = evt.target) !== null && _evt$target2 !== void 0 && _evt$target2.window ? 'window' : elementString(evt.target);
      this.telemeter.captureFocus({
        type: type,
        isSynthetic: !evt.isTrusted,
        element: element,
        timestamp: now()
      });
    }
  }, {
    key: "handleForm",
    value: function handleForm(_evt) {
      // TODO: implement form event handling
      //const type = evt.type;
      //const elementString = evt.target?.window
      //  ? 'window'
      //  : domUtil.elementString(evt.target);
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
        timestamp: now()
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
        element: elementString(evt.target),
        dropEffect: dropEffect,
        effectAllowed: effectAllowed,
        kinds: JSON.stringify(kinds),
        mediaTypes: JSON.stringify(mediaTypes),
        timestamp: now()
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
      var _evt$target3, _evt$target4, _evt$target5, _evt$target6;
      var type = evt.type;
      var tagName = (_evt$target3 = evt.target) === null || _evt$target3 === void 0 ? void 0 : _evt$target3.tagName.toLowerCase();
      var value = (_evt$target4 = evt.target) === null || _evt$target4 === void 0 ? void 0 : _evt$target4.value;
      var inputType = ((_evt$target5 = evt.target) === null || _evt$target5 === void 0 || (_evt$target5 = _evt$target5.attributes) === null || _evt$target5 === void 0 || (_evt$target5 = _evt$target5.type) === null || _evt$target5 === void 0 ? void 0 : _evt$target5.value) || ((_evt$target6 = evt.target) === null || _evt$target6 === void 0 ? void 0 : _evt$target6.type);
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
            var _evt$target7;
            value = (_evt$target7 = evt.target) === null || _evt$target7 === void 0 ? void 0 : _evt$target7.checked;
          }
          break;
      }
      this.telemeter.captureInput({
        type: inputType,
        isSynthetic: !evt.isTrusted,
        element: elementString(evt.target),
        value: value,
        timestamp: now()
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
            self.handleUrlChange(self._lastHref, String(url));
          }
          return orig.apply(this, arguments);
        };
      }, this.replacements, 'navigation');
    }
  }, {
    key: "handleUrlChange",
    value: function handleUrlChange(from, to) {
      var parsedHref = url_parse(this._location.href);
      var parsedTo = url_parse(to);
      var parsedFrom = url_parse(from);
      this._lastHref = to;
      if (parsedHref.protocol === parsedTo.protocol && parsedHref.host === parsedTo.host) {
        to = parsedTo.path + (parsedTo.hash || '');
      }
      if (parsedHref.protocol === parsedFrom.protocol && parsedHref.host === parsedFrom.host) {
        from = parsedFrom.path + (parsedFrom.hash || '');
      }
      this.telemeter.captureNavigation(from, to, null, now());
      this.rollbar.triggerReplay({
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
        timestamp: now()
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
      this.telemeter.captureLog(message, 'error', null, now());
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
  if (hasOwn(prototype, 'addEventListener')) {
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
;// ./src/browser/rollbarReplay.js








core.setComponents({
  telemeter: telemetry,
  instrumenter: browser_telemetry,
  wrapGlobals: browser_wrapGlobals,
  scrub: src_scrub,
  truncation: truncation,
  tracing: Tracing,
  replay: Replay
});
/* harmony default export */ var rollbarReplay = (core);
;// ./src/browser/bundles/rollbarReplay.js


var options = typeof window !== 'undefined' && window._rollbarConfig;
var alias = options && options.globalAlias || 'Rollbar';
var shimRunning = typeof window !== 'undefined' && window[alias] && typeof window[alias].shimId === 'function' && window[alias].shimId() !== undefined;
if (typeof window !== 'undefined' && !window._rollbarStartTime) {
  window._rollbarStartTime = new Date().getTime();
}
if (!shimRunning && options) {
  var rollbarReplay_Rollbar = new rollbarReplay(options);
  window[alias] = rollbarReplay_Rollbar;
} else if (typeof window !== 'undefined') {
  window.rollbar = rollbarReplay;
  window._rollbarDidLoad = true;
} else if (typeof self !== 'undefined') {
  self.rollbar = rollbarReplay;
  self._rollbarDidLoad = true;
}
/* harmony default export */ var bundles_rollbarReplay = (commonjsDefault(rollbarReplay));
}();
__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=rollbar.replay.umd.js.map