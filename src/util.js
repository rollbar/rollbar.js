require('console-polyfill');

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


var Util = {
  isType: isType,
  parseUri: parseUri,
  parseUriOptions: parseUriOptions,
  redact: redact,
  sanitizeUrl: sanitizeUrl,
  traverse: traverse,
  typeName: typeName,
  uuid4: uuid4
};


module.exports = Util;
