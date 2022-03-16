var _ = require('../utility');
var scrub = require('../scrub');
var urlparser = require('./url');
var domUtil = require('./domUtility');

var defaults = {
  network: true,
  networkResponseHeaders: false,
  networkResponseBody: false,
  networkRequestHeaders: false,
  networkRequestBody: false,
  networkErrorOnHttp5xx: false,
  networkErrorOnHttp4xx: false,
  networkErrorOnHttp0: false,
  log: true,
  dom: true,
  navigation: true,
  connectivity: true,
  contentSecurityPolicy: true,
  errorOnContentSecurityPolicy: false
};

function replace(obj, name, replacement, replacements, type) {
  var orig = obj[name];
  obj[name] = replacement(orig);
  if (replacements) {
    replacements[type].push([obj, name, orig]);
  }
}

function restore(replacements, type) {
  var b;
  while (replacements[type].length) {
    b = replacements[type].shift();
    b[0][b[1]] = b[2];
  }
}

function nameFromDescription(description) {
  if (!description || !description.attributes) { return null; }
  var attrs = description.attributes;
  for (var a = 0; a < attrs.length; ++a) {
    if (attrs[a].key === 'name') {
      return attrs[a].value;
    }
  }
  return null;
}

function defaultValueScrubber(scrubFields) {
  var patterns = [];
  for (var i = 0; i < scrubFields.length; ++i) {
    patterns.push(new RegExp(scrubFields[i], 'i'));
  }
  return function(description) {
    var name = nameFromDescription(description);
    if (!name) { return false; }
    for (var i = 0; i < patterns.length; ++i) {
      if (patterns[i].test(name)) {
        return true;
      }
    }
    return false;
  };
}

function Instrumenter(options, telemeter, rollbar, _window, _document) {
  this.options = options;
  var autoInstrument = options.autoInstrument;
  if (options.enabled === false || autoInstrument === false) {
    this.autoInstrument = {};
  } else {
    if (!_.isType(autoInstrument, 'object')) {
      autoInstrument = defaults;
    }
    this.autoInstrument = _.merge(defaults, autoInstrument);
  }
  this.scrubTelemetryInputs = !!options.scrubTelemetryInputs;
  this.telemetryScrubber = options.telemetryScrubber;
  this.defaultValueScrubber = defaultValueScrubber(options.scrubFields);
  this.telemeter = telemeter;
  this.rollbar = rollbar;
  this.diagnostic = rollbar.client.notifier.diagnostic;
  this._window = _window || {};
  this._document = _document || {};
  this.replacements = {
    network: [],
    log: [],
    navigation: [],
    connectivity: []
  };
  this.eventRemovers = {
    dom: [],
    connectivity: [],
    contentsecuritypolicy: []
  };

  this._location = this._window.location;
  this._lastHref = this._location && this._location.href;
}

Instrumenter.prototype.configure = function(options) {
  this.options = _.merge(this.options, options);
  var autoInstrument = options.autoInstrument;
  var oldSettings = _.merge(this.autoInstrument);
  if (options.enabled === false || autoInstrument === false) {
    this.autoInstrument = {};
  } else {
    if (!_.isType(autoInstrument, 'object')) {
      autoInstrument = defaults;
    }
    this.autoInstrument = _.merge(defaults, autoInstrument);
  }
  this.instrument(oldSettings);
  if (options.scrubTelemetryInputs !== undefined) {
    this.scrubTelemetryInputs = !!options.scrubTelemetryInputs;
  }
  if (options.telemetryScrubber !== undefined) {
    this.telemetryScrubber = options.telemetryScrubber;
  }
};

// eslint-disable-next-line complexity
Instrumenter.prototype.instrument = function(oldSettings) {
  if (this.autoInstrument.network && !(oldSettings && oldSettings.network)) {
    this.instrumentNetwork();
  } else if (!this.autoInstrument.network && oldSettings && oldSettings.network) {
    this.deinstrumentNetwork();
  }

  if (this.autoInstrument.log && !(oldSettings && oldSettings.log)) {
    this.instrumentConsole();
  } else if (!this.autoInstrument.log && oldSettings && oldSettings.log) {
    this.deinstrumentConsole();
  }

  if (this.autoInstrument.dom && !(oldSettings && oldSettings.dom)) {
    this.instrumentDom();
  } else if (!this.autoInstrument.dom && oldSettings && oldSettings.dom) {
    this.deinstrumentDom();
  }

  if (this.autoInstrument.navigation && !(oldSettings && oldSettings.navigation)) {
    this.instrumentNavigation();
  } else if (!this.autoInstrument.navigation && oldSettings && oldSettings.navigation) {
    this.deinstrumentNavigation();
  }

  if (this.autoInstrument.connectivity && !(oldSettings && oldSettings.connectivity)) {
    this.instrumentConnectivity();
  } else if (!this.autoInstrument.connectivity && oldSettings && oldSettings.connectivity) {
    this.deinstrumentConnectivity();
  }

  if (this.autoInstrument.contentSecurityPolicy && !(oldSettings && oldSettings.contentSecurityPolicy)) {
    this.instrumentContentSecurityPolicy();
  } else if (!this.autoInstrument.contentSecurityPolicy && oldSettings && oldSettings.contentSecurityPolicy) {
    this.deinstrumentContentSecurityPolicy();
  }
};

Instrumenter.prototype.deinstrumentNetwork = function() {
  restore(this.replacements, 'network');
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
          if (this.__rollbar_xhr) {
            this.__rollbar_xhr.method = method;
            this.__rollbar_xhr.url = url;
            this.__rollbar_xhr.status_code = null;
            this.__rollbar_xhr.start_time_ms = _.now();
            this.__rollbar_xhr.end_time_ms = null;
          } else {
            this.__rollbar_xhr = {
              method: method,
              url: url,
              status_code: null,
              start_time_ms: _.now(),
              end_time_ms: null
            };
          }
        }
        return orig.apply(this, arguments);
      };
    }, this.replacements, 'network');

    replace(xhrp, 'setRequestHeader', function(orig) {
      return function(header, value) {
        // If xhr.open is async, __rollbar_xhr may not be initialized yet.
        if (!this.__rollbar_xhr) {
          this.__rollbar_xhr = {};
        }
        if (_.isType(header, 'string') && _.isType(value, 'string')) {
          if (self.autoInstrument.networkRequestHeaders) {
            if (!this.__rollbar_xhr.request_headers) {
              this.__rollbar_xhr.request_headers = {};
            }
            this.__rollbar_xhr.request_headers[header] = value;
          }
          // We want the content type even if request header telemetry is off.
          if (header.toLowerCase() === 'content-type') {
            this.__rollbar_xhr.request_content_type = value;
          }
        }
        return orig.apply(this, arguments);
      };
    }, this.replacements, 'network');

    replace(xhrp, 'send', function(orig) {
      /* eslint-disable no-unused-vars */
      return function(data) {
      /* eslint-enable no-unused-vars */
        var xhr = this;

        function onreadystatechangeHandler() {
          if (xhr.__rollbar_xhr) {
            if (xhr.__rollbar_xhr.status_code === null) {
              xhr.__rollbar_xhr.status_code = 0;
              if (self.autoInstrument.networkRequestBody) {
                xhr.__rollbar_xhr.request = data;
              }
              xhr.__rollbar_event = self.captureNetwork(xhr.__rollbar_xhr, 'xhr', undefined);
            }
            if (xhr.readyState < 2) {
              xhr.__rollbar_xhr.start_time_ms = _.now();
            }
            if (xhr.readyState > 3) {
              xhr.__rollbar_xhr.end_time_ms = _.now();

              var headers = null;
              xhr.__rollbar_xhr.response_content_type = xhr.getResponseHeader('Content-Type');
              if (self.autoInstrument.networkResponseHeaders) {
                var headersConfig = self.autoInstrument.networkResponseHeaders;
                headers = {};
                try {
                  var header, i;
                  if (headersConfig === true) {
                    var allHeaders = xhr.getAllResponseHeaders();
                    if (allHeaders) {
                      var arr = allHeaders.trim().split(/[\r\n]+/);
                      var parts, value;
                      for (i=0; i < arr.length; i++) {
                        parts = arr[i].split(': ');
                        header = parts.shift();
                        value = parts.join(': ');
                        headers[header] = value;
                      }
                    }
                  } else {
                    for (i=0; i < headersConfig.length; i++) {
                      header = headersConfig[i];
                      headers[header] = xhr.getResponseHeader(header);
                    }
                  }
                } catch (e) {
                  /* we ignore the errors here that could come from different
                   * browser issues with the xhr methods */
                }
              }
              var body = null;
              if (self.autoInstrument.networkResponseBody) {
                try {
                  body = xhr.responseText;
                } catch (e) {
                  /* ignore errors from reading responseText */
                }
              }
              var response = null;
              if (body || headers) {
                response = {};
                if (body) {
                  if (self.isJsonContentType(xhr.__rollbar_xhr.response_content_type)) {
                    response.body = self.scrubJson(body);
                  } else {
                    response.body = body;
                  }
                }
                if (headers) {
                  response.headers = headers;
                }
              }
              if (response) {
                xhr.__rollbar_xhr.response = response;
              }
              try {
                var code = xhr.status;
                code = code === 1223 ? 204 : code;
                xhr.__rollbar_xhr.status_code = code;
                xhr.__rollbar_event.level = self.telemeter.levelFromStatus(code);
                self.errorOnHttpStatus(xhr.__rollbar_xhr);
              } catch (e) {
                /* ignore possible exception from xhr.status */
              }
            }
          }
        }

        wrapProp('onload', xhr);
        wrapProp('onerror', xhr);
        wrapProp('onprogress', xhr);

        if ('onreadystatechange' in xhr && _.isFunction(xhr.onreadystatechange)) {
          replace(xhr, 'onreadystatechange', function(orig) {
            return self.rollbar.wrap(orig, undefined, onreadystatechangeHandler);
          });
        } else {
          xhr.onreadystatechange = onreadystatechangeHandler;
        }
        if (xhr.__rollbar_xhr && self.trackHttpErrors()) {
          xhr.__rollbar_xhr.stack = (new Error()).stack;
        }
        return orig.apply(this, arguments);
      }
    }, this.replacements, 'network');
  }

  if ('fetch' in this._window) {
    replace(this._window, 'fetch', function(orig) {
      /* eslint-disable no-unused-vars */
      return function(fn, t) {
      /* eslint-enable no-unused-vars */
        var args = new Array(arguments.length);
        for (var i=0, len=args.length; i < len; i++) {
          args[i] = arguments[i];
        }
        var input = args[0];
        var method = 'GET';
        var url;
        if (_.isType(input, 'string')) {
          url = input;
        } else if (input) {
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
          status_code: null,
          start_time_ms: _.now(),
          end_time_ms: null
        };
        if (args[1] && args[1].headers) {
          // Argument may be a Headers object, or plain object. Ensure here that
          // we are working with a Headers object with case-insensitive keys.
          var reqHeaders = new Headers(args[1].headers);

          metadata.request_content_type = reqHeaders.get('Content-Type');

          if (self.autoInstrument.networkRequestHeaders) {
            metadata.request_headers = self.fetchHeaders(reqHeaders, self.autoInstrument.networkRequestHeaders)
          }
        }

        if (self.autoInstrument.networkRequestBody) {
          if (args[1] && args[1].body) {
            metadata.request = args[1].body;
          } else if (args[0] && !_.isType(args[0], 'string') && args[0].body) {
            metadata.request = args[0].body;
          }
        }
        self.captureNetwork(metadata, 'fetch', undefined);
        if (self.trackHttpErrors()) {
          metadata.stack = (new Error()).stack;
        }
        return orig.apply(this, args).then(function (resp) {
          metadata.end_time_ms = _.now();
          metadata.status_code = resp.status;
          metadata.response_content_type = resp.headers.get('Content-Type');
          var headers = null;
          if (self.autoInstrument.networkResponseHeaders) {
            headers = self.fetchHeaders(resp.headers, self.autoInstrument.networkResponseHeaders);
          }
          var body = null;
          if (self.autoInstrument.networkResponseBody) {
            if (typeof resp.text === 'function') { // Response.text() is not implemented on some platforms
              // The response must be cloned to prevent reading (and locking) the original stream.
              body = resp.clone().text(); //returns a Promise
            }
          }
          if (headers || body) {
            metadata.response = {};
            if (body) {
              // Test to ensure body is a Promise, which it should always be.
              if (typeof body.then === 'function') {
                body.then(function (text) {
                  if (self.isJsonContentType(metadata.response_content_type)) {
                    metadata.response.body = self.scrubJson(text);
                  }
                });
              } else {
                metadata.response.body = body;
              }
            }
            if (headers) {
              metadata.response.headers = headers;
            }
          }
          self.errorOnHttpStatus(metadata);
          return resp;
        });
      };
    }, this.replacements, 'network');
  }
};

Instrumenter.prototype.captureNetwork = function(metadata, subtype, rollbarUUID) {
  if (metadata.request && this.isJsonContentType(metadata.request_content_type)) {
    metadata.request = this.scrubJson(metadata.request);
  }
  return this.telemeter.captureNetwork(metadata, subtype, rollbarUUID);
};

Instrumenter.prototype.isJsonContentType = function(contentType) {
  return (contentType && _.isType(contentType, 'string') && contentType.toLowerCase().includes('json')) ? true : false;
}

Instrumenter.prototype.scrubJson = function(json) {
  return JSON.stringify(scrub(JSON.parse(json), this.options.scrubFields));
}

Instrumenter.prototype.fetchHeaders = function(inHeaders, headersConfig) {
  var outHeaders = {};
  try {
    var i;
    if (headersConfig === true) {
      if (typeof inHeaders.entries === 'function') { // Headers.entries() is not implemented in IE
        var allHeaders = inHeaders.entries();
        var currentHeader = allHeaders.next();
        while (!currentHeader.done) {
          outHeaders[currentHeader.value[0]] = currentHeader.value[1];
          currentHeader = allHeaders.next();
        }
      }
    } else {
      for (i=0; i < headersConfig.length; i++) {
        var header = headersConfig[i];
        outHeaders[header] = inHeaders.get(header);
      }
    }
  } catch (e) {
    /* ignore probable IE errors */
  }
  return outHeaders;
}

Instrumenter.prototype.trackHttpErrors = function() {
  return this.autoInstrument.networkErrorOnHttp5xx ||
    this.autoInstrument.networkErrorOnHttp4xx ||
    this.autoInstrument.networkErrorOnHttp0;
}

Instrumenter.prototype.errorOnHttpStatus = function(metadata) {
  var status = metadata.status_code;

  if ((status >= 500 && this.autoInstrument.networkErrorOnHttp5xx) ||
    (status >= 400 && this.autoInstrument.networkErrorOnHttp4xx) ||
    (status === 0 && this.autoInstrument.networkErrorOnHttp0)) {
    var error = new Error('HTTP request failed with Status ' + status);
    error.stack = metadata.stack;
    this.rollbar.error(error, { skipFrames: 1 });
  }
}

Instrumenter.prototype.deinstrumentConsole = function() {
  if (!('console' in this._window && this._window.console.log)) {
    return;
  }
  var b;
  while (this.replacements['log'].length) {
    b = this.replacements['log'].shift();
    this._window.console[b[0]] = b[1];
  }
};

Instrumenter.prototype.instrumentConsole = function() {
  if (!('console' in this._window && this._window.console.log)) {
    return;
  }

  var self = this;
  var c = this._window.console;

  function wrapConsole(method) {
    'use strict'; // See https://github.com/rollbar/rollbar.js/pull/778

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
    self.replacements['log'].push([method, orig]);
  }
  var methods = ['debug','info','warn','error','log'];
  try {
    for (var i=0, len=methods.length; i < len; i++) {
      wrapConsole(methods[i]);
    }
  } catch (e) {
    this.diagnostic.instrumentConsole = { error: e.message };
  }
};

Instrumenter.prototype.deinstrumentDom = function() {
  if (!('addEventListener' in this._window || 'attachEvent' in this._window)) {
    return;
  }
  this.removeListeners('dom');
};

Instrumenter.prototype.instrumentDom = function() {
  if (!('addEventListener' in this._window || 'attachEvent' in this._window)) {
    return;
  }
  var clickHandler = this.handleClick.bind(this);
  var blurHandler = this.handleBlur.bind(this);
  this.addListener('dom', this._window, 'click', 'onclick', clickHandler, true);
  this.addListener('dom', this._window, 'blur', 'onfocusout', blurHandler, true);
};

Instrumenter.prototype.handleClick = function(evt) {
  try {
    var e = domUtil.getElementFromEvent(evt, this._document);
    var hasTag = e && e.tagName;
    var anchorOrButton = domUtil.isDescribedElement(e, 'a') || domUtil.isDescribedElement(e, 'button');
    if (hasTag && (anchorOrButton || domUtil.isDescribedElement(e, 'input', ['button', 'submit']))) {
        this.captureDomEvent('click', e);
    } else if (domUtil.isDescribedElement(e, 'input', ['checkbox', 'radio'])) {
      this.captureDomEvent('input', e, e.value, e.checked);
    }
  } catch (exc) {
    // TODO: Not sure what to do here
  }
};

Instrumenter.prototype.handleBlur = function(evt) {
  try {
    var e = domUtil.getElementFromEvent(evt, this._document);
    if (e && e.tagName) {
      if (domUtil.isDescribedElement(e, 'textarea')) {
        this.captureDomEvent('input', e, e.value);
      } else if (domUtil.isDescribedElement(e, 'select') && e.options && e.options.length) {
        this.handleSelectInputChanged(e);
      } else if (domUtil.isDescribedElement(e, 'input') && !domUtil.isDescribedElement(e, 'input', ['button', 'submit', 'hidden', 'checkbox', 'radio'])) {
        this.captureDomEvent('input', e, e.value);
      }
    }
  } catch (exc) {
    // TODO: Not sure what to do here
  }
};

Instrumenter.prototype.handleSelectInputChanged = function(elem) {
  if (elem.multiple) {
    for (var i = 0; i < elem.options.length; i++) {
      if (elem.options[i].selected) {
        this.captureDomEvent('input', elem, elem.options[i].value);
      }
    }
  } else if (elem.selectedIndex >= 0 && elem.options[elem.selectedIndex]) {
    this.captureDomEvent('input', elem, elem.options[elem.selectedIndex].value);
  }
};

Instrumenter.prototype.captureDomEvent = function(subtype, element, value, isChecked) {
  if (value !== undefined) {
    if (this.scrubTelemetryInputs || (domUtil.getElementType(element) === 'password')) {
      value = '[scrubbed]';
    } else {
      var description = domUtil.describeElement(element);
      if (this.telemetryScrubber) {
        if (this.telemetryScrubber(description)) {
          value = '[scrubbed]';
        }
      } else if (this.defaultValueScrubber(description)) {
        value = '[scrubbed]';
      }
    }
  }
  var elementString = domUtil.elementArrayToString(domUtil.treeToArray(element));
  this.telemeter.captureDom(subtype, elementString, value, isChecked);
};

Instrumenter.prototype.deinstrumentNavigation = function() {
  var chrome = this._window.chrome;
  var chromePackagedApp = chrome && chrome.app && chrome.app.runtime;
  // See https://github.com/angular/angular.js/pull/13945/files
  var hasPushState = !chromePackagedApp && this._window.history && this._window.history.pushState;
  if (!hasPushState) {
    return;
  }
  restore(this.replacements, 'navigation');
};

Instrumenter.prototype.instrumentNavigation = function() {
  var chrome = this._window.chrome;
  var chromePackagedApp = chrome && chrome.app && chrome.app.runtime;
  // See https://github.com/angular/angular.js/pull/13945/files
  var hasPushState = !chromePackagedApp && this._window.history && this._window.history.pushState;
  if (!hasPushState) {
    return;
  }
  var self = this;
  replace(this._window, 'onpopstate', function(orig) {
    return function() {
      var current = self._location.href;
      self.handleUrlChange(self._lastHref, current);
      if (orig) {
        orig.apply(this, arguments);
      }
    };
  }, this.replacements, 'navigation');

  replace(this._window.history, 'pushState', function(orig) {
    return function() {
      var url = arguments.length > 2 ? arguments[2] : undefined;
      if (url) {
        self.handleUrlChange(self._lastHref, url + '');
      }
      return orig.apply(this, arguments);
    };
  }, this.replacements, 'navigation');
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

Instrumenter.prototype.deinstrumentConnectivity = function() {
  if (!('addEventListener' in this._window || 'body' in this._document)) {
    return;
  }
  if (this._window.addEventListener) {
    this.removeListeners('connectivity');
  } else {
    restore(this.replacements, 'connectivity');
  }
};

Instrumenter.prototype.instrumentConnectivity = function() {
  if (!('addEventListener' in this._window || 'body' in this._document)) {
    return;
  }
  if (this._window.addEventListener) {
    this.addListener('connectivity', this._window, 'online', undefined, function() {
      this.telemeter.captureConnectivityChange('online');
    }.bind(this), true);
    this.addListener('connectivity', this._window, 'offline', undefined, function() {
      this.telemeter.captureConnectivityChange('offline');
    }.bind(this), true);
  } else {
    var self = this;
    replace(this._document.body, 'ononline', function(orig) {
      return function() {
        self.telemeter.captureConnectivityChange('online');
        if (orig) {
          orig.apply(this, arguments);
        }
      }
    }, this.replacements, 'connectivity');
    replace(this._document.body, 'onoffline', function(orig) {
      return function() {
        self.telemeter.captureConnectivityChange('offline');
        if (orig) {
          orig.apply(this, arguments);
        }
      }
    }, this.replacements, 'connectivity');
  }
};

Instrumenter.prototype.handleCspEvent = function(cspEvent) {
  var message = 'Security Policy Violation: ' +
    'blockedURI: ' + cspEvent.blockedURI + ', ' +
    'violatedDirective: ' + cspEvent.violatedDirective + ', ' +
    'effectiveDirective: ' + cspEvent.effectiveDirective + ', ';

  if (cspEvent.sourceFile) {
    message += 'location: ' + cspEvent.sourceFile + ', ' +
      'line: ' + cspEvent.lineNumber + ', ' +
      'col: ' + cspEvent.columnNumber + ', ';
  }

  message += 'originalPolicy: ' + cspEvent.originalPolicy;

  this.telemeter.captureLog(message, 'error');
  this.handleCspError(message);
}

Instrumenter.prototype.handleCspError = function(message) {
  if (this.autoInstrument.errorOnContentSecurityPolicy) {
    this.rollbar.error(message);
  }
}

Instrumenter.prototype.deinstrumentContentSecurityPolicy = function() {
  if (!('addEventListener' in this._window)) { return; }

  this.removeListeners('contentsecuritypolicy');
};

Instrumenter.prototype.instrumentContentSecurityPolicy = function() {
  if (!('addEventListener' in this._window)) { return; }

  var cspHandler = this.handleCspEvent.bind(this);
  this.addListener('contentsecuritypolicy', this._window, 'securitypolicyviolation', null, cspHandler, false);
};

Instrumenter.prototype.addListener = function(section, obj, type, altType, handler, capture) {
  if (obj.addEventListener) {
    obj.addEventListener(type, handler, capture);
    this.eventRemovers[section].push(function() {
      obj.removeEventListener(type, handler, capture);
    });
  } else if (altType) {
    obj.attachEvent(altType, handler);
    this.eventRemovers[section].push(function() {
      obj.detachEvent(altType, handler);
    });
  }
};

Instrumenter.prototype.removeListeners = function(section) {
  var r;
  while (this.eventRemovers[section].length) {
    r = this.eventRemovers[section].shift();
    r();
  }
};

module.exports = Instrumenter;
