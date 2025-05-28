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

/***/ "./src/browser/predicates.js":
/*!***********************************!*\
  !*** ./src/browser/predicates.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ../utility */ "./src/utility.js");
function checkIgnore(item, settings) {
  if (_.get(settings, 'plugins.jquery.ignoreAjaxErrors')) {
    return !_.get(item, 'body.message.extra.isAjax');
  }
  return true;
}
module.exports = {
  checkIgnore: checkIgnore
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
/*!*****************************************!*\
  !*** ./test/browser.predicates.test.js ***!
  \*****************************************/
/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var p = __webpack_require__(/*! ../src/browser/predicates */ "./src/browser/predicates.js");

describe('checkIgnore', function () {
  it('should return false if is ajax and ignoring ajax errors is on', function () {
    var item = {
      level: 'critical',
      body: { message: { extra: { isAjax: true } } },
    };
    var settings = {
      reportLevel: 'debug',
      plugins: { jquery: { ignoreAjaxErrors: true } },
    };
    expect(p.checkIgnore(item, settings)).to.not.be.ok();
  });
  it('should return true if is ajax and ignoring ajax errors is off', function () {
    var item = {
      level: 'critical',
      body: { message: { extra: { isAjax: true } } },
    };
    var settings = {
      reportLevel: 'debug',
      plugins: { jquery: { ignoreAjaxErrors: false } },
    };
    expect(p.checkIgnore(item, settings)).to.be.ok();
  });
  it('should return true if is not ajax and ignoring ajax errors is on', function () {
    var item = {
      level: 'critical',
      body: { message: { extra: { isAjax: false } } },
    };
    var settings = {
      reportLevel: 'debug',
      plugins: { jquery: { ignoreAjaxErrors: true } },
    };
    expect(p.checkIgnore(item, settings)).to.be.ok();
  });
  it('should return true if no ajax extra key and ignoring ajax errors is on', function () {
    var item = {
      level: 'critical',
      body: { message: 'a message' },
    };
    var settings = {
      reportLevel: 'debug',
      plugins: { jquery: { ignoreAjaxErrors: true } },
    };
    expect(p.checkIgnore(item, settings)).to.be.ok();
  });
});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QVM7RUFDcEJvRyxXQUFXLEVBQUVBLFdBQVc7RUFDeEI1RixRQUFRLEVBQUVBLFFBQVE7RUFDbEJnQyxLQUFLLEVBQUVBO0FBQ1QsQ0FBQzs7Ozs7O1VDbjBCRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsUUFBUSxtQkFBTyxDQUFDLDhEQUEyQjs7QUFFM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLFdBQVcsU0FBUyxrQkFBa0I7QUFDcEQ7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFVBQVUsMEJBQTBCO0FBQ3JEO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsY0FBYyxXQUFXLFNBQVMsa0JBQWtCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixVQUFVLDJCQUEyQjtBQUN0RDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLGNBQWMsV0FBVyxTQUFTLG1CQUFtQjtBQUNyRDtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsVUFBVSwwQkFBMEI7QUFDckQ7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxjQUFjLHNCQUFzQjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsVUFBVSwwQkFBMEI7QUFDckQ7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcm9sbGJhci93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9icm93c2VyL3ByZWRpY2F0ZXMuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9tZXJnZS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vdGVzdC9icm93c2VyLnByZWRpY2F0ZXMudGVzdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoc2VsZiwgKCkgPT4ge1xucmV0dXJuICIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbGl0eScpO1xuXG5mdW5jdGlvbiBjaGVja0lnbm9yZShpdGVtLCBzZXR0aW5ncykge1xuICBpZiAoXy5nZXQoc2V0dGluZ3MsICdwbHVnaW5zLmpxdWVyeS5pZ25vcmVBamF4RXJyb3JzJykpIHtcbiAgICByZXR1cm4gIV8uZ2V0KGl0ZW0sICdib2R5Lm1lc3NhZ2UuZXh0cmEuaXNBamF4Jyk7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjaGVja0lnbm9yZTogY2hlY2tJZ25vcmUsXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbnZhciBpc1BsYWluT2JqZWN0ID0gZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmopIHtcbiAgaWYgKCFvYmogfHwgdG9TdHIuY2FsbChvYmopICE9PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBoYXNPd25Db25zdHJ1Y3RvciA9IGhhc093bi5jYWxsKG9iaiwgJ2NvbnN0cnVjdG9yJyk7XG4gIHZhciBoYXNJc1Byb3RvdHlwZU9mID1cbiAgICBvYmouY29uc3RydWN0b3IgJiZcbiAgICBvYmouY29uc3RydWN0b3IucHJvdG90eXBlICYmXG4gICAgaGFzT3duLmNhbGwob2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgJ2lzUHJvdG90eXBlT2YnKTtcbiAgLy8gTm90IG93biBjb25zdHJ1Y3RvciBwcm9wZXJ0eSBtdXN0IGJlIE9iamVjdFxuICBpZiAob2JqLmNvbnN0cnVjdG9yICYmICFoYXNPd25Db25zdHJ1Y3RvciAmJiAhaGFzSXNQcm90b3R5cGVPZikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIE93biBwcm9wZXJ0aWVzIGFyZSBlbnVtZXJhdGVkIGZpcnN0bHksIHNvIHRvIHNwZWVkIHVwLFxuICAvLyBpZiBsYXN0IG9uZSBpcyBvd24sIHRoZW4gYWxsIHByb3BlcnRpZXMgYXJlIG93bi5cbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgLyoqL1xuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiBrZXkgPT09ICd1bmRlZmluZWQnIHx8IGhhc093bi5jYWxsKG9iaiwga2V5KTtcbn07XG5cbmZ1bmN0aW9uIG1lcmdlKCkge1xuICB2YXIgaSxcbiAgICBzcmMsXG4gICAgY29weSxcbiAgICBjbG9uZSxcbiAgICBuYW1lLFxuICAgIHJlc3VsdCA9IHt9LFxuICAgIGN1cnJlbnQgPSBudWxsLFxuICAgIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY3VycmVudCA9IGFyZ3VtZW50c1tpXTtcbiAgICBpZiAoY3VycmVudCA9PSBudWxsKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBmb3IgKG5hbWUgaW4gY3VycmVudCkge1xuICAgICAgc3JjID0gcmVzdWx0W25hbWVdO1xuICAgICAgY29weSA9IGN1cnJlbnRbbmFtZV07XG4gICAgICBpZiAocmVzdWx0ICE9PSBjb3B5KSB7XG4gICAgICAgIGlmIChjb3B5ICYmIGlzUGxhaW5PYmplY3QoY29weSkpIHtcbiAgICAgICAgICBjbG9uZSA9IHNyYyAmJiBpc1BsYWluT2JqZWN0KHNyYykgPyBzcmMgOiB7fTtcbiAgICAgICAgICByZXN1bHRbbmFtZV0gPSBtZXJnZShjbG9uZSwgY29weSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvcHkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgcmVzdWx0W25hbWVdID0gY29weTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlO1xuIiwidmFyIG1lcmdlID0gcmVxdWlyZSgnLi9tZXJnZScpO1xuXG52YXIgUm9sbGJhckpTT04gPSB7fTtcbmZ1bmN0aW9uIHNldHVwSlNPTihwb2x5ZmlsbEpTT04pIHtcbiAgaWYgKGlzRnVuY3Rpb24oUm9sbGJhckpTT04uc3RyaW5naWZ5KSAmJiBpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnBhcnNlKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChpc0RlZmluZWQoSlNPTikpIHtcbiAgICAvLyBJZiBwb2x5ZmlsbCBpcyBwcm92aWRlZCwgcHJlZmVyIGl0IG92ZXIgZXhpc3Rpbmcgbm9uLW5hdGl2ZSBzaGltcy5cbiAgICBpZiAocG9seWZpbGxKU09OKSB7XG4gICAgICBpZiAoaXNOYXRpdmVGdW5jdGlvbihKU09OLnN0cmluZ2lmeSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04uc3RyaW5naWZ5ID0gSlNPTi5zdHJpbmdpZnk7XG4gICAgICB9XG4gICAgICBpZiAoaXNOYXRpdmVGdW5jdGlvbihKU09OLnBhcnNlKSkge1xuICAgICAgICBSb2xsYmFySlNPTi5wYXJzZSA9IEpTT04ucGFyc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGVsc2UgYWNjZXB0IGFueSBpbnRlcmZhY2UgdGhhdCBpcyBwcmVzZW50LlxuICAgICAgaWYgKGlzRnVuY3Rpb24oSlNPTi5zdHJpbmdpZnkpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnN0cmluZ2lmeSA9IEpTT04uc3RyaW5naWZ5O1xuICAgICAgfVxuICAgICAgaWYgKGlzRnVuY3Rpb24oSlNPTi5wYXJzZSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04ucGFyc2UgPSBKU09OLnBhcnNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoIWlzRnVuY3Rpb24oUm9sbGJhckpTT04uc3RyaW5naWZ5KSB8fCAhaXNGdW5jdGlvbihSb2xsYmFySlNPTi5wYXJzZSkpIHtcbiAgICBwb2x5ZmlsbEpTT04gJiYgcG9seWZpbGxKU09OKFJvbGxiYXJKU09OKTtcbiAgfVxufVxuXG4vKlxuICogaXNUeXBlIC0gR2l2ZW4gYSBKYXZhc2NyaXB0IHZhbHVlIGFuZCBhIHN0cmluZywgcmV0dXJucyB0cnVlIGlmIHRoZSB0eXBlIG9mIHRoZSB2YWx1ZSBtYXRjaGVzIHRoZVxuICogZ2l2ZW4gc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB4IC0gYW55IHZhbHVlXG4gKiBAcGFyYW0gdCAtIGEgbG93ZXJjYXNlIHN0cmluZyBjb250YWluaW5nIG9uZSBvZiB0aGUgZm9sbG93aW5nIHR5cGUgbmFtZXM6XG4gKiAgICAtIHVuZGVmaW5lZFxuICogICAgLSBudWxsXG4gKiAgICAtIGVycm9yXG4gKiAgICAtIG51bWJlclxuICogICAgLSBib29sZWFuXG4gKiAgICAtIHN0cmluZ1xuICogICAgLSBzeW1ib2xcbiAqICAgIC0gZnVuY3Rpb25cbiAqICAgIC0gb2JqZWN0XG4gKiAgICAtIGFycmF5XG4gKiBAcmV0dXJucyB0cnVlIGlmIHggaXMgb2YgdHlwZSB0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNUeXBlKHgsIHQpIHtcbiAgcmV0dXJuIHQgPT09IHR5cGVOYW1lKHgpO1xufVxuXG4vKlxuICogdHlwZU5hbWUgLSBHaXZlbiBhIEphdmFzY3JpcHQgdmFsdWUsIHJldHVybnMgdGhlIHR5cGUgb2YgdGhlIG9iamVjdCBhcyBhIHN0cmluZ1xuICovXG5mdW5jdGlvbiB0eXBlTmFtZSh4KSB7XG4gIHZhciBuYW1lID0gdHlwZW9mIHg7XG4gIGlmIChuYW1lICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBuYW1lO1xuICB9XG4gIGlmICgheCkge1xuICAgIHJldHVybiAnbnVsbCc7XG4gIH1cbiAgaWYgKHggaW5zdGFuY2VvZiBFcnJvcikge1xuICAgIHJldHVybiAnZXJyb3InO1xuICB9XG4gIHJldHVybiB7fS50b1N0cmluZ1xuICAgIC5jYWxsKHgpXG4gICAgLm1hdGNoKC9cXHMoW2EtekEtWl0rKS8pWzFdXG4gICAgLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8qIGlzRnVuY3Rpb24gLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIGEgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0gZiAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBmIGlzIGEgZnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGYpIHtcbiAgcmV0dXJuIGlzVHlwZShmLCAnZnVuY3Rpb24nKTtcbn1cblxuLyogaXNOYXRpdmVGdW5jdGlvbiAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgYSBuYXRpdmUgSlMgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0gZiAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBmIGlzIGEgbmF0aXZlIEpTIGZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOYXRpdmVGdW5jdGlvbihmKSB7XG4gIHZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG4gIHZhciBmdW5jTWF0Y2hTdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmdcbiAgICAuY2FsbChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KVxuICAgIC5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gICAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpO1xuICB2YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgKyBmdW5jTWF0Y2hTdHJpbmcgKyAnJCcpO1xuICByZXR1cm4gaXNPYmplY3QoZikgJiYgcmVJc05hdGl2ZS50ZXN0KGYpO1xufVxuXG4vKiBpc09iamVjdCAtIENoZWNrcyBpZiB0aGUgYXJndW1lbnQgaXMgYW4gb2JqZWN0XG4gKlxuICogQHBhcmFtIHZhbHVlIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlzIHZhbHVlIGlzIGFuIG9iamVjdCBmdW5jdGlvbiBpcyBhbiBvYmplY3QpXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKiBpc1N0cmluZyAtIENoZWNrcyBpZiB0aGUgYXJndW1lbnQgaXMgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0gdmFsdWUgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgdmFsdWUgaXMgYSBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgdmFsdWUgaW5zdGFuY2VvZiBTdHJpbmc7XG59XG5cbi8qKlxuICogaXNGaW5pdGVOdW1iZXIgLSBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBhIGZpbml0ZSBudW1iZXJcbiAqXG4gKiBAcGFyYW0geyp9IG4gLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgdmFsdWUgaXMgYSBmaW5pdGUgbnVtYmVyXG4gKi9cbmZ1bmN0aW9uIGlzRmluaXRlTnVtYmVyKG4pIHtcbiAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZShuKTtcbn1cblxuLypcbiAqIGlzRGVmaW5lZCAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgbm90IGVxdWFsIHRvIHVuZGVmaW5lZFxuICpcbiAqIEBwYXJhbSB1IC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIHUgaXMgYW55dGhpbmcgb3RoZXIgdGhhbiB1bmRlZmluZWRcbiAqL1xuZnVuY3Rpb24gaXNEZWZpbmVkKHUpIHtcbiAgcmV0dXJuICFpc1R5cGUodSwgJ3VuZGVmaW5lZCcpO1xufVxuXG4vKlxuICogaXNJdGVyYWJsZSAtIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGNhbiBiZSBpdGVyYXRlZCwgZXNzZW50aWFsbHlcbiAqIHdoZXRoZXIgaXQgaXMgYW4gb2JqZWN0IG9yIGFuIGFycmF5LlxuICpcbiAqIEBwYXJhbSBpIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGkgaXMgYW4gb2JqZWN0IG9yIGFuIGFycmF5IGFzIGRldGVybWluZWQgYnkgYHR5cGVOYW1lYFxuICovXG5mdW5jdGlvbiBpc0l0ZXJhYmxlKGkpIHtcbiAgdmFyIHR5cGUgPSB0eXBlTmFtZShpKTtcbiAgcmV0dXJuIHR5cGUgPT09ICdvYmplY3QnIHx8IHR5cGUgPT09ICdhcnJheSc7XG59XG5cbi8qXG4gKiBpc0Vycm9yIC0gY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgb2YgYW4gZXJyb3IgdHlwZVxuICpcbiAqIEBwYXJhbSBlIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGUgaXMgYW4gZXJyb3JcbiAqL1xuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIC8vIERldGVjdCBib3RoIEVycm9yIGFuZCBGaXJlZm94IEV4Y2VwdGlvbiB0eXBlXG4gIHJldHVybiBpc1R5cGUoZSwgJ2Vycm9yJykgfHwgaXNUeXBlKGUsICdleGNlcHRpb24nKTtcbn1cblxuLyogaXNQcm9taXNlIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBhIHByb21pc2VcbiAqXG4gKiBAcGFyYW0gcCAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBmIGlzIGEgZnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1Byb21pc2UocCkge1xuICByZXR1cm4gaXNPYmplY3QocCkgJiYgaXNUeXBlKHAudGhlbiwgJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogaXNCcm93c2VyIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgdGhlIGNvZGUgaXMgcnVubmluZyBpbiBhIGJyb3dzZXJcbiAqXG4gKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBjb2RlIGlzIHJ1bm5pbmcgaW4gYSBicm93c2VyIGVudmlyb25tZW50XG4gKi9cbmZ1bmN0aW9uIGlzQnJvd3NlcigpIHtcbiAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xufVxuXG5mdW5jdGlvbiByZWRhY3QoKSB7XG4gIHJldHVybiAnKioqKioqKionO1xufVxuXG4vLyBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzg4MDk0NzIvMTEzODE5MVxuZnVuY3Rpb24gdXVpZDQoKSB7XG4gIHZhciBkID0gbm93KCk7XG4gIHZhciB1dWlkID0gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZShcbiAgICAvW3h5XS9nLFxuICAgIGZ1bmN0aW9uIChjKSB7XG4gICAgICB2YXIgciA9IChkICsgTWF0aC5yYW5kb20oKSAqIDE2KSAlIDE2IHwgMDtcbiAgICAgIGQgPSBNYXRoLmZsb29yKGQgLyAxNik7XG4gICAgICByZXR1cm4gKGMgPT09ICd4JyA/IHIgOiAociAmIDB4NykgfCAweDgpLnRvU3RyaW5nKDE2KTtcbiAgICB9LFxuICApO1xuICByZXR1cm4gdXVpZDtcbn1cblxudmFyIExFVkVMUyA9IHtcbiAgZGVidWc6IDAsXG4gIGluZm86IDEsXG4gIHdhcm5pbmc6IDIsXG4gIGVycm9yOiAzLFxuICBjcml0aWNhbDogNCxcbn07XG5cbmZ1bmN0aW9uIHNhbml0aXplVXJsKHVybCkge1xuICB2YXIgYmFzZVVybFBhcnRzID0gcGFyc2VVcmkodXJsKTtcbiAgaWYgKCFiYXNlVXJsUGFydHMpIHtcbiAgICByZXR1cm4gJyh1bmtub3duKSc7XG4gIH1cblxuICAvLyByZW1vdmUgYSB0cmFpbGluZyAjIGlmIHRoZXJlIGlzIG5vIGFuY2hvclxuICBpZiAoYmFzZVVybFBhcnRzLmFuY2hvciA9PT0gJycpIHtcbiAgICBiYXNlVXJsUGFydHMuc291cmNlID0gYmFzZVVybFBhcnRzLnNvdXJjZS5yZXBsYWNlKCcjJywgJycpO1xuICB9XG5cbiAgdXJsID0gYmFzZVVybFBhcnRzLnNvdXJjZS5yZXBsYWNlKCc/JyArIGJhc2VVcmxQYXJ0cy5xdWVyeSwgJycpO1xuICByZXR1cm4gdXJsO1xufVxuXG52YXIgcGFyc2VVcmlPcHRpb25zID0ge1xuICBzdHJpY3RNb2RlOiBmYWxzZSxcbiAga2V5OiBbXG4gICAgJ3NvdXJjZScsXG4gICAgJ3Byb3RvY29sJyxcbiAgICAnYXV0aG9yaXR5JyxcbiAgICAndXNlckluZm8nLFxuICAgICd1c2VyJyxcbiAgICAncGFzc3dvcmQnLFxuICAgICdob3N0JyxcbiAgICAncG9ydCcsXG4gICAgJ3JlbGF0aXZlJyxcbiAgICAncGF0aCcsXG4gICAgJ2RpcmVjdG9yeScsXG4gICAgJ2ZpbGUnLFxuICAgICdxdWVyeScsXG4gICAgJ2FuY2hvcicsXG4gIF0sXG4gIHE6IHtcbiAgICBuYW1lOiAncXVlcnlLZXknLFxuICAgIHBhcnNlcjogLyg/Ol58JikoW14mPV0qKT0/KFteJl0qKS9nLFxuICB9LFxuICBwYXJzZXI6IHtcbiAgICBzdHJpY3Q6XG4gICAgICAvXig/OihbXjpcXC8/I10rKTopPyg/OlxcL1xcLygoPzooKFteOkBdKikoPzo6KFteOkBdKikpPyk/QCk/KFteOlxcLz8jXSopKD86OihcXGQqKSk/KSk/KCgoKD86W14/I1xcL10qXFwvKSopKFtePyNdKikpKD86XFw/KFteI10qKSk/KD86IyguKikpPykvLFxuICAgIGxvb3NlOlxuICAgICAgL14oPzooPyFbXjpAXSs6W146QFxcL10qQCkoW146XFwvPyMuXSspOik/KD86XFwvXFwvKT8oKD86KChbXjpAXSopKD86OihbXjpAXSopKT8pP0ApPyhbXjpcXC8/I10qKSg/OjooXFxkKikpPykoKChcXC8oPzpbXj8jXSg/IVtePyNcXC9dKlxcLltePyNcXC8uXSsoPzpbPyNdfCQpKSkqXFwvPyk/KFtePyNcXC9dKikpKD86XFw/KFteI10qKSk/KD86IyguKikpPykvLFxuICB9LFxufTtcblxuZnVuY3Rpb24gcGFyc2VVcmkoc3RyKSB7XG4gIGlmICghaXNUeXBlKHN0ciwgJ3N0cmluZycpKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHZhciBvID0gcGFyc2VVcmlPcHRpb25zO1xuICB2YXIgbSA9IG8ucGFyc2VyW28uc3RyaWN0TW9kZSA/ICdzdHJpY3QnIDogJ2xvb3NlJ10uZXhlYyhzdHIpO1xuICB2YXIgdXJpID0ge307XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBvLmtleS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICB1cmlbby5rZXlbaV1dID0gbVtpXSB8fCAnJztcbiAgfVxuXG4gIHVyaVtvLnEubmFtZV0gPSB7fTtcbiAgdXJpW28ua2V5WzEyXV0ucmVwbGFjZShvLnEucGFyc2VyLCBmdW5jdGlvbiAoJDAsICQxLCAkMikge1xuICAgIGlmICgkMSkge1xuICAgICAgdXJpW28ucS5uYW1lXVskMV0gPSAkMjtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB1cmk7XG59XG5cbmZ1bmN0aW9uIGFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoKGFjY2Vzc1Rva2VuLCBvcHRpb25zLCBwYXJhbXMpIHtcbiAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICBwYXJhbXMuYWNjZXNzX3Rva2VuID0gYWNjZXNzVG9rZW47XG4gIHZhciBwYXJhbXNBcnJheSA9IFtdO1xuICB2YXIgaztcbiAgZm9yIChrIGluIHBhcmFtcykge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyYW1zLCBrKSkge1xuICAgICAgcGFyYW1zQXJyYXkucHVzaChbaywgcGFyYW1zW2tdXS5qb2luKCc9JykpO1xuICAgIH1cbiAgfVxuICB2YXIgcXVlcnkgPSAnPycgKyBwYXJhbXNBcnJheS5zb3J0KCkuam9pbignJicpO1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBvcHRpb25zLnBhdGggPSBvcHRpb25zLnBhdGggfHwgJyc7XG4gIHZhciBxcyA9IG9wdGlvbnMucGF0aC5pbmRleE9mKCc/Jyk7XG4gIHZhciBoID0gb3B0aW9ucy5wYXRoLmluZGV4T2YoJyMnKTtcbiAgdmFyIHA7XG4gIGlmIChxcyAhPT0gLTEgJiYgKGggPT09IC0xIHx8IGggPiBxcykpIHtcbiAgICBwID0gb3B0aW9ucy5wYXRoO1xuICAgIG9wdGlvbnMucGF0aCA9IHAuc3Vic3RyaW5nKDAsIHFzKSArIHF1ZXJ5ICsgJyYnICsgcC5zdWJzdHJpbmcocXMgKyAxKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoaCAhPT0gLTEpIHtcbiAgICAgIHAgPSBvcHRpb25zLnBhdGg7XG4gICAgICBvcHRpb25zLnBhdGggPSBwLnN1YnN0cmluZygwLCBoKSArIHF1ZXJ5ICsgcC5zdWJzdHJpbmcoaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMucGF0aCA9IG9wdGlvbnMucGF0aCArIHF1ZXJ5O1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBmb3JtYXRVcmwodSwgcHJvdG9jb2wpIHtcbiAgcHJvdG9jb2wgPSBwcm90b2NvbCB8fCB1LnByb3RvY29sO1xuICBpZiAoIXByb3RvY29sICYmIHUucG9ydCkge1xuICAgIGlmICh1LnBvcnQgPT09IDgwKSB7XG4gICAgICBwcm90b2NvbCA9ICdodHRwOic7XG4gICAgfSBlbHNlIGlmICh1LnBvcnQgPT09IDQ0Mykge1xuICAgICAgcHJvdG9jb2wgPSAnaHR0cHM6JztcbiAgICB9XG4gIH1cbiAgcHJvdG9jb2wgPSBwcm90b2NvbCB8fCAnaHR0cHM6JztcblxuICBpZiAoIXUuaG9zdG5hbWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2YXIgcmVzdWx0ID0gcHJvdG9jb2wgKyAnLy8nICsgdS5ob3N0bmFtZTtcbiAgaWYgKHUucG9ydCkge1xuICAgIHJlc3VsdCA9IHJlc3VsdCArICc6JyArIHUucG9ydDtcbiAgfVxuICBpZiAodS5wYXRoKSB7XG4gICAgcmVzdWx0ID0gcmVzdWx0ICsgdS5wYXRoO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeShvYmosIGJhY2t1cCkge1xuICB2YXIgdmFsdWUsIGVycm9yO1xuICB0cnkge1xuICAgIHZhbHVlID0gUm9sbGJhckpTT04uc3RyaW5naWZ5KG9iaik7XG4gIH0gY2F0Y2ggKGpzb25FcnJvcikge1xuICAgIGlmIChiYWNrdXAgJiYgaXNGdW5jdGlvbihiYWNrdXApKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IGJhY2t1cChvYmopO1xuICAgICAgfSBjYXRjaCAoYmFja3VwRXJyb3IpIHtcbiAgICAgICAgZXJyb3IgPSBiYWNrdXBFcnJvcjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZXJyb3IgPSBqc29uRXJyb3I7XG4gICAgfVxuICB9XG4gIHJldHVybiB7IGVycm9yOiBlcnJvciwgdmFsdWU6IHZhbHVlIH07XG59XG5cbmZ1bmN0aW9uIG1heEJ5dGVTaXplKHN0cmluZykge1xuICAvLyBUaGUgdHJhbnNwb3J0IHdpbGwgdXNlIHV0Zi04LCBzbyBhc3N1bWUgdXRmLTggZW5jb2RpbmcuXG4gIC8vXG4gIC8vIFRoaXMgbWluaW1hbCBpbXBsZW1lbnRhdGlvbiB3aWxsIGFjY3VyYXRlbHkgY291bnQgYnl0ZXMgZm9yIGFsbCBVQ1MtMiBhbmRcbiAgLy8gc2luZ2xlIGNvZGUgcG9pbnQgVVRGLTE2LiBJZiBwcmVzZW50ZWQgd2l0aCBtdWx0aSBjb2RlIHBvaW50IFVURi0xNixcbiAgLy8gd2hpY2ggc2hvdWxkIGJlIHJhcmUsIGl0IHdpbGwgc2FmZWx5IG92ZXJjb3VudCwgbm90IHVuZGVyY291bnQuXG4gIC8vXG4gIC8vIFdoaWxlIHJvYnVzdCB1dGYtOCBlbmNvZGVycyBleGlzdCwgdGhpcyBpcyBmYXIgc21hbGxlciBhbmQgZmFyIG1vcmUgcGVyZm9ybWFudC5cbiAgLy8gRm9yIHF1aWNrbHkgY291bnRpbmcgcGF5bG9hZCBzaXplIGZvciB0cnVuY2F0aW9uLCBzbWFsbGVyIGlzIGJldHRlci5cblxuICB2YXIgY291bnQgPSAwO1xuICB2YXIgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGNvZGUgPSBzdHJpbmcuY2hhckNvZGVBdChpKTtcbiAgICBpZiAoY29kZSA8IDEyOCkge1xuICAgICAgLy8gdXAgdG8gNyBiaXRzXG4gICAgICBjb3VudCA9IGNvdW50ICsgMTtcbiAgICB9IGVsc2UgaWYgKGNvZGUgPCAyMDQ4KSB7XG4gICAgICAvLyB1cCB0byAxMSBiaXRzXG4gICAgICBjb3VudCA9IGNvdW50ICsgMjtcbiAgICB9IGVsc2UgaWYgKGNvZGUgPCA2NTUzNikge1xuICAgICAgLy8gdXAgdG8gMTYgYml0c1xuICAgICAgY291bnQgPSBjb3VudCArIDM7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvdW50O1xufVxuXG5mdW5jdGlvbiBqc29uUGFyc2Uocykge1xuICB2YXIgdmFsdWUsIGVycm9yO1xuICB0cnkge1xuICAgIHZhbHVlID0gUm9sbGJhckpTT04ucGFyc2Uocyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBlcnJvciA9IGU7XG4gIH1cbiAgcmV0dXJuIHsgZXJyb3I6IGVycm9yLCB2YWx1ZTogdmFsdWUgfTtcbn1cblxuZnVuY3Rpb24gbWFrZVVuaGFuZGxlZFN0YWNrSW5mbyhcbiAgbWVzc2FnZSxcbiAgdXJsLFxuICBsaW5lbm8sXG4gIGNvbG5vLFxuICBlcnJvcixcbiAgbW9kZSxcbiAgYmFja3VwTWVzc2FnZSxcbiAgZXJyb3JQYXJzZXIsXG4pIHtcbiAgdmFyIGxvY2F0aW9uID0ge1xuICAgIHVybDogdXJsIHx8ICcnLFxuICAgIGxpbmU6IGxpbmVubyxcbiAgICBjb2x1bW46IGNvbG5vLFxuICB9O1xuICBsb2NhdGlvbi5mdW5jID0gZXJyb3JQYXJzZXIuZ3Vlc3NGdW5jdGlvbk5hbWUobG9jYXRpb24udXJsLCBsb2NhdGlvbi5saW5lKTtcbiAgbG9jYXRpb24uY29udGV4dCA9IGVycm9yUGFyc2VyLmdhdGhlckNvbnRleHQobG9jYXRpb24udXJsLCBsb2NhdGlvbi5saW5lKTtcbiAgdmFyIGhyZWYgPVxuICAgIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICBkb2N1bWVudCAmJlxuICAgIGRvY3VtZW50LmxvY2F0aW9uICYmXG4gICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZjtcbiAgdmFyIHVzZXJhZ2VudCA9XG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB3aW5kb3cgJiZcbiAgICB3aW5kb3cubmF2aWdhdG9yICYmXG4gICAgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gIHJldHVybiB7XG4gICAgbW9kZTogbW9kZSxcbiAgICBtZXNzYWdlOiBlcnJvciA/IFN0cmluZyhlcnJvcikgOiBtZXNzYWdlIHx8IGJhY2t1cE1lc3NhZ2UsXG4gICAgdXJsOiBocmVmLFxuICAgIHN0YWNrOiBbbG9jYXRpb25dLFxuICAgIHVzZXJhZ2VudDogdXNlcmFnZW50LFxuICB9O1xufVxuXG5mdW5jdGlvbiB3cmFwQ2FsbGJhY2sobG9nZ2VyLCBmKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgdHJ5IHtcbiAgICAgIGYoZXJyLCByZXNwKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoZSk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBub25DaXJjdWxhckNsb25lKG9iaikge1xuICB2YXIgc2VlbiA9IFtvYmpdO1xuXG4gIGZ1bmN0aW9uIGNsb25lKG9iaiwgc2Vlbikge1xuICAgIHZhciB2YWx1ZSxcbiAgICAgIG5hbWUsXG4gICAgICBuZXdTZWVuLFxuICAgICAgcmVzdWx0ID0ge307XG5cbiAgICB0cnkge1xuICAgICAgZm9yIChuYW1lIGluIG9iaikge1xuICAgICAgICB2YWx1ZSA9IG9ialtuYW1lXTtcblxuICAgICAgICBpZiAodmFsdWUgJiYgKGlzVHlwZSh2YWx1ZSwgJ29iamVjdCcpIHx8IGlzVHlwZSh2YWx1ZSwgJ2FycmF5JykpKSB7XG4gICAgICAgICAgaWYgKHNlZW4uaW5jbHVkZXModmFsdWUpKSB7XG4gICAgICAgICAgICByZXN1bHRbbmFtZV0gPSAnUmVtb3ZlZCBjaXJjdWxhciByZWZlcmVuY2U6ICcgKyB0eXBlTmFtZSh2YWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld1NlZW4gPSBzZWVuLnNsaWNlKCk7XG4gICAgICAgICAgICBuZXdTZWVuLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgcmVzdWx0W25hbWVdID0gY2xvbmUodmFsdWUsIG5ld1NlZW4pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdFtuYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlc3VsdCA9ICdGYWlsZWQgY2xvbmluZyBjdXN0b20gZGF0YTogJyArIGUubWVzc2FnZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICByZXR1cm4gY2xvbmUob2JqLCBzZWVuKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlSXRlbShhcmdzLCBsb2dnZXIsIG5vdGlmaWVyLCByZXF1ZXN0S2V5cywgbGFtYmRhQ29udGV4dCkge1xuICB2YXIgbWVzc2FnZSwgZXJyLCBjdXN0b20sIGNhbGxiYWNrLCByZXF1ZXN0O1xuICB2YXIgYXJnO1xuICB2YXIgZXh0cmFBcmdzID0gW107XG4gIHZhciBkaWFnbm9zdGljID0ge307XG4gIHZhciBhcmdUeXBlcyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJncy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBhcmcgPSBhcmdzW2ldO1xuXG4gICAgdmFyIHR5cCA9IHR5cGVOYW1lKGFyZyk7XG4gICAgYXJnVHlwZXMucHVzaCh0eXApO1xuICAgIHN3aXRjaCAodHlwKSB7XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIG1lc3NhZ2UgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKG1lc3NhZ2UgPSBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgY2FsbGJhY2sgPSB3cmFwQ2FsbGJhY2sobG9nZ2VyLCBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICBleHRyYUFyZ3MucHVzaChhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgIGNhc2UgJ2RvbWV4Y2VwdGlvbic6XG4gICAgICBjYXNlICdleGNlcHRpb24nOiAvLyBGaXJlZm94IEV4Y2VwdGlvbiB0eXBlXG4gICAgICAgIGVyciA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoZXJyID0gYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgY2FzZSAnYXJyYXknOlxuICAgICAgICBpZiAoXG4gICAgICAgICAgYXJnIGluc3RhbmNlb2YgRXJyb3IgfHxcbiAgICAgICAgICAodHlwZW9mIERPTUV4Y2VwdGlvbiAhPT0gJ3VuZGVmaW5lZCcgJiYgYXJnIGluc3RhbmNlb2YgRE9NRXhjZXB0aW9uKVxuICAgICAgICApIHtcbiAgICAgICAgICBlcnIgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGVyciA9IGFyZyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlcXVlc3RLZXlzICYmIHR5cCA9PT0gJ29iamVjdCcgJiYgIXJlcXVlc3QpIHtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMCwgbGVuID0gcmVxdWVzdEtleXMubGVuZ3RoOyBqIDwgbGVuOyArK2opIHtcbiAgICAgICAgICAgIGlmIChhcmdbcmVxdWVzdEtleXNbal1dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgcmVxdWVzdCA9IGFyZztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXF1ZXN0KSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY3VzdG9tID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChjdXN0b20gPSBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChcbiAgICAgICAgICBhcmcgaW5zdGFuY2VvZiBFcnJvciB8fFxuICAgICAgICAgICh0eXBlb2YgRE9NRXhjZXB0aW9uICE9PSAndW5kZWZpbmVkJyAmJiBhcmcgaW5zdGFuY2VvZiBET01FeGNlcHRpb24pXG4gICAgICAgICkge1xuICAgICAgICAgIGVyciA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoZXJyID0gYXJnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBleHRyYUFyZ3MucHVzaChhcmcpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIGN1c3RvbSBpcyBhbiBhcnJheSB0aGlzIHR1cm5zIGl0IGludG8gYW4gb2JqZWN0IHdpdGggaW50ZWdlciBrZXlzXG4gIGlmIChjdXN0b20pIGN1c3RvbSA9IG5vbkNpcmN1bGFyQ2xvbmUoY3VzdG9tKTtcblxuICBpZiAoZXh0cmFBcmdzLmxlbmd0aCA+IDApIHtcbiAgICBpZiAoIWN1c3RvbSkgY3VzdG9tID0gbm9uQ2lyY3VsYXJDbG9uZSh7fSk7XG4gICAgY3VzdG9tLmV4dHJhQXJncyA9IG5vbkNpcmN1bGFyQ2xvbmUoZXh0cmFBcmdzKTtcbiAgfVxuXG4gIHZhciBpdGVtID0ge1xuICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgZXJyOiBlcnIsXG4gICAgY3VzdG9tOiBjdXN0b20sXG4gICAgdGltZXN0YW1wOiBub3coKSxcbiAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgbm90aWZpZXI6IG5vdGlmaWVyLFxuICAgIGRpYWdub3N0aWM6IGRpYWdub3N0aWMsXG4gICAgdXVpZDogdXVpZDQoKSxcbiAgfTtcblxuICBpdGVtLmRhdGEgPSBpdGVtLmRhdGEgfHwge307XG5cbiAgc2V0Q3VzdG9tSXRlbUtleXMoaXRlbSwgY3VzdG9tKTtcblxuICBpZiAocmVxdWVzdEtleXMgJiYgcmVxdWVzdCkge1xuICAgIGl0ZW0ucmVxdWVzdCA9IHJlcXVlc3Q7XG4gIH1cbiAgaWYgKGxhbWJkYUNvbnRleHQpIHtcbiAgICBpdGVtLmxhbWJkYUNvbnRleHQgPSBsYW1iZGFDb250ZXh0O1xuICB9XG4gIGl0ZW0uX29yaWdpbmFsQXJncyA9IGFyZ3M7XG4gIGl0ZW0uZGlhZ25vc3RpYy5vcmlnaW5hbF9hcmdfdHlwZXMgPSBhcmdUeXBlcztcbiAgcmV0dXJuIGl0ZW07XG59XG5cbmZ1bmN0aW9uIHNldEN1c3RvbUl0ZW1LZXlzKGl0ZW0sIGN1c3RvbSkge1xuICBpZiAoY3VzdG9tICYmIGN1c3RvbS5sZXZlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaXRlbS5sZXZlbCA9IGN1c3RvbS5sZXZlbDtcbiAgICBkZWxldGUgY3VzdG9tLmxldmVsO1xuICB9XG4gIGlmIChjdXN0b20gJiYgY3VzdG9tLnNraXBGcmFtZXMgIT09IHVuZGVmaW5lZCkge1xuICAgIGl0ZW0uc2tpcEZyYW1lcyA9IGN1c3RvbS5za2lwRnJhbWVzO1xuICAgIGRlbGV0ZSBjdXN0b20uc2tpcEZyYW1lcztcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRFcnJvckNvbnRleHQoaXRlbSwgZXJyb3JzKSB7XG4gIHZhciBjdXN0b20gPSBpdGVtLmRhdGEuY3VzdG9tIHx8IHt9O1xuICB2YXIgY29udGV4dEFkZGVkID0gZmFsc2U7XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVycm9ycy5sZW5ndGg7ICsraSkge1xuICAgICAgaWYgKGVycm9yc1tpXS5oYXNPd25Qcm9wZXJ0eSgncm9sbGJhckNvbnRleHQnKSkge1xuICAgICAgICBjdXN0b20gPSBtZXJnZShjdXN0b20sIG5vbkNpcmN1bGFyQ2xvbmUoZXJyb3JzW2ldLnJvbGxiYXJDb250ZXh0KSk7XG4gICAgICAgIGNvbnRleHRBZGRlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXZvaWQgYWRkaW5nIGFuIGVtcHR5IG9iamVjdCB0byB0aGUgZGF0YS5cbiAgICBpZiAoY29udGV4dEFkZGVkKSB7XG4gICAgICBpdGVtLmRhdGEuY3VzdG9tID0gY3VzdG9tO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGl0ZW0uZGlhZ25vc3RpYy5lcnJvcl9jb250ZXh0ID0gJ0ZhaWxlZDogJyArIGUubWVzc2FnZTtcbiAgfVxufVxuXG52YXIgVEVMRU1FVFJZX1RZUEVTID0gW1xuICAnbG9nJyxcbiAgJ25ldHdvcmsnLFxuICAnZG9tJyxcbiAgJ25hdmlnYXRpb24nLFxuICAnZXJyb3InLFxuICAnbWFudWFsJyxcbl07XG52YXIgVEVMRU1FVFJZX0xFVkVMUyA9IFsnY3JpdGljYWwnLCAnZXJyb3InLCAnd2FybmluZycsICdpbmZvJywgJ2RlYnVnJ107XG5cbmZ1bmN0aW9uIGFycmF5SW5jbHVkZXMoYXJyLCB2YWwpIHtcbiAgZm9yICh2YXIgayA9IDA7IGsgPCBhcnIubGVuZ3RoOyArK2spIHtcbiAgICBpZiAoYXJyW2tdID09PSB2YWwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVGVsZW1ldHJ5RXZlbnQoYXJncykge1xuICB2YXIgdHlwZSwgbWV0YWRhdGEsIGxldmVsO1xuICB2YXIgYXJnO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJncy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBhcmcgPSBhcmdzW2ldO1xuXG4gICAgdmFyIHR5cCA9IHR5cGVOYW1lKGFyZyk7XG4gICAgc3dpdGNoICh0eXApIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIGlmICghdHlwZSAmJiBhcnJheUluY2x1ZGVzKFRFTEVNRVRSWV9UWVBFUywgYXJnKSkge1xuICAgICAgICAgIHR5cGUgPSBhcmc7XG4gICAgICAgIH0gZWxzZSBpZiAoIWxldmVsICYmIGFycmF5SW5jbHVkZXMoVEVMRU1FVFJZX0xFVkVMUywgYXJnKSkge1xuICAgICAgICAgIGxldmVsID0gYXJnO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgbWV0YWRhdGEgPSBhcmc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHZhciBldmVudCA9IHtcbiAgICB0eXBlOiB0eXBlIHx8ICdtYW51YWwnLFxuICAgIG1ldGFkYXRhOiBtZXRhZGF0YSB8fCB7fSxcbiAgICBsZXZlbDogbGV2ZWwsXG4gIH07XG5cbiAgcmV0dXJuIGV2ZW50O1xufVxuXG5mdW5jdGlvbiBhZGRJdGVtQXR0cmlidXRlcyhpdGVtLCBhdHRyaWJ1dGVzKSB7XG4gIGl0ZW0uZGF0YS5hdHRyaWJ1dGVzID0gaXRlbS5kYXRhLmF0dHJpYnV0ZXMgfHwgW107XG4gIGlmIChhdHRyaWJ1dGVzKSB7XG4gICAgaXRlbS5kYXRhLmF0dHJpYnV0ZXMucHVzaCguLi5hdHRyaWJ1dGVzKTtcbiAgfVxufVxuXG4vKlxuICogZ2V0IC0gZ2l2ZW4gYW4gb2JqL2FycmF5IGFuZCBhIGtleXBhdGgsIHJldHVybiB0aGUgdmFsdWUgYXQgdGhhdCBrZXlwYXRoIG9yXG4gKiAgICAgICB1bmRlZmluZWQgaWYgbm90IHBvc3NpYmxlLlxuICpcbiAqIEBwYXJhbSBvYmogLSBhbiBvYmplY3Qgb3IgYXJyYXlcbiAqIEBwYXJhbSBwYXRoIC0gYSBzdHJpbmcgb2Yga2V5cyBzZXBhcmF0ZWQgYnkgJy4nIHN1Y2ggYXMgJ3BsdWdpbi5qcXVlcnkuMC5tZXNzYWdlJ1xuICogICAgd2hpY2ggd291bGQgY29ycmVzcG9uZCB0byA0MiBpbiBge3BsdWdpbjoge2pxdWVyeTogW3ttZXNzYWdlOiA0Mn1dfX1gXG4gKi9cbmZ1bmN0aW9uIGdldChvYmosIHBhdGgpIHtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHZhciBrZXlzID0gcGF0aC5zcGxpdCgnLicpO1xuICB2YXIgcmVzdWx0ID0gb2JqO1xuICB0cnkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBrZXlzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICByZXN1bHQgPSByZXN1bHRba2V5c1tpXV07XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgcmVzdWx0ID0gdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHNldChvYmosIHBhdGgsIHZhbHVlKSB7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBrZXlzID0gcGF0aC5zcGxpdCgnLicpO1xuICB2YXIgbGVuID0ga2V5cy5sZW5ndGg7XG4gIGlmIChsZW4gPCAxKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChsZW4gPT09IDEpIHtcbiAgICBvYmpba2V5c1swXV0gPSB2YWx1ZTtcbiAgICByZXR1cm47XG4gIH1cbiAgdHJ5IHtcbiAgICB2YXIgdGVtcCA9IG9ialtrZXlzWzBdXSB8fCB7fTtcbiAgICB2YXIgcmVwbGFjZW1lbnQgPSB0ZW1wO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbGVuIC0gMTsgKytpKSB7XG4gICAgICB0ZW1wW2tleXNbaV1dID0gdGVtcFtrZXlzW2ldXSB8fCB7fTtcbiAgICAgIHRlbXAgPSB0ZW1wW2tleXNbaV1dO1xuICAgIH1cbiAgICB0ZW1wW2tleXNbbGVuIC0gMV1dID0gdmFsdWU7XG4gICAgb2JqW2tleXNbMF1dID0gcmVwbGFjZW1lbnQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm47XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0QXJnc0FzU3RyaW5nKGFyZ3MpIHtcbiAgdmFyIGksIGxlbiwgYXJnO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAoaSA9IDAsIGxlbiA9IGFyZ3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBhcmcgPSBhcmdzW2ldO1xuICAgIHN3aXRjaCAodHlwZU5hbWUoYXJnKSkge1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgYXJnID0gc3RyaW5naWZ5KGFyZyk7XG4gICAgICAgIGFyZyA9IGFyZy5lcnJvciB8fCBhcmcudmFsdWU7XG4gICAgICAgIGlmIChhcmcubGVuZ3RoID4gNTAwKSB7XG4gICAgICAgICAgYXJnID0gYXJnLnN1YnN0cigwLCA0OTcpICsgJy4uLic7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdudWxsJzpcbiAgICAgICAgYXJnID0gJ251bGwnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgIGFyZyA9ICd1bmRlZmluZWQnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N5bWJvbCc6XG4gICAgICAgIGFyZyA9IGFyZy50b1N0cmluZygpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmVzdWx0LnB1c2goYXJnKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0LmpvaW4oJyAnKTtcbn1cblxuZnVuY3Rpb24gbm93KCkge1xuICBpZiAoRGF0ZS5ub3cpIHtcbiAgICByZXR1cm4gK0RhdGUubm93KCk7XG4gIH1cbiAgcmV0dXJuICtuZXcgRGF0ZSgpO1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJJcChyZXF1ZXN0RGF0YSwgY2FwdHVyZUlwKSB7XG4gIGlmICghcmVxdWVzdERhdGEgfHwgIXJlcXVlc3REYXRhWyd1c2VyX2lwJ10gfHwgY2FwdHVyZUlwID09PSB0cnVlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuZXdJcCA9IHJlcXVlc3REYXRhWyd1c2VyX2lwJ107XG4gIGlmICghY2FwdHVyZUlwKSB7XG4gICAgbmV3SXAgPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIHRyeSB7XG4gICAgICB2YXIgcGFydHM7XG4gICAgICBpZiAobmV3SXAuaW5kZXhPZignLicpICE9PSAtMSkge1xuICAgICAgICBwYXJ0cyA9IG5ld0lwLnNwbGl0KCcuJyk7XG4gICAgICAgIHBhcnRzLnBvcCgpO1xuICAgICAgICBwYXJ0cy5wdXNoKCcwJyk7XG4gICAgICAgIG5ld0lwID0gcGFydHMuam9pbignLicpO1xuICAgICAgfSBlbHNlIGlmIChuZXdJcC5pbmRleE9mKCc6JykgIT09IC0xKSB7XG4gICAgICAgIHBhcnRzID0gbmV3SXAuc3BsaXQoJzonKTtcbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICB2YXIgYmVnaW5uaW5nID0gcGFydHMuc2xpY2UoMCwgMyk7XG4gICAgICAgICAgdmFyIHNsYXNoSWR4ID0gYmVnaW5uaW5nWzJdLmluZGV4T2YoJy8nKTtcbiAgICAgICAgICBpZiAoc2xhc2hJZHggIT09IC0xKSB7XG4gICAgICAgICAgICBiZWdpbm5pbmdbMl0gPSBiZWdpbm5pbmdbMl0uc3Vic3RyaW5nKDAsIHNsYXNoSWR4KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHRlcm1pbmFsID0gJzAwMDA6MDAwMDowMDAwOjAwMDA6MDAwMCc7XG4gICAgICAgICAgbmV3SXAgPSBiZWdpbm5pbmcuY29uY2F0KHRlcm1pbmFsKS5qb2luKCc6Jyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0lwID0gbnVsbDtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBuZXdJcCA9IG51bGw7XG4gICAgfVxuICB9XG4gIHJlcXVlc3REYXRhWyd1c2VyX2lwJ10gPSBuZXdJcDtcbn1cblxuZnVuY3Rpb24gaGFuZGxlT3B0aW9ucyhjdXJyZW50LCBpbnB1dCwgcGF5bG9hZCwgbG9nZ2VyKSB7XG4gIHZhciByZXN1bHQgPSBtZXJnZShjdXJyZW50LCBpbnB1dCwgcGF5bG9hZCk7XG4gIHJlc3VsdCA9IHVwZGF0ZURlcHJlY2F0ZWRPcHRpb25zKHJlc3VsdCwgbG9nZ2VyKTtcbiAgaWYgKCFpbnB1dCB8fCBpbnB1dC5vdmVyd3JpdGVTY3J1YkZpZWxkcykge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgaWYgKGlucHV0LnNjcnViRmllbGRzKSB7XG4gICAgcmVzdWx0LnNjcnViRmllbGRzID0gKGN1cnJlbnQuc2NydWJGaWVsZHMgfHwgW10pLmNvbmNhdChpbnB1dC5zY3J1YkZpZWxkcyk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlRGVwcmVjYXRlZE9wdGlvbnMob3B0aW9ucywgbG9nZ2VyKSB7XG4gIGlmIChvcHRpb25zLmhvc3RXaGl0ZUxpc3QgJiYgIW9wdGlvbnMuaG9zdFNhZmVMaXN0KSB7XG4gICAgb3B0aW9ucy5ob3N0U2FmZUxpc3QgPSBvcHRpb25zLmhvc3RXaGl0ZUxpc3Q7XG4gICAgb3B0aW9ucy5ob3N0V2hpdGVMaXN0ID0gdW5kZWZpbmVkO1xuICAgIGxvZ2dlciAmJiBsb2dnZXIubG9nKCdob3N0V2hpdGVMaXN0IGlzIGRlcHJlY2F0ZWQuIFVzZSBob3N0U2FmZUxpc3QuJyk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaG9zdEJsYWNrTGlzdCAmJiAhb3B0aW9ucy5ob3N0QmxvY2tMaXN0KSB7XG4gICAgb3B0aW9ucy5ob3N0QmxvY2tMaXN0ID0gb3B0aW9ucy5ob3N0QmxhY2tMaXN0O1xuICAgIG9wdGlvbnMuaG9zdEJsYWNrTGlzdCA9IHVuZGVmaW5lZDtcbiAgICBsb2dnZXIgJiYgbG9nZ2VyLmxvZygnaG9zdEJsYWNrTGlzdCBpcyBkZXByZWNhdGVkLiBVc2UgaG9zdEJsb2NrTGlzdC4nKTtcbiAgfVxuICByZXR1cm4gb3B0aW9ucztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoOiBhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aCxcbiAgY3JlYXRlSXRlbTogY3JlYXRlSXRlbSxcbiAgYWRkRXJyb3JDb250ZXh0OiBhZGRFcnJvckNvbnRleHQsXG4gIGNyZWF0ZVRlbGVtZXRyeUV2ZW50OiBjcmVhdGVUZWxlbWV0cnlFdmVudCxcbiAgYWRkSXRlbUF0dHJpYnV0ZXM6IGFkZEl0ZW1BdHRyaWJ1dGVzLFxuICBmaWx0ZXJJcDogZmlsdGVySXAsXG4gIGZvcm1hdEFyZ3NBc1N0cmluZzogZm9ybWF0QXJnc0FzU3RyaW5nLFxuICBmb3JtYXRVcmw6IGZvcm1hdFVybCxcbiAgZ2V0OiBnZXQsXG4gIGhhbmRsZU9wdGlvbnM6IGhhbmRsZU9wdGlvbnMsXG4gIGlzRXJyb3I6IGlzRXJyb3IsXG4gIGlzRmluaXRlTnVtYmVyOiBpc0Zpbml0ZU51bWJlcixcbiAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgaXNJdGVyYWJsZTogaXNJdGVyYWJsZSxcbiAgaXNOYXRpdmVGdW5jdGlvbjogaXNOYXRpdmVGdW5jdGlvbixcbiAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICBpc1N0cmluZzogaXNTdHJpbmcsXG4gIGlzVHlwZTogaXNUeXBlLFxuICBpc1Byb21pc2U6IGlzUHJvbWlzZSxcbiAgaXNCcm93c2VyOiBpc0Jyb3dzZXIsXG4gIGpzb25QYXJzZToganNvblBhcnNlLFxuICBMRVZFTFM6IExFVkVMUyxcbiAgbWFrZVVuaGFuZGxlZFN0YWNrSW5mbzogbWFrZVVuaGFuZGxlZFN0YWNrSW5mbyxcbiAgbWVyZ2U6IG1lcmdlLFxuICBub3c6IG5vdyxcbiAgcmVkYWN0OiByZWRhY3QsXG4gIFJvbGxiYXJKU09OOiBSb2xsYmFySlNPTixcbiAgc2FuaXRpemVVcmw6IHNhbml0aXplVXJsLFxuICBzZXQ6IHNldCxcbiAgc2V0dXBKU09OOiBzZXR1cEpTT04sXG4gIHN0cmluZ2lmeTogc3RyaW5naWZ5LFxuICBtYXhCeXRlU2l6ZTogbWF4Qnl0ZVNpemUsXG4gIHR5cGVOYW1lOiB0eXBlTmFtZSxcbiAgdXVpZDQ6IHV1aWQ0LFxufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvKiBnbG9iYWxzIGV4cGVjdCAqL1xuLyogZ2xvYmFscyBkZXNjcmliZSAqL1xuLyogZ2xvYmFscyBpdCAqL1xuLyogZ2xvYmFscyBzaW5vbiAqL1xuXG52YXIgcCA9IHJlcXVpcmUoJy4uL3NyYy9icm93c2VyL3ByZWRpY2F0ZXMnKTtcblxuZGVzY3JpYmUoJ2NoZWNrSWdub3JlJywgZnVuY3Rpb24gKCkge1xuICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSBpZiBpcyBhamF4IGFuZCBpZ25vcmluZyBhamF4IGVycm9ycyBpcyBvbicsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXRlbSA9IHtcbiAgICAgIGxldmVsOiAnY3JpdGljYWwnLFxuICAgICAgYm9keTogeyBtZXNzYWdlOiB7IGV4dHJhOiB7IGlzQWpheDogdHJ1ZSB9IH0gfSxcbiAgICB9O1xuICAgIHZhciBzZXR0aW5ncyA9IHtcbiAgICAgIHJlcG9ydExldmVsOiAnZGVidWcnLFxuICAgICAgcGx1Z2luczogeyBqcXVlcnk6IHsgaWdub3JlQWpheEVycm9yczogdHJ1ZSB9IH0sXG4gICAgfTtcbiAgICBleHBlY3QocC5jaGVja0lnbm9yZShpdGVtLCBzZXR0aW5ncykpLnRvLm5vdC5iZS5vaygpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBpZiBpcyBhamF4IGFuZCBpZ25vcmluZyBhamF4IGVycm9ycyBpcyBvZmYnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGl0ZW0gPSB7XG4gICAgICBsZXZlbDogJ2NyaXRpY2FsJyxcbiAgICAgIGJvZHk6IHsgbWVzc2FnZTogeyBleHRyYTogeyBpc0FqYXg6IHRydWUgfSB9IH0sXG4gICAgfTtcbiAgICB2YXIgc2V0dGluZ3MgPSB7XG4gICAgICByZXBvcnRMZXZlbDogJ2RlYnVnJyxcbiAgICAgIHBsdWdpbnM6IHsganF1ZXJ5OiB7IGlnbm9yZUFqYXhFcnJvcnM6IGZhbHNlIH0gfSxcbiAgICB9O1xuICAgIGV4cGVjdChwLmNoZWNrSWdub3JlKGl0ZW0sIHNldHRpbmdzKSkudG8uYmUub2soKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgaWYgaXMgbm90IGFqYXggYW5kIGlnbm9yaW5nIGFqYXggZXJyb3JzIGlzIG9uJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBpdGVtID0ge1xuICAgICAgbGV2ZWw6ICdjcml0aWNhbCcsXG4gICAgICBib2R5OiB7IG1lc3NhZ2U6IHsgZXh0cmE6IHsgaXNBamF4OiBmYWxzZSB9IH0gfSxcbiAgICB9O1xuICAgIHZhciBzZXR0aW5ncyA9IHtcbiAgICAgIHJlcG9ydExldmVsOiAnZGVidWcnLFxuICAgICAgcGx1Z2luczogeyBqcXVlcnk6IHsgaWdub3JlQWpheEVycm9yczogdHJ1ZSB9IH0sXG4gICAgfTtcbiAgICBleHBlY3QocC5jaGVja0lnbm9yZShpdGVtLCBzZXR0aW5ncykpLnRvLmJlLm9rKCk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGlmIG5vIGFqYXggZXh0cmEga2V5IGFuZCBpZ25vcmluZyBhamF4IGVycm9ycyBpcyBvbicsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXRlbSA9IHtcbiAgICAgIGxldmVsOiAnY3JpdGljYWwnLFxuICAgICAgYm9keTogeyBtZXNzYWdlOiAnYSBtZXNzYWdlJyB9LFxuICAgIH07XG4gICAgdmFyIHNldHRpbmdzID0ge1xuICAgICAgcmVwb3J0TGV2ZWw6ICdkZWJ1ZycsXG4gICAgICBwbHVnaW5zOiB7IGpxdWVyeTogeyBpZ25vcmVBamF4RXJyb3JzOiB0cnVlIH0gfSxcbiAgICB9O1xuICAgIGV4cGVjdChwLmNoZWNrSWdub3JlKGl0ZW0sIHNldHRpbmdzKSkudG8uYmUub2soKTtcbiAgfSk7XG59KTtcbiJdLCJuYW1lcyI6WyJfIiwicmVxdWlyZSIsImNoZWNrSWdub3JlIiwiaXRlbSIsInNldHRpbmdzIiwiZ2V0IiwibW9kdWxlIiwiZXhwb3J0cyIsImhhc093biIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwidG9TdHIiLCJ0b1N0cmluZyIsImlzUGxhaW5PYmplY3QiLCJvYmoiLCJjYWxsIiwiaGFzT3duQ29uc3RydWN0b3IiLCJoYXNJc1Byb3RvdHlwZU9mIiwiY29uc3RydWN0b3IiLCJrZXkiLCJtZXJnZSIsImkiLCJzcmMiLCJjb3B5IiwiY2xvbmUiLCJuYW1lIiwicmVzdWx0IiwiY3VycmVudCIsImxlbmd0aCIsImFyZ3VtZW50cyIsIlJvbGxiYXJKU09OIiwic2V0dXBKU09OIiwicG9seWZpbGxKU09OIiwiaXNGdW5jdGlvbiIsInN0cmluZ2lmeSIsInBhcnNlIiwiaXNEZWZpbmVkIiwiSlNPTiIsImlzTmF0aXZlRnVuY3Rpb24iLCJpc1R5cGUiLCJ4IiwidCIsInR5cGVOYW1lIiwiX3R5cGVvZiIsIkVycm9yIiwibWF0Y2giLCJ0b0xvd2VyQ2FzZSIsImYiLCJyZVJlZ0V4cENoYXIiLCJmdW5jTWF0Y2hTdHJpbmciLCJGdW5jdGlvbiIsInJlcGxhY2UiLCJyZUlzTmF0aXZlIiwiUmVnRXhwIiwiaXNPYmplY3QiLCJ0ZXN0IiwidmFsdWUiLCJ0eXBlIiwiaXNTdHJpbmciLCJTdHJpbmciLCJpc0Zpbml0ZU51bWJlciIsIm4iLCJOdW1iZXIiLCJpc0Zpbml0ZSIsInUiLCJpc0l0ZXJhYmxlIiwiaXNFcnJvciIsImUiLCJpc1Byb21pc2UiLCJwIiwidGhlbiIsImlzQnJvd3NlciIsIndpbmRvdyIsInJlZGFjdCIsInV1aWQ0IiwiZCIsIm5vdyIsInV1aWQiLCJjIiwiciIsIk1hdGgiLCJyYW5kb20iLCJmbG9vciIsIkxFVkVMUyIsImRlYnVnIiwiaW5mbyIsIndhcm5pbmciLCJlcnJvciIsImNyaXRpY2FsIiwic2FuaXRpemVVcmwiLCJ1cmwiLCJiYXNlVXJsUGFydHMiLCJwYXJzZVVyaSIsImFuY2hvciIsInNvdXJjZSIsInF1ZXJ5IiwicGFyc2VVcmlPcHRpb25zIiwic3RyaWN0TW9kZSIsInEiLCJwYXJzZXIiLCJzdHJpY3QiLCJsb29zZSIsInN0ciIsInVuZGVmaW5lZCIsIm8iLCJtIiwiZXhlYyIsInVyaSIsImwiLCIkMCIsIiQxIiwiJDIiLCJhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aCIsImFjY2Vzc1Rva2VuIiwib3B0aW9ucyIsInBhcmFtcyIsImFjY2Vzc190b2tlbiIsInBhcmFtc0FycmF5IiwiayIsInB1c2giLCJqb2luIiwic29ydCIsInBhdGgiLCJxcyIsImluZGV4T2YiLCJoIiwic3Vic3RyaW5nIiwiZm9ybWF0VXJsIiwicHJvdG9jb2wiLCJwb3J0IiwiaG9zdG5hbWUiLCJiYWNrdXAiLCJqc29uRXJyb3IiLCJiYWNrdXBFcnJvciIsIm1heEJ5dGVTaXplIiwic3RyaW5nIiwiY291bnQiLCJjb2RlIiwiY2hhckNvZGVBdCIsImpzb25QYXJzZSIsInMiLCJtYWtlVW5oYW5kbGVkU3RhY2tJbmZvIiwibWVzc2FnZSIsImxpbmVubyIsImNvbG5vIiwibW9kZSIsImJhY2t1cE1lc3NhZ2UiLCJlcnJvclBhcnNlciIsImxvY2F0aW9uIiwibGluZSIsImNvbHVtbiIsImZ1bmMiLCJndWVzc0Z1bmN0aW9uTmFtZSIsImNvbnRleHQiLCJnYXRoZXJDb250ZXh0IiwiaHJlZiIsImRvY3VtZW50IiwidXNlcmFnZW50IiwibmF2aWdhdG9yIiwidXNlckFnZW50Iiwic3RhY2siLCJ3cmFwQ2FsbGJhY2siLCJsb2dnZXIiLCJlcnIiLCJyZXNwIiwibm9uQ2lyY3VsYXJDbG9uZSIsInNlZW4iLCJuZXdTZWVuIiwiaW5jbHVkZXMiLCJzbGljZSIsImNyZWF0ZUl0ZW0iLCJhcmdzIiwibm90aWZpZXIiLCJyZXF1ZXN0S2V5cyIsImxhbWJkYUNvbnRleHQiLCJjdXN0b20iLCJjYWxsYmFjayIsInJlcXVlc3QiLCJhcmciLCJleHRyYUFyZ3MiLCJkaWFnbm9zdGljIiwiYXJnVHlwZXMiLCJ0eXAiLCJET01FeGNlcHRpb24iLCJqIiwibGVuIiwidGltZXN0YW1wIiwiZGF0YSIsInNldEN1c3RvbUl0ZW1LZXlzIiwiX29yaWdpbmFsQXJncyIsIm9yaWdpbmFsX2FyZ190eXBlcyIsImxldmVsIiwic2tpcEZyYW1lcyIsImFkZEVycm9yQ29udGV4dCIsImVycm9ycyIsImNvbnRleHRBZGRlZCIsInJvbGxiYXJDb250ZXh0IiwiZXJyb3JfY29udGV4dCIsIlRFTEVNRVRSWV9UWVBFUyIsIlRFTEVNRVRSWV9MRVZFTFMiLCJhcnJheUluY2x1ZGVzIiwiYXJyIiwidmFsIiwiY3JlYXRlVGVsZW1ldHJ5RXZlbnQiLCJtZXRhZGF0YSIsImV2ZW50IiwiYWRkSXRlbUF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVzIiwiX2l0ZW0kZGF0YSRhdHRyaWJ1dGVzIiwiYXBwbHkiLCJfdG9Db25zdW1hYmxlQXJyYXkiLCJrZXlzIiwic3BsaXQiLCJzZXQiLCJ0ZW1wIiwicmVwbGFjZW1lbnQiLCJmb3JtYXRBcmdzQXNTdHJpbmciLCJzdWJzdHIiLCJEYXRlIiwiZmlsdGVySXAiLCJyZXF1ZXN0RGF0YSIsImNhcHR1cmVJcCIsIm5ld0lwIiwicGFydHMiLCJwb3AiLCJiZWdpbm5pbmciLCJzbGFzaElkeCIsInRlcm1pbmFsIiwiY29uY2F0IiwiaGFuZGxlT3B0aW9ucyIsImlucHV0IiwicGF5bG9hZCIsInVwZGF0ZURlcHJlY2F0ZWRPcHRpb25zIiwib3ZlcndyaXRlU2NydWJGaWVsZHMiLCJzY3J1YkZpZWxkcyIsImhvc3RXaGl0ZUxpc3QiLCJob3N0U2FmZUxpc3QiLCJsb2ciLCJob3N0QmxhY2tMaXN0IiwiaG9zdEJsb2NrTGlzdCJdLCJzb3VyY2VSb290IjoiIn0=