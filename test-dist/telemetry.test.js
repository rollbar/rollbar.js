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

/***/ "./src/telemetry.js":
/*!**************************!*\
  !*** ./src/telemetry.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");
var MAX_EVENTS = 100;

// Temporary workaround while solving commonjs -> esm issues in Node 18 - 20.
function fromMillis(millis) {
  return [Math.trunc(millis / 1000), Math.round(millis % 1000 * 1e6)];
}
function Telemeter(options, tracing) {
  var _this$tracing;
  this.queue = [];
  this.options = _.merge(options);
  var maxTelemetryEvents = this.options.maxTelemetryEvents || MAX_EVENTS;
  this.maxQueueSize = Math.max(0, Math.min(maxTelemetryEvents, MAX_EVENTS));
  this.tracing = tracing;
  this.telemetrySpan = (_this$tracing = this.tracing) === null || _this$tracing === void 0 ? void 0 : _this$tracing.startSpan('rollbar-telemetry', {});
}
Telemeter.prototype.configure = function (options) {
  var oldOptions = this.options;
  this.options = _.merge(oldOptions, options);
  var maxTelemetryEvents = this.options.maxTelemetryEvents || MAX_EVENTS;
  var newMaxEvents = Math.max(0, Math.min(maxTelemetryEvents, MAX_EVENTS));
  var deleteCount = 0;
  if (this.queue.length > newMaxEvents) {
    deleteCount = this.queue.length - newMaxEvents;
  }
  this.maxQueueSize = newMaxEvents;
  this.queue.splice(0, deleteCount);
};
Telemeter.prototype.copyEvents = function () {
  var events = Array.prototype.slice.call(this.queue, 0);
  if (_.isFunction(this.options.filterTelemetry)) {
    try {
      var i = events.length;
      while (i--) {
        if (this.options.filterTelemetry(events[i])) {
          events.splice(i, 1);
        }
      }
    } catch (e) {
      this.options.filterTelemetry = null;
    }
  }
  return events;
};
Telemeter.prototype.capture = function (type, metadata, level, rollbarUUID, timestamp) {
  var e = {
    level: getLevel(type, level),
    type: type,
    timestamp_ms: timestamp || _.now(),
    body: metadata,
    source: 'client'
  };
  if (rollbarUUID) {
    e.uuid = rollbarUUID;
  }
  try {
    if (_.isFunction(this.options.filterTelemetry) && this.options.filterTelemetry(e)) {
      return false;
    }
  } catch (exc) {
    this.options.filterTelemetry = null;
  }
  this.push(e);
  return e;
};
Telemeter.prototype.captureEvent = function (type, metadata, level, rollbarUUID) {
  return this.capture(type, metadata, level, rollbarUUID);
};
Telemeter.prototype.captureError = function (err, level, rollbarUUID, timestamp) {
  var _this$telemetrySpan;
  var message = err.message || String(err);
  var metadata = {
    message: message
  };
  if (err.stack) {
    metadata.stack = err.stack;
  }
  (_this$telemetrySpan = this.telemetrySpan) === null || _this$telemetrySpan === void 0 || _this$telemetrySpan.addEvent('rollbar-occurrence-event', {
    message: message,
    level: level,
    type: 'error',
    uuid: rollbarUUID,
    'occurrence.type': 'error',
    // deprecated
    'occurrence.uuid': rollbarUUID // deprecated
  }, fromMillis(timestamp));
  return this.capture('error', metadata, level, rollbarUUID, timestamp);
};
Telemeter.prototype.captureLog = function (message, level, rollbarUUID, timestamp) {
  // If the uuid is present, this is a message occurrence.
  if (rollbarUUID) {
    var _this$telemetrySpan2;
    (_this$telemetrySpan2 = this.telemetrySpan) === null || _this$telemetrySpan2 === void 0 || _this$telemetrySpan2.addEvent('rollbar-occurrence-event', {
      message: message,
      level: level,
      type: 'message',
      uuid: rollbarUUID,
      'occurrence.type': 'message',
      // deprecated
      'occurrence.uuid': rollbarUUID // deprecated
    }, fromMillis(timestamp));
  } else {
    var _this$telemetrySpan3;
    (_this$telemetrySpan3 = this.telemetrySpan) === null || _this$telemetrySpan3 === void 0 || _this$telemetrySpan3.addEvent('log-event', {
      message: message,
      level: level
    }, fromMillis(timestamp));
  }
  return this.capture('log', {
    message: message
  }, level, rollbarUUID, timestamp);
};
Telemeter.prototype.captureNetwork = function (metadata, subtype, rollbarUUID, requestData) {
  subtype = subtype || 'xhr';
  metadata.subtype = metadata.subtype || subtype;
  if (requestData) {
    metadata.request = requestData;
  }
  var level = this.levelFromStatus(metadata.status_code);
  return this.capture('network', metadata, level, rollbarUUID);
};
Telemeter.prototype.levelFromStatus = function (statusCode) {
  if (statusCode >= 200 && statusCode < 400) {
    return 'info';
  }
  if (statusCode === 0 || statusCode >= 400) {
    return 'error';
  }
  return 'info';
};
Telemeter.prototype.captureDom = function (subtype, element, value, checked, rollbarUUID) {
  var metadata = {
    subtype: subtype,
    element: element
  };
  if (value !== undefined) {
    metadata.value = value;
  }
  if (checked !== undefined) {
    metadata.checked = checked;
  }
  return this.capture('dom', metadata, 'info', rollbarUUID);
};
Telemeter.prototype.captureNavigation = function (from, to, rollbarUUID, timestamp) {
  var _this$telemetrySpan4;
  (_this$telemetrySpan4 = this.telemetrySpan) === null || _this$telemetrySpan4 === void 0 || _this$telemetrySpan4.addEvent('session-navigation-event', {
    'previous.url.full': from,
    'url.full': to
  }, fromMillis(timestamp));
  return this.capture('navigation', {
    from: from,
    to: to
  }, 'info', rollbarUUID, timestamp);
};
Telemeter.prototype.captureDomContentLoaded = function (ts) {
  return this.capture('navigation', {
    subtype: 'DOMContentLoaded'
  }, 'info', undefined, ts && ts.getTime());
  /**
   * If we decide to make this a dom event instead, then use the line below:
  return this.capture('dom', {subtype: 'DOMContentLoaded'}, 'info', undefined, ts && ts.getTime());
  */
};
Telemeter.prototype.captureLoad = function (ts) {
  return this.capture('navigation', {
    subtype: 'load'
  }, 'info', undefined, ts && ts.getTime());
  /**
   * If we decide to make this a dom event instead, then use the line below:
  return this.capture('dom', {subtype: 'load'}, 'info', undefined, ts && ts.getTime());
  */
};
Telemeter.prototype.captureConnectivityChange = function (type, rollbarUUID) {
  return this.captureNetwork({
    change: type
  }, 'connectivity', rollbarUUID);
};

// Only intended to be used internally by the notifier
Telemeter.prototype._captureRollbarItem = function (item) {
  if (!this.options.includeItemsInTelemetry) {
    return;
  }
  if (item.err) {
    return this.captureError(item.err, item.level, item.uuid, item.timestamp);
  }
  if (item.message) {
    return this.captureLog(item.message, item.level, item.uuid, item.timestamp);
  }
  if (item.custom) {
    return this.capture('log', item.custom, item.level, item.uuid, item.timestamp);
  }
};
Telemeter.prototype.push = function (e) {
  this.queue.push(e);
  if (this.queue.length > this.maxQueueSize) {
    this.queue.shift();
  }
};
function getLevel(type, level) {
  if (level) {
    return level;
  }
  var defaultLevel = {
    error: 'error',
    manual: 'info'
  };
  return defaultLevel[type] || 'info';
}
module.exports = Telemeter;

/***/ }),

/***/ "./src/tracing/context.js":
/*!********************************!*\
  !*** ./src/tracing/context.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Context: () => (/* binding */ Context),
/* harmony export */   ROOT_CONTEXT: () => (/* binding */ ROOT_CONTEXT)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Context = /*#__PURE__*/function () {
  function Context(parentContext) {
    _classCallCheck(this, Context);
    this._currentContext = parentContext ? new Map(parentContext) : new Map();
  }
  return _createClass(Context, [{
    key: "getValue",
    value: function getValue(key) {
      return this._currentContext.get(key);
    }
  }, {
    key: "setValue",
    value: function setValue(key, value) {
      var context = new Context(this._currentContext);
      context._currentContext.set(key, value);
      return context;
    }
  }, {
    key: "deleteValue",
    value: function deleteValue(key) {
      var context = new Context(self._currentContext);
      context._currentContext["delete"](key);
      return context;
    }
  }]);
}();
var ROOT_CONTEXT = new Context();

/***/ }),

/***/ "./src/tracing/contextManager.js":
/*!***************************************!*\
  !*** ./src/tracing/contextManager.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContextManager: () => (/* binding */ ContextManager),
/* harmony export */   createContextKey: () => (/* binding */ createContextKey)
/* harmony export */ });
/* harmony import */ var _context_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./context.js */ "./src/tracing/context.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var ContextManager = /*#__PURE__*/function () {
  function ContextManager() {
    _classCallCheck(this, ContextManager);
    this.currentContext = _context_js__WEBPACK_IMPORTED_MODULE_0__.ROOT_CONTEXT;
  }
  return _createClass(ContextManager, [{
    key: "active",
    value: function active() {
      return this.currentContext;
    }
  }, {
    key: "enterContext",
    value: function enterContext(context) {
      var previousContext = this.currentContext;
      this.currentContext = context || _context_js__WEBPACK_IMPORTED_MODULE_0__.ROOT_CONTEXT;
      return previousContext;
    }
  }, {
    key: "exitContext",
    value: function exitContext(context) {
      this.currentContext = context;
      return this.currentContext;
    }
  }, {
    key: "with",
    value: function _with(context, fn, thisArg) {
      var previousContext = this.enterContext(context);
      try {
        for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
          args[_key - 3] = arguments[_key];
        }
        return fn.call.apply(fn, [thisArg].concat(args));
      } finally {
        this.exitContext(previousContext);
      }
    }
  }]);
}();
function createContextKey(key) {
  // Use Symbol for OpenTelemetry compatibility.
  return Symbol["for"](key);
}

/***/ }),

/***/ "./src/tracing/exporter.js":
/*!*********************************!*\
  !*** ./src/tracing/exporter.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SpanExporter: () => (/* binding */ SpanExporter),
/* harmony export */   spanExportQueue: () => (/* binding */ spanExportQueue)
/* harmony export */ });
/* harmony import */ var _hrtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hrtime */ "./src/tracing/hrtime.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


/**
 * SpanExporter is responsible for exporting ReadableSpan objects
 * and transforming them into the OTLP-compatible format.
 */
var SpanExporter = /*#__PURE__*/function () {
  function SpanExporter() {
    _classCallCheck(this, SpanExporter);
  }
  return _createClass(SpanExporter, [{
    key: "export",
    value:
    /**
     * Export spans to the span export queue
     *
     * @param {Array} spans - Array of ReadableSpan objects to export
     * @param {Function} _resultCallback - Optional callback (not used)
     */
    function _export(spans, _resultCallback) {
      console.log(spans); // console exporter, TODO: make optional
      spanExportQueue.push.apply(spanExportQueue, _toConsumableArray(spans));
    }

    /**
     * Transforms an array of ReadableSpan objects into the OTLP format payload
     * compatible with the Rollbar API. This follows the OpenTelemetry protocol
     * specification for traces.
     *
     * @returns {Object} OTLP format payload for API transmission
     */
  }, {
    key: "toPayload",
    value: function toPayload() {
      var _this = this;
      var spans = spanExportQueue.slice();
      spanExportQueue.length = 0;
      if (!spans || !spans.length) {
        return {
          resourceSpans: []
        };
      }
      var resource = spans[0] && spans[0].resource || {};
      var scopeMap = new Map();
      var _iterator = _createForOfIteratorHelper(spans),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var span = _step.value;
          var scopeKey = span.instrumentationScope ? "".concat(span.instrumentationScope.name, ":").concat(span.instrumentationScope.version) : 'default:1.0.0';
          if (!scopeMap.has(scopeKey)) {
            scopeMap.set(scopeKey, {
              scope: span.instrumentationScope || {
                name: 'default',
                version: '1.0.0',
                attributes: []
              },
              spans: []
            });
          }
          scopeMap.get(scopeKey).spans.push(this._transformSpan(span));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return {
        resourceSpans: [{
          resource: this._transformResource(resource),
          scopeSpans: Array.from(scopeMap.values()).map(function (scopeData) {
            return {
              scope: _this._transformInstrumentationScope(scopeData.scope),
              spans: scopeData.spans
            };
          })
        }]
      };
    }

    /**
     * Transforms a ReadableSpan into the OTLP Span format
     *
     * @private
     * @param {Object} span - ReadableSpan object to transform
     * @returns {Object} OTLP Span format
     */
  }, {
    key: "_transformSpan",
    value: function _transformSpan(span) {
      var _this2 = this;
      var transformAttributes = function transformAttributes(attributes) {
        return Object.entries(attributes || {}).map(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];
          return {
            key: key,
            value: _this2._transformAnyValue(value)
          };
        });
      };
      var transformEvents = function transformEvents(events) {
        return (events || []).map(function (event) {
          return {
            timeUnixNano: _hrtime__WEBPACK_IMPORTED_MODULE_0__["default"].toNanos(event.time),
            name: event.name,
            attributes: transformAttributes(event.attributes)
          };
        });
      };
      return {
        traceId: span.spanContext.traceId,
        spanId: span.spanContext.spanId,
        parentSpanId: span.parentSpanId || '',
        name: span.name,
        kind: span.kind || 1,
        // INTERNAL by default
        startTimeUnixNano: _hrtime__WEBPACK_IMPORTED_MODULE_0__["default"].toNanos(span.startTime),
        endTimeUnixNano: _hrtime__WEBPACK_IMPORTED_MODULE_0__["default"].toNanos(span.endTime),
        attributes: transformAttributes(span.attributes),
        events: transformEvents(span.events)
      };
    }

    /**
     * Transforms a resource object into OTLP Resource format
     *
     * @private
     * @param {Object} resource - Resource information
     * @returns {Object} OTLP Resource format
     */
  }, {
    key: "_transformResource",
    value: function _transformResource(resource) {
      var _this3 = this;
      var attributes = resource.attributes || {};
      var keyValues = Object.entries(attributes).map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
          key = _ref4[0],
          value = _ref4[1];
        return {
          key: key,
          value: _this3._transformAnyValue(value)
        };
      });
      return {
        attributes: keyValues
      };
    }

    /**
     * Transforms an instrumentation scope into OTLP InstrumentationScope format
     *
     * @private
     * @param {Object} scope - Instrumentation scope information
     * @returns {Object} OTLP InstrumentationScope format
     */
  }, {
    key: "_transformInstrumentationScope",
    value: function _transformInstrumentationScope(scope) {
      var _this4 = this;
      return {
        name: scope.name || '',
        version: scope.version || '',
        attributes: (scope.attributes || []).map(function (attr) {
          return {
            key: attr.key,
            value: _this4._transformAnyValue(attr.value)
          };
        })
      };
    }

    /**
     * Transforms a JavaScript value into an OTLP AnyValue
     *
     * @private
     * @param {any} value - Value to transform
     * @returns {Object} OTLP AnyValue format
     */
  }, {
    key: "_transformAnyValue",
    value: function _transformAnyValue(value) {
      var _this5 = this;
      if (value === null || value === undefined) {
        return {
          stringValue: ''
        };
      }
      var type = _typeof(value);
      if (type === 'string') {
        return {
          stringValue: value
        };
      } else if (type === 'number') {
        if (Number.isInteger(value)) {
          return {
            intValue: value.toString()
          };
        } else {
          return {
            doubleValue: value
          };
        }
      } else if (type === 'boolean') {
        return {
          boolValue: value
        };
      } else if (Array.isArray(value)) {
        return {
          arrayValue: {
            values: value.map(function (v) {
              return _this5._transformAnyValue(v);
            })
          }
        };
      } else if (type === 'object') {
        return {
          kvlistValue: {
            values: Object.entries(value).map(function (_ref5) {
              var _ref6 = _slicedToArray(_ref5, 2),
                k = _ref6[0],
                v = _ref6[1];
              return {
                key: k,
                value: _this5._transformAnyValue(v)
              };
            })
          }
        };
      }
      return {
        stringValue: String(value)
      };
    }
  }]);
}();
var spanExportQueue = [];

/***/ }),

/***/ "./src/tracing/hrtime.js":
/*!*******************************!*\
  !*** ./src/tracing/hrtime.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * @module hrtime
 *
 * @description Methods for handling OpenTelemetry hrtime.
 */

/**
 * Convert a duration in milliseconds to an OpenTelemetry hrtime tuple.
 *
 * @param {number} millis - The duration in milliseconds.
 * @returns {[number, number]} An array where the first element is seconds
 *   and the second is nanoseconds.
 */
function fromMillis(millis) {
  return [Math.trunc(millis / 1000), Math.round(millis % 1000 * 1e6)];
}

/**
 * Convert an OpenTelemetry hrtime tuple back to a duration in milliseconds.
 *
 * @param {[number, number]} hrtime - The hrtime tuple [seconds, nanoseconds].
 * @returns {number} The total duration in milliseconds.
 */
function toMillis(hrtime) {
  return hrtime[0] * 1e3 + Math.round(hrtime[1] / 1e6);
}

/**
 * Convert an OpenTelemetry hrtime tuple back to a duration in nanoseconds.
 *
 * @param {[number, number]} hrtime - The hrtime tuple [seconds, nanoseconds].
 * @returns {number} The total duration in nanoseconds.
 */
function toNanos(hrtime) {
  return hrtime[0] * 1e9 + hrtime[1];
}

/**
 * Adds two OpenTelemetry hrtime tuples.
 *
 * @param {[number, number]} a - The first hrtime tuple [s, ns].
 * @param {[number, number]} b - The second hrtime tuple [s, ns].
 * @returns {[number, number]} Summed hrtime tuple, normalized.
 *
 */
function add(a, b) {
  return [a[0] + b[0] + Math.trunc((a[1] + b[1]) / 1e9), (a[1] + b[1]) % 1e9];
}

/**
 * Get the current high-resolution time as an OpenTelemetry hrtime tuple.
 *
 * Uses the Performance API (timeOrigin + now()).
 *
 * @returns {[number, number]} The current hrtime tuple [s, ns].
 */
function now() {
  return add(fromMillis(performance.timeOrigin), fromMillis(performance.now()));
}

/**
 * Check if a value is a valid OpenTelemetry hrtime tuple.
 *
 * An hrtime tuple is an Array of exactly two numbers:
 *   [seconds, nanoseconds]
 *
 * @param {*} value – anything to test
 * @returns {boolean} true if `value` is a [number, number] array of length 2
 *
 * @example
 * isHrTime([ 1, 500 ]);         // true
 * isHrTime([ 0, 1e9 ]);         // true
 * isHrTime([ '1', 500 ]);       // false
 * isHrTime({ 0: 1, 1: 500 });   // false
 */
function isHrTime(value) {
  return Array.isArray(value) && value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number';
}

/**
 * Methods for handling hrtime. OpenTelemetry uses the [seconds, nanoseconds]
 * format for hrtime in the `ReadableSpan` interface.
 *
 * @example
 * import hrtime from '@tracing/hrtime.js';
 *
 * hrtime.fromMillis(1000);
 * hrtime.toMillis([0, 1000]);
 * hrtime.add([0, 0], [0, 1000]);
 * hrtime.now();
 * hrtime.isHrTime([0, 1000]);
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  fromMillis: fromMillis,
  toMillis: toMillis,
  toNanos: toNanos,
  add: add,
  now: now,
  isHrTime: isHrTime
});

/***/ }),

/***/ "./src/tracing/id.js":
/*!***************************!*\
  !*** ./src/tracing/id.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Generate a random hexadecimal ID of specified byte length
 *
 * @param {number} bytes - Number of bytes for the ID (default: 16)
 * @returns {string} - Hexadecimal string representation
 */
function gen() {
  var bytes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
  var randomBytes = new Uint8Array(bytes);
  crypto.getRandomValues(randomBytes);
  var randHex = Array.from(randomBytes, function (_byte) {
    return _byte.toString(16).padStart(2, '0');
  }).join('');
  return randHex;
}

/**
 * Tracing id generation utils
 *
 * @example
 * import id from './id.js';
 *
 * const spanId = id.gen(8); // => "a1b2c3d4e5f6..."
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  gen: gen
});

/***/ }),

/***/ "./src/tracing/session.js":
/*!********************************!*\
  !*** ./src/tracing/session.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Session: () => (/* binding */ Session)
/* harmony export */ });
/* harmony import */ var _id_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./id.js */ "./src/tracing/id.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var SESSION_KEY = 'RollbarSession';
var Session = /*#__PURE__*/function () {
  function Session(tracing, options) {
    _classCallCheck(this, Session);
    this.options = options;
    this.tracing = tracing;
    this.window = tracing.window;
    this.session = null;
  }
  return _createClass(Session, [{
    key: "init",
    value: function init() {
      if (this.session) {
        return this;
      }
      return this.getSession() || this.createSession();
    }
  }, {
    key: "getSession",
    value: function getSession() {
      try {
        var serializedSession = this.window.sessionStorage.getItem(SESSION_KEY);
        if (!serializedSession) {
          return null;
        }
        this.session = JSON.parse(serializedSession);
      } catch (_unused) {
        return null;
      }
      return this;
    }
  }, {
    key: "createSession",
    value: function createSession() {
      this.session = {
        id: _id_js__WEBPACK_IMPORTED_MODULE_0__["default"].gen(),
        createdAt: Date.now()
      };
      return this.setSession(this.session);
    }
  }, {
    key: "setSession",
    value: function setSession(session) {
      var sessionString = JSON.stringify(session);
      try {
        this.window.sessionStorage.setItem(SESSION_KEY, sessionString);
      } catch (_unused2) {
        return null;
      }
      return this;
    }
  }]);
}();

/***/ }),

/***/ "./src/tracing/span.js":
/*!*****************************!*\
  !*** ./src/tracing/span.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Span: () => (/* binding */ Span)
/* harmony export */ });
/* harmony import */ var _hrtime_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hrtime.js */ "./src/tracing/hrtime.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var Span = /*#__PURE__*/function () {
  function Span(options) {
    _classCallCheck(this, Span);
    this.initReadableSpan(options);
    this.spanProcessor = options.spanProcessor;
    this.spanProcessor.onStart(this, options.context);
    if (options.attributes) {
      this.setAttributes(options.attributes);
    }
    return this;
  }
  return _createClass(Span, [{
    key: "initReadableSpan",
    value: function initReadableSpan(options) {
      this.span = {
        name: options.name,
        kind: options.kind,
        spanContext: options.spanContext,
        parentSpanId: options.parentSpanId,
        startTime: options.startTime || _hrtime_js__WEBPACK_IMPORTED_MODULE_0__["default"].now(),
        endTime: [0, 0],
        status: {
          code: 0,
          message: ''
        },
        attributes: {
          'session.id': options.session.id
        },
        links: [],
        events: [],
        duration: 0,
        ended: false,
        resource: options.resource,
        instrumentationScope: options.scope,
        droppedAttributesCount: 0,
        droppedEventsCount: 0,
        droppedLinksCount: 0
      };
    }
  }, {
    key: "spanContext",
    value: function spanContext() {
      return this.span.spanContext;
    }
  }, {
    key: "spanId",
    get: function get() {
      return this.span.spanContext.spanId;
    }
  }, {
    key: "traceId",
    get: function get() {
      return this.span.spanContext.traceId;
    }
  }, {
    key: "setAttribute",
    value: function setAttribute(key, value) {
      if (value == null || this.ended) return this;
      if (key.length === 0) return this;
      this.span.attributes[key] = value;
      return this;
    }
  }, {
    key: "setAttributes",
    value: function setAttributes(attributes) {
      for (var _i = 0, _Object$entries = Object.entries(attributes); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          k = _Object$entries$_i[0],
          v = _Object$entries$_i[1];
        this.setAttribute(k, v);
      }
      return this;
    }
  }, {
    key: "addEvent",
    value: function addEvent(name) {
      var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var time = arguments.length > 2 ? arguments[2] : undefined;
      if (this.span.ended) return this;
      this.span.events.push({
        name: name,
        attributes: attributes,
        time: time || _hrtime_js__WEBPACK_IMPORTED_MODULE_0__["default"].now(),
        droppedAttributesCount: 0
      });
      return this;
    }
  }, {
    key: "isRecording",
    value: function isRecording() {
      return this.span.ended === false;
    }
  }, {
    key: "end",
    value: function end(attributes, time) {
      if (attributes) this.setAttributes(attributes);
      this.span.endTime = time || _hrtime_js__WEBPACK_IMPORTED_MODULE_0__["default"].now();
      this.span.ended = true;
      this.spanProcessor.onEnd(this);
    }
  }, {
    key: "export",
    value: function _export() {
      return this.span;
    }
  }]);
}();

/***/ }),

/***/ "./src/tracing/spanProcessor.js":
/*!**************************************!*\
  !*** ./src/tracing/spanProcessor.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SpanProcessor: () => (/* binding */ SpanProcessor)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var SpanProcessor = /*#__PURE__*/function () {
  function SpanProcessor(exporter) {
    _classCallCheck(this, SpanProcessor);
    this.exporter = exporter;
    this.pendingSpans = new Map();
  }
  return _createClass(SpanProcessor, [{
    key: "onStart",
    value: function onStart(span, _parentContext) {
      this.pendingSpans.set(span.span.spanContext.spanId, span);
    }
  }, {
    key: "onEnd",
    value: function onEnd(span) {
      this.exporter["export"]([span["export"]()]);
      this.pendingSpans["delete"](span.span.spanContext.spanId);
    }
  }]);
}();

/***/ }),

/***/ "./src/tracing/tracer.js":
/*!*******************************!*\
  !*** ./src/tracing/tracer.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Tracer: () => (/* binding */ Tracer)
/* harmony export */ });
/* harmony import */ var _span_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./span.js */ "./src/tracing/span.js");
/* harmony import */ var _id_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./id.js */ "./src/tracing/id.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var Tracer = /*#__PURE__*/function () {
  function Tracer(tracing, spanProcessor) {
    _classCallCheck(this, Tracer);
    this.spanProcessor = spanProcessor;
    this.tracing = tracing;
  }
  return _createClass(Tracer, [{
    key: "startSpan",
    value: function startSpan(name) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.tracing.contextManager.active();
      var parentSpan = this.tracing.getSpan(context);
      var parentSpanContext = parentSpan === null || parentSpan === void 0 ? void 0 : parentSpan.spanContext();
      var spanId = _id_js__WEBPACK_IMPORTED_MODULE_1__["default"].gen(8);
      var traceId;
      var traceFlags = 0;
      var traceState = null;
      var parentSpanId;
      if (parentSpanContext) {
        traceId = parentSpanContext.traceId;
        traceState = parentSpanContext.traceState;
        parentSpanId = parentSpanContext.spanId;
      } else {
        traceId = _id_js__WEBPACK_IMPORTED_MODULE_1__["default"].gen(16);
      }
      var kind = 0;
      var spanContext = {
        traceId: traceId,
        spanId: spanId,
        traceFlags: traceFlags,
        traceState: traceState
      };
      var span = new _span_js__WEBPACK_IMPORTED_MODULE_0__.Span({
        resource: this.tracing.resource,
        scope: this.tracing.scope,
        session: this.tracing.session.session,
        context: context,
        spanContext: spanContext,
        name: name,
        kind: kind,
        parentSpanId: parentSpanId,
        spanProcessor: this.spanProcessor
      });
      return span;
    }
  }]);
}();

/***/ }),

/***/ "./src/tracing/tracing.js":
/*!********************************!*\
  !*** ./src/tracing/tracing.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Tracing)
/* harmony export */ });
/* harmony import */ var _contextManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./contextManager.js */ "./src/tracing/contextManager.js");
/* harmony import */ var _session_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./session.js */ "./src/tracing/session.js");
/* harmony import */ var _exporter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./exporter.js */ "./src/tracing/exporter.js");
/* harmony import */ var _spanProcessor_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./spanProcessor.js */ "./src/tracing/spanProcessor.js");
/* harmony import */ var _tracer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./tracer.js */ "./src/tracing/tracer.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }





var SPAN_KEY = (0,_contextManager_js__WEBPACK_IMPORTED_MODULE_0__.createContextKey)('Rollbar Context Key SPAN');
var Tracing = /*#__PURE__*/function () {
  function Tracing(gWindow, options) {
    _classCallCheck(this, Tracing);
    this.options = options;
    this.window = gWindow;
    this.session = new _session_js__WEBPACK_IMPORTED_MODULE_1__.Session(this, options);
    this.createTracer();
  }
  return _createClass(Tracing, [{
    key: "initSession",
    value: function initSession() {
      if (this.session) {
        this.session.init();
      }
    }
  }, {
    key: "sessionId",
    get: function get() {
      if (this.session) {
        return this.session.session.id;
      }
      return null;
    }
  }, {
    key: "resource",
    get: function get() {
      var _this$options$payload, _this$options$payload2;
      return {
        attributes: _objectSpread(_objectSpread({}, this.options.resource || {}), {}, {
          'rollbar.environment': (_this$options$payload = (_this$options$payload2 = this.options.payload) === null || _this$options$payload2 === void 0 ? void 0 : _this$options$payload2.environment) !== null && _this$options$payload !== void 0 ? _this$options$payload : this.options.environment
        })
      };
    }
  }, {
    key: "scope",
    get: function get() {
      return {
        name: 'rollbar-browser-js',
        version: this.options.version
      };
    }
  }, {
    key: "createTracer",
    value: function createTracer() {
      this.contextManager = new _contextManager_js__WEBPACK_IMPORTED_MODULE_0__.ContextManager();
      this.exporter = new _exporter_js__WEBPACK_IMPORTED_MODULE_2__.SpanExporter();
      this.spanProcessor = new _spanProcessor_js__WEBPACK_IMPORTED_MODULE_3__.SpanProcessor(this.exporter);
      this.tracer = new _tracer_js__WEBPACK_IMPORTED_MODULE_4__.Tracer(this, this.spanProcessor);
    }
  }, {
    key: "getTracer",
    value: function getTracer() {
      return this.tracer;
    }
  }, {
    key: "getSpan",
    value: function getSpan() {
      var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.contextManager.active();
      return context.getValue(SPAN_KEY);
    }
  }, {
    key: "setSpan",
    value: function setSpan() {
      var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.contextManager.active();
      var span = arguments.length > 1 ? arguments[1] : undefined;
      return context.setValue(SPAN_KEY, span);
    }
  }, {
    key: "startSpan",
    value: function startSpan(name) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.contextManager.active();
      return this.tracer.startSpan(name, options, context);
    }
  }, {
    key: "with",
    value: function _with(context, fn, thisArg) {
      var _this$contextManager;
      for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        args[_key - 3] = arguments[_key];
      }
      return (_this$contextManager = this.contextManager)["with"].apply(_this$contextManager, [context, fn, thisArg].concat(args));
    }
  }, {
    key: "withSpan",
    value: function withSpan(name, options, fn, thisArg) {
      var span = this.startSpan(name, options);
      return this["with"](this.setSpan(this.contextManager.active(), span), fn, thisArg, span);
    }
  }]);
}();


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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!********************************!*\
  !*** ./test/telemetry.test.js ***!
  \********************************/
/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

const Telemeter = __webpack_require__(/*! ../src/telemetry */ "./src/telemetry.js");
const Tracing = (__webpack_require__(/*! ../src/tracing/tracing */ "./src/tracing/tracing.js")["default"]);

describe('Telemetry()', function () {
  it('should have all of the expected methods', function (done) {
    var options = {};
    var t = new Telemeter(options);
    expect(t).to.have.property('copyEvents');
    expect(t).to.have.property('capture');
    expect(t).to.have.property('captureLog');
    expect(t).to.have.property('captureError');
    expect(t).to.have.property('captureNetwork');
    expect(t).to.have.property('captureEvent');

    done();
  });
});

describe('capture', function () {
  it('should return a valid telemetry event', function (done) {
    var options = {};
    var t = new Telemeter(options);
    var now = +new Date();
    var event = t.capture('network', { url: 'a.com' }, 'debug');
    expect(event.timestamp_ms - now).to.be.below(500);
    expect(event.type).to.equal('network');
    expect(event.level).to.equal('debug');
    expect(event.body.url).to.equal('a.com');

    done();
  });
});

describe('captureEvent', function () {
  it('should return a valid telemetry event', function (done) {
    var t = new Telemeter();
    var event = t.captureEvent('log', { message: 'bar' }, 'info');
    expect(event.type).to.equal('log');
    expect(event.level).to.equal('info');
    expect(event.body.message).to.equal('bar');

    done();
  });
});

describe('capture events', function () {
  beforeEach(function () {
    const tracing = new Tracing(
      window,
      {
        resource: {
          'service.name': 'Test',
        },
      }
    );
    tracing.initSession();
    this.t = new Telemeter({includeItemsInTelemetry: true}, tracing);
  });

  it('should return a valid log event', function (done) {
    const timestamp = 12345.678;
    const event = this.t.captureLog('foo', 'info', null, timestamp);
    expect(event.type).to.equal('log');
    expect(event.level).to.equal('info');
    expect(event.body.message).to.equal('foo');
    expect(event.timestamp_ms).to.equal(timestamp);

    expect(this.t.telemetrySpan).to.be.an('object');
    const otelEvent = this.t.telemetrySpan.span.events[0];
    expect(otelEvent.name).to.equal('log-event');
    expect(otelEvent.time).to.eql([ 12, 345678000 ]);
    expect(otelEvent.attributes).to.eql({ message: 'foo', level: 'info' });
    done();
  });

  it('should return a valid error event', function (done) {
    const timestamp = 12345.678;
    const error = new Error('foo');
    const uuid = '12345-67890';
    const event = this.t.captureError(error, 'info', uuid, timestamp);
    expect(event.type).to.eql('error');
    expect(event.level).to.equal('info');
    expect(event.body.message).to.equal('foo');
    expect(event.timestamp_ms).to.equal(timestamp);

    expect(this.t.telemetrySpan).to.be.an('object');
    const otelEvent = this.t.telemetrySpan.span.events[0];
    expect(otelEvent.name).to.eql('rollbar-occurrence-event');
    expect(otelEvent.time).to.eql([ 12, 345678000 ]);
    expect(otelEvent.attributes).to.eql(
      { type: 'error', 'occurrence.type': 'error', message: 'foo', level: 'info', uuid: uuid, 'occurrence.uuid': uuid }
    );
    done();
  });

  it('should return a valid message event', function (done) {
    const timestamp = 12345.678;
    const uuid = '12345-67890';
    const item = { message: 'foo', level: 'info', uuid: uuid, timestamp: timestamp };
    const event = this.t._captureRollbarItem(item);
    expect(event.type).to.eql('log');
    expect(event.level).to.equal('info');
    expect(event.body.message).to.equal('foo');
    expect(event.timestamp_ms).to.equal(timestamp);

    expect(this.t.telemetrySpan).to.be.an('object');
    const otelEvent = this.t.telemetrySpan.span.events[0];
    expect(otelEvent.name).to.eql('rollbar-occurrence-event');
    expect(otelEvent.time).to.eql([ 12, 345678000 ]);
    expect(otelEvent.attributes).to.eql(
      { type: 'message', 'occurrence.type': 'message', message: 'foo', level: 'info', uuid: uuid, 'occurrence.uuid': uuid }
    );
    done();
  });

  it('should return a valid navigation event', function (done) {
    const timestamp = 12345.678;
    const from = 'foo';
    const to = 'bar';
    const event = this.t.captureNavigation(from, to, null, timestamp);
    expect(event.type).to.equal('navigation');
    expect(event.level).to.equal('info');
    expect(event.body.from).to.equal('foo');
    expect(event.body.to).to.equal('bar');
    expect(event.timestamp_ms).to.equal(timestamp);

    expect(this.t.telemetrySpan).to.be.an('object');
    const otelEvent = this.t.telemetrySpan.span.events[0];
    expect(otelEvent.name).to.equal('session-navigation-event');
    expect(otelEvent.time).to.eql([ 12, 345678000 ]);
    expect(otelEvent.attributes).to.eql({ 'previous.url.full': 'foo', 'url.full': 'bar' });
    done();
  });
});

describe('filterTelemetry', function () {
  it("should filter out events that don't match the test", function (done) {
    var options = {
      filterTelemetry: function (e) {
        return (
          e.type === 'network' &&
          (e.body.subtype === 'xhr' || e.body.subtype === 'fetch') &&
          e.body.url.indexOf('https://spammer.com') === 0
        );
      },
    };
    var t = new Telemeter(options);
    var evt = t.capture(
      'network',
      { url: 'https://spammer.com', subtype: 'xhr' },
      'debug',
    );
    expect(evt).to.be(false);

    done();
  });

  it('should filter out events in copy even if they are modified after capture', function (done) {
    var options = {
      filterTelemetry: function (e) {
        return e.type === 'network' && e.body.statusCode === 200;
      },
    };
    var t = new Telemeter(options);
    var evt = t.capture('network', { url: 'https://spammer.com' }, 'debug');
    var evt2 = t.capture(
      'network',
      { url: 'https://spammer.com', statusCode: 404 },
      'debug',
    );
    expect(evt).not.to.be(false);
    expect(evt2).not.to.be(false);
    var events = t.copyEvents();
    expect(events.length).to.equal(2);

    evt.body.statusCode = 200;

    events = t.copyEvents();
    expect(events.length).to.equal(1);
    expect(events[0].body.statusCode).to.equal(404);

    done();
  });
});

describe('configure', function () {
  it('should truncate events to new max', function (done) {
    var options = { maxTelemetryEvents: 5 };
    var t = new Telemeter(options);

    for (var i = 0; i < 7; i++) {
      t.capture('network', { url: 'a.com' }, 'debug');
    }

    expect(t.queue.length).to.equal(5);
    t.configure({ maxTelemetryEvents: 3 });
    expect(t.queue.length).to.equal(3);
    done();
  });
  it('should lengthen events to allow new max', function (done) {
    var options = { maxTelemetryEvents: 3 };
    var t = new Telemeter(options);

    for (var i = 0; i < 7; i++) {
      t.capture('network', { url: 'a.com' }, 'debug');
    }

    expect(t.queue.length).to.equal(3);
    t.configure({ maxTelemetryEvents: 5 });
    expect(t.queue.length).to.equal(3);
    for (var i = 0; i < 7; i++) {
      t.capture('network', { url: 'a.com' }, 'debug');
    }
    expect(t.queue.length).to.equal(5);
    done();
  });
  it('does not drop existing options that are not passed to configure', function (done) {
    var options = { maxTelemetryEvents: 3 };
    var t = new Telemeter(options);

    for (var i = 0; i < 7; i++) {
      t.capture('network', { url: 'a.com' }, 'debug');
    }

    expect(t.queue.length).to.equal(3);
    t.configure({});
    expect(t.queue.length).to.equal(3);
    for (var i = 0; i < 7; i++) {
      t.capture('network', { url: 'a.com' }, 'debug');
    }
    expect(t.queue.length).to.equal(3);
    done();
  });
});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNILENBQUM7O0FBRUQ7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjs7QUFFQSxvQkFBb0IsT0FBTztBQUMzQiw2QkFBNkIsY0FBYztBQUMzQzs7QUFFQTtBQUNBLGtCQUFrQix1QkFBdUI7QUFDekM7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLG9CQUFvQjtBQUNwQjs7QUFFQSxvQkFBb0IsT0FBTztBQUMzQiw2QkFBNkIsY0FBYztBQUMzQzs7QUFFQTtBQUNBLGtCQUFrQix1QkFBdUI7QUFDekM7QUFDQSxvQkFBb0IsT0FBTztBQUMzQiw2QkFBNkIsY0FBYztBQUMzQztBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxvQkFBb0I7QUFDcEI7O0FBRUEsb0JBQW9CLE9BQU87QUFDM0IsNkJBQTZCLGNBQWM7QUFDM0M7O0FBRUE7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQSxvQkFBb0IsT0FBTztBQUMzQiw2QkFBNkIsY0FBYztBQUMzQztBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3JvbGxiYXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvbWVyZ2UuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy90ZWxlbWV0cnkuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy90cmFjaW5nL2NvbnRleHQuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy90cmFjaW5nL2NvbnRleHRNYW5hZ2VyLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvdHJhY2luZy9leHBvcnRlci5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3RyYWNpbmcvaHJ0aW1lLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvdHJhY2luZy9pZC5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3RyYWNpbmcvc2Vzc2lvbi5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3RyYWNpbmcvc3Bhbi5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3RyYWNpbmcvc3BhblByb2Nlc3Nvci5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3RyYWNpbmcvdHJhY2VyLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvdHJhY2luZy90cmFjaW5nLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvdXRpbGl0eS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3JvbGxiYXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3JvbGxiYXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3Rlc3QvdGVsZW1ldHJ5LnRlc3QuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKHNlbGYsICgpID0+IHtcbnJldHVybiAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxudmFyIGlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iaikge1xuICBpZiAoIW9iaiB8fCB0b1N0ci5jYWxsKG9iaikgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGhhc093bkNvbnN0cnVjdG9yID0gaGFzT3duLmNhbGwob2JqLCAnY29uc3RydWN0b3InKTtcbiAgdmFyIGhhc0lzUHJvdG90eXBlT2YgPVxuICAgIG9iai5jb25zdHJ1Y3RvciAmJlxuICAgIG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgJiZcbiAgICBoYXNPd24uY2FsbChvYmouY29uc3RydWN0b3IucHJvdG90eXBlLCAnaXNQcm90b3R5cGVPZicpO1xuICAvLyBOb3Qgb3duIGNvbnN0cnVjdG9yIHByb3BlcnR5IG11c3QgYmUgT2JqZWN0XG4gIGlmIChvYmouY29uc3RydWN0b3IgJiYgIWhhc093bkNvbnN0cnVjdG9yICYmICFoYXNJc1Byb3RvdHlwZU9mKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gT3duIHByb3BlcnRpZXMgYXJlIGVudW1lcmF0ZWQgZmlyc3RseSwgc28gdG8gc3BlZWQgdXAsXG4gIC8vIGlmIGxhc3Qgb25lIGlzIG93biwgdGhlbiBhbGwgcHJvcGVydGllcyBhcmUgb3duLlxuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAvKiovXG4gIH1cblxuICByZXR1cm4gdHlwZW9mIGtleSA9PT0gJ3VuZGVmaW5lZCcgfHwgaGFzT3duLmNhbGwob2JqLCBrZXkpO1xufTtcblxuZnVuY3Rpb24gbWVyZ2UoKSB7XG4gIHZhciBpLFxuICAgIHNyYyxcbiAgICBjb3B5LFxuICAgIGNsb25lLFxuICAgIG5hbWUsXG4gICAgcmVzdWx0ID0ge30sXG4gICAgY3VycmVudCA9IG51bGwsXG4gICAgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcblxuICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBjdXJyZW50ID0gYXJndW1lbnRzW2ldO1xuICAgIGlmIChjdXJyZW50ID09IG51bGwpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGZvciAobmFtZSBpbiBjdXJyZW50KSB7XG4gICAgICBzcmMgPSByZXN1bHRbbmFtZV07XG4gICAgICBjb3B5ID0gY3VycmVudFtuYW1lXTtcbiAgICAgIGlmIChyZXN1bHQgIT09IGNvcHkpIHtcbiAgICAgICAgaWYgKGNvcHkgJiYgaXNQbGFpbk9iamVjdChjb3B5KSkge1xuICAgICAgICAgIGNsb25lID0gc3JjICYmIGlzUGxhaW5PYmplY3Qoc3JjKSA/IHNyYyA6IHt9O1xuICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IG1lcmdlKGNsb25lLCBjb3B5KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY29weSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZXN1bHRbbmFtZV0gPSBjb3B5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWVyZ2U7XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbGl0eScpO1xuXG5jb25zdCBNQVhfRVZFTlRTID0gMTAwO1xuXG4vLyBUZW1wb3Jhcnkgd29ya2Fyb3VuZCB3aGlsZSBzb2x2aW5nIGNvbW1vbmpzIC0+IGVzbSBpc3N1ZXMgaW4gTm9kZSAxOCAtIDIwLlxuZnVuY3Rpb24gZnJvbU1pbGxpcyhtaWxsaXMpIHtcbiAgcmV0dXJuIFtNYXRoLnRydW5jKG1pbGxpcyAvIDEwMDApLCBNYXRoLnJvdW5kKChtaWxsaXMgJSAxMDAwKSAqIDFlNildO1xufVxuXG5mdW5jdGlvbiBUZWxlbWV0ZXIob3B0aW9ucywgdHJhY2luZykge1xuICB0aGlzLnF1ZXVlID0gW107XG4gIHRoaXMub3B0aW9ucyA9IF8ubWVyZ2Uob3B0aW9ucyk7XG4gIHZhciBtYXhUZWxlbWV0cnlFdmVudHMgPSB0aGlzLm9wdGlvbnMubWF4VGVsZW1ldHJ5RXZlbnRzIHx8IE1BWF9FVkVOVFM7XG4gIHRoaXMubWF4UXVldWVTaXplID0gTWF0aC5tYXgoMCwgTWF0aC5taW4obWF4VGVsZW1ldHJ5RXZlbnRzLCBNQVhfRVZFTlRTKSk7XG4gIHRoaXMudHJhY2luZyA9IHRyYWNpbmc7XG4gIHRoaXMudGVsZW1ldHJ5U3BhbiA9IHRoaXMudHJhY2luZz8uc3RhcnRTcGFuKCdyb2xsYmFyLXRlbGVtZXRyeScsIHt9KTtcbn1cblxuVGVsZW1ldGVyLnByb3RvdHlwZS5jb25maWd1cmUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgb2xkT3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgdGhpcy5vcHRpb25zID0gXy5tZXJnZShvbGRPcHRpb25zLCBvcHRpb25zKTtcbiAgdmFyIG1heFRlbGVtZXRyeUV2ZW50cyA9IHRoaXMub3B0aW9ucy5tYXhUZWxlbWV0cnlFdmVudHMgfHwgTUFYX0VWRU5UUztcbiAgdmFyIG5ld01heEV2ZW50cyA9IE1hdGgubWF4KDAsIE1hdGgubWluKG1heFRlbGVtZXRyeUV2ZW50cywgTUFYX0VWRU5UUykpO1xuICB2YXIgZGVsZXRlQ291bnQgPSAwO1xuICBpZiAodGhpcy5xdWV1ZS5sZW5ndGggPiBuZXdNYXhFdmVudHMpIHtcbiAgICBkZWxldGVDb3VudCA9IHRoaXMucXVldWUubGVuZ3RoIC0gbmV3TWF4RXZlbnRzO1xuICB9XG4gIHRoaXMubWF4UXVldWVTaXplID0gbmV3TWF4RXZlbnRzO1xuICB0aGlzLnF1ZXVlLnNwbGljZSgwLCBkZWxldGVDb3VudCk7XG59O1xuXG5UZWxlbWV0ZXIucHJvdG90eXBlLmNvcHlFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBldmVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLnF1ZXVlLCAwKTtcbiAgaWYgKF8uaXNGdW5jdGlvbih0aGlzLm9wdGlvbnMuZmlsdGVyVGVsZW1ldHJ5KSkge1xuICAgIHRyeSB7XG4gICAgICB2YXIgaSA9IGV2ZW50cy5sZW5ndGg7XG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZmlsdGVyVGVsZW1ldHJ5KGV2ZW50c1tpXSkpIHtcbiAgICAgICAgICBldmVudHMuc3BsaWNlKGksIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5vcHRpb25zLmZpbHRlclRlbGVtZXRyeSA9IG51bGw7XG4gICAgfVxuICB9XG4gIHJldHVybiBldmVudHM7XG59O1xuXG5UZWxlbWV0ZXIucHJvdG90eXBlLmNhcHR1cmUgPSBmdW5jdGlvbiAoXG4gIHR5cGUsXG4gIG1ldGFkYXRhLFxuICBsZXZlbCxcbiAgcm9sbGJhclVVSUQsXG4gIHRpbWVzdGFtcCxcbikge1xuICB2YXIgZSA9IHtcbiAgICBsZXZlbDogZ2V0TGV2ZWwodHlwZSwgbGV2ZWwpLFxuICAgIHR5cGU6IHR5cGUsXG4gICAgdGltZXN0YW1wX21zOiB0aW1lc3RhbXAgfHwgXy5ub3coKSxcbiAgICBib2R5OiBtZXRhZGF0YSxcbiAgICBzb3VyY2U6ICdjbGllbnQnLFxuICB9O1xuICBpZiAocm9sbGJhclVVSUQpIHtcbiAgICBlLnV1aWQgPSByb2xsYmFyVVVJRDtcbiAgfVxuXG4gIHRyeSB7XG4gICAgaWYgKFxuICAgICAgXy5pc0Z1bmN0aW9uKHRoaXMub3B0aW9ucy5maWx0ZXJUZWxlbWV0cnkpICYmXG4gICAgICB0aGlzLm9wdGlvbnMuZmlsdGVyVGVsZW1ldHJ5KGUpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9IGNhdGNoIChleGMpIHtcbiAgICB0aGlzLm9wdGlvbnMuZmlsdGVyVGVsZW1ldHJ5ID0gbnVsbDtcbiAgfVxuXG4gIHRoaXMucHVzaChlKTtcbiAgcmV0dXJuIGU7XG59O1xuXG5UZWxlbWV0ZXIucHJvdG90eXBlLmNhcHR1cmVFdmVudCA9IGZ1bmN0aW9uIChcbiAgdHlwZSxcbiAgbWV0YWRhdGEsXG4gIGxldmVsLFxuICByb2xsYmFyVVVJRCxcbikge1xuICByZXR1cm4gdGhpcy5jYXB0dXJlKHR5cGUsIG1ldGFkYXRhLCBsZXZlbCwgcm9sbGJhclVVSUQpO1xufTtcblxuVGVsZW1ldGVyLnByb3RvdHlwZS5jYXB0dXJlRXJyb3IgPSBmdW5jdGlvbiAoXG4gIGVycixcbiAgbGV2ZWwsXG4gIHJvbGxiYXJVVUlELFxuICB0aW1lc3RhbXAsXG4pIHtcbiAgY29uc3QgbWVzc2FnZSA9IGVyci5tZXNzYWdlIHx8IFN0cmluZyhlcnIpO1xuICB2YXIgbWV0YWRhdGEgPSB7bWVzc2FnZX07XG4gIGlmIChlcnIuc3RhY2spIHtcbiAgICBtZXRhZGF0YS5zdGFjayA9IGVyci5zdGFjaztcbiAgfVxuICB0aGlzLnRlbGVtZXRyeVNwYW4/LmFkZEV2ZW50KFxuICAgICdyb2xsYmFyLW9jY3VycmVuY2UtZXZlbnQnLFxuICAgIHtcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBsZXZlbCxcbiAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICB1dWlkOiByb2xsYmFyVVVJRCxcbiAgICAgICdvY2N1cnJlbmNlLnR5cGUnOiAnZXJyb3InLCAvLyBkZXByZWNhdGVkXG4gICAgICAnb2NjdXJyZW5jZS51dWlkJzogcm9sbGJhclVVSUQsIC8vIGRlcHJlY2F0ZWRcbiAgICB9LFxuXG4gICAgZnJvbU1pbGxpcyh0aW1lc3RhbXApLFxuICApO1xuXG4gIHJldHVybiB0aGlzLmNhcHR1cmUoJ2Vycm9yJywgbWV0YWRhdGEsIGxldmVsLCByb2xsYmFyVVVJRCwgdGltZXN0YW1wKTtcbn07XG5cblRlbGVtZXRlci5wcm90b3R5cGUuY2FwdHVyZUxvZyA9IGZ1bmN0aW9uIChcbiAgbWVzc2FnZSxcbiAgbGV2ZWwsXG4gIHJvbGxiYXJVVUlELFxuICB0aW1lc3RhbXAsXG4pIHtcbiAgLy8gSWYgdGhlIHV1aWQgaXMgcHJlc2VudCwgdGhpcyBpcyBhIG1lc3NhZ2Ugb2NjdXJyZW5jZS5cbiAgaWYgKHJvbGxiYXJVVUlEKSB7XG4gICAgdGhpcy50ZWxlbWV0cnlTcGFuPy5hZGRFdmVudChcbiAgICAgICdyb2xsYmFyLW9jY3VycmVuY2UtZXZlbnQnLFxuICAgICAge1xuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBsZXZlbCxcbiAgICAgICAgdHlwZTogJ21lc3NhZ2UnLFxuICAgICAgICB1dWlkOiByb2xsYmFyVVVJRCxcbiAgICAgICAgJ29jY3VycmVuY2UudHlwZSc6ICdtZXNzYWdlJywgLy8gZGVwcmVjYXRlZFxuICAgICAgICAnb2NjdXJyZW5jZS51dWlkJzogcm9sbGJhclVVSUQsIC8vIGRlcHJlY2F0ZWRcbiAgICAgIH0sXG4gICAgICBmcm9tTWlsbGlzKHRpbWVzdGFtcCksXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnRlbGVtZXRyeVNwYW4/LmFkZEV2ZW50KFxuICAgICAgJ2xvZy1ldmVudCcsXG4gICAgICB7bWVzc2FnZSwgbGV2ZWx9LFxuICAgICAgZnJvbU1pbGxpcyh0aW1lc3RhbXApLFxuICAgICk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5jYXB0dXJlKFxuICAgICdsb2cnLFxuICAgIHttZXNzYWdlfSxcbiAgICBsZXZlbCxcbiAgICByb2xsYmFyVVVJRCxcbiAgICB0aW1lc3RhbXAsXG4gICk7XG59O1xuXG5UZWxlbWV0ZXIucHJvdG90eXBlLmNhcHR1cmVOZXR3b3JrID0gZnVuY3Rpb24gKFxuICBtZXRhZGF0YSxcbiAgc3VidHlwZSxcbiAgcm9sbGJhclVVSUQsXG4gIHJlcXVlc3REYXRhLFxuKSB7XG4gIHN1YnR5cGUgPSBzdWJ0eXBlIHx8ICd4aHInO1xuICBtZXRhZGF0YS5zdWJ0eXBlID0gbWV0YWRhdGEuc3VidHlwZSB8fCBzdWJ0eXBlO1xuICBpZiAocmVxdWVzdERhdGEpIHtcbiAgICBtZXRhZGF0YS5yZXF1ZXN0ID0gcmVxdWVzdERhdGE7XG4gIH1cbiAgdmFyIGxldmVsID0gdGhpcy5sZXZlbEZyb21TdGF0dXMobWV0YWRhdGEuc3RhdHVzX2NvZGUpO1xuICByZXR1cm4gdGhpcy5jYXB0dXJlKCduZXR3b3JrJywgbWV0YWRhdGEsIGxldmVsLCByb2xsYmFyVVVJRCk7XG59O1xuXG5UZWxlbWV0ZXIucHJvdG90eXBlLmxldmVsRnJvbVN0YXR1cyA9IGZ1bmN0aW9uIChzdGF0dXNDb2RlKSB7XG4gIGlmIChzdGF0dXNDb2RlID49IDIwMCAmJiBzdGF0dXNDb2RlIDwgNDAwKSB7XG4gICAgcmV0dXJuICdpbmZvJztcbiAgfVxuICBpZiAoc3RhdHVzQ29kZSA9PT0gMCB8fCBzdGF0dXNDb2RlID49IDQwMCkge1xuICAgIHJldHVybiAnZXJyb3InO1xuICB9XG4gIHJldHVybiAnaW5mbyc7XG59O1xuXG5UZWxlbWV0ZXIucHJvdG90eXBlLmNhcHR1cmVEb20gPSBmdW5jdGlvbiAoXG4gIHN1YnR5cGUsXG4gIGVsZW1lbnQsXG4gIHZhbHVlLFxuICBjaGVja2VkLFxuICByb2xsYmFyVVVJRCxcbikge1xuICB2YXIgbWV0YWRhdGEgPSB7XG4gICAgc3VidHlwZTogc3VidHlwZSxcbiAgICBlbGVtZW50OiBlbGVtZW50LFxuICB9O1xuICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIG1ldGFkYXRhLnZhbHVlID0gdmFsdWU7XG4gIH1cbiAgaWYgKGNoZWNrZWQgIT09IHVuZGVmaW5lZCkge1xuICAgIG1ldGFkYXRhLmNoZWNrZWQgPSBjaGVja2VkO1xuICB9XG4gIHJldHVybiB0aGlzLmNhcHR1cmUoJ2RvbScsIG1ldGFkYXRhLCAnaW5mbycsIHJvbGxiYXJVVUlEKTtcbn07XG5cblRlbGVtZXRlci5wcm90b3R5cGUuY2FwdHVyZU5hdmlnYXRpb24gPSBmdW5jdGlvbiAoZnJvbSwgdG8sIHJvbGxiYXJVVUlELCB0aW1lc3RhbXApIHtcbiAgdGhpcy50ZWxlbWV0cnlTcGFuPy5hZGRFdmVudChcbiAgICAnc2Vzc2lvbi1uYXZpZ2F0aW9uLWV2ZW50JyxcbiAgICB7J3ByZXZpb3VzLnVybC5mdWxsJzogZnJvbSwgJ3VybC5mdWxsJzogdG99LFxuICAgIGZyb21NaWxsaXModGltZXN0YW1wKSxcbiAgKTtcblxuICByZXR1cm4gdGhpcy5jYXB0dXJlKFxuICAgICduYXZpZ2F0aW9uJyxcbiAgICB7ZnJvbSwgdG99LFxuICAgICdpbmZvJyxcbiAgICByb2xsYmFyVVVJRCxcbiAgICB0aW1lc3RhbXAsXG4gICk7XG59O1xuXG5UZWxlbWV0ZXIucHJvdG90eXBlLmNhcHR1cmVEb21Db250ZW50TG9hZGVkID0gZnVuY3Rpb24gKHRzKSB7XG4gIHJldHVybiB0aGlzLmNhcHR1cmUoXG4gICAgJ25hdmlnYXRpb24nLFxuICAgIHsgc3VidHlwZTogJ0RPTUNvbnRlbnRMb2FkZWQnIH0sXG4gICAgJ2luZm8nLFxuICAgIHVuZGVmaW5lZCxcbiAgICB0cyAmJiB0cy5nZXRUaW1lKCksXG4gICk7XG4gIC8qKlxuICAgKiBJZiB3ZSBkZWNpZGUgdG8gbWFrZSB0aGlzIGEgZG9tIGV2ZW50IGluc3RlYWQsIHRoZW4gdXNlIHRoZSBsaW5lIGJlbG93OlxuICByZXR1cm4gdGhpcy5jYXB0dXJlKCdkb20nLCB7c3VidHlwZTogJ0RPTUNvbnRlbnRMb2FkZWQnfSwgJ2luZm8nLCB1bmRlZmluZWQsIHRzICYmIHRzLmdldFRpbWUoKSk7XG4gICovXG59O1xuVGVsZW1ldGVyLnByb3RvdHlwZS5jYXB0dXJlTG9hZCA9IGZ1bmN0aW9uICh0cykge1xuICByZXR1cm4gdGhpcy5jYXB0dXJlKFxuICAgICduYXZpZ2F0aW9uJyxcbiAgICB7IHN1YnR5cGU6ICdsb2FkJyB9LFxuICAgICdpbmZvJyxcbiAgICB1bmRlZmluZWQsXG4gICAgdHMgJiYgdHMuZ2V0VGltZSgpLFxuICApO1xuICAvKipcbiAgICogSWYgd2UgZGVjaWRlIHRvIG1ha2UgdGhpcyBhIGRvbSBldmVudCBpbnN0ZWFkLCB0aGVuIHVzZSB0aGUgbGluZSBiZWxvdzpcbiAgcmV0dXJuIHRoaXMuY2FwdHVyZSgnZG9tJywge3N1YnR5cGU6ICdsb2FkJ30sICdpbmZvJywgdW5kZWZpbmVkLCB0cyAmJiB0cy5nZXRUaW1lKCkpO1xuICAqL1xufTtcblxuVGVsZW1ldGVyLnByb3RvdHlwZS5jYXB0dXJlQ29ubmVjdGl2aXR5Q2hhbmdlID0gZnVuY3Rpb24gKHR5cGUsIHJvbGxiYXJVVUlEKSB7XG4gIHJldHVybiB0aGlzLmNhcHR1cmVOZXR3b3JrKHsgY2hhbmdlOiB0eXBlIH0sICdjb25uZWN0aXZpdHknLCByb2xsYmFyVVVJRCk7XG59O1xuXG4vLyBPbmx5IGludGVuZGVkIHRvIGJlIHVzZWQgaW50ZXJuYWxseSBieSB0aGUgbm90aWZpZXJcblRlbGVtZXRlci5wcm90b3R5cGUuX2NhcHR1cmVSb2xsYmFySXRlbSA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIGlmICghdGhpcy5vcHRpb25zLmluY2x1ZGVJdGVtc0luVGVsZW1ldHJ5KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChpdGVtLmVycikge1xuICAgIHJldHVybiB0aGlzLmNhcHR1cmVFcnJvcihpdGVtLmVyciwgaXRlbS5sZXZlbCwgaXRlbS51dWlkLCBpdGVtLnRpbWVzdGFtcCk7XG4gIH1cbiAgaWYgKGl0ZW0ubWVzc2FnZSkge1xuICAgIHJldHVybiB0aGlzLmNhcHR1cmVMb2coaXRlbS5tZXNzYWdlLCBpdGVtLmxldmVsLCBpdGVtLnV1aWQsIGl0ZW0udGltZXN0YW1wKTtcbiAgfVxuICBpZiAoaXRlbS5jdXN0b20pIHtcbiAgICByZXR1cm4gdGhpcy5jYXB0dXJlKFxuICAgICAgJ2xvZycsXG4gICAgICBpdGVtLmN1c3RvbSxcbiAgICAgIGl0ZW0ubGV2ZWwsXG4gICAgICBpdGVtLnV1aWQsXG4gICAgICBpdGVtLnRpbWVzdGFtcCxcbiAgICApO1xuICB9XG59O1xuXG5UZWxlbWV0ZXIucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiAoZSkge1xuICB0aGlzLnF1ZXVlLnB1c2goZSk7XG4gIGlmICh0aGlzLnF1ZXVlLmxlbmd0aCA+IHRoaXMubWF4UXVldWVTaXplKSB7XG4gICAgdGhpcy5xdWV1ZS5zaGlmdCgpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBnZXRMZXZlbCh0eXBlLCBsZXZlbCkge1xuICBpZiAobGV2ZWwpIHtcbiAgICByZXR1cm4gbGV2ZWw7XG4gIH1cbiAgdmFyIGRlZmF1bHRMZXZlbCA9IHtcbiAgICBlcnJvcjogJ2Vycm9yJyxcbiAgICBtYW51YWw6ICdpbmZvJyxcbiAgfTtcbiAgcmV0dXJuIGRlZmF1bHRMZXZlbFt0eXBlXSB8fCAnaW5mbyc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGVsZW1ldGVyO1xuIiwiZXhwb3J0IGNsYXNzIENvbnRleHQge1xuICBjb25zdHJ1Y3RvcihwYXJlbnRDb250ZXh0KSB7XG4gICAgdGhpcy5fY3VycmVudENvbnRleHQgPSBwYXJlbnRDb250ZXh0ID8gbmV3IE1hcChwYXJlbnRDb250ZXh0KSA6IG5ldyBNYXAoKTtcbiAgfVxuXG4gIGdldFZhbHVlKGtleSkge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50Q29udGV4dC5nZXQoa2V5KTtcbiAgfVxuXG4gIHNldFZhbHVlIChrZXksIHZhbHVlKSB7XG4gICAgY29uc3QgY29udGV4dCA9IG5ldyBDb250ZXh0KHRoaXMuX2N1cnJlbnRDb250ZXh0KTtcbiAgICBjb250ZXh0Ll9jdXJyZW50Q29udGV4dC5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgcmV0dXJuIGNvbnRleHQ7XG4gIH1cblxuICBkZWxldGVWYWx1ZShrZXkpIHtcbiAgICBjb25zdCBjb250ZXh0ID0gbmV3IENvbnRleHQoc2VsZi5fY3VycmVudENvbnRleHQpO1xuICAgIGNvbnRleHQuX2N1cnJlbnRDb250ZXh0LmRlbGV0ZShrZXkpO1xuICAgIHJldHVybiBjb250ZXh0O1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBST09UX0NPTlRFWFQgPSBuZXcgQ29udGV4dCgpO1xuXG4iLCJpbXBvcnQgeyBST09UX0NPTlRFWFQgfSBmcm9tICcuL2NvbnRleHQuanMnO1xuXG5leHBvcnQgY2xhc3MgQ29udGV4dE1hbmFnZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmN1cnJlbnRDb250ZXh0ID0gUk9PVF9DT05URVhUO1xuICB9XG5cbiAgYWN0aXZlKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRDb250ZXh0O1xuICB9XG5cbiAgZW50ZXJDb250ZXh0KGNvbnRleHQpIHtcbiAgICBjb25zdCBwcmV2aW91c0NvbnRleHQgPSB0aGlzLmN1cnJlbnRDb250ZXh0O1xuICAgIHRoaXMuY3VycmVudENvbnRleHQgPSBjb250ZXh0IHx8IFJPT1RfQ09OVEVYVDtcbiAgICByZXR1cm4gcHJldmlvdXNDb250ZXh0O1xuICB9XG5cbiAgZXhpdENvbnRleHQoY29udGV4dCkge1xuICAgIHRoaXMuY3VycmVudENvbnRleHQgPSBjb250ZXh0O1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRDb250ZXh0O1xuICB9XG5cbiAgd2l0aChjb250ZXh0LCBmbiwgdGhpc0FyZywgLi4uYXJncykge1xuICAgIGNvbnN0IHByZXZpb3VzQ29udGV4dCA9IHRoaXMuZW50ZXJDb250ZXh0KGNvbnRleHQpO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGlzQXJnLCAuLi5hcmdzKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5leGl0Q29udGV4dChwcmV2aW91c0NvbnRleHQpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29udGV4dEtleShrZXkpIHtcbiAgLy8gVXNlIFN5bWJvbCBmb3IgT3BlblRlbGVtZXRyeSBjb21wYXRpYmlsaXR5LlxuICByZXR1cm4gU3ltYm9sLmZvcihrZXkpO1xufVxuXG4iLCJpbXBvcnQgaHJ0aW1lIGZyb20gJy4vaHJ0aW1lJztcblxuLyoqXG4gKiBTcGFuRXhwb3J0ZXIgaXMgcmVzcG9uc2libGUgZm9yIGV4cG9ydGluZyBSZWFkYWJsZVNwYW4gb2JqZWN0c1xuICogYW5kIHRyYW5zZm9ybWluZyB0aGVtIGludG8gdGhlIE9UTFAtY29tcGF0aWJsZSBmb3JtYXQuXG4gKi9cbmV4cG9ydCBjbGFzcyBTcGFuRXhwb3J0ZXIge1xuICAvKipcbiAgICogRXhwb3J0IHNwYW5zIHRvIHRoZSBzcGFuIGV4cG9ydCBxdWV1ZVxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBzcGFucyAtIEFycmF5IG9mIFJlYWRhYmxlU3BhbiBvYmplY3RzIHRvIGV4cG9ydFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBfcmVzdWx0Q2FsbGJhY2sgLSBPcHRpb25hbCBjYWxsYmFjayAobm90IHVzZWQpXG4gICAqL1xuICBleHBvcnQoc3BhbnMsIF9yZXN1bHRDYWxsYmFjaykge1xuICAgIGNvbnNvbGUubG9nKHNwYW5zKTsgLy8gY29uc29sZSBleHBvcnRlciwgVE9ETzogbWFrZSBvcHRpb25hbFxuICAgIHNwYW5FeHBvcnRRdWV1ZS5wdXNoKC4uLnNwYW5zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2Zvcm1zIGFuIGFycmF5IG9mIFJlYWRhYmxlU3BhbiBvYmplY3RzIGludG8gdGhlIE9UTFAgZm9ybWF0IHBheWxvYWRcbiAgICogY29tcGF0aWJsZSB3aXRoIHRoZSBSb2xsYmFyIEFQSS4gVGhpcyBmb2xsb3dzIHRoZSBPcGVuVGVsZW1ldHJ5IHByb3RvY29sXG4gICAqIHNwZWNpZmljYXRpb24gZm9yIHRyYWNlcy5cbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gT1RMUCBmb3JtYXQgcGF5bG9hZCBmb3IgQVBJIHRyYW5zbWlzc2lvblxuICAgKi9cbiAgdG9QYXlsb2FkKCkge1xuICAgIGNvbnN0IHNwYW5zID0gc3BhbkV4cG9ydFF1ZXVlLnNsaWNlKCk7XG4gICAgc3BhbkV4cG9ydFF1ZXVlLmxlbmd0aCA9IDA7XG5cbiAgICBpZiAoIXNwYW5zIHx8ICFzcGFucy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB7IHJlc291cmNlU3BhbnM6IFtdIH07XG4gICAgfVxuXG4gICAgY29uc3QgcmVzb3VyY2UgPSAoc3BhbnNbMF0gJiYgc3BhbnNbMF0ucmVzb3VyY2UpIHx8IHt9O1xuXG4gICAgY29uc3Qgc2NvcGVNYXAgPSBuZXcgTWFwKCk7XG5cbiAgICBmb3IgKGNvbnN0IHNwYW4gb2Ygc3BhbnMpIHtcbiAgICAgIGNvbnN0IHNjb3BlS2V5ID0gc3Bhbi5pbnN0cnVtZW50YXRpb25TY29wZVxuICAgICAgICA/IGAke3NwYW4uaW5zdHJ1bWVudGF0aW9uU2NvcGUubmFtZX06JHtzcGFuLmluc3RydW1lbnRhdGlvblNjb3BlLnZlcnNpb259YFxuICAgICAgICA6ICdkZWZhdWx0OjEuMC4wJztcblxuICAgICAgaWYgKCFzY29wZU1hcC5oYXMoc2NvcGVLZXkpKSB7XG4gICAgICAgIHNjb3BlTWFwLnNldChzY29wZUtleSwge1xuICAgICAgICAgIHNjb3BlOiBzcGFuLmluc3RydW1lbnRhdGlvblNjb3BlIHx8IHtcbiAgICAgICAgICAgIG5hbWU6ICdkZWZhdWx0JyxcbiAgICAgICAgICAgIHZlcnNpb246ICcxLjAuMCcsXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiBbXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNwYW5zOiBbXSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHNjb3BlTWFwLmdldChzY29wZUtleSkuc3BhbnMucHVzaCh0aGlzLl90cmFuc2Zvcm1TcGFuKHNwYW4pKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgcmVzb3VyY2VTcGFuczogW1xuICAgICAgICB7XG4gICAgICAgICAgcmVzb3VyY2U6IHRoaXMuX3RyYW5zZm9ybVJlc291cmNlKHJlc291cmNlKSxcbiAgICAgICAgICBzY29wZVNwYW5zOiBBcnJheS5mcm9tKHNjb3BlTWFwLnZhbHVlcygpKS5tYXAoKHNjb3BlRGF0YSkgPT4gKHtcbiAgICAgICAgICAgIHNjb3BlOiB0aGlzLl90cmFuc2Zvcm1JbnN0cnVtZW50YXRpb25TY29wZShzY29wZURhdGEuc2NvcGUpLFxuICAgICAgICAgICAgc3BhbnM6IHNjb3BlRGF0YS5zcGFucyxcbiAgICAgICAgICB9KSksXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNmb3JtcyBhIFJlYWRhYmxlU3BhbiBpbnRvIHRoZSBPVExQIFNwYW4gZm9ybWF0XG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzcGFuIC0gUmVhZGFibGVTcGFuIG9iamVjdCB0byB0cmFuc2Zvcm1cbiAgICogQHJldHVybnMge09iamVjdH0gT1RMUCBTcGFuIGZvcm1hdFxuICAgKi9cbiAgX3RyYW5zZm9ybVNwYW4oc3Bhbikge1xuICAgIGNvbnN0IHRyYW5zZm9ybUF0dHJpYnV0ZXMgPSAoYXR0cmlidXRlcykgPT4ge1xuICAgICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKGF0dHJpYnV0ZXMgfHwge30pLm1hcCgoW2tleSwgdmFsdWVdKSA9PiAoe1xuICAgICAgICBrZXksXG4gICAgICAgIHZhbHVlOiB0aGlzLl90cmFuc2Zvcm1BbnlWYWx1ZSh2YWx1ZSksXG4gICAgICB9KSk7XG4gICAgfTtcblxuICAgIGNvbnN0IHRyYW5zZm9ybUV2ZW50cyA9IChldmVudHMpID0+IHtcbiAgICAgIHJldHVybiAoZXZlbnRzIHx8IFtdKS5tYXAoKGV2ZW50KSA9PiAoe1xuICAgICAgICB0aW1lVW5peE5hbm86IGhydGltZS50b05hbm9zKGV2ZW50LnRpbWUpLFxuICAgICAgICBuYW1lOiBldmVudC5uYW1lLFxuICAgICAgICBhdHRyaWJ1dGVzOiB0cmFuc2Zvcm1BdHRyaWJ1dGVzKGV2ZW50LmF0dHJpYnV0ZXMpLFxuICAgICAgfSkpO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgdHJhY2VJZDogc3Bhbi5zcGFuQ29udGV4dC50cmFjZUlkLFxuICAgICAgc3BhbklkOiBzcGFuLnNwYW5Db250ZXh0LnNwYW5JZCxcbiAgICAgIHBhcmVudFNwYW5JZDogc3Bhbi5wYXJlbnRTcGFuSWQgfHwgJycsXG4gICAgICBuYW1lOiBzcGFuLm5hbWUsXG4gICAgICBraW5kOiBzcGFuLmtpbmQgfHwgMSwgLy8gSU5URVJOQUwgYnkgZGVmYXVsdFxuICAgICAgc3RhcnRUaW1lVW5peE5hbm86IGhydGltZS50b05hbm9zKHNwYW4uc3RhcnRUaW1lKSxcbiAgICAgIGVuZFRpbWVVbml4TmFubzogaHJ0aW1lLnRvTmFub3Moc3Bhbi5lbmRUaW1lKSxcbiAgICAgIGF0dHJpYnV0ZXM6IHRyYW5zZm9ybUF0dHJpYnV0ZXMoc3Bhbi5hdHRyaWJ1dGVzKSxcbiAgICAgIGV2ZW50czogdHJhbnNmb3JtRXZlbnRzKHNwYW4uZXZlbnRzKSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zZm9ybXMgYSByZXNvdXJjZSBvYmplY3QgaW50byBPVExQIFJlc291cmNlIGZvcm1hdFxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVzb3VyY2UgLSBSZXNvdXJjZSBpbmZvcm1hdGlvblxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBPVExQIFJlc291cmNlIGZvcm1hdFxuICAgKi9cbiAgX3RyYW5zZm9ybVJlc291cmNlKHJlc291cmNlKSB7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHJlc291cmNlLmF0dHJpYnV0ZXMgfHwge307XG4gICAgY29uc3Qga2V5VmFsdWVzID0gT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcykubWFwKChba2V5LCB2YWx1ZV0pID0+ICh7XG4gICAgICBrZXksXG4gICAgICB2YWx1ZTogdGhpcy5fdHJhbnNmb3JtQW55VmFsdWUodmFsdWUpLFxuICAgIH0pKTtcblxuICAgIHJldHVybiB7XG4gICAgICBhdHRyaWJ1dGVzOiBrZXlWYWx1ZXMsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2Zvcm1zIGFuIGluc3RydW1lbnRhdGlvbiBzY29wZSBpbnRvIE9UTFAgSW5zdHJ1bWVudGF0aW9uU2NvcGUgZm9ybWF0XG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzY29wZSAtIEluc3RydW1lbnRhdGlvbiBzY29wZSBpbmZvcm1hdGlvblxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBPVExQIEluc3RydW1lbnRhdGlvblNjb3BlIGZvcm1hdFxuICAgKi9cbiAgX3RyYW5zZm9ybUluc3RydW1lbnRhdGlvblNjb3BlKHNjb3BlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IHNjb3BlLm5hbWUgfHwgJycsXG4gICAgICB2ZXJzaW9uOiBzY29wZS52ZXJzaW9uIHx8ICcnLFxuICAgICAgYXR0cmlidXRlczogKHNjb3BlLmF0dHJpYnV0ZXMgfHwgW10pLm1hcCgoYXR0cikgPT4gKHtcbiAgICAgICAga2V5OiBhdHRyLmtleSxcbiAgICAgICAgdmFsdWU6IHRoaXMuX3RyYW5zZm9ybUFueVZhbHVlKGF0dHIudmFsdWUpLFxuICAgICAgfSkpLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNmb3JtcyBhIEphdmFTY3JpcHQgdmFsdWUgaW50byBhbiBPVExQIEFueVZhbHVlXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZSAtIFZhbHVlIHRvIHRyYW5zZm9ybVxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBPVExQIEFueVZhbHVlIGZvcm1hdFxuICAgKi9cbiAgX3RyYW5zZm9ybUFueVZhbHVlKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB7IHN0cmluZ1ZhbHVlOiAnJyB9O1xuICAgIH1cblxuICAgIGNvbnN0IHR5cGUgPSB0eXBlb2YgdmFsdWU7XG5cbiAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB7IHN0cmluZ1ZhbHVlOiB2YWx1ZSB9O1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4geyBpbnRWYWx1ZTogdmFsdWUudG9TdHJpbmcoKSB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHsgZG91YmxlVmFsdWU6IHZhbHVlIH07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnYm9vbGVhbicpIHtcbiAgICAgIHJldHVybiB7IGJvb2xWYWx1ZTogdmFsdWUgfTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBhcnJheVZhbHVlOiB7XG4gICAgICAgICAgdmFsdWVzOiB2YWx1ZS5tYXAoKHYpID0+IHRoaXMuX3RyYW5zZm9ybUFueVZhbHVlKHYpKSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAga3ZsaXN0VmFsdWU6IHtcbiAgICAgICAgICB2YWx1ZXM6IE9iamVjdC5lbnRyaWVzKHZhbHVlKS5tYXAoKFtrLCB2XSkgPT4gKHtcbiAgICAgICAgICAgIGtleTogayxcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLl90cmFuc2Zvcm1BbnlWYWx1ZSh2KSxcbiAgICAgICAgICB9KSksXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7IHN0cmluZ1ZhbHVlOiBTdHJpbmcodmFsdWUpIH07XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHNwYW5FeHBvcnRRdWV1ZSA9IFtdO1xuIiwiLyoqXG4gKiBAbW9kdWxlIGhydGltZVxuICpcbiAqIEBkZXNjcmlwdGlvbiBNZXRob2RzIGZvciBoYW5kbGluZyBPcGVuVGVsZW1ldHJ5IGhydGltZS5cbiAqL1xuXG4vKipcbiAqIENvbnZlcnQgYSBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHMgdG8gYW4gT3BlblRlbGVtZXRyeSBocnRpbWUgdHVwbGUuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IG1pbGxpcyAtIFRoZSBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHMuXG4gKiBAcmV0dXJucyB7W251bWJlciwgbnVtYmVyXX0gQW4gYXJyYXkgd2hlcmUgdGhlIGZpcnN0IGVsZW1lbnQgaXMgc2Vjb25kc1xuICogICBhbmQgdGhlIHNlY29uZCBpcyBuYW5vc2Vjb25kcy5cbiAqL1xuZnVuY3Rpb24gZnJvbU1pbGxpcyhtaWxsaXMpIHtcbiAgcmV0dXJuIFtNYXRoLnRydW5jKG1pbGxpcyAvIDEwMDApLCBNYXRoLnJvdW5kKChtaWxsaXMgJSAxMDAwKSAqIDFlNildO1xufVxuXG4vKipcbiAqIENvbnZlcnQgYW4gT3BlblRlbGVtZXRyeSBocnRpbWUgdHVwbGUgYmFjayB0byBhIGR1cmF0aW9uIGluIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcGFyYW0ge1tudW1iZXIsIG51bWJlcl19IGhydGltZSAtIFRoZSBocnRpbWUgdHVwbGUgW3NlY29uZHMsIG5hbm9zZWNvbmRzXS5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSB0b3RhbCBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHMuXG4gKi9cbmZ1bmN0aW9uIHRvTWlsbGlzKGhydGltZSkge1xuICByZXR1cm4gaHJ0aW1lWzBdICogMWUzICsgTWF0aC5yb3VuZChocnRpbWVbMV0gLyAxZTYpO1xufVxuXG4vKipcbiAqIENvbnZlcnQgYW4gT3BlblRlbGVtZXRyeSBocnRpbWUgdHVwbGUgYmFjayB0byBhIGR1cmF0aW9uIGluIG5hbm9zZWNvbmRzLlxuICpcbiAqIEBwYXJhbSB7W251bWJlciwgbnVtYmVyXX0gaHJ0aW1lIC0gVGhlIGhydGltZSB0dXBsZSBbc2Vjb25kcywgbmFub3NlY29uZHNdLlxuICogQHJldHVybnMge251bWJlcn0gVGhlIHRvdGFsIGR1cmF0aW9uIGluIG5hbm9zZWNvbmRzLlxuICovXG5mdW5jdGlvbiB0b05hbm9zKGhydGltZSkge1xuICByZXR1cm4gaHJ0aW1lWzBdICogMWU5ICsgaHJ0aW1lWzFdO1xufVxuXG4vKipcbiAqIEFkZHMgdHdvIE9wZW5UZWxlbWV0cnkgaHJ0aW1lIHR1cGxlcy5cbiAqXG4gKiBAcGFyYW0ge1tudW1iZXIsIG51bWJlcl19IGEgLSBUaGUgZmlyc3QgaHJ0aW1lIHR1cGxlIFtzLCBuc10uXG4gKiBAcGFyYW0ge1tudW1iZXIsIG51bWJlcl19IGIgLSBUaGUgc2Vjb25kIGhydGltZSB0dXBsZSBbcywgbnNdLlxuICogQHJldHVybnMge1tudW1iZXIsIG51bWJlcl19IFN1bW1lZCBocnRpbWUgdHVwbGUsIG5vcm1hbGl6ZWQuXG4gKlxuICovXG5mdW5jdGlvbiBhZGQoYSwgYikge1xuICByZXR1cm4gW2FbMF0gKyBiWzBdICsgTWF0aC50cnVuYygoYVsxXSArIGJbMV0pIC8gMWU5KSwgKGFbMV0gKyBiWzFdKSAlIDFlOV07XG59XG5cbi8qKlxuICogR2V0IHRoZSBjdXJyZW50IGhpZ2gtcmVzb2x1dGlvbiB0aW1lIGFzIGFuIE9wZW5UZWxlbWV0cnkgaHJ0aW1lIHR1cGxlLlxuICpcbiAqIFVzZXMgdGhlIFBlcmZvcm1hbmNlIEFQSSAodGltZU9yaWdpbiArIG5vdygpKS5cbiAqXG4gKiBAcmV0dXJucyB7W251bWJlciwgbnVtYmVyXX0gVGhlIGN1cnJlbnQgaHJ0aW1lIHR1cGxlIFtzLCBuc10uXG4gKi9cbmZ1bmN0aW9uIG5vdygpIHtcbiAgcmV0dXJuIGFkZChmcm9tTWlsbGlzKHBlcmZvcm1hbmNlLnRpbWVPcmlnaW4pLCBmcm9tTWlsbGlzKHBlcmZvcm1hbmNlLm5vdygpKSk7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgYSB2YWx1ZSBpcyBhIHZhbGlkIE9wZW5UZWxlbWV0cnkgaHJ0aW1lIHR1cGxlLlxuICpcbiAqIEFuIGhydGltZSB0dXBsZSBpcyBhbiBBcnJheSBvZiBleGFjdGx5IHR3byBudW1iZXJzOlxuICogICBbc2Vjb25kcywgbmFub3NlY29uZHNdXG4gKlxuICogQHBhcmFtIHsqfSB2YWx1ZSDigJMgYW55dGhpbmcgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgYHZhbHVlYCBpcyBhIFtudW1iZXIsIG51bWJlcl0gYXJyYXkgb2YgbGVuZ3RoIDJcbiAqXG4gKiBAZXhhbXBsZVxuICogaXNIclRpbWUoWyAxLCA1MDAgXSk7ICAgICAgICAgLy8gdHJ1ZVxuICogaXNIclRpbWUoWyAwLCAxZTkgXSk7ICAgICAgICAgLy8gdHJ1ZVxuICogaXNIclRpbWUoWyAnMScsIDUwMCBdKTsgICAgICAgLy8gZmFsc2VcbiAqIGlzSHJUaW1lKHsgMDogMSwgMTogNTAwIH0pOyAgIC8vIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzSHJUaW1lKHZhbHVlKSB7XG4gIHJldHVybiAoXG4gICAgQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiZcbiAgICB2YWx1ZS5sZW5ndGggPT09IDIgJiZcbiAgICB0eXBlb2YgdmFsdWVbMF0gPT09ICdudW1iZXInICYmXG4gICAgdHlwZW9mIHZhbHVlWzFdID09PSAnbnVtYmVyJ1xuICApO1xufVxuXG4vKipcbiAqIE1ldGhvZHMgZm9yIGhhbmRsaW5nIGhydGltZS4gT3BlblRlbGVtZXRyeSB1c2VzIHRoZSBbc2Vjb25kcywgbmFub3NlY29uZHNdXG4gKiBmb3JtYXQgZm9yIGhydGltZSBpbiB0aGUgYFJlYWRhYmxlU3BhbmAgaW50ZXJmYWNlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgaHJ0aW1lIGZyb20gJ0B0cmFjaW5nL2hydGltZS5qcyc7XG4gKlxuICogaHJ0aW1lLmZyb21NaWxsaXMoMTAwMCk7XG4gKiBocnRpbWUudG9NaWxsaXMoWzAsIDEwMDBdKTtcbiAqIGhydGltZS5hZGQoWzAsIDBdLCBbMCwgMTAwMF0pO1xuICogaHJ0aW1lLm5vdygpO1xuICogaHJ0aW1lLmlzSHJUaW1lKFswLCAxMDAwXSk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IHsgZnJvbU1pbGxpcywgdG9NaWxsaXMsIHRvTmFub3MsIGFkZCwgbm93LCBpc0hyVGltZSB9O1xuIiwiLyoqXG4gKiBHZW5lcmF0ZSBhIHJhbmRvbSBoZXhhZGVjaW1hbCBJRCBvZiBzcGVjaWZpZWQgYnl0ZSBsZW5ndGhcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gYnl0ZXMgLSBOdW1iZXIgb2YgYnl0ZXMgZm9yIHRoZSBJRCAoZGVmYXVsdDogMTYpXG4gKiBAcmV0dXJucyB7c3RyaW5nfSAtIEhleGFkZWNpbWFsIHN0cmluZyByZXByZXNlbnRhdGlvblxuICovXG5mdW5jdGlvbiBnZW4oYnl0ZXMgPSAxNikge1xuICBsZXQgcmFuZG9tQnl0ZXMgPSBuZXcgVWludDhBcnJheShieXRlcyk7XG4gIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMocmFuZG9tQnl0ZXMpO1xuICBsZXQgcmFuZEhleCA9IEFycmF5LmZyb20ocmFuZG9tQnl0ZXMsIChieXRlKSA9PlxuICAgIGJ5dGUudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJyksXG4gICkuam9pbignJyk7XG4gIHJldHVybiByYW5kSGV4O1xufVxuXG4vKipcbiAqIFRyYWNpbmcgaWQgZ2VuZXJhdGlvbiB1dGlsc1xuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgaWQgZnJvbSAnLi9pZC5qcyc7XG4gKlxuICogY29uc3Qgc3BhbklkID0gaWQuZ2VuKDgpOyAvLyA9PiBcImExYjJjM2Q0ZTVmNi4uLlwiXG4gKi9cbmV4cG9ydCBkZWZhdWx0IHsgZ2VuIH07XG4iLCJpbXBvcnQgaWQgZnJvbSAnLi9pZC5qcyc7XG5cbmNvbnN0IFNFU1NJT05fS0VZID0gJ1JvbGxiYXJTZXNzaW9uJztcblxuZXhwb3J0IGNsYXNzIFNlc3Npb24ge1xuICBjb25zdHJ1Y3Rvcih0cmFjaW5nLCBvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLnRyYWNpbmcgPSB0cmFjaW5nO1xuICAgIHRoaXMud2luZG93ID0gdHJhY2luZy53aW5kb3c7XG4gICAgdGhpcy5zZXNzaW9uID0gbnVsbDtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKHRoaXMuc2Vzc2lvbikge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmdldFNlc3Npb24oKSB8fCB0aGlzLmNyZWF0ZVNlc3Npb24oKTtcbiAgfVxuXG4gIGdldFNlc3Npb24oKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHNlcmlhbGl6ZWRTZXNzaW9uID0gdGhpcy53aW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShTRVNTSU9OX0tFWSk7XG5cbiAgICAgIGlmICghc2VyaWFsaXplZFNlc3Npb24pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2Vzc2lvbiA9IEpTT04ucGFyc2Uoc2VyaWFsaXplZFNlc3Npb24pO1xuICAgIH0gY2F0Y2gge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgY3JlYXRlU2Vzc2lvbigpIHtcbiAgICB0aGlzLnNlc3Npb24gPSB7XG4gICAgICBpZDogaWQuZ2VuKCksXG4gICAgICBjcmVhdGVkQXQ6IERhdGUubm93KCksXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLnNldFNlc3Npb24odGhpcy5zZXNzaW9uKTtcbiAgfVxuXG4gIHNldFNlc3Npb24oc2Vzc2lvbikge1xuICAgIGNvbnN0IHNlc3Npb25TdHJpbmcgPSBKU09OLnN0cmluZ2lmeShzZXNzaW9uKTtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLndpbmRvdy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFNFU1NJT05fS0VZLCBzZXNzaW9uU3RyaW5nKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG4iLCJpbXBvcnQgaHJ0aW1lIGZyb20gJy4vaHJ0aW1lLmpzJztcblxuZXhwb3J0IGNsYXNzIFNwYW4ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdGhpcy5pbml0UmVhZGFibGVTcGFuKG9wdGlvbnMpO1xuXG4gICAgdGhpcy5zcGFuUHJvY2Vzc29yID0gb3B0aW9ucy5zcGFuUHJvY2Vzc29yO1xuICAgIHRoaXMuc3BhblByb2Nlc3Nvci5vblN0YXJ0KHRoaXMsIG9wdGlvbnMuY29udGV4dCk7XG5cbiAgICBpZiAob3B0aW9ucy5hdHRyaWJ1dGVzKSB7XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZXMob3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBpbml0UmVhZGFibGVTcGFuKG9wdGlvbnMpIHtcbiAgICB0aGlzLnNwYW4gPSB7XG4gICAgICBuYW1lOiBvcHRpb25zLm5hbWUsXG4gICAgICBraW5kOiBvcHRpb25zLmtpbmQsXG4gICAgICBzcGFuQ29udGV4dDogb3B0aW9ucy5zcGFuQ29udGV4dCxcbiAgICAgIHBhcmVudFNwYW5JZDogb3B0aW9ucy5wYXJlbnRTcGFuSWQsXG4gICAgICBzdGFydFRpbWU6IG9wdGlvbnMuc3RhcnRUaW1lIHx8IGhydGltZS5ub3coKSxcbiAgICAgIGVuZFRpbWU6IFswLCAwXSxcbiAgICAgIHN0YXR1czogeyBjb2RlOiAwLCBtZXNzYWdlOiAnJyB9LFxuICAgICAgYXR0cmlidXRlczogeyAnc2Vzc2lvbi5pZCc6IG9wdGlvbnMuc2Vzc2lvbi5pZCB9LFxuICAgICAgbGlua3M6IFtdLFxuICAgICAgZXZlbnRzOiBbXSxcbiAgICAgIGR1cmF0aW9uOiAwLFxuICAgICAgZW5kZWQ6IGZhbHNlLFxuICAgICAgcmVzb3VyY2U6IG9wdGlvbnMucmVzb3VyY2UsXG4gICAgICBpbnN0cnVtZW50YXRpb25TY29wZTogb3B0aW9ucy5zY29wZSxcbiAgICAgIGRyb3BwZWRBdHRyaWJ1dGVzQ291bnQ6IDAsXG4gICAgICBkcm9wcGVkRXZlbnRzQ291bnQ6IDAsXG4gICAgICBkcm9wcGVkTGlua3NDb3VudDogMCxcbiAgICB9O1xuICB9XG5cbiAgc3BhbkNvbnRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3Bhbi5zcGFuQ29udGV4dDtcbiAgfVxuXG4gIGdldCBzcGFuSWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3Bhbi5zcGFuQ29udGV4dC5zcGFuSWQ7XG4gIH1cblxuICBnZXQgdHJhY2VJZCgpIHtcbiAgICByZXR1cm4gdGhpcy5zcGFuLnNwYW5Db250ZXh0LnRyYWNlSWQ7XG4gIH1cblxuICBzZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IHRoaXMuZW5kZWQpIHJldHVybiB0aGlzO1xuICAgIGlmIChrZXkubGVuZ3RoID09PSAwKSByZXR1cm4gdGhpcztcblxuICAgIHRoaXMuc3Bhbi5hdHRyaWJ1dGVzW2tleV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldEF0dHJpYnV0ZXMoYXR0cmlidXRlcykge1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKGF0dHJpYnV0ZXMpKSB7XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZShrLCB2KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhZGRFdmVudChuYW1lLCBhdHRyaWJ1dGVzID0ge30sIHRpbWUpIHtcbiAgICBpZiAodGhpcy5zcGFuLmVuZGVkKSByZXR1cm4gdGhpcztcblxuICAgIHRoaXMuc3Bhbi5ldmVudHMucHVzaCh7XG4gICAgICBuYW1lLFxuICAgICAgYXR0cmlidXRlcyxcbiAgICAgIHRpbWU6IHRpbWUgfHwgaHJ0aW1lLm5vdygpLFxuICAgICAgZHJvcHBlZEF0dHJpYnV0ZXNDb3VudDogMCxcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgaXNSZWNvcmRpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3Bhbi5lbmRlZCA9PT0gZmFsc2U7XG4gIH1cblxuICBlbmQoYXR0cmlidXRlcywgdGltZSkge1xuICAgIGlmIChhdHRyaWJ1dGVzKSB0aGlzLnNldEF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XG4gICAgdGhpcy5zcGFuLmVuZFRpbWUgPSB0aW1lIHx8IGhydGltZS5ub3coKTtcbiAgICB0aGlzLnNwYW4uZW5kZWQgPSB0cnVlO1xuICAgIHRoaXMuc3BhblByb2Nlc3Nvci5vbkVuZCh0aGlzKTtcbiAgfVxuXG4gIGV4cG9ydCgpIHtcbiAgICByZXR1cm4gdGhpcy5zcGFuO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU3BhblByb2Nlc3NvciB7XG4gIGNvbnN0cnVjdG9yKGV4cG9ydGVyKSB7XG4gICAgdGhpcy5leHBvcnRlciA9IGV4cG9ydGVyO1xuICAgIHRoaXMucGVuZGluZ1NwYW5zID0gbmV3IE1hcCgpXG4gIH1cblxuICBvblN0YXJ0KHNwYW4sIF9wYXJlbnRDb250ZXh0KSB7XG4gICAgdGhpcy5wZW5kaW5nU3BhbnMuc2V0KHNwYW4uc3Bhbi5zcGFuQ29udGV4dC5zcGFuSWQsIHNwYW4pO1xuICB9XG5cbiAgb25FbmQoc3Bhbikge1xuICAgIHRoaXMuZXhwb3J0ZXIuZXhwb3J0KFtzcGFuLmV4cG9ydCgpXSlcbiAgICB0aGlzLnBlbmRpbmdTcGFucy5kZWxldGUoc3Bhbi5zcGFuLnNwYW5Db250ZXh0LnNwYW5JZCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFNwYW4gfSBmcm9tICcuL3NwYW4uanMnO1xuaW1wb3J0IGlkIGZyb20gJy4vaWQuanMnO1xuXG5leHBvcnQgY2xhc3MgVHJhY2VyIHtcbiAgY29uc3RydWN0b3IodHJhY2luZywgc3BhblByb2Nlc3Nvcikge1xuICAgIHRoaXMuc3BhblByb2Nlc3NvciA9IHNwYW5Qcm9jZXNzb3I7XG4gICAgdGhpcy50cmFjaW5nID0gdHJhY2luZztcbiAgfVxuXG4gIHN0YXJ0U3BhbihcbiAgICBuYW1lLFxuICAgIG9wdGlvbnMgPSB7fSxcbiAgICBjb250ZXh0ID0gdGhpcy50cmFjaW5nLmNvbnRleHRNYW5hZ2VyLmFjdGl2ZSgpXG4gICkge1xuICAgIGNvbnN0IHBhcmVudFNwYW4gPSB0aGlzLnRyYWNpbmcuZ2V0U3Bhbihjb250ZXh0KTtcbiAgICBjb25zdCBwYXJlbnRTcGFuQ29udGV4dCA9IHBhcmVudFNwYW4/LnNwYW5Db250ZXh0KCk7XG4gICAgY29uc3Qgc3BhbklkID0gaWQuZ2VuKDgpO1xuICAgIGxldCB0cmFjZUlkO1xuICAgIGxldCB0cmFjZUZsYWdzID0gMDtcbiAgICBsZXQgdHJhY2VTdGF0ZSA9IG51bGw7XG4gICAgbGV0IHBhcmVudFNwYW5JZDtcbiAgICBpZiAocGFyZW50U3BhbkNvbnRleHQpIHtcbiAgICAgIHRyYWNlSWQgPSBwYXJlbnRTcGFuQ29udGV4dC50cmFjZUlkO1xuICAgICAgdHJhY2VTdGF0ZSA9IHBhcmVudFNwYW5Db250ZXh0LnRyYWNlU3RhdGU7XG4gICAgICBwYXJlbnRTcGFuSWQgPSBwYXJlbnRTcGFuQ29udGV4dC5zcGFuSWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyYWNlSWQgPSBpZC5nZW4oMTYpO1xuICAgIH1cblxuICAgIGNvbnN0IGtpbmQgPSAwO1xuICAgIGNvbnN0IHNwYW5Db250ZXh0ID0geyB0cmFjZUlkLCBzcGFuSWQsIHRyYWNlRmxhZ3MsIHRyYWNlU3RhdGUgfTtcblxuICAgIGNvbnN0IHNwYW4gPSBuZXcgU3Bhbih7XG4gICAgICByZXNvdXJjZTogdGhpcy50cmFjaW5nLnJlc291cmNlLFxuICAgICAgc2NvcGU6IHRoaXMudHJhY2luZy5zY29wZSxcbiAgICAgIHNlc3Npb246IHRoaXMudHJhY2luZy5zZXNzaW9uLnNlc3Npb24sXG4gICAgICBjb250ZXh0LFxuICAgICAgc3BhbkNvbnRleHQsXG4gICAgICBuYW1lLFxuICAgICAga2luZCxcbiAgICAgIHBhcmVudFNwYW5JZCxcbiAgICAgIHNwYW5Qcm9jZXNzb3I6IHRoaXMuc3BhblByb2Nlc3NvcixcbiAgICB9KTtcbiAgICByZXR1cm4gc3BhbjtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29udGV4dE1hbmFnZXIsIGNyZWF0ZUNvbnRleHRLZXkgfSBmcm9tICcuL2NvbnRleHRNYW5hZ2VyLmpzJztcbmltcG9ydCB7IFNlc3Npb24gfSBmcm9tICcuL3Nlc3Npb24uanMnO1xuaW1wb3J0IHsgU3BhbkV4cG9ydGVyIH0gZnJvbSAnLi9leHBvcnRlci5qcyc7XG5pbXBvcnQgeyBTcGFuUHJvY2Vzc29yIH0gZnJvbSAnLi9zcGFuUHJvY2Vzc29yLmpzJztcbmltcG9ydCB7IFRyYWNlciB9IGZyb20gJy4vdHJhY2VyLmpzJztcblxuY29uc3QgU1BBTl9LRVkgPSBjcmVhdGVDb250ZXh0S2V5KCdSb2xsYmFyIENvbnRleHQgS2V5IFNQQU4nKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2luZyB7XG4gIGNvbnN0cnVjdG9yKGdXaW5kb3csIG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMud2luZG93ID0gZ1dpbmRvdztcblxuICAgIHRoaXMuc2Vzc2lvbiA9IG5ldyBTZXNzaW9uKHRoaXMsIG9wdGlvbnMpO1xuICAgIHRoaXMuY3JlYXRlVHJhY2VyKCk7XG4gIH1cblxuICBpbml0U2Vzc2lvbigpIHtcbiAgICBpZiAodGhpcy5zZXNzaW9uKSB7XG4gICAgICB0aGlzLnNlc3Npb24uaW5pdCgpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBzZXNzaW9uSWQoKSB7XG4gICAgaWYgKHRoaXMuc2Vzc2lvbikge1xuICAgICAgcmV0dXJuIHRoaXMuc2Vzc2lvbi5zZXNzaW9uLmlkO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGdldCByZXNvdXJjZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAuLi4odGhpcy5vcHRpb25zLnJlc291cmNlIHx8IHt9KSxcbiAgICAgICAgJ3JvbGxiYXIuZW52aXJvbm1lbnQnOlxuICAgICAgICAgIHRoaXMub3B0aW9ucy5wYXlsb2FkPy5lbnZpcm9ubWVudCA/PyB0aGlzLm9wdGlvbnMuZW52aXJvbm1lbnQsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBnZXQgc2NvcGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdyb2xsYmFyLWJyb3dzZXItanMnLFxuICAgICAgdmVyc2lvbjogdGhpcy5vcHRpb25zLnZlcnNpb24sXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZVRyYWNlcigpIHtcbiAgICB0aGlzLmNvbnRleHRNYW5hZ2VyID0gbmV3IENvbnRleHRNYW5hZ2VyKCk7XG4gICAgdGhpcy5leHBvcnRlciA9IG5ldyBTcGFuRXhwb3J0ZXIoKTtcbiAgICB0aGlzLnNwYW5Qcm9jZXNzb3IgPSBuZXcgU3BhblByb2Nlc3Nvcih0aGlzLmV4cG9ydGVyKTtcbiAgICB0aGlzLnRyYWNlciA9IG5ldyBUcmFjZXIodGhpcywgdGhpcy5zcGFuUHJvY2Vzc29yKTtcbiAgfVxuXG4gIGdldFRyYWNlcigpIHtcbiAgICByZXR1cm4gdGhpcy50cmFjZXI7XG4gIH1cblxuICBnZXRTcGFuKGNvbnRleHQgPSB0aGlzLmNvbnRleHRNYW5hZ2VyLmFjdGl2ZSgpKSB7XG4gICAgcmV0dXJuIGNvbnRleHQuZ2V0VmFsdWUoU1BBTl9LRVkpO1xuICB9XG5cbiAgc2V0U3Bhbihjb250ZXh0ID0gdGhpcy5jb250ZXh0TWFuYWdlci5hY3RpdmUoKSwgc3Bhbikge1xuICAgIHJldHVybiBjb250ZXh0LnNldFZhbHVlKFNQQU5fS0VZLCBzcGFuKTtcbiAgfVxuXG4gIHN0YXJ0U3BhbihuYW1lLCBvcHRpb25zID0ge30sIGNvbnRleHQgPSB0aGlzLmNvbnRleHRNYW5hZ2VyLmFjdGl2ZSgpKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhY2VyLnN0YXJ0U3BhbihuYW1lLCBvcHRpb25zLCBjb250ZXh0KTtcbiAgfVxuXG4gIHdpdGgoY29udGV4dCwgZm4sIHRoaXNBcmcsIC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0TWFuYWdlci53aXRoKGNvbnRleHQsIGZuLCB0aGlzQXJnLCAuLi5hcmdzKTtcbiAgfVxuXG4gIHdpdGhTcGFuKG5hbWUsIG9wdGlvbnMsIGZuLCB0aGlzQXJnKSB7XG4gICAgY29uc3Qgc3BhbiA9IHRoaXMuc3RhcnRTcGFuKG5hbWUsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLndpdGgoXG4gICAgICB0aGlzLnNldFNwYW4odGhpcy5jb250ZXh0TWFuYWdlci5hY3RpdmUoKSwgc3BhbiksXG4gICAgICBmbixcbiAgICAgIHRoaXNBcmcsXG4gICAgICBzcGFuLFxuICAgICk7XG4gIH1cbn1cbiIsInZhciBtZXJnZSA9IHJlcXVpcmUoJy4vbWVyZ2UnKTtcblxudmFyIFJvbGxiYXJKU09OID0ge307XG5mdW5jdGlvbiBzZXR1cEpTT04ocG9seWZpbGxKU09OKSB7XG4gIGlmIChpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnN0cmluZ2lmeSkgJiYgaXNGdW5jdGlvbihSb2xsYmFySlNPTi5wYXJzZSkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoaXNEZWZpbmVkKEpTT04pKSB7XG4gICAgLy8gSWYgcG9seWZpbGwgaXMgcHJvdmlkZWQsIHByZWZlciBpdCBvdmVyIGV4aXN0aW5nIG5vbi1uYXRpdmUgc2hpbXMuXG4gICAgaWYgKHBvbHlmaWxsSlNPTikge1xuICAgICAgaWYgKGlzTmF0aXZlRnVuY3Rpb24oSlNPTi5zdHJpbmdpZnkpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnN0cmluZ2lmeSA9IEpTT04uc3RyaW5naWZ5O1xuICAgICAgfVxuICAgICAgaWYgKGlzTmF0aXZlRnVuY3Rpb24oSlNPTi5wYXJzZSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04ucGFyc2UgPSBKU09OLnBhcnNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBlbHNlIGFjY2VwdCBhbnkgaW50ZXJmYWNlIHRoYXQgaXMgcHJlc2VudC5cbiAgICAgIGlmIChpc0Z1bmN0aW9uKEpTT04uc3RyaW5naWZ5KSkge1xuICAgICAgICBSb2xsYmFySlNPTi5zdHJpbmdpZnkgPSBKU09OLnN0cmluZ2lmeTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0Z1bmN0aW9uKEpTT04ucGFyc2UpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnBhcnNlID0gSlNPTi5wYXJzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKCFpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnN0cmluZ2lmeSkgfHwgIWlzRnVuY3Rpb24oUm9sbGJhckpTT04ucGFyc2UpKSB7XG4gICAgcG9seWZpbGxKU09OICYmIHBvbHlmaWxsSlNPTihSb2xsYmFySlNPTik7XG4gIH1cbn1cblxuLypcbiAqIGlzVHlwZSAtIEdpdmVuIGEgSmF2YXNjcmlwdCB2YWx1ZSBhbmQgYSBzdHJpbmcsIHJldHVybnMgdHJ1ZSBpZiB0aGUgdHlwZSBvZiB0aGUgdmFsdWUgbWF0Y2hlcyB0aGVcbiAqIGdpdmVuIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0geCAtIGFueSB2YWx1ZVxuICogQHBhcmFtIHQgLSBhIGxvd2VyY2FzZSBzdHJpbmcgY29udGFpbmluZyBvbmUgb2YgdGhlIGZvbGxvd2luZyB0eXBlIG5hbWVzOlxuICogICAgLSB1bmRlZmluZWRcbiAqICAgIC0gbnVsbFxuICogICAgLSBlcnJvclxuICogICAgLSBudW1iZXJcbiAqICAgIC0gYm9vbGVhblxuICogICAgLSBzdHJpbmdcbiAqICAgIC0gc3ltYm9sXG4gKiAgICAtIGZ1bmN0aW9uXG4gKiAgICAtIG9iamVjdFxuICogICAgLSBhcnJheVxuICogQHJldHVybnMgdHJ1ZSBpZiB4IGlzIG9mIHR5cGUgdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVHlwZSh4LCB0KSB7XG4gIHJldHVybiB0ID09PSB0eXBlTmFtZSh4KTtcbn1cblxuLypcbiAqIHR5cGVOYW1lIC0gR2l2ZW4gYSBKYXZhc2NyaXB0IHZhbHVlLCByZXR1cm5zIHRoZSB0eXBlIG9mIHRoZSBvYmplY3QgYXMgYSBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gdHlwZU5hbWUoeCkge1xuICB2YXIgbmFtZSA9IHR5cGVvZiB4O1xuICBpZiAobmFtZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbmFtZTtcbiAgfVxuICBpZiAoIXgpIHtcbiAgICByZXR1cm4gJ251bGwnO1xuICB9XG4gIGlmICh4IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICByZXR1cm4gJ2Vycm9yJztcbiAgfVxuICByZXR1cm4ge30udG9TdHJpbmdcbiAgICAuY2FsbCh4KVxuICAgIC5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXVxuICAgIC50b0xvd2VyQ2FzZSgpO1xufVxuXG4vKiBpc0Z1bmN0aW9uIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBhIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIGYgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIGZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbihmKSB7XG4gIHJldHVybiBpc1R5cGUoZiwgJ2Z1bmN0aW9uJyk7XG59XG5cbi8qIGlzTmF0aXZlRnVuY3Rpb24gLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIGEgbmF0aXZlIEpTIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIGYgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIG5hdGl2ZSBKUyBmdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlRnVuY3Rpb24oZikge1xuICB2YXIgcmVSZWdFeHBDaGFyID0gL1tcXFxcXiQuKis/KClbXFxde318XS9nO1xuICB2YXIgZnVuY01hdGNoU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nXG4gICAgLmNhbGwoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSlcbiAgICAucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAgIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKTtcbiAgdmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICsgZnVuY01hdGNoU3RyaW5nICsgJyQnKTtcbiAgcmV0dXJuIGlzT2JqZWN0KGYpICYmIHJlSXNOYXRpdmUudGVzdChmKTtcbn1cblxuLyogaXNPYmplY3QgLSBDaGVja3MgaWYgdGhlIGFyZ3VtZW50IGlzIGFuIG9iamVjdFxuICpcbiAqIEBwYXJhbSB2YWx1ZSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpcyB2YWx1ZSBpcyBhbiBvYmplY3QgZnVuY3Rpb24gaXMgYW4gb2JqZWN0KVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyogaXNTdHJpbmcgLSBDaGVja3MgaWYgdGhlIGFyZ3VtZW50IGlzIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHZhbHVlIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIHZhbHVlIGlzIGEgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nO1xufVxuXG4vKipcbiAqIGlzRmluaXRlTnVtYmVyIC0gZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgYSBmaW5pdGUgbnVtYmVyXG4gKlxuICogQHBhcmFtIHsqfSBuIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIHZhbHVlIGlzIGEgZmluaXRlIG51bWJlclxuICovXG5mdW5jdGlvbiBpc0Zpbml0ZU51bWJlcihuKSB7XG4gIHJldHVybiBOdW1iZXIuaXNGaW5pdGUobik7XG59XG5cbi8qXG4gKiBpc0RlZmluZWQgLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIG5vdCBlcXVhbCB0byB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0gdSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiB1IGlzIGFueXRoaW5nIG90aGVyIHRoYW4gdW5kZWZpbmVkXG4gKi9cbmZ1bmN0aW9uIGlzRGVmaW5lZCh1KSB7XG4gIHJldHVybiAhaXNUeXBlKHUsICd1bmRlZmluZWQnKTtcbn1cblxuLypcbiAqIGlzSXRlcmFibGUgLSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBjYW4gYmUgaXRlcmF0ZWQsIGVzc2VudGlhbGx5XG4gKiB3aGV0aGVyIGl0IGlzIGFuIG9iamVjdCBvciBhbiBhcnJheS5cbiAqXG4gKiBAcGFyYW0gaSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBpIGlzIGFuIG9iamVjdCBvciBhbiBhcnJheSBhcyBkZXRlcm1pbmVkIGJ5IGB0eXBlTmFtZWBcbiAqL1xuZnVuY3Rpb24gaXNJdGVyYWJsZShpKSB7XG4gIHZhciB0eXBlID0gdHlwZU5hbWUoaSk7XG4gIHJldHVybiB0eXBlID09PSAnb2JqZWN0JyB8fCB0eXBlID09PSAnYXJyYXknO1xufVxuXG4vKlxuICogaXNFcnJvciAtIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIG9mIGFuIGVycm9yIHR5cGVcbiAqXG4gKiBAcGFyYW0gZSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBlIGlzIGFuIGVycm9yXG4gKi9cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICAvLyBEZXRlY3QgYm90aCBFcnJvciBhbmQgRmlyZWZveCBFeGNlcHRpb24gdHlwZVxuICByZXR1cm4gaXNUeXBlKGUsICdlcnJvcicpIHx8IGlzVHlwZShlLCAnZXhjZXB0aW9uJyk7XG59XG5cbi8qIGlzUHJvbWlzZSAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgYSBwcm9taXNlXG4gKlxuICogQHBhcmFtIHAgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIGZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNQcm9taXNlKHApIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHApICYmIGlzVHlwZShwLnRoZW4sICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIGlzQnJvd3NlciAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIHRoZSBjb2RlIGlzIHJ1bm5pbmcgaW4gYSBicm93c2VyXG4gKlxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY29kZSBpcyBydW5uaW5nIGluIGEgYnJvd3NlciBlbnZpcm9ubWVudFxuICovXG5mdW5jdGlvbiBpc0Jyb3dzZXIoKSB7XG4gIHJldHVybiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcbn1cblxuZnVuY3Rpb24gcmVkYWN0KCkge1xuICByZXR1cm4gJyoqKioqKioqJztcbn1cblxuLy8gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS84ODA5NDcyLzExMzgxOTFcbmZ1bmN0aW9uIHV1aWQ0KCkge1xuICB2YXIgZCA9IG5vdygpO1xuICB2YXIgdXVpZCA9ICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoXG4gICAgL1t4eV0vZyxcbiAgICBmdW5jdGlvbiAoYykge1xuICAgICAgdmFyIHIgPSAoZCArIE1hdGgucmFuZG9tKCkgKiAxNikgJSAxNiB8IDA7XG4gICAgICBkID0gTWF0aC5mbG9vcihkIC8gMTYpO1xuICAgICAgcmV0dXJuIChjID09PSAneCcgPyByIDogKHIgJiAweDcpIHwgMHg4KS50b1N0cmluZygxNik7XG4gICAgfSxcbiAgKTtcbiAgcmV0dXJuIHV1aWQ7XG59XG5cbnZhciBMRVZFTFMgPSB7XG4gIGRlYnVnOiAwLFxuICBpbmZvOiAxLFxuICB3YXJuaW5nOiAyLFxuICBlcnJvcjogMyxcbiAgY3JpdGljYWw6IDQsXG59O1xuXG5mdW5jdGlvbiBzYW5pdGl6ZVVybCh1cmwpIHtcbiAgdmFyIGJhc2VVcmxQYXJ0cyA9IHBhcnNlVXJpKHVybCk7XG4gIGlmICghYmFzZVVybFBhcnRzKSB7XG4gICAgcmV0dXJuICcodW5rbm93biknO1xuICB9XG5cbiAgLy8gcmVtb3ZlIGEgdHJhaWxpbmcgIyBpZiB0aGVyZSBpcyBubyBhbmNob3JcbiAgaWYgKGJhc2VVcmxQYXJ0cy5hbmNob3IgPT09ICcnKSB7XG4gICAgYmFzZVVybFBhcnRzLnNvdXJjZSA9IGJhc2VVcmxQYXJ0cy5zb3VyY2UucmVwbGFjZSgnIycsICcnKTtcbiAgfVxuXG4gIHVybCA9IGJhc2VVcmxQYXJ0cy5zb3VyY2UucmVwbGFjZSgnPycgKyBiYXNlVXJsUGFydHMucXVlcnksICcnKTtcbiAgcmV0dXJuIHVybDtcbn1cblxudmFyIHBhcnNlVXJpT3B0aW9ucyA9IHtcbiAgc3RyaWN0TW9kZTogZmFsc2UsXG4gIGtleTogW1xuICAgICdzb3VyY2UnLFxuICAgICdwcm90b2NvbCcsXG4gICAgJ2F1dGhvcml0eScsXG4gICAgJ3VzZXJJbmZvJyxcbiAgICAndXNlcicsXG4gICAgJ3Bhc3N3b3JkJyxcbiAgICAnaG9zdCcsXG4gICAgJ3BvcnQnLFxuICAgICdyZWxhdGl2ZScsXG4gICAgJ3BhdGgnLFxuICAgICdkaXJlY3RvcnknLFxuICAgICdmaWxlJyxcbiAgICAncXVlcnknLFxuICAgICdhbmNob3InLFxuICBdLFxuICBxOiB7XG4gICAgbmFtZTogJ3F1ZXJ5S2V5JyxcbiAgICBwYXJzZXI6IC8oPzpefCYpKFteJj1dKik9PyhbXiZdKikvZyxcbiAgfSxcbiAgcGFyc2VyOiB7XG4gICAgc3RyaWN0OlxuICAgICAgL14oPzooW146XFwvPyNdKyk6KT8oPzpcXC9cXC8oKD86KChbXjpAXSopKD86OihbXjpAXSopKT8pP0ApPyhbXjpcXC8/I10qKSg/OjooXFxkKikpPykpPygoKCg/OltePyNcXC9dKlxcLykqKShbXj8jXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pLyxcbiAgICBsb29zZTpcbiAgICAgIC9eKD86KD8hW146QF0rOlteOkBcXC9dKkApKFteOlxcLz8jLl0rKTopPyg/OlxcL1xcLyk/KCg/OigoW146QF0qKSg/OjooW146QF0qKSk/KT9AKT8oW146XFwvPyNdKikoPzo6KFxcZCopKT8pKCgoXFwvKD86W14/I10oPyFbXj8jXFwvXSpcXC5bXj8jXFwvLl0rKD86Wz8jXXwkKSkpKlxcLz8pPyhbXj8jXFwvXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pLyxcbiAgfSxcbn07XG5cbmZ1bmN0aW9uIHBhcnNlVXJpKHN0cikge1xuICBpZiAoIWlzVHlwZShzdHIsICdzdHJpbmcnKSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICB2YXIgbyA9IHBhcnNlVXJpT3B0aW9ucztcbiAgdmFyIG0gPSBvLnBhcnNlcltvLnN0cmljdE1vZGUgPyAnc3RyaWN0JyA6ICdsb29zZSddLmV4ZWMoc3RyKTtcbiAgdmFyIHVyaSA9IHt9O1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gby5rZXkubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgdXJpW28ua2V5W2ldXSA9IG1baV0gfHwgJyc7XG4gIH1cblxuICB1cmlbby5xLm5hbWVdID0ge307XG4gIHVyaVtvLmtleVsxMl1dLnJlcGxhY2Uoby5xLnBhcnNlciwgZnVuY3Rpb24gKCQwLCAkMSwgJDIpIHtcbiAgICBpZiAoJDEpIHtcbiAgICAgIHVyaVtvLnEubmFtZV1bJDFdID0gJDI7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdXJpO1xufVxuXG5mdW5jdGlvbiBhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aChhY2Nlc3NUb2tlbiwgb3B0aW9ucywgcGFyYW1zKSB7XG4gIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgcGFyYW1zLmFjY2Vzc190b2tlbiA9IGFjY2Vzc1Rva2VuO1xuICB2YXIgcGFyYW1zQXJyYXkgPSBbXTtcbiAgdmFyIGs7XG4gIGZvciAoayBpbiBwYXJhbXMpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmFtcywgaykpIHtcbiAgICAgIHBhcmFtc0FycmF5LnB1c2goW2ssIHBhcmFtc1trXV0uam9pbignPScpKTtcbiAgICB9XG4gIH1cbiAgdmFyIHF1ZXJ5ID0gJz8nICsgcGFyYW1zQXJyYXkuc29ydCgpLmpvaW4oJyYnKTtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgb3B0aW9ucy5wYXRoID0gb3B0aW9ucy5wYXRoIHx8ICcnO1xuICB2YXIgcXMgPSBvcHRpb25zLnBhdGguaW5kZXhPZignPycpO1xuICB2YXIgaCA9IG9wdGlvbnMucGF0aC5pbmRleE9mKCcjJyk7XG4gIHZhciBwO1xuICBpZiAocXMgIT09IC0xICYmIChoID09PSAtMSB8fCBoID4gcXMpKSB7XG4gICAgcCA9IG9wdGlvbnMucGF0aDtcbiAgICBvcHRpb25zLnBhdGggPSBwLnN1YnN0cmluZygwLCBxcykgKyBxdWVyeSArICcmJyArIHAuc3Vic3RyaW5nKHFzICsgMSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGggIT09IC0xKSB7XG4gICAgICBwID0gb3B0aW9ucy5wYXRoO1xuICAgICAgb3B0aW9ucy5wYXRoID0gcC5zdWJzdHJpbmcoMCwgaCkgKyBxdWVyeSArIHAuc3Vic3RyaW5nKGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zLnBhdGggPSBvcHRpb25zLnBhdGggKyBxdWVyeTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0VXJsKHUsIHByb3RvY29sKSB7XG4gIHByb3RvY29sID0gcHJvdG9jb2wgfHwgdS5wcm90b2NvbDtcbiAgaWYgKCFwcm90b2NvbCAmJiB1LnBvcnQpIHtcbiAgICBpZiAodS5wb3J0ID09PSA4MCkge1xuICAgICAgcHJvdG9jb2wgPSAnaHR0cDonO1xuICAgIH0gZWxzZSBpZiAodS5wb3J0ID09PSA0NDMpIHtcbiAgICAgIHByb3RvY29sID0gJ2h0dHBzOic7XG4gICAgfVxuICB9XG4gIHByb3RvY29sID0gcHJvdG9jb2wgfHwgJ2h0dHBzOic7XG5cbiAgaWYgKCF1Lmhvc3RuYW1lKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IHByb3RvY29sICsgJy8vJyArIHUuaG9zdG5hbWU7XG4gIGlmICh1LnBvcnQpIHtcbiAgICByZXN1bHQgPSByZXN1bHQgKyAnOicgKyB1LnBvcnQ7XG4gIH1cbiAgaWYgKHUucGF0aCkge1xuICAgIHJlc3VsdCA9IHJlc3VsdCArIHUucGF0aDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnkob2JqLCBiYWNrdXApIHtcbiAgdmFyIHZhbHVlLCBlcnJvcjtcbiAgdHJ5IHtcbiAgICB2YWx1ZSA9IFJvbGxiYXJKU09OLnN0cmluZ2lmeShvYmopO1xuICB9IGNhdGNoIChqc29uRXJyb3IpIHtcbiAgICBpZiAoYmFja3VwICYmIGlzRnVuY3Rpb24oYmFja3VwKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBiYWNrdXAob2JqKTtcbiAgICAgIH0gY2F0Y2ggKGJhY2t1cEVycm9yKSB7XG4gICAgICAgIGVycm9yID0gYmFja3VwRXJyb3I7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVycm9yID0ganNvbkVycm9yO1xuICAgIH1cbiAgfVxuICByZXR1cm4geyBlcnJvcjogZXJyb3IsIHZhbHVlOiB2YWx1ZSB9O1xufVxuXG5mdW5jdGlvbiBtYXhCeXRlU2l6ZShzdHJpbmcpIHtcbiAgLy8gVGhlIHRyYW5zcG9ydCB3aWxsIHVzZSB1dGYtOCwgc28gYXNzdW1lIHV0Zi04IGVuY29kaW5nLlxuICAvL1xuICAvLyBUaGlzIG1pbmltYWwgaW1wbGVtZW50YXRpb24gd2lsbCBhY2N1cmF0ZWx5IGNvdW50IGJ5dGVzIGZvciBhbGwgVUNTLTIgYW5kXG4gIC8vIHNpbmdsZSBjb2RlIHBvaW50IFVURi0xNi4gSWYgcHJlc2VudGVkIHdpdGggbXVsdGkgY29kZSBwb2ludCBVVEYtMTYsXG4gIC8vIHdoaWNoIHNob3VsZCBiZSByYXJlLCBpdCB3aWxsIHNhZmVseSBvdmVyY291bnQsIG5vdCB1bmRlcmNvdW50LlxuICAvL1xuICAvLyBXaGlsZSByb2J1c3QgdXRmLTggZW5jb2RlcnMgZXhpc3QsIHRoaXMgaXMgZmFyIHNtYWxsZXIgYW5kIGZhciBtb3JlIHBlcmZvcm1hbnQuXG4gIC8vIEZvciBxdWlja2x5IGNvdW50aW5nIHBheWxvYWQgc2l6ZSBmb3IgdHJ1bmNhdGlvbiwgc21hbGxlciBpcyBiZXR0ZXIuXG5cbiAgdmFyIGNvdW50ID0gMDtcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBjb2RlID0gc3RyaW5nLmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGNvZGUgPCAxMjgpIHtcbiAgICAgIC8vIHVwIHRvIDcgYml0c1xuICAgICAgY291bnQgPSBjb3VudCArIDE7XG4gICAgfSBlbHNlIGlmIChjb2RlIDwgMjA0OCkge1xuICAgICAgLy8gdXAgdG8gMTEgYml0c1xuICAgICAgY291bnQgPSBjb3VudCArIDI7XG4gICAgfSBlbHNlIGlmIChjb2RlIDwgNjU1MzYpIHtcbiAgICAgIC8vIHVwIHRvIDE2IGJpdHNcbiAgICAgIGNvdW50ID0gY291bnQgKyAzO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb3VudDtcbn1cblxuZnVuY3Rpb24ganNvblBhcnNlKHMpIHtcbiAgdmFyIHZhbHVlLCBlcnJvcjtcbiAgdHJ5IHtcbiAgICB2YWx1ZSA9IFJvbGxiYXJKU09OLnBhcnNlKHMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgZXJyb3IgPSBlO1xuICB9XG4gIHJldHVybiB7IGVycm9yOiBlcnJvciwgdmFsdWU6IHZhbHVlIH07XG59XG5cbmZ1bmN0aW9uIG1ha2VVbmhhbmRsZWRTdGFja0luZm8oXG4gIG1lc3NhZ2UsXG4gIHVybCxcbiAgbGluZW5vLFxuICBjb2xubyxcbiAgZXJyb3IsXG4gIG1vZGUsXG4gIGJhY2t1cE1lc3NhZ2UsXG4gIGVycm9yUGFyc2VyLFxuKSB7XG4gIHZhciBsb2NhdGlvbiA9IHtcbiAgICB1cmw6IHVybCB8fCAnJyxcbiAgICBsaW5lOiBsaW5lbm8sXG4gICAgY29sdW1uOiBjb2xubyxcbiAgfTtcbiAgbG9jYXRpb24uZnVuYyA9IGVycm9yUGFyc2VyLmd1ZXNzRnVuY3Rpb25OYW1lKGxvY2F0aW9uLnVybCwgbG9jYXRpb24ubGluZSk7XG4gIGxvY2F0aW9uLmNvbnRleHQgPSBlcnJvclBhcnNlci5nYXRoZXJDb250ZXh0KGxvY2F0aW9uLnVybCwgbG9jYXRpb24ubGluZSk7XG4gIHZhciBocmVmID1cbiAgICB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmXG4gICAgZG9jdW1lbnQgJiZcbiAgICBkb2N1bWVudC5sb2NhdGlvbiAmJlxuICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWY7XG4gIHZhciB1c2VyYWdlbnQgPVxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgd2luZG93ICYmXG4gICAgd2luZG93Lm5hdmlnYXRvciAmJlxuICAgIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICByZXR1cm4ge1xuICAgIG1vZGU6IG1vZGUsXG4gICAgbWVzc2FnZTogZXJyb3IgPyBTdHJpbmcoZXJyb3IpIDogbWVzc2FnZSB8fCBiYWNrdXBNZXNzYWdlLFxuICAgIHVybDogaHJlZixcbiAgICBzdGFjazogW2xvY2F0aW9uXSxcbiAgICB1c2VyYWdlbnQ6IHVzZXJhZ2VudCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gd3JhcENhbGxiYWNrKGxvZ2dlciwgZikge1xuICByZXR1cm4gZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgIHRyeSB7XG4gICAgICBmKGVyciwgcmVzcCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbG9nZ2VyLmVycm9yKGUpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gbm9uQ2lyY3VsYXJDbG9uZShvYmopIHtcbiAgdmFyIHNlZW4gPSBbb2JqXTtcblxuICBmdW5jdGlvbiBjbG9uZShvYmosIHNlZW4pIHtcbiAgICB2YXIgdmFsdWUsXG4gICAgICBuYW1lLFxuICAgICAgbmV3U2VlbixcbiAgICAgIHJlc3VsdCA9IHt9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAobmFtZSBpbiBvYmopIHtcbiAgICAgICAgdmFsdWUgPSBvYmpbbmFtZV07XG5cbiAgICAgICAgaWYgKHZhbHVlICYmIChpc1R5cGUodmFsdWUsICdvYmplY3QnKSB8fCBpc1R5cGUodmFsdWUsICdhcnJheScpKSkge1xuICAgICAgICAgIGlmIChzZWVuLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgICAgICAgcmVzdWx0W25hbWVdID0gJ1JlbW92ZWQgY2lyY3VsYXIgcmVmZXJlbmNlOiAnICsgdHlwZU5hbWUodmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdTZWVuID0gc2Vlbi5zbGljZSgpO1xuICAgICAgICAgICAgbmV3U2Vlbi5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IGNsb25lKHZhbHVlLCBuZXdTZWVuKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHRbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXN1bHQgPSAnRmFpbGVkIGNsb25pbmcgY3VzdG9tIGRhdGE6ICcgKyBlLm1lc3NhZ2U7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGNsb25lKG9iaiwgc2Vlbik7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUl0ZW0oYXJncywgbG9nZ2VyLCBub3RpZmllciwgcmVxdWVzdEtleXMsIGxhbWJkYUNvbnRleHQpIHtcbiAgdmFyIG1lc3NhZ2UsIGVyciwgY3VzdG9tLCBjYWxsYmFjaywgcmVxdWVzdDtcbiAgdmFyIGFyZztcbiAgdmFyIGV4dHJhQXJncyA9IFtdO1xuICB2YXIgZGlhZ25vc3RpYyA9IHt9O1xuICB2YXIgYXJnVHlwZXMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3MubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcblxuICAgIHZhciB0eXAgPSB0eXBlTmFtZShhcmcpO1xuICAgIGFyZ1R5cGVzLnB1c2godHlwKTtcbiAgICBzd2l0Y2ggKHR5cCkge1xuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBtZXNzYWdlID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChtZXNzYWdlID0gYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgIGNhbGxiYWNrID0gd3JhcENhbGxiYWNrKGxvZ2dlciwgYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgZXh0cmFBcmdzLnB1c2goYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdlcnJvcic6XG4gICAgICBjYXNlICdkb21leGNlcHRpb24nOlxuICAgICAgY2FzZSAnZXhjZXB0aW9uJzogLy8gRmlyZWZveCBFeGNlcHRpb24gdHlwZVxuICAgICAgICBlcnIgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGVyciA9IGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGFyZyBpbnN0YW5jZW9mIEVycm9yIHx8XG4gICAgICAgICAgKHR5cGVvZiBET01FeGNlcHRpb24gIT09ICd1bmRlZmluZWQnICYmIGFyZyBpbnN0YW5jZW9mIERPTUV4Y2VwdGlvbilcbiAgICAgICAgKSB7XG4gICAgICAgICAgZXJyID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChlcnIgPSBhcmcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXF1ZXN0S2V5cyAmJiB0eXAgPT09ICdvYmplY3QnICYmICFyZXF1ZXN0KSB7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbiA9IHJlcXVlc3RLZXlzLmxlbmd0aDsgaiA8IGxlbjsgKytqKSB7XG4gICAgICAgICAgICBpZiAoYXJnW3JlcXVlc3RLZXlzW2pdXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHJlcXVlc3QgPSBhcmc7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVxdWVzdCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGN1c3RvbSA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoY3VzdG9tID0gYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoXG4gICAgICAgICAgYXJnIGluc3RhbmNlb2YgRXJyb3IgfHxcbiAgICAgICAgICAodHlwZW9mIERPTUV4Y2VwdGlvbiAhPT0gJ3VuZGVmaW5lZCcgJiYgYXJnIGluc3RhbmNlb2YgRE9NRXhjZXB0aW9uKVxuICAgICAgICApIHtcbiAgICAgICAgICBlcnIgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGVyciA9IGFyZyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZXh0cmFBcmdzLnB1c2goYXJnKTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiBjdXN0b20gaXMgYW4gYXJyYXkgdGhpcyB0dXJucyBpdCBpbnRvIGFuIG9iamVjdCB3aXRoIGludGVnZXIga2V5c1xuICBpZiAoY3VzdG9tKSBjdXN0b20gPSBub25DaXJjdWxhckNsb25lKGN1c3RvbSk7XG5cbiAgaWYgKGV4dHJhQXJncy5sZW5ndGggPiAwKSB7XG4gICAgaWYgKCFjdXN0b20pIGN1c3RvbSA9IG5vbkNpcmN1bGFyQ2xvbmUoe30pO1xuICAgIGN1c3RvbS5leHRyYUFyZ3MgPSBub25DaXJjdWxhckNsb25lKGV4dHJhQXJncyk7XG4gIH1cblxuICB2YXIgaXRlbSA9IHtcbiAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgIGVycjogZXJyLFxuICAgIGN1c3RvbTogY3VzdG9tLFxuICAgIHRpbWVzdGFtcDogbm93KCksXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgIG5vdGlmaWVyOiBub3RpZmllcixcbiAgICBkaWFnbm9zdGljOiBkaWFnbm9zdGljLFxuICAgIHV1aWQ6IHV1aWQ0KCksXG4gIH07XG5cbiAgaXRlbS5kYXRhID0gaXRlbS5kYXRhIHx8IHt9O1xuXG4gIHNldEN1c3RvbUl0ZW1LZXlzKGl0ZW0sIGN1c3RvbSk7XG5cbiAgaWYgKHJlcXVlc3RLZXlzICYmIHJlcXVlc3QpIHtcbiAgICBpdGVtLnJlcXVlc3QgPSByZXF1ZXN0O1xuICB9XG4gIGlmIChsYW1iZGFDb250ZXh0KSB7XG4gICAgaXRlbS5sYW1iZGFDb250ZXh0ID0gbGFtYmRhQ29udGV4dDtcbiAgfVxuICBpdGVtLl9vcmlnaW5hbEFyZ3MgPSBhcmdzO1xuICBpdGVtLmRpYWdub3N0aWMub3JpZ2luYWxfYXJnX3R5cGVzID0gYXJnVHlwZXM7XG4gIHJldHVybiBpdGVtO1xufVxuXG5mdW5jdGlvbiBzZXRDdXN0b21JdGVtS2V5cyhpdGVtLCBjdXN0b20pIHtcbiAgaWYgKGN1c3RvbSAmJiBjdXN0b20ubGV2ZWwgIT09IHVuZGVmaW5lZCkge1xuICAgIGl0ZW0ubGV2ZWwgPSBjdXN0b20ubGV2ZWw7XG4gICAgZGVsZXRlIGN1c3RvbS5sZXZlbDtcbiAgfVxuICBpZiAoY3VzdG9tICYmIGN1c3RvbS5za2lwRnJhbWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICBpdGVtLnNraXBGcmFtZXMgPSBjdXN0b20uc2tpcEZyYW1lcztcbiAgICBkZWxldGUgY3VzdG9tLnNraXBGcmFtZXM7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkRXJyb3JDb250ZXh0KGl0ZW0sIGVycm9ycykge1xuICB2YXIgY3VzdG9tID0gaXRlbS5kYXRhLmN1c3RvbSB8fCB7fTtcbiAgdmFyIGNvbnRleHRBZGRlZCA9IGZhbHNlO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlcnJvcnMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChlcnJvcnNbaV0uaGFzT3duUHJvcGVydHkoJ3JvbGxiYXJDb250ZXh0JykpIHtcbiAgICAgICAgY3VzdG9tID0gbWVyZ2UoY3VzdG9tLCBub25DaXJjdWxhckNsb25lKGVycm9yc1tpXS5yb2xsYmFyQ29udGV4dCkpO1xuICAgICAgICBjb250ZXh0QWRkZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEF2b2lkIGFkZGluZyBhbiBlbXB0eSBvYmplY3QgdG8gdGhlIGRhdGEuXG4gICAgaWYgKGNvbnRleHRBZGRlZCkge1xuICAgICAgaXRlbS5kYXRhLmN1c3RvbSA9IGN1c3RvbTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpdGVtLmRpYWdub3N0aWMuZXJyb3JfY29udGV4dCA9ICdGYWlsZWQ6ICcgKyBlLm1lc3NhZ2U7XG4gIH1cbn1cblxudmFyIFRFTEVNRVRSWV9UWVBFUyA9IFtcbiAgJ2xvZycsXG4gICduZXR3b3JrJyxcbiAgJ2RvbScsXG4gICduYXZpZ2F0aW9uJyxcbiAgJ2Vycm9yJyxcbiAgJ21hbnVhbCcsXG5dO1xudmFyIFRFTEVNRVRSWV9MRVZFTFMgPSBbJ2NyaXRpY2FsJywgJ2Vycm9yJywgJ3dhcm5pbmcnLCAnaW5mbycsICdkZWJ1ZyddO1xuXG5mdW5jdGlvbiBhcnJheUluY2x1ZGVzKGFyciwgdmFsKSB7XG4gIGZvciAodmFyIGsgPSAwOyBrIDwgYXJyLmxlbmd0aDsgKytrKSB7XG4gICAgaWYgKGFycltrXSA9PT0gdmFsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRlbGVtZXRyeUV2ZW50KGFyZ3MpIHtcbiAgdmFyIHR5cGUsIG1ldGFkYXRhLCBsZXZlbDtcbiAgdmFyIGFyZztcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3MubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcblxuICAgIHZhciB0eXAgPSB0eXBlTmFtZShhcmcpO1xuICAgIHN3aXRjaCAodHlwKSB7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBpZiAoIXR5cGUgJiYgYXJyYXlJbmNsdWRlcyhURUxFTUVUUllfVFlQRVMsIGFyZykpIHtcbiAgICAgICAgICB0eXBlID0gYXJnO1xuICAgICAgICB9IGVsc2UgaWYgKCFsZXZlbCAmJiBhcnJheUluY2x1ZGVzKFRFTEVNRVRSWV9MRVZFTFMsIGFyZykpIHtcbiAgICAgICAgICBsZXZlbCA9IGFyZztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIG1ldGFkYXRhID0gYXJnO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICB2YXIgZXZlbnQgPSB7XG4gICAgdHlwZTogdHlwZSB8fCAnbWFudWFsJyxcbiAgICBtZXRhZGF0YTogbWV0YWRhdGEgfHwge30sXG4gICAgbGV2ZWw6IGxldmVsLFxuICB9O1xuXG4gIHJldHVybiBldmVudDtcbn1cblxuZnVuY3Rpb24gYWRkSXRlbUF0dHJpYnV0ZXMoaXRlbSwgYXR0cmlidXRlcykge1xuICBpdGVtLmRhdGEuYXR0cmlidXRlcyA9IGl0ZW0uZGF0YS5hdHRyaWJ1dGVzIHx8IFtdO1xuICBpZiAoYXR0cmlidXRlcykge1xuICAgIGl0ZW0uZGF0YS5hdHRyaWJ1dGVzLnB1c2goLi4uYXR0cmlidXRlcyk7XG4gIH1cbn1cblxuLypcbiAqIGdldCAtIGdpdmVuIGFuIG9iai9hcnJheSBhbmQgYSBrZXlwYXRoLCByZXR1cm4gdGhlIHZhbHVlIGF0IHRoYXQga2V5cGF0aCBvclxuICogICAgICAgdW5kZWZpbmVkIGlmIG5vdCBwb3NzaWJsZS5cbiAqXG4gKiBAcGFyYW0gb2JqIC0gYW4gb2JqZWN0IG9yIGFycmF5XG4gKiBAcGFyYW0gcGF0aCAtIGEgc3RyaW5nIG9mIGtleXMgc2VwYXJhdGVkIGJ5ICcuJyBzdWNoIGFzICdwbHVnaW4uanF1ZXJ5LjAubWVzc2FnZSdcbiAqICAgIHdoaWNoIHdvdWxkIGNvcnJlc3BvbmQgdG8gNDIgaW4gYHtwbHVnaW46IHtqcXVlcnk6IFt7bWVzc2FnZTogNDJ9XX19YFxuICovXG5mdW5jdGlvbiBnZXQob2JqLCBwYXRoKSB7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICB2YXIga2V5cyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgdmFyIHJlc3VsdCA9IG9iajtcbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0ga2V5cy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0W2tleXNbaV1dO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzZXQob2JqLCBwYXRoLCB2YWx1ZSkge1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIga2V5cyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgdmFyIGxlbiA9IGtleXMubGVuZ3RoO1xuICBpZiAobGVuIDwgMSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAobGVuID09PSAxKSB7XG4gICAgb2JqW2tleXNbMF1dID0gdmFsdWU7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRyeSB7XG4gICAgdmFyIHRlbXAgPSBvYmpba2V5c1swXV0gfHwge307XG4gICAgdmFyIHJlcGxhY2VtZW50ID0gdGVtcDtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxlbiAtIDE7ICsraSkge1xuICAgICAgdGVtcFtrZXlzW2ldXSA9IHRlbXBba2V5c1tpXV0gfHwge307XG4gICAgICB0ZW1wID0gdGVtcFtrZXlzW2ldXTtcbiAgICB9XG4gICAgdGVtcFtrZXlzW2xlbiAtIDFdXSA9IHZhbHVlO1xuICAgIG9ialtrZXlzWzBdXSA9IHJlcGxhY2VtZW50O1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3NBc1N0cmluZyhhcmdzKSB7XG4gIHZhciBpLCBsZW4sIGFyZztcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKGkgPSAwLCBsZW4gPSBhcmdzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcbiAgICBzd2l0Y2ggKHR5cGVOYW1lKGFyZykpIHtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGFyZyA9IHN0cmluZ2lmeShhcmcpO1xuICAgICAgICBhcmcgPSBhcmcuZXJyb3IgfHwgYXJnLnZhbHVlO1xuICAgICAgICBpZiAoYXJnLmxlbmd0aCA+IDUwMCkge1xuICAgICAgICAgIGFyZyA9IGFyZy5zdWJzdHIoMCwgNDk3KSArICcuLi4nO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbnVsbCc6XG4gICAgICAgIGFyZyA9ICdudWxsJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICBhcmcgPSAndW5kZWZpbmVkJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzeW1ib2wnOlxuICAgICAgICBhcmcgPSBhcmcudG9TdHJpbmcoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKGFyZyk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdC5qb2luKCcgJyk7XG59XG5cbmZ1bmN0aW9uIG5vdygpIHtcbiAgaWYgKERhdGUubm93KSB7XG4gICAgcmV0dXJuICtEYXRlLm5vdygpO1xuICB9XG4gIHJldHVybiArbmV3IERhdGUoKTtcbn1cblxuZnVuY3Rpb24gZmlsdGVySXAocmVxdWVzdERhdGEsIGNhcHR1cmVJcCkge1xuICBpZiAoIXJlcXVlc3REYXRhIHx8ICFyZXF1ZXN0RGF0YVsndXNlcl9pcCddIHx8IGNhcHR1cmVJcCA9PT0gdHJ1ZSkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbmV3SXAgPSByZXF1ZXN0RGF0YVsndXNlcl9pcCddO1xuICBpZiAoIWNhcHR1cmVJcCkge1xuICAgIG5ld0lwID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICB0cnkge1xuICAgICAgdmFyIHBhcnRzO1xuICAgICAgaWYgKG5ld0lwLmluZGV4T2YoJy4nKSAhPT0gLTEpIHtcbiAgICAgICAgcGFydHMgPSBuZXdJcC5zcGxpdCgnLicpO1xuICAgICAgICBwYXJ0cy5wb3AoKTtcbiAgICAgICAgcGFydHMucHVzaCgnMCcpO1xuICAgICAgICBuZXdJcCA9IHBhcnRzLmpvaW4oJy4nKTtcbiAgICAgIH0gZWxzZSBpZiAobmV3SXAuaW5kZXhPZignOicpICE9PSAtMSkge1xuICAgICAgICBwYXJ0cyA9IG5ld0lwLnNwbGl0KCc6Jyk7XG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgdmFyIGJlZ2lubmluZyA9IHBhcnRzLnNsaWNlKDAsIDMpO1xuICAgICAgICAgIHZhciBzbGFzaElkeCA9IGJlZ2lubmluZ1syXS5pbmRleE9mKCcvJyk7XG4gICAgICAgICAgaWYgKHNsYXNoSWR4ICE9PSAtMSkge1xuICAgICAgICAgICAgYmVnaW5uaW5nWzJdID0gYmVnaW5uaW5nWzJdLnN1YnN0cmluZygwLCBzbGFzaElkeCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB0ZXJtaW5hbCA9ICcwMDAwOjAwMDA6MDAwMDowMDAwOjAwMDAnO1xuICAgICAgICAgIG5ld0lwID0gYmVnaW5uaW5nLmNvbmNhdCh0ZXJtaW5hbCkuam9pbignOicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdJcCA9IG51bGw7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbmV3SXAgPSBudWxsO1xuICAgIH1cbiAgfVxuICByZXF1ZXN0RGF0YVsndXNlcl9pcCddID0gbmV3SXA7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU9wdGlvbnMoY3VycmVudCwgaW5wdXQsIHBheWxvYWQsIGxvZ2dlcikge1xuICB2YXIgcmVzdWx0ID0gbWVyZ2UoY3VycmVudCwgaW5wdXQsIHBheWxvYWQpO1xuICByZXN1bHQgPSB1cGRhdGVEZXByZWNhdGVkT3B0aW9ucyhyZXN1bHQsIGxvZ2dlcik7XG4gIGlmICghaW5wdXQgfHwgaW5wdXQub3ZlcndyaXRlU2NydWJGaWVsZHMpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGlmIChpbnB1dC5zY3J1YkZpZWxkcykge1xuICAgIHJlc3VsdC5zY3J1YkZpZWxkcyA9IChjdXJyZW50LnNjcnViRmllbGRzIHx8IFtdKS5jb25jYXQoaW5wdXQuc2NydWJGaWVsZHMpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZURlcHJlY2F0ZWRPcHRpb25zKG9wdGlvbnMsIGxvZ2dlcikge1xuICBpZiAob3B0aW9ucy5ob3N0V2hpdGVMaXN0ICYmICFvcHRpb25zLmhvc3RTYWZlTGlzdCkge1xuICAgIG9wdGlvbnMuaG9zdFNhZmVMaXN0ID0gb3B0aW9ucy5ob3N0V2hpdGVMaXN0O1xuICAgIG9wdGlvbnMuaG9zdFdoaXRlTGlzdCA9IHVuZGVmaW5lZDtcbiAgICBsb2dnZXIgJiYgbG9nZ2VyLmxvZygnaG9zdFdoaXRlTGlzdCBpcyBkZXByZWNhdGVkLiBVc2UgaG9zdFNhZmVMaXN0LicpO1xuICB9XG4gIGlmIChvcHRpb25zLmhvc3RCbGFja0xpc3QgJiYgIW9wdGlvbnMuaG9zdEJsb2NrTGlzdCkge1xuICAgIG9wdGlvbnMuaG9zdEJsb2NrTGlzdCA9IG9wdGlvbnMuaG9zdEJsYWNrTGlzdDtcbiAgICBvcHRpb25zLmhvc3RCbGFja0xpc3QgPSB1bmRlZmluZWQ7XG4gICAgbG9nZ2VyICYmIGxvZ2dlci5sb2coJ2hvc3RCbGFja0xpc3QgaXMgZGVwcmVjYXRlZC4gVXNlIGhvc3RCbG9ja0xpc3QuJyk7XG4gIH1cbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aDogYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGgsXG4gIGNyZWF0ZUl0ZW06IGNyZWF0ZUl0ZW0sXG4gIGFkZEVycm9yQ29udGV4dDogYWRkRXJyb3JDb250ZXh0LFxuICBjcmVhdGVUZWxlbWV0cnlFdmVudDogY3JlYXRlVGVsZW1ldHJ5RXZlbnQsXG4gIGFkZEl0ZW1BdHRyaWJ1dGVzOiBhZGRJdGVtQXR0cmlidXRlcyxcbiAgZmlsdGVySXA6IGZpbHRlcklwLFxuICBmb3JtYXRBcmdzQXNTdHJpbmc6IGZvcm1hdEFyZ3NBc1N0cmluZyxcbiAgZm9ybWF0VXJsOiBmb3JtYXRVcmwsXG4gIGdldDogZ2V0LFxuICBoYW5kbGVPcHRpb25zOiBoYW5kbGVPcHRpb25zLFxuICBpc0Vycm9yOiBpc0Vycm9yLFxuICBpc0Zpbml0ZU51bWJlcjogaXNGaW5pdGVOdW1iZXIsXG4gIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gIGlzSXRlcmFibGU6IGlzSXRlcmFibGUsXG4gIGlzTmF0aXZlRnVuY3Rpb246IGlzTmF0aXZlRnVuY3Rpb24sXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc1R5cGU6IGlzVHlwZSxcbiAgaXNQcm9taXNlOiBpc1Byb21pc2UsXG4gIGlzQnJvd3NlcjogaXNCcm93c2VyLFxuICBqc29uUGFyc2U6IGpzb25QYXJzZSxcbiAgTEVWRUxTOiBMRVZFTFMsXG4gIG1ha2VVbmhhbmRsZWRTdGFja0luZm86IG1ha2VVbmhhbmRsZWRTdGFja0luZm8sXG4gIG1lcmdlOiBtZXJnZSxcbiAgbm93OiBub3csXG4gIHJlZGFjdDogcmVkYWN0LFxuICBSb2xsYmFySlNPTjogUm9sbGJhckpTT04sXG4gIHNhbml0aXplVXJsOiBzYW5pdGl6ZVVybCxcbiAgc2V0OiBzZXQsXG4gIHNldHVwSlNPTjogc2V0dXBKU09OLFxuICBzdHJpbmdpZnk6IHN0cmluZ2lmeSxcbiAgbWF4Qnl0ZVNpemU6IG1heEJ5dGVTaXplLFxuICB0eXBlTmFtZTogdHlwZU5hbWUsXG4gIHV1aWQ0OiB1dWlkNCxcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8qIGdsb2JhbHMgZXhwZWN0ICovXG4vKiBnbG9iYWxzIGRlc2NyaWJlICovXG4vKiBnbG9iYWxzIGl0ICovXG4vKiBnbG9iYWxzIHNpbm9uICovXG5cbmNvbnN0IFRlbGVtZXRlciA9IHJlcXVpcmUoJy4uL3NyYy90ZWxlbWV0cnknKTtcbmNvbnN0IFRyYWNpbmcgPSByZXF1aXJlKCcuLi9zcmMvdHJhY2luZy90cmFjaW5nJykuZGVmYXVsdDtcblxuZGVzY3JpYmUoJ1RlbGVtZXRyeSgpJywgZnVuY3Rpb24gKCkge1xuICBpdCgnc2hvdWxkIGhhdmUgYWxsIG9mIHRoZSBleHBlY3RlZCBtZXRob2RzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgIHZhciB0ID0gbmV3IFRlbGVtZXRlcihvcHRpb25zKTtcbiAgICBleHBlY3QodCkudG8uaGF2ZS5wcm9wZXJ0eSgnY29weUV2ZW50cycpO1xuICAgIGV4cGVjdCh0KS50by5oYXZlLnByb3BlcnR5KCdjYXB0dXJlJyk7XG4gICAgZXhwZWN0KHQpLnRvLmhhdmUucHJvcGVydHkoJ2NhcHR1cmVMb2cnKTtcbiAgICBleHBlY3QodCkudG8uaGF2ZS5wcm9wZXJ0eSgnY2FwdHVyZUVycm9yJyk7XG4gICAgZXhwZWN0KHQpLnRvLmhhdmUucHJvcGVydHkoJ2NhcHR1cmVOZXR3b3JrJyk7XG4gICAgZXhwZWN0KHQpLnRvLmhhdmUucHJvcGVydHkoJ2NhcHR1cmVFdmVudCcpO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnY2FwdHVyZScsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCByZXR1cm4gYSB2YWxpZCB0ZWxlbWV0cnkgZXZlbnQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBvcHRpb25zID0ge307XG4gICAgdmFyIHQgPSBuZXcgVGVsZW1ldGVyKG9wdGlvbnMpO1xuICAgIHZhciBub3cgPSArbmV3IERhdGUoKTtcbiAgICB2YXIgZXZlbnQgPSB0LmNhcHR1cmUoJ25ldHdvcmsnLCB7IHVybDogJ2EuY29tJyB9LCAnZGVidWcnKTtcbiAgICBleHBlY3QoZXZlbnQudGltZXN0YW1wX21zIC0gbm93KS50by5iZS5iZWxvdyg1MDApO1xuICAgIGV4cGVjdChldmVudC50eXBlKS50by5lcXVhbCgnbmV0d29yaycpO1xuICAgIGV4cGVjdChldmVudC5sZXZlbCkudG8uZXF1YWwoJ2RlYnVnJyk7XG4gICAgZXhwZWN0KGV2ZW50LmJvZHkudXJsKS50by5lcXVhbCgnYS5jb20nKTtcblxuICAgIGRvbmUoKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2NhcHR1cmVFdmVudCcsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCByZXR1cm4gYSB2YWxpZCB0ZWxlbWV0cnkgZXZlbnQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciB0ID0gbmV3IFRlbGVtZXRlcigpO1xuICAgIHZhciBldmVudCA9IHQuY2FwdHVyZUV2ZW50KCdsb2cnLCB7IG1lc3NhZ2U6ICdiYXInIH0sICdpbmZvJyk7XG4gICAgZXhwZWN0KGV2ZW50LnR5cGUpLnRvLmVxdWFsKCdsb2cnKTtcbiAgICBleHBlY3QoZXZlbnQubGV2ZWwpLnRvLmVxdWFsKCdpbmZvJyk7XG4gICAgZXhwZWN0KGV2ZW50LmJvZHkubWVzc2FnZSkudG8uZXF1YWwoJ2JhcicpO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnY2FwdHVyZSBldmVudHMnLCBmdW5jdGlvbiAoKSB7XG4gIGJlZm9yZUVhY2goZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHRyYWNpbmcgPSBuZXcgVHJhY2luZyhcbiAgICAgIHdpbmRvdyxcbiAgICAgIHtcbiAgICAgICAgcmVzb3VyY2U6IHtcbiAgICAgICAgICAnc2VydmljZS5uYW1lJzogJ1Rlc3QnLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICk7XG4gICAgdHJhY2luZy5pbml0U2Vzc2lvbigpO1xuICAgIHRoaXMudCA9IG5ldyBUZWxlbWV0ZXIoe2luY2x1ZGVJdGVtc0luVGVsZW1ldHJ5OiB0cnVlfSwgdHJhY2luZyk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGEgdmFsaWQgbG9nIGV2ZW50JywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSAxMjM0NS42Nzg7XG4gICAgY29uc3QgZXZlbnQgPSB0aGlzLnQuY2FwdHVyZUxvZygnZm9vJywgJ2luZm8nLCBudWxsLCB0aW1lc3RhbXApO1xuICAgIGV4cGVjdChldmVudC50eXBlKS50by5lcXVhbCgnbG9nJyk7XG4gICAgZXhwZWN0KGV2ZW50LmxldmVsKS50by5lcXVhbCgnaW5mbycpO1xuICAgIGV4cGVjdChldmVudC5ib2R5Lm1lc3NhZ2UpLnRvLmVxdWFsKCdmb28nKTtcbiAgICBleHBlY3QoZXZlbnQudGltZXN0YW1wX21zKS50by5lcXVhbCh0aW1lc3RhbXApO1xuXG4gICAgZXhwZWN0KHRoaXMudC50ZWxlbWV0cnlTcGFuKS50by5iZS5hbignb2JqZWN0Jyk7XG4gICAgY29uc3Qgb3RlbEV2ZW50ID0gdGhpcy50LnRlbGVtZXRyeVNwYW4uc3Bhbi5ldmVudHNbMF07XG4gICAgZXhwZWN0KG90ZWxFdmVudC5uYW1lKS50by5lcXVhbCgnbG9nLWV2ZW50Jyk7XG4gICAgZXhwZWN0KG90ZWxFdmVudC50aW1lKS50by5lcWwoWyAxMiwgMzQ1Njc4MDAwIF0pO1xuICAgIGV4cGVjdChvdGVsRXZlbnQuYXR0cmlidXRlcykudG8uZXFsKHsgbWVzc2FnZTogJ2ZvbycsIGxldmVsOiAnaW5mbycgfSk7XG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiBhIHZhbGlkIGVycm9yIGV2ZW50JywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSAxMjM0NS42Nzg7XG4gICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ2ZvbycpO1xuICAgIGNvbnN0IHV1aWQgPSAnMTIzNDUtNjc4OTAnO1xuICAgIGNvbnN0IGV2ZW50ID0gdGhpcy50LmNhcHR1cmVFcnJvcihlcnJvciwgJ2luZm8nLCB1dWlkLCB0aW1lc3RhbXApO1xuICAgIGV4cGVjdChldmVudC50eXBlKS50by5lcWwoJ2Vycm9yJyk7XG4gICAgZXhwZWN0KGV2ZW50LmxldmVsKS50by5lcXVhbCgnaW5mbycpO1xuICAgIGV4cGVjdChldmVudC5ib2R5Lm1lc3NhZ2UpLnRvLmVxdWFsKCdmb28nKTtcbiAgICBleHBlY3QoZXZlbnQudGltZXN0YW1wX21zKS50by5lcXVhbCh0aW1lc3RhbXApO1xuXG4gICAgZXhwZWN0KHRoaXMudC50ZWxlbWV0cnlTcGFuKS50by5iZS5hbignb2JqZWN0Jyk7XG4gICAgY29uc3Qgb3RlbEV2ZW50ID0gdGhpcy50LnRlbGVtZXRyeVNwYW4uc3Bhbi5ldmVudHNbMF07XG4gICAgZXhwZWN0KG90ZWxFdmVudC5uYW1lKS50by5lcWwoJ3JvbGxiYXItb2NjdXJyZW5jZS1ldmVudCcpO1xuICAgIGV4cGVjdChvdGVsRXZlbnQudGltZSkudG8uZXFsKFsgMTIsIDM0NTY3ODAwMCBdKTtcbiAgICBleHBlY3Qob3RlbEV2ZW50LmF0dHJpYnV0ZXMpLnRvLmVxbChcbiAgICAgIHsgdHlwZTogJ2Vycm9yJywgJ29jY3VycmVuY2UudHlwZSc6ICdlcnJvcicsIG1lc3NhZ2U6ICdmb28nLCBsZXZlbDogJ2luZm8nLCB1dWlkOiB1dWlkLCAnb2NjdXJyZW5jZS51dWlkJzogdXVpZCB9XG4gICAgKTtcbiAgICBkb25lKCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGEgdmFsaWQgbWVzc2FnZSBldmVudCcsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgY29uc3QgdGltZXN0YW1wID0gMTIzNDUuNjc4O1xuICAgIGNvbnN0IHV1aWQgPSAnMTIzNDUtNjc4OTAnO1xuICAgIGNvbnN0IGl0ZW0gPSB7IG1lc3NhZ2U6ICdmb28nLCBsZXZlbDogJ2luZm8nLCB1dWlkOiB1dWlkLCB0aW1lc3RhbXA6IHRpbWVzdGFtcCB9O1xuICAgIGNvbnN0IGV2ZW50ID0gdGhpcy50Ll9jYXB0dXJlUm9sbGJhckl0ZW0oaXRlbSk7XG4gICAgZXhwZWN0KGV2ZW50LnR5cGUpLnRvLmVxbCgnbG9nJyk7XG4gICAgZXhwZWN0KGV2ZW50LmxldmVsKS50by5lcXVhbCgnaW5mbycpO1xuICAgIGV4cGVjdChldmVudC5ib2R5Lm1lc3NhZ2UpLnRvLmVxdWFsKCdmb28nKTtcbiAgICBleHBlY3QoZXZlbnQudGltZXN0YW1wX21zKS50by5lcXVhbCh0aW1lc3RhbXApO1xuXG4gICAgZXhwZWN0KHRoaXMudC50ZWxlbWV0cnlTcGFuKS50by5iZS5hbignb2JqZWN0Jyk7XG4gICAgY29uc3Qgb3RlbEV2ZW50ID0gdGhpcy50LnRlbGVtZXRyeVNwYW4uc3Bhbi5ldmVudHNbMF07XG4gICAgZXhwZWN0KG90ZWxFdmVudC5uYW1lKS50by5lcWwoJ3JvbGxiYXItb2NjdXJyZW5jZS1ldmVudCcpO1xuICAgIGV4cGVjdChvdGVsRXZlbnQudGltZSkudG8uZXFsKFsgMTIsIDM0NTY3ODAwMCBdKTtcbiAgICBleHBlY3Qob3RlbEV2ZW50LmF0dHJpYnV0ZXMpLnRvLmVxbChcbiAgICAgIHsgdHlwZTogJ21lc3NhZ2UnLCAnb2NjdXJyZW5jZS50eXBlJzogJ21lc3NhZ2UnLCBtZXNzYWdlOiAnZm9vJywgbGV2ZWw6ICdpbmZvJywgdXVpZDogdXVpZCwgJ29jY3VycmVuY2UudXVpZCc6IHV1aWQgfVxuICAgICk7XG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiBhIHZhbGlkIG5hdmlnYXRpb24gZXZlbnQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IDEyMzQ1LjY3ODtcbiAgICBjb25zdCBmcm9tID0gJ2Zvbyc7XG4gICAgY29uc3QgdG8gPSAnYmFyJztcbiAgICBjb25zdCBldmVudCA9IHRoaXMudC5jYXB0dXJlTmF2aWdhdGlvbihmcm9tLCB0bywgbnVsbCwgdGltZXN0YW1wKTtcbiAgICBleHBlY3QoZXZlbnQudHlwZSkudG8uZXF1YWwoJ25hdmlnYXRpb24nKTtcbiAgICBleHBlY3QoZXZlbnQubGV2ZWwpLnRvLmVxdWFsKCdpbmZvJyk7XG4gICAgZXhwZWN0KGV2ZW50LmJvZHkuZnJvbSkudG8uZXF1YWwoJ2ZvbycpO1xuICAgIGV4cGVjdChldmVudC5ib2R5LnRvKS50by5lcXVhbCgnYmFyJyk7XG4gICAgZXhwZWN0KGV2ZW50LnRpbWVzdGFtcF9tcykudG8uZXF1YWwodGltZXN0YW1wKTtcblxuICAgIGV4cGVjdCh0aGlzLnQudGVsZW1ldHJ5U3BhbikudG8uYmUuYW4oJ29iamVjdCcpO1xuICAgIGNvbnN0IG90ZWxFdmVudCA9IHRoaXMudC50ZWxlbWV0cnlTcGFuLnNwYW4uZXZlbnRzWzBdO1xuICAgIGV4cGVjdChvdGVsRXZlbnQubmFtZSkudG8uZXF1YWwoJ3Nlc3Npb24tbmF2aWdhdGlvbi1ldmVudCcpO1xuICAgIGV4cGVjdChvdGVsRXZlbnQudGltZSkudG8uZXFsKFsgMTIsIDM0NTY3ODAwMCBdKTtcbiAgICBleHBlY3Qob3RlbEV2ZW50LmF0dHJpYnV0ZXMpLnRvLmVxbCh7ICdwcmV2aW91cy51cmwuZnVsbCc6ICdmb28nLCAndXJsLmZ1bGwnOiAnYmFyJyB9KTtcbiAgICBkb25lKCk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdmaWx0ZXJUZWxlbWV0cnknLCBmdW5jdGlvbiAoKSB7XG4gIGl0KFwic2hvdWxkIGZpbHRlciBvdXQgZXZlbnRzIHRoYXQgZG9uJ3QgbWF0Y2ggdGhlIHRlc3RcIiwgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIGZpbHRlclRlbGVtZXRyeTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBlLnR5cGUgPT09ICduZXR3b3JrJyAmJlxuICAgICAgICAgIChlLmJvZHkuc3VidHlwZSA9PT0gJ3hocicgfHwgZS5ib2R5LnN1YnR5cGUgPT09ICdmZXRjaCcpICYmXG4gICAgICAgICAgZS5ib2R5LnVybC5pbmRleE9mKCdodHRwczovL3NwYW1tZXIuY29tJykgPT09IDBcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgfTtcbiAgICB2YXIgdCA9IG5ldyBUZWxlbWV0ZXIob3B0aW9ucyk7XG4gICAgdmFyIGV2dCA9IHQuY2FwdHVyZShcbiAgICAgICduZXR3b3JrJyxcbiAgICAgIHsgdXJsOiAnaHR0cHM6Ly9zcGFtbWVyLmNvbScsIHN1YnR5cGU6ICd4aHInIH0sXG4gICAgICAnZGVidWcnLFxuICAgICk7XG4gICAgZXhwZWN0KGV2dCkudG8uYmUoZmFsc2UpO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGZpbHRlciBvdXQgZXZlbnRzIGluIGNvcHkgZXZlbiBpZiB0aGV5IGFyZSBtb2RpZmllZCBhZnRlciBjYXB0dXJlJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIGZpbHRlclRlbGVtZXRyeTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgcmV0dXJuIGUudHlwZSA9PT0gJ25ldHdvcmsnICYmIGUuYm9keS5zdGF0dXNDb2RlID09PSAyMDA7XG4gICAgICB9LFxuICAgIH07XG4gICAgdmFyIHQgPSBuZXcgVGVsZW1ldGVyKG9wdGlvbnMpO1xuICAgIHZhciBldnQgPSB0LmNhcHR1cmUoJ25ldHdvcmsnLCB7IHVybDogJ2h0dHBzOi8vc3BhbW1lci5jb20nIH0sICdkZWJ1ZycpO1xuICAgIHZhciBldnQyID0gdC5jYXB0dXJlKFxuICAgICAgJ25ldHdvcmsnLFxuICAgICAgeyB1cmw6ICdodHRwczovL3NwYW1tZXIuY29tJywgc3RhdHVzQ29kZTogNDA0IH0sXG4gICAgICAnZGVidWcnLFxuICAgICk7XG4gICAgZXhwZWN0KGV2dCkubm90LnRvLmJlKGZhbHNlKTtcbiAgICBleHBlY3QoZXZ0Mikubm90LnRvLmJlKGZhbHNlKTtcbiAgICB2YXIgZXZlbnRzID0gdC5jb3B5RXZlbnRzKCk7XG4gICAgZXhwZWN0KGV2ZW50cy5sZW5ndGgpLnRvLmVxdWFsKDIpO1xuXG4gICAgZXZ0LmJvZHkuc3RhdHVzQ29kZSA9IDIwMDtcblxuICAgIGV2ZW50cyA9IHQuY29weUV2ZW50cygpO1xuICAgIGV4cGVjdChldmVudHMubGVuZ3RoKS50by5lcXVhbCgxKTtcbiAgICBleHBlY3QoZXZlbnRzWzBdLmJvZHkuc3RhdHVzQ29kZSkudG8uZXF1YWwoNDA0KTtcblxuICAgIGRvbmUoKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2NvbmZpZ3VyZScsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCB0cnVuY2F0ZSBldmVudHMgdG8gbmV3IG1heCcsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7IG1heFRlbGVtZXRyeUV2ZW50czogNSB9O1xuICAgIHZhciB0ID0gbmV3IFRlbGVtZXRlcihvcHRpb25zKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICB0LmNhcHR1cmUoJ25ldHdvcmsnLCB7IHVybDogJ2EuY29tJyB9LCAnZGVidWcnKTtcbiAgICB9XG5cbiAgICBleHBlY3QodC5xdWV1ZS5sZW5ndGgpLnRvLmVxdWFsKDUpO1xuICAgIHQuY29uZmlndXJlKHsgbWF4VGVsZW1ldHJ5RXZlbnRzOiAzIH0pO1xuICAgIGV4cGVjdCh0LnF1ZXVlLmxlbmd0aCkudG8uZXF1YWwoMyk7XG4gICAgZG9uZSgpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBsZW5ndGhlbiBldmVudHMgdG8gYWxsb3cgbmV3IG1heCcsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7IG1heFRlbGVtZXRyeUV2ZW50czogMyB9O1xuICAgIHZhciB0ID0gbmV3IFRlbGVtZXRlcihvcHRpb25zKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICB0LmNhcHR1cmUoJ25ldHdvcmsnLCB7IHVybDogJ2EuY29tJyB9LCAnZGVidWcnKTtcbiAgICB9XG5cbiAgICBleHBlY3QodC5xdWV1ZS5sZW5ndGgpLnRvLmVxdWFsKDMpO1xuICAgIHQuY29uZmlndXJlKHsgbWF4VGVsZW1ldHJ5RXZlbnRzOiA1IH0pO1xuICAgIGV4cGVjdCh0LnF1ZXVlLmxlbmd0aCkudG8uZXF1YWwoMyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgIHQuY2FwdHVyZSgnbmV0d29yaycsIHsgdXJsOiAnYS5jb20nIH0sICdkZWJ1ZycpO1xuICAgIH1cbiAgICBleHBlY3QodC5xdWV1ZS5sZW5ndGgpLnRvLmVxdWFsKDUpO1xuICAgIGRvbmUoKTtcbiAgfSk7XG4gIGl0KCdkb2VzIG5vdCBkcm9wIGV4aXN0aW5nIG9wdGlvbnMgdGhhdCBhcmUgbm90IHBhc3NlZCB0byBjb25maWd1cmUnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBvcHRpb25zID0geyBtYXhUZWxlbWV0cnlFdmVudHM6IDMgfTtcbiAgICB2YXIgdCA9IG5ldyBUZWxlbWV0ZXIob3B0aW9ucyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgdC5jYXB0dXJlKCduZXR3b3JrJywgeyB1cmw6ICdhLmNvbScgfSwgJ2RlYnVnJyk7XG4gICAgfVxuXG4gICAgZXhwZWN0KHQucXVldWUubGVuZ3RoKS50by5lcXVhbCgzKTtcbiAgICB0LmNvbmZpZ3VyZSh7fSk7XG4gICAgZXhwZWN0KHQucXVldWUubGVuZ3RoKS50by5lcXVhbCgzKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgdC5jYXB0dXJlKCduZXR3b3JrJywgeyB1cmw6ICdhLmNvbScgfSwgJ2RlYnVnJyk7XG4gICAgfVxuICAgIGV4cGVjdCh0LnF1ZXVlLmxlbmd0aCkudG8uZXF1YWwoMyk7XG4gICAgZG9uZSgpO1xuICB9KTtcbn0pO1xuIl0sIm5hbWVzIjpbImhhc093biIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwidG9TdHIiLCJ0b1N0cmluZyIsImlzUGxhaW5PYmplY3QiLCJvYmoiLCJjYWxsIiwiaGFzT3duQ29uc3RydWN0b3IiLCJoYXNJc1Byb3RvdHlwZU9mIiwiY29uc3RydWN0b3IiLCJrZXkiLCJtZXJnZSIsImkiLCJzcmMiLCJjb3B5IiwiY2xvbmUiLCJuYW1lIiwicmVzdWx0IiwiY3VycmVudCIsImxlbmd0aCIsImFyZ3VtZW50cyIsIm1vZHVsZSIsImV4cG9ydHMiLCJfIiwicmVxdWlyZSIsIk1BWF9FVkVOVFMiLCJmcm9tTWlsbGlzIiwibWlsbGlzIiwiTWF0aCIsInRydW5jIiwicm91bmQiLCJUZWxlbWV0ZXIiLCJvcHRpb25zIiwidHJhY2luZyIsIl90aGlzJHRyYWNpbmciLCJxdWV1ZSIsIm1heFRlbGVtZXRyeUV2ZW50cyIsIm1heFF1ZXVlU2l6ZSIsIm1heCIsIm1pbiIsInRlbGVtZXRyeVNwYW4iLCJzdGFydFNwYW4iLCJjb25maWd1cmUiLCJvbGRPcHRpb25zIiwibmV3TWF4RXZlbnRzIiwiZGVsZXRlQ291bnQiLCJzcGxpY2UiLCJjb3B5RXZlbnRzIiwiZXZlbnRzIiwiQXJyYXkiLCJzbGljZSIsImlzRnVuY3Rpb24iLCJmaWx0ZXJUZWxlbWV0cnkiLCJlIiwiY2FwdHVyZSIsInR5cGUiLCJtZXRhZGF0YSIsImxldmVsIiwicm9sbGJhclVVSUQiLCJ0aW1lc3RhbXAiLCJnZXRMZXZlbCIsInRpbWVzdGFtcF9tcyIsIm5vdyIsImJvZHkiLCJzb3VyY2UiLCJ1dWlkIiwiZXhjIiwicHVzaCIsImNhcHR1cmVFdmVudCIsImNhcHR1cmVFcnJvciIsImVyciIsIl90aGlzJHRlbGVtZXRyeVNwYW4iLCJtZXNzYWdlIiwiU3RyaW5nIiwic3RhY2siLCJhZGRFdmVudCIsImNhcHR1cmVMb2ciLCJfdGhpcyR0ZWxlbWV0cnlTcGFuMiIsIl90aGlzJHRlbGVtZXRyeVNwYW4zIiwiY2FwdHVyZU5ldHdvcmsiLCJzdWJ0eXBlIiwicmVxdWVzdERhdGEiLCJyZXF1ZXN0IiwibGV2ZWxGcm9tU3RhdHVzIiwic3RhdHVzX2NvZGUiLCJzdGF0dXNDb2RlIiwiY2FwdHVyZURvbSIsImVsZW1lbnQiLCJ2YWx1ZSIsImNoZWNrZWQiLCJ1bmRlZmluZWQiLCJjYXB0dXJlTmF2aWdhdGlvbiIsImZyb20iLCJ0byIsIl90aGlzJHRlbGVtZXRyeVNwYW40IiwiY2FwdHVyZURvbUNvbnRlbnRMb2FkZWQiLCJ0cyIsImdldFRpbWUiLCJjYXB0dXJlTG9hZCIsImNhcHR1cmVDb25uZWN0aXZpdHlDaGFuZ2UiLCJjaGFuZ2UiLCJfY2FwdHVyZVJvbGxiYXJJdGVtIiwiaXRlbSIsImluY2x1ZGVJdGVtc0luVGVsZW1ldHJ5IiwiY3VzdG9tIiwic2hpZnQiLCJkZWZhdWx0TGV2ZWwiLCJlcnJvciIsIm1hbnVhbCIsIkNvbnRleHQiLCJwYXJlbnRDb250ZXh0IiwiX2NsYXNzQ2FsbENoZWNrIiwiX2N1cnJlbnRDb250ZXh0IiwiTWFwIiwiX2NyZWF0ZUNsYXNzIiwiZ2V0VmFsdWUiLCJnZXQiLCJzZXRWYWx1ZSIsImNvbnRleHQiLCJzZXQiLCJkZWxldGVWYWx1ZSIsInNlbGYiLCJST09UX0NPTlRFWFQiLCJDb250ZXh0TWFuYWdlciIsImN1cnJlbnRDb250ZXh0IiwiYWN0aXZlIiwiZW50ZXJDb250ZXh0IiwicHJldmlvdXNDb250ZXh0IiwiZXhpdENvbnRleHQiLCJ3aXRoIiwiZm4iLCJ0aGlzQXJnIiwiX2xlbiIsImFyZ3MiLCJfa2V5IiwiYXBwbHkiLCJjb25jYXQiLCJjcmVhdGVDb250ZXh0S2V5IiwiU3ltYm9sIiwiaHJ0aW1lIiwiU3BhbkV4cG9ydGVyIiwiZXhwb3J0Iiwic3BhbnMiLCJfcmVzdWx0Q2FsbGJhY2siLCJjb25zb2xlIiwibG9nIiwic3BhbkV4cG9ydFF1ZXVlIiwiX3RvQ29uc3VtYWJsZUFycmF5IiwidG9QYXlsb2FkIiwiX3RoaXMiLCJyZXNvdXJjZVNwYW5zIiwicmVzb3VyY2UiLCJzY29wZU1hcCIsIl9pdGVyYXRvciIsIl9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyIiwiX3N0ZXAiLCJzIiwibiIsImRvbmUiLCJzcGFuIiwic2NvcGVLZXkiLCJpbnN0cnVtZW50YXRpb25TY29wZSIsInZlcnNpb24iLCJoYXMiLCJzY29wZSIsImF0dHJpYnV0ZXMiLCJfdHJhbnNmb3JtU3BhbiIsImYiLCJfdHJhbnNmb3JtUmVzb3VyY2UiLCJzY29wZVNwYW5zIiwidmFsdWVzIiwibWFwIiwic2NvcGVEYXRhIiwiX3RyYW5zZm9ybUluc3RydW1lbnRhdGlvblNjb3BlIiwiX3RoaXMyIiwidHJhbnNmb3JtQXR0cmlidXRlcyIsImVudHJpZXMiLCJfcmVmIiwiX3JlZjIiLCJfc2xpY2VkVG9BcnJheSIsIl90cmFuc2Zvcm1BbnlWYWx1ZSIsInRyYW5zZm9ybUV2ZW50cyIsImV2ZW50IiwidGltZVVuaXhOYW5vIiwidG9OYW5vcyIsInRpbWUiLCJ0cmFjZUlkIiwic3BhbkNvbnRleHQiLCJzcGFuSWQiLCJwYXJlbnRTcGFuSWQiLCJraW5kIiwic3RhcnRUaW1lVW5peE5hbm8iLCJzdGFydFRpbWUiLCJlbmRUaW1lVW5peE5hbm8iLCJlbmRUaW1lIiwiX3RoaXMzIiwia2V5VmFsdWVzIiwiX3JlZjMiLCJfcmVmNCIsIl90aGlzNCIsImF0dHIiLCJfdGhpczUiLCJzdHJpbmdWYWx1ZSIsIl90eXBlb2YiLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJpbnRWYWx1ZSIsImRvdWJsZVZhbHVlIiwiYm9vbFZhbHVlIiwiaXNBcnJheSIsImFycmF5VmFsdWUiLCJ2Iiwia3ZsaXN0VmFsdWUiLCJfcmVmNSIsIl9yZWY2IiwiayIsInRvTWlsbGlzIiwiYWRkIiwiYSIsImIiLCJwZXJmb3JtYW5jZSIsInRpbWVPcmlnaW4iLCJpc0hyVGltZSIsImdlbiIsImJ5dGVzIiwicmFuZG9tQnl0ZXMiLCJVaW50OEFycmF5IiwiY3J5cHRvIiwiZ2V0UmFuZG9tVmFsdWVzIiwicmFuZEhleCIsImJ5dGUiLCJwYWRTdGFydCIsImpvaW4iLCJpZCIsIlNFU1NJT05fS0VZIiwiU2Vzc2lvbiIsIndpbmRvdyIsInNlc3Npb24iLCJpbml0IiwiZ2V0U2Vzc2lvbiIsImNyZWF0ZVNlc3Npb24iLCJzZXJpYWxpemVkU2Vzc2lvbiIsInNlc3Npb25TdG9yYWdlIiwiZ2V0SXRlbSIsIkpTT04iLCJwYXJzZSIsIl91bnVzZWQiLCJjcmVhdGVkQXQiLCJEYXRlIiwic2V0U2Vzc2lvbiIsInNlc3Npb25TdHJpbmciLCJzdHJpbmdpZnkiLCJzZXRJdGVtIiwiX3VudXNlZDIiLCJTcGFuIiwiaW5pdFJlYWRhYmxlU3BhbiIsInNwYW5Qcm9jZXNzb3IiLCJvblN0YXJ0Iiwic2V0QXR0cmlidXRlcyIsInN0YXR1cyIsImNvZGUiLCJsaW5rcyIsImR1cmF0aW9uIiwiZW5kZWQiLCJkcm9wcGVkQXR0cmlidXRlc0NvdW50IiwiZHJvcHBlZEV2ZW50c0NvdW50IiwiZHJvcHBlZExpbmtzQ291bnQiLCJzZXRBdHRyaWJ1dGUiLCJfaSIsIl9PYmplY3QkZW50cmllcyIsIl9PYmplY3QkZW50cmllcyRfaSIsImlzUmVjb3JkaW5nIiwiZW5kIiwib25FbmQiLCJTcGFuUHJvY2Vzc29yIiwiZXhwb3J0ZXIiLCJwZW5kaW5nU3BhbnMiLCJfcGFyZW50Q29udGV4dCIsIlRyYWNlciIsImNvbnRleHRNYW5hZ2VyIiwicGFyZW50U3BhbiIsImdldFNwYW4iLCJwYXJlbnRTcGFuQ29udGV4dCIsInRyYWNlRmxhZ3MiLCJ0cmFjZVN0YXRlIiwiU1BBTl9LRVkiLCJUcmFjaW5nIiwiZ1dpbmRvdyIsImNyZWF0ZVRyYWNlciIsImluaXRTZXNzaW9uIiwiX3RoaXMkb3B0aW9ucyRwYXlsb2FkIiwiX3RoaXMkb3B0aW9ucyRwYXlsb2FkMiIsIl9vYmplY3RTcHJlYWQiLCJwYXlsb2FkIiwiZW52aXJvbm1lbnQiLCJ0cmFjZXIiLCJnZXRUcmFjZXIiLCJzZXRTcGFuIiwiX3RoaXMkY29udGV4dE1hbmFnZXIiLCJ3aXRoU3BhbiIsImRlZmF1bHQiLCJSb2xsYmFySlNPTiIsInNldHVwSlNPTiIsInBvbHlmaWxsSlNPTiIsImlzRGVmaW5lZCIsImlzTmF0aXZlRnVuY3Rpb24iLCJpc1R5cGUiLCJ4IiwidCIsInR5cGVOYW1lIiwiRXJyb3IiLCJtYXRjaCIsInRvTG93ZXJDYXNlIiwicmVSZWdFeHBDaGFyIiwiZnVuY01hdGNoU3RyaW5nIiwiRnVuY3Rpb24iLCJyZXBsYWNlIiwicmVJc05hdGl2ZSIsIlJlZ0V4cCIsImlzT2JqZWN0IiwidGVzdCIsImlzU3RyaW5nIiwiaXNGaW5pdGVOdW1iZXIiLCJpc0Zpbml0ZSIsInUiLCJpc0l0ZXJhYmxlIiwiaXNFcnJvciIsImlzUHJvbWlzZSIsInAiLCJ0aGVuIiwiaXNCcm93c2VyIiwicmVkYWN0IiwidXVpZDQiLCJkIiwiYyIsInIiLCJyYW5kb20iLCJmbG9vciIsIkxFVkVMUyIsImRlYnVnIiwiaW5mbyIsIndhcm5pbmciLCJjcml0aWNhbCIsInNhbml0aXplVXJsIiwidXJsIiwiYmFzZVVybFBhcnRzIiwicGFyc2VVcmkiLCJhbmNob3IiLCJxdWVyeSIsInBhcnNlVXJpT3B0aW9ucyIsInN0cmljdE1vZGUiLCJxIiwicGFyc2VyIiwic3RyaWN0IiwibG9vc2UiLCJzdHIiLCJvIiwibSIsImV4ZWMiLCJ1cmkiLCJsIiwiJDAiLCIkMSIsIiQyIiwiYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGgiLCJhY2Nlc3NUb2tlbiIsInBhcmFtcyIsImFjY2Vzc190b2tlbiIsInBhcmFtc0FycmF5Iiwic29ydCIsInBhdGgiLCJxcyIsImluZGV4T2YiLCJoIiwic3Vic3RyaW5nIiwiZm9ybWF0VXJsIiwicHJvdG9jb2wiLCJwb3J0IiwiaG9zdG5hbWUiLCJiYWNrdXAiLCJqc29uRXJyb3IiLCJiYWNrdXBFcnJvciIsIm1heEJ5dGVTaXplIiwic3RyaW5nIiwiY291bnQiLCJjaGFyQ29kZUF0IiwianNvblBhcnNlIiwibWFrZVVuaGFuZGxlZFN0YWNrSW5mbyIsImxpbmVubyIsImNvbG5vIiwibW9kZSIsImJhY2t1cE1lc3NhZ2UiLCJlcnJvclBhcnNlciIsImxvY2F0aW9uIiwibGluZSIsImNvbHVtbiIsImZ1bmMiLCJndWVzc0Z1bmN0aW9uTmFtZSIsImdhdGhlckNvbnRleHQiLCJocmVmIiwiZG9jdW1lbnQiLCJ1c2VyYWdlbnQiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJ3cmFwQ2FsbGJhY2siLCJsb2dnZXIiLCJyZXNwIiwibm9uQ2lyY3VsYXJDbG9uZSIsInNlZW4iLCJuZXdTZWVuIiwiaW5jbHVkZXMiLCJjcmVhdGVJdGVtIiwibm90aWZpZXIiLCJyZXF1ZXN0S2V5cyIsImxhbWJkYUNvbnRleHQiLCJjYWxsYmFjayIsImFyZyIsImV4dHJhQXJncyIsImRpYWdub3N0aWMiLCJhcmdUeXBlcyIsInR5cCIsIkRPTUV4Y2VwdGlvbiIsImoiLCJsZW4iLCJkYXRhIiwic2V0Q3VzdG9tSXRlbUtleXMiLCJfb3JpZ2luYWxBcmdzIiwib3JpZ2luYWxfYXJnX3R5cGVzIiwic2tpcEZyYW1lcyIsImFkZEVycm9yQ29udGV4dCIsImVycm9ycyIsImNvbnRleHRBZGRlZCIsInJvbGxiYXJDb250ZXh0IiwiZXJyb3JfY29udGV4dCIsIlRFTEVNRVRSWV9UWVBFUyIsIlRFTEVNRVRSWV9MRVZFTFMiLCJhcnJheUluY2x1ZGVzIiwiYXJyIiwidmFsIiwiY3JlYXRlVGVsZW1ldHJ5RXZlbnQiLCJhZGRJdGVtQXR0cmlidXRlcyIsIl9pdGVtJGRhdGEkYXR0cmlidXRlcyIsImtleXMiLCJzcGxpdCIsInRlbXAiLCJyZXBsYWNlbWVudCIsImZvcm1hdEFyZ3NBc1N0cmluZyIsInN1YnN0ciIsImZpbHRlcklwIiwiY2FwdHVyZUlwIiwibmV3SXAiLCJwYXJ0cyIsInBvcCIsImJlZ2lubmluZyIsInNsYXNoSWR4IiwidGVybWluYWwiLCJoYW5kbGVPcHRpb25zIiwiaW5wdXQiLCJ1cGRhdGVEZXByZWNhdGVkT3B0aW9ucyIsIm92ZXJ3cml0ZVNjcnViRmllbGRzIiwic2NydWJGaWVsZHMiLCJob3N0V2hpdGVMaXN0IiwiaG9zdFNhZmVMaXN0IiwiaG9zdEJsYWNrTGlzdCIsImhvc3RCbG9ja0xpc3QiXSwic291cmNlUm9vdCI6IiJ9