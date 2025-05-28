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

/***/ "./node_modules/json-stringify-safe/stringify.js":
/*!*******************************************************!*\
  !*** ./node_modules/json-stringify-safe/stringify.js ***!
  \*******************************************************/
/***/ ((module, exports) => {

exports = module.exports = stringify
exports.getSerialize = serializer

function stringify(obj, replacer, spaces, cycleReplacer) {
  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
}

function serializer(replacer, cycleReplacer) {
  var stack = [], keys = []

  if (cycleReplacer == null) cycleReplacer = function(key, value) {
    if (stack[0] === value) return "[Circular ~]"
    return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
  }

  return function(key, value) {
    if (stack.length > 0) {
      var thisPos = stack.indexOf(this)
      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
    }
    else stack.push(value)

    return replacer == null ? value : replacer.call(this, key, value)
  }
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

/***/ "./src/server/logger.js":
/*!******************************!*\
  !*** ./src/server/logger.js ***!
  \******************************/
/***/ ((module) => {

"use strict";


var verbose = true;
var logger = {
  /* eslint-disable no-console */
  log: function log() {
    if (verbose) {
      console.log.apply(console, arguments);
    }
  },
  error: function error() {
    if (verbose) {
      console.error.apply(console, arguments);
    }
  },
  /* eslint-enable no-console */
  setVerbose: function setVerbose(val) {
    verbose = val;
  }
};
module.exports = logger;

/***/ }),

/***/ "./src/server/transport.js":
/*!*********************************!*\
  !*** ./src/server/transport.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ../utility */ "./src/utility.js");
var truncation = __webpack_require__(/*! ../truncation */ "./src/truncation.js");
var logger = __webpack_require__(/*! ./logger */ "./src/server/logger.js");
var http = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'http'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var https = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'https'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var jsonBackup = __webpack_require__(/*! json-stringify-safe */ "./node_modules/json-stringify-safe/stringify.js");
var MAX_RATE_LIMIT_INTERVAL = 60;

/*
 * accessToken may be embedded in payload but that should not be assumed
 *
 * options: {
 *   hostname
 *   protocol
 *   path
 *   port
 *   method
 * }
 *
 * params is an object containing key/value pairs to be
 *    appended to the path as 'key=value&key=value'
 *
 * payload is an unserialized object
 */
function Transport() {
  this.rateLimitExpires = 0;
}
Transport.prototype.get = function (accessToken, options, params, callback, transportFactory) {
  var t;
  if (!callback || !_.isFunction(callback)) {
    callback = function callback() {};
  }
  options = options || {};
  _.addParamsAndAccessTokenToPath(accessToken, options, params);
  options.headers = _headers(accessToken, options);
  if (transportFactory) {
    t = transportFactory(options);
  } else {
    t = _transport(options);
  }
  if (!t) {
    logger.error('Unknown transport based on given protocol: ' + options.protocol);
    return callback(new Error('Unknown transport'));
  }
  var req = t.request(options, function (resp) {
    this.handleResponse(resp, callback);
  }.bind(this));
  req.on('error', function (err) {
    callback(err);
  });
  req.end();
};
Transport.prototype.post = function (accessToken, options, payload, callback, transportFactory) {
  var t;
  if (!callback || !_.isFunction(callback)) {
    callback = function callback() {};
  }
  if (_currentTime() < this.rateLimitExpires) {
    return callback(new Error('Exceeded rate limit'));
  }
  options = options || {};
  if (!payload) {
    return callback(new Error('Cannot send empty request'));
  }
  var stringifyResult = truncation.truncate(payload, jsonBackup);
  if (stringifyResult.error) {
    logger.error('Problem stringifying payload. Giving up');
    return callback(stringifyResult.error);
  }
  var writeData = stringifyResult.value;
  options.headers = _headers(accessToken, options, writeData);
  if (transportFactory) {
    t = transportFactory(options);
  } else {
    t = _transport(options);
  }
  if (!t) {
    logger.error('Unknown transport based on given protocol: ' + options.protocol);
    return callback(new Error('Unknown transport'));
  }
  var req = t.request(options, function (resp) {
    this.handleResponse(resp, _wrapPostCallback(callback));
  }.bind(this));
  req.on('error', function (err) {
    callback(err);
  });
  if (writeData) {
    req.write(writeData);
  }
  req.end();
};
Transport.prototype.updateRateLimit = function (resp) {
  var remaining = parseInt(resp.headers['x-rate-limit-remaining'] || 0);
  var remainingSeconds = Math.min(MAX_RATE_LIMIT_INTERVAL, resp.headers['x-rate-limit-remaining-seconds'] || 0);
  var currentTime = _currentTime();
  if (resp.statusCode === 429 && remaining === 0) {
    this.rateLimitExpires = currentTime + remainingSeconds;
  } else {
    this.rateLimitExpires = currentTime;
  }
};
Transport.prototype.handleResponse = function (resp, callback) {
  this.updateRateLimit(resp);
  var respData = [];
  resp.setEncoding('utf8');
  resp.on('data', function (chunk) {
    respData.push(chunk);
  });
  resp.on('end', function () {
    respData = respData.join('');
    _parseApiResponse(respData, callback);
  });
};

/** Helpers **/

function _headers(accessToken, options, data) {
  var headers = options && options.headers || {};
  headers['Content-Type'] = 'application/json';
  if (data) {
    try {
      headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
    } catch (e) {
      logger.error('Could not get the content length of the data');
    }
  }
  headers['X-Rollbar-Access-Token'] = accessToken;
  return headers;
}
function _transport(options) {
  return {
    'http:': http,
    'https:': https
  }[options.protocol];
}
function _parseApiResponse(data, callback) {
  var parsedData = _.jsonParse(data);
  if (parsedData.error) {
    logger.error('Could not parse api response, err: ' + parsedData.error);
    return callback(parsedData.error);
  }
  data = parsedData.value;
  if (data.err) {
    logger.error('Received error: ' + data.message);
    return callback(new Error('Api error: ' + (data.message || 'Unknown error')));
  }
  callback(null, data);
}
function _wrapPostCallback(callback) {
  return function (err, data) {
    if (err) {
      return callback(err);
    }
    if (data.result && data.result.uuid) {
      logger.log(['Successful api response.', ' Link: https://rollbar.com/occurrence/uuid/?uuid=' + data.result.uuid].join(''));
    } else {
      logger.log('Successful api response');
    }
    callback(null, data.result);
  };
}
function _currentTime() {
  return Math.floor(Date.now() / 1000);
}
module.exports = Transport;

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

/***/ }),

/***/ "./test/server.transport.test.js":
/*!***************************************!*\
  !*** ./test/server.transport.test.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* module decorator */ module = __webpack_require__.nmd(module);


var assert = __webpack_require__(/*! assert */ "./node_modules/assert/assert.js");
var util = __webpack_require__(/*! util */ "./node_modules/util/util.js");
var vows = __webpack_require__(/*! vows */ "./node_modules/vows/lib/vows.js");
var Transport = __webpack_require__(/*! ../src/server/transport */ "./src/server/transport.js");
var t = new Transport();

vows
  .describe('transport')
  .addBatch({
    post: {
      'base data': {
        topic: function () {
          return {
            accessToken: 'abc123',
            options: {},
            payload: {
              access_token: 'abc123',
              data: { a: 1 },
            },
          };
        },
        'with no payload': {
          topic: function (data) {
            var factory = transportFactory(
              null,
              '{"err": null, "result":"all good"}',
            );
            t.post(
              data.accessToken,
              data.options,
              null,
              this.callback,
              factory,
            );
          },
          'should have an error': function (err, resp) {
            assert.ok(err);
          },
        },
        'with a payload and no error': {
          topic: function (data) {
            var factory = transportFactory(
              null,
              '{"err": null, "result":{"uuid":"42def", "message":"all good"}}',
              function () {
                assert.equal(
                  this.options.headers['Content-Type'],
                  'application/json',
                );
                assert.isNumber(this.options.headers['Content-Length']);
                assert(this.options.headers['Content-Length'] > 0);
                assert.equal(
                  this.options.headers['X-Rollbar-Access-Token'],
                  data.accessToken,
                );
              },
            );
            t.post(
              data.accessToken,
              data.options,
              data.payload,
              this.callback,
              factory,
            );
          },
          'should not error': function (err, resp) {
            assert.ifError(err);
          },
          'should have the right response data': function (err, resp) {
            assert.equal(resp.message, 'all good');
          },
        },
        'with a payload and an error in the response': {
          topic: function (data) {
            var factory = transportFactory(
              null,
              '{"err": "bork", "message":"things broke"}',
              function () {
                assert.equal(
                  this.options.headers['Content-Type'],
                  'application/json',
                );
                assert.isNumber(this.options.headers['Content-Length']);
                assert(this.options.headers['Content-Length'] > 0);
                assert.equal(
                  this.options.headers['X-Rollbar-Access-Token'],
                  data.accessToken,
                );
              },
            );
            t.post(
              data.accessToken,
              data.options,
              data.payload,
              this.callback,
              factory,
            );
          },
          'should error': function (err, resp) {
            assert.ok(err);
          },
          'should have the message somewhere': function (err, resp) {
            assert.match(err.message, /things broke/);
          },
          'should not have a response': function (err, resp) {
            assert.ifError(resp);
          },
        },
        'with a payload and an error during sending': {
          topic: function (data) {
            var factory = transportFactory(
              new Error('bork'),
              null,
              function () {
                assert.equal(
                  this.options.headers['Content-Type'],
                  'application/json',
                );
                assert.isNumber(this.options.headers['Content-Length']);
                assert(this.options.headers['Content-Length'] > 0);
                assert.equal(
                  this.options.headers['X-Rollbar-Access-Token'],
                  data.accessToken,
                );
              },
            );
            t.post(
              data.accessToken,
              data.options,
              data.payload,
              this.callback,
              factory,
            );
          },
          'should error': function (err, resp) {
            assert.ok(err);
          },
          'should have the message somewhere': function (err, resp) {
            assert.match(err.message, /bork/);
          },
          'should not have a response': function (err, resp) {
            assert.ifError(resp);
          },
        },
      },
      'with rate limiting': {
        topic: function () {
          return new Transport();
        },
        'should transmit non-rate limited requests': function (t) {
          var response = new TestResponse({
            statusCode: 200,
            headers: {
              'x-rate-limit-remaining': '1',
              'x-rate-limit-remaining-seconds': '100',
            },
          });
          var error;

          assert.equal(t.rateLimitExpires, 0);

          t.handleResponse(response);

          var factory = transportFactory(
            null,
            '{"err": null, "result": "all good"}',
          );
          t.post(
            'token',
            {},
            'payload',
            function (err) {
              error = err;
            },
            factory,
          );

          assert.equal(error, null);
          assert.isTrue(Math.floor(Date.now() / 1000) >= t.rateLimitExpires);
        },
        'should drop rate limited requests and set timeout': function (t) {
          var response = new TestResponse({
            statusCode: 429,
            headers: {
              'x-rate-limit-remaining': '0',
              'x-rate-limit-remaining-seconds': '100',
            },
          });
          var error;

          t.handleResponse(response);

          t.post('token', {}, 'payload', function (err) {
            error = err;
          });

          assert.match(error.message, /Exceeded rate limit/);
          assert.isTrue(Math.floor(Date.now() / 1000) < t.rateLimitExpires);
        },
      },
    },
  })
  .export(module, { error: false });

var TestTransport = function (options, error, response, assertions) {
  this.options = options;
  this.error = error;
  this.response = response;
  this.requestOpts = null;
  this.requestCallback = null;
  this.assertions = assertions;
};
var TestRequest = function (error, response, transport) {
  this.error = error;
  this.responseData = response;
  this.data = [];
  this.events = {};
  this.transport = transport;
  this.response = null;
};
TestTransport.prototype.request = function (opts, cb) {
  this.requestOpts = opts;
  this.requestCallback = cb;
  return new TestRequest(this.error, this.response, this);
};
TestRequest.prototype.write = function (data) {
  this.data.push(data);
};
TestRequest.prototype.on = function (event, cb) {
  this.events[event] = cb;
};
TestRequest.prototype.end = function () {
  if (this.transport.assertions) {
    this.transport.assertions();
  }
  if (this.error) {
    if (this.events['error']) {
      this.events['error'](this.error);
    }
  } else {
    this.response = new TestResponse();
    this.transport.requestCallback(this.response);
    if (this.response.events['data']) {
      this.response.events['data'](this.responseData);
    }
    if (this.response.events['end']) {
      this.response.events['end']();
    }
  }
};
var TestResponse = function (options = {}) {
  this.encoding = null;
  this.events = {};
  this.headers = options.headers || {};
  this.statusCode = options.statusCode || 200;
};
TestResponse.prototype.setEncoding = function (s) {
  this.encoding = s;
};
TestResponse.prototype.on = function (event, cb) {
  this.events[event] = cb;
};
var transportFactory = function (error, response, assertions) {
  return function (options) {
    return new TestTransport(options, error, response, assertions);
  };
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
/******/ 	var __webpack_exports__ = __webpack_require__(__webpack_require__.s = "./test/server.transport.test.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLnRyYW5zcG9ydC50ZXN0LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7O0FDVmE7O0FBRWI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHdDQUF3QyxTQUFTO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLHFCQUFNLGtCQUFrQixxQkFBTTtBQUNwQyxXQUFXLHFCQUFNO0FBQ2pCO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVcsbUJBQU8sQ0FBQywwQ0FBTztBQUMxQjtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxxQkFBTTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBLG1EQUFtRDs7QUFFbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCLGdEQUFnRDs7QUFFaEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKLHNCQUFzQjs7QUFFdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixRQUFRO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsUUFBUTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEseUJBQXlCO0FBQ3pCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQ0FBaUM7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ3plQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEIsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsU0FBUztBQUN6QjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSTtBQUNKLHFCQUFxQixRQUFRO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFF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QVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTs7O0FBR2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRDQUE0QyxLQUFLOztBQUVqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFB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QUNBLFFBQVE7QUFDUjtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsU0FBUztBQUNULFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUEsc0JBQXNCLGtCQUFrQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXLDZCQUE2QjtBQUN4Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQSxtQ0FBbUM7O0FBRW5DO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLG1DQUFtQztBQUNuQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFD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O0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsaUJBQWlCO0FBQ3JDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLG9CQUFvQix1QkFBdUI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW9CLGtCQUFrQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBLHNDQUFzQzs7QUFFdEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjs7QUFFQTtBQUNBO0FBQ0EsUUFBUTtBQUNSOztBQUVBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLE1BQU07OztBQUdOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLFFBQVE7QUFDUjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQ0FBMkM7O0FBRTNDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEM7O0FBRTVDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCOztBQUVBO0FBQ0E7O0FBRUE7QUFD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NEI7QUFDNUI7QUFDQSxXQUFXOztBQUVYO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0gsb0JBQW9CLGNBQWM7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7VUM1UUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOztVQUVBO1VBQ0E7Ozs7O1dDNUJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQSxDQUFDOzs7OztXQ1BEOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1VFSkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vbm9kZV9tb2R1bGVzL2Fzc2VydC9hc3NlcnQuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvZXllcy9saWIvZXllcy5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vbm9kZV9tb2R1bGVzL2pzb24tc3RyaW5naWZ5LXNhZmUvc3RyaW5naWZ5LmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvdXRpbC9ub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vbm9kZV9tb2R1bGVzL3V0aWwvc3VwcG9ydC9pc0J1ZmZlckJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL25vZGVfbW9kdWxlcy91dGlsL3V0aWwuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL25vZGVfbW9kdWxlcy92b3dzL2xpYi9hc3NlcnQvZXJyb3IuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL25vZGVfbW9kdWxlcy92b3dzL2xpYi9hc3NlcnQvbWFjcm9zLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvdm93cy9saWIvYXNzZXJ0L3V0aWxzLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vbm9kZV9tb2R1bGVzL3Zvd3MvbGliL3Zvd3MvY29uc29sZS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vbm9kZV9tb2R1bGVzL3Zvd3MvbGliL3Zvd3MvY29udGV4dC5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vbm9kZV9tb2R1bGVzL3Zvd3MvbGliL3Zvd3MvZXh0cmFzLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy9yZXBvcnRlcnMvIHN5bmMgXlxcLlxcLy4qJCIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vbm9kZV9tb2R1bGVzL3Zvd3MvbGliL3Zvd3MvcmVwb3J0ZXJzL2RvdC1tYXRyaXguanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL25vZGVfbW9kdWxlcy92b3dzL2xpYi92b3dzL3JlcG9ydGVycy9qc29uLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy9yZXBvcnRlcnMvc2lsZW50LmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy9yZXBvcnRlcnMvc3BlYy5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vbm9kZV9tb2R1bGVzL3Zvd3MvbGliL3Zvd3MvcmVwb3J0ZXJzL3RhcC5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vbm9kZV9tb2R1bGVzL3Zvd3MvbGliL3Zvd3MvcmVwb3J0ZXJzL3dhdGNoLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy9yZXBvcnRlcnMveHVuaXQuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL25vZGVfbW9kdWxlcy92b3dzL2xpYi92b3dzL3N1aXRlLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvdm93cy9ub2RlX21vZHVsZXMvZGlmZi9kaXN0L2RpZmYuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9tZXJnZS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3NlcnZlci9sb2dnZXIuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9zZXJ2ZXIvdHJhbnNwb3J0LmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvdHJ1bmNhdGlvbi5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy91dGlsaXR5L3RyYXZlcnNlLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi90ZXN0L3NlcnZlci50cmFuc3BvcnQudGVzdC5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3JvbGxiYXIvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcm9sbGJhci93ZWJwYWNrL3J1bnRpbWUvbm9kZSBtb2R1bGUgZGVjb3JhdG9yIiwid2VicGFjazovL3JvbGxiYXIvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoc2VsZiwgKCkgPT4ge1xucmV0dXJuICIsIid1c2Ugc3RyaWN0JztcblxuLy8gY29tcGFyZSBhbmQgaXNCdWZmZXIgdGFrZW4gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9ibG9iLzY4MGU5ZTVlNDg4ZjIyYWFjMjc1OTlhNTdkYzg0NGE2MzE1OTI4ZGQvaW5kZXguanNcbi8vIG9yaWdpbmFsIG5vdGljZTpcblxuLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuZnVuY3Rpb24gY29tcGFyZShhLCBiKSB7XG4gIGlmIChhID09PSBiKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICB2YXIgeCA9IGEubGVuZ3RoO1xuICB2YXIgeSA9IGIubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBNYXRoLm1pbih4LCB5KTsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIHtcbiAgICAgIHggPSBhW2ldO1xuICAgICAgeSA9IGJbaV07XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgaWYgKHkgPCB4KSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cbiAgcmV0dXJuIDA7XG59XG5mdW5jdGlvbiBpc0J1ZmZlcihiKSB7XG4gIGlmIChnbG9iYWwuQnVmZmVyICYmIHR5cGVvZiBnbG9iYWwuQnVmZmVyLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGdsb2JhbC5CdWZmZXIuaXNCdWZmZXIoYik7XG4gIH1cbiAgcmV0dXJuICEhKGIgIT0gbnVsbCAmJiBiLl9pc0J1ZmZlcik7XG59XG5cbi8vIGJhc2VkIG9uIG5vZGUgYXNzZXJ0LCBvcmlnaW5hbCBub3RpY2U6XG5cbi8vIGh0dHA6Ly93aWtpLmNvbW1vbmpzLm9yZy93aWtpL1VuaXRfVGVzdGluZy8xLjBcbi8vXG4vLyBUSElTIElTIE5PVCBURVNURUQgTk9SIExJS0VMWSBUTyBXT1JLIE9VVFNJREUgVjghXG4vL1xuLy8gT3JpZ2luYWxseSBmcm9tIG5hcndoYWwuanMgKGh0dHA6Ly9uYXJ3aGFsanMub3JnKVxuLy8gQ29weXJpZ2h0IChjKSAyMDA5IFRob21hcyBSb2JpbnNvbiA8Mjgwbm9ydGguY29tPlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlICdTb2Z0d2FyZScpLCB0b1xuLy8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGVcbi8vIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vclxuLy8gc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCAnQVMgSVMnLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU5cbi8vIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cbi8vIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwvJyk7XG52YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwU2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG52YXIgZnVuY3Rpb25zSGF2ZU5hbWVzID0gKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGZvbygpIHt9Lm5hbWUgPT09ICdmb28nO1xufSgpKTtcbmZ1bmN0aW9uIHBUb1N0cmluZyAob2JqKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKTtcbn1cbmZ1bmN0aW9uIGlzVmlldyhhcnJidWYpIHtcbiAgaWYgKGlzQnVmZmVyKGFycmJ1ZikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHR5cGVvZiBnbG9iYWwuQXJyYXlCdWZmZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlci5pc1ZpZXcgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gQXJyYXlCdWZmZXIuaXNWaWV3KGFycmJ1Zik7XG4gIH1cbiAgaWYgKCFhcnJidWYpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGFycmJ1ZiBpbnN0YW5jZW9mIERhdGFWaWV3KSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGFycmJ1Zi5idWZmZXIgJiYgYXJyYnVmLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuLy8gMS4gVGhlIGFzc2VydCBtb2R1bGUgcHJvdmlkZXMgZnVuY3Rpb25zIHRoYXQgdGhyb3dcbi8vIEFzc2VydGlvbkVycm9yJ3Mgd2hlbiBwYXJ0aWN1bGFyIGNvbmRpdGlvbnMgYXJlIG5vdCBtZXQuIFRoZVxuLy8gYXNzZXJ0IG1vZHVsZSBtdXN0IGNvbmZvcm0gdG8gdGhlIGZvbGxvd2luZyBpbnRlcmZhY2UuXG5cbnZhciBhc3NlcnQgPSBtb2R1bGUuZXhwb3J0cyA9IG9rO1xuXG4vLyAyLiBUaGUgQXNzZXJ0aW9uRXJyb3IgaXMgZGVmaW5lZCBpbiBhc3NlcnQuXG4vLyBuZXcgYXNzZXJ0LkFzc2VydGlvbkVycm9yKHsgbWVzc2FnZTogbWVzc2FnZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3R1YWw6IGFjdHVhbCxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZDogZXhwZWN0ZWQgfSlcblxudmFyIHJlZ2V4ID0gL1xccypmdW5jdGlvblxccysoW15cXChcXHNdKilcXHMqLztcbi8vIGJhc2VkIG9uIGh0dHBzOi8vZ2l0aHViLmNvbS9samhhcmIvZnVuY3Rpb24ucHJvdG90eXBlLm5hbWUvYmxvYi9hZGVlZWVjOGJmY2M2MDY4YjE4N2Q3ZDlmYjNkNWJiMWQzYTMwODk5L2ltcGxlbWVudGF0aW9uLmpzXG5mdW5jdGlvbiBnZXROYW1lKGZ1bmMpIHtcbiAgaWYgKCF1dGlsLmlzRnVuY3Rpb24oZnVuYykpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGZ1bmN0aW9uc0hhdmVOYW1lcykge1xuICAgIHJldHVybiBmdW5jLm5hbWU7XG4gIH1cbiAgdmFyIHN0ciA9IGZ1bmMudG9TdHJpbmcoKTtcbiAgdmFyIG1hdGNoID0gc3RyLm1hdGNoKHJlZ2V4KTtcbiAgcmV0dXJuIG1hdGNoICYmIG1hdGNoWzFdO1xufVxuYXNzZXJ0LkFzc2VydGlvbkVycm9yID0gZnVuY3Rpb24gQXNzZXJ0aW9uRXJyb3Iob3B0aW9ucykge1xuICB0aGlzLm5hbWUgPSAnQXNzZXJ0aW9uRXJyb3InO1xuICB0aGlzLmFjdHVhbCA9IG9wdGlvbnMuYWN0dWFsO1xuICB0aGlzLmV4cGVjdGVkID0gb3B0aW9ucy5leHBlY3RlZDtcbiAgdGhpcy5vcGVyYXRvciA9IG9wdGlvbnMub3BlcmF0b3I7XG4gIGlmIChvcHRpb25zLm1lc3NhZ2UpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2U7XG4gICAgdGhpcy5nZW5lcmF0ZWRNZXNzYWdlID0gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5tZXNzYWdlID0gZ2V0TWVzc2FnZSh0aGlzKTtcbiAgICB0aGlzLmdlbmVyYXRlZE1lc3NhZ2UgPSB0cnVlO1xuICB9XG4gIHZhciBzdGFja1N0YXJ0RnVuY3Rpb24gPSBvcHRpb25zLnN0YWNrU3RhcnRGdW5jdGlvbiB8fCBmYWlsO1xuICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBzdGFja1N0YXJ0RnVuY3Rpb24pO1xuICB9IGVsc2Uge1xuICAgIC8vIG5vbiB2OCBicm93c2VycyBzbyB3ZSBjYW4gaGF2ZSBhIHN0YWNrdHJhY2VcbiAgICB2YXIgZXJyID0gbmV3IEVycm9yKCk7XG4gICAgaWYgKGVyci5zdGFjaykge1xuICAgICAgdmFyIG91dCA9IGVyci5zdGFjaztcblxuICAgICAgLy8gdHJ5IHRvIHN0cmlwIHVzZWxlc3MgZnJhbWVzXG4gICAgICB2YXIgZm5fbmFtZSA9IGdldE5hbWUoc3RhY2tTdGFydEZ1bmN0aW9uKTtcbiAgICAgIHZhciBpZHggPSBvdXQuaW5kZXhPZignXFxuJyArIGZuX25hbWUpO1xuICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgIC8vIG9uY2Ugd2UgaGF2ZSBsb2NhdGVkIHRoZSBmdW5jdGlvbiBmcmFtZVxuICAgICAgICAvLyB3ZSBuZWVkIHRvIHN0cmlwIG91dCBldmVyeXRoaW5nIGJlZm9yZSBpdCAoYW5kIGl0cyBsaW5lKVxuICAgICAgICB2YXIgbmV4dF9saW5lID0gb3V0LmluZGV4T2YoJ1xcbicsIGlkeCArIDEpO1xuICAgICAgICBvdXQgPSBvdXQuc3Vic3RyaW5nKG5leHRfbGluZSArIDEpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnN0YWNrID0gb3V0O1xuICAgIH1cbiAgfVxufTtcblxuLy8gYXNzZXJ0LkFzc2VydGlvbkVycm9yIGluc3RhbmNlb2YgRXJyb3JcbnV0aWwuaW5oZXJpdHMoYXNzZXJ0LkFzc2VydGlvbkVycm9yLCBFcnJvcik7XG5cbmZ1bmN0aW9uIHRydW5jYXRlKHMsIG4pIHtcbiAgaWYgKHR5cGVvZiBzID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBzLmxlbmd0aCA8IG4gPyBzIDogcy5zbGljZSgwLCBuKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcztcbiAgfVxufVxuZnVuY3Rpb24gaW5zcGVjdChzb21ldGhpbmcpIHtcbiAgaWYgKGZ1bmN0aW9uc0hhdmVOYW1lcyB8fCAhdXRpbC5pc0Z1bmN0aW9uKHNvbWV0aGluZykpIHtcbiAgICByZXR1cm4gdXRpbC5pbnNwZWN0KHNvbWV0aGluZyk7XG4gIH1cbiAgdmFyIHJhd25hbWUgPSBnZXROYW1lKHNvbWV0aGluZyk7XG4gIHZhciBuYW1lID0gcmF3bmFtZSA/ICc6ICcgKyByYXduYW1lIDogJyc7XG4gIHJldHVybiAnW0Z1bmN0aW9uJyArICBuYW1lICsgJ10nO1xufVxuZnVuY3Rpb24gZ2V0TWVzc2FnZShzZWxmKSB7XG4gIHJldHVybiB0cnVuY2F0ZShpbnNwZWN0KHNlbGYuYWN0dWFsKSwgMTI4KSArICcgJyArXG4gICAgICAgICBzZWxmLm9wZXJhdG9yICsgJyAnICtcbiAgICAgICAgIHRydW5jYXRlKGluc3BlY3Qoc2VsZi5leHBlY3RlZCksIDEyOCk7XG59XG5cbi8vIEF0IHByZXNlbnQgb25seSB0aGUgdGhyZWUga2V5cyBtZW50aW9uZWQgYWJvdmUgYXJlIHVzZWQgYW5kXG4vLyB1bmRlcnN0b29kIGJ5IHRoZSBzcGVjLiBJbXBsZW1lbnRhdGlvbnMgb3Igc3ViIG1vZHVsZXMgY2FuIHBhc3Ncbi8vIG90aGVyIGtleXMgdG8gdGhlIEFzc2VydGlvbkVycm9yJ3MgY29uc3RydWN0b3IgLSB0aGV5IHdpbGwgYmVcbi8vIGlnbm9yZWQuXG5cbi8vIDMuIEFsbCBvZiB0aGUgZm9sbG93aW5nIGZ1bmN0aW9ucyBtdXN0IHRocm93IGFuIEFzc2VydGlvbkVycm9yXG4vLyB3aGVuIGEgY29ycmVzcG9uZGluZyBjb25kaXRpb24gaXMgbm90IG1ldCwgd2l0aCBhIG1lc3NhZ2UgdGhhdFxuLy8gbWF5IGJlIHVuZGVmaW5lZCBpZiBub3QgcHJvdmlkZWQuICBBbGwgYXNzZXJ0aW9uIG1ldGhvZHMgcHJvdmlkZVxuLy8gYm90aCB0aGUgYWN0dWFsIGFuZCBleHBlY3RlZCB2YWx1ZXMgdG8gdGhlIGFzc2VydGlvbiBlcnJvciBmb3Jcbi8vIGRpc3BsYXkgcHVycG9zZXMuXG5cbmZ1bmN0aW9uIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgb3BlcmF0b3IsIHN0YWNrU3RhcnRGdW5jdGlvbikge1xuICB0aHJvdyBuZXcgYXNzZXJ0LkFzc2VydGlvbkVycm9yKHtcbiAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgIGFjdHVhbDogYWN0dWFsLFxuICAgIGV4cGVjdGVkOiBleHBlY3RlZCxcbiAgICBvcGVyYXRvcjogb3BlcmF0b3IsXG4gICAgc3RhY2tTdGFydEZ1bmN0aW9uOiBzdGFja1N0YXJ0RnVuY3Rpb25cbiAgfSk7XG59XG5cbi8vIEVYVEVOU0lPTiEgYWxsb3dzIGZvciB3ZWxsIGJlaGF2ZWQgZXJyb3JzIGRlZmluZWQgZWxzZXdoZXJlLlxuYXNzZXJ0LmZhaWwgPSBmYWlsO1xuXG4vLyA0LiBQdXJlIGFzc2VydGlvbiB0ZXN0cyB3aGV0aGVyIGEgdmFsdWUgaXMgdHJ1dGh5LCBhcyBkZXRlcm1pbmVkXG4vLyBieSAhIWd1YXJkLlxuLy8gYXNzZXJ0Lm9rKGd1YXJkLCBtZXNzYWdlX29wdCk7XG4vLyBUaGlzIHN0YXRlbWVudCBpcyBlcXVpdmFsZW50IHRvIGFzc2VydC5lcXVhbCh0cnVlLCAhIWd1YXJkLFxuLy8gbWVzc2FnZV9vcHQpOy4gVG8gdGVzdCBzdHJpY3RseSBmb3IgdGhlIHZhbHVlIHRydWUsIHVzZVxuLy8gYXNzZXJ0LnN0cmljdEVxdWFsKHRydWUsIGd1YXJkLCBtZXNzYWdlX29wdCk7LlxuXG5mdW5jdGlvbiBvayh2YWx1ZSwgbWVzc2FnZSkge1xuICBpZiAoIXZhbHVlKSBmYWlsKHZhbHVlLCB0cnVlLCBtZXNzYWdlLCAnPT0nLCBhc3NlcnQub2spO1xufVxuYXNzZXJ0Lm9rID0gb2s7XG5cbi8vIDUuIFRoZSBlcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgc2hhbGxvdywgY29lcmNpdmUgZXF1YWxpdHkgd2l0aFxuLy8gPT0uXG4vLyBhc3NlcnQuZXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuZXF1YWwgPSBmdW5jdGlvbiBlcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgIT0gZXhwZWN0ZWQpIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJz09JywgYXNzZXJ0LmVxdWFsKTtcbn07XG5cbi8vIDYuIFRoZSBub24tZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIGZvciB3aGV0aGVyIHR3byBvYmplY3RzIGFyZSBub3QgZXF1YWxcbi8vIHdpdGggIT0gYXNzZXJ0Lm5vdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdEVxdWFsID0gZnVuY3Rpb24gbm90RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsID09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnIT0nLCBhc3NlcnQubm90RXF1YWwpO1xuICB9XG59O1xuXG4vLyA3LiBUaGUgZXF1aXZhbGVuY2UgYXNzZXJ0aW9uIHRlc3RzIGEgZGVlcCBlcXVhbGl0eSByZWxhdGlvbi5cbi8vIGFzc2VydC5kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuZGVlcEVxdWFsID0gZnVuY3Rpb24gZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKCFfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIGZhbHNlKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ2RlZXBFcXVhbCcsIGFzc2VydC5kZWVwRXF1YWwpO1xuICB9XG59O1xuXG5hc3NlcnQuZGVlcFN0cmljdEVxdWFsID0gZnVuY3Rpb24gZGVlcFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKCFfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIHRydWUpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnZGVlcFN0cmljdEVxdWFsJywgYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIF9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgc3RyaWN0LCBtZW1vcykge1xuICAvLyA3LjEuIEFsbCBpZGVudGljYWwgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBhcyBkZXRlcm1pbmVkIGJ5ID09PS5cbiAgaWYgKGFjdHVhbCA9PT0gZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChpc0J1ZmZlcihhY3R1YWwpICYmIGlzQnVmZmVyKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBjb21wYXJlKGFjdHVhbCwgZXhwZWN0ZWQpID09PSAwO1xuXG4gIC8vIDcuMi4gSWYgdGhlIGV4cGVjdGVkIHZhbHVlIGlzIGEgRGF0ZSBvYmplY3QsIHRoZSBhY3R1YWwgdmFsdWUgaXNcbiAgLy8gZXF1aXZhbGVudCBpZiBpdCBpcyBhbHNvIGEgRGF0ZSBvYmplY3QgdGhhdCByZWZlcnMgdG8gdGhlIHNhbWUgdGltZS5cbiAgfSBlbHNlIGlmICh1dGlsLmlzRGF0ZShhY3R1YWwpICYmIHV0aWwuaXNEYXRlKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBhY3R1YWwuZ2V0VGltZSgpID09PSBleHBlY3RlZC5nZXRUaW1lKCk7XG5cbiAgLy8gNy4zIElmIHRoZSBleHBlY3RlZCB2YWx1ZSBpcyBhIFJlZ0V4cCBvYmplY3QsIHRoZSBhY3R1YWwgdmFsdWUgaXNcbiAgLy8gZXF1aXZhbGVudCBpZiBpdCBpcyBhbHNvIGEgUmVnRXhwIG9iamVjdCB3aXRoIHRoZSBzYW1lIHNvdXJjZSBhbmRcbiAgLy8gcHJvcGVydGllcyAoYGdsb2JhbGAsIGBtdWx0aWxpbmVgLCBgbGFzdEluZGV4YCwgYGlnbm9yZUNhc2VgKS5cbiAgfSBlbHNlIGlmICh1dGlsLmlzUmVnRXhwKGFjdHVhbCkgJiYgdXRpbC5pc1JlZ0V4cChleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gYWN0dWFsLnNvdXJjZSA9PT0gZXhwZWN0ZWQuc291cmNlICYmXG4gICAgICAgICAgIGFjdHVhbC5nbG9iYWwgPT09IGV4cGVjdGVkLmdsb2JhbCAmJlxuICAgICAgICAgICBhY3R1YWwubXVsdGlsaW5lID09PSBleHBlY3RlZC5tdWx0aWxpbmUgJiZcbiAgICAgICAgICAgYWN0dWFsLmxhc3RJbmRleCA9PT0gZXhwZWN0ZWQubGFzdEluZGV4ICYmXG4gICAgICAgICAgIGFjdHVhbC5pZ25vcmVDYXNlID09PSBleHBlY3RlZC5pZ25vcmVDYXNlO1xuXG4gIC8vIDcuNC4gT3RoZXIgcGFpcnMgdGhhdCBkbyBub3QgYm90aCBwYXNzIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JyxcbiAgLy8gZXF1aXZhbGVuY2UgaXMgZGV0ZXJtaW5lZCBieSA9PS5cbiAgfSBlbHNlIGlmICgoYWN0dWFsID09PSBudWxsIHx8IHR5cGVvZiBhY3R1YWwgIT09ICdvYmplY3QnKSAmJlxuICAgICAgICAgICAgIChleHBlY3RlZCA9PT0gbnVsbCB8fCB0eXBlb2YgZXhwZWN0ZWQgIT09ICdvYmplY3QnKSkge1xuICAgIHJldHVybiBzdHJpY3QgPyBhY3R1YWwgPT09IGV4cGVjdGVkIDogYWN0dWFsID09IGV4cGVjdGVkO1xuXG4gIC8vIElmIGJvdGggdmFsdWVzIGFyZSBpbnN0YW5jZXMgb2YgdHlwZWQgYXJyYXlzLCB3cmFwIHRoZWlyIHVuZGVybHlpbmdcbiAgLy8gQXJyYXlCdWZmZXJzIGluIGEgQnVmZmVyIGVhY2ggdG8gaW5jcmVhc2UgcGVyZm9ybWFuY2VcbiAgLy8gVGhpcyBvcHRpbWl6YXRpb24gcmVxdWlyZXMgdGhlIGFycmF5cyB0byBoYXZlIHRoZSBzYW1lIHR5cGUgYXMgY2hlY2tlZCBieVxuICAvLyBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nIChha2EgcFRvU3RyaW5nKS4gTmV2ZXIgcGVyZm9ybSBiaW5hcnlcbiAgLy8gY29tcGFyaXNvbnMgZm9yIEZsb2F0KkFycmF5cywgdGhvdWdoLCBzaW5jZSBlLmcuICswID09PSAtMCBidXQgdGhlaXJcbiAgLy8gYml0IHBhdHRlcm5zIGFyZSBub3QgaWRlbnRpY2FsLlxuICB9IGVsc2UgaWYgKGlzVmlldyhhY3R1YWwpICYmIGlzVmlldyhleHBlY3RlZCkgJiZcbiAgICAgICAgICAgICBwVG9TdHJpbmcoYWN0dWFsKSA9PT0gcFRvU3RyaW5nKGV4cGVjdGVkKSAmJlxuICAgICAgICAgICAgICEoYWN0dWFsIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5IHx8XG4gICAgICAgICAgICAgICBhY3R1YWwgaW5zdGFuY2VvZiBGbG9hdDY0QXJyYXkpKSB7XG4gICAgcmV0dXJuIGNvbXBhcmUobmV3IFVpbnQ4QXJyYXkoYWN0dWFsLmJ1ZmZlciksXG4gICAgICAgICAgICAgICAgICAgbmV3IFVpbnQ4QXJyYXkoZXhwZWN0ZWQuYnVmZmVyKSkgPT09IDA7XG5cbiAgLy8gNy41IEZvciBhbGwgb3RoZXIgT2JqZWN0IHBhaXJzLCBpbmNsdWRpbmcgQXJyYXkgb2JqZWN0cywgZXF1aXZhbGVuY2UgaXNcbiAgLy8gZGV0ZXJtaW5lZCBieSBoYXZpbmcgdGhlIHNhbWUgbnVtYmVyIG9mIG93bmVkIHByb3BlcnRpZXMgKGFzIHZlcmlmaWVkXG4gIC8vIHdpdGggT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKSwgdGhlIHNhbWUgc2V0IG9mIGtleXNcbiAgLy8gKGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlciksIGVxdWl2YWxlbnQgdmFsdWVzIGZvciBldmVyeVxuICAvLyBjb3JyZXNwb25kaW5nIGtleSwgYW5kIGFuIGlkZW50aWNhbCAncHJvdG90eXBlJyBwcm9wZXJ0eS4gTm90ZTogdGhpc1xuICAvLyBhY2NvdW50cyBmb3IgYm90aCBuYW1lZCBhbmQgaW5kZXhlZCBwcm9wZXJ0aWVzIG9uIEFycmF5cy5cbiAgfSBlbHNlIGlmIChpc0J1ZmZlcihhY3R1YWwpICE9PSBpc0J1ZmZlcihleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgbWVtb3MgPSBtZW1vcyB8fCB7YWN0dWFsOiBbXSwgZXhwZWN0ZWQ6IFtdfTtcblxuICAgIHZhciBhY3R1YWxJbmRleCA9IG1lbW9zLmFjdHVhbC5pbmRleE9mKGFjdHVhbCk7XG4gICAgaWYgKGFjdHVhbEluZGV4ICE9PSAtMSkge1xuICAgICAgaWYgKGFjdHVhbEluZGV4ID09PSBtZW1vcy5leHBlY3RlZC5pbmRleE9mKGV4cGVjdGVkKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtZW1vcy5hY3R1YWwucHVzaChhY3R1YWwpO1xuICAgIG1lbW9zLmV4cGVjdGVkLnB1c2goZXhwZWN0ZWQpO1xuXG4gICAgcmV0dXJuIG9iakVxdWl2KGFjdHVhbCwgZXhwZWN0ZWQsIHN0cmljdCwgbWVtb3MpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzQXJndW1lbnRzKG9iamVjdCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkgPT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG59XG5cbmZ1bmN0aW9uIG9iakVxdWl2KGEsIGIsIHN0cmljdCwgYWN0dWFsVmlzaXRlZE9iamVjdHMpIHtcbiAgaWYgKGEgPT09IG51bGwgfHwgYSA9PT0gdW5kZWZpbmVkIHx8IGIgPT09IG51bGwgfHwgYiA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBmYWxzZTtcbiAgLy8gaWYgb25lIGlzIGEgcHJpbWl0aXZlLCB0aGUgb3RoZXIgbXVzdCBiZSBzYW1lXG4gIGlmICh1dGlsLmlzUHJpbWl0aXZlKGEpIHx8IHV0aWwuaXNQcmltaXRpdmUoYikpXG4gICAgcmV0dXJuIGEgPT09IGI7XG4gIGlmIChzdHJpY3QgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKGEpICE9PSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoYikpXG4gICAgcmV0dXJuIGZhbHNlO1xuICB2YXIgYUlzQXJncyA9IGlzQXJndW1lbnRzKGEpO1xuICB2YXIgYklzQXJncyA9IGlzQXJndW1lbnRzKGIpO1xuICBpZiAoKGFJc0FyZ3MgJiYgIWJJc0FyZ3MpIHx8ICghYUlzQXJncyAmJiBiSXNBcmdzKSlcbiAgICByZXR1cm4gZmFsc2U7XG4gIGlmIChhSXNBcmdzKSB7XG4gICAgYSA9IHBTbGljZS5jYWxsKGEpO1xuICAgIGIgPSBwU2xpY2UuY2FsbChiKTtcbiAgICByZXR1cm4gX2RlZXBFcXVhbChhLCBiLCBzdHJpY3QpO1xuICB9XG4gIHZhciBrYSA9IG9iamVjdEtleXMoYSk7XG4gIHZhciBrYiA9IG9iamVjdEtleXMoYik7XG4gIHZhciBrZXksIGk7XG4gIC8vIGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoa2V5cyBpbmNvcnBvcmF0ZXNcbiAgLy8gaGFzT3duUHJvcGVydHkpXG4gIGlmIChrYS5sZW5ndGggIT09IGtiLmxlbmd0aClcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vdGhlIHNhbWUgc2V0IG9mIGtleXMgKGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlciksXG4gIGthLnNvcnQoKTtcbiAga2Iuc29ydCgpO1xuICAvL35+fmNoZWFwIGtleSB0ZXN0XG4gIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKGthW2ldICE9PSBrYltpXSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvL2VxdWl2YWxlbnQgdmFsdWVzIGZvciBldmVyeSBjb3JyZXNwb25kaW5nIGtleSwgYW5kXG4gIC8vfn5+cG9zc2libHkgZXhwZW5zaXZlIGRlZXAgdGVzdFxuICBmb3IgKGkgPSBrYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGtleSA9IGthW2ldO1xuICAgIGlmICghX2RlZXBFcXVhbChhW2tleV0sIGJba2V5XSwgc3RyaWN0LCBhY3R1YWxWaXNpdGVkT2JqZWN0cykpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIDguIFRoZSBub24tZXF1aXZhbGVuY2UgYXNzZXJ0aW9uIHRlc3RzIGZvciBhbnkgZGVlcCBpbmVxdWFsaXR5LlxuLy8gYXNzZXJ0Lm5vdERlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3REZWVwRXF1YWwgPSBmdW5jdGlvbiBub3REZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBmYWxzZSkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdub3REZWVwRXF1YWwnLCBhc3NlcnQubm90RGVlcEVxdWFsKTtcbiAgfVxufTtcblxuYXNzZXJ0Lm5vdERlZXBTdHJpY3RFcXVhbCA9IG5vdERlZXBTdHJpY3RFcXVhbDtcbmZ1bmN0aW9uIG5vdERlZXBTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIHRydWUpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnbm90RGVlcFN0cmljdEVxdWFsJywgbm90RGVlcFN0cmljdEVxdWFsKTtcbiAgfVxufVxuXG5cbi8vIDkuIFRoZSBzdHJpY3QgZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIHN0cmljdCBlcXVhbGl0eSwgYXMgZGV0ZXJtaW5lZCBieSA9PT0uXG4vLyBhc3NlcnQuc3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuc3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBzdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgIT09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnPT09JywgYXNzZXJ0LnN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuLy8gMTAuIFRoZSBzdHJpY3Qgbm9uLWVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBmb3Igc3RyaWN0IGluZXF1YWxpdHksIGFzXG4vLyBkZXRlcm1pbmVkIGJ5ICE9PS4gIGFzc2VydC5ub3RTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3RTdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIG5vdFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCA9PT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICchPT0nLCBhc3NlcnQubm90U3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSB7XG4gIGlmICghYWN0dWFsIHx8ICFleHBlY3RlZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZXhwZWN0ZWQpID09ICdbb2JqZWN0IFJlZ0V4cF0nKSB7XG4gICAgcmV0dXJuIGV4cGVjdGVkLnRlc3QoYWN0dWFsKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgaWYgKGFjdHVhbCBpbnN0YW5jZW9mIGV4cGVjdGVkKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBJZ25vcmUuICBUaGUgaW5zdGFuY2VvZiBjaGVjayBkb2Vzbid0IHdvcmsgZm9yIGFycm93IGZ1bmN0aW9ucy5cbiAgfVxuXG4gIGlmIChFcnJvci5pc1Byb3RvdHlwZU9mKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBleHBlY3RlZC5jYWxsKHt9LCBhY3R1YWwpID09PSB0cnVlO1xufVxuXG5mdW5jdGlvbiBfdHJ5QmxvY2soYmxvY2spIHtcbiAgdmFyIGVycm9yO1xuICB0cnkge1xuICAgIGJsb2NrKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBlcnJvciA9IGU7XG4gIH1cbiAgcmV0dXJuIGVycm9yO1xufVxuXG5mdW5jdGlvbiBfdGhyb3dzKHNob3VsZFRocm93LCBibG9jaywgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgdmFyIGFjdHVhbDtcblxuICBpZiAodHlwZW9mIGJsb2NrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJibG9ja1wiIGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBleHBlY3RlZCA9PT0gJ3N0cmluZycpIHtcbiAgICBtZXNzYWdlID0gZXhwZWN0ZWQ7XG4gICAgZXhwZWN0ZWQgPSBudWxsO1xuICB9XG5cbiAgYWN0dWFsID0gX3RyeUJsb2NrKGJsb2NrKTtcblxuICBtZXNzYWdlID0gKGV4cGVjdGVkICYmIGV4cGVjdGVkLm5hbWUgPyAnICgnICsgZXhwZWN0ZWQubmFtZSArICcpLicgOiAnLicpICtcbiAgICAgICAgICAgIChtZXNzYWdlID8gJyAnICsgbWVzc2FnZSA6ICcuJyk7XG5cbiAgaWYgKHNob3VsZFRocm93ICYmICFhY3R1YWwpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsICdNaXNzaW5nIGV4cGVjdGVkIGV4Y2VwdGlvbicgKyBtZXNzYWdlKTtcbiAgfVxuXG4gIHZhciB1c2VyUHJvdmlkZWRNZXNzYWdlID0gdHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnO1xuICB2YXIgaXNVbndhbnRlZEV4Y2VwdGlvbiA9ICFzaG91bGRUaHJvdyAmJiB1dGlsLmlzRXJyb3IoYWN0dWFsKTtcbiAgdmFyIGlzVW5leHBlY3RlZEV4Y2VwdGlvbiA9ICFzaG91bGRUaHJvdyAmJiBhY3R1YWwgJiYgIWV4cGVjdGVkO1xuXG4gIGlmICgoaXNVbndhbnRlZEV4Y2VwdGlvbiAmJlxuICAgICAgdXNlclByb3ZpZGVkTWVzc2FnZSAmJlxuICAgICAgZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkpIHx8XG4gICAgICBpc1VuZXhwZWN0ZWRFeGNlcHRpb24pIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsICdHb3QgdW53YW50ZWQgZXhjZXB0aW9uJyArIG1lc3NhZ2UpO1xuICB9XG5cbiAgaWYgKChzaG91bGRUaHJvdyAmJiBhY3R1YWwgJiYgZXhwZWN0ZWQgJiZcbiAgICAgICFleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSkgfHwgKCFzaG91bGRUaHJvdyAmJiBhY3R1YWwpKSB7XG4gICAgdGhyb3cgYWN0dWFsO1xuICB9XG59XG5cbi8vIDExLiBFeHBlY3RlZCB0byB0aHJvdyBhbiBlcnJvcjpcbi8vIGFzc2VydC50aHJvd3MoYmxvY2ssIEVycm9yX29wdCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQudGhyb3dzID0gZnVuY3Rpb24oYmxvY2ssIC8qb3B0aW9uYWwqL2Vycm9yLCAvKm9wdGlvbmFsKi9tZXNzYWdlKSB7XG4gIF90aHJvd3ModHJ1ZSwgYmxvY2ssIGVycm9yLCBtZXNzYWdlKTtcbn07XG5cbi8vIEVYVEVOU0lPTiEgVGhpcyBpcyBhbm5veWluZyB0byB3cml0ZSBvdXRzaWRlIHRoaXMgbW9kdWxlLlxuYXNzZXJ0LmRvZXNOb3RUaHJvdyA9IGZ1bmN0aW9uKGJsb2NrLCAvKm9wdGlvbmFsKi9lcnJvciwgLypvcHRpb25hbCovbWVzc2FnZSkge1xuICBfdGhyb3dzKGZhbHNlLCBibG9jaywgZXJyb3IsIG1lc3NhZ2UpO1xufTtcblxuYXNzZXJ0LmlmRXJyb3IgPSBmdW5jdGlvbihlcnIpIHsgaWYgKGVycikgdGhyb3cgZXJyOyB9O1xuXG52YXIgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIGtleXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChoYXNPd24uY2FsbChvYmosIGtleSkpIGtleXMucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiBrZXlzO1xufTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuICgnICsgZXIgKyAnKScpO1xuICAgICAgICBlcnIuY29udGV4dCA9IGVyO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSBpZiAobGlzdGVuZXJzKSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAodGhpcy5fZXZlbnRzKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgICBpZiAoaXNGdW5jdGlvbihldmxpc3RlbmVyKSlcbiAgICAgIHJldHVybiAxO1xuICAgIGVsc2UgaWYgKGV2bGlzdGVuZXIpXG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsIi8vXG4vLyBFeWVzLmpzIC0gYSBjdXN0b21pemFibGUgdmFsdWUgaW5zcGVjdG9yIGZvciBOb2RlLmpzXG4vL1xuLy8gICB1c2FnZTpcbi8vXG4vLyAgICAgICB2YXIgaW5zcGVjdCA9IHJlcXVpcmUoJ2V5ZXMnKS5pbnNwZWN0b3Ioe3N0eWxlczoge2FsbDogJ21hZ2VudGEnfX0pO1xuLy8gICAgICAgaW5zcGVjdChzb21ldGhpbmcpOyAvLyBpbnNwZWN0IHdpdGggdGhlIHNldHRpbmdzIHBhc3NlZCB0byBgaW5zcGVjdG9yYFxuLy9cbi8vICAgICBvclxuLy9cbi8vICAgICAgIHZhciBleWVzID0gcmVxdWlyZSgnZXllcycpO1xuLy8gICAgICAgZXllcy5pbnNwZWN0KHNvbWV0aGluZyk7IC8vIGluc3BlY3Qgd2l0aCB0aGUgZGVmYXVsdCBzZXR0aW5nc1xuLy9cbnZhciBleWVzID0gZXhwb3J0cyxcbiAgICBzdGFjayA9IFtdO1xuXG5leWVzLmRlZmF1bHRzID0ge1xuICAgIHN0eWxlczogeyAgICAgICAgICAgICAgICAgLy8gU3R5bGVzIGFwcGxpZWQgdG8gc3Rkb3V0XG4gICAgICAgIGFsbDogICAgICdjeWFuJywgICAgICAvLyBPdmVyYWxsIHN0eWxlIGFwcGxpZWQgdG8gZXZlcnl0aGluZ1xuICAgICAgICBsYWJlbDogICAndW5kZXJsaW5lJywgLy8gSW5zcGVjdGlvbiBsYWJlbHMsIGxpa2UgJ2FycmF5JyBpbiBgYXJyYXk6IFsxLCAyLCAzXWBcbiAgICAgICAgb3RoZXI6ICAgJ2ludmVydGVkJywgIC8vIE9iamVjdHMgd2hpY2ggZG9uJ3QgaGF2ZSBhIGxpdGVyYWwgcmVwcmVzZW50YXRpb24sIHN1Y2ggYXMgZnVuY3Rpb25zXG4gICAgICAgIGtleTogICAgICdib2xkJywgICAgICAvLyBUaGUga2V5cyBpbiBvYmplY3QgbGl0ZXJhbHMsIGxpa2UgJ2EnIGluIGB7YTogMX1gXG4gICAgICAgIHNwZWNpYWw6ICdncmV5JywgICAgICAvLyBudWxsLCB1bmRlZmluZWQuLi5cbiAgICAgICAgc3RyaW5nOiAgJ2dyZWVuJyxcbiAgICAgICAgbnVtYmVyOiAgJ21hZ2VudGEnLFxuICAgICAgICBib29sOiAgICAnYmx1ZScsICAgICAgLy8gdHJ1ZSBmYWxzZVxuICAgICAgICByZWdleHA6ICAnZ3JlZW4nLCAgICAgLy8gL1xcZCsvXG4gICAgfSxcbiAgICBwcmV0dHk6IHRydWUsICAgICAgICAgICAgIC8vIEluZGVudCBvYmplY3QgbGl0ZXJhbHNcbiAgICBoaWRlRnVuY3Rpb25zOiBmYWxzZSxcbiAgICBzaG93SGlkZGVuOiBmYWxzZSxcbiAgICBzdHJlYW06IHByb2Nlc3Muc3Rkb3V0LFxuICAgIG1heExlbmd0aDogMjA0OCAgICAgICAgICAgLy8gVHJ1bmNhdGUgb3V0cHV0IGlmIGxvbmdlclxufTtcblxuLy8gUmV0dXJuIGEgY3VycmllZCBpbnNwZWN0KCkgZnVuY3Rpb24sIHdpdGggdGhlIGBvcHRpb25zYCBhcmd1bWVudCBmaWxsZWQgaW4uXG5leWVzLmluc3BlY3RvciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHJldHVybiBmdW5jdGlvbiAob2JqLCBsYWJlbCwgb3B0cykge1xuICAgICAgICByZXR1cm4gdGhhdC5pbnNwZWN0LmNhbGwodGhhdCwgb2JqLCBsYWJlbCxcbiAgICAgICAgICAgIG1lcmdlKG9wdGlvbnMgfHwge30sIG9wdHMgfHwge30pKTtcbiAgICB9O1xufTtcblxuLy8gSWYgd2UgaGF2ZSBhIGBzdHJlYW1gIGRlZmluZWQsIHVzZSBpdCB0byBwcmludCBhIHN0eWxlZCBzdHJpbmcsXG4vLyBpZiBub3QsIHdlIGp1c3QgcmV0dXJuIHRoZSBzdHJpbmdpZmllZCBvYmplY3QuXG5leWVzLmluc3BlY3QgPSBmdW5jdGlvbiAob2JqLCBsYWJlbCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBtZXJnZSh0aGlzLmRlZmF1bHRzLCBvcHRpb25zIHx8IHt9KTtcblxuICAgIGlmIChvcHRpb25zLnN0cmVhbSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmludChzdHJpbmdpZnkob2JqLCBvcHRpb25zKSwgbGFiZWwsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzdHJpbmdpZnkob2JqLCBvcHRpb25zKSArIChvcHRpb25zLnN0eWxlcyA/ICdcXDAzM1szOW0nIDogJycpO1xuICAgIH1cbn07XG5cbi8vIE91dHB1dCB1c2luZyB0aGUgJ3N0cmVhbScsIGFuZCBhbiBvcHRpb25hbCBsYWJlbFxuLy8gTG9vcCB0aHJvdWdoIGBzdHJgLCBhbmQgdHJ1bmNhdGUgaXQgYWZ0ZXIgYG9wdGlvbnMubWF4TGVuZ3RoYCBoYXMgYmVlbiByZWFjaGVkLlxuLy8gQmVjYXVzZSBlc2NhcGUgc2VxdWVuY2VzIGFyZSwgYXQgdGhpcyBwb2ludCBlbWJlZGVkIHdpdGhpblxuLy8gdGhlIG91dHB1dCBzdHJpbmcsIHdlIGNhbid0IG1lYXN1cmUgdGhlIGxlbmd0aCBvZiB0aGUgc3RyaW5nXG4vLyBpbiBhIHVzZWZ1bCB3YXksIHdpdGhvdXQgc2VwYXJhdGluZyB3aGF0IGlzIGFuIGVzY2FwZSBzZXF1ZW5jZSxcbi8vIHZlcnN1cyBhIHByaW50YWJsZSBjaGFyYWN0ZXIgKGBjYCkuIFNvIHdlIHJlc29ydCB0byBjb3VudGluZyB0aGVcbi8vIGxlbmd0aCBtYW51YWxseS5cbmV5ZXMucHJpbnQgPSBmdW5jdGlvbiAoc3RyLCBsYWJlbCwgb3B0aW9ucykge1xuICAgIGZvciAodmFyIGMgPSAwLCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoc3RyLmNoYXJBdChpKSA9PT0gJ1xcMDMzJykgeyBpICs9IDQgfSAvLyBgNGAgYmVjYXVzZSAnXFwwMzNbMjVtJy5sZW5ndGggKyAxID09IDVcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gb3B0aW9ucy5tYXhMZW5ndGgpIHtcbiAgICAgICAgICAgc3RyID0gc3RyLnNsaWNlKDAsIGkgLSAxKSArICfigKYnO1xuICAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIHsgYysrIH1cbiAgICB9XG4gICAgcmV0dXJuIG9wdGlvbnMuc3RyZWFtLndyaXRlLmNhbGwob3B0aW9ucy5zdHJlYW0sIChsYWJlbCA/XG4gICAgICAgIHRoaXMuc3R5bGl6ZShsYWJlbCwgb3B0aW9ucy5zdHlsZXMubGFiZWwsIG9wdGlvbnMuc3R5bGVzKSArICc6ICcgOiAnJykgK1xuICAgICAgICB0aGlzLnN0eWxpemUoc3RyLCAgIG9wdGlvbnMuc3R5bGVzLmFsbCwgb3B0aW9ucy5zdHlsZXMpICsgJ1xcMDMzWzBtJyArIFwiXFxuXCIpO1xufTtcblxuLy8gQXBwbHkgYSBzdHlsZSB0byBhIHN0cmluZywgZXZlbnR1YWxseSxcbi8vIEknZCBsaWtlIHRoaXMgdG8gc3VwcG9ydCBwYXNzaW5nIG11bHRpcGxlXG4vLyBzdHlsZXMuXG5leWVzLnN0eWxpemUgPSBmdW5jdGlvbiAoc3RyLCBzdHlsZSwgc3R5bGVzKSB7XG4gICAgdmFyIGNvZGVzID0ge1xuICAgICAgICAnYm9sZCcgICAgICA6IFsxLCAgMjJdLFxuICAgICAgICAndW5kZXJsaW5lJyA6IFs0LCAgMjRdLFxuICAgICAgICAnaW52ZXJzZScgICA6IFs3LCAgMjddLFxuICAgICAgICAnY3lhbicgICAgICA6IFszNiwgMzldLFxuICAgICAgICAnbWFnZW50YScgICA6IFszNSwgMzldLFxuICAgICAgICAnYmx1ZScgICAgICA6IFszNCwgMzldLFxuICAgICAgICAneWVsbG93JyAgICA6IFszMywgMzldLFxuICAgICAgICAnZ3JlZW4nICAgICA6IFszMiwgMzldLFxuICAgICAgICAncmVkJyAgICAgICA6IFszMSwgMzldLFxuICAgICAgICAnZ3JleScgICAgICA6IFs5MCwgMzldXG4gICAgfSwgZW5kQ29kZTtcblxuICAgIGlmIChzdHlsZSAmJiBjb2Rlc1tzdHlsZV0pIHtcbiAgICAgICAgZW5kQ29kZSA9IChjb2Rlc1tzdHlsZV1bMV0gPT09IDM5ICYmIHN0eWxlcy5hbGwpID8gY29kZXNbc3R5bGVzLmFsbF1bMF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogY29kZXNbc3R5bGVdWzFdO1xuICAgICAgICByZXR1cm4gJ1xcMDMzWycgKyBjb2Rlc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAgICAgJ1xcMDMzWycgKyBlbmRDb2RlICsgJ20nO1xuICAgIH0gZWxzZSB7IHJldHVybiBzdHIgfVxufTtcblxuLy8gQ29udmVydCBhbnkgb2JqZWN0IHRvIGEgc3RyaW5nLCByZWFkeSBmb3Igb3V0cHV0LlxuLy8gV2hlbiBhbiAnYXJyYXknIG9yIGFuICdvYmplY3QnIGFyZSBlbmNvdW50ZXJlZCwgdGhleSBhcmVcbi8vIHBhc3NlZCB0byBzcGVjaWFsaXplZCBmdW5jdGlvbnMsIHdoaWNoIGNhbiB0aGVuIHJlY3Vyc2l2ZWx5IGNhbGxcbi8vIHN0cmluZ2lmeSgpLlxuZnVuY3Rpb24gc3RyaW5naWZ5KG9iaiwgb3B0aW9ucykge1xuICAgIHZhciB0aGF0ID0gdGhpcywgc3R5bGl6ZSA9IGZ1bmN0aW9uIChzdHIsIHN0eWxlKSB7XG4gICAgICAgIHJldHVybiBleWVzLnN0eWxpemUoc3RyLCBvcHRpb25zLnN0eWxlc1tzdHlsZV0sIG9wdGlvbnMuc3R5bGVzKVxuICAgIH0sIGluZGV4LCByZXN1bHQ7XG5cbiAgICBpZiAoKGluZGV4ID0gc3RhY2suaW5kZXhPZihvYmopKSAhPT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIHN0eWxpemUobmV3KEFycmF5KShzdGFjay5sZW5ndGggLSBpbmRleCArIDEpLmpvaW4oJy4nKSwgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgc3RhY2sucHVzaChvYmopO1xuXG4gICAgcmVzdWx0ID0gKGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgc3dpdGNoICh0eXBlT2Yob2JqKSkge1xuICAgICAgICAgICAgY2FzZSBcInN0cmluZ1wiICAgOiBvYmogPSBzdHJpbmdpZnlTdHJpbmcob2JqLmluZGV4T2YoXCInXCIpID09PSAtMSA/IFwiJ1wiICsgb2JqICsgXCInXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdcIicgKyBvYmogKyAnXCInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHlsaXplKG9iaiwgJ3N0cmluZycpO1xuICAgICAgICAgICAgY2FzZSBcInJlZ2V4cFwiICAgOiByZXR1cm4gc3R5bGl6ZSgnLycgKyBvYmouc291cmNlICsgJy8nLCAncmVnZXhwJyk7XG4gICAgICAgICAgICBjYXNlIFwibnVtYmVyXCIgICA6IHJldHVybiBzdHlsaXplKG9iaiArICcnLCAgICAnbnVtYmVyJyk7XG4gICAgICAgICAgICBjYXNlIFwiZnVuY3Rpb25cIiA6IHJldHVybiBvcHRpb25zLnN0cmVhbSA/IHN0eWxpemUoXCJGdW5jdGlvblwiLCAnb3RoZXInKSA6ICdbRnVuY3Rpb25dJztcbiAgICAgICAgICAgIGNhc2UgXCJudWxsXCIgICAgIDogcmV0dXJuIHN0eWxpemUoXCJudWxsXCIsICAgICAgJ3NwZWNpYWwnKTtcbiAgICAgICAgICAgIGNhc2UgXCJ1bmRlZmluZWRcIjogcmV0dXJuIHN0eWxpemUoXCJ1bmRlZmluZWRcIiwgJ3NwZWNpYWwnKTtcbiAgICAgICAgICAgIGNhc2UgXCJib29sZWFuXCIgIDogcmV0dXJuIHN0eWxpemUob2JqICsgJycsICAgICdib29sJyk7XG4gICAgICAgICAgICBjYXNlIFwiZGF0ZVwiICAgICA6IHJldHVybiBzdHlsaXplKG9iai50b1VUQ1N0cmluZygpKTtcbiAgICAgICAgICAgIGNhc2UgXCJhcnJheVwiICAgIDogcmV0dXJuIHN0cmluZ2lmeUFycmF5KG9iaiwgIG9wdGlvbnMsIHN0YWNrLmxlbmd0aCk7XG4gICAgICAgICAgICBjYXNlIFwib2JqZWN0XCIgICA6IHJldHVybiBzdHJpbmdpZnlPYmplY3Qob2JqLCBvcHRpb25zLCBzdGFjay5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgfSkob2JqKTtcblxuICAgIHN0YWNrLnBvcCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyBFc2NhcGUgaW52aXNpYmxlIGNoYXJhY3RlcnMgaW4gYSBzdHJpbmdcbmZ1bmN0aW9uIHN0cmluZ2lmeVN0cmluZyAoc3RyLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgJ1xcXFxuJylcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL1tcXHUwMDAxLVxcdTAwMUZdL2csIGZ1bmN0aW9uIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuICdcXFxcMCcgKyBtYXRjaFswXS5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDgpO1xuICAgICAgICAgICAgICB9KTtcbn1cblxuLy8gQ29udmVydCBhbiBhcnJheSB0byBhIHN0cmluZywgc3VjaCBhcyBbMSwgMiwgM10uXG4vLyBUaGlzIGZ1bmN0aW9uIGNhbGxzIHN0cmluZ2lmeSgpIGZvciBlYWNoIG9mIHRoZSBlbGVtZW50c1xuLy8gaW4gdGhlIGFycmF5LlxuZnVuY3Rpb24gc3RyaW5naWZ5QXJyYXkoYXJ5LCBvcHRpb25zLCBsZXZlbCkge1xuICAgIHZhciBvdXQgPSBbXTtcbiAgICB2YXIgcHJldHR5ID0gb3B0aW9ucy5wcmV0dHkgJiYgKGFyeS5sZW5ndGggPiA0IHx8IGFyeS5zb21lKGZ1bmN0aW9uIChvKSB7XG4gICAgICAgIHJldHVybiAobyAhPT0gbnVsbCAmJiB0eXBlb2YobykgPT09ICdvYmplY3QnICYmIE9iamVjdC5rZXlzKG8pLmxlbmd0aCA+IDApIHx8XG4gICAgICAgICAgICAgICAoQXJyYXkuaXNBcnJheShvKSAmJiBvLmxlbmd0aCA+IDApO1xuICAgIH0pKTtcbiAgICB2YXIgd3MgPSBwcmV0dHkgPyAnXFxuJyArIG5ldyhBcnJheSkobGV2ZWwgKiA0ICsgMSkuam9pbignICcpIDogJyAnO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgb3V0LnB1c2goc3RyaW5naWZ5KGFyeVtpXSwgb3B0aW9ucykpO1xuICAgIH1cblxuICAgIGlmIChvdXQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiAnW10nO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAnWycgKyB3c1xuICAgICAgICAgICAgICAgICAgICsgb3V0LmpvaW4oJywnICsgKHByZXR0eSA/IHdzIDogJyAnKSlcbiAgICAgICAgICAgICAgICAgICArIChwcmV0dHkgPyB3cy5zbGljZSgwLCAtNCkgOiB3cykgK1xuICAgICAgICAgICAgICAgJ10nO1xuICAgIH1cbn07XG5cbi8vIENvbnZlcnQgYW4gb2JqZWN0IHRvIGEgc3RyaW5nLCBzdWNoIGFzIHthOiAxfS5cbi8vIFRoaXMgZnVuY3Rpb24gY2FsbHMgc3RyaW5naWZ5KCkgZm9yIGVhY2ggb2YgaXRzIHZhbHVlcyxcbi8vIGFuZCBkb2VzIG5vdCBvdXRwdXQgZnVuY3Rpb25zIG9yIHByb3RvdHlwZSB2YWx1ZXMuXG5mdW5jdGlvbiBzdHJpbmdpZnlPYmplY3Qob2JqLCBvcHRpb25zLCBsZXZlbCkge1xuICAgIHZhciBvdXQgPSBbXTtcbiAgICB2YXIgcHJldHR5ID0gb3B0aW9ucy5wcmV0dHkgJiYgKE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID4gMiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMob2JqKS5zb21lKGZ1bmN0aW9uIChrKSB7IHJldHVybiB0eXBlb2Yob2JqW2tdKSA9PT0gJ29iamVjdCcgfSkpO1xuICAgIHZhciB3cyA9IHByZXR0eSA/ICdcXG4nICsgbmV3KEFycmF5KShsZXZlbCAqIDQgKyAxKS5qb2luKCcgJykgOiAnICc7XG5cbiAgICB2YXIga2V5cyA9IG9wdGlvbnMuc2hvd0hpZGRlbiA/IE9iamVjdC5rZXlzKG9iaikgOiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopO1xuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaykgXG4gICAgICAgICAgJiYgIShvYmpba10gaW5zdGFuY2VvZiBGdW5jdGlvbiAmJiBvcHRpb25zLmhpZGVGdW5jdGlvbnMpKSB7XG4gICAgICAgICAgICBvdXQucHVzaChleWVzLnN0eWxpemUoaywgb3B0aW9ucy5zdHlsZXMua2V5LCBvcHRpb25zLnN0eWxlcykgKyAnOiAnICtcbiAgICAgICAgICAgICAgICAgICAgIHN0cmluZ2lmeShvYmpba10sIG9wdGlvbnMpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKG91dC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuICd7fSc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwie1wiICsgd3NcbiAgICAgICAgICAgICAgICAgICArIG91dC5qb2luKCcsJyArIChwcmV0dHkgPyB3cyA6ICcgJykpXG4gICAgICAgICAgICAgICAgICAgKyAocHJldHR5ID8gd3Muc2xpY2UoMCwgLTQpIDogd3MpICtcbiAgICAgICAgICAgICAgIFwifVwiO1xuICAgfVxufTtcblxuLy8gQSBiZXR0ZXIgYHR5cGVvZmBcbmZ1bmN0aW9uIHR5cGVPZih2YWx1ZSkge1xuICAgIHZhciBzID0gdHlwZW9mKHZhbHVlKSxcbiAgICAgICAgdHlwZXMgPSBbT2JqZWN0LCBBcnJheSwgU3RyaW5nLCBSZWdFeHAsIE51bWJlciwgRnVuY3Rpb24sIEJvb2xlYW4sIERhdGVdO1xuXG4gICAgaWYgKHMgPT09ICdvYmplY3QnIHx8IHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICB0eXBlcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgdCkgeyBzID0gdC5uYW1lLnRvTG93ZXJDYXNlKCkgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7IHMgPSAnbnVsbCcgfVxuICAgIH1cbiAgICByZXR1cm4gcztcbn1cblxuZnVuY3Rpb24gbWVyZ2UoLyogdmFyaWFibGUgYXJncyAqLykge1xuICAgIHZhciBvYmpzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgdGFyZ2V0ID0ge307XG5cbiAgICBvYmpzLmZvckVhY2goZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgT2JqZWN0LmtleXMobykuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICAgICAgaWYgKGsgPT09ICdzdHlsZXMnKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEgby5zdHlsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZXMgPSB7fVxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBzIGluIG8uc3R5bGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGVzW3NdID0gby5zdHlsZXNbc107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhcmdldFtrXSA9IG9ba107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiB0YXJnZXQ7XG59XG5cbiIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHN0cmluZ2lmeVxuZXhwb3J0cy5nZXRTZXJpYWxpemUgPSBzZXJpYWxpemVyXG5cbmZ1bmN0aW9uIHN0cmluZ2lmeShvYmosIHJlcGxhY2VyLCBzcGFjZXMsIGN5Y2xlUmVwbGFjZXIpIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaiwgc2VyaWFsaXplcihyZXBsYWNlciwgY3ljbGVSZXBsYWNlciksIHNwYWNlcylcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplcihyZXBsYWNlciwgY3ljbGVSZXBsYWNlcikge1xuICB2YXIgc3RhY2sgPSBbXSwga2V5cyA9IFtdXG5cbiAgaWYgKGN5Y2xlUmVwbGFjZXIgPT0gbnVsbCkgY3ljbGVSZXBsYWNlciA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICBpZiAoc3RhY2tbMF0gPT09IHZhbHVlKSByZXR1cm4gXCJbQ2lyY3VsYXIgfl1cIlxuICAgIHJldHVybiBcIltDaXJjdWxhciB+LlwiICsga2V5cy5zbGljZSgwLCBzdGFjay5pbmRleE9mKHZhbHVlKSkuam9pbihcIi5cIikgKyBcIl1cIlxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICBpZiAoc3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgdmFyIHRoaXNQb3MgPSBzdGFjay5pbmRleE9mKHRoaXMpXG4gICAgICB+dGhpc1BvcyA/IHN0YWNrLnNwbGljZSh0aGlzUG9zICsgMSkgOiBzdGFjay5wdXNoKHRoaXMpXG4gICAgICB+dGhpc1BvcyA/IGtleXMuc3BsaWNlKHRoaXNQb3MsIEluZmluaXR5LCBrZXkpIDoga2V5cy5wdXNoKGtleSlcbiAgICAgIGlmICh+c3RhY2suaW5kZXhPZih2YWx1ZSkpIHZhbHVlID0gY3ljbGVSZXBsYWNlci5jYWxsKHRoaXMsIGtleSwgdmFsdWUpXG4gICAgfVxuICAgIGVsc2Ugc3RhY2sucHVzaCh2YWx1ZSlcblxuICAgIHJldHVybiByZXBsYWNlciA9PSBudWxsID8gdmFsdWUgOiByZXBsYWNlci5jYWxsKHRoaXMsIGtleSwgdmFsdWUpXG4gIH1cbn1cbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICYmIHR5cGVvZiBhcmcuY29weSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcuZmlsbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xufSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cbiIsIi8qKlxuVGhpcyBzb2Z0d2FyZSBjb250YWlucyBjb2RlIGFkYXB0ZWQgZnJvbSBNb2NoYVxuKGh0dHBzOi8vZ2l0aHViLmNvbS92aXNpb25tZWRpYS9tb2NoYSkgYnkgVEogSG9sb3dheWNodWtcbmFuZCBpcyB1c2VkIGhlcmVpbiB1bmRlciB0aGUgZm9sbG93aW5nIE1JVCBsaWNlbnNlOlxuXG5Db3B5cmlnaHQgKGMpIDIwMTEtMjAxMiBUSiBIb2xvd2F5Y2h1ayA8dGpAdmlzaW9uLW1lZGlhLmNhPlxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmdcbmEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuJ1NvZnR3YXJlJyksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xud2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG5wZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cbnRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcbmluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgJ0FTIElTJywgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbkVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTllcbkNMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsXG5UT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRVxuU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4qL1xuXG52YXIgc3R5bGl6ZSA9IHJlcXVpcmUoJy4uL3Zvd3MvY29uc29sZScpLnN0eWxpemU7XG52YXIgaW5zcGVjdCA9IHJlcXVpcmUoJy4uL3Zvd3MvY29uc29sZScpLmluc3BlY3Q7XG52YXIgZGlmZiA9IHJlcXVpcmUoJ2RpZmYnKTtcblxuLyoqXG4gKiBQYWQgdGhlIGdpdmVuIGBzdHJgIHRvIGBsZW5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBsZW5cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhZChzdHIsIGxlbikge1xuICBzdHIgPSBTdHJpbmcoc3RyKTtcbiAgcmV0dXJuIEFycmF5KGxlbiAtIHN0ci5sZW5ndGggKyAxKS5qb2luKCcgJykgKyBzdHI7XG59XG5cbi8qKlxuICogQ29sb3IgbGluZXMgZm9yIGBzdHJgLCB1c2luZyB0aGUgY29sb3IgYG5hbWVgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzdHlsZUxpbmVzKHN0ciwgbmFtZSkge1xuICByZXR1cm4gc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24oc3RyKXtcbiAgICByZXR1cm4gc3R5bGl6ZShzdHIsIG5hbWUpO1xuICB9KS5qb2luKCdcXG4nKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBjaGFyYWN0ZXIgZGlmZiBmb3IgYGVycmAuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBlcnJvckRpZmYoZXJyLCB0eXBlKSB7XG4gIHJldHVybiBkaWZmWydkaWZmJyArIHR5cGVdKGVyci5leHBlY3RlZCwgZXJyLmFjdHVhbCkubWFwKGZ1bmN0aW9uKHN0cil7XG4gICAgaWYgKC9eKFxcbispJC8udGVzdChzdHIudmFsdWUpKSBzdHIudmFsdWUgPSBBcnJheSgrK1JlZ0V4cC4kMS5sZW5ndGgpLmpvaW4oJzxuZXdsaW5lPicpO1xuICAgIGlmIChzdHIuYWRkZWQpIHJldHVybiBzdHlsZUxpbmVzKHN0ci52YWx1ZSwgJ2dyZWVuJyk7XG4gICAgaWYgKHN0ci5yZW1vdmVkKSByZXR1cm4gc3R5bGVMaW5lcyhzdHIudmFsdWUsICdyZWQnKTtcbiAgICByZXR1cm4gc3RyLnZhbHVlO1xuICB9KS5qb2luKCcnKTtcbn1cblxuZnVuY3Rpb24gZXh0cmFjdFBhdGhGcm9tU3RhY2soc3RhY2spIHtcbiAgICB2YXIgcmVnZXggPSAvXFwoKC4qP1thLXpBLVowLTkuXy1dK1xcLig/OmpzfGNvZmZlZSkpKDpcXGQrKTpcXGQrXFwpLztcbiAgICByZXR1cm4gc3RhY2subWF0Y2gocmVnZXgpO1xufVxuXG4vKlxuIERvIG5vdCBvdmVycmlkZSAudG9TdHJpbmcoKSB3aGVuIHRoaXMuc3RhY2sgaXMgdXNlZCxcbiBvdGhlcndpc2UgdGhpcyB3aWxsIGVuZCBpbiBhbiBlbmRsZXNzIHJlY3Vyc2l2ZSBjYWxsLi4uXG4gU2VlIGlzc3VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jbG91ZGhlYWQvdm93cy9pc3N1ZXMvMjc4I2lzc3VlY29tbWVudC0yMjgzNzQ5M1xuKi9cbnJlcXVpcmUoJ2Fzc2VydCcpLkFzc2VydGlvbkVycm9yLnByb3RvdHlwZS50b1N0cmluZ0V4ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgc291cmNlO1xuXG4gICAgaWYgKHRoaXMuc3RhY2spIHtcbiAgICAgICAgc291cmNlID0gZXh0cmFjdFBhdGhGcm9tU3RhY2sodGhpcy5zdGFjayk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2Uoc3RyKSB7XG4gICAgICAgIHZhciBhY3R1YWwgPSB0aGF0LmFjdHVhbCxcbiAgICAgICAgICAgIGV4cGVjdGVkID0gdGhhdC5leHBlY3RlZCxcbiAgICAgICAgICAgIG1zZywgbGVuO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICdzdHJpbmcnID09PSB0eXBlb2YgYWN0dWFsICYmXG4gICAgICAgICAgICAnc3RyaW5nJyA9PT0gdHlwZW9mIGV4cGVjdGVkXG4gICAgICAgICkge1xuICAgICAgICAgICAgbGVuID0gTWF0aC5tYXgoYWN0dWFsLmxlbmd0aCwgZXhwZWN0ZWQubGVuZ3RoKTtcblxuICAgICAgICAgICAgaWYgKGxlbiA8IDIwKSBtc2cgPSBlcnJvckRpZmYodGhhdCwgJ0NoYXJzJyk7XG4gICAgICAgICAgICBlbHNlIG1zZyA9IGVycm9yRGlmZih0aGF0LCAnV29yZHMnKTtcblxuICAgICAgICAgICAgLy8gbGluZW5vc1xuICAgICAgICAgICAgdmFyIGxpbmVzID0gbXNnLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgICAgIGlmIChsaW5lcy5sZW5ndGggPiA0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHdpZHRoID0gU3RyaW5nKGxpbmVzLmxlbmd0aCkubGVuZ3RoO1xuICAgICAgICAgICAgICAgIG1zZyA9IGxpbmVzLm1hcChmdW5jdGlvbihzdHIsIGkpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFkKCsraSwgd2lkdGgpICsgJyB8JyArICcgJyArIHN0cjtcbiAgICAgICAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gbGVnZW5kXG4gICAgICAgICAgICBtc2cgPSAnXFxuJ1xuICAgICAgICAgICAgICAgICsgc3R5bGl6ZSgnYWN0dWFsJywgJ2dyZWVuJylcbiAgICAgICAgICAgICAgICArICcgJ1xuICAgICAgICAgICAgICAgICsgc3R5bGl6ZSgnZXhwZWN0ZWQnLCAncmVkJylcbiAgICAgICAgICAgICAgICArICdcXG5cXG4nXG4gICAgICAgICAgICAgICAgKyBtc2dcbiAgICAgICAgICAgICAgICArICdcXG4nO1xuXG4gICAgICAgICAgICAvLyBpbmRlbnRcbiAgICAgICAgICAgIG1zZyA9IG1zZy5yZXBsYWNlKC9eL2dtLCAnICAgICAgJyk7XG5cbiAgICAgICAgICAgIHJldHVybiBtc2c7XG4gICAgICAgIH1cblxuICAgICAgICBhY3R1YWwgPSBpbnNwZWN0KGFjdHVhbCwge3Nob3dIaWRkZW46IGFjdHVhbCBpbnN0YW5jZW9mIEVycm9yfSk7XG5cbiAgICAgICAgaWYgKGV4cGVjdGVkIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICAgIGV4cGVjdGVkID0gZXhwZWN0ZWQubmFtZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGV4cGVjdGVkID0gaW5zcGVjdChleHBlY3RlZCwge3Nob3dIaWRkZW46IGFjdHVhbCBpbnN0YW5jZW9mIEVycm9yfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL3thY3R1YWx9L2csICAgYWN0dWFsKS5cbiAgICAgICAgICAgICAgICAgICByZXBsYWNlKC97b3BlcmF0b3J9L2csIHN0eWxpemUodGhhdC5vcGVyYXRvciwgJ2JvbGQnKSkuXG4gICAgICAgICAgICAgICAgICAgcmVwbGFjZSgve2V4cGVjdGVkfS9nLCBleHBlY3RlZCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubWVzc2FnZSkge1xuICAgICAgICB2YXIgbXNnID0gc3R5bGl6ZShwYXJzZSh0aGlzLm1lc3NhZ2UpLCAneWVsbG93Jyk7XG4gICAgICBcdGlmIChzb3VyY2UpIHtcbiAgICAgIFx0XHQgIG1zZyArPSBzdHlsaXplKCcgLy8gJyArIHNvdXJjZVsxXSArIHNvdXJjZVsyXSwgJ2dyZXknKTtcbiAgICAgIFx0fVxuICAgICAgICByZXR1cm4gbXNnO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzdHlsaXplKFtcbiAgICAgICAgICAgIHRoaXMuZXhwZWN0ZWQsXG4gICAgICAgICAgICB0aGlzLm9wZXJhdG9yLFxuICAgICAgICAgICAgdGhpcy5hY3R1YWxcbiAgICAgICAgXS5qb2luKCcgJyksICd5ZWxsb3cnKTtcbiAgICB9XG59O1xuXG4iLCJ2YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0JyksXG4gICAgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBtZXNzYWdlcyA9IHtcbiAgICAnZXF1YWwnICAgICAgIDogXCJleHBlY3RlZCB7ZXhwZWN0ZWR9LFxcblxcdGdvdFxcdCB7YWN0dWFsfSAoe29wZXJhdG9yfSlcIixcbiAgICAnbm90RXF1YWwnICAgIDogXCJkaWRuJ3QgZXhwZWN0IHthY3R1YWx9ICh7b3BlcmF0b3J9KVwiXG59O1xubWVzc2FnZXNbJ3N0cmljdEVxdWFsJ10gICAgPSBtZXNzYWdlc1snZGVlcEVxdWFsJ10gICAgPSBtZXNzYWdlc1snZXF1YWwnXTtcbm1lc3NhZ2VzWydub3RTdHJpY3RFcXVhbCddID0gbWVzc2FnZXNbJ25vdERlZXBFcXVhbCddID0gbWVzc2FnZXNbJ25vdEVxdWFsJ107XG5cbmZvciAodmFyIGtleSBpbiBtZXNzYWdlcykge1xuICAgIGFzc2VydFtrZXldID0gKGZ1bmN0aW9uIChrZXksIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICAgICAgICAgICAgY2FsbGJhY2soYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSB8fCBtZXNzYWdlc1trZXldKTtcbiAgICAgICAgfTtcbiAgICB9KShrZXksIGFzc2VydFtrZXldKTtcbn1cblxuYXNzZXJ0LmVwc2lsb24gPSBmdW5jdGlvbiAoZXBzLCBhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gICAgYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmd1bWVudHMsIGFzc2VydC5lcHNpbG9uKTtcbiAgICBpZiAoaXNOYU4oZXBzKSkge1xuICAgICAgICBhc3NlcnQuZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlIHx8IFwiY2Fubm90IGNvbXBhcmUge2FjdHVhbH0gd2l0aCB7ZXhwZWN0ZWR9IFxcdTAwQjEgTmFOXCIpO1xuICAgIH0gZWxzZSBpZiAoaXNOYU4oYWN0dWFsKSB8fCBNYXRoLmFicyhhY3R1YWwgLSBleHBlY3RlZCkgPiBlcHMpIHtcbiAgICAgICAgYXNzZXJ0LmZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSB8fCBcImV4cGVjdGVkIHtleHBlY3RlZH0gXFx1MDBCMVwiKyBlcHMgK1wiLCBidXQgd2FzIHthY3R1YWx9XCIpO1xuICAgIH1cbn07XG5cbmFzc2VydC5vayA9IChmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICBhc3NlcnRNaXNzaW5nQXJndW1lbnRzKGFyZ3VtZW50cywgYXNzZXJ0Lm9rKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGFjdHVhbCwgbWVzc2FnZSkge1xuICAgICAgICBjYWxsYmFjayhhY3R1YWwsIG1lc3NhZ2UgfHwgIFwiZXhwZWN0ZWQgZXhwcmVzc2lvbiB0byBldmFsdWF0ZSB0byB7ZXhwZWN0ZWR9LCBidXQgd2FzIHthY3R1YWx9XCIpO1xuICAgIH07XG59KShhc3NlcnQub2spO1xuXG5hc3NlcnQubWF0Y2ggPSBmdW5jdGlvbiAoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICAgIGFzc2VydE1pc3NpbmdBcmd1bWVudHMoYXJndW1lbnRzLCBhc3NlcnQubWF0Y2gpO1xuICAgIGlmICghIGV4cGVjdGVkLnRlc3QoYWN0dWFsKSkge1xuICAgICAgICBhc3NlcnQuZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlIHx8IFwiZXhwZWN0ZWQge2FjdHVhbH0gdG8gbWF0Y2gge2V4cGVjdGVkfVwiLCBcIm1hdGNoXCIsIGFzc2VydC5tYXRjaCk7XG4gICAgfVxufTtcbmFzc2VydC5tYXRjaGVzID0gYXNzZXJ0Lm1hdGNoO1xuXG5hc3NlcnQuaXNUcnVlID0gZnVuY3Rpb24gKGFjdHVhbCwgbWVzc2FnZSkge1xuICAgIGFzc2VydE1pc3NpbmdBcmd1bWVudHMoYXJndW1lbnRzLCBhc3NlcnQuaXNUcnVlKTtcbiAgICBpZiAoYWN0dWFsICE9PSB0cnVlKSB7XG4gICAgICAgIGFzc2VydC5mYWlsKGFjdHVhbCwgdHJ1ZSwgbWVzc2FnZSB8fCBcImV4cGVjdGVkIHtleHBlY3RlZH0sIGdvdCB7YWN0dWFsfVwiLCBcIj09PVwiLCBhc3NlcnQuaXNUcnVlKTtcbiAgICB9XG59O1xuYXNzZXJ0LmlzRmFsc2UgPSBmdW5jdGlvbiAoYWN0dWFsLCBtZXNzYWdlKSB7XG4gICAgYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmd1bWVudHMsIGFzc2VydC5pc0ZhbHNlKTtcbiAgICBpZiAoYWN0dWFsICE9PSBmYWxzZSkge1xuICAgICAgICBhc3NlcnQuZmFpbChhY3R1YWwsIGZhbHNlLCBtZXNzYWdlIHx8IFwiZXhwZWN0ZWQge2V4cGVjdGVkfSwgZ290IHthY3R1YWx9XCIsIFwiPT09XCIsIGFzc2VydC5pc0ZhbHNlKTtcbiAgICB9XG59O1xuYXNzZXJ0LmlzWmVybyA9IGZ1bmN0aW9uIChhY3R1YWwsIG1lc3NhZ2UpIHtcbiAgICBhc3NlcnRNaXNzaW5nQXJndW1lbnRzKGFyZ3VtZW50cywgYXNzZXJ0LmlzWmVybyk7XG4gICAgaWYgKGFjdHVhbCAhPT0gMCkge1xuICAgICAgICBhc3NlcnQuZmFpbChhY3R1YWwsIDAsIG1lc3NhZ2UgfHwgXCJleHBlY3RlZCB7ZXhwZWN0ZWR9LCBnb3Qge2FjdHVhbH1cIiwgXCI9PT1cIiwgYXNzZXJ0LmlzWmVybyk7XG4gICAgfVxufTtcbmFzc2VydC5pc05vdFplcm8gPSBmdW5jdGlvbiAoYWN0dWFsLCBtZXNzYWdlKSB7XG4gICAgYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmd1bWVudHMsIGFzc2VydC5pc05vdFplcm8pO1xuICAgIGlmIChhY3R1YWwgPT09IDApIHtcbiAgICAgICAgYXNzZXJ0LmZhaWwoYWN0dWFsLCAwLCBtZXNzYWdlIHx8IFwiZXhwZWN0ZWQgbm9uLXplcm8gdmFsdWUsIGdvdCB7YWN0dWFsfVwiLCBcIj09PVwiLCBhc3NlcnQuaXNOb3RaZXJvKTtcbiAgICB9XG59O1xuXG5hc3NlcnQuZ3JlYXRlciA9IGZ1bmN0aW9uIChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gICAgYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmd1bWVudHMsIGFzc2VydC5ncmVhdGVyKTtcbiAgICBpZiAoYWN0dWFsIDw9IGV4cGVjdGVkKSB7XG4gICAgICAgIGFzc2VydC5mYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UgfHwgXCJleHBlY3RlZCB7YWN0dWFsfSB0byBiZSBncmVhdGVyIHRoYW4ge2V4cGVjdGVkfVwiLCBcIj5cIiwgYXNzZXJ0LmdyZWF0ZXIpO1xuICAgIH1cbn07XG5hc3NlcnQubGVzc2VyID0gZnVuY3Rpb24gKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgICBhc3NlcnRNaXNzaW5nQXJndW1lbnRzKGFyZ3VtZW50cywgYXNzZXJ0Lmxlc3Nlcik7XG4gICAgaWYgKGFjdHVhbCA+PSBleHBlY3RlZCkge1xuICAgICAgICBhc3NlcnQuZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlIHx8IFwiZXhwZWN0ZWQge2FjdHVhbH0gdG8gYmUgbGVzc2VyIHRoYW4ge2V4cGVjdGVkfVwiLCBcIjxcIiwgYXNzZXJ0Lmxlc3Nlcik7XG4gICAgfVxufTtcblxuYXNzZXJ0LmluRGVsdGEgPSBmdW5jdGlvbiAoYWN0dWFsLCBleHBlY3RlZCwgZGVsdGEsIG1lc3NhZ2UpIHtcbiAgICBhc3NlcnRNaXNzaW5nQXJndW1lbnRzKGFyZ3VtZW50cywgYXNzZXJ0LmluRGVsdGEpO1xuICAgIHZhciBsb3dlciA9IGV4cGVjdGVkIC0gZGVsdGE7XG4gICAgdmFyIHVwcGVyID0gZXhwZWN0ZWQgKyBkZWx0YTtcbiAgICBpZiAoYWN0dWFsICE9ICthY3R1YWwgfHwgYWN0dWFsIDwgbG93ZXIgfHwgYWN0dWFsID4gdXBwZXIpIHtcbiAgICAgICAgYXNzZXJ0LmZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSB8fCBcImV4cGVjdGVkIHthY3R1YWx9IHRvIGJlIGluIHdpdGhpbiAqXCIgKyBkZWx0YS50b1N0cmluZygpICsgXCIqIG9mIHtleHBlY3RlZH1cIiwgbnVsbCwgYXNzZXJ0LmluRGVsdGEpO1xuICAgIH1cbn07XG5cbi8vXG4vLyBJbmNsdXNpb25cbi8vXG5hc3NlcnQuaW5jbHVkZSA9IGZ1bmN0aW9uIChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gICAgYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmd1bWVudHMsIGFzc2VydC5pbmNsdWRlKTtcbiAgICBpZiAoKGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgaWYgKGlzQXJyYXkob2JqKSB8fCBpc1N0cmluZyhvYmopKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqLmluZGV4T2YoZXhwZWN0ZWQpID09PSAtMTtcbiAgICAgICAgfSBlbHNlIGlmIChpc09iamVjdChhY3R1YWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gISBvYmouaGFzT3duUHJvcGVydHkoZXhwZWN0ZWQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pKGFjdHVhbCkpIHtcbiAgICAgICAgYXNzZXJ0LmZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSB8fCBcImV4cGVjdGVkIHthY3R1YWx9IHRvIGluY2x1ZGUge2V4cGVjdGVkfVwiLCBcImluY2x1ZGVcIiwgYXNzZXJ0LmluY2x1ZGUpO1xuICAgIH1cbn07XG5hc3NlcnQuaW5jbHVkZXMgPSBhc3NlcnQuaW5jbHVkZTtcblxuYXNzZXJ0Lm5vdEluY2x1ZGUgPSBmdW5jdGlvbiAoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICAgIGFzc2VydE1pc3NpbmdBcmd1bWVudHMoYXJndW1lbnRzLCBhc3NlcnQubm90SW5jbHVkZSk7XG4gICAgaWYgKChmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIGlmIChpc0FycmF5KG9iaikgfHwgaXNTdHJpbmcob2JqKSkge1xuICAgICAgICAgICAgcmV0dXJuIG9iai5pbmRleE9mKGV4cGVjdGVkKSAhPT0gLTE7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3QoYWN0dWFsKSkge1xuICAgICAgICAgICAgcmV0dXJuIG9iai5oYXNPd25Qcm9wZXJ0eShleHBlY3RlZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSkoYWN0dWFsKSkge1xuICAgICAgICBhc3NlcnQuZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlIHx8IFwiZXhwZWN0ZWQge2FjdHVhbH0gbm90IHRvIGluY2x1ZGUge2V4cGVjdGVkfVwiLCBcImluY2x1ZGVcIiwgYXNzZXJ0Lm5vdEluY2x1ZGUpO1xuICAgIH1cbn07XG5hc3NlcnQubm90SW5jbHVkZXMgPSBhc3NlcnQubm90SW5jbHVkZTtcblxuYXNzZXJ0LmRlZXBJbmNsdWRlID0gZnVuY3Rpb24gKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgICBhc3NlcnRNaXNzaW5nQXJndW1lbnRzKGFyZ3VtZW50cywgYXNzZXJ0LmRlZXBJbmNsdWRlKTtcbiAgICBpZiAoIWlzQXJyYXkoYWN0dWFsKSkge1xuICAgICAgICByZXR1cm4gYXNzZXJ0LmluY2x1ZGUoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSk7XG4gICAgfVxuICAgIGlmICghYWN0dWFsLnNvbWUoZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuIHV0aWxzLmRlZXBFcXVhbChpdGVtLCBleHBlY3RlZCkgfSkpIHtcbiAgICAgICAgYXNzZXJ0LmZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSB8fCBcImV4cGVjdGVkIHthY3R1YWx9IHRvIGluY2x1ZGUge2V4cGVjdGVkfVwiLCBcImluY2x1ZGVcIiwgYXNzZXJ0LmRlZXBJbmNsdWRlKTtcbiAgICB9XG59O1xuYXNzZXJ0LmRlZXBJbmNsdWRlcyA9IGFzc2VydC5kZWVwSW5jbHVkZTtcblxuLy9cbi8vIExlbmd0aFxuLy9cbmFzc2VydC5pc0VtcHR5ID0gZnVuY3Rpb24gKGFjdHVhbCwgbWVzc2FnZSkge1xuICAgIGFzc2VydE1pc3NpbmdBcmd1bWVudHMoYXJndW1lbnRzLCBhc3NlcnQuaXNFbXB0eSk7XG4gICAgaWYgKChpc09iamVjdChhY3R1YWwpICYmIE9iamVjdC5rZXlzKGFjdHVhbCkubGVuZ3RoID4gMCkgfHwgYWN0dWFsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXNzZXJ0LmZhaWwoYWN0dWFsLCAwLCBtZXNzYWdlIHx8IFwiZXhwZWN0ZWQge2FjdHVhbH0gdG8gYmUgZW1wdHlcIiwgXCJsZW5ndGhcIiwgYXNzZXJ0LmlzRW1wdHkpO1xuICAgIH1cbn07XG5hc3NlcnQuaXNOb3RFbXB0eSA9IGZ1bmN0aW9uIChhY3R1YWwsIG1lc3NhZ2UpIHtcbiAgICBhc3NlcnRNaXNzaW5nQXJndW1lbnRzKGFyZ3VtZW50cywgYXNzZXJ0LmlzTm90RW1wdHkpO1xuICAgIGlmICgoaXNPYmplY3QoYWN0dWFsKSAmJiBPYmplY3Qua2V5cyhhY3R1YWwpLmxlbmd0aCA9PT0gMCkgfHwgYWN0dWFsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBhc3NlcnQuZmFpbChhY3R1YWwsIDAsIG1lc3NhZ2UgfHwgXCJleHBlY3RlZCB7YWN0dWFsfSB0byBiZSBub3QgZW1wdHlcIiwgXCJsZW5ndGhcIiwgYXNzZXJ0LmlzTm90RW1wdHkpO1xuICAgIH1cbn07XG5cbmFzc2VydC5sZW5ndGhPZiA9IGZ1bmN0aW9uIChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gICAgYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmd1bWVudHMsIGFzc2VydC5sZW5ndGhPZik7XG4gICAgdmFyIGxlbiA9IGlzT2JqZWN0KGFjdHVhbCkgPyBPYmplY3Qua2V5cyhhY3R1YWwpLmxlbmd0aCA6IGFjdHVhbC5sZW5ndGg7XG4gICAgaWYgKGxlbiAhPT0gZXhwZWN0ZWQpIHtcbiAgICAgICAgYXNzZXJ0LmZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSB8fCBcImV4cGVjdGVkIHthY3R1YWx9IHRvIGhhdmUge2V4cGVjdGVkfSBlbGVtZW50KHMpXCIsIFwibGVuZ3RoXCIsIGFzc2VydC5sZW5ndGgpO1xuICAgIH1cbn07XG5cbi8vXG4vLyBUeXBlXG4vL1xuYXNzZXJ0LmlzQXJyYXkgPSBmdW5jdGlvbiAoYWN0dWFsLCBtZXNzYWdlKSB7XG4gICAgYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmd1bWVudHMsIGFzc2VydC5pc0FycmF5KTtcbiAgICBhc3NlcnRUeXBlT2YoYWN0dWFsLCAnYXJyYXknLCBtZXNzYWdlIHx8IFwiZXhwZWN0ZWQge2FjdHVhbH0gdG8gYmUgYW4gQXJyYXlcIiwgYXNzZXJ0LmlzQXJyYXkpO1xufTtcbmFzc2VydC5pc09iamVjdCA9IGZ1bmN0aW9uIChhY3R1YWwsIG1lc3NhZ2UpIHtcbiAgICBhc3NlcnRNaXNzaW5nQXJndW1lbnRzKGFyZ3VtZW50cywgYXNzZXJ0LmlzT2JqZWN0KTtcbiAgICBhc3NlcnRUeXBlT2YoYWN0dWFsLCAnb2JqZWN0JywgbWVzc2FnZSB8fCBcImV4cGVjdGVkIHthY3R1YWx9IHRvIGJlIGFuIE9iamVjdFwiLCBhc3NlcnQuaXNPYmplY3QpO1xufTtcbmFzc2VydC5pc051bWJlciA9IGZ1bmN0aW9uIChhY3R1YWwsIG1lc3NhZ2UpIHtcbiAgICBhc3NlcnRNaXNzaW5nQXJndW1lbnRzKGFyZ3VtZW50cywgYXNzZXJ0LmlzTnVtYmVyKTtcbiAgICBpZiAoaXNOYU4oYWN0dWFsKSkge1xuICAgICAgICBhc3NlcnQuZmFpbChhY3R1YWwsICdudW1iZXInLCBtZXNzYWdlIHx8IFwiZXhwZWN0ZWQge2FjdHVhbH0gdG8gYmUgb2YgdHlwZSB7ZXhwZWN0ZWR9XCIsIFwiaXNOYU5cIiwgYXNzZXJ0LmlzTnVtYmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBhc3NlcnRUeXBlT2YoYWN0dWFsLCAnbnVtYmVyJywgbWVzc2FnZSB8fCBcImV4cGVjdGVkIHthY3R1YWx9IHRvIGJlIGEgTnVtYmVyXCIsIGFzc2VydC5pc051bWJlcik7XG4gICAgfVxufTtcbmFzc2VydC5pc0Jvb2xlYW4gPSBmdW5jdGlvbiAoYWN0dWFsLCBtZXNzYWdlKSB7XG4gICAgYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmd1bWVudHMsIGFzc2VydC5pc0Jvb2xlYW4pO1xuICAgIGlmIChhY3R1YWwgIT09IHRydWUgJiYgYWN0dWFsICE9PSBmYWxzZSkge1xuICAgICAgICBhc3NlcnQuZmFpbChhY3R1YWwsICdib29sZWFuJywgbWVzc2FnZSB8fCBcImV4cGVjdGVkIHthY3R1YWx9IHRvIGJlIGEgQm9vbGVhblwiLCBcIj09PVwiLCBhc3NlcnQuaXNCb29sZWFuKTtcbiAgICB9XG59O1xuYXNzZXJ0LmlzTmFOID0gZnVuY3Rpb24gKGFjdHVhbCwgbWVzc2FnZSkge1xuICAgIGFzc2VydE1pc3NpbmdBcmd1bWVudHMoYXJndW1lbnRzLCBhc3NlcnQuaXNOYU4pO1xuICAgIGlmIChhY3R1YWwgPT09IGFjdHVhbCkge1xuICAgICAgICBhc3NlcnQuZmFpbChhY3R1YWwsICdOYU4nLCBtZXNzYWdlIHx8IFwiZXhwZWN0ZWQge2FjdHVhbH0gdG8gYmUgTmFOXCIsIFwiPT09XCIsIGFzc2VydC5pc05hTik7XG4gICAgfVxufTtcbmFzc2VydC5pc051bGwgPSBmdW5jdGlvbiAoYWN0dWFsLCBtZXNzYWdlKSB7XG4gICAgYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmd1bWVudHMsIGFzc2VydC5pc051bGwpO1xuICAgIGlmIChhY3R1YWwgIT09IG51bGwpIHtcbiAgICAgICAgYXNzZXJ0LmZhaWwoYWN0dWFsLCBudWxsLCBtZXNzYWdlIHx8IFwiZXhwZWN0ZWQge2V4cGVjdGVkfSwgZ290IHthY3R1YWx9XCIsIFwiPT09XCIsIGFzc2VydC5pc051bGwpO1xuICAgIH1cbn07XG5hc3NlcnQuaXNOb3ROdWxsID0gZnVuY3Rpb24gKGFjdHVhbCwgbWVzc2FnZSkge1xuICAgIGFzc2VydE1pc3NpbmdBcmd1bWVudHMoYXJndW1lbnRzLCBhc3NlcnQuaXNOb3ROdWxsKTtcbiAgICBpZiAoYWN0dWFsID09PSBudWxsKSB7XG4gICAgICAgIGFzc2VydC5mYWlsKGFjdHVhbCwgbnVsbCwgbWVzc2FnZSB8fCBcImV4cGVjdGVkIG5vbi1udWxsIHZhbHVlLCBnb3Qge2FjdHVhbH1cIiwgXCI9PT1cIiwgYXNzZXJ0LmlzTm90TnVsbCk7XG4gICAgfVxufTtcbmFzc2VydC5pc1VuZGVmaW5lZCA9IGZ1bmN0aW9uIChhY3R1YWwsIG1lc3NhZ2UpIHtcbiAgICBhc3NlcnRNaXNzaW5nQXJndW1lbnRzKGFyZ3VtZW50cywgYXNzZXJ0LmlzVW5kZWZpbmVkKTtcbiAgICBpZiAoYWN0dWFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYXNzZXJ0LmZhaWwoYWN0dWFsLCB1bmRlZmluZWQsIG1lc3NhZ2UgfHwgXCJleHBlY3RlZCB7YWN0dWFsfSB0byBiZSB7ZXhwZWN0ZWR9XCIsIFwiPT09XCIsIGFzc2VydC5pc1VuZGVmaW5lZCk7XG4gICAgfVxufTtcbmFzc2VydC5pc0RlZmluZWQgPSBmdW5jdGlvbiAoYWN0dWFsLCBtZXNzYWdlKSB7XG4gICAgYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmd1bWVudHMsIGFzc2VydC5pc0RlZmluZWQpO1xuICAgIGlmKGFjdHVhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGFzc2VydC5mYWlsKGFjdHVhbCwgMCwgbWVzc2FnZSB8fCBcImV4cGVjdGVkIHthY3R1YWx9IHRvIGJlIGRlZmluZWRcIiwgXCI9PT1cIiwgYXNzZXJ0LmlzRGVmaW5lZCk7XG4gICAgfVxufTtcbmFzc2VydC5pc1N0cmluZyA9IGZ1bmN0aW9uIChhY3R1YWwsIG1lc3NhZ2UpIHtcbiAgICBhc3NlcnRNaXNzaW5nQXJndW1lbnRzKGFyZ3VtZW50cywgYXNzZXJ0LmlzU3RyaW5nKTtcbiAgICBhc3NlcnRUeXBlT2YoYWN0dWFsLCAnc3RyaW5nJywgbWVzc2FnZSB8fCBcImV4cGVjdGVkIHthY3R1YWx9IHRvIGJlIGEgU3RyaW5nXCIsIGFzc2VydC5pc1N0cmluZyk7XG59O1xuYXNzZXJ0LmlzRnVuY3Rpb24gPSBmdW5jdGlvbiAoYWN0dWFsLCBtZXNzYWdlKSB7XG4gICAgYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmd1bWVudHMsIGFzc2VydC5pc0Z1bmN0aW9uKTtcbiAgICBhc3NlcnRUeXBlT2YoYWN0dWFsLCAnZnVuY3Rpb24nLCBtZXNzYWdlIHx8IFwiZXhwZWN0ZWQge2FjdHVhbH0gdG8gYmUgYSBGdW5jdGlvblwiLCBhc3NlcnQuaXNGdW5jdGlvbik7XG59O1xuYXNzZXJ0LnR5cGVPZiA9IGZ1bmN0aW9uIChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gICAgYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmd1bWVudHMsIGFzc2VydC50eXBlT2YpO1xuICAgIGFzc2VydFR5cGVPZihhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCBhc3NlcnQudHlwZU9mKTtcbn07XG5hc3NlcnQuaW5zdGFuY2VPZiA9IGZ1bmN0aW9uIChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gICAgYXNzZXJ0TWlzc2luZ0FyZ3VtZW50cyhhcmd1bWVudHMsIGFzc2VydC5pbnN0YW5jZW9mKTtcbiAgICBpZiAoISAoYWN0dWFsIGluc3RhbmNlb2YgZXhwZWN0ZWQpKSB7XG4gICAgICAgIGFzc2VydC5mYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UgfHwgXCJleHBlY3RlZCB7YWN0dWFsfSB0byBiZSBhbiBpbnN0YW5jZSBvZiB7ZXhwZWN0ZWR9XCIsIFwiaW5zdGFuY2VvZlwiLCBhc3NlcnQuaW5zdGFuY2VPZik7XG4gICAgfVxufTtcblxuLy9cbi8vIFV0aWxpdHkgZnVuY3Rpb25zXG4vL1xuXG5mdW5jdGlvbiBhc3NlcnRNaXNzaW5nQXJndW1lbnRzKGFyZ3MsIGNhbGxlcikge1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBhc3NlcnQuZmFpbChcIlwiLCBcIlwiLCBcImV4cGVjdGVkIG51bWJlciBvZiBhcmd1bWVudHMgdG8gYmUgZ3JlYXRlciB0aGFuIHplcm9cIiwgXCJcIiwgY2FsbGVyKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydFR5cGVPZihhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCBjYWxsZXIpIHtcbiAgICBpZiAodHlwZU9mKGFjdHVhbCkgIT09IGV4cGVjdGVkKSB7XG4gICAgICAgIGFzc2VydC5mYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UgfHwgXCJleHBlY3RlZCB7YWN0dWFsfSB0byBiZSBvZiB0eXBlIHtleHBlY3RlZH1cIiwgXCJ0eXBlT2ZcIiwgY2FsbGVyKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkgKG9iaikge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KG9iaik7XG59XG5cbmZ1bmN0aW9uIGlzU3RyaW5nIChvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mKG9iaikgPT09ICdzdHJpbmcnIHx8IG9iaiBpbnN0YW5jZW9mIFN0cmluZztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QgKG9iaikge1xuICAgIHJldHVybiB0eXBlb2Yob2JqKSA9PT0gJ29iamVjdCcgJiYgb2JqICYmICFpc0FycmF5KG9iaik7XG59XG5cbi8vIEEgYmV0dGVyIGB0eXBlb2ZgXG5mdW5jdGlvbiB0eXBlT2YodmFsdWUpIHtcbiAgICB2YXIgcyA9IHR5cGVvZih2YWx1ZSksXG4gICAgICAgIHR5cGVzID0gW09iamVjdCwgQXJyYXksIFN0cmluZywgUmVnRXhwLCBOdW1iZXIsIEZ1bmN0aW9uLCBCb29sZWFuLCBEYXRlXTtcblxuICAgIGlmIChzID09PSAnb2JqZWN0JyB8fCBzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgdHlwZXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIHQpIHsgcyA9IHQubmFtZS50b0xvd2VyQ2FzZSgpIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgeyBzID0gJ251bGwnIH1cbiAgICB9XG4gICAgcmV0dXJuIHM7XG59XG4iLCJcbi8vIFRha2VuIGZyb20gbm9kZS9saWIvYXNzZXJ0LmpzXG5leHBvcnRzLmRlZXBFcXVhbCA9IGZ1bmN0aW9uIChhY3R1YWwsIGV4cGVjdGVkKSB7XG4gIGlmIChhY3R1YWwgPT09IGV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfSBlbHNlIGlmIChCdWZmZXIuaXNCdWZmZXIoYWN0dWFsKSAmJiBCdWZmZXIuaXNCdWZmZXIoZXhwZWN0ZWQpKSB7XG4gICAgaWYgKGFjdHVhbC5sZW5ndGggIT0gZXhwZWN0ZWQubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFjdHVhbC5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFjdHVhbFtpXSAhPT0gZXhwZWN0ZWRbaV0pIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfSBlbHNlIGlmIChhY3R1YWwgaW5zdGFuY2VvZiBEYXRlICYmIGV4cGVjdGVkIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHJldHVybiBhY3R1YWwuZ2V0VGltZSgpID09PSBleHBlY3RlZC5nZXRUaW1lKCk7XG5cbiAgfSBlbHNlIGlmICh0eXBlb2YgYWN0dWFsICE9ICdvYmplY3QnICYmIHR5cGVvZiBleHBlY3RlZCAhPSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBhY3R1YWwgPT0gZXhwZWN0ZWQ7XG5cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gb2JqRXF1aXYoYWN0dWFsLCBleHBlY3RlZCk7XG4gIH1cbn1cblxuLy8gVGFrZW4gZnJvbSBub2RlL2xpYi9hc3NlcnQuanNcbmV4cG9ydHMubm90RGVlcEVxdWFsID0gZnVuY3Rpb24gKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGV4cG9ydHMuZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnbm90RGVlcEVxdWFsJywgYXNzZXJ0Lm5vdERlZXBFcXVhbCk7XG4gIH1cbn1cblxuLy8gVGFrZW4gZnJvbSBub2RlL2xpYi9hc3NlcnQuanNcbmZ1bmN0aW9uIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkO1xufVxuXG4vLyBUYWtlbiBmcm9tIG5vZGUvbGliL2Fzc2VydC5qc1xuZnVuY3Rpb24gaXNBcmd1bWVudHMob2JqZWN0KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KSA9PSAnW29iamVjdCBBcmd1bWVudHNdJztcbn1cblxuLy8gVGFrZW4gZnJvbSBub2RlL2xpYi9hc3NlcnQuanNcbmZ1bmN0aW9uIG9iakVxdWl2KGEsIGIpIHtcbiAgaWYgKGlzVW5kZWZpbmVkT3JOdWxsKGEpIHx8IGlzVW5kZWZpbmVkT3JOdWxsKGIpKVxuICAgIHJldHVybiBmYWxzZTtcbiAgaWYgKGEucHJvdG90eXBlICE9PSBiLnByb3RvdHlwZSkgcmV0dXJuIGZhbHNlO1xuICBpZiAoaXNBcmd1bWVudHMoYSkpIHtcbiAgICBpZiAoIWlzQXJndW1lbnRzKGIpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGEgPSBwU2xpY2UuY2FsbChhKTtcbiAgICBiID0gcFNsaWNlLmNhbGwoYik7XG4gICAgcmV0dXJuIGV4cG9ydHMuZGVlcEVxdWFsKGEsIGIpO1xuICB9XG4gIHRyeSB7XG4gICAgdmFyIGthID0gT2JqZWN0LmtleXMoYSksXG4gICAgICAgIGtiID0gT2JqZWN0LmtleXMoYiksXG4gICAgICAgIGtleSwgaTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoa2EubGVuZ3RoICE9IGtiLmxlbmd0aClcbiAgICByZXR1cm4gZmFsc2U7XG4gIGthLnNvcnQoKTtcbiAga2Iuc29ydCgpO1xuICBmb3IgKGkgPSBrYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGlmIChrYVtpXSAhPSBrYltpXSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmb3IgKGkgPSBrYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGtleSA9IGthW2ldO1xuICAgIGlmICghZXhwb3J0cy5kZWVwRXF1YWwoYVtrZXldLCBiW2tleV0pKSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbiIsIi8vXG4vLyBWb3dzLmpzIC0gYXN5bmNocm9ub3VzIGV2ZW50LWJhc2VkIEJERCBmb3Igbm9kZS5qc1xuLy9cbi8vICAgdXNhZ2U6XG4vL1xuLy8gICAgICAgdmFyIHZvd3MgPSByZXF1aXJlKCd2b3dzJyk7XG4vL1xuLy8gICAgICAgdm93cy5kZXNjcmliZSgnRGVlcCBUaG91Z2h0JykuYWRkQmF0Y2goe1xuLy8gICAgICAgICAgIFwiQW4gaW5zdGFuY2Ugb2YgRGVlcFRob3VnaHRcIjoge1xuLy8gICAgICAgICAgICAgICB0b3BpYzogbmV3IERlZXBUaG91Z2h0LFxuLy9cbi8vICAgICAgICAgICAgICAgXCJzaG91bGQga25vdyB0aGUgYW5zd2VyIHRvIHRoZSB1bHRpbWF0ZSBxdWVzdGlvbiBvZiBsaWZlXCI6IGZ1bmN0aW9uIChkZWVwVGhvdWdodCkge1xuLy8gICAgICAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsIChkZWVwVGhvdWdodC5xdWVzdGlvbignd2hhdCBpcyB0aGUgYW5zd2VyIHRvIHRoZSB1bml2ZXJzZT8nKSwgNDIpO1xuLy8gICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgfSkucnVuKCk7XG4vL1xudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyksXG4gICAgZXZlbnRzID0gcmVxdWlyZSgnZXZlbnRzJyksXG4gICAgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKSxcbiAgICB2b3dzID0gZXhwb3J0cztcblxuLy8gT3B0aW9uc1xudm93cy5vcHRpb25zID0ge1xuICAgIEVtaXR0ZXI6IGV2ZW50cy5FdmVudEVtaXR0ZXIsXG4gICAgcmVwb3J0ZXI6IHJlcXVpcmUoJy4vdm93cy9yZXBvcnRlcnMvZG90LW1hdHJpeCcpLFxuICAgIG1hdGNoZXI6IC8uKi8sXG4gICAgZXJyb3I6IHRydWUgLy8gSGFuZGxlIFwiZXJyb3JcIiBldmVudFxufTtcblxudm93cy5fX2RlZmluZUdldHRlcl9fKCdyZXBvcnRlcicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdm93cy5vcHRpb25zLnJlcG9ydGVyO1xufSk7XG5cbnZhciBzdHlsaXplID0gcmVxdWlyZSgnLi92b3dzL2NvbnNvbGUnKS5zdHlsaXplO1xudmFyIGNvbnNvbGUgPSB2b3dzLmNvbnNvbGUgPSByZXF1aXJlKCcuL3Zvd3MvY29uc29sZScpO1xuXG52b3dzLmluc3BlY3QgPSByZXF1aXJlKCcuL3Zvd3MvY29uc29sZScpLmluc3BlY3Q7XG52b3dzLnByZXBhcmUgPSByZXF1aXJlKCcuL3Zvd3MvZXh0cmFzJykucHJlcGFyZTtcbnZvd3MudHJ5RW5kICA9IHJlcXVpcmUoJy4vdm93cy9zdWl0ZScpLnRyeUVuZDtcblxuLy9cbi8vIEFzc2VydGlvbiBNYWNyb3MgJiBFeHRlbnNpb25zXG4vL1xucmVxdWlyZSgnLi9hc3NlcnQvZXJyb3InKTtcbnJlcXVpcmUoJy4vYXNzZXJ0L21hY3JvcycpO1xuXG4vL1xuLy8gU3VpdGUgY29uc3RydWN0b3Jcbi8vXG52YXIgU3VpdGUgPSByZXF1aXJlKCcuL3Zvd3Mvc3VpdGUnKS5TdWl0ZTtcblxuLy9cbi8vIFRoaXMgZnVuY3Rpb24gZ2V0cyBhZGRlZCB0byBldmVudHMuRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwgYnkgZGVmYXVsdC5cbi8vIEl0J3MgZXNzZW50aWFsbHkgYSB3cmFwcGVyIGFyb3VuZCBgb25gLCB3aGljaCBhZGRzIGFsbCB0aGUgc3BlY2lmaWNhdGlvblxuLy8gZ29vZG5lc3MuXG4vL1xuZnVuY3Rpb24gYWRkVm93KHZvdykge1xuICAgIHZhciBiYXRjaCA9IHZvdy5iYXRjaCxcbiAgICAgICAgZXZlbnQgPSB2b3cuYmluZGluZy5jb250ZXh0LmV2ZW50IHx8ICdzdWNjZXNzJyxcbiAgICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICBiYXRjaC50b3RhbCArKztcbiAgICBiYXRjaC52b3dzLnB1c2godm93KTtcblxuICAgIC8vIGFsd2F5cyBzZXQgYSBsaXN0ZW5lciBvbiB0aGUgZXZlbnRcbiAgICB0aGlzLm9uKGV2ZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmKHZvdy5jYXVnaHRFcnJvcilcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgIC8vIElmIHRoZSB2b3cgaXMgYSBzdWItZXZlbnQgdGhlbiB3ZSBrbm93IGl0IGlzIGFuXG4gICAgICAgIC8vIGVtaXR0ZWQgZXZlbnQuICBTbyBJIGRvbid0IG11Y2sgd2l0aCB0aGUgYXJndW1lbnRzXG4gICAgICAgIC8vIEhvd2V2ZXIgdGhlIGxlZ2FjeSBiZWhhdmlvcjpcbiAgICAgICAgLy8gSWYgdGhlIGNhbGxiYWNrIGlzIGV4cGVjdGluZyB0d28gb3IgbW9yZSBhcmd1bWVudHMsXG4gICAgICAgIC8vIHBhc3MgdGhlIGVycm9yIGFzIHRoZSBmaXJzdCAobnVsbCkgYW5kIHRoZSByZXN1bHQgYWZ0ZXIuXG4gICAgICAgIGlmICghKHRoaXMuY3R4ICYmIHRoaXMuY3R4LmlzRXZlbnQpICYmXG4gICAgICAgICAgICB2b3cuY2FsbGJhY2subGVuZ3RoID49IDIgJiYgYmF0Y2guc3VpdGUub3B0aW9ucy5lcnJvcikge1xuICAgICAgICAgICAgYXJncy51bnNoaWZ0KG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHJ1blRlc3QoYXJncywgdGhpcy5jdHgpO1xuICAgICAgICB2b3dzLnRyeUVuZChiYXRjaCk7XG4gICAgfSk7XG5cbiAgICBpZiAoZXZlbnQgIT09ICdlcnJvcicpIHtcbiAgICAgICAgdGhpcy5vbihcImVycm9yXCIsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIHZvdy5jYXVnaHRFcnJvciA9IHRydWU7XG4gICAgICAgICAgICBpZiAodm93LmNhbGxiYWNrLmxlbmd0aCA+PSAyIHx8ICFiYXRjaC5zdWl0ZS5vcHRpb25zLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgcnVuVGVzdChhcmd1bWVudHMsIHRoaXMuY3R4KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0KCdlcnJvcmVkJywgeyB0eXBlOiAnZW1pdHRlcicsIGVycm9yOiBlcnIuc3RhY2sgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgZXJyLm1lc3NhZ2UgfHwgSlNPTi5zdHJpbmdpZnkoZXJyKSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZvd3MudHJ5RW5kKGJhdGNoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gaW4gY2FzZSBhbiBldmVudCBmaXJlZCBiZWZvcmUgd2UgY291bGQgbGlzdGVuXG4gICAgaWYgKHRoaXMuX3Zvd3NFbWl0ZWRFdmVudHMgJiZcbiAgICAgICAgdGhpcy5fdm93c0VtaXRlZEV2ZW50cy5oYXNPd25Qcm9wZXJ0eShldmVudCkpIHtcbiAgICAgICAgLy8gbWFrZSBzdXJlIG5vIG9uZSBpcyBtZXNzaW5nIHdpdGggbWVcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5fdm93c0VtaXRlZEV2ZW50c1tldmVudF0pKSB7XG4gICAgICAgICAgICAvLyBJIGRvbid0IHRoaW5rIEkgbmVlZCB0byBvcHRpbWl6ZSBmb3Igb25lIGV2ZW50LFxuICAgICAgICAgICAgLy8gSSB0aGluayBpdCBpcyBtb3JlIGltcG9ydGFudCB0byBtYWtlIHN1cmUgSSBjaGVjayB0aGUgdm93IG4gdGltZXNcbiAgICAgICAgICAgIHNlbGYuX3Zvd3NFbWl0ZWRFdmVudHNbZXZlbnRdLmZvckVhY2goZnVuY3Rpb24oYXJncykge1xuICAgICAgICAgICAgICAgIHJ1blRlc3QoYXJncywgc2VsZi5jdHgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBpbml0aWFsIGNvbmRpdGlvbnMgcHJvYmxlbVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdfdm93c0VtaXRlZEV2ZW50c1snICsgZXZlbnQgKyAnXSBpcyBub3QgYW4gQXJyYXknKVxuICAgICAgICB9XG4gICAgICAgIHZvd3MudHJ5RW5kKGJhdGNoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcblxuICAgIGZ1bmN0aW9uIHJ1blRlc3QoYXJncywgY3R4KSB7XG4gICAgICAgIGlmICh2b3cuY2FsbGJhY2sgaW5zdGFuY2VvZiBTdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQoJ3BlbmRpbmcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2b3cuYmluZGluZy5jb250ZXh0LmlzRXZlbnQgJiYgdm93LmJpbmRpbmcuY29udGV4dC5hZnRlcikge1xuICAgICAgICAgICAgdmFyIGFmdGVyID0gdm93LmJpbmRpbmcuY29udGV4dC5hZnRlcjtcbiAgICAgICAgICAgIC8vIG9ubHkgbmVlZCB0byBjaGVjayBvcmRlci4gIEkgd29uJ3QgZ2V0IGhlcmUgaWYgdGhlIGFmdGVyIGV2ZW50XG4gICAgICAgICAgICAvLyBoYXMgbmV2ZXIgYmVlbiBlbWl0dGVkXG4gICAgICAgICAgICBpZiAoc2VsZi5fdm93c0VtaXRlZEV2ZW50c09yZGVyLmluZGV4T2YoYWZ0ZXIpID5cbiAgICAgICAgICAgICAgICBzZWxmLl92b3dzRW1pdGVkRXZlbnRzT3JkZXIuaW5kZXhPZihldmVudCkpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQoJ2Jyb2tlbicsIGV2ZW50ICsgJyBlbWl0dGVkIGJlZm9yZSAnICsgYWZ0ZXIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJ1biB0aGUgdGVzdCwgYW5kIHRyeSB0byBjYXRjaCBgQXNzZXJ0aW9uRXJyb3JgcyBhbmQgb3RoZXIgZXhjZXB0aW9ucztcbiAgICAgICAgLy8gaW5jcmVtZW50IGNvdW50ZXJzIGFjY29yZGluZ2x5LlxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdm93LmNhbGxiYWNrLmFwcGx5KGN0eCA9PT0gZ2xvYmFsIHx8ICFjdHggPyB2b3cuYmluZGluZyA6IGN0eCwgYXJncyk7XG4gICAgICAgICAgICBvdXRwdXQoJ2hvbm9yZWQnKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKGUubmFtZSAmJiBlLm5hbWUubWF0Y2goL0Fzc2VydGlvbkVycm9yLykpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQoJ2Jyb2tlbicsIGUudG9TdHJpbmdFeCgpLnJlcGxhY2UoL1xcYC9nLCAnYCcpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0KCdlcnJvcmVkJywgZS5zdGFjayB8fCBlLm1lc3NhZ2UgfHwgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvdXRwdXQoc3RhdHVzLCBleGNlcHRpb24pIHtcbiAgICAgICAgYmF0Y2hbc3RhdHVzXSArKztcbiAgICAgICAgdm93LnN0YXR1cyA9IHN0YXR1cztcblxuICAgICAgICBpZiAodm93LmNvbnRleHQgJiYgYmF0Y2gubGFzdENvbnRleHQgIT09IHZvdy5jb250ZXh0KSB7XG4gICAgICAgICAgICBiYXRjaC5sYXN0Q29udGV4dCA9IHZvdy5jb250ZXh0O1xuICAgICAgICAgICAgYmF0Y2guc3VpdGUucmVwb3J0KFsnY29udGV4dCcsIHZvdy5jb250ZXh0XSk7XG4gICAgICAgIH1cbiAgICAgICAgYmF0Y2guc3VpdGUucmVwb3J0KFsndm93Jywge1xuICAgICAgICAgICAgdGl0bGU6IHZvdy5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIGNvbnRleHQ6IHZvdy5jb250ZXh0LFxuICAgICAgICAgICAgc3RhdHVzOiBzdGF0dXMsXG4gICAgICAgICAgICBleGNlcHRpb246IGV4Y2VwdGlvbiB8fCBudWxsXG4gICAgICAgIH1dKTtcbiAgICB9XG59O1xuXG4vL1xuLy8gT24gZXhpdCwgY2hlY2sgdGhhdCBhbGwgZW1pdHRlcnMgaGF2ZSBiZWVuIGZpcmVkLlxuLy8gSWYgbm90LCByZXBvcnQgYW4gZXJyb3IgbWVzc2FnZS5cbi8vXG5wcm9jZXNzLm9uKCdleGl0JywgZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN1bHRzID0geyBob25vcmVkOiAwLCBicm9rZW46IDAsIGVycm9yZWQ6IDAsIHBlbmRpbmc6IDAsIHRvdGFsOiAwIH0sXG4gICAgICAgIGZhaWx1cmU7XG5cbiAgICB2b3dzLnN1aXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIGlmICgocy5yZXN1bHRzLnRvdGFsID4gMCkgJiYgKHMucmVzdWx0cy50aW1lID09PSBudWxsKSkge1xuICAgICAgICAgICAgcy5yZXBvcnRlci5wcmludCgnXFxuXFxuJyk7XG4gICAgICAgICAgICBzLnJlcG9ydGVyLnJlcG9ydChbJ2Vycm9yJywgeyBlcnJvcjogXCJBc3luY2hyb25vdXMgRXJyb3JcIiwgc3VpdGU6IHMgfV0pO1xuICAgICAgICB9XG4gICAgICAgIHMuYmF0Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uIChiKSB7XG4gICAgICAgICAgICB2YXIgdW5GaXJlZCA9IFtdO1xuXG4gICAgICAgICAgICBiLnZvd3MuZm9yRWFjaChmdW5jdGlvbiAodm93KSB7XG4gICAgICAgICAgICAgICAgaWYgKCEgdm93LnN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodW5GaXJlZC5pbmRleE9mKHZvdy5jb250ZXh0KSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuRmlyZWQucHVzaCh2b3cuY29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHVuRmlyZWQubGVuZ3RoID4gMCkgeyB1dGlsLnByaW50KCdcXG4nKTsgfVxuXG4gICAgICAgICAgICB1bkZpcmVkLmZvckVhY2goZnVuY3Rpb24gKHRpdGxlKSB7XG4gICAgICAgICAgICAgICAgcy5yZXBvcnRlci5yZXBvcnQoWydlcnJvcicsIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IFwiY2FsbGJhY2sgbm90IGZpcmVkXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICBiYXRjaDogYixcbiAgICAgICAgICAgICAgICAgICAgc3VpdGU6IHNcbiAgICAgICAgICAgICAgICB9XSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKGIuc3RhdHVzID09PSAnYmVnaW4nKSB7XG4gICAgICAgICAgICAgICAgZmFpbHVyZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmVzdWx0cy5lcnJvcmVkICsrO1xuICAgICAgICAgICAgICAgIHJlc3VsdHMudG90YWwgKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhyZXN1bHRzKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7IHJlc3VsdHNba10gKz0gYltrXSB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKGZhaWx1cmUpIHtcbiAgICAgICAgdXRpbC5wdXRzKGNvbnNvbGUucmVzdWx0KHJlc3VsdHMpKTtcbiAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgIH1cbn0pO1xuXG52b3dzLnN1aXRlcyA9IFtdO1xuXG4vLyBXZSBuZWVkIHRoZSBvbGQgZW1pdCBmdW5jdGlvbiBzbyB3ZSBjYW4gaG9vayBpdFxuLy8gYW5kIGRvIG1hZ2ljIHRvIGRlYWwgd2l0aCBldmVudHMgdGhhdCBoYXZlIGZpcmVkXG52YXIgb2xkRW1pdCA9IHZvd3Mub3B0aW9ucy5FbWl0dGVyLnByb3RvdHlwZS5lbWl0O1xuXG4vL1xuLy8gQ3JlYXRlIGEgbmV3IHRlc3Qgc3VpdGVcbi8vXG52b3dzLmRlc2NyaWJlID0gZnVuY3Rpb24gKHN1YmplY3QpIHtcbiAgICB2YXIgc3VpdGUgPSBuZXcoU3VpdGUpKHN1YmplY3QpO1xuXG4gICAgdGhpcy5vcHRpb25zLkVtaXR0ZXIucHJvdG90eXBlLmFkZFZvdyA9IGFkZFZvdztcbiAgICAvLyBqdXN0IGluIGNhc2Ugc29tZW9uZSBlbWl0J3MgYmVmb3JlIEkgZ2V0IHRvIGl0XG4gICAgdGhpcy5vcHRpb25zLkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5fdm93c0VtaXRlZEV2ZW50cyA9IHRoaXMuX3Zvd3NFbWl0ZWRFdmVudHMgfHwge307XG4gICAgICAgIHRoaXMuX3Zvd3NFbWl0ZWRFdmVudHNPcmRlciA9IHRoaXMuX3Zvd3NFbWl0ZWRFdmVudHNPcmRlciB8fCBbXTtcbiAgICAgICAgLy8gc2xpY2Ugb2ZmIHRoZSBldmVudFxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIC8vIGlmIG11bHRpcGxlIGV2ZW50cyBhcmUgZmlyZWQsIGFkZCBvciBwdXNoXG4gICAgICAgIGlmICh0aGlzLl92b3dzRW1pdGVkRXZlbnRzLmhhc093blByb3BlcnR5KGV2ZW50KSkge1xuICAgICAgICAgICAgdGhpcy5fdm93c0VtaXRlZEV2ZW50c1tldmVudF0ucHVzaChhcmdzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Zvd3NFbWl0ZWRFdmVudHNbZXZlbnRdID0gW2FyZ3NdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcHVzaCB0aGUgZXZlbnQgb250byBhIHN0YWNrIHNvIEkgaGF2ZSBhbiBvcmRlclxuICAgICAgICB0aGlzLl92b3dzRW1pdGVkRXZlbnRzT3JkZXIucHVzaChldmVudCk7XG4gICAgICAgIHJldHVybiBvbGRFbWl0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIHRoaXMuc3VpdGVzLnB1c2goc3VpdGUpO1xuXG4gICAgLy9cbiAgICAvLyBBZGQgYW55IGFkZGl0aW9uYWwgYXJndW1lbnRzIGFzIGJhdGNoZXMgaWYgdGhleSdyZSBwcmVzZW50XG4gICAgLy9cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDEsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICBzdWl0ZS5hZGRCYXRjaChhcmd1bWVudHNbaV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1aXRlO1xufTtcblxuXG52b3dzLnZlcnNpb24gPSBKU09OLnBhcnNlKHJlcXVpcmUoJ2ZzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAncGFja2FnZS5qc29uJykpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAudmVyc2lvblxuIiwidmFyIGV5ZXMgPSByZXF1aXJlKCdleWVzJykuaW5zcGVjdG9yKHsgc3RyZWFtOiBudWxsLCBzdHlsZXM6IGZhbHNlIH0pO1xuXG4vLyBTdHlsaXplIGEgc3RyaW5nXG50aGlzLnN0eWxpemUgPSBmdW5jdGlvbiBzdHlsaXplKHN0ciwgc3R5bGUpIHtcbiAgICBpZiAobW9kdWxlLmV4cG9ydHMubm9jb2xvcikge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG5cbiAgICB2YXIgc3R5bGVzID0ge1xuICAgICAgICAnYm9sZCcgICAgICA6IFsxLCAgMjJdLFxuICAgICAgICAnaXRhbGljJyAgICA6IFszLCAgMjNdLFxuICAgICAgICAndW5kZXJsaW5lJyA6IFs0LCAgMjRdLFxuICAgICAgICAnY3lhbicgICAgICA6IFs5NiwgMzldLFxuICAgICAgICAneWVsbG93JyAgICA6IFszMywgMzldLFxuICAgICAgICAnZ3JlZW4nICAgICA6IFszMiwgMzldLFxuICAgICAgICAncmVkJyAgICAgICA6IFszMSwgMzldLFxuICAgICAgICAnZ3JleScgICAgICA6IFs5MCwgMzldLFxuICAgICAgICAnZ3JlZW4taGknICA6IFs5MiwgMzJdLFxuICAgIH07XG4gICAgcmV0dXJuICdcXDAzM1snICsgc3R5bGVzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXDAzM1snICsgc3R5bGVzW3N0eWxlXVsxXSArICdtJztcbn07XG5cbnZhciAkID0gdGhpcy4kID0gZnVuY3Rpb24gKHN0cikge1xuICAgIHN0ciA9IG5ldyhTdHJpbmcpKHN0cik7XG5cbiAgICBbJ2JvbGQnLCAnZ3JleScsICd5ZWxsb3cnLCAncmVkJywgJ2dyZWVuJywgJ3doaXRlJywgJ2N5YW4nLCAnaXRhbGljJ10uZm9yRWFjaChmdW5jdGlvbiAoc3R5bGUpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHN0ciwgc3R5bGUsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBleHBvcnRzLiQoZXhwb3J0cy5zdHlsaXplKHRoaXMsIHN0eWxlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBzdHI7XG59O1xuXG50aGlzLnB1dHMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBzdHlsaXplID0gZXhwb3J0cy5zdHlsaXplO1xuICAgIG9wdGlvbnMuc3RyZWFtIHx8IChvcHRpb25zLnN0cmVhbSA9IHByb2Nlc3Muc3Rkb3V0KTtcbiAgICBvcHRpb25zLnRhaWwgPSBvcHRpb25zLnRhaWwgfHwgJyc7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgIGlmICghb3B0aW9ucy5yYXcpIHtcbiAgICAgICAgICAgIGFyZ3MgPSBhcmdzLm1hcChmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhLnJlcGxhY2UoL2AoW15gXSspYC9nLCAgIGZ1bmN0aW9uIChfLCBjYXB0dXJlKSB7IHJldHVybiBzdHlsaXplKGNhcHR1cmUsICdpdGFsaWMnKSB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcKihbXipdKylcXCovZywgZnVuY3Rpb24gKF8sIGNhcHR1cmUpIHsgcmV0dXJuIHN0eWxpemUoY2FwdHVyZSwgJ2JvbGQnKSB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcbi9nLCBmdW5jdGlvbiAoXywgY2FwdHVyZSkgeyByZXR1cm4gJyBcXG4gICcgfSApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9wdGlvbnMuc3RyZWFtLndyaXRlKGFyZ3Muam9pbignXFxuJykgKyBvcHRpb25zLnRhaWwpO1xuICAgIH07XG59O1xuXG50aGlzLmxvZyA9IHRoaXMucHV0cyh7fSk7XG5cbnRoaXMucmVzdWx0ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdLCBidWZmZXIgPSBbXSwgdGltZSA9ICcnLCBoZWFkZXI7XG4gICAgdmFyIGNvbXBsZXRlID0gZXZlbnQuaG9ub3JlZCArIGV2ZW50LnBlbmRpbmcgKyBldmVudC5lcnJvcmVkICsgZXZlbnQuYnJva2VuO1xuICAgIHZhciBzdGF0dXMgPSAoZXZlbnQuZXJyb3JlZCAmJiAnZXJyb3JlZCcpIHx8IChldmVudC5icm9rZW4gJiYgJ2Jyb2tlbicpIHx8XG4gICAgICAgICAgICAgICAgIChldmVudC5ob25vcmVkICYmICdob25vcmVkJykgfHwgKGV2ZW50LnBlbmRpbmcgJiYgJ3BlbmRpbmcnKTtcblxuICAgIGlmIChldmVudC50b3RhbCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gWyQoXCJDb3VsZCBub3QgZmluZCBhbnkgdGVzdHMgdG8gcnVuLlwiKS5ib2xkLnJlZF07XG4gICAgfVxuXG4gICAgZXZlbnQuaG9ub3JlZCAmJiByZXN1bHQucHVzaCgkKGV2ZW50Lmhvbm9yZWQpLmJvbGQgKyBcIiBob25vcmVkXCIpO1xuICAgIGV2ZW50LmJyb2tlbiAgJiYgcmVzdWx0LnB1c2goJChldmVudC5icm9rZW4pLmJvbGQgICsgXCIgYnJva2VuXCIpO1xuICAgIGV2ZW50LmVycm9yZWQgJiYgcmVzdWx0LnB1c2goJChldmVudC5lcnJvcmVkKS5ib2xkICsgXCIgZXJyb3JlZFwiKTtcbiAgICBldmVudC5wZW5kaW5nICYmIHJlc3VsdC5wdXNoKCQoZXZlbnQucGVuZGluZykuYm9sZCArIFwiIHBlbmRpbmdcIik7XG5cbiAgICBpZiAoY29tcGxldGUgPCBldmVudC50b3RhbCkge1xuICAgICAgICByZXN1bHQucHVzaCgkKGV2ZW50LnRvdGFsIC0gY29tcGxldGUpLmJvbGQgKyBcIiBkcm9wcGVkXCIpO1xuICAgIH1cblxuICAgIHJlc3VsdCA9IHJlc3VsdC5qb2luKCcg4oiZICcpO1xuXG4gICAgaGVhZGVyID0ge1xuICAgICAgICBob25vcmVkOiAn4pyTICcgKyAkKCdPSycpLmJvbGQuZ3JlZW4sXG4gICAgICAgIGJyb2tlbjogICfinJcgJyArICQoJ0Jyb2tlbicpLmJvbGQueWVsbG93LFxuICAgICAgICBlcnJvcmVkOiAn4pyXICcgKyAkKCdFcnJvcmVkJykuYm9sZC5yZWQsXG4gICAgICAgIHBlbmRpbmc6ICctICcgKyAkKCdQZW5kaW5nJykuYm9sZC5jeWFuXG4gICAgfVtzdGF0dXNdICsgJyDCuyAnO1xuXG4gICAgaWYgKHR5cGVvZihldmVudC50aW1lKSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgdGltZSA9ICcgKCcgKyBldmVudC50aW1lLnRvRml4ZWQoMykgKyAncyknO1xuICAgICAgICB0aW1lID0gdGhpcy5zdHlsaXplKHRpbWUsICdncmV5Jyk7XG4gICAgfVxuICAgIGJ1ZmZlci5wdXNoKGhlYWRlciArIHJlc3VsdCArIHRpbWUgKyAnXFxuJyk7XG5cbiAgICByZXR1cm4gYnVmZmVyO1xufTtcblxudGhpcy5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCh2YWwpIHtcbiAgICBpZiAobW9kdWxlLmV4cG9ydHMubm9jb2xvcikge1xuICAgICAgcmV0dXJuIGV5ZXModmFsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJ1xcMDMzWzFtJyArIGV5ZXModmFsKSArICdcXDAzM1syMm0nO1xufTtcblxudGhpcy5lcnJvciA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICB2YXIgc3RyaW5nICA9ICfinJcgJyArICQoJ0Vycm9yZWQgJykucmVkICsgJ8K7ICc7XG4gICAgICAgIHN0cmluZyArPSAkKG9iai5lcnJvcikucmVkLmJvbGQgICAgICAgICAgICAgICAgICAgICAgICAgKyAnXFxuJztcbiAgICAgICAgc3RyaW5nICs9IChvYmouY29udGV4dCA/ICcgICAgaW4gJyArICQob2JqLmNvbnRleHQpLnJlZCArICdcXG4nOiAnJyk7XG4gICAgICAgIHN0cmluZyArPSAnICAgIGluICcgKyAkKG9iai5zdWl0ZS5zdWJqZWN0KS5yZWQgICAgICAgICAgKyAnXFxuJztcbiAgICAgICAgc3RyaW5nICs9ICcgICAgaW4gJyArICQob2JqLnN1aXRlLl9maWxlbmFtZSkucmVkO1xuXG4gICAgcmV0dXJuIHN0cmluZztcbn07XG5cbnRoaXMuY29udGV4dFRleHQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICByZXR1cm4gJyAgJyArIGV2ZW50O1xufTtcblxudGhpcy52b3dUZXh0ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIGJ1ZmZlciA9IFtdO1xuXG4gICAgYnVmZmVyLnB1c2goJyAgICcgKyB7XG4gICAgICAgIGhvbm9yZWQ6ICcg4pyTICcsXG4gICAgICAgIGJyb2tlbjogICcg4pyXICcsXG4gICAgICAgIGVycm9yZWQ6ICcg4pyXICcsXG4gICAgICAgIHBlbmRpbmc6ICcgLSAnXG4gICAgfVtldmVudC5zdGF0dXNdICsgdGhpcy5zdHlsaXplKGV2ZW50LnRpdGxlLCAoe1xuICAgICAgICBob25vcmVkOiAnZ3JlZW4nLFxuICAgICAgICBicm9rZW46ICAneWVsbG93JyxcbiAgICAgICAgZXJyb3JlZDogJ3JlZCcsXG4gICAgICAgIHBlbmRpbmc6ICdjeWFuJ1xuICAgIH0pW2V2ZW50LnN0YXR1c10pKTtcblxuICAgIGlmIChldmVudC5zdGF0dXMgPT09ICdicm9rZW4nKSB7XG4gICAgICAgIGJ1ZmZlci5wdXNoKCcgICAgICDCuyAnICsgZXZlbnQuZXhjZXB0aW9uKTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LnN0YXR1cyA9PT0gJ2Vycm9yZWQnKSB7XG4gICAgICAgIGlmIChldmVudC5leGNlcHRpb24udHlwZSA9PT0gJ2VtaXR0ZXInKSB7XG4gICAgICAgICAgICBidWZmZXIucHVzaCgnICAgICAgwrsgJyArIHRoaXMuc3R5bGl6ZShcIkFuIHVuZXhwZWN0ZWQgZXJyb3Igd2FzIGNhdWdodDogXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsaXplKGV2ZW50LmV4Y2VwdGlvbi5lcnJvciwgJ2JvbGQnKSwgJ3JlZCcpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJ1ZmZlci5wdXNoKCcgICAgJyArIHRoaXMuc3R5bGl6ZShldmVudC5leGNlcHRpb24sICdyZWQnKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJ1ZmZlci5qb2luKCdcXG4nKTtcbn07XG4iLCJcbnRoaXMuQ29udGV4dCA9IGZ1bmN0aW9uICh2b3csIGN0eCwgZW52KSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgdGhpcy50ZXN0cyA9IHZvdy5jYWxsYmFjaztcbiAgICB0aGlzLnRvcGljcyA9IChjdHgudG9waWNzIHx8IFtdKS5zbGljZSgwKTtcbiAgICB0aGlzLmVtaXR0ZXIgPSBudWxsO1xuICAgIHRoaXMuZW52ID0gZW52IHx8IHt9O1xuICAgIHRoaXMuZW52LmNvbnRleHQgPSB0aGlzO1xuXG4gICAgdGhpcy5lbnYuY2FsbGJhY2sgPSBmdW5jdGlvbiAoLyogYXJndW1lbnRzICovKSB7XG4gICAgICAgIHZhciBjdHggPSB0aGlzO1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICAgICAgdmFyIGVtaXQgPSAoZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBDb252ZXJ0IGNhbGxiYWNrLXN0eWxlIHJlc3VsdHMgaW50byBldmVudHMuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgaWYgKHZvdy5iYXRjaC5zdWl0ZS5vcHRpb25zLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuZW1pdHRlci5jdHggPSBjdHg7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIGhhbmRsZSBhIHNwZWNpYWwgY2FzZSwgd2hlcmUgdGhlIGZpcnN0IGFyZ3VtZW50IGlzIGFcbiAgICAgICAgICAgICAgICAgICAgLy8gYm9vbGVhbiwgaW4gd2hpY2ggY2FzZSB3ZSB0cmVhdCBpdCBhcyBhIHJlc3VsdCwgYW5kIG5vdFxuICAgICAgICAgICAgICAgICAgICAvLyBhbiBlcnJvci4gVGhpcyBpcyB1c2VmdWwgZm9yIGBwYXRoLmV4aXN0c2AgYW5kIG90aGVyXG4gICAgICAgICAgICAgICAgICAgIC8vIGZ1bmN0aW9ucyBsaWtlIGl0LCB3aGljaCBvbmx5IHBhc3MgYSBzaW5nbGUgYm9vbGVhblxuICAgICAgICAgICAgICAgICAgICAvLyBwYXJhbWV0ZXIgaW5zdGVhZCBvZiB0aGUgbW9yZSBjb21tb24gKGVycm9yLCByZXN1bHQpIHBhaXIuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YoZSkgPT09ICdib29sZWFuJyAmJiBhcmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5lbWl0dGVyLmVtaXQuY2FsbCh0aGF0LmVtaXR0ZXIsICdzdWNjZXNzJywgZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZSkgeyB0aGF0LmVtaXR0ZXIuZW1pdC5hcHBseSh0aGF0LmVtaXR0ZXIsIFsnZXJyb3InLCBlXS5jb25jYXQoYXJncykpIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgICB7IHRoYXQuZW1pdHRlci5lbWl0LmFwcGx5KHRoYXQuZW1pdHRlciwgWydzdWNjZXNzJ10uY29uY2F0KGFyZ3MpKSB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmVtaXR0ZXIuY3R4ID0gY3R4O1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmVtaXR0ZXIuZW1pdC5hcHBseSh0aGF0LmVtaXR0ZXIsIFsnc3VjY2VzcyddLmNvbmNhdChhcmdzKSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkoYXJncy5zbGljZSgwKSk7XG4gICAgICAgIC8vIElmIGB0aGlzLmNhbGxiYWNrYCBpcyBjYWxsZWQgc3luY2hyb25vdXNseSxcbiAgICAgICAgLy8gdGhlIGVtaXR0ZXIgd2lsbCBub3QgaGF2ZSBiZWVuIHNldCB5ZXQsXG4gICAgICAgIC8vIHNvIHdlIGRlZmVyIHRoZSBlbWl0aW9uLCB0aGF0IHdheSBpdCdsbCBiZWhhdmVcbiAgICAgICAgLy8gYXN5bmNocm9ub3VzbHkuXG4gICAgICAgIGlmICh0aGF0LmVtaXR0ZXIpIHsgZW1pdCgpIH1cbiAgICAgICAgZWxzZSAgICAgICAgICAgICAgeyBwcm9jZXNzLm5leHRUaWNrKGVtaXQpIH1cbiAgICB9O1xuICAgIHRoaXMubmFtZSA9IHZvdy5kZXNjcmlwdGlvbjtcbiAgICAvLyBldmVudHMgaXMgYW4gYWxpYXMgZm9yIG9uXG4gICAgaWYgKHRoaXMubmFtZSA9PT0gJ2V2ZW50cycpIHtcbiAgICAgIHRoaXMubmFtZSA9IHZvdy5kZXNjcmlwdGlvbiA9ICdvbic7XG4gICAgfVxuXG4gICAgLy8gaWYgdGhpcyBpcyBhIHN1Yi1ldmVudCBjb250ZXh0IEFORCBpdCdzIGNvbnRleHQgd2FzIGFuIGV2ZW50LFxuICAgIC8vIHRoZW4gSSBtdXN0IGVuZm9yY2UgZXZlbnQgb3JkZXIuXG4gICAgLy8gdGhpcyB3aWxsIG5vdCBkbyBhIGdvb2Qgam9iIG9mIGhhbmRsaW5nIHBpbi1wb25nIGV2ZW50c1xuICAgIGlmICh0aGlzLm5hbWUgPT09ICdvbicgJiYgY3R4LmlzRXZlbnQpIHtcbiAgICAgICAgdGhpcy5hZnRlciA9IGN0eC5uYW1lO1xuICAgIH1cblxuICAgIGlmIChjdHgubmFtZSA9PT0gJ29uJykge1xuICAgICAgICB0aGlzLmlzRXZlbnQgPSB0cnVlO1xuICAgICAgICB0aGlzLmV2ZW50ID0gdGhpcy5uYW1lO1xuICAgICAgICB0aGlzLmFmdGVyID0gY3R4LmFmdGVyO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaXNFdmVudCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmV2ZW50ID0gJ3N1Y2Nlc3MnO1xuICAgIH1cblxuICAgIHRoaXMudGl0bGUgPSBbXG4gICAgICAgIGN0eC50aXRsZSB8fCAnJyxcbiAgICAgICAgdm93LmRlc2NyaXB0aW9uIHx8ICcnXG4gICAgXS5qb2luKC9eWyMuOl0vLnRlc3Qodm93LmRlc2NyaXB0aW9uKSA/ICcnIDogJyAnKS50cmltKCk7XG59O1xuXG4iLCJ2YXIgZXZlbnRzID0gcmVxdWlyZSgnZXZlbnRzJyk7XG4vL1xuLy8gV3JhcCBhIE5vZGUuanMgc3R5bGUgYXN5bmMgZnVuY3Rpb24gaW50byBhbiBFdmVudEVtaXR0ZXJcbi8vXG50aGlzLnByZXBhcmUgPSBmdW5jdGlvbiAob2JqLCB0YXJnZXRzKSB7XG4gICAgdGFyZ2V0cy5mb3JFYWNoKGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgaWYgKHRhcmdldCBpbiBvYmopIHtcbiAgICAgICAgICAgIG9ialt0YXJnZXRdID0gKGZ1bmN0aW9uIChmdW4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlZSA9IG5ldyhldmVudHMuRXZlbnRFbWl0dGVyKTtcblxuICAgICAgICAgICAgICAgICAgICBhcmdzLnB1c2goZnVuY3Rpb24gKGVyciAvKiBbLCBkYXRhXSAqLykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7IGVlLmVtaXQuYXBwbHkoZWUsIFsnZXJyb3InLCBlcnJdLmNvbmNhdChhcmdzKSkgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSAgICAgeyBlZS5lbWl0LmFwcGx5KGVlLCBbJ3N1Y2Nlc3MnXS5jb25jYXQoYXJncykpIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGZ1bi5hcHBseShvYmosIGFyZ3MpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlZTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSkob2JqW3RhcmdldF0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbn07XG5cbiIsInZhciBtYXAgPSB7XG5cdFwiLi9kb3QtbWF0cml4XCI6IFwiLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy9yZXBvcnRlcnMvZG90LW1hdHJpeC5qc1wiLFxuXHRcIi4vZG90LW1hdHJpeC5qc1wiOiBcIi4vbm9kZV9tb2R1bGVzL3Zvd3MvbGliL3Zvd3MvcmVwb3J0ZXJzL2RvdC1tYXRyaXguanNcIixcblx0XCIuL2pzb25cIjogXCIuL25vZGVfbW9kdWxlcy92b3dzL2xpYi92b3dzL3JlcG9ydGVycy9qc29uLmpzXCIsXG5cdFwiLi9qc29uLmpzXCI6IFwiLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy9yZXBvcnRlcnMvanNvbi5qc1wiLFxuXHRcIi4vc2lsZW50XCI6IFwiLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy9yZXBvcnRlcnMvc2lsZW50LmpzXCIsXG5cdFwiLi9zaWxlbnQuanNcIjogXCIuL25vZGVfbW9kdWxlcy92b3dzL2xpYi92b3dzL3JlcG9ydGVycy9zaWxlbnQuanNcIixcblx0XCIuL3NwZWNcIjogXCIuL25vZGVfbW9kdWxlcy92b3dzL2xpYi92b3dzL3JlcG9ydGVycy9zcGVjLmpzXCIsXG5cdFwiLi9zcGVjLmpzXCI6IFwiLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy9yZXBvcnRlcnMvc3BlYy5qc1wiLFxuXHRcIi4vdGFwXCI6IFwiLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy9yZXBvcnRlcnMvdGFwLmpzXCIsXG5cdFwiLi90YXAuanNcIjogXCIuL25vZGVfbW9kdWxlcy92b3dzL2xpYi92b3dzL3JlcG9ydGVycy90YXAuanNcIixcblx0XCIuL3dhdGNoXCI6IFwiLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy9yZXBvcnRlcnMvd2F0Y2guanNcIixcblx0XCIuL3dhdGNoLmpzXCI6IFwiLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy9yZXBvcnRlcnMvd2F0Y2guanNcIixcblx0XCIuL3h1bml0XCI6IFwiLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy9yZXBvcnRlcnMveHVuaXQuanNcIixcblx0XCIuL3h1bml0LmpzXCI6IFwiLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy9yZXBvcnRlcnMveHVuaXQuanNcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9ub2RlX21vZHVsZXMvdm93cy9saWIvdm93cy9yZXBvcnRlcnMgc3luYyByZWN1cnNpdmUgXlxcXFwuXFxcXC8uKiRcIjsiLCJ2YXIgb3B0aW9ucyA9IHsgdGFpbDogJycgfSxcbiAgICBjb25zb2xlID0gcmVxdWlyZSgnLi4vLi4vdm93cy9jb25zb2xlJyksXG4gICAgc3R5bGl6ZSA9IGNvbnNvbGUuc3R5bGl6ZSxcbiAgICBwdXRzID0gY29uc29sZS5wdXRzKG9wdGlvbnMpO1xuLy9cbi8vIENvbnNvbGUgcmVwb3J0ZXJcbi8vXG52YXIgbWVzc2FnZXMgPSBbXSwgbGFzdENvbnRleHQ7XG5cbnRoaXMubmFtZSA9ICdkb3QtbWF0cml4JztcbnRoaXMuc2V0U3RyZWFtID0gZnVuY3Rpb24gKHMpIHtcbiAgICBvcHRpb25zLnN0cmVhbSA9IHM7XG59O1xuXG50aGlzLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIG1lc3NhZ2VzID0gW107XG4gICAgbGFzdENvbnRleHQgPSBudWxsO1xufTtcbnRoaXMucmVwb3J0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgZXZlbnQgPSBkYXRhWzFdO1xuXG4gICAgc3dpdGNoIChkYXRhWzBdKSB7XG4gICAgICAgIGNhc2UgJ3N1YmplY3QnOlxuICAgICAgICAgICAgLy8gbWVzc2FnZXMucHVzaChzdHlsaXplKGV2ZW50LCAndW5kZXJsaW5lJykgKyAnXFxuJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnY29udGV4dCc6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndm93JzpcbiAgICAgICAgICAgIGlmIChldmVudC5zdGF0dXMgPT09ICdob25vcmVkJykge1xuICAgICAgICAgICAgICAgIHB1dHMoc3R5bGl6ZSgnwrcnLCAnZ3JlZW4nKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnN0YXR1cyA9PT0gJ3BlbmRpbmcnKSB7XG4gICAgICAgICAgICAgICAgcHV0cyhzdHlsaXplKCctJywgJ2N5YW4nKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChsYXN0Q29udGV4dCAhPT0gZXZlbnQuY29udGV4dCkge1xuICAgICAgICAgICAgICAgICAgICBsYXN0Q29udGV4dCA9IGV2ZW50LmNvbnRleHQ7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goJyAgJyArIGV2ZW50LmNvbnRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuc3RhdHVzID09PSAnYnJva2VuJykge1xuICAgICAgICAgICAgICAgICAgICBwdXRzKHN0eWxpemUoJ+KclycsICd5ZWxsb3cnKSk7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goY29uc29sZS52b3dUZXh0KGV2ZW50KSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5zdGF0dXMgPT09ICdlcnJvcmVkJykge1xuICAgICAgICAgICAgICAgICAgICBwdXRzKHN0eWxpemUoJ+KclycsICdyZWQnKSk7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goY29uc29sZS52b3dUZXh0KGV2ZW50KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2VuZCc6XG4gICAgICAgICAgICBwdXRzKCcgJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZmluaXNoJzpcbiAgICAgICAgICAgIGlmIChtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBwdXRzKCdcXG5cXG4nICsgbWVzc2FnZXMuam9pbignXFxuJykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwdXRzKCcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHB1dHMoY29uc29sZS5yZXN1bHQoZXZlbnQpLmpvaW4oJ1xcbicpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdlcnJvcic6XG4gICAgICAgICAgICBwdXRzKGNvbnNvbGUuZXJyb3IoZXZlbnQpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn07XG5cbnRoaXMucHJpbnQgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgcHV0cyhzdHIpO1xufTtcbiIsInZhciBvcHRpb25zID0geyB0YWlsOiAnXFxuJywgcmF3OiB0cnVlIH07XG52YXIgY29uc29sZSA9IHJlcXVpcmUoJy4uLy4uL3Zvd3MvY29uc29sZScpO1xudmFyIHB1dHMgPSBjb25zb2xlLnB1dHMob3B0aW9ucyk7XG5cbi8vXG4vLyBDb25zb2xlIEpTT04gcmVwb3J0ZXJcbi8vXG50aGlzLm5hbWUgPSAnanNvbic7XG50aGlzLnNldFN0cmVhbSA9IGZ1bmN0aW9uIChzKSB7XG4gICAgb3B0aW9ucy5zdHJlYW0gPSBzO1xufTtcblxuZnVuY3Rpb24gcmVtb3ZlQ2lyY3VsYXJTdWl0ZShvYmosIHN1aXRlKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gICAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnIHx8IG9iaiA9PT0gbnVsbCkgcmV0dXJuIG9iajtcblxuICAgIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgaWYgKG9ialtrZXldID09PSBzdWl0ZSkge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB7fTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gcmVtb3ZlQ2lyY3VsYXJTdWl0ZShvYmpba2V5XSwgc3VpdGUgfHwgb2JqLnN1aXRlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnRoaXMucmVwb3J0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHB1dHMoSlNPTi5zdHJpbmdpZnkocmVtb3ZlQ2lyY3VsYXJTdWl0ZShvYmopKSk7XG59O1xuXG50aGlzLnByaW50ID0gZnVuY3Rpb24gKHN0cikge307XG4iLCIvL1xuLy8gU2lsZW50IHJlcG9ydGVyIC0gXCJTaGhoXCJcbi8vXG50aGlzLm5hbWUgICAgICA9ICdzaWxlbnQnO1xudGhpcy5zZXRTdHJlYW0gPSBmdW5jdGlvbiAoKSB7fTtcbnRoaXMucmVzZXQgICAgID0gZnVuY3Rpb24gKCkge307XG50aGlzLnJlcG9ydCAgICA9IGZ1bmN0aW9uICgpIHt9O1xudGhpcy5wcmludCAgICAgPSBmdW5jdGlvbiAoKSB7fTtcblxuIiwidmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG5cbnZhciBvcHRpb25zID0geyB0YWlsOiAnXFxuJyB9O1xudmFyIGNvbnNvbGUgPSByZXF1aXJlKCcuLi8uLi92b3dzL2NvbnNvbGUnKTtcbnZhciBzdHlsaXplID0gY29uc29sZS5zdHlsaXplLFxuICAgIHB1dHMgPSBjb25zb2xlLnB1dHMob3B0aW9ucyk7XG4vL1xuLy8gQ29uc29sZSByZXBvcnRlclxuLy9cblxudGhpcy5uYW1lID0gJ3NwZWMnO1xudGhpcy5zZXRTdHJlYW0gPSBmdW5jdGlvbiAocykge1xuICAgIG9wdGlvbnMuc3RyZWFtID0gcztcbn07XG50aGlzLnJlcG9ydCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIGV2ZW50ID0gZGF0YVsxXTtcblxuICAgIHN3aXRjaCAoZGF0YVswXSkge1xuICAgICAgICBjYXNlICdzdWJqZWN0JzpcbiAgICAgICAgICAgIHB1dHMoJ1xcbuKZoiAnICsgc3R5bGl6ZShldmVudCwgJ2JvbGQnKSArICdcXG4nKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjb250ZXh0JzpcbiAgICAgICAgICAgIHB1dHMoY29uc29sZS5jb250ZXh0VGV4dChldmVudCkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3Zvdyc6XG4gICAgICAgICAgICBwdXRzKGNvbnNvbGUudm93VGV4dChldmVudCkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2VuZCc6XG4gICAgICAgICAgICB0aGlzLnByaW50KCdcXG4nKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdmaW5pc2gnOlxuICAgICAgICAgICAgcHV0cyhjb25zb2xlLnJlc3VsdChldmVudCkuam9pbignXFxuJykpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgICAgICAgIHB1dHMoY29uc29sZS5lcnJvcihldmVudCkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufTtcblxudGhpcy5wcmludCA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShzdHIpO1xufTtcbiIsInZhciBvcHRpb25zID0ge1xuICB0YWlsOiBcIlxcblwiXG59O1xudmFyIGNvbnNvbGUgPSByZXF1aXJlKFwiLi4vY29uc29sZVwiKTtcbnZhciBzdHlsaXplID0gY29uc29sZS5zdHlsaXplO1xudmFyIHB1dHMgICAgPSBjb25zb2xlLnB1dHMob3B0aW9ucyk7XG5cbi8vXG4vLyBUQVAgUmVwb3J0ZXJcbi8vXG5cbnRoaXMubmFtZSA9IFwidGFwXCI7XG50aGlzLnNldFN0cmVhbSA9IGZ1bmN0aW9uIHNldFN0cmVhbShzKSB7XG4gIG9wdGlvbnMuc3RyZWFtID0gcztcbn07XG5cbnZhciBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9O1xudmFyIFRhcEludGVyZmFjZSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gVGFwSW50ZXJmYWNlKCkge1xuICAgIHRoaXMuZ2VuT3V0cHV0XyA9IF9fYmluZCh0aGlzLmdlbk91dHB1dF8sIHRoaXMpO1xuICAgIHRoaXMudGVzdENvdW50ID0gX19iaW5kKHRoaXMudGVzdENvdW50LCB0aGlzKTtcbiAgICB0aGlzLmJhaWxPdXQgPSBfX2JpbmQodGhpcy5iYWlsT3V0LCB0aGlzKTtcbiAgICB0aGlzLnNraXAgPSBfX2JpbmQodGhpcy5za2lwLCB0aGlzKTtcbiAgICB0aGlzLm5vdE9rID0gX19iaW5kKHRoaXMubm90T2ssIHRoaXMpO1xuICAgIHRoaXMub2sgPSBfX2JpbmQodGhpcy5vaywgdGhpcyk7XG4gICAgdGhpcy5jb3VudF8gPSAwO1xuICB9XG5cbiAgVGFwSW50ZXJmYWNlLnByb3RvdHlwZS5vayA9IGZ1bmN0aW9uKGRlc2NyaXB0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2VuT3V0cHV0XyhcIm9rXCIsICsrdGhpcy5jb3VudF8sIFwiLSBcIiArIGRlc2NyaXB0aW9uKTtcbiAgfTtcblxuICBUYXBJbnRlcmZhY2UucHJvdG90eXBlLm5vdE9rID0gZnVuY3Rpb24oZGVzY3JpcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5nZW5PdXRwdXRfKFwibm90IG9rXCIsICsrdGhpcy5jb3VudF8sIFwiLSBcIiArIGRlc2NyaXB0aW9uKTtcbiAgfTtcblxuICBUYXBJbnRlcmZhY2UucHJvdG90eXBlLnNraXAgPSBmdW5jdGlvbihkZXNjcmlwdGlvbikge1xuICAgIHJldHVybiB0aGlzLmdlbk91dHB1dF8oXCJva1wiLCArK3RoaXMuY291bnRfLCBcIiMgU0tJUCBcIiArIGRlc2NyaXB0aW9uKTtcbiAgfTtcblxuICBUYXBJbnRlcmZhY2UucHJvdG90eXBlLmJhaWxPdXQgPSBmdW5jdGlvbihyZWFzb24pIHtcbiAgICByZXR1cm4gXCJCYWlsIG91dCFcIiArIChyZWFzb24gIT09IG51bGwgPyBcIiBcIiArIHJlYXNvbiA6IFwiXCIpO1xuICB9O1xuXG4gIFRhcEludGVyZmFjZS5wcm90b3R5cGUudGVzdENvdW50ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiMS4uXCIgKyB0aGlzLmNvdW50XztcbiAgfTtcblxuICBUYXBJbnRlcmZhY2UucHJvdG90eXBlLmdlbk91dHB1dF8gPSBmdW5jdGlvbihzdGF0dXMsIHRlc3ROdW1iZXIsIGRlc2NyaXB0aW9uKSB7XG4gICAgcmV0dXJuIFwiXCIgKyBzdGF0dXMgKyBcIiBcIiArIHRlc3ROdW1iZXIgKyBcIiBcIiArIGRlc2NyaXB0aW9uO1xuICB9O1xuXG4gIHJldHVybiBUYXBJbnRlcmZhY2U7XG59KSgpO1xuXG52YXIgdGFwID0gbmV3IFRhcEludGVyZmFjZSgpO1xuXG50aGlzLnJlcG9ydCA9IGZ1bmN0aW9uIHJlcG9ydChkYXRhKSB7XG4gIHZhciB0eXBlICA9IGRhdGFbMF07XG4gIHZhciBldmVudCA9IGRhdGFbMV07XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgXCJzdWJqZWN0XCI6XG4gICAgICBwdXRzKFwiIyBcIiArIHN0eWxpemUoZXZlbnQsIFwiYm9sZFwiKSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiY29udGV4dFwiOlxuICAgICAgcHV0cyhcIiMgXCIgKyBldmVudCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidm93XCI6XG4gICAgICBzd2l0Y2ggKGV2ZW50LnN0YXR1cykge1xuICAgICAgICBjYXNlIFwiaG9ub3JlZFwiOlxuICAgICAgICAgIHB1dHModGFwLm9rKGV2ZW50LnRpdGxlKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwZW5kaW5nXCI6XG4gICAgICAgICAgcHV0cyh0YXAuc2tpcChldmVudC50aXRsZSkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiYnJva2VuXCI6XG4gICAgICAgICAgcHV0cyh0YXAubm90T2soZXZlbnQudGl0bGUgKyBcIlxcbiMgXCIgKyBldmVudC5leGNlcHRpb24pKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImVycm9yZWRcIjpcbiAgICAgICAgICBwdXRzKHRhcC5ub3RPayhldmVudC50aXRsZSkpO1xuICAgICAgICAgIHB1dHModGFwLmJhaWxPdXQoZXZlbnQuZXhjZXB0aW9uKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiZW5kXCI6XG4gICAgICBwdXRzKFwiXFxuXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImZpbmlzaFwiOlxuICAgICAgcHV0cyh0YXAudGVzdENvdW50KCkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImVycm9yXCI6XG4gICAgICBwdXRzKFwiIz4gRXJyb3JlZFwiKTtcbiAgICAgIHB1dHMoXCIjIFwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgYnJlYWs7XG4gIH1cbn07XG5cbnRoaXMucHJpbnQgPSBmdW5jdGlvbiBwcmludChzdHIpIHtcbiAgcmVxdWlyZShcInV0aWxcIikucHJpbnQoc3RyKTtcbn07XG4iLCJ2YXIgb3B0aW9ucyA9IHt9O1xudmFyIGNvbnNvbGUgPSByZXF1aXJlKCcuLi8uLi92b3dzL2NvbnNvbGUnKTtcbnZhciBzcGVjID0gcmVxdWlyZSgnLi4vLi4vdm93cy9yZXBvcnRlcnMvc3BlYycpO1xudmFyIHN0eWxpemUgPSBjb25zb2xlLnN0eWxpemUsXG4gICAgcHV0cyA9IGNvbnNvbGUucHV0cyhvcHRpb25zKTtcbi8vXG4vLyBDb25zb2xlIHJlcG9ydGVyXG4vL1xudmFyIGxhc3RDb250ZXh0O1xuXG50aGlzLm5hbWUgPSAnd2F0Y2gnO1xudGhpcy5zZXRTdHJlYW0gPSBmdW5jdGlvbiAocykge1xuICAgIG9wdGlvbnMuc3RyZWFtID0gcztcbn07XG50aGlzLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGxhc3RDb250ZXh0ID0gbnVsbDtcbn07XG50aGlzLnJlcG9ydCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIGV2ZW50ID0gZGF0YVsxXTtcblxuICAgIHN3aXRjaCAoZGF0YVswXSkge1xuICAgICAgICBjYXNlICd2b3cnOlxuICAgICAgICAgICAgaWYgKFsnaG9ub3JlZCcsICdwZW5kaW5nJ10uaW5kZXhPZihldmVudC5zdGF0dXMpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGlmIChsYXN0Q29udGV4dCAhPT0gZXZlbnQuY29udGV4dCkge1xuICAgICAgICAgICAgICAgICAgICBsYXN0Q29udGV4dCA9IGV2ZW50LmNvbnRleHQ7XG4gICAgICAgICAgICAgICAgICAgIHB1dHMoY29uc29sZS5jb250ZXh0VGV4dChldmVudC5jb250ZXh0KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHB1dHMoY29uc29sZS52b3dUZXh0KGV2ZW50KSk7XG4gICAgICAgICAgICAgICAgcHV0cygnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZXJyb3InOlxuICAgICAgICAgICAgcHV0cyhjb25zb2xlLmVycm9yKGV2ZW50KSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59O1xudGhpcy5wcmludCA9IGZ1bmN0aW9uIChzdHIpIHt9O1xuIiwiLy8geHVuaXQgb3V0b3B1dCBmb3Igdm93cywgc28gd2UgY2FuIHJ1biB0aGluZ3MgdW5kZXIgaHVkc29uXG4vL1xuLy8gVGhlIHRyYW5zbGF0aW9uIHRvIHh1bml0IGlzIHNpbXBsZS4gIE1vc3QgbGlrZWx5IG1vcmUgdGFncy9hdHRyaWJ1dGVzIGNhbiBiZVxuLy8gYWRkZWQsIHNlZTogaHR0cDovL2FudC4xMDQ1NjgwLm41Lm5hYmJsZS5jb20vc2NoZW1hLWZvci1qdW5pdC14bWwtb3V0cHV0LXRkMTM3NTI3NC5odG1sXG4vL1xuXG52YXIgb3B0aW9ucyA9IHsgdGFpbDogJ1xcbicsIHJhdzogdHJ1ZSB9O1xudmFyIGNvbnNvbGUgPSByZXF1aXJlKCcuLi8uLi92b3dzL2NvbnNvbGUnKTtcbnZhciBwdXRzID0gY29uc29sZS5wdXRzKG9wdGlvbnMpO1xuXG52YXIgYnVmZmVyICAgICAgID0gW10sXG4gICAgY3VyU3ViamVjdCAgID0gbnVsbDtcblxuZnVuY3Rpb24geG1sRW5jKHZhbHVlKSB7XG4gICAgcmV0dXJuICF2YWx1ZSA/IHZhbHVlIDogU3RyaW5nKHZhbHVlKS5yZXBsYWNlKC8mL2csIFwiJmFtcDtcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLz4vZywgXCImZ3Q7XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC88L2csIFwiJmx0O1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXCIvZywgXCImcXVvdDtcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGR7MSwyfW0vZywgJycpO1xufVxuXG5mdW5jdGlvbiB0YWcobmFtZSwgYXR0cmlicywgc2luZ2xlLCBjb250ZW50KSB7XG4gICAgdmFyIHN0ckF0dHIgPSBbXSwgdCwgZW5kID0gJz4nO1xuICAgIGZvciAodmFyIGF0dHIgaW4gYXR0cmlicykge1xuICAgICAgICBpZiAoYXR0cmlicy5oYXNPd25Qcm9wZXJ0eShhdHRyKSkge1xuICAgICAgICAgICAgc3RyQXR0ci5wdXNoKGF0dHIgKyAnPVwiJyArIHhtbEVuYyhhdHRyaWJzW2F0dHJdKSArICdcIicpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChzaW5nbGUpIHtcbiAgICAgICAgZW5kID0gJyAvPic7XG4gICAgfVxuICAgIGlmIChzdHJBdHRyLmxlbmd0aCkge1xuICAgICAgICB0ID0gJzwnICsgbmFtZSArICcgJyArIHN0ckF0dHIuam9pbignICcpICsgZW5kO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHQgPSAnPCcgKyBuYW1lICsgZW5kO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGNvbnRlbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiB0ICsgY29udGVudCArICc8LycgKyBuYW1lICsgZW5kO1xuICAgIH1cbiAgICByZXR1cm4gdDtcbn1cblxuZnVuY3Rpb24gZW5kKG5hbWUpIHtcbiAgICByZXR1cm4gJzwvJyArIG5hbWUgKyAnPic7XG59XG5cbmZ1bmN0aW9uIGNkYXRhKGRhdGEpIHtcbiAgICByZXR1cm4gJzwhW0NEQVRBWycgKyB4bWxFbmMoZGF0YSkgKyAnXV0+Jztcbn1cblxudGhpcy5uYW1lID0gJ3h1bml0JztcbnRoaXMuc2V0U3RyZWFtID0gZnVuY3Rpb24gKHMpIHtcbiAgb3B0aW9ucy5zdHJlYW0gPSBzO1xufTtcbnRoaXMucmVwb3J0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgZXZlbnQgPSBkYXRhWzFdO1xuXG4gICAgc3dpdGNoIChkYXRhWzBdKSB7XG4gICAgY2FzZSAnc3ViamVjdCc6XG4gICAgICAgIGN1clN1YmplY3QgPSBldmVudDtcbiAgICAgICAgYnJlYWs7XG4gICAgY2FzZSAnY29udGV4dCc6XG4gICAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3Zvdyc6XG4gICAgICAgIHN3aXRjaCAoZXZlbnQuc3RhdHVzKSB7XG4gICAgICAgIGNhc2UgJ2hvbm9yZWQnOlxuICAgICAgICAgICAgYnVmZmVyLnB1c2godGFnKCd0ZXN0Y2FzZScsIHtjbGFzc25hbWU6IGN1clN1YmplY3QsIG5hbWU6IGV2ZW50LmNvbnRleHQgKyAnOiAnICsgZXZlbnQudGl0bGV9LCB0cnVlKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYnJva2VuJzpcbiAgICAgICAgICAgIHZhciBlcnIgPSB0YWcoJ2Vycm9yJywge3R5cGU6ICd2b3dzLmV2ZW50LmJyb2tlbicsIG1lc3NhZ2U6ICdCcm9rZW4gdGVzdCd9LCBmYWxzZSwgY2RhdGEoZXZlbnQuZXhjZXB0aW9uKSk7XG4gICAgICAgICAgICBidWZmZXIucHVzaCh0YWcoJ3Rlc3RjYXNlJywge2NsYXNzbmFtZTogY3VyU3ViamVjdCwgbmFtZTogZXZlbnQuY29udGV4dCArICc6ICcgKyBldmVudC50aXRsZX0sIGZhbHNlLCBlcnIpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdlcnJvcmVkJzpcbiAgICAgICAgICAgIHZhciBza2lwID0gdGFnKCdza2lwcGVkJywge3R5cGU6ICd2b3dzLmV2ZW50LmVycm9yZWQnLCBtZXNzYWdlOiAnRXJyb3JlZCB0ZXN0J30sIGZhbHNlLCBjZGF0YShldmVudC5leGNlcHRpb24pKTtcbiAgICAgICAgICAgIGJ1ZmZlci5wdXNoKHRhZygndGVzdGNhc2UnLCB7Y2xhc3NuYW1lOiBjdXJTdWJqZWN0LCBuYW1lOiBldmVudC5jb250ZXh0ICsgJzogJyArIGV2ZW50LnRpdGxlfSwgZmFsc2UsIHNraXApKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdwZW5kaW5nJzpcbiAgICAgICAgICAgIC8vIG5vcFxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgY2FzZSAnZW5kJzpcbiAgICAgICAgYnVmZmVyLnB1c2goZW5kKCd0ZXN0Y2FzZScpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgY2FzZSAnZmluaXNoJzpcbiAgICAgICAgYnVmZmVyLnVuc2hpZnQodGFnKCd0ZXN0c3VpdGUnLCB7bmFtZTogJ1Zvd3MgdGVzdCcsIHRlc3RzOiBldmVudC50b3RhbCwgdGltZXN0YW1wOiAobmV3IERhdGUoKSkudG9VVENTdHJpbmcoKSwgZXJyb3JzOiBldmVudC5lcnJvcmVkLCBmYWlsdXJlczogZXZlbnQuYnJva2VuLCBza2lwOiBldmVudC5wZW5kaW5nLCB0aW1lOiBldmVudC50aW1lfSkpO1xuICAgICAgICBidWZmZXIucHVzaChlbmQoJ3Rlc3RzdWl0ZScpKTtcbiAgICAgICAgcHV0cyhidWZmZXIuam9pbignXFxuJykpO1xuICAgICAgICBicmVhaztcbiAgICBjYXNlICdlcnJvcic6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbn07XG5cbnRoaXMucHJpbnQgPSBmdW5jdGlvbiAoc3RyKSB7IH07XG4iLCJ2YXIgZXZlbnRzID0gcmVxdWlyZSgnZXZlbnRzJyksXG4gICAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxudmFyIHZvd3MgPSByZXF1aXJlKCcuLi92b3dzJyk7XG52YXIgQ29udGV4dCA9IHJlcXVpcmUoJy4uL3Zvd3MvY29udGV4dCcpLkNvbnRleHQ7XG5cbnRoaXMuU3VpdGUgPSBmdW5jdGlvbiAoc3ViamVjdCkge1xuICAgIHRoaXMuc3ViamVjdCA9IHN1YmplY3Q7XG4gICAgdGhpcy5tYXRjaGVyID0gLy4qLztcbiAgICB0aGlzLnJlcG9ydGVyID0gcmVxdWlyZSgnLi9yZXBvcnRlcnMvZG90LW1hdHJpeCcpO1xuICAgIHRoaXMuYmF0Y2hlcyA9IFtdO1xuICAgIHRoaXMub3B0aW9ucyA9IHsgZXJyb3I6IHRydWUgfTtcbiAgICB0aGlzLnJlc2V0KCk7XG59O1xuXG50aGlzLlN1aXRlLnByb3RvdHlwZSA9IG5ldyhmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5yZXN1bHRzID0ge1xuICAgICAgICAgICAgaG9ub3JlZDogMCxcbiAgICAgICAgICAgIGJyb2tlbjogIDAsXG4gICAgICAgICAgICBlcnJvcmVkOiAwLFxuICAgICAgICAgICAgcGVuZGluZzogMCxcbiAgICAgICAgICAgIHRvdGFsOiAgIDAsXG4gICAgICAgICAgICB0aW1lOiAgbnVsbFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmJhdGNoZXMuZm9yRWFjaChmdW5jdGlvbiAoYikge1xuICAgICAgICAgICAgYi5sYXN0Q29udGV4dCA9IG51bGw7XG4gICAgICAgICAgICBiLnJlbWFpbmluZyA9IGIuX3JlbWFpbmluZztcbiAgICAgICAgICAgIGIuaG9ub3JlZCA9IGIuYnJva2VuID0gYi5lcnJvcmVkID0gYi50b3RhbCA9IGIucGVuZGluZyA9IDA7XG4gICAgICAgICAgICBiLnZvd3MuZm9yRWFjaChmdW5jdGlvbiAodm93KSB7IHZvdy5zdGF0dXMgPSBudWxsIH0pO1xuICAgICAgICAgICAgYi50ZWFyZG93bnMgPSBbXTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHRoaXMuYWRkQmF0Y2ggPSBmdW5jdGlvbiAodGVzdHMpIHtcbiAgICAgICAgdGhpcy5iYXRjaGVzLnB1c2goe1xuICAgICAgICAgICAgdGVzdHM6IHRlc3RzLFxuICAgICAgICAgICAgc3VpdGU6ICB0aGlzLFxuICAgICAgICAgICAgdm93czogICAgIFtdLFxuICAgICAgICAgICAgcmVtYWluaW5nOiAwLFxuICAgICAgICAgICBfcmVtYWluaW5nOiAwLFxuICAgICAgICAgICAgaG9ub3JlZDogICAwLFxuICAgICAgICAgICAgYnJva2VuOiAgICAwLFxuICAgICAgICAgICAgZXJyb3JlZDogICAwLFxuICAgICAgICAgICAgcGVuZGluZzogICAwLFxuICAgICAgICAgICAgdG90YWw6ICAgICAwLFxuICAgICAgICAgICAgdGVhcmRvd25zOiBbXVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICB0aGlzLmFkZFZvd3MgPSB0aGlzLmFkZEJhdGNoO1xuXG4gICAgdGhpcy5wYXJzZUJhdGNoID0gZnVuY3Rpb24gKGJhdGNoLCBtYXRjaGVyKSB7XG4gICAgICAgIHZhciB0ZXN0cyA9IGJhdGNoLnRlc3RzO1xuXG4gICAgICAgIGlmICgndG9waWMnIGluIHRlc3RzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcoRXJyb3IpKFwibWlzc2luZyB0b3AtbGV2ZWwgY29udGV4dC5cIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ291bnQgdGhlIG51bWJlciBvZiB2b3dzL2VtaXR0ZXJzIGV4cGVjdGVkIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHdlIGtub3cgd2hlbiB0aGUgdGVzdHMgYXJlIG92ZXIuXG4gICAgICAgIC8vIFdlIG1hdGNoIHRoZSBrZXlzIGFnYWluc3QgYG1hdGNoZXJgLCB0byBkZWNpZGVcbiAgICAgICAgLy8gd2hldGhlciBvciBub3QgdGhleSBzaG91bGQgYmUgaW5jbHVkZWQgaW4gdGhlIHRlc3QuXG4gICAgICAgIC8vIEFueSBrZXksIGluY2x1ZGluZyBhc3NlcnRpb24gZnVuY3Rpb24ga2V5cyBjYW4gYmUgbWF0Y2hlZC5cbiAgICAgICAgLy8gSWYgYSBjaGlsZCBtYXRjaGVzLCB0aGVuIHRoZSBuIHBhcmVudCB0b3BpY3MgbXVzdCBub3QgYmUgc2tpcHBlZC5cbiAgICAgICAgKGZ1bmN0aW9uIGNvdW50KHRlc3RzLCBfbWF0Y2gpIHtcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IGZhbHNlO1xuXG4gICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHRlc3RzKS5maWx0ZXIoZnVuY3Rpb24gKGspIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gayAhPT0gJ3RvcGljJyAmJiBrICE9PSAndGVhcmRvd24nO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBrZXk7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAga2V5ID0ga2V5c1tpXTtcblxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBwYXJlbnQgbm9kZSwgb3IgdGhpcyBvbmUgbWF0Y2hlcy5cbiAgICAgICAgICAgICAgICBtYXRjaCA9IF9tYXRjaCB8fCBtYXRjaGVyLnRlc3Qoa2V5KTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YodGVzdHNba2V5XSkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoID0gY291bnQodGVzdHNba2V5XSwgbWF0Y2gpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YodGVzdHNba2V5XSkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXN0c1trZXldID0gbmV3KFN0cmluZykodGVzdHNba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEgbWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RzW2tleV0uX3NraXAgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBhbnkgb2YgdGhlIGNoaWxkcmVuIG1hdGNoZWQsXG4gICAgICAgICAgICAvLyBkb24ndCBza2lwIHRoaXMgbm9kZS5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICghIHRlc3RzW2tleXNbaV1dLl9za2lwKSB7IG1hdGNoID0gdHJ1ZSB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtYXRjaCkgeyBiYXRjaC5yZW1haW5pbmcgKysgfVxuICAgICAgICAgICAgZWxzZSAgICAgICB7IHRlc3RzLl9za2lwID0gdHJ1ZSB9XG5cbiAgICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgfSkodGVzdHMsIGZhbHNlKTtcblxuICAgICAgICBiYXRjaC5fcmVtYWluaW5nID0gYmF0Y2gucmVtYWluaW5nO1xuICAgIH07XG5cbiAgICB0aGlzLnJ1bkJhdGNoID0gZnVuY3Rpb24gKGJhdGNoKSB7XG4gICAgICAgIHZhciB0b3BpYyxcbiAgICAgICAgICAgIHRlc3RzICAgPSBiYXRjaC50ZXN0cyxcbiAgICAgICAgICAgIGVtaXR0ZXIgPSBiYXRjaC5lbWl0dGVyID0gbmV3KGV2ZW50cy5FdmVudEVtaXR0ZXIpO1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICBiYXRjaC5zdGF0dXMgPSAnYmVnaW4nO1xuXG4gICAgICAgIC8vIFRoZSB0ZXN0IHJ1bm5lciwgaXQgY2FsbHMgaXRzZWxmIHJlY3Vyc2l2ZWx5LCBwYXNzaW5nIHRoZVxuICAgICAgICAvLyBwcmV2aW91cyBjb250ZXh0IHRvIHRoZSBpbm5lciBjb250ZXh0cy4gVGhpcyBpcyBzbyB0aGUgYHRvcGljYFxuICAgICAgICAvLyBmdW5jdGlvbnMgaGF2ZSBhY2Nlc3MgdG8gYWxsIHRoZSBwcmV2aW91cyBjb250ZXh0IHRvcGljcyBpbiB0aGVpclxuICAgICAgICAvLyBhcmd1bWVudHMgbGlzdC5cbiAgICAgICAgLy8gSXQgaXMgZGVmaW5lZCBhbmQgaW52b2tlZCBhdCB0aGUgc2FtZSB0aW1lLlxuICAgICAgICAvLyBJZiBpdCBlbmNvdW50ZXJzIGEgYHRvcGljYCBmdW5jdGlvbiwgaXQgd2FpdHMgZm9yIHRoZSByZXR1cm5lZFxuICAgICAgICAvLyBlbWl0dGVyIHRvIGVtaXQgKHRoZSB0b3BpYyksIGF0IHdoaWNoIHBvaW50IGl0IHJ1bnMgdGhlIGZ1bmN0aW9ucyB1bmRlciBpdCxcbiAgICAgICAgLy8gcGFzc2luZyB0aGUgdG9waWMgYXMgYW4gYXJndW1lbnQuXG4gICAgICAgIChmdW5jdGlvbiBydW4oY3R4LCBsYXN0VG9waWMpIHtcbiAgICAgICAgICAgIHZhciBvbGQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRvcGljID0gY3R4LnRlc3RzLnRvcGljO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mKHRvcGljKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGlmIChjdHguaXNFdmVudCB8fCBjdHgubmFtZSA9PT0gJ29uJykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V2ZW50IGNvbnRleHQgY2Fubm90IGNvbnRhaW4gYSB0b3BpYycpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFJ1biB0aGUgdG9waWMsIHBhc3NpbmcgdGhlIHByZXZpb3VzIGNvbnRleHQgdG9waWNzXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdG9waWMgPSB0b3BpYy5hcHBseShjdHguZW52LCBjdHgudG9waWNzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gSWYgYW4gdW5leHBlY3RlZCBlcnJvciBvY2N1cnMgaW4gdGhlIHRvcGljLCBzZXQgdGhlIHJldHVyblxuICAgICAgICAgICAgICAgIC8vIHZhbHVlIHRvICd1bmRlZmluZWQnIGFuZCBjYWxsIGJhY2sgd2l0aCB0aGUgZXJyb3JcbiAgICAgICAgICAgICAgICBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4LmVudi5jYWxsYmFjayhleCk7XG4gICAgICAgICAgICAgICAgICAgIHRvcGljID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YodG9waWMpID09PSAndW5kZWZpbmVkJykgeyBjdHguX2NhbGxiYWNrID0gdHJ1ZSB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIHRoaXMgY29udGV4dCBoYXMgYSB0b3BpYywgc3RvcmUgaXQgaW4gYGxhc3RUb3BpY2AsXG4gICAgICAgICAgICAvLyBpZiBub3QsIHVzZSB0aGUgbGFzdCB0b3BpYywgcGFzc2VkIGRvd24gYnkgYSBwYXJlbnRcbiAgICAgICAgICAgIC8vIGNvbnRleHQuXG4gICAgICAgICAgICBpZiAodHlwZW9mKHRvcGljKSAhPT0gJ3VuZGVmaW5lZCcgfHwgY3R4Ll9jYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGxhc3RUb3BpYyA9IHRvcGljO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvbGQgICA9IHRydWU7XG4gICAgICAgICAgICAgICAgdG9waWMgPSBsYXN0VG9waWM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIHRoZSB0b3BpYyBkb2Vzbid0IHJldHVybiBhbiBldmVudCBlbWl0dGVyIChzdWNoIGFzIGFuIEV2ZW50RW1pdHRlciksXG4gICAgICAgICAgICAvLyB3ZSBjcmVhdGUgaXQgb3Vyc2VsdmVzLCBhbmQgZW1pdCB0aGUgdmFsdWUgb24gdGhlIG5leHQgdGljay5cbiAgICAgICAgICAgIGlmICghICh0b3BpYyAmJlxuICAgICAgICAgICAgICAgICAgIHRvcGljLmNvbnN0cnVjdG9yID09PSBldmVudHMuRXZlbnRFbWl0dGVyKSkge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBjb250ZXh0IGlzIGEgdHJhZGl0aW9uYWwgdm93LCB0aGVuIGEgdG9waWMgY2FuIE9OTFlcbiAgICAgICAgICAgICAgICAvLyBiZSBhbiBFdmVudEVtaXR0ZXIuICBIb3dldmVyIGlmIHRoZSBjb250ZXh0IGlzIGEgc3ViLWV2ZW50XG4gICAgICAgICAgICAgICAgLy8gdGhlbiB0aGUgdG9waWMgbWF5IGJlIGFuIGluc3RhbmNlb2YgRXZlbnRFbWl0dGVyXG4gICAgICAgICAgICAgICAgaWYgKCFjdHguaXNFdmVudCB8fFxuICAgICAgICAgICAgICAgICAgIChjdHguaXNFdmVudCAmJiAhKHRvcGljIGluc3RhbmNlb2YgZXZlbnRzLkV2ZW50RW1pdHRlcikpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICBjdHguZW1pdHRlciA9IG5ldyhldmVudHMuRXZlbnRFbWl0dGVyKTtcblxuICAgICAgICAgICAgICAgICAgICAgIGlmICghIGN0eC5fY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHguZW1pdHRlci5lbWl0KFwic3VjY2Vzc1wiLCB2YWwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KHRvcGljKSk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIEkgaGF2ZSBhIGNhbGxiYWNrLCBwdXNoIHRoZSBuZXcgdG9waWMgYmFjayB1cCB0b1xuICAgICAgICAgICAgICAgICAgICAgIC8vIGxhc3RUb3BpY1xuICAgICAgICAgICAgICAgICAgICAgIGlmIChjdHguX2NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RUb3BpYyA9IHRvcGljID0gY3R4LmVtaXR0ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdG9waWMgPSBjdHguZW1pdHRlcjtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0b3BpYy5vbihjdHguZXZlbnQsIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgICAgICAvLyBPbmNlIHRoZSB0b3BpYyBmaXJlcywgYWRkIHRoZSByZXR1cm4gdmFsdWVcbiAgICAgICAgICAgICAgICAvLyB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSB0b3BpY3MgbGlzdCwgc28gaXRcbiAgICAgICAgICAgICAgICAvLyBiZWNvbWVzIHRoZSBmaXJzdCBhcmd1bWVudCBmb3IgdGhlIG5leHQgdG9waWMuXG4gICAgICAgICAgICAgICAgLy8gSWYgd2UncmUgdXNpbmcgdGhlIHBhcmVudCB0b3BpYywgbm8gbmVlZCB0b1xuICAgICAgICAgICAgICAgIC8vIHByZXBlbmQgaXQgdG8gdGhlIHRvcGljcyBsaXN0LCBvciB3ZSdsbCBnZXRcbiAgICAgICAgICAgICAgICAvLyBkdXBsaWNhdGVzLlxuICAgICAgICAgICAgICAgIGlmICghb2xkIHx8IGN0eC5pc0V2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS51bnNoaWZ0LmFwcGx5KGN0eC50b3BpY3MsIGFyZ3VtZW50cylcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodG9waWMuc2V0TWF4TGlzdGVuZXJzKSB7IHRvcGljLnNldE1heExpc3RlbmVycyhJbmZpbml0eSkgfVxuICAgICAgICAgICAgLy8gTm93IHJ1biB0aGUgdGVzdHMsIG9yIHN1Yi1jb250ZXh0c1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoY3R4LnRlc3RzKS5maWx0ZXIoZnVuY3Rpb24gKGspIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LnRlc3RzW2tdICYmIGsgIT09ICd0b3BpYycgICAgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGsgIT09ICd0ZWFyZG93bicgJiYgIWN0eC50ZXN0c1trXS5fc2tpcDtcbiAgICAgICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYSBuZXcgZXZhbHVhdGlvbiBjb250ZXh0LFxuICAgICAgICAgICAgICAgIC8vIGluaGVyaXRpbmcgZnJvbSB0aGUgcGFyZW50IG9uZS5cbiAgICAgICAgICAgICAgICB2YXIgZW52ID0gT2JqZWN0LmNyZWF0ZShjdHguZW52KTtcbiAgICAgICAgICAgICAgICBlbnYuc3VpdGUgPSB0aGF0O1xuXG4gICAgICAgICAgICAgICAgLy8gSG9sZHMgdGhlIGN1cnJlbnQgdGVzdCBvciBjb250ZXh0XG4gICAgICAgICAgICAgICAgdmFyIHZvdyA9IE9iamVjdC5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogY3R4LnRlc3RzW2l0ZW1dLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBjdHgudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBpdGVtLFxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiBjdHguZW52LFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGJhdGNoOiBiYXRjaFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gSWYgd2UgZW5jb3VudGVyIGEgZnVuY3Rpb24sIGFkZCBpdCB0byB0aGUgY2FsbGJhY2tzXG4gICAgICAgICAgICAgICAgLy8gb2YgdGhlIGB0b3BpY2AgZnVuY3Rpb24sIHNvIGl0J2xsIGdldCBjYWxsZWQgb25jZSB0aGVcbiAgICAgICAgICAgICAgICAvLyB0b3BpYyBmaXJlcy5cbiAgICAgICAgICAgICAgICAvLyBJZiB3ZSBlbmNvdW50ZXIgYW4gb2JqZWN0IGxpdGVyYWwsIHdlIHJlY3Vyc2UsIHNlbmRpbmcgaXRcbiAgICAgICAgICAgICAgICAvLyBvdXIgY3VycmVudCBjb250ZXh0LlxuICAgICAgICAgICAgICAgIGlmICgodHlwZW9mKHZvdy5jYWxsYmFjaykgPT09ICdmdW5jdGlvbicpIHx8XG4gICAgICAgICAgICAgICAgICAgICh2b3cuY2FsbGJhY2sgaW5zdGFuY2VvZiBTdHJpbmcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvcGljLmFkZFZvdyh2b3cpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mKHZvdy5jYWxsYmFjaykgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlJ3MgYSBzZXR1cCBzdGFnZSwgd2UgaGF2ZSB0byB3YWl0IGZvciBpdCB0byBmaXJlLFxuICAgICAgICAgICAgICAgICAgICAvLyBiZWZvcmUgY2FsbGluZyB0aGUgaW5uZXIgY29udGV4dC5cbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIGV2ZW50IGhhcyBhbHJlYWR5IGZpcmVkLCB0aGUgY29udGV4dCBpcyAnb24nIG9yXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZXJlIGlzIG5vIHNldHVwIHN0YWdlLCBqdXN0IHJ1biB0aGUgaW5uZXIgY29udGV4dFxuICAgICAgICAgICAgICAgICAgICAvLyBzeW5jaHJvbm91c2x5LlxuICAgICAgICAgICAgICAgICAgICBpZiAodG9waWMgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5uYW1lICE9PSAnb24nICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAoIXRvcGljLl92b3dzRW1pdGVkRXZlbnRzIHx8ICF0b3BpYy5fdm93c0VtaXRlZEV2ZW50cy5oYXNPd25Qcm9wZXJ0eShjdHguZXZlbnQpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJ1bklubmVyQ29udGV4dCA9IGZ1bmN0aW9uKGN0eCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBydW4obmV3IChDb250ZXh0KSh2b3csIGN0eCwgZW52KSwgbGFzdFRvcGljKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfShjdHgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9waWMub24oY3R4LmV2ZW50LCBydW5Jbm5lckNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUnVuIGFuIGlubmVyIGNvbnRleHQgaWYgdGhlIG91dGVyIGNvbnRleHQgZmFpbHMsIHRvby5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcGljLm9uKCdlcnJvcicsIHJ1bklubmVyQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBydW4obmV3IChDb250ZXh0KSh2b3csIGN0eCwgZW52KSwgbGFzdFRvcGljKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gVGVhcmRvd25cbiAgICAgICAgICAgIGlmIChjdHgudGVzdHMudGVhcmRvd24pIHtcbiAgICAgICAgICAgICAgICBiYXRjaC50ZWFyZG93bnMucHVzaChjdHgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEgY3R4LnRlc3RzLl9za2lwKSB7XG4gICAgICAgICAgICAgICAgYmF0Y2gucmVtYWluaW5nIC0tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgd2UncmUgZG9uZSBydW5uaW5nIHRoZSB0ZXN0c1xuICAgICAgICAgICAgZXhwb3J0cy50cnlFbmQoYmF0Y2gpO1xuICAgICAgICAvLyBUaGlzIGlzIG91ciBpbml0aWFsLCBlbXB0eSBjb250ZXh0XG4gICAgICAgIH0pKG5ldyhDb250ZXh0KSh7IGNhbGxiYWNrOiB0ZXN0cywgY29udGV4dDogbnVsbCwgZGVzY3JpcHRpb246IG51bGwgfSwge30pKTtcbiAgICAgICAgcmV0dXJuIGVtaXR0ZXI7XG4gICAgfTtcblxuICAgIHRoaXMucmVwb3J0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBvcnRlci5yZXBvcnQuYXBwbHkodGhpcy5yZXBvcnRlciwgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgdGhpcy5ydW4gPSBmdW5jdGlvbiAob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLCBzdGFydDtcblxuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICBPYmplY3Qua2V5cyhvcHRpb25zKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgICB0aGF0Lm9wdGlvbnNba10gPSBvcHRpb25zW2tdO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm1hdGNoZXIgPSB0aGlzLm9wdGlvbnMubWF0Y2hlciAgfHwgdGhpcy5tYXRjaGVyO1xuXG4gICAgICAgIGlmIChvcHRpb25zLnJlcG9ydGVyKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMucmVwb3J0ZXIgPSB0eXBlb2Ygb3B0aW9ucy5yZXBvcnRlciA9PT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICA/IHJlcXVpcmUoJy4vcmVwb3J0ZXJzLycgKyBvcHRpb25zLnJlcG9ydGVyKVxuICAgICAgICAgICAgICAgIDogb3B0aW9ucy5yZXBvcnRlcjtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUmVwb3J0ZXIgd2FzIG5vdCBmb3VuZCwgZGVmYXVsdGluZyB0byBkb3QtbWF0cml4LicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYmF0Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uIChiYXRjaCkge1xuICAgICAgICAgICAgdGhhdC5wYXJzZUJhdGNoKGJhdGNoLCB0aGF0Lm1hdGNoZXIpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICAgICAgc3RhcnQgPSBuZXcoRGF0ZSk7XG5cbiAgICAgICAgaWYgKHRoaXMuYmF0Y2hlcy5maWx0ZXIoZnVuY3Rpb24gKGIpIHsgcmV0dXJuIGIucmVtYWluaW5nID4gMCB9KS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMucmVwb3J0KFsnc3ViamVjdCcsIHRoaXMuc3ViamVjdF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChmdW5jdGlvbiBydW4oYmF0Y2hlcykge1xuICAgICAgICAgICAgdmFyIGJhdGNoID0gYmF0Y2hlcy5zaGlmdCgpO1xuXG4gICAgICAgICAgICBpZiAoYmF0Y2gpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgYmF0Y2ggaGFzIG5vIHZvd3MgdG8gcnVuLFxuICAgICAgICAgICAgICAgIC8vIGdvIHRvIHRoZSBuZXh0IG9uZS5cbiAgICAgICAgICAgICAgICBpZiAoYmF0Y2gucmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1bihiYXRjaGVzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGF0LnJ1bkJhdGNoKGJhdGNoKS5vbignZW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcnVuKGJhdGNoZXMpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoYXQucmVzdWx0cy50aW1lID0gKG5ldyhEYXRlKSAtIHN0YXJ0KSAvIDEwMDA7XG4gICAgICAgICAgICAgICAgdGhhdC5yZXBvcnQoWydmaW5pc2gnLCB0aGF0LnJlc3VsdHNdKTtcblxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykgeyBjYWxsYmFjayh0aGF0LnJlc3VsdHMpIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGF0LnJlc3VsdHMuaG9ub3JlZCArIHRoYXQucmVzdWx0cy5wZW5kaW5nID09PSB0aGF0LnJlc3VsdHMudG90YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSh0aGlzLmJhdGNoZXMuc2xpY2UoMCkpO1xuICAgIH07XG5cbiAgICB0aGlzLnJ1blBhcmFsbGVsID0gZnVuY3Rpb24gKCkge307XG5cbiAgICB0aGlzLmV4cG9ydCA9IGZ1bmN0aW9uIChtb2R1bGUsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKG9wdGlvbnMgfHwge30pLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgICAgIHRoYXQub3B0aW9uc1trXSA9IG9wdGlvbnNba107XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChyZXF1aXJlLm1haW4gPT09IG1vZHVsZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucnVuKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbW9kdWxlLmV4cG9ydHNbdGhpcy5zdWJqZWN0XSA9IHRoaXM7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMuZXhwb3J0VG8gPSBmdW5jdGlvbiAobW9kdWxlLCBvcHRpb25zKSB7IC8vIEFsaWFzLCBmb3IgSlNMaW50XG4gICAgICAgIHJldHVybiB0aGlzLmV4cG9ydChtb2R1bGUsIG9wdGlvbnMpO1xuICAgIH07XG59KTtcblxuLy9cbi8vIENoZWNrcyBpZiBhbGwgdGhlIHRlc3RzIGluIHRoZSBiYXRjaCBoYXZlIGJlZW4gcnVuLFxuLy8gYW5kIHRyaWdnZXJzIHRoZSBuZXh0IGJhdGNoIChpZiBhbnkpLCBieSBlbWl0dGluZyB0aGUgJ2VuZCcgZXZlbnQuXG4vL1xudGhpcy50cnlFbmQgPSBmdW5jdGlvbiAoYmF0Y2gpIHtcbiAgICB2YXIgcmVzdWx0LCBzdHlsZSwgdGltZTtcblxuICAgIGlmIChiYXRjaC5ob25vcmVkICsgYmF0Y2guYnJva2VuICsgYmF0Y2guZXJyb3JlZCArIGJhdGNoLnBlbmRpbmcgPT09IGJhdGNoLnRvdGFsICYmXG4gICAgICAgIGJhdGNoLnJlbWFpbmluZyA9PT0gMCkge1xuXG4gICAgICAgIE9iamVjdC5rZXlzKGJhdGNoKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgICAoayBpbiBiYXRjaC5zdWl0ZS5yZXN1bHRzKSAmJiAoYmF0Y2guc3VpdGUucmVzdWx0c1trXSArPSBiYXRjaFtrXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChiYXRjaC50ZWFyZG93bnMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBiYXRjaC50ZWFyZG93bnMubGVuZ3RoIC0gMSwgY3R4OyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIHJ1blRlYXJkb3duKGJhdGNoLnRlYXJkb3duc1tpXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1heWJlRmluaXNoKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBydW5UZWFyZG93bih0ZWFyZG93bikge1xuICAgICAgICAgICAgdmFyIGVudiA9IE9iamVjdC5jcmVhdGUodGVhcmRvd24uZW52KTtcblxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVudiwgXCJjYWxsYmFja1wiLCB7XG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlYXJkb3duLmF3YWl0aW5nQ2FsbGJhY2sgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZWFyZG93bi5hd2FpdGluZ0NhbGxiYWNrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXliZUZpbmlzaCgpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0ZWFyZG93bi50ZXN0cy50ZWFyZG93bi5hcHBseShlbnYsIHRlYXJkb3duLnRvcGljcyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBtYXliZUZpbmlzaCgpIHtcbiAgICAgICAgICAgIHZhciBwZW5kaW5nID0gYmF0Y2gudGVhcmRvd25zLmZpbHRlcihmdW5jdGlvbiAodGVhcmRvd24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGVhcmRvd24uYXdhaXRpbmdDYWxsYmFjaztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAocGVuZGluZy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBmaW5pc2goKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZpbmlzaCgpIHtcbiAgICAgICAgICAgIGJhdGNoLnN0YXR1cyA9ICdlbmQnO1xuICAgICAgICAgICAgYmF0Y2guc3VpdGUucmVwb3J0KFsnZW5kJ10pO1xuICAgICAgICAgICAgYmF0Y2guZW1pdHRlci5lbWl0KCdlbmQnLCBiYXRjaC5ob25vcmVkLCBiYXRjaC5icm9rZW4sIGJhdGNoLmVycm9yZWQsIGJhdGNoLnBlbmRpbmcpO1xuICAgICAgICB9XG4gICAgfVxufTtcbiIsIi8qIVxuXG4gZGlmZiB2NC4wLjFcblxuU29mdHdhcmUgTGljZW5zZSBBZ3JlZW1lbnQgKEJTRCBMaWNlbnNlKVxuXG5Db3B5cmlnaHQgKGMpIDIwMDktMjAxNSwgS2V2aW4gRGVja2VyIDxrcGRlY2tlckBnbWFpbC5jb20+XG5cbkFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cblJlZGlzdHJpYnV0aW9uIGFuZCB1c2Ugb2YgdGhpcyBzb2Z0d2FyZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0IG1vZGlmaWNhdGlvbixcbmFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcblxuKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlXG4gIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGVcbiAgZm9sbG93aW5nIGRpc2NsYWltZXIuXG5cbiogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZVxuICBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlXG4gIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlclxuICBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuXG4qIE5laXRoZXIgdGhlIG5hbWUgb2YgS2V2aW4gRGVja2VyIG5vciB0aGUgbmFtZXMgb2YgaXRzXG4gIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHNcbiAgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvclxuICB3cml0dGVuIHBlcm1pc3Npb24uXG5cblRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiIEFORCBBTlkgRVhQUkVTUyBPUlxuSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBPV05FUiBPUlxuQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTFxuREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLFxuREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVJcbklOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVRcbk9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbkBsaWNlbnNlXG4qL1xuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuICAoZ2xvYmFsID0gZ2xvYmFsIHx8IHNlbGYsIGZhY3RvcnkoZ2xvYmFsLkRpZmYgPSB7fSkpO1xufSh0aGlzLCBmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gRGlmZigpIHt9XG4gIERpZmYucHJvdG90eXBlID0ge1xuICAgIGRpZmY6IGZ1bmN0aW9uIGRpZmYob2xkU3RyaW5nLCBuZXdTdHJpbmcpIHtcbiAgICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB7fTtcbiAgICAgIHZhciBjYWxsYmFjayA9IG9wdGlvbnMuY2FsbGJhY2s7XG5cbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjYWxsYmFjayA9IG9wdGlvbnM7XG4gICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgZnVuY3Rpb24gZG9uZSh2YWx1ZSkge1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKHVuZGVmaW5lZCwgdmFsdWUpO1xuICAgICAgICAgIH0sIDApO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSAvLyBBbGxvdyBzdWJjbGFzc2VzIHRvIG1hc3NhZ2UgdGhlIGlucHV0IHByaW9yIHRvIHJ1bm5pbmdcblxuXG4gICAgICBvbGRTdHJpbmcgPSB0aGlzLmNhc3RJbnB1dChvbGRTdHJpbmcpO1xuICAgICAgbmV3U3RyaW5nID0gdGhpcy5jYXN0SW5wdXQobmV3U3RyaW5nKTtcbiAgICAgIG9sZFN0cmluZyA9IHRoaXMucmVtb3ZlRW1wdHkodGhpcy50b2tlbml6ZShvbGRTdHJpbmcpKTtcbiAgICAgIG5ld1N0cmluZyA9IHRoaXMucmVtb3ZlRW1wdHkodGhpcy50b2tlbml6ZShuZXdTdHJpbmcpKTtcbiAgICAgIHZhciBuZXdMZW4gPSBuZXdTdHJpbmcubGVuZ3RoLFxuICAgICAgICAgIG9sZExlbiA9IG9sZFN0cmluZy5sZW5ndGg7XG4gICAgICB2YXIgZWRpdExlbmd0aCA9IDE7XG4gICAgICB2YXIgbWF4RWRpdExlbmd0aCA9IG5ld0xlbiArIG9sZExlbjtcbiAgICAgIHZhciBiZXN0UGF0aCA9IFt7XG4gICAgICAgIG5ld1BvczogLTEsXG4gICAgICAgIGNvbXBvbmVudHM6IFtdXG4gICAgICB9XTsgLy8gU2VlZCBlZGl0TGVuZ3RoID0gMCwgaS5lLiB0aGUgY29udGVudCBzdGFydHMgd2l0aCB0aGUgc2FtZSB2YWx1ZXNcblxuICAgICAgdmFyIG9sZFBvcyA9IHRoaXMuZXh0cmFjdENvbW1vbihiZXN0UGF0aFswXSwgbmV3U3RyaW5nLCBvbGRTdHJpbmcsIDApO1xuXG4gICAgICBpZiAoYmVzdFBhdGhbMF0ubmV3UG9zICsgMSA+PSBuZXdMZW4gJiYgb2xkUG9zICsgMSA+PSBvbGRMZW4pIHtcbiAgICAgICAgLy8gSWRlbnRpdHkgcGVyIHRoZSBlcXVhbGl0eSBhbmQgdG9rZW5pemVyXG4gICAgICAgIHJldHVybiBkb25lKFt7XG4gICAgICAgICAgdmFsdWU6IHRoaXMuam9pbihuZXdTdHJpbmcpLFxuICAgICAgICAgIGNvdW50OiBuZXdTdHJpbmcubGVuZ3RoXG4gICAgICAgIH1dKTtcbiAgICAgIH0gLy8gTWFpbiB3b3JrZXIgbWV0aG9kLiBjaGVja3MgYWxsIHBlcm11dGF0aW9ucyBvZiBhIGdpdmVuIGVkaXQgbGVuZ3RoIGZvciBhY2NlcHRhbmNlLlxuXG5cbiAgICAgIGZ1bmN0aW9uIGV4ZWNFZGl0TGVuZ3RoKCkge1xuICAgICAgICBmb3IgKHZhciBkaWFnb25hbFBhdGggPSAtMSAqIGVkaXRMZW5ndGg7IGRpYWdvbmFsUGF0aCA8PSBlZGl0TGVuZ3RoOyBkaWFnb25hbFBhdGggKz0gMikge1xuICAgICAgICAgIHZhciBiYXNlUGF0aCA9IHZvaWQgMDtcblxuICAgICAgICAgIHZhciBhZGRQYXRoID0gYmVzdFBhdGhbZGlhZ29uYWxQYXRoIC0gMV0sXG4gICAgICAgICAgICAgIHJlbW92ZVBhdGggPSBiZXN0UGF0aFtkaWFnb25hbFBhdGggKyAxXSxcbiAgICAgICAgICAgICAgX29sZFBvcyA9IChyZW1vdmVQYXRoID8gcmVtb3ZlUGF0aC5uZXdQb3MgOiAwKSAtIGRpYWdvbmFsUGF0aDtcblxuICAgICAgICAgIGlmIChhZGRQYXRoKSB7XG4gICAgICAgICAgICAvLyBObyBvbmUgZWxzZSBpcyBnb2luZyB0byBhdHRlbXB0IHRvIHVzZSB0aGlzIHZhbHVlLCBjbGVhciBpdFxuICAgICAgICAgICAgYmVzdFBhdGhbZGlhZ29uYWxQYXRoIC0gMV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGNhbkFkZCA9IGFkZFBhdGggJiYgYWRkUGF0aC5uZXdQb3MgKyAxIDwgbmV3TGVuLFxuICAgICAgICAgICAgICBjYW5SZW1vdmUgPSByZW1vdmVQYXRoICYmIDAgPD0gX29sZFBvcyAmJiBfb2xkUG9zIDwgb2xkTGVuO1xuXG4gICAgICAgICAgaWYgKCFjYW5BZGQgJiYgIWNhblJlbW92ZSkge1xuICAgICAgICAgICAgLy8gSWYgdGhpcyBwYXRoIGlzIGEgdGVybWluYWwgdGhlbiBwcnVuZVxuICAgICAgICAgICAgYmVzdFBhdGhbZGlhZ29uYWxQYXRoXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH0gLy8gU2VsZWN0IHRoZSBkaWFnb25hbCB0aGF0IHdlIHdhbnQgdG8gYnJhbmNoIGZyb20uIFdlIHNlbGVjdCB0aGUgcHJpb3JcbiAgICAgICAgICAvLyBwYXRoIHdob3NlIHBvc2l0aW9uIGluIHRoZSBuZXcgc3RyaW5nIGlzIHRoZSBmYXJ0aGVzdCBmcm9tIHRoZSBvcmlnaW5cbiAgICAgICAgICAvLyBhbmQgZG9lcyBub3QgcGFzcyB0aGUgYm91bmRzIG9mIHRoZSBkaWZmIGdyYXBoXG5cblxuICAgICAgICAgIGlmICghY2FuQWRkIHx8IGNhblJlbW92ZSAmJiBhZGRQYXRoLm5ld1BvcyA8IHJlbW92ZVBhdGgubmV3UG9zKSB7XG4gICAgICAgICAgICBiYXNlUGF0aCA9IGNsb25lUGF0aChyZW1vdmVQYXRoKTtcbiAgICAgICAgICAgIHNlbGYucHVzaENvbXBvbmVudChiYXNlUGF0aC5jb21wb25lbnRzLCB1bmRlZmluZWQsIHRydWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiYXNlUGF0aCA9IGFkZFBhdGg7IC8vIE5vIG5lZWQgdG8gY2xvbmUsIHdlJ3ZlIHB1bGxlZCBpdCBmcm9tIHRoZSBsaXN0XG5cbiAgICAgICAgICAgIGJhc2VQYXRoLm5ld1BvcysrO1xuICAgICAgICAgICAgc2VsZi5wdXNoQ29tcG9uZW50KGJhc2VQYXRoLmNvbXBvbmVudHMsIHRydWUsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgX29sZFBvcyA9IHNlbGYuZXh0cmFjdENvbW1vbihiYXNlUGF0aCwgbmV3U3RyaW5nLCBvbGRTdHJpbmcsIGRpYWdvbmFsUGF0aCk7IC8vIElmIHdlIGhhdmUgaGl0IHRoZSBlbmQgb2YgYm90aCBzdHJpbmdzLCB0aGVuIHdlIGFyZSBkb25lXG5cbiAgICAgICAgICBpZiAoYmFzZVBhdGgubmV3UG9zICsgMSA+PSBuZXdMZW4gJiYgX29sZFBvcyArIDEgPj0gb2xkTGVuKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9uZShidWlsZFZhbHVlcyhzZWxmLCBiYXNlUGF0aC5jb21wb25lbnRzLCBuZXdTdHJpbmcsIG9sZFN0cmluZywgc2VsZi51c2VMb25nZXN0VG9rZW4pKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlIHRyYWNrIHRoaXMgcGF0aCBhcyBhIHBvdGVudGlhbCBjYW5kaWRhdGUgYW5kIGNvbnRpbnVlLlxuICAgICAgICAgICAgYmVzdFBhdGhbZGlhZ29uYWxQYXRoXSA9IGJhc2VQYXRoO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGVkaXRMZW5ndGgrKztcbiAgICAgIH0gLy8gUGVyZm9ybXMgdGhlIGxlbmd0aCBvZiBlZGl0IGl0ZXJhdGlvbi4gSXMgYSBiaXQgZnVnbHkgYXMgdGhpcyBoYXMgdG8gc3VwcG9ydCB0aGVcbiAgICAgIC8vIHN5bmMgYW5kIGFzeW5jIG1vZGUgd2hpY2ggaXMgbmV2ZXIgZnVuLiBMb29wcyBvdmVyIGV4ZWNFZGl0TGVuZ3RoIHVudGlsIGEgdmFsdWVcbiAgICAgIC8vIGlzIHByb2R1Y2VkLlxuXG5cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAoZnVuY3Rpb24gZXhlYygpIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgc2hvdWxkIG5vdCBoYXBwZW4sIGJ1dCB3ZSB3YW50IHRvIGJlIHNhZmUuXG5cbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgICAgICBpZiAoZWRpdExlbmd0aCA+IG1heEVkaXRMZW5ndGgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghZXhlY0VkaXRMZW5ndGgoKSkge1xuICAgICAgICAgICAgICBleGVjKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgMCk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aGlsZSAoZWRpdExlbmd0aCA8PSBtYXhFZGl0TGVuZ3RoKSB7XG4gICAgICAgICAgdmFyIHJldCA9IGV4ZWNFZGl0TGVuZ3RoKCk7XG5cbiAgICAgICAgICBpZiAocmV0KSB7XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgcHVzaENvbXBvbmVudDogZnVuY3Rpb24gcHVzaENvbXBvbmVudChjb21wb25lbnRzLCBhZGRlZCwgcmVtb3ZlZCkge1xuICAgICAgdmFyIGxhc3QgPSBjb21wb25lbnRzW2NvbXBvbmVudHMubGVuZ3RoIC0gMV07XG5cbiAgICAgIGlmIChsYXN0ICYmIGxhc3QuYWRkZWQgPT09IGFkZGVkICYmIGxhc3QucmVtb3ZlZCA9PT0gcmVtb3ZlZCkge1xuICAgICAgICAvLyBXZSBuZWVkIHRvIGNsb25lIGhlcmUgYXMgdGhlIGNvbXBvbmVudCBjbG9uZSBvcGVyYXRpb24gaXMganVzdFxuICAgICAgICAvLyBhcyBzaGFsbG93IGFycmF5IGNsb25lXG4gICAgICAgIGNvbXBvbmVudHNbY29tcG9uZW50cy5sZW5ndGggLSAxXSA9IHtcbiAgICAgICAgICBjb3VudDogbGFzdC5jb3VudCArIDEsXG4gICAgICAgICAgYWRkZWQ6IGFkZGVkLFxuICAgICAgICAgIHJlbW92ZWQ6IHJlbW92ZWRcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbXBvbmVudHMucHVzaCh7XG4gICAgICAgICAgY291bnQ6IDEsXG4gICAgICAgICAgYWRkZWQ6IGFkZGVkLFxuICAgICAgICAgIHJlbW92ZWQ6IHJlbW92ZWRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBleHRyYWN0Q29tbW9uOiBmdW5jdGlvbiBleHRyYWN0Q29tbW9uKGJhc2VQYXRoLCBuZXdTdHJpbmcsIG9sZFN0cmluZywgZGlhZ29uYWxQYXRoKSB7XG4gICAgICB2YXIgbmV3TGVuID0gbmV3U3RyaW5nLmxlbmd0aCxcbiAgICAgICAgICBvbGRMZW4gPSBvbGRTdHJpbmcubGVuZ3RoLFxuICAgICAgICAgIG5ld1BvcyA9IGJhc2VQYXRoLm5ld1BvcyxcbiAgICAgICAgICBvbGRQb3MgPSBuZXdQb3MgLSBkaWFnb25hbFBhdGgsXG4gICAgICAgICAgY29tbW9uQ291bnQgPSAwO1xuXG4gICAgICB3aGlsZSAobmV3UG9zICsgMSA8IG5ld0xlbiAmJiBvbGRQb3MgKyAxIDwgb2xkTGVuICYmIHRoaXMuZXF1YWxzKG5ld1N0cmluZ1tuZXdQb3MgKyAxXSwgb2xkU3RyaW5nW29sZFBvcyArIDFdKSkge1xuICAgICAgICBuZXdQb3MrKztcbiAgICAgICAgb2xkUG9zKys7XG4gICAgICAgIGNvbW1vbkNvdW50Kys7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb21tb25Db3VudCkge1xuICAgICAgICBiYXNlUGF0aC5jb21wb25lbnRzLnB1c2goe1xuICAgICAgICAgIGNvdW50OiBjb21tb25Db3VudFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgYmFzZVBhdGgubmV3UG9zID0gbmV3UG9zO1xuICAgICAgcmV0dXJuIG9sZFBvcztcbiAgICB9LFxuICAgIGVxdWFsczogZnVuY3Rpb24gZXF1YWxzKGxlZnQsIHJpZ2h0KSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNvbXBhcmF0b3IpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5jb21wYXJhdG9yKGxlZnQsIHJpZ2h0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBsZWZ0ID09PSByaWdodCB8fCB0aGlzLm9wdGlvbnMuaWdub3JlQ2FzZSAmJiBsZWZ0LnRvTG93ZXJDYXNlKCkgPT09IHJpZ2h0LnRvTG93ZXJDYXNlKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICByZW1vdmVFbXB0eTogZnVuY3Rpb24gcmVtb3ZlRW1wdHkoYXJyYXkpIHtcbiAgICAgIHZhciByZXQgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYXJyYXlbaV0pIHtcbiAgICAgICAgICByZXQucHVzaChhcnJheVtpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuICAgIGNhc3RJbnB1dDogZnVuY3Rpb24gY2FzdElucHV0KHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSxcbiAgICB0b2tlbml6ZTogZnVuY3Rpb24gdG9rZW5pemUodmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZS5zcGxpdCgnJyk7XG4gICAgfSxcbiAgICBqb2luOiBmdW5jdGlvbiBqb2luKGNoYXJzKSB7XG4gICAgICByZXR1cm4gY2hhcnMuam9pbignJyk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGJ1aWxkVmFsdWVzKGRpZmYsIGNvbXBvbmVudHMsIG5ld1N0cmluZywgb2xkU3RyaW5nLCB1c2VMb25nZXN0VG9rZW4pIHtcbiAgICB2YXIgY29tcG9uZW50UG9zID0gMCxcbiAgICAgICAgY29tcG9uZW50TGVuID0gY29tcG9uZW50cy5sZW5ndGgsXG4gICAgICAgIG5ld1BvcyA9IDAsXG4gICAgICAgIG9sZFBvcyA9IDA7XG5cbiAgICBmb3IgKDsgY29tcG9uZW50UG9zIDwgY29tcG9uZW50TGVuOyBjb21wb25lbnRQb3MrKykge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGNvbXBvbmVudHNbY29tcG9uZW50UG9zXTtcblxuICAgICAgaWYgKCFjb21wb25lbnQucmVtb3ZlZCkge1xuICAgICAgICBpZiAoIWNvbXBvbmVudC5hZGRlZCAmJiB1c2VMb25nZXN0VG9rZW4pIHtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBuZXdTdHJpbmcuc2xpY2UobmV3UG9zLCBuZXdQb3MgKyBjb21wb25lbnQuY291bnQpO1xuICAgICAgICAgIHZhbHVlID0gdmFsdWUubWFwKGZ1bmN0aW9uICh2YWx1ZSwgaSkge1xuICAgICAgICAgICAgdmFyIG9sZFZhbHVlID0gb2xkU3RyaW5nW29sZFBvcyArIGldO1xuICAgICAgICAgICAgcmV0dXJuIG9sZFZhbHVlLmxlbmd0aCA+IHZhbHVlLmxlbmd0aCA/IG9sZFZhbHVlIDogdmFsdWU7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29tcG9uZW50LnZhbHVlID0gZGlmZi5qb2luKHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb21wb25lbnQudmFsdWUgPSBkaWZmLmpvaW4obmV3U3RyaW5nLnNsaWNlKG5ld1BvcywgbmV3UG9zICsgY29tcG9uZW50LmNvdW50KSk7XG4gICAgICAgIH1cblxuICAgICAgICBuZXdQb3MgKz0gY29tcG9uZW50LmNvdW50OyAvLyBDb21tb24gY2FzZVxuXG4gICAgICAgIGlmICghY29tcG9uZW50LmFkZGVkKSB7XG4gICAgICAgICAgb2xkUG9zICs9IGNvbXBvbmVudC5jb3VudDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29tcG9uZW50LnZhbHVlID0gZGlmZi5qb2luKG9sZFN0cmluZy5zbGljZShvbGRQb3MsIG9sZFBvcyArIGNvbXBvbmVudC5jb3VudCkpO1xuICAgICAgICBvbGRQb3MgKz0gY29tcG9uZW50LmNvdW50OyAvLyBSZXZlcnNlIGFkZCBhbmQgcmVtb3ZlIHNvIHJlbW92ZXMgYXJlIG91dHB1dCBmaXJzdCB0byBtYXRjaCBjb21tb24gY29udmVudGlvblxuICAgICAgICAvLyBUaGUgZGlmZmluZyBhbGdvcml0aG0gaXMgdGllZCB0byBhZGQgdGhlbiByZW1vdmUgb3V0cHV0IGFuZCB0aGlzIGlzIHRoZSBzaW1wbGVzdFxuICAgICAgICAvLyByb3V0ZSB0byBnZXQgdGhlIGRlc2lyZWQgb3V0cHV0IHdpdGggbWluaW1hbCBvdmVyaGVhZC5cblxuICAgICAgICBpZiAoY29tcG9uZW50UG9zICYmIGNvbXBvbmVudHNbY29tcG9uZW50UG9zIC0gMV0uYWRkZWQpIHtcbiAgICAgICAgICB2YXIgdG1wID0gY29tcG9uZW50c1tjb21wb25lbnRQb3MgLSAxXTtcbiAgICAgICAgICBjb21wb25lbnRzW2NvbXBvbmVudFBvcyAtIDFdID0gY29tcG9uZW50c1tjb21wb25lbnRQb3NdO1xuICAgICAgICAgIGNvbXBvbmVudHNbY29tcG9uZW50UG9zXSA9IHRtcDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gLy8gU3BlY2lhbCBjYXNlIGhhbmRsZSBmb3Igd2hlbiBvbmUgdGVybWluYWwgaXMgaWdub3JlZCAoaS5lLiB3aGl0ZXNwYWNlKS5cbiAgICAvLyBGb3IgdGhpcyBjYXNlIHdlIG1lcmdlIHRoZSB0ZXJtaW5hbCBpbnRvIHRoZSBwcmlvciBzdHJpbmcgYW5kIGRyb3AgdGhlIGNoYW5nZS5cbiAgICAvLyBUaGlzIGlzIG9ubHkgYXZhaWxhYmxlIGZvciBzdHJpbmcgbW9kZS5cblxuXG4gICAgdmFyIGxhc3RDb21wb25lbnQgPSBjb21wb25lbnRzW2NvbXBvbmVudExlbiAtIDFdO1xuXG4gICAgaWYgKGNvbXBvbmVudExlbiA+IDEgJiYgdHlwZW9mIGxhc3RDb21wb25lbnQudmFsdWUgPT09ICdzdHJpbmcnICYmIChsYXN0Q29tcG9uZW50LmFkZGVkIHx8IGxhc3RDb21wb25lbnQucmVtb3ZlZCkgJiYgZGlmZi5lcXVhbHMoJycsIGxhc3RDb21wb25lbnQudmFsdWUpKSB7XG4gICAgICBjb21wb25lbnRzW2NvbXBvbmVudExlbiAtIDJdLnZhbHVlICs9IGxhc3RDb21wb25lbnQudmFsdWU7XG4gICAgICBjb21wb25lbnRzLnBvcCgpO1xuICAgIH1cblxuICAgIHJldHVybiBjb21wb25lbnRzO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvbmVQYXRoKHBhdGgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmV3UG9zOiBwYXRoLm5ld1BvcyxcbiAgICAgIGNvbXBvbmVudHM6IHBhdGguY29tcG9uZW50cy5zbGljZSgwKVxuICAgIH07XG4gIH1cblxuICB2YXIgY2hhcmFjdGVyRGlmZiA9IG5ldyBEaWZmKCk7XG4gIGZ1bmN0aW9uIGRpZmZDaGFycyhvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucykge1xuICAgIHJldHVybiBjaGFyYWN0ZXJEaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVPcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRzKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBkZWZhdWx0cy5jYWxsYmFjayA9IG9wdGlvbnM7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zKSB7XG4gICAgICBmb3IgKHZhciBuYW1lIGluIG9wdGlvbnMpIHtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgaWYgKG9wdGlvbnMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgICBkZWZhdWx0c1tuYW1lXSA9IG9wdGlvbnNbbmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVmYXVsdHM7XG4gIH1cblxuICAvL1xuICAvLyBSYW5nZXMgYW5kIGV4Y2VwdGlvbnM6XG4gIC8vIExhdGluLTEgU3VwcGxlbWVudCwgMDA4MOKAkzAwRkZcbiAgLy8gIC0gVSswMEQ3ICDDlyBNdWx0aXBsaWNhdGlvbiBzaWduXG4gIC8vICAtIFUrMDBGNyAgw7cgRGl2aXNpb24gc2lnblxuICAvLyBMYXRpbiBFeHRlbmRlZC1BLCAwMTAw4oCTMDE3RlxuICAvLyBMYXRpbiBFeHRlbmRlZC1CLCAwMTgw4oCTMDI0RlxuICAvLyBJUEEgRXh0ZW5zaW9ucywgMDI1MOKAkzAyQUZcbiAgLy8gU3BhY2luZyBNb2RpZmllciBMZXR0ZXJzLCAwMkIw4oCTMDJGRlxuICAvLyAgLSBVKzAyQzcgIMuHICYjNzExOyAgQ2Fyb25cbiAgLy8gIC0gVSswMkQ4ICDLmCAmIzcyODsgIEJyZXZlXG4gIC8vICAtIFUrMDJEOSAgy5kgJiM3Mjk7ICBEb3QgQWJvdmVcbiAgLy8gIC0gVSswMkRBICDLmiAmIzczMDsgIFJpbmcgQWJvdmVcbiAgLy8gIC0gVSswMkRCICDLmyAmIzczMTsgIE9nb25la1xuICAvLyAgLSBVKzAyREMgIMucICYjNzMyOyAgU21hbGwgVGlsZGVcbiAgLy8gIC0gVSswMkREICDLnSAmIzczMzsgIERvdWJsZSBBY3V0ZSBBY2NlbnRcbiAgLy8gTGF0aW4gRXh0ZW5kZWQgQWRkaXRpb25hbCwgMUUwMOKAkzFFRkZcblxuICB2YXIgZXh0ZW5kZWRXb3JkQ2hhcnMgPSAvXltBLVphLXpcXHhDMC1cXHUwMkM2XFx1MDJDOC1cXHUwMkQ3XFx1MDJERS1cXHUwMkZGXFx1MUUwMC1cXHUxRUZGXSskLztcbiAgdmFyIHJlV2hpdGVzcGFjZSA9IC9cXFMvO1xuICB2YXIgd29yZERpZmYgPSBuZXcgRGlmZigpO1xuXG4gIHdvcmREaWZmLmVxdWFscyA9IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuaWdub3JlQ2FzZSkge1xuICAgICAgbGVmdCA9IGxlZnQudG9Mb3dlckNhc2UoKTtcbiAgICAgIHJpZ2h0ID0gcmlnaHQudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbGVmdCA9PT0gcmlnaHQgfHwgdGhpcy5vcHRpb25zLmlnbm9yZVdoaXRlc3BhY2UgJiYgIXJlV2hpdGVzcGFjZS50ZXN0KGxlZnQpICYmICFyZVdoaXRlc3BhY2UudGVzdChyaWdodCk7XG4gIH07XG5cbiAgd29yZERpZmYudG9rZW5pemUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB2YXIgdG9rZW5zID0gdmFsdWUuc3BsaXQoLyhcXHMrfFsoKVtcXF17fSdcIl18XFxiKS8pOyAvLyBKb2luIHRoZSBib3VuZGFyeSBzcGxpdHMgdGhhdCB3ZSBkbyBub3QgY29uc2lkZXIgdG8gYmUgYm91bmRhcmllcy4gVGhpcyBpcyBwcmltYXJpbHkgdGhlIGV4dGVuZGVkIExhdGluIGNoYXJhY3RlciBzZXQuXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgIC8vIElmIHdlIGhhdmUgYW4gZW1wdHkgc3RyaW5nIGluIHRoZSBuZXh0IGZpZWxkIGFuZCB3ZSBoYXZlIG9ubHkgd29yZCBjaGFycyBiZWZvcmUgYW5kIGFmdGVyLCBtZXJnZVxuICAgICAgaWYgKCF0b2tlbnNbaSArIDFdICYmIHRva2Vuc1tpICsgMl0gJiYgZXh0ZW5kZWRXb3JkQ2hhcnMudGVzdCh0b2tlbnNbaV0pICYmIGV4dGVuZGVkV29yZENoYXJzLnRlc3QodG9rZW5zW2kgKyAyXSkpIHtcbiAgICAgICAgdG9rZW5zW2ldICs9IHRva2Vuc1tpICsgMl07XG4gICAgICAgIHRva2Vucy5zcGxpY2UoaSArIDEsIDIpO1xuICAgICAgICBpLS07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRva2VucztcbiAgfTtcblxuICBmdW5jdGlvbiBkaWZmV29yZHMob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gZ2VuZXJhdGVPcHRpb25zKG9wdGlvbnMsIHtcbiAgICAgIGlnbm9yZVdoaXRlc3BhY2U6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gd29yZERpZmYuZGlmZihvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucyk7XG4gIH1cbiAgZnVuY3Rpb24gZGlmZldvcmRzV2l0aFNwYWNlKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHdvcmREaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpO1xuICB9XG5cbiAgdmFyIGxpbmVEaWZmID0gbmV3IERpZmYoKTtcblxuICBsaW5lRGlmZi50b2tlbml6ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciByZXRMaW5lcyA9IFtdLFxuICAgICAgICBsaW5lc0FuZE5ld2xpbmVzID0gdmFsdWUuc3BsaXQoLyhcXG58XFxyXFxuKS8pOyAvLyBJZ25vcmUgdGhlIGZpbmFsIGVtcHR5IHRva2VuIHRoYXQgb2NjdXJzIGlmIHRoZSBzdHJpbmcgZW5kcyB3aXRoIGEgbmV3IGxpbmVcblxuICAgIGlmICghbGluZXNBbmROZXdsaW5lc1tsaW5lc0FuZE5ld2xpbmVzLmxlbmd0aCAtIDFdKSB7XG4gICAgICBsaW5lc0FuZE5ld2xpbmVzLnBvcCgpO1xuICAgIH0gLy8gTWVyZ2UgdGhlIGNvbnRlbnQgYW5kIGxpbmUgc2VwYXJhdG9ycyBpbnRvIHNpbmdsZSB0b2tlbnNcblxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lc0FuZE5ld2xpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbGluZSA9IGxpbmVzQW5kTmV3bGluZXNbaV07XG5cbiAgICAgIGlmIChpICUgMiAmJiAhdGhpcy5vcHRpb25zLm5ld2xpbmVJc1Rva2VuKSB7XG4gICAgICAgIHJldExpbmVzW3JldExpbmVzLmxlbmd0aCAtIDFdICs9IGxpbmU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmlnbm9yZVdoaXRlc3BhY2UpIHtcbiAgICAgICAgICBsaW5lID0gbGluZS50cmltKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXRMaW5lcy5wdXNoKGxpbmUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXRMaW5lcztcbiAgfTtcblxuICBmdW5jdGlvbiBkaWZmTGluZXMob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGxpbmVEaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKTtcbiAgfVxuICBmdW5jdGlvbiBkaWZmVHJpbW1lZExpbmVzKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjaykge1xuICAgIHZhciBvcHRpb25zID0gZ2VuZXJhdGVPcHRpb25zKGNhbGxiYWNrLCB7XG4gICAgICBpZ25vcmVXaGl0ZXNwYWNlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIGxpbmVEaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpO1xuICB9XG5cbiAgdmFyIHNlbnRlbmNlRGlmZiA9IG5ldyBEaWZmKCk7XG5cbiAgc2VudGVuY2VEaWZmLnRva2VuaXplID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLnNwbGl0KC8oXFxTLis/Wy4hP10pKD89XFxzK3wkKS8pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGRpZmZTZW50ZW5jZXMob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHNlbnRlbmNlRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjayk7XG4gIH1cblxuICB2YXIgY3NzRGlmZiA9IG5ldyBEaWZmKCk7XG5cbiAgY3NzRGlmZi50b2tlbml6ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5zcGxpdCgvKFt7fTo7LF18XFxzKykvKTtcbiAgfTtcblxuICBmdW5jdGlvbiBkaWZmQ3NzKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBjc3NEaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gICAgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7XG4gICAgICBfdHlwZW9mID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gdHlwZW9mIG9iajtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIF90eXBlb2YgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gX3R5cGVvZihvYmopO1xuICB9XG5cbiAgZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikge1xuICAgIHJldHVybiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5KGFycikgfHwgX25vbkl0ZXJhYmxlU3ByZWFkKCk7XG4gIH1cblxuICBmdW5jdGlvbiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIGFycjJbaV0gPSBhcnJbaV07XG5cbiAgICAgIHJldHVybiBhcnIyO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikge1xuICAgIGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGl0ZXIpIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpdGVyKSA9PT0gXCJbb2JqZWN0IEFyZ3VtZW50c11cIikgcmV0dXJuIEFycmF5LmZyb20oaXRlcik7XG4gIH1cblxuICBmdW5jdGlvbiBfbm9uSXRlcmFibGVTcHJlYWQoKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBzcHJlYWQgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpO1xuICB9XG5cbiAgdmFyIG9iamVjdFByb3RvdHlwZVRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbiAgdmFyIGpzb25EaWZmID0gbmV3IERpZmYoKTsgLy8gRGlzY3JpbWluYXRlIGJldHdlZW4gdHdvIGxpbmVzIG9mIHByZXR0eS1wcmludGVkLCBzZXJpYWxpemVkIEpTT04gd2hlcmUgb25lIG9mIHRoZW0gaGFzIGFcbiAgLy8gZGFuZ2xpbmcgY29tbWEgYW5kIHRoZSBvdGhlciBkb2Vzbid0LiBUdXJucyBvdXQgaW5jbHVkaW5nIHRoZSBkYW5nbGluZyBjb21tYSB5aWVsZHMgdGhlIG5pY2VzdCBvdXRwdXQ6XG5cbiAganNvbkRpZmYudXNlTG9uZ2VzdFRva2VuID0gdHJ1ZTtcbiAganNvbkRpZmYudG9rZW5pemUgPSBsaW5lRGlmZi50b2tlbml6ZTtcblxuICBqc29uRGlmZi5jYXN0SW5wdXQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB2YXIgX3RoaXMkb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgdW5kZWZpbmVkUmVwbGFjZW1lbnQgPSBfdGhpcyRvcHRpb25zLnVuZGVmaW5lZFJlcGxhY2VtZW50LFxuICAgICAgICBfdGhpcyRvcHRpb25zJHN0cmluZ2kgPSBfdGhpcyRvcHRpb25zLnN0cmluZ2lmeVJlcGxhY2VyLFxuICAgICAgICBzdHJpbmdpZnlSZXBsYWNlciA9IF90aGlzJG9wdGlvbnMkc3RyaW5naSA9PT0gdm9pZCAwID8gZnVuY3Rpb24gKGssIHYpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdiA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWRSZXBsYWNlbWVudCA6IHY7XG4gICAgfSA6IF90aGlzJG9wdGlvbnMkc3RyaW5naTtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IHZhbHVlIDogSlNPTi5zdHJpbmdpZnkoY2Fub25pY2FsaXplKHZhbHVlLCBudWxsLCBudWxsLCBzdHJpbmdpZnlSZXBsYWNlciksIHN0cmluZ2lmeVJlcGxhY2VyLCAnICAnKTtcbiAgfTtcblxuICBqc29uRGlmZi5lcXVhbHMgPSBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHtcbiAgICByZXR1cm4gRGlmZi5wcm90b3R5cGUuZXF1YWxzLmNhbGwoanNvbkRpZmYsIGxlZnQucmVwbGFjZSgvLChbXFxyXFxuXSkvZywgJyQxJyksIHJpZ2h0LnJlcGxhY2UoLywoW1xcclxcbl0pL2csICckMScpKTtcbiAgfTtcblxuICBmdW5jdGlvbiBkaWZmSnNvbihvbGRPYmosIG5ld09iaiwgb3B0aW9ucykge1xuICAgIHJldHVybiBqc29uRGlmZi5kaWZmKG9sZE9iaiwgbmV3T2JqLCBvcHRpb25zKTtcbiAgfSAvLyBUaGlzIGZ1bmN0aW9uIGhhbmRsZXMgdGhlIHByZXNlbmNlIG9mIGNpcmN1bGFyIHJlZmVyZW5jZXMgYnkgYmFpbGluZyBvdXQgd2hlbiBlbmNvdW50ZXJpbmcgYW5cbiAgLy8gb2JqZWN0IHRoYXQgaXMgYWxyZWFkeSBvbiB0aGUgXCJzdGFja1wiIG9mIGl0ZW1zIGJlaW5nIHByb2Nlc3NlZC4gQWNjZXB0cyBhbiBvcHRpb25hbCByZXBsYWNlclxuXG4gIGZ1bmN0aW9uIGNhbm9uaWNhbGl6ZShvYmosIHN0YWNrLCByZXBsYWNlbWVudFN0YWNrLCByZXBsYWNlciwga2V5KSB7XG4gICAgc3RhY2sgPSBzdGFjayB8fCBbXTtcbiAgICByZXBsYWNlbWVudFN0YWNrID0gcmVwbGFjZW1lbnRTdGFjayB8fCBbXTtcblxuICAgIGlmIChyZXBsYWNlcikge1xuICAgICAgb2JqID0gcmVwbGFjZXIoa2V5LCBvYmopO1xuICAgIH1cblxuICAgIHZhciBpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IHN0YWNrLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAoc3RhY2tbaV0gPT09IG9iaikge1xuICAgICAgICByZXR1cm4gcmVwbGFjZW1lbnRTdGFja1tpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY2Fub25pY2FsaXplZE9iajtcblxuICAgIGlmICgnW29iamVjdCBBcnJheV0nID09PSBvYmplY3RQcm90b3R5cGVUb1N0cmluZy5jYWxsKG9iaikpIHtcbiAgICAgIHN0YWNrLnB1c2gob2JqKTtcbiAgICAgIGNhbm9uaWNhbGl6ZWRPYmogPSBuZXcgQXJyYXkob2JqLmxlbmd0aCk7XG4gICAgICByZXBsYWNlbWVudFN0YWNrLnB1c2goY2Fub25pY2FsaXplZE9iaik7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBvYmoubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY2Fub25pY2FsaXplZE9ialtpXSA9IGNhbm9uaWNhbGl6ZShvYmpbaV0sIHN0YWNrLCByZXBsYWNlbWVudFN0YWNrLCByZXBsYWNlciwga2V5KTtcbiAgICAgIH1cblxuICAgICAgc3RhY2sucG9wKCk7XG4gICAgICByZXBsYWNlbWVudFN0YWNrLnBvcCgpO1xuICAgICAgcmV0dXJuIGNhbm9uaWNhbGl6ZWRPYmo7XG4gICAgfVxuXG4gICAgaWYgKG9iaiAmJiBvYmoudG9KU09OKSB7XG4gICAgICBvYmogPSBvYmoudG9KU09OKCk7XG4gICAgfVxuXG4gICAgaWYgKF90eXBlb2Yob2JqKSA9PT0gJ29iamVjdCcgJiYgb2JqICE9PSBudWxsKSB7XG4gICAgICBzdGFjay5wdXNoKG9iaik7XG4gICAgICBjYW5vbmljYWxpemVkT2JqID0ge307XG4gICAgICByZXBsYWNlbWVudFN0YWNrLnB1c2goY2Fub25pY2FsaXplZE9iaik7XG5cbiAgICAgIHZhciBzb3J0ZWRLZXlzID0gW10sXG4gICAgICAgICAgX2tleTtcblxuICAgICAgZm9yIChfa2V5IGluIG9iaikge1xuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KF9rZXkpKSB7XG4gICAgICAgICAgc29ydGVkS2V5cy5wdXNoKF9rZXkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNvcnRlZEtleXMuc29ydCgpO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgc29ydGVkS2V5cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBfa2V5ID0gc29ydGVkS2V5c1tpXTtcbiAgICAgICAgY2Fub25pY2FsaXplZE9ialtfa2V5XSA9IGNhbm9uaWNhbGl6ZShvYmpbX2tleV0sIHN0YWNrLCByZXBsYWNlbWVudFN0YWNrLCByZXBsYWNlciwgX2tleSk7XG4gICAgICB9XG5cbiAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgcmVwbGFjZW1lbnRTdGFjay5wb3AoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2Fub25pY2FsaXplZE9iaiA9IG9iajtcbiAgICB9XG5cbiAgICByZXR1cm4gY2Fub25pY2FsaXplZE9iajtcbiAgfVxuXG4gIHZhciBhcnJheURpZmYgPSBuZXcgRGlmZigpO1xuXG4gIGFycmF5RGlmZi50b2tlbml6ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5zbGljZSgpO1xuICB9O1xuXG4gIGFycmF5RGlmZi5qb2luID0gYXJyYXlEaWZmLnJlbW92ZUVtcHR5ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGRpZmZBcnJheXMob2xkQXJyLCBuZXdBcnIsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGFycmF5RGlmZi5kaWZmKG9sZEFyciwgbmV3QXJyLCBjYWxsYmFjayk7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVBhdGNoKHVuaURpZmYpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gICAgdmFyIGRpZmZzdHIgPSB1bmlEaWZmLnNwbGl0KC9cXHJcXG58W1xcblxcdlxcZlxcclxceDg1XS8pLFxuICAgICAgICBkZWxpbWl0ZXJzID0gdW5pRGlmZi5tYXRjaCgvXFxyXFxufFtcXG5cXHZcXGZcXHJcXHg4NV0vZykgfHwgW10sXG4gICAgICAgIGxpc3QgPSBbXSxcbiAgICAgICAgaSA9IDA7XG5cbiAgICBmdW5jdGlvbiBwYXJzZUluZGV4KCkge1xuICAgICAgdmFyIGluZGV4ID0ge307XG4gICAgICBsaXN0LnB1c2goaW5kZXgpOyAvLyBQYXJzZSBkaWZmIG1ldGFkYXRhXG5cbiAgICAgIHdoaWxlIChpIDwgZGlmZnN0ci5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGxpbmUgPSBkaWZmc3RyW2ldOyAvLyBGaWxlIGhlYWRlciBmb3VuZCwgZW5kIHBhcnNpbmcgZGlmZiBtZXRhZGF0YVxuXG4gICAgICAgIGlmICgvXihcXC1cXC1cXC18XFwrXFwrXFwrfEBAKVxccy8udGVzdChsaW5lKSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9IC8vIERpZmYgaW5kZXhcblxuXG4gICAgICAgIHZhciBoZWFkZXIgPSAvXig/OkluZGV4OnxkaWZmKD86IC1yIFxcdyspKylcXHMrKC4rPylcXHMqJC8uZXhlYyhsaW5lKTtcblxuICAgICAgICBpZiAoaGVhZGVyKSB7XG4gICAgICAgICAgaW5kZXguaW5kZXggPSBoZWFkZXJbMV07XG4gICAgICAgIH1cblxuICAgICAgICBpKys7XG4gICAgICB9IC8vIFBhcnNlIGZpbGUgaGVhZGVycyBpZiB0aGV5IGFyZSBkZWZpbmVkLiBVbmlmaWVkIGRpZmYgcmVxdWlyZXMgdGhlbSwgYnV0XG4gICAgICAvLyB0aGVyZSdzIG5vIHRlY2huaWNhbCBpc3N1ZXMgdG8gaGF2ZSBhbiBpc29sYXRlZCBodW5rIHdpdGhvdXQgZmlsZSBoZWFkZXJcblxuXG4gICAgICBwYXJzZUZpbGVIZWFkZXIoaW5kZXgpO1xuICAgICAgcGFyc2VGaWxlSGVhZGVyKGluZGV4KTsgLy8gUGFyc2UgaHVua3NcblxuICAgICAgaW5kZXguaHVua3MgPSBbXTtcblxuICAgICAgd2hpbGUgKGkgPCBkaWZmc3RyLmxlbmd0aCkge1xuICAgICAgICB2YXIgX2xpbmUgPSBkaWZmc3RyW2ldO1xuXG4gICAgICAgIGlmICgvXihJbmRleDp8ZGlmZnxcXC1cXC1cXC18XFwrXFwrXFwrKVxccy8udGVzdChfbGluZSkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIGlmICgvXkBALy50ZXN0KF9saW5lKSkge1xuICAgICAgICAgIGluZGV4Lmh1bmtzLnB1c2gocGFyc2VIdW5rKCkpO1xuICAgICAgICB9IGVsc2UgaWYgKF9saW5lICYmIG9wdGlvbnMuc3RyaWN0KSB7XG4gICAgICAgICAgLy8gSWdub3JlIHVuZXhwZWN0ZWQgY29udGVudCB1bmxlc3MgaW4gc3RyaWN0IG1vZGVcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gbGluZSAnICsgKGkgKyAxKSArICcgJyArIEpTT04uc3RyaW5naWZ5KF9saW5lKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSAvLyBQYXJzZXMgdGhlIC0tLSBhbmQgKysrIGhlYWRlcnMsIGlmIG5vbmUgYXJlIGZvdW5kLCBubyBsaW5lc1xuICAgIC8vIGFyZSBjb25zdW1lZC5cblxuXG4gICAgZnVuY3Rpb24gcGFyc2VGaWxlSGVhZGVyKGluZGV4KSB7XG4gICAgICB2YXIgZmlsZUhlYWRlciA9IC9eKC0tLXxcXCtcXCtcXCspXFxzKyguKikkLy5leGVjKGRpZmZzdHJbaV0pO1xuXG4gICAgICBpZiAoZmlsZUhlYWRlcikge1xuICAgICAgICB2YXIga2V5UHJlZml4ID0gZmlsZUhlYWRlclsxXSA9PT0gJy0tLScgPyAnb2xkJyA6ICduZXcnO1xuICAgICAgICB2YXIgZGF0YSA9IGZpbGVIZWFkZXJbMl0uc3BsaXQoJ1xcdCcsIDIpO1xuICAgICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhWzBdLnJlcGxhY2UoL1xcXFxcXFxcL2csICdcXFxcJyk7XG5cbiAgICAgICAgaWYgKC9eXCIuKlwiJC8udGVzdChmaWxlTmFtZSkpIHtcbiAgICAgICAgICBmaWxlTmFtZSA9IGZpbGVOYW1lLnN1YnN0cigxLCBmaWxlTmFtZS5sZW5ndGggLSAyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluZGV4W2tleVByZWZpeCArICdGaWxlTmFtZSddID0gZmlsZU5hbWU7XG4gICAgICAgIGluZGV4W2tleVByZWZpeCArICdIZWFkZXInXSA9IChkYXRhWzFdIHx8ICcnKS50cmltKCk7XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICB9IC8vIFBhcnNlcyBhIGh1bmtcbiAgICAvLyBUaGlzIGFzc3VtZXMgdGhhdCB3ZSBhcmUgYXQgdGhlIHN0YXJ0IG9mIGEgaHVuay5cblxuXG4gICAgZnVuY3Rpb24gcGFyc2VIdW5rKCkge1xuICAgICAgdmFyIGNodW5rSGVhZGVySW5kZXggPSBpLFxuICAgICAgICAgIGNodW5rSGVhZGVyTGluZSA9IGRpZmZzdHJbaSsrXSxcbiAgICAgICAgICBjaHVua0hlYWRlciA9IGNodW5rSGVhZGVyTGluZS5zcGxpdCgvQEAgLShcXGQrKSg/OiwoXFxkKykpPyBcXCsoXFxkKykoPzosKFxcZCspKT8gQEAvKTtcbiAgICAgIHZhciBodW5rID0ge1xuICAgICAgICBvbGRTdGFydDogK2NodW5rSGVhZGVyWzFdLFxuICAgICAgICBvbGRMaW5lczogK2NodW5rSGVhZGVyWzJdIHx8IDEsXG4gICAgICAgIG5ld1N0YXJ0OiArY2h1bmtIZWFkZXJbM10sXG4gICAgICAgIG5ld0xpbmVzOiArY2h1bmtIZWFkZXJbNF0gfHwgMSxcbiAgICAgICAgbGluZXM6IFtdLFxuICAgICAgICBsaW5lZGVsaW1pdGVyczogW11cbiAgICAgIH07XG4gICAgICB2YXIgYWRkQ291bnQgPSAwLFxuICAgICAgICAgIHJlbW92ZUNvdW50ID0gMDtcblxuICAgICAgZm9yICg7IGkgPCBkaWZmc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIExpbmVzIHN0YXJ0aW5nIHdpdGggJy0tLScgY291bGQgYmUgbWlzdGFrZW4gZm9yIHRoZSBcInJlbW92ZSBsaW5lXCIgb3BlcmF0aW9uXG4gICAgICAgIC8vIEJ1dCB0aGV5IGNvdWxkIGJlIHRoZSBoZWFkZXIgZm9yIHRoZSBuZXh0IGZpbGUuIFRoZXJlZm9yZSBwcnVuZSBzdWNoIGNhc2VzIG91dC5cbiAgICAgICAgaWYgKGRpZmZzdHJbaV0uaW5kZXhPZignLS0tICcpID09PSAwICYmIGkgKyAyIDwgZGlmZnN0ci5sZW5ndGggJiYgZGlmZnN0cltpICsgMV0uaW5kZXhPZignKysrICcpID09PSAwICYmIGRpZmZzdHJbaSArIDJdLmluZGV4T2YoJ0BAJykgPT09IDApIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvcGVyYXRpb24gPSBkaWZmc3RyW2ldLmxlbmd0aCA9PSAwICYmIGkgIT0gZGlmZnN0ci5sZW5ndGggLSAxID8gJyAnIDogZGlmZnN0cltpXVswXTtcblxuICAgICAgICBpZiAob3BlcmF0aW9uID09PSAnKycgfHwgb3BlcmF0aW9uID09PSAnLScgfHwgb3BlcmF0aW9uID09PSAnICcgfHwgb3BlcmF0aW9uID09PSAnXFxcXCcpIHtcbiAgICAgICAgICBodW5rLmxpbmVzLnB1c2goZGlmZnN0cltpXSk7XG4gICAgICAgICAgaHVuay5saW5lZGVsaW1pdGVycy5wdXNoKGRlbGltaXRlcnNbaV0gfHwgJ1xcbicpO1xuXG4gICAgICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gJysnKSB7XG4gICAgICAgICAgICBhZGRDb3VudCsrO1xuICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSAnLScpIHtcbiAgICAgICAgICAgIHJlbW92ZUNvdW50Kys7XG4gICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09ICcgJykge1xuICAgICAgICAgICAgYWRkQ291bnQrKztcbiAgICAgICAgICAgIHJlbW92ZUNvdW50Kys7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9IC8vIEhhbmRsZSB0aGUgZW1wdHkgYmxvY2sgY291bnQgY2FzZVxuXG5cbiAgICAgIGlmICghYWRkQ291bnQgJiYgaHVuay5uZXdMaW5lcyA9PT0gMSkge1xuICAgICAgICBodW5rLm5ld0xpbmVzID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKCFyZW1vdmVDb3VudCAmJiBodW5rLm9sZExpbmVzID09PSAxKSB7XG4gICAgICAgIGh1bmsub2xkTGluZXMgPSAwO1xuICAgICAgfSAvLyBQZXJmb3JtIG9wdGlvbmFsIHNhbml0eSBjaGVja2luZ1xuXG5cbiAgICAgIGlmIChvcHRpb25zLnN0cmljdCkge1xuICAgICAgICBpZiAoYWRkQ291bnQgIT09IGh1bmsubmV3TGluZXMpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FkZGVkIGxpbmUgY291bnQgZGlkIG5vdCBtYXRjaCBmb3IgaHVuayBhdCBsaW5lICcgKyAoY2h1bmtIZWFkZXJJbmRleCArIDEpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZW1vdmVDb3VudCAhPT0gaHVuay5vbGRMaW5lcykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUmVtb3ZlZCBsaW5lIGNvdW50IGRpZCBub3QgbWF0Y2ggZm9yIGh1bmsgYXQgbGluZSAnICsgKGNodW5rSGVhZGVySW5kZXggKyAxKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGh1bms7XG4gICAgfVxuXG4gICAgd2hpbGUgKGkgPCBkaWZmc3RyLmxlbmd0aCkge1xuICAgICAgcGFyc2VJbmRleCgpO1xuICAgIH1cblxuICAgIHJldHVybiBsaXN0O1xuICB9XG5cbiAgLy8gSXRlcmF0b3IgdGhhdCB0cmF2ZXJzZXMgaW4gdGhlIHJhbmdlIG9mIFttaW4sIG1heF0sIHN0ZXBwaW5nXG4gIC8vIGJ5IGRpc3RhbmNlIGZyb20gYSBnaXZlbiBzdGFydCBwb3NpdGlvbi4gSS5lLiBmb3IgWzAsIDRdLCB3aXRoXG4gIC8vIHN0YXJ0IG9mIDIsIHRoaXMgd2lsbCBpdGVyYXRlIDIsIDMsIDEsIDQsIDAuXG4gIGZ1bmN0aW9uIGRpc3RhbmNlSXRlcmF0b3IgKHN0YXJ0LCBtaW5MaW5lLCBtYXhMaW5lKSB7XG4gICAgdmFyIHdhbnRGb3J3YXJkID0gdHJ1ZSxcbiAgICAgICAgYmFja3dhcmRFeGhhdXN0ZWQgPSBmYWxzZSxcbiAgICAgICAgZm9yd2FyZEV4aGF1c3RlZCA9IGZhbHNlLFxuICAgICAgICBsb2NhbE9mZnNldCA9IDE7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGl0ZXJhdG9yKCkge1xuICAgICAgaWYgKHdhbnRGb3J3YXJkICYmICFmb3J3YXJkRXhoYXVzdGVkKSB7XG4gICAgICAgIGlmIChiYWNrd2FyZEV4aGF1c3RlZCkge1xuICAgICAgICAgIGxvY2FsT2Zmc2V0Kys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd2FudEZvcndhcmQgPSBmYWxzZTtcbiAgICAgICAgfSAvLyBDaGVjayBpZiB0cnlpbmcgdG8gZml0IGJleW9uZCB0ZXh0IGxlbmd0aCwgYW5kIGlmIG5vdCwgY2hlY2sgaXQgZml0c1xuICAgICAgICAvLyBhZnRlciBvZmZzZXQgbG9jYXRpb24gKG9yIGRlc2lyZWQgbG9jYXRpb24gb24gZmlyc3QgaXRlcmF0aW9uKVxuXG5cbiAgICAgICAgaWYgKHN0YXJ0ICsgbG9jYWxPZmZzZXQgPD0gbWF4TGluZSkge1xuICAgICAgICAgIHJldHVybiBsb2NhbE9mZnNldDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcndhcmRFeGhhdXN0ZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWJhY2t3YXJkRXhoYXVzdGVkKSB7XG4gICAgICAgIGlmICghZm9yd2FyZEV4aGF1c3RlZCkge1xuICAgICAgICAgIHdhbnRGb3J3YXJkID0gdHJ1ZTtcbiAgICAgICAgfSAvLyBDaGVjayBpZiB0cnlpbmcgdG8gZml0IGJlZm9yZSB0ZXh0IGJlZ2lubmluZywgYW5kIGlmIG5vdCwgY2hlY2sgaXQgZml0c1xuICAgICAgICAvLyBiZWZvcmUgb2Zmc2V0IGxvY2F0aW9uXG5cblxuICAgICAgICBpZiAobWluTGluZSA8PSBzdGFydCAtIGxvY2FsT2Zmc2V0KSB7XG4gICAgICAgICAgcmV0dXJuIC1sb2NhbE9mZnNldCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgYmFja3dhcmRFeGhhdXN0ZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gaXRlcmF0b3IoKTtcbiAgICAgIH0gLy8gV2UgdHJpZWQgdG8gZml0IGh1bmsgYmVmb3JlIHRleHQgYmVnaW5uaW5nIGFuZCBiZXlvbmQgdGV4dCBsZW5ndGgsIHRoZW5cbiAgICAgIC8vIGh1bmsgY2FuJ3QgZml0IG9uIHRoZSB0ZXh0LiBSZXR1cm4gdW5kZWZpbmVkXG5cbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gYXBwbHlQYXRjaChzb3VyY2UsIHVuaURpZmYpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge307XG5cbiAgICBpZiAodHlwZW9mIHVuaURpZmYgPT09ICdzdHJpbmcnKSB7XG4gICAgICB1bmlEaWZmID0gcGFyc2VQYXRjaCh1bmlEaWZmKTtcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh1bmlEaWZmKSkge1xuICAgICAgaWYgKHVuaURpZmYubGVuZ3RoID4gMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FwcGx5UGF0Y2ggb25seSB3b3JrcyB3aXRoIGEgc2luZ2xlIGlucHV0LicpO1xuICAgICAgfVxuXG4gICAgICB1bmlEaWZmID0gdW5pRGlmZlswXTtcbiAgICB9IC8vIEFwcGx5IHRoZSBkaWZmIHRvIHRoZSBpbnB1dFxuXG5cbiAgICB2YXIgbGluZXMgPSBzb3VyY2Uuc3BsaXQoL1xcclxcbnxbXFxuXFx2XFxmXFxyXFx4ODVdLyksXG4gICAgICAgIGRlbGltaXRlcnMgPSBzb3VyY2UubWF0Y2goL1xcclxcbnxbXFxuXFx2XFxmXFxyXFx4ODVdL2cpIHx8IFtdLFxuICAgICAgICBodW5rcyA9IHVuaURpZmYuaHVua3MsXG4gICAgICAgIGNvbXBhcmVMaW5lID0gb3B0aW9ucy5jb21wYXJlTGluZSB8fCBmdW5jdGlvbiAobGluZU51bWJlciwgbGluZSwgb3BlcmF0aW9uLCBwYXRjaENvbnRlbnQpIHtcbiAgICAgIHJldHVybiBsaW5lID09PSBwYXRjaENvbnRlbnQ7XG4gICAgfSxcbiAgICAgICAgZXJyb3JDb3VudCA9IDAsXG4gICAgICAgIGZ1enpGYWN0b3IgPSBvcHRpb25zLmZ1enpGYWN0b3IgfHwgMCxcbiAgICAgICAgbWluTGluZSA9IDAsXG4gICAgICAgIG9mZnNldCA9IDAsXG4gICAgICAgIHJlbW92ZUVPRk5MLFxuICAgICAgICBhZGRFT0ZOTDtcbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIGh1bmsgZXhhY3RseSBmaXRzIG9uIHRoZSBwcm92aWRlZCBsb2NhdGlvblxuICAgICAqL1xuXG5cbiAgICBmdW5jdGlvbiBodW5rRml0cyhodW5rLCB0b1Bvcykge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBodW5rLmxpbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHZhciBsaW5lID0gaHVuay5saW5lc1tqXSxcbiAgICAgICAgICAgIG9wZXJhdGlvbiA9IGxpbmUubGVuZ3RoID4gMCA/IGxpbmVbMF0gOiAnICcsXG4gICAgICAgICAgICBjb250ZW50ID0gbGluZS5sZW5ndGggPiAwID8gbGluZS5zdWJzdHIoMSkgOiBsaW5lO1xuXG4gICAgICAgIGlmIChvcGVyYXRpb24gPT09ICcgJyB8fCBvcGVyYXRpb24gPT09ICctJykge1xuICAgICAgICAgIC8vIENvbnRleHQgc2FuaXR5IGNoZWNrXG4gICAgICAgICAgaWYgKCFjb21wYXJlTGluZSh0b1BvcyArIDEsIGxpbmVzW3RvUG9zXSwgb3BlcmF0aW9uLCBjb250ZW50KSkge1xuICAgICAgICAgICAgZXJyb3JDb3VudCsrO1xuXG4gICAgICAgICAgICBpZiAoZXJyb3JDb3VudCA+IGZ1enpGYWN0b3IpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRvUG9zKys7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSAvLyBTZWFyY2ggYmVzdCBmaXQgb2Zmc2V0cyBmb3IgZWFjaCBodW5rIGJhc2VkIG9uIHRoZSBwcmV2aW91cyBvbmVzXG5cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaHVua3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBodW5rID0gaHVua3NbaV0sXG4gICAgICAgICAgbWF4TGluZSA9IGxpbmVzLmxlbmd0aCAtIGh1bmsub2xkTGluZXMsXG4gICAgICAgICAgbG9jYWxPZmZzZXQgPSAwLFxuICAgICAgICAgIHRvUG9zID0gb2Zmc2V0ICsgaHVuay5vbGRTdGFydCAtIDE7XG4gICAgICB2YXIgaXRlcmF0b3IgPSBkaXN0YW5jZUl0ZXJhdG9yKHRvUG9zLCBtaW5MaW5lLCBtYXhMaW5lKTtcblxuICAgICAgZm9yICg7IGxvY2FsT2Zmc2V0ICE9PSB1bmRlZmluZWQ7IGxvY2FsT2Zmc2V0ID0gaXRlcmF0b3IoKSkge1xuICAgICAgICBpZiAoaHVua0ZpdHMoaHVuaywgdG9Qb3MgKyBsb2NhbE9mZnNldCkpIHtcbiAgICAgICAgICBodW5rLm9mZnNldCA9IG9mZnNldCArPSBsb2NhbE9mZnNldDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobG9jYWxPZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IC8vIFNldCBsb3dlciB0ZXh0IGxpbWl0IHRvIGVuZCBvZiB0aGUgY3VycmVudCBodW5rLCBzbyBuZXh0IG9uZXMgZG9uJ3QgdHJ5XG4gICAgICAvLyB0byBmaXQgb3ZlciBhbHJlYWR5IHBhdGNoZWQgdGV4dFxuXG5cbiAgICAgIG1pbkxpbmUgPSBodW5rLm9mZnNldCArIGh1bmsub2xkU3RhcnQgKyBodW5rLm9sZExpbmVzO1xuICAgIH0gLy8gQXBwbHkgcGF0Y2ggaHVua3NcblxuXG4gICAgdmFyIGRpZmZPZmZzZXQgPSAwO1xuXG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGh1bmtzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9odW5rID0gaHVua3NbX2ldLFxuICAgICAgICAgIF90b1BvcyA9IF9odW5rLm9sZFN0YXJ0ICsgX2h1bmsub2Zmc2V0ICsgZGlmZk9mZnNldCAtIDE7XG5cbiAgICAgIGRpZmZPZmZzZXQgKz0gX2h1bmsubmV3TGluZXMgLSBfaHVuay5vbGRMaW5lcztcblxuICAgICAgaWYgKF90b1BvcyA8IDApIHtcbiAgICAgICAgLy8gQ3JlYXRpbmcgYSBuZXcgZmlsZVxuICAgICAgICBfdG9Qb3MgPSAwO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IF9odW5rLmxpbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHZhciBsaW5lID0gX2h1bmsubGluZXNbal0sXG4gICAgICAgICAgICBvcGVyYXRpb24gPSBsaW5lLmxlbmd0aCA+IDAgPyBsaW5lWzBdIDogJyAnLFxuICAgICAgICAgICAgY29udGVudCA9IGxpbmUubGVuZ3RoID4gMCA/IGxpbmUuc3Vic3RyKDEpIDogbGluZSxcbiAgICAgICAgICAgIGRlbGltaXRlciA9IF9odW5rLmxpbmVkZWxpbWl0ZXJzW2pdO1xuXG4gICAgICAgIGlmIChvcGVyYXRpb24gPT09ICcgJykge1xuICAgICAgICAgIF90b1BvcysrO1xuICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gJy0nKSB7XG4gICAgICAgICAgbGluZXMuc3BsaWNlKF90b1BvcywgMSk7XG4gICAgICAgICAgZGVsaW1pdGVycy5zcGxpY2UoX3RvUG9zLCAxKTtcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gJysnKSB7XG4gICAgICAgICAgbGluZXMuc3BsaWNlKF90b1BvcywgMCwgY29udGVudCk7XG4gICAgICAgICAgZGVsaW1pdGVycy5zcGxpY2UoX3RvUG9zLCAwLCBkZWxpbWl0ZXIpO1xuICAgICAgICAgIF90b1BvcysrO1xuICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gJ1xcXFwnKSB7XG4gICAgICAgICAgdmFyIHByZXZpb3VzT3BlcmF0aW9uID0gX2h1bmsubGluZXNbaiAtIDFdID8gX2h1bmsubGluZXNbaiAtIDFdWzBdIDogbnVsbDtcblxuICAgICAgICAgIGlmIChwcmV2aW91c09wZXJhdGlvbiA9PT0gJysnKSB7XG4gICAgICAgICAgICByZW1vdmVFT0ZOTCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIGlmIChwcmV2aW91c09wZXJhdGlvbiA9PT0gJy0nKSB7XG4gICAgICAgICAgICBhZGRFT0ZOTCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSAvLyBIYW5kbGUgRU9GTkwgaW5zZXJ0aW9uL3JlbW92YWxcblxuXG4gICAgaWYgKHJlbW92ZUVPRk5MKSB7XG4gICAgICB3aGlsZSAoIWxpbmVzW2xpbmVzLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgIGxpbmVzLnBvcCgpO1xuICAgICAgICBkZWxpbWl0ZXJzLnBvcCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYWRkRU9GTkwpIHtcbiAgICAgIGxpbmVzLnB1c2goJycpO1xuICAgICAgZGVsaW1pdGVycy5wdXNoKCdcXG4nKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbGluZXMubGVuZ3RoIC0gMTsgX2srKykge1xuICAgICAgbGluZXNbX2tdID0gbGluZXNbX2tdICsgZGVsaW1pdGVyc1tfa107XG4gICAgfVxuXG4gICAgcmV0dXJuIGxpbmVzLmpvaW4oJycpO1xuICB9IC8vIFdyYXBwZXIgdGhhdCBzdXBwb3J0cyBtdWx0aXBsZSBmaWxlIHBhdGNoZXMgdmlhIGNhbGxiYWNrcy5cblxuICBmdW5jdGlvbiBhcHBseVBhdGNoZXModW5pRGlmZiwgb3B0aW9ucykge1xuICAgIGlmICh0eXBlb2YgdW5pRGlmZiA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHVuaURpZmYgPSBwYXJzZVBhdGNoKHVuaURpZmYpO1xuICAgIH1cblxuICAgIHZhciBjdXJyZW50SW5kZXggPSAwO1xuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc0luZGV4KCkge1xuICAgICAgdmFyIGluZGV4ID0gdW5pRGlmZltjdXJyZW50SW5kZXgrK107XG5cbiAgICAgIGlmICghaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMuY29tcGxldGUoKTtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucy5sb2FkRmlsZShpbmRleCwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIG9wdGlvbnMuY29tcGxldGUoZXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB1cGRhdGVkQ29udGVudCA9IGFwcGx5UGF0Y2goZGF0YSwgaW5kZXgsIG9wdGlvbnMpO1xuICAgICAgICBvcHRpb25zLnBhdGNoZWQoaW5kZXgsIHVwZGF0ZWRDb250ZW50LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMuY29tcGxldGUoZXJyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBwcm9jZXNzSW5kZXgoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwcm9jZXNzSW5kZXgoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0cnVjdHVyZWRQYXRjaChvbGRGaWxlTmFtZSwgbmV3RmlsZU5hbWUsIG9sZFN0ciwgbmV3U3RyLCBvbGRIZWFkZXIsIG5ld0hlYWRlciwgb3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5jb250ZXh0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgb3B0aW9ucy5jb250ZXh0ID0gNDtcbiAgICB9XG5cbiAgICB2YXIgZGlmZiA9IGRpZmZMaW5lcyhvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucyk7XG4gICAgZGlmZi5wdXNoKHtcbiAgICAgIHZhbHVlOiAnJyxcbiAgICAgIGxpbmVzOiBbXVxuICAgIH0pOyAvLyBBcHBlbmQgYW4gZW1wdHkgdmFsdWUgdG8gbWFrZSBjbGVhbnVwIGVhc2llclxuXG4gICAgZnVuY3Rpb24gY29udGV4dExpbmVzKGxpbmVzKSB7XG4gICAgICByZXR1cm4gbGluZXMubWFwKGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICByZXR1cm4gJyAnICsgZW50cnk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgaHVua3MgPSBbXTtcbiAgICB2YXIgb2xkUmFuZ2VTdGFydCA9IDAsXG4gICAgICAgIG5ld1JhbmdlU3RhcnQgPSAwLFxuICAgICAgICBjdXJSYW5nZSA9IFtdLFxuICAgICAgICBvbGRMaW5lID0gMSxcbiAgICAgICAgbmV3TGluZSA9IDE7XG5cbiAgICB2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcChpKSB7XG4gICAgICB2YXIgY3VycmVudCA9IGRpZmZbaV0sXG4gICAgICAgICAgbGluZXMgPSBjdXJyZW50LmxpbmVzIHx8IGN1cnJlbnQudmFsdWUucmVwbGFjZSgvXFxuJC8sICcnKS5zcGxpdCgnXFxuJyk7XG4gICAgICBjdXJyZW50LmxpbmVzID0gbGluZXM7XG5cbiAgICAgIGlmIChjdXJyZW50LmFkZGVkIHx8IGN1cnJlbnQucmVtb3ZlZCkge1xuICAgICAgICB2YXIgX2N1clJhbmdlO1xuXG4gICAgICAgIC8vIElmIHdlIGhhdmUgcHJldmlvdXMgY29udGV4dCwgc3RhcnQgd2l0aCB0aGF0XG4gICAgICAgIGlmICghb2xkUmFuZ2VTdGFydCkge1xuICAgICAgICAgIHZhciBwcmV2ID0gZGlmZltpIC0gMV07XG4gICAgICAgICAgb2xkUmFuZ2VTdGFydCA9IG9sZExpbmU7XG4gICAgICAgICAgbmV3UmFuZ2VTdGFydCA9IG5ld0xpbmU7XG5cbiAgICAgICAgICBpZiAocHJldikge1xuICAgICAgICAgICAgY3VyUmFuZ2UgPSBvcHRpb25zLmNvbnRleHQgPiAwID8gY29udGV4dExpbmVzKHByZXYubGluZXMuc2xpY2UoLW9wdGlvbnMuY29udGV4dCkpIDogW107XG4gICAgICAgICAgICBvbGRSYW5nZVN0YXJ0IC09IGN1clJhbmdlLmxlbmd0aDtcbiAgICAgICAgICAgIG5ld1JhbmdlU3RhcnQgLT0gY3VyUmFuZ2UubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgfSAvLyBPdXRwdXQgb3VyIGNoYW5nZXNcblxuXG4gICAgICAgIChfY3VyUmFuZ2UgPSBjdXJSYW5nZSkucHVzaC5hcHBseShfY3VyUmFuZ2UsIF90b0NvbnN1bWFibGVBcnJheShsaW5lcy5tYXAoZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICAgICAgcmV0dXJuIChjdXJyZW50LmFkZGVkID8gJysnIDogJy0nKSArIGVudHJ5O1xuICAgICAgICB9KSkpOyAvLyBUcmFjayB0aGUgdXBkYXRlZCBmaWxlIHBvc2l0aW9uXG5cblxuICAgICAgICBpZiAoY3VycmVudC5hZGRlZCkge1xuICAgICAgICAgIG5ld0xpbmUgKz0gbGluZXMubGVuZ3RoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9sZExpbmUgKz0gbGluZXMubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBJZGVudGljYWwgY29udGV4dCBsaW5lcy4gVHJhY2sgbGluZSBjaGFuZ2VzXG4gICAgICAgIGlmIChvbGRSYW5nZVN0YXJ0KSB7XG4gICAgICAgICAgLy8gQ2xvc2Ugb3V0IGFueSBjaGFuZ2VzIHRoYXQgaGF2ZSBiZWVuIG91dHB1dCAob3Igam9pbiBvdmVybGFwcGluZylcbiAgICAgICAgICBpZiAobGluZXMubGVuZ3RoIDw9IG9wdGlvbnMuY29udGV4dCAqIDIgJiYgaSA8IGRpZmYubGVuZ3RoIC0gMikge1xuICAgICAgICAgICAgdmFyIF9jdXJSYW5nZTI7XG5cbiAgICAgICAgICAgIC8vIE92ZXJsYXBwaW5nXG4gICAgICAgICAgICAoX2N1clJhbmdlMiA9IGN1clJhbmdlKS5wdXNoLmFwcGx5KF9jdXJSYW5nZTIsIF90b0NvbnN1bWFibGVBcnJheShjb250ZXh0TGluZXMobGluZXMpKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBfY3VyUmFuZ2UzO1xuXG4gICAgICAgICAgICAvLyBlbmQgdGhlIHJhbmdlIGFuZCBvdXRwdXRcbiAgICAgICAgICAgIHZhciBjb250ZXh0U2l6ZSA9IE1hdGgubWluKGxpbmVzLmxlbmd0aCwgb3B0aW9ucy5jb250ZXh0KTtcblxuICAgICAgICAgICAgKF9jdXJSYW5nZTMgPSBjdXJSYW5nZSkucHVzaC5hcHBseShfY3VyUmFuZ2UzLCBfdG9Db25zdW1hYmxlQXJyYXkoY29udGV4dExpbmVzKGxpbmVzLnNsaWNlKDAsIGNvbnRleHRTaXplKSkpKTtcblxuICAgICAgICAgICAgdmFyIGh1bmsgPSB7XG4gICAgICAgICAgICAgIG9sZFN0YXJ0OiBvbGRSYW5nZVN0YXJ0LFxuICAgICAgICAgICAgICBvbGRMaW5lczogb2xkTGluZSAtIG9sZFJhbmdlU3RhcnQgKyBjb250ZXh0U2l6ZSxcbiAgICAgICAgICAgICAgbmV3U3RhcnQ6IG5ld1JhbmdlU3RhcnQsXG4gICAgICAgICAgICAgIG5ld0xpbmVzOiBuZXdMaW5lIC0gbmV3UmFuZ2VTdGFydCArIGNvbnRleHRTaXplLFxuICAgICAgICAgICAgICBsaW5lczogY3VyUmFuZ2VcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChpID49IGRpZmYubGVuZ3RoIC0gMiAmJiBsaW5lcy5sZW5ndGggPD0gb3B0aW9ucy5jb250ZXh0KSB7XG4gICAgICAgICAgICAgIC8vIEVPRiBpcyBpbnNpZGUgdGhpcyBodW5rXG4gICAgICAgICAgICAgIHZhciBvbGRFT0ZOZXdsaW5lID0gL1xcbiQvLnRlc3Qob2xkU3RyKTtcbiAgICAgICAgICAgICAgdmFyIG5ld0VPRk5ld2xpbmUgPSAvXFxuJC8udGVzdChuZXdTdHIpO1xuICAgICAgICAgICAgICB2YXIgbm9ObEJlZm9yZUFkZHMgPSBsaW5lcy5sZW5ndGggPT0gMCAmJiBjdXJSYW5nZS5sZW5ndGggPiBodW5rLm9sZExpbmVzO1xuXG4gICAgICAgICAgICAgIGlmICghb2xkRU9GTmV3bGluZSAmJiBub05sQmVmb3JlQWRkcykge1xuICAgICAgICAgICAgICAgIC8vIHNwZWNpYWwgY2FzZTogb2xkIGhhcyBubyBlb2wgYW5kIG5vIHRyYWlsaW5nIGNvbnRleHQ7IG5vLW5sIGNhbiBlbmQgdXAgYmVmb3JlIGFkZHNcbiAgICAgICAgICAgICAgICBjdXJSYW5nZS5zcGxpY2UoaHVuay5vbGRMaW5lcywgMCwgJ1xcXFwgTm8gbmV3bGluZSBhdCBlbmQgb2YgZmlsZScpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKCFvbGRFT0ZOZXdsaW5lICYmICFub05sQmVmb3JlQWRkcyB8fCAhbmV3RU9GTmV3bGluZSkge1xuICAgICAgICAgICAgICAgIGN1clJhbmdlLnB1c2goJ1xcXFwgTm8gbmV3bGluZSBhdCBlbmQgb2YgZmlsZScpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGh1bmtzLnB1c2goaHVuayk7XG4gICAgICAgICAgICBvbGRSYW5nZVN0YXJ0ID0gMDtcbiAgICAgICAgICAgIG5ld1JhbmdlU3RhcnQgPSAwO1xuICAgICAgICAgICAgY3VyUmFuZ2UgPSBbXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBvbGRMaW5lICs9IGxpbmVzLmxlbmd0aDtcbiAgICAgICAgbmV3TGluZSArPSBsaW5lcy5sZW5ndGg7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGlmZi5sZW5ndGg7IGkrKykge1xuICAgICAgX2xvb3AoaSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIG9sZEZpbGVOYW1lOiBvbGRGaWxlTmFtZSxcbiAgICAgIG5ld0ZpbGVOYW1lOiBuZXdGaWxlTmFtZSxcbiAgICAgIG9sZEhlYWRlcjogb2xkSGVhZGVyLFxuICAgICAgbmV3SGVhZGVyOiBuZXdIZWFkZXIsXG4gICAgICBodW5rczogaHVua3NcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIGNyZWF0ZVR3b0ZpbGVzUGF0Y2gob2xkRmlsZU5hbWUsIG5ld0ZpbGVOYW1lLCBvbGRTdHIsIG5ld1N0ciwgb2xkSGVhZGVyLCBuZXdIZWFkZXIsIG9wdGlvbnMpIHtcbiAgICB2YXIgZGlmZiA9IHN0cnVjdHVyZWRQYXRjaChvbGRGaWxlTmFtZSwgbmV3RmlsZU5hbWUsIG9sZFN0ciwgbmV3U3RyLCBvbGRIZWFkZXIsIG5ld0hlYWRlciwgb3B0aW9ucyk7XG4gICAgdmFyIHJldCA9IFtdO1xuXG4gICAgaWYgKG9sZEZpbGVOYW1lID09IG5ld0ZpbGVOYW1lKSB7XG4gICAgICByZXQucHVzaCgnSW5kZXg6ICcgKyBvbGRGaWxlTmFtZSk7XG4gICAgfVxuXG4gICAgcmV0LnB1c2goJz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0nKTtcbiAgICByZXQucHVzaCgnLS0tICcgKyBkaWZmLm9sZEZpbGVOYW1lICsgKHR5cGVvZiBkaWZmLm9sZEhlYWRlciA9PT0gJ3VuZGVmaW5lZCcgPyAnJyA6ICdcXHQnICsgZGlmZi5vbGRIZWFkZXIpKTtcbiAgICByZXQucHVzaCgnKysrICcgKyBkaWZmLm5ld0ZpbGVOYW1lICsgKHR5cGVvZiBkaWZmLm5ld0hlYWRlciA9PT0gJ3VuZGVmaW5lZCcgPyAnJyA6ICdcXHQnICsgZGlmZi5uZXdIZWFkZXIpKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGlmZi5odW5rcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGh1bmsgPSBkaWZmLmh1bmtzW2ldO1xuICAgICAgcmV0LnB1c2goJ0BAIC0nICsgaHVuay5vbGRTdGFydCArICcsJyArIGh1bmsub2xkTGluZXMgKyAnICsnICsgaHVuay5uZXdTdGFydCArICcsJyArIGh1bmsubmV3TGluZXMgKyAnIEBAJyk7XG4gICAgICByZXQucHVzaC5hcHBseShyZXQsIGh1bmsubGluZXMpO1xuICAgIH1cblxuICAgIHJldHVybiByZXQuam9pbignXFxuJykgKyAnXFxuJztcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGVQYXRjaChmaWxlTmFtZSwgb2xkU3RyLCBuZXdTdHIsIG9sZEhlYWRlciwgbmV3SGVhZGVyLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIGNyZWF0ZVR3b0ZpbGVzUGF0Y2goZmlsZU5hbWUsIGZpbGVOYW1lLCBvbGRTdHIsIG5ld1N0ciwgb2xkSGVhZGVyLCBuZXdIZWFkZXIsIG9wdGlvbnMpO1xuICB9XG5cbiAgZnVuY3Rpb24gYXJyYXlFcXVhbChhLCBiKSB7XG4gICAgaWYgKGEubGVuZ3RoICE9PSBiLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheVN0YXJ0c1dpdGgoYSwgYik7XG4gIH1cbiAgZnVuY3Rpb24gYXJyYXlTdGFydHNXaXRoKGFycmF5LCBzdGFydCkge1xuICAgIGlmIChzdGFydC5sZW5ndGggPiBhcnJheS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXJ0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoc3RhcnRbaV0gIT09IGFycmF5W2ldKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbGNMaW5lQ291bnQoaHVuaykge1xuICAgIHZhciBfY2FsY09sZE5ld0xpbmVDb3VudCA9IGNhbGNPbGROZXdMaW5lQ291bnQoaHVuay5saW5lcyksXG4gICAgICAgIG9sZExpbmVzID0gX2NhbGNPbGROZXdMaW5lQ291bnQub2xkTGluZXMsXG4gICAgICAgIG5ld0xpbmVzID0gX2NhbGNPbGROZXdMaW5lQ291bnQubmV3TGluZXM7XG5cbiAgICBpZiAob2xkTGluZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaHVuay5vbGRMaW5lcyA9IG9sZExpbmVzO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgaHVuay5vbGRMaW5lcztcbiAgICB9XG5cbiAgICBpZiAobmV3TGluZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaHVuay5uZXdMaW5lcyA9IG5ld0xpbmVzO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgaHVuay5uZXdMaW5lcztcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gbWVyZ2UobWluZSwgdGhlaXJzLCBiYXNlKSB7XG4gICAgbWluZSA9IGxvYWRQYXRjaChtaW5lLCBiYXNlKTtcbiAgICB0aGVpcnMgPSBsb2FkUGF0Y2godGhlaXJzLCBiYXNlKTtcbiAgICB2YXIgcmV0ID0ge307IC8vIEZvciBpbmRleCB3ZSBqdXN0IGxldCBpdCBwYXNzIHRocm91Z2ggYXMgaXQgZG9lc24ndCBoYXZlIGFueSBuZWNlc3NhcnkgbWVhbmluZy5cbiAgICAvLyBMZWF2aW5nIHNhbml0eSBjaGVja3Mgb24gdGhpcyB0byB0aGUgQVBJIGNvbnN1bWVyIHRoYXQgbWF5IGtub3cgbW9yZSBhYm91dCB0aGVcbiAgICAvLyBtZWFuaW5nIGluIHRoZWlyIG93biBjb250ZXh0LlxuXG4gICAgaWYgKG1pbmUuaW5kZXggfHwgdGhlaXJzLmluZGV4KSB7XG4gICAgICByZXQuaW5kZXggPSBtaW5lLmluZGV4IHx8IHRoZWlycy5pbmRleDtcbiAgICB9XG5cbiAgICBpZiAobWluZS5uZXdGaWxlTmFtZSB8fCB0aGVpcnMubmV3RmlsZU5hbWUpIHtcbiAgICAgIGlmICghZmlsZU5hbWVDaGFuZ2VkKG1pbmUpKSB7XG4gICAgICAgIC8vIE5vIGhlYWRlciBvciBubyBjaGFuZ2UgaW4gb3VycywgdXNlIHRoZWlycyAoYW5kIG91cnMgaWYgdGhlaXJzIGRvZXMgbm90IGV4aXN0KVxuICAgICAgICByZXQub2xkRmlsZU5hbWUgPSB0aGVpcnMub2xkRmlsZU5hbWUgfHwgbWluZS5vbGRGaWxlTmFtZTtcbiAgICAgICAgcmV0Lm5ld0ZpbGVOYW1lID0gdGhlaXJzLm5ld0ZpbGVOYW1lIHx8IG1pbmUubmV3RmlsZU5hbWU7XG4gICAgICAgIHJldC5vbGRIZWFkZXIgPSB0aGVpcnMub2xkSGVhZGVyIHx8IG1pbmUub2xkSGVhZGVyO1xuICAgICAgICByZXQubmV3SGVhZGVyID0gdGhlaXJzLm5ld0hlYWRlciB8fCBtaW5lLm5ld0hlYWRlcjtcbiAgICAgIH0gZWxzZSBpZiAoIWZpbGVOYW1lQ2hhbmdlZCh0aGVpcnMpKSB7XG4gICAgICAgIC8vIE5vIGhlYWRlciBvciBubyBjaGFuZ2UgaW4gdGhlaXJzLCB1c2Ugb3Vyc1xuICAgICAgICByZXQub2xkRmlsZU5hbWUgPSBtaW5lLm9sZEZpbGVOYW1lO1xuICAgICAgICByZXQubmV3RmlsZU5hbWUgPSBtaW5lLm5ld0ZpbGVOYW1lO1xuICAgICAgICByZXQub2xkSGVhZGVyID0gbWluZS5vbGRIZWFkZXI7XG4gICAgICAgIHJldC5uZXdIZWFkZXIgPSBtaW5lLm5ld0hlYWRlcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEJvdGggY2hhbmdlZC4uLiBmaWd1cmUgaXQgb3V0XG4gICAgICAgIHJldC5vbGRGaWxlTmFtZSA9IHNlbGVjdEZpZWxkKHJldCwgbWluZS5vbGRGaWxlTmFtZSwgdGhlaXJzLm9sZEZpbGVOYW1lKTtcbiAgICAgICAgcmV0Lm5ld0ZpbGVOYW1lID0gc2VsZWN0RmllbGQocmV0LCBtaW5lLm5ld0ZpbGVOYW1lLCB0aGVpcnMubmV3RmlsZU5hbWUpO1xuICAgICAgICByZXQub2xkSGVhZGVyID0gc2VsZWN0RmllbGQocmV0LCBtaW5lLm9sZEhlYWRlciwgdGhlaXJzLm9sZEhlYWRlcik7XG4gICAgICAgIHJldC5uZXdIZWFkZXIgPSBzZWxlY3RGaWVsZChyZXQsIG1pbmUubmV3SGVhZGVyLCB0aGVpcnMubmV3SGVhZGVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXQuaHVua3MgPSBbXTtcbiAgICB2YXIgbWluZUluZGV4ID0gMCxcbiAgICAgICAgdGhlaXJzSW5kZXggPSAwLFxuICAgICAgICBtaW5lT2Zmc2V0ID0gMCxcbiAgICAgICAgdGhlaXJzT2Zmc2V0ID0gMDtcblxuICAgIHdoaWxlIChtaW5lSW5kZXggPCBtaW5lLmh1bmtzLmxlbmd0aCB8fCB0aGVpcnNJbmRleCA8IHRoZWlycy5odW5rcy5sZW5ndGgpIHtcbiAgICAgIHZhciBtaW5lQ3VycmVudCA9IG1pbmUuaHVua3NbbWluZUluZGV4XSB8fCB7XG4gICAgICAgIG9sZFN0YXJ0OiBJbmZpbml0eVxuICAgICAgfSxcbiAgICAgICAgICB0aGVpcnNDdXJyZW50ID0gdGhlaXJzLmh1bmtzW3RoZWlyc0luZGV4XSB8fCB7XG4gICAgICAgIG9sZFN0YXJ0OiBJbmZpbml0eVxuICAgICAgfTtcblxuICAgICAgaWYgKGh1bmtCZWZvcmUobWluZUN1cnJlbnQsIHRoZWlyc0N1cnJlbnQpKSB7XG4gICAgICAgIC8vIFRoaXMgcGF0Y2ggZG9lcyBub3Qgb3ZlcmxhcCB3aXRoIGFueSBvZiB0aGUgb3RoZXJzLCB5YXkuXG4gICAgICAgIHJldC5odW5rcy5wdXNoKGNsb25lSHVuayhtaW5lQ3VycmVudCwgbWluZU9mZnNldCkpO1xuICAgICAgICBtaW5lSW5kZXgrKztcbiAgICAgICAgdGhlaXJzT2Zmc2V0ICs9IG1pbmVDdXJyZW50Lm5ld0xpbmVzIC0gbWluZUN1cnJlbnQub2xkTGluZXM7XG4gICAgICB9IGVsc2UgaWYgKGh1bmtCZWZvcmUodGhlaXJzQ3VycmVudCwgbWluZUN1cnJlbnQpKSB7XG4gICAgICAgIC8vIFRoaXMgcGF0Y2ggZG9lcyBub3Qgb3ZlcmxhcCB3aXRoIGFueSBvZiB0aGUgb3RoZXJzLCB5YXkuXG4gICAgICAgIHJldC5odW5rcy5wdXNoKGNsb25lSHVuayh0aGVpcnNDdXJyZW50LCB0aGVpcnNPZmZzZXQpKTtcbiAgICAgICAgdGhlaXJzSW5kZXgrKztcbiAgICAgICAgbWluZU9mZnNldCArPSB0aGVpcnNDdXJyZW50Lm5ld0xpbmVzIC0gdGhlaXJzQ3VycmVudC5vbGRMaW5lcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE92ZXJsYXAsIG1lcmdlIGFzIGJlc3Qgd2UgY2FuXG4gICAgICAgIHZhciBtZXJnZWRIdW5rID0ge1xuICAgICAgICAgIG9sZFN0YXJ0OiBNYXRoLm1pbihtaW5lQ3VycmVudC5vbGRTdGFydCwgdGhlaXJzQ3VycmVudC5vbGRTdGFydCksXG4gICAgICAgICAgb2xkTGluZXM6IDAsXG4gICAgICAgICAgbmV3U3RhcnQ6IE1hdGgubWluKG1pbmVDdXJyZW50Lm5ld1N0YXJ0ICsgbWluZU9mZnNldCwgdGhlaXJzQ3VycmVudC5vbGRTdGFydCArIHRoZWlyc09mZnNldCksXG4gICAgICAgICAgbmV3TGluZXM6IDAsXG4gICAgICAgICAgbGluZXM6IFtdXG4gICAgICAgIH07XG4gICAgICAgIG1lcmdlTGluZXMobWVyZ2VkSHVuaywgbWluZUN1cnJlbnQub2xkU3RhcnQsIG1pbmVDdXJyZW50LmxpbmVzLCB0aGVpcnNDdXJyZW50Lm9sZFN0YXJ0LCB0aGVpcnNDdXJyZW50LmxpbmVzKTtcbiAgICAgICAgdGhlaXJzSW5kZXgrKztcbiAgICAgICAgbWluZUluZGV4Kys7XG4gICAgICAgIHJldC5odW5rcy5wdXNoKG1lcmdlZEh1bmspO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICBmdW5jdGlvbiBsb2FkUGF0Y2gocGFyYW0sIGJhc2UpIHtcbiAgICBpZiAodHlwZW9mIHBhcmFtID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKC9eQEAvbS50ZXN0KHBhcmFtKSB8fCAvXkluZGV4Oi9tLnRlc3QocGFyYW0pKSB7XG4gICAgICAgIHJldHVybiBwYXJzZVBhdGNoKHBhcmFtKVswXTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFiYXNlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTXVzdCBwcm92aWRlIGEgYmFzZSByZWZlcmVuY2Ugb3IgcGFzcyBpbiBhIHBhdGNoJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHJ1Y3R1cmVkUGF0Y2godW5kZWZpbmVkLCB1bmRlZmluZWQsIGJhc2UsIHBhcmFtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyYW07XG4gIH1cblxuICBmdW5jdGlvbiBmaWxlTmFtZUNoYW5nZWQocGF0Y2gpIHtcbiAgICByZXR1cm4gcGF0Y2gubmV3RmlsZU5hbWUgJiYgcGF0Y2gubmV3RmlsZU5hbWUgIT09IHBhdGNoLm9sZEZpbGVOYW1lO1xuICB9XG5cbiAgZnVuY3Rpb24gc2VsZWN0RmllbGQoaW5kZXgsIG1pbmUsIHRoZWlycykge1xuICAgIGlmIChtaW5lID09PSB0aGVpcnMpIHtcbiAgICAgIHJldHVybiBtaW5lO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbmRleC5jb25mbGljdCA9IHRydWU7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtaW5lOiBtaW5lLFxuICAgICAgICB0aGVpcnM6IHRoZWlyc1xuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBodW5rQmVmb3JlKHRlc3QsIGNoZWNrKSB7XG4gICAgcmV0dXJuIHRlc3Qub2xkU3RhcnQgPCBjaGVjay5vbGRTdGFydCAmJiB0ZXN0Lm9sZFN0YXJ0ICsgdGVzdC5vbGRMaW5lcyA8IGNoZWNrLm9sZFN0YXJ0O1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvbmVIdW5rKGh1bmssIG9mZnNldCkge1xuICAgIHJldHVybiB7XG4gICAgICBvbGRTdGFydDogaHVuay5vbGRTdGFydCxcbiAgICAgIG9sZExpbmVzOiBodW5rLm9sZExpbmVzLFxuICAgICAgbmV3U3RhcnQ6IGh1bmsubmV3U3RhcnQgKyBvZmZzZXQsXG4gICAgICBuZXdMaW5lczogaHVuay5uZXdMaW5lcyxcbiAgICAgIGxpbmVzOiBodW5rLmxpbmVzXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlTGluZXMoaHVuaywgbWluZU9mZnNldCwgbWluZUxpbmVzLCB0aGVpck9mZnNldCwgdGhlaXJMaW5lcykge1xuICAgIC8vIFRoaXMgd2lsbCBnZW5lcmFsbHkgcmVzdWx0IGluIGEgY29uZmxpY3RlZCBodW5rLCBidXQgdGhlcmUgYXJlIGNhc2VzIHdoZXJlIHRoZSBjb250ZXh0XG4gICAgLy8gaXMgdGhlIG9ubHkgb3ZlcmxhcCB3aGVyZSB3ZSBjYW4gc3VjY2Vzc2Z1bGx5IG1lcmdlIHRoZSBjb250ZW50IGhlcmUuXG4gICAgdmFyIG1pbmUgPSB7XG4gICAgICBvZmZzZXQ6IG1pbmVPZmZzZXQsXG4gICAgICBsaW5lczogbWluZUxpbmVzLFxuICAgICAgaW5kZXg6IDBcbiAgICB9LFxuICAgICAgICB0aGVpciA9IHtcbiAgICAgIG9mZnNldDogdGhlaXJPZmZzZXQsXG4gICAgICBsaW5lczogdGhlaXJMaW5lcyxcbiAgICAgIGluZGV4OiAwXG4gICAgfTsgLy8gSGFuZGxlIGFueSBsZWFkaW5nIGNvbnRlbnRcblxuICAgIGluc2VydExlYWRpbmcoaHVuaywgbWluZSwgdGhlaXIpO1xuICAgIGluc2VydExlYWRpbmcoaHVuaywgdGhlaXIsIG1pbmUpOyAvLyBOb3cgaW4gdGhlIG92ZXJsYXAgY29udGVudC4gU2NhbiB0aHJvdWdoIGFuZCBzZWxlY3QgdGhlIGJlc3QgY2hhbmdlcyBmcm9tIGVhY2guXG5cbiAgICB3aGlsZSAobWluZS5pbmRleCA8IG1pbmUubGluZXMubGVuZ3RoICYmIHRoZWlyLmluZGV4IDwgdGhlaXIubGluZXMubGVuZ3RoKSB7XG4gICAgICB2YXIgbWluZUN1cnJlbnQgPSBtaW5lLmxpbmVzW21pbmUuaW5kZXhdLFxuICAgICAgICAgIHRoZWlyQ3VycmVudCA9IHRoZWlyLmxpbmVzW3RoZWlyLmluZGV4XTtcblxuICAgICAgaWYgKChtaW5lQ3VycmVudFswXSA9PT0gJy0nIHx8IG1pbmVDdXJyZW50WzBdID09PSAnKycpICYmICh0aGVpckN1cnJlbnRbMF0gPT09ICctJyB8fCB0aGVpckN1cnJlbnRbMF0gPT09ICcrJykpIHtcbiAgICAgICAgLy8gQm90aCBtb2RpZmllZCAuLi5cbiAgICAgICAgbXV0dWFsQ2hhbmdlKGh1bmssIG1pbmUsIHRoZWlyKTtcbiAgICAgIH0gZWxzZSBpZiAobWluZUN1cnJlbnRbMF0gPT09ICcrJyAmJiB0aGVpckN1cnJlbnRbMF0gPT09ICcgJykge1xuICAgICAgICB2YXIgX2h1bmskbGluZXM7XG5cbiAgICAgICAgLy8gTWluZSBpbnNlcnRlZFxuICAgICAgICAoX2h1bmskbGluZXMgPSBodW5rLmxpbmVzKS5wdXNoLmFwcGx5KF9odW5rJGxpbmVzLCBfdG9Db25zdW1hYmxlQXJyYXkoY29sbGVjdENoYW5nZShtaW5lKSkpO1xuICAgICAgfSBlbHNlIGlmICh0aGVpckN1cnJlbnRbMF0gPT09ICcrJyAmJiBtaW5lQ3VycmVudFswXSA9PT0gJyAnKSB7XG4gICAgICAgIHZhciBfaHVuayRsaW5lczI7XG5cbiAgICAgICAgLy8gVGhlaXJzIGluc2VydGVkXG4gICAgICAgIChfaHVuayRsaW5lczIgPSBodW5rLmxpbmVzKS5wdXNoLmFwcGx5KF9odW5rJGxpbmVzMiwgX3RvQ29uc3VtYWJsZUFycmF5KGNvbGxlY3RDaGFuZ2UodGhlaXIpKSk7XG4gICAgICB9IGVsc2UgaWYgKG1pbmVDdXJyZW50WzBdID09PSAnLScgJiYgdGhlaXJDdXJyZW50WzBdID09PSAnICcpIHtcbiAgICAgICAgLy8gTWluZSByZW1vdmVkIG9yIGVkaXRlZFxuICAgICAgICByZW1vdmFsKGh1bmssIG1pbmUsIHRoZWlyKTtcbiAgICAgIH0gZWxzZSBpZiAodGhlaXJDdXJyZW50WzBdID09PSAnLScgJiYgbWluZUN1cnJlbnRbMF0gPT09ICcgJykge1xuICAgICAgICAvLyBUaGVpciByZW1vdmVkIG9yIGVkaXRlZFxuICAgICAgICByZW1vdmFsKGh1bmssIHRoZWlyLCBtaW5lLCB0cnVlKTtcbiAgICAgIH0gZWxzZSBpZiAobWluZUN1cnJlbnQgPT09IHRoZWlyQ3VycmVudCkge1xuICAgICAgICAvLyBDb250ZXh0IGlkZW50aXR5XG4gICAgICAgIGh1bmsubGluZXMucHVzaChtaW5lQ3VycmVudCk7XG4gICAgICAgIG1pbmUuaW5kZXgrKztcbiAgICAgICAgdGhlaXIuaW5kZXgrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIENvbnRleHQgbWlzbWF0Y2hcbiAgICAgICAgY29uZmxpY3QoaHVuaywgY29sbGVjdENoYW5nZShtaW5lKSwgY29sbGVjdENoYW5nZSh0aGVpcikpO1xuICAgICAgfVxuICAgIH0gLy8gTm93IHB1c2ggYW55dGhpbmcgdGhhdCBtYXkgYmUgcmVtYWluaW5nXG5cblxuICAgIGluc2VydFRyYWlsaW5nKGh1bmssIG1pbmUpO1xuICAgIGluc2VydFRyYWlsaW5nKGh1bmssIHRoZWlyKTtcbiAgICBjYWxjTGluZUNvdW50KGh1bmspO1xuICB9XG5cbiAgZnVuY3Rpb24gbXV0dWFsQ2hhbmdlKGh1bmssIG1pbmUsIHRoZWlyKSB7XG4gICAgdmFyIG15Q2hhbmdlcyA9IGNvbGxlY3RDaGFuZ2UobWluZSksXG4gICAgICAgIHRoZWlyQ2hhbmdlcyA9IGNvbGxlY3RDaGFuZ2UodGhlaXIpO1xuXG4gICAgaWYgKGFsbFJlbW92ZXMobXlDaGFuZ2VzKSAmJiBhbGxSZW1vdmVzKHRoZWlyQ2hhbmdlcykpIHtcbiAgICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgcmVtb3ZlIGNoYW5nZXMgdGhhdCBhcmUgc3VwZXJzZXRzIG9mIG9uZSBhbm90aGVyXG4gICAgICBpZiAoYXJyYXlTdGFydHNXaXRoKG15Q2hhbmdlcywgdGhlaXJDaGFuZ2VzKSAmJiBza2lwUmVtb3ZlU3VwZXJzZXQodGhlaXIsIG15Q2hhbmdlcywgbXlDaGFuZ2VzLmxlbmd0aCAtIHRoZWlyQ2hhbmdlcy5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBfaHVuayRsaW5lczM7XG5cbiAgICAgICAgKF9odW5rJGxpbmVzMyA9IGh1bmsubGluZXMpLnB1c2guYXBwbHkoX2h1bmskbGluZXMzLCBfdG9Db25zdW1hYmxlQXJyYXkobXlDaGFuZ2VzKSk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIGlmIChhcnJheVN0YXJ0c1dpdGgodGhlaXJDaGFuZ2VzLCBteUNoYW5nZXMpICYmIHNraXBSZW1vdmVTdXBlcnNldChtaW5lLCB0aGVpckNoYW5nZXMsIHRoZWlyQ2hhbmdlcy5sZW5ndGggLSBteUNoYW5nZXMubGVuZ3RoKSkge1xuICAgICAgICB2YXIgX2h1bmskbGluZXM0O1xuXG4gICAgICAgIChfaHVuayRsaW5lczQgPSBodW5rLmxpbmVzKS5wdXNoLmFwcGx5KF9odW5rJGxpbmVzNCwgX3RvQ29uc3VtYWJsZUFycmF5KHRoZWlyQ2hhbmdlcykpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFycmF5RXF1YWwobXlDaGFuZ2VzLCB0aGVpckNoYW5nZXMpKSB7XG4gICAgICB2YXIgX2h1bmskbGluZXM1O1xuXG4gICAgICAoX2h1bmskbGluZXM1ID0gaHVuay5saW5lcykucHVzaC5hcHBseShfaHVuayRsaW5lczUsIF90b0NvbnN1bWFibGVBcnJheShteUNoYW5nZXMpKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbmZsaWN0KGh1bmssIG15Q2hhbmdlcywgdGhlaXJDaGFuZ2VzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92YWwoaHVuaywgbWluZSwgdGhlaXIsIHN3YXApIHtcbiAgICB2YXIgbXlDaGFuZ2VzID0gY29sbGVjdENoYW5nZShtaW5lKSxcbiAgICAgICAgdGhlaXJDaGFuZ2VzID0gY29sbGVjdENvbnRleHQodGhlaXIsIG15Q2hhbmdlcyk7XG5cbiAgICBpZiAodGhlaXJDaGFuZ2VzLm1lcmdlZCkge1xuICAgICAgdmFyIF9odW5rJGxpbmVzNjtcblxuICAgICAgKF9odW5rJGxpbmVzNiA9IGh1bmsubGluZXMpLnB1c2guYXBwbHkoX2h1bmskbGluZXM2LCBfdG9Db25zdW1hYmxlQXJyYXkodGhlaXJDaGFuZ2VzLm1lcmdlZCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25mbGljdChodW5rLCBzd2FwID8gdGhlaXJDaGFuZ2VzIDogbXlDaGFuZ2VzLCBzd2FwID8gbXlDaGFuZ2VzIDogdGhlaXJDaGFuZ2VzKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjb25mbGljdChodW5rLCBtaW5lLCB0aGVpcikge1xuICAgIGh1bmsuY29uZmxpY3QgPSB0cnVlO1xuICAgIGh1bmsubGluZXMucHVzaCh7XG4gICAgICBjb25mbGljdDogdHJ1ZSxcbiAgICAgIG1pbmU6IG1pbmUsXG4gICAgICB0aGVpcnM6IHRoZWlyXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbnNlcnRMZWFkaW5nKGh1bmssIGluc2VydCwgdGhlaXIpIHtcbiAgICB3aGlsZSAoaW5zZXJ0Lm9mZnNldCA8IHRoZWlyLm9mZnNldCAmJiBpbnNlcnQuaW5kZXggPCBpbnNlcnQubGluZXMubGVuZ3RoKSB7XG4gICAgICB2YXIgbGluZSA9IGluc2VydC5saW5lc1tpbnNlcnQuaW5kZXgrK107XG4gICAgICBodW5rLmxpbmVzLnB1c2gobGluZSk7XG4gICAgICBpbnNlcnQub2Zmc2V0Kys7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5zZXJ0VHJhaWxpbmcoaHVuaywgaW5zZXJ0KSB7XG4gICAgd2hpbGUgKGluc2VydC5pbmRleCA8IGluc2VydC5saW5lcy5sZW5ndGgpIHtcbiAgICAgIHZhciBsaW5lID0gaW5zZXJ0LmxpbmVzW2luc2VydC5pbmRleCsrXTtcbiAgICAgIGh1bmsubGluZXMucHVzaChsaW5lKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjb2xsZWN0Q2hhbmdlKHN0YXRlKSB7XG4gICAgdmFyIHJldCA9IFtdLFxuICAgICAgICBvcGVyYXRpb24gPSBzdGF0ZS5saW5lc1tzdGF0ZS5pbmRleF1bMF07XG5cbiAgICB3aGlsZSAoc3RhdGUuaW5kZXggPCBzdGF0ZS5saW5lcy5sZW5ndGgpIHtcbiAgICAgIHZhciBsaW5lID0gc3RhdGUubGluZXNbc3RhdGUuaW5kZXhdOyAvLyBHcm91cCBhZGRpdGlvbnMgdGhhdCBhcmUgaW1tZWRpYXRlbHkgYWZ0ZXIgc3VidHJhY3Rpb25zIGFuZCB0cmVhdCB0aGVtIGFzIG9uZSBcImF0b21pY1wiIG1vZGlmeSBjaGFuZ2UuXG5cbiAgICAgIGlmIChvcGVyYXRpb24gPT09ICctJyAmJiBsaW5lWzBdID09PSAnKycpIHtcbiAgICAgICAgb3BlcmF0aW9uID0gJysnO1xuICAgICAgfVxuXG4gICAgICBpZiAob3BlcmF0aW9uID09PSBsaW5lWzBdKSB7XG4gICAgICAgIHJldC5wdXNoKGxpbmUpO1xuICAgICAgICBzdGF0ZS5pbmRleCsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbGxlY3RDb250ZXh0KHN0YXRlLCBtYXRjaENoYW5nZXMpIHtcbiAgICB2YXIgY2hhbmdlcyA9IFtdLFxuICAgICAgICBtZXJnZWQgPSBbXSxcbiAgICAgICAgbWF0Y2hJbmRleCA9IDAsXG4gICAgICAgIGNvbnRleHRDaGFuZ2VzID0gZmFsc2UsXG4gICAgICAgIGNvbmZsaWN0ZWQgPSBmYWxzZTtcblxuICAgIHdoaWxlIChtYXRjaEluZGV4IDwgbWF0Y2hDaGFuZ2VzLmxlbmd0aCAmJiBzdGF0ZS5pbmRleCA8IHN0YXRlLmxpbmVzLmxlbmd0aCkge1xuICAgICAgdmFyIGNoYW5nZSA9IHN0YXRlLmxpbmVzW3N0YXRlLmluZGV4XSxcbiAgICAgICAgICBtYXRjaCA9IG1hdGNoQ2hhbmdlc1ttYXRjaEluZGV4XTsgLy8gT25jZSB3ZSd2ZSBoaXQgb3VyIGFkZCwgdGhlbiB3ZSBhcmUgZG9uZVxuXG4gICAgICBpZiAobWF0Y2hbMF0gPT09ICcrJykge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY29udGV4dENoYW5nZXMgPSBjb250ZXh0Q2hhbmdlcyB8fCBjaGFuZ2VbMF0gIT09ICcgJztcbiAgICAgIG1lcmdlZC5wdXNoKG1hdGNoKTtcbiAgICAgIG1hdGNoSW5kZXgrKzsgLy8gQ29uc3VtZSBhbnkgYWRkaXRpb25zIGluIHRoZSBvdGhlciBibG9jayBhcyBhIGNvbmZsaWN0IHRvIGF0dGVtcHRcbiAgICAgIC8vIHRvIHB1bGwgaW4gdGhlIHJlbWFpbmluZyBjb250ZXh0IGFmdGVyIHRoaXNcblxuICAgICAgaWYgKGNoYW5nZVswXSA9PT0gJysnKSB7XG4gICAgICAgIGNvbmZsaWN0ZWQgPSB0cnVlO1xuXG4gICAgICAgIHdoaWxlIChjaGFuZ2VbMF0gPT09ICcrJykge1xuICAgICAgICAgIGNoYW5nZXMucHVzaChjaGFuZ2UpO1xuICAgICAgICAgIGNoYW5nZSA9IHN0YXRlLmxpbmVzWysrc3RhdGUuaW5kZXhdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChtYXRjaC5zdWJzdHIoMSkgPT09IGNoYW5nZS5zdWJzdHIoMSkpIHtcbiAgICAgICAgY2hhbmdlcy5wdXNoKGNoYW5nZSk7XG4gICAgICAgIHN0YXRlLmluZGV4Kys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25mbGljdGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoKG1hdGNoQ2hhbmdlc1ttYXRjaEluZGV4XSB8fCAnJylbMF0gPT09ICcrJyAmJiBjb250ZXh0Q2hhbmdlcykge1xuICAgICAgY29uZmxpY3RlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZsaWN0ZWQpIHtcbiAgICAgIHJldHVybiBjaGFuZ2VzO1xuICAgIH1cblxuICAgIHdoaWxlIChtYXRjaEluZGV4IDwgbWF0Y2hDaGFuZ2VzLmxlbmd0aCkge1xuICAgICAgbWVyZ2VkLnB1c2gobWF0Y2hDaGFuZ2VzW21hdGNoSW5kZXgrK10pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBtZXJnZWQ6IG1lcmdlZCxcbiAgICAgIGNoYW5nZXM6IGNoYW5nZXNcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gYWxsUmVtb3ZlcyhjaGFuZ2VzKSB7XG4gICAgcmV0dXJuIGNoYW5nZXMucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCBjaGFuZ2UpIHtcbiAgICAgIHJldHVybiBwcmV2ICYmIGNoYW5nZVswXSA9PT0gJy0nO1xuICAgIH0sIHRydWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2tpcFJlbW92ZVN1cGVyc2V0KHN0YXRlLCByZW1vdmVDaGFuZ2VzLCBkZWx0YSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVsdGE7IGkrKykge1xuICAgICAgdmFyIGNoYW5nZUNvbnRlbnQgPSByZW1vdmVDaGFuZ2VzW3JlbW92ZUNoYW5nZXMubGVuZ3RoIC0gZGVsdGEgKyBpXS5zdWJzdHIoMSk7XG5cbiAgICAgIGlmIChzdGF0ZS5saW5lc1tzdGF0ZS5pbmRleCArIGldICE9PSAnICcgKyBjaGFuZ2VDb250ZW50KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0ZS5pbmRleCArPSBkZWx0YTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbGNPbGROZXdMaW5lQ291bnQobGluZXMpIHtcbiAgICB2YXIgb2xkTGluZXMgPSAwO1xuICAgIHZhciBuZXdMaW5lcyA9IDA7XG4gICAgbGluZXMuZm9yRWFjaChmdW5jdGlvbiAobGluZSkge1xuICAgICAgaWYgKHR5cGVvZiBsaW5lICE9PSAnc3RyaW5nJykge1xuICAgICAgICB2YXIgbXlDb3VudCA9IGNhbGNPbGROZXdMaW5lQ291bnQobGluZS5taW5lKTtcbiAgICAgICAgdmFyIHRoZWlyQ291bnQgPSBjYWxjT2xkTmV3TGluZUNvdW50KGxpbmUudGhlaXJzKTtcblxuICAgICAgICBpZiAob2xkTGluZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChteUNvdW50Lm9sZExpbmVzID09PSB0aGVpckNvdW50Lm9sZExpbmVzKSB7XG4gICAgICAgICAgICBvbGRMaW5lcyArPSBteUNvdW50Lm9sZExpbmVzO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvbGRMaW5lcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV3TGluZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChteUNvdW50Lm5ld0xpbmVzID09PSB0aGVpckNvdW50Lm5ld0xpbmVzKSB7XG4gICAgICAgICAgICBuZXdMaW5lcyArPSBteUNvdW50Lm5ld0xpbmVzO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdMaW5lcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChuZXdMaW5lcyAhPT0gdW5kZWZpbmVkICYmIChsaW5lWzBdID09PSAnKycgfHwgbGluZVswXSA9PT0gJyAnKSkge1xuICAgICAgICAgIG5ld0xpbmVzKys7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob2xkTGluZXMgIT09IHVuZGVmaW5lZCAmJiAobGluZVswXSA9PT0gJy0nIHx8IGxpbmVbMF0gPT09ICcgJykpIHtcbiAgICAgICAgICBvbGRMaW5lcysrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9sZExpbmVzOiBvbGRMaW5lcyxcbiAgICAgIG5ld0xpbmVzOiBuZXdMaW5lc1xuICAgIH07XG4gIH1cblxuICAvLyBTZWU6IGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9nb29nbGUtZGlmZi1tYXRjaC1wYXRjaC93aWtpL0FQSVxuICBmdW5jdGlvbiBjb252ZXJ0Q2hhbmdlc1RvRE1QKGNoYW5nZXMpIHtcbiAgICB2YXIgcmV0ID0gW10sXG4gICAgICAgIGNoYW5nZSxcbiAgICAgICAgb3BlcmF0aW9uO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGFuZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGFuZ2UgPSBjaGFuZ2VzW2ldO1xuXG4gICAgICBpZiAoY2hhbmdlLmFkZGVkKSB7XG4gICAgICAgIG9wZXJhdGlvbiA9IDE7XG4gICAgICB9IGVsc2UgaWYgKGNoYW5nZS5yZW1vdmVkKSB7XG4gICAgICAgIG9wZXJhdGlvbiA9IC0xO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3BlcmF0aW9uID0gMDtcbiAgICAgIH1cblxuICAgICAgcmV0LnB1c2goW29wZXJhdGlvbiwgY2hhbmdlLnZhbHVlXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbnZlcnRDaGFuZ2VzVG9YTUwoY2hhbmdlcykge1xuICAgIHZhciByZXQgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNoYW5nZSA9IGNoYW5nZXNbaV07XG5cbiAgICAgIGlmIChjaGFuZ2UuYWRkZWQpIHtcbiAgICAgICAgcmV0LnB1c2goJzxpbnM+Jyk7XG4gICAgICB9IGVsc2UgaWYgKGNoYW5nZS5yZW1vdmVkKSB7XG4gICAgICAgIHJldC5wdXNoKCc8ZGVsPicpO1xuICAgICAgfVxuXG4gICAgICByZXQucHVzaChlc2NhcGVIVE1MKGNoYW5nZS52YWx1ZSkpO1xuXG4gICAgICBpZiAoY2hhbmdlLmFkZGVkKSB7XG4gICAgICAgIHJldC5wdXNoKCc8L2lucz4nKTtcbiAgICAgIH0gZWxzZSBpZiAoY2hhbmdlLnJlbW92ZWQpIHtcbiAgICAgICAgcmV0LnB1c2goJzwvZGVsPicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXQuam9pbignJyk7XG4gIH1cblxuICBmdW5jdGlvbiBlc2NhcGVIVE1MKHMpIHtcbiAgICB2YXIgbiA9IHM7XG4gICAgbiA9IG4ucmVwbGFjZSgvJi9nLCAnJmFtcDsnKTtcbiAgICBuID0gbi5yZXBsYWNlKC88L2csICcmbHQ7Jyk7XG4gICAgbiA9IG4ucmVwbGFjZSgvPi9nLCAnJmd0OycpO1xuICAgIG4gPSBuLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKTtcbiAgICByZXR1cm4gbjtcbiAgfVxuXG4gIC8qIFNlZSBMSUNFTlNFIGZpbGUgZm9yIHRlcm1zIG9mIHVzZSAqL1xuXG4gIGV4cG9ydHMuRGlmZiA9IERpZmY7XG4gIGV4cG9ydHMuZGlmZkNoYXJzID0gZGlmZkNoYXJzO1xuICBleHBvcnRzLmRpZmZXb3JkcyA9IGRpZmZXb3JkcztcbiAgZXhwb3J0cy5kaWZmV29yZHNXaXRoU3BhY2UgPSBkaWZmV29yZHNXaXRoU3BhY2U7XG4gIGV4cG9ydHMuZGlmZkxpbmVzID0gZGlmZkxpbmVzO1xuICBleHBvcnRzLmRpZmZUcmltbWVkTGluZXMgPSBkaWZmVHJpbW1lZExpbmVzO1xuICBleHBvcnRzLmRpZmZTZW50ZW5jZXMgPSBkaWZmU2VudGVuY2VzO1xuICBleHBvcnRzLmRpZmZDc3MgPSBkaWZmQ3NzO1xuICBleHBvcnRzLmRpZmZKc29uID0gZGlmZkpzb247XG4gIGV4cG9ydHMuZGlmZkFycmF5cyA9IGRpZmZBcnJheXM7XG4gIGV4cG9ydHMuc3RydWN0dXJlZFBhdGNoID0gc3RydWN0dXJlZFBhdGNoO1xuICBleHBvcnRzLmNyZWF0ZVR3b0ZpbGVzUGF0Y2ggPSBjcmVhdGVUd29GaWxlc1BhdGNoO1xuICBleHBvcnRzLmNyZWF0ZVBhdGNoID0gY3JlYXRlUGF0Y2g7XG4gIGV4cG9ydHMuYXBwbHlQYXRjaCA9IGFwcGx5UGF0Y2g7XG4gIGV4cG9ydHMuYXBwbHlQYXRjaGVzID0gYXBwbHlQYXRjaGVzO1xuICBleHBvcnRzLnBhcnNlUGF0Y2ggPSBwYXJzZVBhdGNoO1xuICBleHBvcnRzLm1lcmdlID0gbWVyZ2U7XG4gIGV4cG9ydHMuY29udmVydENoYW5nZXNUb0RNUCA9IGNvbnZlcnRDaGFuZ2VzVG9ETVA7XG4gIGV4cG9ydHMuY29udmVydENoYW5nZXNUb1hNTCA9IGNvbnZlcnRDaGFuZ2VzVG9YTUw7XG4gIGV4cG9ydHMuY2Fub25pY2FsaXplID0gY2Fub25pY2FsaXplO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbn0pKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG52YXIgaXNQbGFpbk9iamVjdCA9IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qob2JqKSB7XG4gIGlmICghb2JqIHx8IHRvU3RyLmNhbGwob2JqKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgaGFzT3duQ29uc3RydWN0b3IgPSBoYXNPd24uY2FsbChvYmosICdjb25zdHJ1Y3RvcicpO1xuICB2YXIgaGFzSXNQcm90b3R5cGVPZiA9XG4gICAgb2JqLmNvbnN0cnVjdG9yICYmXG4gICAgb2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSAmJlxuICAgIGhhc093bi5jYWxsKG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsICdpc1Byb3RvdHlwZU9mJyk7XG4gIC8vIE5vdCBvd24gY29uc3RydWN0b3IgcHJvcGVydHkgbXVzdCBiZSBPYmplY3RcbiAgaWYgKG9iai5jb25zdHJ1Y3RvciAmJiAhaGFzT3duQ29uc3RydWN0b3IgJiYgIWhhc0lzUHJvdG90eXBlT2YpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBPd24gcHJvcGVydGllcyBhcmUgZW51bWVyYXRlZCBmaXJzdGx5LCBzbyB0byBzcGVlZCB1cCxcbiAgLy8gaWYgbGFzdCBvbmUgaXMgb3duLCB0aGVuIGFsbCBwcm9wZXJ0aWVzIGFyZSBvd24uXG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIC8qKi9cbiAgfVxuXG4gIHJldHVybiB0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJyB8fCBoYXNPd24uY2FsbChvYmosIGtleSk7XG59O1xuXG5mdW5jdGlvbiBtZXJnZSgpIHtcbiAgdmFyIGksXG4gICAgc3JjLFxuICAgIGNvcHksXG4gICAgY2xvbmUsXG4gICAgbmFtZSxcbiAgICByZXN1bHQgPSB7fSxcbiAgICBjdXJyZW50ID0gbnVsbCxcbiAgICBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGN1cnJlbnQgPSBhcmd1bWVudHNbaV07XG4gICAgaWYgKGN1cnJlbnQgPT0gbnVsbCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgZm9yIChuYW1lIGluIGN1cnJlbnQpIHtcbiAgICAgIHNyYyA9IHJlc3VsdFtuYW1lXTtcbiAgICAgIGNvcHkgPSBjdXJyZW50W25hbWVdO1xuICAgICAgaWYgKHJlc3VsdCAhPT0gY29weSkge1xuICAgICAgICBpZiAoY29weSAmJiBpc1BsYWluT2JqZWN0KGNvcHkpKSB7XG4gICAgICAgICAgY2xvbmUgPSBzcmMgJiYgaXNQbGFpbk9iamVjdChzcmMpID8gc3JjIDoge307XG4gICAgICAgICAgcmVzdWx0W25hbWVdID0gbWVyZ2UoY2xvbmUsIGNvcHkpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb3B5ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IGNvcHk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHZlcmJvc2UgPSB0cnVlO1xuXG52YXIgbG9nZ2VyID0ge1xuICAvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG4gIGxvZzogZnVuY3Rpb24gKCkge1xuICAgIGlmICh2ZXJib3NlKSB7XG4gICAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfSxcbiAgZXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodmVyYm9zZSkge1xuICAgICAgY29uc29sZS5lcnJvci5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfSxcbiAgLyogZXNsaW50LWVuYWJsZSBuby1jb25zb2xlICovXG4gIHNldFZlcmJvc2U6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICB2ZXJib3NlID0gdmFsO1xuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBsb2dnZXI7XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWxpdHknKTtcbnZhciB0cnVuY2F0aW9uID0gcmVxdWlyZSgnLi4vdHJ1bmNhdGlvbicpO1xudmFyIGxvZ2dlciA9IHJlcXVpcmUoJy4vbG9nZ2VyJyk7XG5cbnZhciBodHRwID0gcmVxdWlyZSgnaHR0cCcpO1xudmFyIGh0dHBzID0gcmVxdWlyZSgnaHR0cHMnKTtcbnZhciBqc29uQmFja3VwID0gcmVxdWlyZSgnanNvbi1zdHJpbmdpZnktc2FmZScpO1xuXG52YXIgTUFYX1JBVEVfTElNSVRfSU5URVJWQUwgPSA2MDtcblxuLypcbiAqIGFjY2Vzc1Rva2VuIG1heSBiZSBlbWJlZGRlZCBpbiBwYXlsb2FkIGJ1dCB0aGF0IHNob3VsZCBub3QgYmUgYXNzdW1lZFxuICpcbiAqIG9wdGlvbnM6IHtcbiAqICAgaG9zdG5hbWVcbiAqICAgcHJvdG9jb2xcbiAqICAgcGF0aFxuICogICBwb3J0XG4gKiAgIG1ldGhvZFxuICogfVxuICpcbiAqIHBhcmFtcyBpcyBhbiBvYmplY3QgY29udGFpbmluZyBrZXkvdmFsdWUgcGFpcnMgdG8gYmVcbiAqICAgIGFwcGVuZGVkIHRvIHRoZSBwYXRoIGFzICdrZXk9dmFsdWUma2V5PXZhbHVlJ1xuICpcbiAqIHBheWxvYWQgaXMgYW4gdW5zZXJpYWxpemVkIG9iamVjdFxuICovXG5mdW5jdGlvbiBUcmFuc3BvcnQoKSB7XG4gIHRoaXMucmF0ZUxpbWl0RXhwaXJlcyA9IDA7XG59XG5cblRyYW5zcG9ydC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKFxuICBhY2Nlc3NUb2tlbixcbiAgb3B0aW9ucyxcbiAgcGFyYW1zLFxuICBjYWxsYmFjayxcbiAgdHJhbnNwb3J0RmFjdG9yeSxcbikge1xuICB2YXIgdDtcbiAgaWYgKCFjYWxsYmFjayB8fCAhXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG4gIH1cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIF8uYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGgoYWNjZXNzVG9rZW4sIG9wdGlvbnMsIHBhcmFtcyk7XG4gIG9wdGlvbnMuaGVhZGVycyA9IF9oZWFkZXJzKGFjY2Vzc1Rva2VuLCBvcHRpb25zKTtcbiAgaWYgKHRyYW5zcG9ydEZhY3RvcnkpIHtcbiAgICB0ID0gdHJhbnNwb3J0RmFjdG9yeShvcHRpb25zKTtcbiAgfSBlbHNlIHtcbiAgICB0ID0gX3RyYW5zcG9ydChvcHRpb25zKTtcbiAgfVxuICBpZiAoIXQpIHtcbiAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAnVW5rbm93biB0cmFuc3BvcnQgYmFzZWQgb24gZ2l2ZW4gcHJvdG9jb2w6ICcgKyBvcHRpb25zLnByb3RvY29sLFxuICAgICk7XG4gICAgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcignVW5rbm93biB0cmFuc3BvcnQnKSk7XG4gIH1cbiAgdmFyIHJlcSA9IHQucmVxdWVzdChcbiAgICBvcHRpb25zLFxuICAgIGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICB0aGlzLmhhbmRsZVJlc3BvbnNlKHJlc3AsIGNhbGxiYWNrKTtcbiAgICB9LmJpbmQodGhpcyksXG4gICk7XG4gIHJlcS5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfSk7XG4gIHJlcS5lbmQoKTtcbn07XG5cblRyYW5zcG9ydC5wcm90b3R5cGUucG9zdCA9IGZ1bmN0aW9uIChcbiAgYWNjZXNzVG9rZW4sXG4gIG9wdGlvbnMsXG4gIHBheWxvYWQsXG4gIGNhbGxiYWNrLFxuICB0cmFuc3BvcnRGYWN0b3J5LFxuKSB7XG4gIHZhciB0O1xuICBpZiAoIWNhbGxiYWNrIHx8ICFfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgfVxuICBpZiAoX2N1cnJlbnRUaW1lKCkgPCB0aGlzLnJhdGVMaW1pdEV4cGlyZXMpIHtcbiAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKCdFeGNlZWRlZCByYXRlIGxpbWl0JykpO1xuICB9XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBpZiAoIXBheWxvYWQpIHtcbiAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKCdDYW5ub3Qgc2VuZCBlbXB0eSByZXF1ZXN0JykpO1xuICB9XG4gIHZhciBzdHJpbmdpZnlSZXN1bHQgPSB0cnVuY2F0aW9uLnRydW5jYXRlKHBheWxvYWQsIGpzb25CYWNrdXApO1xuICBpZiAoc3RyaW5naWZ5UmVzdWx0LmVycm9yKSB7XG4gICAgbG9nZ2VyLmVycm9yKCdQcm9ibGVtIHN0cmluZ2lmeWluZyBwYXlsb2FkLiBHaXZpbmcgdXAnKTtcbiAgICByZXR1cm4gY2FsbGJhY2soc3RyaW5naWZ5UmVzdWx0LmVycm9yKTtcbiAgfVxuICB2YXIgd3JpdGVEYXRhID0gc3RyaW5naWZ5UmVzdWx0LnZhbHVlO1xuICBvcHRpb25zLmhlYWRlcnMgPSBfaGVhZGVycyhhY2Nlc3NUb2tlbiwgb3B0aW9ucywgd3JpdGVEYXRhKTtcbiAgaWYgKHRyYW5zcG9ydEZhY3RvcnkpIHtcbiAgICB0ID0gdHJhbnNwb3J0RmFjdG9yeShvcHRpb25zKTtcbiAgfSBlbHNlIHtcbiAgICB0ID0gX3RyYW5zcG9ydChvcHRpb25zKTtcbiAgfVxuICBpZiAoIXQpIHtcbiAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAnVW5rbm93biB0cmFuc3BvcnQgYmFzZWQgb24gZ2l2ZW4gcHJvdG9jb2w6ICcgKyBvcHRpb25zLnByb3RvY29sLFxuICAgICk7XG4gICAgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcignVW5rbm93biB0cmFuc3BvcnQnKSk7XG4gIH1cbiAgdmFyIHJlcSA9IHQucmVxdWVzdChcbiAgICBvcHRpb25zLFxuICAgIGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICB0aGlzLmhhbmRsZVJlc3BvbnNlKHJlc3AsIF93cmFwUG9zdENhbGxiYWNrKGNhbGxiYWNrKSk7XG4gICAgfS5iaW5kKHRoaXMpLFxuICApO1xuICByZXEub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycikge1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xuICBpZiAod3JpdGVEYXRhKSB7XG4gICAgcmVxLndyaXRlKHdyaXRlRGF0YSk7XG4gIH1cbiAgcmVxLmVuZCgpO1xufTtcblxuVHJhbnNwb3J0LnByb3RvdHlwZS51cGRhdGVSYXRlTGltaXQgPSBmdW5jdGlvbiAocmVzcCkge1xuICB2YXIgcmVtYWluaW5nID0gcGFyc2VJbnQocmVzcC5oZWFkZXJzWyd4LXJhdGUtbGltaXQtcmVtYWluaW5nJ10gfHwgMCk7XG4gIHZhciByZW1haW5pbmdTZWNvbmRzID0gTWF0aC5taW4oXG4gICAgTUFYX1JBVEVfTElNSVRfSU5URVJWQUwsXG4gICAgcmVzcC5oZWFkZXJzWyd4LXJhdGUtbGltaXQtcmVtYWluaW5nLXNlY29uZHMnXSB8fCAwLFxuICApO1xuICB2YXIgY3VycmVudFRpbWUgPSBfY3VycmVudFRpbWUoKTtcblxuICBpZiAocmVzcC5zdGF0dXNDb2RlID09PSA0MjkgJiYgcmVtYWluaW5nID09PSAwKSB7XG4gICAgdGhpcy5yYXRlTGltaXRFeHBpcmVzID0gY3VycmVudFRpbWUgKyByZW1haW5pbmdTZWNvbmRzO1xuICB9IGVsc2Uge1xuICAgIHRoaXMucmF0ZUxpbWl0RXhwaXJlcyA9IGN1cnJlbnRUaW1lO1xuICB9XG59O1xuXG5UcmFuc3BvcnQucHJvdG90eXBlLmhhbmRsZVJlc3BvbnNlID0gZnVuY3Rpb24gKHJlc3AsIGNhbGxiYWNrKSB7XG4gIHRoaXMudXBkYXRlUmF0ZUxpbWl0KHJlc3ApO1xuXG4gIHZhciByZXNwRGF0YSA9IFtdO1xuICByZXNwLnNldEVuY29kaW5nKCd1dGY4Jyk7XG4gIHJlc3Aub24oJ2RhdGEnLCBmdW5jdGlvbiAoY2h1bmspIHtcbiAgICByZXNwRGF0YS5wdXNoKGNodW5rKTtcbiAgfSk7XG5cbiAgcmVzcC5vbignZW5kJywgZnVuY3Rpb24gKCkge1xuICAgIHJlc3BEYXRhID0gcmVzcERhdGEuam9pbignJyk7XG4gICAgX3BhcnNlQXBpUmVzcG9uc2UocmVzcERhdGEsIGNhbGxiYWNrKTtcbiAgfSk7XG59O1xuXG4vKiogSGVscGVycyAqKi9cblxuZnVuY3Rpb24gX2hlYWRlcnMoYWNjZXNzVG9rZW4sIG9wdGlvbnMsIGRhdGEpIHtcbiAgdmFyIGhlYWRlcnMgPSAob3B0aW9ucyAmJiBvcHRpb25zLmhlYWRlcnMpIHx8IHt9O1xuICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uJztcbiAgaWYgKGRhdGEpIHtcbiAgICB0cnkge1xuICAgICAgaGVhZGVyc1snQ29udGVudC1MZW5ndGgnXSA9IEJ1ZmZlci5ieXRlTGVuZ3RoKGRhdGEsICd1dGY4Jyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbG9nZ2VyLmVycm9yKCdDb3VsZCBub3QgZ2V0IHRoZSBjb250ZW50IGxlbmd0aCBvZiB0aGUgZGF0YScpO1xuICAgIH1cbiAgfVxuICBoZWFkZXJzWydYLVJvbGxiYXItQWNjZXNzLVRva2VuJ10gPSBhY2Nlc3NUb2tlbjtcbiAgcmV0dXJuIGhlYWRlcnM7XG59XG5cbmZ1bmN0aW9uIF90cmFuc3BvcnQob3B0aW9ucykge1xuICByZXR1cm4geyAnaHR0cDonOiBodHRwLCAnaHR0cHM6JzogaHR0cHMgfVtvcHRpb25zLnByb3RvY29sXTtcbn1cblxuZnVuY3Rpb24gX3BhcnNlQXBpUmVzcG9uc2UoZGF0YSwgY2FsbGJhY2spIHtcbiAgdmFyIHBhcnNlZERhdGEgPSBfLmpzb25QYXJzZShkYXRhKTtcbiAgaWYgKHBhcnNlZERhdGEuZXJyb3IpIHtcbiAgICBsb2dnZXIuZXJyb3IoJ0NvdWxkIG5vdCBwYXJzZSBhcGkgcmVzcG9uc2UsIGVycjogJyArIHBhcnNlZERhdGEuZXJyb3IpO1xuICAgIHJldHVybiBjYWxsYmFjayhwYXJzZWREYXRhLmVycm9yKTtcbiAgfVxuICBkYXRhID0gcGFyc2VkRGF0YS52YWx1ZTtcblxuICBpZiAoZGF0YS5lcnIpIHtcbiAgICBsb2dnZXIuZXJyb3IoJ1JlY2VpdmVkIGVycm9yOiAnICsgZGF0YS5tZXNzYWdlKTtcbiAgICByZXR1cm4gY2FsbGJhY2soXG4gICAgICBuZXcgRXJyb3IoJ0FwaSBlcnJvcjogJyArIChkYXRhLm1lc3NhZ2UgfHwgJ1Vua25vd24gZXJyb3InKSksXG4gICAgKTtcbiAgfVxuXG4gIGNhbGxiYWNrKG51bGwsIGRhdGEpO1xufVxuXG5mdW5jdGlvbiBfd3JhcFBvc3RDYWxsYmFjayhjYWxsYmFjaykge1xuICByZXR1cm4gZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgIH1cbiAgICBpZiAoZGF0YS5yZXN1bHQgJiYgZGF0YS5yZXN1bHQudXVpZCkge1xuICAgICAgbG9nZ2VyLmxvZyhcbiAgICAgICAgW1xuICAgICAgICAgICdTdWNjZXNzZnVsIGFwaSByZXNwb25zZS4nLFxuICAgICAgICAgICcgTGluazogaHR0cHM6Ly9yb2xsYmFyLmNvbS9vY2N1cnJlbmNlL3V1aWQvP3V1aWQ9JyArXG4gICAgICAgICAgICBkYXRhLnJlc3VsdC51dWlkLFxuICAgICAgICBdLmpvaW4oJycpLFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nZ2VyLmxvZygnU3VjY2Vzc2Z1bCBhcGkgcmVzcG9uc2UnKTtcbiAgICB9XG4gICAgY2FsbGJhY2sobnVsbCwgZGF0YS5yZXN1bHQpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBfY3VycmVudFRpbWUoKSB7XG4gIHJldHVybiBNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUcmFuc3BvcnQ7XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbGl0eScpO1xudmFyIHRyYXZlcnNlID0gcmVxdWlyZSgnLi91dGlsaXR5L3RyYXZlcnNlJyk7XG5cbmZ1bmN0aW9uIHJhdyhwYXlsb2FkLCBqc29uQmFja3VwKSB7XG4gIHJldHVybiBbcGF5bG9hZCwgXy5zdHJpbmdpZnkocGF5bG9hZCwganNvbkJhY2t1cCldO1xufVxuXG5mdW5jdGlvbiBzZWxlY3RGcmFtZXMoZnJhbWVzLCByYW5nZSkge1xuICB2YXIgbGVuID0gZnJhbWVzLmxlbmd0aDtcbiAgaWYgKGxlbiA+IHJhbmdlICogMikge1xuICAgIHJldHVybiBmcmFtZXMuc2xpY2UoMCwgcmFuZ2UpLmNvbmNhdChmcmFtZXMuc2xpY2UobGVuIC0gcmFuZ2UpKTtcbiAgfVxuICByZXR1cm4gZnJhbWVzO1xufVxuXG5mdW5jdGlvbiB0cnVuY2F0ZUZyYW1lcyhwYXlsb2FkLCBqc29uQmFja3VwLCByYW5nZSkge1xuICByYW5nZSA9IHR5cGVvZiByYW5nZSA9PT0gJ3VuZGVmaW5lZCcgPyAzMCA6IHJhbmdlO1xuICB2YXIgYm9keSA9IHBheWxvYWQuZGF0YS5ib2R5O1xuICB2YXIgZnJhbWVzO1xuICBpZiAoYm9keS50cmFjZV9jaGFpbikge1xuICAgIHZhciBjaGFpbiA9IGJvZHkudHJhY2VfY2hhaW47XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGFpbi5sZW5ndGg7IGkrKykge1xuICAgICAgZnJhbWVzID0gY2hhaW5baV0uZnJhbWVzO1xuICAgICAgZnJhbWVzID0gc2VsZWN0RnJhbWVzKGZyYW1lcywgcmFuZ2UpO1xuICAgICAgY2hhaW5baV0uZnJhbWVzID0gZnJhbWVzO1xuICAgIH1cbiAgfSBlbHNlIGlmIChib2R5LnRyYWNlKSB7XG4gICAgZnJhbWVzID0gYm9keS50cmFjZS5mcmFtZXM7XG4gICAgZnJhbWVzID0gc2VsZWN0RnJhbWVzKGZyYW1lcywgcmFuZ2UpO1xuICAgIGJvZHkudHJhY2UuZnJhbWVzID0gZnJhbWVzO1xuICB9XG4gIHJldHVybiBbcGF5bG9hZCwgXy5zdHJpbmdpZnkocGF5bG9hZCwganNvbkJhY2t1cCldO1xufVxuXG5mdW5jdGlvbiBtYXliZVRydW5jYXRlVmFsdWUobGVuLCB2YWwpIHtcbiAgaWYgKCF2YWwpIHtcbiAgICByZXR1cm4gdmFsO1xuICB9XG4gIGlmICh2YWwubGVuZ3RoID4gbGVuKSB7XG4gICAgcmV0dXJuIHZhbC5zbGljZSgwLCBsZW4gLSAzKS5jb25jYXQoJy4uLicpO1xuICB9XG4gIHJldHVybiB2YWw7XG59XG5cbmZ1bmN0aW9uIHRydW5jYXRlU3RyaW5ncyhsZW4sIHBheWxvYWQsIGpzb25CYWNrdXApIHtcbiAgZnVuY3Rpb24gdHJ1bmNhdG9yKGssIHYsIHNlZW4pIHtcbiAgICBzd2l0Y2ggKF8udHlwZU5hbWUodikpIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIHJldHVybiBtYXliZVRydW5jYXRlVmFsdWUobGVuLCB2KTtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICBjYXNlICdhcnJheSc6XG4gICAgICAgIHJldHVybiB0cmF2ZXJzZSh2LCB0cnVuY2F0b3IsIHNlZW4pO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfVxuICB9XG4gIHBheWxvYWQgPSB0cmF2ZXJzZShwYXlsb2FkLCB0cnVuY2F0b3IpO1xuICByZXR1cm4gW3BheWxvYWQsIF8uc3RyaW5naWZ5KHBheWxvYWQsIGpzb25CYWNrdXApXTtcbn1cblxuZnVuY3Rpb24gdHJ1bmNhdGVUcmFjZURhdGEodHJhY2VEYXRhKSB7XG4gIGlmICh0cmFjZURhdGEuZXhjZXB0aW9uKSB7XG4gICAgZGVsZXRlIHRyYWNlRGF0YS5leGNlcHRpb24uZGVzY3JpcHRpb247XG4gICAgdHJhY2VEYXRhLmV4Y2VwdGlvbi5tZXNzYWdlID0gbWF5YmVUcnVuY2F0ZVZhbHVlKFxuICAgICAgMjU1LFxuICAgICAgdHJhY2VEYXRhLmV4Y2VwdGlvbi5tZXNzYWdlLFxuICAgICk7XG4gIH1cbiAgdHJhY2VEYXRhLmZyYW1lcyA9IHNlbGVjdEZyYW1lcyh0cmFjZURhdGEuZnJhbWVzLCAxKTtcbiAgcmV0dXJuIHRyYWNlRGF0YTtcbn1cblxuZnVuY3Rpb24gbWluQm9keShwYXlsb2FkLCBqc29uQmFja3VwKSB7XG4gIHZhciBib2R5ID0gcGF5bG9hZC5kYXRhLmJvZHk7XG4gIGlmIChib2R5LnRyYWNlX2NoYWluKSB7XG4gICAgdmFyIGNoYWluID0gYm9keS50cmFjZV9jaGFpbjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYWluLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGFpbltpXSA9IHRydW5jYXRlVHJhY2VEYXRhKGNoYWluW2ldKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoYm9keS50cmFjZSkge1xuICAgIGJvZHkudHJhY2UgPSB0cnVuY2F0ZVRyYWNlRGF0YShib2R5LnRyYWNlKTtcbiAgfVxuICByZXR1cm4gW3BheWxvYWQsIF8uc3RyaW5naWZ5KHBheWxvYWQsIGpzb25CYWNrdXApXTtcbn1cblxuZnVuY3Rpb24gbmVlZHNUcnVuY2F0aW9uKHBheWxvYWQsIG1heFNpemUpIHtcbiAgcmV0dXJuIF8ubWF4Qnl0ZVNpemUocGF5bG9hZCkgPiBtYXhTaXplO1xufVxuXG5mdW5jdGlvbiB0cnVuY2F0ZShwYXlsb2FkLCBqc29uQmFja3VwLCBtYXhTaXplKSB7XG4gIG1heFNpemUgPSB0eXBlb2YgbWF4U2l6ZSA9PT0gJ3VuZGVmaW5lZCcgPyA1MTIgKiAxMDI0IDogbWF4U2l6ZTtcbiAgdmFyIHN0cmF0ZWdpZXMgPSBbXG4gICAgcmF3LFxuICAgIHRydW5jYXRlRnJhbWVzLFxuICAgIHRydW5jYXRlU3RyaW5ncy5iaW5kKG51bGwsIDEwMjQpLFxuICAgIHRydW5jYXRlU3RyaW5ncy5iaW5kKG51bGwsIDUxMiksXG4gICAgdHJ1bmNhdGVTdHJpbmdzLmJpbmQobnVsbCwgMjU2KSxcbiAgICBtaW5Cb2R5LFxuICBdO1xuICB2YXIgc3RyYXRlZ3ksIHJlc3VsdHMsIHJlc3VsdDtcblxuICB3aGlsZSAoKHN0cmF0ZWd5ID0gc3RyYXRlZ2llcy5zaGlmdCgpKSkge1xuICAgIHJlc3VsdHMgPSBzdHJhdGVneShwYXlsb2FkLCBqc29uQmFja3VwKTtcbiAgICBwYXlsb2FkID0gcmVzdWx0c1swXTtcbiAgICByZXN1bHQgPSByZXN1bHRzWzFdO1xuICAgIGlmIChyZXN1bHQuZXJyb3IgfHwgIW5lZWRzVHJ1bmNhdGlvbihyZXN1bHQudmFsdWUsIG1heFNpemUpKSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdHJ1bmNhdGU6IHRydW5jYXRlLFxuXG4gIC8qIGZvciB0ZXN0aW5nICovXG4gIHJhdzogcmF3LFxuICB0cnVuY2F0ZUZyYW1lczogdHJ1bmNhdGVGcmFtZXMsXG4gIHRydW5jYXRlU3RyaW5nczogdHJ1bmNhdGVTdHJpbmdzLFxuICBtYXliZVRydW5jYXRlVmFsdWU6IG1heWJlVHJ1bmNhdGVWYWx1ZSxcbn07XG4iLCJ2YXIgbWVyZ2UgPSByZXF1aXJlKCcuL21lcmdlJyk7XG5cbnZhciBSb2xsYmFySlNPTiA9IHt9O1xuZnVuY3Rpb24gc2V0dXBKU09OKHBvbHlmaWxsSlNPTikge1xuICBpZiAoaXNGdW5jdGlvbihSb2xsYmFySlNPTi5zdHJpbmdpZnkpICYmIGlzRnVuY3Rpb24oUm9sbGJhckpTT04ucGFyc2UpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGlzRGVmaW5lZChKU09OKSkge1xuICAgIC8vIElmIHBvbHlmaWxsIGlzIHByb3ZpZGVkLCBwcmVmZXIgaXQgb3ZlciBleGlzdGluZyBub24tbmF0aXZlIHNoaW1zLlxuICAgIGlmIChwb2x5ZmlsbEpTT04pIHtcbiAgICAgIGlmIChpc05hdGl2ZUZ1bmN0aW9uKEpTT04uc3RyaW5naWZ5KSkge1xuICAgICAgICBSb2xsYmFySlNPTi5zdHJpbmdpZnkgPSBKU09OLnN0cmluZ2lmeTtcbiAgICAgIH1cbiAgICAgIGlmIChpc05hdGl2ZUZ1bmN0aW9uKEpTT04ucGFyc2UpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnBhcnNlID0gSlNPTi5wYXJzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZWxzZSBhY2NlcHQgYW55IGludGVyZmFjZSB0aGF0IGlzIHByZXNlbnQuXG4gICAgICBpZiAoaXNGdW5jdGlvbihKU09OLnN0cmluZ2lmeSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04uc3RyaW5naWZ5ID0gSlNPTi5zdHJpbmdpZnk7XG4gICAgICB9XG4gICAgICBpZiAoaXNGdW5jdGlvbihKU09OLnBhcnNlKSkge1xuICAgICAgICBSb2xsYmFySlNPTi5wYXJzZSA9IEpTT04ucGFyc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICghaXNGdW5jdGlvbihSb2xsYmFySlNPTi5zdHJpbmdpZnkpIHx8ICFpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnBhcnNlKSkge1xuICAgIHBvbHlmaWxsSlNPTiAmJiBwb2x5ZmlsbEpTT04oUm9sbGJhckpTT04pO1xuICB9XG59XG5cbi8qXG4gKiBpc1R5cGUgLSBHaXZlbiBhIEphdmFzY3JpcHQgdmFsdWUgYW5kIGEgc3RyaW5nLCByZXR1cm5zIHRydWUgaWYgdGhlIHR5cGUgb2YgdGhlIHZhbHVlIG1hdGNoZXMgdGhlXG4gKiBnaXZlbiBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHggLSBhbnkgdmFsdWVcbiAqIEBwYXJhbSB0IC0gYSBsb3dlcmNhc2Ugc3RyaW5nIGNvbnRhaW5pbmcgb25lIG9mIHRoZSBmb2xsb3dpbmcgdHlwZSBuYW1lczpcbiAqICAgIC0gdW5kZWZpbmVkXG4gKiAgICAtIG51bGxcbiAqICAgIC0gZXJyb3JcbiAqICAgIC0gbnVtYmVyXG4gKiAgICAtIGJvb2xlYW5cbiAqICAgIC0gc3RyaW5nXG4gKiAgICAtIHN5bWJvbFxuICogICAgLSBmdW5jdGlvblxuICogICAgLSBvYmplY3RcbiAqICAgIC0gYXJyYXlcbiAqIEByZXR1cm5zIHRydWUgaWYgeCBpcyBvZiB0eXBlIHQsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1R5cGUoeCwgdCkge1xuICByZXR1cm4gdCA9PT0gdHlwZU5hbWUoeCk7XG59XG5cbi8qXG4gKiB0eXBlTmFtZSAtIEdpdmVuIGEgSmF2YXNjcmlwdCB2YWx1ZSwgcmV0dXJucyB0aGUgdHlwZSBvZiB0aGUgb2JqZWN0IGFzIGEgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIHR5cGVOYW1lKHgpIHtcbiAgdmFyIG5hbWUgPSB0eXBlb2YgeDtcbiAgaWYgKG5hbWUgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG5hbWU7XG4gIH1cbiAgaWYgKCF4KSB7XG4gICAgcmV0dXJuICdudWxsJztcbiAgfVxuICBpZiAoeCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgcmV0dXJuICdlcnJvcic7XG4gIH1cbiAgcmV0dXJuIHt9LnRvU3RyaW5nXG4gICAgLmNhbGwoeClcbiAgICAubWF0Y2goL1xccyhbYS16QS1aXSspLylbMV1cbiAgICAudG9Mb3dlckNhc2UoKTtcbn1cblxuLyogaXNGdW5jdGlvbiAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgYSBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSBmIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGYgaXMgYSBmdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oZikge1xuICByZXR1cm4gaXNUeXBlKGYsICdmdW5jdGlvbicpO1xufVxuXG4vKiBpc05hdGl2ZUZ1bmN0aW9uIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBhIG5hdGl2ZSBKUyBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSBmIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGYgaXMgYSBuYXRpdmUgSlMgZnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc05hdGl2ZUZ1bmN0aW9uKGYpIHtcbiAgdmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcbiAgdmFyIGZ1bmNNYXRjaFN0cmluZyA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZ1xuICAgIC5jYWxsKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkpXG4gICAgLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/Jyk7XG4gIHZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArIGZ1bmNNYXRjaFN0cmluZyArICckJyk7XG4gIHJldHVybiBpc09iamVjdChmKSAmJiByZUlzTmF0aXZlLnRlc3QoZik7XG59XG5cbi8qIGlzT2JqZWN0IC0gQ2hlY2tzIGlmIHRoZSBhcmd1bWVudCBpcyBhbiBvYmplY3RcbiAqXG4gKiBAcGFyYW0gdmFsdWUgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaXMgdmFsdWUgaXMgYW4gb2JqZWN0IGZ1bmN0aW9uIGlzIGFuIG9iamVjdClcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qIGlzU3RyaW5nIC0gQ2hlY2tzIGlmIHRoZSBhcmd1bWVudCBpcyBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB2YWx1ZSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiB2YWx1ZSBpcyBhIHN0cmluZ1xuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZztcbn1cblxuLyoqXG4gKiBpc0Zpbml0ZU51bWJlciAtIGRldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIGEgZmluaXRlIG51bWJlclxuICpcbiAqIEBwYXJhbSB7Kn0gbiAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiB2YWx1ZSBpcyBhIGZpbml0ZSBudW1iZXJcbiAqL1xuZnVuY3Rpb24gaXNGaW5pdGVOdW1iZXIobikge1xuICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKG4pO1xufVxuXG4vKlxuICogaXNEZWZpbmVkIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBub3QgZXF1YWwgdG8gdW5kZWZpbmVkXG4gKlxuICogQHBhcmFtIHUgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgdSBpcyBhbnl0aGluZyBvdGhlciB0aGFuIHVuZGVmaW5lZFxuICovXG5mdW5jdGlvbiBpc0RlZmluZWQodSkge1xuICByZXR1cm4gIWlzVHlwZSh1LCAndW5kZWZpbmVkJyk7XG59XG5cbi8qXG4gKiBpc0l0ZXJhYmxlIC0gY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgY2FuIGJlIGl0ZXJhdGVkLCBlc3NlbnRpYWxseVxuICogd2hldGhlciBpdCBpcyBhbiBvYmplY3Qgb3IgYW4gYXJyYXkuXG4gKlxuICogQHBhcmFtIGkgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgaSBpcyBhbiBvYmplY3Qgb3IgYW4gYXJyYXkgYXMgZGV0ZXJtaW5lZCBieSBgdHlwZU5hbWVgXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmFibGUoaSkge1xuICB2YXIgdHlwZSA9IHR5cGVOYW1lKGkpO1xuICByZXR1cm4gdHlwZSA9PT0gJ29iamVjdCcgfHwgdHlwZSA9PT0gJ2FycmF5Jztcbn1cblxuLypcbiAqIGlzRXJyb3IgLSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBvZiBhbiBlcnJvciB0eXBlXG4gKlxuICogQHBhcmFtIGUgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZSBpcyBhbiBlcnJvclxuICovXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgLy8gRGV0ZWN0IGJvdGggRXJyb3IgYW5kIEZpcmVmb3ggRXhjZXB0aW9uIHR5cGVcbiAgcmV0dXJuIGlzVHlwZShlLCAnZXJyb3InKSB8fCBpc1R5cGUoZSwgJ2V4Y2VwdGlvbicpO1xufVxuXG4vKiBpc1Byb21pc2UgLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIGEgcHJvbWlzZVxuICpcbiAqIEBwYXJhbSBwIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGYgaXMgYSBmdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzUHJvbWlzZShwKSB7XG4gIHJldHVybiBpc09iamVjdChwKSAmJiBpc1R5cGUocC50aGVuLCAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBpc0Jyb3dzZXIgLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiB0aGUgY29kZSBpcyBydW5uaW5nIGluIGEgYnJvd3NlclxuICpcbiAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGNvZGUgaXMgcnVubmluZyBpbiBhIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAqL1xuZnVuY3Rpb24gaXNCcm93c2VyKCkge1xuICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG59XG5cbmZ1bmN0aW9uIHJlZGFjdCgpIHtcbiAgcmV0dXJuICcqKioqKioqKic7XG59XG5cbi8vIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvODgwOTQ3Mi8xMTM4MTkxXG5mdW5jdGlvbiB1dWlkNCgpIHtcbiAgdmFyIGQgPSBub3coKTtcbiAgdmFyIHV1aWQgPSAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKFxuICAgIC9beHldL2csXG4gICAgZnVuY3Rpb24gKGMpIHtcbiAgICAgIHZhciByID0gKGQgKyBNYXRoLnJhbmRvbSgpICogMTYpICUgMTYgfCAwO1xuICAgICAgZCA9IE1hdGguZmxvb3IoZCAvIDE2KTtcbiAgICAgIHJldHVybiAoYyA9PT0gJ3gnID8gciA6IChyICYgMHg3KSB8IDB4OCkudG9TdHJpbmcoMTYpO1xuICAgIH0sXG4gICk7XG4gIHJldHVybiB1dWlkO1xufVxuXG52YXIgTEVWRUxTID0ge1xuICBkZWJ1ZzogMCxcbiAgaW5mbzogMSxcbiAgd2FybmluZzogMixcbiAgZXJyb3I6IDMsXG4gIGNyaXRpY2FsOiA0LFxufTtcblxuZnVuY3Rpb24gc2FuaXRpemVVcmwodXJsKSB7XG4gIHZhciBiYXNlVXJsUGFydHMgPSBwYXJzZVVyaSh1cmwpO1xuICBpZiAoIWJhc2VVcmxQYXJ0cykge1xuICAgIHJldHVybiAnKHVua25vd24pJztcbiAgfVxuXG4gIC8vIHJlbW92ZSBhIHRyYWlsaW5nICMgaWYgdGhlcmUgaXMgbm8gYW5jaG9yXG4gIGlmIChiYXNlVXJsUGFydHMuYW5jaG9yID09PSAnJykge1xuICAgIGJhc2VVcmxQYXJ0cy5zb3VyY2UgPSBiYXNlVXJsUGFydHMuc291cmNlLnJlcGxhY2UoJyMnLCAnJyk7XG4gIH1cblxuICB1cmwgPSBiYXNlVXJsUGFydHMuc291cmNlLnJlcGxhY2UoJz8nICsgYmFzZVVybFBhcnRzLnF1ZXJ5LCAnJyk7XG4gIHJldHVybiB1cmw7XG59XG5cbnZhciBwYXJzZVVyaU9wdGlvbnMgPSB7XG4gIHN0cmljdE1vZGU6IGZhbHNlLFxuICBrZXk6IFtcbiAgICAnc291cmNlJyxcbiAgICAncHJvdG9jb2wnLFxuICAgICdhdXRob3JpdHknLFxuICAgICd1c2VySW5mbycsXG4gICAgJ3VzZXInLFxuICAgICdwYXNzd29yZCcsXG4gICAgJ2hvc3QnLFxuICAgICdwb3J0JyxcbiAgICAncmVsYXRpdmUnLFxuICAgICdwYXRoJyxcbiAgICAnZGlyZWN0b3J5JyxcbiAgICAnZmlsZScsXG4gICAgJ3F1ZXJ5JyxcbiAgICAnYW5jaG9yJyxcbiAgXSxcbiAgcToge1xuICAgIG5hbWU6ICdxdWVyeUtleScsXG4gICAgcGFyc2VyOiAvKD86XnwmKShbXiY9XSopPT8oW14mXSopL2csXG4gIH0sXG4gIHBhcnNlcjoge1xuICAgIHN0cmljdDpcbiAgICAgIC9eKD86KFteOlxcLz8jXSspOik/KD86XFwvXFwvKCg/OigoW146QF0qKSg/OjooW146QF0qKSk/KT9AKT8oW146XFwvPyNdKikoPzo6KFxcZCopKT8pKT8oKCgoPzpbXj8jXFwvXSpcXC8pKikoW14/I10qKSkoPzpcXD8oW14jXSopKT8oPzojKC4qKSk/KS8sXG4gICAgbG9vc2U6XG4gICAgICAvXig/Oig/IVteOkBdKzpbXjpAXFwvXSpAKShbXjpcXC8/Iy5dKyk6KT8oPzpcXC9cXC8pPygoPzooKFteOkBdKikoPzo6KFteOkBdKikpPyk/QCk/KFteOlxcLz8jXSopKD86OihcXGQqKSk/KSgoKFxcLyg/OltePyNdKD8hW14/I1xcL10qXFwuW14/I1xcLy5dKyg/Ols/I118JCkpKSpcXC8/KT8oW14/I1xcL10qKSkoPzpcXD8oW14jXSopKT8oPzojKC4qKSk/KS8sXG4gIH0sXG59O1xuXG5mdW5jdGlvbiBwYXJzZVVyaShzdHIpIHtcbiAgaWYgKCFpc1R5cGUoc3RyLCAnc3RyaW5nJykpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgdmFyIG8gPSBwYXJzZVVyaU9wdGlvbnM7XG4gIHZhciBtID0gby5wYXJzZXJbby5zdHJpY3RNb2RlID8gJ3N0cmljdCcgOiAnbG9vc2UnXS5leGVjKHN0cik7XG4gIHZhciB1cmkgPSB7fTtcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IG8ua2V5Lmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIHVyaVtvLmtleVtpXV0gPSBtW2ldIHx8ICcnO1xuICB9XG5cbiAgdXJpW28ucS5uYW1lXSA9IHt9O1xuICB1cmlbby5rZXlbMTJdXS5yZXBsYWNlKG8ucS5wYXJzZXIsIGZ1bmN0aW9uICgkMCwgJDEsICQyKSB7XG4gICAgaWYgKCQxKSB7XG4gICAgICB1cmlbby5xLm5hbWVdWyQxXSA9ICQyO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHVyaTtcbn1cblxuZnVuY3Rpb24gYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGgoYWNjZXNzVG9rZW4sIG9wdGlvbnMsIHBhcmFtcykge1xuICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gIHBhcmFtcy5hY2Nlc3NfdG9rZW4gPSBhY2Nlc3NUb2tlbjtcbiAgdmFyIHBhcmFtc0FycmF5ID0gW107XG4gIHZhciBrO1xuICBmb3IgKGsgaW4gcGFyYW1zKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJhbXMsIGspKSB7XG4gICAgICBwYXJhbXNBcnJheS5wdXNoKFtrLCBwYXJhbXNba11dLmpvaW4oJz0nKSk7XG4gICAgfVxuICB9XG4gIHZhciBxdWVyeSA9ICc/JyArIHBhcmFtc0FycmF5LnNvcnQoKS5qb2luKCcmJyk7XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIG9wdGlvbnMucGF0aCA9IG9wdGlvbnMucGF0aCB8fCAnJztcbiAgdmFyIHFzID0gb3B0aW9ucy5wYXRoLmluZGV4T2YoJz8nKTtcbiAgdmFyIGggPSBvcHRpb25zLnBhdGguaW5kZXhPZignIycpO1xuICB2YXIgcDtcbiAgaWYgKHFzICE9PSAtMSAmJiAoaCA9PT0gLTEgfHwgaCA+IHFzKSkge1xuICAgIHAgPSBvcHRpb25zLnBhdGg7XG4gICAgb3B0aW9ucy5wYXRoID0gcC5zdWJzdHJpbmcoMCwgcXMpICsgcXVlcnkgKyAnJicgKyBwLnN1YnN0cmluZyhxcyArIDEpO1xuICB9IGVsc2Uge1xuICAgIGlmIChoICE9PSAtMSkge1xuICAgICAgcCA9IG9wdGlvbnMucGF0aDtcbiAgICAgIG9wdGlvbnMucGF0aCA9IHAuc3Vic3RyaW5nKDAsIGgpICsgcXVlcnkgKyBwLnN1YnN0cmluZyhoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9ucy5wYXRoID0gb3B0aW9ucy5wYXRoICsgcXVlcnk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFVybCh1LCBwcm90b2NvbCkge1xuICBwcm90b2NvbCA9IHByb3RvY29sIHx8IHUucHJvdG9jb2w7XG4gIGlmICghcHJvdG9jb2wgJiYgdS5wb3J0KSB7XG4gICAgaWYgKHUucG9ydCA9PT0gODApIHtcbiAgICAgIHByb3RvY29sID0gJ2h0dHA6JztcbiAgICB9IGVsc2UgaWYgKHUucG9ydCA9PT0gNDQzKSB7XG4gICAgICBwcm90b2NvbCA9ICdodHRwczonO1xuICAgIH1cbiAgfVxuICBwcm90b2NvbCA9IHByb3RvY29sIHx8ICdodHRwczonO1xuXG4gIGlmICghdS5ob3N0bmFtZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZhciByZXN1bHQgPSBwcm90b2NvbCArICcvLycgKyB1Lmhvc3RuYW1lO1xuICBpZiAodS5wb3J0KSB7XG4gICAgcmVzdWx0ID0gcmVzdWx0ICsgJzonICsgdS5wb3J0O1xuICB9XG4gIGlmICh1LnBhdGgpIHtcbiAgICByZXN1bHQgPSByZXN1bHQgKyB1LnBhdGg7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5KG9iaiwgYmFja3VwKSB7XG4gIHZhciB2YWx1ZSwgZXJyb3I7XG4gIHRyeSB7XG4gICAgdmFsdWUgPSBSb2xsYmFySlNPTi5zdHJpbmdpZnkob2JqKTtcbiAgfSBjYXRjaCAoanNvbkVycm9yKSB7XG4gICAgaWYgKGJhY2t1cCAmJiBpc0Z1bmN0aW9uKGJhY2t1cCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlID0gYmFja3VwKG9iaik7XG4gICAgICB9IGNhdGNoIChiYWNrdXBFcnJvcikge1xuICAgICAgICBlcnJvciA9IGJhY2t1cEVycm9yO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlcnJvciA9IGpzb25FcnJvcjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgZXJyb3I6IGVycm9yLCB2YWx1ZTogdmFsdWUgfTtcbn1cblxuZnVuY3Rpb24gbWF4Qnl0ZVNpemUoc3RyaW5nKSB7XG4gIC8vIFRoZSB0cmFuc3BvcnQgd2lsbCB1c2UgdXRmLTgsIHNvIGFzc3VtZSB1dGYtOCBlbmNvZGluZy5cbiAgLy9cbiAgLy8gVGhpcyBtaW5pbWFsIGltcGxlbWVudGF0aW9uIHdpbGwgYWNjdXJhdGVseSBjb3VudCBieXRlcyBmb3IgYWxsIFVDUy0yIGFuZFxuICAvLyBzaW5nbGUgY29kZSBwb2ludCBVVEYtMTYuIElmIHByZXNlbnRlZCB3aXRoIG11bHRpIGNvZGUgcG9pbnQgVVRGLTE2LFxuICAvLyB3aGljaCBzaG91bGQgYmUgcmFyZSwgaXQgd2lsbCBzYWZlbHkgb3ZlcmNvdW50LCBub3QgdW5kZXJjb3VudC5cbiAgLy9cbiAgLy8gV2hpbGUgcm9idXN0IHV0Zi04IGVuY29kZXJzIGV4aXN0LCB0aGlzIGlzIGZhciBzbWFsbGVyIGFuZCBmYXIgbW9yZSBwZXJmb3JtYW50LlxuICAvLyBGb3IgcXVpY2tseSBjb3VudGluZyBwYXlsb2FkIHNpemUgZm9yIHRydW5jYXRpb24sIHNtYWxsZXIgaXMgYmV0dGVyLlxuXG4gIHZhciBjb3VudCA9IDA7XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgY29kZSA9IHN0cmluZy5jaGFyQ29kZUF0KGkpO1xuICAgIGlmIChjb2RlIDwgMTI4KSB7XG4gICAgICAvLyB1cCB0byA3IGJpdHNcbiAgICAgIGNvdW50ID0gY291bnQgKyAxO1xuICAgIH0gZWxzZSBpZiAoY29kZSA8IDIwNDgpIHtcbiAgICAgIC8vIHVwIHRvIDExIGJpdHNcbiAgICAgIGNvdW50ID0gY291bnQgKyAyO1xuICAgIH0gZWxzZSBpZiAoY29kZSA8IDY1NTM2KSB7XG4gICAgICAvLyB1cCB0byAxNiBiaXRzXG4gICAgICBjb3VudCA9IGNvdW50ICsgMztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY291bnQ7XG59XG5cbmZ1bmN0aW9uIGpzb25QYXJzZShzKSB7XG4gIHZhciB2YWx1ZSwgZXJyb3I7XG4gIHRyeSB7XG4gICAgdmFsdWUgPSBSb2xsYmFySlNPTi5wYXJzZShzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGVycm9yID0gZTtcbiAgfVxuICByZXR1cm4geyBlcnJvcjogZXJyb3IsIHZhbHVlOiB2YWx1ZSB9O1xufVxuXG5mdW5jdGlvbiBtYWtlVW5oYW5kbGVkU3RhY2tJbmZvKFxuICBtZXNzYWdlLFxuICB1cmwsXG4gIGxpbmVubyxcbiAgY29sbm8sXG4gIGVycm9yLFxuICBtb2RlLFxuICBiYWNrdXBNZXNzYWdlLFxuICBlcnJvclBhcnNlcixcbikge1xuICB2YXIgbG9jYXRpb24gPSB7XG4gICAgdXJsOiB1cmwgfHwgJycsXG4gICAgbGluZTogbGluZW5vLFxuICAgIGNvbHVtbjogY29sbm8sXG4gIH07XG4gIGxvY2F0aW9uLmZ1bmMgPSBlcnJvclBhcnNlci5ndWVzc0Z1bmN0aW9uTmFtZShsb2NhdGlvbi51cmwsIGxvY2F0aW9uLmxpbmUpO1xuICBsb2NhdGlvbi5jb250ZXh0ID0gZXJyb3JQYXJzZXIuZ2F0aGVyQ29udGV4dChsb2NhdGlvbi51cmwsIGxvY2F0aW9uLmxpbmUpO1xuICB2YXIgaHJlZiA9XG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIGRvY3VtZW50ICYmXG4gICAgZG9jdW1lbnQubG9jYXRpb24gJiZcbiAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmO1xuICB2YXIgdXNlcmFnZW50ID1cbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHdpbmRvdyAmJlxuICAgIHdpbmRvdy5uYXZpZ2F0b3IgJiZcbiAgICB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgcmV0dXJuIHtcbiAgICBtb2RlOiBtb2RlLFxuICAgIG1lc3NhZ2U6IGVycm9yID8gU3RyaW5nKGVycm9yKSA6IG1lc3NhZ2UgfHwgYmFja3VwTWVzc2FnZSxcbiAgICB1cmw6IGhyZWYsXG4gICAgc3RhY2s6IFtsb2NhdGlvbl0sXG4gICAgdXNlcmFnZW50OiB1c2VyYWdlbnQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHdyYXBDYWxsYmFjayhsb2dnZXIsIGYpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICB0cnkge1xuICAgICAgZihlcnIsIHJlc3ApO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihlKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIG5vbkNpcmN1bGFyQ2xvbmUob2JqKSB7XG4gIHZhciBzZWVuID0gW29ial07XG5cbiAgZnVuY3Rpb24gY2xvbmUob2JqLCBzZWVuKSB7XG4gICAgdmFyIHZhbHVlLFxuICAgICAgbmFtZSxcbiAgICAgIG5ld1NlZW4sXG4gICAgICByZXN1bHQgPSB7fTtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKG5hbWUgaW4gb2JqKSB7XG4gICAgICAgIHZhbHVlID0gb2JqW25hbWVdO1xuXG4gICAgICAgIGlmICh2YWx1ZSAmJiAoaXNUeXBlKHZhbHVlLCAnb2JqZWN0JykgfHwgaXNUeXBlKHZhbHVlLCAnYXJyYXknKSkpIHtcbiAgICAgICAgICBpZiAoc2Vlbi5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJlc3VsdFtuYW1lXSA9ICdSZW1vdmVkIGNpcmN1bGFyIHJlZmVyZW5jZTogJyArIHR5cGVOYW1lKHZhbHVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3U2VlbiA9IHNlZW4uc2xpY2UoKTtcbiAgICAgICAgICAgIG5ld1NlZW4ucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICByZXN1bHRbbmFtZV0gPSBjbG9uZSh2YWx1ZSwgbmV3U2Vlbik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0W25hbWVdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmVzdWx0ID0gJ0ZhaWxlZCBjbG9uaW5nIGN1c3RvbSBkYXRhOiAnICsgZS5tZXNzYWdlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHJldHVybiBjbG9uZShvYmosIHNlZW4pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVJdGVtKGFyZ3MsIGxvZ2dlciwgbm90aWZpZXIsIHJlcXVlc3RLZXlzLCBsYW1iZGFDb250ZXh0KSB7XG4gIHZhciBtZXNzYWdlLCBlcnIsIGN1c3RvbSwgY2FsbGJhY2ssIHJlcXVlc3Q7XG4gIHZhciBhcmc7XG4gIHZhciBleHRyYUFyZ3MgPSBbXTtcbiAgdmFyIGRpYWdub3N0aWMgPSB7fTtcbiAgdmFyIGFyZ1R5cGVzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmdzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGFyZyA9IGFyZ3NbaV07XG5cbiAgICB2YXIgdHlwID0gdHlwZU5hbWUoYXJnKTtcbiAgICBhcmdUeXBlcy5wdXNoKHR5cCk7XG4gICAgc3dpdGNoICh0eXApIHtcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgbWVzc2FnZSA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAobWVzc2FnZSA9IGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICBjYWxsYmFjayA9IHdyYXBDYWxsYmFjayhsb2dnZXIsIGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgIGV4dHJhQXJncy5wdXNoKGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZXJyb3InOlxuICAgICAgY2FzZSAnZG9tZXhjZXB0aW9uJzpcbiAgICAgIGNhc2UgJ2V4Y2VwdGlvbic6IC8vIEZpcmVmb3ggRXhjZXB0aW9uIHR5cGVcbiAgICAgICAgZXJyID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChlcnIgPSBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICBjYXNlICdhcnJheSc6XG4gICAgICAgIGlmIChcbiAgICAgICAgICBhcmcgaW5zdGFuY2VvZiBFcnJvciB8fFxuICAgICAgICAgICh0eXBlb2YgRE9NRXhjZXB0aW9uICE9PSAndW5kZWZpbmVkJyAmJiBhcmcgaW5zdGFuY2VvZiBET01FeGNlcHRpb24pXG4gICAgICAgICkge1xuICAgICAgICAgIGVyciA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoZXJyID0gYXJnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVxdWVzdEtleXMgJiYgdHlwID09PSAnb2JqZWN0JyAmJiAhcmVxdWVzdCkge1xuICAgICAgICAgIGZvciAodmFyIGogPSAwLCBsZW4gPSByZXF1ZXN0S2V5cy5sZW5ndGg7IGogPCBsZW47ICsraikge1xuICAgICAgICAgICAgaWYgKGFyZ1tyZXF1ZXN0S2V5c1tqXV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICByZXF1ZXN0ID0gYXJnO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlcXVlc3QpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjdXN0b20gPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGN1c3RvbSA9IGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGFyZyBpbnN0YW5jZW9mIEVycm9yIHx8XG4gICAgICAgICAgKHR5cGVvZiBET01FeGNlcHRpb24gIT09ICd1bmRlZmluZWQnICYmIGFyZyBpbnN0YW5jZW9mIERPTUV4Y2VwdGlvbilcbiAgICAgICAgKSB7XG4gICAgICAgICAgZXJyID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChlcnIgPSBhcmcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGV4dHJhQXJncy5wdXNoKGFyZyk7XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgY3VzdG9tIGlzIGFuIGFycmF5IHRoaXMgdHVybnMgaXQgaW50byBhbiBvYmplY3Qgd2l0aCBpbnRlZ2VyIGtleXNcbiAgaWYgKGN1c3RvbSkgY3VzdG9tID0gbm9uQ2lyY3VsYXJDbG9uZShjdXN0b20pO1xuXG4gIGlmIChleHRyYUFyZ3MubGVuZ3RoID4gMCkge1xuICAgIGlmICghY3VzdG9tKSBjdXN0b20gPSBub25DaXJjdWxhckNsb25lKHt9KTtcbiAgICBjdXN0b20uZXh0cmFBcmdzID0gbm9uQ2lyY3VsYXJDbG9uZShleHRyYUFyZ3MpO1xuICB9XG5cbiAgdmFyIGl0ZW0gPSB7XG4gICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICBlcnI6IGVycixcbiAgICBjdXN0b206IGN1c3RvbSxcbiAgICB0aW1lc3RhbXA6IG5vdygpLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcbiAgICBub3RpZmllcjogbm90aWZpZXIsXG4gICAgZGlhZ25vc3RpYzogZGlhZ25vc3RpYyxcbiAgICB1dWlkOiB1dWlkNCgpLFxuICB9O1xuXG4gIGl0ZW0uZGF0YSA9IGl0ZW0uZGF0YSB8fCB7fTtcblxuICBzZXRDdXN0b21JdGVtS2V5cyhpdGVtLCBjdXN0b20pO1xuXG4gIGlmIChyZXF1ZXN0S2V5cyAmJiByZXF1ZXN0KSB7XG4gICAgaXRlbS5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgfVxuICBpZiAobGFtYmRhQ29udGV4dCkge1xuICAgIGl0ZW0ubGFtYmRhQ29udGV4dCA9IGxhbWJkYUNvbnRleHQ7XG4gIH1cbiAgaXRlbS5fb3JpZ2luYWxBcmdzID0gYXJncztcbiAgaXRlbS5kaWFnbm9zdGljLm9yaWdpbmFsX2FyZ190eXBlcyA9IGFyZ1R5cGVzO1xuICByZXR1cm4gaXRlbTtcbn1cblxuZnVuY3Rpb24gc2V0Q3VzdG9tSXRlbUtleXMoaXRlbSwgY3VzdG9tKSB7XG4gIGlmIChjdXN0b20gJiYgY3VzdG9tLmxldmVsICE9PSB1bmRlZmluZWQpIHtcbiAgICBpdGVtLmxldmVsID0gY3VzdG9tLmxldmVsO1xuICAgIGRlbGV0ZSBjdXN0b20ubGV2ZWw7XG4gIH1cbiAgaWYgKGN1c3RvbSAmJiBjdXN0b20uc2tpcEZyYW1lcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaXRlbS5za2lwRnJhbWVzID0gY3VzdG9tLnNraXBGcmFtZXM7XG4gICAgZGVsZXRlIGN1c3RvbS5za2lwRnJhbWVzO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFkZEVycm9yQ29udGV4dChpdGVtLCBlcnJvcnMpIHtcbiAgdmFyIGN1c3RvbSA9IGl0ZW0uZGF0YS5jdXN0b20gfHwge307XG4gIHZhciBjb250ZXh0QWRkZWQgPSBmYWxzZTtcblxuICB0cnkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXJyb3JzLmxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoZXJyb3JzW2ldLmhhc093blByb3BlcnR5KCdyb2xsYmFyQ29udGV4dCcpKSB7XG4gICAgICAgIGN1c3RvbSA9IG1lcmdlKGN1c3RvbSwgbm9uQ2lyY3VsYXJDbG9uZShlcnJvcnNbaV0ucm9sbGJhckNvbnRleHQpKTtcbiAgICAgICAgY29udGV4dEFkZGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBdm9pZCBhZGRpbmcgYW4gZW1wdHkgb2JqZWN0IHRvIHRoZSBkYXRhLlxuICAgIGlmIChjb250ZXh0QWRkZWQpIHtcbiAgICAgIGl0ZW0uZGF0YS5jdXN0b20gPSBjdXN0b207XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgaXRlbS5kaWFnbm9zdGljLmVycm9yX2NvbnRleHQgPSAnRmFpbGVkOiAnICsgZS5tZXNzYWdlO1xuICB9XG59XG5cbnZhciBURUxFTUVUUllfVFlQRVMgPSBbXG4gICdsb2cnLFxuICAnbmV0d29yaycsXG4gICdkb20nLFxuICAnbmF2aWdhdGlvbicsXG4gICdlcnJvcicsXG4gICdtYW51YWwnLFxuXTtcbnZhciBURUxFTUVUUllfTEVWRUxTID0gWydjcml0aWNhbCcsICdlcnJvcicsICd3YXJuaW5nJywgJ2luZm8nLCAnZGVidWcnXTtcblxuZnVuY3Rpb24gYXJyYXlJbmNsdWRlcyhhcnIsIHZhbCkge1xuICBmb3IgKHZhciBrID0gMDsgayA8IGFyci5sZW5ndGg7ICsraykge1xuICAgIGlmIChhcnJba10gPT09IHZhbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUZWxlbWV0cnlFdmVudChhcmdzKSB7XG4gIHZhciB0eXBlLCBtZXRhZGF0YSwgbGV2ZWw7XG4gIHZhciBhcmc7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmdzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGFyZyA9IGFyZ3NbaV07XG5cbiAgICB2YXIgdHlwID0gdHlwZU5hbWUoYXJnKTtcbiAgICBzd2l0Y2ggKHR5cCkge1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgaWYgKCF0eXBlICYmIGFycmF5SW5jbHVkZXMoVEVMRU1FVFJZX1RZUEVTLCBhcmcpKSB7XG4gICAgICAgICAgdHlwZSA9IGFyZztcbiAgICAgICAgfSBlbHNlIGlmICghbGV2ZWwgJiYgYXJyYXlJbmNsdWRlcyhURUxFTUVUUllfTEVWRUxTLCBhcmcpKSB7XG4gICAgICAgICAgbGV2ZWwgPSBhcmc7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBtZXRhZGF0YSA9IGFyZztcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgdmFyIGV2ZW50ID0ge1xuICAgIHR5cGU6IHR5cGUgfHwgJ21hbnVhbCcsXG4gICAgbWV0YWRhdGE6IG1ldGFkYXRhIHx8IHt9LFxuICAgIGxldmVsOiBsZXZlbCxcbiAgfTtcblxuICByZXR1cm4gZXZlbnQ7XG59XG5cbmZ1bmN0aW9uIGFkZEl0ZW1BdHRyaWJ1dGVzKGl0ZW0sIGF0dHJpYnV0ZXMpIHtcbiAgaXRlbS5kYXRhLmF0dHJpYnV0ZXMgPSBpdGVtLmRhdGEuYXR0cmlidXRlcyB8fCBbXTtcbiAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICBpdGVtLmRhdGEuYXR0cmlidXRlcy5wdXNoKC4uLmF0dHJpYnV0ZXMpO1xuICB9XG59XG5cbi8qXG4gKiBnZXQgLSBnaXZlbiBhbiBvYmovYXJyYXkgYW5kIGEga2V5cGF0aCwgcmV0dXJuIHRoZSB2YWx1ZSBhdCB0aGF0IGtleXBhdGggb3JcbiAqICAgICAgIHVuZGVmaW5lZCBpZiBub3QgcG9zc2libGUuXG4gKlxuICogQHBhcmFtIG9iaiAtIGFuIG9iamVjdCBvciBhcnJheVxuICogQHBhcmFtIHBhdGggLSBhIHN0cmluZyBvZiBrZXlzIHNlcGFyYXRlZCBieSAnLicgc3VjaCBhcyAncGx1Z2luLmpxdWVyeS4wLm1lc3NhZ2UnXG4gKiAgICB3aGljaCB3b3VsZCBjb3JyZXNwb25kIHRvIDQyIGluIGB7cGx1Z2luOiB7anF1ZXJ5OiBbe21lc3NhZ2U6IDQyfV19fWBcbiAqL1xuZnVuY3Rpb24gZ2V0KG9iaiwgcGF0aCkge1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgdmFyIGtleXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gIHZhciByZXN1bHQgPSBvYmo7XG4gIHRyeSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGtleXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdFtrZXlzW2ldXTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gc2V0KG9iaiwgcGF0aCwgdmFsdWUpIHtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGtleXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gIHZhciBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgaWYgKGxlbiA8IDEpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGxlbiA9PT0gMSkge1xuICAgIG9ialtrZXlzWzBdXSA9IHZhbHVlO1xuICAgIHJldHVybjtcbiAgfVxuICB0cnkge1xuICAgIHZhciB0ZW1wID0gb2JqW2tleXNbMF1dIHx8IHt9O1xuICAgIHZhciByZXBsYWNlbWVudCA9IHRlbXA7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW4gLSAxOyArK2kpIHtcbiAgICAgIHRlbXBba2V5c1tpXV0gPSB0ZW1wW2tleXNbaV1dIHx8IHt9O1xuICAgICAgdGVtcCA9IHRlbXBba2V5c1tpXV07XG4gICAgfVxuICAgIHRlbXBba2V5c1tsZW4gLSAxXV0gPSB2YWx1ZTtcbiAgICBvYmpba2V5c1swXV0gPSByZXBsYWNlbWVudDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybjtcbiAgfVxufVxuXG5mdW5jdGlvbiBmb3JtYXRBcmdzQXNTdHJpbmcoYXJncykge1xuICB2YXIgaSwgbGVuLCBhcmc7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yIChpID0gMCwgbGVuID0gYXJncy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIGFyZyA9IGFyZ3NbaV07XG4gICAgc3dpdGNoICh0eXBlTmFtZShhcmcpKSB7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBhcmcgPSBzdHJpbmdpZnkoYXJnKTtcbiAgICAgICAgYXJnID0gYXJnLmVycm9yIHx8IGFyZy52YWx1ZTtcbiAgICAgICAgaWYgKGFyZy5sZW5ndGggPiA1MDApIHtcbiAgICAgICAgICBhcmcgPSBhcmcuc3Vic3RyKDAsIDQ5NykgKyAnLi4uJztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ251bGwnOlxuICAgICAgICBhcmcgPSAnbnVsbCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgYXJnID0gJ3VuZGVmaW5lZCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3ltYm9sJzpcbiAgICAgICAgYXJnID0gYXJnLnRvU3RyaW5nKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXN1bHQucHVzaChhcmcpO1xuICB9XG4gIHJldHVybiByZXN1bHQuam9pbignICcpO1xufVxuXG5mdW5jdGlvbiBub3coKSB7XG4gIGlmIChEYXRlLm5vdykge1xuICAgIHJldHVybiArRGF0ZS5ub3coKTtcbiAgfVxuICByZXR1cm4gK25ldyBEYXRlKCk7XG59XG5cbmZ1bmN0aW9uIGZpbHRlcklwKHJlcXVlc3REYXRhLCBjYXB0dXJlSXApIHtcbiAgaWYgKCFyZXF1ZXN0RGF0YSB8fCAhcmVxdWVzdERhdGFbJ3VzZXJfaXAnXSB8fCBjYXB0dXJlSXAgPT09IHRydWUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG5ld0lwID0gcmVxdWVzdERhdGFbJ3VzZXJfaXAnXTtcbiAgaWYgKCFjYXB0dXJlSXApIHtcbiAgICBuZXdJcCA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBwYXJ0cztcbiAgICAgIGlmIChuZXdJcC5pbmRleE9mKCcuJykgIT09IC0xKSB7XG4gICAgICAgIHBhcnRzID0gbmV3SXAuc3BsaXQoJy4nKTtcbiAgICAgICAgcGFydHMucG9wKCk7XG4gICAgICAgIHBhcnRzLnB1c2goJzAnKTtcbiAgICAgICAgbmV3SXAgPSBwYXJ0cy5qb2luKCcuJyk7XG4gICAgICB9IGVsc2UgaWYgKG5ld0lwLmluZGV4T2YoJzonKSAhPT0gLTEpIHtcbiAgICAgICAgcGFydHMgPSBuZXdJcC5zcGxpdCgnOicpO1xuICAgICAgICBpZiAocGFydHMubGVuZ3RoID4gMikge1xuICAgICAgICAgIHZhciBiZWdpbm5pbmcgPSBwYXJ0cy5zbGljZSgwLCAzKTtcbiAgICAgICAgICB2YXIgc2xhc2hJZHggPSBiZWdpbm5pbmdbMl0uaW5kZXhPZignLycpO1xuICAgICAgICAgIGlmIChzbGFzaElkeCAhPT0gLTEpIHtcbiAgICAgICAgICAgIGJlZ2lubmluZ1syXSA9IGJlZ2lubmluZ1syXS5zdWJzdHJpbmcoMCwgc2xhc2hJZHgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdGVybWluYWwgPSAnMDAwMDowMDAwOjAwMDA6MDAwMDowMDAwJztcbiAgICAgICAgICBuZXdJcCA9IGJlZ2lubmluZy5jb25jYXQodGVybWluYWwpLmpvaW4oJzonKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3SXAgPSBudWxsO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIG5ld0lwID0gbnVsbDtcbiAgICB9XG4gIH1cbiAgcmVxdWVzdERhdGFbJ3VzZXJfaXAnXSA9IG5ld0lwO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVPcHRpb25zKGN1cnJlbnQsIGlucHV0LCBwYXlsb2FkLCBsb2dnZXIpIHtcbiAgdmFyIHJlc3VsdCA9IG1lcmdlKGN1cnJlbnQsIGlucHV0LCBwYXlsb2FkKTtcbiAgcmVzdWx0ID0gdXBkYXRlRGVwcmVjYXRlZE9wdGlvbnMocmVzdWx0LCBsb2dnZXIpO1xuICBpZiAoIWlucHV0IHx8IGlucHV0Lm92ZXJ3cml0ZVNjcnViRmllbGRzKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBpZiAoaW5wdXQuc2NydWJGaWVsZHMpIHtcbiAgICByZXN1bHQuc2NydWJGaWVsZHMgPSAoY3VycmVudC5zY3J1YkZpZWxkcyB8fCBbXSkuY29uY2F0KGlucHV0LnNjcnViRmllbGRzKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiB1cGRhdGVEZXByZWNhdGVkT3B0aW9ucyhvcHRpb25zLCBsb2dnZXIpIHtcbiAgaWYgKG9wdGlvbnMuaG9zdFdoaXRlTGlzdCAmJiAhb3B0aW9ucy5ob3N0U2FmZUxpc3QpIHtcbiAgICBvcHRpb25zLmhvc3RTYWZlTGlzdCA9IG9wdGlvbnMuaG9zdFdoaXRlTGlzdDtcbiAgICBvcHRpb25zLmhvc3RXaGl0ZUxpc3QgPSB1bmRlZmluZWQ7XG4gICAgbG9nZ2VyICYmIGxvZ2dlci5sb2coJ2hvc3RXaGl0ZUxpc3QgaXMgZGVwcmVjYXRlZC4gVXNlIGhvc3RTYWZlTGlzdC4nKTtcbiAgfVxuICBpZiAob3B0aW9ucy5ob3N0QmxhY2tMaXN0ICYmICFvcHRpb25zLmhvc3RCbG9ja0xpc3QpIHtcbiAgICBvcHRpb25zLmhvc3RCbG9ja0xpc3QgPSBvcHRpb25zLmhvc3RCbGFja0xpc3Q7XG4gICAgb3B0aW9ucy5ob3N0QmxhY2tMaXN0ID0gdW5kZWZpbmVkO1xuICAgIGxvZ2dlciAmJiBsb2dnZXIubG9nKCdob3N0QmxhY2tMaXN0IGlzIGRlcHJlY2F0ZWQuIFVzZSBob3N0QmxvY2tMaXN0LicpO1xuICB9XG4gIHJldHVybiBvcHRpb25zO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGg6IGFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoLFxuICBjcmVhdGVJdGVtOiBjcmVhdGVJdGVtLFxuICBhZGRFcnJvckNvbnRleHQ6IGFkZEVycm9yQ29udGV4dCxcbiAgY3JlYXRlVGVsZW1ldHJ5RXZlbnQ6IGNyZWF0ZVRlbGVtZXRyeUV2ZW50LFxuICBhZGRJdGVtQXR0cmlidXRlczogYWRkSXRlbUF0dHJpYnV0ZXMsXG4gIGZpbHRlcklwOiBmaWx0ZXJJcCxcbiAgZm9ybWF0QXJnc0FzU3RyaW5nOiBmb3JtYXRBcmdzQXNTdHJpbmcsXG4gIGZvcm1hdFVybDogZm9ybWF0VXJsLFxuICBnZXQ6IGdldCxcbiAgaGFuZGxlT3B0aW9uczogaGFuZGxlT3B0aW9ucyxcbiAgaXNFcnJvcjogaXNFcnJvcixcbiAgaXNGaW5pdGVOdW1iZXI6IGlzRmluaXRlTnVtYmVyLFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICBpc0l0ZXJhYmxlOiBpc0l0ZXJhYmxlLFxuICBpc05hdGl2ZUZ1bmN0aW9uOiBpc05hdGl2ZUZ1bmN0aW9uLFxuICBpc09iamVjdDogaXNPYmplY3QsXG4gIGlzU3RyaW5nOiBpc1N0cmluZyxcbiAgaXNUeXBlOiBpc1R5cGUsXG4gIGlzUHJvbWlzZTogaXNQcm9taXNlLFxuICBpc0Jyb3dzZXI6IGlzQnJvd3NlcixcbiAganNvblBhcnNlOiBqc29uUGFyc2UsXG4gIExFVkVMUzogTEVWRUxTLFxuICBtYWtlVW5oYW5kbGVkU3RhY2tJbmZvOiBtYWtlVW5oYW5kbGVkU3RhY2tJbmZvLFxuICBtZXJnZTogbWVyZ2UsXG4gIG5vdzogbm93LFxuICByZWRhY3Q6IHJlZGFjdCxcbiAgUm9sbGJhckpTT046IFJvbGxiYXJKU09OLFxuICBzYW5pdGl6ZVVybDogc2FuaXRpemVVcmwsXG4gIHNldDogc2V0LFxuICBzZXR1cEpTT046IHNldHVwSlNPTixcbiAgc3RyaW5naWZ5OiBzdHJpbmdpZnksXG4gIG1heEJ5dGVTaXplOiBtYXhCeXRlU2l6ZSxcbiAgdHlwZU5hbWU6IHR5cGVOYW1lLFxuICB1dWlkNDogdXVpZDQsXG59O1xuIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsaXR5Jyk7XG5cbmZ1bmN0aW9uIHRyYXZlcnNlKG9iaiwgZnVuYywgc2Vlbikge1xuICB2YXIgaywgdiwgaTtcbiAgdmFyIGlzT2JqID0gXy5pc1R5cGUob2JqLCAnb2JqZWN0Jyk7XG4gIHZhciBpc0FycmF5ID0gXy5pc1R5cGUob2JqLCAnYXJyYXknKTtcbiAgdmFyIGtleXMgPSBbXTtcbiAgdmFyIHNlZW5JbmRleDtcblxuICAvLyBCZXN0IG1pZ2h0IGJlIHRvIHVzZSBNYXAgaGVyZSB3aXRoIGBvYmpgIGFzIHRoZSBrZXlzLCBidXQgd2Ugd2FudCB0byBzdXBwb3J0IElFIDwgMTEuXG4gIHNlZW4gPSBzZWVuIHx8IHsgb2JqOiBbXSwgbWFwcGVkOiBbXSB9O1xuXG4gIGlmIChpc09iaikge1xuICAgIHNlZW5JbmRleCA9IHNlZW4ub2JqLmluZGV4T2Yob2JqKTtcblxuICAgIGlmIChpc09iaiAmJiBzZWVuSW5kZXggIT09IC0xKSB7XG4gICAgICAvLyBQcmVmZXIgdGhlIG1hcHBlZCBvYmplY3QgaWYgdGhlcmUgaXMgb25lLlxuICAgICAgcmV0dXJuIHNlZW4ubWFwcGVkW3NlZW5JbmRleF0gfHwgc2Vlbi5vYmpbc2VlbkluZGV4XTtcbiAgICB9XG5cbiAgICBzZWVuLm9iai5wdXNoKG9iaik7XG4gICAgc2VlbkluZGV4ID0gc2Vlbi5vYmoubGVuZ3RoIC0gMTtcbiAgfVxuXG4gIGlmIChpc09iaikge1xuICAgIGZvciAoayBpbiBvYmopIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrKSkge1xuICAgICAgICBrZXlzLnB1c2goayk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzQXJyYXkpIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgb2JqLmxlbmd0aDsgKytpKSB7XG4gICAgICBrZXlzLnB1c2goaSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIHJlc3VsdCA9IGlzT2JqID8ge30gOiBbXTtcbiAgdmFyIHNhbWUgPSB0cnVlO1xuICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgIGsgPSBrZXlzW2ldO1xuICAgIHYgPSBvYmpba107XG4gICAgcmVzdWx0W2tdID0gZnVuYyhrLCB2LCBzZWVuKTtcbiAgICBzYW1lID0gc2FtZSAmJiByZXN1bHRba10gPT09IG9ialtrXTtcbiAgfVxuXG4gIGlmIChpc09iaiAmJiAhc2FtZSkge1xuICAgIHNlZW4ubWFwcGVkW3NlZW5JbmRleF0gPSByZXN1bHQ7XG4gIH1cblxuICByZXR1cm4gIXNhbWUgPyByZXN1bHQgOiBvYmo7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHJhdmVyc2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xudmFyIHZvd3MgPSByZXF1aXJlKCd2b3dzJyk7XG52YXIgVHJhbnNwb3J0ID0gcmVxdWlyZSgnLi4vc3JjL3NlcnZlci90cmFuc3BvcnQnKTtcbnZhciB0ID0gbmV3IFRyYW5zcG9ydCgpO1xuXG52b3dzXG4gIC5kZXNjcmliZSgndHJhbnNwb3J0JylcbiAgLmFkZEJhdGNoKHtcbiAgICBwb3N0OiB7XG4gICAgICAnYmFzZSBkYXRhJzoge1xuICAgICAgICB0b3BpYzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhY2Nlc3NUb2tlbjogJ2FiYzEyMycsXG4gICAgICAgICAgICBvcHRpb25zOiB7fSxcbiAgICAgICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiAnYWJjMTIzJyxcbiAgICAgICAgICAgICAgZGF0YTogeyBhOiAxIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgICd3aXRoIG5vIHBheWxvYWQnOiB7XG4gICAgICAgICAgdG9waWM6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICB2YXIgZmFjdG9yeSA9IHRyYW5zcG9ydEZhY3RvcnkoXG4gICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICd7XCJlcnJcIjogbnVsbCwgXCJyZXN1bHRcIjpcImFsbCBnb29kXCJ9JyxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0LnBvc3QoXG4gICAgICAgICAgICAgIGRhdGEuYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgIGRhdGEub3B0aW9ucyxcbiAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgdGhpcy5jYWxsYmFjayxcbiAgICAgICAgICAgICAgZmFjdG9yeSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAnc2hvdWxkIGhhdmUgYW4gZXJyb3InOiBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICAgICAgICBhc3NlcnQub2soZXJyKTtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnd2l0aCBhIHBheWxvYWQgYW5kIG5vIGVycm9yJzoge1xuICAgICAgICAgIHRvcGljOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgdmFyIGZhY3RvcnkgPSB0cmFuc3BvcnRGYWN0b3J5KFxuICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAne1wiZXJyXCI6IG51bGwsIFwicmVzdWx0XCI6e1widXVpZFwiOlwiNDJkZWZcIiwgXCJtZXNzYWdlXCI6XCJhbGwgZ29vZFwifX0nLFxuICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKFxuICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddLFxuICAgICAgICAgICAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgYXNzZXJ0LmlzTnVtYmVyKHRoaXMub3B0aW9ucy5oZWFkZXJzWydDb250ZW50LUxlbmd0aCddKTtcbiAgICAgICAgICAgICAgICBhc3NlcnQodGhpcy5vcHRpb25zLmhlYWRlcnNbJ0NvbnRlbnQtTGVuZ3RoJ10gPiAwKTtcbiAgICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoXG4gICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuaGVhZGVyc1snWC1Sb2xsYmFyLUFjY2Vzcy1Ub2tlbiddLFxuICAgICAgICAgICAgICAgICAgZGF0YS5hY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHQucG9zdChcbiAgICAgICAgICAgICAgZGF0YS5hY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgZGF0YS5vcHRpb25zLFxuICAgICAgICAgICAgICBkYXRhLnBheWxvYWQsXG4gICAgICAgICAgICAgIHRoaXMuY2FsbGJhY2ssXG4gICAgICAgICAgICAgIGZhY3RvcnksXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgJ3Nob3VsZCBub3QgZXJyb3InOiBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICAgICAgICBhc3NlcnQuaWZFcnJvcihlcnIpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgJ3Nob3VsZCBoYXZlIHRoZSByaWdodCByZXNwb25zZSBkYXRhJzogZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3AubWVzc2FnZSwgJ2FsbCBnb29kJyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ3dpdGggYSBwYXlsb2FkIGFuZCBhbiBlcnJvciBpbiB0aGUgcmVzcG9uc2UnOiB7XG4gICAgICAgICAgdG9waWM6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICB2YXIgZmFjdG9yeSA9IHRyYW5zcG9ydEZhY3RvcnkoXG4gICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICd7XCJlcnJcIjogXCJib3JrXCIsIFwibWVzc2FnZVwiOlwidGhpbmdzIGJyb2tlXCJ9JyxcbiAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGFzc2VydC5lcXVhbChcbiAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5oZWFkZXJzWydDb250ZW50LVR5cGUnXSxcbiAgICAgICAgICAgICAgICAgICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGFzc2VydC5pc051bWJlcih0aGlzLm9wdGlvbnMuaGVhZGVyc1snQ29udGVudC1MZW5ndGgnXSk7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KHRoaXMub3B0aW9ucy5oZWFkZXJzWydDb250ZW50LUxlbmd0aCddID4gMCk7XG4gICAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKFxuICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmhlYWRlcnNbJ1gtUm9sbGJhci1BY2Nlc3MtVG9rZW4nXSxcbiAgICAgICAgICAgICAgICAgIGRhdGEuYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0LnBvc3QoXG4gICAgICAgICAgICAgIGRhdGEuYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgIGRhdGEub3B0aW9ucyxcbiAgICAgICAgICAgICAgZGF0YS5wYXlsb2FkLFxuICAgICAgICAgICAgICB0aGlzLmNhbGxiYWNrLFxuICAgICAgICAgICAgICBmYWN0b3J5LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgICdzaG91bGQgZXJyb3InOiBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICAgICAgICBhc3NlcnQub2soZXJyKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgICdzaG91bGQgaGF2ZSB0aGUgbWVzc2FnZSBzb21ld2hlcmUnOiBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICAgICAgICBhc3NlcnQubWF0Y2goZXJyLm1lc3NhZ2UsIC90aGluZ3MgYnJva2UvKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgICdzaG91bGQgbm90IGhhdmUgYSByZXNwb25zZSc6IGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgICAgICAgIGFzc2VydC5pZkVycm9yKHJlc3ApO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgICd3aXRoIGEgcGF5bG9hZCBhbmQgYW4gZXJyb3IgZHVyaW5nIHNlbmRpbmcnOiB7XG4gICAgICAgICAgdG9waWM6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICB2YXIgZmFjdG9yeSA9IHRyYW5zcG9ydEZhY3RvcnkoXG4gICAgICAgICAgICAgIG5ldyBFcnJvcignYm9yaycpLFxuICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKFxuICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddLFxuICAgICAgICAgICAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgYXNzZXJ0LmlzTnVtYmVyKHRoaXMub3B0aW9ucy5oZWFkZXJzWydDb250ZW50LUxlbmd0aCddKTtcbiAgICAgICAgICAgICAgICBhc3NlcnQodGhpcy5vcHRpb25zLmhlYWRlcnNbJ0NvbnRlbnQtTGVuZ3RoJ10gPiAwKTtcbiAgICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoXG4gICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuaGVhZGVyc1snWC1Sb2xsYmFyLUFjY2Vzcy1Ub2tlbiddLFxuICAgICAgICAgICAgICAgICAgZGF0YS5hY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHQucG9zdChcbiAgICAgICAgICAgICAgZGF0YS5hY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgZGF0YS5vcHRpb25zLFxuICAgICAgICAgICAgICBkYXRhLnBheWxvYWQsXG4gICAgICAgICAgICAgIHRoaXMuY2FsbGJhY2ssXG4gICAgICAgICAgICAgIGZhY3RvcnksXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgJ3Nob3VsZCBlcnJvcic6IGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgICAgICAgIGFzc2VydC5vayhlcnIpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgJ3Nob3VsZCBoYXZlIHRoZSBtZXNzYWdlIHNvbWV3aGVyZSc6IGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgICAgICAgIGFzc2VydC5tYXRjaChlcnIubWVzc2FnZSwgL2JvcmsvKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgICdzaG91bGQgbm90IGhhdmUgYSByZXNwb25zZSc6IGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgICAgICAgIGFzc2VydC5pZkVycm9yKHJlc3ApO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgJ3dpdGggcmF0ZSBsaW1pdGluZyc6IHtcbiAgICAgICAgdG9waWM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFRyYW5zcG9ydCgpO1xuICAgICAgICB9LFxuICAgICAgICAnc2hvdWxkIHRyYW5zbWl0IG5vbi1yYXRlIGxpbWl0ZWQgcmVxdWVzdHMnOiBmdW5jdGlvbiAodCkge1xuICAgICAgICAgIHZhciByZXNwb25zZSA9IG5ldyBUZXN0UmVzcG9uc2Uoe1xuICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAwLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAneC1yYXRlLWxpbWl0LXJlbWFpbmluZyc6ICcxJyxcbiAgICAgICAgICAgICAgJ3gtcmF0ZS1saW1pdC1yZW1haW5pbmctc2Vjb25kcyc6ICcxMDAnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB2YXIgZXJyb3I7XG5cbiAgICAgICAgICBhc3NlcnQuZXF1YWwodC5yYXRlTGltaXRFeHBpcmVzLCAwKTtcblxuICAgICAgICAgIHQuaGFuZGxlUmVzcG9uc2UocmVzcG9uc2UpO1xuXG4gICAgICAgICAgdmFyIGZhY3RvcnkgPSB0cmFuc3BvcnRGYWN0b3J5KFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICd7XCJlcnJcIjogbnVsbCwgXCJyZXN1bHRcIjogXCJhbGwgZ29vZFwifScsXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0LnBvc3QoXG4gICAgICAgICAgICAndG9rZW4nLFxuICAgICAgICAgICAge30sXG4gICAgICAgICAgICAncGF5bG9hZCcsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgIGVycm9yID0gZXJyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZhY3RvcnksXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGFzc2VydC5lcXVhbChlcnJvciwgbnVsbCk7XG4gICAgICAgICAgYXNzZXJ0LmlzVHJ1ZShNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKSA+PSB0LnJhdGVMaW1pdEV4cGlyZXMpO1xuICAgICAgICB9LFxuICAgICAgICAnc2hvdWxkIGRyb3AgcmF0ZSBsaW1pdGVkIHJlcXVlc3RzIGFuZCBzZXQgdGltZW91dCc6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgdmFyIHJlc3BvbnNlID0gbmV3IFRlc3RSZXNwb25zZSh7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MjksXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICd4LXJhdGUtbGltaXQtcmVtYWluaW5nJzogJzAnLFxuICAgICAgICAgICAgICAneC1yYXRlLWxpbWl0LXJlbWFpbmluZy1zZWNvbmRzJzogJzEwMCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHZhciBlcnJvcjtcblxuICAgICAgICAgIHQuaGFuZGxlUmVzcG9uc2UocmVzcG9uc2UpO1xuXG4gICAgICAgICAgdC5wb3N0KCd0b2tlbicsIHt9LCAncGF5bG9hZCcsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGVycm9yID0gZXJyO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgYXNzZXJ0Lm1hdGNoKGVycm9yLm1lc3NhZ2UsIC9FeGNlZWRlZCByYXRlIGxpbWl0Lyk7XG4gICAgICAgICAgYXNzZXJ0LmlzVHJ1ZShNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKSA8IHQucmF0ZUxpbWl0RXhwaXJlcyk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pXG4gIC5leHBvcnQobW9kdWxlLCB7IGVycm9yOiBmYWxzZSB9KTtcblxudmFyIFRlc3RUcmFuc3BvcnQgPSBmdW5jdGlvbiAob3B0aW9ucywgZXJyb3IsIHJlc3BvbnNlLCBhc3NlcnRpb25zKSB7XG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIHRoaXMuZXJyb3IgPSBlcnJvcjtcbiAgdGhpcy5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICB0aGlzLnJlcXVlc3RPcHRzID0gbnVsbDtcbiAgdGhpcy5yZXF1ZXN0Q2FsbGJhY2sgPSBudWxsO1xuICB0aGlzLmFzc2VydGlvbnMgPSBhc3NlcnRpb25zO1xufTtcbnZhciBUZXN0UmVxdWVzdCA9IGZ1bmN0aW9uIChlcnJvciwgcmVzcG9uc2UsIHRyYW5zcG9ydCkge1xuICB0aGlzLmVycm9yID0gZXJyb3I7XG4gIHRoaXMucmVzcG9uc2VEYXRhID0gcmVzcG9uc2U7XG4gIHRoaXMuZGF0YSA9IFtdO1xuICB0aGlzLmV2ZW50cyA9IHt9O1xuICB0aGlzLnRyYW5zcG9ydCA9IHRyYW5zcG9ydDtcbiAgdGhpcy5yZXNwb25zZSA9IG51bGw7XG59O1xuVGVzdFRyYW5zcG9ydC5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIChvcHRzLCBjYikge1xuICB0aGlzLnJlcXVlc3RPcHRzID0gb3B0cztcbiAgdGhpcy5yZXF1ZXN0Q2FsbGJhY2sgPSBjYjtcbiAgcmV0dXJuIG5ldyBUZXN0UmVxdWVzdCh0aGlzLmVycm9yLCB0aGlzLnJlc3BvbnNlLCB0aGlzKTtcbn07XG5UZXN0UmVxdWVzdC5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xuICB0aGlzLmRhdGEucHVzaChkYXRhKTtcbn07XG5UZXN0UmVxdWVzdC5wcm90b3R5cGUub24gPSBmdW5jdGlvbiAoZXZlbnQsIGNiKSB7XG4gIHRoaXMuZXZlbnRzW2V2ZW50XSA9IGNiO1xufTtcblRlc3RSZXF1ZXN0LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLnRyYW5zcG9ydC5hc3NlcnRpb25zKSB7XG4gICAgdGhpcy50cmFuc3BvcnQuYXNzZXJ0aW9ucygpO1xuICB9XG4gIGlmICh0aGlzLmVycm9yKSB7XG4gICAgaWYgKHRoaXMuZXZlbnRzWydlcnJvciddKSB7XG4gICAgICB0aGlzLmV2ZW50c1snZXJyb3InXSh0aGlzLmVycm9yKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5yZXNwb25zZSA9IG5ldyBUZXN0UmVzcG9uc2UoKTtcbiAgICB0aGlzLnRyYW5zcG9ydC5yZXF1ZXN0Q2FsbGJhY2sodGhpcy5yZXNwb25zZSk7XG4gICAgaWYgKHRoaXMucmVzcG9uc2UuZXZlbnRzWydkYXRhJ10pIHtcbiAgICAgIHRoaXMucmVzcG9uc2UuZXZlbnRzWydkYXRhJ10odGhpcy5yZXNwb25zZURhdGEpO1xuICAgIH1cbiAgICBpZiAodGhpcy5yZXNwb25zZS5ldmVudHNbJ2VuZCddKSB7XG4gICAgICB0aGlzLnJlc3BvbnNlLmV2ZW50c1snZW5kJ10oKTtcbiAgICB9XG4gIH1cbn07XG52YXIgVGVzdFJlc3BvbnNlID0gZnVuY3Rpb24gKG9wdGlvbnMgPSB7fSkge1xuICB0aGlzLmVuY29kaW5nID0gbnVsbDtcbiAgdGhpcy5ldmVudHMgPSB7fTtcbiAgdGhpcy5oZWFkZXJzID0gb3B0aW9ucy5oZWFkZXJzIHx8IHt9O1xuICB0aGlzLnN0YXR1c0NvZGUgPSBvcHRpb25zLnN0YXR1c0NvZGUgfHwgMjAwO1xufTtcblRlc3RSZXNwb25zZS5wcm90b3R5cGUuc2V0RW5jb2RpbmcgPSBmdW5jdGlvbiAocykge1xuICB0aGlzLmVuY29kaW5nID0gcztcbn07XG5UZXN0UmVzcG9uc2UucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGV2ZW50LCBjYikge1xuICB0aGlzLmV2ZW50c1tldmVudF0gPSBjYjtcbn07XG52YXIgdHJhbnNwb3J0RmFjdG9yeSA9IGZ1bmN0aW9uIChlcnJvciwgcmVzcG9uc2UsIGFzc2VydGlvbnMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBUZXN0VHJhbnNwb3J0KG9wdGlvbnMsIGVycm9yLCByZXNwb25zZSwgYXNzZXJ0aW9ucyk7XG4gIH07XG59O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0bG9hZGVkOiBmYWxzZSxcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG5cdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbl9fd2VicGFja19yZXF1aXJlX18uYyA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfXztcblxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5ubWQgPSAobW9kdWxlKSA9PiB7XG5cdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdHJldHVybiBtb2R1bGU7XG59OyIsIiIsIi8vIG1vZHVsZSBjYWNoZSBhcmUgdXNlZCBzbyBlbnRyeSBpbmxpbmluZyBpcyBkaXNhYmxlZFxuLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3Rlc3Qvc2VydmVyLnRyYW5zcG9ydC50ZXN0LmpzXCIpO1xuIiwiIl0sIm5hbWVzIjpbImhhc093biIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwidG9TdHIiLCJ0b1N0cmluZyIsImlzUGxhaW5PYmplY3QiLCJvYmoiLCJjYWxsIiwiaGFzT3duQ29uc3RydWN0b3IiLCJoYXNJc1Byb3RvdHlwZU9mIiwiY29uc3RydWN0b3IiLCJrZXkiLCJtZXJnZSIsImkiLCJzcmMiLCJjb3B5IiwiY2xvbmUiLCJuYW1lIiwicmVzdWx0IiwiY3VycmVudCIsImxlbmd0aCIsImFyZ3VtZW50cyIsIm1vZHVsZSIsImV4cG9ydHMiLCJ2ZXJib3NlIiwibG9nZ2VyIiwibG9nIiwiY29uc29sZSIsImFwcGx5IiwiZXJyb3IiLCJzZXRWZXJib3NlIiwidmFsIiwiXyIsInJlcXVpcmUiLCJ0cnVuY2F0aW9uIiwiaHR0cCIsImh0dHBzIiwianNvbkJhY2t1cCIsIk1BWF9SQVRFX0xJTUlUX0lOVEVSVkFMIiwiVHJhbnNwb3J0IiwicmF0ZUxpbWl0RXhwaXJlcyIsImdldCIsImFjY2Vzc1Rva2VuIiwib3B0aW9ucyIsInBhcmFtcyIsImNhbGxiYWNrIiwidHJhbnNwb3J0RmFjdG9yeSIsInQiLCJpc0Z1bmN0aW9uIiwiYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGgiLCJoZWFkZXJzIiwiX2hlYWRlcnMiLCJfdHJhbnNwb3J0IiwicHJvdG9jb2wiLCJFcnJvciIsInJlcSIsInJlcXVlc3QiLCJyZXNwIiwiaGFuZGxlUmVzcG9uc2UiLCJiaW5kIiwib24iLCJlcnIiLCJlbmQiLCJwb3N0IiwicGF5bG9hZCIsIl9jdXJyZW50VGltZSIsInN0cmluZ2lmeVJlc3VsdCIsInRydW5jYXRlIiwid3JpdGVEYXRhIiwidmFsdWUiLCJfd3JhcFBvc3RDYWxsYmFjayIsIndyaXRlIiwidXBkYXRlUmF0ZUxpbWl0IiwicmVtYWluaW5nIiwicGFyc2VJbnQiLCJyZW1haW5pbmdTZWNvbmRzIiwiTWF0aCIsIm1pbiIsImN1cnJlbnRUaW1lIiwic3RhdHVzQ29kZSIsInJlc3BEYXRhIiwic2V0RW5jb2RpbmciLCJjaHVuayIsInB1c2giLCJqb2luIiwiX3BhcnNlQXBpUmVzcG9uc2UiLCJkYXRhIiwiQnVmZmVyIiwiYnl0ZUxlbmd0aCIsImUiLCJwYXJzZWREYXRhIiwianNvblBhcnNlIiwibWVzc2FnZSIsInV1aWQiLCJmbG9vciIsIkRhdGUiLCJub3ciLCJ0cmF2ZXJzZSIsInJhdyIsInN0cmluZ2lmeSIsInNlbGVjdEZyYW1lcyIsImZyYW1lcyIsInJhbmdlIiwibGVuIiwic2xpY2UiLCJjb25jYXQiLCJ0cnVuY2F0ZUZyYW1lcyIsImJvZHkiLCJ0cmFjZV9jaGFpbiIsImNoYWluIiwidHJhY2UiLCJtYXliZVRydW5jYXRlVmFsdWUiLCJ0cnVuY2F0ZVN0cmluZ3MiLCJ0cnVuY2F0b3IiLCJrIiwidiIsInNlZW4iLCJ0eXBlTmFtZSIsInRydW5jYXRlVHJhY2VEYXRhIiwidHJhY2VEYXRhIiwiZXhjZXB0aW9uIiwiZGVzY3JpcHRpb24iLCJtaW5Cb2R5IiwibmVlZHNUcnVuY2F0aW9uIiwibWF4U2l6ZSIsIm1heEJ5dGVTaXplIiwic3RyYXRlZ2llcyIsInN0cmF0ZWd5IiwicmVzdWx0cyIsInNoaWZ0IiwiUm9sbGJhckpTT04iLCJzZXR1cEpTT04iLCJwb2x5ZmlsbEpTT04iLCJwYXJzZSIsImlzRGVmaW5lZCIsIkpTT04iLCJpc05hdGl2ZUZ1bmN0aW9uIiwiaXNUeXBlIiwieCIsIl90eXBlb2YiLCJtYXRjaCIsInRvTG93ZXJDYXNlIiwiZiIsInJlUmVnRXhwQ2hhciIsImZ1bmNNYXRjaFN0cmluZyIsIkZ1bmN0aW9uIiwicmVwbGFjZSIsInJlSXNOYXRpdmUiLCJSZWdFeHAiLCJpc09iamVjdCIsInRlc3QiLCJ0eXBlIiwiaXNTdHJpbmciLCJTdHJpbmciLCJpc0Zpbml0ZU51bWJlciIsIm4iLCJOdW1iZXIiLCJpc0Zpbml0ZSIsInUiLCJpc0l0ZXJhYmxlIiwiaXNFcnJvciIsImlzUHJvbWlzZSIsInAiLCJ0aGVuIiwiaXNCcm93c2VyIiwid2luZG93IiwicmVkYWN0IiwidXVpZDQiLCJkIiwiYyIsInIiLCJyYW5kb20iLCJMRVZFTFMiLCJkZWJ1ZyIsImluZm8iLCJ3YXJuaW5nIiwiY3JpdGljYWwiLCJzYW5pdGl6ZVVybCIsInVybCIsImJhc2VVcmxQYXJ0cyIsInBhcnNlVXJpIiwiYW5jaG9yIiwic291cmNlIiwicXVlcnkiLCJwYXJzZVVyaU9wdGlvbnMiLCJzdHJpY3RNb2RlIiwicSIsInBhcnNlciIsInN0cmljdCIsImxvb3NlIiwic3RyIiwidW5kZWZpbmVkIiwibyIsIm0iLCJleGVjIiwidXJpIiwibCIsIiQwIiwiJDEiLCIkMiIsImFjY2Vzc190b2tlbiIsInBhcmFtc0FycmF5Iiwic29ydCIsInBhdGgiLCJxcyIsImluZGV4T2YiLCJoIiwic3Vic3RyaW5nIiwiZm9ybWF0VXJsIiwicG9ydCIsImhvc3RuYW1lIiwiYmFja3VwIiwianNvbkVycm9yIiwiYmFja3VwRXJyb3IiLCJzdHJpbmciLCJjb3VudCIsImNvZGUiLCJjaGFyQ29kZUF0IiwicyIsIm1ha2VVbmhhbmRsZWRTdGFja0luZm8iLCJsaW5lbm8iLCJjb2xubyIsIm1vZGUiLCJiYWNrdXBNZXNzYWdlIiwiZXJyb3JQYXJzZXIiLCJsb2NhdGlvbiIsImxpbmUiLCJjb2x1bW4iLCJmdW5jIiwiZ3Vlc3NGdW5jdGlvbk5hbWUiLCJjb250ZXh0IiwiZ2F0aGVyQ29udGV4dCIsImhyZWYiLCJkb2N1bWVudCIsInVzZXJhZ2VudCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInN0YWNrIiwid3JhcENhbGxiYWNrIiwibm9uQ2lyY3VsYXJDbG9uZSIsIm5ld1NlZW4iLCJpbmNsdWRlcyIsImNyZWF0ZUl0ZW0iLCJhcmdzIiwibm90aWZpZXIiLCJyZXF1ZXN0S2V5cyIsImxhbWJkYUNvbnRleHQiLCJjdXN0b20iLCJhcmciLCJleHRyYUFyZ3MiLCJkaWFnbm9zdGljIiwiYXJnVHlwZXMiLCJ0eXAiLCJET01FeGNlcHRpb24iLCJqIiwiaXRlbSIsInRpbWVzdGFtcCIsInNldEN1c3RvbUl0ZW1LZXlzIiwiX29yaWdpbmFsQXJncyIsIm9yaWdpbmFsX2FyZ190eXBlcyIsImxldmVsIiwic2tpcEZyYW1lcyIsImFkZEVycm9yQ29udGV4dCIsImVycm9ycyIsImNvbnRleHRBZGRlZCIsInJvbGxiYXJDb250ZXh0IiwiZXJyb3JfY29udGV4dCIsIlRFTEVNRVRSWV9UWVBFUyIsIlRFTEVNRVRSWV9MRVZFTFMiLCJhcnJheUluY2x1ZGVzIiwiYXJyIiwiY3JlYXRlVGVsZW1ldHJ5RXZlbnQiLCJtZXRhZGF0YSIsImV2ZW50IiwiYWRkSXRlbUF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVzIiwiX2l0ZW0kZGF0YSRhdHRyaWJ1dGVzIiwiX3RvQ29uc3VtYWJsZUFycmF5Iiwia2V5cyIsInNwbGl0Iiwic2V0IiwidGVtcCIsInJlcGxhY2VtZW50IiwiZm9ybWF0QXJnc0FzU3RyaW5nIiwic3Vic3RyIiwiZmlsdGVySXAiLCJyZXF1ZXN0RGF0YSIsImNhcHR1cmVJcCIsIm5ld0lwIiwicGFydHMiLCJwb3AiLCJiZWdpbm5pbmciLCJzbGFzaElkeCIsInRlcm1pbmFsIiwiaGFuZGxlT3B0aW9ucyIsImlucHV0IiwidXBkYXRlRGVwcmVjYXRlZE9wdGlvbnMiLCJvdmVyd3JpdGVTY3J1YkZpZWxkcyIsInNjcnViRmllbGRzIiwiaG9zdFdoaXRlTGlzdCIsImhvc3RTYWZlTGlzdCIsImhvc3RCbGFja0xpc3QiLCJob3N0QmxvY2tMaXN0IiwiaXNPYmoiLCJpc0FycmF5Iiwic2VlbkluZGV4IiwibWFwcGVkIiwic2FtZSJdLCJzb3VyY2VSb290IjoiIn0=