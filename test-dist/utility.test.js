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

/***/ "./src/scrub.js":
/*!**********************!*\
  !*** ./src/scrub.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");
var traverse = __webpack_require__(/*! ./utility/traverse */ "./src/utility/traverse.js");
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
    return paramPart + _.redact();
  }
  function paramScrubber(v) {
    var i;
    if (_.isType(v, 'string')) {
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
        v = _.redact();
        break;
      }
    }
    return v;
  }
  function scrubber(k, v, seen) {
    var tmpV = valScrubber(k, v);
    if (tmpV === v) {
      if (_.isType(v, 'object') || _.isType(v, 'array')) {
        return traverse(v, scrubber, seen);
      }
      return paramScrubber(tmpV);
    } else {
      return tmpV;
    }
  }
  return traverse(data, scrubber);
}
function scrubPath(obj, path) {
  var keys = path.split('.');
  var last = keys.length - 1;
  try {
    for (var i = 0; i <= last; ++i) {
      if (i < last) {
        obj = obj[keys[i]];
      } else {
        obj[keys[i]] = _.redact();
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
module.exports = scrub;

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

/***/ }),

/***/ "./vendor/JSON-js/json3.js":
/*!*********************************!*\
  !*** ./vendor/JSON-js/json3.js ***!
  \*********************************/
/***/ ((module) => {

//  json3.js
//  2017-02-21
//  Public Domain.
//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
//  See http://www.JSON.org/js.html
//  This code should be minified before deployment.
//  See http://javascript.crockford.com/jsmin.html

//  USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
//  NOT CONTROL.

//  This file creates a global JSON object containing two methods: stringify
//  and parse. This file provides the ES5 JSON capability to ES3 systems.
//  If a project might run on IE8 or earlier, then this file should be included.
//  This file does nothing on ES5 systems.

//      JSON.stringify(value, replacer, space)
//          value       any JavaScript value, usually an object or array.
//          replacer    an optional parameter that determines how object
//                      values are stringified for objects. It can be a
//                      function or an array of strings.
//          space       an optional parameter that specifies the indentation
//                      of nested structures. If it is omitted, the text will
//                      be packed without extra whitespace. If it is a number,
//                      it will specify the number of spaces to indent at each
//                      level. If it is a string (such as "\t" or "&nbsp;"),
//                      it contains the characters used to indent at each level.
//          This method produces a JSON text from a JavaScript value.
//          When an object value is found, if the object contains a toJSON
//          method, its toJSON method will be called and the result will be
//          stringified. A toJSON method does not serialize: it returns the
//          value represented by the name/value pair that should be serialized,
//          or undefined if nothing should be serialized. The toJSON method
//          will be passed the key associated with the value, and this will be
//          bound to the value.

//          For example, this would serialize Dates as ISO strings.

//              Date.prototype.toJSON = function (key) {
//                  function f(n) {
//                      // Format integers to have at least two digits.
//                      return (n < 10)
//                          ? "0" + n
//                          : n;
//                  }
//                  return this.getUTCFullYear()   + "-" +
//                       f(this.getUTCMonth() + 1) + "-" +
//                       f(this.getUTCDate())      + "T" +
//                       f(this.getUTCHours())     + ":" +
//                       f(this.getUTCMinutes())   + ":" +
//                       f(this.getUTCSeconds())   + "Z";
//              };

//          You can provide an optional replacer method. It will be passed the
//          key and value of each member, with this bound to the containing
//          object. The value that is returned from your method will be
//          serialized. If your method returns undefined, then the member will
//          be excluded from the serialization.

//          If the replacer parameter is an array of strings, then it will be
//          used to select the members to be serialized. It filters the results
//          such that only members with keys listed in the replacer array are
//          stringified.

//          Values that do not have JSON representations, such as undefined or
//          functions, will not be serialized. Such values in objects will be
//          dropped; in arrays they will be replaced with null. You can use
//          a replacer function to replace those with JSON values.

//          JSON.stringify(undefined) returns undefined.

//          The optional space parameter produces a stringification of the
//          value that is filled with line breaks and indentation to make it
//          easier to read.

//          If the space parameter is a non-empty string, then that string will
//          be used for indentation. If the space parameter is a number, then
//          the indentation will be that many spaces.

//          Example:

//          text = JSON.stringify(["e", {pluribus: "unum"}]);
//          // text is '["e",{"pluribus":"unum"}]'

//          text = JSON.stringify(["e", {pluribus: "unum"}], null, "\t");
//          // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

//          text = JSON.stringify([new Date()], function (key, value) {
//              return this[key] instanceof Date
//                  ? "Date(" + this[key] + ")"
//                  : value;
//          });
//          // text is '["Date(---current time---)"]'

//      JSON.parse(text, reviver)
//          This method parses a JSON text to produce an object or array.
//          It can throw a SyntaxError exception.
//          This has been modified to use JSON-js/json_parse_state.js as the
//          parser instead of the one built around eval found in JSON-js/json2.js

//          The optional reviver parameter is a function that can filter and
//          transform the results. It receives each of the keys and values,
//          and its return value is used instead of the original value.
//          If it returns what it received, then the structure is not modified.
//          If it returns undefined then the member is deleted.

//          Example:

//          // Parse the text. Values that look like ISO date strings will
//          // be converted to Date objects.

//          myData = JSON.parse(text, function (key, value) {
//              var a;
//              if (typeof value === "string") {
//                  a =
//   /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
//                  if (a) {
//                      return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
//                          +a[5], +a[6]));
//                  }
//              }
//              return value;
//          });

//          myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
//              var d;
//              if (typeof value === "string" &&
//                      value.slice(0, 5) === "Date(" &&
//                      value.slice(-1) === ")") {
//                  d = new Date(value.slice(5, -1));
//                  if (d) {
//                      return d;
//                  }
//              }
//              return value;
//          });

//  This is a reference implementation. You are free to copy, modify, or
//  redistribute.

/*jslint
  for, this
  */

/*property
  JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
  getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
  lastIndex, length, parse, prototype, push, replace, slice, stringify,
  test, toJSON, toString, valueOf
  */

var setupCustomJSON = function(JSON) {

  var rx_one = /^[\],:{}\s]*$/;
  var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
  var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
  var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
  var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

  function f(n) {
    // Format integers to have at least two digits.
    return n < 10
      ? "0" + n
      : n;
  }

  function this_value() {
    return this.valueOf();
  }

  if (typeof Date.prototype.toJSON !== "function") {

    Date.prototype.toJSON = function () {

      return isFinite(this.valueOf())
        ? this.getUTCFullYear() + "-" +
        f(this.getUTCMonth() + 1) + "-" +
        f(this.getUTCDate()) + "T" +
        f(this.getUTCHours()) + ":" +
        f(this.getUTCMinutes()) + ":" +
        f(this.getUTCSeconds()) + "Z"
        : null;
    };

    Boolean.prototype.toJSON = this_value;
    Number.prototype.toJSON = this_value;
    String.prototype.toJSON = this_value;
  }

  var gap;
  var indent;
  var meta;
  var rep;


  function quote(string) {

    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.

    rx_escapable.lastIndex = 0;
    return rx_escapable.test(string)
      ? "\"" + string.replace(rx_escapable, function (a) {
        var c = meta[a];
        return typeof c === "string"
          ? c
          : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
      }) + "\""
    : "\"" + string + "\"";
  }


  function str(key, holder) {

    // Produce a string from holder[key].

    var i;          // The loop counter.
    var k;          // The member key.
    var v;          // The member value.
    var length;
    var mind = gap;
    var partial;
    var value = holder[key];

    // If the value has a toJSON method, call it to obtain a replacement value.

    if (value && typeof value === "object" &&
        typeof value.toJSON === "function") {
      value = value.toJSON(key);
    }

    // If we were called with a replacer function, then call the replacer to
    // obtain a replacement value.

    if (typeof rep === "function") {
      value = rep.call(holder, key, value);
    }

    // What happens next depends on the value's type.

    switch (typeof value) {
      case "string":
        return quote(value);

      case "number":

        // JSON numbers must be finite. Encode non-finite numbers as null.

        return isFinite(value)
          ? String(value)
          : "null";

      case "boolean":
      case "null":

        // If the value is a boolean or null, convert it to a string. Note:
        // typeof null does not produce "null". The case is included here in
        // the remote chance that this gets fixed someday.

        return String(value);

        // If the type is "object", we might be dealing with an object or an array or
        // null.

      case "object":

        // Due to a specification blunder in ECMAScript, typeof null is "object",
        // so watch out for that case.

        if (!value) {
          return "null";
        }

        // Make an array to hold the partial results of stringifying this object value.

        gap += indent;
        partial = [];

        // Is the value an array?

        if (Object.prototype.toString.apply(value) === "[object Array]") {

          // The value is an array. Stringify every element. Use null as a placeholder
          // for non-JSON values.

          length = value.length;
          for (i = 0; i < length; i += 1) {
            partial[i] = str(i, value) || "null";
          }

          // Join all of the elements together, separated with commas, and wrap them in
          // brackets.

          v = partial.length === 0
            ? "[]"
            : gap
            ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]"
            : "[" + partial.join(",") + "]";
          gap = mind;
          return v;
        }

        // If the replacer is an array, use it to select the members to be stringified.

        if (rep && typeof rep === "object") {
          length = rep.length;
          for (i = 0; i < length; i += 1) {
            if (typeof rep[i] === "string") {
              k = rep[i];
              v = str(k, value);
              if (v) {
                partial.push(quote(k) + (
                      gap
                      ? ": "
                      : ":"
                      ) + v);
              }
            }
          }
        } else {

          // Otherwise, iterate through all of the keys in the object.

          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = str(k, value);
              if (v) {
                partial.push(quote(k) + (
                      gap
                      ? ": "
                      : ":"
                      ) + v);
              }
            }
          }
        }

        // Join all of the member texts together, separated with commas,
        // and wrap them in braces.

        v = partial.length === 0
          ? "{}"
          : gap
          ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
          : "{" + partial.join(",") + "}";
        gap = mind;
        return v;
    }
  }

  // If the JSON object does not yet have a stringify method, give it one.

  if (typeof JSON.stringify !== "function") {
    meta = {    // table of character substitutions
      "\b": "\\b",
      "\t": "\\t",
      "\n": "\\n",
      "\f": "\\f",
      "\r": "\\r",
      "\"": "\\\"",
      "\\": "\\\\"
    };
    JSON.stringify = function (value, replacer, space) {

      // The stringify method takes a value and an optional replacer, and an optional
      // space parameter, and returns a JSON text. The replacer can be a function
      // that can replace values, or an array of strings that will select the keys.
      // A default replacer method can be provided. Use of the space parameter can
      // produce text that is more easily readable.

      var i;
      gap = "";
      indent = "";

      // If the space parameter is a number, make an indent string containing that
      // many spaces.

      if (typeof space === "number") {
        for (i = 0; i < space; i += 1) {
          indent += " ";
        }

        // If the space parameter is a string, it will be used as the indent string.

      } else if (typeof space === "string") {
        indent = space;
      }

      // If there is a replacer, it must be a function or an array.
      // Otherwise, throw an error.

      rep = replacer;
      if (replacer && typeof replacer !== "function" &&
          (typeof replacer !== "object" ||
           typeof replacer.length !== "number")) {
        throw new Error("JSON.stringify");
      }

      // Make a fake root object containing our value under the key of "".
      // Return the result of stringifying the value.

      return str("", {"": value});
    };
  }


  // If the JSON object does not yet have a parse method, give it one.

  if (typeof JSON.parse !== "function") {
    JSON.parse = (function () {

      // This function creates a JSON parse function that uses a state machine rather
      // than the dangerous eval function to parse a JSON text.

      var state;      // The state of the parser, one of
      // 'go'         The starting state
      // 'ok'         The final, accepting state
      // 'firstokey'  Ready for the first key of the object or
      //              the closing of an empty object
      // 'okey'       Ready for the next key of the object
      // 'colon'      Ready for the colon
      // 'ovalue'     Ready for the value half of a key/value pair
      // 'ocomma'     Ready for a comma or closing }
      // 'firstavalue' Ready for the first value of an array or
      //              an empty array
      // 'avalue'     Ready for the next value of an array
      // 'acomma'     Ready for a comma or closing ]
      var stack;      // The stack, for controlling nesting.
      var container;  // The current container object or array
      var key;        // The current key
      var value;      // The current value
      var escapes = { // Escapement translation table
        "\\": "\\",
        "\"": "\"",
        "/": "/",
        "t": "\t",
        "n": "\n",
        "r": "\r",
        "f": "\f",
        "b": "\b"
      };
      var string = {   // The actions for string tokens
        go: function () {
          state = "ok";
        },
        firstokey: function () {
          key = value;
          state = "colon";
        },
        okey: function () {
          key = value;
          state = "colon";
        },
        ovalue: function () {
          state = "ocomma";
        },
        firstavalue: function () {
          state = "acomma";
        },
        avalue: function () {
          state = "acomma";
        }
      };
      var number = {   // The actions for number tokens
        go: function () {
          state = "ok";
        },
        ovalue: function () {
          state = "ocomma";
        },
        firstavalue: function () {
          state = "acomma";
        },
        avalue: function () {
          state = "acomma";
        }
      };
      var action = {

        // The action table describes the behavior of the machine. It contains an
        // object for each token. Each object contains a method that is called when
        // a token is matched in a state. An object will lack a method for illegal
        // states.

        "{": {
          go: function () {
            stack.push({state: "ok"});
            container = {};
            state = "firstokey";
          },
          ovalue: function () {
            stack.push({container: container, state: "ocomma", key: key});
            container = {};
            state = "firstokey";
          },
          firstavalue: function () {
            stack.push({container: container, state: "acomma"});
            container = {};
            state = "firstokey";
          },
          avalue: function () {
            stack.push({container: container, state: "acomma"});
            container = {};
            state = "firstokey";
          }
        },
        "}": {
          firstokey: function () {
            var pop = stack.pop();
            value = container;
            container = pop.container;
            key = pop.key;
            state = pop.state;
          },
          ocomma: function () {
            var pop = stack.pop();
            container[key] = value;
            value = container;
            container = pop.container;
            key = pop.key;
            state = pop.state;
          }
        },
        "[": {
          go: function () {
            stack.push({state: "ok"});
            container = [];
            state = "firstavalue";
          },
          ovalue: function () {
            stack.push({container: container, state: "ocomma", key: key});
            container = [];
            state = "firstavalue";
          },
          firstavalue: function () {
            stack.push({container: container, state: "acomma"});
            container = [];
            state = "firstavalue";
          },
          avalue: function () {
            stack.push({container: container, state: "acomma"});
            container = [];
            state = "firstavalue";
          }
        },
        "]": {
          firstavalue: function () {
            var pop = stack.pop();
            value = container;
            container = pop.container;
            key = pop.key;
            state = pop.state;
          },
          acomma: function () {
            var pop = stack.pop();
            container.push(value);
            value = container;
            container = pop.container;
            key = pop.key;
            state = pop.state;
          }
        },
        ":": {
          colon: function () {
            if (Object.hasOwnProperty.call(container, key)) {
              throw new SyntaxError("Duplicate key '" + key + "\"");
            }
            state = "ovalue";
          }
        },
        ",": {
          ocomma: function () {
            container[key] = value;
            state = "okey";
          },
          acomma: function () {
            container.push(value);
            state = "avalue";
          }
        },
        "true": {
          go: function () {
            value = true;
            state = "ok";
          },
          ovalue: function () {
            value = true;
            state = "ocomma";
          },
          firstavalue: function () {
            value = true;
            state = "acomma";
          },
          avalue: function () {
            value = true;
            state = "acomma";
          }
        },
        "false": {
          go: function () {
            value = false;
            state = "ok";
          },
          ovalue: function () {
            value = false;
            state = "ocomma";
          },
          firstavalue: function () {
            value = false;
            state = "acomma";
          },
          avalue: function () {
            value = false;
            state = "acomma";
          }
        },
        "null": {
          go: function () {
            value = null;
            state = "ok";
          },
          ovalue: function () {
            value = null;
            state = "ocomma";
          },
          firstavalue: function () {
            value = null;
            state = "acomma";
          },
          avalue: function () {
            value = null;
            state = "acomma";
          }
        }
      };

      function debackslashify(text) {

        // Remove and replace any backslash escapement.

        return text.replace(/\\(?:u(.{4})|([^u]))/g, function (ignore, b, c) {
          return b
            ? String.fromCharCode(parseInt(b, 16))
            : escapes[c];
        });
      }

      return function (source, reviver) {

        // A regular expression is used to extract tokens from the JSON text.
        // The extraction process is cautious.

        var result;
        var tx = /^[\u0020\t\n\r]*(?:([,:\[\]{}]|true|false|null)|(-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)|"((?:[^\r\n\t\\\"]|\\(?:["\\\/trnfb]|u[0-9a-fA-F]{4}))*)")/;

        // Set the starting state.

        state = "go";

        // The stack records the container, key, and state for each object or array
        // that contains another object or array while processing nested structures.

        stack = [];

        // If any error occurs, we will catch it and ultimately throw a syntax error.

        try {

          // For each token...

          while (true) {
            result = tx.exec(source);
            if (!result) {
              break;
            }

            // result is the result array from matching the tokenizing regular expression.
            //  result[0] contains everything that matched, including any initial whitespace.
            //  result[1] contains any punctuation that was matched, or true, false, or null.
            //  result[2] contains a matched number, still in string form.
            //  result[3] contains a matched string, without quotes but with escapement.

            if (result[1]) {

              // Token: Execute the action for this state and token.

              action[result[1]][state]();

            } else if (result[2]) {

              // Number token: Convert the number string into a number value and execute
              // the action for this state and number.

              value = +result[2];
              number[state]();
            } else {

              // String token: Replace the escapement sequences and execute the action for
              // this state and string.

              value = debackslashify(result[3]);
              string[state]();
            }

            // Remove the token from the string. The loop will continue as long as there
            // are tokens. This is a slow process, but it allows the use of ^ matching,
            // which assures that no illegal tokens slip through.

            source = source.slice(result[0].length);
          }

          // If we find a state/token combination that is illegal, then the action will
          // cause an error. We handle the error by simply changing the state.

        } catch (e) {
          state = e;
        }

        // The parsing is finished. If we are not in the final "ok" state, or if the
        // remaining source contains anything except whitespace, then we did not have
        //a well-formed JSON text.

        if (state !== "ok" || (/[^\u0020\t\n\r]/.test(source))) {
          throw (state instanceof SyntaxError)
            ? state
            : new SyntaxError("JSON");
        }

        // If there is a reviver function, we recursively walk the new structure,
        // passing each name/value pair to the reviver function for possible
        // transformation, starting with a temporary root object that holds the current
        // value in an empty key. If there is not a reviver function, we simply return
        // that value.

        return (typeof reviver === "function")
          ? (function walk(holder, key) {
            var k;
            var v;
            var val = holder[key];
            if (val && typeof val === "object") {
              for (k in value) {
                if (Object.prototype.hasOwnProperty.call(val, k)) {
                  v = walk(val, k);
                  if (v !== undefined) {
                    val[k] = v;
                  } else {
                    delete val[k];
                  }
                }
              }
            }
            return reviver.call(holder, key, val);
          }({"": value}, ""))
        : value;
      };
    }());
  }
}

module.exports = setupCustomJSON;


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
/*!******************************!*\
  !*** ./test/utility.test.js ***!
  \******************************/
/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var _ = __webpack_require__(/*! ../src/utility */ "./src/utility.js");
var utility = __webpack_require__(/*! ../src/utility */ "./src/utility.js");
var polyfillJSON = __webpack_require__(/*! ../vendor/JSON-js/json3 */ "./vendor/JSON-js/json3.js");

utility.setupJSON();

describe('setupJSON', function () {
  beforeEach(function () {
    utility.RollbarJSON.stringify = null;
    utility.RollbarJSON.parse = null;
  });

  afterEach(function () {
    // Resets utility.RollbarJSON
    utility.RollbarJSON.stringify = null;
    utility.RollbarJSON.parse = null;
    utility.setupJSON();
  });

  it('should use native interface when polyfill is provided', function () {
    var native = { stringify: JSON.stringify, parse: JSON.parse };

    utility.setupJSON(polyfillJSON);

    expect(utility.RollbarJSON.stringify.toString()).to.equal(
      native.stringify.toString(),
    );
    expect(utility.RollbarJSON.parse.toString()).to.equal(
      native.parse.toString(),
    );
  });

  it('should use native interface when polyfill is not provided', function () {
    var native = { stringify: JSON.stringify, parse: JSON.parse };

    utility.setupJSON();

    expect(utility.RollbarJSON.stringify.toString()).to.equal(
      native.stringify.toString(),
    );
    expect(utility.RollbarJSON.parse.toString()).to.equal(
      native.parse.toString(),
    );
  });

  it('should replace custom interface when polyfill is provided', function () {
    var native = { stringify: JSON.stringify, parse: JSON.parse };
    var custom = {
      stringify: function (json) {
        return json;
      },
      parse: function (json) {
        return json;
      },
    };
    var polyfill = {};
    polyfillJSON(polyfill);

    // Set to custom interface
    JSON.stringify = custom.stringify;
    JSON.parse = custom.parse;

    utility.setupJSON(polyfillJSON);

    expect(utility.RollbarJSON.stringify.toString()).to.equal(
      polyfill.stringify.toString(),
    );
    expect(utility.RollbarJSON.parse.toString()).to.equal(
      polyfill.parse.toString(),
    );

    // restore original interface
    JSON.stringify = native.stringify;
    JSON.parse = native.parse;
  });

  it('should keep custom interface when polyfill is not provided', function () {
    var native = { stringify: JSON.stringify, parse: JSON.parse };
    var custom = {
      stringify: function (json) {
        return json;
      },
      parse: function (json) {
        return json;
      },
    };

    // Set to custom interface
    JSON.stringify = custom.stringify;
    JSON.parse = custom.parse;

    utility.setupJSON();

    expect(utility.RollbarJSON.stringify.toString()).to.equal(
      custom.stringify.toString(),
    );
    expect(utility.RollbarJSON.parse.toString()).to.equal(
      custom.parse.toString(),
    );

    // restore original interface
    JSON.stringify = native.stringify;
    JSON.parse = native.parse;
  });
});

describe('typeName', function () {
  it('should handle undefined', function (done) {
    expect(_.typeName(undefined)).to.eql('undefined');
    done();
  });

  it('should handle null', function (done) {
    expect(_.typeName(null)).to.eql('null');
    done();
  });

  it('should handle numbers', function (done) {
    expect(_.typeName(1)).to.eql('number');
    expect(_.typeName(-32)).to.eql('number');
    expect(_.typeName(1.452)).to.eql('number');
    expect(_.typeName(0)).to.eql('number');
    done();
  });

  it('should handle bools', function (done) {
    expect(_.typeName(true)).to.eql('boolean');
    expect(_.typeName(false)).to.eql('boolean');
    done();
  });

  it('should handle strings', function (done) {
    expect(_.typeName('')).to.eql('string');
    expect(_.typeName('a longer string')).to.eql('string');
    done();
  });

  it('should handle functions', function (done) {
    expect(_.typeName(function () {})).to.eql('function');
    var f = function (x) {
      return x;
    };
    expect(_.typeName(f)).to.eql('function');
    done();
  });

  it('should handle objects', function (done) {
    expect(_.typeName({})).to.eql('object');
    expect(_.typeName({ a: 123 })).to.eql('object');
    done();
  });

  it('should handle arrays', function (done) {
    expect(_.typeName([])).to.eql('array');
    expect(_.typeName([1, { a: 42 }, null])).to.eql('array');
    done();
  });
});

describe('isType', function () {
  it('should handle all types', function (done) {
    expect(_.isType(undefined, 'undefined')).to.be.ok();
    expect(_.isType(undefined, 'null')).to.not.be.ok();
    expect(_.isType(null, 'null')).to.be.ok();
    expect(_.isType(null, 'object')).to.not.be.ok();
    expect(_.isType({}, 'object')).to.be.ok();
    expect(_.isType(function () {}, 'function')).to.be.ok();
    expect(_.isType(42, 'number')).to.be.ok();
    expect(_.isType('42', 'string')).to.be.ok();
    expect(_.isType([], 'array')).to.be.ok();
    expect(_.isType([102, []], 'array')).to.be.ok();

    done();
  });
});

describe('isFunction', function () {
  it('should work for all functions', function (done) {
    var f = function () {
      return;
    };
    var g = function (x) {
      return f(x);
    };
    expect(_.isFunction({})).to.not.be.ok();
    expect(_.isFunction(null)).to.not.be.ok();
    expect(_.isFunction(f)).to.be.ok();
    expect(_.isFunction(g)).to.be.ok();
    done();
  });
});
describe('isNativeFunction', function () {
  it('should work for all native functions', function (done) {
    var f = function () {
      return;
    };
    var g = function (x) {
      return f(x);
    };
    var h = String.prototype.substr;
    var i = Array.prototype.indexOf;
    expect(_.isNativeFunction({})).to.not.be.ok();
    expect(_.isNativeFunction(null)).to.not.be.ok();
    expect(_.isNativeFunction(f)).to.not.be.ok();
    expect(_.isNativeFunction(g)).to.not.be.ok();
    expect(_.isNativeFunction(h)).to.be.ok();
    expect(_.isNativeFunction(i)).to.be.ok();
    done();
  });
});

describe('isIterable', function () {
  it('should work for all types', function (done) {
    expect(_.isIterable({})).to.be.ok();
    expect(_.isIterable([])).to.be.ok();
    expect(_.isIterable([{ a: 1 }])).to.be.ok();
    expect(_.isIterable(null)).to.not.be.ok();
    expect(_.isIterable(undefined)).to.not.be.ok();
    expect(_.isIterable('object')).to.not.be.ok();
    expect(_.isIterable(42)).to.not.be.ok();
    done();
  });
});

describe('isError', function () {
  it('should handle null', function (done) {
    expect(_.isError(null)).to.not.be.ok();
    done();
  });
  it('should handle errors', function (done) {
    var e = new Error('hello');
    expect(_.isError(e)).to.be.ok();
    done();
  });
  it('should handle subclasses of error', function (done) {
    // This is a mostly browser compliant way of doing this
    // just for the sake of doing it, even though we mostly
    // need this to work in node environments
    function TestCustomError(message) {
      Object.defineProperty(this, 'name', {
        enumerable: false,
        writable: false,
        value: 'TestCustomError',
      });

      Object.defineProperty(this, 'message', {
        enumerable: false,
        writable: true,
        value: message,
      });

      if (Error.hasOwnProperty('captureStackTrace')) {
        Error.captureStackTrace(this, TestCustomError);
      } else {
        Object.defineProperty(this, 'stack', {
          enumerable: false,
          writable: false,
          value: new Error(message).stack,
        });
      }
    }

    if (typeof Object.setPrototypeOf === 'function') {
      Object.setPrototypeOf(TestCustomError.prototype, Error.prototype);
    } else {
      TestCustomError.prototype = Object.create(Error.prototype, {
        constructor: { value: TestCustomError },
      });
    }
    var e = new TestCustomError('bork');
    expect(_.isError(e)).to.be.ok();
    done();
  });
});

describe('isFiniteNumber', function () {
  [NaN, null, undefined, 'x'].forEach(function (value) {
    it(`should return false for ${value}`, function (done) {
      expect(_.isFiniteNumber(value)).to.equal(false);
      done();
    });
  });
  [-100, 0, 100].forEach(function (value) {
    it(`should return true for ${value}`, function (done) {
      expect(_.isFiniteNumber(value)).to.equal(true);
      done();
    });
  });
});

describe('merge', function () {
  it('should work for simple objects', function (done) {
    var o1 = { a: 1, b: 2 };
    var o2 = { a: 42, c: 101 };
    var e = _.merge(o1, o2);

    expect(e.a).to.eql(42);
    expect(e.b).to.eql(2);
    expect(e.c).to.eql(101);

    e.a = 100;

    expect(o1.a).to.eql(1);
    expect(o2.a).to.eql(42);

    done();
  });
  it('should not concat arrays', function (done) {
    var o1 = { a: 1, b: ['hello', 'world'] };
    var o2 = { a: 42, b: ['goodbye'] };
    var e = _.merge(o1, o2);

    expect(e.a).to.eql(42);
    expect(e.b).to.contain('goodbye');
    expect(e.b).to.not.contain('world');
    expect(e.b.length).to.eql(1);

    expect(o1.b).to.contain('world');
    expect(o1.b).not.to.contain('goodbye');
    done();
  });
  it('should handle nested objects', function (done) {
    var o1 = {
      a: 1,
      c: 100,
      payload: {
        person: {
          id: 'xxx',
          name: 'hello',
        },
        environment: 'foo',
      },
    };
    var o2 = {
      a: 42,
      b: 2,
      payload: {
        person: {
          id: 'yesyes',
          email: 'cool',
        },
        other: 'bar',
      },
    };
    var e = _.merge(o1, o2);

    expect(e.a).to.eql(42);
    expect(e.c).to.eql(100);
    expect(e.b).to.eql(2);
    expect(e.payload.person.id).to.eql('yesyes');
    expect(e.payload.person.email).to.eql('cool');
    expect(e.payload.person.name).to.eql('hello');
    expect(e.payload.environment).to.eql('foo');
    expect(e.payload.other).to.eql('bar');
    done();
  });
  it('should handle nested arrays and objects, with non-matching structure', function (done) {
    var o1 = {
      a: 1,
      c: {
        arr: [3, 4, 5],
        other: [99, 100, 101],
        payload: {
          foo: {
            bar: 'baz',
          },
          hello: 'world',
          keeper: 'yup',
        },
      },
    };
    var o2 = {
      a: 32,
      c: {
        arr: [1],
        other: { fuzz: 'buzz' },
        payload: {
          foo: 'hello',
          hello: {
            baz: 'bar',
          },
        },
      },
    };
    var e = _.merge(o1, o2);

    expect(e.a).to.eql(32);
    expect(e.c.arr.length).to.eql(1);
    expect(e.c.arr[0]).to.eql(1);
    expect(e.c.other.fuzz).to.eql('buzz');
    expect(e.c.payload.foo).to.eql('hello');
    expect(e.c.payload.hello.baz).to.eql('bar');
    expect(e.c.payload.keeper).to.eql('yup');

    done();
  });

  it('should handle many nested objects', function (done) {
    var o1 = {
      a: 1,
      c: 100,
      payload: {
        person: {
          id: 'xxx',
          name: 'hello',
        },
        environment: 'foo',
      },
    };
    var o2 = {
      a: 42,
      b: 2,
      payload: {
        person: {
          id: 'yesyes',
          email: 'cool',
        },
        other: 'bar',
      },
    };
    var o3 = {
      payload: {
        fuzz: 'buzz',
        person: {
          name: 'nope',
        },
      },
      amihere: 'yes',
    };
    var e = _.merge(o1, o2, o3);

    expect(e.a).to.eql(42);
    expect(e.c).to.eql(100);
    expect(e.b).to.eql(2);
    expect(e.payload.person.id).to.eql('yesyes');
    expect(e.payload.person.email).to.eql('cool');
    expect(e.payload.person.name).to.eql('nope');
    expect(e.payload.environment).to.eql('foo');
    expect(e.payload.fuzz).to.eql('buzz');
    expect(e.payload.other).to.eql('bar');
    expect(e.amihere).to.eql('yes');
    done();
  });
});

var traverse = __webpack_require__(/*! ../src/utility/traverse */ "./src/utility/traverse.js");
describe('traverse', function () {
  describe('should call the func for every key,value', function () {
    it('simple object', function (done) {
      var obj = { a: 1, b: 2 };
      var expectedOutput = { a: 2, b: 3 };
      var callCount = 0;
      var result = traverse(obj, function (k, v) {
        callCount++;
        return v + 1;
      });
      expect(result).to.eql(expectedOutput);
      expect(callCount).to.eql(2);

      done();
    });
    it('nested object', function (done) {
      var obj = { a: 1, b: 2, c: { ca: 11 } };
      var expectedOutput = { a: 2, b: 3, c: { ca: 12 } };
      var callCount = 0;
      var result = traverse(obj, function (k, v) {
        callCount++;
        if (k === 'c') {
          return { ca: v.ca + 1 };
        }
        return v + 1;
      });
      expect(result).to.eql(expectedOutput);
      expect(callCount).to.eql(3);

      done();
    });
    it('array', function (done) {
      var obj = [1, 2, 3];
      var expected = [0, 1, 2];
      var callCount = 0;
      var result = traverse(
        obj,
        function (k, v) {
          callCount++;
          return v - 1;
        },
        [],
      );
      expect(result).to.eql(expected);
      expect(callCount).to.eql(3);
      done();
    });
  });
});

describe('uuid4', function () {
  it('should return a version 4 uuid', function (done) {
    var id = _.uuid4();
    var otherId = _.uuid4();
    expect(id).to.not.eql(otherId);
    var parts = id.split('-');
    expect(parts.length).to.eql(5);
    expect(parts[2][0]).to.eql('4');
    expect(parts[0].length).to.eql(8);
    expect(parts[1].length).to.eql(4);
    expect(parts[2].length).to.eql(4);
    expect(parts[3].length).to.eql(4);
    expect(parts[4].length).to.eql(12);
    done();
  });
});

describe('redact', function () {
  it('should return a string of stars', function (done) {
    var s1 = 'thisIsApasswrD';
    var s2 = 'short';
    var o = { a: 123 };
    var a = [12, 34, 56];

    expect(_.redact(s1)).to.not.match(/[^*]/);
    expect(_.redact(s2)).to.not.match(/[^*]/);
    expect(_.redact(s1)).to.eql(_.redact(s2));
    expect(_.redact(o)).to.not.match(/[^*]/);
    expect(_.redact(a)).to.not.match(/[^*]/);

    done();
  });
});

describe('LEVELS', function () {
  it('should include debug', function () {
    expect(_.LEVELS['debug']).to.not.eql(undefined);
  });
  it('should have critical higher than debug', function () {
    expect(_.LEVELS['critical']).to.be.greaterThan(_.LEVELS['debug']);
  });
});

describe('formatUrl', function () {
  it('should handle a missing protocol', function () {
    var u = {
      hostname: 'a.b.com',
      path: '/wooza/',
      port: 42,
    };
    expect(_.formatUrl(u)).to.eql('https://a.b.com:42/wooza/');
  });
  it('should use a forced protocol', function () {
    var u = {
      hostname: 'a.b.com',
      path: '/wooza/',
      port: 42,
    };
    expect(_.formatUrl(u, 'file:')).to.eql('file://a.b.com:42/wooza/');
  });
  it('should pick a protocol based on port if others are missing', function () {
    var u = {
      hostname: 'a.b.com',
      port: 80,
      path: '/woo',
    };
    expect(_.formatUrl(u)).to.eql('http://a.b.com:80/woo');
    u.protocol = 'https:';
    expect(_.formatUrl(u)).to.eql('https://a.b.com:80/woo');
  });
  it('should handle missing parts', function () {
    var u = {
      hostname: 'a.b.com',
    };
    expect(_.formatUrl(u)).to.eql('https://a.b.com');
    expect(_.formatUrl(u, 'http:')).to.eql('http://a.b.com');
  });
  it('should return null without a hostname', function () {
    var u = {};
    expect(_.formatUrl(u)).to.not.be.ok();
    expect(_.formatUrl(u, 'https:')).to.not.be.ok();
  });
});

describe('addParamsAndAccessTokenToPath', function () {
  var accessToken = 'abc123';
  it('should handle no params and no path', function () {
    var options = {};
    _.addParamsAndAccessTokenToPath(accessToken, options);
    expect(options.path).to.eql('?access_token=abc123');
  });
  it('should handle existing params', function () {
    var options = { path: '/api?a=b' };
    _.addParamsAndAccessTokenToPath(accessToken, options);
    expect(options.path).to.eql('/api?access_token=abc123&a=b');
  });
  it('should handle a hash with params', function () {
    var options = { path: '/api?a=b#moreStuff??here' };
    _.addParamsAndAccessTokenToPath(accessToken, options);
    expect(options.path).to.eql('/api?access_token=abc123&a=b#moreStuff??here');
  });
  it('should handle a hash without params', function () {
    var options = { path: '/api#moreStuff??here' };
    _.addParamsAndAccessTokenToPath(accessToken, options);
    expect(options.path).to.eql('/api?access_token=abc123#moreStuff??here');
  });
  it('should handle a hash without params and no ?', function () {
    var options = { path: '/api#moreStuff' };
    _.addParamsAndAccessTokenToPath(accessToken, options);
    expect(options.path).to.eql('/api?access_token=abc123#moreStuff');
  });
  it('should handle extra params', function () {
    var options = { path: '/api#moreStuff' };
    _.addParamsAndAccessTokenToPath(accessToken, options, { foo: 'boo' });
    expect(options.path).to.eql('/api?access_token=abc123&foo=boo#moreStuff');
  });
});

describe('json3', function () {
  var setupCustomJSON = __webpack_require__(/*! ../vendor/JSON-js/json3.js */ "./vendor/JSON-js/json3.js");
  it('should replace stringify if not there', function () {
    var j = {};
    setupCustomJSON(j);
    expect(j.stringify({ a: 1 })).to.eql('{"a":1}');
  });
  it('should replace parse if not there', function () {
    var j = {};
    setupCustomJSON(j);
    expect(j.parse('{"a":1}').a).to.eql(1);
  });
  it('should not replace parse if there', function () {
    var j = {
      parse: function (s) {
        return 42;
      },
    };
    setupCustomJSON(j);
    expect(j.parse('{"a":1}')).to.eql(42);
    expect(j.stringify({ a: 1 })).to.eql('{"a":1}');
  });
  it('should not replace stringify if there', function () {
    var j = {
      stringify: function (s) {
        return '42';
      },
    };
    setupCustomJSON(j);
    expect(j.stringify({ a: 1 })).to.eql('42');
    expect(j.parse('{"a":1}').a).to.eql(1);
  });
});

describe('get', function () {
  it('should get a deeply nested value', function () {
    var o = { a: { b: { c: { d: 42 } } } };
    expect(_.get(o, 'a.b.c.d')).to.eql(42);
  });
  it('should be undefined for a missing value', function () {
    var o = { a: { b: { c: { d: 42 } } } };
    expect(_.get(o, 'a.b.x.d')).to.not.be.ok();
  });
  it('should handle bad input', function () {
    var o = 'hello';
    expect(_.get(o, 'oops.1.2.3')).to.not.be.ok();
  });
  it('should actually work with arrays too', function () {
    var o = { a: [{ b: { c: [1, { d: 42 }, null] } }, 99] };
    expect(_.get(o, 'a.0.b.c.1.d')).to.eql(42);
  });
  it('should handle undefined input', function () {
    var u = undefined;
    expect(_.get(u, 'a.b.c')).to.not.be.ok();
  });
});

describe('filterIp', function () {
  it('no user_ip', function () {
    var requestData = { something: 'but no ip' };
    _.filterIp(requestData, false);
    expect(requestData['user_ip']).to.not.be.ok();
  });
  it('capture true', function () {
    var ip = '123.32.394.99';
    var requestData = { user_ip: ip };
    _.filterIp(requestData, true);
    expect(requestData['user_ip']).to.eql(ip);
  });
  it('anonymize ip4', function () {
    var ip = '123.32.394.99';
    var requestData = { user_ip: ip };
    _.filterIp(requestData, 'anonymize');
    expect(requestData['user_ip']).to.not.eql(ip);
    expect(requestData['user_ip']).to.be.ok();
  });
  it('capture false', function () {
    var ip = '123.32.394.99';
    var requestData = { user_ip: ip };
    _.filterIp(requestData, false);
    expect(requestData['user_ip']).to.not.eql(ip);
    expect(requestData['user_ip']).to.not.be.ok();
  });
  it('ipv6 capture false', function () {
    var ip = '2607:f0d0:1002:51::4';
    var requestData = { user_ip: ip };
    _.filterIp(requestData, false);
    expect(requestData['user_ip']).to.not.eql(ip);
    expect(requestData['user_ip']).to.not.be.ok();
  });
  it('ipv6 anonymize', function () {
    var ips = [
      'FE80:0000:0000:0000:0202:B3FF:FE1E:8329',
      'FE80::0202:B3FF:FE1E:8329',
      '2607:f0d0:1002:51::4',
    ];
    for (var i = 0; i < ips.length; i++) {
      var ip = ips[i];
      var requestData = { user_ip: ip };
      _.filterIp(requestData, 'anonymize');
      expect(requestData['user_ip']).to.not.eql(ip);
      expect(requestData['user_ip']).to.be.ok();
    }
  });
});

describe('set', function () {
  it('should handle a top level key', function () {
    var o = { a: 42 };
    _.set(o, 'b', 1);
    expect(o.b).to.eql(1);
    expect(o.a).to.eql(42);
  });
  it('should handle a top level key', function () {
    var o = { a: 42, b: { c: 44, d: { e: 99 } } };
    _.set(o, 'f', 1);
    expect(o.f).to.eql(1);
    expect(o.a).to.eql(42);
    expect(o.b.c).to.eql(44);
    expect(o.b.d.e).to.eql(99);
  });
  it('should replace a value that is already there', function () {
    var o = { a: 42 };
    _.set(o, 'a', 1);
    expect(o.a).to.eql(1);
  });
  it('should set a nested value with missing keys', function () {
    var o = { baz: 21 };
    _.set(o, 'foo.bar', [42]);
    expect(o.baz).to.eql(21);
    expect(o.foo.bar).to.eql([42]);
  });
  it('should replace a nested value', function () {
    var o = { woo: 99, foo: { bar: { baz: 42, buzz: 97 }, a: 98 } };
    _.set(o, 'foo.bar.baz', 1);
    expect(o.woo).to.eql(99);
    expect(o.foo.a).to.eql(98);
    expect(o.foo.bar.buzz).to.eql(97);
    expect(o.foo.bar.baz).to.eql(1);
  });
  it('should set a nested value with some missing keys', function () {
    var o = { woo: 99, foo: { bar: { buzz: 97 }, a: 98 } };
    _.set(o, 'foo.bar.baz.fizz', 1);
    expect(o.woo).to.eql(99);
    expect(o.foo.a).to.eql(98);
    expect(o.foo.bar.buzz).to.eql(97);
    expect(o.foo.bar.baz.fizz).to.eql(1);
  });
});

var scrub = __webpack_require__(/*! ../src/scrub */ "./src/scrub.js");
describe('scrub', function () {
  it('should not redact fields that are okay', function () {
    var data = {
      a: 'somestring',
      password: 'abc123',
      tempWorker: 'cool',
    };
    var scrubFields = ['password', 'b', 'pw'];

    var result = scrub(data, scrubFields);

    expect(result.a).to.eql('somestring');
    expect(result.tempWorker).to.eql('cool');
  });
  it('should redact fields that are in the field list', function () {
    var data = {
      a: 'somestring',
      password: 'abc123',
    };
    var scrubFields = ['password', 'b'];

    var result = scrub(data, scrubFields);

    expect(result.password).to.eql(_.redact());
  });
  it('should handle nested objects', function () {
    var data = {
      a: {
        b: {
          badthing: 'secret',
          other: 'stuff',
        },
        c: 'bork',
        password: 'abc123',
      },
      secret: 'blahblah',
    };
    var scrubFields = ['badthing', 'password', 'secret'];

    var result = scrub(data, scrubFields);

    expect(result.a.b.other).to.eql('stuff');
    expect(result.a.b.badthing).to.eql(_.redact());
    expect(result.a.c).to.eql('bork');
    expect(result.a.password).to.eql(_.redact());
    expect(result.secret).to.eql(_.redact());
    expect(data.secret).to.eql('blahblah');
  });
  it('should do something sane for recursive objects', function () {
    var inner = {
      a: 'what',
      b: 'yes',
    };
    var data = {
      thing: 'stuff',
      password: 'abc123',
    };
    data.inner = inner;
    inner.outer = data;
    var scrubFields = ['password', 'a'];

    var result = scrub(data, scrubFields);

    expect(result.thing).to.eql('stuff');
    expect(result.password).to.eql(_.redact());
    expect(result.inner.a).to.eql(_.redact());
    expect(result.inner.a).to.be.ok();
    expect(result.inner.b).to.eql('yes');
  });
  it('should scrub objects seen twice', function () {
    var request = {
      password: 'foo',
    };

    var data = {
      request,
      response: { request },
    };

    var scrubFields = ['password'];

    var result = scrub(data, scrubFields);

    expect(result.request.password).to.eql(_.redact());
    expect(result.response.request.password).to.eql(_.redact());
  });
  it('should handle scrubPaths', function () {
    var data = {
      a: {
        b: {
          foo: 'secret',
          bar: 'stuff',
        },
        c: 'bork',
        password: 'abc123',
      },
      secret: 'blahblah',
    };
    var scrubPaths = [
      'nowhere', // path not found
      'a.b.foo', // nested path
      'a.password', // nested path
      'secret', // root path
    ];

    var result = scrub(data, [], scrubPaths);

    expect(result.a.b.bar).to.eql('stuff');
    expect(result.a.b.foo).to.eql(_.redact());
    expect(result.a.c).to.eql('bork');
    expect(result.a.password).to.eql(_.redact());
    expect(result.secret).to.eql(_.redact());
  });
});

describe('formatArgsAsString', function () {
  it('should handle null', function () {
    var args = [null, 1];
    var result = _.formatArgsAsString(args);

    expect(result).to.eql('null 1');
  });
  it('should handle undefined', function () {
    var args = [null, 1, undefined];
    var result = _.formatArgsAsString(args);

    expect(result).to.eql('null 1 undefined');
  });
  it('should handle objects', function () {
    var args = [1, { a: 42 }];
    var result = _.formatArgsAsString(args);

    expect(result).to.eql('1 {"a":42}');
  });
  it('should handle strings', function () {
    var args = [1, 'foo'];
    var result = _.formatArgsAsString(args);

    expect(result).to.eql('1 foo');
  });
  it('should handle empty args', function () {
    var args = [];
    var result = _.formatArgsAsString(args);

    expect(result).to.eql('');
  });
  /*
   * PhantomJS does not support Symbol yet
  it('should handle symbols', function() {
    var args = [1, Symbol('hello')];
    var result = _.formatArgsAsString(args);

    expect(result).to.eql('1 symbol(\'hello\')');
  });
  */
});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFzQztBQUM5RDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0Esd0JBQXdCLHNDQUFzQztBQUM5RDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUEsc0NBQXNDLEVBQUU7QUFDeEM7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSwrQ0FBK0MseUdBQXlHLEVBQUU7O0FBRTFKOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBLGNBQWM7O0FBRWQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYzs7QUFFZDtBQUNBOztBQUVBO0FBQ0E7QUFD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QTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLFNBQVM7QUFDM0I7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQSxxQkFBcUIsT0FBTztBQUM1Qjs7QUFFQSw4QkFBOEIsT0FBTztBQUNyQyxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3JvbGxiYXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvbWVyZ2UuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9zY3J1Yi5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy91dGlsaXR5L3RyYXZlcnNlLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi92ZW5kb3IvSlNPTi1qcy9qc29uMy5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3JvbGxiYXIvLi90ZXN0L3V0aWxpdHkudGVzdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoc2VsZiwgKCkgPT4ge1xucmV0dXJuICIsIid1c2Ugc3RyaWN0JztcblxudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG52YXIgaXNQbGFpbk9iamVjdCA9IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qob2JqKSB7XG4gIGlmICghb2JqIHx8IHRvU3RyLmNhbGwob2JqKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgaGFzT3duQ29uc3RydWN0b3IgPSBoYXNPd24uY2FsbChvYmosICdjb25zdHJ1Y3RvcicpO1xuICB2YXIgaGFzSXNQcm90b3R5cGVPZiA9XG4gICAgb2JqLmNvbnN0cnVjdG9yICYmXG4gICAgb2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSAmJlxuICAgIGhhc093bi5jYWxsKG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsICdpc1Byb3RvdHlwZU9mJyk7XG4gIC8vIE5vdCBvd24gY29uc3RydWN0b3IgcHJvcGVydHkgbXVzdCBiZSBPYmplY3RcbiAgaWYgKG9iai5jb25zdHJ1Y3RvciAmJiAhaGFzT3duQ29uc3RydWN0b3IgJiYgIWhhc0lzUHJvdG90eXBlT2YpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBPd24gcHJvcGVydGllcyBhcmUgZW51bWVyYXRlZCBmaXJzdGx5LCBzbyB0byBzcGVlZCB1cCxcbiAgLy8gaWYgbGFzdCBvbmUgaXMgb3duLCB0aGVuIGFsbCBwcm9wZXJ0aWVzIGFyZSBvd24uXG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIC8qKi9cbiAgfVxuXG4gIHJldHVybiB0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJyB8fCBoYXNPd24uY2FsbChvYmosIGtleSk7XG59O1xuXG5mdW5jdGlvbiBtZXJnZSgpIHtcbiAgdmFyIGksXG4gICAgc3JjLFxuICAgIGNvcHksXG4gICAgY2xvbmUsXG4gICAgbmFtZSxcbiAgICByZXN1bHQgPSB7fSxcbiAgICBjdXJyZW50ID0gbnVsbCxcbiAgICBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGN1cnJlbnQgPSBhcmd1bWVudHNbaV07XG4gICAgaWYgKGN1cnJlbnQgPT0gbnVsbCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgZm9yIChuYW1lIGluIGN1cnJlbnQpIHtcbiAgICAgIHNyYyA9IHJlc3VsdFtuYW1lXTtcbiAgICAgIGNvcHkgPSBjdXJyZW50W25hbWVdO1xuICAgICAgaWYgKHJlc3VsdCAhPT0gY29weSkge1xuICAgICAgICBpZiAoY29weSAmJiBpc1BsYWluT2JqZWN0KGNvcHkpKSB7XG4gICAgICAgICAgY2xvbmUgPSBzcmMgJiYgaXNQbGFpbk9iamVjdChzcmMpID8gc3JjIDoge307XG4gICAgICAgICAgcmVzdWx0W25hbWVdID0gbWVyZ2UoY2xvbmUsIGNvcHkpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb3B5ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IGNvcHk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZTtcbiIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsaXR5Jyk7XG52YXIgdHJhdmVyc2UgPSByZXF1aXJlKCcuL3V0aWxpdHkvdHJhdmVyc2UnKTtcblxuZnVuY3Rpb24gc2NydWIoZGF0YSwgc2NydWJGaWVsZHMsIHNjcnViUGF0aHMpIHtcbiAgc2NydWJGaWVsZHMgPSBzY3J1YkZpZWxkcyB8fCBbXTtcblxuICBpZiAoc2NydWJQYXRocykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NydWJQYXRocy5sZW5ndGg7ICsraSkge1xuICAgICAgc2NydWJQYXRoKGRhdGEsIHNjcnViUGF0aHNbaV0pO1xuICAgIH1cbiAgfVxuXG4gIHZhciBwYXJhbVJlcyA9IF9nZXRTY3J1YkZpZWxkUmVnZXhzKHNjcnViRmllbGRzKTtcbiAgdmFyIHF1ZXJ5UmVzID0gX2dldFNjcnViUXVlcnlQYXJhbVJlZ2V4cyhzY3J1YkZpZWxkcyk7XG5cbiAgZnVuY3Rpb24gcmVkYWN0UXVlcnlQYXJhbShkdW1teTAsIHBhcmFtUGFydCkge1xuICAgIHJldHVybiBwYXJhbVBhcnQgKyBfLnJlZGFjdCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyYW1TY3J1YmJlcih2KSB7XG4gICAgdmFyIGk7XG4gICAgaWYgKF8uaXNUeXBlKHYsICdzdHJpbmcnKSkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IHF1ZXJ5UmVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHYgPSB2LnJlcGxhY2UocXVlcnlSZXNbaV0sIHJlZGFjdFF1ZXJ5UGFyYW0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHZhbFNjcnViYmVyKGssIHYpIHtcbiAgICB2YXIgaTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgcGFyYW1SZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChwYXJhbVJlc1tpXS50ZXN0KGspKSB7XG4gICAgICAgIHYgPSBfLnJlZGFjdCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHY7XG4gIH1cblxuICBmdW5jdGlvbiBzY3J1YmJlcihrLCB2LCBzZWVuKSB7XG4gICAgdmFyIHRtcFYgPSB2YWxTY3J1YmJlcihrLCB2KTtcbiAgICBpZiAodG1wViA9PT0gdikge1xuICAgICAgaWYgKF8uaXNUeXBlKHYsICdvYmplY3QnKSB8fCBfLmlzVHlwZSh2LCAnYXJyYXknKSkge1xuICAgICAgICByZXR1cm4gdHJhdmVyc2Uodiwgc2NydWJiZXIsIHNlZW4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcmFtU2NydWJiZXIodG1wVik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0bXBWO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cmF2ZXJzZShkYXRhLCBzY3J1YmJlcik7XG59XG5cbmZ1bmN0aW9uIHNjcnViUGF0aChvYmosIHBhdGgpIHtcbiAgdmFyIGtleXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gIHZhciBsYXN0ID0ga2V5cy5sZW5ndGggLSAxO1xuICB0cnkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IGxhc3Q7ICsraSkge1xuICAgICAgaWYgKGkgPCBsYXN0KSB7XG4gICAgICAgIG9iaiA9IG9ialtrZXlzW2ldXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9ialtrZXlzW2ldXSA9IF8ucmVkYWN0KCk7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gTWlzc2luZyBrZXkgaXMgT0s7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2dldFNjcnViRmllbGRSZWdleHMoc2NydWJGaWVsZHMpIHtcbiAgdmFyIHJldCA9IFtdO1xuICB2YXIgcGF0O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHNjcnViRmllbGRzLmxlbmd0aDsgKytpKSB7XG4gICAgcGF0ID0gJ15cXFxcWz8oJTVbYkJdKT8nICsgc2NydWJGaWVsZHNbaV0gKyAnXFxcXFs/KCU1W2JCXSk/XFxcXF0/KCU1W2REXSk/JCc7XG4gICAgcmV0LnB1c2gobmV3IFJlZ0V4cChwYXQsICdpJykpO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIF9nZXRTY3J1YlF1ZXJ5UGFyYW1SZWdleHMoc2NydWJGaWVsZHMpIHtcbiAgdmFyIHJldCA9IFtdO1xuICB2YXIgcGF0O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHNjcnViRmllbGRzLmxlbmd0aDsgKytpKSB7XG4gICAgcGF0ID0gJ1xcXFxbPyglNVtiQl0pPycgKyBzY3J1YkZpZWxkc1tpXSArICdcXFxcWz8oJTVbYkJdKT9cXFxcXT8oJTVbZERdKT8nO1xuICAgIHJldC5wdXNoKG5ldyBSZWdFeHAoJygnICsgcGF0ICsgJz0pKFteJlxcXFxuXSspJywgJ2lnbScpKTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNjcnViO1xuIiwidmFyIG1lcmdlID0gcmVxdWlyZSgnLi9tZXJnZScpO1xuXG52YXIgUm9sbGJhckpTT04gPSB7fTtcbmZ1bmN0aW9uIHNldHVwSlNPTihwb2x5ZmlsbEpTT04pIHtcbiAgaWYgKGlzRnVuY3Rpb24oUm9sbGJhckpTT04uc3RyaW5naWZ5KSAmJiBpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnBhcnNlKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChpc0RlZmluZWQoSlNPTikpIHtcbiAgICAvLyBJZiBwb2x5ZmlsbCBpcyBwcm92aWRlZCwgcHJlZmVyIGl0IG92ZXIgZXhpc3Rpbmcgbm9uLW5hdGl2ZSBzaGltcy5cbiAgICBpZiAocG9seWZpbGxKU09OKSB7XG4gICAgICBpZiAoaXNOYXRpdmVGdW5jdGlvbihKU09OLnN0cmluZ2lmeSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04uc3RyaW5naWZ5ID0gSlNPTi5zdHJpbmdpZnk7XG4gICAgICB9XG4gICAgICBpZiAoaXNOYXRpdmVGdW5jdGlvbihKU09OLnBhcnNlKSkge1xuICAgICAgICBSb2xsYmFySlNPTi5wYXJzZSA9IEpTT04ucGFyc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGVsc2UgYWNjZXB0IGFueSBpbnRlcmZhY2UgdGhhdCBpcyBwcmVzZW50LlxuICAgICAgaWYgKGlzRnVuY3Rpb24oSlNPTi5zdHJpbmdpZnkpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnN0cmluZ2lmeSA9IEpTT04uc3RyaW5naWZ5O1xuICAgICAgfVxuICAgICAgaWYgKGlzRnVuY3Rpb24oSlNPTi5wYXJzZSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04ucGFyc2UgPSBKU09OLnBhcnNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoIWlzRnVuY3Rpb24oUm9sbGJhckpTT04uc3RyaW5naWZ5KSB8fCAhaXNGdW5jdGlvbihSb2xsYmFySlNPTi5wYXJzZSkpIHtcbiAgICBwb2x5ZmlsbEpTT04gJiYgcG9seWZpbGxKU09OKFJvbGxiYXJKU09OKTtcbiAgfVxufVxuXG4vKlxuICogaXNUeXBlIC0gR2l2ZW4gYSBKYXZhc2NyaXB0IHZhbHVlIGFuZCBhIHN0cmluZywgcmV0dXJucyB0cnVlIGlmIHRoZSB0eXBlIG9mIHRoZSB2YWx1ZSBtYXRjaGVzIHRoZVxuICogZ2l2ZW4gc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB4IC0gYW55IHZhbHVlXG4gKiBAcGFyYW0gdCAtIGEgbG93ZXJjYXNlIHN0cmluZyBjb250YWluaW5nIG9uZSBvZiB0aGUgZm9sbG93aW5nIHR5cGUgbmFtZXM6XG4gKiAgICAtIHVuZGVmaW5lZFxuICogICAgLSBudWxsXG4gKiAgICAtIGVycm9yXG4gKiAgICAtIG51bWJlclxuICogICAgLSBib29sZWFuXG4gKiAgICAtIHN0cmluZ1xuICogICAgLSBzeW1ib2xcbiAqICAgIC0gZnVuY3Rpb25cbiAqICAgIC0gb2JqZWN0XG4gKiAgICAtIGFycmF5XG4gKiBAcmV0dXJucyB0cnVlIGlmIHggaXMgb2YgdHlwZSB0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNUeXBlKHgsIHQpIHtcbiAgcmV0dXJuIHQgPT09IHR5cGVOYW1lKHgpO1xufVxuXG4vKlxuICogdHlwZU5hbWUgLSBHaXZlbiBhIEphdmFzY3JpcHQgdmFsdWUsIHJldHVybnMgdGhlIHR5cGUgb2YgdGhlIG9iamVjdCBhcyBhIHN0cmluZ1xuICovXG5mdW5jdGlvbiB0eXBlTmFtZSh4KSB7XG4gIHZhciBuYW1lID0gdHlwZW9mIHg7XG4gIGlmIChuYW1lICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBuYW1lO1xuICB9XG4gIGlmICgheCkge1xuICAgIHJldHVybiAnbnVsbCc7XG4gIH1cbiAgaWYgKHggaW5zdGFuY2VvZiBFcnJvcikge1xuICAgIHJldHVybiAnZXJyb3InO1xuICB9XG4gIHJldHVybiB7fS50b1N0cmluZ1xuICAgIC5jYWxsKHgpXG4gICAgLm1hdGNoKC9cXHMoW2EtekEtWl0rKS8pWzFdXG4gICAgLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8qIGlzRnVuY3Rpb24gLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIGEgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0gZiAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBmIGlzIGEgZnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGYpIHtcbiAgcmV0dXJuIGlzVHlwZShmLCAnZnVuY3Rpb24nKTtcbn1cblxuLyogaXNOYXRpdmVGdW5jdGlvbiAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgYSBuYXRpdmUgSlMgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0gZiAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBmIGlzIGEgbmF0aXZlIEpTIGZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOYXRpdmVGdW5jdGlvbihmKSB7XG4gIHZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG4gIHZhciBmdW5jTWF0Y2hTdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmdcbiAgICAuY2FsbChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KVxuICAgIC5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gICAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpO1xuICB2YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgKyBmdW5jTWF0Y2hTdHJpbmcgKyAnJCcpO1xuICByZXR1cm4gaXNPYmplY3QoZikgJiYgcmVJc05hdGl2ZS50ZXN0KGYpO1xufVxuXG4vKiBpc09iamVjdCAtIENoZWNrcyBpZiB0aGUgYXJndW1lbnQgaXMgYW4gb2JqZWN0XG4gKlxuICogQHBhcmFtIHZhbHVlIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlzIHZhbHVlIGlzIGFuIG9iamVjdCBmdW5jdGlvbiBpcyBhbiBvYmplY3QpXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKiBpc1N0cmluZyAtIENoZWNrcyBpZiB0aGUgYXJndW1lbnQgaXMgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0gdmFsdWUgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgdmFsdWUgaXMgYSBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgdmFsdWUgaW5zdGFuY2VvZiBTdHJpbmc7XG59XG5cbi8qKlxuICogaXNGaW5pdGVOdW1iZXIgLSBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBhIGZpbml0ZSBudW1iZXJcbiAqXG4gKiBAcGFyYW0geyp9IG4gLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgdmFsdWUgaXMgYSBmaW5pdGUgbnVtYmVyXG4gKi9cbmZ1bmN0aW9uIGlzRmluaXRlTnVtYmVyKG4pIHtcbiAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZShuKTtcbn1cblxuLypcbiAqIGlzRGVmaW5lZCAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgbm90IGVxdWFsIHRvIHVuZGVmaW5lZFxuICpcbiAqIEBwYXJhbSB1IC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIHUgaXMgYW55dGhpbmcgb3RoZXIgdGhhbiB1bmRlZmluZWRcbiAqL1xuZnVuY3Rpb24gaXNEZWZpbmVkKHUpIHtcbiAgcmV0dXJuICFpc1R5cGUodSwgJ3VuZGVmaW5lZCcpO1xufVxuXG4vKlxuICogaXNJdGVyYWJsZSAtIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGNhbiBiZSBpdGVyYXRlZCwgZXNzZW50aWFsbHlcbiAqIHdoZXRoZXIgaXQgaXMgYW4gb2JqZWN0IG9yIGFuIGFycmF5LlxuICpcbiAqIEBwYXJhbSBpIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGkgaXMgYW4gb2JqZWN0IG9yIGFuIGFycmF5IGFzIGRldGVybWluZWQgYnkgYHR5cGVOYW1lYFxuICovXG5mdW5jdGlvbiBpc0l0ZXJhYmxlKGkpIHtcbiAgdmFyIHR5cGUgPSB0eXBlTmFtZShpKTtcbiAgcmV0dXJuIHR5cGUgPT09ICdvYmplY3QnIHx8IHR5cGUgPT09ICdhcnJheSc7XG59XG5cbi8qXG4gKiBpc0Vycm9yIC0gY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgb2YgYW4gZXJyb3IgdHlwZVxuICpcbiAqIEBwYXJhbSBlIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGUgaXMgYW4gZXJyb3JcbiAqL1xuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIC8vIERldGVjdCBib3RoIEVycm9yIGFuZCBGaXJlZm94IEV4Y2VwdGlvbiB0eXBlXG4gIHJldHVybiBpc1R5cGUoZSwgJ2Vycm9yJykgfHwgaXNUeXBlKGUsICdleGNlcHRpb24nKTtcbn1cblxuLyogaXNQcm9taXNlIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBhIHByb21pc2VcbiAqXG4gKiBAcGFyYW0gcCAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBmIGlzIGEgZnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1Byb21pc2UocCkge1xuICByZXR1cm4gaXNPYmplY3QocCkgJiYgaXNUeXBlKHAudGhlbiwgJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogaXNCcm93c2VyIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgdGhlIGNvZGUgaXMgcnVubmluZyBpbiBhIGJyb3dzZXJcbiAqXG4gKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBjb2RlIGlzIHJ1bm5pbmcgaW4gYSBicm93c2VyIGVudmlyb25tZW50XG4gKi9cbmZ1bmN0aW9uIGlzQnJvd3NlcigpIHtcbiAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xufVxuXG5mdW5jdGlvbiByZWRhY3QoKSB7XG4gIHJldHVybiAnKioqKioqKionO1xufVxuXG4vLyBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzg4MDk0NzIvMTEzODE5MVxuZnVuY3Rpb24gdXVpZDQoKSB7XG4gIHZhciBkID0gbm93KCk7XG4gIHZhciB1dWlkID0gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZShcbiAgICAvW3h5XS9nLFxuICAgIGZ1bmN0aW9uIChjKSB7XG4gICAgICB2YXIgciA9IChkICsgTWF0aC5yYW5kb20oKSAqIDE2KSAlIDE2IHwgMDtcbiAgICAgIGQgPSBNYXRoLmZsb29yKGQgLyAxNik7XG4gICAgICByZXR1cm4gKGMgPT09ICd4JyA/IHIgOiAociAmIDB4NykgfCAweDgpLnRvU3RyaW5nKDE2KTtcbiAgICB9LFxuICApO1xuICByZXR1cm4gdXVpZDtcbn1cblxudmFyIExFVkVMUyA9IHtcbiAgZGVidWc6IDAsXG4gIGluZm86IDEsXG4gIHdhcm5pbmc6IDIsXG4gIGVycm9yOiAzLFxuICBjcml0aWNhbDogNCxcbn07XG5cbmZ1bmN0aW9uIHNhbml0aXplVXJsKHVybCkge1xuICB2YXIgYmFzZVVybFBhcnRzID0gcGFyc2VVcmkodXJsKTtcbiAgaWYgKCFiYXNlVXJsUGFydHMpIHtcbiAgICByZXR1cm4gJyh1bmtub3duKSc7XG4gIH1cblxuICAvLyByZW1vdmUgYSB0cmFpbGluZyAjIGlmIHRoZXJlIGlzIG5vIGFuY2hvclxuICBpZiAoYmFzZVVybFBhcnRzLmFuY2hvciA9PT0gJycpIHtcbiAgICBiYXNlVXJsUGFydHMuc291cmNlID0gYmFzZVVybFBhcnRzLnNvdXJjZS5yZXBsYWNlKCcjJywgJycpO1xuICB9XG5cbiAgdXJsID0gYmFzZVVybFBhcnRzLnNvdXJjZS5yZXBsYWNlKCc/JyArIGJhc2VVcmxQYXJ0cy5xdWVyeSwgJycpO1xuICByZXR1cm4gdXJsO1xufVxuXG52YXIgcGFyc2VVcmlPcHRpb25zID0ge1xuICBzdHJpY3RNb2RlOiBmYWxzZSxcbiAga2V5OiBbXG4gICAgJ3NvdXJjZScsXG4gICAgJ3Byb3RvY29sJyxcbiAgICAnYXV0aG9yaXR5JyxcbiAgICAndXNlckluZm8nLFxuICAgICd1c2VyJyxcbiAgICAncGFzc3dvcmQnLFxuICAgICdob3N0JyxcbiAgICAncG9ydCcsXG4gICAgJ3JlbGF0aXZlJyxcbiAgICAncGF0aCcsXG4gICAgJ2RpcmVjdG9yeScsXG4gICAgJ2ZpbGUnLFxuICAgICdxdWVyeScsXG4gICAgJ2FuY2hvcicsXG4gIF0sXG4gIHE6IHtcbiAgICBuYW1lOiAncXVlcnlLZXknLFxuICAgIHBhcnNlcjogLyg/Ol58JikoW14mPV0qKT0/KFteJl0qKS9nLFxuICB9LFxuICBwYXJzZXI6IHtcbiAgICBzdHJpY3Q6XG4gICAgICAvXig/OihbXjpcXC8/I10rKTopPyg/OlxcL1xcLygoPzooKFteOkBdKikoPzo6KFteOkBdKikpPyk/QCk/KFteOlxcLz8jXSopKD86OihcXGQqKSk/KSk/KCgoKD86W14/I1xcL10qXFwvKSopKFtePyNdKikpKD86XFw/KFteI10qKSk/KD86IyguKikpPykvLFxuICAgIGxvb3NlOlxuICAgICAgL14oPzooPyFbXjpAXSs6W146QFxcL10qQCkoW146XFwvPyMuXSspOik/KD86XFwvXFwvKT8oKD86KChbXjpAXSopKD86OihbXjpAXSopKT8pP0ApPyhbXjpcXC8/I10qKSg/OjooXFxkKikpPykoKChcXC8oPzpbXj8jXSg/IVtePyNcXC9dKlxcLltePyNcXC8uXSsoPzpbPyNdfCQpKSkqXFwvPyk/KFtePyNcXC9dKikpKD86XFw/KFteI10qKSk/KD86IyguKikpPykvLFxuICB9LFxufTtcblxuZnVuY3Rpb24gcGFyc2VVcmkoc3RyKSB7XG4gIGlmICghaXNUeXBlKHN0ciwgJ3N0cmluZycpKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHZhciBvID0gcGFyc2VVcmlPcHRpb25zO1xuICB2YXIgbSA9IG8ucGFyc2VyW28uc3RyaWN0TW9kZSA/ICdzdHJpY3QnIDogJ2xvb3NlJ10uZXhlYyhzdHIpO1xuICB2YXIgdXJpID0ge307XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBvLmtleS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICB1cmlbby5rZXlbaV1dID0gbVtpXSB8fCAnJztcbiAgfVxuXG4gIHVyaVtvLnEubmFtZV0gPSB7fTtcbiAgdXJpW28ua2V5WzEyXV0ucmVwbGFjZShvLnEucGFyc2VyLCBmdW5jdGlvbiAoJDAsICQxLCAkMikge1xuICAgIGlmICgkMSkge1xuICAgICAgdXJpW28ucS5uYW1lXVskMV0gPSAkMjtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB1cmk7XG59XG5cbmZ1bmN0aW9uIGFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoKGFjY2Vzc1Rva2VuLCBvcHRpb25zLCBwYXJhbXMpIHtcbiAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICBwYXJhbXMuYWNjZXNzX3Rva2VuID0gYWNjZXNzVG9rZW47XG4gIHZhciBwYXJhbXNBcnJheSA9IFtdO1xuICB2YXIgaztcbiAgZm9yIChrIGluIHBhcmFtcykge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyYW1zLCBrKSkge1xuICAgICAgcGFyYW1zQXJyYXkucHVzaChbaywgcGFyYW1zW2tdXS5qb2luKCc9JykpO1xuICAgIH1cbiAgfVxuICB2YXIgcXVlcnkgPSAnPycgKyBwYXJhbXNBcnJheS5zb3J0KCkuam9pbignJicpO1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBvcHRpb25zLnBhdGggPSBvcHRpb25zLnBhdGggfHwgJyc7XG4gIHZhciBxcyA9IG9wdGlvbnMucGF0aC5pbmRleE9mKCc/Jyk7XG4gIHZhciBoID0gb3B0aW9ucy5wYXRoLmluZGV4T2YoJyMnKTtcbiAgdmFyIHA7XG4gIGlmIChxcyAhPT0gLTEgJiYgKGggPT09IC0xIHx8IGggPiBxcykpIHtcbiAgICBwID0gb3B0aW9ucy5wYXRoO1xuICAgIG9wdGlvbnMucGF0aCA9IHAuc3Vic3RyaW5nKDAsIHFzKSArIHF1ZXJ5ICsgJyYnICsgcC5zdWJzdHJpbmcocXMgKyAxKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoaCAhPT0gLTEpIHtcbiAgICAgIHAgPSBvcHRpb25zLnBhdGg7XG4gICAgICBvcHRpb25zLnBhdGggPSBwLnN1YnN0cmluZygwLCBoKSArIHF1ZXJ5ICsgcC5zdWJzdHJpbmcoaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMucGF0aCA9IG9wdGlvbnMucGF0aCArIHF1ZXJ5O1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBmb3JtYXRVcmwodSwgcHJvdG9jb2wpIHtcbiAgcHJvdG9jb2wgPSBwcm90b2NvbCB8fCB1LnByb3RvY29sO1xuICBpZiAoIXByb3RvY29sICYmIHUucG9ydCkge1xuICAgIGlmICh1LnBvcnQgPT09IDgwKSB7XG4gICAgICBwcm90b2NvbCA9ICdodHRwOic7XG4gICAgfSBlbHNlIGlmICh1LnBvcnQgPT09IDQ0Mykge1xuICAgICAgcHJvdG9jb2wgPSAnaHR0cHM6JztcbiAgICB9XG4gIH1cbiAgcHJvdG9jb2wgPSBwcm90b2NvbCB8fCAnaHR0cHM6JztcblxuICBpZiAoIXUuaG9zdG5hbWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2YXIgcmVzdWx0ID0gcHJvdG9jb2wgKyAnLy8nICsgdS5ob3N0bmFtZTtcbiAgaWYgKHUucG9ydCkge1xuICAgIHJlc3VsdCA9IHJlc3VsdCArICc6JyArIHUucG9ydDtcbiAgfVxuICBpZiAodS5wYXRoKSB7XG4gICAgcmVzdWx0ID0gcmVzdWx0ICsgdS5wYXRoO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeShvYmosIGJhY2t1cCkge1xuICB2YXIgdmFsdWUsIGVycm9yO1xuICB0cnkge1xuICAgIHZhbHVlID0gUm9sbGJhckpTT04uc3RyaW5naWZ5KG9iaik7XG4gIH0gY2F0Y2ggKGpzb25FcnJvcikge1xuICAgIGlmIChiYWNrdXAgJiYgaXNGdW5jdGlvbihiYWNrdXApKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IGJhY2t1cChvYmopO1xuICAgICAgfSBjYXRjaCAoYmFja3VwRXJyb3IpIHtcbiAgICAgICAgZXJyb3IgPSBiYWNrdXBFcnJvcjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZXJyb3IgPSBqc29uRXJyb3I7XG4gICAgfVxuICB9XG4gIHJldHVybiB7IGVycm9yOiBlcnJvciwgdmFsdWU6IHZhbHVlIH07XG59XG5cbmZ1bmN0aW9uIG1heEJ5dGVTaXplKHN0cmluZykge1xuICAvLyBUaGUgdHJhbnNwb3J0IHdpbGwgdXNlIHV0Zi04LCBzbyBhc3N1bWUgdXRmLTggZW5jb2RpbmcuXG4gIC8vXG4gIC8vIFRoaXMgbWluaW1hbCBpbXBsZW1lbnRhdGlvbiB3aWxsIGFjY3VyYXRlbHkgY291bnQgYnl0ZXMgZm9yIGFsbCBVQ1MtMiBhbmRcbiAgLy8gc2luZ2xlIGNvZGUgcG9pbnQgVVRGLTE2LiBJZiBwcmVzZW50ZWQgd2l0aCBtdWx0aSBjb2RlIHBvaW50IFVURi0xNixcbiAgLy8gd2hpY2ggc2hvdWxkIGJlIHJhcmUsIGl0IHdpbGwgc2FmZWx5IG92ZXJjb3VudCwgbm90IHVuZGVyY291bnQuXG4gIC8vXG4gIC8vIFdoaWxlIHJvYnVzdCB1dGYtOCBlbmNvZGVycyBleGlzdCwgdGhpcyBpcyBmYXIgc21hbGxlciBhbmQgZmFyIG1vcmUgcGVyZm9ybWFudC5cbiAgLy8gRm9yIHF1aWNrbHkgY291bnRpbmcgcGF5bG9hZCBzaXplIGZvciB0cnVuY2F0aW9uLCBzbWFsbGVyIGlzIGJldHRlci5cblxuICB2YXIgY291bnQgPSAwO1xuICB2YXIgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGNvZGUgPSBzdHJpbmcuY2hhckNvZGVBdChpKTtcbiAgICBpZiAoY29kZSA8IDEyOCkge1xuICAgICAgLy8gdXAgdG8gNyBiaXRzXG4gICAgICBjb3VudCA9IGNvdW50ICsgMTtcbiAgICB9IGVsc2UgaWYgKGNvZGUgPCAyMDQ4KSB7XG4gICAgICAvLyB1cCB0byAxMSBiaXRzXG4gICAgICBjb3VudCA9IGNvdW50ICsgMjtcbiAgICB9IGVsc2UgaWYgKGNvZGUgPCA2NTUzNikge1xuICAgICAgLy8gdXAgdG8gMTYgYml0c1xuICAgICAgY291bnQgPSBjb3VudCArIDM7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvdW50O1xufVxuXG5mdW5jdGlvbiBqc29uUGFyc2Uocykge1xuICB2YXIgdmFsdWUsIGVycm9yO1xuICB0cnkge1xuICAgIHZhbHVlID0gUm9sbGJhckpTT04ucGFyc2Uocyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBlcnJvciA9IGU7XG4gIH1cbiAgcmV0dXJuIHsgZXJyb3I6IGVycm9yLCB2YWx1ZTogdmFsdWUgfTtcbn1cblxuZnVuY3Rpb24gbWFrZVVuaGFuZGxlZFN0YWNrSW5mbyhcbiAgbWVzc2FnZSxcbiAgdXJsLFxuICBsaW5lbm8sXG4gIGNvbG5vLFxuICBlcnJvcixcbiAgbW9kZSxcbiAgYmFja3VwTWVzc2FnZSxcbiAgZXJyb3JQYXJzZXIsXG4pIHtcbiAgdmFyIGxvY2F0aW9uID0ge1xuICAgIHVybDogdXJsIHx8ICcnLFxuICAgIGxpbmU6IGxpbmVubyxcbiAgICBjb2x1bW46IGNvbG5vLFxuICB9O1xuICBsb2NhdGlvbi5mdW5jID0gZXJyb3JQYXJzZXIuZ3Vlc3NGdW5jdGlvbk5hbWUobG9jYXRpb24udXJsLCBsb2NhdGlvbi5saW5lKTtcbiAgbG9jYXRpb24uY29udGV4dCA9IGVycm9yUGFyc2VyLmdhdGhlckNvbnRleHQobG9jYXRpb24udXJsLCBsb2NhdGlvbi5saW5lKTtcbiAgdmFyIGhyZWYgPVxuICAgIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICBkb2N1bWVudCAmJlxuICAgIGRvY3VtZW50LmxvY2F0aW9uICYmXG4gICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZjtcbiAgdmFyIHVzZXJhZ2VudCA9XG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB3aW5kb3cgJiZcbiAgICB3aW5kb3cubmF2aWdhdG9yICYmXG4gICAgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gIHJldHVybiB7XG4gICAgbW9kZTogbW9kZSxcbiAgICBtZXNzYWdlOiBlcnJvciA/IFN0cmluZyhlcnJvcikgOiBtZXNzYWdlIHx8IGJhY2t1cE1lc3NhZ2UsXG4gICAgdXJsOiBocmVmLFxuICAgIHN0YWNrOiBbbG9jYXRpb25dLFxuICAgIHVzZXJhZ2VudDogdXNlcmFnZW50LFxuICB9O1xufVxuXG5mdW5jdGlvbiB3cmFwQ2FsbGJhY2sobG9nZ2VyLCBmKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgdHJ5IHtcbiAgICAgIGYoZXJyLCByZXNwKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoZSk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBub25DaXJjdWxhckNsb25lKG9iaikge1xuICB2YXIgc2VlbiA9IFtvYmpdO1xuXG4gIGZ1bmN0aW9uIGNsb25lKG9iaiwgc2Vlbikge1xuICAgIHZhciB2YWx1ZSxcbiAgICAgIG5hbWUsXG4gICAgICBuZXdTZWVuLFxuICAgICAgcmVzdWx0ID0ge307XG5cbiAgICB0cnkge1xuICAgICAgZm9yIChuYW1lIGluIG9iaikge1xuICAgICAgICB2YWx1ZSA9IG9ialtuYW1lXTtcblxuICAgICAgICBpZiAodmFsdWUgJiYgKGlzVHlwZSh2YWx1ZSwgJ29iamVjdCcpIHx8IGlzVHlwZSh2YWx1ZSwgJ2FycmF5JykpKSB7XG4gICAgICAgICAgaWYgKHNlZW4uaW5jbHVkZXModmFsdWUpKSB7XG4gICAgICAgICAgICByZXN1bHRbbmFtZV0gPSAnUmVtb3ZlZCBjaXJjdWxhciByZWZlcmVuY2U6ICcgKyB0eXBlTmFtZSh2YWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld1NlZW4gPSBzZWVuLnNsaWNlKCk7XG4gICAgICAgICAgICBuZXdTZWVuLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgcmVzdWx0W25hbWVdID0gY2xvbmUodmFsdWUsIG5ld1NlZW4pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdFtuYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlc3VsdCA9ICdGYWlsZWQgY2xvbmluZyBjdXN0b20gZGF0YTogJyArIGUubWVzc2FnZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICByZXR1cm4gY2xvbmUob2JqLCBzZWVuKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlSXRlbShhcmdzLCBsb2dnZXIsIG5vdGlmaWVyLCByZXF1ZXN0S2V5cywgbGFtYmRhQ29udGV4dCkge1xuICB2YXIgbWVzc2FnZSwgZXJyLCBjdXN0b20sIGNhbGxiYWNrLCByZXF1ZXN0O1xuICB2YXIgYXJnO1xuICB2YXIgZXh0cmFBcmdzID0gW107XG4gIHZhciBkaWFnbm9zdGljID0ge307XG4gIHZhciBhcmdUeXBlcyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJncy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBhcmcgPSBhcmdzW2ldO1xuXG4gICAgdmFyIHR5cCA9IHR5cGVOYW1lKGFyZyk7XG4gICAgYXJnVHlwZXMucHVzaCh0eXApO1xuICAgIHN3aXRjaCAodHlwKSB7XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIG1lc3NhZ2UgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKG1lc3NhZ2UgPSBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgY2FsbGJhY2sgPSB3cmFwQ2FsbGJhY2sobG9nZ2VyLCBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICBleHRyYUFyZ3MucHVzaChhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgIGNhc2UgJ2RvbWV4Y2VwdGlvbic6XG4gICAgICBjYXNlICdleGNlcHRpb24nOiAvLyBGaXJlZm94IEV4Y2VwdGlvbiB0eXBlXG4gICAgICAgIGVyciA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoZXJyID0gYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgY2FzZSAnYXJyYXknOlxuICAgICAgICBpZiAoXG4gICAgICAgICAgYXJnIGluc3RhbmNlb2YgRXJyb3IgfHxcbiAgICAgICAgICAodHlwZW9mIERPTUV4Y2VwdGlvbiAhPT0gJ3VuZGVmaW5lZCcgJiYgYXJnIGluc3RhbmNlb2YgRE9NRXhjZXB0aW9uKVxuICAgICAgICApIHtcbiAgICAgICAgICBlcnIgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGVyciA9IGFyZyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlcXVlc3RLZXlzICYmIHR5cCA9PT0gJ29iamVjdCcgJiYgIXJlcXVlc3QpIHtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMCwgbGVuID0gcmVxdWVzdEtleXMubGVuZ3RoOyBqIDwgbGVuOyArK2opIHtcbiAgICAgICAgICAgIGlmIChhcmdbcmVxdWVzdEtleXNbal1dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgcmVxdWVzdCA9IGFyZztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXF1ZXN0KSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY3VzdG9tID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChjdXN0b20gPSBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChcbiAgICAgICAgICBhcmcgaW5zdGFuY2VvZiBFcnJvciB8fFxuICAgICAgICAgICh0eXBlb2YgRE9NRXhjZXB0aW9uICE9PSAndW5kZWZpbmVkJyAmJiBhcmcgaW5zdGFuY2VvZiBET01FeGNlcHRpb24pXG4gICAgICAgICkge1xuICAgICAgICAgIGVyciA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoZXJyID0gYXJnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBleHRyYUFyZ3MucHVzaChhcmcpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIGN1c3RvbSBpcyBhbiBhcnJheSB0aGlzIHR1cm5zIGl0IGludG8gYW4gb2JqZWN0IHdpdGggaW50ZWdlciBrZXlzXG4gIGlmIChjdXN0b20pIGN1c3RvbSA9IG5vbkNpcmN1bGFyQ2xvbmUoY3VzdG9tKTtcblxuICBpZiAoZXh0cmFBcmdzLmxlbmd0aCA+IDApIHtcbiAgICBpZiAoIWN1c3RvbSkgY3VzdG9tID0gbm9uQ2lyY3VsYXJDbG9uZSh7fSk7XG4gICAgY3VzdG9tLmV4dHJhQXJncyA9IG5vbkNpcmN1bGFyQ2xvbmUoZXh0cmFBcmdzKTtcbiAgfVxuXG4gIHZhciBpdGVtID0ge1xuICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgZXJyOiBlcnIsXG4gICAgY3VzdG9tOiBjdXN0b20sXG4gICAgdGltZXN0YW1wOiBub3coKSxcbiAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgbm90aWZpZXI6IG5vdGlmaWVyLFxuICAgIGRpYWdub3N0aWM6IGRpYWdub3N0aWMsXG4gICAgdXVpZDogdXVpZDQoKSxcbiAgfTtcblxuICBpdGVtLmRhdGEgPSBpdGVtLmRhdGEgfHwge307XG5cbiAgc2V0Q3VzdG9tSXRlbUtleXMoaXRlbSwgY3VzdG9tKTtcblxuICBpZiAocmVxdWVzdEtleXMgJiYgcmVxdWVzdCkge1xuICAgIGl0ZW0ucmVxdWVzdCA9IHJlcXVlc3Q7XG4gIH1cbiAgaWYgKGxhbWJkYUNvbnRleHQpIHtcbiAgICBpdGVtLmxhbWJkYUNvbnRleHQgPSBsYW1iZGFDb250ZXh0O1xuICB9XG4gIGl0ZW0uX29yaWdpbmFsQXJncyA9IGFyZ3M7XG4gIGl0ZW0uZGlhZ25vc3RpYy5vcmlnaW5hbF9hcmdfdHlwZXMgPSBhcmdUeXBlcztcbiAgcmV0dXJuIGl0ZW07XG59XG5cbmZ1bmN0aW9uIHNldEN1c3RvbUl0ZW1LZXlzKGl0ZW0sIGN1c3RvbSkge1xuICBpZiAoY3VzdG9tICYmIGN1c3RvbS5sZXZlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaXRlbS5sZXZlbCA9IGN1c3RvbS5sZXZlbDtcbiAgICBkZWxldGUgY3VzdG9tLmxldmVsO1xuICB9XG4gIGlmIChjdXN0b20gJiYgY3VzdG9tLnNraXBGcmFtZXMgIT09IHVuZGVmaW5lZCkge1xuICAgIGl0ZW0uc2tpcEZyYW1lcyA9IGN1c3RvbS5za2lwRnJhbWVzO1xuICAgIGRlbGV0ZSBjdXN0b20uc2tpcEZyYW1lcztcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRFcnJvckNvbnRleHQoaXRlbSwgZXJyb3JzKSB7XG4gIHZhciBjdXN0b20gPSBpdGVtLmRhdGEuY3VzdG9tIHx8IHt9O1xuICB2YXIgY29udGV4dEFkZGVkID0gZmFsc2U7XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVycm9ycy5sZW5ndGg7ICsraSkge1xuICAgICAgaWYgKGVycm9yc1tpXS5oYXNPd25Qcm9wZXJ0eSgncm9sbGJhckNvbnRleHQnKSkge1xuICAgICAgICBjdXN0b20gPSBtZXJnZShjdXN0b20sIG5vbkNpcmN1bGFyQ2xvbmUoZXJyb3JzW2ldLnJvbGxiYXJDb250ZXh0KSk7XG4gICAgICAgIGNvbnRleHRBZGRlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXZvaWQgYWRkaW5nIGFuIGVtcHR5IG9iamVjdCB0byB0aGUgZGF0YS5cbiAgICBpZiAoY29udGV4dEFkZGVkKSB7XG4gICAgICBpdGVtLmRhdGEuY3VzdG9tID0gY3VzdG9tO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGl0ZW0uZGlhZ25vc3RpYy5lcnJvcl9jb250ZXh0ID0gJ0ZhaWxlZDogJyArIGUubWVzc2FnZTtcbiAgfVxufVxuXG52YXIgVEVMRU1FVFJZX1RZUEVTID0gW1xuICAnbG9nJyxcbiAgJ25ldHdvcmsnLFxuICAnZG9tJyxcbiAgJ25hdmlnYXRpb24nLFxuICAnZXJyb3InLFxuICAnbWFudWFsJyxcbl07XG52YXIgVEVMRU1FVFJZX0xFVkVMUyA9IFsnY3JpdGljYWwnLCAnZXJyb3InLCAnd2FybmluZycsICdpbmZvJywgJ2RlYnVnJ107XG5cbmZ1bmN0aW9uIGFycmF5SW5jbHVkZXMoYXJyLCB2YWwpIHtcbiAgZm9yICh2YXIgayA9IDA7IGsgPCBhcnIubGVuZ3RoOyArK2spIHtcbiAgICBpZiAoYXJyW2tdID09PSB2YWwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVGVsZW1ldHJ5RXZlbnQoYXJncykge1xuICB2YXIgdHlwZSwgbWV0YWRhdGEsIGxldmVsO1xuICB2YXIgYXJnO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJncy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBhcmcgPSBhcmdzW2ldO1xuXG4gICAgdmFyIHR5cCA9IHR5cGVOYW1lKGFyZyk7XG4gICAgc3dpdGNoICh0eXApIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIGlmICghdHlwZSAmJiBhcnJheUluY2x1ZGVzKFRFTEVNRVRSWV9UWVBFUywgYXJnKSkge1xuICAgICAgICAgIHR5cGUgPSBhcmc7XG4gICAgICAgIH0gZWxzZSBpZiAoIWxldmVsICYmIGFycmF5SW5jbHVkZXMoVEVMRU1FVFJZX0xFVkVMUywgYXJnKSkge1xuICAgICAgICAgIGxldmVsID0gYXJnO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgbWV0YWRhdGEgPSBhcmc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHZhciBldmVudCA9IHtcbiAgICB0eXBlOiB0eXBlIHx8ICdtYW51YWwnLFxuICAgIG1ldGFkYXRhOiBtZXRhZGF0YSB8fCB7fSxcbiAgICBsZXZlbDogbGV2ZWwsXG4gIH07XG5cbiAgcmV0dXJuIGV2ZW50O1xufVxuXG5mdW5jdGlvbiBhZGRJdGVtQXR0cmlidXRlcyhpdGVtLCBhdHRyaWJ1dGVzKSB7XG4gIGl0ZW0uZGF0YS5hdHRyaWJ1dGVzID0gaXRlbS5kYXRhLmF0dHJpYnV0ZXMgfHwgW107XG4gIGlmIChhdHRyaWJ1dGVzKSB7XG4gICAgaXRlbS5kYXRhLmF0dHJpYnV0ZXMucHVzaCguLi5hdHRyaWJ1dGVzKTtcbiAgfVxufVxuXG4vKlxuICogZ2V0IC0gZ2l2ZW4gYW4gb2JqL2FycmF5IGFuZCBhIGtleXBhdGgsIHJldHVybiB0aGUgdmFsdWUgYXQgdGhhdCBrZXlwYXRoIG9yXG4gKiAgICAgICB1bmRlZmluZWQgaWYgbm90IHBvc3NpYmxlLlxuICpcbiAqIEBwYXJhbSBvYmogLSBhbiBvYmplY3Qgb3IgYXJyYXlcbiAqIEBwYXJhbSBwYXRoIC0gYSBzdHJpbmcgb2Yga2V5cyBzZXBhcmF0ZWQgYnkgJy4nIHN1Y2ggYXMgJ3BsdWdpbi5qcXVlcnkuMC5tZXNzYWdlJ1xuICogICAgd2hpY2ggd291bGQgY29ycmVzcG9uZCB0byA0MiBpbiBge3BsdWdpbjoge2pxdWVyeTogW3ttZXNzYWdlOiA0Mn1dfX1gXG4gKi9cbmZ1bmN0aW9uIGdldChvYmosIHBhdGgpIHtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHZhciBrZXlzID0gcGF0aC5zcGxpdCgnLicpO1xuICB2YXIgcmVzdWx0ID0gb2JqO1xuICB0cnkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBrZXlzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICByZXN1bHQgPSByZXN1bHRba2V5c1tpXV07XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgcmVzdWx0ID0gdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHNldChvYmosIHBhdGgsIHZhbHVlKSB7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBrZXlzID0gcGF0aC5zcGxpdCgnLicpO1xuICB2YXIgbGVuID0ga2V5cy5sZW5ndGg7XG4gIGlmIChsZW4gPCAxKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChsZW4gPT09IDEpIHtcbiAgICBvYmpba2V5c1swXV0gPSB2YWx1ZTtcbiAgICByZXR1cm47XG4gIH1cbiAgdHJ5IHtcbiAgICB2YXIgdGVtcCA9IG9ialtrZXlzWzBdXSB8fCB7fTtcbiAgICB2YXIgcmVwbGFjZW1lbnQgPSB0ZW1wO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbGVuIC0gMTsgKytpKSB7XG4gICAgICB0ZW1wW2tleXNbaV1dID0gdGVtcFtrZXlzW2ldXSB8fCB7fTtcbiAgICAgIHRlbXAgPSB0ZW1wW2tleXNbaV1dO1xuICAgIH1cbiAgICB0ZW1wW2tleXNbbGVuIC0gMV1dID0gdmFsdWU7XG4gICAgb2JqW2tleXNbMF1dID0gcmVwbGFjZW1lbnQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm47XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0QXJnc0FzU3RyaW5nKGFyZ3MpIHtcbiAgdmFyIGksIGxlbiwgYXJnO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAoaSA9IDAsIGxlbiA9IGFyZ3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBhcmcgPSBhcmdzW2ldO1xuICAgIHN3aXRjaCAodHlwZU5hbWUoYXJnKSkge1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgYXJnID0gc3RyaW5naWZ5KGFyZyk7XG4gICAgICAgIGFyZyA9IGFyZy5lcnJvciB8fCBhcmcudmFsdWU7XG4gICAgICAgIGlmIChhcmcubGVuZ3RoID4gNTAwKSB7XG4gICAgICAgICAgYXJnID0gYXJnLnN1YnN0cigwLCA0OTcpICsgJy4uLic7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdudWxsJzpcbiAgICAgICAgYXJnID0gJ251bGwnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgIGFyZyA9ICd1bmRlZmluZWQnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N5bWJvbCc6XG4gICAgICAgIGFyZyA9IGFyZy50b1N0cmluZygpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmVzdWx0LnB1c2goYXJnKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0LmpvaW4oJyAnKTtcbn1cblxuZnVuY3Rpb24gbm93KCkge1xuICBpZiAoRGF0ZS5ub3cpIHtcbiAgICByZXR1cm4gK0RhdGUubm93KCk7XG4gIH1cbiAgcmV0dXJuICtuZXcgRGF0ZSgpO1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJJcChyZXF1ZXN0RGF0YSwgY2FwdHVyZUlwKSB7XG4gIGlmICghcmVxdWVzdERhdGEgfHwgIXJlcXVlc3REYXRhWyd1c2VyX2lwJ10gfHwgY2FwdHVyZUlwID09PSB0cnVlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuZXdJcCA9IHJlcXVlc3REYXRhWyd1c2VyX2lwJ107XG4gIGlmICghY2FwdHVyZUlwKSB7XG4gICAgbmV3SXAgPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIHRyeSB7XG4gICAgICB2YXIgcGFydHM7XG4gICAgICBpZiAobmV3SXAuaW5kZXhPZignLicpICE9PSAtMSkge1xuICAgICAgICBwYXJ0cyA9IG5ld0lwLnNwbGl0KCcuJyk7XG4gICAgICAgIHBhcnRzLnBvcCgpO1xuICAgICAgICBwYXJ0cy5wdXNoKCcwJyk7XG4gICAgICAgIG5ld0lwID0gcGFydHMuam9pbignLicpO1xuICAgICAgfSBlbHNlIGlmIChuZXdJcC5pbmRleE9mKCc6JykgIT09IC0xKSB7XG4gICAgICAgIHBhcnRzID0gbmV3SXAuc3BsaXQoJzonKTtcbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICB2YXIgYmVnaW5uaW5nID0gcGFydHMuc2xpY2UoMCwgMyk7XG4gICAgICAgICAgdmFyIHNsYXNoSWR4ID0gYmVnaW5uaW5nWzJdLmluZGV4T2YoJy8nKTtcbiAgICAgICAgICBpZiAoc2xhc2hJZHggIT09IC0xKSB7XG4gICAgICAgICAgICBiZWdpbm5pbmdbMl0gPSBiZWdpbm5pbmdbMl0uc3Vic3RyaW5nKDAsIHNsYXNoSWR4KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHRlcm1pbmFsID0gJzAwMDA6MDAwMDowMDAwOjAwMDA6MDAwMCc7XG4gICAgICAgICAgbmV3SXAgPSBiZWdpbm5pbmcuY29uY2F0KHRlcm1pbmFsKS5qb2luKCc6Jyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0lwID0gbnVsbDtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBuZXdJcCA9IG51bGw7XG4gICAgfVxuICB9XG4gIHJlcXVlc3REYXRhWyd1c2VyX2lwJ10gPSBuZXdJcDtcbn1cblxuZnVuY3Rpb24gaGFuZGxlT3B0aW9ucyhjdXJyZW50LCBpbnB1dCwgcGF5bG9hZCwgbG9nZ2VyKSB7XG4gIHZhciByZXN1bHQgPSBtZXJnZShjdXJyZW50LCBpbnB1dCwgcGF5bG9hZCk7XG4gIHJlc3VsdCA9IHVwZGF0ZURlcHJlY2F0ZWRPcHRpb25zKHJlc3VsdCwgbG9nZ2VyKTtcbiAgaWYgKCFpbnB1dCB8fCBpbnB1dC5vdmVyd3JpdGVTY3J1YkZpZWxkcykge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgaWYgKGlucHV0LnNjcnViRmllbGRzKSB7XG4gICAgcmVzdWx0LnNjcnViRmllbGRzID0gKGN1cnJlbnQuc2NydWJGaWVsZHMgfHwgW10pLmNvbmNhdChpbnB1dC5zY3J1YkZpZWxkcyk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlRGVwcmVjYXRlZE9wdGlvbnMob3B0aW9ucywgbG9nZ2VyKSB7XG4gIGlmIChvcHRpb25zLmhvc3RXaGl0ZUxpc3QgJiYgIW9wdGlvbnMuaG9zdFNhZmVMaXN0KSB7XG4gICAgb3B0aW9ucy5ob3N0U2FmZUxpc3QgPSBvcHRpb25zLmhvc3RXaGl0ZUxpc3Q7XG4gICAgb3B0aW9ucy5ob3N0V2hpdGVMaXN0ID0gdW5kZWZpbmVkO1xuICAgIGxvZ2dlciAmJiBsb2dnZXIubG9nKCdob3N0V2hpdGVMaXN0IGlzIGRlcHJlY2F0ZWQuIFVzZSBob3N0U2FmZUxpc3QuJyk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaG9zdEJsYWNrTGlzdCAmJiAhb3B0aW9ucy5ob3N0QmxvY2tMaXN0KSB7XG4gICAgb3B0aW9ucy5ob3N0QmxvY2tMaXN0ID0gb3B0aW9ucy5ob3N0QmxhY2tMaXN0O1xuICAgIG9wdGlvbnMuaG9zdEJsYWNrTGlzdCA9IHVuZGVmaW5lZDtcbiAgICBsb2dnZXIgJiYgbG9nZ2VyLmxvZygnaG9zdEJsYWNrTGlzdCBpcyBkZXByZWNhdGVkLiBVc2UgaG9zdEJsb2NrTGlzdC4nKTtcbiAgfVxuICByZXR1cm4gb3B0aW9ucztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoOiBhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aCxcbiAgY3JlYXRlSXRlbTogY3JlYXRlSXRlbSxcbiAgYWRkRXJyb3JDb250ZXh0OiBhZGRFcnJvckNvbnRleHQsXG4gIGNyZWF0ZVRlbGVtZXRyeUV2ZW50OiBjcmVhdGVUZWxlbWV0cnlFdmVudCxcbiAgYWRkSXRlbUF0dHJpYnV0ZXM6IGFkZEl0ZW1BdHRyaWJ1dGVzLFxuICBmaWx0ZXJJcDogZmlsdGVySXAsXG4gIGZvcm1hdEFyZ3NBc1N0cmluZzogZm9ybWF0QXJnc0FzU3RyaW5nLFxuICBmb3JtYXRVcmw6IGZvcm1hdFVybCxcbiAgZ2V0OiBnZXQsXG4gIGhhbmRsZU9wdGlvbnM6IGhhbmRsZU9wdGlvbnMsXG4gIGlzRXJyb3I6IGlzRXJyb3IsXG4gIGlzRmluaXRlTnVtYmVyOiBpc0Zpbml0ZU51bWJlcixcbiAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgaXNJdGVyYWJsZTogaXNJdGVyYWJsZSxcbiAgaXNOYXRpdmVGdW5jdGlvbjogaXNOYXRpdmVGdW5jdGlvbixcbiAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICBpc1N0cmluZzogaXNTdHJpbmcsXG4gIGlzVHlwZTogaXNUeXBlLFxuICBpc1Byb21pc2U6IGlzUHJvbWlzZSxcbiAgaXNCcm93c2VyOiBpc0Jyb3dzZXIsXG4gIGpzb25QYXJzZToganNvblBhcnNlLFxuICBMRVZFTFM6IExFVkVMUyxcbiAgbWFrZVVuaGFuZGxlZFN0YWNrSW5mbzogbWFrZVVuaGFuZGxlZFN0YWNrSW5mbyxcbiAgbWVyZ2U6IG1lcmdlLFxuICBub3c6IG5vdyxcbiAgcmVkYWN0OiByZWRhY3QsXG4gIFJvbGxiYXJKU09OOiBSb2xsYmFySlNPTixcbiAgc2FuaXRpemVVcmw6IHNhbml0aXplVXJsLFxuICBzZXQ6IHNldCxcbiAgc2V0dXBKU09OOiBzZXR1cEpTT04sXG4gIHN0cmluZ2lmeTogc3RyaW5naWZ5LFxuICBtYXhCeXRlU2l6ZTogbWF4Qnl0ZVNpemUsXG4gIHR5cGVOYW1lOiB0eXBlTmFtZSxcbiAgdXVpZDQ6IHV1aWQ0LFxufTtcbiIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbGl0eScpO1xuXG5mdW5jdGlvbiB0cmF2ZXJzZShvYmosIGZ1bmMsIHNlZW4pIHtcbiAgdmFyIGssIHYsIGk7XG4gIHZhciBpc09iaiA9IF8uaXNUeXBlKG9iaiwgJ29iamVjdCcpO1xuICB2YXIgaXNBcnJheSA9IF8uaXNUeXBlKG9iaiwgJ2FycmF5Jyk7XG4gIHZhciBrZXlzID0gW107XG4gIHZhciBzZWVuSW5kZXg7XG5cbiAgLy8gQmVzdCBtaWdodCBiZSB0byB1c2UgTWFwIGhlcmUgd2l0aCBgb2JqYCBhcyB0aGUga2V5cywgYnV0IHdlIHdhbnQgdG8gc3VwcG9ydCBJRSA8IDExLlxuICBzZWVuID0gc2VlbiB8fCB7IG9iajogW10sIG1hcHBlZDogW10gfTtcblxuICBpZiAoaXNPYmopIHtcbiAgICBzZWVuSW5kZXggPSBzZWVuLm9iai5pbmRleE9mKG9iaik7XG5cbiAgICBpZiAoaXNPYmogJiYgc2VlbkluZGV4ICE9PSAtMSkge1xuICAgICAgLy8gUHJlZmVyIHRoZSBtYXBwZWQgb2JqZWN0IGlmIHRoZXJlIGlzIG9uZS5cbiAgICAgIHJldHVybiBzZWVuLm1hcHBlZFtzZWVuSW5kZXhdIHx8IHNlZW4ub2JqW3NlZW5JbmRleF07XG4gICAgfVxuXG4gICAgc2Vlbi5vYmoucHVzaChvYmopO1xuICAgIHNlZW5JbmRleCA9IHNlZW4ub2JqLmxlbmd0aCAtIDE7XG4gIH1cblxuICBpZiAoaXNPYmopIHtcbiAgICBmb3IgKGsgaW4gb2JqKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaykpIHtcbiAgICAgICAga2V5cy5wdXNoKGspO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChpc0FycmF5KSB7XG4gICAgZm9yIChpID0gMDsgaSA8IG9iai5sZW5ndGg7ICsraSkge1xuICAgICAga2V5cy5wdXNoKGkpO1xuICAgIH1cbiAgfVxuXG4gIHZhciByZXN1bHQgPSBpc09iaiA/IHt9IDogW107XG4gIHZhciBzYW1lID0gdHJ1ZTtcbiAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICBrID0ga2V5c1tpXTtcbiAgICB2ID0gb2JqW2tdO1xuICAgIHJlc3VsdFtrXSA9IGZ1bmMoaywgdiwgc2Vlbik7XG4gICAgc2FtZSA9IHNhbWUgJiYgcmVzdWx0W2tdID09PSBvYmpba107XG4gIH1cblxuICBpZiAoaXNPYmogJiYgIXNhbWUpIHtcbiAgICBzZWVuLm1hcHBlZFtzZWVuSW5kZXhdID0gcmVzdWx0O1xuICB9XG5cbiAgcmV0dXJuICFzYW1lID8gcmVzdWx0IDogb2JqO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRyYXZlcnNlO1xuIiwiLy8gIGpzb24zLmpzXG4vLyAgMjAxNy0wMi0yMVxuLy8gIFB1YmxpYyBEb21haW4uXG4vLyAgTk8gV0FSUkFOVFkgRVhQUkVTU0VEIE9SIElNUExJRUQuIFVTRSBBVCBZT1VSIE9XTiBSSVNLLlxuLy8gIFNlZSBodHRwOi8vd3d3LkpTT04ub3JnL2pzLmh0bWxcbi8vICBUaGlzIGNvZGUgc2hvdWxkIGJlIG1pbmlmaWVkIGJlZm9yZSBkZXBsb3ltZW50LlxuLy8gIFNlZSBodHRwOi8vamF2YXNjcmlwdC5jcm9ja2ZvcmQuY29tL2pzbWluLmh0bWxcblxuLy8gIFVTRSBZT1VSIE9XTiBDT1BZLiBJVCBJUyBFWFRSRU1FTFkgVU5XSVNFIFRPIExPQUQgQ09ERSBGUk9NIFNFUlZFUlMgWU9VIERPXG4vLyAgTk9UIENPTlRST0wuXG5cbi8vICBUaGlzIGZpbGUgY3JlYXRlcyBhIGdsb2JhbCBKU09OIG9iamVjdCBjb250YWluaW5nIHR3byBtZXRob2RzOiBzdHJpbmdpZnlcbi8vICBhbmQgcGFyc2UuIFRoaXMgZmlsZSBwcm92aWRlcyB0aGUgRVM1IEpTT04gY2FwYWJpbGl0eSB0byBFUzMgc3lzdGVtcy5cbi8vICBJZiBhIHByb2plY3QgbWlnaHQgcnVuIG9uIElFOCBvciBlYXJsaWVyLCB0aGVuIHRoaXMgZmlsZSBzaG91bGQgYmUgaW5jbHVkZWQuXG4vLyAgVGhpcyBmaWxlIGRvZXMgbm90aGluZyBvbiBFUzUgc3lzdGVtcy5cblxuLy8gICAgICBKU09OLnN0cmluZ2lmeSh2YWx1ZSwgcmVwbGFjZXIsIHNwYWNlKVxuLy8gICAgICAgICAgdmFsdWUgICAgICAgYW55IEphdmFTY3JpcHQgdmFsdWUsIHVzdWFsbHkgYW4gb2JqZWN0IG9yIGFycmF5LlxuLy8gICAgICAgICAgcmVwbGFjZXIgICAgYW4gb3B0aW9uYWwgcGFyYW1ldGVyIHRoYXQgZGV0ZXJtaW5lcyBob3cgb2JqZWN0XG4vLyAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXMgYXJlIHN0cmluZ2lmaWVkIGZvciBvYmplY3RzLiBJdCBjYW4gYmUgYVxuLy8gICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gb3IgYW4gYXJyYXkgb2Ygc3RyaW5ncy5cbi8vICAgICAgICAgIHNwYWNlICAgICAgIGFuIG9wdGlvbmFsIHBhcmFtZXRlciB0aGF0IHNwZWNpZmllcyB0aGUgaW5kZW50YXRpb25cbi8vICAgICAgICAgICAgICAgICAgICAgIG9mIG5lc3RlZCBzdHJ1Y3R1cmVzLiBJZiBpdCBpcyBvbWl0dGVkLCB0aGUgdGV4dCB3aWxsXG4vLyAgICAgICAgICAgICAgICAgICAgICBiZSBwYWNrZWQgd2l0aG91dCBleHRyYSB3aGl0ZXNwYWNlLiBJZiBpdCBpcyBhIG51bWJlcixcbi8vICAgICAgICAgICAgICAgICAgICAgIGl0IHdpbGwgc3BlY2lmeSB0aGUgbnVtYmVyIG9mIHNwYWNlcyB0byBpbmRlbnQgYXQgZWFjaFxuLy8gICAgICAgICAgICAgICAgICAgICAgbGV2ZWwuIElmIGl0IGlzIGEgc3RyaW5nIChzdWNoIGFzIFwiXFx0XCIgb3IgXCImbmJzcDtcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICBpdCBjb250YWlucyB0aGUgY2hhcmFjdGVycyB1c2VkIHRvIGluZGVudCBhdCBlYWNoIGxldmVsLlxuLy8gICAgICAgICAgVGhpcyBtZXRob2QgcHJvZHVjZXMgYSBKU09OIHRleHQgZnJvbSBhIEphdmFTY3JpcHQgdmFsdWUuXG4vLyAgICAgICAgICBXaGVuIGFuIG9iamVjdCB2YWx1ZSBpcyBmb3VuZCwgaWYgdGhlIG9iamVjdCBjb250YWlucyBhIHRvSlNPTlxuLy8gICAgICAgICAgbWV0aG9kLCBpdHMgdG9KU09OIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCBhbmQgdGhlIHJlc3VsdCB3aWxsIGJlXG4vLyAgICAgICAgICBzdHJpbmdpZmllZC4gQSB0b0pTT04gbWV0aG9kIGRvZXMgbm90IHNlcmlhbGl6ZTogaXQgcmV0dXJucyB0aGVcbi8vICAgICAgICAgIHZhbHVlIHJlcHJlc2VudGVkIGJ5IHRoZSBuYW1lL3ZhbHVlIHBhaXIgdGhhdCBzaG91bGQgYmUgc2VyaWFsaXplZCxcbi8vICAgICAgICAgIG9yIHVuZGVmaW5lZCBpZiBub3RoaW5nIHNob3VsZCBiZSBzZXJpYWxpemVkLiBUaGUgdG9KU09OIG1ldGhvZFxuLy8gICAgICAgICAgd2lsbCBiZSBwYXNzZWQgdGhlIGtleSBhc3NvY2lhdGVkIHdpdGggdGhlIHZhbHVlLCBhbmQgdGhpcyB3aWxsIGJlXG4vLyAgICAgICAgICBib3VuZCB0byB0aGUgdmFsdWUuXG5cbi8vICAgICAgICAgIEZvciBleGFtcGxlLCB0aGlzIHdvdWxkIHNlcmlhbGl6ZSBEYXRlcyBhcyBJU08gc3RyaW5ncy5cblxuLy8gICAgICAgICAgICAgIERhdGUucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZihuKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAvLyBGb3JtYXQgaW50ZWdlcnMgdG8gaGF2ZSBhdCBsZWFzdCB0d28gZGlnaXRzLlxuLy8gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChuIDwgMTApXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcIjBcIiArIG5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICA6IG47XG4vLyAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VVRDRnVsbFllYXIoKSAgICsgXCItXCIgK1xuLy8gICAgICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENNb250aCgpICsgMSkgKyBcIi1cIiArXG4vLyAgICAgICAgICAgICAgICAgICAgICAgZih0aGlzLmdldFVUQ0RhdGUoKSkgICAgICArIFwiVFwiICtcbi8vICAgICAgICAgICAgICAgICAgICAgICBmKHRoaXMuZ2V0VVRDSG91cnMoKSkgICAgICsgXCI6XCIgK1xuLy8gICAgICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENNaW51dGVzKCkpICAgKyBcIjpcIiArXG4vLyAgICAgICAgICAgICAgICAgICAgICAgZih0aGlzLmdldFVUQ1NlY29uZHMoKSkgICArIFwiWlwiO1xuLy8gICAgICAgICAgICAgIH07XG5cbi8vICAgICAgICAgIFlvdSBjYW4gcHJvdmlkZSBhbiBvcHRpb25hbCByZXBsYWNlciBtZXRob2QuIEl0IHdpbGwgYmUgcGFzc2VkIHRoZVxuLy8gICAgICAgICAga2V5IGFuZCB2YWx1ZSBvZiBlYWNoIG1lbWJlciwgd2l0aCB0aGlzIGJvdW5kIHRvIHRoZSBjb250YWluaW5nXG4vLyAgICAgICAgICBvYmplY3QuIFRoZSB2YWx1ZSB0aGF0IGlzIHJldHVybmVkIGZyb20geW91ciBtZXRob2Qgd2lsbCBiZVxuLy8gICAgICAgICAgc2VyaWFsaXplZC4gSWYgeW91ciBtZXRob2QgcmV0dXJucyB1bmRlZmluZWQsIHRoZW4gdGhlIG1lbWJlciB3aWxsXG4vLyAgICAgICAgICBiZSBleGNsdWRlZCBmcm9tIHRoZSBzZXJpYWxpemF0aW9uLlxuXG4vLyAgICAgICAgICBJZiB0aGUgcmVwbGFjZXIgcGFyYW1ldGVyIGlzIGFuIGFycmF5IG9mIHN0cmluZ3MsIHRoZW4gaXQgd2lsbCBiZVxuLy8gICAgICAgICAgdXNlZCB0byBzZWxlY3QgdGhlIG1lbWJlcnMgdG8gYmUgc2VyaWFsaXplZC4gSXQgZmlsdGVycyB0aGUgcmVzdWx0c1xuLy8gICAgICAgICAgc3VjaCB0aGF0IG9ubHkgbWVtYmVycyB3aXRoIGtleXMgbGlzdGVkIGluIHRoZSByZXBsYWNlciBhcnJheSBhcmVcbi8vICAgICAgICAgIHN0cmluZ2lmaWVkLlxuXG4vLyAgICAgICAgICBWYWx1ZXMgdGhhdCBkbyBub3QgaGF2ZSBKU09OIHJlcHJlc2VudGF0aW9ucywgc3VjaCBhcyB1bmRlZmluZWQgb3Jcbi8vICAgICAgICAgIGZ1bmN0aW9ucywgd2lsbCBub3QgYmUgc2VyaWFsaXplZC4gU3VjaCB2YWx1ZXMgaW4gb2JqZWN0cyB3aWxsIGJlXG4vLyAgICAgICAgICBkcm9wcGVkOyBpbiBhcnJheXMgdGhleSB3aWxsIGJlIHJlcGxhY2VkIHdpdGggbnVsbC4gWW91IGNhbiB1c2Vcbi8vICAgICAgICAgIGEgcmVwbGFjZXIgZnVuY3Rpb24gdG8gcmVwbGFjZSB0aG9zZSB3aXRoIEpTT04gdmFsdWVzLlxuXG4vLyAgICAgICAgICBKU09OLnN0cmluZ2lmeSh1bmRlZmluZWQpIHJldHVybnMgdW5kZWZpbmVkLlxuXG4vLyAgICAgICAgICBUaGUgb3B0aW9uYWwgc3BhY2UgcGFyYW1ldGVyIHByb2R1Y2VzIGEgc3RyaW5naWZpY2F0aW9uIG9mIHRoZVxuLy8gICAgICAgICAgdmFsdWUgdGhhdCBpcyBmaWxsZWQgd2l0aCBsaW5lIGJyZWFrcyBhbmQgaW5kZW50YXRpb24gdG8gbWFrZSBpdFxuLy8gICAgICAgICAgZWFzaWVyIHRvIHJlYWQuXG5cbi8vICAgICAgICAgIElmIHRoZSBzcGFjZSBwYXJhbWV0ZXIgaXMgYSBub24tZW1wdHkgc3RyaW5nLCB0aGVuIHRoYXQgc3RyaW5nIHdpbGxcbi8vICAgICAgICAgIGJlIHVzZWQgZm9yIGluZGVudGF0aW9uLiBJZiB0aGUgc3BhY2UgcGFyYW1ldGVyIGlzIGEgbnVtYmVyLCB0aGVuXG4vLyAgICAgICAgICB0aGUgaW5kZW50YXRpb24gd2lsbCBiZSB0aGF0IG1hbnkgc3BhY2VzLlxuXG4vLyAgICAgICAgICBFeGFtcGxlOlxuXG4vLyAgICAgICAgICB0ZXh0ID0gSlNPTi5zdHJpbmdpZnkoW1wiZVwiLCB7cGx1cmlidXM6IFwidW51bVwifV0pO1xuLy8gICAgICAgICAgLy8gdGV4dCBpcyAnW1wiZVwiLHtcInBsdXJpYnVzXCI6XCJ1bnVtXCJ9XSdcblxuLy8gICAgICAgICAgdGV4dCA9IEpTT04uc3RyaW5naWZ5KFtcImVcIiwge3BsdXJpYnVzOiBcInVudW1cIn1dLCBudWxsLCBcIlxcdFwiKTtcbi8vICAgICAgICAgIC8vIHRleHQgaXMgJ1tcXG5cXHRcImVcIixcXG5cXHR7XFxuXFx0XFx0XCJwbHVyaWJ1c1wiOiBcInVudW1cIlxcblxcdH1cXG5dJ1xuXG4vLyAgICAgICAgICB0ZXh0ID0gSlNPTi5zdHJpbmdpZnkoW25ldyBEYXRlKCldLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuLy8gICAgICAgICAgICAgIHJldHVybiB0aGlzW2tleV0gaW5zdGFuY2VvZiBEYXRlXG4vLyAgICAgICAgICAgICAgICAgID8gXCJEYXRlKFwiICsgdGhpc1trZXldICsgXCIpXCJcbi8vICAgICAgICAgICAgICAgICAgOiB2YWx1ZTtcbi8vICAgICAgICAgIH0pO1xuLy8gICAgICAgICAgLy8gdGV4dCBpcyAnW1wiRGF0ZSgtLS1jdXJyZW50IHRpbWUtLS0pXCJdJ1xuXG4vLyAgICAgIEpTT04ucGFyc2UodGV4dCwgcmV2aXZlcilcbi8vICAgICAgICAgIFRoaXMgbWV0aG9kIHBhcnNlcyBhIEpTT04gdGV4dCB0byBwcm9kdWNlIGFuIG9iamVjdCBvciBhcnJheS5cbi8vICAgICAgICAgIEl0IGNhbiB0aHJvdyBhIFN5bnRheEVycm9yIGV4Y2VwdGlvbi5cbi8vICAgICAgICAgIFRoaXMgaGFzIGJlZW4gbW9kaWZpZWQgdG8gdXNlIEpTT04tanMvanNvbl9wYXJzZV9zdGF0ZS5qcyBhcyB0aGVcbi8vICAgICAgICAgIHBhcnNlciBpbnN0ZWFkIG9mIHRoZSBvbmUgYnVpbHQgYXJvdW5kIGV2YWwgZm91bmQgaW4gSlNPTi1qcy9qc29uMi5qc1xuXG4vLyAgICAgICAgICBUaGUgb3B0aW9uYWwgcmV2aXZlciBwYXJhbWV0ZXIgaXMgYSBmdW5jdGlvbiB0aGF0IGNhbiBmaWx0ZXIgYW5kXG4vLyAgICAgICAgICB0cmFuc2Zvcm0gdGhlIHJlc3VsdHMuIEl0IHJlY2VpdmVzIGVhY2ggb2YgdGhlIGtleXMgYW5kIHZhbHVlcyxcbi8vICAgICAgICAgIGFuZCBpdHMgcmV0dXJuIHZhbHVlIGlzIHVzZWQgaW5zdGVhZCBvZiB0aGUgb3JpZ2luYWwgdmFsdWUuXG4vLyAgICAgICAgICBJZiBpdCByZXR1cm5zIHdoYXQgaXQgcmVjZWl2ZWQsIHRoZW4gdGhlIHN0cnVjdHVyZSBpcyBub3QgbW9kaWZpZWQuXG4vLyAgICAgICAgICBJZiBpdCByZXR1cm5zIHVuZGVmaW5lZCB0aGVuIHRoZSBtZW1iZXIgaXMgZGVsZXRlZC5cblxuLy8gICAgICAgICAgRXhhbXBsZTpcblxuLy8gICAgICAgICAgLy8gUGFyc2UgdGhlIHRleHQuIFZhbHVlcyB0aGF0IGxvb2sgbGlrZSBJU08gZGF0ZSBzdHJpbmdzIHdpbGxcbi8vICAgICAgICAgIC8vIGJlIGNvbnZlcnRlZCB0byBEYXRlIG9iamVjdHMuXG5cbi8vICAgICAgICAgIG15RGF0YSA9IEpTT04ucGFyc2UodGV4dCwgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbi8vICAgICAgICAgICAgICB2YXIgYTtcbi8vICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSB7XG4vLyAgICAgICAgICAgICAgICAgIGEgPVxuLy8gICAvXihcXGR7NH0pLShcXGR7Mn0pLShcXGR7Mn0pVChcXGR7Mn0pOihcXGR7Mn0pOihcXGR7Mn0oPzpcXC5cXGQqKT8pWiQvLmV4ZWModmFsdWUpO1xuLy8gICAgICAgICAgICAgICAgICBpZiAoYSkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKCthWzFdLCArYVsyXSAtIDEsICthWzNdLCArYVs0XSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICArYVs1XSwgK2FbNl0pKTtcbi8vICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4vLyAgICAgICAgICB9KTtcblxuLy8gICAgICAgICAgbXlEYXRhID0gSlNPTi5wYXJzZSgnW1wiRGF0ZSgwOS8wOS8yMDAxKVwiXScsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4vLyAgICAgICAgICAgICAgdmFyIGQ7XG4vLyAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJlxuLy8gICAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2xpY2UoMCwgNSkgPT09IFwiRGF0ZShcIiAmJlxuLy8gICAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2xpY2UoLTEpID09PSBcIilcIikge1xuLy8gICAgICAgICAgICAgICAgICBkID0gbmV3IERhdGUodmFsdWUuc2xpY2UoNSwgLTEpKTtcbi8vICAgICAgICAgICAgICAgICAgaWYgKGQpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkO1xuLy8gICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbi8vICAgICAgICAgIH0pO1xuXG4vLyAgVGhpcyBpcyBhIHJlZmVyZW5jZSBpbXBsZW1lbnRhdGlvbi4gWW91IGFyZSBmcmVlIHRvIGNvcHksIG1vZGlmeSwgb3Jcbi8vICByZWRpc3RyaWJ1dGUuXG5cbi8qanNsaW50XG4gIGZvciwgdGhpc1xuICAqL1xuXG4vKnByb3BlcnR5XG4gIEpTT04sIGFwcGx5LCBjYWxsLCBjaGFyQ29kZUF0LCBnZXRVVENEYXRlLCBnZXRVVENGdWxsWWVhciwgZ2V0VVRDSG91cnMsXG4gIGdldFVUQ01pbnV0ZXMsIGdldFVUQ01vbnRoLCBnZXRVVENTZWNvbmRzLCBoYXNPd25Qcm9wZXJ0eSwgam9pbixcbiAgbGFzdEluZGV4LCBsZW5ndGgsIHBhcnNlLCBwcm90b3R5cGUsIHB1c2gsIHJlcGxhY2UsIHNsaWNlLCBzdHJpbmdpZnksXG4gIHRlc3QsIHRvSlNPTiwgdG9TdHJpbmcsIHZhbHVlT2ZcbiAgKi9cblxudmFyIHNldHVwQ3VzdG9tSlNPTiA9IGZ1bmN0aW9uKEpTT04pIHtcblxuICB2YXIgcnhfb25lID0gL15bXFxdLDp7fVxcc10qJC87XG4gIHZhciByeF90d28gPSAvXFxcXCg/OltcIlxcXFxcXC9iZm5ydF18dVswLTlhLWZBLUZdezR9KS9nO1xuICB2YXIgcnhfdGhyZWUgPSAvXCJbXlwiXFxcXFxcblxccl0qXCJ8dHJ1ZXxmYWxzZXxudWxsfC0/XFxkKyg/OlxcLlxcZCopPyg/OltlRV1bK1xcLV0/XFxkKyk/L2c7XG4gIHZhciByeF9mb3VyID0gLyg/Ol58OnwsKSg/OlxccypcXFspKy9nO1xuICB2YXIgcnhfZXNjYXBhYmxlID0gL1tcXFxcXCJcXHUwMDAwLVxcdTAwMWZcXHUwMDdmLVxcdTAwOWZcXHUwMGFkXFx1MDYwMC1cXHUwNjA0XFx1MDcwZlxcdTE3YjRcXHUxN2I1XFx1MjAwYy1cXHUyMDBmXFx1MjAyOC1cXHUyMDJmXFx1MjA2MC1cXHUyMDZmXFx1ZmVmZlxcdWZmZjAtXFx1ZmZmZl0vZztcbiAgdmFyIHJ4X2Rhbmdlcm91cyA9IC9bXFx1MDAwMFxcdTAwYWRcXHUwNjAwLVxcdTA2MDRcXHUwNzBmXFx1MTdiNFxcdTE3YjVcXHUyMDBjLVxcdTIwMGZcXHUyMDI4LVxcdTIwMmZcXHUyMDYwLVxcdTIwNmZcXHVmZWZmXFx1ZmZmMC1cXHVmZmZmXS9nO1xuXG4gIGZ1bmN0aW9uIGYobikge1xuICAgIC8vIEZvcm1hdCBpbnRlZ2VycyB0byBoYXZlIGF0IGxlYXN0IHR3byBkaWdpdHMuXG4gICAgcmV0dXJuIG4gPCAxMFxuICAgICAgPyBcIjBcIiArIG5cbiAgICAgIDogbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRoaXNfdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVPZigpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBEYXRlLnByb3RvdHlwZS50b0pTT04gIT09IFwiZnVuY3Rpb25cIikge1xuXG4gICAgRGF0ZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICByZXR1cm4gaXNGaW5pdGUodGhpcy52YWx1ZU9mKCkpXG4gICAgICAgID8gdGhpcy5nZXRVVENGdWxsWWVhcigpICsgXCItXCIgK1xuICAgICAgICBmKHRoaXMuZ2V0VVRDTW9udGgoKSArIDEpICsgXCItXCIgK1xuICAgICAgICBmKHRoaXMuZ2V0VVRDRGF0ZSgpKSArIFwiVFwiICtcbiAgICAgICAgZih0aGlzLmdldFVUQ0hvdXJzKCkpICsgXCI6XCIgK1xuICAgICAgICBmKHRoaXMuZ2V0VVRDTWludXRlcygpKSArIFwiOlwiICtcbiAgICAgICAgZih0aGlzLmdldFVUQ1NlY29uZHMoKSkgKyBcIlpcIlxuICAgICAgICA6IG51bGw7XG4gICAgfTtcblxuICAgIEJvb2xlYW4ucHJvdG90eXBlLnRvSlNPTiA9IHRoaXNfdmFsdWU7XG4gICAgTnVtYmVyLnByb3RvdHlwZS50b0pTT04gPSB0aGlzX3ZhbHVlO1xuICAgIFN0cmluZy5wcm90b3R5cGUudG9KU09OID0gdGhpc192YWx1ZTtcbiAgfVxuXG4gIHZhciBnYXA7XG4gIHZhciBpbmRlbnQ7XG4gIHZhciBtZXRhO1xuICB2YXIgcmVwO1xuXG5cbiAgZnVuY3Rpb24gcXVvdGUoc3RyaW5nKSB7XG5cbiAgICAvLyBJZiB0aGUgc3RyaW5nIGNvbnRhaW5zIG5vIGNvbnRyb2wgY2hhcmFjdGVycywgbm8gcXVvdGUgY2hhcmFjdGVycywgYW5kIG5vXG4gICAgLy8gYmFja3NsYXNoIGNoYXJhY3RlcnMsIHRoZW4gd2UgY2FuIHNhZmVseSBzbGFwIHNvbWUgcXVvdGVzIGFyb3VuZCBpdC5cbiAgICAvLyBPdGhlcndpc2Ugd2UgbXVzdCBhbHNvIHJlcGxhY2UgdGhlIG9mZmVuZGluZyBjaGFyYWN0ZXJzIHdpdGggc2FmZSBlc2NhcGVcbiAgICAvLyBzZXF1ZW5jZXMuXG5cbiAgICByeF9lc2NhcGFibGUubGFzdEluZGV4ID0gMDtcbiAgICByZXR1cm4gcnhfZXNjYXBhYmxlLnRlc3Qoc3RyaW5nKVxuICAgICAgPyBcIlxcXCJcIiArIHN0cmluZy5yZXBsYWNlKHJ4X2VzY2FwYWJsZSwgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgdmFyIGMgPSBtZXRhW2FdO1xuICAgICAgICByZXR1cm4gdHlwZW9mIGMgPT09IFwic3RyaW5nXCJcbiAgICAgICAgICA/IGNcbiAgICAgICAgICA6IFwiXFxcXHVcIiArIChcIjAwMDBcIiArIGEuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC00KTtcbiAgICAgIH0pICsgXCJcXFwiXCJcbiAgICA6IFwiXFxcIlwiICsgc3RyaW5nICsgXCJcXFwiXCI7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIHN0cihrZXksIGhvbGRlcikge1xuXG4gICAgLy8gUHJvZHVjZSBhIHN0cmluZyBmcm9tIGhvbGRlcltrZXldLlxuXG4gICAgdmFyIGk7ICAgICAgICAgIC8vIFRoZSBsb29wIGNvdW50ZXIuXG4gICAgdmFyIGs7ICAgICAgICAgIC8vIFRoZSBtZW1iZXIga2V5LlxuICAgIHZhciB2OyAgICAgICAgICAvLyBUaGUgbWVtYmVyIHZhbHVlLlxuICAgIHZhciBsZW5ndGg7XG4gICAgdmFyIG1pbmQgPSBnYXA7XG4gICAgdmFyIHBhcnRpYWw7XG4gICAgdmFyIHZhbHVlID0gaG9sZGVyW2tleV07XG5cbiAgICAvLyBJZiB0aGUgdmFsdWUgaGFzIGEgdG9KU09OIG1ldGhvZCwgY2FsbCBpdCB0byBvYnRhaW4gYSByZXBsYWNlbWVudCB2YWx1ZS5cblxuICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgdHlwZW9mIHZhbHVlLnRvSlNPTiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlLnRvSlNPTihrZXkpO1xuICAgIH1cblxuICAgIC8vIElmIHdlIHdlcmUgY2FsbGVkIHdpdGggYSByZXBsYWNlciBmdW5jdGlvbiwgdGhlbiBjYWxsIHRoZSByZXBsYWNlciB0b1xuICAgIC8vIG9idGFpbiBhIHJlcGxhY2VtZW50IHZhbHVlLlxuXG4gICAgaWYgKHR5cGVvZiByZXAgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdmFsdWUgPSByZXAuY2FsbChob2xkZXIsIGtleSwgdmFsdWUpO1xuICAgIH1cblxuICAgIC8vIFdoYXQgaGFwcGVucyBuZXh0IGRlcGVuZHMgb24gdGhlIHZhbHVlJ3MgdHlwZS5cblxuICAgIHN3aXRjaCAodHlwZW9mIHZhbHVlKSB7XG4gICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgIHJldHVybiBxdW90ZSh2YWx1ZSk7XG5cbiAgICAgIGNhc2UgXCJudW1iZXJcIjpcblxuICAgICAgICAvLyBKU09OIG51bWJlcnMgbXVzdCBiZSBmaW5pdGUuIEVuY29kZSBub24tZmluaXRlIG51bWJlcnMgYXMgbnVsbC5cblxuICAgICAgICByZXR1cm4gaXNGaW5pdGUodmFsdWUpXG4gICAgICAgICAgPyBTdHJpbmcodmFsdWUpXG4gICAgICAgICAgOiBcIm51bGxcIjtcblxuICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgIGNhc2UgXCJudWxsXCI6XG5cbiAgICAgICAgLy8gSWYgdGhlIHZhbHVlIGlzIGEgYm9vbGVhbiBvciBudWxsLCBjb252ZXJ0IGl0IHRvIGEgc3RyaW5nLiBOb3RlOlxuICAgICAgICAvLyB0eXBlb2YgbnVsbCBkb2VzIG5vdCBwcm9kdWNlIFwibnVsbFwiLiBUaGUgY2FzZSBpcyBpbmNsdWRlZCBoZXJlIGluXG4gICAgICAgIC8vIHRoZSByZW1vdGUgY2hhbmNlIHRoYXQgdGhpcyBnZXRzIGZpeGVkIHNvbWVkYXkuXG5cbiAgICAgICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG5cbiAgICAgICAgLy8gSWYgdGhlIHR5cGUgaXMgXCJvYmplY3RcIiwgd2UgbWlnaHQgYmUgZGVhbGluZyB3aXRoIGFuIG9iamVjdCBvciBhbiBhcnJheSBvclxuICAgICAgICAvLyBudWxsLlxuXG4gICAgICBjYXNlIFwib2JqZWN0XCI6XG5cbiAgICAgICAgLy8gRHVlIHRvIGEgc3BlY2lmaWNhdGlvbiBibHVuZGVyIGluIEVDTUFTY3JpcHQsIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsXG4gICAgICAgIC8vIHNvIHdhdGNoIG91dCBmb3IgdGhhdCBjYXNlLlxuXG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gXCJudWxsXCI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWtlIGFuIGFycmF5IHRvIGhvbGQgdGhlIHBhcnRpYWwgcmVzdWx0cyBvZiBzdHJpbmdpZnlpbmcgdGhpcyBvYmplY3QgdmFsdWUuXG5cbiAgICAgICAgZ2FwICs9IGluZGVudDtcbiAgICAgICAgcGFydGlhbCA9IFtdO1xuXG4gICAgICAgIC8vIElzIHRoZSB2YWx1ZSBhbiBhcnJheT9cblxuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5hcHBseSh2YWx1ZSkgPT09IFwiW29iamVjdCBBcnJheV1cIikge1xuXG4gICAgICAgICAgLy8gVGhlIHZhbHVlIGlzIGFuIGFycmF5LiBTdHJpbmdpZnkgZXZlcnkgZWxlbWVudC4gVXNlIG51bGwgYXMgYSBwbGFjZWhvbGRlclxuICAgICAgICAgIC8vIGZvciBub24tSlNPTiB2YWx1ZXMuXG5cbiAgICAgICAgICBsZW5ndGggPSB2YWx1ZS5sZW5ndGg7XG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBwYXJ0aWFsW2ldID0gc3RyKGksIHZhbHVlKSB8fCBcIm51bGxcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBKb2luIGFsbCBvZiB0aGUgZWxlbWVudHMgdG9nZXRoZXIsIHNlcGFyYXRlZCB3aXRoIGNvbW1hcywgYW5kIHdyYXAgdGhlbSBpblxuICAgICAgICAgIC8vIGJyYWNrZXRzLlxuXG4gICAgICAgICAgdiA9IHBhcnRpYWwubGVuZ3RoID09PSAwXG4gICAgICAgICAgICA/IFwiW11cIlxuICAgICAgICAgICAgOiBnYXBcbiAgICAgICAgICAgID8gXCJbXFxuXCIgKyBnYXAgKyBwYXJ0aWFsLmpvaW4oXCIsXFxuXCIgKyBnYXApICsgXCJcXG5cIiArIG1pbmQgKyBcIl1cIlxuICAgICAgICAgICAgOiBcIltcIiArIHBhcnRpYWwuam9pbihcIixcIikgKyBcIl1cIjtcbiAgICAgICAgICBnYXAgPSBtaW5kO1xuICAgICAgICAgIHJldHVybiB2O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlIHJlcGxhY2VyIGlzIGFuIGFycmF5LCB1c2UgaXQgdG8gc2VsZWN0IHRoZSBtZW1iZXJzIHRvIGJlIHN0cmluZ2lmaWVkLlxuXG4gICAgICAgIGlmIChyZXAgJiYgdHlwZW9mIHJlcCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgIGxlbmd0aCA9IHJlcC5sZW5ndGg7XG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlcFtpXSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICBrID0gcmVwW2ldO1xuICAgICAgICAgICAgICB2ID0gc3RyKGssIHZhbHVlKTtcbiAgICAgICAgICAgICAgaWYgKHYpIHtcbiAgICAgICAgICAgICAgICBwYXJ0aWFsLnB1c2gocXVvdGUoaykgKyAoXG4gICAgICAgICAgICAgICAgICAgICAgZ2FwXG4gICAgICAgICAgICAgICAgICAgICAgPyBcIjogXCJcbiAgICAgICAgICAgICAgICAgICAgICA6IFwiOlwiXG4gICAgICAgICAgICAgICAgICAgICAgKSArIHYpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgLy8gT3RoZXJ3aXNlLCBpdGVyYXRlIHRocm91Z2ggYWxsIG9mIHRoZSBrZXlzIGluIHRoZSBvYmplY3QuXG5cbiAgICAgICAgICBmb3IgKGsgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGspKSB7XG4gICAgICAgICAgICAgIHYgPSBzdHIoaywgdmFsdWUpO1xuICAgICAgICAgICAgICBpZiAodikge1xuICAgICAgICAgICAgICAgIHBhcnRpYWwucHVzaChxdW90ZShrKSArIChcbiAgICAgICAgICAgICAgICAgICAgICBnYXBcbiAgICAgICAgICAgICAgICAgICAgICA/IFwiOiBcIlxuICAgICAgICAgICAgICAgICAgICAgIDogXCI6XCJcbiAgICAgICAgICAgICAgICAgICAgICApICsgdik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBKb2luIGFsbCBvZiB0aGUgbWVtYmVyIHRleHRzIHRvZ2V0aGVyLCBzZXBhcmF0ZWQgd2l0aCBjb21tYXMsXG4gICAgICAgIC8vIGFuZCB3cmFwIHRoZW0gaW4gYnJhY2VzLlxuXG4gICAgICAgIHYgPSBwYXJ0aWFsLmxlbmd0aCA9PT0gMFxuICAgICAgICAgID8gXCJ7fVwiXG4gICAgICAgICAgOiBnYXBcbiAgICAgICAgICA/IFwie1xcblwiICsgZ2FwICsgcGFydGlhbC5qb2luKFwiLFxcblwiICsgZ2FwKSArIFwiXFxuXCIgKyBtaW5kICsgXCJ9XCJcbiAgICAgICAgICA6IFwie1wiICsgcGFydGlhbC5qb2luKFwiLFwiKSArIFwifVwiO1xuICAgICAgICBnYXAgPSBtaW5kO1xuICAgICAgICByZXR1cm4gdjtcbiAgICB9XG4gIH1cblxuICAvLyBJZiB0aGUgSlNPTiBvYmplY3QgZG9lcyBub3QgeWV0IGhhdmUgYSBzdHJpbmdpZnkgbWV0aG9kLCBnaXZlIGl0IG9uZS5cblxuICBpZiAodHlwZW9mIEpTT04uc3RyaW5naWZ5ICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBtZXRhID0geyAgICAvLyB0YWJsZSBvZiBjaGFyYWN0ZXIgc3Vic3RpdHV0aW9uc1xuICAgICAgXCJcXGJcIjogXCJcXFxcYlwiLFxuICAgICAgXCJcXHRcIjogXCJcXFxcdFwiLFxuICAgICAgXCJcXG5cIjogXCJcXFxcblwiLFxuICAgICAgXCJcXGZcIjogXCJcXFxcZlwiLFxuICAgICAgXCJcXHJcIjogXCJcXFxcclwiLFxuICAgICAgXCJcXFwiXCI6IFwiXFxcXFxcXCJcIixcbiAgICAgIFwiXFxcXFwiOiBcIlxcXFxcXFxcXCJcbiAgICB9O1xuICAgIEpTT04uc3RyaW5naWZ5ID0gZnVuY3Rpb24gKHZhbHVlLCByZXBsYWNlciwgc3BhY2UpIHtcblxuICAgICAgLy8gVGhlIHN0cmluZ2lmeSBtZXRob2QgdGFrZXMgYSB2YWx1ZSBhbmQgYW4gb3B0aW9uYWwgcmVwbGFjZXIsIGFuZCBhbiBvcHRpb25hbFxuICAgICAgLy8gc3BhY2UgcGFyYW1ldGVyLCBhbmQgcmV0dXJucyBhIEpTT04gdGV4dC4gVGhlIHJlcGxhY2VyIGNhbiBiZSBhIGZ1bmN0aW9uXG4gICAgICAvLyB0aGF0IGNhbiByZXBsYWNlIHZhbHVlcywgb3IgYW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0IHdpbGwgc2VsZWN0IHRoZSBrZXlzLlxuICAgICAgLy8gQSBkZWZhdWx0IHJlcGxhY2VyIG1ldGhvZCBjYW4gYmUgcHJvdmlkZWQuIFVzZSBvZiB0aGUgc3BhY2UgcGFyYW1ldGVyIGNhblxuICAgICAgLy8gcHJvZHVjZSB0ZXh0IHRoYXQgaXMgbW9yZSBlYXNpbHkgcmVhZGFibGUuXG5cbiAgICAgIHZhciBpO1xuICAgICAgZ2FwID0gXCJcIjtcbiAgICAgIGluZGVudCA9IFwiXCI7XG5cbiAgICAgIC8vIElmIHRoZSBzcGFjZSBwYXJhbWV0ZXIgaXMgYSBudW1iZXIsIG1ha2UgYW4gaW5kZW50IHN0cmluZyBjb250YWluaW5nIHRoYXRcbiAgICAgIC8vIG1hbnkgc3BhY2VzLlxuXG4gICAgICBpZiAodHlwZW9mIHNwYWNlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBzcGFjZTsgaSArPSAxKSB7XG4gICAgICAgICAgaW5kZW50ICs9IFwiIFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlIHNwYWNlIHBhcmFtZXRlciBpcyBhIHN0cmluZywgaXQgd2lsbCBiZSB1c2VkIGFzIHRoZSBpbmRlbnQgc3RyaW5nLlxuXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzcGFjZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBpbmRlbnQgPSBzcGFjZTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgdGhlcmUgaXMgYSByZXBsYWNlciwgaXQgbXVzdCBiZSBhIGZ1bmN0aW9uIG9yIGFuIGFycmF5LlxuICAgICAgLy8gT3RoZXJ3aXNlLCB0aHJvdyBhbiBlcnJvci5cblxuICAgICAgcmVwID0gcmVwbGFjZXI7XG4gICAgICBpZiAocmVwbGFjZXIgJiYgdHlwZW9mIHJlcGxhY2VyICE9PSBcImZ1bmN0aW9uXCIgJiZcbiAgICAgICAgICAodHlwZW9mIHJlcGxhY2VyICE9PSBcIm9iamVjdFwiIHx8XG4gICAgICAgICAgIHR5cGVvZiByZXBsYWNlci5sZW5ndGggIT09IFwibnVtYmVyXCIpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkpTT04uc3RyaW5naWZ5XCIpO1xuICAgICAgfVxuXG4gICAgICAvLyBNYWtlIGEgZmFrZSByb290IG9iamVjdCBjb250YWluaW5nIG91ciB2YWx1ZSB1bmRlciB0aGUga2V5IG9mIFwiXCIuXG4gICAgICAvLyBSZXR1cm4gdGhlIHJlc3VsdCBvZiBzdHJpbmdpZnlpbmcgdGhlIHZhbHVlLlxuXG4gICAgICByZXR1cm4gc3RyKFwiXCIsIHtcIlwiOiB2YWx1ZX0pO1xuICAgIH07XG4gIH1cblxuXG4gIC8vIElmIHRoZSBKU09OIG9iamVjdCBkb2VzIG5vdCB5ZXQgaGF2ZSBhIHBhcnNlIG1ldGhvZCwgZ2l2ZSBpdCBvbmUuXG5cbiAgaWYgKHR5cGVvZiBKU09OLnBhcnNlICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBKU09OLnBhcnNlID0gKGZ1bmN0aW9uICgpIHtcblxuICAgICAgLy8gVGhpcyBmdW5jdGlvbiBjcmVhdGVzIGEgSlNPTiBwYXJzZSBmdW5jdGlvbiB0aGF0IHVzZXMgYSBzdGF0ZSBtYWNoaW5lIHJhdGhlclxuICAgICAgLy8gdGhhbiB0aGUgZGFuZ2Vyb3VzIGV2YWwgZnVuY3Rpb24gdG8gcGFyc2UgYSBKU09OIHRleHQuXG5cbiAgICAgIHZhciBzdGF0ZTsgICAgICAvLyBUaGUgc3RhdGUgb2YgdGhlIHBhcnNlciwgb25lIG9mXG4gICAgICAvLyAnZ28nICAgICAgICAgVGhlIHN0YXJ0aW5nIHN0YXRlXG4gICAgICAvLyAnb2snICAgICAgICAgVGhlIGZpbmFsLCBhY2NlcHRpbmcgc3RhdGVcbiAgICAgIC8vICdmaXJzdG9rZXknICBSZWFkeSBmb3IgdGhlIGZpcnN0IGtleSBvZiB0aGUgb2JqZWN0IG9yXG4gICAgICAvLyAgICAgICAgICAgICAgdGhlIGNsb3Npbmcgb2YgYW4gZW1wdHkgb2JqZWN0XG4gICAgICAvLyAnb2tleScgICAgICAgUmVhZHkgZm9yIHRoZSBuZXh0IGtleSBvZiB0aGUgb2JqZWN0XG4gICAgICAvLyAnY29sb24nICAgICAgUmVhZHkgZm9yIHRoZSBjb2xvblxuICAgICAgLy8gJ292YWx1ZScgICAgIFJlYWR5IGZvciB0aGUgdmFsdWUgaGFsZiBvZiBhIGtleS92YWx1ZSBwYWlyXG4gICAgICAvLyAnb2NvbW1hJyAgICAgUmVhZHkgZm9yIGEgY29tbWEgb3IgY2xvc2luZyB9XG4gICAgICAvLyAnZmlyc3RhdmFsdWUnIFJlYWR5IGZvciB0aGUgZmlyc3QgdmFsdWUgb2YgYW4gYXJyYXkgb3JcbiAgICAgIC8vICAgICAgICAgICAgICBhbiBlbXB0eSBhcnJheVxuICAgICAgLy8gJ2F2YWx1ZScgICAgIFJlYWR5IGZvciB0aGUgbmV4dCB2YWx1ZSBvZiBhbiBhcnJheVxuICAgICAgLy8gJ2Fjb21tYScgICAgIFJlYWR5IGZvciBhIGNvbW1hIG9yIGNsb3NpbmcgXVxuICAgICAgdmFyIHN0YWNrOyAgICAgIC8vIFRoZSBzdGFjaywgZm9yIGNvbnRyb2xsaW5nIG5lc3RpbmcuXG4gICAgICB2YXIgY29udGFpbmVyOyAgLy8gVGhlIGN1cnJlbnQgY29udGFpbmVyIG9iamVjdCBvciBhcnJheVxuICAgICAgdmFyIGtleTsgICAgICAgIC8vIFRoZSBjdXJyZW50IGtleVxuICAgICAgdmFyIHZhbHVlOyAgICAgIC8vIFRoZSBjdXJyZW50IHZhbHVlXG4gICAgICB2YXIgZXNjYXBlcyA9IHsgLy8gRXNjYXBlbWVudCB0cmFuc2xhdGlvbiB0YWJsZVxuICAgICAgICBcIlxcXFxcIjogXCJcXFxcXCIsXG4gICAgICAgIFwiXFxcIlwiOiBcIlxcXCJcIixcbiAgICAgICAgXCIvXCI6IFwiL1wiLFxuICAgICAgICBcInRcIjogXCJcXHRcIixcbiAgICAgICAgXCJuXCI6IFwiXFxuXCIsXG4gICAgICAgIFwiclwiOiBcIlxcclwiLFxuICAgICAgICBcImZcIjogXCJcXGZcIixcbiAgICAgICAgXCJiXCI6IFwiXFxiXCJcbiAgICAgIH07XG4gICAgICB2YXIgc3RyaW5nID0geyAgIC8vIFRoZSBhY3Rpb25zIGZvciBzdHJpbmcgdG9rZW5zXG4gICAgICAgIGdvOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc3RhdGUgPSBcIm9rXCI7XG4gICAgICAgIH0sXG4gICAgICAgIGZpcnN0b2tleTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGtleSA9IHZhbHVlO1xuICAgICAgICAgIHN0YXRlID0gXCJjb2xvblwiO1xuICAgICAgICB9LFxuICAgICAgICBva2V5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAga2V5ID0gdmFsdWU7XG4gICAgICAgICAgc3RhdGUgPSBcImNvbG9uXCI7XG4gICAgICAgIH0sXG4gICAgICAgIG92YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHN0YXRlID0gXCJvY29tbWFcIjtcbiAgICAgICAgfSxcbiAgICAgICAgZmlyc3RhdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzdGF0ZSA9IFwiYWNvbW1hXCI7XG4gICAgICAgIH0sXG4gICAgICAgIGF2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHN0YXRlID0gXCJhY29tbWFcIjtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHZhciBudW1iZXIgPSB7ICAgLy8gVGhlIGFjdGlvbnMgZm9yIG51bWJlciB0b2tlbnNcbiAgICAgICAgZ286IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzdGF0ZSA9IFwib2tcIjtcbiAgICAgICAgfSxcbiAgICAgICAgb3ZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc3RhdGUgPSBcIm9jb21tYVwiO1xuICAgICAgICB9LFxuICAgICAgICBmaXJzdGF2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHN0YXRlID0gXCJhY29tbWFcIjtcbiAgICAgICAgfSxcbiAgICAgICAgYXZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc3RhdGUgPSBcImFjb21tYVwiO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgdmFyIGFjdGlvbiA9IHtcblxuICAgICAgICAvLyBUaGUgYWN0aW9uIHRhYmxlIGRlc2NyaWJlcyB0aGUgYmVoYXZpb3Igb2YgdGhlIG1hY2hpbmUuIEl0IGNvbnRhaW5zIGFuXG4gICAgICAgIC8vIG9iamVjdCBmb3IgZWFjaCB0b2tlbi4gRWFjaCBvYmplY3QgY29udGFpbnMgYSBtZXRob2QgdGhhdCBpcyBjYWxsZWQgd2hlblxuICAgICAgICAvLyBhIHRva2VuIGlzIG1hdGNoZWQgaW4gYSBzdGF0ZS4gQW4gb2JqZWN0IHdpbGwgbGFjayBhIG1ldGhvZCBmb3IgaWxsZWdhbFxuICAgICAgICAvLyBzdGF0ZXMuXG5cbiAgICAgICAgXCJ7XCI6IHtcbiAgICAgICAgICBnbzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc3RhY2sucHVzaCh7c3RhdGU6IFwib2tcIn0pO1xuICAgICAgICAgICAgY29udGFpbmVyID0ge307XG4gICAgICAgICAgICBzdGF0ZSA9IFwiZmlyc3Rva2V5XCI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBvdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHN0YWNrLnB1c2goe2NvbnRhaW5lcjogY29udGFpbmVyLCBzdGF0ZTogXCJvY29tbWFcIiwga2V5OiBrZXl9KTtcbiAgICAgICAgICAgIGNvbnRhaW5lciA9IHt9O1xuICAgICAgICAgICAgc3RhdGUgPSBcImZpcnN0b2tleVwiO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZmlyc3RhdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHN0YWNrLnB1c2goe2NvbnRhaW5lcjogY29udGFpbmVyLCBzdGF0ZTogXCJhY29tbWFcIn0pO1xuICAgICAgICAgICAgY29udGFpbmVyID0ge307XG4gICAgICAgICAgICBzdGF0ZSA9IFwiZmlyc3Rva2V5XCI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHN0YWNrLnB1c2goe2NvbnRhaW5lcjogY29udGFpbmVyLCBzdGF0ZTogXCJhY29tbWFcIn0pO1xuICAgICAgICAgICAgY29udGFpbmVyID0ge307XG4gICAgICAgICAgICBzdGF0ZSA9IFwiZmlyc3Rva2V5XCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIn1cIjoge1xuICAgICAgICAgIGZpcnN0b2tleTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHBvcCA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgdmFsdWUgPSBjb250YWluZXI7XG4gICAgICAgICAgICBjb250YWluZXIgPSBwb3AuY29udGFpbmVyO1xuICAgICAgICAgICAga2V5ID0gcG9wLmtleTtcbiAgICAgICAgICAgIHN0YXRlID0gcG9wLnN0YXRlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgb2NvbW1hOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcG9wID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICBjb250YWluZXJba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgdmFsdWUgPSBjb250YWluZXI7XG4gICAgICAgICAgICBjb250YWluZXIgPSBwb3AuY29udGFpbmVyO1xuICAgICAgICAgICAga2V5ID0gcG9wLmtleTtcbiAgICAgICAgICAgIHN0YXRlID0gcG9wLnN0YXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJbXCI6IHtcbiAgICAgICAgICBnbzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc3RhY2sucHVzaCh7c3RhdGU6IFwib2tcIn0pO1xuICAgICAgICAgICAgY29udGFpbmVyID0gW107XG4gICAgICAgICAgICBzdGF0ZSA9IFwiZmlyc3RhdmFsdWVcIjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG92YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc3RhY2sucHVzaCh7Y29udGFpbmVyOiBjb250YWluZXIsIHN0YXRlOiBcIm9jb21tYVwiLCBrZXk6IGtleX0pO1xuICAgICAgICAgICAgY29udGFpbmVyID0gW107XG4gICAgICAgICAgICBzdGF0ZSA9IFwiZmlyc3RhdmFsdWVcIjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZpcnN0YXZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzdGFjay5wdXNoKHtjb250YWluZXI6IGNvbnRhaW5lciwgc3RhdGU6IFwiYWNvbW1hXCJ9KTtcbiAgICAgICAgICAgIGNvbnRhaW5lciA9IFtdO1xuICAgICAgICAgICAgc3RhdGUgPSBcImZpcnN0YXZhbHVlXCI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHN0YWNrLnB1c2goe2NvbnRhaW5lcjogY29udGFpbmVyLCBzdGF0ZTogXCJhY29tbWFcIn0pO1xuICAgICAgICAgICAgY29udGFpbmVyID0gW107XG4gICAgICAgICAgICBzdGF0ZSA9IFwiZmlyc3RhdmFsdWVcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiXVwiOiB7XG4gICAgICAgICAgZmlyc3RhdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwb3AgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgIHZhbHVlID0gY29udGFpbmVyO1xuICAgICAgICAgICAgY29udGFpbmVyID0gcG9wLmNvbnRhaW5lcjtcbiAgICAgICAgICAgIGtleSA9IHBvcC5rZXk7XG4gICAgICAgICAgICBzdGF0ZSA9IHBvcC5zdGF0ZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFjb21tYTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHBvcCA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgY29udGFpbmVyLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgdmFsdWUgPSBjb250YWluZXI7XG4gICAgICAgICAgICBjb250YWluZXIgPSBwb3AuY29udGFpbmVyO1xuICAgICAgICAgICAga2V5ID0gcG9wLmtleTtcbiAgICAgICAgICAgIHN0YXRlID0gcG9wLnN0YXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCI6XCI6IHtcbiAgICAgICAgICBjb2xvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbnRhaW5lciwga2V5KSkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJEdXBsaWNhdGUga2V5ICdcIiArIGtleSArIFwiXFxcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXRlID0gXCJvdmFsdWVcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiLFwiOiB7XG4gICAgICAgICAgb2NvbW1hOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb250YWluZXJba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgc3RhdGUgPSBcIm9rZXlcIjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFjb21tYTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29udGFpbmVyLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgc3RhdGUgPSBcImF2YWx1ZVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ0cnVlXCI6IHtcbiAgICAgICAgICBnbzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgc3RhdGUgPSBcIm9rXCI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBvdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIHN0YXRlID0gXCJvY29tbWFcIjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZpcnN0YXZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICBzdGF0ZSA9IFwiYWNvbW1hXCI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIHN0YXRlID0gXCJhY29tbWFcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZmFsc2VcIjoge1xuICAgICAgICAgIGdvOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgc3RhdGUgPSBcIm9rXCI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBvdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICBzdGF0ZSA9IFwib2NvbW1hXCI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmaXJzdGF2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgIHN0YXRlID0gXCJhY29tbWFcIjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGF2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgIHN0YXRlID0gXCJhY29tbWFcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwibnVsbFwiOiB7XG4gICAgICAgICAgZ286IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgIHN0YXRlID0gXCJva1wiO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgb3ZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICBzdGF0ZSA9IFwib2NvbW1hXCI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmaXJzdGF2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgc3RhdGUgPSBcImFjb21tYVwiO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYXZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICBzdGF0ZSA9IFwiYWNvbW1hXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBmdW5jdGlvbiBkZWJhY2tzbGFzaGlmeSh0ZXh0KSB7XG5cbiAgICAgICAgLy8gUmVtb3ZlIGFuZCByZXBsYWNlIGFueSBiYWNrc2xhc2ggZXNjYXBlbWVudC5cblxuICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXFxcKD86dSguezR9KXwoW151XSkpL2csIGZ1bmN0aW9uIChpZ25vcmUsIGIsIGMpIHtcbiAgICAgICAgICByZXR1cm4gYlxuICAgICAgICAgICAgPyBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KGIsIDE2KSlcbiAgICAgICAgICAgIDogZXNjYXBlc1tjXTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbiAoc291cmNlLCByZXZpdmVyKSB7XG5cbiAgICAgICAgLy8gQSByZWd1bGFyIGV4cHJlc3Npb24gaXMgdXNlZCB0byBleHRyYWN0IHRva2VucyBmcm9tIHRoZSBKU09OIHRleHQuXG4gICAgICAgIC8vIFRoZSBleHRyYWN0aW9uIHByb2Nlc3MgaXMgY2F1dGlvdXMuXG5cbiAgICAgICAgdmFyIHJlc3VsdDtcbiAgICAgICAgdmFyIHR4ID0gL15bXFx1MDAyMFxcdFxcblxccl0qKD86KFssOlxcW1xcXXt9XXx0cnVlfGZhbHNlfG51bGwpfCgtP1xcZCsoPzpcXC5cXGQqKT8oPzpbZUVdWytcXC1dP1xcZCspPyl8XCIoKD86W15cXHJcXG5cXHRcXFxcXFxcIl18XFxcXCg/OltcIlxcXFxcXC90cm5mYl18dVswLTlhLWZBLUZdezR9KSkqKVwiKS87XG5cbiAgICAgICAgLy8gU2V0IHRoZSBzdGFydGluZyBzdGF0ZS5cblxuICAgICAgICBzdGF0ZSA9IFwiZ29cIjtcblxuICAgICAgICAvLyBUaGUgc3RhY2sgcmVjb3JkcyB0aGUgY29udGFpbmVyLCBrZXksIGFuZCBzdGF0ZSBmb3IgZWFjaCBvYmplY3Qgb3IgYXJyYXlcbiAgICAgICAgLy8gdGhhdCBjb250YWlucyBhbm90aGVyIG9iamVjdCBvciBhcnJheSB3aGlsZSBwcm9jZXNzaW5nIG5lc3RlZCBzdHJ1Y3R1cmVzLlxuXG4gICAgICAgIHN0YWNrID0gW107XG5cbiAgICAgICAgLy8gSWYgYW55IGVycm9yIG9jY3Vycywgd2Ugd2lsbCBjYXRjaCBpdCBhbmQgdWx0aW1hdGVseSB0aHJvdyBhIHN5bnRheCBlcnJvci5cblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgLy8gRm9yIGVhY2ggdG9rZW4uLi5cblxuICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB0eC5leGVjKHNvdXJjZSk7XG4gICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcmVzdWx0IGlzIHRoZSByZXN1bHQgYXJyYXkgZnJvbSBtYXRjaGluZyB0aGUgdG9rZW5pemluZyByZWd1bGFyIGV4cHJlc3Npb24uXG4gICAgICAgICAgICAvLyAgcmVzdWx0WzBdIGNvbnRhaW5zIGV2ZXJ5dGhpbmcgdGhhdCBtYXRjaGVkLCBpbmNsdWRpbmcgYW55IGluaXRpYWwgd2hpdGVzcGFjZS5cbiAgICAgICAgICAgIC8vICByZXN1bHRbMV0gY29udGFpbnMgYW55IHB1bmN0dWF0aW9uIHRoYXQgd2FzIG1hdGNoZWQsIG9yIHRydWUsIGZhbHNlLCBvciBudWxsLlxuICAgICAgICAgICAgLy8gIHJlc3VsdFsyXSBjb250YWlucyBhIG1hdGNoZWQgbnVtYmVyLCBzdGlsbCBpbiBzdHJpbmcgZm9ybS5cbiAgICAgICAgICAgIC8vICByZXN1bHRbM10gY29udGFpbnMgYSBtYXRjaGVkIHN0cmluZywgd2l0aG91dCBxdW90ZXMgYnV0IHdpdGggZXNjYXBlbWVudC5cblxuICAgICAgICAgICAgaWYgKHJlc3VsdFsxXSkge1xuXG4gICAgICAgICAgICAgIC8vIFRva2VuOiBFeGVjdXRlIHRoZSBhY3Rpb24gZm9yIHRoaXMgc3RhdGUgYW5kIHRva2VuLlxuXG4gICAgICAgICAgICAgIGFjdGlvbltyZXN1bHRbMV1dW3N0YXRlXSgpO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdFsyXSkge1xuXG4gICAgICAgICAgICAgIC8vIE51bWJlciB0b2tlbjogQ29udmVydCB0aGUgbnVtYmVyIHN0cmluZyBpbnRvIGEgbnVtYmVyIHZhbHVlIGFuZCBleGVjdXRlXG4gICAgICAgICAgICAgIC8vIHRoZSBhY3Rpb24gZm9yIHRoaXMgc3RhdGUgYW5kIG51bWJlci5cblxuICAgICAgICAgICAgICB2YWx1ZSA9ICtyZXN1bHRbMl07XG4gICAgICAgICAgICAgIG51bWJlcltzdGF0ZV0oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgLy8gU3RyaW5nIHRva2VuOiBSZXBsYWNlIHRoZSBlc2NhcGVtZW50IHNlcXVlbmNlcyBhbmQgZXhlY3V0ZSB0aGUgYWN0aW9uIGZvclxuICAgICAgICAgICAgICAvLyB0aGlzIHN0YXRlIGFuZCBzdHJpbmcuXG5cbiAgICAgICAgICAgICAgdmFsdWUgPSBkZWJhY2tzbGFzaGlmeShyZXN1bHRbM10pO1xuICAgICAgICAgICAgICBzdHJpbmdbc3RhdGVdKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgdG9rZW4gZnJvbSB0aGUgc3RyaW5nLiBUaGUgbG9vcCB3aWxsIGNvbnRpbnVlIGFzIGxvbmcgYXMgdGhlcmVcbiAgICAgICAgICAgIC8vIGFyZSB0b2tlbnMuIFRoaXMgaXMgYSBzbG93IHByb2Nlc3MsIGJ1dCBpdCBhbGxvd3MgdGhlIHVzZSBvZiBeIG1hdGNoaW5nLFxuICAgICAgICAgICAgLy8gd2hpY2ggYXNzdXJlcyB0aGF0IG5vIGlsbGVnYWwgdG9rZW5zIHNsaXAgdGhyb3VnaC5cblxuICAgICAgICAgICAgc291cmNlID0gc291cmNlLnNsaWNlKHJlc3VsdFswXS5sZW5ndGgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIElmIHdlIGZpbmQgYSBzdGF0ZS90b2tlbiBjb21iaW5hdGlvbiB0aGF0IGlzIGlsbGVnYWwsIHRoZW4gdGhlIGFjdGlvbiB3aWxsXG4gICAgICAgICAgLy8gY2F1c2UgYW4gZXJyb3IuIFdlIGhhbmRsZSB0aGUgZXJyb3IgYnkgc2ltcGx5IGNoYW5naW5nIHRoZSBzdGF0ZS5cblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgc3RhdGUgPSBlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIHBhcnNpbmcgaXMgZmluaXNoZWQuIElmIHdlIGFyZSBub3QgaW4gdGhlIGZpbmFsIFwib2tcIiBzdGF0ZSwgb3IgaWYgdGhlXG4gICAgICAgIC8vIHJlbWFpbmluZyBzb3VyY2UgY29udGFpbnMgYW55dGhpbmcgZXhjZXB0IHdoaXRlc3BhY2UsIHRoZW4gd2UgZGlkIG5vdCBoYXZlXG4gICAgICAgIC8vYSB3ZWxsLWZvcm1lZCBKU09OIHRleHQuXG5cbiAgICAgICAgaWYgKHN0YXRlICE9PSBcIm9rXCIgfHwgKC9bXlxcdTAwMjBcXHRcXG5cXHJdLy50ZXN0KHNvdXJjZSkpKSB7XG4gICAgICAgICAgdGhyb3cgKHN0YXRlIGluc3RhbmNlb2YgU3ludGF4RXJyb3IpXG4gICAgICAgICAgICA/IHN0YXRlXG4gICAgICAgICAgICA6IG5ldyBTeW50YXhFcnJvcihcIkpTT05cIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGVyZSBpcyBhIHJldml2ZXIgZnVuY3Rpb24sIHdlIHJlY3Vyc2l2ZWx5IHdhbGsgdGhlIG5ldyBzdHJ1Y3R1cmUsXG4gICAgICAgIC8vIHBhc3NpbmcgZWFjaCBuYW1lL3ZhbHVlIHBhaXIgdG8gdGhlIHJldml2ZXIgZnVuY3Rpb24gZm9yIHBvc3NpYmxlXG4gICAgICAgIC8vIHRyYW5zZm9ybWF0aW9uLCBzdGFydGluZyB3aXRoIGEgdGVtcG9yYXJ5IHJvb3Qgb2JqZWN0IHRoYXQgaG9sZHMgdGhlIGN1cnJlbnRcbiAgICAgICAgLy8gdmFsdWUgaW4gYW4gZW1wdHkga2V5LiBJZiB0aGVyZSBpcyBub3QgYSByZXZpdmVyIGZ1bmN0aW9uLCB3ZSBzaW1wbHkgcmV0dXJuXG4gICAgICAgIC8vIHRoYXQgdmFsdWUuXG5cbiAgICAgICAgcmV0dXJuICh0eXBlb2YgcmV2aXZlciA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgICAgID8gKGZ1bmN0aW9uIHdhbGsoaG9sZGVyLCBrZXkpIHtcbiAgICAgICAgICAgIHZhciBrO1xuICAgICAgICAgICAgdmFyIHY7XG4gICAgICAgICAgICB2YXIgdmFsID0gaG9sZGVyW2tleV07XG4gICAgICAgICAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgZm9yIChrIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWwsIGspKSB7XG4gICAgICAgICAgICAgICAgICB2ID0gd2Fsayh2YWwsIGspO1xuICAgICAgICAgICAgICAgICAgaWYgKHYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB2YWxba10gPSB2O1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHZhbFtrXTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXZpdmVyLmNhbGwoaG9sZGVyLCBrZXksIHZhbCk7XG4gICAgICAgICAgfSh7XCJcIjogdmFsdWV9LCBcIlwiKSlcbiAgICAgICAgOiB2YWx1ZTtcbiAgICAgIH07XG4gICAgfSgpKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldHVwQ3VzdG9tSlNPTjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvKiBnbG9iYWxzIGV4cGVjdCAqL1xuLyogZ2xvYmFscyBkZXNjcmliZSAqL1xuLyogZ2xvYmFscyBpdCAqL1xuLyogZ2xvYmFscyBzaW5vbiAqL1xuXG52YXIgXyA9IHJlcXVpcmUoJy4uL3NyYy91dGlsaXR5Jyk7XG52YXIgdXRpbGl0eSA9IHJlcXVpcmUoJy4uL3NyYy91dGlsaXR5Jyk7XG52YXIgcG9seWZpbGxKU09OID0gcmVxdWlyZSgnLi4vdmVuZG9yL0pTT04tanMvanNvbjMnKTtcblxudXRpbGl0eS5zZXR1cEpTT04oKTtcblxuZGVzY3JpYmUoJ3NldHVwSlNPTicsIGZ1bmN0aW9uICgpIHtcbiAgYmVmb3JlRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgdXRpbGl0eS5Sb2xsYmFySlNPTi5zdHJpbmdpZnkgPSBudWxsO1xuICAgIHV0aWxpdHkuUm9sbGJhckpTT04ucGFyc2UgPSBudWxsO1xuICB9KTtcblxuICBhZnRlckVhY2goZnVuY3Rpb24gKCkge1xuICAgIC8vIFJlc2V0cyB1dGlsaXR5LlJvbGxiYXJKU09OXG4gICAgdXRpbGl0eS5Sb2xsYmFySlNPTi5zdHJpbmdpZnkgPSBudWxsO1xuICAgIHV0aWxpdHkuUm9sbGJhckpTT04ucGFyc2UgPSBudWxsO1xuICAgIHV0aWxpdHkuc2V0dXBKU09OKCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgdXNlIG5hdGl2ZSBpbnRlcmZhY2Ugd2hlbiBwb2x5ZmlsbCBpcyBwcm92aWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbmF0aXZlID0geyBzdHJpbmdpZnk6IEpTT04uc3RyaW5naWZ5LCBwYXJzZTogSlNPTi5wYXJzZSB9O1xuXG4gICAgdXRpbGl0eS5zZXR1cEpTT04ocG9seWZpbGxKU09OKTtcblxuICAgIGV4cGVjdCh1dGlsaXR5LlJvbGxiYXJKU09OLnN0cmluZ2lmeS50b1N0cmluZygpKS50by5lcXVhbChcbiAgICAgIG5hdGl2ZS5zdHJpbmdpZnkudG9TdHJpbmcoKSxcbiAgICApO1xuICAgIGV4cGVjdCh1dGlsaXR5LlJvbGxiYXJKU09OLnBhcnNlLnRvU3RyaW5nKCkpLnRvLmVxdWFsKFxuICAgICAgbmF0aXZlLnBhcnNlLnRvU3RyaW5nKCksXG4gICAgKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB1c2UgbmF0aXZlIGludGVyZmFjZSB3aGVuIHBvbHlmaWxsIGlzIG5vdCBwcm92aWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbmF0aXZlID0geyBzdHJpbmdpZnk6IEpTT04uc3RyaW5naWZ5LCBwYXJzZTogSlNPTi5wYXJzZSB9O1xuXG4gICAgdXRpbGl0eS5zZXR1cEpTT04oKTtcblxuICAgIGV4cGVjdCh1dGlsaXR5LlJvbGxiYXJKU09OLnN0cmluZ2lmeS50b1N0cmluZygpKS50by5lcXVhbChcbiAgICAgIG5hdGl2ZS5zdHJpbmdpZnkudG9TdHJpbmcoKSxcbiAgICApO1xuICAgIGV4cGVjdCh1dGlsaXR5LlJvbGxiYXJKU09OLnBhcnNlLnRvU3RyaW5nKCkpLnRvLmVxdWFsKFxuICAgICAgbmF0aXZlLnBhcnNlLnRvU3RyaW5nKCksXG4gICAgKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXBsYWNlIGN1c3RvbSBpbnRlcmZhY2Ugd2hlbiBwb2x5ZmlsbCBpcyBwcm92aWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbmF0aXZlID0geyBzdHJpbmdpZnk6IEpTT04uc3RyaW5naWZ5LCBwYXJzZTogSlNPTi5wYXJzZSB9O1xuICAgIHZhciBjdXN0b20gPSB7XG4gICAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgIHJldHVybiBqc29uO1xuICAgICAgfSxcbiAgICAgIHBhcnNlOiBmdW5jdGlvbiAoanNvbikge1xuICAgICAgICByZXR1cm4ganNvbjtcbiAgICAgIH0sXG4gICAgfTtcbiAgICB2YXIgcG9seWZpbGwgPSB7fTtcbiAgICBwb2x5ZmlsbEpTT04ocG9seWZpbGwpO1xuXG4gICAgLy8gU2V0IHRvIGN1c3RvbSBpbnRlcmZhY2VcbiAgICBKU09OLnN0cmluZ2lmeSA9IGN1c3RvbS5zdHJpbmdpZnk7XG4gICAgSlNPTi5wYXJzZSA9IGN1c3RvbS5wYXJzZTtcblxuICAgIHV0aWxpdHkuc2V0dXBKU09OKHBvbHlmaWxsSlNPTik7XG5cbiAgICBleHBlY3QodXRpbGl0eS5Sb2xsYmFySlNPTi5zdHJpbmdpZnkudG9TdHJpbmcoKSkudG8uZXF1YWwoXG4gICAgICBwb2x5ZmlsbC5zdHJpbmdpZnkudG9TdHJpbmcoKSxcbiAgICApO1xuICAgIGV4cGVjdCh1dGlsaXR5LlJvbGxiYXJKU09OLnBhcnNlLnRvU3RyaW5nKCkpLnRvLmVxdWFsKFxuICAgICAgcG9seWZpbGwucGFyc2UudG9TdHJpbmcoKSxcbiAgICApO1xuXG4gICAgLy8gcmVzdG9yZSBvcmlnaW5hbCBpbnRlcmZhY2VcbiAgICBKU09OLnN0cmluZ2lmeSA9IG5hdGl2ZS5zdHJpbmdpZnk7XG4gICAgSlNPTi5wYXJzZSA9IG5hdGl2ZS5wYXJzZTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBrZWVwIGN1c3RvbSBpbnRlcmZhY2Ugd2hlbiBwb2x5ZmlsbCBpcyBub3QgcHJvdmlkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5hdGl2ZSA9IHsgc3RyaW5naWZ5OiBKU09OLnN0cmluZ2lmeSwgcGFyc2U6IEpTT04ucGFyc2UgfTtcbiAgICB2YXIgY3VzdG9tID0ge1xuICAgICAgc3RyaW5naWZ5OiBmdW5jdGlvbiAoanNvbikge1xuICAgICAgICByZXR1cm4ganNvbjtcbiAgICAgIH0sXG4gICAgICBwYXJzZTogZnVuY3Rpb24gKGpzb24pIHtcbiAgICAgICAgcmV0dXJuIGpzb247XG4gICAgICB9LFxuICAgIH07XG5cbiAgICAvLyBTZXQgdG8gY3VzdG9tIGludGVyZmFjZVxuICAgIEpTT04uc3RyaW5naWZ5ID0gY3VzdG9tLnN0cmluZ2lmeTtcbiAgICBKU09OLnBhcnNlID0gY3VzdG9tLnBhcnNlO1xuXG4gICAgdXRpbGl0eS5zZXR1cEpTT04oKTtcblxuICAgIGV4cGVjdCh1dGlsaXR5LlJvbGxiYXJKU09OLnN0cmluZ2lmeS50b1N0cmluZygpKS50by5lcXVhbChcbiAgICAgIGN1c3RvbS5zdHJpbmdpZnkudG9TdHJpbmcoKSxcbiAgICApO1xuICAgIGV4cGVjdCh1dGlsaXR5LlJvbGxiYXJKU09OLnBhcnNlLnRvU3RyaW5nKCkpLnRvLmVxdWFsKFxuICAgICAgY3VzdG9tLnBhcnNlLnRvU3RyaW5nKCksXG4gICAgKTtcblxuICAgIC8vIHJlc3RvcmUgb3JpZ2luYWwgaW50ZXJmYWNlXG4gICAgSlNPTi5zdHJpbmdpZnkgPSBuYXRpdmUuc3RyaW5naWZ5O1xuICAgIEpTT04ucGFyc2UgPSBuYXRpdmUucGFyc2U7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCd0eXBlTmFtZScsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICBleHBlY3QoXy50eXBlTmFtZSh1bmRlZmluZWQpKS50by5lcWwoJ3VuZGVmaW5lZCcpO1xuICAgIGRvbmUoKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVsbCcsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgZXhwZWN0KF8udHlwZU5hbWUobnVsbCkpLnRvLmVxbCgnbnVsbCcpO1xuICAgIGRvbmUoKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVtYmVycycsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgZXhwZWN0KF8udHlwZU5hbWUoMSkpLnRvLmVxbCgnbnVtYmVyJyk7XG4gICAgZXhwZWN0KF8udHlwZU5hbWUoLTMyKSkudG8uZXFsKCdudW1iZXInKTtcbiAgICBleHBlY3QoXy50eXBlTmFtZSgxLjQ1MikpLnRvLmVxbCgnbnVtYmVyJyk7XG4gICAgZXhwZWN0KF8udHlwZU5hbWUoMCkpLnRvLmVxbCgnbnVtYmVyJyk7XG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGhhbmRsZSBib29scycsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgZXhwZWN0KF8udHlwZU5hbWUodHJ1ZSkpLnRvLmVxbCgnYm9vbGVhbicpO1xuICAgIGV4cGVjdChfLnR5cGVOYW1lKGZhbHNlKSkudG8uZXFsKCdib29sZWFuJyk7XG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGhhbmRsZSBzdHJpbmdzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICBleHBlY3QoXy50eXBlTmFtZSgnJykpLnRvLmVxbCgnc3RyaW5nJyk7XG4gICAgZXhwZWN0KF8udHlwZU5hbWUoJ2EgbG9uZ2VyIHN0cmluZycpKS50by5lcWwoJ3N0cmluZycpO1xuICAgIGRvbmUoKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBoYW5kbGUgZnVuY3Rpb25zJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICBleHBlY3QoXy50eXBlTmFtZShmdW5jdGlvbiAoKSB7fSkpLnRvLmVxbCgnZnVuY3Rpb24nKTtcbiAgICB2YXIgZiA9IGZ1bmN0aW9uICh4KSB7XG4gICAgICByZXR1cm4geDtcbiAgICB9O1xuICAgIGV4cGVjdChfLnR5cGVOYW1lKGYpKS50by5lcWwoJ2Z1bmN0aW9uJyk7XG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGhhbmRsZSBvYmplY3RzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICBleHBlY3QoXy50eXBlTmFtZSh7fSkpLnRvLmVxbCgnb2JqZWN0Jyk7XG4gICAgZXhwZWN0KF8udHlwZU5hbWUoeyBhOiAxMjMgfSkpLnRvLmVxbCgnb2JqZWN0Jyk7XG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGhhbmRsZSBhcnJheXMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIGV4cGVjdChfLnR5cGVOYW1lKFtdKSkudG8uZXFsKCdhcnJheScpO1xuICAgIGV4cGVjdChfLnR5cGVOYW1lKFsxLCB7IGE6IDQyIH0sIG51bGxdKSkudG8uZXFsKCdhcnJheScpO1xuICAgIGRvbmUoKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2lzVHlwZScsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCBoYW5kbGUgYWxsIHR5cGVzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICBleHBlY3QoXy5pc1R5cGUodW5kZWZpbmVkLCAndW5kZWZpbmVkJykpLnRvLmJlLm9rKCk7XG4gICAgZXhwZWN0KF8uaXNUeXBlKHVuZGVmaW5lZCwgJ251bGwnKSkudG8ubm90LmJlLm9rKCk7XG4gICAgZXhwZWN0KF8uaXNUeXBlKG51bGwsICdudWxsJykpLnRvLmJlLm9rKCk7XG4gICAgZXhwZWN0KF8uaXNUeXBlKG51bGwsICdvYmplY3QnKSkudG8ubm90LmJlLm9rKCk7XG4gICAgZXhwZWN0KF8uaXNUeXBlKHt9LCAnb2JqZWN0JykpLnRvLmJlLm9rKCk7XG4gICAgZXhwZWN0KF8uaXNUeXBlKGZ1bmN0aW9uICgpIHt9LCAnZnVuY3Rpb24nKSkudG8uYmUub2soKTtcbiAgICBleHBlY3QoXy5pc1R5cGUoNDIsICdudW1iZXInKSkudG8uYmUub2soKTtcbiAgICBleHBlY3QoXy5pc1R5cGUoJzQyJywgJ3N0cmluZycpKS50by5iZS5vaygpO1xuICAgIGV4cGVjdChfLmlzVHlwZShbXSwgJ2FycmF5JykpLnRvLmJlLm9rKCk7XG4gICAgZXhwZWN0KF8uaXNUeXBlKFsxMDIsIFtdXSwgJ2FycmF5JykpLnRvLmJlLm9rKCk7XG5cbiAgICBkb25lKCk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdpc0Z1bmN0aW9uJywgZnVuY3Rpb24gKCkge1xuICBpdCgnc2hvdWxkIHdvcmsgZm9yIGFsbCBmdW5jdGlvbnMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBmID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuO1xuICAgIH07XG4gICAgdmFyIGcgPSBmdW5jdGlvbiAoeCkge1xuICAgICAgcmV0dXJuIGYoeCk7XG4gICAgfTtcbiAgICBleHBlY3QoXy5pc0Z1bmN0aW9uKHt9KSkudG8ubm90LmJlLm9rKCk7XG4gICAgZXhwZWN0KF8uaXNGdW5jdGlvbihudWxsKSkudG8ubm90LmJlLm9rKCk7XG4gICAgZXhwZWN0KF8uaXNGdW5jdGlvbihmKSkudG8uYmUub2soKTtcbiAgICBleHBlY3QoXy5pc0Z1bmN0aW9uKGcpKS50by5iZS5vaygpO1xuICAgIGRvbmUoKTtcbiAgfSk7XG59KTtcbmRlc2NyaWJlKCdpc05hdGl2ZUZ1bmN0aW9uJywgZnVuY3Rpb24gKCkge1xuICBpdCgnc2hvdWxkIHdvcmsgZm9yIGFsbCBuYXRpdmUgZnVuY3Rpb25zJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgZiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9O1xuICAgIHZhciBnID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgIHJldHVybiBmKHgpO1xuICAgIH07XG4gICAgdmFyIGggPSBTdHJpbmcucHJvdG90eXBlLnN1YnN0cjtcbiAgICB2YXIgaSA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mO1xuICAgIGV4cGVjdChfLmlzTmF0aXZlRnVuY3Rpb24oe30pKS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QoXy5pc05hdGl2ZUZ1bmN0aW9uKG51bGwpKS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QoXy5pc05hdGl2ZUZ1bmN0aW9uKGYpKS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QoXy5pc05hdGl2ZUZ1bmN0aW9uKGcpKS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QoXy5pc05hdGl2ZUZ1bmN0aW9uKGgpKS50by5iZS5vaygpO1xuICAgIGV4cGVjdChfLmlzTmF0aXZlRnVuY3Rpb24oaSkpLnRvLmJlLm9rKCk7XG4gICAgZG9uZSgpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnaXNJdGVyYWJsZScsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCB3b3JrIGZvciBhbGwgdHlwZXMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIGV4cGVjdChfLmlzSXRlcmFibGUoe30pKS50by5iZS5vaygpO1xuICAgIGV4cGVjdChfLmlzSXRlcmFibGUoW10pKS50by5iZS5vaygpO1xuICAgIGV4cGVjdChfLmlzSXRlcmFibGUoW3sgYTogMSB9XSkpLnRvLmJlLm9rKCk7XG4gICAgZXhwZWN0KF8uaXNJdGVyYWJsZShudWxsKSkudG8ubm90LmJlLm9rKCk7XG4gICAgZXhwZWN0KF8uaXNJdGVyYWJsZSh1bmRlZmluZWQpKS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QoXy5pc0l0ZXJhYmxlKCdvYmplY3QnKSkudG8ubm90LmJlLm9rKCk7XG4gICAgZXhwZWN0KF8uaXNJdGVyYWJsZSg0MikpLnRvLm5vdC5iZS5vaygpO1xuICAgIGRvbmUoKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2lzRXJyb3InLCBmdW5jdGlvbiAoKSB7XG4gIGl0KCdzaG91bGQgaGFuZGxlIG51bGwnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIGV4cGVjdChfLmlzRXJyb3IobnVsbCkpLnRvLm5vdC5iZS5vaygpO1xuICAgIGRvbmUoKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgaGFuZGxlIGVycm9ycycsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIGUgPSBuZXcgRXJyb3IoJ2hlbGxvJyk7XG4gICAgZXhwZWN0KF8uaXNFcnJvcihlKSkudG8uYmUub2soKTtcbiAgICBkb25lKCk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIGhhbmRsZSBzdWJjbGFzc2VzIG9mIGVycm9yJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAvLyBUaGlzIGlzIGEgbW9zdGx5IGJyb3dzZXIgY29tcGxpYW50IHdheSBvZiBkb2luZyB0aGlzXG4gICAgLy8ganVzdCBmb3IgdGhlIHNha2Ugb2YgZG9pbmcgaXQsIGV2ZW4gdGhvdWdoIHdlIG1vc3RseVxuICAgIC8vIG5lZWQgdGhpcyB0byB3b3JrIGluIG5vZGUgZW52aXJvbm1lbnRzXG4gICAgZnVuY3Rpb24gVGVzdEN1c3RvbUVycm9yKG1lc3NhZ2UpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbmFtZScsIHtcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6ICdUZXN0Q3VzdG9tRXJyb3InLFxuICAgICAgfSk7XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbWVzc2FnZScsIHtcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogbWVzc2FnZSxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoRXJyb3IuaGFzT3duUHJvcGVydHkoJ2NhcHR1cmVTdGFja1RyYWNlJykpIHtcbiAgICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgVGVzdEN1c3RvbUVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnc3RhY2snLCB7XG4gICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICAgIHZhbHVlOiBuZXcgRXJyb3IobWVzc2FnZSkuc3RhY2ssXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgT2JqZWN0LnNldFByb3RvdHlwZU9mID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoVGVzdEN1c3RvbUVycm9yLnByb3RvdHlwZSwgRXJyb3IucHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgVGVzdEN1c3RvbUVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlLCB7XG4gICAgICAgIGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBUZXN0Q3VzdG9tRXJyb3IgfSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICB2YXIgZSA9IG5ldyBUZXN0Q3VzdG9tRXJyb3IoJ2JvcmsnKTtcbiAgICBleHBlY3QoXy5pc0Vycm9yKGUpKS50by5iZS5vaygpO1xuICAgIGRvbmUoKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2lzRmluaXRlTnVtYmVyJywgZnVuY3Rpb24gKCkge1xuICBbTmFOLCBudWxsLCB1bmRlZmluZWQsICd4J10uZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpdChgc2hvdWxkIHJldHVybiBmYWxzZSBmb3IgJHt2YWx1ZX1gLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgZXhwZWN0KF8uaXNGaW5pdGVOdW1iZXIodmFsdWUpKS50by5lcXVhbChmYWxzZSk7XG4gICAgICBkb25lKCk7XG4gICAgfSk7XG4gIH0pO1xuICBbLTEwMCwgMCwgMTAwXS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGl0KGBzaG91bGQgcmV0dXJuIHRydWUgZm9yICR7dmFsdWV9YCwgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgIGV4cGVjdChfLmlzRmluaXRlTnVtYmVyKHZhbHVlKSkudG8uZXF1YWwodHJ1ZSk7XG4gICAgICBkb25lKCk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdtZXJnZScsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCB3b3JrIGZvciBzaW1wbGUgb2JqZWN0cycsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIG8xID0geyBhOiAxLCBiOiAyIH07XG4gICAgdmFyIG8yID0geyBhOiA0MiwgYzogMTAxIH07XG4gICAgdmFyIGUgPSBfLm1lcmdlKG8xLCBvMik7XG5cbiAgICBleHBlY3QoZS5hKS50by5lcWwoNDIpO1xuICAgIGV4cGVjdChlLmIpLnRvLmVxbCgyKTtcbiAgICBleHBlY3QoZS5jKS50by5lcWwoMTAxKTtcblxuICAgIGUuYSA9IDEwMDtcblxuICAgIGV4cGVjdChvMS5hKS50by5lcWwoMSk7XG4gICAgZXhwZWN0KG8yLmEpLnRvLmVxbCg0Mik7XG5cbiAgICBkb25lKCk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIG5vdCBjb25jYXQgYXJyYXlzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgbzEgPSB7IGE6IDEsIGI6IFsnaGVsbG8nLCAnd29ybGQnXSB9O1xuICAgIHZhciBvMiA9IHsgYTogNDIsIGI6IFsnZ29vZGJ5ZSddIH07XG4gICAgdmFyIGUgPSBfLm1lcmdlKG8xLCBvMik7XG5cbiAgICBleHBlY3QoZS5hKS50by5lcWwoNDIpO1xuICAgIGV4cGVjdChlLmIpLnRvLmNvbnRhaW4oJ2dvb2RieWUnKTtcbiAgICBleHBlY3QoZS5iKS50by5ub3QuY29udGFpbignd29ybGQnKTtcbiAgICBleHBlY3QoZS5iLmxlbmd0aCkudG8uZXFsKDEpO1xuXG4gICAgZXhwZWN0KG8xLmIpLnRvLmNvbnRhaW4oJ3dvcmxkJyk7XG4gICAgZXhwZWN0KG8xLmIpLm5vdC50by5jb250YWluKCdnb29kYnllJyk7XG4gICAgZG9uZSgpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBoYW5kbGUgbmVzdGVkIG9iamVjdHMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBvMSA9IHtcbiAgICAgIGE6IDEsXG4gICAgICBjOiAxMDAsXG4gICAgICBwYXlsb2FkOiB7XG4gICAgICAgIHBlcnNvbjoge1xuICAgICAgICAgIGlkOiAneHh4JyxcbiAgICAgICAgICBuYW1lOiAnaGVsbG8nLFxuICAgICAgICB9LFxuICAgICAgICBlbnZpcm9ubWVudDogJ2ZvbycsXG4gICAgICB9LFxuICAgIH07XG4gICAgdmFyIG8yID0ge1xuICAgICAgYTogNDIsXG4gICAgICBiOiAyLFxuICAgICAgcGF5bG9hZDoge1xuICAgICAgICBwZXJzb246IHtcbiAgICAgICAgICBpZDogJ3llc3llcycsXG4gICAgICAgICAgZW1haWw6ICdjb29sJyxcbiAgICAgICAgfSxcbiAgICAgICAgb3RoZXI6ICdiYXInLFxuICAgICAgfSxcbiAgICB9O1xuICAgIHZhciBlID0gXy5tZXJnZShvMSwgbzIpO1xuXG4gICAgZXhwZWN0KGUuYSkudG8uZXFsKDQyKTtcbiAgICBleHBlY3QoZS5jKS50by5lcWwoMTAwKTtcbiAgICBleHBlY3QoZS5iKS50by5lcWwoMik7XG4gICAgZXhwZWN0KGUucGF5bG9hZC5wZXJzb24uaWQpLnRvLmVxbCgneWVzeWVzJyk7XG4gICAgZXhwZWN0KGUucGF5bG9hZC5wZXJzb24uZW1haWwpLnRvLmVxbCgnY29vbCcpO1xuICAgIGV4cGVjdChlLnBheWxvYWQucGVyc29uLm5hbWUpLnRvLmVxbCgnaGVsbG8nKTtcbiAgICBleHBlY3QoZS5wYXlsb2FkLmVudmlyb25tZW50KS50by5lcWwoJ2ZvbycpO1xuICAgIGV4cGVjdChlLnBheWxvYWQub3RoZXIpLnRvLmVxbCgnYmFyJyk7XG4gICAgZG9uZSgpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBoYW5kbGUgbmVzdGVkIGFycmF5cyBhbmQgb2JqZWN0cywgd2l0aCBub24tbWF0Y2hpbmcgc3RydWN0dXJlJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgbzEgPSB7XG4gICAgICBhOiAxLFxuICAgICAgYzoge1xuICAgICAgICBhcnI6IFszLCA0LCA1XSxcbiAgICAgICAgb3RoZXI6IFs5OSwgMTAwLCAxMDFdLFxuICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgZm9vOiB7XG4gICAgICAgICAgICBiYXI6ICdiYXonLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgaGVsbG86ICd3b3JsZCcsXG4gICAgICAgICAga2VlcGVyOiAneXVwJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICB2YXIgbzIgPSB7XG4gICAgICBhOiAzMixcbiAgICAgIGM6IHtcbiAgICAgICAgYXJyOiBbMV0sXG4gICAgICAgIG90aGVyOiB7IGZ1eno6ICdidXp6JyB9LFxuICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgZm9vOiAnaGVsbG8nLFxuICAgICAgICAgIGhlbGxvOiB7XG4gICAgICAgICAgICBiYXo6ICdiYXInLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgdmFyIGUgPSBfLm1lcmdlKG8xLCBvMik7XG5cbiAgICBleHBlY3QoZS5hKS50by5lcWwoMzIpO1xuICAgIGV4cGVjdChlLmMuYXJyLmxlbmd0aCkudG8uZXFsKDEpO1xuICAgIGV4cGVjdChlLmMuYXJyWzBdKS50by5lcWwoMSk7XG4gICAgZXhwZWN0KGUuYy5vdGhlci5mdXp6KS50by5lcWwoJ2J1enonKTtcbiAgICBleHBlY3QoZS5jLnBheWxvYWQuZm9vKS50by5lcWwoJ2hlbGxvJyk7XG4gICAgZXhwZWN0KGUuYy5wYXlsb2FkLmhlbGxvLmJheikudG8uZXFsKCdiYXInKTtcbiAgICBleHBlY3QoZS5jLnBheWxvYWQua2VlcGVyKS50by5lcWwoJ3l1cCcpO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGhhbmRsZSBtYW55IG5lc3RlZCBvYmplY3RzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgbzEgPSB7XG4gICAgICBhOiAxLFxuICAgICAgYzogMTAwLFxuICAgICAgcGF5bG9hZDoge1xuICAgICAgICBwZXJzb246IHtcbiAgICAgICAgICBpZDogJ3h4eCcsXG4gICAgICAgICAgbmFtZTogJ2hlbGxvJyxcbiAgICAgICAgfSxcbiAgICAgICAgZW52aXJvbm1lbnQ6ICdmb28nLFxuICAgICAgfSxcbiAgICB9O1xuICAgIHZhciBvMiA9IHtcbiAgICAgIGE6IDQyLFxuICAgICAgYjogMixcbiAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgcGVyc29uOiB7XG4gICAgICAgICAgaWQ6ICd5ZXN5ZXMnLFxuICAgICAgICAgIGVtYWlsOiAnY29vbCcsXG4gICAgICAgIH0sXG4gICAgICAgIG90aGVyOiAnYmFyJyxcbiAgICAgIH0sXG4gICAgfTtcbiAgICB2YXIgbzMgPSB7XG4gICAgICBwYXlsb2FkOiB7XG4gICAgICAgIGZ1eno6ICdidXp6JyxcbiAgICAgICAgcGVyc29uOiB7XG4gICAgICAgICAgbmFtZTogJ25vcGUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGFtaWhlcmU6ICd5ZXMnLFxuICAgIH07XG4gICAgdmFyIGUgPSBfLm1lcmdlKG8xLCBvMiwgbzMpO1xuXG4gICAgZXhwZWN0KGUuYSkudG8uZXFsKDQyKTtcbiAgICBleHBlY3QoZS5jKS50by5lcWwoMTAwKTtcbiAgICBleHBlY3QoZS5iKS50by5lcWwoMik7XG4gICAgZXhwZWN0KGUucGF5bG9hZC5wZXJzb24uaWQpLnRvLmVxbCgneWVzeWVzJyk7XG4gICAgZXhwZWN0KGUucGF5bG9hZC5wZXJzb24uZW1haWwpLnRvLmVxbCgnY29vbCcpO1xuICAgIGV4cGVjdChlLnBheWxvYWQucGVyc29uLm5hbWUpLnRvLmVxbCgnbm9wZScpO1xuICAgIGV4cGVjdChlLnBheWxvYWQuZW52aXJvbm1lbnQpLnRvLmVxbCgnZm9vJyk7XG4gICAgZXhwZWN0KGUucGF5bG9hZC5mdXp6KS50by5lcWwoJ2J1enonKTtcbiAgICBleHBlY3QoZS5wYXlsb2FkLm90aGVyKS50by5lcWwoJ2JhcicpO1xuICAgIGV4cGVjdChlLmFtaWhlcmUpLnRvLmVxbCgneWVzJyk7XG4gICAgZG9uZSgpO1xuICB9KTtcbn0pO1xuXG52YXIgdHJhdmVyc2UgPSByZXF1aXJlKCcuLi9zcmMvdXRpbGl0eS90cmF2ZXJzZScpO1xuZGVzY3JpYmUoJ3RyYXZlcnNlJywgZnVuY3Rpb24gKCkge1xuICBkZXNjcmliZSgnc2hvdWxkIGNhbGwgdGhlIGZ1bmMgZm9yIGV2ZXJ5IGtleSx2YWx1ZScsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2ltcGxlIG9iamVjdCcsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICB2YXIgb2JqID0geyBhOiAxLCBiOiAyIH07XG4gICAgICB2YXIgZXhwZWN0ZWRPdXRwdXQgPSB7IGE6IDIsIGI6IDMgfTtcbiAgICAgIHZhciBjYWxsQ291bnQgPSAwO1xuICAgICAgdmFyIHJlc3VsdCA9IHRyYXZlcnNlKG9iaiwgZnVuY3Rpb24gKGssIHYpIHtcbiAgICAgICAgY2FsbENvdW50Kys7XG4gICAgICAgIHJldHVybiB2ICsgMTtcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KHJlc3VsdCkudG8uZXFsKGV4cGVjdGVkT3V0cHV0KTtcbiAgICAgIGV4cGVjdChjYWxsQ291bnQpLnRvLmVxbCgyKTtcblxuICAgICAgZG9uZSgpO1xuICAgIH0pO1xuICAgIGl0KCduZXN0ZWQgb2JqZWN0JywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgIHZhciBvYmogPSB7IGE6IDEsIGI6IDIsIGM6IHsgY2E6IDExIH0gfTtcbiAgICAgIHZhciBleHBlY3RlZE91dHB1dCA9IHsgYTogMiwgYjogMywgYzogeyBjYTogMTIgfSB9O1xuICAgICAgdmFyIGNhbGxDb3VudCA9IDA7XG4gICAgICB2YXIgcmVzdWx0ID0gdHJhdmVyc2Uob2JqLCBmdW5jdGlvbiAoaywgdikge1xuICAgICAgICBjYWxsQ291bnQrKztcbiAgICAgICAgaWYgKGsgPT09ICdjJykge1xuICAgICAgICAgIHJldHVybiB7IGNhOiB2LmNhICsgMSB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2ICsgMTtcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KHJlc3VsdCkudG8uZXFsKGV4cGVjdGVkT3V0cHV0KTtcbiAgICAgIGV4cGVjdChjYWxsQ291bnQpLnRvLmVxbCgzKTtcblxuICAgICAgZG9uZSgpO1xuICAgIH0pO1xuICAgIGl0KCdhcnJheScsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICB2YXIgb2JqID0gWzEsIDIsIDNdO1xuICAgICAgdmFyIGV4cGVjdGVkID0gWzAsIDEsIDJdO1xuICAgICAgdmFyIGNhbGxDb3VudCA9IDA7XG4gICAgICB2YXIgcmVzdWx0ID0gdHJhdmVyc2UoXG4gICAgICAgIG9iaixcbiAgICAgICAgZnVuY3Rpb24gKGssIHYpIHtcbiAgICAgICAgICBjYWxsQ291bnQrKztcbiAgICAgICAgICByZXR1cm4gdiAtIDE7XG4gICAgICAgIH0sXG4gICAgICAgIFtdLFxuICAgICAgKTtcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvLmVxbChleHBlY3RlZCk7XG4gICAgICBleHBlY3QoY2FsbENvdW50KS50by5lcWwoMyk7XG4gICAgICBkb25lKCk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCd1dWlkNCcsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCByZXR1cm4gYSB2ZXJzaW9uIDQgdXVpZCcsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIGlkID0gXy51dWlkNCgpO1xuICAgIHZhciBvdGhlcklkID0gXy51dWlkNCgpO1xuICAgIGV4cGVjdChpZCkudG8ubm90LmVxbChvdGhlcklkKTtcbiAgICB2YXIgcGFydHMgPSBpZC5zcGxpdCgnLScpO1xuICAgIGV4cGVjdChwYXJ0cy5sZW5ndGgpLnRvLmVxbCg1KTtcbiAgICBleHBlY3QocGFydHNbMl1bMF0pLnRvLmVxbCgnNCcpO1xuICAgIGV4cGVjdChwYXJ0c1swXS5sZW5ndGgpLnRvLmVxbCg4KTtcbiAgICBleHBlY3QocGFydHNbMV0ubGVuZ3RoKS50by5lcWwoNCk7XG4gICAgZXhwZWN0KHBhcnRzWzJdLmxlbmd0aCkudG8uZXFsKDQpO1xuICAgIGV4cGVjdChwYXJ0c1szXS5sZW5ndGgpLnRvLmVxbCg0KTtcbiAgICBleHBlY3QocGFydHNbNF0ubGVuZ3RoKS50by5lcWwoMTIpO1xuICAgIGRvbmUoKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ3JlZGFjdCcsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCByZXR1cm4gYSBzdHJpbmcgb2Ygc3RhcnMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBzMSA9ICd0aGlzSXNBcGFzc3dyRCc7XG4gICAgdmFyIHMyID0gJ3Nob3J0JztcbiAgICB2YXIgbyA9IHsgYTogMTIzIH07XG4gICAgdmFyIGEgPSBbMTIsIDM0LCA1Nl07XG5cbiAgICBleHBlY3QoXy5yZWRhY3QoczEpKS50by5ub3QubWF0Y2goL1teKl0vKTtcbiAgICBleHBlY3QoXy5yZWRhY3QoczIpKS50by5ub3QubWF0Y2goL1teKl0vKTtcbiAgICBleHBlY3QoXy5yZWRhY3QoczEpKS50by5lcWwoXy5yZWRhY3QoczIpKTtcbiAgICBleHBlY3QoXy5yZWRhY3QobykpLnRvLm5vdC5tYXRjaCgvW14qXS8pO1xuICAgIGV4cGVjdChfLnJlZGFjdChhKSkudG8ubm90Lm1hdGNoKC9bXipdLyk7XG5cbiAgICBkb25lKCk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdMRVZFTFMnLCBmdW5jdGlvbiAoKSB7XG4gIGl0KCdzaG91bGQgaW5jbHVkZSBkZWJ1ZycsIGZ1bmN0aW9uICgpIHtcbiAgICBleHBlY3QoXy5MRVZFTFNbJ2RlYnVnJ10pLnRvLm5vdC5lcWwodW5kZWZpbmVkKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgaGF2ZSBjcml0aWNhbCBoaWdoZXIgdGhhbiBkZWJ1ZycsIGZ1bmN0aW9uICgpIHtcbiAgICBleHBlY3QoXy5MRVZFTFNbJ2NyaXRpY2FsJ10pLnRvLmJlLmdyZWF0ZXJUaGFuKF8uTEVWRUxTWydkZWJ1ZyddKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2Zvcm1hdFVybCcsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCBoYW5kbGUgYSBtaXNzaW5nIHByb3RvY29sJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciB1ID0ge1xuICAgICAgaG9zdG5hbWU6ICdhLmIuY29tJyxcbiAgICAgIHBhdGg6ICcvd29vemEvJyxcbiAgICAgIHBvcnQ6IDQyLFxuICAgIH07XG4gICAgZXhwZWN0KF8uZm9ybWF0VXJsKHUpKS50by5lcWwoJ2h0dHBzOi8vYS5iLmNvbTo0Mi93b296YS8nKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgdXNlIGEgZm9yY2VkIHByb3RvY29sJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciB1ID0ge1xuICAgICAgaG9zdG5hbWU6ICdhLmIuY29tJyxcbiAgICAgIHBhdGg6ICcvd29vemEvJyxcbiAgICAgIHBvcnQ6IDQyLFxuICAgIH07XG4gICAgZXhwZWN0KF8uZm9ybWF0VXJsKHUsICdmaWxlOicpKS50by5lcWwoJ2ZpbGU6Ly9hLmIuY29tOjQyL3dvb3phLycpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBwaWNrIGEgcHJvdG9jb2wgYmFzZWQgb24gcG9ydCBpZiBvdGhlcnMgYXJlIG1pc3NpbmcnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHUgPSB7XG4gICAgICBob3N0bmFtZTogJ2EuYi5jb20nLFxuICAgICAgcG9ydDogODAsXG4gICAgICBwYXRoOiAnL3dvbycsXG4gICAgfTtcbiAgICBleHBlY3QoXy5mb3JtYXRVcmwodSkpLnRvLmVxbCgnaHR0cDovL2EuYi5jb206ODAvd29vJyk7XG4gICAgdS5wcm90b2NvbCA9ICdodHRwczonO1xuICAgIGV4cGVjdChfLmZvcm1hdFVybCh1KSkudG8uZXFsKCdodHRwczovL2EuYi5jb206ODAvd29vJyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIGhhbmRsZSBtaXNzaW5nIHBhcnRzJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciB1ID0ge1xuICAgICAgaG9zdG5hbWU6ICdhLmIuY29tJyxcbiAgICB9O1xuICAgIGV4cGVjdChfLmZvcm1hdFVybCh1KSkudG8uZXFsKCdodHRwczovL2EuYi5jb20nKTtcbiAgICBleHBlY3QoXy5mb3JtYXRVcmwodSwgJ2h0dHA6JykpLnRvLmVxbCgnaHR0cDovL2EuYi5jb20nKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgcmV0dXJuIG51bGwgd2l0aG91dCBhIGhvc3RuYW1lJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciB1ID0ge307XG4gICAgZXhwZWN0KF8uZm9ybWF0VXJsKHUpKS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QoXy5mb3JtYXRVcmwodSwgJ2h0dHBzOicpKS50by5ub3QuYmUub2soKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2FkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoJywgZnVuY3Rpb24gKCkge1xuICB2YXIgYWNjZXNzVG9rZW4gPSAnYWJjMTIzJztcbiAgaXQoJ3Nob3VsZCBoYW5kbGUgbm8gcGFyYW1zIGFuZCBubyBwYXRoJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRpb25zID0ge307XG4gICAgXy5hZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aChhY2Nlc3NUb2tlbiwgb3B0aW9ucyk7XG4gICAgZXhwZWN0KG9wdGlvbnMucGF0aCkudG8uZXFsKCc/YWNjZXNzX3Rva2VuPWFiYzEyMycpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBoYW5kbGUgZXhpc3RpbmcgcGFyYW1zJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRpb25zID0geyBwYXRoOiAnL2FwaT9hPWInIH07XG4gICAgXy5hZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aChhY2Nlc3NUb2tlbiwgb3B0aW9ucyk7XG4gICAgZXhwZWN0KG9wdGlvbnMucGF0aCkudG8uZXFsKCcvYXBpP2FjY2Vzc190b2tlbj1hYmMxMjMmYT1iJyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIGhhbmRsZSBhIGhhc2ggd2l0aCBwYXJhbXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7IHBhdGg6ICcvYXBpP2E9YiNtb3JlU3R1ZmY/P2hlcmUnIH07XG4gICAgXy5hZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aChhY2Nlc3NUb2tlbiwgb3B0aW9ucyk7XG4gICAgZXhwZWN0KG9wdGlvbnMucGF0aCkudG8uZXFsKCcvYXBpP2FjY2Vzc190b2tlbj1hYmMxMjMmYT1iI21vcmVTdHVmZj8/aGVyZScpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBoYW5kbGUgYSBoYXNoIHdpdGhvdXQgcGFyYW1zJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRpb25zID0geyBwYXRoOiAnL2FwaSNtb3JlU3R1ZmY/P2hlcmUnIH07XG4gICAgXy5hZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aChhY2Nlc3NUb2tlbiwgb3B0aW9ucyk7XG4gICAgZXhwZWN0KG9wdGlvbnMucGF0aCkudG8uZXFsKCcvYXBpP2FjY2Vzc190b2tlbj1hYmMxMjMjbW9yZVN0dWZmPz9oZXJlJyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIGhhbmRsZSBhIGhhc2ggd2l0aG91dCBwYXJhbXMgYW5kIG5vID8nLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7IHBhdGg6ICcvYXBpI21vcmVTdHVmZicgfTtcbiAgICBfLmFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoKGFjY2Vzc1Rva2VuLCBvcHRpb25zKTtcbiAgICBleHBlY3Qob3B0aW9ucy5wYXRoKS50by5lcWwoJy9hcGk/YWNjZXNzX3Rva2VuPWFiYzEyMyNtb3JlU3R1ZmYnKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgaGFuZGxlIGV4dHJhIHBhcmFtcycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHsgcGF0aDogJy9hcGkjbW9yZVN0dWZmJyB9O1xuICAgIF8uYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGgoYWNjZXNzVG9rZW4sIG9wdGlvbnMsIHsgZm9vOiAnYm9vJyB9KTtcbiAgICBleHBlY3Qob3B0aW9ucy5wYXRoKS50by5lcWwoJy9hcGk/YWNjZXNzX3Rva2VuPWFiYzEyMyZmb289Ym9vI21vcmVTdHVmZicpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnanNvbjMnLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZXR1cEN1c3RvbUpTT04gPSByZXF1aXJlKCcuLi92ZW5kb3IvSlNPTi1qcy9qc29uMy5qcycpO1xuICBpdCgnc2hvdWxkIHJlcGxhY2Ugc3RyaW5naWZ5IGlmIG5vdCB0aGVyZScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaiA9IHt9O1xuICAgIHNldHVwQ3VzdG9tSlNPTihqKTtcbiAgICBleHBlY3Qoai5zdHJpbmdpZnkoeyBhOiAxIH0pKS50by5lcWwoJ3tcImFcIjoxfScpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCByZXBsYWNlIHBhcnNlIGlmIG5vdCB0aGVyZScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaiA9IHt9O1xuICAgIHNldHVwQ3VzdG9tSlNPTihqKTtcbiAgICBleHBlY3Qoai5wYXJzZSgne1wiYVwiOjF9JykuYSkudG8uZXFsKDEpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBub3QgcmVwbGFjZSBwYXJzZSBpZiB0aGVyZScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaiA9IHtcbiAgICAgIHBhcnNlOiBmdW5jdGlvbiAocykge1xuICAgICAgICByZXR1cm4gNDI7XG4gICAgICB9LFxuICAgIH07XG4gICAgc2V0dXBDdXN0b21KU09OKGopO1xuICAgIGV4cGVjdChqLnBhcnNlKCd7XCJhXCI6MX0nKSkudG8uZXFsKDQyKTtcbiAgICBleHBlY3Qoai5zdHJpbmdpZnkoeyBhOiAxIH0pKS50by5lcWwoJ3tcImFcIjoxfScpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBub3QgcmVwbGFjZSBzdHJpbmdpZnkgaWYgdGhlcmUnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGogPSB7XG4gICAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHJldHVybiAnNDInO1xuICAgICAgfSxcbiAgICB9O1xuICAgIHNldHVwQ3VzdG9tSlNPTihqKTtcbiAgICBleHBlY3Qoai5zdHJpbmdpZnkoeyBhOiAxIH0pKS50by5lcWwoJzQyJyk7XG4gICAgZXhwZWN0KGoucGFyc2UoJ3tcImFcIjoxfScpLmEpLnRvLmVxbCgxKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2dldCcsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCBnZXQgYSBkZWVwbHkgbmVzdGVkIHZhbHVlJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBvID0geyBhOiB7IGI6IHsgYzogeyBkOiA0MiB9IH0gfSB9O1xuICAgIGV4cGVjdChfLmdldChvLCAnYS5iLmMuZCcpKS50by5lcWwoNDIpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBiZSB1bmRlZmluZWQgZm9yIGEgbWlzc2luZyB2YWx1ZScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbyA9IHsgYTogeyBiOiB7IGM6IHsgZDogNDIgfSB9IH0gfTtcbiAgICBleHBlY3QoXy5nZXQobywgJ2EuYi54LmQnKSkudG8ubm90LmJlLm9rKCk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIGhhbmRsZSBiYWQgaW5wdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG8gPSAnaGVsbG8nO1xuICAgIGV4cGVjdChfLmdldChvLCAnb29wcy4xLjIuMycpKS50by5ub3QuYmUub2soKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgYWN0dWFsbHkgd29yayB3aXRoIGFycmF5cyB0b28nLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG8gPSB7IGE6IFt7IGI6IHsgYzogWzEsIHsgZDogNDIgfSwgbnVsbF0gfSB9LCA5OV0gfTtcbiAgICBleHBlY3QoXy5nZXQobywgJ2EuMC5iLmMuMS5kJykpLnRvLmVxbCg0Mik7XG4gIH0pO1xuICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgaW5wdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHUgPSB1bmRlZmluZWQ7XG4gICAgZXhwZWN0KF8uZ2V0KHUsICdhLmIuYycpKS50by5ub3QuYmUub2soKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2ZpbHRlcklwJywgZnVuY3Rpb24gKCkge1xuICBpdCgnbm8gdXNlcl9pcCcsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7IHNvbWV0aGluZzogJ2J1dCBubyBpcCcgfTtcbiAgICBfLmZpbHRlcklwKHJlcXVlc3REYXRhLCBmYWxzZSk7XG4gICAgZXhwZWN0KHJlcXVlc3REYXRhWyd1c2VyX2lwJ10pLnRvLm5vdC5iZS5vaygpO1xuICB9KTtcbiAgaXQoJ2NhcHR1cmUgdHJ1ZScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXAgPSAnMTIzLjMyLjM5NC45OSc7XG4gICAgdmFyIHJlcXVlc3REYXRhID0geyB1c2VyX2lwOiBpcCB9O1xuICAgIF8uZmlsdGVySXAocmVxdWVzdERhdGEsIHRydWUpO1xuICAgIGV4cGVjdChyZXF1ZXN0RGF0YVsndXNlcl9pcCddKS50by5lcWwoaXApO1xuICB9KTtcbiAgaXQoJ2Fub255bWl6ZSBpcDQnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGlwID0gJzEyMy4zMi4zOTQuOTknO1xuICAgIHZhciByZXF1ZXN0RGF0YSA9IHsgdXNlcl9pcDogaXAgfTtcbiAgICBfLmZpbHRlcklwKHJlcXVlc3REYXRhLCAnYW5vbnltaXplJyk7XG4gICAgZXhwZWN0KHJlcXVlc3REYXRhWyd1c2VyX2lwJ10pLnRvLm5vdC5lcWwoaXApO1xuICAgIGV4cGVjdChyZXF1ZXN0RGF0YVsndXNlcl9pcCddKS50by5iZS5vaygpO1xuICB9KTtcbiAgaXQoJ2NhcHR1cmUgZmFsc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGlwID0gJzEyMy4zMi4zOTQuOTknO1xuICAgIHZhciByZXF1ZXN0RGF0YSA9IHsgdXNlcl9pcDogaXAgfTtcbiAgICBfLmZpbHRlcklwKHJlcXVlc3REYXRhLCBmYWxzZSk7XG4gICAgZXhwZWN0KHJlcXVlc3REYXRhWyd1c2VyX2lwJ10pLnRvLm5vdC5lcWwoaXApO1xuICAgIGV4cGVjdChyZXF1ZXN0RGF0YVsndXNlcl9pcCddKS50by5ub3QuYmUub2soKTtcbiAgfSk7XG4gIGl0KCdpcHY2IGNhcHR1cmUgZmFsc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGlwID0gJzI2MDc6ZjBkMDoxMDAyOjUxOjo0JztcbiAgICB2YXIgcmVxdWVzdERhdGEgPSB7IHVzZXJfaXA6IGlwIH07XG4gICAgXy5maWx0ZXJJcChyZXF1ZXN0RGF0YSwgZmFsc2UpO1xuICAgIGV4cGVjdChyZXF1ZXN0RGF0YVsndXNlcl9pcCddKS50by5ub3QuZXFsKGlwKTtcbiAgICBleHBlY3QocmVxdWVzdERhdGFbJ3VzZXJfaXAnXSkudG8ubm90LmJlLm9rKCk7XG4gIH0pO1xuICBpdCgnaXB2NiBhbm9ueW1pemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGlwcyA9IFtcbiAgICAgICdGRTgwOjAwMDA6MDAwMDowMDAwOjAyMDI6QjNGRjpGRTFFOjgzMjknLFxuICAgICAgJ0ZFODA6OjAyMDI6QjNGRjpGRTFFOjgzMjknLFxuICAgICAgJzI2MDc6ZjBkMDoxMDAyOjUxOjo0JyxcbiAgICBdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaXAgPSBpcHNbaV07XG4gICAgICB2YXIgcmVxdWVzdERhdGEgPSB7IHVzZXJfaXA6IGlwIH07XG4gICAgICBfLmZpbHRlcklwKHJlcXVlc3REYXRhLCAnYW5vbnltaXplJyk7XG4gICAgICBleHBlY3QocmVxdWVzdERhdGFbJ3VzZXJfaXAnXSkudG8ubm90LmVxbChpcCk7XG4gICAgICBleHBlY3QocmVxdWVzdERhdGFbJ3VzZXJfaXAnXSkudG8uYmUub2soKTtcbiAgICB9XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdzZXQnLCBmdW5jdGlvbiAoKSB7XG4gIGl0KCdzaG91bGQgaGFuZGxlIGEgdG9wIGxldmVsIGtleScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbyA9IHsgYTogNDIgfTtcbiAgICBfLnNldChvLCAnYicsIDEpO1xuICAgIGV4cGVjdChvLmIpLnRvLmVxbCgxKTtcbiAgICBleHBlY3Qoby5hKS50by5lcWwoNDIpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBoYW5kbGUgYSB0b3AgbGV2ZWwga2V5JywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBvID0geyBhOiA0MiwgYjogeyBjOiA0NCwgZDogeyBlOiA5OSB9IH0gfTtcbiAgICBfLnNldChvLCAnZicsIDEpO1xuICAgIGV4cGVjdChvLmYpLnRvLmVxbCgxKTtcbiAgICBleHBlY3Qoby5hKS50by5lcWwoNDIpO1xuICAgIGV4cGVjdChvLmIuYykudG8uZXFsKDQ0KTtcbiAgICBleHBlY3Qoby5iLmQuZSkudG8uZXFsKDk5KTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgcmVwbGFjZSBhIHZhbHVlIHRoYXQgaXMgYWxyZWFkeSB0aGVyZScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbyA9IHsgYTogNDIgfTtcbiAgICBfLnNldChvLCAnYScsIDEpO1xuICAgIGV4cGVjdChvLmEpLnRvLmVxbCgxKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgc2V0IGEgbmVzdGVkIHZhbHVlIHdpdGggbWlzc2luZyBrZXlzJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBvID0geyBiYXo6IDIxIH07XG4gICAgXy5zZXQobywgJ2Zvby5iYXInLCBbNDJdKTtcbiAgICBleHBlY3Qoby5iYXopLnRvLmVxbCgyMSk7XG4gICAgZXhwZWN0KG8uZm9vLmJhcikudG8uZXFsKFs0Ml0pO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCByZXBsYWNlIGEgbmVzdGVkIHZhbHVlJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBvID0geyB3b286IDk5LCBmb286IHsgYmFyOiB7IGJhejogNDIsIGJ1eno6IDk3IH0sIGE6IDk4IH0gfTtcbiAgICBfLnNldChvLCAnZm9vLmJhci5iYXonLCAxKTtcbiAgICBleHBlY3Qoby53b28pLnRvLmVxbCg5OSk7XG4gICAgZXhwZWN0KG8uZm9vLmEpLnRvLmVxbCg5OCk7XG4gICAgZXhwZWN0KG8uZm9vLmJhci5idXp6KS50by5lcWwoOTcpO1xuICAgIGV4cGVjdChvLmZvby5iYXIuYmF6KS50by5lcWwoMSk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIHNldCBhIG5lc3RlZCB2YWx1ZSB3aXRoIHNvbWUgbWlzc2luZyBrZXlzJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBvID0geyB3b286IDk5LCBmb286IHsgYmFyOiB7IGJ1eno6IDk3IH0sIGE6IDk4IH0gfTtcbiAgICBfLnNldChvLCAnZm9vLmJhci5iYXouZml6eicsIDEpO1xuICAgIGV4cGVjdChvLndvbykudG8uZXFsKDk5KTtcbiAgICBleHBlY3Qoby5mb28uYSkudG8uZXFsKDk4KTtcbiAgICBleHBlY3Qoby5mb28uYmFyLmJ1enopLnRvLmVxbCg5Nyk7XG4gICAgZXhwZWN0KG8uZm9vLmJhci5iYXouZml6eikudG8uZXFsKDEpO1xuICB9KTtcbn0pO1xuXG52YXIgc2NydWIgPSByZXF1aXJlKCcuLi9zcmMvc2NydWInKTtcbmRlc2NyaWJlKCdzY3J1YicsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCBub3QgcmVkYWN0IGZpZWxkcyB0aGF0IGFyZSBva2F5JywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgYTogJ3NvbWVzdHJpbmcnLFxuICAgICAgcGFzc3dvcmQ6ICdhYmMxMjMnLFxuICAgICAgdGVtcFdvcmtlcjogJ2Nvb2wnLFxuICAgIH07XG4gICAgdmFyIHNjcnViRmllbGRzID0gWydwYXNzd29yZCcsICdiJywgJ3B3J107XG5cbiAgICB2YXIgcmVzdWx0ID0gc2NydWIoZGF0YSwgc2NydWJGaWVsZHMpO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5hKS50by5lcWwoJ3NvbWVzdHJpbmcnKTtcbiAgICBleHBlY3QocmVzdWx0LnRlbXBXb3JrZXIpLnRvLmVxbCgnY29vbCcpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCByZWRhY3QgZmllbGRzIHRoYXQgYXJlIGluIHRoZSBmaWVsZCBsaXN0JywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgYTogJ3NvbWVzdHJpbmcnLFxuICAgICAgcGFzc3dvcmQ6ICdhYmMxMjMnLFxuICAgIH07XG4gICAgdmFyIHNjcnViRmllbGRzID0gWydwYXNzd29yZCcsICdiJ107XG5cbiAgICB2YXIgcmVzdWx0ID0gc2NydWIoZGF0YSwgc2NydWJGaWVsZHMpO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5wYXNzd29yZCkudG8uZXFsKF8ucmVkYWN0KCkpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBoYW5kbGUgbmVzdGVkIG9iamVjdHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICBhOiB7XG4gICAgICAgIGI6IHtcbiAgICAgICAgICBiYWR0aGluZzogJ3NlY3JldCcsXG4gICAgICAgICAgb3RoZXI6ICdzdHVmZicsXG4gICAgICAgIH0sXG4gICAgICAgIGM6ICdib3JrJyxcbiAgICAgICAgcGFzc3dvcmQ6ICdhYmMxMjMnLFxuICAgICAgfSxcbiAgICAgIHNlY3JldDogJ2JsYWhibGFoJyxcbiAgICB9O1xuICAgIHZhciBzY3J1YkZpZWxkcyA9IFsnYmFkdGhpbmcnLCAncGFzc3dvcmQnLCAnc2VjcmV0J107XG5cbiAgICB2YXIgcmVzdWx0ID0gc2NydWIoZGF0YSwgc2NydWJGaWVsZHMpO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5hLmIub3RoZXIpLnRvLmVxbCgnc3R1ZmYnKTtcbiAgICBleHBlY3QocmVzdWx0LmEuYi5iYWR0aGluZykudG8uZXFsKF8ucmVkYWN0KCkpO1xuICAgIGV4cGVjdChyZXN1bHQuYS5jKS50by5lcWwoJ2JvcmsnKTtcbiAgICBleHBlY3QocmVzdWx0LmEucGFzc3dvcmQpLnRvLmVxbChfLnJlZGFjdCgpKTtcbiAgICBleHBlY3QocmVzdWx0LnNlY3JldCkudG8uZXFsKF8ucmVkYWN0KCkpO1xuICAgIGV4cGVjdChkYXRhLnNlY3JldCkudG8uZXFsKCdibGFoYmxhaCcpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBkbyBzb21ldGhpbmcgc2FuZSBmb3IgcmVjdXJzaXZlIG9iamVjdHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGlubmVyID0ge1xuICAgICAgYTogJ3doYXQnLFxuICAgICAgYjogJ3llcycsXG4gICAgfTtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIHRoaW5nOiAnc3R1ZmYnLFxuICAgICAgcGFzc3dvcmQ6ICdhYmMxMjMnLFxuICAgIH07XG4gICAgZGF0YS5pbm5lciA9IGlubmVyO1xuICAgIGlubmVyLm91dGVyID0gZGF0YTtcbiAgICB2YXIgc2NydWJGaWVsZHMgPSBbJ3Bhc3N3b3JkJywgJ2EnXTtcblxuICAgIHZhciByZXN1bHQgPSBzY3J1YihkYXRhLCBzY3J1YkZpZWxkcyk7XG5cbiAgICBleHBlY3QocmVzdWx0LnRoaW5nKS50by5lcWwoJ3N0dWZmJyk7XG4gICAgZXhwZWN0KHJlc3VsdC5wYXNzd29yZCkudG8uZXFsKF8ucmVkYWN0KCkpO1xuICAgIGV4cGVjdChyZXN1bHQuaW5uZXIuYSkudG8uZXFsKF8ucmVkYWN0KCkpO1xuICAgIGV4cGVjdChyZXN1bHQuaW5uZXIuYSkudG8uYmUub2soKTtcbiAgICBleHBlY3QocmVzdWx0LmlubmVyLmIpLnRvLmVxbCgneWVzJyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIHNjcnViIG9iamVjdHMgc2VlbiB0d2ljZScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVxdWVzdCA9IHtcbiAgICAgIHBhc3N3b3JkOiAnZm9vJyxcbiAgICB9O1xuXG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICByZXF1ZXN0LFxuICAgICAgcmVzcG9uc2U6IHsgcmVxdWVzdCB9LFxuICAgIH07XG5cbiAgICB2YXIgc2NydWJGaWVsZHMgPSBbJ3Bhc3N3b3JkJ107XG5cbiAgICB2YXIgcmVzdWx0ID0gc2NydWIoZGF0YSwgc2NydWJGaWVsZHMpO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5yZXF1ZXN0LnBhc3N3b3JkKS50by5lcWwoXy5yZWRhY3QoKSk7XG4gICAgZXhwZWN0KHJlc3VsdC5yZXNwb25zZS5yZXF1ZXN0LnBhc3N3b3JkKS50by5lcWwoXy5yZWRhY3QoKSk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIGhhbmRsZSBzY3J1YlBhdGhzJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgYToge1xuICAgICAgICBiOiB7XG4gICAgICAgICAgZm9vOiAnc2VjcmV0JyxcbiAgICAgICAgICBiYXI6ICdzdHVmZicsXG4gICAgICAgIH0sXG4gICAgICAgIGM6ICdib3JrJyxcbiAgICAgICAgcGFzc3dvcmQ6ICdhYmMxMjMnLFxuICAgICAgfSxcbiAgICAgIHNlY3JldDogJ2JsYWhibGFoJyxcbiAgICB9O1xuICAgIHZhciBzY3J1YlBhdGhzID0gW1xuICAgICAgJ25vd2hlcmUnLCAvLyBwYXRoIG5vdCBmb3VuZFxuICAgICAgJ2EuYi5mb28nLCAvLyBuZXN0ZWQgcGF0aFxuICAgICAgJ2EucGFzc3dvcmQnLCAvLyBuZXN0ZWQgcGF0aFxuICAgICAgJ3NlY3JldCcsIC8vIHJvb3QgcGF0aFxuICAgIF07XG5cbiAgICB2YXIgcmVzdWx0ID0gc2NydWIoZGF0YSwgW10sIHNjcnViUGF0aHMpO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5hLmIuYmFyKS50by5lcWwoJ3N0dWZmJyk7XG4gICAgZXhwZWN0KHJlc3VsdC5hLmIuZm9vKS50by5lcWwoXy5yZWRhY3QoKSk7XG4gICAgZXhwZWN0KHJlc3VsdC5hLmMpLnRvLmVxbCgnYm9yaycpO1xuICAgIGV4cGVjdChyZXN1bHQuYS5wYXNzd29yZCkudG8uZXFsKF8ucmVkYWN0KCkpO1xuICAgIGV4cGVjdChyZXN1bHQuc2VjcmV0KS50by5lcWwoXy5yZWRhY3QoKSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdmb3JtYXRBcmdzQXNTdHJpbmcnLCBmdW5jdGlvbiAoKSB7XG4gIGl0KCdzaG91bGQgaGFuZGxlIG51bGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFyZ3MgPSBbbnVsbCwgMV07XG4gICAgdmFyIHJlc3VsdCA9IF8uZm9ybWF0QXJnc0FzU3RyaW5nKGFyZ3MpO1xuXG4gICAgZXhwZWN0KHJlc3VsdCkudG8uZXFsKCdudWxsIDEnKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCcsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJncyA9IFtudWxsLCAxLCB1bmRlZmluZWRdO1xuICAgIHZhciByZXN1bHQgPSBfLmZvcm1hdEFyZ3NBc1N0cmluZyhhcmdzKTtcblxuICAgIGV4cGVjdChyZXN1bHQpLnRvLmVxbCgnbnVsbCAxIHVuZGVmaW5lZCcpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBoYW5kbGUgb2JqZWN0cycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJncyA9IFsxLCB7IGE6IDQyIH1dO1xuICAgIHZhciByZXN1bHQgPSBfLmZvcm1hdEFyZ3NBc1N0cmluZyhhcmdzKTtcblxuICAgIGV4cGVjdChyZXN1bHQpLnRvLmVxbCgnMSB7XCJhXCI6NDJ9Jyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIGhhbmRsZSBzdHJpbmdzJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcmdzID0gWzEsICdmb28nXTtcbiAgICB2YXIgcmVzdWx0ID0gXy5mb3JtYXRBcmdzQXNTdHJpbmcoYXJncyk7XG5cbiAgICBleHBlY3QocmVzdWx0KS50by5lcWwoJzEgZm9vJyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBhcmdzJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcmdzID0gW107XG4gICAgdmFyIHJlc3VsdCA9IF8uZm9ybWF0QXJnc0FzU3RyaW5nKGFyZ3MpO1xuXG4gICAgZXhwZWN0KHJlc3VsdCkudG8uZXFsKCcnKTtcbiAgfSk7XG4gIC8qXG4gICAqIFBoYW50b21KUyBkb2VzIG5vdCBzdXBwb3J0IFN5bWJvbCB5ZXRcbiAgaXQoJ3Nob3VsZCBoYW5kbGUgc3ltYm9scycsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gWzEsIFN5bWJvbCgnaGVsbG8nKV07XG4gICAgdmFyIHJlc3VsdCA9IF8uZm9ybWF0QXJnc0FzU3RyaW5nKGFyZ3MpO1xuXG4gICAgZXhwZWN0KHJlc3VsdCkudG8uZXFsKCcxIHN5bWJvbChcXCdoZWxsb1xcJyknKTtcbiAgfSk7XG4gICovXG59KTtcbiJdLCJuYW1lcyI6WyJoYXNPd24iLCJPYmplY3QiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsInRvU3RyIiwidG9TdHJpbmciLCJpc1BsYWluT2JqZWN0Iiwib2JqIiwiY2FsbCIsImhhc093bkNvbnN0cnVjdG9yIiwiaGFzSXNQcm90b3R5cGVPZiIsImNvbnN0cnVjdG9yIiwia2V5IiwibWVyZ2UiLCJpIiwic3JjIiwiY29weSIsImNsb25lIiwibmFtZSIsInJlc3VsdCIsImN1cnJlbnQiLCJsZW5ndGgiLCJhcmd1bWVudHMiLCJtb2R1bGUiLCJleHBvcnRzIiwiXyIsInJlcXVpcmUiLCJ0cmF2ZXJzZSIsInNjcnViIiwiZGF0YSIsInNjcnViRmllbGRzIiwic2NydWJQYXRocyIsInNjcnViUGF0aCIsInBhcmFtUmVzIiwiX2dldFNjcnViRmllbGRSZWdleHMiLCJxdWVyeVJlcyIsIl9nZXRTY3J1YlF1ZXJ5UGFyYW1SZWdleHMiLCJyZWRhY3RRdWVyeVBhcmFtIiwiZHVtbXkwIiwicGFyYW1QYXJ0IiwicmVkYWN0IiwicGFyYW1TY3J1YmJlciIsInYiLCJpc1R5cGUiLCJyZXBsYWNlIiwidmFsU2NydWJiZXIiLCJrIiwidGVzdCIsInNjcnViYmVyIiwic2VlbiIsInRtcFYiLCJwYXRoIiwia2V5cyIsInNwbGl0IiwibGFzdCIsImUiLCJyZXQiLCJwYXQiLCJwdXNoIiwiUmVnRXhwIiwiUm9sbGJhckpTT04iLCJzZXR1cEpTT04iLCJwb2x5ZmlsbEpTT04iLCJpc0Z1bmN0aW9uIiwic3RyaW5naWZ5IiwicGFyc2UiLCJpc0RlZmluZWQiLCJKU09OIiwiaXNOYXRpdmVGdW5jdGlvbiIsIngiLCJ0IiwidHlwZU5hbWUiLCJfdHlwZW9mIiwiRXJyb3IiLCJtYXRjaCIsInRvTG93ZXJDYXNlIiwiZiIsInJlUmVnRXhwQ2hhciIsImZ1bmNNYXRjaFN0cmluZyIsIkZ1bmN0aW9uIiwicmVJc05hdGl2ZSIsImlzT2JqZWN0IiwidmFsdWUiLCJ0eXBlIiwiaXNTdHJpbmciLCJTdHJpbmciLCJpc0Zpbml0ZU51bWJlciIsIm4iLCJOdW1iZXIiLCJpc0Zpbml0ZSIsInUiLCJpc0l0ZXJhYmxlIiwiaXNFcnJvciIsImlzUHJvbWlzZSIsInAiLCJ0aGVuIiwiaXNCcm93c2VyIiwid2luZG93IiwidXVpZDQiLCJkIiwibm93IiwidXVpZCIsImMiLCJyIiwiTWF0aCIsInJhbmRvbSIsImZsb29yIiwiTEVWRUxTIiwiZGVidWciLCJpbmZvIiwid2FybmluZyIsImVycm9yIiwiY3JpdGljYWwiLCJzYW5pdGl6ZVVybCIsInVybCIsImJhc2VVcmxQYXJ0cyIsInBhcnNlVXJpIiwiYW5jaG9yIiwic291cmNlIiwicXVlcnkiLCJwYXJzZVVyaU9wdGlvbnMiLCJzdHJpY3RNb2RlIiwicSIsInBhcnNlciIsInN0cmljdCIsImxvb3NlIiwic3RyIiwidW5kZWZpbmVkIiwibyIsIm0iLCJleGVjIiwidXJpIiwibCIsIiQwIiwiJDEiLCIkMiIsImFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoIiwiYWNjZXNzVG9rZW4iLCJvcHRpb25zIiwicGFyYW1zIiwiYWNjZXNzX3Rva2VuIiwicGFyYW1zQXJyYXkiLCJqb2luIiwic29ydCIsInFzIiwiaW5kZXhPZiIsImgiLCJzdWJzdHJpbmciLCJmb3JtYXRVcmwiLCJwcm90b2NvbCIsInBvcnQiLCJob3N0bmFtZSIsImJhY2t1cCIsImpzb25FcnJvciIsImJhY2t1cEVycm9yIiwibWF4Qnl0ZVNpemUiLCJzdHJpbmciLCJjb3VudCIsImNvZGUiLCJjaGFyQ29kZUF0IiwianNvblBhcnNlIiwicyIsIm1ha2VVbmhhbmRsZWRTdGFja0luZm8iLCJtZXNzYWdlIiwibGluZW5vIiwiY29sbm8iLCJtb2RlIiwiYmFja3VwTWVzc2FnZSIsImVycm9yUGFyc2VyIiwibG9jYXRpb24iLCJsaW5lIiwiY29sdW1uIiwiZnVuYyIsImd1ZXNzRnVuY3Rpb25OYW1lIiwiY29udGV4dCIsImdhdGhlckNvbnRleHQiLCJocmVmIiwiZG9jdW1lbnQiLCJ1c2VyYWdlbnQiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJzdGFjayIsIndyYXBDYWxsYmFjayIsImxvZ2dlciIsImVyciIsInJlc3AiLCJub25DaXJjdWxhckNsb25lIiwibmV3U2VlbiIsImluY2x1ZGVzIiwic2xpY2UiLCJjcmVhdGVJdGVtIiwiYXJncyIsIm5vdGlmaWVyIiwicmVxdWVzdEtleXMiLCJsYW1iZGFDb250ZXh0IiwiY3VzdG9tIiwiY2FsbGJhY2siLCJyZXF1ZXN0IiwiYXJnIiwiZXh0cmFBcmdzIiwiZGlhZ25vc3RpYyIsImFyZ1R5cGVzIiwidHlwIiwiRE9NRXhjZXB0aW9uIiwiaiIsImxlbiIsIml0ZW0iLCJ0aW1lc3RhbXAiLCJzZXRDdXN0b21JdGVtS2V5cyIsIl9vcmlnaW5hbEFyZ3MiLCJvcmlnaW5hbF9hcmdfdHlwZXMiLCJsZXZlbCIsInNraXBGcmFtZXMiLCJhZGRFcnJvckNvbnRleHQiLCJlcnJvcnMiLCJjb250ZXh0QWRkZWQiLCJyb2xsYmFyQ29udGV4dCIsImVycm9yX2NvbnRleHQiLCJURUxFTUVUUllfVFlQRVMiLCJURUxFTUVUUllfTEVWRUxTIiwiYXJyYXlJbmNsdWRlcyIsImFyciIsInZhbCIsImNyZWF0ZVRlbGVtZXRyeUV2ZW50IiwibWV0YWRhdGEiLCJldmVudCIsImFkZEl0ZW1BdHRyaWJ1dGVzIiwiYXR0cmlidXRlcyIsIl9pdGVtJGRhdGEkYXR0cmlidXRlcyIsImFwcGx5IiwiX3RvQ29uc3VtYWJsZUFycmF5IiwiZ2V0Iiwic2V0IiwidGVtcCIsInJlcGxhY2VtZW50IiwiZm9ybWF0QXJnc0FzU3RyaW5nIiwic3Vic3RyIiwiRGF0ZSIsImZpbHRlcklwIiwicmVxdWVzdERhdGEiLCJjYXB0dXJlSXAiLCJuZXdJcCIsInBhcnRzIiwicG9wIiwiYmVnaW5uaW5nIiwic2xhc2hJZHgiLCJ0ZXJtaW5hbCIsImNvbmNhdCIsImhhbmRsZU9wdGlvbnMiLCJpbnB1dCIsInBheWxvYWQiLCJ1cGRhdGVEZXByZWNhdGVkT3B0aW9ucyIsIm92ZXJ3cml0ZVNjcnViRmllbGRzIiwiaG9zdFdoaXRlTGlzdCIsImhvc3RTYWZlTGlzdCIsImxvZyIsImhvc3RCbGFja0xpc3QiLCJob3N0QmxvY2tMaXN0IiwiaXNPYmoiLCJpc0FycmF5Iiwic2VlbkluZGV4IiwibWFwcGVkIiwic2FtZSJdLCJzb3VyY2VSb290IjoiIn0=