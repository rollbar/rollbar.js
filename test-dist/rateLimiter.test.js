(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/merge.js":
/*!**********************!*\
  !*** ./src/merge.js ***!
  \**********************/
/***/ ((module) => {

"use strict";


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
    result = {},
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
module.exports = merge;

/***/ }),

/***/ "./src/rateLimiter.js":
/*!****************************!*\
  !*** ./src/rateLimiter.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");

/*
 * RateLimiter - an object that encapsulates the logic for counting items sent to Rollbar
 *
 * @param options - the same options that are accepted by configureGlobal offered as a convenience
 */
function RateLimiter(options) {
  this.startTime = _.now();
  this.counter = 0;
  this.perMinCounter = 0;
  this.platform = null;
  this.platformOptions = {};
  this.configureGlobal(options);
}
RateLimiter.globalSettings = {
  startTime: _.now(),
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
  now = now || _.now();
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
module.exports = RateLimiter;

/***/ }),

/***/ "./src/utility.js":
/*!************************!*\
  !*** ./src/utility.js ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var merge = __webpack_require__(/*! ./merge */ "./src/merge.js");
var RollbarJSON = {};
function setupJSON(polyfillJSON) {
  if (isFunction(RollbarJSON.stringify) && isFunction(RollbarJSON.parse)) {
    return;
  }
  if (isDefined(JSON)) {
    // If polyfill is provided, prefer it over existing non-native shims.
    if (polyfillJSON) {
      if (isNativeFunction(JSON.stringify)) {
        RollbarJSON.stringify = JSON.stringify;
      }
      if (isNativeFunction(JSON.parse)) {
        RollbarJSON.parse = JSON.parse;
      }
    } else {
      // else accept any interface that is present.
      if (isFunction(JSON.stringify)) {
        RollbarJSON.stringify = JSON.stringify;
      }
      if (isFunction(JSON.parse)) {
        RollbarJSON.parse = JSON.parse;
      }
    }
  }
  if (!isFunction(RollbarJSON.stringify) || !isFunction(RollbarJSON.parse)) {
    polyfillJSON && polyfillJSON(RollbarJSON);
  }
}

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
    value = RollbarJSON.stringify(obj);
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
    value = RollbarJSON.parse(s);
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
    for (var i = 0; i < errors.length; ++i) {
      if (errors[i].hasOwnProperty('rollbarContext')) {
        custom = merge(custom, nonCircularClone(errors[i].rollbarContext));
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
function addItemAttributes(item, attributes) {
  item.data.attributes = item.data.attributes || [];
  if (attributes) {
    var _item$data$attributes;
    (_item$data$attributes = item.data.attributes).push.apply(_item$data$attributes, _toConsumableArray(attributes));
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
function now() {
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
module.exports = {
  addParamsAndAccessTokenToPath: addParamsAndAccessTokenToPath,
  createItem: createItem,
  addErrorContext: addErrorContext,
  createTelemetryEvent: createTelemetryEvent,
  addItemAttributes: addItemAttributes,
  filterIp: filterIp,
  formatArgsAsString: formatArgsAsString,
  formatUrl: formatUrl,
  get: get,
  handleOptions: handleOptions,
  isError: isError,
  isFiniteNumber: isFiniteNumber,
  isFunction: isFunction,
  isIterable: isIterable,
  isNativeFunction: isNativeFunction,
  isObject: isObject,
  isString: isString,
  isType: isType,
  isPromise: isPromise,
  isBrowser: isBrowser,
  jsonParse: jsonParse,
  LEVELS: LEVELS,
  makeUnhandledStackInfo: makeUnhandledStackInfo,
  merge: merge,
  now: now,
  redact: redact,
  RollbarJSON: RollbarJSON,
  sanitizeUrl: sanitizeUrl,
  set: set,
  setupJSON: setupJSON,
  stringify: stringify,
  maxByteSize: maxByteSize,
  typeName: typeName,
  uuid4: uuid4
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************************!*\
  !*** ./test/rateLimiter.test.js ***!
  \**********************************/
/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var RateLimiter = __webpack_require__(/*! ../src/rateLimiter */ "./src/rateLimiter.js");

describe('RateLimiter()', function () {
  it('should have all of the expected methods', function (done) {
    var options = {};
    var rateLimiter = new RateLimiter(options);
    expect(rateLimiter).to.have.property('configureGlobal');
    expect(rateLimiter).to.have.property('shouldSend');

    done();
  });

  it('should have global properties', function (done) {
    var options = {};
    var rateLimiter = new RateLimiter(options);
    expect(RateLimiter).to.have.property('globalSettings');
    var now = new Date().getTime();
    expect(RateLimiter.globalSettings.startTime).to.be.within(
      now - 1000,
      now + 1000,
    );
    expect(RateLimiter.globalSettings.maxItems).to.not.be.ok();

    done();
  });

  it('should set the global options', function (done) {
    var options = {
      startTime: 1,
      maxItems: 50,
      itemsPerMinute: 102,
      fake: 'stuff',
    };
    var rateLimiter = new RateLimiter(options);
    expect(RateLimiter.globalSettings.startTime).to.be.eql(1);
    expect(RateLimiter.globalSettings.maxItems).to.be.eql(50);
    expect(RateLimiter.globalSettings.itemsPerMinute).to.be.eql(102);
    expect(RateLimiter.globalSettings.fake).to.not.be.eql('stuff');

    done();
  });
});

describe('shouldSend', function () {
  it('should say to send if item says ignore', function (done) {
    var now = new Date().getTime();
    var options = { startTime: now, maxItems: 4, itemsPerMinute: 2 };
    var rateLimiter = new RateLimiter(options);

    var item = { ignoreRateLimit: true };
    var result = rateLimiter.shouldSend(item);
    expect(result.shouldSend).to.be.ok();

    done();
  });

  it('should say not to send if over the per minute limit', function (done) {
    var now = new Date().getTime();
    var options = { startTime: now, maxItems: 4, itemsPerMinute: 2 };
    var rateLimiter = new RateLimiter(options);

    var i1 = { a: 1 };
    var i2 = { a: 2 };
    var i3 = { a: 3 };
    var result1 = rateLimiter.shouldSend(i1, now + 1);
    var result2 = rateLimiter.shouldSend(i2, now + 2);
    var result3 = rateLimiter.shouldSend(i3, now + 3);

    expect(result1.shouldSend).to.be.ok();
    expect(result2.shouldSend).to.be.ok();

    expect(result3.shouldSend).to.not.be.ok();
    expect(result3.error).to.not.be.ok();
    expect(result3.payload).to.be.ok();

    done();
  });

  it('should reset the per minute limit', function (done) {
    var now = new Date().getTime();
    var options = { startTime: now, maxItems: 4, itemsPerMinute: 2 };
    var rateLimiter = new RateLimiter(options);

    var i1 = { a: 1 };
    var i2 = { a: 2 };
    var i3 = { a: 3 };
    var result1 = rateLimiter.shouldSend(i1, now + 1);
    var result2 = rateLimiter.shouldSend(i2, now + 2);
    var result3 = rateLimiter.shouldSend(i3, now + 60000 + 1);

    expect(result1.shouldSend).to.be.ok();
    expect(result2.shouldSend).to.be.ok();

    expect(result3.shouldSend).to.be.ok();
    expect(result3.error).to.not.be.ok();

    done();
  });

  it('should not send and give us a payload when the maxItems limit is reached', function (done) {
    var now = new Date().getTime();
    var options = { startTime: now, maxItems: 3, itemsPerMinute: 2 };
    var rateLimiter = new RateLimiter(options);

    var i1 = { a: 1 };
    var i2 = { a: 2 };
    var i3 = { a: 3 };
    var i4 = { a: 4 };
    var result1 = rateLimiter.shouldSend(i1, now + 1);
    var result2 = rateLimiter.shouldSend(i2, now + 2);
    var result3 = rateLimiter.shouldSend(i3, now + 60000 + 1);
    var result4 = rateLimiter.shouldSend(i4, now + 60000 + 60000 + 1);

    expect(result1.shouldSend).to.be.ok();
    expect(result2.shouldSend).to.be.ok();
    expect(result3.shouldSend).to.be.ok();
    expect(result3.error).to.not.be.ok();

    expect(result4.shouldSend).to.not.be.ok();
    expect(result4.error).to.not.be.ok();
    expect(result4.payload).to.be.ok();
    expect(result4.payload.body.message.extra.maxItems).to.eql(
      options.maxItems,
    );

    done();
  });

  it('should not send and give an error when over maxItems limit', function (done) {
    var now = new Date().getTime();
    var options = { startTime: now, maxItems: 3, itemsPerMinute: 2 };
    var rateLimiter = new RateLimiter(options);

    var i1 = { a: 1 };
    var i2 = { a: 2 };
    var i3 = { a: 3 };
    var i4 = { a: 4 };
    var i5 = { a: 5 };
    var result1 = rateLimiter.shouldSend(i1, now + 1);
    var result2 = rateLimiter.shouldSend(i2, now + 2);
    var result3 = rateLimiter.shouldSend(i3, now + 60000 + 1);
    var result4 = rateLimiter.shouldSend(i4, now + 60000 + 60000 + 1);
    var result5 = rateLimiter.shouldSend(i5, now + 60000 + 60000 + 60000 + 1);

    expect(result1.shouldSend).to.be.ok();
    expect(result2.shouldSend).to.be.ok();

    expect(result3.shouldSend).to.be.ok();
    expect(result3.error).to.not.be.ok();
    expect(result3.payload).to.not.be.ok();

    expect(result4.shouldSend).to.not.be.ok();
    expect(result4.error).to.not.be.ok();
    expect(result4.payload).to.be.ok();

    expect(result5.shouldSend).to.not.be.ok();
    expect(result5.error).to.be.ok();
    expect(result5.payload).to.not.be.ok();

    done();
  });
});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ZTtBQUNmLGVBQWU7QUFDZixlQUFlO0FBQ2YsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjs7QUFFQSxlQUFlO0FBQ2YsZUFBZTtBQUNmLGVBQWU7QUFDZixlQUFlO0FBQ2YsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcm9sbGJhci93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9tZXJnZS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3JhdGVMaW1pdGVyLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvdXRpbGl0eS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3JvbGxiYXIvLi90ZXN0L3JhdGVMaW1pdGVyLnRlc3QuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKHNlbGYsICgpID0+IHtcbnJldHVybiAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxudmFyIGlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iaikge1xuICBpZiAoIW9iaiB8fCB0b1N0ci5jYWxsKG9iaikgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGhhc093bkNvbnN0cnVjdG9yID0gaGFzT3duLmNhbGwob2JqLCAnY29uc3RydWN0b3InKTtcbiAgdmFyIGhhc0lzUHJvdG90eXBlT2YgPVxuICAgIG9iai5jb25zdHJ1Y3RvciAmJlxuICAgIG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgJiZcbiAgICBoYXNPd24uY2FsbChvYmouY29uc3RydWN0b3IucHJvdG90eXBlLCAnaXNQcm90b3R5cGVPZicpO1xuICAvLyBOb3Qgb3duIGNvbnN0cnVjdG9yIHByb3BlcnR5IG11c3QgYmUgT2JqZWN0XG4gIGlmIChvYmouY29uc3RydWN0b3IgJiYgIWhhc093bkNvbnN0cnVjdG9yICYmICFoYXNJc1Byb3RvdHlwZU9mKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gT3duIHByb3BlcnRpZXMgYXJlIGVudW1lcmF0ZWQgZmlyc3RseSwgc28gdG8gc3BlZWQgdXAsXG4gIC8vIGlmIGxhc3Qgb25lIGlzIG93biwgdGhlbiBhbGwgcHJvcGVydGllcyBhcmUgb3duLlxuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAvKiovXG4gIH1cblxuICByZXR1cm4gdHlwZW9mIGtleSA9PT0gJ3VuZGVmaW5lZCcgfHwgaGFzT3duLmNhbGwob2JqLCBrZXkpO1xufTtcblxuZnVuY3Rpb24gbWVyZ2UoKSB7XG4gIHZhciBpLFxuICAgIHNyYyxcbiAgICBjb3B5LFxuICAgIGNsb25lLFxuICAgIG5hbWUsXG4gICAgcmVzdWx0ID0ge30sXG4gICAgY3VycmVudCA9IG51bGwsXG4gICAgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcblxuICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBjdXJyZW50ID0gYXJndW1lbnRzW2ldO1xuICAgIGlmIChjdXJyZW50ID09IG51bGwpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGZvciAobmFtZSBpbiBjdXJyZW50KSB7XG4gICAgICBzcmMgPSByZXN1bHRbbmFtZV07XG4gICAgICBjb3B5ID0gY3VycmVudFtuYW1lXTtcbiAgICAgIGlmIChyZXN1bHQgIT09IGNvcHkpIHtcbiAgICAgICAgaWYgKGNvcHkgJiYgaXNQbGFpbk9iamVjdChjb3B5KSkge1xuICAgICAgICAgIGNsb25lID0gc3JjICYmIGlzUGxhaW5PYmplY3Qoc3JjKSA/IHNyYyA6IHt9O1xuICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IG1lcmdlKGNsb25lLCBjb3B5KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY29weSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZXN1bHRbbmFtZV0gPSBjb3B5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWVyZ2U7XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbGl0eScpO1xuXG4vKlxuICogUmF0ZUxpbWl0ZXIgLSBhbiBvYmplY3QgdGhhdCBlbmNhcHN1bGF0ZXMgdGhlIGxvZ2ljIGZvciBjb3VudGluZyBpdGVtcyBzZW50IHRvIFJvbGxiYXJcbiAqXG4gKiBAcGFyYW0gb3B0aW9ucyAtIHRoZSBzYW1lIG9wdGlvbnMgdGhhdCBhcmUgYWNjZXB0ZWQgYnkgY29uZmlndXJlR2xvYmFsIG9mZmVyZWQgYXMgYSBjb252ZW5pZW5jZVxuICovXG5mdW5jdGlvbiBSYXRlTGltaXRlcihvcHRpb25zKSB7XG4gIHRoaXMuc3RhcnRUaW1lID0gXy5ub3coKTtcbiAgdGhpcy5jb3VudGVyID0gMDtcbiAgdGhpcy5wZXJNaW5Db3VudGVyID0gMDtcbiAgdGhpcy5wbGF0Zm9ybSA9IG51bGw7XG4gIHRoaXMucGxhdGZvcm1PcHRpb25zID0ge307XG4gIHRoaXMuY29uZmlndXJlR2xvYmFsKG9wdGlvbnMpO1xufVxuXG5SYXRlTGltaXRlci5nbG9iYWxTZXR0aW5ncyA9IHtcbiAgc3RhcnRUaW1lOiBfLm5vdygpLFxuICBtYXhJdGVtczogdW5kZWZpbmVkLFxuICBpdGVtc1Blck1pbnV0ZTogdW5kZWZpbmVkLFxufTtcblxuLypcbiAqIGNvbmZpZ3VyZUdsb2JhbCAtIHNldCB0aGUgZ2xvYmFsIHJhdGUgbGltaXRlciBvcHRpb25zXG4gKlxuICogQHBhcmFtIG9wdGlvbnMgLSBPbmx5IHRoZSBmb2xsb3dpbmcgdmFsdWVzIGFyZSByZWNvZ25pemVkOlxuICogICAgc3RhcnRUaW1lOiBhIHRpbWVzdGFtcCBvZiB0aGUgZm9ybSByZXR1cm5lZCBieSAobmV3IERhdGUoKSkuZ2V0VGltZSgpXG4gKiAgICBtYXhJdGVtczogdGhlIG1heGltdW0gaXRlbXNcbiAqICAgIGl0ZW1zUGVyTWludXRlOiB0aGUgbWF4IG51bWJlciBvZiBpdGVtcyB0byBzZW5kIGluIGEgZ2l2ZW4gbWludXRlXG4gKi9cblJhdGVMaW1pdGVyLnByb3RvdHlwZS5jb25maWd1cmVHbG9iYWwgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICBpZiAob3B0aW9ucy5zdGFydFRpbWUgIT09IHVuZGVmaW5lZCkge1xuICAgIFJhdGVMaW1pdGVyLmdsb2JhbFNldHRpbmdzLnN0YXJ0VGltZSA9IG9wdGlvbnMuc3RhcnRUaW1lO1xuICB9XG4gIGlmIChvcHRpb25zLm1heEl0ZW1zICE9PSB1bmRlZmluZWQpIHtcbiAgICBSYXRlTGltaXRlci5nbG9iYWxTZXR0aW5ncy5tYXhJdGVtcyA9IG9wdGlvbnMubWF4SXRlbXM7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaXRlbXNQZXJNaW51dGUgIT09IHVuZGVmaW5lZCkge1xuICAgIFJhdGVMaW1pdGVyLmdsb2JhbFNldHRpbmdzLml0ZW1zUGVyTWludXRlID0gb3B0aW9ucy5pdGVtc1Blck1pbnV0ZTtcbiAgfVxufTtcblxuLypcbiAqIHNob3VsZFNlbmQgLSBkZXRlcm1pbmUgaWYgd2Ugc2hvdWxkIHNlbmQgYSBnaXZlbiBpdGVtIGJhc2VkIG9uIHJhdGUgbGltaXQgc2V0dGluZ3NcbiAqXG4gKiBAcGFyYW0gaXRlbSAtIHRoZSBpdGVtIHdlIGFyZSBhYm91dCB0byBzZW5kXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIHN0cnVjdHVyZTpcbiAqICBlcnJvcjogKEVycm9yfG51bGwpXG4gKiAgc2hvdWxkU2VuZDogYm9vbFxuICogIHBheWxvYWQ6IChPYmplY3R8bnVsbClcbiAqICBJZiBzaG91bGRTZW5kIGlzIGZhbHNlLCB0aGUgaXRlbSBwYXNzZWQgYXMgYSBwYXJhbWV0ZXIgc2hvdWxkIG5vdCBiZSBzZW50IHRvIFJvbGxiYXIsIGFuZFxuICogIGV4YWN0bHkgb25lIG9mIGVycm9yIG9yIHBheWxvYWQgd2lsbCBiZSBub24tbnVsbC4gSWYgZXJyb3IgaXMgbm9uLW51bGwsIHRoZSByZXR1cm5lZCBFcnJvciB3aWxsXG4gKiAgZGVzY3JpYmUgdGhlIHNpdHVhdGlvbiwgYnV0IGl0IG1lYW5zIHRoYXQgd2Ugd2VyZSBhbHJlYWR5IG92ZXIgYSByYXRlIGxpbWl0IChlaXRoZXIgZ2xvYmFsbHkgb3JcbiAqICBwZXIgbWludXRlKSB3aGVuIHRoaXMgaXRlbSB3YXMgY2hlY2tlZC4gSWYgZXJyb3IgaXMgbnVsbCwgYW5kIHRoZXJlZm9yZSBwYXlsb2FkIGlzIG5vbi1udWxsLCBpdFxuICogIG1lYW5zIHRoaXMgaXRlbSBwdXQgdXMgb3ZlciB0aGUgZ2xvYmFsIHJhdGUgbGltaXQgYW5kIHRoZSBwYXlsb2FkIHNob3VsZCBiZSBzZW50IHRvIFJvbGxiYXIgaW5cbiAqICBwbGFjZSBvZiB0aGUgcGFzc2VkIGluIGl0ZW0uXG4gKi9cblJhdGVMaW1pdGVyLnByb3RvdHlwZS5zaG91bGRTZW5kID0gZnVuY3Rpb24gKGl0ZW0sIG5vdykge1xuICBub3cgPSBub3cgfHwgXy5ub3coKTtcbiAgdmFyIGVsYXBzZWRUaW1lID0gbm93IC0gdGhpcy5zdGFydFRpbWU7XG4gIGlmIChlbGFwc2VkVGltZSA8IDAgfHwgZWxhcHNlZFRpbWUgPj0gNjAwMDApIHtcbiAgICB0aGlzLnN0YXJ0VGltZSA9IG5vdztcbiAgICB0aGlzLnBlck1pbkNvdW50ZXIgPSAwO1xuICB9XG5cbiAgdmFyIGdsb2JhbFJhdGVMaW1pdCA9IFJhdGVMaW1pdGVyLmdsb2JhbFNldHRpbmdzLm1heEl0ZW1zO1xuICB2YXIgZ2xvYmFsUmF0ZUxpbWl0UGVyTWluID0gUmF0ZUxpbWl0ZXIuZ2xvYmFsU2V0dGluZ3MuaXRlbXNQZXJNaW51dGU7XG5cbiAgaWYgKGNoZWNrUmF0ZShpdGVtLCBnbG9iYWxSYXRlTGltaXQsIHRoaXMuY291bnRlcikpIHtcbiAgICByZXR1cm4gc2hvdWxkU2VuZFZhbHVlKFxuICAgICAgdGhpcy5wbGF0Zm9ybSxcbiAgICAgIHRoaXMucGxhdGZvcm1PcHRpb25zLFxuICAgICAgZ2xvYmFsUmF0ZUxpbWl0ICsgJyBtYXggaXRlbXMgcmVhY2hlZCcsXG4gICAgICBmYWxzZSxcbiAgICApO1xuICB9IGVsc2UgaWYgKGNoZWNrUmF0ZShpdGVtLCBnbG9iYWxSYXRlTGltaXRQZXJNaW4sIHRoaXMucGVyTWluQ291bnRlcikpIHtcbiAgICByZXR1cm4gc2hvdWxkU2VuZFZhbHVlKFxuICAgICAgdGhpcy5wbGF0Zm9ybSxcbiAgICAgIHRoaXMucGxhdGZvcm1PcHRpb25zLFxuICAgICAgZ2xvYmFsUmF0ZUxpbWl0UGVyTWluICsgJyBpdGVtcyBwZXIgbWludXRlIHJlYWNoZWQnLFxuICAgICAgZmFsc2UsXG4gICAgKTtcbiAgfVxuICB0aGlzLmNvdW50ZXIrKztcbiAgdGhpcy5wZXJNaW5Db3VudGVyKys7XG5cbiAgdmFyIHNob3VsZFNlbmQgPSAhY2hlY2tSYXRlKGl0ZW0sIGdsb2JhbFJhdGVMaW1pdCwgdGhpcy5jb3VudGVyKTtcbiAgdmFyIHBlck1pbnV0ZSA9IHNob3VsZFNlbmQ7XG4gIHNob3VsZFNlbmQgPVxuICAgIHNob3VsZFNlbmQgJiYgIWNoZWNrUmF0ZShpdGVtLCBnbG9iYWxSYXRlTGltaXRQZXJNaW4sIHRoaXMucGVyTWluQ291bnRlcik7XG4gIHJldHVybiBzaG91bGRTZW5kVmFsdWUoXG4gICAgdGhpcy5wbGF0Zm9ybSxcbiAgICB0aGlzLnBsYXRmb3JtT3B0aW9ucyxcbiAgICBudWxsLFxuICAgIHNob3VsZFNlbmQsXG4gICAgZ2xvYmFsUmF0ZUxpbWl0LFxuICAgIGdsb2JhbFJhdGVMaW1pdFBlck1pbixcbiAgICBwZXJNaW51dGUsXG4gICk7XG59O1xuXG5SYXRlTGltaXRlci5wcm90b3R5cGUuc2V0UGxhdGZvcm1PcHRpb25zID0gZnVuY3Rpb24gKHBsYXRmb3JtLCBvcHRpb25zKSB7XG4gIHRoaXMucGxhdGZvcm0gPSBwbGF0Zm9ybTtcbiAgdGhpcy5wbGF0Zm9ybU9wdGlvbnMgPSBvcHRpb25zO1xufTtcblxuLyogSGVscGVycyAqL1xuXG5mdW5jdGlvbiBjaGVja1JhdGUoaXRlbSwgbGltaXQsIGNvdW50ZXIpIHtcbiAgcmV0dXJuICFpdGVtLmlnbm9yZVJhdGVMaW1pdCAmJiBsaW1pdCA+PSAxICYmIGNvdW50ZXIgPiBsaW1pdDtcbn1cblxuZnVuY3Rpb24gc2hvdWxkU2VuZFZhbHVlKFxuICBwbGF0Zm9ybSxcbiAgb3B0aW9ucyxcbiAgZXJyb3IsXG4gIHNob3VsZFNlbmQsXG4gIGdsb2JhbFJhdGVMaW1pdCxcbiAgbGltaXRQZXJNaW4sXG4gIHBlck1pbnV0ZSxcbikge1xuICB2YXIgcGF5bG9hZCA9IG51bGw7XG4gIGlmIChlcnJvcikge1xuICAgIGVycm9yID0gbmV3IEVycm9yKGVycm9yKTtcbiAgfVxuICBpZiAoIWVycm9yICYmICFzaG91bGRTZW5kKSB7XG4gICAgcGF5bG9hZCA9IHJhdGVMaW1pdFBheWxvYWQoXG4gICAgICBwbGF0Zm9ybSxcbiAgICAgIG9wdGlvbnMsXG4gICAgICBnbG9iYWxSYXRlTGltaXQsXG4gICAgICBsaW1pdFBlck1pbixcbiAgICAgIHBlck1pbnV0ZSxcbiAgICApO1xuICB9XG4gIHJldHVybiB7IGVycm9yOiBlcnJvciwgc2hvdWxkU2VuZDogc2hvdWxkU2VuZCwgcGF5bG9hZDogcGF5bG9hZCB9O1xufVxuXG5mdW5jdGlvbiByYXRlTGltaXRQYXlsb2FkKFxuICBwbGF0Zm9ybSxcbiAgb3B0aW9ucyxcbiAgZ2xvYmFsUmF0ZUxpbWl0LFxuICBsaW1pdFBlck1pbixcbiAgcGVyTWludXRlLFxuKSB7XG4gIHZhciBlbnZpcm9ubWVudCA9XG4gICAgb3B0aW9ucy5lbnZpcm9ubWVudCB8fCAob3B0aW9ucy5wYXlsb2FkICYmIG9wdGlvbnMucGF5bG9hZC5lbnZpcm9ubWVudCk7XG4gIHZhciBtc2c7XG4gIGlmIChwZXJNaW51dGUpIHtcbiAgICBtc2cgPSAnaXRlbSBwZXIgbWludXRlIGxpbWl0IHJlYWNoZWQsIGlnbm9yaW5nIGVycm9ycyB1bnRpbCB0aW1lb3V0JztcbiAgfSBlbHNlIHtcbiAgICBtc2cgPSAnbWF4SXRlbXMgaGFzIGJlZW4gaGl0LCBpZ25vcmluZyBlcnJvcnMgdW50aWwgcmVzZXQuJztcbiAgfVxuICB2YXIgaXRlbSA9IHtcbiAgICBib2R5OiB7XG4gICAgICBtZXNzYWdlOiB7XG4gICAgICAgIGJvZHk6IG1zZyxcbiAgICAgICAgZXh0cmE6IHtcbiAgICAgICAgICBtYXhJdGVtczogZ2xvYmFsUmF0ZUxpbWl0LFxuICAgICAgICAgIGl0ZW1zUGVyTWludXRlOiBsaW1pdFBlck1pbixcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBsYW5ndWFnZTogJ2phdmFzY3JpcHQnLFxuICAgIGVudmlyb25tZW50OiBlbnZpcm9ubWVudCxcbiAgICBub3RpZmllcjoge1xuICAgICAgdmVyc2lvbjpcbiAgICAgICAgKG9wdGlvbnMubm90aWZpZXIgJiYgb3B0aW9ucy5ub3RpZmllci52ZXJzaW9uKSB8fCBvcHRpb25zLnZlcnNpb24sXG4gICAgfSxcbiAgfTtcbiAgaWYgKHBsYXRmb3JtID09PSAnYnJvd3NlcicpIHtcbiAgICBpdGVtLnBsYXRmb3JtID0gJ2Jyb3dzZXInO1xuICAgIGl0ZW0uZnJhbWV3b3JrID0gJ2Jyb3dzZXItanMnO1xuICAgIGl0ZW0ubm90aWZpZXIubmFtZSA9ICdyb2xsYmFyLWJyb3dzZXItanMnO1xuICB9IGVsc2UgaWYgKHBsYXRmb3JtID09PSAnc2VydmVyJykge1xuICAgIGl0ZW0uZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmsgfHwgJ25vZGUtanMnO1xuICAgIGl0ZW0ubm90aWZpZXIubmFtZSA9IG9wdGlvbnMubm90aWZpZXIubmFtZTtcbiAgfSBlbHNlIGlmIChwbGF0Zm9ybSA9PT0gJ3JlYWN0LW5hdGl2ZScpIHtcbiAgICBpdGVtLmZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrIHx8ICdyZWFjdC1uYXRpdmUnO1xuICAgIGl0ZW0ubm90aWZpZXIubmFtZSA9IG9wdGlvbnMubm90aWZpZXIubmFtZTtcbiAgfVxuICByZXR1cm4gaXRlbTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSYXRlTGltaXRlcjtcbiIsInZhciBtZXJnZSA9IHJlcXVpcmUoJy4vbWVyZ2UnKTtcblxudmFyIFJvbGxiYXJKU09OID0ge307XG5mdW5jdGlvbiBzZXR1cEpTT04ocG9seWZpbGxKU09OKSB7XG4gIGlmIChpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnN0cmluZ2lmeSkgJiYgaXNGdW5jdGlvbihSb2xsYmFySlNPTi5wYXJzZSkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoaXNEZWZpbmVkKEpTT04pKSB7XG4gICAgLy8gSWYgcG9seWZpbGwgaXMgcHJvdmlkZWQsIHByZWZlciBpdCBvdmVyIGV4aXN0aW5nIG5vbi1uYXRpdmUgc2hpbXMuXG4gICAgaWYgKHBvbHlmaWxsSlNPTikge1xuICAgICAgaWYgKGlzTmF0aXZlRnVuY3Rpb24oSlNPTi5zdHJpbmdpZnkpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnN0cmluZ2lmeSA9IEpTT04uc3RyaW5naWZ5O1xuICAgICAgfVxuICAgICAgaWYgKGlzTmF0aXZlRnVuY3Rpb24oSlNPTi5wYXJzZSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04ucGFyc2UgPSBKU09OLnBhcnNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBlbHNlIGFjY2VwdCBhbnkgaW50ZXJmYWNlIHRoYXQgaXMgcHJlc2VudC5cbiAgICAgIGlmIChpc0Z1bmN0aW9uKEpTT04uc3RyaW5naWZ5KSkge1xuICAgICAgICBSb2xsYmFySlNPTi5zdHJpbmdpZnkgPSBKU09OLnN0cmluZ2lmeTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0Z1bmN0aW9uKEpTT04ucGFyc2UpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnBhcnNlID0gSlNPTi5wYXJzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKCFpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnN0cmluZ2lmeSkgfHwgIWlzRnVuY3Rpb24oUm9sbGJhckpTT04ucGFyc2UpKSB7XG4gICAgcG9seWZpbGxKU09OICYmIHBvbHlmaWxsSlNPTihSb2xsYmFySlNPTik7XG4gIH1cbn1cblxuLypcbiAqIGlzVHlwZSAtIEdpdmVuIGEgSmF2YXNjcmlwdCB2YWx1ZSBhbmQgYSBzdHJpbmcsIHJldHVybnMgdHJ1ZSBpZiB0aGUgdHlwZSBvZiB0aGUgdmFsdWUgbWF0Y2hlcyB0aGVcbiAqIGdpdmVuIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0geCAtIGFueSB2YWx1ZVxuICogQHBhcmFtIHQgLSBhIGxvd2VyY2FzZSBzdHJpbmcgY29udGFpbmluZyBvbmUgb2YgdGhlIGZvbGxvd2luZyB0eXBlIG5hbWVzOlxuICogICAgLSB1bmRlZmluZWRcbiAqICAgIC0gbnVsbFxuICogICAgLSBlcnJvclxuICogICAgLSBudW1iZXJcbiAqICAgIC0gYm9vbGVhblxuICogICAgLSBzdHJpbmdcbiAqICAgIC0gc3ltYm9sXG4gKiAgICAtIGZ1bmN0aW9uXG4gKiAgICAtIG9iamVjdFxuICogICAgLSBhcnJheVxuICogQHJldHVybnMgdHJ1ZSBpZiB4IGlzIG9mIHR5cGUgdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVHlwZSh4LCB0KSB7XG4gIHJldHVybiB0ID09PSB0eXBlTmFtZSh4KTtcbn1cblxuLypcbiAqIHR5cGVOYW1lIC0gR2l2ZW4gYSBKYXZhc2NyaXB0IHZhbHVlLCByZXR1cm5zIHRoZSB0eXBlIG9mIHRoZSBvYmplY3QgYXMgYSBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gdHlwZU5hbWUoeCkge1xuICB2YXIgbmFtZSA9IHR5cGVvZiB4O1xuICBpZiAobmFtZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbmFtZTtcbiAgfVxuICBpZiAoIXgpIHtcbiAgICByZXR1cm4gJ251bGwnO1xuICB9XG4gIGlmICh4IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICByZXR1cm4gJ2Vycm9yJztcbiAgfVxuICByZXR1cm4ge30udG9TdHJpbmdcbiAgICAuY2FsbCh4KVxuICAgIC5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXVxuICAgIC50b0xvd2VyQ2FzZSgpO1xufVxuXG4vKiBpc0Z1bmN0aW9uIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBhIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIGYgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIGZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbihmKSB7XG4gIHJldHVybiBpc1R5cGUoZiwgJ2Z1bmN0aW9uJyk7XG59XG5cbi8qIGlzTmF0aXZlRnVuY3Rpb24gLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIGEgbmF0aXZlIEpTIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIGYgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIG5hdGl2ZSBKUyBmdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlRnVuY3Rpb24oZikge1xuICB2YXIgcmVSZWdFeHBDaGFyID0gL1tcXFxcXiQuKis/KClbXFxde318XS9nO1xuICB2YXIgZnVuY01hdGNoU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nXG4gICAgLmNhbGwoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSlcbiAgICAucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAgIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKTtcbiAgdmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICsgZnVuY01hdGNoU3RyaW5nICsgJyQnKTtcbiAgcmV0dXJuIGlzT2JqZWN0KGYpICYmIHJlSXNOYXRpdmUudGVzdChmKTtcbn1cblxuLyogaXNPYmplY3QgLSBDaGVja3MgaWYgdGhlIGFyZ3VtZW50IGlzIGFuIG9iamVjdFxuICpcbiAqIEBwYXJhbSB2YWx1ZSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpcyB2YWx1ZSBpcyBhbiBvYmplY3QgZnVuY3Rpb24gaXMgYW4gb2JqZWN0KVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyogaXNTdHJpbmcgLSBDaGVja3MgaWYgdGhlIGFyZ3VtZW50IGlzIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHZhbHVlIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIHZhbHVlIGlzIGEgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nO1xufVxuXG4vKipcbiAqIGlzRmluaXRlTnVtYmVyIC0gZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgYSBmaW5pdGUgbnVtYmVyXG4gKlxuICogQHBhcmFtIHsqfSBuIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIHZhbHVlIGlzIGEgZmluaXRlIG51bWJlclxuICovXG5mdW5jdGlvbiBpc0Zpbml0ZU51bWJlcihuKSB7XG4gIHJldHVybiBOdW1iZXIuaXNGaW5pdGUobik7XG59XG5cbi8qXG4gKiBpc0RlZmluZWQgLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIG5vdCBlcXVhbCB0byB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0gdSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiB1IGlzIGFueXRoaW5nIG90aGVyIHRoYW4gdW5kZWZpbmVkXG4gKi9cbmZ1bmN0aW9uIGlzRGVmaW5lZCh1KSB7XG4gIHJldHVybiAhaXNUeXBlKHUsICd1bmRlZmluZWQnKTtcbn1cblxuLypcbiAqIGlzSXRlcmFibGUgLSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBjYW4gYmUgaXRlcmF0ZWQsIGVzc2VudGlhbGx5XG4gKiB3aGV0aGVyIGl0IGlzIGFuIG9iamVjdCBvciBhbiBhcnJheS5cbiAqXG4gKiBAcGFyYW0gaSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBpIGlzIGFuIG9iamVjdCBvciBhbiBhcnJheSBhcyBkZXRlcm1pbmVkIGJ5IGB0eXBlTmFtZWBcbiAqL1xuZnVuY3Rpb24gaXNJdGVyYWJsZShpKSB7XG4gIHZhciB0eXBlID0gdHlwZU5hbWUoaSk7XG4gIHJldHVybiB0eXBlID09PSAnb2JqZWN0JyB8fCB0eXBlID09PSAnYXJyYXknO1xufVxuXG4vKlxuICogaXNFcnJvciAtIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIG9mIGFuIGVycm9yIHR5cGVcbiAqXG4gKiBAcGFyYW0gZSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBlIGlzIGFuIGVycm9yXG4gKi9cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICAvLyBEZXRlY3QgYm90aCBFcnJvciBhbmQgRmlyZWZveCBFeGNlcHRpb24gdHlwZVxuICByZXR1cm4gaXNUeXBlKGUsICdlcnJvcicpIHx8IGlzVHlwZShlLCAnZXhjZXB0aW9uJyk7XG59XG5cbi8qIGlzUHJvbWlzZSAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgYSBwcm9taXNlXG4gKlxuICogQHBhcmFtIHAgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIGZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNQcm9taXNlKHApIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHApICYmIGlzVHlwZShwLnRoZW4sICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIGlzQnJvd3NlciAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIHRoZSBjb2RlIGlzIHJ1bm5pbmcgaW4gYSBicm93c2VyXG4gKlxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY29kZSBpcyBydW5uaW5nIGluIGEgYnJvd3NlciBlbnZpcm9ubWVudFxuICovXG5mdW5jdGlvbiBpc0Jyb3dzZXIoKSB7XG4gIHJldHVybiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcbn1cblxuZnVuY3Rpb24gcmVkYWN0KCkge1xuICByZXR1cm4gJyoqKioqKioqJztcbn1cblxuLy8gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS84ODA5NDcyLzExMzgxOTFcbmZ1bmN0aW9uIHV1aWQ0KCkge1xuICB2YXIgZCA9IG5vdygpO1xuICB2YXIgdXVpZCA9ICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoXG4gICAgL1t4eV0vZyxcbiAgICBmdW5jdGlvbiAoYykge1xuICAgICAgdmFyIHIgPSAoZCArIE1hdGgucmFuZG9tKCkgKiAxNikgJSAxNiB8IDA7XG4gICAgICBkID0gTWF0aC5mbG9vcihkIC8gMTYpO1xuICAgICAgcmV0dXJuIChjID09PSAneCcgPyByIDogKHIgJiAweDcpIHwgMHg4KS50b1N0cmluZygxNik7XG4gICAgfSxcbiAgKTtcbiAgcmV0dXJuIHV1aWQ7XG59XG5cbnZhciBMRVZFTFMgPSB7XG4gIGRlYnVnOiAwLFxuICBpbmZvOiAxLFxuICB3YXJuaW5nOiAyLFxuICBlcnJvcjogMyxcbiAgY3JpdGljYWw6IDQsXG59O1xuXG5mdW5jdGlvbiBzYW5pdGl6ZVVybCh1cmwpIHtcbiAgdmFyIGJhc2VVcmxQYXJ0cyA9IHBhcnNlVXJpKHVybCk7XG4gIGlmICghYmFzZVVybFBhcnRzKSB7XG4gICAgcmV0dXJuICcodW5rbm93biknO1xuICB9XG5cbiAgLy8gcmVtb3ZlIGEgdHJhaWxpbmcgIyBpZiB0aGVyZSBpcyBubyBhbmNob3JcbiAgaWYgKGJhc2VVcmxQYXJ0cy5hbmNob3IgPT09ICcnKSB7XG4gICAgYmFzZVVybFBhcnRzLnNvdXJjZSA9IGJhc2VVcmxQYXJ0cy5zb3VyY2UucmVwbGFjZSgnIycsICcnKTtcbiAgfVxuXG4gIHVybCA9IGJhc2VVcmxQYXJ0cy5zb3VyY2UucmVwbGFjZSgnPycgKyBiYXNlVXJsUGFydHMucXVlcnksICcnKTtcbiAgcmV0dXJuIHVybDtcbn1cblxudmFyIHBhcnNlVXJpT3B0aW9ucyA9IHtcbiAgc3RyaWN0TW9kZTogZmFsc2UsXG4gIGtleTogW1xuICAgICdzb3VyY2UnLFxuICAgICdwcm90b2NvbCcsXG4gICAgJ2F1dGhvcml0eScsXG4gICAgJ3VzZXJJbmZvJyxcbiAgICAndXNlcicsXG4gICAgJ3Bhc3N3b3JkJyxcbiAgICAnaG9zdCcsXG4gICAgJ3BvcnQnLFxuICAgICdyZWxhdGl2ZScsXG4gICAgJ3BhdGgnLFxuICAgICdkaXJlY3RvcnknLFxuICAgICdmaWxlJyxcbiAgICAncXVlcnknLFxuICAgICdhbmNob3InLFxuICBdLFxuICBxOiB7XG4gICAgbmFtZTogJ3F1ZXJ5S2V5JyxcbiAgICBwYXJzZXI6IC8oPzpefCYpKFteJj1dKik9PyhbXiZdKikvZyxcbiAgfSxcbiAgcGFyc2VyOiB7XG4gICAgc3RyaWN0OlxuICAgICAgL14oPzooW146XFwvPyNdKyk6KT8oPzpcXC9cXC8oKD86KChbXjpAXSopKD86OihbXjpAXSopKT8pP0ApPyhbXjpcXC8/I10qKSg/OjooXFxkKikpPykpPygoKCg/OltePyNcXC9dKlxcLykqKShbXj8jXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pLyxcbiAgICBsb29zZTpcbiAgICAgIC9eKD86KD8hW146QF0rOlteOkBcXC9dKkApKFteOlxcLz8jLl0rKTopPyg/OlxcL1xcLyk/KCg/OigoW146QF0qKSg/OjooW146QF0qKSk/KT9AKT8oW146XFwvPyNdKikoPzo6KFxcZCopKT8pKCgoXFwvKD86W14/I10oPyFbXj8jXFwvXSpcXC5bXj8jXFwvLl0rKD86Wz8jXXwkKSkpKlxcLz8pPyhbXj8jXFwvXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pLyxcbiAgfSxcbn07XG5cbmZ1bmN0aW9uIHBhcnNlVXJpKHN0cikge1xuICBpZiAoIWlzVHlwZShzdHIsICdzdHJpbmcnKSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICB2YXIgbyA9IHBhcnNlVXJpT3B0aW9ucztcbiAgdmFyIG0gPSBvLnBhcnNlcltvLnN0cmljdE1vZGUgPyAnc3RyaWN0JyA6ICdsb29zZSddLmV4ZWMoc3RyKTtcbiAgdmFyIHVyaSA9IHt9O1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gby5rZXkubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgdXJpW28ua2V5W2ldXSA9IG1baV0gfHwgJyc7XG4gIH1cblxuICB1cmlbby5xLm5hbWVdID0ge307XG4gIHVyaVtvLmtleVsxMl1dLnJlcGxhY2Uoby5xLnBhcnNlciwgZnVuY3Rpb24gKCQwLCAkMSwgJDIpIHtcbiAgICBpZiAoJDEpIHtcbiAgICAgIHVyaVtvLnEubmFtZV1bJDFdID0gJDI7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdXJpO1xufVxuXG5mdW5jdGlvbiBhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aChhY2Nlc3NUb2tlbiwgb3B0aW9ucywgcGFyYW1zKSB7XG4gIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgcGFyYW1zLmFjY2Vzc190b2tlbiA9IGFjY2Vzc1Rva2VuO1xuICB2YXIgcGFyYW1zQXJyYXkgPSBbXTtcbiAgdmFyIGs7XG4gIGZvciAoayBpbiBwYXJhbXMpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmFtcywgaykpIHtcbiAgICAgIHBhcmFtc0FycmF5LnB1c2goW2ssIHBhcmFtc1trXV0uam9pbignPScpKTtcbiAgICB9XG4gIH1cbiAgdmFyIHF1ZXJ5ID0gJz8nICsgcGFyYW1zQXJyYXkuc29ydCgpLmpvaW4oJyYnKTtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgb3B0aW9ucy5wYXRoID0gb3B0aW9ucy5wYXRoIHx8ICcnO1xuICB2YXIgcXMgPSBvcHRpb25zLnBhdGguaW5kZXhPZignPycpO1xuICB2YXIgaCA9IG9wdGlvbnMucGF0aC5pbmRleE9mKCcjJyk7XG4gIHZhciBwO1xuICBpZiAocXMgIT09IC0xICYmIChoID09PSAtMSB8fCBoID4gcXMpKSB7XG4gICAgcCA9IG9wdGlvbnMucGF0aDtcbiAgICBvcHRpb25zLnBhdGggPSBwLnN1YnN0cmluZygwLCBxcykgKyBxdWVyeSArICcmJyArIHAuc3Vic3RyaW5nKHFzICsgMSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGggIT09IC0xKSB7XG4gICAgICBwID0gb3B0aW9ucy5wYXRoO1xuICAgICAgb3B0aW9ucy5wYXRoID0gcC5zdWJzdHJpbmcoMCwgaCkgKyBxdWVyeSArIHAuc3Vic3RyaW5nKGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zLnBhdGggPSBvcHRpb25zLnBhdGggKyBxdWVyeTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0VXJsKHUsIHByb3RvY29sKSB7XG4gIHByb3RvY29sID0gcHJvdG9jb2wgfHwgdS5wcm90b2NvbDtcbiAgaWYgKCFwcm90b2NvbCAmJiB1LnBvcnQpIHtcbiAgICBpZiAodS5wb3J0ID09PSA4MCkge1xuICAgICAgcHJvdG9jb2wgPSAnaHR0cDonO1xuICAgIH0gZWxzZSBpZiAodS5wb3J0ID09PSA0NDMpIHtcbiAgICAgIHByb3RvY29sID0gJ2h0dHBzOic7XG4gICAgfVxuICB9XG4gIHByb3RvY29sID0gcHJvdG9jb2wgfHwgJ2h0dHBzOic7XG5cbiAgaWYgKCF1Lmhvc3RuYW1lKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IHByb3RvY29sICsgJy8vJyArIHUuaG9zdG5hbWU7XG4gIGlmICh1LnBvcnQpIHtcbiAgICByZXN1bHQgPSByZXN1bHQgKyAnOicgKyB1LnBvcnQ7XG4gIH1cbiAgaWYgKHUucGF0aCkge1xuICAgIHJlc3VsdCA9IHJlc3VsdCArIHUucGF0aDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnkob2JqLCBiYWNrdXApIHtcbiAgdmFyIHZhbHVlLCBlcnJvcjtcbiAgdHJ5IHtcbiAgICB2YWx1ZSA9IFJvbGxiYXJKU09OLnN0cmluZ2lmeShvYmopO1xuICB9IGNhdGNoIChqc29uRXJyb3IpIHtcbiAgICBpZiAoYmFja3VwICYmIGlzRnVuY3Rpb24oYmFja3VwKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBiYWNrdXAob2JqKTtcbiAgICAgIH0gY2F0Y2ggKGJhY2t1cEVycm9yKSB7XG4gICAgICAgIGVycm9yID0gYmFja3VwRXJyb3I7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVycm9yID0ganNvbkVycm9yO1xuICAgIH1cbiAgfVxuICByZXR1cm4geyBlcnJvcjogZXJyb3IsIHZhbHVlOiB2YWx1ZSB9O1xufVxuXG5mdW5jdGlvbiBtYXhCeXRlU2l6ZShzdHJpbmcpIHtcbiAgLy8gVGhlIHRyYW5zcG9ydCB3aWxsIHVzZSB1dGYtOCwgc28gYXNzdW1lIHV0Zi04IGVuY29kaW5nLlxuICAvL1xuICAvLyBUaGlzIG1pbmltYWwgaW1wbGVtZW50YXRpb24gd2lsbCBhY2N1cmF0ZWx5IGNvdW50IGJ5dGVzIGZvciBhbGwgVUNTLTIgYW5kXG4gIC8vIHNpbmdsZSBjb2RlIHBvaW50IFVURi0xNi4gSWYgcHJlc2VudGVkIHdpdGggbXVsdGkgY29kZSBwb2ludCBVVEYtMTYsXG4gIC8vIHdoaWNoIHNob3VsZCBiZSByYXJlLCBpdCB3aWxsIHNhZmVseSBvdmVyY291bnQsIG5vdCB1bmRlcmNvdW50LlxuICAvL1xuICAvLyBXaGlsZSByb2J1c3QgdXRmLTggZW5jb2RlcnMgZXhpc3QsIHRoaXMgaXMgZmFyIHNtYWxsZXIgYW5kIGZhciBtb3JlIHBlcmZvcm1hbnQuXG4gIC8vIEZvciBxdWlja2x5IGNvdW50aW5nIHBheWxvYWQgc2l6ZSBmb3IgdHJ1bmNhdGlvbiwgc21hbGxlciBpcyBiZXR0ZXIuXG5cbiAgdmFyIGNvdW50ID0gMDtcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBjb2RlID0gc3RyaW5nLmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGNvZGUgPCAxMjgpIHtcbiAgICAgIC8vIHVwIHRvIDcgYml0c1xuICAgICAgY291bnQgPSBjb3VudCArIDE7XG4gICAgfSBlbHNlIGlmIChjb2RlIDwgMjA0OCkge1xuICAgICAgLy8gdXAgdG8gMTEgYml0c1xuICAgICAgY291bnQgPSBjb3VudCArIDI7XG4gICAgfSBlbHNlIGlmIChjb2RlIDwgNjU1MzYpIHtcbiAgICAgIC8vIHVwIHRvIDE2IGJpdHNcbiAgICAgIGNvdW50ID0gY291bnQgKyAzO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb3VudDtcbn1cblxuZnVuY3Rpb24ganNvblBhcnNlKHMpIHtcbiAgdmFyIHZhbHVlLCBlcnJvcjtcbiAgdHJ5IHtcbiAgICB2YWx1ZSA9IFJvbGxiYXJKU09OLnBhcnNlKHMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgZXJyb3IgPSBlO1xuICB9XG4gIHJldHVybiB7IGVycm9yOiBlcnJvciwgdmFsdWU6IHZhbHVlIH07XG59XG5cbmZ1bmN0aW9uIG1ha2VVbmhhbmRsZWRTdGFja0luZm8oXG4gIG1lc3NhZ2UsXG4gIHVybCxcbiAgbGluZW5vLFxuICBjb2xubyxcbiAgZXJyb3IsXG4gIG1vZGUsXG4gIGJhY2t1cE1lc3NhZ2UsXG4gIGVycm9yUGFyc2VyLFxuKSB7XG4gIHZhciBsb2NhdGlvbiA9IHtcbiAgICB1cmw6IHVybCB8fCAnJyxcbiAgICBsaW5lOiBsaW5lbm8sXG4gICAgY29sdW1uOiBjb2xubyxcbiAgfTtcbiAgbG9jYXRpb24uZnVuYyA9IGVycm9yUGFyc2VyLmd1ZXNzRnVuY3Rpb25OYW1lKGxvY2F0aW9uLnVybCwgbG9jYXRpb24ubGluZSk7XG4gIGxvY2F0aW9uLmNvbnRleHQgPSBlcnJvclBhcnNlci5nYXRoZXJDb250ZXh0KGxvY2F0aW9uLnVybCwgbG9jYXRpb24ubGluZSk7XG4gIHZhciBocmVmID1cbiAgICB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmXG4gICAgZG9jdW1lbnQgJiZcbiAgICBkb2N1bWVudC5sb2NhdGlvbiAmJlxuICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWY7XG4gIHZhciB1c2VyYWdlbnQgPVxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgd2luZG93ICYmXG4gICAgd2luZG93Lm5hdmlnYXRvciAmJlxuICAgIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICByZXR1cm4ge1xuICAgIG1vZGU6IG1vZGUsXG4gICAgbWVzc2FnZTogZXJyb3IgPyBTdHJpbmcoZXJyb3IpIDogbWVzc2FnZSB8fCBiYWNrdXBNZXNzYWdlLFxuICAgIHVybDogaHJlZixcbiAgICBzdGFjazogW2xvY2F0aW9uXSxcbiAgICB1c2VyYWdlbnQ6IHVzZXJhZ2VudCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gd3JhcENhbGxiYWNrKGxvZ2dlciwgZikge1xuICByZXR1cm4gZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgIHRyeSB7XG4gICAgICBmKGVyciwgcmVzcCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbG9nZ2VyLmVycm9yKGUpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gbm9uQ2lyY3VsYXJDbG9uZShvYmopIHtcbiAgdmFyIHNlZW4gPSBbb2JqXTtcblxuICBmdW5jdGlvbiBjbG9uZShvYmosIHNlZW4pIHtcbiAgICB2YXIgdmFsdWUsXG4gICAgICBuYW1lLFxuICAgICAgbmV3U2VlbixcbiAgICAgIHJlc3VsdCA9IHt9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAobmFtZSBpbiBvYmopIHtcbiAgICAgICAgdmFsdWUgPSBvYmpbbmFtZV07XG5cbiAgICAgICAgaWYgKHZhbHVlICYmIChpc1R5cGUodmFsdWUsICdvYmplY3QnKSB8fCBpc1R5cGUodmFsdWUsICdhcnJheScpKSkge1xuICAgICAgICAgIGlmIChzZWVuLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgICAgICAgcmVzdWx0W25hbWVdID0gJ1JlbW92ZWQgY2lyY3VsYXIgcmVmZXJlbmNlOiAnICsgdHlwZU5hbWUodmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdTZWVuID0gc2Vlbi5zbGljZSgpO1xuICAgICAgICAgICAgbmV3U2Vlbi5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IGNsb25lKHZhbHVlLCBuZXdTZWVuKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHRbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXN1bHQgPSAnRmFpbGVkIGNsb25pbmcgY3VzdG9tIGRhdGE6ICcgKyBlLm1lc3NhZ2U7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGNsb25lKG9iaiwgc2Vlbik7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUl0ZW0oYXJncywgbG9nZ2VyLCBub3RpZmllciwgcmVxdWVzdEtleXMsIGxhbWJkYUNvbnRleHQpIHtcbiAgdmFyIG1lc3NhZ2UsIGVyciwgY3VzdG9tLCBjYWxsYmFjaywgcmVxdWVzdDtcbiAgdmFyIGFyZztcbiAgdmFyIGV4dHJhQXJncyA9IFtdO1xuICB2YXIgZGlhZ25vc3RpYyA9IHt9O1xuICB2YXIgYXJnVHlwZXMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3MubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcblxuICAgIHZhciB0eXAgPSB0eXBlTmFtZShhcmcpO1xuICAgIGFyZ1R5cGVzLnB1c2godHlwKTtcbiAgICBzd2l0Y2ggKHR5cCkge1xuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBtZXNzYWdlID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChtZXNzYWdlID0gYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgIGNhbGxiYWNrID0gd3JhcENhbGxiYWNrKGxvZ2dlciwgYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgZXh0cmFBcmdzLnB1c2goYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdlcnJvcic6XG4gICAgICBjYXNlICdkb21leGNlcHRpb24nOlxuICAgICAgY2FzZSAnZXhjZXB0aW9uJzogLy8gRmlyZWZveCBFeGNlcHRpb24gdHlwZVxuICAgICAgICBlcnIgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGVyciA9IGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGFyZyBpbnN0YW5jZW9mIEVycm9yIHx8XG4gICAgICAgICAgKHR5cGVvZiBET01FeGNlcHRpb24gIT09ICd1bmRlZmluZWQnICYmIGFyZyBpbnN0YW5jZW9mIERPTUV4Y2VwdGlvbilcbiAgICAgICAgKSB7XG4gICAgICAgICAgZXJyID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChlcnIgPSBhcmcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXF1ZXN0S2V5cyAmJiB0eXAgPT09ICdvYmplY3QnICYmICFyZXF1ZXN0KSB7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbiA9IHJlcXVlc3RLZXlzLmxlbmd0aDsgaiA8IGxlbjsgKytqKSB7XG4gICAgICAgICAgICBpZiAoYXJnW3JlcXVlc3RLZXlzW2pdXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHJlcXVlc3QgPSBhcmc7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVxdWVzdCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGN1c3RvbSA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoY3VzdG9tID0gYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoXG4gICAgICAgICAgYXJnIGluc3RhbmNlb2YgRXJyb3IgfHxcbiAgICAgICAgICAodHlwZW9mIERPTUV4Y2VwdGlvbiAhPT0gJ3VuZGVmaW5lZCcgJiYgYXJnIGluc3RhbmNlb2YgRE9NRXhjZXB0aW9uKVxuICAgICAgICApIHtcbiAgICAgICAgICBlcnIgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGVyciA9IGFyZyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZXh0cmFBcmdzLnB1c2goYXJnKTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiBjdXN0b20gaXMgYW4gYXJyYXkgdGhpcyB0dXJucyBpdCBpbnRvIGFuIG9iamVjdCB3aXRoIGludGVnZXIga2V5c1xuICBpZiAoY3VzdG9tKSBjdXN0b20gPSBub25DaXJjdWxhckNsb25lKGN1c3RvbSk7XG5cbiAgaWYgKGV4dHJhQXJncy5sZW5ndGggPiAwKSB7XG4gICAgaWYgKCFjdXN0b20pIGN1c3RvbSA9IG5vbkNpcmN1bGFyQ2xvbmUoe30pO1xuICAgIGN1c3RvbS5leHRyYUFyZ3MgPSBub25DaXJjdWxhckNsb25lKGV4dHJhQXJncyk7XG4gIH1cblxuICB2YXIgaXRlbSA9IHtcbiAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgIGVycjogZXJyLFxuICAgIGN1c3RvbTogY3VzdG9tLFxuICAgIHRpbWVzdGFtcDogbm93KCksXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgIG5vdGlmaWVyOiBub3RpZmllcixcbiAgICBkaWFnbm9zdGljOiBkaWFnbm9zdGljLFxuICAgIHV1aWQ6IHV1aWQ0KCksXG4gIH07XG5cbiAgaXRlbS5kYXRhID0gaXRlbS5kYXRhIHx8IHt9O1xuXG4gIHNldEN1c3RvbUl0ZW1LZXlzKGl0ZW0sIGN1c3RvbSk7XG5cbiAgaWYgKHJlcXVlc3RLZXlzICYmIHJlcXVlc3QpIHtcbiAgICBpdGVtLnJlcXVlc3QgPSByZXF1ZXN0O1xuICB9XG4gIGlmIChsYW1iZGFDb250ZXh0KSB7XG4gICAgaXRlbS5sYW1iZGFDb250ZXh0ID0gbGFtYmRhQ29udGV4dDtcbiAgfVxuICBpdGVtLl9vcmlnaW5hbEFyZ3MgPSBhcmdzO1xuICBpdGVtLmRpYWdub3N0aWMub3JpZ2luYWxfYXJnX3R5cGVzID0gYXJnVHlwZXM7XG4gIHJldHVybiBpdGVtO1xufVxuXG5mdW5jdGlvbiBzZXRDdXN0b21JdGVtS2V5cyhpdGVtLCBjdXN0b20pIHtcbiAgaWYgKGN1c3RvbSAmJiBjdXN0b20ubGV2ZWwgIT09IHVuZGVmaW5lZCkge1xuICAgIGl0ZW0ubGV2ZWwgPSBjdXN0b20ubGV2ZWw7XG4gICAgZGVsZXRlIGN1c3RvbS5sZXZlbDtcbiAgfVxuICBpZiAoY3VzdG9tICYmIGN1c3RvbS5za2lwRnJhbWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICBpdGVtLnNraXBGcmFtZXMgPSBjdXN0b20uc2tpcEZyYW1lcztcbiAgICBkZWxldGUgY3VzdG9tLnNraXBGcmFtZXM7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkRXJyb3JDb250ZXh0KGl0ZW0sIGVycm9ycykge1xuICB2YXIgY3VzdG9tID0gaXRlbS5kYXRhLmN1c3RvbSB8fCB7fTtcbiAgdmFyIGNvbnRleHRBZGRlZCA9IGZhbHNlO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlcnJvcnMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChlcnJvcnNbaV0uaGFzT3duUHJvcGVydHkoJ3JvbGxiYXJDb250ZXh0JykpIHtcbiAgICAgICAgY3VzdG9tID0gbWVyZ2UoY3VzdG9tLCBub25DaXJjdWxhckNsb25lKGVycm9yc1tpXS5yb2xsYmFyQ29udGV4dCkpO1xuICAgICAgICBjb250ZXh0QWRkZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEF2b2lkIGFkZGluZyBhbiBlbXB0eSBvYmplY3QgdG8gdGhlIGRhdGEuXG4gICAgaWYgKGNvbnRleHRBZGRlZCkge1xuICAgICAgaXRlbS5kYXRhLmN1c3RvbSA9IGN1c3RvbTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpdGVtLmRpYWdub3N0aWMuZXJyb3JfY29udGV4dCA9ICdGYWlsZWQ6ICcgKyBlLm1lc3NhZ2U7XG4gIH1cbn1cblxudmFyIFRFTEVNRVRSWV9UWVBFUyA9IFtcbiAgJ2xvZycsXG4gICduZXR3b3JrJyxcbiAgJ2RvbScsXG4gICduYXZpZ2F0aW9uJyxcbiAgJ2Vycm9yJyxcbiAgJ21hbnVhbCcsXG5dO1xudmFyIFRFTEVNRVRSWV9MRVZFTFMgPSBbJ2NyaXRpY2FsJywgJ2Vycm9yJywgJ3dhcm5pbmcnLCAnaW5mbycsICdkZWJ1ZyddO1xuXG5mdW5jdGlvbiBhcnJheUluY2x1ZGVzKGFyciwgdmFsKSB7XG4gIGZvciAodmFyIGsgPSAwOyBrIDwgYXJyLmxlbmd0aDsgKytrKSB7XG4gICAgaWYgKGFycltrXSA9PT0gdmFsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRlbGVtZXRyeUV2ZW50KGFyZ3MpIHtcbiAgdmFyIHR5cGUsIG1ldGFkYXRhLCBsZXZlbDtcbiAgdmFyIGFyZztcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3MubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcblxuICAgIHZhciB0eXAgPSB0eXBlTmFtZShhcmcpO1xuICAgIHN3aXRjaCAodHlwKSB7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBpZiAoIXR5cGUgJiYgYXJyYXlJbmNsdWRlcyhURUxFTUVUUllfVFlQRVMsIGFyZykpIHtcbiAgICAgICAgICB0eXBlID0gYXJnO1xuICAgICAgICB9IGVsc2UgaWYgKCFsZXZlbCAmJiBhcnJheUluY2x1ZGVzKFRFTEVNRVRSWV9MRVZFTFMsIGFyZykpIHtcbiAgICAgICAgICBsZXZlbCA9IGFyZztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIG1ldGFkYXRhID0gYXJnO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICB2YXIgZXZlbnQgPSB7XG4gICAgdHlwZTogdHlwZSB8fCAnbWFudWFsJyxcbiAgICBtZXRhZGF0YTogbWV0YWRhdGEgfHwge30sXG4gICAgbGV2ZWw6IGxldmVsLFxuICB9O1xuXG4gIHJldHVybiBldmVudDtcbn1cblxuZnVuY3Rpb24gYWRkSXRlbUF0dHJpYnV0ZXMoaXRlbSwgYXR0cmlidXRlcykge1xuICBpdGVtLmRhdGEuYXR0cmlidXRlcyA9IGl0ZW0uZGF0YS5hdHRyaWJ1dGVzIHx8IFtdO1xuICBpZiAoYXR0cmlidXRlcykge1xuICAgIGl0ZW0uZGF0YS5hdHRyaWJ1dGVzLnB1c2goLi4uYXR0cmlidXRlcyk7XG4gIH1cbn1cblxuLypcbiAqIGdldCAtIGdpdmVuIGFuIG9iai9hcnJheSBhbmQgYSBrZXlwYXRoLCByZXR1cm4gdGhlIHZhbHVlIGF0IHRoYXQga2V5cGF0aCBvclxuICogICAgICAgdW5kZWZpbmVkIGlmIG5vdCBwb3NzaWJsZS5cbiAqXG4gKiBAcGFyYW0gb2JqIC0gYW4gb2JqZWN0IG9yIGFycmF5XG4gKiBAcGFyYW0gcGF0aCAtIGEgc3RyaW5nIG9mIGtleXMgc2VwYXJhdGVkIGJ5ICcuJyBzdWNoIGFzICdwbHVnaW4uanF1ZXJ5LjAubWVzc2FnZSdcbiAqICAgIHdoaWNoIHdvdWxkIGNvcnJlc3BvbmQgdG8gNDIgaW4gYHtwbHVnaW46IHtqcXVlcnk6IFt7bWVzc2FnZTogNDJ9XX19YFxuICovXG5mdW5jdGlvbiBnZXQob2JqLCBwYXRoKSB7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICB2YXIga2V5cyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgdmFyIHJlc3VsdCA9IG9iajtcbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0ga2V5cy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0W2tleXNbaV1dO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzZXQob2JqLCBwYXRoLCB2YWx1ZSkge1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIga2V5cyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgdmFyIGxlbiA9IGtleXMubGVuZ3RoO1xuICBpZiAobGVuIDwgMSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAobGVuID09PSAxKSB7XG4gICAgb2JqW2tleXNbMF1dID0gdmFsdWU7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRyeSB7XG4gICAgdmFyIHRlbXAgPSBvYmpba2V5c1swXV0gfHwge307XG4gICAgdmFyIHJlcGxhY2VtZW50ID0gdGVtcDtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxlbiAtIDE7ICsraSkge1xuICAgICAgdGVtcFtrZXlzW2ldXSA9IHRlbXBba2V5c1tpXV0gfHwge307XG4gICAgICB0ZW1wID0gdGVtcFtrZXlzW2ldXTtcbiAgICB9XG4gICAgdGVtcFtrZXlzW2xlbiAtIDFdXSA9IHZhbHVlO1xuICAgIG9ialtrZXlzWzBdXSA9IHJlcGxhY2VtZW50O1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3NBc1N0cmluZyhhcmdzKSB7XG4gIHZhciBpLCBsZW4sIGFyZztcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKGkgPSAwLCBsZW4gPSBhcmdzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcbiAgICBzd2l0Y2ggKHR5cGVOYW1lKGFyZykpIHtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGFyZyA9IHN0cmluZ2lmeShhcmcpO1xuICAgICAgICBhcmcgPSBhcmcuZXJyb3IgfHwgYXJnLnZhbHVlO1xuICAgICAgICBpZiAoYXJnLmxlbmd0aCA+IDUwMCkge1xuICAgICAgICAgIGFyZyA9IGFyZy5zdWJzdHIoMCwgNDk3KSArICcuLi4nO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbnVsbCc6XG4gICAgICAgIGFyZyA9ICdudWxsJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICBhcmcgPSAndW5kZWZpbmVkJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzeW1ib2wnOlxuICAgICAgICBhcmcgPSBhcmcudG9TdHJpbmcoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKGFyZyk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdC5qb2luKCcgJyk7XG59XG5cbmZ1bmN0aW9uIG5vdygpIHtcbiAgaWYgKERhdGUubm93KSB7XG4gICAgcmV0dXJuICtEYXRlLm5vdygpO1xuICB9XG4gIHJldHVybiArbmV3IERhdGUoKTtcbn1cblxuZnVuY3Rpb24gZmlsdGVySXAocmVxdWVzdERhdGEsIGNhcHR1cmVJcCkge1xuICBpZiAoIXJlcXVlc3REYXRhIHx8ICFyZXF1ZXN0RGF0YVsndXNlcl9pcCddIHx8IGNhcHR1cmVJcCA9PT0gdHJ1ZSkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbmV3SXAgPSByZXF1ZXN0RGF0YVsndXNlcl9pcCddO1xuICBpZiAoIWNhcHR1cmVJcCkge1xuICAgIG5ld0lwID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICB0cnkge1xuICAgICAgdmFyIHBhcnRzO1xuICAgICAgaWYgKG5ld0lwLmluZGV4T2YoJy4nKSAhPT0gLTEpIHtcbiAgICAgICAgcGFydHMgPSBuZXdJcC5zcGxpdCgnLicpO1xuICAgICAgICBwYXJ0cy5wb3AoKTtcbiAgICAgICAgcGFydHMucHVzaCgnMCcpO1xuICAgICAgICBuZXdJcCA9IHBhcnRzLmpvaW4oJy4nKTtcbiAgICAgIH0gZWxzZSBpZiAobmV3SXAuaW5kZXhPZignOicpICE9PSAtMSkge1xuICAgICAgICBwYXJ0cyA9IG5ld0lwLnNwbGl0KCc6Jyk7XG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgdmFyIGJlZ2lubmluZyA9IHBhcnRzLnNsaWNlKDAsIDMpO1xuICAgICAgICAgIHZhciBzbGFzaElkeCA9IGJlZ2lubmluZ1syXS5pbmRleE9mKCcvJyk7XG4gICAgICAgICAgaWYgKHNsYXNoSWR4ICE9PSAtMSkge1xuICAgICAgICAgICAgYmVnaW5uaW5nWzJdID0gYmVnaW5uaW5nWzJdLnN1YnN0cmluZygwLCBzbGFzaElkeCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB0ZXJtaW5hbCA9ICcwMDAwOjAwMDA6MDAwMDowMDAwOjAwMDAnO1xuICAgICAgICAgIG5ld0lwID0gYmVnaW5uaW5nLmNvbmNhdCh0ZXJtaW5hbCkuam9pbignOicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdJcCA9IG51bGw7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbmV3SXAgPSBudWxsO1xuICAgIH1cbiAgfVxuICByZXF1ZXN0RGF0YVsndXNlcl9pcCddID0gbmV3SXA7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU9wdGlvbnMoY3VycmVudCwgaW5wdXQsIHBheWxvYWQsIGxvZ2dlcikge1xuICB2YXIgcmVzdWx0ID0gbWVyZ2UoY3VycmVudCwgaW5wdXQsIHBheWxvYWQpO1xuICByZXN1bHQgPSB1cGRhdGVEZXByZWNhdGVkT3B0aW9ucyhyZXN1bHQsIGxvZ2dlcik7XG4gIGlmICghaW5wdXQgfHwgaW5wdXQub3ZlcndyaXRlU2NydWJGaWVsZHMpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGlmIChpbnB1dC5zY3J1YkZpZWxkcykge1xuICAgIHJlc3VsdC5zY3J1YkZpZWxkcyA9IChjdXJyZW50LnNjcnViRmllbGRzIHx8IFtdKS5jb25jYXQoaW5wdXQuc2NydWJGaWVsZHMpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZURlcHJlY2F0ZWRPcHRpb25zKG9wdGlvbnMsIGxvZ2dlcikge1xuICBpZiAob3B0aW9ucy5ob3N0V2hpdGVMaXN0ICYmICFvcHRpb25zLmhvc3RTYWZlTGlzdCkge1xuICAgIG9wdGlvbnMuaG9zdFNhZmVMaXN0ID0gb3B0aW9ucy5ob3N0V2hpdGVMaXN0O1xuICAgIG9wdGlvbnMuaG9zdFdoaXRlTGlzdCA9IHVuZGVmaW5lZDtcbiAgICBsb2dnZXIgJiYgbG9nZ2VyLmxvZygnaG9zdFdoaXRlTGlzdCBpcyBkZXByZWNhdGVkLiBVc2UgaG9zdFNhZmVMaXN0LicpO1xuICB9XG4gIGlmIChvcHRpb25zLmhvc3RCbGFja0xpc3QgJiYgIW9wdGlvbnMuaG9zdEJsb2NrTGlzdCkge1xuICAgIG9wdGlvbnMuaG9zdEJsb2NrTGlzdCA9IG9wdGlvbnMuaG9zdEJsYWNrTGlzdDtcbiAgICBvcHRpb25zLmhvc3RCbGFja0xpc3QgPSB1bmRlZmluZWQ7XG4gICAgbG9nZ2VyICYmIGxvZ2dlci5sb2coJ2hvc3RCbGFja0xpc3QgaXMgZGVwcmVjYXRlZC4gVXNlIGhvc3RCbG9ja0xpc3QuJyk7XG4gIH1cbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aDogYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGgsXG4gIGNyZWF0ZUl0ZW06IGNyZWF0ZUl0ZW0sXG4gIGFkZEVycm9yQ29udGV4dDogYWRkRXJyb3JDb250ZXh0LFxuICBjcmVhdGVUZWxlbWV0cnlFdmVudDogY3JlYXRlVGVsZW1ldHJ5RXZlbnQsXG4gIGFkZEl0ZW1BdHRyaWJ1dGVzOiBhZGRJdGVtQXR0cmlidXRlcyxcbiAgZmlsdGVySXA6IGZpbHRlcklwLFxuICBmb3JtYXRBcmdzQXNTdHJpbmc6IGZvcm1hdEFyZ3NBc1N0cmluZyxcbiAgZm9ybWF0VXJsOiBmb3JtYXRVcmwsXG4gIGdldDogZ2V0LFxuICBoYW5kbGVPcHRpb25zOiBoYW5kbGVPcHRpb25zLFxuICBpc0Vycm9yOiBpc0Vycm9yLFxuICBpc0Zpbml0ZU51bWJlcjogaXNGaW5pdGVOdW1iZXIsXG4gIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gIGlzSXRlcmFibGU6IGlzSXRlcmFibGUsXG4gIGlzTmF0aXZlRnVuY3Rpb246IGlzTmF0aXZlRnVuY3Rpb24sXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc1R5cGU6IGlzVHlwZSxcbiAgaXNQcm9taXNlOiBpc1Byb21pc2UsXG4gIGlzQnJvd3NlcjogaXNCcm93c2VyLFxuICBqc29uUGFyc2U6IGpzb25QYXJzZSxcbiAgTEVWRUxTOiBMRVZFTFMsXG4gIG1ha2VVbmhhbmRsZWRTdGFja0luZm86IG1ha2VVbmhhbmRsZWRTdGFja0luZm8sXG4gIG1lcmdlOiBtZXJnZSxcbiAgbm93OiBub3csXG4gIHJlZGFjdDogcmVkYWN0LFxuICBSb2xsYmFySlNPTjogUm9sbGJhckpTT04sXG4gIHNhbml0aXplVXJsOiBzYW5pdGl6ZVVybCxcbiAgc2V0OiBzZXQsXG4gIHNldHVwSlNPTjogc2V0dXBKU09OLFxuICBzdHJpbmdpZnk6IHN0cmluZ2lmeSxcbiAgbWF4Qnl0ZVNpemU6IG1heEJ5dGVTaXplLFxuICB0eXBlTmFtZTogdHlwZU5hbWUsXG4gIHV1aWQ0OiB1dWlkNCxcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLyogZ2xvYmFscyBleHBlY3QgKi9cbi8qIGdsb2JhbHMgZGVzY3JpYmUgKi9cbi8qIGdsb2JhbHMgaXQgKi9cbi8qIGdsb2JhbHMgc2lub24gKi9cblxudmFyIFJhdGVMaW1pdGVyID0gcmVxdWlyZSgnLi4vc3JjL3JhdGVMaW1pdGVyJyk7XG5cbmRlc2NyaWJlKCdSYXRlTGltaXRlcigpJywgZnVuY3Rpb24gKCkge1xuICBpdCgnc2hvdWxkIGhhdmUgYWxsIG9mIHRoZSBleHBlY3RlZCBtZXRob2RzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgIHZhciByYXRlTGltaXRlciA9IG5ldyBSYXRlTGltaXRlcihvcHRpb25zKTtcbiAgICBleHBlY3QocmF0ZUxpbWl0ZXIpLnRvLmhhdmUucHJvcGVydHkoJ2NvbmZpZ3VyZUdsb2JhbCcpO1xuICAgIGV4cGVjdChyYXRlTGltaXRlcikudG8uaGF2ZS5wcm9wZXJ0eSgnc2hvdWxkU2VuZCcpO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGhhdmUgZ2xvYmFsIHByb3BlcnRpZXMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBvcHRpb25zID0ge307XG4gICAgdmFyIHJhdGVMaW1pdGVyID0gbmV3IFJhdGVMaW1pdGVyKG9wdGlvbnMpO1xuICAgIGV4cGVjdChSYXRlTGltaXRlcikudG8uaGF2ZS5wcm9wZXJ0eSgnZ2xvYmFsU2V0dGluZ3MnKTtcbiAgICB2YXIgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgZXhwZWN0KFJhdGVMaW1pdGVyLmdsb2JhbFNldHRpbmdzLnN0YXJ0VGltZSkudG8uYmUud2l0aGluKFxuICAgICAgbm93IC0gMTAwMCxcbiAgICAgIG5vdyArIDEwMDAsXG4gICAgKTtcbiAgICBleHBlY3QoUmF0ZUxpbWl0ZXIuZ2xvYmFsU2V0dGluZ3MubWF4SXRlbXMpLnRvLm5vdC5iZS5vaygpO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHNldCB0aGUgZ2xvYmFsIG9wdGlvbnMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgc3RhcnRUaW1lOiAxLFxuICAgICAgbWF4SXRlbXM6IDUwLFxuICAgICAgaXRlbXNQZXJNaW51dGU6IDEwMixcbiAgICAgIGZha2U6ICdzdHVmZicsXG4gICAgfTtcbiAgICB2YXIgcmF0ZUxpbWl0ZXIgPSBuZXcgUmF0ZUxpbWl0ZXIob3B0aW9ucyk7XG4gICAgZXhwZWN0KFJhdGVMaW1pdGVyLmdsb2JhbFNldHRpbmdzLnN0YXJ0VGltZSkudG8uYmUuZXFsKDEpO1xuICAgIGV4cGVjdChSYXRlTGltaXRlci5nbG9iYWxTZXR0aW5ncy5tYXhJdGVtcykudG8uYmUuZXFsKDUwKTtcbiAgICBleHBlY3QoUmF0ZUxpbWl0ZXIuZ2xvYmFsU2V0dGluZ3MuaXRlbXNQZXJNaW51dGUpLnRvLmJlLmVxbCgxMDIpO1xuICAgIGV4cGVjdChSYXRlTGltaXRlci5nbG9iYWxTZXR0aW5ncy5mYWtlKS50by5ub3QuYmUuZXFsKCdzdHVmZicpO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnc2hvdWxkU2VuZCcsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCBzYXkgdG8gc2VuZCBpZiBpdGVtIHNheXMgaWdub3JlJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgdmFyIG9wdGlvbnMgPSB7IHN0YXJ0VGltZTogbm93LCBtYXhJdGVtczogNCwgaXRlbXNQZXJNaW51dGU6IDIgfTtcbiAgICB2YXIgcmF0ZUxpbWl0ZXIgPSBuZXcgUmF0ZUxpbWl0ZXIob3B0aW9ucyk7XG5cbiAgICB2YXIgaXRlbSA9IHsgaWdub3JlUmF0ZUxpbWl0OiB0cnVlIH07XG4gICAgdmFyIHJlc3VsdCA9IHJhdGVMaW1pdGVyLnNob3VsZFNlbmQoaXRlbSk7XG4gICAgZXhwZWN0KHJlc3VsdC5zaG91bGRTZW5kKS50by5iZS5vaygpO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHNheSBub3QgdG8gc2VuZCBpZiBvdmVyIHRoZSBwZXIgbWludXRlIGxpbWl0JywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgdmFyIG9wdGlvbnMgPSB7IHN0YXJ0VGltZTogbm93LCBtYXhJdGVtczogNCwgaXRlbXNQZXJNaW51dGU6IDIgfTtcbiAgICB2YXIgcmF0ZUxpbWl0ZXIgPSBuZXcgUmF0ZUxpbWl0ZXIob3B0aW9ucyk7XG5cbiAgICB2YXIgaTEgPSB7IGE6IDEgfTtcbiAgICB2YXIgaTIgPSB7IGE6IDIgfTtcbiAgICB2YXIgaTMgPSB7IGE6IDMgfTtcbiAgICB2YXIgcmVzdWx0MSA9IHJhdGVMaW1pdGVyLnNob3VsZFNlbmQoaTEsIG5vdyArIDEpO1xuICAgIHZhciByZXN1bHQyID0gcmF0ZUxpbWl0ZXIuc2hvdWxkU2VuZChpMiwgbm93ICsgMik7XG4gICAgdmFyIHJlc3VsdDMgPSByYXRlTGltaXRlci5zaG91bGRTZW5kKGkzLCBub3cgKyAzKTtcblxuICAgIGV4cGVjdChyZXN1bHQxLnNob3VsZFNlbmQpLnRvLmJlLm9rKCk7XG4gICAgZXhwZWN0KHJlc3VsdDIuc2hvdWxkU2VuZCkudG8uYmUub2soKTtcblxuICAgIGV4cGVjdChyZXN1bHQzLnNob3VsZFNlbmQpLnRvLm5vdC5iZS5vaygpO1xuICAgIGV4cGVjdChyZXN1bHQzLmVycm9yKS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QocmVzdWx0My5wYXlsb2FkKS50by5iZS5vaygpO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJlc2V0IHRoZSBwZXIgbWludXRlIGxpbWl0JywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgdmFyIG9wdGlvbnMgPSB7IHN0YXJ0VGltZTogbm93LCBtYXhJdGVtczogNCwgaXRlbXNQZXJNaW51dGU6IDIgfTtcbiAgICB2YXIgcmF0ZUxpbWl0ZXIgPSBuZXcgUmF0ZUxpbWl0ZXIob3B0aW9ucyk7XG5cbiAgICB2YXIgaTEgPSB7IGE6IDEgfTtcbiAgICB2YXIgaTIgPSB7IGE6IDIgfTtcbiAgICB2YXIgaTMgPSB7IGE6IDMgfTtcbiAgICB2YXIgcmVzdWx0MSA9IHJhdGVMaW1pdGVyLnNob3VsZFNlbmQoaTEsIG5vdyArIDEpO1xuICAgIHZhciByZXN1bHQyID0gcmF0ZUxpbWl0ZXIuc2hvdWxkU2VuZChpMiwgbm93ICsgMik7XG4gICAgdmFyIHJlc3VsdDMgPSByYXRlTGltaXRlci5zaG91bGRTZW5kKGkzLCBub3cgKyA2MDAwMCArIDEpO1xuXG4gICAgZXhwZWN0KHJlc3VsdDEuc2hvdWxkU2VuZCkudG8uYmUub2soKTtcbiAgICBleHBlY3QocmVzdWx0Mi5zaG91bGRTZW5kKS50by5iZS5vaygpO1xuXG4gICAgZXhwZWN0KHJlc3VsdDMuc2hvdWxkU2VuZCkudG8uYmUub2soKTtcbiAgICBleHBlY3QocmVzdWx0My5lcnJvcikudG8ubm90LmJlLm9rKCk7XG5cbiAgICBkb25lKCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgbm90IHNlbmQgYW5kIGdpdmUgdXMgYSBwYXlsb2FkIHdoZW4gdGhlIG1heEl0ZW1zIGxpbWl0IGlzIHJlYWNoZWQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB2YXIgb3B0aW9ucyA9IHsgc3RhcnRUaW1lOiBub3csIG1heEl0ZW1zOiAzLCBpdGVtc1Blck1pbnV0ZTogMiB9O1xuICAgIHZhciByYXRlTGltaXRlciA9IG5ldyBSYXRlTGltaXRlcihvcHRpb25zKTtcblxuICAgIHZhciBpMSA9IHsgYTogMSB9O1xuICAgIHZhciBpMiA9IHsgYTogMiB9O1xuICAgIHZhciBpMyA9IHsgYTogMyB9O1xuICAgIHZhciBpNCA9IHsgYTogNCB9O1xuICAgIHZhciByZXN1bHQxID0gcmF0ZUxpbWl0ZXIuc2hvdWxkU2VuZChpMSwgbm93ICsgMSk7XG4gICAgdmFyIHJlc3VsdDIgPSByYXRlTGltaXRlci5zaG91bGRTZW5kKGkyLCBub3cgKyAyKTtcbiAgICB2YXIgcmVzdWx0MyA9IHJhdGVMaW1pdGVyLnNob3VsZFNlbmQoaTMsIG5vdyArIDYwMDAwICsgMSk7XG4gICAgdmFyIHJlc3VsdDQgPSByYXRlTGltaXRlci5zaG91bGRTZW5kKGk0LCBub3cgKyA2MDAwMCArIDYwMDAwICsgMSk7XG5cbiAgICBleHBlY3QocmVzdWx0MS5zaG91bGRTZW5kKS50by5iZS5vaygpO1xuICAgIGV4cGVjdChyZXN1bHQyLnNob3VsZFNlbmQpLnRvLmJlLm9rKCk7XG4gICAgZXhwZWN0KHJlc3VsdDMuc2hvdWxkU2VuZCkudG8uYmUub2soKTtcbiAgICBleHBlY3QocmVzdWx0My5lcnJvcikudG8ubm90LmJlLm9rKCk7XG5cbiAgICBleHBlY3QocmVzdWx0NC5zaG91bGRTZW5kKS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QocmVzdWx0NC5lcnJvcikudG8ubm90LmJlLm9rKCk7XG4gICAgZXhwZWN0KHJlc3VsdDQucGF5bG9hZCkudG8uYmUub2soKTtcbiAgICBleHBlY3QocmVzdWx0NC5wYXlsb2FkLmJvZHkubWVzc2FnZS5leHRyYS5tYXhJdGVtcykudG8uZXFsKFxuICAgICAgb3B0aW9ucy5tYXhJdGVtcyxcbiAgICApO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIG5vdCBzZW5kIGFuZCBnaXZlIGFuIGVycm9yIHdoZW4gb3ZlciBtYXhJdGVtcyBsaW1pdCcsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHZhciBvcHRpb25zID0geyBzdGFydFRpbWU6IG5vdywgbWF4SXRlbXM6IDMsIGl0ZW1zUGVyTWludXRlOiAyIH07XG4gICAgdmFyIHJhdGVMaW1pdGVyID0gbmV3IFJhdGVMaW1pdGVyKG9wdGlvbnMpO1xuXG4gICAgdmFyIGkxID0geyBhOiAxIH07XG4gICAgdmFyIGkyID0geyBhOiAyIH07XG4gICAgdmFyIGkzID0geyBhOiAzIH07XG4gICAgdmFyIGk0ID0geyBhOiA0IH07XG4gICAgdmFyIGk1ID0geyBhOiA1IH07XG4gICAgdmFyIHJlc3VsdDEgPSByYXRlTGltaXRlci5zaG91bGRTZW5kKGkxLCBub3cgKyAxKTtcbiAgICB2YXIgcmVzdWx0MiA9IHJhdGVMaW1pdGVyLnNob3VsZFNlbmQoaTIsIG5vdyArIDIpO1xuICAgIHZhciByZXN1bHQzID0gcmF0ZUxpbWl0ZXIuc2hvdWxkU2VuZChpMywgbm93ICsgNjAwMDAgKyAxKTtcbiAgICB2YXIgcmVzdWx0NCA9IHJhdGVMaW1pdGVyLnNob3VsZFNlbmQoaTQsIG5vdyArIDYwMDAwICsgNjAwMDAgKyAxKTtcbiAgICB2YXIgcmVzdWx0NSA9IHJhdGVMaW1pdGVyLnNob3VsZFNlbmQoaTUsIG5vdyArIDYwMDAwICsgNjAwMDAgKyA2MDAwMCArIDEpO1xuXG4gICAgZXhwZWN0KHJlc3VsdDEuc2hvdWxkU2VuZCkudG8uYmUub2soKTtcbiAgICBleHBlY3QocmVzdWx0Mi5zaG91bGRTZW5kKS50by5iZS5vaygpO1xuXG4gICAgZXhwZWN0KHJlc3VsdDMuc2hvdWxkU2VuZCkudG8uYmUub2soKTtcbiAgICBleHBlY3QocmVzdWx0My5lcnJvcikudG8ubm90LmJlLm9rKCk7XG4gICAgZXhwZWN0KHJlc3VsdDMucGF5bG9hZCkudG8ubm90LmJlLm9rKCk7XG5cbiAgICBleHBlY3QocmVzdWx0NC5zaG91bGRTZW5kKS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QocmVzdWx0NC5lcnJvcikudG8ubm90LmJlLm9rKCk7XG4gICAgZXhwZWN0KHJlc3VsdDQucGF5bG9hZCkudG8uYmUub2soKTtcblxuICAgIGV4cGVjdChyZXN1bHQ1LnNob3VsZFNlbmQpLnRvLm5vdC5iZS5vaygpO1xuICAgIGV4cGVjdChyZXN1bHQ1LmVycm9yKS50by5iZS5vaygpO1xuICAgIGV4cGVjdChyZXN1bHQ1LnBheWxvYWQpLnRvLm5vdC5iZS5vaygpO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcbn0pO1xuIl0sIm5hbWVzIjpbImhhc093biIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwidG9TdHIiLCJ0b1N0cmluZyIsImlzUGxhaW5PYmplY3QiLCJvYmoiLCJjYWxsIiwiaGFzT3duQ29uc3RydWN0b3IiLCJoYXNJc1Byb3RvdHlwZU9mIiwiY29uc3RydWN0b3IiLCJrZXkiLCJtZXJnZSIsImkiLCJzcmMiLCJjb3B5IiwiY2xvbmUiLCJuYW1lIiwicmVzdWx0IiwiY3VycmVudCIsImxlbmd0aCIsImFyZ3VtZW50cyIsIm1vZHVsZSIsImV4cG9ydHMiLCJfIiwicmVxdWlyZSIsIlJhdGVMaW1pdGVyIiwib3B0aW9ucyIsInN0YXJ0VGltZSIsIm5vdyIsImNvdW50ZXIiLCJwZXJNaW5Db3VudGVyIiwicGxhdGZvcm0iLCJwbGF0Zm9ybU9wdGlvbnMiLCJjb25maWd1cmVHbG9iYWwiLCJnbG9iYWxTZXR0aW5ncyIsIm1heEl0ZW1zIiwidW5kZWZpbmVkIiwiaXRlbXNQZXJNaW51dGUiLCJzaG91bGRTZW5kIiwiaXRlbSIsImVsYXBzZWRUaW1lIiwiZ2xvYmFsUmF0ZUxpbWl0IiwiZ2xvYmFsUmF0ZUxpbWl0UGVyTWluIiwiY2hlY2tSYXRlIiwic2hvdWxkU2VuZFZhbHVlIiwicGVyTWludXRlIiwic2V0UGxhdGZvcm1PcHRpb25zIiwibGltaXQiLCJpZ25vcmVSYXRlTGltaXQiLCJlcnJvciIsImxpbWl0UGVyTWluIiwicGF5bG9hZCIsIkVycm9yIiwicmF0ZUxpbWl0UGF5bG9hZCIsImVudmlyb25tZW50IiwibXNnIiwiYm9keSIsIm1lc3NhZ2UiLCJleHRyYSIsImxhbmd1YWdlIiwibm90aWZpZXIiLCJ2ZXJzaW9uIiwiZnJhbWV3b3JrIiwiUm9sbGJhckpTT04iLCJzZXR1cEpTT04iLCJwb2x5ZmlsbEpTT04iLCJpc0Z1bmN0aW9uIiwic3RyaW5naWZ5IiwicGFyc2UiLCJpc0RlZmluZWQiLCJKU09OIiwiaXNOYXRpdmVGdW5jdGlvbiIsImlzVHlwZSIsIngiLCJ0IiwidHlwZU5hbWUiLCJfdHlwZW9mIiwibWF0Y2giLCJ0b0xvd2VyQ2FzZSIsImYiLCJyZVJlZ0V4cENoYXIiLCJmdW5jTWF0Y2hTdHJpbmciLCJGdW5jdGlvbiIsInJlcGxhY2UiLCJyZUlzTmF0aXZlIiwiUmVnRXhwIiwiaXNPYmplY3QiLCJ0ZXN0IiwidmFsdWUiLCJ0eXBlIiwiaXNTdHJpbmciLCJTdHJpbmciLCJpc0Zpbml0ZU51bWJlciIsIm4iLCJOdW1iZXIiLCJpc0Zpbml0ZSIsInUiLCJpc0l0ZXJhYmxlIiwiaXNFcnJvciIsImUiLCJpc1Byb21pc2UiLCJwIiwidGhlbiIsImlzQnJvd3NlciIsIndpbmRvdyIsInJlZGFjdCIsInV1aWQ0IiwiZCIsInV1aWQiLCJjIiwiciIsIk1hdGgiLCJyYW5kb20iLCJmbG9vciIsIkxFVkVMUyIsImRlYnVnIiwiaW5mbyIsIndhcm5pbmciLCJjcml0aWNhbCIsInNhbml0aXplVXJsIiwidXJsIiwiYmFzZVVybFBhcnRzIiwicGFyc2VVcmkiLCJhbmNob3IiLCJzb3VyY2UiLCJxdWVyeSIsInBhcnNlVXJpT3B0aW9ucyIsInN0cmljdE1vZGUiLCJxIiwicGFyc2VyIiwic3RyaWN0IiwibG9vc2UiLCJzdHIiLCJvIiwibSIsImV4ZWMiLCJ1cmkiLCJsIiwiJDAiLCIkMSIsIiQyIiwiYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGgiLCJhY2Nlc3NUb2tlbiIsInBhcmFtcyIsImFjY2Vzc190b2tlbiIsInBhcmFtc0FycmF5IiwiayIsInB1c2giLCJqb2luIiwic29ydCIsInBhdGgiLCJxcyIsImluZGV4T2YiLCJoIiwic3Vic3RyaW5nIiwiZm9ybWF0VXJsIiwicHJvdG9jb2wiLCJwb3J0IiwiaG9zdG5hbWUiLCJiYWNrdXAiLCJqc29uRXJyb3IiLCJiYWNrdXBFcnJvciIsIm1heEJ5dGVTaXplIiwic3RyaW5nIiwiY291bnQiLCJjb2RlIiwiY2hhckNvZGVBdCIsImpzb25QYXJzZSIsInMiLCJtYWtlVW5oYW5kbGVkU3RhY2tJbmZvIiwibGluZW5vIiwiY29sbm8iLCJtb2RlIiwiYmFja3VwTWVzc2FnZSIsImVycm9yUGFyc2VyIiwibG9jYXRpb24iLCJsaW5lIiwiY29sdW1uIiwiZnVuYyIsImd1ZXNzRnVuY3Rpb25OYW1lIiwiY29udGV4dCIsImdhdGhlckNvbnRleHQiLCJocmVmIiwiZG9jdW1lbnQiLCJ1c2VyYWdlbnQiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJzdGFjayIsIndyYXBDYWxsYmFjayIsImxvZ2dlciIsImVyciIsInJlc3AiLCJub25DaXJjdWxhckNsb25lIiwic2VlbiIsIm5ld1NlZW4iLCJpbmNsdWRlcyIsInNsaWNlIiwiY3JlYXRlSXRlbSIsImFyZ3MiLCJyZXF1ZXN0S2V5cyIsImxhbWJkYUNvbnRleHQiLCJjdXN0b20iLCJjYWxsYmFjayIsInJlcXVlc3QiLCJhcmciLCJleHRyYUFyZ3MiLCJkaWFnbm9zdGljIiwiYXJnVHlwZXMiLCJ0eXAiLCJET01FeGNlcHRpb24iLCJqIiwibGVuIiwidGltZXN0YW1wIiwiZGF0YSIsInNldEN1c3RvbUl0ZW1LZXlzIiwiX29yaWdpbmFsQXJncyIsIm9yaWdpbmFsX2FyZ190eXBlcyIsImxldmVsIiwic2tpcEZyYW1lcyIsImFkZEVycm9yQ29udGV4dCIsImVycm9ycyIsImNvbnRleHRBZGRlZCIsInJvbGxiYXJDb250ZXh0IiwiZXJyb3JfY29udGV4dCIsIlRFTEVNRVRSWV9UWVBFUyIsIlRFTEVNRVRSWV9MRVZFTFMiLCJhcnJheUluY2x1ZGVzIiwiYXJyIiwidmFsIiwiY3JlYXRlVGVsZW1ldHJ5RXZlbnQiLCJtZXRhZGF0YSIsImV2ZW50IiwiYWRkSXRlbUF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVzIiwiX2l0ZW0kZGF0YSRhdHRyaWJ1dGVzIiwiYXBwbHkiLCJfdG9Db25zdW1hYmxlQXJyYXkiLCJnZXQiLCJrZXlzIiwic3BsaXQiLCJzZXQiLCJ0ZW1wIiwicmVwbGFjZW1lbnQiLCJmb3JtYXRBcmdzQXNTdHJpbmciLCJzdWJzdHIiLCJEYXRlIiwiZmlsdGVySXAiLCJyZXF1ZXN0RGF0YSIsImNhcHR1cmVJcCIsIm5ld0lwIiwicGFydHMiLCJwb3AiLCJiZWdpbm5pbmciLCJzbGFzaElkeCIsInRlcm1pbmFsIiwiY29uY2F0IiwiaGFuZGxlT3B0aW9ucyIsImlucHV0IiwidXBkYXRlRGVwcmVjYXRlZE9wdGlvbnMiLCJvdmVyd3JpdGVTY3J1YkZpZWxkcyIsInNjcnViRmllbGRzIiwiaG9zdFdoaXRlTGlzdCIsImhvc3RTYWZlTGlzdCIsImxvZyIsImhvc3RCbGFja0xpc3QiLCJob3N0QmxvY2tMaXN0Il0sInNvdXJjZVJvb3QiOiIifQ==