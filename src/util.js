var Util = {
  // modified from https://github.com/jquery/jquery/blob/master/src/core.js#L127
  merge: function() {
    var options, name, src, copy, copyIsArray, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = true;

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && typeof target !== 'function') {
      target = {};
    }

    for (; i < length; i++) {
      // Only deal with non-null/undefined values
      if ((options = arguments[i]) !== null) {
        // Extend the base object
        for (name in options) {
          // IE8 will iterate over properties of objects like "indexOf"
          if (!options.hasOwnProperty(name)) {
            continue;
          }

          src = target[name];
          copy = options[name];

          // Prevent never-ending loop
          if (target === copy) {
            continue;
          }

          // Recurse if we're merging plain objects or arrays
          if (deep && copy && (copy.constructor == Object || (copyIsArray = (copy.constructor == Array)))) {
            if (copyIsArray) {
              copyIsArray = false;
              // Overwrite the source with a copy of the array to merge in
              clone = [];
            } else {
              clone = src && src.constructor == Object ? src : {};
            }

            // Never move original objects, clone them
            target[name] = Util.merge(clone, copy);

          // Don't bring in undefined values
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }

    // Return the modified object
    return target;
  },

  copy: function(obj) {
    var dest;
    if (typeof obj === 'object') {
      if (obj.constructor == Object) {
        dest = {};
      } else if (obj.constructor == Array) {
        dest = [];
      }
    }

    Util.merge(dest, obj);
    return dest;
  },

  parseUriOptions: {
    strictMode: false,
    key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
    q:   {
      name:   "queryKey",
      parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
  },

  parseUri: function(str) {
    if (!str || (typeof str !== 'string' && !(str instanceof String))) {
      throw new Error('Util.parseUri() received invalid input');
    }

    var o = Util.parseUriOptions;
    var m = o.parser[o.strictMode ? "strict" : "loose"].exec(str);
    var uri = {};
    var i = 14;

    while (i--) {
      uri[o.key[i]] = m[i] || "";
    }

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
      if ($1) {
        uri[o.q.name][$1] = $2;
      }
    });

    return uri;
  },

  sanitizeUrl: function(url) {
    if (!url || (typeof url !== 'string' && !(url instanceof String))) {
      throw new Error('Util.sanitizeUrl() received invalid input');
    }

    var baseUrlParts = Util.parseUri(url);
    // remove a trailing # if there is no anchor
    if (baseUrlParts.anchor === '') {
      baseUrlParts.source = baseUrlParts.source.replace('#', '');
    }

    url = baseUrlParts.source.replace('?' + baseUrlParts.query, '');
    return url;
  },

  traverse: function(obj, func) {
    var k;
    var v;
    var i;
    var isObj = typeof obj === 'object';
    var keys = [];

    if (isObj) {
      if (obj.constructor === Object) {
        for (k in obj) {
          if (obj.hasOwnProperty(k)) {
            keys.push(k);
          }
        }
      } else if (obj.constructor === Array) {
        for (i = 0; i < obj.length; ++i) {
          keys.push(i);
        }
      }
    }

    for (i = 0; i < keys.length; ++i) {
      k = keys[i];
      v = obj[k];
      isObj = typeof v === 'object';
      if (isObj) {
        if (v === null) {
          obj[k] = func(k, v);
        } else if (v.constructor === Object) {
          obj[k] = Util.traverse(v, func);
        } else if (v.constructor === Array) {
          obj[k] = Util.traverse(v, func);
        } else {
          obj[k] = func(k, v);
        }
      } else {
        obj[k] = func(k, v);
      }
    }

    return obj;

  },

  redact: function(val) {
    val = String(val);
    return new Array(val.length + 1).join('*');
  },

  // from http://stackoverflow.com/a/8809472/1138191
  uuid4: function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
  }
};
