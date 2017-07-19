var _ = require('../utility');
var urlparser = require('./url');

var defaults = {
  network: true,
  console: true,
  dom: true,
  location: true
};

function replace(obj, name, replacement, replacements) {
  var orig = obj[name];
  obj[name] = replacement(orig);
  if (replacements) {
    replacements.push([obj, name, orig]);
  }
}

function restore(replacements) {
  var b;
  while (replacements.length) {
    b = replacements.shift();
    b[0][b[1]] = b[2];
  }
}

function Instrumenter(options, telemeter, rollbar, _window, _document) {
  var autoInstrument = options.autoInstrument;
  if (autoInstrument === false) {
    return;
  }
  if (!_.isType(autoInstrument, 'object')) {
    autoInstrument = defaults;
  }
  this.autoInstrument = _.extend(true, {}, defaults, autoInstrument);
  this.telemeter = telemeter;
  this.rollbar = rollbar;
  this._window = _window || {};
  this._document = _document || {};

  this._location = this._window.location;
  this._lastHref = this._location && this._location.href;
}

Instrumenter.prototype.instrument = function() {
  if (this.autoInstrument.network) {
    this.instrumentNetwork();
  }

  if (this.autoInstrument.console) {
    this.instrumentConsole();
  }

  if (this.autoInstrument.dom) {
    this.instrumentDom();
  }

  if (this.autoInstrument.location) {
    this.instrumentLocation();
  }
};

Instrumenter.prototype.instrumentNetwork = function() {
  var self = this;

  function wrapProp(prop, xhr) {
    if (prop in xhr && _.isFunction(xhr[prop])) {
      replace(xhr, prop, function(orig) {
        return self.rollbar.wrap(orig);
      });
    }
  }

  if ('XMLHttpRequest' in this._window) {
    var xhrp = this._window.XMLHttpRequest.prototype;
    replace(xhrp, 'open', function(orig) {
      return function(method, url) {
        if (_.isType(url, 'string')) {
          this.__rollbar_xhr = {
            method: method,
            url: url,
            status_code: null
          };
        }
        return orig.apply(this, arguments);
      };
    });

    replace(xhrp, 'send', function(orig) {
      return function(data) {
        var xhr = this;

        function onreadystatechangeHandler() {
          if (xhr.__rollbar_xhr && (xhr.readyState === 1 || xhr.readyState === 4)) {
            try {
              xhr.__rollbar_xhr.status_code = xhr.status;
            } catch (e) { /* ignore possible exception from xhr.status */ }
            self.telemeter.captureNetwork(xhr.__rollbar_xhr, 'xhr');
          }
        }

        wrapProp('onload', xhr);
        wrapProp('onerror', xhr);
        wrapProp('onprogress', xhr);

        if ('onreadystatechange' in xhr && _.isFunction(xhr.onreadystatechange)) {
          replace(xhr, 'onreadystatechange', function(orig) {
            self.rollbar.wrap(orig, undefined, onreadystatechangeHandler);
          });
        } else {
          xhr.onreadystatechange = onreadystatechangeHandler;
        }
        return orig.apply(this, arguments);
      }
    });
  }

  if ('fetch' in this._window) {
    replace(this._window, 'fetch', function(orig) {
      return function(fn, t) {
        var args = new Array(arguments.length);
        for (var i=0, len=args.length; i < len; i++) {
          args[i] = arguments[i];
        }
        var input = args[0];
        var method = 'GET';
        var url;
        if (_.isType(input, 'string')) {
          url = input;
        } else {
          url = input.url;
          if (input.method) {
            method = input.method;
          }
        }
        if (args[1] && args[1].method) {
          method = args[1].method;
        }
        var metadata = {
          method: method,
          url: url,
          status_code: null
        };
        self.telemeter.captureNetwork(metadata, 'fetch');
        return orig.apply(this, args).then(function (resp) {
          metadata.status_code = resp.status;
          return resp;
        });
      };
    });
  }
};

Instrumenter.prototype.instrumentConsole = function() {
  if (!('console' in this._window && this._window.console.log)) {
    return;
  }

  var self = this;
  var c = this._window.console;

  function wrapConsole(method) {
    var orig = c[method];
    var origConsole = c;
    var level = method === 'warn' ? 'warning' : method;
    c[method] = function() {
      var args = Array.prototype.slice.call(arguments);
      var message = _.formatArgsAsString(args);
      self.telemeter.captureLog(message, level);
      if (orig) {
        Function.prototype.apply.call(orig, origConsole, args);
      }
    };
  }
  var methods = ['debug','info','warn','error','log'];
  for (var i=0, len=methods.length; i < len; i++) {
    wrapConsole(methods[i]);
  }
};

Instrumenter.prototype.instrumentDom = function() {
};

Instrumenter.prototype.instrumentLocation = function() {
  var chrome = this._window.chrome;
  var chromePackagedApp = chrome && chrome.app && chrome.app.runtime;
  // See https://github.com/angular/angular.js/pull/13945/files
  var hasPushState = !chromePackagedApp && this._window.history && this._window.history.pushState;
  if (!hasPushState) {
    return;
  }
  var self = this;
  var oldOnPopState = this._window.onpopstate;
  this._window.onpopstate = function() {
    var current = self._location.href;
    self.handleUrlChange(self._lastHref, current);
    if (oldOnPopState) {
      oldOnPopState.apply(this, arguments);
    }
  };

  replace(this._window.history, 'pushState', function(orig) {
    return function() {
      var url = arguments.length > 2 ? arguments[2] : undefined;
      if (url) {
        self.handleUrlChange(self._lastHref, url + '');
      }
      return orig.apply(this, arguments);
    };
  });
};

Instrumenter.prototype.handleUrlChange = function(from, to) {
  var parsedHref = urlparser.parse(this._location.href);
  var parsedTo = urlparser.parse(to);
  var parsedFrom = urlparser.parse(from);
  this._lastHref = to;
  if (parsedHref.protocol === parsedTo.protocol && parsedHref.host === parsedTo.host) {
    to = parsedTo.path + (parsedTo.hash || '');
  }
  if (parsedHref.protocol === parsedFrom.protocol && parsedHref.host === parsedFrom.host) {
    from = parsedFrom.path + (parsedFrom.hash || '');
  }
  this.telemeter.captureNavigation(from, to);
};

module.exports = Instrumenter;
