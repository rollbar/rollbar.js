require('console-polyfill');

var browser = require('./browser');

var RollbarJSON = null;

function setupJSON(JSON) {
  RollbarJSON = JSON;
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


function typeName(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}


function isType(obj, name) {
  return typeName(obj) === name;
}


function parseUri(str) {
  if (!isType(str, 'string')) {
    throw new Error('received invalid input');
  }

  var o = parseUriOptions;
  var m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str);
  var uri = {};
  var i = 14;

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


function sanitizeUrl(url) {
  var baseUrlParts = parseUri(url);
  // remove a trailing # if there is no anchor
  if (baseUrlParts.anchor === '') {
    baseUrlParts.source = baseUrlParts.source.replace('#', '');
  }

  url = baseUrlParts.source.replace('?' + baseUrlParts.query, '');
  return url;
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
    isObj = isType(v, 'object');
    isArray = isType(v, 'array');
    if (isObj || isArray) {
      obj[k] = traverse(v, func);
    } else {
      obj[k] = func(k, v);
    }
  }

  return obj;
}


function redact(val) {
  val = String(val);
  return new Array(val.length + 1).join('*');
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


// Modified version of Object.create polyfill from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
function objectCreate(prototype) {
  if (typeof Object.create != 'function') {
    return ((function(undefined) {
      var Temp = function() {};
      return function (prototype) {
        if(prototype !== null && prototype !== Object(prototype)) {
          throw TypeError('Argument must be an object, or null');
        }
        Temp.prototype = prototype || {};
        var result = new Temp();
        Temp.prototype = null;

        // to imitate the case of Object.create(null)
        if(prototype === null) {
           result.__proto__ = null;
        }
        return result;
      };
    })())(prototype);
  } else {
    return Object.create(prototype);
  }
}

// IE8 logs objects as [object Object].  This is a wrapper that makes it a bit
// more convenient by logging the JSON of the object.  But only do that in IE8 and below
// because other browsers are smarter and handle it properly.
function formatArgsAsString() {
  var args = [];
  for (var i=0; i < arguments.length; i++) {
    var arg = arguments[i];
    if (typeof arg === 'object') {
      arg = RollbarJSON.stringify(arg);
      if (arg.length > 500)
        arg = arg.substr(0,500)+'...';
    } else if (typeof arg === 'undefined') {
      arg = 'undefined';
    }
    args.push(arg);
  }
  return args.join(' ');
}

function consoleError() {
  if (browser.ieVersion() <= 8) {
    console.error(formatArgsAsString.apply(null, arguments));
  } else {
    console.error.apply(console, arguments);
  }
}

function consoleInfo() {
  if (browser.ieVersion() <= 8) {
    console.info(formatArgsAsString.apply(null, arguments));
  } else {
    console.info.apply(console, arguments);
  }
}

function consoleLog() {
  if (browser.ieVersion() <= 8) {
    console.log(formatArgsAsString.apply(null, arguments));
  } else {
    console.log.apply(console, arguments);
  }
}

var Util = {
  setupJSON: setupJSON,
  isType: isType,
  parseUri: parseUri,
  parseUriOptions: parseUriOptions,
  redact: redact,
  sanitizeUrl: sanitizeUrl,
  traverse: traverse,
  typeName: typeName,
  uuid4: uuid4,
  objectCreate: objectCreate,
  consoleError: consoleError,
  consoleInfo: consoleInfo,
  consoleLog: consoleLog
};


module.exports = Util;
