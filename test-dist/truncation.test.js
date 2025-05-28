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

/***/ "./src/truncation.js":
/*!***************************!*\
  !*** ./src/truncation.js ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");
var traverse = __webpack_require__(/*! ./utility/traverse */ "./src/utility/traverse.js");
function raw(payload, jsonBackup) {
  return [payload, _.stringify(payload, jsonBackup)];
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
  return [payload, _.stringify(payload, jsonBackup)];
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
    switch (_.typeName(v)) {
      case 'string':
        return maybeTruncateValue(len, v);
      case 'object':
      case 'array':
        return traverse(v, truncator, seen);
      default:
        return v;
    }
  }
  payload = traverse(payload, truncator);
  return [payload, _.stringify(payload, jsonBackup)];
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
  return [payload, _.stringify(payload, jsonBackup)];
}
function needsTruncation(payload, maxSize) {
  return _.maxByteSize(payload) > maxSize;
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
module.exports = {
  truncate: truncate,
  /* for testing */
  raw: raw,
  truncateFrames: truncateFrames,
  truncateStrings: truncateStrings,
  maybeTruncateValue: maybeTruncateValue
};

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

/***/ }),

/***/ "./src/utility/traverse.js":
/*!*********************************!*\
  !*** ./src/utility/traverse.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ../utility */ "./src/utility.js");
function traverse(obj, func, seen) {
  var k, v, i;
  var isObj = _.isType(obj, 'object');
  var isArray = _.isType(obj, 'array');
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
module.exports = traverse;

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
  !*** ./test/truncation.test.js ***!
  \*********************************/
/* globals expect */
/* globals describe */
/* globals it */

var t = __webpack_require__(/*! ../src/truncation */ "./src/truncation.js");
var utility = __webpack_require__(/*! ../src/utility */ "./src/utility.js");
utility.setupJSON();

describe('truncate', function () {
  it('should not truncate something small enough', function () {
    var payload = messagePayload('hello world');
    var result = t.truncate(payload);
    expect(result.value).to.be.ok();

    var resultValue = JSON.parse(result.value);
    expect(resultValue).to.eql(payload);
  });

  it('should try all strategies if payload too big', function () {
    var payload = tracePayload(10, repeat('a', 500));
    var result = t.truncate(payload, undefined, 1);
    expect(result.value).to.be.ok();

    var resultValue = JSON.parse(result.value);

    expect(resultValue.data.body.trace.exception.description).to.not.be.ok();
    expect(resultValue.data.body.trace.exception.message.length).to.be.below(
      256,
    );
    expect(resultValue.data.body.trace.frames.length).to.be.below(3);
  });

  it('should not truncate ascii payload close to max size', function () {
    var payload = tracePayload(10, repeat('i', 500));
    var result = t.truncate(payload, undefined, 1100); // payload will be 500 + 528
    expect(result.value).to.be.ok();

    var resultValue = JSON.parse(result.value);
    expect(resultValue).to.eql(payload);
  });

  it('should truncate non-ascii payload when oversize', function () {
    var payload = tracePayload(10, repeat('あ', 500)); // あ is 3 utf-8 bytes (U+3042)
    var result = t.truncate(payload, undefined, 1100); // payload will be 1500 + 528
    expect(result.value).to.be.ok();

    var resultValue = JSON.parse(result.value);
    expect(resultValue.data.body.trace.frames.length).to.be.below(3);
  });
});

describe('raw', function () {
  it('should do nothing', function () {
    var payload = messagePayload('something');
    var rawResult = t.raw(payload);
    expect(rawResult[0]).to.eql(payload);
  });
});

describe('truncateFrames', function () {
  it('should do nothing with small number of frames', function () {
    var payload = tracePayload(5);
    var result = t.truncateFrames(payload, undefined, 5);
    var resultP = result[0];
    expect(resultP.data.body.trace.frames.length).to.eql(5);
  });

  it('should cut out middle frames if too many', function () {
    var payload = tracePayload(20);
    var result = t.truncateFrames(payload, undefined, 5);
    var resultP = result[0];
    expect(resultP.data.body.trace.frames.length).to.eql(10);
  });

  it('should do nothing with small number of frames trace_chain', function () {
    var payload = traceChainPayload(4, 5);
    var result = t.truncateFrames(payload, undefined, 5);
    var resultP = result[0];
    expect(resultP.data.body.trace_chain[0].frames.length).to.eql(5);
    expect(resultP.data.body.trace_chain[3].frames.length).to.eql(5);
  });

  it('should cut out middle frames if too many trace_chain', function () {
    var payload = traceChainPayload(4, 20);
    var result = t.truncateFrames(payload, undefined, 5);
    var resultP = result[0];
    expect(resultP.data.body.trace_chain[0].frames.length).to.eql(10);
    expect(resultP.data.body.trace_chain[3].frames.length).to.eql(10);
  });
});

describe('truncateStrings', function () {
  it('should work recursively on different string sizes', function () {
    var payload = {
      access_token: 'abc',
      data: {
        body: {
          small: 'i am a small string',
          big: repeat('hello world', 20),
          exact: repeat('a', 50),
          exactPlusOne: repeat('a', 51),
        },
        other: 'this is ok',
        not: repeat('too big', 30),
      },
    };

    var result = t.truncateStrings(50, payload);
    var resultP = result[0];

    expect(resultP.data.body.small.length).to.eql(19);
    expect(resultP.data.body.big.length).to.eql(50);
    expect(resultP.data.body.exact.length).to.eql(50);
    expect(resultP.data.body.exact[49]).to.eql('a');
    expect(resultP.data.body.exactPlusOne.length).to.eql(50);
    expect(resultP.data.body.exactPlusOne[49]).to.eql('.');
    expect(resultP.data.other.length).to.eql(10);
    expect(resultP.data.not.length).to.eql(50);
    expect(resultP.data.not[49]).to.eql('.');
  });
});

describe('maybeTruncateValue', function () {
  it('should handle falsey things', function () {
    expect(t.maybeTruncateValue(42, null)).to.be(null);
    expect(t.maybeTruncateValue(42, false)).to.eql(false);
    expect(t.maybeTruncateValue(42, undefined)).to.be(undefined);
  });

  it('should handle strings shorter than the length', function () {
    var len = 10;
    var val = 'hello';
    var result = t.maybeTruncateValue(len, val);
    expect(result).to.eql(val);
    expect(result.length).to.be.below(len + 1);
  });
  it('should handle strings longer than the length', function () {
    var len = 10;
    var val = repeat('hello', 3);
    var result = t.maybeTruncateValue(len, val);
    expect(result).to.not.eql(val);
    expect(result.length).to.be.below(len + 1);
  });
  it('should handle arrays shorter than the length', function () {
    var len = 10;
    var val = repeat('a,', 8).split(',');
    val.pop();
    var result = t.maybeTruncateValue(len, val);
    expect(result).to.eql(val);
    expect(result.length).to.be.below(len + 1);
  });
  it('should handle arrays longer than the length', function () {
    var len = 10;
    var val = repeat('a,', 12).split(',');
    val.pop();
    var result = t.maybeTruncateValue(len, val);
    expect(result).to.not.eql(val);
    expect(result.length).to.be.below(len + 1);
  });
});

function messagePayload(message) {
  return {
    access_token: 'abc',
    data: {
      body: {
        message: {
          body: message,
        },
      },
    },
  };
}

function tracePayload(frameCount, message) {
  message = typeof message !== 'undefined' ? message : 'EXCEPTION MESSAGE';
  var frames = [];
  for (var i = 0; i < frameCount; i++) {
    frames.push({
      filename: 'some/file/name',
      lineno: i,
    });
  }
  return {
    access_token: 'abc',
    data: {
      body: {
        trace: {
          exception: {
            description: 'ALL YOUR BASE',
            message: message,
          },
          frames: frames,
        },
      },
    },
  };
}

function traceChainPayload(traceCount, frameCount, message) {
  message = typeof message !== 'undefined' ? message : 'EXCEPTION MESSAGE';
  var chain = [];
  for (var c = 0; c < traceCount; c++) {
    var frames = [];
    for (var i = 0; i < frameCount; i++) {
      frames.push({
        filename: 'some/file/name::' + c,
        lineno: i,
      });
    }
    chain.push({
      exception: {
        description: 'ALL YOUR BASE :: ' + c,
        message: message,
      },
      frames: frames,
    });
  }
  return {
    access_token: 'abc',
    data: {
      body: {
        trace_chain: chain,
      },
    },
  };
}

function repeat(s, n) {
  var result = s;
  for (var i = 1; i < n; i++) {
    result += s;
  }
  return result;
}

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7OztBQ3RCQTtBQUNBO0FBQ0E7O0FBRUEsUUFBUSxtQkFBTyxDQUFDLDhDQUFtQjtBQUNuQyxjQUFjLG1CQUFPLENBQUMsd0NBQWdCO0FBQ3RDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RDs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLHNEQUFzRDtBQUN0RCx1REFBdUQ7QUFDdkQ7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGdCQUFnQjtBQUNsQztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsZ0JBQWdCO0FBQ2xDO0FBQ0Esb0JBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixPQUFPO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcm9sbGJhci93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9tZXJnZS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3RydW5jYXRpb24uanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy91dGlsaXR5LmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvdXRpbGl0eS90cmF2ZXJzZS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3JvbGxiYXIvLi90ZXN0L3RydW5jYXRpb24udGVzdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoc2VsZiwgKCkgPT4ge1xucmV0dXJuICIsIid1c2Ugc3RyaWN0JztcblxudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG52YXIgaXNQbGFpbk9iamVjdCA9IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qob2JqKSB7XG4gIGlmICghb2JqIHx8IHRvU3RyLmNhbGwob2JqKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgaGFzT3duQ29uc3RydWN0b3IgPSBoYXNPd24uY2FsbChvYmosICdjb25zdHJ1Y3RvcicpO1xuICB2YXIgaGFzSXNQcm90b3R5cGVPZiA9XG4gICAgb2JqLmNvbnN0cnVjdG9yICYmXG4gICAgb2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSAmJlxuICAgIGhhc093bi5jYWxsKG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsICdpc1Byb3RvdHlwZU9mJyk7XG4gIC8vIE5vdCBvd24gY29uc3RydWN0b3IgcHJvcGVydHkgbXVzdCBiZSBPYmplY3RcbiAgaWYgKG9iai5jb25zdHJ1Y3RvciAmJiAhaGFzT3duQ29uc3RydWN0b3IgJiYgIWhhc0lzUHJvdG90eXBlT2YpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBPd24gcHJvcGVydGllcyBhcmUgZW51bWVyYXRlZCBmaXJzdGx5LCBzbyB0byBzcGVlZCB1cCxcbiAgLy8gaWYgbGFzdCBvbmUgaXMgb3duLCB0aGVuIGFsbCBwcm9wZXJ0aWVzIGFyZSBvd24uXG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIC8qKi9cbiAgfVxuXG4gIHJldHVybiB0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJyB8fCBoYXNPd24uY2FsbChvYmosIGtleSk7XG59O1xuXG5mdW5jdGlvbiBtZXJnZSgpIHtcbiAgdmFyIGksXG4gICAgc3JjLFxuICAgIGNvcHksXG4gICAgY2xvbmUsXG4gICAgbmFtZSxcbiAgICByZXN1bHQgPSB7fSxcbiAgICBjdXJyZW50ID0gbnVsbCxcbiAgICBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGN1cnJlbnQgPSBhcmd1bWVudHNbaV07XG4gICAgaWYgKGN1cnJlbnQgPT0gbnVsbCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgZm9yIChuYW1lIGluIGN1cnJlbnQpIHtcbiAgICAgIHNyYyA9IHJlc3VsdFtuYW1lXTtcbiAgICAgIGNvcHkgPSBjdXJyZW50W25hbWVdO1xuICAgICAgaWYgKHJlc3VsdCAhPT0gY29weSkge1xuICAgICAgICBpZiAoY29weSAmJiBpc1BsYWluT2JqZWN0KGNvcHkpKSB7XG4gICAgICAgICAgY2xvbmUgPSBzcmMgJiYgaXNQbGFpbk9iamVjdChzcmMpID8gc3JjIDoge307XG4gICAgICAgICAgcmVzdWx0W25hbWVdID0gbWVyZ2UoY2xvbmUsIGNvcHkpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb3B5ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IGNvcHk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZTtcbiIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsaXR5Jyk7XG52YXIgdHJhdmVyc2UgPSByZXF1aXJlKCcuL3V0aWxpdHkvdHJhdmVyc2UnKTtcblxuZnVuY3Rpb24gcmF3KHBheWxvYWQsIGpzb25CYWNrdXApIHtcbiAgcmV0dXJuIFtwYXlsb2FkLCBfLnN0cmluZ2lmeShwYXlsb2FkLCBqc29uQmFja3VwKV07XG59XG5cbmZ1bmN0aW9uIHNlbGVjdEZyYW1lcyhmcmFtZXMsIHJhbmdlKSB7XG4gIHZhciBsZW4gPSBmcmFtZXMubGVuZ3RoO1xuICBpZiAobGVuID4gcmFuZ2UgKiAyKSB7XG4gICAgcmV0dXJuIGZyYW1lcy5zbGljZSgwLCByYW5nZSkuY29uY2F0KGZyYW1lcy5zbGljZShsZW4gLSByYW5nZSkpO1xuICB9XG4gIHJldHVybiBmcmFtZXM7XG59XG5cbmZ1bmN0aW9uIHRydW5jYXRlRnJhbWVzKHBheWxvYWQsIGpzb25CYWNrdXAsIHJhbmdlKSB7XG4gIHJhbmdlID0gdHlwZW9mIHJhbmdlID09PSAndW5kZWZpbmVkJyA/IDMwIDogcmFuZ2U7XG4gIHZhciBib2R5ID0gcGF5bG9hZC5kYXRhLmJvZHk7XG4gIHZhciBmcmFtZXM7XG4gIGlmIChib2R5LnRyYWNlX2NoYWluKSB7XG4gICAgdmFyIGNoYWluID0gYm9keS50cmFjZV9jaGFpbjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYWluLmxlbmd0aDsgaSsrKSB7XG4gICAgICBmcmFtZXMgPSBjaGFpbltpXS5mcmFtZXM7XG4gICAgICBmcmFtZXMgPSBzZWxlY3RGcmFtZXMoZnJhbWVzLCByYW5nZSk7XG4gICAgICBjaGFpbltpXS5mcmFtZXMgPSBmcmFtZXM7XG4gICAgfVxuICB9IGVsc2UgaWYgKGJvZHkudHJhY2UpIHtcbiAgICBmcmFtZXMgPSBib2R5LnRyYWNlLmZyYW1lcztcbiAgICBmcmFtZXMgPSBzZWxlY3RGcmFtZXMoZnJhbWVzLCByYW5nZSk7XG4gICAgYm9keS50cmFjZS5mcmFtZXMgPSBmcmFtZXM7XG4gIH1cbiAgcmV0dXJuIFtwYXlsb2FkLCBfLnN0cmluZ2lmeShwYXlsb2FkLCBqc29uQmFja3VwKV07XG59XG5cbmZ1bmN0aW9uIG1heWJlVHJ1bmNhdGVWYWx1ZShsZW4sIHZhbCkge1xuICBpZiAoIXZhbCkge1xuICAgIHJldHVybiB2YWw7XG4gIH1cbiAgaWYgKHZhbC5sZW5ndGggPiBsZW4pIHtcbiAgICByZXR1cm4gdmFsLnNsaWNlKDAsIGxlbiAtIDMpLmNvbmNhdCgnLi4uJyk7XG4gIH1cbiAgcmV0dXJuIHZhbDtcbn1cblxuZnVuY3Rpb24gdHJ1bmNhdGVTdHJpbmdzKGxlbiwgcGF5bG9hZCwganNvbkJhY2t1cCkge1xuICBmdW5jdGlvbiB0cnVuY2F0b3Ioaywgdiwgc2Vlbikge1xuICAgIHN3aXRjaCAoXy50eXBlTmFtZSh2KSkge1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgcmV0dXJuIG1heWJlVHJ1bmNhdGVWYWx1ZShsZW4sIHYpO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgICAgcmV0dXJuIHRyYXZlcnNlKHYsIHRydW5jYXRvciwgc2Vlbik7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdjtcbiAgICB9XG4gIH1cbiAgcGF5bG9hZCA9IHRyYXZlcnNlKHBheWxvYWQsIHRydW5jYXRvcik7XG4gIHJldHVybiBbcGF5bG9hZCwgXy5zdHJpbmdpZnkocGF5bG9hZCwganNvbkJhY2t1cCldO1xufVxuXG5mdW5jdGlvbiB0cnVuY2F0ZVRyYWNlRGF0YSh0cmFjZURhdGEpIHtcbiAgaWYgKHRyYWNlRGF0YS5leGNlcHRpb24pIHtcbiAgICBkZWxldGUgdHJhY2VEYXRhLmV4Y2VwdGlvbi5kZXNjcmlwdGlvbjtcbiAgICB0cmFjZURhdGEuZXhjZXB0aW9uLm1lc3NhZ2UgPSBtYXliZVRydW5jYXRlVmFsdWUoXG4gICAgICAyNTUsXG4gICAgICB0cmFjZURhdGEuZXhjZXB0aW9uLm1lc3NhZ2UsXG4gICAgKTtcbiAgfVxuICB0cmFjZURhdGEuZnJhbWVzID0gc2VsZWN0RnJhbWVzKHRyYWNlRGF0YS5mcmFtZXMsIDEpO1xuICByZXR1cm4gdHJhY2VEYXRhO1xufVxuXG5mdW5jdGlvbiBtaW5Cb2R5KHBheWxvYWQsIGpzb25CYWNrdXApIHtcbiAgdmFyIGJvZHkgPSBwYXlsb2FkLmRhdGEuYm9keTtcbiAgaWYgKGJvZHkudHJhY2VfY2hhaW4pIHtcbiAgICB2YXIgY2hhaW4gPSBib2R5LnRyYWNlX2NoYWluO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhaW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoYWluW2ldID0gdHJ1bmNhdGVUcmFjZURhdGEoY2hhaW5baV0pO1xuICAgIH1cbiAgfSBlbHNlIGlmIChib2R5LnRyYWNlKSB7XG4gICAgYm9keS50cmFjZSA9IHRydW5jYXRlVHJhY2VEYXRhKGJvZHkudHJhY2UpO1xuICB9XG4gIHJldHVybiBbcGF5bG9hZCwgXy5zdHJpbmdpZnkocGF5bG9hZCwganNvbkJhY2t1cCldO1xufVxuXG5mdW5jdGlvbiBuZWVkc1RydW5jYXRpb24ocGF5bG9hZCwgbWF4U2l6ZSkge1xuICByZXR1cm4gXy5tYXhCeXRlU2l6ZShwYXlsb2FkKSA+IG1heFNpemU7XG59XG5cbmZ1bmN0aW9uIHRydW5jYXRlKHBheWxvYWQsIGpzb25CYWNrdXAsIG1heFNpemUpIHtcbiAgbWF4U2l6ZSA9IHR5cGVvZiBtYXhTaXplID09PSAndW5kZWZpbmVkJyA/IDUxMiAqIDEwMjQgOiBtYXhTaXplO1xuICB2YXIgc3RyYXRlZ2llcyA9IFtcbiAgICByYXcsXG4gICAgdHJ1bmNhdGVGcmFtZXMsXG4gICAgdHJ1bmNhdGVTdHJpbmdzLmJpbmQobnVsbCwgMTAyNCksXG4gICAgdHJ1bmNhdGVTdHJpbmdzLmJpbmQobnVsbCwgNTEyKSxcbiAgICB0cnVuY2F0ZVN0cmluZ3MuYmluZChudWxsLCAyNTYpLFxuICAgIG1pbkJvZHksXG4gIF07XG4gIHZhciBzdHJhdGVneSwgcmVzdWx0cywgcmVzdWx0O1xuXG4gIHdoaWxlICgoc3RyYXRlZ3kgPSBzdHJhdGVnaWVzLnNoaWZ0KCkpKSB7XG4gICAgcmVzdWx0cyA9IHN0cmF0ZWd5KHBheWxvYWQsIGpzb25CYWNrdXApO1xuICAgIHBheWxvYWQgPSByZXN1bHRzWzBdO1xuICAgIHJlc3VsdCA9IHJlc3VsdHNbMV07XG4gICAgaWYgKHJlc3VsdC5lcnJvciB8fCAhbmVlZHNUcnVuY2F0aW9uKHJlc3VsdC52YWx1ZSwgbWF4U2l6ZSkpIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB0cnVuY2F0ZTogdHJ1bmNhdGUsXG5cbiAgLyogZm9yIHRlc3RpbmcgKi9cbiAgcmF3OiByYXcsXG4gIHRydW5jYXRlRnJhbWVzOiB0cnVuY2F0ZUZyYW1lcyxcbiAgdHJ1bmNhdGVTdHJpbmdzOiB0cnVuY2F0ZVN0cmluZ3MsXG4gIG1heWJlVHJ1bmNhdGVWYWx1ZTogbWF5YmVUcnVuY2F0ZVZhbHVlLFxufTtcbiIsInZhciBtZXJnZSA9IHJlcXVpcmUoJy4vbWVyZ2UnKTtcblxudmFyIFJvbGxiYXJKU09OID0ge307XG5mdW5jdGlvbiBzZXR1cEpTT04ocG9seWZpbGxKU09OKSB7XG4gIGlmIChpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnN0cmluZ2lmeSkgJiYgaXNGdW5jdGlvbihSb2xsYmFySlNPTi5wYXJzZSkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoaXNEZWZpbmVkKEpTT04pKSB7XG4gICAgLy8gSWYgcG9seWZpbGwgaXMgcHJvdmlkZWQsIHByZWZlciBpdCBvdmVyIGV4aXN0aW5nIG5vbi1uYXRpdmUgc2hpbXMuXG4gICAgaWYgKHBvbHlmaWxsSlNPTikge1xuICAgICAgaWYgKGlzTmF0aXZlRnVuY3Rpb24oSlNPTi5zdHJpbmdpZnkpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnN0cmluZ2lmeSA9IEpTT04uc3RyaW5naWZ5O1xuICAgICAgfVxuICAgICAgaWYgKGlzTmF0aXZlRnVuY3Rpb24oSlNPTi5wYXJzZSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04ucGFyc2UgPSBKU09OLnBhcnNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBlbHNlIGFjY2VwdCBhbnkgaW50ZXJmYWNlIHRoYXQgaXMgcHJlc2VudC5cbiAgICAgIGlmIChpc0Z1bmN0aW9uKEpTT04uc3RyaW5naWZ5KSkge1xuICAgICAgICBSb2xsYmFySlNPTi5zdHJpbmdpZnkgPSBKU09OLnN0cmluZ2lmeTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0Z1bmN0aW9uKEpTT04ucGFyc2UpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnBhcnNlID0gSlNPTi5wYXJzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKCFpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnN0cmluZ2lmeSkgfHwgIWlzRnVuY3Rpb24oUm9sbGJhckpTT04ucGFyc2UpKSB7XG4gICAgcG9seWZpbGxKU09OICYmIHBvbHlmaWxsSlNPTihSb2xsYmFySlNPTik7XG4gIH1cbn1cblxuLypcbiAqIGlzVHlwZSAtIEdpdmVuIGEgSmF2YXNjcmlwdCB2YWx1ZSBhbmQgYSBzdHJpbmcsIHJldHVybnMgdHJ1ZSBpZiB0aGUgdHlwZSBvZiB0aGUgdmFsdWUgbWF0Y2hlcyB0aGVcbiAqIGdpdmVuIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0geCAtIGFueSB2YWx1ZVxuICogQHBhcmFtIHQgLSBhIGxvd2VyY2FzZSBzdHJpbmcgY29udGFpbmluZyBvbmUgb2YgdGhlIGZvbGxvd2luZyB0eXBlIG5hbWVzOlxuICogICAgLSB1bmRlZmluZWRcbiAqICAgIC0gbnVsbFxuICogICAgLSBlcnJvclxuICogICAgLSBudW1iZXJcbiAqICAgIC0gYm9vbGVhblxuICogICAgLSBzdHJpbmdcbiAqICAgIC0gc3ltYm9sXG4gKiAgICAtIGZ1bmN0aW9uXG4gKiAgICAtIG9iamVjdFxuICogICAgLSBhcnJheVxuICogQHJldHVybnMgdHJ1ZSBpZiB4IGlzIG9mIHR5cGUgdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVHlwZSh4LCB0KSB7XG4gIHJldHVybiB0ID09PSB0eXBlTmFtZSh4KTtcbn1cblxuLypcbiAqIHR5cGVOYW1lIC0gR2l2ZW4gYSBKYXZhc2NyaXB0IHZhbHVlLCByZXR1cm5zIHRoZSB0eXBlIG9mIHRoZSBvYmplY3QgYXMgYSBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gdHlwZU5hbWUoeCkge1xuICB2YXIgbmFtZSA9IHR5cGVvZiB4O1xuICBpZiAobmFtZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbmFtZTtcbiAgfVxuICBpZiAoIXgpIHtcbiAgICByZXR1cm4gJ251bGwnO1xuICB9XG4gIGlmICh4IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICByZXR1cm4gJ2Vycm9yJztcbiAgfVxuICByZXR1cm4ge30udG9TdHJpbmdcbiAgICAuY2FsbCh4KVxuICAgIC5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXVxuICAgIC50b0xvd2VyQ2FzZSgpO1xufVxuXG4vKiBpc0Z1bmN0aW9uIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBhIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIGYgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIGZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbihmKSB7XG4gIHJldHVybiBpc1R5cGUoZiwgJ2Z1bmN0aW9uJyk7XG59XG5cbi8qIGlzTmF0aXZlRnVuY3Rpb24gLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIGEgbmF0aXZlIEpTIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIGYgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIG5hdGl2ZSBKUyBmdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlRnVuY3Rpb24oZikge1xuICB2YXIgcmVSZWdFeHBDaGFyID0gL1tcXFxcXiQuKis/KClbXFxde318XS9nO1xuICB2YXIgZnVuY01hdGNoU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nXG4gICAgLmNhbGwoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSlcbiAgICAucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAgIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKTtcbiAgdmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICsgZnVuY01hdGNoU3RyaW5nICsgJyQnKTtcbiAgcmV0dXJuIGlzT2JqZWN0KGYpICYmIHJlSXNOYXRpdmUudGVzdChmKTtcbn1cblxuLyogaXNPYmplY3QgLSBDaGVja3MgaWYgdGhlIGFyZ3VtZW50IGlzIGFuIG9iamVjdFxuICpcbiAqIEBwYXJhbSB2YWx1ZSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpcyB2YWx1ZSBpcyBhbiBvYmplY3QgZnVuY3Rpb24gaXMgYW4gb2JqZWN0KVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyogaXNTdHJpbmcgLSBDaGVja3MgaWYgdGhlIGFyZ3VtZW50IGlzIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHZhbHVlIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIHZhbHVlIGlzIGEgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nO1xufVxuXG4vKipcbiAqIGlzRmluaXRlTnVtYmVyIC0gZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgYSBmaW5pdGUgbnVtYmVyXG4gKlxuICogQHBhcmFtIHsqfSBuIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIHZhbHVlIGlzIGEgZmluaXRlIG51bWJlclxuICovXG5mdW5jdGlvbiBpc0Zpbml0ZU51bWJlcihuKSB7XG4gIHJldHVybiBOdW1iZXIuaXNGaW5pdGUobik7XG59XG5cbi8qXG4gKiBpc0RlZmluZWQgLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIG5vdCBlcXVhbCB0byB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0gdSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiB1IGlzIGFueXRoaW5nIG90aGVyIHRoYW4gdW5kZWZpbmVkXG4gKi9cbmZ1bmN0aW9uIGlzRGVmaW5lZCh1KSB7XG4gIHJldHVybiAhaXNUeXBlKHUsICd1bmRlZmluZWQnKTtcbn1cblxuLypcbiAqIGlzSXRlcmFibGUgLSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBjYW4gYmUgaXRlcmF0ZWQsIGVzc2VudGlhbGx5XG4gKiB3aGV0aGVyIGl0IGlzIGFuIG9iamVjdCBvciBhbiBhcnJheS5cbiAqXG4gKiBAcGFyYW0gaSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBpIGlzIGFuIG9iamVjdCBvciBhbiBhcnJheSBhcyBkZXRlcm1pbmVkIGJ5IGB0eXBlTmFtZWBcbiAqL1xuZnVuY3Rpb24gaXNJdGVyYWJsZShpKSB7XG4gIHZhciB0eXBlID0gdHlwZU5hbWUoaSk7XG4gIHJldHVybiB0eXBlID09PSAnb2JqZWN0JyB8fCB0eXBlID09PSAnYXJyYXknO1xufVxuXG4vKlxuICogaXNFcnJvciAtIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIG9mIGFuIGVycm9yIHR5cGVcbiAqXG4gKiBAcGFyYW0gZSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBlIGlzIGFuIGVycm9yXG4gKi9cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICAvLyBEZXRlY3QgYm90aCBFcnJvciBhbmQgRmlyZWZveCBFeGNlcHRpb24gdHlwZVxuICByZXR1cm4gaXNUeXBlKGUsICdlcnJvcicpIHx8IGlzVHlwZShlLCAnZXhjZXB0aW9uJyk7XG59XG5cbi8qIGlzUHJvbWlzZSAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgYSBwcm9taXNlXG4gKlxuICogQHBhcmFtIHAgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIGZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNQcm9taXNlKHApIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHApICYmIGlzVHlwZShwLnRoZW4sICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIGlzQnJvd3NlciAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIHRoZSBjb2RlIGlzIHJ1bm5pbmcgaW4gYSBicm93c2VyXG4gKlxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY29kZSBpcyBydW5uaW5nIGluIGEgYnJvd3NlciBlbnZpcm9ubWVudFxuICovXG5mdW5jdGlvbiBpc0Jyb3dzZXIoKSB7XG4gIHJldHVybiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcbn1cblxuZnVuY3Rpb24gcmVkYWN0KCkge1xuICByZXR1cm4gJyoqKioqKioqJztcbn1cblxuLy8gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS84ODA5NDcyLzExMzgxOTFcbmZ1bmN0aW9uIHV1aWQ0KCkge1xuICB2YXIgZCA9IG5vdygpO1xuICB2YXIgdXVpZCA9ICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoXG4gICAgL1t4eV0vZyxcbiAgICBmdW5jdGlvbiAoYykge1xuICAgICAgdmFyIHIgPSAoZCArIE1hdGgucmFuZG9tKCkgKiAxNikgJSAxNiB8IDA7XG4gICAgICBkID0gTWF0aC5mbG9vcihkIC8gMTYpO1xuICAgICAgcmV0dXJuIChjID09PSAneCcgPyByIDogKHIgJiAweDcpIHwgMHg4KS50b1N0cmluZygxNik7XG4gICAgfSxcbiAgKTtcbiAgcmV0dXJuIHV1aWQ7XG59XG5cbnZhciBMRVZFTFMgPSB7XG4gIGRlYnVnOiAwLFxuICBpbmZvOiAxLFxuICB3YXJuaW5nOiAyLFxuICBlcnJvcjogMyxcbiAgY3JpdGljYWw6IDQsXG59O1xuXG5mdW5jdGlvbiBzYW5pdGl6ZVVybCh1cmwpIHtcbiAgdmFyIGJhc2VVcmxQYXJ0cyA9IHBhcnNlVXJpKHVybCk7XG4gIGlmICghYmFzZVVybFBhcnRzKSB7XG4gICAgcmV0dXJuICcodW5rbm93biknO1xuICB9XG5cbiAgLy8gcmVtb3ZlIGEgdHJhaWxpbmcgIyBpZiB0aGVyZSBpcyBubyBhbmNob3JcbiAgaWYgKGJhc2VVcmxQYXJ0cy5hbmNob3IgPT09ICcnKSB7XG4gICAgYmFzZVVybFBhcnRzLnNvdXJjZSA9IGJhc2VVcmxQYXJ0cy5zb3VyY2UucmVwbGFjZSgnIycsICcnKTtcbiAgfVxuXG4gIHVybCA9IGJhc2VVcmxQYXJ0cy5zb3VyY2UucmVwbGFjZSgnPycgKyBiYXNlVXJsUGFydHMucXVlcnksICcnKTtcbiAgcmV0dXJuIHVybDtcbn1cblxudmFyIHBhcnNlVXJpT3B0aW9ucyA9IHtcbiAgc3RyaWN0TW9kZTogZmFsc2UsXG4gIGtleTogW1xuICAgICdzb3VyY2UnLFxuICAgICdwcm90b2NvbCcsXG4gICAgJ2F1dGhvcml0eScsXG4gICAgJ3VzZXJJbmZvJyxcbiAgICAndXNlcicsXG4gICAgJ3Bhc3N3b3JkJyxcbiAgICAnaG9zdCcsXG4gICAgJ3BvcnQnLFxuICAgICdyZWxhdGl2ZScsXG4gICAgJ3BhdGgnLFxuICAgICdkaXJlY3RvcnknLFxuICAgICdmaWxlJyxcbiAgICAncXVlcnknLFxuICAgICdhbmNob3InLFxuICBdLFxuICBxOiB7XG4gICAgbmFtZTogJ3F1ZXJ5S2V5JyxcbiAgICBwYXJzZXI6IC8oPzpefCYpKFteJj1dKik9PyhbXiZdKikvZyxcbiAgfSxcbiAgcGFyc2VyOiB7XG4gICAgc3RyaWN0OlxuICAgICAgL14oPzooW146XFwvPyNdKyk6KT8oPzpcXC9cXC8oKD86KChbXjpAXSopKD86OihbXjpAXSopKT8pP0ApPyhbXjpcXC8/I10qKSg/OjooXFxkKikpPykpPygoKCg/OltePyNcXC9dKlxcLykqKShbXj8jXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pLyxcbiAgICBsb29zZTpcbiAgICAgIC9eKD86KD8hW146QF0rOlteOkBcXC9dKkApKFteOlxcLz8jLl0rKTopPyg/OlxcL1xcLyk/KCg/OigoW146QF0qKSg/OjooW146QF0qKSk/KT9AKT8oW146XFwvPyNdKikoPzo6KFxcZCopKT8pKCgoXFwvKD86W14/I10oPyFbXj8jXFwvXSpcXC5bXj8jXFwvLl0rKD86Wz8jXXwkKSkpKlxcLz8pPyhbXj8jXFwvXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pLyxcbiAgfSxcbn07XG5cbmZ1bmN0aW9uIHBhcnNlVXJpKHN0cikge1xuICBpZiAoIWlzVHlwZShzdHIsICdzdHJpbmcnKSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICB2YXIgbyA9IHBhcnNlVXJpT3B0aW9ucztcbiAgdmFyIG0gPSBvLnBhcnNlcltvLnN0cmljdE1vZGUgPyAnc3RyaWN0JyA6ICdsb29zZSddLmV4ZWMoc3RyKTtcbiAgdmFyIHVyaSA9IHt9O1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gby5rZXkubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgdXJpW28ua2V5W2ldXSA9IG1baV0gfHwgJyc7XG4gIH1cblxuICB1cmlbby5xLm5hbWVdID0ge307XG4gIHVyaVtvLmtleVsxMl1dLnJlcGxhY2Uoby5xLnBhcnNlciwgZnVuY3Rpb24gKCQwLCAkMSwgJDIpIHtcbiAgICBpZiAoJDEpIHtcbiAgICAgIHVyaVtvLnEubmFtZV1bJDFdID0gJDI7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdXJpO1xufVxuXG5mdW5jdGlvbiBhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aChhY2Nlc3NUb2tlbiwgb3B0aW9ucywgcGFyYW1zKSB7XG4gIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgcGFyYW1zLmFjY2Vzc190b2tlbiA9IGFjY2Vzc1Rva2VuO1xuICB2YXIgcGFyYW1zQXJyYXkgPSBbXTtcbiAgdmFyIGs7XG4gIGZvciAoayBpbiBwYXJhbXMpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmFtcywgaykpIHtcbiAgICAgIHBhcmFtc0FycmF5LnB1c2goW2ssIHBhcmFtc1trXV0uam9pbignPScpKTtcbiAgICB9XG4gIH1cbiAgdmFyIHF1ZXJ5ID0gJz8nICsgcGFyYW1zQXJyYXkuc29ydCgpLmpvaW4oJyYnKTtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgb3B0aW9ucy5wYXRoID0gb3B0aW9ucy5wYXRoIHx8ICcnO1xuICB2YXIgcXMgPSBvcHRpb25zLnBhdGguaW5kZXhPZignPycpO1xuICB2YXIgaCA9IG9wdGlvbnMucGF0aC5pbmRleE9mKCcjJyk7XG4gIHZhciBwO1xuICBpZiAocXMgIT09IC0xICYmIChoID09PSAtMSB8fCBoID4gcXMpKSB7XG4gICAgcCA9IG9wdGlvbnMucGF0aDtcbiAgICBvcHRpb25zLnBhdGggPSBwLnN1YnN0cmluZygwLCBxcykgKyBxdWVyeSArICcmJyArIHAuc3Vic3RyaW5nKHFzICsgMSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGggIT09IC0xKSB7XG4gICAgICBwID0gb3B0aW9ucy5wYXRoO1xuICAgICAgb3B0aW9ucy5wYXRoID0gcC5zdWJzdHJpbmcoMCwgaCkgKyBxdWVyeSArIHAuc3Vic3RyaW5nKGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zLnBhdGggPSBvcHRpb25zLnBhdGggKyBxdWVyeTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0VXJsKHUsIHByb3RvY29sKSB7XG4gIHByb3RvY29sID0gcHJvdG9jb2wgfHwgdS5wcm90b2NvbDtcbiAgaWYgKCFwcm90b2NvbCAmJiB1LnBvcnQpIHtcbiAgICBpZiAodS5wb3J0ID09PSA4MCkge1xuICAgICAgcHJvdG9jb2wgPSAnaHR0cDonO1xuICAgIH0gZWxzZSBpZiAodS5wb3J0ID09PSA0NDMpIHtcbiAgICAgIHByb3RvY29sID0gJ2h0dHBzOic7XG4gICAgfVxuICB9XG4gIHByb3RvY29sID0gcHJvdG9jb2wgfHwgJ2h0dHBzOic7XG5cbiAgaWYgKCF1Lmhvc3RuYW1lKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IHByb3RvY29sICsgJy8vJyArIHUuaG9zdG5hbWU7XG4gIGlmICh1LnBvcnQpIHtcbiAgICByZXN1bHQgPSByZXN1bHQgKyAnOicgKyB1LnBvcnQ7XG4gIH1cbiAgaWYgKHUucGF0aCkge1xuICAgIHJlc3VsdCA9IHJlc3VsdCArIHUucGF0aDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnkob2JqLCBiYWNrdXApIHtcbiAgdmFyIHZhbHVlLCBlcnJvcjtcbiAgdHJ5IHtcbiAgICB2YWx1ZSA9IFJvbGxiYXJKU09OLnN0cmluZ2lmeShvYmopO1xuICB9IGNhdGNoIChqc29uRXJyb3IpIHtcbiAgICBpZiAoYmFja3VwICYmIGlzRnVuY3Rpb24oYmFja3VwKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBiYWNrdXAob2JqKTtcbiAgICAgIH0gY2F0Y2ggKGJhY2t1cEVycm9yKSB7XG4gICAgICAgIGVycm9yID0gYmFja3VwRXJyb3I7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVycm9yID0ganNvbkVycm9yO1xuICAgIH1cbiAgfVxuICByZXR1cm4geyBlcnJvcjogZXJyb3IsIHZhbHVlOiB2YWx1ZSB9O1xufVxuXG5mdW5jdGlvbiBtYXhCeXRlU2l6ZShzdHJpbmcpIHtcbiAgLy8gVGhlIHRyYW5zcG9ydCB3aWxsIHVzZSB1dGYtOCwgc28gYXNzdW1lIHV0Zi04IGVuY29kaW5nLlxuICAvL1xuICAvLyBUaGlzIG1pbmltYWwgaW1wbGVtZW50YXRpb24gd2lsbCBhY2N1cmF0ZWx5IGNvdW50IGJ5dGVzIGZvciBhbGwgVUNTLTIgYW5kXG4gIC8vIHNpbmdsZSBjb2RlIHBvaW50IFVURi0xNi4gSWYgcHJlc2VudGVkIHdpdGggbXVsdGkgY29kZSBwb2ludCBVVEYtMTYsXG4gIC8vIHdoaWNoIHNob3VsZCBiZSByYXJlLCBpdCB3aWxsIHNhZmVseSBvdmVyY291bnQsIG5vdCB1bmRlcmNvdW50LlxuICAvL1xuICAvLyBXaGlsZSByb2J1c3QgdXRmLTggZW5jb2RlcnMgZXhpc3QsIHRoaXMgaXMgZmFyIHNtYWxsZXIgYW5kIGZhciBtb3JlIHBlcmZvcm1hbnQuXG4gIC8vIEZvciBxdWlja2x5IGNvdW50aW5nIHBheWxvYWQgc2l6ZSBmb3IgdHJ1bmNhdGlvbiwgc21hbGxlciBpcyBiZXR0ZXIuXG5cbiAgdmFyIGNvdW50ID0gMDtcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBjb2RlID0gc3RyaW5nLmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGNvZGUgPCAxMjgpIHtcbiAgICAgIC8vIHVwIHRvIDcgYml0c1xuICAgICAgY291bnQgPSBjb3VudCArIDE7XG4gICAgfSBlbHNlIGlmIChjb2RlIDwgMjA0OCkge1xuICAgICAgLy8gdXAgdG8gMTEgYml0c1xuICAgICAgY291bnQgPSBjb3VudCArIDI7XG4gICAgfSBlbHNlIGlmIChjb2RlIDwgNjU1MzYpIHtcbiAgICAgIC8vIHVwIHRvIDE2IGJpdHNcbiAgICAgIGNvdW50ID0gY291bnQgKyAzO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb3VudDtcbn1cblxuZnVuY3Rpb24ganNvblBhcnNlKHMpIHtcbiAgdmFyIHZhbHVlLCBlcnJvcjtcbiAgdHJ5IHtcbiAgICB2YWx1ZSA9IFJvbGxiYXJKU09OLnBhcnNlKHMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgZXJyb3IgPSBlO1xuICB9XG4gIHJldHVybiB7IGVycm9yOiBlcnJvciwgdmFsdWU6IHZhbHVlIH07XG59XG5cbmZ1bmN0aW9uIG1ha2VVbmhhbmRsZWRTdGFja0luZm8oXG4gIG1lc3NhZ2UsXG4gIHVybCxcbiAgbGluZW5vLFxuICBjb2xubyxcbiAgZXJyb3IsXG4gIG1vZGUsXG4gIGJhY2t1cE1lc3NhZ2UsXG4gIGVycm9yUGFyc2VyLFxuKSB7XG4gIHZhciBsb2NhdGlvbiA9IHtcbiAgICB1cmw6IHVybCB8fCAnJyxcbiAgICBsaW5lOiBsaW5lbm8sXG4gICAgY29sdW1uOiBjb2xubyxcbiAgfTtcbiAgbG9jYXRpb24uZnVuYyA9IGVycm9yUGFyc2VyLmd1ZXNzRnVuY3Rpb25OYW1lKGxvY2F0aW9uLnVybCwgbG9jYXRpb24ubGluZSk7XG4gIGxvY2F0aW9uLmNvbnRleHQgPSBlcnJvclBhcnNlci5nYXRoZXJDb250ZXh0KGxvY2F0aW9uLnVybCwgbG9jYXRpb24ubGluZSk7XG4gIHZhciBocmVmID1cbiAgICB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmXG4gICAgZG9jdW1lbnQgJiZcbiAgICBkb2N1bWVudC5sb2NhdGlvbiAmJlxuICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWY7XG4gIHZhciB1c2VyYWdlbnQgPVxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgd2luZG93ICYmXG4gICAgd2luZG93Lm5hdmlnYXRvciAmJlxuICAgIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICByZXR1cm4ge1xuICAgIG1vZGU6IG1vZGUsXG4gICAgbWVzc2FnZTogZXJyb3IgPyBTdHJpbmcoZXJyb3IpIDogbWVzc2FnZSB8fCBiYWNrdXBNZXNzYWdlLFxuICAgIHVybDogaHJlZixcbiAgICBzdGFjazogW2xvY2F0aW9uXSxcbiAgICB1c2VyYWdlbnQ6IHVzZXJhZ2VudCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gd3JhcENhbGxiYWNrKGxvZ2dlciwgZikge1xuICByZXR1cm4gZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgIHRyeSB7XG4gICAgICBmKGVyciwgcmVzcCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbG9nZ2VyLmVycm9yKGUpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gbm9uQ2lyY3VsYXJDbG9uZShvYmopIHtcbiAgdmFyIHNlZW4gPSBbb2JqXTtcblxuICBmdW5jdGlvbiBjbG9uZShvYmosIHNlZW4pIHtcbiAgICB2YXIgdmFsdWUsXG4gICAgICBuYW1lLFxuICAgICAgbmV3U2VlbixcbiAgICAgIHJlc3VsdCA9IHt9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAobmFtZSBpbiBvYmopIHtcbiAgICAgICAgdmFsdWUgPSBvYmpbbmFtZV07XG5cbiAgICAgICAgaWYgKHZhbHVlICYmIChpc1R5cGUodmFsdWUsICdvYmplY3QnKSB8fCBpc1R5cGUodmFsdWUsICdhcnJheScpKSkge1xuICAgICAgICAgIGlmIChzZWVuLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgICAgICAgcmVzdWx0W25hbWVdID0gJ1JlbW92ZWQgY2lyY3VsYXIgcmVmZXJlbmNlOiAnICsgdHlwZU5hbWUodmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdTZWVuID0gc2Vlbi5zbGljZSgpO1xuICAgICAgICAgICAgbmV3U2Vlbi5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IGNsb25lKHZhbHVlLCBuZXdTZWVuKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHRbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXN1bHQgPSAnRmFpbGVkIGNsb25pbmcgY3VzdG9tIGRhdGE6ICcgKyBlLm1lc3NhZ2U7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGNsb25lKG9iaiwgc2Vlbik7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUl0ZW0oYXJncywgbG9nZ2VyLCBub3RpZmllciwgcmVxdWVzdEtleXMsIGxhbWJkYUNvbnRleHQpIHtcbiAgdmFyIG1lc3NhZ2UsIGVyciwgY3VzdG9tLCBjYWxsYmFjaywgcmVxdWVzdDtcbiAgdmFyIGFyZztcbiAgdmFyIGV4dHJhQXJncyA9IFtdO1xuICB2YXIgZGlhZ25vc3RpYyA9IHt9O1xuICB2YXIgYXJnVHlwZXMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3MubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcblxuICAgIHZhciB0eXAgPSB0eXBlTmFtZShhcmcpO1xuICAgIGFyZ1R5cGVzLnB1c2godHlwKTtcbiAgICBzd2l0Y2ggKHR5cCkge1xuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBtZXNzYWdlID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChtZXNzYWdlID0gYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgIGNhbGxiYWNrID0gd3JhcENhbGxiYWNrKGxvZ2dlciwgYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgZXh0cmFBcmdzLnB1c2goYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdlcnJvcic6XG4gICAgICBjYXNlICdkb21leGNlcHRpb24nOlxuICAgICAgY2FzZSAnZXhjZXB0aW9uJzogLy8gRmlyZWZveCBFeGNlcHRpb24gdHlwZVxuICAgICAgICBlcnIgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGVyciA9IGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGFyZyBpbnN0YW5jZW9mIEVycm9yIHx8XG4gICAgICAgICAgKHR5cGVvZiBET01FeGNlcHRpb24gIT09ICd1bmRlZmluZWQnICYmIGFyZyBpbnN0YW5jZW9mIERPTUV4Y2VwdGlvbilcbiAgICAgICAgKSB7XG4gICAgICAgICAgZXJyID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChlcnIgPSBhcmcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXF1ZXN0S2V5cyAmJiB0eXAgPT09ICdvYmplY3QnICYmICFyZXF1ZXN0KSB7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbiA9IHJlcXVlc3RLZXlzLmxlbmd0aDsgaiA8IGxlbjsgKytqKSB7XG4gICAgICAgICAgICBpZiAoYXJnW3JlcXVlc3RLZXlzW2pdXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHJlcXVlc3QgPSBhcmc7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVxdWVzdCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGN1c3RvbSA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoY3VzdG9tID0gYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoXG4gICAgICAgICAgYXJnIGluc3RhbmNlb2YgRXJyb3IgfHxcbiAgICAgICAgICAodHlwZW9mIERPTUV4Y2VwdGlvbiAhPT0gJ3VuZGVmaW5lZCcgJiYgYXJnIGluc3RhbmNlb2YgRE9NRXhjZXB0aW9uKVxuICAgICAgICApIHtcbiAgICAgICAgICBlcnIgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGVyciA9IGFyZyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZXh0cmFBcmdzLnB1c2goYXJnKTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiBjdXN0b20gaXMgYW4gYXJyYXkgdGhpcyB0dXJucyBpdCBpbnRvIGFuIG9iamVjdCB3aXRoIGludGVnZXIga2V5c1xuICBpZiAoY3VzdG9tKSBjdXN0b20gPSBub25DaXJjdWxhckNsb25lKGN1c3RvbSk7XG5cbiAgaWYgKGV4dHJhQXJncy5sZW5ndGggPiAwKSB7XG4gICAgaWYgKCFjdXN0b20pIGN1c3RvbSA9IG5vbkNpcmN1bGFyQ2xvbmUoe30pO1xuICAgIGN1c3RvbS5leHRyYUFyZ3MgPSBub25DaXJjdWxhckNsb25lKGV4dHJhQXJncyk7XG4gIH1cblxuICB2YXIgaXRlbSA9IHtcbiAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgIGVycjogZXJyLFxuICAgIGN1c3RvbTogY3VzdG9tLFxuICAgIHRpbWVzdGFtcDogbm93KCksXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgIG5vdGlmaWVyOiBub3RpZmllcixcbiAgICBkaWFnbm9zdGljOiBkaWFnbm9zdGljLFxuICAgIHV1aWQ6IHV1aWQ0KCksXG4gIH07XG5cbiAgaXRlbS5kYXRhID0gaXRlbS5kYXRhIHx8IHt9O1xuXG4gIHNldEN1c3RvbUl0ZW1LZXlzKGl0ZW0sIGN1c3RvbSk7XG5cbiAgaWYgKHJlcXVlc3RLZXlzICYmIHJlcXVlc3QpIHtcbiAgICBpdGVtLnJlcXVlc3QgPSByZXF1ZXN0O1xuICB9XG4gIGlmIChsYW1iZGFDb250ZXh0KSB7XG4gICAgaXRlbS5sYW1iZGFDb250ZXh0ID0gbGFtYmRhQ29udGV4dDtcbiAgfVxuICBpdGVtLl9vcmlnaW5hbEFyZ3MgPSBhcmdzO1xuICBpdGVtLmRpYWdub3N0aWMub3JpZ2luYWxfYXJnX3R5cGVzID0gYXJnVHlwZXM7XG4gIHJldHVybiBpdGVtO1xufVxuXG5mdW5jdGlvbiBzZXRDdXN0b21JdGVtS2V5cyhpdGVtLCBjdXN0b20pIHtcbiAgaWYgKGN1c3RvbSAmJiBjdXN0b20ubGV2ZWwgIT09IHVuZGVmaW5lZCkge1xuICAgIGl0ZW0ubGV2ZWwgPSBjdXN0b20ubGV2ZWw7XG4gICAgZGVsZXRlIGN1c3RvbS5sZXZlbDtcbiAgfVxuICBpZiAoY3VzdG9tICYmIGN1c3RvbS5za2lwRnJhbWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICBpdGVtLnNraXBGcmFtZXMgPSBjdXN0b20uc2tpcEZyYW1lcztcbiAgICBkZWxldGUgY3VzdG9tLnNraXBGcmFtZXM7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkRXJyb3JDb250ZXh0KGl0ZW0sIGVycm9ycykge1xuICB2YXIgY3VzdG9tID0gaXRlbS5kYXRhLmN1c3RvbSB8fCB7fTtcbiAgdmFyIGNvbnRleHRBZGRlZCA9IGZhbHNlO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlcnJvcnMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChlcnJvcnNbaV0uaGFzT3duUHJvcGVydHkoJ3JvbGxiYXJDb250ZXh0JykpIHtcbiAgICAgICAgY3VzdG9tID0gbWVyZ2UoY3VzdG9tLCBub25DaXJjdWxhckNsb25lKGVycm9yc1tpXS5yb2xsYmFyQ29udGV4dCkpO1xuICAgICAgICBjb250ZXh0QWRkZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEF2b2lkIGFkZGluZyBhbiBlbXB0eSBvYmplY3QgdG8gdGhlIGRhdGEuXG4gICAgaWYgKGNvbnRleHRBZGRlZCkge1xuICAgICAgaXRlbS5kYXRhLmN1c3RvbSA9IGN1c3RvbTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpdGVtLmRpYWdub3N0aWMuZXJyb3JfY29udGV4dCA9ICdGYWlsZWQ6ICcgKyBlLm1lc3NhZ2U7XG4gIH1cbn1cblxudmFyIFRFTEVNRVRSWV9UWVBFUyA9IFtcbiAgJ2xvZycsXG4gICduZXR3b3JrJyxcbiAgJ2RvbScsXG4gICduYXZpZ2F0aW9uJyxcbiAgJ2Vycm9yJyxcbiAgJ21hbnVhbCcsXG5dO1xudmFyIFRFTEVNRVRSWV9MRVZFTFMgPSBbJ2NyaXRpY2FsJywgJ2Vycm9yJywgJ3dhcm5pbmcnLCAnaW5mbycsICdkZWJ1ZyddO1xuXG5mdW5jdGlvbiBhcnJheUluY2x1ZGVzKGFyciwgdmFsKSB7XG4gIGZvciAodmFyIGsgPSAwOyBrIDwgYXJyLmxlbmd0aDsgKytrKSB7XG4gICAgaWYgKGFycltrXSA9PT0gdmFsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRlbGVtZXRyeUV2ZW50KGFyZ3MpIHtcbiAgdmFyIHR5cGUsIG1ldGFkYXRhLCBsZXZlbDtcbiAgdmFyIGFyZztcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3MubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcblxuICAgIHZhciB0eXAgPSB0eXBlTmFtZShhcmcpO1xuICAgIHN3aXRjaCAodHlwKSB7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBpZiAoIXR5cGUgJiYgYXJyYXlJbmNsdWRlcyhURUxFTUVUUllfVFlQRVMsIGFyZykpIHtcbiAgICAgICAgICB0eXBlID0gYXJnO1xuICAgICAgICB9IGVsc2UgaWYgKCFsZXZlbCAmJiBhcnJheUluY2x1ZGVzKFRFTEVNRVRSWV9MRVZFTFMsIGFyZykpIHtcbiAgICAgICAgICBsZXZlbCA9IGFyZztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIG1ldGFkYXRhID0gYXJnO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICB2YXIgZXZlbnQgPSB7XG4gICAgdHlwZTogdHlwZSB8fCAnbWFudWFsJyxcbiAgICBtZXRhZGF0YTogbWV0YWRhdGEgfHwge30sXG4gICAgbGV2ZWw6IGxldmVsLFxuICB9O1xuXG4gIHJldHVybiBldmVudDtcbn1cblxuZnVuY3Rpb24gYWRkSXRlbUF0dHJpYnV0ZXMoaXRlbSwgYXR0cmlidXRlcykge1xuICBpdGVtLmRhdGEuYXR0cmlidXRlcyA9IGl0ZW0uZGF0YS5hdHRyaWJ1dGVzIHx8IFtdO1xuICBpZiAoYXR0cmlidXRlcykge1xuICAgIGl0ZW0uZGF0YS5hdHRyaWJ1dGVzLnB1c2goLi4uYXR0cmlidXRlcyk7XG4gIH1cbn1cblxuLypcbiAqIGdldCAtIGdpdmVuIGFuIG9iai9hcnJheSBhbmQgYSBrZXlwYXRoLCByZXR1cm4gdGhlIHZhbHVlIGF0IHRoYXQga2V5cGF0aCBvclxuICogICAgICAgdW5kZWZpbmVkIGlmIG5vdCBwb3NzaWJsZS5cbiAqXG4gKiBAcGFyYW0gb2JqIC0gYW4gb2JqZWN0IG9yIGFycmF5XG4gKiBAcGFyYW0gcGF0aCAtIGEgc3RyaW5nIG9mIGtleXMgc2VwYXJhdGVkIGJ5ICcuJyBzdWNoIGFzICdwbHVnaW4uanF1ZXJ5LjAubWVzc2FnZSdcbiAqICAgIHdoaWNoIHdvdWxkIGNvcnJlc3BvbmQgdG8gNDIgaW4gYHtwbHVnaW46IHtqcXVlcnk6IFt7bWVzc2FnZTogNDJ9XX19YFxuICovXG5mdW5jdGlvbiBnZXQob2JqLCBwYXRoKSB7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICB2YXIga2V5cyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgdmFyIHJlc3VsdCA9IG9iajtcbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0ga2V5cy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0W2tleXNbaV1dO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzZXQob2JqLCBwYXRoLCB2YWx1ZSkge1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIga2V5cyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgdmFyIGxlbiA9IGtleXMubGVuZ3RoO1xuICBpZiAobGVuIDwgMSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAobGVuID09PSAxKSB7XG4gICAgb2JqW2tleXNbMF1dID0gdmFsdWU7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRyeSB7XG4gICAgdmFyIHRlbXAgPSBvYmpba2V5c1swXV0gfHwge307XG4gICAgdmFyIHJlcGxhY2VtZW50ID0gdGVtcDtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxlbiAtIDE7ICsraSkge1xuICAgICAgdGVtcFtrZXlzW2ldXSA9IHRlbXBba2V5c1tpXV0gfHwge307XG4gICAgICB0ZW1wID0gdGVtcFtrZXlzW2ldXTtcbiAgICB9XG4gICAgdGVtcFtrZXlzW2xlbiAtIDFdXSA9IHZhbHVlO1xuICAgIG9ialtrZXlzWzBdXSA9IHJlcGxhY2VtZW50O1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3NBc1N0cmluZyhhcmdzKSB7XG4gIHZhciBpLCBsZW4sIGFyZztcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKGkgPSAwLCBsZW4gPSBhcmdzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcbiAgICBzd2l0Y2ggKHR5cGVOYW1lKGFyZykpIHtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGFyZyA9IHN0cmluZ2lmeShhcmcpO1xuICAgICAgICBhcmcgPSBhcmcuZXJyb3IgfHwgYXJnLnZhbHVlO1xuICAgICAgICBpZiAoYXJnLmxlbmd0aCA+IDUwMCkge1xuICAgICAgICAgIGFyZyA9IGFyZy5zdWJzdHIoMCwgNDk3KSArICcuLi4nO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbnVsbCc6XG4gICAgICAgIGFyZyA9ICdudWxsJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICBhcmcgPSAndW5kZWZpbmVkJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzeW1ib2wnOlxuICAgICAgICBhcmcgPSBhcmcudG9TdHJpbmcoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKGFyZyk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdC5qb2luKCcgJyk7XG59XG5cbmZ1bmN0aW9uIG5vdygpIHtcbiAgaWYgKERhdGUubm93KSB7XG4gICAgcmV0dXJuICtEYXRlLm5vdygpO1xuICB9XG4gIHJldHVybiArbmV3IERhdGUoKTtcbn1cblxuZnVuY3Rpb24gZmlsdGVySXAocmVxdWVzdERhdGEsIGNhcHR1cmVJcCkge1xuICBpZiAoIXJlcXVlc3REYXRhIHx8ICFyZXF1ZXN0RGF0YVsndXNlcl9pcCddIHx8IGNhcHR1cmVJcCA9PT0gdHJ1ZSkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbmV3SXAgPSByZXF1ZXN0RGF0YVsndXNlcl9pcCddO1xuICBpZiAoIWNhcHR1cmVJcCkge1xuICAgIG5ld0lwID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICB0cnkge1xuICAgICAgdmFyIHBhcnRzO1xuICAgICAgaWYgKG5ld0lwLmluZGV4T2YoJy4nKSAhPT0gLTEpIHtcbiAgICAgICAgcGFydHMgPSBuZXdJcC5zcGxpdCgnLicpO1xuICAgICAgICBwYXJ0cy5wb3AoKTtcbiAgICAgICAgcGFydHMucHVzaCgnMCcpO1xuICAgICAgICBuZXdJcCA9IHBhcnRzLmpvaW4oJy4nKTtcbiAgICAgIH0gZWxzZSBpZiAobmV3SXAuaW5kZXhPZignOicpICE9PSAtMSkge1xuICAgICAgICBwYXJ0cyA9IG5ld0lwLnNwbGl0KCc6Jyk7XG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgdmFyIGJlZ2lubmluZyA9IHBhcnRzLnNsaWNlKDAsIDMpO1xuICAgICAgICAgIHZhciBzbGFzaElkeCA9IGJlZ2lubmluZ1syXS5pbmRleE9mKCcvJyk7XG4gICAgICAgICAgaWYgKHNsYXNoSWR4ICE9PSAtMSkge1xuICAgICAgICAgICAgYmVnaW5uaW5nWzJdID0gYmVnaW5uaW5nWzJdLnN1YnN0cmluZygwLCBzbGFzaElkeCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB0ZXJtaW5hbCA9ICcwMDAwOjAwMDA6MDAwMDowMDAwOjAwMDAnO1xuICAgICAgICAgIG5ld0lwID0gYmVnaW5uaW5nLmNvbmNhdCh0ZXJtaW5hbCkuam9pbignOicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdJcCA9IG51bGw7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbmV3SXAgPSBudWxsO1xuICAgIH1cbiAgfVxuICByZXF1ZXN0RGF0YVsndXNlcl9pcCddID0gbmV3SXA7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU9wdGlvbnMoY3VycmVudCwgaW5wdXQsIHBheWxvYWQsIGxvZ2dlcikge1xuICB2YXIgcmVzdWx0ID0gbWVyZ2UoY3VycmVudCwgaW5wdXQsIHBheWxvYWQpO1xuICByZXN1bHQgPSB1cGRhdGVEZXByZWNhdGVkT3B0aW9ucyhyZXN1bHQsIGxvZ2dlcik7XG4gIGlmICghaW5wdXQgfHwgaW5wdXQub3ZlcndyaXRlU2NydWJGaWVsZHMpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGlmIChpbnB1dC5zY3J1YkZpZWxkcykge1xuICAgIHJlc3VsdC5zY3J1YkZpZWxkcyA9IChjdXJyZW50LnNjcnViRmllbGRzIHx8IFtdKS5jb25jYXQoaW5wdXQuc2NydWJGaWVsZHMpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZURlcHJlY2F0ZWRPcHRpb25zKG9wdGlvbnMsIGxvZ2dlcikge1xuICBpZiAob3B0aW9ucy5ob3N0V2hpdGVMaXN0ICYmICFvcHRpb25zLmhvc3RTYWZlTGlzdCkge1xuICAgIG9wdGlvbnMuaG9zdFNhZmVMaXN0ID0gb3B0aW9ucy5ob3N0V2hpdGVMaXN0O1xuICAgIG9wdGlvbnMuaG9zdFdoaXRlTGlzdCA9IHVuZGVmaW5lZDtcbiAgICBsb2dnZXIgJiYgbG9nZ2VyLmxvZygnaG9zdFdoaXRlTGlzdCBpcyBkZXByZWNhdGVkLiBVc2UgaG9zdFNhZmVMaXN0LicpO1xuICB9XG4gIGlmIChvcHRpb25zLmhvc3RCbGFja0xpc3QgJiYgIW9wdGlvbnMuaG9zdEJsb2NrTGlzdCkge1xuICAgIG9wdGlvbnMuaG9zdEJsb2NrTGlzdCA9IG9wdGlvbnMuaG9zdEJsYWNrTGlzdDtcbiAgICBvcHRpb25zLmhvc3RCbGFja0xpc3QgPSB1bmRlZmluZWQ7XG4gICAgbG9nZ2VyICYmIGxvZ2dlci5sb2coJ2hvc3RCbGFja0xpc3QgaXMgZGVwcmVjYXRlZC4gVXNlIGhvc3RCbG9ja0xpc3QuJyk7XG4gIH1cbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aDogYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGgsXG4gIGNyZWF0ZUl0ZW06IGNyZWF0ZUl0ZW0sXG4gIGFkZEVycm9yQ29udGV4dDogYWRkRXJyb3JDb250ZXh0LFxuICBjcmVhdGVUZWxlbWV0cnlFdmVudDogY3JlYXRlVGVsZW1ldHJ5RXZlbnQsXG4gIGFkZEl0ZW1BdHRyaWJ1dGVzOiBhZGRJdGVtQXR0cmlidXRlcyxcbiAgZmlsdGVySXA6IGZpbHRlcklwLFxuICBmb3JtYXRBcmdzQXNTdHJpbmc6IGZvcm1hdEFyZ3NBc1N0cmluZyxcbiAgZm9ybWF0VXJsOiBmb3JtYXRVcmwsXG4gIGdldDogZ2V0LFxuICBoYW5kbGVPcHRpb25zOiBoYW5kbGVPcHRpb25zLFxuICBpc0Vycm9yOiBpc0Vycm9yLFxuICBpc0Zpbml0ZU51bWJlcjogaXNGaW5pdGVOdW1iZXIsXG4gIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gIGlzSXRlcmFibGU6IGlzSXRlcmFibGUsXG4gIGlzTmF0aXZlRnVuY3Rpb246IGlzTmF0aXZlRnVuY3Rpb24sXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc1R5cGU6IGlzVHlwZSxcbiAgaXNQcm9taXNlOiBpc1Byb21pc2UsXG4gIGlzQnJvd3NlcjogaXNCcm93c2VyLFxuICBqc29uUGFyc2U6IGpzb25QYXJzZSxcbiAgTEVWRUxTOiBMRVZFTFMsXG4gIG1ha2VVbmhhbmRsZWRTdGFja0luZm86IG1ha2VVbmhhbmRsZWRTdGFja0luZm8sXG4gIG1lcmdlOiBtZXJnZSxcbiAgbm93OiBub3csXG4gIHJlZGFjdDogcmVkYWN0LFxuICBSb2xsYmFySlNPTjogUm9sbGJhckpTT04sXG4gIHNhbml0aXplVXJsOiBzYW5pdGl6ZVVybCxcbiAgc2V0OiBzZXQsXG4gIHNldHVwSlNPTjogc2V0dXBKU09OLFxuICBzdHJpbmdpZnk6IHN0cmluZ2lmeSxcbiAgbWF4Qnl0ZVNpemU6IG1heEJ5dGVTaXplLFxuICB0eXBlTmFtZTogdHlwZU5hbWUsXG4gIHV1aWQ0OiB1dWlkNCxcbn07XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWxpdHknKTtcblxuZnVuY3Rpb24gdHJhdmVyc2Uob2JqLCBmdW5jLCBzZWVuKSB7XG4gIHZhciBrLCB2LCBpO1xuICB2YXIgaXNPYmogPSBfLmlzVHlwZShvYmosICdvYmplY3QnKTtcbiAgdmFyIGlzQXJyYXkgPSBfLmlzVHlwZShvYmosICdhcnJheScpO1xuICB2YXIga2V5cyA9IFtdO1xuICB2YXIgc2VlbkluZGV4O1xuXG4gIC8vIEJlc3QgbWlnaHQgYmUgdG8gdXNlIE1hcCBoZXJlIHdpdGggYG9iamAgYXMgdGhlIGtleXMsIGJ1dCB3ZSB3YW50IHRvIHN1cHBvcnQgSUUgPCAxMS5cbiAgc2VlbiA9IHNlZW4gfHwgeyBvYmo6IFtdLCBtYXBwZWQ6IFtdIH07XG5cbiAgaWYgKGlzT2JqKSB7XG4gICAgc2VlbkluZGV4ID0gc2Vlbi5vYmouaW5kZXhPZihvYmopO1xuXG4gICAgaWYgKGlzT2JqICYmIHNlZW5JbmRleCAhPT0gLTEpIHtcbiAgICAgIC8vIFByZWZlciB0aGUgbWFwcGVkIG9iamVjdCBpZiB0aGVyZSBpcyBvbmUuXG4gICAgICByZXR1cm4gc2Vlbi5tYXBwZWRbc2VlbkluZGV4XSB8fCBzZWVuLm9ialtzZWVuSW5kZXhdO1xuICAgIH1cblxuICAgIHNlZW4ub2JqLnB1c2gob2JqKTtcbiAgICBzZWVuSW5kZXggPSBzZWVuLm9iai5sZW5ndGggLSAxO1xuICB9XG5cbiAgaWYgKGlzT2JqKSB7XG4gICAgZm9yIChrIGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGspKSB7XG4gICAgICAgIGtleXMucHVzaChrKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNBcnJheSkge1xuICAgIGZvciAoaSA9IDA7IGkgPCBvYmoubGVuZ3RoOyArK2kpIHtcbiAgICAgIGtleXMucHVzaChpKTtcbiAgICB9XG4gIH1cblxuICB2YXIgcmVzdWx0ID0gaXNPYmogPyB7fSA6IFtdO1xuICB2YXIgc2FtZSA9IHRydWU7XG4gIGZvciAoaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgayA9IGtleXNbaV07XG4gICAgdiA9IG9ialtrXTtcbiAgICByZXN1bHRba10gPSBmdW5jKGssIHYsIHNlZW4pO1xuICAgIHNhbWUgPSBzYW1lICYmIHJlc3VsdFtrXSA9PT0gb2JqW2tdO1xuICB9XG5cbiAgaWYgKGlzT2JqICYmICFzYW1lKSB7XG4gICAgc2Vlbi5tYXBwZWRbc2VlbkluZGV4XSA9IHJlc3VsdDtcbiAgfVxuXG4gIHJldHVybiAhc2FtZSA/IHJlc3VsdCA6IG9iajtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0cmF2ZXJzZTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvKiBnbG9iYWxzIGV4cGVjdCAqL1xuLyogZ2xvYmFscyBkZXNjcmliZSAqL1xuLyogZ2xvYmFscyBpdCAqL1xuXG52YXIgdCA9IHJlcXVpcmUoJy4uL3NyYy90cnVuY2F0aW9uJyk7XG52YXIgdXRpbGl0eSA9IHJlcXVpcmUoJy4uL3NyYy91dGlsaXR5Jyk7XG51dGlsaXR5LnNldHVwSlNPTigpO1xuXG5kZXNjcmliZSgndHJ1bmNhdGUnLCBmdW5jdGlvbiAoKSB7XG4gIGl0KCdzaG91bGQgbm90IHRydW5jYXRlIHNvbWV0aGluZyBzbWFsbCBlbm91Z2gnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBheWxvYWQgPSBtZXNzYWdlUGF5bG9hZCgnaGVsbG8gd29ybGQnKTtcbiAgICB2YXIgcmVzdWx0ID0gdC50cnVuY2F0ZShwYXlsb2FkKTtcbiAgICBleHBlY3QocmVzdWx0LnZhbHVlKS50by5iZS5vaygpO1xuXG4gICAgdmFyIHJlc3VsdFZhbHVlID0gSlNPTi5wYXJzZShyZXN1bHQudmFsdWUpO1xuICAgIGV4cGVjdChyZXN1bHRWYWx1ZSkudG8uZXFsKHBheWxvYWQpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHRyeSBhbGwgc3RyYXRlZ2llcyBpZiBwYXlsb2FkIHRvbyBiaWcnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBheWxvYWQgPSB0cmFjZVBheWxvYWQoMTAsIHJlcGVhdCgnYScsIDUwMCkpO1xuICAgIHZhciByZXN1bHQgPSB0LnRydW5jYXRlKHBheWxvYWQsIHVuZGVmaW5lZCwgMSk7XG4gICAgZXhwZWN0KHJlc3VsdC52YWx1ZSkudG8uYmUub2soKTtcblxuICAgIHZhciByZXN1bHRWYWx1ZSA9IEpTT04ucGFyc2UocmVzdWx0LnZhbHVlKTtcblxuICAgIGV4cGVjdChyZXN1bHRWYWx1ZS5kYXRhLmJvZHkudHJhY2UuZXhjZXB0aW9uLmRlc2NyaXB0aW9uKS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QocmVzdWx0VmFsdWUuZGF0YS5ib2R5LnRyYWNlLmV4Y2VwdGlvbi5tZXNzYWdlLmxlbmd0aCkudG8uYmUuYmVsb3coXG4gICAgICAyNTYsXG4gICAgKTtcbiAgICBleHBlY3QocmVzdWx0VmFsdWUuZGF0YS5ib2R5LnRyYWNlLmZyYW1lcy5sZW5ndGgpLnRvLmJlLmJlbG93KDMpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIG5vdCB0cnVuY2F0ZSBhc2NpaSBwYXlsb2FkIGNsb3NlIHRvIG1heCBzaXplJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwYXlsb2FkID0gdHJhY2VQYXlsb2FkKDEwLCByZXBlYXQoJ2knLCA1MDApKTtcbiAgICB2YXIgcmVzdWx0ID0gdC50cnVuY2F0ZShwYXlsb2FkLCB1bmRlZmluZWQsIDExMDApOyAvLyBwYXlsb2FkIHdpbGwgYmUgNTAwICsgNTI4XG4gICAgZXhwZWN0KHJlc3VsdC52YWx1ZSkudG8uYmUub2soKTtcblxuICAgIHZhciByZXN1bHRWYWx1ZSA9IEpTT04ucGFyc2UocmVzdWx0LnZhbHVlKTtcbiAgICBleHBlY3QocmVzdWx0VmFsdWUpLnRvLmVxbChwYXlsb2FkKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB0cnVuY2F0ZSBub24tYXNjaWkgcGF5bG9hZCB3aGVuIG92ZXJzaXplJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwYXlsb2FkID0gdHJhY2VQYXlsb2FkKDEwLCByZXBlYXQoJ+OBgicsIDUwMCkpOyAvLyDjgYIgaXMgMyB1dGYtOCBieXRlcyAoVSszMDQyKVxuICAgIHZhciByZXN1bHQgPSB0LnRydW5jYXRlKHBheWxvYWQsIHVuZGVmaW5lZCwgMTEwMCk7IC8vIHBheWxvYWQgd2lsbCBiZSAxNTAwICsgNTI4XG4gICAgZXhwZWN0KHJlc3VsdC52YWx1ZSkudG8uYmUub2soKTtcblxuICAgIHZhciByZXN1bHRWYWx1ZSA9IEpTT04ucGFyc2UocmVzdWx0LnZhbHVlKTtcbiAgICBleHBlY3QocmVzdWx0VmFsdWUuZGF0YS5ib2R5LnRyYWNlLmZyYW1lcy5sZW5ndGgpLnRvLmJlLmJlbG93KDMpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgncmF3JywgZnVuY3Rpb24gKCkge1xuICBpdCgnc2hvdWxkIGRvIG5vdGhpbmcnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBheWxvYWQgPSBtZXNzYWdlUGF5bG9hZCgnc29tZXRoaW5nJyk7XG4gICAgdmFyIHJhd1Jlc3VsdCA9IHQucmF3KHBheWxvYWQpO1xuICAgIGV4cGVjdChyYXdSZXN1bHRbMF0pLnRvLmVxbChwYXlsb2FkKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ3RydW5jYXRlRnJhbWVzJywgZnVuY3Rpb24gKCkge1xuICBpdCgnc2hvdWxkIGRvIG5vdGhpbmcgd2l0aCBzbWFsbCBudW1iZXIgb2YgZnJhbWVzJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwYXlsb2FkID0gdHJhY2VQYXlsb2FkKDUpO1xuICAgIHZhciByZXN1bHQgPSB0LnRydW5jYXRlRnJhbWVzKHBheWxvYWQsIHVuZGVmaW5lZCwgNSk7XG4gICAgdmFyIHJlc3VsdFAgPSByZXN1bHRbMF07XG4gICAgZXhwZWN0KHJlc3VsdFAuZGF0YS5ib2R5LnRyYWNlLmZyYW1lcy5sZW5ndGgpLnRvLmVxbCg1KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBjdXQgb3V0IG1pZGRsZSBmcmFtZXMgaWYgdG9vIG1hbnknLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBheWxvYWQgPSB0cmFjZVBheWxvYWQoMjApO1xuICAgIHZhciByZXN1bHQgPSB0LnRydW5jYXRlRnJhbWVzKHBheWxvYWQsIHVuZGVmaW5lZCwgNSk7XG4gICAgdmFyIHJlc3VsdFAgPSByZXN1bHRbMF07XG4gICAgZXhwZWN0KHJlc3VsdFAuZGF0YS5ib2R5LnRyYWNlLmZyYW1lcy5sZW5ndGgpLnRvLmVxbCgxMCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgZG8gbm90aGluZyB3aXRoIHNtYWxsIG51bWJlciBvZiBmcmFtZXMgdHJhY2VfY2hhaW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBheWxvYWQgPSB0cmFjZUNoYWluUGF5bG9hZCg0LCA1KTtcbiAgICB2YXIgcmVzdWx0ID0gdC50cnVuY2F0ZUZyYW1lcyhwYXlsb2FkLCB1bmRlZmluZWQsIDUpO1xuICAgIHZhciByZXN1bHRQID0gcmVzdWx0WzBdO1xuICAgIGV4cGVjdChyZXN1bHRQLmRhdGEuYm9keS50cmFjZV9jaGFpblswXS5mcmFtZXMubGVuZ3RoKS50by5lcWwoNSk7XG4gICAgZXhwZWN0KHJlc3VsdFAuZGF0YS5ib2R5LnRyYWNlX2NoYWluWzNdLmZyYW1lcy5sZW5ndGgpLnRvLmVxbCg1KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBjdXQgb3V0IG1pZGRsZSBmcmFtZXMgaWYgdG9vIG1hbnkgdHJhY2VfY2hhaW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBheWxvYWQgPSB0cmFjZUNoYWluUGF5bG9hZCg0LCAyMCk7XG4gICAgdmFyIHJlc3VsdCA9IHQudHJ1bmNhdGVGcmFtZXMocGF5bG9hZCwgdW5kZWZpbmVkLCA1KTtcbiAgICB2YXIgcmVzdWx0UCA9IHJlc3VsdFswXTtcbiAgICBleHBlY3QocmVzdWx0UC5kYXRhLmJvZHkudHJhY2VfY2hhaW5bMF0uZnJhbWVzLmxlbmd0aCkudG8uZXFsKDEwKTtcbiAgICBleHBlY3QocmVzdWx0UC5kYXRhLmJvZHkudHJhY2VfY2hhaW5bM10uZnJhbWVzLmxlbmd0aCkudG8uZXFsKDEwKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ3RydW5jYXRlU3RyaW5ncycsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCB3b3JrIHJlY3Vyc2l2ZWx5IG9uIGRpZmZlcmVudCBzdHJpbmcgc2l6ZXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBheWxvYWQgPSB7XG4gICAgICBhY2Nlc3NfdG9rZW46ICdhYmMnLFxuICAgICAgZGF0YToge1xuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgc21hbGw6ICdpIGFtIGEgc21hbGwgc3RyaW5nJyxcbiAgICAgICAgICBiaWc6IHJlcGVhdCgnaGVsbG8gd29ybGQnLCAyMCksXG4gICAgICAgICAgZXhhY3Q6IHJlcGVhdCgnYScsIDUwKSxcbiAgICAgICAgICBleGFjdFBsdXNPbmU6IHJlcGVhdCgnYScsIDUxKSxcbiAgICAgICAgfSxcbiAgICAgICAgb3RoZXI6ICd0aGlzIGlzIG9rJyxcbiAgICAgICAgbm90OiByZXBlYXQoJ3RvbyBiaWcnLCAzMCksXG4gICAgICB9LFxuICAgIH07XG5cbiAgICB2YXIgcmVzdWx0ID0gdC50cnVuY2F0ZVN0cmluZ3MoNTAsIHBheWxvYWQpO1xuICAgIHZhciByZXN1bHRQID0gcmVzdWx0WzBdO1xuXG4gICAgZXhwZWN0KHJlc3VsdFAuZGF0YS5ib2R5LnNtYWxsLmxlbmd0aCkudG8uZXFsKDE5KTtcbiAgICBleHBlY3QocmVzdWx0UC5kYXRhLmJvZHkuYmlnLmxlbmd0aCkudG8uZXFsKDUwKTtcbiAgICBleHBlY3QocmVzdWx0UC5kYXRhLmJvZHkuZXhhY3QubGVuZ3RoKS50by5lcWwoNTApO1xuICAgIGV4cGVjdChyZXN1bHRQLmRhdGEuYm9keS5leGFjdFs0OV0pLnRvLmVxbCgnYScpO1xuICAgIGV4cGVjdChyZXN1bHRQLmRhdGEuYm9keS5leGFjdFBsdXNPbmUubGVuZ3RoKS50by5lcWwoNTApO1xuICAgIGV4cGVjdChyZXN1bHRQLmRhdGEuYm9keS5leGFjdFBsdXNPbmVbNDldKS50by5lcWwoJy4nKTtcbiAgICBleHBlY3QocmVzdWx0UC5kYXRhLm90aGVyLmxlbmd0aCkudG8uZXFsKDEwKTtcbiAgICBleHBlY3QocmVzdWx0UC5kYXRhLm5vdC5sZW5ndGgpLnRvLmVxbCg1MCk7XG4gICAgZXhwZWN0KHJlc3VsdFAuZGF0YS5ub3RbNDldKS50by5lcWwoJy4nKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ21heWJlVHJ1bmNhdGVWYWx1ZScsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCBoYW5kbGUgZmFsc2V5IHRoaW5ncycsIGZ1bmN0aW9uICgpIHtcbiAgICBleHBlY3QodC5tYXliZVRydW5jYXRlVmFsdWUoNDIsIG51bGwpKS50by5iZShudWxsKTtcbiAgICBleHBlY3QodC5tYXliZVRydW5jYXRlVmFsdWUoNDIsIGZhbHNlKSkudG8uZXFsKGZhbHNlKTtcbiAgICBleHBlY3QodC5tYXliZVRydW5jYXRlVmFsdWUoNDIsIHVuZGVmaW5lZCkpLnRvLmJlKHVuZGVmaW5lZCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgaGFuZGxlIHN0cmluZ3Mgc2hvcnRlciB0aGFuIHRoZSBsZW5ndGgnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxlbiA9IDEwO1xuICAgIHZhciB2YWwgPSAnaGVsbG8nO1xuICAgIHZhciByZXN1bHQgPSB0Lm1heWJlVHJ1bmNhdGVWYWx1ZShsZW4sIHZhbCk7XG4gICAgZXhwZWN0KHJlc3VsdCkudG8uZXFsKHZhbCk7XG4gICAgZXhwZWN0KHJlc3VsdC5sZW5ndGgpLnRvLmJlLmJlbG93KGxlbiArIDEpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBoYW5kbGUgc3RyaW5ncyBsb25nZXIgdGhhbiB0aGUgbGVuZ3RoJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBsZW4gPSAxMDtcbiAgICB2YXIgdmFsID0gcmVwZWF0KCdoZWxsbycsIDMpO1xuICAgIHZhciByZXN1bHQgPSB0Lm1heWJlVHJ1bmNhdGVWYWx1ZShsZW4sIHZhbCk7XG4gICAgZXhwZWN0KHJlc3VsdCkudG8ubm90LmVxbCh2YWwpO1xuICAgIGV4cGVjdChyZXN1bHQubGVuZ3RoKS50by5iZS5iZWxvdyhsZW4gKyAxKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgaGFuZGxlIGFycmF5cyBzaG9ydGVyIHRoYW4gdGhlIGxlbmd0aCcsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbGVuID0gMTA7XG4gICAgdmFyIHZhbCA9IHJlcGVhdCgnYSwnLCA4KS5zcGxpdCgnLCcpO1xuICAgIHZhbC5wb3AoKTtcbiAgICB2YXIgcmVzdWx0ID0gdC5tYXliZVRydW5jYXRlVmFsdWUobGVuLCB2YWwpO1xuICAgIGV4cGVjdChyZXN1bHQpLnRvLmVxbCh2YWwpO1xuICAgIGV4cGVjdChyZXN1bHQubGVuZ3RoKS50by5iZS5iZWxvdyhsZW4gKyAxKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgaGFuZGxlIGFycmF5cyBsb25nZXIgdGhhbiB0aGUgbGVuZ3RoJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBsZW4gPSAxMDtcbiAgICB2YXIgdmFsID0gcmVwZWF0KCdhLCcsIDEyKS5zcGxpdCgnLCcpO1xuICAgIHZhbC5wb3AoKTtcbiAgICB2YXIgcmVzdWx0ID0gdC5tYXliZVRydW5jYXRlVmFsdWUobGVuLCB2YWwpO1xuICAgIGV4cGVjdChyZXN1bHQpLnRvLm5vdC5lcWwodmFsKTtcbiAgICBleHBlY3QocmVzdWx0Lmxlbmd0aCkudG8uYmUuYmVsb3cobGVuICsgMSk7XG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIG1lc3NhZ2VQYXlsb2FkKG1lc3NhZ2UpIHtcbiAgcmV0dXJuIHtcbiAgICBhY2Nlc3NfdG9rZW46ICdhYmMnLFxuICAgIGRhdGE6IHtcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgbWVzc2FnZToge1xuICAgICAgICAgIGJvZHk6IG1lc3NhZ2UsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH07XG59XG5cbmZ1bmN0aW9uIHRyYWNlUGF5bG9hZChmcmFtZUNvdW50LCBtZXNzYWdlKSB7XG4gIG1lc3NhZ2UgPSB0eXBlb2YgbWVzc2FnZSAhPT0gJ3VuZGVmaW5lZCcgPyBtZXNzYWdlIDogJ0VYQ0VQVElPTiBNRVNTQUdFJztcbiAgdmFyIGZyYW1lcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGZyYW1lQ291bnQ7IGkrKykge1xuICAgIGZyYW1lcy5wdXNoKHtcbiAgICAgIGZpbGVuYW1lOiAnc29tZS9maWxlL25hbWUnLFxuICAgICAgbGluZW5vOiBpLFxuICAgIH0pO1xuICB9XG4gIHJldHVybiB7XG4gICAgYWNjZXNzX3Rva2VuOiAnYWJjJyxcbiAgICBkYXRhOiB7XG4gICAgICBib2R5OiB7XG4gICAgICAgIHRyYWNlOiB7XG4gICAgICAgICAgZXhjZXB0aW9uOiB7XG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0FMTCBZT1VSIEJBU0UnLFxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZyYW1lczogZnJhbWVzLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9O1xufVxuXG5mdW5jdGlvbiB0cmFjZUNoYWluUGF5bG9hZCh0cmFjZUNvdW50LCBmcmFtZUNvdW50LCBtZXNzYWdlKSB7XG4gIG1lc3NhZ2UgPSB0eXBlb2YgbWVzc2FnZSAhPT0gJ3VuZGVmaW5lZCcgPyBtZXNzYWdlIDogJ0VYQ0VQVElPTiBNRVNTQUdFJztcbiAgdmFyIGNoYWluID0gW107XG4gIGZvciAodmFyIGMgPSAwOyBjIDwgdHJhY2VDb3VudDsgYysrKSB7XG4gICAgdmFyIGZyYW1lcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZnJhbWVDb3VudDsgaSsrKSB7XG4gICAgICBmcmFtZXMucHVzaCh7XG4gICAgICAgIGZpbGVuYW1lOiAnc29tZS9maWxlL25hbWU6OicgKyBjLFxuICAgICAgICBsaW5lbm86IGksXG4gICAgICB9KTtcbiAgICB9XG4gICAgY2hhaW4ucHVzaCh7XG4gICAgICBleGNlcHRpb246IHtcbiAgICAgICAgZGVzY3JpcHRpb246ICdBTEwgWU9VUiBCQVNFIDo6ICcgKyBjLFxuICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgfSxcbiAgICAgIGZyYW1lczogZnJhbWVzLFxuICAgIH0pO1xuICB9XG4gIHJldHVybiB7XG4gICAgYWNjZXNzX3Rva2VuOiAnYWJjJyxcbiAgICBkYXRhOiB7XG4gICAgICBib2R5OiB7XG4gICAgICAgIHRyYWNlX2NoYWluOiBjaGFpbixcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVwZWF0KHMsIG4pIHtcbiAgdmFyIHJlc3VsdCA9IHM7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgbjsgaSsrKSB7XG4gICAgcmVzdWx0ICs9IHM7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiJdLCJuYW1lcyI6WyJoYXNPd24iLCJPYmplY3QiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsInRvU3RyIiwidG9TdHJpbmciLCJpc1BsYWluT2JqZWN0Iiwib2JqIiwiY2FsbCIsImhhc093bkNvbnN0cnVjdG9yIiwiaGFzSXNQcm90b3R5cGVPZiIsImNvbnN0cnVjdG9yIiwia2V5IiwibWVyZ2UiLCJpIiwic3JjIiwiY29weSIsImNsb25lIiwibmFtZSIsInJlc3VsdCIsImN1cnJlbnQiLCJsZW5ndGgiLCJhcmd1bWVudHMiLCJtb2R1bGUiLCJleHBvcnRzIiwiXyIsInJlcXVpcmUiLCJ0cmF2ZXJzZSIsInJhdyIsInBheWxvYWQiLCJqc29uQmFja3VwIiwic3RyaW5naWZ5Iiwic2VsZWN0RnJhbWVzIiwiZnJhbWVzIiwicmFuZ2UiLCJsZW4iLCJzbGljZSIsImNvbmNhdCIsInRydW5jYXRlRnJhbWVzIiwiYm9keSIsImRhdGEiLCJ0cmFjZV9jaGFpbiIsImNoYWluIiwidHJhY2UiLCJtYXliZVRydW5jYXRlVmFsdWUiLCJ2YWwiLCJ0cnVuY2F0ZVN0cmluZ3MiLCJ0cnVuY2F0b3IiLCJrIiwidiIsInNlZW4iLCJ0eXBlTmFtZSIsInRydW5jYXRlVHJhY2VEYXRhIiwidHJhY2VEYXRhIiwiZXhjZXB0aW9uIiwiZGVzY3JpcHRpb24iLCJtZXNzYWdlIiwibWluQm9keSIsIm5lZWRzVHJ1bmNhdGlvbiIsIm1heFNpemUiLCJtYXhCeXRlU2l6ZSIsInRydW5jYXRlIiwic3RyYXRlZ2llcyIsImJpbmQiLCJzdHJhdGVneSIsInJlc3VsdHMiLCJzaGlmdCIsImVycm9yIiwidmFsdWUiLCJSb2xsYmFySlNPTiIsInNldHVwSlNPTiIsInBvbHlmaWxsSlNPTiIsImlzRnVuY3Rpb24iLCJwYXJzZSIsImlzRGVmaW5lZCIsIkpTT04iLCJpc05hdGl2ZUZ1bmN0aW9uIiwiaXNUeXBlIiwieCIsInQiLCJfdHlwZW9mIiwiRXJyb3IiLCJtYXRjaCIsInRvTG93ZXJDYXNlIiwiZiIsInJlUmVnRXhwQ2hhciIsImZ1bmNNYXRjaFN0cmluZyIsIkZ1bmN0aW9uIiwicmVwbGFjZSIsInJlSXNOYXRpdmUiLCJSZWdFeHAiLCJpc09iamVjdCIsInRlc3QiLCJ0eXBlIiwiaXNTdHJpbmciLCJTdHJpbmciLCJpc0Zpbml0ZU51bWJlciIsIm4iLCJOdW1iZXIiLCJpc0Zpbml0ZSIsInUiLCJpc0l0ZXJhYmxlIiwiaXNFcnJvciIsImUiLCJpc1Byb21pc2UiLCJwIiwidGhlbiIsImlzQnJvd3NlciIsIndpbmRvdyIsInJlZGFjdCIsInV1aWQ0IiwiZCIsIm5vdyIsInV1aWQiLCJjIiwiciIsIk1hdGgiLCJyYW5kb20iLCJmbG9vciIsIkxFVkVMUyIsImRlYnVnIiwiaW5mbyIsIndhcm5pbmciLCJjcml0aWNhbCIsInNhbml0aXplVXJsIiwidXJsIiwiYmFzZVVybFBhcnRzIiwicGFyc2VVcmkiLCJhbmNob3IiLCJzb3VyY2UiLCJxdWVyeSIsInBhcnNlVXJpT3B0aW9ucyIsInN0cmljdE1vZGUiLCJxIiwicGFyc2VyIiwic3RyaWN0IiwibG9vc2UiLCJzdHIiLCJ1bmRlZmluZWQiLCJvIiwibSIsImV4ZWMiLCJ1cmkiLCJsIiwiJDAiLCIkMSIsIiQyIiwiYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGgiLCJhY2Nlc3NUb2tlbiIsIm9wdGlvbnMiLCJwYXJhbXMiLCJhY2Nlc3NfdG9rZW4iLCJwYXJhbXNBcnJheSIsInB1c2giLCJqb2luIiwic29ydCIsInBhdGgiLCJxcyIsImluZGV4T2YiLCJoIiwic3Vic3RyaW5nIiwiZm9ybWF0VXJsIiwicHJvdG9jb2wiLCJwb3J0IiwiaG9zdG5hbWUiLCJiYWNrdXAiLCJqc29uRXJyb3IiLCJiYWNrdXBFcnJvciIsInN0cmluZyIsImNvdW50IiwiY29kZSIsImNoYXJDb2RlQXQiLCJqc29uUGFyc2UiLCJzIiwibWFrZVVuaGFuZGxlZFN0YWNrSW5mbyIsImxpbmVubyIsImNvbG5vIiwibW9kZSIsImJhY2t1cE1lc3NhZ2UiLCJlcnJvclBhcnNlciIsImxvY2F0aW9uIiwibGluZSIsImNvbHVtbiIsImZ1bmMiLCJndWVzc0Z1bmN0aW9uTmFtZSIsImNvbnRleHQiLCJnYXRoZXJDb250ZXh0IiwiaHJlZiIsImRvY3VtZW50IiwidXNlcmFnZW50IiwibmF2aWdhdG9yIiwidXNlckFnZW50Iiwic3RhY2siLCJ3cmFwQ2FsbGJhY2siLCJsb2dnZXIiLCJlcnIiLCJyZXNwIiwibm9uQ2lyY3VsYXJDbG9uZSIsIm5ld1NlZW4iLCJpbmNsdWRlcyIsImNyZWF0ZUl0ZW0iLCJhcmdzIiwibm90aWZpZXIiLCJyZXF1ZXN0S2V5cyIsImxhbWJkYUNvbnRleHQiLCJjdXN0b20iLCJjYWxsYmFjayIsInJlcXVlc3QiLCJhcmciLCJleHRyYUFyZ3MiLCJkaWFnbm9zdGljIiwiYXJnVHlwZXMiLCJ0eXAiLCJET01FeGNlcHRpb24iLCJqIiwiaXRlbSIsInRpbWVzdGFtcCIsInNldEN1c3RvbUl0ZW1LZXlzIiwiX29yaWdpbmFsQXJncyIsIm9yaWdpbmFsX2FyZ190eXBlcyIsImxldmVsIiwic2tpcEZyYW1lcyIsImFkZEVycm9yQ29udGV4dCIsImVycm9ycyIsImNvbnRleHRBZGRlZCIsInJvbGxiYXJDb250ZXh0IiwiZXJyb3JfY29udGV4dCIsIlRFTEVNRVRSWV9UWVBFUyIsIlRFTEVNRVRSWV9MRVZFTFMiLCJhcnJheUluY2x1ZGVzIiwiYXJyIiwiY3JlYXRlVGVsZW1ldHJ5RXZlbnQiLCJtZXRhZGF0YSIsImV2ZW50IiwiYWRkSXRlbUF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVzIiwiX2l0ZW0kZGF0YSRhdHRyaWJ1dGVzIiwiYXBwbHkiLCJfdG9Db25zdW1hYmxlQXJyYXkiLCJnZXQiLCJrZXlzIiwic3BsaXQiLCJzZXQiLCJ0ZW1wIiwicmVwbGFjZW1lbnQiLCJmb3JtYXRBcmdzQXNTdHJpbmciLCJzdWJzdHIiLCJEYXRlIiwiZmlsdGVySXAiLCJyZXF1ZXN0RGF0YSIsImNhcHR1cmVJcCIsIm5ld0lwIiwicGFydHMiLCJwb3AiLCJiZWdpbm5pbmciLCJzbGFzaElkeCIsInRlcm1pbmFsIiwiaGFuZGxlT3B0aW9ucyIsImlucHV0IiwidXBkYXRlRGVwcmVjYXRlZE9wdGlvbnMiLCJvdmVyd3JpdGVTY3J1YkZpZWxkcyIsInNjcnViRmllbGRzIiwiaG9zdFdoaXRlTGlzdCIsImhvc3RTYWZlTGlzdCIsImxvZyIsImhvc3RCbGFja0xpc3QiLCJob3N0QmxvY2tMaXN0IiwiaXNPYmoiLCJpc0FycmF5Iiwic2VlbkluZGV4IiwibWFwcGVkIiwic2FtZSJdLCJzb3VyY2VSb290IjoiIn0=