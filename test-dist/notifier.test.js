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

/***/ "./src/notifier.js":
/*!*************************!*\
  !*** ./src/notifier.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");

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
  this.options = _.merge(oldOptions, options);
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
  if (_.isFunction(transform)) {
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
  if (!callback || !_.isFunction(callback)) {
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
module.exports = Notifier;

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
/*!*******************************!*\
  !*** ./test/notifier.test.js ***!
  \*******************************/
/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var Notifier = __webpack_require__(/*! ../src/notifier */ "./src/notifier.js");

var rollbarConfig = {
  accessToken: '12c99de67a444c229fca100e0967486f',
  captureUncaught: true,
};

function TestQueueGenerator() {
  var TestQueue = function () {
    this.items = [];
  };

  TestQueue.prototype.addPendingItem = function () {};
  TestQueue.prototype.removePendingItem = function () {};
  TestQueue.prototype.addItem = function (item, callback) {
    this.items.push({ item: item, callback: callback });
  };

  TestQueue.prototype.configure = function () {};

  return TestQueue;
}

describe('Notifier()', function () {
  it('should have all of the expected methods', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { enabled: true };
    var notifier = new Notifier(queue, options);
    expect(notifier).to.have.property('configure');
    expect(notifier).to.have.property('addTransform');
    expect(notifier).to.have.property('log');

    done();
  });
});

describe('configure', function () {
  it('should update the options', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { someBool: true, other: 'stuff', enabled: true };
    var notifier = new Notifier(queue, options);

    notifier.configure({ other: 'baz' });

    expect(notifier.options.someBool).to.be.ok();
    expect(notifier.options.other).to.eql('baz');

    done();
  });

  it('should pass the updated options to the transform', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { someBool: true, enabled: true };
    var notifier = new Notifier(queue, options);

    var initialItem = { a: 123, b: 'a string' };
    notifier
      .addTransform(function (i, o, cb) {
        expect(o.someBool).to.not.be.ok();
        cb(null, { a: 42, b: i.b });
      })
      .addTransform(function (i, o, cb) {
        expect(o.someBool).to.not.be.ok();
        cb(null, { a: i.a + 1, b: i.b });
      });

    notifier.configure({ someBool: false });

    var spy = sinon.spy();
    notifier.log(initialItem, spy);

    expect(spy.called).to.not.be.ok();
    expect(queue.items.length).to.eql(1);
    expect(queue.items[0].item).to.not.eql(initialItem);
    expect(queue.items[0].item.a).to.eql(43);
    expect(queue.items[0].item.b).to.eql('a string');

    done();
  });
  it('should not add an item if disabled in constructor', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { someBool: true, enabled: false };
    var notifier = new Notifier(queue, options);
    var initialItem = { a: 123, b: 'a string' };
    notifier.log(initialItem);
    expect(queue.items.length).to.eql(0);
    done();
  });
  it('should not add an item if disabled via call to configure', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { someBool: true, enabled: true };
    var notifier = new Notifier(queue, options);
    var initialItem = { a: 123, b: 'a string' };
    notifier.configure({ enabled: false });
    notifier.log(initialItem);
    expect(queue.items.length).to.eql(0);
    done();
  });
});

describe('addTransform', function () {
  it('should not add a non-function', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { enabled: true };
    var notifier = new Notifier(queue, options);

    expect(notifier.transforms.length).to.eql(0);
    notifier.addTransform('garbage');
    expect(notifier.transforms.length).to.eql(0);

    done();
  });

  it('should add a function', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { enabled: true };
    var notifier = new Notifier(queue, options);

    expect(notifier.transforms.length).to.eql(0);
    notifier.addTransform(function () {
      return;
    });
    expect(notifier.transforms.length).to.eql(1);

    done();
  });
});

describe('log', function () {
  it('should work without any transforms', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { enabled: true };
    var notifier = new Notifier(queue, options);

    var initialItem = { a: 123, b: 'a string' };
    var spy = sinon.spy();
    notifier.log(initialItem, spy);
    expect(spy.called).to.not.be.ok();
    expect(queue.items.length).to.eql(1);
    expect(queue.items[0].item).to.eql(initialItem);

    done();
  });

  it('should apply the transforms', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { enabled: true };
    var notifier = new Notifier(queue, options);

    var initialItem = { a: 123, b: 'a string' };
    notifier
      .addTransform(function (i, o, cb) {
        cb(null, { a: 42, b: i.b });
      })
      .addTransform(function (i, o, cb) {
        cb(null, { a: i.a + 1, b: i.b });
      });
    var spy = sinon.spy();
    notifier.log(initialItem, spy);

    expect(spy.called).to.not.be.ok();
    expect(queue.items.length).to.eql(1);
    expect(queue.items[0].item).to.not.eql(initialItem);
    expect(queue.items[0].item.a).to.eql(43);
    expect(queue.items[0].item.b).to.eql('a string');

    done();
  });

  it('should stop and callback if a transform errors', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { enabled: true };
    var notifier = new Notifier(queue, options);

    var initialItem = { a: 123, b: 'a string' };
    var error = new Error('fizz buzz');
    notifier
      .addTransform(function (i, o, cb) {
        cb(error, null);
      })
      .addTransform(function (i, o, cb) {
        expect(false).to.be.ok(); // assert this is not called
        cb(null, { a: 42, b: i.b });
      });
    var spy = sinon.spy();
    notifier.log(initialItem, spy);

    expect(spy.called).to.be.ok();
    expect(spy.calledWithExactly(error, null)).to.be.ok();
    expect(queue.items.length).to.eql(0);

    done();
  });

  it('should work without a callback', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { enabled: true };
    var notifier = new Notifier(queue, options);

    var initialItem = { a: 123, b: 'a string' };
    notifier
      .addTransform(function (i, o, cb) {
        cb(new Error('fizz buzz'), null);
      })
      .addTransform(function (i, o, cb) {
        expect(false).to.be.ok(); // assert this is not called
        cb(null, { a: 42, b: i.b });
      });
    notifier.log(initialItem);

    expect(queue.items.length).to.eql(0);

    done();
  });

  it('should pass the options to the transforms', function (done) {
    var queue = new (TestQueueGenerator())();
    var options = { enabled: true, someBool: true };
    var notifier = new Notifier(queue, options);

    var initialItem = { a: 123, b: 'a string' };
    notifier
      .addTransform(function (i, o, cb) {
        expect(o.someBool).to.be.ok();
        cb(null, { a: 42, b: i.b });
      })
      .addTransform(function (i, o, cb) {
        expect(o.someBool).to.be.ok();
        cb(null, { a: i.a + 1, b: i.b });
      });
    var spy = sinon.spy();
    notifier.log(initialItem, spy);

    expect(spy.called).to.not.be.ok();
    expect(queue.items.length).to.eql(1);
    expect(queue.items[0].item).to.not.eql(initialItem);
    expect(queue.items[0].item.a).to.eql(43);
    expect(queue.items[0].item.b).to.eql('a string');

    done();
  });
});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBLG9CQUFvQjtBQUNwQjs7QUFFQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMsT0FBTztBQUNQO0FBQ0E7QUFDQSxtQkFBbUIsb0JBQW9CO0FBQ3ZDLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0gsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3JvbGxiYXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvbWVyZ2UuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9ub3RpZmllci5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vdGVzdC9ub3RpZmllci50ZXN0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbnZhciBpc1BsYWluT2JqZWN0ID0gZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmopIHtcbiAgaWYgKCFvYmogfHwgdG9TdHIuY2FsbChvYmopICE9PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBoYXNPd25Db25zdHJ1Y3RvciA9IGhhc093bi5jYWxsKG9iaiwgJ2NvbnN0cnVjdG9yJyk7XG4gIHZhciBoYXNJc1Byb3RvdHlwZU9mID1cbiAgICBvYmouY29uc3RydWN0b3IgJiZcbiAgICBvYmouY29uc3RydWN0b3IucHJvdG90eXBlICYmXG4gICAgaGFzT3duLmNhbGwob2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgJ2lzUHJvdG90eXBlT2YnKTtcbiAgLy8gTm90IG93biBjb25zdHJ1Y3RvciBwcm9wZXJ0eSBtdXN0IGJlIE9iamVjdFxuICBpZiAob2JqLmNvbnN0cnVjdG9yICYmICFoYXNPd25Db25zdHJ1Y3RvciAmJiAhaGFzSXNQcm90b3R5cGVPZikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIE93biBwcm9wZXJ0aWVzIGFyZSBlbnVtZXJhdGVkIGZpcnN0bHksIHNvIHRvIHNwZWVkIHVwLFxuICAvLyBpZiBsYXN0IG9uZSBpcyBvd24sIHRoZW4gYWxsIHByb3BlcnRpZXMgYXJlIG93bi5cbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgLyoqL1xuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiBrZXkgPT09ICd1bmRlZmluZWQnIHx8IGhhc093bi5jYWxsKG9iaiwga2V5KTtcbn07XG5cbmZ1bmN0aW9uIG1lcmdlKCkge1xuICB2YXIgaSxcbiAgICBzcmMsXG4gICAgY29weSxcbiAgICBjbG9uZSxcbiAgICBuYW1lLFxuICAgIHJlc3VsdCA9IHt9LFxuICAgIGN1cnJlbnQgPSBudWxsLFxuICAgIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY3VycmVudCA9IGFyZ3VtZW50c1tpXTtcbiAgICBpZiAoY3VycmVudCA9PSBudWxsKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBmb3IgKG5hbWUgaW4gY3VycmVudCkge1xuICAgICAgc3JjID0gcmVzdWx0W25hbWVdO1xuICAgICAgY29weSA9IGN1cnJlbnRbbmFtZV07XG4gICAgICBpZiAocmVzdWx0ICE9PSBjb3B5KSB7XG4gICAgICAgIGlmIChjb3B5ICYmIGlzUGxhaW5PYmplY3QoY29weSkpIHtcbiAgICAgICAgICBjbG9uZSA9IHNyYyAmJiBpc1BsYWluT2JqZWN0KHNyYykgPyBzcmMgOiB7fTtcbiAgICAgICAgICByZXN1bHRbbmFtZV0gPSBtZXJnZShjbG9uZSwgY29weSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvcHkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgcmVzdWx0W25hbWVdID0gY29weTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlO1xuIiwidmFyIF8gPSByZXF1aXJlKCcuL3V0aWxpdHknKTtcblxuLypcbiAqIE5vdGlmaWVyIC0gdGhlIGludGVybmFsIG9iamVjdCByZXNwb25zaWJsZSBmb3IgZGVsZWdhdGluZyBiZXR3ZWVuIHRoZSBjbGllbnQgZXhwb3NlZCBBUEksIHRoZVxuICogY2hhaW4gb2YgdHJhbnNmb3JtcyBuZWNlc3NhcnkgdG8gdHVybiBhbiBpdGVtIGludG8gc29tZXRoaW5nIHRoYXQgY2FuIGJlIHNlbnQgdG8gUm9sbGJhciwgYW5kIHRoZVxuICogcXVldWUgd2hpY2ggaGFuZGxlcyB0aGUgY29tbXVuY2F0aW9uIHdpdGggdGhlIFJvbGxiYXIgQVBJIHNlcnZlcnMuXG4gKlxuICogQHBhcmFtIHF1ZXVlIC0gYW4gb2JqZWN0IHRoYXQgY29uZm9ybXMgdG8gdGhlIGludGVyZmFjZTogYWRkSXRlbShpdGVtLCBjYWxsYmFjaylcbiAqIEBwYXJhbSBvcHRpb25zIC0gYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgb3B0aW9ucyB0byBiZSBzZXQgZm9yIHRoaXMgbm90aWZpZXIsIHRoaXMgc2hvdWxkIGhhdmVcbiAqIGFueSBkZWZhdWx0cyBhbHJlYWR5IHNldCBieSB0aGUgY2FsbGVyXG4gKi9cbmZ1bmN0aW9uIE5vdGlmaWVyKHF1ZXVlLCBvcHRpb25zKSB7XG4gIHRoaXMucXVldWUgPSBxdWV1ZTtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgdGhpcy50cmFuc2Zvcm1zID0gW107XG4gIHRoaXMuZGlhZ25vc3RpYyA9IHt9O1xufVxuXG4vKlxuICogY29uZmlndXJlIC0gdXBkYXRlcyB0aGUgb3B0aW9ucyBmb3IgdGhpcyBub3RpZmllciB3aXRoIHRoZSBwYXNzZWQgaW4gb2JqZWN0XG4gKlxuICogQHBhcmFtIG9wdGlvbnMgLSBhbiBvYmplY3Qgd2hpY2ggZ2V0cyBtZXJnZWQgd2l0aCB0aGUgY3VycmVudCBvcHRpb25zIHNldCBvbiB0aGlzIG5vdGlmaWVyXG4gKiBAcmV0dXJucyB0aGlzXG4gKi9cbk5vdGlmaWVyLnByb3RvdHlwZS5jb25maWd1cmUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB0aGlzLnF1ZXVlICYmIHRoaXMucXVldWUuY29uZmlndXJlKG9wdGlvbnMpO1xuICB2YXIgb2xkT3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgdGhpcy5vcHRpb25zID0gXy5tZXJnZShvbGRPcHRpb25zLCBvcHRpb25zKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKlxuICogYWRkVHJhbnNmb3JtIC0gYWRkcyBhIHRyYW5zZm9ybSBvbnRvIHRoZSBlbmQgb2YgdGhlIHF1ZXVlIG9mIHRyYW5zZm9ybXMgZm9yIHRoaXMgbm90aWZpZXJcbiAqXG4gKiBAcGFyYW0gdHJhbnNmb3JtIC0gYSBmdW5jdGlvbiB3aGljaCB0YWtlcyB0aHJlZSBhcmd1bWVudHM6XG4gKiAgICAqIGl0ZW06IEFuIE9iamVjdCByZXByZXNlbnRpbmcgdGhlIGRhdGEgdG8gZXZlbnR1YWxseSBiZSBzZW50IHRvIFJvbGxiYXJcbiAqICAgICogb3B0aW9uczogVGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIG9wdGlvbnMgZm9yIHRoaXMgbm90aWZpZXJcbiAqICAgICogY2FsbGJhY2s6IGZ1bmN0aW9uKGVycjogKE51bGx8RXJyb3IpLCBpdGVtOiAoTnVsbHxPYmplY3QpKSB0aGUgdHJhbnNmb3JtIG11c3QgY2FsbCB0aGlzXG4gKiAgICBjYWxsYmFjayB3aXRoIGEgbnVsbCB2YWx1ZSBmb3IgZXJyb3IgaWYgaXQgd2FudHMgdGhlIHByb2Nlc3NpbmcgY2hhaW4gdG8gY29udGludWUsIG90aGVyd2lzZVxuICogICAgd2l0aCBhbiBlcnJvciB0byB0ZXJtaW5hdGUgdGhlIHByb2Nlc3NpbmcuIFRoZSBpdGVtIHNob3VsZCBiZSB0aGUgdXBkYXRlZCBpdGVtIGFmdGVyIHRoaXNcbiAqICAgIHRyYW5zZm9ybSBpcyBmaW5pc2hlZCBtb2RpZnlpbmcgaXQuXG4gKi9cbk5vdGlmaWVyLnByb3RvdHlwZS5hZGRUcmFuc2Zvcm0gPSBmdW5jdGlvbiAodHJhbnNmb3JtKSB7XG4gIGlmIChfLmlzRnVuY3Rpb24odHJhbnNmb3JtKSkge1xuICAgIHRoaXMudHJhbnNmb3Jtcy5wdXNoKHRyYW5zZm9ybSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKlxuICogbG9nIC0gdGhlIGludGVybmFsIGxvZyBmdW5jdGlvbiB3aGljaCBhcHBsaWVzIHRoZSBjb25maWd1cmVkIHRyYW5zZm9ybXMgYW5kIHRoZW4gcHVzaGVzIG9udG8gdGhlXG4gKiBxdWV1ZSB0byBiZSBzZW50IHRvIHRoZSBiYWNrZW5kLlxuICpcbiAqIEBwYXJhbSBpdGVtIC0gQW4gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZyBzdHJ1Y3R1cmU6XG4gKiAgICBtZXNzYWdlIFtTdHJpbmddIC0gQW4gb3B0aW9uYWwgc3RyaW5nIHRvIGJlIHNlbnQgdG8gcm9sbGJhclxuICogICAgZXJyb3IgW0Vycm9yXSAtIEFuIG9wdGlvbmFsIGVycm9yXG4gKlxuICogQHBhcmFtIGNhbGxiYWNrIC0gQSBmdW5jdGlvbiBvZiB0eXBlIGZ1bmN0aW9uKGVyciwgcmVzcCkgd2hpY2ggd2lsbCBiZSBjYWxsZWQgd2l0aCBleGFjdGx5IG9uZVxuICogbnVsbCBhcmd1bWVudCBhbmQgb25lIG5vbi1udWxsIGFyZ3VtZW50LiBUaGUgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgb25jZSwgZWl0aGVyIGR1cmluZyB0aGVcbiAqIHRyYW5zZm9ybSBzdGFnZSBpZiBhbiBlcnJvciBvY2N1cnMgaW5zaWRlIGEgdHJhbnNmb3JtLCBvciBpbiByZXNwb25zZSB0byB0aGUgY29tbXVuaWNhdGlvbiB3aXRoXG4gKiB0aGUgYmFja2VuZC4gVGhlIHNlY29uZCBhcmd1bWVudCB3aWxsIGJlIHRoZSByZXNwb25zZSBmcm9tIHRoZSBiYWNrZW5kIGluIGNhc2Ugb2Ygc3VjY2Vzcy5cbiAqL1xuTm90aWZpZXIucHJvdG90eXBlLmxvZyA9IGZ1bmN0aW9uIChpdGVtLCBjYWxsYmFjaykge1xuICBpZiAoIWNhbGxiYWNrIHx8ICFfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgfVxuXG4gIGlmICghdGhpcy5vcHRpb25zLmVuYWJsZWQpIHtcbiAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKCdSb2xsYmFyIGlzIG5vdCBlbmFibGVkJykpO1xuICB9XG5cbiAgdGhpcy5xdWV1ZS5hZGRQZW5kaW5nSXRlbShpdGVtKTtcbiAgdmFyIG9yaWdpbmFsRXJyb3IgPSBpdGVtLmVycjtcbiAgdGhpcy5fYXBwbHlUcmFuc2Zvcm1zKFxuICAgIGl0ZW0sXG4gICAgZnVuY3Rpb24gKGVyciwgaSkge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICB0aGlzLnF1ZXVlLnJlbW92ZVBlbmRpbmdJdGVtKGl0ZW0pO1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucXVldWUuYWRkSXRlbShpLCBjYWxsYmFjaywgb3JpZ2luYWxFcnJvciwgaXRlbSk7XG4gICAgfS5iaW5kKHRoaXMpLFxuICApO1xufTtcblxuLyogSW50ZXJuYWwgKi9cblxuLypcbiAqIF9hcHBseVRyYW5zZm9ybXMgLSBBcHBsaWVzIHRoZSB0cmFuc2Zvcm1zIHRoYXQgaGF2ZSBiZWVuIGFkZGVkIHRvIHRoaXMgbm90aWZpZXIgc2VxdWVudGlhbGx5LiBTZWVcbiAqIGBhZGRUcmFuc2Zvcm1gIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICpcbiAqIEBwYXJhbSBpdGVtIC0gQW4gaXRlbSB0byBiZSB0cmFuc2Zvcm1lZFxuICogQHBhcmFtIGNhbGxiYWNrIC0gQSBmdW5jdGlvbiBvZiB0eXBlIGZ1bmN0aW9uKGVyciwgaXRlbSkgd2hpY2ggd2lsbCBiZSBjYWxsZWQgd2l0aCBhIG5vbi1udWxsXG4gKiBlcnJvciBhbmQgYSBudWxsIGl0ZW0gaW4gdGhlIGNhc2Ugb2YgYSB0cmFuc2Zvcm0gZmFpbHVyZSwgb3IgYSBudWxsIGVycm9yIGFuZCBub24tbnVsbCBpdGVtIGFmdGVyXG4gKiBhbGwgdHJhbnNmb3JtcyBoYXZlIGJlZW4gYXBwbGllZC5cbiAqL1xuTm90aWZpZXIucHJvdG90eXBlLl9hcHBseVRyYW5zZm9ybXMgPSBmdW5jdGlvbiAoaXRlbSwgY2FsbGJhY2spIHtcbiAgdmFyIHRyYW5zZm9ybUluZGV4ID0gLTE7XG4gIHZhciB0cmFuc2Zvcm1zTGVuZ3RoID0gdGhpcy50cmFuc2Zvcm1zLmxlbmd0aDtcbiAgdmFyIHRyYW5zZm9ybXMgPSB0aGlzLnRyYW5zZm9ybXM7XG4gIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gIHZhciBjYiA9IGZ1bmN0aW9uIChlcnIsIGkpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyYW5zZm9ybUluZGV4Kys7XG5cbiAgICBpZiAodHJhbnNmb3JtSW5kZXggPT09IHRyYW5zZm9ybXNMZW5ndGgpIHtcbiAgICAgIGNhbGxiYWNrKG51bGwsIGkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyYW5zZm9ybXNbdHJhbnNmb3JtSW5kZXhdKGksIG9wdGlvbnMsIGNiKTtcbiAgfTtcblxuICBjYihudWxsLCBpdGVtKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTm90aWZpZXI7XG4iLCJ2YXIgbWVyZ2UgPSByZXF1aXJlKCcuL21lcmdlJyk7XG5cbnZhciBSb2xsYmFySlNPTiA9IHt9O1xuZnVuY3Rpb24gc2V0dXBKU09OKHBvbHlmaWxsSlNPTikge1xuICBpZiAoaXNGdW5jdGlvbihSb2xsYmFySlNPTi5zdHJpbmdpZnkpICYmIGlzRnVuY3Rpb24oUm9sbGJhckpTT04ucGFyc2UpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGlzRGVmaW5lZChKU09OKSkge1xuICAgIC8vIElmIHBvbHlmaWxsIGlzIHByb3ZpZGVkLCBwcmVmZXIgaXQgb3ZlciBleGlzdGluZyBub24tbmF0aXZlIHNoaW1zLlxuICAgIGlmIChwb2x5ZmlsbEpTT04pIHtcbiAgICAgIGlmIChpc05hdGl2ZUZ1bmN0aW9uKEpTT04uc3RyaW5naWZ5KSkge1xuICAgICAgICBSb2xsYmFySlNPTi5zdHJpbmdpZnkgPSBKU09OLnN0cmluZ2lmeTtcbiAgICAgIH1cbiAgICAgIGlmIChpc05hdGl2ZUZ1bmN0aW9uKEpTT04ucGFyc2UpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnBhcnNlID0gSlNPTi5wYXJzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZWxzZSBhY2NlcHQgYW55IGludGVyZmFjZSB0aGF0IGlzIHByZXNlbnQuXG4gICAgICBpZiAoaXNGdW5jdGlvbihKU09OLnN0cmluZ2lmeSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04uc3RyaW5naWZ5ID0gSlNPTi5zdHJpbmdpZnk7XG4gICAgICB9XG4gICAgICBpZiAoaXNGdW5jdGlvbihKU09OLnBhcnNlKSkge1xuICAgICAgICBSb2xsYmFySlNPTi5wYXJzZSA9IEpTT04ucGFyc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICghaXNGdW5jdGlvbihSb2xsYmFySlNPTi5zdHJpbmdpZnkpIHx8ICFpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnBhcnNlKSkge1xuICAgIHBvbHlmaWxsSlNPTiAmJiBwb2x5ZmlsbEpTT04oUm9sbGJhckpTT04pO1xuICB9XG59XG5cbi8qXG4gKiBpc1R5cGUgLSBHaXZlbiBhIEphdmFzY3JpcHQgdmFsdWUgYW5kIGEgc3RyaW5nLCByZXR1cm5zIHRydWUgaWYgdGhlIHR5cGUgb2YgdGhlIHZhbHVlIG1hdGNoZXMgdGhlXG4gKiBnaXZlbiBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHggLSBhbnkgdmFsdWVcbiAqIEBwYXJhbSB0IC0gYSBsb3dlcmNhc2Ugc3RyaW5nIGNvbnRhaW5pbmcgb25lIG9mIHRoZSBmb2xsb3dpbmcgdHlwZSBuYW1lczpcbiAqICAgIC0gdW5kZWZpbmVkXG4gKiAgICAtIG51bGxcbiAqICAgIC0gZXJyb3JcbiAqICAgIC0gbnVtYmVyXG4gKiAgICAtIGJvb2xlYW5cbiAqICAgIC0gc3RyaW5nXG4gKiAgICAtIHN5bWJvbFxuICogICAgLSBmdW5jdGlvblxuICogICAgLSBvYmplY3RcbiAqICAgIC0gYXJyYXlcbiAqIEByZXR1cm5zIHRydWUgaWYgeCBpcyBvZiB0eXBlIHQsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1R5cGUoeCwgdCkge1xuICByZXR1cm4gdCA9PT0gdHlwZU5hbWUoeCk7XG59XG5cbi8qXG4gKiB0eXBlTmFtZSAtIEdpdmVuIGEgSmF2YXNjcmlwdCB2YWx1ZSwgcmV0dXJucyB0aGUgdHlwZSBvZiB0aGUgb2JqZWN0IGFzIGEgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIHR5cGVOYW1lKHgpIHtcbiAgdmFyIG5hbWUgPSB0eXBlb2YgeDtcbiAgaWYgKG5hbWUgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG5hbWU7XG4gIH1cbiAgaWYgKCF4KSB7XG4gICAgcmV0dXJuICdudWxsJztcbiAgfVxuICBpZiAoeCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgcmV0dXJuICdlcnJvcic7XG4gIH1cbiAgcmV0dXJuIHt9LnRvU3RyaW5nXG4gICAgLmNhbGwoeClcbiAgICAubWF0Y2goL1xccyhbYS16QS1aXSspLylbMV1cbiAgICAudG9Mb3dlckNhc2UoKTtcbn1cblxuLyogaXNGdW5jdGlvbiAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgYSBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSBmIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGYgaXMgYSBmdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oZikge1xuICByZXR1cm4gaXNUeXBlKGYsICdmdW5jdGlvbicpO1xufVxuXG4vKiBpc05hdGl2ZUZ1bmN0aW9uIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBhIG5hdGl2ZSBKUyBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSBmIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGYgaXMgYSBuYXRpdmUgSlMgZnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc05hdGl2ZUZ1bmN0aW9uKGYpIHtcbiAgdmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcbiAgdmFyIGZ1bmNNYXRjaFN0cmluZyA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZ1xuICAgIC5jYWxsKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkpXG4gICAgLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/Jyk7XG4gIHZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArIGZ1bmNNYXRjaFN0cmluZyArICckJyk7XG4gIHJldHVybiBpc09iamVjdChmKSAmJiByZUlzTmF0aXZlLnRlc3QoZik7XG59XG5cbi8qIGlzT2JqZWN0IC0gQ2hlY2tzIGlmIHRoZSBhcmd1bWVudCBpcyBhbiBvYmplY3RcbiAqXG4gKiBAcGFyYW0gdmFsdWUgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaXMgdmFsdWUgaXMgYW4gb2JqZWN0IGZ1bmN0aW9uIGlzIGFuIG9iamVjdClcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qIGlzU3RyaW5nIC0gQ2hlY2tzIGlmIHRoZSBhcmd1bWVudCBpcyBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB2YWx1ZSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiB2YWx1ZSBpcyBhIHN0cmluZ1xuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZztcbn1cblxuLyoqXG4gKiBpc0Zpbml0ZU51bWJlciAtIGRldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIGEgZmluaXRlIG51bWJlclxuICpcbiAqIEBwYXJhbSB7Kn0gbiAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiB2YWx1ZSBpcyBhIGZpbml0ZSBudW1iZXJcbiAqL1xuZnVuY3Rpb24gaXNGaW5pdGVOdW1iZXIobikge1xuICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKG4pO1xufVxuXG4vKlxuICogaXNEZWZpbmVkIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBub3QgZXF1YWwgdG8gdW5kZWZpbmVkXG4gKlxuICogQHBhcmFtIHUgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgdSBpcyBhbnl0aGluZyBvdGhlciB0aGFuIHVuZGVmaW5lZFxuICovXG5mdW5jdGlvbiBpc0RlZmluZWQodSkge1xuICByZXR1cm4gIWlzVHlwZSh1LCAndW5kZWZpbmVkJyk7XG59XG5cbi8qXG4gKiBpc0l0ZXJhYmxlIC0gY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgY2FuIGJlIGl0ZXJhdGVkLCBlc3NlbnRpYWxseVxuICogd2hldGhlciBpdCBpcyBhbiBvYmplY3Qgb3IgYW4gYXJyYXkuXG4gKlxuICogQHBhcmFtIGkgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgaSBpcyBhbiBvYmplY3Qgb3IgYW4gYXJyYXkgYXMgZGV0ZXJtaW5lZCBieSBgdHlwZU5hbWVgXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmFibGUoaSkge1xuICB2YXIgdHlwZSA9IHR5cGVOYW1lKGkpO1xuICByZXR1cm4gdHlwZSA9PT0gJ29iamVjdCcgfHwgdHlwZSA9PT0gJ2FycmF5Jztcbn1cblxuLypcbiAqIGlzRXJyb3IgLSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBvZiBhbiBlcnJvciB0eXBlXG4gKlxuICogQHBhcmFtIGUgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZSBpcyBhbiBlcnJvclxuICovXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgLy8gRGV0ZWN0IGJvdGggRXJyb3IgYW5kIEZpcmVmb3ggRXhjZXB0aW9uIHR5cGVcbiAgcmV0dXJuIGlzVHlwZShlLCAnZXJyb3InKSB8fCBpc1R5cGUoZSwgJ2V4Y2VwdGlvbicpO1xufVxuXG4vKiBpc1Byb21pc2UgLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIGEgcHJvbWlzZVxuICpcbiAqIEBwYXJhbSBwIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGYgaXMgYSBmdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzUHJvbWlzZShwKSB7XG4gIHJldHVybiBpc09iamVjdChwKSAmJiBpc1R5cGUocC50aGVuLCAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBpc0Jyb3dzZXIgLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiB0aGUgY29kZSBpcyBydW5uaW5nIGluIGEgYnJvd3NlclxuICpcbiAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGNvZGUgaXMgcnVubmluZyBpbiBhIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAqL1xuZnVuY3Rpb24gaXNCcm93c2VyKCkge1xuICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG59XG5cbmZ1bmN0aW9uIHJlZGFjdCgpIHtcbiAgcmV0dXJuICcqKioqKioqKic7XG59XG5cbi8vIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvODgwOTQ3Mi8xMTM4MTkxXG5mdW5jdGlvbiB1dWlkNCgpIHtcbiAgdmFyIGQgPSBub3coKTtcbiAgdmFyIHV1aWQgPSAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKFxuICAgIC9beHldL2csXG4gICAgZnVuY3Rpb24gKGMpIHtcbiAgICAgIHZhciByID0gKGQgKyBNYXRoLnJhbmRvbSgpICogMTYpICUgMTYgfCAwO1xuICAgICAgZCA9IE1hdGguZmxvb3IoZCAvIDE2KTtcbiAgICAgIHJldHVybiAoYyA9PT0gJ3gnID8gciA6IChyICYgMHg3KSB8IDB4OCkudG9TdHJpbmcoMTYpO1xuICAgIH0sXG4gICk7XG4gIHJldHVybiB1dWlkO1xufVxuXG52YXIgTEVWRUxTID0ge1xuICBkZWJ1ZzogMCxcbiAgaW5mbzogMSxcbiAgd2FybmluZzogMixcbiAgZXJyb3I6IDMsXG4gIGNyaXRpY2FsOiA0LFxufTtcblxuZnVuY3Rpb24gc2FuaXRpemVVcmwodXJsKSB7XG4gIHZhciBiYXNlVXJsUGFydHMgPSBwYXJzZVVyaSh1cmwpO1xuICBpZiAoIWJhc2VVcmxQYXJ0cykge1xuICAgIHJldHVybiAnKHVua25vd24pJztcbiAgfVxuXG4gIC8vIHJlbW92ZSBhIHRyYWlsaW5nICMgaWYgdGhlcmUgaXMgbm8gYW5jaG9yXG4gIGlmIChiYXNlVXJsUGFydHMuYW5jaG9yID09PSAnJykge1xuICAgIGJhc2VVcmxQYXJ0cy5zb3VyY2UgPSBiYXNlVXJsUGFydHMuc291cmNlLnJlcGxhY2UoJyMnLCAnJyk7XG4gIH1cblxuICB1cmwgPSBiYXNlVXJsUGFydHMuc291cmNlLnJlcGxhY2UoJz8nICsgYmFzZVVybFBhcnRzLnF1ZXJ5LCAnJyk7XG4gIHJldHVybiB1cmw7XG59XG5cbnZhciBwYXJzZVVyaU9wdGlvbnMgPSB7XG4gIHN0cmljdE1vZGU6IGZhbHNlLFxuICBrZXk6IFtcbiAgICAnc291cmNlJyxcbiAgICAncHJvdG9jb2wnLFxuICAgICdhdXRob3JpdHknLFxuICAgICd1c2VySW5mbycsXG4gICAgJ3VzZXInLFxuICAgICdwYXNzd29yZCcsXG4gICAgJ2hvc3QnLFxuICAgICdwb3J0JyxcbiAgICAncmVsYXRpdmUnLFxuICAgICdwYXRoJyxcbiAgICAnZGlyZWN0b3J5JyxcbiAgICAnZmlsZScsXG4gICAgJ3F1ZXJ5JyxcbiAgICAnYW5jaG9yJyxcbiAgXSxcbiAgcToge1xuICAgIG5hbWU6ICdxdWVyeUtleScsXG4gICAgcGFyc2VyOiAvKD86XnwmKShbXiY9XSopPT8oW14mXSopL2csXG4gIH0sXG4gIHBhcnNlcjoge1xuICAgIHN0cmljdDpcbiAgICAgIC9eKD86KFteOlxcLz8jXSspOik/KD86XFwvXFwvKCg/OigoW146QF0qKSg/OjooW146QF0qKSk/KT9AKT8oW146XFwvPyNdKikoPzo6KFxcZCopKT8pKT8oKCgoPzpbXj8jXFwvXSpcXC8pKikoW14/I10qKSkoPzpcXD8oW14jXSopKT8oPzojKC4qKSk/KS8sXG4gICAgbG9vc2U6XG4gICAgICAvXig/Oig/IVteOkBdKzpbXjpAXFwvXSpAKShbXjpcXC8/Iy5dKyk6KT8oPzpcXC9cXC8pPygoPzooKFteOkBdKikoPzo6KFteOkBdKikpPyk/QCk/KFteOlxcLz8jXSopKD86OihcXGQqKSk/KSgoKFxcLyg/OltePyNdKD8hW14/I1xcL10qXFwuW14/I1xcLy5dKyg/Ols/I118JCkpKSpcXC8/KT8oW14/I1xcL10qKSkoPzpcXD8oW14jXSopKT8oPzojKC4qKSk/KS8sXG4gIH0sXG59O1xuXG5mdW5jdGlvbiBwYXJzZVVyaShzdHIpIHtcbiAgaWYgKCFpc1R5cGUoc3RyLCAnc3RyaW5nJykpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgdmFyIG8gPSBwYXJzZVVyaU9wdGlvbnM7XG4gIHZhciBtID0gby5wYXJzZXJbby5zdHJpY3RNb2RlID8gJ3N0cmljdCcgOiAnbG9vc2UnXS5leGVjKHN0cik7XG4gIHZhciB1cmkgPSB7fTtcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IG8ua2V5Lmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIHVyaVtvLmtleVtpXV0gPSBtW2ldIHx8ICcnO1xuICB9XG5cbiAgdXJpW28ucS5uYW1lXSA9IHt9O1xuICB1cmlbby5rZXlbMTJdXS5yZXBsYWNlKG8ucS5wYXJzZXIsIGZ1bmN0aW9uICgkMCwgJDEsICQyKSB7XG4gICAgaWYgKCQxKSB7XG4gICAgICB1cmlbby5xLm5hbWVdWyQxXSA9ICQyO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHVyaTtcbn1cblxuZnVuY3Rpb24gYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGgoYWNjZXNzVG9rZW4sIG9wdGlvbnMsIHBhcmFtcykge1xuICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gIHBhcmFtcy5hY2Nlc3NfdG9rZW4gPSBhY2Nlc3NUb2tlbjtcbiAgdmFyIHBhcmFtc0FycmF5ID0gW107XG4gIHZhciBrO1xuICBmb3IgKGsgaW4gcGFyYW1zKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJhbXMsIGspKSB7XG4gICAgICBwYXJhbXNBcnJheS5wdXNoKFtrLCBwYXJhbXNba11dLmpvaW4oJz0nKSk7XG4gICAgfVxuICB9XG4gIHZhciBxdWVyeSA9ICc/JyArIHBhcmFtc0FycmF5LnNvcnQoKS5qb2luKCcmJyk7XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIG9wdGlvbnMucGF0aCA9IG9wdGlvbnMucGF0aCB8fCAnJztcbiAgdmFyIHFzID0gb3B0aW9ucy5wYXRoLmluZGV4T2YoJz8nKTtcbiAgdmFyIGggPSBvcHRpb25zLnBhdGguaW5kZXhPZignIycpO1xuICB2YXIgcDtcbiAgaWYgKHFzICE9PSAtMSAmJiAoaCA9PT0gLTEgfHwgaCA+IHFzKSkge1xuICAgIHAgPSBvcHRpb25zLnBhdGg7XG4gICAgb3B0aW9ucy5wYXRoID0gcC5zdWJzdHJpbmcoMCwgcXMpICsgcXVlcnkgKyAnJicgKyBwLnN1YnN0cmluZyhxcyArIDEpO1xuICB9IGVsc2Uge1xuICAgIGlmIChoICE9PSAtMSkge1xuICAgICAgcCA9IG9wdGlvbnMucGF0aDtcbiAgICAgIG9wdGlvbnMucGF0aCA9IHAuc3Vic3RyaW5nKDAsIGgpICsgcXVlcnkgKyBwLnN1YnN0cmluZyhoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9ucy5wYXRoID0gb3B0aW9ucy5wYXRoICsgcXVlcnk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFVybCh1LCBwcm90b2NvbCkge1xuICBwcm90b2NvbCA9IHByb3RvY29sIHx8IHUucHJvdG9jb2w7XG4gIGlmICghcHJvdG9jb2wgJiYgdS5wb3J0KSB7XG4gICAgaWYgKHUucG9ydCA9PT0gODApIHtcbiAgICAgIHByb3RvY29sID0gJ2h0dHA6JztcbiAgICB9IGVsc2UgaWYgKHUucG9ydCA9PT0gNDQzKSB7XG4gICAgICBwcm90b2NvbCA9ICdodHRwczonO1xuICAgIH1cbiAgfVxuICBwcm90b2NvbCA9IHByb3RvY29sIHx8ICdodHRwczonO1xuXG4gIGlmICghdS5ob3N0bmFtZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZhciByZXN1bHQgPSBwcm90b2NvbCArICcvLycgKyB1Lmhvc3RuYW1lO1xuICBpZiAodS5wb3J0KSB7XG4gICAgcmVzdWx0ID0gcmVzdWx0ICsgJzonICsgdS5wb3J0O1xuICB9XG4gIGlmICh1LnBhdGgpIHtcbiAgICByZXN1bHQgPSByZXN1bHQgKyB1LnBhdGg7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5KG9iaiwgYmFja3VwKSB7XG4gIHZhciB2YWx1ZSwgZXJyb3I7XG4gIHRyeSB7XG4gICAgdmFsdWUgPSBSb2xsYmFySlNPTi5zdHJpbmdpZnkob2JqKTtcbiAgfSBjYXRjaCAoanNvbkVycm9yKSB7XG4gICAgaWYgKGJhY2t1cCAmJiBpc0Z1bmN0aW9uKGJhY2t1cCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlID0gYmFja3VwKG9iaik7XG4gICAgICB9IGNhdGNoIChiYWNrdXBFcnJvcikge1xuICAgICAgICBlcnJvciA9IGJhY2t1cEVycm9yO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlcnJvciA9IGpzb25FcnJvcjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgZXJyb3I6IGVycm9yLCB2YWx1ZTogdmFsdWUgfTtcbn1cblxuZnVuY3Rpb24gbWF4Qnl0ZVNpemUoc3RyaW5nKSB7XG4gIC8vIFRoZSB0cmFuc3BvcnQgd2lsbCB1c2UgdXRmLTgsIHNvIGFzc3VtZSB1dGYtOCBlbmNvZGluZy5cbiAgLy9cbiAgLy8gVGhpcyBtaW5pbWFsIGltcGxlbWVudGF0aW9uIHdpbGwgYWNjdXJhdGVseSBjb3VudCBieXRlcyBmb3IgYWxsIFVDUy0yIGFuZFxuICAvLyBzaW5nbGUgY29kZSBwb2ludCBVVEYtMTYuIElmIHByZXNlbnRlZCB3aXRoIG11bHRpIGNvZGUgcG9pbnQgVVRGLTE2LFxuICAvLyB3aGljaCBzaG91bGQgYmUgcmFyZSwgaXQgd2lsbCBzYWZlbHkgb3ZlcmNvdW50LCBub3QgdW5kZXJjb3VudC5cbiAgLy9cbiAgLy8gV2hpbGUgcm9idXN0IHV0Zi04IGVuY29kZXJzIGV4aXN0LCB0aGlzIGlzIGZhciBzbWFsbGVyIGFuZCBmYXIgbW9yZSBwZXJmb3JtYW50LlxuICAvLyBGb3IgcXVpY2tseSBjb3VudGluZyBwYXlsb2FkIHNpemUgZm9yIHRydW5jYXRpb24sIHNtYWxsZXIgaXMgYmV0dGVyLlxuXG4gIHZhciBjb3VudCA9IDA7XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgY29kZSA9IHN0cmluZy5jaGFyQ29kZUF0KGkpO1xuICAgIGlmIChjb2RlIDwgMTI4KSB7XG4gICAgICAvLyB1cCB0byA3IGJpdHNcbiAgICAgIGNvdW50ID0gY291bnQgKyAxO1xuICAgIH0gZWxzZSBpZiAoY29kZSA8IDIwNDgpIHtcbiAgICAgIC8vIHVwIHRvIDExIGJpdHNcbiAgICAgIGNvdW50ID0gY291bnQgKyAyO1xuICAgIH0gZWxzZSBpZiAoY29kZSA8IDY1NTM2KSB7XG4gICAgICAvLyB1cCB0byAxNiBiaXRzXG4gICAgICBjb3VudCA9IGNvdW50ICsgMztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY291bnQ7XG59XG5cbmZ1bmN0aW9uIGpzb25QYXJzZShzKSB7XG4gIHZhciB2YWx1ZSwgZXJyb3I7XG4gIHRyeSB7XG4gICAgdmFsdWUgPSBSb2xsYmFySlNPTi5wYXJzZShzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGVycm9yID0gZTtcbiAgfVxuICByZXR1cm4geyBlcnJvcjogZXJyb3IsIHZhbHVlOiB2YWx1ZSB9O1xufVxuXG5mdW5jdGlvbiBtYWtlVW5oYW5kbGVkU3RhY2tJbmZvKFxuICBtZXNzYWdlLFxuICB1cmwsXG4gIGxpbmVubyxcbiAgY29sbm8sXG4gIGVycm9yLFxuICBtb2RlLFxuICBiYWNrdXBNZXNzYWdlLFxuICBlcnJvclBhcnNlcixcbikge1xuICB2YXIgbG9jYXRpb24gPSB7XG4gICAgdXJsOiB1cmwgfHwgJycsXG4gICAgbGluZTogbGluZW5vLFxuICAgIGNvbHVtbjogY29sbm8sXG4gIH07XG4gIGxvY2F0aW9uLmZ1bmMgPSBlcnJvclBhcnNlci5ndWVzc0Z1bmN0aW9uTmFtZShsb2NhdGlvbi51cmwsIGxvY2F0aW9uLmxpbmUpO1xuICBsb2NhdGlvbi5jb250ZXh0ID0gZXJyb3JQYXJzZXIuZ2F0aGVyQ29udGV4dChsb2NhdGlvbi51cmwsIGxvY2F0aW9uLmxpbmUpO1xuICB2YXIgaHJlZiA9XG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIGRvY3VtZW50ICYmXG4gICAgZG9jdW1lbnQubG9jYXRpb24gJiZcbiAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmO1xuICB2YXIgdXNlcmFnZW50ID1cbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHdpbmRvdyAmJlxuICAgIHdpbmRvdy5uYXZpZ2F0b3IgJiZcbiAgICB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgcmV0dXJuIHtcbiAgICBtb2RlOiBtb2RlLFxuICAgIG1lc3NhZ2U6IGVycm9yID8gU3RyaW5nKGVycm9yKSA6IG1lc3NhZ2UgfHwgYmFja3VwTWVzc2FnZSxcbiAgICB1cmw6IGhyZWYsXG4gICAgc3RhY2s6IFtsb2NhdGlvbl0sXG4gICAgdXNlcmFnZW50OiB1c2VyYWdlbnQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHdyYXBDYWxsYmFjayhsb2dnZXIsIGYpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICB0cnkge1xuICAgICAgZihlcnIsIHJlc3ApO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihlKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIG5vbkNpcmN1bGFyQ2xvbmUob2JqKSB7XG4gIHZhciBzZWVuID0gW29ial07XG5cbiAgZnVuY3Rpb24gY2xvbmUob2JqLCBzZWVuKSB7XG4gICAgdmFyIHZhbHVlLFxuICAgICAgbmFtZSxcbiAgICAgIG5ld1NlZW4sXG4gICAgICByZXN1bHQgPSB7fTtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKG5hbWUgaW4gb2JqKSB7XG4gICAgICAgIHZhbHVlID0gb2JqW25hbWVdO1xuXG4gICAgICAgIGlmICh2YWx1ZSAmJiAoaXNUeXBlKHZhbHVlLCAnb2JqZWN0JykgfHwgaXNUeXBlKHZhbHVlLCAnYXJyYXknKSkpIHtcbiAgICAgICAgICBpZiAoc2Vlbi5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJlc3VsdFtuYW1lXSA9ICdSZW1vdmVkIGNpcmN1bGFyIHJlZmVyZW5jZTogJyArIHR5cGVOYW1lKHZhbHVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3U2VlbiA9IHNlZW4uc2xpY2UoKTtcbiAgICAgICAgICAgIG5ld1NlZW4ucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICByZXN1bHRbbmFtZV0gPSBjbG9uZSh2YWx1ZSwgbmV3U2Vlbik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0W25hbWVdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmVzdWx0ID0gJ0ZhaWxlZCBjbG9uaW5nIGN1c3RvbSBkYXRhOiAnICsgZS5tZXNzYWdlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHJldHVybiBjbG9uZShvYmosIHNlZW4pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVJdGVtKGFyZ3MsIGxvZ2dlciwgbm90aWZpZXIsIHJlcXVlc3RLZXlzLCBsYW1iZGFDb250ZXh0KSB7XG4gIHZhciBtZXNzYWdlLCBlcnIsIGN1c3RvbSwgY2FsbGJhY2ssIHJlcXVlc3Q7XG4gIHZhciBhcmc7XG4gIHZhciBleHRyYUFyZ3MgPSBbXTtcbiAgdmFyIGRpYWdub3N0aWMgPSB7fTtcbiAgdmFyIGFyZ1R5cGVzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmdzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGFyZyA9IGFyZ3NbaV07XG5cbiAgICB2YXIgdHlwID0gdHlwZU5hbWUoYXJnKTtcbiAgICBhcmdUeXBlcy5wdXNoKHR5cCk7XG4gICAgc3dpdGNoICh0eXApIHtcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgbWVzc2FnZSA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAobWVzc2FnZSA9IGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICBjYWxsYmFjayA9IHdyYXBDYWxsYmFjayhsb2dnZXIsIGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgIGV4dHJhQXJncy5wdXNoKGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZXJyb3InOlxuICAgICAgY2FzZSAnZG9tZXhjZXB0aW9uJzpcbiAgICAgIGNhc2UgJ2V4Y2VwdGlvbic6IC8vIEZpcmVmb3ggRXhjZXB0aW9uIHR5cGVcbiAgICAgICAgZXJyID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChlcnIgPSBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICBjYXNlICdhcnJheSc6XG4gICAgICAgIGlmIChcbiAgICAgICAgICBhcmcgaW5zdGFuY2VvZiBFcnJvciB8fFxuICAgICAgICAgICh0eXBlb2YgRE9NRXhjZXB0aW9uICE9PSAndW5kZWZpbmVkJyAmJiBhcmcgaW5zdGFuY2VvZiBET01FeGNlcHRpb24pXG4gICAgICAgICkge1xuICAgICAgICAgIGVyciA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoZXJyID0gYXJnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVxdWVzdEtleXMgJiYgdHlwID09PSAnb2JqZWN0JyAmJiAhcmVxdWVzdCkge1xuICAgICAgICAgIGZvciAodmFyIGogPSAwLCBsZW4gPSByZXF1ZXN0S2V5cy5sZW5ndGg7IGogPCBsZW47ICsraikge1xuICAgICAgICAgICAgaWYgKGFyZ1tyZXF1ZXN0S2V5c1tqXV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICByZXF1ZXN0ID0gYXJnO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlcXVlc3QpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjdXN0b20gPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGN1c3RvbSA9IGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGFyZyBpbnN0YW5jZW9mIEVycm9yIHx8XG4gICAgICAgICAgKHR5cGVvZiBET01FeGNlcHRpb24gIT09ICd1bmRlZmluZWQnICYmIGFyZyBpbnN0YW5jZW9mIERPTUV4Y2VwdGlvbilcbiAgICAgICAgKSB7XG4gICAgICAgICAgZXJyID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChlcnIgPSBhcmcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGV4dHJhQXJncy5wdXNoKGFyZyk7XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgY3VzdG9tIGlzIGFuIGFycmF5IHRoaXMgdHVybnMgaXQgaW50byBhbiBvYmplY3Qgd2l0aCBpbnRlZ2VyIGtleXNcbiAgaWYgKGN1c3RvbSkgY3VzdG9tID0gbm9uQ2lyY3VsYXJDbG9uZShjdXN0b20pO1xuXG4gIGlmIChleHRyYUFyZ3MubGVuZ3RoID4gMCkge1xuICAgIGlmICghY3VzdG9tKSBjdXN0b20gPSBub25DaXJjdWxhckNsb25lKHt9KTtcbiAgICBjdXN0b20uZXh0cmFBcmdzID0gbm9uQ2lyY3VsYXJDbG9uZShleHRyYUFyZ3MpO1xuICB9XG5cbiAgdmFyIGl0ZW0gPSB7XG4gICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICBlcnI6IGVycixcbiAgICBjdXN0b206IGN1c3RvbSxcbiAgICB0aW1lc3RhbXA6IG5vdygpLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcbiAgICBub3RpZmllcjogbm90aWZpZXIsXG4gICAgZGlhZ25vc3RpYzogZGlhZ25vc3RpYyxcbiAgICB1dWlkOiB1dWlkNCgpLFxuICB9O1xuXG4gIGl0ZW0uZGF0YSA9IGl0ZW0uZGF0YSB8fCB7fTtcblxuICBzZXRDdXN0b21JdGVtS2V5cyhpdGVtLCBjdXN0b20pO1xuXG4gIGlmIChyZXF1ZXN0S2V5cyAmJiByZXF1ZXN0KSB7XG4gICAgaXRlbS5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgfVxuICBpZiAobGFtYmRhQ29udGV4dCkge1xuICAgIGl0ZW0ubGFtYmRhQ29udGV4dCA9IGxhbWJkYUNvbnRleHQ7XG4gIH1cbiAgaXRlbS5fb3JpZ2luYWxBcmdzID0gYXJncztcbiAgaXRlbS5kaWFnbm9zdGljLm9yaWdpbmFsX2FyZ190eXBlcyA9IGFyZ1R5cGVzO1xuICByZXR1cm4gaXRlbTtcbn1cblxuZnVuY3Rpb24gc2V0Q3VzdG9tSXRlbUtleXMoaXRlbSwgY3VzdG9tKSB7XG4gIGlmIChjdXN0b20gJiYgY3VzdG9tLmxldmVsICE9PSB1bmRlZmluZWQpIHtcbiAgICBpdGVtLmxldmVsID0gY3VzdG9tLmxldmVsO1xuICAgIGRlbGV0ZSBjdXN0b20ubGV2ZWw7XG4gIH1cbiAgaWYgKGN1c3RvbSAmJiBjdXN0b20uc2tpcEZyYW1lcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaXRlbS5za2lwRnJhbWVzID0gY3VzdG9tLnNraXBGcmFtZXM7XG4gICAgZGVsZXRlIGN1c3RvbS5za2lwRnJhbWVzO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFkZEVycm9yQ29udGV4dChpdGVtLCBlcnJvcnMpIHtcbiAgdmFyIGN1c3RvbSA9IGl0ZW0uZGF0YS5jdXN0b20gfHwge307XG4gIHZhciBjb250ZXh0QWRkZWQgPSBmYWxzZTtcblxuICB0cnkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXJyb3JzLmxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoZXJyb3JzW2ldLmhhc093blByb3BlcnR5KCdyb2xsYmFyQ29udGV4dCcpKSB7XG4gICAgICAgIGN1c3RvbSA9IG1lcmdlKGN1c3RvbSwgbm9uQ2lyY3VsYXJDbG9uZShlcnJvcnNbaV0ucm9sbGJhckNvbnRleHQpKTtcbiAgICAgICAgY29udGV4dEFkZGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBdm9pZCBhZGRpbmcgYW4gZW1wdHkgb2JqZWN0IHRvIHRoZSBkYXRhLlxuICAgIGlmIChjb250ZXh0QWRkZWQpIHtcbiAgICAgIGl0ZW0uZGF0YS5jdXN0b20gPSBjdXN0b207XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgaXRlbS5kaWFnbm9zdGljLmVycm9yX2NvbnRleHQgPSAnRmFpbGVkOiAnICsgZS5tZXNzYWdlO1xuICB9XG59XG5cbnZhciBURUxFTUVUUllfVFlQRVMgPSBbXG4gICdsb2cnLFxuICAnbmV0d29yaycsXG4gICdkb20nLFxuICAnbmF2aWdhdGlvbicsXG4gICdlcnJvcicsXG4gICdtYW51YWwnLFxuXTtcbnZhciBURUxFTUVUUllfTEVWRUxTID0gWydjcml0aWNhbCcsICdlcnJvcicsICd3YXJuaW5nJywgJ2luZm8nLCAnZGVidWcnXTtcblxuZnVuY3Rpb24gYXJyYXlJbmNsdWRlcyhhcnIsIHZhbCkge1xuICBmb3IgKHZhciBrID0gMDsgayA8IGFyci5sZW5ndGg7ICsraykge1xuICAgIGlmIChhcnJba10gPT09IHZhbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUZWxlbWV0cnlFdmVudChhcmdzKSB7XG4gIHZhciB0eXBlLCBtZXRhZGF0YSwgbGV2ZWw7XG4gIHZhciBhcmc7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmdzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGFyZyA9IGFyZ3NbaV07XG5cbiAgICB2YXIgdHlwID0gdHlwZU5hbWUoYXJnKTtcbiAgICBzd2l0Y2ggKHR5cCkge1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgaWYgKCF0eXBlICYmIGFycmF5SW5jbHVkZXMoVEVMRU1FVFJZX1RZUEVTLCBhcmcpKSB7XG4gICAgICAgICAgdHlwZSA9IGFyZztcbiAgICAgICAgfSBlbHNlIGlmICghbGV2ZWwgJiYgYXJyYXlJbmNsdWRlcyhURUxFTUVUUllfTEVWRUxTLCBhcmcpKSB7XG4gICAgICAgICAgbGV2ZWwgPSBhcmc7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBtZXRhZGF0YSA9IGFyZztcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgdmFyIGV2ZW50ID0ge1xuICAgIHR5cGU6IHR5cGUgfHwgJ21hbnVhbCcsXG4gICAgbWV0YWRhdGE6IG1ldGFkYXRhIHx8IHt9LFxuICAgIGxldmVsOiBsZXZlbCxcbiAgfTtcblxuICByZXR1cm4gZXZlbnQ7XG59XG5cbmZ1bmN0aW9uIGFkZEl0ZW1BdHRyaWJ1dGVzKGl0ZW0sIGF0dHJpYnV0ZXMpIHtcbiAgaXRlbS5kYXRhLmF0dHJpYnV0ZXMgPSBpdGVtLmRhdGEuYXR0cmlidXRlcyB8fCBbXTtcbiAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICBpdGVtLmRhdGEuYXR0cmlidXRlcy5wdXNoKC4uLmF0dHJpYnV0ZXMpO1xuICB9XG59XG5cbi8qXG4gKiBnZXQgLSBnaXZlbiBhbiBvYmovYXJyYXkgYW5kIGEga2V5cGF0aCwgcmV0dXJuIHRoZSB2YWx1ZSBhdCB0aGF0IGtleXBhdGggb3JcbiAqICAgICAgIHVuZGVmaW5lZCBpZiBub3QgcG9zc2libGUuXG4gKlxuICogQHBhcmFtIG9iaiAtIGFuIG9iamVjdCBvciBhcnJheVxuICogQHBhcmFtIHBhdGggLSBhIHN0cmluZyBvZiBrZXlzIHNlcGFyYXRlZCBieSAnLicgc3VjaCBhcyAncGx1Z2luLmpxdWVyeS4wLm1lc3NhZ2UnXG4gKiAgICB3aGljaCB3b3VsZCBjb3JyZXNwb25kIHRvIDQyIGluIGB7cGx1Z2luOiB7anF1ZXJ5OiBbe21lc3NhZ2U6IDQyfV19fWBcbiAqL1xuZnVuY3Rpb24gZ2V0KG9iaiwgcGF0aCkge1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgdmFyIGtleXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gIHZhciByZXN1bHQgPSBvYmo7XG4gIHRyeSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGtleXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdFtrZXlzW2ldXTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gc2V0KG9iaiwgcGF0aCwgdmFsdWUpIHtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGtleXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gIHZhciBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgaWYgKGxlbiA8IDEpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGxlbiA9PT0gMSkge1xuICAgIG9ialtrZXlzWzBdXSA9IHZhbHVlO1xuICAgIHJldHVybjtcbiAgfVxuICB0cnkge1xuICAgIHZhciB0ZW1wID0gb2JqW2tleXNbMF1dIHx8IHt9O1xuICAgIHZhciByZXBsYWNlbWVudCA9IHRlbXA7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW4gLSAxOyArK2kpIHtcbiAgICAgIHRlbXBba2V5c1tpXV0gPSB0ZW1wW2tleXNbaV1dIHx8IHt9O1xuICAgICAgdGVtcCA9IHRlbXBba2V5c1tpXV07XG4gICAgfVxuICAgIHRlbXBba2V5c1tsZW4gLSAxXV0gPSB2YWx1ZTtcbiAgICBvYmpba2V5c1swXV0gPSByZXBsYWNlbWVudDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybjtcbiAgfVxufVxuXG5mdW5jdGlvbiBmb3JtYXRBcmdzQXNTdHJpbmcoYXJncykge1xuICB2YXIgaSwgbGVuLCBhcmc7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yIChpID0gMCwgbGVuID0gYXJncy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIGFyZyA9IGFyZ3NbaV07XG4gICAgc3dpdGNoICh0eXBlTmFtZShhcmcpKSB7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBhcmcgPSBzdHJpbmdpZnkoYXJnKTtcbiAgICAgICAgYXJnID0gYXJnLmVycm9yIHx8IGFyZy52YWx1ZTtcbiAgICAgICAgaWYgKGFyZy5sZW5ndGggPiA1MDApIHtcbiAgICAgICAgICBhcmcgPSBhcmcuc3Vic3RyKDAsIDQ5NykgKyAnLi4uJztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ251bGwnOlxuICAgICAgICBhcmcgPSAnbnVsbCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgYXJnID0gJ3VuZGVmaW5lZCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3ltYm9sJzpcbiAgICAgICAgYXJnID0gYXJnLnRvU3RyaW5nKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXN1bHQucHVzaChhcmcpO1xuICB9XG4gIHJldHVybiByZXN1bHQuam9pbignICcpO1xufVxuXG5mdW5jdGlvbiBub3coKSB7XG4gIGlmIChEYXRlLm5vdykge1xuICAgIHJldHVybiArRGF0ZS5ub3coKTtcbiAgfVxuICByZXR1cm4gK25ldyBEYXRlKCk7XG59XG5cbmZ1bmN0aW9uIGZpbHRlcklwKHJlcXVlc3REYXRhLCBjYXB0dXJlSXApIHtcbiAgaWYgKCFyZXF1ZXN0RGF0YSB8fCAhcmVxdWVzdERhdGFbJ3VzZXJfaXAnXSB8fCBjYXB0dXJlSXAgPT09IHRydWUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG5ld0lwID0gcmVxdWVzdERhdGFbJ3VzZXJfaXAnXTtcbiAgaWYgKCFjYXB0dXJlSXApIHtcbiAgICBuZXdJcCA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBwYXJ0cztcbiAgICAgIGlmIChuZXdJcC5pbmRleE9mKCcuJykgIT09IC0xKSB7XG4gICAgICAgIHBhcnRzID0gbmV3SXAuc3BsaXQoJy4nKTtcbiAgICAgICAgcGFydHMucG9wKCk7XG4gICAgICAgIHBhcnRzLnB1c2goJzAnKTtcbiAgICAgICAgbmV3SXAgPSBwYXJ0cy5qb2luKCcuJyk7XG4gICAgICB9IGVsc2UgaWYgKG5ld0lwLmluZGV4T2YoJzonKSAhPT0gLTEpIHtcbiAgICAgICAgcGFydHMgPSBuZXdJcC5zcGxpdCgnOicpO1xuICAgICAgICBpZiAocGFydHMubGVuZ3RoID4gMikge1xuICAgICAgICAgIHZhciBiZWdpbm5pbmcgPSBwYXJ0cy5zbGljZSgwLCAzKTtcbiAgICAgICAgICB2YXIgc2xhc2hJZHggPSBiZWdpbm5pbmdbMl0uaW5kZXhPZignLycpO1xuICAgICAgICAgIGlmIChzbGFzaElkeCAhPT0gLTEpIHtcbiAgICAgICAgICAgIGJlZ2lubmluZ1syXSA9IGJlZ2lubmluZ1syXS5zdWJzdHJpbmcoMCwgc2xhc2hJZHgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdGVybWluYWwgPSAnMDAwMDowMDAwOjAwMDA6MDAwMDowMDAwJztcbiAgICAgICAgICBuZXdJcCA9IGJlZ2lubmluZy5jb25jYXQodGVybWluYWwpLmpvaW4oJzonKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3SXAgPSBudWxsO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIG5ld0lwID0gbnVsbDtcbiAgICB9XG4gIH1cbiAgcmVxdWVzdERhdGFbJ3VzZXJfaXAnXSA9IG5ld0lwO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVPcHRpb25zKGN1cnJlbnQsIGlucHV0LCBwYXlsb2FkLCBsb2dnZXIpIHtcbiAgdmFyIHJlc3VsdCA9IG1lcmdlKGN1cnJlbnQsIGlucHV0LCBwYXlsb2FkKTtcbiAgcmVzdWx0ID0gdXBkYXRlRGVwcmVjYXRlZE9wdGlvbnMocmVzdWx0LCBsb2dnZXIpO1xuICBpZiAoIWlucHV0IHx8IGlucHV0Lm92ZXJ3cml0ZVNjcnViRmllbGRzKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBpZiAoaW5wdXQuc2NydWJGaWVsZHMpIHtcbiAgICByZXN1bHQuc2NydWJGaWVsZHMgPSAoY3VycmVudC5zY3J1YkZpZWxkcyB8fCBbXSkuY29uY2F0KGlucHV0LnNjcnViRmllbGRzKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiB1cGRhdGVEZXByZWNhdGVkT3B0aW9ucyhvcHRpb25zLCBsb2dnZXIpIHtcbiAgaWYgKG9wdGlvbnMuaG9zdFdoaXRlTGlzdCAmJiAhb3B0aW9ucy5ob3N0U2FmZUxpc3QpIHtcbiAgICBvcHRpb25zLmhvc3RTYWZlTGlzdCA9IG9wdGlvbnMuaG9zdFdoaXRlTGlzdDtcbiAgICBvcHRpb25zLmhvc3RXaGl0ZUxpc3QgPSB1bmRlZmluZWQ7XG4gICAgbG9nZ2VyICYmIGxvZ2dlci5sb2coJ2hvc3RXaGl0ZUxpc3QgaXMgZGVwcmVjYXRlZC4gVXNlIGhvc3RTYWZlTGlzdC4nKTtcbiAgfVxuICBpZiAob3B0aW9ucy5ob3N0QmxhY2tMaXN0ICYmICFvcHRpb25zLmhvc3RCbG9ja0xpc3QpIHtcbiAgICBvcHRpb25zLmhvc3RCbG9ja0xpc3QgPSBvcHRpb25zLmhvc3RCbGFja0xpc3Q7XG4gICAgb3B0aW9ucy5ob3N0QmxhY2tMaXN0ID0gdW5kZWZpbmVkO1xuICAgIGxvZ2dlciAmJiBsb2dnZXIubG9nKCdob3N0QmxhY2tMaXN0IGlzIGRlcHJlY2F0ZWQuIFVzZSBob3N0QmxvY2tMaXN0LicpO1xuICB9XG4gIHJldHVybiBvcHRpb25zO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGg6IGFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoLFxuICBjcmVhdGVJdGVtOiBjcmVhdGVJdGVtLFxuICBhZGRFcnJvckNvbnRleHQ6IGFkZEVycm9yQ29udGV4dCxcbiAgY3JlYXRlVGVsZW1ldHJ5RXZlbnQ6IGNyZWF0ZVRlbGVtZXRyeUV2ZW50LFxuICBhZGRJdGVtQXR0cmlidXRlczogYWRkSXRlbUF0dHJpYnV0ZXMsXG4gIGZpbHRlcklwOiBmaWx0ZXJJcCxcbiAgZm9ybWF0QXJnc0FzU3RyaW5nOiBmb3JtYXRBcmdzQXNTdHJpbmcsXG4gIGZvcm1hdFVybDogZm9ybWF0VXJsLFxuICBnZXQ6IGdldCxcbiAgaGFuZGxlT3B0aW9uczogaGFuZGxlT3B0aW9ucyxcbiAgaXNFcnJvcjogaXNFcnJvcixcbiAgaXNGaW5pdGVOdW1iZXI6IGlzRmluaXRlTnVtYmVyLFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICBpc0l0ZXJhYmxlOiBpc0l0ZXJhYmxlLFxuICBpc05hdGl2ZUZ1bmN0aW9uOiBpc05hdGl2ZUZ1bmN0aW9uLFxuICBpc09iamVjdDogaXNPYmplY3QsXG4gIGlzU3RyaW5nOiBpc1N0cmluZyxcbiAgaXNUeXBlOiBpc1R5cGUsXG4gIGlzUHJvbWlzZTogaXNQcm9taXNlLFxuICBpc0Jyb3dzZXI6IGlzQnJvd3NlcixcbiAganNvblBhcnNlOiBqc29uUGFyc2UsXG4gIExFVkVMUzogTEVWRUxTLFxuICBtYWtlVW5oYW5kbGVkU3RhY2tJbmZvOiBtYWtlVW5oYW5kbGVkU3RhY2tJbmZvLFxuICBtZXJnZTogbWVyZ2UsXG4gIG5vdzogbm93LFxuICByZWRhY3Q6IHJlZGFjdCxcbiAgUm9sbGJhckpTT046IFJvbGxiYXJKU09OLFxuICBzYW5pdGl6ZVVybDogc2FuaXRpemVVcmwsXG4gIHNldDogc2V0LFxuICBzZXR1cEpTT046IHNldHVwSlNPTixcbiAgc3RyaW5naWZ5OiBzdHJpbmdpZnksXG4gIG1heEJ5dGVTaXplOiBtYXhCeXRlU2l6ZSxcbiAgdHlwZU5hbWU6IHR5cGVOYW1lLFxuICB1dWlkNDogdXVpZDQsXG59O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8qIGdsb2JhbHMgZXhwZWN0ICovXG4vKiBnbG9iYWxzIGRlc2NyaWJlICovXG4vKiBnbG9iYWxzIGl0ICovXG4vKiBnbG9iYWxzIHNpbm9uICovXG5cbnZhciBOb3RpZmllciA9IHJlcXVpcmUoJy4uL3NyYy9ub3RpZmllcicpO1xuXG52YXIgcm9sbGJhckNvbmZpZyA9IHtcbiAgYWNjZXNzVG9rZW46ICcxMmM5OWRlNjdhNDQ0YzIyOWZjYTEwMGUwOTY3NDg2ZicsXG4gIGNhcHR1cmVVbmNhdWdodDogdHJ1ZSxcbn07XG5cbmZ1bmN0aW9uIFRlc3RRdWV1ZUdlbmVyYXRvcigpIHtcbiAgdmFyIFRlc3RRdWV1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLml0ZW1zID0gW107XG4gIH07XG5cbiAgVGVzdFF1ZXVlLnByb3RvdHlwZS5hZGRQZW5kaW5nSXRlbSA9IGZ1bmN0aW9uICgpIHt9O1xuICBUZXN0UXVldWUucHJvdG90eXBlLnJlbW92ZVBlbmRpbmdJdGVtID0gZnVuY3Rpb24gKCkge307XG4gIFRlc3RRdWV1ZS5wcm90b3R5cGUuYWRkSXRlbSA9IGZ1bmN0aW9uIChpdGVtLCBjYWxsYmFjaykge1xuICAgIHRoaXMuaXRlbXMucHVzaCh7IGl0ZW06IGl0ZW0sIGNhbGxiYWNrOiBjYWxsYmFjayB9KTtcbiAgfTtcblxuICBUZXN0UXVldWUucHJvdG90eXBlLmNvbmZpZ3VyZSA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gIHJldHVybiBUZXN0UXVldWU7XG59XG5cbmRlc2NyaWJlKCdOb3RpZmllcigpJywgZnVuY3Rpb24gKCkge1xuICBpdCgnc2hvdWxkIGhhdmUgYWxsIG9mIHRoZSBleHBlY3RlZCBtZXRob2RzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgcXVldWUgPSBuZXcgKFRlc3RRdWV1ZUdlbmVyYXRvcigpKSgpO1xuICAgIHZhciBvcHRpb25zID0geyBlbmFibGVkOiB0cnVlIH07XG4gICAgdmFyIG5vdGlmaWVyID0gbmV3IE5vdGlmaWVyKHF1ZXVlLCBvcHRpb25zKTtcbiAgICBleHBlY3Qobm90aWZpZXIpLnRvLmhhdmUucHJvcGVydHkoJ2NvbmZpZ3VyZScpO1xuICAgIGV4cGVjdChub3RpZmllcikudG8uaGF2ZS5wcm9wZXJ0eSgnYWRkVHJhbnNmb3JtJyk7XG4gICAgZXhwZWN0KG5vdGlmaWVyKS50by5oYXZlLnByb3BlcnR5KCdsb2cnKTtcblxuICAgIGRvbmUoKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2NvbmZpZ3VyZScsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCB1cGRhdGUgdGhlIG9wdGlvbnMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBxdWV1ZSA9IG5ldyAoVGVzdFF1ZXVlR2VuZXJhdG9yKCkpKCk7XG4gICAgdmFyIG9wdGlvbnMgPSB7IHNvbWVCb29sOiB0cnVlLCBvdGhlcjogJ3N0dWZmJywgZW5hYmxlZDogdHJ1ZSB9O1xuICAgIHZhciBub3RpZmllciA9IG5ldyBOb3RpZmllcihxdWV1ZSwgb3B0aW9ucyk7XG5cbiAgICBub3RpZmllci5jb25maWd1cmUoeyBvdGhlcjogJ2JheicgfSk7XG5cbiAgICBleHBlY3Qobm90aWZpZXIub3B0aW9ucy5zb21lQm9vbCkudG8uYmUub2soKTtcbiAgICBleHBlY3Qobm90aWZpZXIub3B0aW9ucy5vdGhlcikudG8uZXFsKCdiYXonKTtcblxuICAgIGRvbmUoKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBwYXNzIHRoZSB1cGRhdGVkIG9wdGlvbnMgdG8gdGhlIHRyYW5zZm9ybScsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIHF1ZXVlID0gbmV3IChUZXN0UXVldWVHZW5lcmF0b3IoKSkoKTtcbiAgICB2YXIgb3B0aW9ucyA9IHsgc29tZUJvb2w6IHRydWUsIGVuYWJsZWQ6IHRydWUgfTtcbiAgICB2YXIgbm90aWZpZXIgPSBuZXcgTm90aWZpZXIocXVldWUsIG9wdGlvbnMpO1xuXG4gICAgdmFyIGluaXRpYWxJdGVtID0geyBhOiAxMjMsIGI6ICdhIHN0cmluZycgfTtcbiAgICBub3RpZmllclxuICAgICAgLmFkZFRyYW5zZm9ybShmdW5jdGlvbiAoaSwgbywgY2IpIHtcbiAgICAgICAgZXhwZWN0KG8uc29tZUJvb2wpLnRvLm5vdC5iZS5vaygpO1xuICAgICAgICBjYihudWxsLCB7IGE6IDQyLCBiOiBpLmIgfSk7XG4gICAgICB9KVxuICAgICAgLmFkZFRyYW5zZm9ybShmdW5jdGlvbiAoaSwgbywgY2IpIHtcbiAgICAgICAgZXhwZWN0KG8uc29tZUJvb2wpLnRvLm5vdC5iZS5vaygpO1xuICAgICAgICBjYihudWxsLCB7IGE6IGkuYSArIDEsIGI6IGkuYiB9KTtcbiAgICAgIH0pO1xuXG4gICAgbm90aWZpZXIuY29uZmlndXJlKHsgc29tZUJvb2w6IGZhbHNlIH0pO1xuXG4gICAgdmFyIHNweSA9IHNpbm9uLnNweSgpO1xuICAgIG5vdGlmaWVyLmxvZyhpbml0aWFsSXRlbSwgc3B5KTtcblxuICAgIGV4cGVjdChzcHkuY2FsbGVkKS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QocXVldWUuaXRlbXMubGVuZ3RoKS50by5lcWwoMSk7XG4gICAgZXhwZWN0KHF1ZXVlLml0ZW1zWzBdLml0ZW0pLnRvLm5vdC5lcWwoaW5pdGlhbEl0ZW0pO1xuICAgIGV4cGVjdChxdWV1ZS5pdGVtc1swXS5pdGVtLmEpLnRvLmVxbCg0Myk7XG4gICAgZXhwZWN0KHF1ZXVlLml0ZW1zWzBdLml0ZW0uYikudG8uZXFsKCdhIHN0cmluZycpO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBub3QgYWRkIGFuIGl0ZW0gaWYgZGlzYWJsZWQgaW4gY29uc3RydWN0b3InLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBxdWV1ZSA9IG5ldyAoVGVzdFF1ZXVlR2VuZXJhdG9yKCkpKCk7XG4gICAgdmFyIG9wdGlvbnMgPSB7IHNvbWVCb29sOiB0cnVlLCBlbmFibGVkOiBmYWxzZSB9O1xuICAgIHZhciBub3RpZmllciA9IG5ldyBOb3RpZmllcihxdWV1ZSwgb3B0aW9ucyk7XG4gICAgdmFyIGluaXRpYWxJdGVtID0geyBhOiAxMjMsIGI6ICdhIHN0cmluZycgfTtcbiAgICBub3RpZmllci5sb2coaW5pdGlhbEl0ZW0pO1xuICAgIGV4cGVjdChxdWV1ZS5pdGVtcy5sZW5ndGgpLnRvLmVxbCgwKTtcbiAgICBkb25lKCk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIG5vdCBhZGQgYW4gaXRlbSBpZiBkaXNhYmxlZCB2aWEgY2FsbCB0byBjb25maWd1cmUnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBxdWV1ZSA9IG5ldyAoVGVzdFF1ZXVlR2VuZXJhdG9yKCkpKCk7XG4gICAgdmFyIG9wdGlvbnMgPSB7IHNvbWVCb29sOiB0cnVlLCBlbmFibGVkOiB0cnVlIH07XG4gICAgdmFyIG5vdGlmaWVyID0gbmV3IE5vdGlmaWVyKHF1ZXVlLCBvcHRpb25zKTtcbiAgICB2YXIgaW5pdGlhbEl0ZW0gPSB7IGE6IDEyMywgYjogJ2Egc3RyaW5nJyB9O1xuICAgIG5vdGlmaWVyLmNvbmZpZ3VyZSh7IGVuYWJsZWQ6IGZhbHNlIH0pO1xuICAgIG5vdGlmaWVyLmxvZyhpbml0aWFsSXRlbSk7XG4gICAgZXhwZWN0KHF1ZXVlLml0ZW1zLmxlbmd0aCkudG8uZXFsKDApO1xuICAgIGRvbmUoKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2FkZFRyYW5zZm9ybScsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCBub3QgYWRkIGEgbm9uLWZ1bmN0aW9uJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgcXVldWUgPSBuZXcgKFRlc3RRdWV1ZUdlbmVyYXRvcigpKSgpO1xuICAgIHZhciBvcHRpb25zID0geyBlbmFibGVkOiB0cnVlIH07XG4gICAgdmFyIG5vdGlmaWVyID0gbmV3IE5vdGlmaWVyKHF1ZXVlLCBvcHRpb25zKTtcblxuICAgIGV4cGVjdChub3RpZmllci50cmFuc2Zvcm1zLmxlbmd0aCkudG8uZXFsKDApO1xuICAgIG5vdGlmaWVyLmFkZFRyYW5zZm9ybSgnZ2FyYmFnZScpO1xuICAgIGV4cGVjdChub3RpZmllci50cmFuc2Zvcm1zLmxlbmd0aCkudG8uZXFsKDApO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGFkZCBhIGZ1bmN0aW9uJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgcXVldWUgPSBuZXcgKFRlc3RRdWV1ZUdlbmVyYXRvcigpKSgpO1xuICAgIHZhciBvcHRpb25zID0geyBlbmFibGVkOiB0cnVlIH07XG4gICAgdmFyIG5vdGlmaWVyID0gbmV3IE5vdGlmaWVyKHF1ZXVlLCBvcHRpb25zKTtcblxuICAgIGV4cGVjdChub3RpZmllci50cmFuc2Zvcm1zLmxlbmd0aCkudG8uZXFsKDApO1xuICAgIG5vdGlmaWVyLmFkZFRyYW5zZm9ybShmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm47XG4gICAgfSk7XG4gICAgZXhwZWN0KG5vdGlmaWVyLnRyYW5zZm9ybXMubGVuZ3RoKS50by5lcWwoMSk7XG5cbiAgICBkb25lKCk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdsb2cnLCBmdW5jdGlvbiAoKSB7XG4gIGl0KCdzaG91bGQgd29yayB3aXRob3V0IGFueSB0cmFuc2Zvcm1zJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgcXVldWUgPSBuZXcgKFRlc3RRdWV1ZUdlbmVyYXRvcigpKSgpO1xuICAgIHZhciBvcHRpb25zID0geyBlbmFibGVkOiB0cnVlIH07XG4gICAgdmFyIG5vdGlmaWVyID0gbmV3IE5vdGlmaWVyKHF1ZXVlLCBvcHRpb25zKTtcblxuICAgIHZhciBpbml0aWFsSXRlbSA9IHsgYTogMTIzLCBiOiAnYSBzdHJpbmcnIH07XG4gICAgdmFyIHNweSA9IHNpbm9uLnNweSgpO1xuICAgIG5vdGlmaWVyLmxvZyhpbml0aWFsSXRlbSwgc3B5KTtcbiAgICBleHBlY3Qoc3B5LmNhbGxlZCkudG8ubm90LmJlLm9rKCk7XG4gICAgZXhwZWN0KHF1ZXVlLml0ZW1zLmxlbmd0aCkudG8uZXFsKDEpO1xuICAgIGV4cGVjdChxdWV1ZS5pdGVtc1swXS5pdGVtKS50by5lcWwoaW5pdGlhbEl0ZW0pO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGFwcGx5IHRoZSB0cmFuc2Zvcm1zJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgcXVldWUgPSBuZXcgKFRlc3RRdWV1ZUdlbmVyYXRvcigpKSgpO1xuICAgIHZhciBvcHRpb25zID0geyBlbmFibGVkOiB0cnVlIH07XG4gICAgdmFyIG5vdGlmaWVyID0gbmV3IE5vdGlmaWVyKHF1ZXVlLCBvcHRpb25zKTtcblxuICAgIHZhciBpbml0aWFsSXRlbSA9IHsgYTogMTIzLCBiOiAnYSBzdHJpbmcnIH07XG4gICAgbm90aWZpZXJcbiAgICAgIC5hZGRUcmFuc2Zvcm0oZnVuY3Rpb24gKGksIG8sIGNiKSB7XG4gICAgICAgIGNiKG51bGwsIHsgYTogNDIsIGI6IGkuYiB9KTtcbiAgICAgIH0pXG4gICAgICAuYWRkVHJhbnNmb3JtKGZ1bmN0aW9uIChpLCBvLCBjYikge1xuICAgICAgICBjYihudWxsLCB7IGE6IGkuYSArIDEsIGI6IGkuYiB9KTtcbiAgICAgIH0pO1xuICAgIHZhciBzcHkgPSBzaW5vbi5zcHkoKTtcbiAgICBub3RpZmllci5sb2coaW5pdGlhbEl0ZW0sIHNweSk7XG5cbiAgICBleHBlY3Qoc3B5LmNhbGxlZCkudG8ubm90LmJlLm9rKCk7XG4gICAgZXhwZWN0KHF1ZXVlLml0ZW1zLmxlbmd0aCkudG8uZXFsKDEpO1xuICAgIGV4cGVjdChxdWV1ZS5pdGVtc1swXS5pdGVtKS50by5ub3QuZXFsKGluaXRpYWxJdGVtKTtcbiAgICBleHBlY3QocXVldWUuaXRlbXNbMF0uaXRlbS5hKS50by5lcWwoNDMpO1xuICAgIGV4cGVjdChxdWV1ZS5pdGVtc1swXS5pdGVtLmIpLnRvLmVxbCgnYSBzdHJpbmcnKTtcblxuICAgIGRvbmUoKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBzdG9wIGFuZCBjYWxsYmFjayBpZiBhIHRyYW5zZm9ybSBlcnJvcnMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBxdWV1ZSA9IG5ldyAoVGVzdFF1ZXVlR2VuZXJhdG9yKCkpKCk7XG4gICAgdmFyIG9wdGlvbnMgPSB7IGVuYWJsZWQ6IHRydWUgfTtcbiAgICB2YXIgbm90aWZpZXIgPSBuZXcgTm90aWZpZXIocXVldWUsIG9wdGlvbnMpO1xuXG4gICAgdmFyIGluaXRpYWxJdGVtID0geyBhOiAxMjMsIGI6ICdhIHN0cmluZycgfTtcbiAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IoJ2ZpenogYnV6eicpO1xuICAgIG5vdGlmaWVyXG4gICAgICAuYWRkVHJhbnNmb3JtKGZ1bmN0aW9uIChpLCBvLCBjYikge1xuICAgICAgICBjYihlcnJvciwgbnVsbCk7XG4gICAgICB9KVxuICAgICAgLmFkZFRyYW5zZm9ybShmdW5jdGlvbiAoaSwgbywgY2IpIHtcbiAgICAgICAgZXhwZWN0KGZhbHNlKS50by5iZS5vaygpOyAvLyBhc3NlcnQgdGhpcyBpcyBub3QgY2FsbGVkXG4gICAgICAgIGNiKG51bGwsIHsgYTogNDIsIGI6IGkuYiB9KTtcbiAgICAgIH0pO1xuICAgIHZhciBzcHkgPSBzaW5vbi5zcHkoKTtcbiAgICBub3RpZmllci5sb2coaW5pdGlhbEl0ZW0sIHNweSk7XG5cbiAgICBleHBlY3Qoc3B5LmNhbGxlZCkudG8uYmUub2soKTtcbiAgICBleHBlY3Qoc3B5LmNhbGxlZFdpdGhFeGFjdGx5KGVycm9yLCBudWxsKSkudG8uYmUub2soKTtcbiAgICBleHBlY3QocXVldWUuaXRlbXMubGVuZ3RoKS50by5lcWwoMCk7XG5cbiAgICBkb25lKCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgd29yayB3aXRob3V0IGEgY2FsbGJhY2snLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBxdWV1ZSA9IG5ldyAoVGVzdFF1ZXVlR2VuZXJhdG9yKCkpKCk7XG4gICAgdmFyIG9wdGlvbnMgPSB7IGVuYWJsZWQ6IHRydWUgfTtcbiAgICB2YXIgbm90aWZpZXIgPSBuZXcgTm90aWZpZXIocXVldWUsIG9wdGlvbnMpO1xuXG4gICAgdmFyIGluaXRpYWxJdGVtID0geyBhOiAxMjMsIGI6ICdhIHN0cmluZycgfTtcbiAgICBub3RpZmllclxuICAgICAgLmFkZFRyYW5zZm9ybShmdW5jdGlvbiAoaSwgbywgY2IpIHtcbiAgICAgICAgY2IobmV3IEVycm9yKCdmaXp6IGJ1enonKSwgbnVsbCk7XG4gICAgICB9KVxuICAgICAgLmFkZFRyYW5zZm9ybShmdW5jdGlvbiAoaSwgbywgY2IpIHtcbiAgICAgICAgZXhwZWN0KGZhbHNlKS50by5iZS5vaygpOyAvLyBhc3NlcnQgdGhpcyBpcyBub3QgY2FsbGVkXG4gICAgICAgIGNiKG51bGwsIHsgYTogNDIsIGI6IGkuYiB9KTtcbiAgICAgIH0pO1xuICAgIG5vdGlmaWVyLmxvZyhpbml0aWFsSXRlbSk7XG5cbiAgICBleHBlY3QocXVldWUuaXRlbXMubGVuZ3RoKS50by5lcWwoMCk7XG5cbiAgICBkb25lKCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcGFzcyB0aGUgb3B0aW9ucyB0byB0aGUgdHJhbnNmb3JtcycsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIHF1ZXVlID0gbmV3IChUZXN0UXVldWVHZW5lcmF0b3IoKSkoKTtcbiAgICB2YXIgb3B0aW9ucyA9IHsgZW5hYmxlZDogdHJ1ZSwgc29tZUJvb2w6IHRydWUgfTtcbiAgICB2YXIgbm90aWZpZXIgPSBuZXcgTm90aWZpZXIocXVldWUsIG9wdGlvbnMpO1xuXG4gICAgdmFyIGluaXRpYWxJdGVtID0geyBhOiAxMjMsIGI6ICdhIHN0cmluZycgfTtcbiAgICBub3RpZmllclxuICAgICAgLmFkZFRyYW5zZm9ybShmdW5jdGlvbiAoaSwgbywgY2IpIHtcbiAgICAgICAgZXhwZWN0KG8uc29tZUJvb2wpLnRvLmJlLm9rKCk7XG4gICAgICAgIGNiKG51bGwsIHsgYTogNDIsIGI6IGkuYiB9KTtcbiAgICAgIH0pXG4gICAgICAuYWRkVHJhbnNmb3JtKGZ1bmN0aW9uIChpLCBvLCBjYikge1xuICAgICAgICBleHBlY3Qoby5zb21lQm9vbCkudG8uYmUub2soKTtcbiAgICAgICAgY2IobnVsbCwgeyBhOiBpLmEgKyAxLCBiOiBpLmIgfSk7XG4gICAgICB9KTtcbiAgICB2YXIgc3B5ID0gc2lub24uc3B5KCk7XG4gICAgbm90aWZpZXIubG9nKGluaXRpYWxJdGVtLCBzcHkpO1xuXG4gICAgZXhwZWN0KHNweS5jYWxsZWQpLnRvLm5vdC5iZS5vaygpO1xuICAgIGV4cGVjdChxdWV1ZS5pdGVtcy5sZW5ndGgpLnRvLmVxbCgxKTtcbiAgICBleHBlY3QocXVldWUuaXRlbXNbMF0uaXRlbSkudG8ubm90LmVxbChpbml0aWFsSXRlbSk7XG4gICAgZXhwZWN0KHF1ZXVlLml0ZW1zWzBdLml0ZW0uYSkudG8uZXFsKDQzKTtcbiAgICBleHBlY3QocXVldWUuaXRlbXNbMF0uaXRlbS5iKS50by5lcWwoJ2Egc3RyaW5nJyk7XG5cbiAgICBkb25lKCk7XG4gIH0pO1xufSk7XG4iXSwibmFtZXMiOlsiaGFzT3duIiwiT2JqZWN0IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJ0b1N0ciIsInRvU3RyaW5nIiwiaXNQbGFpbk9iamVjdCIsIm9iaiIsImNhbGwiLCJoYXNPd25Db25zdHJ1Y3RvciIsImhhc0lzUHJvdG90eXBlT2YiLCJjb25zdHJ1Y3RvciIsImtleSIsIm1lcmdlIiwiaSIsInNyYyIsImNvcHkiLCJjbG9uZSIsIm5hbWUiLCJyZXN1bHQiLCJjdXJyZW50IiwibGVuZ3RoIiwiYXJndW1lbnRzIiwibW9kdWxlIiwiZXhwb3J0cyIsIl8iLCJyZXF1aXJlIiwiTm90aWZpZXIiLCJxdWV1ZSIsIm9wdGlvbnMiLCJ0cmFuc2Zvcm1zIiwiZGlhZ25vc3RpYyIsImNvbmZpZ3VyZSIsIm9sZE9wdGlvbnMiLCJhZGRUcmFuc2Zvcm0iLCJ0cmFuc2Zvcm0iLCJpc0Z1bmN0aW9uIiwicHVzaCIsImxvZyIsIml0ZW0iLCJjYWxsYmFjayIsImVuYWJsZWQiLCJFcnJvciIsImFkZFBlbmRpbmdJdGVtIiwib3JpZ2luYWxFcnJvciIsImVyciIsIl9hcHBseVRyYW5zZm9ybXMiLCJyZW1vdmVQZW5kaW5nSXRlbSIsImFkZEl0ZW0iLCJiaW5kIiwidHJhbnNmb3JtSW5kZXgiLCJ0cmFuc2Zvcm1zTGVuZ3RoIiwiY2IiLCJSb2xsYmFySlNPTiIsInNldHVwSlNPTiIsInBvbHlmaWxsSlNPTiIsInN0cmluZ2lmeSIsInBhcnNlIiwiaXNEZWZpbmVkIiwiSlNPTiIsImlzTmF0aXZlRnVuY3Rpb24iLCJpc1R5cGUiLCJ4IiwidCIsInR5cGVOYW1lIiwiX3R5cGVvZiIsIm1hdGNoIiwidG9Mb3dlckNhc2UiLCJmIiwicmVSZWdFeHBDaGFyIiwiZnVuY01hdGNoU3RyaW5nIiwiRnVuY3Rpb24iLCJyZXBsYWNlIiwicmVJc05hdGl2ZSIsIlJlZ0V4cCIsImlzT2JqZWN0IiwidGVzdCIsInZhbHVlIiwidHlwZSIsImlzU3RyaW5nIiwiU3RyaW5nIiwiaXNGaW5pdGVOdW1iZXIiLCJuIiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJ1IiwiaXNJdGVyYWJsZSIsImlzRXJyb3IiLCJlIiwiaXNQcm9taXNlIiwicCIsInRoZW4iLCJpc0Jyb3dzZXIiLCJ3aW5kb3ciLCJyZWRhY3QiLCJ1dWlkNCIsImQiLCJub3ciLCJ1dWlkIiwiYyIsInIiLCJNYXRoIiwicmFuZG9tIiwiZmxvb3IiLCJMRVZFTFMiLCJkZWJ1ZyIsImluZm8iLCJ3YXJuaW5nIiwiZXJyb3IiLCJjcml0aWNhbCIsInNhbml0aXplVXJsIiwidXJsIiwiYmFzZVVybFBhcnRzIiwicGFyc2VVcmkiLCJhbmNob3IiLCJzb3VyY2UiLCJxdWVyeSIsInBhcnNlVXJpT3B0aW9ucyIsInN0cmljdE1vZGUiLCJxIiwicGFyc2VyIiwic3RyaWN0IiwibG9vc2UiLCJzdHIiLCJ1bmRlZmluZWQiLCJvIiwibSIsImV4ZWMiLCJ1cmkiLCJsIiwiJDAiLCIkMSIsIiQyIiwiYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGgiLCJhY2Nlc3NUb2tlbiIsInBhcmFtcyIsImFjY2Vzc190b2tlbiIsInBhcmFtc0FycmF5IiwiayIsImpvaW4iLCJzb3J0IiwicGF0aCIsInFzIiwiaW5kZXhPZiIsImgiLCJzdWJzdHJpbmciLCJmb3JtYXRVcmwiLCJwcm90b2NvbCIsInBvcnQiLCJob3N0bmFtZSIsImJhY2t1cCIsImpzb25FcnJvciIsImJhY2t1cEVycm9yIiwibWF4Qnl0ZVNpemUiLCJzdHJpbmciLCJjb3VudCIsImNvZGUiLCJjaGFyQ29kZUF0IiwianNvblBhcnNlIiwicyIsIm1ha2VVbmhhbmRsZWRTdGFja0luZm8iLCJtZXNzYWdlIiwibGluZW5vIiwiY29sbm8iLCJtb2RlIiwiYmFja3VwTWVzc2FnZSIsImVycm9yUGFyc2VyIiwibG9jYXRpb24iLCJsaW5lIiwiY29sdW1uIiwiZnVuYyIsImd1ZXNzRnVuY3Rpb25OYW1lIiwiY29udGV4dCIsImdhdGhlckNvbnRleHQiLCJocmVmIiwiZG9jdW1lbnQiLCJ1c2VyYWdlbnQiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJzdGFjayIsIndyYXBDYWxsYmFjayIsImxvZ2dlciIsInJlc3AiLCJub25DaXJjdWxhckNsb25lIiwic2VlbiIsIm5ld1NlZW4iLCJpbmNsdWRlcyIsInNsaWNlIiwiY3JlYXRlSXRlbSIsImFyZ3MiLCJub3RpZmllciIsInJlcXVlc3RLZXlzIiwibGFtYmRhQ29udGV4dCIsImN1c3RvbSIsInJlcXVlc3QiLCJhcmciLCJleHRyYUFyZ3MiLCJhcmdUeXBlcyIsInR5cCIsIkRPTUV4Y2VwdGlvbiIsImoiLCJsZW4iLCJ0aW1lc3RhbXAiLCJkYXRhIiwic2V0Q3VzdG9tSXRlbUtleXMiLCJfb3JpZ2luYWxBcmdzIiwib3JpZ2luYWxfYXJnX3R5cGVzIiwibGV2ZWwiLCJza2lwRnJhbWVzIiwiYWRkRXJyb3JDb250ZXh0IiwiZXJyb3JzIiwiY29udGV4dEFkZGVkIiwicm9sbGJhckNvbnRleHQiLCJlcnJvcl9jb250ZXh0IiwiVEVMRU1FVFJZX1RZUEVTIiwiVEVMRU1FVFJZX0xFVkVMUyIsImFycmF5SW5jbHVkZXMiLCJhcnIiLCJ2YWwiLCJjcmVhdGVUZWxlbWV0cnlFdmVudCIsIm1ldGFkYXRhIiwiZXZlbnQiLCJhZGRJdGVtQXR0cmlidXRlcyIsImF0dHJpYnV0ZXMiLCJfaXRlbSRkYXRhJGF0dHJpYnV0ZXMiLCJhcHBseSIsIl90b0NvbnN1bWFibGVBcnJheSIsImdldCIsImtleXMiLCJzcGxpdCIsInNldCIsInRlbXAiLCJyZXBsYWNlbWVudCIsImZvcm1hdEFyZ3NBc1N0cmluZyIsInN1YnN0ciIsIkRhdGUiLCJmaWx0ZXJJcCIsInJlcXVlc3REYXRhIiwiY2FwdHVyZUlwIiwibmV3SXAiLCJwYXJ0cyIsInBvcCIsImJlZ2lubmluZyIsInNsYXNoSWR4IiwidGVybWluYWwiLCJjb25jYXQiLCJoYW5kbGVPcHRpb25zIiwiaW5wdXQiLCJwYXlsb2FkIiwidXBkYXRlRGVwcmVjYXRlZE9wdGlvbnMiLCJvdmVyd3JpdGVTY3J1YkZpZWxkcyIsInNjcnViRmllbGRzIiwiaG9zdFdoaXRlTGlzdCIsImhvc3RTYWZlTGlzdCIsImhvc3RCbGFja0xpc3QiLCJob3N0QmxvY2tMaXN0Il0sInNvdXJjZVJvb3QiOiIifQ==