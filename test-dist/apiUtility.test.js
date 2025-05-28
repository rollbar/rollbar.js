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

/***/ "./src/apiUtility.js":
/*!***************************!*\
  !*** ./src/apiUtility.js ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");
function buildPayload(data) {
  if (!_.isType(data.context, 'string')) {
    var contextResult = _.stringify(data.context);
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
function transportOptions(transport, method) {
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
module.exports = {
  buildPayload: buildPayload,
  getTransportFromOptions: getTransportFromOptions,
  transportOptions: transportOptions,
  appendPathToPath: appendPathToPath
};

/***/ }),

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
/*!*********************************!*\
  !*** ./test/apiUtility.test.js ***!
  \*********************************/
/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var u = __webpack_require__(/*! ../src/apiUtility */ "./src/apiUtility.js");
var utility = __webpack_require__(/*! ../src/utility */ "./src/utility.js");
utility.setupJSON();

describe('buildPayload', function () {
  it('should package up the input into a payload', function () {
    var token = 'abc123';
    var data = { context: 'not an object', other: 'stuff' };
    var payload = u.buildPayload(data);

    expect(payload.data).to.eql(data);
  });
  it('should stringify context', function () {
    var token = 'abc123';
    var context = { a: 1, b: 'other' };
    var data = {
      context: context,
      other: 'stuff',
    };
    var payload = u.buildPayload(data);

    expect(payload.data.context).to.not.eql(context);
    expect(payload.data.context).to.eql('{"a":1,"b":"other"}');
  });
  it('should truncate context', function () {
    var token = 'abc123';
    var context = {};
    for (var i = 0; i < 35; i++) {
      context[i] = i;
    }
    var data = {
      context: context,
      other: 'stuff',
    };
    var payload = u.buildPayload(data);

    expect(payload.data.context).to.not.eql(context);
    expect(payload.data.context.length).to.eql(255);
  });
});

describe('getTransportFromOptions', function () {
  it('should use defaults with not endpoint', function () {
    var options = {
      not: 'endpoint',
      proxy: {
        host: 'whatver.com',
        port: 9090,
      },
      timeout: 3000,
    };
    var defaults = {
      hostname: 'api.com',
      protocol: 'https:',
      path: '/api/1',
    };
    var url = {
      parse: function () {
        expect(false).to.be.ok();
        return {};
      },
    };
    var t = u.getTransportFromOptions(options, defaults, url);
    expect(t.hostname).to.eql(defaults.hostname);
    expect(t.protocol).to.eql(defaults.protocol);
    expect(t.port).to.eql(defaults.port);
    expect(t.proxy).to.eql(options.proxy);
    expect(t.timeout).to.eql(options.timeout);
  });
  it('should parse the endpoint if given', function () {
    var options = {
      endpoint: 'http://whatever.com/api/42',
      proxy: {
        host: 'nope.com',
        port: 9090,
      },
    };
    var defaults = {
      hostname: 'api.com',
      protocol: 'https:',
      path: '/api/1',
      search: '?abc=456',
    };
    var url = {
      parse: function (endpoint) {
        expect(endpoint).to.eql(options.endpoint);
        return {
          hostname: 'whatever.com',
          protocol: 'http:',
          pathname: '/api/42',
        };
      },
    };
    var t = u.getTransportFromOptions(options, defaults, url);
    expect(t.hostname).to.not.eql(defaults.hostname);
    expect(t.hostname).to.eql('whatever.com');
    expect(t.protocol).to.eql('http:');
    expect(t.search).to.not.be.ok();
    expect(t.proxy).to.eql(options.proxy);
    expect(t.timeout).to.eql(undefined);
  });
  describe('getTransportFromOptions', function () {
    var defaults = {
      hostname: 'api.com',
      protocol: 'https:',
      path: '/api/1',
      search: '?abc=456',
    };
    var url = {
      parse: function (_) {
        return {
          hostname: 'whatever.com',
          protocol: 'http:',
          pathname: '/api/42',
        };
      },
    };
    it('should use xhr by default', function (done) {
      var options = {};
      var t = u.getTransportFromOptions(options, defaults, url);
      expect(t.transport).to.eql('xhr');
      done();
    });
    it('should use fetch when requested', function (done) {
      var options = { defaultTransport: 'fetch' };
      var t = u.getTransportFromOptions(options, defaults, url);
      expect(t.transport).to.eql('fetch');
      done();
    });
    it('should use xhr when requested', function (done) {
      var options = { defaultTransport: 'xhr' };
      var t = u.getTransportFromOptions(options, defaults, url);
      expect(t.transport).to.eql('xhr');
      done();
    });
    it('should use xhr when fetch is unavailable', function (done) {
      var options = { defaultTransport: 'fetch' };
      var oldFetch = window.fetch;
      self.fetch = undefined;
      var t = u.getTransportFromOptions(options, defaults, url);
      expect(t.transport).to.eql('xhr');
      self.fetch = oldFetch;
      done();
    });
    it('should use fetch when xhr is unavailable', function (done) {
      var options = { defaultTransport: 'xhr' };
      var oldXhr = window.XMLHttpRequest;
      self.XMLHttpRequest = undefined;
      var t = u.getTransportFromOptions(options, defaults, url);
      expect(t.transport).to.eql('fetch');
      self.XMLHttpRequest = oldXhr;
      done();
    });
  });
});

describe('transportOptions', function () {
  it('should use the given data if no proxy', function () {
    var transport = {
      hostname: 'a.com',
      path: '/api/v1/item/',
      port: 5000,
    };
    var method = 'GET';

    var o = u.transportOptions(transport, method);
    expect(o.protocol).to.eql('https:');
    expect(o.hostname).to.eql('a.com');
    expect(o.path).to.eql('/api/v1/item/');
    expect(o.port).to.eql(5000);
    expect(o.method).to.eql(method);
    expect(o.timeout).to.eql(undefined);
  });
  it('should use the proxy if given', function () {
    var transport = {
      hostname: 'a.com',
      path: '/api/v1/item/',
      port: 5000,
      proxy: {
        host: 'b.com',
        port: 8080,
      },
      timeout: 3000,
    };
    var method = 'GET';

    var o = u.transportOptions(transport, method);
    expect(o.protocol).to.eql('https:');
    expect(o.hostname).to.eql('b.com');
    expect(o.port).to.eql(8080);
    expect(o.path).to.eql('https://a.com/api/v1/item/');
    expect(o.method).to.eql(method);
    expect(o.timeout).to.eql(transport.timeout);
  });
});

describe('appendPathToPath', function () {
  var expSlash = '/api/item/';
  var expNoSlash = '/api/item';
  it('should handle trailing slash in base', function () {
    var base = '/api/';
    expect(u.appendPathToPath(base, '/item/')).to.eql(expSlash);
    expect(u.appendPathToPath(base, '/item')).to.eql(expNoSlash);
    expect(u.appendPathToPath(base, 'item/')).to.eql(expSlash);
    expect(u.appendPathToPath(base, 'item')).to.eql(expNoSlash);
  });
  it('should handle no trailing slash in base', function () {
    var base = '/api';
    expect(u.appendPathToPath(base, '/item/')).to.eql(expSlash);
    expect(u.appendPathToPath(base, '/item')).to.eql(expNoSlash);
    expect(u.appendPathToPath(base, 'item/')).to.eql(expSlash);
    expect(u.appendPathToPath(base, 'item')).to.eql(expNoSlash);
  });
});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNILENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3JvbGxiYXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvYXBpVXRpbGl0eS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL21lcmdlLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvdXRpbGl0eS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3JvbGxiYXIvLi90ZXN0L2FwaVV0aWxpdHkudGVzdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoc2VsZiwgKCkgPT4ge1xucmV0dXJuICIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsaXR5Jyk7XG5cbmZ1bmN0aW9uIGJ1aWxkUGF5bG9hZChkYXRhKSB7XG4gIGlmICghXy5pc1R5cGUoZGF0YS5jb250ZXh0LCAnc3RyaW5nJykpIHtcbiAgICB2YXIgY29udGV4dFJlc3VsdCA9IF8uc3RyaW5naWZ5KGRhdGEuY29udGV4dCk7XG4gICAgaWYgKGNvbnRleHRSZXN1bHQuZXJyb3IpIHtcbiAgICAgIGRhdGEuY29udGV4dCA9IFwiRXJyb3I6IGNvdWxkIG5vdCBzZXJpYWxpemUgJ2NvbnRleHQnXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEuY29udGV4dCA9IGNvbnRleHRSZXN1bHQudmFsdWUgfHwgJyc7XG4gICAgfVxuICAgIGlmIChkYXRhLmNvbnRleHQubGVuZ3RoID4gMjU1KSB7XG4gICAgICBkYXRhLmNvbnRleHQgPSBkYXRhLmNvbnRleHQuc3Vic3RyKDAsIDI1NSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB7XG4gICAgZGF0YTogZGF0YSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0VHJhbnNwb3J0RnJvbU9wdGlvbnMob3B0aW9ucywgZGVmYXVsdHMsIHVybCkge1xuICB2YXIgaG9zdG5hbWUgPSBkZWZhdWx0cy5ob3N0bmFtZTtcbiAgdmFyIHByb3RvY29sID0gZGVmYXVsdHMucHJvdG9jb2w7XG4gIHZhciBwb3J0ID0gZGVmYXVsdHMucG9ydDtcbiAgdmFyIHBhdGggPSBkZWZhdWx0cy5wYXRoO1xuICB2YXIgc2VhcmNoID0gZGVmYXVsdHMuc2VhcmNoO1xuICB2YXIgdGltZW91dCA9IG9wdGlvbnMudGltZW91dDtcbiAgdmFyIHRyYW5zcG9ydCA9IGRldGVjdFRyYW5zcG9ydChvcHRpb25zKTtcblxuICB2YXIgcHJveHkgPSBvcHRpb25zLnByb3h5O1xuICBpZiAob3B0aW9ucy5lbmRwb2ludCkge1xuICAgIHZhciBvcHRzID0gdXJsLnBhcnNlKG9wdGlvbnMuZW5kcG9pbnQpO1xuICAgIGhvc3RuYW1lID0gb3B0cy5ob3N0bmFtZTtcbiAgICBwcm90b2NvbCA9IG9wdHMucHJvdG9jb2w7XG4gICAgcG9ydCA9IG9wdHMucG9ydDtcbiAgICBwYXRoID0gb3B0cy5wYXRobmFtZTtcbiAgICBzZWFyY2ggPSBvcHRzLnNlYXJjaDtcbiAgfVxuICByZXR1cm4ge1xuICAgIHRpbWVvdXQ6IHRpbWVvdXQsXG4gICAgaG9zdG5hbWU6IGhvc3RuYW1lLFxuICAgIHByb3RvY29sOiBwcm90b2NvbCxcbiAgICBwb3J0OiBwb3J0LFxuICAgIHBhdGg6IHBhdGgsXG4gICAgc2VhcmNoOiBzZWFyY2gsXG4gICAgcHJveHk6IHByb3h5LFxuICAgIHRyYW5zcG9ydDogdHJhbnNwb3J0LFxuICB9O1xufVxuXG5mdW5jdGlvbiBkZXRlY3RUcmFuc3BvcnQob3B0aW9ucykge1xuICB2YXIgZ1dpbmRvdyA9XG4gICAgKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93KSB8fFxuICAgICh0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmKTtcbiAgdmFyIHRyYW5zcG9ydCA9IG9wdGlvbnMuZGVmYXVsdFRyYW5zcG9ydCB8fCAneGhyJztcbiAgaWYgKHR5cGVvZiBnV2luZG93LmZldGNoID09PSAndW5kZWZpbmVkJykgdHJhbnNwb3J0ID0gJ3hocic7XG4gIGlmICh0eXBlb2YgZ1dpbmRvdy5YTUxIdHRwUmVxdWVzdCA9PT0gJ3VuZGVmaW5lZCcpIHRyYW5zcG9ydCA9ICdmZXRjaCc7XG4gIHJldHVybiB0cmFuc3BvcnQ7XG59XG5cbmZ1bmN0aW9uIHRyYW5zcG9ydE9wdGlvbnModHJhbnNwb3J0LCBtZXRob2QpIHtcbiAgdmFyIHByb3RvY29sID0gdHJhbnNwb3J0LnByb3RvY29sIHx8ICdodHRwczonO1xuICB2YXIgcG9ydCA9XG4gICAgdHJhbnNwb3J0LnBvcnQgfHxcbiAgICAocHJvdG9jb2wgPT09ICdodHRwOicgPyA4MCA6IHByb3RvY29sID09PSAnaHR0cHM6JyA/IDQ0MyA6IHVuZGVmaW5lZCk7XG4gIHZhciBob3N0bmFtZSA9IHRyYW5zcG9ydC5ob3N0bmFtZTtcbiAgdmFyIHBhdGggPSB0cmFuc3BvcnQucGF0aDtcbiAgdmFyIHRpbWVvdXQgPSB0cmFuc3BvcnQudGltZW91dDtcbiAgdmFyIHRyYW5zcG9ydEFQSSA9IHRyYW5zcG9ydC50cmFuc3BvcnQ7XG4gIGlmICh0cmFuc3BvcnQuc2VhcmNoKSB7XG4gICAgcGF0aCA9IHBhdGggKyB0cmFuc3BvcnQuc2VhcmNoO1xuICB9XG4gIGlmICh0cmFuc3BvcnQucHJveHkpIHtcbiAgICBwYXRoID0gcHJvdG9jb2wgKyAnLy8nICsgaG9zdG5hbWUgKyBwYXRoO1xuICAgIGhvc3RuYW1lID0gdHJhbnNwb3J0LnByb3h5Lmhvc3QgfHwgdHJhbnNwb3J0LnByb3h5Lmhvc3RuYW1lO1xuICAgIHBvcnQgPSB0cmFuc3BvcnQucHJveHkucG9ydDtcbiAgICBwcm90b2NvbCA9IHRyYW5zcG9ydC5wcm94eS5wcm90b2NvbCB8fCBwcm90b2NvbDtcbiAgfVxuICByZXR1cm4ge1xuICAgIHRpbWVvdXQ6IHRpbWVvdXQsXG4gICAgcHJvdG9jb2w6IHByb3RvY29sLFxuICAgIGhvc3RuYW1lOiBob3N0bmFtZSxcbiAgICBwYXRoOiBwYXRoLFxuICAgIHBvcnQ6IHBvcnQsXG4gICAgbWV0aG9kOiBtZXRob2QsXG4gICAgdHJhbnNwb3J0OiB0cmFuc3BvcnRBUEksXG4gIH07XG59XG5cbmZ1bmN0aW9uIGFwcGVuZFBhdGhUb1BhdGgoYmFzZSwgcGF0aCkge1xuICB2YXIgYmFzZVRyYWlsaW5nU2xhc2ggPSAvXFwvJC8udGVzdChiYXNlKTtcbiAgdmFyIHBhdGhCZWdpbm5pbmdTbGFzaCA9IC9eXFwvLy50ZXN0KHBhdGgpO1xuXG4gIGlmIChiYXNlVHJhaWxpbmdTbGFzaCAmJiBwYXRoQmVnaW5uaW5nU2xhc2gpIHtcbiAgICBwYXRoID0gcGF0aC5zdWJzdHJpbmcoMSk7XG4gIH0gZWxzZSBpZiAoIWJhc2VUcmFpbGluZ1NsYXNoICYmICFwYXRoQmVnaW5uaW5nU2xhc2gpIHtcbiAgICBwYXRoID0gJy8nICsgcGF0aDtcbiAgfVxuXG4gIHJldHVybiBiYXNlICsgcGF0aDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGJ1aWxkUGF5bG9hZDogYnVpbGRQYXlsb2FkLFxuICBnZXRUcmFuc3BvcnRGcm9tT3B0aW9uczogZ2V0VHJhbnNwb3J0RnJvbU9wdGlvbnMsXG4gIHRyYW5zcG9ydE9wdGlvbnM6IHRyYW5zcG9ydE9wdGlvbnMsXG4gIGFwcGVuZFBhdGhUb1BhdGg6IGFwcGVuZFBhdGhUb1BhdGgsXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbnZhciBpc1BsYWluT2JqZWN0ID0gZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmopIHtcbiAgaWYgKCFvYmogfHwgdG9TdHIuY2FsbChvYmopICE9PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBoYXNPd25Db25zdHJ1Y3RvciA9IGhhc093bi5jYWxsKG9iaiwgJ2NvbnN0cnVjdG9yJyk7XG4gIHZhciBoYXNJc1Byb3RvdHlwZU9mID1cbiAgICBvYmouY29uc3RydWN0b3IgJiZcbiAgICBvYmouY29uc3RydWN0b3IucHJvdG90eXBlICYmXG4gICAgaGFzT3duLmNhbGwob2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgJ2lzUHJvdG90eXBlT2YnKTtcbiAgLy8gTm90IG93biBjb25zdHJ1Y3RvciBwcm9wZXJ0eSBtdXN0IGJlIE9iamVjdFxuICBpZiAob2JqLmNvbnN0cnVjdG9yICYmICFoYXNPd25Db25zdHJ1Y3RvciAmJiAhaGFzSXNQcm90b3R5cGVPZikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIE93biBwcm9wZXJ0aWVzIGFyZSBlbnVtZXJhdGVkIGZpcnN0bHksIHNvIHRvIHNwZWVkIHVwLFxuICAvLyBpZiBsYXN0IG9uZSBpcyBvd24sIHRoZW4gYWxsIHByb3BlcnRpZXMgYXJlIG93bi5cbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgLyoqL1xuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiBrZXkgPT09ICd1bmRlZmluZWQnIHx8IGhhc093bi5jYWxsKG9iaiwga2V5KTtcbn07XG5cbmZ1bmN0aW9uIG1lcmdlKCkge1xuICB2YXIgaSxcbiAgICBzcmMsXG4gICAgY29weSxcbiAgICBjbG9uZSxcbiAgICBuYW1lLFxuICAgIHJlc3VsdCA9IHt9LFxuICAgIGN1cnJlbnQgPSBudWxsLFxuICAgIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY3VycmVudCA9IGFyZ3VtZW50c1tpXTtcbiAgICBpZiAoY3VycmVudCA9PSBudWxsKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBmb3IgKG5hbWUgaW4gY3VycmVudCkge1xuICAgICAgc3JjID0gcmVzdWx0W25hbWVdO1xuICAgICAgY29weSA9IGN1cnJlbnRbbmFtZV07XG4gICAgICBpZiAocmVzdWx0ICE9PSBjb3B5KSB7XG4gICAgICAgIGlmIChjb3B5ICYmIGlzUGxhaW5PYmplY3QoY29weSkpIHtcbiAgICAgICAgICBjbG9uZSA9IHNyYyAmJiBpc1BsYWluT2JqZWN0KHNyYykgPyBzcmMgOiB7fTtcbiAgICAgICAgICByZXN1bHRbbmFtZV0gPSBtZXJnZShjbG9uZSwgY29weSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvcHkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgcmVzdWx0W25hbWVdID0gY29weTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlO1xuIiwidmFyIG1lcmdlID0gcmVxdWlyZSgnLi9tZXJnZScpO1xuXG52YXIgUm9sbGJhckpTT04gPSB7fTtcbmZ1bmN0aW9uIHNldHVwSlNPTihwb2x5ZmlsbEpTT04pIHtcbiAgaWYgKGlzRnVuY3Rpb24oUm9sbGJhckpTT04uc3RyaW5naWZ5KSAmJiBpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnBhcnNlKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChpc0RlZmluZWQoSlNPTikpIHtcbiAgICAvLyBJZiBwb2x5ZmlsbCBpcyBwcm92aWRlZCwgcHJlZmVyIGl0IG92ZXIgZXhpc3Rpbmcgbm9uLW5hdGl2ZSBzaGltcy5cbiAgICBpZiAocG9seWZpbGxKU09OKSB7XG4gICAgICBpZiAoaXNOYXRpdmVGdW5jdGlvbihKU09OLnN0cmluZ2lmeSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04uc3RyaW5naWZ5ID0gSlNPTi5zdHJpbmdpZnk7XG4gICAgICB9XG4gICAgICBpZiAoaXNOYXRpdmVGdW5jdGlvbihKU09OLnBhcnNlKSkge1xuICAgICAgICBSb2xsYmFySlNPTi5wYXJzZSA9IEpTT04ucGFyc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGVsc2UgYWNjZXB0IGFueSBpbnRlcmZhY2UgdGhhdCBpcyBwcmVzZW50LlxuICAgICAgaWYgKGlzRnVuY3Rpb24oSlNPTi5zdHJpbmdpZnkpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnN0cmluZ2lmeSA9IEpTT04uc3RyaW5naWZ5O1xuICAgICAgfVxuICAgICAgaWYgKGlzRnVuY3Rpb24oSlNPTi5wYXJzZSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04ucGFyc2UgPSBKU09OLnBhcnNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoIWlzRnVuY3Rpb24oUm9sbGJhckpTT04uc3RyaW5naWZ5KSB8fCAhaXNGdW5jdGlvbihSb2xsYmFySlNPTi5wYXJzZSkpIHtcbiAgICBwb2x5ZmlsbEpTT04gJiYgcG9seWZpbGxKU09OKFJvbGxiYXJKU09OKTtcbiAgfVxufVxuXG4vKlxuICogaXNUeXBlIC0gR2l2ZW4gYSBKYXZhc2NyaXB0IHZhbHVlIGFuZCBhIHN0cmluZywgcmV0dXJucyB0cnVlIGlmIHRoZSB0eXBlIG9mIHRoZSB2YWx1ZSBtYXRjaGVzIHRoZVxuICogZ2l2ZW4gc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB4IC0gYW55IHZhbHVlXG4gKiBAcGFyYW0gdCAtIGEgbG93ZXJjYXNlIHN0cmluZyBjb250YWluaW5nIG9uZSBvZiB0aGUgZm9sbG93aW5nIHR5cGUgbmFtZXM6XG4gKiAgICAtIHVuZGVmaW5lZFxuICogICAgLSBudWxsXG4gKiAgICAtIGVycm9yXG4gKiAgICAtIG51bWJlclxuICogICAgLSBib29sZWFuXG4gKiAgICAtIHN0cmluZ1xuICogICAgLSBzeW1ib2xcbiAqICAgIC0gZnVuY3Rpb25cbiAqICAgIC0gb2JqZWN0XG4gKiAgICAtIGFycmF5XG4gKiBAcmV0dXJucyB0cnVlIGlmIHggaXMgb2YgdHlwZSB0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNUeXBlKHgsIHQpIHtcbiAgcmV0dXJuIHQgPT09IHR5cGVOYW1lKHgpO1xufVxuXG4vKlxuICogdHlwZU5hbWUgLSBHaXZlbiBhIEphdmFzY3JpcHQgdmFsdWUsIHJldHVybnMgdGhlIHR5cGUgb2YgdGhlIG9iamVjdCBhcyBhIHN0cmluZ1xuICovXG5mdW5jdGlvbiB0eXBlTmFtZSh4KSB7XG4gIHZhciBuYW1lID0gdHlwZW9mIHg7XG4gIGlmIChuYW1lICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBuYW1lO1xuICB9XG4gIGlmICgheCkge1xuICAgIHJldHVybiAnbnVsbCc7XG4gIH1cbiAgaWYgKHggaW5zdGFuY2VvZiBFcnJvcikge1xuICAgIHJldHVybiAnZXJyb3InO1xuICB9XG4gIHJldHVybiB7fS50b1N0cmluZ1xuICAgIC5jYWxsKHgpXG4gICAgLm1hdGNoKC9cXHMoW2EtekEtWl0rKS8pWzFdXG4gICAgLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8qIGlzRnVuY3Rpb24gLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIGEgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0gZiAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBmIGlzIGEgZnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGYpIHtcbiAgcmV0dXJuIGlzVHlwZShmLCAnZnVuY3Rpb24nKTtcbn1cblxuLyogaXNOYXRpdmVGdW5jdGlvbiAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgYSBuYXRpdmUgSlMgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0gZiAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBmIGlzIGEgbmF0aXZlIEpTIGZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOYXRpdmVGdW5jdGlvbihmKSB7XG4gIHZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG4gIHZhciBmdW5jTWF0Y2hTdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmdcbiAgICAuY2FsbChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KVxuICAgIC5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gICAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpO1xuICB2YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgKyBmdW5jTWF0Y2hTdHJpbmcgKyAnJCcpO1xuICByZXR1cm4gaXNPYmplY3QoZikgJiYgcmVJc05hdGl2ZS50ZXN0KGYpO1xufVxuXG4vKiBpc09iamVjdCAtIENoZWNrcyBpZiB0aGUgYXJndW1lbnQgaXMgYW4gb2JqZWN0XG4gKlxuICogQHBhcmFtIHZhbHVlIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlzIHZhbHVlIGlzIGFuIG9iamVjdCBmdW5jdGlvbiBpcyBhbiBvYmplY3QpXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKiBpc1N0cmluZyAtIENoZWNrcyBpZiB0aGUgYXJndW1lbnQgaXMgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0gdmFsdWUgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgdmFsdWUgaXMgYSBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgdmFsdWUgaW5zdGFuY2VvZiBTdHJpbmc7XG59XG5cbi8qKlxuICogaXNGaW5pdGVOdW1iZXIgLSBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBhIGZpbml0ZSBudW1iZXJcbiAqXG4gKiBAcGFyYW0geyp9IG4gLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgdmFsdWUgaXMgYSBmaW5pdGUgbnVtYmVyXG4gKi9cbmZ1bmN0aW9uIGlzRmluaXRlTnVtYmVyKG4pIHtcbiAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZShuKTtcbn1cblxuLypcbiAqIGlzRGVmaW5lZCAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgbm90IGVxdWFsIHRvIHVuZGVmaW5lZFxuICpcbiAqIEBwYXJhbSB1IC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIHUgaXMgYW55dGhpbmcgb3RoZXIgdGhhbiB1bmRlZmluZWRcbiAqL1xuZnVuY3Rpb24gaXNEZWZpbmVkKHUpIHtcbiAgcmV0dXJuICFpc1R5cGUodSwgJ3VuZGVmaW5lZCcpO1xufVxuXG4vKlxuICogaXNJdGVyYWJsZSAtIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGNhbiBiZSBpdGVyYXRlZCwgZXNzZW50aWFsbHlcbiAqIHdoZXRoZXIgaXQgaXMgYW4gb2JqZWN0IG9yIGFuIGFycmF5LlxuICpcbiAqIEBwYXJhbSBpIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGkgaXMgYW4gb2JqZWN0IG9yIGFuIGFycmF5IGFzIGRldGVybWluZWQgYnkgYHR5cGVOYW1lYFxuICovXG5mdW5jdGlvbiBpc0l0ZXJhYmxlKGkpIHtcbiAgdmFyIHR5cGUgPSB0eXBlTmFtZShpKTtcbiAgcmV0dXJuIHR5cGUgPT09ICdvYmplY3QnIHx8IHR5cGUgPT09ICdhcnJheSc7XG59XG5cbi8qXG4gKiBpc0Vycm9yIC0gY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgb2YgYW4gZXJyb3IgdHlwZVxuICpcbiAqIEBwYXJhbSBlIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGUgaXMgYW4gZXJyb3JcbiAqL1xuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIC8vIERldGVjdCBib3RoIEVycm9yIGFuZCBGaXJlZm94IEV4Y2VwdGlvbiB0eXBlXG4gIHJldHVybiBpc1R5cGUoZSwgJ2Vycm9yJykgfHwgaXNUeXBlKGUsICdleGNlcHRpb24nKTtcbn1cblxuLyogaXNQcm9taXNlIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBhIHByb21pc2VcbiAqXG4gKiBAcGFyYW0gcCAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBmIGlzIGEgZnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1Byb21pc2UocCkge1xuICByZXR1cm4gaXNPYmplY3QocCkgJiYgaXNUeXBlKHAudGhlbiwgJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogaXNCcm93c2VyIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgdGhlIGNvZGUgaXMgcnVubmluZyBpbiBhIGJyb3dzZXJcbiAqXG4gKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBjb2RlIGlzIHJ1bm5pbmcgaW4gYSBicm93c2VyIGVudmlyb25tZW50XG4gKi9cbmZ1bmN0aW9uIGlzQnJvd3NlcigpIHtcbiAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xufVxuXG5mdW5jdGlvbiByZWRhY3QoKSB7XG4gIHJldHVybiAnKioqKioqKionO1xufVxuXG4vLyBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzg4MDk0NzIvMTEzODE5MVxuZnVuY3Rpb24gdXVpZDQoKSB7XG4gIHZhciBkID0gbm93KCk7XG4gIHZhciB1dWlkID0gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZShcbiAgICAvW3h5XS9nLFxuICAgIGZ1bmN0aW9uIChjKSB7XG4gICAgICB2YXIgciA9IChkICsgTWF0aC5yYW5kb20oKSAqIDE2KSAlIDE2IHwgMDtcbiAgICAgIGQgPSBNYXRoLmZsb29yKGQgLyAxNik7XG4gICAgICByZXR1cm4gKGMgPT09ICd4JyA/IHIgOiAociAmIDB4NykgfCAweDgpLnRvU3RyaW5nKDE2KTtcbiAgICB9LFxuICApO1xuICByZXR1cm4gdXVpZDtcbn1cblxudmFyIExFVkVMUyA9IHtcbiAgZGVidWc6IDAsXG4gIGluZm86IDEsXG4gIHdhcm5pbmc6IDIsXG4gIGVycm9yOiAzLFxuICBjcml0aWNhbDogNCxcbn07XG5cbmZ1bmN0aW9uIHNhbml0aXplVXJsKHVybCkge1xuICB2YXIgYmFzZVVybFBhcnRzID0gcGFyc2VVcmkodXJsKTtcbiAgaWYgKCFiYXNlVXJsUGFydHMpIHtcbiAgICByZXR1cm4gJyh1bmtub3duKSc7XG4gIH1cblxuICAvLyByZW1vdmUgYSB0cmFpbGluZyAjIGlmIHRoZXJlIGlzIG5vIGFuY2hvclxuICBpZiAoYmFzZVVybFBhcnRzLmFuY2hvciA9PT0gJycpIHtcbiAgICBiYXNlVXJsUGFydHMuc291cmNlID0gYmFzZVVybFBhcnRzLnNvdXJjZS5yZXBsYWNlKCcjJywgJycpO1xuICB9XG5cbiAgdXJsID0gYmFzZVVybFBhcnRzLnNvdXJjZS5yZXBsYWNlKCc/JyArIGJhc2VVcmxQYXJ0cy5xdWVyeSwgJycpO1xuICByZXR1cm4gdXJsO1xufVxuXG52YXIgcGFyc2VVcmlPcHRpb25zID0ge1xuICBzdHJpY3RNb2RlOiBmYWxzZSxcbiAga2V5OiBbXG4gICAgJ3NvdXJjZScsXG4gICAgJ3Byb3RvY29sJyxcbiAgICAnYXV0aG9yaXR5JyxcbiAgICAndXNlckluZm8nLFxuICAgICd1c2VyJyxcbiAgICAncGFzc3dvcmQnLFxuICAgICdob3N0JyxcbiAgICAncG9ydCcsXG4gICAgJ3JlbGF0aXZlJyxcbiAgICAncGF0aCcsXG4gICAgJ2RpcmVjdG9yeScsXG4gICAgJ2ZpbGUnLFxuICAgICdxdWVyeScsXG4gICAgJ2FuY2hvcicsXG4gIF0sXG4gIHE6IHtcbiAgICBuYW1lOiAncXVlcnlLZXknLFxuICAgIHBhcnNlcjogLyg/Ol58JikoW14mPV0qKT0/KFteJl0qKS9nLFxuICB9LFxuICBwYXJzZXI6IHtcbiAgICBzdHJpY3Q6XG4gICAgICAvXig/OihbXjpcXC8/I10rKTopPyg/OlxcL1xcLygoPzooKFteOkBdKikoPzo6KFteOkBdKikpPyk/QCk/KFteOlxcLz8jXSopKD86OihcXGQqKSk/KSk/KCgoKD86W14/I1xcL10qXFwvKSopKFtePyNdKikpKD86XFw/KFteI10qKSk/KD86IyguKikpPykvLFxuICAgIGxvb3NlOlxuICAgICAgL14oPzooPyFbXjpAXSs6W146QFxcL10qQCkoW146XFwvPyMuXSspOik/KD86XFwvXFwvKT8oKD86KChbXjpAXSopKD86OihbXjpAXSopKT8pP0ApPyhbXjpcXC8/I10qKSg/OjooXFxkKikpPykoKChcXC8oPzpbXj8jXSg/IVtePyNcXC9dKlxcLltePyNcXC8uXSsoPzpbPyNdfCQpKSkqXFwvPyk/KFtePyNcXC9dKikpKD86XFw/KFteI10qKSk/KD86IyguKikpPykvLFxuICB9LFxufTtcblxuZnVuY3Rpb24gcGFyc2VVcmkoc3RyKSB7XG4gIGlmICghaXNUeXBlKHN0ciwgJ3N0cmluZycpKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHZhciBvID0gcGFyc2VVcmlPcHRpb25zO1xuICB2YXIgbSA9IG8ucGFyc2VyW28uc3RyaWN0TW9kZSA/ICdzdHJpY3QnIDogJ2xvb3NlJ10uZXhlYyhzdHIpO1xuICB2YXIgdXJpID0ge307XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBvLmtleS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICB1cmlbby5rZXlbaV1dID0gbVtpXSB8fCAnJztcbiAgfVxuXG4gIHVyaVtvLnEubmFtZV0gPSB7fTtcbiAgdXJpW28ua2V5WzEyXV0ucmVwbGFjZShvLnEucGFyc2VyLCBmdW5jdGlvbiAoJDAsICQxLCAkMikge1xuICAgIGlmICgkMSkge1xuICAgICAgdXJpW28ucS5uYW1lXVskMV0gPSAkMjtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB1cmk7XG59XG5cbmZ1bmN0aW9uIGFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoKGFjY2Vzc1Rva2VuLCBvcHRpb25zLCBwYXJhbXMpIHtcbiAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICBwYXJhbXMuYWNjZXNzX3Rva2VuID0gYWNjZXNzVG9rZW47XG4gIHZhciBwYXJhbXNBcnJheSA9IFtdO1xuICB2YXIgaztcbiAgZm9yIChrIGluIHBhcmFtcykge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyYW1zLCBrKSkge1xuICAgICAgcGFyYW1zQXJyYXkucHVzaChbaywgcGFyYW1zW2tdXS5qb2luKCc9JykpO1xuICAgIH1cbiAgfVxuICB2YXIgcXVlcnkgPSAnPycgKyBwYXJhbXNBcnJheS5zb3J0KCkuam9pbignJicpO1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBvcHRpb25zLnBhdGggPSBvcHRpb25zLnBhdGggfHwgJyc7XG4gIHZhciBxcyA9IG9wdGlvbnMucGF0aC5pbmRleE9mKCc/Jyk7XG4gIHZhciBoID0gb3B0aW9ucy5wYXRoLmluZGV4T2YoJyMnKTtcbiAgdmFyIHA7XG4gIGlmIChxcyAhPT0gLTEgJiYgKGggPT09IC0xIHx8IGggPiBxcykpIHtcbiAgICBwID0gb3B0aW9ucy5wYXRoO1xuICAgIG9wdGlvbnMucGF0aCA9IHAuc3Vic3RyaW5nKDAsIHFzKSArIHF1ZXJ5ICsgJyYnICsgcC5zdWJzdHJpbmcocXMgKyAxKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoaCAhPT0gLTEpIHtcbiAgICAgIHAgPSBvcHRpb25zLnBhdGg7XG4gICAgICBvcHRpb25zLnBhdGggPSBwLnN1YnN0cmluZygwLCBoKSArIHF1ZXJ5ICsgcC5zdWJzdHJpbmcoaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMucGF0aCA9IG9wdGlvbnMucGF0aCArIHF1ZXJ5O1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBmb3JtYXRVcmwodSwgcHJvdG9jb2wpIHtcbiAgcHJvdG9jb2wgPSBwcm90b2NvbCB8fCB1LnByb3RvY29sO1xuICBpZiAoIXByb3RvY29sICYmIHUucG9ydCkge1xuICAgIGlmICh1LnBvcnQgPT09IDgwKSB7XG4gICAgICBwcm90b2NvbCA9ICdodHRwOic7XG4gICAgfSBlbHNlIGlmICh1LnBvcnQgPT09IDQ0Mykge1xuICAgICAgcHJvdG9jb2wgPSAnaHR0cHM6JztcbiAgICB9XG4gIH1cbiAgcHJvdG9jb2wgPSBwcm90b2NvbCB8fCAnaHR0cHM6JztcblxuICBpZiAoIXUuaG9zdG5hbWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2YXIgcmVzdWx0ID0gcHJvdG9jb2wgKyAnLy8nICsgdS5ob3N0bmFtZTtcbiAgaWYgKHUucG9ydCkge1xuICAgIHJlc3VsdCA9IHJlc3VsdCArICc6JyArIHUucG9ydDtcbiAgfVxuICBpZiAodS5wYXRoKSB7XG4gICAgcmVzdWx0ID0gcmVzdWx0ICsgdS5wYXRoO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeShvYmosIGJhY2t1cCkge1xuICB2YXIgdmFsdWUsIGVycm9yO1xuICB0cnkge1xuICAgIHZhbHVlID0gUm9sbGJhckpTT04uc3RyaW5naWZ5KG9iaik7XG4gIH0gY2F0Y2ggKGpzb25FcnJvcikge1xuICAgIGlmIChiYWNrdXAgJiYgaXNGdW5jdGlvbihiYWNrdXApKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IGJhY2t1cChvYmopO1xuICAgICAgfSBjYXRjaCAoYmFja3VwRXJyb3IpIHtcbiAgICAgICAgZXJyb3IgPSBiYWNrdXBFcnJvcjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZXJyb3IgPSBqc29uRXJyb3I7XG4gICAgfVxuICB9XG4gIHJldHVybiB7IGVycm9yOiBlcnJvciwgdmFsdWU6IHZhbHVlIH07XG59XG5cbmZ1bmN0aW9uIG1heEJ5dGVTaXplKHN0cmluZykge1xuICAvLyBUaGUgdHJhbnNwb3J0IHdpbGwgdXNlIHV0Zi04LCBzbyBhc3N1bWUgdXRmLTggZW5jb2RpbmcuXG4gIC8vXG4gIC8vIFRoaXMgbWluaW1hbCBpbXBsZW1lbnRhdGlvbiB3aWxsIGFjY3VyYXRlbHkgY291bnQgYnl0ZXMgZm9yIGFsbCBVQ1MtMiBhbmRcbiAgLy8gc2luZ2xlIGNvZGUgcG9pbnQgVVRGLTE2LiBJZiBwcmVzZW50ZWQgd2l0aCBtdWx0aSBjb2RlIHBvaW50IFVURi0xNixcbiAgLy8gd2hpY2ggc2hvdWxkIGJlIHJhcmUsIGl0IHdpbGwgc2FmZWx5IG92ZXJjb3VudCwgbm90IHVuZGVyY291bnQuXG4gIC8vXG4gIC8vIFdoaWxlIHJvYnVzdCB1dGYtOCBlbmNvZGVycyBleGlzdCwgdGhpcyBpcyBmYXIgc21hbGxlciBhbmQgZmFyIG1vcmUgcGVyZm9ybWFudC5cbiAgLy8gRm9yIHF1aWNrbHkgY291bnRpbmcgcGF5bG9hZCBzaXplIGZvciB0cnVuY2F0aW9uLCBzbWFsbGVyIGlzIGJldHRlci5cblxuICB2YXIgY291bnQgPSAwO1xuICB2YXIgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGNvZGUgPSBzdHJpbmcuY2hhckNvZGVBdChpKTtcbiAgICBpZiAoY29kZSA8IDEyOCkge1xuICAgICAgLy8gdXAgdG8gNyBiaXRzXG4gICAgICBjb3VudCA9IGNvdW50ICsgMTtcbiAgICB9IGVsc2UgaWYgKGNvZGUgPCAyMDQ4KSB7XG4gICAgICAvLyB1cCB0byAxMSBiaXRzXG4gICAgICBjb3VudCA9IGNvdW50ICsgMjtcbiAgICB9IGVsc2UgaWYgKGNvZGUgPCA2NTUzNikge1xuICAgICAgLy8gdXAgdG8gMTYgYml0c1xuICAgICAgY291bnQgPSBjb3VudCArIDM7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvdW50O1xufVxuXG5mdW5jdGlvbiBqc29uUGFyc2Uocykge1xuICB2YXIgdmFsdWUsIGVycm9yO1xuICB0cnkge1xuICAgIHZhbHVlID0gUm9sbGJhckpTT04ucGFyc2Uocyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBlcnJvciA9IGU7XG4gIH1cbiAgcmV0dXJuIHsgZXJyb3I6IGVycm9yLCB2YWx1ZTogdmFsdWUgfTtcbn1cblxuZnVuY3Rpb24gbWFrZVVuaGFuZGxlZFN0YWNrSW5mbyhcbiAgbWVzc2FnZSxcbiAgdXJsLFxuICBsaW5lbm8sXG4gIGNvbG5vLFxuICBlcnJvcixcbiAgbW9kZSxcbiAgYmFja3VwTWVzc2FnZSxcbiAgZXJyb3JQYXJzZXIsXG4pIHtcbiAgdmFyIGxvY2F0aW9uID0ge1xuICAgIHVybDogdXJsIHx8ICcnLFxuICAgIGxpbmU6IGxpbmVubyxcbiAgICBjb2x1bW46IGNvbG5vLFxuICB9O1xuICBsb2NhdGlvbi5mdW5jID0gZXJyb3JQYXJzZXIuZ3Vlc3NGdW5jdGlvbk5hbWUobG9jYXRpb24udXJsLCBsb2NhdGlvbi5saW5lKTtcbiAgbG9jYXRpb24uY29udGV4dCA9IGVycm9yUGFyc2VyLmdhdGhlckNvbnRleHQobG9jYXRpb24udXJsLCBsb2NhdGlvbi5saW5lKTtcbiAgdmFyIGhyZWYgPVxuICAgIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICBkb2N1bWVudCAmJlxuICAgIGRvY3VtZW50LmxvY2F0aW9uICYmXG4gICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZjtcbiAgdmFyIHVzZXJhZ2VudCA9XG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB3aW5kb3cgJiZcbiAgICB3aW5kb3cubmF2aWdhdG9yICYmXG4gICAgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gIHJldHVybiB7XG4gICAgbW9kZTogbW9kZSxcbiAgICBtZXNzYWdlOiBlcnJvciA/IFN0cmluZyhlcnJvcikgOiBtZXNzYWdlIHx8IGJhY2t1cE1lc3NhZ2UsXG4gICAgdXJsOiBocmVmLFxuICAgIHN0YWNrOiBbbG9jYXRpb25dLFxuICAgIHVzZXJhZ2VudDogdXNlcmFnZW50LFxuICB9O1xufVxuXG5mdW5jdGlvbiB3cmFwQ2FsbGJhY2sobG9nZ2VyLCBmKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgdHJ5IHtcbiAgICAgIGYoZXJyLCByZXNwKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoZSk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBub25DaXJjdWxhckNsb25lKG9iaikge1xuICB2YXIgc2VlbiA9IFtvYmpdO1xuXG4gIGZ1bmN0aW9uIGNsb25lKG9iaiwgc2Vlbikge1xuICAgIHZhciB2YWx1ZSxcbiAgICAgIG5hbWUsXG4gICAgICBuZXdTZWVuLFxuICAgICAgcmVzdWx0ID0ge307XG5cbiAgICB0cnkge1xuICAgICAgZm9yIChuYW1lIGluIG9iaikge1xuICAgICAgICB2YWx1ZSA9IG9ialtuYW1lXTtcblxuICAgICAgICBpZiAodmFsdWUgJiYgKGlzVHlwZSh2YWx1ZSwgJ29iamVjdCcpIHx8IGlzVHlwZSh2YWx1ZSwgJ2FycmF5JykpKSB7XG4gICAgICAgICAgaWYgKHNlZW4uaW5jbHVkZXModmFsdWUpKSB7XG4gICAgICAgICAgICByZXN1bHRbbmFtZV0gPSAnUmVtb3ZlZCBjaXJjdWxhciByZWZlcmVuY2U6ICcgKyB0eXBlTmFtZSh2YWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld1NlZW4gPSBzZWVuLnNsaWNlKCk7XG4gICAgICAgICAgICBuZXdTZWVuLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgcmVzdWx0W25hbWVdID0gY2xvbmUodmFsdWUsIG5ld1NlZW4pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdFtuYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlc3VsdCA9ICdGYWlsZWQgY2xvbmluZyBjdXN0b20gZGF0YTogJyArIGUubWVzc2FnZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICByZXR1cm4gY2xvbmUob2JqLCBzZWVuKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlSXRlbShhcmdzLCBsb2dnZXIsIG5vdGlmaWVyLCByZXF1ZXN0S2V5cywgbGFtYmRhQ29udGV4dCkge1xuICB2YXIgbWVzc2FnZSwgZXJyLCBjdXN0b20sIGNhbGxiYWNrLCByZXF1ZXN0O1xuICB2YXIgYXJnO1xuICB2YXIgZXh0cmFBcmdzID0gW107XG4gIHZhciBkaWFnbm9zdGljID0ge307XG4gIHZhciBhcmdUeXBlcyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJncy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBhcmcgPSBhcmdzW2ldO1xuXG4gICAgdmFyIHR5cCA9IHR5cGVOYW1lKGFyZyk7XG4gICAgYXJnVHlwZXMucHVzaCh0eXApO1xuICAgIHN3aXRjaCAodHlwKSB7XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIG1lc3NhZ2UgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKG1lc3NhZ2UgPSBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgY2FsbGJhY2sgPSB3cmFwQ2FsbGJhY2sobG9nZ2VyLCBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICBleHRyYUFyZ3MucHVzaChhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgIGNhc2UgJ2RvbWV4Y2VwdGlvbic6XG4gICAgICBjYXNlICdleGNlcHRpb24nOiAvLyBGaXJlZm94IEV4Y2VwdGlvbiB0eXBlXG4gICAgICAgIGVyciA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoZXJyID0gYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgY2FzZSAnYXJyYXknOlxuICAgICAgICBpZiAoXG4gICAgICAgICAgYXJnIGluc3RhbmNlb2YgRXJyb3IgfHxcbiAgICAgICAgICAodHlwZW9mIERPTUV4Y2VwdGlvbiAhPT0gJ3VuZGVmaW5lZCcgJiYgYXJnIGluc3RhbmNlb2YgRE9NRXhjZXB0aW9uKVxuICAgICAgICApIHtcbiAgICAgICAgICBlcnIgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGVyciA9IGFyZyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlcXVlc3RLZXlzICYmIHR5cCA9PT0gJ29iamVjdCcgJiYgIXJlcXVlc3QpIHtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMCwgbGVuID0gcmVxdWVzdEtleXMubGVuZ3RoOyBqIDwgbGVuOyArK2opIHtcbiAgICAgICAgICAgIGlmIChhcmdbcmVxdWVzdEtleXNbal1dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgcmVxdWVzdCA9IGFyZztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXF1ZXN0KSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY3VzdG9tID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChjdXN0b20gPSBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChcbiAgICAgICAgICBhcmcgaW5zdGFuY2VvZiBFcnJvciB8fFxuICAgICAgICAgICh0eXBlb2YgRE9NRXhjZXB0aW9uICE9PSAndW5kZWZpbmVkJyAmJiBhcmcgaW5zdGFuY2VvZiBET01FeGNlcHRpb24pXG4gICAgICAgICkge1xuICAgICAgICAgIGVyciA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoZXJyID0gYXJnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBleHRyYUFyZ3MucHVzaChhcmcpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIGN1c3RvbSBpcyBhbiBhcnJheSB0aGlzIHR1cm5zIGl0IGludG8gYW4gb2JqZWN0IHdpdGggaW50ZWdlciBrZXlzXG4gIGlmIChjdXN0b20pIGN1c3RvbSA9IG5vbkNpcmN1bGFyQ2xvbmUoY3VzdG9tKTtcblxuICBpZiAoZXh0cmFBcmdzLmxlbmd0aCA+IDApIHtcbiAgICBpZiAoIWN1c3RvbSkgY3VzdG9tID0gbm9uQ2lyY3VsYXJDbG9uZSh7fSk7XG4gICAgY3VzdG9tLmV4dHJhQXJncyA9IG5vbkNpcmN1bGFyQ2xvbmUoZXh0cmFBcmdzKTtcbiAgfVxuXG4gIHZhciBpdGVtID0ge1xuICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgZXJyOiBlcnIsXG4gICAgY3VzdG9tOiBjdXN0b20sXG4gICAgdGltZXN0YW1wOiBub3coKSxcbiAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgbm90aWZpZXI6IG5vdGlmaWVyLFxuICAgIGRpYWdub3N0aWM6IGRpYWdub3N0aWMsXG4gICAgdXVpZDogdXVpZDQoKSxcbiAgfTtcblxuICBpdGVtLmRhdGEgPSBpdGVtLmRhdGEgfHwge307XG5cbiAgc2V0Q3VzdG9tSXRlbUtleXMoaXRlbSwgY3VzdG9tKTtcblxuICBpZiAocmVxdWVzdEtleXMgJiYgcmVxdWVzdCkge1xuICAgIGl0ZW0ucmVxdWVzdCA9IHJlcXVlc3Q7XG4gIH1cbiAgaWYgKGxhbWJkYUNvbnRleHQpIHtcbiAgICBpdGVtLmxhbWJkYUNvbnRleHQgPSBsYW1iZGFDb250ZXh0O1xuICB9XG4gIGl0ZW0uX29yaWdpbmFsQXJncyA9IGFyZ3M7XG4gIGl0ZW0uZGlhZ25vc3RpYy5vcmlnaW5hbF9hcmdfdHlwZXMgPSBhcmdUeXBlcztcbiAgcmV0dXJuIGl0ZW07XG59XG5cbmZ1bmN0aW9uIHNldEN1c3RvbUl0ZW1LZXlzKGl0ZW0sIGN1c3RvbSkge1xuICBpZiAoY3VzdG9tICYmIGN1c3RvbS5sZXZlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaXRlbS5sZXZlbCA9IGN1c3RvbS5sZXZlbDtcbiAgICBkZWxldGUgY3VzdG9tLmxldmVsO1xuICB9XG4gIGlmIChjdXN0b20gJiYgY3VzdG9tLnNraXBGcmFtZXMgIT09IHVuZGVmaW5lZCkge1xuICAgIGl0ZW0uc2tpcEZyYW1lcyA9IGN1c3RvbS5za2lwRnJhbWVzO1xuICAgIGRlbGV0ZSBjdXN0b20uc2tpcEZyYW1lcztcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRFcnJvckNvbnRleHQoaXRlbSwgZXJyb3JzKSB7XG4gIHZhciBjdXN0b20gPSBpdGVtLmRhdGEuY3VzdG9tIHx8IHt9O1xuICB2YXIgY29udGV4dEFkZGVkID0gZmFsc2U7XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVycm9ycy5sZW5ndGg7ICsraSkge1xuICAgICAgaWYgKGVycm9yc1tpXS5oYXNPd25Qcm9wZXJ0eSgncm9sbGJhckNvbnRleHQnKSkge1xuICAgICAgICBjdXN0b20gPSBtZXJnZShjdXN0b20sIG5vbkNpcmN1bGFyQ2xvbmUoZXJyb3JzW2ldLnJvbGxiYXJDb250ZXh0KSk7XG4gICAgICAgIGNvbnRleHRBZGRlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXZvaWQgYWRkaW5nIGFuIGVtcHR5IG9iamVjdCB0byB0aGUgZGF0YS5cbiAgICBpZiAoY29udGV4dEFkZGVkKSB7XG4gICAgICBpdGVtLmRhdGEuY3VzdG9tID0gY3VzdG9tO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGl0ZW0uZGlhZ25vc3RpYy5lcnJvcl9jb250ZXh0ID0gJ0ZhaWxlZDogJyArIGUubWVzc2FnZTtcbiAgfVxufVxuXG52YXIgVEVMRU1FVFJZX1RZUEVTID0gW1xuICAnbG9nJyxcbiAgJ25ldHdvcmsnLFxuICAnZG9tJyxcbiAgJ25hdmlnYXRpb24nLFxuICAnZXJyb3InLFxuICAnbWFudWFsJyxcbl07XG52YXIgVEVMRU1FVFJZX0xFVkVMUyA9IFsnY3JpdGljYWwnLCAnZXJyb3InLCAnd2FybmluZycsICdpbmZvJywgJ2RlYnVnJ107XG5cbmZ1bmN0aW9uIGFycmF5SW5jbHVkZXMoYXJyLCB2YWwpIHtcbiAgZm9yICh2YXIgayA9IDA7IGsgPCBhcnIubGVuZ3RoOyArK2spIHtcbiAgICBpZiAoYXJyW2tdID09PSB2YWwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVGVsZW1ldHJ5RXZlbnQoYXJncykge1xuICB2YXIgdHlwZSwgbWV0YWRhdGEsIGxldmVsO1xuICB2YXIgYXJnO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJncy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBhcmcgPSBhcmdzW2ldO1xuXG4gICAgdmFyIHR5cCA9IHR5cGVOYW1lKGFyZyk7XG4gICAgc3dpdGNoICh0eXApIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIGlmICghdHlwZSAmJiBhcnJheUluY2x1ZGVzKFRFTEVNRVRSWV9UWVBFUywgYXJnKSkge1xuICAgICAgICAgIHR5cGUgPSBhcmc7XG4gICAgICAgIH0gZWxzZSBpZiAoIWxldmVsICYmIGFycmF5SW5jbHVkZXMoVEVMRU1FVFJZX0xFVkVMUywgYXJnKSkge1xuICAgICAgICAgIGxldmVsID0gYXJnO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgbWV0YWRhdGEgPSBhcmc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHZhciBldmVudCA9IHtcbiAgICB0eXBlOiB0eXBlIHx8ICdtYW51YWwnLFxuICAgIG1ldGFkYXRhOiBtZXRhZGF0YSB8fCB7fSxcbiAgICBsZXZlbDogbGV2ZWwsXG4gIH07XG5cbiAgcmV0dXJuIGV2ZW50O1xufVxuXG5mdW5jdGlvbiBhZGRJdGVtQXR0cmlidXRlcyhpdGVtLCBhdHRyaWJ1dGVzKSB7XG4gIGl0ZW0uZGF0YS5hdHRyaWJ1dGVzID0gaXRlbS5kYXRhLmF0dHJpYnV0ZXMgfHwgW107XG4gIGlmIChhdHRyaWJ1dGVzKSB7XG4gICAgaXRlbS5kYXRhLmF0dHJpYnV0ZXMucHVzaCguLi5hdHRyaWJ1dGVzKTtcbiAgfVxufVxuXG4vKlxuICogZ2V0IC0gZ2l2ZW4gYW4gb2JqL2FycmF5IGFuZCBhIGtleXBhdGgsIHJldHVybiB0aGUgdmFsdWUgYXQgdGhhdCBrZXlwYXRoIG9yXG4gKiAgICAgICB1bmRlZmluZWQgaWYgbm90IHBvc3NpYmxlLlxuICpcbiAqIEBwYXJhbSBvYmogLSBhbiBvYmplY3Qgb3IgYXJyYXlcbiAqIEBwYXJhbSBwYXRoIC0gYSBzdHJpbmcgb2Yga2V5cyBzZXBhcmF0ZWQgYnkgJy4nIHN1Y2ggYXMgJ3BsdWdpbi5qcXVlcnkuMC5tZXNzYWdlJ1xuICogICAgd2hpY2ggd291bGQgY29ycmVzcG9uZCB0byA0MiBpbiBge3BsdWdpbjoge2pxdWVyeTogW3ttZXNzYWdlOiA0Mn1dfX1gXG4gKi9cbmZ1bmN0aW9uIGdldChvYmosIHBhdGgpIHtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHZhciBrZXlzID0gcGF0aC5zcGxpdCgnLicpO1xuICB2YXIgcmVzdWx0ID0gb2JqO1xuICB0cnkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBrZXlzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICByZXN1bHQgPSByZXN1bHRba2V5c1tpXV07XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgcmVzdWx0ID0gdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHNldChvYmosIHBhdGgsIHZhbHVlKSB7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBrZXlzID0gcGF0aC5zcGxpdCgnLicpO1xuICB2YXIgbGVuID0ga2V5cy5sZW5ndGg7XG4gIGlmIChsZW4gPCAxKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChsZW4gPT09IDEpIHtcbiAgICBvYmpba2V5c1swXV0gPSB2YWx1ZTtcbiAgICByZXR1cm47XG4gIH1cbiAgdHJ5IHtcbiAgICB2YXIgdGVtcCA9IG9ialtrZXlzWzBdXSB8fCB7fTtcbiAgICB2YXIgcmVwbGFjZW1lbnQgPSB0ZW1wO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbGVuIC0gMTsgKytpKSB7XG4gICAgICB0ZW1wW2tleXNbaV1dID0gdGVtcFtrZXlzW2ldXSB8fCB7fTtcbiAgICAgIHRlbXAgPSB0ZW1wW2tleXNbaV1dO1xuICAgIH1cbiAgICB0ZW1wW2tleXNbbGVuIC0gMV1dID0gdmFsdWU7XG4gICAgb2JqW2tleXNbMF1dID0gcmVwbGFjZW1lbnQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm47XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0QXJnc0FzU3RyaW5nKGFyZ3MpIHtcbiAgdmFyIGksIGxlbiwgYXJnO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAoaSA9IDAsIGxlbiA9IGFyZ3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBhcmcgPSBhcmdzW2ldO1xuICAgIHN3aXRjaCAodHlwZU5hbWUoYXJnKSkge1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgYXJnID0gc3RyaW5naWZ5KGFyZyk7XG4gICAgICAgIGFyZyA9IGFyZy5lcnJvciB8fCBhcmcudmFsdWU7XG4gICAgICAgIGlmIChhcmcubGVuZ3RoID4gNTAwKSB7XG4gICAgICAgICAgYXJnID0gYXJnLnN1YnN0cigwLCA0OTcpICsgJy4uLic7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdudWxsJzpcbiAgICAgICAgYXJnID0gJ251bGwnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgIGFyZyA9ICd1bmRlZmluZWQnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N5bWJvbCc6XG4gICAgICAgIGFyZyA9IGFyZy50b1N0cmluZygpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmVzdWx0LnB1c2goYXJnKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0LmpvaW4oJyAnKTtcbn1cblxuZnVuY3Rpb24gbm93KCkge1xuICBpZiAoRGF0ZS5ub3cpIHtcbiAgICByZXR1cm4gK0RhdGUubm93KCk7XG4gIH1cbiAgcmV0dXJuICtuZXcgRGF0ZSgpO1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJJcChyZXF1ZXN0RGF0YSwgY2FwdHVyZUlwKSB7XG4gIGlmICghcmVxdWVzdERhdGEgfHwgIXJlcXVlc3REYXRhWyd1c2VyX2lwJ10gfHwgY2FwdHVyZUlwID09PSB0cnVlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuZXdJcCA9IHJlcXVlc3REYXRhWyd1c2VyX2lwJ107XG4gIGlmICghY2FwdHVyZUlwKSB7XG4gICAgbmV3SXAgPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIHRyeSB7XG4gICAgICB2YXIgcGFydHM7XG4gICAgICBpZiAobmV3SXAuaW5kZXhPZignLicpICE9PSAtMSkge1xuICAgICAgICBwYXJ0cyA9IG5ld0lwLnNwbGl0KCcuJyk7XG4gICAgICAgIHBhcnRzLnBvcCgpO1xuICAgICAgICBwYXJ0cy5wdXNoKCcwJyk7XG4gICAgICAgIG5ld0lwID0gcGFydHMuam9pbignLicpO1xuICAgICAgfSBlbHNlIGlmIChuZXdJcC5pbmRleE9mKCc6JykgIT09IC0xKSB7XG4gICAgICAgIHBhcnRzID0gbmV3SXAuc3BsaXQoJzonKTtcbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICB2YXIgYmVnaW5uaW5nID0gcGFydHMuc2xpY2UoMCwgMyk7XG4gICAgICAgICAgdmFyIHNsYXNoSWR4ID0gYmVnaW5uaW5nWzJdLmluZGV4T2YoJy8nKTtcbiAgICAgICAgICBpZiAoc2xhc2hJZHggIT09IC0xKSB7XG4gICAgICAgICAgICBiZWdpbm5pbmdbMl0gPSBiZWdpbm5pbmdbMl0uc3Vic3RyaW5nKDAsIHNsYXNoSWR4KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHRlcm1pbmFsID0gJzAwMDA6MDAwMDowMDAwOjAwMDA6MDAwMCc7XG4gICAgICAgICAgbmV3SXAgPSBiZWdpbm5pbmcuY29uY2F0KHRlcm1pbmFsKS5qb2luKCc6Jyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0lwID0gbnVsbDtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBuZXdJcCA9IG51bGw7XG4gICAgfVxuICB9XG4gIHJlcXVlc3REYXRhWyd1c2VyX2lwJ10gPSBuZXdJcDtcbn1cblxuZnVuY3Rpb24gaGFuZGxlT3B0aW9ucyhjdXJyZW50LCBpbnB1dCwgcGF5bG9hZCwgbG9nZ2VyKSB7XG4gIHZhciByZXN1bHQgPSBtZXJnZShjdXJyZW50LCBpbnB1dCwgcGF5bG9hZCk7XG4gIHJlc3VsdCA9IHVwZGF0ZURlcHJlY2F0ZWRPcHRpb25zKHJlc3VsdCwgbG9nZ2VyKTtcbiAgaWYgKCFpbnB1dCB8fCBpbnB1dC5vdmVyd3JpdGVTY3J1YkZpZWxkcykge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgaWYgKGlucHV0LnNjcnViRmllbGRzKSB7XG4gICAgcmVzdWx0LnNjcnViRmllbGRzID0gKGN1cnJlbnQuc2NydWJGaWVsZHMgfHwgW10pLmNvbmNhdChpbnB1dC5zY3J1YkZpZWxkcyk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlRGVwcmVjYXRlZE9wdGlvbnMob3B0aW9ucywgbG9nZ2VyKSB7XG4gIGlmIChvcHRpb25zLmhvc3RXaGl0ZUxpc3QgJiYgIW9wdGlvbnMuaG9zdFNhZmVMaXN0KSB7XG4gICAgb3B0aW9ucy5ob3N0U2FmZUxpc3QgPSBvcHRpb25zLmhvc3RXaGl0ZUxpc3Q7XG4gICAgb3B0aW9ucy5ob3N0V2hpdGVMaXN0ID0gdW5kZWZpbmVkO1xuICAgIGxvZ2dlciAmJiBsb2dnZXIubG9nKCdob3N0V2hpdGVMaXN0IGlzIGRlcHJlY2F0ZWQuIFVzZSBob3N0U2FmZUxpc3QuJyk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaG9zdEJsYWNrTGlzdCAmJiAhb3B0aW9ucy5ob3N0QmxvY2tMaXN0KSB7XG4gICAgb3B0aW9ucy5ob3N0QmxvY2tMaXN0ID0gb3B0aW9ucy5ob3N0QmxhY2tMaXN0O1xuICAgIG9wdGlvbnMuaG9zdEJsYWNrTGlzdCA9IHVuZGVmaW5lZDtcbiAgICBsb2dnZXIgJiYgbG9nZ2VyLmxvZygnaG9zdEJsYWNrTGlzdCBpcyBkZXByZWNhdGVkLiBVc2UgaG9zdEJsb2NrTGlzdC4nKTtcbiAgfVxuICByZXR1cm4gb3B0aW9ucztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoOiBhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aCxcbiAgY3JlYXRlSXRlbTogY3JlYXRlSXRlbSxcbiAgYWRkRXJyb3JDb250ZXh0OiBhZGRFcnJvckNvbnRleHQsXG4gIGNyZWF0ZVRlbGVtZXRyeUV2ZW50OiBjcmVhdGVUZWxlbWV0cnlFdmVudCxcbiAgYWRkSXRlbUF0dHJpYnV0ZXM6IGFkZEl0ZW1BdHRyaWJ1dGVzLFxuICBmaWx0ZXJJcDogZmlsdGVySXAsXG4gIGZvcm1hdEFyZ3NBc1N0cmluZzogZm9ybWF0QXJnc0FzU3RyaW5nLFxuICBmb3JtYXRVcmw6IGZvcm1hdFVybCxcbiAgZ2V0OiBnZXQsXG4gIGhhbmRsZU9wdGlvbnM6IGhhbmRsZU9wdGlvbnMsXG4gIGlzRXJyb3I6IGlzRXJyb3IsXG4gIGlzRmluaXRlTnVtYmVyOiBpc0Zpbml0ZU51bWJlcixcbiAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgaXNJdGVyYWJsZTogaXNJdGVyYWJsZSxcbiAgaXNOYXRpdmVGdW5jdGlvbjogaXNOYXRpdmVGdW5jdGlvbixcbiAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICBpc1N0cmluZzogaXNTdHJpbmcsXG4gIGlzVHlwZTogaXNUeXBlLFxuICBpc1Byb21pc2U6IGlzUHJvbWlzZSxcbiAgaXNCcm93c2VyOiBpc0Jyb3dzZXIsXG4gIGpzb25QYXJzZToganNvblBhcnNlLFxuICBMRVZFTFM6IExFVkVMUyxcbiAgbWFrZVVuaGFuZGxlZFN0YWNrSW5mbzogbWFrZVVuaGFuZGxlZFN0YWNrSW5mbyxcbiAgbWVyZ2U6IG1lcmdlLFxuICBub3c6IG5vdyxcbiAgcmVkYWN0OiByZWRhY3QsXG4gIFJvbGxiYXJKU09OOiBSb2xsYmFySlNPTixcbiAgc2FuaXRpemVVcmw6IHNhbml0aXplVXJsLFxuICBzZXQ6IHNldCxcbiAgc2V0dXBKU09OOiBzZXR1cEpTT04sXG4gIHN0cmluZ2lmeTogc3RyaW5naWZ5LFxuICBtYXhCeXRlU2l6ZTogbWF4Qnl0ZVNpemUsXG4gIHR5cGVOYW1lOiB0eXBlTmFtZSxcbiAgdXVpZDQ6IHV1aWQ0LFxufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvKiBnbG9iYWxzIGV4cGVjdCAqL1xuLyogZ2xvYmFscyBkZXNjcmliZSAqL1xuLyogZ2xvYmFscyBpdCAqL1xuLyogZ2xvYmFscyBzaW5vbiAqL1xuXG52YXIgdSA9IHJlcXVpcmUoJy4uL3NyYy9hcGlVdGlsaXR5Jyk7XG52YXIgdXRpbGl0eSA9IHJlcXVpcmUoJy4uL3NyYy91dGlsaXR5Jyk7XG51dGlsaXR5LnNldHVwSlNPTigpO1xuXG5kZXNjcmliZSgnYnVpbGRQYXlsb2FkJywgZnVuY3Rpb24gKCkge1xuICBpdCgnc2hvdWxkIHBhY2thZ2UgdXAgdGhlIGlucHV0IGludG8gYSBwYXlsb2FkJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciB0b2tlbiA9ICdhYmMxMjMnO1xuICAgIHZhciBkYXRhID0geyBjb250ZXh0OiAnbm90IGFuIG9iamVjdCcsIG90aGVyOiAnc3R1ZmYnIH07XG4gICAgdmFyIHBheWxvYWQgPSB1LmJ1aWxkUGF5bG9hZChkYXRhKTtcblxuICAgIGV4cGVjdChwYXlsb2FkLmRhdGEpLnRvLmVxbChkYXRhKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgc3RyaW5naWZ5IGNvbnRleHQnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRva2VuID0gJ2FiYzEyMyc7XG4gICAgdmFyIGNvbnRleHQgPSB7IGE6IDEsIGI6ICdvdGhlcicgfTtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIGNvbnRleHQ6IGNvbnRleHQsXG4gICAgICBvdGhlcjogJ3N0dWZmJyxcbiAgICB9O1xuICAgIHZhciBwYXlsb2FkID0gdS5idWlsZFBheWxvYWQoZGF0YSk7XG5cbiAgICBleHBlY3QocGF5bG9hZC5kYXRhLmNvbnRleHQpLnRvLm5vdC5lcWwoY29udGV4dCk7XG4gICAgZXhwZWN0KHBheWxvYWQuZGF0YS5jb250ZXh0KS50by5lcWwoJ3tcImFcIjoxLFwiYlwiOlwib3RoZXJcIn0nKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgdHJ1bmNhdGUgY29udGV4dCcsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdG9rZW4gPSAnYWJjMTIzJztcbiAgICB2YXIgY29udGV4dCA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzU7IGkrKykge1xuICAgICAgY29udGV4dFtpXSA9IGk7XG4gICAgfVxuICAgIHZhciBkYXRhID0ge1xuICAgICAgY29udGV4dDogY29udGV4dCxcbiAgICAgIG90aGVyOiAnc3R1ZmYnLFxuICAgIH07XG4gICAgdmFyIHBheWxvYWQgPSB1LmJ1aWxkUGF5bG9hZChkYXRhKTtcblxuICAgIGV4cGVjdChwYXlsb2FkLmRhdGEuY29udGV4dCkudG8ubm90LmVxbChjb250ZXh0KTtcbiAgICBleHBlY3QocGF5bG9hZC5kYXRhLmNvbnRleHQubGVuZ3RoKS50by5lcWwoMjU1KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2dldFRyYW5zcG9ydEZyb21PcHRpb25zJywgZnVuY3Rpb24gKCkge1xuICBpdCgnc2hvdWxkIHVzZSBkZWZhdWx0cyB3aXRoIG5vdCBlbmRwb2ludCcsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIG5vdDogJ2VuZHBvaW50JyxcbiAgICAgIHByb3h5OiB7XG4gICAgICAgIGhvc3Q6ICd3aGF0dmVyLmNvbScsXG4gICAgICAgIHBvcnQ6IDkwOTAsXG4gICAgICB9LFxuICAgICAgdGltZW91dDogMzAwMCxcbiAgICB9O1xuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIGhvc3RuYW1lOiAnYXBpLmNvbScsXG4gICAgICBwcm90b2NvbDogJ2h0dHBzOicsXG4gICAgICBwYXRoOiAnL2FwaS8xJyxcbiAgICB9O1xuICAgIHZhciB1cmwgPSB7XG4gICAgICBwYXJzZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBleHBlY3QoZmFsc2UpLnRvLmJlLm9rKCk7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICAgIH0sXG4gICAgfTtcbiAgICB2YXIgdCA9IHUuZ2V0VHJhbnNwb3J0RnJvbU9wdGlvbnMob3B0aW9ucywgZGVmYXVsdHMsIHVybCk7XG4gICAgZXhwZWN0KHQuaG9zdG5hbWUpLnRvLmVxbChkZWZhdWx0cy5ob3N0bmFtZSk7XG4gICAgZXhwZWN0KHQucHJvdG9jb2wpLnRvLmVxbChkZWZhdWx0cy5wcm90b2NvbCk7XG4gICAgZXhwZWN0KHQucG9ydCkudG8uZXFsKGRlZmF1bHRzLnBvcnQpO1xuICAgIGV4cGVjdCh0LnByb3h5KS50by5lcWwob3B0aW9ucy5wcm94eSk7XG4gICAgZXhwZWN0KHQudGltZW91dCkudG8uZXFsKG9wdGlvbnMudGltZW91dCk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIHBhcnNlIHRoZSBlbmRwb2ludCBpZiBnaXZlbicsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIGVuZHBvaW50OiAnaHR0cDovL3doYXRldmVyLmNvbS9hcGkvNDInLFxuICAgICAgcHJveHk6IHtcbiAgICAgICAgaG9zdDogJ25vcGUuY29tJyxcbiAgICAgICAgcG9ydDogOTA5MCxcbiAgICAgIH0sXG4gICAgfTtcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICBob3N0bmFtZTogJ2FwaS5jb20nLFxuICAgICAgcHJvdG9jb2w6ICdodHRwczonLFxuICAgICAgcGF0aDogJy9hcGkvMScsXG4gICAgICBzZWFyY2g6ICc/YWJjPTQ1NicsXG4gICAgfTtcbiAgICB2YXIgdXJsID0ge1xuICAgICAgcGFyc2U6IGZ1bmN0aW9uIChlbmRwb2ludCkge1xuICAgICAgICBleHBlY3QoZW5kcG9pbnQpLnRvLmVxbChvcHRpb25zLmVuZHBvaW50KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBob3N0bmFtZTogJ3doYXRldmVyLmNvbScsXG4gICAgICAgICAgcHJvdG9jb2w6ICdodHRwOicsXG4gICAgICAgICAgcGF0aG5hbWU6ICcvYXBpLzQyJyxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgfTtcbiAgICB2YXIgdCA9IHUuZ2V0VHJhbnNwb3J0RnJvbU9wdGlvbnMob3B0aW9ucywgZGVmYXVsdHMsIHVybCk7XG4gICAgZXhwZWN0KHQuaG9zdG5hbWUpLnRvLm5vdC5lcWwoZGVmYXVsdHMuaG9zdG5hbWUpO1xuICAgIGV4cGVjdCh0Lmhvc3RuYW1lKS50by5lcWwoJ3doYXRldmVyLmNvbScpO1xuICAgIGV4cGVjdCh0LnByb3RvY29sKS50by5lcWwoJ2h0dHA6Jyk7XG4gICAgZXhwZWN0KHQuc2VhcmNoKS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QodC5wcm94eSkudG8uZXFsKG9wdGlvbnMucHJveHkpO1xuICAgIGV4cGVjdCh0LnRpbWVvdXQpLnRvLmVxbCh1bmRlZmluZWQpO1xuICB9KTtcbiAgZGVzY3JpYmUoJ2dldFRyYW5zcG9ydEZyb21PcHRpb25zJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIGhvc3RuYW1lOiAnYXBpLmNvbScsXG4gICAgICBwcm90b2NvbDogJ2h0dHBzOicsXG4gICAgICBwYXRoOiAnL2FwaS8xJyxcbiAgICAgIHNlYXJjaDogJz9hYmM9NDU2JyxcbiAgICB9O1xuICAgIHZhciB1cmwgPSB7XG4gICAgICBwYXJzZTogZnVuY3Rpb24gKF8pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBob3N0bmFtZTogJ3doYXRldmVyLmNvbScsXG4gICAgICAgICAgcHJvdG9jb2w6ICdodHRwOicsXG4gICAgICAgICAgcGF0aG5hbWU6ICcvYXBpLzQyJyxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgfTtcbiAgICBpdCgnc2hvdWxkIHVzZSB4aHIgYnkgZGVmYXVsdCcsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgICAgdmFyIHQgPSB1LmdldFRyYW5zcG9ydEZyb21PcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRzLCB1cmwpO1xuICAgICAgZXhwZWN0KHQudHJhbnNwb3J0KS50by5lcWwoJ3hocicpO1xuICAgICAgZG9uZSgpO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgdXNlIGZldGNoIHdoZW4gcmVxdWVzdGVkJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgIHZhciBvcHRpb25zID0geyBkZWZhdWx0VHJhbnNwb3J0OiAnZmV0Y2gnIH07XG4gICAgICB2YXIgdCA9IHUuZ2V0VHJhbnNwb3J0RnJvbU9wdGlvbnMob3B0aW9ucywgZGVmYXVsdHMsIHVybCk7XG4gICAgICBleHBlY3QodC50cmFuc3BvcnQpLnRvLmVxbCgnZmV0Y2gnKTtcbiAgICAgIGRvbmUoKTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIHVzZSB4aHIgd2hlbiByZXF1ZXN0ZWQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7IGRlZmF1bHRUcmFuc3BvcnQ6ICd4aHInIH07XG4gICAgICB2YXIgdCA9IHUuZ2V0VHJhbnNwb3J0RnJvbU9wdGlvbnMob3B0aW9ucywgZGVmYXVsdHMsIHVybCk7XG4gICAgICBleHBlY3QodC50cmFuc3BvcnQpLnRvLmVxbCgneGhyJyk7XG4gICAgICBkb25lKCk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCB1c2UgeGhyIHdoZW4gZmV0Y2ggaXMgdW5hdmFpbGFibGUnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7IGRlZmF1bHRUcmFuc3BvcnQ6ICdmZXRjaCcgfTtcbiAgICAgIHZhciBvbGRGZXRjaCA9IHdpbmRvdy5mZXRjaDtcbiAgICAgIHNlbGYuZmV0Y2ggPSB1bmRlZmluZWQ7XG4gICAgICB2YXIgdCA9IHUuZ2V0VHJhbnNwb3J0RnJvbU9wdGlvbnMob3B0aW9ucywgZGVmYXVsdHMsIHVybCk7XG4gICAgICBleHBlY3QodC50cmFuc3BvcnQpLnRvLmVxbCgneGhyJyk7XG4gICAgICBzZWxmLmZldGNoID0gb2xkRmV0Y2g7XG4gICAgICBkb25lKCk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCB1c2UgZmV0Y2ggd2hlbiB4aHIgaXMgdW5hdmFpbGFibGUnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7IGRlZmF1bHRUcmFuc3BvcnQ6ICd4aHInIH07XG4gICAgICB2YXIgb2xkWGhyID0gd2luZG93LlhNTEh0dHBSZXF1ZXN0O1xuICAgICAgc2VsZi5YTUxIdHRwUmVxdWVzdCA9IHVuZGVmaW5lZDtcbiAgICAgIHZhciB0ID0gdS5nZXRUcmFuc3BvcnRGcm9tT3B0aW9ucyhvcHRpb25zLCBkZWZhdWx0cywgdXJsKTtcbiAgICAgIGV4cGVjdCh0LnRyYW5zcG9ydCkudG8uZXFsKCdmZXRjaCcpO1xuICAgICAgc2VsZi5YTUxIdHRwUmVxdWVzdCA9IG9sZFhocjtcbiAgICAgIGRvbmUoKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ3RyYW5zcG9ydE9wdGlvbnMnLCBmdW5jdGlvbiAoKSB7XG4gIGl0KCdzaG91bGQgdXNlIHRoZSBnaXZlbiBkYXRhIGlmIG5vIHByb3h5JywgZnVuY3Rpb24gKCkge1xuICAgIHZhciB0cmFuc3BvcnQgPSB7XG4gICAgICBob3N0bmFtZTogJ2EuY29tJyxcbiAgICAgIHBhdGg6ICcvYXBpL3YxL2l0ZW0vJyxcbiAgICAgIHBvcnQ6IDUwMDAsXG4gICAgfTtcbiAgICB2YXIgbWV0aG9kID0gJ0dFVCc7XG5cbiAgICB2YXIgbyA9IHUudHJhbnNwb3J0T3B0aW9ucyh0cmFuc3BvcnQsIG1ldGhvZCk7XG4gICAgZXhwZWN0KG8ucHJvdG9jb2wpLnRvLmVxbCgnaHR0cHM6Jyk7XG4gICAgZXhwZWN0KG8uaG9zdG5hbWUpLnRvLmVxbCgnYS5jb20nKTtcbiAgICBleHBlY3Qoby5wYXRoKS50by5lcWwoJy9hcGkvdjEvaXRlbS8nKTtcbiAgICBleHBlY3Qoby5wb3J0KS50by5lcWwoNTAwMCk7XG4gICAgZXhwZWN0KG8ubWV0aG9kKS50by5lcWwobWV0aG9kKTtcbiAgICBleHBlY3Qoby50aW1lb3V0KS50by5lcWwodW5kZWZpbmVkKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgdXNlIHRoZSBwcm94eSBpZiBnaXZlbicsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdHJhbnNwb3J0ID0ge1xuICAgICAgaG9zdG5hbWU6ICdhLmNvbScsXG4gICAgICBwYXRoOiAnL2FwaS92MS9pdGVtLycsXG4gICAgICBwb3J0OiA1MDAwLFxuICAgICAgcHJveHk6IHtcbiAgICAgICAgaG9zdDogJ2IuY29tJyxcbiAgICAgICAgcG9ydDogODA4MCxcbiAgICAgIH0sXG4gICAgICB0aW1lb3V0OiAzMDAwLFxuICAgIH07XG4gICAgdmFyIG1ldGhvZCA9ICdHRVQnO1xuXG4gICAgdmFyIG8gPSB1LnRyYW5zcG9ydE9wdGlvbnModHJhbnNwb3J0LCBtZXRob2QpO1xuICAgIGV4cGVjdChvLnByb3RvY29sKS50by5lcWwoJ2h0dHBzOicpO1xuICAgIGV4cGVjdChvLmhvc3RuYW1lKS50by5lcWwoJ2IuY29tJyk7XG4gICAgZXhwZWN0KG8ucG9ydCkudG8uZXFsKDgwODApO1xuICAgIGV4cGVjdChvLnBhdGgpLnRvLmVxbCgnaHR0cHM6Ly9hLmNvbS9hcGkvdjEvaXRlbS8nKTtcbiAgICBleHBlY3Qoby5tZXRob2QpLnRvLmVxbChtZXRob2QpO1xuICAgIGV4cGVjdChvLnRpbWVvdXQpLnRvLmVxbCh0cmFuc3BvcnQudGltZW91dCk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdhcHBlbmRQYXRoVG9QYXRoJywgZnVuY3Rpb24gKCkge1xuICB2YXIgZXhwU2xhc2ggPSAnL2FwaS9pdGVtLyc7XG4gIHZhciBleHBOb1NsYXNoID0gJy9hcGkvaXRlbSc7XG4gIGl0KCdzaG91bGQgaGFuZGxlIHRyYWlsaW5nIHNsYXNoIGluIGJhc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJhc2UgPSAnL2FwaS8nO1xuICAgIGV4cGVjdCh1LmFwcGVuZFBhdGhUb1BhdGgoYmFzZSwgJy9pdGVtLycpKS50by5lcWwoZXhwU2xhc2gpO1xuICAgIGV4cGVjdCh1LmFwcGVuZFBhdGhUb1BhdGgoYmFzZSwgJy9pdGVtJykpLnRvLmVxbChleHBOb1NsYXNoKTtcbiAgICBleHBlY3QodS5hcHBlbmRQYXRoVG9QYXRoKGJhc2UsICdpdGVtLycpKS50by5lcWwoZXhwU2xhc2gpO1xuICAgIGV4cGVjdCh1LmFwcGVuZFBhdGhUb1BhdGgoYmFzZSwgJ2l0ZW0nKSkudG8uZXFsKGV4cE5vU2xhc2gpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBoYW5kbGUgbm8gdHJhaWxpbmcgc2xhc2ggaW4gYmFzZScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYmFzZSA9ICcvYXBpJztcbiAgICBleHBlY3QodS5hcHBlbmRQYXRoVG9QYXRoKGJhc2UsICcvaXRlbS8nKSkudG8uZXFsKGV4cFNsYXNoKTtcbiAgICBleHBlY3QodS5hcHBlbmRQYXRoVG9QYXRoKGJhc2UsICcvaXRlbScpKS50by5lcWwoZXhwTm9TbGFzaCk7XG4gICAgZXhwZWN0KHUuYXBwZW5kUGF0aFRvUGF0aChiYXNlLCAnaXRlbS8nKSkudG8uZXFsKGV4cFNsYXNoKTtcbiAgICBleHBlY3QodS5hcHBlbmRQYXRoVG9QYXRoKGJhc2UsICdpdGVtJykpLnRvLmVxbChleHBOb1NsYXNoKTtcbiAgfSk7XG59KTtcbiJdLCJuYW1lcyI6WyJfIiwicmVxdWlyZSIsImJ1aWxkUGF5bG9hZCIsImRhdGEiLCJpc1R5cGUiLCJjb250ZXh0IiwiY29udGV4dFJlc3VsdCIsInN0cmluZ2lmeSIsImVycm9yIiwidmFsdWUiLCJsZW5ndGgiLCJzdWJzdHIiLCJnZXRUcmFuc3BvcnRGcm9tT3B0aW9ucyIsIm9wdGlvbnMiLCJkZWZhdWx0cyIsInVybCIsImhvc3RuYW1lIiwicHJvdG9jb2wiLCJwb3J0IiwicGF0aCIsInNlYXJjaCIsInRpbWVvdXQiLCJ0cmFuc3BvcnQiLCJkZXRlY3RUcmFuc3BvcnQiLCJwcm94eSIsImVuZHBvaW50Iiwib3B0cyIsInBhcnNlIiwicGF0aG5hbWUiLCJnV2luZG93Iiwid2luZG93Iiwic2VsZiIsImRlZmF1bHRUcmFuc3BvcnQiLCJmZXRjaCIsIlhNTEh0dHBSZXF1ZXN0IiwidHJhbnNwb3J0T3B0aW9ucyIsIm1ldGhvZCIsInVuZGVmaW5lZCIsInRyYW5zcG9ydEFQSSIsImhvc3QiLCJhcHBlbmRQYXRoVG9QYXRoIiwiYmFzZSIsImJhc2VUcmFpbGluZ1NsYXNoIiwidGVzdCIsInBhdGhCZWdpbm5pbmdTbGFzaCIsInN1YnN0cmluZyIsIm1vZHVsZSIsImV4cG9ydHMiLCJoYXNPd24iLCJPYmplY3QiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsInRvU3RyIiwidG9TdHJpbmciLCJpc1BsYWluT2JqZWN0Iiwib2JqIiwiY2FsbCIsImhhc093bkNvbnN0cnVjdG9yIiwiaGFzSXNQcm90b3R5cGVPZiIsImNvbnN0cnVjdG9yIiwia2V5IiwibWVyZ2UiLCJpIiwic3JjIiwiY29weSIsImNsb25lIiwibmFtZSIsInJlc3VsdCIsImN1cnJlbnQiLCJhcmd1bWVudHMiLCJSb2xsYmFySlNPTiIsInNldHVwSlNPTiIsInBvbHlmaWxsSlNPTiIsImlzRnVuY3Rpb24iLCJpc0RlZmluZWQiLCJKU09OIiwiaXNOYXRpdmVGdW5jdGlvbiIsIngiLCJ0IiwidHlwZU5hbWUiLCJfdHlwZW9mIiwiRXJyb3IiLCJtYXRjaCIsInRvTG93ZXJDYXNlIiwiZiIsInJlUmVnRXhwQ2hhciIsImZ1bmNNYXRjaFN0cmluZyIsIkZ1bmN0aW9uIiwicmVwbGFjZSIsInJlSXNOYXRpdmUiLCJSZWdFeHAiLCJpc09iamVjdCIsInR5cGUiLCJpc1N0cmluZyIsIlN0cmluZyIsImlzRmluaXRlTnVtYmVyIiwibiIsIk51bWJlciIsImlzRmluaXRlIiwidSIsImlzSXRlcmFibGUiLCJpc0Vycm9yIiwiZSIsImlzUHJvbWlzZSIsInAiLCJ0aGVuIiwiaXNCcm93c2VyIiwicmVkYWN0IiwidXVpZDQiLCJkIiwibm93IiwidXVpZCIsImMiLCJyIiwiTWF0aCIsInJhbmRvbSIsImZsb29yIiwiTEVWRUxTIiwiZGVidWciLCJpbmZvIiwid2FybmluZyIsImNyaXRpY2FsIiwic2FuaXRpemVVcmwiLCJiYXNlVXJsUGFydHMiLCJwYXJzZVVyaSIsImFuY2hvciIsInNvdXJjZSIsInF1ZXJ5IiwicGFyc2VVcmlPcHRpb25zIiwic3RyaWN0TW9kZSIsInEiLCJwYXJzZXIiLCJzdHJpY3QiLCJsb29zZSIsInN0ciIsIm8iLCJtIiwiZXhlYyIsInVyaSIsImwiLCIkMCIsIiQxIiwiJDIiLCJhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aCIsImFjY2Vzc1Rva2VuIiwicGFyYW1zIiwiYWNjZXNzX3Rva2VuIiwicGFyYW1zQXJyYXkiLCJrIiwicHVzaCIsImpvaW4iLCJzb3J0IiwicXMiLCJpbmRleE9mIiwiaCIsImZvcm1hdFVybCIsImJhY2t1cCIsImpzb25FcnJvciIsImJhY2t1cEVycm9yIiwibWF4Qnl0ZVNpemUiLCJzdHJpbmciLCJjb3VudCIsImNvZGUiLCJjaGFyQ29kZUF0IiwianNvblBhcnNlIiwicyIsIm1ha2VVbmhhbmRsZWRTdGFja0luZm8iLCJtZXNzYWdlIiwibGluZW5vIiwiY29sbm8iLCJtb2RlIiwiYmFja3VwTWVzc2FnZSIsImVycm9yUGFyc2VyIiwibG9jYXRpb24iLCJsaW5lIiwiY29sdW1uIiwiZnVuYyIsImd1ZXNzRnVuY3Rpb25OYW1lIiwiZ2F0aGVyQ29udGV4dCIsImhyZWYiLCJkb2N1bWVudCIsInVzZXJhZ2VudCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInN0YWNrIiwid3JhcENhbGxiYWNrIiwibG9nZ2VyIiwiZXJyIiwicmVzcCIsIm5vbkNpcmN1bGFyQ2xvbmUiLCJzZWVuIiwibmV3U2VlbiIsImluY2x1ZGVzIiwic2xpY2UiLCJjcmVhdGVJdGVtIiwiYXJncyIsIm5vdGlmaWVyIiwicmVxdWVzdEtleXMiLCJsYW1iZGFDb250ZXh0IiwiY3VzdG9tIiwiY2FsbGJhY2siLCJyZXF1ZXN0IiwiYXJnIiwiZXh0cmFBcmdzIiwiZGlhZ25vc3RpYyIsImFyZ1R5cGVzIiwidHlwIiwiRE9NRXhjZXB0aW9uIiwiaiIsImxlbiIsIml0ZW0iLCJ0aW1lc3RhbXAiLCJzZXRDdXN0b21JdGVtS2V5cyIsIl9vcmlnaW5hbEFyZ3MiLCJvcmlnaW5hbF9hcmdfdHlwZXMiLCJsZXZlbCIsInNraXBGcmFtZXMiLCJhZGRFcnJvckNvbnRleHQiLCJlcnJvcnMiLCJjb250ZXh0QWRkZWQiLCJyb2xsYmFyQ29udGV4dCIsImVycm9yX2NvbnRleHQiLCJURUxFTUVUUllfVFlQRVMiLCJURUxFTUVUUllfTEVWRUxTIiwiYXJyYXlJbmNsdWRlcyIsImFyciIsInZhbCIsImNyZWF0ZVRlbGVtZXRyeUV2ZW50IiwibWV0YWRhdGEiLCJldmVudCIsImFkZEl0ZW1BdHRyaWJ1dGVzIiwiYXR0cmlidXRlcyIsIl9pdGVtJGRhdGEkYXR0cmlidXRlcyIsImFwcGx5IiwiX3RvQ29uc3VtYWJsZUFycmF5IiwiZ2V0Iiwia2V5cyIsInNwbGl0Iiwic2V0IiwidGVtcCIsInJlcGxhY2VtZW50IiwiZm9ybWF0QXJnc0FzU3RyaW5nIiwiRGF0ZSIsImZpbHRlcklwIiwicmVxdWVzdERhdGEiLCJjYXB0dXJlSXAiLCJuZXdJcCIsInBhcnRzIiwicG9wIiwiYmVnaW5uaW5nIiwic2xhc2hJZHgiLCJ0ZXJtaW5hbCIsImNvbmNhdCIsImhhbmRsZU9wdGlvbnMiLCJpbnB1dCIsInBheWxvYWQiLCJ1cGRhdGVEZXByZWNhdGVkT3B0aW9ucyIsIm92ZXJ3cml0ZVNjcnViRmllbGRzIiwic2NydWJGaWVsZHMiLCJob3N0V2hpdGVMaXN0IiwiaG9zdFNhZmVMaXN0IiwibG9nIiwiaG9zdEJsYWNrTGlzdCIsImhvc3RCbG9ja0xpc3QiXSwic291cmNlUm9vdCI6IiJ9