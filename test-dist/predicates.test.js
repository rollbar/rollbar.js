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

/***/ "./src/predicates.js":
/*!***************************!*\
  !*** ./src/predicates.js ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");
function checkLevel(item, settings) {
  var level = item.level;
  var levelVal = _.LEVELS[level] || 0;
  var reportLevel = settings.reportLevel;
  var reportLevelVal = _.LEVELS[reportLevel] || 0;
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
      if (_.isFunction(settings.onSendCallback)) {
        settings.onSendCallback(isUncaught, args, item);
      }
    } catch (e) {
      settings.onSendCallback = null;
      logger.error('Error while calling onSendCallback, removing', e);
    }
    try {
      if (_.isFunction(settings.checkIgnore) && settings.checkIgnore(isUncaught, args, item)) {
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
    if (!_.isType(filename, 'string')) {
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
    traces = _.get(item, 'body.trace_chain') || [_.get(item, 'body.trace')];

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
      messages.push(_.get(trace, 'exception.message'));
    }
  }
  if (body.trace) {
    messages.push(_.get(body, 'trace.exception.message'));
  }
  if (body.message) {
    messages.push(_.get(body, 'message.body'));
  }
  return messages;
}
module.exports = {
  checkLevel: checkLevel,
  userCheckIgnore: userCheckIgnore,
  urlIsNotBlockListed: urlIsNotBlockListed,
  urlIsSafeListed: urlIsSafeListed,
  messageIsIgnored: messageIsIgnored
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
  !*** ./test/predicates.test.js ***!
  \*********************************/
/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var p = __webpack_require__(/*! ../src/predicates */ "./src/predicates.js");
var logger = {
  log: function () {},
  error: function () {},
};

describe('userCheckIgnore', function () {
  it('should return true if no user function', function () {
    var item = { level: 'debug', body: 'stuff', _originalArgs: [1, 2, 3] };
    var settings = { reportLevel: 'debug' };
    expect(p.userCheckIgnore(logger)(item, settings)).to.be.ok();
  });
  it('should return true if checkIgnore is not a function', function () {
    var item = { level: 'debug', body: 'stuff', _originalArgs: [1, 2, 3] };
    var settings = { reportLevel: 'debug', checkIgnore: true };
    expect(p.userCheckIgnore(logger)(item, settings)).to.be.ok();
  });
  it('should return true if checkIgnore returns false', function () {
    var item = { level: 'debug', body: 'stuff', _originalArgs: [1, 2, 3] };
    var settings = {
      reportLevel: 'debug',
      checkIgnore: function () {
        return false;
      },
    };
    expect(p.userCheckIgnore(logger)(item, settings)).to.be.ok();
  });
  it('should return false if checkIgnore returns true', function () {
    var item = { level: 'debug', body: 'stuff', _originalArgs: [1, 2, 3] };
    var settings = {
      reportLevel: 'debug',
      checkIgnore: function () {
        return true;
      },
    };
    expect(p.userCheckIgnore(logger)(item, settings)).to.not.be.ok();
  });
  it('should return true if checkIgnore throws', function () {
    var item = { level: 'debug', body: 'stuff', _originalArgs: [1, 2, 3] };
    var settings = {
      reportLevel: 'debug',
      checkIgnore: function () {
        throw new Error('bork bork');
      },
    };
    expect(p.userCheckIgnore(logger)(item, settings)).to.be.ok();
    expect(settings.checkIgnore).to.not.be.ok();
  });
  it('should get the right arguments', function () {
    var item = { level: 'debug', body: 'stuff', _originalArgs: [1, 2, 3] };
    var settings = {
      reportLevel: 'debug',
      checkIgnore: function (isUncaught, args, payload) {
        expect(isUncaught).to.not.be.ok();
        expect(args).to.eql([1, 2, 3]);
        expect(payload).to.eql(item);
      },
    };
    expect(p.userCheckIgnore(logger)(item, settings)).to.be.ok();
  });
});

describe('urlIsSafeListed', function () {
  var item = {
    level: 'critical',
    body: {
      trace: {
        frames: [
          { filename: 'http://api.fake.com/v1/something' },
          { filename: 'http://api.example.com/v1/something' },
          { filename: 'http://api.fake.com/v2/something' },
        ],
      },
    },
  };
  var traceChainItem = {
    level: 'critical',
    body: {
      trace_chain: [
        {
          frames: [
            { filename: 'http://api.fake.com/v1/something' },
            { filename: 'http://api.example.com/v1/something' },
            { filename: 'http://api.fake.com/v2/something' },
          ],
        },
        {
          frames: [
            { filename: 'http://api.fake1.com/v2/something' },
            { filename: 'http://api.example1.com/v2/something' },
            { filename: 'http://api.fake1.com/v3/something' },
          ],
        },
      ],
    },
  };
  it('should return true with no safelist', function () {
    var settings = {
      reportLevel: 'debug',
    };
    expect(p.urlIsSafeListed(logger)(item, settings)).to.be.ok();
    expect(p.urlIsSafeListed(logger)(traceChainItem, settings)).to.be.ok();
  });
  it('should return true with no trace', function () {
    var item = {
      level: 'critical',
      body: { message: 'hey' },
    };
    var settings = {
      reportLevel: 'debug',
      hostSafeList: ['fake.com', 'example.com'],
    };
    expect(p.urlIsSafeListed(logger)(item, settings)).to.be.ok();
  });
  it('should return true if at least one regex matches at least one filename in the trace', function () {
    var settings = {
      reportLevel: 'debug',
      hostSafeList: ['example.com'],
    };
    expect(p.urlIsSafeListed(logger)(item, settings)).to.be.ok();
    expect(p.urlIsSafeListed(logger)(traceChainItem, settings)).to.be.ok();
  });
  it('should return true if the filename is not a string', function () {
    var item = {
      level: 'critical',
      body: {
        trace: {
          frames: [
            { filename: { url: 'http://api.fake.com/v1/something' } },
            { filename: { url: 'http://api.example.com/v1/something' } },
            { filename: { url: 'http://api.fake.com/v2/something' } },
          ],
        },
      },
    };
    var traceChainItem = {
      level: 'critical',
      body: {
        trace_chain: [
          {
            frames: [
              { filename: { url: 'http://api.fake.com/v1/something' } },
              { filename: { url: 'http://api.example.com/v1/something' } },
              { filename: { url: 'http://api.fake.com/v2/something' } },
            ],
          },
          {
            frames: [
              { filename: { url: 'http://api.fake.com/v1/something' } },
              { filename: { url: 'http://api.example.com/v1/something' } },
              { filename: { url: 'http://api.fake.com/v2/something' } },
            ],
          },
        ],
      },
    };
    var settings = {
      reportLevel: 'debug',
      hostSafeList: ['nope.com'],
    };
    expect(p.urlIsSafeListed(logger)(item, settings)).to.be.ok();
    expect(p.urlIsSafeListed(logger)(traceChainItem, settings)).to.be.ok();
  });
  it('should return true if there is no frames key', function () {
    var item = {
      level: 'critical',
      body: { trace: { notframes: [] } },
    };
    var traceChainItem = {
      level: 'critical',
      body: { trace_chain: [{ notframes: [] }, { notframes: [] }] },
    };
    var settings = {
      reportLevel: 'debug',
      hostSafeList: ['nope.com'],
    };
    expect(p.urlIsSafeListed(logger)(item, settings)).to.be.ok();
    expect(p.urlIsSafeListed(logger)(traceChainItem, settings)).to.be.ok();
  });
  it('should return true if there are no frames', function () {
    var item = {
      level: 'critical',
      body: { trace: { frames: [] } },
    };
    var traceChainItem = {
      level: 'critical',
      body: { trace_chain: [{ frames: [] }, { frames: [] }] },
    };
    var settings = {
      reportLevel: 'debug',
      hostSafeList: ['nope.com'],
    };
    expect(p.urlIsSafeListed(logger)(item, settings)).to.be.ok();
    expect(p.urlIsSafeListed(logger)(traceChainItem, settings)).to.be.ok();
  });
  it('should return false if nothing in the safelist matches', function () {
    var settings = {
      reportLevel: 'debug',
      hostSafeList: ['baz.com', 'foo.com'],
    };
    expect(p.urlIsSafeListed(logger)(item, settings)).to.not.be.ok();
    expect(p.urlIsSafeListed(logger)(traceChainItem, settings)).to.not.be.ok();
  });
});

describe('urlIsNotBlockListed', function () {
  var item = {
    level: 'critical',
    body: {
      trace: {
        frames: [
          { filename: 'http://api.fake.com/v1/something' },
          { filename: 'http://api.example.com/v1/something' },
          { filename: 'http://api.fake.com/v2/something' },
        ],
      },
    },
  };
  var traceChainItem = {
    level: 'critical',
    body: {
      trace_chain: [
        {
          frames: [
            { filename: 'http://api.fake.com/v1/something' },
            { filename: 'http://api.example.com/v1/something' },
            { filename: 'http://api.fake.com/v2/something' },
          ],
        },
        {
          frames: [
            { filename: 'http://api.fake1.com/v2/something' },
            { filename: 'http://api.example1.com/v2/something' },
            { filename: 'http://api.fake1.com/v3/something' },
          ],
        },
      ],
    },
  };
  it('should return true with no blocklist', function () {
    var settings = {
      reportLevel: 'debug',
    };
    expect(p.urlIsNotBlockListed(logger)(item, settings)).to.be.ok();
    expect(p.urlIsNotBlockListed(logger)(traceChainItem, settings)).to.be.ok();
  });
  it('should return true with no trace', function () {
    var item = {
      level: 'critical',
      body: { message: 'hey' },
    };
    var settings = {
      reportLevel: 'debug',
      hostBlockList: ['fake.com', 'other.com'],
    };
    expect(p.urlIsNotBlockListed(logger)(item, settings)).to.be.ok();
  });
  it('should return false if any regex matches at least one filename in the trace', function () {
    var settings = {
      reportLevel: 'debug',
      hostBlockList: ['example.com', 'other.com'],
    };
    expect(p.urlIsNotBlockListed(logger)(item, settings)).to.not.be.ok();
    expect(
      p.urlIsNotBlockListed(logger)(traceChainItem, settings),
    ).to.not.be.ok();
  });
  it('should return true if the filename is not a string', function () {
    var item = {
      level: 'critical',
      body: {
        trace: {
          frames: [
            { filename: { url: 'http://api.fake.com/v1/something' } },
            { filename: { url: 'http://api.example.com/v1/something' } },
            { filename: { url: 'http://api.fake.com/v2/something' } },
          ],
        },
      },
    };
    var traceChainItem = {
      level: 'critical',
      body: {
        trace_chain: [
          {
            frames: [
              { filename: { url: 'http://api.fake.com/v1/something' } },
              { filename: { url: 'http://api.example.com/v1/something' } },
              { filename: { url: 'http://api.fake.com/v2/something' } },
            ],
          },
          {
            frames: [
              { filename: { url: 'http://api.fake.com/v1/something' } },
              { filename: { url: 'http://api.example.com/v1/something' } },
              { filename: { url: 'http://api.fake.com/v2/something' } },
            ],
          },
        ],
      },
    };
    var settings = {
      reportLevel: 'debug',
      hostBlockList: ['example.com', 'other.com'],
    };
    expect(p.urlIsNotBlockListed(logger)(item, settings)).to.be.ok();
    expect(p.urlIsNotBlockListed(logger)(traceChainItem, settings)).to.be.ok();
  });
  it('should return true if there is no frames key', function () {
    var item = {
      level: 'critical',
      body: { trace: { notframes: [] } },
    };
    var traceChainItem = {
      level: 'critical',
      body: { trace_chain: [{ notframes: [] }, { notframes: [] }] },
    };
    var settings = {
      reportLevel: 'debug',
      hostBlockList: ['nope.com'],
    };
    expect(p.urlIsNotBlockListed(logger)(item, settings)).to.be.ok();
    expect(p.urlIsNotBlockListed(logger)(traceChainItem, settings)).to.be.ok();
  });
  it('should return true if there are no frames', function () {
    var item = {
      level: 'critical',
      body: { trace: { frames: [] } },
    };
    var traceChainItem = {
      level: 'critical',
      body: { trace_chain: [{ frames: [] }, { frames: [] }] },
    };
    var settings = {
      reportLevel: 'debug',
      hostBlockList: ['nope.com'],
    };
    expect(p.urlIsNotBlockListed(logger)(item, settings)).to.be.ok();
    expect(p.urlIsNotBlockListed(logger)(traceChainItem, settings)).to.be.ok();
  });
  it('should return true if nothing in the blocklist matches', function () {
    var settings = {
      reportLevel: 'debug',
      hostBlockList: ['baz.com', 'foo.com'],
    };
    expect(p.urlIsNotBlockListed(logger)(item, settings)).to.be.ok();
    expect(p.urlIsNotBlockListed(logger)(traceChainItem, settings)).to.be.ok();
  });
});

describe('messageIsIgnored', function () {
  it('true if no ignoredMessages setting', function () {
    var item = {
      level: 'critical',
      body: {
        trace: { exception: { message: 'bork bork' } },
        message: { body: 'fuzz' },
      },
    };
    var settings = {
      reportLevel: 'debug',
    };
    expect(p.messageIsIgnored(logger)(item, settings)).to.be.ok();
  });
  it('true if ignoredMessages is empty', function () {
    var item = {
      level: 'critical',
      body: {
        trace: { exception: { message: 'bork bork' } },
        message: { body: 'fuzz' },
      },
    };
    var settings = {
      reportLevel: 'debug',
      ignoredMessages: [],
    };
    expect(p.messageIsIgnored(logger)(item, settings)).to.be.ok();
  });
  it('true if no exception message', function () {
    var item = {
      level: 'critical',
      body: {
        trace: { exception: {} },
        message: 'fuzz',
      },
    };
    var settings = {
      reportLevel: 'debug',
      ignoredMessages: ['bork bork', 'fuzz'],
    };
    expect(p.messageIsIgnored(logger)(item, settings)).to.be.ok();
  });
  it('true if no ignoredMessages match', function () {
    var item = {
      level: 'critical',
      body: {
        trace: { exception: { message: 'bork bork' } },
        message: { body: 'fuzz' },
      },
    };
    var settings = {
      reportLevel: 'debug',
      ignoredMessages: ['fake', 'stuff'],
    };
    expect(p.messageIsIgnored(logger)(item, settings)).to.be.ok();
  });
  it('false if any ignoredMessages match', function () {
    var item = {
      level: 'critical',
      body: {
        trace: { exception: { message: 'bork bork' } },
        message: { body: 'fuzz' },
      },
    };
    var settings = {
      reportLevel: 'debug',
      ignoredMessages: ['bork bork', 'stuff'],
    };
    expect(p.messageIsIgnored(logger)(item, settings)).to.not.be.ok();
  });
  it('false if ignoredMessages regex match', function () {
    var item = {
      level: 'critical',
      body: {
        message: { body: 'This is an ignored message' },
      },
    };
    var settings = {
      reportLevel: 'debug',
      ignoredMessages: ['^This is an .{7} message$'],
    };
    expect(p.messageIsIgnored(logger)(item, settings)).to.not.be.ok();
  });
  it('false if ignoredMessages literal match', function () {
    var item = {
      level: 'critical',
      body: {
        message: { body: '{"data":{"messages":[{"message":"Unauthorized"}]}}' },
      },
    };
    var settings = {
      reportLevel: 'debug',
      ignoredMessages: ['{"data":{"messages":\\['],
    };
    expect(p.messageIsIgnored(logger)(item, settings)).to.not.be.ok();
  });
  it('false if ignoredMessages more literal regex matches', function () {
    var item = {
      level: 'critical',
      body: {
        message: { body: 'Match these characters: (*+?)' },
      },
    };
    var settings = {
      reportLevel: 'debug',
      ignoredMessages: ['\\(\\*\\+\\?\\)'],
    };
    expect(p.messageIsIgnored(logger)(item, settings)).to.not.be.ok();
  });
  it('false if both trace and body message but ignoredMessages only match body', function () {
    var item = {
      level: 'critical',
      body: {
        trace: { exception: { message: 'bork bork' } },
        message: { body: 'fuzz' },
      },
    };
    var settings = {
      reportLevel: 'debug',
      ignoredMessages: ['fuzz', 'stuff'],
    };
    expect(p.messageIsIgnored(logger)(item, settings)).to.not.be.ok();
  });
  it('false if ignoredMessages match something in body exception message', function () {
    var item = {
      level: 'critical',
      body: {
        trace: { frames: [] },
        message: { body: 'fuzz' },
      },
    };
    var settings = {
      reportLevel: 'debug',
      ignoredMessages: ['stuff', 'fuzz'],
    };
    expect(p.messageIsIgnored(logger)(item, settings)).to.not.be.ok();
  });
  it("true if trace_chain doesn't match", function () {
    var item = {
      level: 'critical',
      body: {
        trace_chain: [
          { exception: { message: 'inner bork' } },
          { exception: { message: 'outer bork' } },
        ],
      },
    };
    var settings = {
      reportLevel: 'debug',
      ignoredMessages: ['stuff', 'fuzz'],
    };
    expect(p.messageIsIgnored(logger)(item, settings)).to.be.ok();
  });
  it('false if first trace_chain trace matches', function () {
    var item = {
      level: 'critical',
      body: {
        trace_chain: [
          { exception: { message: 'inner stuff' } },
          { exception: { message: 'outer bork' } },
        ],
      },
    };
    var settings = {
      reportLevel: 'debug',
      ignoredMessages: ['stuff', 'fuzz'],
    };
    expect(p.messageIsIgnored(logger)(item, settings)).to.not.be.ok();
  });
  it('false if last trace_chain trace matches', function () {
    var item = {
      level: 'critical',
      body: {
        trace_chain: [
          { exception: { message: 'inner bork' } },
          { exception: { message: 'outer fuzz' } },
        ],
      },
    };
    var settings = {
      reportLevel: 'debug',
      ignoredMessages: ['stuff', 'fuzz'],
    };
    expect(p.messageIsIgnored(logger)(item, settings)).to.not.be.ok();
  });
});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0EsaUJBQWlCLGFBQWEsd0JBQXdCO0FBQ3RELG1CQUFtQixjQUFjO0FBQ2pDLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsWUFBWTtBQUM3QixtQkFBbUIsY0FBYztBQUNqQyxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGFBQWEseUJBQXlCO0FBQ2xELFlBQVksYUFBYSx5QkFBeUI7QUFDbEQ7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGFBQWEsMEJBQTBCO0FBQ25ELFlBQVksYUFBYSx5QkFBeUI7QUFDbEQ7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGFBQWEseUJBQXlCO0FBQ2xELFlBQVksYUFBYSx5QkFBeUI7QUFDbEQ7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL21lcmdlLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvcHJlZGljYXRlcy5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vdGVzdC9wcmVkaWNhdGVzLnRlc3QuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKHNlbGYsICgpID0+IHtcbnJldHVybiAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxudmFyIGlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iaikge1xuICBpZiAoIW9iaiB8fCB0b1N0ci5jYWxsKG9iaikgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGhhc093bkNvbnN0cnVjdG9yID0gaGFzT3duLmNhbGwob2JqLCAnY29uc3RydWN0b3InKTtcbiAgdmFyIGhhc0lzUHJvdG90eXBlT2YgPVxuICAgIG9iai5jb25zdHJ1Y3RvciAmJlxuICAgIG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgJiZcbiAgICBoYXNPd24uY2FsbChvYmouY29uc3RydWN0b3IucHJvdG90eXBlLCAnaXNQcm90b3R5cGVPZicpO1xuICAvLyBOb3Qgb3duIGNvbnN0cnVjdG9yIHByb3BlcnR5IG11c3QgYmUgT2JqZWN0XG4gIGlmIChvYmouY29uc3RydWN0b3IgJiYgIWhhc093bkNvbnN0cnVjdG9yICYmICFoYXNJc1Byb3RvdHlwZU9mKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gT3duIHByb3BlcnRpZXMgYXJlIGVudW1lcmF0ZWQgZmlyc3RseSwgc28gdG8gc3BlZWQgdXAsXG4gIC8vIGlmIGxhc3Qgb25lIGlzIG93biwgdGhlbiBhbGwgcHJvcGVydGllcyBhcmUgb3duLlxuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAvKiovXG4gIH1cblxuICByZXR1cm4gdHlwZW9mIGtleSA9PT0gJ3VuZGVmaW5lZCcgfHwgaGFzT3duLmNhbGwob2JqLCBrZXkpO1xufTtcblxuZnVuY3Rpb24gbWVyZ2UoKSB7XG4gIHZhciBpLFxuICAgIHNyYyxcbiAgICBjb3B5LFxuICAgIGNsb25lLFxuICAgIG5hbWUsXG4gICAgcmVzdWx0ID0ge30sXG4gICAgY3VycmVudCA9IG51bGwsXG4gICAgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcblxuICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBjdXJyZW50ID0gYXJndW1lbnRzW2ldO1xuICAgIGlmIChjdXJyZW50ID09IG51bGwpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGZvciAobmFtZSBpbiBjdXJyZW50KSB7XG4gICAgICBzcmMgPSByZXN1bHRbbmFtZV07XG4gICAgICBjb3B5ID0gY3VycmVudFtuYW1lXTtcbiAgICAgIGlmIChyZXN1bHQgIT09IGNvcHkpIHtcbiAgICAgICAgaWYgKGNvcHkgJiYgaXNQbGFpbk9iamVjdChjb3B5KSkge1xuICAgICAgICAgIGNsb25lID0gc3JjICYmIGlzUGxhaW5PYmplY3Qoc3JjKSA/IHNyYyA6IHt9O1xuICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IG1lcmdlKGNsb25lLCBjb3B5KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY29weSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZXN1bHRbbmFtZV0gPSBjb3B5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWVyZ2U7XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbGl0eScpO1xuXG5mdW5jdGlvbiBjaGVja0xldmVsKGl0ZW0sIHNldHRpbmdzKSB7XG4gIHZhciBsZXZlbCA9IGl0ZW0ubGV2ZWw7XG4gIHZhciBsZXZlbFZhbCA9IF8uTEVWRUxTW2xldmVsXSB8fCAwO1xuICB2YXIgcmVwb3J0TGV2ZWwgPSBzZXR0aW5ncy5yZXBvcnRMZXZlbDtcbiAgdmFyIHJlcG9ydExldmVsVmFsID0gXy5MRVZFTFNbcmVwb3J0TGV2ZWxdIHx8IDA7XG5cbiAgaWYgKGxldmVsVmFsIDwgcmVwb3J0TGV2ZWxWYWwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHVzZXJDaGVja0lnbm9yZShsb2dnZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpdGVtLCBzZXR0aW5ncykge1xuICAgIHZhciBpc1VuY2F1Z2h0ID0gISFpdGVtLl9pc1VuY2F1Z2h0O1xuICAgIGRlbGV0ZSBpdGVtLl9pc1VuY2F1Z2h0O1xuICAgIHZhciBhcmdzID0gaXRlbS5fb3JpZ2luYWxBcmdzO1xuICAgIGRlbGV0ZSBpdGVtLl9vcmlnaW5hbEFyZ3M7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24oc2V0dGluZ3Mub25TZW5kQ2FsbGJhY2spKSB7XG4gICAgICAgIHNldHRpbmdzLm9uU2VuZENhbGxiYWNrKGlzVW5jYXVnaHQsIGFyZ3MsIGl0ZW0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHNldHRpbmdzLm9uU2VuZENhbGxiYWNrID0gbnVsbDtcbiAgICAgIGxvZ2dlci5lcnJvcignRXJyb3Igd2hpbGUgY2FsbGluZyBvblNlbmRDYWxsYmFjaywgcmVtb3ZpbmcnLCBlKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGlmIChcbiAgICAgICAgXy5pc0Z1bmN0aW9uKHNldHRpbmdzLmNoZWNrSWdub3JlKSAmJlxuICAgICAgICBzZXR0aW5ncy5jaGVja0lnbm9yZShpc1VuY2F1Z2h0LCBhcmdzLCBpdGVtKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBzZXR0aW5ncy5jaGVja0lnbm9yZSA9IG51bGw7XG4gICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIHdoaWxlIGNhbGxpbmcgY3VzdG9tIGNoZWNrSWdub3JlKCksIHJlbW92aW5nJywgZSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xufVxuXG5mdW5jdGlvbiB1cmxJc05vdEJsb2NrTGlzdGVkKGxvZ2dlcikge1xuICByZXR1cm4gZnVuY3Rpb24gKGl0ZW0sIHNldHRpbmdzKSB7XG4gICAgcmV0dXJuICF1cmxJc09uQUxpc3QoaXRlbSwgc2V0dGluZ3MsICdibG9ja2xpc3QnLCBsb2dnZXIpO1xuICB9O1xufVxuXG5mdW5jdGlvbiB1cmxJc1NhZmVMaXN0ZWQobG9nZ2VyKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaXRlbSwgc2V0dGluZ3MpIHtcbiAgICByZXR1cm4gdXJsSXNPbkFMaXN0KGl0ZW0sIHNldHRpbmdzLCAnc2FmZWxpc3QnLCBsb2dnZXIpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBtYXRjaEZyYW1lcyh0cmFjZSwgbGlzdCwgYmxvY2spIHtcbiAgaWYgKCF0cmFjZSkge1xuICAgIHJldHVybiAhYmxvY2s7XG4gIH1cblxuICB2YXIgZnJhbWVzID0gdHJhY2UuZnJhbWVzO1xuXG4gIGlmICghZnJhbWVzIHx8IGZyYW1lcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gIWJsb2NrO1xuICB9XG5cbiAgdmFyIGZyYW1lLCBmaWxlbmFtZSwgdXJsLCB1cmxSZWdleDtcbiAgdmFyIGxpc3RMZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgdmFyIGZyYW1lTGVuZ3RoID0gZnJhbWVzLmxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmcmFtZUxlbmd0aDsgaSsrKSB7XG4gICAgZnJhbWUgPSBmcmFtZXNbaV07XG4gICAgZmlsZW5hbWUgPSBmcmFtZS5maWxlbmFtZTtcblxuICAgIGlmICghXy5pc1R5cGUoZmlsZW5hbWUsICdzdHJpbmcnKSkge1xuICAgICAgcmV0dXJuICFibG9jaztcbiAgICB9XG5cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGxpc3RMZW5ndGg7IGorKykge1xuICAgICAgdXJsID0gbGlzdFtqXTtcbiAgICAgIHVybFJlZ2V4ID0gbmV3IFJlZ0V4cCh1cmwpO1xuXG4gICAgICBpZiAodXJsUmVnZXgudGVzdChmaWxlbmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gdXJsSXNPbkFMaXN0KGl0ZW0sIHNldHRpbmdzLCBzYWZlT3JCbG9jaywgbG9nZ2VyKSB7XG4gIC8vIHNhZmVsaXN0IGlzIHRoZSBkZWZhdWx0XG4gIHZhciBibG9jayA9IGZhbHNlO1xuICBpZiAoc2FmZU9yQmxvY2sgPT09ICdibG9ja2xpc3QnKSB7XG4gICAgYmxvY2sgPSB0cnVlO1xuICB9XG5cbiAgdmFyIGxpc3QsIHRyYWNlcztcbiAgdHJ5IHtcbiAgICBsaXN0ID0gYmxvY2sgPyBzZXR0aW5ncy5ob3N0QmxvY2tMaXN0IDogc2V0dGluZ3MuaG9zdFNhZmVMaXN0O1xuICAgIHRyYWNlcyA9IF8uZ2V0KGl0ZW0sICdib2R5LnRyYWNlX2NoYWluJykgfHwgW18uZ2V0KGl0ZW0sICdib2R5LnRyYWNlJyldO1xuXG4gICAgLy8gVGhlc2UgdHdvIGNoZWNrcyBhcmUgaW1wb3J0YW50IHRvIGNvbWUgZmlyc3QgYXMgdGhleSBhcmUgZGVmYXVsdHNcbiAgICAvLyBpbiBjYXNlIHRoZSBsaXN0IGlzIG1pc3Npbmcgb3IgdGhlIHRyYWNlIGlzIG1pc3Npbmcgb3Igbm90IHdlbGwtZm9ybWVkXG4gICAgaWYgKCFsaXN0IHx8IGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gIWJsb2NrO1xuICAgIH1cbiAgICBpZiAodHJhY2VzLmxlbmd0aCA9PT0gMCB8fCAhdHJhY2VzWzBdKSB7XG4gICAgICByZXR1cm4gIWJsb2NrO1xuICAgIH1cblxuICAgIHZhciB0cmFjZXNMZW5ndGggPSB0cmFjZXMubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHJhY2VzTGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChtYXRjaEZyYW1lcyh0cmFjZXNbaV0sIGxpc3QsIGJsb2NrKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKFxuICAgIGVcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICApIHtcbiAgICBpZiAoYmxvY2spIHtcbiAgICAgIHNldHRpbmdzLmhvc3RCbG9ja0xpc3QgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXR0aW5ncy5ob3N0U2FmZUxpc3QgPSBudWxsO1xuICAgIH1cbiAgICB2YXIgbGlzdE5hbWUgPSBibG9jayA/ICdob3N0QmxvY2tMaXN0JyA6ICdob3N0U2FmZUxpc3QnO1xuICAgIGxvZ2dlci5lcnJvcihcbiAgICAgIFwiRXJyb3Igd2hpbGUgcmVhZGluZyB5b3VyIGNvbmZpZ3VyYXRpb24ncyBcIiArXG4gICAgICAgIGxpc3ROYW1lICtcbiAgICAgICAgJyBvcHRpb24uIFJlbW92aW5nIGN1c3RvbSAnICtcbiAgICAgICAgbGlzdE5hbWUgK1xuICAgICAgICAnLicsXG4gICAgICBlLFxuICAgICk7XG4gICAgcmV0dXJuICFibG9jaztcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIG1lc3NhZ2VJc0lnbm9yZWQobG9nZ2VyKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaXRlbSwgc2V0dGluZ3MpIHtcbiAgICB2YXIgaSwgaiwgaWdub3JlZE1lc3NhZ2VzLCBsZW4sIG1lc3NhZ2VJc0lnbm9yZWQsIHJJZ25vcmVkTWVzc2FnZSwgbWVzc2FnZXM7XG5cbiAgICB0cnkge1xuICAgICAgbWVzc2FnZUlzSWdub3JlZCA9IGZhbHNlO1xuICAgICAgaWdub3JlZE1lc3NhZ2VzID0gc2V0dGluZ3MuaWdub3JlZE1lc3NhZ2VzO1xuXG4gICAgICBpZiAoIWlnbm9yZWRNZXNzYWdlcyB8fCBpZ25vcmVkTWVzc2FnZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBtZXNzYWdlcyA9IG1lc3NhZ2VzRnJvbUl0ZW0oaXRlbSk7XG5cbiAgICAgIGlmIChtZXNzYWdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGxlbiA9IGlnbm9yZWRNZXNzYWdlcy5sZW5ndGg7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgcklnbm9yZWRNZXNzYWdlID0gbmV3IFJlZ0V4cChpZ25vcmVkTWVzc2FnZXNbaV0sICdnaScpO1xuXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBtZXNzYWdlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIG1lc3NhZ2VJc0lnbm9yZWQgPSBySWdub3JlZE1lc3NhZ2UudGVzdChtZXNzYWdlc1tqXSk7XG5cbiAgICAgICAgICBpZiAobWVzc2FnZUlzSWdub3JlZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKFxuICAgICAgZVxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICApIHtcbiAgICAgIHNldHRpbmdzLmlnbm9yZWRNZXNzYWdlcyA9IG51bGw7XG4gICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgIFwiRXJyb3Igd2hpbGUgcmVhZGluZyB5b3VyIGNvbmZpZ3VyYXRpb24ncyBpZ25vcmVkTWVzc2FnZXMgb3B0aW9uLiBSZW1vdmluZyBjdXN0b20gaWdub3JlZE1lc3NhZ2VzLlwiLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gbWVzc2FnZXNGcm9tSXRlbShpdGVtKSB7XG4gIHZhciBib2R5ID0gaXRlbS5ib2R5O1xuICB2YXIgbWVzc2FnZXMgPSBbXTtcblxuICAvLyBUaGUgcGF5bG9hZCBzY2hlbWEgb25seSBhbGxvd3Mgb25lIG9mIHRyYWNlX2NoYWluLCBtZXNzYWdlLCBvciB0cmFjZS5cbiAgLy8gSG93ZXZlciwgZXhpc3RpbmcgdGVzdCBjYXNlcyBhcmUgYmFzZWQgb24gaGF2aW5nIGJvdGggdHJhY2UgYW5kIG1lc3NhZ2UgcHJlc2VudC5cbiAgLy8gU28gaGVyZSB3ZSBwcmVzZXJ2ZSB0aGUgYWJpbGl0eSB0byBjb2xsZWN0IHN0cmluZ3MgZnJvbSBhbnkgY29tYmluYXRpb24gb2YgdGhlc2Uga2V5cy5cbiAgaWYgKGJvZHkudHJhY2VfY2hhaW4pIHtcbiAgICB2YXIgdHJhY2VDaGFpbiA9IGJvZHkudHJhY2VfY2hhaW47XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0cmFjZUNoYWluLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdHJhY2UgPSB0cmFjZUNoYWluW2ldO1xuICAgICAgbWVzc2FnZXMucHVzaChfLmdldCh0cmFjZSwgJ2V4Y2VwdGlvbi5tZXNzYWdlJykpO1xuICAgIH1cbiAgfVxuICBpZiAoYm9keS50cmFjZSkge1xuICAgIG1lc3NhZ2VzLnB1c2goXy5nZXQoYm9keSwgJ3RyYWNlLmV4Y2VwdGlvbi5tZXNzYWdlJykpO1xuICB9XG4gIGlmIChib2R5Lm1lc3NhZ2UpIHtcbiAgICBtZXNzYWdlcy5wdXNoKF8uZ2V0KGJvZHksICdtZXNzYWdlLmJvZHknKSk7XG4gIH1cbiAgcmV0dXJuIG1lc3NhZ2VzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY2hlY2tMZXZlbDogY2hlY2tMZXZlbCxcbiAgdXNlckNoZWNrSWdub3JlOiB1c2VyQ2hlY2tJZ25vcmUsXG4gIHVybElzTm90QmxvY2tMaXN0ZWQ6IHVybElzTm90QmxvY2tMaXN0ZWQsXG4gIHVybElzU2FmZUxpc3RlZDogdXJsSXNTYWZlTGlzdGVkLFxuICBtZXNzYWdlSXNJZ25vcmVkOiBtZXNzYWdlSXNJZ25vcmVkLFxufTtcbiIsInZhciBtZXJnZSA9IHJlcXVpcmUoJy4vbWVyZ2UnKTtcblxudmFyIFJvbGxiYXJKU09OID0ge307XG5mdW5jdGlvbiBzZXR1cEpTT04ocG9seWZpbGxKU09OKSB7XG4gIGlmIChpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnN0cmluZ2lmeSkgJiYgaXNGdW5jdGlvbihSb2xsYmFySlNPTi5wYXJzZSkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoaXNEZWZpbmVkKEpTT04pKSB7XG4gICAgLy8gSWYgcG9seWZpbGwgaXMgcHJvdmlkZWQsIHByZWZlciBpdCBvdmVyIGV4aXN0aW5nIG5vbi1uYXRpdmUgc2hpbXMuXG4gICAgaWYgKHBvbHlmaWxsSlNPTikge1xuICAgICAgaWYgKGlzTmF0aXZlRnVuY3Rpb24oSlNPTi5zdHJpbmdpZnkpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnN0cmluZ2lmeSA9IEpTT04uc3RyaW5naWZ5O1xuICAgICAgfVxuICAgICAgaWYgKGlzTmF0aXZlRnVuY3Rpb24oSlNPTi5wYXJzZSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04ucGFyc2UgPSBKU09OLnBhcnNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBlbHNlIGFjY2VwdCBhbnkgaW50ZXJmYWNlIHRoYXQgaXMgcHJlc2VudC5cbiAgICAgIGlmIChpc0Z1bmN0aW9uKEpTT04uc3RyaW5naWZ5KSkge1xuICAgICAgICBSb2xsYmFySlNPTi5zdHJpbmdpZnkgPSBKU09OLnN0cmluZ2lmeTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0Z1bmN0aW9uKEpTT04ucGFyc2UpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnBhcnNlID0gSlNPTi5wYXJzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKCFpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnN0cmluZ2lmeSkgfHwgIWlzRnVuY3Rpb24oUm9sbGJhckpTT04ucGFyc2UpKSB7XG4gICAgcG9seWZpbGxKU09OICYmIHBvbHlmaWxsSlNPTihSb2xsYmFySlNPTik7XG4gIH1cbn1cblxuLypcbiAqIGlzVHlwZSAtIEdpdmVuIGEgSmF2YXNjcmlwdCB2YWx1ZSBhbmQgYSBzdHJpbmcsIHJldHVybnMgdHJ1ZSBpZiB0aGUgdHlwZSBvZiB0aGUgdmFsdWUgbWF0Y2hlcyB0aGVcbiAqIGdpdmVuIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0geCAtIGFueSB2YWx1ZVxuICogQHBhcmFtIHQgLSBhIGxvd2VyY2FzZSBzdHJpbmcgY29udGFpbmluZyBvbmUgb2YgdGhlIGZvbGxvd2luZyB0eXBlIG5hbWVzOlxuICogICAgLSB1bmRlZmluZWRcbiAqICAgIC0gbnVsbFxuICogICAgLSBlcnJvclxuICogICAgLSBudW1iZXJcbiAqICAgIC0gYm9vbGVhblxuICogICAgLSBzdHJpbmdcbiAqICAgIC0gc3ltYm9sXG4gKiAgICAtIGZ1bmN0aW9uXG4gKiAgICAtIG9iamVjdFxuICogICAgLSBhcnJheVxuICogQHJldHVybnMgdHJ1ZSBpZiB4IGlzIG9mIHR5cGUgdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVHlwZSh4LCB0KSB7XG4gIHJldHVybiB0ID09PSB0eXBlTmFtZSh4KTtcbn1cblxuLypcbiAqIHR5cGVOYW1lIC0gR2l2ZW4gYSBKYXZhc2NyaXB0IHZhbHVlLCByZXR1cm5zIHRoZSB0eXBlIG9mIHRoZSBvYmplY3QgYXMgYSBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gdHlwZU5hbWUoeCkge1xuICB2YXIgbmFtZSA9IHR5cGVvZiB4O1xuICBpZiAobmFtZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbmFtZTtcbiAgfVxuICBpZiAoIXgpIHtcbiAgICByZXR1cm4gJ251bGwnO1xuICB9XG4gIGlmICh4IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICByZXR1cm4gJ2Vycm9yJztcbiAgfVxuICByZXR1cm4ge30udG9TdHJpbmdcbiAgICAuY2FsbCh4KVxuICAgIC5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXVxuICAgIC50b0xvd2VyQ2FzZSgpO1xufVxuXG4vKiBpc0Z1bmN0aW9uIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBhIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIGYgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIGZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbihmKSB7XG4gIHJldHVybiBpc1R5cGUoZiwgJ2Z1bmN0aW9uJyk7XG59XG5cbi8qIGlzTmF0aXZlRnVuY3Rpb24gLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIGEgbmF0aXZlIEpTIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIGYgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIG5hdGl2ZSBKUyBmdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlRnVuY3Rpb24oZikge1xuICB2YXIgcmVSZWdFeHBDaGFyID0gL1tcXFxcXiQuKis/KClbXFxde318XS9nO1xuICB2YXIgZnVuY01hdGNoU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nXG4gICAgLmNhbGwoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSlcbiAgICAucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAgIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKTtcbiAgdmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICsgZnVuY01hdGNoU3RyaW5nICsgJyQnKTtcbiAgcmV0dXJuIGlzT2JqZWN0KGYpICYmIHJlSXNOYXRpdmUudGVzdChmKTtcbn1cblxuLyogaXNPYmplY3QgLSBDaGVja3MgaWYgdGhlIGFyZ3VtZW50IGlzIGFuIG9iamVjdFxuICpcbiAqIEBwYXJhbSB2YWx1ZSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpcyB2YWx1ZSBpcyBhbiBvYmplY3QgZnVuY3Rpb24gaXMgYW4gb2JqZWN0KVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyogaXNTdHJpbmcgLSBDaGVja3MgaWYgdGhlIGFyZ3VtZW50IGlzIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHZhbHVlIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIHZhbHVlIGlzIGEgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nO1xufVxuXG4vKipcbiAqIGlzRmluaXRlTnVtYmVyIC0gZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgYSBmaW5pdGUgbnVtYmVyXG4gKlxuICogQHBhcmFtIHsqfSBuIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIHZhbHVlIGlzIGEgZmluaXRlIG51bWJlclxuICovXG5mdW5jdGlvbiBpc0Zpbml0ZU51bWJlcihuKSB7XG4gIHJldHVybiBOdW1iZXIuaXNGaW5pdGUobik7XG59XG5cbi8qXG4gKiBpc0RlZmluZWQgLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIG5vdCBlcXVhbCB0byB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0gdSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiB1IGlzIGFueXRoaW5nIG90aGVyIHRoYW4gdW5kZWZpbmVkXG4gKi9cbmZ1bmN0aW9uIGlzRGVmaW5lZCh1KSB7XG4gIHJldHVybiAhaXNUeXBlKHUsICd1bmRlZmluZWQnKTtcbn1cblxuLypcbiAqIGlzSXRlcmFibGUgLSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBjYW4gYmUgaXRlcmF0ZWQsIGVzc2VudGlhbGx5XG4gKiB3aGV0aGVyIGl0IGlzIGFuIG9iamVjdCBvciBhbiBhcnJheS5cbiAqXG4gKiBAcGFyYW0gaSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBpIGlzIGFuIG9iamVjdCBvciBhbiBhcnJheSBhcyBkZXRlcm1pbmVkIGJ5IGB0eXBlTmFtZWBcbiAqL1xuZnVuY3Rpb24gaXNJdGVyYWJsZShpKSB7XG4gIHZhciB0eXBlID0gdHlwZU5hbWUoaSk7XG4gIHJldHVybiB0eXBlID09PSAnb2JqZWN0JyB8fCB0eXBlID09PSAnYXJyYXknO1xufVxuXG4vKlxuICogaXNFcnJvciAtIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIG9mIGFuIGVycm9yIHR5cGVcbiAqXG4gKiBAcGFyYW0gZSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBlIGlzIGFuIGVycm9yXG4gKi9cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICAvLyBEZXRlY3QgYm90aCBFcnJvciBhbmQgRmlyZWZveCBFeGNlcHRpb24gdHlwZVxuICByZXR1cm4gaXNUeXBlKGUsICdlcnJvcicpIHx8IGlzVHlwZShlLCAnZXhjZXB0aW9uJyk7XG59XG5cbi8qIGlzUHJvbWlzZSAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgYSBwcm9taXNlXG4gKlxuICogQHBhcmFtIHAgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIGZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNQcm9taXNlKHApIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHApICYmIGlzVHlwZShwLnRoZW4sICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIGlzQnJvd3NlciAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIHRoZSBjb2RlIGlzIHJ1bm5pbmcgaW4gYSBicm93c2VyXG4gKlxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY29kZSBpcyBydW5uaW5nIGluIGEgYnJvd3NlciBlbnZpcm9ubWVudFxuICovXG5mdW5jdGlvbiBpc0Jyb3dzZXIoKSB7XG4gIHJldHVybiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcbn1cblxuZnVuY3Rpb24gcmVkYWN0KCkge1xuICByZXR1cm4gJyoqKioqKioqJztcbn1cblxuLy8gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS84ODA5NDcyLzExMzgxOTFcbmZ1bmN0aW9uIHV1aWQ0KCkge1xuICB2YXIgZCA9IG5vdygpO1xuICB2YXIgdXVpZCA9ICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoXG4gICAgL1t4eV0vZyxcbiAgICBmdW5jdGlvbiAoYykge1xuICAgICAgdmFyIHIgPSAoZCArIE1hdGgucmFuZG9tKCkgKiAxNikgJSAxNiB8IDA7XG4gICAgICBkID0gTWF0aC5mbG9vcihkIC8gMTYpO1xuICAgICAgcmV0dXJuIChjID09PSAneCcgPyByIDogKHIgJiAweDcpIHwgMHg4KS50b1N0cmluZygxNik7XG4gICAgfSxcbiAgKTtcbiAgcmV0dXJuIHV1aWQ7XG59XG5cbnZhciBMRVZFTFMgPSB7XG4gIGRlYnVnOiAwLFxuICBpbmZvOiAxLFxuICB3YXJuaW5nOiAyLFxuICBlcnJvcjogMyxcbiAgY3JpdGljYWw6IDQsXG59O1xuXG5mdW5jdGlvbiBzYW5pdGl6ZVVybCh1cmwpIHtcbiAgdmFyIGJhc2VVcmxQYXJ0cyA9IHBhcnNlVXJpKHVybCk7XG4gIGlmICghYmFzZVVybFBhcnRzKSB7XG4gICAgcmV0dXJuICcodW5rbm93biknO1xuICB9XG5cbiAgLy8gcmVtb3ZlIGEgdHJhaWxpbmcgIyBpZiB0aGVyZSBpcyBubyBhbmNob3JcbiAgaWYgKGJhc2VVcmxQYXJ0cy5hbmNob3IgPT09ICcnKSB7XG4gICAgYmFzZVVybFBhcnRzLnNvdXJjZSA9IGJhc2VVcmxQYXJ0cy5zb3VyY2UucmVwbGFjZSgnIycsICcnKTtcbiAgfVxuXG4gIHVybCA9IGJhc2VVcmxQYXJ0cy5zb3VyY2UucmVwbGFjZSgnPycgKyBiYXNlVXJsUGFydHMucXVlcnksICcnKTtcbiAgcmV0dXJuIHVybDtcbn1cblxudmFyIHBhcnNlVXJpT3B0aW9ucyA9IHtcbiAgc3RyaWN0TW9kZTogZmFsc2UsXG4gIGtleTogW1xuICAgICdzb3VyY2UnLFxuICAgICdwcm90b2NvbCcsXG4gICAgJ2F1dGhvcml0eScsXG4gICAgJ3VzZXJJbmZvJyxcbiAgICAndXNlcicsXG4gICAgJ3Bhc3N3b3JkJyxcbiAgICAnaG9zdCcsXG4gICAgJ3BvcnQnLFxuICAgICdyZWxhdGl2ZScsXG4gICAgJ3BhdGgnLFxuICAgICdkaXJlY3RvcnknLFxuICAgICdmaWxlJyxcbiAgICAncXVlcnknLFxuICAgICdhbmNob3InLFxuICBdLFxuICBxOiB7XG4gICAgbmFtZTogJ3F1ZXJ5S2V5JyxcbiAgICBwYXJzZXI6IC8oPzpefCYpKFteJj1dKik9PyhbXiZdKikvZyxcbiAgfSxcbiAgcGFyc2VyOiB7XG4gICAgc3RyaWN0OlxuICAgICAgL14oPzooW146XFwvPyNdKyk6KT8oPzpcXC9cXC8oKD86KChbXjpAXSopKD86OihbXjpAXSopKT8pP0ApPyhbXjpcXC8/I10qKSg/OjooXFxkKikpPykpPygoKCg/OltePyNcXC9dKlxcLykqKShbXj8jXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pLyxcbiAgICBsb29zZTpcbiAgICAgIC9eKD86KD8hW146QF0rOlteOkBcXC9dKkApKFteOlxcLz8jLl0rKTopPyg/OlxcL1xcLyk/KCg/OigoW146QF0qKSg/OjooW146QF0qKSk/KT9AKT8oW146XFwvPyNdKikoPzo6KFxcZCopKT8pKCgoXFwvKD86W14/I10oPyFbXj8jXFwvXSpcXC5bXj8jXFwvLl0rKD86Wz8jXXwkKSkpKlxcLz8pPyhbXj8jXFwvXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pLyxcbiAgfSxcbn07XG5cbmZ1bmN0aW9uIHBhcnNlVXJpKHN0cikge1xuICBpZiAoIWlzVHlwZShzdHIsICdzdHJpbmcnKSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICB2YXIgbyA9IHBhcnNlVXJpT3B0aW9ucztcbiAgdmFyIG0gPSBvLnBhcnNlcltvLnN0cmljdE1vZGUgPyAnc3RyaWN0JyA6ICdsb29zZSddLmV4ZWMoc3RyKTtcbiAgdmFyIHVyaSA9IHt9O1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gby5rZXkubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgdXJpW28ua2V5W2ldXSA9IG1baV0gfHwgJyc7XG4gIH1cblxuICB1cmlbby5xLm5hbWVdID0ge307XG4gIHVyaVtvLmtleVsxMl1dLnJlcGxhY2Uoby5xLnBhcnNlciwgZnVuY3Rpb24gKCQwLCAkMSwgJDIpIHtcbiAgICBpZiAoJDEpIHtcbiAgICAgIHVyaVtvLnEubmFtZV1bJDFdID0gJDI7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdXJpO1xufVxuXG5mdW5jdGlvbiBhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aChhY2Nlc3NUb2tlbiwgb3B0aW9ucywgcGFyYW1zKSB7XG4gIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgcGFyYW1zLmFjY2Vzc190b2tlbiA9IGFjY2Vzc1Rva2VuO1xuICB2YXIgcGFyYW1zQXJyYXkgPSBbXTtcbiAgdmFyIGs7XG4gIGZvciAoayBpbiBwYXJhbXMpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmFtcywgaykpIHtcbiAgICAgIHBhcmFtc0FycmF5LnB1c2goW2ssIHBhcmFtc1trXV0uam9pbignPScpKTtcbiAgICB9XG4gIH1cbiAgdmFyIHF1ZXJ5ID0gJz8nICsgcGFyYW1zQXJyYXkuc29ydCgpLmpvaW4oJyYnKTtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgb3B0aW9ucy5wYXRoID0gb3B0aW9ucy5wYXRoIHx8ICcnO1xuICB2YXIgcXMgPSBvcHRpb25zLnBhdGguaW5kZXhPZignPycpO1xuICB2YXIgaCA9IG9wdGlvbnMucGF0aC5pbmRleE9mKCcjJyk7XG4gIHZhciBwO1xuICBpZiAocXMgIT09IC0xICYmIChoID09PSAtMSB8fCBoID4gcXMpKSB7XG4gICAgcCA9IG9wdGlvbnMucGF0aDtcbiAgICBvcHRpb25zLnBhdGggPSBwLnN1YnN0cmluZygwLCBxcykgKyBxdWVyeSArICcmJyArIHAuc3Vic3RyaW5nKHFzICsgMSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGggIT09IC0xKSB7XG4gICAgICBwID0gb3B0aW9ucy5wYXRoO1xuICAgICAgb3B0aW9ucy5wYXRoID0gcC5zdWJzdHJpbmcoMCwgaCkgKyBxdWVyeSArIHAuc3Vic3RyaW5nKGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zLnBhdGggPSBvcHRpb25zLnBhdGggKyBxdWVyeTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0VXJsKHUsIHByb3RvY29sKSB7XG4gIHByb3RvY29sID0gcHJvdG9jb2wgfHwgdS5wcm90b2NvbDtcbiAgaWYgKCFwcm90b2NvbCAmJiB1LnBvcnQpIHtcbiAgICBpZiAodS5wb3J0ID09PSA4MCkge1xuICAgICAgcHJvdG9jb2wgPSAnaHR0cDonO1xuICAgIH0gZWxzZSBpZiAodS5wb3J0ID09PSA0NDMpIHtcbiAgICAgIHByb3RvY29sID0gJ2h0dHBzOic7XG4gICAgfVxuICB9XG4gIHByb3RvY29sID0gcHJvdG9jb2wgfHwgJ2h0dHBzOic7XG5cbiAgaWYgKCF1Lmhvc3RuYW1lKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IHByb3RvY29sICsgJy8vJyArIHUuaG9zdG5hbWU7XG4gIGlmICh1LnBvcnQpIHtcbiAgICByZXN1bHQgPSByZXN1bHQgKyAnOicgKyB1LnBvcnQ7XG4gIH1cbiAgaWYgKHUucGF0aCkge1xuICAgIHJlc3VsdCA9IHJlc3VsdCArIHUucGF0aDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnkob2JqLCBiYWNrdXApIHtcbiAgdmFyIHZhbHVlLCBlcnJvcjtcbiAgdHJ5IHtcbiAgICB2YWx1ZSA9IFJvbGxiYXJKU09OLnN0cmluZ2lmeShvYmopO1xuICB9IGNhdGNoIChqc29uRXJyb3IpIHtcbiAgICBpZiAoYmFja3VwICYmIGlzRnVuY3Rpb24oYmFja3VwKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBiYWNrdXAob2JqKTtcbiAgICAgIH0gY2F0Y2ggKGJhY2t1cEVycm9yKSB7XG4gICAgICAgIGVycm9yID0gYmFja3VwRXJyb3I7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVycm9yID0ganNvbkVycm9yO1xuICAgIH1cbiAgfVxuICByZXR1cm4geyBlcnJvcjogZXJyb3IsIHZhbHVlOiB2YWx1ZSB9O1xufVxuXG5mdW5jdGlvbiBtYXhCeXRlU2l6ZShzdHJpbmcpIHtcbiAgLy8gVGhlIHRyYW5zcG9ydCB3aWxsIHVzZSB1dGYtOCwgc28gYXNzdW1lIHV0Zi04IGVuY29kaW5nLlxuICAvL1xuICAvLyBUaGlzIG1pbmltYWwgaW1wbGVtZW50YXRpb24gd2lsbCBhY2N1cmF0ZWx5IGNvdW50IGJ5dGVzIGZvciBhbGwgVUNTLTIgYW5kXG4gIC8vIHNpbmdsZSBjb2RlIHBvaW50IFVURi0xNi4gSWYgcHJlc2VudGVkIHdpdGggbXVsdGkgY29kZSBwb2ludCBVVEYtMTYsXG4gIC8vIHdoaWNoIHNob3VsZCBiZSByYXJlLCBpdCB3aWxsIHNhZmVseSBvdmVyY291bnQsIG5vdCB1bmRlcmNvdW50LlxuICAvL1xuICAvLyBXaGlsZSByb2J1c3QgdXRmLTggZW5jb2RlcnMgZXhpc3QsIHRoaXMgaXMgZmFyIHNtYWxsZXIgYW5kIGZhciBtb3JlIHBlcmZvcm1hbnQuXG4gIC8vIEZvciBxdWlja2x5IGNvdW50aW5nIHBheWxvYWQgc2l6ZSBmb3IgdHJ1bmNhdGlvbiwgc21hbGxlciBpcyBiZXR0ZXIuXG5cbiAgdmFyIGNvdW50ID0gMDtcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBjb2RlID0gc3RyaW5nLmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGNvZGUgPCAxMjgpIHtcbiAgICAgIC8vIHVwIHRvIDcgYml0c1xuICAgICAgY291bnQgPSBjb3VudCArIDE7XG4gICAgfSBlbHNlIGlmIChjb2RlIDwgMjA0OCkge1xuICAgICAgLy8gdXAgdG8gMTEgYml0c1xuICAgICAgY291bnQgPSBjb3VudCArIDI7XG4gICAgfSBlbHNlIGlmIChjb2RlIDwgNjU1MzYpIHtcbiAgICAgIC8vIHVwIHRvIDE2IGJpdHNcbiAgICAgIGNvdW50ID0gY291bnQgKyAzO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb3VudDtcbn1cblxuZnVuY3Rpb24ganNvblBhcnNlKHMpIHtcbiAgdmFyIHZhbHVlLCBlcnJvcjtcbiAgdHJ5IHtcbiAgICB2YWx1ZSA9IFJvbGxiYXJKU09OLnBhcnNlKHMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgZXJyb3IgPSBlO1xuICB9XG4gIHJldHVybiB7IGVycm9yOiBlcnJvciwgdmFsdWU6IHZhbHVlIH07XG59XG5cbmZ1bmN0aW9uIG1ha2VVbmhhbmRsZWRTdGFja0luZm8oXG4gIG1lc3NhZ2UsXG4gIHVybCxcbiAgbGluZW5vLFxuICBjb2xubyxcbiAgZXJyb3IsXG4gIG1vZGUsXG4gIGJhY2t1cE1lc3NhZ2UsXG4gIGVycm9yUGFyc2VyLFxuKSB7XG4gIHZhciBsb2NhdGlvbiA9IHtcbiAgICB1cmw6IHVybCB8fCAnJyxcbiAgICBsaW5lOiBsaW5lbm8sXG4gICAgY29sdW1uOiBjb2xubyxcbiAgfTtcbiAgbG9jYXRpb24uZnVuYyA9IGVycm9yUGFyc2VyLmd1ZXNzRnVuY3Rpb25OYW1lKGxvY2F0aW9uLnVybCwgbG9jYXRpb24ubGluZSk7XG4gIGxvY2F0aW9uLmNvbnRleHQgPSBlcnJvclBhcnNlci5nYXRoZXJDb250ZXh0KGxvY2F0aW9uLnVybCwgbG9jYXRpb24ubGluZSk7XG4gIHZhciBocmVmID1cbiAgICB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmXG4gICAgZG9jdW1lbnQgJiZcbiAgICBkb2N1bWVudC5sb2NhdGlvbiAmJlxuICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWY7XG4gIHZhciB1c2VyYWdlbnQgPVxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgd2luZG93ICYmXG4gICAgd2luZG93Lm5hdmlnYXRvciAmJlxuICAgIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICByZXR1cm4ge1xuICAgIG1vZGU6IG1vZGUsXG4gICAgbWVzc2FnZTogZXJyb3IgPyBTdHJpbmcoZXJyb3IpIDogbWVzc2FnZSB8fCBiYWNrdXBNZXNzYWdlLFxuICAgIHVybDogaHJlZixcbiAgICBzdGFjazogW2xvY2F0aW9uXSxcbiAgICB1c2VyYWdlbnQ6IHVzZXJhZ2VudCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gd3JhcENhbGxiYWNrKGxvZ2dlciwgZikge1xuICByZXR1cm4gZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgIHRyeSB7XG4gICAgICBmKGVyciwgcmVzcCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbG9nZ2VyLmVycm9yKGUpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gbm9uQ2lyY3VsYXJDbG9uZShvYmopIHtcbiAgdmFyIHNlZW4gPSBbb2JqXTtcblxuICBmdW5jdGlvbiBjbG9uZShvYmosIHNlZW4pIHtcbiAgICB2YXIgdmFsdWUsXG4gICAgICBuYW1lLFxuICAgICAgbmV3U2VlbixcbiAgICAgIHJlc3VsdCA9IHt9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAobmFtZSBpbiBvYmopIHtcbiAgICAgICAgdmFsdWUgPSBvYmpbbmFtZV07XG5cbiAgICAgICAgaWYgKHZhbHVlICYmIChpc1R5cGUodmFsdWUsICdvYmplY3QnKSB8fCBpc1R5cGUodmFsdWUsICdhcnJheScpKSkge1xuICAgICAgICAgIGlmIChzZWVuLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgICAgICAgcmVzdWx0W25hbWVdID0gJ1JlbW92ZWQgY2lyY3VsYXIgcmVmZXJlbmNlOiAnICsgdHlwZU5hbWUodmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdTZWVuID0gc2Vlbi5zbGljZSgpO1xuICAgICAgICAgICAgbmV3U2Vlbi5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IGNsb25lKHZhbHVlLCBuZXdTZWVuKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHRbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXN1bHQgPSAnRmFpbGVkIGNsb25pbmcgY3VzdG9tIGRhdGE6ICcgKyBlLm1lc3NhZ2U7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGNsb25lKG9iaiwgc2Vlbik7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUl0ZW0oYXJncywgbG9nZ2VyLCBub3RpZmllciwgcmVxdWVzdEtleXMsIGxhbWJkYUNvbnRleHQpIHtcbiAgdmFyIG1lc3NhZ2UsIGVyciwgY3VzdG9tLCBjYWxsYmFjaywgcmVxdWVzdDtcbiAgdmFyIGFyZztcbiAgdmFyIGV4dHJhQXJncyA9IFtdO1xuICB2YXIgZGlhZ25vc3RpYyA9IHt9O1xuICB2YXIgYXJnVHlwZXMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3MubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcblxuICAgIHZhciB0eXAgPSB0eXBlTmFtZShhcmcpO1xuICAgIGFyZ1R5cGVzLnB1c2godHlwKTtcbiAgICBzd2l0Y2ggKHR5cCkge1xuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBtZXNzYWdlID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChtZXNzYWdlID0gYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgIGNhbGxiYWNrID0gd3JhcENhbGxiYWNrKGxvZ2dlciwgYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgZXh0cmFBcmdzLnB1c2goYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdlcnJvcic6XG4gICAgICBjYXNlICdkb21leGNlcHRpb24nOlxuICAgICAgY2FzZSAnZXhjZXB0aW9uJzogLy8gRmlyZWZveCBFeGNlcHRpb24gdHlwZVxuICAgICAgICBlcnIgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGVyciA9IGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGFyZyBpbnN0YW5jZW9mIEVycm9yIHx8XG4gICAgICAgICAgKHR5cGVvZiBET01FeGNlcHRpb24gIT09ICd1bmRlZmluZWQnICYmIGFyZyBpbnN0YW5jZW9mIERPTUV4Y2VwdGlvbilcbiAgICAgICAgKSB7XG4gICAgICAgICAgZXJyID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChlcnIgPSBhcmcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXF1ZXN0S2V5cyAmJiB0eXAgPT09ICdvYmplY3QnICYmICFyZXF1ZXN0KSB7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbiA9IHJlcXVlc3RLZXlzLmxlbmd0aDsgaiA8IGxlbjsgKytqKSB7XG4gICAgICAgICAgICBpZiAoYXJnW3JlcXVlc3RLZXlzW2pdXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHJlcXVlc3QgPSBhcmc7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVxdWVzdCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGN1c3RvbSA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoY3VzdG9tID0gYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoXG4gICAgICAgICAgYXJnIGluc3RhbmNlb2YgRXJyb3IgfHxcbiAgICAgICAgICAodHlwZW9mIERPTUV4Y2VwdGlvbiAhPT0gJ3VuZGVmaW5lZCcgJiYgYXJnIGluc3RhbmNlb2YgRE9NRXhjZXB0aW9uKVxuICAgICAgICApIHtcbiAgICAgICAgICBlcnIgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGVyciA9IGFyZyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZXh0cmFBcmdzLnB1c2goYXJnKTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiBjdXN0b20gaXMgYW4gYXJyYXkgdGhpcyB0dXJucyBpdCBpbnRvIGFuIG9iamVjdCB3aXRoIGludGVnZXIga2V5c1xuICBpZiAoY3VzdG9tKSBjdXN0b20gPSBub25DaXJjdWxhckNsb25lKGN1c3RvbSk7XG5cbiAgaWYgKGV4dHJhQXJncy5sZW5ndGggPiAwKSB7XG4gICAgaWYgKCFjdXN0b20pIGN1c3RvbSA9IG5vbkNpcmN1bGFyQ2xvbmUoe30pO1xuICAgIGN1c3RvbS5leHRyYUFyZ3MgPSBub25DaXJjdWxhckNsb25lKGV4dHJhQXJncyk7XG4gIH1cblxuICB2YXIgaXRlbSA9IHtcbiAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgIGVycjogZXJyLFxuICAgIGN1c3RvbTogY3VzdG9tLFxuICAgIHRpbWVzdGFtcDogbm93KCksXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgIG5vdGlmaWVyOiBub3RpZmllcixcbiAgICBkaWFnbm9zdGljOiBkaWFnbm9zdGljLFxuICAgIHV1aWQ6IHV1aWQ0KCksXG4gIH07XG5cbiAgaXRlbS5kYXRhID0gaXRlbS5kYXRhIHx8IHt9O1xuXG4gIHNldEN1c3RvbUl0ZW1LZXlzKGl0ZW0sIGN1c3RvbSk7XG5cbiAgaWYgKHJlcXVlc3RLZXlzICYmIHJlcXVlc3QpIHtcbiAgICBpdGVtLnJlcXVlc3QgPSByZXF1ZXN0O1xuICB9XG4gIGlmIChsYW1iZGFDb250ZXh0KSB7XG4gICAgaXRlbS5sYW1iZGFDb250ZXh0ID0gbGFtYmRhQ29udGV4dDtcbiAgfVxuICBpdGVtLl9vcmlnaW5hbEFyZ3MgPSBhcmdzO1xuICBpdGVtLmRpYWdub3N0aWMub3JpZ2luYWxfYXJnX3R5cGVzID0gYXJnVHlwZXM7XG4gIHJldHVybiBpdGVtO1xufVxuXG5mdW5jdGlvbiBzZXRDdXN0b21JdGVtS2V5cyhpdGVtLCBjdXN0b20pIHtcbiAgaWYgKGN1c3RvbSAmJiBjdXN0b20ubGV2ZWwgIT09IHVuZGVmaW5lZCkge1xuICAgIGl0ZW0ubGV2ZWwgPSBjdXN0b20ubGV2ZWw7XG4gICAgZGVsZXRlIGN1c3RvbS5sZXZlbDtcbiAgfVxuICBpZiAoY3VzdG9tICYmIGN1c3RvbS5za2lwRnJhbWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICBpdGVtLnNraXBGcmFtZXMgPSBjdXN0b20uc2tpcEZyYW1lcztcbiAgICBkZWxldGUgY3VzdG9tLnNraXBGcmFtZXM7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkRXJyb3JDb250ZXh0KGl0ZW0sIGVycm9ycykge1xuICB2YXIgY3VzdG9tID0gaXRlbS5kYXRhLmN1c3RvbSB8fCB7fTtcbiAgdmFyIGNvbnRleHRBZGRlZCA9IGZhbHNlO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlcnJvcnMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChlcnJvcnNbaV0uaGFzT3duUHJvcGVydHkoJ3JvbGxiYXJDb250ZXh0JykpIHtcbiAgICAgICAgY3VzdG9tID0gbWVyZ2UoY3VzdG9tLCBub25DaXJjdWxhckNsb25lKGVycm9yc1tpXS5yb2xsYmFyQ29udGV4dCkpO1xuICAgICAgICBjb250ZXh0QWRkZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEF2b2lkIGFkZGluZyBhbiBlbXB0eSBvYmplY3QgdG8gdGhlIGRhdGEuXG4gICAgaWYgKGNvbnRleHRBZGRlZCkge1xuICAgICAgaXRlbS5kYXRhLmN1c3RvbSA9IGN1c3RvbTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpdGVtLmRpYWdub3N0aWMuZXJyb3JfY29udGV4dCA9ICdGYWlsZWQ6ICcgKyBlLm1lc3NhZ2U7XG4gIH1cbn1cblxudmFyIFRFTEVNRVRSWV9UWVBFUyA9IFtcbiAgJ2xvZycsXG4gICduZXR3b3JrJyxcbiAgJ2RvbScsXG4gICduYXZpZ2F0aW9uJyxcbiAgJ2Vycm9yJyxcbiAgJ21hbnVhbCcsXG5dO1xudmFyIFRFTEVNRVRSWV9MRVZFTFMgPSBbJ2NyaXRpY2FsJywgJ2Vycm9yJywgJ3dhcm5pbmcnLCAnaW5mbycsICdkZWJ1ZyddO1xuXG5mdW5jdGlvbiBhcnJheUluY2x1ZGVzKGFyciwgdmFsKSB7XG4gIGZvciAodmFyIGsgPSAwOyBrIDwgYXJyLmxlbmd0aDsgKytrKSB7XG4gICAgaWYgKGFycltrXSA9PT0gdmFsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRlbGVtZXRyeUV2ZW50KGFyZ3MpIHtcbiAgdmFyIHR5cGUsIG1ldGFkYXRhLCBsZXZlbDtcbiAgdmFyIGFyZztcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3MubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcblxuICAgIHZhciB0eXAgPSB0eXBlTmFtZShhcmcpO1xuICAgIHN3aXRjaCAodHlwKSB7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBpZiAoIXR5cGUgJiYgYXJyYXlJbmNsdWRlcyhURUxFTUVUUllfVFlQRVMsIGFyZykpIHtcbiAgICAgICAgICB0eXBlID0gYXJnO1xuICAgICAgICB9IGVsc2UgaWYgKCFsZXZlbCAmJiBhcnJheUluY2x1ZGVzKFRFTEVNRVRSWV9MRVZFTFMsIGFyZykpIHtcbiAgICAgICAgICBsZXZlbCA9IGFyZztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIG1ldGFkYXRhID0gYXJnO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICB2YXIgZXZlbnQgPSB7XG4gICAgdHlwZTogdHlwZSB8fCAnbWFudWFsJyxcbiAgICBtZXRhZGF0YTogbWV0YWRhdGEgfHwge30sXG4gICAgbGV2ZWw6IGxldmVsLFxuICB9O1xuXG4gIHJldHVybiBldmVudDtcbn1cblxuZnVuY3Rpb24gYWRkSXRlbUF0dHJpYnV0ZXMoaXRlbSwgYXR0cmlidXRlcykge1xuICBpdGVtLmRhdGEuYXR0cmlidXRlcyA9IGl0ZW0uZGF0YS5hdHRyaWJ1dGVzIHx8IFtdO1xuICBpZiAoYXR0cmlidXRlcykge1xuICAgIGl0ZW0uZGF0YS5hdHRyaWJ1dGVzLnB1c2goLi4uYXR0cmlidXRlcyk7XG4gIH1cbn1cblxuLypcbiAqIGdldCAtIGdpdmVuIGFuIG9iai9hcnJheSBhbmQgYSBrZXlwYXRoLCByZXR1cm4gdGhlIHZhbHVlIGF0IHRoYXQga2V5cGF0aCBvclxuICogICAgICAgdW5kZWZpbmVkIGlmIG5vdCBwb3NzaWJsZS5cbiAqXG4gKiBAcGFyYW0gb2JqIC0gYW4gb2JqZWN0IG9yIGFycmF5XG4gKiBAcGFyYW0gcGF0aCAtIGEgc3RyaW5nIG9mIGtleXMgc2VwYXJhdGVkIGJ5ICcuJyBzdWNoIGFzICdwbHVnaW4uanF1ZXJ5LjAubWVzc2FnZSdcbiAqICAgIHdoaWNoIHdvdWxkIGNvcnJlc3BvbmQgdG8gNDIgaW4gYHtwbHVnaW46IHtqcXVlcnk6IFt7bWVzc2FnZTogNDJ9XX19YFxuICovXG5mdW5jdGlvbiBnZXQob2JqLCBwYXRoKSB7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICB2YXIga2V5cyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgdmFyIHJlc3VsdCA9IG9iajtcbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0ga2V5cy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0W2tleXNbaV1dO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzZXQob2JqLCBwYXRoLCB2YWx1ZSkge1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIga2V5cyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgdmFyIGxlbiA9IGtleXMubGVuZ3RoO1xuICBpZiAobGVuIDwgMSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAobGVuID09PSAxKSB7XG4gICAgb2JqW2tleXNbMF1dID0gdmFsdWU7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRyeSB7XG4gICAgdmFyIHRlbXAgPSBvYmpba2V5c1swXV0gfHwge307XG4gICAgdmFyIHJlcGxhY2VtZW50ID0gdGVtcDtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxlbiAtIDE7ICsraSkge1xuICAgICAgdGVtcFtrZXlzW2ldXSA9IHRlbXBba2V5c1tpXV0gfHwge307XG4gICAgICB0ZW1wID0gdGVtcFtrZXlzW2ldXTtcbiAgICB9XG4gICAgdGVtcFtrZXlzW2xlbiAtIDFdXSA9IHZhbHVlO1xuICAgIG9ialtrZXlzWzBdXSA9IHJlcGxhY2VtZW50O1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3NBc1N0cmluZyhhcmdzKSB7XG4gIHZhciBpLCBsZW4sIGFyZztcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKGkgPSAwLCBsZW4gPSBhcmdzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcbiAgICBzd2l0Y2ggKHR5cGVOYW1lKGFyZykpIHtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGFyZyA9IHN0cmluZ2lmeShhcmcpO1xuICAgICAgICBhcmcgPSBhcmcuZXJyb3IgfHwgYXJnLnZhbHVlO1xuICAgICAgICBpZiAoYXJnLmxlbmd0aCA+IDUwMCkge1xuICAgICAgICAgIGFyZyA9IGFyZy5zdWJzdHIoMCwgNDk3KSArICcuLi4nO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbnVsbCc6XG4gICAgICAgIGFyZyA9ICdudWxsJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICBhcmcgPSAndW5kZWZpbmVkJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzeW1ib2wnOlxuICAgICAgICBhcmcgPSBhcmcudG9TdHJpbmcoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKGFyZyk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdC5qb2luKCcgJyk7XG59XG5cbmZ1bmN0aW9uIG5vdygpIHtcbiAgaWYgKERhdGUubm93KSB7XG4gICAgcmV0dXJuICtEYXRlLm5vdygpO1xuICB9XG4gIHJldHVybiArbmV3IERhdGUoKTtcbn1cblxuZnVuY3Rpb24gZmlsdGVySXAocmVxdWVzdERhdGEsIGNhcHR1cmVJcCkge1xuICBpZiAoIXJlcXVlc3REYXRhIHx8ICFyZXF1ZXN0RGF0YVsndXNlcl9pcCddIHx8IGNhcHR1cmVJcCA9PT0gdHJ1ZSkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbmV3SXAgPSByZXF1ZXN0RGF0YVsndXNlcl9pcCddO1xuICBpZiAoIWNhcHR1cmVJcCkge1xuICAgIG5ld0lwID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICB0cnkge1xuICAgICAgdmFyIHBhcnRzO1xuICAgICAgaWYgKG5ld0lwLmluZGV4T2YoJy4nKSAhPT0gLTEpIHtcbiAgICAgICAgcGFydHMgPSBuZXdJcC5zcGxpdCgnLicpO1xuICAgICAgICBwYXJ0cy5wb3AoKTtcbiAgICAgICAgcGFydHMucHVzaCgnMCcpO1xuICAgICAgICBuZXdJcCA9IHBhcnRzLmpvaW4oJy4nKTtcbiAgICAgIH0gZWxzZSBpZiAobmV3SXAuaW5kZXhPZignOicpICE9PSAtMSkge1xuICAgICAgICBwYXJ0cyA9IG5ld0lwLnNwbGl0KCc6Jyk7XG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgdmFyIGJlZ2lubmluZyA9IHBhcnRzLnNsaWNlKDAsIDMpO1xuICAgICAgICAgIHZhciBzbGFzaElkeCA9IGJlZ2lubmluZ1syXS5pbmRleE9mKCcvJyk7XG4gICAgICAgICAgaWYgKHNsYXNoSWR4ICE9PSAtMSkge1xuICAgICAgICAgICAgYmVnaW5uaW5nWzJdID0gYmVnaW5uaW5nWzJdLnN1YnN0cmluZygwLCBzbGFzaElkeCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB0ZXJtaW5hbCA9ICcwMDAwOjAwMDA6MDAwMDowMDAwOjAwMDAnO1xuICAgICAgICAgIG5ld0lwID0gYmVnaW5uaW5nLmNvbmNhdCh0ZXJtaW5hbCkuam9pbignOicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdJcCA9IG51bGw7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbmV3SXAgPSBudWxsO1xuICAgIH1cbiAgfVxuICByZXF1ZXN0RGF0YVsndXNlcl9pcCddID0gbmV3SXA7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU9wdGlvbnMoY3VycmVudCwgaW5wdXQsIHBheWxvYWQsIGxvZ2dlcikge1xuICB2YXIgcmVzdWx0ID0gbWVyZ2UoY3VycmVudCwgaW5wdXQsIHBheWxvYWQpO1xuICByZXN1bHQgPSB1cGRhdGVEZXByZWNhdGVkT3B0aW9ucyhyZXN1bHQsIGxvZ2dlcik7XG4gIGlmICghaW5wdXQgfHwgaW5wdXQub3ZlcndyaXRlU2NydWJGaWVsZHMpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGlmIChpbnB1dC5zY3J1YkZpZWxkcykge1xuICAgIHJlc3VsdC5zY3J1YkZpZWxkcyA9IChjdXJyZW50LnNjcnViRmllbGRzIHx8IFtdKS5jb25jYXQoaW5wdXQuc2NydWJGaWVsZHMpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZURlcHJlY2F0ZWRPcHRpb25zKG9wdGlvbnMsIGxvZ2dlcikge1xuICBpZiAob3B0aW9ucy5ob3N0V2hpdGVMaXN0ICYmICFvcHRpb25zLmhvc3RTYWZlTGlzdCkge1xuICAgIG9wdGlvbnMuaG9zdFNhZmVMaXN0ID0gb3B0aW9ucy5ob3N0V2hpdGVMaXN0O1xuICAgIG9wdGlvbnMuaG9zdFdoaXRlTGlzdCA9IHVuZGVmaW5lZDtcbiAgICBsb2dnZXIgJiYgbG9nZ2VyLmxvZygnaG9zdFdoaXRlTGlzdCBpcyBkZXByZWNhdGVkLiBVc2UgaG9zdFNhZmVMaXN0LicpO1xuICB9XG4gIGlmIChvcHRpb25zLmhvc3RCbGFja0xpc3QgJiYgIW9wdGlvbnMuaG9zdEJsb2NrTGlzdCkge1xuICAgIG9wdGlvbnMuaG9zdEJsb2NrTGlzdCA9IG9wdGlvbnMuaG9zdEJsYWNrTGlzdDtcbiAgICBvcHRpb25zLmhvc3RCbGFja0xpc3QgPSB1bmRlZmluZWQ7XG4gICAgbG9nZ2VyICYmIGxvZ2dlci5sb2coJ2hvc3RCbGFja0xpc3QgaXMgZGVwcmVjYXRlZC4gVXNlIGhvc3RCbG9ja0xpc3QuJyk7XG4gIH1cbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aDogYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGgsXG4gIGNyZWF0ZUl0ZW06IGNyZWF0ZUl0ZW0sXG4gIGFkZEVycm9yQ29udGV4dDogYWRkRXJyb3JDb250ZXh0LFxuICBjcmVhdGVUZWxlbWV0cnlFdmVudDogY3JlYXRlVGVsZW1ldHJ5RXZlbnQsXG4gIGFkZEl0ZW1BdHRyaWJ1dGVzOiBhZGRJdGVtQXR0cmlidXRlcyxcbiAgZmlsdGVySXA6IGZpbHRlcklwLFxuICBmb3JtYXRBcmdzQXNTdHJpbmc6IGZvcm1hdEFyZ3NBc1N0cmluZyxcbiAgZm9ybWF0VXJsOiBmb3JtYXRVcmwsXG4gIGdldDogZ2V0LFxuICBoYW5kbGVPcHRpb25zOiBoYW5kbGVPcHRpb25zLFxuICBpc0Vycm9yOiBpc0Vycm9yLFxuICBpc0Zpbml0ZU51bWJlcjogaXNGaW5pdGVOdW1iZXIsXG4gIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gIGlzSXRlcmFibGU6IGlzSXRlcmFibGUsXG4gIGlzTmF0aXZlRnVuY3Rpb246IGlzTmF0aXZlRnVuY3Rpb24sXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc1R5cGU6IGlzVHlwZSxcbiAgaXNQcm9taXNlOiBpc1Byb21pc2UsXG4gIGlzQnJvd3NlcjogaXNCcm93c2VyLFxuICBqc29uUGFyc2U6IGpzb25QYXJzZSxcbiAgTEVWRUxTOiBMRVZFTFMsXG4gIG1ha2VVbmhhbmRsZWRTdGFja0luZm86IG1ha2VVbmhhbmRsZWRTdGFja0luZm8sXG4gIG1lcmdlOiBtZXJnZSxcbiAgbm93OiBub3csXG4gIHJlZGFjdDogcmVkYWN0LFxuICBSb2xsYmFySlNPTjogUm9sbGJhckpTT04sXG4gIHNhbml0aXplVXJsOiBzYW5pdGl6ZVVybCxcbiAgc2V0OiBzZXQsXG4gIHNldHVwSlNPTjogc2V0dXBKU09OLFxuICBzdHJpbmdpZnk6IHN0cmluZ2lmeSxcbiAgbWF4Qnl0ZVNpemU6IG1heEJ5dGVTaXplLFxuICB0eXBlTmFtZTogdHlwZU5hbWUsXG4gIHV1aWQ0OiB1dWlkNCxcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLyogZ2xvYmFscyBleHBlY3QgKi9cbi8qIGdsb2JhbHMgZGVzY3JpYmUgKi9cbi8qIGdsb2JhbHMgaXQgKi9cbi8qIGdsb2JhbHMgc2lub24gKi9cblxudmFyIHAgPSByZXF1aXJlKCcuLi9zcmMvcHJlZGljYXRlcycpO1xudmFyIGxvZ2dlciA9IHtcbiAgbG9nOiBmdW5jdGlvbiAoKSB7fSxcbiAgZXJyb3I6IGZ1bmN0aW9uICgpIHt9LFxufTtcblxuZGVzY3JpYmUoJ3VzZXJDaGVja0lnbm9yZScsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBpZiBubyB1c2VyIGZ1bmN0aW9uJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBpdGVtID0geyBsZXZlbDogJ2RlYnVnJywgYm9keTogJ3N0dWZmJywgX29yaWdpbmFsQXJnczogWzEsIDIsIDNdIH07XG4gICAgdmFyIHNldHRpbmdzID0geyByZXBvcnRMZXZlbDogJ2RlYnVnJyB9O1xuICAgIGV4cGVjdChwLnVzZXJDaGVja0lnbm9yZShsb2dnZXIpKGl0ZW0sIHNldHRpbmdzKSkudG8uYmUub2soKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgaWYgY2hlY2tJZ25vcmUgaXMgbm90IGEgZnVuY3Rpb24nLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGl0ZW0gPSB7IGxldmVsOiAnZGVidWcnLCBib2R5OiAnc3R1ZmYnLCBfb3JpZ2luYWxBcmdzOiBbMSwgMiwgM10gfTtcbiAgICB2YXIgc2V0dGluZ3MgPSB7IHJlcG9ydExldmVsOiAnZGVidWcnLCBjaGVja0lnbm9yZTogdHJ1ZSB9O1xuICAgIGV4cGVjdChwLnVzZXJDaGVja0lnbm9yZShsb2dnZXIpKGl0ZW0sIHNldHRpbmdzKSkudG8uYmUub2soKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgaWYgY2hlY2tJZ25vcmUgcmV0dXJucyBmYWxzZScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXRlbSA9IHsgbGV2ZWw6ICdkZWJ1ZycsIGJvZHk6ICdzdHVmZicsIF9vcmlnaW5hbEFyZ3M6IFsxLCAyLCAzXSB9O1xuICAgIHZhciBzZXR0aW5ncyA9IHtcbiAgICAgIHJlcG9ydExldmVsOiAnZGVidWcnLFxuICAgICAgY2hlY2tJZ25vcmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICB9O1xuICAgIGV4cGVjdChwLnVzZXJDaGVja0lnbm9yZShsb2dnZXIpKGl0ZW0sIHNldHRpbmdzKSkudG8uYmUub2soKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIGlmIGNoZWNrSWdub3JlIHJldHVybnMgdHJ1ZScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXRlbSA9IHsgbGV2ZWw6ICdkZWJ1ZycsIGJvZHk6ICdzdHVmZicsIF9vcmlnaW5hbEFyZ3M6IFsxLCAyLCAzXSB9O1xuICAgIHZhciBzZXR0aW5ncyA9IHtcbiAgICAgIHJlcG9ydExldmVsOiAnZGVidWcnLFxuICAgICAgY2hlY2tJZ25vcmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgIH07XG4gICAgZXhwZWN0KHAudXNlckNoZWNrSWdub3JlKGxvZ2dlcikoaXRlbSwgc2V0dGluZ3MpKS50by5ub3QuYmUub2soKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgaWYgY2hlY2tJZ25vcmUgdGhyb3dzJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBpdGVtID0geyBsZXZlbDogJ2RlYnVnJywgYm9keTogJ3N0dWZmJywgX29yaWdpbmFsQXJnczogWzEsIDIsIDNdIH07XG4gICAgdmFyIHNldHRpbmdzID0ge1xuICAgICAgcmVwb3J0TGV2ZWw6ICdkZWJ1ZycsXG4gICAgICBjaGVja0lnbm9yZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2JvcmsgYm9yaycpO1xuICAgICAgfSxcbiAgICB9O1xuICAgIGV4cGVjdChwLnVzZXJDaGVja0lnbm9yZShsb2dnZXIpKGl0ZW0sIHNldHRpbmdzKSkudG8uYmUub2soKTtcbiAgICBleHBlY3Qoc2V0dGluZ3MuY2hlY2tJZ25vcmUpLnRvLm5vdC5iZS5vaygpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBnZXQgdGhlIHJpZ2h0IGFyZ3VtZW50cycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXRlbSA9IHsgbGV2ZWw6ICdkZWJ1ZycsIGJvZHk6ICdzdHVmZicsIF9vcmlnaW5hbEFyZ3M6IFsxLCAyLCAzXSB9O1xuICAgIHZhciBzZXR0aW5ncyA9IHtcbiAgICAgIHJlcG9ydExldmVsOiAnZGVidWcnLFxuICAgICAgY2hlY2tJZ25vcmU6IGZ1bmN0aW9uIChpc1VuY2F1Z2h0LCBhcmdzLCBwYXlsb2FkKSB7XG4gICAgICAgIGV4cGVjdChpc1VuY2F1Z2h0KS50by5ub3QuYmUub2soKTtcbiAgICAgICAgZXhwZWN0KGFyZ3MpLnRvLmVxbChbMSwgMiwgM10pO1xuICAgICAgICBleHBlY3QocGF5bG9hZCkudG8uZXFsKGl0ZW0pO1xuICAgICAgfSxcbiAgICB9O1xuICAgIGV4cGVjdChwLnVzZXJDaGVja0lnbm9yZShsb2dnZXIpKGl0ZW0sIHNldHRpbmdzKSkudG8uYmUub2soKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ3VybElzU2FmZUxpc3RlZCcsIGZ1bmN0aW9uICgpIHtcbiAgdmFyIGl0ZW0gPSB7XG4gICAgbGV2ZWw6ICdjcml0aWNhbCcsXG4gICAgYm9keToge1xuICAgICAgdHJhY2U6IHtcbiAgICAgICAgZnJhbWVzOiBbXG4gICAgICAgICAgeyBmaWxlbmFtZTogJ2h0dHA6Ly9hcGkuZmFrZS5jb20vdjEvc29tZXRoaW5nJyB9LFxuICAgICAgICAgIHsgZmlsZW5hbWU6ICdodHRwOi8vYXBpLmV4YW1wbGUuY29tL3YxL3NvbWV0aGluZycgfSxcbiAgICAgICAgICB7IGZpbGVuYW1lOiAnaHR0cDovL2FwaS5mYWtlLmNvbS92Mi9zb21ldGhpbmcnIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0sXG4gIH07XG4gIHZhciB0cmFjZUNoYWluSXRlbSA9IHtcbiAgICBsZXZlbDogJ2NyaXRpY2FsJyxcbiAgICBib2R5OiB7XG4gICAgICB0cmFjZV9jaGFpbjogW1xuICAgICAgICB7XG4gICAgICAgICAgZnJhbWVzOiBbXG4gICAgICAgICAgICB7IGZpbGVuYW1lOiAnaHR0cDovL2FwaS5mYWtlLmNvbS92MS9zb21ldGhpbmcnIH0sXG4gICAgICAgICAgICB7IGZpbGVuYW1lOiAnaHR0cDovL2FwaS5leGFtcGxlLmNvbS92MS9zb21ldGhpbmcnIH0sXG4gICAgICAgICAgICB7IGZpbGVuYW1lOiAnaHR0cDovL2FwaS5mYWtlLmNvbS92Mi9zb21ldGhpbmcnIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZyYW1lczogW1xuICAgICAgICAgICAgeyBmaWxlbmFtZTogJ2h0dHA6Ly9hcGkuZmFrZTEuY29tL3YyL3NvbWV0aGluZycgfSxcbiAgICAgICAgICAgIHsgZmlsZW5hbWU6ICdodHRwOi8vYXBpLmV4YW1wbGUxLmNvbS92Mi9zb21ldGhpbmcnIH0sXG4gICAgICAgICAgICB7IGZpbGVuYW1lOiAnaHR0cDovL2FwaS5mYWtlMS5jb20vdjMvc29tZXRoaW5nJyB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH07XG4gIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgd2l0aCBubyBzYWZlbGlzdCcsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2V0dGluZ3MgPSB7XG4gICAgICByZXBvcnRMZXZlbDogJ2RlYnVnJyxcbiAgICB9O1xuICAgIGV4cGVjdChwLnVybElzU2FmZUxpc3RlZChsb2dnZXIpKGl0ZW0sIHNldHRpbmdzKSkudG8uYmUub2soKTtcbiAgICBleHBlY3QocC51cmxJc1NhZmVMaXN0ZWQobG9nZ2VyKSh0cmFjZUNoYWluSXRlbSwgc2V0dGluZ3MpKS50by5iZS5vaygpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSB3aXRoIG5vIHRyYWNlJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBpdGVtID0ge1xuICAgICAgbGV2ZWw6ICdjcml0aWNhbCcsXG4gICAgICBib2R5OiB7IG1lc3NhZ2U6ICdoZXknIH0sXG4gICAgfTtcbiAgICB2YXIgc2V0dGluZ3MgPSB7XG4gICAgICByZXBvcnRMZXZlbDogJ2RlYnVnJyxcbiAgICAgIGhvc3RTYWZlTGlzdDogWydmYWtlLmNvbScsICdleGFtcGxlLmNvbSddLFxuICAgIH07XG4gICAgZXhwZWN0KHAudXJsSXNTYWZlTGlzdGVkKGxvZ2dlcikoaXRlbSwgc2V0dGluZ3MpKS50by5iZS5vaygpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBpZiBhdCBsZWFzdCBvbmUgcmVnZXggbWF0Y2hlcyBhdCBsZWFzdCBvbmUgZmlsZW5hbWUgaW4gdGhlIHRyYWNlJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZXR0aW5ncyA9IHtcbiAgICAgIHJlcG9ydExldmVsOiAnZGVidWcnLFxuICAgICAgaG9zdFNhZmVMaXN0OiBbJ2V4YW1wbGUuY29tJ10sXG4gICAgfTtcbiAgICBleHBlY3QocC51cmxJc1NhZmVMaXN0ZWQobG9nZ2VyKShpdGVtLCBzZXR0aW5ncykpLnRvLmJlLm9rKCk7XG4gICAgZXhwZWN0KHAudXJsSXNTYWZlTGlzdGVkKGxvZ2dlcikodHJhY2VDaGFpbkl0ZW0sIHNldHRpbmdzKSkudG8uYmUub2soKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgaWYgdGhlIGZpbGVuYW1lIGlzIG5vdCBhIHN0cmluZycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXRlbSA9IHtcbiAgICAgIGxldmVsOiAnY3JpdGljYWwnLFxuICAgICAgYm9keToge1xuICAgICAgICB0cmFjZToge1xuICAgICAgICAgIGZyYW1lczogW1xuICAgICAgICAgICAgeyBmaWxlbmFtZTogeyB1cmw6ICdodHRwOi8vYXBpLmZha2UuY29tL3YxL3NvbWV0aGluZycgfSB9LFxuICAgICAgICAgICAgeyBmaWxlbmFtZTogeyB1cmw6ICdodHRwOi8vYXBpLmV4YW1wbGUuY29tL3YxL3NvbWV0aGluZycgfSB9LFxuICAgICAgICAgICAgeyBmaWxlbmFtZTogeyB1cmw6ICdodHRwOi8vYXBpLmZha2UuY29tL3YyL3NvbWV0aGluZycgfSB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgdmFyIHRyYWNlQ2hhaW5JdGVtID0ge1xuICAgICAgbGV2ZWw6ICdjcml0aWNhbCcsXG4gICAgICBib2R5OiB7XG4gICAgICAgIHRyYWNlX2NoYWluOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZnJhbWVzOiBbXG4gICAgICAgICAgICAgIHsgZmlsZW5hbWU6IHsgdXJsOiAnaHR0cDovL2FwaS5mYWtlLmNvbS92MS9zb21ldGhpbmcnIH0gfSxcbiAgICAgICAgICAgICAgeyBmaWxlbmFtZTogeyB1cmw6ICdodHRwOi8vYXBpLmV4YW1wbGUuY29tL3YxL3NvbWV0aGluZycgfSB9LFxuICAgICAgICAgICAgICB7IGZpbGVuYW1lOiB7IHVybDogJ2h0dHA6Ly9hcGkuZmFrZS5jb20vdjIvc29tZXRoaW5nJyB9IH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZnJhbWVzOiBbXG4gICAgICAgICAgICAgIHsgZmlsZW5hbWU6IHsgdXJsOiAnaHR0cDovL2FwaS5mYWtlLmNvbS92MS9zb21ldGhpbmcnIH0gfSxcbiAgICAgICAgICAgICAgeyBmaWxlbmFtZTogeyB1cmw6ICdodHRwOi8vYXBpLmV4YW1wbGUuY29tL3YxL3NvbWV0aGluZycgfSB9LFxuICAgICAgICAgICAgICB7IGZpbGVuYW1lOiB7IHVybDogJ2h0dHA6Ly9hcGkuZmFrZS5jb20vdjIvc29tZXRoaW5nJyB9IH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH07XG4gICAgdmFyIHNldHRpbmdzID0ge1xuICAgICAgcmVwb3J0TGV2ZWw6ICdkZWJ1ZycsXG4gICAgICBob3N0U2FmZUxpc3Q6IFsnbm9wZS5jb20nXSxcbiAgICB9O1xuICAgIGV4cGVjdChwLnVybElzU2FmZUxpc3RlZChsb2dnZXIpKGl0ZW0sIHNldHRpbmdzKSkudG8uYmUub2soKTtcbiAgICBleHBlY3QocC51cmxJc1NhZmVMaXN0ZWQobG9nZ2VyKSh0cmFjZUNoYWluSXRlbSwgc2V0dGluZ3MpKS50by5iZS5vaygpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBpZiB0aGVyZSBpcyBubyBmcmFtZXMga2V5JywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBpdGVtID0ge1xuICAgICAgbGV2ZWw6ICdjcml0aWNhbCcsXG4gICAgICBib2R5OiB7IHRyYWNlOiB7IG5vdGZyYW1lczogW10gfSB9LFxuICAgIH07XG4gICAgdmFyIHRyYWNlQ2hhaW5JdGVtID0ge1xuICAgICAgbGV2ZWw6ICdjcml0aWNhbCcsXG4gICAgICBib2R5OiB7IHRyYWNlX2NoYWluOiBbeyBub3RmcmFtZXM6IFtdIH0sIHsgbm90ZnJhbWVzOiBbXSB9XSB9LFxuICAgIH07XG4gICAgdmFyIHNldHRpbmdzID0ge1xuICAgICAgcmVwb3J0TGV2ZWw6ICdkZWJ1ZycsXG4gICAgICBob3N0U2FmZUxpc3Q6IFsnbm9wZS5jb20nXSxcbiAgICB9O1xuICAgIGV4cGVjdChwLnVybElzU2FmZUxpc3RlZChsb2dnZXIpKGl0ZW0sIHNldHRpbmdzKSkudG8uYmUub2soKTtcbiAgICBleHBlY3QocC51cmxJc1NhZmVMaXN0ZWQobG9nZ2VyKSh0cmFjZUNoYWluSXRlbSwgc2V0dGluZ3MpKS50by5iZS5vaygpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBpZiB0aGVyZSBhcmUgbm8gZnJhbWVzJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBpdGVtID0ge1xuICAgICAgbGV2ZWw6ICdjcml0aWNhbCcsXG4gICAgICBib2R5OiB7IHRyYWNlOiB7IGZyYW1lczogW10gfSB9LFxuICAgIH07XG4gICAgdmFyIHRyYWNlQ2hhaW5JdGVtID0ge1xuICAgICAgbGV2ZWw6ICdjcml0aWNhbCcsXG4gICAgICBib2R5OiB7IHRyYWNlX2NoYWluOiBbeyBmcmFtZXM6IFtdIH0sIHsgZnJhbWVzOiBbXSB9XSB9LFxuICAgIH07XG4gICAgdmFyIHNldHRpbmdzID0ge1xuICAgICAgcmVwb3J0TGV2ZWw6ICdkZWJ1ZycsXG4gICAgICBob3N0U2FmZUxpc3Q6IFsnbm9wZS5jb20nXSxcbiAgICB9O1xuICAgIGV4cGVjdChwLnVybElzU2FmZUxpc3RlZChsb2dnZXIpKGl0ZW0sIHNldHRpbmdzKSkudG8uYmUub2soKTtcbiAgICBleHBlY3QocC51cmxJc1NhZmVMaXN0ZWQobG9nZ2VyKSh0cmFjZUNoYWluSXRlbSwgc2V0dGluZ3MpKS50by5iZS5vaygpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2UgaWYgbm90aGluZyBpbiB0aGUgc2FmZWxpc3QgbWF0Y2hlcycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2V0dGluZ3MgPSB7XG4gICAgICByZXBvcnRMZXZlbDogJ2RlYnVnJyxcbiAgICAgIGhvc3RTYWZlTGlzdDogWydiYXouY29tJywgJ2Zvby5jb20nXSxcbiAgICB9O1xuICAgIGV4cGVjdChwLnVybElzU2FmZUxpc3RlZChsb2dnZXIpKGl0ZW0sIHNldHRpbmdzKSkudG8ubm90LmJlLm9rKCk7XG4gICAgZXhwZWN0KHAudXJsSXNTYWZlTGlzdGVkKGxvZ2dlcikodHJhY2VDaGFpbkl0ZW0sIHNldHRpbmdzKSkudG8ubm90LmJlLm9rKCk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCd1cmxJc05vdEJsb2NrTGlzdGVkJywgZnVuY3Rpb24gKCkge1xuICB2YXIgaXRlbSA9IHtcbiAgICBsZXZlbDogJ2NyaXRpY2FsJyxcbiAgICBib2R5OiB7XG4gICAgICB0cmFjZToge1xuICAgICAgICBmcmFtZXM6IFtcbiAgICAgICAgICB7IGZpbGVuYW1lOiAnaHR0cDovL2FwaS5mYWtlLmNvbS92MS9zb21ldGhpbmcnIH0sXG4gICAgICAgICAgeyBmaWxlbmFtZTogJ2h0dHA6Ly9hcGkuZXhhbXBsZS5jb20vdjEvc29tZXRoaW5nJyB9LFxuICAgICAgICAgIHsgZmlsZW5hbWU6ICdodHRwOi8vYXBpLmZha2UuY29tL3YyL3NvbWV0aGluZycgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbiAgdmFyIHRyYWNlQ2hhaW5JdGVtID0ge1xuICAgIGxldmVsOiAnY3JpdGljYWwnLFxuICAgIGJvZHk6IHtcbiAgICAgIHRyYWNlX2NoYWluOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBmcmFtZXM6IFtcbiAgICAgICAgICAgIHsgZmlsZW5hbWU6ICdodHRwOi8vYXBpLmZha2UuY29tL3YxL3NvbWV0aGluZycgfSxcbiAgICAgICAgICAgIHsgZmlsZW5hbWU6ICdodHRwOi8vYXBpLmV4YW1wbGUuY29tL3YxL3NvbWV0aGluZycgfSxcbiAgICAgICAgICAgIHsgZmlsZW5hbWU6ICdodHRwOi8vYXBpLmZha2UuY29tL3YyL3NvbWV0aGluZycgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZnJhbWVzOiBbXG4gICAgICAgICAgICB7IGZpbGVuYW1lOiAnaHR0cDovL2FwaS5mYWtlMS5jb20vdjIvc29tZXRoaW5nJyB9LFxuICAgICAgICAgICAgeyBmaWxlbmFtZTogJ2h0dHA6Ly9hcGkuZXhhbXBsZTEuY29tL3YyL3NvbWV0aGluZycgfSxcbiAgICAgICAgICAgIHsgZmlsZW5hbWU6ICdodHRwOi8vYXBpLmZha2UxLmNvbS92My9zb21ldGhpbmcnIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfTtcbiAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSB3aXRoIG5vIGJsb2NrbGlzdCcsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2V0dGluZ3MgPSB7XG4gICAgICByZXBvcnRMZXZlbDogJ2RlYnVnJyxcbiAgICB9O1xuICAgIGV4cGVjdChwLnVybElzTm90QmxvY2tMaXN0ZWQobG9nZ2VyKShpdGVtLCBzZXR0aW5ncykpLnRvLmJlLm9rKCk7XG4gICAgZXhwZWN0KHAudXJsSXNOb3RCbG9ja0xpc3RlZChsb2dnZXIpKHRyYWNlQ2hhaW5JdGVtLCBzZXR0aW5ncykpLnRvLmJlLm9rKCk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIHdpdGggbm8gdHJhY2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGl0ZW0gPSB7XG4gICAgICBsZXZlbDogJ2NyaXRpY2FsJyxcbiAgICAgIGJvZHk6IHsgbWVzc2FnZTogJ2hleScgfSxcbiAgICB9O1xuICAgIHZhciBzZXR0aW5ncyA9IHtcbiAgICAgIHJlcG9ydExldmVsOiAnZGVidWcnLFxuICAgICAgaG9zdEJsb2NrTGlzdDogWydmYWtlLmNvbScsICdvdGhlci5jb20nXSxcbiAgICB9O1xuICAgIGV4cGVjdChwLnVybElzTm90QmxvY2tMaXN0ZWQobG9nZ2VyKShpdGVtLCBzZXR0aW5ncykpLnRvLmJlLm9rKCk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSBpZiBhbnkgcmVnZXggbWF0Y2hlcyBhdCBsZWFzdCBvbmUgZmlsZW5hbWUgaW4gdGhlIHRyYWNlJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZXR0aW5ncyA9IHtcbiAgICAgIHJlcG9ydExldmVsOiAnZGVidWcnLFxuICAgICAgaG9zdEJsb2NrTGlzdDogWydleGFtcGxlLmNvbScsICdvdGhlci5jb20nXSxcbiAgICB9O1xuICAgIGV4cGVjdChwLnVybElzTm90QmxvY2tMaXN0ZWQobG9nZ2VyKShpdGVtLCBzZXR0aW5ncykpLnRvLm5vdC5iZS5vaygpO1xuICAgIGV4cGVjdChcbiAgICAgIHAudXJsSXNOb3RCbG9ja0xpc3RlZChsb2dnZXIpKHRyYWNlQ2hhaW5JdGVtLCBzZXR0aW5ncyksXG4gICAgKS50by5ub3QuYmUub2soKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgaWYgdGhlIGZpbGVuYW1lIGlzIG5vdCBhIHN0cmluZycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXRlbSA9IHtcbiAgICAgIGxldmVsOiAnY3JpdGljYWwnLFxuICAgICAgYm9keToge1xuICAgICAgICB0cmFjZToge1xuICAgICAgICAgIGZyYW1lczogW1xuICAgICAgICAgICAgeyBmaWxlbmFtZTogeyB1cmw6ICdodHRwOi8vYXBpLmZha2UuY29tL3YxL3NvbWV0aGluZycgfSB9LFxuICAgICAgICAgICAgeyBmaWxlbmFtZTogeyB1cmw6ICdodHRwOi8vYXBpLmV4YW1wbGUuY29tL3YxL3NvbWV0aGluZycgfSB9LFxuICAgICAgICAgICAgeyBmaWxlbmFtZTogeyB1cmw6ICdodHRwOi8vYXBpLmZha2UuY29tL3YyL3NvbWV0aGluZycgfSB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgdmFyIHRyYWNlQ2hhaW5JdGVtID0ge1xuICAgICAgbGV2ZWw6ICdjcml0aWNhbCcsXG4gICAgICBib2R5OiB7XG4gICAgICAgIHRyYWNlX2NoYWluOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZnJhbWVzOiBbXG4gICAgICAgICAgICAgIHsgZmlsZW5hbWU6IHsgdXJsOiAnaHR0cDovL2FwaS5mYWtlLmNvbS92MS9zb21ldGhpbmcnIH0gfSxcbiAgICAgICAgICAgICAgeyBmaWxlbmFtZTogeyB1cmw6ICdodHRwOi8vYXBpLmV4YW1wbGUuY29tL3YxL3NvbWV0aGluZycgfSB9LFxuICAgICAgICAgICAgICB7IGZpbGVuYW1lOiB7IHVybDogJ2h0dHA6Ly9hcGkuZmFrZS5jb20vdjIvc29tZXRoaW5nJyB9IH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZnJhbWVzOiBbXG4gICAgICAgICAgICAgIHsgZmlsZW5hbWU6IHsgdXJsOiAnaHR0cDovL2FwaS5mYWtlLmNvbS92MS9zb21ldGhpbmcnIH0gfSxcbiAgICAgICAgICAgICAgeyBmaWxlbmFtZTogeyB1cmw6ICdodHRwOi8vYXBpLmV4YW1wbGUuY29tL3YxL3NvbWV0aGluZycgfSB9LFxuICAgICAgICAgICAgICB7IGZpbGVuYW1lOiB7IHVybDogJ2h0dHA6Ly9hcGkuZmFrZS5jb20vdjIvc29tZXRoaW5nJyB9IH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH07XG4gICAgdmFyIHNldHRpbmdzID0ge1xuICAgICAgcmVwb3J0TGV2ZWw6ICdkZWJ1ZycsXG4gICAgICBob3N0QmxvY2tMaXN0OiBbJ2V4YW1wbGUuY29tJywgJ290aGVyLmNvbSddLFxuICAgIH07XG4gICAgZXhwZWN0KHAudXJsSXNOb3RCbG9ja0xpc3RlZChsb2dnZXIpKGl0ZW0sIHNldHRpbmdzKSkudG8uYmUub2soKTtcbiAgICBleHBlY3QocC51cmxJc05vdEJsb2NrTGlzdGVkKGxvZ2dlcikodHJhY2VDaGFpbkl0ZW0sIHNldHRpbmdzKSkudG8uYmUub2soKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgaWYgdGhlcmUgaXMgbm8gZnJhbWVzIGtleScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXRlbSA9IHtcbiAgICAgIGxldmVsOiAnY3JpdGljYWwnLFxuICAgICAgYm9keTogeyB0cmFjZTogeyBub3RmcmFtZXM6IFtdIH0gfSxcbiAgICB9O1xuICAgIHZhciB0cmFjZUNoYWluSXRlbSA9IHtcbiAgICAgIGxldmVsOiAnY3JpdGljYWwnLFxuICAgICAgYm9keTogeyB0cmFjZV9jaGFpbjogW3sgbm90ZnJhbWVzOiBbXSB9LCB7IG5vdGZyYW1lczogW10gfV0gfSxcbiAgICB9O1xuICAgIHZhciBzZXR0aW5ncyA9IHtcbiAgICAgIHJlcG9ydExldmVsOiAnZGVidWcnLFxuICAgICAgaG9zdEJsb2NrTGlzdDogWydub3BlLmNvbSddLFxuICAgIH07XG4gICAgZXhwZWN0KHAudXJsSXNOb3RCbG9ja0xpc3RlZChsb2dnZXIpKGl0ZW0sIHNldHRpbmdzKSkudG8uYmUub2soKTtcbiAgICBleHBlY3QocC51cmxJc05vdEJsb2NrTGlzdGVkKGxvZ2dlcikodHJhY2VDaGFpbkl0ZW0sIHNldHRpbmdzKSkudG8uYmUub2soKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgaWYgdGhlcmUgYXJlIG5vIGZyYW1lcycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXRlbSA9IHtcbiAgICAgIGxldmVsOiAnY3JpdGljYWwnLFxuICAgICAgYm9keTogeyB0cmFjZTogeyBmcmFtZXM6IFtdIH0gfSxcbiAgICB9O1xuICAgIHZhciB0cmFjZUNoYWluSXRlbSA9IHtcbiAgICAgIGxldmVsOiAnY3JpdGljYWwnLFxuICAgICAgYm9keTogeyB0cmFjZV9jaGFpbjogW3sgZnJhbWVzOiBbXSB9LCB7IGZyYW1lczogW10gfV0gfSxcbiAgICB9O1xuICAgIHZhciBzZXR0aW5ncyA9IHtcbiAgICAgIHJlcG9ydExldmVsOiAnZGVidWcnLFxuICAgICAgaG9zdEJsb2NrTGlzdDogWydub3BlLmNvbSddLFxuICAgIH07XG4gICAgZXhwZWN0KHAudXJsSXNOb3RCbG9ja0xpc3RlZChsb2dnZXIpKGl0ZW0sIHNldHRpbmdzKSkudG8uYmUub2soKTtcbiAgICBleHBlY3QocC51cmxJc05vdEJsb2NrTGlzdGVkKGxvZ2dlcikodHJhY2VDaGFpbkl0ZW0sIHNldHRpbmdzKSkudG8uYmUub2soKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgaWYgbm90aGluZyBpbiB0aGUgYmxvY2tsaXN0IG1hdGNoZXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNldHRpbmdzID0ge1xuICAgICAgcmVwb3J0TGV2ZWw6ICdkZWJ1ZycsXG4gICAgICBob3N0QmxvY2tMaXN0OiBbJ2Jhei5jb20nLCAnZm9vLmNvbSddLFxuICAgIH07XG4gICAgZXhwZWN0KHAudXJsSXNOb3RCbG9ja0xpc3RlZChsb2dnZXIpKGl0ZW0sIHNldHRpbmdzKSkudG8uYmUub2soKTtcbiAgICBleHBlY3QocC51cmxJc05vdEJsb2NrTGlzdGVkKGxvZ2dlcikodHJhY2VDaGFpbkl0ZW0sIHNldHRpbmdzKSkudG8uYmUub2soKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ21lc3NhZ2VJc0lnbm9yZWQnLCBmdW5jdGlvbiAoKSB7XG4gIGl0KCd0cnVlIGlmIG5vIGlnbm9yZWRNZXNzYWdlcyBzZXR0aW5nJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBpdGVtID0ge1xuICAgICAgbGV2ZWw6ICdjcml0aWNhbCcsXG4gICAgICBib2R5OiB7XG4gICAgICAgIHRyYWNlOiB7IGV4Y2VwdGlvbjogeyBtZXNzYWdlOiAnYm9yayBib3JrJyB9IH0sXG4gICAgICAgIG1lc3NhZ2U6IHsgYm9keTogJ2Z1enonIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgdmFyIHNldHRpbmdzID0ge1xuICAgICAgcmVwb3J0TGV2ZWw6ICdkZWJ1ZycsXG4gICAgfTtcbiAgICBleHBlY3QocC5tZXNzYWdlSXNJZ25vcmVkKGxvZ2dlcikoaXRlbSwgc2V0dGluZ3MpKS50by5iZS5vaygpO1xuICB9KTtcbiAgaXQoJ3RydWUgaWYgaWdub3JlZE1lc3NhZ2VzIGlzIGVtcHR5JywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBpdGVtID0ge1xuICAgICAgbGV2ZWw6ICdjcml0aWNhbCcsXG4gICAgICBib2R5OiB7XG4gICAgICAgIHRyYWNlOiB7IGV4Y2VwdGlvbjogeyBtZXNzYWdlOiAnYm9yayBib3JrJyB9IH0sXG4gICAgICAgIG1lc3NhZ2U6IHsgYm9keTogJ2Z1enonIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgdmFyIHNldHRpbmdzID0ge1xuICAgICAgcmVwb3J0TGV2ZWw6ICdkZWJ1ZycsXG4gICAgICBpZ25vcmVkTWVzc2FnZXM6IFtdLFxuICAgIH07XG4gICAgZXhwZWN0KHAubWVzc2FnZUlzSWdub3JlZChsb2dnZXIpKGl0ZW0sIHNldHRpbmdzKSkudG8uYmUub2soKTtcbiAgfSk7XG4gIGl0KCd0cnVlIGlmIG5vIGV4Y2VwdGlvbiBtZXNzYWdlJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBpdGVtID0ge1xuICAgICAgbGV2ZWw6ICdjcml0aWNhbCcsXG4gICAgICBib2R5OiB7XG4gICAgICAgIHRyYWNlOiB7IGV4Y2VwdGlvbjoge30gfSxcbiAgICAgICAgbWVzc2FnZTogJ2Z1enonLFxuICAgICAgfSxcbiAgICB9O1xuICAgIHZhciBzZXR0aW5ncyA9IHtcbiAgICAgIHJlcG9ydExldmVsOiAnZGVidWcnLFxuICAgICAgaWdub3JlZE1lc3NhZ2VzOiBbJ2JvcmsgYm9yaycsICdmdXp6J10sXG4gICAgfTtcbiAgICBleHBlY3QocC5tZXNzYWdlSXNJZ25vcmVkKGxvZ2dlcikoaXRlbSwgc2V0dGluZ3MpKS50by5iZS5vaygpO1xuICB9KTtcbiAgaXQoJ3RydWUgaWYgbm8gaWdub3JlZE1lc3NhZ2VzIG1hdGNoJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBpdGVtID0ge1xuICAgICAgbGV2ZWw6ICdjcml0aWNhbCcsXG4gICAgICBib2R5OiB7XG4gICAgICAgIHRyYWNlOiB7IGV4Y2VwdGlvbjogeyBtZXNzYWdlOiAnYm9yayBib3JrJyB9IH0sXG4gICAgICAgIG1lc3NhZ2U6IHsgYm9keTogJ2Z1enonIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgdmFyIHNldHRpbmdzID0ge1xuICAgICAgcmVwb3J0TGV2ZWw6ICdkZWJ1ZycsXG4gICAgICBpZ25vcmVkTWVzc2FnZXM6IFsnZmFrZScsICdzdHVmZiddLFxuICAgIH07XG4gICAgZXhwZWN0KHAubWVzc2FnZUlzSWdub3JlZChsb2dnZXIpKGl0ZW0sIHNldHRpbmdzKSkudG8uYmUub2soKTtcbiAgfSk7XG4gIGl0KCdmYWxzZSBpZiBhbnkgaWdub3JlZE1lc3NhZ2VzIG1hdGNoJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBpdGVtID0ge1xuICAgICAgbGV2ZWw6ICdjcml0aWNhbCcsXG4gICAgICBib2R5OiB7XG4gICAgICAgIHRyYWNlOiB7IGV4Y2VwdGlvbjogeyBtZXNzYWdlOiAnYm9yayBib3JrJyB9IH0sXG4gICAgICAgIG1lc3NhZ2U6IHsgYm9keTogJ2Z1enonIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgdmFyIHNldHRpbmdzID0ge1xuICAgICAgcmVwb3J0TGV2ZWw6ICdkZWJ1ZycsXG4gICAgICBpZ25vcmVkTWVzc2FnZXM6IFsnYm9yayBib3JrJywgJ3N0dWZmJ10sXG4gICAgfTtcbiAgICBleHBlY3QocC5tZXNzYWdlSXNJZ25vcmVkKGxvZ2dlcikoaXRlbSwgc2V0dGluZ3MpKS50by5ub3QuYmUub2soKTtcbiAgfSk7XG4gIGl0KCdmYWxzZSBpZiBpZ25vcmVkTWVzc2FnZXMgcmVnZXggbWF0Y2gnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGl0ZW0gPSB7XG4gICAgICBsZXZlbDogJ2NyaXRpY2FsJyxcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgbWVzc2FnZTogeyBib2R5OiAnVGhpcyBpcyBhbiBpZ25vcmVkIG1lc3NhZ2UnIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgdmFyIHNldHRpbmdzID0ge1xuICAgICAgcmVwb3J0TGV2ZWw6ICdkZWJ1ZycsXG4gICAgICBpZ25vcmVkTWVzc2FnZXM6IFsnXlRoaXMgaXMgYW4gLns3fSBtZXNzYWdlJCddLFxuICAgIH07XG4gICAgZXhwZWN0KHAubWVzc2FnZUlzSWdub3JlZChsb2dnZXIpKGl0ZW0sIHNldHRpbmdzKSkudG8ubm90LmJlLm9rKCk7XG4gIH0pO1xuICBpdCgnZmFsc2UgaWYgaWdub3JlZE1lc3NhZ2VzIGxpdGVyYWwgbWF0Y2gnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGl0ZW0gPSB7XG4gICAgICBsZXZlbDogJ2NyaXRpY2FsJyxcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgbWVzc2FnZTogeyBib2R5OiAne1wiZGF0YVwiOntcIm1lc3NhZ2VzXCI6W3tcIm1lc3NhZ2VcIjpcIlVuYXV0aG9yaXplZFwifV19fScgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICB2YXIgc2V0dGluZ3MgPSB7XG4gICAgICByZXBvcnRMZXZlbDogJ2RlYnVnJyxcbiAgICAgIGlnbm9yZWRNZXNzYWdlczogWyd7XCJkYXRhXCI6e1wibWVzc2FnZXNcIjpcXFxcWyddLFxuICAgIH07XG4gICAgZXhwZWN0KHAubWVzc2FnZUlzSWdub3JlZChsb2dnZXIpKGl0ZW0sIHNldHRpbmdzKSkudG8ubm90LmJlLm9rKCk7XG4gIH0pO1xuICBpdCgnZmFsc2UgaWYgaWdub3JlZE1lc3NhZ2VzIG1vcmUgbGl0ZXJhbCByZWdleCBtYXRjaGVzJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBpdGVtID0ge1xuICAgICAgbGV2ZWw6ICdjcml0aWNhbCcsXG4gICAgICBib2R5OiB7XG4gICAgICAgIG1lc3NhZ2U6IHsgYm9keTogJ01hdGNoIHRoZXNlIGNoYXJhY3RlcnM6ICgqKz8pJyB9LFxuICAgICAgfSxcbiAgICB9O1xuICAgIHZhciBzZXR0aW5ncyA9IHtcbiAgICAgIHJlcG9ydExldmVsOiAnZGVidWcnLFxuICAgICAgaWdub3JlZE1lc3NhZ2VzOiBbJ1xcXFwoXFxcXCpcXFxcK1xcXFw/XFxcXCknXSxcbiAgICB9O1xuICAgIGV4cGVjdChwLm1lc3NhZ2VJc0lnbm9yZWQobG9nZ2VyKShpdGVtLCBzZXR0aW5ncykpLnRvLm5vdC5iZS5vaygpO1xuICB9KTtcbiAgaXQoJ2ZhbHNlIGlmIGJvdGggdHJhY2UgYW5kIGJvZHkgbWVzc2FnZSBidXQgaWdub3JlZE1lc3NhZ2VzIG9ubHkgbWF0Y2ggYm9keScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXRlbSA9IHtcbiAgICAgIGxldmVsOiAnY3JpdGljYWwnLFxuICAgICAgYm9keToge1xuICAgICAgICB0cmFjZTogeyBleGNlcHRpb246IHsgbWVzc2FnZTogJ2JvcmsgYm9yaycgfSB9LFxuICAgICAgICBtZXNzYWdlOiB7IGJvZHk6ICdmdXp6JyB9LFxuICAgICAgfSxcbiAgICB9O1xuICAgIHZhciBzZXR0aW5ncyA9IHtcbiAgICAgIHJlcG9ydExldmVsOiAnZGVidWcnLFxuICAgICAgaWdub3JlZE1lc3NhZ2VzOiBbJ2Z1enonLCAnc3R1ZmYnXSxcbiAgICB9O1xuICAgIGV4cGVjdChwLm1lc3NhZ2VJc0lnbm9yZWQobG9nZ2VyKShpdGVtLCBzZXR0aW5ncykpLnRvLm5vdC5iZS5vaygpO1xuICB9KTtcbiAgaXQoJ2ZhbHNlIGlmIGlnbm9yZWRNZXNzYWdlcyBtYXRjaCBzb21ldGhpbmcgaW4gYm9keSBleGNlcHRpb24gbWVzc2FnZScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXRlbSA9IHtcbiAgICAgIGxldmVsOiAnY3JpdGljYWwnLFxuICAgICAgYm9keToge1xuICAgICAgICB0cmFjZTogeyBmcmFtZXM6IFtdIH0sXG4gICAgICAgIG1lc3NhZ2U6IHsgYm9keTogJ2Z1enonIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgdmFyIHNldHRpbmdzID0ge1xuICAgICAgcmVwb3J0TGV2ZWw6ICdkZWJ1ZycsXG4gICAgICBpZ25vcmVkTWVzc2FnZXM6IFsnc3R1ZmYnLCAnZnV6eiddLFxuICAgIH07XG4gICAgZXhwZWN0KHAubWVzc2FnZUlzSWdub3JlZChsb2dnZXIpKGl0ZW0sIHNldHRpbmdzKSkudG8ubm90LmJlLm9rKCk7XG4gIH0pO1xuICBpdChcInRydWUgaWYgdHJhY2VfY2hhaW4gZG9lc24ndCBtYXRjaFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGl0ZW0gPSB7XG4gICAgICBsZXZlbDogJ2NyaXRpY2FsJyxcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgdHJhY2VfY2hhaW46IFtcbiAgICAgICAgICB7IGV4Y2VwdGlvbjogeyBtZXNzYWdlOiAnaW5uZXIgYm9yaycgfSB9LFxuICAgICAgICAgIHsgZXhjZXB0aW9uOiB7IG1lc3NhZ2U6ICdvdXRlciBib3JrJyB9IH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH07XG4gICAgdmFyIHNldHRpbmdzID0ge1xuICAgICAgcmVwb3J0TGV2ZWw6ICdkZWJ1ZycsXG4gICAgICBpZ25vcmVkTWVzc2FnZXM6IFsnc3R1ZmYnLCAnZnV6eiddLFxuICAgIH07XG4gICAgZXhwZWN0KHAubWVzc2FnZUlzSWdub3JlZChsb2dnZXIpKGl0ZW0sIHNldHRpbmdzKSkudG8uYmUub2soKTtcbiAgfSk7XG4gIGl0KCdmYWxzZSBpZiBmaXJzdCB0cmFjZV9jaGFpbiB0cmFjZSBtYXRjaGVzJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBpdGVtID0ge1xuICAgICAgbGV2ZWw6ICdjcml0aWNhbCcsXG4gICAgICBib2R5OiB7XG4gICAgICAgIHRyYWNlX2NoYWluOiBbXG4gICAgICAgICAgeyBleGNlcHRpb246IHsgbWVzc2FnZTogJ2lubmVyIHN0dWZmJyB9IH0sXG4gICAgICAgICAgeyBleGNlcHRpb246IHsgbWVzc2FnZTogJ291dGVyIGJvcmsnIH0gfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICB2YXIgc2V0dGluZ3MgPSB7XG4gICAgICByZXBvcnRMZXZlbDogJ2RlYnVnJyxcbiAgICAgIGlnbm9yZWRNZXNzYWdlczogWydzdHVmZicsICdmdXp6J10sXG4gICAgfTtcbiAgICBleHBlY3QocC5tZXNzYWdlSXNJZ25vcmVkKGxvZ2dlcikoaXRlbSwgc2V0dGluZ3MpKS50by5ub3QuYmUub2soKTtcbiAgfSk7XG4gIGl0KCdmYWxzZSBpZiBsYXN0IHRyYWNlX2NoYWluIHRyYWNlIG1hdGNoZXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGl0ZW0gPSB7XG4gICAgICBsZXZlbDogJ2NyaXRpY2FsJyxcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgdHJhY2VfY2hhaW46IFtcbiAgICAgICAgICB7IGV4Y2VwdGlvbjogeyBtZXNzYWdlOiAnaW5uZXIgYm9yaycgfSB9LFxuICAgICAgICAgIHsgZXhjZXB0aW9uOiB7IG1lc3NhZ2U6ICdvdXRlciBmdXp6JyB9IH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH07XG4gICAgdmFyIHNldHRpbmdzID0ge1xuICAgICAgcmVwb3J0TGV2ZWw6ICdkZWJ1ZycsXG4gICAgICBpZ25vcmVkTWVzc2FnZXM6IFsnc3R1ZmYnLCAnZnV6eiddLFxuICAgIH07XG4gICAgZXhwZWN0KHAubWVzc2FnZUlzSWdub3JlZChsb2dnZXIpKGl0ZW0sIHNldHRpbmdzKSkudG8ubm90LmJlLm9rKCk7XG4gIH0pO1xufSk7XG4iXSwibmFtZXMiOlsiaGFzT3duIiwiT2JqZWN0IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJ0b1N0ciIsInRvU3RyaW5nIiwiaXNQbGFpbk9iamVjdCIsIm9iaiIsImNhbGwiLCJoYXNPd25Db25zdHJ1Y3RvciIsImhhc0lzUHJvdG90eXBlT2YiLCJjb25zdHJ1Y3RvciIsImtleSIsIm1lcmdlIiwiaSIsInNyYyIsImNvcHkiLCJjbG9uZSIsIm5hbWUiLCJyZXN1bHQiLCJjdXJyZW50IiwibGVuZ3RoIiwiYXJndW1lbnRzIiwibW9kdWxlIiwiZXhwb3J0cyIsIl8iLCJyZXF1aXJlIiwiY2hlY2tMZXZlbCIsIml0ZW0iLCJzZXR0aW5ncyIsImxldmVsIiwibGV2ZWxWYWwiLCJMRVZFTFMiLCJyZXBvcnRMZXZlbCIsInJlcG9ydExldmVsVmFsIiwidXNlckNoZWNrSWdub3JlIiwibG9nZ2VyIiwiaXNVbmNhdWdodCIsIl9pc1VuY2F1Z2h0IiwiYXJncyIsIl9vcmlnaW5hbEFyZ3MiLCJpc0Z1bmN0aW9uIiwib25TZW5kQ2FsbGJhY2siLCJlIiwiZXJyb3IiLCJjaGVja0lnbm9yZSIsInVybElzTm90QmxvY2tMaXN0ZWQiLCJ1cmxJc09uQUxpc3QiLCJ1cmxJc1NhZmVMaXN0ZWQiLCJtYXRjaEZyYW1lcyIsInRyYWNlIiwibGlzdCIsImJsb2NrIiwiZnJhbWVzIiwiZnJhbWUiLCJmaWxlbmFtZSIsInVybCIsInVybFJlZ2V4IiwibGlzdExlbmd0aCIsImZyYW1lTGVuZ3RoIiwiaXNUeXBlIiwiaiIsIlJlZ0V4cCIsInRlc3QiLCJzYWZlT3JCbG9jayIsInRyYWNlcyIsImhvc3RCbG9ja0xpc3QiLCJob3N0U2FmZUxpc3QiLCJnZXQiLCJ0cmFjZXNMZW5ndGgiLCJsaXN0TmFtZSIsIm1lc3NhZ2VJc0lnbm9yZWQiLCJpZ25vcmVkTWVzc2FnZXMiLCJsZW4iLCJySWdub3JlZE1lc3NhZ2UiLCJtZXNzYWdlcyIsIm1lc3NhZ2VzRnJvbUl0ZW0iLCJib2R5IiwidHJhY2VfY2hhaW4iLCJ0cmFjZUNoYWluIiwicHVzaCIsIm1lc3NhZ2UiLCJSb2xsYmFySlNPTiIsInNldHVwSlNPTiIsInBvbHlmaWxsSlNPTiIsInN0cmluZ2lmeSIsInBhcnNlIiwiaXNEZWZpbmVkIiwiSlNPTiIsImlzTmF0aXZlRnVuY3Rpb24iLCJ4IiwidCIsInR5cGVOYW1lIiwiX3R5cGVvZiIsIkVycm9yIiwibWF0Y2giLCJ0b0xvd2VyQ2FzZSIsImYiLCJyZVJlZ0V4cENoYXIiLCJmdW5jTWF0Y2hTdHJpbmciLCJGdW5jdGlvbiIsInJlcGxhY2UiLCJyZUlzTmF0aXZlIiwiaXNPYmplY3QiLCJ2YWx1ZSIsInR5cGUiLCJpc1N0cmluZyIsIlN0cmluZyIsImlzRmluaXRlTnVtYmVyIiwibiIsIk51bWJlciIsImlzRmluaXRlIiwidSIsImlzSXRlcmFibGUiLCJpc0Vycm9yIiwiaXNQcm9taXNlIiwicCIsInRoZW4iLCJpc0Jyb3dzZXIiLCJ3aW5kb3ciLCJyZWRhY3QiLCJ1dWlkNCIsImQiLCJub3ciLCJ1dWlkIiwiYyIsInIiLCJNYXRoIiwicmFuZG9tIiwiZmxvb3IiLCJkZWJ1ZyIsImluZm8iLCJ3YXJuaW5nIiwiY3JpdGljYWwiLCJzYW5pdGl6ZVVybCIsImJhc2VVcmxQYXJ0cyIsInBhcnNlVXJpIiwiYW5jaG9yIiwic291cmNlIiwicXVlcnkiLCJwYXJzZVVyaU9wdGlvbnMiLCJzdHJpY3RNb2RlIiwicSIsInBhcnNlciIsInN0cmljdCIsImxvb3NlIiwic3RyIiwidW5kZWZpbmVkIiwibyIsIm0iLCJleGVjIiwidXJpIiwibCIsIiQwIiwiJDEiLCIkMiIsImFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoIiwiYWNjZXNzVG9rZW4iLCJvcHRpb25zIiwicGFyYW1zIiwiYWNjZXNzX3Rva2VuIiwicGFyYW1zQXJyYXkiLCJrIiwiam9pbiIsInNvcnQiLCJwYXRoIiwicXMiLCJpbmRleE9mIiwiaCIsInN1YnN0cmluZyIsImZvcm1hdFVybCIsInByb3RvY29sIiwicG9ydCIsImhvc3RuYW1lIiwiYmFja3VwIiwianNvbkVycm9yIiwiYmFja3VwRXJyb3IiLCJtYXhCeXRlU2l6ZSIsInN0cmluZyIsImNvdW50IiwiY29kZSIsImNoYXJDb2RlQXQiLCJqc29uUGFyc2UiLCJzIiwibWFrZVVuaGFuZGxlZFN0YWNrSW5mbyIsImxpbmVubyIsImNvbG5vIiwibW9kZSIsImJhY2t1cE1lc3NhZ2UiLCJlcnJvclBhcnNlciIsImxvY2F0aW9uIiwibGluZSIsImNvbHVtbiIsImZ1bmMiLCJndWVzc0Z1bmN0aW9uTmFtZSIsImNvbnRleHQiLCJnYXRoZXJDb250ZXh0IiwiaHJlZiIsImRvY3VtZW50IiwidXNlcmFnZW50IiwibmF2aWdhdG9yIiwidXNlckFnZW50Iiwic3RhY2siLCJ3cmFwQ2FsbGJhY2siLCJlcnIiLCJyZXNwIiwibm9uQ2lyY3VsYXJDbG9uZSIsInNlZW4iLCJuZXdTZWVuIiwiaW5jbHVkZXMiLCJzbGljZSIsImNyZWF0ZUl0ZW0iLCJub3RpZmllciIsInJlcXVlc3RLZXlzIiwibGFtYmRhQ29udGV4dCIsImN1c3RvbSIsImNhbGxiYWNrIiwicmVxdWVzdCIsImFyZyIsImV4dHJhQXJncyIsImRpYWdub3N0aWMiLCJhcmdUeXBlcyIsInR5cCIsIkRPTUV4Y2VwdGlvbiIsInRpbWVzdGFtcCIsImRhdGEiLCJzZXRDdXN0b21JdGVtS2V5cyIsIm9yaWdpbmFsX2FyZ190eXBlcyIsInNraXBGcmFtZXMiLCJhZGRFcnJvckNvbnRleHQiLCJlcnJvcnMiLCJjb250ZXh0QWRkZWQiLCJyb2xsYmFyQ29udGV4dCIsImVycm9yX2NvbnRleHQiLCJURUxFTUVUUllfVFlQRVMiLCJURUxFTUVUUllfTEVWRUxTIiwiYXJyYXlJbmNsdWRlcyIsImFyciIsInZhbCIsImNyZWF0ZVRlbGVtZXRyeUV2ZW50IiwibWV0YWRhdGEiLCJldmVudCIsImFkZEl0ZW1BdHRyaWJ1dGVzIiwiYXR0cmlidXRlcyIsIl9pdGVtJGRhdGEkYXR0cmlidXRlcyIsImFwcGx5IiwiX3RvQ29uc3VtYWJsZUFycmF5Iiwia2V5cyIsInNwbGl0Iiwic2V0IiwidGVtcCIsInJlcGxhY2VtZW50IiwiZm9ybWF0QXJnc0FzU3RyaW5nIiwic3Vic3RyIiwiRGF0ZSIsImZpbHRlcklwIiwicmVxdWVzdERhdGEiLCJjYXB0dXJlSXAiLCJuZXdJcCIsInBhcnRzIiwicG9wIiwiYmVnaW5uaW5nIiwic2xhc2hJZHgiLCJ0ZXJtaW5hbCIsImNvbmNhdCIsImhhbmRsZU9wdGlvbnMiLCJpbnB1dCIsInBheWxvYWQiLCJ1cGRhdGVEZXByZWNhdGVkT3B0aW9ucyIsIm92ZXJ3cml0ZVNjcnViRmllbGRzIiwic2NydWJGaWVsZHMiLCJob3N0V2hpdGVMaXN0IiwibG9nIiwiaG9zdEJsYWNrTGlzdCJdLCJzb3VyY2VSb290IjoiIn0=