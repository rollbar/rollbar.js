var extend = require('extend');

var RollbarJSON = {};
var __initRollbarJSON = false;
function setupJSON() {
  if (__initRollbarJSON) {
    return;
  }
  __initRollbarJSON = true;

  if (isDefined(JSON)) {
    if (isFunction(JSON.stringify)) {
      RollbarJSON.stringify = JSON.stringify;
    }
    if (isFunction(JSON.parse)) {
      RollbarJSON.parse = JSON.parse;
    }
  }
  if (!isFunction(RollbarJSON.stringify) || !isFunction(RollbarJSON.parse)) {
    // TODO: use my json3
    var setupCustomJSON = require('../vendor/JSON-js/json2.js');
    setupCustomJSON(RollbarJSON);
  }
}
setupJSON();

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

/*
 * isDefined - a convenience function for checking if a value is not equal to undefined
 *
 * @param u - any value
 * @returns true if u is anything other than undefined
 */
function isDefined(u) {
  return !isType(u, 'undefined');
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
  console.error.apply(console, arguments);
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

function sanitizeUrl(url) {
  var baseUrlParts = parseUri(url);
  // remove a trailing # if there is no anchor
  if (baseUrlParts.anchor === '') {
    baseUrlParts.source = baseUrlParts.source.replace('#', '');
  }

  url = baseUrlParts.source.replace('?' + baseUrlParts.query, '');
  return url;
}

var parseUriOptions = {
  strictMode: false,
  key: [
    'source',
    'protocol',
    'authority',
    'userInfo',
    'user',
    'password',
    'host',
    'port',
    'relative',
    'path',
    'directory',
    'file',
    'query',
    'anchor'
  ],
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
    throw new Error('received invalid input');
  }

  var o = parseUriOptions;
  var m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str);
  var uri = {};
  var i = o.key.length;

  while (i--) {
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
    if (params.hasOwnProperty(k)) {
      paramsArray.push([k, params[k]].join('='));
    }
  }
  var query = '?' + paramsArray.join('&');

  options = options || {};
  options.path = options.path || '';
  var qs = options.path.indexOf('?');
  if (qs !== -1) {
    var p = options.path;
    options.path = p.substring(0,qs) + query + '&' + p.substring(qs+1);
  } else {
    var h = options.path.indexOf('#');
    if (h !== -1) {
      var p = options.path;
      options.path = p.substring(0,h) + query + p.substring(h);
    } else {
      options.path = options.path + query;
    }
  }
}

function formatUrl(u, protocol) {
  protocol = protocol || u.protocol;
  if (!protocol && u.port) {
    if (u.port === 80) {
      protocol = 'http';
    } else if (u.port === 443) {
      protocol = 'https';
    }
  };
  protocol = protocol || 'https';

  if (!u.hostname) {
    return null;
  }
  var result = protocol + '://' + u.hostname;
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
  return {error: error, value: value};
}

function jsonParse(s) {
  var value, error;
  try {
    value = RollbarJSON.parse(s);
  } catch (e) {
    error = e;
  }
  return {error: error, value: value};
}

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
  LEVELS: LEVELS,
  sanitizeUrl: sanitizeUrl,
  addParamsAndAccessTokenToPath: addParamsAndAccessTokenToPath,
  formatUrl: formatUrl,
  stringify: stringify,
  jsonParse: jsonParse
};

