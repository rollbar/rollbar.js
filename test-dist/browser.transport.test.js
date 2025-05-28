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

/***/ "./node_modules/console-polyfill/index.js":
/*!************************************************!*\
  !*** ./node_modules/console-polyfill/index.js ***!
  \************************************************/
/***/ (function() {

// Console-polyfill. MIT license.
// https://github.com/paulmillr/console-polyfill
// Make it safe to do console.log() always.
(function(global) {
  'use strict';
  if (!global.console) {
    global.console = {};
  }
  var con = global.console;
  var prop, method;
  var dummy = function() {};
  var properties = ['memory'];
  var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
     'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
     'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
  while (prop = properties.pop()) if (!con[prop]) con[prop] = {};
  while (method = methods.pop()) if (!con[method]) con[method] = dummy;
  // Using `this` for web workers & supports Browserify / Webpack.
})(typeof window === 'undefined' ? this : window);


/***/ }),

/***/ "./src/browser/detection.js":
/*!**********************************!*\
  !*** ./src/browser/detection.js ***!
  \**********************************/
/***/ ((module) => {

// This detection.js module is used to encapsulate any ugly browser/feature
// detection we may need to do.

// Figure out which version of IE we're using, if any.
// This is gleaned from http://stackoverflow.com/questions/5574842/best-way-to-check-for-ie-less-than-9-in-javascript-without-library
// Will return an integer on IE (i.e. 8)
// Will return undefined otherwise
function getIEVersion() {
  var undef;
  if (typeof document === 'undefined') {
    return undef;
  }
  var v = 3,
    div = document.createElement('div'),
    all = div.getElementsByTagName('i');
  while (div.innerHTML = '<!--[if gt IE ' + ++v + ']><i></i><![endif]-->', all[0]);
  return v > 4 ? v : undef;
}
var Detection = {
  ieVersion: getIEVersion
};
module.exports = Detection;

/***/ }),

/***/ "./src/browser/logger.js":
/*!*******************************!*\
  !*** ./src/browser/logger.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable no-console */
__webpack_require__(/*! console-polyfill */ "./node_modules/console-polyfill/index.js");
var detection = __webpack_require__(/*! ./detection */ "./src/browser/detection.js");
var _ = __webpack_require__(/*! ../utility */ "./src/utility.js");
function error() {
  var args = Array.prototype.slice.call(arguments, 0);
  args.unshift('Rollbar:');
  if (detection.ieVersion() <= 8) {
    console.error(_.formatArgsAsString(args));
  } else {
    console.error.apply(console, args);
  }
}
function info() {
  var args = Array.prototype.slice.call(arguments, 0);
  args.unshift('Rollbar:');
  if (detection.ieVersion() <= 8) {
    console.info(_.formatArgsAsString(args));
  } else {
    console.info.apply(console, args);
  }
}
function log() {
  var args = Array.prototype.slice.call(arguments, 0);
  args.unshift('Rollbar:');
  if (detection.ieVersion() <= 8) {
    console.log(_.formatArgsAsString(args));
  } else {
    console.log.apply(console, args);
  }
}

/* eslint-enable no-console */

module.exports = {
  error: error,
  info: info,
  log: log
};

/***/ }),

/***/ "./src/browser/transport.js":
/*!**********************************!*\
  !*** ./src/browser/transport.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ../utility */ "./src/utility.js");
var makeFetchRequest = __webpack_require__(/*! ./transport/fetch */ "./src/browser/transport/fetch.js");
var makeXhrRequest = __webpack_require__(/*! ./transport/xhr */ "./src/browser/transport/xhr.js");

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
  if (!callback || !_.isFunction(callback)) {
    callback = function callback() {};
  }
  _.addParamsAndAccessTokenToPath(accessToken, options, params);
  var method = 'GET';
  var url = _.formatUrl(options);
  this._makeZoneRequest(accessToken, url, method, null, callback, requestFactory, options.timeout, options.transport);
};
Transport.prototype.post = function (accessToken, options, payload, callback, requestFactory) {
  if (!callback || !_.isFunction(callback)) {
    callback = function callback() {};
  }
  if (!payload) {
    return callback(new Error('Cannot send empty request'));
  }
  var stringifyResult;
  if (this.truncation) {
    stringifyResult = this.truncation.truncate(payload);
  } else {
    stringifyResult = _.stringify(payload);
  }
  if (stringifyResult.error) {
    return callback(stringifyResult.error);
  }
  var writeData = stringifyResult.value;
  var method = 'POST';
  var url = _.formatUrl(options);
  this._makeZoneRequest(accessToken, url, method, writeData, callback, requestFactory, options.timeout, options.transport);
};
Transport.prototype.postJsonPayload = function (accessToken, options, jsonPayload, callback, requestFactory) {
  if (!callback || !_.isFunction(callback)) {
    callback = function callback() {};
  }
  var method = 'POST';
  var url = _.formatUrl(options);
  this._makeZoneRequest(accessToken, url, method, jsonPayload, callback, requestFactory, options.timeout, options.transport);
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
Transport.prototype._makeRequest = function (accessToken, url, method, data, callback, requestFactory, timeout, transport) {
  if (typeof RollbarProxy !== 'undefined') {
    return _proxyRequest(data, callback);
  }
  if (transport === 'fetch') {
    makeFetchRequest(accessToken, url, method, data, callback, timeout);
  } else {
    makeXhrRequest(accessToken, url, method, data, callback, requestFactory, timeout);
  }
};

/* global RollbarProxy */
function _proxyRequest(json, callback) {
  var rollbarProxy = new RollbarProxy();
  rollbarProxy.sendJsonPayload(json, function (_msg) {
    /* do nothing */
  },
  // eslint-disable-line no-unused-vars
  function (err) {
    callback(new Error(err));
  });
}
module.exports = Transport;

/***/ }),

/***/ "./src/browser/transport/fetch.js":
/*!****************************************!*\
  !*** ./src/browser/transport/fetch.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var logger = __webpack_require__(/*! ../logger */ "./src/browser/logger.js");
var _ = __webpack_require__(/*! ../../utility */ "./src/utility.js");
function makeFetchRequest(accessToken, url, method, data, callback, timeout) {
  var controller;
  var timeoutId;
  if (_.isFiniteNumber(timeout)) {
    controller = new AbortController();
    timeoutId = setTimeout(function () {
      controller.abort();
    }, timeout);
  }
  fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'X-Rollbar-Access-Token': accessToken,
      signal: controller && controller.signal
    },
    body: data
  }).then(function (response) {
    if (timeoutId) clearTimeout(timeoutId);
    return response.json();
  }).then(function (data) {
    callback(null, data);
  })["catch"](function (error) {
    logger.error(error.message);
    callback(error);
  });
}
module.exports = makeFetchRequest;

/***/ }),

/***/ "./src/browser/transport/xhr.js":
/*!**************************************!*\
  !*** ./src/browser/transport/xhr.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*global XDomainRequest*/

var _ = __webpack_require__(/*! ../../utility */ "./src/utility.js");
var logger = __webpack_require__(/*! ../logger */ "./src/browser/logger.js");
function makeXhrRequest(accessToken, url, method, data, callback, requestFactory, timeout) {
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
            var parseResponse = _.jsonParse(request.responseText);
            if (_isSuccess(request)) {
              callback(parseResponse.error, parseResponse.value);
              return;
            } else if (_isNormalFailure(request)) {
              if (request.status === 403) {
                // likely caused by using a server access token
                var message = parseResponse.value && parseResponse.value.message;
                logger.error(message);
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
      }
      if (_.isFiniteNumber(timeout)) {
        request.timeout = timeout;
      }
      request.onreadystatechange = _onreadystatechange;
      request.send(data);
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
          var parseResponse = _.jsonParse(xdomainrequest.responseText);
          callback(parseResponse.error, parseResponse.value);
        };
        xdomainrequest.open(method, url, true);
        xdomainrequest.send(data);
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
    /* eslint-disable no-empty */
    try {
      xmlhttp = factories[i]();
      break;
    } catch (e) {
      // pass
    }
    /* eslint-enable no-empty */
  }
  return xmlhttp;
}
function _isSuccess(r) {
  return r && r.status && r.status === 200;
}
function _isNormalFailure(r) {
  return r && _.isType(r.status, 'number') && r.status >= 400 && r.status < 600;
}
function _newRetriableError(message, code) {
  var err = new Error(message);
  err.code = code || 'ENOTFOUND';
  return err;
}
module.exports = makeXhrRequest;

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!****************************************!*\
  !*** ./test/browser.transport.test.js ***!
  \****************************************/
/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var truncation = __webpack_require__(/*! ../src/truncation */ "./src/truncation.js");
var Transport = __webpack_require__(/*! ../src/browser/transport */ "./src/browser/transport.js");
var t = new Transport(truncation);
var utility = __webpack_require__(/*! ../src/utility */ "./src/utility.js");
utility.setupJSON();

describe('post', function () {
  var accessToken = 'abc123';
  var options = {
    hostname: 'api.rollbar.com',
    protocol: 'https',
    path: '/api/1/item/',
    timeout: 2000,
  };
  var payload = {
    access_token: accessToken,
    data: { a: 1 },
  };
  it('should handle a failure to make a request', function (done) {
    var requestFactory = function () {
      return null;
    };
    var callback = function (err, resp) {
      expect(err).to.be.ok();
      done(resp);
    };
    t.post(accessToken, options, payload, callback, requestFactory);
  });
  it('should callback with the right value on success', function (done) {
    var requestFactory = requestGenerator('{"err": null, "result": true}', 200);
    var callback = function (err, resp) {
      expect(resp).to.be.ok();
      expect(resp.result).to.be.ok();
      expect(requestFactory.getInstance().timeout).to.equal(options.timeout);
      done(err);
    };
    t.post(accessToken, options, payload, callback, requestFactory.getInstance);
  });
  it('should callback with the server error if 403', function (done) {
    var response =
      '{"err": "bad request", "result": null, "message": "fail whale"}';
    var requestFactory = requestGenerator(response, 403);
    var callback = function (err, resp) {
      expect(resp).to.not.be.ok();
      expect(err.message).to.eql('403');
      expect(requestFactory.getInstance().timeout).to.equal(options.timeout);
      done(resp);
    };
    t.post(accessToken, options, payload, callback, requestFactory.getInstance);
  });
  it('should callback with the server error if 500', function (done) {
    var response =
      '{"err": "bad request", "result": null, "message": "500!!!"}';
    var requestFactory = requestGenerator(response, 500);
    var callback = function (err, resp) {
      expect(resp).to.not.be.ok();
      expect(err.message).to.eql('500');
      expect(requestFactory.getInstance().timeout).to.equal(options.timeout);
      done(resp);
    };
    t.post(accessToken, options, payload, callback, requestFactory.getInstance);
  });
  it('should callback with a retriable error with a weird status', function (done) {
    var response = '{"err": "bad request"}';
    var requestFactory = requestGenerator(response, 12005);
    var callback = function (err, resp) {
      expect(resp).to.not.be.ok();
      expect(err.message).to.match(/connection failure/);
      expect(err.code).to.eql('ENOTFOUND');
      expect(requestFactory.getInstance().timeout).to.equal(options.timeout);
      done(resp);
    };
    t.post(accessToken, options, payload, callback, requestFactory.getInstance);
  });
  it('should callback with some error if normal sending throws', function (done) {
    var response = '{"err": "bad request"}';
    var requestFactory = requestGenerator(response, 500, true);
    var callback = function (err, resp) {
      expect(resp).to.not.be.ok();
      expect(err.message).to.match(/Cannot find a method to transport/);
      expect(requestFactory.getInstance().timeout).to.equal(options.timeout);
      done(resp);
    };
    t.post(accessToken, options, payload, callback, requestFactory.getInstance);
  });
  describe('post', function () {
    beforeEach(function (done) {
      window.fetchStub = sinon.stub(window, 'fetch');
      window.server = sinon.createFakeServer();
      done();
    });

    afterEach(function () {
      window.fetch.restore();
      window.server.restore();
    });

    function stubFetchResponse() {
      window.fetch.returns(
        Promise.resolve(
          new Response(
            JSON.stringify({ err: 0, message: 'OK', result: { uuid: uuid } }),
            {
              status: 200,
              statusText: 'OK',
              headers: { 'Content-Type': 'application/json' },
            },
          ),
        ),
      );
    }

    function stubXhrResponse() {
      window.server.respondWith([
        200,
        { 'Content-Type': 'application/json' },
        '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}',
      ]);
    }

    var uuid = 'd4c7acef55bf4c9ea95e4fe9428a8287';

    it('should use fetch when requested', function (done) {
      var callback = function (err, resp) {
        expect(window.fetchStub.called).to.be.ok();
        expect(server.requests.length).to.eql(0);
        done(err);
      };
      stubFetchResponse();
      stubXhrResponse();
      server.requests.length = 0;
      options.transport = 'fetch';
      t.post(accessToken, options, payload, callback);
    });
    it('should use xhr when requested', function (done) {
      var callback = function (err, resp) {
        expect(window.fetchStub.called).to.not.be.ok();
        expect(server.requests.length).to.eql(1);
        done(err);
      };
      stubFetchResponse();
      stubXhrResponse();
      server.requests.length = 0;
      options.transport = 'xhr';
      t.post(accessToken, options, payload, callback);
      setTimeout(function () {
        server.respond();
      }, 1);
    });
  });
});

var TestRequest = function (response, status, shouldThrowOnSend) {
  this.method = null;
  this.url = null;
  this.async = false;
  this.headers = [];
  this.data = null;
  this.responseText = response;
  this.status = status;
  this.onreadystatechange = null;
  this.readyState = 0;
  this.shouldThrowOnSend = shouldThrowOnSend;
};
TestRequest.prototype.open = function (m, u, a) {
  this.method = m;
  this.url = u;
  this.async = a;
};
TestRequest.prototype.setRequestHeader = function (key, value) {
  this.headers.push([key, value]);
};
TestRequest.prototype.send = function (data) {
  if (this.shouldThrowOnSend) {
    throw 'Bork Bork';
  }
  this.data = data;
  if (this.onreadystatechange) {
    this.readyState = 4;
    this.onreadystatechange();
  }
};

var requestGenerator = function (response, status, shouldThrow) {
  var request;
  return {
    getInstance: function () {
      if (!request) {
        request = new TestRequest(response, status, shouldThrow);
      }
      return request;
    },
  };
};

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LDRDQUE0QztBQUMzRTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vbm9kZV9tb2R1bGVzL2NvbnNvbGUtcG9seWZpbGwvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9icm93c2VyL2RldGVjdGlvbi5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL2Jyb3dzZXIvbG9nZ2VyLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvYnJvd3Nlci90cmFuc3BvcnQuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9icm93c2VyL3RyYW5zcG9ydC9mZXRjaC5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL2Jyb3dzZXIvdHJhbnNwb3J0L3hoci5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL21lcmdlLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvdHJ1bmNhdGlvbi5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy91dGlsaXR5L3RyYXZlcnNlLmpzIiwid2VicGFjazovL3JvbGxiYXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3Rlc3QvYnJvd3Nlci50cmFuc3BvcnQudGVzdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoc2VsZiwgKCkgPT4ge1xucmV0dXJuICIsIi8vIENvbnNvbGUtcG9seWZpbGwuIE1JVCBsaWNlbnNlLlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3BhdWxtaWxsci9jb25zb2xlLXBvbHlmaWxsXG4vLyBNYWtlIGl0IHNhZmUgdG8gZG8gY29uc29sZS5sb2coKSBhbHdheXMuXG4oZnVuY3Rpb24oZ2xvYmFsKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgaWYgKCFnbG9iYWwuY29uc29sZSkge1xuICAgIGdsb2JhbC5jb25zb2xlID0ge307XG4gIH1cbiAgdmFyIGNvbiA9IGdsb2JhbC5jb25zb2xlO1xuICB2YXIgcHJvcCwgbWV0aG9kO1xuICB2YXIgZHVtbXkgPSBmdW5jdGlvbigpIHt9O1xuICB2YXIgcHJvcGVydGllcyA9IFsnbWVtb3J5J107XG4gIHZhciBtZXRob2RzID0gKCdhc3NlcnQsY2xlYXIsY291bnQsZGVidWcsZGlyLGRpcnhtbCxlcnJvcixleGNlcHRpb24sZ3JvdXAsJyArXG4gICAgICdncm91cENvbGxhcHNlZCxncm91cEVuZCxpbmZvLGxvZyxtYXJrVGltZWxpbmUscHJvZmlsZSxwcm9maWxlcyxwcm9maWxlRW5kLCcgK1xuICAgICAnc2hvdyx0YWJsZSx0aW1lLHRpbWVFbmQsdGltZWxpbmUsdGltZWxpbmVFbmQsdGltZVN0YW1wLHRyYWNlLHdhcm4nKS5zcGxpdCgnLCcpO1xuICB3aGlsZSAocHJvcCA9IHByb3BlcnRpZXMucG9wKCkpIGlmICghY29uW3Byb3BdKSBjb25bcHJvcF0gPSB7fTtcbiAgd2hpbGUgKG1ldGhvZCA9IG1ldGhvZHMucG9wKCkpIGlmICghY29uW21ldGhvZF0pIGNvblttZXRob2RdID0gZHVtbXk7XG4gIC8vIFVzaW5nIGB0aGlzYCBmb3Igd2ViIHdvcmtlcnMgJiBzdXBwb3J0cyBCcm93c2VyaWZ5IC8gV2VicGFjay5cbn0pKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gdGhpcyA6IHdpbmRvdyk7XG4iLCIvLyBUaGlzIGRldGVjdGlvbi5qcyBtb2R1bGUgaXMgdXNlZCB0byBlbmNhcHN1bGF0ZSBhbnkgdWdseSBicm93c2VyL2ZlYXR1cmVcbi8vIGRldGVjdGlvbiB3ZSBtYXkgbmVlZCB0byBkby5cblxuLy8gRmlndXJlIG91dCB3aGljaCB2ZXJzaW9uIG9mIElFIHdlJ3JlIHVzaW5nLCBpZiBhbnkuXG4vLyBUaGlzIGlzIGdsZWFuZWQgZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU1NzQ4NDIvYmVzdC13YXktdG8tY2hlY2stZm9yLWllLWxlc3MtdGhhbi05LWluLWphdmFzY3JpcHQtd2l0aG91dC1saWJyYXJ5XG4vLyBXaWxsIHJldHVybiBhbiBpbnRlZ2VyIG9uIElFIChpLmUuIDgpXG4vLyBXaWxsIHJldHVybiB1bmRlZmluZWQgb3RoZXJ3aXNlXG5mdW5jdGlvbiBnZXRJRVZlcnNpb24oKSB7XG4gIHZhciB1bmRlZjtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gdW5kZWY7XG4gIH1cblxuICB2YXIgdiA9IDMsXG4gICAgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgYWxsID0gZGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpJyk7XG5cbiAgd2hpbGUgKFxuICAgICgoZGl2LmlubmVySFRNTCA9ICc8IS0tW2lmIGd0IElFICcgKyArK3YgKyAnXT48aT48L2k+PCFbZW5kaWZdLS0+JyksIGFsbFswXSlcbiAgKTtcblxuICByZXR1cm4gdiA+IDQgPyB2IDogdW5kZWY7XG59XG5cbnZhciBEZXRlY3Rpb24gPSB7XG4gIGllVmVyc2lvbjogZ2V0SUVWZXJzaW9uLFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZXRlY3Rpb247XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5yZXF1aXJlKCdjb25zb2xlLXBvbHlmaWxsJyk7XG52YXIgZGV0ZWN0aW9uID0gcmVxdWlyZSgnLi9kZXRlY3Rpb24nKTtcbnZhciBfID0gcmVxdWlyZSgnLi4vdXRpbGl0eScpO1xuXG5mdW5jdGlvbiBlcnJvcigpIHtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICBhcmdzLnVuc2hpZnQoJ1JvbGxiYXI6Jyk7XG4gIGlmIChkZXRlY3Rpb24uaWVWZXJzaW9uKCkgPD0gOCkge1xuICAgIGNvbnNvbGUuZXJyb3IoXy5mb3JtYXRBcmdzQXNTdHJpbmcoYXJncykpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUuZXJyb3IuYXBwbHkoY29uc29sZSwgYXJncyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5mbygpIHtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICBhcmdzLnVuc2hpZnQoJ1JvbGxiYXI6Jyk7XG4gIGlmIChkZXRlY3Rpb24uaWVWZXJzaW9uKCkgPD0gOCkge1xuICAgIGNvbnNvbGUuaW5mbyhfLmZvcm1hdEFyZ3NBc1N0cmluZyhhcmdzKSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5pbmZvLmFwcGx5KGNvbnNvbGUsIGFyZ3MpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGxvZygpIHtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICBhcmdzLnVuc2hpZnQoJ1JvbGxiYXI6Jyk7XG4gIGlmIChkZXRlY3Rpb24uaWVWZXJzaW9uKCkgPD0gOCkge1xuICAgIGNvbnNvbGUubG9nKF8uZm9ybWF0QXJnc0FzU3RyaW5nKGFyZ3MpKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmdzKTtcbiAgfVxufVxuXG4vKiBlc2xpbnQtZW5hYmxlIG5vLWNvbnNvbGUgKi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGVycm9yOiBlcnJvcixcbiAgaW5mbzogaW5mbyxcbiAgbG9nOiBsb2csXG59O1xuIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsaXR5Jyk7XG52YXIgbWFrZUZldGNoUmVxdWVzdCA9IHJlcXVpcmUoJy4vdHJhbnNwb3J0L2ZldGNoJyk7XG52YXIgbWFrZVhoclJlcXVlc3QgPSByZXF1aXJlKCcuL3RyYW5zcG9ydC94aHInKTtcblxuLypcbiAqIGFjY2Vzc1Rva2VuIG1heSBiZSBlbWJlZGRlZCBpbiBwYXlsb2FkIGJ1dCB0aGF0IHNob3VsZCBub3RcbiAqICAgYmUgYXNzdW1lZFxuICpcbiAqIG9wdGlvbnM6IHtcbiAqICAgaG9zdG5hbWVcbiAqICAgcHJvdG9jb2xcbiAqICAgcGF0aFxuICogICBwb3J0XG4gKiAgIG1ldGhvZFxuICogICB0cmFuc3BvcnQgKCd4aHInIHwgJ2ZldGNoJylcbiAqIH1cbiAqXG4gKiAgcGFyYW1zIGlzIGFuIG9iamVjdCBjb250YWluaW5nIGtleS92YWx1ZSBwYWlycy4gVGhlc2VcbiAqICAgIHdpbGwgYmUgYXBwZW5kZWQgdG8gdGhlIHBhdGggYXMgJ2tleT12YWx1ZSZrZXk9dmFsdWUnXG4gKlxuICogcGF5bG9hZCBpcyBhbiB1bnNlcmlhbGl6ZWQgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIFRyYW5zcG9ydCh0cnVuY2F0aW9uKSB7XG4gIHRoaXMudHJ1bmNhdGlvbiA9IHRydW5jYXRpb247XG59XG5cblRyYW5zcG9ydC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKFxuICBhY2Nlc3NUb2tlbixcbiAgb3B0aW9ucyxcbiAgcGFyYW1zLFxuICBjYWxsYmFjayxcbiAgcmVxdWVzdEZhY3RvcnksXG4pIHtcbiAgaWYgKCFjYWxsYmFjayB8fCAhXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG4gIH1cbiAgXy5hZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aChhY2Nlc3NUb2tlbiwgb3B0aW9ucywgcGFyYW1zKTtcblxuICB2YXIgbWV0aG9kID0gJ0dFVCc7XG4gIHZhciB1cmwgPSBfLmZvcm1hdFVybChvcHRpb25zKTtcbiAgdGhpcy5fbWFrZVpvbmVSZXF1ZXN0KFxuICAgIGFjY2Vzc1Rva2VuLFxuICAgIHVybCxcbiAgICBtZXRob2QsXG4gICAgbnVsbCxcbiAgICBjYWxsYmFjayxcbiAgICByZXF1ZXN0RmFjdG9yeSxcbiAgICBvcHRpb25zLnRpbWVvdXQsXG4gICAgb3B0aW9ucy50cmFuc3BvcnQsXG4gICk7XG59O1xuXG5UcmFuc3BvcnQucHJvdG90eXBlLnBvc3QgPSBmdW5jdGlvbiAoXG4gIGFjY2Vzc1Rva2VuLFxuICBvcHRpb25zLFxuICBwYXlsb2FkLFxuICBjYWxsYmFjayxcbiAgcmVxdWVzdEZhY3RvcnksXG4pIHtcbiAgaWYgKCFjYWxsYmFjayB8fCAhXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG4gIH1cblxuICBpZiAoIXBheWxvYWQpIHtcbiAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKCdDYW5ub3Qgc2VuZCBlbXB0eSByZXF1ZXN0JykpO1xuICB9XG5cbiAgdmFyIHN0cmluZ2lmeVJlc3VsdDtcbiAgaWYgKHRoaXMudHJ1bmNhdGlvbikge1xuICAgIHN0cmluZ2lmeVJlc3VsdCA9IHRoaXMudHJ1bmNhdGlvbi50cnVuY2F0ZShwYXlsb2FkKTtcbiAgfSBlbHNlIHtcbiAgICBzdHJpbmdpZnlSZXN1bHQgPSBfLnN0cmluZ2lmeShwYXlsb2FkKTtcbiAgfVxuICBpZiAoc3RyaW5naWZ5UmVzdWx0LmVycm9yKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKHN0cmluZ2lmeVJlc3VsdC5lcnJvcik7XG4gIH1cblxuICB2YXIgd3JpdGVEYXRhID0gc3RyaW5naWZ5UmVzdWx0LnZhbHVlO1xuICB2YXIgbWV0aG9kID0gJ1BPU1QnO1xuICB2YXIgdXJsID0gXy5mb3JtYXRVcmwob3B0aW9ucyk7XG4gIHRoaXMuX21ha2Vab25lUmVxdWVzdChcbiAgICBhY2Nlc3NUb2tlbixcbiAgICB1cmwsXG4gICAgbWV0aG9kLFxuICAgIHdyaXRlRGF0YSxcbiAgICBjYWxsYmFjayxcbiAgICByZXF1ZXN0RmFjdG9yeSxcbiAgICBvcHRpb25zLnRpbWVvdXQsXG4gICAgb3B0aW9ucy50cmFuc3BvcnQsXG4gICk7XG59O1xuXG5UcmFuc3BvcnQucHJvdG90eXBlLnBvc3RKc29uUGF5bG9hZCA9IGZ1bmN0aW9uIChcbiAgYWNjZXNzVG9rZW4sXG4gIG9wdGlvbnMsXG4gIGpzb25QYXlsb2FkLFxuICBjYWxsYmFjayxcbiAgcmVxdWVzdEZhY3RvcnksXG4pIHtcbiAgaWYgKCFjYWxsYmFjayB8fCAhXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG4gIH1cblxuICB2YXIgbWV0aG9kID0gJ1BPU1QnO1xuICB2YXIgdXJsID0gXy5mb3JtYXRVcmwob3B0aW9ucyk7XG4gIHRoaXMuX21ha2Vab25lUmVxdWVzdChcbiAgICBhY2Nlc3NUb2tlbixcbiAgICB1cmwsXG4gICAgbWV0aG9kLFxuICAgIGpzb25QYXlsb2FkLFxuICAgIGNhbGxiYWNrLFxuICAgIHJlcXVlc3RGYWN0b3J5LFxuICAgIG9wdGlvbnMudGltZW91dCxcbiAgICBvcHRpb25zLnRyYW5zcG9ydCxcbiAgKTtcbn07XG5cbi8vIFdyYXBzIGBfbWFrZVJlcXVlc3RgIGlmIHpvbmUuanMgaXMgYmVpbmcgdXNlZCwgZW5zdXJpbmcgdGhhdCBSb2xsYmFyXG4vLyBBUEkgY2FsbHMgYXJlIG5vdCBpbnRlcmNlcHRlZCBieSBhbnkgY2hpbGQgZm9ya2VkIHpvbmVzLlxuLy8gVGhpcyBpcyBlcXVpdmFsZW50IHRvIGBOZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXJgIGluIEFuZ3VsYXIuXG5UcmFuc3BvcnQucHJvdG90eXBlLl9tYWtlWm9uZVJlcXVlc3QgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBnV2luZG93ID1cbiAgICAodHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cpIHx8XG4gICAgKHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYpO1xuICAvLyBXaGVuZXZlciB6b25lLmpzIGlzIGxvYWRlZCBhbmQgYFpvbmVgIGlzIGV4cG9zZWQgZ2xvYmFsbHksIGFjY2Vzc1xuICAvLyB0aGUgcm9vdCB6b25lIHRvIGVuc3VyZSB0aGF0IHJlcXVlc3RzIGFyZSBhbHdheXMgbWFkZSB3aXRoaW4gaXQuXG4gIC8vIFRoaXMgYXBwcm9hY2ggaXMgZnJhbWV3b3JrLWFnbm9zdGljLCByZWdhcmRsZXNzIG9mIHdoaWNoXG4gIC8vIGZyYW1ld29yayB6b25lLmpzIGlzIHVzZWQgd2l0aC5cbiAgdmFyIHJvb3Rab25lID0gZ1dpbmRvdyAmJiBnV2luZG93LlpvbmUgJiYgZ1dpbmRvdy5ab25lLnJvb3Q7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICBpZiAocm9vdFpvbmUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcm9vdFpvbmUucnVuKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX21ha2VSZXF1ZXN0LmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fbWFrZVJlcXVlc3QuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgfVxufTtcblxuVHJhbnNwb3J0LnByb3RvdHlwZS5fbWFrZVJlcXVlc3QgPSBmdW5jdGlvbiAoXG4gIGFjY2Vzc1Rva2VuLFxuICB1cmwsXG4gIG1ldGhvZCxcbiAgZGF0YSxcbiAgY2FsbGJhY2ssXG4gIHJlcXVlc3RGYWN0b3J5LFxuICB0aW1lb3V0LFxuICB0cmFuc3BvcnQsXG4pIHtcbiAgaWYgKHR5cGVvZiBSb2xsYmFyUHJveHkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIF9wcm94eVJlcXVlc3QoZGF0YSwgY2FsbGJhY2spO1xuICB9XG5cbiAgaWYgKHRyYW5zcG9ydCA9PT0gJ2ZldGNoJykge1xuICAgIG1ha2VGZXRjaFJlcXVlc3QoYWNjZXNzVG9rZW4sIHVybCwgbWV0aG9kLCBkYXRhLCBjYWxsYmFjaywgdGltZW91dCk7XG4gIH0gZWxzZSB7XG4gICAgbWFrZVhoclJlcXVlc3QoXG4gICAgICBhY2Nlc3NUb2tlbixcbiAgICAgIHVybCxcbiAgICAgIG1ldGhvZCxcbiAgICAgIGRhdGEsXG4gICAgICBjYWxsYmFjayxcbiAgICAgIHJlcXVlc3RGYWN0b3J5LFxuICAgICAgdGltZW91dCxcbiAgICApO1xuICB9XG59O1xuXG4vKiBnbG9iYWwgUm9sbGJhclByb3h5ICovXG5mdW5jdGlvbiBfcHJveHlSZXF1ZXN0KGpzb24sIGNhbGxiYWNrKSB7XG4gIHZhciByb2xsYmFyUHJveHkgPSBuZXcgUm9sbGJhclByb3h5KCk7XG4gIHJvbGxiYXJQcm94eS5zZW5kSnNvblBheWxvYWQoXG4gICAganNvbixcbiAgICBmdW5jdGlvbiAoX21zZykge1xuICAgICAgLyogZG8gbm90aGluZyAqL1xuICAgIH0sIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBjYWxsYmFjayhuZXcgRXJyb3IoZXJyKSk7XG4gICAgfSxcbiAgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUcmFuc3BvcnQ7XG4iLCJ2YXIgbG9nZ2VyID0gcmVxdWlyZSgnLi4vbG9nZ2VyJyk7XG52YXIgXyA9IHJlcXVpcmUoJy4uLy4uL3V0aWxpdHknKTtcblxuZnVuY3Rpb24gbWFrZUZldGNoUmVxdWVzdChhY2Nlc3NUb2tlbiwgdXJsLCBtZXRob2QsIGRhdGEsIGNhbGxiYWNrLCB0aW1lb3V0KSB7XG4gIHZhciBjb250cm9sbGVyO1xuICB2YXIgdGltZW91dElkO1xuXG4gIGlmIChfLmlzRmluaXRlTnVtYmVyKHRpbWVvdXQpKSB7XG4gICAgY29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnRyb2xsZXIuYWJvcnQoKTtcbiAgICB9LCB0aW1lb3V0KTtcbiAgfVxuXG4gIGZldGNoKHVybCwge1xuICAgIG1ldGhvZDogbWV0aG9kLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAnWC1Sb2xsYmFyLUFjY2Vzcy1Ub2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgc2lnbmFsOiBjb250cm9sbGVyICYmIGNvbnRyb2xsZXIuc2lnbmFsLFxuICAgIH0sXG4gICAgYm9keTogZGF0YSxcbiAgfSlcbiAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGlmICh0aW1lb3V0SWQpIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICB9KVxuICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICBjYWxsYmFjayhudWxsLCBkYXRhKTtcbiAgICB9KVxuICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihlcnJvci5tZXNzYWdlKTtcbiAgICAgIGNhbGxiYWNrKGVycm9yKTtcbiAgICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYWtlRmV0Y2hSZXF1ZXN0O1xuIiwiLypnbG9iYWwgWERvbWFpblJlcXVlc3QqL1xuXG52YXIgXyA9IHJlcXVpcmUoJy4uLy4uL3V0aWxpdHknKTtcbnZhciBsb2dnZXIgPSByZXF1aXJlKCcuLi9sb2dnZXInKTtcblxuZnVuY3Rpb24gbWFrZVhoclJlcXVlc3QoXG4gIGFjY2Vzc1Rva2VuLFxuICB1cmwsXG4gIG1ldGhvZCxcbiAgZGF0YSxcbiAgY2FsbGJhY2ssXG4gIHJlcXVlc3RGYWN0b3J5LFxuICB0aW1lb3V0LFxuKSB7XG4gIHZhciByZXF1ZXN0O1xuICBpZiAocmVxdWVzdEZhY3RvcnkpIHtcbiAgICByZXF1ZXN0ID0gcmVxdWVzdEZhY3RvcnkoKTtcbiAgfSBlbHNlIHtcbiAgICByZXF1ZXN0ID0gX2NyZWF0ZVhNTEhUVFBPYmplY3QoKTtcbiAgfVxuICBpZiAoIXJlcXVlc3QpIHtcbiAgICAvLyBHaXZlIHVwLCBubyB3YXkgdG8gc2VuZCByZXF1ZXN0c1xuICAgIHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IoJ05vIHdheSB0byBzZW5kIGEgcmVxdWVzdCcpKTtcbiAgfVxuICB0cnkge1xuICAgIHRyeSB7XG4gICAgICB2YXIgb25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChvbnJlYWR5c3RhdGVjaGFuZ2UgJiYgcmVxdWVzdC5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgICBvbnJlYWR5c3RhdGVjaGFuZ2UgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIHZhciBwYXJzZVJlc3BvbnNlID0gXy5qc29uUGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgaWYgKF9pc1N1Y2Nlc3MocmVxdWVzdCkpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2socGFyc2VSZXNwb25zZS5lcnJvciwgcGFyc2VSZXNwb25zZS52YWx1ZSk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoX2lzTm9ybWFsRmFpbHVyZShyZXF1ZXN0KSkge1xuICAgICAgICAgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDQwMykge1xuICAgICAgICAgICAgICAgIC8vIGxpa2VseSBjYXVzZWQgYnkgdXNpbmcgYSBzZXJ2ZXIgYWNjZXNzIHRva2VuXG4gICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPVxuICAgICAgICAgICAgICAgICAgcGFyc2VSZXNwb25zZS52YWx1ZSAmJiBwYXJzZVJlc3BvbnNlLnZhbHVlLm1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIHJldHVybiB2YWxpZCBodHRwIHN0YXR1cyBjb2Rlc1xuICAgICAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoU3RyaW5nKHJlcXVlc3Quc3RhdHVzKSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gSUUgd2lsbCByZXR1cm4gYSBzdGF0dXMgMTIwMDArIG9uIHNvbWUgc29ydCBvZiBjb25uZWN0aW9uIGZhaWx1cmUsXG4gICAgICAgICAgICAgIC8vIHNvIHdlIHJldHVybiBhIGJsYW5rIGVycm9yXG4gICAgICAgICAgICAgIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9hYTM4Mzc3MCUyOFZTLjg1JTI5LmFzcHhcbiAgICAgICAgICAgICAgdmFyIG1zZyA9XG4gICAgICAgICAgICAgICAgJ1hIUiByZXNwb25zZSBoYWQgbm8gc3RhdHVzIGNvZGUgKGxpa2VseSBjb25uZWN0aW9uIGZhaWx1cmUpJztcbiAgICAgICAgICAgICAgY2FsbGJhY2soX25ld1JldHJpYWJsZUVycm9yKG1zZykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAvL2pxdWVyeSBzb3VyY2UgbWVudGlvbnMgZmlyZWZveCBtYXkgZXJyb3Igb3V0IHdoaWxlIGFjY2Vzc2luZyB0aGVcbiAgICAgICAgICAvL3JlcXVlc3QgbWVtYmVycyBpZiB0aGVyZSBpcyBhIG5ldHdvcmsgZXJyb3JcbiAgICAgICAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnkvanF1ZXJ5L2Jsb2IvYTkzOGQ3YjEyODJmYzBlNWM1MjUwMmMyMjVhZThmMGNlZjIxOWYwYS9zcmMvYWpheC94aHIuanMjTDExMVxuICAgICAgICAgIHZhciBleGM7XG4gICAgICAgICAgaWYgKGV4ICYmIGV4LnN0YWNrKSB7XG4gICAgICAgICAgICBleGMgPSBleDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhjID0gbmV3IEVycm9yKGV4KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FsbGJhY2soZXhjKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmVxdWVzdC5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcbiAgICAgIGlmIChyZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIpIHtcbiAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ1gtUm9sbGJhci1BY2Nlc3MtVG9rZW4nLCBhY2Nlc3NUb2tlbik7XG4gICAgICB9XG5cbiAgICAgIGlmIChfLmlzRmluaXRlTnVtYmVyKHRpbWVvdXQpKSB7XG4gICAgICAgIHJlcXVlc3QudGltZW91dCA9IHRpbWVvdXQ7XG4gICAgICB9XG5cbiAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gb25yZWFkeXN0YXRlY2hhbmdlO1xuICAgICAgcmVxdWVzdC5zZW5kKGRhdGEpO1xuICAgIH0gY2F0Y2ggKGUxKSB7XG4gICAgICAvLyBTZW5kaW5nIHVzaW5nIHRoZSBub3JtYWwgeG1saHR0cHJlcXVlc3Qgb2JqZWN0IGRpZG4ndCB3b3JrLCB0cnkgWERvbWFpblJlcXVlc3RcbiAgICAgIGlmICh0eXBlb2YgWERvbWFpblJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIEFzc3VtZSB3ZSBhcmUgaW4gYSByZWFsbHkgb2xkIGJyb3dzZXIgd2hpY2ggaGFzIGEgYnVuY2ggb2YgbGltaXRhdGlvbnM6XG4gICAgICAgIC8vIGh0dHA6Ly9ibG9ncy5tc2RuLmNvbS9iL2llaW50ZXJuYWxzL2FyY2hpdmUvMjAxMC8wNS8xMy94ZG9tYWlucmVxdWVzdC1yZXN0cmljdGlvbnMtbGltaXRhdGlvbnMtYW5kLXdvcmthcm91bmRzLmFzcHhcblxuICAgICAgICAvLyBFeHRyZW1lIHBhcmFub2lhOiBpZiB3ZSBoYXZlIFhEb21haW5SZXF1ZXN0IHRoZW4gd2UgaGF2ZSBhIHdpbmRvdywgYnV0IGp1c3QgaW4gY2FzZVxuICAgICAgICBpZiAoIXdpbmRvdyB8fCAhd2luZG93LmxvY2F0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKFxuICAgICAgICAgICAgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAnTm8gd2luZG93IGF2YWlsYWJsZSBkdXJpbmcgcmVxdWVzdCwgdW5rbm93biBlbnZpcm9ubWVudCcsXG4gICAgICAgICAgICApLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGUgY3VycmVudCBwYWdlIGlzIGh0dHAsIHRyeSBhbmQgc2VuZCBvdmVyIGh0dHBcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmLnN1YnN0cmluZygwLCA1KSA9PT0gJ2h0dHA6JyAmJlxuICAgICAgICAgIHVybC5zdWJzdHJpbmcoMCwgNSkgPT09ICdodHRwcydcbiAgICAgICAgKSB7XG4gICAgICAgICAgdXJsID0gJ2h0dHAnICsgdXJsLnN1YnN0cmluZyg1KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB4ZG9tYWlucmVxdWVzdCA9IG5ldyBYRG9tYWluUmVxdWVzdCgpO1xuICAgICAgICB4ZG9tYWlucmVxdWVzdC5vbnByb2dyZXNzID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgIHhkb21haW5yZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgbXNnID0gJ1JlcXVlc3QgdGltZWQgb3V0JztcbiAgICAgICAgICB2YXIgY29kZSA9ICdFVElNRURPVVQnO1xuICAgICAgICAgIGNhbGxiYWNrKF9uZXdSZXRyaWFibGVFcnJvcihtc2csIGNvZGUpKTtcbiAgICAgICAgfTtcbiAgICAgICAgeGRvbWFpbnJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoJ0Vycm9yIGR1cmluZyByZXF1ZXN0JykpO1xuICAgICAgICB9O1xuICAgICAgICB4ZG9tYWlucmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIHBhcnNlUmVzcG9uc2UgPSBfLmpzb25QYXJzZSh4ZG9tYWlucmVxdWVzdC5yZXNwb25zZVRleHQpO1xuICAgICAgICAgIGNhbGxiYWNrKHBhcnNlUmVzcG9uc2UuZXJyb3IsIHBhcnNlUmVzcG9uc2UudmFsdWUpO1xuICAgICAgICB9O1xuICAgICAgICB4ZG9tYWlucmVxdWVzdC5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcbiAgICAgICAgeGRvbWFpbnJlcXVlc3Quc2VuZChkYXRhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcignQ2Fubm90IGZpbmQgYSBtZXRob2QgdG8gdHJhbnNwb3J0IGEgcmVxdWVzdCcpKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGUyKSB7XG4gICAgY2FsbGJhY2soZTIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVYTUxIVFRQT2JqZWN0KCkge1xuICAvKiBnbG9iYWwgQWN0aXZlWE9iamVjdDpmYWxzZSAqL1xuXG4gIHZhciBmYWN0b3JpZXMgPSBbXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIH0sXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUCcpO1xuICAgIH0sXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDMuWE1MSFRUUCcpO1xuICAgIH0sXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpO1xuICAgIH0sXG4gIF07XG4gIHZhciB4bWxodHRwO1xuICB2YXIgaTtcbiAgdmFyIG51bUZhY3RvcmllcyA9IGZhY3Rvcmllcy5sZW5ndGg7XG4gIGZvciAoaSA9IDA7IGkgPCBudW1GYWN0b3JpZXM7IGkrKykge1xuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWVtcHR5ICovXG4gICAgdHJ5IHtcbiAgICAgIHhtbGh0dHAgPSBmYWN0b3JpZXNbaV0oKTtcbiAgICAgIGJyZWFrO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIHBhc3NcbiAgICB9XG4gICAgLyogZXNsaW50LWVuYWJsZSBuby1lbXB0eSAqL1xuICB9XG4gIHJldHVybiB4bWxodHRwO1xufVxuXG5mdW5jdGlvbiBfaXNTdWNjZXNzKHIpIHtcbiAgcmV0dXJuIHIgJiYgci5zdGF0dXMgJiYgci5zdGF0dXMgPT09IDIwMDtcbn1cblxuZnVuY3Rpb24gX2lzTm9ybWFsRmFpbHVyZShyKSB7XG4gIHJldHVybiByICYmIF8uaXNUeXBlKHIuc3RhdHVzLCAnbnVtYmVyJykgJiYgci5zdGF0dXMgPj0gNDAwICYmIHIuc3RhdHVzIDwgNjAwO1xufVxuXG5mdW5jdGlvbiBfbmV3UmV0cmlhYmxlRXJyb3IobWVzc2FnZSwgY29kZSkge1xuICB2YXIgZXJyID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICBlcnIuY29kZSA9IGNvZGUgfHwgJ0VOT1RGT1VORCc7XG4gIHJldHVybiBlcnI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFrZVhoclJlcXVlc3Q7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxudmFyIGlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iaikge1xuICBpZiAoIW9iaiB8fCB0b1N0ci5jYWxsKG9iaikgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGhhc093bkNvbnN0cnVjdG9yID0gaGFzT3duLmNhbGwob2JqLCAnY29uc3RydWN0b3InKTtcbiAgdmFyIGhhc0lzUHJvdG90eXBlT2YgPVxuICAgIG9iai5jb25zdHJ1Y3RvciAmJlxuICAgIG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgJiZcbiAgICBoYXNPd24uY2FsbChvYmouY29uc3RydWN0b3IucHJvdG90eXBlLCAnaXNQcm90b3R5cGVPZicpO1xuICAvLyBOb3Qgb3duIGNvbnN0cnVjdG9yIHByb3BlcnR5IG11c3QgYmUgT2JqZWN0XG4gIGlmIChvYmouY29uc3RydWN0b3IgJiYgIWhhc093bkNvbnN0cnVjdG9yICYmICFoYXNJc1Byb3RvdHlwZU9mKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gT3duIHByb3BlcnRpZXMgYXJlIGVudW1lcmF0ZWQgZmlyc3RseSwgc28gdG8gc3BlZWQgdXAsXG4gIC8vIGlmIGxhc3Qgb25lIGlzIG93biwgdGhlbiBhbGwgcHJvcGVydGllcyBhcmUgb3duLlxuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAvKiovXG4gIH1cblxuICByZXR1cm4gdHlwZW9mIGtleSA9PT0gJ3VuZGVmaW5lZCcgfHwgaGFzT3duLmNhbGwob2JqLCBrZXkpO1xufTtcblxuZnVuY3Rpb24gbWVyZ2UoKSB7XG4gIHZhciBpLFxuICAgIHNyYyxcbiAgICBjb3B5LFxuICAgIGNsb25lLFxuICAgIG5hbWUsXG4gICAgcmVzdWx0ID0ge30sXG4gICAgY3VycmVudCA9IG51bGwsXG4gICAgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcblxuICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBjdXJyZW50ID0gYXJndW1lbnRzW2ldO1xuICAgIGlmIChjdXJyZW50ID09IG51bGwpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGZvciAobmFtZSBpbiBjdXJyZW50KSB7XG4gICAgICBzcmMgPSByZXN1bHRbbmFtZV07XG4gICAgICBjb3B5ID0gY3VycmVudFtuYW1lXTtcbiAgICAgIGlmIChyZXN1bHQgIT09IGNvcHkpIHtcbiAgICAgICAgaWYgKGNvcHkgJiYgaXNQbGFpbk9iamVjdChjb3B5KSkge1xuICAgICAgICAgIGNsb25lID0gc3JjICYmIGlzUGxhaW5PYmplY3Qoc3JjKSA/IHNyYyA6IHt9O1xuICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IG1lcmdlKGNsb25lLCBjb3B5KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY29weSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZXN1bHRbbmFtZV0gPSBjb3B5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWVyZ2U7XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbGl0eScpO1xudmFyIHRyYXZlcnNlID0gcmVxdWlyZSgnLi91dGlsaXR5L3RyYXZlcnNlJyk7XG5cbmZ1bmN0aW9uIHJhdyhwYXlsb2FkLCBqc29uQmFja3VwKSB7XG4gIHJldHVybiBbcGF5bG9hZCwgXy5zdHJpbmdpZnkocGF5bG9hZCwganNvbkJhY2t1cCldO1xufVxuXG5mdW5jdGlvbiBzZWxlY3RGcmFtZXMoZnJhbWVzLCByYW5nZSkge1xuICB2YXIgbGVuID0gZnJhbWVzLmxlbmd0aDtcbiAgaWYgKGxlbiA+IHJhbmdlICogMikge1xuICAgIHJldHVybiBmcmFtZXMuc2xpY2UoMCwgcmFuZ2UpLmNvbmNhdChmcmFtZXMuc2xpY2UobGVuIC0gcmFuZ2UpKTtcbiAgfVxuICByZXR1cm4gZnJhbWVzO1xufVxuXG5mdW5jdGlvbiB0cnVuY2F0ZUZyYW1lcyhwYXlsb2FkLCBqc29uQmFja3VwLCByYW5nZSkge1xuICByYW5nZSA9IHR5cGVvZiByYW5nZSA9PT0gJ3VuZGVmaW5lZCcgPyAzMCA6IHJhbmdlO1xuICB2YXIgYm9keSA9IHBheWxvYWQuZGF0YS5ib2R5O1xuICB2YXIgZnJhbWVzO1xuICBpZiAoYm9keS50cmFjZV9jaGFpbikge1xuICAgIHZhciBjaGFpbiA9IGJvZHkudHJhY2VfY2hhaW47XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGFpbi5sZW5ndGg7IGkrKykge1xuICAgICAgZnJhbWVzID0gY2hhaW5baV0uZnJhbWVzO1xuICAgICAgZnJhbWVzID0gc2VsZWN0RnJhbWVzKGZyYW1lcywgcmFuZ2UpO1xuICAgICAgY2hhaW5baV0uZnJhbWVzID0gZnJhbWVzO1xuICAgIH1cbiAgfSBlbHNlIGlmIChib2R5LnRyYWNlKSB7XG4gICAgZnJhbWVzID0gYm9keS50cmFjZS5mcmFtZXM7XG4gICAgZnJhbWVzID0gc2VsZWN0RnJhbWVzKGZyYW1lcywgcmFuZ2UpO1xuICAgIGJvZHkudHJhY2UuZnJhbWVzID0gZnJhbWVzO1xuICB9XG4gIHJldHVybiBbcGF5bG9hZCwgXy5zdHJpbmdpZnkocGF5bG9hZCwganNvbkJhY2t1cCldO1xufVxuXG5mdW5jdGlvbiBtYXliZVRydW5jYXRlVmFsdWUobGVuLCB2YWwpIHtcbiAgaWYgKCF2YWwpIHtcbiAgICByZXR1cm4gdmFsO1xuICB9XG4gIGlmICh2YWwubGVuZ3RoID4gbGVuKSB7XG4gICAgcmV0dXJuIHZhbC5zbGljZSgwLCBsZW4gLSAzKS5jb25jYXQoJy4uLicpO1xuICB9XG4gIHJldHVybiB2YWw7XG59XG5cbmZ1bmN0aW9uIHRydW5jYXRlU3RyaW5ncyhsZW4sIHBheWxvYWQsIGpzb25CYWNrdXApIHtcbiAgZnVuY3Rpb24gdHJ1bmNhdG9yKGssIHYsIHNlZW4pIHtcbiAgICBzd2l0Y2ggKF8udHlwZU5hbWUodikpIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIHJldHVybiBtYXliZVRydW5jYXRlVmFsdWUobGVuLCB2KTtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICBjYXNlICdhcnJheSc6XG4gICAgICAgIHJldHVybiB0cmF2ZXJzZSh2LCB0cnVuY2F0b3IsIHNlZW4pO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfVxuICB9XG4gIHBheWxvYWQgPSB0cmF2ZXJzZShwYXlsb2FkLCB0cnVuY2F0b3IpO1xuICByZXR1cm4gW3BheWxvYWQsIF8uc3RyaW5naWZ5KHBheWxvYWQsIGpzb25CYWNrdXApXTtcbn1cblxuZnVuY3Rpb24gdHJ1bmNhdGVUcmFjZURhdGEodHJhY2VEYXRhKSB7XG4gIGlmICh0cmFjZURhdGEuZXhjZXB0aW9uKSB7XG4gICAgZGVsZXRlIHRyYWNlRGF0YS5leGNlcHRpb24uZGVzY3JpcHRpb247XG4gICAgdHJhY2VEYXRhLmV4Y2VwdGlvbi5tZXNzYWdlID0gbWF5YmVUcnVuY2F0ZVZhbHVlKFxuICAgICAgMjU1LFxuICAgICAgdHJhY2VEYXRhLmV4Y2VwdGlvbi5tZXNzYWdlLFxuICAgICk7XG4gIH1cbiAgdHJhY2VEYXRhLmZyYW1lcyA9IHNlbGVjdEZyYW1lcyh0cmFjZURhdGEuZnJhbWVzLCAxKTtcbiAgcmV0dXJuIHRyYWNlRGF0YTtcbn1cblxuZnVuY3Rpb24gbWluQm9keShwYXlsb2FkLCBqc29uQmFja3VwKSB7XG4gIHZhciBib2R5ID0gcGF5bG9hZC5kYXRhLmJvZHk7XG4gIGlmIChib2R5LnRyYWNlX2NoYWluKSB7XG4gICAgdmFyIGNoYWluID0gYm9keS50cmFjZV9jaGFpbjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYWluLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGFpbltpXSA9IHRydW5jYXRlVHJhY2VEYXRhKGNoYWluW2ldKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoYm9keS50cmFjZSkge1xuICAgIGJvZHkudHJhY2UgPSB0cnVuY2F0ZVRyYWNlRGF0YShib2R5LnRyYWNlKTtcbiAgfVxuICByZXR1cm4gW3BheWxvYWQsIF8uc3RyaW5naWZ5KHBheWxvYWQsIGpzb25CYWNrdXApXTtcbn1cblxuZnVuY3Rpb24gbmVlZHNUcnVuY2F0aW9uKHBheWxvYWQsIG1heFNpemUpIHtcbiAgcmV0dXJuIF8ubWF4Qnl0ZVNpemUocGF5bG9hZCkgPiBtYXhTaXplO1xufVxuXG5mdW5jdGlvbiB0cnVuY2F0ZShwYXlsb2FkLCBqc29uQmFja3VwLCBtYXhTaXplKSB7XG4gIG1heFNpemUgPSB0eXBlb2YgbWF4U2l6ZSA9PT0gJ3VuZGVmaW5lZCcgPyA1MTIgKiAxMDI0IDogbWF4U2l6ZTtcbiAgdmFyIHN0cmF0ZWdpZXMgPSBbXG4gICAgcmF3LFxuICAgIHRydW5jYXRlRnJhbWVzLFxuICAgIHRydW5jYXRlU3RyaW5ncy5iaW5kKG51bGwsIDEwMjQpLFxuICAgIHRydW5jYXRlU3RyaW5ncy5iaW5kKG51bGwsIDUxMiksXG4gICAgdHJ1bmNhdGVTdHJpbmdzLmJpbmQobnVsbCwgMjU2KSxcbiAgICBtaW5Cb2R5LFxuICBdO1xuICB2YXIgc3RyYXRlZ3ksIHJlc3VsdHMsIHJlc3VsdDtcblxuICB3aGlsZSAoKHN0cmF0ZWd5ID0gc3RyYXRlZ2llcy5zaGlmdCgpKSkge1xuICAgIHJlc3VsdHMgPSBzdHJhdGVneShwYXlsb2FkLCBqc29uQmFja3VwKTtcbiAgICBwYXlsb2FkID0gcmVzdWx0c1swXTtcbiAgICByZXN1bHQgPSByZXN1bHRzWzFdO1xuICAgIGlmIChyZXN1bHQuZXJyb3IgfHwgIW5lZWRzVHJ1bmNhdGlvbihyZXN1bHQudmFsdWUsIG1heFNpemUpKSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdHJ1bmNhdGU6IHRydW5jYXRlLFxuXG4gIC8qIGZvciB0ZXN0aW5nICovXG4gIHJhdzogcmF3LFxuICB0cnVuY2F0ZUZyYW1lczogdHJ1bmNhdGVGcmFtZXMsXG4gIHRydW5jYXRlU3RyaW5nczogdHJ1bmNhdGVTdHJpbmdzLFxuICBtYXliZVRydW5jYXRlVmFsdWU6IG1heWJlVHJ1bmNhdGVWYWx1ZSxcbn07XG4iLCJ2YXIgbWVyZ2UgPSByZXF1aXJlKCcuL21lcmdlJyk7XG5cbnZhciBSb2xsYmFySlNPTiA9IHt9O1xuZnVuY3Rpb24gc2V0dXBKU09OKHBvbHlmaWxsSlNPTikge1xuICBpZiAoaXNGdW5jdGlvbihSb2xsYmFySlNPTi5zdHJpbmdpZnkpICYmIGlzRnVuY3Rpb24oUm9sbGJhckpTT04ucGFyc2UpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGlzRGVmaW5lZChKU09OKSkge1xuICAgIC8vIElmIHBvbHlmaWxsIGlzIHByb3ZpZGVkLCBwcmVmZXIgaXQgb3ZlciBleGlzdGluZyBub24tbmF0aXZlIHNoaW1zLlxuICAgIGlmIChwb2x5ZmlsbEpTT04pIHtcbiAgICAgIGlmIChpc05hdGl2ZUZ1bmN0aW9uKEpTT04uc3RyaW5naWZ5KSkge1xuICAgICAgICBSb2xsYmFySlNPTi5zdHJpbmdpZnkgPSBKU09OLnN0cmluZ2lmeTtcbiAgICAgIH1cbiAgICAgIGlmIChpc05hdGl2ZUZ1bmN0aW9uKEpTT04ucGFyc2UpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnBhcnNlID0gSlNPTi5wYXJzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZWxzZSBhY2NlcHQgYW55IGludGVyZmFjZSB0aGF0IGlzIHByZXNlbnQuXG4gICAgICBpZiAoaXNGdW5jdGlvbihKU09OLnN0cmluZ2lmeSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04uc3RyaW5naWZ5ID0gSlNPTi5zdHJpbmdpZnk7XG4gICAgICB9XG4gICAgICBpZiAoaXNGdW5jdGlvbihKU09OLnBhcnNlKSkge1xuICAgICAgICBSb2xsYmFySlNPTi5wYXJzZSA9IEpTT04ucGFyc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICghaXNGdW5jdGlvbihSb2xsYmFySlNPTi5zdHJpbmdpZnkpIHx8ICFpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnBhcnNlKSkge1xuICAgIHBvbHlmaWxsSlNPTiAmJiBwb2x5ZmlsbEpTT04oUm9sbGJhckpTT04pO1xuICB9XG59XG5cbi8qXG4gKiBpc1R5cGUgLSBHaXZlbiBhIEphdmFzY3JpcHQgdmFsdWUgYW5kIGEgc3RyaW5nLCByZXR1cm5zIHRydWUgaWYgdGhlIHR5cGUgb2YgdGhlIHZhbHVlIG1hdGNoZXMgdGhlXG4gKiBnaXZlbiBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHggLSBhbnkgdmFsdWVcbiAqIEBwYXJhbSB0IC0gYSBsb3dlcmNhc2Ugc3RyaW5nIGNvbnRhaW5pbmcgb25lIG9mIHRoZSBmb2xsb3dpbmcgdHlwZSBuYW1lczpcbiAqICAgIC0gdW5kZWZpbmVkXG4gKiAgICAtIG51bGxcbiAqICAgIC0gZXJyb3JcbiAqICAgIC0gbnVtYmVyXG4gKiAgICAtIGJvb2xlYW5cbiAqICAgIC0gc3RyaW5nXG4gKiAgICAtIHN5bWJvbFxuICogICAgLSBmdW5jdGlvblxuICogICAgLSBvYmplY3RcbiAqICAgIC0gYXJyYXlcbiAqIEByZXR1cm5zIHRydWUgaWYgeCBpcyBvZiB0eXBlIHQsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1R5cGUoeCwgdCkge1xuICByZXR1cm4gdCA9PT0gdHlwZU5hbWUoeCk7XG59XG5cbi8qXG4gKiB0eXBlTmFtZSAtIEdpdmVuIGEgSmF2YXNjcmlwdCB2YWx1ZSwgcmV0dXJucyB0aGUgdHlwZSBvZiB0aGUgb2JqZWN0IGFzIGEgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIHR5cGVOYW1lKHgpIHtcbiAgdmFyIG5hbWUgPSB0eXBlb2YgeDtcbiAgaWYgKG5hbWUgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG5hbWU7XG4gIH1cbiAgaWYgKCF4KSB7XG4gICAgcmV0dXJuICdudWxsJztcbiAgfVxuICBpZiAoeCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgcmV0dXJuICdlcnJvcic7XG4gIH1cbiAgcmV0dXJuIHt9LnRvU3RyaW5nXG4gICAgLmNhbGwoeClcbiAgICAubWF0Y2goL1xccyhbYS16QS1aXSspLylbMV1cbiAgICAudG9Mb3dlckNhc2UoKTtcbn1cblxuLyogaXNGdW5jdGlvbiAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgYSBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSBmIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGYgaXMgYSBmdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oZikge1xuICByZXR1cm4gaXNUeXBlKGYsICdmdW5jdGlvbicpO1xufVxuXG4vKiBpc05hdGl2ZUZ1bmN0aW9uIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBhIG5hdGl2ZSBKUyBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSBmIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGYgaXMgYSBuYXRpdmUgSlMgZnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc05hdGl2ZUZ1bmN0aW9uKGYpIHtcbiAgdmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcbiAgdmFyIGZ1bmNNYXRjaFN0cmluZyA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZ1xuICAgIC5jYWxsKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkpXG4gICAgLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/Jyk7XG4gIHZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArIGZ1bmNNYXRjaFN0cmluZyArICckJyk7XG4gIHJldHVybiBpc09iamVjdChmKSAmJiByZUlzTmF0aXZlLnRlc3QoZik7XG59XG5cbi8qIGlzT2JqZWN0IC0gQ2hlY2tzIGlmIHRoZSBhcmd1bWVudCBpcyBhbiBvYmplY3RcbiAqXG4gKiBAcGFyYW0gdmFsdWUgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaXMgdmFsdWUgaXMgYW4gb2JqZWN0IGZ1bmN0aW9uIGlzIGFuIG9iamVjdClcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qIGlzU3RyaW5nIC0gQ2hlY2tzIGlmIHRoZSBhcmd1bWVudCBpcyBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB2YWx1ZSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiB2YWx1ZSBpcyBhIHN0cmluZ1xuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZztcbn1cblxuLyoqXG4gKiBpc0Zpbml0ZU51bWJlciAtIGRldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIGEgZmluaXRlIG51bWJlclxuICpcbiAqIEBwYXJhbSB7Kn0gbiAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiB2YWx1ZSBpcyBhIGZpbml0ZSBudW1iZXJcbiAqL1xuZnVuY3Rpb24gaXNGaW5pdGVOdW1iZXIobikge1xuICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKG4pO1xufVxuXG4vKlxuICogaXNEZWZpbmVkIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBub3QgZXF1YWwgdG8gdW5kZWZpbmVkXG4gKlxuICogQHBhcmFtIHUgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgdSBpcyBhbnl0aGluZyBvdGhlciB0aGFuIHVuZGVmaW5lZFxuICovXG5mdW5jdGlvbiBpc0RlZmluZWQodSkge1xuICByZXR1cm4gIWlzVHlwZSh1LCAndW5kZWZpbmVkJyk7XG59XG5cbi8qXG4gKiBpc0l0ZXJhYmxlIC0gY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgY2FuIGJlIGl0ZXJhdGVkLCBlc3NlbnRpYWxseVxuICogd2hldGhlciBpdCBpcyBhbiBvYmplY3Qgb3IgYW4gYXJyYXkuXG4gKlxuICogQHBhcmFtIGkgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgaSBpcyBhbiBvYmplY3Qgb3IgYW4gYXJyYXkgYXMgZGV0ZXJtaW5lZCBieSBgdHlwZU5hbWVgXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmFibGUoaSkge1xuICB2YXIgdHlwZSA9IHR5cGVOYW1lKGkpO1xuICByZXR1cm4gdHlwZSA9PT0gJ29iamVjdCcgfHwgdHlwZSA9PT0gJ2FycmF5Jztcbn1cblxuLypcbiAqIGlzRXJyb3IgLSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBvZiBhbiBlcnJvciB0eXBlXG4gKlxuICogQHBhcmFtIGUgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZSBpcyBhbiBlcnJvclxuICovXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgLy8gRGV0ZWN0IGJvdGggRXJyb3IgYW5kIEZpcmVmb3ggRXhjZXB0aW9uIHR5cGVcbiAgcmV0dXJuIGlzVHlwZShlLCAnZXJyb3InKSB8fCBpc1R5cGUoZSwgJ2V4Y2VwdGlvbicpO1xufVxuXG4vKiBpc1Byb21pc2UgLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIGEgcHJvbWlzZVxuICpcbiAqIEBwYXJhbSBwIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGYgaXMgYSBmdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzUHJvbWlzZShwKSB7XG4gIHJldHVybiBpc09iamVjdChwKSAmJiBpc1R5cGUocC50aGVuLCAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBpc0Jyb3dzZXIgLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiB0aGUgY29kZSBpcyBydW5uaW5nIGluIGEgYnJvd3NlclxuICpcbiAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGNvZGUgaXMgcnVubmluZyBpbiBhIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAqL1xuZnVuY3Rpb24gaXNCcm93c2VyKCkge1xuICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG59XG5cbmZ1bmN0aW9uIHJlZGFjdCgpIHtcbiAgcmV0dXJuICcqKioqKioqKic7XG59XG5cbi8vIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvODgwOTQ3Mi8xMTM4MTkxXG5mdW5jdGlvbiB1dWlkNCgpIHtcbiAgdmFyIGQgPSBub3coKTtcbiAgdmFyIHV1aWQgPSAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKFxuICAgIC9beHldL2csXG4gICAgZnVuY3Rpb24gKGMpIHtcbiAgICAgIHZhciByID0gKGQgKyBNYXRoLnJhbmRvbSgpICogMTYpICUgMTYgfCAwO1xuICAgICAgZCA9IE1hdGguZmxvb3IoZCAvIDE2KTtcbiAgICAgIHJldHVybiAoYyA9PT0gJ3gnID8gciA6IChyICYgMHg3KSB8IDB4OCkudG9TdHJpbmcoMTYpO1xuICAgIH0sXG4gICk7XG4gIHJldHVybiB1dWlkO1xufVxuXG52YXIgTEVWRUxTID0ge1xuICBkZWJ1ZzogMCxcbiAgaW5mbzogMSxcbiAgd2FybmluZzogMixcbiAgZXJyb3I6IDMsXG4gIGNyaXRpY2FsOiA0LFxufTtcblxuZnVuY3Rpb24gc2FuaXRpemVVcmwodXJsKSB7XG4gIHZhciBiYXNlVXJsUGFydHMgPSBwYXJzZVVyaSh1cmwpO1xuICBpZiAoIWJhc2VVcmxQYXJ0cykge1xuICAgIHJldHVybiAnKHVua25vd24pJztcbiAgfVxuXG4gIC8vIHJlbW92ZSBhIHRyYWlsaW5nICMgaWYgdGhlcmUgaXMgbm8gYW5jaG9yXG4gIGlmIChiYXNlVXJsUGFydHMuYW5jaG9yID09PSAnJykge1xuICAgIGJhc2VVcmxQYXJ0cy5zb3VyY2UgPSBiYXNlVXJsUGFydHMuc291cmNlLnJlcGxhY2UoJyMnLCAnJyk7XG4gIH1cblxuICB1cmwgPSBiYXNlVXJsUGFydHMuc291cmNlLnJlcGxhY2UoJz8nICsgYmFzZVVybFBhcnRzLnF1ZXJ5LCAnJyk7XG4gIHJldHVybiB1cmw7XG59XG5cbnZhciBwYXJzZVVyaU9wdGlvbnMgPSB7XG4gIHN0cmljdE1vZGU6IGZhbHNlLFxuICBrZXk6IFtcbiAgICAnc291cmNlJyxcbiAgICAncHJvdG9jb2wnLFxuICAgICdhdXRob3JpdHknLFxuICAgICd1c2VySW5mbycsXG4gICAgJ3VzZXInLFxuICAgICdwYXNzd29yZCcsXG4gICAgJ2hvc3QnLFxuICAgICdwb3J0JyxcbiAgICAncmVsYXRpdmUnLFxuICAgICdwYXRoJyxcbiAgICAnZGlyZWN0b3J5JyxcbiAgICAnZmlsZScsXG4gICAgJ3F1ZXJ5JyxcbiAgICAnYW5jaG9yJyxcbiAgXSxcbiAgcToge1xuICAgIG5hbWU6ICdxdWVyeUtleScsXG4gICAgcGFyc2VyOiAvKD86XnwmKShbXiY9XSopPT8oW14mXSopL2csXG4gIH0sXG4gIHBhcnNlcjoge1xuICAgIHN0cmljdDpcbiAgICAgIC9eKD86KFteOlxcLz8jXSspOik/KD86XFwvXFwvKCg/OigoW146QF0qKSg/OjooW146QF0qKSk/KT9AKT8oW146XFwvPyNdKikoPzo6KFxcZCopKT8pKT8oKCgoPzpbXj8jXFwvXSpcXC8pKikoW14/I10qKSkoPzpcXD8oW14jXSopKT8oPzojKC4qKSk/KS8sXG4gICAgbG9vc2U6XG4gICAgICAvXig/Oig/IVteOkBdKzpbXjpAXFwvXSpAKShbXjpcXC8/Iy5dKyk6KT8oPzpcXC9cXC8pPygoPzooKFteOkBdKikoPzo6KFteOkBdKikpPyk/QCk/KFteOlxcLz8jXSopKD86OihcXGQqKSk/KSgoKFxcLyg/OltePyNdKD8hW14/I1xcL10qXFwuW14/I1xcLy5dKyg/Ols/I118JCkpKSpcXC8/KT8oW14/I1xcL10qKSkoPzpcXD8oW14jXSopKT8oPzojKC4qKSk/KS8sXG4gIH0sXG59O1xuXG5mdW5jdGlvbiBwYXJzZVVyaShzdHIpIHtcbiAgaWYgKCFpc1R5cGUoc3RyLCAnc3RyaW5nJykpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgdmFyIG8gPSBwYXJzZVVyaU9wdGlvbnM7XG4gIHZhciBtID0gby5wYXJzZXJbby5zdHJpY3RNb2RlID8gJ3N0cmljdCcgOiAnbG9vc2UnXS5leGVjKHN0cik7XG4gIHZhciB1cmkgPSB7fTtcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IG8ua2V5Lmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIHVyaVtvLmtleVtpXV0gPSBtW2ldIHx8ICcnO1xuICB9XG5cbiAgdXJpW28ucS5uYW1lXSA9IHt9O1xuICB1cmlbby5rZXlbMTJdXS5yZXBsYWNlKG8ucS5wYXJzZXIsIGZ1bmN0aW9uICgkMCwgJDEsICQyKSB7XG4gICAgaWYgKCQxKSB7XG4gICAgICB1cmlbby5xLm5hbWVdWyQxXSA9ICQyO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHVyaTtcbn1cblxuZnVuY3Rpb24gYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGgoYWNjZXNzVG9rZW4sIG9wdGlvbnMsIHBhcmFtcykge1xuICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gIHBhcmFtcy5hY2Nlc3NfdG9rZW4gPSBhY2Nlc3NUb2tlbjtcbiAgdmFyIHBhcmFtc0FycmF5ID0gW107XG4gIHZhciBrO1xuICBmb3IgKGsgaW4gcGFyYW1zKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJhbXMsIGspKSB7XG4gICAgICBwYXJhbXNBcnJheS5wdXNoKFtrLCBwYXJhbXNba11dLmpvaW4oJz0nKSk7XG4gICAgfVxuICB9XG4gIHZhciBxdWVyeSA9ICc/JyArIHBhcmFtc0FycmF5LnNvcnQoKS5qb2luKCcmJyk7XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIG9wdGlvbnMucGF0aCA9IG9wdGlvbnMucGF0aCB8fCAnJztcbiAgdmFyIHFzID0gb3B0aW9ucy5wYXRoLmluZGV4T2YoJz8nKTtcbiAgdmFyIGggPSBvcHRpb25zLnBhdGguaW5kZXhPZignIycpO1xuICB2YXIgcDtcbiAgaWYgKHFzICE9PSAtMSAmJiAoaCA9PT0gLTEgfHwgaCA+IHFzKSkge1xuICAgIHAgPSBvcHRpb25zLnBhdGg7XG4gICAgb3B0aW9ucy5wYXRoID0gcC5zdWJzdHJpbmcoMCwgcXMpICsgcXVlcnkgKyAnJicgKyBwLnN1YnN0cmluZyhxcyArIDEpO1xuICB9IGVsc2Uge1xuICAgIGlmIChoICE9PSAtMSkge1xuICAgICAgcCA9IG9wdGlvbnMucGF0aDtcbiAgICAgIG9wdGlvbnMucGF0aCA9IHAuc3Vic3RyaW5nKDAsIGgpICsgcXVlcnkgKyBwLnN1YnN0cmluZyhoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9ucy5wYXRoID0gb3B0aW9ucy5wYXRoICsgcXVlcnk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFVybCh1LCBwcm90b2NvbCkge1xuICBwcm90b2NvbCA9IHByb3RvY29sIHx8IHUucHJvdG9jb2w7XG4gIGlmICghcHJvdG9jb2wgJiYgdS5wb3J0KSB7XG4gICAgaWYgKHUucG9ydCA9PT0gODApIHtcbiAgICAgIHByb3RvY29sID0gJ2h0dHA6JztcbiAgICB9IGVsc2UgaWYgKHUucG9ydCA9PT0gNDQzKSB7XG4gICAgICBwcm90b2NvbCA9ICdodHRwczonO1xuICAgIH1cbiAgfVxuICBwcm90b2NvbCA9IHByb3RvY29sIHx8ICdodHRwczonO1xuXG4gIGlmICghdS5ob3N0bmFtZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZhciByZXN1bHQgPSBwcm90b2NvbCArICcvLycgKyB1Lmhvc3RuYW1lO1xuICBpZiAodS5wb3J0KSB7XG4gICAgcmVzdWx0ID0gcmVzdWx0ICsgJzonICsgdS5wb3J0O1xuICB9XG4gIGlmICh1LnBhdGgpIHtcbiAgICByZXN1bHQgPSByZXN1bHQgKyB1LnBhdGg7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5KG9iaiwgYmFja3VwKSB7XG4gIHZhciB2YWx1ZSwgZXJyb3I7XG4gIHRyeSB7XG4gICAgdmFsdWUgPSBSb2xsYmFySlNPTi5zdHJpbmdpZnkob2JqKTtcbiAgfSBjYXRjaCAoanNvbkVycm9yKSB7XG4gICAgaWYgKGJhY2t1cCAmJiBpc0Z1bmN0aW9uKGJhY2t1cCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlID0gYmFja3VwKG9iaik7XG4gICAgICB9IGNhdGNoIChiYWNrdXBFcnJvcikge1xuICAgICAgICBlcnJvciA9IGJhY2t1cEVycm9yO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlcnJvciA9IGpzb25FcnJvcjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgZXJyb3I6IGVycm9yLCB2YWx1ZTogdmFsdWUgfTtcbn1cblxuZnVuY3Rpb24gbWF4Qnl0ZVNpemUoc3RyaW5nKSB7XG4gIC8vIFRoZSB0cmFuc3BvcnQgd2lsbCB1c2UgdXRmLTgsIHNvIGFzc3VtZSB1dGYtOCBlbmNvZGluZy5cbiAgLy9cbiAgLy8gVGhpcyBtaW5pbWFsIGltcGxlbWVudGF0aW9uIHdpbGwgYWNjdXJhdGVseSBjb3VudCBieXRlcyBmb3IgYWxsIFVDUy0yIGFuZFxuICAvLyBzaW5nbGUgY29kZSBwb2ludCBVVEYtMTYuIElmIHByZXNlbnRlZCB3aXRoIG11bHRpIGNvZGUgcG9pbnQgVVRGLTE2LFxuICAvLyB3aGljaCBzaG91bGQgYmUgcmFyZSwgaXQgd2lsbCBzYWZlbHkgb3ZlcmNvdW50LCBub3QgdW5kZXJjb3VudC5cbiAgLy9cbiAgLy8gV2hpbGUgcm9idXN0IHV0Zi04IGVuY29kZXJzIGV4aXN0LCB0aGlzIGlzIGZhciBzbWFsbGVyIGFuZCBmYXIgbW9yZSBwZXJmb3JtYW50LlxuICAvLyBGb3IgcXVpY2tseSBjb3VudGluZyBwYXlsb2FkIHNpemUgZm9yIHRydW5jYXRpb24sIHNtYWxsZXIgaXMgYmV0dGVyLlxuXG4gIHZhciBjb3VudCA9IDA7XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgY29kZSA9IHN0cmluZy5jaGFyQ29kZUF0KGkpO1xuICAgIGlmIChjb2RlIDwgMTI4KSB7XG4gICAgICAvLyB1cCB0byA3IGJpdHNcbiAgICAgIGNvdW50ID0gY291bnQgKyAxO1xuICAgIH0gZWxzZSBpZiAoY29kZSA8IDIwNDgpIHtcbiAgICAgIC8vIHVwIHRvIDExIGJpdHNcbiAgICAgIGNvdW50ID0gY291bnQgKyAyO1xuICAgIH0gZWxzZSBpZiAoY29kZSA8IDY1NTM2KSB7XG4gICAgICAvLyB1cCB0byAxNiBiaXRzXG4gICAgICBjb3VudCA9IGNvdW50ICsgMztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY291bnQ7XG59XG5cbmZ1bmN0aW9uIGpzb25QYXJzZShzKSB7XG4gIHZhciB2YWx1ZSwgZXJyb3I7XG4gIHRyeSB7XG4gICAgdmFsdWUgPSBSb2xsYmFySlNPTi5wYXJzZShzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGVycm9yID0gZTtcbiAgfVxuICByZXR1cm4geyBlcnJvcjogZXJyb3IsIHZhbHVlOiB2YWx1ZSB9O1xufVxuXG5mdW5jdGlvbiBtYWtlVW5oYW5kbGVkU3RhY2tJbmZvKFxuICBtZXNzYWdlLFxuICB1cmwsXG4gIGxpbmVubyxcbiAgY29sbm8sXG4gIGVycm9yLFxuICBtb2RlLFxuICBiYWNrdXBNZXNzYWdlLFxuICBlcnJvclBhcnNlcixcbikge1xuICB2YXIgbG9jYXRpb24gPSB7XG4gICAgdXJsOiB1cmwgfHwgJycsXG4gICAgbGluZTogbGluZW5vLFxuICAgIGNvbHVtbjogY29sbm8sXG4gIH07XG4gIGxvY2F0aW9uLmZ1bmMgPSBlcnJvclBhcnNlci5ndWVzc0Z1bmN0aW9uTmFtZShsb2NhdGlvbi51cmwsIGxvY2F0aW9uLmxpbmUpO1xuICBsb2NhdGlvbi5jb250ZXh0ID0gZXJyb3JQYXJzZXIuZ2F0aGVyQ29udGV4dChsb2NhdGlvbi51cmwsIGxvY2F0aW9uLmxpbmUpO1xuICB2YXIgaHJlZiA9XG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIGRvY3VtZW50ICYmXG4gICAgZG9jdW1lbnQubG9jYXRpb24gJiZcbiAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmO1xuICB2YXIgdXNlcmFnZW50ID1cbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHdpbmRvdyAmJlxuICAgIHdpbmRvdy5uYXZpZ2F0b3IgJiZcbiAgICB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgcmV0dXJuIHtcbiAgICBtb2RlOiBtb2RlLFxuICAgIG1lc3NhZ2U6IGVycm9yID8gU3RyaW5nKGVycm9yKSA6IG1lc3NhZ2UgfHwgYmFja3VwTWVzc2FnZSxcbiAgICB1cmw6IGhyZWYsXG4gICAgc3RhY2s6IFtsb2NhdGlvbl0sXG4gICAgdXNlcmFnZW50OiB1c2VyYWdlbnQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHdyYXBDYWxsYmFjayhsb2dnZXIsIGYpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICB0cnkge1xuICAgICAgZihlcnIsIHJlc3ApO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihlKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIG5vbkNpcmN1bGFyQ2xvbmUob2JqKSB7XG4gIHZhciBzZWVuID0gW29ial07XG5cbiAgZnVuY3Rpb24gY2xvbmUob2JqLCBzZWVuKSB7XG4gICAgdmFyIHZhbHVlLFxuICAgICAgbmFtZSxcbiAgICAgIG5ld1NlZW4sXG4gICAgICByZXN1bHQgPSB7fTtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKG5hbWUgaW4gb2JqKSB7XG4gICAgICAgIHZhbHVlID0gb2JqW25hbWVdO1xuXG4gICAgICAgIGlmICh2YWx1ZSAmJiAoaXNUeXBlKHZhbHVlLCAnb2JqZWN0JykgfHwgaXNUeXBlKHZhbHVlLCAnYXJyYXknKSkpIHtcbiAgICAgICAgICBpZiAoc2Vlbi5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJlc3VsdFtuYW1lXSA9ICdSZW1vdmVkIGNpcmN1bGFyIHJlZmVyZW5jZTogJyArIHR5cGVOYW1lKHZhbHVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3U2VlbiA9IHNlZW4uc2xpY2UoKTtcbiAgICAgICAgICAgIG5ld1NlZW4ucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICByZXN1bHRbbmFtZV0gPSBjbG9uZSh2YWx1ZSwgbmV3U2Vlbik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0W25hbWVdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmVzdWx0ID0gJ0ZhaWxlZCBjbG9uaW5nIGN1c3RvbSBkYXRhOiAnICsgZS5tZXNzYWdlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHJldHVybiBjbG9uZShvYmosIHNlZW4pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVJdGVtKGFyZ3MsIGxvZ2dlciwgbm90aWZpZXIsIHJlcXVlc3RLZXlzLCBsYW1iZGFDb250ZXh0KSB7XG4gIHZhciBtZXNzYWdlLCBlcnIsIGN1c3RvbSwgY2FsbGJhY2ssIHJlcXVlc3Q7XG4gIHZhciBhcmc7XG4gIHZhciBleHRyYUFyZ3MgPSBbXTtcbiAgdmFyIGRpYWdub3N0aWMgPSB7fTtcbiAgdmFyIGFyZ1R5cGVzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmdzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGFyZyA9IGFyZ3NbaV07XG5cbiAgICB2YXIgdHlwID0gdHlwZU5hbWUoYXJnKTtcbiAgICBhcmdUeXBlcy5wdXNoKHR5cCk7XG4gICAgc3dpdGNoICh0eXApIHtcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgbWVzc2FnZSA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAobWVzc2FnZSA9IGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICBjYWxsYmFjayA9IHdyYXBDYWxsYmFjayhsb2dnZXIsIGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgIGV4dHJhQXJncy5wdXNoKGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZXJyb3InOlxuICAgICAgY2FzZSAnZG9tZXhjZXB0aW9uJzpcbiAgICAgIGNhc2UgJ2V4Y2VwdGlvbic6IC8vIEZpcmVmb3ggRXhjZXB0aW9uIHR5cGVcbiAgICAgICAgZXJyID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChlcnIgPSBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICBjYXNlICdhcnJheSc6XG4gICAgICAgIGlmIChcbiAgICAgICAgICBhcmcgaW5zdGFuY2VvZiBFcnJvciB8fFxuICAgICAgICAgICh0eXBlb2YgRE9NRXhjZXB0aW9uICE9PSAndW5kZWZpbmVkJyAmJiBhcmcgaW5zdGFuY2VvZiBET01FeGNlcHRpb24pXG4gICAgICAgICkge1xuICAgICAgICAgIGVyciA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoZXJyID0gYXJnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVxdWVzdEtleXMgJiYgdHlwID09PSAnb2JqZWN0JyAmJiAhcmVxdWVzdCkge1xuICAgICAgICAgIGZvciAodmFyIGogPSAwLCBsZW4gPSByZXF1ZXN0S2V5cy5sZW5ndGg7IGogPCBsZW47ICsraikge1xuICAgICAgICAgICAgaWYgKGFyZ1tyZXF1ZXN0S2V5c1tqXV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICByZXF1ZXN0ID0gYXJnO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlcXVlc3QpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjdXN0b20gPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGN1c3RvbSA9IGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGFyZyBpbnN0YW5jZW9mIEVycm9yIHx8XG4gICAgICAgICAgKHR5cGVvZiBET01FeGNlcHRpb24gIT09ICd1bmRlZmluZWQnICYmIGFyZyBpbnN0YW5jZW9mIERPTUV4Y2VwdGlvbilcbiAgICAgICAgKSB7XG4gICAgICAgICAgZXJyID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChlcnIgPSBhcmcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGV4dHJhQXJncy5wdXNoKGFyZyk7XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgY3VzdG9tIGlzIGFuIGFycmF5IHRoaXMgdHVybnMgaXQgaW50byBhbiBvYmplY3Qgd2l0aCBpbnRlZ2VyIGtleXNcbiAgaWYgKGN1c3RvbSkgY3VzdG9tID0gbm9uQ2lyY3VsYXJDbG9uZShjdXN0b20pO1xuXG4gIGlmIChleHRyYUFyZ3MubGVuZ3RoID4gMCkge1xuICAgIGlmICghY3VzdG9tKSBjdXN0b20gPSBub25DaXJjdWxhckNsb25lKHt9KTtcbiAgICBjdXN0b20uZXh0cmFBcmdzID0gbm9uQ2lyY3VsYXJDbG9uZShleHRyYUFyZ3MpO1xuICB9XG5cbiAgdmFyIGl0ZW0gPSB7XG4gICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICBlcnI6IGVycixcbiAgICBjdXN0b206IGN1c3RvbSxcbiAgICB0aW1lc3RhbXA6IG5vdygpLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcbiAgICBub3RpZmllcjogbm90aWZpZXIsXG4gICAgZGlhZ25vc3RpYzogZGlhZ25vc3RpYyxcbiAgICB1dWlkOiB1dWlkNCgpLFxuICB9O1xuXG4gIGl0ZW0uZGF0YSA9IGl0ZW0uZGF0YSB8fCB7fTtcblxuICBzZXRDdXN0b21JdGVtS2V5cyhpdGVtLCBjdXN0b20pO1xuXG4gIGlmIChyZXF1ZXN0S2V5cyAmJiByZXF1ZXN0KSB7XG4gICAgaXRlbS5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgfVxuICBpZiAobGFtYmRhQ29udGV4dCkge1xuICAgIGl0ZW0ubGFtYmRhQ29udGV4dCA9IGxhbWJkYUNvbnRleHQ7XG4gIH1cbiAgaXRlbS5fb3JpZ2luYWxBcmdzID0gYXJncztcbiAgaXRlbS5kaWFnbm9zdGljLm9yaWdpbmFsX2FyZ190eXBlcyA9IGFyZ1R5cGVzO1xuICByZXR1cm4gaXRlbTtcbn1cblxuZnVuY3Rpb24gc2V0Q3VzdG9tSXRlbUtleXMoaXRlbSwgY3VzdG9tKSB7XG4gIGlmIChjdXN0b20gJiYgY3VzdG9tLmxldmVsICE9PSB1bmRlZmluZWQpIHtcbiAgICBpdGVtLmxldmVsID0gY3VzdG9tLmxldmVsO1xuICAgIGRlbGV0ZSBjdXN0b20ubGV2ZWw7XG4gIH1cbiAgaWYgKGN1c3RvbSAmJiBjdXN0b20uc2tpcEZyYW1lcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaXRlbS5za2lwRnJhbWVzID0gY3VzdG9tLnNraXBGcmFtZXM7XG4gICAgZGVsZXRlIGN1c3RvbS5za2lwRnJhbWVzO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFkZEVycm9yQ29udGV4dChpdGVtLCBlcnJvcnMpIHtcbiAgdmFyIGN1c3RvbSA9IGl0ZW0uZGF0YS5jdXN0b20gfHwge307XG4gIHZhciBjb250ZXh0QWRkZWQgPSBmYWxzZTtcblxuICB0cnkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXJyb3JzLmxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoZXJyb3JzW2ldLmhhc093blByb3BlcnR5KCdyb2xsYmFyQ29udGV4dCcpKSB7XG4gICAgICAgIGN1c3RvbSA9IG1lcmdlKGN1c3RvbSwgbm9uQ2lyY3VsYXJDbG9uZShlcnJvcnNbaV0ucm9sbGJhckNvbnRleHQpKTtcbiAgICAgICAgY29udGV4dEFkZGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBdm9pZCBhZGRpbmcgYW4gZW1wdHkgb2JqZWN0IHRvIHRoZSBkYXRhLlxuICAgIGlmIChjb250ZXh0QWRkZWQpIHtcbiAgICAgIGl0ZW0uZGF0YS5jdXN0b20gPSBjdXN0b207XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgaXRlbS5kaWFnbm9zdGljLmVycm9yX2NvbnRleHQgPSAnRmFpbGVkOiAnICsgZS5tZXNzYWdlO1xuICB9XG59XG5cbnZhciBURUxFTUVUUllfVFlQRVMgPSBbXG4gICdsb2cnLFxuICAnbmV0d29yaycsXG4gICdkb20nLFxuICAnbmF2aWdhdGlvbicsXG4gICdlcnJvcicsXG4gICdtYW51YWwnLFxuXTtcbnZhciBURUxFTUVUUllfTEVWRUxTID0gWydjcml0aWNhbCcsICdlcnJvcicsICd3YXJuaW5nJywgJ2luZm8nLCAnZGVidWcnXTtcblxuZnVuY3Rpb24gYXJyYXlJbmNsdWRlcyhhcnIsIHZhbCkge1xuICBmb3IgKHZhciBrID0gMDsgayA8IGFyci5sZW5ndGg7ICsraykge1xuICAgIGlmIChhcnJba10gPT09IHZhbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUZWxlbWV0cnlFdmVudChhcmdzKSB7XG4gIHZhciB0eXBlLCBtZXRhZGF0YSwgbGV2ZWw7XG4gIHZhciBhcmc7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmdzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGFyZyA9IGFyZ3NbaV07XG5cbiAgICB2YXIgdHlwID0gdHlwZU5hbWUoYXJnKTtcbiAgICBzd2l0Y2ggKHR5cCkge1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgaWYgKCF0eXBlICYmIGFycmF5SW5jbHVkZXMoVEVMRU1FVFJZX1RZUEVTLCBhcmcpKSB7XG4gICAgICAgICAgdHlwZSA9IGFyZztcbiAgICAgICAgfSBlbHNlIGlmICghbGV2ZWwgJiYgYXJyYXlJbmNsdWRlcyhURUxFTUVUUllfTEVWRUxTLCBhcmcpKSB7XG4gICAgICAgICAgbGV2ZWwgPSBhcmc7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBtZXRhZGF0YSA9IGFyZztcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgdmFyIGV2ZW50ID0ge1xuICAgIHR5cGU6IHR5cGUgfHwgJ21hbnVhbCcsXG4gICAgbWV0YWRhdGE6IG1ldGFkYXRhIHx8IHt9LFxuICAgIGxldmVsOiBsZXZlbCxcbiAgfTtcblxuICByZXR1cm4gZXZlbnQ7XG59XG5cbmZ1bmN0aW9uIGFkZEl0ZW1BdHRyaWJ1dGVzKGl0ZW0sIGF0dHJpYnV0ZXMpIHtcbiAgaXRlbS5kYXRhLmF0dHJpYnV0ZXMgPSBpdGVtLmRhdGEuYXR0cmlidXRlcyB8fCBbXTtcbiAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICBpdGVtLmRhdGEuYXR0cmlidXRlcy5wdXNoKC4uLmF0dHJpYnV0ZXMpO1xuICB9XG59XG5cbi8qXG4gKiBnZXQgLSBnaXZlbiBhbiBvYmovYXJyYXkgYW5kIGEga2V5cGF0aCwgcmV0dXJuIHRoZSB2YWx1ZSBhdCB0aGF0IGtleXBhdGggb3JcbiAqICAgICAgIHVuZGVmaW5lZCBpZiBub3QgcG9zc2libGUuXG4gKlxuICogQHBhcmFtIG9iaiAtIGFuIG9iamVjdCBvciBhcnJheVxuICogQHBhcmFtIHBhdGggLSBhIHN0cmluZyBvZiBrZXlzIHNlcGFyYXRlZCBieSAnLicgc3VjaCBhcyAncGx1Z2luLmpxdWVyeS4wLm1lc3NhZ2UnXG4gKiAgICB3aGljaCB3b3VsZCBjb3JyZXNwb25kIHRvIDQyIGluIGB7cGx1Z2luOiB7anF1ZXJ5OiBbe21lc3NhZ2U6IDQyfV19fWBcbiAqL1xuZnVuY3Rpb24gZ2V0KG9iaiwgcGF0aCkge1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgdmFyIGtleXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gIHZhciByZXN1bHQgPSBvYmo7XG4gIHRyeSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGtleXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdFtrZXlzW2ldXTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gc2V0KG9iaiwgcGF0aCwgdmFsdWUpIHtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGtleXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gIHZhciBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgaWYgKGxlbiA8IDEpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGxlbiA9PT0gMSkge1xuICAgIG9ialtrZXlzWzBdXSA9IHZhbHVlO1xuICAgIHJldHVybjtcbiAgfVxuICB0cnkge1xuICAgIHZhciB0ZW1wID0gb2JqW2tleXNbMF1dIHx8IHt9O1xuICAgIHZhciByZXBsYWNlbWVudCA9IHRlbXA7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW4gLSAxOyArK2kpIHtcbiAgICAgIHRlbXBba2V5c1tpXV0gPSB0ZW1wW2tleXNbaV1dIHx8IHt9O1xuICAgICAgdGVtcCA9IHRlbXBba2V5c1tpXV07XG4gICAgfVxuICAgIHRlbXBba2V5c1tsZW4gLSAxXV0gPSB2YWx1ZTtcbiAgICBvYmpba2V5c1swXV0gPSByZXBsYWNlbWVudDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybjtcbiAgfVxufVxuXG5mdW5jdGlvbiBmb3JtYXRBcmdzQXNTdHJpbmcoYXJncykge1xuICB2YXIgaSwgbGVuLCBhcmc7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yIChpID0gMCwgbGVuID0gYXJncy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIGFyZyA9IGFyZ3NbaV07XG4gICAgc3dpdGNoICh0eXBlTmFtZShhcmcpKSB7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBhcmcgPSBzdHJpbmdpZnkoYXJnKTtcbiAgICAgICAgYXJnID0gYXJnLmVycm9yIHx8IGFyZy52YWx1ZTtcbiAgICAgICAgaWYgKGFyZy5sZW5ndGggPiA1MDApIHtcbiAgICAgICAgICBhcmcgPSBhcmcuc3Vic3RyKDAsIDQ5NykgKyAnLi4uJztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ251bGwnOlxuICAgICAgICBhcmcgPSAnbnVsbCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgYXJnID0gJ3VuZGVmaW5lZCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3ltYm9sJzpcbiAgICAgICAgYXJnID0gYXJnLnRvU3RyaW5nKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXN1bHQucHVzaChhcmcpO1xuICB9XG4gIHJldHVybiByZXN1bHQuam9pbignICcpO1xufVxuXG5mdW5jdGlvbiBub3coKSB7XG4gIGlmIChEYXRlLm5vdykge1xuICAgIHJldHVybiArRGF0ZS5ub3coKTtcbiAgfVxuICByZXR1cm4gK25ldyBEYXRlKCk7XG59XG5cbmZ1bmN0aW9uIGZpbHRlcklwKHJlcXVlc3REYXRhLCBjYXB0dXJlSXApIHtcbiAgaWYgKCFyZXF1ZXN0RGF0YSB8fCAhcmVxdWVzdERhdGFbJ3VzZXJfaXAnXSB8fCBjYXB0dXJlSXAgPT09IHRydWUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG5ld0lwID0gcmVxdWVzdERhdGFbJ3VzZXJfaXAnXTtcbiAgaWYgKCFjYXB0dXJlSXApIHtcbiAgICBuZXdJcCA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBwYXJ0cztcbiAgICAgIGlmIChuZXdJcC5pbmRleE9mKCcuJykgIT09IC0xKSB7XG4gICAgICAgIHBhcnRzID0gbmV3SXAuc3BsaXQoJy4nKTtcbiAgICAgICAgcGFydHMucG9wKCk7XG4gICAgICAgIHBhcnRzLnB1c2goJzAnKTtcbiAgICAgICAgbmV3SXAgPSBwYXJ0cy5qb2luKCcuJyk7XG4gICAgICB9IGVsc2UgaWYgKG5ld0lwLmluZGV4T2YoJzonKSAhPT0gLTEpIHtcbiAgICAgICAgcGFydHMgPSBuZXdJcC5zcGxpdCgnOicpO1xuICAgICAgICBpZiAocGFydHMubGVuZ3RoID4gMikge1xuICAgICAgICAgIHZhciBiZWdpbm5pbmcgPSBwYXJ0cy5zbGljZSgwLCAzKTtcbiAgICAgICAgICB2YXIgc2xhc2hJZHggPSBiZWdpbm5pbmdbMl0uaW5kZXhPZignLycpO1xuICAgICAgICAgIGlmIChzbGFzaElkeCAhPT0gLTEpIHtcbiAgICAgICAgICAgIGJlZ2lubmluZ1syXSA9IGJlZ2lubmluZ1syXS5zdWJzdHJpbmcoMCwgc2xhc2hJZHgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdGVybWluYWwgPSAnMDAwMDowMDAwOjAwMDA6MDAwMDowMDAwJztcbiAgICAgICAgICBuZXdJcCA9IGJlZ2lubmluZy5jb25jYXQodGVybWluYWwpLmpvaW4oJzonKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3SXAgPSBudWxsO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIG5ld0lwID0gbnVsbDtcbiAgICB9XG4gIH1cbiAgcmVxdWVzdERhdGFbJ3VzZXJfaXAnXSA9IG5ld0lwO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVPcHRpb25zKGN1cnJlbnQsIGlucHV0LCBwYXlsb2FkLCBsb2dnZXIpIHtcbiAgdmFyIHJlc3VsdCA9IG1lcmdlKGN1cnJlbnQsIGlucHV0LCBwYXlsb2FkKTtcbiAgcmVzdWx0ID0gdXBkYXRlRGVwcmVjYXRlZE9wdGlvbnMocmVzdWx0LCBsb2dnZXIpO1xuICBpZiAoIWlucHV0IHx8IGlucHV0Lm92ZXJ3cml0ZVNjcnViRmllbGRzKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBpZiAoaW5wdXQuc2NydWJGaWVsZHMpIHtcbiAgICByZXN1bHQuc2NydWJGaWVsZHMgPSAoY3VycmVudC5zY3J1YkZpZWxkcyB8fCBbXSkuY29uY2F0KGlucHV0LnNjcnViRmllbGRzKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiB1cGRhdGVEZXByZWNhdGVkT3B0aW9ucyhvcHRpb25zLCBsb2dnZXIpIHtcbiAgaWYgKG9wdGlvbnMuaG9zdFdoaXRlTGlzdCAmJiAhb3B0aW9ucy5ob3N0U2FmZUxpc3QpIHtcbiAgICBvcHRpb25zLmhvc3RTYWZlTGlzdCA9IG9wdGlvbnMuaG9zdFdoaXRlTGlzdDtcbiAgICBvcHRpb25zLmhvc3RXaGl0ZUxpc3QgPSB1bmRlZmluZWQ7XG4gICAgbG9nZ2VyICYmIGxvZ2dlci5sb2coJ2hvc3RXaGl0ZUxpc3QgaXMgZGVwcmVjYXRlZC4gVXNlIGhvc3RTYWZlTGlzdC4nKTtcbiAgfVxuICBpZiAob3B0aW9ucy5ob3N0QmxhY2tMaXN0ICYmICFvcHRpb25zLmhvc3RCbG9ja0xpc3QpIHtcbiAgICBvcHRpb25zLmhvc3RCbG9ja0xpc3QgPSBvcHRpb25zLmhvc3RCbGFja0xpc3Q7XG4gICAgb3B0aW9ucy5ob3N0QmxhY2tMaXN0ID0gdW5kZWZpbmVkO1xuICAgIGxvZ2dlciAmJiBsb2dnZXIubG9nKCdob3N0QmxhY2tMaXN0IGlzIGRlcHJlY2F0ZWQuIFVzZSBob3N0QmxvY2tMaXN0LicpO1xuICB9XG4gIHJldHVybiBvcHRpb25zO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGg6IGFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoLFxuICBjcmVhdGVJdGVtOiBjcmVhdGVJdGVtLFxuICBhZGRFcnJvckNvbnRleHQ6IGFkZEVycm9yQ29udGV4dCxcbiAgY3JlYXRlVGVsZW1ldHJ5RXZlbnQ6IGNyZWF0ZVRlbGVtZXRyeUV2ZW50LFxuICBhZGRJdGVtQXR0cmlidXRlczogYWRkSXRlbUF0dHJpYnV0ZXMsXG4gIGZpbHRlcklwOiBmaWx0ZXJJcCxcbiAgZm9ybWF0QXJnc0FzU3RyaW5nOiBmb3JtYXRBcmdzQXNTdHJpbmcsXG4gIGZvcm1hdFVybDogZm9ybWF0VXJsLFxuICBnZXQ6IGdldCxcbiAgaGFuZGxlT3B0aW9uczogaGFuZGxlT3B0aW9ucyxcbiAgaXNFcnJvcjogaXNFcnJvcixcbiAgaXNGaW5pdGVOdW1iZXI6IGlzRmluaXRlTnVtYmVyLFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICBpc0l0ZXJhYmxlOiBpc0l0ZXJhYmxlLFxuICBpc05hdGl2ZUZ1bmN0aW9uOiBpc05hdGl2ZUZ1bmN0aW9uLFxuICBpc09iamVjdDogaXNPYmplY3QsXG4gIGlzU3RyaW5nOiBpc1N0cmluZyxcbiAgaXNUeXBlOiBpc1R5cGUsXG4gIGlzUHJvbWlzZTogaXNQcm9taXNlLFxuICBpc0Jyb3dzZXI6IGlzQnJvd3NlcixcbiAganNvblBhcnNlOiBqc29uUGFyc2UsXG4gIExFVkVMUzogTEVWRUxTLFxuICBtYWtlVW5oYW5kbGVkU3RhY2tJbmZvOiBtYWtlVW5oYW5kbGVkU3RhY2tJbmZvLFxuICBtZXJnZTogbWVyZ2UsXG4gIG5vdzogbm93LFxuICByZWRhY3Q6IHJlZGFjdCxcbiAgUm9sbGJhckpTT046IFJvbGxiYXJKU09OLFxuICBzYW5pdGl6ZVVybDogc2FuaXRpemVVcmwsXG4gIHNldDogc2V0LFxuICBzZXR1cEpTT046IHNldHVwSlNPTixcbiAgc3RyaW5naWZ5OiBzdHJpbmdpZnksXG4gIG1heEJ5dGVTaXplOiBtYXhCeXRlU2l6ZSxcbiAgdHlwZU5hbWU6IHR5cGVOYW1lLFxuICB1dWlkNDogdXVpZDQsXG59O1xuIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsaXR5Jyk7XG5cbmZ1bmN0aW9uIHRyYXZlcnNlKG9iaiwgZnVuYywgc2Vlbikge1xuICB2YXIgaywgdiwgaTtcbiAgdmFyIGlzT2JqID0gXy5pc1R5cGUob2JqLCAnb2JqZWN0Jyk7XG4gIHZhciBpc0FycmF5ID0gXy5pc1R5cGUob2JqLCAnYXJyYXknKTtcbiAgdmFyIGtleXMgPSBbXTtcbiAgdmFyIHNlZW5JbmRleDtcblxuICAvLyBCZXN0IG1pZ2h0IGJlIHRvIHVzZSBNYXAgaGVyZSB3aXRoIGBvYmpgIGFzIHRoZSBrZXlzLCBidXQgd2Ugd2FudCB0byBzdXBwb3J0IElFIDwgMTEuXG4gIHNlZW4gPSBzZWVuIHx8IHsgb2JqOiBbXSwgbWFwcGVkOiBbXSB9O1xuXG4gIGlmIChpc09iaikge1xuICAgIHNlZW5JbmRleCA9IHNlZW4ub2JqLmluZGV4T2Yob2JqKTtcblxuICAgIGlmIChpc09iaiAmJiBzZWVuSW5kZXggIT09IC0xKSB7XG4gICAgICAvLyBQcmVmZXIgdGhlIG1hcHBlZCBvYmplY3QgaWYgdGhlcmUgaXMgb25lLlxuICAgICAgcmV0dXJuIHNlZW4ubWFwcGVkW3NlZW5JbmRleF0gfHwgc2Vlbi5vYmpbc2VlbkluZGV4XTtcbiAgICB9XG5cbiAgICBzZWVuLm9iai5wdXNoKG9iaik7XG4gICAgc2VlbkluZGV4ID0gc2Vlbi5vYmoubGVuZ3RoIC0gMTtcbiAgfVxuXG4gIGlmIChpc09iaikge1xuICAgIGZvciAoayBpbiBvYmopIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrKSkge1xuICAgICAgICBrZXlzLnB1c2goayk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzQXJyYXkpIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgb2JqLmxlbmd0aDsgKytpKSB7XG4gICAgICBrZXlzLnB1c2goaSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIHJlc3VsdCA9IGlzT2JqID8ge30gOiBbXTtcbiAgdmFyIHNhbWUgPSB0cnVlO1xuICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgIGsgPSBrZXlzW2ldO1xuICAgIHYgPSBvYmpba107XG4gICAgcmVzdWx0W2tdID0gZnVuYyhrLCB2LCBzZWVuKTtcbiAgICBzYW1lID0gc2FtZSAmJiByZXN1bHRba10gPT09IG9ialtrXTtcbiAgfVxuXG4gIGlmIChpc09iaiAmJiAhc2FtZSkge1xuICAgIHNlZW4ubWFwcGVkW3NlZW5JbmRleF0gPSByZXN1bHQ7XG4gIH1cblxuICByZXR1cm4gIXNhbWUgPyByZXN1bHQgOiBvYmo7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHJhdmVyc2U7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLyogZ2xvYmFscyBleHBlY3QgKi9cbi8qIGdsb2JhbHMgZGVzY3JpYmUgKi9cbi8qIGdsb2JhbHMgaXQgKi9cbi8qIGdsb2JhbHMgc2lub24gKi9cblxudmFyIHRydW5jYXRpb24gPSByZXF1aXJlKCcuLi9zcmMvdHJ1bmNhdGlvbicpO1xudmFyIFRyYW5zcG9ydCA9IHJlcXVpcmUoJy4uL3NyYy9icm93c2VyL3RyYW5zcG9ydCcpO1xudmFyIHQgPSBuZXcgVHJhbnNwb3J0KHRydW5jYXRpb24pO1xudmFyIHV0aWxpdHkgPSByZXF1aXJlKCcuLi9zcmMvdXRpbGl0eScpO1xudXRpbGl0eS5zZXR1cEpTT04oKTtcblxuZGVzY3JpYmUoJ3Bvc3QnLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBhY2Nlc3NUb2tlbiA9ICdhYmMxMjMnO1xuICB2YXIgb3B0aW9ucyA9IHtcbiAgICBob3N0bmFtZTogJ2FwaS5yb2xsYmFyLmNvbScsXG4gICAgcHJvdG9jb2w6ICdodHRwcycsXG4gICAgcGF0aDogJy9hcGkvMS9pdGVtLycsXG4gICAgdGltZW91dDogMjAwMCxcbiAgfTtcbiAgdmFyIHBheWxvYWQgPSB7XG4gICAgYWNjZXNzX3Rva2VuOiBhY2Nlc3NUb2tlbixcbiAgICBkYXRhOiB7IGE6IDEgfSxcbiAgfTtcbiAgaXQoJ3Nob3VsZCBoYW5kbGUgYSBmYWlsdXJlIHRvIG1ha2UgYSByZXF1ZXN0JywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgcmVxdWVzdEZhY3RvcnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgIGV4cGVjdChlcnIpLnRvLmJlLm9rKCk7XG4gICAgICBkb25lKHJlc3ApO1xuICAgIH07XG4gICAgdC5wb3N0KGFjY2Vzc1Rva2VuLCBvcHRpb25zLCBwYXlsb2FkLCBjYWxsYmFjaywgcmVxdWVzdEZhY3RvcnkpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBjYWxsYmFjayB3aXRoIHRoZSByaWdodCB2YWx1ZSBvbiBzdWNjZXNzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgcmVxdWVzdEZhY3RvcnkgPSByZXF1ZXN0R2VuZXJhdG9yKCd7XCJlcnJcIjogbnVsbCwgXCJyZXN1bHRcIjogdHJ1ZX0nLCAyMDApO1xuICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgIGV4cGVjdChyZXNwKS50by5iZS5vaygpO1xuICAgICAgZXhwZWN0KHJlc3AucmVzdWx0KS50by5iZS5vaygpO1xuICAgICAgZXhwZWN0KHJlcXVlc3RGYWN0b3J5LmdldEluc3RhbmNlKCkudGltZW91dCkudG8uZXF1YWwob3B0aW9ucy50aW1lb3V0KTtcbiAgICAgIGRvbmUoZXJyKTtcbiAgICB9O1xuICAgIHQucG9zdChhY2Nlc3NUb2tlbiwgb3B0aW9ucywgcGF5bG9hZCwgY2FsbGJhY2ssIHJlcXVlc3RGYWN0b3J5LmdldEluc3RhbmNlKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgY2FsbGJhY2sgd2l0aCB0aGUgc2VydmVyIGVycm9yIGlmIDQwMycsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIHJlc3BvbnNlID1cbiAgICAgICd7XCJlcnJcIjogXCJiYWQgcmVxdWVzdFwiLCBcInJlc3VsdFwiOiBudWxsLCBcIm1lc3NhZ2VcIjogXCJmYWlsIHdoYWxlXCJ9JztcbiAgICB2YXIgcmVxdWVzdEZhY3RvcnkgPSByZXF1ZXN0R2VuZXJhdG9yKHJlc3BvbnNlLCA0MDMpO1xuICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgIGV4cGVjdChyZXNwKS50by5ub3QuYmUub2soKTtcbiAgICAgIGV4cGVjdChlcnIubWVzc2FnZSkudG8uZXFsKCc0MDMnKTtcbiAgICAgIGV4cGVjdChyZXF1ZXN0RmFjdG9yeS5nZXRJbnN0YW5jZSgpLnRpbWVvdXQpLnRvLmVxdWFsKG9wdGlvbnMudGltZW91dCk7XG4gICAgICBkb25lKHJlc3ApO1xuICAgIH07XG4gICAgdC5wb3N0KGFjY2Vzc1Rva2VuLCBvcHRpb25zLCBwYXlsb2FkLCBjYWxsYmFjaywgcmVxdWVzdEZhY3RvcnkuZ2V0SW5zdGFuY2UpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBjYWxsYmFjayB3aXRoIHRoZSBzZXJ2ZXIgZXJyb3IgaWYgNTAwJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgcmVzcG9uc2UgPVxuICAgICAgJ3tcImVyclwiOiBcImJhZCByZXF1ZXN0XCIsIFwicmVzdWx0XCI6IG51bGwsIFwibWVzc2FnZVwiOiBcIjUwMCEhIVwifSc7XG4gICAgdmFyIHJlcXVlc3RGYWN0b3J5ID0gcmVxdWVzdEdlbmVyYXRvcihyZXNwb25zZSwgNTAwKTtcbiAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICBleHBlY3QocmVzcCkudG8ubm90LmJlLm9rKCk7XG4gICAgICBleHBlY3QoZXJyLm1lc3NhZ2UpLnRvLmVxbCgnNTAwJyk7XG4gICAgICBleHBlY3QocmVxdWVzdEZhY3RvcnkuZ2V0SW5zdGFuY2UoKS50aW1lb3V0KS50by5lcXVhbChvcHRpb25zLnRpbWVvdXQpO1xuICAgICAgZG9uZShyZXNwKTtcbiAgICB9O1xuICAgIHQucG9zdChhY2Nlc3NUb2tlbiwgb3B0aW9ucywgcGF5bG9hZCwgY2FsbGJhY2ssIHJlcXVlc3RGYWN0b3J5LmdldEluc3RhbmNlKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgY2FsbGJhY2sgd2l0aCBhIHJldHJpYWJsZSBlcnJvciB3aXRoIGEgd2VpcmQgc3RhdHVzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgcmVzcG9uc2UgPSAne1wiZXJyXCI6IFwiYmFkIHJlcXVlc3RcIn0nO1xuICAgIHZhciByZXF1ZXN0RmFjdG9yeSA9IHJlcXVlc3RHZW5lcmF0b3IocmVzcG9uc2UsIDEyMDA1KTtcbiAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICBleHBlY3QocmVzcCkudG8ubm90LmJlLm9rKCk7XG4gICAgICBleHBlY3QoZXJyLm1lc3NhZ2UpLnRvLm1hdGNoKC9jb25uZWN0aW9uIGZhaWx1cmUvKTtcbiAgICAgIGV4cGVjdChlcnIuY29kZSkudG8uZXFsKCdFTk9URk9VTkQnKTtcbiAgICAgIGV4cGVjdChyZXF1ZXN0RmFjdG9yeS5nZXRJbnN0YW5jZSgpLnRpbWVvdXQpLnRvLmVxdWFsKG9wdGlvbnMudGltZW91dCk7XG4gICAgICBkb25lKHJlc3ApO1xuICAgIH07XG4gICAgdC5wb3N0KGFjY2Vzc1Rva2VuLCBvcHRpb25zLCBwYXlsb2FkLCBjYWxsYmFjaywgcmVxdWVzdEZhY3RvcnkuZ2V0SW5zdGFuY2UpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBjYWxsYmFjayB3aXRoIHNvbWUgZXJyb3IgaWYgbm9ybWFsIHNlbmRpbmcgdGhyb3dzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgcmVzcG9uc2UgPSAne1wiZXJyXCI6IFwiYmFkIHJlcXVlc3RcIn0nO1xuICAgIHZhciByZXF1ZXN0RmFjdG9yeSA9IHJlcXVlc3RHZW5lcmF0b3IocmVzcG9uc2UsIDUwMCwgdHJ1ZSk7XG4gICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgICAgZXhwZWN0KHJlc3ApLnRvLm5vdC5iZS5vaygpO1xuICAgICAgZXhwZWN0KGVyci5tZXNzYWdlKS50by5tYXRjaCgvQ2Fubm90IGZpbmQgYSBtZXRob2QgdG8gdHJhbnNwb3J0Lyk7XG4gICAgICBleHBlY3QocmVxdWVzdEZhY3RvcnkuZ2V0SW5zdGFuY2UoKS50aW1lb3V0KS50by5lcXVhbChvcHRpb25zLnRpbWVvdXQpO1xuICAgICAgZG9uZShyZXNwKTtcbiAgICB9O1xuICAgIHQucG9zdChhY2Nlc3NUb2tlbiwgb3B0aW9ucywgcGF5bG9hZCwgY2FsbGJhY2ssIHJlcXVlc3RGYWN0b3J5LmdldEluc3RhbmNlKTtcbiAgfSk7XG4gIGRlc2NyaWJlKCdwb3N0JywgZnVuY3Rpb24gKCkge1xuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgIHdpbmRvdy5mZXRjaFN0dWIgPSBzaW5vbi5zdHViKHdpbmRvdywgJ2ZldGNoJyk7XG4gICAgICB3aW5kb3cuc2VydmVyID0gc2lub24uY3JlYXRlRmFrZVNlcnZlcigpO1xuICAgICAgZG9uZSgpO1xuICAgIH0pO1xuXG4gICAgYWZ0ZXJFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbmRvdy5mZXRjaC5yZXN0b3JlKCk7XG4gICAgICB3aW5kb3cuc2VydmVyLnJlc3RvcmUoKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHN0dWJGZXRjaFJlc3BvbnNlKCkge1xuICAgICAgd2luZG93LmZldGNoLnJldHVybnMoXG4gICAgICAgIFByb21pc2UucmVzb2x2ZShcbiAgICAgICAgICBuZXcgUmVzcG9uc2UoXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7IGVycjogMCwgbWVzc2FnZTogJ09LJywgcmVzdWx0OiB7IHV1aWQ6IHV1aWQgfSB9KSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgIHN0YXR1c1RleHQ6ICdPSycsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICApLFxuICAgICAgICApLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdHViWGhyUmVzcG9uc2UoKSB7XG4gICAgICB3aW5kb3cuc2VydmVyLnJlc3BvbmRXaXRoKFtcbiAgICAgICAgMjAwLFxuICAgICAgICB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgJ3tcImVyclwiOiAwLCBcInJlc3VsdFwiOnsgXCJ1dWlkXCI6IFwiZDRjN2FjZWY1NWJmNGM5ZWE5NWU0ZmU5NDI4YTgyODdcIn19JyxcbiAgICAgIF0pO1xuICAgIH1cblxuICAgIHZhciB1dWlkID0gJ2Q0YzdhY2VmNTViZjRjOWVhOTVlNGZlOTQyOGE4Mjg3JztcblxuICAgIGl0KCdzaG91bGQgdXNlIGZldGNoIHdoZW4gcmVxdWVzdGVkJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgICAgZXhwZWN0KHdpbmRvdy5mZXRjaFN0dWIuY2FsbGVkKS50by5iZS5vaygpO1xuICAgICAgICBleHBlY3Qoc2VydmVyLnJlcXVlc3RzLmxlbmd0aCkudG8uZXFsKDApO1xuICAgICAgICBkb25lKGVycik7XG4gICAgICB9O1xuICAgICAgc3R1YkZldGNoUmVzcG9uc2UoKTtcbiAgICAgIHN0dWJYaHJSZXNwb25zZSgpO1xuICAgICAgc2VydmVyLnJlcXVlc3RzLmxlbmd0aCA9IDA7XG4gICAgICBvcHRpb25zLnRyYW5zcG9ydCA9ICdmZXRjaCc7XG4gICAgICB0LnBvc3QoYWNjZXNzVG9rZW4sIG9wdGlvbnMsIHBheWxvYWQsIGNhbGxiYWNrKTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIHVzZSB4aHIgd2hlbiByZXF1ZXN0ZWQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgICAgICBleHBlY3Qod2luZG93LmZldGNoU3R1Yi5jYWxsZWQpLnRvLm5vdC5iZS5vaygpO1xuICAgICAgICBleHBlY3Qoc2VydmVyLnJlcXVlc3RzLmxlbmd0aCkudG8uZXFsKDEpO1xuICAgICAgICBkb25lKGVycik7XG4gICAgICB9O1xuICAgICAgc3R1YkZldGNoUmVzcG9uc2UoKTtcbiAgICAgIHN0dWJYaHJSZXNwb25zZSgpO1xuICAgICAgc2VydmVyLnJlcXVlc3RzLmxlbmd0aCA9IDA7XG4gICAgICBvcHRpb25zLnRyYW5zcG9ydCA9ICd4aHInO1xuICAgICAgdC5wb3N0KGFjY2Vzc1Rva2VuLCBvcHRpb25zLCBwYXlsb2FkLCBjYWxsYmFjayk7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VydmVyLnJlc3BvbmQoKTtcbiAgICAgIH0sIDEpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG52YXIgVGVzdFJlcXVlc3QgPSBmdW5jdGlvbiAocmVzcG9uc2UsIHN0YXR1cywgc2hvdWxkVGhyb3dPblNlbmQpIHtcbiAgdGhpcy5tZXRob2QgPSBudWxsO1xuICB0aGlzLnVybCA9IG51bGw7XG4gIHRoaXMuYXN5bmMgPSBmYWxzZTtcbiAgdGhpcy5oZWFkZXJzID0gW107XG4gIHRoaXMuZGF0YSA9IG51bGw7XG4gIHRoaXMucmVzcG9uc2VUZXh0ID0gcmVzcG9uc2U7XG4gIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICB0aGlzLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gIHRoaXMucmVhZHlTdGF0ZSA9IDA7XG4gIHRoaXMuc2hvdWxkVGhyb3dPblNlbmQgPSBzaG91bGRUaHJvd09uU2VuZDtcbn07XG5UZXN0UmVxdWVzdC5wcm90b3R5cGUub3BlbiA9IGZ1bmN0aW9uIChtLCB1LCBhKSB7XG4gIHRoaXMubWV0aG9kID0gbTtcbiAgdGhpcy51cmwgPSB1O1xuICB0aGlzLmFzeW5jID0gYTtcbn07XG5UZXN0UmVxdWVzdC5wcm90b3R5cGUuc2V0UmVxdWVzdEhlYWRlciA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHRoaXMuaGVhZGVycy5wdXNoKFtrZXksIHZhbHVlXSk7XG59O1xuVGVzdFJlcXVlc3QucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICBpZiAodGhpcy5zaG91bGRUaHJvd09uU2VuZCkge1xuICAgIHRocm93ICdCb3JrIEJvcmsnO1xuICB9XG4gIHRoaXMuZGF0YSA9IGRhdGE7XG4gIGlmICh0aGlzLm9ucmVhZHlzdGF0ZWNoYW5nZSkge1xuICAgIHRoaXMucmVhZHlTdGF0ZSA9IDQ7XG4gICAgdGhpcy5vbnJlYWR5c3RhdGVjaGFuZ2UoKTtcbiAgfVxufTtcblxudmFyIHJlcXVlc3RHZW5lcmF0b3IgPSBmdW5jdGlvbiAocmVzcG9uc2UsIHN0YXR1cywgc2hvdWxkVGhyb3cpIHtcbiAgdmFyIHJlcXVlc3Q7XG4gIHJldHVybiB7XG4gICAgZ2V0SW5zdGFuY2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICByZXF1ZXN0ID0gbmV3IFRlc3RSZXF1ZXN0KHJlc3BvbnNlLCBzdGF0dXMsIHNob3VsZFRocm93KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXF1ZXN0O1xuICAgIH0sXG4gIH07XG59O1xuIl0sIm5hbWVzIjpbImdldElFVmVyc2lvbiIsInVuZGVmIiwiZG9jdW1lbnQiLCJ2IiwiZGl2IiwiY3JlYXRlRWxlbWVudCIsImFsbCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiaW5uZXJIVE1MIiwiRGV0ZWN0aW9uIiwiaWVWZXJzaW9uIiwibW9kdWxlIiwiZXhwb3J0cyIsInJlcXVpcmUiLCJkZXRlY3Rpb24iLCJfIiwiZXJyb3IiLCJhcmdzIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzbGljZSIsImNhbGwiLCJhcmd1bWVudHMiLCJ1bnNoaWZ0IiwiY29uc29sZSIsImZvcm1hdEFyZ3NBc1N0cmluZyIsImFwcGx5IiwiaW5mbyIsImxvZyIsIm1ha2VGZXRjaFJlcXVlc3QiLCJtYWtlWGhyUmVxdWVzdCIsIlRyYW5zcG9ydCIsInRydW5jYXRpb24iLCJnZXQiLCJhY2Nlc3NUb2tlbiIsIm9wdGlvbnMiLCJwYXJhbXMiLCJjYWxsYmFjayIsInJlcXVlc3RGYWN0b3J5IiwiaXNGdW5jdGlvbiIsImFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoIiwibWV0aG9kIiwidXJsIiwiZm9ybWF0VXJsIiwiX21ha2Vab25lUmVxdWVzdCIsInRpbWVvdXQiLCJ0cmFuc3BvcnQiLCJwb3N0IiwicGF5bG9hZCIsIkVycm9yIiwic3RyaW5naWZ5UmVzdWx0IiwidHJ1bmNhdGUiLCJzdHJpbmdpZnkiLCJ3cml0ZURhdGEiLCJ2YWx1ZSIsInBvc3RKc29uUGF5bG9hZCIsImpzb25QYXlsb2FkIiwiZ1dpbmRvdyIsIndpbmRvdyIsInNlbGYiLCJyb290Wm9uZSIsIlpvbmUiLCJyb290IiwicnVuIiwiX21ha2VSZXF1ZXN0IiwidW5kZWZpbmVkIiwiZGF0YSIsIlJvbGxiYXJQcm94eSIsIl9wcm94eVJlcXVlc3QiLCJqc29uIiwicm9sbGJhclByb3h5Iiwic2VuZEpzb25QYXlsb2FkIiwiX21zZyIsImVyciIsImxvZ2dlciIsImNvbnRyb2xsZXIiLCJ0aW1lb3V0SWQiLCJpc0Zpbml0ZU51bWJlciIsIkFib3J0Q29udHJvbGxlciIsInNldFRpbWVvdXQiLCJhYm9ydCIsImZldGNoIiwiaGVhZGVycyIsInNpZ25hbCIsImJvZHkiLCJ0aGVuIiwicmVzcG9uc2UiLCJjbGVhclRpbWVvdXQiLCJtZXNzYWdlIiwicmVxdWVzdCIsIl9jcmVhdGVYTUxIVFRQT2JqZWN0Iiwib25yZWFkeXN0YXRlY2hhbmdlIiwicmVhZHlTdGF0ZSIsInBhcnNlUmVzcG9uc2UiLCJqc29uUGFyc2UiLCJyZXNwb25zZVRleHQiLCJfaXNTdWNjZXNzIiwiX2lzTm9ybWFsRmFpbHVyZSIsInN0YXR1cyIsIlN0cmluZyIsIm1zZyIsIl9uZXdSZXRyaWFibGVFcnJvciIsImV4IiwiZXhjIiwic3RhY2siLCJvcGVuIiwic2V0UmVxdWVzdEhlYWRlciIsInNlbmQiLCJlMSIsIlhEb21haW5SZXF1ZXN0IiwibG9jYXRpb24iLCJocmVmIiwic3Vic3RyaW5nIiwieGRvbWFpbnJlcXVlc3QiLCJvbnByb2dyZXNzIiwib250aW1lb3V0IiwiY29kZSIsIm9uZXJyb3IiLCJvbmxvYWQiLCJlMiIsImZhY3RvcmllcyIsIlhNTEh0dHBSZXF1ZXN0IiwiQWN0aXZlWE9iamVjdCIsInhtbGh0dHAiLCJpIiwibnVtRmFjdG9yaWVzIiwibGVuZ3RoIiwiZSIsInIiLCJpc1R5cGUiLCJoYXNPd24iLCJPYmplY3QiLCJoYXNPd25Qcm9wZXJ0eSIsInRvU3RyIiwidG9TdHJpbmciLCJpc1BsYWluT2JqZWN0Iiwib2JqIiwiaGFzT3duQ29uc3RydWN0b3IiLCJoYXNJc1Byb3RvdHlwZU9mIiwiY29uc3RydWN0b3IiLCJrZXkiLCJtZXJnZSIsInNyYyIsImNvcHkiLCJjbG9uZSIsIm5hbWUiLCJyZXN1bHQiLCJjdXJyZW50IiwidHJhdmVyc2UiLCJyYXciLCJqc29uQmFja3VwIiwic2VsZWN0RnJhbWVzIiwiZnJhbWVzIiwicmFuZ2UiLCJsZW4iLCJjb25jYXQiLCJ0cnVuY2F0ZUZyYW1lcyIsInRyYWNlX2NoYWluIiwiY2hhaW4iLCJ0cmFjZSIsIm1heWJlVHJ1bmNhdGVWYWx1ZSIsInZhbCIsInRydW5jYXRlU3RyaW5ncyIsInRydW5jYXRvciIsImsiLCJzZWVuIiwidHlwZU5hbWUiLCJ0cnVuY2F0ZVRyYWNlRGF0YSIsInRyYWNlRGF0YSIsImV4Y2VwdGlvbiIsImRlc2NyaXB0aW9uIiwibWluQm9keSIsIm5lZWRzVHJ1bmNhdGlvbiIsIm1heFNpemUiLCJtYXhCeXRlU2l6ZSIsInN0cmF0ZWdpZXMiLCJiaW5kIiwic3RyYXRlZ3kiLCJyZXN1bHRzIiwic2hpZnQiLCJSb2xsYmFySlNPTiIsInNldHVwSlNPTiIsInBvbHlmaWxsSlNPTiIsInBhcnNlIiwiaXNEZWZpbmVkIiwiSlNPTiIsImlzTmF0aXZlRnVuY3Rpb24iLCJ4IiwidCIsIl90eXBlb2YiLCJtYXRjaCIsInRvTG93ZXJDYXNlIiwiZiIsInJlUmVnRXhwQ2hhciIsImZ1bmNNYXRjaFN0cmluZyIsIkZ1bmN0aW9uIiwicmVwbGFjZSIsInJlSXNOYXRpdmUiLCJSZWdFeHAiLCJpc09iamVjdCIsInRlc3QiLCJ0eXBlIiwiaXNTdHJpbmciLCJuIiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJ1IiwiaXNJdGVyYWJsZSIsImlzRXJyb3IiLCJpc1Byb21pc2UiLCJwIiwiaXNCcm93c2VyIiwicmVkYWN0IiwidXVpZDQiLCJkIiwibm93IiwidXVpZCIsImMiLCJNYXRoIiwicmFuZG9tIiwiZmxvb3IiLCJMRVZFTFMiLCJkZWJ1ZyIsIndhcm5pbmciLCJjcml0aWNhbCIsInNhbml0aXplVXJsIiwiYmFzZVVybFBhcnRzIiwicGFyc2VVcmkiLCJhbmNob3IiLCJzb3VyY2UiLCJxdWVyeSIsInBhcnNlVXJpT3B0aW9ucyIsInN0cmljdE1vZGUiLCJxIiwicGFyc2VyIiwic3RyaWN0IiwibG9vc2UiLCJzdHIiLCJvIiwibSIsImV4ZWMiLCJ1cmkiLCJsIiwiJDAiLCIkMSIsIiQyIiwiYWNjZXNzX3Rva2VuIiwicGFyYW1zQXJyYXkiLCJwdXNoIiwiam9pbiIsInNvcnQiLCJwYXRoIiwicXMiLCJpbmRleE9mIiwiaCIsInByb3RvY29sIiwicG9ydCIsImhvc3RuYW1lIiwiYmFja3VwIiwianNvbkVycm9yIiwiYmFja3VwRXJyb3IiLCJzdHJpbmciLCJjb3VudCIsImNoYXJDb2RlQXQiLCJzIiwibWFrZVVuaGFuZGxlZFN0YWNrSW5mbyIsImxpbmVubyIsImNvbG5vIiwibW9kZSIsImJhY2t1cE1lc3NhZ2UiLCJlcnJvclBhcnNlciIsImxpbmUiLCJjb2x1bW4iLCJmdW5jIiwiZ3Vlc3NGdW5jdGlvbk5hbWUiLCJjb250ZXh0IiwiZ2F0aGVyQ29udGV4dCIsInVzZXJhZ2VudCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsIndyYXBDYWxsYmFjayIsInJlc3AiLCJub25DaXJjdWxhckNsb25lIiwibmV3U2VlbiIsImluY2x1ZGVzIiwiY3JlYXRlSXRlbSIsIm5vdGlmaWVyIiwicmVxdWVzdEtleXMiLCJsYW1iZGFDb250ZXh0IiwiY3VzdG9tIiwiYXJnIiwiZXh0cmFBcmdzIiwiZGlhZ25vc3RpYyIsImFyZ1R5cGVzIiwidHlwIiwiRE9NRXhjZXB0aW9uIiwiaiIsIml0ZW0iLCJ0aW1lc3RhbXAiLCJzZXRDdXN0b21JdGVtS2V5cyIsIl9vcmlnaW5hbEFyZ3MiLCJvcmlnaW5hbF9hcmdfdHlwZXMiLCJsZXZlbCIsInNraXBGcmFtZXMiLCJhZGRFcnJvckNvbnRleHQiLCJlcnJvcnMiLCJjb250ZXh0QWRkZWQiLCJyb2xsYmFyQ29udGV4dCIsImVycm9yX2NvbnRleHQiLCJURUxFTUVUUllfVFlQRVMiLCJURUxFTUVUUllfTEVWRUxTIiwiYXJyYXlJbmNsdWRlcyIsImFyciIsImNyZWF0ZVRlbGVtZXRyeUV2ZW50IiwibWV0YWRhdGEiLCJldmVudCIsImFkZEl0ZW1BdHRyaWJ1dGVzIiwiYXR0cmlidXRlcyIsIl9pdGVtJGRhdGEkYXR0cmlidXRlcyIsIl90b0NvbnN1bWFibGVBcnJheSIsImtleXMiLCJzcGxpdCIsInNldCIsInRlbXAiLCJyZXBsYWNlbWVudCIsInN1YnN0ciIsIkRhdGUiLCJmaWx0ZXJJcCIsInJlcXVlc3REYXRhIiwiY2FwdHVyZUlwIiwibmV3SXAiLCJwYXJ0cyIsInBvcCIsImJlZ2lubmluZyIsInNsYXNoSWR4IiwidGVybWluYWwiLCJoYW5kbGVPcHRpb25zIiwiaW5wdXQiLCJ1cGRhdGVEZXByZWNhdGVkT3B0aW9ucyIsIm92ZXJ3cml0ZVNjcnViRmllbGRzIiwic2NydWJGaWVsZHMiLCJob3N0V2hpdGVMaXN0IiwiaG9zdFNhZmVMaXN0IiwiaG9zdEJsYWNrTGlzdCIsImhvc3RCbG9ja0xpc3QiLCJpc09iaiIsImlzQXJyYXkiLCJzZWVuSW5kZXgiLCJtYXBwZWQiLCJzYW1lIl0sInNvdXJjZVJvb3QiOiIifQ==