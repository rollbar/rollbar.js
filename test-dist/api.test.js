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

/***/ "./src/api.js":
/*!********************!*\
  !*** ./src/api.js ***!
  \********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");
var helpers = __webpack_require__(/*! ./apiUtility */ "./src/apiUtility.js");
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
 * Api is an object that encapsulates methods of communicating with
 * the Rollbar API.  It is a standard interface with some parts implemented
 * differently for server or browser contexts.  It is an object that should
 * be instantiated when used so it can contain non-global options that may
 * be different for another instance of RollbarApi.
 *
 * @param options {
 *    accessToken: the accessToken to use for posting items to rollbar
 *    endpoint: an alternative endpoint to send errors to
 *        must be a valid, fully qualified URL.
 *        The default is: https://api.rollbar.com/api/1/item
 *    proxy: if you wish to proxy requests provide an object
 *        with the following keys:
 *          host or hostname (required): foo.example.com
 *          port (optional): 123
 *          protocol (optional): https
 * }
 */
function Api(options, transport, urllib, truncation) {
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
Api.prototype._postPromise = function (_ref) {
  var accessToken = _ref.accessToken,
    transportOptions = _ref.transportOptions,
    payload = _ref.payload;
  var self = this;
  return new Promise(function (resolve, reject) {
    self.transport.post(accessToken, transportOptions, payload, function (err, resp) {
      return err ? reject(err) : resolve(resp);
    });
  });
};

/**
 *
 * @param data
 * @param callback
 */
Api.prototype.postItem = function (data, callback) {
  var transportOptions = helpers.transportOptions(this.transportOptions, 'POST');
  var payload = helpers.buildPayload(data);
  var self = this;

  // ensure the network request is scheduled after the current tick.
  setTimeout(function () {
    self.transport.post(self.accessToken, transportOptions, payload, callback);
  }, 0);
};

/**
 * Posts spans to the Rollbar API using the session endpoint
 *
 * @param {Array} payload - The spans to send
 * @returns {Promise<Object>} A promise that resolves with the API response
 */
Api.prototype.postSpans = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(payload) {
    var transportOptions;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          transportOptions = helpers.transportOptions(this.OTLPTransportOptions, 'POST');
          _context.next = 3;
          return this._postPromise({
            accessToken: this.accessToken,
            transportOptions: transportOptions,
            payload: payload
          });
        case 3:
          return _context.abrupt("return", _context.sent);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee, this);
  }));
  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 *
 * @param data
 * @param callback
 */
Api.prototype.buildJsonPayload = function (data, callback) {
  var payload = helpers.buildPayload(data);
  var stringifyResult;
  if (this.truncation) {
    stringifyResult = this.truncation.truncate(payload);
  } else {
    stringifyResult = _.stringify(payload);
  }
  if (stringifyResult.error) {
    if (callback) {
      callback(stringifyResult.error);
    }
    return null;
  }
  return stringifyResult.value;
};

/**
 *
 * @param jsonPayload
 * @param callback
 */
Api.prototype.postJsonPayload = function (jsonPayload, callback) {
  var transportOptions = helpers.transportOptions(this.transportOptions, 'POST');
  this.transport.postJsonPayload(this.accessToken, transportOptions, jsonPayload, callback);
};
Api.prototype.configure = function (options) {
  var oldOptions = this.oldOptions;
  this.options = _.merge(oldOptions, options);
  this.transportOptions = _getTransport(this.options, this.url);
  this.OTLPTransportOptions = _getOTLPTransport(this.options, this.url);
  if (this.options.accessToken !== undefined) {
    this.accessToken = this.options.accessToken;
  }
  return this;
};
function _getTransport(options, url) {
  return helpers.getTransportFromOptions(options, defaultOptions, url);
}
function _getOTLPTransport(options, url) {
  var _options$tracing;
  options = _objectSpread(_objectSpread({}, options), {}, {
    endpoint: (_options$tracing = options.tracing) === null || _options$tracing === void 0 ? void 0 : _options$tracing.endpoint
  });
  return helpers.getTransportFromOptions(options, OTLPDefaultOptions, url);
}
module.exports = Api;

/***/ }),

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

/***/ "./src/browser/url.js":
/*!****************************!*\
  !*** ./src/browser/url.js ***!
  \****************************/
/***/ ((module) => {

// See https://nodejs.org/docs/latest/api/url.html
function parse(url) {
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
module.exports = {
  parse: parse
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
/*!**************************!*\
  !*** ./test/api.test.js ***!
  \**************************/
/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var API = __webpack_require__(/*! ../src/api */ "./src/api.js");
var utility = __webpack_require__(/*! ../src/utility */ "./src/utility.js");
utility.setupJSON();

function TestTransportGenerator() {
  var TestTransport = function (callbackError, callbackResponse) {
    this.postArgs = [];
    this.callbackError = callbackError;
    this.callbackResponse = callbackResponse;
  };

  TestTransport.prototype.post = function () {
    var args = arguments;
    this.postArgs.push(args);
    var callback = args[args.length - 1];
    if (typeof callback === 'function') {
      callback(this.callbackError, this.callbackResponse);
    }
  };

  return TestTransport;
}

describe('Api()', function () {
  it('use the defaults if no custom endpoint is given', function (done) {
    var a = undefined;
    a.hello();

    var transport = new (TestTransportGenerator())();
    var url = {
      parse: function (e) {
        expect(false).to.be.ok();
      },
    };
    var accessToken = 'abc123';
    var options = { accessToken: accessToken };
    var api = new API(options, transport, url);
    // I know this is testing internal state but it
    // is the most expedient way to do this
    expect(api.accessToken).to.eql(accessToken);
    expect(api.transportOptions.hostname).to.eql('api.rollbar.com');
    expect(api.transportOptions.path).to.match(/\/api\/1/);
    expect(api.transportOptions.protocol).to.eql('https:');
    done();
  });
  it('should parse the endpoint and use that if given', function (done) {
    var transport = new (TestTransportGenerator())();
    var endpoint = 'http://woo.foo.com/api/42';
    var url = {
      parse: function (e) {
        expect(e).to.eql(endpoint);
        return {
          hostname: 'woo.foo.com',
          protocol: 'http:',
          pathname: '/api/42',
          path: '/api/42',
        };
      },
    };
    var accessToken = 'abc123';
    var options = { accessToken: accessToken, endpoint: endpoint };
    var api = new API(options, transport, url);
    expect(api.accessToken).to.eql(accessToken);
    expect(api.transportOptions.hostname).to.eql('woo.foo.com');
    expect(api.transportOptions.path).to.match(/\/api\/42/);
    expect(api.transportOptions.protocol).to.eql('http:');
    done();
  });
});

describe('postItem', function () {
  it('should call post on the transport object', function (done) {
    var response = 'yes';
    var transport = new (TestTransportGenerator())(null, response);
    var url = {
      parse: function (e) {
        expect(false).to.be.ok();
      },
    };
    var accessToken = 'abc123';
    var options = { accessToken: accessToken };
    var api = new API(options, transport, url);

    var data = { a: 1 };
    api.postItem(data, function (err, resp) {
      expect(err).to.not.be.ok();
      expect(resp).to.eql(response);
      expect(transport.postArgs.length).to.eql(1);
      expect(transport.postArgs[0][0]).to.eql(accessToken);
      expect(transport.postArgs[0][1].path).to.match(/\/item\//);
      expect(transport.postArgs[0][2].data.a).to.eql(1);
      done();
    });
  });
  it('should stringify context', function (done) {
    var response = 'yes';
    var transport = new (TestTransportGenerator())(null, response);
    var url = {
      parse: function (e) {
        expect(false).to.be.ok();
      },
    };
    var accessToken = 'abc123';
    var options = { accessToken: accessToken };
    var api = new API(options, transport, url);

    var data = { a: 1, context: { some: [1, 2, 'stuff'] } };
    api.postItem(data, function (err, resp) {
      expect(err).to.not.be.ok();
      expect(resp).to.eql(response);
      expect(transport.postArgs.length).to.eql(1);
      expect(transport.postArgs[0][0]).to.eql(accessToken);
      expect(transport.postArgs[0][1].path).to.match(/\/item\//);
      expect(transport.postArgs[0][1].method).to.eql('POST');
      expect(transport.postArgs[0][2].data.a).to.eql(1);
      expect(transport.postArgs[0][2].data.context).to.eql(
        '{"some":[1,2,"stuff"]}',
      );
      done();
    });
  });
});

describe('postSpans', function () {
  let transport;

  beforeEach(function () {
    // Create mock transport
    transport = {
      post: sinon
        .stub()
        .callsFake((accessToken, options, payload, callback) => {
          callback(null, { result: 'ok' });
        }),
      postJsonPayload: sinon.stub(),
    };
  });

  afterEach(function () {
    sinon.restore();
  });

  it('should call post on the transport object', async function () {
    const urllib = __webpack_require__(/*! ../src/browser/url */ "./src/browser/url.js");
    const response = 'yes';
    const url = {
      parse: function (e) {
        expect(false).to.be.ok();
      },
    };
    const accessToken = 'abc123';
    const options = {
      accessToken: accessToken,
      tracing: {
        enabled: true,
        endpoint: 'https://api.rollbar.com/api/1/session/',
      },
    };
    const api = new API(options, transport, urllib);

    const data = { a: 1 };
    await api.postSpans(data);

    expect(transport.post.called).to.be.true;

    expect(transport.post.callCount).to.eql(1);
    expect(transport.post.firstCall.args.length).to.eql(4);
    expect(transport.post.firstCall.args[0]).to.eql(accessToken);
    expect(transport.post.firstCall.args[1].path).to.match(/\/session\//);
    expect(transport.post.firstCall.args[1].method).to.eql('POST');
    expect(transport.post.firstCall.args[2].a).to.eql(1);
  });
});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFvQjtBQUNwQjs7QUFFQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7O0FBRUEsaUJBQWlCLGlCQUFpQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLHFCQUFxQjtBQUMvQjtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGNBQWM7QUFDekMsU0FBUztBQUNUO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsbUJBQW1CLG1CQUFPLENBQUMsZ0RBQW9CO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUEsbUJBQW1CO0FBQ25COztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcm9sbGJhci93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9hcGkuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9hcGlVdGlsaXR5LmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvYnJvd3Nlci91cmwuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9tZXJnZS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vdGVzdC9hcGkudGVzdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoc2VsZiwgKCkgPT4ge1xucmV0dXJuICIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsaXR5Jyk7XG52YXIgaGVscGVycyA9IHJlcXVpcmUoJy4vYXBpVXRpbGl0eScpO1xuXG52YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGhvc3RuYW1lOiAnYXBpLnJvbGxiYXIuY29tJyxcbiAgcGF0aDogJy9hcGkvMS9pdGVtLycsXG4gIHNlYXJjaDogbnVsbCxcbiAgdmVyc2lvbjogJzEnLFxuICBwcm90b2NvbDogJ2h0dHBzOicsXG4gIHBvcnQ6IDQ0Myxcbn07XG5cbnZhciBPVExQRGVmYXVsdE9wdGlvbnMgPSB7XG4gIGhvc3RuYW1lOiAnYXBpLnJvbGxiYXIuY29tJyxcbiAgcGF0aDogJy9hcGkvMS9zZXNzaW9uLycsXG4gIHNlYXJjaDogbnVsbCxcbiAgdmVyc2lvbjogJzEnLFxuICBwcm90b2NvbDogJ2h0dHBzOicsXG4gIHBvcnQ6IDQ0Myxcbn07XG5cbi8qKlxuICogQXBpIGlzIGFuIG9iamVjdCB0aGF0IGVuY2Fwc3VsYXRlcyBtZXRob2RzIG9mIGNvbW11bmljYXRpbmcgd2l0aFxuICogdGhlIFJvbGxiYXIgQVBJLiAgSXQgaXMgYSBzdGFuZGFyZCBpbnRlcmZhY2Ugd2l0aCBzb21lIHBhcnRzIGltcGxlbWVudGVkXG4gKiBkaWZmZXJlbnRseSBmb3Igc2VydmVyIG9yIGJyb3dzZXIgY29udGV4dHMuICBJdCBpcyBhbiBvYmplY3QgdGhhdCBzaG91bGRcbiAqIGJlIGluc3RhbnRpYXRlZCB3aGVuIHVzZWQgc28gaXQgY2FuIGNvbnRhaW4gbm9uLWdsb2JhbCBvcHRpb25zIHRoYXQgbWF5XG4gKiBiZSBkaWZmZXJlbnQgZm9yIGFub3RoZXIgaW5zdGFuY2Ugb2YgUm9sbGJhckFwaS5cbiAqXG4gKiBAcGFyYW0gb3B0aW9ucyB7XG4gKiAgICBhY2Nlc3NUb2tlbjogdGhlIGFjY2Vzc1Rva2VuIHRvIHVzZSBmb3IgcG9zdGluZyBpdGVtcyB0byByb2xsYmFyXG4gKiAgICBlbmRwb2ludDogYW4gYWx0ZXJuYXRpdmUgZW5kcG9pbnQgdG8gc2VuZCBlcnJvcnMgdG9cbiAqICAgICAgICBtdXN0IGJlIGEgdmFsaWQsIGZ1bGx5IHF1YWxpZmllZCBVUkwuXG4gKiAgICAgICAgVGhlIGRlZmF1bHQgaXM6IGh0dHBzOi8vYXBpLnJvbGxiYXIuY29tL2FwaS8xL2l0ZW1cbiAqICAgIHByb3h5OiBpZiB5b3Ugd2lzaCB0byBwcm94eSByZXF1ZXN0cyBwcm92aWRlIGFuIG9iamVjdFxuICogICAgICAgIHdpdGggdGhlIGZvbGxvd2luZyBrZXlzOlxuICogICAgICAgICAgaG9zdCBvciBob3N0bmFtZSAocmVxdWlyZWQpOiBmb28uZXhhbXBsZS5jb21cbiAqICAgICAgICAgIHBvcnQgKG9wdGlvbmFsKTogMTIzXG4gKiAgICAgICAgICBwcm90b2NvbCAob3B0aW9uYWwpOiBodHRwc1xuICogfVxuICovXG5mdW5jdGlvbiBBcGkob3B0aW9ucywgdHJhbnNwb3J0LCB1cmxsaWIsIHRydW5jYXRpb24pIHtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgdGhpcy50cmFuc3BvcnQgPSB0cmFuc3BvcnQ7XG4gIHRoaXMudXJsID0gdXJsbGliO1xuICB0aGlzLnRydW5jYXRpb24gPSB0cnVuY2F0aW9uO1xuICB0aGlzLmFjY2Vzc1Rva2VuID0gb3B0aW9ucy5hY2Nlc3NUb2tlbjtcbiAgdGhpcy50cmFuc3BvcnRPcHRpb25zID0gX2dldFRyYW5zcG9ydChvcHRpb25zLCB1cmxsaWIpO1xuICB0aGlzLk9UTFBUcmFuc3BvcnRPcHRpb25zID0gX2dldE9UTFBUcmFuc3BvcnQob3B0aW9ucywgdXJsbGliKTtcbn1cblxuLyoqXG4gKiBXcmFwcyB0cmFuc3BvcnQucG9zdCBpbiBhIFByb21pc2UgdG8gc3VwcG9ydCBhc3luYy9hd2FpdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyBmb3IgdGhlIEFQSSByZXF1ZXN0XG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5hY2Nlc3NUb2tlbiAtIFRoZSBhY2Nlc3MgdG9rZW4gZm9yIGF1dGhlbnRpY2F0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy50cmFuc3BvcnRPcHRpb25zIC0gT3B0aW9ucyBmb3IgdGhlIHRyYW5zcG9ydFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMucGF5bG9hZCAtIFRoZSBkYXRhIHBheWxvYWQgdG8gc2VuZFxuICogQHJldHVybnMge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIHJlc3BvbnNlIG9yIHJlamVjdHMgd2l0aCBhbiBlcnJvclxuICogQHByaXZhdGVcbiAqL1xuQXBpLnByb3RvdHlwZS5fcG9zdFByb21pc2UgPSBmdW5jdGlvbih7IGFjY2Vzc1Rva2VuLCB0cmFuc3BvcnRPcHRpb25zLCBwYXlsb2FkIH0pIHtcbiAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgc2VsZi50cmFuc3BvcnQucG9zdChhY2Nlc3NUb2tlbiwgdHJhbnNwb3J0T3B0aW9ucywgcGF5bG9hZCwgKGVyciwgcmVzcCkgPT5cbiAgICAgIGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZShyZXNwKVxuICAgICk7XG4gIH0pO1xufTtcblxuLyoqXG4gKlxuICogQHBhcmFtIGRhdGFcbiAqIEBwYXJhbSBjYWxsYmFja1xuICovXG5BcGkucHJvdG90eXBlLnBvc3RJdGVtID0gZnVuY3Rpb24gKGRhdGEsIGNhbGxiYWNrKSB7XG4gIHZhciB0cmFuc3BvcnRPcHRpb25zID0gaGVscGVycy50cmFuc3BvcnRPcHRpb25zKFxuICAgIHRoaXMudHJhbnNwb3J0T3B0aW9ucyxcbiAgICAnUE9TVCcsXG4gICk7XG4gIHZhciBwYXlsb2FkID0gaGVscGVycy5idWlsZFBheWxvYWQoZGF0YSk7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICAvLyBlbnN1cmUgdGhlIG5ldHdvcmsgcmVxdWVzdCBpcyBzY2hlZHVsZWQgYWZ0ZXIgdGhlIGN1cnJlbnQgdGljay5cbiAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi50cmFuc3BvcnQucG9zdChzZWxmLmFjY2Vzc1Rva2VuLCB0cmFuc3BvcnRPcHRpb25zLCBwYXlsb2FkLCBjYWxsYmFjayk7XG4gIH0sIDApO1xufTtcblxuLyoqXG4gKiBQb3N0cyBzcGFucyB0byB0aGUgUm9sbGJhciBBUEkgdXNpbmcgdGhlIHNlc3Npb24gZW5kcG9pbnRcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwYXlsb2FkIC0gVGhlIHNwYW5zIHRvIHNlbmRcbiAqIEByZXR1cm5zIHtQcm9taXNlPE9iamVjdD59IEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIEFQSSByZXNwb25zZVxuICovXG5BcGkucHJvdG90eXBlLnBvc3RTcGFucyA9IGFzeW5jIGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gIGNvbnN0IHRyYW5zcG9ydE9wdGlvbnMgPSBoZWxwZXJzLnRyYW5zcG9ydE9wdGlvbnMoXG4gICAgdGhpcy5PVExQVHJhbnNwb3J0T3B0aW9ucyxcbiAgICAnUE9TVCcsXG4gICk7XG5cbiAgcmV0dXJuIGF3YWl0IHRoaXMuX3Bvc3RQcm9taXNlKHtcbiAgICBhY2Nlc3NUb2tlbjogdGhpcy5hY2Nlc3NUb2tlbixcbiAgICB0cmFuc3BvcnRPcHRpb25zLFxuICAgIHBheWxvYWRcbiAgfSk7XG59O1xuXG4vKipcbiAqXG4gKiBAcGFyYW0gZGF0YVxuICogQHBhcmFtIGNhbGxiYWNrXG4gKi9cbkFwaS5wcm90b3R5cGUuYnVpbGRKc29uUGF5bG9hZCA9IGZ1bmN0aW9uIChkYXRhLCBjYWxsYmFjaykge1xuICB2YXIgcGF5bG9hZCA9IGhlbHBlcnMuYnVpbGRQYXlsb2FkKGRhdGEpO1xuXG4gIHZhciBzdHJpbmdpZnlSZXN1bHQ7XG4gIGlmICh0aGlzLnRydW5jYXRpb24pIHtcbiAgICBzdHJpbmdpZnlSZXN1bHQgPSB0aGlzLnRydW5jYXRpb24udHJ1bmNhdGUocGF5bG9hZCk7XG4gIH0gZWxzZSB7XG4gICAgc3RyaW5naWZ5UmVzdWx0ID0gXy5zdHJpbmdpZnkocGF5bG9hZCk7XG4gIH1cblxuICBpZiAoc3RyaW5naWZ5UmVzdWx0LmVycm9yKSB7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjayhzdHJpbmdpZnlSZXN1bHQuZXJyb3IpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBzdHJpbmdpZnlSZXN1bHQudmFsdWU7XG59O1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ganNvblBheWxvYWRcbiAqIEBwYXJhbSBjYWxsYmFja1xuICovXG5BcGkucHJvdG90eXBlLnBvc3RKc29uUGF5bG9hZCA9IGZ1bmN0aW9uIChqc29uUGF5bG9hZCwgY2FsbGJhY2spIHtcbiAgdmFyIHRyYW5zcG9ydE9wdGlvbnMgPSBoZWxwZXJzLnRyYW5zcG9ydE9wdGlvbnMoXG4gICAgdGhpcy50cmFuc3BvcnRPcHRpb25zLFxuICAgICdQT1NUJyxcbiAgKTtcbiAgdGhpcy50cmFuc3BvcnQucG9zdEpzb25QYXlsb2FkKFxuICAgIHRoaXMuYWNjZXNzVG9rZW4sXG4gICAgdHJhbnNwb3J0T3B0aW9ucyxcbiAgICBqc29uUGF5bG9hZCxcbiAgICBjYWxsYmFjayxcbiAgKTtcbn07XG5cbkFwaS5wcm90b3R5cGUuY29uZmlndXJlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdmFyIG9sZE9wdGlvbnMgPSB0aGlzLm9sZE9wdGlvbnM7XG4gIHRoaXMub3B0aW9ucyA9IF8ubWVyZ2Uob2xkT3B0aW9ucywgb3B0aW9ucyk7XG4gIHRoaXMudHJhbnNwb3J0T3B0aW9ucyA9IF9nZXRUcmFuc3BvcnQodGhpcy5vcHRpb25zLCB0aGlzLnVybCk7XG4gIHRoaXMuT1RMUFRyYW5zcG9ydE9wdGlvbnMgPSBfZ2V0T1RMUFRyYW5zcG9ydCh0aGlzLm9wdGlvbnMsIHRoaXMudXJsKTtcbiAgaWYgKHRoaXMub3B0aW9ucy5hY2Nlc3NUb2tlbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5hY2Nlc3NUb2tlbiA9IHRoaXMub3B0aW9ucy5hY2Nlc3NUb2tlbjtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbmZ1bmN0aW9uIF9nZXRUcmFuc3BvcnQob3B0aW9ucywgdXJsKSB7XG4gIHJldHVybiBoZWxwZXJzLmdldFRyYW5zcG9ydEZyb21PcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zLCB1cmwpO1xufVxuXG5mdW5jdGlvbiBfZ2V0T1RMUFRyYW5zcG9ydChvcHRpb25zLCB1cmwpIHtcbiAgb3B0aW9ucyA9IHsuLi5vcHRpb25zLCBlbmRwb2ludDogb3B0aW9ucy50cmFjaW5nPy5lbmRwb2ludH07XG4gIHJldHVybiBoZWxwZXJzLmdldFRyYW5zcG9ydEZyb21PcHRpb25zKG9wdGlvbnMsIE9UTFBEZWZhdWx0T3B0aW9ucywgdXJsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcGk7XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbGl0eScpO1xuXG5mdW5jdGlvbiBidWlsZFBheWxvYWQoZGF0YSkge1xuICBpZiAoIV8uaXNUeXBlKGRhdGEuY29udGV4dCwgJ3N0cmluZycpKSB7XG4gICAgdmFyIGNvbnRleHRSZXN1bHQgPSBfLnN0cmluZ2lmeShkYXRhLmNvbnRleHQpO1xuICAgIGlmIChjb250ZXh0UmVzdWx0LmVycm9yKSB7XG4gICAgICBkYXRhLmNvbnRleHQgPSBcIkVycm9yOiBjb3VsZCBub3Qgc2VyaWFsaXplICdjb250ZXh0J1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhLmNvbnRleHQgPSBjb250ZXh0UmVzdWx0LnZhbHVlIHx8ICcnO1xuICAgIH1cbiAgICBpZiAoZGF0YS5jb250ZXh0Lmxlbmd0aCA+IDI1NSkge1xuICAgICAgZGF0YS5jb250ZXh0ID0gZGF0YS5jb250ZXh0LnN1YnN0cigwLCAyNTUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIGRhdGE6IGRhdGEsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldFRyYW5zcG9ydEZyb21PcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRzLCB1cmwpIHtcbiAgdmFyIGhvc3RuYW1lID0gZGVmYXVsdHMuaG9zdG5hbWU7XG4gIHZhciBwcm90b2NvbCA9IGRlZmF1bHRzLnByb3RvY29sO1xuICB2YXIgcG9ydCA9IGRlZmF1bHRzLnBvcnQ7XG4gIHZhciBwYXRoID0gZGVmYXVsdHMucGF0aDtcbiAgdmFyIHNlYXJjaCA9IGRlZmF1bHRzLnNlYXJjaDtcbiAgdmFyIHRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXQ7XG4gIHZhciB0cmFuc3BvcnQgPSBkZXRlY3RUcmFuc3BvcnQob3B0aW9ucyk7XG5cbiAgdmFyIHByb3h5ID0gb3B0aW9ucy5wcm94eTtcbiAgaWYgKG9wdGlvbnMuZW5kcG9pbnQpIHtcbiAgICB2YXIgb3B0cyA9IHVybC5wYXJzZShvcHRpb25zLmVuZHBvaW50KTtcbiAgICBob3N0bmFtZSA9IG9wdHMuaG9zdG5hbWU7XG4gICAgcHJvdG9jb2wgPSBvcHRzLnByb3RvY29sO1xuICAgIHBvcnQgPSBvcHRzLnBvcnQ7XG4gICAgcGF0aCA9IG9wdHMucGF0aG5hbWU7XG4gICAgc2VhcmNoID0gb3B0cy5zZWFyY2g7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgIGhvc3RuYW1lOiBob3N0bmFtZSxcbiAgICBwcm90b2NvbDogcHJvdG9jb2wsXG4gICAgcG9ydDogcG9ydCxcbiAgICBwYXRoOiBwYXRoLFxuICAgIHNlYXJjaDogc2VhcmNoLFxuICAgIHByb3h5OiBwcm94eSxcbiAgICB0cmFuc3BvcnQ6IHRyYW5zcG9ydCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gZGV0ZWN0VHJhbnNwb3J0KG9wdGlvbnMpIHtcbiAgdmFyIGdXaW5kb3cgPVxuICAgICh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdykgfHxcbiAgICAodHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZik7XG4gIHZhciB0cmFuc3BvcnQgPSBvcHRpb25zLmRlZmF1bHRUcmFuc3BvcnQgfHwgJ3hocic7XG4gIGlmICh0eXBlb2YgZ1dpbmRvdy5mZXRjaCA9PT0gJ3VuZGVmaW5lZCcpIHRyYW5zcG9ydCA9ICd4aHInO1xuICBpZiAodHlwZW9mIGdXaW5kb3cuWE1MSHR0cFJlcXVlc3QgPT09ICd1bmRlZmluZWQnKSB0cmFuc3BvcnQgPSAnZmV0Y2gnO1xuICByZXR1cm4gdHJhbnNwb3J0O1xufVxuXG5mdW5jdGlvbiB0cmFuc3BvcnRPcHRpb25zKHRyYW5zcG9ydCwgbWV0aG9kKSB7XG4gIHZhciBwcm90b2NvbCA9IHRyYW5zcG9ydC5wcm90b2NvbCB8fCAnaHR0cHM6JztcbiAgdmFyIHBvcnQgPVxuICAgIHRyYW5zcG9ydC5wb3J0IHx8XG4gICAgKHByb3RvY29sID09PSAnaHR0cDonID8gODAgOiBwcm90b2NvbCA9PT0gJ2h0dHBzOicgPyA0NDMgOiB1bmRlZmluZWQpO1xuICB2YXIgaG9zdG5hbWUgPSB0cmFuc3BvcnQuaG9zdG5hbWU7XG4gIHZhciBwYXRoID0gdHJhbnNwb3J0LnBhdGg7XG4gIHZhciB0aW1lb3V0ID0gdHJhbnNwb3J0LnRpbWVvdXQ7XG4gIHZhciB0cmFuc3BvcnRBUEkgPSB0cmFuc3BvcnQudHJhbnNwb3J0O1xuICBpZiAodHJhbnNwb3J0LnNlYXJjaCkge1xuICAgIHBhdGggPSBwYXRoICsgdHJhbnNwb3J0LnNlYXJjaDtcbiAgfVxuICBpZiAodHJhbnNwb3J0LnByb3h5KSB7XG4gICAgcGF0aCA9IHByb3RvY29sICsgJy8vJyArIGhvc3RuYW1lICsgcGF0aDtcbiAgICBob3N0bmFtZSA9IHRyYW5zcG9ydC5wcm94eS5ob3N0IHx8IHRyYW5zcG9ydC5wcm94eS5ob3N0bmFtZTtcbiAgICBwb3J0ID0gdHJhbnNwb3J0LnByb3h5LnBvcnQ7XG4gICAgcHJvdG9jb2wgPSB0cmFuc3BvcnQucHJveHkucHJvdG9jb2wgfHwgcHJvdG9jb2w7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgIHByb3RvY29sOiBwcm90b2NvbCxcbiAgICBob3N0bmFtZTogaG9zdG5hbWUsXG4gICAgcGF0aDogcGF0aCxcbiAgICBwb3J0OiBwb3J0LFxuICAgIG1ldGhvZDogbWV0aG9kLFxuICAgIHRyYW5zcG9ydDogdHJhbnNwb3J0QVBJLFxuICB9O1xufVxuXG5mdW5jdGlvbiBhcHBlbmRQYXRoVG9QYXRoKGJhc2UsIHBhdGgpIHtcbiAgdmFyIGJhc2VUcmFpbGluZ1NsYXNoID0gL1xcLyQvLnRlc3QoYmFzZSk7XG4gIHZhciBwYXRoQmVnaW5uaW5nU2xhc2ggPSAvXlxcLy8udGVzdChwYXRoKTtcblxuICBpZiAoYmFzZVRyYWlsaW5nU2xhc2ggJiYgcGF0aEJlZ2lubmluZ1NsYXNoKSB7XG4gICAgcGF0aCA9IHBhdGguc3Vic3RyaW5nKDEpO1xuICB9IGVsc2UgaWYgKCFiYXNlVHJhaWxpbmdTbGFzaCAmJiAhcGF0aEJlZ2lubmluZ1NsYXNoKSB7XG4gICAgcGF0aCA9ICcvJyArIHBhdGg7XG4gIH1cblxuICByZXR1cm4gYmFzZSArIHBhdGg7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBidWlsZFBheWxvYWQ6IGJ1aWxkUGF5bG9hZCxcbiAgZ2V0VHJhbnNwb3J0RnJvbU9wdGlvbnM6IGdldFRyYW5zcG9ydEZyb21PcHRpb25zLFxuICB0cmFuc3BvcnRPcHRpb25zOiB0cmFuc3BvcnRPcHRpb25zLFxuICBhcHBlbmRQYXRoVG9QYXRoOiBhcHBlbmRQYXRoVG9QYXRoLFxufTtcbiIsIi8vIFNlZSBodHRwczovL25vZGVqcy5vcmcvZG9jcy9sYXRlc3QvYXBpL3VybC5odG1sXG5mdW5jdGlvbiBwYXJzZSh1cmwpIHtcbiAgdmFyIHJlc3VsdCA9IHtcbiAgICBwcm90b2NvbDogbnVsbCxcbiAgICBhdXRoOiBudWxsLFxuICAgIGhvc3Q6IG51bGwsXG4gICAgcGF0aDogbnVsbCxcbiAgICBoYXNoOiBudWxsLFxuICAgIGhyZWY6IHVybCxcbiAgICBob3N0bmFtZTogbnVsbCxcbiAgICBwb3J0OiBudWxsLFxuICAgIHBhdGhuYW1lOiBudWxsLFxuICAgIHNlYXJjaDogbnVsbCxcbiAgICBxdWVyeTogbnVsbCxcbiAgfTtcblxuICB2YXIgaSwgbGFzdDtcbiAgaSA9IHVybC5pbmRleE9mKCcvLycpO1xuICBpZiAoaSAhPT0gLTEpIHtcbiAgICByZXN1bHQucHJvdG9jb2wgPSB1cmwuc3Vic3RyaW5nKDAsIGkpO1xuICAgIGxhc3QgPSBpICsgMjtcbiAgfSBlbHNlIHtcbiAgICBsYXN0ID0gMDtcbiAgfVxuXG4gIGkgPSB1cmwuaW5kZXhPZignQCcsIGxhc3QpO1xuICBpZiAoaSAhPT0gLTEpIHtcbiAgICByZXN1bHQuYXV0aCA9IHVybC5zdWJzdHJpbmcobGFzdCwgaSk7XG4gICAgbGFzdCA9IGkgKyAxO1xuICB9XG5cbiAgaSA9IHVybC5pbmRleE9mKCcvJywgbGFzdCk7XG4gIGlmIChpID09PSAtMSkge1xuICAgIGkgPSB1cmwuaW5kZXhPZignPycsIGxhc3QpO1xuICAgIGlmIChpID09PSAtMSkge1xuICAgICAgaSA9IHVybC5pbmRleE9mKCcjJywgbGFzdCk7XG4gICAgICBpZiAoaSA9PT0gLTEpIHtcbiAgICAgICAgcmVzdWx0Lmhvc3QgPSB1cmwuc3Vic3RyaW5nKGxhc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0Lmhvc3QgPSB1cmwuc3Vic3RyaW5nKGxhc3QsIGkpO1xuICAgICAgICByZXN1bHQuaGFzaCA9IHVybC5zdWJzdHJpbmcoaSk7XG4gICAgICB9XG4gICAgICByZXN1bHQuaG9zdG5hbWUgPSByZXN1bHQuaG9zdC5zcGxpdCgnOicpWzBdO1xuICAgICAgcmVzdWx0LnBvcnQgPSByZXN1bHQuaG9zdC5zcGxpdCgnOicpWzFdO1xuICAgICAgaWYgKHJlc3VsdC5wb3J0KSB7XG4gICAgICAgIHJlc3VsdC5wb3J0ID0gcGFyc2VJbnQocmVzdWx0LnBvcnQsIDEwKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdC5ob3N0ID0gdXJsLnN1YnN0cmluZyhsYXN0LCBpKTtcbiAgICAgIHJlc3VsdC5ob3N0bmFtZSA9IHJlc3VsdC5ob3N0LnNwbGl0KCc6JylbMF07XG4gICAgICByZXN1bHQucG9ydCA9IHJlc3VsdC5ob3N0LnNwbGl0KCc6JylbMV07XG4gICAgICBpZiAocmVzdWx0LnBvcnQpIHtcbiAgICAgICAgcmVzdWx0LnBvcnQgPSBwYXJzZUludChyZXN1bHQucG9ydCwgMTApO1xuICAgICAgfVxuICAgICAgbGFzdCA9IGk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlc3VsdC5ob3N0ID0gdXJsLnN1YnN0cmluZyhsYXN0LCBpKTtcbiAgICByZXN1bHQuaG9zdG5hbWUgPSByZXN1bHQuaG9zdC5zcGxpdCgnOicpWzBdO1xuICAgIHJlc3VsdC5wb3J0ID0gcmVzdWx0Lmhvc3Quc3BsaXQoJzonKVsxXTtcbiAgICBpZiAocmVzdWx0LnBvcnQpIHtcbiAgICAgIHJlc3VsdC5wb3J0ID0gcGFyc2VJbnQocmVzdWx0LnBvcnQsIDEwKTtcbiAgICB9XG4gICAgbGFzdCA9IGk7XG4gIH1cblxuICBpID0gdXJsLmluZGV4T2YoJyMnLCBsYXN0KTtcbiAgaWYgKGkgPT09IC0xKSB7XG4gICAgcmVzdWx0LnBhdGggPSB1cmwuc3Vic3RyaW5nKGxhc3QpO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdC5wYXRoID0gdXJsLnN1YnN0cmluZyhsYXN0LCBpKTtcbiAgICByZXN1bHQuaGFzaCA9IHVybC5zdWJzdHJpbmcoaSk7XG4gIH1cblxuICBpZiAocmVzdWx0LnBhdGgpIHtcbiAgICB2YXIgcGF0aFBhcnRzID0gcmVzdWx0LnBhdGguc3BsaXQoJz8nKTtcbiAgICByZXN1bHQucGF0aG5hbWUgPSBwYXRoUGFydHNbMF07XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcGF0aFBhcnRzWzFdO1xuICAgIHJlc3VsdC5zZWFyY2ggPSByZXN1bHQucXVlcnkgPyAnPycgKyByZXN1bHQucXVlcnkgOiBudWxsO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBwYXJzZTogcGFyc2UsXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbnZhciBpc1BsYWluT2JqZWN0ID0gZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmopIHtcbiAgaWYgKCFvYmogfHwgdG9TdHIuY2FsbChvYmopICE9PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBoYXNPd25Db25zdHJ1Y3RvciA9IGhhc093bi5jYWxsKG9iaiwgJ2NvbnN0cnVjdG9yJyk7XG4gIHZhciBoYXNJc1Byb3RvdHlwZU9mID1cbiAgICBvYmouY29uc3RydWN0b3IgJiZcbiAgICBvYmouY29uc3RydWN0b3IucHJvdG90eXBlICYmXG4gICAgaGFzT3duLmNhbGwob2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgJ2lzUHJvdG90eXBlT2YnKTtcbiAgLy8gTm90IG93biBjb25zdHJ1Y3RvciBwcm9wZXJ0eSBtdXN0IGJlIE9iamVjdFxuICBpZiAob2JqLmNvbnN0cnVjdG9yICYmICFoYXNPd25Db25zdHJ1Y3RvciAmJiAhaGFzSXNQcm90b3R5cGVPZikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIE93biBwcm9wZXJ0aWVzIGFyZSBlbnVtZXJhdGVkIGZpcnN0bHksIHNvIHRvIHNwZWVkIHVwLFxuICAvLyBpZiBsYXN0IG9uZSBpcyBvd24sIHRoZW4gYWxsIHByb3BlcnRpZXMgYXJlIG93bi5cbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgLyoqL1xuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiBrZXkgPT09ICd1bmRlZmluZWQnIHx8IGhhc093bi5jYWxsKG9iaiwga2V5KTtcbn07XG5cbmZ1bmN0aW9uIG1lcmdlKCkge1xuICB2YXIgaSxcbiAgICBzcmMsXG4gICAgY29weSxcbiAgICBjbG9uZSxcbiAgICBuYW1lLFxuICAgIHJlc3VsdCA9IHt9LFxuICAgIGN1cnJlbnQgPSBudWxsLFxuICAgIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY3VycmVudCA9IGFyZ3VtZW50c1tpXTtcbiAgICBpZiAoY3VycmVudCA9PSBudWxsKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBmb3IgKG5hbWUgaW4gY3VycmVudCkge1xuICAgICAgc3JjID0gcmVzdWx0W25hbWVdO1xuICAgICAgY29weSA9IGN1cnJlbnRbbmFtZV07XG4gICAgICBpZiAocmVzdWx0ICE9PSBjb3B5KSB7XG4gICAgICAgIGlmIChjb3B5ICYmIGlzUGxhaW5PYmplY3QoY29weSkpIHtcbiAgICAgICAgICBjbG9uZSA9IHNyYyAmJiBpc1BsYWluT2JqZWN0KHNyYykgPyBzcmMgOiB7fTtcbiAgICAgICAgICByZXN1bHRbbmFtZV0gPSBtZXJnZShjbG9uZSwgY29weSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvcHkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgcmVzdWx0W25hbWVdID0gY29weTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlO1xuIiwidmFyIG1lcmdlID0gcmVxdWlyZSgnLi9tZXJnZScpO1xuXG52YXIgUm9sbGJhckpTT04gPSB7fTtcbmZ1bmN0aW9uIHNldHVwSlNPTihwb2x5ZmlsbEpTT04pIHtcbiAgaWYgKGlzRnVuY3Rpb24oUm9sbGJhckpTT04uc3RyaW5naWZ5KSAmJiBpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnBhcnNlKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChpc0RlZmluZWQoSlNPTikpIHtcbiAgICAvLyBJZiBwb2x5ZmlsbCBpcyBwcm92aWRlZCwgcHJlZmVyIGl0IG92ZXIgZXhpc3Rpbmcgbm9uLW5hdGl2ZSBzaGltcy5cbiAgICBpZiAocG9seWZpbGxKU09OKSB7XG4gICAgICBpZiAoaXNOYXRpdmVGdW5jdGlvbihKU09OLnN0cmluZ2lmeSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04uc3RyaW5naWZ5ID0gSlNPTi5zdHJpbmdpZnk7XG4gICAgICB9XG4gICAgICBpZiAoaXNOYXRpdmVGdW5jdGlvbihKU09OLnBhcnNlKSkge1xuICAgICAgICBSb2xsYmFySlNPTi5wYXJzZSA9IEpTT04ucGFyc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGVsc2UgYWNjZXB0IGFueSBpbnRlcmZhY2UgdGhhdCBpcyBwcmVzZW50LlxuICAgICAgaWYgKGlzRnVuY3Rpb24oSlNPTi5zdHJpbmdpZnkpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnN0cmluZ2lmeSA9IEpTT04uc3RyaW5naWZ5O1xuICAgICAgfVxuICAgICAgaWYgKGlzRnVuY3Rpb24oSlNPTi5wYXJzZSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04ucGFyc2UgPSBKU09OLnBhcnNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoIWlzRnVuY3Rpb24oUm9sbGJhckpTT04uc3RyaW5naWZ5KSB8fCAhaXNGdW5jdGlvbihSb2xsYmFySlNPTi5wYXJzZSkpIHtcbiAgICBwb2x5ZmlsbEpTT04gJiYgcG9seWZpbGxKU09OKFJvbGxiYXJKU09OKTtcbiAgfVxufVxuXG4vKlxuICogaXNUeXBlIC0gR2l2ZW4gYSBKYXZhc2NyaXB0IHZhbHVlIGFuZCBhIHN0cmluZywgcmV0dXJucyB0cnVlIGlmIHRoZSB0eXBlIG9mIHRoZSB2YWx1ZSBtYXRjaGVzIHRoZVxuICogZ2l2ZW4gc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB4IC0gYW55IHZhbHVlXG4gKiBAcGFyYW0gdCAtIGEgbG93ZXJjYXNlIHN0cmluZyBjb250YWluaW5nIG9uZSBvZiB0aGUgZm9sbG93aW5nIHR5cGUgbmFtZXM6XG4gKiAgICAtIHVuZGVmaW5lZFxuICogICAgLSBudWxsXG4gKiAgICAtIGVycm9yXG4gKiAgICAtIG51bWJlclxuICogICAgLSBib29sZWFuXG4gKiAgICAtIHN0cmluZ1xuICogICAgLSBzeW1ib2xcbiAqICAgIC0gZnVuY3Rpb25cbiAqICAgIC0gb2JqZWN0XG4gKiAgICAtIGFycmF5XG4gKiBAcmV0dXJucyB0cnVlIGlmIHggaXMgb2YgdHlwZSB0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNUeXBlKHgsIHQpIHtcbiAgcmV0dXJuIHQgPT09IHR5cGVOYW1lKHgpO1xufVxuXG4vKlxuICogdHlwZU5hbWUgLSBHaXZlbiBhIEphdmFzY3JpcHQgdmFsdWUsIHJldHVybnMgdGhlIHR5cGUgb2YgdGhlIG9iamVjdCBhcyBhIHN0cmluZ1xuICovXG5mdW5jdGlvbiB0eXBlTmFtZSh4KSB7XG4gIHZhciBuYW1lID0gdHlwZW9mIHg7XG4gIGlmIChuYW1lICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBuYW1lO1xuICB9XG4gIGlmICgheCkge1xuICAgIHJldHVybiAnbnVsbCc7XG4gIH1cbiAgaWYgKHggaW5zdGFuY2VvZiBFcnJvcikge1xuICAgIHJldHVybiAnZXJyb3InO1xuICB9XG4gIHJldHVybiB7fS50b1N0cmluZ1xuICAgIC5jYWxsKHgpXG4gICAgLm1hdGNoKC9cXHMoW2EtekEtWl0rKS8pWzFdXG4gICAgLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8qIGlzRnVuY3Rpb24gLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIGEgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0gZiAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBmIGlzIGEgZnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGYpIHtcbiAgcmV0dXJuIGlzVHlwZShmLCAnZnVuY3Rpb24nKTtcbn1cblxuLyogaXNOYXRpdmVGdW5jdGlvbiAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgYSBuYXRpdmUgSlMgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0gZiAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBmIGlzIGEgbmF0aXZlIEpTIGZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOYXRpdmVGdW5jdGlvbihmKSB7XG4gIHZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG4gIHZhciBmdW5jTWF0Y2hTdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmdcbiAgICAuY2FsbChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KVxuICAgIC5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gICAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpO1xuICB2YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgKyBmdW5jTWF0Y2hTdHJpbmcgKyAnJCcpO1xuICByZXR1cm4gaXNPYmplY3QoZikgJiYgcmVJc05hdGl2ZS50ZXN0KGYpO1xufVxuXG4vKiBpc09iamVjdCAtIENoZWNrcyBpZiB0aGUgYXJndW1lbnQgaXMgYW4gb2JqZWN0XG4gKlxuICogQHBhcmFtIHZhbHVlIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlzIHZhbHVlIGlzIGFuIG9iamVjdCBmdW5jdGlvbiBpcyBhbiBvYmplY3QpXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKiBpc1N0cmluZyAtIENoZWNrcyBpZiB0aGUgYXJndW1lbnQgaXMgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0gdmFsdWUgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgdmFsdWUgaXMgYSBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgdmFsdWUgaW5zdGFuY2VvZiBTdHJpbmc7XG59XG5cbi8qKlxuICogaXNGaW5pdGVOdW1iZXIgLSBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBhIGZpbml0ZSBudW1iZXJcbiAqXG4gKiBAcGFyYW0geyp9IG4gLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgdmFsdWUgaXMgYSBmaW5pdGUgbnVtYmVyXG4gKi9cbmZ1bmN0aW9uIGlzRmluaXRlTnVtYmVyKG4pIHtcbiAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZShuKTtcbn1cblxuLypcbiAqIGlzRGVmaW5lZCAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgbm90IGVxdWFsIHRvIHVuZGVmaW5lZFxuICpcbiAqIEBwYXJhbSB1IC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIHUgaXMgYW55dGhpbmcgb3RoZXIgdGhhbiB1bmRlZmluZWRcbiAqL1xuZnVuY3Rpb24gaXNEZWZpbmVkKHUpIHtcbiAgcmV0dXJuICFpc1R5cGUodSwgJ3VuZGVmaW5lZCcpO1xufVxuXG4vKlxuICogaXNJdGVyYWJsZSAtIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGNhbiBiZSBpdGVyYXRlZCwgZXNzZW50aWFsbHlcbiAqIHdoZXRoZXIgaXQgaXMgYW4gb2JqZWN0IG9yIGFuIGFycmF5LlxuICpcbiAqIEBwYXJhbSBpIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGkgaXMgYW4gb2JqZWN0IG9yIGFuIGFycmF5IGFzIGRldGVybWluZWQgYnkgYHR5cGVOYW1lYFxuICovXG5mdW5jdGlvbiBpc0l0ZXJhYmxlKGkpIHtcbiAgdmFyIHR5cGUgPSB0eXBlTmFtZShpKTtcbiAgcmV0dXJuIHR5cGUgPT09ICdvYmplY3QnIHx8IHR5cGUgPT09ICdhcnJheSc7XG59XG5cbi8qXG4gKiBpc0Vycm9yIC0gY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgb2YgYW4gZXJyb3IgdHlwZVxuICpcbiAqIEBwYXJhbSBlIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGUgaXMgYW4gZXJyb3JcbiAqL1xuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIC8vIERldGVjdCBib3RoIEVycm9yIGFuZCBGaXJlZm94IEV4Y2VwdGlvbiB0eXBlXG4gIHJldHVybiBpc1R5cGUoZSwgJ2Vycm9yJykgfHwgaXNUeXBlKGUsICdleGNlcHRpb24nKTtcbn1cblxuLyogaXNQcm9taXNlIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBhIHByb21pc2VcbiAqXG4gKiBAcGFyYW0gcCAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBmIGlzIGEgZnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1Byb21pc2UocCkge1xuICByZXR1cm4gaXNPYmplY3QocCkgJiYgaXNUeXBlKHAudGhlbiwgJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogaXNCcm93c2VyIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgdGhlIGNvZGUgaXMgcnVubmluZyBpbiBhIGJyb3dzZXJcbiAqXG4gKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBjb2RlIGlzIHJ1bm5pbmcgaW4gYSBicm93c2VyIGVudmlyb25tZW50XG4gKi9cbmZ1bmN0aW9uIGlzQnJvd3NlcigpIHtcbiAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xufVxuXG5mdW5jdGlvbiByZWRhY3QoKSB7XG4gIHJldHVybiAnKioqKioqKionO1xufVxuXG4vLyBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzg4MDk0NzIvMTEzODE5MVxuZnVuY3Rpb24gdXVpZDQoKSB7XG4gIHZhciBkID0gbm93KCk7XG4gIHZhciB1dWlkID0gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZShcbiAgICAvW3h5XS9nLFxuICAgIGZ1bmN0aW9uIChjKSB7XG4gICAgICB2YXIgciA9IChkICsgTWF0aC5yYW5kb20oKSAqIDE2KSAlIDE2IHwgMDtcbiAgICAgIGQgPSBNYXRoLmZsb29yKGQgLyAxNik7XG4gICAgICByZXR1cm4gKGMgPT09ICd4JyA/IHIgOiAociAmIDB4NykgfCAweDgpLnRvU3RyaW5nKDE2KTtcbiAgICB9LFxuICApO1xuICByZXR1cm4gdXVpZDtcbn1cblxudmFyIExFVkVMUyA9IHtcbiAgZGVidWc6IDAsXG4gIGluZm86IDEsXG4gIHdhcm5pbmc6IDIsXG4gIGVycm9yOiAzLFxuICBjcml0aWNhbDogNCxcbn07XG5cbmZ1bmN0aW9uIHNhbml0aXplVXJsKHVybCkge1xuICB2YXIgYmFzZVVybFBhcnRzID0gcGFyc2VVcmkodXJsKTtcbiAgaWYgKCFiYXNlVXJsUGFydHMpIHtcbiAgICByZXR1cm4gJyh1bmtub3duKSc7XG4gIH1cblxuICAvLyByZW1vdmUgYSB0cmFpbGluZyAjIGlmIHRoZXJlIGlzIG5vIGFuY2hvclxuICBpZiAoYmFzZVVybFBhcnRzLmFuY2hvciA9PT0gJycpIHtcbiAgICBiYXNlVXJsUGFydHMuc291cmNlID0gYmFzZVVybFBhcnRzLnNvdXJjZS5yZXBsYWNlKCcjJywgJycpO1xuICB9XG5cbiAgdXJsID0gYmFzZVVybFBhcnRzLnNvdXJjZS5yZXBsYWNlKCc/JyArIGJhc2VVcmxQYXJ0cy5xdWVyeSwgJycpO1xuICByZXR1cm4gdXJsO1xufVxuXG52YXIgcGFyc2VVcmlPcHRpb25zID0ge1xuICBzdHJpY3RNb2RlOiBmYWxzZSxcbiAga2V5OiBbXG4gICAgJ3NvdXJjZScsXG4gICAgJ3Byb3RvY29sJyxcbiAgICAnYXV0aG9yaXR5JyxcbiAgICAndXNlckluZm8nLFxuICAgICd1c2VyJyxcbiAgICAncGFzc3dvcmQnLFxuICAgICdob3N0JyxcbiAgICAncG9ydCcsXG4gICAgJ3JlbGF0aXZlJyxcbiAgICAncGF0aCcsXG4gICAgJ2RpcmVjdG9yeScsXG4gICAgJ2ZpbGUnLFxuICAgICdxdWVyeScsXG4gICAgJ2FuY2hvcicsXG4gIF0sXG4gIHE6IHtcbiAgICBuYW1lOiAncXVlcnlLZXknLFxuICAgIHBhcnNlcjogLyg/Ol58JikoW14mPV0qKT0/KFteJl0qKS9nLFxuICB9LFxuICBwYXJzZXI6IHtcbiAgICBzdHJpY3Q6XG4gICAgICAvXig/OihbXjpcXC8/I10rKTopPyg/OlxcL1xcLygoPzooKFteOkBdKikoPzo6KFteOkBdKikpPyk/QCk/KFteOlxcLz8jXSopKD86OihcXGQqKSk/KSk/KCgoKD86W14/I1xcL10qXFwvKSopKFtePyNdKikpKD86XFw/KFteI10qKSk/KD86IyguKikpPykvLFxuICAgIGxvb3NlOlxuICAgICAgL14oPzooPyFbXjpAXSs6W146QFxcL10qQCkoW146XFwvPyMuXSspOik/KD86XFwvXFwvKT8oKD86KChbXjpAXSopKD86OihbXjpAXSopKT8pP0ApPyhbXjpcXC8/I10qKSg/OjooXFxkKikpPykoKChcXC8oPzpbXj8jXSg/IVtePyNcXC9dKlxcLltePyNcXC8uXSsoPzpbPyNdfCQpKSkqXFwvPyk/KFtePyNcXC9dKikpKD86XFw/KFteI10qKSk/KD86IyguKikpPykvLFxuICB9LFxufTtcblxuZnVuY3Rpb24gcGFyc2VVcmkoc3RyKSB7XG4gIGlmICghaXNUeXBlKHN0ciwgJ3N0cmluZycpKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHZhciBvID0gcGFyc2VVcmlPcHRpb25zO1xuICB2YXIgbSA9IG8ucGFyc2VyW28uc3RyaWN0TW9kZSA/ICdzdHJpY3QnIDogJ2xvb3NlJ10uZXhlYyhzdHIpO1xuICB2YXIgdXJpID0ge307XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBvLmtleS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICB1cmlbby5rZXlbaV1dID0gbVtpXSB8fCAnJztcbiAgfVxuXG4gIHVyaVtvLnEubmFtZV0gPSB7fTtcbiAgdXJpW28ua2V5WzEyXV0ucmVwbGFjZShvLnEucGFyc2VyLCBmdW5jdGlvbiAoJDAsICQxLCAkMikge1xuICAgIGlmICgkMSkge1xuICAgICAgdXJpW28ucS5uYW1lXVskMV0gPSAkMjtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB1cmk7XG59XG5cbmZ1bmN0aW9uIGFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoKGFjY2Vzc1Rva2VuLCBvcHRpb25zLCBwYXJhbXMpIHtcbiAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICBwYXJhbXMuYWNjZXNzX3Rva2VuID0gYWNjZXNzVG9rZW47XG4gIHZhciBwYXJhbXNBcnJheSA9IFtdO1xuICB2YXIgaztcbiAgZm9yIChrIGluIHBhcmFtcykge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyYW1zLCBrKSkge1xuICAgICAgcGFyYW1zQXJyYXkucHVzaChbaywgcGFyYW1zW2tdXS5qb2luKCc9JykpO1xuICAgIH1cbiAgfVxuICB2YXIgcXVlcnkgPSAnPycgKyBwYXJhbXNBcnJheS5zb3J0KCkuam9pbignJicpO1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBvcHRpb25zLnBhdGggPSBvcHRpb25zLnBhdGggfHwgJyc7XG4gIHZhciBxcyA9IG9wdGlvbnMucGF0aC5pbmRleE9mKCc/Jyk7XG4gIHZhciBoID0gb3B0aW9ucy5wYXRoLmluZGV4T2YoJyMnKTtcbiAgdmFyIHA7XG4gIGlmIChxcyAhPT0gLTEgJiYgKGggPT09IC0xIHx8IGggPiBxcykpIHtcbiAgICBwID0gb3B0aW9ucy5wYXRoO1xuICAgIG9wdGlvbnMucGF0aCA9IHAuc3Vic3RyaW5nKDAsIHFzKSArIHF1ZXJ5ICsgJyYnICsgcC5zdWJzdHJpbmcocXMgKyAxKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoaCAhPT0gLTEpIHtcbiAgICAgIHAgPSBvcHRpb25zLnBhdGg7XG4gICAgICBvcHRpb25zLnBhdGggPSBwLnN1YnN0cmluZygwLCBoKSArIHF1ZXJ5ICsgcC5zdWJzdHJpbmcoaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMucGF0aCA9IG9wdGlvbnMucGF0aCArIHF1ZXJ5O1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBmb3JtYXRVcmwodSwgcHJvdG9jb2wpIHtcbiAgcHJvdG9jb2wgPSBwcm90b2NvbCB8fCB1LnByb3RvY29sO1xuICBpZiAoIXByb3RvY29sICYmIHUucG9ydCkge1xuICAgIGlmICh1LnBvcnQgPT09IDgwKSB7XG4gICAgICBwcm90b2NvbCA9ICdodHRwOic7XG4gICAgfSBlbHNlIGlmICh1LnBvcnQgPT09IDQ0Mykge1xuICAgICAgcHJvdG9jb2wgPSAnaHR0cHM6JztcbiAgICB9XG4gIH1cbiAgcHJvdG9jb2wgPSBwcm90b2NvbCB8fCAnaHR0cHM6JztcblxuICBpZiAoIXUuaG9zdG5hbWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2YXIgcmVzdWx0ID0gcHJvdG9jb2wgKyAnLy8nICsgdS5ob3N0bmFtZTtcbiAgaWYgKHUucG9ydCkge1xuICAgIHJlc3VsdCA9IHJlc3VsdCArICc6JyArIHUucG9ydDtcbiAgfVxuICBpZiAodS5wYXRoKSB7XG4gICAgcmVzdWx0ID0gcmVzdWx0ICsgdS5wYXRoO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeShvYmosIGJhY2t1cCkge1xuICB2YXIgdmFsdWUsIGVycm9yO1xuICB0cnkge1xuICAgIHZhbHVlID0gUm9sbGJhckpTT04uc3RyaW5naWZ5KG9iaik7XG4gIH0gY2F0Y2ggKGpzb25FcnJvcikge1xuICAgIGlmIChiYWNrdXAgJiYgaXNGdW5jdGlvbihiYWNrdXApKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IGJhY2t1cChvYmopO1xuICAgICAgfSBjYXRjaCAoYmFja3VwRXJyb3IpIHtcbiAgICAgICAgZXJyb3IgPSBiYWNrdXBFcnJvcjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZXJyb3IgPSBqc29uRXJyb3I7XG4gICAgfVxuICB9XG4gIHJldHVybiB7IGVycm9yOiBlcnJvciwgdmFsdWU6IHZhbHVlIH07XG59XG5cbmZ1bmN0aW9uIG1heEJ5dGVTaXplKHN0cmluZykge1xuICAvLyBUaGUgdHJhbnNwb3J0IHdpbGwgdXNlIHV0Zi04LCBzbyBhc3N1bWUgdXRmLTggZW5jb2RpbmcuXG4gIC8vXG4gIC8vIFRoaXMgbWluaW1hbCBpbXBsZW1lbnRhdGlvbiB3aWxsIGFjY3VyYXRlbHkgY291bnQgYnl0ZXMgZm9yIGFsbCBVQ1MtMiBhbmRcbiAgLy8gc2luZ2xlIGNvZGUgcG9pbnQgVVRGLTE2LiBJZiBwcmVzZW50ZWQgd2l0aCBtdWx0aSBjb2RlIHBvaW50IFVURi0xNixcbiAgLy8gd2hpY2ggc2hvdWxkIGJlIHJhcmUsIGl0IHdpbGwgc2FmZWx5IG92ZXJjb3VudCwgbm90IHVuZGVyY291bnQuXG4gIC8vXG4gIC8vIFdoaWxlIHJvYnVzdCB1dGYtOCBlbmNvZGVycyBleGlzdCwgdGhpcyBpcyBmYXIgc21hbGxlciBhbmQgZmFyIG1vcmUgcGVyZm9ybWFudC5cbiAgLy8gRm9yIHF1aWNrbHkgY291bnRpbmcgcGF5bG9hZCBzaXplIGZvciB0cnVuY2F0aW9uLCBzbWFsbGVyIGlzIGJldHRlci5cblxuICB2YXIgY291bnQgPSAwO1xuICB2YXIgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGNvZGUgPSBzdHJpbmcuY2hhckNvZGVBdChpKTtcbiAgICBpZiAoY29kZSA8IDEyOCkge1xuICAgICAgLy8gdXAgdG8gNyBiaXRzXG4gICAgICBjb3VudCA9IGNvdW50ICsgMTtcbiAgICB9IGVsc2UgaWYgKGNvZGUgPCAyMDQ4KSB7XG4gICAgICAvLyB1cCB0byAxMSBiaXRzXG4gICAgICBjb3VudCA9IGNvdW50ICsgMjtcbiAgICB9IGVsc2UgaWYgKGNvZGUgPCA2NTUzNikge1xuICAgICAgLy8gdXAgdG8gMTYgYml0c1xuICAgICAgY291bnQgPSBjb3VudCArIDM7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvdW50O1xufVxuXG5mdW5jdGlvbiBqc29uUGFyc2Uocykge1xuICB2YXIgdmFsdWUsIGVycm9yO1xuICB0cnkge1xuICAgIHZhbHVlID0gUm9sbGJhckpTT04ucGFyc2Uocyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBlcnJvciA9IGU7XG4gIH1cbiAgcmV0dXJuIHsgZXJyb3I6IGVycm9yLCB2YWx1ZTogdmFsdWUgfTtcbn1cblxuZnVuY3Rpb24gbWFrZVVuaGFuZGxlZFN0YWNrSW5mbyhcbiAgbWVzc2FnZSxcbiAgdXJsLFxuICBsaW5lbm8sXG4gIGNvbG5vLFxuICBlcnJvcixcbiAgbW9kZSxcbiAgYmFja3VwTWVzc2FnZSxcbiAgZXJyb3JQYXJzZXIsXG4pIHtcbiAgdmFyIGxvY2F0aW9uID0ge1xuICAgIHVybDogdXJsIHx8ICcnLFxuICAgIGxpbmU6IGxpbmVubyxcbiAgICBjb2x1bW46IGNvbG5vLFxuICB9O1xuICBsb2NhdGlvbi5mdW5jID0gZXJyb3JQYXJzZXIuZ3Vlc3NGdW5jdGlvbk5hbWUobG9jYXRpb24udXJsLCBsb2NhdGlvbi5saW5lKTtcbiAgbG9jYXRpb24uY29udGV4dCA9IGVycm9yUGFyc2VyLmdhdGhlckNvbnRleHQobG9jYXRpb24udXJsLCBsb2NhdGlvbi5saW5lKTtcbiAgdmFyIGhyZWYgPVxuICAgIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICBkb2N1bWVudCAmJlxuICAgIGRvY3VtZW50LmxvY2F0aW9uICYmXG4gICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZjtcbiAgdmFyIHVzZXJhZ2VudCA9XG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB3aW5kb3cgJiZcbiAgICB3aW5kb3cubmF2aWdhdG9yICYmXG4gICAgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gIHJldHVybiB7XG4gICAgbW9kZTogbW9kZSxcbiAgICBtZXNzYWdlOiBlcnJvciA/IFN0cmluZyhlcnJvcikgOiBtZXNzYWdlIHx8IGJhY2t1cE1lc3NhZ2UsXG4gICAgdXJsOiBocmVmLFxuICAgIHN0YWNrOiBbbG9jYXRpb25dLFxuICAgIHVzZXJhZ2VudDogdXNlcmFnZW50LFxuICB9O1xufVxuXG5mdW5jdGlvbiB3cmFwQ2FsbGJhY2sobG9nZ2VyLCBmKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgdHJ5IHtcbiAgICAgIGYoZXJyLCByZXNwKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoZSk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBub25DaXJjdWxhckNsb25lKG9iaikge1xuICB2YXIgc2VlbiA9IFtvYmpdO1xuXG4gIGZ1bmN0aW9uIGNsb25lKG9iaiwgc2Vlbikge1xuICAgIHZhciB2YWx1ZSxcbiAgICAgIG5hbWUsXG4gICAgICBuZXdTZWVuLFxuICAgICAgcmVzdWx0ID0ge307XG5cbiAgICB0cnkge1xuICAgICAgZm9yIChuYW1lIGluIG9iaikge1xuICAgICAgICB2YWx1ZSA9IG9ialtuYW1lXTtcblxuICAgICAgICBpZiAodmFsdWUgJiYgKGlzVHlwZSh2YWx1ZSwgJ29iamVjdCcpIHx8IGlzVHlwZSh2YWx1ZSwgJ2FycmF5JykpKSB7XG4gICAgICAgICAgaWYgKHNlZW4uaW5jbHVkZXModmFsdWUpKSB7XG4gICAgICAgICAgICByZXN1bHRbbmFtZV0gPSAnUmVtb3ZlZCBjaXJjdWxhciByZWZlcmVuY2U6ICcgKyB0eXBlTmFtZSh2YWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld1NlZW4gPSBzZWVuLnNsaWNlKCk7XG4gICAgICAgICAgICBuZXdTZWVuLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgcmVzdWx0W25hbWVdID0gY2xvbmUodmFsdWUsIG5ld1NlZW4pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdFtuYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlc3VsdCA9ICdGYWlsZWQgY2xvbmluZyBjdXN0b20gZGF0YTogJyArIGUubWVzc2FnZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICByZXR1cm4gY2xvbmUob2JqLCBzZWVuKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlSXRlbShhcmdzLCBsb2dnZXIsIG5vdGlmaWVyLCByZXF1ZXN0S2V5cywgbGFtYmRhQ29udGV4dCkge1xuICB2YXIgbWVzc2FnZSwgZXJyLCBjdXN0b20sIGNhbGxiYWNrLCByZXF1ZXN0O1xuICB2YXIgYXJnO1xuICB2YXIgZXh0cmFBcmdzID0gW107XG4gIHZhciBkaWFnbm9zdGljID0ge307XG4gIHZhciBhcmdUeXBlcyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJncy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBhcmcgPSBhcmdzW2ldO1xuXG4gICAgdmFyIHR5cCA9IHR5cGVOYW1lKGFyZyk7XG4gICAgYXJnVHlwZXMucHVzaCh0eXApO1xuICAgIHN3aXRjaCAodHlwKSB7XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIG1lc3NhZ2UgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKG1lc3NhZ2UgPSBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgY2FsbGJhY2sgPSB3cmFwQ2FsbGJhY2sobG9nZ2VyLCBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICBleHRyYUFyZ3MucHVzaChhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgIGNhc2UgJ2RvbWV4Y2VwdGlvbic6XG4gICAgICBjYXNlICdleGNlcHRpb24nOiAvLyBGaXJlZm94IEV4Y2VwdGlvbiB0eXBlXG4gICAgICAgIGVyciA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoZXJyID0gYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgY2FzZSAnYXJyYXknOlxuICAgICAgICBpZiAoXG4gICAgICAgICAgYXJnIGluc3RhbmNlb2YgRXJyb3IgfHxcbiAgICAgICAgICAodHlwZW9mIERPTUV4Y2VwdGlvbiAhPT0gJ3VuZGVmaW5lZCcgJiYgYXJnIGluc3RhbmNlb2YgRE9NRXhjZXB0aW9uKVxuICAgICAgICApIHtcbiAgICAgICAgICBlcnIgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGVyciA9IGFyZyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlcXVlc3RLZXlzICYmIHR5cCA9PT0gJ29iamVjdCcgJiYgIXJlcXVlc3QpIHtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMCwgbGVuID0gcmVxdWVzdEtleXMubGVuZ3RoOyBqIDwgbGVuOyArK2opIHtcbiAgICAgICAgICAgIGlmIChhcmdbcmVxdWVzdEtleXNbal1dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgcmVxdWVzdCA9IGFyZztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXF1ZXN0KSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY3VzdG9tID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChjdXN0b20gPSBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChcbiAgICAgICAgICBhcmcgaW5zdGFuY2VvZiBFcnJvciB8fFxuICAgICAgICAgICh0eXBlb2YgRE9NRXhjZXB0aW9uICE9PSAndW5kZWZpbmVkJyAmJiBhcmcgaW5zdGFuY2VvZiBET01FeGNlcHRpb24pXG4gICAgICAgICkge1xuICAgICAgICAgIGVyciA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoZXJyID0gYXJnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBleHRyYUFyZ3MucHVzaChhcmcpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIGN1c3RvbSBpcyBhbiBhcnJheSB0aGlzIHR1cm5zIGl0IGludG8gYW4gb2JqZWN0IHdpdGggaW50ZWdlciBrZXlzXG4gIGlmIChjdXN0b20pIGN1c3RvbSA9IG5vbkNpcmN1bGFyQ2xvbmUoY3VzdG9tKTtcblxuICBpZiAoZXh0cmFBcmdzLmxlbmd0aCA+IDApIHtcbiAgICBpZiAoIWN1c3RvbSkgY3VzdG9tID0gbm9uQ2lyY3VsYXJDbG9uZSh7fSk7XG4gICAgY3VzdG9tLmV4dHJhQXJncyA9IG5vbkNpcmN1bGFyQ2xvbmUoZXh0cmFBcmdzKTtcbiAgfVxuXG4gIHZhciBpdGVtID0ge1xuICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgZXJyOiBlcnIsXG4gICAgY3VzdG9tOiBjdXN0b20sXG4gICAgdGltZXN0YW1wOiBub3coKSxcbiAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgbm90aWZpZXI6IG5vdGlmaWVyLFxuICAgIGRpYWdub3N0aWM6IGRpYWdub3N0aWMsXG4gICAgdXVpZDogdXVpZDQoKSxcbiAgfTtcblxuICBpdGVtLmRhdGEgPSBpdGVtLmRhdGEgfHwge307XG5cbiAgc2V0Q3VzdG9tSXRlbUtleXMoaXRlbSwgY3VzdG9tKTtcblxuICBpZiAocmVxdWVzdEtleXMgJiYgcmVxdWVzdCkge1xuICAgIGl0ZW0ucmVxdWVzdCA9IHJlcXVlc3Q7XG4gIH1cbiAgaWYgKGxhbWJkYUNvbnRleHQpIHtcbiAgICBpdGVtLmxhbWJkYUNvbnRleHQgPSBsYW1iZGFDb250ZXh0O1xuICB9XG4gIGl0ZW0uX29yaWdpbmFsQXJncyA9IGFyZ3M7XG4gIGl0ZW0uZGlhZ25vc3RpYy5vcmlnaW5hbF9hcmdfdHlwZXMgPSBhcmdUeXBlcztcbiAgcmV0dXJuIGl0ZW07XG59XG5cbmZ1bmN0aW9uIHNldEN1c3RvbUl0ZW1LZXlzKGl0ZW0sIGN1c3RvbSkge1xuICBpZiAoY3VzdG9tICYmIGN1c3RvbS5sZXZlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaXRlbS5sZXZlbCA9IGN1c3RvbS5sZXZlbDtcbiAgICBkZWxldGUgY3VzdG9tLmxldmVsO1xuICB9XG4gIGlmIChjdXN0b20gJiYgY3VzdG9tLnNraXBGcmFtZXMgIT09IHVuZGVmaW5lZCkge1xuICAgIGl0ZW0uc2tpcEZyYW1lcyA9IGN1c3RvbS5za2lwRnJhbWVzO1xuICAgIGRlbGV0ZSBjdXN0b20uc2tpcEZyYW1lcztcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRFcnJvckNvbnRleHQoaXRlbSwgZXJyb3JzKSB7XG4gIHZhciBjdXN0b20gPSBpdGVtLmRhdGEuY3VzdG9tIHx8IHt9O1xuICB2YXIgY29udGV4dEFkZGVkID0gZmFsc2U7XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVycm9ycy5sZW5ndGg7ICsraSkge1xuICAgICAgaWYgKGVycm9yc1tpXS5oYXNPd25Qcm9wZXJ0eSgncm9sbGJhckNvbnRleHQnKSkge1xuICAgICAgICBjdXN0b20gPSBtZXJnZShjdXN0b20sIG5vbkNpcmN1bGFyQ2xvbmUoZXJyb3JzW2ldLnJvbGxiYXJDb250ZXh0KSk7XG4gICAgICAgIGNvbnRleHRBZGRlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXZvaWQgYWRkaW5nIGFuIGVtcHR5IG9iamVjdCB0byB0aGUgZGF0YS5cbiAgICBpZiAoY29udGV4dEFkZGVkKSB7XG4gICAgICBpdGVtLmRhdGEuY3VzdG9tID0gY3VzdG9tO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGl0ZW0uZGlhZ25vc3RpYy5lcnJvcl9jb250ZXh0ID0gJ0ZhaWxlZDogJyArIGUubWVzc2FnZTtcbiAgfVxufVxuXG52YXIgVEVMRU1FVFJZX1RZUEVTID0gW1xuICAnbG9nJyxcbiAgJ25ldHdvcmsnLFxuICAnZG9tJyxcbiAgJ25hdmlnYXRpb24nLFxuICAnZXJyb3InLFxuICAnbWFudWFsJyxcbl07XG52YXIgVEVMRU1FVFJZX0xFVkVMUyA9IFsnY3JpdGljYWwnLCAnZXJyb3InLCAnd2FybmluZycsICdpbmZvJywgJ2RlYnVnJ107XG5cbmZ1bmN0aW9uIGFycmF5SW5jbHVkZXMoYXJyLCB2YWwpIHtcbiAgZm9yICh2YXIgayA9IDA7IGsgPCBhcnIubGVuZ3RoOyArK2spIHtcbiAgICBpZiAoYXJyW2tdID09PSB2YWwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVGVsZW1ldHJ5RXZlbnQoYXJncykge1xuICB2YXIgdHlwZSwgbWV0YWRhdGEsIGxldmVsO1xuICB2YXIgYXJnO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJncy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBhcmcgPSBhcmdzW2ldO1xuXG4gICAgdmFyIHR5cCA9IHR5cGVOYW1lKGFyZyk7XG4gICAgc3dpdGNoICh0eXApIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIGlmICghdHlwZSAmJiBhcnJheUluY2x1ZGVzKFRFTEVNRVRSWV9UWVBFUywgYXJnKSkge1xuICAgICAgICAgIHR5cGUgPSBhcmc7XG4gICAgICAgIH0gZWxzZSBpZiAoIWxldmVsICYmIGFycmF5SW5jbHVkZXMoVEVMRU1FVFJZX0xFVkVMUywgYXJnKSkge1xuICAgICAgICAgIGxldmVsID0gYXJnO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgbWV0YWRhdGEgPSBhcmc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHZhciBldmVudCA9IHtcbiAgICB0eXBlOiB0eXBlIHx8ICdtYW51YWwnLFxuICAgIG1ldGFkYXRhOiBtZXRhZGF0YSB8fCB7fSxcbiAgICBsZXZlbDogbGV2ZWwsXG4gIH07XG5cbiAgcmV0dXJuIGV2ZW50O1xufVxuXG5mdW5jdGlvbiBhZGRJdGVtQXR0cmlidXRlcyhpdGVtLCBhdHRyaWJ1dGVzKSB7XG4gIGl0ZW0uZGF0YS5hdHRyaWJ1dGVzID0gaXRlbS5kYXRhLmF0dHJpYnV0ZXMgfHwgW107XG4gIGlmIChhdHRyaWJ1dGVzKSB7XG4gICAgaXRlbS5kYXRhLmF0dHJpYnV0ZXMucHVzaCguLi5hdHRyaWJ1dGVzKTtcbiAgfVxufVxuXG4vKlxuICogZ2V0IC0gZ2l2ZW4gYW4gb2JqL2FycmF5IGFuZCBhIGtleXBhdGgsIHJldHVybiB0aGUgdmFsdWUgYXQgdGhhdCBrZXlwYXRoIG9yXG4gKiAgICAgICB1bmRlZmluZWQgaWYgbm90IHBvc3NpYmxlLlxuICpcbiAqIEBwYXJhbSBvYmogLSBhbiBvYmplY3Qgb3IgYXJyYXlcbiAqIEBwYXJhbSBwYXRoIC0gYSBzdHJpbmcgb2Yga2V5cyBzZXBhcmF0ZWQgYnkgJy4nIHN1Y2ggYXMgJ3BsdWdpbi5qcXVlcnkuMC5tZXNzYWdlJ1xuICogICAgd2hpY2ggd291bGQgY29ycmVzcG9uZCB0byA0MiBpbiBge3BsdWdpbjoge2pxdWVyeTogW3ttZXNzYWdlOiA0Mn1dfX1gXG4gKi9cbmZ1bmN0aW9uIGdldChvYmosIHBhdGgpIHtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHZhciBrZXlzID0gcGF0aC5zcGxpdCgnLicpO1xuICB2YXIgcmVzdWx0ID0gb2JqO1xuICB0cnkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBrZXlzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICByZXN1bHQgPSByZXN1bHRba2V5c1tpXV07XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgcmVzdWx0ID0gdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHNldChvYmosIHBhdGgsIHZhbHVlKSB7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBrZXlzID0gcGF0aC5zcGxpdCgnLicpO1xuICB2YXIgbGVuID0ga2V5cy5sZW5ndGg7XG4gIGlmIChsZW4gPCAxKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChsZW4gPT09IDEpIHtcbiAgICBvYmpba2V5c1swXV0gPSB2YWx1ZTtcbiAgICByZXR1cm47XG4gIH1cbiAgdHJ5IHtcbiAgICB2YXIgdGVtcCA9IG9ialtrZXlzWzBdXSB8fCB7fTtcbiAgICB2YXIgcmVwbGFjZW1lbnQgPSB0ZW1wO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbGVuIC0gMTsgKytpKSB7XG4gICAgICB0ZW1wW2tleXNbaV1dID0gdGVtcFtrZXlzW2ldXSB8fCB7fTtcbiAgICAgIHRlbXAgPSB0ZW1wW2tleXNbaV1dO1xuICAgIH1cbiAgICB0ZW1wW2tleXNbbGVuIC0gMV1dID0gdmFsdWU7XG4gICAgb2JqW2tleXNbMF1dID0gcmVwbGFjZW1lbnQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm47XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0QXJnc0FzU3RyaW5nKGFyZ3MpIHtcbiAgdmFyIGksIGxlbiwgYXJnO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAoaSA9IDAsIGxlbiA9IGFyZ3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBhcmcgPSBhcmdzW2ldO1xuICAgIHN3aXRjaCAodHlwZU5hbWUoYXJnKSkge1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgYXJnID0gc3RyaW5naWZ5KGFyZyk7XG4gICAgICAgIGFyZyA9IGFyZy5lcnJvciB8fCBhcmcudmFsdWU7XG4gICAgICAgIGlmIChhcmcubGVuZ3RoID4gNTAwKSB7XG4gICAgICAgICAgYXJnID0gYXJnLnN1YnN0cigwLCA0OTcpICsgJy4uLic7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdudWxsJzpcbiAgICAgICAgYXJnID0gJ251bGwnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgIGFyZyA9ICd1bmRlZmluZWQnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N5bWJvbCc6XG4gICAgICAgIGFyZyA9IGFyZy50b1N0cmluZygpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmVzdWx0LnB1c2goYXJnKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0LmpvaW4oJyAnKTtcbn1cblxuZnVuY3Rpb24gbm93KCkge1xuICBpZiAoRGF0ZS5ub3cpIHtcbiAgICByZXR1cm4gK0RhdGUubm93KCk7XG4gIH1cbiAgcmV0dXJuICtuZXcgRGF0ZSgpO1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJJcChyZXF1ZXN0RGF0YSwgY2FwdHVyZUlwKSB7XG4gIGlmICghcmVxdWVzdERhdGEgfHwgIXJlcXVlc3REYXRhWyd1c2VyX2lwJ10gfHwgY2FwdHVyZUlwID09PSB0cnVlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuZXdJcCA9IHJlcXVlc3REYXRhWyd1c2VyX2lwJ107XG4gIGlmICghY2FwdHVyZUlwKSB7XG4gICAgbmV3SXAgPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIHRyeSB7XG4gICAgICB2YXIgcGFydHM7XG4gICAgICBpZiAobmV3SXAuaW5kZXhPZignLicpICE9PSAtMSkge1xuICAgICAgICBwYXJ0cyA9IG5ld0lwLnNwbGl0KCcuJyk7XG4gICAgICAgIHBhcnRzLnBvcCgpO1xuICAgICAgICBwYXJ0cy5wdXNoKCcwJyk7XG4gICAgICAgIG5ld0lwID0gcGFydHMuam9pbignLicpO1xuICAgICAgfSBlbHNlIGlmIChuZXdJcC5pbmRleE9mKCc6JykgIT09IC0xKSB7XG4gICAgICAgIHBhcnRzID0gbmV3SXAuc3BsaXQoJzonKTtcbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICB2YXIgYmVnaW5uaW5nID0gcGFydHMuc2xpY2UoMCwgMyk7XG4gICAgICAgICAgdmFyIHNsYXNoSWR4ID0gYmVnaW5uaW5nWzJdLmluZGV4T2YoJy8nKTtcbiAgICAgICAgICBpZiAoc2xhc2hJZHggIT09IC0xKSB7XG4gICAgICAgICAgICBiZWdpbm5pbmdbMl0gPSBiZWdpbm5pbmdbMl0uc3Vic3RyaW5nKDAsIHNsYXNoSWR4KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHRlcm1pbmFsID0gJzAwMDA6MDAwMDowMDAwOjAwMDA6MDAwMCc7XG4gICAgICAgICAgbmV3SXAgPSBiZWdpbm5pbmcuY29uY2F0KHRlcm1pbmFsKS5qb2luKCc6Jyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0lwID0gbnVsbDtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBuZXdJcCA9IG51bGw7XG4gICAgfVxuICB9XG4gIHJlcXVlc3REYXRhWyd1c2VyX2lwJ10gPSBuZXdJcDtcbn1cblxuZnVuY3Rpb24gaGFuZGxlT3B0aW9ucyhjdXJyZW50LCBpbnB1dCwgcGF5bG9hZCwgbG9nZ2VyKSB7XG4gIHZhciByZXN1bHQgPSBtZXJnZShjdXJyZW50LCBpbnB1dCwgcGF5bG9hZCk7XG4gIHJlc3VsdCA9IHVwZGF0ZURlcHJlY2F0ZWRPcHRpb25zKHJlc3VsdCwgbG9nZ2VyKTtcbiAgaWYgKCFpbnB1dCB8fCBpbnB1dC5vdmVyd3JpdGVTY3J1YkZpZWxkcykge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgaWYgKGlucHV0LnNjcnViRmllbGRzKSB7XG4gICAgcmVzdWx0LnNjcnViRmllbGRzID0gKGN1cnJlbnQuc2NydWJGaWVsZHMgfHwgW10pLmNvbmNhdChpbnB1dC5zY3J1YkZpZWxkcyk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlRGVwcmVjYXRlZE9wdGlvbnMob3B0aW9ucywgbG9nZ2VyKSB7XG4gIGlmIChvcHRpb25zLmhvc3RXaGl0ZUxpc3QgJiYgIW9wdGlvbnMuaG9zdFNhZmVMaXN0KSB7XG4gICAgb3B0aW9ucy5ob3N0U2FmZUxpc3QgPSBvcHRpb25zLmhvc3RXaGl0ZUxpc3Q7XG4gICAgb3B0aW9ucy5ob3N0V2hpdGVMaXN0ID0gdW5kZWZpbmVkO1xuICAgIGxvZ2dlciAmJiBsb2dnZXIubG9nKCdob3N0V2hpdGVMaXN0IGlzIGRlcHJlY2F0ZWQuIFVzZSBob3N0U2FmZUxpc3QuJyk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaG9zdEJsYWNrTGlzdCAmJiAhb3B0aW9ucy5ob3N0QmxvY2tMaXN0KSB7XG4gICAgb3B0aW9ucy5ob3N0QmxvY2tMaXN0ID0gb3B0aW9ucy5ob3N0QmxhY2tMaXN0O1xuICAgIG9wdGlvbnMuaG9zdEJsYWNrTGlzdCA9IHVuZGVmaW5lZDtcbiAgICBsb2dnZXIgJiYgbG9nZ2VyLmxvZygnaG9zdEJsYWNrTGlzdCBpcyBkZXByZWNhdGVkLiBVc2UgaG9zdEJsb2NrTGlzdC4nKTtcbiAgfVxuICByZXR1cm4gb3B0aW9ucztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoOiBhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aCxcbiAgY3JlYXRlSXRlbTogY3JlYXRlSXRlbSxcbiAgYWRkRXJyb3JDb250ZXh0OiBhZGRFcnJvckNvbnRleHQsXG4gIGNyZWF0ZVRlbGVtZXRyeUV2ZW50OiBjcmVhdGVUZWxlbWV0cnlFdmVudCxcbiAgYWRkSXRlbUF0dHJpYnV0ZXM6IGFkZEl0ZW1BdHRyaWJ1dGVzLFxuICBmaWx0ZXJJcDogZmlsdGVySXAsXG4gIGZvcm1hdEFyZ3NBc1N0cmluZzogZm9ybWF0QXJnc0FzU3RyaW5nLFxuICBmb3JtYXRVcmw6IGZvcm1hdFVybCxcbiAgZ2V0OiBnZXQsXG4gIGhhbmRsZU9wdGlvbnM6IGhhbmRsZU9wdGlvbnMsXG4gIGlzRXJyb3I6IGlzRXJyb3IsXG4gIGlzRmluaXRlTnVtYmVyOiBpc0Zpbml0ZU51bWJlcixcbiAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgaXNJdGVyYWJsZTogaXNJdGVyYWJsZSxcbiAgaXNOYXRpdmVGdW5jdGlvbjogaXNOYXRpdmVGdW5jdGlvbixcbiAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICBpc1N0cmluZzogaXNTdHJpbmcsXG4gIGlzVHlwZTogaXNUeXBlLFxuICBpc1Byb21pc2U6IGlzUHJvbWlzZSxcbiAgaXNCcm93c2VyOiBpc0Jyb3dzZXIsXG4gIGpzb25QYXJzZToganNvblBhcnNlLFxuICBMRVZFTFM6IExFVkVMUyxcbiAgbWFrZVVuaGFuZGxlZFN0YWNrSW5mbzogbWFrZVVuaGFuZGxlZFN0YWNrSW5mbyxcbiAgbWVyZ2U6IG1lcmdlLFxuICBub3c6IG5vdyxcbiAgcmVkYWN0OiByZWRhY3QsXG4gIFJvbGxiYXJKU09OOiBSb2xsYmFySlNPTixcbiAgc2FuaXRpemVVcmw6IHNhbml0aXplVXJsLFxuICBzZXQ6IHNldCxcbiAgc2V0dXBKU09OOiBzZXR1cEpTT04sXG4gIHN0cmluZ2lmeTogc3RyaW5naWZ5LFxuICBtYXhCeXRlU2l6ZTogbWF4Qnl0ZVNpemUsXG4gIHR5cGVOYW1lOiB0eXBlTmFtZSxcbiAgdXVpZDQ6IHV1aWQ0LFxufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvKiBnbG9iYWxzIGV4cGVjdCAqL1xuLyogZ2xvYmFscyBkZXNjcmliZSAqL1xuLyogZ2xvYmFscyBpdCAqL1xuLyogZ2xvYmFscyBzaW5vbiAqL1xuXG52YXIgQVBJID0gcmVxdWlyZSgnLi4vc3JjL2FwaScpO1xudmFyIHV0aWxpdHkgPSByZXF1aXJlKCcuLi9zcmMvdXRpbGl0eScpO1xudXRpbGl0eS5zZXR1cEpTT04oKTtcblxuZnVuY3Rpb24gVGVzdFRyYW5zcG9ydEdlbmVyYXRvcigpIHtcbiAgdmFyIFRlc3RUcmFuc3BvcnQgPSBmdW5jdGlvbiAoY2FsbGJhY2tFcnJvciwgY2FsbGJhY2tSZXNwb25zZSkge1xuICAgIHRoaXMucG9zdEFyZ3MgPSBbXTtcbiAgICB0aGlzLmNhbGxiYWNrRXJyb3IgPSBjYWxsYmFja0Vycm9yO1xuICAgIHRoaXMuY2FsbGJhY2tSZXNwb25zZSA9IGNhbGxiYWNrUmVzcG9uc2U7XG4gIH07XG5cbiAgVGVzdFRyYW5zcG9ydC5wcm90b3R5cGUucG9zdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICB0aGlzLnBvc3RBcmdzLnB1c2goYXJncyk7XG4gICAgdmFyIGNhbGxiYWNrID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdO1xuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrKHRoaXMuY2FsbGJhY2tFcnJvciwgdGhpcy5jYWxsYmFja1Jlc3BvbnNlKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFRlc3RUcmFuc3BvcnQ7XG59XG5cbmRlc2NyaWJlKCdBcGkoKScsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3VzZSB0aGUgZGVmYXVsdHMgaWYgbm8gY3VzdG9tIGVuZHBvaW50IGlzIGdpdmVuJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgYSA9IHVuZGVmaW5lZDtcbiAgICBhLmhlbGxvKCk7XG5cbiAgICB2YXIgdHJhbnNwb3J0ID0gbmV3IChUZXN0VHJhbnNwb3J0R2VuZXJhdG9yKCkpKCk7XG4gICAgdmFyIHVybCA9IHtcbiAgICAgIHBhcnNlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBleHBlY3QoZmFsc2UpLnRvLmJlLm9rKCk7XG4gICAgICB9LFxuICAgIH07XG4gICAgdmFyIGFjY2Vzc1Rva2VuID0gJ2FiYzEyMyc7XG4gICAgdmFyIG9wdGlvbnMgPSB7IGFjY2Vzc1Rva2VuOiBhY2Nlc3NUb2tlbiB9O1xuICAgIHZhciBhcGkgPSBuZXcgQVBJKG9wdGlvbnMsIHRyYW5zcG9ydCwgdXJsKTtcbiAgICAvLyBJIGtub3cgdGhpcyBpcyB0ZXN0aW5nIGludGVybmFsIHN0YXRlIGJ1dCBpdFxuICAgIC8vIGlzIHRoZSBtb3N0IGV4cGVkaWVudCB3YXkgdG8gZG8gdGhpc1xuICAgIGV4cGVjdChhcGkuYWNjZXNzVG9rZW4pLnRvLmVxbChhY2Nlc3NUb2tlbik7XG4gICAgZXhwZWN0KGFwaS50cmFuc3BvcnRPcHRpb25zLmhvc3RuYW1lKS50by5lcWwoJ2FwaS5yb2xsYmFyLmNvbScpO1xuICAgIGV4cGVjdChhcGkudHJhbnNwb3J0T3B0aW9ucy5wYXRoKS50by5tYXRjaCgvXFwvYXBpXFwvMS8pO1xuICAgIGV4cGVjdChhcGkudHJhbnNwb3J0T3B0aW9ucy5wcm90b2NvbCkudG8uZXFsKCdodHRwczonKTtcbiAgICBkb25lKCk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIHBhcnNlIHRoZSBlbmRwb2ludCBhbmQgdXNlIHRoYXQgaWYgZ2l2ZW4nLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciB0cmFuc3BvcnQgPSBuZXcgKFRlc3RUcmFuc3BvcnRHZW5lcmF0b3IoKSkoKTtcbiAgICB2YXIgZW5kcG9pbnQgPSAnaHR0cDovL3dvby5mb28uY29tL2FwaS80Mic7XG4gICAgdmFyIHVybCA9IHtcbiAgICAgIHBhcnNlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBleHBlY3QoZSkudG8uZXFsKGVuZHBvaW50KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBob3N0bmFtZTogJ3dvby5mb28uY29tJyxcbiAgICAgICAgICBwcm90b2NvbDogJ2h0dHA6JyxcbiAgICAgICAgICBwYXRobmFtZTogJy9hcGkvNDInLFxuICAgICAgICAgIHBhdGg6ICcvYXBpLzQyJyxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgfTtcbiAgICB2YXIgYWNjZXNzVG9rZW4gPSAnYWJjMTIzJztcbiAgICB2YXIgb3B0aW9ucyA9IHsgYWNjZXNzVG9rZW46IGFjY2Vzc1Rva2VuLCBlbmRwb2ludDogZW5kcG9pbnQgfTtcbiAgICB2YXIgYXBpID0gbmV3IEFQSShvcHRpb25zLCB0cmFuc3BvcnQsIHVybCk7XG4gICAgZXhwZWN0KGFwaS5hY2Nlc3NUb2tlbikudG8uZXFsKGFjY2Vzc1Rva2VuKTtcbiAgICBleHBlY3QoYXBpLnRyYW5zcG9ydE9wdGlvbnMuaG9zdG5hbWUpLnRvLmVxbCgnd29vLmZvby5jb20nKTtcbiAgICBleHBlY3QoYXBpLnRyYW5zcG9ydE9wdGlvbnMucGF0aCkudG8ubWF0Y2goL1xcL2FwaVxcLzQyLyk7XG4gICAgZXhwZWN0KGFwaS50cmFuc3BvcnRPcHRpb25zLnByb3RvY29sKS50by5lcWwoJ2h0dHA6Jyk7XG4gICAgZG9uZSgpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgncG9zdEl0ZW0nLCBmdW5jdGlvbiAoKSB7XG4gIGl0KCdzaG91bGQgY2FsbCBwb3N0IG9uIHRoZSB0cmFuc3BvcnQgb2JqZWN0JywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgcmVzcG9uc2UgPSAneWVzJztcbiAgICB2YXIgdHJhbnNwb3J0ID0gbmV3IChUZXN0VHJhbnNwb3J0R2VuZXJhdG9yKCkpKG51bGwsIHJlc3BvbnNlKTtcbiAgICB2YXIgdXJsID0ge1xuICAgICAgcGFyc2U6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGV4cGVjdChmYWxzZSkudG8uYmUub2soKTtcbiAgICAgIH0sXG4gICAgfTtcbiAgICB2YXIgYWNjZXNzVG9rZW4gPSAnYWJjMTIzJztcbiAgICB2YXIgb3B0aW9ucyA9IHsgYWNjZXNzVG9rZW46IGFjY2Vzc1Rva2VuIH07XG4gICAgdmFyIGFwaSA9IG5ldyBBUEkob3B0aW9ucywgdHJhbnNwb3J0LCB1cmwpO1xuXG4gICAgdmFyIGRhdGEgPSB7IGE6IDEgfTtcbiAgICBhcGkucG9zdEl0ZW0oZGF0YSwgZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgICAgZXhwZWN0KGVycikudG8ubm90LmJlLm9rKCk7XG4gICAgICBleHBlY3QocmVzcCkudG8uZXFsKHJlc3BvbnNlKTtcbiAgICAgIGV4cGVjdCh0cmFuc3BvcnQucG9zdEFyZ3MubGVuZ3RoKS50by5lcWwoMSk7XG4gICAgICBleHBlY3QodHJhbnNwb3J0LnBvc3RBcmdzWzBdWzBdKS50by5lcWwoYWNjZXNzVG9rZW4pO1xuICAgICAgZXhwZWN0KHRyYW5zcG9ydC5wb3N0QXJnc1swXVsxXS5wYXRoKS50by5tYXRjaCgvXFwvaXRlbVxcLy8pO1xuICAgICAgZXhwZWN0KHRyYW5zcG9ydC5wb3N0QXJnc1swXVsyXS5kYXRhLmEpLnRvLmVxbCgxKTtcbiAgICAgIGRvbmUoKTtcbiAgICB9KTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgc3RyaW5naWZ5IGNvbnRleHQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciByZXNwb25zZSA9ICd5ZXMnO1xuICAgIHZhciB0cmFuc3BvcnQgPSBuZXcgKFRlc3RUcmFuc3BvcnRHZW5lcmF0b3IoKSkobnVsbCwgcmVzcG9uc2UpO1xuICAgIHZhciB1cmwgPSB7XG4gICAgICBwYXJzZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZXhwZWN0KGZhbHNlKS50by5iZS5vaygpO1xuICAgICAgfSxcbiAgICB9O1xuICAgIHZhciBhY2Nlc3NUb2tlbiA9ICdhYmMxMjMnO1xuICAgIHZhciBvcHRpb25zID0geyBhY2Nlc3NUb2tlbjogYWNjZXNzVG9rZW4gfTtcbiAgICB2YXIgYXBpID0gbmV3IEFQSShvcHRpb25zLCB0cmFuc3BvcnQsIHVybCk7XG5cbiAgICB2YXIgZGF0YSA9IHsgYTogMSwgY29udGV4dDogeyBzb21lOiBbMSwgMiwgJ3N0dWZmJ10gfSB9O1xuICAgIGFwaS5wb3N0SXRlbShkYXRhLCBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICBleHBlY3QoZXJyKS50by5ub3QuYmUub2soKTtcbiAgICAgIGV4cGVjdChyZXNwKS50by5lcWwocmVzcG9uc2UpO1xuICAgICAgZXhwZWN0KHRyYW5zcG9ydC5wb3N0QXJncy5sZW5ndGgpLnRvLmVxbCgxKTtcbiAgICAgIGV4cGVjdCh0cmFuc3BvcnQucG9zdEFyZ3NbMF1bMF0pLnRvLmVxbChhY2Nlc3NUb2tlbik7XG4gICAgICBleHBlY3QodHJhbnNwb3J0LnBvc3RBcmdzWzBdWzFdLnBhdGgpLnRvLm1hdGNoKC9cXC9pdGVtXFwvLyk7XG4gICAgICBleHBlY3QodHJhbnNwb3J0LnBvc3RBcmdzWzBdWzFdLm1ldGhvZCkudG8uZXFsKCdQT1NUJyk7XG4gICAgICBleHBlY3QodHJhbnNwb3J0LnBvc3RBcmdzWzBdWzJdLmRhdGEuYSkudG8uZXFsKDEpO1xuICAgICAgZXhwZWN0KHRyYW5zcG9ydC5wb3N0QXJnc1swXVsyXS5kYXRhLmNvbnRleHQpLnRvLmVxbChcbiAgICAgICAgJ3tcInNvbWVcIjpbMSwyLFwic3R1ZmZcIl19JyxcbiAgICAgICk7XG4gICAgICBkb25lKCk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdwb3N0U3BhbnMnLCBmdW5jdGlvbiAoKSB7XG4gIGxldCB0cmFuc3BvcnQ7XG5cbiAgYmVmb3JlRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgLy8gQ3JlYXRlIG1vY2sgdHJhbnNwb3J0XG4gICAgdHJhbnNwb3J0ID0ge1xuICAgICAgcG9zdDogc2lub25cbiAgICAgICAgLnN0dWIoKVxuICAgICAgICAuY2FsbHNGYWtlKChhY2Nlc3NUb2tlbiwgb3B0aW9ucywgcGF5bG9hZCwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCB7IHJlc3VsdDogJ29rJyB9KTtcbiAgICAgICAgfSksXG4gICAgICBwb3N0SnNvblBheWxvYWQ6IHNpbm9uLnN0dWIoKSxcbiAgICB9O1xuICB9KTtcblxuICBhZnRlckVhY2goZnVuY3Rpb24gKCkge1xuICAgIHNpbm9uLnJlc3RvcmUoKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBjYWxsIHBvc3Qgb24gdGhlIHRyYW5zcG9ydCBvYmplY3QnLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgdXJsbGliID0gcmVxdWlyZSgnLi4vc3JjL2Jyb3dzZXIvdXJsJyk7XG4gICAgY29uc3QgcmVzcG9uc2UgPSAneWVzJztcbiAgICBjb25zdCB1cmwgPSB7XG4gICAgICBwYXJzZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZXhwZWN0KGZhbHNlKS50by5iZS5vaygpO1xuICAgICAgfSxcbiAgICB9O1xuICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gJ2FiYzEyMyc7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIGFjY2Vzc1Rva2VuOiBhY2Nlc3NUb2tlbixcbiAgICAgIHRyYWNpbmc6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgZW5kcG9pbnQ6ICdodHRwczovL2FwaS5yb2xsYmFyLmNvbS9hcGkvMS9zZXNzaW9uLycsXG4gICAgICB9LFxuICAgIH07XG4gICAgY29uc3QgYXBpID0gbmV3IEFQSShvcHRpb25zLCB0cmFuc3BvcnQsIHVybGxpYik7XG5cbiAgICBjb25zdCBkYXRhID0geyBhOiAxIH07XG4gICAgYXdhaXQgYXBpLnBvc3RTcGFucyhkYXRhKTtcblxuICAgIGV4cGVjdCh0cmFuc3BvcnQucG9zdC5jYWxsZWQpLnRvLmJlLnRydWU7XG5cbiAgICBleHBlY3QodHJhbnNwb3J0LnBvc3QuY2FsbENvdW50KS50by5lcWwoMSk7XG4gICAgZXhwZWN0KHRyYW5zcG9ydC5wb3N0LmZpcnN0Q2FsbC5hcmdzLmxlbmd0aCkudG8uZXFsKDQpO1xuICAgIGV4cGVjdCh0cmFuc3BvcnQucG9zdC5maXJzdENhbGwuYXJnc1swXSkudG8uZXFsKGFjY2Vzc1Rva2VuKTtcbiAgICBleHBlY3QodHJhbnNwb3J0LnBvc3QuZmlyc3RDYWxsLmFyZ3NbMV0ucGF0aCkudG8ubWF0Y2goL1xcL3Nlc3Npb25cXC8vKTtcbiAgICBleHBlY3QodHJhbnNwb3J0LnBvc3QuZmlyc3RDYWxsLmFyZ3NbMV0ubWV0aG9kKS50by5lcWwoJ1BPU1QnKTtcbiAgICBleHBlY3QodHJhbnNwb3J0LnBvc3QuZmlyc3RDYWxsLmFyZ3NbMl0uYSkudG8uZXFsKDEpO1xuICB9KTtcbn0pO1xuIl0sIm5hbWVzIjpbIl9yZWdlbmVyYXRvclJ1bnRpbWUiLCJlIiwidCIsInIiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJuIiwiaGFzT3duUHJvcGVydHkiLCJvIiwiZGVmaW5lUHJvcGVydHkiLCJ2YWx1ZSIsImkiLCJTeW1ib2wiLCJhIiwiaXRlcmF0b3IiLCJjIiwiYXN5bmNJdGVyYXRvciIsInUiLCJ0b1N0cmluZ1RhZyIsImRlZmluZSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsIndyYXAiLCJHZW5lcmF0b3IiLCJjcmVhdGUiLCJDb250ZXh0IiwibWFrZUludm9rZU1ldGhvZCIsInRyeUNhdGNoIiwidHlwZSIsImFyZyIsImNhbGwiLCJoIiwibCIsImYiLCJzIiwieSIsIkdlbmVyYXRvckZ1bmN0aW9uIiwiR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUiLCJwIiwiZCIsImdldFByb3RvdHlwZU9mIiwidiIsInZhbHVlcyIsImciLCJkZWZpbmVJdGVyYXRvck1ldGhvZHMiLCJmb3JFYWNoIiwiX2ludm9rZSIsIkFzeW5jSXRlcmF0b3IiLCJpbnZva2UiLCJfdHlwZW9mIiwicmVzb2x2ZSIsIl9fYXdhaXQiLCJ0aGVuIiwiY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmciLCJFcnJvciIsImRvbmUiLCJtZXRob2QiLCJkZWxlZ2F0ZSIsIm1heWJlSW52b2tlRGVsZWdhdGUiLCJzZW50IiwiX3NlbnQiLCJkaXNwYXRjaEV4Y2VwdGlvbiIsImFicnVwdCIsIlR5cGVFcnJvciIsInJlc3VsdE5hbWUiLCJuZXh0IiwibmV4dExvYyIsInB1c2hUcnlFbnRyeSIsInRyeUxvYyIsImNhdGNoTG9jIiwiZmluYWxseUxvYyIsImFmdGVyTG9jIiwidHJ5RW50cmllcyIsInB1c2giLCJyZXNldFRyeUVudHJ5IiwiY29tcGxldGlvbiIsInJlc2V0IiwiaXNOYU4iLCJsZW5ndGgiLCJkaXNwbGF5TmFtZSIsImlzR2VuZXJhdG9yRnVuY3Rpb24iLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJtYXJrIiwic2V0UHJvdG90eXBlT2YiLCJfX3Byb3RvX18iLCJhd3JhcCIsImFzeW5jIiwiUHJvbWlzZSIsImtleXMiLCJyZXZlcnNlIiwicG9wIiwicHJldiIsImNoYXJBdCIsInNsaWNlIiwic3RvcCIsInJ2YWwiLCJoYW5kbGUiLCJjb21wbGV0ZSIsImZpbmlzaCIsIl9jYXRjaCIsImRlbGVnYXRlWWllbGQiLCJhc3luY0dlbmVyYXRvclN0ZXAiLCJfYXN5bmNUb0dlbmVyYXRvciIsImFyZ3VtZW50cyIsImFwcGx5IiwiX25leHQiLCJfdGhyb3ciLCJfIiwicmVxdWlyZSIsImhlbHBlcnMiLCJkZWZhdWx0T3B0aW9ucyIsImhvc3RuYW1lIiwicGF0aCIsInNlYXJjaCIsInZlcnNpb24iLCJwcm90b2NvbCIsInBvcnQiLCJPVExQRGVmYXVsdE9wdGlvbnMiLCJBcGkiLCJvcHRpb25zIiwidHJhbnNwb3J0IiwidXJsbGliIiwidHJ1bmNhdGlvbiIsInVybCIsImFjY2Vzc1Rva2VuIiwidHJhbnNwb3J0T3B0aW9ucyIsIl9nZXRUcmFuc3BvcnQiLCJPVExQVHJhbnNwb3J0T3B0aW9ucyIsIl9nZXRPVExQVHJhbnNwb3J0IiwiX3Bvc3RQcm9taXNlIiwiX3JlZiIsInBheWxvYWQiLCJzZWxmIiwicmVqZWN0IiwicG9zdCIsImVyciIsInJlc3AiLCJwb3N0SXRlbSIsImRhdGEiLCJjYWxsYmFjayIsImJ1aWxkUGF5bG9hZCIsInNldFRpbWVvdXQiLCJwb3N0U3BhbnMiLCJfcmVmMiIsIl9jYWxsZWUiLCJfY2FsbGVlJCIsIl9jb250ZXh0IiwiX3giLCJidWlsZEpzb25QYXlsb2FkIiwic3RyaW5naWZ5UmVzdWx0IiwidHJ1bmNhdGUiLCJzdHJpbmdpZnkiLCJlcnJvciIsInBvc3RKc29uUGF5bG9hZCIsImpzb25QYXlsb2FkIiwiY29uZmlndXJlIiwib2xkT3B0aW9ucyIsIm1lcmdlIiwidW5kZWZpbmVkIiwiZ2V0VHJhbnNwb3J0RnJvbU9wdGlvbnMiLCJfb3B0aW9ucyR0cmFjaW5nIiwiX29iamVjdFNwcmVhZCIsImVuZHBvaW50IiwidHJhY2luZyIsIm1vZHVsZSIsImV4cG9ydHMiLCJpc1R5cGUiLCJjb250ZXh0IiwiY29udGV4dFJlc3VsdCIsInN1YnN0ciIsImRlZmF1bHRzIiwidGltZW91dCIsImRldGVjdFRyYW5zcG9ydCIsInByb3h5Iiwib3B0cyIsInBhcnNlIiwicGF0aG5hbWUiLCJnV2luZG93Iiwid2luZG93IiwiZGVmYXVsdFRyYW5zcG9ydCIsImZldGNoIiwiWE1MSHR0cFJlcXVlc3QiLCJ0cmFuc3BvcnRBUEkiLCJob3N0IiwiYXBwZW5kUGF0aFRvUGF0aCIsImJhc2UiLCJiYXNlVHJhaWxpbmdTbGFzaCIsInRlc3QiLCJwYXRoQmVnaW5uaW5nU2xhc2giLCJzdWJzdHJpbmciLCJyZXN1bHQiLCJhdXRoIiwiaGFzaCIsImhyZWYiLCJxdWVyeSIsImxhc3QiLCJpbmRleE9mIiwic3BsaXQiLCJwYXJzZUludCIsInBhdGhQYXJ0cyIsImhhc093biIsInRvU3RyIiwidG9TdHJpbmciLCJpc1BsYWluT2JqZWN0Iiwib2JqIiwiaGFzT3duQ29uc3RydWN0b3IiLCJoYXNJc1Byb3RvdHlwZU9mIiwia2V5Iiwic3JjIiwiY29weSIsImNsb25lIiwiY3VycmVudCIsIlJvbGxiYXJKU09OIiwic2V0dXBKU09OIiwicG9seWZpbGxKU09OIiwiaXNGdW5jdGlvbiIsImlzRGVmaW5lZCIsIkpTT04iLCJpc05hdGl2ZUZ1bmN0aW9uIiwieCIsInR5cGVOYW1lIiwibWF0Y2giLCJ0b0xvd2VyQ2FzZSIsInJlUmVnRXhwQ2hhciIsImZ1bmNNYXRjaFN0cmluZyIsIkZ1bmN0aW9uIiwicmVwbGFjZSIsInJlSXNOYXRpdmUiLCJSZWdFeHAiLCJpc09iamVjdCIsImlzU3RyaW5nIiwiU3RyaW5nIiwiaXNGaW5pdGVOdW1iZXIiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsImlzSXRlcmFibGUiLCJpc0Vycm9yIiwiaXNQcm9taXNlIiwiaXNCcm93c2VyIiwicmVkYWN0IiwidXVpZDQiLCJub3ciLCJ1dWlkIiwiTWF0aCIsInJhbmRvbSIsImZsb29yIiwiTEVWRUxTIiwiZGVidWciLCJpbmZvIiwid2FybmluZyIsImNyaXRpY2FsIiwic2FuaXRpemVVcmwiLCJiYXNlVXJsUGFydHMiLCJwYXJzZVVyaSIsImFuY2hvciIsInNvdXJjZSIsInBhcnNlVXJpT3B0aW9ucyIsInN0cmljdE1vZGUiLCJxIiwicGFyc2VyIiwic3RyaWN0IiwibG9vc2UiLCJzdHIiLCJtIiwiZXhlYyIsInVyaSIsIiQwIiwiJDEiLCIkMiIsImFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoIiwicGFyYW1zIiwiYWNjZXNzX3Rva2VuIiwicGFyYW1zQXJyYXkiLCJrIiwiam9pbiIsInNvcnQiLCJxcyIsImZvcm1hdFVybCIsImJhY2t1cCIsImpzb25FcnJvciIsImJhY2t1cEVycm9yIiwibWF4Qnl0ZVNpemUiLCJzdHJpbmciLCJjb3VudCIsImNvZGUiLCJjaGFyQ29kZUF0IiwianNvblBhcnNlIiwibWFrZVVuaGFuZGxlZFN0YWNrSW5mbyIsIm1lc3NhZ2UiLCJsaW5lbm8iLCJjb2xubyIsIm1vZGUiLCJiYWNrdXBNZXNzYWdlIiwiZXJyb3JQYXJzZXIiLCJsb2NhdGlvbiIsImxpbmUiLCJjb2x1bW4iLCJmdW5jIiwiZ3Vlc3NGdW5jdGlvbk5hbWUiLCJnYXRoZXJDb250ZXh0IiwiZG9jdW1lbnQiLCJ1c2VyYWdlbnQiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJzdGFjayIsIndyYXBDYWxsYmFjayIsImxvZ2dlciIsIm5vbkNpcmN1bGFyQ2xvbmUiLCJzZWVuIiwibmV3U2VlbiIsImluY2x1ZGVzIiwiY3JlYXRlSXRlbSIsImFyZ3MiLCJub3RpZmllciIsInJlcXVlc3RLZXlzIiwibGFtYmRhQ29udGV4dCIsImN1c3RvbSIsInJlcXVlc3QiLCJleHRyYUFyZ3MiLCJkaWFnbm9zdGljIiwiYXJnVHlwZXMiLCJ0eXAiLCJET01FeGNlcHRpb24iLCJqIiwibGVuIiwiaXRlbSIsInRpbWVzdGFtcCIsInNldEN1c3RvbUl0ZW1LZXlzIiwiX29yaWdpbmFsQXJncyIsIm9yaWdpbmFsX2FyZ190eXBlcyIsImxldmVsIiwic2tpcEZyYW1lcyIsImFkZEVycm9yQ29udGV4dCIsImVycm9ycyIsImNvbnRleHRBZGRlZCIsInJvbGxiYXJDb250ZXh0IiwiZXJyb3JfY29udGV4dCIsIlRFTEVNRVRSWV9UWVBFUyIsIlRFTEVNRVRSWV9MRVZFTFMiLCJhcnJheUluY2x1ZGVzIiwiYXJyIiwidmFsIiwiY3JlYXRlVGVsZW1ldHJ5RXZlbnQiLCJtZXRhZGF0YSIsImV2ZW50IiwiYWRkSXRlbUF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVzIiwiX2l0ZW0kZGF0YSRhdHRyaWJ1dGVzIiwiX3RvQ29uc3VtYWJsZUFycmF5IiwiZ2V0Iiwic2V0IiwidGVtcCIsInJlcGxhY2VtZW50IiwiZm9ybWF0QXJnc0FzU3RyaW5nIiwiRGF0ZSIsImZpbHRlcklwIiwicmVxdWVzdERhdGEiLCJjYXB0dXJlSXAiLCJuZXdJcCIsInBhcnRzIiwiYmVnaW5uaW5nIiwic2xhc2hJZHgiLCJ0ZXJtaW5hbCIsImNvbmNhdCIsImhhbmRsZU9wdGlvbnMiLCJpbnB1dCIsInVwZGF0ZURlcHJlY2F0ZWRPcHRpb25zIiwib3ZlcndyaXRlU2NydWJGaWVsZHMiLCJzY3J1YkZpZWxkcyIsImhvc3RXaGl0ZUxpc3QiLCJob3N0U2FmZUxpc3QiLCJsb2ciLCJob3N0QmxhY2tMaXN0IiwiaG9zdEJsb2NrTGlzdCJdLCJzb3VyY2VSb290IjoiIn0=