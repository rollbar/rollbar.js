var extend = require('extend');

/*
 * isType - Given a Javascript value and a string, returns true if the type of the value matches the
 * given string.
 *
 * @param x - any value
 * @param t - a lowercase string containing one of the following type names:
 *    - undefined
 *    - null
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
  var name = typeof x;
  if (name !== 'object') {
    return name;
  }
  if (!x) {
    return 'null';
  }
  return ({}).toString.call(x).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

/* isFunction - a convenience function for checking if a value is a function
 *
 * @param f - any value
 * @returns true if f is a function, otherwise false
 */
function isFunction(f) {
  return isType(f, 'function');
}

/* wrapRollbarFunction - puts a try/catch around a function, logs caught exceptions to console.error
 *
 * @param f - a function
 * @param ctx - an optional context to bind the function to
 */
function wrapRollbarFunction(f, ctx) {
  return function() {
    var self = ctx || this;
    try {
      return f.apply(self, arguments);
    } catch (e) {
      consoleError('[Rollbar]:', e);
    }
  };
}

/*
 * consoleError - safe console.error
 * TODO: Fix this
 */
function consoleError() {
  console.error.apply(null, arguments);
}

function traverse(obj, func) {
  var k;
  var v;
  var i;
  var isObj = isType(obj, 'object');
  var isArray = isType(obj, 'array');
  var keys = [];

  if (isObj) {
    for (k in obj) {
      if (obj.hasOwnProperty(k)) {
        keys.push(k);
      }
    }
  } else if (isArray) {
    for (i = 0; i < obj.length; ++i) {
      keys.push(i);
    }
  }

  for (i = 0; i < keys.length; ++i) {
    k = keys[i];
    v = obj[k];
    obj[k] = func(k, v);
  }

  return obj;
}

function redact(val) {
  return '********';
}

// from http://stackoverflow.com/a/8809472/1138191
function uuid4() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
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

module.exports = {
  isType: isType,
  typeName: typeName,
  isFunction: isFunction,
  extend: extend,
  traverse: traverse,
  redact: redact,
  uuid4: uuid4,
  wrapRollbarFunction: wrapRollbarFunction,
  consoleError: consoleError,
  LEVELS: LEVELS
};

