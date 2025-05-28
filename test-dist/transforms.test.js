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

/***/ "./src/transforms.js":
/*!***************************!*\
  !*** ./src/transforms.js ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");
function itemToPayload(item, options, callback) {
  var data = item.data;
  if (item._isUncaught) {
    data._isUncaught = true;
  }
  if (item._originalArgs) {
    data._originalArgs = item._originalArgs;
  }
  callback(null, data);
}
function addPayloadOptions(item, options, callback) {
  var payloadOptions = options.payload || {};
  if (payloadOptions.body) {
    delete payloadOptions.body;
  }
  item.data = _.merge(item.data, payloadOptions);
  callback(null, item);
}
function addTelemetryData(item, options, callback) {
  if (item.telemetryEvents) {
    _.set(item, 'data.body.telemetry', item.telemetryEvents);
  }
  callback(null, item);
}
function addMessageWithError(item, options, callback) {
  if (!item.message) {
    callback(null, item);
    return;
  }
  var tracePath = 'data.body.trace_chain.0';
  var trace = _.get(item, tracePath);
  if (!trace) {
    tracePath = 'data.body.trace';
    trace = _.get(item, tracePath);
  }
  if (trace) {
    if (!(trace.exception && trace.exception.description)) {
      _.set(item, tracePath + '.exception.description', item.message);
      callback(null, item);
      return;
    }
    var extra = _.get(item, tracePath + '.extra') || {};
    var newExtra = _.merge(extra, {
      message: item.message
    });
    _.set(item, tracePath + '.extra', newExtra);
  }
  callback(null, item);
}
function userTransform(logger) {
  return function (item, options, callback) {
    var newItem = _.merge(item);
    var response = null;
    try {
      if (_.isFunction(options.transform)) {
        response = options.transform(newItem.data, item);
      }
    } catch (e) {
      options.transform = null;
      logger.error('Error while calling custom transform() function. Removing custom transform().', e);
      callback(null, item);
      return;
    }
    if (_.isPromise(response)) {
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
  var custom = _.get(item, 'data.custom') || {};
  custom[configKey] = options;
  item.data.custom = custom;
  callback(null, item);
}
function addFunctionOption(options, name) {
  if (_.isFunction(options[name])) {
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
  var diagnostic = _.merge(item.notifier.client.notifier.diagnostic, item.diagnostic);
  if (_.get(item, 'err._isAnonymous')) {
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
  item.data.notifier.diagnostic = _.merge(item.data.notifier.diagnostic, diagnostic);
  callback(null, item);
}
module.exports = {
  itemToPayload: itemToPayload,
  addPayloadOptions: addPayloadOptions,
  addTelemetryData: addTelemetryData,
  addMessageWithError: addMessageWithError,
  userTransform: userTransform,
  addConfigToPayload: addConfigToPayload,
  addConfiguredOptions: addConfiguredOptions,
  addDiagnosticKeys: addDiagnosticKeys
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
  !*** ./test/transforms.test.js ***!
  \*********************************/
/* globals expect */
/* globals describe */
/* globals it */

var _ = __webpack_require__(/*! ../src/utility */ "./src/utility.js");
var t = __webpack_require__(/*! ../src/transforms */ "./src/transforms.js");

function itemFromArgs(args) {
  var item = _.createItem(args);
  item.level = 'debug';
  return item;
}

var fakeLogger = {
  error: function () {},
  log: function () {},
};

describe('itemToPayload', function () {
  it('ignores options.payload.body but merges in other payload options', function (done) {
    var args = ['a message', { custom: 'stuff' }];
    var item = itemFromArgs(args);
    item.accessToken = 'abc123';
    item._isUncaught = true;
    item._originalArgs = ['c', 3];
    item.data = {};
    var options = {
      endpoint: 'api.rollbar.com',
      payload: { body: 'hey', x: 42 },
    };
    t.itemToPayload(item, options, function (e, i) {
      expect(i._isUncaught).to.eql(item._isUncaught);
      expect(i._originalArgs).to.eql(item._originalArgs);

      // This transform shouldn't apply any payload keys.
      expect(i.body).to.not.eql('hey');
      expect(i.x).to.not.eql(42);
      done(e);
    });
  });
  it('ignores handles trailing slash in endpoint', function (done) {
    var args = ['a message', { custom: 'stuff' }];
    var item = itemFromArgs(args);
    item.accessToken = 'abc123';
    item.data = { message: 'a message' };
    var options = {
      endpoint: 'api.rollbar.com/',
    };
    t.itemToPayload(item, options, function (e, i) {
      expect(i.message).to.eql('a message');
      done(e);
    });
  });
});

describe('addPayloadOptions', function () {
  it('ignores options.payload.body but merges in other payload options', function (done) {
    var args = ['a message', { custom: 'stuff' }];
    var item = itemFromArgs(args);
    item.accessToken = 'abc123';
    var options = {
      endpoint: 'api.rollbar.com',
      payload: { body: 'hey', x: 42 },
    };
    t.addPayloadOptions(item, options, function (e, i) {
      expect(i.data.body).to.not.eql('hey');
      expect(i.data.x).to.eql(42);
      done(e);
    });
  });
});

describe('addTelemetryData', function () {
  it('adds the data to the right place if events exist', function (done) {
    var item = {
      data: {
        body: {
          message: 'hello world',
        },
      },
      telemetryEvents: [
        {
          type: 'log',
          body: {
            subtype: 'console',
            message: 'bork',
          },
          timestamp_ms: 12345,
          level: 'info',
        },
        {
          type: 'manual',
          body: {
            hello: 'world',
          },
          timestamp_ms: 88889,
          level: 'info',
        },
      ],
    };
    var options = {};
    t.addTelemetryData(item, options, function (e, i) {
      expect(i.data.body.telemetry.length).to.eql(2);
      expect(i.data.body.telemetry[0].type).to.eql('log');
      done(e);
    });
  });
});

describe('addConfiguredOptions', function () {
  it('adds the configured options', function (done) {
    var item = {
      data: {
        body: {
          message: 'hello world',
        },
        notifier: {
          name: 'rollbar-js',
        },
      },
    };
    var options = {
      accessToken: 'abc123',
      foo: 'bar',
      captureUncaught: true,
      _configuredOptions: {
        accessToken: 'abc123',
        captureUncaught: true,
      },
    };
    t.addConfiguredOptions(item, options, function (e, i) {
      expect(i.data.notifier.configured_options).to.eql({
        captureUncaught: true,
      });
      done(e);
    });
  });
});

describe('userTransform', function () {
  it('calls user transform if is present and a function', function (done) {
    var args = ['a message'];
    var item = itemFromArgs(args);
    var options = {
      endpoint: 'api.rollbar.com',
      transform: function (newItem, item) {
        newItem.origin = item;
        newItem.message = 'HELLO';
      },
    };
    var payload = {
      access_token: '123',
      data: item,
    };
    expect(payload.data.message).to.not.eql('HELLO');
    t.userTransform(fakeLogger)(payload, options, function (e, i) {
      expect(i.data.origin).to.be.an('object');
      expect(i.data.message).to.eql('HELLO');
      done(e);
    });
  });
  it('does nothing if transform is not a function', function (done) {
    var args = ['a message'];
    var item = itemFromArgs(args);
    var options = {
      endpoint: 'api.rollbar.com',
      transform: 'hi there',
    };
    var payload = {
      access_token: '123',
      data: item,
    };
    expect(payload.data.message).to.not.eql('HELLO');
    t.userTransform(fakeLogger)(payload, options, function (e, i) {
      expect(i.data.message).to.not.eql('HELLO');
      done(e);
    });
  });
  it('does nothing if transform throws', function (done) {
    var args = ['a message'];
    var item = itemFromArgs(args);
    var options = {
      endpoint: 'api.rollbar.com',
      transform: function (i) {
        i.data.message = 'HELLO';
        throw 'bork';
      },
    };
    var payload = {
      access_token: '123',
      data: item,
    };
    expect(payload.data.message).to.not.eql('HELLO');
    t.userTransform(fakeLogger)(payload, options, function (e, i) {
      expect(i.data.message).to.not.eql('HELLO');
      expect(options.transform).to.not.be.ok();
      done(e);
    });
  });

  it('waits for promise resolution if transform returns a promise', function (done) {
    var args = ['a message'];
    var item = itemFromArgs(args);
    var payload = {
      access_token: '123',
      data: item,
    };
    var options = {
      endpoint: 'api.rollbar.com',
      transform: function (newItem) {
        newItem.message = 'HELLO';
        return Promise.resolve();
      },
    };
    t.userTransform(fakeLogger)(payload, options, function (e, i) {
      expect(i.data.message).to.eql('HELLO');
      done(e);
    });
    expect(payload.data.message).to.not.eql('HELLO');
  });

  it('uses resolved value if transform returns a promise with a value', function (done) {
    var args = ['a message'];
    var item = itemFromArgs(args);
    var payload = {
      access_token: '123',
      data: item,
    };
    var options = {
      endpoint: 'api.rollbar.com',
      transform: function (newItem) {
        return Promise.resolve({ message: 'HELLO' });
      },
    };
    t.userTransform(fakeLogger)(payload, options, function (e, i) {
      expect(i.data.message).to.eql('HELLO');
      expect(i.data).to.not.eql(item);
      done(e);
    });
    expect(payload.data.message).to.not.eql('HELLO');
  });

  it('uses untransformed value if transform returns a promise that rejects', function (done) {
    var args = ['a message'];
    var item = itemFromArgs(args);
    var err = { message: 'HELLO' };
    var payload = {
      access_token: '123',
      data: item,
    };
    var options = {
      endpoint: 'api.rollbar.com',
      transform: function (newItem) {
        return Promise.reject(err);
      },
    };
    t.userTransform(fakeLogger)(payload, options, function (e, i) {
      expect(i.data.message).to.not.eql('HELLO');
      expect(i.data).to.eql(item);
      expect(e).to.eql(err);
      done();
    });
    expect(payload.data.message).to.not.eql('HELLO');
  });
});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsa0JBQWtCO0FBQ25ELE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxHQUFHO0FBQ0gsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3JvbGxiYXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvbWVyZ2UuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy90cmFuc2Zvcm1zLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvdXRpbGl0eS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3JvbGxiYXIvLi90ZXN0L3RyYW5zZm9ybXMudGVzdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoc2VsZiwgKCkgPT4ge1xucmV0dXJuICIsIid1c2Ugc3RyaWN0JztcblxudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG52YXIgaXNQbGFpbk9iamVjdCA9IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qob2JqKSB7XG4gIGlmICghb2JqIHx8IHRvU3RyLmNhbGwob2JqKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgaGFzT3duQ29uc3RydWN0b3IgPSBoYXNPd24uY2FsbChvYmosICdjb25zdHJ1Y3RvcicpO1xuICB2YXIgaGFzSXNQcm90b3R5cGVPZiA9XG4gICAgb2JqLmNvbnN0cnVjdG9yICYmXG4gICAgb2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSAmJlxuICAgIGhhc093bi5jYWxsKG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsICdpc1Byb3RvdHlwZU9mJyk7XG4gIC8vIE5vdCBvd24gY29uc3RydWN0b3IgcHJvcGVydHkgbXVzdCBiZSBPYmplY3RcbiAgaWYgKG9iai5jb25zdHJ1Y3RvciAmJiAhaGFzT3duQ29uc3RydWN0b3IgJiYgIWhhc0lzUHJvdG90eXBlT2YpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBPd24gcHJvcGVydGllcyBhcmUgZW51bWVyYXRlZCBmaXJzdGx5LCBzbyB0byBzcGVlZCB1cCxcbiAgLy8gaWYgbGFzdCBvbmUgaXMgb3duLCB0aGVuIGFsbCBwcm9wZXJ0aWVzIGFyZSBvd24uXG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIC8qKi9cbiAgfVxuXG4gIHJldHVybiB0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJyB8fCBoYXNPd24uY2FsbChvYmosIGtleSk7XG59O1xuXG5mdW5jdGlvbiBtZXJnZSgpIHtcbiAgdmFyIGksXG4gICAgc3JjLFxuICAgIGNvcHksXG4gICAgY2xvbmUsXG4gICAgbmFtZSxcbiAgICByZXN1bHQgPSB7fSxcbiAgICBjdXJyZW50ID0gbnVsbCxcbiAgICBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGN1cnJlbnQgPSBhcmd1bWVudHNbaV07XG4gICAgaWYgKGN1cnJlbnQgPT0gbnVsbCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgZm9yIChuYW1lIGluIGN1cnJlbnQpIHtcbiAgICAgIHNyYyA9IHJlc3VsdFtuYW1lXTtcbiAgICAgIGNvcHkgPSBjdXJyZW50W25hbWVdO1xuICAgICAgaWYgKHJlc3VsdCAhPT0gY29weSkge1xuICAgICAgICBpZiAoY29weSAmJiBpc1BsYWluT2JqZWN0KGNvcHkpKSB7XG4gICAgICAgICAgY2xvbmUgPSBzcmMgJiYgaXNQbGFpbk9iamVjdChzcmMpID8gc3JjIDoge307XG4gICAgICAgICAgcmVzdWx0W25hbWVdID0gbWVyZ2UoY2xvbmUsIGNvcHkpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb3B5ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IGNvcHk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZTtcbiIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsaXR5Jyk7XG5cbmZ1bmN0aW9uIGl0ZW1Ub1BheWxvYWQoaXRlbSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdmFyIGRhdGEgPSBpdGVtLmRhdGE7XG5cbiAgaWYgKGl0ZW0uX2lzVW5jYXVnaHQpIHtcbiAgICBkYXRhLl9pc1VuY2F1Z2h0ID0gdHJ1ZTtcbiAgfVxuICBpZiAoaXRlbS5fb3JpZ2luYWxBcmdzKSB7XG4gICAgZGF0YS5fb3JpZ2luYWxBcmdzID0gaXRlbS5fb3JpZ2luYWxBcmdzO1xuICB9XG4gIGNhbGxiYWNrKG51bGwsIGRhdGEpO1xufVxuXG5mdW5jdGlvbiBhZGRQYXlsb2FkT3B0aW9ucyhpdGVtLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgcGF5bG9hZE9wdGlvbnMgPSBvcHRpb25zLnBheWxvYWQgfHwge307XG4gIGlmIChwYXlsb2FkT3B0aW9ucy5ib2R5KSB7XG4gICAgZGVsZXRlIHBheWxvYWRPcHRpb25zLmJvZHk7XG4gIH1cblxuICBpdGVtLmRhdGEgPSBfLm1lcmdlKGl0ZW0uZGF0YSwgcGF5bG9hZE9wdGlvbnMpO1xuICBjYWxsYmFjayhudWxsLCBpdGVtKTtcbn1cblxuZnVuY3Rpb24gYWRkVGVsZW1ldHJ5RGF0YShpdGVtLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICBpZiAoaXRlbS50ZWxlbWV0cnlFdmVudHMpIHtcbiAgICBfLnNldChpdGVtLCAnZGF0YS5ib2R5LnRlbGVtZXRyeScsIGl0ZW0udGVsZW1ldHJ5RXZlbnRzKTtcbiAgfVxuICBjYWxsYmFjayhudWxsLCBpdGVtKTtcbn1cblxuZnVuY3Rpb24gYWRkTWVzc2FnZVdpdGhFcnJvcihpdGVtLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICBpZiAoIWl0ZW0ubWVzc2FnZSkge1xuICAgIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgdHJhY2VQYXRoID0gJ2RhdGEuYm9keS50cmFjZV9jaGFpbi4wJztcbiAgdmFyIHRyYWNlID0gXy5nZXQoaXRlbSwgdHJhY2VQYXRoKTtcbiAgaWYgKCF0cmFjZSkge1xuICAgIHRyYWNlUGF0aCA9ICdkYXRhLmJvZHkudHJhY2UnO1xuICAgIHRyYWNlID0gXy5nZXQoaXRlbSwgdHJhY2VQYXRoKTtcbiAgfVxuICBpZiAodHJhY2UpIHtcbiAgICBpZiAoISh0cmFjZS5leGNlcHRpb24gJiYgdHJhY2UuZXhjZXB0aW9uLmRlc2NyaXB0aW9uKSkge1xuICAgICAgXy5zZXQoaXRlbSwgdHJhY2VQYXRoICsgJy5leGNlcHRpb24uZGVzY3JpcHRpb24nLCBpdGVtLm1lc3NhZ2UpO1xuICAgICAgY2FsbGJhY2sobnVsbCwgaXRlbSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBleHRyYSA9IF8uZ2V0KGl0ZW0sIHRyYWNlUGF0aCArICcuZXh0cmEnKSB8fCB7fTtcbiAgICB2YXIgbmV3RXh0cmEgPSBfLm1lcmdlKGV4dHJhLCB7IG1lc3NhZ2U6IGl0ZW0ubWVzc2FnZSB9KTtcbiAgICBfLnNldChpdGVtLCB0cmFjZVBhdGggKyAnLmV4dHJhJywgbmV3RXh0cmEpO1xuICB9XG4gIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xufVxuXG5mdW5jdGlvbiB1c2VyVHJhbnNmb3JtKGxvZ2dlcikge1xuICByZXR1cm4gZnVuY3Rpb24gKGl0ZW0sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgdmFyIG5ld0l0ZW0gPSBfLm1lcmdlKGl0ZW0pO1xuICAgIHZhciByZXNwb25zZSA9IG51bGw7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24ob3B0aW9ucy50cmFuc2Zvcm0pKSB7XG4gICAgICAgIHJlc3BvbnNlID0gb3B0aW9ucy50cmFuc2Zvcm0obmV3SXRlbS5kYXRhLCBpdGVtKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBvcHRpb25zLnRyYW5zZm9ybSA9IG51bGw7XG4gICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgICdFcnJvciB3aGlsZSBjYWxsaW5nIGN1c3RvbSB0cmFuc2Zvcm0oKSBmdW5jdGlvbi4gUmVtb3ZpbmcgY3VzdG9tIHRyYW5zZm9ybSgpLicsXG4gICAgICAgIGUsXG4gICAgICApO1xuICAgICAgY2FsbGJhY2sobnVsbCwgaXRlbSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChfLmlzUHJvbWlzZShyZXNwb25zZSkpIHtcbiAgICAgIHJlc3BvbnNlLnRoZW4oXG4gICAgICAgIGZ1bmN0aW9uIChwcm9taXNlZEl0ZW0pIHtcbiAgICAgICAgICBpZiAocHJvbWlzZWRJdGVtKSB7XG4gICAgICAgICAgICBuZXdJdGVtLmRhdGEgPSBwcm9taXNlZEl0ZW07XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIG5ld0l0ZW0pO1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgaXRlbSk7XG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFjayhudWxsLCBuZXdJdGVtKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGFkZENvbmZpZ1RvUGF5bG9hZChpdGVtLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICBpZiAoIW9wdGlvbnMuc2VuZENvbmZpZykge1xuICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBpdGVtKTtcbiAgfVxuICB2YXIgY29uZmlnS2V5ID0gJ19yb2xsYmFyQ29uZmlnJztcbiAgdmFyIGN1c3RvbSA9IF8uZ2V0KGl0ZW0sICdkYXRhLmN1c3RvbScpIHx8IHt9O1xuICBjdXN0b21bY29uZmlnS2V5XSA9IG9wdGlvbnM7XG4gIGl0ZW0uZGF0YS5jdXN0b20gPSBjdXN0b207XG4gIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xufVxuXG5mdW5jdGlvbiBhZGRGdW5jdGlvbk9wdGlvbihvcHRpb25zLCBuYW1lKSB7XG4gIGlmIChfLmlzRnVuY3Rpb24ob3B0aW9uc1tuYW1lXSkpIHtcbiAgICBvcHRpb25zW25hbWVdID0gb3B0aW9uc1tuYW1lXS50b1N0cmluZygpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFkZENvbmZpZ3VyZWRPcHRpb25zKGl0ZW0sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBjb25maWd1cmVkT3B0aW9ucyA9IG9wdGlvbnMuX2NvbmZpZ3VyZWRPcHRpb25zO1xuXG4gIC8vIFRoZXNlIG11c3QgYmUgc3RyaW5naWZpZWQgb3IgdGhleSdsbCBnZXQgZHJvcHBlZCBkdXJpbmcgc2VyaWFsaXphdGlvbi5cbiAgYWRkRnVuY3Rpb25PcHRpb24oY29uZmlndXJlZE9wdGlvbnMsICd0cmFuc2Zvcm0nKTtcbiAgYWRkRnVuY3Rpb25PcHRpb24oY29uZmlndXJlZE9wdGlvbnMsICdjaGVja0lnbm9yZScpO1xuICBhZGRGdW5jdGlvbk9wdGlvbihjb25maWd1cmVkT3B0aW9ucywgJ29uU2VuZENhbGxiYWNrJyk7XG5cbiAgZGVsZXRlIGNvbmZpZ3VyZWRPcHRpb25zLmFjY2Vzc1Rva2VuO1xuICBpdGVtLmRhdGEubm90aWZpZXIuY29uZmlndXJlZF9vcHRpb25zID0gY29uZmlndXJlZE9wdGlvbnM7XG4gIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xufVxuXG5mdW5jdGlvbiBhZGREaWFnbm9zdGljS2V5cyhpdGVtLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgZGlhZ25vc3RpYyA9IF8ubWVyZ2UoXG4gICAgaXRlbS5ub3RpZmllci5jbGllbnQubm90aWZpZXIuZGlhZ25vc3RpYyxcbiAgICBpdGVtLmRpYWdub3N0aWMsXG4gICk7XG5cbiAgaWYgKF8uZ2V0KGl0ZW0sICdlcnIuX2lzQW5vbnltb3VzJykpIHtcbiAgICBkaWFnbm9zdGljLmlzX2Fub255bW91cyA9IHRydWU7XG4gIH1cblxuICBpZiAoaXRlbS5faXNVbmNhdWdodCkge1xuICAgIGRpYWdub3N0aWMuaXNfdW5jYXVnaHQgPSBpdGVtLl9pc1VuY2F1Z2h0O1xuICB9XG5cbiAgaWYgKGl0ZW0uZXJyKSB7XG4gICAgdHJ5IHtcbiAgICAgIGRpYWdub3N0aWMucmF3X2Vycm9yID0ge1xuICAgICAgICBtZXNzYWdlOiBpdGVtLmVyci5tZXNzYWdlLFxuICAgICAgICBuYW1lOiBpdGVtLmVyci5uYW1lLFxuICAgICAgICBjb25zdHJ1Y3Rvcl9uYW1lOiBpdGVtLmVyci5jb25zdHJ1Y3RvciAmJiBpdGVtLmVyci5jb25zdHJ1Y3Rvci5uYW1lLFxuICAgICAgICBmaWxlbmFtZTogaXRlbS5lcnIuZmlsZU5hbWUsXG4gICAgICAgIGxpbmU6IGl0ZW0uZXJyLmxpbmVOdW1iZXIsXG4gICAgICAgIGNvbHVtbjogaXRlbS5lcnIuY29sdW1uTnVtYmVyLFxuICAgICAgICBzdGFjazogaXRlbS5lcnIuc3RhY2ssXG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGRpYWdub3N0aWMucmF3X2Vycm9yID0geyBmYWlsZWQ6IFN0cmluZyhlKSB9O1xuICAgIH1cbiAgfVxuXG4gIGl0ZW0uZGF0YS5ub3RpZmllci5kaWFnbm9zdGljID0gXy5tZXJnZShcbiAgICBpdGVtLmRhdGEubm90aWZpZXIuZGlhZ25vc3RpYyxcbiAgICBkaWFnbm9zdGljLFxuICApO1xuICBjYWxsYmFjayhudWxsLCBpdGVtKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGl0ZW1Ub1BheWxvYWQ6IGl0ZW1Ub1BheWxvYWQsXG4gIGFkZFBheWxvYWRPcHRpb25zOiBhZGRQYXlsb2FkT3B0aW9ucyxcbiAgYWRkVGVsZW1ldHJ5RGF0YTogYWRkVGVsZW1ldHJ5RGF0YSxcbiAgYWRkTWVzc2FnZVdpdGhFcnJvcjogYWRkTWVzc2FnZVdpdGhFcnJvcixcbiAgdXNlclRyYW5zZm9ybTogdXNlclRyYW5zZm9ybSxcbiAgYWRkQ29uZmlnVG9QYXlsb2FkOiBhZGRDb25maWdUb1BheWxvYWQsXG4gIGFkZENvbmZpZ3VyZWRPcHRpb25zOiBhZGRDb25maWd1cmVkT3B0aW9ucyxcbiAgYWRkRGlhZ25vc3RpY0tleXM6IGFkZERpYWdub3N0aWNLZXlzLFxufTtcbiIsInZhciBtZXJnZSA9IHJlcXVpcmUoJy4vbWVyZ2UnKTtcblxudmFyIFJvbGxiYXJKU09OID0ge307XG5mdW5jdGlvbiBzZXR1cEpTT04ocG9seWZpbGxKU09OKSB7XG4gIGlmIChpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnN0cmluZ2lmeSkgJiYgaXNGdW5jdGlvbihSb2xsYmFySlNPTi5wYXJzZSkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoaXNEZWZpbmVkKEpTT04pKSB7XG4gICAgLy8gSWYgcG9seWZpbGwgaXMgcHJvdmlkZWQsIHByZWZlciBpdCBvdmVyIGV4aXN0aW5nIG5vbi1uYXRpdmUgc2hpbXMuXG4gICAgaWYgKHBvbHlmaWxsSlNPTikge1xuICAgICAgaWYgKGlzTmF0aXZlRnVuY3Rpb24oSlNPTi5zdHJpbmdpZnkpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnN0cmluZ2lmeSA9IEpTT04uc3RyaW5naWZ5O1xuICAgICAgfVxuICAgICAgaWYgKGlzTmF0aXZlRnVuY3Rpb24oSlNPTi5wYXJzZSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04ucGFyc2UgPSBKU09OLnBhcnNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBlbHNlIGFjY2VwdCBhbnkgaW50ZXJmYWNlIHRoYXQgaXMgcHJlc2VudC5cbiAgICAgIGlmIChpc0Z1bmN0aW9uKEpTT04uc3RyaW5naWZ5KSkge1xuICAgICAgICBSb2xsYmFySlNPTi5zdHJpbmdpZnkgPSBKU09OLnN0cmluZ2lmeTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0Z1bmN0aW9uKEpTT04ucGFyc2UpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnBhcnNlID0gSlNPTi5wYXJzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKCFpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnN0cmluZ2lmeSkgfHwgIWlzRnVuY3Rpb24oUm9sbGJhckpTT04ucGFyc2UpKSB7XG4gICAgcG9seWZpbGxKU09OICYmIHBvbHlmaWxsSlNPTihSb2xsYmFySlNPTik7XG4gIH1cbn1cblxuLypcbiAqIGlzVHlwZSAtIEdpdmVuIGEgSmF2YXNjcmlwdCB2YWx1ZSBhbmQgYSBzdHJpbmcsIHJldHVybnMgdHJ1ZSBpZiB0aGUgdHlwZSBvZiB0aGUgdmFsdWUgbWF0Y2hlcyB0aGVcbiAqIGdpdmVuIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0geCAtIGFueSB2YWx1ZVxuICogQHBhcmFtIHQgLSBhIGxvd2VyY2FzZSBzdHJpbmcgY29udGFpbmluZyBvbmUgb2YgdGhlIGZvbGxvd2luZyB0eXBlIG5hbWVzOlxuICogICAgLSB1bmRlZmluZWRcbiAqICAgIC0gbnVsbFxuICogICAgLSBlcnJvclxuICogICAgLSBudW1iZXJcbiAqICAgIC0gYm9vbGVhblxuICogICAgLSBzdHJpbmdcbiAqICAgIC0gc3ltYm9sXG4gKiAgICAtIGZ1bmN0aW9uXG4gKiAgICAtIG9iamVjdFxuICogICAgLSBhcnJheVxuICogQHJldHVybnMgdHJ1ZSBpZiB4IGlzIG9mIHR5cGUgdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVHlwZSh4LCB0KSB7XG4gIHJldHVybiB0ID09PSB0eXBlTmFtZSh4KTtcbn1cblxuLypcbiAqIHR5cGVOYW1lIC0gR2l2ZW4gYSBKYXZhc2NyaXB0IHZhbHVlLCByZXR1cm5zIHRoZSB0eXBlIG9mIHRoZSBvYmplY3QgYXMgYSBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gdHlwZU5hbWUoeCkge1xuICB2YXIgbmFtZSA9IHR5cGVvZiB4O1xuICBpZiAobmFtZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbmFtZTtcbiAgfVxuICBpZiAoIXgpIHtcbiAgICByZXR1cm4gJ251bGwnO1xuICB9XG4gIGlmICh4IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICByZXR1cm4gJ2Vycm9yJztcbiAgfVxuICByZXR1cm4ge30udG9TdHJpbmdcbiAgICAuY2FsbCh4KVxuICAgIC5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXVxuICAgIC50b0xvd2VyQ2FzZSgpO1xufVxuXG4vKiBpc0Z1bmN0aW9uIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBhIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIGYgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIGZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbihmKSB7XG4gIHJldHVybiBpc1R5cGUoZiwgJ2Z1bmN0aW9uJyk7XG59XG5cbi8qIGlzTmF0aXZlRnVuY3Rpb24gLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIGEgbmF0aXZlIEpTIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIGYgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIG5hdGl2ZSBKUyBmdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlRnVuY3Rpb24oZikge1xuICB2YXIgcmVSZWdFeHBDaGFyID0gL1tcXFxcXiQuKis/KClbXFxde318XS9nO1xuICB2YXIgZnVuY01hdGNoU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nXG4gICAgLmNhbGwoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSlcbiAgICAucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAgIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKTtcbiAgdmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICsgZnVuY01hdGNoU3RyaW5nICsgJyQnKTtcbiAgcmV0dXJuIGlzT2JqZWN0KGYpICYmIHJlSXNOYXRpdmUudGVzdChmKTtcbn1cblxuLyogaXNPYmplY3QgLSBDaGVja3MgaWYgdGhlIGFyZ3VtZW50IGlzIGFuIG9iamVjdFxuICpcbiAqIEBwYXJhbSB2YWx1ZSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpcyB2YWx1ZSBpcyBhbiBvYmplY3QgZnVuY3Rpb24gaXMgYW4gb2JqZWN0KVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyogaXNTdHJpbmcgLSBDaGVja3MgaWYgdGhlIGFyZ3VtZW50IGlzIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHZhbHVlIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIHZhbHVlIGlzIGEgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nO1xufVxuXG4vKipcbiAqIGlzRmluaXRlTnVtYmVyIC0gZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgYSBmaW5pdGUgbnVtYmVyXG4gKlxuICogQHBhcmFtIHsqfSBuIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIHZhbHVlIGlzIGEgZmluaXRlIG51bWJlclxuICovXG5mdW5jdGlvbiBpc0Zpbml0ZU51bWJlcihuKSB7XG4gIHJldHVybiBOdW1iZXIuaXNGaW5pdGUobik7XG59XG5cbi8qXG4gKiBpc0RlZmluZWQgLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIG5vdCBlcXVhbCB0byB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0gdSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiB1IGlzIGFueXRoaW5nIG90aGVyIHRoYW4gdW5kZWZpbmVkXG4gKi9cbmZ1bmN0aW9uIGlzRGVmaW5lZCh1KSB7XG4gIHJldHVybiAhaXNUeXBlKHUsICd1bmRlZmluZWQnKTtcbn1cblxuLypcbiAqIGlzSXRlcmFibGUgLSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBjYW4gYmUgaXRlcmF0ZWQsIGVzc2VudGlhbGx5XG4gKiB3aGV0aGVyIGl0IGlzIGFuIG9iamVjdCBvciBhbiBhcnJheS5cbiAqXG4gKiBAcGFyYW0gaSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBpIGlzIGFuIG9iamVjdCBvciBhbiBhcnJheSBhcyBkZXRlcm1pbmVkIGJ5IGB0eXBlTmFtZWBcbiAqL1xuZnVuY3Rpb24gaXNJdGVyYWJsZShpKSB7XG4gIHZhciB0eXBlID0gdHlwZU5hbWUoaSk7XG4gIHJldHVybiB0eXBlID09PSAnb2JqZWN0JyB8fCB0eXBlID09PSAnYXJyYXknO1xufVxuXG4vKlxuICogaXNFcnJvciAtIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIG9mIGFuIGVycm9yIHR5cGVcbiAqXG4gKiBAcGFyYW0gZSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBlIGlzIGFuIGVycm9yXG4gKi9cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICAvLyBEZXRlY3QgYm90aCBFcnJvciBhbmQgRmlyZWZveCBFeGNlcHRpb24gdHlwZVxuICByZXR1cm4gaXNUeXBlKGUsICdlcnJvcicpIHx8IGlzVHlwZShlLCAnZXhjZXB0aW9uJyk7XG59XG5cbi8qIGlzUHJvbWlzZSAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgYSBwcm9taXNlXG4gKlxuICogQHBhcmFtIHAgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIGZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNQcm9taXNlKHApIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHApICYmIGlzVHlwZShwLnRoZW4sICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIGlzQnJvd3NlciAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIHRoZSBjb2RlIGlzIHJ1bm5pbmcgaW4gYSBicm93c2VyXG4gKlxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY29kZSBpcyBydW5uaW5nIGluIGEgYnJvd3NlciBlbnZpcm9ubWVudFxuICovXG5mdW5jdGlvbiBpc0Jyb3dzZXIoKSB7XG4gIHJldHVybiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcbn1cblxuZnVuY3Rpb24gcmVkYWN0KCkge1xuICByZXR1cm4gJyoqKioqKioqJztcbn1cblxuLy8gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS84ODA5NDcyLzExMzgxOTFcbmZ1bmN0aW9uIHV1aWQ0KCkge1xuICB2YXIgZCA9IG5vdygpO1xuICB2YXIgdXVpZCA9ICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoXG4gICAgL1t4eV0vZyxcbiAgICBmdW5jdGlvbiAoYykge1xuICAgICAgdmFyIHIgPSAoZCArIE1hdGgucmFuZG9tKCkgKiAxNikgJSAxNiB8IDA7XG4gICAgICBkID0gTWF0aC5mbG9vcihkIC8gMTYpO1xuICAgICAgcmV0dXJuIChjID09PSAneCcgPyByIDogKHIgJiAweDcpIHwgMHg4KS50b1N0cmluZygxNik7XG4gICAgfSxcbiAgKTtcbiAgcmV0dXJuIHV1aWQ7XG59XG5cbnZhciBMRVZFTFMgPSB7XG4gIGRlYnVnOiAwLFxuICBpbmZvOiAxLFxuICB3YXJuaW5nOiAyLFxuICBlcnJvcjogMyxcbiAgY3JpdGljYWw6IDQsXG59O1xuXG5mdW5jdGlvbiBzYW5pdGl6ZVVybCh1cmwpIHtcbiAgdmFyIGJhc2VVcmxQYXJ0cyA9IHBhcnNlVXJpKHVybCk7XG4gIGlmICghYmFzZVVybFBhcnRzKSB7XG4gICAgcmV0dXJuICcodW5rbm93biknO1xuICB9XG5cbiAgLy8gcmVtb3ZlIGEgdHJhaWxpbmcgIyBpZiB0aGVyZSBpcyBubyBhbmNob3JcbiAgaWYgKGJhc2VVcmxQYXJ0cy5hbmNob3IgPT09ICcnKSB7XG4gICAgYmFzZVVybFBhcnRzLnNvdXJjZSA9IGJhc2VVcmxQYXJ0cy5zb3VyY2UucmVwbGFjZSgnIycsICcnKTtcbiAgfVxuXG4gIHVybCA9IGJhc2VVcmxQYXJ0cy5zb3VyY2UucmVwbGFjZSgnPycgKyBiYXNlVXJsUGFydHMucXVlcnksICcnKTtcbiAgcmV0dXJuIHVybDtcbn1cblxudmFyIHBhcnNlVXJpT3B0aW9ucyA9IHtcbiAgc3RyaWN0TW9kZTogZmFsc2UsXG4gIGtleTogW1xuICAgICdzb3VyY2UnLFxuICAgICdwcm90b2NvbCcsXG4gICAgJ2F1dGhvcml0eScsXG4gICAgJ3VzZXJJbmZvJyxcbiAgICAndXNlcicsXG4gICAgJ3Bhc3N3b3JkJyxcbiAgICAnaG9zdCcsXG4gICAgJ3BvcnQnLFxuICAgICdyZWxhdGl2ZScsXG4gICAgJ3BhdGgnLFxuICAgICdkaXJlY3RvcnknLFxuICAgICdmaWxlJyxcbiAgICAncXVlcnknLFxuICAgICdhbmNob3InLFxuICBdLFxuICBxOiB7XG4gICAgbmFtZTogJ3F1ZXJ5S2V5JyxcbiAgICBwYXJzZXI6IC8oPzpefCYpKFteJj1dKik9PyhbXiZdKikvZyxcbiAgfSxcbiAgcGFyc2VyOiB7XG4gICAgc3RyaWN0OlxuICAgICAgL14oPzooW146XFwvPyNdKyk6KT8oPzpcXC9cXC8oKD86KChbXjpAXSopKD86OihbXjpAXSopKT8pP0ApPyhbXjpcXC8/I10qKSg/OjooXFxkKikpPykpPygoKCg/OltePyNcXC9dKlxcLykqKShbXj8jXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pLyxcbiAgICBsb29zZTpcbiAgICAgIC9eKD86KD8hW146QF0rOlteOkBcXC9dKkApKFteOlxcLz8jLl0rKTopPyg/OlxcL1xcLyk/KCg/OigoW146QF0qKSg/OjooW146QF0qKSk/KT9AKT8oW146XFwvPyNdKikoPzo6KFxcZCopKT8pKCgoXFwvKD86W14/I10oPyFbXj8jXFwvXSpcXC5bXj8jXFwvLl0rKD86Wz8jXXwkKSkpKlxcLz8pPyhbXj8jXFwvXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pLyxcbiAgfSxcbn07XG5cbmZ1bmN0aW9uIHBhcnNlVXJpKHN0cikge1xuICBpZiAoIWlzVHlwZShzdHIsICdzdHJpbmcnKSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICB2YXIgbyA9IHBhcnNlVXJpT3B0aW9ucztcbiAgdmFyIG0gPSBvLnBhcnNlcltvLnN0cmljdE1vZGUgPyAnc3RyaWN0JyA6ICdsb29zZSddLmV4ZWMoc3RyKTtcbiAgdmFyIHVyaSA9IHt9O1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gby5rZXkubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgdXJpW28ua2V5W2ldXSA9IG1baV0gfHwgJyc7XG4gIH1cblxuICB1cmlbby5xLm5hbWVdID0ge307XG4gIHVyaVtvLmtleVsxMl1dLnJlcGxhY2Uoby5xLnBhcnNlciwgZnVuY3Rpb24gKCQwLCAkMSwgJDIpIHtcbiAgICBpZiAoJDEpIHtcbiAgICAgIHVyaVtvLnEubmFtZV1bJDFdID0gJDI7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdXJpO1xufVxuXG5mdW5jdGlvbiBhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aChhY2Nlc3NUb2tlbiwgb3B0aW9ucywgcGFyYW1zKSB7XG4gIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgcGFyYW1zLmFjY2Vzc190b2tlbiA9IGFjY2Vzc1Rva2VuO1xuICB2YXIgcGFyYW1zQXJyYXkgPSBbXTtcbiAgdmFyIGs7XG4gIGZvciAoayBpbiBwYXJhbXMpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmFtcywgaykpIHtcbiAgICAgIHBhcmFtc0FycmF5LnB1c2goW2ssIHBhcmFtc1trXV0uam9pbignPScpKTtcbiAgICB9XG4gIH1cbiAgdmFyIHF1ZXJ5ID0gJz8nICsgcGFyYW1zQXJyYXkuc29ydCgpLmpvaW4oJyYnKTtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgb3B0aW9ucy5wYXRoID0gb3B0aW9ucy5wYXRoIHx8ICcnO1xuICB2YXIgcXMgPSBvcHRpb25zLnBhdGguaW5kZXhPZignPycpO1xuICB2YXIgaCA9IG9wdGlvbnMucGF0aC5pbmRleE9mKCcjJyk7XG4gIHZhciBwO1xuICBpZiAocXMgIT09IC0xICYmIChoID09PSAtMSB8fCBoID4gcXMpKSB7XG4gICAgcCA9IG9wdGlvbnMucGF0aDtcbiAgICBvcHRpb25zLnBhdGggPSBwLnN1YnN0cmluZygwLCBxcykgKyBxdWVyeSArICcmJyArIHAuc3Vic3RyaW5nKHFzICsgMSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGggIT09IC0xKSB7XG4gICAgICBwID0gb3B0aW9ucy5wYXRoO1xuICAgICAgb3B0aW9ucy5wYXRoID0gcC5zdWJzdHJpbmcoMCwgaCkgKyBxdWVyeSArIHAuc3Vic3RyaW5nKGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zLnBhdGggPSBvcHRpb25zLnBhdGggKyBxdWVyeTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0VXJsKHUsIHByb3RvY29sKSB7XG4gIHByb3RvY29sID0gcHJvdG9jb2wgfHwgdS5wcm90b2NvbDtcbiAgaWYgKCFwcm90b2NvbCAmJiB1LnBvcnQpIHtcbiAgICBpZiAodS5wb3J0ID09PSA4MCkge1xuICAgICAgcHJvdG9jb2wgPSAnaHR0cDonO1xuICAgIH0gZWxzZSBpZiAodS5wb3J0ID09PSA0NDMpIHtcbiAgICAgIHByb3RvY29sID0gJ2h0dHBzOic7XG4gICAgfVxuICB9XG4gIHByb3RvY29sID0gcHJvdG9jb2wgfHwgJ2h0dHBzOic7XG5cbiAgaWYgKCF1Lmhvc3RuYW1lKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IHByb3RvY29sICsgJy8vJyArIHUuaG9zdG5hbWU7XG4gIGlmICh1LnBvcnQpIHtcbiAgICByZXN1bHQgPSByZXN1bHQgKyAnOicgKyB1LnBvcnQ7XG4gIH1cbiAgaWYgKHUucGF0aCkge1xuICAgIHJlc3VsdCA9IHJlc3VsdCArIHUucGF0aDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnkob2JqLCBiYWNrdXApIHtcbiAgdmFyIHZhbHVlLCBlcnJvcjtcbiAgdHJ5IHtcbiAgICB2YWx1ZSA9IFJvbGxiYXJKU09OLnN0cmluZ2lmeShvYmopO1xuICB9IGNhdGNoIChqc29uRXJyb3IpIHtcbiAgICBpZiAoYmFja3VwICYmIGlzRnVuY3Rpb24oYmFja3VwKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBiYWNrdXAob2JqKTtcbiAgICAgIH0gY2F0Y2ggKGJhY2t1cEVycm9yKSB7XG4gICAgICAgIGVycm9yID0gYmFja3VwRXJyb3I7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVycm9yID0ganNvbkVycm9yO1xuICAgIH1cbiAgfVxuICByZXR1cm4geyBlcnJvcjogZXJyb3IsIHZhbHVlOiB2YWx1ZSB9O1xufVxuXG5mdW5jdGlvbiBtYXhCeXRlU2l6ZShzdHJpbmcpIHtcbiAgLy8gVGhlIHRyYW5zcG9ydCB3aWxsIHVzZSB1dGYtOCwgc28gYXNzdW1lIHV0Zi04IGVuY29kaW5nLlxuICAvL1xuICAvLyBUaGlzIG1pbmltYWwgaW1wbGVtZW50YXRpb24gd2lsbCBhY2N1cmF0ZWx5IGNvdW50IGJ5dGVzIGZvciBhbGwgVUNTLTIgYW5kXG4gIC8vIHNpbmdsZSBjb2RlIHBvaW50IFVURi0xNi4gSWYgcHJlc2VudGVkIHdpdGggbXVsdGkgY29kZSBwb2ludCBVVEYtMTYsXG4gIC8vIHdoaWNoIHNob3VsZCBiZSByYXJlLCBpdCB3aWxsIHNhZmVseSBvdmVyY291bnQsIG5vdCB1bmRlcmNvdW50LlxuICAvL1xuICAvLyBXaGlsZSByb2J1c3QgdXRmLTggZW5jb2RlcnMgZXhpc3QsIHRoaXMgaXMgZmFyIHNtYWxsZXIgYW5kIGZhciBtb3JlIHBlcmZvcm1hbnQuXG4gIC8vIEZvciBxdWlja2x5IGNvdW50aW5nIHBheWxvYWQgc2l6ZSBmb3IgdHJ1bmNhdGlvbiwgc21hbGxlciBpcyBiZXR0ZXIuXG5cbiAgdmFyIGNvdW50ID0gMDtcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBjb2RlID0gc3RyaW5nLmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGNvZGUgPCAxMjgpIHtcbiAgICAgIC8vIHVwIHRvIDcgYml0c1xuICAgICAgY291bnQgPSBjb3VudCArIDE7XG4gICAgfSBlbHNlIGlmIChjb2RlIDwgMjA0OCkge1xuICAgICAgLy8gdXAgdG8gMTEgYml0c1xuICAgICAgY291bnQgPSBjb3VudCArIDI7XG4gICAgfSBlbHNlIGlmIChjb2RlIDwgNjU1MzYpIHtcbiAgICAgIC8vIHVwIHRvIDE2IGJpdHNcbiAgICAgIGNvdW50ID0gY291bnQgKyAzO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb3VudDtcbn1cblxuZnVuY3Rpb24ganNvblBhcnNlKHMpIHtcbiAgdmFyIHZhbHVlLCBlcnJvcjtcbiAgdHJ5IHtcbiAgICB2YWx1ZSA9IFJvbGxiYXJKU09OLnBhcnNlKHMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgZXJyb3IgPSBlO1xuICB9XG4gIHJldHVybiB7IGVycm9yOiBlcnJvciwgdmFsdWU6IHZhbHVlIH07XG59XG5cbmZ1bmN0aW9uIG1ha2VVbmhhbmRsZWRTdGFja0luZm8oXG4gIG1lc3NhZ2UsXG4gIHVybCxcbiAgbGluZW5vLFxuICBjb2xubyxcbiAgZXJyb3IsXG4gIG1vZGUsXG4gIGJhY2t1cE1lc3NhZ2UsXG4gIGVycm9yUGFyc2VyLFxuKSB7XG4gIHZhciBsb2NhdGlvbiA9IHtcbiAgICB1cmw6IHVybCB8fCAnJyxcbiAgICBsaW5lOiBsaW5lbm8sXG4gICAgY29sdW1uOiBjb2xubyxcbiAgfTtcbiAgbG9jYXRpb24uZnVuYyA9IGVycm9yUGFyc2VyLmd1ZXNzRnVuY3Rpb25OYW1lKGxvY2F0aW9uLnVybCwgbG9jYXRpb24ubGluZSk7XG4gIGxvY2F0aW9uLmNvbnRleHQgPSBlcnJvclBhcnNlci5nYXRoZXJDb250ZXh0KGxvY2F0aW9uLnVybCwgbG9jYXRpb24ubGluZSk7XG4gIHZhciBocmVmID1cbiAgICB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmXG4gICAgZG9jdW1lbnQgJiZcbiAgICBkb2N1bWVudC5sb2NhdGlvbiAmJlxuICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWY7XG4gIHZhciB1c2VyYWdlbnQgPVxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgd2luZG93ICYmXG4gICAgd2luZG93Lm5hdmlnYXRvciAmJlxuICAgIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICByZXR1cm4ge1xuICAgIG1vZGU6IG1vZGUsXG4gICAgbWVzc2FnZTogZXJyb3IgPyBTdHJpbmcoZXJyb3IpIDogbWVzc2FnZSB8fCBiYWNrdXBNZXNzYWdlLFxuICAgIHVybDogaHJlZixcbiAgICBzdGFjazogW2xvY2F0aW9uXSxcbiAgICB1c2VyYWdlbnQ6IHVzZXJhZ2VudCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gd3JhcENhbGxiYWNrKGxvZ2dlciwgZikge1xuICByZXR1cm4gZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgIHRyeSB7XG4gICAgICBmKGVyciwgcmVzcCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbG9nZ2VyLmVycm9yKGUpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gbm9uQ2lyY3VsYXJDbG9uZShvYmopIHtcbiAgdmFyIHNlZW4gPSBbb2JqXTtcblxuICBmdW5jdGlvbiBjbG9uZShvYmosIHNlZW4pIHtcbiAgICB2YXIgdmFsdWUsXG4gICAgICBuYW1lLFxuICAgICAgbmV3U2VlbixcbiAgICAgIHJlc3VsdCA9IHt9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAobmFtZSBpbiBvYmopIHtcbiAgICAgICAgdmFsdWUgPSBvYmpbbmFtZV07XG5cbiAgICAgICAgaWYgKHZhbHVlICYmIChpc1R5cGUodmFsdWUsICdvYmplY3QnKSB8fCBpc1R5cGUodmFsdWUsICdhcnJheScpKSkge1xuICAgICAgICAgIGlmIChzZWVuLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgICAgICAgcmVzdWx0W25hbWVdID0gJ1JlbW92ZWQgY2lyY3VsYXIgcmVmZXJlbmNlOiAnICsgdHlwZU5hbWUodmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdTZWVuID0gc2Vlbi5zbGljZSgpO1xuICAgICAgICAgICAgbmV3U2Vlbi5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IGNsb25lKHZhbHVlLCBuZXdTZWVuKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHRbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXN1bHQgPSAnRmFpbGVkIGNsb25pbmcgY3VzdG9tIGRhdGE6ICcgKyBlLm1lc3NhZ2U7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGNsb25lKG9iaiwgc2Vlbik7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUl0ZW0oYXJncywgbG9nZ2VyLCBub3RpZmllciwgcmVxdWVzdEtleXMsIGxhbWJkYUNvbnRleHQpIHtcbiAgdmFyIG1lc3NhZ2UsIGVyciwgY3VzdG9tLCBjYWxsYmFjaywgcmVxdWVzdDtcbiAgdmFyIGFyZztcbiAgdmFyIGV4dHJhQXJncyA9IFtdO1xuICB2YXIgZGlhZ25vc3RpYyA9IHt9O1xuICB2YXIgYXJnVHlwZXMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3MubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcblxuICAgIHZhciB0eXAgPSB0eXBlTmFtZShhcmcpO1xuICAgIGFyZ1R5cGVzLnB1c2godHlwKTtcbiAgICBzd2l0Y2ggKHR5cCkge1xuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBtZXNzYWdlID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChtZXNzYWdlID0gYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgIGNhbGxiYWNrID0gd3JhcENhbGxiYWNrKGxvZ2dlciwgYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgZXh0cmFBcmdzLnB1c2goYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdlcnJvcic6XG4gICAgICBjYXNlICdkb21leGNlcHRpb24nOlxuICAgICAgY2FzZSAnZXhjZXB0aW9uJzogLy8gRmlyZWZveCBFeGNlcHRpb24gdHlwZVxuICAgICAgICBlcnIgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGVyciA9IGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGFyZyBpbnN0YW5jZW9mIEVycm9yIHx8XG4gICAgICAgICAgKHR5cGVvZiBET01FeGNlcHRpb24gIT09ICd1bmRlZmluZWQnICYmIGFyZyBpbnN0YW5jZW9mIERPTUV4Y2VwdGlvbilcbiAgICAgICAgKSB7XG4gICAgICAgICAgZXJyID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChlcnIgPSBhcmcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXF1ZXN0S2V5cyAmJiB0eXAgPT09ICdvYmplY3QnICYmICFyZXF1ZXN0KSB7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbiA9IHJlcXVlc3RLZXlzLmxlbmd0aDsgaiA8IGxlbjsgKytqKSB7XG4gICAgICAgICAgICBpZiAoYXJnW3JlcXVlc3RLZXlzW2pdXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHJlcXVlc3QgPSBhcmc7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVxdWVzdCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGN1c3RvbSA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoY3VzdG9tID0gYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoXG4gICAgICAgICAgYXJnIGluc3RhbmNlb2YgRXJyb3IgfHxcbiAgICAgICAgICAodHlwZW9mIERPTUV4Y2VwdGlvbiAhPT0gJ3VuZGVmaW5lZCcgJiYgYXJnIGluc3RhbmNlb2YgRE9NRXhjZXB0aW9uKVxuICAgICAgICApIHtcbiAgICAgICAgICBlcnIgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGVyciA9IGFyZyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZXh0cmFBcmdzLnB1c2goYXJnKTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiBjdXN0b20gaXMgYW4gYXJyYXkgdGhpcyB0dXJucyBpdCBpbnRvIGFuIG9iamVjdCB3aXRoIGludGVnZXIga2V5c1xuICBpZiAoY3VzdG9tKSBjdXN0b20gPSBub25DaXJjdWxhckNsb25lKGN1c3RvbSk7XG5cbiAgaWYgKGV4dHJhQXJncy5sZW5ndGggPiAwKSB7XG4gICAgaWYgKCFjdXN0b20pIGN1c3RvbSA9IG5vbkNpcmN1bGFyQ2xvbmUoe30pO1xuICAgIGN1c3RvbS5leHRyYUFyZ3MgPSBub25DaXJjdWxhckNsb25lKGV4dHJhQXJncyk7XG4gIH1cblxuICB2YXIgaXRlbSA9IHtcbiAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgIGVycjogZXJyLFxuICAgIGN1c3RvbTogY3VzdG9tLFxuICAgIHRpbWVzdGFtcDogbm93KCksXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgIG5vdGlmaWVyOiBub3RpZmllcixcbiAgICBkaWFnbm9zdGljOiBkaWFnbm9zdGljLFxuICAgIHV1aWQ6IHV1aWQ0KCksXG4gIH07XG5cbiAgaXRlbS5kYXRhID0gaXRlbS5kYXRhIHx8IHt9O1xuXG4gIHNldEN1c3RvbUl0ZW1LZXlzKGl0ZW0sIGN1c3RvbSk7XG5cbiAgaWYgKHJlcXVlc3RLZXlzICYmIHJlcXVlc3QpIHtcbiAgICBpdGVtLnJlcXVlc3QgPSByZXF1ZXN0O1xuICB9XG4gIGlmIChsYW1iZGFDb250ZXh0KSB7XG4gICAgaXRlbS5sYW1iZGFDb250ZXh0ID0gbGFtYmRhQ29udGV4dDtcbiAgfVxuICBpdGVtLl9vcmlnaW5hbEFyZ3MgPSBhcmdzO1xuICBpdGVtLmRpYWdub3N0aWMub3JpZ2luYWxfYXJnX3R5cGVzID0gYXJnVHlwZXM7XG4gIHJldHVybiBpdGVtO1xufVxuXG5mdW5jdGlvbiBzZXRDdXN0b21JdGVtS2V5cyhpdGVtLCBjdXN0b20pIHtcbiAgaWYgKGN1c3RvbSAmJiBjdXN0b20ubGV2ZWwgIT09IHVuZGVmaW5lZCkge1xuICAgIGl0ZW0ubGV2ZWwgPSBjdXN0b20ubGV2ZWw7XG4gICAgZGVsZXRlIGN1c3RvbS5sZXZlbDtcbiAgfVxuICBpZiAoY3VzdG9tICYmIGN1c3RvbS5za2lwRnJhbWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICBpdGVtLnNraXBGcmFtZXMgPSBjdXN0b20uc2tpcEZyYW1lcztcbiAgICBkZWxldGUgY3VzdG9tLnNraXBGcmFtZXM7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkRXJyb3JDb250ZXh0KGl0ZW0sIGVycm9ycykge1xuICB2YXIgY3VzdG9tID0gaXRlbS5kYXRhLmN1c3RvbSB8fCB7fTtcbiAgdmFyIGNvbnRleHRBZGRlZCA9IGZhbHNlO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlcnJvcnMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChlcnJvcnNbaV0uaGFzT3duUHJvcGVydHkoJ3JvbGxiYXJDb250ZXh0JykpIHtcbiAgICAgICAgY3VzdG9tID0gbWVyZ2UoY3VzdG9tLCBub25DaXJjdWxhckNsb25lKGVycm9yc1tpXS5yb2xsYmFyQ29udGV4dCkpO1xuICAgICAgICBjb250ZXh0QWRkZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEF2b2lkIGFkZGluZyBhbiBlbXB0eSBvYmplY3QgdG8gdGhlIGRhdGEuXG4gICAgaWYgKGNvbnRleHRBZGRlZCkge1xuICAgICAgaXRlbS5kYXRhLmN1c3RvbSA9IGN1c3RvbTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpdGVtLmRpYWdub3N0aWMuZXJyb3JfY29udGV4dCA9ICdGYWlsZWQ6ICcgKyBlLm1lc3NhZ2U7XG4gIH1cbn1cblxudmFyIFRFTEVNRVRSWV9UWVBFUyA9IFtcbiAgJ2xvZycsXG4gICduZXR3b3JrJyxcbiAgJ2RvbScsXG4gICduYXZpZ2F0aW9uJyxcbiAgJ2Vycm9yJyxcbiAgJ21hbnVhbCcsXG5dO1xudmFyIFRFTEVNRVRSWV9MRVZFTFMgPSBbJ2NyaXRpY2FsJywgJ2Vycm9yJywgJ3dhcm5pbmcnLCAnaW5mbycsICdkZWJ1ZyddO1xuXG5mdW5jdGlvbiBhcnJheUluY2x1ZGVzKGFyciwgdmFsKSB7XG4gIGZvciAodmFyIGsgPSAwOyBrIDwgYXJyLmxlbmd0aDsgKytrKSB7XG4gICAgaWYgKGFycltrXSA9PT0gdmFsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRlbGVtZXRyeUV2ZW50KGFyZ3MpIHtcbiAgdmFyIHR5cGUsIG1ldGFkYXRhLCBsZXZlbDtcbiAgdmFyIGFyZztcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3MubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcblxuICAgIHZhciB0eXAgPSB0eXBlTmFtZShhcmcpO1xuICAgIHN3aXRjaCAodHlwKSB7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBpZiAoIXR5cGUgJiYgYXJyYXlJbmNsdWRlcyhURUxFTUVUUllfVFlQRVMsIGFyZykpIHtcbiAgICAgICAgICB0eXBlID0gYXJnO1xuICAgICAgICB9IGVsc2UgaWYgKCFsZXZlbCAmJiBhcnJheUluY2x1ZGVzKFRFTEVNRVRSWV9MRVZFTFMsIGFyZykpIHtcbiAgICAgICAgICBsZXZlbCA9IGFyZztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIG1ldGFkYXRhID0gYXJnO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICB2YXIgZXZlbnQgPSB7XG4gICAgdHlwZTogdHlwZSB8fCAnbWFudWFsJyxcbiAgICBtZXRhZGF0YTogbWV0YWRhdGEgfHwge30sXG4gICAgbGV2ZWw6IGxldmVsLFxuICB9O1xuXG4gIHJldHVybiBldmVudDtcbn1cblxuZnVuY3Rpb24gYWRkSXRlbUF0dHJpYnV0ZXMoaXRlbSwgYXR0cmlidXRlcykge1xuICBpdGVtLmRhdGEuYXR0cmlidXRlcyA9IGl0ZW0uZGF0YS5hdHRyaWJ1dGVzIHx8IFtdO1xuICBpZiAoYXR0cmlidXRlcykge1xuICAgIGl0ZW0uZGF0YS5hdHRyaWJ1dGVzLnB1c2goLi4uYXR0cmlidXRlcyk7XG4gIH1cbn1cblxuLypcbiAqIGdldCAtIGdpdmVuIGFuIG9iai9hcnJheSBhbmQgYSBrZXlwYXRoLCByZXR1cm4gdGhlIHZhbHVlIGF0IHRoYXQga2V5cGF0aCBvclxuICogICAgICAgdW5kZWZpbmVkIGlmIG5vdCBwb3NzaWJsZS5cbiAqXG4gKiBAcGFyYW0gb2JqIC0gYW4gb2JqZWN0IG9yIGFycmF5XG4gKiBAcGFyYW0gcGF0aCAtIGEgc3RyaW5nIG9mIGtleXMgc2VwYXJhdGVkIGJ5ICcuJyBzdWNoIGFzICdwbHVnaW4uanF1ZXJ5LjAubWVzc2FnZSdcbiAqICAgIHdoaWNoIHdvdWxkIGNvcnJlc3BvbmQgdG8gNDIgaW4gYHtwbHVnaW46IHtqcXVlcnk6IFt7bWVzc2FnZTogNDJ9XX19YFxuICovXG5mdW5jdGlvbiBnZXQob2JqLCBwYXRoKSB7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICB2YXIga2V5cyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgdmFyIHJlc3VsdCA9IG9iajtcbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0ga2V5cy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0W2tleXNbaV1dO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzZXQob2JqLCBwYXRoLCB2YWx1ZSkge1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIga2V5cyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgdmFyIGxlbiA9IGtleXMubGVuZ3RoO1xuICBpZiAobGVuIDwgMSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAobGVuID09PSAxKSB7XG4gICAgb2JqW2tleXNbMF1dID0gdmFsdWU7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRyeSB7XG4gICAgdmFyIHRlbXAgPSBvYmpba2V5c1swXV0gfHwge307XG4gICAgdmFyIHJlcGxhY2VtZW50ID0gdGVtcDtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxlbiAtIDE7ICsraSkge1xuICAgICAgdGVtcFtrZXlzW2ldXSA9IHRlbXBba2V5c1tpXV0gfHwge307XG4gICAgICB0ZW1wID0gdGVtcFtrZXlzW2ldXTtcbiAgICB9XG4gICAgdGVtcFtrZXlzW2xlbiAtIDFdXSA9IHZhbHVlO1xuICAgIG9ialtrZXlzWzBdXSA9IHJlcGxhY2VtZW50O1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3NBc1N0cmluZyhhcmdzKSB7XG4gIHZhciBpLCBsZW4sIGFyZztcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKGkgPSAwLCBsZW4gPSBhcmdzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcbiAgICBzd2l0Y2ggKHR5cGVOYW1lKGFyZykpIHtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGFyZyA9IHN0cmluZ2lmeShhcmcpO1xuICAgICAgICBhcmcgPSBhcmcuZXJyb3IgfHwgYXJnLnZhbHVlO1xuICAgICAgICBpZiAoYXJnLmxlbmd0aCA+IDUwMCkge1xuICAgICAgICAgIGFyZyA9IGFyZy5zdWJzdHIoMCwgNDk3KSArICcuLi4nO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbnVsbCc6XG4gICAgICAgIGFyZyA9ICdudWxsJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICBhcmcgPSAndW5kZWZpbmVkJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzeW1ib2wnOlxuICAgICAgICBhcmcgPSBhcmcudG9TdHJpbmcoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKGFyZyk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdC5qb2luKCcgJyk7XG59XG5cbmZ1bmN0aW9uIG5vdygpIHtcbiAgaWYgKERhdGUubm93KSB7XG4gICAgcmV0dXJuICtEYXRlLm5vdygpO1xuICB9XG4gIHJldHVybiArbmV3IERhdGUoKTtcbn1cblxuZnVuY3Rpb24gZmlsdGVySXAocmVxdWVzdERhdGEsIGNhcHR1cmVJcCkge1xuICBpZiAoIXJlcXVlc3REYXRhIHx8ICFyZXF1ZXN0RGF0YVsndXNlcl9pcCddIHx8IGNhcHR1cmVJcCA9PT0gdHJ1ZSkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbmV3SXAgPSByZXF1ZXN0RGF0YVsndXNlcl9pcCddO1xuICBpZiAoIWNhcHR1cmVJcCkge1xuICAgIG5ld0lwID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICB0cnkge1xuICAgICAgdmFyIHBhcnRzO1xuICAgICAgaWYgKG5ld0lwLmluZGV4T2YoJy4nKSAhPT0gLTEpIHtcbiAgICAgICAgcGFydHMgPSBuZXdJcC5zcGxpdCgnLicpO1xuICAgICAgICBwYXJ0cy5wb3AoKTtcbiAgICAgICAgcGFydHMucHVzaCgnMCcpO1xuICAgICAgICBuZXdJcCA9IHBhcnRzLmpvaW4oJy4nKTtcbiAgICAgIH0gZWxzZSBpZiAobmV3SXAuaW5kZXhPZignOicpICE9PSAtMSkge1xuICAgICAgICBwYXJ0cyA9IG5ld0lwLnNwbGl0KCc6Jyk7XG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgdmFyIGJlZ2lubmluZyA9IHBhcnRzLnNsaWNlKDAsIDMpO1xuICAgICAgICAgIHZhciBzbGFzaElkeCA9IGJlZ2lubmluZ1syXS5pbmRleE9mKCcvJyk7XG4gICAgICAgICAgaWYgKHNsYXNoSWR4ICE9PSAtMSkge1xuICAgICAgICAgICAgYmVnaW5uaW5nWzJdID0gYmVnaW5uaW5nWzJdLnN1YnN0cmluZygwLCBzbGFzaElkeCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB0ZXJtaW5hbCA9ICcwMDAwOjAwMDA6MDAwMDowMDAwOjAwMDAnO1xuICAgICAgICAgIG5ld0lwID0gYmVnaW5uaW5nLmNvbmNhdCh0ZXJtaW5hbCkuam9pbignOicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdJcCA9IG51bGw7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbmV3SXAgPSBudWxsO1xuICAgIH1cbiAgfVxuICByZXF1ZXN0RGF0YVsndXNlcl9pcCddID0gbmV3SXA7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU9wdGlvbnMoY3VycmVudCwgaW5wdXQsIHBheWxvYWQsIGxvZ2dlcikge1xuICB2YXIgcmVzdWx0ID0gbWVyZ2UoY3VycmVudCwgaW5wdXQsIHBheWxvYWQpO1xuICByZXN1bHQgPSB1cGRhdGVEZXByZWNhdGVkT3B0aW9ucyhyZXN1bHQsIGxvZ2dlcik7XG4gIGlmICghaW5wdXQgfHwgaW5wdXQub3ZlcndyaXRlU2NydWJGaWVsZHMpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGlmIChpbnB1dC5zY3J1YkZpZWxkcykge1xuICAgIHJlc3VsdC5zY3J1YkZpZWxkcyA9IChjdXJyZW50LnNjcnViRmllbGRzIHx8IFtdKS5jb25jYXQoaW5wdXQuc2NydWJGaWVsZHMpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZURlcHJlY2F0ZWRPcHRpb25zKG9wdGlvbnMsIGxvZ2dlcikge1xuICBpZiAob3B0aW9ucy5ob3N0V2hpdGVMaXN0ICYmICFvcHRpb25zLmhvc3RTYWZlTGlzdCkge1xuICAgIG9wdGlvbnMuaG9zdFNhZmVMaXN0ID0gb3B0aW9ucy5ob3N0V2hpdGVMaXN0O1xuICAgIG9wdGlvbnMuaG9zdFdoaXRlTGlzdCA9IHVuZGVmaW5lZDtcbiAgICBsb2dnZXIgJiYgbG9nZ2VyLmxvZygnaG9zdFdoaXRlTGlzdCBpcyBkZXByZWNhdGVkLiBVc2UgaG9zdFNhZmVMaXN0LicpO1xuICB9XG4gIGlmIChvcHRpb25zLmhvc3RCbGFja0xpc3QgJiYgIW9wdGlvbnMuaG9zdEJsb2NrTGlzdCkge1xuICAgIG9wdGlvbnMuaG9zdEJsb2NrTGlzdCA9IG9wdGlvbnMuaG9zdEJsYWNrTGlzdDtcbiAgICBvcHRpb25zLmhvc3RCbGFja0xpc3QgPSB1bmRlZmluZWQ7XG4gICAgbG9nZ2VyICYmIGxvZ2dlci5sb2coJ2hvc3RCbGFja0xpc3QgaXMgZGVwcmVjYXRlZC4gVXNlIGhvc3RCbG9ja0xpc3QuJyk7XG4gIH1cbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aDogYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGgsXG4gIGNyZWF0ZUl0ZW06IGNyZWF0ZUl0ZW0sXG4gIGFkZEVycm9yQ29udGV4dDogYWRkRXJyb3JDb250ZXh0LFxuICBjcmVhdGVUZWxlbWV0cnlFdmVudDogY3JlYXRlVGVsZW1ldHJ5RXZlbnQsXG4gIGFkZEl0ZW1BdHRyaWJ1dGVzOiBhZGRJdGVtQXR0cmlidXRlcyxcbiAgZmlsdGVySXA6IGZpbHRlcklwLFxuICBmb3JtYXRBcmdzQXNTdHJpbmc6IGZvcm1hdEFyZ3NBc1N0cmluZyxcbiAgZm9ybWF0VXJsOiBmb3JtYXRVcmwsXG4gIGdldDogZ2V0LFxuICBoYW5kbGVPcHRpb25zOiBoYW5kbGVPcHRpb25zLFxuICBpc0Vycm9yOiBpc0Vycm9yLFxuICBpc0Zpbml0ZU51bWJlcjogaXNGaW5pdGVOdW1iZXIsXG4gIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gIGlzSXRlcmFibGU6IGlzSXRlcmFibGUsXG4gIGlzTmF0aXZlRnVuY3Rpb246IGlzTmF0aXZlRnVuY3Rpb24sXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc1R5cGU6IGlzVHlwZSxcbiAgaXNQcm9taXNlOiBpc1Byb21pc2UsXG4gIGlzQnJvd3NlcjogaXNCcm93c2VyLFxuICBqc29uUGFyc2U6IGpzb25QYXJzZSxcbiAgTEVWRUxTOiBMRVZFTFMsXG4gIG1ha2VVbmhhbmRsZWRTdGFja0luZm86IG1ha2VVbmhhbmRsZWRTdGFja0luZm8sXG4gIG1lcmdlOiBtZXJnZSxcbiAgbm93OiBub3csXG4gIHJlZGFjdDogcmVkYWN0LFxuICBSb2xsYmFySlNPTjogUm9sbGJhckpTT04sXG4gIHNhbml0aXplVXJsOiBzYW5pdGl6ZVVybCxcbiAgc2V0OiBzZXQsXG4gIHNldHVwSlNPTjogc2V0dXBKU09OLFxuICBzdHJpbmdpZnk6IHN0cmluZ2lmeSxcbiAgbWF4Qnl0ZVNpemU6IG1heEJ5dGVTaXplLFxuICB0eXBlTmFtZTogdHlwZU5hbWUsXG4gIHV1aWQ0OiB1dWlkNCxcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLyogZ2xvYmFscyBleHBlY3QgKi9cbi8qIGdsb2JhbHMgZGVzY3JpYmUgKi9cbi8qIGdsb2JhbHMgaXQgKi9cblxudmFyIF8gPSByZXF1aXJlKCcuLi9zcmMvdXRpbGl0eScpO1xudmFyIHQgPSByZXF1aXJlKCcuLi9zcmMvdHJhbnNmb3JtcycpO1xuXG5mdW5jdGlvbiBpdGVtRnJvbUFyZ3MoYXJncykge1xuICB2YXIgaXRlbSA9IF8uY3JlYXRlSXRlbShhcmdzKTtcbiAgaXRlbS5sZXZlbCA9ICdkZWJ1Zyc7XG4gIHJldHVybiBpdGVtO1xufVxuXG52YXIgZmFrZUxvZ2dlciA9IHtcbiAgZXJyb3I6IGZ1bmN0aW9uICgpIHt9LFxuICBsb2c6IGZ1bmN0aW9uICgpIHt9LFxufTtcblxuZGVzY3JpYmUoJ2l0ZW1Ub1BheWxvYWQnLCBmdW5jdGlvbiAoKSB7XG4gIGl0KCdpZ25vcmVzIG9wdGlvbnMucGF5bG9hZC5ib2R5IGJ1dCBtZXJnZXMgaW4gb3RoZXIgcGF5bG9hZCBvcHRpb25zJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgYXJncyA9IFsnYSBtZXNzYWdlJywgeyBjdXN0b206ICdzdHVmZicgfV07XG4gICAgdmFyIGl0ZW0gPSBpdGVtRnJvbUFyZ3MoYXJncyk7XG4gICAgaXRlbS5hY2Nlc3NUb2tlbiA9ICdhYmMxMjMnO1xuICAgIGl0ZW0uX2lzVW5jYXVnaHQgPSB0cnVlO1xuICAgIGl0ZW0uX29yaWdpbmFsQXJncyA9IFsnYycsIDNdO1xuICAgIGl0ZW0uZGF0YSA9IHt9O1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgZW5kcG9pbnQ6ICdhcGkucm9sbGJhci5jb20nLFxuICAgICAgcGF5bG9hZDogeyBib2R5OiAnaGV5JywgeDogNDIgfSxcbiAgICB9O1xuICAgIHQuaXRlbVRvUGF5bG9hZChpdGVtLCBvcHRpb25zLCBmdW5jdGlvbiAoZSwgaSkge1xuICAgICAgZXhwZWN0KGkuX2lzVW5jYXVnaHQpLnRvLmVxbChpdGVtLl9pc1VuY2F1Z2h0KTtcbiAgICAgIGV4cGVjdChpLl9vcmlnaW5hbEFyZ3MpLnRvLmVxbChpdGVtLl9vcmlnaW5hbEFyZ3MpO1xuXG4gICAgICAvLyBUaGlzIHRyYW5zZm9ybSBzaG91bGRuJ3QgYXBwbHkgYW55IHBheWxvYWQga2V5cy5cbiAgICAgIGV4cGVjdChpLmJvZHkpLnRvLm5vdC5lcWwoJ2hleScpO1xuICAgICAgZXhwZWN0KGkueCkudG8ubm90LmVxbCg0Mik7XG4gICAgICBkb25lKGUpO1xuICAgIH0pO1xuICB9KTtcbiAgaXQoJ2lnbm9yZXMgaGFuZGxlcyB0cmFpbGluZyBzbGFzaCBpbiBlbmRwb2ludCcsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIGFyZ3MgPSBbJ2EgbWVzc2FnZScsIHsgY3VzdG9tOiAnc3R1ZmYnIH1dO1xuICAgIHZhciBpdGVtID0gaXRlbUZyb21BcmdzKGFyZ3MpO1xuICAgIGl0ZW0uYWNjZXNzVG9rZW4gPSAnYWJjMTIzJztcbiAgICBpdGVtLmRhdGEgPSB7IG1lc3NhZ2U6ICdhIG1lc3NhZ2UnIH07XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBlbmRwb2ludDogJ2FwaS5yb2xsYmFyLmNvbS8nLFxuICAgIH07XG4gICAgdC5pdGVtVG9QYXlsb2FkKGl0ZW0sIG9wdGlvbnMsIGZ1bmN0aW9uIChlLCBpKSB7XG4gICAgICBleHBlY3QoaS5tZXNzYWdlKS50by5lcWwoJ2EgbWVzc2FnZScpO1xuICAgICAgZG9uZShlKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2FkZFBheWxvYWRPcHRpb25zJywgZnVuY3Rpb24gKCkge1xuICBpdCgnaWdub3JlcyBvcHRpb25zLnBheWxvYWQuYm9keSBidXQgbWVyZ2VzIGluIG90aGVyIHBheWxvYWQgb3B0aW9ucycsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIGFyZ3MgPSBbJ2EgbWVzc2FnZScsIHsgY3VzdG9tOiAnc3R1ZmYnIH1dO1xuICAgIHZhciBpdGVtID0gaXRlbUZyb21BcmdzKGFyZ3MpO1xuICAgIGl0ZW0uYWNjZXNzVG9rZW4gPSAnYWJjMTIzJztcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIGVuZHBvaW50OiAnYXBpLnJvbGxiYXIuY29tJyxcbiAgICAgIHBheWxvYWQ6IHsgYm9keTogJ2hleScsIHg6IDQyIH0sXG4gICAgfTtcbiAgICB0LmFkZFBheWxvYWRPcHRpb25zKGl0ZW0sIG9wdGlvbnMsIGZ1bmN0aW9uIChlLCBpKSB7XG4gICAgICBleHBlY3QoaS5kYXRhLmJvZHkpLnRvLm5vdC5lcWwoJ2hleScpO1xuICAgICAgZXhwZWN0KGkuZGF0YS54KS50by5lcWwoNDIpO1xuICAgICAgZG9uZShlKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2FkZFRlbGVtZXRyeURhdGEnLCBmdW5jdGlvbiAoKSB7XG4gIGl0KCdhZGRzIHRoZSBkYXRhIHRvIHRoZSByaWdodCBwbGFjZSBpZiBldmVudHMgZXhpc3QnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBpdGVtID0ge1xuICAgICAgZGF0YToge1xuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgbWVzc2FnZTogJ2hlbGxvIHdvcmxkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB0ZWxlbWV0cnlFdmVudHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdsb2cnLFxuICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgIHN1YnR5cGU6ICdjb25zb2xlJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdib3JrJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRpbWVzdGFtcF9tczogMTIzNDUsXG4gICAgICAgICAgbGV2ZWw6ICdpbmZvJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdtYW51YWwnLFxuICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgIGhlbGxvOiAnd29ybGQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdGltZXN0YW1wX21zOiA4ODg4OSxcbiAgICAgICAgICBsZXZlbDogJ2luZm8nLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICAgIHZhciBvcHRpb25zID0ge307XG4gICAgdC5hZGRUZWxlbWV0cnlEYXRhKGl0ZW0sIG9wdGlvbnMsIGZ1bmN0aW9uIChlLCBpKSB7XG4gICAgICBleHBlY3QoaS5kYXRhLmJvZHkudGVsZW1ldHJ5Lmxlbmd0aCkudG8uZXFsKDIpO1xuICAgICAgZXhwZWN0KGkuZGF0YS5ib2R5LnRlbGVtZXRyeVswXS50eXBlKS50by5lcWwoJ2xvZycpO1xuICAgICAgZG9uZShlKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2FkZENvbmZpZ3VyZWRPcHRpb25zJywgZnVuY3Rpb24gKCkge1xuICBpdCgnYWRkcyB0aGUgY29uZmlndXJlZCBvcHRpb25zJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgaXRlbSA9IHtcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIG1lc3NhZ2U6ICdoZWxsbyB3b3JsZCcsXG4gICAgICAgIH0sXG4gICAgICAgIG5vdGlmaWVyOiB7XG4gICAgICAgICAgbmFtZTogJ3JvbGxiYXItanMnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgYWNjZXNzVG9rZW46ICdhYmMxMjMnLFxuICAgICAgZm9vOiAnYmFyJyxcbiAgICAgIGNhcHR1cmVVbmNhdWdodDogdHJ1ZSxcbiAgICAgIF9jb25maWd1cmVkT3B0aW9uczoge1xuICAgICAgICBhY2Nlc3NUb2tlbjogJ2FiYzEyMycsXG4gICAgICAgIGNhcHR1cmVVbmNhdWdodDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICB0LmFkZENvbmZpZ3VyZWRPcHRpb25zKGl0ZW0sIG9wdGlvbnMsIGZ1bmN0aW9uIChlLCBpKSB7XG4gICAgICBleHBlY3QoaS5kYXRhLm5vdGlmaWVyLmNvbmZpZ3VyZWRfb3B0aW9ucykudG8uZXFsKHtcbiAgICAgICAgY2FwdHVyZVVuY2F1Z2h0OiB0cnVlLFxuICAgICAgfSk7XG4gICAgICBkb25lKGUpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgndXNlclRyYW5zZm9ybScsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ2NhbGxzIHVzZXIgdHJhbnNmb3JtIGlmIGlzIHByZXNlbnQgYW5kIGEgZnVuY3Rpb24nLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBhcmdzID0gWydhIG1lc3NhZ2UnXTtcbiAgICB2YXIgaXRlbSA9IGl0ZW1Gcm9tQXJncyhhcmdzKTtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIGVuZHBvaW50OiAnYXBpLnJvbGxiYXIuY29tJyxcbiAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24gKG5ld0l0ZW0sIGl0ZW0pIHtcbiAgICAgICAgbmV3SXRlbS5vcmlnaW4gPSBpdGVtO1xuICAgICAgICBuZXdJdGVtLm1lc3NhZ2UgPSAnSEVMTE8nO1xuICAgICAgfSxcbiAgICB9O1xuICAgIHZhciBwYXlsb2FkID0ge1xuICAgICAgYWNjZXNzX3Rva2VuOiAnMTIzJyxcbiAgICAgIGRhdGE6IGl0ZW0sXG4gICAgfTtcbiAgICBleHBlY3QocGF5bG9hZC5kYXRhLm1lc3NhZ2UpLnRvLm5vdC5lcWwoJ0hFTExPJyk7XG4gICAgdC51c2VyVHJhbnNmb3JtKGZha2VMb2dnZXIpKHBheWxvYWQsIG9wdGlvbnMsIGZ1bmN0aW9uIChlLCBpKSB7XG4gICAgICBleHBlY3QoaS5kYXRhLm9yaWdpbikudG8uYmUuYW4oJ29iamVjdCcpO1xuICAgICAgZXhwZWN0KGkuZGF0YS5tZXNzYWdlKS50by5lcWwoJ0hFTExPJyk7XG4gICAgICBkb25lKGUpO1xuICAgIH0pO1xuICB9KTtcbiAgaXQoJ2RvZXMgbm90aGluZyBpZiB0cmFuc2Zvcm0gaXMgbm90IGEgZnVuY3Rpb24nLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBhcmdzID0gWydhIG1lc3NhZ2UnXTtcbiAgICB2YXIgaXRlbSA9IGl0ZW1Gcm9tQXJncyhhcmdzKTtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIGVuZHBvaW50OiAnYXBpLnJvbGxiYXIuY29tJyxcbiAgICAgIHRyYW5zZm9ybTogJ2hpIHRoZXJlJyxcbiAgICB9O1xuICAgIHZhciBwYXlsb2FkID0ge1xuICAgICAgYWNjZXNzX3Rva2VuOiAnMTIzJyxcbiAgICAgIGRhdGE6IGl0ZW0sXG4gICAgfTtcbiAgICBleHBlY3QocGF5bG9hZC5kYXRhLm1lc3NhZ2UpLnRvLm5vdC5lcWwoJ0hFTExPJyk7XG4gICAgdC51c2VyVHJhbnNmb3JtKGZha2VMb2dnZXIpKHBheWxvYWQsIG9wdGlvbnMsIGZ1bmN0aW9uIChlLCBpKSB7XG4gICAgICBleHBlY3QoaS5kYXRhLm1lc3NhZ2UpLnRvLm5vdC5lcWwoJ0hFTExPJyk7XG4gICAgICBkb25lKGUpO1xuICAgIH0pO1xuICB9KTtcbiAgaXQoJ2RvZXMgbm90aGluZyBpZiB0cmFuc2Zvcm0gdGhyb3dzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgYXJncyA9IFsnYSBtZXNzYWdlJ107XG4gICAgdmFyIGl0ZW0gPSBpdGVtRnJvbUFyZ3MoYXJncyk7XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBlbmRwb2ludDogJ2FwaS5yb2xsYmFyLmNvbScsXG4gICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uIChpKSB7XG4gICAgICAgIGkuZGF0YS5tZXNzYWdlID0gJ0hFTExPJztcbiAgICAgICAgdGhyb3cgJ2JvcmsnO1xuICAgICAgfSxcbiAgICB9O1xuICAgIHZhciBwYXlsb2FkID0ge1xuICAgICAgYWNjZXNzX3Rva2VuOiAnMTIzJyxcbiAgICAgIGRhdGE6IGl0ZW0sXG4gICAgfTtcbiAgICBleHBlY3QocGF5bG9hZC5kYXRhLm1lc3NhZ2UpLnRvLm5vdC5lcWwoJ0hFTExPJyk7XG4gICAgdC51c2VyVHJhbnNmb3JtKGZha2VMb2dnZXIpKHBheWxvYWQsIG9wdGlvbnMsIGZ1bmN0aW9uIChlLCBpKSB7XG4gICAgICBleHBlY3QoaS5kYXRhLm1lc3NhZ2UpLnRvLm5vdC5lcWwoJ0hFTExPJyk7XG4gICAgICBleHBlY3Qob3B0aW9ucy50cmFuc2Zvcm0pLnRvLm5vdC5iZS5vaygpO1xuICAgICAgZG9uZShlKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3dhaXRzIGZvciBwcm9taXNlIHJlc29sdXRpb24gaWYgdHJhbnNmb3JtIHJldHVybnMgYSBwcm9taXNlJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgYXJncyA9IFsnYSBtZXNzYWdlJ107XG4gICAgdmFyIGl0ZW0gPSBpdGVtRnJvbUFyZ3MoYXJncyk7XG4gICAgdmFyIHBheWxvYWQgPSB7XG4gICAgICBhY2Nlc3NfdG9rZW46ICcxMjMnLFxuICAgICAgZGF0YTogaXRlbSxcbiAgICB9O1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgZW5kcG9pbnQ6ICdhcGkucm9sbGJhci5jb20nLFxuICAgICAgdHJhbnNmb3JtOiBmdW5jdGlvbiAobmV3SXRlbSkge1xuICAgICAgICBuZXdJdGVtLm1lc3NhZ2UgPSAnSEVMTE8nO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICB9LFxuICAgIH07XG4gICAgdC51c2VyVHJhbnNmb3JtKGZha2VMb2dnZXIpKHBheWxvYWQsIG9wdGlvbnMsIGZ1bmN0aW9uIChlLCBpKSB7XG4gICAgICBleHBlY3QoaS5kYXRhLm1lc3NhZ2UpLnRvLmVxbCgnSEVMTE8nKTtcbiAgICAgIGRvbmUoZSk7XG4gICAgfSk7XG4gICAgZXhwZWN0KHBheWxvYWQuZGF0YS5tZXNzYWdlKS50by5ub3QuZXFsKCdIRUxMTycpO1xuICB9KTtcblxuICBpdCgndXNlcyByZXNvbHZlZCB2YWx1ZSBpZiB0cmFuc2Zvcm0gcmV0dXJucyBhIHByb21pc2Ugd2l0aCBhIHZhbHVlJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgYXJncyA9IFsnYSBtZXNzYWdlJ107XG4gICAgdmFyIGl0ZW0gPSBpdGVtRnJvbUFyZ3MoYXJncyk7XG4gICAgdmFyIHBheWxvYWQgPSB7XG4gICAgICBhY2Nlc3NfdG9rZW46ICcxMjMnLFxuICAgICAgZGF0YTogaXRlbSxcbiAgICB9O1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgZW5kcG9pbnQ6ICdhcGkucm9sbGJhci5jb20nLFxuICAgICAgdHJhbnNmb3JtOiBmdW5jdGlvbiAobmV3SXRlbSkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHsgbWVzc2FnZTogJ0hFTExPJyB9KTtcbiAgICAgIH0sXG4gICAgfTtcbiAgICB0LnVzZXJUcmFuc2Zvcm0oZmFrZUxvZ2dlcikocGF5bG9hZCwgb3B0aW9ucywgZnVuY3Rpb24gKGUsIGkpIHtcbiAgICAgIGV4cGVjdChpLmRhdGEubWVzc2FnZSkudG8uZXFsKCdIRUxMTycpO1xuICAgICAgZXhwZWN0KGkuZGF0YSkudG8ubm90LmVxbChpdGVtKTtcbiAgICAgIGRvbmUoZSk7XG4gICAgfSk7XG4gICAgZXhwZWN0KHBheWxvYWQuZGF0YS5tZXNzYWdlKS50by5ub3QuZXFsKCdIRUxMTycpO1xuICB9KTtcblxuICBpdCgndXNlcyB1bnRyYW5zZm9ybWVkIHZhbHVlIGlmIHRyYW5zZm9ybSByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlamVjdHMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBhcmdzID0gWydhIG1lc3NhZ2UnXTtcbiAgICB2YXIgaXRlbSA9IGl0ZW1Gcm9tQXJncyhhcmdzKTtcbiAgICB2YXIgZXJyID0geyBtZXNzYWdlOiAnSEVMTE8nIH07XG4gICAgdmFyIHBheWxvYWQgPSB7XG4gICAgICBhY2Nlc3NfdG9rZW46ICcxMjMnLFxuICAgICAgZGF0YTogaXRlbSxcbiAgICB9O1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgZW5kcG9pbnQ6ICdhcGkucm9sbGJhci5jb20nLFxuICAgICAgdHJhbnNmb3JtOiBmdW5jdGlvbiAobmV3SXRlbSkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgIH0sXG4gICAgfTtcbiAgICB0LnVzZXJUcmFuc2Zvcm0oZmFrZUxvZ2dlcikocGF5bG9hZCwgb3B0aW9ucywgZnVuY3Rpb24gKGUsIGkpIHtcbiAgICAgIGV4cGVjdChpLmRhdGEubWVzc2FnZSkudG8ubm90LmVxbCgnSEVMTE8nKTtcbiAgICAgIGV4cGVjdChpLmRhdGEpLnRvLmVxbChpdGVtKTtcbiAgICAgIGV4cGVjdChlKS50by5lcWwoZXJyKTtcbiAgICAgIGRvbmUoKTtcbiAgICB9KTtcbiAgICBleHBlY3QocGF5bG9hZC5kYXRhLm1lc3NhZ2UpLnRvLm5vdC5lcWwoJ0hFTExPJyk7XG4gIH0pO1xufSk7XG4iXSwibmFtZXMiOlsiaGFzT3duIiwiT2JqZWN0IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJ0b1N0ciIsInRvU3RyaW5nIiwiaXNQbGFpbk9iamVjdCIsIm9iaiIsImNhbGwiLCJoYXNPd25Db25zdHJ1Y3RvciIsImhhc0lzUHJvdG90eXBlT2YiLCJjb25zdHJ1Y3RvciIsImtleSIsIm1lcmdlIiwiaSIsInNyYyIsImNvcHkiLCJjbG9uZSIsIm5hbWUiLCJyZXN1bHQiLCJjdXJyZW50IiwibGVuZ3RoIiwiYXJndW1lbnRzIiwibW9kdWxlIiwiZXhwb3J0cyIsIl8iLCJyZXF1aXJlIiwiaXRlbVRvUGF5bG9hZCIsIml0ZW0iLCJvcHRpb25zIiwiY2FsbGJhY2siLCJkYXRhIiwiX2lzVW5jYXVnaHQiLCJfb3JpZ2luYWxBcmdzIiwiYWRkUGF5bG9hZE9wdGlvbnMiLCJwYXlsb2FkT3B0aW9ucyIsInBheWxvYWQiLCJib2R5IiwiYWRkVGVsZW1ldHJ5RGF0YSIsInRlbGVtZXRyeUV2ZW50cyIsInNldCIsImFkZE1lc3NhZ2VXaXRoRXJyb3IiLCJtZXNzYWdlIiwidHJhY2VQYXRoIiwidHJhY2UiLCJnZXQiLCJleGNlcHRpb24iLCJkZXNjcmlwdGlvbiIsImV4dHJhIiwibmV3RXh0cmEiLCJ1c2VyVHJhbnNmb3JtIiwibG9nZ2VyIiwibmV3SXRlbSIsInJlc3BvbnNlIiwiaXNGdW5jdGlvbiIsInRyYW5zZm9ybSIsImUiLCJlcnJvciIsImlzUHJvbWlzZSIsInRoZW4iLCJwcm9taXNlZEl0ZW0iLCJhZGRDb25maWdUb1BheWxvYWQiLCJzZW5kQ29uZmlnIiwiY29uZmlnS2V5IiwiY3VzdG9tIiwiYWRkRnVuY3Rpb25PcHRpb24iLCJhZGRDb25maWd1cmVkT3B0aW9ucyIsImNvbmZpZ3VyZWRPcHRpb25zIiwiX2NvbmZpZ3VyZWRPcHRpb25zIiwiYWNjZXNzVG9rZW4iLCJub3RpZmllciIsImNvbmZpZ3VyZWRfb3B0aW9ucyIsImFkZERpYWdub3N0aWNLZXlzIiwiZGlhZ25vc3RpYyIsImNsaWVudCIsImlzX2Fub255bW91cyIsImlzX3VuY2F1Z2h0IiwiZXJyIiwicmF3X2Vycm9yIiwiY29uc3RydWN0b3JfbmFtZSIsImZpbGVuYW1lIiwiZmlsZU5hbWUiLCJsaW5lIiwibGluZU51bWJlciIsImNvbHVtbiIsImNvbHVtbk51bWJlciIsInN0YWNrIiwiZmFpbGVkIiwiU3RyaW5nIiwiUm9sbGJhckpTT04iLCJzZXR1cEpTT04iLCJwb2x5ZmlsbEpTT04iLCJzdHJpbmdpZnkiLCJwYXJzZSIsImlzRGVmaW5lZCIsIkpTT04iLCJpc05hdGl2ZUZ1bmN0aW9uIiwiaXNUeXBlIiwieCIsInQiLCJ0eXBlTmFtZSIsIl90eXBlb2YiLCJFcnJvciIsIm1hdGNoIiwidG9Mb3dlckNhc2UiLCJmIiwicmVSZWdFeHBDaGFyIiwiZnVuY01hdGNoU3RyaW5nIiwiRnVuY3Rpb24iLCJyZXBsYWNlIiwicmVJc05hdGl2ZSIsIlJlZ0V4cCIsImlzT2JqZWN0IiwidGVzdCIsInZhbHVlIiwidHlwZSIsImlzU3RyaW5nIiwiaXNGaW5pdGVOdW1iZXIiLCJuIiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJ1IiwiaXNJdGVyYWJsZSIsImlzRXJyb3IiLCJwIiwiaXNCcm93c2VyIiwid2luZG93IiwicmVkYWN0IiwidXVpZDQiLCJkIiwibm93IiwidXVpZCIsImMiLCJyIiwiTWF0aCIsInJhbmRvbSIsImZsb29yIiwiTEVWRUxTIiwiZGVidWciLCJpbmZvIiwid2FybmluZyIsImNyaXRpY2FsIiwic2FuaXRpemVVcmwiLCJ1cmwiLCJiYXNlVXJsUGFydHMiLCJwYXJzZVVyaSIsImFuY2hvciIsInNvdXJjZSIsInF1ZXJ5IiwicGFyc2VVcmlPcHRpb25zIiwic3RyaWN0TW9kZSIsInEiLCJwYXJzZXIiLCJzdHJpY3QiLCJsb29zZSIsInN0ciIsInVuZGVmaW5lZCIsIm8iLCJtIiwiZXhlYyIsInVyaSIsImwiLCIkMCIsIiQxIiwiJDIiLCJhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aCIsInBhcmFtcyIsImFjY2Vzc190b2tlbiIsInBhcmFtc0FycmF5IiwiayIsInB1c2giLCJqb2luIiwic29ydCIsInBhdGgiLCJxcyIsImluZGV4T2YiLCJoIiwic3Vic3RyaW5nIiwiZm9ybWF0VXJsIiwicHJvdG9jb2wiLCJwb3J0IiwiaG9zdG5hbWUiLCJiYWNrdXAiLCJqc29uRXJyb3IiLCJiYWNrdXBFcnJvciIsIm1heEJ5dGVTaXplIiwic3RyaW5nIiwiY291bnQiLCJjb2RlIiwiY2hhckNvZGVBdCIsImpzb25QYXJzZSIsInMiLCJtYWtlVW5oYW5kbGVkU3RhY2tJbmZvIiwibGluZW5vIiwiY29sbm8iLCJtb2RlIiwiYmFja3VwTWVzc2FnZSIsImVycm9yUGFyc2VyIiwibG9jYXRpb24iLCJmdW5jIiwiZ3Vlc3NGdW5jdGlvbk5hbWUiLCJjb250ZXh0IiwiZ2F0aGVyQ29udGV4dCIsImhyZWYiLCJkb2N1bWVudCIsInVzZXJhZ2VudCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsIndyYXBDYWxsYmFjayIsInJlc3AiLCJub25DaXJjdWxhckNsb25lIiwic2VlbiIsIm5ld1NlZW4iLCJpbmNsdWRlcyIsInNsaWNlIiwiY3JlYXRlSXRlbSIsImFyZ3MiLCJyZXF1ZXN0S2V5cyIsImxhbWJkYUNvbnRleHQiLCJyZXF1ZXN0IiwiYXJnIiwiZXh0cmFBcmdzIiwiYXJnVHlwZXMiLCJ0eXAiLCJET01FeGNlcHRpb24iLCJqIiwibGVuIiwidGltZXN0YW1wIiwic2V0Q3VzdG9tSXRlbUtleXMiLCJvcmlnaW5hbF9hcmdfdHlwZXMiLCJsZXZlbCIsInNraXBGcmFtZXMiLCJhZGRFcnJvckNvbnRleHQiLCJlcnJvcnMiLCJjb250ZXh0QWRkZWQiLCJyb2xsYmFyQ29udGV4dCIsImVycm9yX2NvbnRleHQiLCJURUxFTUVUUllfVFlQRVMiLCJURUxFTUVUUllfTEVWRUxTIiwiYXJyYXlJbmNsdWRlcyIsImFyciIsInZhbCIsImNyZWF0ZVRlbGVtZXRyeUV2ZW50IiwibWV0YWRhdGEiLCJldmVudCIsImFkZEl0ZW1BdHRyaWJ1dGVzIiwiYXR0cmlidXRlcyIsIl9pdGVtJGRhdGEkYXR0cmlidXRlcyIsImFwcGx5IiwiX3RvQ29uc3VtYWJsZUFycmF5Iiwia2V5cyIsInNwbGl0IiwidGVtcCIsInJlcGxhY2VtZW50IiwiZm9ybWF0QXJnc0FzU3RyaW5nIiwic3Vic3RyIiwiRGF0ZSIsImZpbHRlcklwIiwicmVxdWVzdERhdGEiLCJjYXB0dXJlSXAiLCJuZXdJcCIsInBhcnRzIiwicG9wIiwiYmVnaW5uaW5nIiwic2xhc2hJZHgiLCJ0ZXJtaW5hbCIsImNvbmNhdCIsImhhbmRsZU9wdGlvbnMiLCJpbnB1dCIsInVwZGF0ZURlcHJlY2F0ZWRPcHRpb25zIiwib3ZlcndyaXRlU2NydWJGaWVsZHMiLCJzY3J1YkZpZWxkcyIsImhvc3RXaGl0ZUxpc3QiLCJob3N0U2FmZUxpc3QiLCJsb2ciLCJob3N0QmxhY2tMaXN0IiwiaG9zdEJsb2NrTGlzdCJdLCJzb3VyY2VSb290IjoiIn0=