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
              clone = src && src.constructor == Array ? src : [];
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
    var dest = {};
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
  }
};
