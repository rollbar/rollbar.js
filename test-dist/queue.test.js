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

/***/ "./src/queue.js":
/*!**********************!*\
  !*** ./src/queue.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");

/*
 * Queue - an object which handles which handles a queue of items to be sent to Rollbar.
 *   This object handles rate limiting via a passed in rate limiter, retries based on connection
 *   errors, and filtering of items based on a set of configurable predicates. The communication to
 *   the backend is performed via a given API object.
 *
 * @param rateLimiter - An object which conforms to the interface
 *    rateLimiter.shouldSend(item) -> bool
 * @param api - An object which conforms to the interface
 *    api.postItem(payload, function(err, response))
 * @param logger - An object used to log verbose messages if desired
 * @param options - see Queue.prototype.configure
 * @param replayMap - Optional ReplayMap for coordinating session replay with error occurrences
 */
function Queue(rateLimiter, api, logger, options, replayMap) {
  this.rateLimiter = rateLimiter;
  this.api = api;
  this.logger = logger;
  this.options = options;
  this.replayMap = replayMap;
  this.predicates = [];
  this.pendingItems = [];
  this.pendingRequests = [];
  this.retryQueue = [];
  this.retryHandle = null;
  this.waitCallback = null;
  this.waitIntervalID = null;
}

/*
 * configure - updates the options this queue uses
 *
 * @param options
 */
Queue.prototype.configure = function (options) {
  this.api && this.api.configure(options);
  var oldOptions = this.options;
  this.options = _.merge(oldOptions, options);
  return this;
};

/*
 * addPredicate - adds a predicate to the end of the list of predicates for this queue
 *
 * @param predicate - function(item, options) -> (bool|{err: Error})
 *  Returning true means that this predicate passes and the item is okay to go on the queue
 *  Returning false means do not add the item to the queue, but it is not an error
 *  Returning {err: Error} means do not add the item to the queue, and the given error explains why
 *  Returning {err: undefined} is equivalent to returning true but don't do that
 */
Queue.prototype.addPredicate = function (predicate) {
  if (_.isFunction(predicate)) {
    this.predicates.push(predicate);
  }
  return this;
};
Queue.prototype.addPendingItem = function (item) {
  this.pendingItems.push(item);
};
Queue.prototype.removePendingItem = function (item) {
  var idx = this.pendingItems.indexOf(item);
  if (idx !== -1) {
    this.pendingItems.splice(idx, 1);
  }
};

/*
 * addItem - Send an item to the Rollbar API if all of the predicates are satisfied
 *
 * @param item - The payload to send to the backend
 * @param callback - function(error, repsonse) which will be called with the response from the API
 *  in the case of a success, otherwise response will be null and error will have a value. If both
 *  error and response are null then the item was stopped by a predicate which did not consider this
 *  to be an error condition, but nonetheless did not send the item to the API.
 *  @param originalError - The original error before any transformations that is to be logged if any
 */
Queue.prototype.addItem = function (item, callback, originalError, originalItem) {
  if (!callback || !_.isFunction(callback)) {
    callback = function callback() {
      return;
    };
  }
  var predicateResult = this._applyPredicates(item);
  if (predicateResult.stop) {
    this.removePendingItem(originalItem);
    callback(predicateResult.err);
    return;
  }
  this._maybeLog(item, originalError);
  this.removePendingItem(originalItem);
  if (!this.options.transmit) {
    callback(new Error('Transmit disabled'));
    return;
  }
  if (this.replayMap && item.body) {
    var replayId = this.replayMap.add(item.uuid);
    item.replayId = replayId;
  }
  this.pendingRequests.push(item);
  try {
    this._makeApiRequest(item, function (err, resp) {
      this._dequeuePendingRequest(item);
      if (!err && resp && item.replayId) {
        this._handleReplayResponse(item.replayId, resp);
      }
      callback(err, resp);
    }.bind(this));
  } catch (e) {
    this._dequeuePendingRequest(item);
    callback(e);
  }
};

/*
 * wait - Stop any further errors from being added to the queue, and get called back when all items
 *   currently processing have finished sending to the backend.
 *
 * @param callback - function() called when all pending items have been sent
 */
Queue.prototype.wait = function (callback) {
  if (!_.isFunction(callback)) {
    return;
  }
  this.waitCallback = callback;
  if (this._maybeCallWait()) {
    return;
  }
  if (this.waitIntervalID) {
    this.waitIntervalID = clearInterval(this.waitIntervalID);
  }
  this.waitIntervalID = setInterval(function () {
    this._maybeCallWait();
  }.bind(this), 500);
};

/* _applyPredicates - Sequentially applies the predicates that have been added to the queue to the
 *   given item with the currently configured options.
 *
 * @param item - An item in the queue
 * @returns {stop: bool, err: (Error|null)} - stop being true means do not add item to the queue,
 *   the error value should be passed up to a callbak if we are stopping.
 */
Queue.prototype._applyPredicates = function (item) {
  var p = null;
  for (var i = 0, len = this.predicates.length; i < len; i++) {
    p = this.predicates[i](item, this.options);
    if (!p || p.err !== undefined) {
      return {
        stop: true,
        err: p.err
      };
    }
  }
  return {
    stop: false,
    err: null
  };
};

/*
 * _makeApiRequest - Send an item to Rollbar, callback when done, if there is an error make an
 *   effort to retry if we are configured to do so.
 *
 * @param item - an item ready to send to the backend
 * @param callback - function(err, response)
 */
Queue.prototype._makeApiRequest = function (item, callback) {
  var rateLimitResponse = this.rateLimiter.shouldSend(item);
  if (rateLimitResponse.shouldSend) {
    this.api.postItem(item, function (err, resp) {
      if (err) {
        this._maybeRetry(err, item, callback);
      } else {
        callback(err, resp);
      }
    }.bind(this));
  } else if (rateLimitResponse.error) {
    callback(rateLimitResponse.error);
  } else {
    this.api.postItem(rateLimitResponse.payload, callback);
  }
};

// These are errors basically mean there is no internet connection
var RETRIABLE_ERRORS = ['ECONNRESET', 'ENOTFOUND', 'ESOCKETTIMEDOUT', 'ETIMEDOUT', 'ECONNREFUSED', 'EHOSTUNREACH', 'EPIPE', 'EAI_AGAIN'];

/*
 * _maybeRetry - Given the error returned by the API, decide if we should retry or just callback
 *   with the error.
 *
 * @param err - an error returned by the API transport
 * @param item - the item that was trying to be sent when this error occured
 * @param callback - function(err, response)
 */
Queue.prototype._maybeRetry = function (err, item, callback) {
  var shouldRetry = false;
  if (this.options.retryInterval) {
    for (var i = 0, len = RETRIABLE_ERRORS.length; i < len; i++) {
      if (err.code === RETRIABLE_ERRORS[i]) {
        shouldRetry = true;
        break;
      }
    }
    if (shouldRetry && _.isFiniteNumber(this.options.maxRetries)) {
      item.retries = item.retries ? item.retries + 1 : 1;
      if (item.retries > this.options.maxRetries) {
        shouldRetry = false;
      }
    }
  }
  if (shouldRetry) {
    this._retryApiRequest(item, callback);
  } else {
    callback(err);
  }
};

/*
 * _retryApiRequest - Add an item and a callback to a queue and possibly start a timer to process
 *   that queue based on the retryInterval in the options for this queue.
 *
 * @param item - an item that failed to send due to an error we deem retriable
 * @param callback - function(err, response)
 */
Queue.prototype._retryApiRequest = function (item, callback) {
  this.retryQueue.push({
    item: item,
    callback: callback
  });
  if (!this.retryHandle) {
    this.retryHandle = setInterval(function () {
      while (this.retryQueue.length) {
        var retryObject = this.retryQueue.shift();
        this._makeApiRequest(retryObject.item, retryObject.callback);
      }
    }.bind(this), this.options.retryInterval);
  }
};

/*
 * _dequeuePendingRequest - Removes the item from the pending request queue, this queue is used to
 *   enable to functionality of providing a callback that clients can pass to `wait` to be notified
 *   when the pending request queue has been emptied. This must be called when the API finishes
 *   processing this item. If a `wait` callback is configured, it is called by this function.
 *
 * @param item - the item previously added to the pending request queue
 */
Queue.prototype._dequeuePendingRequest = function (item) {
  var idx = this.pendingRequests.indexOf(item);
  if (idx !== -1) {
    this.pendingRequests.splice(idx, 1);
    this._maybeCallWait();
  }
};
Queue.prototype._maybeLog = function (data, originalError) {
  if (this.logger && this.options.verbose) {
    var message = originalError;
    message = message || _.get(data, 'body.trace.exception.message');
    message = message || _.get(data, 'body.trace_chain.0.exception.message');
    if (message) {
      this.logger.error(message);
      return;
    }
    message = _.get(data, 'body.message.body');
    if (message) {
      this.logger.log(message);
    }
  }
};
Queue.prototype._maybeCallWait = function () {
  if (_.isFunction(this.waitCallback) && this.pendingItems.length === 0 && this.pendingRequests.length === 0) {
    if (this.waitIntervalID) {
      this.waitIntervalID = clearInterval(this.waitIntervalID);
    }
    this.waitCallback();
    return true;
  }
  return false;
};

/**
 * Handles the API response for an item with a replay ID.
 * Based on the success or failure status of the response,
 * it either sends or discards the associated session replay.
 *
 * @param {string} replayId - The ID of the replay to handle
 * @param {Object} response - The API response
 * @returns {Promise<boolean>} A promise that resolves to true if replay was sent successfully,
 *                             false if replay was discarded or an error occurred
 * @private
 */
Queue.prototype._handleReplayResponse = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(replayId, response) {
    var result;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (this.replayMap) {
            _context.next = 3;
            break;
          }
          console.warn('Queue._handleReplayResponse: ReplayMap not available');
          return _context.abrupt("return", false);
        case 3:
          if (replayId) {
            _context.next = 6;
            break;
          }
          console.warn('Queue._handleReplayResponse: No replayId provided');
          return _context.abrupt("return", false);
        case 6:
          _context.prev = 6;
          if (!(response && response.err === 0)) {
            _context.next = 14;
            break;
          }
          _context.next = 10;
          return this.replayMap.send(replayId);
        case 10:
          result = _context.sent;
          return _context.abrupt("return", result);
        case 14:
          this.replayMap.discard(replayId);
          return _context.abrupt("return", false);
        case 16:
          _context.next = 22;
          break;
        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](6);
          console.error('Error handling replay response:', _context.t0);
          return _context.abrupt("return", false);
        case 22:
        case "end":
          return _context.stop();
      }
    }, _callee, this, [[6, 18]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
module.exports = Queue;

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
/*!****************************!*\
  !*** ./test/queue.test.js ***!
  \****************************/
/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var Queue = __webpack_require__(/*! ../src/queue */ "./src/queue.js");

function TestRateLimiterGenerator() {
  var TestRateLimiter = function () {
    this.shouldSendValue = true;
    this.handler = null;
  };

  TestRateLimiter.prototype.shouldSend = function (item) {
    if (this.handler && typeof this.handler === 'function') {
      return this.handler(item);
    }
    return this.shouldSendValue;
  };

  return TestRateLimiter;
}

function TestApiGenerator() {
  var TestApi = function (handler) {
    this.handler = handler;
  };

  TestApi.prototype.postItem = function (item, callback) {
    if (this.handler && typeof this.handler === 'function') {
      this.handler(item, callback);
    } else {
      if (callback && typeof callback === 'function') {
        callback(new Error('BROKEN'), null);
      }
    }
  };

  TestApi.prototype.configure = function () {};

  return TestApi;
}

function TestLoggerGenerator() {
  var TestLogger = function () {
    this.calls = {
      log: [],
      error: [],
      info: [],
    };
  };
  TestLogger.prototype.log = function () {
    this.calls.log.push(arguments);
  };
  TestLogger.prototype.error = function () {
    this.calls.error.push(arguments);
  };
  TestLogger.prototype.info = function () {
    this.calls.info.push(arguments);
  };
  return TestLogger;
}

describe('Queue()', function () {
  it('should have all of the expected methods', function (done) {
    var rateLimiter = new (TestRateLimiterGenerator())();
    var api = new (TestApiGenerator())();
    var logger = new (TestLoggerGenerator())();
    var options = {};
    var queue = new Queue(rateLimiter, api, logger, options);
    expect(queue).to.have.property('configure');
    expect(queue).to.have.property('addPredicate');
    expect(queue).to.have.property('addItem');
    expect(queue).to.have.property('wait');

    done();
  });
});

describe('configure', function () {
  it('should update the options', function (done) {
    var rateLimiter = new (TestRateLimiterGenerator())();
    var api = new (TestApiGenerator())();
    var logger = new (TestLoggerGenerator())();
    var options = { a: 1, b: 42 };
    var queue = new Queue(rateLimiter, api, logger, options);

    expect(queue.options.a).to.eql(1);
    expect(queue.options.b).to.eql(42);

    queue.configure({ a: 2, c: 15 });

    expect(queue.options.a).to.eql(2);
    expect(queue.options.b).to.eql(42);
    expect(queue.options.c).to.eql(15);

    done();
  });
});

describe('addItem', function () {
  describe('not rate limited', function () {
    describe('api success', function () {
      it('should work with no callback', function (done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = { transmit: true };
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = { mykey: 'myvalue' };
        var serverResponse = { success: true };

        rateLimiter.handler = function (i) {
          expect(i).to.eql(item);
          return { error: null, shouldSend: true, payload: null };
        };
        api.handler = function (i, cb) {
          expect(i).to.eql(item);
          cb(null, serverResponse);
          done();
        };
        queue.addItem({ mykey: 'myvalue' });
      });
      it('should work with a garbage callback', function (done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = { transmit: true };
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = { mykey: 'myvalue' };
        var serverResponse = { success: true };

        rateLimiter.handler = function (i) {
          expect(i).to.eql(item);
          return { error: null, shouldSend: true, payload: null };
        };
        api.handler = function (i, cb) {
          expect(i).to.eql(item);
          cb(null, serverResponse);
          done();
        };
        queue.addItem({ mykey: 'myvalue' }, 'woops');
      });
      it('should work with no predicates', function (done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = { transmit: true };
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = { mykey: 'myvalue' };
        var serverResponse = { success: true };

        rateLimiter.handler = function (i) {
          expect(i).to.eql(item);
          return { error: null, shouldSend: true, payload: null };
        };
        api.handler = function (i, cb) {
          expect(i).to.eql(item);
          cb(null, serverResponse);
        };
        queue.addItem({ mykey: 'myvalue' }, function (err, resp) {
          expect(resp).to.eql(serverResponse);
          done(err);
        });
      });
      it('should call the logger if an error is about to be logged', function (done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = { verbose: true, transmit: true };
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = { body: { trace: { exception: { message: 'hello' } } } };
        var serverResponse = { success: true };

        rateLimiter.handler = function (i) {
          expect(i).to.eql(item);
          return { error: null, shouldSend: true, payload: null };
        };
        api.handler = function (i, cb) {
          expect(i).to.eql(item);
          cb(null, serverResponse);
        };
        queue.addItem(item, function (err, resp) {
          expect(resp).to.eql(serverResponse);
          expect(logger.calls.error[0][0]).to.eql('hello');
          done(err);
        });
      });
      it('should call the logger if a message is about to be logged', function (done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = { verbose: true, transmit: true };
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = { body: { message: { body: 'hello' } } };
        var serverResponse = { success: true };

        rateLimiter.handler = function (i) {
          expect(i).to.eql(item);
          return { error: null, shouldSend: true, payload: null };
        };
        api.handler = function (i, cb) {
          expect(i).to.eql(item);
          cb(null, serverResponse);
        };
        queue.addItem(item, function (err, resp) {
          expect(resp).to.eql(serverResponse);
          expect(logger.calls.log[0][0]).to.eql('hello');
          done(err);
        });
      });
      it('should not call the logger if verbose is false', function (done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = { verbose: false, transmit: true };
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = { body: { message: { body: 'hello' } } };
        var serverResponse = { success: true };

        rateLimiter.handler = function (i) {
          expect(i).to.eql(item);
          return { error: null, shouldSend: true, payload: null };
        };
        api.handler = function (i, cb) {
          expect(i).to.eql(item);
          cb(null, serverResponse);
        };
        queue.addItem(item, function (err, resp) {
          expect(resp).to.eql(serverResponse);
          expect(logger.calls.log.length).to.eql(0);
          done(err);
        });
      });
      it('should stop if a predicate returns false', function (done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = { transmit: true };
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = { mykey: 'myvalue' };
        var serverResponse = { success: true };

        rateLimiter.handler = function (i) {
          expect(false).to.be.ok();
          return { error: null, shouldSend: true, payload: null };
        };
        api.handler = function (i, cb) {
          expect(false).to.be.ok();
          cb(null, serverResponse);
        };
        queue.addPredicate(function (i, s) {
          return false;
        });
        queue.addItem({ mykey: 'myvalue' }, function (err, resp) {
          expect(resp).to.not.be.ok();
          done(err);
        });
      });
      it('should stop if a predicate returns an error', function (done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = { transmit: true };
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = { mykey: 'myvalue' };
        var serverResponse = { success: true };

        rateLimiter.handler = function (i) {
          expect(false).to.be.ok();
          return { error: null, shouldSend: true, payload: null };
        };
        api.handler = function (i, cb) {
          expect(false).to.be.ok();
          cb(null, serverResponse);
        };
        var predicateError = 'bork bork';
        queue.addPredicate(function (i, s) {
          return { err: predicateError };
        });
        queue.addItem({ mykey: 'myvalue' }, function (err, resp) {
          expect(err).to.eql(predicateError);
          expect(resp).to.not.be.ok();
          done();
        });
      });
      it('should stop if any predicate returns an error', function (done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = { transmit: true };
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = { mykey: 'myvalue' };
        var serverResponse = { success: true };

        rateLimiter.handler = function (i) {
          expect(false).to.be.ok();
          return { error: null, shouldSend: true, payload: null };
        };
        api.handler = function (i, cb) {
          expect(false).to.be.ok();
          cb(null, serverResponse);
        };
        var predicateError = 'bork bork';
        queue
          .addPredicate(function (i, s) {
            return true;
          })
          .addPredicate(function (i, s) {
            return { err: predicateError };
          })
          .addPredicate(function (i, s) {
            return true;
          });
        queue.addItem({ mykey: 'myvalue' }, function (err, resp) {
          expect(err).to.eql(predicateError);
          expect(resp).to.not.be.ok();
          done();
        });
      });
      it('should call wait if set', function (done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = { transmit: true };
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = { mykey: 'myvalue' };
        var serverResponse = { success: true };

        rateLimiter.handler = function (i) {
          expect(false).to.be.ok();
          return { error: null, shouldSend: true, payload: null };
        };
        api.handler = function (i, cb) {
          expect(false).to.be.ok();
          cb(null, serverResponse);
        };
        queue.wait(function () {
          done();
        });
        queue.addItem({ mykey: 'myvalue' }, function (err, resp) {
          expect(resp).to.be.ok();
        });
      });
      it('should work if wait is called with a non-function', function (done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = { transmit: true };
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = { mykey: 'myvalue' };
        var serverResponse = { success: true };

        rateLimiter.handler = function (i) {
          return { error: null, shouldSend: true, payload: null };
        };
        api.handler = function (i, cb) {
          cb(null, serverResponse);
        };
        queue.wait({});
        queue.addItem({ mykey: 'myvalue' }, function (err, resp) {
          expect(resp).to.be.ok();
          done(err);
        });
      });
      it('should work if all predicates return true', function (done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = { transmit: true };
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = { mykey: 'myvalue' };
        var serverResponse = { success: true };

        rateLimiter.handler = function (i) {
          expect(i).to.eql(item);
          return { error: null, shouldSend: true, payload: null };
        };
        api.handler = function (i, cb) {
          expect(i).to.eql(item);
          cb(null, serverResponse);
        };
        queue
          .addPredicate(function (i, s) {
            return true;
          })
          .addPredicate(function () {
            return true;
          });
        queue.addItem({ mykey: 'myvalue' }, function (err, resp) {
          expect(resp).to.eql(serverResponse);
          done(err);
        });
      });
    });
    describe('api failure', function () {
      it('should callback if the api throws an exception', function (done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = { transmit: true };
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = { mykey: 'myvalue' };
        var exception = 'boom!';

        rateLimiter.handler = function (i) {
          expect(i).to.eql(item);
          return { error: null, shouldSend: true, payload: null };
        };
        api.handler = function (i, cb) {
          throw exception;
        };
        queue
          .addPredicate(function (i, s) {
            return true;
          })
          .addPredicate(function () {
            return true;
          });
        queue.addItem({ mykey: 'myvalue' }, function (err, resp) {
          expect(resp).to.not.be.ok();
          expect(err).to.eql(exception);
          done();
        });
      });
      it('should callback with the api error if not retriable', function (done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = { retryInterval: 1, transmit: true };
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = { mykey: 'myvalue' };
        var apiError = { code: 'NOPE', message: 'borked' };

        rateLimiter.handler = function (i) {
          return { error: null, shouldSend: true, payload: null };
        };
        api.handler = function (i, cb) {
          cb(apiError);
        };
        queue.addItem({ mykey: 'myvalue' }, function (err, resp) {
          expect(err).to.eql(apiError);
          expect(resp).to.not.be.ok();
          done();
        });
      });
      it('should callback with the api error if no retryInterval is set', function (done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = { transmit: true };
        var queue = new Queue(rateLimiter, api, logger, options);

        var item = { mykey: 'myvalue' };
        var apiError = { code: 'ENOTFOUND', message: 'No internet connection' };

        rateLimiter.handler = function (i) {
          return { error: null, shouldSend: true, payload: null };
        };
        api.handler = function (i, cb) {
          cb(apiError);
        };
        queue.addItem({ mykey: 'myvalue' }, function (err, resp) {
          expect(err).to.eql(apiError);
          expect(resp).to.not.be.ok();
          done();
        });
      });
      describe('if we get a retriable error', function () {
        it('should retry', function (done) {
          var rateLimiter = new (TestRateLimiterGenerator())();
          var api = new (TestApiGenerator())();
          var logger = new (TestLoggerGenerator())();
          var options = { retryInterval: 1, transmit: true };
          var queue = new Queue(rateLimiter, api, logger, options);

          var item = { mykey: 'myvalue' };
          var serverResponse = { success: true };
          var apiError = {
            code: 'ENOTFOUND',
            message: 'No internet connection',
          };

          var apiRequestCount = 0;
          rateLimiter.handler = function (i) {
            return { error: null, shouldSend: true, payload: null };
          };
          api.handler = function (i, cb) {
            apiRequestCount++;
            if (apiRequestCount === 1) {
              cb(apiError);
            } else {
              cb(null, serverResponse);
            }
          };
          queue.addItem({ mykey: 'myvalue' }, function (err, resp) {
            expect(err).to.not.be.ok();
            expect(resp).to.eql(serverResponse);
            expect(apiRequestCount).to.eql(2);
            done();
          });
        });
        it('should retry until maxRetries limit is reached', function (done) {
          var rateLimiter = new (TestRateLimiterGenerator())();
          var api = new (TestApiGenerator())();
          var logger = new (TestLoggerGenerator())();
          var options = { retryInterval: 1, maxRetries: 2, transmit: true };
          var queue = new Queue(rateLimiter, api, logger, options);

          var item = { mykey: 'myvalue' };
          var serverResponse = { success: true };
          var apiError = {
            code: 'ENOTFOUND',
            message: 'No internet connection',
          };

          var apiRequestCount = 0;
          rateLimiter.handler = function (i) {
            return { error: null, shouldSend: true, payload: null };
          };
          api.handler = function (i, cb) {
            apiRequestCount++;
            cb({ ...apiError, retry: apiRequestCount });
          };
          queue.addItem({ mykey: 'myvalue' }, function (err, resp) {
            var numRequests = options.maxRetries + 1;
            expect(apiRequestCount).to.eql(numRequests);
            expect(err).to.eql({ ...apiError, retry: numRequests });
            expect(resp).to.not.be.ok();
            done();
          });
        });
      });
    });
    describe('transmit disabled', function () {
      it('should not attempt to send', function (done) {
        var rateLimiter = new (TestRateLimiterGenerator())();
        var api = new (TestApiGenerator())();
        var logger = new (TestLoggerGenerator())();
        var options = { transmit: false };
        var queue = new Queue(rateLimiter, api, logger, options);
        var makeApiRequestStub = sinon.stub(queue, '_makeApiRequest');

        queue.addItem({ mykey: 'myvalue' }, function (err) {
          expect(err.message).to.eql('Transmit disabled');
        });

        expect(makeApiRequestStub.called).to.eql(0);

        queue._makeApiRequest.restore();
        done();
      });
    });
  });
  describe('rate limited', function () {
    it('should callback if the rate limiter says not to send and has an error', function (done) {
      var rateLimiter = new (TestRateLimiterGenerator())();
      var api = new (TestApiGenerator())();
      var logger = new (TestLoggerGenerator())();
      var options = { transmit: true };
      var queue = new Queue(rateLimiter, api, logger, options);

      var item = { mykey: 'myvalue' };
      var rateLimitError = 'bork';

      rateLimiter.handler = function (i) {
        expect(i).to.eql(item);
        return { error: rateLimitError, shouldSend: false, payload: null };
      };
      api.handler = function (i, cb) {
        cb(null, 'Good times');
      };
      queue
        .addPredicate(function (i, s) {
          return true;
        })
        .addPredicate(function () {
          return true;
        });
      queue.addItem({ mykey: 'myvalue' }, function (err, resp) {
        expect(resp).to.not.be.ok();
        expect(err).to.eql(rateLimitError);
        done();
      });
    });
    it('should callback if the rate limiter says not to send and has a payload', function (done) {
      var rateLimiter = new (TestRateLimiterGenerator())();
      var api = new (TestApiGenerator())();
      var logger = new (TestLoggerGenerator())();
      var options = { transmit: true };
      var queue = new Queue(rateLimiter, api, logger, options);

      var item = { mykey: 'myvalue' };
      var rateLimitPayload = { something: 'went wrong' };
      var serverResponse = { message: 'good times' };

      rateLimiter.handler = function (i) {
        expect(i).to.eql(item);
        return { error: null, shouldSend: false, payload: rateLimitPayload };
      };
      api.handler = function (i, cb) {
        expect(i).to.eql(rateLimitPayload);
        cb(null, serverResponse);
      };
      queue
        .addPredicate(function (i, s) {
          return true;
        })
        .addPredicate(function () {
          return true;
        });
      queue.addItem({ mykey: 'myvalue' }, function (err, resp) {
        expect(resp).to.eql(serverResponse);
        expect(err).to.not.be.ok();
        done();
      });
    });
  });
});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q2pDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHFDQUFxQztBQUN0RDtBQUNBLDBCQUEwQixrQkFBa0I7QUFDNUM7QUFDQTtBQUNBLGlDQUFpQyxpQ0FBaUM7QUFDbEU7QUFDQTtBQUNBLFdBQVc7QUFDWCxTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7O0FBRUEsd0JBQXdCLGtCQUFrQjtBQUMxQztBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7O0FBRUEsbUJBQW1CO0FBQ25COztBQUVBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVCxzQkFBc0Isa0JBQWtCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7O0FBRUEsbUJBQW1CO0FBQ25CLCtCQUErQjtBQUMvQiw2QkFBNkI7O0FBRTdCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNULHNCQUFzQixrQkFBa0I7QUFDeEM7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3JvbGxiYXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvbWVyZ2UuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9xdWV1ZS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vdGVzdC9xdWV1ZS50ZXN0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbnZhciBpc1BsYWluT2JqZWN0ID0gZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmopIHtcbiAgaWYgKCFvYmogfHwgdG9TdHIuY2FsbChvYmopICE9PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBoYXNPd25Db25zdHJ1Y3RvciA9IGhhc093bi5jYWxsKG9iaiwgJ2NvbnN0cnVjdG9yJyk7XG4gIHZhciBoYXNJc1Byb3RvdHlwZU9mID1cbiAgICBvYmouY29uc3RydWN0b3IgJiZcbiAgICBvYmouY29uc3RydWN0b3IucHJvdG90eXBlICYmXG4gICAgaGFzT3duLmNhbGwob2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgJ2lzUHJvdG90eXBlT2YnKTtcbiAgLy8gTm90IG93biBjb25zdHJ1Y3RvciBwcm9wZXJ0eSBtdXN0IGJlIE9iamVjdFxuICBpZiAob2JqLmNvbnN0cnVjdG9yICYmICFoYXNPd25Db25zdHJ1Y3RvciAmJiAhaGFzSXNQcm90b3R5cGVPZikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIE93biBwcm9wZXJ0aWVzIGFyZSBlbnVtZXJhdGVkIGZpcnN0bHksIHNvIHRvIHNwZWVkIHVwLFxuICAvLyBpZiBsYXN0IG9uZSBpcyBvd24sIHRoZW4gYWxsIHByb3BlcnRpZXMgYXJlIG93bi5cbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgLyoqL1xuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiBrZXkgPT09ICd1bmRlZmluZWQnIHx8IGhhc093bi5jYWxsKG9iaiwga2V5KTtcbn07XG5cbmZ1bmN0aW9uIG1lcmdlKCkge1xuICB2YXIgaSxcbiAgICBzcmMsXG4gICAgY29weSxcbiAgICBjbG9uZSxcbiAgICBuYW1lLFxuICAgIHJlc3VsdCA9IHt9LFxuICAgIGN1cnJlbnQgPSBudWxsLFxuICAgIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY3VycmVudCA9IGFyZ3VtZW50c1tpXTtcbiAgICBpZiAoY3VycmVudCA9PSBudWxsKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBmb3IgKG5hbWUgaW4gY3VycmVudCkge1xuICAgICAgc3JjID0gcmVzdWx0W25hbWVdO1xuICAgICAgY29weSA9IGN1cnJlbnRbbmFtZV07XG4gICAgICBpZiAocmVzdWx0ICE9PSBjb3B5KSB7XG4gICAgICAgIGlmIChjb3B5ICYmIGlzUGxhaW5PYmplY3QoY29weSkpIHtcbiAgICAgICAgICBjbG9uZSA9IHNyYyAmJiBpc1BsYWluT2JqZWN0KHNyYykgPyBzcmMgOiB7fTtcbiAgICAgICAgICByZXN1bHRbbmFtZV0gPSBtZXJnZShjbG9uZSwgY29weSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvcHkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgcmVzdWx0W25hbWVdID0gY29weTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlO1xuIiwidmFyIF8gPSByZXF1aXJlKCcuL3V0aWxpdHknKTtcblxuLypcbiAqIFF1ZXVlIC0gYW4gb2JqZWN0IHdoaWNoIGhhbmRsZXMgd2hpY2ggaGFuZGxlcyBhIHF1ZXVlIG9mIGl0ZW1zIHRvIGJlIHNlbnQgdG8gUm9sbGJhci5cbiAqICAgVGhpcyBvYmplY3QgaGFuZGxlcyByYXRlIGxpbWl0aW5nIHZpYSBhIHBhc3NlZCBpbiByYXRlIGxpbWl0ZXIsIHJldHJpZXMgYmFzZWQgb24gY29ubmVjdGlvblxuICogICBlcnJvcnMsIGFuZCBmaWx0ZXJpbmcgb2YgaXRlbXMgYmFzZWQgb24gYSBzZXQgb2YgY29uZmlndXJhYmxlIHByZWRpY2F0ZXMuIFRoZSBjb21tdW5pY2F0aW9uIHRvXG4gKiAgIHRoZSBiYWNrZW5kIGlzIHBlcmZvcm1lZCB2aWEgYSBnaXZlbiBBUEkgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSByYXRlTGltaXRlciAtIEFuIG9iamVjdCB3aGljaCBjb25mb3JtcyB0byB0aGUgaW50ZXJmYWNlXG4gKiAgICByYXRlTGltaXRlci5zaG91bGRTZW5kKGl0ZW0pIC0+IGJvb2xcbiAqIEBwYXJhbSBhcGkgLSBBbiBvYmplY3Qgd2hpY2ggY29uZm9ybXMgdG8gdGhlIGludGVyZmFjZVxuICogICAgYXBpLnBvc3RJdGVtKHBheWxvYWQsIGZ1bmN0aW9uKGVyciwgcmVzcG9uc2UpKVxuICogQHBhcmFtIGxvZ2dlciAtIEFuIG9iamVjdCB1c2VkIHRvIGxvZyB2ZXJib3NlIG1lc3NhZ2VzIGlmIGRlc2lyZWRcbiAqIEBwYXJhbSBvcHRpb25zIC0gc2VlIFF1ZXVlLnByb3RvdHlwZS5jb25maWd1cmVcbiAqIEBwYXJhbSByZXBsYXlNYXAgLSBPcHRpb25hbCBSZXBsYXlNYXAgZm9yIGNvb3JkaW5hdGluZyBzZXNzaW9uIHJlcGxheSB3aXRoIGVycm9yIG9jY3VycmVuY2VzXG4gKi9cbmZ1bmN0aW9uIFF1ZXVlKHJhdGVMaW1pdGVyLCBhcGksIGxvZ2dlciwgb3B0aW9ucywgcmVwbGF5TWFwKSB7XG4gIHRoaXMucmF0ZUxpbWl0ZXIgPSByYXRlTGltaXRlcjtcbiAgdGhpcy5hcGkgPSBhcGk7XG4gIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICB0aGlzLnJlcGxheU1hcCA9IHJlcGxheU1hcDtcbiAgdGhpcy5wcmVkaWNhdGVzID0gW107XG4gIHRoaXMucGVuZGluZ0l0ZW1zID0gW107XG4gIHRoaXMucGVuZGluZ1JlcXVlc3RzID0gW107XG4gIHRoaXMucmV0cnlRdWV1ZSA9IFtdO1xuICB0aGlzLnJldHJ5SGFuZGxlID0gbnVsbDtcbiAgdGhpcy53YWl0Q2FsbGJhY2sgPSBudWxsO1xuICB0aGlzLndhaXRJbnRlcnZhbElEID0gbnVsbDtcbn1cblxuLypcbiAqIGNvbmZpZ3VyZSAtIHVwZGF0ZXMgdGhlIG9wdGlvbnMgdGhpcyBxdWV1ZSB1c2VzXG4gKlxuICogQHBhcmFtIG9wdGlvbnNcbiAqL1xuUXVldWUucHJvdG90eXBlLmNvbmZpZ3VyZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHRoaXMuYXBpICYmIHRoaXMuYXBpLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgdmFyIG9sZE9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gIHRoaXMub3B0aW9ucyA9IF8ubWVyZ2Uob2xkT3B0aW9ucywgb3B0aW9ucyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLypcbiAqIGFkZFByZWRpY2F0ZSAtIGFkZHMgYSBwcmVkaWNhdGUgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdCBvZiBwcmVkaWNhdGVzIGZvciB0aGlzIHF1ZXVlXG4gKlxuICogQHBhcmFtIHByZWRpY2F0ZSAtIGZ1bmN0aW9uKGl0ZW0sIG9wdGlvbnMpIC0+IChib29sfHtlcnI6IEVycm9yfSlcbiAqICBSZXR1cm5pbmcgdHJ1ZSBtZWFucyB0aGF0IHRoaXMgcHJlZGljYXRlIHBhc3NlcyBhbmQgdGhlIGl0ZW0gaXMgb2theSB0byBnbyBvbiB0aGUgcXVldWVcbiAqICBSZXR1cm5pbmcgZmFsc2UgbWVhbnMgZG8gbm90IGFkZCB0aGUgaXRlbSB0byB0aGUgcXVldWUsIGJ1dCBpdCBpcyBub3QgYW4gZXJyb3JcbiAqICBSZXR1cm5pbmcge2VycjogRXJyb3J9IG1lYW5zIGRvIG5vdCBhZGQgdGhlIGl0ZW0gdG8gdGhlIHF1ZXVlLCBhbmQgdGhlIGdpdmVuIGVycm9yIGV4cGxhaW5zIHdoeVxuICogIFJldHVybmluZyB7ZXJyOiB1bmRlZmluZWR9IGlzIGVxdWl2YWxlbnQgdG8gcmV0dXJuaW5nIHRydWUgYnV0IGRvbid0IGRvIHRoYXRcbiAqL1xuUXVldWUucHJvdG90eXBlLmFkZFByZWRpY2F0ZSA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcbiAgaWYgKF8uaXNGdW5jdGlvbihwcmVkaWNhdGUpKSB7XG4gICAgdGhpcy5wcmVkaWNhdGVzLnB1c2gocHJlZGljYXRlKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cblF1ZXVlLnByb3RvdHlwZS5hZGRQZW5kaW5nSXRlbSA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHRoaXMucGVuZGluZ0l0ZW1zLnB1c2goaXRlbSk7XG59O1xuXG5RdWV1ZS5wcm90b3R5cGUucmVtb3ZlUGVuZGluZ0l0ZW0gPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgaWR4ID0gdGhpcy5wZW5kaW5nSXRlbXMuaW5kZXhPZihpdGVtKTtcbiAgaWYgKGlkeCAhPT0gLTEpIHtcbiAgICB0aGlzLnBlbmRpbmdJdGVtcy5zcGxpY2UoaWR4LCAxKTtcbiAgfVxufTtcblxuLypcbiAqIGFkZEl0ZW0gLSBTZW5kIGFuIGl0ZW0gdG8gdGhlIFJvbGxiYXIgQVBJIGlmIGFsbCBvZiB0aGUgcHJlZGljYXRlcyBhcmUgc2F0aXNmaWVkXG4gKlxuICogQHBhcmFtIGl0ZW0gLSBUaGUgcGF5bG9hZCB0byBzZW5kIHRvIHRoZSBiYWNrZW5kXG4gKiBAcGFyYW0gY2FsbGJhY2sgLSBmdW5jdGlvbihlcnJvciwgcmVwc29uc2UpIHdoaWNoIHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIHJlc3BvbnNlIGZyb20gdGhlIEFQSVxuICogIGluIHRoZSBjYXNlIG9mIGEgc3VjY2Vzcywgb3RoZXJ3aXNlIHJlc3BvbnNlIHdpbGwgYmUgbnVsbCBhbmQgZXJyb3Igd2lsbCBoYXZlIGEgdmFsdWUuIElmIGJvdGhcbiAqICBlcnJvciBhbmQgcmVzcG9uc2UgYXJlIG51bGwgdGhlbiB0aGUgaXRlbSB3YXMgc3RvcHBlZCBieSBhIHByZWRpY2F0ZSB3aGljaCBkaWQgbm90IGNvbnNpZGVyIHRoaXNcbiAqICB0byBiZSBhbiBlcnJvciBjb25kaXRpb24sIGJ1dCBub25ldGhlbGVzcyBkaWQgbm90IHNlbmQgdGhlIGl0ZW0gdG8gdGhlIEFQSS5cbiAqICBAcGFyYW0gb3JpZ2luYWxFcnJvciAtIFRoZSBvcmlnaW5hbCBlcnJvciBiZWZvcmUgYW55IHRyYW5zZm9ybWF0aW9ucyB0aGF0IGlzIHRvIGJlIGxvZ2dlZCBpZiBhbnlcbiAqL1xuUXVldWUucHJvdG90eXBlLmFkZEl0ZW0gPSBmdW5jdGlvbiAoXG4gIGl0ZW0sXG4gIGNhbGxiYWNrLFxuICBvcmlnaW5hbEVycm9yLFxuICBvcmlnaW5hbEl0ZW0sXG4pIHtcbiAgaWYgKCFjYWxsYmFjayB8fCAhXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuO1xuICAgIH07XG4gIH1cbiAgdmFyIHByZWRpY2F0ZVJlc3VsdCA9IHRoaXMuX2FwcGx5UHJlZGljYXRlcyhpdGVtKTtcbiAgaWYgKHByZWRpY2F0ZVJlc3VsdC5zdG9wKSB7XG4gICAgdGhpcy5yZW1vdmVQZW5kaW5nSXRlbShvcmlnaW5hbEl0ZW0pO1xuICAgIGNhbGxiYWNrKHByZWRpY2F0ZVJlc3VsdC5lcnIpO1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLl9tYXliZUxvZyhpdGVtLCBvcmlnaW5hbEVycm9yKTtcbiAgdGhpcy5yZW1vdmVQZW5kaW5nSXRlbShvcmlnaW5hbEl0ZW0pO1xuICBpZiAoIXRoaXMub3B0aW9ucy50cmFuc21pdCkge1xuICAgIGNhbGxiYWNrKG5ldyBFcnJvcignVHJhbnNtaXQgZGlzYWJsZWQnKSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHRoaXMucmVwbGF5TWFwICYmIGl0ZW0uYm9keSkge1xuICAgIGNvbnN0IHJlcGxheUlkID0gdGhpcy5yZXBsYXlNYXAuYWRkKGl0ZW0udXVpZCk7XG4gICAgaXRlbS5yZXBsYXlJZCA9IHJlcGxheUlkO1xuICB9XG5cbiAgdGhpcy5wZW5kaW5nUmVxdWVzdHMucHVzaChpdGVtKTtcbiAgdHJ5IHtcbiAgICB0aGlzLl9tYWtlQXBpUmVxdWVzdChcbiAgICAgIGl0ZW0sXG4gICAgICBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICAgIHRoaXMuX2RlcXVldWVQZW5kaW5nUmVxdWVzdChpdGVtKTtcblxuICAgICAgICBpZiAoIWVyciAmJiByZXNwICYmIGl0ZW0ucmVwbGF5SWQpIHtcbiAgICAgICAgICB0aGlzLl9oYW5kbGVSZXBsYXlSZXNwb25zZShpdGVtLnJlcGxheUlkLCByZXNwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmVzcCk7XG4gICAgICB9LmJpbmQodGhpcyksXG4gICAgKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRoaXMuX2RlcXVldWVQZW5kaW5nUmVxdWVzdChpdGVtKTtcbiAgICBjYWxsYmFjayhlKTtcbiAgfVxufTtcblxuLypcbiAqIHdhaXQgLSBTdG9wIGFueSBmdXJ0aGVyIGVycm9ycyBmcm9tIGJlaW5nIGFkZGVkIHRvIHRoZSBxdWV1ZSwgYW5kIGdldCBjYWxsZWQgYmFjayB3aGVuIGFsbCBpdGVtc1xuICogICBjdXJyZW50bHkgcHJvY2Vzc2luZyBoYXZlIGZpbmlzaGVkIHNlbmRpbmcgdG8gdGhlIGJhY2tlbmQuXG4gKlxuICogQHBhcmFtIGNhbGxiYWNrIC0gZnVuY3Rpb24oKSBjYWxsZWQgd2hlbiBhbGwgcGVuZGluZyBpdGVtcyBoYXZlIGJlZW4gc2VudFxuICovXG5RdWV1ZS5wcm90b3R5cGUud2FpdCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBpZiAoIV8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy53YWl0Q2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgaWYgKHRoaXMuX21heWJlQ2FsbFdhaXQoKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAodGhpcy53YWl0SW50ZXJ2YWxJRCkge1xuICAgIHRoaXMud2FpdEludGVydmFsSUQgPSBjbGVhckludGVydmFsKHRoaXMud2FpdEludGVydmFsSUQpO1xuICB9XG4gIHRoaXMud2FpdEludGVydmFsSUQgPSBzZXRJbnRlcnZhbChcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl9tYXliZUNhbGxXYWl0KCk7XG4gICAgfS5iaW5kKHRoaXMpLFxuICAgIDUwMCxcbiAgKTtcbn07XG5cbi8qIF9hcHBseVByZWRpY2F0ZXMgLSBTZXF1ZW50aWFsbHkgYXBwbGllcyB0aGUgcHJlZGljYXRlcyB0aGF0IGhhdmUgYmVlbiBhZGRlZCB0byB0aGUgcXVldWUgdG8gdGhlXG4gKiAgIGdpdmVuIGl0ZW0gd2l0aCB0aGUgY3VycmVudGx5IGNvbmZpZ3VyZWQgb3B0aW9ucy5cbiAqXG4gKiBAcGFyYW0gaXRlbSAtIEFuIGl0ZW0gaW4gdGhlIHF1ZXVlXG4gKiBAcmV0dXJucyB7c3RvcDogYm9vbCwgZXJyOiAoRXJyb3J8bnVsbCl9IC0gc3RvcCBiZWluZyB0cnVlIG1lYW5zIGRvIG5vdCBhZGQgaXRlbSB0byB0aGUgcXVldWUsXG4gKiAgIHRoZSBlcnJvciB2YWx1ZSBzaG91bGQgYmUgcGFzc2VkIHVwIHRvIGEgY2FsbGJhayBpZiB3ZSBhcmUgc3RvcHBpbmcuXG4gKi9cblF1ZXVlLnByb3RvdHlwZS5fYXBwbHlQcmVkaWNhdGVzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIHAgPSBudWxsO1xuICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy5wcmVkaWNhdGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgcCA9IHRoaXMucHJlZGljYXRlc1tpXShpdGVtLCB0aGlzLm9wdGlvbnMpO1xuICAgIGlmICghcCB8fCBwLmVyciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4geyBzdG9wOiB0cnVlLCBlcnI6IHAuZXJyIH07XG4gICAgfVxuICB9XG4gIHJldHVybiB7IHN0b3A6IGZhbHNlLCBlcnI6IG51bGwgfTtcbn07XG5cbi8qXG4gKiBfbWFrZUFwaVJlcXVlc3QgLSBTZW5kIGFuIGl0ZW0gdG8gUm9sbGJhciwgY2FsbGJhY2sgd2hlbiBkb25lLCBpZiB0aGVyZSBpcyBhbiBlcnJvciBtYWtlIGFuXG4gKiAgIGVmZm9ydCB0byByZXRyeSBpZiB3ZSBhcmUgY29uZmlndXJlZCB0byBkbyBzby5cbiAqXG4gKiBAcGFyYW0gaXRlbSAtIGFuIGl0ZW0gcmVhZHkgdG8gc2VuZCB0byB0aGUgYmFja2VuZFxuICogQHBhcmFtIGNhbGxiYWNrIC0gZnVuY3Rpb24oZXJyLCByZXNwb25zZSlcbiAqL1xuUXVldWUucHJvdG90eXBlLl9tYWtlQXBpUmVxdWVzdCA9IGZ1bmN0aW9uIChpdGVtLCBjYWxsYmFjaykge1xuICB2YXIgcmF0ZUxpbWl0UmVzcG9uc2UgPSB0aGlzLnJhdGVMaW1pdGVyLnNob3VsZFNlbmQoaXRlbSk7XG4gIGlmIChyYXRlTGltaXRSZXNwb25zZS5zaG91bGRTZW5kKSB7XG4gICAgdGhpcy5hcGkucG9zdEl0ZW0oXG4gICAgICBpdGVtLFxuICAgICAgZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgdGhpcy5fbWF5YmVSZXRyeShlcnIsIGl0ZW0sIGNhbGxiYWNrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayhlcnIsIHJlc3ApO1xuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcyksXG4gICAgKTtcbiAgfSBlbHNlIGlmIChyYXRlTGltaXRSZXNwb25zZS5lcnJvcikge1xuICAgIGNhbGxiYWNrKHJhdGVMaW1pdFJlc3BvbnNlLmVycm9yKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmFwaS5wb3N0SXRlbShyYXRlTGltaXRSZXNwb25zZS5wYXlsb2FkLCBjYWxsYmFjayk7XG4gIH1cbn07XG5cbi8vIFRoZXNlIGFyZSBlcnJvcnMgYmFzaWNhbGx5IG1lYW4gdGhlcmUgaXMgbm8gaW50ZXJuZXQgY29ubmVjdGlvblxudmFyIFJFVFJJQUJMRV9FUlJPUlMgPSBbXG4gICdFQ09OTlJFU0VUJyxcbiAgJ0VOT1RGT1VORCcsXG4gICdFU09DS0VUVElNRURPVVQnLFxuICAnRVRJTUVET1VUJyxcbiAgJ0VDT05OUkVGVVNFRCcsXG4gICdFSE9TVFVOUkVBQ0gnLFxuICAnRVBJUEUnLFxuICAnRUFJX0FHQUlOJyxcbl07XG5cbi8qXG4gKiBfbWF5YmVSZXRyeSAtIEdpdmVuIHRoZSBlcnJvciByZXR1cm5lZCBieSB0aGUgQVBJLCBkZWNpZGUgaWYgd2Ugc2hvdWxkIHJldHJ5IG9yIGp1c3QgY2FsbGJhY2tcbiAqICAgd2l0aCB0aGUgZXJyb3IuXG4gKlxuICogQHBhcmFtIGVyciAtIGFuIGVycm9yIHJldHVybmVkIGJ5IHRoZSBBUEkgdHJhbnNwb3J0XG4gKiBAcGFyYW0gaXRlbSAtIHRoZSBpdGVtIHRoYXQgd2FzIHRyeWluZyB0byBiZSBzZW50IHdoZW4gdGhpcyBlcnJvciBvY2N1cmVkXG4gKiBAcGFyYW0gY2FsbGJhY2sgLSBmdW5jdGlvbihlcnIsIHJlc3BvbnNlKVxuICovXG5RdWV1ZS5wcm90b3R5cGUuX21heWJlUmV0cnkgPSBmdW5jdGlvbiAoZXJyLCBpdGVtLCBjYWxsYmFjaykge1xuICB2YXIgc2hvdWxkUmV0cnkgPSBmYWxzZTtcbiAgaWYgKHRoaXMub3B0aW9ucy5yZXRyeUludGVydmFsKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IFJFVFJJQUJMRV9FUlJPUlMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmIChlcnIuY29kZSA9PT0gUkVUUklBQkxFX0VSUk9SU1tpXSkge1xuICAgICAgICBzaG91bGRSZXRyeSA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc2hvdWxkUmV0cnkgJiYgXy5pc0Zpbml0ZU51bWJlcih0aGlzLm9wdGlvbnMubWF4UmV0cmllcykpIHtcbiAgICAgIGl0ZW0ucmV0cmllcyA9IGl0ZW0ucmV0cmllcyA/IGl0ZW0ucmV0cmllcyArIDEgOiAxO1xuICAgICAgaWYgKGl0ZW0ucmV0cmllcyA+IHRoaXMub3B0aW9ucy5tYXhSZXRyaWVzKSB7XG4gICAgICAgIHNob3VsZFJldHJ5ID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChzaG91bGRSZXRyeSkge1xuICAgIHRoaXMuX3JldHJ5QXBpUmVxdWVzdChpdGVtLCBjYWxsYmFjayk7XG4gIH0gZWxzZSB7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfVxufTtcblxuLypcbiAqIF9yZXRyeUFwaVJlcXVlc3QgLSBBZGQgYW4gaXRlbSBhbmQgYSBjYWxsYmFjayB0byBhIHF1ZXVlIGFuZCBwb3NzaWJseSBzdGFydCBhIHRpbWVyIHRvIHByb2Nlc3NcbiAqICAgdGhhdCBxdWV1ZSBiYXNlZCBvbiB0aGUgcmV0cnlJbnRlcnZhbCBpbiB0aGUgb3B0aW9ucyBmb3IgdGhpcyBxdWV1ZS5cbiAqXG4gKiBAcGFyYW0gaXRlbSAtIGFuIGl0ZW0gdGhhdCBmYWlsZWQgdG8gc2VuZCBkdWUgdG8gYW4gZXJyb3Igd2UgZGVlbSByZXRyaWFibGVcbiAqIEBwYXJhbSBjYWxsYmFjayAtIGZ1bmN0aW9uKGVyciwgcmVzcG9uc2UpXG4gKi9cblF1ZXVlLnByb3RvdHlwZS5fcmV0cnlBcGlSZXF1ZXN0ID0gZnVuY3Rpb24gKGl0ZW0sIGNhbGxiYWNrKSB7XG4gIHRoaXMucmV0cnlRdWV1ZS5wdXNoKHsgaXRlbTogaXRlbSwgY2FsbGJhY2s6IGNhbGxiYWNrIH0pO1xuXG4gIGlmICghdGhpcy5yZXRyeUhhbmRsZSkge1xuICAgIHRoaXMucmV0cnlIYW5kbGUgPSBzZXRJbnRlcnZhbChcbiAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMucmV0cnlRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgICB2YXIgcmV0cnlPYmplY3QgPSB0aGlzLnJldHJ5UXVldWUuc2hpZnQoKTtcbiAgICAgICAgICB0aGlzLl9tYWtlQXBpUmVxdWVzdChyZXRyeU9iamVjdC5pdGVtLCByZXRyeU9iamVjdC5jYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgIHRoaXMub3B0aW9ucy5yZXRyeUludGVydmFsLFxuICAgICk7XG4gIH1cbn07XG5cbi8qXG4gKiBfZGVxdWV1ZVBlbmRpbmdSZXF1ZXN0IC0gUmVtb3ZlcyB0aGUgaXRlbSBmcm9tIHRoZSBwZW5kaW5nIHJlcXVlc3QgcXVldWUsIHRoaXMgcXVldWUgaXMgdXNlZCB0b1xuICogICBlbmFibGUgdG8gZnVuY3Rpb25hbGl0eSBvZiBwcm92aWRpbmcgYSBjYWxsYmFjayB0aGF0IGNsaWVudHMgY2FuIHBhc3MgdG8gYHdhaXRgIHRvIGJlIG5vdGlmaWVkXG4gKiAgIHdoZW4gdGhlIHBlbmRpbmcgcmVxdWVzdCBxdWV1ZSBoYXMgYmVlbiBlbXB0aWVkLiBUaGlzIG11c3QgYmUgY2FsbGVkIHdoZW4gdGhlIEFQSSBmaW5pc2hlc1xuICogICBwcm9jZXNzaW5nIHRoaXMgaXRlbS4gSWYgYSBgd2FpdGAgY2FsbGJhY2sgaXMgY29uZmlndXJlZCwgaXQgaXMgY2FsbGVkIGJ5IHRoaXMgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIGl0ZW0gLSB0aGUgaXRlbSBwcmV2aW91c2x5IGFkZGVkIHRvIHRoZSBwZW5kaW5nIHJlcXVlc3QgcXVldWVcbiAqL1xuUXVldWUucHJvdG90eXBlLl9kZXF1ZXVlUGVuZGluZ1JlcXVlc3QgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgaWR4ID0gdGhpcy5wZW5kaW5nUmVxdWVzdHMuaW5kZXhPZihpdGVtKTtcbiAgaWYgKGlkeCAhPT0gLTEpIHtcbiAgICB0aGlzLnBlbmRpbmdSZXF1ZXN0cy5zcGxpY2UoaWR4LCAxKTtcbiAgICB0aGlzLl9tYXliZUNhbGxXYWl0KCk7XG4gIH1cbn07XG5cblF1ZXVlLnByb3RvdHlwZS5fbWF5YmVMb2cgPSBmdW5jdGlvbiAoZGF0YSwgb3JpZ2luYWxFcnJvcikge1xuICBpZiAodGhpcy5sb2dnZXIgJiYgdGhpcy5vcHRpb25zLnZlcmJvc2UpIHtcbiAgICB2YXIgbWVzc2FnZSA9IG9yaWdpbmFsRXJyb3I7XG4gICAgbWVzc2FnZSA9IG1lc3NhZ2UgfHwgXy5nZXQoZGF0YSwgJ2JvZHkudHJhY2UuZXhjZXB0aW9uLm1lc3NhZ2UnKTtcbiAgICBtZXNzYWdlID0gbWVzc2FnZSB8fCBfLmdldChkYXRhLCAnYm9keS50cmFjZV9jaGFpbi4wLmV4Y2VwdGlvbi5tZXNzYWdlJyk7XG4gICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgIHRoaXMubG9nZ2VyLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBtZXNzYWdlID0gXy5nZXQoZGF0YSwgJ2JvZHkubWVzc2FnZS5ib2R5Jyk7XG4gICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgIHRoaXMubG9nZ2VyLmxvZyhtZXNzYWdlKTtcbiAgICB9XG4gIH1cbn07XG5cblF1ZXVlLnByb3RvdHlwZS5fbWF5YmVDYWxsV2FpdCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKFxuICAgIF8uaXNGdW5jdGlvbih0aGlzLndhaXRDYWxsYmFjaykgJiZcbiAgICB0aGlzLnBlbmRpbmdJdGVtcy5sZW5ndGggPT09IDAgJiZcbiAgICB0aGlzLnBlbmRpbmdSZXF1ZXN0cy5sZW5ndGggPT09IDBcbiAgKSB7XG4gICAgaWYgKHRoaXMud2FpdEludGVydmFsSUQpIHtcbiAgICAgIHRoaXMud2FpdEludGVydmFsSUQgPSBjbGVhckludGVydmFsKHRoaXMud2FpdEludGVydmFsSUQpO1xuICAgIH1cbiAgICB0aGlzLndhaXRDYWxsYmFjaygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICogSGFuZGxlcyB0aGUgQVBJIHJlc3BvbnNlIGZvciBhbiBpdGVtIHdpdGggYSByZXBsYXkgSUQuXG4gKiBCYXNlZCBvbiB0aGUgc3VjY2VzcyBvciBmYWlsdXJlIHN0YXR1cyBvZiB0aGUgcmVzcG9uc2UsXG4gKiBpdCBlaXRoZXIgc2VuZHMgb3IgZGlzY2FyZHMgdGhlIGFzc29jaWF0ZWQgc2Vzc2lvbiByZXBsYXkuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHJlcGxheUlkIC0gVGhlIElEIG9mIHRoZSByZXBsYXkgdG8gaGFuZGxlXG4gKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2UgLSBUaGUgQVBJIHJlc3BvbnNlXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxib29sZWFuPn0gQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdHJ1ZSBpZiByZXBsYXkgd2FzIHNlbnQgc3VjY2Vzc2Z1bGx5LFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlIGlmIHJlcGxheSB3YXMgZGlzY2FyZGVkIG9yIGFuIGVycm9yIG9jY3VycmVkXG4gKiBAcHJpdmF0ZVxuICovXG5RdWV1ZS5wcm90b3R5cGUuX2hhbmRsZVJlcGxheVJlc3BvbnNlID0gYXN5bmMgZnVuY3Rpb24gKHJlcGxheUlkLCByZXNwb25zZSkge1xuICBpZiAoIXRoaXMucmVwbGF5TWFwKSB7XG4gICAgY29uc29sZS53YXJuKCdRdWV1ZS5faGFuZGxlUmVwbGF5UmVzcG9uc2U6IFJlcGxheU1hcCBub3QgYXZhaWxhYmxlJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFyZXBsYXlJZCkge1xuICAgIGNvbnNvbGUud2FybignUXVldWUuX2hhbmRsZVJlcGxheVJlc3BvbnNlOiBObyByZXBsYXlJZCBwcm92aWRlZCcpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgLy8gU3VjY2VzcyBjb25kaXRpb24gbWlnaHQgbmVlZCBhZGp1c3RtZW50IGJhc2VkIG9uIEFQSSByZXNwb25zZSBzdHJ1Y3R1cmVcbiAgICBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2UuZXJyID09PSAwKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLnJlcGxheU1hcC5zZW5kKHJlcGxheUlkKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVwbGF5TWFwLmRpc2NhcmQocmVwbGF5SWQpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBoYW5kbGluZyByZXBsYXkgcmVzcG9uc2U6JywgZXJyb3IpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBRdWV1ZTtcbiIsInZhciBtZXJnZSA9IHJlcXVpcmUoJy4vbWVyZ2UnKTtcblxudmFyIFJvbGxiYXJKU09OID0ge307XG5mdW5jdGlvbiBzZXR1cEpTT04ocG9seWZpbGxKU09OKSB7XG4gIGlmIChpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnN0cmluZ2lmeSkgJiYgaXNGdW5jdGlvbihSb2xsYmFySlNPTi5wYXJzZSkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoaXNEZWZpbmVkKEpTT04pKSB7XG4gICAgLy8gSWYgcG9seWZpbGwgaXMgcHJvdmlkZWQsIHByZWZlciBpdCBvdmVyIGV4aXN0aW5nIG5vbi1uYXRpdmUgc2hpbXMuXG4gICAgaWYgKHBvbHlmaWxsSlNPTikge1xuICAgICAgaWYgKGlzTmF0aXZlRnVuY3Rpb24oSlNPTi5zdHJpbmdpZnkpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnN0cmluZ2lmeSA9IEpTT04uc3RyaW5naWZ5O1xuICAgICAgfVxuICAgICAgaWYgKGlzTmF0aXZlRnVuY3Rpb24oSlNPTi5wYXJzZSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04ucGFyc2UgPSBKU09OLnBhcnNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBlbHNlIGFjY2VwdCBhbnkgaW50ZXJmYWNlIHRoYXQgaXMgcHJlc2VudC5cbiAgICAgIGlmIChpc0Z1bmN0aW9uKEpTT04uc3RyaW5naWZ5KSkge1xuICAgICAgICBSb2xsYmFySlNPTi5zdHJpbmdpZnkgPSBKU09OLnN0cmluZ2lmeTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0Z1bmN0aW9uKEpTT04ucGFyc2UpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnBhcnNlID0gSlNPTi5wYXJzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKCFpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnN0cmluZ2lmeSkgfHwgIWlzRnVuY3Rpb24oUm9sbGJhckpTT04ucGFyc2UpKSB7XG4gICAgcG9seWZpbGxKU09OICYmIHBvbHlmaWxsSlNPTihSb2xsYmFySlNPTik7XG4gIH1cbn1cblxuLypcbiAqIGlzVHlwZSAtIEdpdmVuIGEgSmF2YXNjcmlwdCB2YWx1ZSBhbmQgYSBzdHJpbmcsIHJldHVybnMgdHJ1ZSBpZiB0aGUgdHlwZSBvZiB0aGUgdmFsdWUgbWF0Y2hlcyB0aGVcbiAqIGdpdmVuIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0geCAtIGFueSB2YWx1ZVxuICogQHBhcmFtIHQgLSBhIGxvd2VyY2FzZSBzdHJpbmcgY29udGFpbmluZyBvbmUgb2YgdGhlIGZvbGxvd2luZyB0eXBlIG5hbWVzOlxuICogICAgLSB1bmRlZmluZWRcbiAqICAgIC0gbnVsbFxuICogICAgLSBlcnJvclxuICogICAgLSBudW1iZXJcbiAqICAgIC0gYm9vbGVhblxuICogICAgLSBzdHJpbmdcbiAqICAgIC0gc3ltYm9sXG4gKiAgICAtIGZ1bmN0aW9uXG4gKiAgICAtIG9iamVjdFxuICogICAgLSBhcnJheVxuICogQHJldHVybnMgdHJ1ZSBpZiB4IGlzIG9mIHR5cGUgdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVHlwZSh4LCB0KSB7XG4gIHJldHVybiB0ID09PSB0eXBlTmFtZSh4KTtcbn1cblxuLypcbiAqIHR5cGVOYW1lIC0gR2l2ZW4gYSBKYXZhc2NyaXB0IHZhbHVlLCByZXR1cm5zIHRoZSB0eXBlIG9mIHRoZSBvYmplY3QgYXMgYSBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gdHlwZU5hbWUoeCkge1xuICB2YXIgbmFtZSA9IHR5cGVvZiB4O1xuICBpZiAobmFtZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbmFtZTtcbiAgfVxuICBpZiAoIXgpIHtcbiAgICByZXR1cm4gJ251bGwnO1xuICB9XG4gIGlmICh4IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICByZXR1cm4gJ2Vycm9yJztcbiAgfVxuICByZXR1cm4ge30udG9TdHJpbmdcbiAgICAuY2FsbCh4KVxuICAgIC5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXVxuICAgIC50b0xvd2VyQ2FzZSgpO1xufVxuXG4vKiBpc0Z1bmN0aW9uIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBhIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIGYgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIGZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbihmKSB7XG4gIHJldHVybiBpc1R5cGUoZiwgJ2Z1bmN0aW9uJyk7XG59XG5cbi8qIGlzTmF0aXZlRnVuY3Rpb24gLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIGEgbmF0aXZlIEpTIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIGYgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIG5hdGl2ZSBKUyBmdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlRnVuY3Rpb24oZikge1xuICB2YXIgcmVSZWdFeHBDaGFyID0gL1tcXFxcXiQuKis/KClbXFxde318XS9nO1xuICB2YXIgZnVuY01hdGNoU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nXG4gICAgLmNhbGwoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSlcbiAgICAucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAgIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKTtcbiAgdmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICsgZnVuY01hdGNoU3RyaW5nICsgJyQnKTtcbiAgcmV0dXJuIGlzT2JqZWN0KGYpICYmIHJlSXNOYXRpdmUudGVzdChmKTtcbn1cblxuLyogaXNPYmplY3QgLSBDaGVja3MgaWYgdGhlIGFyZ3VtZW50IGlzIGFuIG9iamVjdFxuICpcbiAqIEBwYXJhbSB2YWx1ZSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpcyB2YWx1ZSBpcyBhbiBvYmplY3QgZnVuY3Rpb24gaXMgYW4gb2JqZWN0KVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyogaXNTdHJpbmcgLSBDaGVja3MgaWYgdGhlIGFyZ3VtZW50IGlzIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHZhbHVlIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIHZhbHVlIGlzIGEgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nO1xufVxuXG4vKipcbiAqIGlzRmluaXRlTnVtYmVyIC0gZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgYSBmaW5pdGUgbnVtYmVyXG4gKlxuICogQHBhcmFtIHsqfSBuIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIHZhbHVlIGlzIGEgZmluaXRlIG51bWJlclxuICovXG5mdW5jdGlvbiBpc0Zpbml0ZU51bWJlcihuKSB7XG4gIHJldHVybiBOdW1iZXIuaXNGaW5pdGUobik7XG59XG5cbi8qXG4gKiBpc0RlZmluZWQgLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIG5vdCBlcXVhbCB0byB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0gdSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiB1IGlzIGFueXRoaW5nIG90aGVyIHRoYW4gdW5kZWZpbmVkXG4gKi9cbmZ1bmN0aW9uIGlzRGVmaW5lZCh1KSB7XG4gIHJldHVybiAhaXNUeXBlKHUsICd1bmRlZmluZWQnKTtcbn1cblxuLypcbiAqIGlzSXRlcmFibGUgLSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBjYW4gYmUgaXRlcmF0ZWQsIGVzc2VudGlhbGx5XG4gKiB3aGV0aGVyIGl0IGlzIGFuIG9iamVjdCBvciBhbiBhcnJheS5cbiAqXG4gKiBAcGFyYW0gaSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBpIGlzIGFuIG9iamVjdCBvciBhbiBhcnJheSBhcyBkZXRlcm1pbmVkIGJ5IGB0eXBlTmFtZWBcbiAqL1xuZnVuY3Rpb24gaXNJdGVyYWJsZShpKSB7XG4gIHZhciB0eXBlID0gdHlwZU5hbWUoaSk7XG4gIHJldHVybiB0eXBlID09PSAnb2JqZWN0JyB8fCB0eXBlID09PSAnYXJyYXknO1xufVxuXG4vKlxuICogaXNFcnJvciAtIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIG9mIGFuIGVycm9yIHR5cGVcbiAqXG4gKiBAcGFyYW0gZSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBlIGlzIGFuIGVycm9yXG4gKi9cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICAvLyBEZXRlY3QgYm90aCBFcnJvciBhbmQgRmlyZWZveCBFeGNlcHRpb24gdHlwZVxuICByZXR1cm4gaXNUeXBlKGUsICdlcnJvcicpIHx8IGlzVHlwZShlLCAnZXhjZXB0aW9uJyk7XG59XG5cbi8qIGlzUHJvbWlzZSAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgYSBwcm9taXNlXG4gKlxuICogQHBhcmFtIHAgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIGZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNQcm9taXNlKHApIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHApICYmIGlzVHlwZShwLnRoZW4sICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIGlzQnJvd3NlciAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIHRoZSBjb2RlIGlzIHJ1bm5pbmcgaW4gYSBicm93c2VyXG4gKlxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY29kZSBpcyBydW5uaW5nIGluIGEgYnJvd3NlciBlbnZpcm9ubWVudFxuICovXG5mdW5jdGlvbiBpc0Jyb3dzZXIoKSB7XG4gIHJldHVybiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcbn1cblxuZnVuY3Rpb24gcmVkYWN0KCkge1xuICByZXR1cm4gJyoqKioqKioqJztcbn1cblxuLy8gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS84ODA5NDcyLzExMzgxOTFcbmZ1bmN0aW9uIHV1aWQ0KCkge1xuICB2YXIgZCA9IG5vdygpO1xuICB2YXIgdXVpZCA9ICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoXG4gICAgL1t4eV0vZyxcbiAgICBmdW5jdGlvbiAoYykge1xuICAgICAgdmFyIHIgPSAoZCArIE1hdGgucmFuZG9tKCkgKiAxNikgJSAxNiB8IDA7XG4gICAgICBkID0gTWF0aC5mbG9vcihkIC8gMTYpO1xuICAgICAgcmV0dXJuIChjID09PSAneCcgPyByIDogKHIgJiAweDcpIHwgMHg4KS50b1N0cmluZygxNik7XG4gICAgfSxcbiAgKTtcbiAgcmV0dXJuIHV1aWQ7XG59XG5cbnZhciBMRVZFTFMgPSB7XG4gIGRlYnVnOiAwLFxuICBpbmZvOiAxLFxuICB3YXJuaW5nOiAyLFxuICBlcnJvcjogMyxcbiAgY3JpdGljYWw6IDQsXG59O1xuXG5mdW5jdGlvbiBzYW5pdGl6ZVVybCh1cmwpIHtcbiAgdmFyIGJhc2VVcmxQYXJ0cyA9IHBhcnNlVXJpKHVybCk7XG4gIGlmICghYmFzZVVybFBhcnRzKSB7XG4gICAgcmV0dXJuICcodW5rbm93biknO1xuICB9XG5cbiAgLy8gcmVtb3ZlIGEgdHJhaWxpbmcgIyBpZiB0aGVyZSBpcyBubyBhbmNob3JcbiAgaWYgKGJhc2VVcmxQYXJ0cy5hbmNob3IgPT09ICcnKSB7XG4gICAgYmFzZVVybFBhcnRzLnNvdXJjZSA9IGJhc2VVcmxQYXJ0cy5zb3VyY2UucmVwbGFjZSgnIycsICcnKTtcbiAgfVxuXG4gIHVybCA9IGJhc2VVcmxQYXJ0cy5zb3VyY2UucmVwbGFjZSgnPycgKyBiYXNlVXJsUGFydHMucXVlcnksICcnKTtcbiAgcmV0dXJuIHVybDtcbn1cblxudmFyIHBhcnNlVXJpT3B0aW9ucyA9IHtcbiAgc3RyaWN0TW9kZTogZmFsc2UsXG4gIGtleTogW1xuICAgICdzb3VyY2UnLFxuICAgICdwcm90b2NvbCcsXG4gICAgJ2F1dGhvcml0eScsXG4gICAgJ3VzZXJJbmZvJyxcbiAgICAndXNlcicsXG4gICAgJ3Bhc3N3b3JkJyxcbiAgICAnaG9zdCcsXG4gICAgJ3BvcnQnLFxuICAgICdyZWxhdGl2ZScsXG4gICAgJ3BhdGgnLFxuICAgICdkaXJlY3RvcnknLFxuICAgICdmaWxlJyxcbiAgICAncXVlcnknLFxuICAgICdhbmNob3InLFxuICBdLFxuICBxOiB7XG4gICAgbmFtZTogJ3F1ZXJ5S2V5JyxcbiAgICBwYXJzZXI6IC8oPzpefCYpKFteJj1dKik9PyhbXiZdKikvZyxcbiAgfSxcbiAgcGFyc2VyOiB7XG4gICAgc3RyaWN0OlxuICAgICAgL14oPzooW146XFwvPyNdKyk6KT8oPzpcXC9cXC8oKD86KChbXjpAXSopKD86OihbXjpAXSopKT8pP0ApPyhbXjpcXC8/I10qKSg/OjooXFxkKikpPykpPygoKCg/OltePyNcXC9dKlxcLykqKShbXj8jXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pLyxcbiAgICBsb29zZTpcbiAgICAgIC9eKD86KD8hW146QF0rOlteOkBcXC9dKkApKFteOlxcLz8jLl0rKTopPyg/OlxcL1xcLyk/KCg/OigoW146QF0qKSg/OjooW146QF0qKSk/KT9AKT8oW146XFwvPyNdKikoPzo6KFxcZCopKT8pKCgoXFwvKD86W14/I10oPyFbXj8jXFwvXSpcXC5bXj8jXFwvLl0rKD86Wz8jXXwkKSkpKlxcLz8pPyhbXj8jXFwvXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pLyxcbiAgfSxcbn07XG5cbmZ1bmN0aW9uIHBhcnNlVXJpKHN0cikge1xuICBpZiAoIWlzVHlwZShzdHIsICdzdHJpbmcnKSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICB2YXIgbyA9IHBhcnNlVXJpT3B0aW9ucztcbiAgdmFyIG0gPSBvLnBhcnNlcltvLnN0cmljdE1vZGUgPyAnc3RyaWN0JyA6ICdsb29zZSddLmV4ZWMoc3RyKTtcbiAgdmFyIHVyaSA9IHt9O1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gby5rZXkubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgdXJpW28ua2V5W2ldXSA9IG1baV0gfHwgJyc7XG4gIH1cblxuICB1cmlbby5xLm5hbWVdID0ge307XG4gIHVyaVtvLmtleVsxMl1dLnJlcGxhY2Uoby5xLnBhcnNlciwgZnVuY3Rpb24gKCQwLCAkMSwgJDIpIHtcbiAgICBpZiAoJDEpIHtcbiAgICAgIHVyaVtvLnEubmFtZV1bJDFdID0gJDI7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdXJpO1xufVxuXG5mdW5jdGlvbiBhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aChhY2Nlc3NUb2tlbiwgb3B0aW9ucywgcGFyYW1zKSB7XG4gIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgcGFyYW1zLmFjY2Vzc190b2tlbiA9IGFjY2Vzc1Rva2VuO1xuICB2YXIgcGFyYW1zQXJyYXkgPSBbXTtcbiAgdmFyIGs7XG4gIGZvciAoayBpbiBwYXJhbXMpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmFtcywgaykpIHtcbiAgICAgIHBhcmFtc0FycmF5LnB1c2goW2ssIHBhcmFtc1trXV0uam9pbignPScpKTtcbiAgICB9XG4gIH1cbiAgdmFyIHF1ZXJ5ID0gJz8nICsgcGFyYW1zQXJyYXkuc29ydCgpLmpvaW4oJyYnKTtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgb3B0aW9ucy5wYXRoID0gb3B0aW9ucy5wYXRoIHx8ICcnO1xuICB2YXIgcXMgPSBvcHRpb25zLnBhdGguaW5kZXhPZignPycpO1xuICB2YXIgaCA9IG9wdGlvbnMucGF0aC5pbmRleE9mKCcjJyk7XG4gIHZhciBwO1xuICBpZiAocXMgIT09IC0xICYmIChoID09PSAtMSB8fCBoID4gcXMpKSB7XG4gICAgcCA9IG9wdGlvbnMucGF0aDtcbiAgICBvcHRpb25zLnBhdGggPSBwLnN1YnN0cmluZygwLCBxcykgKyBxdWVyeSArICcmJyArIHAuc3Vic3RyaW5nKHFzICsgMSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGggIT09IC0xKSB7XG4gICAgICBwID0gb3B0aW9ucy5wYXRoO1xuICAgICAgb3B0aW9ucy5wYXRoID0gcC5zdWJzdHJpbmcoMCwgaCkgKyBxdWVyeSArIHAuc3Vic3RyaW5nKGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zLnBhdGggPSBvcHRpb25zLnBhdGggKyBxdWVyeTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0VXJsKHUsIHByb3RvY29sKSB7XG4gIHByb3RvY29sID0gcHJvdG9jb2wgfHwgdS5wcm90b2NvbDtcbiAgaWYgKCFwcm90b2NvbCAmJiB1LnBvcnQpIHtcbiAgICBpZiAodS5wb3J0ID09PSA4MCkge1xuICAgICAgcHJvdG9jb2wgPSAnaHR0cDonO1xuICAgIH0gZWxzZSBpZiAodS5wb3J0ID09PSA0NDMpIHtcbiAgICAgIHByb3RvY29sID0gJ2h0dHBzOic7XG4gICAgfVxuICB9XG4gIHByb3RvY29sID0gcHJvdG9jb2wgfHwgJ2h0dHBzOic7XG5cbiAgaWYgKCF1Lmhvc3RuYW1lKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IHByb3RvY29sICsgJy8vJyArIHUuaG9zdG5hbWU7XG4gIGlmICh1LnBvcnQpIHtcbiAgICByZXN1bHQgPSByZXN1bHQgKyAnOicgKyB1LnBvcnQ7XG4gIH1cbiAgaWYgKHUucGF0aCkge1xuICAgIHJlc3VsdCA9IHJlc3VsdCArIHUucGF0aDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnkob2JqLCBiYWNrdXApIHtcbiAgdmFyIHZhbHVlLCBlcnJvcjtcbiAgdHJ5IHtcbiAgICB2YWx1ZSA9IFJvbGxiYXJKU09OLnN0cmluZ2lmeShvYmopO1xuICB9IGNhdGNoIChqc29uRXJyb3IpIHtcbiAgICBpZiAoYmFja3VwICYmIGlzRnVuY3Rpb24oYmFja3VwKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBiYWNrdXAob2JqKTtcbiAgICAgIH0gY2F0Y2ggKGJhY2t1cEVycm9yKSB7XG4gICAgICAgIGVycm9yID0gYmFja3VwRXJyb3I7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVycm9yID0ganNvbkVycm9yO1xuICAgIH1cbiAgfVxuICByZXR1cm4geyBlcnJvcjogZXJyb3IsIHZhbHVlOiB2YWx1ZSB9O1xufVxuXG5mdW5jdGlvbiBtYXhCeXRlU2l6ZShzdHJpbmcpIHtcbiAgLy8gVGhlIHRyYW5zcG9ydCB3aWxsIHVzZSB1dGYtOCwgc28gYXNzdW1lIHV0Zi04IGVuY29kaW5nLlxuICAvL1xuICAvLyBUaGlzIG1pbmltYWwgaW1wbGVtZW50YXRpb24gd2lsbCBhY2N1cmF0ZWx5IGNvdW50IGJ5dGVzIGZvciBhbGwgVUNTLTIgYW5kXG4gIC8vIHNpbmdsZSBjb2RlIHBvaW50IFVURi0xNi4gSWYgcHJlc2VudGVkIHdpdGggbXVsdGkgY29kZSBwb2ludCBVVEYtMTYsXG4gIC8vIHdoaWNoIHNob3VsZCBiZSByYXJlLCBpdCB3aWxsIHNhZmVseSBvdmVyY291bnQsIG5vdCB1bmRlcmNvdW50LlxuICAvL1xuICAvLyBXaGlsZSByb2J1c3QgdXRmLTggZW5jb2RlcnMgZXhpc3QsIHRoaXMgaXMgZmFyIHNtYWxsZXIgYW5kIGZhciBtb3JlIHBlcmZvcm1hbnQuXG4gIC8vIEZvciBxdWlja2x5IGNvdW50aW5nIHBheWxvYWQgc2l6ZSBmb3IgdHJ1bmNhdGlvbiwgc21hbGxlciBpcyBiZXR0ZXIuXG5cbiAgdmFyIGNvdW50ID0gMDtcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBjb2RlID0gc3RyaW5nLmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGNvZGUgPCAxMjgpIHtcbiAgICAgIC8vIHVwIHRvIDcgYml0c1xuICAgICAgY291bnQgPSBjb3VudCArIDE7XG4gICAgfSBlbHNlIGlmIChjb2RlIDwgMjA0OCkge1xuICAgICAgLy8gdXAgdG8gMTEgYml0c1xuICAgICAgY291bnQgPSBjb3VudCArIDI7XG4gICAgfSBlbHNlIGlmIChjb2RlIDwgNjU1MzYpIHtcbiAgICAgIC8vIHVwIHRvIDE2IGJpdHNcbiAgICAgIGNvdW50ID0gY291bnQgKyAzO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb3VudDtcbn1cblxuZnVuY3Rpb24ganNvblBhcnNlKHMpIHtcbiAgdmFyIHZhbHVlLCBlcnJvcjtcbiAgdHJ5IHtcbiAgICB2YWx1ZSA9IFJvbGxiYXJKU09OLnBhcnNlKHMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgZXJyb3IgPSBlO1xuICB9XG4gIHJldHVybiB7IGVycm9yOiBlcnJvciwgdmFsdWU6IHZhbHVlIH07XG59XG5cbmZ1bmN0aW9uIG1ha2VVbmhhbmRsZWRTdGFja0luZm8oXG4gIG1lc3NhZ2UsXG4gIHVybCxcbiAgbGluZW5vLFxuICBjb2xubyxcbiAgZXJyb3IsXG4gIG1vZGUsXG4gIGJhY2t1cE1lc3NhZ2UsXG4gIGVycm9yUGFyc2VyLFxuKSB7XG4gIHZhciBsb2NhdGlvbiA9IHtcbiAgICB1cmw6IHVybCB8fCAnJyxcbiAgICBsaW5lOiBsaW5lbm8sXG4gICAgY29sdW1uOiBjb2xubyxcbiAgfTtcbiAgbG9jYXRpb24uZnVuYyA9IGVycm9yUGFyc2VyLmd1ZXNzRnVuY3Rpb25OYW1lKGxvY2F0aW9uLnVybCwgbG9jYXRpb24ubGluZSk7XG4gIGxvY2F0aW9uLmNvbnRleHQgPSBlcnJvclBhcnNlci5nYXRoZXJDb250ZXh0KGxvY2F0aW9uLnVybCwgbG9jYXRpb24ubGluZSk7XG4gIHZhciBocmVmID1cbiAgICB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmXG4gICAgZG9jdW1lbnQgJiZcbiAgICBkb2N1bWVudC5sb2NhdGlvbiAmJlxuICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWY7XG4gIHZhciB1c2VyYWdlbnQgPVxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgd2luZG93ICYmXG4gICAgd2luZG93Lm5hdmlnYXRvciAmJlxuICAgIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICByZXR1cm4ge1xuICAgIG1vZGU6IG1vZGUsXG4gICAgbWVzc2FnZTogZXJyb3IgPyBTdHJpbmcoZXJyb3IpIDogbWVzc2FnZSB8fCBiYWNrdXBNZXNzYWdlLFxuICAgIHVybDogaHJlZixcbiAgICBzdGFjazogW2xvY2F0aW9uXSxcbiAgICB1c2VyYWdlbnQ6IHVzZXJhZ2VudCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gd3JhcENhbGxiYWNrKGxvZ2dlciwgZikge1xuICByZXR1cm4gZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgIHRyeSB7XG4gICAgICBmKGVyciwgcmVzcCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbG9nZ2VyLmVycm9yKGUpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gbm9uQ2lyY3VsYXJDbG9uZShvYmopIHtcbiAgdmFyIHNlZW4gPSBbb2JqXTtcblxuICBmdW5jdGlvbiBjbG9uZShvYmosIHNlZW4pIHtcbiAgICB2YXIgdmFsdWUsXG4gICAgICBuYW1lLFxuICAgICAgbmV3U2VlbixcbiAgICAgIHJlc3VsdCA9IHt9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAobmFtZSBpbiBvYmopIHtcbiAgICAgICAgdmFsdWUgPSBvYmpbbmFtZV07XG5cbiAgICAgICAgaWYgKHZhbHVlICYmIChpc1R5cGUodmFsdWUsICdvYmplY3QnKSB8fCBpc1R5cGUodmFsdWUsICdhcnJheScpKSkge1xuICAgICAgICAgIGlmIChzZWVuLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgICAgICAgcmVzdWx0W25hbWVdID0gJ1JlbW92ZWQgY2lyY3VsYXIgcmVmZXJlbmNlOiAnICsgdHlwZU5hbWUodmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdTZWVuID0gc2Vlbi5zbGljZSgpO1xuICAgICAgICAgICAgbmV3U2Vlbi5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IGNsb25lKHZhbHVlLCBuZXdTZWVuKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHRbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXN1bHQgPSAnRmFpbGVkIGNsb25pbmcgY3VzdG9tIGRhdGE6ICcgKyBlLm1lc3NhZ2U7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGNsb25lKG9iaiwgc2Vlbik7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUl0ZW0oYXJncywgbG9nZ2VyLCBub3RpZmllciwgcmVxdWVzdEtleXMsIGxhbWJkYUNvbnRleHQpIHtcbiAgdmFyIG1lc3NhZ2UsIGVyciwgY3VzdG9tLCBjYWxsYmFjaywgcmVxdWVzdDtcbiAgdmFyIGFyZztcbiAgdmFyIGV4dHJhQXJncyA9IFtdO1xuICB2YXIgZGlhZ25vc3RpYyA9IHt9O1xuICB2YXIgYXJnVHlwZXMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3MubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcblxuICAgIHZhciB0eXAgPSB0eXBlTmFtZShhcmcpO1xuICAgIGFyZ1R5cGVzLnB1c2godHlwKTtcbiAgICBzd2l0Y2ggKHR5cCkge1xuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBtZXNzYWdlID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChtZXNzYWdlID0gYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgIGNhbGxiYWNrID0gd3JhcENhbGxiYWNrKGxvZ2dlciwgYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgZXh0cmFBcmdzLnB1c2goYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdlcnJvcic6XG4gICAgICBjYXNlICdkb21leGNlcHRpb24nOlxuICAgICAgY2FzZSAnZXhjZXB0aW9uJzogLy8gRmlyZWZveCBFeGNlcHRpb24gdHlwZVxuICAgICAgICBlcnIgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGVyciA9IGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGFyZyBpbnN0YW5jZW9mIEVycm9yIHx8XG4gICAgICAgICAgKHR5cGVvZiBET01FeGNlcHRpb24gIT09ICd1bmRlZmluZWQnICYmIGFyZyBpbnN0YW5jZW9mIERPTUV4Y2VwdGlvbilcbiAgICAgICAgKSB7XG4gICAgICAgICAgZXJyID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChlcnIgPSBhcmcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXF1ZXN0S2V5cyAmJiB0eXAgPT09ICdvYmplY3QnICYmICFyZXF1ZXN0KSB7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbiA9IHJlcXVlc3RLZXlzLmxlbmd0aDsgaiA8IGxlbjsgKytqKSB7XG4gICAgICAgICAgICBpZiAoYXJnW3JlcXVlc3RLZXlzW2pdXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHJlcXVlc3QgPSBhcmc7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVxdWVzdCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGN1c3RvbSA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoY3VzdG9tID0gYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoXG4gICAgICAgICAgYXJnIGluc3RhbmNlb2YgRXJyb3IgfHxcbiAgICAgICAgICAodHlwZW9mIERPTUV4Y2VwdGlvbiAhPT0gJ3VuZGVmaW5lZCcgJiYgYXJnIGluc3RhbmNlb2YgRE9NRXhjZXB0aW9uKVxuICAgICAgICApIHtcbiAgICAgICAgICBlcnIgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGVyciA9IGFyZyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZXh0cmFBcmdzLnB1c2goYXJnKTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiBjdXN0b20gaXMgYW4gYXJyYXkgdGhpcyB0dXJucyBpdCBpbnRvIGFuIG9iamVjdCB3aXRoIGludGVnZXIga2V5c1xuICBpZiAoY3VzdG9tKSBjdXN0b20gPSBub25DaXJjdWxhckNsb25lKGN1c3RvbSk7XG5cbiAgaWYgKGV4dHJhQXJncy5sZW5ndGggPiAwKSB7XG4gICAgaWYgKCFjdXN0b20pIGN1c3RvbSA9IG5vbkNpcmN1bGFyQ2xvbmUoe30pO1xuICAgIGN1c3RvbS5leHRyYUFyZ3MgPSBub25DaXJjdWxhckNsb25lKGV4dHJhQXJncyk7XG4gIH1cblxuICB2YXIgaXRlbSA9IHtcbiAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgIGVycjogZXJyLFxuICAgIGN1c3RvbTogY3VzdG9tLFxuICAgIHRpbWVzdGFtcDogbm93KCksXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgIG5vdGlmaWVyOiBub3RpZmllcixcbiAgICBkaWFnbm9zdGljOiBkaWFnbm9zdGljLFxuICAgIHV1aWQ6IHV1aWQ0KCksXG4gIH07XG5cbiAgaXRlbS5kYXRhID0gaXRlbS5kYXRhIHx8IHt9O1xuXG4gIHNldEN1c3RvbUl0ZW1LZXlzKGl0ZW0sIGN1c3RvbSk7XG5cbiAgaWYgKHJlcXVlc3RLZXlzICYmIHJlcXVlc3QpIHtcbiAgICBpdGVtLnJlcXVlc3QgPSByZXF1ZXN0O1xuICB9XG4gIGlmIChsYW1iZGFDb250ZXh0KSB7XG4gICAgaXRlbS5sYW1iZGFDb250ZXh0ID0gbGFtYmRhQ29udGV4dDtcbiAgfVxuICBpdGVtLl9vcmlnaW5hbEFyZ3MgPSBhcmdzO1xuICBpdGVtLmRpYWdub3N0aWMub3JpZ2luYWxfYXJnX3R5cGVzID0gYXJnVHlwZXM7XG4gIHJldHVybiBpdGVtO1xufVxuXG5mdW5jdGlvbiBzZXRDdXN0b21JdGVtS2V5cyhpdGVtLCBjdXN0b20pIHtcbiAgaWYgKGN1c3RvbSAmJiBjdXN0b20ubGV2ZWwgIT09IHVuZGVmaW5lZCkge1xuICAgIGl0ZW0ubGV2ZWwgPSBjdXN0b20ubGV2ZWw7XG4gICAgZGVsZXRlIGN1c3RvbS5sZXZlbDtcbiAgfVxuICBpZiAoY3VzdG9tICYmIGN1c3RvbS5za2lwRnJhbWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICBpdGVtLnNraXBGcmFtZXMgPSBjdXN0b20uc2tpcEZyYW1lcztcbiAgICBkZWxldGUgY3VzdG9tLnNraXBGcmFtZXM7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkRXJyb3JDb250ZXh0KGl0ZW0sIGVycm9ycykge1xuICB2YXIgY3VzdG9tID0gaXRlbS5kYXRhLmN1c3RvbSB8fCB7fTtcbiAgdmFyIGNvbnRleHRBZGRlZCA9IGZhbHNlO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlcnJvcnMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChlcnJvcnNbaV0uaGFzT3duUHJvcGVydHkoJ3JvbGxiYXJDb250ZXh0JykpIHtcbiAgICAgICAgY3VzdG9tID0gbWVyZ2UoY3VzdG9tLCBub25DaXJjdWxhckNsb25lKGVycm9yc1tpXS5yb2xsYmFyQ29udGV4dCkpO1xuICAgICAgICBjb250ZXh0QWRkZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEF2b2lkIGFkZGluZyBhbiBlbXB0eSBvYmplY3QgdG8gdGhlIGRhdGEuXG4gICAgaWYgKGNvbnRleHRBZGRlZCkge1xuICAgICAgaXRlbS5kYXRhLmN1c3RvbSA9IGN1c3RvbTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpdGVtLmRpYWdub3N0aWMuZXJyb3JfY29udGV4dCA9ICdGYWlsZWQ6ICcgKyBlLm1lc3NhZ2U7XG4gIH1cbn1cblxudmFyIFRFTEVNRVRSWV9UWVBFUyA9IFtcbiAgJ2xvZycsXG4gICduZXR3b3JrJyxcbiAgJ2RvbScsXG4gICduYXZpZ2F0aW9uJyxcbiAgJ2Vycm9yJyxcbiAgJ21hbnVhbCcsXG5dO1xudmFyIFRFTEVNRVRSWV9MRVZFTFMgPSBbJ2NyaXRpY2FsJywgJ2Vycm9yJywgJ3dhcm5pbmcnLCAnaW5mbycsICdkZWJ1ZyddO1xuXG5mdW5jdGlvbiBhcnJheUluY2x1ZGVzKGFyciwgdmFsKSB7XG4gIGZvciAodmFyIGsgPSAwOyBrIDwgYXJyLmxlbmd0aDsgKytrKSB7XG4gICAgaWYgKGFycltrXSA9PT0gdmFsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRlbGVtZXRyeUV2ZW50KGFyZ3MpIHtcbiAgdmFyIHR5cGUsIG1ldGFkYXRhLCBsZXZlbDtcbiAgdmFyIGFyZztcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3MubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcblxuICAgIHZhciB0eXAgPSB0eXBlTmFtZShhcmcpO1xuICAgIHN3aXRjaCAodHlwKSB7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBpZiAoIXR5cGUgJiYgYXJyYXlJbmNsdWRlcyhURUxFTUVUUllfVFlQRVMsIGFyZykpIHtcbiAgICAgICAgICB0eXBlID0gYXJnO1xuICAgICAgICB9IGVsc2UgaWYgKCFsZXZlbCAmJiBhcnJheUluY2x1ZGVzKFRFTEVNRVRSWV9MRVZFTFMsIGFyZykpIHtcbiAgICAgICAgICBsZXZlbCA9IGFyZztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIG1ldGFkYXRhID0gYXJnO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICB2YXIgZXZlbnQgPSB7XG4gICAgdHlwZTogdHlwZSB8fCAnbWFudWFsJyxcbiAgICBtZXRhZGF0YTogbWV0YWRhdGEgfHwge30sXG4gICAgbGV2ZWw6IGxldmVsLFxuICB9O1xuXG4gIHJldHVybiBldmVudDtcbn1cblxuZnVuY3Rpb24gYWRkSXRlbUF0dHJpYnV0ZXMoaXRlbSwgYXR0cmlidXRlcykge1xuICBpdGVtLmRhdGEuYXR0cmlidXRlcyA9IGl0ZW0uZGF0YS5hdHRyaWJ1dGVzIHx8IFtdO1xuICBpZiAoYXR0cmlidXRlcykge1xuICAgIGl0ZW0uZGF0YS5hdHRyaWJ1dGVzLnB1c2goLi4uYXR0cmlidXRlcyk7XG4gIH1cbn1cblxuLypcbiAqIGdldCAtIGdpdmVuIGFuIG9iai9hcnJheSBhbmQgYSBrZXlwYXRoLCByZXR1cm4gdGhlIHZhbHVlIGF0IHRoYXQga2V5cGF0aCBvclxuICogICAgICAgdW5kZWZpbmVkIGlmIG5vdCBwb3NzaWJsZS5cbiAqXG4gKiBAcGFyYW0gb2JqIC0gYW4gb2JqZWN0IG9yIGFycmF5XG4gKiBAcGFyYW0gcGF0aCAtIGEgc3RyaW5nIG9mIGtleXMgc2VwYXJhdGVkIGJ5ICcuJyBzdWNoIGFzICdwbHVnaW4uanF1ZXJ5LjAubWVzc2FnZSdcbiAqICAgIHdoaWNoIHdvdWxkIGNvcnJlc3BvbmQgdG8gNDIgaW4gYHtwbHVnaW46IHtqcXVlcnk6IFt7bWVzc2FnZTogNDJ9XX19YFxuICovXG5mdW5jdGlvbiBnZXQob2JqLCBwYXRoKSB7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICB2YXIga2V5cyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgdmFyIHJlc3VsdCA9IG9iajtcbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0ga2V5cy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0W2tleXNbaV1dO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzZXQob2JqLCBwYXRoLCB2YWx1ZSkge1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIga2V5cyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgdmFyIGxlbiA9IGtleXMubGVuZ3RoO1xuICBpZiAobGVuIDwgMSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAobGVuID09PSAxKSB7XG4gICAgb2JqW2tleXNbMF1dID0gdmFsdWU7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRyeSB7XG4gICAgdmFyIHRlbXAgPSBvYmpba2V5c1swXV0gfHwge307XG4gICAgdmFyIHJlcGxhY2VtZW50ID0gdGVtcDtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxlbiAtIDE7ICsraSkge1xuICAgICAgdGVtcFtrZXlzW2ldXSA9IHRlbXBba2V5c1tpXV0gfHwge307XG4gICAgICB0ZW1wID0gdGVtcFtrZXlzW2ldXTtcbiAgICB9XG4gICAgdGVtcFtrZXlzW2xlbiAtIDFdXSA9IHZhbHVlO1xuICAgIG9ialtrZXlzWzBdXSA9IHJlcGxhY2VtZW50O1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3NBc1N0cmluZyhhcmdzKSB7XG4gIHZhciBpLCBsZW4sIGFyZztcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKGkgPSAwLCBsZW4gPSBhcmdzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcbiAgICBzd2l0Y2ggKHR5cGVOYW1lKGFyZykpIHtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGFyZyA9IHN0cmluZ2lmeShhcmcpO1xuICAgICAgICBhcmcgPSBhcmcuZXJyb3IgfHwgYXJnLnZhbHVlO1xuICAgICAgICBpZiAoYXJnLmxlbmd0aCA+IDUwMCkge1xuICAgICAgICAgIGFyZyA9IGFyZy5zdWJzdHIoMCwgNDk3KSArICcuLi4nO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbnVsbCc6XG4gICAgICAgIGFyZyA9ICdudWxsJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICBhcmcgPSAndW5kZWZpbmVkJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzeW1ib2wnOlxuICAgICAgICBhcmcgPSBhcmcudG9TdHJpbmcoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKGFyZyk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdC5qb2luKCcgJyk7XG59XG5cbmZ1bmN0aW9uIG5vdygpIHtcbiAgaWYgKERhdGUubm93KSB7XG4gICAgcmV0dXJuICtEYXRlLm5vdygpO1xuICB9XG4gIHJldHVybiArbmV3IERhdGUoKTtcbn1cblxuZnVuY3Rpb24gZmlsdGVySXAocmVxdWVzdERhdGEsIGNhcHR1cmVJcCkge1xuICBpZiAoIXJlcXVlc3REYXRhIHx8ICFyZXF1ZXN0RGF0YVsndXNlcl9pcCddIHx8IGNhcHR1cmVJcCA9PT0gdHJ1ZSkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbmV3SXAgPSByZXF1ZXN0RGF0YVsndXNlcl9pcCddO1xuICBpZiAoIWNhcHR1cmVJcCkge1xuICAgIG5ld0lwID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICB0cnkge1xuICAgICAgdmFyIHBhcnRzO1xuICAgICAgaWYgKG5ld0lwLmluZGV4T2YoJy4nKSAhPT0gLTEpIHtcbiAgICAgICAgcGFydHMgPSBuZXdJcC5zcGxpdCgnLicpO1xuICAgICAgICBwYXJ0cy5wb3AoKTtcbiAgICAgICAgcGFydHMucHVzaCgnMCcpO1xuICAgICAgICBuZXdJcCA9IHBhcnRzLmpvaW4oJy4nKTtcbiAgICAgIH0gZWxzZSBpZiAobmV3SXAuaW5kZXhPZignOicpICE9PSAtMSkge1xuICAgICAgICBwYXJ0cyA9IG5ld0lwLnNwbGl0KCc6Jyk7XG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgdmFyIGJlZ2lubmluZyA9IHBhcnRzLnNsaWNlKDAsIDMpO1xuICAgICAgICAgIHZhciBzbGFzaElkeCA9IGJlZ2lubmluZ1syXS5pbmRleE9mKCcvJyk7XG4gICAgICAgICAgaWYgKHNsYXNoSWR4ICE9PSAtMSkge1xuICAgICAgICAgICAgYmVnaW5uaW5nWzJdID0gYmVnaW5uaW5nWzJdLnN1YnN0cmluZygwLCBzbGFzaElkeCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB0ZXJtaW5hbCA9ICcwMDAwOjAwMDA6MDAwMDowMDAwOjAwMDAnO1xuICAgICAgICAgIG5ld0lwID0gYmVnaW5uaW5nLmNvbmNhdCh0ZXJtaW5hbCkuam9pbignOicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdJcCA9IG51bGw7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbmV3SXAgPSBudWxsO1xuICAgIH1cbiAgfVxuICByZXF1ZXN0RGF0YVsndXNlcl9pcCddID0gbmV3SXA7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU9wdGlvbnMoY3VycmVudCwgaW5wdXQsIHBheWxvYWQsIGxvZ2dlcikge1xuICB2YXIgcmVzdWx0ID0gbWVyZ2UoY3VycmVudCwgaW5wdXQsIHBheWxvYWQpO1xuICByZXN1bHQgPSB1cGRhdGVEZXByZWNhdGVkT3B0aW9ucyhyZXN1bHQsIGxvZ2dlcik7XG4gIGlmICghaW5wdXQgfHwgaW5wdXQub3ZlcndyaXRlU2NydWJGaWVsZHMpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGlmIChpbnB1dC5zY3J1YkZpZWxkcykge1xuICAgIHJlc3VsdC5zY3J1YkZpZWxkcyA9IChjdXJyZW50LnNjcnViRmllbGRzIHx8IFtdKS5jb25jYXQoaW5wdXQuc2NydWJGaWVsZHMpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZURlcHJlY2F0ZWRPcHRpb25zKG9wdGlvbnMsIGxvZ2dlcikge1xuICBpZiAob3B0aW9ucy5ob3N0V2hpdGVMaXN0ICYmICFvcHRpb25zLmhvc3RTYWZlTGlzdCkge1xuICAgIG9wdGlvbnMuaG9zdFNhZmVMaXN0ID0gb3B0aW9ucy5ob3N0V2hpdGVMaXN0O1xuICAgIG9wdGlvbnMuaG9zdFdoaXRlTGlzdCA9IHVuZGVmaW5lZDtcbiAgICBsb2dnZXIgJiYgbG9nZ2VyLmxvZygnaG9zdFdoaXRlTGlzdCBpcyBkZXByZWNhdGVkLiBVc2UgaG9zdFNhZmVMaXN0LicpO1xuICB9XG4gIGlmIChvcHRpb25zLmhvc3RCbGFja0xpc3QgJiYgIW9wdGlvbnMuaG9zdEJsb2NrTGlzdCkge1xuICAgIG9wdGlvbnMuaG9zdEJsb2NrTGlzdCA9IG9wdGlvbnMuaG9zdEJsYWNrTGlzdDtcbiAgICBvcHRpb25zLmhvc3RCbGFja0xpc3QgPSB1bmRlZmluZWQ7XG4gICAgbG9nZ2VyICYmIGxvZ2dlci5sb2coJ2hvc3RCbGFja0xpc3QgaXMgZGVwcmVjYXRlZC4gVXNlIGhvc3RCbG9ja0xpc3QuJyk7XG4gIH1cbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aDogYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGgsXG4gIGNyZWF0ZUl0ZW06IGNyZWF0ZUl0ZW0sXG4gIGFkZEVycm9yQ29udGV4dDogYWRkRXJyb3JDb250ZXh0LFxuICBjcmVhdGVUZWxlbWV0cnlFdmVudDogY3JlYXRlVGVsZW1ldHJ5RXZlbnQsXG4gIGFkZEl0ZW1BdHRyaWJ1dGVzOiBhZGRJdGVtQXR0cmlidXRlcyxcbiAgZmlsdGVySXA6IGZpbHRlcklwLFxuICBmb3JtYXRBcmdzQXNTdHJpbmc6IGZvcm1hdEFyZ3NBc1N0cmluZyxcbiAgZm9ybWF0VXJsOiBmb3JtYXRVcmwsXG4gIGdldDogZ2V0LFxuICBoYW5kbGVPcHRpb25zOiBoYW5kbGVPcHRpb25zLFxuICBpc0Vycm9yOiBpc0Vycm9yLFxuICBpc0Zpbml0ZU51bWJlcjogaXNGaW5pdGVOdW1iZXIsXG4gIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gIGlzSXRlcmFibGU6IGlzSXRlcmFibGUsXG4gIGlzTmF0aXZlRnVuY3Rpb246IGlzTmF0aXZlRnVuY3Rpb24sXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc1R5cGU6IGlzVHlwZSxcbiAgaXNQcm9taXNlOiBpc1Byb21pc2UsXG4gIGlzQnJvd3NlcjogaXNCcm93c2VyLFxuICBqc29uUGFyc2U6IGpzb25QYXJzZSxcbiAgTEVWRUxTOiBMRVZFTFMsXG4gIG1ha2VVbmhhbmRsZWRTdGFja0luZm86IG1ha2VVbmhhbmRsZWRTdGFja0luZm8sXG4gIG1lcmdlOiBtZXJnZSxcbiAgbm93OiBub3csXG4gIHJlZGFjdDogcmVkYWN0LFxuICBSb2xsYmFySlNPTjogUm9sbGJhckpTT04sXG4gIHNhbml0aXplVXJsOiBzYW5pdGl6ZVVybCxcbiAgc2V0OiBzZXQsXG4gIHNldHVwSlNPTjogc2V0dXBKU09OLFxuICBzdHJpbmdpZnk6IHN0cmluZ2lmeSxcbiAgbWF4Qnl0ZVNpemU6IG1heEJ5dGVTaXplLFxuICB0eXBlTmFtZTogdHlwZU5hbWUsXG4gIHV1aWQ0OiB1dWlkNCxcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLyogZ2xvYmFscyBleHBlY3QgKi9cbi8qIGdsb2JhbHMgZGVzY3JpYmUgKi9cbi8qIGdsb2JhbHMgaXQgKi9cbi8qIGdsb2JhbHMgc2lub24gKi9cblxudmFyIFF1ZXVlID0gcmVxdWlyZSgnLi4vc3JjL3F1ZXVlJyk7XG5cbmZ1bmN0aW9uIFRlc3RSYXRlTGltaXRlckdlbmVyYXRvcigpIHtcbiAgdmFyIFRlc3RSYXRlTGltaXRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNob3VsZFNlbmRWYWx1ZSA9IHRydWU7XG4gICAgdGhpcy5oYW5kbGVyID0gbnVsbDtcbiAgfTtcblxuICBUZXN0UmF0ZUxpbWl0ZXIucHJvdG90eXBlLnNob3VsZFNlbmQgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIGlmICh0aGlzLmhhbmRsZXIgJiYgdHlwZW9mIHRoaXMuaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlcihpdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2hvdWxkU2VuZFZhbHVlO1xuICB9O1xuXG4gIHJldHVybiBUZXN0UmF0ZUxpbWl0ZXI7XG59XG5cbmZ1bmN0aW9uIFRlc3RBcGlHZW5lcmF0b3IoKSB7XG4gIHZhciBUZXN0QXBpID0gZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICB0aGlzLmhhbmRsZXIgPSBoYW5kbGVyO1xuICB9O1xuXG4gIFRlc3RBcGkucHJvdG90eXBlLnBvc3RJdGVtID0gZnVuY3Rpb24gKGl0ZW0sIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMuaGFuZGxlciAmJiB0eXBlb2YgdGhpcy5oYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLmhhbmRsZXIoaXRlbSwgY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY2FsbGJhY2sgJiYgdHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcignQlJPS0VOJyksIG51bGwpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBUZXN0QXBpLnByb3RvdHlwZS5jb25maWd1cmUgPSBmdW5jdGlvbiAoKSB7fTtcblxuICByZXR1cm4gVGVzdEFwaTtcbn1cblxuZnVuY3Rpb24gVGVzdExvZ2dlckdlbmVyYXRvcigpIHtcbiAgdmFyIFRlc3RMb2dnZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5jYWxscyA9IHtcbiAgICAgIGxvZzogW10sXG4gICAgICBlcnJvcjogW10sXG4gICAgICBpbmZvOiBbXSxcbiAgICB9O1xuICB9O1xuICBUZXN0TG9nZ2VyLnByb3RvdHlwZS5sb2cgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5jYWxscy5sb2cucHVzaChhcmd1bWVudHMpO1xuICB9O1xuICBUZXN0TG9nZ2VyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNhbGxzLmVycm9yLnB1c2goYXJndW1lbnRzKTtcbiAgfTtcbiAgVGVzdExvZ2dlci5wcm90b3R5cGUuaW5mbyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNhbGxzLmluZm8ucHVzaChhcmd1bWVudHMpO1xuICB9O1xuICByZXR1cm4gVGVzdExvZ2dlcjtcbn1cblxuZGVzY3JpYmUoJ1F1ZXVlKCknLCBmdW5jdGlvbiAoKSB7XG4gIGl0KCdzaG91bGQgaGF2ZSBhbGwgb2YgdGhlIGV4cGVjdGVkIG1ldGhvZHMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciByYXRlTGltaXRlciA9IG5ldyAoVGVzdFJhdGVMaW1pdGVyR2VuZXJhdG9yKCkpKCk7XG4gICAgdmFyIGFwaSA9IG5ldyAoVGVzdEFwaUdlbmVyYXRvcigpKSgpO1xuICAgIHZhciBsb2dnZXIgPSBuZXcgKFRlc3RMb2dnZXJHZW5lcmF0b3IoKSkoKTtcbiAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgIHZhciBxdWV1ZSA9IG5ldyBRdWV1ZShyYXRlTGltaXRlciwgYXBpLCBsb2dnZXIsIG9wdGlvbnMpO1xuICAgIGV4cGVjdChxdWV1ZSkudG8uaGF2ZS5wcm9wZXJ0eSgnY29uZmlndXJlJyk7XG4gICAgZXhwZWN0KHF1ZXVlKS50by5oYXZlLnByb3BlcnR5KCdhZGRQcmVkaWNhdGUnKTtcbiAgICBleHBlY3QocXVldWUpLnRvLmhhdmUucHJvcGVydHkoJ2FkZEl0ZW0nKTtcbiAgICBleHBlY3QocXVldWUpLnRvLmhhdmUucHJvcGVydHkoJ3dhaXQnKTtcblxuICAgIGRvbmUoKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2NvbmZpZ3VyZScsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCB1cGRhdGUgdGhlIG9wdGlvbnMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciByYXRlTGltaXRlciA9IG5ldyAoVGVzdFJhdGVMaW1pdGVyR2VuZXJhdG9yKCkpKCk7XG4gICAgdmFyIGFwaSA9IG5ldyAoVGVzdEFwaUdlbmVyYXRvcigpKSgpO1xuICAgIHZhciBsb2dnZXIgPSBuZXcgKFRlc3RMb2dnZXJHZW5lcmF0b3IoKSkoKTtcbiAgICB2YXIgb3B0aW9ucyA9IHsgYTogMSwgYjogNDIgfTtcbiAgICB2YXIgcXVldWUgPSBuZXcgUXVldWUocmF0ZUxpbWl0ZXIsIGFwaSwgbG9nZ2VyLCBvcHRpb25zKTtcblxuICAgIGV4cGVjdChxdWV1ZS5vcHRpb25zLmEpLnRvLmVxbCgxKTtcbiAgICBleHBlY3QocXVldWUub3B0aW9ucy5iKS50by5lcWwoNDIpO1xuXG4gICAgcXVldWUuY29uZmlndXJlKHsgYTogMiwgYzogMTUgfSk7XG5cbiAgICBleHBlY3QocXVldWUub3B0aW9ucy5hKS50by5lcWwoMik7XG4gICAgZXhwZWN0KHF1ZXVlLm9wdGlvbnMuYikudG8uZXFsKDQyKTtcbiAgICBleHBlY3QocXVldWUub3B0aW9ucy5jKS50by5lcWwoMTUpO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnYWRkSXRlbScsIGZ1bmN0aW9uICgpIHtcbiAgZGVzY3JpYmUoJ25vdCByYXRlIGxpbWl0ZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgZGVzY3JpYmUoJ2FwaSBzdWNjZXNzJywgZnVuY3Rpb24gKCkge1xuICAgICAgaXQoJ3Nob3VsZCB3b3JrIHdpdGggbm8gY2FsbGJhY2snLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICB2YXIgcmF0ZUxpbWl0ZXIgPSBuZXcgKFRlc3RSYXRlTGltaXRlckdlbmVyYXRvcigpKSgpO1xuICAgICAgICB2YXIgYXBpID0gbmV3IChUZXN0QXBpR2VuZXJhdG9yKCkpKCk7XG4gICAgICAgIHZhciBsb2dnZXIgPSBuZXcgKFRlc3RMb2dnZXJHZW5lcmF0b3IoKSkoKTtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7IHRyYW5zbWl0OiB0cnVlIH07XG4gICAgICAgIHZhciBxdWV1ZSA9IG5ldyBRdWV1ZShyYXRlTGltaXRlciwgYXBpLCBsb2dnZXIsIG9wdGlvbnMpO1xuXG4gICAgICAgIHZhciBpdGVtID0geyBteWtleTogJ215dmFsdWUnIH07XG4gICAgICAgIHZhciBzZXJ2ZXJSZXNwb25zZSA9IHsgc3VjY2VzczogdHJ1ZSB9O1xuXG4gICAgICAgIHJhdGVMaW1pdGVyLmhhbmRsZXIgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgIGV4cGVjdChpKS50by5lcWwoaXRlbSk7XG4gICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IG51bGwsIHNob3VsZFNlbmQ6IHRydWUsIHBheWxvYWQ6IG51bGwgfTtcbiAgICAgICAgfTtcbiAgICAgICAgYXBpLmhhbmRsZXIgPSBmdW5jdGlvbiAoaSwgY2IpIHtcbiAgICAgICAgICBleHBlY3QoaSkudG8uZXFsKGl0ZW0pO1xuICAgICAgICAgIGNiKG51bGwsIHNlcnZlclJlc3BvbnNlKTtcbiAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG4gICAgICAgIHF1ZXVlLmFkZEl0ZW0oeyBteWtleTogJ215dmFsdWUnIH0pO1xuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIHdvcmsgd2l0aCBhIGdhcmJhZ2UgY2FsbGJhY2snLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICB2YXIgcmF0ZUxpbWl0ZXIgPSBuZXcgKFRlc3RSYXRlTGltaXRlckdlbmVyYXRvcigpKSgpO1xuICAgICAgICB2YXIgYXBpID0gbmV3IChUZXN0QXBpR2VuZXJhdG9yKCkpKCk7XG4gICAgICAgIHZhciBsb2dnZXIgPSBuZXcgKFRlc3RMb2dnZXJHZW5lcmF0b3IoKSkoKTtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7IHRyYW5zbWl0OiB0cnVlIH07XG4gICAgICAgIHZhciBxdWV1ZSA9IG5ldyBRdWV1ZShyYXRlTGltaXRlciwgYXBpLCBsb2dnZXIsIG9wdGlvbnMpO1xuXG4gICAgICAgIHZhciBpdGVtID0geyBteWtleTogJ215dmFsdWUnIH07XG4gICAgICAgIHZhciBzZXJ2ZXJSZXNwb25zZSA9IHsgc3VjY2VzczogdHJ1ZSB9O1xuXG4gICAgICAgIHJhdGVMaW1pdGVyLmhhbmRsZXIgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgIGV4cGVjdChpKS50by5lcWwoaXRlbSk7XG4gICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IG51bGwsIHNob3VsZFNlbmQ6IHRydWUsIHBheWxvYWQ6IG51bGwgfTtcbiAgICAgICAgfTtcbiAgICAgICAgYXBpLmhhbmRsZXIgPSBmdW5jdGlvbiAoaSwgY2IpIHtcbiAgICAgICAgICBleHBlY3QoaSkudG8uZXFsKGl0ZW0pO1xuICAgICAgICAgIGNiKG51bGwsIHNlcnZlclJlc3BvbnNlKTtcbiAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG4gICAgICAgIHF1ZXVlLmFkZEl0ZW0oeyBteWtleTogJ215dmFsdWUnIH0sICd3b29wcycpO1xuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIHdvcmsgd2l0aCBubyBwcmVkaWNhdGVzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgdmFyIHJhdGVMaW1pdGVyID0gbmV3IChUZXN0UmF0ZUxpbWl0ZXJHZW5lcmF0b3IoKSkoKTtcbiAgICAgICAgdmFyIGFwaSA9IG5ldyAoVGVzdEFwaUdlbmVyYXRvcigpKSgpO1xuICAgICAgICB2YXIgbG9nZ2VyID0gbmV3IChUZXN0TG9nZ2VyR2VuZXJhdG9yKCkpKCk7XG4gICAgICAgIHZhciBvcHRpb25zID0geyB0cmFuc21pdDogdHJ1ZSB9O1xuICAgICAgICB2YXIgcXVldWUgPSBuZXcgUXVldWUocmF0ZUxpbWl0ZXIsIGFwaSwgbG9nZ2VyLCBvcHRpb25zKTtcblxuICAgICAgICB2YXIgaXRlbSA9IHsgbXlrZXk6ICdteXZhbHVlJyB9O1xuICAgICAgICB2YXIgc2VydmVyUmVzcG9uc2UgPSB7IHN1Y2Nlc3M6IHRydWUgfTtcblxuICAgICAgICByYXRlTGltaXRlci5oYW5kbGVyID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICBleHBlY3QoaSkudG8uZXFsKGl0ZW0pO1xuICAgICAgICAgIHJldHVybiB7IGVycm9yOiBudWxsLCBzaG91bGRTZW5kOiB0cnVlLCBwYXlsb2FkOiBudWxsIH07XG4gICAgICAgIH07XG4gICAgICAgIGFwaS5oYW5kbGVyID0gZnVuY3Rpb24gKGksIGNiKSB7XG4gICAgICAgICAgZXhwZWN0KGkpLnRvLmVxbChpdGVtKTtcbiAgICAgICAgICBjYihudWxsLCBzZXJ2ZXJSZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICAgIHF1ZXVlLmFkZEl0ZW0oeyBteWtleTogJ215dmFsdWUnIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgICAgICBleHBlY3QocmVzcCkudG8uZXFsKHNlcnZlclJlc3BvbnNlKTtcbiAgICAgICAgICBkb25lKGVycik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIGNhbGwgdGhlIGxvZ2dlciBpZiBhbiBlcnJvciBpcyBhYm91dCB0byBiZSBsb2dnZWQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICB2YXIgcmF0ZUxpbWl0ZXIgPSBuZXcgKFRlc3RSYXRlTGltaXRlckdlbmVyYXRvcigpKSgpO1xuICAgICAgICB2YXIgYXBpID0gbmV3IChUZXN0QXBpR2VuZXJhdG9yKCkpKCk7XG4gICAgICAgIHZhciBsb2dnZXIgPSBuZXcgKFRlc3RMb2dnZXJHZW5lcmF0b3IoKSkoKTtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7IHZlcmJvc2U6IHRydWUsIHRyYW5zbWl0OiB0cnVlIH07XG4gICAgICAgIHZhciBxdWV1ZSA9IG5ldyBRdWV1ZShyYXRlTGltaXRlciwgYXBpLCBsb2dnZXIsIG9wdGlvbnMpO1xuXG4gICAgICAgIHZhciBpdGVtID0geyBib2R5OiB7IHRyYWNlOiB7IGV4Y2VwdGlvbjogeyBtZXNzYWdlOiAnaGVsbG8nIH0gfSB9IH07XG4gICAgICAgIHZhciBzZXJ2ZXJSZXNwb25zZSA9IHsgc3VjY2VzczogdHJ1ZSB9O1xuXG4gICAgICAgIHJhdGVMaW1pdGVyLmhhbmRsZXIgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgIGV4cGVjdChpKS50by5lcWwoaXRlbSk7XG4gICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IG51bGwsIHNob3VsZFNlbmQ6IHRydWUsIHBheWxvYWQ6IG51bGwgfTtcbiAgICAgICAgfTtcbiAgICAgICAgYXBpLmhhbmRsZXIgPSBmdW5jdGlvbiAoaSwgY2IpIHtcbiAgICAgICAgICBleHBlY3QoaSkudG8uZXFsKGl0ZW0pO1xuICAgICAgICAgIGNiKG51bGwsIHNlcnZlclJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgcXVldWUuYWRkSXRlbShpdGVtLCBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICAgICAgZXhwZWN0KHJlc3ApLnRvLmVxbChzZXJ2ZXJSZXNwb25zZSk7XG4gICAgICAgICAgZXhwZWN0KGxvZ2dlci5jYWxscy5lcnJvclswXVswXSkudG8uZXFsKCdoZWxsbycpO1xuICAgICAgICAgIGRvbmUoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdzaG91bGQgY2FsbCB0aGUgbG9nZ2VyIGlmIGEgbWVzc2FnZSBpcyBhYm91dCB0byBiZSBsb2dnZWQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICB2YXIgcmF0ZUxpbWl0ZXIgPSBuZXcgKFRlc3RSYXRlTGltaXRlckdlbmVyYXRvcigpKSgpO1xuICAgICAgICB2YXIgYXBpID0gbmV3IChUZXN0QXBpR2VuZXJhdG9yKCkpKCk7XG4gICAgICAgIHZhciBsb2dnZXIgPSBuZXcgKFRlc3RMb2dnZXJHZW5lcmF0b3IoKSkoKTtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7IHZlcmJvc2U6IHRydWUsIHRyYW5zbWl0OiB0cnVlIH07XG4gICAgICAgIHZhciBxdWV1ZSA9IG5ldyBRdWV1ZShyYXRlTGltaXRlciwgYXBpLCBsb2dnZXIsIG9wdGlvbnMpO1xuXG4gICAgICAgIHZhciBpdGVtID0geyBib2R5OiB7IG1lc3NhZ2U6IHsgYm9keTogJ2hlbGxvJyB9IH0gfTtcbiAgICAgICAgdmFyIHNlcnZlclJlc3BvbnNlID0geyBzdWNjZXNzOiB0cnVlIH07XG5cbiAgICAgICAgcmF0ZUxpbWl0ZXIuaGFuZGxlciA9IGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgZXhwZWN0KGkpLnRvLmVxbChpdGVtKTtcbiAgICAgICAgICByZXR1cm4geyBlcnJvcjogbnVsbCwgc2hvdWxkU2VuZDogdHJ1ZSwgcGF5bG9hZDogbnVsbCB9O1xuICAgICAgICB9O1xuICAgICAgICBhcGkuaGFuZGxlciA9IGZ1bmN0aW9uIChpLCBjYikge1xuICAgICAgICAgIGV4cGVjdChpKS50by5lcWwoaXRlbSk7XG4gICAgICAgICAgY2IobnVsbCwgc2VydmVyUmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgICBxdWV1ZS5hZGRJdGVtKGl0ZW0sIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgICAgICBleHBlY3QocmVzcCkudG8uZXFsKHNlcnZlclJlc3BvbnNlKTtcbiAgICAgICAgICBleHBlY3QobG9nZ2VyLmNhbGxzLmxvZ1swXVswXSkudG8uZXFsKCdoZWxsbycpO1xuICAgICAgICAgIGRvbmUoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdzaG91bGQgbm90IGNhbGwgdGhlIGxvZ2dlciBpZiB2ZXJib3NlIGlzIGZhbHNlJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgdmFyIHJhdGVMaW1pdGVyID0gbmV3IChUZXN0UmF0ZUxpbWl0ZXJHZW5lcmF0b3IoKSkoKTtcbiAgICAgICAgdmFyIGFwaSA9IG5ldyAoVGVzdEFwaUdlbmVyYXRvcigpKSgpO1xuICAgICAgICB2YXIgbG9nZ2VyID0gbmV3IChUZXN0TG9nZ2VyR2VuZXJhdG9yKCkpKCk7XG4gICAgICAgIHZhciBvcHRpb25zID0geyB2ZXJib3NlOiBmYWxzZSwgdHJhbnNtaXQ6IHRydWUgfTtcbiAgICAgICAgdmFyIHF1ZXVlID0gbmV3IFF1ZXVlKHJhdGVMaW1pdGVyLCBhcGksIGxvZ2dlciwgb3B0aW9ucyk7XG5cbiAgICAgICAgdmFyIGl0ZW0gPSB7IGJvZHk6IHsgbWVzc2FnZTogeyBib2R5OiAnaGVsbG8nIH0gfSB9O1xuICAgICAgICB2YXIgc2VydmVyUmVzcG9uc2UgPSB7IHN1Y2Nlc3M6IHRydWUgfTtcblxuICAgICAgICByYXRlTGltaXRlci5oYW5kbGVyID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICBleHBlY3QoaSkudG8uZXFsKGl0ZW0pO1xuICAgICAgICAgIHJldHVybiB7IGVycm9yOiBudWxsLCBzaG91bGRTZW5kOiB0cnVlLCBwYXlsb2FkOiBudWxsIH07XG4gICAgICAgIH07XG4gICAgICAgIGFwaS5oYW5kbGVyID0gZnVuY3Rpb24gKGksIGNiKSB7XG4gICAgICAgICAgZXhwZWN0KGkpLnRvLmVxbChpdGVtKTtcbiAgICAgICAgICBjYihudWxsLCBzZXJ2ZXJSZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICAgIHF1ZXVlLmFkZEl0ZW0oaXRlbSwgZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgICAgICAgIGV4cGVjdChyZXNwKS50by5lcWwoc2VydmVyUmVzcG9uc2UpO1xuICAgICAgICAgIGV4cGVjdChsb2dnZXIuY2FsbHMubG9nLmxlbmd0aCkudG8uZXFsKDApO1xuICAgICAgICAgIGRvbmUoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdzaG91bGQgc3RvcCBpZiBhIHByZWRpY2F0ZSByZXR1cm5zIGZhbHNlJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgdmFyIHJhdGVMaW1pdGVyID0gbmV3IChUZXN0UmF0ZUxpbWl0ZXJHZW5lcmF0b3IoKSkoKTtcbiAgICAgICAgdmFyIGFwaSA9IG5ldyAoVGVzdEFwaUdlbmVyYXRvcigpKSgpO1xuICAgICAgICB2YXIgbG9nZ2VyID0gbmV3IChUZXN0TG9nZ2VyR2VuZXJhdG9yKCkpKCk7XG4gICAgICAgIHZhciBvcHRpb25zID0geyB0cmFuc21pdDogdHJ1ZSB9O1xuICAgICAgICB2YXIgcXVldWUgPSBuZXcgUXVldWUocmF0ZUxpbWl0ZXIsIGFwaSwgbG9nZ2VyLCBvcHRpb25zKTtcblxuICAgICAgICB2YXIgaXRlbSA9IHsgbXlrZXk6ICdteXZhbHVlJyB9O1xuICAgICAgICB2YXIgc2VydmVyUmVzcG9uc2UgPSB7IHN1Y2Nlc3M6IHRydWUgfTtcblxuICAgICAgICByYXRlTGltaXRlci5oYW5kbGVyID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICBleHBlY3QoZmFsc2UpLnRvLmJlLm9rKCk7XG4gICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IG51bGwsIHNob3VsZFNlbmQ6IHRydWUsIHBheWxvYWQ6IG51bGwgfTtcbiAgICAgICAgfTtcbiAgICAgICAgYXBpLmhhbmRsZXIgPSBmdW5jdGlvbiAoaSwgY2IpIHtcbiAgICAgICAgICBleHBlY3QoZmFsc2UpLnRvLmJlLm9rKCk7XG4gICAgICAgICAgY2IobnVsbCwgc2VydmVyUmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgICBxdWV1ZS5hZGRQcmVkaWNhdGUoZnVuY3Rpb24gKGksIHMpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgICBxdWV1ZS5hZGRJdGVtKHsgbXlrZXk6ICdteXZhbHVlJyB9LCBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICAgICAgZXhwZWN0KHJlc3ApLnRvLm5vdC5iZS5vaygpO1xuICAgICAgICAgIGRvbmUoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdzaG91bGQgc3RvcCBpZiBhIHByZWRpY2F0ZSByZXR1cm5zIGFuIGVycm9yJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgdmFyIHJhdGVMaW1pdGVyID0gbmV3IChUZXN0UmF0ZUxpbWl0ZXJHZW5lcmF0b3IoKSkoKTtcbiAgICAgICAgdmFyIGFwaSA9IG5ldyAoVGVzdEFwaUdlbmVyYXRvcigpKSgpO1xuICAgICAgICB2YXIgbG9nZ2VyID0gbmV3IChUZXN0TG9nZ2VyR2VuZXJhdG9yKCkpKCk7XG4gICAgICAgIHZhciBvcHRpb25zID0geyB0cmFuc21pdDogdHJ1ZSB9O1xuICAgICAgICB2YXIgcXVldWUgPSBuZXcgUXVldWUocmF0ZUxpbWl0ZXIsIGFwaSwgbG9nZ2VyLCBvcHRpb25zKTtcblxuICAgICAgICB2YXIgaXRlbSA9IHsgbXlrZXk6ICdteXZhbHVlJyB9O1xuICAgICAgICB2YXIgc2VydmVyUmVzcG9uc2UgPSB7IHN1Y2Nlc3M6IHRydWUgfTtcblxuICAgICAgICByYXRlTGltaXRlci5oYW5kbGVyID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICBleHBlY3QoZmFsc2UpLnRvLmJlLm9rKCk7XG4gICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IG51bGwsIHNob3VsZFNlbmQ6IHRydWUsIHBheWxvYWQ6IG51bGwgfTtcbiAgICAgICAgfTtcbiAgICAgICAgYXBpLmhhbmRsZXIgPSBmdW5jdGlvbiAoaSwgY2IpIHtcbiAgICAgICAgICBleHBlY3QoZmFsc2UpLnRvLmJlLm9rKCk7XG4gICAgICAgICAgY2IobnVsbCwgc2VydmVyUmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgcHJlZGljYXRlRXJyb3IgPSAnYm9yayBib3JrJztcbiAgICAgICAgcXVldWUuYWRkUHJlZGljYXRlKGZ1bmN0aW9uIChpLCBzKSB7XG4gICAgICAgICAgcmV0dXJuIHsgZXJyOiBwcmVkaWNhdGVFcnJvciB9O1xuICAgICAgICB9KTtcbiAgICAgICAgcXVldWUuYWRkSXRlbSh7IG15a2V5OiAnbXl2YWx1ZScgfSwgZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgICAgICAgIGV4cGVjdChlcnIpLnRvLmVxbChwcmVkaWNhdGVFcnJvcik7XG4gICAgICAgICAgZXhwZWN0KHJlc3ApLnRvLm5vdC5iZS5vaygpO1xuICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdzaG91bGQgc3RvcCBpZiBhbnkgcHJlZGljYXRlIHJldHVybnMgYW4gZXJyb3InLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICB2YXIgcmF0ZUxpbWl0ZXIgPSBuZXcgKFRlc3RSYXRlTGltaXRlckdlbmVyYXRvcigpKSgpO1xuICAgICAgICB2YXIgYXBpID0gbmV3IChUZXN0QXBpR2VuZXJhdG9yKCkpKCk7XG4gICAgICAgIHZhciBsb2dnZXIgPSBuZXcgKFRlc3RMb2dnZXJHZW5lcmF0b3IoKSkoKTtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7IHRyYW5zbWl0OiB0cnVlIH07XG4gICAgICAgIHZhciBxdWV1ZSA9IG5ldyBRdWV1ZShyYXRlTGltaXRlciwgYXBpLCBsb2dnZXIsIG9wdGlvbnMpO1xuXG4gICAgICAgIHZhciBpdGVtID0geyBteWtleTogJ215dmFsdWUnIH07XG4gICAgICAgIHZhciBzZXJ2ZXJSZXNwb25zZSA9IHsgc3VjY2VzczogdHJ1ZSB9O1xuXG4gICAgICAgIHJhdGVMaW1pdGVyLmhhbmRsZXIgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgIGV4cGVjdChmYWxzZSkudG8uYmUub2soKTtcbiAgICAgICAgICByZXR1cm4geyBlcnJvcjogbnVsbCwgc2hvdWxkU2VuZDogdHJ1ZSwgcGF5bG9hZDogbnVsbCB9O1xuICAgICAgICB9O1xuICAgICAgICBhcGkuaGFuZGxlciA9IGZ1bmN0aW9uIChpLCBjYikge1xuICAgICAgICAgIGV4cGVjdChmYWxzZSkudG8uYmUub2soKTtcbiAgICAgICAgICBjYihudWxsLCBzZXJ2ZXJSZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBwcmVkaWNhdGVFcnJvciA9ICdib3JrIGJvcmsnO1xuICAgICAgICBxdWV1ZVxuICAgICAgICAgIC5hZGRQcmVkaWNhdGUoZnVuY3Rpb24gKGksIHMpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmFkZFByZWRpY2F0ZShmdW5jdGlvbiAoaSwgcykge1xuICAgICAgICAgICAgcmV0dXJuIHsgZXJyOiBwcmVkaWNhdGVFcnJvciB9O1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmFkZFByZWRpY2F0ZShmdW5jdGlvbiAoaSwgcykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHF1ZXVlLmFkZEl0ZW0oeyBteWtleTogJ215dmFsdWUnIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgICAgICBleHBlY3QoZXJyKS50by5lcWwocHJlZGljYXRlRXJyb3IpO1xuICAgICAgICAgIGV4cGVjdChyZXNwKS50by5ub3QuYmUub2soKTtcbiAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIGNhbGwgd2FpdCBpZiBzZXQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICB2YXIgcmF0ZUxpbWl0ZXIgPSBuZXcgKFRlc3RSYXRlTGltaXRlckdlbmVyYXRvcigpKSgpO1xuICAgICAgICB2YXIgYXBpID0gbmV3IChUZXN0QXBpR2VuZXJhdG9yKCkpKCk7XG4gICAgICAgIHZhciBsb2dnZXIgPSBuZXcgKFRlc3RMb2dnZXJHZW5lcmF0b3IoKSkoKTtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7IHRyYW5zbWl0OiB0cnVlIH07XG4gICAgICAgIHZhciBxdWV1ZSA9IG5ldyBRdWV1ZShyYXRlTGltaXRlciwgYXBpLCBsb2dnZXIsIG9wdGlvbnMpO1xuXG4gICAgICAgIHZhciBpdGVtID0geyBteWtleTogJ215dmFsdWUnIH07XG4gICAgICAgIHZhciBzZXJ2ZXJSZXNwb25zZSA9IHsgc3VjY2VzczogdHJ1ZSB9O1xuXG4gICAgICAgIHJhdGVMaW1pdGVyLmhhbmRsZXIgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgIGV4cGVjdChmYWxzZSkudG8uYmUub2soKTtcbiAgICAgICAgICByZXR1cm4geyBlcnJvcjogbnVsbCwgc2hvdWxkU2VuZDogdHJ1ZSwgcGF5bG9hZDogbnVsbCB9O1xuICAgICAgICB9O1xuICAgICAgICBhcGkuaGFuZGxlciA9IGZ1bmN0aW9uIChpLCBjYikge1xuICAgICAgICAgIGV4cGVjdChmYWxzZSkudG8uYmUub2soKTtcbiAgICAgICAgICBjYihudWxsLCBzZXJ2ZXJSZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICAgIHF1ZXVlLndhaXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHF1ZXVlLmFkZEl0ZW0oeyBteWtleTogJ215dmFsdWUnIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgICAgICBleHBlY3QocmVzcCkudG8uYmUub2soKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdzaG91bGQgd29yayBpZiB3YWl0IGlzIGNhbGxlZCB3aXRoIGEgbm9uLWZ1bmN0aW9uJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgdmFyIHJhdGVMaW1pdGVyID0gbmV3IChUZXN0UmF0ZUxpbWl0ZXJHZW5lcmF0b3IoKSkoKTtcbiAgICAgICAgdmFyIGFwaSA9IG5ldyAoVGVzdEFwaUdlbmVyYXRvcigpKSgpO1xuICAgICAgICB2YXIgbG9nZ2VyID0gbmV3IChUZXN0TG9nZ2VyR2VuZXJhdG9yKCkpKCk7XG4gICAgICAgIHZhciBvcHRpb25zID0geyB0cmFuc21pdDogdHJ1ZSB9O1xuICAgICAgICB2YXIgcXVldWUgPSBuZXcgUXVldWUocmF0ZUxpbWl0ZXIsIGFwaSwgbG9nZ2VyLCBvcHRpb25zKTtcblxuICAgICAgICB2YXIgaXRlbSA9IHsgbXlrZXk6ICdteXZhbHVlJyB9O1xuICAgICAgICB2YXIgc2VydmVyUmVzcG9uc2UgPSB7IHN1Y2Nlc3M6IHRydWUgfTtcblxuICAgICAgICByYXRlTGltaXRlci5oYW5kbGVyID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICByZXR1cm4geyBlcnJvcjogbnVsbCwgc2hvdWxkU2VuZDogdHJ1ZSwgcGF5bG9hZDogbnVsbCB9O1xuICAgICAgICB9O1xuICAgICAgICBhcGkuaGFuZGxlciA9IGZ1bmN0aW9uIChpLCBjYikge1xuICAgICAgICAgIGNiKG51bGwsIHNlcnZlclJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgcXVldWUud2FpdCh7fSk7XG4gICAgICAgIHF1ZXVlLmFkZEl0ZW0oeyBteWtleTogJ215dmFsdWUnIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgICAgICBleHBlY3QocmVzcCkudG8uYmUub2soKTtcbiAgICAgICAgICBkb25lKGVycik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIHdvcmsgaWYgYWxsIHByZWRpY2F0ZXMgcmV0dXJuIHRydWUnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICB2YXIgcmF0ZUxpbWl0ZXIgPSBuZXcgKFRlc3RSYXRlTGltaXRlckdlbmVyYXRvcigpKSgpO1xuICAgICAgICB2YXIgYXBpID0gbmV3IChUZXN0QXBpR2VuZXJhdG9yKCkpKCk7XG4gICAgICAgIHZhciBsb2dnZXIgPSBuZXcgKFRlc3RMb2dnZXJHZW5lcmF0b3IoKSkoKTtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7IHRyYW5zbWl0OiB0cnVlIH07XG4gICAgICAgIHZhciBxdWV1ZSA9IG5ldyBRdWV1ZShyYXRlTGltaXRlciwgYXBpLCBsb2dnZXIsIG9wdGlvbnMpO1xuXG4gICAgICAgIHZhciBpdGVtID0geyBteWtleTogJ215dmFsdWUnIH07XG4gICAgICAgIHZhciBzZXJ2ZXJSZXNwb25zZSA9IHsgc3VjY2VzczogdHJ1ZSB9O1xuXG4gICAgICAgIHJhdGVMaW1pdGVyLmhhbmRsZXIgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgIGV4cGVjdChpKS50by5lcWwoaXRlbSk7XG4gICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IG51bGwsIHNob3VsZFNlbmQ6IHRydWUsIHBheWxvYWQ6IG51bGwgfTtcbiAgICAgICAgfTtcbiAgICAgICAgYXBpLmhhbmRsZXIgPSBmdW5jdGlvbiAoaSwgY2IpIHtcbiAgICAgICAgICBleHBlY3QoaSkudG8uZXFsKGl0ZW0pO1xuICAgICAgICAgIGNiKG51bGwsIHNlcnZlclJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgcXVldWVcbiAgICAgICAgICAuYWRkUHJlZGljYXRlKGZ1bmN0aW9uIChpLCBzKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5hZGRQcmVkaWNhdGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHF1ZXVlLmFkZEl0ZW0oeyBteWtleTogJ215dmFsdWUnIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgICAgICBleHBlY3QocmVzcCkudG8uZXFsKHNlcnZlclJlc3BvbnNlKTtcbiAgICAgICAgICBkb25lKGVycik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgZGVzY3JpYmUoJ2FwaSBmYWlsdXJlJywgZnVuY3Rpb24gKCkge1xuICAgICAgaXQoJ3Nob3VsZCBjYWxsYmFjayBpZiB0aGUgYXBpIHRocm93cyBhbiBleGNlcHRpb24nLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICB2YXIgcmF0ZUxpbWl0ZXIgPSBuZXcgKFRlc3RSYXRlTGltaXRlckdlbmVyYXRvcigpKSgpO1xuICAgICAgICB2YXIgYXBpID0gbmV3IChUZXN0QXBpR2VuZXJhdG9yKCkpKCk7XG4gICAgICAgIHZhciBsb2dnZXIgPSBuZXcgKFRlc3RMb2dnZXJHZW5lcmF0b3IoKSkoKTtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7IHRyYW5zbWl0OiB0cnVlIH07XG4gICAgICAgIHZhciBxdWV1ZSA9IG5ldyBRdWV1ZShyYXRlTGltaXRlciwgYXBpLCBsb2dnZXIsIG9wdGlvbnMpO1xuXG4gICAgICAgIHZhciBpdGVtID0geyBteWtleTogJ215dmFsdWUnIH07XG4gICAgICAgIHZhciBleGNlcHRpb24gPSAnYm9vbSEnO1xuXG4gICAgICAgIHJhdGVMaW1pdGVyLmhhbmRsZXIgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgIGV4cGVjdChpKS50by5lcWwoaXRlbSk7XG4gICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IG51bGwsIHNob3VsZFNlbmQ6IHRydWUsIHBheWxvYWQ6IG51bGwgfTtcbiAgICAgICAgfTtcbiAgICAgICAgYXBpLmhhbmRsZXIgPSBmdW5jdGlvbiAoaSwgY2IpIHtcbiAgICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICAgIH07XG4gICAgICAgIHF1ZXVlXG4gICAgICAgICAgLmFkZFByZWRpY2F0ZShmdW5jdGlvbiAoaSwgcykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuYWRkUHJlZGljYXRlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0pO1xuICAgICAgICBxdWV1ZS5hZGRJdGVtKHsgbXlrZXk6ICdteXZhbHVlJyB9LCBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICAgICAgZXhwZWN0KHJlc3ApLnRvLm5vdC5iZS5vaygpO1xuICAgICAgICAgIGV4cGVjdChlcnIpLnRvLmVxbChleGNlcHRpb24pO1xuICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdzaG91bGQgY2FsbGJhY2sgd2l0aCB0aGUgYXBpIGVycm9yIGlmIG5vdCByZXRyaWFibGUnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICB2YXIgcmF0ZUxpbWl0ZXIgPSBuZXcgKFRlc3RSYXRlTGltaXRlckdlbmVyYXRvcigpKSgpO1xuICAgICAgICB2YXIgYXBpID0gbmV3IChUZXN0QXBpR2VuZXJhdG9yKCkpKCk7XG4gICAgICAgIHZhciBsb2dnZXIgPSBuZXcgKFRlc3RMb2dnZXJHZW5lcmF0b3IoKSkoKTtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7IHJldHJ5SW50ZXJ2YWw6IDEsIHRyYW5zbWl0OiB0cnVlIH07XG4gICAgICAgIHZhciBxdWV1ZSA9IG5ldyBRdWV1ZShyYXRlTGltaXRlciwgYXBpLCBsb2dnZXIsIG9wdGlvbnMpO1xuXG4gICAgICAgIHZhciBpdGVtID0geyBteWtleTogJ215dmFsdWUnIH07XG4gICAgICAgIHZhciBhcGlFcnJvciA9IHsgY29kZTogJ05PUEUnLCBtZXNzYWdlOiAnYm9ya2VkJyB9O1xuXG4gICAgICAgIHJhdGVMaW1pdGVyLmhhbmRsZXIgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgIHJldHVybiB7IGVycm9yOiBudWxsLCBzaG91bGRTZW5kOiB0cnVlLCBwYXlsb2FkOiBudWxsIH07XG4gICAgICAgIH07XG4gICAgICAgIGFwaS5oYW5kbGVyID0gZnVuY3Rpb24gKGksIGNiKSB7XG4gICAgICAgICAgY2IoYXBpRXJyb3IpO1xuICAgICAgICB9O1xuICAgICAgICBxdWV1ZS5hZGRJdGVtKHsgbXlrZXk6ICdteXZhbHVlJyB9LCBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICAgICAgZXhwZWN0KGVycikudG8uZXFsKGFwaUVycm9yKTtcbiAgICAgICAgICBleHBlY3QocmVzcCkudG8ubm90LmJlLm9rKCk7XG4gICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3Nob3VsZCBjYWxsYmFjayB3aXRoIHRoZSBhcGkgZXJyb3IgaWYgbm8gcmV0cnlJbnRlcnZhbCBpcyBzZXQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICB2YXIgcmF0ZUxpbWl0ZXIgPSBuZXcgKFRlc3RSYXRlTGltaXRlckdlbmVyYXRvcigpKSgpO1xuICAgICAgICB2YXIgYXBpID0gbmV3IChUZXN0QXBpR2VuZXJhdG9yKCkpKCk7XG4gICAgICAgIHZhciBsb2dnZXIgPSBuZXcgKFRlc3RMb2dnZXJHZW5lcmF0b3IoKSkoKTtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7IHRyYW5zbWl0OiB0cnVlIH07XG4gICAgICAgIHZhciBxdWV1ZSA9IG5ldyBRdWV1ZShyYXRlTGltaXRlciwgYXBpLCBsb2dnZXIsIG9wdGlvbnMpO1xuXG4gICAgICAgIHZhciBpdGVtID0geyBteWtleTogJ215dmFsdWUnIH07XG4gICAgICAgIHZhciBhcGlFcnJvciA9IHsgY29kZTogJ0VOT1RGT1VORCcsIG1lc3NhZ2U6ICdObyBpbnRlcm5ldCBjb25uZWN0aW9uJyB9O1xuXG4gICAgICAgIHJhdGVMaW1pdGVyLmhhbmRsZXIgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgIHJldHVybiB7IGVycm9yOiBudWxsLCBzaG91bGRTZW5kOiB0cnVlLCBwYXlsb2FkOiBudWxsIH07XG4gICAgICAgIH07XG4gICAgICAgIGFwaS5oYW5kbGVyID0gZnVuY3Rpb24gKGksIGNiKSB7XG4gICAgICAgICAgY2IoYXBpRXJyb3IpO1xuICAgICAgICB9O1xuICAgICAgICBxdWV1ZS5hZGRJdGVtKHsgbXlrZXk6ICdteXZhbHVlJyB9LCBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICAgICAgZXhwZWN0KGVycikudG8uZXFsKGFwaUVycm9yKTtcbiAgICAgICAgICBleHBlY3QocmVzcCkudG8ubm90LmJlLm9rKCk7XG4gICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgZGVzY3JpYmUoJ2lmIHdlIGdldCBhIHJldHJpYWJsZSBlcnJvcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaXQoJ3Nob3VsZCByZXRyeScsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgdmFyIHJhdGVMaW1pdGVyID0gbmV3IChUZXN0UmF0ZUxpbWl0ZXJHZW5lcmF0b3IoKSkoKTtcbiAgICAgICAgICB2YXIgYXBpID0gbmV3IChUZXN0QXBpR2VuZXJhdG9yKCkpKCk7XG4gICAgICAgICAgdmFyIGxvZ2dlciA9IG5ldyAoVGVzdExvZ2dlckdlbmVyYXRvcigpKSgpO1xuICAgICAgICAgIHZhciBvcHRpb25zID0geyByZXRyeUludGVydmFsOiAxLCB0cmFuc21pdDogdHJ1ZSB9O1xuICAgICAgICAgIHZhciBxdWV1ZSA9IG5ldyBRdWV1ZShyYXRlTGltaXRlciwgYXBpLCBsb2dnZXIsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgdmFyIGl0ZW0gPSB7IG15a2V5OiAnbXl2YWx1ZScgfTtcbiAgICAgICAgICB2YXIgc2VydmVyUmVzcG9uc2UgPSB7IHN1Y2Nlc3M6IHRydWUgfTtcbiAgICAgICAgICB2YXIgYXBpRXJyb3IgPSB7XG4gICAgICAgICAgICBjb2RlOiAnRU5PVEZPVU5EJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdObyBpbnRlcm5ldCBjb25uZWN0aW9uJyxcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdmFyIGFwaVJlcXVlc3RDb3VudCA9IDA7XG4gICAgICAgICAgcmF0ZUxpbWl0ZXIuaGFuZGxlciA9IGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICByZXR1cm4geyBlcnJvcjogbnVsbCwgc2hvdWxkU2VuZDogdHJ1ZSwgcGF5bG9hZDogbnVsbCB9O1xuICAgICAgICAgIH07XG4gICAgICAgICAgYXBpLmhhbmRsZXIgPSBmdW5jdGlvbiAoaSwgY2IpIHtcbiAgICAgICAgICAgIGFwaVJlcXVlc3RDb3VudCsrO1xuICAgICAgICAgICAgaWYgKGFwaVJlcXVlc3RDb3VudCA9PT0gMSkge1xuICAgICAgICAgICAgICBjYihhcGlFcnJvcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjYihudWxsLCBzZXJ2ZXJSZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICBxdWV1ZS5hZGRJdGVtKHsgbXlrZXk6ICdteXZhbHVlJyB9LCBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICAgICAgICBleHBlY3QoZXJyKS50by5ub3QuYmUub2soKTtcbiAgICAgICAgICAgIGV4cGVjdChyZXNwKS50by5lcWwoc2VydmVyUmVzcG9uc2UpO1xuICAgICAgICAgICAgZXhwZWN0KGFwaVJlcXVlc3RDb3VudCkudG8uZXFsKDIpO1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ3Nob3VsZCByZXRyeSB1bnRpbCBtYXhSZXRyaWVzIGxpbWl0IGlzIHJlYWNoZWQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgIHZhciByYXRlTGltaXRlciA9IG5ldyAoVGVzdFJhdGVMaW1pdGVyR2VuZXJhdG9yKCkpKCk7XG4gICAgICAgICAgdmFyIGFwaSA9IG5ldyAoVGVzdEFwaUdlbmVyYXRvcigpKSgpO1xuICAgICAgICAgIHZhciBsb2dnZXIgPSBuZXcgKFRlc3RMb2dnZXJHZW5lcmF0b3IoKSkoKTtcbiAgICAgICAgICB2YXIgb3B0aW9ucyA9IHsgcmV0cnlJbnRlcnZhbDogMSwgbWF4UmV0cmllczogMiwgdHJhbnNtaXQ6IHRydWUgfTtcbiAgICAgICAgICB2YXIgcXVldWUgPSBuZXcgUXVldWUocmF0ZUxpbWl0ZXIsIGFwaSwgbG9nZ2VyLCBvcHRpb25zKTtcblxuICAgICAgICAgIHZhciBpdGVtID0geyBteWtleTogJ215dmFsdWUnIH07XG4gICAgICAgICAgdmFyIHNlcnZlclJlc3BvbnNlID0geyBzdWNjZXNzOiB0cnVlIH07XG4gICAgICAgICAgdmFyIGFwaUVycm9yID0ge1xuICAgICAgICAgICAgY29kZTogJ0VOT1RGT1VORCcsXG4gICAgICAgICAgICBtZXNzYWdlOiAnTm8gaW50ZXJuZXQgY29ubmVjdGlvbicsXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHZhciBhcGlSZXF1ZXN0Q291bnQgPSAwO1xuICAgICAgICAgIHJhdGVMaW1pdGVyLmhhbmRsZXIgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IG51bGwsIHNob3VsZFNlbmQ6IHRydWUsIHBheWxvYWQ6IG51bGwgfTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIGFwaS5oYW5kbGVyID0gZnVuY3Rpb24gKGksIGNiKSB7XG4gICAgICAgICAgICBhcGlSZXF1ZXN0Q291bnQrKztcbiAgICAgICAgICAgIGNiKHsgLi4uYXBpRXJyb3IsIHJldHJ5OiBhcGlSZXF1ZXN0Q291bnQgfSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgICBxdWV1ZS5hZGRJdGVtKHsgbXlrZXk6ICdteXZhbHVlJyB9LCBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICAgICAgICB2YXIgbnVtUmVxdWVzdHMgPSBvcHRpb25zLm1heFJldHJpZXMgKyAxO1xuICAgICAgICAgICAgZXhwZWN0KGFwaVJlcXVlc3RDb3VudCkudG8uZXFsKG51bVJlcXVlc3RzKTtcbiAgICAgICAgICAgIGV4cGVjdChlcnIpLnRvLmVxbCh7IC4uLmFwaUVycm9yLCByZXRyeTogbnVtUmVxdWVzdHMgfSk7XG4gICAgICAgICAgICBleHBlY3QocmVzcCkudG8ubm90LmJlLm9rKCk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgZGVzY3JpYmUoJ3RyYW5zbWl0IGRpc2FibGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgaXQoJ3Nob3VsZCBub3QgYXR0ZW1wdCB0byBzZW5kJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgdmFyIHJhdGVMaW1pdGVyID0gbmV3IChUZXN0UmF0ZUxpbWl0ZXJHZW5lcmF0b3IoKSkoKTtcbiAgICAgICAgdmFyIGFwaSA9IG5ldyAoVGVzdEFwaUdlbmVyYXRvcigpKSgpO1xuICAgICAgICB2YXIgbG9nZ2VyID0gbmV3IChUZXN0TG9nZ2VyR2VuZXJhdG9yKCkpKCk7XG4gICAgICAgIHZhciBvcHRpb25zID0geyB0cmFuc21pdDogZmFsc2UgfTtcbiAgICAgICAgdmFyIHF1ZXVlID0gbmV3IFF1ZXVlKHJhdGVMaW1pdGVyLCBhcGksIGxvZ2dlciwgb3B0aW9ucyk7XG4gICAgICAgIHZhciBtYWtlQXBpUmVxdWVzdFN0dWIgPSBzaW5vbi5zdHViKHF1ZXVlLCAnX21ha2VBcGlSZXF1ZXN0Jyk7XG5cbiAgICAgICAgcXVldWUuYWRkSXRlbSh7IG15a2V5OiAnbXl2YWx1ZScgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIGV4cGVjdChlcnIubWVzc2FnZSkudG8uZXFsKCdUcmFuc21pdCBkaXNhYmxlZCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICBleHBlY3QobWFrZUFwaVJlcXVlc3RTdHViLmNhbGxlZCkudG8uZXFsKDApO1xuXG4gICAgICAgIHF1ZXVlLl9tYWtlQXBpUmVxdWVzdC5yZXN0b3JlKCk7XG4gICAgICAgIGRvbmUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoJ3JhdGUgbGltaXRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIGNhbGxiYWNrIGlmIHRoZSByYXRlIGxpbWl0ZXIgc2F5cyBub3QgdG8gc2VuZCBhbmQgaGFzIGFuIGVycm9yJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgIHZhciByYXRlTGltaXRlciA9IG5ldyAoVGVzdFJhdGVMaW1pdGVyR2VuZXJhdG9yKCkpKCk7XG4gICAgICB2YXIgYXBpID0gbmV3IChUZXN0QXBpR2VuZXJhdG9yKCkpKCk7XG4gICAgICB2YXIgbG9nZ2VyID0gbmV3IChUZXN0TG9nZ2VyR2VuZXJhdG9yKCkpKCk7XG4gICAgICB2YXIgb3B0aW9ucyA9IHsgdHJhbnNtaXQ6IHRydWUgfTtcbiAgICAgIHZhciBxdWV1ZSA9IG5ldyBRdWV1ZShyYXRlTGltaXRlciwgYXBpLCBsb2dnZXIsIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgaXRlbSA9IHsgbXlrZXk6ICdteXZhbHVlJyB9O1xuICAgICAgdmFyIHJhdGVMaW1pdEVycm9yID0gJ2JvcmsnO1xuXG4gICAgICByYXRlTGltaXRlci5oYW5kbGVyID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgZXhwZWN0KGkpLnRvLmVxbChpdGVtKTtcbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IHJhdGVMaW1pdEVycm9yLCBzaG91bGRTZW5kOiBmYWxzZSwgcGF5bG9hZDogbnVsbCB9O1xuICAgICAgfTtcbiAgICAgIGFwaS5oYW5kbGVyID0gZnVuY3Rpb24gKGksIGNiKSB7XG4gICAgICAgIGNiKG51bGwsICdHb29kIHRpbWVzJyk7XG4gICAgICB9O1xuICAgICAgcXVldWVcbiAgICAgICAgLmFkZFByZWRpY2F0ZShmdW5jdGlvbiAoaSwgcykge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KVxuICAgICAgICAuYWRkUHJlZGljYXRlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICBxdWV1ZS5hZGRJdGVtKHsgbXlrZXk6ICdteXZhbHVlJyB9LCBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICAgIGV4cGVjdChyZXNwKS50by5ub3QuYmUub2soKTtcbiAgICAgICAgZXhwZWN0KGVycikudG8uZXFsKHJhdGVMaW1pdEVycm9yKTtcbiAgICAgICAgZG9uZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBjYWxsYmFjayBpZiB0aGUgcmF0ZSBsaW1pdGVyIHNheXMgbm90IHRvIHNlbmQgYW5kIGhhcyBhIHBheWxvYWQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgdmFyIHJhdGVMaW1pdGVyID0gbmV3IChUZXN0UmF0ZUxpbWl0ZXJHZW5lcmF0b3IoKSkoKTtcbiAgICAgIHZhciBhcGkgPSBuZXcgKFRlc3RBcGlHZW5lcmF0b3IoKSkoKTtcbiAgICAgIHZhciBsb2dnZXIgPSBuZXcgKFRlc3RMb2dnZXJHZW5lcmF0b3IoKSkoKTtcbiAgICAgIHZhciBvcHRpb25zID0geyB0cmFuc21pdDogdHJ1ZSB9O1xuICAgICAgdmFyIHF1ZXVlID0gbmV3IFF1ZXVlKHJhdGVMaW1pdGVyLCBhcGksIGxvZ2dlciwgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBpdGVtID0geyBteWtleTogJ215dmFsdWUnIH07XG4gICAgICB2YXIgcmF0ZUxpbWl0UGF5bG9hZCA9IHsgc29tZXRoaW5nOiAnd2VudCB3cm9uZycgfTtcbiAgICAgIHZhciBzZXJ2ZXJSZXNwb25zZSA9IHsgbWVzc2FnZTogJ2dvb2QgdGltZXMnIH07XG5cbiAgICAgIHJhdGVMaW1pdGVyLmhhbmRsZXIgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICBleHBlY3QoaSkudG8uZXFsKGl0ZW0pO1xuICAgICAgICByZXR1cm4geyBlcnJvcjogbnVsbCwgc2hvdWxkU2VuZDogZmFsc2UsIHBheWxvYWQ6IHJhdGVMaW1pdFBheWxvYWQgfTtcbiAgICAgIH07XG4gICAgICBhcGkuaGFuZGxlciA9IGZ1bmN0aW9uIChpLCBjYikge1xuICAgICAgICBleHBlY3QoaSkudG8uZXFsKHJhdGVMaW1pdFBheWxvYWQpO1xuICAgICAgICBjYihudWxsLCBzZXJ2ZXJSZXNwb25zZSk7XG4gICAgICB9O1xuICAgICAgcXVldWVcbiAgICAgICAgLmFkZFByZWRpY2F0ZShmdW5jdGlvbiAoaSwgcykge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KVxuICAgICAgICAuYWRkUHJlZGljYXRlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICBxdWV1ZS5hZGRJdGVtKHsgbXlrZXk6ICdteXZhbHVlJyB9LCBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICAgIGV4cGVjdChyZXNwKS50by5lcWwoc2VydmVyUmVzcG9uc2UpO1xuICAgICAgICBleHBlY3QoZXJyKS50by5ub3QuYmUub2soKTtcbiAgICAgICAgZG9uZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXSwibmFtZXMiOlsiaGFzT3duIiwiT2JqZWN0IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJ0b1N0ciIsInRvU3RyaW5nIiwiaXNQbGFpbk9iamVjdCIsIm9iaiIsImNhbGwiLCJoYXNPd25Db25zdHJ1Y3RvciIsImhhc0lzUHJvdG90eXBlT2YiLCJjb25zdHJ1Y3RvciIsImtleSIsIm1lcmdlIiwiaSIsInNyYyIsImNvcHkiLCJjbG9uZSIsIm5hbWUiLCJyZXN1bHQiLCJjdXJyZW50IiwibGVuZ3RoIiwiYXJndW1lbnRzIiwibW9kdWxlIiwiZXhwb3J0cyIsIl9yZWdlbmVyYXRvclJ1bnRpbWUiLCJlIiwidCIsInIiLCJuIiwibyIsImRlZmluZVByb3BlcnR5IiwidmFsdWUiLCJTeW1ib2wiLCJhIiwiaXRlcmF0b3IiLCJjIiwiYXN5bmNJdGVyYXRvciIsInUiLCJ0b1N0cmluZ1RhZyIsImRlZmluZSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsIndyYXAiLCJHZW5lcmF0b3IiLCJjcmVhdGUiLCJDb250ZXh0IiwibWFrZUludm9rZU1ldGhvZCIsInRyeUNhdGNoIiwidHlwZSIsImFyZyIsImgiLCJsIiwiZiIsInMiLCJ5IiwiR2VuZXJhdG9yRnVuY3Rpb24iLCJHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSIsInAiLCJkIiwiZ2V0UHJvdG90eXBlT2YiLCJ2IiwidmFsdWVzIiwiZyIsImRlZmluZUl0ZXJhdG9yTWV0aG9kcyIsImZvckVhY2giLCJfaW52b2tlIiwiQXN5bmNJdGVyYXRvciIsImludm9rZSIsIl90eXBlb2YiLCJyZXNvbHZlIiwiX19hd2FpdCIsInRoZW4iLCJjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyIsIkVycm9yIiwiZG9uZSIsIm1ldGhvZCIsImRlbGVnYXRlIiwibWF5YmVJbnZva2VEZWxlZ2F0ZSIsInNlbnQiLCJfc2VudCIsImRpc3BhdGNoRXhjZXB0aW9uIiwiYWJydXB0IiwiVHlwZUVycm9yIiwicmVzdWx0TmFtZSIsIm5leHQiLCJuZXh0TG9jIiwicHVzaFRyeUVudHJ5IiwidHJ5TG9jIiwiY2F0Y2hMb2MiLCJmaW5hbGx5TG9jIiwiYWZ0ZXJMb2MiLCJ0cnlFbnRyaWVzIiwicHVzaCIsInJlc2V0VHJ5RW50cnkiLCJjb21wbGV0aW9uIiwicmVzZXQiLCJpc05hTiIsImRpc3BsYXlOYW1lIiwiaXNHZW5lcmF0b3JGdW5jdGlvbiIsIm1hcmsiLCJzZXRQcm90b3R5cGVPZiIsIl9fcHJvdG9fXyIsImF3cmFwIiwiYXN5bmMiLCJQcm9taXNlIiwia2V5cyIsInJldmVyc2UiLCJwb3AiLCJwcmV2IiwiY2hhckF0Iiwic2xpY2UiLCJzdG9wIiwicnZhbCIsImhhbmRsZSIsImNvbXBsZXRlIiwiZmluaXNoIiwiX2NhdGNoIiwiZGVsZWdhdGVZaWVsZCIsImFzeW5jR2VuZXJhdG9yU3RlcCIsIl9hc3luY1RvR2VuZXJhdG9yIiwiYXBwbHkiLCJfbmV4dCIsIl90aHJvdyIsIl8iLCJyZXF1aXJlIiwiUXVldWUiLCJyYXRlTGltaXRlciIsImFwaSIsImxvZ2dlciIsIm9wdGlvbnMiLCJyZXBsYXlNYXAiLCJwcmVkaWNhdGVzIiwicGVuZGluZ0l0ZW1zIiwicGVuZGluZ1JlcXVlc3RzIiwicmV0cnlRdWV1ZSIsInJldHJ5SGFuZGxlIiwid2FpdENhbGxiYWNrIiwid2FpdEludGVydmFsSUQiLCJjb25maWd1cmUiLCJvbGRPcHRpb25zIiwiYWRkUHJlZGljYXRlIiwicHJlZGljYXRlIiwiaXNGdW5jdGlvbiIsImFkZFBlbmRpbmdJdGVtIiwiaXRlbSIsInJlbW92ZVBlbmRpbmdJdGVtIiwiaWR4IiwiaW5kZXhPZiIsInNwbGljZSIsImFkZEl0ZW0iLCJjYWxsYmFjayIsIm9yaWdpbmFsRXJyb3IiLCJvcmlnaW5hbEl0ZW0iLCJwcmVkaWNhdGVSZXN1bHQiLCJfYXBwbHlQcmVkaWNhdGVzIiwiZXJyIiwiX21heWJlTG9nIiwidHJhbnNtaXQiLCJib2R5IiwicmVwbGF5SWQiLCJhZGQiLCJ1dWlkIiwiX21ha2VBcGlSZXF1ZXN0IiwicmVzcCIsIl9kZXF1ZXVlUGVuZGluZ1JlcXVlc3QiLCJfaGFuZGxlUmVwbGF5UmVzcG9uc2UiLCJiaW5kIiwid2FpdCIsIl9tYXliZUNhbGxXYWl0IiwiY2xlYXJJbnRlcnZhbCIsInNldEludGVydmFsIiwibGVuIiwidW5kZWZpbmVkIiwicmF0ZUxpbWl0UmVzcG9uc2UiLCJzaG91bGRTZW5kIiwicG9zdEl0ZW0iLCJfbWF5YmVSZXRyeSIsImVycm9yIiwicGF5bG9hZCIsIlJFVFJJQUJMRV9FUlJPUlMiLCJzaG91bGRSZXRyeSIsInJldHJ5SW50ZXJ2YWwiLCJjb2RlIiwiaXNGaW5pdGVOdW1iZXIiLCJtYXhSZXRyaWVzIiwicmV0cmllcyIsIl9yZXRyeUFwaVJlcXVlc3QiLCJyZXRyeU9iamVjdCIsInNoaWZ0IiwiZGF0YSIsInZlcmJvc2UiLCJtZXNzYWdlIiwiZ2V0IiwibG9nIiwiX3JlZiIsIl9jYWxsZWUiLCJyZXNwb25zZSIsIl9jYWxsZWUkIiwiX2NvbnRleHQiLCJjb25zb2xlIiwid2FybiIsInNlbmQiLCJkaXNjYXJkIiwidDAiLCJfeCIsIl94MiIsIlJvbGxiYXJKU09OIiwic2V0dXBKU09OIiwicG9seWZpbGxKU09OIiwic3RyaW5naWZ5IiwicGFyc2UiLCJpc0RlZmluZWQiLCJKU09OIiwiaXNOYXRpdmVGdW5jdGlvbiIsImlzVHlwZSIsIngiLCJ0eXBlTmFtZSIsIm1hdGNoIiwidG9Mb3dlckNhc2UiLCJyZVJlZ0V4cENoYXIiLCJmdW5jTWF0Y2hTdHJpbmciLCJGdW5jdGlvbiIsInJlcGxhY2UiLCJyZUlzTmF0aXZlIiwiUmVnRXhwIiwiaXNPYmplY3QiLCJ0ZXN0IiwiaXNTdHJpbmciLCJTdHJpbmciLCJOdW1iZXIiLCJpc0Zpbml0ZSIsImlzSXRlcmFibGUiLCJpc0Vycm9yIiwiaXNQcm9taXNlIiwiaXNCcm93c2VyIiwid2luZG93IiwicmVkYWN0IiwidXVpZDQiLCJub3ciLCJNYXRoIiwicmFuZG9tIiwiZmxvb3IiLCJMRVZFTFMiLCJkZWJ1ZyIsImluZm8iLCJ3YXJuaW5nIiwiY3JpdGljYWwiLCJzYW5pdGl6ZVVybCIsInVybCIsImJhc2VVcmxQYXJ0cyIsInBhcnNlVXJpIiwiYW5jaG9yIiwic291cmNlIiwicXVlcnkiLCJwYXJzZVVyaU9wdGlvbnMiLCJzdHJpY3RNb2RlIiwicSIsInBhcnNlciIsInN0cmljdCIsImxvb3NlIiwic3RyIiwibSIsImV4ZWMiLCJ1cmkiLCIkMCIsIiQxIiwiJDIiLCJhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aCIsImFjY2Vzc1Rva2VuIiwicGFyYW1zIiwiYWNjZXNzX3Rva2VuIiwicGFyYW1zQXJyYXkiLCJrIiwiam9pbiIsInNvcnQiLCJwYXRoIiwicXMiLCJzdWJzdHJpbmciLCJmb3JtYXRVcmwiLCJwcm90b2NvbCIsInBvcnQiLCJob3N0bmFtZSIsImJhY2t1cCIsImpzb25FcnJvciIsImJhY2t1cEVycm9yIiwibWF4Qnl0ZVNpemUiLCJzdHJpbmciLCJjb3VudCIsImNoYXJDb2RlQXQiLCJqc29uUGFyc2UiLCJtYWtlVW5oYW5kbGVkU3RhY2tJbmZvIiwibGluZW5vIiwiY29sbm8iLCJtb2RlIiwiYmFja3VwTWVzc2FnZSIsImVycm9yUGFyc2VyIiwibG9jYXRpb24iLCJsaW5lIiwiY29sdW1uIiwiZnVuYyIsImd1ZXNzRnVuY3Rpb25OYW1lIiwiY29udGV4dCIsImdhdGhlckNvbnRleHQiLCJocmVmIiwiZG9jdW1lbnQiLCJ1c2VyYWdlbnQiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJzdGFjayIsIndyYXBDYWxsYmFjayIsIm5vbkNpcmN1bGFyQ2xvbmUiLCJzZWVuIiwibmV3U2VlbiIsImluY2x1ZGVzIiwiY3JlYXRlSXRlbSIsImFyZ3MiLCJub3RpZmllciIsInJlcXVlc3RLZXlzIiwibGFtYmRhQ29udGV4dCIsImN1c3RvbSIsInJlcXVlc3QiLCJleHRyYUFyZ3MiLCJkaWFnbm9zdGljIiwiYXJnVHlwZXMiLCJ0eXAiLCJET01FeGNlcHRpb24iLCJqIiwidGltZXN0YW1wIiwic2V0Q3VzdG9tSXRlbUtleXMiLCJfb3JpZ2luYWxBcmdzIiwib3JpZ2luYWxfYXJnX3R5cGVzIiwibGV2ZWwiLCJza2lwRnJhbWVzIiwiYWRkRXJyb3JDb250ZXh0IiwiZXJyb3JzIiwiY29udGV4dEFkZGVkIiwicm9sbGJhckNvbnRleHQiLCJlcnJvcl9jb250ZXh0IiwiVEVMRU1FVFJZX1RZUEVTIiwiVEVMRU1FVFJZX0xFVkVMUyIsImFycmF5SW5jbHVkZXMiLCJhcnIiLCJ2YWwiLCJjcmVhdGVUZWxlbWV0cnlFdmVudCIsIm1ldGFkYXRhIiwiZXZlbnQiLCJhZGRJdGVtQXR0cmlidXRlcyIsImF0dHJpYnV0ZXMiLCJfaXRlbSRkYXRhJGF0dHJpYnV0ZXMiLCJfdG9Db25zdW1hYmxlQXJyYXkiLCJzcGxpdCIsInNldCIsInRlbXAiLCJyZXBsYWNlbWVudCIsImZvcm1hdEFyZ3NBc1N0cmluZyIsInN1YnN0ciIsIkRhdGUiLCJmaWx0ZXJJcCIsInJlcXVlc3REYXRhIiwiY2FwdHVyZUlwIiwibmV3SXAiLCJwYXJ0cyIsImJlZ2lubmluZyIsInNsYXNoSWR4IiwidGVybWluYWwiLCJjb25jYXQiLCJoYW5kbGVPcHRpb25zIiwiaW5wdXQiLCJ1cGRhdGVEZXByZWNhdGVkT3B0aW9ucyIsIm92ZXJ3cml0ZVNjcnViRmllbGRzIiwic2NydWJGaWVsZHMiLCJob3N0V2hpdGVMaXN0IiwiaG9zdFNhZmVMaXN0IiwiaG9zdEJsYWNrTGlzdCIsImhvc3RCbG9ja0xpc3QiXSwic291cmNlUm9vdCI6IiJ9