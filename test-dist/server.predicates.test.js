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

/***/ "./node_modules/assert/assert.js":
/*!***************************************!*\
  !*** ./node_modules/assert/assert.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (__webpack_require__.g.Buffer && typeof __webpack_require__.g.Buffer.isBuffer === 'function') {
    return __webpack_require__.g.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = __webpack_require__(/*! util/ */ "./node_modules/util/util.js");
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof __webpack_require__.g.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};


/***/ }),

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/***/ ((module) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),

/***/ "./node_modules/eyes/lib/eyes.js":
/*!***************************************!*\
  !*** ./node_modules/eyes/lib/eyes.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

//
// Eyes.js - a customizable value inspector for Node.js
//
//   usage:
//
//       var inspect = require('eyes').inspector({styles: {all: 'magenta'}});
//       inspect(something); // inspect with the settings passed to `inspector`
//
//     or
//
//       var eyes = require('eyes');
//       eyes.inspect(something); // inspect with the default settings
//
var eyes = exports,
    stack = [];

eyes.defaults = {
    styles: {                 // Styles applied to stdout
        all:     'cyan',      // Overall style applied to everything
        label:   'underline', // Inspection labels, like 'array' in `array: [1, 2, 3]`
        other:   'inverted',  // Objects which don't have a literal representation, such as functions
        key:     'bold',      // The keys in object literals, like 'a' in `{a: 1}`
        special: 'grey',      // null, undefined...
        string:  'green',
        number:  'magenta',
        bool:    'blue',      // true false
        regexp:  'green',     // /\d+/
    },
    pretty: true,             // Indent object literals
    hideFunctions: false,
    showHidden: false,
    stream: process.stdout,
    maxLength: 2048           // Truncate output if longer
};

// Return a curried inspect() function, with the `options` argument filled in.
eyes.inspector = function (options) {
    var that = this;
    return function (obj, label, opts) {
        return that.inspect.call(that, obj, label,
            merge(options || {}, opts || {}));
    };
};

// If we have a `stream` defined, use it to print a styled string,
// if not, we just return the stringified object.
eyes.inspect = function (obj, label, options) {
    options = merge(this.defaults, options || {});

    if (options.stream) {
        return this.print(stringify(obj, options), label, options);
    } else {
        return stringify(obj, options) + (options.styles ? '\033[39m' : '');
    }
};

// Output using the 'stream', and an optional label
// Loop through `str`, and truncate it after `options.maxLength` has been reached.
// Because escape sequences are, at this point embeded within
// the output string, we can't measure the length of the string
// in a useful way, without separating what is an escape sequence,
// versus a printable character (`c`). So we resort to counting the
// length manually.
eyes.print = function (str, label, options) {
    for (var c = 0, i = 0; i < str.length; i++) {
        if (str.charAt(i) === '\033') { i += 4 } // `4` because '\033[25m'.length + 1 == 5
        else if (c === options.maxLength) {
           str = str.slice(0, i - 1) + '…';
           break;
        } else { c++ }
    }
    return options.stream.write.call(options.stream, (label ?
        this.stylize(label, options.styles.label, options.styles) + ': ' : '') +
        this.stylize(str,   options.styles.all, options.styles) + '\033[0m' + "\n");
};

// Apply a style to a string, eventually,
// I'd like this to support passing multiple
// styles.
eyes.stylize = function (str, style, styles) {
    var codes = {
        'bold'      : [1,  22],
        'underline' : [4,  24],
        'inverse'   : [7,  27],
        'cyan'      : [36, 39],
        'magenta'   : [35, 39],
        'blue'      : [34, 39],
        'yellow'    : [33, 39],
        'green'     : [32, 39],
        'red'       : [31, 39],
        'grey'      : [90, 39]
    }, endCode;

    if (style && codes[style]) {
        endCode = (codes[style][1] === 39 && styles.all) ? codes[styles.all][0]
                                                         : codes[style][1];
        return '\033[' + codes[style][0] + 'm' + str +
               '\033[' + endCode + 'm';
    } else { return str }
};

// Convert any object to a string, ready for output.
// When an 'array' or an 'object' are encountered, they are
// passed to specialized functions, which can then recursively call
// stringify().
function stringify(obj, options) {
    var that = this, stylize = function (str, style) {
        return eyes.stylize(str, options.styles[style], options.styles)
    }, index, result;

    if ((index = stack.indexOf(obj)) !== -1) {
        return stylize(new(Array)(stack.length - index + 1).join('.'), 'special');
    }
    stack.push(obj);

    result = (function (obj) {
        switch (typeOf(obj)) {
            case "string"   : obj = stringifyString(obj.indexOf("'") === -1 ? "'" + obj + "'"
                                                                            : '"' + obj + '"');
                              return stylize(obj, 'string');
            case "regexp"   : return stylize('/' + obj.source + '/', 'regexp');
            case "number"   : return stylize(obj + '',    'number');
            case "function" : return options.stream ? stylize("Function", 'other') : '[Function]';
            case "null"     : return stylize("null",      'special');
            case "undefined": return stylize("undefined", 'special');
            case "boolean"  : return stylize(obj + '',    'bool');
            case "date"     : return stylize(obj.toUTCString());
            case "array"    : return stringifyArray(obj,  options, stack.length);
            case "object"   : return stringifyObject(obj, options, stack.length);
        }
    })(obj);

    stack.pop();
    return result;
};

// Escape invisible characters in a string
function stringifyString (str, options) {
    return str.replace(/\\/g, '\\\\')
              .replace(/\n/g, '\\n')
              .replace(/[\u0001-\u001F]/g, function (match) {
                  return '\\0' + match[0].charCodeAt(0).toString(8);
              });
}

// Convert an array to a string, such as [1, 2, 3].
// This function calls stringify() for each of the elements
// in the array.
function stringifyArray(ary, options, level) {
    var out = [];
    var pretty = options.pretty && (ary.length > 4 || ary.some(function (o) {
        return (o !== null && typeof(o) === 'object' && Object.keys(o).length > 0) ||
               (Array.isArray(o) && o.length > 0);
    }));
    var ws = pretty ? '\n' + new(Array)(level * 4 + 1).join(' ') : ' ';

    for (var i = 0; i < ary.length; i++) {
        out.push(stringify(ary[i], options));
    }

    if (out.length === 0) {
        return '[]';
    } else {
        return '[' + ws
                   + out.join(',' + (pretty ? ws : ' '))
                   + (pretty ? ws.slice(0, -4) : ws) +
               ']';
    }
};

// Convert an object to a string, such as {a: 1}.
// This function calls stringify() for each of its values,
// and does not output functions or prototype values.
function stringifyObject(obj, options, level) {
    var out = [];
    var pretty = options.pretty && (Object.keys(obj).length > 2 ||
                                    Object.keys(obj).some(function (k) { return typeof(obj[k]) === 'object' }));
    var ws = pretty ? '\n' + new(Array)(level * 4 + 1).join(' ') : ' ';

    var keys = options.showHidden ? Object.keys(obj) : Object.getOwnPropertyNames(obj);
    keys.forEach(function (k) {
        if (Object.prototype.hasOwnProperty.call(obj, k) 
          && !(obj[k] instanceof Function && options.hideFunctions)) {
            out.push(eyes.stylize(k, options.styles.key, options.styles) + ': ' +
                     stringify(obj[k], options));
        }
    });

    if (out.length === 0) {
        return '{}';
    } else {
        return "{" + ws
                   + out.join(',' + (pretty ? ws : ' '))
                   + (pretty ? ws.slice(0, -4) : ws) +
               "}";
   }
};

// A better `typeof`
function typeOf(value) {
    var s = typeof(value),
        types = [Object, Array, String, RegExp, Number, Function, Boolean, Date];

    if (s === 'object' || s === 'function') {
        if (value) {
            types.forEach(function (t) {
                if (value instanceof t) { s = t.name.toLowerCase() }
            });
        } else { s = 'null' }
    }
    return s;
}

function merge(/* variable args */) {
    var objs = Array.prototype.slice.call(arguments);
    var target = {};

    objs.forEach(function (o) {
        Object.keys(o).forEach(function (k) {
            if (k === 'styles') {
                if (! o.styles) {
                    target.styles = false;
                } else {
                    target.styles = {}
                    for (var s in o.styles) {
                        target.styles[s] = o.styles[s];
                    }
                }
            } else {
                target[k] = o[k];
            }
        });
    });
    return target;
}



/***/ }),

/***/ "./node_modules/util/node_modules/inherits/inherits_browser.js":
/*!*********************************************************************!*\
  !*** ./node_modules/util/node_modules/inherits/inherits_browser.js ***!
  \*********************************************************************/
/***/ ((module) => {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),

/***/ "./node_modules/util/support/isBufferBrowser.js":
/*!******************************************************!*\
  !*** ./node_modules/util/support/isBufferBrowser.js ***!
  \******************************************************/
/***/ ((module) => {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),

/***/ "./node_modules/util/util.js":
/*!***********************************!*\
  !*** ./node_modules/util/util.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(__webpack_require__.g.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(/*! ./support/isBuffer */ "./node_modules/util/support/isBufferBrowser.js");

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(/*! inherits */ "./node_modules/util/node_modules/inherits/inherits_browser.js");

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}


/***/ }),

/***/ "./node_modules/vows/lib/assert/error.js":
/*!***********************************************!*\
  !*** ./node_modules/vows/lib/assert/error.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

/**
This software contains code adapted from Mocha
(https://github.com/visionmedia/mocha) by TJ Holowaychuk
and is used herein under the following MIT license:

Copyright (c) 2011-2012 TJ Holowaychuk <tj@vision-media.ca>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var stylize = (__webpack_require__(/*! ../vows/console */ "./node_modules/vows/lib/vows/console.js").stylize);
var inspect = (__webpack_require__(/*! ../vows/console */ "./node_modules/vows/lib/vows/console.js").inspect);
var diff = __webpack_require__(/*! diff */ "./node_modules/vows/node_modules/diff/dist/diff.js");

/**
 * Pad the given `str` to `len`.
 *
 * @param {String} str
 * @param {String} len
 * @return {String}
 * @api private
 */

function pad(str, len) {
  str = String(str);
  return Array(len - str.length + 1).join(' ') + str;
}

/**
 * Color lines for `str`, using the color `name`.
 *
 * @param {String} name
 * @param {String} str
 * @return {String}
 * @api private
 */

function styleLines(str, name) {
  return str.split('\n').map(function(str){
    return stylize(str, name);
  }).join('\n');
}

/**
 * Return a character diff for `err`.
 *
 * @param {Error} err
 * @return {String}
 * @api private
 */

function errorDiff(err, type) {
  return diff['diff' + type](err.expected, err.actual).map(function(str){
    if (/^(\n+)$/.test(str.value)) str.value = Array(++RegExp.$1.length).join('<newline>');
    if (str.added) return styleLines(str.value, 'green');
    if (str.removed) return styleLines(str.value, 'red');
    return str.value;
  }).join('');
}

function extractPathFromStack(stack) {
    var regex = /\((.*?[a-zA-Z0-9._-]+\.(?:js|coffee))(:\d+):\d+\)/;
    return stack.match(regex);
}

/*
 Do not override .toString() when this.stack is used,
 otherwise this will end in an endless recursive call...
 See issue https://github.com/cloudhead/vows/issues/278#issuecomment-22837493
*/
(__webpack_require__(/*! assert */ "./node_modules/assert/assert.js").AssertionError).prototype.toStringEx = function () {
    var that = this,
        source;

    if (this.stack) {
        source = extractPathFromStack(this.stack);
    }

    function parse(str) {
        var actual = that.actual,
            expected = that.expected,
            msg, len;

        if (
            'string' === typeof actual &&
            'string' === typeof expected
        ) {
            len = Math.max(actual.length, expected.length);

            if (len < 20) msg = errorDiff(that, 'Chars');
            else msg = errorDiff(that, 'Words');

            // linenos
            var lines = msg.split('\n');
            if (lines.length > 4) {
                var width = String(lines.length).length;
                msg = lines.map(function(str, i){
                    return pad(++i, width) + ' |' + ' ' + str;
                }).join('\n');
            }

            // legend
            msg = '\n'
                + stylize('actual', 'green')
                + ' '
                + stylize('expected', 'red')
                + '\n\n'
                + msg
                + '\n';

            // indent
            msg = msg.replace(/^/gm, '      ');

            return msg;
        }

        actual = inspect(actual, {showHidden: actual instanceof Error});

        if (expected instanceof Function) {
            expected = expected.name;
        }
        else {
            expected = inspect(expected, {showHidden: actual instanceof Error});
        }

        return str.replace(/{actual}/g,   actual).
                   replace(/{operator}/g, stylize(that.operator, 'bold')).
                   replace(/{expected}/g, expected);
    }

    if (this.message) {
        var msg = stylize(parse(this.message), 'yellow');
      	if (source) {
      		  msg += stylize(' // ' + source[1] + source[2], 'grey');
      	}
        return msg;
    } else {
        return stylize([
            this.expected,
            this.operator,
            this.actual
        ].join(' '), 'yellow');
    }
};



/***/ }),

/***/ "./node_modules/vows/lib/assert/macros.js":
/*!************************************************!*\
  !*** ./node_modules/vows/lib/assert/macros.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var assert = __webpack_require__(/*! assert */ "./node_modules/assert/assert.js"),
    utils = __webpack_require__(/*! ./utils */ "./node_modules/vows/lib/assert/utils.js");

var messages = {
    'equal'       : "expected {expected},\n\tgot\t {actual} ({operator})",
    'notEqual'    : "didn't expect {actual} ({operator})"
};
messages['strictEqual']    = messages['deepEqual']    = messages['equal'];
messages['notStrictEqual'] = messages['notDeepEqual'] = messages['notEqual'];

for (var key in messages) {
    assert[key] = (function (key, callback) {
        return function (actual, expected, message) {
            callback(actual, expected, message || messages[key]);
        };
    })(key, assert[key]);
}

assert.epsilon = function (eps, actual, expected, message) {
    assertMissingArguments(arguments, assert.epsilon);
    if (isNaN(eps)) {
        assert.fail(actual, expected, message || "cannot compare {actual} with {expected} \u00B1 NaN");
    } else if (isNaN(actual) || Math.abs(actual - expected) > eps) {
        assert.fail(actual, expected, message || "expected {expected} \u00B1"+ eps +", but was {actual}");
    }
};

assert.ok = (function (callback) {
    assertMissingArguments(arguments, assert.ok);
    return function (actual, message) {
        callback(actual, message ||  "expected expression to evaluate to {expected}, but was {actual}");
    };
})(assert.ok);

assert.match = function (actual, expected, message) {
    assertMissingArguments(arguments, assert.match);
    if (! expected.test(actual)) {
        assert.fail(actual, expected, message || "expected {actual} to match {expected}", "match", assert.match);
    }
};
assert.matches = assert.match;

assert.isTrue = function (actual, message) {
    assertMissingArguments(arguments, assert.isTrue);
    if (actual !== true) {
        assert.fail(actual, true, message || "expected {expected}, got {actual}", "===", assert.isTrue);
    }
};
assert.isFalse = function (actual, message) {
    assertMissingArguments(arguments, assert.isFalse);
    if (actual !== false) {
        assert.fail(actual, false, message || "expected {expected}, got {actual}", "===", assert.isFalse);
    }
};
assert.isZero = function (actual, message) {
    assertMissingArguments(arguments, assert.isZero);
    if (actual !== 0) {
        assert.fail(actual, 0, message || "expected {expected}, got {actual}", "===", assert.isZero);
    }
};
assert.isNotZero = function (actual, message) {
    assertMissingArguments(arguments, assert.isNotZero);
    if (actual === 0) {
        assert.fail(actual, 0, message || "expected non-zero value, got {actual}", "===", assert.isNotZero);
    }
};

assert.greater = function (actual, expected, message) {
    assertMissingArguments(arguments, assert.greater);
    if (actual <= expected) {
        assert.fail(actual, expected, message || "expected {actual} to be greater than {expected}", ">", assert.greater);
    }
};
assert.lesser = function (actual, expected, message) {
    assertMissingArguments(arguments, assert.lesser);
    if (actual >= expected) {
        assert.fail(actual, expected, message || "expected {actual} to be lesser than {expected}", "<", assert.lesser);
    }
};

assert.inDelta = function (actual, expected, delta, message) {
    assertMissingArguments(arguments, assert.inDelta);
    var lower = expected - delta;
    var upper = expected + delta;
    if (actual != +actual || actual < lower || actual > upper) {
        assert.fail(actual, expected, message || "expected {actual} to be in within *" + delta.toString() + "* of {expected}", null, assert.inDelta);
    }
};

//
// Inclusion
//
assert.include = function (actual, expected, message) {
    assertMissingArguments(arguments, assert.include);
    if ((function (obj) {
        if (isArray(obj) || isString(obj)) {
            return obj.indexOf(expected) === -1;
        } else if (isObject(actual)) {
            return ! obj.hasOwnProperty(expected);
        }
        return true;
    })(actual)) {
        assert.fail(actual, expected, message || "expected {actual} to include {expected}", "include", assert.include);
    }
};
assert.includes = assert.include;

assert.notInclude = function (actual, expected, message) {
    assertMissingArguments(arguments, assert.notInclude);
    if ((function (obj) {
        if (isArray(obj) || isString(obj)) {
            return obj.indexOf(expected) !== -1;
        } else if (isObject(actual)) {
            return obj.hasOwnProperty(expected);
        }
        return true;
    })(actual)) {
        assert.fail(actual, expected, message || "expected {actual} not to include {expected}", "include", assert.notInclude);
    }
};
assert.notIncludes = assert.notInclude;

assert.deepInclude = function (actual, expected, message) {
    assertMissingArguments(arguments, assert.deepInclude);
    if (!isArray(actual)) {
        return assert.include(actual, expected, message);
    }
    if (!actual.some(function (item) { return utils.deepEqual(item, expected) })) {
        assert.fail(actual, expected, message || "expected {actual} to include {expected}", "include", assert.deepInclude);
    }
};
assert.deepIncludes = assert.deepInclude;

//
// Length
//
assert.isEmpty = function (actual, message) {
    assertMissingArguments(arguments, assert.isEmpty);
    if ((isObject(actual) && Object.keys(actual).length > 0) || actual.length > 0) {
        assert.fail(actual, 0, message || "expected {actual} to be empty", "length", assert.isEmpty);
    }
};
assert.isNotEmpty = function (actual, message) {
    assertMissingArguments(arguments, assert.isNotEmpty);
    if ((isObject(actual) && Object.keys(actual).length === 0) || actual.length === 0) {
        assert.fail(actual, 0, message || "expected {actual} to be not empty", "length", assert.isNotEmpty);
    }
};

assert.lengthOf = function (actual, expected, message) {
    assertMissingArguments(arguments, assert.lengthOf);
    var len = isObject(actual) ? Object.keys(actual).length : actual.length;
    if (len !== expected) {
        assert.fail(actual, expected, message || "expected {actual} to have {expected} element(s)", "length", assert.length);
    }
};

//
// Type
//
assert.isArray = function (actual, message) {
    assertMissingArguments(arguments, assert.isArray);
    assertTypeOf(actual, 'array', message || "expected {actual} to be an Array", assert.isArray);
};
assert.isObject = function (actual, message) {
    assertMissingArguments(arguments, assert.isObject);
    assertTypeOf(actual, 'object', message || "expected {actual} to be an Object", assert.isObject);
};
assert.isNumber = function (actual, message) {
    assertMissingArguments(arguments, assert.isNumber);
    if (isNaN(actual)) {
        assert.fail(actual, 'number', message || "expected {actual} to be of type {expected}", "isNaN", assert.isNumber);
    } else {
        assertTypeOf(actual, 'number', message || "expected {actual} to be a Number", assert.isNumber);
    }
};
assert.isBoolean = function (actual, message) {
    assertMissingArguments(arguments, assert.isBoolean);
    if (actual !== true && actual !== false) {
        assert.fail(actual, 'boolean', message || "expected {actual} to be a Boolean", "===", assert.isBoolean);
    }
};
assert.isNaN = function (actual, message) {
    assertMissingArguments(arguments, assert.isNaN);
    if (actual === actual) {
        assert.fail(actual, 'NaN', message || "expected {actual} to be NaN", "===", assert.isNaN);
    }
};
assert.isNull = function (actual, message) {
    assertMissingArguments(arguments, assert.isNull);
    if (actual !== null) {
        assert.fail(actual, null, message || "expected {expected}, got {actual}", "===", assert.isNull);
    }
};
assert.isNotNull = function (actual, message) {
    assertMissingArguments(arguments, assert.isNotNull);
    if (actual === null) {
        assert.fail(actual, null, message || "expected non-null value, got {actual}", "===", assert.isNotNull);
    }
};
assert.isUndefined = function (actual, message) {
    assertMissingArguments(arguments, assert.isUndefined);
    if (actual !== undefined) {
        assert.fail(actual, undefined, message || "expected {actual} to be {expected}", "===", assert.isUndefined);
    }
};
assert.isDefined = function (actual, message) {
    assertMissingArguments(arguments, assert.isDefined);
    if(actual === undefined) {
        assert.fail(actual, 0, message || "expected {actual} to be defined", "===", assert.isDefined);
    }
};
assert.isString = function (actual, message) {
    assertMissingArguments(arguments, assert.isString);
    assertTypeOf(actual, 'string', message || "expected {actual} to be a String", assert.isString);
};
assert.isFunction = function (actual, message) {
    assertMissingArguments(arguments, assert.isFunction);
    assertTypeOf(actual, 'function', message || "expected {actual} to be a Function", assert.isFunction);
};
assert.typeOf = function (actual, expected, message) {
    assertMissingArguments(arguments, assert.typeOf);
    assertTypeOf(actual, expected, message, assert.typeOf);
};
assert.instanceOf = function (actual, expected, message) {
    assertMissingArguments(arguments, assert.instanceof);
    if (! (actual instanceof expected)) {
        assert.fail(actual, expected, message || "expected {actual} to be an instance of {expected}", "instanceof", assert.instanceOf);
    }
};

//
// Utility functions
//

function assertMissingArguments(args, caller) {
    if (args.length === 0) {
        assert.fail("", "", "expected number of arguments to be greater than zero", "", caller);
    }
}

function assertTypeOf(actual, expected, message, caller) {
    if (typeOf(actual) !== expected) {
        assert.fail(actual, expected, message || "expected {actual} to be of type {expected}", "typeOf", caller);
    }
}

function isArray (obj) {
    return Array.isArray(obj);
}

function isString (obj) {
    return typeof(obj) === 'string' || obj instanceof String;
}

function isObject (obj) {
    return typeof(obj) === 'object' && obj && !isArray(obj);
}

// A better `typeof`
function typeOf(value) {
    var s = typeof(value),
        types = [Object, Array, String, RegExp, Number, Function, Boolean, Date];

    if (s === 'object' || s === 'function') {
        if (value) {
            types.forEach(function (t) {
                if (value instanceof t) { s = t.name.toLowerCase() }
            });
        } else { s = 'null' }
    }
    return s;
}


/***/ }),

/***/ "./node_modules/vows/lib/assert/utils.js":
/*!***********************************************!*\
  !*** ./node_modules/vows/lib/assert/utils.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {


// Taken from node/lib/assert.js
exports.deepEqual = function (actual, expected) {
  if (actual === expected) {
    return true;

  } else if (Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }
    return true;

  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return actual == expected;

  } else {
    return objEquiv(actual, expected);
  }
}

// Taken from node/lib/assert.js
exports.notDeepEqual = function (actual, expected, message) {
  if (exports.deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
}

// Taken from node/lib/assert.js
function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

// Taken from node/lib/assert.js
function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

// Taken from node/lib/assert.js
function objEquiv(a, b) {
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  if (a.prototype !== b.prototype) return false;
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return exports.deepEqual(a, b);
  }
  try {
    var ka = Object.keys(a),
        kb = Object.keys(b),
        key, i;
  } catch (e) {
    return false;
  }
  if (ka.length != kb.length)
    return false;
  ka.sort();
  kb.sort();
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!exports.deepEqual(a[key], b[key])) return false;
  }
  return true;
}



/***/ }),

/***/ "./node_modules/vows/lib/vows.js":
/*!***************************************!*\
  !*** ./node_modules/vows/lib/vows.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __dirname = "/";
//
// Vows.js - asynchronous event-based BDD for node.js
//
//   usage:
//
//       var vows = require('vows');
//
//       vows.describe('Deep Thought').addBatch({
//           "An instance of DeepThought": {
//               topic: new DeepThought,
//
//               "should know the answer to the ultimate question of life": function (deepThought) {
//                   assert.equal (deepThought.question('what is the answer to the universe?'), 42);
//               }
//           }
//       }).run();
//
var path = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'path'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())),
    events = __webpack_require__(/*! events */ "./node_modules/events/events.js"),
    util = __webpack_require__(/*! util */ "./node_modules/util/util.js"),
    vows = exports;

// Options
vows.options = {
    Emitter: events.EventEmitter,
    reporter: __webpack_require__(/*! ./vows/reporters/dot-matrix */ "./node_modules/vows/lib/vows/reporters/dot-matrix.js"),
    matcher: /.*/,
    error: true // Handle "error" event
};

vows.__defineGetter__('reporter', function () {
    return vows.options.reporter;
});

var stylize = (__webpack_require__(/*! ./vows/console */ "./node_modules/vows/lib/vows/console.js").stylize);
var console = vows.console = __webpack_require__(/*! ./vows/console */ "./node_modules/vows/lib/vows/console.js");

vows.inspect = (__webpack_require__(/*! ./vows/console */ "./node_modules/vows/lib/vows/console.js").inspect);
vows.prepare = (__webpack_require__(/*! ./vows/extras */ "./node_modules/vows/lib/vows/extras.js").prepare);
vows.tryEnd  = (__webpack_require__(/*! ./vows/suite */ "./node_modules/vows/lib/vows/suite.js").tryEnd);

//
// Assertion Macros & Extensions
//
__webpack_require__(/*! ./assert/error */ "./node_modules/vows/lib/assert/error.js");
__webpack_require__(/*! ./assert/macros */ "./node_modules/vows/lib/assert/macros.js");

//
// Suite constructor
//
var Suite = (__webpack_require__(/*! ./vows/suite */ "./node_modules/vows/lib/vows/suite.js").Suite);

//
// This function gets added to events.EventEmitter.prototype, by default.
// It's essentially a wrapper around `on`, which adds all the specification
// goodness.
//
function addVow(vow) {
    var batch = vow.batch,
        event = vow.binding.context.event || 'success',
        self = this;

    batch.total ++;
    batch.vows.push(vow);

    // always set a listener on the event
    this.on(event, function () {
        if(vow.caughtError)
            return;

        var args = Array.prototype.slice.call(arguments);
        // If the vow is a sub-event then we know it is an
        // emitted event.  So I don't muck with the arguments
        // However the legacy behavior:
        // If the callback is expecting two or more arguments,
        // pass the error as the first (null) and the result after.
        if (!(this.ctx && this.ctx.isEvent) &&
            vow.callback.length >= 2 && batch.suite.options.error) {
            args.unshift(null);
        }
        runTest(args, this.ctx);
        vows.tryEnd(batch);
    });

    if (event !== 'error') {
        this.on("error", function (err) {
            vow.caughtError = true;
            if (vow.callback.length >= 2 || !batch.suite.options.error) {
                runTest(arguments, this.ctx);
            } else {
                output('errored', { type: 'emitter', error: err.stack ||
                       err.message || JSON.stringify(err) });
            }
            vows.tryEnd(batch);
        });
    }

    // in case an event fired before we could listen
    if (this._vowsEmitedEvents &&
        this._vowsEmitedEvents.hasOwnProperty(event)) {
        // make sure no one is messing with me
        if (Array.isArray(this._vowsEmitedEvents[event])) {
            // I don't think I need to optimize for one event,
            // I think it is more important to make sure I check the vow n times
            self._vowsEmitedEvents[event].forEach(function(args) {
                runTest(args, self.ctx);
            });
        } else {
            // initial conditions problem
            throw new Error('_vowsEmitedEvents[' + event + '] is not an Array')
        }
        vows.tryEnd(batch);
    }

    return this;

    function runTest(args, ctx) {
        if (vow.callback instanceof String) {
            return output('pending');
        }

        if (vow.binding.context.isEvent && vow.binding.context.after) {
            var after = vow.binding.context.after;
            // only need to check order.  I won't get here if the after event
            // has never been emitted
            if (self._vowsEmitedEventsOrder.indexOf(after) >
                self._vowsEmitedEventsOrder.indexOf(event)) {
                output('broken', event + ' emitted before ' + after);
                return;
            }
        }

        // Run the test, and try to catch `AssertionError`s and other exceptions;
        // increment counters accordingly.
        try {
            vow.callback.apply(ctx === __webpack_require__.g || !ctx ? vow.binding : ctx, args);
            output('honored');
        } catch (e) {
            if (e.name && e.name.match(/AssertionError/)) {
                output('broken', e.toStringEx().replace(/\`/g, '`'));
            } else {
                output('errored', e.stack || e.message || e);
            }
        }
    }

    function output(status, exception) {
        batch[status] ++;
        vow.status = status;

        if (vow.context && batch.lastContext !== vow.context) {
            batch.lastContext = vow.context;
            batch.suite.report(['context', vow.context]);
        }
        batch.suite.report(['vow', {
            title: vow.description,
            context: vow.context,
            status: status,
            exception: exception || null
        }]);
    }
};

//
// On exit, check that all emitters have been fired.
// If not, report an error message.
//
process.on('exit', function () {
    var results = { honored: 0, broken: 0, errored: 0, pending: 0, total: 0 },
        failure;

    vows.suites.forEach(function (s) {
        if ((s.results.total > 0) && (s.results.time === null)) {
            s.reporter.print('\n\n');
            s.reporter.report(['error', { error: "Asynchronous Error", suite: s }]);
        }
        s.batches.forEach(function (b) {
            var unFired = [];

            b.vows.forEach(function (vow) {
                if (! vow.status) {
                    if (unFired.indexOf(vow.context) === -1) {
                        unFired.push(vow.context);
                    }
                }
            });

            if (unFired.length > 0) { util.print('\n'); }

            unFired.forEach(function (title) {
                s.reporter.report(['error', {
                    error: "callback not fired",
                    context: title,
                    batch: b,
                    suite: s
                }]);
            });

            if (b.status === 'begin') {
                failure = true;
                results.errored ++;
                results.total ++;
            }
            Object.keys(results).forEach(function (k) { results[k] += b[k] });
        });
    });
    if (failure) {
        util.puts(console.result(results));
        process.exit(1);
    }
});

vows.suites = [];

// We need the old emit function so we can hook it
// and do magic to deal with events that have fired
var oldEmit = vows.options.Emitter.prototype.emit;

//
// Create a new test suite
//
vows.describe = function (subject) {
    var suite = new(Suite)(subject);

    this.options.Emitter.prototype.addVow = addVow;
    // just in case someone emit's before I get to it
    this.options.Emitter.prototype.emit = function (event) {
        this._vowsEmitedEvents = this._vowsEmitedEvents || {};
        this._vowsEmitedEventsOrder = this._vowsEmitedEventsOrder || [];
        // slice off the event
        var args = Array.prototype.slice.call(arguments, 1);
        // if multiple events are fired, add or push
        if (this._vowsEmitedEvents.hasOwnProperty(event)) {
            this._vowsEmitedEvents[event].push(args);
        } else {
            this._vowsEmitedEvents[event] = [args];
        }

        // push the event onto a stack so I have an order
        this._vowsEmitedEventsOrder.push(event);
        return oldEmit.apply(this, arguments);
    }
    this.suites.push(suite);

    //
    // Add any additional arguments as batches if they're present
    //
    if (arguments.length > 1) {
        for (var i = 1, l = arguments.length; i < l; ++i) {
            suite.addBatch(arguments[i]);
        }
    }

    return suite;
};


vows.version = JSON.parse(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'fs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(path.join(__dirname, '..', 'package.json')))
                          .version


/***/ }),

/***/ "./node_modules/vows/lib/vows/console.js":
/*!***********************************************!*\
  !*** ./node_modules/vows/lib/vows/console.js ***!
  \***********************************************/
/***/ (function(module, exports, __webpack_require__) {

var eyes = (__webpack_require__(/*! eyes */ "./node_modules/eyes/lib/eyes.js").inspector)({ stream: null, styles: false });

// Stylize a string
this.stylize = function stylize(str, style) {
    if (module.exports.nocolor) {
      return str;
    }

    var styles = {
        'bold'      : [1,  22],
        'italic'    : [3,  23],
        'underline' : [4,  24],
        'cyan'      : [96, 39],
        'yellow'    : [33, 39],
        'green'     : [32, 39],
        'red'       : [31, 39],
        'grey'      : [90, 39],
        'green-hi'  : [92, 32],
    };
    return '\033[' + styles[style][0] + 'm' + str +
           '\033[' + styles[style][1] + 'm';
};

var $ = this.$ = function (str) {
    str = new(String)(str);

    ['bold', 'grey', 'yellow', 'red', 'green', 'white', 'cyan', 'italic'].forEach(function (style) {
        Object.defineProperty(str, style, {
            get: function () {
                return exports.$(exports.stylize(this, style));
            }
        });
    });
    return str;
};

this.puts = function (options) {
    var stylize = exports.stylize;
    options.stream || (options.stream = process.stdout);
    options.tail = options.tail || '';

    return function (args) {
        args = Array.prototype.slice.call(arguments);
        if (!options.raw) {
            args = args.map(function (a) {
                return a.replace(/`([^`]+)`/g,   function (_, capture) { return stylize(capture, 'italic') })
                        .replace(/\*([^*]+)\*/g, function (_, capture) { return stylize(capture, 'bold') })
                        .replace(/\n/g, function (_, capture) { return ' \n  ' } );
            });
        }
        return options.stream.write(args.join('\n') + options.tail);
    };
};

this.log = this.puts({});

this.result = function (event) {
    var result = [], buffer = [], time = '', header;
    var complete = event.honored + event.pending + event.errored + event.broken;
    var status = (event.errored && 'errored') || (event.broken && 'broken') ||
                 (event.honored && 'honored') || (event.pending && 'pending');

    if (event.total === 0) {
        return [$("Could not find any tests to run.").bold.red];
    }

    event.honored && result.push($(event.honored).bold + " honored");
    event.broken  && result.push($(event.broken).bold  + " broken");
    event.errored && result.push($(event.errored).bold + " errored");
    event.pending && result.push($(event.pending).bold + " pending");

    if (complete < event.total) {
        result.push($(event.total - complete).bold + " dropped");
    }

    result = result.join(' ∙ ');

    header = {
        honored: '✓ ' + $('OK').bold.green,
        broken:  '✗ ' + $('Broken').bold.yellow,
        errored: '✗ ' + $('Errored').bold.red,
        pending: '- ' + $('Pending').bold.cyan
    }[status] + ' » ';

    if (typeof(event.time) === 'number') {
        time = ' (' + event.time.toFixed(3) + 's)';
        time = this.stylize(time, 'grey');
    }
    buffer.push(header + result + time + '\n');

    return buffer;
};

this.inspect = function inspect(val) {
    if (module.exports.nocolor) {
      return eyes(val);
    }

    return '\033[1m' + eyes(val) + '\033[22m';
};

this.error = function (obj) {
    var string  = '✗ ' + $('Errored ').red + '» ';
        string += $(obj.error).red.bold                         + '\n';
        string += (obj.context ? '    in ' + $(obj.context).red + '\n': '');
        string += '    in ' + $(obj.suite.subject).red          + '\n';
        string += '    in ' + $(obj.suite._filename).red;

    return string;
};

this.contextText = function (event) {
    return '  ' + event;
};

this.vowText = function (event) {
    var buffer = [];

    buffer.push('   ' + {
        honored: ' ✓ ',
        broken:  ' ✗ ',
        errored: ' ✗ ',
        pending: ' - '
    }[event.status] + this.stylize(event.title, ({
        honored: 'green',
        broken:  'yellow',
        errored: 'red',
        pending: 'cyan'
    })[event.status]));

    if (event.status === 'broken') {
        buffer.push('      » ' + event.exception);
    } else if (event.status === 'errored') {
        if (event.exception.type === 'emitter') {
            buffer.push('      » ' + this.stylize("An unexpected error was caught: " +
                           this.stylize(event.exception.error, 'bold'), 'red'));
        } else {
            buffer.push('    ' + this.stylize(event.exception, 'red'));
        }
    }
    return buffer.join('\n');
};


/***/ }),

/***/ "./node_modules/vows/lib/vows/context.js":
/*!***********************************************!*\
  !*** ./node_modules/vows/lib/vows/context.js ***!
  \***********************************************/
/***/ (function() {


this.Context = function (vow, ctx, env) {
    var that = this;

    this.tests = vow.callback;
    this.topics = (ctx.topics || []).slice(0);
    this.emitter = null;
    this.env = env || {};
    this.env.context = this;

    this.env.callback = function (/* arguments */) {
        var ctx = this;
        var args = Array.prototype.slice.call(arguments);

        var emit = (function (args) {
            //
            // Convert callback-style results into events.
            //
            if (vow.batch.suite.options.error) {
                return function () {
                    var e = args.shift();
                    that.emitter.ctx = ctx;
                    // We handle a special case, where the first argument is a
                    // boolean, in which case we treat it as a result, and not
                    // an error. This is useful for `path.exists` and other
                    // functions like it, which only pass a single boolean
                    // parameter instead of the more common (error, result) pair.
                    if (typeof(e) === 'boolean' && args.length === 0) {
                        that.emitter.emit.call(that.emitter, 'success', e);
                    } else {
                        if (e) { that.emitter.emit.apply(that.emitter, ['error', e].concat(args)) }
                        else   { that.emitter.emit.apply(that.emitter, ['success'].concat(args)) }
                    }
                };
            } else {
                return function () {
                    that.emitter.ctx = ctx;
                    that.emitter.emit.apply(that.emitter, ['success'].concat(args));
                };
            }
        })(args.slice(0));
        // If `this.callback` is called synchronously,
        // the emitter will not have been set yet,
        // so we defer the emition, that way it'll behave
        // asynchronously.
        if (that.emitter) { emit() }
        else              { process.nextTick(emit) }
    };
    this.name = vow.description;
    // events is an alias for on
    if (this.name === 'events') {
      this.name = vow.description = 'on';
    }

    // if this is a sub-event context AND it's context was an event,
    // then I must enforce event order.
    // this will not do a good job of handling pin-pong events
    if (this.name === 'on' && ctx.isEvent) {
        this.after = ctx.name;
    }

    if (ctx.name === 'on') {
        this.isEvent = true;
        this.event = this.name;
        this.after = ctx.after;
    } else {
        this.isEvent = false;
        this.event = 'success';
    }

    this.title = [
        ctx.title || '',
        vow.description || ''
    ].join(/^[#.:]/.test(vow.description) ? '' : ' ').trim();
};



/***/ }),

/***/ "./node_modules/vows/lib/vows/extras.js":
/*!**********************************************!*\
  !*** ./node_modules/vows/lib/vows/extras.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var events = __webpack_require__(/*! events */ "./node_modules/events/events.js");
//
// Wrap a Node.js style async function into an EventEmitter
//
this.prepare = function (obj, targets) {
    targets.forEach(function (target) {
        if (target in obj) {
            obj[target] = (function (fun) {
                return function () {
                    var args = Array.prototype.slice.call(arguments);
                    var ee = new(events.EventEmitter);

                    args.push(function (err /* [, data] */) {
                        var args = Array.prototype.slice.call(arguments, 1);

                        if (err) { ee.emit.apply(ee, ['error', err].concat(args)) }
                        else     { ee.emit.apply(ee, ['success'].concat(args)) }
                    });
                    fun.apply(obj, args);

                    return ee;
                };
            })(obj[target]);
        }
    });
    return obj;
};



/***/ }),

/***/ "./node_modules/vows/lib/vows/reporters sync recursive ^\\.\\/.*$":
/*!*************************************************************!*\
  !*** ./node_modules/vows/lib/vows/reporters/ sync ^\.\/.*$ ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./dot-matrix": "./node_modules/vows/lib/vows/reporters/dot-matrix.js",
	"./dot-matrix.js": "./node_modules/vows/lib/vows/reporters/dot-matrix.js",
	"./json": "./node_modules/vows/lib/vows/reporters/json.js",
	"./json.js": "./node_modules/vows/lib/vows/reporters/json.js",
	"./silent": "./node_modules/vows/lib/vows/reporters/silent.js",
	"./silent.js": "./node_modules/vows/lib/vows/reporters/silent.js",
	"./spec": "./node_modules/vows/lib/vows/reporters/spec.js",
	"./spec.js": "./node_modules/vows/lib/vows/reporters/spec.js",
	"./tap": "./node_modules/vows/lib/vows/reporters/tap.js",
	"./tap.js": "./node_modules/vows/lib/vows/reporters/tap.js",
	"./watch": "./node_modules/vows/lib/vows/reporters/watch.js",
	"./watch.js": "./node_modules/vows/lib/vows/reporters/watch.js",
	"./xunit": "./node_modules/vows/lib/vows/reporters/xunit.js",
	"./xunit.js": "./node_modules/vows/lib/vows/reporters/xunit.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./node_modules/vows/lib/vows/reporters sync recursive ^\\.\\/.*$";

/***/ }),

/***/ "./node_modules/vows/lib/vows/reporters/dot-matrix.js":
/*!************************************************************!*\
  !*** ./node_modules/vows/lib/vows/reporters/dot-matrix.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var options = { tail: '' },
    console = __webpack_require__(/*! ../../vows/console */ "./node_modules/vows/lib/vows/console.js"),
    stylize = console.stylize,
    puts = console.puts(options);
//
// Console reporter
//
var messages = [], lastContext;

this.name = 'dot-matrix';
this.setStream = function (s) {
    options.stream = s;
};

this.reset = function () {
    messages = [];
    lastContext = null;
};
this.report = function (data) {
    var event = data[1];

    switch (data[0]) {
        case 'subject':
            // messages.push(stylize(event, 'underline') + '\n');
            break;
        case 'context':
            break;
        case 'vow':
            if (event.status === 'honored') {
                puts(stylize('·', 'green'));
            } else if (event.status === 'pending') {
                puts(stylize('-', 'cyan'));
            } else {
                if (lastContext !== event.context) {
                    lastContext = event.context;
                    messages.push('  ' + event.context);
                }
                if (event.status === 'broken') {
                    puts(stylize('✗', 'yellow'));
                    messages.push(console.vowText(event));
                } else if (event.status === 'errored') {
                    puts(stylize('✗', 'red'));
                    messages.push(console.vowText(event));
                }
                messages.push('');
            }
            break;
        case 'end':
            puts(' ');
            break;
        case 'finish':
            if (messages.length) {
                puts('\n\n' + messages.join('\n'));
            } else {
                puts('');
            }
            puts(console.result(event).join('\n'));
            break;
        case 'error':
            puts(console.error(event));
            break;
    }
};

this.print = function (str) {
    puts(str);
};


/***/ }),

/***/ "./node_modules/vows/lib/vows/reporters/json.js":
/*!******************************************************!*\
  !*** ./node_modules/vows/lib/vows/reporters/json.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var options = { tail: '\n', raw: true };
var console = __webpack_require__(/*! ../../vows/console */ "./node_modules/vows/lib/vows/console.js");
var puts = console.puts(options);

//
// Console JSON reporter
//
this.name = 'json';
this.setStream = function (s) {
    options.stream = s;
};

function removeCircularSuite(obj, suite) {
    var result = {};

    if (typeof obj !== 'object' || obj === null) return obj;

    Object.keys(obj).forEach(function(key) {
        if (obj[key] === suite) {
            result[key] = {};
        } else {
            result[key] = removeCircularSuite(obj[key], suite || obj.suite);
        }
    });

    return result;
};

this.report = function (obj) {
    puts(JSON.stringify(removeCircularSuite(obj)));
};

this.print = function (str) {};


/***/ }),

/***/ "./node_modules/vows/lib/vows/reporters/silent.js":
/*!********************************************************!*\
  !*** ./node_modules/vows/lib/vows/reporters/silent.js ***!
  \********************************************************/
/***/ (function() {

//
// Silent reporter - "Shhh"
//
this.name      = 'silent';
this.setStream = function () {};
this.reset     = function () {};
this.report    = function () {};
this.print     = function () {};



/***/ }),

/***/ "./node_modules/vows/lib/vows/reporters/spec.js":
/*!******************************************************!*\
  !*** ./node_modules/vows/lib/vows/reporters/spec.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var util = __webpack_require__(/*! util */ "./node_modules/util/util.js");

var options = { tail: '\n' };
var console = __webpack_require__(/*! ../../vows/console */ "./node_modules/vows/lib/vows/console.js");
var stylize = console.stylize,
    puts = console.puts(options);
//
// Console reporter
//

this.name = 'spec';
this.setStream = function (s) {
    options.stream = s;
};
this.report = function (data) {
    var event = data[1];

    switch (data[0]) {
        case 'subject':
            puts('\n♢ ' + stylize(event, 'bold') + '\n');
            break;
        case 'context':
            puts(console.contextText(event));
            break;
        case 'vow':
            puts(console.vowText(event));
            break;
        case 'end':
            this.print('\n');
            break;
        case 'finish':
            puts(console.result(event).join('\n'));
            break;
        case 'error':
            puts(console.error(event));
            break;
    }
};

this.print = function (str) {
    process.stdout.write(str);
};


/***/ }),

/***/ "./node_modules/vows/lib/vows/reporters/tap.js":
/*!*****************************************************!*\
  !*** ./node_modules/vows/lib/vows/reporters/tap.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var options = {
  tail: "\n"
};
var console = __webpack_require__(/*! ../console */ "./node_modules/vows/lib/vows/console.js");
var stylize = console.stylize;
var puts    = console.puts(options);

//
// TAP Reporter
//

this.name = "tap";
this.setStream = function setStream(s) {
  options.stream = s;
};

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
var TapInterface = (function() {
  function TapInterface() {
    this.genOutput_ = __bind(this.genOutput_, this);
    this.testCount = __bind(this.testCount, this);
    this.bailOut = __bind(this.bailOut, this);
    this.skip = __bind(this.skip, this);
    this.notOk = __bind(this.notOk, this);
    this.ok = __bind(this.ok, this);
    this.count_ = 0;
  }

  TapInterface.prototype.ok = function(description) {
    return this.genOutput_("ok", ++this.count_, "- " + description);
  };

  TapInterface.prototype.notOk = function(description) {
    return this.genOutput_("not ok", ++this.count_, "- " + description);
  };

  TapInterface.prototype.skip = function(description) {
    return this.genOutput_("ok", ++this.count_, "# SKIP " + description);
  };

  TapInterface.prototype.bailOut = function(reason) {
    return "Bail out!" + (reason !== null ? " " + reason : "");
  };

  TapInterface.prototype.testCount = function() {
    return "1.." + this.count_;
  };

  TapInterface.prototype.genOutput_ = function(status, testNumber, description) {
    return "" + status + " " + testNumber + " " + description;
  };

  return TapInterface;
})();

var tap = new TapInterface();

this.report = function report(data) {
  var type  = data[0];
  var event = data[1];
  switch (type) {
    case "subject":
      puts("# " + stylize(event, "bold"));
      break;
    case "context":
      puts("# " + event);
      break;
    case "vow":
      switch (event.status) {
        case "honored":
          puts(tap.ok(event.title));
          break;
        case "pending":
          puts(tap.skip(event.title));
          break;
        case "broken":
          puts(tap.notOk(event.title + "\n# " + event.exception));
          break;
        case "errored":
          puts(tap.notOk(event.title));
          puts(tap.bailOut(event.exception));
          break;
      }
      break;
    case "end":
      puts("\n");
      break;
    case "finish":
      puts(tap.testCount());
      break;
    case "error":
      puts("#> Errored");
      puts("# " + JSON.stringify(data));
      break;
  }
};

this.print = function print(str) {
  (__webpack_require__(/*! util */ "./node_modules/util/util.js").print)(str);
};


/***/ }),

/***/ "./node_modules/vows/lib/vows/reporters/watch.js":
/*!*******************************************************!*\
  !*** ./node_modules/vows/lib/vows/reporters/watch.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var options = {};
var console = __webpack_require__(/*! ../../vows/console */ "./node_modules/vows/lib/vows/console.js");
var spec = __webpack_require__(/*! ../../vows/reporters/spec */ "./node_modules/vows/lib/vows/reporters/spec.js");
var stylize = console.stylize,
    puts = console.puts(options);
//
// Console reporter
//
var lastContext;

this.name = 'watch';
this.setStream = function (s) {
    options.stream = s;
};
this.reset = function () {
    lastContext = null;
};
this.report = function (data) {
    var event = data[1];

    switch (data[0]) {
        case 'vow':
            if (['honored', 'pending'].indexOf(event.status) === -1) {
                if (lastContext !== event.context) {
                    lastContext = event.context;
                    puts(console.contextText(event.context));
                }
                puts(console.vowText(event));
                puts('');
            }
            break;
        case 'error':
            puts(console.error(event));
            break;
    }
};
this.print = function (str) {};


/***/ }),

/***/ "./node_modules/vows/lib/vows/reporters/xunit.js":
/*!*******************************************************!*\
  !*** ./node_modules/vows/lib/vows/reporters/xunit.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

// xunit outoput for vows, so we can run things under hudson
//
// The translation to xunit is simple.  Most likely more tags/attributes can be
// added, see: http://ant.1045680.n5.nabble.com/schema-for-junit-xml-output-td1375274.html
//

var options = { tail: '\n', raw: true };
var console = __webpack_require__(/*! ../../vows/console */ "./node_modules/vows/lib/vows/console.js");
var puts = console.puts(options);

var buffer       = [],
    curSubject   = null;

function xmlEnc(value) {
    return !value ? value : String(value).replace(/&/g, "&amp;")
                                         .replace(/>/g, "&gt;")
                                         .replace(/</g, "&lt;")
                                         .replace(/"/g, "&quot;")
                                         .replace(/\u001b\[\d{1,2}m/g, '');
}

function tag(name, attribs, single, content) {
    var strAttr = [], t, end = '>';
    for (var attr in attribs) {
        if (attribs.hasOwnProperty(attr)) {
            strAttr.push(attr + '="' + xmlEnc(attribs[attr]) + '"');
        }
    }
    if (single) {
        end = ' />';
    }
    if (strAttr.length) {
        t = '<' + name + ' ' + strAttr.join(' ') + end;
    } else {
        t = '<' + name + end;
    }
    if (typeof content !== 'undefined') {
        return t + content + '</' + name + end;
    }
    return t;
}

function end(name) {
    return '</' + name + '>';
}

function cdata(data) {
    return '<![CDATA[' + xmlEnc(data) + ']]>';
}

this.name = 'xunit';
this.setStream = function (s) {
  options.stream = s;
};
this.report = function (data) {
    var event = data[1];

    switch (data[0]) {
    case 'subject':
        curSubject = event;
        break;
    case 'context':
        break;
    case 'vow':
        switch (event.status) {
        case 'honored':
            buffer.push(tag('testcase', {classname: curSubject, name: event.context + ': ' + event.title}, true));
            break;
        case 'broken':
            var err = tag('error', {type: 'vows.event.broken', message: 'Broken test'}, false, cdata(event.exception));
            buffer.push(tag('testcase', {classname: curSubject, name: event.context + ': ' + event.title}, false, err));
            break;
        case 'errored':
            var skip = tag('skipped', {type: 'vows.event.errored', message: 'Errored test'}, false, cdata(event.exception));
            buffer.push(tag('testcase', {classname: curSubject, name: event.context + ': ' + event.title}, false, skip));
            break;
        case 'pending':
            // nop
            break;
        }
        break;
    case 'end':
        buffer.push(end('testcase'));
        break;
    case 'finish':
        buffer.unshift(tag('testsuite', {name: 'Vows test', tests: event.total, timestamp: (new Date()).toUTCString(), errors: event.errored, failures: event.broken, skip: event.pending, time: event.time}));
        buffer.push(end('testsuite'));
        puts(buffer.join('\n'));
        break;
    case 'error':
        break;
    }
};

this.print = function (str) { };


/***/ }),

/***/ "./node_modules/vows/lib/vows/suite.js":
/*!*********************************************!*\
  !*** ./node_modules/vows/lib/vows/suite.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var events = __webpack_require__(/*! events */ "./node_modules/events/events.js"),
    path = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'path'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

var vows = __webpack_require__(/*! ../vows */ "./node_modules/vows/lib/vows.js");
var Context = (__webpack_require__(/*! ../vows/context */ "./node_modules/vows/lib/vows/context.js").Context);

this.Suite = function (subject) {
    this.subject = subject;
    this.matcher = /.*/;
    this.reporter = __webpack_require__(/*! ./reporters/dot-matrix */ "./node_modules/vows/lib/vows/reporters/dot-matrix.js");
    this.batches = [];
    this.options = { error: true };
    this.reset();
};

this.Suite.prototype = new(function () {
    this.reset = function () {
        this.results = {
            honored: 0,
            broken:  0,
            errored: 0,
            pending: 0,
            total:   0,
            time:  null
        };
        this.batches.forEach(function (b) {
            b.lastContext = null;
            b.remaining = b._remaining;
            b.honored = b.broken = b.errored = b.total = b.pending = 0;
            b.vows.forEach(function (vow) { vow.status = null });
            b.teardowns = [];
        });
    };

    this.addBatch = function (tests) {
        this.batches.push({
            tests: tests,
            suite:  this,
            vows:     [],
            remaining: 0,
           _remaining: 0,
            honored:   0,
            broken:    0,
            errored:   0,
            pending:   0,
            total:     0,
            teardowns: []
        });
        return this;
    };
    this.addVows = this.addBatch;

    this.parseBatch = function (batch, matcher) {
        var tests = batch.tests;

        if ('topic' in tests) {
            throw new(Error)("missing top-level context.");
        }
        // Count the number of vows/emitters expected to fire,
        // so we know when the tests are over.
        // We match the keys against `matcher`, to decide
        // whether or not they should be included in the test.
        // Any key, including assertion function keys can be matched.
        // If a child matches, then the n parent topics must not be skipped.
        (function count(tests, _match) {
            var match = false;

            var keys = Object.keys(tests).filter(function (k) {
                return k !== 'topic' && k !== 'teardown';
            });

            for (var i = 0, key; i < keys.length; i++) {
                key = keys[i];

                // If the parent node, or this one matches.
                match = _match || matcher.test(key);

                if (typeof(tests[key]) === 'object') {
                    match = count(tests[key], match);
                } else {
                    if (typeof(tests[key]) === 'string') {
                        tests[key] = new(String)(tests[key]);
                    }
                    if (! match) {
                        tests[key]._skip = true;
                    }
                }
            }

            // If any of the children matched,
            // don't skip this node.
            for (var i = 0; i < keys.length; i++) {
                if (! tests[keys[i]]._skip) { match = true }
            }

            if (match) { batch.remaining ++ }
            else       { tests._skip = true }

            return match;
        })(tests, false);

        batch._remaining = batch.remaining;
    };

    this.runBatch = function (batch) {
        var topic,
            tests   = batch.tests,
            emitter = batch.emitter = new(events.EventEmitter);

        var that = this;

        batch.status = 'begin';

        // The test runner, it calls itself recursively, passing the
        // previous context to the inner contexts. This is so the `topic`
        // functions have access to all the previous context topics in their
        // arguments list.
        // It is defined and invoked at the same time.
        // If it encounters a `topic` function, it waits for the returned
        // emitter to emit (the topic), at which point it runs the functions under it,
        // passing the topic as an argument.
        (function run(ctx, lastTopic) {
            var old = false;
            topic = ctx.tests.topic;

            if (typeof(topic) === 'function') {
                if (ctx.isEvent || ctx.name === 'on') {
                    throw new Error('Event context cannot contain a topic');
                }

                // Run the topic, passing the previous context topics
                try {
                    topic = topic.apply(ctx.env, ctx.topics);
                }
                // If an unexpected error occurs in the topic, set the return
                // value to 'undefined' and call back with the error
                catch (ex) {
                    ctx.env.callback(ex);
                    topic = undefined;
                }

                if (typeof(topic) === 'undefined') { ctx._callback = true }
            }

            // If this context has a topic, store it in `lastTopic`,
            // if not, use the last topic, passed down by a parent
            // context.
            if (typeof(topic) !== 'undefined' || ctx._callback) {
                lastTopic = topic;
            } else {
                old   = true;
                topic = lastTopic;
            }

            // If the topic doesn't return an event emitter (such as an EventEmitter),
            // we create it ourselves, and emit the value on the next tick.
            if (! (topic &&
                   topic.constructor === events.EventEmitter)) {
                // If the context is a traditional vow, then a topic can ONLY
                // be an EventEmitter.  However if the context is a sub-event
                // then the topic may be an instanceof EventEmitter
                if (!ctx.isEvent ||
                   (ctx.isEvent && !(topic instanceof events.EventEmitter))) {

                      ctx.emitter = new(events.EventEmitter);

                      if (! ctx._callback) {
                          process.nextTick(function (val) {
                              return function () {
                                ctx.emitter.emit("success", val)
                              };
                          }(topic));
                      }
                      // if I have a callback, push the new topic back up to
                      // lastTopic
                      if (ctx._callback) {
                          lastTopic = topic = ctx.emitter;
                      } else {
                          topic = ctx.emitter;
                      }
                }
            }

            topic.on(ctx.event, function (val) {
                // Once the topic fires, add the return value
                // to the beginning of the topics list, so it
                // becomes the first argument for the next topic.
                // If we're using the parent topic, no need to
                // prepend it to the topics list, or we'll get
                // duplicates.
                if (!old || ctx.isEvent) {
                    Array.prototype.unshift.apply(ctx.topics, arguments)
                };
            });
            if (topic.setMaxListeners) { topic.setMaxListeners(Infinity) }
            // Now run the tests, or sub-contexts
            Object.keys(ctx.tests).filter(function (k) {
                return ctx.tests[k] && k !== 'topic'    &&
                                       k !== 'teardown' && !ctx.tests[k]._skip;
            }).forEach(function (item) {
                // Create a new evaluation context,
                // inheriting from the parent one.
                var env = Object.create(ctx.env);
                env.suite = that;

                // Holds the current test or context
                var vow = Object.create({
                    callback: ctx.tests[item],
                    context: ctx.title,
                    description: item,
                    binding: ctx.env,
                    status: null,
                    batch: batch
                });

                // If we encounter a function, add it to the callbacks
                // of the `topic` function, so it'll get called once the
                // topic fires.
                // If we encounter an object literal, we recurse, sending it
                // our current context.
                if ((typeof(vow.callback) === 'function') ||
                    (vow.callback instanceof String)) {
                    topic.addVow(vow);
                } else if (typeof(vow.callback) === 'object') {
                    // If there's a setup stage, we have to wait for it to fire,
                    // before calling the inner context.
                    // If the event has already fired, the context is 'on' or
                    // there is no setup stage, just run the inner context
                    // synchronously.
                    if (topic &&
                        ctx.name !== 'on' &&
                        (!topic._vowsEmitedEvents || !topic._vowsEmitedEvents.hasOwnProperty(ctx.event))) {
                        var runInnerContext = function(ctx){
                            return function(val){
                                return run(new (Context)(vow, ctx, env), lastTopic);
                            };
                        }(ctx);
                        topic.on(ctx.event, runInnerContext);
                        // Run an inner context if the outer context fails, too.
                        topic.on('error', runInnerContext);
                    }
                    else {
                        run(new (Context)(vow, ctx, env), lastTopic);
                    }
                }
            });
            // Teardown
            if (ctx.tests.teardown) {
                batch.teardowns.push(ctx);
            }
            if (! ctx.tests._skip) {
                batch.remaining --;
            }
            // Check if we're done running the tests
            exports.tryEnd(batch);
        // This is our initial, empty context
        })(new(Context)({ callback: tests, context: null, description: null }, {}));
        return emitter;
    };

    this.report = function () {
        return this.reporter.report.apply(this.reporter, arguments);
    };

    this.run = function (options, callback) {
        var that = this, start;

        options = options || {};

        Object.keys(options).forEach(function (k) {
            that.options[k] = options[k];
        });

        this.matcher = this.options.matcher  || this.matcher;

        if (options.reporter) {
          try {
            this.reporter = typeof options.reporter === 'string'
                ? __webpack_require__("./node_modules/vows/lib/vows/reporters sync recursive ^\\.\\/.*$")("./" + options.reporter)
                : options.reporter;
          } catch (e) {
            console.log('Reporter was not found, defaulting to dot-matrix.');
          }
        }

        this.batches.forEach(function (batch) {
            that.parseBatch(batch, that.matcher);
        });

        this.reset();

        start = new(Date);

        if (this.batches.filter(function (b) { return b.remaining > 0 }).length) {
            this.report(['subject', this.subject]);
        }

        return (function run(batches) {
            var batch = batches.shift();

            if (batch) {
                // If the batch has no vows to run,
                // go to the next one.
                if (batch.remaining === 0) {
                    run(batches);
                } else {
                    that.runBatch(batch).on('end', function () {
                        run(batches);
                    });
                }
            } else {
                that.results.time = (new(Date) - start) / 1000;
                that.report(['finish', that.results]);

                if (callback) { callback(that.results) }

                if (that.results.honored + that.results.pending === that.results.total) {
                    return 0;
                } else {
                    return 1;
                }
            }
        })(this.batches.slice(0));
    };

    this.runParallel = function () {};

    this.export = function (module, options) {
        var that = this;

        Object.keys(options || {}).forEach(function (k) {
            that.options[k] = options[k];
        });

        if (__webpack_require__.c[__webpack_require__.s] === module) {
            return this.run();
        } else {
            return module.exports[this.subject] = this;
        }
    };
    this.exportTo = function (module, options) { // Alias, for JSLint
        return this.export(module, options);
    };
});

//
// Checks if all the tests in the batch have been run,
// and triggers the next batch (if any), by emitting the 'end' event.
//
this.tryEnd = function (batch) {
    var result, style, time;

    if (batch.honored + batch.broken + batch.errored + batch.pending === batch.total &&
        batch.remaining === 0) {

        Object.keys(batch).forEach(function (k) {
            (k in batch.suite.results) && (batch.suite.results[k] += batch[k]);
        });

        if (batch.teardowns) {
            for (var i = batch.teardowns.length - 1, ctx; i >= 0; i--) {
                runTeardown(batch.teardowns[i]);
            }

            maybeFinish();
        }

        function runTeardown(teardown) {
            var env = Object.create(teardown.env);

            Object.defineProperty(env, "callback", {
                get: function () {
                    teardown.awaitingCallback = true;

                    return function () {
                        teardown.awaitingCallback = false;
                        maybeFinish();
                    };
                }
            });

            teardown.tests.teardown.apply(env, teardown.topics);
        }

        function maybeFinish() {
            var pending = batch.teardowns.filter(function (teardown) {
                return teardown.awaitingCallback;
            });

            if (pending.length === 0) {
                finish();
            }
        }

        function finish() {
            batch.status = 'end';
            batch.suite.report(['end']);
            batch.emitter.emit('end', batch.honored, batch.broken, batch.errored, batch.pending);
        }
    }
};


/***/ }),

/***/ "./node_modules/vows/node_modules/diff/dist/diff.js":
/*!**********************************************************!*\
  !*** ./node_modules/vows/node_modules/diff/dist/diff.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports) {

/*!

 diff v4.0.1

Software License Agreement (BSD License)

Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>

All rights reserved.

Redistribution and use of this software in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above
  copyright notice, this list of conditions and the
  following disclaimer.

* Redistributions in binary form must reproduce the above
  copyright notice, this list of conditions and the
  following disclaimer in the documentation and/or other
  materials provided with the distribution.

* Neither the name of Kevin Decker nor the names of its
  contributors may be used to endorse or promote products
  derived from this software without specific prior
  written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
@license
*/
(function (global, factory) {
   true ? factory(exports) :
  0;
}(this, function (exports) { 'use strict';

  function Diff() {}
  Diff.prototype = {
    diff: function diff(oldString, newString) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var callback = options.callback;

      if (typeof options === 'function') {
        callback = options;
        options = {};
      }

      this.options = options;
      var self = this;

      function done(value) {
        if (callback) {
          setTimeout(function () {
            callback(undefined, value);
          }, 0);
          return true;
        } else {
          return value;
        }
      } // Allow subclasses to massage the input prior to running


      oldString = this.castInput(oldString);
      newString = this.castInput(newString);
      oldString = this.removeEmpty(this.tokenize(oldString));
      newString = this.removeEmpty(this.tokenize(newString));
      var newLen = newString.length,
          oldLen = oldString.length;
      var editLength = 1;
      var maxEditLength = newLen + oldLen;
      var bestPath = [{
        newPos: -1,
        components: []
      }]; // Seed editLength = 0, i.e. the content starts with the same values

      var oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);

      if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
        // Identity per the equality and tokenizer
        return done([{
          value: this.join(newString),
          count: newString.length
        }]);
      } // Main worker method. checks all permutations of a given edit length for acceptance.


      function execEditLength() {
        for (var diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {
          var basePath = void 0;

          var addPath = bestPath[diagonalPath - 1],
              removePath = bestPath[diagonalPath + 1],
              _oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;

          if (addPath) {
            // No one else is going to attempt to use this value, clear it
            bestPath[diagonalPath - 1] = undefined;
          }

          var canAdd = addPath && addPath.newPos + 1 < newLen,
              canRemove = removePath && 0 <= _oldPos && _oldPos < oldLen;

          if (!canAdd && !canRemove) {
            // If this path is a terminal then prune
            bestPath[diagonalPath] = undefined;
            continue;
          } // Select the diagonal that we want to branch from. We select the prior
          // path whose position in the new string is the farthest from the origin
          // and does not pass the bounds of the diff graph


          if (!canAdd || canRemove && addPath.newPos < removePath.newPos) {
            basePath = clonePath(removePath);
            self.pushComponent(basePath.components, undefined, true);
          } else {
            basePath = addPath; // No need to clone, we've pulled it from the list

            basePath.newPos++;
            self.pushComponent(basePath.components, true, undefined);
          }

          _oldPos = self.extractCommon(basePath, newString, oldString, diagonalPath); // If we have hit the end of both strings, then we are done

          if (basePath.newPos + 1 >= newLen && _oldPos + 1 >= oldLen) {
            return done(buildValues(self, basePath.components, newString, oldString, self.useLongestToken));
          } else {
            // Otherwise track this path as a potential candidate and continue.
            bestPath[diagonalPath] = basePath;
          }
        }

        editLength++;
      } // Performs the length of edit iteration. Is a bit fugly as this has to support the
      // sync and async mode which is never fun. Loops over execEditLength until a value
      // is produced.


      if (callback) {
        (function exec() {
          setTimeout(function () {
            // This should not happen, but we want to be safe.

            /* istanbul ignore next */
            if (editLength > maxEditLength) {
              return callback();
            }

            if (!execEditLength()) {
              exec();
            }
          }, 0);
        })();
      } else {
        while (editLength <= maxEditLength) {
          var ret = execEditLength();

          if (ret) {
            return ret;
          }
        }
      }
    },
    pushComponent: function pushComponent(components, added, removed) {
      var last = components[components.length - 1];

      if (last && last.added === added && last.removed === removed) {
        // We need to clone here as the component clone operation is just
        // as shallow array clone
        components[components.length - 1] = {
          count: last.count + 1,
          added: added,
          removed: removed
        };
      } else {
        components.push({
          count: 1,
          added: added,
          removed: removed
        });
      }
    },
    extractCommon: function extractCommon(basePath, newString, oldString, diagonalPath) {
      var newLen = newString.length,
          oldLen = oldString.length,
          newPos = basePath.newPos,
          oldPos = newPos - diagonalPath,
          commonCount = 0;

      while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(newString[newPos + 1], oldString[oldPos + 1])) {
        newPos++;
        oldPos++;
        commonCount++;
      }

      if (commonCount) {
        basePath.components.push({
          count: commonCount
        });
      }

      basePath.newPos = newPos;
      return oldPos;
    },
    equals: function equals(left, right) {
      if (this.options.comparator) {
        return this.options.comparator(left, right);
      } else {
        return left === right || this.options.ignoreCase && left.toLowerCase() === right.toLowerCase();
      }
    },
    removeEmpty: function removeEmpty(array) {
      var ret = [];

      for (var i = 0; i < array.length; i++) {
        if (array[i]) {
          ret.push(array[i]);
        }
      }

      return ret;
    },
    castInput: function castInput(value) {
      return value;
    },
    tokenize: function tokenize(value) {
      return value.split('');
    },
    join: function join(chars) {
      return chars.join('');
    }
  };

  function buildValues(diff, components, newString, oldString, useLongestToken) {
    var componentPos = 0,
        componentLen = components.length,
        newPos = 0,
        oldPos = 0;

    for (; componentPos < componentLen; componentPos++) {
      var component = components[componentPos];

      if (!component.removed) {
        if (!component.added && useLongestToken) {
          var value = newString.slice(newPos, newPos + component.count);
          value = value.map(function (value, i) {
            var oldValue = oldString[oldPos + i];
            return oldValue.length > value.length ? oldValue : value;
          });
          component.value = diff.join(value);
        } else {
          component.value = diff.join(newString.slice(newPos, newPos + component.count));
        }

        newPos += component.count; // Common case

        if (!component.added) {
          oldPos += component.count;
        }
      } else {
        component.value = diff.join(oldString.slice(oldPos, oldPos + component.count));
        oldPos += component.count; // Reverse add and remove so removes are output first to match common convention
        // The diffing algorithm is tied to add then remove output and this is the simplest
        // route to get the desired output with minimal overhead.

        if (componentPos && components[componentPos - 1].added) {
          var tmp = components[componentPos - 1];
          components[componentPos - 1] = components[componentPos];
          components[componentPos] = tmp;
        }
      }
    } // Special case handle for when one terminal is ignored (i.e. whitespace).
    // For this case we merge the terminal into the prior string and drop the change.
    // This is only available for string mode.


    var lastComponent = components[componentLen - 1];

    if (componentLen > 1 && typeof lastComponent.value === 'string' && (lastComponent.added || lastComponent.removed) && diff.equals('', lastComponent.value)) {
      components[componentLen - 2].value += lastComponent.value;
      components.pop();
    }

    return components;
  }

  function clonePath(path) {
    return {
      newPos: path.newPos,
      components: path.components.slice(0)
    };
  }

  var characterDiff = new Diff();
  function diffChars(oldStr, newStr, options) {
    return characterDiff.diff(oldStr, newStr, options);
  }

  function generateOptions(options, defaults) {
    if (typeof options === 'function') {
      defaults.callback = options;
    } else if (options) {
      for (var name in options) {
        /* istanbul ignore else */
        if (options.hasOwnProperty(name)) {
          defaults[name] = options[name];
        }
      }
    }

    return defaults;
  }

  //
  // Ranges and exceptions:
  // Latin-1 Supplement, 0080–00FF
  //  - U+00D7  × Multiplication sign
  //  - U+00F7  ÷ Division sign
  // Latin Extended-A, 0100–017F
  // Latin Extended-B, 0180–024F
  // IPA Extensions, 0250–02AF
  // Spacing Modifier Letters, 02B0–02FF
  //  - U+02C7  ˇ &#711;  Caron
  //  - U+02D8  ˘ &#728;  Breve
  //  - U+02D9  ˙ &#729;  Dot Above
  //  - U+02DA  ˚ &#730;  Ring Above
  //  - U+02DB  ˛ &#731;  Ogonek
  //  - U+02DC  ˜ &#732;  Small Tilde
  //  - U+02DD  ˝ &#733;  Double Acute Accent
  // Latin Extended Additional, 1E00–1EFF

  var extendedWordChars = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/;
  var reWhitespace = /\S/;
  var wordDiff = new Diff();

  wordDiff.equals = function (left, right) {
    if (this.options.ignoreCase) {
      left = left.toLowerCase();
      right = right.toLowerCase();
    }

    return left === right || this.options.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right);
  };

  wordDiff.tokenize = function (value) {
    var tokens = value.split(/(\s+|[()[\]{}'"]|\b)/); // Join the boundary splits that we do not consider to be boundaries. This is primarily the extended Latin character set.

    for (var i = 0; i < tokens.length - 1; i++) {
      // If we have an empty string in the next field and we have only word chars before and after, merge
      if (!tokens[i + 1] && tokens[i + 2] && extendedWordChars.test(tokens[i]) && extendedWordChars.test(tokens[i + 2])) {
        tokens[i] += tokens[i + 2];
        tokens.splice(i + 1, 2);
        i--;
      }
    }

    return tokens;
  };

  function diffWords(oldStr, newStr, options) {
    options = generateOptions(options, {
      ignoreWhitespace: true
    });
    return wordDiff.diff(oldStr, newStr, options);
  }
  function diffWordsWithSpace(oldStr, newStr, options) {
    return wordDiff.diff(oldStr, newStr, options);
  }

  var lineDiff = new Diff();

  lineDiff.tokenize = function (value) {
    var retLines = [],
        linesAndNewlines = value.split(/(\n|\r\n)/); // Ignore the final empty token that occurs if the string ends with a new line

    if (!linesAndNewlines[linesAndNewlines.length - 1]) {
      linesAndNewlines.pop();
    } // Merge the content and line separators into single tokens


    for (var i = 0; i < linesAndNewlines.length; i++) {
      var line = linesAndNewlines[i];

      if (i % 2 && !this.options.newlineIsToken) {
        retLines[retLines.length - 1] += line;
      } else {
        if (this.options.ignoreWhitespace) {
          line = line.trim();
        }

        retLines.push(line);
      }
    }

    return retLines;
  };

  function diffLines(oldStr, newStr, callback) {
    return lineDiff.diff(oldStr, newStr, callback);
  }
  function diffTrimmedLines(oldStr, newStr, callback) {
    var options = generateOptions(callback, {
      ignoreWhitespace: true
    });
    return lineDiff.diff(oldStr, newStr, options);
  }

  var sentenceDiff = new Diff();

  sentenceDiff.tokenize = function (value) {
    return value.split(/(\S.+?[.!?])(?=\s+|$)/);
  };

  function diffSentences(oldStr, newStr, callback) {
    return sentenceDiff.diff(oldStr, newStr, callback);
  }

  var cssDiff = new Diff();

  cssDiff.tokenize = function (value) {
    return value.split(/([{}:;,]|\s+)/);
  };

  function diffCss(oldStr, newStr, callback) {
    return cssDiff.diff(oldStr, newStr, callback);
  }

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var objectPrototypeToString = Object.prototype.toString;
  var jsonDiff = new Diff(); // Discriminate between two lines of pretty-printed, serialized JSON where one of them has a
  // dangling comma and the other doesn't. Turns out including the dangling comma yields the nicest output:

  jsonDiff.useLongestToken = true;
  jsonDiff.tokenize = lineDiff.tokenize;

  jsonDiff.castInput = function (value) {
    var _this$options = this.options,
        undefinedReplacement = _this$options.undefinedReplacement,
        _this$options$stringi = _this$options.stringifyReplacer,
        stringifyReplacer = _this$options$stringi === void 0 ? function (k, v) {
      return typeof v === 'undefined' ? undefinedReplacement : v;
    } : _this$options$stringi;
    return typeof value === 'string' ? value : JSON.stringify(canonicalize(value, null, null, stringifyReplacer), stringifyReplacer, '  ');
  };

  jsonDiff.equals = function (left, right) {
    return Diff.prototype.equals.call(jsonDiff, left.replace(/,([\r\n])/g, '$1'), right.replace(/,([\r\n])/g, '$1'));
  };

  function diffJson(oldObj, newObj, options) {
    return jsonDiff.diff(oldObj, newObj, options);
  } // This function handles the presence of circular references by bailing out when encountering an
  // object that is already on the "stack" of items being processed. Accepts an optional replacer

  function canonicalize(obj, stack, replacementStack, replacer, key) {
    stack = stack || [];
    replacementStack = replacementStack || [];

    if (replacer) {
      obj = replacer(key, obj);
    }

    var i;

    for (i = 0; i < stack.length; i += 1) {
      if (stack[i] === obj) {
        return replacementStack[i];
      }
    }

    var canonicalizedObj;

    if ('[object Array]' === objectPrototypeToString.call(obj)) {
      stack.push(obj);
      canonicalizedObj = new Array(obj.length);
      replacementStack.push(canonicalizedObj);

      for (i = 0; i < obj.length; i += 1) {
        canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack, replacer, key);
      }

      stack.pop();
      replacementStack.pop();
      return canonicalizedObj;
    }

    if (obj && obj.toJSON) {
      obj = obj.toJSON();
    }

    if (_typeof(obj) === 'object' && obj !== null) {
      stack.push(obj);
      canonicalizedObj = {};
      replacementStack.push(canonicalizedObj);

      var sortedKeys = [],
          _key;

      for (_key in obj) {
        /* istanbul ignore else */
        if (obj.hasOwnProperty(_key)) {
          sortedKeys.push(_key);
        }
      }

      sortedKeys.sort();

      for (i = 0; i < sortedKeys.length; i += 1) {
        _key = sortedKeys[i];
        canonicalizedObj[_key] = canonicalize(obj[_key], stack, replacementStack, replacer, _key);
      }

      stack.pop();
      replacementStack.pop();
    } else {
      canonicalizedObj = obj;
    }

    return canonicalizedObj;
  }

  var arrayDiff = new Diff();

  arrayDiff.tokenize = function (value) {
    return value.slice();
  };

  arrayDiff.join = arrayDiff.removeEmpty = function (value) {
    return value;
  };

  function diffArrays(oldArr, newArr, callback) {
    return arrayDiff.diff(oldArr, newArr, callback);
  }

  function parsePatch(uniDiff) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var diffstr = uniDiff.split(/\r\n|[\n\v\f\r\x85]/),
        delimiters = uniDiff.match(/\r\n|[\n\v\f\r\x85]/g) || [],
        list = [],
        i = 0;

    function parseIndex() {
      var index = {};
      list.push(index); // Parse diff metadata

      while (i < diffstr.length) {
        var line = diffstr[i]; // File header found, end parsing diff metadata

        if (/^(\-\-\-|\+\+\+|@@)\s/.test(line)) {
          break;
        } // Diff index


        var header = /^(?:Index:|diff(?: -r \w+)+)\s+(.+?)\s*$/.exec(line);

        if (header) {
          index.index = header[1];
        }

        i++;
      } // Parse file headers if they are defined. Unified diff requires them, but
      // there's no technical issues to have an isolated hunk without file header


      parseFileHeader(index);
      parseFileHeader(index); // Parse hunks

      index.hunks = [];

      while (i < diffstr.length) {
        var _line = diffstr[i];

        if (/^(Index:|diff|\-\-\-|\+\+\+)\s/.test(_line)) {
          break;
        } else if (/^@@/.test(_line)) {
          index.hunks.push(parseHunk());
        } else if (_line && options.strict) {
          // Ignore unexpected content unless in strict mode
          throw new Error('Unknown line ' + (i + 1) + ' ' + JSON.stringify(_line));
        } else {
          i++;
        }
      }
    } // Parses the --- and +++ headers, if none are found, no lines
    // are consumed.


    function parseFileHeader(index) {
      var fileHeader = /^(---|\+\+\+)\s+(.*)$/.exec(diffstr[i]);

      if (fileHeader) {
        var keyPrefix = fileHeader[1] === '---' ? 'old' : 'new';
        var data = fileHeader[2].split('\t', 2);
        var fileName = data[0].replace(/\\\\/g, '\\');

        if (/^".*"$/.test(fileName)) {
          fileName = fileName.substr(1, fileName.length - 2);
        }

        index[keyPrefix + 'FileName'] = fileName;
        index[keyPrefix + 'Header'] = (data[1] || '').trim();
        i++;
      }
    } // Parses a hunk
    // This assumes that we are at the start of a hunk.


    function parseHunk() {
      var chunkHeaderIndex = i,
          chunkHeaderLine = diffstr[i++],
          chunkHeader = chunkHeaderLine.split(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
      var hunk = {
        oldStart: +chunkHeader[1],
        oldLines: +chunkHeader[2] || 1,
        newStart: +chunkHeader[3],
        newLines: +chunkHeader[4] || 1,
        lines: [],
        linedelimiters: []
      };
      var addCount = 0,
          removeCount = 0;

      for (; i < diffstr.length; i++) {
        // Lines starting with '---' could be mistaken for the "remove line" operation
        // But they could be the header for the next file. Therefore prune such cases out.
        if (diffstr[i].indexOf('--- ') === 0 && i + 2 < diffstr.length && diffstr[i + 1].indexOf('+++ ') === 0 && diffstr[i + 2].indexOf('@@') === 0) {
          break;
        }

        var operation = diffstr[i].length == 0 && i != diffstr.length - 1 ? ' ' : diffstr[i][0];

        if (operation === '+' || operation === '-' || operation === ' ' || operation === '\\') {
          hunk.lines.push(diffstr[i]);
          hunk.linedelimiters.push(delimiters[i] || '\n');

          if (operation === '+') {
            addCount++;
          } else if (operation === '-') {
            removeCount++;
          } else if (operation === ' ') {
            addCount++;
            removeCount++;
          }
        } else {
          break;
        }
      } // Handle the empty block count case


      if (!addCount && hunk.newLines === 1) {
        hunk.newLines = 0;
      }

      if (!removeCount && hunk.oldLines === 1) {
        hunk.oldLines = 0;
      } // Perform optional sanity checking


      if (options.strict) {
        if (addCount !== hunk.newLines) {
          throw new Error('Added line count did not match for hunk at line ' + (chunkHeaderIndex + 1));
        }

        if (removeCount !== hunk.oldLines) {
          throw new Error('Removed line count did not match for hunk at line ' + (chunkHeaderIndex + 1));
        }
      }

      return hunk;
    }

    while (i < diffstr.length) {
      parseIndex();
    }

    return list;
  }

  // Iterator that traverses in the range of [min, max], stepping
  // by distance from a given start position. I.e. for [0, 4], with
  // start of 2, this will iterate 2, 3, 1, 4, 0.
  function distanceIterator (start, minLine, maxLine) {
    var wantForward = true,
        backwardExhausted = false,
        forwardExhausted = false,
        localOffset = 1;
    return function iterator() {
      if (wantForward && !forwardExhausted) {
        if (backwardExhausted) {
          localOffset++;
        } else {
          wantForward = false;
        } // Check if trying to fit beyond text length, and if not, check it fits
        // after offset location (or desired location on first iteration)


        if (start + localOffset <= maxLine) {
          return localOffset;
        }

        forwardExhausted = true;
      }

      if (!backwardExhausted) {
        if (!forwardExhausted) {
          wantForward = true;
        } // Check if trying to fit before text beginning, and if not, check it fits
        // before offset location


        if (minLine <= start - localOffset) {
          return -localOffset++;
        }

        backwardExhausted = true;
        return iterator();
      } // We tried to fit hunk before text beginning and beyond text length, then
      // hunk can't fit on the text. Return undefined

    };
  }

  function applyPatch(source, uniDiff) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (typeof uniDiff === 'string') {
      uniDiff = parsePatch(uniDiff);
    }

    if (Array.isArray(uniDiff)) {
      if (uniDiff.length > 1) {
        throw new Error('applyPatch only works with a single input.');
      }

      uniDiff = uniDiff[0];
    } // Apply the diff to the input


    var lines = source.split(/\r\n|[\n\v\f\r\x85]/),
        delimiters = source.match(/\r\n|[\n\v\f\r\x85]/g) || [],
        hunks = uniDiff.hunks,
        compareLine = options.compareLine || function (lineNumber, line, operation, patchContent) {
      return line === patchContent;
    },
        errorCount = 0,
        fuzzFactor = options.fuzzFactor || 0,
        minLine = 0,
        offset = 0,
        removeEOFNL,
        addEOFNL;
    /**
     * Checks if the hunk exactly fits on the provided location
     */


    function hunkFits(hunk, toPos) {
      for (var j = 0; j < hunk.lines.length; j++) {
        var line = hunk.lines[j],
            operation = line.length > 0 ? line[0] : ' ',
            content = line.length > 0 ? line.substr(1) : line;

        if (operation === ' ' || operation === '-') {
          // Context sanity check
          if (!compareLine(toPos + 1, lines[toPos], operation, content)) {
            errorCount++;

            if (errorCount > fuzzFactor) {
              return false;
            }
          }

          toPos++;
        }
      }

      return true;
    } // Search best fit offsets for each hunk based on the previous ones


    for (var i = 0; i < hunks.length; i++) {
      var hunk = hunks[i],
          maxLine = lines.length - hunk.oldLines,
          localOffset = 0,
          toPos = offset + hunk.oldStart - 1;
      var iterator = distanceIterator(toPos, minLine, maxLine);

      for (; localOffset !== undefined; localOffset = iterator()) {
        if (hunkFits(hunk, toPos + localOffset)) {
          hunk.offset = offset += localOffset;
          break;
        }
      }

      if (localOffset === undefined) {
        return false;
      } // Set lower text limit to end of the current hunk, so next ones don't try
      // to fit over already patched text


      minLine = hunk.offset + hunk.oldStart + hunk.oldLines;
    } // Apply patch hunks


    var diffOffset = 0;

    for (var _i = 0; _i < hunks.length; _i++) {
      var _hunk = hunks[_i],
          _toPos = _hunk.oldStart + _hunk.offset + diffOffset - 1;

      diffOffset += _hunk.newLines - _hunk.oldLines;

      if (_toPos < 0) {
        // Creating a new file
        _toPos = 0;
      }

      for (var j = 0; j < _hunk.lines.length; j++) {
        var line = _hunk.lines[j],
            operation = line.length > 0 ? line[0] : ' ',
            content = line.length > 0 ? line.substr(1) : line,
            delimiter = _hunk.linedelimiters[j];

        if (operation === ' ') {
          _toPos++;
        } else if (operation === '-') {
          lines.splice(_toPos, 1);
          delimiters.splice(_toPos, 1);
          /* istanbul ignore else */
        } else if (operation === '+') {
          lines.splice(_toPos, 0, content);
          delimiters.splice(_toPos, 0, delimiter);
          _toPos++;
        } else if (operation === '\\') {
          var previousOperation = _hunk.lines[j - 1] ? _hunk.lines[j - 1][0] : null;

          if (previousOperation === '+') {
            removeEOFNL = true;
          } else if (previousOperation === '-') {
            addEOFNL = true;
          }
        }
      }
    } // Handle EOFNL insertion/removal


    if (removeEOFNL) {
      while (!lines[lines.length - 1]) {
        lines.pop();
        delimiters.pop();
      }
    } else if (addEOFNL) {
      lines.push('');
      delimiters.push('\n');
    }

    for (var _k = 0; _k < lines.length - 1; _k++) {
      lines[_k] = lines[_k] + delimiters[_k];
    }

    return lines.join('');
  } // Wrapper that supports multiple file patches via callbacks.

  function applyPatches(uniDiff, options) {
    if (typeof uniDiff === 'string') {
      uniDiff = parsePatch(uniDiff);
    }

    var currentIndex = 0;

    function processIndex() {
      var index = uniDiff[currentIndex++];

      if (!index) {
        return options.complete();
      }

      options.loadFile(index, function (err, data) {
        if (err) {
          return options.complete(err);
        }

        var updatedContent = applyPatch(data, index, options);
        options.patched(index, updatedContent, function (err) {
          if (err) {
            return options.complete(err);
          }

          processIndex();
        });
      });
    }

    processIndex();
  }

  function structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
    if (!options) {
      options = {};
    }

    if (typeof options.context === 'undefined') {
      options.context = 4;
    }

    var diff = diffLines(oldStr, newStr, options);
    diff.push({
      value: '',
      lines: []
    }); // Append an empty value to make cleanup easier

    function contextLines(lines) {
      return lines.map(function (entry) {
        return ' ' + entry;
      });
    }

    var hunks = [];
    var oldRangeStart = 0,
        newRangeStart = 0,
        curRange = [],
        oldLine = 1,
        newLine = 1;

    var _loop = function _loop(i) {
      var current = diff[i],
          lines = current.lines || current.value.replace(/\n$/, '').split('\n');
      current.lines = lines;

      if (current.added || current.removed) {
        var _curRange;

        // If we have previous context, start with that
        if (!oldRangeStart) {
          var prev = diff[i - 1];
          oldRangeStart = oldLine;
          newRangeStart = newLine;

          if (prev) {
            curRange = options.context > 0 ? contextLines(prev.lines.slice(-options.context)) : [];
            oldRangeStart -= curRange.length;
            newRangeStart -= curRange.length;
          }
        } // Output our changes


        (_curRange = curRange).push.apply(_curRange, _toConsumableArray(lines.map(function (entry) {
          return (current.added ? '+' : '-') + entry;
        }))); // Track the updated file position


        if (current.added) {
          newLine += lines.length;
        } else {
          oldLine += lines.length;
        }
      } else {
        // Identical context lines. Track line changes
        if (oldRangeStart) {
          // Close out any changes that have been output (or join overlapping)
          if (lines.length <= options.context * 2 && i < diff.length - 2) {
            var _curRange2;

            // Overlapping
            (_curRange2 = curRange).push.apply(_curRange2, _toConsumableArray(contextLines(lines)));
          } else {
            var _curRange3;

            // end the range and output
            var contextSize = Math.min(lines.length, options.context);

            (_curRange3 = curRange).push.apply(_curRange3, _toConsumableArray(contextLines(lines.slice(0, contextSize))));

            var hunk = {
              oldStart: oldRangeStart,
              oldLines: oldLine - oldRangeStart + contextSize,
              newStart: newRangeStart,
              newLines: newLine - newRangeStart + contextSize,
              lines: curRange
            };

            if (i >= diff.length - 2 && lines.length <= options.context) {
              // EOF is inside this hunk
              var oldEOFNewline = /\n$/.test(oldStr);
              var newEOFNewline = /\n$/.test(newStr);
              var noNlBeforeAdds = lines.length == 0 && curRange.length > hunk.oldLines;

              if (!oldEOFNewline && noNlBeforeAdds) {
                // special case: old has no eol and no trailing context; no-nl can end up before adds
                curRange.splice(hunk.oldLines, 0, '\\ No newline at end of file');
              }

              if (!oldEOFNewline && !noNlBeforeAdds || !newEOFNewline) {
                curRange.push('\\ No newline at end of file');
              }
            }

            hunks.push(hunk);
            oldRangeStart = 0;
            newRangeStart = 0;
            curRange = [];
          }
        }

        oldLine += lines.length;
        newLine += lines.length;
      }
    };

    for (var i = 0; i < diff.length; i++) {
      _loop(i);
    }

    return {
      oldFileName: oldFileName,
      newFileName: newFileName,
      oldHeader: oldHeader,
      newHeader: newHeader,
      hunks: hunks
    };
  }
  function createTwoFilesPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
    var diff = structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options);
    var ret = [];

    if (oldFileName == newFileName) {
      ret.push('Index: ' + oldFileName);
    }

    ret.push('===================================================================');
    ret.push('--- ' + diff.oldFileName + (typeof diff.oldHeader === 'undefined' ? '' : '\t' + diff.oldHeader));
    ret.push('+++ ' + diff.newFileName + (typeof diff.newHeader === 'undefined' ? '' : '\t' + diff.newHeader));

    for (var i = 0; i < diff.hunks.length; i++) {
      var hunk = diff.hunks[i];
      ret.push('@@ -' + hunk.oldStart + ',' + hunk.oldLines + ' +' + hunk.newStart + ',' + hunk.newLines + ' @@');
      ret.push.apply(ret, hunk.lines);
    }

    return ret.join('\n') + '\n';
  }
  function createPatch(fileName, oldStr, newStr, oldHeader, newHeader, options) {
    return createTwoFilesPatch(fileName, fileName, oldStr, newStr, oldHeader, newHeader, options);
  }

  function arrayEqual(a, b) {
    if (a.length !== b.length) {
      return false;
    }

    return arrayStartsWith(a, b);
  }
  function arrayStartsWith(array, start) {
    if (start.length > array.length) {
      return false;
    }

    for (var i = 0; i < start.length; i++) {
      if (start[i] !== array[i]) {
        return false;
      }
    }

    return true;
  }

  function calcLineCount(hunk) {
    var _calcOldNewLineCount = calcOldNewLineCount(hunk.lines),
        oldLines = _calcOldNewLineCount.oldLines,
        newLines = _calcOldNewLineCount.newLines;

    if (oldLines !== undefined) {
      hunk.oldLines = oldLines;
    } else {
      delete hunk.oldLines;
    }

    if (newLines !== undefined) {
      hunk.newLines = newLines;
    } else {
      delete hunk.newLines;
    }
  }
  function merge(mine, theirs, base) {
    mine = loadPatch(mine, base);
    theirs = loadPatch(theirs, base);
    var ret = {}; // For index we just let it pass through as it doesn't have any necessary meaning.
    // Leaving sanity checks on this to the API consumer that may know more about the
    // meaning in their own context.

    if (mine.index || theirs.index) {
      ret.index = mine.index || theirs.index;
    }

    if (mine.newFileName || theirs.newFileName) {
      if (!fileNameChanged(mine)) {
        // No header or no change in ours, use theirs (and ours if theirs does not exist)
        ret.oldFileName = theirs.oldFileName || mine.oldFileName;
        ret.newFileName = theirs.newFileName || mine.newFileName;
        ret.oldHeader = theirs.oldHeader || mine.oldHeader;
        ret.newHeader = theirs.newHeader || mine.newHeader;
      } else if (!fileNameChanged(theirs)) {
        // No header or no change in theirs, use ours
        ret.oldFileName = mine.oldFileName;
        ret.newFileName = mine.newFileName;
        ret.oldHeader = mine.oldHeader;
        ret.newHeader = mine.newHeader;
      } else {
        // Both changed... figure it out
        ret.oldFileName = selectField(ret, mine.oldFileName, theirs.oldFileName);
        ret.newFileName = selectField(ret, mine.newFileName, theirs.newFileName);
        ret.oldHeader = selectField(ret, mine.oldHeader, theirs.oldHeader);
        ret.newHeader = selectField(ret, mine.newHeader, theirs.newHeader);
      }
    }

    ret.hunks = [];
    var mineIndex = 0,
        theirsIndex = 0,
        mineOffset = 0,
        theirsOffset = 0;

    while (mineIndex < mine.hunks.length || theirsIndex < theirs.hunks.length) {
      var mineCurrent = mine.hunks[mineIndex] || {
        oldStart: Infinity
      },
          theirsCurrent = theirs.hunks[theirsIndex] || {
        oldStart: Infinity
      };

      if (hunkBefore(mineCurrent, theirsCurrent)) {
        // This patch does not overlap with any of the others, yay.
        ret.hunks.push(cloneHunk(mineCurrent, mineOffset));
        mineIndex++;
        theirsOffset += mineCurrent.newLines - mineCurrent.oldLines;
      } else if (hunkBefore(theirsCurrent, mineCurrent)) {
        // This patch does not overlap with any of the others, yay.
        ret.hunks.push(cloneHunk(theirsCurrent, theirsOffset));
        theirsIndex++;
        mineOffset += theirsCurrent.newLines - theirsCurrent.oldLines;
      } else {
        // Overlap, merge as best we can
        var mergedHunk = {
          oldStart: Math.min(mineCurrent.oldStart, theirsCurrent.oldStart),
          oldLines: 0,
          newStart: Math.min(mineCurrent.newStart + mineOffset, theirsCurrent.oldStart + theirsOffset),
          newLines: 0,
          lines: []
        };
        mergeLines(mergedHunk, mineCurrent.oldStart, mineCurrent.lines, theirsCurrent.oldStart, theirsCurrent.lines);
        theirsIndex++;
        mineIndex++;
        ret.hunks.push(mergedHunk);
      }
    }

    return ret;
  }

  function loadPatch(param, base) {
    if (typeof param === 'string') {
      if (/^@@/m.test(param) || /^Index:/m.test(param)) {
        return parsePatch(param)[0];
      }

      if (!base) {
        throw new Error('Must provide a base reference or pass in a patch');
      }

      return structuredPatch(undefined, undefined, base, param);
    }

    return param;
  }

  function fileNameChanged(patch) {
    return patch.newFileName && patch.newFileName !== patch.oldFileName;
  }

  function selectField(index, mine, theirs) {
    if (mine === theirs) {
      return mine;
    } else {
      index.conflict = true;
      return {
        mine: mine,
        theirs: theirs
      };
    }
  }

  function hunkBefore(test, check) {
    return test.oldStart < check.oldStart && test.oldStart + test.oldLines < check.oldStart;
  }

  function cloneHunk(hunk, offset) {
    return {
      oldStart: hunk.oldStart,
      oldLines: hunk.oldLines,
      newStart: hunk.newStart + offset,
      newLines: hunk.newLines,
      lines: hunk.lines
    };
  }

  function mergeLines(hunk, mineOffset, mineLines, theirOffset, theirLines) {
    // This will generally result in a conflicted hunk, but there are cases where the context
    // is the only overlap where we can successfully merge the content here.
    var mine = {
      offset: mineOffset,
      lines: mineLines,
      index: 0
    },
        their = {
      offset: theirOffset,
      lines: theirLines,
      index: 0
    }; // Handle any leading content

    insertLeading(hunk, mine, their);
    insertLeading(hunk, their, mine); // Now in the overlap content. Scan through and select the best changes from each.

    while (mine.index < mine.lines.length && their.index < their.lines.length) {
      var mineCurrent = mine.lines[mine.index],
          theirCurrent = their.lines[their.index];

      if ((mineCurrent[0] === '-' || mineCurrent[0] === '+') && (theirCurrent[0] === '-' || theirCurrent[0] === '+')) {
        // Both modified ...
        mutualChange(hunk, mine, their);
      } else if (mineCurrent[0] === '+' && theirCurrent[0] === ' ') {
        var _hunk$lines;

        // Mine inserted
        (_hunk$lines = hunk.lines).push.apply(_hunk$lines, _toConsumableArray(collectChange(mine)));
      } else if (theirCurrent[0] === '+' && mineCurrent[0] === ' ') {
        var _hunk$lines2;

        // Theirs inserted
        (_hunk$lines2 = hunk.lines).push.apply(_hunk$lines2, _toConsumableArray(collectChange(their)));
      } else if (mineCurrent[0] === '-' && theirCurrent[0] === ' ') {
        // Mine removed or edited
        removal(hunk, mine, their);
      } else if (theirCurrent[0] === '-' && mineCurrent[0] === ' ') {
        // Their removed or edited
        removal(hunk, their, mine, true);
      } else if (mineCurrent === theirCurrent) {
        // Context identity
        hunk.lines.push(mineCurrent);
        mine.index++;
        their.index++;
      } else {
        // Context mismatch
        conflict(hunk, collectChange(mine), collectChange(their));
      }
    } // Now push anything that may be remaining


    insertTrailing(hunk, mine);
    insertTrailing(hunk, their);
    calcLineCount(hunk);
  }

  function mutualChange(hunk, mine, their) {
    var myChanges = collectChange(mine),
        theirChanges = collectChange(their);

    if (allRemoves(myChanges) && allRemoves(theirChanges)) {
      // Special case for remove changes that are supersets of one another
      if (arrayStartsWith(myChanges, theirChanges) && skipRemoveSuperset(their, myChanges, myChanges.length - theirChanges.length)) {
        var _hunk$lines3;

        (_hunk$lines3 = hunk.lines).push.apply(_hunk$lines3, _toConsumableArray(myChanges));

        return;
      } else if (arrayStartsWith(theirChanges, myChanges) && skipRemoveSuperset(mine, theirChanges, theirChanges.length - myChanges.length)) {
        var _hunk$lines4;

        (_hunk$lines4 = hunk.lines).push.apply(_hunk$lines4, _toConsumableArray(theirChanges));

        return;
      }
    } else if (arrayEqual(myChanges, theirChanges)) {
      var _hunk$lines5;

      (_hunk$lines5 = hunk.lines).push.apply(_hunk$lines5, _toConsumableArray(myChanges));

      return;
    }

    conflict(hunk, myChanges, theirChanges);
  }

  function removal(hunk, mine, their, swap) {
    var myChanges = collectChange(mine),
        theirChanges = collectContext(their, myChanges);

    if (theirChanges.merged) {
      var _hunk$lines6;

      (_hunk$lines6 = hunk.lines).push.apply(_hunk$lines6, _toConsumableArray(theirChanges.merged));
    } else {
      conflict(hunk, swap ? theirChanges : myChanges, swap ? myChanges : theirChanges);
    }
  }

  function conflict(hunk, mine, their) {
    hunk.conflict = true;
    hunk.lines.push({
      conflict: true,
      mine: mine,
      theirs: their
    });
  }

  function insertLeading(hunk, insert, their) {
    while (insert.offset < their.offset && insert.index < insert.lines.length) {
      var line = insert.lines[insert.index++];
      hunk.lines.push(line);
      insert.offset++;
    }
  }

  function insertTrailing(hunk, insert) {
    while (insert.index < insert.lines.length) {
      var line = insert.lines[insert.index++];
      hunk.lines.push(line);
    }
  }

  function collectChange(state) {
    var ret = [],
        operation = state.lines[state.index][0];

    while (state.index < state.lines.length) {
      var line = state.lines[state.index]; // Group additions that are immediately after subtractions and treat them as one "atomic" modify change.

      if (operation === '-' && line[0] === '+') {
        operation = '+';
      }

      if (operation === line[0]) {
        ret.push(line);
        state.index++;
      } else {
        break;
      }
    }

    return ret;
  }

  function collectContext(state, matchChanges) {
    var changes = [],
        merged = [],
        matchIndex = 0,
        contextChanges = false,
        conflicted = false;

    while (matchIndex < matchChanges.length && state.index < state.lines.length) {
      var change = state.lines[state.index],
          match = matchChanges[matchIndex]; // Once we've hit our add, then we are done

      if (match[0] === '+') {
        break;
      }

      contextChanges = contextChanges || change[0] !== ' ';
      merged.push(match);
      matchIndex++; // Consume any additions in the other block as a conflict to attempt
      // to pull in the remaining context after this

      if (change[0] === '+') {
        conflicted = true;

        while (change[0] === '+') {
          changes.push(change);
          change = state.lines[++state.index];
        }
      }

      if (match.substr(1) === change.substr(1)) {
        changes.push(change);
        state.index++;
      } else {
        conflicted = true;
      }
    }

    if ((matchChanges[matchIndex] || '')[0] === '+' && contextChanges) {
      conflicted = true;
    }

    if (conflicted) {
      return changes;
    }

    while (matchIndex < matchChanges.length) {
      merged.push(matchChanges[matchIndex++]);
    }

    return {
      merged: merged,
      changes: changes
    };
  }

  function allRemoves(changes) {
    return changes.reduce(function (prev, change) {
      return prev && change[0] === '-';
    }, true);
  }

  function skipRemoveSuperset(state, removeChanges, delta) {
    for (var i = 0; i < delta; i++) {
      var changeContent = removeChanges[removeChanges.length - delta + i].substr(1);

      if (state.lines[state.index + i] !== ' ' + changeContent) {
        return false;
      }
    }

    state.index += delta;
    return true;
  }

  function calcOldNewLineCount(lines) {
    var oldLines = 0;
    var newLines = 0;
    lines.forEach(function (line) {
      if (typeof line !== 'string') {
        var myCount = calcOldNewLineCount(line.mine);
        var theirCount = calcOldNewLineCount(line.theirs);

        if (oldLines !== undefined) {
          if (myCount.oldLines === theirCount.oldLines) {
            oldLines += myCount.oldLines;
          } else {
            oldLines = undefined;
          }
        }

        if (newLines !== undefined) {
          if (myCount.newLines === theirCount.newLines) {
            newLines += myCount.newLines;
          } else {
            newLines = undefined;
          }
        }
      } else {
        if (newLines !== undefined && (line[0] === '+' || line[0] === ' ')) {
          newLines++;
        }

        if (oldLines !== undefined && (line[0] === '-' || line[0] === ' ')) {
          oldLines++;
        }
      }
    });
    return {
      oldLines: oldLines,
      newLines: newLines
    };
  }

  // See: http://code.google.com/p/google-diff-match-patch/wiki/API
  function convertChangesToDMP(changes) {
    var ret = [],
        change,
        operation;

    for (var i = 0; i < changes.length; i++) {
      change = changes[i];

      if (change.added) {
        operation = 1;
      } else if (change.removed) {
        operation = -1;
      } else {
        operation = 0;
      }

      ret.push([operation, change.value]);
    }

    return ret;
  }

  function convertChangesToXML(changes) {
    var ret = [];

    for (var i = 0; i < changes.length; i++) {
      var change = changes[i];

      if (change.added) {
        ret.push('<ins>');
      } else if (change.removed) {
        ret.push('<del>');
      }

      ret.push(escapeHTML(change.value));

      if (change.added) {
        ret.push('</ins>');
      } else if (change.removed) {
        ret.push('</del>');
      }
    }

    return ret.join('');
  }

  function escapeHTML(s) {
    var n = s;
    n = n.replace(/&/g, '&amp;');
    n = n.replace(/</g, '&lt;');
    n = n.replace(/>/g, '&gt;');
    n = n.replace(/"/g, '&quot;');
    return n;
  }

  /* See LICENSE file for terms of use */

  exports.Diff = Diff;
  exports.diffChars = diffChars;
  exports.diffWords = diffWords;
  exports.diffWordsWithSpace = diffWordsWithSpace;
  exports.diffLines = diffLines;
  exports.diffTrimmedLines = diffTrimmedLines;
  exports.diffSentences = diffSentences;
  exports.diffCss = diffCss;
  exports.diffJson = diffJson;
  exports.diffArrays = diffArrays;
  exports.structuredPatch = structuredPatch;
  exports.createTwoFilesPatch = createTwoFilesPatch;
  exports.createPatch = createPatch;
  exports.applyPatch = applyPatch;
  exports.applyPatches = applyPatches;
  exports.parsePatch = parsePatch;
  exports.merge = merge;
  exports.convertChangesToDMP = convertChangesToDMP;
  exports.convertChangesToXML = convertChangesToXML;
  exports.canonicalize = canonicalize;

  Object.defineProperty(exports, '__esModule', { value: true });

}));


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

/***/ }),

/***/ "./test/server.predicates.test.js":
/*!****************************************!*\
  !*** ./test/server.predicates.test.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* module decorator */ module = __webpack_require__.nmd(module);


var assert = __webpack_require__(/*! assert */ "./node_modules/assert/assert.js");
var vows = __webpack_require__(/*! vows */ "./node_modules/vows/lib/vows.js");
var p = __webpack_require__(/*! ../src/predicates */ "./src/predicates.js");

vows
  .describe('predicates')
  .addBatch({
    checkLevel: {
      'an item without a level': {
        topic: function () {
          return { body: 'nothing' };
        },
        'settings with a critical reportLevel': {
          topic: function (item) {
            var settings = { reportLevel: 'critical' };
            return p.checkLevel(item, settings);
          },
          'should not send': function (topic) {
            assert.isFalse(topic);
          },
        },
      },
      'an item with an unknown level': {
        topic: function () {
          return { level: 'wooo' };
        },
        'settings with an error reportLevel': {
          topic: function (item) {
            var settings = { reportLevel: 'error' };
            return p.checkLevel(item, settings);
          },
          'should not send': function (topic) {
            assert.isFalse(topic);
          },
        },
        'settings with an unknown reportLevel': {
          topic: function (item) {
            var settings = { reportLevel: 'yesss' };
            return p.checkLevel(item, settings);
          },
          'should send': function (topic) {
            assert.isTrue(topic);
          },
        },
        'settings without a reportLevel': {
          topic: function (item) {
            var settings = { nothing: 'to see here' };
            return p.checkLevel(item, settings);
          },
          'should send': function (topic) {
            assert.isTrue(topic);
          },
        },
      },
      'an item with a warning level': {
        topic: function () {
          return { level: 'warning' };
        },
        'settings with an error reportLevel': {
          topic: function (item) {
            var settings = { reportLevel: 'error' };
            return p.checkLevel(item, settings);
          },
          'should not send': function (topic) {
            assert.isFalse(topic);
          },
        },
        'settings with an info reportLevel': {
          topic: function (item) {
            var settings = { reportLevel: 'info' };
            return p.checkLevel(item, settings);
          },
          'should send': function (topic) {
            assert.isTrue(topic);
          },
        },
        'settings with a warning reportLevel': {
          topic: function (item) {
            var settings = { reportLevel: 'warning' };
            return p.checkLevel(item, settings);
          },
          'should send': function (topic) {
            assert.isTrue(topic);
          },
        },
      },
    },
  })
  .export(module, { error: false });


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
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__(__webpack_require__.s = "./test/server.predicates.test.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLnByZWRpY2F0ZXMudGVzdC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7OztBQ1ZhOztBQUViO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSx3Q0FBd0MsU0FBUztBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxxQkFBTSxrQkFBa0IscUJBQU07QUFDcEMsV0FBVyxxQkFBTTtBQUNqQjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXLG1CQUFPLENBQUMsMENBQU87QUFDMUI7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEscUJBQU07QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQSxtREFBbUQ7O0FBRW5EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQixnREFBZ0Q7O0FBRWhEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSixzQkFBc0I7O0FBRXRCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsUUFBUTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLFFBQVE7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHlCQUF5QjtBQUN6Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUNBQWlDOztBQUVqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUN6ZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLFNBQVM7QUFDekI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUk7QUFDSixxQkFBcUIsUUFBUTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlOzs7QUFHZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNENBQTRDLEtBQUs7O0FBRWpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxvQ0FBb0MsT0FBTztBQUMzQztBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsMERBQTBEO0FBQzFEO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLFVBQVU7QUFDVjtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlOztBQUVmO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjs7QUFFakI7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7QUFFZDtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7O0FBRXpCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjs7QUFFaEI7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCOztBQUVoQjtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7O0FBRWhCO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjs7QUFFbkI7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCOztBQUVoQjtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7O0FBRWhCO0FBQ0E7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlOztBQUVmO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjs7QUFFbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjs7QUFFbkIsa0hBQWdEOztBQUVoRDtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBLFdBQVc7QUFDWDtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFVBQVU7QUFDckI7QUFDQSxXQUFXLFVBQVU7QUFDckI7QUFDQSx1SEFBc0M7O0FBRXRDLGVBQWU7QUFDZjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUN6a0JBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxjQUFjLCtGQUFrQztBQUNoRCxjQUFjLCtGQUFrQztBQUNoRCxXQUFXLG1CQUFPLENBQUMsZ0VBQU07O0FBRXpCO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUZBQWdDO0FBQ2hDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsa0NBQWtDLG9DQUFvQzs7QUFFdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsb0NBQW9DO0FBQzlFOztBQUVBLDZCQUE2QixPQUFPO0FBQ3BDLDZCQUE2QixTQUFTO0FBQ3RDLDZCQUE2QixTQUFTO0FBQ3RDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDaEtBLGFBQWEsbUJBQU8sQ0FBQywrQ0FBUTtBQUM3QixZQUFZLG1CQUFPLENBQUMsd0RBQVM7O0FBRTdCO0FBQ0EsK0JBQStCLFNBQVMsWUFBWSxRQUFRLEVBQUUsU0FBUztBQUN2RSxvQ0FBb0MsUUFBUSxFQUFFLFNBQVM7QUFDdkQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0VBQWtFLFFBQVEsTUFBTSxVQUFVO0FBQzFGLE1BQU07QUFDTiw0REFBNEQsVUFBVSwwQkFBMEIsT0FBTztBQUN2RztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDBFQUEwRSxTQUFTLFdBQVcsT0FBTztBQUNyRztBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsNERBQTRELFFBQVEsVUFBVSxTQUFTO0FBQ3ZGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0QsU0FBUyxPQUFPLE9BQU87QUFDL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCxTQUFTLE9BQU8sT0FBTztBQUNoRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFELFNBQVMsT0FBTyxPQUFPO0FBQzVFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5RUFBeUUsT0FBTztBQUNoRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RCxRQUFRLG9CQUFvQixTQUFTO0FBQ2pHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQsUUFBUSxtQkFBbUIsU0FBUztBQUNoRztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQsUUFBUSwrQ0FBK0MsU0FBUztBQUM1SDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLDREQUE0RCxRQUFRLFlBQVksU0FBUztBQUN6RjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsNERBQTRELFFBQVEsZ0JBQWdCLFNBQVM7QUFDN0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsd0NBQXdDO0FBQy9FLDREQUE0RCxRQUFRLFlBQVksU0FBUztBQUN6RjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFELFFBQVE7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCxRQUFRO0FBQzdEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQsUUFBUSxTQUFTLFVBQVU7QUFDdkY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdELFFBQVE7QUFDaEU7QUFDQTtBQUNBO0FBQ0EseURBQXlELFFBQVE7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQsUUFBUSxlQUFlLFNBQVM7QUFDNUYsTUFBTTtBQUNOLDZEQUE2RCxRQUFRO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2REFBNkQsUUFBUTtBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlELFFBQVE7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdEQUF3RCxTQUFTLE9BQU8sT0FBTztBQUMvRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEVBQTRFLE9BQU87QUFDbkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZEQUE2RCxRQUFRLE9BQU8sU0FBUztBQUNyRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFELFFBQVE7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQsUUFBUTtBQUNqRTtBQUNBO0FBQ0E7QUFDQSwyREFBMkQsUUFBUTtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNERBQTRELFFBQVEsc0JBQXNCLFNBQVM7QUFDbkc7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNERBQTRELFFBQVEsZUFBZSxTQUFTO0FBQzVGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDLGFBQWE7QUFDYixVQUFVLE9BQU87QUFDakI7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUMvUUE7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTs7QUFFQSxJQUFJO0FBQ0o7O0FBRUEsb0JBQW9CLG1CQUFtQjtBQUN2QztBQUNBO0FBQ0E7O0FBRUEsSUFBSTtBQUNKOztBQUVBLElBQUk7QUFDSjs7QUFFQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLFFBQVE7QUFDbEM7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLFFBQVE7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxXQUFXLG1CQUFPLENBQUMsbUlBQU07QUFDekIsYUFBYSxtQkFBTyxDQUFDLCtDQUFRO0FBQzdCLFdBQVcsbUJBQU8sQ0FBQyx5Q0FBTTtBQUN6Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLG1CQUFPLENBQUMseUZBQTZCO0FBQ25EO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCxjQUFjLDhGQUFpQztBQUMvQyw2QkFBNkIsbUJBQU8sQ0FBQywrREFBZ0I7O0FBRXJELGVBQWUsOEZBQWlDO0FBQ2hELGVBQWUsNEZBQWdDO0FBQy9DLGVBQWUseUZBQThCOztBQUU3QztBQUNBO0FBQ0E7QUFDQSxtQkFBTyxDQUFDLCtEQUFnQjtBQUN4QixtQkFBTyxDQUFDLGlFQUFpQjs7QUFFekI7QUFDQTtBQUNBO0FBQ0EsWUFBWSx3RkFBNkI7O0FBRXpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxvQ0FBb0M7QUFDcEMsMkRBQTJEO0FBQzNEO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxxQkFBTTtBQUM3QztBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHlEQUF5RDtBQUM3RTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsdUNBQXVDO0FBQ2pGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViLHNDQUFzQzs7QUFFdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdEQUF3RCxvQkFBb0I7QUFDNUUsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLE9BQU87QUFDckQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBLDBCQUEwQixpSUFDYSxXQUFXLFNBQVM7QUFDM0Q7Ozs7Ozs7Ozs7O0FDblFBLFdBQVcsOEVBQXlCLEdBQUcsNkJBQTZCOztBQUVwRTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxRQUFRLE1BQU07QUFDZDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBOztBQUVBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5RUFBeUUsbUNBQW1DO0FBQzVHLHlFQUF5RSxpQ0FBaUM7QUFDMUcsZ0VBQWdFLGlCQUFpQjtBQUNqRixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsUUFBUSxlQUFlOztBQUV2QixXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsZ0JBQWdCO0FBQ2hCO0FBQ0E7O0FBRUEsWUFBWTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzVJQSxZQUFZO0FBQ1o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCLGlDQUFpQztBQUNqQyxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUMxRUEsYUFBYSxtQkFBTyxDQUFDLCtDQUFRO0FBQzdCO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxtQ0FBbUM7QUFDbkMsbUNBQW1DO0FBQ25DLHFCQUFxQjtBQUNyQjs7QUFFQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsS0FBSztBQUNMO0FBQ0E7Ozs7Ozs7Ozs7OztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDbkNBLGdCQUFnQixVQUFVO0FBQzFCLGNBQWMsbUJBQU8sQ0FBQyxtRUFBb0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVM7QUFDVCxjQUFjO0FBQ2Q7QUFDQTs7QUFFQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFVBQVU7QUFDVjtBQUNBOzs7Ozs7Ozs7OztBQ2xFQSxnQkFBZ0I7QUFDaEIsY0FBYyxtQkFBTyxDQUFDLG1FQUFvQjtBQUMxQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsY0FBYztBQUNkO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQSxVQUFVOzs7Ozs7Ozs7OztBQ2hDVjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsY0FBYztBQUNkLFVBQVU7QUFDVixXQUFXO0FBQ1gsVUFBVTs7Ozs7Ozs7Ozs7O0FDUFYsV0FBVyxtQkFBTyxDQUFDLHlDQUFNOztBQUV6QixnQkFBZ0I7QUFDaEIsY0FBYyxtQkFBTyxDQUFDLG1FQUFvQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVM7QUFDVCxjQUFjO0FBQ2Q7QUFDQTtBQUNBLFdBQVc7QUFDWDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFBVTtBQUNWO0FBQ0E7Ozs7Ozs7Ozs7O0FDekNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsbUJBQU8sQ0FBQywyREFBWTtBQUNsQztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTO0FBQ1QsY0FBYztBQUNkO0FBQ0E7O0FBRUEsK0JBQStCLG1CQUFtQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7O0FBRUQ7O0FBRUEsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFBVTtBQUNWLEVBQUUsc0VBQXFCO0FBQ3ZCOzs7Ozs7Ozs7OztBQ25HQTtBQUNBLGNBQWMsbUJBQU8sQ0FBQyxtRUFBb0I7QUFDMUMsV0FBVyxtQkFBTyxDQUFDLGlGQUEyQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUztBQUNULGNBQWM7QUFDZDtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVOzs7Ozs7Ozs7OztBQ3BDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdCQUFnQjtBQUNoQixjQUFjLG1CQUFPLENBQUMsbUVBQW9CO0FBQzFDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSw4REFBOEQ7QUFDOUQsNkRBQTZEO0FBQzdELDZEQUE2RDtBQUM3RCwrREFBK0Q7QUFDL0QsOERBQThELElBQUk7QUFDbEU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUztBQUNULGNBQWM7QUFDZDtBQUNBO0FBQ0EsV0FBVztBQUNYOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxnRUFBZ0U7QUFDekc7QUFDQTtBQUNBLG9DQUFvQyxrREFBa0Q7QUFDdEYseUNBQXlDLGdFQUFnRTtBQUN6RztBQUNBO0FBQ0EsdUNBQXVDLG9EQUFvRDtBQUMzRix5Q0FBeUMsZ0VBQWdFO0FBQ3pHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLG1LQUFtSztBQUM1TTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxVQUFVOzs7Ozs7Ozs7OztBQzlGVixhQUFhLG1CQUFPLENBQUMsK0NBQVE7QUFDN0IsV0FBVyxtQkFBTyxDQUFDLG1JQUFNOztBQUV6QixXQUFXLG1CQUFPLENBQUMsZ0RBQVM7QUFDNUIsY0FBYywrRkFBa0M7O0FBRWhELFVBQVU7QUFDVjtBQUNBO0FBQ0Esb0JBQW9CLG1CQUFPLENBQUMsb0ZBQXdCO0FBQ3BEO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7O0FBRUEsb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDLG1CQUFtQjtBQUMvRDtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhOztBQUViLGlDQUFpQyxpQkFBaUI7QUFDbEQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRCQUE0QixpQkFBaUI7QUFDN0MsOENBQThDO0FBQzlDOztBQUVBLHlCQUF5QjtBQUN6Qix5QkFBeUI7O0FBRXpCO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscURBQXFEO0FBQ3JEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IseUNBQXlDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7O0FBRWpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGlCQUFpQixtREFBbUQsSUFBSTtBQUNqRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQix3RkFBUSxJQUFjLG1CQUFtQixDQUFDO0FBQzVEO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTs7QUFFQSwrQ0FBK0Msd0JBQXdCO0FBQ3ZFO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQSxjQUFjO0FBQ2Q7QUFDQTs7QUFFQSxnQ0FBZ0M7O0FBRWhDO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsaUNBQWlDO0FBQ2pDO0FBQ0EsU0FBUzs7QUFFVCxZQUFZLDRDQUFZO0FBQ3hCO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRDtBQUNqRDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0EsMERBQTBELFFBQVE7QUFDbEU7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNoWkE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxRkFBcUY7QUFDckYsa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLEtBQTREO0FBQzlELEVBQUUsQ0FDb0Q7QUFDdEQsQ0FBQyw0QkFBNEI7O0FBRTdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsUUFBUTs7O0FBR1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sR0FBRzs7QUFFVjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULFFBQVE7OztBQUdSO0FBQ0EsaURBQWlELDRCQUE0QjtBQUM3RTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1osZ0NBQWdDOztBQUVoQztBQUNBO0FBQ0E7O0FBRUEsc0ZBQXNGOztBQUV0RjtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxTQUFTO0FBQ1QsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxzQkFBc0Isa0JBQWtCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVcsNkJBQTZCO0FBQ3hDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBLG1DQUFtQzs7QUFFbkM7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7OztBQUdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCLDBCQUEw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RUEsb0JBQW9CLHVCQUF1QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0Isa0JBQWtCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0Esc0NBQXNDOztBQUV0QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSOztBQUVBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7O0FBRUE7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7O0FBR047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsUUFBUTtBQUNSOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJDQUEyQzs7QUFFM0M7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0Qzs7QUFFNUM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7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LFdBQVc7QUFDWCxTQUFTO0FBQ1Q7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYLFNBQVM7QUFDVDtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsU0FBUztBQUNULE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRztBQUNILG9CQUFvQixjQUFjOzs7Ozs7O1VDMUZsQztVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7Ozs7V0M1QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7VUVKQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3JvbGxiYXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvYXNzZXJ0L2Fzc2VydC5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL25vZGVfbW9kdWxlcy9leWVzL2xpYi9leWVzLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvdXRpbC9ub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vbm9kZV9tb2R1bGVzL3V0aWwvc3VwcG9ydC9pc0J1ZmZlckJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL25vZGVfbW9kdWxlcy91dGlsL3V0aWwuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL25vZGVfbW9kdWxlcy92b3dzL2xpYi9hc3NlcnQvZXJyb3IuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL25vZGVfbW9kdWxlcy92b3dzL2xpYi9hc3NlcnQvbWFjcm9zLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvdm93cy9saWIvYXNzZXJ0L3V0aWxzLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vbm9kZV9tb2R1bGVzL3Zvd3MvbGliL3Zvd3MvY29uc29sZS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vbm9kZV9tb2R1bGVzL3Zvd3MvbGliL3Zvd3MvY29udGV4dC5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vbm9kZV9tb2R1bGVzL3Zvd3MvbGliL3Zvd3MvZXh0cmFzLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy9yZXBvcnRlcnMvIHN5bmMgXlxcLlxcLy4qJCIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vbm9kZV9tb2R1bGVzL3Zvd3MvbGliL3Zvd3MvcmVwb3J0ZXJzL2RvdC1tYXRyaXguanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL25vZGVfbW9kdWxlcy92b3dzL2xpYi92b3dzL3JlcG9ydGVycy9qc29uLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy9yZXBvcnRlcnMvc2lsZW50LmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy9yZXBvcnRlcnMvc3BlYy5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vbm9kZV9tb2R1bGVzL3Zvd3MvbGliL3Zvd3MvcmVwb3J0ZXJzL3RhcC5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vbm9kZV9tb2R1bGVzL3Zvd3MvbGliL3Zvd3MvcmVwb3J0ZXJzL3dhdGNoLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy9yZXBvcnRlcnMveHVuaXQuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL25vZGVfbW9kdWxlcy92b3dzL2xpYi92b3dzL3N1aXRlLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvdm93cy9ub2RlX21vZHVsZXMvZGlmZi9kaXN0L2RpZmYuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9tZXJnZS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3ByZWRpY2F0ZXMuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy91dGlsaXR5LmpzIiwid2VicGFjazovL3JvbGxiYXIvLi90ZXN0L3NlcnZlci5wcmVkaWNhdGVzLnRlc3QuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vcm9sbGJhci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3JvbGxiYXIvd2VicGFjay9ydW50aW1lL25vZGUgbW9kdWxlIGRlY29yYXRvciIsIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vcm9sbGJhci93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vcm9sbGJhci93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKHNlbGYsICgpID0+IHtcbnJldHVybiAiLCIndXNlIHN0cmljdCc7XG5cbi8vIGNvbXBhcmUgYW5kIGlzQnVmZmVyIHRha2VuIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvYmxvYi82ODBlOWU1ZTQ4OGYyMmFhYzI3NTk5YTU3ZGM4NDRhNjMxNTkyOGRkL2luZGV4LmpzXG4vLyBvcmlnaW5hbCBub3RpY2U6XG5cbi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmUoYSwgYikge1xuICBpZiAoYSA9PT0gYikge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgdmFyIHggPSBhLmxlbmd0aDtcbiAgdmFyIHkgPSBiLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gTWF0aC5taW4oeCwgeSk7IGkgPCBsZW47ICsraSkge1xuICAgIGlmIChhW2ldICE9PSBiW2ldKSB7XG4gICAgICB4ID0gYVtpXTtcbiAgICAgIHkgPSBiW2ldO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIGlmICh5IDwgeCkge1xuICAgIHJldHVybiAxO1xuICB9XG4gIHJldHVybiAwO1xufVxuZnVuY3Rpb24gaXNCdWZmZXIoYikge1xuICBpZiAoZ2xvYmFsLkJ1ZmZlciAmJiB0eXBlb2YgZ2xvYmFsLkJ1ZmZlci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBnbG9iYWwuQnVmZmVyLmlzQnVmZmVyKGIpO1xuICB9XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpO1xufVxuXG4vLyBiYXNlZCBvbiBub2RlIGFzc2VydCwgb3JpZ2luYWwgbm90aWNlOlxuXG4vLyBodHRwOi8vd2lraS5jb21tb25qcy5vcmcvd2lraS9Vbml0X1Rlc3RpbmcvMS4wXG4vL1xuLy8gVEhJUyBJUyBOT1QgVEVTVEVEIE5PUiBMSUtFTFkgVE8gV09SSyBPVVRTSURFIFY4IVxuLy9cbi8vIE9yaWdpbmFsbHkgZnJvbSBuYXJ3aGFsLmpzIChodHRwOi8vbmFyd2hhbGpzLm9yZylcbi8vIENvcHlyaWdodCAoYykgMjAwOSBUaG9tYXMgUm9iaW5zb24gPDI4MG5vcnRoLmNvbT5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSAnU29mdHdhcmUnKSwgdG9cbi8vIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlXG4vLyByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Jcbi8vIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgJ0FTIElTJywgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4vLyBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG4vLyBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsLycpO1xudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcFNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xudmFyIGZ1bmN0aW9uc0hhdmVOYW1lcyA9IChmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBmdW5jdGlvbiBmb28oKSB7fS5uYW1lID09PSAnZm9vJztcbn0oKSk7XG5mdW5jdGlvbiBwVG9TdHJpbmcgKG9iaikge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaik7XG59XG5mdW5jdGlvbiBpc1ZpZXcoYXJyYnVmKSB7XG4gIGlmIChpc0J1ZmZlcihhcnJidWYpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICh0eXBlb2YgZ2xvYmFsLkFycmF5QnVmZmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIuaXNWaWV3ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIEFycmF5QnVmZmVyLmlzVmlldyhhcnJidWYpO1xuICB9XG4gIGlmICghYXJyYnVmKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChhcnJidWYgaW5zdGFuY2VvZiBEYXRhVmlldykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChhcnJidWYuYnVmZmVyICYmIGFycmJ1Zi5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbi8vIDEuIFRoZSBhc3NlcnQgbW9kdWxlIHByb3ZpZGVzIGZ1bmN0aW9ucyB0aGF0IHRocm93XG4vLyBBc3NlcnRpb25FcnJvcidzIHdoZW4gcGFydGljdWxhciBjb25kaXRpb25zIGFyZSBub3QgbWV0LiBUaGVcbi8vIGFzc2VydCBtb2R1bGUgbXVzdCBjb25mb3JtIHRvIHRoZSBmb2xsb3dpbmcgaW50ZXJmYWNlLlxuXG52YXIgYXNzZXJ0ID0gbW9kdWxlLmV4cG9ydHMgPSBvaztcblxuLy8gMi4gVGhlIEFzc2VydGlvbkVycm9yIGlzIGRlZmluZWQgaW4gYXNzZXJ0LlxuLy8gbmV3IGFzc2VydC5Bc3NlcnRpb25FcnJvcih7IG1lc3NhZ2U6IG1lc3NhZ2UsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0dWFsOiBhY3R1YWwsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IGV4cGVjdGVkIH0pXG5cbnZhciByZWdleCA9IC9cXHMqZnVuY3Rpb25cXHMrKFteXFwoXFxzXSopXFxzKi87XG4vLyBiYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vbGpoYXJiL2Z1bmN0aW9uLnByb3RvdHlwZS5uYW1lL2Jsb2IvYWRlZWVlYzhiZmNjNjA2OGIxODdkN2Q5ZmIzZDViYjFkM2EzMDg5OS9pbXBsZW1lbnRhdGlvbi5qc1xuZnVuY3Rpb24gZ2V0TmFtZShmdW5jKSB7XG4gIGlmICghdXRpbC5pc0Z1bmN0aW9uKGZ1bmMpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChmdW5jdGlvbnNIYXZlTmFtZXMpIHtcbiAgICByZXR1cm4gZnVuYy5uYW1lO1xuICB9XG4gIHZhciBzdHIgPSBmdW5jLnRvU3RyaW5nKCk7XG4gIHZhciBtYXRjaCA9IHN0ci5tYXRjaChyZWdleCk7XG4gIHJldHVybiBtYXRjaCAmJiBtYXRjaFsxXTtcbn1cbmFzc2VydC5Bc3NlcnRpb25FcnJvciA9IGZ1bmN0aW9uIEFzc2VydGlvbkVycm9yKG9wdGlvbnMpIHtcbiAgdGhpcy5uYW1lID0gJ0Fzc2VydGlvbkVycm9yJztcbiAgdGhpcy5hY3R1YWwgPSBvcHRpb25zLmFjdHVhbDtcbiAgdGhpcy5leHBlY3RlZCA9IG9wdGlvbnMuZXhwZWN0ZWQ7XG4gIHRoaXMub3BlcmF0b3IgPSBvcHRpb25zLm9wZXJhdG9yO1xuICBpZiAob3B0aW9ucy5tZXNzYWdlKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlO1xuICAgIHRoaXMuZ2VuZXJhdGVkTWVzc2FnZSA9IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHRoaXMubWVzc2FnZSA9IGdldE1lc3NhZ2UodGhpcyk7XG4gICAgdGhpcy5nZW5lcmF0ZWRNZXNzYWdlID0gdHJ1ZTtcbiAgfVxuICB2YXIgc3RhY2tTdGFydEZ1bmN0aW9uID0gb3B0aW9ucy5zdGFja1N0YXJ0RnVuY3Rpb24gfHwgZmFpbDtcbiAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgc3RhY2tTdGFydEZ1bmN0aW9uKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBub24gdjggYnJvd3NlcnMgc28gd2UgY2FuIGhhdmUgYSBzdGFja3RyYWNlXG4gICAgdmFyIGVyciA9IG5ldyBFcnJvcigpO1xuICAgIGlmIChlcnIuc3RhY2spIHtcbiAgICAgIHZhciBvdXQgPSBlcnIuc3RhY2s7XG5cbiAgICAgIC8vIHRyeSB0byBzdHJpcCB1c2VsZXNzIGZyYW1lc1xuICAgICAgdmFyIGZuX25hbWUgPSBnZXROYW1lKHN0YWNrU3RhcnRGdW5jdGlvbik7XG4gICAgICB2YXIgaWR4ID0gb3V0LmluZGV4T2YoJ1xcbicgKyBmbl9uYW1lKTtcbiAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAvLyBvbmNlIHdlIGhhdmUgbG9jYXRlZCB0aGUgZnVuY3Rpb24gZnJhbWVcbiAgICAgICAgLy8gd2UgbmVlZCB0byBzdHJpcCBvdXQgZXZlcnl0aGluZyBiZWZvcmUgaXQgKGFuZCBpdHMgbGluZSlcbiAgICAgICAgdmFyIG5leHRfbGluZSA9IG91dC5pbmRleE9mKCdcXG4nLCBpZHggKyAxKTtcbiAgICAgICAgb3V0ID0gb3V0LnN1YnN0cmluZyhuZXh0X2xpbmUgKyAxKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdGFjayA9IG91dDtcbiAgICB9XG4gIH1cbn07XG5cbi8vIGFzc2VydC5Bc3NlcnRpb25FcnJvciBpbnN0YW5jZW9mIEVycm9yXG51dGlsLmluaGVyaXRzKGFzc2VydC5Bc3NlcnRpb25FcnJvciwgRXJyb3IpO1xuXG5mdW5jdGlvbiB0cnVuY2F0ZShzLCBuKSB7XG4gIGlmICh0eXBlb2YgcyA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gcy5sZW5ndGggPCBuID8gcyA6IHMuc2xpY2UoMCwgbik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHM7XG4gIH1cbn1cbmZ1bmN0aW9uIGluc3BlY3Qoc29tZXRoaW5nKSB7XG4gIGlmIChmdW5jdGlvbnNIYXZlTmFtZXMgfHwgIXV0aWwuaXNGdW5jdGlvbihzb21ldGhpbmcpKSB7XG4gICAgcmV0dXJuIHV0aWwuaW5zcGVjdChzb21ldGhpbmcpO1xuICB9XG4gIHZhciByYXduYW1lID0gZ2V0TmFtZShzb21ldGhpbmcpO1xuICB2YXIgbmFtZSA9IHJhd25hbWUgPyAnOiAnICsgcmF3bmFtZSA6ICcnO1xuICByZXR1cm4gJ1tGdW5jdGlvbicgKyAgbmFtZSArICddJztcbn1cbmZ1bmN0aW9uIGdldE1lc3NhZ2Uoc2VsZikge1xuICByZXR1cm4gdHJ1bmNhdGUoaW5zcGVjdChzZWxmLmFjdHVhbCksIDEyOCkgKyAnICcgK1xuICAgICAgICAgc2VsZi5vcGVyYXRvciArICcgJyArXG4gICAgICAgICB0cnVuY2F0ZShpbnNwZWN0KHNlbGYuZXhwZWN0ZWQpLCAxMjgpO1xufVxuXG4vLyBBdCBwcmVzZW50IG9ubHkgdGhlIHRocmVlIGtleXMgbWVudGlvbmVkIGFib3ZlIGFyZSB1c2VkIGFuZFxuLy8gdW5kZXJzdG9vZCBieSB0aGUgc3BlYy4gSW1wbGVtZW50YXRpb25zIG9yIHN1YiBtb2R1bGVzIGNhbiBwYXNzXG4vLyBvdGhlciBrZXlzIHRvIHRoZSBBc3NlcnRpb25FcnJvcidzIGNvbnN0cnVjdG9yIC0gdGhleSB3aWxsIGJlXG4vLyBpZ25vcmVkLlxuXG4vLyAzLiBBbGwgb2YgdGhlIGZvbGxvd2luZyBmdW5jdGlvbnMgbXVzdCB0aHJvdyBhbiBBc3NlcnRpb25FcnJvclxuLy8gd2hlbiBhIGNvcnJlc3BvbmRpbmcgY29uZGl0aW9uIGlzIG5vdCBtZXQsIHdpdGggYSBtZXNzYWdlIHRoYXRcbi8vIG1heSBiZSB1bmRlZmluZWQgaWYgbm90IHByb3ZpZGVkLiAgQWxsIGFzc2VydGlvbiBtZXRob2RzIHByb3ZpZGVcbi8vIGJvdGggdGhlIGFjdHVhbCBhbmQgZXhwZWN0ZWQgdmFsdWVzIHRvIHRoZSBhc3NlcnRpb24gZXJyb3IgZm9yXG4vLyBkaXNwbGF5IHB1cnBvc2VzLlxuXG5mdW5jdGlvbiBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsIG9wZXJhdG9yLCBzdGFja1N0YXJ0RnVuY3Rpb24pIHtcbiAgdGhyb3cgbmV3IGFzc2VydC5Bc3NlcnRpb25FcnJvcih7XG4gICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICBhY3R1YWw6IGFjdHVhbCxcbiAgICBleHBlY3RlZDogZXhwZWN0ZWQsXG4gICAgb3BlcmF0b3I6IG9wZXJhdG9yLFxuICAgIHN0YWNrU3RhcnRGdW5jdGlvbjogc3RhY2tTdGFydEZ1bmN0aW9uXG4gIH0pO1xufVxuXG4vLyBFWFRFTlNJT04hIGFsbG93cyBmb3Igd2VsbCBiZWhhdmVkIGVycm9ycyBkZWZpbmVkIGVsc2V3aGVyZS5cbmFzc2VydC5mYWlsID0gZmFpbDtcblxuLy8gNC4gUHVyZSBhc3NlcnRpb24gdGVzdHMgd2hldGhlciBhIHZhbHVlIGlzIHRydXRoeSwgYXMgZGV0ZXJtaW5lZFxuLy8gYnkgISFndWFyZC5cbi8vIGFzc2VydC5vayhndWFyZCwgbWVzc2FnZV9vcHQpO1xuLy8gVGhpcyBzdGF0ZW1lbnQgaXMgZXF1aXZhbGVudCB0byBhc3NlcnQuZXF1YWwodHJ1ZSwgISFndWFyZCxcbi8vIG1lc3NhZ2Vfb3B0KTsuIFRvIHRlc3Qgc3RyaWN0bHkgZm9yIHRoZSB2YWx1ZSB0cnVlLCB1c2Vcbi8vIGFzc2VydC5zdHJpY3RFcXVhbCh0cnVlLCBndWFyZCwgbWVzc2FnZV9vcHQpOy5cblxuZnVuY3Rpb24gb2sodmFsdWUsIG1lc3NhZ2UpIHtcbiAgaWYgKCF2YWx1ZSkgZmFpbCh2YWx1ZSwgdHJ1ZSwgbWVzc2FnZSwgJz09JywgYXNzZXJ0Lm9rKTtcbn1cbmFzc2VydC5vayA9IG9rO1xuXG4vLyA1LiBUaGUgZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIHNoYWxsb3csIGNvZXJjaXZlIGVxdWFsaXR5IHdpdGhcbi8vID09LlxuLy8gYXNzZXJ0LmVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LmVxdWFsID0gZnVuY3Rpb24gZXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsICE9IGV4cGVjdGVkKSBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICc9PScsIGFzc2VydC5lcXVhbCk7XG59O1xuXG4vLyA2LiBUaGUgbm9uLWVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBmb3Igd2hldGhlciB0d28gb2JqZWN0cyBhcmUgbm90IGVxdWFsXG4vLyB3aXRoICE9IGFzc2VydC5ub3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3RFcXVhbCA9IGZ1bmN0aW9uIG5vdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCA9PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJyE9JywgYXNzZXJ0Lm5vdEVxdWFsKTtcbiAgfVxufTtcblxuLy8gNy4gVGhlIGVxdWl2YWxlbmNlIGFzc2VydGlvbiB0ZXN0cyBhIGRlZXAgZXF1YWxpdHkgcmVsYXRpb24uXG4vLyBhc3NlcnQuZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LmRlZXBFcXVhbCA9IGZ1bmN0aW9uIGRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmICghX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBmYWxzZSkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdkZWVwRXF1YWwnLCBhc3NlcnQuZGVlcEVxdWFsKTtcbiAgfVxufTtcblxuYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIGRlZXBTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmICghX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCB0cnVlKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ2RlZXBTdHJpY3RFcXVhbCcsIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIHN0cmljdCwgbWVtb3MpIHtcbiAgLy8gNy4xLiBBbGwgaWRlbnRpY2FsIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgYXMgZGV0ZXJtaW5lZCBieSA9PT0uXG4gIGlmIChhY3R1YWwgPT09IGV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAoaXNCdWZmZXIoYWN0dWFsKSAmJiBpc0J1ZmZlcihleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gY29tcGFyZShhY3R1YWwsIGV4cGVjdGVkKSA9PT0gMDtcblxuICAvLyA3LjIuIElmIHRoZSBleHBlY3RlZCB2YWx1ZSBpcyBhIERhdGUgb2JqZWN0LCB0aGUgYWN0dWFsIHZhbHVlIGlzXG4gIC8vIGVxdWl2YWxlbnQgaWYgaXQgaXMgYWxzbyBhIERhdGUgb2JqZWN0IHRoYXQgcmVmZXJzIHRvIHRoZSBzYW1lIHRpbWUuXG4gIH0gZWxzZSBpZiAodXRpbC5pc0RhdGUoYWN0dWFsKSAmJiB1dGlsLmlzRGF0ZShleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gYWN0dWFsLmdldFRpbWUoKSA9PT0gZXhwZWN0ZWQuZ2V0VGltZSgpO1xuXG4gIC8vIDcuMyBJZiB0aGUgZXhwZWN0ZWQgdmFsdWUgaXMgYSBSZWdFeHAgb2JqZWN0LCB0aGUgYWN0dWFsIHZhbHVlIGlzXG4gIC8vIGVxdWl2YWxlbnQgaWYgaXQgaXMgYWxzbyBhIFJlZ0V4cCBvYmplY3Qgd2l0aCB0aGUgc2FtZSBzb3VyY2UgYW5kXG4gIC8vIHByb3BlcnRpZXMgKGBnbG9iYWxgLCBgbXVsdGlsaW5lYCwgYGxhc3RJbmRleGAsIGBpZ25vcmVDYXNlYCkuXG4gIH0gZWxzZSBpZiAodXRpbC5pc1JlZ0V4cChhY3R1YWwpICYmIHV0aWwuaXNSZWdFeHAoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5zb3VyY2UgPT09IGV4cGVjdGVkLnNvdXJjZSAmJlxuICAgICAgICAgICBhY3R1YWwuZ2xvYmFsID09PSBleHBlY3RlZC5nbG9iYWwgJiZcbiAgICAgICAgICAgYWN0dWFsLm11bHRpbGluZSA9PT0gZXhwZWN0ZWQubXVsdGlsaW5lICYmXG4gICAgICAgICAgIGFjdHVhbC5sYXN0SW5kZXggPT09IGV4cGVjdGVkLmxhc3RJbmRleCAmJlxuICAgICAgICAgICBhY3R1YWwuaWdub3JlQ2FzZSA9PT0gZXhwZWN0ZWQuaWdub3JlQ2FzZTtcblxuICAvLyA3LjQuIE90aGVyIHBhaXJzIHRoYXQgZG8gbm90IGJvdGggcGFzcyB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcsXG4gIC8vIGVxdWl2YWxlbmNlIGlzIGRldGVybWluZWQgYnkgPT0uXG4gIH0gZWxzZSBpZiAoKGFjdHVhbCA9PT0gbnVsbCB8fCB0eXBlb2YgYWN0dWFsICE9PSAnb2JqZWN0JykgJiZcbiAgICAgICAgICAgICAoZXhwZWN0ZWQgPT09IG51bGwgfHwgdHlwZW9mIGV4cGVjdGVkICE9PSAnb2JqZWN0JykpIHtcbiAgICByZXR1cm4gc3RyaWN0ID8gYWN0dWFsID09PSBleHBlY3RlZCA6IGFjdHVhbCA9PSBleHBlY3RlZDtcblxuICAvLyBJZiBib3RoIHZhbHVlcyBhcmUgaW5zdGFuY2VzIG9mIHR5cGVkIGFycmF5cywgd3JhcCB0aGVpciB1bmRlcmx5aW5nXG4gIC8vIEFycmF5QnVmZmVycyBpbiBhIEJ1ZmZlciBlYWNoIHRvIGluY3JlYXNlIHBlcmZvcm1hbmNlXG4gIC8vIFRoaXMgb3B0aW1pemF0aW9uIHJlcXVpcmVzIHRoZSBhcnJheXMgdG8gaGF2ZSB0aGUgc2FtZSB0eXBlIGFzIGNoZWNrZWQgYnlcbiAgLy8gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyAoYWthIHBUb1N0cmluZykuIE5ldmVyIHBlcmZvcm0gYmluYXJ5XG4gIC8vIGNvbXBhcmlzb25zIGZvciBGbG9hdCpBcnJheXMsIHRob3VnaCwgc2luY2UgZS5nLiArMCA9PT0gLTAgYnV0IHRoZWlyXG4gIC8vIGJpdCBwYXR0ZXJucyBhcmUgbm90IGlkZW50aWNhbC5cbiAgfSBlbHNlIGlmIChpc1ZpZXcoYWN0dWFsKSAmJiBpc1ZpZXcoZXhwZWN0ZWQpICYmXG4gICAgICAgICAgICAgcFRvU3RyaW5nKGFjdHVhbCkgPT09IHBUb1N0cmluZyhleHBlY3RlZCkgJiZcbiAgICAgICAgICAgICAhKGFjdHVhbCBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSB8fFxuICAgICAgICAgICAgICAgYWN0dWFsIGluc3RhbmNlb2YgRmxvYXQ2NEFycmF5KSkge1xuICAgIHJldHVybiBjb21wYXJlKG5ldyBVaW50OEFycmF5KGFjdHVhbC5idWZmZXIpLFxuICAgICAgICAgICAgICAgICAgIG5ldyBVaW50OEFycmF5KGV4cGVjdGVkLmJ1ZmZlcikpID09PSAwO1xuXG4gIC8vIDcuNSBGb3IgYWxsIG90aGVyIE9iamVjdCBwYWlycywgaW5jbHVkaW5nIEFycmF5IG9iamVjdHMsIGVxdWl2YWxlbmNlIGlzXG4gIC8vIGRldGVybWluZWQgYnkgaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChhcyB2ZXJpZmllZFxuICAvLyB3aXRoIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCksIHRoZSBzYW1lIHNldCBvZiBrZXlzXG4gIC8vIChhbHRob3VnaCBub3QgbmVjZXNzYXJpbHkgdGhlIHNhbWUgb3JkZXIpLCBlcXVpdmFsZW50IHZhbHVlcyBmb3IgZXZlcnlcbiAgLy8gY29ycmVzcG9uZGluZyBrZXksIGFuZCBhbiBpZGVudGljYWwgJ3Byb3RvdHlwZScgcHJvcGVydHkuIE5vdGU6IHRoaXNcbiAgLy8gYWNjb3VudHMgZm9yIGJvdGggbmFtZWQgYW5kIGluZGV4ZWQgcHJvcGVydGllcyBvbiBBcnJheXMuXG4gIH0gZWxzZSBpZiAoaXNCdWZmZXIoYWN0dWFsKSAhPT0gaXNCdWZmZXIoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIG1lbW9zID0gbWVtb3MgfHwge2FjdHVhbDogW10sIGV4cGVjdGVkOiBbXX07XG5cbiAgICB2YXIgYWN0dWFsSW5kZXggPSBtZW1vcy5hY3R1YWwuaW5kZXhPZihhY3R1YWwpO1xuICAgIGlmIChhY3R1YWxJbmRleCAhPT0gLTEpIHtcbiAgICAgIGlmIChhY3R1YWxJbmRleCA9PT0gbWVtb3MuZXhwZWN0ZWQuaW5kZXhPZihleHBlY3RlZCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbWVtb3MuYWN0dWFsLnB1c2goYWN0dWFsKTtcbiAgICBtZW1vcy5leHBlY3RlZC5wdXNoKGV4cGVjdGVkKTtcblxuICAgIHJldHVybiBvYmpFcXVpdihhY3R1YWwsIGV4cGVjdGVkLCBzdHJpY3QsIG1lbW9zKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyhvYmplY3QpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpID09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xufVxuXG5mdW5jdGlvbiBvYmpFcXVpdihhLCBiLCBzdHJpY3QsIGFjdHVhbFZpc2l0ZWRPYmplY3RzKSB7XG4gIGlmIChhID09PSBudWxsIHx8IGEgPT09IHVuZGVmaW5lZCB8fCBiID09PSBudWxsIHx8IGIgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vIGlmIG9uZSBpcyBhIHByaW1pdGl2ZSwgdGhlIG90aGVyIG11c3QgYmUgc2FtZVxuICBpZiAodXRpbC5pc1ByaW1pdGl2ZShhKSB8fCB1dGlsLmlzUHJpbWl0aXZlKGIpKVxuICAgIHJldHVybiBhID09PSBiO1xuICBpZiAoc3RyaWN0ICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihhKSAhPT0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGIpKVxuICAgIHJldHVybiBmYWxzZTtcbiAgdmFyIGFJc0FyZ3MgPSBpc0FyZ3VtZW50cyhhKTtcbiAgdmFyIGJJc0FyZ3MgPSBpc0FyZ3VtZW50cyhiKTtcbiAgaWYgKChhSXNBcmdzICYmICFiSXNBcmdzKSB8fCAoIWFJc0FyZ3MgJiYgYklzQXJncykpXG4gICAgcmV0dXJuIGZhbHNlO1xuICBpZiAoYUlzQXJncykge1xuICAgIGEgPSBwU2xpY2UuY2FsbChhKTtcbiAgICBiID0gcFNsaWNlLmNhbGwoYik7XG4gICAgcmV0dXJuIF9kZWVwRXF1YWwoYSwgYiwgc3RyaWN0KTtcbiAgfVxuICB2YXIga2EgPSBvYmplY3RLZXlzKGEpO1xuICB2YXIga2IgPSBvYmplY3RLZXlzKGIpO1xuICB2YXIga2V5LCBpO1xuICAvLyBoYXZpbmcgdGhlIHNhbWUgbnVtYmVyIG9mIG93bmVkIHByb3BlcnRpZXMgKGtleXMgaW5jb3Jwb3JhdGVzXG4gIC8vIGhhc093blByb3BlcnR5KVxuICBpZiAoa2EubGVuZ3RoICE9PSBrYi5sZW5ndGgpXG4gICAgcmV0dXJuIGZhbHNlO1xuICAvL3RoZSBzYW1lIHNldCBvZiBrZXlzIChhbHRob3VnaCBub3QgbmVjZXNzYXJpbHkgdGhlIHNhbWUgb3JkZXIpLFxuICBrYS5zb3J0KCk7XG4gIGtiLnNvcnQoKTtcbiAgLy9+fn5jaGVhcCBrZXkgdGVzdFxuICBmb3IgKGkgPSBrYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGlmIChrYVtpXSAhPT0ga2JbaV0pXG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy9lcXVpdmFsZW50IHZhbHVlcyBmb3IgZXZlcnkgY29ycmVzcG9uZGluZyBrZXksIGFuZFxuICAvL35+fnBvc3NpYmx5IGV4cGVuc2l2ZSBkZWVwIHRlc3RcbiAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBrZXkgPSBrYVtpXTtcbiAgICBpZiAoIV9kZWVwRXF1YWwoYVtrZXldLCBiW2tleV0sIHN0cmljdCwgYWN0dWFsVmlzaXRlZE9iamVjdHMpKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyA4LiBUaGUgbm9uLWVxdWl2YWxlbmNlIGFzc2VydGlvbiB0ZXN0cyBmb3IgYW55IGRlZXAgaW5lcXVhbGl0eS5cbi8vIGFzc2VydC5ub3REZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90RGVlcEVxdWFsID0gZnVuY3Rpb24gbm90RGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKF9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgZmFsc2UpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnbm90RGVlcEVxdWFsJywgYXNzZXJ0Lm5vdERlZXBFcXVhbCk7XG4gIH1cbn07XG5cbmFzc2VydC5ub3REZWVwU3RyaWN0RXF1YWwgPSBub3REZWVwU3RyaWN0RXF1YWw7XG5mdW5jdGlvbiBub3REZWVwU3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCB0cnVlKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ25vdERlZXBTdHJpY3RFcXVhbCcsIG5vdERlZXBTdHJpY3RFcXVhbCk7XG4gIH1cbn1cblxuXG4vLyA5LiBUaGUgc3RyaWN0IGVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBzdHJpY3QgZXF1YWxpdHksIGFzIGRldGVybWluZWQgYnkgPT09LlxuLy8gYXNzZXJ0LnN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LnN0cmljdEVxdWFsID0gZnVuY3Rpb24gc3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsICE9PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJz09PScsIGFzc2VydC5zdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDEwLiBUaGUgc3RyaWN0IG5vbi1lcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgZm9yIHN0cmljdCBpbmVxdWFsaXR5LCBhc1xuLy8gZGV0ZXJtaW5lZCBieSAhPT0uICBhc3NlcnQubm90U3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90U3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBub3RTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgPT09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnIT09JywgYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkge1xuICBpZiAoIWFjdHVhbCB8fCAhZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGV4cGVjdGVkKSA9PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgIHJldHVybiBleHBlY3RlZC50ZXN0KGFjdHVhbCk7XG4gIH1cblxuICB0cnkge1xuICAgIGlmIChhY3R1YWwgaW5zdGFuY2VvZiBleHBlY3RlZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gSWdub3JlLiAgVGhlIGluc3RhbmNlb2YgY2hlY2sgZG9lc24ndCB3b3JrIGZvciBhcnJvdyBmdW5jdGlvbnMuXG4gIH1cblxuICBpZiAoRXJyb3IuaXNQcm90b3R5cGVPZihleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gZXhwZWN0ZWQuY2FsbCh7fSwgYWN0dWFsKSA9PT0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gX3RyeUJsb2NrKGJsb2NrKSB7XG4gIHZhciBlcnJvcjtcbiAgdHJ5IHtcbiAgICBibG9jaygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgZXJyb3IgPSBlO1xuICB9XG4gIHJldHVybiBlcnJvcjtcbn1cblxuZnVuY3Rpb24gX3Rocm93cyhzaG91bGRUaHJvdywgYmxvY2ssIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIHZhciBhY3R1YWw7XG5cbiAgaWYgKHR5cGVvZiBibG9jayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiYmxvY2tcIiBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgZXhwZWN0ZWQgPT09ICdzdHJpbmcnKSB7XG4gICAgbWVzc2FnZSA9IGV4cGVjdGVkO1xuICAgIGV4cGVjdGVkID0gbnVsbDtcbiAgfVxuXG4gIGFjdHVhbCA9IF90cnlCbG9jayhibG9jayk7XG5cbiAgbWVzc2FnZSA9IChleHBlY3RlZCAmJiBleHBlY3RlZC5uYW1lID8gJyAoJyArIGV4cGVjdGVkLm5hbWUgKyAnKS4nIDogJy4nKSArXG4gICAgICAgICAgICAobWVzc2FnZSA/ICcgJyArIG1lc3NhZ2UgOiAnLicpO1xuXG4gIGlmIChzaG91bGRUaHJvdyAmJiAhYWN0dWFsKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCAnTWlzc2luZyBleHBlY3RlZCBleGNlcHRpb24nICsgbWVzc2FnZSk7XG4gIH1cblxuICB2YXIgdXNlclByb3ZpZGVkTWVzc2FnZSA9IHR5cGVvZiBtZXNzYWdlID09PSAnc3RyaW5nJztcbiAgdmFyIGlzVW53YW50ZWRFeGNlcHRpb24gPSAhc2hvdWxkVGhyb3cgJiYgdXRpbC5pc0Vycm9yKGFjdHVhbCk7XG4gIHZhciBpc1VuZXhwZWN0ZWRFeGNlcHRpb24gPSAhc2hvdWxkVGhyb3cgJiYgYWN0dWFsICYmICFleHBlY3RlZDtcblxuICBpZiAoKGlzVW53YW50ZWRFeGNlcHRpb24gJiZcbiAgICAgIHVzZXJQcm92aWRlZE1lc3NhZ2UgJiZcbiAgICAgIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpKSB8fFxuICAgICAgaXNVbmV4cGVjdGVkRXhjZXB0aW9uKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCAnR290IHVud2FudGVkIGV4Y2VwdGlvbicgKyBtZXNzYWdlKTtcbiAgfVxuXG4gIGlmICgoc2hvdWxkVGhyb3cgJiYgYWN0dWFsICYmIGV4cGVjdGVkICYmXG4gICAgICAhZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkpIHx8ICghc2hvdWxkVGhyb3cgJiYgYWN0dWFsKSkge1xuICAgIHRocm93IGFjdHVhbDtcbiAgfVxufVxuXG4vLyAxMS4gRXhwZWN0ZWQgdG8gdGhyb3cgYW4gZXJyb3I6XG4vLyBhc3NlcnQudGhyb3dzKGJsb2NrLCBFcnJvcl9vcHQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LnRocm93cyA9IGZ1bmN0aW9uKGJsb2NrLCAvKm9wdGlvbmFsKi9lcnJvciwgLypvcHRpb25hbCovbWVzc2FnZSkge1xuICBfdGhyb3dzKHRydWUsIGJsb2NrLCBlcnJvciwgbWVzc2FnZSk7XG59O1xuXG4vLyBFWFRFTlNJT04hIFRoaXMgaXMgYW5ub3lpbmcgdG8gd3JpdGUgb3V0c2lkZSB0aGlzIG1vZHVsZS5cbmFzc2VydC5kb2VzTm90VGhyb3cgPSBmdW5jdGlvbihibG9jaywgLypvcHRpb25hbCovZXJyb3IsIC8qb3B0aW9uYWwqL21lc3NhZ2UpIHtcbiAgX3Rocm93cyhmYWxzZSwgYmxvY2ssIGVycm9yLCBtZXNzYWdlKTtcbn07XG5cbmFzc2VydC5pZkVycm9yID0gZnVuY3Rpb24oZXJyKSB7IGlmIChlcnIpIHRocm93IGVycjsgfTtcblxudmFyIG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciBrZXlzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoaGFzT3duLmNhbGwob2JqLCBrZXkpKSBrZXlzLnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4ga2V5cztcbn07XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LiAoJyArIGVyICsgJyknKTtcbiAgICAgICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2UgaWYgKGxpc3RlbmVycykge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKHRoaXMuX2V2ZW50cykge1xuICAgIHZhciBldmxpc3RlbmVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXZsaXN0ZW5lcikpXG4gICAgICByZXR1cm4gMTtcbiAgICBlbHNlIGlmIChldmxpc3RlbmVyKVxuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCIvL1xuLy8gRXllcy5qcyAtIGEgY3VzdG9taXphYmxlIHZhbHVlIGluc3BlY3RvciBmb3IgTm9kZS5qc1xuLy9cbi8vICAgdXNhZ2U6XG4vL1xuLy8gICAgICAgdmFyIGluc3BlY3QgPSByZXF1aXJlKCdleWVzJykuaW5zcGVjdG9yKHtzdHlsZXM6IHthbGw6ICdtYWdlbnRhJ319KTtcbi8vICAgICAgIGluc3BlY3Qoc29tZXRoaW5nKTsgLy8gaW5zcGVjdCB3aXRoIHRoZSBzZXR0aW5ncyBwYXNzZWQgdG8gYGluc3BlY3RvcmBcbi8vXG4vLyAgICAgb3Jcbi8vXG4vLyAgICAgICB2YXIgZXllcyA9IHJlcXVpcmUoJ2V5ZXMnKTtcbi8vICAgICAgIGV5ZXMuaW5zcGVjdChzb21ldGhpbmcpOyAvLyBpbnNwZWN0IHdpdGggdGhlIGRlZmF1bHQgc2V0dGluZ3Ncbi8vXG52YXIgZXllcyA9IGV4cG9ydHMsXG4gICAgc3RhY2sgPSBbXTtcblxuZXllcy5kZWZhdWx0cyA9IHtcbiAgICBzdHlsZXM6IHsgICAgICAgICAgICAgICAgIC8vIFN0eWxlcyBhcHBsaWVkIHRvIHN0ZG91dFxuICAgICAgICBhbGw6ICAgICAnY3lhbicsICAgICAgLy8gT3ZlcmFsbCBzdHlsZSBhcHBsaWVkIHRvIGV2ZXJ5dGhpbmdcbiAgICAgICAgbGFiZWw6ICAgJ3VuZGVybGluZScsIC8vIEluc3BlY3Rpb24gbGFiZWxzLCBsaWtlICdhcnJheScgaW4gYGFycmF5OiBbMSwgMiwgM11gXG4gICAgICAgIG90aGVyOiAgICdpbnZlcnRlZCcsICAvLyBPYmplY3RzIHdoaWNoIGRvbid0IGhhdmUgYSBsaXRlcmFsIHJlcHJlc2VudGF0aW9uLCBzdWNoIGFzIGZ1bmN0aW9uc1xuICAgICAgICBrZXk6ICAgICAnYm9sZCcsICAgICAgLy8gVGhlIGtleXMgaW4gb2JqZWN0IGxpdGVyYWxzLCBsaWtlICdhJyBpbiBge2E6IDF9YFxuICAgICAgICBzcGVjaWFsOiAnZ3JleScsICAgICAgLy8gbnVsbCwgdW5kZWZpbmVkLi4uXG4gICAgICAgIHN0cmluZzogICdncmVlbicsXG4gICAgICAgIG51bWJlcjogICdtYWdlbnRhJyxcbiAgICAgICAgYm9vbDogICAgJ2JsdWUnLCAgICAgIC8vIHRydWUgZmFsc2VcbiAgICAgICAgcmVnZXhwOiAgJ2dyZWVuJywgICAgIC8vIC9cXGQrL1xuICAgIH0sXG4gICAgcHJldHR5OiB0cnVlLCAgICAgICAgICAgICAvLyBJbmRlbnQgb2JqZWN0IGxpdGVyYWxzXG4gICAgaGlkZUZ1bmN0aW9uczogZmFsc2UsXG4gICAgc2hvd0hpZGRlbjogZmFsc2UsXG4gICAgc3RyZWFtOiBwcm9jZXNzLnN0ZG91dCxcbiAgICBtYXhMZW5ndGg6IDIwNDggICAgICAgICAgIC8vIFRydW5jYXRlIG91dHB1dCBpZiBsb25nZXJcbn07XG5cbi8vIFJldHVybiBhIGN1cnJpZWQgaW5zcGVjdCgpIGZ1bmN0aW9uLCB3aXRoIHRoZSBgb3B0aW9uc2AgYXJndW1lbnQgZmlsbGVkIGluLlxuZXllcy5pbnNwZWN0b3IgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICByZXR1cm4gZnVuY3Rpb24gKG9iaiwgbGFiZWwsIG9wdHMpIHtcbiAgICAgICAgcmV0dXJuIHRoYXQuaW5zcGVjdC5jYWxsKHRoYXQsIG9iaiwgbGFiZWwsXG4gICAgICAgICAgICBtZXJnZShvcHRpb25zIHx8IHt9LCBvcHRzIHx8IHt9KSk7XG4gICAgfTtcbn07XG5cbi8vIElmIHdlIGhhdmUgYSBgc3RyZWFtYCBkZWZpbmVkLCB1c2UgaXQgdG8gcHJpbnQgYSBzdHlsZWQgc3RyaW5nLFxuLy8gaWYgbm90LCB3ZSBqdXN0IHJldHVybiB0aGUgc3RyaW5naWZpZWQgb2JqZWN0LlxuZXllcy5pbnNwZWN0ID0gZnVuY3Rpb24gKG9iaiwgbGFiZWwsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gbWVyZ2UodGhpcy5kZWZhdWx0cywgb3B0aW9ucyB8fCB7fSk7XG5cbiAgICBpZiAob3B0aW9ucy5zdHJlYW0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpbnQoc3RyaW5naWZ5KG9iaiwgb3B0aW9ucyksIGxhYmVsLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc3RyaW5naWZ5KG9iaiwgb3B0aW9ucykgKyAob3B0aW9ucy5zdHlsZXMgPyAnXFwwMzNbMzltJyA6ICcnKTtcbiAgICB9XG59O1xuXG4vLyBPdXRwdXQgdXNpbmcgdGhlICdzdHJlYW0nLCBhbmQgYW4gb3B0aW9uYWwgbGFiZWxcbi8vIExvb3AgdGhyb3VnaCBgc3RyYCwgYW5kIHRydW5jYXRlIGl0IGFmdGVyIGBvcHRpb25zLm1heExlbmd0aGAgaGFzIGJlZW4gcmVhY2hlZC5cbi8vIEJlY2F1c2UgZXNjYXBlIHNlcXVlbmNlcyBhcmUsIGF0IHRoaXMgcG9pbnQgZW1iZWRlZCB3aXRoaW5cbi8vIHRoZSBvdXRwdXQgc3RyaW5nLCB3ZSBjYW4ndCBtZWFzdXJlIHRoZSBsZW5ndGggb2YgdGhlIHN0cmluZ1xuLy8gaW4gYSB1c2VmdWwgd2F5LCB3aXRob3V0IHNlcGFyYXRpbmcgd2hhdCBpcyBhbiBlc2NhcGUgc2VxdWVuY2UsXG4vLyB2ZXJzdXMgYSBwcmludGFibGUgY2hhcmFjdGVyIChgY2ApLiBTbyB3ZSByZXNvcnQgdG8gY291bnRpbmcgdGhlXG4vLyBsZW5ndGggbWFudWFsbHkuXG5leWVzLnByaW50ID0gZnVuY3Rpb24gKHN0ciwgbGFiZWwsIG9wdGlvbnMpIHtcbiAgICBmb3IgKHZhciBjID0gMCwgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHN0ci5jaGFyQXQoaSkgPT09ICdcXDAzMycpIHsgaSArPSA0IH0gLy8gYDRgIGJlY2F1c2UgJ1xcMDMzWzI1bScubGVuZ3RoICsgMSA9PSA1XG4gICAgICAgIGVsc2UgaWYgKGMgPT09IG9wdGlvbnMubWF4TGVuZ3RoKSB7XG4gICAgICAgICAgIHN0ciA9IHN0ci5zbGljZSgwLCBpIC0gMSkgKyAn4oCmJztcbiAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSB7IGMrKyB9XG4gICAgfVxuICAgIHJldHVybiBvcHRpb25zLnN0cmVhbS53cml0ZS5jYWxsKG9wdGlvbnMuc3RyZWFtLCAobGFiZWwgP1xuICAgICAgICB0aGlzLnN0eWxpemUobGFiZWwsIG9wdGlvbnMuc3R5bGVzLmxhYmVsLCBvcHRpb25zLnN0eWxlcykgKyAnOiAnIDogJycpICtcbiAgICAgICAgdGhpcy5zdHlsaXplKHN0ciwgICBvcHRpb25zLnN0eWxlcy5hbGwsIG9wdGlvbnMuc3R5bGVzKSArICdcXDAzM1swbScgKyBcIlxcblwiKTtcbn07XG5cbi8vIEFwcGx5IGEgc3R5bGUgdG8gYSBzdHJpbmcsIGV2ZW50dWFsbHksXG4vLyBJJ2QgbGlrZSB0aGlzIHRvIHN1cHBvcnQgcGFzc2luZyBtdWx0aXBsZVxuLy8gc3R5bGVzLlxuZXllcy5zdHlsaXplID0gZnVuY3Rpb24gKHN0ciwgc3R5bGUsIHN0eWxlcykge1xuICAgIHZhciBjb2RlcyA9IHtcbiAgICAgICAgJ2JvbGQnICAgICAgOiBbMSwgIDIyXSxcbiAgICAgICAgJ3VuZGVybGluZScgOiBbNCwgIDI0XSxcbiAgICAgICAgJ2ludmVyc2UnICAgOiBbNywgIDI3XSxcbiAgICAgICAgJ2N5YW4nICAgICAgOiBbMzYsIDM5XSxcbiAgICAgICAgJ21hZ2VudGEnICAgOiBbMzUsIDM5XSxcbiAgICAgICAgJ2JsdWUnICAgICAgOiBbMzQsIDM5XSxcbiAgICAgICAgJ3llbGxvdycgICAgOiBbMzMsIDM5XSxcbiAgICAgICAgJ2dyZWVuJyAgICAgOiBbMzIsIDM5XSxcbiAgICAgICAgJ3JlZCcgICAgICAgOiBbMzEsIDM5XSxcbiAgICAgICAgJ2dyZXknICAgICAgOiBbOTAsIDM5XVxuICAgIH0sIGVuZENvZGU7XG5cbiAgICBpZiAoc3R5bGUgJiYgY29kZXNbc3R5bGVdKSB7XG4gICAgICAgIGVuZENvZGUgPSAoY29kZXNbc3R5bGVdWzFdID09PSAzOSAmJiBzdHlsZXMuYWxsKSA/IGNvZGVzW3N0eWxlcy5hbGxdWzBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGNvZGVzW3N0eWxlXVsxXTtcbiAgICAgICAgcmV0dXJuICdcXDAzM1snICsgY29kZXNbc3R5bGVdWzBdICsgJ20nICsgc3RyICtcbiAgICAgICAgICAgICAgICdcXDAzM1snICsgZW5kQ29kZSArICdtJztcbiAgICB9IGVsc2UgeyByZXR1cm4gc3RyIH1cbn07XG5cbi8vIENvbnZlcnQgYW55IG9iamVjdCB0byBhIHN0cmluZywgcmVhZHkgZm9yIG91dHB1dC5cbi8vIFdoZW4gYW4gJ2FycmF5JyBvciBhbiAnb2JqZWN0JyBhcmUgZW5jb3VudGVyZWQsIHRoZXkgYXJlXG4vLyBwYXNzZWQgdG8gc3BlY2lhbGl6ZWQgZnVuY3Rpb25zLCB3aGljaCBjYW4gdGhlbiByZWN1cnNpdmVseSBjYWxsXG4vLyBzdHJpbmdpZnkoKS5cbmZ1bmN0aW9uIHN0cmluZ2lmeShvYmosIG9wdGlvbnMpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXMsIHN0eWxpemUgPSBmdW5jdGlvbiAoc3RyLCBzdHlsZSkge1xuICAgICAgICByZXR1cm4gZXllcy5zdHlsaXplKHN0ciwgb3B0aW9ucy5zdHlsZXNbc3R5bGVdLCBvcHRpb25zLnN0eWxlcylcbiAgICB9LCBpbmRleCwgcmVzdWx0O1xuXG4gICAgaWYgKChpbmRleCA9IHN0YWNrLmluZGV4T2Yob2JqKSkgIT09IC0xKSB7XG4gICAgICAgIHJldHVybiBzdHlsaXplKG5ldyhBcnJheSkoc3RhY2subGVuZ3RoIC0gaW5kZXggKyAxKS5qb2luKCcuJyksICdzcGVjaWFsJyk7XG4gICAgfVxuICAgIHN0YWNrLnB1c2gob2JqKTtcblxuICAgIHJlc3VsdCA9IChmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHN3aXRjaCAodHlwZU9mKG9iaikpIHtcbiAgICAgICAgICAgIGNhc2UgXCJzdHJpbmdcIiAgIDogb2JqID0gc3RyaW5naWZ5U3RyaW5nKG9iai5pbmRleE9mKFwiJ1wiKSA9PT0gLTEgPyBcIidcIiArIG9iaiArIFwiJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnXCInICsgb2JqICsgJ1wiJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3R5bGl6ZShvYmosICdzdHJpbmcnKTtcbiAgICAgICAgICAgIGNhc2UgXCJyZWdleHBcIiAgIDogcmV0dXJuIHN0eWxpemUoJy8nICsgb2JqLnNvdXJjZSArICcvJywgJ3JlZ2V4cCcpO1xuICAgICAgICAgICAgY2FzZSBcIm51bWJlclwiICAgOiByZXR1cm4gc3R5bGl6ZShvYmogKyAnJywgICAgJ251bWJlcicpO1xuICAgICAgICAgICAgY2FzZSBcImZ1bmN0aW9uXCIgOiByZXR1cm4gb3B0aW9ucy5zdHJlYW0gPyBzdHlsaXplKFwiRnVuY3Rpb25cIiwgJ290aGVyJykgOiAnW0Z1bmN0aW9uXSc7XG4gICAgICAgICAgICBjYXNlIFwibnVsbFwiICAgICA6IHJldHVybiBzdHlsaXplKFwibnVsbFwiLCAgICAgICdzcGVjaWFsJyk7XG4gICAgICAgICAgICBjYXNlIFwidW5kZWZpbmVkXCI6IHJldHVybiBzdHlsaXplKFwidW5kZWZpbmVkXCIsICdzcGVjaWFsJyk7XG4gICAgICAgICAgICBjYXNlIFwiYm9vbGVhblwiICA6IHJldHVybiBzdHlsaXplKG9iaiArICcnLCAgICAnYm9vbCcpO1xuICAgICAgICAgICAgY2FzZSBcImRhdGVcIiAgICAgOiByZXR1cm4gc3R5bGl6ZShvYmoudG9VVENTdHJpbmcoKSk7XG4gICAgICAgICAgICBjYXNlIFwiYXJyYXlcIiAgICA6IHJldHVybiBzdHJpbmdpZnlBcnJheShvYmosICBvcHRpb25zLCBzdGFjay5sZW5ndGgpO1xuICAgICAgICAgICAgY2FzZSBcIm9iamVjdFwiICAgOiByZXR1cm4gc3RyaW5naWZ5T2JqZWN0KG9iaiwgb3B0aW9ucywgc3RhY2subGVuZ3RoKTtcbiAgICAgICAgfVxuICAgIH0pKG9iaik7XG5cbiAgICBzdGFjay5wb3AoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuLy8gRXNjYXBlIGludmlzaWJsZSBjaGFyYWN0ZXJzIGluIGEgc3RyaW5nXG5mdW5jdGlvbiBzdHJpbmdpZnlTdHJpbmcgKHN0ciwgb3B0aW9ucykge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKVxuICAgICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csICdcXFxcbicpXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9bXFx1MDAwMS1cXHUwMDFGXS9nLCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAnXFxcXDAnICsgbWF0Y2hbMF0uY2hhckNvZGVBdCgwKS50b1N0cmluZyg4KTtcbiAgICAgICAgICAgICAgfSk7XG59XG5cbi8vIENvbnZlcnQgYW4gYXJyYXkgdG8gYSBzdHJpbmcsIHN1Y2ggYXMgWzEsIDIsIDNdLlxuLy8gVGhpcyBmdW5jdGlvbiBjYWxscyBzdHJpbmdpZnkoKSBmb3IgZWFjaCBvZiB0aGUgZWxlbWVudHNcbi8vIGluIHRoZSBhcnJheS5cbmZ1bmN0aW9uIHN0cmluZ2lmeUFycmF5KGFyeSwgb3B0aW9ucywgbGV2ZWwpIHtcbiAgICB2YXIgb3V0ID0gW107XG4gICAgdmFyIHByZXR0eSA9IG9wdGlvbnMucHJldHR5ICYmIChhcnkubGVuZ3RoID4gNCB8fCBhcnkuc29tZShmdW5jdGlvbiAobykge1xuICAgICAgICByZXR1cm4gKG8gIT09IG51bGwgJiYgdHlwZW9mKG8pID09PSAnb2JqZWN0JyAmJiBPYmplY3Qua2V5cyhvKS5sZW5ndGggPiAwKSB8fFxuICAgICAgICAgICAgICAgKEFycmF5LmlzQXJyYXkobykgJiYgby5sZW5ndGggPiAwKTtcbiAgICB9KSk7XG4gICAgdmFyIHdzID0gcHJldHR5ID8gJ1xcbicgKyBuZXcoQXJyYXkpKGxldmVsICogNCArIDEpLmpvaW4oJyAnKSA6ICcgJztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJ5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG91dC5wdXNoKHN0cmluZ2lmeShhcnlbaV0sIG9wdGlvbnMpKTtcbiAgICB9XG5cbiAgICBpZiAob3V0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gJ1tdJztcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJ1snICsgd3NcbiAgICAgICAgICAgICAgICAgICArIG91dC5qb2luKCcsJyArIChwcmV0dHkgPyB3cyA6ICcgJykpXG4gICAgICAgICAgICAgICAgICAgKyAocHJldHR5ID8gd3Muc2xpY2UoMCwgLTQpIDogd3MpICtcbiAgICAgICAgICAgICAgICddJztcbiAgICB9XG59O1xuXG4vLyBDb252ZXJ0IGFuIG9iamVjdCB0byBhIHN0cmluZywgc3VjaCBhcyB7YTogMX0uXG4vLyBUaGlzIGZ1bmN0aW9uIGNhbGxzIHN0cmluZ2lmeSgpIGZvciBlYWNoIG9mIGl0cyB2YWx1ZXMsXG4vLyBhbmQgZG9lcyBub3Qgb3V0cHV0IGZ1bmN0aW9ucyBvciBwcm90b3R5cGUgdmFsdWVzLlxuZnVuY3Rpb24gc3RyaW5naWZ5T2JqZWN0KG9iaiwgb3B0aW9ucywgbGV2ZWwpIHtcbiAgICB2YXIgb3V0ID0gW107XG4gICAgdmFyIHByZXR0eSA9IG9wdGlvbnMucHJldHR5ICYmIChPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA+IDIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKG9iaikuc29tZShmdW5jdGlvbiAoaykgeyByZXR1cm4gdHlwZW9mKG9ialtrXSkgPT09ICdvYmplY3QnIH0pKTtcbiAgICB2YXIgd3MgPSBwcmV0dHkgPyAnXFxuJyArIG5ldyhBcnJheSkobGV2ZWwgKiA0ICsgMSkuam9pbignICcpIDogJyAnO1xuXG4gICAgdmFyIGtleXMgPSBvcHRpb25zLnNob3dIaWRkZW4gPyBPYmplY3Qua2V5cyhvYmopIDogT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKTtcbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGspIFxuICAgICAgICAgICYmICEob2JqW2tdIGluc3RhbmNlb2YgRnVuY3Rpb24gJiYgb3B0aW9ucy5oaWRlRnVuY3Rpb25zKSkge1xuICAgICAgICAgICAgb3V0LnB1c2goZXllcy5zdHlsaXplKGssIG9wdGlvbnMuc3R5bGVzLmtleSwgb3B0aW9ucy5zdHlsZXMpICsgJzogJyArXG4gICAgICAgICAgICAgICAgICAgICBzdHJpbmdpZnkob2JqW2tdLCBvcHRpb25zKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChvdXQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiAne30nO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBcIntcIiArIHdzXG4gICAgICAgICAgICAgICAgICAgKyBvdXQuam9pbignLCcgKyAocHJldHR5ID8gd3MgOiAnICcpKVxuICAgICAgICAgICAgICAgICAgICsgKHByZXR0eSA/IHdzLnNsaWNlKDAsIC00KSA6IHdzKSArXG4gICAgICAgICAgICAgICBcIn1cIjtcbiAgIH1cbn07XG5cbi8vIEEgYmV0dGVyIGB0eXBlb2ZgXG5mdW5jdGlvbiB0eXBlT2YodmFsdWUpIHtcbiAgICB2YXIgcyA9IHR5cGVvZih2YWx1ZSksXG4gICAgICAgIHR5cGVzID0gW09iamVjdCwgQXJyYXksIFN0cmluZywgUmVnRXhwLCBOdW1iZXIsIEZ1bmN0aW9uLCBCb29sZWFuLCBEYXRlXTtcblxuICAgIGlmIChzID09PSAnb2JqZWN0JyB8fCBzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgdHlwZXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIHQpIHsgcyA9IHQubmFtZS50b0xvd2VyQ2FzZSgpIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgeyBzID0gJ251bGwnIH1cbiAgICB9XG4gICAgcmV0dXJuIHM7XG59XG5cbmZ1bmN0aW9uIG1lcmdlKC8qIHZhcmlhYmxlIGFyZ3MgKi8pIHtcbiAgICB2YXIgb2JqcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgdmFyIHRhcmdldCA9IHt9O1xuXG4gICAgb2Jqcy5mb3JFYWNoKGZ1bmN0aW9uIChvKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKG8pLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgICAgIGlmIChrID09PSAnc3R5bGVzJykge1xuICAgICAgICAgICAgICAgIGlmICghIG8uc3R5bGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGVzID0ge31cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcyBpbiBvLnN0eWxlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlc1tzXSA9IG8uc3R5bGVzW3NdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRba10gPSBvW2tdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGFyZ2V0O1xufVxuXG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn0iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIGZvcm1hdFJlZ0V4cCA9IC8lW3NkaiVdL2c7XG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uKGYpIHtcbiAgaWYgKCFpc1N0cmluZyhmKSkge1xuICAgIHZhciBvYmplY3RzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9iamVjdHMucHVzaChpbnNwZWN0KGFyZ3VtZW50c1tpXSkpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0cy5qb2luKCcgJyk7XG4gIH1cblxuICB2YXIgaSA9IDE7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICB2YXIgbGVuID0gYXJncy5sZW5ndGg7XG4gIHZhciBzdHIgPSBTdHJpbmcoZikucmVwbGFjZShmb3JtYXRSZWdFeHAsIGZ1bmN0aW9uKHgpIHtcbiAgICBpZiAoeCA9PT0gJyUlJykgcmV0dXJuICclJztcbiAgICBpZiAoaSA+PSBsZW4pIHJldHVybiB4O1xuICAgIHN3aXRjaCAoeCkge1xuICAgICAgY2FzZSAnJXMnOiByZXR1cm4gU3RyaW5nKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclZCc6IHJldHVybiBOdW1iZXIoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVqJzpcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnc1tpKytdKTtcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIHJldHVybiAnW0NpcmN1bGFyXSc7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfSk7XG4gIGZvciAodmFyIHggPSBhcmdzW2ldOyBpIDwgbGVuOyB4ID0gYXJnc1srK2ldKSB7XG4gICAgaWYgKGlzTnVsbCh4KSB8fCAhaXNPYmplY3QoeCkpIHtcbiAgICAgIHN0ciArPSAnICcgKyB4O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgKz0gJyAnICsgaW5zcGVjdCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cblxuLy8gTWFyayB0aGF0IGEgbWV0aG9kIHNob3VsZCBub3QgYmUgdXNlZC5cbi8vIFJldHVybnMgYSBtb2RpZmllZCBmdW5jdGlvbiB3aGljaCB3YXJucyBvbmNlIGJ5IGRlZmF1bHQuXG4vLyBJZiAtLW5vLWRlcHJlY2F0aW9uIGlzIHNldCwgdGhlbiBpdCBpcyBhIG5vLW9wLlxuZXhwb3J0cy5kZXByZWNhdGUgPSBmdW5jdGlvbihmbiwgbXNnKSB7XG4gIC8vIEFsbG93IGZvciBkZXByZWNhdGluZyB0aGluZ3MgaW4gdGhlIHByb2Nlc3Mgb2Ygc3RhcnRpbmcgdXAuXG4gIGlmIChpc1VuZGVmaW5lZChnbG9iYWwucHJvY2VzcykpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhwb3J0cy5kZXByZWNhdGUoZm4sIG1zZykuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHByb2Nlc3Mubm9EZXByZWNhdGlvbiA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgaWYgKHByb2Nlc3MudGhyb3dEZXByZWNhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy50cmFjZURlcHJlY2F0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIGRlcHJlY2F0ZWQ7XG59O1xuXG5cbnZhciBkZWJ1Z3MgPSB7fTtcbnZhciBkZWJ1Z0Vudmlyb247XG5leHBvcnRzLmRlYnVnbG9nID0gZnVuY3Rpb24oc2V0KSB7XG4gIGlmIChpc1VuZGVmaW5lZChkZWJ1Z0Vudmlyb24pKVxuICAgIGRlYnVnRW52aXJvbiA9IHByb2Nlc3MuZW52Lk5PREVfREVCVUcgfHwgJyc7XG4gIHNldCA9IHNldC50b1VwcGVyQ2FzZSgpO1xuICBpZiAoIWRlYnVnc1tzZXRdKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoJ1xcXFxiJyArIHNldCArICdcXFxcYicsICdpJykudGVzdChkZWJ1Z0Vudmlyb24pKSB7XG4gICAgICB2YXIgcGlkID0gcHJvY2Vzcy5waWQ7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbXNnID0gZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKTtcbiAgICAgICAgY29uc29sZS5lcnJvcignJXMgJWQ6ICVzJywgc2V0LCBwaWQsIG1zZyk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge307XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWJ1Z3Nbc2V0XTtcbn07XG5cblxuLyoqXG4gKiBFY2hvcyB0aGUgdmFsdWUgb2YgYSB2YWx1ZS4gVHJ5cyB0byBwcmludCB0aGUgdmFsdWUgb3V0XG4gKiBpbiB0aGUgYmVzdCB3YXkgcG9zc2libGUgZ2l2ZW4gdGhlIGRpZmZlcmVudCB0eXBlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcHJpbnQgb3V0LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdGhhdCBhbHRlcnMgdGhlIG91dHB1dC5cbiAqL1xuLyogbGVnYWN5OiBvYmosIHNob3dIaWRkZW4sIGRlcHRoLCBjb2xvcnMqL1xuZnVuY3Rpb24gaW5zcGVjdChvYmosIG9wdHMpIHtcbiAgLy8gZGVmYXVsdCBvcHRpb25zXG4gIHZhciBjdHggPSB7XG4gICAgc2VlbjogW10sXG4gICAgc3R5bGl6ZTogc3R5bGl6ZU5vQ29sb3JcbiAgfTtcbiAgLy8gbGVnYWN5Li4uXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDMpIGN0eC5kZXB0aCA9IGFyZ3VtZW50c1syXTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCkgY3R4LmNvbG9ycyA9IGFyZ3VtZW50c1szXTtcbiAgaWYgKGlzQm9vbGVhbihvcHRzKSkge1xuICAgIC8vIGxlZ2FjeS4uLlxuICAgIGN0eC5zaG93SGlkZGVuID0gb3B0cztcbiAgfSBlbHNlIGlmIChvcHRzKSB7XG4gICAgLy8gZ290IGFuIFwib3B0aW9uc1wiIG9iamVjdFxuICAgIGV4cG9ydHMuX2V4dGVuZChjdHgsIG9wdHMpO1xuICB9XG4gIC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5zaG93SGlkZGVuKSkgY3R4LnNob3dIaWRkZW4gPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5kZXB0aCkpIGN0eC5kZXB0aCA9IDI7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY29sb3JzKSkgY3R4LmNvbG9ycyA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmN1c3RvbUluc3BlY3QpKSBjdHguY3VzdG9tSW5zcGVjdCA9IHRydWU7XG4gIGlmIChjdHguY29sb3JzKSBjdHguc3R5bGl6ZSA9IHN0eWxpemVXaXRoQ29sb3I7XG4gIHJldHVybiBmb3JtYXRWYWx1ZShjdHgsIG9iaiwgY3R4LmRlcHRoKTtcbn1cbmV4cG9ydHMuaW5zcGVjdCA9IGluc3BlY3Q7XG5cblxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BTlNJX2VzY2FwZV9jb2RlI2dyYXBoaWNzXG5pbnNwZWN0LmNvbG9ycyA9IHtcbiAgJ2JvbGQnIDogWzEsIDIyXSxcbiAgJ2l0YWxpYycgOiBbMywgMjNdLFxuICAndW5kZXJsaW5lJyA6IFs0LCAyNF0sXG4gICdpbnZlcnNlJyA6IFs3LCAyN10sXG4gICd3aGl0ZScgOiBbMzcsIDM5XSxcbiAgJ2dyZXknIDogWzkwLCAzOV0sXG4gICdibGFjaycgOiBbMzAsIDM5XSxcbiAgJ2JsdWUnIDogWzM0LCAzOV0sXG4gICdjeWFuJyA6IFszNiwgMzldLFxuICAnZ3JlZW4nIDogWzMyLCAzOV0sXG4gICdtYWdlbnRhJyA6IFszNSwgMzldLFxuICAncmVkJyA6IFszMSwgMzldLFxuICAneWVsbG93JyA6IFszMywgMzldXG59O1xuXG4vLyBEb24ndCB1c2UgJ2JsdWUnIG5vdCB2aXNpYmxlIG9uIGNtZC5leGVcbmluc3BlY3Quc3R5bGVzID0ge1xuICAnc3BlY2lhbCc6ICdjeWFuJyxcbiAgJ251bWJlcic6ICd5ZWxsb3cnLFxuICAnYm9vbGVhbic6ICd5ZWxsb3cnLFxuICAndW5kZWZpbmVkJzogJ2dyZXknLFxuICAnbnVsbCc6ICdib2xkJyxcbiAgJ3N0cmluZyc6ICdncmVlbicsXG4gICdkYXRlJzogJ21hZ2VudGEnLFxuICAvLyBcIm5hbWVcIjogaW50ZW50aW9uYWxseSBub3Qgc3R5bGluZ1xuICAncmVnZXhwJzogJ3JlZCdcbn07XG5cblxuZnVuY3Rpb24gc3R5bGl6ZVdpdGhDb2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICB2YXIgc3R5bGUgPSBpbnNwZWN0LnN0eWxlc1tzdHlsZVR5cGVdO1xuXG4gIGlmIChzdHlsZSkge1xuICAgIHJldHVybiAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzBdICsgJ20nICsgc3RyICtcbiAgICAgICAgICAgJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVsxXSArICdtJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cblxuZnVuY3Rpb24gc3R5bGl6ZU5vQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgcmV0dXJuIHN0cjtcbn1cblxuXG5mdW5jdGlvbiBhcnJheVRvSGFzaChhcnJheSkge1xuICB2YXIgaGFzaCA9IHt9O1xuXG4gIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsLCBpZHgpIHtcbiAgICBoYXNoW3ZhbF0gPSB0cnVlO1xuICB9KTtcblxuICByZXR1cm4gaGFzaDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRWYWx1ZShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMpIHtcbiAgLy8gUHJvdmlkZSBhIGhvb2sgZm9yIHVzZXItc3BlY2lmaWVkIGluc3BlY3QgZnVuY3Rpb25zLlxuICAvLyBDaGVjayB0aGF0IHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIGFuIGluc3BlY3QgZnVuY3Rpb24gb24gaXRcbiAgaWYgKGN0eC5jdXN0b21JbnNwZWN0ICYmXG4gICAgICB2YWx1ZSAmJlxuICAgICAgaXNGdW5jdGlvbih2YWx1ZS5pbnNwZWN0KSAmJlxuICAgICAgLy8gRmlsdGVyIG91dCB0aGUgdXRpbCBtb2R1bGUsIGl0J3MgaW5zcGVjdCBmdW5jdGlvbiBpcyBzcGVjaWFsXG4gICAgICB2YWx1ZS5pbnNwZWN0ICE9PSBleHBvcnRzLmluc3BlY3QgJiZcbiAgICAgIC8vIEFsc28gZmlsdGVyIG91dCBhbnkgcHJvdG90eXBlIG9iamVjdHMgdXNpbmcgdGhlIGNpcmN1bGFyIGNoZWNrLlxuICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgIHZhciByZXQgPSB2YWx1ZS5pbnNwZWN0KHJlY3Vyc2VUaW1lcywgY3R4KTtcbiAgICBpZiAoIWlzU3RyaW5nKHJldCkpIHtcbiAgICAgIHJldCA9IGZvcm1hdFZhbHVlKGN0eCwgcmV0LCByZWN1cnNlVGltZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLy8gUHJpbWl0aXZlIHR5cGVzIGNhbm5vdCBoYXZlIHByb3BlcnRpZXNcbiAgdmFyIHByaW1pdGl2ZSA9IGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKTtcbiAgaWYgKHByaW1pdGl2ZSkge1xuICAgIHJldHVybiBwcmltaXRpdmU7XG4gIH1cblxuICAvLyBMb29rIHVwIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICB2YXIgdmlzaWJsZUtleXMgPSBhcnJheVRvSGFzaChrZXlzKTtcblxuICBpZiAoY3R4LnNob3dIaWRkZW4pIHtcbiAgICBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpO1xuICB9XG5cbiAgLy8gSUUgZG9lc24ndCBtYWtlIGVycm9yIGZpZWxkcyBub24tZW51bWVyYWJsZVxuICAvLyBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaWUvZHd3NTJzYnQodj12cy45NCkuYXNweFxuICBpZiAoaXNFcnJvcih2YWx1ZSlcbiAgICAgICYmIChrZXlzLmluZGV4T2YoJ21lc3NhZ2UnKSA+PSAwIHx8IGtleXMuaW5kZXhPZignZGVzY3JpcHRpb24nKSA+PSAwKSkge1xuICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICAvLyBTb21lIHR5cGUgb2Ygb2JqZWN0IHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWQuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW0Z1bmN0aW9uJyArIG5hbWUgKyAnXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfVxuICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdkYXRlJyk7XG4gICAgfVxuICAgIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgYmFzZSA9ICcnLCBhcnJheSA9IGZhbHNlLCBicmFjZXMgPSBbJ3snLCAnfSddO1xuXG4gIC8vIE1ha2UgQXJyYXkgc2F5IHRoYXQgdGhleSBhcmUgQXJyYXlcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgYXJyYXkgPSB0cnVlO1xuICAgIGJyYWNlcyA9IFsnWycsICddJ107XG4gIH1cblxuICAvLyBNYWtlIGZ1bmN0aW9ucyBzYXkgdGhhdCB0aGV5IGFyZSBmdW5jdGlvbnNcbiAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgdmFyIG4gPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICBiYXNlID0gJyBbRnVuY3Rpb24nICsgbiArICddJztcbiAgfVxuXG4gIC8vIE1ha2UgUmVnRXhwcyBzYXkgdGhhdCB0aGV5IGFyZSBSZWdFeHBzXG4gIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZGF0ZXMgd2l0aCBwcm9wZXJ0aWVzIGZpcnN0IHNheSB0aGUgZGF0ZVxuICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBEYXRlLnByb3RvdHlwZS50b1VUQ1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZXJyb3Igd2l0aCBtZXNzYWdlIGZpcnN0IHNheSB0aGUgZXJyb3JcbiAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCAmJiAoIWFycmF5IHx8IHZhbHVlLmxlbmd0aCA9PSAwKSkge1xuICAgIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgYnJhY2VzWzFdO1xuICB9XG5cbiAgaWYgKHJlY3Vyc2VUaW1lcyA8IDApIHtcbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tPYmplY3RdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cblxuICBjdHguc2Vlbi5wdXNoKHZhbHVlKTtcblxuICB2YXIgb3V0cHV0O1xuICBpZiAoYXJyYXkpIHtcbiAgICBvdXRwdXQgPSBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKTtcbiAgfSBlbHNlIHtcbiAgICBvdXRwdXQgPSBrZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGN0eC5zZWVuLnBvcCgpO1xuXG4gIHJldHVybiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnKTtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHZhciBzaW1wbGUgPSAnXFwnJyArIEpTT04uc3RyaW5naWZ5KHZhbHVlKS5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSArICdcXCcnO1xuICAgIHJldHVybiBjdHguc3R5bGl6ZShzaW1wbGUsICdzdHJpbmcnKTtcbiAgfVxuICBpZiAoaXNOdW1iZXIodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnbnVtYmVyJyk7XG4gIGlmIChpc0Jvb2xlYW4odmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnYm9vbGVhbicpO1xuICAvLyBGb3Igc29tZSByZWFzb24gdHlwZW9mIG51bGwgaXMgXCJvYmplY3RcIiwgc28gc3BlY2lhbCBjYXNlIGhlcmUuXG4gIGlmIChpc051bGwodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnbnVsbCcsICdudWxsJyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IodmFsdWUpIHtcbiAgcmV0dXJuICdbJyArIEVycm9yLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSArICddJztcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKSB7XG4gIHZhciBvdXRwdXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkodmFsdWUsIFN0cmluZyhpKSkpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAgU3RyaW5nKGkpLCB0cnVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dC5wdXNoKCcnKTtcbiAgICB9XG4gIH1cbiAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIGlmICgha2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBrZXksIHRydWUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3V0cHV0O1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpIHtcbiAgdmFyIG5hbWUsIHN0ciwgZGVzYztcbiAgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodmFsdWUsIGtleSkgfHwgeyB2YWx1ZTogdmFsdWVba2V5XSB9O1xuICBpZiAoZGVzYy5nZXQpIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmICghaGFzT3duUHJvcGVydHkodmlzaWJsZUtleXMsIGtleSkpIHtcbiAgICBuYW1lID0gJ1snICsga2V5ICsgJ10nO1xuICB9XG4gIGlmICghc3RyKSB7XG4gICAgaWYgKGN0eC5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSkgPCAwKSB7XG4gICAgICBpZiAoaXNOdWxsKHJlY3Vyc2VUaW1lcykpIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgcmVjdXJzZVRpbWVzIC0gMSk7XG4gICAgICB9XG4gICAgICBpZiAoc3RyLmluZGV4T2YoJ1xcbicpID4gLTEpIHtcbiAgICAgICAgaWYgKGFycmF5KSB7XG4gICAgICAgICAgc3RyID0gc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpLnN1YnN0cigyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHIgPSAnXFxuJyArIHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tDaXJjdWxhcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoaXNVbmRlZmluZWQobmFtZSkpIHtcbiAgICBpZiAoYXJyYXkgJiYga2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgbmFtZSA9IEpTT04uc3RyaW5naWZ5KCcnICsga2V5KTtcbiAgICBpZiAobmFtZS5tYXRjaCgvXlwiKFthLXpBLVpfXVthLXpBLVpfMC05XSopXCIkLykpIHtcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cigxLCBuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXlwifFwiJCkvZywgXCInXCIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICdzdHJpbmcnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZSArICc6ICcgKyBzdHI7XG59XG5cblxuZnVuY3Rpb24gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpIHtcbiAgdmFyIG51bUxpbmVzRXN0ID0gMDtcbiAgdmFyIGxlbmd0aCA9IG91dHB1dC5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VyKSB7XG4gICAgbnVtTGluZXNFc3QrKztcbiAgICBpZiAoY3VyLmluZGV4T2YoJ1xcbicpID49IDApIG51bUxpbmVzRXN0Kys7XG4gICAgcmV0dXJuIHByZXYgKyBjdXIucmVwbGFjZSgvXFx1MDAxYlxcW1xcZFxcZD9tL2csICcnKS5sZW5ndGggKyAxO1xuICB9LCAwKTtcblxuICBpZiAobGVuZ3RoID4gNjApIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICtcbiAgICAgICAgICAgKGJhc2UgPT09ICcnID8gJycgOiBiYXNlICsgJ1xcbiAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIG91dHB1dC5qb2luKCcsXFxuICAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIGJyYWNlc1sxXTtcbiAgfVxuXG4gIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgJyAnICsgb3V0cHV0LmpvaW4oJywgJykgKyAnICcgKyBicmFjZXNbMV07XG59XG5cblxuLy8gTk9URTogVGhlc2UgdHlwZSBjaGVja2luZyBmdW5jdGlvbnMgaW50ZW50aW9uYWxseSBkb24ndCB1c2UgYGluc3RhbmNlb2ZgXG4vLyBiZWNhdXNlIGl0IGlzIGZyYWdpbGUgYW5kIGNhbiBiZSBlYXNpbHkgZmFrZWQgd2l0aCBgT2JqZWN0LmNyZWF0ZSgpYC5cbmZ1bmN0aW9uIGlzQXJyYXkoYXIpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXIpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gaXNCb29sZWFuKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nO1xufVxuZXhwb3J0cy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5cbmZ1bmN0aW9uIGlzTnVsbChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsID0gaXNOdWxsO1xuXG5mdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGxPclVuZGVmaW5lZCA9IGlzTnVsbE9yVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG5mdW5jdGlvbiBpc1N0cmluZyhhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1N5bWJvbChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnO1xufVxuZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc1JlZ0V4cChyZSkge1xuICByZXR1cm4gaXNPYmplY3QocmUpICYmIG9iamVjdFRvU3RyaW5nKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5leHBvcnRzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICByZXR1cm4gaXNPYmplY3QoZCkgJiYgb2JqZWN0VG9TdHJpbmcoZCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGUpICYmXG4gICAgICAob2JqZWN0VG9TdHJpbmcoZSkgPT09ICdbb2JqZWN0IEVycm9yXScgfHwgZSBpbnN0YW5jZW9mIEVycm9yKTtcbn1cbmV4cG9ydHMuaXNFcnJvciA9IGlzRXJyb3I7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGwgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3ltYm9sJyB8fCAgLy8gRVM2IHN5bWJvbFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3VuZGVmaW5lZCc7XG59XG5leHBvcnRzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5cbmV4cG9ydHMuaXNCdWZmZXIgPSByZXF1aXJlKCcuL3N1cHBvcnQvaXNCdWZmZXInKTtcblxuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuXG5cbmZ1bmN0aW9uIHBhZChuKSB7XG4gIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuLnRvU3RyaW5nKDEwKSA6IG4udG9TdHJpbmcoMTApO1xufVxuXG5cbnZhciBtb250aHMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJyxcbiAgICAgICAgICAgICAgJ09jdCcsICdOb3YnLCAnRGVjJ107XG5cbi8vIDI2IEZlYiAxNjoxOTozNFxuZnVuY3Rpb24gdGltZXN0YW1wKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gIHZhciB0aW1lID0gW3BhZChkLmdldEhvdXJzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRNaW51dGVzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKCc6Jyk7XG4gIHJldHVybiBbZC5nZXREYXRlKCksIG1vbnRoc1tkLmdldE1vbnRoKCldLCB0aW1lXS5qb2luKCcgJyk7XG59XG5cblxuLy8gbG9nIGlzIGp1c3QgYSB0aGluIHdyYXBwZXIgdG8gY29uc29sZS5sb2cgdGhhdCBwcmVwZW5kcyBhIHRpbWVzdGFtcFxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coJyVzIC0gJXMnLCB0aW1lc3RhbXAoKSwgZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKSk7XG59O1xuXG5cbi8qKlxuICogSW5oZXJpdCB0aGUgcHJvdG90eXBlIG1ldGhvZHMgZnJvbSBvbmUgY29uc3RydWN0b3IgaW50byBhbm90aGVyLlxuICpcbiAqIFRoZSBGdW5jdGlvbi5wcm90b3R5cGUuaW5oZXJpdHMgZnJvbSBsYW5nLmpzIHJld3JpdHRlbiBhcyBhIHN0YW5kYWxvbmVcbiAqIGZ1bmN0aW9uIChub3Qgb24gRnVuY3Rpb24ucHJvdG90eXBlKS4gTk9URTogSWYgdGhpcyBmaWxlIGlzIHRvIGJlIGxvYWRlZFxuICogZHVyaW5nIGJvb3RzdHJhcHBpbmcgdGhpcyBmdW5jdGlvbiBuZWVkcyB0byBiZSByZXdyaXR0ZW4gdXNpbmcgc29tZSBuYXRpdmVcbiAqIGZ1bmN0aW9ucyBhcyBwcm90b3R5cGUgc2V0dXAgdXNpbmcgbm9ybWFsIEphdmFTY3JpcHQgZG9lcyBub3Qgd29yayBhc1xuICogZXhwZWN0ZWQgZHVyaW5nIGJvb3RzdHJhcHBpbmcgKHNlZSBtaXJyb3IuanMgaW4gcjExNDkwMykuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB3aGljaCBuZWVkcyB0byBpbmhlcml0IHRoZVxuICogICAgIHByb3RvdHlwZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHN1cGVyQ3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBpbmhlcml0IHByb3RvdHlwZSBmcm9tLlxuICovXG5leHBvcnRzLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuZXhwb3J0cy5fZXh0ZW5kID0gZnVuY3Rpb24ob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCAhaXNPYmplY3QoYWRkKSkgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn07XG5cbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG4iLCIvKipcblRoaXMgc29mdHdhcmUgY29udGFpbnMgY29kZSBhZGFwdGVkIGZyb20gTW9jaGFcbihodHRwczovL2dpdGh1Yi5jb20vdmlzaW9ubWVkaWEvbW9jaGEpIGJ5IFRKIEhvbG93YXljaHVrXG5hbmQgaXMgdXNlZCBoZXJlaW4gdW5kZXIgdGhlIGZvbGxvd2luZyBNSVQgbGljZW5zZTpcblxuQ29weXJpZ2h0IChjKSAyMDExLTIwMTIgVEogSG9sb3dheWNodWsgPHRqQHZpc2lvbi1tZWRpYS5jYT5cblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXG5hIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbidTb2Z0d2FyZScpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbndpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbmRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xucGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvXG50aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG5pbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICdBUyBJUycsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG5FWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbk1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbklOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZXG5DTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULFxuVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEVcblNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuKi9cblxudmFyIHN0eWxpemUgPSByZXF1aXJlKCcuLi92b3dzL2NvbnNvbGUnKS5zdHlsaXplO1xudmFyIGluc3BlY3QgPSByZXF1aXJlKCcuLi92b3dzL2NvbnNvbGUnKS5pbnNwZWN0O1xudmFyIGRpZmYgPSByZXF1aXJlKCdkaWZmJyk7XG5cbi8qKlxuICogUGFkIHRoZSBnaXZlbiBgc3RyYCB0byBgbGVuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge1N0cmluZ30gbGVuXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYWQoc3RyLCBsZW4pIHtcbiAgc3RyID0gU3RyaW5nKHN0cik7XG4gIHJldHVybiBBcnJheShsZW4gLSBzdHIubGVuZ3RoICsgMSkuam9pbignICcpICsgc3RyO1xufVxuXG4vKipcbiAqIENvbG9yIGxpbmVzIGZvciBgc3RyYCwgdXNpbmcgdGhlIGNvbG9yIGBuYW1lYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc3R5bGVMaW5lcyhzdHIsIG5hbWUpIHtcbiAgcmV0dXJuIHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKHN0cil7XG4gICAgcmV0dXJuIHN0eWxpemUoc3RyLCBuYW1lKTtcbiAgfSkuam9pbignXFxuJyk7XG59XG5cbi8qKlxuICogUmV0dXJuIGEgY2hhcmFjdGVyIGRpZmYgZm9yIGBlcnJgLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZXJyb3JEaWZmKGVyciwgdHlwZSkge1xuICByZXR1cm4gZGlmZlsnZGlmZicgKyB0eXBlXShlcnIuZXhwZWN0ZWQsIGVyci5hY3R1YWwpLm1hcChmdW5jdGlvbihzdHIpe1xuICAgIGlmICgvXihcXG4rKSQvLnRlc3Qoc3RyLnZhbHVlKSkgc3RyLnZhbHVlID0gQXJyYXkoKytSZWdFeHAuJDEubGVuZ3RoKS5qb2luKCc8bmV3bGluZT4nKTtcbiAgICBpZiAoc3RyLmFkZGVkKSByZXR1cm4gc3R5bGVMaW5lcyhzdHIudmFsdWUsICdncmVlbicpO1xuICAgIGlmIChzdHIucmVtb3ZlZCkgcmV0dXJuIHN0eWxlTGluZXMoc3RyLnZhbHVlLCAncmVkJyk7XG4gICAgcmV0dXJuIHN0ci52YWx1ZTtcbiAgfSkuam9pbignJyk7XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RQYXRoRnJvbVN0YWNrKHN0YWNrKSB7XG4gICAgdmFyIHJlZ2V4ID0gL1xcKCguKj9bYS16QS1aMC05Ll8tXStcXC4oPzpqc3xjb2ZmZWUpKSg6XFxkKyk6XFxkK1xcKS87XG4gICAgcmV0dXJuIHN0YWNrLm1hdGNoKHJlZ2V4KTtcbn1cblxuLypcbiBEbyBub3Qgb3ZlcnJpZGUgLnRvU3RyaW5nKCkgd2hlbiB0aGlzLnN0YWNrIGlzIHVzZWQsXG4gb3RoZXJ3aXNlIHRoaXMgd2lsbCBlbmQgaW4gYW4gZW5kbGVzcyByZWN1cnNpdmUgY2FsbC4uLlxuIFNlZSBpc3N1ZSBodHRwczovL2dpdGh1Yi5jb20vY2xvdWRoZWFkL3Zvd3MvaXNzdWVzLzI3OCNpc3N1ZWNvbW1lbnQtMjI4Mzc0OTNcbiovXG5yZXF1aXJlKCdhc3NlcnQnKS5Bc3NlcnRpb25FcnJvci5wcm90b3R5cGUudG9TdHJpbmdFeCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgIHNvdXJjZTtcblxuICAgIGlmICh0aGlzLnN0YWNrKSB7XG4gICAgICAgIHNvdXJjZSA9IGV4dHJhY3RQYXRoRnJvbVN0YWNrKHRoaXMuc3RhY2spO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlKHN0cikge1xuICAgICAgICB2YXIgYWN0dWFsID0gdGhhdC5hY3R1YWwsXG4gICAgICAgICAgICBleHBlY3RlZCA9IHRoYXQuZXhwZWN0ZWQsXG4gICAgICAgICAgICBtc2csIGxlbjtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICAnc3RyaW5nJyA9PT0gdHlwZW9mIGFjdHVhbCAmJlxuICAgICAgICAgICAgJ3N0cmluZycgPT09IHR5cGVvZiBleHBlY3RlZFxuICAgICAgICApIHtcbiAgICAgICAgICAgIGxlbiA9IE1hdGgubWF4KGFjdHVhbC5sZW5ndGgsIGV4cGVjdGVkLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIGlmIChsZW4gPCAyMCkgbXNnID0gZXJyb3JEaWZmKHRoYXQsICdDaGFycycpO1xuICAgICAgICAgICAgZWxzZSBtc2cgPSBlcnJvckRpZmYodGhhdCwgJ1dvcmRzJyk7XG5cbiAgICAgICAgICAgIC8vIGxpbmVub3NcbiAgICAgICAgICAgIHZhciBsaW5lcyA9IG1zZy5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgICBpZiAobGluZXMubGVuZ3RoID4gNCkge1xuICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9IFN0cmluZyhsaW5lcy5sZW5ndGgpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBtc2cgPSBsaW5lcy5tYXAoZnVuY3Rpb24oc3RyLCBpKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhZCgrK2ksIHdpZHRoKSArICcgfCcgKyAnICcgKyBzdHI7XG4gICAgICAgICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGxlZ2VuZFxuICAgICAgICAgICAgbXNnID0gJ1xcbidcbiAgICAgICAgICAgICAgICArIHN0eWxpemUoJ2FjdHVhbCcsICdncmVlbicpXG4gICAgICAgICAgICAgICAgKyAnICdcbiAgICAgICAgICAgICAgICArIHN0eWxpemUoJ2V4cGVjdGVkJywgJ3JlZCcpXG4gICAgICAgICAgICAgICAgKyAnXFxuXFxuJ1xuICAgICAgICAgICAgICAgICsgbXNnXG4gICAgICAgICAgICAgICAgKyAnXFxuJztcblxuICAgICAgICAgICAgLy8gaW5kZW50XG4gICAgICAgICAgICBtc2cgPSBtc2cucmVwbGFjZSgvXi9nbSwgJyAgICAgICcpO1xuXG4gICAgICAgICAgICByZXR1cm4gbXNnO1xuICAgICAgICB9XG5cbiAgICAgICAgYWN0dWFsID0gaW5zcGVjdChhY3R1YWwsIHtzaG93SGlkZGVuOiBhY3R1YWwgaW5zdGFuY2VvZiBFcnJvcn0pO1xuXG4gICAgICAgIGlmIChleHBlY3RlZCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICBleHBlY3RlZCA9IGV4cGVjdGVkLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBleHBlY3RlZCA9IGluc3BlY3QoZXhwZWN0ZWQsIHtzaG93SGlkZGVuOiBhY3R1YWwgaW5zdGFuY2VvZiBFcnJvcn0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC97YWN0dWFsfS9nLCAgIGFjdHVhbCkuXG4gICAgICAgICAgICAgICAgICAgcmVwbGFjZSgve29wZXJhdG9yfS9nLCBzdHlsaXplKHRoYXQub3BlcmF0b3IsICdib2xkJykpLlxuICAgICAgICAgICAgICAgICAgIHJlcGxhY2UoL3tleHBlY3RlZH0vZywgZXhwZWN0ZWQpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIG1zZyA9IHN0eWxpemUocGFyc2UodGhpcy5tZXNzYWdlKSwgJ3llbGxvdycpO1xuICAgICAgXHRpZiAoc291cmNlKSB7XG4gICAgICBcdFx0ICBtc2cgKz0gc3R5bGl6ZSgnIC8vICcgKyBzb3VyY2VbMV0gKyBzb3VyY2VbMl0sICdncmV5Jyk7XG4gICAgICBcdH1cbiAgICAgICAgcmV0dXJuIG1zZztcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc3R5bGl6ZShbXG4gICAgICAgICAgICB0aGlzLmV4cGVjdGVkLFxuICAgICAgICAgICAgdGhpcy5vcGVyYXRvcixcbiAgICAgICAgICAgIHRoaXMuYWN0dWFsXG4gICAgICAgIF0uam9pbignICcpLCAneWVsbG93Jyk7XG4gICAgfVxufTtcblxuIiwidmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpLFxuICAgIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgbWVzc2FnZXMgPSB7XG4gICAgJ2VxdWFsJyAgICAgICA6IFwiZXhwZWN0ZWQge2V4cGVjdGVkfSxcXG5cXHRnb3RcXHQge2FjdHVhbH0gKHtvcGVyYXRvcn0pXCIsXG4gICAgJ25vdEVxdWFsJyAgICA6IFwiZGlkbid0IGV4cGVjdCB7YWN0dWFsfSAoe29wZXJhdG9yfSlcIlxufTtcbm1lc3NhZ2VzWydzdHJpY3RFcXVhbCddICAgID0gbWVzc2FnZXNbJ2RlZXBFcXVhbCddICAgID0gbWVzc2FnZXNbJ2VxdWFsJ107XG5tZXNzYWdlc1snbm90U3RyaWN0RXF1YWwnXSA9IG1lc3NhZ2VzWydub3REZWVwRXF1YWwnXSA9IG1lc3NhZ2VzWydub3RFcXVhbCddO1xuXG5mb3IgKHZhciBrZXkgaW4gbWVzc2FnZXMpIHtcbiAgICBhc3NlcnRba2V5XSA9IChmdW5jdGlvbiAoa2V5LCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UgfHwgbWVzc2FnZXNba2V5XSk7XG4gICAgICAgIH07XG4gICAgfSkoa2V5LCBhc3NlcnRba2V5XSk7XG59XG5cbmFzc2VydC5lcHNpbG9uID0gZnVuY3Rpb24gKGVwcywgYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICAgIGFzc2VydE1pc3NpbmdBcmd1bWVudHMoYXJndW1lbnRzLCBhc3NlcnQuZXBzaWxvbik7XG4gICAgaWYgKGlzTmFOKGVwcykpIHtcbiAgICAgICAgYXNzZXJ0LmZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSB8fCBcImNhbm5vdCBjb21wYXJlIHthY3R1YWx9IHdpdGgge2V4cGVjdGVkfSBcXHUwMEIxIE5hTlwiKTtcbiAgICB9IGVsc2UgaWYgKGlzTmFOKGFjdHVhbCkgfHwgTWF0aC5hYnMoYWN0dWFsIC0gZXhwZWN0ZWQpID4gZXBzKSB7XG4gICAgICAgIGFzc2VydC5mYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UgfHwgXCJleHBlY3RlZCB7ZXhwZWN0ZWR9IFxcdTAwQjFcIisgZXBzICtcIiwgYnV0IHdhcyB7YWN0dWFsfVwiKTtcbiAgICB9XG59O1xuXG5hc3NlcnQub2sgPSAoZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmd1bWVudHMsIGFzc2VydC5vayk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhY3R1YWwsIG1lc3NhZ2UpIHtcbiAgICAgICAgY2FsbGJhY2soYWN0dWFsLCBtZXNzYWdlIHx8ICBcImV4cGVjdGVkIGV4cHJlc3Npb24gdG8gZXZhbHVhdGUgdG8ge2V4cGVjdGVkfSwgYnV0IHdhcyB7YWN0dWFsfVwiKTtcbiAgICB9O1xufSkoYXNzZXJ0Lm9rKTtcblxuYXNzZXJ0Lm1hdGNoID0gZnVuY3Rpb24gKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgICBhc3NlcnRNaXNzaW5nQXJndW1lbnRzKGFyZ3VtZW50cywgYXNzZXJ0Lm1hdGNoKTtcbiAgICBpZiAoISBleHBlY3RlZC50ZXN0KGFjdHVhbCkpIHtcbiAgICAgICAgYXNzZXJ0LmZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSB8fCBcImV4cGVjdGVkIHthY3R1YWx9IHRvIG1hdGNoIHtleHBlY3RlZH1cIiwgXCJtYXRjaFwiLCBhc3NlcnQubWF0Y2gpO1xuICAgIH1cbn07XG5hc3NlcnQubWF0Y2hlcyA9IGFzc2VydC5tYXRjaDtcblxuYXNzZXJ0LmlzVHJ1ZSA9IGZ1bmN0aW9uIChhY3R1YWwsIG1lc3NhZ2UpIHtcbiAgICBhc3NlcnRNaXNzaW5nQXJndW1lbnRzKGFyZ3VtZW50cywgYXNzZXJ0LmlzVHJ1ZSk7XG4gICAgaWYgKGFjdHVhbCAhPT0gdHJ1ZSkge1xuICAgICAgICBhc3NlcnQuZmFpbChhY3R1YWwsIHRydWUsIG1lc3NhZ2UgfHwgXCJleHBlY3RlZCB7ZXhwZWN0ZWR9LCBnb3Qge2FjdHVhbH1cIiwgXCI9PT1cIiwgYXNzZXJ0LmlzVHJ1ZSk7XG4gICAgfVxufTtcbmFzc2VydC5pc0ZhbHNlID0gZnVuY3Rpb24gKGFjdHVhbCwgbWVzc2FnZSkge1xuICAgIGFzc2VydE1pc3NpbmdBcmd1bWVudHMoYXJndW1lbnRzLCBhc3NlcnQuaXNGYWxzZSk7XG4gICAgaWYgKGFjdHVhbCAhPT0gZmFsc2UpIHtcbiAgICAgICAgYXNzZXJ0LmZhaWwoYWN0dWFsLCBmYWxzZSwgbWVzc2FnZSB8fCBcImV4cGVjdGVkIHtleHBlY3RlZH0sIGdvdCB7YWN0dWFsfVwiLCBcIj09PVwiLCBhc3NlcnQuaXNGYWxzZSk7XG4gICAgfVxufTtcbmFzc2VydC5pc1plcm8gPSBmdW5jdGlvbiAoYWN0dWFsLCBtZXNzYWdlKSB7XG4gICAgYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmd1bWVudHMsIGFzc2VydC5pc1plcm8pO1xuICAgIGlmIChhY3R1YWwgIT09IDApIHtcbiAgICAgICAgYXNzZXJ0LmZhaWwoYWN0dWFsLCAwLCBtZXNzYWdlIHx8IFwiZXhwZWN0ZWQge2V4cGVjdGVkfSwgZ290IHthY3R1YWx9XCIsIFwiPT09XCIsIGFzc2VydC5pc1plcm8pO1xuICAgIH1cbn07XG5hc3NlcnQuaXNOb3RaZXJvID0gZnVuY3Rpb24gKGFjdHVhbCwgbWVzc2FnZSkge1xuICAgIGFzc2VydE1pc3NpbmdBcmd1bWVudHMoYXJndW1lbnRzLCBhc3NlcnQuaXNOb3RaZXJvKTtcbiAgICBpZiAoYWN0dWFsID09PSAwKSB7XG4gICAgICAgIGFzc2VydC5mYWlsKGFjdHVhbCwgMCwgbWVzc2FnZSB8fCBcImV4cGVjdGVkIG5vbi16ZXJvIHZhbHVlLCBnb3Qge2FjdHVhbH1cIiwgXCI9PT1cIiwgYXNzZXJ0LmlzTm90WmVybyk7XG4gICAgfVxufTtcblxuYXNzZXJ0LmdyZWF0ZXIgPSBmdW5jdGlvbiAoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICAgIGFzc2VydE1pc3NpbmdBcmd1bWVudHMoYXJndW1lbnRzLCBhc3NlcnQuZ3JlYXRlcik7XG4gICAgaWYgKGFjdHVhbCA8PSBleHBlY3RlZCkge1xuICAgICAgICBhc3NlcnQuZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlIHx8IFwiZXhwZWN0ZWQge2FjdHVhbH0gdG8gYmUgZ3JlYXRlciB0aGFuIHtleHBlY3RlZH1cIiwgXCI+XCIsIGFzc2VydC5ncmVhdGVyKTtcbiAgICB9XG59O1xuYXNzZXJ0Lmxlc3NlciA9IGZ1bmN0aW9uIChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gICAgYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmd1bWVudHMsIGFzc2VydC5sZXNzZXIpO1xuICAgIGlmIChhY3R1YWwgPj0gZXhwZWN0ZWQpIHtcbiAgICAgICAgYXNzZXJ0LmZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSB8fCBcImV4cGVjdGVkIHthY3R1YWx9IHRvIGJlIGxlc3NlciB0aGFuIHtleHBlY3RlZH1cIiwgXCI8XCIsIGFzc2VydC5sZXNzZXIpO1xuICAgIH1cbn07XG5cbmFzc2VydC5pbkRlbHRhID0gZnVuY3Rpb24gKGFjdHVhbCwgZXhwZWN0ZWQsIGRlbHRhLCBtZXNzYWdlKSB7XG4gICAgYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmd1bWVudHMsIGFzc2VydC5pbkRlbHRhKTtcbiAgICB2YXIgbG93ZXIgPSBleHBlY3RlZCAtIGRlbHRhO1xuICAgIHZhciB1cHBlciA9IGV4cGVjdGVkICsgZGVsdGE7XG4gICAgaWYgKGFjdHVhbCAhPSArYWN0dWFsIHx8IGFjdHVhbCA8IGxvd2VyIHx8IGFjdHVhbCA+IHVwcGVyKSB7XG4gICAgICAgIGFzc2VydC5mYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UgfHwgXCJleHBlY3RlZCB7YWN0dWFsfSB0byBiZSBpbiB3aXRoaW4gKlwiICsgZGVsdGEudG9TdHJpbmcoKSArIFwiKiBvZiB7ZXhwZWN0ZWR9XCIsIG51bGwsIGFzc2VydC5pbkRlbHRhKTtcbiAgICB9XG59O1xuXG4vL1xuLy8gSW5jbHVzaW9uXG4vL1xuYXNzZXJ0LmluY2x1ZGUgPSBmdW5jdGlvbiAoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICAgIGFzc2VydE1pc3NpbmdBcmd1bWVudHMoYXJndW1lbnRzLCBhc3NlcnQuaW5jbHVkZSk7XG4gICAgaWYgKChmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIGlmIChpc0FycmF5KG9iaikgfHwgaXNTdHJpbmcob2JqKSkge1xuICAgICAgICAgICAgcmV0dXJuIG9iai5pbmRleE9mKGV4cGVjdGVkKSA9PT0gLTE7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3QoYWN0dWFsKSkge1xuICAgICAgICAgICAgcmV0dXJuICEgb2JqLmhhc093blByb3BlcnR5KGV4cGVjdGVkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KShhY3R1YWwpKSB7XG4gICAgICAgIGFzc2VydC5mYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UgfHwgXCJleHBlY3RlZCB7YWN0dWFsfSB0byBpbmNsdWRlIHtleHBlY3RlZH1cIiwgXCJpbmNsdWRlXCIsIGFzc2VydC5pbmNsdWRlKTtcbiAgICB9XG59O1xuYXNzZXJ0LmluY2x1ZGVzID0gYXNzZXJ0LmluY2x1ZGU7XG5cbmFzc2VydC5ub3RJbmNsdWRlID0gZnVuY3Rpb24gKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgICBhc3NlcnRNaXNzaW5nQXJndW1lbnRzKGFyZ3VtZW50cywgYXNzZXJ0Lm5vdEluY2x1ZGUpO1xuICAgIGlmICgoZnVuY3Rpb24gKG9iaikge1xuICAgICAgICBpZiAoaXNBcnJheShvYmopIHx8IGlzU3RyaW5nKG9iaikpIHtcbiAgICAgICAgICAgIHJldHVybiBvYmouaW5kZXhPZihleHBlY3RlZCkgIT09IC0xO1xuICAgICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGFjdHVhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiBvYmouaGFzT3duUHJvcGVydHkoZXhwZWN0ZWQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pKGFjdHVhbCkpIHtcbiAgICAgICAgYXNzZXJ0LmZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSB8fCBcImV4cGVjdGVkIHthY3R1YWx9IG5vdCB0byBpbmNsdWRlIHtleHBlY3RlZH1cIiwgXCJpbmNsdWRlXCIsIGFzc2VydC5ub3RJbmNsdWRlKTtcbiAgICB9XG59O1xuYXNzZXJ0Lm5vdEluY2x1ZGVzID0gYXNzZXJ0Lm5vdEluY2x1ZGU7XG5cbmFzc2VydC5kZWVwSW5jbHVkZSA9IGZ1bmN0aW9uIChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gICAgYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmd1bWVudHMsIGFzc2VydC5kZWVwSW5jbHVkZSk7XG4gICAgaWYgKCFpc0FycmF5KGFjdHVhbCkpIHtcbiAgICAgICAgcmV0dXJuIGFzc2VydC5pbmNsdWRlKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpO1xuICAgIH1cbiAgICBpZiAoIWFjdHVhbC5zb21lKGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiB1dGlscy5kZWVwRXF1YWwoaXRlbSwgZXhwZWN0ZWQpIH0pKSB7XG4gICAgICAgIGFzc2VydC5mYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UgfHwgXCJleHBlY3RlZCB7YWN0dWFsfSB0byBpbmNsdWRlIHtleHBlY3RlZH1cIiwgXCJpbmNsdWRlXCIsIGFzc2VydC5kZWVwSW5jbHVkZSk7XG4gICAgfVxufTtcbmFzc2VydC5kZWVwSW5jbHVkZXMgPSBhc3NlcnQuZGVlcEluY2x1ZGU7XG5cbi8vXG4vLyBMZW5ndGhcbi8vXG5hc3NlcnQuaXNFbXB0eSA9IGZ1bmN0aW9uIChhY3R1YWwsIG1lc3NhZ2UpIHtcbiAgICBhc3NlcnRNaXNzaW5nQXJndW1lbnRzKGFyZ3VtZW50cywgYXNzZXJ0LmlzRW1wdHkpO1xuICAgIGlmICgoaXNPYmplY3QoYWN0dWFsKSAmJiBPYmplY3Qua2V5cyhhY3R1YWwpLmxlbmd0aCA+IDApIHx8IGFjdHVhbC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFzc2VydC5mYWlsKGFjdHVhbCwgMCwgbWVzc2FnZSB8fCBcImV4cGVjdGVkIHthY3R1YWx9IHRvIGJlIGVtcHR5XCIsIFwibGVuZ3RoXCIsIGFzc2VydC5pc0VtcHR5KTtcbiAgICB9XG59O1xuYXNzZXJ0LmlzTm90RW1wdHkgPSBmdW5jdGlvbiAoYWN0dWFsLCBtZXNzYWdlKSB7XG4gICAgYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmd1bWVudHMsIGFzc2VydC5pc05vdEVtcHR5KTtcbiAgICBpZiAoKGlzT2JqZWN0KGFjdHVhbCkgJiYgT2JqZWN0LmtleXMoYWN0dWFsKS5sZW5ndGggPT09IDApIHx8IGFjdHVhbC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgYXNzZXJ0LmZhaWwoYWN0dWFsLCAwLCBtZXNzYWdlIHx8IFwiZXhwZWN0ZWQge2FjdHVhbH0gdG8gYmUgbm90IGVtcHR5XCIsIFwibGVuZ3RoXCIsIGFzc2VydC5pc05vdEVtcHR5KTtcbiAgICB9XG59O1xuXG5hc3NlcnQubGVuZ3RoT2YgPSBmdW5jdGlvbiAoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICAgIGFzc2VydE1pc3NpbmdBcmd1bWVudHMoYXJndW1lbnRzLCBhc3NlcnQubGVuZ3RoT2YpO1xuICAgIHZhciBsZW4gPSBpc09iamVjdChhY3R1YWwpID8gT2JqZWN0LmtleXMoYWN0dWFsKS5sZW5ndGggOiBhY3R1YWwubGVuZ3RoO1xuICAgIGlmIChsZW4gIT09IGV4cGVjdGVkKSB7XG4gICAgICAgIGFzc2VydC5mYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UgfHwgXCJleHBlY3RlZCB7YWN0dWFsfSB0byBoYXZlIHtleHBlY3RlZH0gZWxlbWVudChzKVwiLCBcImxlbmd0aFwiLCBhc3NlcnQubGVuZ3RoKTtcbiAgICB9XG59O1xuXG4vL1xuLy8gVHlwZVxuLy9cbmFzc2VydC5pc0FycmF5ID0gZnVuY3Rpb24gKGFjdHVhbCwgbWVzc2FnZSkge1xuICAgIGFzc2VydE1pc3NpbmdBcmd1bWVudHMoYXJndW1lbnRzLCBhc3NlcnQuaXNBcnJheSk7XG4gICAgYXNzZXJ0VHlwZU9mKGFjdHVhbCwgJ2FycmF5JywgbWVzc2FnZSB8fCBcImV4cGVjdGVkIHthY3R1YWx9IHRvIGJlIGFuIEFycmF5XCIsIGFzc2VydC5pc0FycmF5KTtcbn07XG5hc3NlcnQuaXNPYmplY3QgPSBmdW5jdGlvbiAoYWN0dWFsLCBtZXNzYWdlKSB7XG4gICAgYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmd1bWVudHMsIGFzc2VydC5pc09iamVjdCk7XG4gICAgYXNzZXJ0VHlwZU9mKGFjdHVhbCwgJ29iamVjdCcsIG1lc3NhZ2UgfHwgXCJleHBlY3RlZCB7YWN0dWFsfSB0byBiZSBhbiBPYmplY3RcIiwgYXNzZXJ0LmlzT2JqZWN0KTtcbn07XG5hc3NlcnQuaXNOdW1iZXIgPSBmdW5jdGlvbiAoYWN0dWFsLCBtZXNzYWdlKSB7XG4gICAgYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmd1bWVudHMsIGFzc2VydC5pc051bWJlcik7XG4gICAgaWYgKGlzTmFOKGFjdHVhbCkpIHtcbiAgICAgICAgYXNzZXJ0LmZhaWwoYWN0dWFsLCAnbnVtYmVyJywgbWVzc2FnZSB8fCBcImV4cGVjdGVkIHthY3R1YWx9IHRvIGJlIG9mIHR5cGUge2V4cGVjdGVkfVwiLCBcImlzTmFOXCIsIGFzc2VydC5pc051bWJlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYXNzZXJ0VHlwZU9mKGFjdHVhbCwgJ251bWJlcicsIG1lc3NhZ2UgfHwgXCJleHBlY3RlZCB7YWN0dWFsfSB0byBiZSBhIE51bWJlclwiLCBhc3NlcnQuaXNOdW1iZXIpO1xuICAgIH1cbn07XG5hc3NlcnQuaXNCb29sZWFuID0gZnVuY3Rpb24gKGFjdHVhbCwgbWVzc2FnZSkge1xuICAgIGFzc2VydE1pc3NpbmdBcmd1bWVudHMoYXJndW1lbnRzLCBhc3NlcnQuaXNCb29sZWFuKTtcbiAgICBpZiAoYWN0dWFsICE9PSB0cnVlICYmIGFjdHVhbCAhPT0gZmFsc2UpIHtcbiAgICAgICAgYXNzZXJ0LmZhaWwoYWN0dWFsLCAnYm9vbGVhbicsIG1lc3NhZ2UgfHwgXCJleHBlY3RlZCB7YWN0dWFsfSB0byBiZSBhIEJvb2xlYW5cIiwgXCI9PT1cIiwgYXNzZXJ0LmlzQm9vbGVhbik7XG4gICAgfVxufTtcbmFzc2VydC5pc05hTiA9IGZ1bmN0aW9uIChhY3R1YWwsIG1lc3NhZ2UpIHtcbiAgICBhc3NlcnRNaXNzaW5nQXJndW1lbnRzKGFyZ3VtZW50cywgYXNzZXJ0LmlzTmFOKTtcbiAgICBpZiAoYWN0dWFsID09PSBhY3R1YWwpIHtcbiAgICAgICAgYXNzZXJ0LmZhaWwoYWN0dWFsLCAnTmFOJywgbWVzc2FnZSB8fCBcImV4cGVjdGVkIHthY3R1YWx9IHRvIGJlIE5hTlwiLCBcIj09PVwiLCBhc3NlcnQuaXNOYU4pO1xuICAgIH1cbn07XG5hc3NlcnQuaXNOdWxsID0gZnVuY3Rpb24gKGFjdHVhbCwgbWVzc2FnZSkge1xuICAgIGFzc2VydE1pc3NpbmdBcmd1bWVudHMoYXJndW1lbnRzLCBhc3NlcnQuaXNOdWxsKTtcbiAgICBpZiAoYWN0dWFsICE9PSBudWxsKSB7XG4gICAgICAgIGFzc2VydC5mYWlsKGFjdHVhbCwgbnVsbCwgbWVzc2FnZSB8fCBcImV4cGVjdGVkIHtleHBlY3RlZH0sIGdvdCB7YWN0dWFsfVwiLCBcIj09PVwiLCBhc3NlcnQuaXNOdWxsKTtcbiAgICB9XG59O1xuYXNzZXJ0LmlzTm90TnVsbCA9IGZ1bmN0aW9uIChhY3R1YWwsIG1lc3NhZ2UpIHtcbiAgICBhc3NlcnRNaXNzaW5nQXJndW1lbnRzKGFyZ3VtZW50cywgYXNzZXJ0LmlzTm90TnVsbCk7XG4gICAgaWYgKGFjdHVhbCA9PT0gbnVsbCkge1xuICAgICAgICBhc3NlcnQuZmFpbChhY3R1YWwsIG51bGwsIG1lc3NhZ2UgfHwgXCJleHBlY3RlZCBub24tbnVsbCB2YWx1ZSwgZ290IHthY3R1YWx9XCIsIFwiPT09XCIsIGFzc2VydC5pc05vdE51bGwpO1xuICAgIH1cbn07XG5hc3NlcnQuaXNVbmRlZmluZWQgPSBmdW5jdGlvbiAoYWN0dWFsLCBtZXNzYWdlKSB7XG4gICAgYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmd1bWVudHMsIGFzc2VydC5pc1VuZGVmaW5lZCk7XG4gICAgaWYgKGFjdHVhbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGFzc2VydC5mYWlsKGFjdHVhbCwgdW5kZWZpbmVkLCBtZXNzYWdlIHx8IFwiZXhwZWN0ZWQge2FjdHVhbH0gdG8gYmUge2V4cGVjdGVkfVwiLCBcIj09PVwiLCBhc3NlcnQuaXNVbmRlZmluZWQpO1xuICAgIH1cbn07XG5hc3NlcnQuaXNEZWZpbmVkID0gZnVuY3Rpb24gKGFjdHVhbCwgbWVzc2FnZSkge1xuICAgIGFzc2VydE1pc3NpbmdBcmd1bWVudHMoYXJndW1lbnRzLCBhc3NlcnQuaXNEZWZpbmVkKTtcbiAgICBpZihhY3R1YWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBhc3NlcnQuZmFpbChhY3R1YWwsIDAsIG1lc3NhZ2UgfHwgXCJleHBlY3RlZCB7YWN0dWFsfSB0byBiZSBkZWZpbmVkXCIsIFwiPT09XCIsIGFzc2VydC5pc0RlZmluZWQpO1xuICAgIH1cbn07XG5hc3NlcnQuaXNTdHJpbmcgPSBmdW5jdGlvbiAoYWN0dWFsLCBtZXNzYWdlKSB7XG4gICAgYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmd1bWVudHMsIGFzc2VydC5pc1N0cmluZyk7XG4gICAgYXNzZXJ0VHlwZU9mKGFjdHVhbCwgJ3N0cmluZycsIG1lc3NhZ2UgfHwgXCJleHBlY3RlZCB7YWN0dWFsfSB0byBiZSBhIFN0cmluZ1wiLCBhc3NlcnQuaXNTdHJpbmcpO1xufTtcbmFzc2VydC5pc0Z1bmN0aW9uID0gZnVuY3Rpb24gKGFjdHVhbCwgbWVzc2FnZSkge1xuICAgIGFzc2VydE1pc3NpbmdBcmd1bWVudHMoYXJndW1lbnRzLCBhc3NlcnQuaXNGdW5jdGlvbik7XG4gICAgYXNzZXJ0VHlwZU9mKGFjdHVhbCwgJ2Z1bmN0aW9uJywgbWVzc2FnZSB8fCBcImV4cGVjdGVkIHthY3R1YWx9IHRvIGJlIGEgRnVuY3Rpb25cIiwgYXNzZXJ0LmlzRnVuY3Rpb24pO1xufTtcbmFzc2VydC50eXBlT2YgPSBmdW5jdGlvbiAoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICAgIGFzc2VydE1pc3NpbmdBcmd1bWVudHMoYXJndW1lbnRzLCBhc3NlcnQudHlwZU9mKTtcbiAgICBhc3NlcnRUeXBlT2YoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgYXNzZXJ0LnR5cGVPZik7XG59O1xuYXNzZXJ0Lmluc3RhbmNlT2YgPSBmdW5jdGlvbiAoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICAgIGFzc2VydE1pc3NpbmdBcmd1bWVudHMoYXJndW1lbnRzLCBhc3NlcnQuaW5zdGFuY2VvZik7XG4gICAgaWYgKCEgKGFjdHVhbCBpbnN0YW5jZW9mIGV4cGVjdGVkKSkge1xuICAgICAgICBhc3NlcnQuZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlIHx8IFwiZXhwZWN0ZWQge2FjdHVhbH0gdG8gYmUgYW4gaW5zdGFuY2Ugb2Yge2V4cGVjdGVkfVwiLCBcImluc3RhbmNlb2ZcIiwgYXNzZXJ0Lmluc3RhbmNlT2YpO1xuICAgIH1cbn07XG5cbi8vXG4vLyBVdGlsaXR5IGZ1bmN0aW9uc1xuLy9cblxuZnVuY3Rpb24gYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmdzLCBjYWxsZXIpIHtcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgYXNzZXJ0LmZhaWwoXCJcIiwgXCJcIiwgXCJleHBlY3RlZCBudW1iZXIgb2YgYXJndW1lbnRzIHRvIGJlIGdyZWF0ZXIgdGhhbiB6ZXJvXCIsIFwiXCIsIGNhbGxlcik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnRUeXBlT2YoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgY2FsbGVyKSB7XG4gICAgaWYgKHR5cGVPZihhY3R1YWwpICE9PSBleHBlY3RlZCkge1xuICAgICAgICBhc3NlcnQuZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlIHx8IFwiZXhwZWN0ZWQge2FjdHVhbH0gdG8gYmUgb2YgdHlwZSB7ZXhwZWN0ZWR9XCIsIFwidHlwZU9mXCIsIGNhbGxlcik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpc0FycmF5IChvYmopIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShvYmopO1xufVxuXG5mdW5jdGlvbiBpc1N0cmluZyAob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZihvYmopID09PSAnc3RyaW5nJyB8fCBvYmogaW5zdGFuY2VvZiBTdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0IChvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mKG9iaikgPT09ICdvYmplY3QnICYmIG9iaiAmJiAhaXNBcnJheShvYmopO1xufVxuXG4vLyBBIGJldHRlciBgdHlwZW9mYFxuZnVuY3Rpb24gdHlwZU9mKHZhbHVlKSB7XG4gICAgdmFyIHMgPSB0eXBlb2YodmFsdWUpLFxuICAgICAgICB0eXBlcyA9IFtPYmplY3QsIEFycmF5LCBTdHJpbmcsIFJlZ0V4cCwgTnVtYmVyLCBGdW5jdGlvbiwgQm9vbGVhbiwgRGF0ZV07XG5cbiAgICBpZiAocyA9PT0gJ29iamVjdCcgfHwgcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIHR5cGVzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiB0KSB7IHMgPSB0Lm5hbWUudG9Mb3dlckNhc2UoKSB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHsgcyA9ICdudWxsJyB9XG4gICAgfVxuICAgIHJldHVybiBzO1xufVxuIiwiXG4vLyBUYWtlbiBmcm9tIG5vZGUvbGliL2Fzc2VydC5qc1xuZXhwb3J0cy5kZWVwRXF1YWwgPSBmdW5jdGlvbiAoYWN0dWFsLCBleHBlY3RlZCkge1xuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSBpZiAoQnVmZmVyLmlzQnVmZmVyKGFjdHVhbCkgJiYgQnVmZmVyLmlzQnVmZmVyKGV4cGVjdGVkKSkge1xuICAgIGlmIChhY3R1YWwubGVuZ3RoICE9IGV4cGVjdGVkLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhY3R1YWwubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhY3R1YWxbaV0gIT09IGV4cGVjdGVkW2ldKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSBpZiAoYWN0dWFsIGluc3RhbmNlb2YgRGF0ZSAmJiBleHBlY3RlZCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICByZXR1cm4gYWN0dWFsLmdldFRpbWUoKSA9PT0gZXhwZWN0ZWQuZ2V0VGltZSgpO1xuXG4gIH0gZWxzZSBpZiAodHlwZW9mIGFjdHVhbCAhPSAnb2JqZWN0JyAmJiB0eXBlb2YgZXhwZWN0ZWQgIT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gYWN0dWFsID09IGV4cGVjdGVkO1xuXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG9iakVxdWl2KGFjdHVhbCwgZXhwZWN0ZWQpO1xuICB9XG59XG5cbi8vIFRha2VuIGZyb20gbm9kZS9saWIvYXNzZXJ0LmpzXG5leHBvcnRzLm5vdERlZXBFcXVhbCA9IGZ1bmN0aW9uIChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChleHBvcnRzLmRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ25vdERlZXBFcXVhbCcsIGFzc2VydC5ub3REZWVwRXF1YWwpO1xuICB9XG59XG5cbi8vIFRha2VuIGZyb20gbm9kZS9saWIvYXNzZXJ0LmpzXG5mdW5jdGlvbiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZDtcbn1cblxuLy8gVGFrZW4gZnJvbSBub2RlL2xpYi9hc3NlcnQuanNcbmZ1bmN0aW9uIGlzQXJndW1lbnRzKG9iamVjdCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkgPT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG59XG5cbi8vIFRha2VuIGZyb20gbm9kZS9saWIvYXNzZXJ0LmpzXG5mdW5jdGlvbiBvYmpFcXVpdihhLCBiKSB7XG4gIGlmIChpc1VuZGVmaW5lZE9yTnVsbChhKSB8fCBpc1VuZGVmaW5lZE9yTnVsbChiKSlcbiAgICByZXR1cm4gZmFsc2U7XG4gIGlmIChhLnByb3RvdHlwZSAhPT0gYi5wcm90b3R5cGUpIHJldHVybiBmYWxzZTtcbiAgaWYgKGlzQXJndW1lbnRzKGEpKSB7XG4gICAgaWYgKCFpc0FyZ3VtZW50cyhiKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBhID0gcFNsaWNlLmNhbGwoYSk7XG4gICAgYiA9IHBTbGljZS5jYWxsKGIpO1xuICAgIHJldHVybiBleHBvcnRzLmRlZXBFcXVhbChhLCBiKTtcbiAgfVxuICB0cnkge1xuICAgIHZhciBrYSA9IE9iamVjdC5rZXlzKGEpLFxuICAgICAgICBrYiA9IE9iamVjdC5rZXlzKGIpLFxuICAgICAgICBrZXksIGk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGthLmxlbmd0aCAhPSBrYi5sZW5ndGgpXG4gICAgcmV0dXJuIGZhbHNlO1xuICBrYS5zb3J0KCk7XG4gIGtiLnNvcnQoKTtcbiAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAoa2FbaV0gIT0ga2JbaV0pXG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBrZXkgPSBrYVtpXTtcbiAgICBpZiAoIWV4cG9ydHMuZGVlcEVxdWFsKGFba2V5XSwgYltrZXldKSkgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4iLCIvL1xuLy8gVm93cy5qcyAtIGFzeW5jaHJvbm91cyBldmVudC1iYXNlZCBCREQgZm9yIG5vZGUuanNcbi8vXG4vLyAgIHVzYWdlOlxuLy9cbi8vICAgICAgIHZhciB2b3dzID0gcmVxdWlyZSgndm93cycpO1xuLy9cbi8vICAgICAgIHZvd3MuZGVzY3JpYmUoJ0RlZXAgVGhvdWdodCcpLmFkZEJhdGNoKHtcbi8vICAgICAgICAgICBcIkFuIGluc3RhbmNlIG9mIERlZXBUaG91Z2h0XCI6IHtcbi8vICAgICAgICAgICAgICAgdG9waWM6IG5ldyBEZWVwVGhvdWdodCxcbi8vXG4vLyAgICAgICAgICAgICAgIFwic2hvdWxkIGtub3cgdGhlIGFuc3dlciB0byB0aGUgdWx0aW1hdGUgcXVlc3Rpb24gb2YgbGlmZVwiOiBmdW5jdGlvbiAoZGVlcFRob3VnaHQpIHtcbi8vICAgICAgICAgICAgICAgICAgIGFzc2VydC5lcXVhbCAoZGVlcFRob3VnaHQucXVlc3Rpb24oJ3doYXQgaXMgdGhlIGFuc3dlciB0byB0aGUgdW5pdmVyc2U/JyksIDQyKTtcbi8vICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgIH1cbi8vICAgICAgIH0pLnJ1bigpO1xuLy9cbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpLFxuICAgIGV2ZW50cyA9IHJlcXVpcmUoJ2V2ZW50cycpLFxuICAgIHV0aWwgPSByZXF1aXJlKCd1dGlsJyksXG4gICAgdm93cyA9IGV4cG9ydHM7XG5cbi8vIE9wdGlvbnNcbnZvd3Mub3B0aW9ucyA9IHtcbiAgICBFbWl0dGVyOiBldmVudHMuRXZlbnRFbWl0dGVyLFxuICAgIHJlcG9ydGVyOiByZXF1aXJlKCcuL3Zvd3MvcmVwb3J0ZXJzL2RvdC1tYXRyaXgnKSxcbiAgICBtYXRjaGVyOiAvLiovLFxuICAgIGVycm9yOiB0cnVlIC8vIEhhbmRsZSBcImVycm9yXCIgZXZlbnRcbn07XG5cbnZvd3MuX19kZWZpbmVHZXR0ZXJfXygncmVwb3J0ZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHZvd3Mub3B0aW9ucy5yZXBvcnRlcjtcbn0pO1xuXG52YXIgc3R5bGl6ZSA9IHJlcXVpcmUoJy4vdm93cy9jb25zb2xlJykuc3R5bGl6ZTtcbnZhciBjb25zb2xlID0gdm93cy5jb25zb2xlID0gcmVxdWlyZSgnLi92b3dzL2NvbnNvbGUnKTtcblxudm93cy5pbnNwZWN0ID0gcmVxdWlyZSgnLi92b3dzL2NvbnNvbGUnKS5pbnNwZWN0O1xudm93cy5wcmVwYXJlID0gcmVxdWlyZSgnLi92b3dzL2V4dHJhcycpLnByZXBhcmU7XG52b3dzLnRyeUVuZCAgPSByZXF1aXJlKCcuL3Zvd3Mvc3VpdGUnKS50cnlFbmQ7XG5cbi8vXG4vLyBBc3NlcnRpb24gTWFjcm9zICYgRXh0ZW5zaW9uc1xuLy9cbnJlcXVpcmUoJy4vYXNzZXJ0L2Vycm9yJyk7XG5yZXF1aXJlKCcuL2Fzc2VydC9tYWNyb3MnKTtcblxuLy9cbi8vIFN1aXRlIGNvbnN0cnVjdG9yXG4vL1xudmFyIFN1aXRlID0gcmVxdWlyZSgnLi92b3dzL3N1aXRlJykuU3VpdGU7XG5cbi8vXG4vLyBUaGlzIGZ1bmN0aW9uIGdldHMgYWRkZWQgdG8gZXZlbnRzLkV2ZW50RW1pdHRlci5wcm90b3R5cGUsIGJ5IGRlZmF1bHQuXG4vLyBJdCdzIGVzc2VudGlhbGx5IGEgd3JhcHBlciBhcm91bmQgYG9uYCwgd2hpY2ggYWRkcyBhbGwgdGhlIHNwZWNpZmljYXRpb25cbi8vIGdvb2RuZXNzLlxuLy9cbmZ1bmN0aW9uIGFkZFZvdyh2b3cpIHtcbiAgICB2YXIgYmF0Y2ggPSB2b3cuYmF0Y2gsXG4gICAgICAgIGV2ZW50ID0gdm93LmJpbmRpbmcuY29udGV4dC5ldmVudCB8fCAnc3VjY2VzcycsXG4gICAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgYmF0Y2gudG90YWwgKys7XG4gICAgYmF0Y2gudm93cy5wdXNoKHZvdyk7XG5cbiAgICAvLyBhbHdheXMgc2V0IGEgbGlzdGVuZXIgb24gdGhlIGV2ZW50XG4gICAgdGhpcy5vbihldmVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZih2b3cuY2F1Z2h0RXJyb3IpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAvLyBJZiB0aGUgdm93IGlzIGEgc3ViLWV2ZW50IHRoZW4gd2Uga25vdyBpdCBpcyBhblxuICAgICAgICAvLyBlbWl0dGVkIGV2ZW50LiAgU28gSSBkb24ndCBtdWNrIHdpdGggdGhlIGFyZ3VtZW50c1xuICAgICAgICAvLyBIb3dldmVyIHRoZSBsZWdhY3kgYmVoYXZpb3I6XG4gICAgICAgIC8vIElmIHRoZSBjYWxsYmFjayBpcyBleHBlY3RpbmcgdHdvIG9yIG1vcmUgYXJndW1lbnRzLFxuICAgICAgICAvLyBwYXNzIHRoZSBlcnJvciBhcyB0aGUgZmlyc3QgKG51bGwpIGFuZCB0aGUgcmVzdWx0IGFmdGVyLlxuICAgICAgICBpZiAoISh0aGlzLmN0eCAmJiB0aGlzLmN0eC5pc0V2ZW50KSAmJlxuICAgICAgICAgICAgdm93LmNhbGxiYWNrLmxlbmd0aCA+PSAyICYmIGJhdGNoLnN1aXRlLm9wdGlvbnMuZXJyb3IpIHtcbiAgICAgICAgICAgIGFyZ3MudW5zaGlmdChudWxsKTtcbiAgICAgICAgfVxuICAgICAgICBydW5UZXN0KGFyZ3MsIHRoaXMuY3R4KTtcbiAgICAgICAgdm93cy50cnlFbmQoYmF0Y2gpO1xuICAgIH0pO1xuXG4gICAgaWYgKGV2ZW50ICE9PSAnZXJyb3InKSB7XG4gICAgICAgIHRoaXMub24oXCJlcnJvclwiLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICB2b3cuY2F1Z2h0RXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKHZvdy5jYWxsYmFjay5sZW5ndGggPj0gMiB8fCAhYmF0Y2guc3VpdGUub3B0aW9ucy5lcnJvcikge1xuICAgICAgICAgICAgICAgIHJ1blRlc3QoYXJndW1lbnRzLCB0aGlzLmN0eCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG91dHB1dCgnZXJyb3JlZCcsIHsgdHlwZTogJ2VtaXR0ZXInLCBlcnJvcjogZXJyLnN0YWNrIHx8XG4gICAgICAgICAgICAgICAgICAgICAgIGVyci5tZXNzYWdlIHx8IEpTT04uc3RyaW5naWZ5KGVycikgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2b3dzLnRyeUVuZChiYXRjaCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIGluIGNhc2UgYW4gZXZlbnQgZmlyZWQgYmVmb3JlIHdlIGNvdWxkIGxpc3RlblxuICAgIGlmICh0aGlzLl92b3dzRW1pdGVkRXZlbnRzICYmXG4gICAgICAgIHRoaXMuX3Zvd3NFbWl0ZWRFdmVudHMuaGFzT3duUHJvcGVydHkoZXZlbnQpKSB7XG4gICAgICAgIC8vIG1ha2Ugc3VyZSBubyBvbmUgaXMgbWVzc2luZyB3aXRoIG1lXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuX3Zvd3NFbWl0ZWRFdmVudHNbZXZlbnRdKSkge1xuICAgICAgICAgICAgLy8gSSBkb24ndCB0aGluayBJIG5lZWQgdG8gb3B0aW1pemUgZm9yIG9uZSBldmVudCxcbiAgICAgICAgICAgIC8vIEkgdGhpbmsgaXQgaXMgbW9yZSBpbXBvcnRhbnQgdG8gbWFrZSBzdXJlIEkgY2hlY2sgdGhlIHZvdyBuIHRpbWVzXG4gICAgICAgICAgICBzZWxmLl92b3dzRW1pdGVkRXZlbnRzW2V2ZW50XS5mb3JFYWNoKGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBydW5UZXN0KGFyZ3MsIHNlbGYuY3R4KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaW5pdGlhbCBjb25kaXRpb25zIHByb2JsZW1cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignX3Zvd3NFbWl0ZWRFdmVudHNbJyArIGV2ZW50ICsgJ10gaXMgbm90IGFuIEFycmF5JylcbiAgICAgICAgfVxuICAgICAgICB2b3dzLnRyeUVuZChiYXRjaCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgICBmdW5jdGlvbiBydW5UZXN0KGFyZ3MsIGN0eCkge1xuICAgICAgICBpZiAodm93LmNhbGxiYWNrIGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0KCdwZW5kaW5nJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodm93LmJpbmRpbmcuY29udGV4dC5pc0V2ZW50ICYmIHZvdy5iaW5kaW5nLmNvbnRleHQuYWZ0ZXIpIHtcbiAgICAgICAgICAgIHZhciBhZnRlciA9IHZvdy5iaW5kaW5nLmNvbnRleHQuYWZ0ZXI7XG4gICAgICAgICAgICAvLyBvbmx5IG5lZWQgdG8gY2hlY2sgb3JkZXIuICBJIHdvbid0IGdldCBoZXJlIGlmIHRoZSBhZnRlciBldmVudFxuICAgICAgICAgICAgLy8gaGFzIG5ldmVyIGJlZW4gZW1pdHRlZFxuICAgICAgICAgICAgaWYgKHNlbGYuX3Zvd3NFbWl0ZWRFdmVudHNPcmRlci5pbmRleE9mKGFmdGVyKSA+XG4gICAgICAgICAgICAgICAgc2VsZi5fdm93c0VtaXRlZEV2ZW50c09yZGVyLmluZGV4T2YoZXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0KCdicm9rZW4nLCBldmVudCArICcgZW1pdHRlZCBiZWZvcmUgJyArIGFmdGVyKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSdW4gdGhlIHRlc3QsIGFuZCB0cnkgdG8gY2F0Y2ggYEFzc2VydGlvbkVycm9yYHMgYW5kIG90aGVyIGV4Y2VwdGlvbnM7XG4gICAgICAgIC8vIGluY3JlbWVudCBjb3VudGVycyBhY2NvcmRpbmdseS5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZvdy5jYWxsYmFjay5hcHBseShjdHggPT09IGdsb2JhbCB8fCAhY3R4ID8gdm93LmJpbmRpbmcgOiBjdHgsIGFyZ3MpO1xuICAgICAgICAgICAgb3V0cHV0KCdob25vcmVkJyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGlmIChlLm5hbWUgJiYgZS5uYW1lLm1hdGNoKC9Bc3NlcnRpb25FcnJvci8pKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0KCdicm9rZW4nLCBlLnRvU3RyaW5nRXgoKS5yZXBsYWNlKC9cXGAvZywgJ2AnKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG91dHB1dCgnZXJyb3JlZCcsIGUuc3RhY2sgfHwgZS5tZXNzYWdlIHx8IGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb3V0cHV0KHN0YXR1cywgZXhjZXB0aW9uKSB7XG4gICAgICAgIGJhdGNoW3N0YXR1c10gKys7XG4gICAgICAgIHZvdy5zdGF0dXMgPSBzdGF0dXM7XG5cbiAgICAgICAgaWYgKHZvdy5jb250ZXh0ICYmIGJhdGNoLmxhc3RDb250ZXh0ICE9PSB2b3cuY29udGV4dCkge1xuICAgICAgICAgICAgYmF0Y2gubGFzdENvbnRleHQgPSB2b3cuY29udGV4dDtcbiAgICAgICAgICAgIGJhdGNoLnN1aXRlLnJlcG9ydChbJ2NvbnRleHQnLCB2b3cuY29udGV4dF0pO1xuICAgICAgICB9XG4gICAgICAgIGJhdGNoLnN1aXRlLnJlcG9ydChbJ3ZvdycsIHtcbiAgICAgICAgICAgIHRpdGxlOiB2b3cuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICBjb250ZXh0OiB2b3cuY29udGV4dCxcbiAgICAgICAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgICAgICAgZXhjZXB0aW9uOiBleGNlcHRpb24gfHwgbnVsbFxuICAgICAgICB9XSk7XG4gICAgfVxufTtcblxuLy9cbi8vIE9uIGV4aXQsIGNoZWNrIHRoYXQgYWxsIGVtaXR0ZXJzIGhhdmUgYmVlbiBmaXJlZC5cbi8vIElmIG5vdCwgcmVwb3J0IGFuIGVycm9yIG1lc3NhZ2UuXG4vL1xucHJvY2Vzcy5vbignZXhpdCcsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0cyA9IHsgaG9ub3JlZDogMCwgYnJva2VuOiAwLCBlcnJvcmVkOiAwLCBwZW5kaW5nOiAwLCB0b3RhbDogMCB9LFxuICAgICAgICBmYWlsdXJlO1xuXG4gICAgdm93cy5zdWl0ZXMuZm9yRWFjaChmdW5jdGlvbiAocykge1xuICAgICAgICBpZiAoKHMucmVzdWx0cy50b3RhbCA+IDApICYmIChzLnJlc3VsdHMudGltZSA9PT0gbnVsbCkpIHtcbiAgICAgICAgICAgIHMucmVwb3J0ZXIucHJpbnQoJ1xcblxcbicpO1xuICAgICAgICAgICAgcy5yZXBvcnRlci5yZXBvcnQoWydlcnJvcicsIHsgZXJyb3I6IFwiQXN5bmNocm9ub3VzIEVycm9yXCIsIHN1aXRlOiBzIH1dKTtcbiAgICAgICAgfVxuICAgICAgICBzLmJhdGNoZXMuZm9yRWFjaChmdW5jdGlvbiAoYikge1xuICAgICAgICAgICAgdmFyIHVuRmlyZWQgPSBbXTtcblxuICAgICAgICAgICAgYi52b3dzLmZvckVhY2goZnVuY3Rpb24gKHZvdykge1xuICAgICAgICAgICAgICAgIGlmICghIHZvdy5zdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVuRmlyZWQuaW5kZXhPZih2b3cuY29udGV4dCkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1bkZpcmVkLnB1c2godm93LmNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICh1bkZpcmVkLmxlbmd0aCA+IDApIHsgdXRpbC5wcmludCgnXFxuJyk7IH1cblxuICAgICAgICAgICAgdW5GaXJlZC5mb3JFYWNoKGZ1bmN0aW9uICh0aXRsZSkge1xuICAgICAgICAgICAgICAgIHMucmVwb3J0ZXIucmVwb3J0KFsnZXJyb3InLCB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBcImNhbGxiYWNrIG5vdCBmaXJlZFwiLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgYmF0Y2g6IGIsXG4gICAgICAgICAgICAgICAgICAgIHN1aXRlOiBzXG4gICAgICAgICAgICAgICAgfV0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChiLnN0YXR1cyA9PT0gJ2JlZ2luJykge1xuICAgICAgICAgICAgICAgIGZhaWx1cmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc3VsdHMuZXJyb3JlZCArKztcbiAgICAgICAgICAgICAgICByZXN1bHRzLnRvdGFsICsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgT2JqZWN0LmtleXMocmVzdWx0cykuZm9yRWFjaChmdW5jdGlvbiAoaykgeyByZXN1bHRzW2tdICs9IGJba10gfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChmYWlsdXJlKSB7XG4gICAgICAgIHV0aWwucHV0cyhjb25zb2xlLnJlc3VsdChyZXN1bHRzKSk7XG4gICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICB9XG59KTtcblxudm93cy5zdWl0ZXMgPSBbXTtcblxuLy8gV2UgbmVlZCB0aGUgb2xkIGVtaXQgZnVuY3Rpb24gc28gd2UgY2FuIGhvb2sgaXRcbi8vIGFuZCBkbyBtYWdpYyB0byBkZWFsIHdpdGggZXZlbnRzIHRoYXQgaGF2ZSBmaXJlZFxudmFyIG9sZEVtaXQgPSB2b3dzLm9wdGlvbnMuRW1pdHRlci5wcm90b3R5cGUuZW1pdDtcblxuLy9cbi8vIENyZWF0ZSBhIG5ldyB0ZXN0IHN1aXRlXG4vL1xudm93cy5kZXNjcmliZSA9IGZ1bmN0aW9uIChzdWJqZWN0KSB7XG4gICAgdmFyIHN1aXRlID0gbmV3KFN1aXRlKShzdWJqZWN0KTtcblxuICAgIHRoaXMub3B0aW9ucy5FbWl0dGVyLnByb3RvdHlwZS5hZGRWb3cgPSBhZGRWb3c7XG4gICAgLy8ganVzdCBpbiBjYXNlIHNvbWVvbmUgZW1pdCdzIGJlZm9yZSBJIGdldCB0byBpdFxuICAgIHRoaXMub3B0aW9ucy5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuX3Zvd3NFbWl0ZWRFdmVudHMgPSB0aGlzLl92b3dzRW1pdGVkRXZlbnRzIHx8IHt9O1xuICAgICAgICB0aGlzLl92b3dzRW1pdGVkRXZlbnRzT3JkZXIgPSB0aGlzLl92b3dzRW1pdGVkRXZlbnRzT3JkZXIgfHwgW107XG4gICAgICAgIC8vIHNsaWNlIG9mZiB0aGUgZXZlbnRcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICAvLyBpZiBtdWx0aXBsZSBldmVudHMgYXJlIGZpcmVkLCBhZGQgb3IgcHVzaFxuICAgICAgICBpZiAodGhpcy5fdm93c0VtaXRlZEV2ZW50cy5oYXNPd25Qcm9wZXJ0eShldmVudCkpIHtcbiAgICAgICAgICAgIHRoaXMuX3Zvd3NFbWl0ZWRFdmVudHNbZXZlbnRdLnB1c2goYXJncyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl92b3dzRW1pdGVkRXZlbnRzW2V2ZW50XSA9IFthcmdzXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHB1c2ggdGhlIGV2ZW50IG9udG8gYSBzdGFjayBzbyBJIGhhdmUgYW4gb3JkZXJcbiAgICAgICAgdGhpcy5fdm93c0VtaXRlZEV2ZW50c09yZGVyLnB1c2goZXZlbnQpO1xuICAgICAgICByZXR1cm4gb2xkRW1pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICB0aGlzLnN1aXRlcy5wdXNoKHN1aXRlKTtcblxuICAgIC8vXG4gICAgLy8gQWRkIGFueSBhZGRpdGlvbmFsIGFyZ3VtZW50cyBhcyBiYXRjaGVzIGlmIHRoZXkncmUgcHJlc2VudFxuICAgIC8vXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgc3VpdGUuYWRkQmF0Y2goYXJndW1lbnRzW2ldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdWl0ZTtcbn07XG5cblxudm93cy52ZXJzaW9uID0gSlNPTi5wYXJzZShyZXF1aXJlKCdmcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC5yZWFkRmlsZVN5bmMocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ3BhY2thZ2UuanNvbicpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLnZlcnNpb25cbiIsInZhciBleWVzID0gcmVxdWlyZSgnZXllcycpLmluc3BlY3Rvcih7IHN0cmVhbTogbnVsbCwgc3R5bGVzOiBmYWxzZSB9KTtcblxuLy8gU3R5bGl6ZSBhIHN0cmluZ1xudGhpcy5zdHlsaXplID0gZnVuY3Rpb24gc3R5bGl6ZShzdHIsIHN0eWxlKSB7XG4gICAgaWYgKG1vZHVsZS5leHBvcnRzLm5vY29sb3IpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuXG4gICAgdmFyIHN0eWxlcyA9IHtcbiAgICAgICAgJ2JvbGQnICAgICAgOiBbMSwgIDIyXSxcbiAgICAgICAgJ2l0YWxpYycgICAgOiBbMywgIDIzXSxcbiAgICAgICAgJ3VuZGVybGluZScgOiBbNCwgIDI0XSxcbiAgICAgICAgJ2N5YW4nICAgICAgOiBbOTYsIDM5XSxcbiAgICAgICAgJ3llbGxvdycgICAgOiBbMzMsIDM5XSxcbiAgICAgICAgJ2dyZWVuJyAgICAgOiBbMzIsIDM5XSxcbiAgICAgICAgJ3JlZCcgICAgICAgOiBbMzEsIDM5XSxcbiAgICAgICAgJ2dyZXknICAgICAgOiBbOTAsIDM5XSxcbiAgICAgICAgJ2dyZWVuLWhpJyAgOiBbOTIsIDMyXSxcbiAgICB9O1xuICAgIHJldHVybiAnXFwwMzNbJyArIHN0eWxlc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFwwMzNbJyArIHN0eWxlc1tzdHlsZV1bMV0gKyAnbSc7XG59O1xuXG52YXIgJCA9IHRoaXMuJCA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICBzdHIgPSBuZXcoU3RyaW5nKShzdHIpO1xuXG4gICAgWydib2xkJywgJ2dyZXknLCAneWVsbG93JywgJ3JlZCcsICdncmVlbicsICd3aGl0ZScsICdjeWFuJywgJ2l0YWxpYyddLmZvckVhY2goZnVuY3Rpb24gKHN0eWxlKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzdHIsIHN0eWxlLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXhwb3J0cy4kKGV4cG9ydHMuc3R5bGl6ZSh0aGlzLCBzdHlsZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gc3RyO1xufTtcblxudGhpcy5wdXRzID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgc3R5bGl6ZSA9IGV4cG9ydHMuc3R5bGl6ZTtcbiAgICBvcHRpb25zLnN0cmVhbSB8fCAob3B0aW9ucy5zdHJlYW0gPSBwcm9jZXNzLnN0ZG91dCk7XG4gICAgb3B0aW9ucy50YWlsID0gb3B0aW9ucy50YWlsIHx8ICcnO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICBpZiAoIW9wdGlvbnMucmF3KSB7XG4gICAgICAgICAgICBhcmdzID0gYXJncy5tYXAoZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS5yZXBsYWNlKC9gKFteYF0rKWAvZywgICBmdW5jdGlvbiAoXywgY2FwdHVyZSkgeyByZXR1cm4gc3R5bGl6ZShjYXB0dXJlLCAnaXRhbGljJykgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXCooW14qXSspXFwqL2csIGZ1bmN0aW9uIChfLCBjYXB0dXJlKSB7IHJldHVybiBzdHlsaXplKGNhcHR1cmUsICdib2xkJykgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgZnVuY3Rpb24gKF8sIGNhcHR1cmUpIHsgcmV0dXJuICcgXFxuICAnIH0gKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHRpb25zLnN0cmVhbS53cml0ZShhcmdzLmpvaW4oJ1xcbicpICsgb3B0aW9ucy50YWlsKTtcbiAgICB9O1xufTtcblxudGhpcy5sb2cgPSB0aGlzLnB1dHMoe30pO1xuXG50aGlzLnJlc3VsdCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciByZXN1bHQgPSBbXSwgYnVmZmVyID0gW10sIHRpbWUgPSAnJywgaGVhZGVyO1xuICAgIHZhciBjb21wbGV0ZSA9IGV2ZW50Lmhvbm9yZWQgKyBldmVudC5wZW5kaW5nICsgZXZlbnQuZXJyb3JlZCArIGV2ZW50LmJyb2tlbjtcbiAgICB2YXIgc3RhdHVzID0gKGV2ZW50LmVycm9yZWQgJiYgJ2Vycm9yZWQnKSB8fCAoZXZlbnQuYnJva2VuICYmICdicm9rZW4nKSB8fFxuICAgICAgICAgICAgICAgICAoZXZlbnQuaG9ub3JlZCAmJiAnaG9ub3JlZCcpIHx8IChldmVudC5wZW5kaW5nICYmICdwZW5kaW5nJyk7XG5cbiAgICBpZiAoZXZlbnQudG90YWwgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIFskKFwiQ291bGQgbm90IGZpbmQgYW55IHRlc3RzIHRvIHJ1bi5cIikuYm9sZC5yZWRdO1xuICAgIH1cblxuICAgIGV2ZW50Lmhvbm9yZWQgJiYgcmVzdWx0LnB1c2goJChldmVudC5ob25vcmVkKS5ib2xkICsgXCIgaG9ub3JlZFwiKTtcbiAgICBldmVudC5icm9rZW4gICYmIHJlc3VsdC5wdXNoKCQoZXZlbnQuYnJva2VuKS5ib2xkICArIFwiIGJyb2tlblwiKTtcbiAgICBldmVudC5lcnJvcmVkICYmIHJlc3VsdC5wdXNoKCQoZXZlbnQuZXJyb3JlZCkuYm9sZCArIFwiIGVycm9yZWRcIik7XG4gICAgZXZlbnQucGVuZGluZyAmJiByZXN1bHQucHVzaCgkKGV2ZW50LnBlbmRpbmcpLmJvbGQgKyBcIiBwZW5kaW5nXCIpO1xuXG4gICAgaWYgKGNvbXBsZXRlIDwgZXZlbnQudG90YWwpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goJChldmVudC50b3RhbCAtIGNvbXBsZXRlKS5ib2xkICsgXCIgZHJvcHBlZFwiKTtcbiAgICB9XG5cbiAgICByZXN1bHQgPSByZXN1bHQuam9pbignIOKImSAnKTtcblxuICAgIGhlYWRlciA9IHtcbiAgICAgICAgaG9ub3JlZDogJ+KckyAnICsgJCgnT0snKS5ib2xkLmdyZWVuLFxuICAgICAgICBicm9rZW46ICAn4pyXICcgKyAkKCdCcm9rZW4nKS5ib2xkLnllbGxvdyxcbiAgICAgICAgZXJyb3JlZDogJ+KclyAnICsgJCgnRXJyb3JlZCcpLmJvbGQucmVkLFxuICAgICAgICBwZW5kaW5nOiAnLSAnICsgJCgnUGVuZGluZycpLmJvbGQuY3lhblxuICAgIH1bc3RhdHVzXSArICcgwrsgJztcblxuICAgIGlmICh0eXBlb2YoZXZlbnQudGltZSkgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHRpbWUgPSAnICgnICsgZXZlbnQudGltZS50b0ZpeGVkKDMpICsgJ3MpJztcbiAgICAgICAgdGltZSA9IHRoaXMuc3R5bGl6ZSh0aW1lLCAnZ3JleScpO1xuICAgIH1cbiAgICBidWZmZXIucHVzaChoZWFkZXIgKyByZXN1bHQgKyB0aW1lICsgJ1xcbicpO1xuXG4gICAgcmV0dXJuIGJ1ZmZlcjtcbn07XG5cbnRoaXMuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QodmFsKSB7XG4gICAgaWYgKG1vZHVsZS5leHBvcnRzLm5vY29sb3IpIHtcbiAgICAgIHJldHVybiBleWVzKHZhbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuICdcXDAzM1sxbScgKyBleWVzKHZhbCkgKyAnXFwwMzNbMjJtJztcbn07XG5cbnRoaXMuZXJyb3IgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgdmFyIHN0cmluZyAgPSAn4pyXICcgKyAkKCdFcnJvcmVkICcpLnJlZCArICfCuyAnO1xuICAgICAgICBzdHJpbmcgKz0gJChvYmouZXJyb3IpLnJlZC5ib2xkICAgICAgICAgICAgICAgICAgICAgICAgICsgJ1xcbic7XG4gICAgICAgIHN0cmluZyArPSAob2JqLmNvbnRleHQgPyAnICAgIGluICcgKyAkKG9iai5jb250ZXh0KS5yZWQgKyAnXFxuJzogJycpO1xuICAgICAgICBzdHJpbmcgKz0gJyAgICBpbiAnICsgJChvYmouc3VpdGUuc3ViamVjdCkucmVkICAgICAgICAgICsgJ1xcbic7XG4gICAgICAgIHN0cmluZyArPSAnICAgIGluICcgKyAkKG9iai5zdWl0ZS5fZmlsZW5hbWUpLnJlZDtcblxuICAgIHJldHVybiBzdHJpbmc7XG59O1xuXG50aGlzLmNvbnRleHRUZXh0ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgcmV0dXJuICcgICcgKyBldmVudDtcbn07XG5cbnRoaXMudm93VGV4dCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBidWZmZXIgPSBbXTtcblxuICAgIGJ1ZmZlci5wdXNoKCcgICAnICsge1xuICAgICAgICBob25vcmVkOiAnIOKckyAnLFxuICAgICAgICBicm9rZW46ICAnIOKclyAnLFxuICAgICAgICBlcnJvcmVkOiAnIOKclyAnLFxuICAgICAgICBwZW5kaW5nOiAnIC0gJ1xuICAgIH1bZXZlbnQuc3RhdHVzXSArIHRoaXMuc3R5bGl6ZShldmVudC50aXRsZSwgKHtcbiAgICAgICAgaG9ub3JlZDogJ2dyZWVuJyxcbiAgICAgICAgYnJva2VuOiAgJ3llbGxvdycsXG4gICAgICAgIGVycm9yZWQ6ICdyZWQnLFxuICAgICAgICBwZW5kaW5nOiAnY3lhbidcbiAgICB9KVtldmVudC5zdGF0dXNdKSk7XG5cbiAgICBpZiAoZXZlbnQuc3RhdHVzID09PSAnYnJva2VuJykge1xuICAgICAgICBidWZmZXIucHVzaCgnICAgICAgwrsgJyArIGV2ZW50LmV4Y2VwdGlvbik7XG4gICAgfSBlbHNlIGlmIChldmVudC5zdGF0dXMgPT09ICdlcnJvcmVkJykge1xuICAgICAgICBpZiAoZXZlbnQuZXhjZXB0aW9uLnR5cGUgPT09ICdlbWl0dGVyJykge1xuICAgICAgICAgICAgYnVmZmVyLnB1c2goJyAgICAgIMK7ICcgKyB0aGlzLnN0eWxpemUoXCJBbiB1bmV4cGVjdGVkIGVycm9yIHdhcyBjYXVnaHQ6IFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGl6ZShldmVudC5leGNlcHRpb24uZXJyb3IsICdib2xkJyksICdyZWQnKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBidWZmZXIucHVzaCgnICAgICcgKyB0aGlzLnN0eWxpemUoZXZlbnQuZXhjZXB0aW9uLCAncmVkJykpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBidWZmZXIuam9pbignXFxuJyk7XG59O1xuIiwiXG50aGlzLkNvbnRleHQgPSBmdW5jdGlvbiAodm93LCBjdHgsIGVudikge1xuICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgIHRoaXMudGVzdHMgPSB2b3cuY2FsbGJhY2s7XG4gICAgdGhpcy50b3BpY3MgPSAoY3R4LnRvcGljcyB8fCBbXSkuc2xpY2UoMCk7XG4gICAgdGhpcy5lbWl0dGVyID0gbnVsbDtcbiAgICB0aGlzLmVudiA9IGVudiB8fCB7fTtcbiAgICB0aGlzLmVudi5jb250ZXh0ID0gdGhpcztcblxuICAgIHRoaXMuZW52LmNhbGxiYWNrID0gZnVuY3Rpb24gKC8qIGFyZ3VtZW50cyAqLykge1xuICAgICAgICB2YXIgY3R4ID0gdGhpcztcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgICAgIHZhciBlbWl0ID0gKGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gQ29udmVydCBjYWxsYmFjay1zdHlsZSByZXN1bHRzIGludG8gZXZlbnRzLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIGlmICh2b3cuYmF0Y2guc3VpdGUub3B0aW9ucy5lcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlID0gYXJncy5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmVtaXR0ZXIuY3R4ID0gY3R4O1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSBoYW5kbGUgYSBzcGVjaWFsIGNhc2UsIHdoZXJlIHRoZSBmaXJzdCBhcmd1bWVudCBpcyBhXG4gICAgICAgICAgICAgICAgICAgIC8vIGJvb2xlYW4sIGluIHdoaWNoIGNhc2Ugd2UgdHJlYXQgaXQgYXMgYSByZXN1bHQsIGFuZCBub3RcbiAgICAgICAgICAgICAgICAgICAgLy8gYW4gZXJyb3IuIFRoaXMgaXMgdXNlZnVsIGZvciBgcGF0aC5leGlzdHNgIGFuZCBvdGhlclxuICAgICAgICAgICAgICAgICAgICAvLyBmdW5jdGlvbnMgbGlrZSBpdCwgd2hpY2ggb25seSBwYXNzIGEgc2luZ2xlIGJvb2xlYW5cbiAgICAgICAgICAgICAgICAgICAgLy8gcGFyYW1ldGVyIGluc3RlYWQgb2YgdGhlIG1vcmUgY29tbW9uIChlcnJvciwgcmVzdWx0KSBwYWlyLlxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mKGUpID09PSAnYm9vbGVhbicgJiYgYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuZW1pdHRlci5lbWl0LmNhbGwodGhhdC5lbWl0dGVyLCAnc3VjY2VzcycsIGUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUpIHsgdGhhdC5lbWl0dGVyLmVtaXQuYXBwbHkodGhhdC5lbWl0dGVyLCBbJ2Vycm9yJywgZV0uY29uY2F0KGFyZ3MpKSB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlICAgeyB0aGF0LmVtaXR0ZXIuZW1pdC5hcHBseSh0aGF0LmVtaXR0ZXIsIFsnc3VjY2VzcyddLmNvbmNhdChhcmdzKSkgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5lbWl0dGVyLmN0eCA9IGN0eDtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5lbWl0dGVyLmVtaXQuYXBwbHkodGhhdC5lbWl0dGVyLCBbJ3N1Y2Nlc3MnXS5jb25jYXQoYXJncykpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKGFyZ3Muc2xpY2UoMCkpO1xuICAgICAgICAvLyBJZiBgdGhpcy5jYWxsYmFja2AgaXMgY2FsbGVkIHN5bmNocm9ub3VzbHksXG4gICAgICAgIC8vIHRoZSBlbWl0dGVyIHdpbGwgbm90IGhhdmUgYmVlbiBzZXQgeWV0LFxuICAgICAgICAvLyBzbyB3ZSBkZWZlciB0aGUgZW1pdGlvbiwgdGhhdCB3YXkgaXQnbGwgYmVoYXZlXG4gICAgICAgIC8vIGFzeW5jaHJvbm91c2x5LlxuICAgICAgICBpZiAodGhhdC5lbWl0dGVyKSB7IGVtaXQoKSB9XG4gICAgICAgIGVsc2UgICAgICAgICAgICAgIHsgcHJvY2Vzcy5uZXh0VGljayhlbWl0KSB9XG4gICAgfTtcbiAgICB0aGlzLm5hbWUgPSB2b3cuZGVzY3JpcHRpb247XG4gICAgLy8gZXZlbnRzIGlzIGFuIGFsaWFzIGZvciBvblxuICAgIGlmICh0aGlzLm5hbWUgPT09ICdldmVudHMnKSB7XG4gICAgICB0aGlzLm5hbWUgPSB2b3cuZGVzY3JpcHRpb24gPSAnb24nO1xuICAgIH1cblxuICAgIC8vIGlmIHRoaXMgaXMgYSBzdWItZXZlbnQgY29udGV4dCBBTkQgaXQncyBjb250ZXh0IHdhcyBhbiBldmVudCxcbiAgICAvLyB0aGVuIEkgbXVzdCBlbmZvcmNlIGV2ZW50IG9yZGVyLlxuICAgIC8vIHRoaXMgd2lsbCBub3QgZG8gYSBnb29kIGpvYiBvZiBoYW5kbGluZyBwaW4tcG9uZyBldmVudHNcbiAgICBpZiAodGhpcy5uYW1lID09PSAnb24nICYmIGN0eC5pc0V2ZW50KSB7XG4gICAgICAgIHRoaXMuYWZ0ZXIgPSBjdHgubmFtZTtcbiAgICB9XG5cbiAgICBpZiAoY3R4Lm5hbWUgPT09ICdvbicpIHtcbiAgICAgICAgdGhpcy5pc0V2ZW50ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ldmVudCA9IHRoaXMubmFtZTtcbiAgICAgICAgdGhpcy5hZnRlciA9IGN0eC5hZnRlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmlzRXZlbnQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ldmVudCA9ICdzdWNjZXNzJztcbiAgICB9XG5cbiAgICB0aGlzLnRpdGxlID0gW1xuICAgICAgICBjdHgudGl0bGUgfHwgJycsXG4gICAgICAgIHZvdy5kZXNjcmlwdGlvbiB8fCAnJ1xuICAgIF0uam9pbigvXlsjLjpdLy50ZXN0KHZvdy5kZXNjcmlwdGlvbikgPyAnJyA6ICcgJykudHJpbSgpO1xufTtcblxuIiwidmFyIGV2ZW50cyA9IHJlcXVpcmUoJ2V2ZW50cycpO1xuLy9cbi8vIFdyYXAgYSBOb2RlLmpzIHN0eWxlIGFzeW5jIGZ1bmN0aW9uIGludG8gYW4gRXZlbnRFbWl0dGVyXG4vL1xudGhpcy5wcmVwYXJlID0gZnVuY3Rpb24gKG9iaiwgdGFyZ2V0cykge1xuICAgIHRhcmdldHMuZm9yRWFjaChmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGlmICh0YXJnZXQgaW4gb2JqKSB7XG4gICAgICAgICAgICBvYmpbdGFyZ2V0XSA9IChmdW5jdGlvbiAoZnVuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWUgPSBuZXcoZXZlbnRzLkV2ZW50RW1pdHRlcik7XG5cbiAgICAgICAgICAgICAgICAgICAgYXJncy5wdXNoKGZ1bmN0aW9uIChlcnIgLyogWywgZGF0YV0gKi8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikgeyBlZS5lbWl0LmFwcGx5KGVlLCBbJ2Vycm9yJywgZXJyXS5jb25jYXQoYXJncykpIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgICAgIHsgZWUuZW1pdC5hcHBseShlZSwgWydzdWNjZXNzJ10uY29uY2F0KGFyZ3MpKSB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBmdW4uYXBwbHkob2JqLCBhcmdzKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWU7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pKG9ialt0YXJnZXRdKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG59O1xuXG4iLCJ2YXIgbWFwID0ge1xuXHRcIi4vZG90LW1hdHJpeFwiOiBcIi4vbm9kZV9tb2R1bGVzL3Zvd3MvbGliL3Zvd3MvcmVwb3J0ZXJzL2RvdC1tYXRyaXguanNcIixcblx0XCIuL2RvdC1tYXRyaXguanNcIjogXCIuL25vZGVfbW9kdWxlcy92b3dzL2xpYi92b3dzL3JlcG9ydGVycy9kb3QtbWF0cml4LmpzXCIsXG5cdFwiLi9qc29uXCI6IFwiLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy9yZXBvcnRlcnMvanNvbi5qc1wiLFxuXHRcIi4vanNvbi5qc1wiOiBcIi4vbm9kZV9tb2R1bGVzL3Zvd3MvbGliL3Zvd3MvcmVwb3J0ZXJzL2pzb24uanNcIixcblx0XCIuL3NpbGVudFwiOiBcIi4vbm9kZV9tb2R1bGVzL3Zvd3MvbGliL3Zvd3MvcmVwb3J0ZXJzL3NpbGVudC5qc1wiLFxuXHRcIi4vc2lsZW50LmpzXCI6IFwiLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy9yZXBvcnRlcnMvc2lsZW50LmpzXCIsXG5cdFwiLi9zcGVjXCI6IFwiLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy9yZXBvcnRlcnMvc3BlYy5qc1wiLFxuXHRcIi4vc3BlYy5qc1wiOiBcIi4vbm9kZV9tb2R1bGVzL3Zvd3MvbGliL3Zvd3MvcmVwb3J0ZXJzL3NwZWMuanNcIixcblx0XCIuL3RhcFwiOiBcIi4vbm9kZV9tb2R1bGVzL3Zvd3MvbGliL3Zvd3MvcmVwb3J0ZXJzL3RhcC5qc1wiLFxuXHRcIi4vdGFwLmpzXCI6IFwiLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy9yZXBvcnRlcnMvdGFwLmpzXCIsXG5cdFwiLi93YXRjaFwiOiBcIi4vbm9kZV9tb2R1bGVzL3Zvd3MvbGliL3Zvd3MvcmVwb3J0ZXJzL3dhdGNoLmpzXCIsXG5cdFwiLi93YXRjaC5qc1wiOiBcIi4vbm9kZV9tb2R1bGVzL3Zvd3MvbGliL3Zvd3MvcmVwb3J0ZXJzL3dhdGNoLmpzXCIsXG5cdFwiLi94dW5pdFwiOiBcIi4vbm9kZV9tb2R1bGVzL3Zvd3MvbGliL3Zvd3MvcmVwb3J0ZXJzL3h1bml0LmpzXCIsXG5cdFwiLi94dW5pdC5qc1wiOiBcIi4vbm9kZV9tb2R1bGVzL3Zvd3MvbGliL3Zvd3MvcmVwb3J0ZXJzL3h1bml0LmpzXCJcbn07XG5cblxuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHZhciBpZCA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpO1xuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhpZCk7XG59XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8obWFwLCByZXEpKSB7XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdHJldHVybiBtYXBbcmVxXTtcbn1cbndlYnBhY2tDb250ZXh0LmtleXMgPSBmdW5jdGlvbiB3ZWJwYWNrQ29udGV4dEtleXMoKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufTtcbndlYnBhY2tDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmU7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tDb250ZXh0O1xud2VicGFja0NvbnRleHQuaWQgPSBcIi4vbm9kZV9tb2R1bGVzL3Zvd3MvbGliL3Zvd3MvcmVwb3J0ZXJzIHN5bmMgcmVjdXJzaXZlIF5cXFxcLlxcXFwvLiokXCI7IiwidmFyIG9wdGlvbnMgPSB7IHRhaWw6ICcnIH0sXG4gICAgY29uc29sZSA9IHJlcXVpcmUoJy4uLy4uL3Zvd3MvY29uc29sZScpLFxuICAgIHN0eWxpemUgPSBjb25zb2xlLnN0eWxpemUsXG4gICAgcHV0cyA9IGNvbnNvbGUucHV0cyhvcHRpb25zKTtcbi8vXG4vLyBDb25zb2xlIHJlcG9ydGVyXG4vL1xudmFyIG1lc3NhZ2VzID0gW10sIGxhc3RDb250ZXh0O1xuXG50aGlzLm5hbWUgPSAnZG90LW1hdHJpeCc7XG50aGlzLnNldFN0cmVhbSA9IGZ1bmN0aW9uIChzKSB7XG4gICAgb3B0aW9ucy5zdHJlYW0gPSBzO1xufTtcblxudGhpcy5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICBtZXNzYWdlcyA9IFtdO1xuICAgIGxhc3RDb250ZXh0ID0gbnVsbDtcbn07XG50aGlzLnJlcG9ydCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIGV2ZW50ID0gZGF0YVsxXTtcblxuICAgIHN3aXRjaCAoZGF0YVswXSkge1xuICAgICAgICBjYXNlICdzdWJqZWN0JzpcbiAgICAgICAgICAgIC8vIG1lc3NhZ2VzLnB1c2goc3R5bGl6ZShldmVudCwgJ3VuZGVybGluZScpICsgJ1xcbicpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2NvbnRleHQnOlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3Zvdyc6XG4gICAgICAgICAgICBpZiAoZXZlbnQuc3RhdHVzID09PSAnaG9ub3JlZCcpIHtcbiAgICAgICAgICAgICAgICBwdXRzKHN0eWxpemUoJ8K3JywgJ2dyZWVuJykpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5zdGF0dXMgPT09ICdwZW5kaW5nJykge1xuICAgICAgICAgICAgICAgIHB1dHMoc3R5bGl6ZSgnLScsICdjeWFuJykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAobGFzdENvbnRleHQgIT09IGV2ZW50LmNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdENvbnRleHQgPSBldmVudC5jb250ZXh0O1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoKCcgICcgKyBldmVudC5jb250ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnN0YXR1cyA9PT0gJ2Jyb2tlbicpIHtcbiAgICAgICAgICAgICAgICAgICAgcHV0cyhzdHlsaXplKCfinJcnLCAneWVsbG93JykpO1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoKGNvbnNvbGUudm93VGV4dChldmVudCkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuc3RhdHVzID09PSAnZXJyb3JlZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcHV0cyhzdHlsaXplKCfinJcnLCAncmVkJykpO1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoKGNvbnNvbGUudm93VGV4dChldmVudCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoKCcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdlbmQnOlxuICAgICAgICAgICAgcHV0cygnICcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2ZpbmlzaCc6XG4gICAgICAgICAgICBpZiAobWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcHV0cygnXFxuXFxuJyArIG1lc3NhZ2VzLmpvaW4oJ1xcbicpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHV0cygnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwdXRzKGNvbnNvbGUucmVzdWx0KGV2ZW50KS5qb2luKCdcXG4nKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZXJyb3InOlxuICAgICAgICAgICAgcHV0cyhjb25zb2xlLmVycm9yKGV2ZW50KSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59O1xuXG50aGlzLnByaW50ID0gZnVuY3Rpb24gKHN0cikge1xuICAgIHB1dHMoc3RyKTtcbn07XG4iLCJ2YXIgb3B0aW9ucyA9IHsgdGFpbDogJ1xcbicsIHJhdzogdHJ1ZSB9O1xudmFyIGNvbnNvbGUgPSByZXF1aXJlKCcuLi8uLi92b3dzL2NvbnNvbGUnKTtcbnZhciBwdXRzID0gY29uc29sZS5wdXRzKG9wdGlvbnMpO1xuXG4vL1xuLy8gQ29uc29sZSBKU09OIHJlcG9ydGVyXG4vL1xudGhpcy5uYW1lID0gJ2pzb24nO1xudGhpcy5zZXRTdHJlYW0gPSBmdW5jdGlvbiAocykge1xuICAgIG9wdGlvbnMuc3RyZWFtID0gcztcbn07XG5cbmZ1bmN0aW9uIHJlbW92ZUNpcmN1bGFyU3VpdGUob2JqLCBzdWl0ZSkge1xuICAgIHZhciByZXN1bHQgPSB7fTtcblxuICAgIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyB8fCBvYmogPT09IG51bGwpIHJldHVybiBvYmo7XG5cbiAgICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGlmIChvYmpba2V5XSA9PT0gc3VpdGUpIHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0ge307XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHRba2V5XSA9IHJlbW92ZUNpcmN1bGFyU3VpdGUob2JqW2tleV0sIHN1aXRlIHx8IG9iai5zdWl0ZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG50aGlzLnJlcG9ydCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICBwdXRzKEpTT04uc3RyaW5naWZ5KHJlbW92ZUNpcmN1bGFyU3VpdGUob2JqKSkpO1xufTtcblxudGhpcy5wcmludCA9IGZ1bmN0aW9uIChzdHIpIHt9O1xuIiwiLy9cbi8vIFNpbGVudCByZXBvcnRlciAtIFwiU2hoaFwiXG4vL1xudGhpcy5uYW1lICAgICAgPSAnc2lsZW50JztcbnRoaXMuc2V0U3RyZWFtID0gZnVuY3Rpb24gKCkge307XG50aGlzLnJlc2V0ICAgICA9IGZ1bmN0aW9uICgpIHt9O1xudGhpcy5yZXBvcnQgICAgPSBmdW5jdGlvbiAoKSB7fTtcbnRoaXMucHJpbnQgICAgID0gZnVuY3Rpb24gKCkge307XG5cbiIsInZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuXG52YXIgb3B0aW9ucyA9IHsgdGFpbDogJ1xcbicgfTtcbnZhciBjb25zb2xlID0gcmVxdWlyZSgnLi4vLi4vdm93cy9jb25zb2xlJyk7XG52YXIgc3R5bGl6ZSA9IGNvbnNvbGUuc3R5bGl6ZSxcbiAgICBwdXRzID0gY29uc29sZS5wdXRzKG9wdGlvbnMpO1xuLy9cbi8vIENvbnNvbGUgcmVwb3J0ZXJcbi8vXG5cbnRoaXMubmFtZSA9ICdzcGVjJztcbnRoaXMuc2V0U3RyZWFtID0gZnVuY3Rpb24gKHMpIHtcbiAgICBvcHRpb25zLnN0cmVhbSA9IHM7XG59O1xudGhpcy5yZXBvcnQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBldmVudCA9IGRhdGFbMV07XG5cbiAgICBzd2l0Y2ggKGRhdGFbMF0pIHtcbiAgICAgICAgY2FzZSAnc3ViamVjdCc6XG4gICAgICAgICAgICBwdXRzKCdcXG7imaIgJyArIHN0eWxpemUoZXZlbnQsICdib2xkJykgKyAnXFxuJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnY29udGV4dCc6XG4gICAgICAgICAgICBwdXRzKGNvbnNvbGUuY29udGV4dFRleHQoZXZlbnQpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd2b3cnOlxuICAgICAgICAgICAgcHV0cyhjb25zb2xlLnZvd1RleHQoZXZlbnQpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdlbmQnOlxuICAgICAgICAgICAgdGhpcy5wcmludCgnXFxuJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZmluaXNoJzpcbiAgICAgICAgICAgIHB1dHMoY29uc29sZS5yZXN1bHQoZXZlbnQpLmpvaW4oJ1xcbicpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdlcnJvcic6XG4gICAgICAgICAgICBwdXRzKGNvbnNvbGUuZXJyb3IoZXZlbnQpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn07XG5cbnRoaXMucHJpbnQgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoc3RyKTtcbn07XG4iLCJ2YXIgb3B0aW9ucyA9IHtcbiAgdGFpbDogXCJcXG5cIlxufTtcbnZhciBjb25zb2xlID0gcmVxdWlyZShcIi4uL2NvbnNvbGVcIik7XG52YXIgc3R5bGl6ZSA9IGNvbnNvbGUuc3R5bGl6ZTtcbnZhciBwdXRzICAgID0gY29uc29sZS5wdXRzKG9wdGlvbnMpO1xuXG4vL1xuLy8gVEFQIFJlcG9ydGVyXG4vL1xuXG50aGlzLm5hbWUgPSBcInRhcFwiO1xudGhpcy5zZXRTdHJlYW0gPSBmdW5jdGlvbiBzZXRTdHJlYW0ocykge1xuICBvcHRpb25zLnN0cmVhbSA9IHM7XG59O1xuXG52YXIgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfTtcbnZhciBUYXBJbnRlcmZhY2UgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFRhcEludGVyZmFjZSgpIHtcbiAgICB0aGlzLmdlbk91dHB1dF8gPSBfX2JpbmQodGhpcy5nZW5PdXRwdXRfLCB0aGlzKTtcbiAgICB0aGlzLnRlc3RDb3VudCA9IF9fYmluZCh0aGlzLnRlc3RDb3VudCwgdGhpcyk7XG4gICAgdGhpcy5iYWlsT3V0ID0gX19iaW5kKHRoaXMuYmFpbE91dCwgdGhpcyk7XG4gICAgdGhpcy5za2lwID0gX19iaW5kKHRoaXMuc2tpcCwgdGhpcyk7XG4gICAgdGhpcy5ub3RPayA9IF9fYmluZCh0aGlzLm5vdE9rLCB0aGlzKTtcbiAgICB0aGlzLm9rID0gX19iaW5kKHRoaXMub2ssIHRoaXMpO1xuICAgIHRoaXMuY291bnRfID0gMDtcbiAgfVxuXG4gIFRhcEludGVyZmFjZS5wcm90b3R5cGUub2sgPSBmdW5jdGlvbihkZXNjcmlwdGlvbikge1xuICAgIHJldHVybiB0aGlzLmdlbk91dHB1dF8oXCJva1wiLCArK3RoaXMuY291bnRfLCBcIi0gXCIgKyBkZXNjcmlwdGlvbik7XG4gIH07XG5cbiAgVGFwSW50ZXJmYWNlLnByb3RvdHlwZS5ub3RPayA9IGZ1bmN0aW9uKGRlc2NyaXB0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2VuT3V0cHV0XyhcIm5vdCBva1wiLCArK3RoaXMuY291bnRfLCBcIi0gXCIgKyBkZXNjcmlwdGlvbik7XG4gIH07XG5cbiAgVGFwSW50ZXJmYWNlLnByb3RvdHlwZS5za2lwID0gZnVuY3Rpb24oZGVzY3JpcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5nZW5PdXRwdXRfKFwib2tcIiwgKyt0aGlzLmNvdW50XywgXCIjIFNLSVAgXCIgKyBkZXNjcmlwdGlvbik7XG4gIH07XG5cbiAgVGFwSW50ZXJmYWNlLnByb3RvdHlwZS5iYWlsT3V0ID0gZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgcmV0dXJuIFwiQmFpbCBvdXQhXCIgKyAocmVhc29uICE9PSBudWxsID8gXCIgXCIgKyByZWFzb24gOiBcIlwiKTtcbiAgfTtcblxuICBUYXBJbnRlcmZhY2UucHJvdG90eXBlLnRlc3RDb3VudCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIjEuLlwiICsgdGhpcy5jb3VudF87XG4gIH07XG5cbiAgVGFwSW50ZXJmYWNlLnByb3RvdHlwZS5nZW5PdXRwdXRfID0gZnVuY3Rpb24oc3RhdHVzLCB0ZXN0TnVtYmVyLCBkZXNjcmlwdGlvbikge1xuICAgIHJldHVybiBcIlwiICsgc3RhdHVzICsgXCIgXCIgKyB0ZXN0TnVtYmVyICsgXCIgXCIgKyBkZXNjcmlwdGlvbjtcbiAgfTtcblxuICByZXR1cm4gVGFwSW50ZXJmYWNlO1xufSkoKTtcblxudmFyIHRhcCA9IG5ldyBUYXBJbnRlcmZhY2UoKTtcblxudGhpcy5yZXBvcnQgPSBmdW5jdGlvbiByZXBvcnQoZGF0YSkge1xuICB2YXIgdHlwZSAgPSBkYXRhWzBdO1xuICB2YXIgZXZlbnQgPSBkYXRhWzFdO1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIFwic3ViamVjdFwiOlxuICAgICAgcHV0cyhcIiMgXCIgKyBzdHlsaXplKGV2ZW50LCBcImJvbGRcIikpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImNvbnRleHRcIjpcbiAgICAgIHB1dHMoXCIjIFwiICsgZXZlbnQpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInZvd1wiOlxuICAgICAgc3dpdGNoIChldmVudC5zdGF0dXMpIHtcbiAgICAgICAgY2FzZSBcImhvbm9yZWRcIjpcbiAgICAgICAgICBwdXRzKHRhcC5vayhldmVudC50aXRsZSkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicGVuZGluZ1wiOlxuICAgICAgICAgIHB1dHModGFwLnNraXAoZXZlbnQudGl0bGUpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJyb2tlblwiOlxuICAgICAgICAgIHB1dHModGFwLm5vdE9rKGV2ZW50LnRpdGxlICsgXCJcXG4jIFwiICsgZXZlbnQuZXhjZXB0aW9uKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJlcnJvcmVkXCI6XG4gICAgICAgICAgcHV0cyh0YXAubm90T2soZXZlbnQudGl0bGUpKTtcbiAgICAgICAgICBwdXRzKHRhcC5iYWlsT3V0KGV2ZW50LmV4Y2VwdGlvbikpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImVuZFwiOlxuICAgICAgcHV0cyhcIlxcblwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJmaW5pc2hcIjpcbiAgICAgIHB1dHModGFwLnRlc3RDb3VudCgpKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJlcnJvclwiOlxuICAgICAgcHV0cyhcIiM+IEVycm9yZWRcIik7XG4gICAgICBwdXRzKFwiIyBcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgIGJyZWFrO1xuICB9XG59O1xuXG50aGlzLnByaW50ID0gZnVuY3Rpb24gcHJpbnQoc3RyKSB7XG4gIHJlcXVpcmUoXCJ1dGlsXCIpLnByaW50KHN0cik7XG59O1xuIiwidmFyIG9wdGlvbnMgPSB7fTtcbnZhciBjb25zb2xlID0gcmVxdWlyZSgnLi4vLi4vdm93cy9jb25zb2xlJyk7XG52YXIgc3BlYyA9IHJlcXVpcmUoJy4uLy4uL3Zvd3MvcmVwb3J0ZXJzL3NwZWMnKTtcbnZhciBzdHlsaXplID0gY29uc29sZS5zdHlsaXplLFxuICAgIHB1dHMgPSBjb25zb2xlLnB1dHMob3B0aW9ucyk7XG4vL1xuLy8gQ29uc29sZSByZXBvcnRlclxuLy9cbnZhciBsYXN0Q29udGV4dDtcblxudGhpcy5uYW1lID0gJ3dhdGNoJztcbnRoaXMuc2V0U3RyZWFtID0gZnVuY3Rpb24gKHMpIHtcbiAgICBvcHRpb25zLnN0cmVhbSA9IHM7XG59O1xudGhpcy5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICBsYXN0Q29udGV4dCA9IG51bGw7XG59O1xudGhpcy5yZXBvcnQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBldmVudCA9IGRhdGFbMV07XG5cbiAgICBzd2l0Y2ggKGRhdGFbMF0pIHtcbiAgICAgICAgY2FzZSAndm93JzpcbiAgICAgICAgICAgIGlmIChbJ2hvbm9yZWQnLCAncGVuZGluZyddLmluZGV4T2YoZXZlbnQuc3RhdHVzKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBpZiAobGFzdENvbnRleHQgIT09IGV2ZW50LmNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdENvbnRleHQgPSBldmVudC5jb250ZXh0O1xuICAgICAgICAgICAgICAgICAgICBwdXRzKGNvbnNvbGUuY29udGV4dFRleHQoZXZlbnQuY29udGV4dCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwdXRzKGNvbnNvbGUudm93VGV4dChldmVudCkpO1xuICAgICAgICAgICAgICAgIHB1dHMoJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgICAgICAgIHB1dHMoY29uc29sZS5lcnJvcihldmVudCkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufTtcbnRoaXMucHJpbnQgPSBmdW5jdGlvbiAoc3RyKSB7fTtcbiIsIi8vIHh1bml0IG91dG9wdXQgZm9yIHZvd3MsIHNvIHdlIGNhbiBydW4gdGhpbmdzIHVuZGVyIGh1ZHNvblxuLy9cbi8vIFRoZSB0cmFuc2xhdGlvbiB0byB4dW5pdCBpcyBzaW1wbGUuICBNb3N0IGxpa2VseSBtb3JlIHRhZ3MvYXR0cmlidXRlcyBjYW4gYmVcbi8vIGFkZGVkLCBzZWU6IGh0dHA6Ly9hbnQuMTA0NTY4MC5uNS5uYWJibGUuY29tL3NjaGVtYS1mb3ItanVuaXQteG1sLW91dHB1dC10ZDEzNzUyNzQuaHRtbFxuLy9cblxudmFyIG9wdGlvbnMgPSB7IHRhaWw6ICdcXG4nLCByYXc6IHRydWUgfTtcbnZhciBjb25zb2xlID0gcmVxdWlyZSgnLi4vLi4vdm93cy9jb25zb2xlJyk7XG52YXIgcHV0cyA9IGNvbnNvbGUucHV0cyhvcHRpb25zKTtcblxudmFyIGJ1ZmZlciAgICAgICA9IFtdLFxuICAgIGN1clN1YmplY3QgICA9IG51bGw7XG5cbmZ1bmN0aW9uIHhtbEVuYyh2YWx1ZSkge1xuICAgIHJldHVybiAhdmFsdWUgPyB2YWx1ZSA6IFN0cmluZyh2YWx1ZSkucmVwbGFjZSgvJi9nLCBcIiZhbXA7XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8+L2csIFwiJmd0O1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvPC9nLCBcIiZsdDtcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1wiL2csIFwiJnF1b3Q7XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkezEsMn1tL2csICcnKTtcbn1cblxuZnVuY3Rpb24gdGFnKG5hbWUsIGF0dHJpYnMsIHNpbmdsZSwgY29udGVudCkge1xuICAgIHZhciBzdHJBdHRyID0gW10sIHQsIGVuZCA9ICc+JztcbiAgICBmb3IgKHZhciBhdHRyIGluIGF0dHJpYnMpIHtcbiAgICAgICAgaWYgKGF0dHJpYnMuaGFzT3duUHJvcGVydHkoYXR0cikpIHtcbiAgICAgICAgICAgIHN0ckF0dHIucHVzaChhdHRyICsgJz1cIicgKyB4bWxFbmMoYXR0cmlic1thdHRyXSkgKyAnXCInKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoc2luZ2xlKSB7XG4gICAgICAgIGVuZCA9ICcgLz4nO1xuICAgIH1cbiAgICBpZiAoc3RyQXR0ci5sZW5ndGgpIHtcbiAgICAgICAgdCA9ICc8JyArIG5hbWUgKyAnICcgKyBzdHJBdHRyLmpvaW4oJyAnKSArIGVuZDtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0ID0gJzwnICsgbmFtZSArIGVuZDtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBjb250ZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gdCArIGNvbnRlbnQgKyAnPC8nICsgbmFtZSArIGVuZDtcbiAgICB9XG4gICAgcmV0dXJuIHQ7XG59XG5cbmZ1bmN0aW9uIGVuZChuYW1lKSB7XG4gICAgcmV0dXJuICc8LycgKyBuYW1lICsgJz4nO1xufVxuXG5mdW5jdGlvbiBjZGF0YShkYXRhKSB7XG4gICAgcmV0dXJuICc8IVtDREFUQVsnICsgeG1sRW5jKGRhdGEpICsgJ11dPic7XG59XG5cbnRoaXMubmFtZSA9ICd4dW5pdCc7XG50aGlzLnNldFN0cmVhbSA9IGZ1bmN0aW9uIChzKSB7XG4gIG9wdGlvbnMuc3RyZWFtID0gcztcbn07XG50aGlzLnJlcG9ydCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIGV2ZW50ID0gZGF0YVsxXTtcblxuICAgIHN3aXRjaCAoZGF0YVswXSkge1xuICAgIGNhc2UgJ3N1YmplY3QnOlxuICAgICAgICBjdXJTdWJqZWN0ID0gZXZlbnQ7XG4gICAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2NvbnRleHQnOlxuICAgICAgICBicmVhaztcbiAgICBjYXNlICd2b3cnOlxuICAgICAgICBzd2l0Y2ggKGV2ZW50LnN0YXR1cykge1xuICAgICAgICBjYXNlICdob25vcmVkJzpcbiAgICAgICAgICAgIGJ1ZmZlci5wdXNoKHRhZygndGVzdGNhc2UnLCB7Y2xhc3NuYW1lOiBjdXJTdWJqZWN0LCBuYW1lOiBldmVudC5jb250ZXh0ICsgJzogJyArIGV2ZW50LnRpdGxlfSwgdHJ1ZSkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Jyb2tlbic6XG4gICAgICAgICAgICB2YXIgZXJyID0gdGFnKCdlcnJvcicsIHt0eXBlOiAndm93cy5ldmVudC5icm9rZW4nLCBtZXNzYWdlOiAnQnJva2VuIHRlc3QnfSwgZmFsc2UsIGNkYXRhKGV2ZW50LmV4Y2VwdGlvbikpO1xuICAgICAgICAgICAgYnVmZmVyLnB1c2godGFnKCd0ZXN0Y2FzZScsIHtjbGFzc25hbWU6IGN1clN1YmplY3QsIG5hbWU6IGV2ZW50LmNvbnRleHQgKyAnOiAnICsgZXZlbnQudGl0bGV9LCBmYWxzZSwgZXJyKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZXJyb3JlZCc6XG4gICAgICAgICAgICB2YXIgc2tpcCA9IHRhZygnc2tpcHBlZCcsIHt0eXBlOiAndm93cy5ldmVudC5lcnJvcmVkJywgbWVzc2FnZTogJ0Vycm9yZWQgdGVzdCd9LCBmYWxzZSwgY2RhdGEoZXZlbnQuZXhjZXB0aW9uKSk7XG4gICAgICAgICAgICBidWZmZXIucHVzaCh0YWcoJ3Rlc3RjYXNlJywge2NsYXNzbmFtZTogY3VyU3ViamVjdCwgbmFtZTogZXZlbnQuY29udGV4dCArICc6ICcgKyBldmVudC50aXRsZX0sIGZhbHNlLCBza2lwKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncGVuZGluZyc6XG4gICAgICAgICAgICAvLyBub3BcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2VuZCc6XG4gICAgICAgIGJ1ZmZlci5wdXNoKGVuZCgndGVzdGNhc2UnKSk7XG4gICAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2ZpbmlzaCc6XG4gICAgICAgIGJ1ZmZlci51bnNoaWZ0KHRhZygndGVzdHN1aXRlJywge25hbWU6ICdWb3dzIHRlc3QnLCB0ZXN0czogZXZlbnQudG90YWwsIHRpbWVzdGFtcDogKG5ldyBEYXRlKCkpLnRvVVRDU3RyaW5nKCksIGVycm9yczogZXZlbnQuZXJyb3JlZCwgZmFpbHVyZXM6IGV2ZW50LmJyb2tlbiwgc2tpcDogZXZlbnQucGVuZGluZywgdGltZTogZXZlbnQudGltZX0pKTtcbiAgICAgICAgYnVmZmVyLnB1c2goZW5kKCd0ZXN0c3VpdGUnKSk7XG4gICAgICAgIHB1dHMoYnVmZmVyLmpvaW4oJ1xcbicpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgY2FzZSAnZXJyb3InOlxuICAgICAgICBicmVhaztcbiAgICB9XG59O1xuXG50aGlzLnByaW50ID0gZnVuY3Rpb24gKHN0cikgeyB9O1xuIiwidmFyIGV2ZW50cyA9IHJlcXVpcmUoJ2V2ZW50cycpLFxuICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbnZhciB2b3dzID0gcmVxdWlyZSgnLi4vdm93cycpO1xudmFyIENvbnRleHQgPSByZXF1aXJlKCcuLi92b3dzL2NvbnRleHQnKS5Db250ZXh0O1xuXG50aGlzLlN1aXRlID0gZnVuY3Rpb24gKHN1YmplY3QpIHtcbiAgICB0aGlzLnN1YmplY3QgPSBzdWJqZWN0O1xuICAgIHRoaXMubWF0Y2hlciA9IC8uKi87XG4gICAgdGhpcy5yZXBvcnRlciA9IHJlcXVpcmUoJy4vcmVwb3J0ZXJzL2RvdC1tYXRyaXgnKTtcbiAgICB0aGlzLmJhdGNoZXMgPSBbXTtcbiAgICB0aGlzLm9wdGlvbnMgPSB7IGVycm9yOiB0cnVlIH07XG4gICAgdGhpcy5yZXNldCgpO1xufTtcblxudGhpcy5TdWl0ZS5wcm90b3R5cGUgPSBuZXcoZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucmVzdWx0cyA9IHtcbiAgICAgICAgICAgIGhvbm9yZWQ6IDAsXG4gICAgICAgICAgICBicm9rZW46ICAwLFxuICAgICAgICAgICAgZXJyb3JlZDogMCxcbiAgICAgICAgICAgIHBlbmRpbmc6IDAsXG4gICAgICAgICAgICB0b3RhbDogICAwLFxuICAgICAgICAgICAgdGltZTogIG51bGxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5iYXRjaGVzLmZvckVhY2goZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgICAgIGIubGFzdENvbnRleHQgPSBudWxsO1xuICAgICAgICAgICAgYi5yZW1haW5pbmcgPSBiLl9yZW1haW5pbmc7XG4gICAgICAgICAgICBiLmhvbm9yZWQgPSBiLmJyb2tlbiA9IGIuZXJyb3JlZCA9IGIudG90YWwgPSBiLnBlbmRpbmcgPSAwO1xuICAgICAgICAgICAgYi52b3dzLmZvckVhY2goZnVuY3Rpb24gKHZvdykgeyB2b3cuc3RhdHVzID0gbnVsbCB9KTtcbiAgICAgICAgICAgIGIudGVhcmRvd25zID0gW107XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICB0aGlzLmFkZEJhdGNoID0gZnVuY3Rpb24gKHRlc3RzKSB7XG4gICAgICAgIHRoaXMuYmF0Y2hlcy5wdXNoKHtcbiAgICAgICAgICAgIHRlc3RzOiB0ZXN0cyxcbiAgICAgICAgICAgIHN1aXRlOiAgdGhpcyxcbiAgICAgICAgICAgIHZvd3M6ICAgICBbXSxcbiAgICAgICAgICAgIHJlbWFpbmluZzogMCxcbiAgICAgICAgICAgX3JlbWFpbmluZzogMCxcbiAgICAgICAgICAgIGhvbm9yZWQ6ICAgMCxcbiAgICAgICAgICAgIGJyb2tlbjogICAgMCxcbiAgICAgICAgICAgIGVycm9yZWQ6ICAgMCxcbiAgICAgICAgICAgIHBlbmRpbmc6ICAgMCxcbiAgICAgICAgICAgIHRvdGFsOiAgICAgMCxcbiAgICAgICAgICAgIHRlYXJkb3duczogW11cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgdGhpcy5hZGRWb3dzID0gdGhpcy5hZGRCYXRjaDtcblxuICAgIHRoaXMucGFyc2VCYXRjaCA9IGZ1bmN0aW9uIChiYXRjaCwgbWF0Y2hlcikge1xuICAgICAgICB2YXIgdGVzdHMgPSBiYXRjaC50ZXN0cztcblxuICAgICAgICBpZiAoJ3RvcGljJyBpbiB0ZXN0cykge1xuICAgICAgICAgICAgdGhyb3cgbmV3KEVycm9yKShcIm1pc3NpbmcgdG9wLWxldmVsIGNvbnRleHQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIENvdW50IHRoZSBudW1iZXIgb2Ygdm93cy9lbWl0dGVycyBleHBlY3RlZCB0byBmaXJlLFxuICAgICAgICAvLyBzbyB3ZSBrbm93IHdoZW4gdGhlIHRlc3RzIGFyZSBvdmVyLlxuICAgICAgICAvLyBXZSBtYXRjaCB0aGUga2V5cyBhZ2FpbnN0IGBtYXRjaGVyYCwgdG8gZGVjaWRlXG4gICAgICAgIC8vIHdoZXRoZXIgb3Igbm90IHRoZXkgc2hvdWxkIGJlIGluY2x1ZGVkIGluIHRoZSB0ZXN0LlxuICAgICAgICAvLyBBbnkga2V5LCBpbmNsdWRpbmcgYXNzZXJ0aW9uIGZ1bmN0aW9uIGtleXMgY2FuIGJlIG1hdGNoZWQuXG4gICAgICAgIC8vIElmIGEgY2hpbGQgbWF0Y2hlcywgdGhlbiB0aGUgbiBwYXJlbnQgdG9waWNzIG11c3Qgbm90IGJlIHNraXBwZWQuXG4gICAgICAgIChmdW5jdGlvbiBjb3VudCh0ZXN0cywgX21hdGNoKSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSBmYWxzZTtcblxuICAgICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh0ZXN0cykuZmlsdGVyKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGsgIT09ICd0b3BpYycgJiYgayAhPT0gJ3RlYXJkb3duJztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwga2V5OyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGtleSA9IGtleXNbaV07XG5cbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcGFyZW50IG5vZGUsIG9yIHRoaXMgb25lIG1hdGNoZXMuXG4gICAgICAgICAgICAgICAgbWF0Y2ggPSBfbWF0Y2ggfHwgbWF0Y2hlci50ZXN0KGtleSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mKHRlc3RzW2tleV0pID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IGNvdW50KHRlc3RzW2tleV0sIG1hdGNoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mKHRlc3RzW2tleV0pID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVzdHNba2V5XSA9IG5ldyhTdHJpbmcpKHRlc3RzW2tleV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghIG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXN0c1trZXldLl9za2lwID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgYW55IG9mIHRoZSBjaGlsZHJlbiBtYXRjaGVkLFxuICAgICAgICAgICAgLy8gZG9uJ3Qgc2tpcCB0aGlzIG5vZGUuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoISB0ZXN0c1trZXlzW2ldXS5fc2tpcCkgeyBtYXRjaCA9IHRydWUgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWF0Y2gpIHsgYmF0Y2gucmVtYWluaW5nICsrIH1cbiAgICAgICAgICAgIGVsc2UgICAgICAgeyB0ZXN0cy5fc2tpcCA9IHRydWUgfVxuXG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgIH0pKHRlc3RzLCBmYWxzZSk7XG5cbiAgICAgICAgYmF0Y2guX3JlbWFpbmluZyA9IGJhdGNoLnJlbWFpbmluZztcbiAgICB9O1xuXG4gICAgdGhpcy5ydW5CYXRjaCA9IGZ1bmN0aW9uIChiYXRjaCkge1xuICAgICAgICB2YXIgdG9waWMsXG4gICAgICAgICAgICB0ZXN0cyAgID0gYmF0Y2gudGVzdHMsXG4gICAgICAgICAgICBlbWl0dGVyID0gYmF0Y2guZW1pdHRlciA9IG5ldyhldmVudHMuRXZlbnRFbWl0dGVyKTtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgYmF0Y2guc3RhdHVzID0gJ2JlZ2luJztcblxuICAgICAgICAvLyBUaGUgdGVzdCBydW5uZXIsIGl0IGNhbGxzIGl0c2VsZiByZWN1cnNpdmVseSwgcGFzc2luZyB0aGVcbiAgICAgICAgLy8gcHJldmlvdXMgY29udGV4dCB0byB0aGUgaW5uZXIgY29udGV4dHMuIFRoaXMgaXMgc28gdGhlIGB0b3BpY2BcbiAgICAgICAgLy8gZnVuY3Rpb25zIGhhdmUgYWNjZXNzIHRvIGFsbCB0aGUgcHJldmlvdXMgY29udGV4dCB0b3BpY3MgaW4gdGhlaXJcbiAgICAgICAgLy8gYXJndW1lbnRzIGxpc3QuXG4gICAgICAgIC8vIEl0IGlzIGRlZmluZWQgYW5kIGludm9rZWQgYXQgdGhlIHNhbWUgdGltZS5cbiAgICAgICAgLy8gSWYgaXQgZW5jb3VudGVycyBhIGB0b3BpY2AgZnVuY3Rpb24sIGl0IHdhaXRzIGZvciB0aGUgcmV0dXJuZWRcbiAgICAgICAgLy8gZW1pdHRlciB0byBlbWl0ICh0aGUgdG9waWMpLCBhdCB3aGljaCBwb2ludCBpdCBydW5zIHRoZSBmdW5jdGlvbnMgdW5kZXIgaXQsXG4gICAgICAgIC8vIHBhc3NpbmcgdGhlIHRvcGljIGFzIGFuIGFyZ3VtZW50LlxuICAgICAgICAoZnVuY3Rpb24gcnVuKGN0eCwgbGFzdFRvcGljKSB7XG4gICAgICAgICAgICB2YXIgb2xkID0gZmFsc2U7XG4gICAgICAgICAgICB0b3BpYyA9IGN0eC50ZXN0cy50b3BpYztcblxuICAgICAgICAgICAgaWYgKHR5cGVvZih0b3BpYykgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3R4LmlzRXZlbnQgfHwgY3R4Lm5hbWUgPT09ICdvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFdmVudCBjb250ZXh0IGNhbm5vdCBjb250YWluIGEgdG9waWMnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBSdW4gdGhlIHRvcGljLCBwYXNzaW5nIHRoZSBwcmV2aW91cyBjb250ZXh0IHRvcGljc1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHRvcGljID0gdG9waWMuYXBwbHkoY3R4LmVudiwgY3R4LnRvcGljcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIElmIGFuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJzIGluIHRoZSB0b3BpYywgc2V0IHRoZSByZXR1cm5cbiAgICAgICAgICAgICAgICAvLyB2YWx1ZSB0byAndW5kZWZpbmVkJyBhbmQgY2FsbCBiYWNrIHdpdGggdGhlIGVycm9yXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5lbnYuY2FsbGJhY2soZXgpO1xuICAgICAgICAgICAgICAgICAgICB0b3BpYyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mKHRvcGljKSA9PT0gJ3VuZGVmaW5lZCcpIHsgY3R4Ll9jYWxsYmFjayA9IHRydWUgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiB0aGlzIGNvbnRleHQgaGFzIGEgdG9waWMsIHN0b3JlIGl0IGluIGBsYXN0VG9waWNgLFxuICAgICAgICAgICAgLy8gaWYgbm90LCB1c2UgdGhlIGxhc3QgdG9waWMsIHBhc3NlZCBkb3duIGJ5IGEgcGFyZW50XG4gICAgICAgICAgICAvLyBjb250ZXh0LlxuICAgICAgICAgICAgaWYgKHR5cGVvZih0b3BpYykgIT09ICd1bmRlZmluZWQnIHx8IGN0eC5fY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBsYXN0VG9waWMgPSB0b3BpYztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb2xkICAgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRvcGljID0gbGFzdFRvcGljO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiB0aGUgdG9waWMgZG9lc24ndCByZXR1cm4gYW4gZXZlbnQgZW1pdHRlciAoc3VjaCBhcyBhbiBFdmVudEVtaXR0ZXIpLFxuICAgICAgICAgICAgLy8gd2UgY3JlYXRlIGl0IG91cnNlbHZlcywgYW5kIGVtaXQgdGhlIHZhbHVlIG9uIHRoZSBuZXh0IHRpY2suXG4gICAgICAgICAgICBpZiAoISAodG9waWMgJiZcbiAgICAgICAgICAgICAgICAgICB0b3BpYy5jb25zdHJ1Y3RvciA9PT0gZXZlbnRzLkV2ZW50RW1pdHRlcikpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgY29udGV4dCBpcyBhIHRyYWRpdGlvbmFsIHZvdywgdGhlbiBhIHRvcGljIGNhbiBPTkxZXG4gICAgICAgICAgICAgICAgLy8gYmUgYW4gRXZlbnRFbWl0dGVyLiAgSG93ZXZlciBpZiB0aGUgY29udGV4dCBpcyBhIHN1Yi1ldmVudFxuICAgICAgICAgICAgICAgIC8vIHRoZW4gdGhlIHRvcGljIG1heSBiZSBhbiBpbnN0YW5jZW9mIEV2ZW50RW1pdHRlclxuICAgICAgICAgICAgICAgIGlmICghY3R4LmlzRXZlbnQgfHxcbiAgICAgICAgICAgICAgICAgICAoY3R4LmlzRXZlbnQgJiYgISh0b3BpYyBpbnN0YW5jZW9mIGV2ZW50cy5FdmVudEVtaXR0ZXIpKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgY3R4LmVtaXR0ZXIgPSBuZXcoZXZlbnRzLkV2ZW50RW1pdHRlcik7XG5cbiAgICAgICAgICAgICAgICAgICAgICBpZiAoISBjdHguX2NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmVtaXR0ZXIuZW1pdChcInN1Y2Nlc3NcIiwgdmFsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSh0b3BpYykpO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBJIGhhdmUgYSBjYWxsYmFjaywgcHVzaCB0aGUgbmV3IHRvcGljIGJhY2sgdXAgdG9cbiAgICAgICAgICAgICAgICAgICAgICAvLyBsYXN0VG9waWNcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoY3R4Ll9jYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VG9waWMgPSB0b3BpYyA9IGN0eC5lbWl0dGVyO1xuICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRvcGljID0gY3R4LmVtaXR0ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdG9waWMub24oY3R4LmV2ZW50LCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICAgICAgLy8gT25jZSB0aGUgdG9waWMgZmlyZXMsIGFkZCB0aGUgcmV0dXJuIHZhbHVlXG4gICAgICAgICAgICAgICAgLy8gdG8gdGhlIGJlZ2lubmluZyBvZiB0aGUgdG9waWNzIGxpc3QsIHNvIGl0XG4gICAgICAgICAgICAgICAgLy8gYmVjb21lcyB0aGUgZmlyc3QgYXJndW1lbnQgZm9yIHRoZSBuZXh0IHRvcGljLlxuICAgICAgICAgICAgICAgIC8vIElmIHdlJ3JlIHVzaW5nIHRoZSBwYXJlbnQgdG9waWMsIG5vIG5lZWQgdG9cbiAgICAgICAgICAgICAgICAvLyBwcmVwZW5kIGl0IHRvIHRoZSB0b3BpY3MgbGlzdCwgb3Igd2UnbGwgZ2V0XG4gICAgICAgICAgICAgICAgLy8gZHVwbGljYXRlcy5cbiAgICAgICAgICAgICAgICBpZiAoIW9sZCB8fCBjdHguaXNFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUudW5zaGlmdC5hcHBseShjdHgudG9waWNzLCBhcmd1bWVudHMpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHRvcGljLnNldE1heExpc3RlbmVycykgeyB0b3BpYy5zZXRNYXhMaXN0ZW5lcnMoSW5maW5pdHkpIH1cbiAgICAgICAgICAgIC8vIE5vdyBydW4gdGhlIHRlc3RzLCBvciBzdWItY29udGV4dHNcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGN0eC50ZXN0cykuZmlsdGVyKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC50ZXN0c1trXSAmJiBrICE9PSAndG9waWMnICAgICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrICE9PSAndGVhcmRvd24nICYmICFjdHgudGVzdHNba10uX3NraXA7XG4gICAgICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IGV2YWx1YXRpb24gY29udGV4dCxcbiAgICAgICAgICAgICAgICAvLyBpbmhlcml0aW5nIGZyb20gdGhlIHBhcmVudCBvbmUuXG4gICAgICAgICAgICAgICAgdmFyIGVudiA9IE9iamVjdC5jcmVhdGUoY3R4LmVudik7XG4gICAgICAgICAgICAgICAgZW52LnN1aXRlID0gdGhhdDtcblxuICAgICAgICAgICAgICAgIC8vIEhvbGRzIHRoZSBjdXJyZW50IHRlc3Qgb3IgY29udGV4dFxuICAgICAgICAgICAgICAgIHZhciB2b3cgPSBPYmplY3QuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGN0eC50ZXN0c1tpdGVtXSxcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dDogY3R4LnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogaXRlbSxcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZzogY3R4LmVudixcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBiYXRjaDogYmF0Y2hcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIElmIHdlIGVuY291bnRlciBhIGZ1bmN0aW9uLCBhZGQgaXQgdG8gdGhlIGNhbGxiYWNrc1xuICAgICAgICAgICAgICAgIC8vIG9mIHRoZSBgdG9waWNgIGZ1bmN0aW9uLCBzbyBpdCdsbCBnZXQgY2FsbGVkIG9uY2UgdGhlXG4gICAgICAgICAgICAgICAgLy8gdG9waWMgZmlyZXMuXG4gICAgICAgICAgICAgICAgLy8gSWYgd2UgZW5jb3VudGVyIGFuIG9iamVjdCBsaXRlcmFsLCB3ZSByZWN1cnNlLCBzZW5kaW5nIGl0XG4gICAgICAgICAgICAgICAgLy8gb3VyIGN1cnJlbnQgY29udGV4dC5cbiAgICAgICAgICAgICAgICBpZiAoKHR5cGVvZih2b3cuY2FsbGJhY2spID09PSAnZnVuY3Rpb24nKSB8fFxuICAgICAgICAgICAgICAgICAgICAodm93LmNhbGxiYWNrIGluc3RhbmNlb2YgU3RyaW5nKSkge1xuICAgICAgICAgICAgICAgICAgICB0b3BpYy5hZGRWb3codm93KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZih2b3cuY2FsbGJhY2spID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSdzIGEgc2V0dXAgc3RhZ2UsIHdlIGhhdmUgdG8gd2FpdCBmb3IgaXQgdG8gZmlyZSxcbiAgICAgICAgICAgICAgICAgICAgLy8gYmVmb3JlIGNhbGxpbmcgdGhlIGlubmVyIGNvbnRleHQuXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBldmVudCBoYXMgYWxyZWFkeSBmaXJlZCwgdGhlIGNvbnRleHQgaXMgJ29uJyBvclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGVyZSBpcyBubyBzZXR1cCBzdGFnZSwganVzdCBydW4gdGhlIGlubmVyIGNvbnRleHRcbiAgICAgICAgICAgICAgICAgICAgLy8gc3luY2hyb25vdXNseS5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvcGljICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubmFtZSAhPT0gJ29uJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKCF0b3BpYy5fdm93c0VtaXRlZEV2ZW50cyB8fCAhdG9waWMuX3Zvd3NFbWl0ZWRFdmVudHMuaGFzT3duUHJvcGVydHkoY3R4LmV2ZW50KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBydW5Jbm5lckNvbnRleHQgPSBmdW5jdGlvbihjdHgpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih2YWwpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnVuKG5ldyAoQ29udGV4dCkodm93LCBjdHgsIGVudiksIGxhc3RUb3BpYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0oY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcGljLm9uKGN0eC5ldmVudCwgcnVuSW5uZXJDb250ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJ1biBhbiBpbm5lciBjb250ZXh0IGlmIHRoZSBvdXRlciBjb250ZXh0IGZhaWxzLCB0b28uXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3BpYy5vbignZXJyb3InLCBydW5Jbm5lckNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcnVuKG5ldyAoQ29udGV4dCkodm93LCBjdHgsIGVudiksIGxhc3RUb3BpYyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIFRlYXJkb3duXG4gICAgICAgICAgICBpZiAoY3R4LnRlc3RzLnRlYXJkb3duKSB7XG4gICAgICAgICAgICAgICAgYmF0Y2gudGVhcmRvd25zLnB1c2goY3R4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghIGN0eC50ZXN0cy5fc2tpcCkge1xuICAgICAgICAgICAgICAgIGJhdGNoLnJlbWFpbmluZyAtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHdlJ3JlIGRvbmUgcnVubmluZyB0aGUgdGVzdHNcbiAgICAgICAgICAgIGV4cG9ydHMudHJ5RW5kKGJhdGNoKTtcbiAgICAgICAgLy8gVGhpcyBpcyBvdXIgaW5pdGlhbCwgZW1wdHkgY29udGV4dFxuICAgICAgICB9KShuZXcoQ29udGV4dCkoeyBjYWxsYmFjazogdGVzdHMsIGNvbnRleHQ6IG51bGwsIGRlc2NyaXB0aW9uOiBudWxsIH0sIHt9KSk7XG4gICAgICAgIHJldHVybiBlbWl0dGVyO1xuICAgIH07XG5cbiAgICB0aGlzLnJlcG9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwb3J0ZXIucmVwb3J0LmFwcGx5KHRoaXMucmVwb3J0ZXIsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIHRoaXMucnVuID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcywgc3RhcnQ7XG5cbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgICAgT2JqZWN0LmtleXMob3B0aW9ucykuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICAgICAgdGhhdC5vcHRpb25zW2tdID0gb3B0aW9uc1trXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5tYXRjaGVyID0gdGhpcy5vcHRpb25zLm1hdGNoZXIgIHx8IHRoaXMubWF0Y2hlcjtcblxuICAgICAgICBpZiAob3B0aW9ucy5yZXBvcnRlcikge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLnJlcG9ydGVyID0gdHlwZW9mIG9wdGlvbnMucmVwb3J0ZXIgPT09ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgPyByZXF1aXJlKCcuL3JlcG9ydGVycy8nICsgb3B0aW9ucy5yZXBvcnRlcilcbiAgICAgICAgICAgICAgICA6IG9wdGlvbnMucmVwb3J0ZXI7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlcG9ydGVyIHdhcyBub3QgZm91bmQsIGRlZmF1bHRpbmcgdG8gZG90LW1hdHJpeC4nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJhdGNoZXMuZm9yRWFjaChmdW5jdGlvbiAoYmF0Y2gpIHtcbiAgICAgICAgICAgIHRoYXQucGFyc2VCYXRjaChiYXRjaCwgdGhhdC5tYXRjaGVyKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5yZXNldCgpO1xuXG4gICAgICAgIHN0YXJ0ID0gbmV3KERhdGUpO1xuXG4gICAgICAgIGlmICh0aGlzLmJhdGNoZXMuZmlsdGVyKGZ1bmN0aW9uIChiKSB7IHJldHVybiBiLnJlbWFpbmluZyA+IDAgfSkubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnJlcG9ydChbJ3N1YmplY3QnLCB0aGlzLnN1YmplY3RdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoZnVuY3Rpb24gcnVuKGJhdGNoZXMpIHtcbiAgICAgICAgICAgIHZhciBiYXRjaCA9IGJhdGNoZXMuc2hpZnQoKTtcblxuICAgICAgICAgICAgaWYgKGJhdGNoKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIGJhdGNoIGhhcyBubyB2b3dzIHRvIHJ1bixcbiAgICAgICAgICAgICAgICAvLyBnbyB0byB0aGUgbmV4dCBvbmUuXG4gICAgICAgICAgICAgICAgaWYgKGJhdGNoLnJlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBydW4oYmF0Y2hlcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5ydW5CYXRjaChiYXRjaCkub24oJ2VuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bihiYXRjaGVzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGF0LnJlc3VsdHMudGltZSA9IChuZXcoRGF0ZSkgLSBzdGFydCkgLyAxMDAwO1xuICAgICAgICAgICAgICAgIHRoYXQucmVwb3J0KFsnZmluaXNoJywgdGhhdC5yZXN1bHRzXSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHsgY2FsbGJhY2sodGhhdC5yZXN1bHRzKSB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhhdC5yZXN1bHRzLmhvbm9yZWQgKyB0aGF0LnJlc3VsdHMucGVuZGluZyA9PT0gdGhhdC5yZXN1bHRzLnRvdGFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkodGhpcy5iYXRjaGVzLnNsaWNlKDApKTtcbiAgICB9O1xuXG4gICAgdGhpcy5ydW5QYXJhbGxlbCA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgdGhpcy5leHBvcnQgPSBmdW5jdGlvbiAobW9kdWxlLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICBPYmplY3Qua2V5cyhvcHRpb25zIHx8IHt9KS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgICB0aGF0Lm9wdGlvbnNba10gPSBvcHRpb25zW2tdO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocmVxdWlyZS5tYWluID09PSBtb2R1bGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJ1bigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG1vZHVsZS5leHBvcnRzW3RoaXMuc3ViamVjdF0gPSB0aGlzO1xuICAgICAgICB9XG4gICAgfTtcbiAgICB0aGlzLmV4cG9ydFRvID0gZnVuY3Rpb24gKG1vZHVsZSwgb3B0aW9ucykgeyAvLyBBbGlhcywgZm9yIEpTTGludFxuICAgICAgICByZXR1cm4gdGhpcy5leHBvcnQobW9kdWxlLCBvcHRpb25zKTtcbiAgICB9O1xufSk7XG5cbi8vXG4vLyBDaGVja3MgaWYgYWxsIHRoZSB0ZXN0cyBpbiB0aGUgYmF0Y2ggaGF2ZSBiZWVuIHJ1bixcbi8vIGFuZCB0cmlnZ2VycyB0aGUgbmV4dCBiYXRjaCAoaWYgYW55KSwgYnkgZW1pdHRpbmcgdGhlICdlbmQnIGV2ZW50LlxuLy9cbnRoaXMudHJ5RW5kID0gZnVuY3Rpb24gKGJhdGNoKSB7XG4gICAgdmFyIHJlc3VsdCwgc3R5bGUsIHRpbWU7XG5cbiAgICBpZiAoYmF0Y2guaG9ub3JlZCArIGJhdGNoLmJyb2tlbiArIGJhdGNoLmVycm9yZWQgKyBiYXRjaC5wZW5kaW5nID09PSBiYXRjaC50b3RhbCAmJlxuICAgICAgICBiYXRjaC5yZW1haW5pbmcgPT09IDApIHtcblxuICAgICAgICBPYmplY3Qua2V5cyhiYXRjaCkuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICAgICAgKGsgaW4gYmF0Y2guc3VpdGUucmVzdWx0cykgJiYgKGJhdGNoLnN1aXRlLnJlc3VsdHNba10gKz0gYmF0Y2hba10pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoYmF0Y2gudGVhcmRvd25zKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gYmF0Y2gudGVhcmRvd25zLmxlbmd0aCAtIDEsIGN0eDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBydW5UZWFyZG93bihiYXRjaC50ZWFyZG93bnNbaV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXliZUZpbmlzaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcnVuVGVhcmRvd24odGVhcmRvd24pIHtcbiAgICAgICAgICAgIHZhciBlbnYgPSBPYmplY3QuY3JlYXRlKHRlYXJkb3duLmVudik7XG5cbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbnYsIFwiY2FsbGJhY2tcIiwge1xuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0ZWFyZG93bi5hd2FpdGluZ0NhbGxiYWNrID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVhcmRvd24uYXdhaXRpbmdDYWxsYmFjayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF5YmVGaW5pc2goKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGVhcmRvd24udGVzdHMudGVhcmRvd24uYXBwbHkoZW52LCB0ZWFyZG93bi50b3BpY3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbWF5YmVGaW5pc2goKSB7XG4gICAgICAgICAgICB2YXIgcGVuZGluZyA9IGJhdGNoLnRlYXJkb3ducy5maWx0ZXIoZnVuY3Rpb24gKHRlYXJkb3duKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRlYXJkb3duLmF3YWl0aW5nQ2FsbGJhY2s7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHBlbmRpbmcubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZmluaXNoKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmaW5pc2goKSB7XG4gICAgICAgICAgICBiYXRjaC5zdGF0dXMgPSAnZW5kJztcbiAgICAgICAgICAgIGJhdGNoLnN1aXRlLnJlcG9ydChbJ2VuZCddKTtcbiAgICAgICAgICAgIGJhdGNoLmVtaXR0ZXIuZW1pdCgnZW5kJywgYmF0Y2guaG9ub3JlZCwgYmF0Y2guYnJva2VuLCBiYXRjaC5lcnJvcmVkLCBiYXRjaC5wZW5kaW5nKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCIvKiFcblxuIGRpZmYgdjQuMC4xXG5cblNvZnR3YXJlIExpY2Vuc2UgQWdyZWVtZW50IChCU0QgTGljZW5zZSlcblxuQ29weXJpZ2h0IChjKSAyMDA5LTIwMTUsIEtldmluIERlY2tlciA8a3BkZWNrZXJAZ21haWwuY29tPlxuXG5BbGwgcmlnaHRzIHJlc2VydmVkLlxuXG5SZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIG9mIHRoaXMgc29mdHdhcmUgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dCBtb2RpZmljYXRpb24sXG5hcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG5cbiogUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZVxuICBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlXG4gIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuXG4qIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmVcbiAgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZVxuICBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXJcbiAgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cblxuKiBOZWl0aGVyIHRoZSBuYW1lIG9mIEtldmluIERlY2tlciBub3IgdGhlIG5hbWVzIG9mIGl0c1xuICBjb250cmlidXRvcnMgbWF5IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzXG4gIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3JcbiAgd3JpdHRlbiBwZXJtaXNzaW9uLlxuXG5USElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIiBBTkQgQU5ZIEVYUFJFU1MgT1JcbklNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgT1dORVIgT1JcbkNPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUxcbkRBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSxcbkRBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSXG5JTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUXG5PRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG5AbGljZW5zZVxuKi9cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcbiAgKGdsb2JhbCA9IGdsb2JhbCB8fCBzZWxmLCBmYWN0b3J5KGdsb2JhbC5EaWZmID0ge30pKTtcbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIGZ1bmN0aW9uIERpZmYoKSB7fVxuICBEaWZmLnByb3RvdHlwZSA9IHtcbiAgICBkaWZmOiBmdW5jdGlvbiBkaWZmKG9sZFN0cmluZywgbmV3U3RyaW5nKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge307XG4gICAgICB2YXIgY2FsbGJhY2sgPSBvcHRpb25zLmNhbGxiYWNrO1xuXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBvcHRpb25zO1xuICAgICAgICBvcHRpb25zID0ge307XG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIGZ1bmN0aW9uIGRvbmUodmFsdWUpIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYWxsYmFjayh1bmRlZmluZWQsIHZhbHVlKTtcbiAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0gLy8gQWxsb3cgc3ViY2xhc3NlcyB0byBtYXNzYWdlIHRoZSBpbnB1dCBwcmlvciB0byBydW5uaW5nXG5cblxuICAgICAgb2xkU3RyaW5nID0gdGhpcy5jYXN0SW5wdXQob2xkU3RyaW5nKTtcbiAgICAgIG5ld1N0cmluZyA9IHRoaXMuY2FzdElucHV0KG5ld1N0cmluZyk7XG4gICAgICBvbGRTdHJpbmcgPSB0aGlzLnJlbW92ZUVtcHR5KHRoaXMudG9rZW5pemUob2xkU3RyaW5nKSk7XG4gICAgICBuZXdTdHJpbmcgPSB0aGlzLnJlbW92ZUVtcHR5KHRoaXMudG9rZW5pemUobmV3U3RyaW5nKSk7XG4gICAgICB2YXIgbmV3TGVuID0gbmV3U3RyaW5nLmxlbmd0aCxcbiAgICAgICAgICBvbGRMZW4gPSBvbGRTdHJpbmcubGVuZ3RoO1xuICAgICAgdmFyIGVkaXRMZW5ndGggPSAxO1xuICAgICAgdmFyIG1heEVkaXRMZW5ndGggPSBuZXdMZW4gKyBvbGRMZW47XG4gICAgICB2YXIgYmVzdFBhdGggPSBbe1xuICAgICAgICBuZXdQb3M6IC0xLFxuICAgICAgICBjb21wb25lbnRzOiBbXVxuICAgICAgfV07IC8vIFNlZWQgZWRpdExlbmd0aCA9IDAsIGkuZS4gdGhlIGNvbnRlbnQgc3RhcnRzIHdpdGggdGhlIHNhbWUgdmFsdWVzXG5cbiAgICAgIHZhciBvbGRQb3MgPSB0aGlzLmV4dHJhY3RDb21tb24oYmVzdFBhdGhbMF0sIG5ld1N0cmluZywgb2xkU3RyaW5nLCAwKTtcblxuICAgICAgaWYgKGJlc3RQYXRoWzBdLm5ld1BvcyArIDEgPj0gbmV3TGVuICYmIG9sZFBvcyArIDEgPj0gb2xkTGVuKSB7XG4gICAgICAgIC8vIElkZW50aXR5IHBlciB0aGUgZXF1YWxpdHkgYW5kIHRva2VuaXplclxuICAgICAgICByZXR1cm4gZG9uZShbe1xuICAgICAgICAgIHZhbHVlOiB0aGlzLmpvaW4obmV3U3RyaW5nKSxcbiAgICAgICAgICBjb3VudDogbmV3U3RyaW5nLmxlbmd0aFxuICAgICAgICB9XSk7XG4gICAgICB9IC8vIE1haW4gd29ya2VyIG1ldGhvZC4gY2hlY2tzIGFsbCBwZXJtdXRhdGlvbnMgb2YgYSBnaXZlbiBlZGl0IGxlbmd0aCBmb3IgYWNjZXB0YW5jZS5cblxuXG4gICAgICBmdW5jdGlvbiBleGVjRWRpdExlbmd0aCgpIHtcbiAgICAgICAgZm9yICh2YXIgZGlhZ29uYWxQYXRoID0gLTEgKiBlZGl0TGVuZ3RoOyBkaWFnb25hbFBhdGggPD0gZWRpdExlbmd0aDsgZGlhZ29uYWxQYXRoICs9IDIpIHtcbiAgICAgICAgICB2YXIgYmFzZVBhdGggPSB2b2lkIDA7XG5cbiAgICAgICAgICB2YXIgYWRkUGF0aCA9IGJlc3RQYXRoW2RpYWdvbmFsUGF0aCAtIDFdLFxuICAgICAgICAgICAgICByZW1vdmVQYXRoID0gYmVzdFBhdGhbZGlhZ29uYWxQYXRoICsgMV0sXG4gICAgICAgICAgICAgIF9vbGRQb3MgPSAocmVtb3ZlUGF0aCA/IHJlbW92ZVBhdGgubmV3UG9zIDogMCkgLSBkaWFnb25hbFBhdGg7XG5cbiAgICAgICAgICBpZiAoYWRkUGF0aCkge1xuICAgICAgICAgICAgLy8gTm8gb25lIGVsc2UgaXMgZ29pbmcgdG8gYXR0ZW1wdCB0byB1c2UgdGhpcyB2YWx1ZSwgY2xlYXIgaXRcbiAgICAgICAgICAgIGJlc3RQYXRoW2RpYWdvbmFsUGF0aCAtIDFdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBjYW5BZGQgPSBhZGRQYXRoICYmIGFkZFBhdGgubmV3UG9zICsgMSA8IG5ld0xlbixcbiAgICAgICAgICAgICAgY2FuUmVtb3ZlID0gcmVtb3ZlUGF0aCAmJiAwIDw9IF9vbGRQb3MgJiYgX29sZFBvcyA8IG9sZExlbjtcblxuICAgICAgICAgIGlmICghY2FuQWRkICYmICFjYW5SZW1vdmUpIHtcbiAgICAgICAgICAgIC8vIElmIHRoaXMgcGF0aCBpcyBhIHRlcm1pbmFsIHRoZW4gcHJ1bmVcbiAgICAgICAgICAgIGJlc3RQYXRoW2RpYWdvbmFsUGF0aF0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9IC8vIFNlbGVjdCB0aGUgZGlhZ29uYWwgdGhhdCB3ZSB3YW50IHRvIGJyYW5jaCBmcm9tLiBXZSBzZWxlY3QgdGhlIHByaW9yXG4gICAgICAgICAgLy8gcGF0aCB3aG9zZSBwb3NpdGlvbiBpbiB0aGUgbmV3IHN0cmluZyBpcyB0aGUgZmFydGhlc3QgZnJvbSB0aGUgb3JpZ2luXG4gICAgICAgICAgLy8gYW5kIGRvZXMgbm90IHBhc3MgdGhlIGJvdW5kcyBvZiB0aGUgZGlmZiBncmFwaFxuXG5cbiAgICAgICAgICBpZiAoIWNhbkFkZCB8fCBjYW5SZW1vdmUgJiYgYWRkUGF0aC5uZXdQb3MgPCByZW1vdmVQYXRoLm5ld1Bvcykge1xuICAgICAgICAgICAgYmFzZVBhdGggPSBjbG9uZVBhdGgocmVtb3ZlUGF0aCk7XG4gICAgICAgICAgICBzZWxmLnB1c2hDb21wb25lbnQoYmFzZVBhdGguY29tcG9uZW50cywgdW5kZWZpbmVkLCB0cnVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmFzZVBhdGggPSBhZGRQYXRoOyAvLyBObyBuZWVkIHRvIGNsb25lLCB3ZSd2ZSBwdWxsZWQgaXQgZnJvbSB0aGUgbGlzdFxuXG4gICAgICAgICAgICBiYXNlUGF0aC5uZXdQb3MrKztcbiAgICAgICAgICAgIHNlbGYucHVzaENvbXBvbmVudChiYXNlUGF0aC5jb21wb25lbnRzLCB0cnVlLCB1bmRlZmluZWQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIF9vbGRQb3MgPSBzZWxmLmV4dHJhY3RDb21tb24oYmFzZVBhdGgsIG5ld1N0cmluZywgb2xkU3RyaW5nLCBkaWFnb25hbFBhdGgpOyAvLyBJZiB3ZSBoYXZlIGhpdCB0aGUgZW5kIG9mIGJvdGggc3RyaW5ncywgdGhlbiB3ZSBhcmUgZG9uZVxuXG4gICAgICAgICAgaWYgKGJhc2VQYXRoLm5ld1BvcyArIDEgPj0gbmV3TGVuICYmIF9vbGRQb3MgKyAxID49IG9sZExlbikge1xuICAgICAgICAgICAgcmV0dXJuIGRvbmUoYnVpbGRWYWx1ZXMoc2VsZiwgYmFzZVBhdGguY29tcG9uZW50cywgbmV3U3RyaW5nLCBvbGRTdHJpbmcsIHNlbGYudXNlTG9uZ2VzdFRva2VuKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSB0cmFjayB0aGlzIHBhdGggYXMgYSBwb3RlbnRpYWwgY2FuZGlkYXRlIGFuZCBjb250aW51ZS5cbiAgICAgICAgICAgIGJlc3RQYXRoW2RpYWdvbmFsUGF0aF0gPSBiYXNlUGF0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBlZGl0TGVuZ3RoKys7XG4gICAgICB9IC8vIFBlcmZvcm1zIHRoZSBsZW5ndGggb2YgZWRpdCBpdGVyYXRpb24uIElzIGEgYml0IGZ1Z2x5IGFzIHRoaXMgaGFzIHRvIHN1cHBvcnQgdGhlXG4gICAgICAvLyBzeW5jIGFuZCBhc3luYyBtb2RlIHdoaWNoIGlzIG5ldmVyIGZ1bi4gTG9vcHMgb3ZlciBleGVjRWRpdExlbmd0aCB1bnRpbCBhIHZhbHVlXG4gICAgICAvLyBpcyBwcm9kdWNlZC5cblxuXG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgKGZ1bmN0aW9uIGV4ZWMoKSB7XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBUaGlzIHNob3VsZCBub3QgaGFwcGVuLCBidXQgd2Ugd2FudCB0byBiZSBzYWZlLlxuXG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICAgICAgaWYgKGVkaXRMZW5ndGggPiBtYXhFZGl0TGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWV4ZWNFZGl0TGVuZ3RoKCkpIHtcbiAgICAgICAgICAgICAgZXhlYygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIDApO1xuICAgICAgICB9KSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2hpbGUgKGVkaXRMZW5ndGggPD0gbWF4RWRpdExlbmd0aCkge1xuICAgICAgICAgIHZhciByZXQgPSBleGVjRWRpdExlbmd0aCgpO1xuXG4gICAgICAgICAgaWYgKHJldCkge1xuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHB1c2hDb21wb25lbnQ6IGZ1bmN0aW9uIHB1c2hDb21wb25lbnQoY29tcG9uZW50cywgYWRkZWQsIHJlbW92ZWQpIHtcbiAgICAgIHZhciBsYXN0ID0gY29tcG9uZW50c1tjb21wb25lbnRzLmxlbmd0aCAtIDFdO1xuXG4gICAgICBpZiAobGFzdCAmJiBsYXN0LmFkZGVkID09PSBhZGRlZCAmJiBsYXN0LnJlbW92ZWQgPT09IHJlbW92ZWQpIHtcbiAgICAgICAgLy8gV2UgbmVlZCB0byBjbG9uZSBoZXJlIGFzIHRoZSBjb21wb25lbnQgY2xvbmUgb3BlcmF0aW9uIGlzIGp1c3RcbiAgICAgICAgLy8gYXMgc2hhbGxvdyBhcnJheSBjbG9uZVxuICAgICAgICBjb21wb25lbnRzW2NvbXBvbmVudHMubGVuZ3RoIC0gMV0gPSB7XG4gICAgICAgICAgY291bnQ6IGxhc3QuY291bnQgKyAxLFxuICAgICAgICAgIGFkZGVkOiBhZGRlZCxcbiAgICAgICAgICByZW1vdmVkOiByZW1vdmVkXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb21wb25lbnRzLnB1c2goe1xuICAgICAgICAgIGNvdW50OiAxLFxuICAgICAgICAgIGFkZGVkOiBhZGRlZCxcbiAgICAgICAgICByZW1vdmVkOiByZW1vdmVkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgZXh0cmFjdENvbW1vbjogZnVuY3Rpb24gZXh0cmFjdENvbW1vbihiYXNlUGF0aCwgbmV3U3RyaW5nLCBvbGRTdHJpbmcsIGRpYWdvbmFsUGF0aCkge1xuICAgICAgdmFyIG5ld0xlbiA9IG5ld1N0cmluZy5sZW5ndGgsXG4gICAgICAgICAgb2xkTGVuID0gb2xkU3RyaW5nLmxlbmd0aCxcbiAgICAgICAgICBuZXdQb3MgPSBiYXNlUGF0aC5uZXdQb3MsXG4gICAgICAgICAgb2xkUG9zID0gbmV3UG9zIC0gZGlhZ29uYWxQYXRoLFxuICAgICAgICAgIGNvbW1vbkNvdW50ID0gMDtcblxuICAgICAgd2hpbGUgKG5ld1BvcyArIDEgPCBuZXdMZW4gJiYgb2xkUG9zICsgMSA8IG9sZExlbiAmJiB0aGlzLmVxdWFscyhuZXdTdHJpbmdbbmV3UG9zICsgMV0sIG9sZFN0cmluZ1tvbGRQb3MgKyAxXSkpIHtcbiAgICAgICAgbmV3UG9zKys7XG4gICAgICAgIG9sZFBvcysrO1xuICAgICAgICBjb21tb25Db3VudCsrO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29tbW9uQ291bnQpIHtcbiAgICAgICAgYmFzZVBhdGguY29tcG9uZW50cy5wdXNoKHtcbiAgICAgICAgICBjb3VudDogY29tbW9uQ291bnRcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGJhc2VQYXRoLm5ld1BvcyA9IG5ld1BvcztcbiAgICAgIHJldHVybiBvbGRQb3M7XG4gICAgfSxcbiAgICBlcXVhbHM6IGZ1bmN0aW9uIGVxdWFscyhsZWZ0LCByaWdodCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5jb21wYXJhdG9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuY29tcGFyYXRvcihsZWZ0LCByaWdodCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbGVmdCA9PT0gcmlnaHQgfHwgdGhpcy5vcHRpb25zLmlnbm9yZUNhc2UgJiYgbGVmdC50b0xvd2VyQ2FzZSgpID09PSByaWdodC50b0xvd2VyQ2FzZSgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmVtb3ZlRW1wdHk6IGZ1bmN0aW9uIHJlbW92ZUVtcHR5KGFycmF5KSB7XG4gICAgICB2YXIgcmV0ID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGFycmF5W2ldKSB7XG4gICAgICAgICAgcmV0LnB1c2goYXJyYXlbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcbiAgICBjYXN0SW5wdXQ6IGZ1bmN0aW9uIGNhc3RJbnB1dCh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG4gICAgdG9rZW5pemU6IGZ1bmN0aW9uIHRva2VuaXplKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUuc3BsaXQoJycpO1xuICAgIH0sXG4gICAgam9pbjogZnVuY3Rpb24gam9pbihjaGFycykge1xuICAgICAgcmV0dXJuIGNoYXJzLmpvaW4oJycpO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBidWlsZFZhbHVlcyhkaWZmLCBjb21wb25lbnRzLCBuZXdTdHJpbmcsIG9sZFN0cmluZywgdXNlTG9uZ2VzdFRva2VuKSB7XG4gICAgdmFyIGNvbXBvbmVudFBvcyA9IDAsXG4gICAgICAgIGNvbXBvbmVudExlbiA9IGNvbXBvbmVudHMubGVuZ3RoLFxuICAgICAgICBuZXdQb3MgPSAwLFxuICAgICAgICBvbGRQb3MgPSAwO1xuXG4gICAgZm9yICg7IGNvbXBvbmVudFBvcyA8IGNvbXBvbmVudExlbjsgY29tcG9uZW50UG9zKyspIHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBjb21wb25lbnRzW2NvbXBvbmVudFBvc107XG5cbiAgICAgIGlmICghY29tcG9uZW50LnJlbW92ZWQpIHtcbiAgICAgICAgaWYgKCFjb21wb25lbnQuYWRkZWQgJiYgdXNlTG9uZ2VzdFRva2VuKSB7XG4gICAgICAgICAgdmFyIHZhbHVlID0gbmV3U3RyaW5nLnNsaWNlKG5ld1BvcywgbmV3UG9zICsgY29tcG9uZW50LmNvdW50KTtcbiAgICAgICAgICB2YWx1ZSA9IHZhbHVlLm1hcChmdW5jdGlvbiAodmFsdWUsIGkpIHtcbiAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IG9sZFN0cmluZ1tvbGRQb3MgKyBpXTtcbiAgICAgICAgICAgIHJldHVybiBvbGRWYWx1ZS5sZW5ndGggPiB2YWx1ZS5sZW5ndGggPyBvbGRWYWx1ZSA6IHZhbHVlO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbXBvbmVudC52YWx1ZSA9IGRpZmYuam9pbih2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29tcG9uZW50LnZhbHVlID0gZGlmZi5qb2luKG5ld1N0cmluZy5zbGljZShuZXdQb3MsIG5ld1BvcyArIGNvbXBvbmVudC5jb3VudCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3UG9zICs9IGNvbXBvbmVudC5jb3VudDsgLy8gQ29tbW9uIGNhc2VcblxuICAgICAgICBpZiAoIWNvbXBvbmVudC5hZGRlZCkge1xuICAgICAgICAgIG9sZFBvcyArPSBjb21wb25lbnQuY291bnQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbXBvbmVudC52YWx1ZSA9IGRpZmYuam9pbihvbGRTdHJpbmcuc2xpY2Uob2xkUG9zLCBvbGRQb3MgKyBjb21wb25lbnQuY291bnQpKTtcbiAgICAgICAgb2xkUG9zICs9IGNvbXBvbmVudC5jb3VudDsgLy8gUmV2ZXJzZSBhZGQgYW5kIHJlbW92ZSBzbyByZW1vdmVzIGFyZSBvdXRwdXQgZmlyc3QgdG8gbWF0Y2ggY29tbW9uIGNvbnZlbnRpb25cbiAgICAgICAgLy8gVGhlIGRpZmZpbmcgYWxnb3JpdGhtIGlzIHRpZWQgdG8gYWRkIHRoZW4gcmVtb3ZlIG91dHB1dCBhbmQgdGhpcyBpcyB0aGUgc2ltcGxlc3RcbiAgICAgICAgLy8gcm91dGUgdG8gZ2V0IHRoZSBkZXNpcmVkIG91dHB1dCB3aXRoIG1pbmltYWwgb3ZlcmhlYWQuXG5cbiAgICAgICAgaWYgKGNvbXBvbmVudFBvcyAmJiBjb21wb25lbnRzW2NvbXBvbmVudFBvcyAtIDFdLmFkZGVkKSB7XG4gICAgICAgICAgdmFyIHRtcCA9IGNvbXBvbmVudHNbY29tcG9uZW50UG9zIC0gMV07XG4gICAgICAgICAgY29tcG9uZW50c1tjb21wb25lbnRQb3MgLSAxXSA9IGNvbXBvbmVudHNbY29tcG9uZW50UG9zXTtcbiAgICAgICAgICBjb21wb25lbnRzW2NvbXBvbmVudFBvc10gPSB0bXA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IC8vIFNwZWNpYWwgY2FzZSBoYW5kbGUgZm9yIHdoZW4gb25lIHRlcm1pbmFsIGlzIGlnbm9yZWQgKGkuZS4gd2hpdGVzcGFjZSkuXG4gICAgLy8gRm9yIHRoaXMgY2FzZSB3ZSBtZXJnZSB0aGUgdGVybWluYWwgaW50byB0aGUgcHJpb3Igc3RyaW5nIGFuZCBkcm9wIHRoZSBjaGFuZ2UuXG4gICAgLy8gVGhpcyBpcyBvbmx5IGF2YWlsYWJsZSBmb3Igc3RyaW5nIG1vZGUuXG5cblxuICAgIHZhciBsYXN0Q29tcG9uZW50ID0gY29tcG9uZW50c1tjb21wb25lbnRMZW4gLSAxXTtcblxuICAgIGlmIChjb21wb25lbnRMZW4gPiAxICYmIHR5cGVvZiBsYXN0Q29tcG9uZW50LnZhbHVlID09PSAnc3RyaW5nJyAmJiAobGFzdENvbXBvbmVudC5hZGRlZCB8fCBsYXN0Q29tcG9uZW50LnJlbW92ZWQpICYmIGRpZmYuZXF1YWxzKCcnLCBsYXN0Q29tcG9uZW50LnZhbHVlKSkge1xuICAgICAgY29tcG9uZW50c1tjb21wb25lbnRMZW4gLSAyXS52YWx1ZSArPSBsYXN0Q29tcG9uZW50LnZhbHVlO1xuICAgICAgY29tcG9uZW50cy5wb3AoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29tcG9uZW50cztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb25lUGF0aChwYXRoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5ld1BvczogcGF0aC5uZXdQb3MsXG4gICAgICBjb21wb25lbnRzOiBwYXRoLmNvbXBvbmVudHMuc2xpY2UoMClcbiAgICB9O1xuICB9XG5cbiAgdmFyIGNoYXJhY3RlckRpZmYgPSBuZXcgRGlmZigpO1xuICBmdW5jdGlvbiBkaWZmQ2hhcnMob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gY2hhcmFjdGVyRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlT3B0aW9ucyhvcHRpb25zLCBkZWZhdWx0cykge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZGVmYXVsdHMuY2FsbGJhY2sgPSBvcHRpb25zO1xuICAgIH0gZWxzZSBpZiAob3B0aW9ucykge1xuICAgICAgZm9yICh2YXIgbmFtZSBpbiBvcHRpb25zKSB7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgICAgZGVmYXVsdHNbbmFtZV0gPSBvcHRpb25zW25hbWVdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlZmF1bHRzO1xuICB9XG5cbiAgLy9cbiAgLy8gUmFuZ2VzIGFuZCBleGNlcHRpb25zOlxuICAvLyBMYXRpbi0xIFN1cHBsZW1lbnQsIDAwODDigJMwMEZGXG4gIC8vICAtIFUrMDBENyAgw5cgTXVsdGlwbGljYXRpb24gc2lnblxuICAvLyAgLSBVKzAwRjcgIMO3IERpdmlzaW9uIHNpZ25cbiAgLy8gTGF0aW4gRXh0ZW5kZWQtQSwgMDEwMOKAkzAxN0ZcbiAgLy8gTGF0aW4gRXh0ZW5kZWQtQiwgMDE4MOKAkzAyNEZcbiAgLy8gSVBBIEV4dGVuc2lvbnMsIDAyNTDigJMwMkFGXG4gIC8vIFNwYWNpbmcgTW9kaWZpZXIgTGV0dGVycywgMDJCMOKAkzAyRkZcbiAgLy8gIC0gVSswMkM3ICDLhyAmIzcxMTsgIENhcm9uXG4gIC8vICAtIFUrMDJEOCAgy5ggJiM3Mjg7ICBCcmV2ZVxuICAvLyAgLSBVKzAyRDkgIMuZICYjNzI5OyAgRG90IEFib3ZlXG4gIC8vICAtIFUrMDJEQSAgy5ogJiM3MzA7ICBSaW5nIEFib3ZlXG4gIC8vICAtIFUrMDJEQiAgy5sgJiM3MzE7ICBPZ29uZWtcbiAgLy8gIC0gVSswMkRDICDLnCAmIzczMjsgIFNtYWxsIFRpbGRlXG4gIC8vICAtIFUrMDJERCAgy50gJiM3MzM7ICBEb3VibGUgQWN1dGUgQWNjZW50XG4gIC8vIExhdGluIEV4dGVuZGVkIEFkZGl0aW9uYWwsIDFFMDDigJMxRUZGXG5cbiAgdmFyIGV4dGVuZGVkV29yZENoYXJzID0gL15bQS1aYS16XFx4QzAtXFx1MDJDNlxcdTAyQzgtXFx1MDJEN1xcdTAyREUtXFx1MDJGRlxcdTFFMDAtXFx1MUVGRl0rJC87XG4gIHZhciByZVdoaXRlc3BhY2UgPSAvXFxTLztcbiAgdmFyIHdvcmREaWZmID0gbmV3IERpZmYoKTtcblxuICB3b3JkRGlmZi5lcXVhbHMgPSBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmlnbm9yZUNhc2UpIHtcbiAgICAgIGxlZnQgPSBsZWZ0LnRvTG93ZXJDYXNlKCk7XG4gICAgICByaWdodCA9IHJpZ2h0LnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxlZnQgPT09IHJpZ2h0IHx8IHRoaXMub3B0aW9ucy5pZ25vcmVXaGl0ZXNwYWNlICYmICFyZVdoaXRlc3BhY2UudGVzdChsZWZ0KSAmJiAhcmVXaGl0ZXNwYWNlLnRlc3QocmlnaHQpO1xuICB9O1xuXG4gIHdvcmREaWZmLnRva2VuaXplID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFyIHRva2VucyA9IHZhbHVlLnNwbGl0KC8oXFxzK3xbKClbXFxde30nXCJdfFxcYikvKTsgLy8gSm9pbiB0aGUgYm91bmRhcnkgc3BsaXRzIHRoYXQgd2UgZG8gbm90IGNvbnNpZGVyIHRvIGJlIGJvdW5kYXJpZXMuIFRoaXMgaXMgcHJpbWFyaWx5IHRoZSBleHRlbmRlZCBMYXRpbiBjaGFyYWN0ZXIgc2V0LlxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAvLyBJZiB3ZSBoYXZlIGFuIGVtcHR5IHN0cmluZyBpbiB0aGUgbmV4dCBmaWVsZCBhbmQgd2UgaGF2ZSBvbmx5IHdvcmQgY2hhcnMgYmVmb3JlIGFuZCBhZnRlciwgbWVyZ2VcbiAgICAgIGlmICghdG9rZW5zW2kgKyAxXSAmJiB0b2tlbnNbaSArIDJdICYmIGV4dGVuZGVkV29yZENoYXJzLnRlc3QodG9rZW5zW2ldKSAmJiBleHRlbmRlZFdvcmRDaGFycy50ZXN0KHRva2Vuc1tpICsgMl0pKSB7XG4gICAgICAgIHRva2Vuc1tpXSArPSB0b2tlbnNbaSArIDJdO1xuICAgICAgICB0b2tlbnMuc3BsaWNlKGkgKyAxLCAyKTtcbiAgICAgICAgaS0tO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0b2tlbnM7XG4gIH07XG5cbiAgZnVuY3Rpb24gZGlmZldvcmRzKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IGdlbmVyYXRlT3B0aW9ucyhvcHRpb25zLCB7XG4gICAgICBpZ25vcmVXaGl0ZXNwYWNlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIHdvcmREaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpO1xuICB9XG4gIGZ1bmN0aW9uIGRpZmZXb3Jkc1dpdGhTcGFjZShvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucykge1xuICAgIHJldHVybiB3b3JkRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKTtcbiAgfVxuXG4gIHZhciBsaW5lRGlmZiA9IG5ldyBEaWZmKCk7XG5cbiAgbGluZURpZmYudG9rZW5pemUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB2YXIgcmV0TGluZXMgPSBbXSxcbiAgICAgICAgbGluZXNBbmROZXdsaW5lcyA9IHZhbHVlLnNwbGl0KC8oXFxufFxcclxcbikvKTsgLy8gSWdub3JlIHRoZSBmaW5hbCBlbXB0eSB0b2tlbiB0aGF0IG9jY3VycyBpZiB0aGUgc3RyaW5nIGVuZHMgd2l0aCBhIG5ldyBsaW5lXG5cbiAgICBpZiAoIWxpbmVzQW5kTmV3bGluZXNbbGluZXNBbmROZXdsaW5lcy5sZW5ndGggLSAxXSkge1xuICAgICAgbGluZXNBbmROZXdsaW5lcy5wb3AoKTtcbiAgICB9IC8vIE1lcmdlIHRoZSBjb250ZW50IGFuZCBsaW5lIHNlcGFyYXRvcnMgaW50byBzaW5nbGUgdG9rZW5zXG5cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXNBbmROZXdsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGxpbmUgPSBsaW5lc0FuZE5ld2xpbmVzW2ldO1xuXG4gICAgICBpZiAoaSAlIDIgJiYgIXRoaXMub3B0aW9ucy5uZXdsaW5lSXNUb2tlbikge1xuICAgICAgICByZXRMaW5lc1tyZXRMaW5lcy5sZW5ndGggLSAxXSArPSBsaW5lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pZ25vcmVXaGl0ZXNwYWNlKSB7XG4gICAgICAgICAgbGluZSA9IGxpbmUudHJpbSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0TGluZXMucHVzaChsaW5lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmV0TGluZXM7XG4gIH07XG5cbiAgZnVuY3Rpb24gZGlmZkxpbmVzKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBsaW5lRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjayk7XG4gIH1cbiAgZnVuY3Rpb24gZGlmZlRyaW1tZWRMaW5lcyhvbGRTdHIsIG5ld1N0ciwgY2FsbGJhY2spIHtcbiAgICB2YXIgb3B0aW9ucyA9IGdlbmVyYXRlT3B0aW9ucyhjYWxsYmFjaywge1xuICAgICAgaWdub3JlV2hpdGVzcGFjZTogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiBsaW5lRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKTtcbiAgfVxuXG4gIHZhciBzZW50ZW5jZURpZmYgPSBuZXcgRGlmZigpO1xuXG4gIHNlbnRlbmNlRGlmZi50b2tlbml6ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5zcGxpdCgvKFxcUy4rP1suIT9dKSg/PVxccyt8JCkvKTtcbiAgfTtcblxuICBmdW5jdGlvbiBkaWZmU2VudGVuY2VzKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBzZW50ZW5jZURpZmYuZGlmZihvbGRTdHIsIG5ld1N0ciwgY2FsbGJhY2spO1xuICB9XG5cbiAgdmFyIGNzc0RpZmYgPSBuZXcgRGlmZigpO1xuXG4gIGNzc0RpZmYudG9rZW5pemUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUuc3BsaXQoLyhbe306OyxdfFxccyspLyk7XG4gIH07XG5cbiAgZnVuY3Rpb24gZGlmZkNzcyhvbGRTdHIsIG5ld1N0ciwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gY3NzRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjayk7XG4gIH1cblxuICBmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICAgIGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikge1xuICAgICAgX3R5cGVvZiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBvYmo7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBfdHlwZW9mID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIF90eXBlb2Yob2JqKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHtcbiAgICByZXR1cm4gX2FycmF5V2l0aG91dEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF9ub25JdGVyYWJsZVNwcmVhZCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBhcnIyW2ldID0gYXJyW2ldO1xuXG4gICAgICByZXR1cm4gYXJyMjtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5KGl0ZXIpIHtcbiAgICBpZiAoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChpdGVyKSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaXRlcikgPT09IFwiW29iamVjdCBBcmd1bWVudHNdXCIpIHJldHVybiBBcnJheS5mcm9tKGl0ZXIpO1xuICB9XG5cbiAgZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gc3ByZWFkIG5vbi1pdGVyYWJsZSBpbnN0YW5jZVwiKTtcbiAgfVxuXG4gIHZhciBvYmplY3RQcm90b3R5cGVUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4gIHZhciBqc29uRGlmZiA9IG5ldyBEaWZmKCk7IC8vIERpc2NyaW1pbmF0ZSBiZXR3ZWVuIHR3byBsaW5lcyBvZiBwcmV0dHktcHJpbnRlZCwgc2VyaWFsaXplZCBKU09OIHdoZXJlIG9uZSBvZiB0aGVtIGhhcyBhXG4gIC8vIGRhbmdsaW5nIGNvbW1hIGFuZCB0aGUgb3RoZXIgZG9lc24ndC4gVHVybnMgb3V0IGluY2x1ZGluZyB0aGUgZGFuZ2xpbmcgY29tbWEgeWllbGRzIHRoZSBuaWNlc3Qgb3V0cHV0OlxuXG4gIGpzb25EaWZmLnVzZUxvbmdlc3RUb2tlbiA9IHRydWU7XG4gIGpzb25EaWZmLnRva2VuaXplID0gbGluZURpZmYudG9rZW5pemU7XG5cbiAganNvbkRpZmYuY2FzdElucHV0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFyIF90aGlzJG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgIHVuZGVmaW5lZFJlcGxhY2VtZW50ID0gX3RoaXMkb3B0aW9ucy51bmRlZmluZWRSZXBsYWNlbWVudCxcbiAgICAgICAgX3RoaXMkb3B0aW9ucyRzdHJpbmdpID0gX3RoaXMkb3B0aW9ucy5zdHJpbmdpZnlSZXBsYWNlcixcbiAgICAgICAgc3RyaW5naWZ5UmVwbGFjZXIgPSBfdGhpcyRvcHRpb25zJHN0cmluZ2kgPT09IHZvaWQgMCA/IGZ1bmN0aW9uIChrLCB2KSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHYgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkUmVwbGFjZW1lbnQgOiB2O1xuICAgIH0gOiBfdGhpcyRvcHRpb25zJHN0cmluZ2k7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyB2YWx1ZSA6IEpTT04uc3RyaW5naWZ5KGNhbm9uaWNhbGl6ZSh2YWx1ZSwgbnVsbCwgbnVsbCwgc3RyaW5naWZ5UmVwbGFjZXIpLCBzdHJpbmdpZnlSZXBsYWNlciwgJyAgJyk7XG4gIH07XG5cbiAganNvbkRpZmYuZXF1YWxzID0gZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7XG4gICAgcmV0dXJuIERpZmYucHJvdG90eXBlLmVxdWFscy5jYWxsKGpzb25EaWZmLCBsZWZ0LnJlcGxhY2UoLywoW1xcclxcbl0pL2csICckMScpLCByaWdodC5yZXBsYWNlKC8sKFtcXHJcXG5dKS9nLCAnJDEnKSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gZGlmZkpzb24ob2xkT2JqLCBuZXdPYmosIG9wdGlvbnMpIHtcbiAgICByZXR1cm4ganNvbkRpZmYuZGlmZihvbGRPYmosIG5ld09iaiwgb3B0aW9ucyk7XG4gIH0gLy8gVGhpcyBmdW5jdGlvbiBoYW5kbGVzIHRoZSBwcmVzZW5jZSBvZiBjaXJjdWxhciByZWZlcmVuY2VzIGJ5IGJhaWxpbmcgb3V0IHdoZW4gZW5jb3VudGVyaW5nIGFuXG4gIC8vIG9iamVjdCB0aGF0IGlzIGFscmVhZHkgb24gdGhlIFwic3RhY2tcIiBvZiBpdGVtcyBiZWluZyBwcm9jZXNzZWQuIEFjY2VwdHMgYW4gb3B0aW9uYWwgcmVwbGFjZXJcblxuICBmdW5jdGlvbiBjYW5vbmljYWxpemUob2JqLCBzdGFjaywgcmVwbGFjZW1lbnRTdGFjaywgcmVwbGFjZXIsIGtleSkge1xuICAgIHN0YWNrID0gc3RhY2sgfHwgW107XG4gICAgcmVwbGFjZW1lbnRTdGFjayA9IHJlcGxhY2VtZW50U3RhY2sgfHwgW107XG5cbiAgICBpZiAocmVwbGFjZXIpIHtcbiAgICAgIG9iaiA9IHJlcGxhY2VyKGtleSwgb2JqKTtcbiAgICB9XG5cbiAgICB2YXIgaTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBzdGFjay5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKHN0YWNrW2ldID09PSBvYmopIHtcbiAgICAgICAgcmV0dXJuIHJlcGxhY2VtZW50U3RhY2tbaV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGNhbm9uaWNhbGl6ZWRPYmo7XG5cbiAgICBpZiAoJ1tvYmplY3QgQXJyYXldJyA9PT0gb2JqZWN0UHJvdG90eXBlVG9TdHJpbmcuY2FsbChvYmopKSB7XG4gICAgICBzdGFjay5wdXNoKG9iaik7XG4gICAgICBjYW5vbmljYWxpemVkT2JqID0gbmV3IEFycmF5KG9iai5sZW5ndGgpO1xuICAgICAgcmVwbGFjZW1lbnRTdGFjay5wdXNoKGNhbm9uaWNhbGl6ZWRPYmopO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgb2JqLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNhbm9uaWNhbGl6ZWRPYmpbaV0gPSBjYW5vbmljYWxpemUob2JqW2ldLCBzdGFjaywgcmVwbGFjZW1lbnRTdGFjaywgcmVwbGFjZXIsIGtleSk7XG4gICAgICB9XG5cbiAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgcmVwbGFjZW1lbnRTdGFjay5wb3AoKTtcbiAgICAgIHJldHVybiBjYW5vbmljYWxpemVkT2JqO1xuICAgIH1cblxuICAgIGlmIChvYmogJiYgb2JqLnRvSlNPTikge1xuICAgICAgb2JqID0gb2JqLnRvSlNPTigpO1xuICAgIH1cblxuICAgIGlmIChfdHlwZW9mKG9iaikgPT09ICdvYmplY3QnICYmIG9iaiAhPT0gbnVsbCkge1xuICAgICAgc3RhY2sucHVzaChvYmopO1xuICAgICAgY2Fub25pY2FsaXplZE9iaiA9IHt9O1xuICAgICAgcmVwbGFjZW1lbnRTdGFjay5wdXNoKGNhbm9uaWNhbGl6ZWRPYmopO1xuXG4gICAgICB2YXIgc29ydGVkS2V5cyA9IFtdLFxuICAgICAgICAgIF9rZXk7XG5cbiAgICAgIGZvciAoX2tleSBpbiBvYmopIHtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShfa2V5KSkge1xuICAgICAgICAgIHNvcnRlZEtleXMucHVzaChfa2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzb3J0ZWRLZXlzLnNvcnQoKTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IHNvcnRlZEtleXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgX2tleSA9IHNvcnRlZEtleXNbaV07XG4gICAgICAgIGNhbm9uaWNhbGl6ZWRPYmpbX2tleV0gPSBjYW5vbmljYWxpemUob2JqW19rZXldLCBzdGFjaywgcmVwbGFjZW1lbnRTdGFjaywgcmVwbGFjZXIsIF9rZXkpO1xuICAgICAgfVxuXG4gICAgICBzdGFjay5wb3AoKTtcbiAgICAgIHJlcGxhY2VtZW50U3RhY2sucG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbm9uaWNhbGl6ZWRPYmogPSBvYmo7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhbm9uaWNhbGl6ZWRPYmo7XG4gIH1cblxuICB2YXIgYXJyYXlEaWZmID0gbmV3IERpZmYoKTtcblxuICBhcnJheURpZmYudG9rZW5pemUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUuc2xpY2UoKTtcbiAgfTtcblxuICBhcnJheURpZmYuam9pbiA9IGFycmF5RGlmZi5yZW1vdmVFbXB0eSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICBmdW5jdGlvbiBkaWZmQXJyYXlzKG9sZEFyciwgbmV3QXJyLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBhcnJheURpZmYuZGlmZihvbGRBcnIsIG5ld0FyciwgY2FsbGJhY2spO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VQYXRjaCh1bmlEaWZmKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgIHZhciBkaWZmc3RyID0gdW5pRGlmZi5zcGxpdCgvXFxyXFxufFtcXG5cXHZcXGZcXHJcXHg4NV0vKSxcbiAgICAgICAgZGVsaW1pdGVycyA9IHVuaURpZmYubWF0Y2goL1xcclxcbnxbXFxuXFx2XFxmXFxyXFx4ODVdL2cpIHx8IFtdLFxuICAgICAgICBsaXN0ID0gW10sXG4gICAgICAgIGkgPSAwO1xuXG4gICAgZnVuY3Rpb24gcGFyc2VJbmRleCgpIHtcbiAgICAgIHZhciBpbmRleCA9IHt9O1xuICAgICAgbGlzdC5wdXNoKGluZGV4KTsgLy8gUGFyc2UgZGlmZiBtZXRhZGF0YVxuXG4gICAgICB3aGlsZSAoaSA8IGRpZmZzdHIubGVuZ3RoKSB7XG4gICAgICAgIHZhciBsaW5lID0gZGlmZnN0cltpXTsgLy8gRmlsZSBoZWFkZXIgZm91bmQsIGVuZCBwYXJzaW5nIGRpZmYgbWV0YWRhdGFcblxuICAgICAgICBpZiAoL14oXFwtXFwtXFwtfFxcK1xcK1xcK3xAQClcXHMvLnRlc3QobGluZSkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSAvLyBEaWZmIGluZGV4XG5cblxuICAgICAgICB2YXIgaGVhZGVyID0gL14oPzpJbmRleDp8ZGlmZig/OiAtciBcXHcrKSspXFxzKyguKz8pXFxzKiQvLmV4ZWMobGluZSk7XG5cbiAgICAgICAgaWYgKGhlYWRlcikge1xuICAgICAgICAgIGluZGV4LmluZGV4ID0gaGVhZGVyWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgaSsrO1xuICAgICAgfSAvLyBQYXJzZSBmaWxlIGhlYWRlcnMgaWYgdGhleSBhcmUgZGVmaW5lZC4gVW5pZmllZCBkaWZmIHJlcXVpcmVzIHRoZW0sIGJ1dFxuICAgICAgLy8gdGhlcmUncyBubyB0ZWNobmljYWwgaXNzdWVzIHRvIGhhdmUgYW4gaXNvbGF0ZWQgaHVuayB3aXRob3V0IGZpbGUgaGVhZGVyXG5cblxuICAgICAgcGFyc2VGaWxlSGVhZGVyKGluZGV4KTtcbiAgICAgIHBhcnNlRmlsZUhlYWRlcihpbmRleCk7IC8vIFBhcnNlIGh1bmtzXG5cbiAgICAgIGluZGV4Lmh1bmtzID0gW107XG5cbiAgICAgIHdoaWxlIChpIDwgZGlmZnN0ci5sZW5ndGgpIHtcbiAgICAgICAgdmFyIF9saW5lID0gZGlmZnN0cltpXTtcblxuICAgICAgICBpZiAoL14oSW5kZXg6fGRpZmZ8XFwtXFwtXFwtfFxcK1xcK1xcKylcXHMvLnRlc3QoX2xpbmUpKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSBpZiAoL15AQC8udGVzdChfbGluZSkpIHtcbiAgICAgICAgICBpbmRleC5odW5rcy5wdXNoKHBhcnNlSHVuaygpKTtcbiAgICAgICAgfSBlbHNlIGlmIChfbGluZSAmJiBvcHRpb25zLnN0cmljdCkge1xuICAgICAgICAgIC8vIElnbm9yZSB1bmV4cGVjdGVkIGNvbnRlbnQgdW5sZXNzIGluIHN0cmljdCBtb2RlXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGxpbmUgJyArIChpICsgMSkgKyAnICcgKyBKU09OLnN0cmluZ2lmeShfbGluZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gLy8gUGFyc2VzIHRoZSAtLS0gYW5kICsrKyBoZWFkZXJzLCBpZiBub25lIGFyZSBmb3VuZCwgbm8gbGluZXNcbiAgICAvLyBhcmUgY29uc3VtZWQuXG5cblxuICAgIGZ1bmN0aW9uIHBhcnNlRmlsZUhlYWRlcihpbmRleCkge1xuICAgICAgdmFyIGZpbGVIZWFkZXIgPSAvXigtLS18XFwrXFwrXFwrKVxccysoLiopJC8uZXhlYyhkaWZmc3RyW2ldKTtcblxuICAgICAgaWYgKGZpbGVIZWFkZXIpIHtcbiAgICAgICAgdmFyIGtleVByZWZpeCA9IGZpbGVIZWFkZXJbMV0gPT09ICctLS0nID8gJ29sZCcgOiAnbmV3JztcbiAgICAgICAgdmFyIGRhdGEgPSBmaWxlSGVhZGVyWzJdLnNwbGl0KCdcXHQnLCAyKTtcbiAgICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YVswXS5yZXBsYWNlKC9cXFxcXFxcXC9nLCAnXFxcXCcpO1xuXG4gICAgICAgIGlmICgvXlwiLipcIiQvLnRlc3QoZmlsZU5hbWUpKSB7XG4gICAgICAgICAgZmlsZU5hbWUgPSBmaWxlTmFtZS5zdWJzdHIoMSwgZmlsZU5hbWUubGVuZ3RoIC0gMik7XG4gICAgICAgIH1cblxuICAgICAgICBpbmRleFtrZXlQcmVmaXggKyAnRmlsZU5hbWUnXSA9IGZpbGVOYW1lO1xuICAgICAgICBpbmRleFtrZXlQcmVmaXggKyAnSGVhZGVyJ10gPSAoZGF0YVsxXSB8fCAnJykudHJpbSgpO1xuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgfSAvLyBQYXJzZXMgYSBodW5rXG4gICAgLy8gVGhpcyBhc3N1bWVzIHRoYXQgd2UgYXJlIGF0IHRoZSBzdGFydCBvZiBhIGh1bmsuXG5cblxuICAgIGZ1bmN0aW9uIHBhcnNlSHVuaygpIHtcbiAgICAgIHZhciBjaHVua0hlYWRlckluZGV4ID0gaSxcbiAgICAgICAgICBjaHVua0hlYWRlckxpbmUgPSBkaWZmc3RyW2krK10sXG4gICAgICAgICAgY2h1bmtIZWFkZXIgPSBjaHVua0hlYWRlckxpbmUuc3BsaXQoL0BAIC0oXFxkKykoPzosKFxcZCspKT8gXFwrKFxcZCspKD86LChcXGQrKSk/IEBALyk7XG4gICAgICB2YXIgaHVuayA9IHtcbiAgICAgICAgb2xkU3RhcnQ6ICtjaHVua0hlYWRlclsxXSxcbiAgICAgICAgb2xkTGluZXM6ICtjaHVua0hlYWRlclsyXSB8fCAxLFxuICAgICAgICBuZXdTdGFydDogK2NodW5rSGVhZGVyWzNdLFxuICAgICAgICBuZXdMaW5lczogK2NodW5rSGVhZGVyWzRdIHx8IDEsXG4gICAgICAgIGxpbmVzOiBbXSxcbiAgICAgICAgbGluZWRlbGltaXRlcnM6IFtdXG4gICAgICB9O1xuICAgICAgdmFyIGFkZENvdW50ID0gMCxcbiAgICAgICAgICByZW1vdmVDb3VudCA9IDA7XG5cbiAgICAgIGZvciAoOyBpIDwgZGlmZnN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICAvLyBMaW5lcyBzdGFydGluZyB3aXRoICctLS0nIGNvdWxkIGJlIG1pc3Rha2VuIGZvciB0aGUgXCJyZW1vdmUgbGluZVwiIG9wZXJhdGlvblxuICAgICAgICAvLyBCdXQgdGhleSBjb3VsZCBiZSB0aGUgaGVhZGVyIGZvciB0aGUgbmV4dCBmaWxlLiBUaGVyZWZvcmUgcHJ1bmUgc3VjaCBjYXNlcyBvdXQuXG4gICAgICAgIGlmIChkaWZmc3RyW2ldLmluZGV4T2YoJy0tLSAnKSA9PT0gMCAmJiBpICsgMiA8IGRpZmZzdHIubGVuZ3RoICYmIGRpZmZzdHJbaSArIDFdLmluZGV4T2YoJysrKyAnKSA9PT0gMCAmJiBkaWZmc3RyW2kgKyAyXS5pbmRleE9mKCdAQCcpID09PSAwKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb3BlcmF0aW9uID0gZGlmZnN0cltpXS5sZW5ndGggPT0gMCAmJiBpICE9IGRpZmZzdHIubGVuZ3RoIC0gMSA/ICcgJyA6IGRpZmZzdHJbaV1bMF07XG5cbiAgICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gJysnIHx8IG9wZXJhdGlvbiA9PT0gJy0nIHx8IG9wZXJhdGlvbiA9PT0gJyAnIHx8IG9wZXJhdGlvbiA9PT0gJ1xcXFwnKSB7XG4gICAgICAgICAgaHVuay5saW5lcy5wdXNoKGRpZmZzdHJbaV0pO1xuICAgICAgICAgIGh1bmsubGluZWRlbGltaXRlcnMucHVzaChkZWxpbWl0ZXJzW2ldIHx8ICdcXG4nKTtcblxuICAgICAgICAgIGlmIChvcGVyYXRpb24gPT09ICcrJykge1xuICAgICAgICAgICAgYWRkQ291bnQrKztcbiAgICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gJy0nKSB7XG4gICAgICAgICAgICByZW1vdmVDb3VudCsrO1xuICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSAnICcpIHtcbiAgICAgICAgICAgIGFkZENvdW50Kys7XG4gICAgICAgICAgICByZW1vdmVDb3VudCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSAvLyBIYW5kbGUgdGhlIGVtcHR5IGJsb2NrIGNvdW50IGNhc2VcblxuXG4gICAgICBpZiAoIWFkZENvdW50ICYmIGh1bmsubmV3TGluZXMgPT09IDEpIHtcbiAgICAgICAgaHVuay5uZXdMaW5lcyA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmICghcmVtb3ZlQ291bnQgJiYgaHVuay5vbGRMaW5lcyA9PT0gMSkge1xuICAgICAgICBodW5rLm9sZExpbmVzID0gMDtcbiAgICAgIH0gLy8gUGVyZm9ybSBvcHRpb25hbCBzYW5pdHkgY2hlY2tpbmdcblxuXG4gICAgICBpZiAob3B0aW9ucy5zdHJpY3QpIHtcbiAgICAgICAgaWYgKGFkZENvdW50ICE9PSBodW5rLm5ld0xpbmVzKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBZGRlZCBsaW5lIGNvdW50IGRpZCBub3QgbWF0Y2ggZm9yIGh1bmsgYXQgbGluZSAnICsgKGNodW5rSGVhZGVySW5kZXggKyAxKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVtb3ZlQ291bnQgIT09IGh1bmsub2xkTGluZXMpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlbW92ZWQgbGluZSBjb3VudCBkaWQgbm90IG1hdGNoIGZvciBodW5rIGF0IGxpbmUgJyArIChjaHVua0hlYWRlckluZGV4ICsgMSkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBodW5rO1xuICAgIH1cblxuICAgIHdoaWxlIChpIDwgZGlmZnN0ci5sZW5ndGgpIHtcbiAgICAgIHBhcnNlSW5kZXgoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbGlzdDtcbiAgfVxuXG4gIC8vIEl0ZXJhdG9yIHRoYXQgdHJhdmVyc2VzIGluIHRoZSByYW5nZSBvZiBbbWluLCBtYXhdLCBzdGVwcGluZ1xuICAvLyBieSBkaXN0YW5jZSBmcm9tIGEgZ2l2ZW4gc3RhcnQgcG9zaXRpb24uIEkuZS4gZm9yIFswLCA0XSwgd2l0aFxuICAvLyBzdGFydCBvZiAyLCB0aGlzIHdpbGwgaXRlcmF0ZSAyLCAzLCAxLCA0LCAwLlxuICBmdW5jdGlvbiBkaXN0YW5jZUl0ZXJhdG9yIChzdGFydCwgbWluTGluZSwgbWF4TGluZSkge1xuICAgIHZhciB3YW50Rm9yd2FyZCA9IHRydWUsXG4gICAgICAgIGJhY2t3YXJkRXhoYXVzdGVkID0gZmFsc2UsXG4gICAgICAgIGZvcndhcmRFeGhhdXN0ZWQgPSBmYWxzZSxcbiAgICAgICAgbG9jYWxPZmZzZXQgPSAxO1xuICAgIHJldHVybiBmdW5jdGlvbiBpdGVyYXRvcigpIHtcbiAgICAgIGlmICh3YW50Rm9yd2FyZCAmJiAhZm9yd2FyZEV4aGF1c3RlZCkge1xuICAgICAgICBpZiAoYmFja3dhcmRFeGhhdXN0ZWQpIHtcbiAgICAgICAgICBsb2NhbE9mZnNldCsrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdhbnRGb3J3YXJkID0gZmFsc2U7XG4gICAgICAgIH0gLy8gQ2hlY2sgaWYgdHJ5aW5nIHRvIGZpdCBiZXlvbmQgdGV4dCBsZW5ndGgsIGFuZCBpZiBub3QsIGNoZWNrIGl0IGZpdHNcbiAgICAgICAgLy8gYWZ0ZXIgb2Zmc2V0IGxvY2F0aW9uIChvciBkZXNpcmVkIGxvY2F0aW9uIG9uIGZpcnN0IGl0ZXJhdGlvbilcblxuXG4gICAgICAgIGlmIChzdGFydCArIGxvY2FsT2Zmc2V0IDw9IG1heExpbmUpIHtcbiAgICAgICAgICByZXR1cm4gbG9jYWxPZmZzZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBmb3J3YXJkRXhoYXVzdGVkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFiYWNrd2FyZEV4aGF1c3RlZCkge1xuICAgICAgICBpZiAoIWZvcndhcmRFeGhhdXN0ZWQpIHtcbiAgICAgICAgICB3YW50Rm9yd2FyZCA9IHRydWU7XG4gICAgICAgIH0gLy8gQ2hlY2sgaWYgdHJ5aW5nIHRvIGZpdCBiZWZvcmUgdGV4dCBiZWdpbm5pbmcsIGFuZCBpZiBub3QsIGNoZWNrIGl0IGZpdHNcbiAgICAgICAgLy8gYmVmb3JlIG9mZnNldCBsb2NhdGlvblxuXG5cbiAgICAgICAgaWYgKG1pbkxpbmUgPD0gc3RhcnQgLSBsb2NhbE9mZnNldCkge1xuICAgICAgICAgIHJldHVybiAtbG9jYWxPZmZzZXQrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGJhY2t3YXJkRXhoYXVzdGVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yKCk7XG4gICAgICB9IC8vIFdlIHRyaWVkIHRvIGZpdCBodW5rIGJlZm9yZSB0ZXh0IGJlZ2lubmluZyBhbmQgYmV5b25kIHRleHQgbGVuZ3RoLCB0aGVuXG4gICAgICAvLyBodW5rIGNhbid0IGZpdCBvbiB0aGUgdGV4dC4gUmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFwcGx5UGF0Y2goc291cmNlLCB1bmlEaWZmKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHt9O1xuXG4gICAgaWYgKHR5cGVvZiB1bmlEaWZmID09PSAnc3RyaW5nJykge1xuICAgICAgdW5pRGlmZiA9IHBhcnNlUGF0Y2godW5pRGlmZik7XG4gICAgfVxuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodW5pRGlmZikpIHtcbiAgICAgIGlmICh1bmlEaWZmLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdhcHBseVBhdGNoIG9ubHkgd29ya3Mgd2l0aCBhIHNpbmdsZSBpbnB1dC4nKTtcbiAgICAgIH1cblxuICAgICAgdW5pRGlmZiA9IHVuaURpZmZbMF07XG4gICAgfSAvLyBBcHBseSB0aGUgZGlmZiB0byB0aGUgaW5wdXRcblxuXG4gICAgdmFyIGxpbmVzID0gc291cmNlLnNwbGl0KC9cXHJcXG58W1xcblxcdlxcZlxcclxceDg1XS8pLFxuICAgICAgICBkZWxpbWl0ZXJzID0gc291cmNlLm1hdGNoKC9cXHJcXG58W1xcblxcdlxcZlxcclxceDg1XS9nKSB8fCBbXSxcbiAgICAgICAgaHVua3MgPSB1bmlEaWZmLmh1bmtzLFxuICAgICAgICBjb21wYXJlTGluZSA9IG9wdGlvbnMuY29tcGFyZUxpbmUgfHwgZnVuY3Rpb24gKGxpbmVOdW1iZXIsIGxpbmUsIG9wZXJhdGlvbiwgcGF0Y2hDb250ZW50KSB7XG4gICAgICByZXR1cm4gbGluZSA9PT0gcGF0Y2hDb250ZW50O1xuICAgIH0sXG4gICAgICAgIGVycm9yQ291bnQgPSAwLFxuICAgICAgICBmdXp6RmFjdG9yID0gb3B0aW9ucy5mdXp6RmFjdG9yIHx8IDAsXG4gICAgICAgIG1pbkxpbmUgPSAwLFxuICAgICAgICBvZmZzZXQgPSAwLFxuICAgICAgICByZW1vdmVFT0ZOTCxcbiAgICAgICAgYWRkRU9GTkw7XG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBodW5rIGV4YWN0bHkgZml0cyBvbiB0aGUgcHJvdmlkZWQgbG9jYXRpb25cbiAgICAgKi9cblxuXG4gICAgZnVuY3Rpb24gaHVua0ZpdHMoaHVuaywgdG9Qb3MpIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaHVuay5saW5lcy5sZW5ndGg7IGorKykge1xuICAgICAgICB2YXIgbGluZSA9IGh1bmsubGluZXNbal0sXG4gICAgICAgICAgICBvcGVyYXRpb24gPSBsaW5lLmxlbmd0aCA+IDAgPyBsaW5lWzBdIDogJyAnLFxuICAgICAgICAgICAgY29udGVudCA9IGxpbmUubGVuZ3RoID4gMCA/IGxpbmUuc3Vic3RyKDEpIDogbGluZTtcblxuICAgICAgICBpZiAob3BlcmF0aW9uID09PSAnICcgfHwgb3BlcmF0aW9uID09PSAnLScpIHtcbiAgICAgICAgICAvLyBDb250ZXh0IHNhbml0eSBjaGVja1xuICAgICAgICAgIGlmICghY29tcGFyZUxpbmUodG9Qb3MgKyAxLCBsaW5lc1t0b1Bvc10sIG9wZXJhdGlvbiwgY29udGVudCkpIHtcbiAgICAgICAgICAgIGVycm9yQ291bnQrKztcblxuICAgICAgICAgICAgaWYgKGVycm9yQ291bnQgPiBmdXp6RmFjdG9yKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0b1BvcysrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gLy8gU2VhcmNoIGJlc3QgZml0IG9mZnNldHMgZm9yIGVhY2ggaHVuayBiYXNlZCBvbiB0aGUgcHJldmlvdXMgb25lc1xuXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGh1bmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaHVuayA9IGh1bmtzW2ldLFxuICAgICAgICAgIG1heExpbmUgPSBsaW5lcy5sZW5ndGggLSBodW5rLm9sZExpbmVzLFxuICAgICAgICAgIGxvY2FsT2Zmc2V0ID0gMCxcbiAgICAgICAgICB0b1BvcyA9IG9mZnNldCArIGh1bmsub2xkU3RhcnQgLSAxO1xuICAgICAgdmFyIGl0ZXJhdG9yID0gZGlzdGFuY2VJdGVyYXRvcih0b1BvcywgbWluTGluZSwgbWF4TGluZSk7XG5cbiAgICAgIGZvciAoOyBsb2NhbE9mZnNldCAhPT0gdW5kZWZpbmVkOyBsb2NhbE9mZnNldCA9IGl0ZXJhdG9yKCkpIHtcbiAgICAgICAgaWYgKGh1bmtGaXRzKGh1bmssIHRvUG9zICsgbG9jYWxPZmZzZXQpKSB7XG4gICAgICAgICAgaHVuay5vZmZzZXQgPSBvZmZzZXQgKz0gbG9jYWxPZmZzZXQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGxvY2FsT2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSAvLyBTZXQgbG93ZXIgdGV4dCBsaW1pdCB0byBlbmQgb2YgdGhlIGN1cnJlbnQgaHVuaywgc28gbmV4dCBvbmVzIGRvbid0IHRyeVxuICAgICAgLy8gdG8gZml0IG92ZXIgYWxyZWFkeSBwYXRjaGVkIHRleHRcblxuXG4gICAgICBtaW5MaW5lID0gaHVuay5vZmZzZXQgKyBodW5rLm9sZFN0YXJ0ICsgaHVuay5vbGRMaW5lcztcbiAgICB9IC8vIEFwcGx5IHBhdGNoIGh1bmtzXG5cblxuICAgIHZhciBkaWZmT2Zmc2V0ID0gMDtcblxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBodW5rcy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaHVuayA9IGh1bmtzW19pXSxcbiAgICAgICAgICBfdG9Qb3MgPSBfaHVuay5vbGRTdGFydCArIF9odW5rLm9mZnNldCArIGRpZmZPZmZzZXQgLSAxO1xuXG4gICAgICBkaWZmT2Zmc2V0ICs9IF9odW5rLm5ld0xpbmVzIC0gX2h1bmsub2xkTGluZXM7XG5cbiAgICAgIGlmIChfdG9Qb3MgPCAwKSB7XG4gICAgICAgIC8vIENyZWF0aW5nIGEgbmV3IGZpbGVcbiAgICAgICAgX3RvUG9zID0gMDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBfaHVuay5saW5lcy5sZW5ndGg7IGorKykge1xuICAgICAgICB2YXIgbGluZSA9IF9odW5rLmxpbmVzW2pdLFxuICAgICAgICAgICAgb3BlcmF0aW9uID0gbGluZS5sZW5ndGggPiAwID8gbGluZVswXSA6ICcgJyxcbiAgICAgICAgICAgIGNvbnRlbnQgPSBsaW5lLmxlbmd0aCA+IDAgPyBsaW5lLnN1YnN0cigxKSA6IGxpbmUsXG4gICAgICAgICAgICBkZWxpbWl0ZXIgPSBfaHVuay5saW5lZGVsaW1pdGVyc1tqXTtcblxuICAgICAgICBpZiAob3BlcmF0aW9uID09PSAnICcpIHtcbiAgICAgICAgICBfdG9Qb3MrKztcbiAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09ICctJykge1xuICAgICAgICAgIGxpbmVzLnNwbGljZShfdG9Qb3MsIDEpO1xuICAgICAgICAgIGRlbGltaXRlcnMuc3BsaWNlKF90b1BvcywgMSk7XG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09ICcrJykge1xuICAgICAgICAgIGxpbmVzLnNwbGljZShfdG9Qb3MsIDAsIGNvbnRlbnQpO1xuICAgICAgICAgIGRlbGltaXRlcnMuc3BsaWNlKF90b1BvcywgMCwgZGVsaW1pdGVyKTtcbiAgICAgICAgICBfdG9Qb3MrKztcbiAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09ICdcXFxcJykge1xuICAgICAgICAgIHZhciBwcmV2aW91c09wZXJhdGlvbiA9IF9odW5rLmxpbmVzW2ogLSAxXSA/IF9odW5rLmxpbmVzW2ogLSAxXVswXSA6IG51bGw7XG5cbiAgICAgICAgICBpZiAocHJldmlvdXNPcGVyYXRpb24gPT09ICcrJykge1xuICAgICAgICAgICAgcmVtb3ZlRU9GTkwgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSBpZiAocHJldmlvdXNPcGVyYXRpb24gPT09ICctJykge1xuICAgICAgICAgICAgYWRkRU9GTkwgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gLy8gSGFuZGxlIEVPRk5MIGluc2VydGlvbi9yZW1vdmFsXG5cblxuICAgIGlmIChyZW1vdmVFT0ZOTCkge1xuICAgICAgd2hpbGUgKCFsaW5lc1tsaW5lcy5sZW5ndGggLSAxXSkge1xuICAgICAgICBsaW5lcy5wb3AoKTtcbiAgICAgICAgZGVsaW1pdGVycy5wb3AoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFkZEVPRk5MKSB7XG4gICAgICBsaW5lcy5wdXNoKCcnKTtcbiAgICAgIGRlbGltaXRlcnMucHVzaCgnXFxuJyk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IGxpbmVzLmxlbmd0aCAtIDE7IF9rKyspIHtcbiAgICAgIGxpbmVzW19rXSA9IGxpbmVzW19rXSArIGRlbGltaXRlcnNbX2tdO1xuICAgIH1cblxuICAgIHJldHVybiBsaW5lcy5qb2luKCcnKTtcbiAgfSAvLyBXcmFwcGVyIHRoYXQgc3VwcG9ydHMgbXVsdGlwbGUgZmlsZSBwYXRjaGVzIHZpYSBjYWxsYmFja3MuXG5cbiAgZnVuY3Rpb24gYXBwbHlQYXRjaGVzKHVuaURpZmYsIG9wdGlvbnMpIHtcbiAgICBpZiAodHlwZW9mIHVuaURpZmYgPT09ICdzdHJpbmcnKSB7XG4gICAgICB1bmlEaWZmID0gcGFyc2VQYXRjaCh1bmlEaWZmKTtcbiAgICB9XG5cbiAgICB2YXIgY3VycmVudEluZGV4ID0gMDtcblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NJbmRleCgpIHtcbiAgICAgIHZhciBpbmRleCA9IHVuaURpZmZbY3VycmVudEluZGV4KytdO1xuXG4gICAgICBpZiAoIWluZGV4KSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLmNvbXBsZXRlKCk7XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMubG9hZEZpbGUoaW5kZXgsIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJldHVybiBvcHRpb25zLmNvbXBsZXRlKGVycik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdXBkYXRlZENvbnRlbnQgPSBhcHBseVBhdGNoKGRhdGEsIGluZGV4LCBvcHRpb25zKTtcbiAgICAgICAgb3B0aW9ucy5wYXRjaGVkKGluZGV4LCB1cGRhdGVkQ29udGVudCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmNvbXBsZXRlKGVycik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcHJvY2Vzc0luZGV4KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJvY2Vzc0luZGV4KCk7XG4gIH1cblxuICBmdW5jdGlvbiBzdHJ1Y3R1cmVkUGF0Y2gob2xkRmlsZU5hbWUsIG5ld0ZpbGVOYW1lLCBvbGRTdHIsIG5ld1N0ciwgb2xkSGVhZGVyLCBuZXdIZWFkZXIsIG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuY29udGV4dCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIG9wdGlvbnMuY29udGV4dCA9IDQ7XG4gICAgfVxuXG4gICAgdmFyIGRpZmYgPSBkaWZmTGluZXMob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpO1xuICAgIGRpZmYucHVzaCh7XG4gICAgICB2YWx1ZTogJycsXG4gICAgICBsaW5lczogW11cbiAgICB9KTsgLy8gQXBwZW5kIGFuIGVtcHR5IHZhbHVlIHRvIG1ha2UgY2xlYW51cCBlYXNpZXJcblxuICAgIGZ1bmN0aW9uIGNvbnRleHRMaW5lcyhsaW5lcykge1xuICAgICAgcmV0dXJuIGxpbmVzLm1hcChmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgICAgcmV0dXJuICcgJyArIGVudHJ5O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyIGh1bmtzID0gW107XG4gICAgdmFyIG9sZFJhbmdlU3RhcnQgPSAwLFxuICAgICAgICBuZXdSYW5nZVN0YXJ0ID0gMCxcbiAgICAgICAgY3VyUmFuZ2UgPSBbXSxcbiAgICAgICAgb2xkTGluZSA9IDEsXG4gICAgICAgIG5ld0xpbmUgPSAxO1xuXG4gICAgdmFyIF9sb29wID0gZnVuY3Rpb24gX2xvb3AoaSkge1xuICAgICAgdmFyIGN1cnJlbnQgPSBkaWZmW2ldLFxuICAgICAgICAgIGxpbmVzID0gY3VycmVudC5saW5lcyB8fCBjdXJyZW50LnZhbHVlLnJlcGxhY2UoL1xcbiQvLCAnJykuc3BsaXQoJ1xcbicpO1xuICAgICAgY3VycmVudC5saW5lcyA9IGxpbmVzO1xuXG4gICAgICBpZiAoY3VycmVudC5hZGRlZCB8fCBjdXJyZW50LnJlbW92ZWQpIHtcbiAgICAgICAgdmFyIF9jdXJSYW5nZTtcblxuICAgICAgICAvLyBJZiB3ZSBoYXZlIHByZXZpb3VzIGNvbnRleHQsIHN0YXJ0IHdpdGggdGhhdFxuICAgICAgICBpZiAoIW9sZFJhbmdlU3RhcnQpIHtcbiAgICAgICAgICB2YXIgcHJldiA9IGRpZmZbaSAtIDFdO1xuICAgICAgICAgIG9sZFJhbmdlU3RhcnQgPSBvbGRMaW5lO1xuICAgICAgICAgIG5ld1JhbmdlU3RhcnQgPSBuZXdMaW5lO1xuXG4gICAgICAgICAgaWYgKHByZXYpIHtcbiAgICAgICAgICAgIGN1clJhbmdlID0gb3B0aW9ucy5jb250ZXh0ID4gMCA/IGNvbnRleHRMaW5lcyhwcmV2LmxpbmVzLnNsaWNlKC1vcHRpb25zLmNvbnRleHQpKSA6IFtdO1xuICAgICAgICAgICAgb2xkUmFuZ2VTdGFydCAtPSBjdXJSYW5nZS5sZW5ndGg7XG4gICAgICAgICAgICBuZXdSYW5nZVN0YXJ0IC09IGN1clJhbmdlLmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gLy8gT3V0cHV0IG91ciBjaGFuZ2VzXG5cblxuICAgICAgICAoX2N1clJhbmdlID0gY3VyUmFuZ2UpLnB1c2guYXBwbHkoX2N1clJhbmdlLCBfdG9Db25zdW1hYmxlQXJyYXkobGluZXMubWFwKGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICAgIHJldHVybiAoY3VycmVudC5hZGRlZCA/ICcrJyA6ICctJykgKyBlbnRyeTtcbiAgICAgICAgfSkpKTsgLy8gVHJhY2sgdGhlIHVwZGF0ZWQgZmlsZSBwb3NpdGlvblxuXG5cbiAgICAgICAgaWYgKGN1cnJlbnQuYWRkZWQpIHtcbiAgICAgICAgICBuZXdMaW5lICs9IGxpbmVzLmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvbGRMaW5lICs9IGxpbmVzLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSWRlbnRpY2FsIGNvbnRleHQgbGluZXMuIFRyYWNrIGxpbmUgY2hhbmdlc1xuICAgICAgICBpZiAob2xkUmFuZ2VTdGFydCkge1xuICAgICAgICAgIC8vIENsb3NlIG91dCBhbnkgY2hhbmdlcyB0aGF0IGhhdmUgYmVlbiBvdXRwdXQgKG9yIGpvaW4gb3ZlcmxhcHBpbmcpXG4gICAgICAgICAgaWYgKGxpbmVzLmxlbmd0aCA8PSBvcHRpb25zLmNvbnRleHQgKiAyICYmIGkgPCBkaWZmLmxlbmd0aCAtIDIpIHtcbiAgICAgICAgICAgIHZhciBfY3VyUmFuZ2UyO1xuXG4gICAgICAgICAgICAvLyBPdmVybGFwcGluZ1xuICAgICAgICAgICAgKF9jdXJSYW5nZTIgPSBjdXJSYW5nZSkucHVzaC5hcHBseShfY3VyUmFuZ2UyLCBfdG9Db25zdW1hYmxlQXJyYXkoY29udGV4dExpbmVzKGxpbmVzKSkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgX2N1clJhbmdlMztcblxuICAgICAgICAgICAgLy8gZW5kIHRoZSByYW5nZSBhbmQgb3V0cHV0XG4gICAgICAgICAgICB2YXIgY29udGV4dFNpemUgPSBNYXRoLm1pbihsaW5lcy5sZW5ndGgsIG9wdGlvbnMuY29udGV4dCk7XG5cbiAgICAgICAgICAgIChfY3VyUmFuZ2UzID0gY3VyUmFuZ2UpLnB1c2guYXBwbHkoX2N1clJhbmdlMywgX3RvQ29uc3VtYWJsZUFycmF5KGNvbnRleHRMaW5lcyhsaW5lcy5zbGljZSgwLCBjb250ZXh0U2l6ZSkpKSk7XG5cbiAgICAgICAgICAgIHZhciBodW5rID0ge1xuICAgICAgICAgICAgICBvbGRTdGFydDogb2xkUmFuZ2VTdGFydCxcbiAgICAgICAgICAgICAgb2xkTGluZXM6IG9sZExpbmUgLSBvbGRSYW5nZVN0YXJ0ICsgY29udGV4dFNpemUsXG4gICAgICAgICAgICAgIG5ld1N0YXJ0OiBuZXdSYW5nZVN0YXJ0LFxuICAgICAgICAgICAgICBuZXdMaW5lczogbmV3TGluZSAtIG5ld1JhbmdlU3RhcnQgKyBjb250ZXh0U2l6ZSxcbiAgICAgICAgICAgICAgbGluZXM6IGN1clJhbmdlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoaSA+PSBkaWZmLmxlbmd0aCAtIDIgJiYgbGluZXMubGVuZ3RoIDw9IG9wdGlvbnMuY29udGV4dCkge1xuICAgICAgICAgICAgICAvLyBFT0YgaXMgaW5zaWRlIHRoaXMgaHVua1xuICAgICAgICAgICAgICB2YXIgb2xkRU9GTmV3bGluZSA9IC9cXG4kLy50ZXN0KG9sZFN0cik7XG4gICAgICAgICAgICAgIHZhciBuZXdFT0ZOZXdsaW5lID0gL1xcbiQvLnRlc3QobmV3U3RyKTtcbiAgICAgICAgICAgICAgdmFyIG5vTmxCZWZvcmVBZGRzID0gbGluZXMubGVuZ3RoID09IDAgJiYgY3VyUmFuZ2UubGVuZ3RoID4gaHVuay5vbGRMaW5lcztcblxuICAgICAgICAgICAgICBpZiAoIW9sZEVPRk5ld2xpbmUgJiYgbm9ObEJlZm9yZUFkZHMpIHtcbiAgICAgICAgICAgICAgICAvLyBzcGVjaWFsIGNhc2U6IG9sZCBoYXMgbm8gZW9sIGFuZCBubyB0cmFpbGluZyBjb250ZXh0OyBuby1ubCBjYW4gZW5kIHVwIGJlZm9yZSBhZGRzXG4gICAgICAgICAgICAgICAgY3VyUmFuZ2Uuc3BsaWNlKGh1bmsub2xkTGluZXMsIDAsICdcXFxcIE5vIG5ld2xpbmUgYXQgZW5kIG9mIGZpbGUnKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICghb2xkRU9GTmV3bGluZSAmJiAhbm9ObEJlZm9yZUFkZHMgfHwgIW5ld0VPRk5ld2xpbmUpIHtcbiAgICAgICAgICAgICAgICBjdXJSYW5nZS5wdXNoKCdcXFxcIE5vIG5ld2xpbmUgYXQgZW5kIG9mIGZpbGUnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBodW5rcy5wdXNoKGh1bmspO1xuICAgICAgICAgICAgb2xkUmFuZ2VTdGFydCA9IDA7XG4gICAgICAgICAgICBuZXdSYW5nZVN0YXJ0ID0gMDtcbiAgICAgICAgICAgIGN1clJhbmdlID0gW107XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgb2xkTGluZSArPSBsaW5lcy5sZW5ndGg7XG4gICAgICAgIG5ld0xpbmUgKz0gbGluZXMubGVuZ3RoO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRpZmYubGVuZ3RoOyBpKyspIHtcbiAgICAgIF9sb29wKGkpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBvbGRGaWxlTmFtZTogb2xkRmlsZU5hbWUsXG4gICAgICBuZXdGaWxlTmFtZTogbmV3RmlsZU5hbWUsXG4gICAgICBvbGRIZWFkZXI6IG9sZEhlYWRlcixcbiAgICAgIG5ld0hlYWRlcjogbmV3SGVhZGVyLFxuICAgICAgaHVua3M6IGh1bmtzXG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGVUd29GaWxlc1BhdGNoKG9sZEZpbGVOYW1lLCBuZXdGaWxlTmFtZSwgb2xkU3RyLCBuZXdTdHIsIG9sZEhlYWRlciwgbmV3SGVhZGVyLCBvcHRpb25zKSB7XG4gICAgdmFyIGRpZmYgPSBzdHJ1Y3R1cmVkUGF0Y2gob2xkRmlsZU5hbWUsIG5ld0ZpbGVOYW1lLCBvbGRTdHIsIG5ld1N0ciwgb2xkSGVhZGVyLCBuZXdIZWFkZXIsIG9wdGlvbnMpO1xuICAgIHZhciByZXQgPSBbXTtcblxuICAgIGlmIChvbGRGaWxlTmFtZSA9PSBuZXdGaWxlTmFtZSkge1xuICAgICAgcmV0LnB1c2goJ0luZGV4OiAnICsgb2xkRmlsZU5hbWUpO1xuICAgIH1cblxuICAgIHJldC5wdXNoKCc9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Jyk7XG4gICAgcmV0LnB1c2goJy0tLSAnICsgZGlmZi5vbGRGaWxlTmFtZSArICh0eXBlb2YgZGlmZi5vbGRIZWFkZXIgPT09ICd1bmRlZmluZWQnID8gJycgOiAnXFx0JyArIGRpZmYub2xkSGVhZGVyKSk7XG4gICAgcmV0LnB1c2goJysrKyAnICsgZGlmZi5uZXdGaWxlTmFtZSArICh0eXBlb2YgZGlmZi5uZXdIZWFkZXIgPT09ICd1bmRlZmluZWQnID8gJycgOiAnXFx0JyArIGRpZmYubmV3SGVhZGVyKSk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRpZmYuaHVua3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBodW5rID0gZGlmZi5odW5rc1tpXTtcbiAgICAgIHJldC5wdXNoKCdAQCAtJyArIGh1bmsub2xkU3RhcnQgKyAnLCcgKyBodW5rLm9sZExpbmVzICsgJyArJyArIGh1bmsubmV3U3RhcnQgKyAnLCcgKyBodW5rLm5ld0xpbmVzICsgJyBAQCcpO1xuICAgICAgcmV0LnB1c2guYXBwbHkocmV0LCBodW5rLmxpbmVzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0LmpvaW4oJ1xcbicpICsgJ1xcbic7XG4gIH1cbiAgZnVuY3Rpb24gY3JlYXRlUGF0Y2goZmlsZU5hbWUsIG9sZFN0ciwgbmV3U3RyLCBvbGRIZWFkZXIsIG5ld0hlYWRlciwgb3B0aW9ucykge1xuICAgIHJldHVybiBjcmVhdGVUd29GaWxlc1BhdGNoKGZpbGVOYW1lLCBmaWxlTmFtZSwgb2xkU3RyLCBuZXdTdHIsIG9sZEhlYWRlciwgbmV3SGVhZGVyLCBvcHRpb25zKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFycmF5RXF1YWwoYSwgYikge1xuICAgIGlmIChhLmxlbmd0aCAhPT0gYi5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXlTdGFydHNXaXRoKGEsIGIpO1xuICB9XG4gIGZ1bmN0aW9uIGFycmF5U3RhcnRzV2l0aChhcnJheSwgc3RhcnQpIHtcbiAgICBpZiAoc3RhcnQubGVuZ3RoID4gYXJyYXkubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGFydC5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHN0YXJ0W2ldICE9PSBhcnJheVtpXSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBjYWxjTGluZUNvdW50KGh1bmspIHtcbiAgICB2YXIgX2NhbGNPbGROZXdMaW5lQ291bnQgPSBjYWxjT2xkTmV3TGluZUNvdW50KGh1bmsubGluZXMpLFxuICAgICAgICBvbGRMaW5lcyA9IF9jYWxjT2xkTmV3TGluZUNvdW50Lm9sZExpbmVzLFxuICAgICAgICBuZXdMaW5lcyA9IF9jYWxjT2xkTmV3TGluZUNvdW50Lm5ld0xpbmVzO1xuXG4gICAgaWYgKG9sZExpbmVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGh1bmsub2xkTGluZXMgPSBvbGRMaW5lcztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGh1bmsub2xkTGluZXM7XG4gICAgfVxuXG4gICAgaWYgKG5ld0xpbmVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGh1bmsubmV3TGluZXMgPSBuZXdMaW5lcztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGh1bmsubmV3TGluZXM7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG1lcmdlKG1pbmUsIHRoZWlycywgYmFzZSkge1xuICAgIG1pbmUgPSBsb2FkUGF0Y2gobWluZSwgYmFzZSk7XG4gICAgdGhlaXJzID0gbG9hZFBhdGNoKHRoZWlycywgYmFzZSk7XG4gICAgdmFyIHJldCA9IHt9OyAvLyBGb3IgaW5kZXggd2UganVzdCBsZXQgaXQgcGFzcyB0aHJvdWdoIGFzIGl0IGRvZXNuJ3QgaGF2ZSBhbnkgbmVjZXNzYXJ5IG1lYW5pbmcuXG4gICAgLy8gTGVhdmluZyBzYW5pdHkgY2hlY2tzIG9uIHRoaXMgdG8gdGhlIEFQSSBjb25zdW1lciB0aGF0IG1heSBrbm93IG1vcmUgYWJvdXQgdGhlXG4gICAgLy8gbWVhbmluZyBpbiB0aGVpciBvd24gY29udGV4dC5cblxuICAgIGlmIChtaW5lLmluZGV4IHx8IHRoZWlycy5pbmRleCkge1xuICAgICAgcmV0LmluZGV4ID0gbWluZS5pbmRleCB8fCB0aGVpcnMuaW5kZXg7XG4gICAgfVxuXG4gICAgaWYgKG1pbmUubmV3RmlsZU5hbWUgfHwgdGhlaXJzLm5ld0ZpbGVOYW1lKSB7XG4gICAgICBpZiAoIWZpbGVOYW1lQ2hhbmdlZChtaW5lKSkge1xuICAgICAgICAvLyBObyBoZWFkZXIgb3Igbm8gY2hhbmdlIGluIG91cnMsIHVzZSB0aGVpcnMgKGFuZCBvdXJzIGlmIHRoZWlycyBkb2VzIG5vdCBleGlzdClcbiAgICAgICAgcmV0Lm9sZEZpbGVOYW1lID0gdGhlaXJzLm9sZEZpbGVOYW1lIHx8IG1pbmUub2xkRmlsZU5hbWU7XG4gICAgICAgIHJldC5uZXdGaWxlTmFtZSA9IHRoZWlycy5uZXdGaWxlTmFtZSB8fCBtaW5lLm5ld0ZpbGVOYW1lO1xuICAgICAgICByZXQub2xkSGVhZGVyID0gdGhlaXJzLm9sZEhlYWRlciB8fCBtaW5lLm9sZEhlYWRlcjtcbiAgICAgICAgcmV0Lm5ld0hlYWRlciA9IHRoZWlycy5uZXdIZWFkZXIgfHwgbWluZS5uZXdIZWFkZXI7XG4gICAgICB9IGVsc2UgaWYgKCFmaWxlTmFtZUNoYW5nZWQodGhlaXJzKSkge1xuICAgICAgICAvLyBObyBoZWFkZXIgb3Igbm8gY2hhbmdlIGluIHRoZWlycywgdXNlIG91cnNcbiAgICAgICAgcmV0Lm9sZEZpbGVOYW1lID0gbWluZS5vbGRGaWxlTmFtZTtcbiAgICAgICAgcmV0Lm5ld0ZpbGVOYW1lID0gbWluZS5uZXdGaWxlTmFtZTtcbiAgICAgICAgcmV0Lm9sZEhlYWRlciA9IG1pbmUub2xkSGVhZGVyO1xuICAgICAgICByZXQubmV3SGVhZGVyID0gbWluZS5uZXdIZWFkZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBCb3RoIGNoYW5nZWQuLi4gZmlndXJlIGl0IG91dFxuICAgICAgICByZXQub2xkRmlsZU5hbWUgPSBzZWxlY3RGaWVsZChyZXQsIG1pbmUub2xkRmlsZU5hbWUsIHRoZWlycy5vbGRGaWxlTmFtZSk7XG4gICAgICAgIHJldC5uZXdGaWxlTmFtZSA9IHNlbGVjdEZpZWxkKHJldCwgbWluZS5uZXdGaWxlTmFtZSwgdGhlaXJzLm5ld0ZpbGVOYW1lKTtcbiAgICAgICAgcmV0Lm9sZEhlYWRlciA9IHNlbGVjdEZpZWxkKHJldCwgbWluZS5vbGRIZWFkZXIsIHRoZWlycy5vbGRIZWFkZXIpO1xuICAgICAgICByZXQubmV3SGVhZGVyID0gc2VsZWN0RmllbGQocmV0LCBtaW5lLm5ld0hlYWRlciwgdGhlaXJzLm5ld0hlYWRlcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0Lmh1bmtzID0gW107XG4gICAgdmFyIG1pbmVJbmRleCA9IDAsXG4gICAgICAgIHRoZWlyc0luZGV4ID0gMCxcbiAgICAgICAgbWluZU9mZnNldCA9IDAsXG4gICAgICAgIHRoZWlyc09mZnNldCA9IDA7XG5cbiAgICB3aGlsZSAobWluZUluZGV4IDwgbWluZS5odW5rcy5sZW5ndGggfHwgdGhlaXJzSW5kZXggPCB0aGVpcnMuaHVua3MubGVuZ3RoKSB7XG4gICAgICB2YXIgbWluZUN1cnJlbnQgPSBtaW5lLmh1bmtzW21pbmVJbmRleF0gfHwge1xuICAgICAgICBvbGRTdGFydDogSW5maW5pdHlcbiAgICAgIH0sXG4gICAgICAgICAgdGhlaXJzQ3VycmVudCA9IHRoZWlycy5odW5rc1t0aGVpcnNJbmRleF0gfHwge1xuICAgICAgICBvbGRTdGFydDogSW5maW5pdHlcbiAgICAgIH07XG5cbiAgICAgIGlmIChodW5rQmVmb3JlKG1pbmVDdXJyZW50LCB0aGVpcnNDdXJyZW50KSkge1xuICAgICAgICAvLyBUaGlzIHBhdGNoIGRvZXMgbm90IG92ZXJsYXAgd2l0aCBhbnkgb2YgdGhlIG90aGVycywgeWF5LlxuICAgICAgICByZXQuaHVua3MucHVzaChjbG9uZUh1bmsobWluZUN1cnJlbnQsIG1pbmVPZmZzZXQpKTtcbiAgICAgICAgbWluZUluZGV4Kys7XG4gICAgICAgIHRoZWlyc09mZnNldCArPSBtaW5lQ3VycmVudC5uZXdMaW5lcyAtIG1pbmVDdXJyZW50Lm9sZExpbmVzO1xuICAgICAgfSBlbHNlIGlmIChodW5rQmVmb3JlKHRoZWlyc0N1cnJlbnQsIG1pbmVDdXJyZW50KSkge1xuICAgICAgICAvLyBUaGlzIHBhdGNoIGRvZXMgbm90IG92ZXJsYXAgd2l0aCBhbnkgb2YgdGhlIG90aGVycywgeWF5LlxuICAgICAgICByZXQuaHVua3MucHVzaChjbG9uZUh1bmsodGhlaXJzQ3VycmVudCwgdGhlaXJzT2Zmc2V0KSk7XG4gICAgICAgIHRoZWlyc0luZGV4Kys7XG4gICAgICAgIG1pbmVPZmZzZXQgKz0gdGhlaXJzQ3VycmVudC5uZXdMaW5lcyAtIHRoZWlyc0N1cnJlbnQub2xkTGluZXM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBPdmVybGFwLCBtZXJnZSBhcyBiZXN0IHdlIGNhblxuICAgICAgICB2YXIgbWVyZ2VkSHVuayA9IHtcbiAgICAgICAgICBvbGRTdGFydDogTWF0aC5taW4obWluZUN1cnJlbnQub2xkU3RhcnQsIHRoZWlyc0N1cnJlbnQub2xkU3RhcnQpLFxuICAgICAgICAgIG9sZExpbmVzOiAwLFxuICAgICAgICAgIG5ld1N0YXJ0OiBNYXRoLm1pbihtaW5lQ3VycmVudC5uZXdTdGFydCArIG1pbmVPZmZzZXQsIHRoZWlyc0N1cnJlbnQub2xkU3RhcnQgKyB0aGVpcnNPZmZzZXQpLFxuICAgICAgICAgIG5ld0xpbmVzOiAwLFxuICAgICAgICAgIGxpbmVzOiBbXVxuICAgICAgICB9O1xuICAgICAgICBtZXJnZUxpbmVzKG1lcmdlZEh1bmssIG1pbmVDdXJyZW50Lm9sZFN0YXJ0LCBtaW5lQ3VycmVudC5saW5lcywgdGhlaXJzQ3VycmVudC5vbGRTdGFydCwgdGhlaXJzQ3VycmVudC5saW5lcyk7XG4gICAgICAgIHRoZWlyc0luZGV4Kys7XG4gICAgICAgIG1pbmVJbmRleCsrO1xuICAgICAgICByZXQuaHVua3MucHVzaChtZXJnZWRIdW5rKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgZnVuY3Rpb24gbG9hZFBhdGNoKHBhcmFtLCBiYXNlKSB7XG4gICAgaWYgKHR5cGVvZiBwYXJhbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmICgvXkBAL20udGVzdChwYXJhbSkgfHwgL15JbmRleDovbS50ZXN0KHBhcmFtKSkge1xuICAgICAgICByZXR1cm4gcGFyc2VQYXRjaChwYXJhbSlbMF07XG4gICAgICB9XG5cbiAgICAgIGlmICghYmFzZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ011c3QgcHJvdmlkZSBhIGJhc2UgcmVmZXJlbmNlIG9yIHBhc3MgaW4gYSBwYXRjaCcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RydWN0dXJlZFBhdGNoKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBiYXNlLCBwYXJhbSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmFtO1xuICB9XG5cbiAgZnVuY3Rpb24gZmlsZU5hbWVDaGFuZ2VkKHBhdGNoKSB7XG4gICAgcmV0dXJuIHBhdGNoLm5ld0ZpbGVOYW1lICYmIHBhdGNoLm5ld0ZpbGVOYW1lICE9PSBwYXRjaC5vbGRGaWxlTmFtZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNlbGVjdEZpZWxkKGluZGV4LCBtaW5lLCB0aGVpcnMpIHtcbiAgICBpZiAobWluZSA9PT0gdGhlaXJzKSB7XG4gICAgICByZXR1cm4gbWluZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5kZXguY29uZmxpY3QgPSB0cnVlO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbWluZTogbWluZSxcbiAgICAgICAgdGhlaXJzOiB0aGVpcnNcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaHVua0JlZm9yZSh0ZXN0LCBjaGVjaykge1xuICAgIHJldHVybiB0ZXN0Lm9sZFN0YXJ0IDwgY2hlY2sub2xkU3RhcnQgJiYgdGVzdC5vbGRTdGFydCArIHRlc3Qub2xkTGluZXMgPCBjaGVjay5vbGRTdGFydDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb25lSHVuayhodW5rLCBvZmZzZXQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb2xkU3RhcnQ6IGh1bmsub2xkU3RhcnQsXG4gICAgICBvbGRMaW5lczogaHVuay5vbGRMaW5lcyxcbiAgICAgIG5ld1N0YXJ0OiBodW5rLm5ld1N0YXJ0ICsgb2Zmc2V0LFxuICAgICAgbmV3TGluZXM6IGh1bmsubmV3TGluZXMsXG4gICAgICBsaW5lczogaHVuay5saW5lc1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBtZXJnZUxpbmVzKGh1bmssIG1pbmVPZmZzZXQsIG1pbmVMaW5lcywgdGhlaXJPZmZzZXQsIHRoZWlyTGluZXMpIHtcbiAgICAvLyBUaGlzIHdpbGwgZ2VuZXJhbGx5IHJlc3VsdCBpbiBhIGNvbmZsaWN0ZWQgaHVuaywgYnV0IHRoZXJlIGFyZSBjYXNlcyB3aGVyZSB0aGUgY29udGV4dFxuICAgIC8vIGlzIHRoZSBvbmx5IG92ZXJsYXAgd2hlcmUgd2UgY2FuIHN1Y2Nlc3NmdWxseSBtZXJnZSB0aGUgY29udGVudCBoZXJlLlxuICAgIHZhciBtaW5lID0ge1xuICAgICAgb2Zmc2V0OiBtaW5lT2Zmc2V0LFxuICAgICAgbGluZXM6IG1pbmVMaW5lcyxcbiAgICAgIGluZGV4OiAwXG4gICAgfSxcbiAgICAgICAgdGhlaXIgPSB7XG4gICAgICBvZmZzZXQ6IHRoZWlyT2Zmc2V0LFxuICAgICAgbGluZXM6IHRoZWlyTGluZXMsXG4gICAgICBpbmRleDogMFxuICAgIH07IC8vIEhhbmRsZSBhbnkgbGVhZGluZyBjb250ZW50XG5cbiAgICBpbnNlcnRMZWFkaW5nKGh1bmssIG1pbmUsIHRoZWlyKTtcbiAgICBpbnNlcnRMZWFkaW5nKGh1bmssIHRoZWlyLCBtaW5lKTsgLy8gTm93IGluIHRoZSBvdmVybGFwIGNvbnRlbnQuIFNjYW4gdGhyb3VnaCBhbmQgc2VsZWN0IHRoZSBiZXN0IGNoYW5nZXMgZnJvbSBlYWNoLlxuXG4gICAgd2hpbGUgKG1pbmUuaW5kZXggPCBtaW5lLmxpbmVzLmxlbmd0aCAmJiB0aGVpci5pbmRleCA8IHRoZWlyLmxpbmVzLmxlbmd0aCkge1xuICAgICAgdmFyIG1pbmVDdXJyZW50ID0gbWluZS5saW5lc1ttaW5lLmluZGV4XSxcbiAgICAgICAgICB0aGVpckN1cnJlbnQgPSB0aGVpci5saW5lc1t0aGVpci5pbmRleF07XG5cbiAgICAgIGlmICgobWluZUN1cnJlbnRbMF0gPT09ICctJyB8fCBtaW5lQ3VycmVudFswXSA9PT0gJysnKSAmJiAodGhlaXJDdXJyZW50WzBdID09PSAnLScgfHwgdGhlaXJDdXJyZW50WzBdID09PSAnKycpKSB7XG4gICAgICAgIC8vIEJvdGggbW9kaWZpZWQgLi4uXG4gICAgICAgIG11dHVhbENoYW5nZShodW5rLCBtaW5lLCB0aGVpcik7XG4gICAgICB9IGVsc2UgaWYgKG1pbmVDdXJyZW50WzBdID09PSAnKycgJiYgdGhlaXJDdXJyZW50WzBdID09PSAnICcpIHtcbiAgICAgICAgdmFyIF9odW5rJGxpbmVzO1xuXG4gICAgICAgIC8vIE1pbmUgaW5zZXJ0ZWRcbiAgICAgICAgKF9odW5rJGxpbmVzID0gaHVuay5saW5lcykucHVzaC5hcHBseShfaHVuayRsaW5lcywgX3RvQ29uc3VtYWJsZUFycmF5KGNvbGxlY3RDaGFuZ2UobWluZSkpKTtcbiAgICAgIH0gZWxzZSBpZiAodGhlaXJDdXJyZW50WzBdID09PSAnKycgJiYgbWluZUN1cnJlbnRbMF0gPT09ICcgJykge1xuICAgICAgICB2YXIgX2h1bmskbGluZXMyO1xuXG4gICAgICAgIC8vIFRoZWlycyBpbnNlcnRlZFxuICAgICAgICAoX2h1bmskbGluZXMyID0gaHVuay5saW5lcykucHVzaC5hcHBseShfaHVuayRsaW5lczIsIF90b0NvbnN1bWFibGVBcnJheShjb2xsZWN0Q2hhbmdlKHRoZWlyKSkpO1xuICAgICAgfSBlbHNlIGlmIChtaW5lQ3VycmVudFswXSA9PT0gJy0nICYmIHRoZWlyQ3VycmVudFswXSA9PT0gJyAnKSB7XG4gICAgICAgIC8vIE1pbmUgcmVtb3ZlZCBvciBlZGl0ZWRcbiAgICAgICAgcmVtb3ZhbChodW5rLCBtaW5lLCB0aGVpcik7XG4gICAgICB9IGVsc2UgaWYgKHRoZWlyQ3VycmVudFswXSA9PT0gJy0nICYmIG1pbmVDdXJyZW50WzBdID09PSAnICcpIHtcbiAgICAgICAgLy8gVGhlaXIgcmVtb3ZlZCBvciBlZGl0ZWRcbiAgICAgICAgcmVtb3ZhbChodW5rLCB0aGVpciwgbWluZSwgdHJ1ZSk7XG4gICAgICB9IGVsc2UgaWYgKG1pbmVDdXJyZW50ID09PSB0aGVpckN1cnJlbnQpIHtcbiAgICAgICAgLy8gQ29udGV4dCBpZGVudGl0eVxuICAgICAgICBodW5rLmxpbmVzLnB1c2gobWluZUN1cnJlbnQpO1xuICAgICAgICBtaW5lLmluZGV4Kys7XG4gICAgICAgIHRoZWlyLmluZGV4Kys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDb250ZXh0IG1pc21hdGNoXG4gICAgICAgIGNvbmZsaWN0KGh1bmssIGNvbGxlY3RDaGFuZ2UobWluZSksIGNvbGxlY3RDaGFuZ2UodGhlaXIpKTtcbiAgICAgIH1cbiAgICB9IC8vIE5vdyBwdXNoIGFueXRoaW5nIHRoYXQgbWF5IGJlIHJlbWFpbmluZ1xuXG5cbiAgICBpbnNlcnRUcmFpbGluZyhodW5rLCBtaW5lKTtcbiAgICBpbnNlcnRUcmFpbGluZyhodW5rLCB0aGVpcik7XG4gICAgY2FsY0xpbmVDb3VudChodW5rKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG11dHVhbENoYW5nZShodW5rLCBtaW5lLCB0aGVpcikge1xuICAgIHZhciBteUNoYW5nZXMgPSBjb2xsZWN0Q2hhbmdlKG1pbmUpLFxuICAgICAgICB0aGVpckNoYW5nZXMgPSBjb2xsZWN0Q2hhbmdlKHRoZWlyKTtcblxuICAgIGlmIChhbGxSZW1vdmVzKG15Q2hhbmdlcykgJiYgYWxsUmVtb3Zlcyh0aGVpckNoYW5nZXMpKSB7XG4gICAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIHJlbW92ZSBjaGFuZ2VzIHRoYXQgYXJlIHN1cGVyc2V0cyBvZiBvbmUgYW5vdGhlclxuICAgICAgaWYgKGFycmF5U3RhcnRzV2l0aChteUNoYW5nZXMsIHRoZWlyQ2hhbmdlcykgJiYgc2tpcFJlbW92ZVN1cGVyc2V0KHRoZWlyLCBteUNoYW5nZXMsIG15Q2hhbmdlcy5sZW5ndGggLSB0aGVpckNoYW5nZXMubGVuZ3RoKSkge1xuICAgICAgICB2YXIgX2h1bmskbGluZXMzO1xuXG4gICAgICAgIChfaHVuayRsaW5lczMgPSBodW5rLmxpbmVzKS5wdXNoLmFwcGx5KF9odW5rJGxpbmVzMywgX3RvQ29uc3VtYWJsZUFycmF5KG15Q2hhbmdlcykpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAoYXJyYXlTdGFydHNXaXRoKHRoZWlyQ2hhbmdlcywgbXlDaGFuZ2VzKSAmJiBza2lwUmVtb3ZlU3VwZXJzZXQobWluZSwgdGhlaXJDaGFuZ2VzLCB0aGVpckNoYW5nZXMubGVuZ3RoIC0gbXlDaGFuZ2VzLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIF9odW5rJGxpbmVzNDtcblxuICAgICAgICAoX2h1bmskbGluZXM0ID0gaHVuay5saW5lcykucHVzaC5hcHBseShfaHVuayRsaW5lczQsIF90b0NvbnN1bWFibGVBcnJheSh0aGVpckNoYW5nZXMpKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChhcnJheUVxdWFsKG15Q2hhbmdlcywgdGhlaXJDaGFuZ2VzKSkge1xuICAgICAgdmFyIF9odW5rJGxpbmVzNTtcblxuICAgICAgKF9odW5rJGxpbmVzNSA9IGh1bmsubGluZXMpLnB1c2guYXBwbHkoX2h1bmskbGluZXM1LCBfdG9Db25zdW1hYmxlQXJyYXkobXlDaGFuZ2VzKSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25mbGljdChodW5rLCBteUNoYW5nZXMsIHRoZWlyQ2hhbmdlcyk7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmFsKGh1bmssIG1pbmUsIHRoZWlyLCBzd2FwKSB7XG4gICAgdmFyIG15Q2hhbmdlcyA9IGNvbGxlY3RDaGFuZ2UobWluZSksXG4gICAgICAgIHRoZWlyQ2hhbmdlcyA9IGNvbGxlY3RDb250ZXh0KHRoZWlyLCBteUNoYW5nZXMpO1xuXG4gICAgaWYgKHRoZWlyQ2hhbmdlcy5tZXJnZWQpIHtcbiAgICAgIHZhciBfaHVuayRsaW5lczY7XG5cbiAgICAgIChfaHVuayRsaW5lczYgPSBodW5rLmxpbmVzKS5wdXNoLmFwcGx5KF9odW5rJGxpbmVzNiwgX3RvQ29uc3VtYWJsZUFycmF5KHRoZWlyQ2hhbmdlcy5tZXJnZWQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uZmxpY3QoaHVuaywgc3dhcCA/IHRoZWlyQ2hhbmdlcyA6IG15Q2hhbmdlcywgc3dhcCA/IG15Q2hhbmdlcyA6IHRoZWlyQ2hhbmdlcyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY29uZmxpY3QoaHVuaywgbWluZSwgdGhlaXIpIHtcbiAgICBodW5rLmNvbmZsaWN0ID0gdHJ1ZTtcbiAgICBodW5rLmxpbmVzLnB1c2goe1xuICAgICAgY29uZmxpY3Q6IHRydWUsXG4gICAgICBtaW5lOiBtaW5lLFxuICAgICAgdGhlaXJzOiB0aGVpclxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5zZXJ0TGVhZGluZyhodW5rLCBpbnNlcnQsIHRoZWlyKSB7XG4gICAgd2hpbGUgKGluc2VydC5vZmZzZXQgPCB0aGVpci5vZmZzZXQgJiYgaW5zZXJ0LmluZGV4IDwgaW5zZXJ0LmxpbmVzLmxlbmd0aCkge1xuICAgICAgdmFyIGxpbmUgPSBpbnNlcnQubGluZXNbaW5zZXJ0LmluZGV4KytdO1xuICAgICAgaHVuay5saW5lcy5wdXNoKGxpbmUpO1xuICAgICAgaW5zZXJ0Lm9mZnNldCsrO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluc2VydFRyYWlsaW5nKGh1bmssIGluc2VydCkge1xuICAgIHdoaWxlIChpbnNlcnQuaW5kZXggPCBpbnNlcnQubGluZXMubGVuZ3RoKSB7XG4gICAgICB2YXIgbGluZSA9IGluc2VydC5saW5lc1tpbnNlcnQuaW5kZXgrK107XG4gICAgICBodW5rLmxpbmVzLnB1c2gobGluZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY29sbGVjdENoYW5nZShzdGF0ZSkge1xuICAgIHZhciByZXQgPSBbXSxcbiAgICAgICAgb3BlcmF0aW9uID0gc3RhdGUubGluZXNbc3RhdGUuaW5kZXhdWzBdO1xuXG4gICAgd2hpbGUgKHN0YXRlLmluZGV4IDwgc3RhdGUubGluZXMubGVuZ3RoKSB7XG4gICAgICB2YXIgbGluZSA9IHN0YXRlLmxpbmVzW3N0YXRlLmluZGV4XTsgLy8gR3JvdXAgYWRkaXRpb25zIHRoYXQgYXJlIGltbWVkaWF0ZWx5IGFmdGVyIHN1YnRyYWN0aW9ucyBhbmQgdHJlYXQgdGhlbSBhcyBvbmUgXCJhdG9taWNcIiBtb2RpZnkgY2hhbmdlLlxuXG4gICAgICBpZiAob3BlcmF0aW9uID09PSAnLScgJiYgbGluZVswXSA9PT0gJysnKSB7XG4gICAgICAgIG9wZXJhdGlvbiA9ICcrJztcbiAgICAgIH1cblxuICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gbGluZVswXSkge1xuICAgICAgICByZXQucHVzaChsaW5lKTtcbiAgICAgICAgc3RhdGUuaW5kZXgrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICBmdW5jdGlvbiBjb2xsZWN0Q29udGV4dChzdGF0ZSwgbWF0Y2hDaGFuZ2VzKSB7XG4gICAgdmFyIGNoYW5nZXMgPSBbXSxcbiAgICAgICAgbWVyZ2VkID0gW10sXG4gICAgICAgIG1hdGNoSW5kZXggPSAwLFxuICAgICAgICBjb250ZXh0Q2hhbmdlcyA9IGZhbHNlLFxuICAgICAgICBjb25mbGljdGVkID0gZmFsc2U7XG5cbiAgICB3aGlsZSAobWF0Y2hJbmRleCA8IG1hdGNoQ2hhbmdlcy5sZW5ndGggJiYgc3RhdGUuaW5kZXggPCBzdGF0ZS5saW5lcy5sZW5ndGgpIHtcbiAgICAgIHZhciBjaGFuZ2UgPSBzdGF0ZS5saW5lc1tzdGF0ZS5pbmRleF0sXG4gICAgICAgICAgbWF0Y2ggPSBtYXRjaENoYW5nZXNbbWF0Y2hJbmRleF07IC8vIE9uY2Ugd2UndmUgaGl0IG91ciBhZGQsIHRoZW4gd2UgYXJlIGRvbmVcblxuICAgICAgaWYgKG1hdGNoWzBdID09PSAnKycpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHRDaGFuZ2VzID0gY29udGV4dENoYW5nZXMgfHwgY2hhbmdlWzBdICE9PSAnICc7XG4gICAgICBtZXJnZWQucHVzaChtYXRjaCk7XG4gICAgICBtYXRjaEluZGV4Kys7IC8vIENvbnN1bWUgYW55IGFkZGl0aW9ucyBpbiB0aGUgb3RoZXIgYmxvY2sgYXMgYSBjb25mbGljdCB0byBhdHRlbXB0XG4gICAgICAvLyB0byBwdWxsIGluIHRoZSByZW1haW5pbmcgY29udGV4dCBhZnRlciB0aGlzXG5cbiAgICAgIGlmIChjaGFuZ2VbMF0gPT09ICcrJykge1xuICAgICAgICBjb25mbGljdGVkID0gdHJ1ZTtcblxuICAgICAgICB3aGlsZSAoY2hhbmdlWzBdID09PSAnKycpIHtcbiAgICAgICAgICBjaGFuZ2VzLnB1c2goY2hhbmdlKTtcbiAgICAgICAgICBjaGFuZ2UgPSBzdGF0ZS5saW5lc1srK3N0YXRlLmluZGV4XTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobWF0Y2guc3Vic3RyKDEpID09PSBjaGFuZ2Uuc3Vic3RyKDEpKSB7XG4gICAgICAgIGNoYW5nZXMucHVzaChjaGFuZ2UpO1xuICAgICAgICBzdGF0ZS5pbmRleCsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uZmxpY3RlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKChtYXRjaENoYW5nZXNbbWF0Y2hJbmRleF0gfHwgJycpWzBdID09PSAnKycgJiYgY29udGV4dENoYW5nZXMpIHtcbiAgICAgIGNvbmZsaWN0ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChjb25mbGljdGVkKSB7XG4gICAgICByZXR1cm4gY2hhbmdlcztcbiAgICB9XG5cbiAgICB3aGlsZSAobWF0Y2hJbmRleCA8IG1hdGNoQ2hhbmdlcy5sZW5ndGgpIHtcbiAgICAgIG1lcmdlZC5wdXNoKG1hdGNoQ2hhbmdlc1ttYXRjaEluZGV4KytdKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgbWVyZ2VkOiBtZXJnZWQsXG4gICAgICBjaGFuZ2VzOiBjaGFuZ2VzXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFsbFJlbW92ZXMoY2hhbmdlcykge1xuICAgIHJldHVybiBjaGFuZ2VzLnJlZHVjZShmdW5jdGlvbiAocHJldiwgY2hhbmdlKSB7XG4gICAgICByZXR1cm4gcHJldiAmJiBjaGFuZ2VbMF0gPT09ICctJztcbiAgICB9LCB0cnVlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNraXBSZW1vdmVTdXBlcnNldChzdGF0ZSwgcmVtb3ZlQ2hhbmdlcywgZGVsdGEpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRlbHRhOyBpKyspIHtcbiAgICAgIHZhciBjaGFuZ2VDb250ZW50ID0gcmVtb3ZlQ2hhbmdlc1tyZW1vdmVDaGFuZ2VzLmxlbmd0aCAtIGRlbHRhICsgaV0uc3Vic3RyKDEpO1xuXG4gICAgICBpZiAoc3RhdGUubGluZXNbc3RhdGUuaW5kZXggKyBpXSAhPT0gJyAnICsgY2hhbmdlQ29udGVudCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGUuaW5kZXggKz0gZGVsdGE7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBjYWxjT2xkTmV3TGluZUNvdW50KGxpbmVzKSB7XG4gICAgdmFyIG9sZExpbmVzID0gMDtcbiAgICB2YXIgbmV3TGluZXMgPSAwO1xuICAgIGxpbmVzLmZvckVhY2goZnVuY3Rpb24gKGxpbmUpIHtcbiAgICAgIGlmICh0eXBlb2YgbGluZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmFyIG15Q291bnQgPSBjYWxjT2xkTmV3TGluZUNvdW50KGxpbmUubWluZSk7XG4gICAgICAgIHZhciB0aGVpckNvdW50ID0gY2FsY09sZE5ld0xpbmVDb3VudChsaW5lLnRoZWlycyk7XG5cbiAgICAgICAgaWYgKG9sZExpbmVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpZiAobXlDb3VudC5vbGRMaW5lcyA9PT0gdGhlaXJDb3VudC5vbGRMaW5lcykge1xuICAgICAgICAgICAgb2xkTGluZXMgKz0gbXlDb3VudC5vbGRMaW5lcztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2xkTGluZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5ld0xpbmVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpZiAobXlDb3VudC5uZXdMaW5lcyA9PT0gdGhlaXJDb3VudC5uZXdMaW5lcykge1xuICAgICAgICAgICAgbmV3TGluZXMgKz0gbXlDb3VudC5uZXdMaW5lcztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3TGluZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobmV3TGluZXMgIT09IHVuZGVmaW5lZCAmJiAobGluZVswXSA9PT0gJysnIHx8IGxpbmVbMF0gPT09ICcgJykpIHtcbiAgICAgICAgICBuZXdMaW5lcysrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9sZExpbmVzICE9PSB1bmRlZmluZWQgJiYgKGxpbmVbMF0gPT09ICctJyB8fCBsaW5lWzBdID09PSAnICcpKSB7XG4gICAgICAgICAgb2xkTGluZXMrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICBvbGRMaW5lczogb2xkTGluZXMsXG4gICAgICBuZXdMaW5lczogbmV3TGluZXNcbiAgICB9O1xuICB9XG5cbiAgLy8gU2VlOiBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvZ29vZ2xlLWRpZmYtbWF0Y2gtcGF0Y2gvd2lraS9BUElcbiAgZnVuY3Rpb24gY29udmVydENoYW5nZXNUb0RNUChjaGFuZ2VzKSB7XG4gICAgdmFyIHJldCA9IFtdLFxuICAgICAgICBjaGFuZ2UsXG4gICAgICAgIG9wZXJhdGlvbjtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY2hhbmdlID0gY2hhbmdlc1tpXTtcblxuICAgICAgaWYgKGNoYW5nZS5hZGRlZCkge1xuICAgICAgICBvcGVyYXRpb24gPSAxO1xuICAgICAgfSBlbHNlIGlmIChjaGFuZ2UucmVtb3ZlZCkge1xuICAgICAgICBvcGVyYXRpb24gPSAtMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wZXJhdGlvbiA9IDA7XG4gICAgICB9XG5cbiAgICAgIHJldC5wdXNoKFtvcGVyYXRpb24sIGNoYW5nZS52YWx1ZV0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICBmdW5jdGlvbiBjb252ZXJ0Q2hhbmdlc1RvWE1MKGNoYW5nZXMpIHtcbiAgICB2YXIgcmV0ID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYW5nZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGFuZ2UgPSBjaGFuZ2VzW2ldO1xuXG4gICAgICBpZiAoY2hhbmdlLmFkZGVkKSB7XG4gICAgICAgIHJldC5wdXNoKCc8aW5zPicpO1xuICAgICAgfSBlbHNlIGlmIChjaGFuZ2UucmVtb3ZlZCkge1xuICAgICAgICByZXQucHVzaCgnPGRlbD4nKTtcbiAgICAgIH1cblxuICAgICAgcmV0LnB1c2goZXNjYXBlSFRNTChjaGFuZ2UudmFsdWUpKTtcblxuICAgICAgaWYgKGNoYW5nZS5hZGRlZCkge1xuICAgICAgICByZXQucHVzaCgnPC9pbnM+Jyk7XG4gICAgICB9IGVsc2UgaWYgKGNoYW5nZS5yZW1vdmVkKSB7XG4gICAgICAgIHJldC5wdXNoKCc8L2RlbD4nKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmV0LmpvaW4oJycpO1xuICB9XG5cbiAgZnVuY3Rpb24gZXNjYXBlSFRNTChzKSB7XG4gICAgdmFyIG4gPSBzO1xuICAgIG4gPSBuLnJlcGxhY2UoLyYvZywgJyZhbXA7Jyk7XG4gICAgbiA9IG4ucmVwbGFjZSgvPC9nLCAnJmx0OycpO1xuICAgIG4gPSBuLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcbiAgICBuID0gbi5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyk7XG4gICAgcmV0dXJuIG47XG4gIH1cblxuICAvKiBTZWUgTElDRU5TRSBmaWxlIGZvciB0ZXJtcyBvZiB1c2UgKi9cblxuICBleHBvcnRzLkRpZmYgPSBEaWZmO1xuICBleHBvcnRzLmRpZmZDaGFycyA9IGRpZmZDaGFycztcbiAgZXhwb3J0cy5kaWZmV29yZHMgPSBkaWZmV29yZHM7XG4gIGV4cG9ydHMuZGlmZldvcmRzV2l0aFNwYWNlID0gZGlmZldvcmRzV2l0aFNwYWNlO1xuICBleHBvcnRzLmRpZmZMaW5lcyA9IGRpZmZMaW5lcztcbiAgZXhwb3J0cy5kaWZmVHJpbW1lZExpbmVzID0gZGlmZlRyaW1tZWRMaW5lcztcbiAgZXhwb3J0cy5kaWZmU2VudGVuY2VzID0gZGlmZlNlbnRlbmNlcztcbiAgZXhwb3J0cy5kaWZmQ3NzID0gZGlmZkNzcztcbiAgZXhwb3J0cy5kaWZmSnNvbiA9IGRpZmZKc29uO1xuICBleHBvcnRzLmRpZmZBcnJheXMgPSBkaWZmQXJyYXlzO1xuICBleHBvcnRzLnN0cnVjdHVyZWRQYXRjaCA9IHN0cnVjdHVyZWRQYXRjaDtcbiAgZXhwb3J0cy5jcmVhdGVUd29GaWxlc1BhdGNoID0gY3JlYXRlVHdvRmlsZXNQYXRjaDtcbiAgZXhwb3J0cy5jcmVhdGVQYXRjaCA9IGNyZWF0ZVBhdGNoO1xuICBleHBvcnRzLmFwcGx5UGF0Y2ggPSBhcHBseVBhdGNoO1xuICBleHBvcnRzLmFwcGx5UGF0Y2hlcyA9IGFwcGx5UGF0Y2hlcztcbiAgZXhwb3J0cy5wYXJzZVBhdGNoID0gcGFyc2VQYXRjaDtcbiAgZXhwb3J0cy5tZXJnZSA9IG1lcmdlO1xuICBleHBvcnRzLmNvbnZlcnRDaGFuZ2VzVG9ETVAgPSBjb252ZXJ0Q2hhbmdlc1RvRE1QO1xuICBleHBvcnRzLmNvbnZlcnRDaGFuZ2VzVG9YTUwgPSBjb252ZXJ0Q2hhbmdlc1RvWE1MO1xuICBleHBvcnRzLmNhbm9uaWNhbGl6ZSA9IGNhbm9uaWNhbGl6ZTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG59KSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxudmFyIGlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iaikge1xuICBpZiAoIW9iaiB8fCB0b1N0ci5jYWxsKG9iaikgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGhhc093bkNvbnN0cnVjdG9yID0gaGFzT3duLmNhbGwob2JqLCAnY29uc3RydWN0b3InKTtcbiAgdmFyIGhhc0lzUHJvdG90eXBlT2YgPVxuICAgIG9iai5jb25zdHJ1Y3RvciAmJlxuICAgIG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgJiZcbiAgICBoYXNPd24uY2FsbChvYmouY29uc3RydWN0b3IucHJvdG90eXBlLCAnaXNQcm90b3R5cGVPZicpO1xuICAvLyBOb3Qgb3duIGNvbnN0cnVjdG9yIHByb3BlcnR5IG11c3QgYmUgT2JqZWN0XG4gIGlmIChvYmouY29uc3RydWN0b3IgJiYgIWhhc093bkNvbnN0cnVjdG9yICYmICFoYXNJc1Byb3RvdHlwZU9mKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gT3duIHByb3BlcnRpZXMgYXJlIGVudW1lcmF0ZWQgZmlyc3RseSwgc28gdG8gc3BlZWQgdXAsXG4gIC8vIGlmIGxhc3Qgb25lIGlzIG93biwgdGhlbiBhbGwgcHJvcGVydGllcyBhcmUgb3duLlxuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAvKiovXG4gIH1cblxuICByZXR1cm4gdHlwZW9mIGtleSA9PT0gJ3VuZGVmaW5lZCcgfHwgaGFzT3duLmNhbGwob2JqLCBrZXkpO1xufTtcblxuZnVuY3Rpb24gbWVyZ2UoKSB7XG4gIHZhciBpLFxuICAgIHNyYyxcbiAgICBjb3B5LFxuICAgIGNsb25lLFxuICAgIG5hbWUsXG4gICAgcmVzdWx0ID0ge30sXG4gICAgY3VycmVudCA9IG51bGwsXG4gICAgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcblxuICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBjdXJyZW50ID0gYXJndW1lbnRzW2ldO1xuICAgIGlmIChjdXJyZW50ID09IG51bGwpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGZvciAobmFtZSBpbiBjdXJyZW50KSB7XG4gICAgICBzcmMgPSByZXN1bHRbbmFtZV07XG4gICAgICBjb3B5ID0gY3VycmVudFtuYW1lXTtcbiAgICAgIGlmIChyZXN1bHQgIT09IGNvcHkpIHtcbiAgICAgICAgaWYgKGNvcHkgJiYgaXNQbGFpbk9iamVjdChjb3B5KSkge1xuICAgICAgICAgIGNsb25lID0gc3JjICYmIGlzUGxhaW5PYmplY3Qoc3JjKSA/IHNyYyA6IHt9O1xuICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IG1lcmdlKGNsb25lLCBjb3B5KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY29weSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZXN1bHRbbmFtZV0gPSBjb3B5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWVyZ2U7XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbGl0eScpO1xuXG5mdW5jdGlvbiBjaGVja0xldmVsKGl0ZW0sIHNldHRpbmdzKSB7XG4gIHZhciBsZXZlbCA9IGl0ZW0ubGV2ZWw7XG4gIHZhciBsZXZlbFZhbCA9IF8uTEVWRUxTW2xldmVsXSB8fCAwO1xuICB2YXIgcmVwb3J0TGV2ZWwgPSBzZXR0aW5ncy5yZXBvcnRMZXZlbDtcbiAgdmFyIHJlcG9ydExldmVsVmFsID0gXy5MRVZFTFNbcmVwb3J0TGV2ZWxdIHx8IDA7XG5cbiAgaWYgKGxldmVsVmFsIDwgcmVwb3J0TGV2ZWxWYWwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHVzZXJDaGVja0lnbm9yZShsb2dnZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpdGVtLCBzZXR0aW5ncykge1xuICAgIHZhciBpc1VuY2F1Z2h0ID0gISFpdGVtLl9pc1VuY2F1Z2h0O1xuICAgIGRlbGV0ZSBpdGVtLl9pc1VuY2F1Z2h0O1xuICAgIHZhciBhcmdzID0gaXRlbS5fb3JpZ2luYWxBcmdzO1xuICAgIGRlbGV0ZSBpdGVtLl9vcmlnaW5hbEFyZ3M7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24oc2V0dGluZ3Mub25TZW5kQ2FsbGJhY2spKSB7XG4gICAgICAgIHNldHRpbmdzLm9uU2VuZENhbGxiYWNrKGlzVW5jYXVnaHQsIGFyZ3MsIGl0ZW0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHNldHRpbmdzLm9uU2VuZENhbGxiYWNrID0gbnVsbDtcbiAgICAgIGxvZ2dlci5lcnJvcignRXJyb3Igd2hpbGUgY2FsbGluZyBvblNlbmRDYWxsYmFjaywgcmVtb3ZpbmcnLCBlKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGlmIChcbiAgICAgICAgXy5pc0Z1bmN0aW9uKHNldHRpbmdzLmNoZWNrSWdub3JlKSAmJlxuICAgICAgICBzZXR0aW5ncy5jaGVja0lnbm9yZShpc1VuY2F1Z2h0LCBhcmdzLCBpdGVtKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBzZXR0aW5ncy5jaGVja0lnbm9yZSA9IG51bGw7XG4gICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIHdoaWxlIGNhbGxpbmcgY3VzdG9tIGNoZWNrSWdub3JlKCksIHJlbW92aW5nJywgZSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xufVxuXG5mdW5jdGlvbiB1cmxJc05vdEJsb2NrTGlzdGVkKGxvZ2dlcikge1xuICByZXR1cm4gZnVuY3Rpb24gKGl0ZW0sIHNldHRpbmdzKSB7XG4gICAgcmV0dXJuICF1cmxJc09uQUxpc3QoaXRlbSwgc2V0dGluZ3MsICdibG9ja2xpc3QnLCBsb2dnZXIpO1xuICB9O1xufVxuXG5mdW5jdGlvbiB1cmxJc1NhZmVMaXN0ZWQobG9nZ2VyKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaXRlbSwgc2V0dGluZ3MpIHtcbiAgICByZXR1cm4gdXJsSXNPbkFMaXN0KGl0ZW0sIHNldHRpbmdzLCAnc2FmZWxpc3QnLCBsb2dnZXIpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBtYXRjaEZyYW1lcyh0cmFjZSwgbGlzdCwgYmxvY2spIHtcbiAgaWYgKCF0cmFjZSkge1xuICAgIHJldHVybiAhYmxvY2s7XG4gIH1cblxuICB2YXIgZnJhbWVzID0gdHJhY2UuZnJhbWVzO1xuXG4gIGlmICghZnJhbWVzIHx8IGZyYW1lcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gIWJsb2NrO1xuICB9XG5cbiAgdmFyIGZyYW1lLCBmaWxlbmFtZSwgdXJsLCB1cmxSZWdleDtcbiAgdmFyIGxpc3RMZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgdmFyIGZyYW1lTGVuZ3RoID0gZnJhbWVzLmxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmcmFtZUxlbmd0aDsgaSsrKSB7XG4gICAgZnJhbWUgPSBmcmFtZXNbaV07XG4gICAgZmlsZW5hbWUgPSBmcmFtZS5maWxlbmFtZTtcblxuICAgIGlmICghXy5pc1R5cGUoZmlsZW5hbWUsICdzdHJpbmcnKSkge1xuICAgICAgcmV0dXJuICFibG9jaztcbiAgICB9XG5cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGxpc3RMZW5ndGg7IGorKykge1xuICAgICAgdXJsID0gbGlzdFtqXTtcbiAgICAgIHVybFJlZ2V4ID0gbmV3IFJlZ0V4cCh1cmwpO1xuXG4gICAgICBpZiAodXJsUmVnZXgudGVzdChmaWxlbmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gdXJsSXNPbkFMaXN0KGl0ZW0sIHNldHRpbmdzLCBzYWZlT3JCbG9jaywgbG9nZ2VyKSB7XG4gIC8vIHNhZmVsaXN0IGlzIHRoZSBkZWZhdWx0XG4gIHZhciBibG9jayA9IGZhbHNlO1xuICBpZiAoc2FmZU9yQmxvY2sgPT09ICdibG9ja2xpc3QnKSB7XG4gICAgYmxvY2sgPSB0cnVlO1xuICB9XG5cbiAgdmFyIGxpc3QsIHRyYWNlcztcbiAgdHJ5IHtcbiAgICBsaXN0ID0gYmxvY2sgPyBzZXR0aW5ncy5ob3N0QmxvY2tMaXN0IDogc2V0dGluZ3MuaG9zdFNhZmVMaXN0O1xuICAgIHRyYWNlcyA9IF8uZ2V0KGl0ZW0sICdib2R5LnRyYWNlX2NoYWluJykgfHwgW18uZ2V0KGl0ZW0sICdib2R5LnRyYWNlJyldO1xuXG4gICAgLy8gVGhlc2UgdHdvIGNoZWNrcyBhcmUgaW1wb3J0YW50IHRvIGNvbWUgZmlyc3QgYXMgdGhleSBhcmUgZGVmYXVsdHNcbiAgICAvLyBpbiBjYXNlIHRoZSBsaXN0IGlzIG1pc3Npbmcgb3IgdGhlIHRyYWNlIGlzIG1pc3Npbmcgb3Igbm90IHdlbGwtZm9ybWVkXG4gICAgaWYgKCFsaXN0IHx8IGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gIWJsb2NrO1xuICAgIH1cbiAgICBpZiAodHJhY2VzLmxlbmd0aCA9PT0gMCB8fCAhdHJhY2VzWzBdKSB7XG4gICAgICByZXR1cm4gIWJsb2NrO1xuICAgIH1cblxuICAgIHZhciB0cmFjZXNMZW5ndGggPSB0cmFjZXMubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHJhY2VzTGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChtYXRjaEZyYW1lcyh0cmFjZXNbaV0sIGxpc3QsIGJsb2NrKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKFxuICAgIGVcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICApIHtcbiAgICBpZiAoYmxvY2spIHtcbiAgICAgIHNldHRpbmdzLmhvc3RCbG9ja0xpc3QgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXR0aW5ncy5ob3N0U2FmZUxpc3QgPSBudWxsO1xuICAgIH1cbiAgICB2YXIgbGlzdE5hbWUgPSBibG9jayA/ICdob3N0QmxvY2tMaXN0JyA6ICdob3N0U2FmZUxpc3QnO1xuICAgIGxvZ2dlci5lcnJvcihcbiAgICAgIFwiRXJyb3Igd2hpbGUgcmVhZGluZyB5b3VyIGNvbmZpZ3VyYXRpb24ncyBcIiArXG4gICAgICAgIGxpc3ROYW1lICtcbiAgICAgICAgJyBvcHRpb24uIFJlbW92aW5nIGN1c3RvbSAnICtcbiAgICAgICAgbGlzdE5hbWUgK1xuICAgICAgICAnLicsXG4gICAgICBlLFxuICAgICk7XG4gICAgcmV0dXJuICFibG9jaztcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIG1lc3NhZ2VJc0lnbm9yZWQobG9nZ2VyKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaXRlbSwgc2V0dGluZ3MpIHtcbiAgICB2YXIgaSwgaiwgaWdub3JlZE1lc3NhZ2VzLCBsZW4sIG1lc3NhZ2VJc0lnbm9yZWQsIHJJZ25vcmVkTWVzc2FnZSwgbWVzc2FnZXM7XG5cbiAgICB0cnkge1xuICAgICAgbWVzc2FnZUlzSWdub3JlZCA9IGZhbHNlO1xuICAgICAgaWdub3JlZE1lc3NhZ2VzID0gc2V0dGluZ3MuaWdub3JlZE1lc3NhZ2VzO1xuXG4gICAgICBpZiAoIWlnbm9yZWRNZXNzYWdlcyB8fCBpZ25vcmVkTWVzc2FnZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBtZXNzYWdlcyA9IG1lc3NhZ2VzRnJvbUl0ZW0oaXRlbSk7XG5cbiAgICAgIGlmIChtZXNzYWdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGxlbiA9IGlnbm9yZWRNZXNzYWdlcy5sZW5ndGg7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgcklnbm9yZWRNZXNzYWdlID0gbmV3IFJlZ0V4cChpZ25vcmVkTWVzc2FnZXNbaV0sICdnaScpO1xuXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBtZXNzYWdlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIG1lc3NhZ2VJc0lnbm9yZWQgPSBySWdub3JlZE1lc3NhZ2UudGVzdChtZXNzYWdlc1tqXSk7XG5cbiAgICAgICAgICBpZiAobWVzc2FnZUlzSWdub3JlZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKFxuICAgICAgZVxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICApIHtcbiAgICAgIHNldHRpbmdzLmlnbm9yZWRNZXNzYWdlcyA9IG51bGw7XG4gICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgIFwiRXJyb3Igd2hpbGUgcmVhZGluZyB5b3VyIGNvbmZpZ3VyYXRpb24ncyBpZ25vcmVkTWVzc2FnZXMgb3B0aW9uLiBSZW1vdmluZyBjdXN0b20gaWdub3JlZE1lc3NhZ2VzLlwiLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gbWVzc2FnZXNGcm9tSXRlbShpdGVtKSB7XG4gIHZhciBib2R5ID0gaXRlbS5ib2R5O1xuICB2YXIgbWVzc2FnZXMgPSBbXTtcblxuICAvLyBUaGUgcGF5bG9hZCBzY2hlbWEgb25seSBhbGxvd3Mgb25lIG9mIHRyYWNlX2NoYWluLCBtZXNzYWdlLCBvciB0cmFjZS5cbiAgLy8gSG93ZXZlciwgZXhpc3RpbmcgdGVzdCBjYXNlcyBhcmUgYmFzZWQgb24gaGF2aW5nIGJvdGggdHJhY2UgYW5kIG1lc3NhZ2UgcHJlc2VudC5cbiAgLy8gU28gaGVyZSB3ZSBwcmVzZXJ2ZSB0aGUgYWJpbGl0eSB0byBjb2xsZWN0IHN0cmluZ3MgZnJvbSBhbnkgY29tYmluYXRpb24gb2YgdGhlc2Uga2V5cy5cbiAgaWYgKGJvZHkudHJhY2VfY2hhaW4pIHtcbiAgICB2YXIgdHJhY2VDaGFpbiA9IGJvZHkudHJhY2VfY2hhaW47XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0cmFjZUNoYWluLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdHJhY2UgPSB0cmFjZUNoYWluW2ldO1xuICAgICAgbWVzc2FnZXMucHVzaChfLmdldCh0cmFjZSwgJ2V4Y2VwdGlvbi5tZXNzYWdlJykpO1xuICAgIH1cbiAgfVxuICBpZiAoYm9keS50cmFjZSkge1xuICAgIG1lc3NhZ2VzLnB1c2goXy5nZXQoYm9keSwgJ3RyYWNlLmV4Y2VwdGlvbi5tZXNzYWdlJykpO1xuICB9XG4gIGlmIChib2R5Lm1lc3NhZ2UpIHtcbiAgICBtZXNzYWdlcy5wdXNoKF8uZ2V0KGJvZHksICdtZXNzYWdlLmJvZHknKSk7XG4gIH1cbiAgcmV0dXJuIG1lc3NhZ2VzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY2hlY2tMZXZlbDogY2hlY2tMZXZlbCxcbiAgdXNlckNoZWNrSWdub3JlOiB1c2VyQ2hlY2tJZ25vcmUsXG4gIHVybElzTm90QmxvY2tMaXN0ZWQ6IHVybElzTm90QmxvY2tMaXN0ZWQsXG4gIHVybElzU2FmZUxpc3RlZDogdXJsSXNTYWZlTGlzdGVkLFxuICBtZXNzYWdlSXNJZ25vcmVkOiBtZXNzYWdlSXNJZ25vcmVkLFxufTtcbiIsInZhciBtZXJnZSA9IHJlcXVpcmUoJy4vbWVyZ2UnKTtcblxudmFyIFJvbGxiYXJKU09OID0ge307XG5mdW5jdGlvbiBzZXR1cEpTT04ocG9seWZpbGxKU09OKSB7XG4gIGlmIChpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnN0cmluZ2lmeSkgJiYgaXNGdW5jdGlvbihSb2xsYmFySlNPTi5wYXJzZSkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoaXNEZWZpbmVkKEpTT04pKSB7XG4gICAgLy8gSWYgcG9seWZpbGwgaXMgcHJvdmlkZWQsIHByZWZlciBpdCBvdmVyIGV4aXN0aW5nIG5vbi1uYXRpdmUgc2hpbXMuXG4gICAgaWYgKHBvbHlmaWxsSlNPTikge1xuICAgICAgaWYgKGlzTmF0aXZlRnVuY3Rpb24oSlNPTi5zdHJpbmdpZnkpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnN0cmluZ2lmeSA9IEpTT04uc3RyaW5naWZ5O1xuICAgICAgfVxuICAgICAgaWYgKGlzTmF0aXZlRnVuY3Rpb24oSlNPTi5wYXJzZSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04ucGFyc2UgPSBKU09OLnBhcnNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBlbHNlIGFjY2VwdCBhbnkgaW50ZXJmYWNlIHRoYXQgaXMgcHJlc2VudC5cbiAgICAgIGlmIChpc0Z1bmN0aW9uKEpTT04uc3RyaW5naWZ5KSkge1xuICAgICAgICBSb2xsYmFySlNPTi5zdHJpbmdpZnkgPSBKU09OLnN0cmluZ2lmeTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0Z1bmN0aW9uKEpTT04ucGFyc2UpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnBhcnNlID0gSlNPTi5wYXJzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKCFpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnN0cmluZ2lmeSkgfHwgIWlzRnVuY3Rpb24oUm9sbGJhckpTT04ucGFyc2UpKSB7XG4gICAgcG9seWZpbGxKU09OICYmIHBvbHlmaWxsSlNPTihSb2xsYmFySlNPTik7XG4gIH1cbn1cblxuLypcbiAqIGlzVHlwZSAtIEdpdmVuIGEgSmF2YXNjcmlwdCB2YWx1ZSBhbmQgYSBzdHJpbmcsIHJldHVybnMgdHJ1ZSBpZiB0aGUgdHlwZSBvZiB0aGUgdmFsdWUgbWF0Y2hlcyB0aGVcbiAqIGdpdmVuIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0geCAtIGFueSB2YWx1ZVxuICogQHBhcmFtIHQgLSBhIGxvd2VyY2FzZSBzdHJpbmcgY29udGFpbmluZyBvbmUgb2YgdGhlIGZvbGxvd2luZyB0eXBlIG5hbWVzOlxuICogICAgLSB1bmRlZmluZWRcbiAqICAgIC0gbnVsbFxuICogICAgLSBlcnJvclxuICogICAgLSBudW1iZXJcbiAqICAgIC0gYm9vbGVhblxuICogICAgLSBzdHJpbmdcbiAqICAgIC0gc3ltYm9sXG4gKiAgICAtIGZ1bmN0aW9uXG4gKiAgICAtIG9iamVjdFxuICogICAgLSBhcnJheVxuICogQHJldHVybnMgdHJ1ZSBpZiB4IGlzIG9mIHR5cGUgdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVHlwZSh4LCB0KSB7XG4gIHJldHVybiB0ID09PSB0eXBlTmFtZSh4KTtcbn1cblxuLypcbiAqIHR5cGVOYW1lIC0gR2l2ZW4gYSBKYXZhc2NyaXB0IHZhbHVlLCByZXR1cm5zIHRoZSB0eXBlIG9mIHRoZSBvYmplY3QgYXMgYSBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gdHlwZU5hbWUoeCkge1xuICB2YXIgbmFtZSA9IHR5cGVvZiB4O1xuICBpZiAobmFtZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbmFtZTtcbiAgfVxuICBpZiAoIXgpIHtcbiAgICByZXR1cm4gJ251bGwnO1xuICB9XG4gIGlmICh4IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICByZXR1cm4gJ2Vycm9yJztcbiAgfVxuICByZXR1cm4ge30udG9TdHJpbmdcbiAgICAuY2FsbCh4KVxuICAgIC5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXVxuICAgIC50b0xvd2VyQ2FzZSgpO1xufVxuXG4vKiBpc0Z1bmN0aW9uIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBhIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIGYgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIGZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbihmKSB7XG4gIHJldHVybiBpc1R5cGUoZiwgJ2Z1bmN0aW9uJyk7XG59XG5cbi8qIGlzTmF0aXZlRnVuY3Rpb24gLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIGEgbmF0aXZlIEpTIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIGYgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIG5hdGl2ZSBKUyBmdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlRnVuY3Rpb24oZikge1xuICB2YXIgcmVSZWdFeHBDaGFyID0gL1tcXFxcXiQuKis/KClbXFxde318XS9nO1xuICB2YXIgZnVuY01hdGNoU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nXG4gICAgLmNhbGwoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSlcbiAgICAucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAgIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKTtcbiAgdmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICsgZnVuY01hdGNoU3RyaW5nICsgJyQnKTtcbiAgcmV0dXJuIGlzT2JqZWN0KGYpICYmIHJlSXNOYXRpdmUudGVzdChmKTtcbn1cblxuLyogaXNPYmplY3QgLSBDaGVja3MgaWYgdGhlIGFyZ3VtZW50IGlzIGFuIG9iamVjdFxuICpcbiAqIEBwYXJhbSB2YWx1ZSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpcyB2YWx1ZSBpcyBhbiBvYmplY3QgZnVuY3Rpb24gaXMgYW4gb2JqZWN0KVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyogaXNTdHJpbmcgLSBDaGVja3MgaWYgdGhlIGFyZ3VtZW50IGlzIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHZhbHVlIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIHZhbHVlIGlzIGEgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nO1xufVxuXG4vKipcbiAqIGlzRmluaXRlTnVtYmVyIC0gZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgYSBmaW5pdGUgbnVtYmVyXG4gKlxuICogQHBhcmFtIHsqfSBuIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIHZhbHVlIGlzIGEgZmluaXRlIG51bWJlclxuICovXG5mdW5jdGlvbiBpc0Zpbml0ZU51bWJlcihuKSB7XG4gIHJldHVybiBOdW1iZXIuaXNGaW5pdGUobik7XG59XG5cbi8qXG4gKiBpc0RlZmluZWQgLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIG5vdCBlcXVhbCB0byB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0gdSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiB1IGlzIGFueXRoaW5nIG90aGVyIHRoYW4gdW5kZWZpbmVkXG4gKi9cbmZ1bmN0aW9uIGlzRGVmaW5lZCh1KSB7XG4gIHJldHVybiAhaXNUeXBlKHUsICd1bmRlZmluZWQnKTtcbn1cblxuLypcbiAqIGlzSXRlcmFibGUgLSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBjYW4gYmUgaXRlcmF0ZWQsIGVzc2VudGlhbGx5XG4gKiB3aGV0aGVyIGl0IGlzIGFuIG9iamVjdCBvciBhbiBhcnJheS5cbiAqXG4gKiBAcGFyYW0gaSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBpIGlzIGFuIG9iamVjdCBvciBhbiBhcnJheSBhcyBkZXRlcm1pbmVkIGJ5IGB0eXBlTmFtZWBcbiAqL1xuZnVuY3Rpb24gaXNJdGVyYWJsZShpKSB7XG4gIHZhciB0eXBlID0gdHlwZU5hbWUoaSk7XG4gIHJldHVybiB0eXBlID09PSAnb2JqZWN0JyB8fCB0eXBlID09PSAnYXJyYXknO1xufVxuXG4vKlxuICogaXNFcnJvciAtIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIG9mIGFuIGVycm9yIHR5cGVcbiAqXG4gKiBAcGFyYW0gZSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBlIGlzIGFuIGVycm9yXG4gKi9cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICAvLyBEZXRlY3QgYm90aCBFcnJvciBhbmQgRmlyZWZveCBFeGNlcHRpb24gdHlwZVxuICByZXR1cm4gaXNUeXBlKGUsICdlcnJvcicpIHx8IGlzVHlwZShlLCAnZXhjZXB0aW9uJyk7XG59XG5cbi8qIGlzUHJvbWlzZSAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgYSBwcm9taXNlXG4gKlxuICogQHBhcmFtIHAgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIGZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNQcm9taXNlKHApIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHApICYmIGlzVHlwZShwLnRoZW4sICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIGlzQnJvd3NlciAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIHRoZSBjb2RlIGlzIHJ1bm5pbmcgaW4gYSBicm93c2VyXG4gKlxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY29kZSBpcyBydW5uaW5nIGluIGEgYnJvd3NlciBlbnZpcm9ubWVudFxuICovXG5mdW5jdGlvbiBpc0Jyb3dzZXIoKSB7XG4gIHJldHVybiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcbn1cblxuZnVuY3Rpb24gcmVkYWN0KCkge1xuICByZXR1cm4gJyoqKioqKioqJztcbn1cblxuLy8gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS84ODA5NDcyLzExMzgxOTFcbmZ1bmN0aW9uIHV1aWQ0KCkge1xuICB2YXIgZCA9IG5vdygpO1xuICB2YXIgdXVpZCA9ICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoXG4gICAgL1t4eV0vZyxcbiAgICBmdW5jdGlvbiAoYykge1xuICAgICAgdmFyIHIgPSAoZCArIE1hdGgucmFuZG9tKCkgKiAxNikgJSAxNiB8IDA7XG4gICAgICBkID0gTWF0aC5mbG9vcihkIC8gMTYpO1xuICAgICAgcmV0dXJuIChjID09PSAneCcgPyByIDogKHIgJiAweDcpIHwgMHg4KS50b1N0cmluZygxNik7XG4gICAgfSxcbiAgKTtcbiAgcmV0dXJuIHV1aWQ7XG59XG5cbnZhciBMRVZFTFMgPSB7XG4gIGRlYnVnOiAwLFxuICBpbmZvOiAxLFxuICB3YXJuaW5nOiAyLFxuICBlcnJvcjogMyxcbiAgY3JpdGljYWw6IDQsXG59O1xuXG5mdW5jdGlvbiBzYW5pdGl6ZVVybCh1cmwpIHtcbiAgdmFyIGJhc2VVcmxQYXJ0cyA9IHBhcnNlVXJpKHVybCk7XG4gIGlmICghYmFzZVVybFBhcnRzKSB7XG4gICAgcmV0dXJuICcodW5rbm93biknO1xuICB9XG5cbiAgLy8gcmVtb3ZlIGEgdHJhaWxpbmcgIyBpZiB0aGVyZSBpcyBubyBhbmNob3JcbiAgaWYgKGJhc2VVcmxQYXJ0cy5hbmNob3IgPT09ICcnKSB7XG4gICAgYmFzZVVybFBhcnRzLnNvdXJjZSA9IGJhc2VVcmxQYXJ0cy5zb3VyY2UucmVwbGFjZSgnIycsICcnKTtcbiAgfVxuXG4gIHVybCA9IGJhc2VVcmxQYXJ0cy5zb3VyY2UucmVwbGFjZSgnPycgKyBiYXNlVXJsUGFydHMucXVlcnksICcnKTtcbiAgcmV0dXJuIHVybDtcbn1cblxudmFyIHBhcnNlVXJpT3B0aW9ucyA9IHtcbiAgc3RyaWN0TW9kZTogZmFsc2UsXG4gIGtleTogW1xuICAgICdzb3VyY2UnLFxuICAgICdwcm90b2NvbCcsXG4gICAgJ2F1dGhvcml0eScsXG4gICAgJ3VzZXJJbmZvJyxcbiAgICAndXNlcicsXG4gICAgJ3Bhc3N3b3JkJyxcbiAgICAnaG9zdCcsXG4gICAgJ3BvcnQnLFxuICAgICdyZWxhdGl2ZScsXG4gICAgJ3BhdGgnLFxuICAgICdkaXJlY3RvcnknLFxuICAgICdmaWxlJyxcbiAgICAncXVlcnknLFxuICAgICdhbmNob3InLFxuICBdLFxuICBxOiB7XG4gICAgbmFtZTogJ3F1ZXJ5S2V5JyxcbiAgICBwYXJzZXI6IC8oPzpefCYpKFteJj1dKik9PyhbXiZdKikvZyxcbiAgfSxcbiAgcGFyc2VyOiB7XG4gICAgc3RyaWN0OlxuICAgICAgL14oPzooW146XFwvPyNdKyk6KT8oPzpcXC9cXC8oKD86KChbXjpAXSopKD86OihbXjpAXSopKT8pP0ApPyhbXjpcXC8/I10qKSg/OjooXFxkKikpPykpPygoKCg/OltePyNcXC9dKlxcLykqKShbXj8jXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pLyxcbiAgICBsb29zZTpcbiAgICAgIC9eKD86KD8hW146QF0rOlteOkBcXC9dKkApKFteOlxcLz8jLl0rKTopPyg/OlxcL1xcLyk/KCg/OigoW146QF0qKSg/OjooW146QF0qKSk/KT9AKT8oW146XFwvPyNdKikoPzo6KFxcZCopKT8pKCgoXFwvKD86W14/I10oPyFbXj8jXFwvXSpcXC5bXj8jXFwvLl0rKD86Wz8jXXwkKSkpKlxcLz8pPyhbXj8jXFwvXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pLyxcbiAgfSxcbn07XG5cbmZ1bmN0aW9uIHBhcnNlVXJpKHN0cikge1xuICBpZiAoIWlzVHlwZShzdHIsICdzdHJpbmcnKSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICB2YXIgbyA9IHBhcnNlVXJpT3B0aW9ucztcbiAgdmFyIG0gPSBvLnBhcnNlcltvLnN0cmljdE1vZGUgPyAnc3RyaWN0JyA6ICdsb29zZSddLmV4ZWMoc3RyKTtcbiAgdmFyIHVyaSA9IHt9O1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gby5rZXkubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgdXJpW28ua2V5W2ldXSA9IG1baV0gfHwgJyc7XG4gIH1cblxuICB1cmlbby5xLm5hbWVdID0ge307XG4gIHVyaVtvLmtleVsxMl1dLnJlcGxhY2Uoby5xLnBhcnNlciwgZnVuY3Rpb24gKCQwLCAkMSwgJDIpIHtcbiAgICBpZiAoJDEpIHtcbiAgICAgIHVyaVtvLnEubmFtZV1bJDFdID0gJDI7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdXJpO1xufVxuXG5mdW5jdGlvbiBhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aChhY2Nlc3NUb2tlbiwgb3B0aW9ucywgcGFyYW1zKSB7XG4gIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgcGFyYW1zLmFjY2Vzc190b2tlbiA9IGFjY2Vzc1Rva2VuO1xuICB2YXIgcGFyYW1zQXJyYXkgPSBbXTtcbiAgdmFyIGs7XG4gIGZvciAoayBpbiBwYXJhbXMpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmFtcywgaykpIHtcbiAgICAgIHBhcmFtc0FycmF5LnB1c2goW2ssIHBhcmFtc1trXV0uam9pbignPScpKTtcbiAgICB9XG4gIH1cbiAgdmFyIHF1ZXJ5ID0gJz8nICsgcGFyYW1zQXJyYXkuc29ydCgpLmpvaW4oJyYnKTtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgb3B0aW9ucy5wYXRoID0gb3B0aW9ucy5wYXRoIHx8ICcnO1xuICB2YXIgcXMgPSBvcHRpb25zLnBhdGguaW5kZXhPZignPycpO1xuICB2YXIgaCA9IG9wdGlvbnMucGF0aC5pbmRleE9mKCcjJyk7XG4gIHZhciBwO1xuICBpZiAocXMgIT09IC0xICYmIChoID09PSAtMSB8fCBoID4gcXMpKSB7XG4gICAgcCA9IG9wdGlvbnMucGF0aDtcbiAgICBvcHRpb25zLnBhdGggPSBwLnN1YnN0cmluZygwLCBxcykgKyBxdWVyeSArICcmJyArIHAuc3Vic3RyaW5nKHFzICsgMSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGggIT09IC0xKSB7XG4gICAgICBwID0gb3B0aW9ucy5wYXRoO1xuICAgICAgb3B0aW9ucy5wYXRoID0gcC5zdWJzdHJpbmcoMCwgaCkgKyBxdWVyeSArIHAuc3Vic3RyaW5nKGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zLnBhdGggPSBvcHRpb25zLnBhdGggKyBxdWVyeTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0VXJsKHUsIHByb3RvY29sKSB7XG4gIHByb3RvY29sID0gcHJvdG9jb2wgfHwgdS5wcm90b2NvbDtcbiAgaWYgKCFwcm90b2NvbCAmJiB1LnBvcnQpIHtcbiAgICBpZiAodS5wb3J0ID09PSA4MCkge1xuICAgICAgcHJvdG9jb2wgPSAnaHR0cDonO1xuICAgIH0gZWxzZSBpZiAodS5wb3J0ID09PSA0NDMpIHtcbiAgICAgIHByb3RvY29sID0gJ2h0dHBzOic7XG4gICAgfVxuICB9XG4gIHByb3RvY29sID0gcHJvdG9jb2wgfHwgJ2h0dHBzOic7XG5cbiAgaWYgKCF1Lmhvc3RuYW1lKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IHByb3RvY29sICsgJy8vJyArIHUuaG9zdG5hbWU7XG4gIGlmICh1LnBvcnQpIHtcbiAgICByZXN1bHQgPSByZXN1bHQgKyAnOicgKyB1LnBvcnQ7XG4gIH1cbiAgaWYgKHUucGF0aCkge1xuICAgIHJlc3VsdCA9IHJlc3VsdCArIHUucGF0aDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnkob2JqLCBiYWNrdXApIHtcbiAgdmFyIHZhbHVlLCBlcnJvcjtcbiAgdHJ5IHtcbiAgICB2YWx1ZSA9IFJvbGxiYXJKU09OLnN0cmluZ2lmeShvYmopO1xuICB9IGNhdGNoIChqc29uRXJyb3IpIHtcbiAgICBpZiAoYmFja3VwICYmIGlzRnVuY3Rpb24oYmFja3VwKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBiYWNrdXAob2JqKTtcbiAgICAgIH0gY2F0Y2ggKGJhY2t1cEVycm9yKSB7XG4gICAgICAgIGVycm9yID0gYmFja3VwRXJyb3I7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVycm9yID0ganNvbkVycm9yO1xuICAgIH1cbiAgfVxuICByZXR1cm4geyBlcnJvcjogZXJyb3IsIHZhbHVlOiB2YWx1ZSB9O1xufVxuXG5mdW5jdGlvbiBtYXhCeXRlU2l6ZShzdHJpbmcpIHtcbiAgLy8gVGhlIHRyYW5zcG9ydCB3aWxsIHVzZSB1dGYtOCwgc28gYXNzdW1lIHV0Zi04IGVuY29kaW5nLlxuICAvL1xuICAvLyBUaGlzIG1pbmltYWwgaW1wbGVtZW50YXRpb24gd2lsbCBhY2N1cmF0ZWx5IGNvdW50IGJ5dGVzIGZvciBhbGwgVUNTLTIgYW5kXG4gIC8vIHNpbmdsZSBjb2RlIHBvaW50IFVURi0xNi4gSWYgcHJlc2VudGVkIHdpdGggbXVsdGkgY29kZSBwb2ludCBVVEYtMTYsXG4gIC8vIHdoaWNoIHNob3VsZCBiZSByYXJlLCBpdCB3aWxsIHNhZmVseSBvdmVyY291bnQsIG5vdCB1bmRlcmNvdW50LlxuICAvL1xuICAvLyBXaGlsZSByb2J1c3QgdXRmLTggZW5jb2RlcnMgZXhpc3QsIHRoaXMgaXMgZmFyIHNtYWxsZXIgYW5kIGZhciBtb3JlIHBlcmZvcm1hbnQuXG4gIC8vIEZvciBxdWlja2x5IGNvdW50aW5nIHBheWxvYWQgc2l6ZSBmb3IgdHJ1bmNhdGlvbiwgc21hbGxlciBpcyBiZXR0ZXIuXG5cbiAgdmFyIGNvdW50ID0gMDtcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBjb2RlID0gc3RyaW5nLmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGNvZGUgPCAxMjgpIHtcbiAgICAgIC8vIHVwIHRvIDcgYml0c1xuICAgICAgY291bnQgPSBjb3VudCArIDE7XG4gICAgfSBlbHNlIGlmIChjb2RlIDwgMjA0OCkge1xuICAgICAgLy8gdXAgdG8gMTEgYml0c1xuICAgICAgY291bnQgPSBjb3VudCArIDI7XG4gICAgfSBlbHNlIGlmIChjb2RlIDwgNjU1MzYpIHtcbiAgICAgIC8vIHVwIHRvIDE2IGJpdHNcbiAgICAgIGNvdW50ID0gY291bnQgKyAzO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb3VudDtcbn1cblxuZnVuY3Rpb24ganNvblBhcnNlKHMpIHtcbiAgdmFyIHZhbHVlLCBlcnJvcjtcbiAgdHJ5IHtcbiAgICB2YWx1ZSA9IFJvbGxiYXJKU09OLnBhcnNlKHMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgZXJyb3IgPSBlO1xuICB9XG4gIHJldHVybiB7IGVycm9yOiBlcnJvciwgdmFsdWU6IHZhbHVlIH07XG59XG5cbmZ1bmN0aW9uIG1ha2VVbmhhbmRsZWRTdGFja0luZm8oXG4gIG1lc3NhZ2UsXG4gIHVybCxcbiAgbGluZW5vLFxuICBjb2xubyxcbiAgZXJyb3IsXG4gIG1vZGUsXG4gIGJhY2t1cE1lc3NhZ2UsXG4gIGVycm9yUGFyc2VyLFxuKSB7XG4gIHZhciBsb2NhdGlvbiA9IHtcbiAgICB1cmw6IHVybCB8fCAnJyxcbiAgICBsaW5lOiBsaW5lbm8sXG4gICAgY29sdW1uOiBjb2xubyxcbiAgfTtcbiAgbG9jYXRpb24uZnVuYyA9IGVycm9yUGFyc2VyLmd1ZXNzRnVuY3Rpb25OYW1lKGxvY2F0aW9uLnVybCwgbG9jYXRpb24ubGluZSk7XG4gIGxvY2F0aW9uLmNvbnRleHQgPSBlcnJvclBhcnNlci5nYXRoZXJDb250ZXh0KGxvY2F0aW9uLnVybCwgbG9jYXRpb24ubGluZSk7XG4gIHZhciBocmVmID1cbiAgICB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmXG4gICAgZG9jdW1lbnQgJiZcbiAgICBkb2N1bWVudC5sb2NhdGlvbiAmJlxuICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWY7XG4gIHZhciB1c2VyYWdlbnQgPVxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgd2luZG93ICYmXG4gICAgd2luZG93Lm5hdmlnYXRvciAmJlxuICAgIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICByZXR1cm4ge1xuICAgIG1vZGU6IG1vZGUsXG4gICAgbWVzc2FnZTogZXJyb3IgPyBTdHJpbmcoZXJyb3IpIDogbWVzc2FnZSB8fCBiYWNrdXBNZXNzYWdlLFxuICAgIHVybDogaHJlZixcbiAgICBzdGFjazogW2xvY2F0aW9uXSxcbiAgICB1c2VyYWdlbnQ6IHVzZXJhZ2VudCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gd3JhcENhbGxiYWNrKGxvZ2dlciwgZikge1xuICByZXR1cm4gZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgIHRyeSB7XG4gICAgICBmKGVyciwgcmVzcCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbG9nZ2VyLmVycm9yKGUpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gbm9uQ2lyY3VsYXJDbG9uZShvYmopIHtcbiAgdmFyIHNlZW4gPSBbb2JqXTtcblxuICBmdW5jdGlvbiBjbG9uZShvYmosIHNlZW4pIHtcbiAgICB2YXIgdmFsdWUsXG4gICAgICBuYW1lLFxuICAgICAgbmV3U2VlbixcbiAgICAgIHJlc3VsdCA9IHt9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAobmFtZSBpbiBvYmopIHtcbiAgICAgICAgdmFsdWUgPSBvYmpbbmFtZV07XG5cbiAgICAgICAgaWYgKHZhbHVlICYmIChpc1R5cGUodmFsdWUsICdvYmplY3QnKSB8fCBpc1R5cGUodmFsdWUsICdhcnJheScpKSkge1xuICAgICAgICAgIGlmIChzZWVuLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgICAgICAgcmVzdWx0W25hbWVdID0gJ1JlbW92ZWQgY2lyY3VsYXIgcmVmZXJlbmNlOiAnICsgdHlwZU5hbWUodmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdTZWVuID0gc2Vlbi5zbGljZSgpO1xuICAgICAgICAgICAgbmV3U2Vlbi5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IGNsb25lKHZhbHVlLCBuZXdTZWVuKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHRbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXN1bHQgPSAnRmFpbGVkIGNsb25pbmcgY3VzdG9tIGRhdGE6ICcgKyBlLm1lc3NhZ2U7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGNsb25lKG9iaiwgc2Vlbik7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUl0ZW0oYXJncywgbG9nZ2VyLCBub3RpZmllciwgcmVxdWVzdEtleXMsIGxhbWJkYUNvbnRleHQpIHtcbiAgdmFyIG1lc3NhZ2UsIGVyciwgY3VzdG9tLCBjYWxsYmFjaywgcmVxdWVzdDtcbiAgdmFyIGFyZztcbiAgdmFyIGV4dHJhQXJncyA9IFtdO1xuICB2YXIgZGlhZ25vc3RpYyA9IHt9O1xuICB2YXIgYXJnVHlwZXMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3MubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcblxuICAgIHZhciB0eXAgPSB0eXBlTmFtZShhcmcpO1xuICAgIGFyZ1R5cGVzLnB1c2godHlwKTtcbiAgICBzd2l0Y2ggKHR5cCkge1xuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBtZXNzYWdlID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChtZXNzYWdlID0gYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgIGNhbGxiYWNrID0gd3JhcENhbGxiYWNrKGxvZ2dlciwgYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgZXh0cmFBcmdzLnB1c2goYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdlcnJvcic6XG4gICAgICBjYXNlICdkb21leGNlcHRpb24nOlxuICAgICAgY2FzZSAnZXhjZXB0aW9uJzogLy8gRmlyZWZveCBFeGNlcHRpb24gdHlwZVxuICAgICAgICBlcnIgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGVyciA9IGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGFyZyBpbnN0YW5jZW9mIEVycm9yIHx8XG4gICAgICAgICAgKHR5cGVvZiBET01FeGNlcHRpb24gIT09ICd1bmRlZmluZWQnICYmIGFyZyBpbnN0YW5jZW9mIERPTUV4Y2VwdGlvbilcbiAgICAgICAgKSB7XG4gICAgICAgICAgZXJyID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChlcnIgPSBhcmcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXF1ZXN0S2V5cyAmJiB0eXAgPT09ICdvYmplY3QnICYmICFyZXF1ZXN0KSB7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbiA9IHJlcXVlc3RLZXlzLmxlbmd0aDsgaiA8IGxlbjsgKytqKSB7XG4gICAgICAgICAgICBpZiAoYXJnW3JlcXVlc3RLZXlzW2pdXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHJlcXVlc3QgPSBhcmc7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVxdWVzdCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGN1c3RvbSA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoY3VzdG9tID0gYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoXG4gICAgICAgICAgYXJnIGluc3RhbmNlb2YgRXJyb3IgfHxcbiAgICAgICAgICAodHlwZW9mIERPTUV4Y2VwdGlvbiAhPT0gJ3VuZGVmaW5lZCcgJiYgYXJnIGluc3RhbmNlb2YgRE9NRXhjZXB0aW9uKVxuICAgICAgICApIHtcbiAgICAgICAgICBlcnIgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGVyciA9IGFyZyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZXh0cmFBcmdzLnB1c2goYXJnKTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiBjdXN0b20gaXMgYW4gYXJyYXkgdGhpcyB0dXJucyBpdCBpbnRvIGFuIG9iamVjdCB3aXRoIGludGVnZXIga2V5c1xuICBpZiAoY3VzdG9tKSBjdXN0b20gPSBub25DaXJjdWxhckNsb25lKGN1c3RvbSk7XG5cbiAgaWYgKGV4dHJhQXJncy5sZW5ndGggPiAwKSB7XG4gICAgaWYgKCFjdXN0b20pIGN1c3RvbSA9IG5vbkNpcmN1bGFyQ2xvbmUoe30pO1xuICAgIGN1c3RvbS5leHRyYUFyZ3MgPSBub25DaXJjdWxhckNsb25lKGV4dHJhQXJncyk7XG4gIH1cblxuICB2YXIgaXRlbSA9IHtcbiAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgIGVycjogZXJyLFxuICAgIGN1c3RvbTogY3VzdG9tLFxuICAgIHRpbWVzdGFtcDogbm93KCksXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgIG5vdGlmaWVyOiBub3RpZmllcixcbiAgICBkaWFnbm9zdGljOiBkaWFnbm9zdGljLFxuICAgIHV1aWQ6IHV1aWQ0KCksXG4gIH07XG5cbiAgaXRlbS5kYXRhID0gaXRlbS5kYXRhIHx8IHt9O1xuXG4gIHNldEN1c3RvbUl0ZW1LZXlzKGl0ZW0sIGN1c3RvbSk7XG5cbiAgaWYgKHJlcXVlc3RLZXlzICYmIHJlcXVlc3QpIHtcbiAgICBpdGVtLnJlcXVlc3QgPSByZXF1ZXN0O1xuICB9XG4gIGlmIChsYW1iZGFDb250ZXh0KSB7XG4gICAgaXRlbS5sYW1iZGFDb250ZXh0ID0gbGFtYmRhQ29udGV4dDtcbiAgfVxuICBpdGVtLl9vcmlnaW5hbEFyZ3MgPSBhcmdzO1xuICBpdGVtLmRpYWdub3N0aWMub3JpZ2luYWxfYXJnX3R5cGVzID0gYXJnVHlwZXM7XG4gIHJldHVybiBpdGVtO1xufVxuXG5mdW5jdGlvbiBzZXRDdXN0b21JdGVtS2V5cyhpdGVtLCBjdXN0b20pIHtcbiAgaWYgKGN1c3RvbSAmJiBjdXN0b20ubGV2ZWwgIT09IHVuZGVmaW5lZCkge1xuICAgIGl0ZW0ubGV2ZWwgPSBjdXN0b20ubGV2ZWw7XG4gICAgZGVsZXRlIGN1c3RvbS5sZXZlbDtcbiAgfVxuICBpZiAoY3VzdG9tICYmIGN1c3RvbS5za2lwRnJhbWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICBpdGVtLnNraXBGcmFtZXMgPSBjdXN0b20uc2tpcEZyYW1lcztcbiAgICBkZWxldGUgY3VzdG9tLnNraXBGcmFtZXM7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkRXJyb3JDb250ZXh0KGl0ZW0sIGVycm9ycykge1xuICB2YXIgY3VzdG9tID0gaXRlbS5kYXRhLmN1c3RvbSB8fCB7fTtcbiAgdmFyIGNvbnRleHRBZGRlZCA9IGZhbHNlO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlcnJvcnMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChlcnJvcnNbaV0uaGFzT3duUHJvcGVydHkoJ3JvbGxiYXJDb250ZXh0JykpIHtcbiAgICAgICAgY3VzdG9tID0gbWVyZ2UoY3VzdG9tLCBub25DaXJjdWxhckNsb25lKGVycm9yc1tpXS5yb2xsYmFyQ29udGV4dCkpO1xuICAgICAgICBjb250ZXh0QWRkZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEF2b2lkIGFkZGluZyBhbiBlbXB0eSBvYmplY3QgdG8gdGhlIGRhdGEuXG4gICAgaWYgKGNvbnRleHRBZGRlZCkge1xuICAgICAgaXRlbS5kYXRhLmN1c3RvbSA9IGN1c3RvbTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpdGVtLmRpYWdub3N0aWMuZXJyb3JfY29udGV4dCA9ICdGYWlsZWQ6ICcgKyBlLm1lc3NhZ2U7XG4gIH1cbn1cblxudmFyIFRFTEVNRVRSWV9UWVBFUyA9IFtcbiAgJ2xvZycsXG4gICduZXR3b3JrJyxcbiAgJ2RvbScsXG4gICduYXZpZ2F0aW9uJyxcbiAgJ2Vycm9yJyxcbiAgJ21hbnVhbCcsXG5dO1xudmFyIFRFTEVNRVRSWV9MRVZFTFMgPSBbJ2NyaXRpY2FsJywgJ2Vycm9yJywgJ3dhcm5pbmcnLCAnaW5mbycsICdkZWJ1ZyddO1xuXG5mdW5jdGlvbiBhcnJheUluY2x1ZGVzKGFyciwgdmFsKSB7XG4gIGZvciAodmFyIGsgPSAwOyBrIDwgYXJyLmxlbmd0aDsgKytrKSB7XG4gICAgaWYgKGFycltrXSA9PT0gdmFsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRlbGVtZXRyeUV2ZW50KGFyZ3MpIHtcbiAgdmFyIHR5cGUsIG1ldGFkYXRhLCBsZXZlbDtcbiAgdmFyIGFyZztcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3MubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcblxuICAgIHZhciB0eXAgPSB0eXBlTmFtZShhcmcpO1xuICAgIHN3aXRjaCAodHlwKSB7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBpZiAoIXR5cGUgJiYgYXJyYXlJbmNsdWRlcyhURUxFTUVUUllfVFlQRVMsIGFyZykpIHtcbiAgICAgICAgICB0eXBlID0gYXJnO1xuICAgICAgICB9IGVsc2UgaWYgKCFsZXZlbCAmJiBhcnJheUluY2x1ZGVzKFRFTEVNRVRSWV9MRVZFTFMsIGFyZykpIHtcbiAgICAgICAgICBsZXZlbCA9IGFyZztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIG1ldGFkYXRhID0gYXJnO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICB2YXIgZXZlbnQgPSB7XG4gICAgdHlwZTogdHlwZSB8fCAnbWFudWFsJyxcbiAgICBtZXRhZGF0YTogbWV0YWRhdGEgfHwge30sXG4gICAgbGV2ZWw6IGxldmVsLFxuICB9O1xuXG4gIHJldHVybiBldmVudDtcbn1cblxuZnVuY3Rpb24gYWRkSXRlbUF0dHJpYnV0ZXMoaXRlbSwgYXR0cmlidXRlcykge1xuICBpdGVtLmRhdGEuYXR0cmlidXRlcyA9IGl0ZW0uZGF0YS5hdHRyaWJ1dGVzIHx8IFtdO1xuICBpZiAoYXR0cmlidXRlcykge1xuICAgIGl0ZW0uZGF0YS5hdHRyaWJ1dGVzLnB1c2goLi4uYXR0cmlidXRlcyk7XG4gIH1cbn1cblxuLypcbiAqIGdldCAtIGdpdmVuIGFuIG9iai9hcnJheSBhbmQgYSBrZXlwYXRoLCByZXR1cm4gdGhlIHZhbHVlIGF0IHRoYXQga2V5cGF0aCBvclxuICogICAgICAgdW5kZWZpbmVkIGlmIG5vdCBwb3NzaWJsZS5cbiAqXG4gKiBAcGFyYW0gb2JqIC0gYW4gb2JqZWN0IG9yIGFycmF5XG4gKiBAcGFyYW0gcGF0aCAtIGEgc3RyaW5nIG9mIGtleXMgc2VwYXJhdGVkIGJ5ICcuJyBzdWNoIGFzICdwbHVnaW4uanF1ZXJ5LjAubWVzc2FnZSdcbiAqICAgIHdoaWNoIHdvdWxkIGNvcnJlc3BvbmQgdG8gNDIgaW4gYHtwbHVnaW46IHtqcXVlcnk6IFt7bWVzc2FnZTogNDJ9XX19YFxuICovXG5mdW5jdGlvbiBnZXQob2JqLCBwYXRoKSB7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICB2YXIga2V5cyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgdmFyIHJlc3VsdCA9IG9iajtcbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0ga2V5cy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0W2tleXNbaV1dO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzZXQob2JqLCBwYXRoLCB2YWx1ZSkge1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIga2V5cyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgdmFyIGxlbiA9IGtleXMubGVuZ3RoO1xuICBpZiAobGVuIDwgMSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAobGVuID09PSAxKSB7XG4gICAgb2JqW2tleXNbMF1dID0gdmFsdWU7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRyeSB7XG4gICAgdmFyIHRlbXAgPSBvYmpba2V5c1swXV0gfHwge307XG4gICAgdmFyIHJlcGxhY2VtZW50ID0gdGVtcDtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxlbiAtIDE7ICsraSkge1xuICAgICAgdGVtcFtrZXlzW2ldXSA9IHRlbXBba2V5c1tpXV0gfHwge307XG4gICAgICB0ZW1wID0gdGVtcFtrZXlzW2ldXTtcbiAgICB9XG4gICAgdGVtcFtrZXlzW2xlbiAtIDFdXSA9IHZhbHVlO1xuICAgIG9ialtrZXlzWzBdXSA9IHJlcGxhY2VtZW50O1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3NBc1N0cmluZyhhcmdzKSB7XG4gIHZhciBpLCBsZW4sIGFyZztcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKGkgPSAwLCBsZW4gPSBhcmdzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcbiAgICBzd2l0Y2ggKHR5cGVOYW1lKGFyZykpIHtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGFyZyA9IHN0cmluZ2lmeShhcmcpO1xuICAgICAgICBhcmcgPSBhcmcuZXJyb3IgfHwgYXJnLnZhbHVlO1xuICAgICAgICBpZiAoYXJnLmxlbmd0aCA+IDUwMCkge1xuICAgICAgICAgIGFyZyA9IGFyZy5zdWJzdHIoMCwgNDk3KSArICcuLi4nO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbnVsbCc6XG4gICAgICAgIGFyZyA9ICdudWxsJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICBhcmcgPSAndW5kZWZpbmVkJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzeW1ib2wnOlxuICAgICAgICBhcmcgPSBhcmcudG9TdHJpbmcoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKGFyZyk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdC5qb2luKCcgJyk7XG59XG5cbmZ1bmN0aW9uIG5vdygpIHtcbiAgaWYgKERhdGUubm93KSB7XG4gICAgcmV0dXJuICtEYXRlLm5vdygpO1xuICB9XG4gIHJldHVybiArbmV3IERhdGUoKTtcbn1cblxuZnVuY3Rpb24gZmlsdGVySXAocmVxdWVzdERhdGEsIGNhcHR1cmVJcCkge1xuICBpZiAoIXJlcXVlc3REYXRhIHx8ICFyZXF1ZXN0RGF0YVsndXNlcl9pcCddIHx8IGNhcHR1cmVJcCA9PT0gdHJ1ZSkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbmV3SXAgPSByZXF1ZXN0RGF0YVsndXNlcl9pcCddO1xuICBpZiAoIWNhcHR1cmVJcCkge1xuICAgIG5ld0lwID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICB0cnkge1xuICAgICAgdmFyIHBhcnRzO1xuICAgICAgaWYgKG5ld0lwLmluZGV4T2YoJy4nKSAhPT0gLTEpIHtcbiAgICAgICAgcGFydHMgPSBuZXdJcC5zcGxpdCgnLicpO1xuICAgICAgICBwYXJ0cy5wb3AoKTtcbiAgICAgICAgcGFydHMucHVzaCgnMCcpO1xuICAgICAgICBuZXdJcCA9IHBhcnRzLmpvaW4oJy4nKTtcbiAgICAgIH0gZWxzZSBpZiAobmV3SXAuaW5kZXhPZignOicpICE9PSAtMSkge1xuICAgICAgICBwYXJ0cyA9IG5ld0lwLnNwbGl0KCc6Jyk7XG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgdmFyIGJlZ2lubmluZyA9IHBhcnRzLnNsaWNlKDAsIDMpO1xuICAgICAgICAgIHZhciBzbGFzaElkeCA9IGJlZ2lubmluZ1syXS5pbmRleE9mKCcvJyk7XG4gICAgICAgICAgaWYgKHNsYXNoSWR4ICE9PSAtMSkge1xuICAgICAgICAgICAgYmVnaW5uaW5nWzJdID0gYmVnaW5uaW5nWzJdLnN1YnN0cmluZygwLCBzbGFzaElkeCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB0ZXJtaW5hbCA9ICcwMDAwOjAwMDA6MDAwMDowMDAwOjAwMDAnO1xuICAgICAgICAgIG5ld0lwID0gYmVnaW5uaW5nLmNvbmNhdCh0ZXJtaW5hbCkuam9pbignOicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdJcCA9IG51bGw7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbmV3SXAgPSBudWxsO1xuICAgIH1cbiAgfVxuICByZXF1ZXN0RGF0YVsndXNlcl9pcCddID0gbmV3SXA7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU9wdGlvbnMoY3VycmVudCwgaW5wdXQsIHBheWxvYWQsIGxvZ2dlcikge1xuICB2YXIgcmVzdWx0ID0gbWVyZ2UoY3VycmVudCwgaW5wdXQsIHBheWxvYWQpO1xuICByZXN1bHQgPSB1cGRhdGVEZXByZWNhdGVkT3B0aW9ucyhyZXN1bHQsIGxvZ2dlcik7XG4gIGlmICghaW5wdXQgfHwgaW5wdXQub3ZlcndyaXRlU2NydWJGaWVsZHMpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGlmIChpbnB1dC5zY3J1YkZpZWxkcykge1xuICAgIHJlc3VsdC5zY3J1YkZpZWxkcyA9IChjdXJyZW50LnNjcnViRmllbGRzIHx8IFtdKS5jb25jYXQoaW5wdXQuc2NydWJGaWVsZHMpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZURlcHJlY2F0ZWRPcHRpb25zKG9wdGlvbnMsIGxvZ2dlcikge1xuICBpZiAob3B0aW9ucy5ob3N0V2hpdGVMaXN0ICYmICFvcHRpb25zLmhvc3RTYWZlTGlzdCkge1xuICAgIG9wdGlvbnMuaG9zdFNhZmVMaXN0ID0gb3B0aW9ucy5ob3N0V2hpdGVMaXN0O1xuICAgIG9wdGlvbnMuaG9zdFdoaXRlTGlzdCA9IHVuZGVmaW5lZDtcbiAgICBsb2dnZXIgJiYgbG9nZ2VyLmxvZygnaG9zdFdoaXRlTGlzdCBpcyBkZXByZWNhdGVkLiBVc2UgaG9zdFNhZmVMaXN0LicpO1xuICB9XG4gIGlmIChvcHRpb25zLmhvc3RCbGFja0xpc3QgJiYgIW9wdGlvbnMuaG9zdEJsb2NrTGlzdCkge1xuICAgIG9wdGlvbnMuaG9zdEJsb2NrTGlzdCA9IG9wdGlvbnMuaG9zdEJsYWNrTGlzdDtcbiAgICBvcHRpb25zLmhvc3RCbGFja0xpc3QgPSB1bmRlZmluZWQ7XG4gICAgbG9nZ2VyICYmIGxvZ2dlci5sb2coJ2hvc3RCbGFja0xpc3QgaXMgZGVwcmVjYXRlZC4gVXNlIGhvc3RCbG9ja0xpc3QuJyk7XG4gIH1cbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aDogYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGgsXG4gIGNyZWF0ZUl0ZW06IGNyZWF0ZUl0ZW0sXG4gIGFkZEVycm9yQ29udGV4dDogYWRkRXJyb3JDb250ZXh0LFxuICBjcmVhdGVUZWxlbWV0cnlFdmVudDogY3JlYXRlVGVsZW1ldHJ5RXZlbnQsXG4gIGFkZEl0ZW1BdHRyaWJ1dGVzOiBhZGRJdGVtQXR0cmlidXRlcyxcbiAgZmlsdGVySXA6IGZpbHRlcklwLFxuICBmb3JtYXRBcmdzQXNTdHJpbmc6IGZvcm1hdEFyZ3NBc1N0cmluZyxcbiAgZm9ybWF0VXJsOiBmb3JtYXRVcmwsXG4gIGdldDogZ2V0LFxuICBoYW5kbGVPcHRpb25zOiBoYW5kbGVPcHRpb25zLFxuICBpc0Vycm9yOiBpc0Vycm9yLFxuICBpc0Zpbml0ZU51bWJlcjogaXNGaW5pdGVOdW1iZXIsXG4gIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gIGlzSXRlcmFibGU6IGlzSXRlcmFibGUsXG4gIGlzTmF0aXZlRnVuY3Rpb246IGlzTmF0aXZlRnVuY3Rpb24sXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc1R5cGU6IGlzVHlwZSxcbiAgaXNQcm9taXNlOiBpc1Byb21pc2UsXG4gIGlzQnJvd3NlcjogaXNCcm93c2VyLFxuICBqc29uUGFyc2U6IGpzb25QYXJzZSxcbiAgTEVWRUxTOiBMRVZFTFMsXG4gIG1ha2VVbmhhbmRsZWRTdGFja0luZm86IG1ha2VVbmhhbmRsZWRTdGFja0luZm8sXG4gIG1lcmdlOiBtZXJnZSxcbiAgbm93OiBub3csXG4gIHJlZGFjdDogcmVkYWN0LFxuICBSb2xsYmFySlNPTjogUm9sbGJhckpTT04sXG4gIHNhbml0aXplVXJsOiBzYW5pdGl6ZVVybCxcbiAgc2V0OiBzZXQsXG4gIHNldHVwSlNPTjogc2V0dXBKU09OLFxuICBzdHJpbmdpZnk6IHN0cmluZ2lmeSxcbiAgbWF4Qnl0ZVNpemU6IG1heEJ5dGVTaXplLFxuICB0eXBlTmFtZTogdHlwZU5hbWUsXG4gIHV1aWQ0OiB1dWlkNCxcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcbnZhciB2b3dzID0gcmVxdWlyZSgndm93cycpO1xudmFyIHAgPSByZXF1aXJlKCcuLi9zcmMvcHJlZGljYXRlcycpO1xuXG52b3dzXG4gIC5kZXNjcmliZSgncHJlZGljYXRlcycpXG4gIC5hZGRCYXRjaCh7XG4gICAgY2hlY2tMZXZlbDoge1xuICAgICAgJ2FuIGl0ZW0gd2l0aG91dCBhIGxldmVsJzoge1xuICAgICAgICB0b3BpYzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiB7IGJvZHk6ICdub3RoaW5nJyB9O1xuICAgICAgICB9LFxuICAgICAgICAnc2V0dGluZ3Mgd2l0aCBhIGNyaXRpY2FsIHJlcG9ydExldmVsJzoge1xuICAgICAgICAgIHRvcGljOiBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgdmFyIHNldHRpbmdzID0geyByZXBvcnRMZXZlbDogJ2NyaXRpY2FsJyB9O1xuICAgICAgICAgICAgcmV0dXJuIHAuY2hlY2tMZXZlbChpdGVtLCBzZXR0aW5ncyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAnc2hvdWxkIG5vdCBzZW5kJzogZnVuY3Rpb24gKHRvcGljKSB7XG4gICAgICAgICAgICBhc3NlcnQuaXNGYWxzZSh0b3BpYyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnYW4gaXRlbSB3aXRoIGFuIHVua25vd24gbGV2ZWwnOiB7XG4gICAgICAgIHRvcGljOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHsgbGV2ZWw6ICd3b29vJyB9O1xuICAgICAgICB9LFxuICAgICAgICAnc2V0dGluZ3Mgd2l0aCBhbiBlcnJvciByZXBvcnRMZXZlbCc6IHtcbiAgICAgICAgICB0b3BpYzogZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHZhciBzZXR0aW5ncyA9IHsgcmVwb3J0TGV2ZWw6ICdlcnJvcicgfTtcbiAgICAgICAgICAgIHJldHVybiBwLmNoZWNrTGV2ZWwoaXRlbSwgc2V0dGluZ3MpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgJ3Nob3VsZCBub3Qgc2VuZCc6IGZ1bmN0aW9uICh0b3BpYykge1xuICAgICAgICAgICAgYXNzZXJ0LmlzRmFsc2UodG9waWMpO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdzZXR0aW5ncyB3aXRoIGFuIHVua25vd24gcmVwb3J0TGV2ZWwnOiB7XG4gICAgICAgICAgdG9waWM6IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICB2YXIgc2V0dGluZ3MgPSB7IHJlcG9ydExldmVsOiAneWVzc3MnIH07XG4gICAgICAgICAgICByZXR1cm4gcC5jaGVja0xldmVsKGl0ZW0sIHNldHRpbmdzKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgICdzaG91bGQgc2VuZCc6IGZ1bmN0aW9uICh0b3BpYykge1xuICAgICAgICAgICAgYXNzZXJ0LmlzVHJ1ZSh0b3BpYyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ3NldHRpbmdzIHdpdGhvdXQgYSByZXBvcnRMZXZlbCc6IHtcbiAgICAgICAgICB0b3BpYzogZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHZhciBzZXR0aW5ncyA9IHsgbm90aGluZzogJ3RvIHNlZSBoZXJlJyB9O1xuICAgICAgICAgICAgcmV0dXJuIHAuY2hlY2tMZXZlbChpdGVtLCBzZXR0aW5ncyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAnc2hvdWxkIHNlbmQnOiBmdW5jdGlvbiAodG9waWMpIHtcbiAgICAgICAgICAgIGFzc2VydC5pc1RydWUodG9waWMpO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgJ2FuIGl0ZW0gd2l0aCBhIHdhcm5pbmcgbGV2ZWwnOiB7XG4gICAgICAgIHRvcGljOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHsgbGV2ZWw6ICd3YXJuaW5nJyB9O1xuICAgICAgICB9LFxuICAgICAgICAnc2V0dGluZ3Mgd2l0aCBhbiBlcnJvciByZXBvcnRMZXZlbCc6IHtcbiAgICAgICAgICB0b3BpYzogZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHZhciBzZXR0aW5ncyA9IHsgcmVwb3J0TGV2ZWw6ICdlcnJvcicgfTtcbiAgICAgICAgICAgIHJldHVybiBwLmNoZWNrTGV2ZWwoaXRlbSwgc2V0dGluZ3MpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgJ3Nob3VsZCBub3Qgc2VuZCc6IGZ1bmN0aW9uICh0b3BpYykge1xuICAgICAgICAgICAgYXNzZXJ0LmlzRmFsc2UodG9waWMpO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdzZXR0aW5ncyB3aXRoIGFuIGluZm8gcmVwb3J0TGV2ZWwnOiB7XG4gICAgICAgICAgdG9waWM6IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICB2YXIgc2V0dGluZ3MgPSB7IHJlcG9ydExldmVsOiAnaW5mbycgfTtcbiAgICAgICAgICAgIHJldHVybiBwLmNoZWNrTGV2ZWwoaXRlbSwgc2V0dGluZ3MpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgJ3Nob3VsZCBzZW5kJzogZnVuY3Rpb24gKHRvcGljKSB7XG4gICAgICAgICAgICBhc3NlcnQuaXNUcnVlKHRvcGljKTtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnc2V0dGluZ3Mgd2l0aCBhIHdhcm5pbmcgcmVwb3J0TGV2ZWwnOiB7XG4gICAgICAgICAgdG9waWM6IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICB2YXIgc2V0dGluZ3MgPSB7IHJlcG9ydExldmVsOiAnd2FybmluZycgfTtcbiAgICAgICAgICAgIHJldHVybiBwLmNoZWNrTGV2ZWwoaXRlbSwgc2V0dGluZ3MpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgJ3Nob3VsZCBzZW5kJzogZnVuY3Rpb24gKHRvcGljKSB7XG4gICAgICAgICAgICBhc3NlcnQuaXNUcnVlKHRvcGljKTtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9KVxuICAuZXhwb3J0KG1vZHVsZSwgeyBlcnJvcjogZmFsc2UgfSk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcblx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuX193ZWJwYWNrX3JlcXVpcmVfXy5jID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fO1xuXG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5tZCA9IChtb2R1bGUpID0+IHtcblx0bW9kdWxlLnBhdGhzID0gW107XG5cdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0cmV0dXJuIG1vZHVsZTtcbn07IiwiIiwiLy8gbW9kdWxlIGNhY2hlIGFyZSB1c2VkIHNvIGVudHJ5IGlubGluaW5nIGlzIGRpc2FibGVkXG4vLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vdGVzdC9zZXJ2ZXIucHJlZGljYXRlcy50ZXN0LmpzXCIpO1xuIiwiIl0sIm5hbWVzIjpbImhhc093biIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwidG9TdHIiLCJ0b1N0cmluZyIsImlzUGxhaW5PYmplY3QiLCJvYmoiLCJjYWxsIiwiaGFzT3duQ29uc3RydWN0b3IiLCJoYXNJc1Byb3RvdHlwZU9mIiwiY29uc3RydWN0b3IiLCJrZXkiLCJtZXJnZSIsImkiLCJzcmMiLCJjb3B5IiwiY2xvbmUiLCJuYW1lIiwicmVzdWx0IiwiY3VycmVudCIsImxlbmd0aCIsImFyZ3VtZW50cyIsIm1vZHVsZSIsImV4cG9ydHMiLCJfIiwicmVxdWlyZSIsImNoZWNrTGV2ZWwiLCJpdGVtIiwic2V0dGluZ3MiLCJsZXZlbCIsImxldmVsVmFsIiwiTEVWRUxTIiwicmVwb3J0TGV2ZWwiLCJyZXBvcnRMZXZlbFZhbCIsInVzZXJDaGVja0lnbm9yZSIsImxvZ2dlciIsImlzVW5jYXVnaHQiLCJfaXNVbmNhdWdodCIsImFyZ3MiLCJfb3JpZ2luYWxBcmdzIiwiaXNGdW5jdGlvbiIsIm9uU2VuZENhbGxiYWNrIiwiZSIsImVycm9yIiwiY2hlY2tJZ25vcmUiLCJ1cmxJc05vdEJsb2NrTGlzdGVkIiwidXJsSXNPbkFMaXN0IiwidXJsSXNTYWZlTGlzdGVkIiwibWF0Y2hGcmFtZXMiLCJ0cmFjZSIsImxpc3QiLCJibG9jayIsImZyYW1lcyIsImZyYW1lIiwiZmlsZW5hbWUiLCJ1cmwiLCJ1cmxSZWdleCIsImxpc3RMZW5ndGgiLCJmcmFtZUxlbmd0aCIsImlzVHlwZSIsImoiLCJSZWdFeHAiLCJ0ZXN0Iiwic2FmZU9yQmxvY2siLCJ0cmFjZXMiLCJob3N0QmxvY2tMaXN0IiwiaG9zdFNhZmVMaXN0IiwiZ2V0IiwidHJhY2VzTGVuZ3RoIiwibGlzdE5hbWUiLCJtZXNzYWdlSXNJZ25vcmVkIiwiaWdub3JlZE1lc3NhZ2VzIiwibGVuIiwicklnbm9yZWRNZXNzYWdlIiwibWVzc2FnZXMiLCJtZXNzYWdlc0Zyb21JdGVtIiwiYm9keSIsInRyYWNlX2NoYWluIiwidHJhY2VDaGFpbiIsInB1c2giLCJtZXNzYWdlIiwiUm9sbGJhckpTT04iLCJzZXR1cEpTT04iLCJwb2x5ZmlsbEpTT04iLCJzdHJpbmdpZnkiLCJwYXJzZSIsImlzRGVmaW5lZCIsIkpTT04iLCJpc05hdGl2ZUZ1bmN0aW9uIiwieCIsInQiLCJ0eXBlTmFtZSIsIl90eXBlb2YiLCJFcnJvciIsIm1hdGNoIiwidG9Mb3dlckNhc2UiLCJmIiwicmVSZWdFeHBDaGFyIiwiZnVuY01hdGNoU3RyaW5nIiwiRnVuY3Rpb24iLCJyZXBsYWNlIiwicmVJc05hdGl2ZSIsImlzT2JqZWN0IiwidmFsdWUiLCJ0eXBlIiwiaXNTdHJpbmciLCJTdHJpbmciLCJpc0Zpbml0ZU51bWJlciIsIm4iLCJOdW1iZXIiLCJpc0Zpbml0ZSIsInUiLCJpc0l0ZXJhYmxlIiwiaXNFcnJvciIsImlzUHJvbWlzZSIsInAiLCJ0aGVuIiwiaXNCcm93c2VyIiwid2luZG93IiwicmVkYWN0IiwidXVpZDQiLCJkIiwibm93IiwidXVpZCIsImMiLCJyIiwiTWF0aCIsInJhbmRvbSIsImZsb29yIiwiZGVidWciLCJpbmZvIiwid2FybmluZyIsImNyaXRpY2FsIiwic2FuaXRpemVVcmwiLCJiYXNlVXJsUGFydHMiLCJwYXJzZVVyaSIsImFuY2hvciIsInNvdXJjZSIsInF1ZXJ5IiwicGFyc2VVcmlPcHRpb25zIiwic3RyaWN0TW9kZSIsInEiLCJwYXJzZXIiLCJzdHJpY3QiLCJsb29zZSIsInN0ciIsInVuZGVmaW5lZCIsIm8iLCJtIiwiZXhlYyIsInVyaSIsImwiLCIkMCIsIiQxIiwiJDIiLCJhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aCIsImFjY2Vzc1Rva2VuIiwib3B0aW9ucyIsInBhcmFtcyIsImFjY2Vzc190b2tlbiIsInBhcmFtc0FycmF5IiwiayIsImpvaW4iLCJzb3J0IiwicGF0aCIsInFzIiwiaW5kZXhPZiIsImgiLCJzdWJzdHJpbmciLCJmb3JtYXRVcmwiLCJwcm90b2NvbCIsInBvcnQiLCJob3N0bmFtZSIsImJhY2t1cCIsImpzb25FcnJvciIsImJhY2t1cEVycm9yIiwibWF4Qnl0ZVNpemUiLCJzdHJpbmciLCJjb3VudCIsImNvZGUiLCJjaGFyQ29kZUF0IiwianNvblBhcnNlIiwicyIsIm1ha2VVbmhhbmRsZWRTdGFja0luZm8iLCJsaW5lbm8iLCJjb2xubyIsIm1vZGUiLCJiYWNrdXBNZXNzYWdlIiwiZXJyb3JQYXJzZXIiLCJsb2NhdGlvbiIsImxpbmUiLCJjb2x1bW4iLCJmdW5jIiwiZ3Vlc3NGdW5jdGlvbk5hbWUiLCJjb250ZXh0IiwiZ2F0aGVyQ29udGV4dCIsImhyZWYiLCJkb2N1bWVudCIsInVzZXJhZ2VudCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInN0YWNrIiwid3JhcENhbGxiYWNrIiwiZXJyIiwicmVzcCIsIm5vbkNpcmN1bGFyQ2xvbmUiLCJzZWVuIiwibmV3U2VlbiIsImluY2x1ZGVzIiwic2xpY2UiLCJjcmVhdGVJdGVtIiwibm90aWZpZXIiLCJyZXF1ZXN0S2V5cyIsImxhbWJkYUNvbnRleHQiLCJjdXN0b20iLCJjYWxsYmFjayIsInJlcXVlc3QiLCJhcmciLCJleHRyYUFyZ3MiLCJkaWFnbm9zdGljIiwiYXJnVHlwZXMiLCJ0eXAiLCJET01FeGNlcHRpb24iLCJ0aW1lc3RhbXAiLCJkYXRhIiwic2V0Q3VzdG9tSXRlbUtleXMiLCJvcmlnaW5hbF9hcmdfdHlwZXMiLCJza2lwRnJhbWVzIiwiYWRkRXJyb3JDb250ZXh0IiwiZXJyb3JzIiwiY29udGV4dEFkZGVkIiwicm9sbGJhckNvbnRleHQiLCJlcnJvcl9jb250ZXh0IiwiVEVMRU1FVFJZX1RZUEVTIiwiVEVMRU1FVFJZX0xFVkVMUyIsImFycmF5SW5jbHVkZXMiLCJhcnIiLCJ2YWwiLCJjcmVhdGVUZWxlbWV0cnlFdmVudCIsIm1ldGFkYXRhIiwiZXZlbnQiLCJhZGRJdGVtQXR0cmlidXRlcyIsImF0dHJpYnV0ZXMiLCJfaXRlbSRkYXRhJGF0dHJpYnV0ZXMiLCJhcHBseSIsIl90b0NvbnN1bWFibGVBcnJheSIsImtleXMiLCJzcGxpdCIsInNldCIsInRlbXAiLCJyZXBsYWNlbWVudCIsImZvcm1hdEFyZ3NBc1N0cmluZyIsInN1YnN0ciIsIkRhdGUiLCJmaWx0ZXJJcCIsInJlcXVlc3REYXRhIiwiY2FwdHVyZUlwIiwibmV3SXAiLCJwYXJ0cyIsInBvcCIsImJlZ2lubmluZyIsInNsYXNoSWR4IiwidGVybWluYWwiLCJjb25jYXQiLCJoYW5kbGVPcHRpb25zIiwiaW5wdXQiLCJwYXlsb2FkIiwidXBkYXRlRGVwcmVjYXRlZE9wdGlvbnMiLCJvdmVyd3JpdGVTY3J1YkZpZWxkcyIsInNjcnViRmllbGRzIiwiaG9zdFdoaXRlTGlzdCIsImxvZyIsImhvc3RCbGFja0xpc3QiXSwic291cmNlUm9vdCI6IiJ9