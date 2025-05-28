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

/***/ "./node_modules/error-stack-parser/error-stack-parser.js":
/*!***************************************************************!*\
  !*** ./node_modules/error-stack-parser/error-stack-parser.js ***!
  \***************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! stackframe */ "./node_modules/error-stack-parser/node_modules/stackframe/stackframe.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else // removed by dead control flow
{}
}(this, function ErrorStackParser(StackFrame) {
    'use strict';

    var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
    var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
    var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/;

    return {
        /**
         * Given an Error object, extract the most information from it.
         *
         * @param {Error} error object
         * @return {Array} of StackFrames
         */
        parse: function ErrorStackParser$$parse(error) {
            if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
                return this.parseOpera(error);
            } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
                return this.parseV8OrIE(error);
            } else if (error.stack) {
                return this.parseFFOrSafari(error);
            } else {
                throw new Error('Cannot parse given Error object');
            }
        },

        // Separate line and column numbers from a string of the form: (URI:Line:Column)
        extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
            // Fail-fast but return locations like "(native)"
            if (urlLike.indexOf(':') === -1) {
                return [urlLike];
            }

            var regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
            var parts = regExp.exec(urlLike.replace(/[()]/g, ''));
            return [parts[1], parts[2] || undefined, parts[3] || undefined];
        },

        parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
            var filtered = error.stack.split('\n').filter(function(line) {
                return !!line.match(CHROME_IE_STACK_REGEXP);
            }, this);

            return filtered.map(function(line) {
                if (line.indexOf('(eval ') > -1) {
                    // Throw away eval information until we implement stacktrace.js/stackframe#8
                    line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^()]*)|(\),.*$)/g, '');
                }
                var sanitizedLine = line.replace(/^\s+/, '').replace(/\(eval code/g, '(');

                // capture and preseve the parenthesized location "(/foo/my bar.js:12:87)" in
                // case it has spaces in it, as the string is split on \s+ later on
                var location = sanitizedLine.match(/ (\((.+):(\d+):(\d+)\)$)/);

                // remove the parenthesized location from the line, if it was matched
                sanitizedLine = location ? sanitizedLine.replace(location[0], '') : sanitizedLine;

                var tokens = sanitizedLine.split(/\s+/).slice(1);
                // if a location was matched, pass it to extractLocation() otherwise pop the last token
                var locationParts = this.extractLocation(location ? location[1] : tokens.pop());
                var functionName = tokens.join(' ') || undefined;
                var fileName = ['eval', '<anonymous>'].indexOf(locationParts[0]) > -1 ? undefined : locationParts[0];

                return new StackFrame({
                    functionName: functionName,
                    fileName: fileName,
                    lineNumber: locationParts[1],
                    columnNumber: locationParts[2],
                    source: line
                });
            }, this);
        },

        parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
            var filtered = error.stack.split('\n').filter(function(line) {
                return !line.match(SAFARI_NATIVE_CODE_REGEXP);
            }, this);

            return filtered.map(function(line) {
                // Throw away eval information until we implement stacktrace.js/stackframe#8
                if (line.indexOf(' > eval') > -1) {
                    line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ':$1');
                }

                if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
                    // Safari eval frames only have function names and nothing else
                    return new StackFrame({
                        functionName: line
                    });
                } else {
                    var functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
                    var matches = line.match(functionNameRegex);
                    var functionName = matches && matches[1] ? matches[1] : undefined;
                    var locationParts = this.extractLocation(line.replace(functionNameRegex, ''));

                    return new StackFrame({
                        functionName: functionName,
                        fileName: locationParts[0],
                        lineNumber: locationParts[1],
                        columnNumber: locationParts[2],
                        source: line
                    });
                }
            }, this);
        },

        parseOpera: function ErrorStackParser$$parseOpera(e) {
            if (!e.stacktrace || (e.message.indexOf('\n') > -1 &&
                e.message.split('\n').length > e.stacktrace.split('\n').length)) {
                return this.parseOpera9(e);
            } else if (!e.stack) {
                return this.parseOpera10(e);
            } else {
                return this.parseOpera11(e);
            }
        },

        parseOpera9: function ErrorStackParser$$parseOpera9(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
            var lines = e.message.split('\n');
            var result = [];

            for (var i = 2, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(new StackFrame({
                        fileName: match[2],
                        lineNumber: match[1],
                        source: lines[i]
                    }));
                }
            }

            return result;
        },

        parseOpera10: function ErrorStackParser$$parseOpera10(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
            var lines = e.stacktrace.split('\n');
            var result = [];

            for (var i = 0, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(
                        new StackFrame({
                            functionName: match[3] || undefined,
                            fileName: match[2],
                            lineNumber: match[1],
                            source: lines[i]
                        })
                    );
                }
            }

            return result;
        },

        // Opera 10.65+ Error.stack very similar to FF/Safari
        parseOpera11: function ErrorStackParser$$parseOpera11(error) {
            var filtered = error.stack.split('\n').filter(function(line) {
                return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
            }, this);

            return filtered.map(function(line) {
                var tokens = line.split('@');
                var locationParts = this.extractLocation(tokens.pop());
                var functionCall = (tokens.shift() || '');
                var functionName = functionCall
                    .replace(/<anonymous function(: (\w+))?>/, '$2')
                    .replace(/\([^)]*\)/g, '') || undefined;
                var argsRaw;
                if (functionCall.match(/\(([^)]*)\)/)) {
                    argsRaw = functionCall.replace(/^[^(]+\(([^)]*)\)$/, '$1');
                }
                var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ?
                    undefined : argsRaw.split(',');

                return new StackFrame({
                    functionName: functionName,
                    args: args,
                    fileName: locationParts[0],
                    lineNumber: locationParts[1],
                    columnNumber: locationParts[2],
                    source: line
                });
            }, this);
        }
    };
}));


/***/ }),

/***/ "./node_modules/error-stack-parser/node_modules/stackframe/stackframe.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/error-stack-parser/node_modules/stackframe/stackframe.js ***!
  \*******************************************************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else // removed by dead control flow
{}
}(this, function() {
    'use strict';
    function _isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function _capitalize(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
    }

    function _getter(p) {
        return function() {
            return this[p];
        };
    }

    var booleanProps = ['isConstructor', 'isEval', 'isNative', 'isToplevel'];
    var numericProps = ['columnNumber', 'lineNumber'];
    var stringProps = ['fileName', 'functionName', 'source'];
    var arrayProps = ['args'];
    var objectProps = ['evalOrigin'];

    var props = booleanProps.concat(numericProps, stringProps, arrayProps, objectProps);

    function StackFrame(obj) {
        if (!obj) return;
        for (var i = 0; i < props.length; i++) {
            if (obj[props[i]] !== undefined) {
                this['set' + _capitalize(props[i])](obj[props[i]]);
            }
        }
    }

    StackFrame.prototype = {
        getArgs: function() {
            return this.args;
        },
        setArgs: function(v) {
            if (Object.prototype.toString.call(v) !== '[object Array]') {
                throw new TypeError('Args must be an Array');
            }
            this.args = v;
        },

        getEvalOrigin: function() {
            return this.evalOrigin;
        },
        setEvalOrigin: function(v) {
            if (v instanceof StackFrame) {
                this.evalOrigin = v;
            } else if (v instanceof Object) {
                this.evalOrigin = new StackFrame(v);
            } else {
                throw new TypeError('Eval Origin must be an Object or StackFrame');
            }
        },

        toString: function() {
            var fileName = this.getFileName() || '';
            var lineNumber = this.getLineNumber() || '';
            var columnNumber = this.getColumnNumber() || '';
            var functionName = this.getFunctionName() || '';
            if (this.getIsEval()) {
                if (fileName) {
                    return '[eval] (' + fileName + ':' + lineNumber + ':' + columnNumber + ')';
                }
                return '[eval]:' + lineNumber + ':' + columnNumber;
            }
            if (functionName) {
                return functionName + ' (' + fileName + ':' + lineNumber + ':' + columnNumber + ')';
            }
            return fileName + ':' + lineNumber + ':' + columnNumber;
        }
    };

    StackFrame.fromString = function StackFrame$$fromString(str) {
        var argsStartIndex = str.indexOf('(');
        var argsEndIndex = str.lastIndexOf(')');

        var functionName = str.substring(0, argsStartIndex);
        var args = str.substring(argsStartIndex + 1, argsEndIndex).split(',');
        var locationString = str.substring(argsEndIndex + 1);

        if (locationString.indexOf('@') === 0) {
            var parts = /@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(locationString, '');
            var fileName = parts[1];
            var lineNumber = parts[2];
            var columnNumber = parts[3];
        }

        return new StackFrame({
            functionName: functionName,
            args: args || undefined,
            fileName: fileName,
            lineNumber: lineNumber || undefined,
            columnNumber: columnNumber || undefined
        });
    };

    for (var i = 0; i < booleanProps.length; i++) {
        StackFrame.prototype['get' + _capitalize(booleanProps[i])] = _getter(booleanProps[i]);
        StackFrame.prototype['set' + _capitalize(booleanProps[i])] = (function(p) {
            return function(v) {
                this[p] = Boolean(v);
            };
        })(booleanProps[i]);
    }

    for (var j = 0; j < numericProps.length; j++) {
        StackFrame.prototype['get' + _capitalize(numericProps[j])] = _getter(numericProps[j]);
        StackFrame.prototype['set' + _capitalize(numericProps[j])] = (function(p) {
            return function(v) {
                if (!_isNumber(v)) {
                    throw new TypeError(p + ' must be a Number');
                }
                this[p] = Number(v);
            };
        })(numericProps[j]);
    }

    for (var k = 0; k < stringProps.length; k++) {
        StackFrame.prototype['get' + _capitalize(stringProps[k])] = _getter(stringProps[k]);
        StackFrame.prototype['set' + _capitalize(stringProps[k])] = (function(p) {
            return function(v) {
                this[p] = String(v);
            };
        })(stringProps[k]);
    }

    return StackFrame;
}));


/***/ }),

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

/***/ "./src/browser/core.js":
/*!*****************************!*\
  !*** ./src/browser/core.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Client = __webpack_require__(/*! ../rollbar */ "./src/rollbar.js");
var _ = __webpack_require__(/*! ../utility */ "./src/utility.js");
var API = __webpack_require__(/*! ../api */ "./src/api.js");
var logger = __webpack_require__(/*! ./logger */ "./src/browser/logger.js");
var globals = __webpack_require__(/*! ./globalSetup */ "./src/browser/globalSetup.js");
var Transport = __webpack_require__(/*! ./transport */ "./src/browser/transport.js");
var urllib = __webpack_require__(/*! ./url */ "./src/browser/url.js");
var transforms = __webpack_require__(/*! ./transforms */ "./src/browser/transforms.js");
var sharedTransforms = __webpack_require__(/*! ../transforms */ "./src/transforms.js");
var predicates = __webpack_require__(/*! ./predicates */ "./src/browser/predicates.js");
var sharedPredicates = __webpack_require__(/*! ../predicates */ "./src/predicates.js");
var errorParser = __webpack_require__(/*! ../errorParser */ "./src/errorParser.js");
var recorderDefaults = __webpack_require__(/*! ./replay/defaults */ "./src/browser/replay/defaults.js");
var tracingDefaults = __webpack_require__(/*! ../tracing/defaults */ "./src/tracing/defaults.js");
var ReplayMap = (__webpack_require__(/*! ./replay/replayMap */ "./src/browser/replay/replayMap.js")["default"]);
function Rollbar(options, client) {
  this.options = _.handleOptions(defaultOptions, options, null, logger);
  this.options._configuredOptions = options;
  var Telemeter = this.components.telemeter;
  var Instrumenter = this.components.instrumenter;
  var polyfillJSON = this.components.polyfillJSON;
  this.wrapGlobals = this.components.wrapGlobals;
  this.scrub = this.components.scrub;
  var truncation = this.components.truncation;
  var Tracing = this.components.tracing;
  var Recorder = this.components.recorder;
  var transport = new Transport(truncation);
  var api = new API(this.options, transport, urllib, truncation);
  if (Tracing) {
    this.tracing = new Tracing(_gWindow(), this.options);
    this.tracing.initSession();
  }
  if (Recorder && _.isBrowser()) {
    var recorderOptions = this.options.recorder;
    this.recorder = new Recorder(recorderOptions);
    this.replayMap = new ReplayMap({
      recorder: this.recorder,
      api: api,
      tracing: this.tracing
    });
    if (recorderOptions.enabled && recorderOptions.autoStart) {
      this.recorder.start();
    }
  }
  if (Telemeter) {
    this.telemeter = new Telemeter(this.options, this.tracing);
  }
  this.client = client || new Client(this.options, api, logger, this.telemeter, this.tracing, this.replayMap, 'browser');
  var gWindow = _gWindow();
  var gDocument = typeof document != 'undefined' && document;
  this.isChrome = gWindow.chrome && gWindow.chrome.runtime; // check .runtime to avoid Edge browsers
  this.anonymousErrorsPending = 0;
  addTransformsToNotifier(this.client.notifier, this, gWindow);
  addPredicatesToQueue(this.client.queue);
  this.setupUnhandledCapture();
  if (Instrumenter) {
    this.instrumenter = new Instrumenter(this.options, this.client.telemeter, this, gWindow, gDocument);
    this.instrumenter.instrument();
  }
  _.setupJSON(polyfillJSON);

  // Used with rollbar-react for rollbar-react-native compatibility.
  this.rollbar = this;
}
var _instance = null;
Rollbar.init = function (options, client) {
  if (_instance) {
    return _instance.global(options).configure(options);
  }
  _instance = new Rollbar(options, client);
  return _instance;
};
Rollbar.prototype.components = {};
Rollbar.setComponents = function (components) {
  Rollbar.prototype.components = components;
};
function handleUninitialized(maybeCallback) {
  var message = 'Rollbar is not initialized';
  logger.error(message);
  if (maybeCallback) {
    maybeCallback(new Error(message));
  }
}
Rollbar.prototype.global = function (options) {
  this.client.global(options);
  return this;
};
Rollbar.global = function (options) {
  if (_instance) {
    return _instance.global(options);
  } else {
    handleUninitialized();
  }
};
Rollbar.prototype.configure = function (options, payloadData) {
  var _this$recorder;
  var oldOptions = this.options;
  var payload = {};
  if (payloadData) {
    payload = {
      payload: payloadData
    };
  }
  this.options = _.handleOptions(oldOptions, options, payload, logger);
  this.options._configuredOptions = _.handleOptions(oldOptions._configuredOptions, options, payload);
  (_this$recorder = this.recorder) === null || _this$recorder === void 0 || _this$recorder.configure(this.options);
  this.client.configure(this.options, payloadData);
  this.instrumenter && this.instrumenter.configure(this.options);
  this.setupUnhandledCapture();
  return this;
};
Rollbar.configure = function (options, payloadData) {
  if (_instance) {
    return _instance.configure(options, payloadData);
  } else {
    handleUninitialized();
  }
};
Rollbar.prototype.lastError = function () {
  return this.client.lastError;
};
Rollbar.lastError = function () {
  if (_instance) {
    return _instance.lastError();
  } else {
    handleUninitialized();
  }
};
Rollbar.prototype.log = function () {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.log(item);
  return {
    uuid: uuid
  };
};
Rollbar.log = function () {
  if (_instance) {
    return _instance.log.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};
Rollbar.prototype.debug = function () {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.debug(item);
  return {
    uuid: uuid
  };
};
Rollbar.debug = function () {
  if (_instance) {
    return _instance.debug.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};
Rollbar.prototype.info = function () {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.info(item);
  return {
    uuid: uuid
  };
};
Rollbar.info = function () {
  if (_instance) {
    return _instance.info.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};
Rollbar.prototype.warn = function () {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.warn(item);
  return {
    uuid: uuid
  };
};
Rollbar.warn = function () {
  if (_instance) {
    return _instance.warn.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};
Rollbar.prototype.warning = function () {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.warning(item);
  return {
    uuid: uuid
  };
};
Rollbar.warning = function () {
  if (_instance) {
    return _instance.warning.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};
Rollbar.prototype.error = function () {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.error(item);
  return {
    uuid: uuid
  };
};
Rollbar.error = function () {
  if (_instance) {
    return _instance.error.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};
Rollbar.prototype.critical = function () {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.critical(item);
  return {
    uuid: uuid
  };
};
Rollbar.critical = function () {
  if (_instance) {
    return _instance.critical.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};
Rollbar.prototype.buildJsonPayload = function (item) {
  return this.client.buildJsonPayload(item);
};
Rollbar.buildJsonPayload = function () {
  if (_instance) {
    return _instance.buildJsonPayload.apply(_instance, arguments);
  } else {
    handleUninitialized();
  }
};
Rollbar.prototype.sendJsonPayload = function (jsonPayload) {
  return this.client.sendJsonPayload(jsonPayload);
};
Rollbar.sendJsonPayload = function () {
  if (_instance) {
    return _instance.sendJsonPayload.apply(_instance, arguments);
  } else {
    handleUninitialized();
  }
};
Rollbar.prototype.setupUnhandledCapture = function () {
  var gWindow = _gWindow();
  if (!this.unhandledExceptionsInitialized) {
    if (this.options.captureUncaught || this.options.handleUncaughtExceptions) {
      globals.captureUncaughtExceptions(gWindow, this);
      if (this.wrapGlobals && this.options.wrapGlobalEventHandlers) {
        this.wrapGlobals(gWindow, this);
      }
      this.unhandledExceptionsInitialized = true;
    }
  }
  if (!this.unhandledRejectionsInitialized) {
    if (this.options.captureUnhandledRejections || this.options.handleUnhandledRejections) {
      globals.captureUnhandledRejections(gWindow, this);
      this.unhandledRejectionsInitialized = true;
    }
  }
};
Rollbar.prototype.handleUncaughtException = function (message, url, lineno, colno, error, context) {
  if (!this.options.captureUncaught && !this.options.handleUncaughtExceptions) {
    return;
  }

  // Chrome will always send 5+ arguments and error will be valid or null, not undefined.
  // If error is undefined, we have a different caller.
  // Chrome also sends errors from web workers with null error, but does not invoke
  // prepareStackTrace() for these. Test for empty url to skip them.
  if (this.options.inspectAnonymousErrors && this.isChrome && error === null && url === '') {
    return 'anonymous';
  }
  var item;
  var stackInfo = _.makeUnhandledStackInfo(message, url, lineno, colno, error, 'onerror', 'uncaught exception', errorParser);
  if (_.isError(error)) {
    item = this._createItem([message, error, context]);
    item._unhandledStackInfo = stackInfo;
  } else if (_.isError(url)) {
    item = this._createItem([message, url, context]);
    item._unhandledStackInfo = stackInfo;
  } else {
    item = this._createItem([message, context]);
    item.stackInfo = stackInfo;
  }
  item.level = this.options.uncaughtErrorLevel;
  item._isUncaught = true;
  this.client.log(item);
};

/**
 * Chrome only. Other browsers will ignore.
 *
 * Use Error.prepareStackTrace to extract information about errors that
 * do not have a valid error object in onerror().
 *
 * In tested version of Chrome, onerror is called first but has no way
 * to communicate with prepareStackTrace. Use a counter to let this
 * handler know which errors to send to Rollbar.
 *
 * In config options, set inspectAnonymousErrors to enable.
 */
Rollbar.prototype.handleAnonymousErrors = function () {
  if (!this.options.inspectAnonymousErrors || !this.isChrome) {
    return;
  }
  var r = this;
  function prepareStackTrace(error, _stack) {
    if (r.options.inspectAnonymousErrors) {
      if (r.anonymousErrorsPending) {
        // This is the only known way to detect that onerror saw an anonymous error.
        // It depends on onerror reliably being called before Error.prepareStackTrace,
        // which so far holds true on tested versions of Chrome. If versions of Chrome
        // are tested that behave differently, this logic will need to be updated
        // accordingly.
        r.anonymousErrorsPending -= 1;
        if (!error) {
          // Not likely to get here, but calling handleUncaughtException from here
          // without an error object would throw off the anonymousErrorsPending counter,
          // so return now.
          return;
        }

        // Allow this to be tracked later.
        error._isAnonymous = true;

        // url, lineno, colno shouldn't be needed for these errors.
        // If that changes, update this accordingly, using the unused
        // _stack param as needed (rather than parse error.toString()).
        r.handleUncaughtException(error.message, null, null, null, error);
      }
    }

    // Workaround to ensure stack is preserved for normal errors.
    return error.stack;
  }

  // https://v8.dev/docs/stack-trace-api
  try {
    Error.prepareStackTrace = prepareStackTrace;
  } catch (e) {
    this.options.inspectAnonymousErrors = false;
    this.error('anonymous error handler failed', e);
  }
};
Rollbar.prototype.handleUnhandledRejection = function (reason, promise) {
  if (!this.options.captureUnhandledRejections && !this.options.handleUnhandledRejections) {
    return;
  }
  var message = 'unhandled rejection was null or undefined!';
  if (reason) {
    if (reason.message) {
      message = reason.message;
    } else {
      var reasonResult = _.stringify(reason);
      if (reasonResult.value) {
        message = reasonResult.value;
      }
    }
  }
  var context = reason && reason._rollbarContext || promise && promise._rollbarContext;
  var item;
  if (_.isError(reason)) {
    item = this._createItem([message, reason, context]);
  } else {
    item = this._createItem([message, reason, context]);
    item.stackInfo = _.makeUnhandledStackInfo(message, '', 0, 0, null, 'unhandledrejection', '', errorParser);
  }
  item.level = this.options.uncaughtErrorLevel;
  item._isUncaught = true;
  item._originalArgs = item._originalArgs || [];
  item._originalArgs.push(promise);
  this.client.log(item);
};
Rollbar.prototype.wrap = function (f, context, _before) {
  try {
    var ctxFn;
    if (_.isFunction(context)) {
      ctxFn = context;
    } else {
      ctxFn = function ctxFn() {
        return context || {};
      };
    }
    if (!_.isFunction(f)) {
      return f;
    }
    if (f._isWrap) {
      return f;
    }
    if (!f._rollbar_wrapped) {
      f._rollbar_wrapped = function () {
        if (_before && _.isFunction(_before)) {
          _before.apply(this, arguments);
        }
        try {
          return f.apply(this, arguments);
        } catch (exc) {
          var e = exc;
          if (e && window._rollbarWrappedError !== e) {
            if (_.isType(e, 'string')) {
              e = new String(e);
            }
            e._rollbarContext = ctxFn() || {};
            e._rollbarContext._wrappedSource = f.toString();
            window._rollbarWrappedError = e;
          }
          throw e;
        }
      };
      f._rollbar_wrapped._isWrap = true;
      if (f.hasOwnProperty) {
        for (var prop in f) {
          if (f.hasOwnProperty(prop) && prop !== '_rollbar_wrapped') {
            f._rollbar_wrapped[prop] = f[prop];
          }
        }
      }
    }
    return f._rollbar_wrapped;
  } catch (e) {
    // Return the original function if the wrap fails.
    return f;
  }
};
Rollbar.wrap = function (f, context) {
  if (_instance) {
    return _instance.wrap(f, context);
  } else {
    handleUninitialized();
  }
};
Rollbar.prototype.captureEvent = function () {
  var event = _.createTelemetryEvent(arguments);
  return this.client.captureEvent(event.type, event.metadata, event.level);
};
Rollbar.captureEvent = function () {
  if (_instance) {
    return _instance.captureEvent.apply(_instance, arguments);
  } else {
    handleUninitialized();
  }
};

// The following two methods are used internally and are not meant for public use
Rollbar.prototype.captureDomContentLoaded = function (e, ts) {
  if (!ts) {
    ts = new Date();
  }
  return this.client.captureDomContentLoaded(ts);
};
Rollbar.prototype.captureLoad = function (e, ts) {
  if (!ts) {
    ts = new Date();
  }
  return this.client.captureLoad(ts);
};

/* Internal */

function addTransformsToNotifier(notifier, rollbar, gWindow) {
  notifier.addTransform(transforms.handleDomException).addTransform(transforms.handleItemWithError).addTransform(transforms.ensureItemHasSomethingToSay).addTransform(transforms.addBaseInfo).addTransform(transforms.addRequestInfo(gWindow)).addTransform(transforms.addClientInfo(gWindow)).addTransform(transforms.addPluginInfo(gWindow)).addTransform(transforms.addBody).addTransform(sharedTransforms.addMessageWithError).addTransform(sharedTransforms.addTelemetryData).addTransform(sharedTransforms.addConfigToPayload).addTransform(transforms.addScrubber(rollbar.scrub)).addTransform(sharedTransforms.addPayloadOptions).addTransform(sharedTransforms.userTransform(logger)).addTransform(sharedTransforms.addConfiguredOptions).addTransform(sharedTransforms.addDiagnosticKeys).addTransform(sharedTransforms.itemToPayload);
}
function addPredicatesToQueue(queue) {
  queue.addPredicate(sharedPredicates.checkLevel).addPredicate(predicates.checkIgnore).addPredicate(sharedPredicates.userCheckIgnore(logger)).addPredicate(sharedPredicates.urlIsNotBlockListed(logger)).addPredicate(sharedPredicates.urlIsSafeListed(logger)).addPredicate(sharedPredicates.messageIsIgnored(logger));
}
Rollbar.prototype.loadFull = function () {
  logger.info('Unexpected Rollbar.loadFull() called on a Notifier instance. This can happen when Rollbar is loaded multiple times.');
};
Rollbar.prototype._createItem = function (args) {
  return _.createItem(args, logger, this);
};
function _getFirstFunction(args) {
  for (var i = 0, len = args.length; i < len; ++i) {
    if (_.isFunction(args[i])) {
      return args[i];
    }
  }
  return undefined;
}
function _gWindow() {
  return typeof window != 'undefined' && window || typeof self != 'undefined' && self;
}
var defaults = __webpack_require__(/*! ../defaults */ "./src/defaults.js");
var scrubFields = __webpack_require__(/*! ./defaults/scrubFields */ "./src/browser/defaults/scrubFields.js");
var defaultOptions = {
  version: defaults.version,
  scrubFields: scrubFields.scrubFields,
  logLevel: defaults.logLevel,
  reportLevel: defaults.reportLevel,
  uncaughtErrorLevel: defaults.uncaughtErrorLevel,
  endpoint: defaults.endpoint,
  verbose: false,
  enabled: true,
  transmit: true,
  sendConfig: false,
  includeItemsInTelemetry: true,
  captureIp: true,
  inspectAnonymousErrors: true,
  ignoreDuplicateErrors: true,
  wrapGlobalEventHandlers: false,
  recorder: recorderDefaults,
  tracing: tracingDefaults
};
module.exports = Rollbar;

/***/ }),

/***/ "./src/browser/defaults/scrubFields.js":
/*!*********************************************!*\
  !*** ./src/browser/defaults/scrubFields.js ***!
  \*********************************************/
/***/ ((module) => {

module.exports = {
  scrubFields: ['pw', 'pass', 'passwd', 'password', 'secret', 'confirm_password', 'confirmPassword', 'password_confirmation', 'passwordConfirmation', 'access_token', 'accessToken', 'X-Rollbar-Access-Token', 'secret_key', 'secretKey', 'secretToken', 'cc-number', 'card number', 'cardnumber', 'cardnum', 'ccnum', 'ccnumber', 'cc num', 'creditcardnumber', 'credit card number', 'newcreditcardnumber', 'new credit card', 'creditcardno', 'credit card no', 'card#', 'card #', 'cc-csc', 'cvc', 'cvc2', 'cvv2', 'ccv2', 'security code', 'card verification', 'name on credit card', 'name on card', 'nameoncard', 'cardholder', 'card holder', 'name des karteninhabers', 'ccname', 'card type', 'cardtype', 'cc type', 'cctype', 'payment type', 'expiration date', 'expirationdate', 'expdate', 'cc-exp', 'ccmonth', 'ccyear']
};

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

/***/ "./src/browser/globalSetup.js":
/*!************************************!*\
  !*** ./src/browser/globalSetup.js ***!
  \************************************/
/***/ ((module) => {

function captureUncaughtExceptions(window, handler, shim) {
  if (!window) {
    return;
  }
  var oldOnError;
  if (typeof handler._rollbarOldOnError === 'function') {
    oldOnError = handler._rollbarOldOnError;
  } else if (window.onerror) {
    oldOnError = window.onerror;
    while (oldOnError._rollbarOldOnError) {
      oldOnError = oldOnError._rollbarOldOnError;
    }
    handler._rollbarOldOnError = oldOnError;
  }
  handler.handleAnonymousErrors();
  var fn = function fn() {
    var args = Array.prototype.slice.call(arguments, 0);
    _rollbarWindowOnError(window, handler, oldOnError, args);
  };
  if (shim) {
    fn._rollbarOldOnError = oldOnError;
  }
  window.onerror = fn;
}
function _rollbarWindowOnError(window, r, old, args) {
  if (window._rollbarWrappedError) {
    if (!args[4]) {
      args[4] = window._rollbarWrappedError;
    }
    if (!args[5]) {
      args[5] = window._rollbarWrappedError._rollbarContext;
    }
    window._rollbarWrappedError = null;
  }
  var ret = r.handleUncaughtException.apply(r, args);
  if (old) {
    old.apply(window, args);
  }

  // Let other chained onerror handlers above run before setting this.
  // If an error is thrown and caught within a chained onerror handler,
  // Error.prepareStackTrace() will see that one before the one we want.
  if (ret === 'anonymous') {
    r.anonymousErrorsPending += 1; // See Rollbar.prototype.handleAnonymousErrors()
  }
}
function captureUnhandledRejections(window, handler, shim) {
  if (!window) {
    return;
  }
  if (typeof window._rollbarURH === 'function' && window._rollbarURH.belongsToShim) {
    window.removeEventListener('unhandledrejection', window._rollbarURH);
  }
  var rejectionHandler = function rejectionHandler(evt) {
    var reason, promise, detail;
    try {
      reason = evt.reason;
    } catch (e) {
      reason = undefined;
    }
    try {
      promise = evt.promise;
    } catch (e) {
      promise = '[unhandledrejection] error getting `promise` from event';
    }
    try {
      detail = evt.detail;
      if (!reason && detail) {
        reason = detail.reason;
        promise = detail.promise;
      }
    } catch (e) {
      // Ignore
    }
    if (!reason) {
      reason = '[unhandledrejection] error getting `reason` from event';
    }
    if (handler && handler.handleUnhandledRejection) {
      handler.handleUnhandledRejection(reason, promise);
    }
  };
  rejectionHandler.belongsToShim = shim;
  window._rollbarURH = rejectionHandler;
  window.addEventListener('unhandledrejection', rejectionHandler);
}
module.exports = {
  captureUncaughtExceptions: captureUncaughtExceptions,
  captureUnhandledRejections: captureUnhandledRejections
};

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

/***/ "./src/browser/replay/defaults.js":
/*!****************************************!*\
  !*** ./src/browser/replay/defaults.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Default options for the rrweb recorder
 * See https://github.com/rrweb-io/rrweb/blob/master/guide.md#options for details
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  enabled: false,
  // Whether recording is enabled
  autoStart: true,
  // Start recording automatically when Rollbar initializes
  debug: {
    logEmits: false // Whether to log emitted events
  },
  // Recording options
  inlineStylesheet: true,
  // Whether to inline stylesheets to improve replay accuracy
  inlineImages: false,
  // Whether to record the image content
  collectFonts: true,
  // Whether to collect fonts in the website

  // Privacy options
  // Fine-grained control over which input types to mask
  // By default only password inputs are masked if maskInputs is true
  maskInputOptions: {
    password: true,
    email: false,
    tel: false,
    text: false,
    color: false,
    date: false,
    'datetime-local': false,
    month: false,
    number: false,
    range: false,
    search: false,
    time: false,
    url: false,
    week: false
  },
  // Remove unnecessary parts of the DOM
  // By default all removable elements are removed
  slimDOMOptions: {
    script: true,
    // Remove script elements
    comment: true,
    // Remove comments
    headFavicon: true,
    // Remove favicons in the head
    headWhitespace: true,
    // Remove whitespace in head
    headMetaDescKeywords: true,
    // Remove meta description and keywords
    headMetaSocial: true,
    // Remove social media meta tags
    headMetaRobots: true,
    // Remove robots meta directives
    headMetaHttpEquiv: true,
    // Remove http-equiv meta directives
    headMetaAuthorship: true,
    // Remove authorship meta directives
    headMetaVerification: true // Remove verification meta directives
  }

  // Custom callbacks for advanced use cases
  // These are undefined by default and can be set programmatically
  // maskInputFn: undefined,      // Custom function to mask input values
  // maskTextFn: undefined,       // Custom function to mask text content
  // errorHandler: undefined,     // Custom error handler for recording errors

  // Plugin system
  // plugins: []                  // List of plugins to use (must be set programmatically)
});

/***/ }),

/***/ "./src/browser/replay/replayMap.js":
/*!*****************************************!*\
  !*** ./src/browser/replay/replayMap.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ReplayMap)
/* harmony export */ });
/* harmony import */ var _tracing_id_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tracing/id.js */ "./src/tracing/id.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }


/**
 * ReplayMap - Manages the mapping between error occurrences and their associated
 * session recordings. This class handles the coordination between when recordings
 * are dumped and when they are eventually sent to the backend.
 */
var _map = /*#__PURE__*/new WeakMap();
var _recorder = /*#__PURE__*/new WeakMap();
var _api = /*#__PURE__*/new WeakMap();
var _tracing = /*#__PURE__*/new WeakMap();
var ReplayMap = /*#__PURE__*/function () {
  /**
   * Creates a new ReplayMap instance
   *
   * @param {Object} props - Configuration props
   * @param {Object} props.recorder - The recorder instance that dumps replay data into spans
   * @param {Object} props.api - The API instance used to send replay payloads to the backend
   * @param {Object} props.tracing - The tracing instance used to create spans and manage context
   */
  function ReplayMap(_ref) {
    var recorder = _ref.recorder,
      api = _ref.api,
      tracing = _ref.tracing;
    _classCallCheck(this, ReplayMap);
    _classPrivateFieldInitSpec(this, _map, void 0);
    _classPrivateFieldInitSpec(this, _recorder, void 0);
    _classPrivateFieldInitSpec(this, _api, void 0);
    _classPrivateFieldInitSpec(this, _tracing, void 0);
    if (!recorder) {
      throw new TypeError("Expected 'recorder' to be provided");
    }
    if (!api) {
      throw new TypeError("Expected 'api' to be provided");
    }
    if (!tracing) {
      throw new TypeError("Expected 'tracing' to be provided");
    }
    _classPrivateFieldSet(_map, this, new Map());
    _classPrivateFieldSet(_recorder, this, recorder);
    _classPrivateFieldSet(_api, this, api);
    _classPrivateFieldSet(_tracing, this, tracing);
  }

  /**
   * Processes a replay by converting recorder events into a transport-ready payload.
   *
   * Calls recorder.dump() to capture events as spans, formats them into a proper payload,
   * and stores the result in the map using replayId as the key.
   *
   * @param {string} replayId - The unique ID for this replay
   * @returns {Promise<string>} A promise resolving to the processed replayId
   * @private
   */
  return _createClass(ReplayMap, [{
    key: "_processReplay",
    value: (function () {
      var _processReplay2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(replayId, occurrenceUuid) {
        var payload;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              try {
                payload = _classPrivateFieldGet(_recorder, this).dump(_classPrivateFieldGet(_tracing, this), replayId, occurrenceUuid);
                _classPrivateFieldGet(_map, this).set(replayId, payload);
              } catch (transformError) {
                console.error('Error transforming spans:', transformError);
                _classPrivateFieldGet(_map, this).set(replayId, null); // TODO(matux): Error span?
              }
              return _context.abrupt("return", replayId);
            case 2:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function _processReplay(_x, _x2) {
        return _processReplay2.apply(this, arguments);
      }
      return _processReplay;
    }()
    /**
     * Adds a replay to the map and returns a uniquely generated replay ID.
     *
     * This method immediately returns the replayId and asynchronously processes
     * the replay data in the background. The processing involves converting
     * recorder events into a payload format and storing it in the map.
     *
     * @returns {string} A unique identifier for this replay
     */
    )
  }, {
    key: "add",
    value: function add(occurrenceUuid) {
      var replayId = _tracing_id_js__WEBPACK_IMPORTED_MODULE_0__["default"].gen(8);
      this._processReplay(replayId, occurrenceUuid)["catch"](function (error) {
        console.error('Failed to process replay:', error);
      });
      return replayId;
    }

    /**
     * Sends the replay payload associated with the given replayId to the backend
     * and removes it from the map.
     *
     * Retrieves the payload from the map, checks if it's valid, then sends it
     * to the API endpoint for processing. The payload can be either a spans array
     * or a formatted OTLP payload object.
     *
     * @param {string} replayId - The ID of the replay to send
     * @returns {Promise<boolean>} A promise that resolves to true if the payload was found and sent, false otherwise
     */
  }, {
    key: "send",
    value: (function () {
      var _send = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(replayId) {
        var payload, isEmpty;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (replayId) {
                _context2.next = 3;
                break;
              }
              console.warn('ReplayMap.send: No replayId provided');
              return _context2.abrupt("return", false);
            case 3:
              if (_classPrivateFieldGet(_map, this).has(replayId)) {
                _context2.next = 6;
                break;
              }
              console.warn("ReplayMap.send: No replay found for replayId: ".concat(replayId));
              return _context2.abrupt("return", false);
            case 6:
              payload = _classPrivateFieldGet(_map, this).get(replayId);
              _classPrivateFieldGet(_map, this)["delete"](replayId);

              // Check if payload is empty (could be raw spans array or OTLP payload)
              isEmpty = !payload || Array.isArray(payload) && payload.length === 0 || payload.resourceSpans && payload.resourceSpans.length === 0;
              if (!isEmpty) {
                _context2.next = 12;
                break;
              }
              console.warn("ReplayMap.send: No payload found for replayId: ".concat(replayId));
              return _context2.abrupt("return", false);
            case 12:
              _context2.prev = 12;
              _context2.next = 15;
              return _classPrivateFieldGet(_api, this).postSpans(payload);
            case 15:
              return _context2.abrupt("return", true);
            case 18:
              _context2.prev = 18;
              _context2.t0 = _context2["catch"](12);
              console.error('Error sending replay:', _context2.t0);
              return _context2.abrupt("return", false);
            case 22:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[12, 18]]);
      }));
      function send(_x3) {
        return _send.apply(this, arguments);
      }
      return send;
    }()
    /**
     * Discards the replay associated with the given replay ID by removing
     * it from the map without sending it.
     *
     * @param {string} replayId - The ID of the replay to discard
     * @returns {boolean} True if a replay was found and discarded, false otherwise
     */
    )
  }, {
    key: "discard",
    value: function discard(replayId) {
      if (!replayId) {
        console.warn('ReplayMap.discard: No replayId provided');
        return false;
      }
      if (!_classPrivateFieldGet(_map, this).has(replayId)) {
        console.warn("ReplayMap.discard: No replay found for replayId: ".concat(replayId));
        return false;
      }
      _classPrivateFieldGet(_map, this)["delete"](replayId);
      return true;
    }

    /**
     * Gets spans for the given replay ID
     *
     * @param {string} replayId - The ID to retrieve spans for
     * @returns {Array|null} The spans array or null if not found
     */
  }, {
    key: "getSpans",
    value: function getSpans(replayId) {
      var _classPrivateFieldGet2;
      return (_classPrivateFieldGet2 = _classPrivateFieldGet(_map, this).get(replayId)) !== null && _classPrivateFieldGet2 !== void 0 ? _classPrivateFieldGet2 : null;
    }

    /**
     * Sets spans for a given replay ID
     *
     * @param {string} replayId - The ID to set spans for
     * @param {Array} spans - The spans to set
     */
  }, {
    key: "setSpans",
    value: function setSpans(replayId, spans) {
      _classPrivateFieldGet(_map, this).set(replayId, spans);
    }

    /**
     * Returns the size of the map (number of stored replays)
     *
     * @returns {number} The number of replays currently stored
     */
  }, {
    key: "size",
    get: function get() {
      return _classPrivateFieldGet(_map, this).size;
    }

    /**
     * Clears all stored replays without sending them
     */
  }, {
    key: "clear",
    value: function clear() {
      _classPrivateFieldGet(_map, this).clear();
    }
  }]);
}();


/***/ }),

/***/ "./src/browser/transforms.js":
/*!***********************************!*\
  !*** ./src/browser/transforms.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ../utility */ "./src/utility.js");
var errorParser = __webpack_require__(/*! ../errorParser */ "./src/errorParser.js");
var logger = __webpack_require__(/*! ./logger */ "./src/browser/logger.js");
function handleDomException(item, options, callback) {
  if (item.err && errorParser.Stack(item.err).name === 'DOMException') {
    var originalError = new Error();
    originalError.name = item.err.name;
    originalError.message = item.err.message;
    originalError.stack = item.err.stack;
    originalError.nested = item.err;
    item.err = originalError;
  }
  callback(null, item);
}
function handleItemWithError(item, options, callback) {
  item.data = item.data || {};
  if (item.err) {
    try {
      item.stackInfo = item.err._savedStackTrace || errorParser.parse(item.err, item.skipFrames);
      if (options.addErrorContext) {
        addErrorContext(item);
      }
    } catch (e) {
      logger.error('Error while parsing the error object.', e);
      try {
        item.message = item.err.message || item.err.description || item.message || String(item.err);
      } catch (e2) {
        item.message = String(item.err) || String(e2);
      }
      delete item.err;
    }
  }
  callback(null, item);
}
function addErrorContext(item) {
  var chain = [];
  var err = item.err;
  chain.push(err);
  while (err.nested || err.cause) {
    err = err.nested || err.cause;
    chain.push(err);
  }
  _.addErrorContext(item, chain);
}
function ensureItemHasSomethingToSay(item, options, callback) {
  if (!item.message && !item.stackInfo && !item.custom) {
    callback(new Error('No message, stack info, or custom data'), null);
  }
  callback(null, item);
}
function addBaseInfo(item, options, callback) {
  var environment = options.payload && options.payload.environment || options.environment;
  item.data = _.merge(item.data, {
    environment: environment,
    level: item.level,
    endpoint: options.endpoint,
    platform: 'browser',
    framework: 'browser-js',
    language: 'javascript',
    server: {},
    uuid: item.uuid,
    notifier: {
      name: 'rollbar-browser-js',
      version: options.version
    },
    custom: item.custom
  });
  callback(null, item);
}
function addRequestInfo(window) {
  return function (item, options, callback) {
    var requestInfo = {};
    if (window && window.location) {
      requestInfo.url = window.location.href;
      requestInfo.query_string = window.location.search;
    }
    var remoteString = '$remote_ip';
    if (!options.captureIp) {
      remoteString = null;
    } else if (options.captureIp !== true) {
      remoteString += '_anonymize';
    }
    if (remoteString) requestInfo.user_ip = remoteString;
    if (Object.keys(requestInfo).length > 0) {
      _.set(item, 'data.request', requestInfo);
    }
    callback(null, item);
  };
}
function addClientInfo(window) {
  return function (item, options, callback) {
    if (!window) {
      return callback(null, item);
    }
    var nav = window.navigator || {};
    var scr = window.screen || {};
    _.set(item, 'data.client', {
      runtime_ms: item.timestamp - window._rollbarStartTime,
      timestamp: Math.round(item.timestamp / 1000),
      javascript: {
        browser: nav.userAgent,
        language: nav.language,
        cookie_enabled: nav.cookieEnabled,
        screen: {
          width: scr.width,
          height: scr.height
        }
      }
    });
    callback(null, item);
  };
}
function addPluginInfo(window) {
  return function (item, options, callback) {
    if (!window || !window.navigator) {
      return callback(null, item);
    }
    var plugins = [];
    var navPlugins = window.navigator.plugins || [];
    var cur;
    for (var i = 0, l = navPlugins.length; i < l; ++i) {
      cur = navPlugins[i];
      plugins.push({
        name: cur.name,
        description: cur.description
      });
    }
    _.set(item, 'data.client.javascript.plugins', plugins);
    callback(null, item);
  };
}
function addBody(item, options, callback) {
  if (item.stackInfo) {
    if (item.stackInfo.traceChain) {
      addBodyTraceChain(item, options, callback);
    } else {
      addBodyTrace(item, options, callback);
    }
  } else {
    addBodyMessage(item, options, callback);
  }
}
function addBodyMessage(item, options, callback) {
  var message = item.message;
  var custom = item.custom;
  if (!message) {
    message = 'Item sent with null or missing arguments.';
  }
  var result = {
    body: message
  };
  if (custom) {
    result.extra = _.merge(custom);
  }
  _.set(item, 'data.body', {
    message: result
  });
  callback(null, item);
}
function stackFromItem(item) {
  // Transform a TraceKit stackInfo object into a Rollbar trace
  var stack = item.stackInfo.stack;
  if (stack && stack.length === 0 && item._unhandledStackInfo && item._unhandledStackInfo.stack) {
    stack = item._unhandledStackInfo.stack;
  }
  return stack;
}
function addBodyTraceChain(item, options, callback) {
  var traceChain = item.stackInfo.traceChain;
  var traces = [];
  var traceChainLength = traceChain.length;
  for (var i = 0; i < traceChainLength; i++) {
    var trace = buildTrace(item, traceChain[i], options);
    traces.push(trace);
  }
  _.set(item, 'data.body', {
    trace_chain: traces
  });
  callback(null, item);
}
function addBodyTrace(item, options, callback) {
  var stack = stackFromItem(item);
  if (stack) {
    var trace = buildTrace(item, item.stackInfo, options);
    _.set(item, 'data.body', {
      trace: trace
    });
    callback(null, item);
  } else {
    var stackInfo = item.stackInfo;
    var guess = errorParser.guessErrorClass(stackInfo.message);
    var className = errorClass(stackInfo, guess[0], options);
    var message = guess[1];
    item.message = className + ': ' + message;
    addBodyMessage(item, options, callback);
  }
}
function buildTrace(item, stackInfo, options) {
  var description = item && item.data.description;
  var custom = item && item.custom;
  var stack = stackFromItem(item);
  var guess = errorParser.guessErrorClass(stackInfo.message);
  var className = errorClass(stackInfo, guess[0], options);
  var message = guess[1];
  var trace = {
    exception: {
      "class": className,
      message: message
    }
  };
  if (description) {
    trace.exception.description = description;
  }
  if (stack) {
    if (stack.length === 0) {
      trace.exception.stack = stackInfo.rawStack;
      trace.exception.raw = String(stackInfo.rawException);
    }
    var stackFrame;
    var frame;
    var code;
    var pre;
    var post;
    var contextLength;
    var i, mid;
    trace.frames = [];
    for (i = 0; i < stack.length; ++i) {
      stackFrame = stack[i];
      frame = {
        filename: stackFrame.url ? _.sanitizeUrl(stackFrame.url) : '(unknown)',
        lineno: stackFrame.line || null,
        method: !stackFrame.func || stackFrame.func === '?' ? '[anonymous]' : stackFrame.func,
        colno: stackFrame.column
      };
      if (options.sendFrameUrl) {
        frame.url = stackFrame.url;
      }
      if (frame.method && frame.method.endsWith && frame.method.endsWith('_rollbar_wrapped')) {
        continue;
      }
      code = pre = post = null;
      contextLength = stackFrame.context ? stackFrame.context.length : 0;
      if (contextLength) {
        mid = Math.floor(contextLength / 2);
        pre = stackFrame.context.slice(0, mid);
        code = stackFrame.context[mid];
        post = stackFrame.context.slice(mid);
      }
      if (code) {
        frame.code = code;
      }
      if (pre || post) {
        frame.context = {};
        if (pre && pre.length) {
          frame.context.pre = pre;
        }
        if (post && post.length) {
          frame.context.post = post;
        }
      }
      if (stackFrame.args) {
        frame.args = stackFrame.args;
      }
      trace.frames.push(frame);
    }

    // NOTE(cory): reverse the frames since rollbar.com expects the most recent call last
    trace.frames.reverse();
    if (custom) {
      trace.extra = _.merge(custom);
    }
  }
  return trace;
}
function errorClass(stackInfo, guess, options) {
  if (stackInfo.name) {
    return stackInfo.name;
  } else if (options.guessErrorClass) {
    return guess;
  } else {
    return '(unknown)';
  }
}
function addScrubber(scrubFn) {
  return function (item, options, callback) {
    if (scrubFn) {
      var scrubFields = options.scrubFields || [];
      var scrubPaths = options.scrubPaths || [];
      item.data = scrubFn(item.data, scrubFields, scrubPaths);
    }
    callback(null, item);
  };
}
module.exports = {
  handleDomException: handleDomException,
  handleItemWithError: handleItemWithError,
  ensureItemHasSomethingToSay: ensureItemHasSomethingToSay,
  addBaseInfo: addBaseInfo,
  addRequestInfo: addRequestInfo,
  addClientInfo: addClientInfo,
  addPluginInfo: addPluginInfo,
  addBody: addBody,
  addScrubber: addScrubber
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

/***/ "./src/defaults.js":
/*!*************************!*\
  !*** ./src/defaults.js ***!
  \*************************/
/***/ ((module) => {

module.exports = {
  version: '3.0.0-alpha.0',
  endpoint: 'api.rollbar.com/api/1/item/',
  logLevel: 'debug',
  reportLevel: 'debug',
  uncaughtErrorLevel: 'error',
  maxItems: 0,
  itemsPerMin: 60
};

/***/ }),

/***/ "./src/errorParser.js":
/*!****************************!*\
  !*** ./src/errorParser.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ErrorStackParser = __webpack_require__(/*! error-stack-parser */ "./node_modules/error-stack-parser/error-stack-parser.js");
var UNKNOWN_FUNCTION = '?';
var ERR_CLASS_REGEXP = new RegExp('^(([a-zA-Z0-9-_$ ]*): *)?(Uncaught )?([a-zA-Z0-9-_$ ]*): ');
function guessFunctionName() {
  return UNKNOWN_FUNCTION;
}
function gatherContext() {
  return null;
}
function Frame(stackFrame) {
  var data = {};
  data._stackFrame = stackFrame;
  data.url = stackFrame.fileName;
  data.line = stackFrame.lineNumber;
  data.func = stackFrame.functionName;
  data.column = stackFrame.columnNumber;
  data.args = stackFrame.args;
  data.context = gatherContext();
  return data;
}
function Stack(exception, skip) {
  function getStack() {
    var parserStack = [];
    skip = skip || 0;
    try {
      parserStack = ErrorStackParser.parse(exception);
    } catch (e) {
      parserStack = [];
    }
    var stack = [];
    for (var i = skip; i < parserStack.length; i++) {
      stack.push(new Frame(parserStack[i]));
    }
    return stack;
  }
  return {
    stack: getStack(),
    message: exception.message,
    name: _mostSpecificErrorName(exception),
    rawStack: exception.stack,
    rawException: exception
  };
}
function parse(e, skip) {
  var err = e;
  if (err.nested || err.cause) {
    var traceChain = [];
    while (err) {
      traceChain.push(new Stack(err, skip));
      err = err.nested || err.cause;
      skip = 0; // Only apply skip value to primary error
    }

    // Return primary error with full trace chain attached.
    traceChain[0].traceChain = traceChain;
    return traceChain[0];
  } else {
    return new Stack(err, skip);
  }
}
function guessErrorClass(errMsg) {
  if (!errMsg || !errMsg.match) {
    return ['Unknown error. There was no error message to display.', ''];
  }
  var errClassMatch = errMsg.match(ERR_CLASS_REGEXP);
  var errClass = '(unknown)';
  if (errClassMatch) {
    errClass = errClassMatch[errClassMatch.length - 1];
    errMsg = errMsg.replace((errClassMatch[errClassMatch.length - 2] || '') + errClass + ':', '');
    errMsg = errMsg.replace(/(^[\s]+|[\s]+$)/g, '');
  }
  return [errClass, errMsg];
}

// * Prefers any value over an empty string
// * Prefers any value over 'Error' where possible
// * Prefers name over constructor.name when both are more specific than 'Error'
function _mostSpecificErrorName(error) {
  var name = error.name && error.name.length && error.name;
  var constructorName = error.constructor.name && error.constructor.name.length && error.constructor.name;
  if (!name || !constructorName) {
    return name || constructorName;
  }
  if (name === 'Error') {
    return constructorName;
  }
  return name;
}
module.exports = {
  guessFunctionName: guessFunctionName,
  guessErrorClass: guessErrorClass,
  gatherContext: gatherContext,
  parse: parse,
  Stack: Stack,
  Frame: Frame
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

/***/ "./src/rateLimiter.js":
/*!****************************!*\
  !*** ./src/rateLimiter.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");

/*
 * RateLimiter - an object that encapsulates the logic for counting items sent to Rollbar
 *
 * @param options - the same options that are accepted by configureGlobal offered as a convenience
 */
function RateLimiter(options) {
  this.startTime = _.now();
  this.counter = 0;
  this.perMinCounter = 0;
  this.platform = null;
  this.platformOptions = {};
  this.configureGlobal(options);
}
RateLimiter.globalSettings = {
  startTime: _.now(),
  maxItems: undefined,
  itemsPerMinute: undefined
};

/*
 * configureGlobal - set the global rate limiter options
 *
 * @param options - Only the following values are recognized:
 *    startTime: a timestamp of the form returned by (new Date()).getTime()
 *    maxItems: the maximum items
 *    itemsPerMinute: the max number of items to send in a given minute
 */
RateLimiter.prototype.configureGlobal = function (options) {
  if (options.startTime !== undefined) {
    RateLimiter.globalSettings.startTime = options.startTime;
  }
  if (options.maxItems !== undefined) {
    RateLimiter.globalSettings.maxItems = options.maxItems;
  }
  if (options.itemsPerMinute !== undefined) {
    RateLimiter.globalSettings.itemsPerMinute = options.itemsPerMinute;
  }
};

/*
 * shouldSend - determine if we should send a given item based on rate limit settings
 *
 * @param item - the item we are about to send
 * @returns An object with the following structure:
 *  error: (Error|null)
 *  shouldSend: bool
 *  payload: (Object|null)
 *  If shouldSend is false, the item passed as a parameter should not be sent to Rollbar, and
 *  exactly one of error or payload will be non-null. If error is non-null, the returned Error will
 *  describe the situation, but it means that we were already over a rate limit (either globally or
 *  per minute) when this item was checked. If error is null, and therefore payload is non-null, it
 *  means this item put us over the global rate limit and the payload should be sent to Rollbar in
 *  place of the passed in item.
 */
RateLimiter.prototype.shouldSend = function (item, now) {
  now = now || _.now();
  var elapsedTime = now - this.startTime;
  if (elapsedTime < 0 || elapsedTime >= 60000) {
    this.startTime = now;
    this.perMinCounter = 0;
  }
  var globalRateLimit = RateLimiter.globalSettings.maxItems;
  var globalRateLimitPerMin = RateLimiter.globalSettings.itemsPerMinute;
  if (checkRate(item, globalRateLimit, this.counter)) {
    return shouldSendValue(this.platform, this.platformOptions, globalRateLimit + ' max items reached', false);
  } else if (checkRate(item, globalRateLimitPerMin, this.perMinCounter)) {
    return shouldSendValue(this.platform, this.platformOptions, globalRateLimitPerMin + ' items per minute reached', false);
  }
  this.counter++;
  this.perMinCounter++;
  var shouldSend = !checkRate(item, globalRateLimit, this.counter);
  var perMinute = shouldSend;
  shouldSend = shouldSend && !checkRate(item, globalRateLimitPerMin, this.perMinCounter);
  return shouldSendValue(this.platform, this.platformOptions, null, shouldSend, globalRateLimit, globalRateLimitPerMin, perMinute);
};
RateLimiter.prototype.setPlatformOptions = function (platform, options) {
  this.platform = platform;
  this.platformOptions = options;
};

/* Helpers */

function checkRate(item, limit, counter) {
  return !item.ignoreRateLimit && limit >= 1 && counter > limit;
}
function shouldSendValue(platform, options, error, shouldSend, globalRateLimit, limitPerMin, perMinute) {
  var payload = null;
  if (error) {
    error = new Error(error);
  }
  if (!error && !shouldSend) {
    payload = rateLimitPayload(platform, options, globalRateLimit, limitPerMin, perMinute);
  }
  return {
    error: error,
    shouldSend: shouldSend,
    payload: payload
  };
}
function rateLimitPayload(platform, options, globalRateLimit, limitPerMin, perMinute) {
  var environment = options.environment || options.payload && options.payload.environment;
  var msg;
  if (perMinute) {
    msg = 'item per minute limit reached, ignoring errors until timeout';
  } else {
    msg = 'maxItems has been hit, ignoring errors until reset.';
  }
  var item = {
    body: {
      message: {
        body: msg,
        extra: {
          maxItems: globalRateLimit,
          itemsPerMinute: limitPerMin
        }
      }
    },
    language: 'javascript',
    environment: environment,
    notifier: {
      version: options.notifier && options.notifier.version || options.version
    }
  };
  if (platform === 'browser') {
    item.platform = 'browser';
    item.framework = 'browser-js';
    item.notifier.name = 'rollbar-browser-js';
  } else if (platform === 'server') {
    item.framework = options.framework || 'node-js';
    item.notifier.name = options.notifier.name;
  } else if (platform === 'react-native') {
    item.framework = options.framework || 'react-native';
    item.notifier.name = options.notifier.name;
  }
  return item;
}
module.exports = RateLimiter;

/***/ }),

/***/ "./src/rollbar.js":
/*!************************!*\
  !*** ./src/rollbar.js ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var RateLimiter = __webpack_require__(/*! ./rateLimiter */ "./src/rateLimiter.js");
var Queue = __webpack_require__(/*! ./queue */ "./src/queue.js");
var Notifier = __webpack_require__(/*! ./notifier */ "./src/notifier.js");
var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");

/*
 * Rollbar - the interface to Rollbar
 *
 * @param options
 * @param api
 * @param logger
 */
function Rollbar(options, api, logger, telemeter, tracing, replayMap, platform) {
  this.options = _.merge(options);
  this.logger = logger;
  Rollbar.rateLimiter.configureGlobal(this.options);
  Rollbar.rateLimiter.setPlatformOptions(platform, this.options);
  this.api = api;
  this.queue = new Queue(Rollbar.rateLimiter, api, logger, this.options, replayMap);
  this.tracing = tracing;

  // Legacy OpenTracing support
  // This must happen before the Notifier is created
  var tracer = this.options.tracer || null;
  if (validateTracer(tracer)) {
    this.tracer = tracer;
    // set to a string for api response serialization
    this.options.tracer = 'opentracing-tracer-enabled';
    this.options._configuredOptions.tracer = 'opentracing-tracer-enabled';
  } else {
    this.tracer = null;
  }
  this.notifier = new Notifier(this.queue, this.options);
  this.telemeter = telemeter;
  setStackTraceLimit(options);
  this.lastError = null;
  this.lastErrorHash = 'none';
}
var defaultOptions = {
  maxItems: 0,
  itemsPerMinute: 60
};
Rollbar.rateLimiter = new RateLimiter(defaultOptions);
Rollbar.prototype.global = function (options) {
  Rollbar.rateLimiter.configureGlobal(options);
  return this;
};
Rollbar.prototype.configure = function (options, payloadData) {
  var oldOptions = this.options;
  var payload = {};
  if (payloadData) {
    payload = {
      payload: payloadData
    };
  }
  this.options = _.merge(oldOptions, options, payload);

  // Legacy OpenTracing support
  // This must happen before the Notifier is configured
  var tracer = this.options.tracer || null;
  if (validateTracer(tracer)) {
    this.tracer = tracer;
    // set to a string for api response serialization
    this.options.tracer = 'opentracing-tracer-enabled';
    this.options._configuredOptions.tracer = 'opentracing-tracer-enabled';
  } else {
    this.tracer = null;
  }
  this.notifier && this.notifier.configure(this.options);
  this.telemeter && this.telemeter.configure(this.options);
  setStackTraceLimit(options);
  this.global(this.options);
  if (validateTracer(options.tracer)) {
    this.tracer = options.tracer;
  }
  return this;
};
Rollbar.prototype.log = function (item) {
  var level = this._defaultLogLevel();
  return this._log(level, item);
};
Rollbar.prototype.debug = function (item) {
  this._log('debug', item);
};
Rollbar.prototype.info = function (item) {
  this._log('info', item);
};
Rollbar.prototype.warn = function (item) {
  this._log('warning', item);
};
Rollbar.prototype.warning = function (item) {
  this._log('warning', item);
};
Rollbar.prototype.error = function (item) {
  this._log('error', item);
};
Rollbar.prototype.critical = function (item) {
  this._log('critical', item);
};
Rollbar.prototype.wait = function (callback) {
  this.queue.wait(callback);
};
Rollbar.prototype.captureEvent = function (type, metadata, level) {
  return this.telemeter && this.telemeter.captureEvent(type, metadata, level);
};
Rollbar.prototype.captureDomContentLoaded = function (ts) {
  return this.telemeter && this.telemeter.captureDomContentLoaded(ts);
};
Rollbar.prototype.captureLoad = function (ts) {
  return this.telemeter && this.telemeter.captureLoad(ts);
};
Rollbar.prototype.buildJsonPayload = function (item) {
  return this.api.buildJsonPayload(item);
};
Rollbar.prototype.sendJsonPayload = function (jsonPayload) {
  this.api.postJsonPayload(jsonPayload);
};

/* Internal */

Rollbar.prototype._log = function (defaultLevel, item) {
  var callback;
  if (item.callback) {
    callback = item.callback;
    delete item.callback;
  }
  if (this.options.ignoreDuplicateErrors && this._sameAsLastError(item)) {
    if (callback) {
      var error = new Error('ignored identical item');
      error.item = item;
      callback(error);
    }
    return;
  }
  try {
    this._addTracingAttributes(item);

    // Legacy OpenTracing support
    this._addTracingInfo(item);
    item.level = item.level || defaultLevel;
    var telemeter = this.telemeter;
    if (telemeter) {
      telemeter._captureRollbarItem(item);
      item.telemetryEvents = telemeter.copyEvents() || [];
      if (telemeter.telemetrySpan) {
        telemeter.telemetrySpan.end();
        telemeter.telemetrySpan = telemeter.tracing.startSpan('rollbar-telemetry', {});
      }
    }
    this.notifier.log(item, callback);
  } catch (e) {
    if (callback) {
      callback(e);
    }
    this.logger.error(e);
  }
};
Rollbar.prototype._addTracingAttributes = function (item) {
  var _this$tracing;
  var span = (_this$tracing = this.tracing) === null || _this$tracing === void 0 ? void 0 : _this$tracing.getSpan();
  if (!span) {
    return;
  }
  var attributes = [{
    key: 'session_id',
    value: this.tracing.sessionId
  }, {
    key: 'span_id',
    value: span.spanId
  }, {
    key: 'trace_id',
    value: span.traceId
  }];
  _.addItemAttributes(item, attributes);
  span.addEvent('rollbar.occurrence', [{
    key: 'rollbar.occurrence.uuid',
    value: item.uuid
  }]);
};
Rollbar.prototype._defaultLogLevel = function () {
  return this.options.logLevel || 'debug';
};
Rollbar.prototype._sameAsLastError = function (item) {
  if (!item._isUncaught) {
    return false;
  }
  var itemHash = generateItemHash(item);
  if (this.lastErrorHash === itemHash) {
    return true;
  }
  this.lastError = item.err;
  this.lastErrorHash = itemHash;
  return false;
};
Rollbar.prototype._addTracingInfo = function (item) {
  // Tracer validation occurs in the constructor
  // or in the Rollbar.prototype.configure methods
  if (this.tracer) {
    // add rollbar occurrence uuid to span
    var span = this.tracer.scope().active();
    if (validateSpan(span)) {
      span.setTag('rollbar.error_uuid', item.uuid);
      span.setTag('rollbar.has_error', true);
      span.setTag('error', true);
      span.setTag('rollbar.item_url', "https://rollbar.com/item/uuid/?uuid=".concat(item.uuid));
      span.setTag('rollbar.occurrence_url', "https://rollbar.com/occurrence/uuid/?uuid=".concat(item.uuid));

      // add span ID & trace ID to occurrence
      var opentracingSpanId = span.context().toSpanId();
      var opentracingTraceId = span.context().toTraceId();
      if (item.custom) {
        item.custom.opentracing_span_id = opentracingSpanId;
        item.custom.opentracing_trace_id = opentracingTraceId;
      } else {
        item.custom = {
          opentracing_span_id: opentracingSpanId,
          opentracing_trace_id: opentracingTraceId
        };
      }
    }
  }
};
function generateItemHash(item) {
  var message = item.message || '';
  var stack = (item.err || {}).stack || String(item.err);
  return message + '::' + stack;
}

// Node.js, Chrome, Safari, and some other browsers support this property
// which globally sets the number of stack frames returned in an Error object.
// If a browser can't use it, no harm done.
function setStackTraceLimit(options) {
  if (options.stackTraceLimit) {
    Error.stackTraceLimit = options.stackTraceLimit;
  }
}

/**
 * Validate the Tracer object provided to the Client
 * is valid for our Opentracing use case.
 * @param {opentracer.Tracer} tracer
 */
function validateTracer(tracer) {
  if (!tracer) {
    return false;
  }
  if (!tracer.scope || typeof tracer.scope !== 'function') {
    return false;
  }
  var scope = tracer.scope();
  if (!scope || !scope.active || typeof scope.active !== 'function') {
    return false;
  }
  return true;
}

/**
 * Validate the Span object provided
 * @param {opentracer.Span} span
 */
function validateSpan(span) {
  if (!span || !span.context || typeof span.context !== 'function') {
    return false;
  }
  var spanContext = span.context();
  if (!spanContext || !spanContext.toSpanId || !spanContext.toTraceId || typeof spanContext.toSpanId !== 'function' || typeof spanContext.toTraceId !== 'function') {
    return false;
  }
  return true;
}
module.exports = Rollbar;

/***/ }),

/***/ "./src/tracing/defaults.js":
/*!*********************************!*\
  !*** ./src/tracing/defaults.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Default tracing options
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  enabled: false,
  endpoint: 'api.rollbar.com/api/1/session/'
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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/*!***********************************!*\
  !*** ./test/browser.core.test.js ***!
  \***********************************/
/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

// Use minimal browser package, with no optional components added.
var Rollbar = __webpack_require__(/*! ../src/browser/core */ "./src/browser/core.js");

describe('options.captureUncaught', function () {
  beforeEach(function (done) {
    // Load the HTML page, so errors can be generated.
    document.write(window.__html__['examples/error.html']);

    window.server = sinon.createFakeServer();
    done();
  });

  afterEach(function () {
    window.rollbar.configure({ autoInstrument: false });
    window.server.restore();
  });

  function stubResponse(server) {
    server.respondWith('POST', 'api/1/item', [
      200,
      { 'Content-Type': 'application/json' },
      '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}',
    ]);
  }

  it('should capture when enabled in constructor', function (done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    var element = document.getElementById('throw-error');
    element.click();

    setTimeout(function () {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.trace.exception.message).to.eql('test error');
      expect(body.data.notifier.diagnostic.raw_error.message).to.eql(
        'test error',
      );
      expect(body.data.notifier.diagnostic.is_uncaught).to.eql(true);

      // karma doesn't unload the browser between tests, so the onerror handler
      // will remain installed. Unset captureUncaught so the onerror handler
      // won't affect other tests.
      rollbar.configure({
        captureUncaught: false,
      });

      done();
    }, 1);
  });

  it('should respond to enable/disable in configure', function (done) {
    var server = window.server;
    var element = document.getElementById('throw-error');
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: false,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    element.click();

    setTimeout(function () {
      server.respond();
      expect(server.requests.length).to.eql(0); // Disabled, no event
      server.requests.length = 0;

      rollbar.configure({
        captureUncaught: true,
      });

      element.click();

      setTimeout(function () {
        server.respond();

        var body = JSON.parse(server.requests[0].requestBody);

        expect(body.data.body.trace.exception.message).to.eql('test error');
        expect(body.data.notifier.diagnostic.is_anonymous).to.not.be.ok();

        server.requests.length = 0;

        rollbar.configure({
          captureUncaught: false,
        });

        element.click();

        setTimeout(function () {
          server.respond();
          expect(server.requests.length).to.eql(0); // Disabled, no event

          done();
        }, 1);
      }, 1);
    }, 1);
  });

  // Test case expects Chrome, which is the currently configured karma js/browser
  // engine at the time of this comment. However, karma's Chrome and ChromeHeadless
  // don't actually behave like real Chrome so we settle for stubbing some things.
  it('should capture external error data when inspectAnonymousErrors is true', function (done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    // We're supposedly running on ChromeHeadless, but still need to spoof Chrome. :\
    window.chrome = { runtime: true };

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
      inspectAnonymousErrors: true,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    // Simulate receiving onerror without an error object.
    rollbar.anonymousErrorsPending += 1;

    try {
      throw new Error('anon error');
    } catch (e) {
      Error.prepareStackTrace(e);
    }

    setTimeout(function () {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.trace.exception.message).to.eql('anon error');
      expect(body.data.notifier.diagnostic.is_anonymous).to.eql(true);

      // karma doesn't unload the browser between tests, so the onerror handler
      // will remain installed. Unset captureUncaught so the onerror handler
      // won't affect other tests.
      rollbar.configure({
        captureUncaught: false,
      });

      done();
    }, 1);
  });

  it('should ignore duplicate errors by default', function (done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    var element = document.getElementById('throw-error');

    // generate same error twice
    for (var i = 0; i < 2; i++) {
      element.click(); // use for loop to ensure the stack traces have identical line/col info
    }

    setTimeout(function () {
      server.respond();

      // transmit only once
      expect(server.requests.length).to.eql(1);

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.trace.exception.message).to.eql('test error');

      // karma doesn't unload the browser between tests, so the onerror handler
      // will remain installed. Unset captureUncaught so the onerror handler
      // won't affect other tests.
      rollbar.configure({
        captureUncaught: false,
      });

      done();
    }, 1);
  });

  it('should transmit duplicate errors when set in config', function (done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
      ignoreDuplicateErrors: false,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    var element = document.getElementById('throw-error');

    // generate same error twice
    for (var i = 0; i < 2; i++) {
      element.click(); // use for loop to ensure the stack traces have identical line/col info
    }

    setTimeout(function () {
      server.respond();

      // transmit both errors
      expect(server.requests.length).to.eql(2);

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.trace.exception.message).to.eql('test error');

      // karma doesn't unload the browser between tests, so the onerror handler
      // will remain installed. Unset captureUncaught so the onerror handler
      // won't affect other tests.
      rollbar.configure({
        captureUncaught: false,
      });

      done();
    }, 1);
  });
  it('should send DOMException as trace_chain', function (done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    var element = document.getElementById('throw-dom-exception');
    element.click();

    setTimeout(function () {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.trace_chain[0].exception.message).to.eql(
        'test DOMException',
      );

      // karma doesn't unload the browser between tests, so the onerror handler
      // will remain installed. Unset captureUncaught so the onerror handler
      // won't affect other tests.
      rollbar.configure({
        captureUncaught: false,
      });

      done();
    }, 1);
  });

  it('should capture exta frames when stackTraceLimit is set', function (done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var oldLimit = Error.stackTraceLimit;
    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
      stackTraceLimit: 50,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    var element = document.getElementById('throw-depp-stack-error');
    element.click();

    setTimeout(function () {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.trace.exception.message).to.eql('deep stack error');
      expect(body.data.body.trace.frames.length).to.be.above(20);

      // karma doesn't unload the browser between tests, so the onerror handler
      // will remain installed. Unset captureUncaught so the onerror handler
      // won't affect other tests.
      rollbar.configure({
        captureUncaught: false,
        stackTraceLimit: oldLimit, // reset to default
      });

      done();
    }, 1);
  });
});

describe('options.captureUnhandledRejections', function () {
  beforeEach(function (done) {
    window.server = sinon.createFakeServer();
    done();
  });

  afterEach(function () {
    window.rollbar.configure({ autoInstrument: false });
    window.server.restore();
  });

  function stubResponse(server) {
    server.respondWith('POST', 'api/1/item', [
      200,
      { 'Content-Type': 'application/json' },
      '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}',
    ]);
  }

  it('should capture when enabled in constructor', function (done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUnhandledRejections: true,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    Promise.reject(new Error('test reject'));

    setTimeout(function () {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.trace.exception.message).to.eql('test reject');
      expect(body.data.notifier.diagnostic.is_uncaught).to.eql(true);

      rollbar.configure({
        captureUnhandledRejections: false,
      });
      window.removeEventListener('unhandledrejection', window._rollbarURH);

      done();
    }, 500);
  });

  it('should respond to enable in configure', function (done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUnhandledRejections: false,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    rollbar.configure({
      captureUnhandledRejections: true,
    });

    Promise.reject(new Error('test reject'));

    setTimeout(function () {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.trace.exception.message).to.eql('test reject');

      server.requests.length = 0;

      rollbar.configure({
        captureUnhandledRejections: false,
      });
      window.removeEventListener('unhandledrejection', window._rollbarURH);

      done();
    }, 500);
  });

  it('should respond to disable in configure', function (done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUnhandledRejections: true,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    rollbar.configure({
      captureUnhandledRejections: false,
    });

    Promise.reject(new Error('test reject'));

    setTimeout(function () {
      server.respond();

      expect(server.requests.length).to.eql(0); // Disabled, no event
      server.requests.length = 0;

      window.removeEventListener('unhandledrejection', window._rollbarURH);

      done();
    }, 500);
  });
});

describe('log', function () {
  beforeEach(function (done) {
    window.server = sinon.createFakeServer();
    done();
  });

  afterEach(function () {
    window.rollbar.configure({ autoInstrument: false });
    window.server.restore();
  });

  function stubResponse(server) {
    server.respondWith('POST', 'api/1/item', [
      200,
      { 'Content-Type': 'application/json' },
      '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}',
    ]);
  }

  it('should send message when called with message and extra args', function (done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    rollbar.log('test message', { foo: 'bar' });

    setTimeout(function () {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.message.body).to.eql('test message');
      expect(body.data.body.message.extra).to.eql({ foo: 'bar' });
      expect(body.data.notifier.diagnostic.is_uncaught).to.eql(undefined);
      expect(body.data.notifier.diagnostic.original_arg_types).to.eql([
        'string',
        'object',
      ]);

      done();
    }, 1);
  });

  it('should send exception when called with error and extra args', function (done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    rollbar.log(new Error('test error'), { foo: 'bar' });

    setTimeout(function () {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.trace.exception.message).to.eql('test error');
      expect(body.data.body.trace.extra).to.eql({ foo: 'bar' });
      expect(body.data.notifier.diagnostic.is_uncaught).to.eql(undefined);
      expect(body.data.notifier.diagnostic.original_arg_types).to.eql([
        'error',
        'object',
      ]);

      done();
    }, 1);
  });

  it('should add custom data when called with error context', function (done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      addErrorContext: true,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    var err = new Error('test error');
    err.rollbarContext = { err: 'test' };

    rollbar.error(err, { foo: 'bar' });

    setTimeout(function () {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.trace.exception.message).to.eql('test error');
      expect(body.data.custom.foo).to.eql('bar');
      expect(body.data.custom.err).to.eql('test');

      done();
    }, 1);
  });

  it('should remove circular references in custom data', function (done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      addErrorContext: true,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    var err = new Error('test error');
    var contextData = { extra: 'baz' };
    contextData.data = contextData;
    var context = { err: 'test', contextData: contextData };
    err.rollbarContext = context;

    var array = ['one', 'two'];
    array.push(array);
    var custom = { foo: 'bar', array: array };
    var notCircular = { key: 'value' };
    custom.notCircular1 = notCircular;
    custom.notCircular2 = notCircular;
    custom.self = custom;
    rollbar.error(err, custom);

    setTimeout(function () {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.trace.exception.message).to.eql('test error');
      expect(body.data.custom.foo).to.eql('bar');
      expect(body.data.custom.err).to.eql('test');

      // Duplicate objects are allowed when there is no circular reference.
      expect(body.data.custom.notCircular1).to.eql(notCircular);
      expect(body.data.custom.notCircular2).to.eql(notCircular);

      expect(body.data.custom.self).to.eql(
        'Removed circular reference: object',
      );
      expect(body.data.custom.array).to.eql([
        'one',
        'two',
        'Removed circular reference: array',
      ]);
      expect(body.data.custom.contextData).to.eql({
        extra: 'baz',
        data: 'Removed circular reference: object',
      });

      done();
    }, 1);
  });

  it('should send message when called with only null arguments', function (done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUnhandledRejections: true,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    rollbar.log(null);

    setTimeout(function () {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.message.body).to.eql(
        'Item sent with null or missing arguments.',
      );
      expect(body.data.notifier.diagnostic.original_arg_types).to.eql(['null']);

      done();
    }, 1);
  });

  it('should skipFrames when set', function (done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUnhandledRejections: true,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    var error = new Error('error with stack');

    rollbar.log(error);
    rollbar.log(error, { skipFrames: 1 });

    setTimeout(function () {
      server.respond();

      var frames1 = JSON.parse(server.requests[0].requestBody).data.body.trace
        .frames;
      var frames2 = JSON.parse(server.requests[1].requestBody).data.body.trace
        .frames;

      expect(frames1.length).to.eql(frames2.length + 1);
      expect(frames1.slice(0, -1)).to.eql(frames2);

      done();
    }, 1);
  });
});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EseUJBQXlCLGVBQWU7O0FBRXhDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3JvbGxiYXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvY29uc29sZS1wb2x5ZmlsbC9pbmRleC5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vbm9kZV9tb2R1bGVzL2Vycm9yLXN0YWNrLXBhcnNlci9lcnJvci1zdGFjay1wYXJzZXIuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL25vZGVfbW9kdWxlcy9lcnJvci1zdGFjay1wYXJzZXIvbm9kZV9tb2R1bGVzL3N0YWNrZnJhbWUvc3RhY2tmcmFtZS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL2FwaS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL2FwaVV0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9icm93c2VyL2NvcmUuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9icm93c2VyL2RlZmF1bHRzL3NjcnViRmllbGRzLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvYnJvd3Nlci9kZXRlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9icm93c2VyL2dsb2JhbFNldHVwLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvYnJvd3Nlci9sb2dnZXIuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9icm93c2VyL3ByZWRpY2F0ZXMuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9icm93c2VyL3JlcGxheS9kZWZhdWx0cy5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL2Jyb3dzZXIvcmVwbGF5L3JlcGxheU1hcC5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL2Jyb3dzZXIvdHJhbnNmb3Jtcy5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL2Jyb3dzZXIvdHJhbnNwb3J0LmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvYnJvd3Nlci90cmFuc3BvcnQvZmV0Y2guanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9icm93c2VyL3RyYW5zcG9ydC94aHIuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9icm93c2VyL3VybC5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL2RlZmF1bHRzLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvZXJyb3JQYXJzZXIuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9tZXJnZS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL25vdGlmaWVyLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvcHJlZGljYXRlcy5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3F1ZXVlLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvcmF0ZUxpbWl0ZXIuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9yb2xsYmFyLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvdHJhY2luZy9kZWZhdWx0cy5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3RyYWNpbmcvaWQuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy90cmFuc2Zvcm1zLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvdXRpbGl0eS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3JvbGxiYXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3JvbGxiYXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3Rlc3QvYnJvd3Nlci5jb3JlLnRlc3QuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKHNlbGYsICgpID0+IHtcbnJldHVybiAiLCIvLyBDb25zb2xlLXBvbHlmaWxsLiBNSVQgbGljZW5zZS5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9wYXVsbWlsbHIvY29uc29sZS1wb2x5ZmlsbFxuLy8gTWFrZSBpdCBzYWZlIHRvIGRvIGNvbnNvbGUubG9nKCkgYWx3YXlzLlxuKGZ1bmN0aW9uKGdsb2JhbCkge1xuICAndXNlIHN0cmljdCc7XG4gIGlmICghZ2xvYmFsLmNvbnNvbGUpIHtcbiAgICBnbG9iYWwuY29uc29sZSA9IHt9O1xuICB9XG4gIHZhciBjb24gPSBnbG9iYWwuY29uc29sZTtcbiAgdmFyIHByb3AsIG1ldGhvZDtcbiAgdmFyIGR1bW15ID0gZnVuY3Rpb24oKSB7fTtcbiAgdmFyIHByb3BlcnRpZXMgPSBbJ21lbW9yeSddO1xuICB2YXIgbWV0aG9kcyA9ICgnYXNzZXJ0LGNsZWFyLGNvdW50LGRlYnVnLGRpcixkaXJ4bWwsZXJyb3IsZXhjZXB0aW9uLGdyb3VwLCcgK1xuICAgICAnZ3JvdXBDb2xsYXBzZWQsZ3JvdXBFbmQsaW5mbyxsb2csbWFya1RpbWVsaW5lLHByb2ZpbGUscHJvZmlsZXMscHJvZmlsZUVuZCwnICtcbiAgICAgJ3Nob3csdGFibGUsdGltZSx0aW1lRW5kLHRpbWVsaW5lLHRpbWVsaW5lRW5kLHRpbWVTdGFtcCx0cmFjZSx3YXJuJykuc3BsaXQoJywnKTtcbiAgd2hpbGUgKHByb3AgPSBwcm9wZXJ0aWVzLnBvcCgpKSBpZiAoIWNvbltwcm9wXSkgY29uW3Byb3BdID0ge307XG4gIHdoaWxlIChtZXRob2QgPSBtZXRob2RzLnBvcCgpKSBpZiAoIWNvblttZXRob2RdKSBjb25bbWV0aG9kXSA9IGR1bW15O1xuICAvLyBVc2luZyBgdGhpc2AgZm9yIHdlYiB3b3JrZXJzICYgc3VwcG9ydHMgQnJvd3NlcmlmeSAvIFdlYnBhY2suXG59KSh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IHRoaXMgOiB3aW5kb3cpO1xuIiwiKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLy8gVW5pdmVyc2FsIE1vZHVsZSBEZWZpbml0aW9uIChVTUQpIHRvIHN1cHBvcnQgQU1ELCBDb21tb25KUy9Ob2RlLmpzLCBSaGlubywgYW5kIGJyb3dzZXJzLlxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZSgnZXJyb3Itc3RhY2stcGFyc2VyJywgWydzdGFja2ZyYW1lJ10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdzdGFja2ZyYW1lJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QuRXJyb3JTdGFja1BhcnNlciA9IGZhY3Rvcnkocm9vdC5TdGFja0ZyYW1lKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIoU3RhY2tGcmFtZSkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBGSVJFRk9YX1NBRkFSSV9TVEFDS19SRUdFWFAgPSAvKF58QClcXFMrOlxcZCsvO1xuICAgIHZhciBDSFJPTUVfSUVfU1RBQ0tfUkVHRVhQID0gL15cXHMqYXQgLiooXFxTKzpcXGQrfFxcKG5hdGl2ZVxcKSkvbTtcbiAgICB2YXIgU0FGQVJJX05BVElWRV9DT0RFX1JFR0VYUCA9IC9eKGV2YWxAKT8oXFxbbmF0aXZlIGNvZGVdKT8kLztcblxuICAgIHJldHVybiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHaXZlbiBhbiBFcnJvciBvYmplY3QsIGV4dHJhY3QgdGhlIG1vc3QgaW5mb3JtYXRpb24gZnJvbSBpdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtFcnJvcn0gZXJyb3Igb2JqZWN0XG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fSBvZiBTdGFja0ZyYW1lc1xuICAgICAgICAgKi9cbiAgICAgICAgcGFyc2U6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGVycm9yLnN0YWNrdHJhY2UgIT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBlcnJvclsnb3BlcmEjc291cmNlbG9jJ10gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VPcGVyYShlcnJvcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yLnN0YWNrICYmIGVycm9yLnN0YWNrLm1hdGNoKENIUk9NRV9JRV9TVEFDS19SRUdFWFApKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VWOE9ySUUoZXJyb3IpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvci5zdGFjaykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlRkZPclNhZmFyaShlcnJvcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHBhcnNlIGdpdmVuIEVycm9yIG9iamVjdCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFNlcGFyYXRlIGxpbmUgYW5kIGNvbHVtbiBudW1iZXJzIGZyb20gYSBzdHJpbmcgb2YgdGhlIGZvcm06IChVUkk6TGluZTpDb2x1bW4pXG4gICAgICAgIGV4dHJhY3RMb2NhdGlvbjogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkZXh0cmFjdExvY2F0aW9uKHVybExpa2UpIHtcbiAgICAgICAgICAgIC8vIEZhaWwtZmFzdCBidXQgcmV0dXJuIGxvY2F0aW9ucyBsaWtlIFwiKG5hdGl2ZSlcIlxuICAgICAgICAgICAgaWYgKHVybExpa2UuaW5kZXhPZignOicpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbdXJsTGlrZV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciByZWdFeHAgPSAvKC4rPykoPzo6KFxcZCspKT8oPzo6KFxcZCspKT8kLztcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IHJlZ0V4cC5leGVjKHVybExpa2UucmVwbGFjZSgvWygpXS9nLCAnJykpO1xuICAgICAgICAgICAgcmV0dXJuIFtwYXJ0c1sxXSwgcGFydHNbMl0gfHwgdW5kZWZpbmVkLCBwYXJ0c1szXSB8fCB1bmRlZmluZWRdO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlVjhPcklFOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZVY4T3JJRShlcnJvcikge1xuICAgICAgICAgICAgdmFyIGZpbHRlcmVkID0gZXJyb3Iuc3RhY2suc3BsaXQoJ1xcbicpLmZpbHRlcihmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhbGluZS5tYXRjaChDSFJPTUVfSUVfU1RBQ0tfUkVHRVhQKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyZWQubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICBpZiAobGluZS5pbmRleE9mKCcoZXZhbCAnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRocm93IGF3YXkgZXZhbCBpbmZvcm1hdGlvbiB1bnRpbCB3ZSBpbXBsZW1lbnQgc3RhY2t0cmFjZS5qcy9zdGFja2ZyYW1lIzhcbiAgICAgICAgICAgICAgICAgICAgbGluZSA9IGxpbmUucmVwbGFjZSgvZXZhbCBjb2RlL2csICdldmFsJykucmVwbGFjZSgvKFxcKGV2YWwgYXQgW14oKV0qKXwoXFwpLC4qJCkvZywgJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgc2FuaXRpemVkTGluZSA9IGxpbmUucmVwbGFjZSgvXlxccysvLCAnJykucmVwbGFjZSgvXFwoZXZhbCBjb2RlL2csICcoJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBjYXB0dXJlIGFuZCBwcmVzZXZlIHRoZSBwYXJlbnRoZXNpemVkIGxvY2F0aW9uIFwiKC9mb28vbXkgYmFyLmpzOjEyOjg3KVwiIGluXG4gICAgICAgICAgICAgICAgLy8gY2FzZSBpdCBoYXMgc3BhY2VzIGluIGl0LCBhcyB0aGUgc3RyaW5nIGlzIHNwbGl0IG9uIFxccysgbGF0ZXIgb25cbiAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBzYW5pdGl6ZWRMaW5lLm1hdGNoKC8gKFxcKCguKyk6KFxcZCspOihcXGQrKVxcKSQpLyk7XG5cbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgdGhlIHBhcmVudGhlc2l6ZWQgbG9jYXRpb24gZnJvbSB0aGUgbGluZSwgaWYgaXQgd2FzIG1hdGNoZWRcbiAgICAgICAgICAgICAgICBzYW5pdGl6ZWRMaW5lID0gbG9jYXRpb24gPyBzYW5pdGl6ZWRMaW5lLnJlcGxhY2UobG9jYXRpb25bMF0sICcnKSA6IHNhbml0aXplZExpbmU7XG5cbiAgICAgICAgICAgICAgICB2YXIgdG9rZW5zID0gc2FuaXRpemVkTGluZS5zcGxpdCgvXFxzKy8pLnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgIC8vIGlmIGEgbG9jYXRpb24gd2FzIG1hdGNoZWQsIHBhc3MgaXQgdG8gZXh0cmFjdExvY2F0aW9uKCkgb3RoZXJ3aXNlIHBvcCB0aGUgbGFzdCB0b2tlblxuICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvblBhcnRzID0gdGhpcy5leHRyYWN0TG9jYXRpb24obG9jYXRpb24gPyBsb2NhdGlvblsxXSA6IHRva2Vucy5wb3AoKSk7XG4gICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uTmFtZSA9IHRva2Vucy5qb2luKCcgJykgfHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IFsnZXZhbCcsICc8YW5vbnltb3VzPiddLmluZGV4T2YobG9jYXRpb25QYXJ0c1swXSkgPiAtMSA/IHVuZGVmaW5lZCA6IGxvY2F0aW9uUGFydHNbMF07XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFN0YWNrRnJhbWUoe1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbk5hbWU6IGZ1bmN0aW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IGZpbGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiBsb2NhdGlvblBhcnRzWzFdLFxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5OdW1iZXI6IGxvY2F0aW9uUGFydHNbMl0sXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbGluZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VGRk9yU2FmYXJpOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZUZGT3JTYWZhcmkoZXJyb3IpIHtcbiAgICAgICAgICAgIHZhciBmaWx0ZXJlZCA9IGVycm9yLnN0YWNrLnNwbGl0KCdcXG4nKS5maWx0ZXIoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhbGluZS5tYXRjaChTQUZBUklfTkFUSVZFX0NPREVfUkVHRVhQKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyZWQubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICAvLyBUaHJvdyBhd2F5IGV2YWwgaW5mb3JtYXRpb24gdW50aWwgd2UgaW1wbGVtZW50IHN0YWNrdHJhY2UuanMvc3RhY2tmcmFtZSM4XG4gICAgICAgICAgICAgICAgaWYgKGxpbmUuaW5kZXhPZignID4gZXZhbCcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGluZSA9IGxpbmUucmVwbGFjZSgvIGxpbmUgKFxcZCspKD86ID4gZXZhbCBsaW5lIFxcZCspKiA+IGV2YWw6XFxkKzpcXGQrL2csICc6JDEnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobGluZS5pbmRleE9mKCdAJykgPT09IC0xICYmIGxpbmUuaW5kZXhPZignOicpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTYWZhcmkgZXZhbCBmcmFtZXMgb25seSBoYXZlIGZ1bmN0aW9uIG5hbWVzIGFuZCBub3RoaW5nIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGFja0ZyYW1lKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogbGluZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZnVuY3Rpb25OYW1lUmVnZXggPSAvKCguKlwiLitcIlteQF0qKT9bXkBdKikoPzpAKS87XG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXRjaGVzID0gbGluZS5tYXRjaChmdW5jdGlvbk5hbWVSZWdleCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmdW5jdGlvbk5hbWUgPSBtYXRjaGVzICYmIG1hdGNoZXNbMV0gPyBtYXRjaGVzWzFdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb25QYXJ0cyA9IHRoaXMuZXh0cmFjdExvY2F0aW9uKGxpbmUucmVwbGFjZShmdW5jdGlvbk5hbWVSZWdleCwgJycpKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFN0YWNrRnJhbWUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lOiBmdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZTogbG9jYXRpb25QYXJ0c1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxvY2F0aW9uUGFydHNbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5OdW1iZXI6IGxvY2F0aW9uUGFydHNbMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGxpbmVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VPcGVyYTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VPcGVyYShlKSB7XG4gICAgICAgICAgICBpZiAoIWUuc3RhY2t0cmFjZSB8fCAoZS5tZXNzYWdlLmluZGV4T2YoJ1xcbicpID4gLTEgJiZcbiAgICAgICAgICAgICAgICBlLm1lc3NhZ2Uuc3BsaXQoJ1xcbicpLmxlbmd0aCA+IGUuc3RhY2t0cmFjZS5zcGxpdCgnXFxuJykubGVuZ3RoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlT3BlcmE5KGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghZS5zdGFjaykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlT3BlcmExMChlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VPcGVyYTExKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlT3BlcmE5OiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZU9wZXJhOShlKSB7XG4gICAgICAgICAgICB2YXIgbGluZVJFID0gL0xpbmUgKFxcZCspLipzY3JpcHQgKD86aW4gKT8oXFxTKykvaTtcbiAgICAgICAgICAgIHZhciBsaW5lcyA9IGUubWVzc2FnZS5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAyLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMikge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IGxpbmVSRS5leGVjKGxpbmVzW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV3IFN0YWNrRnJhbWUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IG1hdGNoWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogbWF0Y2hbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGxpbmVzW2ldXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VPcGVyYTEwOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZU9wZXJhMTAoZSkge1xuICAgICAgICAgICAgdmFyIGxpbmVSRSA9IC9MaW5lIChcXGQrKS4qc2NyaXB0ICg/OmluICk/KFxcUyspKD86OiBJbiBmdW5jdGlvbiAoXFxTKykpPyQvaTtcbiAgICAgICAgICAgIHZhciBsaW5lcyA9IGUuc3RhY2t0cmFjZS5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMikge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IGxpbmVSRS5leGVjKGxpbmVzW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgU3RhY2tGcmFtZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lOiBtYXRjaFszXSB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IG1hdGNoWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IG1hdGNoWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbGluZXNbaV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIE9wZXJhIDEwLjY1KyBFcnJvci5zdGFjayB2ZXJ5IHNpbWlsYXIgdG8gRkYvU2FmYXJpXG4gICAgICAgIHBhcnNlT3BlcmExMTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VPcGVyYTExKGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgZmlsdGVyZWQgPSBlcnJvci5zdGFjay5zcGxpdCgnXFxuJykuZmlsdGVyKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFsaW5lLm1hdGNoKEZJUkVGT1hfU0FGQVJJX1NUQUNLX1JFR0VYUCkgJiYgIWxpbmUubWF0Y2goL15FcnJvciBjcmVhdGVkIGF0Lyk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlcmVkLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRva2VucyA9IGxpbmUuc3BsaXQoJ0AnKTtcbiAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb25QYXJ0cyA9IHRoaXMuZXh0cmFjdExvY2F0aW9uKHRva2Vucy5wb3AoKSk7XG4gICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uQ2FsbCA9ICh0b2tlbnMuc2hpZnQoKSB8fCAnJyk7XG4gICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uTmFtZSA9IGZ1bmN0aW9uQ2FsbFxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvPGFub255bW91cyBmdW5jdGlvbig6IChcXHcrKSk/Pi8sICckMicpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXChbXildKlxcKS9nLCAnJykgfHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHZhciBhcmdzUmF3O1xuICAgICAgICAgICAgICAgIGlmIChmdW5jdGlvbkNhbGwubWF0Y2goL1xcKChbXildKilcXCkvKSkge1xuICAgICAgICAgICAgICAgICAgICBhcmdzUmF3ID0gZnVuY3Rpb25DYWxsLnJlcGxhY2UoL15bXihdK1xcKChbXildKilcXCkkLywgJyQxJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gKGFyZ3NSYXcgPT09IHVuZGVmaW5lZCB8fCBhcmdzUmF3ID09PSAnW2FyZ3VtZW50cyBub3QgYXZhaWxhYmxlXScpID9cbiAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkIDogYXJnc1Jhdy5zcGxpdCgnLCcpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGFja0ZyYW1lKHtcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lOiBmdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IGFyZ3MsXG4gICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBsb2NhdGlvblBhcnRzWzBdLFxuICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiBsb2NhdGlvblBhcnRzWzFdLFxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5OdW1iZXI6IGxvY2F0aW9uUGFydHNbMl0sXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbGluZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9O1xufSkpO1xuIiwiKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLy8gVW5pdmVyc2FsIE1vZHVsZSBEZWZpbml0aW9uIChVTUQpIHRvIHN1cHBvcnQgQU1ELCBDb21tb25KUy9Ob2RlLmpzLCBSaGlubywgYW5kIGJyb3dzZXJzLlxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZSgnc3RhY2tmcmFtZScsIFtdLCBmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290LlN0YWNrRnJhbWUgPSBmYWN0b3J5KCk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgZnVuY3Rpb24gX2lzTnVtYmVyKG4pIHtcbiAgICAgICAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfY2FwaXRhbGl6ZShzdHIpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zdWJzdHJpbmcoMSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2dldHRlcihwKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzW3BdO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBib29sZWFuUHJvcHMgPSBbJ2lzQ29uc3RydWN0b3InLCAnaXNFdmFsJywgJ2lzTmF0aXZlJywgJ2lzVG9wbGV2ZWwnXTtcbiAgICB2YXIgbnVtZXJpY1Byb3BzID0gWydjb2x1bW5OdW1iZXInLCAnbGluZU51bWJlciddO1xuICAgIHZhciBzdHJpbmdQcm9wcyA9IFsnZmlsZU5hbWUnLCAnZnVuY3Rpb25OYW1lJywgJ3NvdXJjZSddO1xuICAgIHZhciBhcnJheVByb3BzID0gWydhcmdzJ107XG4gICAgdmFyIG9iamVjdFByb3BzID0gWydldmFsT3JpZ2luJ107XG5cbiAgICB2YXIgcHJvcHMgPSBib29sZWFuUHJvcHMuY29uY2F0KG51bWVyaWNQcm9wcywgc3RyaW5nUHJvcHMsIGFycmF5UHJvcHMsIG9iamVjdFByb3BzKTtcblxuICAgIGZ1bmN0aW9uIFN0YWNrRnJhbWUob2JqKSB7XG4gICAgICAgIGlmICghb2JqKSByZXR1cm47XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChvYmpbcHJvcHNbaV1dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzWydzZXQnICsgX2NhcGl0YWxpemUocHJvcHNbaV0pXShvYmpbcHJvcHNbaV1dKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIFN0YWNrRnJhbWUucHJvdG90eXBlID0ge1xuICAgICAgICBnZXRBcmdzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFyZ3M7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEFyZ3M6IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodikgIT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmdzIG11c3QgYmUgYW4gQXJyYXknKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYXJncyA9IHY7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0RXZhbE9yaWdpbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ldmFsT3JpZ2luO1xuICAgICAgICB9LFxuICAgICAgICBzZXRFdmFsT3JpZ2luOiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICBpZiAodiBpbnN0YW5jZW9mIFN0YWNrRnJhbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV2YWxPcmlnaW4gPSB2O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2IGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ldmFsT3JpZ2luID0gbmV3IFN0YWNrRnJhbWUodik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V2YWwgT3JpZ2luIG11c3QgYmUgYW4gT2JqZWN0IG9yIFN0YWNrRnJhbWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSB0aGlzLmdldEZpbGVOYW1lKCkgfHwgJyc7XG4gICAgICAgICAgICB2YXIgbGluZU51bWJlciA9IHRoaXMuZ2V0TGluZU51bWJlcigpIHx8ICcnO1xuICAgICAgICAgICAgdmFyIGNvbHVtbk51bWJlciA9IHRoaXMuZ2V0Q29sdW1uTnVtYmVyKCkgfHwgJyc7XG4gICAgICAgICAgICB2YXIgZnVuY3Rpb25OYW1lID0gdGhpcy5nZXRGdW5jdGlvbk5hbWUoKSB8fCAnJztcbiAgICAgICAgICAgIGlmICh0aGlzLmdldElzRXZhbCgpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnW2V2YWxdICgnICsgZmlsZU5hbWUgKyAnOicgKyBsaW5lTnVtYmVyICsgJzonICsgY29sdW1uTnVtYmVyICsgJyknO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gJ1tldmFsXTonICsgbGluZU51bWJlciArICc6JyArIGNvbHVtbk51bWJlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmdW5jdGlvbk5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb25OYW1lICsgJyAoJyArIGZpbGVOYW1lICsgJzonICsgbGluZU51bWJlciArICc6JyArIGNvbHVtbk51bWJlciArICcpJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmaWxlTmFtZSArICc6JyArIGxpbmVOdW1iZXIgKyAnOicgKyBjb2x1bW5OdW1iZXI7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgU3RhY2tGcmFtZS5mcm9tU3RyaW5nID0gZnVuY3Rpb24gU3RhY2tGcmFtZSQkZnJvbVN0cmluZyhzdHIpIHtcbiAgICAgICAgdmFyIGFyZ3NTdGFydEluZGV4ID0gc3RyLmluZGV4T2YoJygnKTtcbiAgICAgICAgdmFyIGFyZ3NFbmRJbmRleCA9IHN0ci5sYXN0SW5kZXhPZignKScpO1xuXG4gICAgICAgIHZhciBmdW5jdGlvbk5hbWUgPSBzdHIuc3Vic3RyaW5nKDAsIGFyZ3NTdGFydEluZGV4KTtcbiAgICAgICAgdmFyIGFyZ3MgPSBzdHIuc3Vic3RyaW5nKGFyZ3NTdGFydEluZGV4ICsgMSwgYXJnc0VuZEluZGV4KS5zcGxpdCgnLCcpO1xuICAgICAgICB2YXIgbG9jYXRpb25TdHJpbmcgPSBzdHIuc3Vic3RyaW5nKGFyZ3NFbmRJbmRleCArIDEpO1xuXG4gICAgICAgIGlmIChsb2NhdGlvblN0cmluZy5pbmRleE9mKCdAJykgPT09IDApIHtcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IC9AKC4rPykoPzo6KFxcZCspKT8oPzo6KFxcZCspKT8kLy5leGVjKGxvY2F0aW9uU3RyaW5nLCAnJyk7XG4gICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBwYXJ0c1sxXTtcbiAgICAgICAgICAgIHZhciBsaW5lTnVtYmVyID0gcGFydHNbMl07XG4gICAgICAgICAgICB2YXIgY29sdW1uTnVtYmVyID0gcGFydHNbM107XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFN0YWNrRnJhbWUoe1xuICAgICAgICAgICAgZnVuY3Rpb25OYW1lOiBmdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICBhcmdzOiBhcmdzIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGZpbGVOYW1lOiBmaWxlTmFtZSxcbiAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxpbmVOdW1iZXIgfHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgY29sdW1uTnVtYmVyOiBjb2x1bW5OdW1iZXIgfHwgdW5kZWZpbmVkXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJvb2xlYW5Qcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBTdGFja0ZyYW1lLnByb3RvdHlwZVsnZ2V0JyArIF9jYXBpdGFsaXplKGJvb2xlYW5Qcm9wc1tpXSldID0gX2dldHRlcihib29sZWFuUHJvcHNbaV0pO1xuICAgICAgICBTdGFja0ZyYW1lLnByb3RvdHlwZVsnc2V0JyArIF9jYXBpdGFsaXplKGJvb2xlYW5Qcm9wc1tpXSldID0gKGZ1bmN0aW9uKHApIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgdGhpc1twXSA9IEJvb2xlYW4odik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KShib29sZWFuUHJvcHNbaV0pO1xuICAgIH1cblxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgbnVtZXJpY1Byb3BzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIFN0YWNrRnJhbWUucHJvdG90eXBlWydnZXQnICsgX2NhcGl0YWxpemUobnVtZXJpY1Byb3BzW2pdKV0gPSBfZ2V0dGVyKG51bWVyaWNQcm9wc1tqXSk7XG4gICAgICAgIFN0YWNrRnJhbWUucHJvdG90eXBlWydzZXQnICsgX2NhcGl0YWxpemUobnVtZXJpY1Byb3BzW2pdKV0gPSAoZnVuY3Rpb24ocCkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgICBpZiAoIV9pc051bWJlcih2KSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHAgKyAnIG11c3QgYmUgYSBOdW1iZXInKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpc1twXSA9IE51bWJlcih2KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pKG51bWVyaWNQcm9wc1tqXSk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCBzdHJpbmdQcm9wcy5sZW5ndGg7IGsrKykge1xuICAgICAgICBTdGFja0ZyYW1lLnByb3RvdHlwZVsnZ2V0JyArIF9jYXBpdGFsaXplKHN0cmluZ1Byb3BzW2tdKV0gPSBfZ2V0dGVyKHN0cmluZ1Byb3BzW2tdKTtcbiAgICAgICAgU3RhY2tGcmFtZS5wcm90b3R5cGVbJ3NldCcgKyBfY2FwaXRhbGl6ZShzdHJpbmdQcm9wc1trXSldID0gKGZ1bmN0aW9uKHApIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgdGhpc1twXSA9IFN0cmluZyh2KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pKHN0cmluZ1Byb3BzW2tdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gU3RhY2tGcmFtZTtcbn0pKTtcbiIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsaXR5Jyk7XG52YXIgaGVscGVycyA9IHJlcXVpcmUoJy4vYXBpVXRpbGl0eScpO1xuXG52YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGhvc3RuYW1lOiAnYXBpLnJvbGxiYXIuY29tJyxcbiAgcGF0aDogJy9hcGkvMS9pdGVtLycsXG4gIHNlYXJjaDogbnVsbCxcbiAgdmVyc2lvbjogJzEnLFxuICBwcm90b2NvbDogJ2h0dHBzOicsXG4gIHBvcnQ6IDQ0Myxcbn07XG5cbnZhciBPVExQRGVmYXVsdE9wdGlvbnMgPSB7XG4gIGhvc3RuYW1lOiAnYXBpLnJvbGxiYXIuY29tJyxcbiAgcGF0aDogJy9hcGkvMS9zZXNzaW9uLycsXG4gIHNlYXJjaDogbnVsbCxcbiAgdmVyc2lvbjogJzEnLFxuICBwcm90b2NvbDogJ2h0dHBzOicsXG4gIHBvcnQ6IDQ0Myxcbn07XG5cbi8qKlxuICogQXBpIGlzIGFuIG9iamVjdCB0aGF0IGVuY2Fwc3VsYXRlcyBtZXRob2RzIG9mIGNvbW11bmljYXRpbmcgd2l0aFxuICogdGhlIFJvbGxiYXIgQVBJLiAgSXQgaXMgYSBzdGFuZGFyZCBpbnRlcmZhY2Ugd2l0aCBzb21lIHBhcnRzIGltcGxlbWVudGVkXG4gKiBkaWZmZXJlbnRseSBmb3Igc2VydmVyIG9yIGJyb3dzZXIgY29udGV4dHMuICBJdCBpcyBhbiBvYmplY3QgdGhhdCBzaG91bGRcbiAqIGJlIGluc3RhbnRpYXRlZCB3aGVuIHVzZWQgc28gaXQgY2FuIGNvbnRhaW4gbm9uLWdsb2JhbCBvcHRpb25zIHRoYXQgbWF5XG4gKiBiZSBkaWZmZXJlbnQgZm9yIGFub3RoZXIgaW5zdGFuY2Ugb2YgUm9sbGJhckFwaS5cbiAqXG4gKiBAcGFyYW0gb3B0aW9ucyB7XG4gKiAgICBhY2Nlc3NUb2tlbjogdGhlIGFjY2Vzc1Rva2VuIHRvIHVzZSBmb3IgcG9zdGluZyBpdGVtcyB0byByb2xsYmFyXG4gKiAgICBlbmRwb2ludDogYW4gYWx0ZXJuYXRpdmUgZW5kcG9pbnQgdG8gc2VuZCBlcnJvcnMgdG9cbiAqICAgICAgICBtdXN0IGJlIGEgdmFsaWQsIGZ1bGx5IHF1YWxpZmllZCBVUkwuXG4gKiAgICAgICAgVGhlIGRlZmF1bHQgaXM6IGh0dHBzOi8vYXBpLnJvbGxiYXIuY29tL2FwaS8xL2l0ZW1cbiAqICAgIHByb3h5OiBpZiB5b3Ugd2lzaCB0byBwcm94eSByZXF1ZXN0cyBwcm92aWRlIGFuIG9iamVjdFxuICogICAgICAgIHdpdGggdGhlIGZvbGxvd2luZyBrZXlzOlxuICogICAgICAgICAgaG9zdCBvciBob3N0bmFtZSAocmVxdWlyZWQpOiBmb28uZXhhbXBsZS5jb21cbiAqICAgICAgICAgIHBvcnQgKG9wdGlvbmFsKTogMTIzXG4gKiAgICAgICAgICBwcm90b2NvbCAob3B0aW9uYWwpOiBodHRwc1xuICogfVxuICovXG5mdW5jdGlvbiBBcGkob3B0aW9ucywgdHJhbnNwb3J0LCB1cmxsaWIsIHRydW5jYXRpb24pIHtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgdGhpcy50cmFuc3BvcnQgPSB0cmFuc3BvcnQ7XG4gIHRoaXMudXJsID0gdXJsbGliO1xuICB0aGlzLnRydW5jYXRpb24gPSB0cnVuY2F0aW9uO1xuICB0aGlzLmFjY2Vzc1Rva2VuID0gb3B0aW9ucy5hY2Nlc3NUb2tlbjtcbiAgdGhpcy50cmFuc3BvcnRPcHRpb25zID0gX2dldFRyYW5zcG9ydChvcHRpb25zLCB1cmxsaWIpO1xuICB0aGlzLk9UTFBUcmFuc3BvcnRPcHRpb25zID0gX2dldE9UTFBUcmFuc3BvcnQob3B0aW9ucywgdXJsbGliKTtcbn1cblxuLyoqXG4gKiBXcmFwcyB0cmFuc3BvcnQucG9zdCBpbiBhIFByb21pc2UgdG8gc3VwcG9ydCBhc3luYy9hd2FpdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyBmb3IgdGhlIEFQSSByZXF1ZXN0XG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5hY2Nlc3NUb2tlbiAtIFRoZSBhY2Nlc3MgdG9rZW4gZm9yIGF1dGhlbnRpY2F0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy50cmFuc3BvcnRPcHRpb25zIC0gT3B0aW9ucyBmb3IgdGhlIHRyYW5zcG9ydFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMucGF5bG9hZCAtIFRoZSBkYXRhIHBheWxvYWQgdG8gc2VuZFxuICogQHJldHVybnMge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIHJlc3BvbnNlIG9yIHJlamVjdHMgd2l0aCBhbiBlcnJvclxuICogQHByaXZhdGVcbiAqL1xuQXBpLnByb3RvdHlwZS5fcG9zdFByb21pc2UgPSBmdW5jdGlvbih7IGFjY2Vzc1Rva2VuLCB0cmFuc3BvcnRPcHRpb25zLCBwYXlsb2FkIH0pIHtcbiAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgc2VsZi50cmFuc3BvcnQucG9zdChhY2Nlc3NUb2tlbiwgdHJhbnNwb3J0T3B0aW9ucywgcGF5bG9hZCwgKGVyciwgcmVzcCkgPT5cbiAgICAgIGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZShyZXNwKVxuICAgICk7XG4gIH0pO1xufTtcblxuLyoqXG4gKlxuICogQHBhcmFtIGRhdGFcbiAqIEBwYXJhbSBjYWxsYmFja1xuICovXG5BcGkucHJvdG90eXBlLnBvc3RJdGVtID0gZnVuY3Rpb24gKGRhdGEsIGNhbGxiYWNrKSB7XG4gIHZhciB0cmFuc3BvcnRPcHRpb25zID0gaGVscGVycy50cmFuc3BvcnRPcHRpb25zKFxuICAgIHRoaXMudHJhbnNwb3J0T3B0aW9ucyxcbiAgICAnUE9TVCcsXG4gICk7XG4gIHZhciBwYXlsb2FkID0gaGVscGVycy5idWlsZFBheWxvYWQoZGF0YSk7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICAvLyBlbnN1cmUgdGhlIG5ldHdvcmsgcmVxdWVzdCBpcyBzY2hlZHVsZWQgYWZ0ZXIgdGhlIGN1cnJlbnQgdGljay5cbiAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi50cmFuc3BvcnQucG9zdChzZWxmLmFjY2Vzc1Rva2VuLCB0cmFuc3BvcnRPcHRpb25zLCBwYXlsb2FkLCBjYWxsYmFjayk7XG4gIH0sIDApO1xufTtcblxuLyoqXG4gKiBQb3N0cyBzcGFucyB0byB0aGUgUm9sbGJhciBBUEkgdXNpbmcgdGhlIHNlc3Npb24gZW5kcG9pbnRcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwYXlsb2FkIC0gVGhlIHNwYW5zIHRvIHNlbmRcbiAqIEByZXR1cm5zIHtQcm9taXNlPE9iamVjdD59IEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIEFQSSByZXNwb25zZVxuICovXG5BcGkucHJvdG90eXBlLnBvc3RTcGFucyA9IGFzeW5jIGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gIGNvbnN0IHRyYW5zcG9ydE9wdGlvbnMgPSBoZWxwZXJzLnRyYW5zcG9ydE9wdGlvbnMoXG4gICAgdGhpcy5PVExQVHJhbnNwb3J0T3B0aW9ucyxcbiAgICAnUE9TVCcsXG4gICk7XG5cbiAgcmV0dXJuIGF3YWl0IHRoaXMuX3Bvc3RQcm9taXNlKHtcbiAgICBhY2Nlc3NUb2tlbjogdGhpcy5hY2Nlc3NUb2tlbixcbiAgICB0cmFuc3BvcnRPcHRpb25zLFxuICAgIHBheWxvYWRcbiAgfSk7XG59O1xuXG4vKipcbiAqXG4gKiBAcGFyYW0gZGF0YVxuICogQHBhcmFtIGNhbGxiYWNrXG4gKi9cbkFwaS5wcm90b3R5cGUuYnVpbGRKc29uUGF5bG9hZCA9IGZ1bmN0aW9uIChkYXRhLCBjYWxsYmFjaykge1xuICB2YXIgcGF5bG9hZCA9IGhlbHBlcnMuYnVpbGRQYXlsb2FkKGRhdGEpO1xuXG4gIHZhciBzdHJpbmdpZnlSZXN1bHQ7XG4gIGlmICh0aGlzLnRydW5jYXRpb24pIHtcbiAgICBzdHJpbmdpZnlSZXN1bHQgPSB0aGlzLnRydW5jYXRpb24udHJ1bmNhdGUocGF5bG9hZCk7XG4gIH0gZWxzZSB7XG4gICAgc3RyaW5naWZ5UmVzdWx0ID0gXy5zdHJpbmdpZnkocGF5bG9hZCk7XG4gIH1cblxuICBpZiAoc3RyaW5naWZ5UmVzdWx0LmVycm9yKSB7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjayhzdHJpbmdpZnlSZXN1bHQuZXJyb3IpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBzdHJpbmdpZnlSZXN1bHQudmFsdWU7XG59O1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ganNvblBheWxvYWRcbiAqIEBwYXJhbSBjYWxsYmFja1xuICovXG5BcGkucHJvdG90eXBlLnBvc3RKc29uUGF5bG9hZCA9IGZ1bmN0aW9uIChqc29uUGF5bG9hZCwgY2FsbGJhY2spIHtcbiAgdmFyIHRyYW5zcG9ydE9wdGlvbnMgPSBoZWxwZXJzLnRyYW5zcG9ydE9wdGlvbnMoXG4gICAgdGhpcy50cmFuc3BvcnRPcHRpb25zLFxuICAgICdQT1NUJyxcbiAgKTtcbiAgdGhpcy50cmFuc3BvcnQucG9zdEpzb25QYXlsb2FkKFxuICAgIHRoaXMuYWNjZXNzVG9rZW4sXG4gICAgdHJhbnNwb3J0T3B0aW9ucyxcbiAgICBqc29uUGF5bG9hZCxcbiAgICBjYWxsYmFjayxcbiAgKTtcbn07XG5cbkFwaS5wcm90b3R5cGUuY29uZmlndXJlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdmFyIG9sZE9wdGlvbnMgPSB0aGlzLm9sZE9wdGlvbnM7XG4gIHRoaXMub3B0aW9ucyA9IF8ubWVyZ2Uob2xkT3B0aW9ucywgb3B0aW9ucyk7XG4gIHRoaXMudHJhbnNwb3J0T3B0aW9ucyA9IF9nZXRUcmFuc3BvcnQodGhpcy5vcHRpb25zLCB0aGlzLnVybCk7XG4gIHRoaXMuT1RMUFRyYW5zcG9ydE9wdGlvbnMgPSBfZ2V0T1RMUFRyYW5zcG9ydCh0aGlzLm9wdGlvbnMsIHRoaXMudXJsKTtcbiAgaWYgKHRoaXMub3B0aW9ucy5hY2Nlc3NUb2tlbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5hY2Nlc3NUb2tlbiA9IHRoaXMub3B0aW9ucy5hY2Nlc3NUb2tlbjtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbmZ1bmN0aW9uIF9nZXRUcmFuc3BvcnQob3B0aW9ucywgdXJsKSB7XG4gIHJldHVybiBoZWxwZXJzLmdldFRyYW5zcG9ydEZyb21PcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zLCB1cmwpO1xufVxuXG5mdW5jdGlvbiBfZ2V0T1RMUFRyYW5zcG9ydChvcHRpb25zLCB1cmwpIHtcbiAgb3B0aW9ucyA9IHsuLi5vcHRpb25zLCBlbmRwb2ludDogb3B0aW9ucy50cmFjaW5nPy5lbmRwb2ludH07XG4gIHJldHVybiBoZWxwZXJzLmdldFRyYW5zcG9ydEZyb21PcHRpb25zKG9wdGlvbnMsIE9UTFBEZWZhdWx0T3B0aW9ucywgdXJsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcGk7XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbGl0eScpO1xuXG5mdW5jdGlvbiBidWlsZFBheWxvYWQoZGF0YSkge1xuICBpZiAoIV8uaXNUeXBlKGRhdGEuY29udGV4dCwgJ3N0cmluZycpKSB7XG4gICAgdmFyIGNvbnRleHRSZXN1bHQgPSBfLnN0cmluZ2lmeShkYXRhLmNvbnRleHQpO1xuICAgIGlmIChjb250ZXh0UmVzdWx0LmVycm9yKSB7XG4gICAgICBkYXRhLmNvbnRleHQgPSBcIkVycm9yOiBjb3VsZCBub3Qgc2VyaWFsaXplICdjb250ZXh0J1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhLmNvbnRleHQgPSBjb250ZXh0UmVzdWx0LnZhbHVlIHx8ICcnO1xuICAgIH1cbiAgICBpZiAoZGF0YS5jb250ZXh0Lmxlbmd0aCA+IDI1NSkge1xuICAgICAgZGF0YS5jb250ZXh0ID0gZGF0YS5jb250ZXh0LnN1YnN0cigwLCAyNTUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIGRhdGE6IGRhdGEsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldFRyYW5zcG9ydEZyb21PcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRzLCB1cmwpIHtcbiAgdmFyIGhvc3RuYW1lID0gZGVmYXVsdHMuaG9zdG5hbWU7XG4gIHZhciBwcm90b2NvbCA9IGRlZmF1bHRzLnByb3RvY29sO1xuICB2YXIgcG9ydCA9IGRlZmF1bHRzLnBvcnQ7XG4gIHZhciBwYXRoID0gZGVmYXVsdHMucGF0aDtcbiAgdmFyIHNlYXJjaCA9IGRlZmF1bHRzLnNlYXJjaDtcbiAgdmFyIHRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXQ7XG4gIHZhciB0cmFuc3BvcnQgPSBkZXRlY3RUcmFuc3BvcnQob3B0aW9ucyk7XG5cbiAgdmFyIHByb3h5ID0gb3B0aW9ucy5wcm94eTtcbiAgaWYgKG9wdGlvbnMuZW5kcG9pbnQpIHtcbiAgICB2YXIgb3B0cyA9IHVybC5wYXJzZShvcHRpb25zLmVuZHBvaW50KTtcbiAgICBob3N0bmFtZSA9IG9wdHMuaG9zdG5hbWU7XG4gICAgcHJvdG9jb2wgPSBvcHRzLnByb3RvY29sO1xuICAgIHBvcnQgPSBvcHRzLnBvcnQ7XG4gICAgcGF0aCA9IG9wdHMucGF0aG5hbWU7XG4gICAgc2VhcmNoID0gb3B0cy5zZWFyY2g7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgIGhvc3RuYW1lOiBob3N0bmFtZSxcbiAgICBwcm90b2NvbDogcHJvdG9jb2wsXG4gICAgcG9ydDogcG9ydCxcbiAgICBwYXRoOiBwYXRoLFxuICAgIHNlYXJjaDogc2VhcmNoLFxuICAgIHByb3h5OiBwcm94eSxcbiAgICB0cmFuc3BvcnQ6IHRyYW5zcG9ydCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gZGV0ZWN0VHJhbnNwb3J0KG9wdGlvbnMpIHtcbiAgdmFyIGdXaW5kb3cgPVxuICAgICh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdykgfHxcbiAgICAodHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZik7XG4gIHZhciB0cmFuc3BvcnQgPSBvcHRpb25zLmRlZmF1bHRUcmFuc3BvcnQgfHwgJ3hocic7XG4gIGlmICh0eXBlb2YgZ1dpbmRvdy5mZXRjaCA9PT0gJ3VuZGVmaW5lZCcpIHRyYW5zcG9ydCA9ICd4aHInO1xuICBpZiAodHlwZW9mIGdXaW5kb3cuWE1MSHR0cFJlcXVlc3QgPT09ICd1bmRlZmluZWQnKSB0cmFuc3BvcnQgPSAnZmV0Y2gnO1xuICByZXR1cm4gdHJhbnNwb3J0O1xufVxuXG5mdW5jdGlvbiB0cmFuc3BvcnRPcHRpb25zKHRyYW5zcG9ydCwgbWV0aG9kKSB7XG4gIHZhciBwcm90b2NvbCA9IHRyYW5zcG9ydC5wcm90b2NvbCB8fCAnaHR0cHM6JztcbiAgdmFyIHBvcnQgPVxuICAgIHRyYW5zcG9ydC5wb3J0IHx8XG4gICAgKHByb3RvY29sID09PSAnaHR0cDonID8gODAgOiBwcm90b2NvbCA9PT0gJ2h0dHBzOicgPyA0NDMgOiB1bmRlZmluZWQpO1xuICB2YXIgaG9zdG5hbWUgPSB0cmFuc3BvcnQuaG9zdG5hbWU7XG4gIHZhciBwYXRoID0gdHJhbnNwb3J0LnBhdGg7XG4gIHZhciB0aW1lb3V0ID0gdHJhbnNwb3J0LnRpbWVvdXQ7XG4gIHZhciB0cmFuc3BvcnRBUEkgPSB0cmFuc3BvcnQudHJhbnNwb3J0O1xuICBpZiAodHJhbnNwb3J0LnNlYXJjaCkge1xuICAgIHBhdGggPSBwYXRoICsgdHJhbnNwb3J0LnNlYXJjaDtcbiAgfVxuICBpZiAodHJhbnNwb3J0LnByb3h5KSB7XG4gICAgcGF0aCA9IHByb3RvY29sICsgJy8vJyArIGhvc3RuYW1lICsgcGF0aDtcbiAgICBob3N0bmFtZSA9IHRyYW5zcG9ydC5wcm94eS5ob3N0IHx8IHRyYW5zcG9ydC5wcm94eS5ob3N0bmFtZTtcbiAgICBwb3J0ID0gdHJhbnNwb3J0LnByb3h5LnBvcnQ7XG4gICAgcHJvdG9jb2wgPSB0cmFuc3BvcnQucHJveHkucHJvdG9jb2wgfHwgcHJvdG9jb2w7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgIHByb3RvY29sOiBwcm90b2NvbCxcbiAgICBob3N0bmFtZTogaG9zdG5hbWUsXG4gICAgcGF0aDogcGF0aCxcbiAgICBwb3J0OiBwb3J0LFxuICAgIG1ldGhvZDogbWV0aG9kLFxuICAgIHRyYW5zcG9ydDogdHJhbnNwb3J0QVBJLFxuICB9O1xufVxuXG5mdW5jdGlvbiBhcHBlbmRQYXRoVG9QYXRoKGJhc2UsIHBhdGgpIHtcbiAgdmFyIGJhc2VUcmFpbGluZ1NsYXNoID0gL1xcLyQvLnRlc3QoYmFzZSk7XG4gIHZhciBwYXRoQmVnaW5uaW5nU2xhc2ggPSAvXlxcLy8udGVzdChwYXRoKTtcblxuICBpZiAoYmFzZVRyYWlsaW5nU2xhc2ggJiYgcGF0aEJlZ2lubmluZ1NsYXNoKSB7XG4gICAgcGF0aCA9IHBhdGguc3Vic3RyaW5nKDEpO1xuICB9IGVsc2UgaWYgKCFiYXNlVHJhaWxpbmdTbGFzaCAmJiAhcGF0aEJlZ2lubmluZ1NsYXNoKSB7XG4gICAgcGF0aCA9ICcvJyArIHBhdGg7XG4gIH1cblxuICByZXR1cm4gYmFzZSArIHBhdGg7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBidWlsZFBheWxvYWQ6IGJ1aWxkUGF5bG9hZCxcbiAgZ2V0VHJhbnNwb3J0RnJvbU9wdGlvbnM6IGdldFRyYW5zcG9ydEZyb21PcHRpb25zLFxuICB0cmFuc3BvcnRPcHRpb25zOiB0cmFuc3BvcnRPcHRpb25zLFxuICBhcHBlbmRQYXRoVG9QYXRoOiBhcHBlbmRQYXRoVG9QYXRoLFxufTtcbiIsInZhciBDbGllbnQgPSByZXF1aXJlKCcuLi9yb2xsYmFyJyk7XG52YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWxpdHknKTtcbnZhciBBUEkgPSByZXF1aXJlKCcuLi9hcGknKTtcbnZhciBsb2dnZXIgPSByZXF1aXJlKCcuL2xvZ2dlcicpO1xudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuL2dsb2JhbFNldHVwJyk7XG5cbnZhciBUcmFuc3BvcnQgPSByZXF1aXJlKCcuL3RyYW5zcG9ydCcpO1xudmFyIHVybGxpYiA9IHJlcXVpcmUoJy4vdXJsJyk7XG5cbnZhciB0cmFuc2Zvcm1zID0gcmVxdWlyZSgnLi90cmFuc2Zvcm1zJyk7XG52YXIgc2hhcmVkVHJhbnNmb3JtcyA9IHJlcXVpcmUoJy4uL3RyYW5zZm9ybXMnKTtcbnZhciBwcmVkaWNhdGVzID0gcmVxdWlyZSgnLi9wcmVkaWNhdGVzJyk7XG52YXIgc2hhcmVkUHJlZGljYXRlcyA9IHJlcXVpcmUoJy4uL3ByZWRpY2F0ZXMnKTtcbnZhciBlcnJvclBhcnNlciA9IHJlcXVpcmUoJy4uL2Vycm9yUGFyc2VyJyk7XG5jb25zdCByZWNvcmRlckRlZmF1bHRzID0gcmVxdWlyZSgnLi9yZXBsYXkvZGVmYXVsdHMnKTtcbmNvbnN0IHRyYWNpbmdEZWZhdWx0cyA9IHJlcXVpcmUoJy4uL3RyYWNpbmcvZGVmYXVsdHMnKTtcbmNvbnN0IFJlcGxheU1hcCA9IHJlcXVpcmUoJy4vcmVwbGF5L3JlcGxheU1hcCcpLmRlZmF1bHQ7XG5cbmZ1bmN0aW9uIFJvbGxiYXIob3B0aW9ucywgY2xpZW50KSB7XG4gIHRoaXMub3B0aW9ucyA9IF8uaGFuZGxlT3B0aW9ucyhkZWZhdWx0T3B0aW9ucywgb3B0aW9ucywgbnVsbCwgbG9nZ2VyKTtcbiAgdGhpcy5vcHRpb25zLl9jb25maWd1cmVkT3B0aW9ucyA9IG9wdGlvbnM7XG4gIGNvbnN0IFRlbGVtZXRlciA9IHRoaXMuY29tcG9uZW50cy50ZWxlbWV0ZXI7XG4gIGNvbnN0IEluc3RydW1lbnRlciA9IHRoaXMuY29tcG9uZW50cy5pbnN0cnVtZW50ZXI7XG4gIGNvbnN0IHBvbHlmaWxsSlNPTiA9IHRoaXMuY29tcG9uZW50cy5wb2x5ZmlsbEpTT047XG4gIHRoaXMud3JhcEdsb2JhbHMgPSB0aGlzLmNvbXBvbmVudHMud3JhcEdsb2JhbHM7XG4gIHRoaXMuc2NydWIgPSB0aGlzLmNvbXBvbmVudHMuc2NydWI7XG4gIGNvbnN0IHRydW5jYXRpb24gPSB0aGlzLmNvbXBvbmVudHMudHJ1bmNhdGlvbjtcbiAgY29uc3QgVHJhY2luZyA9IHRoaXMuY29tcG9uZW50cy50cmFjaW5nO1xuICBjb25zdCBSZWNvcmRlciA9IHRoaXMuY29tcG9uZW50cy5yZWNvcmRlcjtcblxuICBjb25zdCB0cmFuc3BvcnQgPSBuZXcgVHJhbnNwb3J0KHRydW5jYXRpb24pO1xuICBjb25zdCBhcGkgPSBuZXcgQVBJKHRoaXMub3B0aW9ucywgdHJhbnNwb3J0LCB1cmxsaWIsIHRydW5jYXRpb24pO1xuICBpZiAoVHJhY2luZykge1xuICAgIHRoaXMudHJhY2luZyA9IG5ldyBUcmFjaW5nKF9nV2luZG93KCksIHRoaXMub3B0aW9ucyk7XG4gICAgdGhpcy50cmFjaW5nLmluaXRTZXNzaW9uKCk7XG4gIH1cblxuICBpZiAoUmVjb3JkZXIgJiYgXy5pc0Jyb3dzZXIoKSkge1xuICAgIGNvbnN0IHJlY29yZGVyT3B0aW9ucyA9IHRoaXMub3B0aW9ucy5yZWNvcmRlcjtcbiAgICB0aGlzLnJlY29yZGVyID0gbmV3IFJlY29yZGVyKHJlY29yZGVyT3B0aW9ucyk7XG4gICAgdGhpcy5yZXBsYXlNYXAgPSBuZXcgUmVwbGF5TWFwKHtcbiAgICAgIHJlY29yZGVyOiB0aGlzLnJlY29yZGVyLFxuICAgICAgYXBpOiBhcGksXG4gICAgICB0cmFjaW5nOiB0aGlzLnRyYWNpbmdcbiAgICB9KTtcblxuICAgIGlmIChyZWNvcmRlck9wdGlvbnMuZW5hYmxlZCAmJiByZWNvcmRlck9wdGlvbnMuYXV0b1N0YXJ0KSB7XG4gICAgICB0aGlzLnJlY29yZGVyLnN0YXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKFRlbGVtZXRlcikge1xuICAgIHRoaXMudGVsZW1ldGVyID0gbmV3IFRlbGVtZXRlcih0aGlzLm9wdGlvbnMsIHRoaXMudHJhY2luZyk7XG4gIH1cbiAgdGhpcy5jbGllbnQgPVxuICAgIGNsaWVudCB8fCBuZXcgQ2xpZW50KHRoaXMub3B0aW9ucywgYXBpLCBsb2dnZXIsIHRoaXMudGVsZW1ldGVyLCB0aGlzLnRyYWNpbmcsIHRoaXMucmVwbGF5TWFwLCAnYnJvd3NlcicpO1xuICB2YXIgZ1dpbmRvdyA9IF9nV2luZG93KCk7XG4gIHZhciBnRG9jdW1lbnQgPSB0eXBlb2YgZG9jdW1lbnQgIT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnQ7XG4gIHRoaXMuaXNDaHJvbWUgPSBnV2luZG93LmNocm9tZSAmJiBnV2luZG93LmNocm9tZS5ydW50aW1lOyAvLyBjaGVjayAucnVudGltZSB0byBhdm9pZCBFZGdlIGJyb3dzZXJzXG4gIHRoaXMuYW5vbnltb3VzRXJyb3JzUGVuZGluZyA9IDA7XG4gIGFkZFRyYW5zZm9ybXNUb05vdGlmaWVyKHRoaXMuY2xpZW50Lm5vdGlmaWVyLCB0aGlzLCBnV2luZG93KTtcbiAgYWRkUHJlZGljYXRlc1RvUXVldWUodGhpcy5jbGllbnQucXVldWUpO1xuICB0aGlzLnNldHVwVW5oYW5kbGVkQ2FwdHVyZSgpO1xuICBpZiAoSW5zdHJ1bWVudGVyKSB7XG4gICAgdGhpcy5pbnN0cnVtZW50ZXIgPSBuZXcgSW5zdHJ1bWVudGVyKFxuICAgICAgdGhpcy5vcHRpb25zLFxuICAgICAgdGhpcy5jbGllbnQudGVsZW1ldGVyLFxuICAgICAgdGhpcyxcbiAgICAgIGdXaW5kb3csXG4gICAgICBnRG9jdW1lbnQsXG4gICAgKTtcbiAgICB0aGlzLmluc3RydW1lbnRlci5pbnN0cnVtZW50KCk7XG4gIH1cbiAgXy5zZXR1cEpTT04ocG9seWZpbGxKU09OKTtcblxuICAvLyBVc2VkIHdpdGggcm9sbGJhci1yZWFjdCBmb3Igcm9sbGJhci1yZWFjdC1uYXRpdmUgY29tcGF0aWJpbGl0eS5cbiAgdGhpcy5yb2xsYmFyID0gdGhpcztcbn1cblxudmFyIF9pbnN0YW5jZSA9IG51bGw7XG5Sb2xsYmFyLmluaXQgPSBmdW5jdGlvbiAob3B0aW9ucywgY2xpZW50KSB7XG4gIGlmIChfaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gX2luc3RhbmNlLmdsb2JhbChvcHRpb25zKS5jb25maWd1cmUob3B0aW9ucyk7XG4gIH1cbiAgX2luc3RhbmNlID0gbmV3IFJvbGxiYXIob3B0aW9ucywgY2xpZW50KTtcbiAgcmV0dXJuIF9pbnN0YW5jZTtcbn07XG5cblJvbGxiYXIucHJvdG90eXBlLmNvbXBvbmVudHMgPSB7fTtcblxuUm9sbGJhci5zZXRDb21wb25lbnRzID0gZnVuY3Rpb24gKGNvbXBvbmVudHMpIHtcbiAgUm9sbGJhci5wcm90b3R5cGUuY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG59O1xuXG5mdW5jdGlvbiBoYW5kbGVVbmluaXRpYWxpemVkKG1heWJlQ2FsbGJhY2spIHtcbiAgdmFyIG1lc3NhZ2UgPSAnUm9sbGJhciBpcyBub3QgaW5pdGlhbGl6ZWQnO1xuICBsb2dnZXIuZXJyb3IobWVzc2FnZSk7XG4gIGlmIChtYXliZUNhbGxiYWNrKSB7XG4gICAgbWF5YmVDYWxsYmFjayhuZXcgRXJyb3IobWVzc2FnZSkpO1xuICB9XG59XG5cblJvbGxiYXIucHJvdG90eXBlLmdsb2JhbCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHRoaXMuY2xpZW50Lmdsb2JhbChvcHRpb25zKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuUm9sbGJhci5nbG9iYWwgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICBpZiAoX2luc3RhbmNlKSB7XG4gICAgcmV0dXJuIF9pbnN0YW5jZS5nbG9iYWwob3B0aW9ucyk7XG4gIH0gZWxzZSB7XG4gICAgaGFuZGxlVW5pbml0aWFsaXplZCgpO1xuICB9XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5jb25maWd1cmUgPSBmdW5jdGlvbiAob3B0aW9ucywgcGF5bG9hZERhdGEpIHtcbiAgdmFyIG9sZE9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gIHZhciBwYXlsb2FkID0ge307XG4gIGlmIChwYXlsb2FkRGF0YSkge1xuICAgIHBheWxvYWQgPSB7IHBheWxvYWQ6IHBheWxvYWREYXRhIH07XG4gIH1cblxuICB0aGlzLm9wdGlvbnMgPSBfLmhhbmRsZU9wdGlvbnMob2xkT3B0aW9ucywgb3B0aW9ucywgcGF5bG9hZCwgbG9nZ2VyKTtcbiAgdGhpcy5vcHRpb25zLl9jb25maWd1cmVkT3B0aW9ucyA9IF8uaGFuZGxlT3B0aW9ucyhcbiAgICBvbGRPcHRpb25zLl9jb25maWd1cmVkT3B0aW9ucyxcbiAgICBvcHRpb25zLFxuICAgIHBheWxvYWQsXG4gICk7XG5cbiAgdGhpcy5yZWNvcmRlcj8uY29uZmlndXJlKHRoaXMub3B0aW9ucyk7XG4gIHRoaXMuY2xpZW50LmNvbmZpZ3VyZSh0aGlzLm9wdGlvbnMsIHBheWxvYWREYXRhKTtcbiAgdGhpcy5pbnN0cnVtZW50ZXIgJiYgdGhpcy5pbnN0cnVtZW50ZXIuY29uZmlndXJlKHRoaXMub3B0aW9ucyk7XG4gIHRoaXMuc2V0dXBVbmhhbmRsZWRDYXB0dXJlKCk7XG4gIHJldHVybiB0aGlzO1xufTtcblJvbGxiYXIuY29uZmlndXJlID0gZnVuY3Rpb24gKG9wdGlvbnMsIHBheWxvYWREYXRhKSB7XG4gIGlmIChfaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gX2luc3RhbmNlLmNvbmZpZ3VyZShvcHRpb25zLCBwYXlsb2FkRGF0YSk7XG4gIH0gZWxzZSB7XG4gICAgaGFuZGxlVW5pbml0aWFsaXplZCgpO1xuICB9XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5sYXN0RXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLmNsaWVudC5sYXN0RXJyb3I7XG59O1xuUm9sbGJhci5sYXN0RXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChfaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gX2luc3RhbmNlLmxhc3RFcnJvcigpO1xuICB9IGVsc2Uge1xuICAgIGhhbmRsZVVuaW5pdGlhbGl6ZWQoKTtcbiAgfVxufTtcblxuUm9sbGJhci5wcm90b3R5cGUubG9nID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaXRlbSA9IHRoaXMuX2NyZWF0ZUl0ZW0oYXJndW1lbnRzKTtcbiAgdmFyIHV1aWQgPSBpdGVtLnV1aWQ7XG4gIHRoaXMuY2xpZW50LmxvZyhpdGVtKTtcbiAgcmV0dXJuIHsgdXVpZDogdXVpZCB9O1xufTtcblJvbGxiYXIubG9nID0gZnVuY3Rpb24gKCkge1xuICBpZiAoX2luc3RhbmNlKSB7XG4gICAgcmV0dXJuIF9pbnN0YW5jZS5sb2cuYXBwbHkoX2luc3RhbmNlLCBhcmd1bWVudHMpO1xuICB9IGVsc2Uge1xuICAgIHZhciBtYXliZUNhbGxiYWNrID0gX2dldEZpcnN0RnVuY3Rpb24oYXJndW1lbnRzKTtcbiAgICBoYW5kbGVVbmluaXRpYWxpemVkKG1heWJlQ2FsbGJhY2spO1xuICB9XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5kZWJ1ZyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGl0ZW0gPSB0aGlzLl9jcmVhdGVJdGVtKGFyZ3VtZW50cyk7XG4gIHZhciB1dWlkID0gaXRlbS51dWlkO1xuICB0aGlzLmNsaWVudC5kZWJ1ZyhpdGVtKTtcbiAgcmV0dXJuIHsgdXVpZDogdXVpZCB9O1xufTtcblJvbGxiYXIuZGVidWcgPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChfaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gX2luc3RhbmNlLmRlYnVnLmFwcGx5KF9pbnN0YW5jZSwgYXJndW1lbnRzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbWF5YmVDYWxsYmFjayA9IF9nZXRGaXJzdEZ1bmN0aW9uKGFyZ3VtZW50cyk7XG4gICAgaGFuZGxlVW5pbml0aWFsaXplZChtYXliZUNhbGxiYWNrKTtcbiAgfVxufTtcblxuUm9sbGJhci5wcm90b3R5cGUuaW5mbyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGl0ZW0gPSB0aGlzLl9jcmVhdGVJdGVtKGFyZ3VtZW50cyk7XG4gIHZhciB1dWlkID0gaXRlbS51dWlkO1xuICB0aGlzLmNsaWVudC5pbmZvKGl0ZW0pO1xuICByZXR1cm4geyB1dWlkOiB1dWlkIH07XG59O1xuUm9sbGJhci5pbmZvID0gZnVuY3Rpb24gKCkge1xuICBpZiAoX2luc3RhbmNlKSB7XG4gICAgcmV0dXJuIF9pbnN0YW5jZS5pbmZvLmFwcGx5KF9pbnN0YW5jZSwgYXJndW1lbnRzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbWF5YmVDYWxsYmFjayA9IF9nZXRGaXJzdEZ1bmN0aW9uKGFyZ3VtZW50cyk7XG4gICAgaGFuZGxlVW5pbml0aWFsaXplZChtYXliZUNhbGxiYWNrKTtcbiAgfVxufTtcblxuUm9sbGJhci5wcm90b3R5cGUud2FybiA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGl0ZW0gPSB0aGlzLl9jcmVhdGVJdGVtKGFyZ3VtZW50cyk7XG4gIHZhciB1dWlkID0gaXRlbS51dWlkO1xuICB0aGlzLmNsaWVudC53YXJuKGl0ZW0pO1xuICByZXR1cm4geyB1dWlkOiB1dWlkIH07XG59O1xuUm9sbGJhci53YXJuID0gZnVuY3Rpb24gKCkge1xuICBpZiAoX2luc3RhbmNlKSB7XG4gICAgcmV0dXJuIF9pbnN0YW5jZS53YXJuLmFwcGx5KF9pbnN0YW5jZSwgYXJndW1lbnRzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbWF5YmVDYWxsYmFjayA9IF9nZXRGaXJzdEZ1bmN0aW9uKGFyZ3VtZW50cyk7XG4gICAgaGFuZGxlVW5pbml0aWFsaXplZChtYXliZUNhbGxiYWNrKTtcbiAgfVxufTtcblxuUm9sbGJhci5wcm90b3R5cGUud2FybmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGl0ZW0gPSB0aGlzLl9jcmVhdGVJdGVtKGFyZ3VtZW50cyk7XG4gIHZhciB1dWlkID0gaXRlbS51dWlkO1xuICB0aGlzLmNsaWVudC53YXJuaW5nKGl0ZW0pO1xuICByZXR1cm4geyB1dWlkOiB1dWlkIH07XG59O1xuUm9sbGJhci53YXJuaW5nID0gZnVuY3Rpb24gKCkge1xuICBpZiAoX2luc3RhbmNlKSB7XG4gICAgcmV0dXJuIF9pbnN0YW5jZS53YXJuaW5nLmFwcGx5KF9pbnN0YW5jZSwgYXJndW1lbnRzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbWF5YmVDYWxsYmFjayA9IF9nZXRGaXJzdEZ1bmN0aW9uKGFyZ3VtZW50cyk7XG4gICAgaGFuZGxlVW5pbml0aWFsaXplZChtYXliZUNhbGxiYWNrKTtcbiAgfVxufTtcblxuUm9sbGJhci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpdGVtID0gdGhpcy5fY3JlYXRlSXRlbShhcmd1bWVudHMpO1xuICB2YXIgdXVpZCA9IGl0ZW0udXVpZDtcbiAgdGhpcy5jbGllbnQuZXJyb3IoaXRlbSk7XG4gIHJldHVybiB7IHV1aWQ6IHV1aWQgfTtcbn07XG5Sb2xsYmFyLmVycm9yID0gZnVuY3Rpb24gKCkge1xuICBpZiAoX2luc3RhbmNlKSB7XG4gICAgcmV0dXJuIF9pbnN0YW5jZS5lcnJvci5hcHBseShfaW5zdGFuY2UsIGFyZ3VtZW50cyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG1heWJlQ2FsbGJhY2sgPSBfZ2V0Rmlyc3RGdW5jdGlvbihhcmd1bWVudHMpO1xuICAgIGhhbmRsZVVuaW5pdGlhbGl6ZWQobWF5YmVDYWxsYmFjayk7XG4gIH1cbn07XG5cblJvbGxiYXIucHJvdG90eXBlLmNyaXRpY2FsID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaXRlbSA9IHRoaXMuX2NyZWF0ZUl0ZW0oYXJndW1lbnRzKTtcbiAgdmFyIHV1aWQgPSBpdGVtLnV1aWQ7XG4gIHRoaXMuY2xpZW50LmNyaXRpY2FsKGl0ZW0pO1xuICByZXR1cm4geyB1dWlkOiB1dWlkIH07XG59O1xuUm9sbGJhci5jcml0aWNhbCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKF9pbnN0YW5jZSkge1xuICAgIHJldHVybiBfaW5zdGFuY2UuY3JpdGljYWwuYXBwbHkoX2luc3RhbmNlLCBhcmd1bWVudHMpO1xuICB9IGVsc2Uge1xuICAgIHZhciBtYXliZUNhbGxiYWNrID0gX2dldEZpcnN0RnVuY3Rpb24oYXJndW1lbnRzKTtcbiAgICBoYW5kbGVVbmluaXRpYWxpemVkKG1heWJlQ2FsbGJhY2spO1xuICB9XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5idWlsZEpzb25QYXlsb2FkID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgcmV0dXJuIHRoaXMuY2xpZW50LmJ1aWxkSnNvblBheWxvYWQoaXRlbSk7XG59O1xuUm9sbGJhci5idWlsZEpzb25QYXlsb2FkID0gZnVuY3Rpb24gKCkge1xuICBpZiAoX2luc3RhbmNlKSB7XG4gICAgcmV0dXJuIF9pbnN0YW5jZS5idWlsZEpzb25QYXlsb2FkLmFwcGx5KF9pbnN0YW5jZSwgYXJndW1lbnRzKTtcbiAgfSBlbHNlIHtcbiAgICBoYW5kbGVVbmluaXRpYWxpemVkKCk7XG4gIH1cbn07XG5cblJvbGxiYXIucHJvdG90eXBlLnNlbmRKc29uUGF5bG9hZCA9IGZ1bmN0aW9uIChqc29uUGF5bG9hZCkge1xuICByZXR1cm4gdGhpcy5jbGllbnQuc2VuZEpzb25QYXlsb2FkKGpzb25QYXlsb2FkKTtcbn07XG5Sb2xsYmFyLnNlbmRKc29uUGF5bG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKF9pbnN0YW5jZSkge1xuICAgIHJldHVybiBfaW5zdGFuY2Uuc2VuZEpzb25QYXlsb2FkLmFwcGx5KF9pbnN0YW5jZSwgYXJndW1lbnRzKTtcbiAgfSBlbHNlIHtcbiAgICBoYW5kbGVVbmluaXRpYWxpemVkKCk7XG4gIH1cbn07XG5cblJvbGxiYXIucHJvdG90eXBlLnNldHVwVW5oYW5kbGVkQ2FwdHVyZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGdXaW5kb3cgPSBfZ1dpbmRvdygpO1xuXG4gIGlmICghdGhpcy51bmhhbmRsZWRFeGNlcHRpb25zSW5pdGlhbGl6ZWQpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmNhcHR1cmVVbmNhdWdodCB8fCB0aGlzLm9wdGlvbnMuaGFuZGxlVW5jYXVnaHRFeGNlcHRpb25zKSB7XG4gICAgICBnbG9iYWxzLmNhcHR1cmVVbmNhdWdodEV4Y2VwdGlvbnMoZ1dpbmRvdywgdGhpcyk7XG4gICAgICBpZiAodGhpcy53cmFwR2xvYmFscyAmJiB0aGlzLm9wdGlvbnMud3JhcEdsb2JhbEV2ZW50SGFuZGxlcnMpIHtcbiAgICAgICAgdGhpcy53cmFwR2xvYmFscyhnV2luZG93LCB0aGlzKTtcbiAgICAgIH1cbiAgICAgIHRoaXMudW5oYW5kbGVkRXhjZXB0aW9uc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgaWYgKCF0aGlzLnVuaGFuZGxlZFJlamVjdGlvbnNJbml0aWFsaXplZCkge1xuICAgIGlmIChcbiAgICAgIHRoaXMub3B0aW9ucy5jYXB0dXJlVW5oYW5kbGVkUmVqZWN0aW9ucyB8fFxuICAgICAgdGhpcy5vcHRpb25zLmhhbmRsZVVuaGFuZGxlZFJlamVjdGlvbnNcbiAgICApIHtcbiAgICAgIGdsb2JhbHMuY2FwdHVyZVVuaGFuZGxlZFJlamVjdGlvbnMoZ1dpbmRvdywgdGhpcyk7XG4gICAgICB0aGlzLnVuaGFuZGxlZFJlamVjdGlvbnNJbml0aWFsaXplZCA9IHRydWU7XG4gICAgfVxuICB9XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5oYW5kbGVVbmNhdWdodEV4Y2VwdGlvbiA9IGZ1bmN0aW9uIChcbiAgbWVzc2FnZSxcbiAgdXJsLFxuICBsaW5lbm8sXG4gIGNvbG5vLFxuICBlcnJvcixcbiAgY29udGV4dCxcbikge1xuICBpZiAoIXRoaXMub3B0aW9ucy5jYXB0dXJlVW5jYXVnaHQgJiYgIXRoaXMub3B0aW9ucy5oYW5kbGVVbmNhdWdodEV4Y2VwdGlvbnMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBDaHJvbWUgd2lsbCBhbHdheXMgc2VuZCA1KyBhcmd1bWVudHMgYW5kIGVycm9yIHdpbGwgYmUgdmFsaWQgb3IgbnVsbCwgbm90IHVuZGVmaW5lZC5cbiAgLy8gSWYgZXJyb3IgaXMgdW5kZWZpbmVkLCB3ZSBoYXZlIGEgZGlmZmVyZW50IGNhbGxlci5cbiAgLy8gQ2hyb21lIGFsc28gc2VuZHMgZXJyb3JzIGZyb20gd2ViIHdvcmtlcnMgd2l0aCBudWxsIGVycm9yLCBidXQgZG9lcyBub3QgaW52b2tlXG4gIC8vIHByZXBhcmVTdGFja1RyYWNlKCkgZm9yIHRoZXNlLiBUZXN0IGZvciBlbXB0eSB1cmwgdG8gc2tpcCB0aGVtLlxuICBpZiAoXG4gICAgdGhpcy5vcHRpb25zLmluc3BlY3RBbm9ueW1vdXNFcnJvcnMgJiZcbiAgICB0aGlzLmlzQ2hyb21lICYmXG4gICAgZXJyb3IgPT09IG51bGwgJiZcbiAgICB1cmwgPT09ICcnXG4gICkge1xuICAgIHJldHVybiAnYW5vbnltb3VzJztcbiAgfVxuXG4gIHZhciBpdGVtO1xuICB2YXIgc3RhY2tJbmZvID0gXy5tYWtlVW5oYW5kbGVkU3RhY2tJbmZvKFxuICAgIG1lc3NhZ2UsXG4gICAgdXJsLFxuICAgIGxpbmVubyxcbiAgICBjb2xubyxcbiAgICBlcnJvcixcbiAgICAnb25lcnJvcicsXG4gICAgJ3VuY2F1Z2h0IGV4Y2VwdGlvbicsXG4gICAgZXJyb3JQYXJzZXIsXG4gICk7XG4gIGlmIChfLmlzRXJyb3IoZXJyb3IpKSB7XG4gICAgaXRlbSA9IHRoaXMuX2NyZWF0ZUl0ZW0oW21lc3NhZ2UsIGVycm9yLCBjb250ZXh0XSk7XG4gICAgaXRlbS5fdW5oYW5kbGVkU3RhY2tJbmZvID0gc3RhY2tJbmZvO1xuICB9IGVsc2UgaWYgKF8uaXNFcnJvcih1cmwpKSB7XG4gICAgaXRlbSA9IHRoaXMuX2NyZWF0ZUl0ZW0oW21lc3NhZ2UsIHVybCwgY29udGV4dF0pO1xuICAgIGl0ZW0uX3VuaGFuZGxlZFN0YWNrSW5mbyA9IHN0YWNrSW5mbztcbiAgfSBlbHNlIHtcbiAgICBpdGVtID0gdGhpcy5fY3JlYXRlSXRlbShbbWVzc2FnZSwgY29udGV4dF0pO1xuICAgIGl0ZW0uc3RhY2tJbmZvID0gc3RhY2tJbmZvO1xuICB9XG4gIGl0ZW0ubGV2ZWwgPSB0aGlzLm9wdGlvbnMudW5jYXVnaHRFcnJvckxldmVsO1xuICBpdGVtLl9pc1VuY2F1Z2h0ID0gdHJ1ZTtcbiAgdGhpcy5jbGllbnQubG9nKGl0ZW0pO1xufTtcblxuLyoqXG4gKiBDaHJvbWUgb25seS4gT3RoZXIgYnJvd3NlcnMgd2lsbCBpZ25vcmUuXG4gKlxuICogVXNlIEVycm9yLnByZXBhcmVTdGFja1RyYWNlIHRvIGV4dHJhY3QgaW5mb3JtYXRpb24gYWJvdXQgZXJyb3JzIHRoYXRcbiAqIGRvIG5vdCBoYXZlIGEgdmFsaWQgZXJyb3Igb2JqZWN0IGluIG9uZXJyb3IoKS5cbiAqXG4gKiBJbiB0ZXN0ZWQgdmVyc2lvbiBvZiBDaHJvbWUsIG9uZXJyb3IgaXMgY2FsbGVkIGZpcnN0IGJ1dCBoYXMgbm8gd2F5XG4gKiB0byBjb21tdW5pY2F0ZSB3aXRoIHByZXBhcmVTdGFja1RyYWNlLiBVc2UgYSBjb3VudGVyIHRvIGxldCB0aGlzXG4gKiBoYW5kbGVyIGtub3cgd2hpY2ggZXJyb3JzIHRvIHNlbmQgdG8gUm9sbGJhci5cbiAqXG4gKiBJbiBjb25maWcgb3B0aW9ucywgc2V0IGluc3BlY3RBbm9ueW1vdXNFcnJvcnMgdG8gZW5hYmxlLlxuICovXG5Sb2xsYmFyLnByb3RvdHlwZS5oYW5kbGVBbm9ueW1vdXNFcnJvcnMgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICghdGhpcy5vcHRpb25zLmluc3BlY3RBbm9ueW1vdXNFcnJvcnMgfHwgIXRoaXMuaXNDaHJvbWUpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgciA9IHRoaXM7XG4gIGZ1bmN0aW9uIHByZXBhcmVTdGFja1RyYWNlKGVycm9yLCBfc3RhY2spIHtcbiAgICBpZiAoci5vcHRpb25zLmluc3BlY3RBbm9ueW1vdXNFcnJvcnMpIHtcbiAgICAgIGlmIChyLmFub255bW91c0Vycm9yc1BlbmRpbmcpIHtcbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgb25seSBrbm93biB3YXkgdG8gZGV0ZWN0IHRoYXQgb25lcnJvciBzYXcgYW4gYW5vbnltb3VzIGVycm9yLlxuICAgICAgICAvLyBJdCBkZXBlbmRzIG9uIG9uZXJyb3IgcmVsaWFibHkgYmVpbmcgY2FsbGVkIGJlZm9yZSBFcnJvci5wcmVwYXJlU3RhY2tUcmFjZSxcbiAgICAgICAgLy8gd2hpY2ggc28gZmFyIGhvbGRzIHRydWUgb24gdGVzdGVkIHZlcnNpb25zIG9mIENocm9tZS4gSWYgdmVyc2lvbnMgb2YgQ2hyb21lXG4gICAgICAgIC8vIGFyZSB0ZXN0ZWQgdGhhdCBiZWhhdmUgZGlmZmVyZW50bHksIHRoaXMgbG9naWMgd2lsbCBuZWVkIHRvIGJlIHVwZGF0ZWRcbiAgICAgICAgLy8gYWNjb3JkaW5nbHkuXG4gICAgICAgIHIuYW5vbnltb3VzRXJyb3JzUGVuZGluZyAtPSAxO1xuXG4gICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAvLyBOb3QgbGlrZWx5IHRvIGdldCBoZXJlLCBidXQgY2FsbGluZyBoYW5kbGVVbmNhdWdodEV4Y2VwdGlvbiBmcm9tIGhlcmVcbiAgICAgICAgICAvLyB3aXRob3V0IGFuIGVycm9yIG9iamVjdCB3b3VsZCB0aHJvdyBvZmYgdGhlIGFub255bW91c0Vycm9yc1BlbmRpbmcgY291bnRlcixcbiAgICAgICAgICAvLyBzbyByZXR1cm4gbm93LlxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFsbG93IHRoaXMgdG8gYmUgdHJhY2tlZCBsYXRlci5cbiAgICAgICAgZXJyb3IuX2lzQW5vbnltb3VzID0gdHJ1ZTtcblxuICAgICAgICAvLyB1cmwsIGxpbmVubywgY29sbm8gc2hvdWxkbid0IGJlIG5lZWRlZCBmb3IgdGhlc2UgZXJyb3JzLlxuICAgICAgICAvLyBJZiB0aGF0IGNoYW5nZXMsIHVwZGF0ZSB0aGlzIGFjY29yZGluZ2x5LCB1c2luZyB0aGUgdW51c2VkXG4gICAgICAgIC8vIF9zdGFjayBwYXJhbSBhcyBuZWVkZWQgKHJhdGhlciB0aGFuIHBhcnNlIGVycm9yLnRvU3RyaW5nKCkpLlxuICAgICAgICByLmhhbmRsZVVuY2F1Z2h0RXhjZXB0aW9uKGVycm9yLm1lc3NhZ2UsIG51bGwsIG51bGwsIG51bGwsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBXb3JrYXJvdW5kIHRvIGVuc3VyZSBzdGFjayBpcyBwcmVzZXJ2ZWQgZm9yIG5vcm1hbCBlcnJvcnMuXG4gICAgcmV0dXJuIGVycm9yLnN0YWNrO1xuICB9XG5cbiAgLy8gaHR0cHM6Ly92OC5kZXYvZG9jcy9zdGFjay10cmFjZS1hcGlcbiAgdHJ5IHtcbiAgICBFcnJvci5wcmVwYXJlU3RhY2tUcmFjZSA9IHByZXBhcmVTdGFja1RyYWNlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhpcy5vcHRpb25zLmluc3BlY3RBbm9ueW1vdXNFcnJvcnMgPSBmYWxzZTtcbiAgICB0aGlzLmVycm9yKCdhbm9ueW1vdXMgZXJyb3IgaGFuZGxlciBmYWlsZWQnLCBlKTtcbiAgfVxufTtcblxuUm9sbGJhci5wcm90b3R5cGUuaGFuZGxlVW5oYW5kbGVkUmVqZWN0aW9uID0gZnVuY3Rpb24gKHJlYXNvbiwgcHJvbWlzZSkge1xuICBpZiAoXG4gICAgIXRoaXMub3B0aW9ucy5jYXB0dXJlVW5oYW5kbGVkUmVqZWN0aW9ucyAmJlxuICAgICF0aGlzLm9wdGlvbnMuaGFuZGxlVW5oYW5kbGVkUmVqZWN0aW9uc1xuICApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgbWVzc2FnZSA9ICd1bmhhbmRsZWQgcmVqZWN0aW9uIHdhcyBudWxsIG9yIHVuZGVmaW5lZCEnO1xuICBpZiAocmVhc29uKSB7XG4gICAgaWYgKHJlYXNvbi5tZXNzYWdlKSB7XG4gICAgICBtZXNzYWdlID0gcmVhc29uLm1lc3NhZ2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByZWFzb25SZXN1bHQgPSBfLnN0cmluZ2lmeShyZWFzb24pO1xuICAgICAgaWYgKHJlYXNvblJlc3VsdC52YWx1ZSkge1xuICAgICAgICBtZXNzYWdlID0gcmVhc29uUmVzdWx0LnZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICB2YXIgY29udGV4dCA9XG4gICAgKHJlYXNvbiAmJiByZWFzb24uX3JvbGxiYXJDb250ZXh0KSB8fCAocHJvbWlzZSAmJiBwcm9taXNlLl9yb2xsYmFyQ29udGV4dCk7XG5cbiAgdmFyIGl0ZW07XG4gIGlmIChfLmlzRXJyb3IocmVhc29uKSkge1xuICAgIGl0ZW0gPSB0aGlzLl9jcmVhdGVJdGVtKFttZXNzYWdlLCByZWFzb24sIGNvbnRleHRdKTtcbiAgfSBlbHNlIHtcbiAgICBpdGVtID0gdGhpcy5fY3JlYXRlSXRlbShbbWVzc2FnZSwgcmVhc29uLCBjb250ZXh0XSk7XG4gICAgaXRlbS5zdGFja0luZm8gPSBfLm1ha2VVbmhhbmRsZWRTdGFja0luZm8oXG4gICAgICBtZXNzYWdlLFxuICAgICAgJycsXG4gICAgICAwLFxuICAgICAgMCxcbiAgICAgIG51bGwsXG4gICAgICAndW5oYW5kbGVkcmVqZWN0aW9uJyxcbiAgICAgICcnLFxuICAgICAgZXJyb3JQYXJzZXIsXG4gICAgKTtcbiAgfVxuICBpdGVtLmxldmVsID0gdGhpcy5vcHRpb25zLnVuY2F1Z2h0RXJyb3JMZXZlbDtcbiAgaXRlbS5faXNVbmNhdWdodCA9IHRydWU7XG4gIGl0ZW0uX29yaWdpbmFsQXJncyA9IGl0ZW0uX29yaWdpbmFsQXJncyB8fCBbXTtcbiAgaXRlbS5fb3JpZ2luYWxBcmdzLnB1c2gocHJvbWlzZSk7XG4gIHRoaXMuY2xpZW50LmxvZyhpdGVtKTtcbn07XG5cblJvbGxiYXIucHJvdG90eXBlLndyYXAgPSBmdW5jdGlvbiAoZiwgY29udGV4dCwgX2JlZm9yZSkge1xuICB0cnkge1xuICAgIHZhciBjdHhGbjtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKGNvbnRleHQpKSB7XG4gICAgICBjdHhGbiA9IGNvbnRleHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eEZuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY29udGV4dCB8fCB7fTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKCFfLmlzRnVuY3Rpb24oZikpIHtcbiAgICAgIHJldHVybiBmO1xuICAgIH1cblxuICAgIGlmIChmLl9pc1dyYXApIHtcbiAgICAgIHJldHVybiBmO1xuICAgIH1cblxuICAgIGlmICghZi5fcm9sbGJhcl93cmFwcGVkKSB7XG4gICAgICBmLl9yb2xsYmFyX3dyYXBwZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChfYmVmb3JlICYmIF8uaXNGdW5jdGlvbihfYmVmb3JlKSkge1xuICAgICAgICAgIF9iZWZvcmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBmLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0gY2F0Y2ggKGV4Yykge1xuICAgICAgICAgIHZhciBlID0gZXhjO1xuICAgICAgICAgIGlmIChlICYmIHdpbmRvdy5fcm9sbGJhcldyYXBwZWRFcnJvciAhPT0gZSkge1xuICAgICAgICAgICAgaWYgKF8uaXNUeXBlKGUsICdzdHJpbmcnKSkge1xuICAgICAgICAgICAgICBlID0gbmV3IFN0cmluZyhlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGUuX3JvbGxiYXJDb250ZXh0ID0gY3R4Rm4oKSB8fCB7fTtcbiAgICAgICAgICAgIGUuX3JvbGxiYXJDb250ZXh0Ll93cmFwcGVkU291cmNlID0gZi50b1N0cmluZygpO1xuXG4gICAgICAgICAgICB3aW5kb3cuX3JvbGxiYXJXcmFwcGVkRXJyb3IgPSBlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBmLl9yb2xsYmFyX3dyYXBwZWQuX2lzV3JhcCA9IHRydWU7XG5cbiAgICAgIGlmIChmLmhhc093blByb3BlcnR5KSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gZikge1xuICAgICAgICAgIGlmIChmLmhhc093blByb3BlcnR5KHByb3ApICYmIHByb3AgIT09ICdfcm9sbGJhcl93cmFwcGVkJykge1xuICAgICAgICAgICAgZi5fcm9sbGJhcl93cmFwcGVkW3Byb3BdID0gZltwcm9wXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZi5fcm9sbGJhcl93cmFwcGVkO1xuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gUmV0dXJuIHRoZSBvcmlnaW5hbCBmdW5jdGlvbiBpZiB0aGUgd3JhcCBmYWlscy5cbiAgICByZXR1cm4gZjtcbiAgfVxufTtcblJvbGxiYXIud3JhcCA9IGZ1bmN0aW9uIChmLCBjb250ZXh0KSB7XG4gIGlmIChfaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gX2luc3RhbmNlLndyYXAoZiwgY29udGV4dCk7XG4gIH0gZWxzZSB7XG4gICAgaGFuZGxlVW5pbml0aWFsaXplZCgpO1xuICB9XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5jYXB0dXJlRXZlbnQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBldmVudCA9IF8uY3JlYXRlVGVsZW1ldHJ5RXZlbnQoYXJndW1lbnRzKTtcbiAgcmV0dXJuIHRoaXMuY2xpZW50LmNhcHR1cmVFdmVudChldmVudC50eXBlLCBldmVudC5tZXRhZGF0YSwgZXZlbnQubGV2ZWwpO1xufTtcblJvbGxiYXIuY2FwdHVyZUV2ZW50ID0gZnVuY3Rpb24gKCkge1xuICBpZiAoX2luc3RhbmNlKSB7XG4gICAgcmV0dXJuIF9pbnN0YW5jZS5jYXB0dXJlRXZlbnQuYXBwbHkoX2luc3RhbmNlLCBhcmd1bWVudHMpO1xuICB9IGVsc2Uge1xuICAgIGhhbmRsZVVuaW5pdGlhbGl6ZWQoKTtcbiAgfVxufTtcblxuLy8gVGhlIGZvbGxvd2luZyB0d28gbWV0aG9kcyBhcmUgdXNlZCBpbnRlcm5hbGx5IGFuZCBhcmUgbm90IG1lYW50IGZvciBwdWJsaWMgdXNlXG5Sb2xsYmFyLnByb3RvdHlwZS5jYXB0dXJlRG9tQ29udGVudExvYWRlZCA9IGZ1bmN0aW9uIChlLCB0cykge1xuICBpZiAoIXRzKSB7XG4gICAgdHMgPSBuZXcgRGF0ZSgpO1xuICB9XG4gIHJldHVybiB0aGlzLmNsaWVudC5jYXB0dXJlRG9tQ29udGVudExvYWRlZCh0cyk7XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5jYXB0dXJlTG9hZCA9IGZ1bmN0aW9uIChlLCB0cykge1xuICBpZiAoIXRzKSB7XG4gICAgdHMgPSBuZXcgRGF0ZSgpO1xuICB9XG4gIHJldHVybiB0aGlzLmNsaWVudC5jYXB0dXJlTG9hZCh0cyk7XG59O1xuXG4vKiBJbnRlcm5hbCAqL1xuXG5mdW5jdGlvbiBhZGRUcmFuc2Zvcm1zVG9Ob3RpZmllcihub3RpZmllciwgcm9sbGJhciwgZ1dpbmRvdykge1xuICBub3RpZmllclxuICAgIC5hZGRUcmFuc2Zvcm0odHJhbnNmb3Jtcy5oYW5kbGVEb21FeGNlcHRpb24pXG4gICAgLmFkZFRyYW5zZm9ybSh0cmFuc2Zvcm1zLmhhbmRsZUl0ZW1XaXRoRXJyb3IpXG4gICAgLmFkZFRyYW5zZm9ybSh0cmFuc2Zvcm1zLmVuc3VyZUl0ZW1IYXNTb21ldGhpbmdUb1NheSlcbiAgICAuYWRkVHJhbnNmb3JtKHRyYW5zZm9ybXMuYWRkQmFzZUluZm8pXG4gICAgLmFkZFRyYW5zZm9ybSh0cmFuc2Zvcm1zLmFkZFJlcXVlc3RJbmZvKGdXaW5kb3cpKVxuICAgIC5hZGRUcmFuc2Zvcm0odHJhbnNmb3Jtcy5hZGRDbGllbnRJbmZvKGdXaW5kb3cpKVxuICAgIC5hZGRUcmFuc2Zvcm0odHJhbnNmb3Jtcy5hZGRQbHVnaW5JbmZvKGdXaW5kb3cpKVxuICAgIC5hZGRUcmFuc2Zvcm0odHJhbnNmb3Jtcy5hZGRCb2R5KVxuICAgIC5hZGRUcmFuc2Zvcm0oc2hhcmVkVHJhbnNmb3Jtcy5hZGRNZXNzYWdlV2l0aEVycm9yKVxuICAgIC5hZGRUcmFuc2Zvcm0oc2hhcmVkVHJhbnNmb3Jtcy5hZGRUZWxlbWV0cnlEYXRhKVxuICAgIC5hZGRUcmFuc2Zvcm0oc2hhcmVkVHJhbnNmb3Jtcy5hZGRDb25maWdUb1BheWxvYWQpXG4gICAgLmFkZFRyYW5zZm9ybSh0cmFuc2Zvcm1zLmFkZFNjcnViYmVyKHJvbGxiYXIuc2NydWIpKVxuICAgIC5hZGRUcmFuc2Zvcm0oc2hhcmVkVHJhbnNmb3Jtcy5hZGRQYXlsb2FkT3B0aW9ucylcbiAgICAuYWRkVHJhbnNmb3JtKHNoYXJlZFRyYW5zZm9ybXMudXNlclRyYW5zZm9ybShsb2dnZXIpKVxuICAgIC5hZGRUcmFuc2Zvcm0oc2hhcmVkVHJhbnNmb3Jtcy5hZGRDb25maWd1cmVkT3B0aW9ucylcbiAgICAuYWRkVHJhbnNmb3JtKHNoYXJlZFRyYW5zZm9ybXMuYWRkRGlhZ25vc3RpY0tleXMpXG4gICAgLmFkZFRyYW5zZm9ybShzaGFyZWRUcmFuc2Zvcm1zLml0ZW1Ub1BheWxvYWQpO1xufVxuXG5mdW5jdGlvbiBhZGRQcmVkaWNhdGVzVG9RdWV1ZShxdWV1ZSkge1xuICBxdWV1ZVxuICAgIC5hZGRQcmVkaWNhdGUoc2hhcmVkUHJlZGljYXRlcy5jaGVja0xldmVsKVxuICAgIC5hZGRQcmVkaWNhdGUocHJlZGljYXRlcy5jaGVja0lnbm9yZSlcbiAgICAuYWRkUHJlZGljYXRlKHNoYXJlZFByZWRpY2F0ZXMudXNlckNoZWNrSWdub3JlKGxvZ2dlcikpXG4gICAgLmFkZFByZWRpY2F0ZShzaGFyZWRQcmVkaWNhdGVzLnVybElzTm90QmxvY2tMaXN0ZWQobG9nZ2VyKSlcbiAgICAuYWRkUHJlZGljYXRlKHNoYXJlZFByZWRpY2F0ZXMudXJsSXNTYWZlTGlzdGVkKGxvZ2dlcikpXG4gICAgLmFkZFByZWRpY2F0ZShzaGFyZWRQcmVkaWNhdGVzLm1lc3NhZ2VJc0lnbm9yZWQobG9nZ2VyKSk7XG59XG5cblJvbGxiYXIucHJvdG90eXBlLmxvYWRGdWxsID0gZnVuY3Rpb24gKCkge1xuICBsb2dnZXIuaW5mbyhcbiAgICAnVW5leHBlY3RlZCBSb2xsYmFyLmxvYWRGdWxsKCkgY2FsbGVkIG9uIGEgTm90aWZpZXIgaW5zdGFuY2UuIFRoaXMgY2FuIGhhcHBlbiB3aGVuIFJvbGxiYXIgaXMgbG9hZGVkIG11bHRpcGxlIHRpbWVzLicsXG4gICk7XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5fY3JlYXRlSXRlbSA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gIHJldHVybiBfLmNyZWF0ZUl0ZW0oYXJncywgbG9nZ2VyLCB0aGlzKTtcbn07XG5cbmZ1bmN0aW9uIF9nZXRGaXJzdEZ1bmN0aW9uKGFyZ3MpIHtcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFyZ3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKGFyZ3NbaV0pKSB7XG4gICAgICByZXR1cm4gYXJnc1tpXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gX2dXaW5kb3coKSB7XG4gIHJldHVybiAoXG4gICAgKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93KSB8fFxuICAgICh0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmKVxuICApO1xufVxuXG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLi9kZWZhdWx0cycpO1xudmFyIHNjcnViRmllbGRzID0gcmVxdWlyZSgnLi9kZWZhdWx0cy9zY3J1YkZpZWxkcycpO1xuXG52YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIHZlcnNpb246IGRlZmF1bHRzLnZlcnNpb24sXG4gIHNjcnViRmllbGRzOiBzY3J1YkZpZWxkcy5zY3J1YkZpZWxkcyxcbiAgbG9nTGV2ZWw6IGRlZmF1bHRzLmxvZ0xldmVsLFxuICByZXBvcnRMZXZlbDogZGVmYXVsdHMucmVwb3J0TGV2ZWwsXG4gIHVuY2F1Z2h0RXJyb3JMZXZlbDogZGVmYXVsdHMudW5jYXVnaHRFcnJvckxldmVsLFxuICBlbmRwb2ludDogZGVmYXVsdHMuZW5kcG9pbnQsXG4gIHZlcmJvc2U6IGZhbHNlLFxuICBlbmFibGVkOiB0cnVlLFxuICB0cmFuc21pdDogdHJ1ZSxcbiAgc2VuZENvbmZpZzogZmFsc2UsXG4gIGluY2x1ZGVJdGVtc0luVGVsZW1ldHJ5OiB0cnVlLFxuICBjYXB0dXJlSXA6IHRydWUsXG4gIGluc3BlY3RBbm9ueW1vdXNFcnJvcnM6IHRydWUsXG4gIGlnbm9yZUR1cGxpY2F0ZUVycm9yczogdHJ1ZSxcbiAgd3JhcEdsb2JhbEV2ZW50SGFuZGxlcnM6IGZhbHNlLFxuICByZWNvcmRlcjogcmVjb3JkZXJEZWZhdWx0cyxcbiAgdHJhY2luZzogdHJhY2luZ0RlZmF1bHRzLFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSb2xsYmFyO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNjcnViRmllbGRzOiBbXG4gICAgJ3B3JyxcbiAgICAncGFzcycsXG4gICAgJ3Bhc3N3ZCcsXG4gICAgJ3Bhc3N3b3JkJyxcbiAgICAnc2VjcmV0JyxcbiAgICAnY29uZmlybV9wYXNzd29yZCcsXG4gICAgJ2NvbmZpcm1QYXNzd29yZCcsXG4gICAgJ3Bhc3N3b3JkX2NvbmZpcm1hdGlvbicsXG4gICAgJ3Bhc3N3b3JkQ29uZmlybWF0aW9uJyxcbiAgICAnYWNjZXNzX3Rva2VuJyxcbiAgICAnYWNjZXNzVG9rZW4nLFxuICAgICdYLVJvbGxiYXItQWNjZXNzLVRva2VuJyxcbiAgICAnc2VjcmV0X2tleScsXG4gICAgJ3NlY3JldEtleScsXG4gICAgJ3NlY3JldFRva2VuJyxcbiAgICAnY2MtbnVtYmVyJyxcbiAgICAnY2FyZCBudW1iZXInLFxuICAgICdjYXJkbnVtYmVyJyxcbiAgICAnY2FyZG51bScsXG4gICAgJ2NjbnVtJyxcbiAgICAnY2NudW1iZXInLFxuICAgICdjYyBudW0nLFxuICAgICdjcmVkaXRjYXJkbnVtYmVyJyxcbiAgICAnY3JlZGl0IGNhcmQgbnVtYmVyJyxcbiAgICAnbmV3Y3JlZGl0Y2FyZG51bWJlcicsXG4gICAgJ25ldyBjcmVkaXQgY2FyZCcsXG4gICAgJ2NyZWRpdGNhcmRubycsXG4gICAgJ2NyZWRpdCBjYXJkIG5vJyxcbiAgICAnY2FyZCMnLFxuICAgICdjYXJkICMnLFxuICAgICdjYy1jc2MnLFxuICAgICdjdmMnLFxuICAgICdjdmMyJyxcbiAgICAnY3Z2MicsXG4gICAgJ2NjdjInLFxuICAgICdzZWN1cml0eSBjb2RlJyxcbiAgICAnY2FyZCB2ZXJpZmljYXRpb24nLFxuICAgICduYW1lIG9uIGNyZWRpdCBjYXJkJyxcbiAgICAnbmFtZSBvbiBjYXJkJyxcbiAgICAnbmFtZW9uY2FyZCcsXG4gICAgJ2NhcmRob2xkZXInLFxuICAgICdjYXJkIGhvbGRlcicsXG4gICAgJ25hbWUgZGVzIGthcnRlbmluaGFiZXJzJyxcbiAgICAnY2NuYW1lJyxcbiAgICAnY2FyZCB0eXBlJyxcbiAgICAnY2FyZHR5cGUnLFxuICAgICdjYyB0eXBlJyxcbiAgICAnY2N0eXBlJyxcbiAgICAncGF5bWVudCB0eXBlJyxcbiAgICAnZXhwaXJhdGlvbiBkYXRlJyxcbiAgICAnZXhwaXJhdGlvbmRhdGUnLFxuICAgICdleHBkYXRlJyxcbiAgICAnY2MtZXhwJyxcbiAgICAnY2Ntb250aCcsXG4gICAgJ2NjeWVhcicsXG4gIF0sXG59O1xuIiwiLy8gVGhpcyBkZXRlY3Rpb24uanMgbW9kdWxlIGlzIHVzZWQgdG8gZW5jYXBzdWxhdGUgYW55IHVnbHkgYnJvd3Nlci9mZWF0dXJlXG4vLyBkZXRlY3Rpb24gd2UgbWF5IG5lZWQgdG8gZG8uXG5cbi8vIEZpZ3VyZSBvdXQgd2hpY2ggdmVyc2lvbiBvZiBJRSB3ZSdyZSB1c2luZywgaWYgYW55LlxuLy8gVGhpcyBpcyBnbGVhbmVkIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NTc0ODQyL2Jlc3Qtd2F5LXRvLWNoZWNrLWZvci1pZS1sZXNzLXRoYW4tOS1pbi1qYXZhc2NyaXB0LXdpdGhvdXQtbGlicmFyeVxuLy8gV2lsbCByZXR1cm4gYW4gaW50ZWdlciBvbiBJRSAoaS5lLiA4KVxuLy8gV2lsbCByZXR1cm4gdW5kZWZpbmVkIG90aGVyd2lzZVxuZnVuY3Rpb24gZ2V0SUVWZXJzaW9uKCkge1xuICB2YXIgdW5kZWY7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHVuZGVmO1xuICB9XG5cbiAgdmFyIHYgPSAzLFxuICAgIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgIGFsbCA9IGRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaScpO1xuXG4gIHdoaWxlIChcbiAgICAoKGRpdi5pbm5lckhUTUwgPSAnPCEtLVtpZiBndCBJRSAnICsgKyt2ICsgJ10+PGk+PC9pPjwhW2VuZGlmXS0tPicpLCBhbGxbMF0pXG4gICk7XG5cbiAgcmV0dXJuIHYgPiA0ID8gdiA6IHVuZGVmO1xufVxuXG52YXIgRGV0ZWN0aW9uID0ge1xuICBpZVZlcnNpb246IGdldElFVmVyc2lvbixcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGV0ZWN0aW9uO1xuIiwiZnVuY3Rpb24gY2FwdHVyZVVuY2F1Z2h0RXhjZXB0aW9ucyh3aW5kb3csIGhhbmRsZXIsIHNoaW0pIHtcbiAgaWYgKCF3aW5kb3cpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG9sZE9uRXJyb3I7XG5cbiAgaWYgKHR5cGVvZiBoYW5kbGVyLl9yb2xsYmFyT2xkT25FcnJvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIG9sZE9uRXJyb3IgPSBoYW5kbGVyLl9yb2xsYmFyT2xkT25FcnJvcjtcbiAgfSBlbHNlIGlmICh3aW5kb3cub25lcnJvcikge1xuICAgIG9sZE9uRXJyb3IgPSB3aW5kb3cub25lcnJvcjtcbiAgICB3aGlsZSAob2xkT25FcnJvci5fcm9sbGJhck9sZE9uRXJyb3IpIHtcbiAgICAgIG9sZE9uRXJyb3IgPSBvbGRPbkVycm9yLl9yb2xsYmFyT2xkT25FcnJvcjtcbiAgICB9XG4gICAgaGFuZGxlci5fcm9sbGJhck9sZE9uRXJyb3IgPSBvbGRPbkVycm9yO1xuICB9XG5cbiAgaGFuZGxlci5oYW5kbGVBbm9ueW1vdXNFcnJvcnMoKTtcblxuICB2YXIgZm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICAgIF9yb2xsYmFyV2luZG93T25FcnJvcih3aW5kb3csIGhhbmRsZXIsIG9sZE9uRXJyb3IsIGFyZ3MpO1xuICB9O1xuICBpZiAoc2hpbSkge1xuICAgIGZuLl9yb2xsYmFyT2xkT25FcnJvciA9IG9sZE9uRXJyb3I7XG4gIH1cbiAgd2luZG93Lm9uZXJyb3IgPSBmbjtcbn1cblxuZnVuY3Rpb24gX3JvbGxiYXJXaW5kb3dPbkVycm9yKHdpbmRvdywgciwgb2xkLCBhcmdzKSB7XG4gIGlmICh3aW5kb3cuX3JvbGxiYXJXcmFwcGVkRXJyb3IpIHtcbiAgICBpZiAoIWFyZ3NbNF0pIHtcbiAgICAgIGFyZ3NbNF0gPSB3aW5kb3cuX3JvbGxiYXJXcmFwcGVkRXJyb3I7XG4gICAgfVxuICAgIGlmICghYXJnc1s1XSkge1xuICAgICAgYXJnc1s1XSA9IHdpbmRvdy5fcm9sbGJhcldyYXBwZWRFcnJvci5fcm9sbGJhckNvbnRleHQ7XG4gICAgfVxuICAgIHdpbmRvdy5fcm9sbGJhcldyYXBwZWRFcnJvciA9IG51bGw7XG4gIH1cblxuICB2YXIgcmV0ID0gci5oYW5kbGVVbmNhdWdodEV4Y2VwdGlvbi5hcHBseShyLCBhcmdzKTtcblxuICBpZiAob2xkKSB7XG4gICAgb2xkLmFwcGx5KHdpbmRvdywgYXJncyk7XG4gIH1cblxuICAvLyBMZXQgb3RoZXIgY2hhaW5lZCBvbmVycm9yIGhhbmRsZXJzIGFib3ZlIHJ1biBiZWZvcmUgc2V0dGluZyB0aGlzLlxuICAvLyBJZiBhbiBlcnJvciBpcyB0aHJvd24gYW5kIGNhdWdodCB3aXRoaW4gYSBjaGFpbmVkIG9uZXJyb3IgaGFuZGxlcixcbiAgLy8gRXJyb3IucHJlcGFyZVN0YWNrVHJhY2UoKSB3aWxsIHNlZSB0aGF0IG9uZSBiZWZvcmUgdGhlIG9uZSB3ZSB3YW50LlxuICBpZiAocmV0ID09PSAnYW5vbnltb3VzJykge1xuICAgIHIuYW5vbnltb3VzRXJyb3JzUGVuZGluZyArPSAxOyAvLyBTZWUgUm9sbGJhci5wcm90b3R5cGUuaGFuZGxlQW5vbnltb3VzRXJyb3JzKClcbiAgfVxufVxuXG5mdW5jdGlvbiBjYXB0dXJlVW5oYW5kbGVkUmVqZWN0aW9ucyh3aW5kb3csIGhhbmRsZXIsIHNoaW0pIHtcbiAgaWYgKCF3aW5kb3cpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoXG4gICAgdHlwZW9mIHdpbmRvdy5fcm9sbGJhclVSSCA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgIHdpbmRvdy5fcm9sbGJhclVSSC5iZWxvbmdzVG9TaGltXG4gICkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd1bmhhbmRsZWRyZWplY3Rpb24nLCB3aW5kb3cuX3JvbGxiYXJVUkgpO1xuICB9XG5cbiAgdmFyIHJlamVjdGlvbkhhbmRsZXIgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgdmFyIHJlYXNvbiwgcHJvbWlzZSwgZGV0YWlsO1xuICAgIHRyeSB7XG4gICAgICByZWFzb24gPSBldnQucmVhc29uO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlYXNvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHByb21pc2UgPSBldnQucHJvbWlzZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBwcm9taXNlID0gJ1t1bmhhbmRsZWRyZWplY3Rpb25dIGVycm9yIGdldHRpbmcgYHByb21pc2VgIGZyb20gZXZlbnQnO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgZGV0YWlsID0gZXZ0LmRldGFpbDtcbiAgICAgIGlmICghcmVhc29uICYmIGRldGFpbCkge1xuICAgICAgICByZWFzb24gPSBkZXRhaWwucmVhc29uO1xuICAgICAgICBwcm9taXNlID0gZGV0YWlsLnByb21pc2U7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gSWdub3JlXG4gICAgfVxuICAgIGlmICghcmVhc29uKSB7XG4gICAgICByZWFzb24gPSAnW3VuaGFuZGxlZHJlamVjdGlvbl0gZXJyb3IgZ2V0dGluZyBgcmVhc29uYCBmcm9tIGV2ZW50JztcbiAgICB9XG5cbiAgICBpZiAoaGFuZGxlciAmJiBoYW5kbGVyLmhhbmRsZVVuaGFuZGxlZFJlamVjdGlvbikge1xuICAgICAgaGFuZGxlci5oYW5kbGVVbmhhbmRsZWRSZWplY3Rpb24ocmVhc29uLCBwcm9taXNlKTtcbiAgICB9XG4gIH07XG4gIHJlamVjdGlvbkhhbmRsZXIuYmVsb25nc1RvU2hpbSA9IHNoaW07XG4gIHdpbmRvdy5fcm9sbGJhclVSSCA9IHJlamVjdGlvbkhhbmRsZXI7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd1bmhhbmRsZWRyZWplY3Rpb24nLCByZWplY3Rpb25IYW5kbGVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNhcHR1cmVVbmNhdWdodEV4Y2VwdGlvbnM6IGNhcHR1cmVVbmNhdWdodEV4Y2VwdGlvbnMsXG4gIGNhcHR1cmVVbmhhbmRsZWRSZWplY3Rpb25zOiBjYXB0dXJlVW5oYW5kbGVkUmVqZWN0aW9ucyxcbn07XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5yZXF1aXJlKCdjb25zb2xlLXBvbHlmaWxsJyk7XG52YXIgZGV0ZWN0aW9uID0gcmVxdWlyZSgnLi9kZXRlY3Rpb24nKTtcbnZhciBfID0gcmVxdWlyZSgnLi4vdXRpbGl0eScpO1xuXG5mdW5jdGlvbiBlcnJvcigpIHtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICBhcmdzLnVuc2hpZnQoJ1JvbGxiYXI6Jyk7XG4gIGlmIChkZXRlY3Rpb24uaWVWZXJzaW9uKCkgPD0gOCkge1xuICAgIGNvbnNvbGUuZXJyb3IoXy5mb3JtYXRBcmdzQXNTdHJpbmcoYXJncykpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUuZXJyb3IuYXBwbHkoY29uc29sZSwgYXJncyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5mbygpIHtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICBhcmdzLnVuc2hpZnQoJ1JvbGxiYXI6Jyk7XG4gIGlmIChkZXRlY3Rpb24uaWVWZXJzaW9uKCkgPD0gOCkge1xuICAgIGNvbnNvbGUuaW5mbyhfLmZvcm1hdEFyZ3NBc1N0cmluZyhhcmdzKSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5pbmZvLmFwcGx5KGNvbnNvbGUsIGFyZ3MpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGxvZygpIHtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICBhcmdzLnVuc2hpZnQoJ1JvbGxiYXI6Jyk7XG4gIGlmIChkZXRlY3Rpb24uaWVWZXJzaW9uKCkgPD0gOCkge1xuICAgIGNvbnNvbGUubG9nKF8uZm9ybWF0QXJnc0FzU3RyaW5nKGFyZ3MpKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmdzKTtcbiAgfVxufVxuXG4vKiBlc2xpbnQtZW5hYmxlIG5vLWNvbnNvbGUgKi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGVycm9yOiBlcnJvcixcbiAgaW5mbzogaW5mbyxcbiAgbG9nOiBsb2csXG59O1xuIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsaXR5Jyk7XG5cbmZ1bmN0aW9uIGNoZWNrSWdub3JlKGl0ZW0sIHNldHRpbmdzKSB7XG4gIGlmIChfLmdldChzZXR0aW5ncywgJ3BsdWdpbnMuanF1ZXJ5Lmlnbm9yZUFqYXhFcnJvcnMnKSkge1xuICAgIHJldHVybiAhXy5nZXQoaXRlbSwgJ2JvZHkubWVzc2FnZS5leHRyYS5pc0FqYXgnKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNoZWNrSWdub3JlOiBjaGVja0lnbm9yZSxcbn07XG4iLCIvKipcbiAqIERlZmF1bHQgb3B0aW9ucyBmb3IgdGhlIHJyd2ViIHJlY29yZGVyXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3Jyd2ViLWlvL3Jyd2ViL2Jsb2IvbWFzdGVyL2d1aWRlLm1kI29wdGlvbnMgZm9yIGRldGFpbHNcbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICBlbmFibGVkOiBmYWxzZSwgLy8gV2hldGhlciByZWNvcmRpbmcgaXMgZW5hYmxlZFxuICBhdXRvU3RhcnQ6IHRydWUsIC8vIFN0YXJ0IHJlY29yZGluZyBhdXRvbWF0aWNhbGx5IHdoZW4gUm9sbGJhciBpbml0aWFsaXplc1xuICBkZWJ1Zzoge1xuICAgIGxvZ0VtaXRzOiBmYWxzZSwgLy8gV2hldGhlciB0byBsb2cgZW1pdHRlZCBldmVudHNcbiAgfSxcblxuICAvLyBSZWNvcmRpbmcgb3B0aW9uc1xuICBpbmxpbmVTdHlsZXNoZWV0OiB0cnVlLCAvLyBXaGV0aGVyIHRvIGlubGluZSBzdHlsZXNoZWV0cyB0byBpbXByb3ZlIHJlcGxheSBhY2N1cmFjeVxuICBpbmxpbmVJbWFnZXM6IGZhbHNlLCAvLyBXaGV0aGVyIHRvIHJlY29yZCB0aGUgaW1hZ2UgY29udGVudFxuICBjb2xsZWN0Rm9udHM6IHRydWUsIC8vIFdoZXRoZXIgdG8gY29sbGVjdCBmb250cyBpbiB0aGUgd2Vic2l0ZVxuXG4gIC8vIFByaXZhY3kgb3B0aW9uc1xuICAvLyBGaW5lLWdyYWluZWQgY29udHJvbCBvdmVyIHdoaWNoIGlucHV0IHR5cGVzIHRvIG1hc2tcbiAgLy8gQnkgZGVmYXVsdCBvbmx5IHBhc3N3b3JkIGlucHV0cyBhcmUgbWFza2VkIGlmIG1hc2tJbnB1dHMgaXMgdHJ1ZVxuICBtYXNrSW5wdXRPcHRpb25zOiB7XG4gICAgcGFzc3dvcmQ6IHRydWUsXG4gICAgZW1haWw6IGZhbHNlLFxuICAgIHRlbDogZmFsc2UsXG4gICAgdGV4dDogZmFsc2UsXG4gICAgY29sb3I6IGZhbHNlLFxuICAgIGRhdGU6IGZhbHNlLFxuICAgICdkYXRldGltZS1sb2NhbCc6IGZhbHNlLFxuICAgIG1vbnRoOiBmYWxzZSxcbiAgICBudW1iZXI6IGZhbHNlLFxuICAgIHJhbmdlOiBmYWxzZSxcbiAgICBzZWFyY2g6IGZhbHNlLFxuICAgIHRpbWU6IGZhbHNlLFxuICAgIHVybDogZmFsc2UsXG4gICAgd2VlazogZmFsc2UsXG4gIH0sXG5cbiAgLy8gUmVtb3ZlIHVubmVjZXNzYXJ5IHBhcnRzIG9mIHRoZSBET01cbiAgLy8gQnkgZGVmYXVsdCBhbGwgcmVtb3ZhYmxlIGVsZW1lbnRzIGFyZSByZW1vdmVkXG4gIHNsaW1ET01PcHRpb25zOiB7XG4gICAgc2NyaXB0OiB0cnVlLCAvLyBSZW1vdmUgc2NyaXB0IGVsZW1lbnRzXG4gICAgY29tbWVudDogdHJ1ZSwgLy8gUmVtb3ZlIGNvbW1lbnRzXG4gICAgaGVhZEZhdmljb246IHRydWUsIC8vIFJlbW92ZSBmYXZpY29ucyBpbiB0aGUgaGVhZFxuICAgIGhlYWRXaGl0ZXNwYWNlOiB0cnVlLCAvLyBSZW1vdmUgd2hpdGVzcGFjZSBpbiBoZWFkXG4gICAgaGVhZE1ldGFEZXNjS2V5d29yZHM6IHRydWUsIC8vIFJlbW92ZSBtZXRhIGRlc2NyaXB0aW9uIGFuZCBrZXl3b3Jkc1xuICAgIGhlYWRNZXRhU29jaWFsOiB0cnVlLCAvLyBSZW1vdmUgc29jaWFsIG1lZGlhIG1ldGEgdGFnc1xuICAgIGhlYWRNZXRhUm9ib3RzOiB0cnVlLCAvLyBSZW1vdmUgcm9ib3RzIG1ldGEgZGlyZWN0aXZlc1xuICAgIGhlYWRNZXRhSHR0cEVxdWl2OiB0cnVlLCAvLyBSZW1vdmUgaHR0cC1lcXVpdiBtZXRhIGRpcmVjdGl2ZXNcbiAgICBoZWFkTWV0YUF1dGhvcnNoaXA6IHRydWUsIC8vIFJlbW92ZSBhdXRob3JzaGlwIG1ldGEgZGlyZWN0aXZlc1xuICAgIGhlYWRNZXRhVmVyaWZpY2F0aW9uOiB0cnVlLCAvLyBSZW1vdmUgdmVyaWZpY2F0aW9uIG1ldGEgZGlyZWN0aXZlc1xuICB9LFxuXG4gIC8vIEN1c3RvbSBjYWxsYmFja3MgZm9yIGFkdmFuY2VkIHVzZSBjYXNlc1xuICAvLyBUaGVzZSBhcmUgdW5kZWZpbmVkIGJ5IGRlZmF1bHQgYW5kIGNhbiBiZSBzZXQgcHJvZ3JhbW1hdGljYWxseVxuICAvLyBtYXNrSW5wdXRGbjogdW5kZWZpbmVkLCAgICAgIC8vIEN1c3RvbSBmdW5jdGlvbiB0byBtYXNrIGlucHV0IHZhbHVlc1xuICAvLyBtYXNrVGV4dEZuOiB1bmRlZmluZWQsICAgICAgIC8vIEN1c3RvbSBmdW5jdGlvbiB0byBtYXNrIHRleHQgY29udGVudFxuICAvLyBlcnJvckhhbmRsZXI6IHVuZGVmaW5lZCwgICAgIC8vIEN1c3RvbSBlcnJvciBoYW5kbGVyIGZvciByZWNvcmRpbmcgZXJyb3JzXG5cbiAgLy8gUGx1Z2luIHN5c3RlbVxuICAvLyBwbHVnaW5zOiBbXSAgICAgICAgICAgICAgICAgIC8vIExpc3Qgb2YgcGx1Z2lucyB0byB1c2UgKG11c3QgYmUgc2V0IHByb2dyYW1tYXRpY2FsbHkpXG59O1xuIiwiaW1wb3J0IGlkIGZyb20gJy4uLy4uL3RyYWNpbmcvaWQuanMnO1xuXG4vKipcbiAqIFJlcGxheU1hcCAtIE1hbmFnZXMgdGhlIG1hcHBpbmcgYmV0d2VlbiBlcnJvciBvY2N1cnJlbmNlcyBhbmQgdGhlaXIgYXNzb2NpYXRlZFxuICogc2Vzc2lvbiByZWNvcmRpbmdzLiBUaGlzIGNsYXNzIGhhbmRsZXMgdGhlIGNvb3JkaW5hdGlvbiBiZXR3ZWVuIHdoZW4gcmVjb3JkaW5nc1xuICogYXJlIGR1bXBlZCBhbmQgd2hlbiB0aGV5IGFyZSBldmVudHVhbGx5IHNlbnQgdG8gdGhlIGJhY2tlbmQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlcGxheU1hcCB7XG4gICNtYXA7XG4gICNyZWNvcmRlcjtcbiAgI2FwaTtcbiAgI3RyYWNpbmc7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgUmVwbGF5TWFwIGluc3RhbmNlXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyAtIENvbmZpZ3VyYXRpb24gcHJvcHNcbiAgICogQHBhcmFtIHtPYmplY3R9IHByb3BzLnJlY29yZGVyIC0gVGhlIHJlY29yZGVyIGluc3RhbmNlIHRoYXQgZHVtcHMgcmVwbGF5IGRhdGEgaW50byBzcGFuc1xuICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcHMuYXBpIC0gVGhlIEFQSSBpbnN0YW5jZSB1c2VkIHRvIHNlbmQgcmVwbGF5IHBheWxvYWRzIHRvIHRoZSBiYWNrZW5kXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcy50cmFjaW5nIC0gVGhlIHRyYWNpbmcgaW5zdGFuY2UgdXNlZCB0byBjcmVhdGUgc3BhbnMgYW5kIG1hbmFnZSBjb250ZXh0XG4gICAqL1xuICBjb25zdHJ1Y3Rvcih7IHJlY29yZGVyLCBhcGksIHRyYWNpbmcgfSkge1xuICAgIGlmICghcmVjb3JkZXIpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJFeHBlY3RlZCAncmVjb3JkZXInIHRvIGJlIHByb3ZpZGVkXCIpO1xuICAgIH1cblxuICAgIGlmICghYXBpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRXhwZWN0ZWQgJ2FwaScgdG8gYmUgcHJvdmlkZWRcIik7XG4gICAgfVxuXG4gICAgaWYgKCF0cmFjaW5nKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRXhwZWN0ZWQgJ3RyYWNpbmcnIHRvIGJlIHByb3ZpZGVkXCIpO1xuICAgIH1cblxuICAgIHRoaXMuI21hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLiNyZWNvcmRlciA9IHJlY29yZGVyO1xuICAgIHRoaXMuI2FwaSA9IGFwaTtcbiAgICB0aGlzLiN0cmFjaW5nID0gdHJhY2luZztcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9jZXNzZXMgYSByZXBsYXkgYnkgY29udmVydGluZyByZWNvcmRlciBldmVudHMgaW50byBhIHRyYW5zcG9ydC1yZWFkeSBwYXlsb2FkLlxuICAgKlxuICAgKiBDYWxscyByZWNvcmRlci5kdW1wKCkgdG8gY2FwdHVyZSBldmVudHMgYXMgc3BhbnMsIGZvcm1hdHMgdGhlbSBpbnRvIGEgcHJvcGVyIHBheWxvYWQsXG4gICAqIGFuZCBzdG9yZXMgdGhlIHJlc3VsdCBpbiB0aGUgbWFwIHVzaW5nIHJlcGxheUlkIGFzIHRoZSBrZXkuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZXBsYXlJZCAtIFRoZSB1bmlxdWUgSUQgZm9yIHRoaXMgcmVwbGF5XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHN0cmluZz59IEEgcHJvbWlzZSByZXNvbHZpbmcgdG8gdGhlIHByb2Nlc3NlZCByZXBsYXlJZFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYXN5bmMgX3Byb2Nlc3NSZXBsYXkocmVwbGF5SWQsIG9jY3VycmVuY2VVdWlkKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLiNyZWNvcmRlci5kdW1wKHRoaXMuI3RyYWNpbmcsIHJlcGxheUlkLCBvY2N1cnJlbmNlVXVpZCk7XG5cbiAgICAgIHRoaXMuI21hcC5zZXQocmVwbGF5SWQsIHBheWxvYWQpO1xuICAgIH0gY2F0Y2ggKHRyYW5zZm9ybUVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciB0cmFuc2Zvcm1pbmcgc3BhbnM6JywgdHJhbnNmb3JtRXJyb3IpO1xuXG4gICAgICB0aGlzLiNtYXAuc2V0KHJlcGxheUlkLCBudWxsKTsgLy8gVE9ETyhtYXR1eCk6IEVycm9yIHNwYW4/XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcGxheUlkO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSByZXBsYXkgdG8gdGhlIG1hcCBhbmQgcmV0dXJucyBhIHVuaXF1ZWx5IGdlbmVyYXRlZCByZXBsYXkgSUQuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGltbWVkaWF0ZWx5IHJldHVybnMgdGhlIHJlcGxheUlkIGFuZCBhc3luY2hyb25vdXNseSBwcm9jZXNzZXNcbiAgICogdGhlIHJlcGxheSBkYXRhIGluIHRoZSBiYWNrZ3JvdW5kLiBUaGUgcHJvY2Vzc2luZyBpbnZvbHZlcyBjb252ZXJ0aW5nXG4gICAqIHJlY29yZGVyIGV2ZW50cyBpbnRvIGEgcGF5bG9hZCBmb3JtYXQgYW5kIHN0b3JpbmcgaXQgaW4gdGhlIG1hcC5cbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gQSB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhpcyByZXBsYXlcbiAgICovXG4gIGFkZChvY2N1cnJlbmNlVXVpZCkge1xuICAgIGNvbnN0IHJlcGxheUlkID0gaWQuZ2VuKDgpO1xuXG4gICAgdGhpcy5fcHJvY2Vzc1JlcGxheShyZXBsYXlJZCwgb2NjdXJyZW5jZVV1aWQpLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHByb2Nlc3MgcmVwbGF5OicsIGVycm9yKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXBsYXlJZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyB0aGUgcmVwbGF5IHBheWxvYWQgYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlbiByZXBsYXlJZCB0byB0aGUgYmFja2VuZFxuICAgKiBhbmQgcmVtb3ZlcyBpdCBmcm9tIHRoZSBtYXAuXG4gICAqXG4gICAqIFJldHJpZXZlcyB0aGUgcGF5bG9hZCBmcm9tIHRoZSBtYXAsIGNoZWNrcyBpZiBpdCdzIHZhbGlkLCB0aGVuIHNlbmRzIGl0XG4gICAqIHRvIHRoZSBBUEkgZW5kcG9pbnQgZm9yIHByb2Nlc3NpbmcuIFRoZSBwYXlsb2FkIGNhbiBiZSBlaXRoZXIgYSBzcGFucyBhcnJheVxuICAgKiBvciBhIGZvcm1hdHRlZCBPVExQIHBheWxvYWQgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVwbGF5SWQgLSBUaGUgSUQgb2YgdGhlIHJlcGxheSB0byBzZW5kXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPGJvb2xlYW4+fSBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0cnVlIGlmIHRoZSBwYXlsb2FkIHdhcyBmb3VuZCBhbmQgc2VudCwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICBhc3luYyBzZW5kKHJlcGxheUlkKSB7XG4gICAgaWYgKCFyZXBsYXlJZCkge1xuICAgICAgY29uc29sZS53YXJuKCdSZXBsYXlNYXAuc2VuZDogTm8gcmVwbGF5SWQgcHJvdmlkZWQnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuI21hcC5oYXMocmVwbGF5SWQpKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFJlcGxheU1hcC5zZW5kOiBObyByZXBsYXkgZm91bmQgZm9yIHJlcGxheUlkOiAke3JlcGxheUlkfWApO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLiNtYXAuZ2V0KHJlcGxheUlkKTtcbiAgICB0aGlzLiNtYXAuZGVsZXRlKHJlcGxheUlkKTtcblxuICAgIC8vIENoZWNrIGlmIHBheWxvYWQgaXMgZW1wdHkgKGNvdWxkIGJlIHJhdyBzcGFucyBhcnJheSBvciBPVExQIHBheWxvYWQpXG4gICAgY29uc3QgaXNFbXB0eSA9XG4gICAgICAhcGF5bG9hZCB8fFxuICAgICAgKEFycmF5LmlzQXJyYXkocGF5bG9hZCkgJiYgcGF5bG9hZC5sZW5ndGggPT09IDApIHx8XG4gICAgICAocGF5bG9hZC5yZXNvdXJjZVNwYW5zICYmIHBheWxvYWQucmVzb3VyY2VTcGFucy5sZW5ndGggPT09IDApO1xuXG4gICAgaWYgKGlzRW1wdHkpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgYFJlcGxheU1hcC5zZW5kOiBObyBwYXlsb2FkIGZvdW5kIGZvciByZXBsYXlJZDogJHtyZXBsYXlJZH1gLFxuICAgICAgKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy4jYXBpLnBvc3RTcGFucyhwYXlsb2FkKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBzZW5kaW5nIHJlcGxheTonLCBlcnJvcik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERpc2NhcmRzIHRoZSByZXBsYXkgYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlbiByZXBsYXkgSUQgYnkgcmVtb3ZpbmdcbiAgICogaXQgZnJvbSB0aGUgbWFwIHdpdGhvdXQgc2VuZGluZyBpdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlcGxheUlkIC0gVGhlIElEIG9mIHRoZSByZXBsYXkgdG8gZGlzY2FyZFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBhIHJlcGxheSB3YXMgZm91bmQgYW5kIGRpc2NhcmRlZCwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICBkaXNjYXJkKHJlcGxheUlkKSB7XG4gICAgaWYgKCFyZXBsYXlJZCkge1xuICAgICAgY29uc29sZS53YXJuKCdSZXBsYXlNYXAuZGlzY2FyZDogTm8gcmVwbGF5SWQgcHJvdmlkZWQnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuI21hcC5oYXMocmVwbGF5SWQpKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIGBSZXBsYXlNYXAuZGlzY2FyZDogTm8gcmVwbGF5IGZvdW5kIGZvciByZXBsYXlJZDogJHtyZXBsYXlJZH1gLFxuICAgICAgKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLiNtYXAuZGVsZXRlKHJlcGxheUlkKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHNwYW5zIGZvciB0aGUgZ2l2ZW4gcmVwbGF5IElEXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZXBsYXlJZCAtIFRoZSBJRCB0byByZXRyaWV2ZSBzcGFucyBmb3JcbiAgICogQHJldHVybnMge0FycmF5fG51bGx9IFRoZSBzcGFucyBhcnJheSBvciBudWxsIGlmIG5vdCBmb3VuZFxuICAgKi9cbiAgZ2V0U3BhbnMocmVwbGF5SWQpIHtcbiAgICByZXR1cm4gdGhpcy4jbWFwLmdldChyZXBsYXlJZCkgPz8gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHNwYW5zIGZvciBhIGdpdmVuIHJlcGxheSBJRFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVwbGF5SWQgLSBUaGUgSUQgdG8gc2V0IHNwYW5zIGZvclxuICAgKiBAcGFyYW0ge0FycmF5fSBzcGFucyAtIFRoZSBzcGFucyB0byBzZXRcbiAgICovXG4gIHNldFNwYW5zKHJlcGxheUlkLCBzcGFucykge1xuICAgIHRoaXMuI21hcC5zZXQocmVwbGF5SWQsIHNwYW5zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzaXplIG9mIHRoZSBtYXAgKG51bWJlciBvZiBzdG9yZWQgcmVwbGF5cylcbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn0gVGhlIG51bWJlciBvZiByZXBsYXlzIGN1cnJlbnRseSBzdG9yZWRcbiAgICovXG4gIGdldCBzaXplKCkge1xuICAgIHJldHVybiB0aGlzLiNtYXAuc2l6ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgYWxsIHN0b3JlZCByZXBsYXlzIHdpdGhvdXQgc2VuZGluZyB0aGVtXG4gICAqL1xuICBjbGVhcigpIHtcbiAgICB0aGlzLiNtYXAuY2xlYXIoKTtcbiAgfVxufVxuIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsaXR5Jyk7XG52YXIgZXJyb3JQYXJzZXIgPSByZXF1aXJlKCcuLi9lcnJvclBhcnNlcicpO1xudmFyIGxvZ2dlciA9IHJlcXVpcmUoJy4vbG9nZ2VyJyk7XG5cbmZ1bmN0aW9uIGhhbmRsZURvbUV4Y2VwdGlvbihpdGVtLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICBpZiAoaXRlbS5lcnIgJiYgZXJyb3JQYXJzZXIuU3RhY2soaXRlbS5lcnIpLm5hbWUgPT09ICdET01FeGNlcHRpb24nKSB7XG4gICAgdmFyIG9yaWdpbmFsRXJyb3IgPSBuZXcgRXJyb3IoKTtcbiAgICBvcmlnaW5hbEVycm9yLm5hbWUgPSBpdGVtLmVyci5uYW1lO1xuICAgIG9yaWdpbmFsRXJyb3IubWVzc2FnZSA9IGl0ZW0uZXJyLm1lc3NhZ2U7XG4gICAgb3JpZ2luYWxFcnJvci5zdGFjayA9IGl0ZW0uZXJyLnN0YWNrO1xuICAgIG9yaWdpbmFsRXJyb3IubmVzdGVkID0gaXRlbS5lcnI7XG4gICAgaXRlbS5lcnIgPSBvcmlnaW5hbEVycm9yO1xuICB9XG4gIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVJdGVtV2l0aEVycm9yKGl0ZW0sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIGl0ZW0uZGF0YSA9IGl0ZW0uZGF0YSB8fCB7fTtcbiAgaWYgKGl0ZW0uZXJyKSB7XG4gICAgdHJ5IHtcbiAgICAgIGl0ZW0uc3RhY2tJbmZvID1cbiAgICAgICAgaXRlbS5lcnIuX3NhdmVkU3RhY2tUcmFjZSB8fFxuICAgICAgICBlcnJvclBhcnNlci5wYXJzZShpdGVtLmVyciwgaXRlbS5za2lwRnJhbWVzKTtcblxuICAgICAgaWYgKG9wdGlvbnMuYWRkRXJyb3JDb250ZXh0KSB7XG4gICAgICAgIGFkZEVycm9yQ29udGV4dChpdGVtKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIHdoaWxlIHBhcnNpbmcgdGhlIGVycm9yIG9iamVjdC4nLCBlKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGl0ZW0ubWVzc2FnZSA9XG4gICAgICAgICAgaXRlbS5lcnIubWVzc2FnZSB8fFxuICAgICAgICAgIGl0ZW0uZXJyLmRlc2NyaXB0aW9uIHx8XG4gICAgICAgICAgaXRlbS5tZXNzYWdlIHx8XG4gICAgICAgICAgU3RyaW5nKGl0ZW0uZXJyKTtcbiAgICAgIH0gY2F0Y2ggKGUyKSB7XG4gICAgICAgIGl0ZW0ubWVzc2FnZSA9IFN0cmluZyhpdGVtLmVycikgfHwgU3RyaW5nKGUyKTtcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSBpdGVtLmVycjtcbiAgICB9XG4gIH1cbiAgY2FsbGJhY2sobnVsbCwgaXRlbSk7XG59XG5cbmZ1bmN0aW9uIGFkZEVycm9yQ29udGV4dChpdGVtKSB7XG4gIHZhciBjaGFpbiA9IFtdO1xuICB2YXIgZXJyID0gaXRlbS5lcnI7XG5cbiAgY2hhaW4ucHVzaChlcnIpO1xuXG4gIHdoaWxlIChlcnIubmVzdGVkIHx8IGVyci5jYXVzZSkge1xuICAgIGVyciA9IGVyci5uZXN0ZWQgfHwgZXJyLmNhdXNlO1xuICAgIGNoYWluLnB1c2goZXJyKTtcbiAgfVxuXG4gIF8uYWRkRXJyb3JDb250ZXh0KGl0ZW0sIGNoYWluKTtcbn1cblxuZnVuY3Rpb24gZW5zdXJlSXRlbUhhc1NvbWV0aGluZ1RvU2F5KGl0ZW0sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIGlmICghaXRlbS5tZXNzYWdlICYmICFpdGVtLnN0YWNrSW5mbyAmJiAhaXRlbS5jdXN0b20pIHtcbiAgICBjYWxsYmFjayhuZXcgRXJyb3IoJ05vIG1lc3NhZ2UsIHN0YWNrIGluZm8sIG9yIGN1c3RvbSBkYXRhJyksIG51bGwpO1xuICB9XG4gIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xufVxuXG5mdW5jdGlvbiBhZGRCYXNlSW5mbyhpdGVtLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgZW52aXJvbm1lbnQgPVxuICAgIChvcHRpb25zLnBheWxvYWQgJiYgb3B0aW9ucy5wYXlsb2FkLmVudmlyb25tZW50KSB8fCBvcHRpb25zLmVudmlyb25tZW50O1xuICBpdGVtLmRhdGEgPSBfLm1lcmdlKGl0ZW0uZGF0YSwge1xuICAgIGVudmlyb25tZW50OiBlbnZpcm9ubWVudCxcbiAgICBsZXZlbDogaXRlbS5sZXZlbCxcbiAgICBlbmRwb2ludDogb3B0aW9ucy5lbmRwb2ludCxcbiAgICBwbGF0Zm9ybTogJ2Jyb3dzZXInLFxuICAgIGZyYW1ld29yazogJ2Jyb3dzZXItanMnLFxuICAgIGxhbmd1YWdlOiAnamF2YXNjcmlwdCcsXG4gICAgc2VydmVyOiB7fSxcbiAgICB1dWlkOiBpdGVtLnV1aWQsXG4gICAgbm90aWZpZXI6IHtcbiAgICAgIG5hbWU6ICdyb2xsYmFyLWJyb3dzZXItanMnLFxuICAgICAgdmVyc2lvbjogb3B0aW9ucy52ZXJzaW9uLFxuICAgIH0sXG4gICAgY3VzdG9tOiBpdGVtLmN1c3RvbSxcbiAgfSk7XG4gIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xufVxuXG5mdW5jdGlvbiBhZGRSZXF1ZXN0SW5mbyh3aW5kb3cpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpdGVtLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIHZhciByZXF1ZXN0SW5mbyA9IHt9O1xuXG4gICAgaWYgKHdpbmRvdyAmJiB3aW5kb3cubG9jYXRpb24pIHtcbiAgICAgIHJlcXVlc3RJbmZvLnVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgcmVxdWVzdEluZm8ucXVlcnlfc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcbiAgICB9XG5cbiAgICB2YXIgcmVtb3RlU3RyaW5nID0gJyRyZW1vdGVfaXAnO1xuICAgIGlmICghb3B0aW9ucy5jYXB0dXJlSXApIHtcbiAgICAgIHJlbW90ZVN0cmluZyA9IG51bGw7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLmNhcHR1cmVJcCAhPT0gdHJ1ZSkge1xuICAgICAgcmVtb3RlU3RyaW5nICs9ICdfYW5vbnltaXplJztcbiAgICB9XG4gICAgaWYgKHJlbW90ZVN0cmluZykgcmVxdWVzdEluZm8udXNlcl9pcCA9IHJlbW90ZVN0cmluZztcblxuICAgIGlmIChPYmplY3Qua2V5cyhyZXF1ZXN0SW5mbykubGVuZ3RoID4gMCkge1xuICAgICAgXy5zZXQoaXRlbSwgJ2RhdGEucmVxdWVzdCcsIHJlcXVlc3RJbmZvKTtcbiAgICB9XG5cbiAgICBjYWxsYmFjayhudWxsLCBpdGVtKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYWRkQ2xpZW50SW5mbyh3aW5kb3cpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpdGVtLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIGlmICghd2luZG93KSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgaXRlbSk7XG4gICAgfVxuICAgIHZhciBuYXYgPSB3aW5kb3cubmF2aWdhdG9yIHx8IHt9O1xuICAgIHZhciBzY3IgPSB3aW5kb3cuc2NyZWVuIHx8IHt9O1xuICAgIF8uc2V0KGl0ZW0sICdkYXRhLmNsaWVudCcsIHtcbiAgICAgIHJ1bnRpbWVfbXM6IGl0ZW0udGltZXN0YW1wIC0gd2luZG93Ll9yb2xsYmFyU3RhcnRUaW1lLFxuICAgICAgdGltZXN0YW1wOiBNYXRoLnJvdW5kKGl0ZW0udGltZXN0YW1wIC8gMTAwMCksXG4gICAgICBqYXZhc2NyaXB0OiB7XG4gICAgICAgIGJyb3dzZXI6IG5hdi51c2VyQWdlbnQsXG4gICAgICAgIGxhbmd1YWdlOiBuYXYubGFuZ3VhZ2UsXG4gICAgICAgIGNvb2tpZV9lbmFibGVkOiBuYXYuY29va2llRW5hYmxlZCxcbiAgICAgICAgc2NyZWVuOiB7XG4gICAgICAgICAgd2lkdGg6IHNjci53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IHNjci5oZWlnaHQsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhZGRQbHVnaW5JbmZvKHdpbmRvdykge1xuICByZXR1cm4gZnVuY3Rpb24gKGl0ZW0sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCF3aW5kb3cgfHwgIXdpbmRvdy5uYXZpZ2F0b3IpIHtcbiAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBpdGVtKTtcbiAgICB9XG4gICAgdmFyIHBsdWdpbnMgPSBbXTtcbiAgICB2YXIgbmF2UGx1Z2lucyA9IHdpbmRvdy5uYXZpZ2F0b3IucGx1Z2lucyB8fCBbXTtcbiAgICB2YXIgY3VyO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gbmF2UGx1Z2lucy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgIGN1ciA9IG5hdlBsdWdpbnNbaV07XG4gICAgICBwbHVnaW5zLnB1c2goeyBuYW1lOiBjdXIubmFtZSwgZGVzY3JpcHRpb246IGN1ci5kZXNjcmlwdGlvbiB9KTtcbiAgICB9XG4gICAgXy5zZXQoaXRlbSwgJ2RhdGEuY2xpZW50LmphdmFzY3JpcHQucGx1Z2lucycsIHBsdWdpbnMpO1xuICAgIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhZGRCb2R5KGl0ZW0sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIGlmIChpdGVtLnN0YWNrSW5mbykge1xuICAgIGlmIChpdGVtLnN0YWNrSW5mby50cmFjZUNoYWluKSB7XG4gICAgICBhZGRCb2R5VHJhY2VDaGFpbihpdGVtLCBvcHRpb25zLCBjYWxsYmFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFkZEJvZHlUcmFjZShpdGVtLCBvcHRpb25zLCBjYWxsYmFjayk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGFkZEJvZHlNZXNzYWdlKGl0ZW0sIG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRCb2R5TWVzc2FnZShpdGVtLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgbWVzc2FnZSA9IGl0ZW0ubWVzc2FnZTtcbiAgdmFyIGN1c3RvbSA9IGl0ZW0uY3VzdG9tO1xuXG4gIGlmICghbWVzc2FnZSkge1xuICAgIG1lc3NhZ2UgPSAnSXRlbSBzZW50IHdpdGggbnVsbCBvciBtaXNzaW5nIGFyZ3VtZW50cy4nO1xuICB9XG4gIHZhciByZXN1bHQgPSB7XG4gICAgYm9keTogbWVzc2FnZSxcbiAgfTtcblxuICBpZiAoY3VzdG9tKSB7XG4gICAgcmVzdWx0LmV4dHJhID0gXy5tZXJnZShjdXN0b20pO1xuICB9XG5cbiAgXy5zZXQoaXRlbSwgJ2RhdGEuYm9keScsIHsgbWVzc2FnZTogcmVzdWx0IH0pO1xuICBjYWxsYmFjayhudWxsLCBpdGVtKTtcbn1cblxuZnVuY3Rpb24gc3RhY2tGcm9tSXRlbShpdGVtKSB7XG4gIC8vIFRyYW5zZm9ybSBhIFRyYWNlS2l0IHN0YWNrSW5mbyBvYmplY3QgaW50byBhIFJvbGxiYXIgdHJhY2VcbiAgdmFyIHN0YWNrID0gaXRlbS5zdGFja0luZm8uc3RhY2s7XG4gIGlmIChcbiAgICBzdGFjayAmJlxuICAgIHN0YWNrLmxlbmd0aCA9PT0gMCAmJlxuICAgIGl0ZW0uX3VuaGFuZGxlZFN0YWNrSW5mbyAmJlxuICAgIGl0ZW0uX3VuaGFuZGxlZFN0YWNrSW5mby5zdGFja1xuICApIHtcbiAgICBzdGFjayA9IGl0ZW0uX3VuaGFuZGxlZFN0YWNrSW5mby5zdGFjaztcbiAgfVxuICByZXR1cm4gc3RhY2s7XG59XG5cbmZ1bmN0aW9uIGFkZEJvZHlUcmFjZUNoYWluKGl0ZW0sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciB0cmFjZUNoYWluID0gaXRlbS5zdGFja0luZm8udHJhY2VDaGFpbjtcbiAgdmFyIHRyYWNlcyA9IFtdO1xuXG4gIHZhciB0cmFjZUNoYWluTGVuZ3RoID0gdHJhY2VDaGFpbi5sZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdHJhY2VDaGFpbkxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHRyYWNlID0gYnVpbGRUcmFjZShpdGVtLCB0cmFjZUNoYWluW2ldLCBvcHRpb25zKTtcbiAgICB0cmFjZXMucHVzaCh0cmFjZSk7XG4gIH1cblxuICBfLnNldChpdGVtLCAnZGF0YS5ib2R5JywgeyB0cmFjZV9jaGFpbjogdHJhY2VzIH0pO1xuICBjYWxsYmFjayhudWxsLCBpdGVtKTtcbn1cblxuZnVuY3Rpb24gYWRkQm9keVRyYWNlKGl0ZW0sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBzdGFjayA9IHN0YWNrRnJvbUl0ZW0oaXRlbSk7XG5cbiAgaWYgKHN0YWNrKSB7XG4gICAgdmFyIHRyYWNlID0gYnVpbGRUcmFjZShpdGVtLCBpdGVtLnN0YWNrSW5mbywgb3B0aW9ucyk7XG4gICAgXy5zZXQoaXRlbSwgJ2RhdGEuYm9keScsIHsgdHJhY2U6IHRyYWNlIH0pO1xuICAgIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xuICB9IGVsc2Uge1xuICAgIHZhciBzdGFja0luZm8gPSBpdGVtLnN0YWNrSW5mbztcbiAgICB2YXIgZ3Vlc3MgPSBlcnJvclBhcnNlci5ndWVzc0Vycm9yQ2xhc3Moc3RhY2tJbmZvLm1lc3NhZ2UpO1xuICAgIHZhciBjbGFzc05hbWUgPSBlcnJvckNsYXNzKHN0YWNrSW5mbywgZ3Vlc3NbMF0sIG9wdGlvbnMpO1xuICAgIHZhciBtZXNzYWdlID0gZ3Vlc3NbMV07XG5cbiAgICBpdGVtLm1lc3NhZ2UgPSBjbGFzc05hbWUgKyAnOiAnICsgbWVzc2FnZTtcbiAgICBhZGRCb2R5TWVzc2FnZShpdGVtLCBvcHRpb25zLCBjYWxsYmFjayk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYnVpbGRUcmFjZShpdGVtLCBzdGFja0luZm8sIG9wdGlvbnMpIHtcbiAgdmFyIGRlc2NyaXB0aW9uID0gaXRlbSAmJiBpdGVtLmRhdGEuZGVzY3JpcHRpb247XG4gIHZhciBjdXN0b20gPSBpdGVtICYmIGl0ZW0uY3VzdG9tO1xuICB2YXIgc3RhY2sgPSBzdGFja0Zyb21JdGVtKGl0ZW0pO1xuXG4gIHZhciBndWVzcyA9IGVycm9yUGFyc2VyLmd1ZXNzRXJyb3JDbGFzcyhzdGFja0luZm8ubWVzc2FnZSk7XG4gIHZhciBjbGFzc05hbWUgPSBlcnJvckNsYXNzKHN0YWNrSW5mbywgZ3Vlc3NbMF0sIG9wdGlvbnMpO1xuICB2YXIgbWVzc2FnZSA9IGd1ZXNzWzFdO1xuICB2YXIgdHJhY2UgPSB7XG4gICAgZXhjZXB0aW9uOiB7XG4gICAgICBjbGFzczogY2xhc3NOYW1lLFxuICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICB9LFxuICB9O1xuXG4gIGlmIChkZXNjcmlwdGlvbikge1xuICAgIHRyYWNlLmV4Y2VwdGlvbi5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICB9XG5cbiAgaWYgKHN0YWNrKSB7XG4gICAgaWYgKHN0YWNrLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdHJhY2UuZXhjZXB0aW9uLnN0YWNrID0gc3RhY2tJbmZvLnJhd1N0YWNrO1xuICAgICAgdHJhY2UuZXhjZXB0aW9uLnJhdyA9IFN0cmluZyhzdGFja0luZm8ucmF3RXhjZXB0aW9uKTtcbiAgICB9XG4gICAgdmFyIHN0YWNrRnJhbWU7XG4gICAgdmFyIGZyYW1lO1xuICAgIHZhciBjb2RlO1xuICAgIHZhciBwcmU7XG4gICAgdmFyIHBvc3Q7XG4gICAgdmFyIGNvbnRleHRMZW5ndGg7XG4gICAgdmFyIGksIG1pZDtcblxuICAgIHRyYWNlLmZyYW1lcyA9IFtdO1xuICAgIGZvciAoaSA9IDA7IGkgPCBzdGFjay5sZW5ndGg7ICsraSkge1xuICAgICAgc3RhY2tGcmFtZSA9IHN0YWNrW2ldO1xuICAgICAgZnJhbWUgPSB7XG4gICAgICAgIGZpbGVuYW1lOiBzdGFja0ZyYW1lLnVybCA/IF8uc2FuaXRpemVVcmwoc3RhY2tGcmFtZS51cmwpIDogJyh1bmtub3duKScsXG4gICAgICAgIGxpbmVubzogc3RhY2tGcmFtZS5saW5lIHx8IG51bGwsXG4gICAgICAgIG1ldGhvZDpcbiAgICAgICAgICAhc3RhY2tGcmFtZS5mdW5jIHx8IHN0YWNrRnJhbWUuZnVuYyA9PT0gJz8nXG4gICAgICAgICAgICA/ICdbYW5vbnltb3VzXSdcbiAgICAgICAgICAgIDogc3RhY2tGcmFtZS5mdW5jLFxuICAgICAgICBjb2xubzogc3RhY2tGcmFtZS5jb2x1bW4sXG4gICAgICB9O1xuICAgICAgaWYgKG9wdGlvbnMuc2VuZEZyYW1lVXJsKSB7XG4gICAgICAgIGZyYW1lLnVybCA9IHN0YWNrRnJhbWUudXJsO1xuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICBmcmFtZS5tZXRob2QgJiZcbiAgICAgICAgZnJhbWUubWV0aG9kLmVuZHNXaXRoICYmXG4gICAgICAgIGZyYW1lLm1ldGhvZC5lbmRzV2l0aCgnX3JvbGxiYXJfd3JhcHBlZCcpXG4gICAgICApIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvZGUgPSBwcmUgPSBwb3N0ID0gbnVsbDtcbiAgICAgIGNvbnRleHRMZW5ndGggPSBzdGFja0ZyYW1lLmNvbnRleHQgPyBzdGFja0ZyYW1lLmNvbnRleHQubGVuZ3RoIDogMDtcbiAgICAgIGlmIChjb250ZXh0TGVuZ3RoKSB7XG4gICAgICAgIG1pZCA9IE1hdGguZmxvb3IoY29udGV4dExlbmd0aCAvIDIpO1xuICAgICAgICBwcmUgPSBzdGFja0ZyYW1lLmNvbnRleHQuc2xpY2UoMCwgbWlkKTtcbiAgICAgICAgY29kZSA9IHN0YWNrRnJhbWUuY29udGV4dFttaWRdO1xuICAgICAgICBwb3N0ID0gc3RhY2tGcmFtZS5jb250ZXh0LnNsaWNlKG1pZCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb2RlKSB7XG4gICAgICAgIGZyYW1lLmNvZGUgPSBjb2RlO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJlIHx8IHBvc3QpIHtcbiAgICAgICAgZnJhbWUuY29udGV4dCA9IHt9O1xuICAgICAgICBpZiAocHJlICYmIHByZS5sZW5ndGgpIHtcbiAgICAgICAgICBmcmFtZS5jb250ZXh0LnByZSA9IHByZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG9zdCAmJiBwb3N0Lmxlbmd0aCkge1xuICAgICAgICAgIGZyYW1lLmNvbnRleHQucG9zdCA9IHBvc3Q7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHN0YWNrRnJhbWUuYXJncykge1xuICAgICAgICBmcmFtZS5hcmdzID0gc3RhY2tGcmFtZS5hcmdzO1xuICAgICAgfVxuXG4gICAgICB0cmFjZS5mcmFtZXMucHVzaChmcmFtZSk7XG4gICAgfVxuXG4gICAgLy8gTk9URShjb3J5KTogcmV2ZXJzZSB0aGUgZnJhbWVzIHNpbmNlIHJvbGxiYXIuY29tIGV4cGVjdHMgdGhlIG1vc3QgcmVjZW50IGNhbGwgbGFzdFxuICAgIHRyYWNlLmZyYW1lcy5yZXZlcnNlKCk7XG5cbiAgICBpZiAoY3VzdG9tKSB7XG4gICAgICB0cmFjZS5leHRyYSA9IF8ubWVyZ2UoY3VzdG9tKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJhY2U7XG59XG5cbmZ1bmN0aW9uIGVycm9yQ2xhc3Moc3RhY2tJbmZvLCBndWVzcywgb3B0aW9ucykge1xuICBpZiAoc3RhY2tJbmZvLm5hbWUpIHtcbiAgICByZXR1cm4gc3RhY2tJbmZvLm5hbWU7XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5ndWVzc0Vycm9yQ2xhc3MpIHtcbiAgICByZXR1cm4gZ3Vlc3M7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcodW5rbm93biknO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFkZFNjcnViYmVyKHNjcnViRm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpdGVtLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIGlmIChzY3J1YkZuKSB7XG4gICAgICB2YXIgc2NydWJGaWVsZHMgPSBvcHRpb25zLnNjcnViRmllbGRzIHx8IFtdO1xuICAgICAgdmFyIHNjcnViUGF0aHMgPSBvcHRpb25zLnNjcnViUGF0aHMgfHwgW107XG4gICAgICBpdGVtLmRhdGEgPSBzY3J1YkZuKGl0ZW0uZGF0YSwgc2NydWJGaWVsZHMsIHNjcnViUGF0aHMpO1xuICAgIH1cbiAgICBjYWxsYmFjayhudWxsLCBpdGVtKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGhhbmRsZURvbUV4Y2VwdGlvbjogaGFuZGxlRG9tRXhjZXB0aW9uLFxuICBoYW5kbGVJdGVtV2l0aEVycm9yOiBoYW5kbGVJdGVtV2l0aEVycm9yLFxuICBlbnN1cmVJdGVtSGFzU29tZXRoaW5nVG9TYXk6IGVuc3VyZUl0ZW1IYXNTb21ldGhpbmdUb1NheSxcbiAgYWRkQmFzZUluZm86IGFkZEJhc2VJbmZvLFxuICBhZGRSZXF1ZXN0SW5mbzogYWRkUmVxdWVzdEluZm8sXG4gIGFkZENsaWVudEluZm86IGFkZENsaWVudEluZm8sXG4gIGFkZFBsdWdpbkluZm86IGFkZFBsdWdpbkluZm8sXG4gIGFkZEJvZHk6IGFkZEJvZHksXG4gIGFkZFNjcnViYmVyOiBhZGRTY3J1YmJlcixcbn07XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWxpdHknKTtcbnZhciBtYWtlRmV0Y2hSZXF1ZXN0ID0gcmVxdWlyZSgnLi90cmFuc3BvcnQvZmV0Y2gnKTtcbnZhciBtYWtlWGhyUmVxdWVzdCA9IHJlcXVpcmUoJy4vdHJhbnNwb3J0L3hocicpO1xuXG4vKlxuICogYWNjZXNzVG9rZW4gbWF5IGJlIGVtYmVkZGVkIGluIHBheWxvYWQgYnV0IHRoYXQgc2hvdWxkIG5vdFxuICogICBiZSBhc3N1bWVkXG4gKlxuICogb3B0aW9uczoge1xuICogICBob3N0bmFtZVxuICogICBwcm90b2NvbFxuICogICBwYXRoXG4gKiAgIHBvcnRcbiAqICAgbWV0aG9kXG4gKiAgIHRyYW5zcG9ydCAoJ3hocicgfCAnZmV0Y2gnKVxuICogfVxuICpcbiAqICBwYXJhbXMgaXMgYW4gb2JqZWN0IGNvbnRhaW5pbmcga2V5L3ZhbHVlIHBhaXJzLiBUaGVzZVxuICogICAgd2lsbCBiZSBhcHBlbmRlZCB0byB0aGUgcGF0aCBhcyAna2V5PXZhbHVlJmtleT12YWx1ZSdcbiAqXG4gKiBwYXlsb2FkIGlzIGFuIHVuc2VyaWFsaXplZCBvYmplY3RcbiAqL1xuZnVuY3Rpb24gVHJhbnNwb3J0KHRydW5jYXRpb24pIHtcbiAgdGhpcy50cnVuY2F0aW9uID0gdHJ1bmNhdGlvbjtcbn1cblxuVHJhbnNwb3J0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoXG4gIGFjY2Vzc1Rva2VuLFxuICBvcHRpb25zLFxuICBwYXJhbXMsXG4gIGNhbGxiYWNrLFxuICByZXF1ZXN0RmFjdG9yeSxcbikge1xuICBpZiAoIWNhbGxiYWNrIHx8ICFfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgfVxuICBfLmFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoKGFjY2Vzc1Rva2VuLCBvcHRpb25zLCBwYXJhbXMpO1xuXG4gIHZhciBtZXRob2QgPSAnR0VUJztcbiAgdmFyIHVybCA9IF8uZm9ybWF0VXJsKG9wdGlvbnMpO1xuICB0aGlzLl9tYWtlWm9uZVJlcXVlc3QoXG4gICAgYWNjZXNzVG9rZW4sXG4gICAgdXJsLFxuICAgIG1ldGhvZCxcbiAgICBudWxsLFxuICAgIGNhbGxiYWNrLFxuICAgIHJlcXVlc3RGYWN0b3J5LFxuICAgIG9wdGlvbnMudGltZW91dCxcbiAgICBvcHRpb25zLnRyYW5zcG9ydCxcbiAgKTtcbn07XG5cblRyYW5zcG9ydC5wcm90b3R5cGUucG9zdCA9IGZ1bmN0aW9uIChcbiAgYWNjZXNzVG9rZW4sXG4gIG9wdGlvbnMsXG4gIHBheWxvYWQsXG4gIGNhbGxiYWNrLFxuICByZXF1ZXN0RmFjdG9yeSxcbikge1xuICBpZiAoIWNhbGxiYWNrIHx8ICFfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgfVxuXG4gIGlmICghcGF5bG9hZCkge1xuICAgIHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IoJ0Nhbm5vdCBzZW5kIGVtcHR5IHJlcXVlc3QnKSk7XG4gIH1cblxuICB2YXIgc3RyaW5naWZ5UmVzdWx0O1xuICBpZiAodGhpcy50cnVuY2F0aW9uKSB7XG4gICAgc3RyaW5naWZ5UmVzdWx0ID0gdGhpcy50cnVuY2F0aW9uLnRydW5jYXRlKHBheWxvYWQpO1xuICB9IGVsc2Uge1xuICAgIHN0cmluZ2lmeVJlc3VsdCA9IF8uc3RyaW5naWZ5KHBheWxvYWQpO1xuICB9XG4gIGlmIChzdHJpbmdpZnlSZXN1bHQuZXJyb3IpIHtcbiAgICByZXR1cm4gY2FsbGJhY2soc3RyaW5naWZ5UmVzdWx0LmVycm9yKTtcbiAgfVxuXG4gIHZhciB3cml0ZURhdGEgPSBzdHJpbmdpZnlSZXN1bHQudmFsdWU7XG4gIHZhciBtZXRob2QgPSAnUE9TVCc7XG4gIHZhciB1cmwgPSBfLmZvcm1hdFVybChvcHRpb25zKTtcbiAgdGhpcy5fbWFrZVpvbmVSZXF1ZXN0KFxuICAgIGFjY2Vzc1Rva2VuLFxuICAgIHVybCxcbiAgICBtZXRob2QsXG4gICAgd3JpdGVEYXRhLFxuICAgIGNhbGxiYWNrLFxuICAgIHJlcXVlc3RGYWN0b3J5LFxuICAgIG9wdGlvbnMudGltZW91dCxcbiAgICBvcHRpb25zLnRyYW5zcG9ydCxcbiAgKTtcbn07XG5cblRyYW5zcG9ydC5wcm90b3R5cGUucG9zdEpzb25QYXlsb2FkID0gZnVuY3Rpb24gKFxuICBhY2Nlc3NUb2tlbixcbiAgb3B0aW9ucyxcbiAganNvblBheWxvYWQsXG4gIGNhbGxiYWNrLFxuICByZXF1ZXN0RmFjdG9yeSxcbikge1xuICBpZiAoIWNhbGxiYWNrIHx8ICFfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgfVxuXG4gIHZhciBtZXRob2QgPSAnUE9TVCc7XG4gIHZhciB1cmwgPSBfLmZvcm1hdFVybChvcHRpb25zKTtcbiAgdGhpcy5fbWFrZVpvbmVSZXF1ZXN0KFxuICAgIGFjY2Vzc1Rva2VuLFxuICAgIHVybCxcbiAgICBtZXRob2QsXG4gICAganNvblBheWxvYWQsXG4gICAgY2FsbGJhY2ssXG4gICAgcmVxdWVzdEZhY3RvcnksXG4gICAgb3B0aW9ucy50aW1lb3V0LFxuICAgIG9wdGlvbnMudHJhbnNwb3J0LFxuICApO1xufTtcblxuLy8gV3JhcHMgYF9tYWtlUmVxdWVzdGAgaWYgem9uZS5qcyBpcyBiZWluZyB1c2VkLCBlbnN1cmluZyB0aGF0IFJvbGxiYXJcbi8vIEFQSSBjYWxscyBhcmUgbm90IGludGVyY2VwdGVkIGJ5IGFueSBjaGlsZCBmb3JrZWQgem9uZXMuXG4vLyBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gYE5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcmAgaW4gQW5ndWxhci5cblRyYW5zcG9ydC5wcm90b3R5cGUuX21ha2Vab25lUmVxdWVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGdXaW5kb3cgPVxuICAgICh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdykgfHxcbiAgICAodHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZik7XG4gIC8vIFdoZW5ldmVyIHpvbmUuanMgaXMgbG9hZGVkIGFuZCBgWm9uZWAgaXMgZXhwb3NlZCBnbG9iYWxseSwgYWNjZXNzXG4gIC8vIHRoZSByb290IHpvbmUgdG8gZW5zdXJlIHRoYXQgcmVxdWVzdHMgYXJlIGFsd2F5cyBtYWRlIHdpdGhpbiBpdC5cbiAgLy8gVGhpcyBhcHByb2FjaCBpcyBmcmFtZXdvcmstYWdub3N0aWMsIHJlZ2FyZGxlc3Mgb2Ygd2hpY2hcbiAgLy8gZnJhbWV3b3JrIHpvbmUuanMgaXMgdXNlZCB3aXRoLlxuICB2YXIgcm9vdFpvbmUgPSBnV2luZG93ICYmIGdXaW5kb3cuWm9uZSAmJiBnV2luZG93LlpvbmUucm9vdDtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gIGlmIChyb290Wm9uZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByb290Wm9uZS5ydW4oZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fbWFrZVJlcXVlc3QuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9tYWtlUmVxdWVzdC5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICB9XG59O1xuXG5UcmFuc3BvcnQucHJvdG90eXBlLl9tYWtlUmVxdWVzdCA9IGZ1bmN0aW9uIChcbiAgYWNjZXNzVG9rZW4sXG4gIHVybCxcbiAgbWV0aG9kLFxuICBkYXRhLFxuICBjYWxsYmFjayxcbiAgcmVxdWVzdEZhY3RvcnksXG4gIHRpbWVvdXQsXG4gIHRyYW5zcG9ydCxcbikge1xuICBpZiAodHlwZW9mIFJvbGxiYXJQcm94eSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gX3Byb3h5UmVxdWVzdChkYXRhLCBjYWxsYmFjayk7XG4gIH1cblxuICBpZiAodHJhbnNwb3J0ID09PSAnZmV0Y2gnKSB7XG4gICAgbWFrZUZldGNoUmVxdWVzdChhY2Nlc3NUb2tlbiwgdXJsLCBtZXRob2QsIGRhdGEsIGNhbGxiYWNrLCB0aW1lb3V0KTtcbiAgfSBlbHNlIHtcbiAgICBtYWtlWGhyUmVxdWVzdChcbiAgICAgIGFjY2Vzc1Rva2VuLFxuICAgICAgdXJsLFxuICAgICAgbWV0aG9kLFxuICAgICAgZGF0YSxcbiAgICAgIGNhbGxiYWNrLFxuICAgICAgcmVxdWVzdEZhY3RvcnksXG4gICAgICB0aW1lb3V0LFxuICAgICk7XG4gIH1cbn07XG5cbi8qIGdsb2JhbCBSb2xsYmFyUHJveHkgKi9cbmZ1bmN0aW9uIF9wcm94eVJlcXVlc3QoanNvbiwgY2FsbGJhY2spIHtcbiAgdmFyIHJvbGxiYXJQcm94eSA9IG5ldyBSb2xsYmFyUHJveHkoKTtcbiAgcm9sbGJhclByb3h5LnNlbmRKc29uUGF5bG9hZChcbiAgICBqc29uLFxuICAgIGZ1bmN0aW9uIChfbXNnKSB7XG4gICAgICAvKiBkbyBub3RoaW5nICovXG4gICAgfSwgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICAgIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihlcnIpKTtcbiAgICB9LFxuICApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zcG9ydDtcbiIsInZhciBsb2dnZXIgPSByZXF1aXJlKCcuLi9sb2dnZXInKTtcbnZhciBfID0gcmVxdWlyZSgnLi4vLi4vdXRpbGl0eScpO1xuXG5mdW5jdGlvbiBtYWtlRmV0Y2hSZXF1ZXN0KGFjY2Vzc1Rva2VuLCB1cmwsIG1ldGhvZCwgZGF0YSwgY2FsbGJhY2ssIHRpbWVvdXQpIHtcbiAgdmFyIGNvbnRyb2xsZXI7XG4gIHZhciB0aW1lb3V0SWQ7XG5cbiAgaWYgKF8uaXNGaW5pdGVOdW1iZXIodGltZW91dCkpIHtcbiAgICBjb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgY29udHJvbGxlci5hYm9ydCgpO1xuICAgIH0sIHRpbWVvdXQpO1xuICB9XG5cbiAgZmV0Y2godXJsLCB7XG4gICAgbWV0aG9kOiBtZXRob2QsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICdYLVJvbGxiYXItQWNjZXNzLVRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICBzaWduYWw6IGNvbnRyb2xsZXIgJiYgY29udHJvbGxlci5zaWduYWwsXG4gICAgfSxcbiAgICBib2R5OiBkYXRhLFxuICB9KVxuICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYgKHRpbWVvdXRJZCkgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgIH0pXG4gICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIGNhbGxiYWNrKG51bGwsIGRhdGEpO1xuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgbG9nZ2VyLmVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgY2FsbGJhY2soZXJyb3IpO1xuICAgIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2VGZXRjaFJlcXVlc3Q7XG4iLCIvKmdsb2JhbCBYRG9tYWluUmVxdWVzdCovXG5cbnZhciBfID0gcmVxdWlyZSgnLi4vLi4vdXRpbGl0eScpO1xudmFyIGxvZ2dlciA9IHJlcXVpcmUoJy4uL2xvZ2dlcicpO1xuXG5mdW5jdGlvbiBtYWtlWGhyUmVxdWVzdChcbiAgYWNjZXNzVG9rZW4sXG4gIHVybCxcbiAgbWV0aG9kLFxuICBkYXRhLFxuICBjYWxsYmFjayxcbiAgcmVxdWVzdEZhY3RvcnksXG4gIHRpbWVvdXQsXG4pIHtcbiAgdmFyIHJlcXVlc3Q7XG4gIGlmIChyZXF1ZXN0RmFjdG9yeSkge1xuICAgIHJlcXVlc3QgPSByZXF1ZXN0RmFjdG9yeSgpO1xuICB9IGVsc2Uge1xuICAgIHJlcXVlc3QgPSBfY3JlYXRlWE1MSFRUUE9iamVjdCgpO1xuICB9XG4gIGlmICghcmVxdWVzdCkge1xuICAgIC8vIEdpdmUgdXAsIG5vIHdheSB0byBzZW5kIHJlcXVlc3RzXG4gICAgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcignTm8gd2F5IHRvIHNlbmQgYSByZXF1ZXN0JykpO1xuICB9XG4gIHRyeSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBvbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKG9ucmVhZHlzdGF0ZWNoYW5nZSAmJiByZXF1ZXN0LnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgIG9ucmVhZHlzdGF0ZWNoYW5nZSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgdmFyIHBhcnNlUmVzcG9uc2UgPSBfLmpzb25QYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICBpZiAoX2lzU3VjY2VzcyhyZXF1ZXN0KSkge1xuICAgICAgICAgICAgICBjYWxsYmFjayhwYXJzZVJlc3BvbnNlLmVycm9yLCBwYXJzZVJlc3BvbnNlLnZhbHVlKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfaXNOb3JtYWxGYWlsdXJlKHJlcXVlc3QpKSB7XG4gICAgICAgICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gNDAzKSB7XG4gICAgICAgICAgICAgICAgLy8gbGlrZWx5IGNhdXNlZCBieSB1c2luZyBhIHNlcnZlciBhY2Nlc3MgdG9rZW5cbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9XG4gICAgICAgICAgICAgICAgICBwYXJzZVJlc3BvbnNlLnZhbHVlICYmIHBhcnNlUmVzcG9uc2UudmFsdWUubWVzc2FnZTtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IobWVzc2FnZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gcmV0dXJuIHZhbGlkIGh0dHAgc3RhdHVzIGNvZGVzXG4gICAgICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihTdHJpbmcocmVxdWVzdC5zdGF0dXMpKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBJRSB3aWxsIHJldHVybiBhIHN0YXR1cyAxMjAwMCsgb24gc29tZSBzb3J0IG9mIGNvbm5lY3Rpb24gZmFpbHVyZSxcbiAgICAgICAgICAgICAgLy8gc28gd2UgcmV0dXJuIGEgYmxhbmsgZXJyb3JcbiAgICAgICAgICAgICAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2FhMzgzNzcwJTI4VlMuODUlMjkuYXNweFxuICAgICAgICAgICAgICB2YXIgbXNnID1cbiAgICAgICAgICAgICAgICAnWEhSIHJlc3BvbnNlIGhhZCBubyBzdGF0dXMgY29kZSAobGlrZWx5IGNvbm5lY3Rpb24gZmFpbHVyZSknO1xuICAgICAgICAgICAgICBjYWxsYmFjayhfbmV3UmV0cmlhYmxlRXJyb3IobXNnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgIC8vanF1ZXJ5IHNvdXJjZSBtZW50aW9ucyBmaXJlZm94IG1heSBlcnJvciBvdXQgd2hpbGUgYWNjZXNzaW5nIHRoZVxuICAgICAgICAgIC8vcmVxdWVzdCBtZW1iZXJzIGlmIHRoZXJlIGlzIGEgbmV0d29yayBlcnJvclxuICAgICAgICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9qcXVlcnkvYmxvYi9hOTM4ZDdiMTI4MmZjMGU1YzUyNTAyYzIyNWFlOGYwY2VmMjE5ZjBhL3NyYy9hamF4L3hoci5qcyNMMTExXG4gICAgICAgICAgdmFyIGV4YztcbiAgICAgICAgICBpZiAoZXggJiYgZXguc3RhY2spIHtcbiAgICAgICAgICAgIGV4YyA9IGV4O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleGMgPSBuZXcgRXJyb3IoZXgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYWxsYmFjayhleGMpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICByZXF1ZXN0Lm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xuICAgICAgaWYgKHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcikge1xuICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignWC1Sb2xsYmFyLUFjY2Vzcy1Ub2tlbicsIGFjY2Vzc1Rva2VuKTtcbiAgICAgIH1cblxuICAgICAgaWYgKF8uaXNGaW5pdGVOdW1iZXIodGltZW91dCkpIHtcbiAgICAgICAgcmVxdWVzdC50aW1lb3V0ID0gdGltZW91dDtcbiAgICAgIH1cblxuICAgICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBvbnJlYWR5c3RhdGVjaGFuZ2U7XG4gICAgICByZXF1ZXN0LnNlbmQoZGF0YSk7XG4gICAgfSBjYXRjaCAoZTEpIHtcbiAgICAgIC8vIFNlbmRpbmcgdXNpbmcgdGhlIG5vcm1hbCB4bWxodHRwcmVxdWVzdCBvYmplY3QgZGlkbid0IHdvcmssIHRyeSBYRG9tYWluUmVxdWVzdFxuICAgICAgaWYgKHR5cGVvZiBYRG9tYWluUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gQXNzdW1lIHdlIGFyZSBpbiBhIHJlYWxseSBvbGQgYnJvd3NlciB3aGljaCBoYXMgYSBidW5jaCBvZiBsaW1pdGF0aW9uczpcbiAgICAgICAgLy8gaHR0cDovL2Jsb2dzLm1zZG4uY29tL2IvaWVpbnRlcm5hbHMvYXJjaGl2ZS8yMDEwLzA1LzEzL3hkb21haW5yZXF1ZXN0LXJlc3RyaWN0aW9ucy1saW1pdGF0aW9ucy1hbmQtd29ya2Fyb3VuZHMuYXNweFxuXG4gICAgICAgIC8vIEV4dHJlbWUgcGFyYW5vaWE6IGlmIHdlIGhhdmUgWERvbWFpblJlcXVlc3QgdGhlbiB3ZSBoYXZlIGEgd2luZG93LCBidXQganVzdCBpbiBjYXNlXG4gICAgICAgIGlmICghd2luZG93IHx8ICF3aW5kb3cubG9jYXRpb24pIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2soXG4gICAgICAgICAgICBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICdObyB3aW5kb3cgYXZhaWxhYmxlIGR1cmluZyByZXF1ZXN0LCB1bmtub3duIGVudmlyb25tZW50JyxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZSBjdXJyZW50IHBhZ2UgaXMgaHR0cCwgdHJ5IGFuZCBzZW5kIG92ZXIgaHR0cFxuICAgICAgICBpZiAoXG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYuc3Vic3RyaW5nKDAsIDUpID09PSAnaHR0cDonICYmXG4gICAgICAgICAgdXJsLnN1YnN0cmluZygwLCA1KSA9PT0gJ2h0dHBzJ1xuICAgICAgICApIHtcbiAgICAgICAgICB1cmwgPSAnaHR0cCcgKyB1cmwuc3Vic3RyaW5nKDUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHhkb21haW5yZXF1ZXN0ID0gbmV3IFhEb21haW5SZXF1ZXN0KCk7XG4gICAgICAgIHhkb21haW5yZXF1ZXN0Lm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgeGRvbWFpbnJlcXVlc3Qub250aW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBtc2cgPSAnUmVxdWVzdCB0aW1lZCBvdXQnO1xuICAgICAgICAgIHZhciBjb2RlID0gJ0VUSU1FRE9VVCc7XG4gICAgICAgICAgY2FsbGJhY2soX25ld1JldHJpYWJsZUVycm9yKG1zZywgY29kZSkpO1xuICAgICAgICB9O1xuICAgICAgICB4ZG9tYWlucmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcignRXJyb3IgZHVyaW5nIHJlcXVlc3QnKSk7XG4gICAgICAgIH07XG4gICAgICAgIHhkb21haW5yZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgcGFyc2VSZXNwb25zZSA9IF8uanNvblBhcnNlKHhkb21haW5yZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgY2FsbGJhY2socGFyc2VSZXNwb25zZS5lcnJvciwgcGFyc2VSZXNwb25zZS52YWx1ZSk7XG4gICAgICAgIH07XG4gICAgICAgIHhkb21haW5yZXF1ZXN0Lm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xuICAgICAgICB4ZG9tYWlucmVxdWVzdC5zZW5kKGRhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCdDYW5ub3QgZmluZCBhIG1ldGhvZCB0byB0cmFuc3BvcnQgYSByZXF1ZXN0JykpO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZTIpIHtcbiAgICBjYWxsYmFjayhlMik7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2NyZWF0ZVhNTEhUVFBPYmplY3QoKSB7XG4gIC8qIGdsb2JhbCBBY3RpdmVYT2JqZWN0OmZhbHNlICovXG5cbiAgdmFyIGZhY3RvcmllcyA9IFtcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgfSxcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01zeG1sMi5YTUxIVFRQJyk7XG4gICAgfSxcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01zeG1sMy5YTUxIVFRQJyk7XG4gICAgfSxcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJyk7XG4gICAgfSxcbiAgXTtcbiAgdmFyIHhtbGh0dHA7XG4gIHZhciBpO1xuICB2YXIgbnVtRmFjdG9yaWVzID0gZmFjdG9yaWVzLmxlbmd0aDtcbiAgZm9yIChpID0gMDsgaSA8IG51bUZhY3RvcmllczsgaSsrKSB7XG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tZW1wdHkgKi9cbiAgICB0cnkge1xuICAgICAgeG1saHR0cCA9IGZhY3Rvcmllc1tpXSgpO1xuICAgICAgYnJlYWs7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gcGFzc1xuICAgIH1cbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWVtcHR5ICovXG4gIH1cbiAgcmV0dXJuIHhtbGh0dHA7XG59XG5cbmZ1bmN0aW9uIF9pc1N1Y2Nlc3Mocikge1xuICByZXR1cm4gciAmJiByLnN0YXR1cyAmJiByLnN0YXR1cyA9PT0gMjAwO1xufVxuXG5mdW5jdGlvbiBfaXNOb3JtYWxGYWlsdXJlKHIpIHtcbiAgcmV0dXJuIHIgJiYgXy5pc1R5cGUoci5zdGF0dXMsICdudW1iZXInKSAmJiByLnN0YXR1cyA+PSA0MDAgJiYgci5zdGF0dXMgPCA2MDA7XG59XG5cbmZ1bmN0aW9uIF9uZXdSZXRyaWFibGVFcnJvcihtZXNzYWdlLCBjb2RlKSB7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIGVyci5jb2RlID0gY29kZSB8fCAnRU5PVEZPVU5EJztcbiAgcmV0dXJuIGVycjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYWtlWGhyUmVxdWVzdDtcbiIsIi8vIFNlZSBodHRwczovL25vZGVqcy5vcmcvZG9jcy9sYXRlc3QvYXBpL3VybC5odG1sXG5mdW5jdGlvbiBwYXJzZSh1cmwpIHtcbiAgdmFyIHJlc3VsdCA9IHtcbiAgICBwcm90b2NvbDogbnVsbCxcbiAgICBhdXRoOiBudWxsLFxuICAgIGhvc3Q6IG51bGwsXG4gICAgcGF0aDogbnVsbCxcbiAgICBoYXNoOiBudWxsLFxuICAgIGhyZWY6IHVybCxcbiAgICBob3N0bmFtZTogbnVsbCxcbiAgICBwb3J0OiBudWxsLFxuICAgIHBhdGhuYW1lOiBudWxsLFxuICAgIHNlYXJjaDogbnVsbCxcbiAgICBxdWVyeTogbnVsbCxcbiAgfTtcblxuICB2YXIgaSwgbGFzdDtcbiAgaSA9IHVybC5pbmRleE9mKCcvLycpO1xuICBpZiAoaSAhPT0gLTEpIHtcbiAgICByZXN1bHQucHJvdG9jb2wgPSB1cmwuc3Vic3RyaW5nKDAsIGkpO1xuICAgIGxhc3QgPSBpICsgMjtcbiAgfSBlbHNlIHtcbiAgICBsYXN0ID0gMDtcbiAgfVxuXG4gIGkgPSB1cmwuaW5kZXhPZignQCcsIGxhc3QpO1xuICBpZiAoaSAhPT0gLTEpIHtcbiAgICByZXN1bHQuYXV0aCA9IHVybC5zdWJzdHJpbmcobGFzdCwgaSk7XG4gICAgbGFzdCA9IGkgKyAxO1xuICB9XG5cbiAgaSA9IHVybC5pbmRleE9mKCcvJywgbGFzdCk7XG4gIGlmIChpID09PSAtMSkge1xuICAgIGkgPSB1cmwuaW5kZXhPZignPycsIGxhc3QpO1xuICAgIGlmIChpID09PSAtMSkge1xuICAgICAgaSA9IHVybC5pbmRleE9mKCcjJywgbGFzdCk7XG4gICAgICBpZiAoaSA9PT0gLTEpIHtcbiAgICAgICAgcmVzdWx0Lmhvc3QgPSB1cmwuc3Vic3RyaW5nKGxhc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0Lmhvc3QgPSB1cmwuc3Vic3RyaW5nKGxhc3QsIGkpO1xuICAgICAgICByZXN1bHQuaGFzaCA9IHVybC5zdWJzdHJpbmcoaSk7XG4gICAgICB9XG4gICAgICByZXN1bHQuaG9zdG5hbWUgPSByZXN1bHQuaG9zdC5zcGxpdCgnOicpWzBdO1xuICAgICAgcmVzdWx0LnBvcnQgPSByZXN1bHQuaG9zdC5zcGxpdCgnOicpWzFdO1xuICAgICAgaWYgKHJlc3VsdC5wb3J0KSB7XG4gICAgICAgIHJlc3VsdC5wb3J0ID0gcGFyc2VJbnQocmVzdWx0LnBvcnQsIDEwKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdC5ob3N0ID0gdXJsLnN1YnN0cmluZyhsYXN0LCBpKTtcbiAgICAgIHJlc3VsdC5ob3N0bmFtZSA9IHJlc3VsdC5ob3N0LnNwbGl0KCc6JylbMF07XG4gICAgICByZXN1bHQucG9ydCA9IHJlc3VsdC5ob3N0LnNwbGl0KCc6JylbMV07XG4gICAgICBpZiAocmVzdWx0LnBvcnQpIHtcbiAgICAgICAgcmVzdWx0LnBvcnQgPSBwYXJzZUludChyZXN1bHQucG9ydCwgMTApO1xuICAgICAgfVxuICAgICAgbGFzdCA9IGk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlc3VsdC5ob3N0ID0gdXJsLnN1YnN0cmluZyhsYXN0LCBpKTtcbiAgICByZXN1bHQuaG9zdG5hbWUgPSByZXN1bHQuaG9zdC5zcGxpdCgnOicpWzBdO1xuICAgIHJlc3VsdC5wb3J0ID0gcmVzdWx0Lmhvc3Quc3BsaXQoJzonKVsxXTtcbiAgICBpZiAocmVzdWx0LnBvcnQpIHtcbiAgICAgIHJlc3VsdC5wb3J0ID0gcGFyc2VJbnQocmVzdWx0LnBvcnQsIDEwKTtcbiAgICB9XG4gICAgbGFzdCA9IGk7XG4gIH1cblxuICBpID0gdXJsLmluZGV4T2YoJyMnLCBsYXN0KTtcbiAgaWYgKGkgPT09IC0xKSB7XG4gICAgcmVzdWx0LnBhdGggPSB1cmwuc3Vic3RyaW5nKGxhc3QpO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdC5wYXRoID0gdXJsLnN1YnN0cmluZyhsYXN0LCBpKTtcbiAgICByZXN1bHQuaGFzaCA9IHVybC5zdWJzdHJpbmcoaSk7XG4gIH1cblxuICBpZiAocmVzdWx0LnBhdGgpIHtcbiAgICB2YXIgcGF0aFBhcnRzID0gcmVzdWx0LnBhdGguc3BsaXQoJz8nKTtcbiAgICByZXN1bHQucGF0aG5hbWUgPSBwYXRoUGFydHNbMF07XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcGF0aFBhcnRzWzFdO1xuICAgIHJlc3VsdC5zZWFyY2ggPSByZXN1bHQucXVlcnkgPyAnPycgKyByZXN1bHQucXVlcnkgOiBudWxsO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBwYXJzZTogcGFyc2UsXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHZlcnNpb246ICczLjAuMC1hbHBoYS4wJyxcbiAgZW5kcG9pbnQ6ICdhcGkucm9sbGJhci5jb20vYXBpLzEvaXRlbS8nLFxuICBsb2dMZXZlbDogJ2RlYnVnJyxcbiAgcmVwb3J0TGV2ZWw6ICdkZWJ1ZycsXG4gIHVuY2F1Z2h0RXJyb3JMZXZlbDogJ2Vycm9yJyxcbiAgbWF4SXRlbXM6IDAsXG4gIGl0ZW1zUGVyTWluOiA2MCxcbn07XG4iLCJ2YXIgRXJyb3JTdGFja1BhcnNlciA9IHJlcXVpcmUoJ2Vycm9yLXN0YWNrLXBhcnNlcicpO1xuXG52YXIgVU5LTk9XTl9GVU5DVElPTiA9ICc/JztcbnZhciBFUlJfQ0xBU1NfUkVHRVhQID0gbmV3IFJlZ0V4cChcbiAgJ14oKFthLXpBLVowLTktXyQgXSopOiAqKT8oVW5jYXVnaHQgKT8oW2EtekEtWjAtOS1fJCBdKik6ICcsXG4pO1xuXG5mdW5jdGlvbiBndWVzc0Z1bmN0aW9uTmFtZSgpIHtcbiAgcmV0dXJuIFVOS05PV05fRlVOQ1RJT047XG59XG5cbmZ1bmN0aW9uIGdhdGhlckNvbnRleHQoKSB7XG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBGcmFtZShzdGFja0ZyYW1lKSB7XG4gIHZhciBkYXRhID0ge307XG5cbiAgZGF0YS5fc3RhY2tGcmFtZSA9IHN0YWNrRnJhbWU7XG5cbiAgZGF0YS51cmwgPSBzdGFja0ZyYW1lLmZpbGVOYW1lO1xuICBkYXRhLmxpbmUgPSBzdGFja0ZyYW1lLmxpbmVOdW1iZXI7XG4gIGRhdGEuZnVuYyA9IHN0YWNrRnJhbWUuZnVuY3Rpb25OYW1lO1xuICBkYXRhLmNvbHVtbiA9IHN0YWNrRnJhbWUuY29sdW1uTnVtYmVyO1xuICBkYXRhLmFyZ3MgPSBzdGFja0ZyYW1lLmFyZ3M7XG5cbiAgZGF0YS5jb250ZXh0ID0gZ2F0aGVyQ29udGV4dCgpO1xuXG4gIHJldHVybiBkYXRhO1xufVxuXG5mdW5jdGlvbiBTdGFjayhleGNlcHRpb24sIHNraXApIHtcbiAgZnVuY3Rpb24gZ2V0U3RhY2soKSB7XG4gICAgdmFyIHBhcnNlclN0YWNrID0gW107XG5cbiAgICBza2lwID0gc2tpcCB8fCAwO1xuXG4gICAgdHJ5IHtcbiAgICAgIHBhcnNlclN0YWNrID0gRXJyb3JTdGFja1BhcnNlci5wYXJzZShleGNlcHRpb24pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHBhcnNlclN0YWNrID0gW107XG4gICAgfVxuXG4gICAgdmFyIHN0YWNrID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gc2tpcDsgaSA8IHBhcnNlclN0YWNrLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzdGFjay5wdXNoKG5ldyBGcmFtZShwYXJzZXJTdGFja1tpXSkpO1xuICAgIH1cblxuICAgIHJldHVybiBzdGFjaztcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc3RhY2s6IGdldFN0YWNrKCksXG4gICAgbWVzc2FnZTogZXhjZXB0aW9uLm1lc3NhZ2UsXG4gICAgbmFtZTogX21vc3RTcGVjaWZpY0Vycm9yTmFtZShleGNlcHRpb24pLFxuICAgIHJhd1N0YWNrOiBleGNlcHRpb24uc3RhY2ssXG4gICAgcmF3RXhjZXB0aW9uOiBleGNlcHRpb24sXG4gIH07XG59XG5cbmZ1bmN0aW9uIHBhcnNlKGUsIHNraXApIHtcbiAgdmFyIGVyciA9IGU7XG5cbiAgaWYgKGVyci5uZXN0ZWQgfHwgZXJyLmNhdXNlKSB7XG4gICAgdmFyIHRyYWNlQ2hhaW4gPSBbXTtcbiAgICB3aGlsZSAoZXJyKSB7XG4gICAgICB0cmFjZUNoYWluLnB1c2gobmV3IFN0YWNrKGVyciwgc2tpcCkpO1xuICAgICAgZXJyID0gZXJyLm5lc3RlZCB8fCBlcnIuY2F1c2U7XG5cbiAgICAgIHNraXAgPSAwOyAvLyBPbmx5IGFwcGx5IHNraXAgdmFsdWUgdG8gcHJpbWFyeSBlcnJvclxuICAgIH1cblxuICAgIC8vIFJldHVybiBwcmltYXJ5IGVycm9yIHdpdGggZnVsbCB0cmFjZSBjaGFpbiBhdHRhY2hlZC5cbiAgICB0cmFjZUNoYWluWzBdLnRyYWNlQ2hhaW4gPSB0cmFjZUNoYWluO1xuICAgIHJldHVybiB0cmFjZUNoYWluWzBdO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgU3RhY2soZXJyLCBza2lwKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBndWVzc0Vycm9yQ2xhc3MoZXJyTXNnKSB7XG4gIGlmICghZXJyTXNnIHx8ICFlcnJNc2cubWF0Y2gpIHtcbiAgICByZXR1cm4gWydVbmtub3duIGVycm9yLiBUaGVyZSB3YXMgbm8gZXJyb3IgbWVzc2FnZSB0byBkaXNwbGF5LicsICcnXTtcbiAgfVxuICB2YXIgZXJyQ2xhc3NNYXRjaCA9IGVyck1zZy5tYXRjaChFUlJfQ0xBU1NfUkVHRVhQKTtcbiAgdmFyIGVyckNsYXNzID0gJyh1bmtub3duKSc7XG5cbiAgaWYgKGVyckNsYXNzTWF0Y2gpIHtcbiAgICBlcnJDbGFzcyA9IGVyckNsYXNzTWF0Y2hbZXJyQ2xhc3NNYXRjaC5sZW5ndGggLSAxXTtcbiAgICBlcnJNc2cgPSBlcnJNc2cucmVwbGFjZShcbiAgICAgIChlcnJDbGFzc01hdGNoW2VyckNsYXNzTWF0Y2gubGVuZ3RoIC0gMl0gfHwgJycpICsgZXJyQ2xhc3MgKyAnOicsXG4gICAgICAnJyxcbiAgICApO1xuICAgIGVyck1zZyA9IGVyck1zZy5yZXBsYWNlKC8oXltcXHNdK3xbXFxzXSskKS9nLCAnJyk7XG4gIH1cbiAgcmV0dXJuIFtlcnJDbGFzcywgZXJyTXNnXTtcbn1cblxuLy8gKiBQcmVmZXJzIGFueSB2YWx1ZSBvdmVyIGFuIGVtcHR5IHN0cmluZ1xuLy8gKiBQcmVmZXJzIGFueSB2YWx1ZSBvdmVyICdFcnJvcicgd2hlcmUgcG9zc2libGVcbi8vICogUHJlZmVycyBuYW1lIG92ZXIgY29uc3RydWN0b3IubmFtZSB3aGVuIGJvdGggYXJlIG1vcmUgc3BlY2lmaWMgdGhhbiAnRXJyb3InXG5mdW5jdGlvbiBfbW9zdFNwZWNpZmljRXJyb3JOYW1lKGVycm9yKSB7XG4gIHZhciBuYW1lID0gZXJyb3IubmFtZSAmJiBlcnJvci5uYW1lLmxlbmd0aCAmJiBlcnJvci5uYW1lO1xuICB2YXIgY29uc3RydWN0b3JOYW1lID1cbiAgICBlcnJvci5jb25zdHJ1Y3Rvci5uYW1lICYmXG4gICAgZXJyb3IuY29uc3RydWN0b3IubmFtZS5sZW5ndGggJiZcbiAgICBlcnJvci5jb25zdHJ1Y3Rvci5uYW1lO1xuXG4gIGlmICghbmFtZSB8fCAhY29uc3RydWN0b3JOYW1lKSB7XG4gICAgcmV0dXJuIG5hbWUgfHwgY29uc3RydWN0b3JOYW1lO1xuICB9XG5cbiAgaWYgKG5hbWUgPT09ICdFcnJvcicpIHtcbiAgICByZXR1cm4gY29uc3RydWN0b3JOYW1lO1xuICB9XG4gIHJldHVybiBuYW1lO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ3Vlc3NGdW5jdGlvbk5hbWU6IGd1ZXNzRnVuY3Rpb25OYW1lLFxuICBndWVzc0Vycm9yQ2xhc3M6IGd1ZXNzRXJyb3JDbGFzcyxcbiAgZ2F0aGVyQ29udGV4dDogZ2F0aGVyQ29udGV4dCxcbiAgcGFyc2U6IHBhcnNlLFxuICBTdGFjazogU3RhY2ssXG4gIEZyYW1lOiBGcmFtZSxcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxudmFyIGlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iaikge1xuICBpZiAoIW9iaiB8fCB0b1N0ci5jYWxsKG9iaikgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGhhc093bkNvbnN0cnVjdG9yID0gaGFzT3duLmNhbGwob2JqLCAnY29uc3RydWN0b3InKTtcbiAgdmFyIGhhc0lzUHJvdG90eXBlT2YgPVxuICAgIG9iai5jb25zdHJ1Y3RvciAmJlxuICAgIG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgJiZcbiAgICBoYXNPd24uY2FsbChvYmouY29uc3RydWN0b3IucHJvdG90eXBlLCAnaXNQcm90b3R5cGVPZicpO1xuICAvLyBOb3Qgb3duIGNvbnN0cnVjdG9yIHByb3BlcnR5IG11c3QgYmUgT2JqZWN0XG4gIGlmIChvYmouY29uc3RydWN0b3IgJiYgIWhhc093bkNvbnN0cnVjdG9yICYmICFoYXNJc1Byb3RvdHlwZU9mKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gT3duIHByb3BlcnRpZXMgYXJlIGVudW1lcmF0ZWQgZmlyc3RseSwgc28gdG8gc3BlZWQgdXAsXG4gIC8vIGlmIGxhc3Qgb25lIGlzIG93biwgdGhlbiBhbGwgcHJvcGVydGllcyBhcmUgb3duLlxuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAvKiovXG4gIH1cblxuICByZXR1cm4gdHlwZW9mIGtleSA9PT0gJ3VuZGVmaW5lZCcgfHwgaGFzT3duLmNhbGwob2JqLCBrZXkpO1xufTtcblxuZnVuY3Rpb24gbWVyZ2UoKSB7XG4gIHZhciBpLFxuICAgIHNyYyxcbiAgICBjb3B5LFxuICAgIGNsb25lLFxuICAgIG5hbWUsXG4gICAgcmVzdWx0ID0ge30sXG4gICAgY3VycmVudCA9IG51bGwsXG4gICAgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcblxuICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBjdXJyZW50ID0gYXJndW1lbnRzW2ldO1xuICAgIGlmIChjdXJyZW50ID09IG51bGwpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGZvciAobmFtZSBpbiBjdXJyZW50KSB7XG4gICAgICBzcmMgPSByZXN1bHRbbmFtZV07XG4gICAgICBjb3B5ID0gY3VycmVudFtuYW1lXTtcbiAgICAgIGlmIChyZXN1bHQgIT09IGNvcHkpIHtcbiAgICAgICAgaWYgKGNvcHkgJiYgaXNQbGFpbk9iamVjdChjb3B5KSkge1xuICAgICAgICAgIGNsb25lID0gc3JjICYmIGlzUGxhaW5PYmplY3Qoc3JjKSA/IHNyYyA6IHt9O1xuICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IG1lcmdlKGNsb25lLCBjb3B5KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY29weSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZXN1bHRbbmFtZV0gPSBjb3B5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWVyZ2U7XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbGl0eScpO1xuXG4vKlxuICogTm90aWZpZXIgLSB0aGUgaW50ZXJuYWwgb2JqZWN0IHJlc3BvbnNpYmxlIGZvciBkZWxlZ2F0aW5nIGJldHdlZW4gdGhlIGNsaWVudCBleHBvc2VkIEFQSSwgdGhlXG4gKiBjaGFpbiBvZiB0cmFuc2Zvcm1zIG5lY2Vzc2FyeSB0byB0dXJuIGFuIGl0ZW0gaW50byBzb21ldGhpbmcgdGhhdCBjYW4gYmUgc2VudCB0byBSb2xsYmFyLCBhbmQgdGhlXG4gKiBxdWV1ZSB3aGljaCBoYW5kbGVzIHRoZSBjb21tdW5jYXRpb24gd2l0aCB0aGUgUm9sbGJhciBBUEkgc2VydmVycy5cbiAqXG4gKiBAcGFyYW0gcXVldWUgLSBhbiBvYmplY3QgdGhhdCBjb25mb3JtcyB0byB0aGUgaW50ZXJmYWNlOiBhZGRJdGVtKGl0ZW0sIGNhbGxiYWNrKVxuICogQHBhcmFtIG9wdGlvbnMgLSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBvcHRpb25zIHRvIGJlIHNldCBmb3IgdGhpcyBub3RpZmllciwgdGhpcyBzaG91bGQgaGF2ZVxuICogYW55IGRlZmF1bHRzIGFscmVhZHkgc2V0IGJ5IHRoZSBjYWxsZXJcbiAqL1xuZnVuY3Rpb24gTm90aWZpZXIocXVldWUsIG9wdGlvbnMpIHtcbiAgdGhpcy5xdWV1ZSA9IHF1ZXVlO1xuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICB0aGlzLnRyYW5zZm9ybXMgPSBbXTtcbiAgdGhpcy5kaWFnbm9zdGljID0ge307XG59XG5cbi8qXG4gKiBjb25maWd1cmUgLSB1cGRhdGVzIHRoZSBvcHRpb25zIGZvciB0aGlzIG5vdGlmaWVyIHdpdGggdGhlIHBhc3NlZCBpbiBvYmplY3RcbiAqXG4gKiBAcGFyYW0gb3B0aW9ucyAtIGFuIG9iamVjdCB3aGljaCBnZXRzIG1lcmdlZCB3aXRoIHRoZSBjdXJyZW50IG9wdGlvbnMgc2V0IG9uIHRoaXMgbm90aWZpZXJcbiAqIEByZXR1cm5zIHRoaXNcbiAqL1xuTm90aWZpZXIucHJvdG90eXBlLmNvbmZpZ3VyZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHRoaXMucXVldWUgJiYgdGhpcy5xdWV1ZS5jb25maWd1cmUob3B0aW9ucyk7XG4gIHZhciBvbGRPcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICB0aGlzLm9wdGlvbnMgPSBfLm1lcmdlKG9sZE9wdGlvbnMsIG9wdGlvbnMpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qXG4gKiBhZGRUcmFuc2Zvcm0gLSBhZGRzIGEgdHJhbnNmb3JtIG9udG8gdGhlIGVuZCBvZiB0aGUgcXVldWUgb2YgdHJhbnNmb3JtcyBmb3IgdGhpcyBub3RpZmllclxuICpcbiAqIEBwYXJhbSB0cmFuc2Zvcm0gLSBhIGZ1bmN0aW9uIHdoaWNoIHRha2VzIHRocmVlIGFyZ3VtZW50czpcbiAqICAgICogaXRlbTogQW4gT2JqZWN0IHJlcHJlc2VudGluZyB0aGUgZGF0YSB0byBldmVudHVhbGx5IGJlIHNlbnQgdG8gUm9sbGJhclxuICogICAgKiBvcHRpb25zOiBUaGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgb3B0aW9ucyBmb3IgdGhpcyBub3RpZmllclxuICogICAgKiBjYWxsYmFjazogZnVuY3Rpb24oZXJyOiAoTnVsbHxFcnJvciksIGl0ZW06IChOdWxsfE9iamVjdCkpIHRoZSB0cmFuc2Zvcm0gbXVzdCBjYWxsIHRoaXNcbiAqICAgIGNhbGxiYWNrIHdpdGggYSBudWxsIHZhbHVlIGZvciBlcnJvciBpZiBpdCB3YW50cyB0aGUgcHJvY2Vzc2luZyBjaGFpbiB0byBjb250aW51ZSwgb3RoZXJ3aXNlXG4gKiAgICB3aXRoIGFuIGVycm9yIHRvIHRlcm1pbmF0ZSB0aGUgcHJvY2Vzc2luZy4gVGhlIGl0ZW0gc2hvdWxkIGJlIHRoZSB1cGRhdGVkIGl0ZW0gYWZ0ZXIgdGhpc1xuICogICAgdHJhbnNmb3JtIGlzIGZpbmlzaGVkIG1vZGlmeWluZyBpdC5cbiAqL1xuTm90aWZpZXIucHJvdG90eXBlLmFkZFRyYW5zZm9ybSA9IGZ1bmN0aW9uICh0cmFuc2Zvcm0pIHtcbiAgaWYgKF8uaXNGdW5jdGlvbih0cmFuc2Zvcm0pKSB7XG4gICAgdGhpcy50cmFuc2Zvcm1zLnB1c2godHJhbnNmb3JtKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qXG4gKiBsb2cgLSB0aGUgaW50ZXJuYWwgbG9nIGZ1bmN0aW9uIHdoaWNoIGFwcGxpZXMgdGhlIGNvbmZpZ3VyZWQgdHJhbnNmb3JtcyBhbmQgdGhlbiBwdXNoZXMgb250byB0aGVcbiAqIHF1ZXVlIHRvIGJlIHNlbnQgdG8gdGhlIGJhY2tlbmQuXG4gKlxuICogQHBhcmFtIGl0ZW0gLSBBbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIHN0cnVjdHVyZTpcbiAqICAgIG1lc3NhZ2UgW1N0cmluZ10gLSBBbiBvcHRpb25hbCBzdHJpbmcgdG8gYmUgc2VudCB0byByb2xsYmFyXG4gKiAgICBlcnJvciBbRXJyb3JdIC0gQW4gb3B0aW9uYWwgZXJyb3JcbiAqXG4gKiBAcGFyYW0gY2FsbGJhY2sgLSBBIGZ1bmN0aW9uIG9mIHR5cGUgZnVuY3Rpb24oZXJyLCByZXNwKSB3aGljaCB3aWxsIGJlIGNhbGxlZCB3aXRoIGV4YWN0bHkgb25lXG4gKiBudWxsIGFyZ3VtZW50IGFuZCBvbmUgbm9uLW51bGwgYXJndW1lbnQuIFRoZSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBvbmNlLCBlaXRoZXIgZHVyaW5nIHRoZVxuICogdHJhbnNmb3JtIHN0YWdlIGlmIGFuIGVycm9yIG9jY3VycyBpbnNpZGUgYSB0cmFuc2Zvcm0sIG9yIGluIHJlc3BvbnNlIHRvIHRoZSBjb21tdW5pY2F0aW9uIHdpdGhcbiAqIHRoZSBiYWNrZW5kLiBUaGUgc2Vjb25kIGFyZ3VtZW50IHdpbGwgYmUgdGhlIHJlc3BvbnNlIGZyb20gdGhlIGJhY2tlbmQgaW4gY2FzZSBvZiBzdWNjZXNzLlxuICovXG5Ob3RpZmllci5wcm90b3R5cGUubG9nID0gZnVuY3Rpb24gKGl0ZW0sIGNhbGxiYWNrKSB7XG4gIGlmICghY2FsbGJhY2sgfHwgIV8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuICB9XG5cbiAgaWYgKCF0aGlzLm9wdGlvbnMuZW5hYmxlZCkge1xuICAgIHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IoJ1JvbGxiYXIgaXMgbm90IGVuYWJsZWQnKSk7XG4gIH1cblxuICB0aGlzLnF1ZXVlLmFkZFBlbmRpbmdJdGVtKGl0ZW0pO1xuICB2YXIgb3JpZ2luYWxFcnJvciA9IGl0ZW0uZXJyO1xuICB0aGlzLl9hcHBseVRyYW5zZm9ybXMoXG4gICAgaXRlbSxcbiAgICBmdW5jdGlvbiAoZXJyLCBpKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHRoaXMucXVldWUucmVtb3ZlUGVuZGluZ0l0ZW0oaXRlbSk7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgfVxuICAgICAgdGhpcy5xdWV1ZS5hZGRJdGVtKGksIGNhbGxiYWNrLCBvcmlnaW5hbEVycm9yLCBpdGVtKTtcbiAgICB9LmJpbmQodGhpcyksXG4gICk7XG59O1xuXG4vKiBJbnRlcm5hbCAqL1xuXG4vKlxuICogX2FwcGx5VHJhbnNmb3JtcyAtIEFwcGxpZXMgdGhlIHRyYW5zZm9ybXMgdGhhdCBoYXZlIGJlZW4gYWRkZWQgdG8gdGhpcyBub3RpZmllciBzZXF1ZW50aWFsbHkuIFNlZVxuICogYGFkZFRyYW5zZm9ybWAgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKlxuICogQHBhcmFtIGl0ZW0gLSBBbiBpdGVtIHRvIGJlIHRyYW5zZm9ybWVkXG4gKiBAcGFyYW0gY2FsbGJhY2sgLSBBIGZ1bmN0aW9uIG9mIHR5cGUgZnVuY3Rpb24oZXJyLCBpdGVtKSB3aGljaCB3aWxsIGJlIGNhbGxlZCB3aXRoIGEgbm9uLW51bGxcbiAqIGVycm9yIGFuZCBhIG51bGwgaXRlbSBpbiB0aGUgY2FzZSBvZiBhIHRyYW5zZm9ybSBmYWlsdXJlLCBvciBhIG51bGwgZXJyb3IgYW5kIG5vbi1udWxsIGl0ZW0gYWZ0ZXJcbiAqIGFsbCB0cmFuc2Zvcm1zIGhhdmUgYmVlbiBhcHBsaWVkLlxuICovXG5Ob3RpZmllci5wcm90b3R5cGUuX2FwcGx5VHJhbnNmb3JtcyA9IGZ1bmN0aW9uIChpdGVtLCBjYWxsYmFjaykge1xuICB2YXIgdHJhbnNmb3JtSW5kZXggPSAtMTtcbiAgdmFyIHRyYW5zZm9ybXNMZW5ndGggPSB0aGlzLnRyYW5zZm9ybXMubGVuZ3RoO1xuICB2YXIgdHJhbnNmb3JtcyA9IHRoaXMudHJhbnNmb3JtcztcbiAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cbiAgdmFyIGNiID0gZnVuY3Rpb24gKGVyciwgaSkge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJhbnNmb3JtSW5kZXgrKztcblxuICAgIGlmICh0cmFuc2Zvcm1JbmRleCA9PT0gdHJhbnNmb3Jtc0xlbmd0aCkge1xuICAgICAgY2FsbGJhY2sobnVsbCwgaSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJhbnNmb3Jtc1t0cmFuc2Zvcm1JbmRleF0oaSwgb3B0aW9ucywgY2IpO1xuICB9O1xuXG4gIGNiKG51bGwsIGl0ZW0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBOb3RpZmllcjtcbiIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsaXR5Jyk7XG5cbmZ1bmN0aW9uIGNoZWNrTGV2ZWwoaXRlbSwgc2V0dGluZ3MpIHtcbiAgdmFyIGxldmVsID0gaXRlbS5sZXZlbDtcbiAgdmFyIGxldmVsVmFsID0gXy5MRVZFTFNbbGV2ZWxdIHx8IDA7XG4gIHZhciByZXBvcnRMZXZlbCA9IHNldHRpbmdzLnJlcG9ydExldmVsO1xuICB2YXIgcmVwb3J0TGV2ZWxWYWwgPSBfLkxFVkVMU1tyZXBvcnRMZXZlbF0gfHwgMDtcblxuICBpZiAobGV2ZWxWYWwgPCByZXBvcnRMZXZlbFZhbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gdXNlckNoZWNrSWdub3JlKGxvZ2dlcikge1xuICByZXR1cm4gZnVuY3Rpb24gKGl0ZW0sIHNldHRpbmdzKSB7XG4gICAgdmFyIGlzVW5jYXVnaHQgPSAhIWl0ZW0uX2lzVW5jYXVnaHQ7XG4gICAgZGVsZXRlIGl0ZW0uX2lzVW5jYXVnaHQ7XG4gICAgdmFyIGFyZ3MgPSBpdGVtLl9vcmlnaW5hbEFyZ3M7XG4gICAgZGVsZXRlIGl0ZW0uX29yaWdpbmFsQXJncztcbiAgICB0cnkge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihzZXR0aW5ncy5vblNlbmRDYWxsYmFjaykpIHtcbiAgICAgICAgc2V0dGluZ3Mub25TZW5kQ2FsbGJhY2soaXNVbmNhdWdodCwgYXJncywgaXRlbSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc2V0dGluZ3Mub25TZW5kQ2FsbGJhY2sgPSBudWxsO1xuICAgICAgbG9nZ2VyLmVycm9yKCdFcnJvciB3aGlsZSBjYWxsaW5nIG9uU2VuZENhbGxiYWNrLCByZW1vdmluZycsIGUpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgaWYgKFxuICAgICAgICBfLmlzRnVuY3Rpb24oc2V0dGluZ3MuY2hlY2tJZ25vcmUpICYmXG4gICAgICAgIHNldHRpbmdzLmNoZWNrSWdub3JlKGlzVW5jYXVnaHQsIGFyZ3MsIGl0ZW0pXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHNldHRpbmdzLmNoZWNrSWdub3JlID0gbnVsbDtcbiAgICAgIGxvZ2dlci5lcnJvcignRXJyb3Igd2hpbGUgY2FsbGluZyBjdXN0b20gY2hlY2tJZ25vcmUoKSwgcmVtb3ZpbmcnLCBlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHVybElzTm90QmxvY2tMaXN0ZWQobG9nZ2VyKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaXRlbSwgc2V0dGluZ3MpIHtcbiAgICByZXR1cm4gIXVybElzT25BTGlzdChpdGVtLCBzZXR0aW5ncywgJ2Jsb2NrbGlzdCcsIGxvZ2dlcik7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHVybElzU2FmZUxpc3RlZChsb2dnZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpdGVtLCBzZXR0aW5ncykge1xuICAgIHJldHVybiB1cmxJc09uQUxpc3QoaXRlbSwgc2V0dGluZ3MsICdzYWZlbGlzdCcsIGxvZ2dlcik7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG1hdGNoRnJhbWVzKHRyYWNlLCBsaXN0LCBibG9jaykge1xuICBpZiAoIXRyYWNlKSB7XG4gICAgcmV0dXJuICFibG9jaztcbiAgfVxuXG4gIHZhciBmcmFtZXMgPSB0cmFjZS5mcmFtZXM7XG5cbiAgaWYgKCFmcmFtZXMgfHwgZnJhbWVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiAhYmxvY2s7XG4gIH1cblxuICB2YXIgZnJhbWUsIGZpbGVuYW1lLCB1cmwsIHVybFJlZ2V4O1xuICB2YXIgbGlzdExlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICB2YXIgZnJhbWVMZW5ndGggPSBmcmFtZXMubGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGZyYW1lTGVuZ3RoOyBpKyspIHtcbiAgICBmcmFtZSA9IGZyYW1lc1tpXTtcbiAgICBmaWxlbmFtZSA9IGZyYW1lLmZpbGVuYW1lO1xuXG4gICAgaWYgKCFfLmlzVHlwZShmaWxlbmFtZSwgJ3N0cmluZycpKSB7XG4gICAgICByZXR1cm4gIWJsb2NrO1xuICAgIH1cblxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgbGlzdExlbmd0aDsgaisrKSB7XG4gICAgICB1cmwgPSBsaXN0W2pdO1xuICAgICAgdXJsUmVnZXggPSBuZXcgUmVnRXhwKHVybCk7XG5cbiAgICAgIGlmICh1cmxSZWdleC50ZXN0KGZpbGVuYW1lKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiB1cmxJc09uQUxpc3QoaXRlbSwgc2V0dGluZ3MsIHNhZmVPckJsb2NrLCBsb2dnZXIpIHtcbiAgLy8gc2FmZWxpc3QgaXMgdGhlIGRlZmF1bHRcbiAgdmFyIGJsb2NrID0gZmFsc2U7XG4gIGlmIChzYWZlT3JCbG9jayA9PT0gJ2Jsb2NrbGlzdCcpIHtcbiAgICBibG9jayA9IHRydWU7XG4gIH1cblxuICB2YXIgbGlzdCwgdHJhY2VzO1xuICB0cnkge1xuICAgIGxpc3QgPSBibG9jayA/IHNldHRpbmdzLmhvc3RCbG9ja0xpc3QgOiBzZXR0aW5ncy5ob3N0U2FmZUxpc3Q7XG4gICAgdHJhY2VzID0gXy5nZXQoaXRlbSwgJ2JvZHkudHJhY2VfY2hhaW4nKSB8fCBbXy5nZXQoaXRlbSwgJ2JvZHkudHJhY2UnKV07XG5cbiAgICAvLyBUaGVzZSB0d28gY2hlY2tzIGFyZSBpbXBvcnRhbnQgdG8gY29tZSBmaXJzdCBhcyB0aGV5IGFyZSBkZWZhdWx0c1xuICAgIC8vIGluIGNhc2UgdGhlIGxpc3QgaXMgbWlzc2luZyBvciB0aGUgdHJhY2UgaXMgbWlzc2luZyBvciBub3Qgd2VsbC1mb3JtZWRcbiAgICBpZiAoIWxpc3QgfHwgbGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiAhYmxvY2s7XG4gICAgfVxuICAgIGlmICh0cmFjZXMubGVuZ3RoID09PSAwIHx8ICF0cmFjZXNbMF0pIHtcbiAgICAgIHJldHVybiAhYmxvY2s7XG4gICAgfVxuXG4gICAgdmFyIHRyYWNlc0xlbmd0aCA9IHRyYWNlcy5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0cmFjZXNMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG1hdGNoRnJhbWVzKHRyYWNlc1tpXSwgbGlzdCwgYmxvY2spKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoXG4gICAgZVxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICkge1xuICAgIGlmIChibG9jaykge1xuICAgICAgc2V0dGluZ3MuaG9zdEJsb2NrTGlzdCA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldHRpbmdzLmhvc3RTYWZlTGlzdCA9IG51bGw7XG4gICAgfVxuICAgIHZhciBsaXN0TmFtZSA9IGJsb2NrID8gJ2hvc3RCbG9ja0xpc3QnIDogJ2hvc3RTYWZlTGlzdCc7XG4gICAgbG9nZ2VyLmVycm9yKFxuICAgICAgXCJFcnJvciB3aGlsZSByZWFkaW5nIHlvdXIgY29uZmlndXJhdGlvbidzIFwiICtcbiAgICAgICAgbGlzdE5hbWUgK1xuICAgICAgICAnIG9wdGlvbi4gUmVtb3ZpbmcgY3VzdG9tICcgK1xuICAgICAgICBsaXN0TmFtZSArXG4gICAgICAgICcuJyxcbiAgICAgIGUsXG4gICAgKTtcbiAgICByZXR1cm4gIWJsb2NrO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gbWVzc2FnZUlzSWdub3JlZChsb2dnZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpdGVtLCBzZXR0aW5ncykge1xuICAgIHZhciBpLCBqLCBpZ25vcmVkTWVzc2FnZXMsIGxlbiwgbWVzc2FnZUlzSWdub3JlZCwgcklnbm9yZWRNZXNzYWdlLCBtZXNzYWdlcztcblxuICAgIHRyeSB7XG4gICAgICBtZXNzYWdlSXNJZ25vcmVkID0gZmFsc2U7XG4gICAgICBpZ25vcmVkTWVzc2FnZXMgPSBzZXR0aW5ncy5pZ25vcmVkTWVzc2FnZXM7XG5cbiAgICAgIGlmICghaWdub3JlZE1lc3NhZ2VzIHx8IGlnbm9yZWRNZXNzYWdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIG1lc3NhZ2VzID0gbWVzc2FnZXNGcm9tSXRlbShpdGVtKTtcblxuICAgICAgaWYgKG1lc3NhZ2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgbGVuID0gaWdub3JlZE1lc3NhZ2VzLmxlbmd0aDtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBySWdub3JlZE1lc3NhZ2UgPSBuZXcgUmVnRXhwKGlnbm9yZWRNZXNzYWdlc1tpXSwgJ2dpJyk7XG5cbiAgICAgICAgZm9yIChqID0gMDsgaiA8IG1lc3NhZ2VzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgbWVzc2FnZUlzSWdub3JlZCA9IHJJZ25vcmVkTWVzc2FnZS50ZXN0KG1lc3NhZ2VzW2pdKTtcblxuICAgICAgICAgIGlmIChtZXNzYWdlSXNJZ25vcmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoXG4gICAgICBlXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICkge1xuICAgICAgc2V0dGluZ3MuaWdub3JlZE1lc3NhZ2VzID0gbnVsbDtcbiAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgXCJFcnJvciB3aGlsZSByZWFkaW5nIHlvdXIgY29uZmlndXJhdGlvbidzIGlnbm9yZWRNZXNzYWdlcyBvcHRpb24uIFJlbW92aW5nIGN1c3RvbSBpZ25vcmVkTWVzc2FnZXMuXCIsXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9O1xufVxuXG5mdW5jdGlvbiBtZXNzYWdlc0Zyb21JdGVtKGl0ZW0pIHtcbiAgdmFyIGJvZHkgPSBpdGVtLmJvZHk7XG4gIHZhciBtZXNzYWdlcyA9IFtdO1xuXG4gIC8vIFRoZSBwYXlsb2FkIHNjaGVtYSBvbmx5IGFsbG93cyBvbmUgb2YgdHJhY2VfY2hhaW4sIG1lc3NhZ2UsIG9yIHRyYWNlLlxuICAvLyBIb3dldmVyLCBleGlzdGluZyB0ZXN0IGNhc2VzIGFyZSBiYXNlZCBvbiBoYXZpbmcgYm90aCB0cmFjZSBhbmQgbWVzc2FnZSBwcmVzZW50LlxuICAvLyBTbyBoZXJlIHdlIHByZXNlcnZlIHRoZSBhYmlsaXR5IHRvIGNvbGxlY3Qgc3RyaW5ncyBmcm9tIGFueSBjb21iaW5hdGlvbiBvZiB0aGVzZSBrZXlzLlxuICBpZiAoYm9keS50cmFjZV9jaGFpbikge1xuICAgIHZhciB0cmFjZUNoYWluID0gYm9keS50cmFjZV9jaGFpbjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRyYWNlQ2hhaW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB0cmFjZSA9IHRyYWNlQ2hhaW5baV07XG4gICAgICBtZXNzYWdlcy5wdXNoKF8uZ2V0KHRyYWNlLCAnZXhjZXB0aW9uLm1lc3NhZ2UnKSk7XG4gICAgfVxuICB9XG4gIGlmIChib2R5LnRyYWNlKSB7XG4gICAgbWVzc2FnZXMucHVzaChfLmdldChib2R5LCAndHJhY2UuZXhjZXB0aW9uLm1lc3NhZ2UnKSk7XG4gIH1cbiAgaWYgKGJvZHkubWVzc2FnZSkge1xuICAgIG1lc3NhZ2VzLnB1c2goXy5nZXQoYm9keSwgJ21lc3NhZ2UuYm9keScpKTtcbiAgfVxuICByZXR1cm4gbWVzc2FnZXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjaGVja0xldmVsOiBjaGVja0xldmVsLFxuICB1c2VyQ2hlY2tJZ25vcmU6IHVzZXJDaGVja0lnbm9yZSxcbiAgdXJsSXNOb3RCbG9ja0xpc3RlZDogdXJsSXNOb3RCbG9ja0xpc3RlZCxcbiAgdXJsSXNTYWZlTGlzdGVkOiB1cmxJc1NhZmVMaXN0ZWQsXG4gIG1lc3NhZ2VJc0lnbm9yZWQ6IG1lc3NhZ2VJc0lnbm9yZWQsXG59O1xuIiwidmFyIF8gPSByZXF1aXJlKCcuL3V0aWxpdHknKTtcblxuLypcbiAqIFF1ZXVlIC0gYW4gb2JqZWN0IHdoaWNoIGhhbmRsZXMgd2hpY2ggaGFuZGxlcyBhIHF1ZXVlIG9mIGl0ZW1zIHRvIGJlIHNlbnQgdG8gUm9sbGJhci5cbiAqICAgVGhpcyBvYmplY3QgaGFuZGxlcyByYXRlIGxpbWl0aW5nIHZpYSBhIHBhc3NlZCBpbiByYXRlIGxpbWl0ZXIsIHJldHJpZXMgYmFzZWQgb24gY29ubmVjdGlvblxuICogICBlcnJvcnMsIGFuZCBmaWx0ZXJpbmcgb2YgaXRlbXMgYmFzZWQgb24gYSBzZXQgb2YgY29uZmlndXJhYmxlIHByZWRpY2F0ZXMuIFRoZSBjb21tdW5pY2F0aW9uIHRvXG4gKiAgIHRoZSBiYWNrZW5kIGlzIHBlcmZvcm1lZCB2aWEgYSBnaXZlbiBBUEkgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSByYXRlTGltaXRlciAtIEFuIG9iamVjdCB3aGljaCBjb25mb3JtcyB0byB0aGUgaW50ZXJmYWNlXG4gKiAgICByYXRlTGltaXRlci5zaG91bGRTZW5kKGl0ZW0pIC0+IGJvb2xcbiAqIEBwYXJhbSBhcGkgLSBBbiBvYmplY3Qgd2hpY2ggY29uZm9ybXMgdG8gdGhlIGludGVyZmFjZVxuICogICAgYXBpLnBvc3RJdGVtKHBheWxvYWQsIGZ1bmN0aW9uKGVyciwgcmVzcG9uc2UpKVxuICogQHBhcmFtIGxvZ2dlciAtIEFuIG9iamVjdCB1c2VkIHRvIGxvZyB2ZXJib3NlIG1lc3NhZ2VzIGlmIGRlc2lyZWRcbiAqIEBwYXJhbSBvcHRpb25zIC0gc2VlIFF1ZXVlLnByb3RvdHlwZS5jb25maWd1cmVcbiAqIEBwYXJhbSByZXBsYXlNYXAgLSBPcHRpb25hbCBSZXBsYXlNYXAgZm9yIGNvb3JkaW5hdGluZyBzZXNzaW9uIHJlcGxheSB3aXRoIGVycm9yIG9jY3VycmVuY2VzXG4gKi9cbmZ1bmN0aW9uIFF1ZXVlKHJhdGVMaW1pdGVyLCBhcGksIGxvZ2dlciwgb3B0aW9ucywgcmVwbGF5TWFwKSB7XG4gIHRoaXMucmF0ZUxpbWl0ZXIgPSByYXRlTGltaXRlcjtcbiAgdGhpcy5hcGkgPSBhcGk7XG4gIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICB0aGlzLnJlcGxheU1hcCA9IHJlcGxheU1hcDtcbiAgdGhpcy5wcmVkaWNhdGVzID0gW107XG4gIHRoaXMucGVuZGluZ0l0ZW1zID0gW107XG4gIHRoaXMucGVuZGluZ1JlcXVlc3RzID0gW107XG4gIHRoaXMucmV0cnlRdWV1ZSA9IFtdO1xuICB0aGlzLnJldHJ5SGFuZGxlID0gbnVsbDtcbiAgdGhpcy53YWl0Q2FsbGJhY2sgPSBudWxsO1xuICB0aGlzLndhaXRJbnRlcnZhbElEID0gbnVsbDtcbn1cblxuLypcbiAqIGNvbmZpZ3VyZSAtIHVwZGF0ZXMgdGhlIG9wdGlvbnMgdGhpcyBxdWV1ZSB1c2VzXG4gKlxuICogQHBhcmFtIG9wdGlvbnNcbiAqL1xuUXVldWUucHJvdG90eXBlLmNvbmZpZ3VyZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHRoaXMuYXBpICYmIHRoaXMuYXBpLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgdmFyIG9sZE9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gIHRoaXMub3B0aW9ucyA9IF8ubWVyZ2Uob2xkT3B0aW9ucywgb3B0aW9ucyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLypcbiAqIGFkZFByZWRpY2F0ZSAtIGFkZHMgYSBwcmVkaWNhdGUgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdCBvZiBwcmVkaWNhdGVzIGZvciB0aGlzIHF1ZXVlXG4gKlxuICogQHBhcmFtIHByZWRpY2F0ZSAtIGZ1bmN0aW9uKGl0ZW0sIG9wdGlvbnMpIC0+IChib29sfHtlcnI6IEVycm9yfSlcbiAqICBSZXR1cm5pbmcgdHJ1ZSBtZWFucyB0aGF0IHRoaXMgcHJlZGljYXRlIHBhc3NlcyBhbmQgdGhlIGl0ZW0gaXMgb2theSB0byBnbyBvbiB0aGUgcXVldWVcbiAqICBSZXR1cm5pbmcgZmFsc2UgbWVhbnMgZG8gbm90IGFkZCB0aGUgaXRlbSB0byB0aGUgcXVldWUsIGJ1dCBpdCBpcyBub3QgYW4gZXJyb3JcbiAqICBSZXR1cm5pbmcge2VycjogRXJyb3J9IG1lYW5zIGRvIG5vdCBhZGQgdGhlIGl0ZW0gdG8gdGhlIHF1ZXVlLCBhbmQgdGhlIGdpdmVuIGVycm9yIGV4cGxhaW5zIHdoeVxuICogIFJldHVybmluZyB7ZXJyOiB1bmRlZmluZWR9IGlzIGVxdWl2YWxlbnQgdG8gcmV0dXJuaW5nIHRydWUgYnV0IGRvbid0IGRvIHRoYXRcbiAqL1xuUXVldWUucHJvdG90eXBlLmFkZFByZWRpY2F0ZSA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcbiAgaWYgKF8uaXNGdW5jdGlvbihwcmVkaWNhdGUpKSB7XG4gICAgdGhpcy5wcmVkaWNhdGVzLnB1c2gocHJlZGljYXRlKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cblF1ZXVlLnByb3RvdHlwZS5hZGRQZW5kaW5nSXRlbSA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHRoaXMucGVuZGluZ0l0ZW1zLnB1c2goaXRlbSk7XG59O1xuXG5RdWV1ZS5wcm90b3R5cGUucmVtb3ZlUGVuZGluZ0l0ZW0gPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgaWR4ID0gdGhpcy5wZW5kaW5nSXRlbXMuaW5kZXhPZihpdGVtKTtcbiAgaWYgKGlkeCAhPT0gLTEpIHtcbiAgICB0aGlzLnBlbmRpbmdJdGVtcy5zcGxpY2UoaWR4LCAxKTtcbiAgfVxufTtcblxuLypcbiAqIGFkZEl0ZW0gLSBTZW5kIGFuIGl0ZW0gdG8gdGhlIFJvbGxiYXIgQVBJIGlmIGFsbCBvZiB0aGUgcHJlZGljYXRlcyBhcmUgc2F0aXNmaWVkXG4gKlxuICogQHBhcmFtIGl0ZW0gLSBUaGUgcGF5bG9hZCB0byBzZW5kIHRvIHRoZSBiYWNrZW5kXG4gKiBAcGFyYW0gY2FsbGJhY2sgLSBmdW5jdGlvbihlcnJvciwgcmVwc29uc2UpIHdoaWNoIHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIHJlc3BvbnNlIGZyb20gdGhlIEFQSVxuICogIGluIHRoZSBjYXNlIG9mIGEgc3VjY2Vzcywgb3RoZXJ3aXNlIHJlc3BvbnNlIHdpbGwgYmUgbnVsbCBhbmQgZXJyb3Igd2lsbCBoYXZlIGEgdmFsdWUuIElmIGJvdGhcbiAqICBlcnJvciBhbmQgcmVzcG9uc2UgYXJlIG51bGwgdGhlbiB0aGUgaXRlbSB3YXMgc3RvcHBlZCBieSBhIHByZWRpY2F0ZSB3aGljaCBkaWQgbm90IGNvbnNpZGVyIHRoaXNcbiAqICB0byBiZSBhbiBlcnJvciBjb25kaXRpb24sIGJ1dCBub25ldGhlbGVzcyBkaWQgbm90IHNlbmQgdGhlIGl0ZW0gdG8gdGhlIEFQSS5cbiAqICBAcGFyYW0gb3JpZ2luYWxFcnJvciAtIFRoZSBvcmlnaW5hbCBlcnJvciBiZWZvcmUgYW55IHRyYW5zZm9ybWF0aW9ucyB0aGF0IGlzIHRvIGJlIGxvZ2dlZCBpZiBhbnlcbiAqL1xuUXVldWUucHJvdG90eXBlLmFkZEl0ZW0gPSBmdW5jdGlvbiAoXG4gIGl0ZW0sXG4gIGNhbGxiYWNrLFxuICBvcmlnaW5hbEVycm9yLFxuICBvcmlnaW5hbEl0ZW0sXG4pIHtcbiAgaWYgKCFjYWxsYmFjayB8fCAhXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuO1xuICAgIH07XG4gIH1cbiAgdmFyIHByZWRpY2F0ZVJlc3VsdCA9IHRoaXMuX2FwcGx5UHJlZGljYXRlcyhpdGVtKTtcbiAgaWYgKHByZWRpY2F0ZVJlc3VsdC5zdG9wKSB7XG4gICAgdGhpcy5yZW1vdmVQZW5kaW5nSXRlbShvcmlnaW5hbEl0ZW0pO1xuICAgIGNhbGxiYWNrKHByZWRpY2F0ZVJlc3VsdC5lcnIpO1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLl9tYXliZUxvZyhpdGVtLCBvcmlnaW5hbEVycm9yKTtcbiAgdGhpcy5yZW1vdmVQZW5kaW5nSXRlbShvcmlnaW5hbEl0ZW0pO1xuICBpZiAoIXRoaXMub3B0aW9ucy50cmFuc21pdCkge1xuICAgIGNhbGxiYWNrKG5ldyBFcnJvcignVHJhbnNtaXQgZGlzYWJsZWQnKSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHRoaXMucmVwbGF5TWFwICYmIGl0ZW0uYm9keSkge1xuICAgIGNvbnN0IHJlcGxheUlkID0gdGhpcy5yZXBsYXlNYXAuYWRkKGl0ZW0udXVpZCk7XG4gICAgaXRlbS5yZXBsYXlJZCA9IHJlcGxheUlkO1xuICB9XG5cbiAgdGhpcy5wZW5kaW5nUmVxdWVzdHMucHVzaChpdGVtKTtcbiAgdHJ5IHtcbiAgICB0aGlzLl9tYWtlQXBpUmVxdWVzdChcbiAgICAgIGl0ZW0sXG4gICAgICBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICAgIHRoaXMuX2RlcXVldWVQZW5kaW5nUmVxdWVzdChpdGVtKTtcblxuICAgICAgICBpZiAoIWVyciAmJiByZXNwICYmIGl0ZW0ucmVwbGF5SWQpIHtcbiAgICAgICAgICB0aGlzLl9oYW5kbGVSZXBsYXlSZXNwb25zZShpdGVtLnJlcGxheUlkLCByZXNwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmVzcCk7XG4gICAgICB9LmJpbmQodGhpcyksXG4gICAgKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRoaXMuX2RlcXVldWVQZW5kaW5nUmVxdWVzdChpdGVtKTtcbiAgICBjYWxsYmFjayhlKTtcbiAgfVxufTtcblxuLypcbiAqIHdhaXQgLSBTdG9wIGFueSBmdXJ0aGVyIGVycm9ycyBmcm9tIGJlaW5nIGFkZGVkIHRvIHRoZSBxdWV1ZSwgYW5kIGdldCBjYWxsZWQgYmFjayB3aGVuIGFsbCBpdGVtc1xuICogICBjdXJyZW50bHkgcHJvY2Vzc2luZyBoYXZlIGZpbmlzaGVkIHNlbmRpbmcgdG8gdGhlIGJhY2tlbmQuXG4gKlxuICogQHBhcmFtIGNhbGxiYWNrIC0gZnVuY3Rpb24oKSBjYWxsZWQgd2hlbiBhbGwgcGVuZGluZyBpdGVtcyBoYXZlIGJlZW4gc2VudFxuICovXG5RdWV1ZS5wcm90b3R5cGUud2FpdCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBpZiAoIV8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy53YWl0Q2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgaWYgKHRoaXMuX21heWJlQ2FsbFdhaXQoKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAodGhpcy53YWl0SW50ZXJ2YWxJRCkge1xuICAgIHRoaXMud2FpdEludGVydmFsSUQgPSBjbGVhckludGVydmFsKHRoaXMud2FpdEludGVydmFsSUQpO1xuICB9XG4gIHRoaXMud2FpdEludGVydmFsSUQgPSBzZXRJbnRlcnZhbChcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl9tYXliZUNhbGxXYWl0KCk7XG4gICAgfS5iaW5kKHRoaXMpLFxuICAgIDUwMCxcbiAgKTtcbn07XG5cbi8qIF9hcHBseVByZWRpY2F0ZXMgLSBTZXF1ZW50aWFsbHkgYXBwbGllcyB0aGUgcHJlZGljYXRlcyB0aGF0IGhhdmUgYmVlbiBhZGRlZCB0byB0aGUgcXVldWUgdG8gdGhlXG4gKiAgIGdpdmVuIGl0ZW0gd2l0aCB0aGUgY3VycmVudGx5IGNvbmZpZ3VyZWQgb3B0aW9ucy5cbiAqXG4gKiBAcGFyYW0gaXRlbSAtIEFuIGl0ZW0gaW4gdGhlIHF1ZXVlXG4gKiBAcmV0dXJucyB7c3RvcDogYm9vbCwgZXJyOiAoRXJyb3J8bnVsbCl9IC0gc3RvcCBiZWluZyB0cnVlIG1lYW5zIGRvIG5vdCBhZGQgaXRlbSB0byB0aGUgcXVldWUsXG4gKiAgIHRoZSBlcnJvciB2YWx1ZSBzaG91bGQgYmUgcGFzc2VkIHVwIHRvIGEgY2FsbGJhayBpZiB3ZSBhcmUgc3RvcHBpbmcuXG4gKi9cblF1ZXVlLnByb3RvdHlwZS5fYXBwbHlQcmVkaWNhdGVzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIHAgPSBudWxsO1xuICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy5wcmVkaWNhdGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgcCA9IHRoaXMucHJlZGljYXRlc1tpXShpdGVtLCB0aGlzLm9wdGlvbnMpO1xuICAgIGlmICghcCB8fCBwLmVyciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4geyBzdG9wOiB0cnVlLCBlcnI6IHAuZXJyIH07XG4gICAgfVxuICB9XG4gIHJldHVybiB7IHN0b3A6IGZhbHNlLCBlcnI6IG51bGwgfTtcbn07XG5cbi8qXG4gKiBfbWFrZUFwaVJlcXVlc3QgLSBTZW5kIGFuIGl0ZW0gdG8gUm9sbGJhciwgY2FsbGJhY2sgd2hlbiBkb25lLCBpZiB0aGVyZSBpcyBhbiBlcnJvciBtYWtlIGFuXG4gKiAgIGVmZm9ydCB0byByZXRyeSBpZiB3ZSBhcmUgY29uZmlndXJlZCB0byBkbyBzby5cbiAqXG4gKiBAcGFyYW0gaXRlbSAtIGFuIGl0ZW0gcmVhZHkgdG8gc2VuZCB0byB0aGUgYmFja2VuZFxuICogQHBhcmFtIGNhbGxiYWNrIC0gZnVuY3Rpb24oZXJyLCByZXNwb25zZSlcbiAqL1xuUXVldWUucHJvdG90eXBlLl9tYWtlQXBpUmVxdWVzdCA9IGZ1bmN0aW9uIChpdGVtLCBjYWxsYmFjaykge1xuICB2YXIgcmF0ZUxpbWl0UmVzcG9uc2UgPSB0aGlzLnJhdGVMaW1pdGVyLnNob3VsZFNlbmQoaXRlbSk7XG4gIGlmIChyYXRlTGltaXRSZXNwb25zZS5zaG91bGRTZW5kKSB7XG4gICAgdGhpcy5hcGkucG9zdEl0ZW0oXG4gICAgICBpdGVtLFxuICAgICAgZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgdGhpcy5fbWF5YmVSZXRyeShlcnIsIGl0ZW0sIGNhbGxiYWNrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayhlcnIsIHJlc3ApO1xuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcyksXG4gICAgKTtcbiAgfSBlbHNlIGlmIChyYXRlTGltaXRSZXNwb25zZS5lcnJvcikge1xuICAgIGNhbGxiYWNrKHJhdGVMaW1pdFJlc3BvbnNlLmVycm9yKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmFwaS5wb3N0SXRlbShyYXRlTGltaXRSZXNwb25zZS5wYXlsb2FkLCBjYWxsYmFjayk7XG4gIH1cbn07XG5cbi8vIFRoZXNlIGFyZSBlcnJvcnMgYmFzaWNhbGx5IG1lYW4gdGhlcmUgaXMgbm8gaW50ZXJuZXQgY29ubmVjdGlvblxudmFyIFJFVFJJQUJMRV9FUlJPUlMgPSBbXG4gICdFQ09OTlJFU0VUJyxcbiAgJ0VOT1RGT1VORCcsXG4gICdFU09DS0VUVElNRURPVVQnLFxuICAnRVRJTUVET1VUJyxcbiAgJ0VDT05OUkVGVVNFRCcsXG4gICdFSE9TVFVOUkVBQ0gnLFxuICAnRVBJUEUnLFxuICAnRUFJX0FHQUlOJyxcbl07XG5cbi8qXG4gKiBfbWF5YmVSZXRyeSAtIEdpdmVuIHRoZSBlcnJvciByZXR1cm5lZCBieSB0aGUgQVBJLCBkZWNpZGUgaWYgd2Ugc2hvdWxkIHJldHJ5IG9yIGp1c3QgY2FsbGJhY2tcbiAqICAgd2l0aCB0aGUgZXJyb3IuXG4gKlxuICogQHBhcmFtIGVyciAtIGFuIGVycm9yIHJldHVybmVkIGJ5IHRoZSBBUEkgdHJhbnNwb3J0XG4gKiBAcGFyYW0gaXRlbSAtIHRoZSBpdGVtIHRoYXQgd2FzIHRyeWluZyB0byBiZSBzZW50IHdoZW4gdGhpcyBlcnJvciBvY2N1cmVkXG4gKiBAcGFyYW0gY2FsbGJhY2sgLSBmdW5jdGlvbihlcnIsIHJlc3BvbnNlKVxuICovXG5RdWV1ZS5wcm90b3R5cGUuX21heWJlUmV0cnkgPSBmdW5jdGlvbiAoZXJyLCBpdGVtLCBjYWxsYmFjaykge1xuICB2YXIgc2hvdWxkUmV0cnkgPSBmYWxzZTtcbiAgaWYgKHRoaXMub3B0aW9ucy5yZXRyeUludGVydmFsKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IFJFVFJJQUJMRV9FUlJPUlMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmIChlcnIuY29kZSA9PT0gUkVUUklBQkxFX0VSUk9SU1tpXSkge1xuICAgICAgICBzaG91bGRSZXRyeSA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc2hvdWxkUmV0cnkgJiYgXy5pc0Zpbml0ZU51bWJlcih0aGlzLm9wdGlvbnMubWF4UmV0cmllcykpIHtcbiAgICAgIGl0ZW0ucmV0cmllcyA9IGl0ZW0ucmV0cmllcyA/IGl0ZW0ucmV0cmllcyArIDEgOiAxO1xuICAgICAgaWYgKGl0ZW0ucmV0cmllcyA+IHRoaXMub3B0aW9ucy5tYXhSZXRyaWVzKSB7XG4gICAgICAgIHNob3VsZFJldHJ5ID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChzaG91bGRSZXRyeSkge1xuICAgIHRoaXMuX3JldHJ5QXBpUmVxdWVzdChpdGVtLCBjYWxsYmFjayk7XG4gIH0gZWxzZSB7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfVxufTtcblxuLypcbiAqIF9yZXRyeUFwaVJlcXVlc3QgLSBBZGQgYW4gaXRlbSBhbmQgYSBjYWxsYmFjayB0byBhIHF1ZXVlIGFuZCBwb3NzaWJseSBzdGFydCBhIHRpbWVyIHRvIHByb2Nlc3NcbiAqICAgdGhhdCBxdWV1ZSBiYXNlZCBvbiB0aGUgcmV0cnlJbnRlcnZhbCBpbiB0aGUgb3B0aW9ucyBmb3IgdGhpcyBxdWV1ZS5cbiAqXG4gKiBAcGFyYW0gaXRlbSAtIGFuIGl0ZW0gdGhhdCBmYWlsZWQgdG8gc2VuZCBkdWUgdG8gYW4gZXJyb3Igd2UgZGVlbSByZXRyaWFibGVcbiAqIEBwYXJhbSBjYWxsYmFjayAtIGZ1bmN0aW9uKGVyciwgcmVzcG9uc2UpXG4gKi9cblF1ZXVlLnByb3RvdHlwZS5fcmV0cnlBcGlSZXF1ZXN0ID0gZnVuY3Rpb24gKGl0ZW0sIGNhbGxiYWNrKSB7XG4gIHRoaXMucmV0cnlRdWV1ZS5wdXNoKHsgaXRlbTogaXRlbSwgY2FsbGJhY2s6IGNhbGxiYWNrIH0pO1xuXG4gIGlmICghdGhpcy5yZXRyeUhhbmRsZSkge1xuICAgIHRoaXMucmV0cnlIYW5kbGUgPSBzZXRJbnRlcnZhbChcbiAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMucmV0cnlRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgICB2YXIgcmV0cnlPYmplY3QgPSB0aGlzLnJldHJ5UXVldWUuc2hpZnQoKTtcbiAgICAgICAgICB0aGlzLl9tYWtlQXBpUmVxdWVzdChyZXRyeU9iamVjdC5pdGVtLCByZXRyeU9iamVjdC5jYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgIHRoaXMub3B0aW9ucy5yZXRyeUludGVydmFsLFxuICAgICk7XG4gIH1cbn07XG5cbi8qXG4gKiBfZGVxdWV1ZVBlbmRpbmdSZXF1ZXN0IC0gUmVtb3ZlcyB0aGUgaXRlbSBmcm9tIHRoZSBwZW5kaW5nIHJlcXVlc3QgcXVldWUsIHRoaXMgcXVldWUgaXMgdXNlZCB0b1xuICogICBlbmFibGUgdG8gZnVuY3Rpb25hbGl0eSBvZiBwcm92aWRpbmcgYSBjYWxsYmFjayB0aGF0IGNsaWVudHMgY2FuIHBhc3MgdG8gYHdhaXRgIHRvIGJlIG5vdGlmaWVkXG4gKiAgIHdoZW4gdGhlIHBlbmRpbmcgcmVxdWVzdCBxdWV1ZSBoYXMgYmVlbiBlbXB0aWVkLiBUaGlzIG11c3QgYmUgY2FsbGVkIHdoZW4gdGhlIEFQSSBmaW5pc2hlc1xuICogICBwcm9jZXNzaW5nIHRoaXMgaXRlbS4gSWYgYSBgd2FpdGAgY2FsbGJhY2sgaXMgY29uZmlndXJlZCwgaXQgaXMgY2FsbGVkIGJ5IHRoaXMgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIGl0ZW0gLSB0aGUgaXRlbSBwcmV2aW91c2x5IGFkZGVkIHRvIHRoZSBwZW5kaW5nIHJlcXVlc3QgcXVldWVcbiAqL1xuUXVldWUucHJvdG90eXBlLl9kZXF1ZXVlUGVuZGluZ1JlcXVlc3QgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgaWR4ID0gdGhpcy5wZW5kaW5nUmVxdWVzdHMuaW5kZXhPZihpdGVtKTtcbiAgaWYgKGlkeCAhPT0gLTEpIHtcbiAgICB0aGlzLnBlbmRpbmdSZXF1ZXN0cy5zcGxpY2UoaWR4LCAxKTtcbiAgICB0aGlzLl9tYXliZUNhbGxXYWl0KCk7XG4gIH1cbn07XG5cblF1ZXVlLnByb3RvdHlwZS5fbWF5YmVMb2cgPSBmdW5jdGlvbiAoZGF0YSwgb3JpZ2luYWxFcnJvcikge1xuICBpZiAodGhpcy5sb2dnZXIgJiYgdGhpcy5vcHRpb25zLnZlcmJvc2UpIHtcbiAgICB2YXIgbWVzc2FnZSA9IG9yaWdpbmFsRXJyb3I7XG4gICAgbWVzc2FnZSA9IG1lc3NhZ2UgfHwgXy5nZXQoZGF0YSwgJ2JvZHkudHJhY2UuZXhjZXB0aW9uLm1lc3NhZ2UnKTtcbiAgICBtZXNzYWdlID0gbWVzc2FnZSB8fCBfLmdldChkYXRhLCAnYm9keS50cmFjZV9jaGFpbi4wLmV4Y2VwdGlvbi5tZXNzYWdlJyk7XG4gICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgIHRoaXMubG9nZ2VyLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBtZXNzYWdlID0gXy5nZXQoZGF0YSwgJ2JvZHkubWVzc2FnZS5ib2R5Jyk7XG4gICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgIHRoaXMubG9nZ2VyLmxvZyhtZXNzYWdlKTtcbiAgICB9XG4gIH1cbn07XG5cblF1ZXVlLnByb3RvdHlwZS5fbWF5YmVDYWxsV2FpdCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKFxuICAgIF8uaXNGdW5jdGlvbih0aGlzLndhaXRDYWxsYmFjaykgJiZcbiAgICB0aGlzLnBlbmRpbmdJdGVtcy5sZW5ndGggPT09IDAgJiZcbiAgICB0aGlzLnBlbmRpbmdSZXF1ZXN0cy5sZW5ndGggPT09IDBcbiAgKSB7XG4gICAgaWYgKHRoaXMud2FpdEludGVydmFsSUQpIHtcbiAgICAgIHRoaXMud2FpdEludGVydmFsSUQgPSBjbGVhckludGVydmFsKHRoaXMud2FpdEludGVydmFsSUQpO1xuICAgIH1cbiAgICB0aGlzLndhaXRDYWxsYmFjaygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICogSGFuZGxlcyB0aGUgQVBJIHJlc3BvbnNlIGZvciBhbiBpdGVtIHdpdGggYSByZXBsYXkgSUQuXG4gKiBCYXNlZCBvbiB0aGUgc3VjY2VzcyBvciBmYWlsdXJlIHN0YXR1cyBvZiB0aGUgcmVzcG9uc2UsXG4gKiBpdCBlaXRoZXIgc2VuZHMgb3IgZGlzY2FyZHMgdGhlIGFzc29jaWF0ZWQgc2Vzc2lvbiByZXBsYXkuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHJlcGxheUlkIC0gVGhlIElEIG9mIHRoZSByZXBsYXkgdG8gaGFuZGxlXG4gKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2UgLSBUaGUgQVBJIHJlc3BvbnNlXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxib29sZWFuPn0gQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdHJ1ZSBpZiByZXBsYXkgd2FzIHNlbnQgc3VjY2Vzc2Z1bGx5LFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlIGlmIHJlcGxheSB3YXMgZGlzY2FyZGVkIG9yIGFuIGVycm9yIG9jY3VycmVkXG4gKiBAcHJpdmF0ZVxuICovXG5RdWV1ZS5wcm90b3R5cGUuX2hhbmRsZVJlcGxheVJlc3BvbnNlID0gYXN5bmMgZnVuY3Rpb24gKHJlcGxheUlkLCByZXNwb25zZSkge1xuICBpZiAoIXRoaXMucmVwbGF5TWFwKSB7XG4gICAgY29uc29sZS53YXJuKCdRdWV1ZS5faGFuZGxlUmVwbGF5UmVzcG9uc2U6IFJlcGxheU1hcCBub3QgYXZhaWxhYmxlJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFyZXBsYXlJZCkge1xuICAgIGNvbnNvbGUud2FybignUXVldWUuX2hhbmRsZVJlcGxheVJlc3BvbnNlOiBObyByZXBsYXlJZCBwcm92aWRlZCcpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgLy8gU3VjY2VzcyBjb25kaXRpb24gbWlnaHQgbmVlZCBhZGp1c3RtZW50IGJhc2VkIG9uIEFQSSByZXNwb25zZSBzdHJ1Y3R1cmVcbiAgICBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2UuZXJyID09PSAwKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLnJlcGxheU1hcC5zZW5kKHJlcGxheUlkKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVwbGF5TWFwLmRpc2NhcmQocmVwbGF5SWQpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBoYW5kbGluZyByZXBsYXkgcmVzcG9uc2U6JywgZXJyb3IpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBRdWV1ZTtcbiIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsaXR5Jyk7XG5cbi8qXG4gKiBSYXRlTGltaXRlciAtIGFuIG9iamVjdCB0aGF0IGVuY2Fwc3VsYXRlcyB0aGUgbG9naWMgZm9yIGNvdW50aW5nIGl0ZW1zIHNlbnQgdG8gUm9sbGJhclxuICpcbiAqIEBwYXJhbSBvcHRpb25zIC0gdGhlIHNhbWUgb3B0aW9ucyB0aGF0IGFyZSBhY2NlcHRlZCBieSBjb25maWd1cmVHbG9iYWwgb2ZmZXJlZCBhcyBhIGNvbnZlbmllbmNlXG4gKi9cbmZ1bmN0aW9uIFJhdGVMaW1pdGVyKG9wdGlvbnMpIHtcbiAgdGhpcy5zdGFydFRpbWUgPSBfLm5vdygpO1xuICB0aGlzLmNvdW50ZXIgPSAwO1xuICB0aGlzLnBlck1pbkNvdW50ZXIgPSAwO1xuICB0aGlzLnBsYXRmb3JtID0gbnVsbDtcbiAgdGhpcy5wbGF0Zm9ybU9wdGlvbnMgPSB7fTtcbiAgdGhpcy5jb25maWd1cmVHbG9iYWwob3B0aW9ucyk7XG59XG5cblJhdGVMaW1pdGVyLmdsb2JhbFNldHRpbmdzID0ge1xuICBzdGFydFRpbWU6IF8ubm93KCksXG4gIG1heEl0ZW1zOiB1bmRlZmluZWQsXG4gIGl0ZW1zUGVyTWludXRlOiB1bmRlZmluZWQsXG59O1xuXG4vKlxuICogY29uZmlndXJlR2xvYmFsIC0gc2V0IHRoZSBnbG9iYWwgcmF0ZSBsaW1pdGVyIG9wdGlvbnNcbiAqXG4gKiBAcGFyYW0gb3B0aW9ucyAtIE9ubHkgdGhlIGZvbGxvd2luZyB2YWx1ZXMgYXJlIHJlY29nbml6ZWQ6XG4gKiAgICBzdGFydFRpbWU6IGEgdGltZXN0YW1wIG9mIHRoZSBmb3JtIHJldHVybmVkIGJ5IChuZXcgRGF0ZSgpKS5nZXRUaW1lKClcbiAqICAgIG1heEl0ZW1zOiB0aGUgbWF4aW11bSBpdGVtc1xuICogICAgaXRlbXNQZXJNaW51dGU6IHRoZSBtYXggbnVtYmVyIG9mIGl0ZW1zIHRvIHNlbmQgaW4gYSBnaXZlbiBtaW51dGVcbiAqL1xuUmF0ZUxpbWl0ZXIucHJvdG90eXBlLmNvbmZpZ3VyZUdsb2JhbCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zLnN0YXJ0VGltZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgUmF0ZUxpbWl0ZXIuZ2xvYmFsU2V0dGluZ3Muc3RhcnRUaW1lID0gb3B0aW9ucy5zdGFydFRpbWU7XG4gIH1cbiAgaWYgKG9wdGlvbnMubWF4SXRlbXMgIT09IHVuZGVmaW5lZCkge1xuICAgIFJhdGVMaW1pdGVyLmdsb2JhbFNldHRpbmdzLm1heEl0ZW1zID0gb3B0aW9ucy5tYXhJdGVtcztcbiAgfVxuICBpZiAob3B0aW9ucy5pdGVtc1Blck1pbnV0ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgUmF0ZUxpbWl0ZXIuZ2xvYmFsU2V0dGluZ3MuaXRlbXNQZXJNaW51dGUgPSBvcHRpb25zLml0ZW1zUGVyTWludXRlO1xuICB9XG59O1xuXG4vKlxuICogc2hvdWxkU2VuZCAtIGRldGVybWluZSBpZiB3ZSBzaG91bGQgc2VuZCBhIGdpdmVuIGl0ZW0gYmFzZWQgb24gcmF0ZSBsaW1pdCBzZXR0aW5nc1xuICpcbiAqIEBwYXJhbSBpdGVtIC0gdGhlIGl0ZW0gd2UgYXJlIGFib3V0IHRvIHNlbmRcbiAqIEByZXR1cm5zIEFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgc3RydWN0dXJlOlxuICogIGVycm9yOiAoRXJyb3J8bnVsbClcbiAqICBzaG91bGRTZW5kOiBib29sXG4gKiAgcGF5bG9hZDogKE9iamVjdHxudWxsKVxuICogIElmIHNob3VsZFNlbmQgaXMgZmFsc2UsIHRoZSBpdGVtIHBhc3NlZCBhcyBhIHBhcmFtZXRlciBzaG91bGQgbm90IGJlIHNlbnQgdG8gUm9sbGJhciwgYW5kXG4gKiAgZXhhY3RseSBvbmUgb2YgZXJyb3Igb3IgcGF5bG9hZCB3aWxsIGJlIG5vbi1udWxsLiBJZiBlcnJvciBpcyBub24tbnVsbCwgdGhlIHJldHVybmVkIEVycm9yIHdpbGxcbiAqICBkZXNjcmliZSB0aGUgc2l0dWF0aW9uLCBidXQgaXQgbWVhbnMgdGhhdCB3ZSB3ZXJlIGFscmVhZHkgb3ZlciBhIHJhdGUgbGltaXQgKGVpdGhlciBnbG9iYWxseSBvclxuICogIHBlciBtaW51dGUpIHdoZW4gdGhpcyBpdGVtIHdhcyBjaGVja2VkLiBJZiBlcnJvciBpcyBudWxsLCBhbmQgdGhlcmVmb3JlIHBheWxvYWQgaXMgbm9uLW51bGwsIGl0XG4gKiAgbWVhbnMgdGhpcyBpdGVtIHB1dCB1cyBvdmVyIHRoZSBnbG9iYWwgcmF0ZSBsaW1pdCBhbmQgdGhlIHBheWxvYWQgc2hvdWxkIGJlIHNlbnQgdG8gUm9sbGJhciBpblxuICogIHBsYWNlIG9mIHRoZSBwYXNzZWQgaW4gaXRlbS5cbiAqL1xuUmF0ZUxpbWl0ZXIucHJvdG90eXBlLnNob3VsZFNlbmQgPSBmdW5jdGlvbiAoaXRlbSwgbm93KSB7XG4gIG5vdyA9IG5vdyB8fCBfLm5vdygpO1xuICB2YXIgZWxhcHNlZFRpbWUgPSBub3cgLSB0aGlzLnN0YXJ0VGltZTtcbiAgaWYgKGVsYXBzZWRUaW1lIDwgMCB8fCBlbGFwc2VkVGltZSA+PSA2MDAwMCkge1xuICAgIHRoaXMuc3RhcnRUaW1lID0gbm93O1xuICAgIHRoaXMucGVyTWluQ291bnRlciA9IDA7XG4gIH1cblxuICB2YXIgZ2xvYmFsUmF0ZUxpbWl0ID0gUmF0ZUxpbWl0ZXIuZ2xvYmFsU2V0dGluZ3MubWF4SXRlbXM7XG4gIHZhciBnbG9iYWxSYXRlTGltaXRQZXJNaW4gPSBSYXRlTGltaXRlci5nbG9iYWxTZXR0aW5ncy5pdGVtc1Blck1pbnV0ZTtcblxuICBpZiAoY2hlY2tSYXRlKGl0ZW0sIGdsb2JhbFJhdGVMaW1pdCwgdGhpcy5jb3VudGVyKSkge1xuICAgIHJldHVybiBzaG91bGRTZW5kVmFsdWUoXG4gICAgICB0aGlzLnBsYXRmb3JtLFxuICAgICAgdGhpcy5wbGF0Zm9ybU9wdGlvbnMsXG4gICAgICBnbG9iYWxSYXRlTGltaXQgKyAnIG1heCBpdGVtcyByZWFjaGVkJyxcbiAgICAgIGZhbHNlLFxuICAgICk7XG4gIH0gZWxzZSBpZiAoY2hlY2tSYXRlKGl0ZW0sIGdsb2JhbFJhdGVMaW1pdFBlck1pbiwgdGhpcy5wZXJNaW5Db3VudGVyKSkge1xuICAgIHJldHVybiBzaG91bGRTZW5kVmFsdWUoXG4gICAgICB0aGlzLnBsYXRmb3JtLFxuICAgICAgdGhpcy5wbGF0Zm9ybU9wdGlvbnMsXG4gICAgICBnbG9iYWxSYXRlTGltaXRQZXJNaW4gKyAnIGl0ZW1zIHBlciBtaW51dGUgcmVhY2hlZCcsXG4gICAgICBmYWxzZSxcbiAgICApO1xuICB9XG4gIHRoaXMuY291bnRlcisrO1xuICB0aGlzLnBlck1pbkNvdW50ZXIrKztcblxuICB2YXIgc2hvdWxkU2VuZCA9ICFjaGVja1JhdGUoaXRlbSwgZ2xvYmFsUmF0ZUxpbWl0LCB0aGlzLmNvdW50ZXIpO1xuICB2YXIgcGVyTWludXRlID0gc2hvdWxkU2VuZDtcbiAgc2hvdWxkU2VuZCA9XG4gICAgc2hvdWxkU2VuZCAmJiAhY2hlY2tSYXRlKGl0ZW0sIGdsb2JhbFJhdGVMaW1pdFBlck1pbiwgdGhpcy5wZXJNaW5Db3VudGVyKTtcbiAgcmV0dXJuIHNob3VsZFNlbmRWYWx1ZShcbiAgICB0aGlzLnBsYXRmb3JtLFxuICAgIHRoaXMucGxhdGZvcm1PcHRpb25zLFxuICAgIG51bGwsXG4gICAgc2hvdWxkU2VuZCxcbiAgICBnbG9iYWxSYXRlTGltaXQsXG4gICAgZ2xvYmFsUmF0ZUxpbWl0UGVyTWluLFxuICAgIHBlck1pbnV0ZSxcbiAgKTtcbn07XG5cblJhdGVMaW1pdGVyLnByb3RvdHlwZS5zZXRQbGF0Zm9ybU9wdGlvbnMgPSBmdW5jdGlvbiAocGxhdGZvcm0sIG9wdGlvbnMpIHtcbiAgdGhpcy5wbGF0Zm9ybSA9IHBsYXRmb3JtO1xuICB0aGlzLnBsYXRmb3JtT3B0aW9ucyA9IG9wdGlvbnM7XG59O1xuXG4vKiBIZWxwZXJzICovXG5cbmZ1bmN0aW9uIGNoZWNrUmF0ZShpdGVtLCBsaW1pdCwgY291bnRlcikge1xuICByZXR1cm4gIWl0ZW0uaWdub3JlUmF0ZUxpbWl0ICYmIGxpbWl0ID49IDEgJiYgY291bnRlciA+IGxpbWl0O1xufVxuXG5mdW5jdGlvbiBzaG91bGRTZW5kVmFsdWUoXG4gIHBsYXRmb3JtLFxuICBvcHRpb25zLFxuICBlcnJvcixcbiAgc2hvdWxkU2VuZCxcbiAgZ2xvYmFsUmF0ZUxpbWl0LFxuICBsaW1pdFBlck1pbixcbiAgcGVyTWludXRlLFxuKSB7XG4gIHZhciBwYXlsb2FkID0gbnVsbDtcbiAgaWYgKGVycm9yKSB7XG4gICAgZXJyb3IgPSBuZXcgRXJyb3IoZXJyb3IpO1xuICB9XG4gIGlmICghZXJyb3IgJiYgIXNob3VsZFNlbmQpIHtcbiAgICBwYXlsb2FkID0gcmF0ZUxpbWl0UGF5bG9hZChcbiAgICAgIHBsYXRmb3JtLFxuICAgICAgb3B0aW9ucyxcbiAgICAgIGdsb2JhbFJhdGVMaW1pdCxcbiAgICAgIGxpbWl0UGVyTWluLFxuICAgICAgcGVyTWludXRlLFxuICAgICk7XG4gIH1cbiAgcmV0dXJuIHsgZXJyb3I6IGVycm9yLCBzaG91bGRTZW5kOiBzaG91bGRTZW5kLCBwYXlsb2FkOiBwYXlsb2FkIH07XG59XG5cbmZ1bmN0aW9uIHJhdGVMaW1pdFBheWxvYWQoXG4gIHBsYXRmb3JtLFxuICBvcHRpb25zLFxuICBnbG9iYWxSYXRlTGltaXQsXG4gIGxpbWl0UGVyTWluLFxuICBwZXJNaW51dGUsXG4pIHtcbiAgdmFyIGVudmlyb25tZW50ID1cbiAgICBvcHRpb25zLmVudmlyb25tZW50IHx8IChvcHRpb25zLnBheWxvYWQgJiYgb3B0aW9ucy5wYXlsb2FkLmVudmlyb25tZW50KTtcbiAgdmFyIG1zZztcbiAgaWYgKHBlck1pbnV0ZSkge1xuICAgIG1zZyA9ICdpdGVtIHBlciBtaW51dGUgbGltaXQgcmVhY2hlZCwgaWdub3JpbmcgZXJyb3JzIHVudGlsIHRpbWVvdXQnO1xuICB9IGVsc2Uge1xuICAgIG1zZyA9ICdtYXhJdGVtcyBoYXMgYmVlbiBoaXQsIGlnbm9yaW5nIGVycm9ycyB1bnRpbCByZXNldC4nO1xuICB9XG4gIHZhciBpdGVtID0ge1xuICAgIGJvZHk6IHtcbiAgICAgIG1lc3NhZ2U6IHtcbiAgICAgICAgYm9keTogbXNnLFxuICAgICAgICBleHRyYToge1xuICAgICAgICAgIG1heEl0ZW1zOiBnbG9iYWxSYXRlTGltaXQsXG4gICAgICAgICAgaXRlbXNQZXJNaW51dGU6IGxpbWl0UGVyTWluLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIGxhbmd1YWdlOiAnamF2YXNjcmlwdCcsXG4gICAgZW52aXJvbm1lbnQ6IGVudmlyb25tZW50LFxuICAgIG5vdGlmaWVyOiB7XG4gICAgICB2ZXJzaW9uOlxuICAgICAgICAob3B0aW9ucy5ub3RpZmllciAmJiBvcHRpb25zLm5vdGlmaWVyLnZlcnNpb24pIHx8IG9wdGlvbnMudmVyc2lvbixcbiAgICB9LFxuICB9O1xuICBpZiAocGxhdGZvcm0gPT09ICdicm93c2VyJykge1xuICAgIGl0ZW0ucGxhdGZvcm0gPSAnYnJvd3Nlcic7XG4gICAgaXRlbS5mcmFtZXdvcmsgPSAnYnJvd3Nlci1qcyc7XG4gICAgaXRlbS5ub3RpZmllci5uYW1lID0gJ3JvbGxiYXItYnJvd3Nlci1qcyc7XG4gIH0gZWxzZSBpZiAocGxhdGZvcm0gPT09ICdzZXJ2ZXInKSB7XG4gICAgaXRlbS5mcmFtZXdvcmsgPSBvcHRpb25zLmZyYW1ld29yayB8fCAnbm9kZS1qcyc7XG4gICAgaXRlbS5ub3RpZmllci5uYW1lID0gb3B0aW9ucy5ub3RpZmllci5uYW1lO1xuICB9IGVsc2UgaWYgKHBsYXRmb3JtID09PSAncmVhY3QtbmF0aXZlJykge1xuICAgIGl0ZW0uZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmsgfHwgJ3JlYWN0LW5hdGl2ZSc7XG4gICAgaXRlbS5ub3RpZmllci5uYW1lID0gb3B0aW9ucy5ub3RpZmllci5uYW1lO1xuICB9XG4gIHJldHVybiBpdGVtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJhdGVMaW1pdGVyO1xuIiwiY29uc3QgUmF0ZUxpbWl0ZXIgPSByZXF1aXJlKCcuL3JhdGVMaW1pdGVyJyk7XG5jb25zdCBRdWV1ZSA9IHJlcXVpcmUoJy4vcXVldWUnKTtcbmNvbnN0IE5vdGlmaWVyID0gcmVxdWlyZSgnLi9ub3RpZmllcicpO1xuY29uc3QgXyA9IHJlcXVpcmUoJy4vdXRpbGl0eScpO1xuXG4vKlxuICogUm9sbGJhciAtIHRoZSBpbnRlcmZhY2UgdG8gUm9sbGJhclxuICpcbiAqIEBwYXJhbSBvcHRpb25zXG4gKiBAcGFyYW0gYXBpXG4gKiBAcGFyYW0gbG9nZ2VyXG4gKi9cbmZ1bmN0aW9uIFJvbGxiYXIob3B0aW9ucywgYXBpLCBsb2dnZXIsIHRlbGVtZXRlciwgdHJhY2luZywgcmVwbGF5TWFwLCBwbGF0Zm9ybSkge1xuICB0aGlzLm9wdGlvbnMgPSBfLm1lcmdlKG9wdGlvbnMpO1xuICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcbiAgUm9sbGJhci5yYXRlTGltaXRlci5jb25maWd1cmVHbG9iYWwodGhpcy5vcHRpb25zKTtcbiAgUm9sbGJhci5yYXRlTGltaXRlci5zZXRQbGF0Zm9ybU9wdGlvbnMocGxhdGZvcm0sIHRoaXMub3B0aW9ucyk7XG4gIHRoaXMuYXBpID0gYXBpO1xuICB0aGlzLnF1ZXVlID0gbmV3IFF1ZXVlKFJvbGxiYXIucmF0ZUxpbWl0ZXIsIGFwaSwgbG9nZ2VyLCB0aGlzLm9wdGlvbnMsIHJlcGxheU1hcCk7XG5cbiAgdGhpcy50cmFjaW5nID0gdHJhY2luZztcblxuICAvLyBMZWdhY3kgT3BlblRyYWNpbmcgc3VwcG9ydFxuICAvLyBUaGlzIG11c3QgaGFwcGVuIGJlZm9yZSB0aGUgTm90aWZpZXIgaXMgY3JlYXRlZFxuICB2YXIgdHJhY2VyID0gdGhpcy5vcHRpb25zLnRyYWNlciB8fCBudWxsO1xuICBpZiAodmFsaWRhdGVUcmFjZXIodHJhY2VyKSkge1xuICAgIHRoaXMudHJhY2VyID0gdHJhY2VyO1xuICAgIC8vIHNldCB0byBhIHN0cmluZyBmb3IgYXBpIHJlc3BvbnNlIHNlcmlhbGl6YXRpb25cbiAgICB0aGlzLm9wdGlvbnMudHJhY2VyID0gJ29wZW50cmFjaW5nLXRyYWNlci1lbmFibGVkJztcbiAgICB0aGlzLm9wdGlvbnMuX2NvbmZpZ3VyZWRPcHRpb25zLnRyYWNlciA9ICdvcGVudHJhY2luZy10cmFjZXItZW5hYmxlZCc7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy50cmFjZXIgPSBudWxsO1xuICB9XG5cbiAgdGhpcy5ub3RpZmllciA9IG5ldyBOb3RpZmllcih0aGlzLnF1ZXVlLCB0aGlzLm9wdGlvbnMpO1xuICB0aGlzLnRlbGVtZXRlciA9IHRlbGVtZXRlcjtcbiAgc2V0U3RhY2tUcmFjZUxpbWl0KG9wdGlvbnMpO1xuICB0aGlzLmxhc3RFcnJvciA9IG51bGw7XG4gIHRoaXMubGFzdEVycm9ySGFzaCA9ICdub25lJztcbn1cblxudmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICBtYXhJdGVtczogMCxcbiAgaXRlbXNQZXJNaW51dGU6IDYwLFxufTtcblxuUm9sbGJhci5yYXRlTGltaXRlciA9IG5ldyBSYXRlTGltaXRlcihkZWZhdWx0T3B0aW9ucyk7XG5cblJvbGxiYXIucHJvdG90eXBlLmdsb2JhbCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIFJvbGxiYXIucmF0ZUxpbWl0ZXIuY29uZmlndXJlR2xvYmFsKG9wdGlvbnMpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblJvbGxiYXIucHJvdG90eXBlLmNvbmZpZ3VyZSA9IGZ1bmN0aW9uIChvcHRpb25zLCBwYXlsb2FkRGF0YSkge1xuICB2YXIgb2xkT3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgdmFyIHBheWxvYWQgPSB7fTtcbiAgaWYgKHBheWxvYWREYXRhKSB7XG4gICAgcGF5bG9hZCA9IHsgcGF5bG9hZDogcGF5bG9hZERhdGEgfTtcbiAgfVxuXG4gIHRoaXMub3B0aW9ucyA9IF8ubWVyZ2Uob2xkT3B0aW9ucywgb3B0aW9ucywgcGF5bG9hZCk7XG5cbiAgLy8gTGVnYWN5IE9wZW5UcmFjaW5nIHN1cHBvcnRcbiAgLy8gVGhpcyBtdXN0IGhhcHBlbiBiZWZvcmUgdGhlIE5vdGlmaWVyIGlzIGNvbmZpZ3VyZWRcbiAgdmFyIHRyYWNlciA9IHRoaXMub3B0aW9ucy50cmFjZXIgfHwgbnVsbDtcbiAgaWYgKHZhbGlkYXRlVHJhY2VyKHRyYWNlcikpIHtcbiAgICB0aGlzLnRyYWNlciA9IHRyYWNlcjtcbiAgICAvLyBzZXQgdG8gYSBzdHJpbmcgZm9yIGFwaSByZXNwb25zZSBzZXJpYWxpemF0aW9uXG4gICAgdGhpcy5vcHRpb25zLnRyYWNlciA9ICdvcGVudHJhY2luZy10cmFjZXItZW5hYmxlZCc7XG4gICAgdGhpcy5vcHRpb25zLl9jb25maWd1cmVkT3B0aW9ucy50cmFjZXIgPSAnb3BlbnRyYWNpbmctdHJhY2VyLWVuYWJsZWQnO1xuICB9IGVsc2Uge1xuICAgIHRoaXMudHJhY2VyID0gbnVsbDtcbiAgfVxuXG4gIHRoaXMubm90aWZpZXIgJiYgdGhpcy5ub3RpZmllci5jb25maWd1cmUodGhpcy5vcHRpb25zKTtcbiAgdGhpcy50ZWxlbWV0ZXIgJiYgdGhpcy50ZWxlbWV0ZXIuY29uZmlndXJlKHRoaXMub3B0aW9ucyk7XG4gIHNldFN0YWNrVHJhY2VMaW1pdChvcHRpb25zKTtcbiAgdGhpcy5nbG9iYWwodGhpcy5vcHRpb25zKTtcblxuICBpZiAodmFsaWRhdGVUcmFjZXIob3B0aW9ucy50cmFjZXIpKSB7XG4gICAgdGhpcy50cmFjZXIgPSBvcHRpb25zLnRyYWNlcjtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuUm9sbGJhci5wcm90b3R5cGUubG9nID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGxldmVsID0gdGhpcy5fZGVmYXVsdExvZ0xldmVsKCk7XG4gIHJldHVybiB0aGlzLl9sb2cobGV2ZWwsIGl0ZW0pO1xufTtcblxuUm9sbGJhci5wcm90b3R5cGUuZGVidWcgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB0aGlzLl9sb2coJ2RlYnVnJywgaXRlbSk7XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5pbmZvID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdGhpcy5fbG9nKCdpbmZvJywgaXRlbSk7XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS53YXJuID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdGhpcy5fbG9nKCd3YXJuaW5nJywgaXRlbSk7XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS53YXJuaW5nID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdGhpcy5fbG9nKCd3YXJuaW5nJywgaXRlbSk7XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHRoaXMuX2xvZygnZXJyb3InLCBpdGVtKTtcbn07XG5cblJvbGxiYXIucHJvdG90eXBlLmNyaXRpY2FsID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdGhpcy5fbG9nKCdjcml0aWNhbCcsIGl0ZW0pO1xufTtcblxuUm9sbGJhci5wcm90b3R5cGUud2FpdCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICB0aGlzLnF1ZXVlLndhaXQoY2FsbGJhY2spO1xufTtcblxuUm9sbGJhci5wcm90b3R5cGUuY2FwdHVyZUV2ZW50ID0gZnVuY3Rpb24gKHR5cGUsIG1ldGFkYXRhLCBsZXZlbCkge1xuICByZXR1cm4gdGhpcy50ZWxlbWV0ZXIgJiYgdGhpcy50ZWxlbWV0ZXIuY2FwdHVyZUV2ZW50KHR5cGUsIG1ldGFkYXRhLCBsZXZlbCk7XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5jYXB0dXJlRG9tQ29udGVudExvYWRlZCA9IGZ1bmN0aW9uICh0cykge1xuICByZXR1cm4gdGhpcy50ZWxlbWV0ZXIgJiYgdGhpcy50ZWxlbWV0ZXIuY2FwdHVyZURvbUNvbnRlbnRMb2FkZWQodHMpO1xufTtcblxuUm9sbGJhci5wcm90b3R5cGUuY2FwdHVyZUxvYWQgPSBmdW5jdGlvbiAodHMpIHtcbiAgcmV0dXJuIHRoaXMudGVsZW1ldGVyICYmIHRoaXMudGVsZW1ldGVyLmNhcHR1cmVMb2FkKHRzKTtcbn07XG5cblJvbGxiYXIucHJvdG90eXBlLmJ1aWxkSnNvblBheWxvYWQgPSBmdW5jdGlvbiAoaXRlbSkge1xuICByZXR1cm4gdGhpcy5hcGkuYnVpbGRKc29uUGF5bG9hZChpdGVtKTtcbn07XG5cblJvbGxiYXIucHJvdG90eXBlLnNlbmRKc29uUGF5bG9hZCA9IGZ1bmN0aW9uIChqc29uUGF5bG9hZCkge1xuICB0aGlzLmFwaS5wb3N0SnNvblBheWxvYWQoanNvblBheWxvYWQpO1xufTtcblxuLyogSW50ZXJuYWwgKi9cblxuUm9sbGJhci5wcm90b3R5cGUuX2xvZyA9IGZ1bmN0aW9uIChkZWZhdWx0TGV2ZWwsIGl0ZW0pIHtcbiAgdmFyIGNhbGxiYWNrO1xuICBpZiAoaXRlbS5jYWxsYmFjaykge1xuICAgIGNhbGxiYWNrID0gaXRlbS5jYWxsYmFjaztcbiAgICBkZWxldGUgaXRlbS5jYWxsYmFjaztcbiAgfVxuICBpZiAodGhpcy5vcHRpb25zLmlnbm9yZUR1cGxpY2F0ZUVycm9ycyAmJiB0aGlzLl9zYW1lQXNMYXN0RXJyb3IoaXRlbSkpIHtcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIHZhciBlcnJvciA9IG5ldyBFcnJvcignaWdub3JlZCBpZGVudGljYWwgaXRlbScpO1xuICAgICAgZXJyb3IuaXRlbSA9IGl0ZW07XG4gICAgICBjYWxsYmFjayhlcnJvcik7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuICB0cnkge1xuICAgIHRoaXMuX2FkZFRyYWNpbmdBdHRyaWJ1dGVzKGl0ZW0pO1xuXG4gICAgLy8gTGVnYWN5IE9wZW5UcmFjaW5nIHN1cHBvcnRcbiAgICB0aGlzLl9hZGRUcmFjaW5nSW5mbyhpdGVtKTtcblxuICAgIGl0ZW0ubGV2ZWwgPSBpdGVtLmxldmVsIHx8IGRlZmF1bHRMZXZlbDtcblxuXG4gICAgY29uc3QgdGVsZW1ldGVyID0gdGhpcy50ZWxlbWV0ZXI7XG4gICAgaWYgKHRlbGVtZXRlcikge1xuICAgICAgdGVsZW1ldGVyLl9jYXB0dXJlUm9sbGJhckl0ZW0oaXRlbSk7XG4gICAgICBpdGVtLnRlbGVtZXRyeUV2ZW50cyA9IHRlbGVtZXRlci5jb3B5RXZlbnRzKCkgfHwgW107XG5cbiAgICAgIGlmICh0ZWxlbWV0ZXIudGVsZW1ldHJ5U3Bhbikge1xuICAgICAgICB0ZWxlbWV0ZXIudGVsZW1ldHJ5U3Bhbi5lbmQoKTtcbiAgICAgICAgdGVsZW1ldGVyLnRlbGVtZXRyeVNwYW4gPSB0ZWxlbWV0ZXIudHJhY2luZy5zdGFydFNwYW4oJ3JvbGxiYXItdGVsZW1ldHJ5Jywge30pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMubm90aWZpZXIubG9nKGl0ZW0sIGNhbGxiYWNrKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2soZSk7XG4gICAgfVxuICAgIHRoaXMubG9nZ2VyLmVycm9yKGUpO1xuICB9XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5fYWRkVHJhY2luZ0F0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICBjb25zdCBzcGFuID0gdGhpcy50cmFjaW5nPy5nZXRTcGFuKCk7XG4gIGlmICghc3Bhbikge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBhdHRyaWJ1dGVzID0gW1xuICAgIHtrZXk6ICdzZXNzaW9uX2lkJywgdmFsdWU6IHRoaXMudHJhY2luZy5zZXNzaW9uSWR9LFxuICAgIHtrZXk6ICdzcGFuX2lkJywgdmFsdWU6IHNwYW4uc3BhbklkfSxcbiAgICB7a2V5OiAndHJhY2VfaWQnLCB2YWx1ZTogc3Bhbi50cmFjZUlkfSxcbiAgXTtcbiAgXy5hZGRJdGVtQXR0cmlidXRlcyhpdGVtLCBhdHRyaWJ1dGVzKTtcblxuICBzcGFuLmFkZEV2ZW50KFxuICAgICdyb2xsYmFyLm9jY3VycmVuY2UnLFxuICAgIFt7a2V5OiAncm9sbGJhci5vY2N1cnJlbmNlLnV1aWQnLCB2YWx1ZTogaXRlbS51dWlkfV0sXG4gICk7XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5fZGVmYXVsdExvZ0xldmVsID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5vcHRpb25zLmxvZ0xldmVsIHx8ICdkZWJ1Zyc7XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5fc2FtZUFzTGFzdEVycm9yID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgaWYgKCFpdGVtLl9pc1VuY2F1Z2h0KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBpdGVtSGFzaCA9IGdlbmVyYXRlSXRlbUhhc2goaXRlbSk7XG4gIGlmICh0aGlzLmxhc3RFcnJvckhhc2ggPT09IGl0ZW1IYXNoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgdGhpcy5sYXN0RXJyb3IgPSBpdGVtLmVycjtcbiAgdGhpcy5sYXN0RXJyb3JIYXNoID0gaXRlbUhhc2g7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cblJvbGxiYXIucHJvdG90eXBlLl9hZGRUcmFjaW5nSW5mbyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIC8vIFRyYWNlciB2YWxpZGF0aW9uIG9jY3VycyBpbiB0aGUgY29uc3RydWN0b3JcbiAgLy8gb3IgaW4gdGhlIFJvbGxiYXIucHJvdG90eXBlLmNvbmZpZ3VyZSBtZXRob2RzXG4gIGlmICh0aGlzLnRyYWNlcikge1xuICAgIC8vIGFkZCByb2xsYmFyIG9jY3VycmVuY2UgdXVpZCB0byBzcGFuXG4gICAgdmFyIHNwYW4gPSB0aGlzLnRyYWNlci5zY29wZSgpLmFjdGl2ZSgpO1xuXG4gICAgaWYgKHZhbGlkYXRlU3BhbihzcGFuKSkge1xuICAgICAgc3Bhbi5zZXRUYWcoJ3JvbGxiYXIuZXJyb3JfdXVpZCcsIGl0ZW0udXVpZCk7XG4gICAgICBzcGFuLnNldFRhZygncm9sbGJhci5oYXNfZXJyb3InLCB0cnVlKTtcbiAgICAgIHNwYW4uc2V0VGFnKCdlcnJvcicsIHRydWUpO1xuICAgICAgc3Bhbi5zZXRUYWcoXG4gICAgICAgICdyb2xsYmFyLml0ZW1fdXJsJyxcbiAgICAgICAgYGh0dHBzOi8vcm9sbGJhci5jb20vaXRlbS91dWlkLz91dWlkPSR7aXRlbS51dWlkfWAsXG4gICAgICApO1xuICAgICAgc3Bhbi5zZXRUYWcoXG4gICAgICAgICdyb2xsYmFyLm9jY3VycmVuY2VfdXJsJyxcbiAgICAgICAgYGh0dHBzOi8vcm9sbGJhci5jb20vb2NjdXJyZW5jZS91dWlkLz91dWlkPSR7aXRlbS51dWlkfWAsXG4gICAgICApO1xuXG4gICAgICAvLyBhZGQgc3BhbiBJRCAmIHRyYWNlIElEIHRvIG9jY3VycmVuY2VcbiAgICAgIHZhciBvcGVudHJhY2luZ1NwYW5JZCA9IHNwYW4uY29udGV4dCgpLnRvU3BhbklkKCk7XG4gICAgICB2YXIgb3BlbnRyYWNpbmdUcmFjZUlkID0gc3Bhbi5jb250ZXh0KCkudG9UcmFjZUlkKCk7XG5cbiAgICAgIGlmIChpdGVtLmN1c3RvbSkge1xuICAgICAgICBpdGVtLmN1c3RvbS5vcGVudHJhY2luZ19zcGFuX2lkID0gb3BlbnRyYWNpbmdTcGFuSWQ7XG4gICAgICAgIGl0ZW0uY3VzdG9tLm9wZW50cmFjaW5nX3RyYWNlX2lkID0gb3BlbnRyYWNpbmdUcmFjZUlkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXRlbS5jdXN0b20gPSB7XG4gICAgICAgICAgb3BlbnRyYWNpbmdfc3Bhbl9pZDogb3BlbnRyYWNpbmdTcGFuSWQsXG4gICAgICAgICAgb3BlbnRyYWNpbmdfdHJhY2VfaWQ6IG9wZW50cmFjaW5nVHJhY2VJZCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGdlbmVyYXRlSXRlbUhhc2goaXRlbSkge1xuICB2YXIgbWVzc2FnZSA9IGl0ZW0ubWVzc2FnZSB8fCAnJztcbiAgdmFyIHN0YWNrID0gKGl0ZW0uZXJyIHx8IHt9KS5zdGFjayB8fCBTdHJpbmcoaXRlbS5lcnIpO1xuICByZXR1cm4gbWVzc2FnZSArICc6OicgKyBzdGFjaztcbn1cblxuLy8gTm9kZS5qcywgQ2hyb21lLCBTYWZhcmksIGFuZCBzb21lIG90aGVyIGJyb3dzZXJzIHN1cHBvcnQgdGhpcyBwcm9wZXJ0eVxuLy8gd2hpY2ggZ2xvYmFsbHkgc2V0cyB0aGUgbnVtYmVyIG9mIHN0YWNrIGZyYW1lcyByZXR1cm5lZCBpbiBhbiBFcnJvciBvYmplY3QuXG4vLyBJZiBhIGJyb3dzZXIgY2FuJ3QgdXNlIGl0LCBubyBoYXJtIGRvbmUuXG5mdW5jdGlvbiBzZXRTdGFja1RyYWNlTGltaXQob3B0aW9ucykge1xuICBpZiAob3B0aW9ucy5zdGFja1RyYWNlTGltaXQpIHtcbiAgICBFcnJvci5zdGFja1RyYWNlTGltaXQgPSBvcHRpb25zLnN0YWNrVHJhY2VMaW1pdDtcbiAgfVxufVxuXG4vKipcbiAqIFZhbGlkYXRlIHRoZSBUcmFjZXIgb2JqZWN0IHByb3ZpZGVkIHRvIHRoZSBDbGllbnRcbiAqIGlzIHZhbGlkIGZvciBvdXIgT3BlbnRyYWNpbmcgdXNlIGNhc2UuXG4gKiBAcGFyYW0ge29wZW50cmFjZXIuVHJhY2VyfSB0cmFjZXJcbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVUcmFjZXIodHJhY2VyKSB7XG4gIGlmICghdHJhY2VyKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCF0cmFjZXIuc2NvcGUgfHwgdHlwZW9mIHRyYWNlci5zY29wZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBzY29wZSA9IHRyYWNlci5zY29wZSgpO1xuXG4gIGlmICghc2NvcGUgfHwgIXNjb3BlLmFjdGl2ZSB8fCB0eXBlb2Ygc2NvcGUuYWN0aXZlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogVmFsaWRhdGUgdGhlIFNwYW4gb2JqZWN0IHByb3ZpZGVkXG4gKiBAcGFyYW0ge29wZW50cmFjZXIuU3Bhbn0gc3BhblxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZVNwYW4oc3Bhbikge1xuICBpZiAoIXNwYW4gfHwgIXNwYW4uY29udGV4dCB8fCB0eXBlb2Ygc3Bhbi5jb250ZXh0ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIHNwYW5Db250ZXh0ID0gc3Bhbi5jb250ZXh0KCk7XG5cbiAgaWYgKFxuICAgICFzcGFuQ29udGV4dCB8fFxuICAgICFzcGFuQ29udGV4dC50b1NwYW5JZCB8fFxuICAgICFzcGFuQ29udGV4dC50b1RyYWNlSWQgfHxcbiAgICB0eXBlb2Ygc3BhbkNvbnRleHQudG9TcGFuSWQgIT09ICdmdW5jdGlvbicgfHxcbiAgICB0eXBlb2Ygc3BhbkNvbnRleHQudG9UcmFjZUlkICE9PSAnZnVuY3Rpb24nXG4gICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJvbGxiYXI7XG4iLCIvKipcbiAqIERlZmF1bHQgdHJhY2luZyBvcHRpb25zXG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZW5hYmxlZDogZmFsc2UsXG4gIGVuZHBvaW50OiAnYXBpLnJvbGxiYXIuY29tL2FwaS8xL3Nlc3Npb24vJyxcbn1cbiIsIi8qKlxuICogR2VuZXJhdGUgYSByYW5kb20gaGV4YWRlY2ltYWwgSUQgb2Ygc3BlY2lmaWVkIGJ5dGUgbGVuZ3RoXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGJ5dGVzIC0gTnVtYmVyIG9mIGJ5dGVzIGZvciB0aGUgSUQgKGRlZmF1bHQ6IDE2KVxuICogQHJldHVybnMge3N0cmluZ30gLSBIZXhhZGVjaW1hbCBzdHJpbmcgcmVwcmVzZW50YXRpb25cbiAqL1xuZnVuY3Rpb24gZ2VuKGJ5dGVzID0gMTYpIHtcbiAgbGV0IHJhbmRvbUJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYnl0ZXMpO1xuICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKHJhbmRvbUJ5dGVzKTtcbiAgbGV0IHJhbmRIZXggPSBBcnJheS5mcm9tKHJhbmRvbUJ5dGVzLCAoYnl0ZSkgPT5cbiAgICBieXRlLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpLFxuICApLmpvaW4oJycpO1xuICByZXR1cm4gcmFuZEhleDtcbn1cblxuLyoqXG4gKiBUcmFjaW5nIGlkIGdlbmVyYXRpb24gdXRpbHNcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IGlkIGZyb20gJy4vaWQuanMnO1xuICpcbiAqIGNvbnN0IHNwYW5JZCA9IGlkLmdlbig4KTsgLy8gPT4gXCJhMWIyYzNkNGU1ZjYuLi5cIlxuICovXG5leHBvcnQgZGVmYXVsdCB7IGdlbiB9O1xuIiwidmFyIF8gPSByZXF1aXJlKCcuL3V0aWxpdHknKTtcblxuZnVuY3Rpb24gaXRlbVRvUGF5bG9hZChpdGVtLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgZGF0YSA9IGl0ZW0uZGF0YTtcblxuICBpZiAoaXRlbS5faXNVbmNhdWdodCkge1xuICAgIGRhdGEuX2lzVW5jYXVnaHQgPSB0cnVlO1xuICB9XG4gIGlmIChpdGVtLl9vcmlnaW5hbEFyZ3MpIHtcbiAgICBkYXRhLl9vcmlnaW5hbEFyZ3MgPSBpdGVtLl9vcmlnaW5hbEFyZ3M7XG4gIH1cbiAgY2FsbGJhY2sobnVsbCwgZGF0YSk7XG59XG5cbmZ1bmN0aW9uIGFkZFBheWxvYWRPcHRpb25zKGl0ZW0sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBwYXlsb2FkT3B0aW9ucyA9IG9wdGlvbnMucGF5bG9hZCB8fCB7fTtcbiAgaWYgKHBheWxvYWRPcHRpb25zLmJvZHkpIHtcbiAgICBkZWxldGUgcGF5bG9hZE9wdGlvbnMuYm9keTtcbiAgfVxuXG4gIGl0ZW0uZGF0YSA9IF8ubWVyZ2UoaXRlbS5kYXRhLCBwYXlsb2FkT3B0aW9ucyk7XG4gIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xufVxuXG5mdW5jdGlvbiBhZGRUZWxlbWV0cnlEYXRhKGl0ZW0sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIGlmIChpdGVtLnRlbGVtZXRyeUV2ZW50cykge1xuICAgIF8uc2V0KGl0ZW0sICdkYXRhLmJvZHkudGVsZW1ldHJ5JywgaXRlbS50ZWxlbWV0cnlFdmVudHMpO1xuICB9XG4gIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xufVxuXG5mdW5jdGlvbiBhZGRNZXNzYWdlV2l0aEVycm9yKGl0ZW0sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIGlmICghaXRlbS5tZXNzYWdlKSB7XG4gICAgY2FsbGJhY2sobnVsbCwgaXRlbSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciB0cmFjZVBhdGggPSAnZGF0YS5ib2R5LnRyYWNlX2NoYWluLjAnO1xuICB2YXIgdHJhY2UgPSBfLmdldChpdGVtLCB0cmFjZVBhdGgpO1xuICBpZiAoIXRyYWNlKSB7XG4gICAgdHJhY2VQYXRoID0gJ2RhdGEuYm9keS50cmFjZSc7XG4gICAgdHJhY2UgPSBfLmdldChpdGVtLCB0cmFjZVBhdGgpO1xuICB9XG4gIGlmICh0cmFjZSkge1xuICAgIGlmICghKHRyYWNlLmV4Y2VwdGlvbiAmJiB0cmFjZS5leGNlcHRpb24uZGVzY3JpcHRpb24pKSB7XG4gICAgICBfLnNldChpdGVtLCB0cmFjZVBhdGggKyAnLmV4Y2VwdGlvbi5kZXNjcmlwdGlvbicsIGl0ZW0ubWVzc2FnZSk7XG4gICAgICBjYWxsYmFjayhudWxsLCBpdGVtKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGV4dHJhID0gXy5nZXQoaXRlbSwgdHJhY2VQYXRoICsgJy5leHRyYScpIHx8IHt9O1xuICAgIHZhciBuZXdFeHRyYSA9IF8ubWVyZ2UoZXh0cmEsIHsgbWVzc2FnZTogaXRlbS5tZXNzYWdlIH0pO1xuICAgIF8uc2V0KGl0ZW0sIHRyYWNlUGF0aCArICcuZXh0cmEnLCBuZXdFeHRyYSk7XG4gIH1cbiAgY2FsbGJhY2sobnVsbCwgaXRlbSk7XG59XG5cbmZ1bmN0aW9uIHVzZXJUcmFuc2Zvcm0obG9nZ2VyKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaXRlbSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICB2YXIgbmV3SXRlbSA9IF8ubWVyZ2UoaXRlbSk7XG4gICAgdmFyIHJlc3BvbnNlID0gbnVsbDtcbiAgICB0cnkge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihvcHRpb25zLnRyYW5zZm9ybSkpIHtcbiAgICAgICAgcmVzcG9uc2UgPSBvcHRpb25zLnRyYW5zZm9ybShuZXdJdGVtLmRhdGEsIGl0ZW0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIG9wdGlvbnMudHJhbnNmb3JtID0gbnVsbDtcbiAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgJ0Vycm9yIHdoaWxlIGNhbGxpbmcgY3VzdG9tIHRyYW5zZm9ybSgpIGZ1bmN0aW9uLiBSZW1vdmluZyBjdXN0b20gdHJhbnNmb3JtKCkuJyxcbiAgICAgICAgZSxcbiAgICAgICk7XG4gICAgICBjYWxsYmFjayhudWxsLCBpdGVtKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKF8uaXNQcm9taXNlKHJlc3BvbnNlKSkge1xuICAgICAgcmVzcG9uc2UudGhlbihcbiAgICAgICAgZnVuY3Rpb24gKHByb21pc2VkSXRlbSkge1xuICAgICAgICAgIGlmIChwcm9taXNlZEl0ZW0pIHtcbiAgICAgICAgICAgIG5ld0l0ZW0uZGF0YSA9IHByb21pc2VkSXRlbTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgbmV3SXRlbSk7XG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBpdGVtKTtcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxiYWNrKG51bGwsIG5ld0l0ZW0pO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gYWRkQ29uZmlnVG9QYXlsb2FkKGl0ZW0sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIGlmICghb3B0aW9ucy5zZW5kQ29uZmlnKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xuICB9XG4gIHZhciBjb25maWdLZXkgPSAnX3JvbGxiYXJDb25maWcnO1xuICB2YXIgY3VzdG9tID0gXy5nZXQoaXRlbSwgJ2RhdGEuY3VzdG9tJykgfHwge307XG4gIGN1c3RvbVtjb25maWdLZXldID0gb3B0aW9ucztcbiAgaXRlbS5kYXRhLmN1c3RvbSA9IGN1c3RvbTtcbiAgY2FsbGJhY2sobnVsbCwgaXRlbSk7XG59XG5cbmZ1bmN0aW9uIGFkZEZ1bmN0aW9uT3B0aW9uKG9wdGlvbnMsIG5hbWUpIHtcbiAgaWYgKF8uaXNGdW5jdGlvbihvcHRpb25zW25hbWVdKSkge1xuICAgIG9wdGlvbnNbbmFtZV0gPSBvcHRpb25zW25hbWVdLnRvU3RyaW5nKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkQ29uZmlndXJlZE9wdGlvbnMoaXRlbSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdmFyIGNvbmZpZ3VyZWRPcHRpb25zID0gb3B0aW9ucy5fY29uZmlndXJlZE9wdGlvbnM7XG5cbiAgLy8gVGhlc2UgbXVzdCBiZSBzdHJpbmdpZmllZCBvciB0aGV5J2xsIGdldCBkcm9wcGVkIGR1cmluZyBzZXJpYWxpemF0aW9uLlxuICBhZGRGdW5jdGlvbk9wdGlvbihjb25maWd1cmVkT3B0aW9ucywgJ3RyYW5zZm9ybScpO1xuICBhZGRGdW5jdGlvbk9wdGlvbihjb25maWd1cmVkT3B0aW9ucywgJ2NoZWNrSWdub3JlJyk7XG4gIGFkZEZ1bmN0aW9uT3B0aW9uKGNvbmZpZ3VyZWRPcHRpb25zLCAnb25TZW5kQ2FsbGJhY2snKTtcblxuICBkZWxldGUgY29uZmlndXJlZE9wdGlvbnMuYWNjZXNzVG9rZW47XG4gIGl0ZW0uZGF0YS5ub3RpZmllci5jb25maWd1cmVkX29wdGlvbnMgPSBjb25maWd1cmVkT3B0aW9ucztcbiAgY2FsbGJhY2sobnVsbCwgaXRlbSk7XG59XG5cbmZ1bmN0aW9uIGFkZERpYWdub3N0aWNLZXlzKGl0ZW0sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBkaWFnbm9zdGljID0gXy5tZXJnZShcbiAgICBpdGVtLm5vdGlmaWVyLmNsaWVudC5ub3RpZmllci5kaWFnbm9zdGljLFxuICAgIGl0ZW0uZGlhZ25vc3RpYyxcbiAgKTtcblxuICBpZiAoXy5nZXQoaXRlbSwgJ2Vyci5faXNBbm9ueW1vdXMnKSkge1xuICAgIGRpYWdub3N0aWMuaXNfYW5vbnltb3VzID0gdHJ1ZTtcbiAgfVxuXG4gIGlmIChpdGVtLl9pc1VuY2F1Z2h0KSB7XG4gICAgZGlhZ25vc3RpYy5pc191bmNhdWdodCA9IGl0ZW0uX2lzVW5jYXVnaHQ7XG4gIH1cblxuICBpZiAoaXRlbS5lcnIpIHtcbiAgICB0cnkge1xuICAgICAgZGlhZ25vc3RpYy5yYXdfZXJyb3IgPSB7XG4gICAgICAgIG1lc3NhZ2U6IGl0ZW0uZXJyLm1lc3NhZ2UsXG4gICAgICAgIG5hbWU6IGl0ZW0uZXJyLm5hbWUsXG4gICAgICAgIGNvbnN0cnVjdG9yX25hbWU6IGl0ZW0uZXJyLmNvbnN0cnVjdG9yICYmIGl0ZW0uZXJyLmNvbnN0cnVjdG9yLm5hbWUsXG4gICAgICAgIGZpbGVuYW1lOiBpdGVtLmVyci5maWxlTmFtZSxcbiAgICAgICAgbGluZTogaXRlbS5lcnIubGluZU51bWJlcixcbiAgICAgICAgY29sdW1uOiBpdGVtLmVyci5jb2x1bW5OdW1iZXIsXG4gICAgICAgIHN0YWNrOiBpdGVtLmVyci5zdGFjayxcbiAgICAgIH07XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZGlhZ25vc3RpYy5yYXdfZXJyb3IgPSB7IGZhaWxlZDogU3RyaW5nKGUpIH07XG4gICAgfVxuICB9XG5cbiAgaXRlbS5kYXRhLm5vdGlmaWVyLmRpYWdub3N0aWMgPSBfLm1lcmdlKFxuICAgIGl0ZW0uZGF0YS5ub3RpZmllci5kaWFnbm9zdGljLFxuICAgIGRpYWdub3N0aWMsXG4gICk7XG4gIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXRlbVRvUGF5bG9hZDogaXRlbVRvUGF5bG9hZCxcbiAgYWRkUGF5bG9hZE9wdGlvbnM6IGFkZFBheWxvYWRPcHRpb25zLFxuICBhZGRUZWxlbWV0cnlEYXRhOiBhZGRUZWxlbWV0cnlEYXRhLFxuICBhZGRNZXNzYWdlV2l0aEVycm9yOiBhZGRNZXNzYWdlV2l0aEVycm9yLFxuICB1c2VyVHJhbnNmb3JtOiB1c2VyVHJhbnNmb3JtLFxuICBhZGRDb25maWdUb1BheWxvYWQ6IGFkZENvbmZpZ1RvUGF5bG9hZCxcbiAgYWRkQ29uZmlndXJlZE9wdGlvbnM6IGFkZENvbmZpZ3VyZWRPcHRpb25zLFxuICBhZGREaWFnbm9zdGljS2V5czogYWRkRGlhZ25vc3RpY0tleXMsXG59O1xuIiwidmFyIG1lcmdlID0gcmVxdWlyZSgnLi9tZXJnZScpO1xuXG52YXIgUm9sbGJhckpTT04gPSB7fTtcbmZ1bmN0aW9uIHNldHVwSlNPTihwb2x5ZmlsbEpTT04pIHtcbiAgaWYgKGlzRnVuY3Rpb24oUm9sbGJhckpTT04uc3RyaW5naWZ5KSAmJiBpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnBhcnNlKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChpc0RlZmluZWQoSlNPTikpIHtcbiAgICAvLyBJZiBwb2x5ZmlsbCBpcyBwcm92aWRlZCwgcHJlZmVyIGl0IG92ZXIgZXhpc3Rpbmcgbm9uLW5hdGl2ZSBzaGltcy5cbiAgICBpZiAocG9seWZpbGxKU09OKSB7XG4gICAgICBpZiAoaXNOYXRpdmVGdW5jdGlvbihKU09OLnN0cmluZ2lmeSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04uc3RyaW5naWZ5ID0gSlNPTi5zdHJpbmdpZnk7XG4gICAgICB9XG4gICAgICBpZiAoaXNOYXRpdmVGdW5jdGlvbihKU09OLnBhcnNlKSkge1xuICAgICAgICBSb2xsYmFySlNPTi5wYXJzZSA9IEpTT04ucGFyc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGVsc2UgYWNjZXB0IGFueSBpbnRlcmZhY2UgdGhhdCBpcyBwcmVzZW50LlxuICAgICAgaWYgKGlzRnVuY3Rpb24oSlNPTi5zdHJpbmdpZnkpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnN0cmluZ2lmeSA9IEpTT04uc3RyaW5naWZ5O1xuICAgICAgfVxuICAgICAgaWYgKGlzRnVuY3Rpb24oSlNPTi5wYXJzZSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04ucGFyc2UgPSBKU09OLnBhcnNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoIWlzRnVuY3Rpb24oUm9sbGJhckpTT04uc3RyaW5naWZ5KSB8fCAhaXNGdW5jdGlvbihSb2xsYmFySlNPTi5wYXJzZSkpIHtcbiAgICBwb2x5ZmlsbEpTT04gJiYgcG9seWZpbGxKU09OKFJvbGxiYXJKU09OKTtcbiAgfVxufVxuXG4vKlxuICogaXNUeXBlIC0gR2l2ZW4gYSBKYXZhc2NyaXB0IHZhbHVlIGFuZCBhIHN0cmluZywgcmV0dXJucyB0cnVlIGlmIHRoZSB0eXBlIG9mIHRoZSB2YWx1ZSBtYXRjaGVzIHRoZVxuICogZ2l2ZW4gc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB4IC0gYW55IHZhbHVlXG4gKiBAcGFyYW0gdCAtIGEgbG93ZXJjYXNlIHN0cmluZyBjb250YWluaW5nIG9uZSBvZiB0aGUgZm9sbG93aW5nIHR5cGUgbmFtZXM6XG4gKiAgICAtIHVuZGVmaW5lZFxuICogICAgLSBudWxsXG4gKiAgICAtIGVycm9yXG4gKiAgICAtIG51bWJlclxuICogICAgLSBib29sZWFuXG4gKiAgICAtIHN0cmluZ1xuICogICAgLSBzeW1ib2xcbiAqICAgIC0gZnVuY3Rpb25cbiAqICAgIC0gb2JqZWN0XG4gKiAgICAtIGFycmF5XG4gKiBAcmV0dXJucyB0cnVlIGlmIHggaXMgb2YgdHlwZSB0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNUeXBlKHgsIHQpIHtcbiAgcmV0dXJuIHQgPT09IHR5cGVOYW1lKHgpO1xufVxuXG4vKlxuICogdHlwZU5hbWUgLSBHaXZlbiBhIEphdmFzY3JpcHQgdmFsdWUsIHJldHVybnMgdGhlIHR5cGUgb2YgdGhlIG9iamVjdCBhcyBhIHN0cmluZ1xuICovXG5mdW5jdGlvbiB0eXBlTmFtZSh4KSB7XG4gIHZhciBuYW1lID0gdHlwZW9mIHg7XG4gIGlmIChuYW1lICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBuYW1lO1xuICB9XG4gIGlmICgheCkge1xuICAgIHJldHVybiAnbnVsbCc7XG4gIH1cbiAgaWYgKHggaW5zdGFuY2VvZiBFcnJvcikge1xuICAgIHJldHVybiAnZXJyb3InO1xuICB9XG4gIHJldHVybiB7fS50b1N0cmluZ1xuICAgIC5jYWxsKHgpXG4gICAgLm1hdGNoKC9cXHMoW2EtekEtWl0rKS8pWzFdXG4gICAgLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8qIGlzRnVuY3Rpb24gLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIGEgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0gZiAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBmIGlzIGEgZnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGYpIHtcbiAgcmV0dXJuIGlzVHlwZShmLCAnZnVuY3Rpb24nKTtcbn1cblxuLyogaXNOYXRpdmVGdW5jdGlvbiAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgYSBuYXRpdmUgSlMgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0gZiAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBmIGlzIGEgbmF0aXZlIEpTIGZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOYXRpdmVGdW5jdGlvbihmKSB7XG4gIHZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG4gIHZhciBmdW5jTWF0Y2hTdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmdcbiAgICAuY2FsbChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KVxuICAgIC5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gICAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpO1xuICB2YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgKyBmdW5jTWF0Y2hTdHJpbmcgKyAnJCcpO1xuICByZXR1cm4gaXNPYmplY3QoZikgJiYgcmVJc05hdGl2ZS50ZXN0KGYpO1xufVxuXG4vKiBpc09iamVjdCAtIENoZWNrcyBpZiB0aGUgYXJndW1lbnQgaXMgYW4gb2JqZWN0XG4gKlxuICogQHBhcmFtIHZhbHVlIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlzIHZhbHVlIGlzIGFuIG9iamVjdCBmdW5jdGlvbiBpcyBhbiBvYmplY3QpXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKiBpc1N0cmluZyAtIENoZWNrcyBpZiB0aGUgYXJndW1lbnQgaXMgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0gdmFsdWUgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgdmFsdWUgaXMgYSBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgdmFsdWUgaW5zdGFuY2VvZiBTdHJpbmc7XG59XG5cbi8qKlxuICogaXNGaW5pdGVOdW1iZXIgLSBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBhIGZpbml0ZSBudW1iZXJcbiAqXG4gKiBAcGFyYW0geyp9IG4gLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgdmFsdWUgaXMgYSBmaW5pdGUgbnVtYmVyXG4gKi9cbmZ1bmN0aW9uIGlzRmluaXRlTnVtYmVyKG4pIHtcbiAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZShuKTtcbn1cblxuLypcbiAqIGlzRGVmaW5lZCAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgbm90IGVxdWFsIHRvIHVuZGVmaW5lZFxuICpcbiAqIEBwYXJhbSB1IC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIHUgaXMgYW55dGhpbmcgb3RoZXIgdGhhbiB1bmRlZmluZWRcbiAqL1xuZnVuY3Rpb24gaXNEZWZpbmVkKHUpIHtcbiAgcmV0dXJuICFpc1R5cGUodSwgJ3VuZGVmaW5lZCcpO1xufVxuXG4vKlxuICogaXNJdGVyYWJsZSAtIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGNhbiBiZSBpdGVyYXRlZCwgZXNzZW50aWFsbHlcbiAqIHdoZXRoZXIgaXQgaXMgYW4gb2JqZWN0IG9yIGFuIGFycmF5LlxuICpcbiAqIEBwYXJhbSBpIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGkgaXMgYW4gb2JqZWN0IG9yIGFuIGFycmF5IGFzIGRldGVybWluZWQgYnkgYHR5cGVOYW1lYFxuICovXG5mdW5jdGlvbiBpc0l0ZXJhYmxlKGkpIHtcbiAgdmFyIHR5cGUgPSB0eXBlTmFtZShpKTtcbiAgcmV0dXJuIHR5cGUgPT09ICdvYmplY3QnIHx8IHR5cGUgPT09ICdhcnJheSc7XG59XG5cbi8qXG4gKiBpc0Vycm9yIC0gY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgb2YgYW4gZXJyb3IgdHlwZVxuICpcbiAqIEBwYXJhbSBlIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGUgaXMgYW4gZXJyb3JcbiAqL1xuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIC8vIERldGVjdCBib3RoIEVycm9yIGFuZCBGaXJlZm94IEV4Y2VwdGlvbiB0eXBlXG4gIHJldHVybiBpc1R5cGUoZSwgJ2Vycm9yJykgfHwgaXNUeXBlKGUsICdleGNlcHRpb24nKTtcbn1cblxuLyogaXNQcm9taXNlIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBhIHByb21pc2VcbiAqXG4gKiBAcGFyYW0gcCAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBmIGlzIGEgZnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1Byb21pc2UocCkge1xuICByZXR1cm4gaXNPYmplY3QocCkgJiYgaXNUeXBlKHAudGhlbiwgJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogaXNCcm93c2VyIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgdGhlIGNvZGUgaXMgcnVubmluZyBpbiBhIGJyb3dzZXJcbiAqXG4gKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBjb2RlIGlzIHJ1bm5pbmcgaW4gYSBicm93c2VyIGVudmlyb25tZW50XG4gKi9cbmZ1bmN0aW9uIGlzQnJvd3NlcigpIHtcbiAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xufVxuXG5mdW5jdGlvbiByZWRhY3QoKSB7XG4gIHJldHVybiAnKioqKioqKionO1xufVxuXG4vLyBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzg4MDk0NzIvMTEzODE5MVxuZnVuY3Rpb24gdXVpZDQoKSB7XG4gIHZhciBkID0gbm93KCk7XG4gIHZhciB1dWlkID0gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZShcbiAgICAvW3h5XS9nLFxuICAgIGZ1bmN0aW9uIChjKSB7XG4gICAgICB2YXIgciA9IChkICsgTWF0aC5yYW5kb20oKSAqIDE2KSAlIDE2IHwgMDtcbiAgICAgIGQgPSBNYXRoLmZsb29yKGQgLyAxNik7XG4gICAgICByZXR1cm4gKGMgPT09ICd4JyA/IHIgOiAociAmIDB4NykgfCAweDgpLnRvU3RyaW5nKDE2KTtcbiAgICB9LFxuICApO1xuICByZXR1cm4gdXVpZDtcbn1cblxudmFyIExFVkVMUyA9IHtcbiAgZGVidWc6IDAsXG4gIGluZm86IDEsXG4gIHdhcm5pbmc6IDIsXG4gIGVycm9yOiAzLFxuICBjcml0aWNhbDogNCxcbn07XG5cbmZ1bmN0aW9uIHNhbml0aXplVXJsKHVybCkge1xuICB2YXIgYmFzZVVybFBhcnRzID0gcGFyc2VVcmkodXJsKTtcbiAgaWYgKCFiYXNlVXJsUGFydHMpIHtcbiAgICByZXR1cm4gJyh1bmtub3duKSc7XG4gIH1cblxuICAvLyByZW1vdmUgYSB0cmFpbGluZyAjIGlmIHRoZXJlIGlzIG5vIGFuY2hvclxuICBpZiAoYmFzZVVybFBhcnRzLmFuY2hvciA9PT0gJycpIHtcbiAgICBiYXNlVXJsUGFydHMuc291cmNlID0gYmFzZVVybFBhcnRzLnNvdXJjZS5yZXBsYWNlKCcjJywgJycpO1xuICB9XG5cbiAgdXJsID0gYmFzZVVybFBhcnRzLnNvdXJjZS5yZXBsYWNlKCc/JyArIGJhc2VVcmxQYXJ0cy5xdWVyeSwgJycpO1xuICByZXR1cm4gdXJsO1xufVxuXG52YXIgcGFyc2VVcmlPcHRpb25zID0ge1xuICBzdHJpY3RNb2RlOiBmYWxzZSxcbiAga2V5OiBbXG4gICAgJ3NvdXJjZScsXG4gICAgJ3Byb3RvY29sJyxcbiAgICAnYXV0aG9yaXR5JyxcbiAgICAndXNlckluZm8nLFxuICAgICd1c2VyJyxcbiAgICAncGFzc3dvcmQnLFxuICAgICdob3N0JyxcbiAgICAncG9ydCcsXG4gICAgJ3JlbGF0aXZlJyxcbiAgICAncGF0aCcsXG4gICAgJ2RpcmVjdG9yeScsXG4gICAgJ2ZpbGUnLFxuICAgICdxdWVyeScsXG4gICAgJ2FuY2hvcicsXG4gIF0sXG4gIHE6IHtcbiAgICBuYW1lOiAncXVlcnlLZXknLFxuICAgIHBhcnNlcjogLyg/Ol58JikoW14mPV0qKT0/KFteJl0qKS9nLFxuICB9LFxuICBwYXJzZXI6IHtcbiAgICBzdHJpY3Q6XG4gICAgICAvXig/OihbXjpcXC8/I10rKTopPyg/OlxcL1xcLygoPzooKFteOkBdKikoPzo6KFteOkBdKikpPyk/QCk/KFteOlxcLz8jXSopKD86OihcXGQqKSk/KSk/KCgoKD86W14/I1xcL10qXFwvKSopKFtePyNdKikpKD86XFw/KFteI10qKSk/KD86IyguKikpPykvLFxuICAgIGxvb3NlOlxuICAgICAgL14oPzooPyFbXjpAXSs6W146QFxcL10qQCkoW146XFwvPyMuXSspOik/KD86XFwvXFwvKT8oKD86KChbXjpAXSopKD86OihbXjpAXSopKT8pP0ApPyhbXjpcXC8/I10qKSg/OjooXFxkKikpPykoKChcXC8oPzpbXj8jXSg/IVtePyNcXC9dKlxcLltePyNcXC8uXSsoPzpbPyNdfCQpKSkqXFwvPyk/KFtePyNcXC9dKikpKD86XFw/KFteI10qKSk/KD86IyguKikpPykvLFxuICB9LFxufTtcblxuZnVuY3Rpb24gcGFyc2VVcmkoc3RyKSB7XG4gIGlmICghaXNUeXBlKHN0ciwgJ3N0cmluZycpKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHZhciBvID0gcGFyc2VVcmlPcHRpb25zO1xuICB2YXIgbSA9IG8ucGFyc2VyW28uc3RyaWN0TW9kZSA/ICdzdHJpY3QnIDogJ2xvb3NlJ10uZXhlYyhzdHIpO1xuICB2YXIgdXJpID0ge307XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBvLmtleS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICB1cmlbby5rZXlbaV1dID0gbVtpXSB8fCAnJztcbiAgfVxuXG4gIHVyaVtvLnEubmFtZV0gPSB7fTtcbiAgdXJpW28ua2V5WzEyXV0ucmVwbGFjZShvLnEucGFyc2VyLCBmdW5jdGlvbiAoJDAsICQxLCAkMikge1xuICAgIGlmICgkMSkge1xuICAgICAgdXJpW28ucS5uYW1lXVskMV0gPSAkMjtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB1cmk7XG59XG5cbmZ1bmN0aW9uIGFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoKGFjY2Vzc1Rva2VuLCBvcHRpb25zLCBwYXJhbXMpIHtcbiAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICBwYXJhbXMuYWNjZXNzX3Rva2VuID0gYWNjZXNzVG9rZW47XG4gIHZhciBwYXJhbXNBcnJheSA9IFtdO1xuICB2YXIgaztcbiAgZm9yIChrIGluIHBhcmFtcykge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyYW1zLCBrKSkge1xuICAgICAgcGFyYW1zQXJyYXkucHVzaChbaywgcGFyYW1zW2tdXS5qb2luKCc9JykpO1xuICAgIH1cbiAgfVxuICB2YXIgcXVlcnkgPSAnPycgKyBwYXJhbXNBcnJheS5zb3J0KCkuam9pbignJicpO1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBvcHRpb25zLnBhdGggPSBvcHRpb25zLnBhdGggfHwgJyc7XG4gIHZhciBxcyA9IG9wdGlvbnMucGF0aC5pbmRleE9mKCc/Jyk7XG4gIHZhciBoID0gb3B0aW9ucy5wYXRoLmluZGV4T2YoJyMnKTtcbiAgdmFyIHA7XG4gIGlmIChxcyAhPT0gLTEgJiYgKGggPT09IC0xIHx8IGggPiBxcykpIHtcbiAgICBwID0gb3B0aW9ucy5wYXRoO1xuICAgIG9wdGlvbnMucGF0aCA9IHAuc3Vic3RyaW5nKDAsIHFzKSArIHF1ZXJ5ICsgJyYnICsgcC5zdWJzdHJpbmcocXMgKyAxKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoaCAhPT0gLTEpIHtcbiAgICAgIHAgPSBvcHRpb25zLnBhdGg7XG4gICAgICBvcHRpb25zLnBhdGggPSBwLnN1YnN0cmluZygwLCBoKSArIHF1ZXJ5ICsgcC5zdWJzdHJpbmcoaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMucGF0aCA9IG9wdGlvbnMucGF0aCArIHF1ZXJ5O1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBmb3JtYXRVcmwodSwgcHJvdG9jb2wpIHtcbiAgcHJvdG9jb2wgPSBwcm90b2NvbCB8fCB1LnByb3RvY29sO1xuICBpZiAoIXByb3RvY29sICYmIHUucG9ydCkge1xuICAgIGlmICh1LnBvcnQgPT09IDgwKSB7XG4gICAgICBwcm90b2NvbCA9ICdodHRwOic7XG4gICAgfSBlbHNlIGlmICh1LnBvcnQgPT09IDQ0Mykge1xuICAgICAgcHJvdG9jb2wgPSAnaHR0cHM6JztcbiAgICB9XG4gIH1cbiAgcHJvdG9jb2wgPSBwcm90b2NvbCB8fCAnaHR0cHM6JztcblxuICBpZiAoIXUuaG9zdG5hbWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2YXIgcmVzdWx0ID0gcHJvdG9jb2wgKyAnLy8nICsgdS5ob3N0bmFtZTtcbiAgaWYgKHUucG9ydCkge1xuICAgIHJlc3VsdCA9IHJlc3VsdCArICc6JyArIHUucG9ydDtcbiAgfVxuICBpZiAodS5wYXRoKSB7XG4gICAgcmVzdWx0ID0gcmVzdWx0ICsgdS5wYXRoO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeShvYmosIGJhY2t1cCkge1xuICB2YXIgdmFsdWUsIGVycm9yO1xuICB0cnkge1xuICAgIHZhbHVlID0gUm9sbGJhckpTT04uc3RyaW5naWZ5KG9iaik7XG4gIH0gY2F0Y2ggKGpzb25FcnJvcikge1xuICAgIGlmIChiYWNrdXAgJiYgaXNGdW5jdGlvbihiYWNrdXApKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IGJhY2t1cChvYmopO1xuICAgICAgfSBjYXRjaCAoYmFja3VwRXJyb3IpIHtcbiAgICAgICAgZXJyb3IgPSBiYWNrdXBFcnJvcjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZXJyb3IgPSBqc29uRXJyb3I7XG4gICAgfVxuICB9XG4gIHJldHVybiB7IGVycm9yOiBlcnJvciwgdmFsdWU6IHZhbHVlIH07XG59XG5cbmZ1bmN0aW9uIG1heEJ5dGVTaXplKHN0cmluZykge1xuICAvLyBUaGUgdHJhbnNwb3J0IHdpbGwgdXNlIHV0Zi04LCBzbyBhc3N1bWUgdXRmLTggZW5jb2RpbmcuXG4gIC8vXG4gIC8vIFRoaXMgbWluaW1hbCBpbXBsZW1lbnRhdGlvbiB3aWxsIGFjY3VyYXRlbHkgY291bnQgYnl0ZXMgZm9yIGFsbCBVQ1MtMiBhbmRcbiAgLy8gc2luZ2xlIGNvZGUgcG9pbnQgVVRGLTE2LiBJZiBwcmVzZW50ZWQgd2l0aCBtdWx0aSBjb2RlIHBvaW50IFVURi0xNixcbiAgLy8gd2hpY2ggc2hvdWxkIGJlIHJhcmUsIGl0IHdpbGwgc2FmZWx5IG92ZXJjb3VudCwgbm90IHVuZGVyY291bnQuXG4gIC8vXG4gIC8vIFdoaWxlIHJvYnVzdCB1dGYtOCBlbmNvZGVycyBleGlzdCwgdGhpcyBpcyBmYXIgc21hbGxlciBhbmQgZmFyIG1vcmUgcGVyZm9ybWFudC5cbiAgLy8gRm9yIHF1aWNrbHkgY291bnRpbmcgcGF5bG9hZCBzaXplIGZvciB0cnVuY2F0aW9uLCBzbWFsbGVyIGlzIGJldHRlci5cblxuICB2YXIgY291bnQgPSAwO1xuICB2YXIgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGNvZGUgPSBzdHJpbmcuY2hhckNvZGVBdChpKTtcbiAgICBpZiAoY29kZSA8IDEyOCkge1xuICAgICAgLy8gdXAgdG8gNyBiaXRzXG4gICAgICBjb3VudCA9IGNvdW50ICsgMTtcbiAgICB9IGVsc2UgaWYgKGNvZGUgPCAyMDQ4KSB7XG4gICAgICAvLyB1cCB0byAxMSBiaXRzXG4gICAgICBjb3VudCA9IGNvdW50ICsgMjtcbiAgICB9IGVsc2UgaWYgKGNvZGUgPCA2NTUzNikge1xuICAgICAgLy8gdXAgdG8gMTYgYml0c1xuICAgICAgY291bnQgPSBjb3VudCArIDM7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvdW50O1xufVxuXG5mdW5jdGlvbiBqc29uUGFyc2Uocykge1xuICB2YXIgdmFsdWUsIGVycm9yO1xuICB0cnkge1xuICAgIHZhbHVlID0gUm9sbGJhckpTT04ucGFyc2Uocyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBlcnJvciA9IGU7XG4gIH1cbiAgcmV0dXJuIHsgZXJyb3I6IGVycm9yLCB2YWx1ZTogdmFsdWUgfTtcbn1cblxuZnVuY3Rpb24gbWFrZVVuaGFuZGxlZFN0YWNrSW5mbyhcbiAgbWVzc2FnZSxcbiAgdXJsLFxuICBsaW5lbm8sXG4gIGNvbG5vLFxuICBlcnJvcixcbiAgbW9kZSxcbiAgYmFja3VwTWVzc2FnZSxcbiAgZXJyb3JQYXJzZXIsXG4pIHtcbiAgdmFyIGxvY2F0aW9uID0ge1xuICAgIHVybDogdXJsIHx8ICcnLFxuICAgIGxpbmU6IGxpbmVubyxcbiAgICBjb2x1bW46IGNvbG5vLFxuICB9O1xuICBsb2NhdGlvbi5mdW5jID0gZXJyb3JQYXJzZXIuZ3Vlc3NGdW5jdGlvbk5hbWUobG9jYXRpb24udXJsLCBsb2NhdGlvbi5saW5lKTtcbiAgbG9jYXRpb24uY29udGV4dCA9IGVycm9yUGFyc2VyLmdhdGhlckNvbnRleHQobG9jYXRpb24udXJsLCBsb2NhdGlvbi5saW5lKTtcbiAgdmFyIGhyZWYgPVxuICAgIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICBkb2N1bWVudCAmJlxuICAgIGRvY3VtZW50LmxvY2F0aW9uICYmXG4gICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZjtcbiAgdmFyIHVzZXJhZ2VudCA9XG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB3aW5kb3cgJiZcbiAgICB3aW5kb3cubmF2aWdhdG9yICYmXG4gICAgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gIHJldHVybiB7XG4gICAgbW9kZTogbW9kZSxcbiAgICBtZXNzYWdlOiBlcnJvciA/IFN0cmluZyhlcnJvcikgOiBtZXNzYWdlIHx8IGJhY2t1cE1lc3NhZ2UsXG4gICAgdXJsOiBocmVmLFxuICAgIHN0YWNrOiBbbG9jYXRpb25dLFxuICAgIHVzZXJhZ2VudDogdXNlcmFnZW50LFxuICB9O1xufVxuXG5mdW5jdGlvbiB3cmFwQ2FsbGJhY2sobG9nZ2VyLCBmKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgdHJ5IHtcbiAgICAgIGYoZXJyLCByZXNwKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoZSk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBub25DaXJjdWxhckNsb25lKG9iaikge1xuICB2YXIgc2VlbiA9IFtvYmpdO1xuXG4gIGZ1bmN0aW9uIGNsb25lKG9iaiwgc2Vlbikge1xuICAgIHZhciB2YWx1ZSxcbiAgICAgIG5hbWUsXG4gICAgICBuZXdTZWVuLFxuICAgICAgcmVzdWx0ID0ge307XG5cbiAgICB0cnkge1xuICAgICAgZm9yIChuYW1lIGluIG9iaikge1xuICAgICAgICB2YWx1ZSA9IG9ialtuYW1lXTtcblxuICAgICAgICBpZiAodmFsdWUgJiYgKGlzVHlwZSh2YWx1ZSwgJ29iamVjdCcpIHx8IGlzVHlwZSh2YWx1ZSwgJ2FycmF5JykpKSB7XG4gICAgICAgICAgaWYgKHNlZW4uaW5jbHVkZXModmFsdWUpKSB7XG4gICAgICAgICAgICByZXN1bHRbbmFtZV0gPSAnUmVtb3ZlZCBjaXJjdWxhciByZWZlcmVuY2U6ICcgKyB0eXBlTmFtZSh2YWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld1NlZW4gPSBzZWVuLnNsaWNlKCk7XG4gICAgICAgICAgICBuZXdTZWVuLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgcmVzdWx0W25hbWVdID0gY2xvbmUodmFsdWUsIG5ld1NlZW4pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdFtuYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlc3VsdCA9ICdGYWlsZWQgY2xvbmluZyBjdXN0b20gZGF0YTogJyArIGUubWVzc2FnZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICByZXR1cm4gY2xvbmUob2JqLCBzZWVuKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlSXRlbShhcmdzLCBsb2dnZXIsIG5vdGlmaWVyLCByZXF1ZXN0S2V5cywgbGFtYmRhQ29udGV4dCkge1xuICB2YXIgbWVzc2FnZSwgZXJyLCBjdXN0b20sIGNhbGxiYWNrLCByZXF1ZXN0O1xuICB2YXIgYXJnO1xuICB2YXIgZXh0cmFBcmdzID0gW107XG4gIHZhciBkaWFnbm9zdGljID0ge307XG4gIHZhciBhcmdUeXBlcyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJncy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBhcmcgPSBhcmdzW2ldO1xuXG4gICAgdmFyIHR5cCA9IHR5cGVOYW1lKGFyZyk7XG4gICAgYXJnVHlwZXMucHVzaCh0eXApO1xuICAgIHN3aXRjaCAodHlwKSB7XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIG1lc3NhZ2UgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKG1lc3NhZ2UgPSBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgY2FsbGJhY2sgPSB3cmFwQ2FsbGJhY2sobG9nZ2VyLCBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICBleHRyYUFyZ3MucHVzaChhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgIGNhc2UgJ2RvbWV4Y2VwdGlvbic6XG4gICAgICBjYXNlICdleGNlcHRpb24nOiAvLyBGaXJlZm94IEV4Y2VwdGlvbiB0eXBlXG4gICAgICAgIGVyciA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoZXJyID0gYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgY2FzZSAnYXJyYXknOlxuICAgICAgICBpZiAoXG4gICAgICAgICAgYXJnIGluc3RhbmNlb2YgRXJyb3IgfHxcbiAgICAgICAgICAodHlwZW9mIERPTUV4Y2VwdGlvbiAhPT0gJ3VuZGVmaW5lZCcgJiYgYXJnIGluc3RhbmNlb2YgRE9NRXhjZXB0aW9uKVxuICAgICAgICApIHtcbiAgICAgICAgICBlcnIgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGVyciA9IGFyZyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlcXVlc3RLZXlzICYmIHR5cCA9PT0gJ29iamVjdCcgJiYgIXJlcXVlc3QpIHtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMCwgbGVuID0gcmVxdWVzdEtleXMubGVuZ3RoOyBqIDwgbGVuOyArK2opIHtcbiAgICAgICAgICAgIGlmIChhcmdbcmVxdWVzdEtleXNbal1dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgcmVxdWVzdCA9IGFyZztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXF1ZXN0KSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY3VzdG9tID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChjdXN0b20gPSBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChcbiAgICAgICAgICBhcmcgaW5zdGFuY2VvZiBFcnJvciB8fFxuICAgICAgICAgICh0eXBlb2YgRE9NRXhjZXB0aW9uICE9PSAndW5kZWZpbmVkJyAmJiBhcmcgaW5zdGFuY2VvZiBET01FeGNlcHRpb24pXG4gICAgICAgICkge1xuICAgICAgICAgIGVyciA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoZXJyID0gYXJnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBleHRyYUFyZ3MucHVzaChhcmcpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIGN1c3RvbSBpcyBhbiBhcnJheSB0aGlzIHR1cm5zIGl0IGludG8gYW4gb2JqZWN0IHdpdGggaW50ZWdlciBrZXlzXG4gIGlmIChjdXN0b20pIGN1c3RvbSA9IG5vbkNpcmN1bGFyQ2xvbmUoY3VzdG9tKTtcblxuICBpZiAoZXh0cmFBcmdzLmxlbmd0aCA+IDApIHtcbiAgICBpZiAoIWN1c3RvbSkgY3VzdG9tID0gbm9uQ2lyY3VsYXJDbG9uZSh7fSk7XG4gICAgY3VzdG9tLmV4dHJhQXJncyA9IG5vbkNpcmN1bGFyQ2xvbmUoZXh0cmFBcmdzKTtcbiAgfVxuXG4gIHZhciBpdGVtID0ge1xuICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgZXJyOiBlcnIsXG4gICAgY3VzdG9tOiBjdXN0b20sXG4gICAgdGltZXN0YW1wOiBub3coKSxcbiAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgbm90aWZpZXI6IG5vdGlmaWVyLFxuICAgIGRpYWdub3N0aWM6IGRpYWdub3N0aWMsXG4gICAgdXVpZDogdXVpZDQoKSxcbiAgfTtcblxuICBpdGVtLmRhdGEgPSBpdGVtLmRhdGEgfHwge307XG5cbiAgc2V0Q3VzdG9tSXRlbUtleXMoaXRlbSwgY3VzdG9tKTtcblxuICBpZiAocmVxdWVzdEtleXMgJiYgcmVxdWVzdCkge1xuICAgIGl0ZW0ucmVxdWVzdCA9IHJlcXVlc3Q7XG4gIH1cbiAgaWYgKGxhbWJkYUNvbnRleHQpIHtcbiAgICBpdGVtLmxhbWJkYUNvbnRleHQgPSBsYW1iZGFDb250ZXh0O1xuICB9XG4gIGl0ZW0uX29yaWdpbmFsQXJncyA9IGFyZ3M7XG4gIGl0ZW0uZGlhZ25vc3RpYy5vcmlnaW5hbF9hcmdfdHlwZXMgPSBhcmdUeXBlcztcbiAgcmV0dXJuIGl0ZW07XG59XG5cbmZ1bmN0aW9uIHNldEN1c3RvbUl0ZW1LZXlzKGl0ZW0sIGN1c3RvbSkge1xuICBpZiAoY3VzdG9tICYmIGN1c3RvbS5sZXZlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaXRlbS5sZXZlbCA9IGN1c3RvbS5sZXZlbDtcbiAgICBkZWxldGUgY3VzdG9tLmxldmVsO1xuICB9XG4gIGlmIChjdXN0b20gJiYgY3VzdG9tLnNraXBGcmFtZXMgIT09IHVuZGVmaW5lZCkge1xuICAgIGl0ZW0uc2tpcEZyYW1lcyA9IGN1c3RvbS5za2lwRnJhbWVzO1xuICAgIGRlbGV0ZSBjdXN0b20uc2tpcEZyYW1lcztcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRFcnJvckNvbnRleHQoaXRlbSwgZXJyb3JzKSB7XG4gIHZhciBjdXN0b20gPSBpdGVtLmRhdGEuY3VzdG9tIHx8IHt9O1xuICB2YXIgY29udGV4dEFkZGVkID0gZmFsc2U7XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVycm9ycy5sZW5ndGg7ICsraSkge1xuICAgICAgaWYgKGVycm9yc1tpXS5oYXNPd25Qcm9wZXJ0eSgncm9sbGJhckNvbnRleHQnKSkge1xuICAgICAgICBjdXN0b20gPSBtZXJnZShjdXN0b20sIG5vbkNpcmN1bGFyQ2xvbmUoZXJyb3JzW2ldLnJvbGxiYXJDb250ZXh0KSk7XG4gICAgICAgIGNvbnRleHRBZGRlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXZvaWQgYWRkaW5nIGFuIGVtcHR5IG9iamVjdCB0byB0aGUgZGF0YS5cbiAgICBpZiAoY29udGV4dEFkZGVkKSB7XG4gICAgICBpdGVtLmRhdGEuY3VzdG9tID0gY3VzdG9tO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGl0ZW0uZGlhZ25vc3RpYy5lcnJvcl9jb250ZXh0ID0gJ0ZhaWxlZDogJyArIGUubWVzc2FnZTtcbiAgfVxufVxuXG52YXIgVEVMRU1FVFJZX1RZUEVTID0gW1xuICAnbG9nJyxcbiAgJ25ldHdvcmsnLFxuICAnZG9tJyxcbiAgJ25hdmlnYXRpb24nLFxuICAnZXJyb3InLFxuICAnbWFudWFsJyxcbl07XG52YXIgVEVMRU1FVFJZX0xFVkVMUyA9IFsnY3JpdGljYWwnLCAnZXJyb3InLCAnd2FybmluZycsICdpbmZvJywgJ2RlYnVnJ107XG5cbmZ1bmN0aW9uIGFycmF5SW5jbHVkZXMoYXJyLCB2YWwpIHtcbiAgZm9yICh2YXIgayA9IDA7IGsgPCBhcnIubGVuZ3RoOyArK2spIHtcbiAgICBpZiAoYXJyW2tdID09PSB2YWwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVGVsZW1ldHJ5RXZlbnQoYXJncykge1xuICB2YXIgdHlwZSwgbWV0YWRhdGEsIGxldmVsO1xuICB2YXIgYXJnO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJncy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBhcmcgPSBhcmdzW2ldO1xuXG4gICAgdmFyIHR5cCA9IHR5cGVOYW1lKGFyZyk7XG4gICAgc3dpdGNoICh0eXApIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIGlmICghdHlwZSAmJiBhcnJheUluY2x1ZGVzKFRFTEVNRVRSWV9UWVBFUywgYXJnKSkge1xuICAgICAgICAgIHR5cGUgPSBhcmc7XG4gICAgICAgIH0gZWxzZSBpZiAoIWxldmVsICYmIGFycmF5SW5jbHVkZXMoVEVMRU1FVFJZX0xFVkVMUywgYXJnKSkge1xuICAgICAgICAgIGxldmVsID0gYXJnO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgbWV0YWRhdGEgPSBhcmc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHZhciBldmVudCA9IHtcbiAgICB0eXBlOiB0eXBlIHx8ICdtYW51YWwnLFxuICAgIG1ldGFkYXRhOiBtZXRhZGF0YSB8fCB7fSxcbiAgICBsZXZlbDogbGV2ZWwsXG4gIH07XG5cbiAgcmV0dXJuIGV2ZW50O1xufVxuXG5mdW5jdGlvbiBhZGRJdGVtQXR0cmlidXRlcyhpdGVtLCBhdHRyaWJ1dGVzKSB7XG4gIGl0ZW0uZGF0YS5hdHRyaWJ1dGVzID0gaXRlbS5kYXRhLmF0dHJpYnV0ZXMgfHwgW107XG4gIGlmIChhdHRyaWJ1dGVzKSB7XG4gICAgaXRlbS5kYXRhLmF0dHJpYnV0ZXMucHVzaCguLi5hdHRyaWJ1dGVzKTtcbiAgfVxufVxuXG4vKlxuICogZ2V0IC0gZ2l2ZW4gYW4gb2JqL2FycmF5IGFuZCBhIGtleXBhdGgsIHJldHVybiB0aGUgdmFsdWUgYXQgdGhhdCBrZXlwYXRoIG9yXG4gKiAgICAgICB1bmRlZmluZWQgaWYgbm90IHBvc3NpYmxlLlxuICpcbiAqIEBwYXJhbSBvYmogLSBhbiBvYmplY3Qgb3IgYXJyYXlcbiAqIEBwYXJhbSBwYXRoIC0gYSBzdHJpbmcgb2Yga2V5cyBzZXBhcmF0ZWQgYnkgJy4nIHN1Y2ggYXMgJ3BsdWdpbi5qcXVlcnkuMC5tZXNzYWdlJ1xuICogICAgd2hpY2ggd291bGQgY29ycmVzcG9uZCB0byA0MiBpbiBge3BsdWdpbjoge2pxdWVyeTogW3ttZXNzYWdlOiA0Mn1dfX1gXG4gKi9cbmZ1bmN0aW9uIGdldChvYmosIHBhdGgpIHtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHZhciBrZXlzID0gcGF0aC5zcGxpdCgnLicpO1xuICB2YXIgcmVzdWx0ID0gb2JqO1xuICB0cnkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBrZXlzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICByZXN1bHQgPSByZXN1bHRba2V5c1tpXV07XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgcmVzdWx0ID0gdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHNldChvYmosIHBhdGgsIHZhbHVlKSB7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBrZXlzID0gcGF0aC5zcGxpdCgnLicpO1xuICB2YXIgbGVuID0ga2V5cy5sZW5ndGg7XG4gIGlmIChsZW4gPCAxKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChsZW4gPT09IDEpIHtcbiAgICBvYmpba2V5c1swXV0gPSB2YWx1ZTtcbiAgICByZXR1cm47XG4gIH1cbiAgdHJ5IHtcbiAgICB2YXIgdGVtcCA9IG9ialtrZXlzWzBdXSB8fCB7fTtcbiAgICB2YXIgcmVwbGFjZW1lbnQgPSB0ZW1wO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbGVuIC0gMTsgKytpKSB7XG4gICAgICB0ZW1wW2tleXNbaV1dID0gdGVtcFtrZXlzW2ldXSB8fCB7fTtcbiAgICAgIHRlbXAgPSB0ZW1wW2tleXNbaV1dO1xuICAgIH1cbiAgICB0ZW1wW2tleXNbbGVuIC0gMV1dID0gdmFsdWU7XG4gICAgb2JqW2tleXNbMF1dID0gcmVwbGFjZW1lbnQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm47XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0QXJnc0FzU3RyaW5nKGFyZ3MpIHtcbiAgdmFyIGksIGxlbiwgYXJnO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAoaSA9IDAsIGxlbiA9IGFyZ3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBhcmcgPSBhcmdzW2ldO1xuICAgIHN3aXRjaCAodHlwZU5hbWUoYXJnKSkge1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgYXJnID0gc3RyaW5naWZ5KGFyZyk7XG4gICAgICAgIGFyZyA9IGFyZy5lcnJvciB8fCBhcmcudmFsdWU7XG4gICAgICAgIGlmIChhcmcubGVuZ3RoID4gNTAwKSB7XG4gICAgICAgICAgYXJnID0gYXJnLnN1YnN0cigwLCA0OTcpICsgJy4uLic7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdudWxsJzpcbiAgICAgICAgYXJnID0gJ251bGwnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgIGFyZyA9ICd1bmRlZmluZWQnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N5bWJvbCc6XG4gICAgICAgIGFyZyA9IGFyZy50b1N0cmluZygpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmVzdWx0LnB1c2goYXJnKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0LmpvaW4oJyAnKTtcbn1cblxuZnVuY3Rpb24gbm93KCkge1xuICBpZiAoRGF0ZS5ub3cpIHtcbiAgICByZXR1cm4gK0RhdGUubm93KCk7XG4gIH1cbiAgcmV0dXJuICtuZXcgRGF0ZSgpO1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJJcChyZXF1ZXN0RGF0YSwgY2FwdHVyZUlwKSB7XG4gIGlmICghcmVxdWVzdERhdGEgfHwgIXJlcXVlc3REYXRhWyd1c2VyX2lwJ10gfHwgY2FwdHVyZUlwID09PSB0cnVlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuZXdJcCA9IHJlcXVlc3REYXRhWyd1c2VyX2lwJ107XG4gIGlmICghY2FwdHVyZUlwKSB7XG4gICAgbmV3SXAgPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIHRyeSB7XG4gICAgICB2YXIgcGFydHM7XG4gICAgICBpZiAobmV3SXAuaW5kZXhPZignLicpICE9PSAtMSkge1xuICAgICAgICBwYXJ0cyA9IG5ld0lwLnNwbGl0KCcuJyk7XG4gICAgICAgIHBhcnRzLnBvcCgpO1xuICAgICAgICBwYXJ0cy5wdXNoKCcwJyk7XG4gICAgICAgIG5ld0lwID0gcGFydHMuam9pbignLicpO1xuICAgICAgfSBlbHNlIGlmIChuZXdJcC5pbmRleE9mKCc6JykgIT09IC0xKSB7XG4gICAgICAgIHBhcnRzID0gbmV3SXAuc3BsaXQoJzonKTtcbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICB2YXIgYmVnaW5uaW5nID0gcGFydHMuc2xpY2UoMCwgMyk7XG4gICAgICAgICAgdmFyIHNsYXNoSWR4ID0gYmVnaW5uaW5nWzJdLmluZGV4T2YoJy8nKTtcbiAgICAgICAgICBpZiAoc2xhc2hJZHggIT09IC0xKSB7XG4gICAgICAgICAgICBiZWdpbm5pbmdbMl0gPSBiZWdpbm5pbmdbMl0uc3Vic3RyaW5nKDAsIHNsYXNoSWR4KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHRlcm1pbmFsID0gJzAwMDA6MDAwMDowMDAwOjAwMDA6MDAwMCc7XG4gICAgICAgICAgbmV3SXAgPSBiZWdpbm5pbmcuY29uY2F0KHRlcm1pbmFsKS5qb2luKCc6Jyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0lwID0gbnVsbDtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBuZXdJcCA9IG51bGw7XG4gICAgfVxuICB9XG4gIHJlcXVlc3REYXRhWyd1c2VyX2lwJ10gPSBuZXdJcDtcbn1cblxuZnVuY3Rpb24gaGFuZGxlT3B0aW9ucyhjdXJyZW50LCBpbnB1dCwgcGF5bG9hZCwgbG9nZ2VyKSB7XG4gIHZhciByZXN1bHQgPSBtZXJnZShjdXJyZW50LCBpbnB1dCwgcGF5bG9hZCk7XG4gIHJlc3VsdCA9IHVwZGF0ZURlcHJlY2F0ZWRPcHRpb25zKHJlc3VsdCwgbG9nZ2VyKTtcbiAgaWYgKCFpbnB1dCB8fCBpbnB1dC5vdmVyd3JpdGVTY3J1YkZpZWxkcykge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgaWYgKGlucHV0LnNjcnViRmllbGRzKSB7XG4gICAgcmVzdWx0LnNjcnViRmllbGRzID0gKGN1cnJlbnQuc2NydWJGaWVsZHMgfHwgW10pLmNvbmNhdChpbnB1dC5zY3J1YkZpZWxkcyk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlRGVwcmVjYXRlZE9wdGlvbnMob3B0aW9ucywgbG9nZ2VyKSB7XG4gIGlmIChvcHRpb25zLmhvc3RXaGl0ZUxpc3QgJiYgIW9wdGlvbnMuaG9zdFNhZmVMaXN0KSB7XG4gICAgb3B0aW9ucy5ob3N0U2FmZUxpc3QgPSBvcHRpb25zLmhvc3RXaGl0ZUxpc3Q7XG4gICAgb3B0aW9ucy5ob3N0V2hpdGVMaXN0ID0gdW5kZWZpbmVkO1xuICAgIGxvZ2dlciAmJiBsb2dnZXIubG9nKCdob3N0V2hpdGVMaXN0IGlzIGRlcHJlY2F0ZWQuIFVzZSBob3N0U2FmZUxpc3QuJyk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaG9zdEJsYWNrTGlzdCAmJiAhb3B0aW9ucy5ob3N0QmxvY2tMaXN0KSB7XG4gICAgb3B0aW9ucy5ob3N0QmxvY2tMaXN0ID0gb3B0aW9ucy5ob3N0QmxhY2tMaXN0O1xuICAgIG9wdGlvbnMuaG9zdEJsYWNrTGlzdCA9IHVuZGVmaW5lZDtcbiAgICBsb2dnZXIgJiYgbG9nZ2VyLmxvZygnaG9zdEJsYWNrTGlzdCBpcyBkZXByZWNhdGVkLiBVc2UgaG9zdEJsb2NrTGlzdC4nKTtcbiAgfVxuICByZXR1cm4gb3B0aW9ucztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoOiBhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aCxcbiAgY3JlYXRlSXRlbTogY3JlYXRlSXRlbSxcbiAgYWRkRXJyb3JDb250ZXh0OiBhZGRFcnJvckNvbnRleHQsXG4gIGNyZWF0ZVRlbGVtZXRyeUV2ZW50OiBjcmVhdGVUZWxlbWV0cnlFdmVudCxcbiAgYWRkSXRlbUF0dHJpYnV0ZXM6IGFkZEl0ZW1BdHRyaWJ1dGVzLFxuICBmaWx0ZXJJcDogZmlsdGVySXAsXG4gIGZvcm1hdEFyZ3NBc1N0cmluZzogZm9ybWF0QXJnc0FzU3RyaW5nLFxuICBmb3JtYXRVcmw6IGZvcm1hdFVybCxcbiAgZ2V0OiBnZXQsXG4gIGhhbmRsZU9wdGlvbnM6IGhhbmRsZU9wdGlvbnMsXG4gIGlzRXJyb3I6IGlzRXJyb3IsXG4gIGlzRmluaXRlTnVtYmVyOiBpc0Zpbml0ZU51bWJlcixcbiAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgaXNJdGVyYWJsZTogaXNJdGVyYWJsZSxcbiAgaXNOYXRpdmVGdW5jdGlvbjogaXNOYXRpdmVGdW5jdGlvbixcbiAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICBpc1N0cmluZzogaXNTdHJpbmcsXG4gIGlzVHlwZTogaXNUeXBlLFxuICBpc1Byb21pc2U6IGlzUHJvbWlzZSxcbiAgaXNCcm93c2VyOiBpc0Jyb3dzZXIsXG4gIGpzb25QYXJzZToganNvblBhcnNlLFxuICBMRVZFTFM6IExFVkVMUyxcbiAgbWFrZVVuaGFuZGxlZFN0YWNrSW5mbzogbWFrZVVuaGFuZGxlZFN0YWNrSW5mbyxcbiAgbWVyZ2U6IG1lcmdlLFxuICBub3c6IG5vdyxcbiAgcmVkYWN0OiByZWRhY3QsXG4gIFJvbGxiYXJKU09OOiBSb2xsYmFySlNPTixcbiAgc2FuaXRpemVVcmw6IHNhbml0aXplVXJsLFxuICBzZXQ6IHNldCxcbiAgc2V0dXBKU09OOiBzZXR1cEpTT04sXG4gIHN0cmluZ2lmeTogc3RyaW5naWZ5LFxuICBtYXhCeXRlU2l6ZTogbWF4Qnl0ZVNpemUsXG4gIHR5cGVOYW1lOiB0eXBlTmFtZSxcbiAgdXVpZDQ6IHV1aWQ0LFxufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLyogZ2xvYmFscyBleHBlY3QgKi9cbi8qIGdsb2JhbHMgZGVzY3JpYmUgKi9cbi8qIGdsb2JhbHMgaXQgKi9cbi8qIGdsb2JhbHMgc2lub24gKi9cblxuLy8gVXNlIG1pbmltYWwgYnJvd3NlciBwYWNrYWdlLCB3aXRoIG5vIG9wdGlvbmFsIGNvbXBvbmVudHMgYWRkZWQuXG52YXIgUm9sbGJhciA9IHJlcXVpcmUoJy4uL3NyYy9icm93c2VyL2NvcmUnKTtcblxuZGVzY3JpYmUoJ29wdGlvbnMuY2FwdHVyZVVuY2F1Z2h0JywgZnVuY3Rpb24gKCkge1xuICBiZWZvcmVFYWNoKGZ1bmN0aW9uIChkb25lKSB7XG4gICAgLy8gTG9hZCB0aGUgSFRNTCBwYWdlLCBzbyBlcnJvcnMgY2FuIGJlIGdlbmVyYXRlZC5cbiAgICBkb2N1bWVudC53cml0ZSh3aW5kb3cuX19odG1sX19bJ2V4YW1wbGVzL2Vycm9yLmh0bWwnXSk7XG5cbiAgICB3aW5kb3cuc2VydmVyID0gc2lub24uY3JlYXRlRmFrZVNlcnZlcigpO1xuICAgIGRvbmUoKTtcbiAgfSk7XG5cbiAgYWZ0ZXJFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cucm9sbGJhci5jb25maWd1cmUoeyBhdXRvSW5zdHJ1bWVudDogZmFsc2UgfSk7XG4gICAgd2luZG93LnNlcnZlci5yZXN0b3JlKCk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHN0dWJSZXNwb25zZShzZXJ2ZXIpIHtcbiAgICBzZXJ2ZXIucmVzcG9uZFdpdGgoJ1BPU1QnLCAnYXBpLzEvaXRlbScsIFtcbiAgICAgIDIwMCxcbiAgICAgIHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgJ3tcImVyclwiOiAwLCBcInJlc3VsdFwiOnsgXCJ1dWlkXCI6IFwiZDRjN2FjZWY1NWJmNGM5ZWE5NWU0ZmU5NDI4YTgyODdcIn19JyxcbiAgICBdKTtcbiAgfVxuXG4gIGl0KCdzaG91bGQgY2FwdHVyZSB3aGVuIGVuYWJsZWQgaW4gY29uc3RydWN0b3InLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBzZXJ2ZXIgPSB3aW5kb3cuc2VydmVyO1xuICAgIHN0dWJSZXNwb25zZShzZXJ2ZXIpO1xuICAgIHNlcnZlci5yZXF1ZXN0cy5sZW5ndGggPSAwO1xuXG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBhY2Nlc3NUb2tlbjogJ1BPU1RfQ0xJRU5UX0lURU1fVE9LRU4nLFxuICAgICAgY2FwdHVyZVVuY2F1Z2h0OiB0cnVlLFxuICAgIH07XG4gICAgdmFyIHJvbGxiYXIgPSAod2luZG93LnJvbGxiYXIgPSBuZXcgUm9sbGJhcihvcHRpb25zKSk7XG5cbiAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aHJvdy1lcnJvcicpO1xuICAgIGVsZW1lbnQuY2xpY2soKTtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgc2VydmVyLnJlc3BvbmQoKTtcblxuICAgICAgdmFyIGJvZHkgPSBKU09OLnBhcnNlKHNlcnZlci5yZXF1ZXN0c1swXS5yZXF1ZXN0Qm9keSk7XG5cbiAgICAgIGV4cGVjdChib2R5LmRhdGEuYm9keS50cmFjZS5leGNlcHRpb24ubWVzc2FnZSkudG8uZXFsKCd0ZXN0IGVycm9yJyk7XG4gICAgICBleHBlY3QoYm9keS5kYXRhLm5vdGlmaWVyLmRpYWdub3N0aWMucmF3X2Vycm9yLm1lc3NhZ2UpLnRvLmVxbChcbiAgICAgICAgJ3Rlc3QgZXJyb3InLFxuICAgICAgKTtcbiAgICAgIGV4cGVjdChib2R5LmRhdGEubm90aWZpZXIuZGlhZ25vc3RpYy5pc191bmNhdWdodCkudG8uZXFsKHRydWUpO1xuXG4gICAgICAvLyBrYXJtYSBkb2Vzbid0IHVubG9hZCB0aGUgYnJvd3NlciBiZXR3ZWVuIHRlc3RzLCBzbyB0aGUgb25lcnJvciBoYW5kbGVyXG4gICAgICAvLyB3aWxsIHJlbWFpbiBpbnN0YWxsZWQuIFVuc2V0IGNhcHR1cmVVbmNhdWdodCBzbyB0aGUgb25lcnJvciBoYW5kbGVyXG4gICAgICAvLyB3b24ndCBhZmZlY3Qgb3RoZXIgdGVzdHMuXG4gICAgICByb2xsYmFyLmNvbmZpZ3VyZSh7XG4gICAgICAgIGNhcHR1cmVVbmNhdWdodDogZmFsc2UsXG4gICAgICB9KTtcblxuICAgICAgZG9uZSgpO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJlc3BvbmQgdG8gZW5hYmxlL2Rpc2FibGUgaW4gY29uZmlndXJlJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgc2VydmVyID0gd2luZG93LnNlcnZlcjtcbiAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aHJvdy1lcnJvcicpO1xuICAgIHN0dWJSZXNwb25zZShzZXJ2ZXIpO1xuICAgIHNlcnZlci5yZXF1ZXN0cy5sZW5ndGggPSAwO1xuXG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBhY2Nlc3NUb2tlbjogJ1BPU1RfQ0xJRU5UX0lURU1fVE9LRU4nLFxuICAgICAgY2FwdHVyZVVuY2F1Z2h0OiBmYWxzZSxcbiAgICB9O1xuICAgIHZhciByb2xsYmFyID0gKHdpbmRvdy5yb2xsYmFyID0gbmV3IFJvbGxiYXIob3B0aW9ucykpO1xuXG4gICAgZWxlbWVudC5jbGljaygpO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBzZXJ2ZXIucmVzcG9uZCgpO1xuICAgICAgZXhwZWN0KHNlcnZlci5yZXF1ZXN0cy5sZW5ndGgpLnRvLmVxbCgwKTsgLy8gRGlzYWJsZWQsIG5vIGV2ZW50XG4gICAgICBzZXJ2ZXIucmVxdWVzdHMubGVuZ3RoID0gMDtcblxuICAgICAgcm9sbGJhci5jb25maWd1cmUoe1xuICAgICAgICBjYXB0dXJlVW5jYXVnaHQ6IHRydWUsXG4gICAgICB9KTtcblxuICAgICAgZWxlbWVudC5jbGljaygpO1xuXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VydmVyLnJlc3BvbmQoKTtcblxuICAgICAgICB2YXIgYm9keSA9IEpTT04ucGFyc2Uoc2VydmVyLnJlcXVlc3RzWzBdLnJlcXVlc3RCb2R5KTtcblxuICAgICAgICBleHBlY3QoYm9keS5kYXRhLmJvZHkudHJhY2UuZXhjZXB0aW9uLm1lc3NhZ2UpLnRvLmVxbCgndGVzdCBlcnJvcicpO1xuICAgICAgICBleHBlY3QoYm9keS5kYXRhLm5vdGlmaWVyLmRpYWdub3N0aWMuaXNfYW5vbnltb3VzKS50by5ub3QuYmUub2soKTtcblxuICAgICAgICBzZXJ2ZXIucmVxdWVzdHMubGVuZ3RoID0gMDtcblxuICAgICAgICByb2xsYmFyLmNvbmZpZ3VyZSh7XG4gICAgICAgICAgY2FwdHVyZVVuY2F1Z2h0OiBmYWxzZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWxlbWVudC5jbGljaygpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlcnZlci5yZXNwb25kKCk7XG4gICAgICAgICAgZXhwZWN0KHNlcnZlci5yZXF1ZXN0cy5sZW5ndGgpLnRvLmVxbCgwKTsgLy8gRGlzYWJsZWQsIG5vIGV2ZW50XG5cbiAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0sIDEpO1xuICAgICAgfSwgMSk7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIC8vIFRlc3QgY2FzZSBleHBlY3RzIENocm9tZSwgd2hpY2ggaXMgdGhlIGN1cnJlbnRseSBjb25maWd1cmVkIGthcm1hIGpzL2Jyb3dzZXJcbiAgLy8gZW5naW5lIGF0IHRoZSB0aW1lIG9mIHRoaXMgY29tbWVudC4gSG93ZXZlciwga2FybWEncyBDaHJvbWUgYW5kIENocm9tZUhlYWRsZXNzXG4gIC8vIGRvbid0IGFjdHVhbGx5IGJlaGF2ZSBsaWtlIHJlYWwgQ2hyb21lIHNvIHdlIHNldHRsZSBmb3Igc3R1YmJpbmcgc29tZSB0aGluZ3MuXG4gIGl0KCdzaG91bGQgY2FwdHVyZSBleHRlcm5hbCBlcnJvciBkYXRhIHdoZW4gaW5zcGVjdEFub255bW91c0Vycm9ycyBpcyB0cnVlJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgc2VydmVyID0gd2luZG93LnNlcnZlcjtcbiAgICBzdHViUmVzcG9uc2Uoc2VydmVyKTtcbiAgICBzZXJ2ZXIucmVxdWVzdHMubGVuZ3RoID0gMDtcblxuICAgIC8vIFdlJ3JlIHN1cHBvc2VkbHkgcnVubmluZyBvbiBDaHJvbWVIZWFkbGVzcywgYnV0IHN0aWxsIG5lZWQgdG8gc3Bvb2YgQ2hyb21lLiA6XFxcbiAgICB3aW5kb3cuY2hyb21lID0geyBydW50aW1lOiB0cnVlIH07XG5cbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIGFjY2Vzc1Rva2VuOiAnUE9TVF9DTElFTlRfSVRFTV9UT0tFTicsXG4gICAgICBjYXB0dXJlVW5jYXVnaHQ6IHRydWUsXG4gICAgICBpbnNwZWN0QW5vbnltb3VzRXJyb3JzOiB0cnVlLFxuICAgIH07XG4gICAgdmFyIHJvbGxiYXIgPSAod2luZG93LnJvbGxiYXIgPSBuZXcgUm9sbGJhcihvcHRpb25zKSk7XG5cbiAgICAvLyBTaW11bGF0ZSByZWNlaXZpbmcgb25lcnJvciB3aXRob3V0IGFuIGVycm9yIG9iamVjdC5cbiAgICByb2xsYmFyLmFub255bW91c0Vycm9yc1BlbmRpbmcgKz0gMTtcblxuICAgIHRyeSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Fub24gZXJyb3InKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBFcnJvci5wcmVwYXJlU3RhY2tUcmFjZShlKTtcbiAgICB9XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlcnZlci5yZXNwb25kKCk7XG5cbiAgICAgIHZhciBib2R5ID0gSlNPTi5wYXJzZShzZXJ2ZXIucmVxdWVzdHNbMF0ucmVxdWVzdEJvZHkpO1xuXG4gICAgICBleHBlY3QoYm9keS5kYXRhLmJvZHkudHJhY2UuZXhjZXB0aW9uLm1lc3NhZ2UpLnRvLmVxbCgnYW5vbiBlcnJvcicpO1xuICAgICAgZXhwZWN0KGJvZHkuZGF0YS5ub3RpZmllci5kaWFnbm9zdGljLmlzX2Fub255bW91cykudG8uZXFsKHRydWUpO1xuXG4gICAgICAvLyBrYXJtYSBkb2Vzbid0IHVubG9hZCB0aGUgYnJvd3NlciBiZXR3ZWVuIHRlc3RzLCBzbyB0aGUgb25lcnJvciBoYW5kbGVyXG4gICAgICAvLyB3aWxsIHJlbWFpbiBpbnN0YWxsZWQuIFVuc2V0IGNhcHR1cmVVbmNhdWdodCBzbyB0aGUgb25lcnJvciBoYW5kbGVyXG4gICAgICAvLyB3b24ndCBhZmZlY3Qgb3RoZXIgdGVzdHMuXG4gICAgICByb2xsYmFyLmNvbmZpZ3VyZSh7XG4gICAgICAgIGNhcHR1cmVVbmNhdWdodDogZmFsc2UsXG4gICAgICB9KTtcblxuICAgICAgZG9uZSgpO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGlnbm9yZSBkdXBsaWNhdGUgZXJyb3JzIGJ5IGRlZmF1bHQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBzZXJ2ZXIgPSB3aW5kb3cuc2VydmVyO1xuICAgIHN0dWJSZXNwb25zZShzZXJ2ZXIpO1xuICAgIHNlcnZlci5yZXF1ZXN0cy5sZW5ndGggPSAwO1xuXG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBhY2Nlc3NUb2tlbjogJ1BPU1RfQ0xJRU5UX0lURU1fVE9LRU4nLFxuICAgICAgY2FwdHVyZVVuY2F1Z2h0OiB0cnVlLFxuICAgIH07XG4gICAgdmFyIHJvbGxiYXIgPSAod2luZG93LnJvbGxiYXIgPSBuZXcgUm9sbGJhcihvcHRpb25zKSk7XG5cbiAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aHJvdy1lcnJvcicpO1xuXG4gICAgLy8gZ2VuZXJhdGUgc2FtZSBlcnJvciB0d2ljZVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjsgaSsrKSB7XG4gICAgICBlbGVtZW50LmNsaWNrKCk7IC8vIHVzZSBmb3IgbG9vcCB0byBlbnN1cmUgdGhlIHN0YWNrIHRyYWNlcyBoYXZlIGlkZW50aWNhbCBsaW5lL2NvbCBpbmZvXG4gICAgfVxuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBzZXJ2ZXIucmVzcG9uZCgpO1xuXG4gICAgICAvLyB0cmFuc21pdCBvbmx5IG9uY2VcbiAgICAgIGV4cGVjdChzZXJ2ZXIucmVxdWVzdHMubGVuZ3RoKS50by5lcWwoMSk7XG5cbiAgICAgIHZhciBib2R5ID0gSlNPTi5wYXJzZShzZXJ2ZXIucmVxdWVzdHNbMF0ucmVxdWVzdEJvZHkpO1xuXG4gICAgICBleHBlY3QoYm9keS5kYXRhLmJvZHkudHJhY2UuZXhjZXB0aW9uLm1lc3NhZ2UpLnRvLmVxbCgndGVzdCBlcnJvcicpO1xuXG4gICAgICAvLyBrYXJtYSBkb2Vzbid0IHVubG9hZCB0aGUgYnJvd3NlciBiZXR3ZWVuIHRlc3RzLCBzbyB0aGUgb25lcnJvciBoYW5kbGVyXG4gICAgICAvLyB3aWxsIHJlbWFpbiBpbnN0YWxsZWQuIFVuc2V0IGNhcHR1cmVVbmNhdWdodCBzbyB0aGUgb25lcnJvciBoYW5kbGVyXG4gICAgICAvLyB3b24ndCBhZmZlY3Qgb3RoZXIgdGVzdHMuXG4gICAgICByb2xsYmFyLmNvbmZpZ3VyZSh7XG4gICAgICAgIGNhcHR1cmVVbmNhdWdodDogZmFsc2UsXG4gICAgICB9KTtcblxuICAgICAgZG9uZSgpO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHRyYW5zbWl0IGR1cGxpY2F0ZSBlcnJvcnMgd2hlbiBzZXQgaW4gY29uZmlnJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgc2VydmVyID0gd2luZG93LnNlcnZlcjtcbiAgICBzdHViUmVzcG9uc2Uoc2VydmVyKTtcbiAgICBzZXJ2ZXIucmVxdWVzdHMubGVuZ3RoID0gMDtcblxuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgYWNjZXNzVG9rZW46ICdQT1NUX0NMSUVOVF9JVEVNX1RPS0VOJyxcbiAgICAgIGNhcHR1cmVVbmNhdWdodDogdHJ1ZSxcbiAgICAgIGlnbm9yZUR1cGxpY2F0ZUVycm9yczogZmFsc2UsXG4gICAgfTtcbiAgICB2YXIgcm9sbGJhciA9ICh3aW5kb3cucm9sbGJhciA9IG5ldyBSb2xsYmFyKG9wdGlvbnMpKTtcblxuICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rocm93LWVycm9yJyk7XG5cbiAgICAvLyBnZW5lcmF0ZSBzYW1lIGVycm9yIHR3aWNlXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAyOyBpKyspIHtcbiAgICAgIGVsZW1lbnQuY2xpY2soKTsgLy8gdXNlIGZvciBsb29wIHRvIGVuc3VyZSB0aGUgc3RhY2sgdHJhY2VzIGhhdmUgaWRlbnRpY2FsIGxpbmUvY29sIGluZm9cbiAgICB9XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlcnZlci5yZXNwb25kKCk7XG5cbiAgICAgIC8vIHRyYW5zbWl0IGJvdGggZXJyb3JzXG4gICAgICBleHBlY3Qoc2VydmVyLnJlcXVlc3RzLmxlbmd0aCkudG8uZXFsKDIpO1xuXG4gICAgICB2YXIgYm9keSA9IEpTT04ucGFyc2Uoc2VydmVyLnJlcXVlc3RzWzBdLnJlcXVlc3RCb2R5KTtcblxuICAgICAgZXhwZWN0KGJvZHkuZGF0YS5ib2R5LnRyYWNlLmV4Y2VwdGlvbi5tZXNzYWdlKS50by5lcWwoJ3Rlc3QgZXJyb3InKTtcblxuICAgICAgLy8ga2FybWEgZG9lc24ndCB1bmxvYWQgdGhlIGJyb3dzZXIgYmV0d2VlbiB0ZXN0cywgc28gdGhlIG9uZXJyb3IgaGFuZGxlclxuICAgICAgLy8gd2lsbCByZW1haW4gaW5zdGFsbGVkLiBVbnNldCBjYXB0dXJlVW5jYXVnaHQgc28gdGhlIG9uZXJyb3IgaGFuZGxlclxuICAgICAgLy8gd29uJ3QgYWZmZWN0IG90aGVyIHRlc3RzLlxuICAgICAgcm9sbGJhci5jb25maWd1cmUoe1xuICAgICAgICBjYXB0dXJlVW5jYXVnaHQ6IGZhbHNlLFxuICAgICAgfSk7XG5cbiAgICAgIGRvbmUoKTtcbiAgICB9LCAxKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgc2VuZCBET01FeGNlcHRpb24gYXMgdHJhY2VfY2hhaW4nLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBzZXJ2ZXIgPSB3aW5kb3cuc2VydmVyO1xuICAgIHN0dWJSZXNwb25zZShzZXJ2ZXIpO1xuICAgIHNlcnZlci5yZXF1ZXN0cy5sZW5ndGggPSAwO1xuXG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBhY2Nlc3NUb2tlbjogJ1BPU1RfQ0xJRU5UX0lURU1fVE9LRU4nLFxuICAgICAgY2FwdHVyZVVuY2F1Z2h0OiB0cnVlLFxuICAgIH07XG4gICAgdmFyIHJvbGxiYXIgPSAod2luZG93LnJvbGxiYXIgPSBuZXcgUm9sbGJhcihvcHRpb25zKSk7XG5cbiAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aHJvdy1kb20tZXhjZXB0aW9uJyk7XG4gICAgZWxlbWVudC5jbGljaygpO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBzZXJ2ZXIucmVzcG9uZCgpO1xuXG4gICAgICB2YXIgYm9keSA9IEpTT04ucGFyc2Uoc2VydmVyLnJlcXVlc3RzWzBdLnJlcXVlc3RCb2R5KTtcblxuICAgICAgZXhwZWN0KGJvZHkuZGF0YS5ib2R5LnRyYWNlX2NoYWluWzBdLmV4Y2VwdGlvbi5tZXNzYWdlKS50by5lcWwoXG4gICAgICAgICd0ZXN0IERPTUV4Y2VwdGlvbicsXG4gICAgICApO1xuXG4gICAgICAvLyBrYXJtYSBkb2Vzbid0IHVubG9hZCB0aGUgYnJvd3NlciBiZXR3ZWVuIHRlc3RzLCBzbyB0aGUgb25lcnJvciBoYW5kbGVyXG4gICAgICAvLyB3aWxsIHJlbWFpbiBpbnN0YWxsZWQuIFVuc2V0IGNhcHR1cmVVbmNhdWdodCBzbyB0aGUgb25lcnJvciBoYW5kbGVyXG4gICAgICAvLyB3b24ndCBhZmZlY3Qgb3RoZXIgdGVzdHMuXG4gICAgICByb2xsYmFyLmNvbmZpZ3VyZSh7XG4gICAgICAgIGNhcHR1cmVVbmNhdWdodDogZmFsc2UsXG4gICAgICB9KTtcblxuICAgICAgZG9uZSgpO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGNhcHR1cmUgZXh0YSBmcmFtZXMgd2hlbiBzdGFja1RyYWNlTGltaXQgaXMgc2V0JywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgc2VydmVyID0gd2luZG93LnNlcnZlcjtcbiAgICBzdHViUmVzcG9uc2Uoc2VydmVyKTtcbiAgICBzZXJ2ZXIucmVxdWVzdHMubGVuZ3RoID0gMDtcblxuICAgIHZhciBvbGRMaW1pdCA9IEVycm9yLnN0YWNrVHJhY2VMaW1pdDtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIGFjY2Vzc1Rva2VuOiAnUE9TVF9DTElFTlRfSVRFTV9UT0tFTicsXG4gICAgICBjYXB0dXJlVW5jYXVnaHQ6IHRydWUsXG4gICAgICBzdGFja1RyYWNlTGltaXQ6IDUwLFxuICAgIH07XG4gICAgdmFyIHJvbGxiYXIgPSAod2luZG93LnJvbGxiYXIgPSBuZXcgUm9sbGJhcihvcHRpb25zKSk7XG5cbiAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aHJvdy1kZXBwLXN0YWNrLWVycm9yJyk7XG4gICAgZWxlbWVudC5jbGljaygpO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBzZXJ2ZXIucmVzcG9uZCgpO1xuXG4gICAgICB2YXIgYm9keSA9IEpTT04ucGFyc2Uoc2VydmVyLnJlcXVlc3RzWzBdLnJlcXVlc3RCb2R5KTtcblxuICAgICAgZXhwZWN0KGJvZHkuZGF0YS5ib2R5LnRyYWNlLmV4Y2VwdGlvbi5tZXNzYWdlKS50by5lcWwoJ2RlZXAgc3RhY2sgZXJyb3InKTtcbiAgICAgIGV4cGVjdChib2R5LmRhdGEuYm9keS50cmFjZS5mcmFtZXMubGVuZ3RoKS50by5iZS5hYm92ZSgyMCk7XG5cbiAgICAgIC8vIGthcm1hIGRvZXNuJ3QgdW5sb2FkIHRoZSBicm93c2VyIGJldHdlZW4gdGVzdHMsIHNvIHRoZSBvbmVycm9yIGhhbmRsZXJcbiAgICAgIC8vIHdpbGwgcmVtYWluIGluc3RhbGxlZC4gVW5zZXQgY2FwdHVyZVVuY2F1Z2h0IHNvIHRoZSBvbmVycm9yIGhhbmRsZXJcbiAgICAgIC8vIHdvbid0IGFmZmVjdCBvdGhlciB0ZXN0cy5cbiAgICAgIHJvbGxiYXIuY29uZmlndXJlKHtcbiAgICAgICAgY2FwdHVyZVVuY2F1Z2h0OiBmYWxzZSxcbiAgICAgICAgc3RhY2tUcmFjZUxpbWl0OiBvbGRMaW1pdCwgLy8gcmVzZXQgdG8gZGVmYXVsdFxuICAgICAgfSk7XG5cbiAgICAgIGRvbmUoKTtcbiAgICB9LCAxKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ29wdGlvbnMuY2FwdHVyZVVuaGFuZGxlZFJlamVjdGlvbnMnLCBmdW5jdGlvbiAoKSB7XG4gIGJlZm9yZUVhY2goZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB3aW5kb3cuc2VydmVyID0gc2lub24uY3JlYXRlRmFrZVNlcnZlcigpO1xuICAgIGRvbmUoKTtcbiAgfSk7XG5cbiAgYWZ0ZXJFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cucm9sbGJhci5jb25maWd1cmUoeyBhdXRvSW5zdHJ1bWVudDogZmFsc2UgfSk7XG4gICAgd2luZG93LnNlcnZlci5yZXN0b3JlKCk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHN0dWJSZXNwb25zZShzZXJ2ZXIpIHtcbiAgICBzZXJ2ZXIucmVzcG9uZFdpdGgoJ1BPU1QnLCAnYXBpLzEvaXRlbScsIFtcbiAgICAgIDIwMCxcbiAgICAgIHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgJ3tcImVyclwiOiAwLCBcInJlc3VsdFwiOnsgXCJ1dWlkXCI6IFwiZDRjN2FjZWY1NWJmNGM5ZWE5NWU0ZmU5NDI4YTgyODdcIn19JyxcbiAgICBdKTtcbiAgfVxuXG4gIGl0KCdzaG91bGQgY2FwdHVyZSB3aGVuIGVuYWJsZWQgaW4gY29uc3RydWN0b3InLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBzZXJ2ZXIgPSB3aW5kb3cuc2VydmVyO1xuICAgIHN0dWJSZXNwb25zZShzZXJ2ZXIpO1xuICAgIHNlcnZlci5yZXF1ZXN0cy5sZW5ndGggPSAwO1xuXG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBhY2Nlc3NUb2tlbjogJ1BPU1RfQ0xJRU5UX0lURU1fVE9LRU4nLFxuICAgICAgY2FwdHVyZVVuaGFuZGxlZFJlamVjdGlvbnM6IHRydWUsXG4gICAgfTtcbiAgICB2YXIgcm9sbGJhciA9ICh3aW5kb3cucm9sbGJhciA9IG5ldyBSb2xsYmFyKG9wdGlvbnMpKTtcblxuICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcigndGVzdCByZWplY3QnKSk7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlcnZlci5yZXNwb25kKCk7XG5cbiAgICAgIHZhciBib2R5ID0gSlNPTi5wYXJzZShzZXJ2ZXIucmVxdWVzdHNbMF0ucmVxdWVzdEJvZHkpO1xuXG4gICAgICBleHBlY3QoYm9keS5kYXRhLmJvZHkudHJhY2UuZXhjZXB0aW9uLm1lc3NhZ2UpLnRvLmVxbCgndGVzdCByZWplY3QnKTtcbiAgICAgIGV4cGVjdChib2R5LmRhdGEubm90aWZpZXIuZGlhZ25vc3RpYy5pc191bmNhdWdodCkudG8uZXFsKHRydWUpO1xuXG4gICAgICByb2xsYmFyLmNvbmZpZ3VyZSh7XG4gICAgICAgIGNhcHR1cmVVbmhhbmRsZWRSZWplY3Rpb25zOiBmYWxzZSxcbiAgICAgIH0pO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3VuaGFuZGxlZHJlamVjdGlvbicsIHdpbmRvdy5fcm9sbGJhclVSSCk7XG5cbiAgICAgIGRvbmUoKTtcbiAgICB9LCA1MDApO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJlc3BvbmQgdG8gZW5hYmxlIGluIGNvbmZpZ3VyZScsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIHNlcnZlciA9IHdpbmRvdy5zZXJ2ZXI7XG4gICAgc3R1YlJlc3BvbnNlKHNlcnZlcik7XG4gICAgc2VydmVyLnJlcXVlc3RzLmxlbmd0aCA9IDA7XG5cbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIGFjY2Vzc1Rva2VuOiAnUE9TVF9DTElFTlRfSVRFTV9UT0tFTicsXG4gICAgICBjYXB0dXJlVW5oYW5kbGVkUmVqZWN0aW9uczogZmFsc2UsXG4gICAgfTtcbiAgICB2YXIgcm9sbGJhciA9ICh3aW5kb3cucm9sbGJhciA9IG5ldyBSb2xsYmFyKG9wdGlvbnMpKTtcblxuICAgIHJvbGxiYXIuY29uZmlndXJlKHtcbiAgICAgIGNhcHR1cmVVbmhhbmRsZWRSZWplY3Rpb25zOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCd0ZXN0IHJlamVjdCcpKTtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgc2VydmVyLnJlc3BvbmQoKTtcblxuICAgICAgdmFyIGJvZHkgPSBKU09OLnBhcnNlKHNlcnZlci5yZXF1ZXN0c1swXS5yZXF1ZXN0Qm9keSk7XG5cbiAgICAgIGV4cGVjdChib2R5LmRhdGEuYm9keS50cmFjZS5leGNlcHRpb24ubWVzc2FnZSkudG8uZXFsKCd0ZXN0IHJlamVjdCcpO1xuXG4gICAgICBzZXJ2ZXIucmVxdWVzdHMubGVuZ3RoID0gMDtcblxuICAgICAgcm9sbGJhci5jb25maWd1cmUoe1xuICAgICAgICBjYXB0dXJlVW5oYW5kbGVkUmVqZWN0aW9uczogZmFsc2UsXG4gICAgICB9KTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd1bmhhbmRsZWRyZWplY3Rpb24nLCB3aW5kb3cuX3JvbGxiYXJVUkgpO1xuXG4gICAgICBkb25lKCk7XG4gICAgfSwgNTAwKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXNwb25kIHRvIGRpc2FibGUgaW4gY29uZmlndXJlJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgc2VydmVyID0gd2luZG93LnNlcnZlcjtcbiAgICBzdHViUmVzcG9uc2Uoc2VydmVyKTtcbiAgICBzZXJ2ZXIucmVxdWVzdHMubGVuZ3RoID0gMDtcblxuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgYWNjZXNzVG9rZW46ICdQT1NUX0NMSUVOVF9JVEVNX1RPS0VOJyxcbiAgICAgIGNhcHR1cmVVbmhhbmRsZWRSZWplY3Rpb25zOiB0cnVlLFxuICAgIH07XG4gICAgdmFyIHJvbGxiYXIgPSAod2luZG93LnJvbGxiYXIgPSBuZXcgUm9sbGJhcihvcHRpb25zKSk7XG5cbiAgICByb2xsYmFyLmNvbmZpZ3VyZSh7XG4gICAgICBjYXB0dXJlVW5oYW5kbGVkUmVqZWN0aW9uczogZmFsc2UsXG4gICAgfSk7XG5cbiAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ3Rlc3QgcmVqZWN0JykpO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBzZXJ2ZXIucmVzcG9uZCgpO1xuXG4gICAgICBleHBlY3Qoc2VydmVyLnJlcXVlc3RzLmxlbmd0aCkudG8uZXFsKDApOyAvLyBEaXNhYmxlZCwgbm8gZXZlbnRcbiAgICAgIHNlcnZlci5yZXF1ZXN0cy5sZW5ndGggPSAwO1xuXG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndW5oYW5kbGVkcmVqZWN0aW9uJywgd2luZG93Ll9yb2xsYmFyVVJIKTtcblxuICAgICAgZG9uZSgpO1xuICAgIH0sIDUwMCk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdsb2cnLCBmdW5jdGlvbiAoKSB7XG4gIGJlZm9yZUVhY2goZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB3aW5kb3cuc2VydmVyID0gc2lub24uY3JlYXRlRmFrZVNlcnZlcigpO1xuICAgIGRvbmUoKTtcbiAgfSk7XG5cbiAgYWZ0ZXJFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cucm9sbGJhci5jb25maWd1cmUoeyBhdXRvSW5zdHJ1bWVudDogZmFsc2UgfSk7XG4gICAgd2luZG93LnNlcnZlci5yZXN0b3JlKCk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHN0dWJSZXNwb25zZShzZXJ2ZXIpIHtcbiAgICBzZXJ2ZXIucmVzcG9uZFdpdGgoJ1BPU1QnLCAnYXBpLzEvaXRlbScsIFtcbiAgICAgIDIwMCxcbiAgICAgIHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgJ3tcImVyclwiOiAwLCBcInJlc3VsdFwiOnsgXCJ1dWlkXCI6IFwiZDRjN2FjZWY1NWJmNGM5ZWE5NWU0ZmU5NDI4YTgyODdcIn19JyxcbiAgICBdKTtcbiAgfVxuXG4gIGl0KCdzaG91bGQgc2VuZCBtZXNzYWdlIHdoZW4gY2FsbGVkIHdpdGggbWVzc2FnZSBhbmQgZXh0cmEgYXJncycsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIHNlcnZlciA9IHdpbmRvdy5zZXJ2ZXI7XG4gICAgc3R1YlJlc3BvbnNlKHNlcnZlcik7XG4gICAgc2VydmVyLnJlcXVlc3RzLmxlbmd0aCA9IDA7XG5cbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIGFjY2Vzc1Rva2VuOiAnUE9TVF9DTElFTlRfSVRFTV9UT0tFTicsXG4gICAgfTtcbiAgICB2YXIgcm9sbGJhciA9ICh3aW5kb3cucm9sbGJhciA9IG5ldyBSb2xsYmFyKG9wdGlvbnMpKTtcblxuICAgIHJvbGxiYXIubG9nKCd0ZXN0IG1lc3NhZ2UnLCB7IGZvbzogJ2JhcicgfSk7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlcnZlci5yZXNwb25kKCk7XG5cbiAgICAgIHZhciBib2R5ID0gSlNPTi5wYXJzZShzZXJ2ZXIucmVxdWVzdHNbMF0ucmVxdWVzdEJvZHkpO1xuXG4gICAgICBleHBlY3QoYm9keS5kYXRhLmJvZHkubWVzc2FnZS5ib2R5KS50by5lcWwoJ3Rlc3QgbWVzc2FnZScpO1xuICAgICAgZXhwZWN0KGJvZHkuZGF0YS5ib2R5Lm1lc3NhZ2UuZXh0cmEpLnRvLmVxbCh7IGZvbzogJ2JhcicgfSk7XG4gICAgICBleHBlY3QoYm9keS5kYXRhLm5vdGlmaWVyLmRpYWdub3N0aWMuaXNfdW5jYXVnaHQpLnRvLmVxbCh1bmRlZmluZWQpO1xuICAgICAgZXhwZWN0KGJvZHkuZGF0YS5ub3RpZmllci5kaWFnbm9zdGljLm9yaWdpbmFsX2FyZ190eXBlcykudG8uZXFsKFtcbiAgICAgICAgJ3N0cmluZycsXG4gICAgICAgICdvYmplY3QnLFxuICAgICAgXSk7XG5cbiAgICAgIGRvbmUoKTtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBzZW5kIGV4Y2VwdGlvbiB3aGVuIGNhbGxlZCB3aXRoIGVycm9yIGFuZCBleHRyYSBhcmdzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgc2VydmVyID0gd2luZG93LnNlcnZlcjtcbiAgICBzdHViUmVzcG9uc2Uoc2VydmVyKTtcbiAgICBzZXJ2ZXIucmVxdWVzdHMubGVuZ3RoID0gMDtcblxuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgYWNjZXNzVG9rZW46ICdQT1NUX0NMSUVOVF9JVEVNX1RPS0VOJyxcbiAgICB9O1xuICAgIHZhciByb2xsYmFyID0gKHdpbmRvdy5yb2xsYmFyID0gbmV3IFJvbGxiYXIob3B0aW9ucykpO1xuXG4gICAgcm9sbGJhci5sb2cobmV3IEVycm9yKCd0ZXN0IGVycm9yJyksIHsgZm9vOiAnYmFyJyB9KTtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgc2VydmVyLnJlc3BvbmQoKTtcblxuICAgICAgdmFyIGJvZHkgPSBKU09OLnBhcnNlKHNlcnZlci5yZXF1ZXN0c1swXS5yZXF1ZXN0Qm9keSk7XG5cbiAgICAgIGV4cGVjdChib2R5LmRhdGEuYm9keS50cmFjZS5leGNlcHRpb24ubWVzc2FnZSkudG8uZXFsKCd0ZXN0IGVycm9yJyk7XG4gICAgICBleHBlY3QoYm9keS5kYXRhLmJvZHkudHJhY2UuZXh0cmEpLnRvLmVxbCh7IGZvbzogJ2JhcicgfSk7XG4gICAgICBleHBlY3QoYm9keS5kYXRhLm5vdGlmaWVyLmRpYWdub3N0aWMuaXNfdW5jYXVnaHQpLnRvLmVxbCh1bmRlZmluZWQpO1xuICAgICAgZXhwZWN0KGJvZHkuZGF0YS5ub3RpZmllci5kaWFnbm9zdGljLm9yaWdpbmFsX2FyZ190eXBlcykudG8uZXFsKFtcbiAgICAgICAgJ2Vycm9yJyxcbiAgICAgICAgJ29iamVjdCcsXG4gICAgICBdKTtcblxuICAgICAgZG9uZSgpO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGFkZCBjdXN0b20gZGF0YSB3aGVuIGNhbGxlZCB3aXRoIGVycm9yIGNvbnRleHQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBzZXJ2ZXIgPSB3aW5kb3cuc2VydmVyO1xuICAgIHN0dWJSZXNwb25zZShzZXJ2ZXIpO1xuICAgIHNlcnZlci5yZXF1ZXN0cy5sZW5ndGggPSAwO1xuXG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBhY2Nlc3NUb2tlbjogJ1BPU1RfQ0xJRU5UX0lURU1fVE9LRU4nLFxuICAgICAgYWRkRXJyb3JDb250ZXh0OiB0cnVlLFxuICAgIH07XG4gICAgdmFyIHJvbGxiYXIgPSAod2luZG93LnJvbGxiYXIgPSBuZXcgUm9sbGJhcihvcHRpb25zKSk7XG5cbiAgICB2YXIgZXJyID0gbmV3IEVycm9yKCd0ZXN0IGVycm9yJyk7XG4gICAgZXJyLnJvbGxiYXJDb250ZXh0ID0geyBlcnI6ICd0ZXN0JyB9O1xuXG4gICAgcm9sbGJhci5lcnJvcihlcnIsIHsgZm9vOiAnYmFyJyB9KTtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgc2VydmVyLnJlc3BvbmQoKTtcblxuICAgICAgdmFyIGJvZHkgPSBKU09OLnBhcnNlKHNlcnZlci5yZXF1ZXN0c1swXS5yZXF1ZXN0Qm9keSk7XG5cbiAgICAgIGV4cGVjdChib2R5LmRhdGEuYm9keS50cmFjZS5leGNlcHRpb24ubWVzc2FnZSkudG8uZXFsKCd0ZXN0IGVycm9yJyk7XG4gICAgICBleHBlY3QoYm9keS5kYXRhLmN1c3RvbS5mb28pLnRvLmVxbCgnYmFyJyk7XG4gICAgICBleHBlY3QoYm9keS5kYXRhLmN1c3RvbS5lcnIpLnRvLmVxbCgndGVzdCcpO1xuXG4gICAgICBkb25lKCk7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmVtb3ZlIGNpcmN1bGFyIHJlZmVyZW5jZXMgaW4gY3VzdG9tIGRhdGEnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBzZXJ2ZXIgPSB3aW5kb3cuc2VydmVyO1xuICAgIHN0dWJSZXNwb25zZShzZXJ2ZXIpO1xuICAgIHNlcnZlci5yZXF1ZXN0cy5sZW5ndGggPSAwO1xuXG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBhY2Nlc3NUb2tlbjogJ1BPU1RfQ0xJRU5UX0lURU1fVE9LRU4nLFxuICAgICAgYWRkRXJyb3JDb250ZXh0OiB0cnVlLFxuICAgIH07XG4gICAgdmFyIHJvbGxiYXIgPSAod2luZG93LnJvbGxiYXIgPSBuZXcgUm9sbGJhcihvcHRpb25zKSk7XG5cbiAgICB2YXIgZXJyID0gbmV3IEVycm9yKCd0ZXN0IGVycm9yJyk7XG4gICAgdmFyIGNvbnRleHREYXRhID0geyBleHRyYTogJ2JheicgfTtcbiAgICBjb250ZXh0RGF0YS5kYXRhID0gY29udGV4dERhdGE7XG4gICAgdmFyIGNvbnRleHQgPSB7IGVycjogJ3Rlc3QnLCBjb250ZXh0RGF0YTogY29udGV4dERhdGEgfTtcbiAgICBlcnIucm9sbGJhckNvbnRleHQgPSBjb250ZXh0O1xuXG4gICAgdmFyIGFycmF5ID0gWydvbmUnLCAndHdvJ107XG4gICAgYXJyYXkucHVzaChhcnJheSk7XG4gICAgdmFyIGN1c3RvbSA9IHsgZm9vOiAnYmFyJywgYXJyYXk6IGFycmF5IH07XG4gICAgdmFyIG5vdENpcmN1bGFyID0geyBrZXk6ICd2YWx1ZScgfTtcbiAgICBjdXN0b20ubm90Q2lyY3VsYXIxID0gbm90Q2lyY3VsYXI7XG4gICAgY3VzdG9tLm5vdENpcmN1bGFyMiA9IG5vdENpcmN1bGFyO1xuICAgIGN1c3RvbS5zZWxmID0gY3VzdG9tO1xuICAgIHJvbGxiYXIuZXJyb3IoZXJyLCBjdXN0b20pO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBzZXJ2ZXIucmVzcG9uZCgpO1xuXG4gICAgICB2YXIgYm9keSA9IEpTT04ucGFyc2Uoc2VydmVyLnJlcXVlc3RzWzBdLnJlcXVlc3RCb2R5KTtcblxuICAgICAgZXhwZWN0KGJvZHkuZGF0YS5ib2R5LnRyYWNlLmV4Y2VwdGlvbi5tZXNzYWdlKS50by5lcWwoJ3Rlc3QgZXJyb3InKTtcbiAgICAgIGV4cGVjdChib2R5LmRhdGEuY3VzdG9tLmZvbykudG8uZXFsKCdiYXInKTtcbiAgICAgIGV4cGVjdChib2R5LmRhdGEuY3VzdG9tLmVycikudG8uZXFsKCd0ZXN0Jyk7XG5cbiAgICAgIC8vIER1cGxpY2F0ZSBvYmplY3RzIGFyZSBhbGxvd2VkIHdoZW4gdGhlcmUgaXMgbm8gY2lyY3VsYXIgcmVmZXJlbmNlLlxuICAgICAgZXhwZWN0KGJvZHkuZGF0YS5jdXN0b20ubm90Q2lyY3VsYXIxKS50by5lcWwobm90Q2lyY3VsYXIpO1xuICAgICAgZXhwZWN0KGJvZHkuZGF0YS5jdXN0b20ubm90Q2lyY3VsYXIyKS50by5lcWwobm90Q2lyY3VsYXIpO1xuXG4gICAgICBleHBlY3QoYm9keS5kYXRhLmN1c3RvbS5zZWxmKS50by5lcWwoXG4gICAgICAgICdSZW1vdmVkIGNpcmN1bGFyIHJlZmVyZW5jZTogb2JqZWN0JyxcbiAgICAgICk7XG4gICAgICBleHBlY3QoYm9keS5kYXRhLmN1c3RvbS5hcnJheSkudG8uZXFsKFtcbiAgICAgICAgJ29uZScsXG4gICAgICAgICd0d28nLFxuICAgICAgICAnUmVtb3ZlZCBjaXJjdWxhciByZWZlcmVuY2U6IGFycmF5JyxcbiAgICAgIF0pO1xuICAgICAgZXhwZWN0KGJvZHkuZGF0YS5jdXN0b20uY29udGV4dERhdGEpLnRvLmVxbCh7XG4gICAgICAgIGV4dHJhOiAnYmF6JyxcbiAgICAgICAgZGF0YTogJ1JlbW92ZWQgY2lyY3VsYXIgcmVmZXJlbmNlOiBvYmplY3QnLFxuICAgICAgfSk7XG5cbiAgICAgIGRvbmUoKTtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBzZW5kIG1lc3NhZ2Ugd2hlbiBjYWxsZWQgd2l0aCBvbmx5IG51bGwgYXJndW1lbnRzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgc2VydmVyID0gd2luZG93LnNlcnZlcjtcbiAgICBzdHViUmVzcG9uc2Uoc2VydmVyKTtcbiAgICBzZXJ2ZXIucmVxdWVzdHMubGVuZ3RoID0gMDtcblxuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgYWNjZXNzVG9rZW46ICdQT1NUX0NMSUVOVF9JVEVNX1RPS0VOJyxcbiAgICAgIGNhcHR1cmVVbmhhbmRsZWRSZWplY3Rpb25zOiB0cnVlLFxuICAgIH07XG4gICAgdmFyIHJvbGxiYXIgPSAod2luZG93LnJvbGxiYXIgPSBuZXcgUm9sbGJhcihvcHRpb25zKSk7XG5cbiAgICByb2xsYmFyLmxvZyhudWxsKTtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgc2VydmVyLnJlc3BvbmQoKTtcblxuICAgICAgdmFyIGJvZHkgPSBKU09OLnBhcnNlKHNlcnZlci5yZXF1ZXN0c1swXS5yZXF1ZXN0Qm9keSk7XG5cbiAgICAgIGV4cGVjdChib2R5LmRhdGEuYm9keS5tZXNzYWdlLmJvZHkpLnRvLmVxbChcbiAgICAgICAgJ0l0ZW0gc2VudCB3aXRoIG51bGwgb3IgbWlzc2luZyBhcmd1bWVudHMuJyxcbiAgICAgICk7XG4gICAgICBleHBlY3QoYm9keS5kYXRhLm5vdGlmaWVyLmRpYWdub3N0aWMub3JpZ2luYWxfYXJnX3R5cGVzKS50by5lcWwoWydudWxsJ10pO1xuXG4gICAgICBkb25lKCk7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgc2tpcEZyYW1lcyB3aGVuIHNldCcsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIHNlcnZlciA9IHdpbmRvdy5zZXJ2ZXI7XG4gICAgc3R1YlJlc3BvbnNlKHNlcnZlcik7XG4gICAgc2VydmVyLnJlcXVlc3RzLmxlbmd0aCA9IDA7XG5cbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIGFjY2Vzc1Rva2VuOiAnUE9TVF9DTElFTlRfSVRFTV9UT0tFTicsXG4gICAgICBjYXB0dXJlVW5oYW5kbGVkUmVqZWN0aW9uczogdHJ1ZSxcbiAgICB9O1xuICAgIHZhciByb2xsYmFyID0gKHdpbmRvdy5yb2xsYmFyID0gbmV3IFJvbGxiYXIob3B0aW9ucykpO1xuXG4gICAgdmFyIGVycm9yID0gbmV3IEVycm9yKCdlcnJvciB3aXRoIHN0YWNrJyk7XG5cbiAgICByb2xsYmFyLmxvZyhlcnJvcik7XG4gICAgcm9sbGJhci5sb2coZXJyb3IsIHsgc2tpcEZyYW1lczogMSB9KTtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgc2VydmVyLnJlc3BvbmQoKTtcblxuICAgICAgdmFyIGZyYW1lczEgPSBKU09OLnBhcnNlKHNlcnZlci5yZXF1ZXN0c1swXS5yZXF1ZXN0Qm9keSkuZGF0YS5ib2R5LnRyYWNlXG4gICAgICAgIC5mcmFtZXM7XG4gICAgICB2YXIgZnJhbWVzMiA9IEpTT04ucGFyc2Uoc2VydmVyLnJlcXVlc3RzWzFdLnJlcXVlc3RCb2R5KS5kYXRhLmJvZHkudHJhY2VcbiAgICAgICAgLmZyYW1lcztcblxuICAgICAgZXhwZWN0KGZyYW1lczEubGVuZ3RoKS50by5lcWwoZnJhbWVzMi5sZW5ndGggKyAxKTtcbiAgICAgIGV4cGVjdChmcmFtZXMxLnNsaWNlKDAsIC0xKSkudG8uZXFsKGZyYW1lczIpO1xuXG4gICAgICBkb25lKCk7XG4gICAgfSwgMSk7XG4gIH0pO1xufSk7XG4iXSwibmFtZXMiOlsiX3JlZ2VuZXJhdG9yUnVudGltZSIsImUiLCJ0IiwiciIsIk9iamVjdCIsInByb3RvdHlwZSIsIm4iLCJoYXNPd25Qcm9wZXJ0eSIsIm8iLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiaSIsIlN5bWJvbCIsImEiLCJpdGVyYXRvciIsImMiLCJhc3luY0l0ZXJhdG9yIiwidSIsInRvU3RyaW5nVGFnIiwiZGVmaW5lIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwid3JhcCIsIkdlbmVyYXRvciIsImNyZWF0ZSIsIkNvbnRleHQiLCJtYWtlSW52b2tlTWV0aG9kIiwidHJ5Q2F0Y2giLCJ0eXBlIiwiYXJnIiwiY2FsbCIsImgiLCJsIiwiZiIsInMiLCJ5IiwiR2VuZXJhdG9yRnVuY3Rpb24iLCJHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSIsInAiLCJkIiwiZ2V0UHJvdG90eXBlT2YiLCJ2IiwidmFsdWVzIiwiZyIsImRlZmluZUl0ZXJhdG9yTWV0aG9kcyIsImZvckVhY2giLCJfaW52b2tlIiwiQXN5bmNJdGVyYXRvciIsImludm9rZSIsIl90eXBlb2YiLCJyZXNvbHZlIiwiX19hd2FpdCIsInRoZW4iLCJjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyIsIkVycm9yIiwiZG9uZSIsIm1ldGhvZCIsImRlbGVnYXRlIiwibWF5YmVJbnZva2VEZWxlZ2F0ZSIsInNlbnQiLCJfc2VudCIsImRpc3BhdGNoRXhjZXB0aW9uIiwiYWJydXB0IiwiVHlwZUVycm9yIiwicmVzdWx0TmFtZSIsIm5leHQiLCJuZXh0TG9jIiwicHVzaFRyeUVudHJ5IiwidHJ5TG9jIiwiY2F0Y2hMb2MiLCJmaW5hbGx5TG9jIiwiYWZ0ZXJMb2MiLCJ0cnlFbnRyaWVzIiwicHVzaCIsInJlc2V0VHJ5RW50cnkiLCJjb21wbGV0aW9uIiwicmVzZXQiLCJpc05hTiIsImxlbmd0aCIsImRpc3BsYXlOYW1lIiwiaXNHZW5lcmF0b3JGdW5jdGlvbiIsImNvbnN0cnVjdG9yIiwibmFtZSIsIm1hcmsiLCJzZXRQcm90b3R5cGVPZiIsIl9fcHJvdG9fXyIsImF3cmFwIiwiYXN5bmMiLCJQcm9taXNlIiwia2V5cyIsInJldmVyc2UiLCJwb3AiLCJwcmV2IiwiY2hhckF0Iiwic2xpY2UiLCJzdG9wIiwicnZhbCIsImhhbmRsZSIsImNvbXBsZXRlIiwiZmluaXNoIiwiX2NhdGNoIiwiZGVsZWdhdGVZaWVsZCIsImFzeW5jR2VuZXJhdG9yU3RlcCIsIl9hc3luY1RvR2VuZXJhdG9yIiwiYXJndW1lbnRzIiwiYXBwbHkiLCJfbmV4dCIsIl90aHJvdyIsIl8iLCJyZXF1aXJlIiwiaGVscGVycyIsImRlZmF1bHRPcHRpb25zIiwiaG9zdG5hbWUiLCJwYXRoIiwic2VhcmNoIiwidmVyc2lvbiIsInByb3RvY29sIiwicG9ydCIsIk9UTFBEZWZhdWx0T3B0aW9ucyIsIkFwaSIsIm9wdGlvbnMiLCJ0cmFuc3BvcnQiLCJ1cmxsaWIiLCJ0cnVuY2F0aW9uIiwidXJsIiwiYWNjZXNzVG9rZW4iLCJ0cmFuc3BvcnRPcHRpb25zIiwiX2dldFRyYW5zcG9ydCIsIk9UTFBUcmFuc3BvcnRPcHRpb25zIiwiX2dldE9UTFBUcmFuc3BvcnQiLCJfcG9zdFByb21pc2UiLCJfcmVmIiwicGF5bG9hZCIsInNlbGYiLCJyZWplY3QiLCJwb3N0IiwiZXJyIiwicmVzcCIsInBvc3RJdGVtIiwiZGF0YSIsImNhbGxiYWNrIiwiYnVpbGRQYXlsb2FkIiwic2V0VGltZW91dCIsInBvc3RTcGFucyIsIl9yZWYyIiwiX2NhbGxlZSIsIl9jYWxsZWUkIiwiX2NvbnRleHQiLCJfeCIsImJ1aWxkSnNvblBheWxvYWQiLCJzdHJpbmdpZnlSZXN1bHQiLCJ0cnVuY2F0ZSIsInN0cmluZ2lmeSIsImVycm9yIiwicG9zdEpzb25QYXlsb2FkIiwianNvblBheWxvYWQiLCJjb25maWd1cmUiLCJvbGRPcHRpb25zIiwibWVyZ2UiLCJ1bmRlZmluZWQiLCJnZXRUcmFuc3BvcnRGcm9tT3B0aW9ucyIsIl9vcHRpb25zJHRyYWNpbmciLCJfb2JqZWN0U3ByZWFkIiwiZW5kcG9pbnQiLCJ0cmFjaW5nIiwibW9kdWxlIiwiZXhwb3J0cyIsImlzVHlwZSIsImNvbnRleHQiLCJjb250ZXh0UmVzdWx0Iiwic3Vic3RyIiwiZGVmYXVsdHMiLCJ0aW1lb3V0IiwiZGV0ZWN0VHJhbnNwb3J0IiwicHJveHkiLCJvcHRzIiwicGFyc2UiLCJwYXRobmFtZSIsImdXaW5kb3ciLCJ3aW5kb3ciLCJkZWZhdWx0VHJhbnNwb3J0IiwiZmV0Y2giLCJYTUxIdHRwUmVxdWVzdCIsInRyYW5zcG9ydEFQSSIsImhvc3QiLCJhcHBlbmRQYXRoVG9QYXRoIiwiYmFzZSIsImJhc2VUcmFpbGluZ1NsYXNoIiwidGVzdCIsInBhdGhCZWdpbm5pbmdTbGFzaCIsInN1YnN0cmluZyIsIkNsaWVudCIsIkFQSSIsImxvZ2dlciIsImdsb2JhbHMiLCJUcmFuc3BvcnQiLCJ0cmFuc2Zvcm1zIiwic2hhcmVkVHJhbnNmb3JtcyIsInByZWRpY2F0ZXMiLCJzaGFyZWRQcmVkaWNhdGVzIiwiZXJyb3JQYXJzZXIiLCJyZWNvcmRlckRlZmF1bHRzIiwidHJhY2luZ0RlZmF1bHRzIiwiUmVwbGF5TWFwIiwiUm9sbGJhciIsImNsaWVudCIsImhhbmRsZU9wdGlvbnMiLCJfY29uZmlndXJlZE9wdGlvbnMiLCJUZWxlbWV0ZXIiLCJjb21wb25lbnRzIiwidGVsZW1ldGVyIiwiSW5zdHJ1bWVudGVyIiwiaW5zdHJ1bWVudGVyIiwicG9seWZpbGxKU09OIiwid3JhcEdsb2JhbHMiLCJzY3J1YiIsIlRyYWNpbmciLCJSZWNvcmRlciIsInJlY29yZGVyIiwiYXBpIiwiX2dXaW5kb3ciLCJpbml0U2Vzc2lvbiIsImlzQnJvd3NlciIsInJlY29yZGVyT3B0aW9ucyIsInJlcGxheU1hcCIsImVuYWJsZWQiLCJhdXRvU3RhcnQiLCJzdGFydCIsImdEb2N1bWVudCIsImRvY3VtZW50IiwiaXNDaHJvbWUiLCJjaHJvbWUiLCJydW50aW1lIiwiYW5vbnltb3VzRXJyb3JzUGVuZGluZyIsImFkZFRyYW5zZm9ybXNUb05vdGlmaWVyIiwibm90aWZpZXIiLCJhZGRQcmVkaWNhdGVzVG9RdWV1ZSIsInF1ZXVlIiwic2V0dXBVbmhhbmRsZWRDYXB0dXJlIiwiaW5zdHJ1bWVudCIsInNldHVwSlNPTiIsInJvbGxiYXIiLCJfaW5zdGFuY2UiLCJpbml0IiwiZ2xvYmFsIiwic2V0Q29tcG9uZW50cyIsImhhbmRsZVVuaW5pdGlhbGl6ZWQiLCJtYXliZUNhbGxiYWNrIiwibWVzc2FnZSIsInBheWxvYWREYXRhIiwiX3RoaXMkcmVjb3JkZXIiLCJsYXN0RXJyb3IiLCJsb2ciLCJpdGVtIiwiX2NyZWF0ZUl0ZW0iLCJ1dWlkIiwiX2dldEZpcnN0RnVuY3Rpb24iLCJkZWJ1ZyIsImluZm8iLCJ3YXJuIiwid2FybmluZyIsImNyaXRpY2FsIiwic2VuZEpzb25QYXlsb2FkIiwidW5oYW5kbGVkRXhjZXB0aW9uc0luaXRpYWxpemVkIiwiY2FwdHVyZVVuY2F1Z2h0IiwiaGFuZGxlVW5jYXVnaHRFeGNlcHRpb25zIiwiY2FwdHVyZVVuY2F1Z2h0RXhjZXB0aW9ucyIsIndyYXBHbG9iYWxFdmVudEhhbmRsZXJzIiwidW5oYW5kbGVkUmVqZWN0aW9uc0luaXRpYWxpemVkIiwiY2FwdHVyZVVuaGFuZGxlZFJlamVjdGlvbnMiLCJoYW5kbGVVbmhhbmRsZWRSZWplY3Rpb25zIiwiaGFuZGxlVW5jYXVnaHRFeGNlcHRpb24iLCJsaW5lbm8iLCJjb2xubyIsImluc3BlY3RBbm9ueW1vdXNFcnJvcnMiLCJzdGFja0luZm8iLCJtYWtlVW5oYW5kbGVkU3RhY2tJbmZvIiwiaXNFcnJvciIsIl91bmhhbmRsZWRTdGFja0luZm8iLCJsZXZlbCIsInVuY2F1Z2h0RXJyb3JMZXZlbCIsIl9pc1VuY2F1Z2h0IiwiaGFuZGxlQW5vbnltb3VzRXJyb3JzIiwicHJlcGFyZVN0YWNrVHJhY2UiLCJfc3RhY2siLCJfaXNBbm9ueW1vdXMiLCJzdGFjayIsImhhbmRsZVVuaGFuZGxlZFJlamVjdGlvbiIsInJlYXNvbiIsInByb21pc2UiLCJyZWFzb25SZXN1bHQiLCJfcm9sbGJhckNvbnRleHQiLCJfb3JpZ2luYWxBcmdzIiwiX2JlZm9yZSIsImN0eEZuIiwiaXNGdW5jdGlvbiIsIl9pc1dyYXAiLCJfcm9sbGJhcl93cmFwcGVkIiwiZXhjIiwiX3JvbGxiYXJXcmFwcGVkRXJyb3IiLCJTdHJpbmciLCJfd3JhcHBlZFNvdXJjZSIsInRvU3RyaW5nIiwicHJvcCIsImNhcHR1cmVFdmVudCIsImV2ZW50IiwiY3JlYXRlVGVsZW1ldHJ5RXZlbnQiLCJtZXRhZGF0YSIsImNhcHR1cmVEb21Db250ZW50TG9hZGVkIiwidHMiLCJEYXRlIiwiY2FwdHVyZUxvYWQiLCJhZGRUcmFuc2Zvcm0iLCJoYW5kbGVEb21FeGNlcHRpb24iLCJoYW5kbGVJdGVtV2l0aEVycm9yIiwiZW5zdXJlSXRlbUhhc1NvbWV0aGluZ1RvU2F5IiwiYWRkQmFzZUluZm8iLCJhZGRSZXF1ZXN0SW5mbyIsImFkZENsaWVudEluZm8iLCJhZGRQbHVnaW5JbmZvIiwiYWRkQm9keSIsImFkZE1lc3NhZ2VXaXRoRXJyb3IiLCJhZGRUZWxlbWV0cnlEYXRhIiwiYWRkQ29uZmlnVG9QYXlsb2FkIiwiYWRkU2NydWJiZXIiLCJhZGRQYXlsb2FkT3B0aW9ucyIsInVzZXJUcmFuc2Zvcm0iLCJhZGRDb25maWd1cmVkT3B0aW9ucyIsImFkZERpYWdub3N0aWNLZXlzIiwiaXRlbVRvUGF5bG9hZCIsImFkZFByZWRpY2F0ZSIsImNoZWNrTGV2ZWwiLCJjaGVja0lnbm9yZSIsInVzZXJDaGVja0lnbm9yZSIsInVybElzTm90QmxvY2tMaXN0ZWQiLCJ1cmxJc1NhZmVMaXN0ZWQiLCJtZXNzYWdlSXNJZ25vcmVkIiwibG9hZEZ1bGwiLCJhcmdzIiwiY3JlYXRlSXRlbSIsImxlbiIsInNjcnViRmllbGRzIiwibG9nTGV2ZWwiLCJyZXBvcnRMZXZlbCIsInZlcmJvc2UiLCJ0cmFuc21pdCIsInNlbmRDb25maWciLCJpbmNsdWRlSXRlbXNJblRlbGVtZXRyeSIsImNhcHR1cmVJcCIsImlnbm9yZUR1cGxpY2F0ZUVycm9ycyIsImdldElFVmVyc2lvbiIsInVuZGVmIiwiZGl2IiwiY3JlYXRlRWxlbWVudCIsImFsbCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiaW5uZXJIVE1MIiwiRGV0ZWN0aW9uIiwiaWVWZXJzaW9uIiwiaGFuZGxlciIsInNoaW0iLCJvbGRPbkVycm9yIiwiX3JvbGxiYXJPbGRPbkVycm9yIiwib25lcnJvciIsImZuIiwiQXJyYXkiLCJfcm9sbGJhcldpbmRvd09uRXJyb3IiLCJvbGQiLCJyZXQiLCJfcm9sbGJhclVSSCIsImJlbG9uZ3NUb1NoaW0iLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicmVqZWN0aW9uSGFuZGxlciIsImV2dCIsImRldGFpbCIsImFkZEV2ZW50TGlzdGVuZXIiLCJkZXRlY3Rpb24iLCJ1bnNoaWZ0IiwiY29uc29sZSIsImZvcm1hdEFyZ3NBc1N0cmluZyIsInNldHRpbmdzIiwiZ2V0IiwibG9nRW1pdHMiLCJpbmxpbmVTdHlsZXNoZWV0IiwiaW5saW5lSW1hZ2VzIiwiY29sbGVjdEZvbnRzIiwibWFza0lucHV0T3B0aW9ucyIsInBhc3N3b3JkIiwiZW1haWwiLCJ0ZWwiLCJ0ZXh0IiwiY29sb3IiLCJkYXRlIiwibW9udGgiLCJudW1iZXIiLCJyYW5nZSIsInRpbWUiLCJ3ZWVrIiwic2xpbURPTU9wdGlvbnMiLCJzY3JpcHQiLCJjb21tZW50IiwiaGVhZEZhdmljb24iLCJoZWFkV2hpdGVzcGFjZSIsImhlYWRNZXRhRGVzY0tleXdvcmRzIiwiaGVhZE1ldGFTb2NpYWwiLCJoZWFkTWV0YVJvYm90cyIsImhlYWRNZXRhSHR0cEVxdWl2IiwiaGVhZE1ldGFBdXRob3JzaGlwIiwiaGVhZE1ldGFWZXJpZmljYXRpb24iLCJfY2xhc3NDYWxsQ2hlY2siLCJfZGVmaW5lUHJvcGVydGllcyIsIl90b1Byb3BlcnR5S2V5Iiwia2V5IiwiX2NyZWF0ZUNsYXNzIiwiX3RvUHJpbWl0aXZlIiwidG9QcmltaXRpdmUiLCJOdW1iZXIiLCJfY2xhc3NQcml2YXRlRmllbGRJbml0U3BlYyIsIl9jaGVja1ByaXZhdGVSZWRlY2xhcmF0aW9uIiwic2V0IiwiaGFzIiwiX2NsYXNzUHJpdmF0ZUZpZWxkR2V0IiwiX2Fzc2VydENsYXNzQnJhbmQiLCJfY2xhc3NQcml2YXRlRmllbGRTZXQiLCJpZCIsIl9tYXAiLCJXZWFrTWFwIiwiX3JlY29yZGVyIiwiX2FwaSIsIl90cmFjaW5nIiwiTWFwIiwiX3Byb2Nlc3NSZXBsYXkyIiwicmVwbGF5SWQiLCJvY2N1cnJlbmNlVXVpZCIsImR1bXAiLCJ0cmFuc2Zvcm1FcnJvciIsIl9wcm9jZXNzUmVwbGF5IiwiX3gyIiwiYWRkIiwiZ2VuIiwiX3NlbmQiLCJfY2FsbGVlMiIsImlzRW1wdHkiLCJfY2FsbGVlMiQiLCJfY29udGV4dDIiLCJjb25jYXQiLCJpc0FycmF5IiwicmVzb3VyY2VTcGFucyIsInQwIiwic2VuZCIsIl94MyIsImRpc2NhcmQiLCJnZXRTcGFucyIsIl9jbGFzc1ByaXZhdGVGaWVsZEdldDIiLCJzZXRTcGFucyIsInNwYW5zIiwic2l6ZSIsImNsZWFyIiwiZGVmYXVsdCIsIlN0YWNrIiwib3JpZ2luYWxFcnJvciIsIm5lc3RlZCIsIl9zYXZlZFN0YWNrVHJhY2UiLCJza2lwRnJhbWVzIiwiYWRkRXJyb3JDb250ZXh0IiwiZGVzY3JpcHRpb24iLCJlMiIsImNoYWluIiwiY2F1c2UiLCJjdXN0b20iLCJlbnZpcm9ubWVudCIsInBsYXRmb3JtIiwiZnJhbWV3b3JrIiwibGFuZ3VhZ2UiLCJzZXJ2ZXIiLCJyZXF1ZXN0SW5mbyIsImxvY2F0aW9uIiwiaHJlZiIsInF1ZXJ5X3N0cmluZyIsInJlbW90ZVN0cmluZyIsInVzZXJfaXAiLCJuYXYiLCJuYXZpZ2F0b3IiLCJzY3IiLCJzY3JlZW4iLCJydW50aW1lX21zIiwidGltZXN0YW1wIiwiX3JvbGxiYXJTdGFydFRpbWUiLCJNYXRoIiwicm91bmQiLCJqYXZhc2NyaXB0IiwiYnJvd3NlciIsInVzZXJBZ2VudCIsImNvb2tpZV9lbmFibGVkIiwiY29va2llRW5hYmxlZCIsIndpZHRoIiwiaGVpZ2h0IiwicGx1Z2lucyIsIm5hdlBsdWdpbnMiLCJjdXIiLCJ0cmFjZUNoYWluIiwiYWRkQm9keVRyYWNlQ2hhaW4iLCJhZGRCb2R5VHJhY2UiLCJhZGRCb2R5TWVzc2FnZSIsInJlc3VsdCIsImJvZHkiLCJleHRyYSIsInN0YWNrRnJvbUl0ZW0iLCJ0cmFjZXMiLCJ0cmFjZUNoYWluTGVuZ3RoIiwidHJhY2UiLCJidWlsZFRyYWNlIiwidHJhY2VfY2hhaW4iLCJndWVzcyIsImd1ZXNzRXJyb3JDbGFzcyIsImNsYXNzTmFtZSIsImVycm9yQ2xhc3MiLCJleGNlcHRpb24iLCJyYXdTdGFjayIsInJhdyIsInJhd0V4Y2VwdGlvbiIsInN0YWNrRnJhbWUiLCJmcmFtZSIsImNvZGUiLCJwcmUiLCJjb250ZXh0TGVuZ3RoIiwibWlkIiwiZnJhbWVzIiwiZmlsZW5hbWUiLCJzYW5pdGl6ZVVybCIsImxpbmUiLCJmdW5jIiwiY29sdW1uIiwic2VuZEZyYW1lVXJsIiwiZW5kc1dpdGgiLCJmbG9vciIsInNjcnViRm4iLCJzY3J1YlBhdGhzIiwibWFrZUZldGNoUmVxdWVzdCIsIm1ha2VYaHJSZXF1ZXN0IiwicGFyYW1zIiwicmVxdWVzdEZhY3RvcnkiLCJhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aCIsImZvcm1hdFVybCIsIl9tYWtlWm9uZVJlcXVlc3QiLCJ3cml0ZURhdGEiLCJyb290Wm9uZSIsIlpvbmUiLCJyb290IiwicnVuIiwiX21ha2VSZXF1ZXN0IiwiUm9sbGJhclByb3h5IiwiX3Byb3h5UmVxdWVzdCIsImpzb24iLCJyb2xsYmFyUHJveHkiLCJfbXNnIiwiY29udHJvbGxlciIsInRpbWVvdXRJZCIsImlzRmluaXRlTnVtYmVyIiwiQWJvcnRDb250cm9sbGVyIiwiYWJvcnQiLCJoZWFkZXJzIiwic2lnbmFsIiwicmVzcG9uc2UiLCJjbGVhclRpbWVvdXQiLCJyZXF1ZXN0IiwiX2NyZWF0ZVhNTEhUVFBPYmplY3QiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwicGFyc2VSZXNwb25zZSIsImpzb25QYXJzZSIsInJlc3BvbnNlVGV4dCIsIl9pc1N1Y2Nlc3MiLCJfaXNOb3JtYWxGYWlsdXJlIiwic3RhdHVzIiwibXNnIiwiX25ld1JldHJpYWJsZUVycm9yIiwiZXgiLCJvcGVuIiwic2V0UmVxdWVzdEhlYWRlciIsImUxIiwiWERvbWFpblJlcXVlc3QiLCJ4ZG9tYWlucmVxdWVzdCIsIm9ucHJvZ3Jlc3MiLCJvbnRpbWVvdXQiLCJvbmxvYWQiLCJmYWN0b3JpZXMiLCJBY3RpdmVYT2JqZWN0IiwieG1saHR0cCIsIm51bUZhY3RvcmllcyIsImF1dGgiLCJoYXNoIiwicXVlcnkiLCJsYXN0IiwiaW5kZXhPZiIsInNwbGl0IiwicGFyc2VJbnQiLCJwYXRoUGFydHMiLCJtYXhJdGVtcyIsIml0ZW1zUGVyTWluIiwiRXJyb3JTdGFja1BhcnNlciIsIlVOS05PV05fRlVOQ1RJT04iLCJFUlJfQ0xBU1NfUkVHRVhQIiwiUmVnRXhwIiwiZ3Vlc3NGdW5jdGlvbk5hbWUiLCJnYXRoZXJDb250ZXh0IiwiRnJhbWUiLCJfc3RhY2tGcmFtZSIsImZpbGVOYW1lIiwibGluZU51bWJlciIsImZ1bmN0aW9uTmFtZSIsImNvbHVtbk51bWJlciIsInNraXAiLCJnZXRTdGFjayIsInBhcnNlclN0YWNrIiwiX21vc3RTcGVjaWZpY0Vycm9yTmFtZSIsImVyck1zZyIsIm1hdGNoIiwiZXJyQ2xhc3NNYXRjaCIsImVyckNsYXNzIiwicmVwbGFjZSIsImNvbnN0cnVjdG9yTmFtZSIsImhhc093biIsInRvU3RyIiwiaXNQbGFpbk9iamVjdCIsIm9iaiIsImhhc093bkNvbnN0cnVjdG9yIiwiaGFzSXNQcm90b3R5cGVPZiIsInNyYyIsImNvcHkiLCJjbG9uZSIsImN1cnJlbnQiLCJOb3RpZmllciIsImRpYWdub3N0aWMiLCJ0cmFuc2Zvcm0iLCJhZGRQZW5kaW5nSXRlbSIsIl9hcHBseVRyYW5zZm9ybXMiLCJyZW1vdmVQZW5kaW5nSXRlbSIsImFkZEl0ZW0iLCJiaW5kIiwidHJhbnNmb3JtSW5kZXgiLCJ0cmFuc2Zvcm1zTGVuZ3RoIiwiY2IiLCJsZXZlbFZhbCIsIkxFVkVMUyIsInJlcG9ydExldmVsVmFsIiwiaXNVbmNhdWdodCIsIm9uU2VuZENhbGxiYWNrIiwidXJsSXNPbkFMaXN0IiwibWF0Y2hGcmFtZXMiLCJsaXN0IiwiYmxvY2siLCJ1cmxSZWdleCIsImxpc3RMZW5ndGgiLCJmcmFtZUxlbmd0aCIsImoiLCJzYWZlT3JCbG9jayIsImhvc3RCbG9ja0xpc3QiLCJob3N0U2FmZUxpc3QiLCJ0cmFjZXNMZW5ndGgiLCJsaXN0TmFtZSIsImlnbm9yZWRNZXNzYWdlcyIsInJJZ25vcmVkTWVzc2FnZSIsIm1lc3NhZ2VzIiwibWVzc2FnZXNGcm9tSXRlbSIsIlF1ZXVlIiwicmF0ZUxpbWl0ZXIiLCJwZW5kaW5nSXRlbXMiLCJwZW5kaW5nUmVxdWVzdHMiLCJyZXRyeVF1ZXVlIiwicmV0cnlIYW5kbGUiLCJ3YWl0Q2FsbGJhY2siLCJ3YWl0SW50ZXJ2YWxJRCIsInByZWRpY2F0ZSIsImlkeCIsInNwbGljZSIsIm9yaWdpbmFsSXRlbSIsInByZWRpY2F0ZVJlc3VsdCIsIl9hcHBseVByZWRpY2F0ZXMiLCJfbWF5YmVMb2ciLCJfbWFrZUFwaVJlcXVlc3QiLCJfZGVxdWV1ZVBlbmRpbmdSZXF1ZXN0IiwiX2hhbmRsZVJlcGxheVJlc3BvbnNlIiwid2FpdCIsIl9tYXliZUNhbGxXYWl0IiwiY2xlYXJJbnRlcnZhbCIsInNldEludGVydmFsIiwicmF0ZUxpbWl0UmVzcG9uc2UiLCJzaG91bGRTZW5kIiwiX21heWJlUmV0cnkiLCJSRVRSSUFCTEVfRVJST1JTIiwic2hvdWxkUmV0cnkiLCJyZXRyeUludGVydmFsIiwibWF4UmV0cmllcyIsInJldHJpZXMiLCJfcmV0cnlBcGlSZXF1ZXN0IiwicmV0cnlPYmplY3QiLCJzaGlmdCIsIlJhdGVMaW1pdGVyIiwic3RhcnRUaW1lIiwibm93IiwiY291bnRlciIsInBlck1pbkNvdW50ZXIiLCJwbGF0Zm9ybU9wdGlvbnMiLCJjb25maWd1cmVHbG9iYWwiLCJnbG9iYWxTZXR0aW5ncyIsIml0ZW1zUGVyTWludXRlIiwiZWxhcHNlZFRpbWUiLCJnbG9iYWxSYXRlTGltaXQiLCJnbG9iYWxSYXRlTGltaXRQZXJNaW4iLCJjaGVja1JhdGUiLCJzaG91bGRTZW5kVmFsdWUiLCJwZXJNaW51dGUiLCJzZXRQbGF0Zm9ybU9wdGlvbnMiLCJsaW1pdCIsImlnbm9yZVJhdGVMaW1pdCIsImxpbWl0UGVyTWluIiwicmF0ZUxpbWl0UGF5bG9hZCIsInRyYWNlciIsInZhbGlkYXRlVHJhY2VyIiwic2V0U3RhY2tUcmFjZUxpbWl0IiwibGFzdEVycm9ySGFzaCIsIl9kZWZhdWx0TG9nTGV2ZWwiLCJfbG9nIiwiZGVmYXVsdExldmVsIiwiX3NhbWVBc0xhc3RFcnJvciIsIl9hZGRUcmFjaW5nQXR0cmlidXRlcyIsIl9hZGRUcmFjaW5nSW5mbyIsIl9jYXB0dXJlUm9sbGJhckl0ZW0iLCJ0ZWxlbWV0cnlFdmVudHMiLCJjb3B5RXZlbnRzIiwidGVsZW1ldHJ5U3BhbiIsImVuZCIsInN0YXJ0U3BhbiIsIl90aGlzJHRyYWNpbmciLCJzcGFuIiwiZ2V0U3BhbiIsImF0dHJpYnV0ZXMiLCJzZXNzaW9uSWQiLCJzcGFuSWQiLCJ0cmFjZUlkIiwiYWRkSXRlbUF0dHJpYnV0ZXMiLCJhZGRFdmVudCIsIml0ZW1IYXNoIiwiZ2VuZXJhdGVJdGVtSGFzaCIsInNjb3BlIiwiYWN0aXZlIiwidmFsaWRhdGVTcGFuIiwic2V0VGFnIiwib3BlbnRyYWNpbmdTcGFuSWQiLCJ0b1NwYW5JZCIsIm9wZW50cmFjaW5nVHJhY2VJZCIsInRvVHJhY2VJZCIsIm9wZW50cmFjaW5nX3NwYW5faWQiLCJvcGVudHJhY2luZ190cmFjZV9pZCIsInN0YWNrVHJhY2VMaW1pdCIsInNwYW5Db250ZXh0IiwiYnl0ZXMiLCJyYW5kb21CeXRlcyIsIlVpbnQ4QXJyYXkiLCJjcnlwdG8iLCJnZXRSYW5kb21WYWx1ZXMiLCJyYW5kSGV4IiwiZnJvbSIsImJ5dGUiLCJwYWRTdGFydCIsImpvaW4iLCJwYXlsb2FkT3B0aW9ucyIsInRyYWNlUGF0aCIsIm5ld0V4dHJhIiwibmV3SXRlbSIsImlzUHJvbWlzZSIsInByb21pc2VkSXRlbSIsImNvbmZpZ0tleSIsImFkZEZ1bmN0aW9uT3B0aW9uIiwiY29uZmlndXJlZE9wdGlvbnMiLCJjb25maWd1cmVkX29wdGlvbnMiLCJpc19hbm9ueW1vdXMiLCJpc191bmNhdWdodCIsInJhd19lcnJvciIsImNvbnN0cnVjdG9yX25hbWUiLCJmYWlsZWQiLCJSb2xsYmFySlNPTiIsImlzRGVmaW5lZCIsIkpTT04iLCJpc05hdGl2ZUZ1bmN0aW9uIiwieCIsInR5cGVOYW1lIiwidG9Mb3dlckNhc2UiLCJyZVJlZ0V4cENoYXIiLCJmdW5jTWF0Y2hTdHJpbmciLCJGdW5jdGlvbiIsInJlSXNOYXRpdmUiLCJpc09iamVjdCIsImlzU3RyaW5nIiwiaXNGaW5pdGUiLCJpc0l0ZXJhYmxlIiwicmVkYWN0IiwidXVpZDQiLCJyYW5kb20iLCJiYXNlVXJsUGFydHMiLCJwYXJzZVVyaSIsImFuY2hvciIsInNvdXJjZSIsInBhcnNlVXJpT3B0aW9ucyIsInN0cmljdE1vZGUiLCJxIiwicGFyc2VyIiwic3RyaWN0IiwibG9vc2UiLCJzdHIiLCJtIiwiZXhlYyIsInVyaSIsIiQwIiwiJDEiLCIkMiIsImFjY2Vzc190b2tlbiIsInBhcmFtc0FycmF5IiwiayIsInNvcnQiLCJxcyIsImJhY2t1cCIsImpzb25FcnJvciIsImJhY2t1cEVycm9yIiwibWF4Qnl0ZVNpemUiLCJzdHJpbmciLCJjb3VudCIsImNoYXJDb2RlQXQiLCJtb2RlIiwiYmFja3VwTWVzc2FnZSIsInVzZXJhZ2VudCIsIndyYXBDYWxsYmFjayIsIm5vbkNpcmN1bGFyQ2xvbmUiLCJzZWVuIiwibmV3U2VlbiIsImluY2x1ZGVzIiwicmVxdWVzdEtleXMiLCJsYW1iZGFDb250ZXh0IiwiZXh0cmFBcmdzIiwiYXJnVHlwZXMiLCJ0eXAiLCJET01FeGNlcHRpb24iLCJzZXRDdXN0b21JdGVtS2V5cyIsIm9yaWdpbmFsX2FyZ190eXBlcyIsImVycm9ycyIsImNvbnRleHRBZGRlZCIsInJvbGxiYXJDb250ZXh0IiwiZXJyb3JfY29udGV4dCIsIlRFTEVNRVRSWV9UWVBFUyIsIlRFTEVNRVRSWV9MRVZFTFMiLCJhcnJheUluY2x1ZGVzIiwiYXJyIiwidmFsIiwiX2l0ZW0kZGF0YSRhdHRyaWJ1dGVzIiwiX3RvQ29uc3VtYWJsZUFycmF5IiwidGVtcCIsInJlcGxhY2VtZW50IiwiZmlsdGVySXAiLCJyZXF1ZXN0RGF0YSIsIm5ld0lwIiwicGFydHMiLCJiZWdpbm5pbmciLCJzbGFzaElkeCIsInRlcm1pbmFsIiwiaW5wdXQiLCJ1cGRhdGVEZXByZWNhdGVkT3B0aW9ucyIsIm92ZXJ3cml0ZVNjcnViRmllbGRzIiwiaG9zdFdoaXRlTGlzdCIsImhvc3RCbGFja0xpc3QiXSwic291cmNlUm9vdCI6IiJ9