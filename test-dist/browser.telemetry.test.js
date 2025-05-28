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

/***/ "./src/browser/domUtility.js":
/*!***********************************!*\
  !*** ./src/browser/domUtility.js ***!
  \***********************************/
/***/ ((module) => {

function getElementType(e) {
  return (e.getAttribute('type') || '').toLowerCase();
}
function isDescribedElement(element, type, subtypes) {
  if (element.tagName.toLowerCase() !== type.toLowerCase()) {
    return false;
  }
  if (!subtypes) {
    return true;
  }
  element = getElementType(element);
  for (var i = 0; i < subtypes.length; i++) {
    if (subtypes[i] === element) {
      return true;
    }
  }
  return false;
}
function getElementFromEvent(evt, doc) {
  if (evt.target) {
    return evt.target;
  }
  if (doc && doc.elementFromPoint) {
    return doc.elementFromPoint(evt.clientX, evt.clientY);
  }
  return undefined;
}
function treeToArray(elem) {
  var MAX_HEIGHT = 5;
  var out = [];
  var nextDescription;
  for (var height = 0; elem && height < MAX_HEIGHT; height++) {
    nextDescription = describeElement(elem);
    if (nextDescription.tagName === 'html') {
      break;
    }
    out.unshift(nextDescription);
    elem = elem.parentNode;
  }
  return out;
}
function elementArrayToString(a) {
  var MAX_LENGTH = 80;
  var separator = ' > ',
    separatorLength = separator.length;
  var out = [],
    len = 0,
    nextStr,
    totalLength;
  for (var i = a.length - 1; i >= 0; i--) {
    nextStr = descriptionToString(a[i]);
    totalLength = len + out.length * separatorLength + nextStr.length;
    if (i < a.length - 1 && totalLength >= MAX_LENGTH + 3) {
      out.unshift('...');
      break;
    }
    out.unshift(nextStr);
    len += nextStr.length;
  }
  return out.join(separator);
}
function descriptionToString(desc) {
  if (!desc || !desc.tagName) {
    return '';
  }
  var out = [desc.tagName];
  if (desc.id) {
    out.push('#' + desc.id);
  }
  if (desc.classes) {
    out.push('.' + desc.classes.join('.'));
  }
  for (var i = 0; i < desc.attributes.length; i++) {
    out.push('[' + desc.attributes[i].key + '="' + desc.attributes[i].value + '"]');
  }
  return out.join('');
}

/**
 * Input: a dom element
 * Output: null if tagName is falsey or input is falsey, else
 *  {
 *    tagName: String,
 *    id: String | undefined,
 *    classes: [String] | undefined,
 *    attributes: [
 *      {
 *        key: OneOf(type, name, title, alt),
 *        value: String
 *      }
 *    ]
 *  }
 */
function describeElement(elem) {
  if (!elem || !elem.tagName) {
    return null;
  }
  var out = {},
    className,
    key,
    attr,
    i;
  out.tagName = elem.tagName.toLowerCase();
  if (elem.id) {
    out.id = elem.id;
  }
  className = elem.className;
  if (className && typeof className === 'string') {
    out.classes = className.split(/\s+/);
  }
  var attributes = ['type', 'name', 'title', 'alt'];
  out.attributes = [];
  for (i = 0; i < attributes.length; i++) {
    key = attributes[i];
    attr = elem.getAttribute(key);
    if (attr) {
      out.attributes.push({
        key: key,
        value: attr
      });
    }
  }
  return out;
}
module.exports = {
  describeElement: describeElement,
  descriptionToString: descriptionToString,
  elementArrayToString: elementArrayToString,
  treeToArray: treeToArray,
  getElementFromEvent: getElementFromEvent,
  isDescribedElement: isDescribedElement,
  getElementType: getElementType
};

/***/ }),

/***/ "./src/browser/telemetry.js":
/*!**********************************!*\
  !*** ./src/browser/telemetry.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ../utility */ "./src/utility.js");
var headers = __webpack_require__(/*! ../utility/headers */ "./src/utility/headers.js");
var replace = __webpack_require__(/*! ../utility/replace */ "./src/utility/replace.js");
var scrub = __webpack_require__(/*! ../scrub */ "./src/scrub.js");
var urlparser = __webpack_require__(/*! ./url */ "./src/browser/url.js");
var domUtil = __webpack_require__(/*! ./domUtility */ "./src/browser/domUtility.js");
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
function restore(replacements, type) {
  var b;
  while (replacements[type].length) {
    b = replacements[type].shift();
    b[0][b[1]] = b[2];
  }
}
function nameFromDescription(description) {
  if (!description || !description.attributes) {
    return null;
  }
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
  return function (description) {
    var name = nameFromDescription(description);
    if (!name) {
      return false;
    }
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
Instrumenter.prototype.configure = function (options) {
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
Instrumenter.prototype.instrument = function (oldSettings) {
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
Instrumenter.prototype.deinstrumentNetwork = function () {
  restore(this.replacements, 'network');
};
Instrumenter.prototype.instrumentNetwork = function () {
  var self = this;
  function wrapProp(prop, xhr) {
    if (prop in xhr && _.isFunction(xhr[prop])) {
      replace(xhr, prop, function (orig) {
        return self.rollbar.wrap(orig);
      });
    }
  }
  if ('XMLHttpRequest' in this._window) {
    var xhrp = this._window.XMLHttpRequest.prototype;
    replace(xhrp, 'open', function (orig) {
      return function (method, url) {
        var isUrlObject = _isUrlObject(url);
        if (_.isType(url, 'string') || isUrlObject) {
          url = isUrlObject ? url.toString() : url;
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
    replace(xhrp, 'setRequestHeader', function (orig) {
      return function (header, value) {
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
    replace(xhrp, 'send', function (orig) {
      /* eslint-disable no-unused-vars */
      return function (data) {
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
                      for (i = 0; i < arr.length; i++) {
                        parts = arr[i].split(': ');
                        header = parts.shift();
                        value = parts.join(': ');
                        headers[header] = value;
                      }
                    }
                  } else {
                    for (i = 0; i < headersConfig.length; i++) {
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
          replace(xhr, 'onreadystatechange', function (orig) {
            return self.rollbar.wrap(orig, undefined, onreadystatechangeHandler);
          });
        } else {
          xhr.onreadystatechange = onreadystatechangeHandler;
        }
        if (xhr.__rollbar_xhr && self.trackHttpErrors()) {
          xhr.__rollbar_xhr.stack = new Error().stack;
        }
        return orig.apply(this, arguments);
      };
    }, this.replacements, 'network');
  }
  if ('fetch' in this._window) {
    replace(this._window, 'fetch', function (orig) {
      /* eslint-disable no-unused-vars */
      return function (fn, t) {
        /* eslint-enable no-unused-vars */
        var args = new Array(arguments.length);
        for (var i = 0, len = args.length; i < len; i++) {
          args[i] = arguments[i];
        }
        var input = args[0];
        var method = 'GET';
        var url;
        var isUrlObject = _isUrlObject(input);
        if (_.isType(input, 'string') || isUrlObject) {
          url = isUrlObject ? input.toString() : input;
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
          var reqHeaders = headers(args[1].headers);
          metadata.request_content_type = reqHeaders.get('Content-Type');
          if (self.autoInstrument.networkRequestHeaders) {
            metadata.request_headers = self.fetchHeaders(reqHeaders, self.autoInstrument.networkRequestHeaders);
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
          metadata.stack = new Error().stack;
        }

        // Start our handler before returning the promise. This allows resp.clone()
        // to execute before other handlers touch the response.
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
            if (typeof resp.text === 'function') {
              // Response.text() is not implemented on some platforms
              // The response must be cloned to prevent reading (and locking) the original stream.
              // This must be done before other handlers touch the response.
              body = resp.clone().text(); //returns a Promise
            }
          }
          if (headers || body) {
            metadata.response = {};
            if (body) {
              // Test to ensure body is a Promise, which it should always be.
              if (typeof body.then === 'function') {
                body.then(function (text) {
                  if (text && self.isJsonContentType(metadata.response_content_type)) {
                    metadata.response.body = self.scrubJson(text);
                  } else {
                    metadata.response.body = text;
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
Instrumenter.prototype.captureNetwork = function (metadata, subtype, rollbarUUID) {
  if (metadata.request && this.isJsonContentType(metadata.request_content_type)) {
    metadata.request = this.scrubJson(metadata.request);
  }
  return this.telemeter.captureNetwork(metadata, subtype, rollbarUUID);
};
Instrumenter.prototype.isJsonContentType = function (contentType) {
  return contentType && _.isType(contentType, 'string') && contentType.toLowerCase().includes('json') ? true : false;
};
Instrumenter.prototype.scrubJson = function (json) {
  return JSON.stringify(scrub(JSON.parse(json), this.options.scrubFields));
};
Instrumenter.prototype.fetchHeaders = function (inHeaders, headersConfig) {
  var outHeaders = {};
  try {
    var i;
    if (headersConfig === true) {
      if (typeof inHeaders.entries === 'function') {
        // Headers.entries() is not implemented in IE
        var allHeaders = inHeaders.entries();
        var currentHeader = allHeaders.next();
        while (!currentHeader.done) {
          outHeaders[currentHeader.value[0]] = currentHeader.value[1];
          currentHeader = allHeaders.next();
        }
      }
    } else {
      for (i = 0; i < headersConfig.length; i++) {
        var header = headersConfig[i];
        outHeaders[header] = inHeaders.get(header);
      }
    }
  } catch (e) {
    /* ignore probable IE errors */
  }
  return outHeaders;
};
Instrumenter.prototype.trackHttpErrors = function () {
  return this.autoInstrument.networkErrorOnHttp5xx || this.autoInstrument.networkErrorOnHttp4xx || this.autoInstrument.networkErrorOnHttp0;
};
Instrumenter.prototype.errorOnHttpStatus = function (metadata) {
  var status = metadata.status_code;
  if (status >= 500 && this.autoInstrument.networkErrorOnHttp5xx || status >= 400 && this.autoInstrument.networkErrorOnHttp4xx || status === 0 && this.autoInstrument.networkErrorOnHttp0) {
    var error = new Error('HTTP request failed with Status ' + status);
    error.stack = metadata.stack;
    this.rollbar.error(error, {
      skipFrames: 1
    });
  }
};
Instrumenter.prototype.deinstrumentConsole = function () {
  if (!('console' in this._window && this._window.console.log)) {
    return;
  }
  var b;
  while (this.replacements['log'].length) {
    b = this.replacements['log'].shift();
    this._window.console[b[0]] = b[1];
  }
};
Instrumenter.prototype.instrumentConsole = function () {
  if (!('console' in this._window && this._window.console.log)) {
    return;
  }
  var self = this;
  var c = this._window.console;
  function wrapConsole(method) {
    'use strict';

    // See https://github.com/rollbar/rollbar.js/pull/778
    var orig = c[method];
    var origConsole = c;
    var level = method === 'warn' ? 'warning' : method;
    c[method] = function () {
      var args = Array.prototype.slice.call(arguments);
      var message = _.formatArgsAsString(args);
      self.telemeter.captureLog(message, level, null, _.now());
      if (orig) {
        Function.prototype.apply.call(orig, origConsole, args);
      }
    };
    self.replacements['log'].push([method, orig]);
  }
  var methods = ['debug', 'info', 'warn', 'error', 'log'];
  try {
    for (var i = 0, len = methods.length; i < len; i++) {
      wrapConsole(methods[i]);
    }
  } catch (e) {
    this.diagnostic.instrumentConsole = {
      error: e.message
    };
  }
};
Instrumenter.prototype.deinstrumentDom = function () {
  if (!('addEventListener' in this._window || 'attachEvent' in this._window)) {
    return;
  }
  this.removeListeners('dom');
};
Instrumenter.prototype.instrumentDom = function () {
  if (!('addEventListener' in this._window || 'attachEvent' in this._window)) {
    return;
  }
  var clickHandler = this.handleClick.bind(this);
  var blurHandler = this.handleBlur.bind(this);
  this.addListener('dom', this._window, 'click', 'onclick', clickHandler, true);
  this.addListener('dom', this._window, 'blur', 'onfocusout', blurHandler, true);
};
Instrumenter.prototype.handleClick = function (evt) {
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
Instrumenter.prototype.handleBlur = function (evt) {
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
Instrumenter.prototype.handleSelectInputChanged = function (elem) {
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
Instrumenter.prototype.captureDomEvent = function (subtype, element, value, isChecked) {
  if (value !== undefined) {
    if (this.scrubTelemetryInputs || domUtil.getElementType(element) === 'password') {
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
Instrumenter.prototype.deinstrumentNavigation = function () {
  var chrome = this._window.chrome;
  var chromePackagedApp = chrome && chrome.app && chrome.app.runtime;
  // See https://github.com/angular/angular.js/pull/13945/files
  var hasPushState = !chromePackagedApp && this._window.history && this._window.history.pushState;
  if (!hasPushState) {
    return;
  }
  restore(this.replacements, 'navigation');
};
Instrumenter.prototype.instrumentNavigation = function () {
  var chrome = this._window.chrome;
  var chromePackagedApp = chrome && chrome.app && chrome.app.runtime;
  // See https://github.com/angular/angular.js/pull/13945/files
  var hasPushState = !chromePackagedApp && this._window.history && this._window.history.pushState;
  if (!hasPushState) {
    return;
  }
  var self = this;
  replace(this._window, 'onpopstate', function (orig) {
    return function () {
      var current = self._location.href;
      self.handleUrlChange(self._lastHref, current);
      if (orig) {
        orig.apply(this, arguments);
      }
    };
  }, this.replacements, 'navigation');
  replace(this._window.history, 'pushState', function (orig) {
    return function () {
      var url = arguments.length > 2 ? arguments[2] : undefined;
      if (url) {
        self.handleUrlChange(self._lastHref, url + '');
      }
      return orig.apply(this, arguments);
    };
  }, this.replacements, 'navigation');
};
Instrumenter.prototype.handleUrlChange = function (from, to) {
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
  this.telemeter.captureNavigation(from, to, _.now());
};
Instrumenter.prototype.deinstrumentConnectivity = function () {
  if (!('addEventListener' in this._window || 'body' in this._document)) {
    return;
  }
  if (this._window.addEventListener) {
    this.removeListeners('connectivity');
  } else {
    restore(this.replacements, 'connectivity');
  }
};
Instrumenter.prototype.instrumentConnectivity = function () {
  if (!('addEventListener' in this._window || 'body' in this._document)) {
    return;
  }
  if (this._window.addEventListener) {
    this.addListener('connectivity', this._window, 'online', undefined, function () {
      this.telemeter.captureConnectivityChange('online');
    }.bind(this), true);
    this.addListener('connectivity', this._window, 'offline', undefined, function () {
      this.telemeter.captureConnectivityChange('offline');
    }.bind(this), true);
  } else {
    var self = this;
    replace(this._document.body, 'ononline', function (orig) {
      return function () {
        self.telemeter.captureConnectivityChange('online');
        if (orig) {
          orig.apply(this, arguments);
        }
      };
    }, this.replacements, 'connectivity');
    replace(this._document.body, 'onoffline', function (orig) {
      return function () {
        self.telemeter.captureConnectivityChange('offline');
        if (orig) {
          orig.apply(this, arguments);
        }
      };
    }, this.replacements, 'connectivity');
  }
};
Instrumenter.prototype.handleCspEvent = function (cspEvent) {
  var message = 'Security Policy Violation: ' + 'blockedURI: ' + cspEvent.blockedURI + ', ' + 'violatedDirective: ' + cspEvent.violatedDirective + ', ' + 'effectiveDirective: ' + cspEvent.effectiveDirective + ', ';
  if (cspEvent.sourceFile) {
    message += 'location: ' + cspEvent.sourceFile + ', ' + 'line: ' + cspEvent.lineNumber + ', ' + 'col: ' + cspEvent.columnNumber + ', ';
  }
  message += 'originalPolicy: ' + cspEvent.originalPolicy;
  this.telemeter.captureLog(message, 'error', null, _.now());
  this.handleCspError(message);
};
Instrumenter.prototype.handleCspError = function (message) {
  if (this.autoInstrument.errorOnContentSecurityPolicy) {
    this.rollbar.error(message);
  }
};
Instrumenter.prototype.deinstrumentContentSecurityPolicy = function () {
  if (!('addEventListener' in this._document)) {
    return;
  }
  this.removeListeners('contentsecuritypolicy');
};
Instrumenter.prototype.instrumentContentSecurityPolicy = function () {
  if (!('addEventListener' in this._document)) {
    return;
  }
  var cspHandler = this.handleCspEvent.bind(this);
  this.addListener('contentsecuritypolicy', this._document, 'securitypolicyviolation', null, cspHandler, false);
};
Instrumenter.prototype.addListener = function (section, obj, type, altType, handler, capture) {
  if (obj.addEventListener) {
    obj.addEventListener(type, handler, capture);
    this.eventRemovers[section].push(function () {
      obj.removeEventListener(type, handler, capture);
    });
  } else if (altType) {
    obj.attachEvent(altType, handler);
    this.eventRemovers[section].push(function () {
      obj.detachEvent(altType, handler);
    });
  }
};
Instrumenter.prototype.removeListeners = function (section) {
  var r;
  while (this.eventRemovers[section].length) {
    r = this.eventRemovers[section].shift();
    r();
  }
};
function _isUrlObject(input) {
  return typeof URL !== 'undefined' && input instanceof URL;
}
module.exports = Instrumenter;

/***/ }),

/***/ "./src/browser/url.js":
/*!****************************!*\
  !*** ./src/browser/url.js ***!
  \****************************/
/***/ ((module) => {

// See https://nodejs.org/docs/latest/api/url.html
function parse(url) {
  var result = {
    protocol: null,
    auth: null,
    host: null,
    path: null,
    hash: null,
    href: url,
    hostname: null,
    port: null,
    pathname: null,
    search: null,
    query: null
  };
  var i, last;
  i = url.indexOf('//');
  if (i !== -1) {
    result.protocol = url.substring(0, i);
    last = i + 2;
  } else {
    last = 0;
  }
  i = url.indexOf('@', last);
  if (i !== -1) {
    result.auth = url.substring(last, i);
    last = i + 1;
  }
  i = url.indexOf('/', last);
  if (i === -1) {
    i = url.indexOf('?', last);
    if (i === -1) {
      i = url.indexOf('#', last);
      if (i === -1) {
        result.host = url.substring(last);
      } else {
        result.host = url.substring(last, i);
        result.hash = url.substring(i);
      }
      result.hostname = result.host.split(':')[0];
      result.port = result.host.split(':')[1];
      if (result.port) {
        result.port = parseInt(result.port, 10);
      }
      return result;
    } else {
      result.host = url.substring(last, i);
      result.hostname = result.host.split(':')[0];
      result.port = result.host.split(':')[1];
      if (result.port) {
        result.port = parseInt(result.port, 10);
      }
      last = i;
    }
  } else {
    result.host = url.substring(last, i);
    result.hostname = result.host.split(':')[0];
    result.port = result.host.split(':')[1];
    if (result.port) {
      result.port = parseInt(result.port, 10);
    }
    last = i;
  }
  i = url.indexOf('#', last);
  if (i === -1) {
    result.path = url.substring(last);
  } else {
    result.path = url.substring(last, i);
    result.hash = url.substring(i);
  }
  if (result.path) {
    var pathParts = result.path.split('?');
    result.pathname = pathParts[0];
    result.query = pathParts[1];
    result.search = result.query ? '?' + result.query : null;
  }
  return result;
}
module.exports = {
  parse: parse
};

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

/***/ "./src/scrub.js":
/*!**********************!*\
  !*** ./src/scrub.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");
var traverse = __webpack_require__(/*! ./utility/traverse */ "./src/utility/traverse.js");
function scrub(data, scrubFields, scrubPaths) {
  scrubFields = scrubFields || [];
  if (scrubPaths) {
    for (var i = 0; i < scrubPaths.length; ++i) {
      scrubPath(data, scrubPaths[i]);
    }
  }
  var paramRes = _getScrubFieldRegexs(scrubFields);
  var queryRes = _getScrubQueryParamRegexs(scrubFields);
  function redactQueryParam(dummy0, paramPart) {
    return paramPart + _.redact();
  }
  function paramScrubber(v) {
    var i;
    if (_.isType(v, 'string')) {
      for (i = 0; i < queryRes.length; ++i) {
        v = v.replace(queryRes[i], redactQueryParam);
      }
    }
    return v;
  }
  function valScrubber(k, v) {
    var i;
    for (i = 0; i < paramRes.length; ++i) {
      if (paramRes[i].test(k)) {
        v = _.redact();
        break;
      }
    }
    return v;
  }
  function scrubber(k, v, seen) {
    var tmpV = valScrubber(k, v);
    if (tmpV === v) {
      if (_.isType(v, 'object') || _.isType(v, 'array')) {
        return traverse(v, scrubber, seen);
      }
      return paramScrubber(tmpV);
    } else {
      return tmpV;
    }
  }
  return traverse(data, scrubber);
}
function scrubPath(obj, path) {
  var keys = path.split('.');
  var last = keys.length - 1;
  try {
    for (var i = 0; i <= last; ++i) {
      if (i < last) {
        obj = obj[keys[i]];
      } else {
        obj[keys[i]] = _.redact();
      }
    }
  } catch (e) {
    // Missing key is OK;
  }
}
function _getScrubFieldRegexs(scrubFields) {
  var ret = [];
  var pat;
  for (var i = 0; i < scrubFields.length; ++i) {
    pat = '^\\[?(%5[bB])?' + scrubFields[i] + '\\[?(%5[bB])?\\]?(%5[dD])?$';
    ret.push(new RegExp(pat, 'i'));
  }
  return ret;
}
function _getScrubQueryParamRegexs(scrubFields) {
  var ret = [];
  var pat;
  for (var i = 0; i < scrubFields.length; ++i) {
    pat = '\\[?(%5[bB])?' + scrubFields[i] + '\\[?(%5[bB])?\\]?(%5[dD])?';
    ret.push(new RegExp('(' + pat + '=)([^&\\n]+)', 'igm'));
  }
  return ret;
}
module.exports = scrub;

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

/***/ "./src/utility/headers.js":
/*!********************************!*\
  !*** ./src/utility/headers.js ***!
  \********************************/
/***/ ((module) => {

/*
 * headers - Detect when fetch Headers are undefined and use a partial polyfill.
 *
 * A full polyfill is not used in order to keep package size as small as possible.
 * Since this is only used internally and is not added to the window object,
 * the full interface doesn't need to be supported.
 *
 * This implementation is modified from whatwg-fetch:
 * https://github.com/github/fetch
 */
function headers(headers) {
  if (typeof Headers === 'undefined') {
    return new FetchHeaders(headers);
  }
  return new Headers(headers);
}
function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name);
  }
  return name.toLowerCase();
}
function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value);
  }
  return value;
}
function iteratorFor(items) {
  var iterator = {
    next: function next() {
      var value = items.shift();
      return {
        done: value === undefined,
        value: value
      };
    }
  };
  return iterator;
}
function FetchHeaders(headers) {
  this.map = {};
  if (headers instanceof FetchHeaders) {
    headers.forEach(function (value, name) {
      this.append(name, value);
    }, this);
  } else if (Array.isArray(headers)) {
    headers.forEach(function (header) {
      this.append(header[0], header[1]);
    }, this);
  } else if (headers) {
    Object.getOwnPropertyNames(headers).forEach(function (name) {
      this.append(name, headers[name]);
    }, this);
  }
}
FetchHeaders.prototype.append = function (name, value) {
  name = normalizeName(name);
  value = normalizeValue(value);
  var oldValue = this.map[name];
  this.map[name] = oldValue ? oldValue + ', ' + value : value;
};
FetchHeaders.prototype.get = function (name) {
  name = normalizeName(name);
  return this.has(name) ? this.map[name] : null;
};
FetchHeaders.prototype.has = function (name) {
  return this.map.hasOwnProperty(normalizeName(name));
};
FetchHeaders.prototype.forEach = function (callback, thisArg) {
  for (var name in this.map) {
    if (this.map.hasOwnProperty(name)) {
      callback.call(thisArg, this.map[name], name, this);
    }
  }
};
FetchHeaders.prototype.entries = function () {
  var items = [];
  this.forEach(function (value, name) {
    items.push([name, value]);
  });
  return iteratorFor(items);
};
module.exports = headers;

/***/ }),

/***/ "./src/utility/replace.js":
/*!********************************!*\
  !*** ./src/utility/replace.js ***!
  \********************************/
/***/ ((module) => {

function replace(obj, name, replacement, replacements, type) {
  var orig = obj[name];
  obj[name] = replacement(orig);
  if (replacements) {
    replacements[type].push([obj, name, orig]);
  }
}
module.exports = replace;

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
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!****************************************!*\
  !*** ./test/browser.telemetry.test.js ***!
  \****************************************/
/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var Instrumenter = __webpack_require__(/*! ../src/browser/telemetry */ "./src/browser/telemetry.js");

describe('instrumentNetwork', function () {
  it('should capture XHR requests with string URL', function (done) {
    var callback = sinon.spy();
    var windowMock = {
      XMLHttpRequest: function () {},
    };

    windowMock.XMLHttpRequest.prototype.open = function () {};
    windowMock.XMLHttpRequest.prototype.send = function () {};

    var i = createInstrumenter(callback, windowMock);
    i.instrumentNetwork();

    var xhr = new windowMock.XMLHttpRequest();
    xhr.open('GET', 'http://first.call');
    xhr.send();
    xhr.onreadystatechange();

    expect(callback.callCount).to.eql(1);
    expect(callback.args[0][0].url).to.eql('http://first.call');

    i.deinstrumentNetwork();
    i = createInstrumenter(callback, windowMock);
    i.instrumentNetwork();
    var xhr = new windowMock.XMLHttpRequest();
    xhr.open('GET', new URL('http://second.call'));
    xhr.send();
    xhr.onreadystatechange();
    expect(callback.callCount).to.eql(2);
    expect(callback.args[1][0].url).to.eql('http://second.call/');

    done();
  });

  it('should capture XHR requests with string URL', function (done) {
    var callback = sinon.spy();
    var windowMock = {
      fetch: function () {
        return Promise.resolve();
      },
    };

    var i = createInstrumenter(callback, windowMock);
    i.instrumentNetwork();

    windowMock.fetch('http://first.call');
    expect(callback.callCount).to.eql(1);
    expect(callback.args[0][0].url).to.eql('http://first.call');

    i.deinstrumentNetwork();
    i = createInstrumenter(callback, windowMock);
    i.instrumentNetwork();

    windowMock.fetch(new URL('http://second.call'));
    expect(callback.callCount).to.eql(2);
    expect(callback.args[1][0].url).to.eql('http://second.call/');

    done();
  });
});

function createInstrumenter(callback, windowMock) {
  return new Instrumenter(
    { scrubFields: [] },
    { captureNetwork: callback },
    { wrap: function () {}, client: { notifier: { diagnostic: {} } } },
    windowMock,
  );
}

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlci50ZWxlbWV0cnkudGVzdC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7O0FDVkEsU0FBU0EsY0FBY0EsQ0FBQ0MsQ0FBQyxFQUFFO0VBQ3pCLE9BQU8sQ0FBQ0EsQ0FBQyxDQUFDQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFQyxXQUFXLENBQUMsQ0FBQztBQUNyRDtBQUVBLFNBQVNDLGtCQUFrQkEsQ0FBQ0MsT0FBTyxFQUFFQyxJQUFJLEVBQUVDLFFBQVEsRUFBRTtFQUNuRCxJQUFJRixPQUFPLENBQUNHLE9BQU8sQ0FBQ0wsV0FBVyxDQUFDLENBQUMsS0FBS0csSUFBSSxDQUFDSCxXQUFXLENBQUMsQ0FBQyxFQUFFO0lBQ3hELE9BQU8sS0FBSztFQUNkO0VBQ0EsSUFBSSxDQUFDSSxRQUFRLEVBQUU7SUFDYixPQUFPLElBQUk7RUFDYjtFQUNBRixPQUFPLEdBQUdMLGNBQWMsQ0FBQ0ssT0FBTyxDQUFDO0VBQ2pDLEtBQUssSUFBSUksQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHRixRQUFRLENBQUNHLE1BQU0sRUFBRUQsQ0FBQyxFQUFFLEVBQUU7SUFDeEMsSUFBSUYsUUFBUSxDQUFDRSxDQUFDLENBQUMsS0FBS0osT0FBTyxFQUFFO01BQzNCLE9BQU8sSUFBSTtJQUNiO0VBQ0Y7RUFDQSxPQUFPLEtBQUs7QUFDZDtBQUVBLFNBQVNNLG1CQUFtQkEsQ0FBQ0MsR0FBRyxFQUFFQyxHQUFHLEVBQUU7RUFDckMsSUFBSUQsR0FBRyxDQUFDRSxNQUFNLEVBQUU7SUFDZCxPQUFPRixHQUFHLENBQUNFLE1BQU07RUFDbkI7RUFDQSxJQUFJRCxHQUFHLElBQUlBLEdBQUcsQ0FBQ0UsZ0JBQWdCLEVBQUU7SUFDL0IsT0FBT0YsR0FBRyxDQUFDRSxnQkFBZ0IsQ0FBQ0gsR0FBRyxDQUFDSSxPQUFPLEVBQUVKLEdBQUcsQ0FBQ0ssT0FBTyxDQUFDO0VBQ3ZEO0VBQ0EsT0FBT0MsU0FBUztBQUNsQjtBQUVBLFNBQVNDLFdBQVdBLENBQUNDLElBQUksRUFBRTtFQUN6QixJQUFJQyxVQUFVLEdBQUcsQ0FBQztFQUNsQixJQUFJQyxHQUFHLEdBQUcsRUFBRTtFQUNaLElBQUlDLGVBQWU7RUFDbkIsS0FBSyxJQUFJQyxNQUFNLEdBQUcsQ0FBQyxFQUFFSixJQUFJLElBQUlJLE1BQU0sR0FBR0gsVUFBVSxFQUFFRyxNQUFNLEVBQUUsRUFBRTtJQUMxREQsZUFBZSxHQUFHRSxlQUFlLENBQUNMLElBQUksQ0FBQztJQUN2QyxJQUFJRyxlQUFlLENBQUNmLE9BQU8sS0FBSyxNQUFNLEVBQUU7TUFDdEM7SUFDRjtJQUNBYyxHQUFHLENBQUNJLE9BQU8sQ0FBQ0gsZUFBZSxDQUFDO0lBQzVCSCxJQUFJLEdBQUdBLElBQUksQ0FBQ08sVUFBVTtFQUN4QjtFQUNBLE9BQU9MLEdBQUc7QUFDWjtBQUVBLFNBQVNNLG9CQUFvQkEsQ0FBQ0MsQ0FBQyxFQUFFO0VBQy9CLElBQUlDLFVBQVUsR0FBRyxFQUFFO0VBQ25CLElBQUlDLFNBQVMsR0FBRyxLQUFLO0lBQ25CQyxlQUFlLEdBQUdELFNBQVMsQ0FBQ3JCLE1BQU07RUFDcEMsSUFBSVksR0FBRyxHQUFHLEVBQUU7SUFDVlcsR0FBRyxHQUFHLENBQUM7SUFDUEMsT0FBTztJQUNQQyxXQUFXO0VBRWIsS0FBSyxJQUFJMUIsQ0FBQyxHQUFHb0IsQ0FBQyxDQUFDbkIsTUFBTSxHQUFHLENBQUMsRUFBRUQsQ0FBQyxJQUFJLENBQUMsRUFBRUEsQ0FBQyxFQUFFLEVBQUU7SUFDdEN5QixPQUFPLEdBQUdFLG1CQUFtQixDQUFDUCxDQUFDLENBQUNwQixDQUFDLENBQUMsQ0FBQztJQUNuQzBCLFdBQVcsR0FBR0YsR0FBRyxHQUFHWCxHQUFHLENBQUNaLE1BQU0sR0FBR3NCLGVBQWUsR0FBR0UsT0FBTyxDQUFDeEIsTUFBTTtJQUNqRSxJQUFJRCxDQUFDLEdBQUdvQixDQUFDLENBQUNuQixNQUFNLEdBQUcsQ0FBQyxJQUFJeUIsV0FBVyxJQUFJTCxVQUFVLEdBQUcsQ0FBQyxFQUFFO01BQ3JEUixHQUFHLENBQUNJLE9BQU8sQ0FBQyxLQUFLLENBQUM7TUFDbEI7SUFDRjtJQUNBSixHQUFHLENBQUNJLE9BQU8sQ0FBQ1EsT0FBTyxDQUFDO0lBQ3BCRCxHQUFHLElBQUlDLE9BQU8sQ0FBQ3hCLE1BQU07RUFDdkI7RUFDQSxPQUFPWSxHQUFHLENBQUNlLElBQUksQ0FBQ04sU0FBUyxDQUFDO0FBQzVCO0FBRUEsU0FBU0ssbUJBQW1CQSxDQUFDRSxJQUFJLEVBQUU7RUFDakMsSUFBSSxDQUFDQSxJQUFJLElBQUksQ0FBQ0EsSUFBSSxDQUFDOUIsT0FBTyxFQUFFO0lBQzFCLE9BQU8sRUFBRTtFQUNYO0VBQ0EsSUFBSWMsR0FBRyxHQUFHLENBQUNnQixJQUFJLENBQUM5QixPQUFPLENBQUM7RUFDeEIsSUFBSThCLElBQUksQ0FBQ0MsRUFBRSxFQUFFO0lBQ1hqQixHQUFHLENBQUNrQixJQUFJLENBQUMsR0FBRyxHQUFHRixJQUFJLENBQUNDLEVBQUUsQ0FBQztFQUN6QjtFQUNBLElBQUlELElBQUksQ0FBQ0csT0FBTyxFQUFFO0lBQ2hCbkIsR0FBRyxDQUFDa0IsSUFBSSxDQUFDLEdBQUcsR0FBR0YsSUFBSSxDQUFDRyxPQUFPLENBQUNKLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUN4QztFQUNBLEtBQUssSUFBSTVCLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBRzZCLElBQUksQ0FBQ0ksVUFBVSxDQUFDaEMsTUFBTSxFQUFFRCxDQUFDLEVBQUUsRUFBRTtJQUMvQ2EsR0FBRyxDQUFDa0IsSUFBSSxDQUNOLEdBQUcsR0FBR0YsSUFBSSxDQUFDSSxVQUFVLENBQUNqQyxDQUFDLENBQUMsQ0FBQ2tDLEdBQUcsR0FBRyxJQUFJLEdBQUdMLElBQUksQ0FBQ0ksVUFBVSxDQUFDakMsQ0FBQyxDQUFDLENBQUNtQyxLQUFLLEdBQUcsSUFDbkUsQ0FBQztFQUNIO0VBRUEsT0FBT3RCLEdBQUcsQ0FBQ2UsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUNyQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTWixlQUFlQSxDQUFDTCxJQUFJLEVBQUU7RUFDN0IsSUFBSSxDQUFDQSxJQUFJLElBQUksQ0FBQ0EsSUFBSSxDQUFDWixPQUFPLEVBQUU7SUFDMUIsT0FBTyxJQUFJO0VBQ2I7RUFDQSxJQUFJYyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ1Z1QixTQUFTO0lBQ1RGLEdBQUc7SUFDSEcsSUFBSTtJQUNKckMsQ0FBQztFQUNIYSxHQUFHLENBQUNkLE9BQU8sR0FBR1ksSUFBSSxDQUFDWixPQUFPLENBQUNMLFdBQVcsQ0FBQyxDQUFDO0VBQ3hDLElBQUlpQixJQUFJLENBQUNtQixFQUFFLEVBQUU7SUFDWGpCLEdBQUcsQ0FBQ2lCLEVBQUUsR0FBR25CLElBQUksQ0FBQ21CLEVBQUU7RUFDbEI7RUFDQU0sU0FBUyxHQUFHekIsSUFBSSxDQUFDeUIsU0FBUztFQUMxQixJQUFJQSxTQUFTLElBQUksT0FBT0EsU0FBUyxLQUFLLFFBQVEsRUFBRTtJQUM5Q3ZCLEdBQUcsQ0FBQ21CLE9BQU8sR0FBR0ksU0FBUyxDQUFDRSxLQUFLLENBQUMsS0FBSyxDQUFDO0VBQ3RDO0VBQ0EsSUFBSUwsVUFBVSxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDO0VBQ2pEcEIsR0FBRyxDQUFDb0IsVUFBVSxHQUFHLEVBQUU7RUFDbkIsS0FBS2pDLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR2lDLFVBQVUsQ0FBQ2hDLE1BQU0sRUFBRUQsQ0FBQyxFQUFFLEVBQUU7SUFDdENrQyxHQUFHLEdBQUdELFVBQVUsQ0FBQ2pDLENBQUMsQ0FBQztJQUNuQnFDLElBQUksR0FBRzFCLElBQUksQ0FBQ2xCLFlBQVksQ0FBQ3lDLEdBQUcsQ0FBQztJQUM3QixJQUFJRyxJQUFJLEVBQUU7TUFDUnhCLEdBQUcsQ0FBQ29CLFVBQVUsQ0FBQ0YsSUFBSSxDQUFDO1FBQUVHLEdBQUcsRUFBRUEsR0FBRztRQUFFQyxLQUFLLEVBQUVFO01BQUssQ0FBQyxDQUFDO0lBQ2hEO0VBQ0Y7RUFDQSxPQUFPeEIsR0FBRztBQUNaO0FBRUEwQixNQUFNLENBQUNDLE9BQU8sR0FBRztFQUNmeEIsZUFBZSxFQUFFQSxlQUFlO0VBQ2hDVyxtQkFBbUIsRUFBRUEsbUJBQW1CO0VBQ3hDUixvQkFBb0IsRUFBRUEsb0JBQW9CO0VBQzFDVCxXQUFXLEVBQUVBLFdBQVc7RUFDeEJSLG1CQUFtQixFQUFFQSxtQkFBbUI7RUFDeENQLGtCQUFrQixFQUFFQSxrQkFBa0I7RUFDdENKLGNBQWMsRUFBRUE7QUFDbEIsQ0FBQzs7Ozs7Ozs7OztBQzNJRCxJQUFJa0QsQ0FBQyxHQUFHQyxtQkFBTyxDQUFDLG9DQUFZLENBQUM7QUFDN0IsSUFBSUMsT0FBTyxHQUFHRCxtQkFBTyxDQUFDLG9EQUFvQixDQUFDO0FBQzNDLElBQUlFLE9BQU8sR0FBR0YsbUJBQU8sQ0FBQyxvREFBb0IsQ0FBQztBQUMzQyxJQUFJRyxLQUFLLEdBQUdILG1CQUFPLENBQUMsZ0NBQVUsQ0FBQztBQUMvQixJQUFJSSxTQUFTLEdBQUdKLG1CQUFPLENBQUMsbUNBQU8sQ0FBQztBQUNoQyxJQUFJSyxPQUFPLEdBQUdMLG1CQUFPLENBQUMsaURBQWMsQ0FBQztBQUVyQyxJQUFJTSxRQUFRLEdBQUc7RUFDYkMsT0FBTyxFQUFFLElBQUk7RUFDYkMsc0JBQXNCLEVBQUUsS0FBSztFQUM3QkMsbUJBQW1CLEVBQUUsS0FBSztFQUMxQkMscUJBQXFCLEVBQUUsS0FBSztFQUM1QkMsa0JBQWtCLEVBQUUsS0FBSztFQUN6QkMscUJBQXFCLEVBQUUsS0FBSztFQUM1QkMscUJBQXFCLEVBQUUsS0FBSztFQUM1QkMsbUJBQW1CLEVBQUUsS0FBSztFQUMxQkMsR0FBRyxFQUFFLElBQUk7RUFDVEMsR0FBRyxFQUFFLElBQUk7RUFDVEMsVUFBVSxFQUFFLElBQUk7RUFDaEJDLFlBQVksRUFBRSxJQUFJO0VBQ2xCQyxxQkFBcUIsRUFBRSxJQUFJO0VBQzNCQyw0QkFBNEIsRUFBRTtBQUNoQyxDQUFDO0FBRUQsU0FBU0MsT0FBT0EsQ0FBQ0MsWUFBWSxFQUFFbkUsSUFBSSxFQUFFO0VBQ25DLElBQUlvRSxDQUFDO0VBQ0wsT0FBT0QsWUFBWSxDQUFDbkUsSUFBSSxDQUFDLENBQUNJLE1BQU0sRUFBRTtJQUNoQ2dFLENBQUMsR0FBR0QsWUFBWSxDQUFDbkUsSUFBSSxDQUFDLENBQUNxRSxLQUFLLENBQUMsQ0FBQztJQUM5QkQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBR0EsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNuQjtBQUNGO0FBRUEsU0FBU0UsbUJBQW1CQSxDQUFDQyxXQUFXLEVBQUU7RUFDeEMsSUFBSSxDQUFDQSxXQUFXLElBQUksQ0FBQ0EsV0FBVyxDQUFDbkMsVUFBVSxFQUFFO0lBQzNDLE9BQU8sSUFBSTtFQUNiO0VBQ0EsSUFBSW9DLEtBQUssR0FBR0QsV0FBVyxDQUFDbkMsVUFBVTtFQUNsQyxLQUFLLElBQUliLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR2lELEtBQUssQ0FBQ3BFLE1BQU0sRUFBRSxFQUFFbUIsQ0FBQyxFQUFFO0lBQ3JDLElBQUlpRCxLQUFLLENBQUNqRCxDQUFDLENBQUMsQ0FBQ2MsR0FBRyxLQUFLLE1BQU0sRUFBRTtNQUMzQixPQUFPbUMsS0FBSyxDQUFDakQsQ0FBQyxDQUFDLENBQUNlLEtBQUs7SUFDdkI7RUFDRjtFQUNBLE9BQU8sSUFBSTtBQUNiO0FBRUEsU0FBU21DLG9CQUFvQkEsQ0FBQ0MsV0FBVyxFQUFFO0VBQ3pDLElBQUlDLFFBQVEsR0FBRyxFQUFFO0VBQ2pCLEtBQUssSUFBSXhFLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR3VFLFdBQVcsQ0FBQ3RFLE1BQU0sRUFBRSxFQUFFRCxDQUFDLEVBQUU7SUFDM0N3RSxRQUFRLENBQUN6QyxJQUFJLENBQUMsSUFBSTBDLE1BQU0sQ0FBQ0YsV0FBVyxDQUFDdkUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7RUFDaEQ7RUFDQSxPQUFPLFVBQVVvRSxXQUFXLEVBQUU7SUFDNUIsSUFBSU0sSUFBSSxHQUFHUCxtQkFBbUIsQ0FBQ0MsV0FBVyxDQUFDO0lBQzNDLElBQUksQ0FBQ00sSUFBSSxFQUFFO01BQ1QsT0FBTyxLQUFLO0lBQ2Q7SUFDQSxLQUFLLElBQUkxRSxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUd3RSxRQUFRLENBQUN2RSxNQUFNLEVBQUUsRUFBRUQsQ0FBQyxFQUFFO01BQ3hDLElBQUl3RSxRQUFRLENBQUN4RSxDQUFDLENBQUMsQ0FBQzJFLElBQUksQ0FBQ0QsSUFBSSxDQUFDLEVBQUU7UUFDMUIsT0FBTyxJQUFJO01BQ2I7SUFDRjtJQUNBLE9BQU8sS0FBSztFQUNkLENBQUM7QUFDSDtBQUVBLFNBQVNFLFlBQVlBLENBQUNDLE9BQU8sRUFBRUMsU0FBUyxFQUFFQyxPQUFPLEVBQUVDLE9BQU8sRUFBRUMsU0FBUyxFQUFFO0VBQ3JFLElBQUksQ0FBQ0osT0FBTyxHQUFHQSxPQUFPO0VBQ3RCLElBQUlLLGNBQWMsR0FBR0wsT0FBTyxDQUFDSyxjQUFjO0VBQzNDLElBQUlMLE9BQU8sQ0FBQ00sT0FBTyxLQUFLLEtBQUssSUFBSUQsY0FBYyxLQUFLLEtBQUssRUFBRTtJQUN6RCxJQUFJLENBQUNBLGNBQWMsR0FBRyxDQUFDLENBQUM7RUFDMUIsQ0FBQyxNQUFNO0lBQ0wsSUFBSSxDQUFDekMsQ0FBQyxDQUFDMkMsTUFBTSxDQUFDRixjQUFjLEVBQUUsUUFBUSxDQUFDLEVBQUU7TUFDdkNBLGNBQWMsR0FBR2xDLFFBQVE7SUFDM0I7SUFDQSxJQUFJLENBQUNrQyxjQUFjLEdBQUd6QyxDQUFDLENBQUM0QyxLQUFLLENBQUNyQyxRQUFRLEVBQUVrQyxjQUFjLENBQUM7RUFDekQ7RUFDQSxJQUFJLENBQUNJLG9CQUFvQixHQUFHLENBQUMsQ0FBQ1QsT0FBTyxDQUFDUyxvQkFBb0I7RUFDMUQsSUFBSSxDQUFDQyxpQkFBaUIsR0FBR1YsT0FBTyxDQUFDVSxpQkFBaUI7RUFDbEQsSUFBSSxDQUFDakIsb0JBQW9CLEdBQUdBLG9CQUFvQixDQUFDTyxPQUFPLENBQUNOLFdBQVcsQ0FBQztFQUNyRSxJQUFJLENBQUNPLFNBQVMsR0FBR0EsU0FBUztFQUMxQixJQUFJLENBQUNDLE9BQU8sR0FBR0EsT0FBTztFQUN0QixJQUFJLENBQUNTLFVBQVUsR0FBR1QsT0FBTyxDQUFDVSxNQUFNLENBQUNDLFFBQVEsQ0FBQ0YsVUFBVTtFQUNwRCxJQUFJLENBQUNSLE9BQU8sR0FBR0EsT0FBTyxJQUFJLENBQUMsQ0FBQztFQUM1QixJQUFJLENBQUNDLFNBQVMsR0FBR0EsU0FBUyxJQUFJLENBQUMsQ0FBQztFQUNoQyxJQUFJLENBQUNqQixZQUFZLEdBQUc7SUFDbEJmLE9BQU8sRUFBRSxFQUFFO0lBQ1hRLEdBQUcsRUFBRSxFQUFFO0lBQ1BFLFVBQVUsRUFBRSxFQUFFO0lBQ2RDLFlBQVksRUFBRTtFQUNoQixDQUFDO0VBQ0QsSUFBSSxDQUFDK0IsYUFBYSxHQUFHO0lBQ25CakMsR0FBRyxFQUFFLEVBQUU7SUFDUEUsWUFBWSxFQUFFLEVBQUU7SUFDaEJnQyxxQkFBcUIsRUFBRTtFQUN6QixDQUFDO0VBRUQsSUFBSSxDQUFDQyxTQUFTLEdBQUcsSUFBSSxDQUFDYixPQUFPLENBQUNjLFFBQVE7RUFDdEMsSUFBSSxDQUFDQyxTQUFTLEdBQUcsSUFBSSxDQUFDRixTQUFTLElBQUksSUFBSSxDQUFDQSxTQUFTLENBQUNHLElBQUk7QUFDeEQ7QUFFQXBCLFlBQVksQ0FBQ3FCLFNBQVMsQ0FBQ0MsU0FBUyxHQUFHLFVBQVVyQixPQUFPLEVBQUU7RUFDcEQsSUFBSSxDQUFDQSxPQUFPLEdBQUdwQyxDQUFDLENBQUM0QyxLQUFLLENBQUMsSUFBSSxDQUFDUixPQUFPLEVBQUVBLE9BQU8sQ0FBQztFQUM3QyxJQUFJSyxjQUFjLEdBQUdMLE9BQU8sQ0FBQ0ssY0FBYztFQUMzQyxJQUFJaUIsV0FBVyxHQUFHMUQsQ0FBQyxDQUFDNEMsS0FBSyxDQUFDLElBQUksQ0FBQ0gsY0FBYyxDQUFDO0VBQzlDLElBQUlMLE9BQU8sQ0FBQ00sT0FBTyxLQUFLLEtBQUssSUFBSUQsY0FBYyxLQUFLLEtBQUssRUFBRTtJQUN6RCxJQUFJLENBQUNBLGNBQWMsR0FBRyxDQUFDLENBQUM7RUFDMUIsQ0FBQyxNQUFNO0lBQ0wsSUFBSSxDQUFDekMsQ0FBQyxDQUFDMkMsTUFBTSxDQUFDRixjQUFjLEVBQUUsUUFBUSxDQUFDLEVBQUU7TUFDdkNBLGNBQWMsR0FBR2xDLFFBQVE7SUFDM0I7SUFDQSxJQUFJLENBQUNrQyxjQUFjLEdBQUd6QyxDQUFDLENBQUM0QyxLQUFLLENBQUNyQyxRQUFRLEVBQUVrQyxjQUFjLENBQUM7RUFDekQ7RUFDQSxJQUFJLENBQUNrQixVQUFVLENBQUNELFdBQVcsQ0FBQztFQUM1QixJQUFJdEIsT0FBTyxDQUFDUyxvQkFBb0IsS0FBSzdFLFNBQVMsRUFBRTtJQUM5QyxJQUFJLENBQUM2RSxvQkFBb0IsR0FBRyxDQUFDLENBQUNULE9BQU8sQ0FBQ1Msb0JBQW9CO0VBQzVEO0VBQ0EsSUFBSVQsT0FBTyxDQUFDVSxpQkFBaUIsS0FBSzlFLFNBQVMsRUFBRTtJQUMzQyxJQUFJLENBQUM4RSxpQkFBaUIsR0FBR1YsT0FBTyxDQUFDVSxpQkFBaUI7RUFDcEQ7QUFDRixDQUFDOztBQUVEO0FBQ0FYLFlBQVksQ0FBQ3FCLFNBQVMsQ0FBQ0csVUFBVSxHQUFHLFVBQVVELFdBQVcsRUFBRTtFQUN6RCxJQUFJLElBQUksQ0FBQ2pCLGNBQWMsQ0FBQ2pDLE9BQU8sSUFBSSxFQUFFa0QsV0FBVyxJQUFJQSxXQUFXLENBQUNsRCxPQUFPLENBQUMsRUFBRTtJQUN4RSxJQUFJLENBQUNvRCxpQkFBaUIsQ0FBQyxDQUFDO0VBQzFCLENBQUMsTUFBTSxJQUNMLENBQUMsSUFBSSxDQUFDbkIsY0FBYyxDQUFDakMsT0FBTyxJQUM1QmtELFdBQVcsSUFDWEEsV0FBVyxDQUFDbEQsT0FBTyxFQUNuQjtJQUNBLElBQUksQ0FBQ3FELG1CQUFtQixDQUFDLENBQUM7RUFDNUI7RUFFQSxJQUFJLElBQUksQ0FBQ3BCLGNBQWMsQ0FBQ3pCLEdBQUcsSUFBSSxFQUFFMEMsV0FBVyxJQUFJQSxXQUFXLENBQUMxQyxHQUFHLENBQUMsRUFBRTtJQUNoRSxJQUFJLENBQUM4QyxpQkFBaUIsQ0FBQyxDQUFDO0VBQzFCLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDckIsY0FBYyxDQUFDekIsR0FBRyxJQUFJMEMsV0FBVyxJQUFJQSxXQUFXLENBQUMxQyxHQUFHLEVBQUU7SUFDckUsSUFBSSxDQUFDK0MsbUJBQW1CLENBQUMsQ0FBQztFQUM1QjtFQUVBLElBQUksSUFBSSxDQUFDdEIsY0FBYyxDQUFDeEIsR0FBRyxJQUFJLEVBQUV5QyxXQUFXLElBQUlBLFdBQVcsQ0FBQ3pDLEdBQUcsQ0FBQyxFQUFFO0lBQ2hFLElBQUksQ0FBQytDLGFBQWEsQ0FBQyxDQUFDO0VBQ3RCLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDdkIsY0FBYyxDQUFDeEIsR0FBRyxJQUFJeUMsV0FBVyxJQUFJQSxXQUFXLENBQUN6QyxHQUFHLEVBQUU7SUFDckUsSUFBSSxDQUFDZ0QsZUFBZSxDQUFDLENBQUM7RUFDeEI7RUFFQSxJQUNFLElBQUksQ0FBQ3hCLGNBQWMsQ0FBQ3ZCLFVBQVUsSUFDOUIsRUFBRXdDLFdBQVcsSUFBSUEsV0FBVyxDQUFDeEMsVUFBVSxDQUFDLEVBQ3hDO0lBQ0EsSUFBSSxDQUFDZ0Qsb0JBQW9CLENBQUMsQ0FBQztFQUM3QixDQUFDLE1BQU0sSUFDTCxDQUFDLElBQUksQ0FBQ3pCLGNBQWMsQ0FBQ3ZCLFVBQVUsSUFDL0J3QyxXQUFXLElBQ1hBLFdBQVcsQ0FBQ3hDLFVBQVUsRUFDdEI7SUFDQSxJQUFJLENBQUNpRCxzQkFBc0IsQ0FBQyxDQUFDO0VBQy9CO0VBRUEsSUFDRSxJQUFJLENBQUMxQixjQUFjLENBQUN0QixZQUFZLElBQ2hDLEVBQUV1QyxXQUFXLElBQUlBLFdBQVcsQ0FBQ3ZDLFlBQVksQ0FBQyxFQUMxQztJQUNBLElBQUksQ0FBQ2lELHNCQUFzQixDQUFDLENBQUM7RUFDL0IsQ0FBQyxNQUFNLElBQ0wsQ0FBQyxJQUFJLENBQUMzQixjQUFjLENBQUN0QixZQUFZLElBQ2pDdUMsV0FBVyxJQUNYQSxXQUFXLENBQUN2QyxZQUFZLEVBQ3hCO0lBQ0EsSUFBSSxDQUFDa0Qsd0JBQXdCLENBQUMsQ0FBQztFQUNqQztFQUVBLElBQ0UsSUFBSSxDQUFDNUIsY0FBYyxDQUFDckIscUJBQXFCLElBQ3pDLEVBQUVzQyxXQUFXLElBQUlBLFdBQVcsQ0FBQ3RDLHFCQUFxQixDQUFDLEVBQ25EO0lBQ0EsSUFBSSxDQUFDa0QsK0JBQStCLENBQUMsQ0FBQztFQUN4QyxDQUFDLE1BQU0sSUFDTCxDQUFDLElBQUksQ0FBQzdCLGNBQWMsQ0FBQ3JCLHFCQUFxQixJQUMxQ3NDLFdBQVcsSUFDWEEsV0FBVyxDQUFDdEMscUJBQXFCLEVBQ2pDO0lBQ0EsSUFBSSxDQUFDbUQsaUNBQWlDLENBQUMsQ0FBQztFQUMxQztBQUNGLENBQUM7QUFFRHBDLFlBQVksQ0FBQ3FCLFNBQVMsQ0FBQ0ssbUJBQW1CLEdBQUcsWUFBWTtFQUN2RHZDLE9BQU8sQ0FBQyxJQUFJLENBQUNDLFlBQVksRUFBRSxTQUFTLENBQUM7QUFDdkMsQ0FBQztBQUVEWSxZQUFZLENBQUNxQixTQUFTLENBQUNJLGlCQUFpQixHQUFHLFlBQVk7RUFDckQsSUFBSVksSUFBSSxHQUFHLElBQUk7RUFFZixTQUFTQyxRQUFRQSxDQUFDQyxJQUFJLEVBQUVDLEdBQUcsRUFBRTtJQUMzQixJQUFJRCxJQUFJLElBQUlDLEdBQUcsSUFBSTNFLENBQUMsQ0FBQzRFLFVBQVUsQ0FBQ0QsR0FBRyxDQUFDRCxJQUFJLENBQUMsQ0FBQyxFQUFFO01BQzFDdkUsT0FBTyxDQUFDd0UsR0FBRyxFQUFFRCxJQUFJLEVBQUUsVUFBVUcsSUFBSSxFQUFFO1FBQ2pDLE9BQU9MLElBQUksQ0FBQ2xDLE9BQU8sQ0FBQ3dDLElBQUksQ0FBQ0QsSUFBSSxDQUFDO01BQ2hDLENBQUMsQ0FBQztJQUNKO0VBQ0Y7RUFFQSxJQUFJLGdCQUFnQixJQUFJLElBQUksQ0FBQ3RDLE9BQU8sRUFBRTtJQUNwQyxJQUFJd0MsSUFBSSxHQUFHLElBQUksQ0FBQ3hDLE9BQU8sQ0FBQ3lDLGNBQWMsQ0FBQ3hCLFNBQVM7SUFDaERyRCxPQUFPLENBQ0w0RSxJQUFJLEVBQ0osTUFBTSxFQUNOLFVBQVVGLElBQUksRUFBRTtNQUNkLE9BQU8sVUFBVUksTUFBTSxFQUFFQyxHQUFHLEVBQUU7UUFDNUIsSUFBSUMsV0FBVyxHQUFHQyxZQUFZLENBQUNGLEdBQUcsQ0FBQztRQUNuQyxJQUFJbEYsQ0FBQyxDQUFDMkMsTUFBTSxDQUFDdUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxJQUFJQyxXQUFXLEVBQUU7VUFDMUNELEdBQUcsR0FBR0MsV0FBVyxHQUFHRCxHQUFHLENBQUNHLFFBQVEsQ0FBQyxDQUFDLEdBQUdILEdBQUc7VUFDeEMsSUFBSSxJQUFJLENBQUNJLGFBQWEsRUFBRTtZQUN0QixJQUFJLENBQUNBLGFBQWEsQ0FBQ0wsTUFBTSxHQUFHQSxNQUFNO1lBQ2xDLElBQUksQ0FBQ0ssYUFBYSxDQUFDSixHQUFHLEdBQUdBLEdBQUc7WUFDNUIsSUFBSSxDQUFDSSxhQUFhLENBQUNDLFdBQVcsR0FBRyxJQUFJO1lBQ3JDLElBQUksQ0FBQ0QsYUFBYSxDQUFDRSxhQUFhLEdBQUd4RixDQUFDLENBQUN5RixHQUFHLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUNILGFBQWEsQ0FBQ0ksV0FBVyxHQUFHLElBQUk7VUFDdkMsQ0FBQyxNQUFNO1lBQ0wsSUFBSSxDQUFDSixhQUFhLEdBQUc7Y0FDbkJMLE1BQU0sRUFBRUEsTUFBTTtjQUNkQyxHQUFHLEVBQUVBLEdBQUc7Y0FDUkssV0FBVyxFQUFFLElBQUk7Y0FDakJDLGFBQWEsRUFBRXhGLENBQUMsQ0FBQ3lGLEdBQUcsQ0FBQyxDQUFDO2NBQ3RCQyxXQUFXLEVBQUU7WUFDZixDQUFDO1VBQ0g7UUFDRjtRQUNBLE9BQU9iLElBQUksQ0FBQ2MsS0FBSyxDQUFDLElBQUksRUFBRUMsU0FBUyxDQUFDO01BQ3BDLENBQUM7SUFDSCxDQUFDLEVBQ0QsSUFBSSxDQUFDckUsWUFBWSxFQUNqQixTQUNGLENBQUM7SUFFRHBCLE9BQU8sQ0FDTDRFLElBQUksRUFDSixrQkFBa0IsRUFDbEIsVUFBVUYsSUFBSSxFQUFFO01BQ2QsT0FBTyxVQUFVZ0IsTUFBTSxFQUFFbkcsS0FBSyxFQUFFO1FBQzlCO1FBQ0EsSUFBSSxDQUFDLElBQUksQ0FBQzRGLGFBQWEsRUFBRTtVQUN2QixJQUFJLENBQUNBLGFBQWEsR0FBRyxDQUFDLENBQUM7UUFDekI7UUFDQSxJQUFJdEYsQ0FBQyxDQUFDMkMsTUFBTSxDQUFDa0QsTUFBTSxFQUFFLFFBQVEsQ0FBQyxJQUFJN0YsQ0FBQyxDQUFDMkMsTUFBTSxDQUFDakQsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFFO1VBQzNELElBQUk4RSxJQUFJLENBQUMvQixjQUFjLENBQUM5QixxQkFBcUIsRUFBRTtZQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDMkUsYUFBYSxDQUFDUSxlQUFlLEVBQUU7Y0FDdkMsSUFBSSxDQUFDUixhQUFhLENBQUNRLGVBQWUsR0FBRyxDQUFDLENBQUM7WUFDekM7WUFDQSxJQUFJLENBQUNSLGFBQWEsQ0FBQ1EsZUFBZSxDQUFDRCxNQUFNLENBQUMsR0FBR25HLEtBQUs7VUFDcEQ7VUFDQTtVQUNBLElBQUltRyxNQUFNLENBQUM1SSxXQUFXLENBQUMsQ0FBQyxLQUFLLGNBQWMsRUFBRTtZQUMzQyxJQUFJLENBQUNxSSxhQUFhLENBQUNTLG9CQUFvQixHQUFHckcsS0FBSztVQUNqRDtRQUNGO1FBQ0EsT0FBT21GLElBQUksQ0FBQ2MsS0FBSyxDQUFDLElBQUksRUFBRUMsU0FBUyxDQUFDO01BQ3BDLENBQUM7SUFDSCxDQUFDLEVBQ0QsSUFBSSxDQUFDckUsWUFBWSxFQUNqQixTQUNGLENBQUM7SUFFRHBCLE9BQU8sQ0FDTDRFLElBQUksRUFDSixNQUFNLEVBQ04sVUFBVUYsSUFBSSxFQUFFO01BQ2Q7TUFDQSxPQUFPLFVBQVVtQixJQUFJLEVBQUU7UUFDckI7UUFDQSxJQUFJckIsR0FBRyxHQUFHLElBQUk7UUFFZCxTQUFTc0IseUJBQXlCQSxDQUFBLEVBQUc7VUFDbkMsSUFBSXRCLEdBQUcsQ0FBQ1csYUFBYSxFQUFFO1lBQ3JCLElBQUlYLEdBQUcsQ0FBQ1csYUFBYSxDQUFDQyxXQUFXLEtBQUssSUFBSSxFQUFFO2NBQzFDWixHQUFHLENBQUNXLGFBQWEsQ0FBQ0MsV0FBVyxHQUFHLENBQUM7Y0FDakMsSUFBSWYsSUFBSSxDQUFDL0IsY0FBYyxDQUFDN0Isa0JBQWtCLEVBQUU7Z0JBQzFDK0QsR0FBRyxDQUFDVyxhQUFhLENBQUNZLE9BQU8sR0FBR0YsSUFBSTtjQUNsQztjQUNBckIsR0FBRyxDQUFDd0IsZUFBZSxHQUFHM0IsSUFBSSxDQUFDNEIsY0FBYyxDQUN2Q3pCLEdBQUcsQ0FBQ1csYUFBYSxFQUNqQixLQUFLLEVBQ0x0SCxTQUNGLENBQUM7WUFDSDtZQUNBLElBQUkyRyxHQUFHLENBQUMwQixVQUFVLEdBQUcsQ0FBQyxFQUFFO2NBQ3RCMUIsR0FBRyxDQUFDVyxhQUFhLENBQUNFLGFBQWEsR0FBR3hGLENBQUMsQ0FBQ3lGLEdBQUcsQ0FBQyxDQUFDO1lBQzNDO1lBQ0EsSUFBSWQsR0FBRyxDQUFDMEIsVUFBVSxHQUFHLENBQUMsRUFBRTtjQUN0QjFCLEdBQUcsQ0FBQ1csYUFBYSxDQUFDSSxXQUFXLEdBQUcxRixDQUFDLENBQUN5RixHQUFHLENBQUMsQ0FBQztjQUV2QyxJQUFJdkYsT0FBTyxHQUFHLElBQUk7Y0FDbEJ5RSxHQUFHLENBQUNXLGFBQWEsQ0FBQ2dCLHFCQUFxQixHQUNyQzNCLEdBQUcsQ0FBQzRCLGlCQUFpQixDQUFDLGNBQWMsQ0FBQztjQUN2QyxJQUFJL0IsSUFBSSxDQUFDL0IsY0FBYyxDQUFDaEMsc0JBQXNCLEVBQUU7Z0JBQzlDLElBQUkrRixhQUFhLEdBQ2ZoQyxJQUFJLENBQUMvQixjQUFjLENBQUNoQyxzQkFBc0I7Z0JBQzVDUCxPQUFPLEdBQUcsQ0FBQyxDQUFDO2dCQUNaLElBQUk7a0JBQ0YsSUFBSTJGLE1BQU0sRUFBRXRJLENBQUM7a0JBQ2IsSUFBSWlKLGFBQWEsS0FBSyxJQUFJLEVBQUU7b0JBQzFCLElBQUlDLFVBQVUsR0FBRzlCLEdBQUcsQ0FBQytCLHFCQUFxQixDQUFDLENBQUM7b0JBQzVDLElBQUlELFVBQVUsRUFBRTtzQkFDZCxJQUFJRSxHQUFHLEdBQUdGLFVBQVUsQ0FBQ0csSUFBSSxDQUFDLENBQUMsQ0FBQy9HLEtBQUssQ0FBQyxTQUFTLENBQUM7c0JBQzVDLElBQUlnSCxLQUFLLEVBQUVuSCxLQUFLO3NCQUNoQixLQUFLbkMsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHb0osR0FBRyxDQUFDbkosTUFBTSxFQUFFRCxDQUFDLEVBQUUsRUFBRTt3QkFDL0JzSixLQUFLLEdBQUdGLEdBQUcsQ0FBQ3BKLENBQUMsQ0FBQyxDQUFDc0MsS0FBSyxDQUFDLElBQUksQ0FBQzt3QkFDMUJnRyxNQUFNLEdBQUdnQixLQUFLLENBQUNwRixLQUFLLENBQUMsQ0FBQzt3QkFDdEIvQixLQUFLLEdBQUdtSCxLQUFLLENBQUMxSCxJQUFJLENBQUMsSUFBSSxDQUFDO3dCQUN4QmUsT0FBTyxDQUFDMkYsTUFBTSxDQUFDLEdBQUduRyxLQUFLO3NCQUN6QjtvQkFDRjtrQkFDRixDQUFDLE1BQU07b0JBQ0wsS0FBS25DLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR2lKLGFBQWEsQ0FBQ2hKLE1BQU0sRUFBRUQsQ0FBQyxFQUFFLEVBQUU7c0JBQ3pDc0ksTUFBTSxHQUFHVyxhQUFhLENBQUNqSixDQUFDLENBQUM7c0JBQ3pCMkMsT0FBTyxDQUFDMkYsTUFBTSxDQUFDLEdBQUdsQixHQUFHLENBQUM0QixpQkFBaUIsQ0FBQ1YsTUFBTSxDQUFDO29CQUNqRDtrQkFDRjtnQkFDRixDQUFDLENBQUMsT0FBTzlJLENBQUMsRUFBRTtrQkFDVjtBQUNwQjtnQkFEb0I7Y0FHSjtjQUNBLElBQUkrSixJQUFJLEdBQUcsSUFBSTtjQUNmLElBQUl0QyxJQUFJLENBQUMvQixjQUFjLENBQUMvQixtQkFBbUIsRUFBRTtnQkFDM0MsSUFBSTtrQkFDRm9HLElBQUksR0FBR25DLEdBQUcsQ0FBQ29DLFlBQVk7Z0JBQ3pCLENBQUMsQ0FBQyxPQUFPaEssQ0FBQyxFQUFFO2tCQUNWO2dCQUFBO2NBRUo7Y0FDQSxJQUFJaUssUUFBUSxHQUFHLElBQUk7Y0FDbkIsSUFBSUYsSUFBSSxJQUFJNUcsT0FBTyxFQUFFO2dCQUNuQjhHLFFBQVEsR0FBRyxDQUFDLENBQUM7Z0JBQ2IsSUFBSUYsSUFBSSxFQUFFO2tCQUNSLElBQ0V0QyxJQUFJLENBQUN5QyxpQkFBaUIsQ0FDcEJ0QyxHQUFHLENBQUNXLGFBQWEsQ0FBQ2dCLHFCQUNwQixDQUFDLEVBQ0Q7b0JBQ0FVLFFBQVEsQ0FBQ0YsSUFBSSxHQUFHdEMsSUFBSSxDQUFDMEMsU0FBUyxDQUFDSixJQUFJLENBQUM7a0JBQ3RDLENBQUMsTUFBTTtvQkFDTEUsUUFBUSxDQUFDRixJQUFJLEdBQUdBLElBQUk7a0JBQ3RCO2dCQUNGO2dCQUNBLElBQUk1RyxPQUFPLEVBQUU7a0JBQ1g4RyxRQUFRLENBQUM5RyxPQUFPLEdBQUdBLE9BQU87Z0JBQzVCO2NBQ0Y7Y0FDQSxJQUFJOEcsUUFBUSxFQUFFO2dCQUNackMsR0FBRyxDQUFDVyxhQUFhLENBQUMwQixRQUFRLEdBQUdBLFFBQVE7Y0FDdkM7Y0FDQSxJQUFJO2dCQUNGLElBQUlHLElBQUksR0FBR3hDLEdBQUcsQ0FBQ3lDLE1BQU07Z0JBQ3JCRCxJQUFJLEdBQUdBLElBQUksS0FBSyxJQUFJLEdBQUcsR0FBRyxHQUFHQSxJQUFJO2dCQUNqQ3hDLEdBQUcsQ0FBQ1csYUFBYSxDQUFDQyxXQUFXLEdBQUc0QixJQUFJO2dCQUNwQ3hDLEdBQUcsQ0FBQ3dCLGVBQWUsQ0FBQ2tCLEtBQUssR0FDdkI3QyxJQUFJLENBQUNuQyxTQUFTLENBQUNpRixlQUFlLENBQUNILElBQUksQ0FBQztnQkFDdEMzQyxJQUFJLENBQUMrQyxpQkFBaUIsQ0FBQzVDLEdBQUcsQ0FBQ1csYUFBYSxDQUFDO2NBQzNDLENBQUMsQ0FBQyxPQUFPdkksQ0FBQyxFQUFFO2dCQUNWO2NBQUE7WUFFSjtVQUNGO1FBQ0Y7UUFFQTBILFFBQVEsQ0FBQyxRQUFRLEVBQUVFLEdBQUcsQ0FBQztRQUN2QkYsUUFBUSxDQUFDLFNBQVMsRUFBRUUsR0FBRyxDQUFDO1FBQ3hCRixRQUFRLENBQUMsWUFBWSxFQUFFRSxHQUFHLENBQUM7UUFFM0IsSUFDRSxvQkFBb0IsSUFBSUEsR0FBRyxJQUMzQjNFLENBQUMsQ0FBQzRFLFVBQVUsQ0FBQ0QsR0FBRyxDQUFDNkMsa0JBQWtCLENBQUMsRUFDcEM7VUFDQXJILE9BQU8sQ0FBQ3dFLEdBQUcsRUFBRSxvQkFBb0IsRUFBRSxVQUFVRSxJQUFJLEVBQUU7WUFDakQsT0FBT0wsSUFBSSxDQUFDbEMsT0FBTyxDQUFDd0MsSUFBSSxDQUN0QkQsSUFBSSxFQUNKN0csU0FBUyxFQUNUaUkseUJBQ0YsQ0FBQztVQUNILENBQUMsQ0FBQztRQUNKLENBQUMsTUFBTTtVQUNMdEIsR0FBRyxDQUFDNkMsa0JBQWtCLEdBQUd2Qix5QkFBeUI7UUFDcEQ7UUFDQSxJQUFJdEIsR0FBRyxDQUFDVyxhQUFhLElBQUlkLElBQUksQ0FBQ2lELGVBQWUsQ0FBQyxDQUFDLEVBQUU7VUFDL0M5QyxHQUFHLENBQUNXLGFBQWEsQ0FBQ29DLEtBQUssR0FBRyxJQUFJQyxLQUFLLENBQUMsQ0FBQyxDQUFDRCxLQUFLO1FBQzdDO1FBQ0EsT0FBTzdDLElBQUksQ0FBQ2MsS0FBSyxDQUFDLElBQUksRUFBRUMsU0FBUyxDQUFDO01BQ3BDLENBQUM7SUFDSCxDQUFDLEVBQ0QsSUFBSSxDQUFDckUsWUFBWSxFQUNqQixTQUNGLENBQUM7RUFDSDtFQUVBLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQ2dCLE9BQU8sRUFBRTtJQUMzQnBDLE9BQU8sQ0FDTCxJQUFJLENBQUNvQyxPQUFPLEVBQ1osT0FBTyxFQUNQLFVBQVVzQyxJQUFJLEVBQUU7TUFDZDtNQUNBLE9BQU8sVUFBVStDLEVBQUUsRUFBRUMsQ0FBQyxFQUFFO1FBQ3RCO1FBQ0EsSUFBSUMsSUFBSSxHQUFHLElBQUlDLEtBQUssQ0FBQ25DLFNBQVMsQ0FBQ3BJLE1BQU0sQ0FBQztRQUN0QyxLQUFLLElBQUlELENBQUMsR0FBRyxDQUFDLEVBQUV3QixHQUFHLEdBQUcrSSxJQUFJLENBQUN0SyxNQUFNLEVBQUVELENBQUMsR0FBR3dCLEdBQUcsRUFBRXhCLENBQUMsRUFBRSxFQUFFO1VBQy9DdUssSUFBSSxDQUFDdkssQ0FBQyxDQUFDLEdBQUdxSSxTQUFTLENBQUNySSxDQUFDLENBQUM7UUFDeEI7UUFDQSxJQUFJeUssS0FBSyxHQUFHRixJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ25CLElBQUk3QyxNQUFNLEdBQUcsS0FBSztRQUNsQixJQUFJQyxHQUFHO1FBQ1AsSUFBSUMsV0FBVyxHQUFHQyxZQUFZLENBQUM0QyxLQUFLLENBQUM7UUFDckMsSUFBSWhJLENBQUMsQ0FBQzJDLE1BQU0sQ0FBQ3FGLEtBQUssRUFBRSxRQUFRLENBQUMsSUFBSTdDLFdBQVcsRUFBRTtVQUM1Q0QsR0FBRyxHQUFHQyxXQUFXLEdBQUc2QyxLQUFLLENBQUMzQyxRQUFRLENBQUMsQ0FBQyxHQUFHMkMsS0FBSztRQUM5QyxDQUFDLE1BQU0sSUFBSUEsS0FBSyxFQUFFO1VBQ2hCOUMsR0FBRyxHQUFHOEMsS0FBSyxDQUFDOUMsR0FBRztVQUNmLElBQUk4QyxLQUFLLENBQUMvQyxNQUFNLEVBQUU7WUFDaEJBLE1BQU0sR0FBRytDLEtBQUssQ0FBQy9DLE1BQU07VUFDdkI7UUFDRjtRQUNBLElBQUk2QyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUlBLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzdDLE1BQU0sRUFBRTtVQUM3QkEsTUFBTSxHQUFHNkMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDN0MsTUFBTTtRQUN6QjtRQUNBLElBQUlnRCxRQUFRLEdBQUc7VUFDYmhELE1BQU0sRUFBRUEsTUFBTTtVQUNkQyxHQUFHLEVBQUVBLEdBQUc7VUFDUkssV0FBVyxFQUFFLElBQUk7VUFDakJDLGFBQWEsRUFBRXhGLENBQUMsQ0FBQ3lGLEdBQUcsQ0FBQyxDQUFDO1VBQ3RCQyxXQUFXLEVBQUU7UUFDZixDQUFDO1FBQ0QsSUFBSW9DLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSUEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDNUgsT0FBTyxFQUFFO1VBQzlCO1VBQ0E7VUFDQSxJQUFJZ0ksVUFBVSxHQUFHaEksT0FBTyxDQUFDNEgsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDNUgsT0FBTyxDQUFDO1VBRXpDK0gsUUFBUSxDQUFDbEMsb0JBQW9CLEdBQUdtQyxVQUFVLENBQUNDLEdBQUcsQ0FBQyxjQUFjLENBQUM7VUFFOUQsSUFBSTNELElBQUksQ0FBQy9CLGNBQWMsQ0FBQzlCLHFCQUFxQixFQUFFO1lBQzdDc0gsUUFBUSxDQUFDbkMsZUFBZSxHQUFHdEIsSUFBSSxDQUFDNEQsWUFBWSxDQUMxQ0YsVUFBVSxFQUNWMUQsSUFBSSxDQUFDL0IsY0FBYyxDQUFDOUIscUJBQ3RCLENBQUM7VUFDSDtRQUNGO1FBRUEsSUFBSTZELElBQUksQ0FBQy9CLGNBQWMsQ0FBQzdCLGtCQUFrQixFQUFFO1VBQzFDLElBQUlrSCxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUlBLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQ2hCLElBQUksRUFBRTtZQUMzQm1CLFFBQVEsQ0FBQy9CLE9BQU8sR0FBRzRCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQ2hCLElBQUk7VUFDakMsQ0FBQyxNQUFNLElBQ0xnQixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQ1AsQ0FBQzlILENBQUMsQ0FBQzJDLE1BQU0sQ0FBQ21GLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsSUFDNUJBLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQ2hCLElBQUksRUFDWjtZQUNBbUIsUUFBUSxDQUFDL0IsT0FBTyxHQUFHNEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDaEIsSUFBSTtVQUNqQztRQUNGO1FBQ0F0QyxJQUFJLENBQUM0QixjQUFjLENBQUM2QixRQUFRLEVBQUUsT0FBTyxFQUFFakssU0FBUyxDQUFDO1FBQ2pELElBQUl3RyxJQUFJLENBQUNpRCxlQUFlLENBQUMsQ0FBQyxFQUFFO1VBQzFCUSxRQUFRLENBQUNQLEtBQUssR0FBRyxJQUFJQyxLQUFLLENBQUMsQ0FBQyxDQUFDRCxLQUFLO1FBQ3BDOztRQUVBO1FBQ0E7UUFDQSxPQUFPN0MsSUFBSSxDQUFDYyxLQUFLLENBQUMsSUFBSSxFQUFFbUMsSUFBSSxDQUFDLENBQUNPLElBQUksQ0FBQyxVQUFVQyxJQUFJLEVBQUU7VUFDakRMLFFBQVEsQ0FBQ3ZDLFdBQVcsR0FBRzFGLENBQUMsQ0FBQ3lGLEdBQUcsQ0FBQyxDQUFDO1VBQzlCd0MsUUFBUSxDQUFDMUMsV0FBVyxHQUFHK0MsSUFBSSxDQUFDbEIsTUFBTTtVQUNsQ2EsUUFBUSxDQUFDM0IscUJBQXFCLEdBQUdnQyxJQUFJLENBQUNwSSxPQUFPLENBQUNpSSxHQUFHLENBQUMsY0FBYyxDQUFDO1VBQ2pFLElBQUlqSSxPQUFPLEdBQUcsSUFBSTtVQUNsQixJQUFJc0UsSUFBSSxDQUFDL0IsY0FBYyxDQUFDaEMsc0JBQXNCLEVBQUU7WUFDOUNQLE9BQU8sR0FBR3NFLElBQUksQ0FBQzRELFlBQVksQ0FDekJFLElBQUksQ0FBQ3BJLE9BQU8sRUFDWnNFLElBQUksQ0FBQy9CLGNBQWMsQ0FBQ2hDLHNCQUN0QixDQUFDO1VBQ0g7VUFDQSxJQUFJcUcsSUFBSSxHQUFHLElBQUk7VUFDZixJQUFJdEMsSUFBSSxDQUFDL0IsY0FBYyxDQUFDL0IsbUJBQW1CLEVBQUU7WUFDM0MsSUFBSSxPQUFPNEgsSUFBSSxDQUFDQyxJQUFJLEtBQUssVUFBVSxFQUFFO2NBQ25DO2NBQ0E7Y0FDQTtjQUNBekIsSUFBSSxHQUFHd0IsSUFBSSxDQUFDRSxLQUFLLENBQUMsQ0FBQyxDQUFDRCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUI7VUFDRjtVQUNBLElBQUlySSxPQUFPLElBQUk0RyxJQUFJLEVBQUU7WUFDbkJtQixRQUFRLENBQUNqQixRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLElBQUlGLElBQUksRUFBRTtjQUNSO2NBQ0EsSUFBSSxPQUFPQSxJQUFJLENBQUN1QixJQUFJLEtBQUssVUFBVSxFQUFFO2dCQUNuQ3ZCLElBQUksQ0FBQ3VCLElBQUksQ0FBQyxVQUFVRSxJQUFJLEVBQUU7a0JBQ3hCLElBQ0VBLElBQUksSUFDSi9ELElBQUksQ0FBQ3lDLGlCQUFpQixDQUFDZ0IsUUFBUSxDQUFDM0IscUJBQXFCLENBQUMsRUFDdEQ7b0JBQ0EyQixRQUFRLENBQUNqQixRQUFRLENBQUNGLElBQUksR0FBR3RDLElBQUksQ0FBQzBDLFNBQVMsQ0FBQ3FCLElBQUksQ0FBQztrQkFDL0MsQ0FBQyxNQUFNO29CQUNMTixRQUFRLENBQUNqQixRQUFRLENBQUNGLElBQUksR0FBR3lCLElBQUk7a0JBQy9CO2dCQUNGLENBQUMsQ0FBQztjQUNKLENBQUMsTUFBTTtnQkFDTE4sUUFBUSxDQUFDakIsUUFBUSxDQUFDRixJQUFJLEdBQUdBLElBQUk7Y0FDL0I7WUFDRjtZQUNBLElBQUk1RyxPQUFPLEVBQUU7Y0FDWCtILFFBQVEsQ0FBQ2pCLFFBQVEsQ0FBQzlHLE9BQU8sR0FBR0EsT0FBTztZQUNyQztVQUNGO1VBQ0FzRSxJQUFJLENBQUMrQyxpQkFBaUIsQ0FBQ1UsUUFBUSxDQUFDO1VBQ2hDLE9BQU9LLElBQUk7UUFDYixDQUFDLENBQUM7TUFDSixDQUFDO0lBQ0gsQ0FBQyxFQUNELElBQUksQ0FBQy9HLFlBQVksRUFDakIsU0FDRixDQUFDO0VBQ0g7QUFDRixDQUFDO0FBRURZLFlBQVksQ0FBQ3FCLFNBQVMsQ0FBQzRDLGNBQWMsR0FBRyxVQUN0QzZCLFFBQVEsRUFDUlEsT0FBTyxFQUNQQyxXQUFXLEVBQ1g7RUFDQSxJQUNFVCxRQUFRLENBQUMvQixPQUFPLElBQ2hCLElBQUksQ0FBQ2UsaUJBQWlCLENBQUNnQixRQUFRLENBQUNsQyxvQkFBb0IsQ0FBQyxFQUNyRDtJQUNBa0MsUUFBUSxDQUFDL0IsT0FBTyxHQUFHLElBQUksQ0FBQ2dCLFNBQVMsQ0FBQ2UsUUFBUSxDQUFDL0IsT0FBTyxDQUFDO0VBQ3JEO0VBQ0EsT0FBTyxJQUFJLENBQUM3RCxTQUFTLENBQUMrRCxjQUFjLENBQUM2QixRQUFRLEVBQUVRLE9BQU8sRUFBRUMsV0FBVyxDQUFDO0FBQ3RFLENBQUM7QUFFRHZHLFlBQVksQ0FBQ3FCLFNBQVMsQ0FBQ3lELGlCQUFpQixHQUFHLFVBQVUwQixXQUFXLEVBQUU7RUFDaEUsT0FBT0EsV0FBVyxJQUNoQjNJLENBQUMsQ0FBQzJDLE1BQU0sQ0FBQ2dHLFdBQVcsRUFBRSxRQUFRLENBQUMsSUFDL0JBLFdBQVcsQ0FBQzFMLFdBQVcsQ0FBQyxDQUFDLENBQUMyTCxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQ3hDLElBQUksR0FDSixLQUFLO0FBQ1gsQ0FBQztBQUVEekcsWUFBWSxDQUFDcUIsU0FBUyxDQUFDMEQsU0FBUyxHQUFHLFVBQVUyQixJQUFJLEVBQUU7RUFDakQsT0FBT0MsSUFBSSxDQUFDQyxTQUFTLENBQUMzSSxLQUFLLENBQUMwSSxJQUFJLENBQUNFLEtBQUssQ0FBQ0gsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDekcsT0FBTyxDQUFDTixXQUFXLENBQUMsQ0FBQztBQUMxRSxDQUFDO0FBRURLLFlBQVksQ0FBQ3FCLFNBQVMsQ0FBQzRFLFlBQVksR0FBRyxVQUFVYSxTQUFTLEVBQUV6QyxhQUFhLEVBQUU7RUFDeEUsSUFBSTBDLFVBQVUsR0FBRyxDQUFDLENBQUM7RUFDbkIsSUFBSTtJQUNGLElBQUkzTCxDQUFDO0lBQ0wsSUFBSWlKLGFBQWEsS0FBSyxJQUFJLEVBQUU7TUFDMUIsSUFBSSxPQUFPeUMsU0FBUyxDQUFDRSxPQUFPLEtBQUssVUFBVSxFQUFFO1FBQzNDO1FBQ0EsSUFBSTFDLFVBQVUsR0FBR3dDLFNBQVMsQ0FBQ0UsT0FBTyxDQUFDLENBQUM7UUFDcEMsSUFBSUMsYUFBYSxHQUFHM0MsVUFBVSxDQUFDNEMsSUFBSSxDQUFDLENBQUM7UUFDckMsT0FBTyxDQUFDRCxhQUFhLENBQUNFLElBQUksRUFBRTtVQUMxQkosVUFBVSxDQUFDRSxhQUFhLENBQUMxSixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRzBKLGFBQWEsQ0FBQzFKLEtBQUssQ0FBQyxDQUFDLENBQUM7VUFDM0QwSixhQUFhLEdBQUczQyxVQUFVLENBQUM0QyxJQUFJLENBQUMsQ0FBQztRQUNuQztNQUNGO0lBQ0YsQ0FBQyxNQUFNO01BQ0wsS0FBSzlMLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR2lKLGFBQWEsQ0FBQ2hKLE1BQU0sRUFBRUQsQ0FBQyxFQUFFLEVBQUU7UUFDekMsSUFBSXNJLE1BQU0sR0FBR1csYUFBYSxDQUFDakosQ0FBQyxDQUFDO1FBQzdCMkwsVUFBVSxDQUFDckQsTUFBTSxDQUFDLEdBQUdvRCxTQUFTLENBQUNkLEdBQUcsQ0FBQ3RDLE1BQU0sQ0FBQztNQUM1QztJQUNGO0VBQ0YsQ0FBQyxDQUFDLE9BQU85SSxDQUFDLEVBQUU7SUFDVjtFQUFBO0VBRUYsT0FBT21NLFVBQVU7QUFDbkIsQ0FBQztBQUVEL0csWUFBWSxDQUFDcUIsU0FBUyxDQUFDaUUsZUFBZSxHQUFHLFlBQVk7RUFDbkQsT0FDRSxJQUFJLENBQUNoRixjQUFjLENBQUM1QixxQkFBcUIsSUFDekMsSUFBSSxDQUFDNEIsY0FBYyxDQUFDM0IscUJBQXFCLElBQ3pDLElBQUksQ0FBQzJCLGNBQWMsQ0FBQzFCLG1CQUFtQjtBQUUzQyxDQUFDO0FBRURvQixZQUFZLENBQUNxQixTQUFTLENBQUMrRCxpQkFBaUIsR0FBRyxVQUFVVSxRQUFRLEVBQUU7RUFDN0QsSUFBSWIsTUFBTSxHQUFHYSxRQUFRLENBQUMxQyxXQUFXO0VBRWpDLElBQ0c2QixNQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQzNFLGNBQWMsQ0FBQzVCLHFCQUFxQixJQUMxRHVHLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDM0UsY0FBYyxDQUFDM0IscUJBQXNCLElBQzNEc0csTUFBTSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMzRSxjQUFjLENBQUMxQixtQkFBb0IsRUFDekQ7SUFDQSxJQUFJd0ksS0FBSyxHQUFHLElBQUk1QixLQUFLLENBQUMsa0NBQWtDLEdBQUdQLE1BQU0sQ0FBQztJQUNsRW1DLEtBQUssQ0FBQzdCLEtBQUssR0FBR08sUUFBUSxDQUFDUCxLQUFLO0lBQzVCLElBQUksQ0FBQ3BGLE9BQU8sQ0FBQ2lILEtBQUssQ0FBQ0EsS0FBSyxFQUFFO01BQUVDLFVBQVUsRUFBRTtJQUFFLENBQUMsQ0FBQztFQUM5QztBQUNGLENBQUM7QUFFRHJILFlBQVksQ0FBQ3FCLFNBQVMsQ0FBQ08sbUJBQW1CLEdBQUcsWUFBWTtFQUN2RCxJQUFJLEVBQUUsU0FBUyxJQUFJLElBQUksQ0FBQ3hCLE9BQU8sSUFBSSxJQUFJLENBQUNBLE9BQU8sQ0FBQ2tILE9BQU8sQ0FBQ3pJLEdBQUcsQ0FBQyxFQUFFO0lBQzVEO0VBQ0Y7RUFDQSxJQUFJUSxDQUFDO0VBQ0wsT0FBTyxJQUFJLENBQUNELFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQy9ELE1BQU0sRUFBRTtJQUN0Q2dFLENBQUMsR0FBRyxJQUFJLENBQUNELFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQ0UsS0FBSyxDQUFDLENBQUM7SUFDcEMsSUFBSSxDQUFDYyxPQUFPLENBQUNrSCxPQUFPLENBQUNqSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBR0EsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNuQztBQUNGLENBQUM7QUFFRFcsWUFBWSxDQUFDcUIsU0FBUyxDQUFDTSxpQkFBaUIsR0FBRyxZQUFZO0VBQ3JELElBQUksRUFBRSxTQUFTLElBQUksSUFBSSxDQUFDdkIsT0FBTyxJQUFJLElBQUksQ0FBQ0EsT0FBTyxDQUFDa0gsT0FBTyxDQUFDekksR0FBRyxDQUFDLEVBQUU7SUFDNUQ7RUFDRjtFQUVBLElBQUl3RCxJQUFJLEdBQUcsSUFBSTtFQUNmLElBQUlrRixDQUFDLEdBQUcsSUFBSSxDQUFDbkgsT0FBTyxDQUFDa0gsT0FBTztFQUU1QixTQUFTRSxXQUFXQSxDQUFDMUUsTUFBTSxFQUFFO0lBQzNCLFlBQVk7O0lBQUU7SUFFZCxJQUFJSixJQUFJLEdBQUc2RSxDQUFDLENBQUN6RSxNQUFNLENBQUM7SUFDcEIsSUFBSTJFLFdBQVcsR0FBR0YsQ0FBQztJQUNuQixJQUFJckMsS0FBSyxHQUFHcEMsTUFBTSxLQUFLLE1BQU0sR0FBRyxTQUFTLEdBQUdBLE1BQU07SUFDbER5RSxDQUFDLENBQUN6RSxNQUFNLENBQUMsR0FBRyxZQUFZO01BQ3RCLElBQUk2QyxJQUFJLEdBQUdDLEtBQUssQ0FBQ3ZFLFNBQVMsQ0FBQ3FHLEtBQUssQ0FBQ0MsSUFBSSxDQUFDbEUsU0FBUyxDQUFDO01BQ2hELElBQUltRSxPQUFPLEdBQUcvSixDQUFDLENBQUNnSyxrQkFBa0IsQ0FBQ2xDLElBQUksQ0FBQztNQUN4Q3RELElBQUksQ0FBQ25DLFNBQVMsQ0FBQzRILFVBQVUsQ0FBQ0YsT0FBTyxFQUFFMUMsS0FBSyxFQUFFLElBQUksRUFBRXJILENBQUMsQ0FBQ3lGLEdBQUcsQ0FBQyxDQUFDLENBQUM7TUFDeEQsSUFBSVosSUFBSSxFQUFFO1FBQ1JxRixRQUFRLENBQUMxRyxTQUFTLENBQUNtQyxLQUFLLENBQUNtRSxJQUFJLENBQUNqRixJQUFJLEVBQUUrRSxXQUFXLEVBQUU5QixJQUFJLENBQUM7TUFDeEQ7SUFDRixDQUFDO0lBQ0R0RCxJQUFJLENBQUNqRCxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUNqQyxJQUFJLENBQUMsQ0FBQzJGLE1BQU0sRUFBRUosSUFBSSxDQUFDLENBQUM7RUFDL0M7RUFDQSxJQUFJc0YsT0FBTyxHQUFHLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQztFQUN2RCxJQUFJO0lBQ0YsS0FBSyxJQUFJNU0sQ0FBQyxHQUFHLENBQUMsRUFBRXdCLEdBQUcsR0FBR29MLE9BQU8sQ0FBQzNNLE1BQU0sRUFBRUQsQ0FBQyxHQUFHd0IsR0FBRyxFQUFFeEIsQ0FBQyxFQUFFLEVBQUU7TUFDbERvTSxXQUFXLENBQUNRLE9BQU8sQ0FBQzVNLENBQUMsQ0FBQyxDQUFDO0lBQ3pCO0VBQ0YsQ0FBQyxDQUFDLE9BQU9SLENBQUMsRUFBRTtJQUNWLElBQUksQ0FBQ2dHLFVBQVUsQ0FBQ2UsaUJBQWlCLEdBQUc7TUFBRXlGLEtBQUssRUFBRXhNLENBQUMsQ0FBQ2dOO0lBQVEsQ0FBQztFQUMxRDtBQUNGLENBQUM7QUFFRDVILFlBQVksQ0FBQ3FCLFNBQVMsQ0FBQ1MsZUFBZSxHQUFHLFlBQVk7RUFDbkQsSUFBSSxFQUFFLGtCQUFrQixJQUFJLElBQUksQ0FBQzFCLE9BQU8sSUFBSSxhQUFhLElBQUksSUFBSSxDQUFDQSxPQUFPLENBQUMsRUFBRTtJQUMxRTtFQUNGO0VBQ0EsSUFBSSxDQUFDNkgsZUFBZSxDQUFDLEtBQUssQ0FBQztBQUM3QixDQUFDO0FBRURqSSxZQUFZLENBQUNxQixTQUFTLENBQUNRLGFBQWEsR0FBRyxZQUFZO0VBQ2pELElBQUksRUFBRSxrQkFBa0IsSUFBSSxJQUFJLENBQUN6QixPQUFPLElBQUksYUFBYSxJQUFJLElBQUksQ0FBQ0EsT0FBTyxDQUFDLEVBQUU7SUFDMUU7RUFDRjtFQUNBLElBQUk4SCxZQUFZLEdBQUcsSUFBSSxDQUFDQyxXQUFXLENBQUNDLElBQUksQ0FBQyxJQUFJLENBQUM7RUFDOUMsSUFBSUMsV0FBVyxHQUFHLElBQUksQ0FBQ0MsVUFBVSxDQUFDRixJQUFJLENBQUMsSUFBSSxDQUFDO0VBQzVDLElBQUksQ0FBQ0csV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUNuSSxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRThILFlBQVksRUFBRSxJQUFJLENBQUM7RUFDN0UsSUFBSSxDQUFDSyxXQUFXLENBQ2QsS0FBSyxFQUNMLElBQUksQ0FBQ25JLE9BQU8sRUFDWixNQUFNLEVBQ04sWUFBWSxFQUNaaUksV0FBVyxFQUNYLElBQ0YsQ0FBQztBQUNILENBQUM7QUFFRHJJLFlBQVksQ0FBQ3FCLFNBQVMsQ0FBQzhHLFdBQVcsR0FBRyxVQUFVNU0sR0FBRyxFQUFFO0VBQ2xELElBQUk7SUFDRixJQUFJWCxDQUFDLEdBQUd1RCxPQUFPLENBQUM3QyxtQkFBbUIsQ0FBQ0MsR0FBRyxFQUFFLElBQUksQ0FBQzhFLFNBQVMsQ0FBQztJQUN4RCxJQUFJbUksTUFBTSxHQUFHNU4sQ0FBQyxJQUFJQSxDQUFDLENBQUNPLE9BQU87SUFDM0IsSUFBSXNOLGNBQWMsR0FDaEJ0SyxPQUFPLENBQUNwRCxrQkFBa0IsQ0FBQ0gsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUNsQ3VELE9BQU8sQ0FBQ3BELGtCQUFrQixDQUFDSCxDQUFDLEVBQUUsUUFBUSxDQUFDO0lBQ3pDLElBQ0U0TixNQUFNLEtBQ0xDLGNBQWMsSUFDYnRLLE9BQU8sQ0FBQ3BELGtCQUFrQixDQUFDSCxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFDL0Q7TUFDQSxJQUFJLENBQUM4TixlQUFlLENBQUMsT0FBTyxFQUFFOU4sQ0FBQyxDQUFDO0lBQ2xDLENBQUMsTUFBTSxJQUFJdUQsT0FBTyxDQUFDcEQsa0JBQWtCLENBQUNILENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRTtNQUN4RSxJQUFJLENBQUM4TixlQUFlLENBQUMsT0FBTyxFQUFFOU4sQ0FBQyxFQUFFQSxDQUFDLENBQUMyQyxLQUFLLEVBQUUzQyxDQUFDLENBQUMrTixPQUFPLENBQUM7SUFDdEQ7RUFDRixDQUFDLENBQUMsT0FBT0MsR0FBRyxFQUFFO0lBQ1o7RUFBQTtBQUVKLENBQUM7QUFFRDVJLFlBQVksQ0FBQ3FCLFNBQVMsQ0FBQ2lILFVBQVUsR0FBRyxVQUFVL00sR0FBRyxFQUFFO0VBQ2pELElBQUk7SUFDRixJQUFJWCxDQUFDLEdBQUd1RCxPQUFPLENBQUM3QyxtQkFBbUIsQ0FBQ0MsR0FBRyxFQUFFLElBQUksQ0FBQzhFLFNBQVMsQ0FBQztJQUN4RCxJQUFJekYsQ0FBQyxJQUFJQSxDQUFDLENBQUNPLE9BQU8sRUFBRTtNQUNsQixJQUFJZ0QsT0FBTyxDQUFDcEQsa0JBQWtCLENBQUNILENBQUMsRUFBRSxVQUFVLENBQUMsRUFBRTtRQUM3QyxJQUFJLENBQUM4TixlQUFlLENBQUMsT0FBTyxFQUFFOU4sQ0FBQyxFQUFFQSxDQUFDLENBQUMyQyxLQUFLLENBQUM7TUFDM0MsQ0FBQyxNQUFNLElBQ0xZLE9BQU8sQ0FBQ3BELGtCQUFrQixDQUFDSCxDQUFDLEVBQUUsUUFBUSxDQUFDLElBQ3ZDQSxDQUFDLENBQUNxRixPQUFPLElBQ1RyRixDQUFDLENBQUNxRixPQUFPLENBQUM1RSxNQUFNLEVBQ2hCO1FBQ0EsSUFBSSxDQUFDd04sd0JBQXdCLENBQUNqTyxDQUFDLENBQUM7TUFDbEMsQ0FBQyxNQUFNLElBQ0x1RCxPQUFPLENBQUNwRCxrQkFBa0IsQ0FBQ0gsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxJQUN0QyxDQUFDdUQsT0FBTyxDQUFDcEQsa0JBQWtCLENBQUNILENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FDdEMsUUFBUSxFQUNSLFFBQVEsRUFDUixRQUFRLEVBQ1IsVUFBVSxFQUNWLE9BQU8sQ0FDUixDQUFDLEVBQ0Y7UUFDQSxJQUFJLENBQUM4TixlQUFlLENBQUMsT0FBTyxFQUFFOU4sQ0FBQyxFQUFFQSxDQUFDLENBQUMyQyxLQUFLLENBQUM7TUFDM0M7SUFDRjtFQUNGLENBQUMsQ0FBQyxPQUFPcUwsR0FBRyxFQUFFO0lBQ1o7RUFBQTtBQUVKLENBQUM7QUFFRDVJLFlBQVksQ0FBQ3FCLFNBQVMsQ0FBQ3dILHdCQUF3QixHQUFHLFVBQVU5TSxJQUFJLEVBQUU7RUFDaEUsSUFBSUEsSUFBSSxDQUFDK00sUUFBUSxFQUFFO0lBQ2pCLEtBQUssSUFBSTFOLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR1csSUFBSSxDQUFDa0UsT0FBTyxDQUFDNUUsTUFBTSxFQUFFRCxDQUFDLEVBQUUsRUFBRTtNQUM1QyxJQUFJVyxJQUFJLENBQUNrRSxPQUFPLENBQUM3RSxDQUFDLENBQUMsQ0FBQzJOLFFBQVEsRUFBRTtRQUM1QixJQUFJLENBQUNMLGVBQWUsQ0FBQyxPQUFPLEVBQUUzTSxJQUFJLEVBQUVBLElBQUksQ0FBQ2tFLE9BQU8sQ0FBQzdFLENBQUMsQ0FBQyxDQUFDbUMsS0FBSyxDQUFDO01BQzVEO0lBQ0Y7RUFDRixDQUFDLE1BQU0sSUFBSXhCLElBQUksQ0FBQ2lOLGFBQWEsSUFBSSxDQUFDLElBQUlqTixJQUFJLENBQUNrRSxPQUFPLENBQUNsRSxJQUFJLENBQUNpTixhQUFhLENBQUMsRUFBRTtJQUN0RSxJQUFJLENBQUNOLGVBQWUsQ0FBQyxPQUFPLEVBQUUzTSxJQUFJLEVBQUVBLElBQUksQ0FBQ2tFLE9BQU8sQ0FBQ2xFLElBQUksQ0FBQ2lOLGFBQWEsQ0FBQyxDQUFDekwsS0FBSyxDQUFDO0VBQzdFO0FBQ0YsQ0FBQztBQUVEeUMsWUFBWSxDQUFDcUIsU0FBUyxDQUFDcUgsZUFBZSxHQUFHLFVBQ3ZDcEMsT0FBTyxFQUNQdEwsT0FBTyxFQUNQdUMsS0FBSyxFQUNMMEwsU0FBUyxFQUNUO0VBQ0EsSUFBSTFMLEtBQUssS0FBSzFCLFNBQVMsRUFBRTtJQUN2QixJQUNFLElBQUksQ0FBQzZFLG9CQUFvQixJQUN6QnZDLE9BQU8sQ0FBQ3hELGNBQWMsQ0FBQ0ssT0FBTyxDQUFDLEtBQUssVUFBVSxFQUM5QztNQUNBdUMsS0FBSyxHQUFHLFlBQVk7SUFDdEIsQ0FBQyxNQUFNO01BQ0wsSUFBSWlDLFdBQVcsR0FBR3JCLE9BQU8sQ0FBQy9CLGVBQWUsQ0FBQ3BCLE9BQU8sQ0FBQztNQUNsRCxJQUFJLElBQUksQ0FBQzJGLGlCQUFpQixFQUFFO1FBQzFCLElBQUksSUFBSSxDQUFDQSxpQkFBaUIsQ0FBQ25CLFdBQVcsQ0FBQyxFQUFFO1VBQ3ZDakMsS0FBSyxHQUFHLFlBQVk7UUFDdEI7TUFDRixDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUNtQyxvQkFBb0IsQ0FBQ0YsV0FBVyxDQUFDLEVBQUU7UUFDakRqQyxLQUFLLEdBQUcsWUFBWTtNQUN0QjtJQUNGO0VBQ0Y7RUFDQSxJQUFJMkwsYUFBYSxHQUFHL0ssT0FBTyxDQUFDNUIsb0JBQW9CLENBQzlDNEIsT0FBTyxDQUFDckMsV0FBVyxDQUFDZCxPQUFPLENBQzdCLENBQUM7RUFDRCxJQUFJLENBQUNrRixTQUFTLENBQUNpSixVQUFVLENBQUM3QyxPQUFPLEVBQUU0QyxhQUFhLEVBQUUzTCxLQUFLLEVBQUUwTCxTQUFTLENBQUM7QUFDckUsQ0FBQztBQUVEakosWUFBWSxDQUFDcUIsU0FBUyxDQUFDVyxzQkFBc0IsR0FBRyxZQUFZO0VBQzFELElBQUlvSCxNQUFNLEdBQUcsSUFBSSxDQUFDaEosT0FBTyxDQUFDZ0osTUFBTTtFQUNoQyxJQUFJQyxpQkFBaUIsR0FBR0QsTUFBTSxJQUFJQSxNQUFNLENBQUNFLEdBQUcsSUFBSUYsTUFBTSxDQUFDRSxHQUFHLENBQUNDLE9BQU87RUFDbEU7RUFDQSxJQUFJQyxZQUFZLEdBQ2QsQ0FBQ0gsaUJBQWlCLElBQ2xCLElBQUksQ0FBQ2pKLE9BQU8sQ0FBQ3FKLE9BQU8sSUFDcEIsSUFBSSxDQUFDckosT0FBTyxDQUFDcUosT0FBTyxDQUFDQyxTQUFTO0VBQ2hDLElBQUksQ0FBQ0YsWUFBWSxFQUFFO0lBQ2pCO0VBQ0Y7RUFDQXJLLE9BQU8sQ0FBQyxJQUFJLENBQUNDLFlBQVksRUFBRSxZQUFZLENBQUM7QUFDMUMsQ0FBQztBQUVEWSxZQUFZLENBQUNxQixTQUFTLENBQUNVLG9CQUFvQixHQUFHLFlBQVk7RUFDeEQsSUFBSXFILE1BQU0sR0FBRyxJQUFJLENBQUNoSixPQUFPLENBQUNnSixNQUFNO0VBQ2hDLElBQUlDLGlCQUFpQixHQUFHRCxNQUFNLElBQUlBLE1BQU0sQ0FBQ0UsR0FBRyxJQUFJRixNQUFNLENBQUNFLEdBQUcsQ0FBQ0MsT0FBTztFQUNsRTtFQUNBLElBQUlDLFlBQVksR0FDZCxDQUFDSCxpQkFBaUIsSUFDbEIsSUFBSSxDQUFDakosT0FBTyxDQUFDcUosT0FBTyxJQUNwQixJQUFJLENBQUNySixPQUFPLENBQUNxSixPQUFPLENBQUNDLFNBQVM7RUFDaEMsSUFBSSxDQUFDRixZQUFZLEVBQUU7SUFDakI7RUFDRjtFQUNBLElBQUluSCxJQUFJLEdBQUcsSUFBSTtFQUNmckUsT0FBTyxDQUNMLElBQUksQ0FBQ29DLE9BQU8sRUFDWixZQUFZLEVBQ1osVUFBVXNDLElBQUksRUFBRTtJQUNkLE9BQU8sWUFBWTtNQUNqQixJQUFJaUgsT0FBTyxHQUFHdEgsSUFBSSxDQUFDcEIsU0FBUyxDQUFDRyxJQUFJO01BQ2pDaUIsSUFBSSxDQUFDdUgsZUFBZSxDQUFDdkgsSUFBSSxDQUFDbEIsU0FBUyxFQUFFd0ksT0FBTyxDQUFDO01BQzdDLElBQUlqSCxJQUFJLEVBQUU7UUFDUkEsSUFBSSxDQUFDYyxLQUFLLENBQUMsSUFBSSxFQUFFQyxTQUFTLENBQUM7TUFDN0I7SUFDRixDQUFDO0VBQ0gsQ0FBQyxFQUNELElBQUksQ0FBQ3JFLFlBQVksRUFDakIsWUFDRixDQUFDO0VBRURwQixPQUFPLENBQ0wsSUFBSSxDQUFDb0MsT0FBTyxDQUFDcUosT0FBTyxFQUNwQixXQUFXLEVBQ1gsVUFBVS9HLElBQUksRUFBRTtJQUNkLE9BQU8sWUFBWTtNQUNqQixJQUFJSyxHQUFHLEdBQUdVLFNBQVMsQ0FBQ3BJLE1BQU0sR0FBRyxDQUFDLEdBQUdvSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUc1SCxTQUFTO01BQ3pELElBQUlrSCxHQUFHLEVBQUU7UUFDUFYsSUFBSSxDQUFDdUgsZUFBZSxDQUFDdkgsSUFBSSxDQUFDbEIsU0FBUyxFQUFFNEIsR0FBRyxHQUFHLEVBQUUsQ0FBQztNQUNoRDtNQUNBLE9BQU9MLElBQUksQ0FBQ2MsS0FBSyxDQUFDLElBQUksRUFBRUMsU0FBUyxDQUFDO0lBQ3BDLENBQUM7RUFDSCxDQUFDLEVBQ0QsSUFBSSxDQUFDckUsWUFBWSxFQUNqQixZQUNGLENBQUM7QUFDSCxDQUFDO0FBRURZLFlBQVksQ0FBQ3FCLFNBQVMsQ0FBQ3VJLGVBQWUsR0FBRyxVQUFVQyxJQUFJLEVBQUVDLEVBQUUsRUFBRTtFQUMzRCxJQUFJQyxVQUFVLEdBQUc3TCxTQUFTLENBQUMySSxLQUFLLENBQUMsSUFBSSxDQUFDNUYsU0FBUyxDQUFDRyxJQUFJLENBQUM7RUFDckQsSUFBSTRJLFFBQVEsR0FBRzlMLFNBQVMsQ0FBQzJJLEtBQUssQ0FBQ2lELEVBQUUsQ0FBQztFQUNsQyxJQUFJRyxVQUFVLEdBQUcvTCxTQUFTLENBQUMySSxLQUFLLENBQUNnRCxJQUFJLENBQUM7RUFDdEMsSUFBSSxDQUFDMUksU0FBUyxHQUFHMkksRUFBRTtFQUNuQixJQUNFQyxVQUFVLENBQUNHLFFBQVEsS0FBS0YsUUFBUSxDQUFDRSxRQUFRLElBQ3pDSCxVQUFVLENBQUNJLElBQUksS0FBS0gsUUFBUSxDQUFDRyxJQUFJLEVBQ2pDO0lBQ0FMLEVBQUUsR0FBR0UsUUFBUSxDQUFDSSxJQUFJLElBQUlKLFFBQVEsQ0FBQ0ssSUFBSSxJQUFJLEVBQUUsQ0FBQztFQUM1QztFQUNBLElBQ0VOLFVBQVUsQ0FBQ0csUUFBUSxLQUFLRCxVQUFVLENBQUNDLFFBQVEsSUFDM0NILFVBQVUsQ0FBQ0ksSUFBSSxLQUFLRixVQUFVLENBQUNFLElBQUksRUFDbkM7SUFDQU4sSUFBSSxHQUFHSSxVQUFVLENBQUNHLElBQUksSUFBSUgsVUFBVSxDQUFDSSxJQUFJLElBQUksRUFBRSxDQUFDO0VBQ2xEO0VBQ0EsSUFBSSxDQUFDbkssU0FBUyxDQUFDb0ssaUJBQWlCLENBQUNULElBQUksRUFBRUMsRUFBRSxFQUFFak0sQ0FBQyxDQUFDeUYsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNyRCxDQUFDO0FBRUR0RCxZQUFZLENBQUNxQixTQUFTLENBQUNhLHdCQUF3QixHQUFHLFlBQVk7RUFDNUQsSUFBSSxFQUFFLGtCQUFrQixJQUFJLElBQUksQ0FBQzlCLE9BQU8sSUFBSSxNQUFNLElBQUksSUFBSSxDQUFDQyxTQUFTLENBQUMsRUFBRTtJQUNyRTtFQUNGO0VBQ0EsSUFBSSxJQUFJLENBQUNELE9BQU8sQ0FBQ21LLGdCQUFnQixFQUFFO0lBQ2pDLElBQUksQ0FBQ3RDLGVBQWUsQ0FBQyxjQUFjLENBQUM7RUFDdEMsQ0FBQyxNQUFNO0lBQ0w5SSxPQUFPLENBQUMsSUFBSSxDQUFDQyxZQUFZLEVBQUUsY0FBYyxDQUFDO0VBQzVDO0FBQ0YsQ0FBQztBQUVEWSxZQUFZLENBQUNxQixTQUFTLENBQUNZLHNCQUFzQixHQUFHLFlBQVk7RUFDMUQsSUFBSSxFQUFFLGtCQUFrQixJQUFJLElBQUksQ0FBQzdCLE9BQU8sSUFBSSxNQUFNLElBQUksSUFBSSxDQUFDQyxTQUFTLENBQUMsRUFBRTtJQUNyRTtFQUNGO0VBQ0EsSUFBSSxJQUFJLENBQUNELE9BQU8sQ0FBQ21LLGdCQUFnQixFQUFFO0lBQ2pDLElBQUksQ0FBQ2hDLFdBQVcsQ0FDZCxjQUFjLEVBQ2QsSUFBSSxDQUFDbkksT0FBTyxFQUNaLFFBQVEsRUFDUnZFLFNBQVMsRUFDVCxZQUFZO01BQ1YsSUFBSSxDQUFDcUUsU0FBUyxDQUFDc0sseUJBQXlCLENBQUMsUUFBUSxDQUFDO0lBQ3BELENBQUMsQ0FBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFDWixJQUNGLENBQUM7SUFDRCxJQUFJLENBQUNHLFdBQVcsQ0FDZCxjQUFjLEVBQ2QsSUFBSSxDQUFDbkksT0FBTyxFQUNaLFNBQVMsRUFDVHZFLFNBQVMsRUFDVCxZQUFZO01BQ1YsSUFBSSxDQUFDcUUsU0FBUyxDQUFDc0sseUJBQXlCLENBQUMsU0FBUyxDQUFDO0lBQ3JELENBQUMsQ0FBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFDWixJQUNGLENBQUM7RUFDSCxDQUFDLE1BQU07SUFDTCxJQUFJL0YsSUFBSSxHQUFHLElBQUk7SUFDZnJFLE9BQU8sQ0FDTCxJQUFJLENBQUNxQyxTQUFTLENBQUNzRSxJQUFJLEVBQ25CLFVBQVUsRUFDVixVQUFVakMsSUFBSSxFQUFFO01BQ2QsT0FBTyxZQUFZO1FBQ2pCTCxJQUFJLENBQUNuQyxTQUFTLENBQUNzSyx5QkFBeUIsQ0FBQyxRQUFRLENBQUM7UUFDbEQsSUFBSTlILElBQUksRUFBRTtVQUNSQSxJQUFJLENBQUNjLEtBQUssQ0FBQyxJQUFJLEVBQUVDLFNBQVMsQ0FBQztRQUM3QjtNQUNGLENBQUM7SUFDSCxDQUFDLEVBQ0QsSUFBSSxDQUFDckUsWUFBWSxFQUNqQixjQUNGLENBQUM7SUFDRHBCLE9BQU8sQ0FDTCxJQUFJLENBQUNxQyxTQUFTLENBQUNzRSxJQUFJLEVBQ25CLFdBQVcsRUFDWCxVQUFVakMsSUFBSSxFQUFFO01BQ2QsT0FBTyxZQUFZO1FBQ2pCTCxJQUFJLENBQUNuQyxTQUFTLENBQUNzSyx5QkFBeUIsQ0FBQyxTQUFTLENBQUM7UUFDbkQsSUFBSTlILElBQUksRUFBRTtVQUNSQSxJQUFJLENBQUNjLEtBQUssQ0FBQyxJQUFJLEVBQUVDLFNBQVMsQ0FBQztRQUM3QjtNQUNGLENBQUM7SUFDSCxDQUFDLEVBQ0QsSUFBSSxDQUFDckUsWUFBWSxFQUNqQixjQUNGLENBQUM7RUFDSDtBQUNGLENBQUM7QUFFRFksWUFBWSxDQUFDcUIsU0FBUyxDQUFDb0osY0FBYyxHQUFHLFVBQVVDLFFBQVEsRUFBRTtFQUMxRCxJQUFJOUMsT0FBTyxHQUNULDZCQUE2QixHQUM3QixjQUFjLEdBQ2Q4QyxRQUFRLENBQUNDLFVBQVUsR0FDbkIsSUFBSSxHQUNKLHFCQUFxQixHQUNyQkQsUUFBUSxDQUFDRSxpQkFBaUIsR0FDMUIsSUFBSSxHQUNKLHNCQUFzQixHQUN0QkYsUUFBUSxDQUFDRyxrQkFBa0IsR0FDM0IsSUFBSTtFQUVOLElBQUlILFFBQVEsQ0FBQ0ksVUFBVSxFQUFFO0lBQ3ZCbEQsT0FBTyxJQUNMLFlBQVksR0FDWjhDLFFBQVEsQ0FBQ0ksVUFBVSxHQUNuQixJQUFJLEdBQ0osUUFBUSxHQUNSSixRQUFRLENBQUNLLFVBQVUsR0FDbkIsSUFBSSxHQUNKLE9BQU8sR0FDUEwsUUFBUSxDQUFDTSxZQUFZLEdBQ3JCLElBQUk7RUFDUjtFQUVBcEQsT0FBTyxJQUFJLGtCQUFrQixHQUFHOEMsUUFBUSxDQUFDTyxjQUFjO0VBRXZELElBQUksQ0FBQy9LLFNBQVMsQ0FBQzRILFVBQVUsQ0FBQ0YsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUvSixDQUFDLENBQUN5RixHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQzFELElBQUksQ0FBQzRILGNBQWMsQ0FBQ3RELE9BQU8sQ0FBQztBQUM5QixDQUFDO0FBRUQ1SCxZQUFZLENBQUNxQixTQUFTLENBQUM2SixjQUFjLEdBQUcsVUFBVXRELE9BQU8sRUFBRTtFQUN6RCxJQUFJLElBQUksQ0FBQ3RILGNBQWMsQ0FBQ3BCLDRCQUE0QixFQUFFO0lBQ3BELElBQUksQ0FBQ2lCLE9BQU8sQ0FBQ2lILEtBQUssQ0FBQ1EsT0FBTyxDQUFDO0VBQzdCO0FBQ0YsQ0FBQztBQUVENUgsWUFBWSxDQUFDcUIsU0FBUyxDQUFDZSxpQ0FBaUMsR0FBRyxZQUFZO0VBQ3JFLElBQUksRUFBRSxrQkFBa0IsSUFBSSxJQUFJLENBQUMvQixTQUFTLENBQUMsRUFBRTtJQUMzQztFQUNGO0VBRUEsSUFBSSxDQUFDNEgsZUFBZSxDQUFDLHVCQUF1QixDQUFDO0FBQy9DLENBQUM7QUFFRGpJLFlBQVksQ0FBQ3FCLFNBQVMsQ0FBQ2MsK0JBQStCLEdBQUcsWUFBWTtFQUNuRSxJQUFJLEVBQUUsa0JBQWtCLElBQUksSUFBSSxDQUFDOUIsU0FBUyxDQUFDLEVBQUU7SUFDM0M7RUFDRjtFQUVBLElBQUk4SyxVQUFVLEdBQUcsSUFBSSxDQUFDVixjQUFjLENBQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDO0VBQy9DLElBQUksQ0FBQ0csV0FBVyxDQUNkLHVCQUF1QixFQUN2QixJQUFJLENBQUNsSSxTQUFTLEVBQ2QseUJBQXlCLEVBQ3pCLElBQUksRUFDSjhLLFVBQVUsRUFDVixLQUNGLENBQUM7QUFDSCxDQUFDO0FBRURuTCxZQUFZLENBQUNxQixTQUFTLENBQUNrSCxXQUFXLEdBQUcsVUFDbkM2QyxPQUFPLEVBQ1BDLEdBQUcsRUFDSHBRLElBQUksRUFDSnFRLE9BQU8sRUFDUEMsT0FBTyxFQUNQQyxPQUFPLEVBQ1A7RUFDQSxJQUFJSCxHQUFHLENBQUNkLGdCQUFnQixFQUFFO0lBQ3hCYyxHQUFHLENBQUNkLGdCQUFnQixDQUFDdFAsSUFBSSxFQUFFc1EsT0FBTyxFQUFFQyxPQUFPLENBQUM7SUFDNUMsSUFBSSxDQUFDekssYUFBYSxDQUFDcUssT0FBTyxDQUFDLENBQUNqTyxJQUFJLENBQUMsWUFBWTtNQUMzQ2tPLEdBQUcsQ0FBQ0ksbUJBQW1CLENBQUN4USxJQUFJLEVBQUVzUSxPQUFPLEVBQUVDLE9BQU8sQ0FBQztJQUNqRCxDQUFDLENBQUM7RUFDSixDQUFDLE1BQU0sSUFBSUYsT0FBTyxFQUFFO0lBQ2xCRCxHQUFHLENBQUNLLFdBQVcsQ0FBQ0osT0FBTyxFQUFFQyxPQUFPLENBQUM7SUFDakMsSUFBSSxDQUFDeEssYUFBYSxDQUFDcUssT0FBTyxDQUFDLENBQUNqTyxJQUFJLENBQUMsWUFBWTtNQUMzQ2tPLEdBQUcsQ0FBQ00sV0FBVyxDQUFDTCxPQUFPLEVBQUVDLE9BQU8sQ0FBQztJQUNuQyxDQUFDLENBQUM7RUFDSjtBQUNGLENBQUM7QUFFRHZMLFlBQVksQ0FBQ3FCLFNBQVMsQ0FBQzRHLGVBQWUsR0FBRyxVQUFVbUQsT0FBTyxFQUFFO0VBQzFELElBQUlRLENBQUM7RUFDTCxPQUFPLElBQUksQ0FBQzdLLGFBQWEsQ0FBQ3FLLE9BQU8sQ0FBQyxDQUFDL1AsTUFBTSxFQUFFO0lBQ3pDdVEsQ0FBQyxHQUFHLElBQUksQ0FBQzdLLGFBQWEsQ0FBQ3FLLE9BQU8sQ0FBQyxDQUFDOUwsS0FBSyxDQUFDLENBQUM7SUFDdkNzTSxDQUFDLENBQUMsQ0FBQztFQUNMO0FBQ0YsQ0FBQztBQUVELFNBQVMzSSxZQUFZQSxDQUFDNEMsS0FBSyxFQUFFO0VBQzNCLE9BQU8sT0FBT2dHLEdBQUcsS0FBSyxXQUFXLElBQUloRyxLQUFLLFlBQVlnRyxHQUFHO0FBQzNEO0FBRUFsTyxNQUFNLENBQUNDLE9BQU8sR0FBR29DLFlBQVk7Ozs7Ozs7Ozs7QUMvOUI3QjtBQUNBLFNBQVM2RyxLQUFLQSxDQUFDOUQsR0FBRyxFQUFFO0VBQ2xCLElBQUkrSSxNQUFNLEdBQUc7SUFDWDVCLFFBQVEsRUFBRSxJQUFJO0lBQ2Q2QixJQUFJLEVBQUUsSUFBSTtJQUNWNUIsSUFBSSxFQUFFLElBQUk7SUFDVkMsSUFBSSxFQUFFLElBQUk7SUFDVkMsSUFBSSxFQUFFLElBQUk7SUFDVmpKLElBQUksRUFBRTJCLEdBQUc7SUFDVGlKLFFBQVEsRUFBRSxJQUFJO0lBQ2RDLElBQUksRUFBRSxJQUFJO0lBQ1ZDLFFBQVEsRUFBRSxJQUFJO0lBQ2RDLE1BQU0sRUFBRSxJQUFJO0lBQ1pDLEtBQUssRUFBRTtFQUNULENBQUM7RUFFRCxJQUFJaFIsQ0FBQyxFQUFFaVIsSUFBSTtFQUNYalIsQ0FBQyxHQUFHMkgsR0FBRyxDQUFDdUosT0FBTyxDQUFDLElBQUksQ0FBQztFQUNyQixJQUFJbFIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0lBQ1owUSxNQUFNLENBQUM1QixRQUFRLEdBQUduSCxHQUFHLENBQUN3SixTQUFTLENBQUMsQ0FBQyxFQUFFblIsQ0FBQyxDQUFDO0lBQ3JDaVIsSUFBSSxHQUFHalIsQ0FBQyxHQUFHLENBQUM7RUFDZCxDQUFDLE1BQU07SUFDTGlSLElBQUksR0FBRyxDQUFDO0VBQ1Y7RUFFQWpSLENBQUMsR0FBRzJILEdBQUcsQ0FBQ3VKLE9BQU8sQ0FBQyxHQUFHLEVBQUVELElBQUksQ0FBQztFQUMxQixJQUFJalIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0lBQ1owUSxNQUFNLENBQUNDLElBQUksR0FBR2hKLEdBQUcsQ0FBQ3dKLFNBQVMsQ0FBQ0YsSUFBSSxFQUFFalIsQ0FBQyxDQUFDO0lBQ3BDaVIsSUFBSSxHQUFHalIsQ0FBQyxHQUFHLENBQUM7RUFDZDtFQUVBQSxDQUFDLEdBQUcySCxHQUFHLENBQUN1SixPQUFPLENBQUMsR0FBRyxFQUFFRCxJQUFJLENBQUM7RUFDMUIsSUFBSWpSLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtJQUNaQSxDQUFDLEdBQUcySCxHQUFHLENBQUN1SixPQUFPLENBQUMsR0FBRyxFQUFFRCxJQUFJLENBQUM7SUFDMUIsSUFBSWpSLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtNQUNaQSxDQUFDLEdBQUcySCxHQUFHLENBQUN1SixPQUFPLENBQUMsR0FBRyxFQUFFRCxJQUFJLENBQUM7TUFDMUIsSUFBSWpSLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtRQUNaMFEsTUFBTSxDQUFDM0IsSUFBSSxHQUFHcEgsR0FBRyxDQUFDd0osU0FBUyxDQUFDRixJQUFJLENBQUM7TUFDbkMsQ0FBQyxNQUFNO1FBQ0xQLE1BQU0sQ0FBQzNCLElBQUksR0FBR3BILEdBQUcsQ0FBQ3dKLFNBQVMsQ0FBQ0YsSUFBSSxFQUFFalIsQ0FBQyxDQUFDO1FBQ3BDMFEsTUFBTSxDQUFDekIsSUFBSSxHQUFHdEgsR0FBRyxDQUFDd0osU0FBUyxDQUFDblIsQ0FBQyxDQUFDO01BQ2hDO01BQ0EwUSxNQUFNLENBQUNFLFFBQVEsR0FBR0YsTUFBTSxDQUFDM0IsSUFBSSxDQUFDek0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUMzQ29PLE1BQU0sQ0FBQ0csSUFBSSxHQUFHSCxNQUFNLENBQUMzQixJQUFJLENBQUN6TSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ3ZDLElBQUlvTyxNQUFNLENBQUNHLElBQUksRUFBRTtRQUNmSCxNQUFNLENBQUNHLElBQUksR0FBR08sUUFBUSxDQUFDVixNQUFNLENBQUNHLElBQUksRUFBRSxFQUFFLENBQUM7TUFDekM7TUFDQSxPQUFPSCxNQUFNO0lBQ2YsQ0FBQyxNQUFNO01BQ0xBLE1BQU0sQ0FBQzNCLElBQUksR0FBR3BILEdBQUcsQ0FBQ3dKLFNBQVMsQ0FBQ0YsSUFBSSxFQUFFalIsQ0FBQyxDQUFDO01BQ3BDMFEsTUFBTSxDQUFDRSxRQUFRLEdBQUdGLE1BQU0sQ0FBQzNCLElBQUksQ0FBQ3pNLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDM0NvTyxNQUFNLENBQUNHLElBQUksR0FBR0gsTUFBTSxDQUFDM0IsSUFBSSxDQUFDek0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUN2QyxJQUFJb08sTUFBTSxDQUFDRyxJQUFJLEVBQUU7UUFDZkgsTUFBTSxDQUFDRyxJQUFJLEdBQUdPLFFBQVEsQ0FBQ1YsTUFBTSxDQUFDRyxJQUFJLEVBQUUsRUFBRSxDQUFDO01BQ3pDO01BQ0FJLElBQUksR0FBR2pSLENBQUM7SUFDVjtFQUNGLENBQUMsTUFBTTtJQUNMMFEsTUFBTSxDQUFDM0IsSUFBSSxHQUFHcEgsR0FBRyxDQUFDd0osU0FBUyxDQUFDRixJQUFJLEVBQUVqUixDQUFDLENBQUM7SUFDcEMwUSxNQUFNLENBQUNFLFFBQVEsR0FBR0YsTUFBTSxDQUFDM0IsSUFBSSxDQUFDek0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQ29PLE1BQU0sQ0FBQ0csSUFBSSxHQUFHSCxNQUFNLENBQUMzQixJQUFJLENBQUN6TSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLElBQUlvTyxNQUFNLENBQUNHLElBQUksRUFBRTtNQUNmSCxNQUFNLENBQUNHLElBQUksR0FBR08sUUFBUSxDQUFDVixNQUFNLENBQUNHLElBQUksRUFBRSxFQUFFLENBQUM7SUFDekM7SUFDQUksSUFBSSxHQUFHalIsQ0FBQztFQUNWO0VBRUFBLENBQUMsR0FBRzJILEdBQUcsQ0FBQ3VKLE9BQU8sQ0FBQyxHQUFHLEVBQUVELElBQUksQ0FBQztFQUMxQixJQUFJalIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0lBQ1owUSxNQUFNLENBQUMxQixJQUFJLEdBQUdySCxHQUFHLENBQUN3SixTQUFTLENBQUNGLElBQUksQ0FBQztFQUNuQyxDQUFDLE1BQU07SUFDTFAsTUFBTSxDQUFDMUIsSUFBSSxHQUFHckgsR0FBRyxDQUFDd0osU0FBUyxDQUFDRixJQUFJLEVBQUVqUixDQUFDLENBQUM7SUFDcEMwUSxNQUFNLENBQUN6QixJQUFJLEdBQUd0SCxHQUFHLENBQUN3SixTQUFTLENBQUNuUixDQUFDLENBQUM7RUFDaEM7RUFFQSxJQUFJMFEsTUFBTSxDQUFDMUIsSUFBSSxFQUFFO0lBQ2YsSUFBSXFDLFNBQVMsR0FBR1gsTUFBTSxDQUFDMUIsSUFBSSxDQUFDMU0sS0FBSyxDQUFDLEdBQUcsQ0FBQztJQUN0Q29PLE1BQU0sQ0FBQ0ksUUFBUSxHQUFHTyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzlCWCxNQUFNLENBQUNNLEtBQUssR0FBR0ssU0FBUyxDQUFDLENBQUMsQ0FBQztJQUMzQlgsTUFBTSxDQUFDSyxNQUFNLEdBQUdMLE1BQU0sQ0FBQ00sS0FBSyxHQUFHLEdBQUcsR0FBR04sTUFBTSxDQUFDTSxLQUFLLEdBQUcsSUFBSTtFQUMxRDtFQUNBLE9BQU9OLE1BQU07QUFDZjtBQUVBbk8sTUFBTSxDQUFDQyxPQUFPLEdBQUc7RUFDZmlKLEtBQUssRUFBRUE7QUFDVCxDQUFDOzs7Ozs7Ozs7OztBQ3RGWTs7QUFFYixJQUFJNkYsTUFBTSxHQUFHQyxNQUFNLENBQUN0TCxTQUFTLENBQUN1TCxjQUFjO0FBQzVDLElBQUlDLEtBQUssR0FBR0YsTUFBTSxDQUFDdEwsU0FBUyxDQUFDNkIsUUFBUTtBQUVyQyxJQUFJNEosYUFBYSxHQUFHLFNBQVNBLGFBQWFBLENBQUN6QixHQUFHLEVBQUU7RUFDOUMsSUFBSSxDQUFDQSxHQUFHLElBQUl3QixLQUFLLENBQUNsRixJQUFJLENBQUMwRCxHQUFHLENBQUMsS0FBSyxpQkFBaUIsRUFBRTtJQUNqRCxPQUFPLEtBQUs7RUFDZDtFQUVBLElBQUkwQixpQkFBaUIsR0FBR0wsTUFBTSxDQUFDL0UsSUFBSSxDQUFDMEQsR0FBRyxFQUFFLGFBQWEsQ0FBQztFQUN2RCxJQUFJMkIsZ0JBQWdCLEdBQ2xCM0IsR0FBRyxDQUFDNEIsV0FBVyxJQUNmNUIsR0FBRyxDQUFDNEIsV0FBVyxDQUFDNUwsU0FBUyxJQUN6QnFMLE1BQU0sQ0FBQy9FLElBQUksQ0FBQzBELEdBQUcsQ0FBQzRCLFdBQVcsQ0FBQzVMLFNBQVMsRUFBRSxlQUFlLENBQUM7RUFDekQ7RUFDQSxJQUFJZ0ssR0FBRyxDQUFDNEIsV0FBVyxJQUFJLENBQUNGLGlCQUFpQixJQUFJLENBQUNDLGdCQUFnQixFQUFFO0lBQzlELE9BQU8sS0FBSztFQUNkOztFQUVBO0VBQ0E7RUFDQSxJQUFJMVAsR0FBRztFQUNQLEtBQUtBLEdBQUcsSUFBSStOLEdBQUcsRUFBRTtJQUNmO0VBQUE7RUFHRixPQUFPLE9BQU8vTixHQUFHLEtBQUssV0FBVyxJQUFJb1AsTUFBTSxDQUFDL0UsSUFBSSxDQUFDMEQsR0FBRyxFQUFFL04sR0FBRyxDQUFDO0FBQzVELENBQUM7QUFFRCxTQUFTbUQsS0FBS0EsQ0FBQSxFQUFHO0VBQ2YsSUFBSXJGLENBQUM7SUFDSDhSLEdBQUc7SUFDSEMsSUFBSTtJQUNKOUcsS0FBSztJQUNMdkcsSUFBSTtJQUNKZ00sTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNYbkMsT0FBTyxHQUFHLElBQUk7SUFDZHRPLE1BQU0sR0FBR29JLFNBQVMsQ0FBQ3BJLE1BQU07RUFFM0IsS0FBS0QsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHQyxNQUFNLEVBQUVELENBQUMsRUFBRSxFQUFFO0lBQzNCdU8sT0FBTyxHQUFHbEcsU0FBUyxDQUFDckksQ0FBQyxDQUFDO0lBQ3RCLElBQUl1TyxPQUFPLElBQUksSUFBSSxFQUFFO01BQ25CO0lBQ0Y7SUFFQSxLQUFLN0osSUFBSSxJQUFJNkosT0FBTyxFQUFFO01BQ3BCdUQsR0FBRyxHQUFHcEIsTUFBTSxDQUFDaE0sSUFBSSxDQUFDO01BQ2xCcU4sSUFBSSxHQUFHeEQsT0FBTyxDQUFDN0osSUFBSSxDQUFDO01BQ3BCLElBQUlnTSxNQUFNLEtBQUtxQixJQUFJLEVBQUU7UUFDbkIsSUFBSUEsSUFBSSxJQUFJTCxhQUFhLENBQUNLLElBQUksQ0FBQyxFQUFFO1VBQy9COUcsS0FBSyxHQUFHNkcsR0FBRyxJQUFJSixhQUFhLENBQUNJLEdBQUcsQ0FBQyxHQUFHQSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1VBQzVDcEIsTUFBTSxDQUFDaE0sSUFBSSxDQUFDLEdBQUdXLEtBQUssQ0FBQzRGLEtBQUssRUFBRThHLElBQUksQ0FBQztRQUNuQyxDQUFDLE1BQU0sSUFBSSxPQUFPQSxJQUFJLEtBQUssV0FBVyxFQUFFO1VBQ3RDckIsTUFBTSxDQUFDaE0sSUFBSSxDQUFDLEdBQUdxTixJQUFJO1FBQ3JCO01BQ0Y7SUFDRjtFQUNGO0VBQ0EsT0FBT3JCLE1BQU07QUFDZjtBQUVBbk8sTUFBTSxDQUFDQyxPQUFPLEdBQUc2QyxLQUFLOzs7Ozs7Ozs7O0FDOUR0QixJQUFJNUMsQ0FBQyxHQUFHQyxtQkFBTyxDQUFDLG1DQUFXLENBQUM7QUFDNUIsSUFBSXNQLFFBQVEsR0FBR3RQLG1CQUFPLENBQUMscURBQW9CLENBQUM7QUFFNUMsU0FBU0csS0FBS0EsQ0FBQzRGLElBQUksRUFBRWxFLFdBQVcsRUFBRTBOLFVBQVUsRUFBRTtFQUM1QzFOLFdBQVcsR0FBR0EsV0FBVyxJQUFJLEVBQUU7RUFFL0IsSUFBSTBOLFVBQVUsRUFBRTtJQUNkLEtBQUssSUFBSWpTLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR2lTLFVBQVUsQ0FBQ2hTLE1BQU0sRUFBRSxFQUFFRCxDQUFDLEVBQUU7TUFDMUNrUyxTQUFTLENBQUN6SixJQUFJLEVBQUV3SixVQUFVLENBQUNqUyxDQUFDLENBQUMsQ0FBQztJQUNoQztFQUNGO0VBRUEsSUFBSW1TLFFBQVEsR0FBR0Msb0JBQW9CLENBQUM3TixXQUFXLENBQUM7RUFDaEQsSUFBSThOLFFBQVEsR0FBR0MseUJBQXlCLENBQUMvTixXQUFXLENBQUM7RUFFckQsU0FBU2dPLGdCQUFnQkEsQ0FBQ0MsTUFBTSxFQUFFQyxTQUFTLEVBQUU7SUFDM0MsT0FBT0EsU0FBUyxHQUFHaFEsQ0FBQyxDQUFDaVEsTUFBTSxDQUFDLENBQUM7RUFDL0I7RUFFQSxTQUFTQyxhQUFhQSxDQUFDQyxDQUFDLEVBQUU7SUFDeEIsSUFBSTVTLENBQUM7SUFDTCxJQUFJeUMsQ0FBQyxDQUFDMkMsTUFBTSxDQUFDd04sQ0FBQyxFQUFFLFFBQVEsQ0FBQyxFQUFFO01BQ3pCLEtBQUs1UyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdxUyxRQUFRLENBQUNwUyxNQUFNLEVBQUUsRUFBRUQsQ0FBQyxFQUFFO1FBQ3BDNFMsQ0FBQyxHQUFHQSxDQUFDLENBQUNoUSxPQUFPLENBQUN5UCxRQUFRLENBQUNyUyxDQUFDLENBQUMsRUFBRXVTLGdCQUFnQixDQUFDO01BQzlDO0lBQ0Y7SUFDQSxPQUFPSyxDQUFDO0VBQ1Y7RUFFQSxTQUFTQyxXQUFXQSxDQUFDQyxDQUFDLEVBQUVGLENBQUMsRUFBRTtJQUN6QixJQUFJNVMsQ0FBQztJQUNMLEtBQUtBLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR21TLFFBQVEsQ0FBQ2xTLE1BQU0sRUFBRSxFQUFFRCxDQUFDLEVBQUU7TUFDcEMsSUFBSW1TLFFBQVEsQ0FBQ25TLENBQUMsQ0FBQyxDQUFDMkUsSUFBSSxDQUFDbU8sQ0FBQyxDQUFDLEVBQUU7UUFDdkJGLENBQUMsR0FBR25RLENBQUMsQ0FBQ2lRLE1BQU0sQ0FBQyxDQUFDO1FBQ2Q7TUFDRjtJQUNGO0lBQ0EsT0FBT0UsQ0FBQztFQUNWO0VBRUEsU0FBU0csUUFBUUEsQ0FBQ0QsQ0FBQyxFQUFFRixDQUFDLEVBQUVJLElBQUksRUFBRTtJQUM1QixJQUFJQyxJQUFJLEdBQUdKLFdBQVcsQ0FBQ0MsQ0FBQyxFQUFFRixDQUFDLENBQUM7SUFDNUIsSUFBSUssSUFBSSxLQUFLTCxDQUFDLEVBQUU7TUFDZCxJQUFJblEsQ0FBQyxDQUFDMkMsTUFBTSxDQUFDd04sQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJblEsQ0FBQyxDQUFDMkMsTUFBTSxDQUFDd04sQ0FBQyxFQUFFLE9BQU8sQ0FBQyxFQUFFO1FBQ2pELE9BQU9aLFFBQVEsQ0FBQ1ksQ0FBQyxFQUFFRyxRQUFRLEVBQUVDLElBQUksQ0FBQztNQUNwQztNQUNBLE9BQU9MLGFBQWEsQ0FBQ00sSUFBSSxDQUFDO0lBQzVCLENBQUMsTUFBTTtNQUNMLE9BQU9BLElBQUk7SUFDYjtFQUNGO0VBRUEsT0FBT2pCLFFBQVEsQ0FBQ3ZKLElBQUksRUFBRXNLLFFBQVEsQ0FBQztBQUNqQztBQUVBLFNBQVNiLFNBQVNBLENBQUNqQyxHQUFHLEVBQUVqQixJQUFJLEVBQUU7RUFDNUIsSUFBSWtFLElBQUksR0FBR2xFLElBQUksQ0FBQzFNLEtBQUssQ0FBQyxHQUFHLENBQUM7RUFDMUIsSUFBSTJPLElBQUksR0FBR2lDLElBQUksQ0FBQ2pULE1BQU0sR0FBRyxDQUFDO0VBQzFCLElBQUk7SUFDRixLQUFLLElBQUlELENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsSUFBSWlSLElBQUksRUFBRSxFQUFFalIsQ0FBQyxFQUFFO01BQzlCLElBQUlBLENBQUMsR0FBR2lSLElBQUksRUFBRTtRQUNaaEIsR0FBRyxHQUFHQSxHQUFHLENBQUNpRCxJQUFJLENBQUNsVCxDQUFDLENBQUMsQ0FBQztNQUNwQixDQUFDLE1BQU07UUFDTGlRLEdBQUcsQ0FBQ2lELElBQUksQ0FBQ2xULENBQUMsQ0FBQyxDQUFDLEdBQUd5QyxDQUFDLENBQUNpUSxNQUFNLENBQUMsQ0FBQztNQUMzQjtJQUNGO0VBQ0YsQ0FBQyxDQUFDLE9BQU9sVCxDQUFDLEVBQUU7SUFDVjtFQUFBO0FBRUo7QUFFQSxTQUFTNFMsb0JBQW9CQSxDQUFDN04sV0FBVyxFQUFFO0VBQ3pDLElBQUk0TyxHQUFHLEdBQUcsRUFBRTtFQUNaLElBQUlDLEdBQUc7RUFDUCxLQUFLLElBQUlwVCxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUd1RSxXQUFXLENBQUN0RSxNQUFNLEVBQUUsRUFBRUQsQ0FBQyxFQUFFO0lBQzNDb1QsR0FBRyxHQUFHLGdCQUFnQixHQUFHN08sV0FBVyxDQUFDdkUsQ0FBQyxDQUFDLEdBQUcsNkJBQTZCO0lBQ3ZFbVQsR0FBRyxDQUFDcFIsSUFBSSxDQUFDLElBQUkwQyxNQUFNLENBQUMyTyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7RUFDaEM7RUFDQSxPQUFPRCxHQUFHO0FBQ1o7QUFFQSxTQUFTYix5QkFBeUJBLENBQUMvTixXQUFXLEVBQUU7RUFDOUMsSUFBSTRPLEdBQUcsR0FBRyxFQUFFO0VBQ1osSUFBSUMsR0FBRztFQUNQLEtBQUssSUFBSXBULENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR3VFLFdBQVcsQ0FBQ3RFLE1BQU0sRUFBRSxFQUFFRCxDQUFDLEVBQUU7SUFDM0NvVCxHQUFHLEdBQUcsZUFBZSxHQUFHN08sV0FBVyxDQUFDdkUsQ0FBQyxDQUFDLEdBQUcsNEJBQTRCO0lBQ3JFbVQsR0FBRyxDQUFDcFIsSUFBSSxDQUFDLElBQUkwQyxNQUFNLENBQUMsR0FBRyxHQUFHMk8sR0FBRyxHQUFHLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztFQUN6RDtFQUNBLE9BQU9ELEdBQUc7QUFDWjtBQUVBNVEsTUFBTSxDQUFDQyxPQUFPLEdBQUdLLEtBQUs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0Z0QixJQUFJd0MsS0FBSyxHQUFHM0MsbUJBQU8sQ0FBQywrQkFBUyxDQUFDO0FBRTlCLElBQUkyUSxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLFNBQVNDLFNBQVNBLENBQUNDLFlBQVksRUFBRTtFQUMvQixJQUFJbE0sVUFBVSxDQUFDZ00sV0FBVyxDQUFDN0gsU0FBUyxDQUFDLElBQUluRSxVQUFVLENBQUNnTSxXQUFXLENBQUM1SCxLQUFLLENBQUMsRUFBRTtJQUN0RTtFQUNGO0VBRUEsSUFBSStILFNBQVMsQ0FBQ2pJLElBQUksQ0FBQyxFQUFFO0lBQ25CO0lBQ0EsSUFBSWdJLFlBQVksRUFBRTtNQUNoQixJQUFJRSxnQkFBZ0IsQ0FBQ2xJLElBQUksQ0FBQ0MsU0FBUyxDQUFDLEVBQUU7UUFDcEM2SCxXQUFXLENBQUM3SCxTQUFTLEdBQUdELElBQUksQ0FBQ0MsU0FBUztNQUN4QztNQUNBLElBQUlpSSxnQkFBZ0IsQ0FBQ2xJLElBQUksQ0FBQ0UsS0FBSyxDQUFDLEVBQUU7UUFDaEM0SCxXQUFXLENBQUM1SCxLQUFLLEdBQUdGLElBQUksQ0FBQ0UsS0FBSztNQUNoQztJQUNGLENBQUMsTUFBTTtNQUNMO01BQ0EsSUFBSXBFLFVBQVUsQ0FBQ2tFLElBQUksQ0FBQ0MsU0FBUyxDQUFDLEVBQUU7UUFDOUI2SCxXQUFXLENBQUM3SCxTQUFTLEdBQUdELElBQUksQ0FBQ0MsU0FBUztNQUN4QztNQUNBLElBQUluRSxVQUFVLENBQUNrRSxJQUFJLENBQUNFLEtBQUssQ0FBQyxFQUFFO1FBQzFCNEgsV0FBVyxDQUFDNUgsS0FBSyxHQUFHRixJQUFJLENBQUNFLEtBQUs7TUFDaEM7SUFDRjtFQUNGO0VBQ0EsSUFBSSxDQUFDcEUsVUFBVSxDQUFDZ00sV0FBVyxDQUFDN0gsU0FBUyxDQUFDLElBQUksQ0FBQ25FLFVBQVUsQ0FBQ2dNLFdBQVcsQ0FBQzVILEtBQUssQ0FBQyxFQUFFO0lBQ3hFOEgsWUFBWSxJQUFJQSxZQUFZLENBQUNGLFdBQVcsQ0FBQztFQUMzQztBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVNqTyxNQUFNQSxDQUFDc08sQ0FBQyxFQUFFcEosQ0FBQyxFQUFFO0VBQ3BCLE9BQU9BLENBQUMsS0FBS3FKLFFBQVEsQ0FBQ0QsQ0FBQyxDQUFDO0FBQzFCOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVNDLFFBQVFBLENBQUNELENBQUMsRUFBRTtFQUNuQixJQUFJaFAsSUFBSSxHQUFBa1AsT0FBQSxDQUFVRixDQUFDO0VBQ25CLElBQUloUCxJQUFJLEtBQUssUUFBUSxFQUFFO0lBQ3JCLE9BQU9BLElBQUk7RUFDYjtFQUNBLElBQUksQ0FBQ2dQLENBQUMsRUFBRTtJQUNOLE9BQU8sTUFBTTtFQUNmO0VBQ0EsSUFBSUEsQ0FBQyxZQUFZdEosS0FBSyxFQUFFO0lBQ3RCLE9BQU8sT0FBTztFQUNoQjtFQUNBLE9BQU8sQ0FBQyxDQUFDLENBQUN0QyxRQUFRLENBQ2Z5RSxJQUFJLENBQUNtSCxDQUFDLENBQUMsQ0FDUEcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUN6Qm5VLFdBQVcsQ0FBQyxDQUFDO0FBQ2xCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTMkgsVUFBVUEsQ0FBQ3lNLENBQUMsRUFBRTtFQUNyQixPQUFPMU8sTUFBTSxDQUFDME8sQ0FBQyxFQUFFLFVBQVUsQ0FBQztBQUM5Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBU0wsZ0JBQWdCQSxDQUFDSyxDQUFDLEVBQUU7RUFDM0IsSUFBSUMsWUFBWSxHQUFHLHFCQUFxQjtFQUN4QyxJQUFJQyxlQUFlLEdBQUdySCxRQUFRLENBQUMxRyxTQUFTLENBQUM2QixRQUFRLENBQzlDeUUsSUFBSSxDQUFDZ0YsTUFBTSxDQUFDdEwsU0FBUyxDQUFDdUwsY0FBYyxDQUFDLENBQ3JDNU8sT0FBTyxDQUFDbVIsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUM3Qm5SLE9BQU8sQ0FBQyx3REFBd0QsRUFBRSxPQUFPLENBQUM7RUFDN0UsSUFBSXFSLFVBQVUsR0FBR3hQLE1BQU0sQ0FBQyxHQUFHLEdBQUd1UCxlQUFlLEdBQUcsR0FBRyxDQUFDO0VBQ3BELE9BQU9FLFFBQVEsQ0FBQ0osQ0FBQyxDQUFDLElBQUlHLFVBQVUsQ0FBQ3RQLElBQUksQ0FBQ21QLENBQUMsQ0FBQztBQUMxQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBU0ksUUFBUUEsQ0FBQy9SLEtBQUssRUFBRTtFQUN2QixJQUFJdEMsSUFBSSxHQUFBK1QsT0FBQSxDQUFVelIsS0FBSztFQUN2QixPQUFPQSxLQUFLLElBQUksSUFBSSxLQUFLdEMsSUFBSSxJQUFJLFFBQVEsSUFBSUEsSUFBSSxJQUFJLFVBQVUsQ0FBQztBQUNsRTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBU3NVLFFBQVFBLENBQUNoUyxLQUFLLEVBQUU7RUFDdkIsT0FBTyxPQUFPQSxLQUFLLEtBQUssUUFBUSxJQUFJQSxLQUFLLFlBQVlpUyxNQUFNO0FBQzdEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVNDLGNBQWNBLENBQUNDLENBQUMsRUFBRTtFQUN6QixPQUFPQyxNQUFNLENBQUNDLFFBQVEsQ0FBQ0YsQ0FBQyxDQUFDO0FBQzNCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVNkLFNBQVNBLENBQUNpQixDQUFDLEVBQUU7RUFDcEIsT0FBTyxDQUFDclAsTUFBTSxDQUFDcVAsQ0FBQyxFQUFFLFdBQVcsQ0FBQztBQUNoQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVNDLFVBQVVBLENBQUMxVSxDQUFDLEVBQUU7RUFDckIsSUFBSUgsSUFBSSxHQUFHOFQsUUFBUSxDQUFDM1QsQ0FBQyxDQUFDO0VBQ3RCLE9BQU9ILElBQUksS0FBSyxRQUFRLElBQUlBLElBQUksS0FBSyxPQUFPO0FBQzlDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM4VSxPQUFPQSxDQUFDblYsQ0FBQyxFQUFFO0VBQ2xCO0VBQ0EsT0FBTzRGLE1BQU0sQ0FBQzVGLENBQUMsRUFBRSxPQUFPLENBQUMsSUFBSTRGLE1BQU0sQ0FBQzVGLENBQUMsRUFBRSxXQUFXLENBQUM7QUFDckQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVNvVixTQUFTQSxDQUFDQyxDQUFDLEVBQUU7RUFDcEIsT0FBT1gsUUFBUSxDQUFDVyxDQUFDLENBQUMsSUFBSXpQLE1BQU0sQ0FBQ3lQLENBQUMsQ0FBQy9KLElBQUksRUFBRSxVQUFVLENBQUM7QUFDbEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVNnSyxTQUFTQSxDQUFBLEVBQUc7RUFDbkIsT0FBTyxPQUFPQyxNQUFNLEtBQUssV0FBVztBQUN0QztBQUVBLFNBQVNyQyxNQUFNQSxDQUFBLEVBQUc7RUFDaEIsT0FBTyxVQUFVO0FBQ25COztBQUVBO0FBQ0EsU0FBU3NDLEtBQUtBLENBQUEsRUFBRztFQUNmLElBQUlDLENBQUMsR0FBRy9NLEdBQUcsQ0FBQyxDQUFDO0VBQ2IsSUFBSWdOLElBQUksR0FBRyxzQ0FBc0MsQ0FBQ3RTLE9BQU8sQ0FDdkQsT0FBTyxFQUNQLFVBQVV1SixDQUFDLEVBQUU7SUFDWCxJQUFJcUUsQ0FBQyxHQUFHLENBQUN5RSxDQUFDLEdBQUdFLElBQUksQ0FBQ0MsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUM7SUFDekNILENBQUMsR0FBR0UsSUFBSSxDQUFDRSxLQUFLLENBQUNKLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDdEIsT0FBTyxDQUFDOUksQ0FBQyxLQUFLLEdBQUcsR0FBR3FFLENBQUMsR0FBSUEsQ0FBQyxHQUFHLEdBQUcsR0FBSSxHQUFHLEVBQUUxSSxRQUFRLENBQUMsRUFBRSxDQUFDO0VBQ3ZELENBQ0YsQ0FBQztFQUNELE9BQU9vTixJQUFJO0FBQ2I7QUFFQSxJQUFJSSxNQUFNLEdBQUc7RUFDWEMsS0FBSyxFQUFFLENBQUM7RUFDUkMsSUFBSSxFQUFFLENBQUM7RUFDUEMsT0FBTyxFQUFFLENBQUM7RUFDVnpKLEtBQUssRUFBRSxDQUFDO0VBQ1IwSixRQUFRLEVBQUU7QUFDWixDQUFDO0FBRUQsU0FBU0MsV0FBV0EsQ0FBQ2hPLEdBQUcsRUFBRTtFQUN4QixJQUFJaU8sWUFBWSxHQUFHQyxRQUFRLENBQUNsTyxHQUFHLENBQUM7RUFDaEMsSUFBSSxDQUFDaU8sWUFBWSxFQUFFO0lBQ2pCLE9BQU8sV0FBVztFQUNwQjs7RUFFQTtFQUNBLElBQUlBLFlBQVksQ0FBQ0UsTUFBTSxLQUFLLEVBQUUsRUFBRTtJQUM5QkYsWUFBWSxDQUFDRyxNQUFNLEdBQUdILFlBQVksQ0FBQ0csTUFBTSxDQUFDblQsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7RUFDNUQ7RUFFQStFLEdBQUcsR0FBR2lPLFlBQVksQ0FBQ0csTUFBTSxDQUFDblQsT0FBTyxDQUFDLEdBQUcsR0FBR2dULFlBQVksQ0FBQzVFLEtBQUssRUFBRSxFQUFFLENBQUM7RUFDL0QsT0FBT3JKLEdBQUc7QUFDWjtBQUVBLElBQUlxTyxlQUFlLEdBQUc7RUFDcEJDLFVBQVUsRUFBRSxLQUFLO0VBQ2pCL1QsR0FBRyxFQUFFLENBQ0gsUUFBUSxFQUNSLFVBQVUsRUFDVixXQUFXLEVBQ1gsVUFBVSxFQUNWLE1BQU0sRUFDTixVQUFVLEVBQ1YsTUFBTSxFQUNOLE1BQU0sRUFDTixVQUFVLEVBQ1YsTUFBTSxFQUNOLFdBQVcsRUFDWCxNQUFNLEVBQ04sT0FBTyxFQUNQLFFBQVEsQ0FDVDtFQUNEZ1UsQ0FBQyxFQUFFO0lBQ0R4UixJQUFJLEVBQUUsVUFBVTtJQUNoQnlSLE1BQU0sRUFBRTtFQUNWLENBQUM7RUFDREEsTUFBTSxFQUFFO0lBQ05DLE1BQU0sRUFDSix5SUFBeUk7SUFDM0lDLEtBQUssRUFDSDtFQUNKO0FBQ0YsQ0FBQztBQUVELFNBQVNSLFFBQVFBLENBQUNTLEdBQUcsRUFBRTtFQUNyQixJQUFJLENBQUNsUixNQUFNLENBQUNrUixHQUFHLEVBQUUsUUFBUSxDQUFDLEVBQUU7SUFDMUIsT0FBTzdWLFNBQVM7RUFDbEI7RUFFQSxJQUFJOFYsQ0FBQyxHQUFHUCxlQUFlO0VBQ3ZCLElBQUlRLENBQUMsR0FBR0QsQ0FBQyxDQUFDSixNQUFNLENBQUNJLENBQUMsQ0FBQ04sVUFBVSxHQUFHLFFBQVEsR0FBRyxPQUFPLENBQUMsQ0FBQ1EsSUFBSSxDQUFDSCxHQUFHLENBQUM7RUFDN0QsSUFBSUksR0FBRyxHQUFHLENBQUMsQ0FBQztFQUVaLEtBQUssSUFBSTFXLENBQUMsR0FBRyxDQUFDLEVBQUUyVyxDQUFDLEdBQUdKLENBQUMsQ0FBQ3JVLEdBQUcsQ0FBQ2pDLE1BQU0sRUFBRUQsQ0FBQyxHQUFHMlcsQ0FBQyxFQUFFLEVBQUUzVyxDQUFDLEVBQUU7SUFDNUMwVyxHQUFHLENBQUNILENBQUMsQ0FBQ3JVLEdBQUcsQ0FBQ2xDLENBQUMsQ0FBQyxDQUFDLEdBQUd3VyxDQUFDLENBQUN4VyxDQUFDLENBQUMsSUFBSSxFQUFFO0VBQzVCO0VBRUEwVyxHQUFHLENBQUNILENBQUMsQ0FBQ0wsQ0FBQyxDQUFDeFIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ2xCZ1MsR0FBRyxDQUFDSCxDQUFDLENBQUNyVSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQ1UsT0FBTyxDQUFDMlQsQ0FBQyxDQUFDTCxDQUFDLENBQUNDLE1BQU0sRUFBRSxVQUFVUyxFQUFFLEVBQUVDLEVBQUUsRUFBRUMsRUFBRSxFQUFFO0lBQ3ZELElBQUlELEVBQUUsRUFBRTtNQUNOSCxHQUFHLENBQUNILENBQUMsQ0FBQ0wsQ0FBQyxDQUFDeFIsSUFBSSxDQUFDLENBQUNtUyxFQUFFLENBQUMsR0FBR0MsRUFBRTtJQUN4QjtFQUNGLENBQUMsQ0FBQztFQUVGLE9BQU9KLEdBQUc7QUFDWjtBQUVBLFNBQVNLLDZCQUE2QkEsQ0FBQ0MsV0FBVyxFQUFFblMsT0FBTyxFQUFFb1MsTUFBTSxFQUFFO0VBQ25FQSxNQUFNLEdBQUdBLE1BQU0sSUFBSSxDQUFDLENBQUM7RUFDckJBLE1BQU0sQ0FBQ0MsWUFBWSxHQUFHRixXQUFXO0VBQ2pDLElBQUlHLFdBQVcsR0FBRyxFQUFFO0VBQ3BCLElBQUlyRSxDQUFDO0VBQ0wsS0FBS0EsQ0FBQyxJQUFJbUUsTUFBTSxFQUFFO0lBQ2hCLElBQUkxRixNQUFNLENBQUN0TCxTQUFTLENBQUN1TCxjQUFjLENBQUNqRixJQUFJLENBQUMwSyxNQUFNLEVBQUVuRSxDQUFDLENBQUMsRUFBRTtNQUNuRHFFLFdBQVcsQ0FBQ3BWLElBQUksQ0FBQyxDQUFDK1EsQ0FBQyxFQUFFbUUsTUFBTSxDQUFDbkUsQ0FBQyxDQUFDLENBQUMsQ0FBQ2xSLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QztFQUNGO0VBQ0EsSUFBSW9QLEtBQUssR0FBRyxHQUFHLEdBQUdtRyxXQUFXLENBQUNDLElBQUksQ0FBQyxDQUFDLENBQUN4VixJQUFJLENBQUMsR0FBRyxDQUFDO0VBRTlDaUQsT0FBTyxHQUFHQSxPQUFPLElBQUksQ0FBQyxDQUFDO0VBQ3ZCQSxPQUFPLENBQUNtSyxJQUFJLEdBQUduSyxPQUFPLENBQUNtSyxJQUFJLElBQUksRUFBRTtFQUNqQyxJQUFJcUksRUFBRSxHQUFHeFMsT0FBTyxDQUFDbUssSUFBSSxDQUFDa0MsT0FBTyxDQUFDLEdBQUcsQ0FBQztFQUNsQyxJQUFJb0csQ0FBQyxHQUFHelMsT0FBTyxDQUFDbUssSUFBSSxDQUFDa0MsT0FBTyxDQUFDLEdBQUcsQ0FBQztFQUNqQyxJQUFJMkQsQ0FBQztFQUNMLElBQUl3QyxFQUFFLEtBQUssQ0FBQyxDQUFDLEtBQUtDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSUEsQ0FBQyxHQUFHRCxFQUFFLENBQUMsRUFBRTtJQUNyQ3hDLENBQUMsR0FBR2hRLE9BQU8sQ0FBQ21LLElBQUk7SUFDaEJuSyxPQUFPLENBQUNtSyxJQUFJLEdBQUc2RixDQUFDLENBQUMxRCxTQUFTLENBQUMsQ0FBQyxFQUFFa0csRUFBRSxDQUFDLEdBQUdyRyxLQUFLLEdBQUcsR0FBRyxHQUFHNkQsQ0FBQyxDQUFDMUQsU0FBUyxDQUFDa0csRUFBRSxHQUFHLENBQUMsQ0FBQztFQUN2RSxDQUFDLE1BQU07SUFDTCxJQUFJQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7TUFDWnpDLENBQUMsR0FBR2hRLE9BQU8sQ0FBQ21LLElBQUk7TUFDaEJuSyxPQUFPLENBQUNtSyxJQUFJLEdBQUc2RixDQUFDLENBQUMxRCxTQUFTLENBQUMsQ0FBQyxFQUFFbUcsQ0FBQyxDQUFDLEdBQUd0RyxLQUFLLEdBQUc2RCxDQUFDLENBQUMxRCxTQUFTLENBQUNtRyxDQUFDLENBQUM7SUFDM0QsQ0FBQyxNQUFNO01BQ0x6UyxPQUFPLENBQUNtSyxJQUFJLEdBQUduSyxPQUFPLENBQUNtSyxJQUFJLEdBQUdnQyxLQUFLO0lBQ3JDO0VBQ0Y7QUFDRjtBQUVBLFNBQVN1RyxTQUFTQSxDQUFDOUMsQ0FBQyxFQUFFM0YsUUFBUSxFQUFFO0VBQzlCQSxRQUFRLEdBQUdBLFFBQVEsSUFBSTJGLENBQUMsQ0FBQzNGLFFBQVE7RUFDakMsSUFBSSxDQUFDQSxRQUFRLElBQUkyRixDQUFDLENBQUM1RCxJQUFJLEVBQUU7SUFDdkIsSUFBSTRELENBQUMsQ0FBQzVELElBQUksS0FBSyxFQUFFLEVBQUU7TUFDakIvQixRQUFRLEdBQUcsT0FBTztJQUNwQixDQUFDLE1BQU0sSUFBSTJGLENBQUMsQ0FBQzVELElBQUksS0FBSyxHQUFHLEVBQUU7TUFDekIvQixRQUFRLEdBQUcsUUFBUTtJQUNyQjtFQUNGO0VBQ0FBLFFBQVEsR0FBR0EsUUFBUSxJQUFJLFFBQVE7RUFFL0IsSUFBSSxDQUFDMkYsQ0FBQyxDQUFDN0QsUUFBUSxFQUFFO0lBQ2YsT0FBTyxJQUFJO0VBQ2I7RUFDQSxJQUFJRixNQUFNLEdBQUc1QixRQUFRLEdBQUcsSUFBSSxHQUFHMkYsQ0FBQyxDQUFDN0QsUUFBUTtFQUN6QyxJQUFJNkQsQ0FBQyxDQUFDNUQsSUFBSSxFQUFFO0lBQ1ZILE1BQU0sR0FBR0EsTUFBTSxHQUFHLEdBQUcsR0FBRytELENBQUMsQ0FBQzVELElBQUk7RUFDaEM7RUFDQSxJQUFJNEQsQ0FBQyxDQUFDekYsSUFBSSxFQUFFO0lBQ1YwQixNQUFNLEdBQUdBLE1BQU0sR0FBRytELENBQUMsQ0FBQ3pGLElBQUk7RUFDMUI7RUFDQSxPQUFPMEIsTUFBTTtBQUNmO0FBRUEsU0FBU2xGLFNBQVNBLENBQUN5RSxHQUFHLEVBQUV1SCxNQUFNLEVBQUU7RUFDOUIsSUFBSXJWLEtBQUssRUFBRTZKLEtBQUs7RUFDaEIsSUFBSTtJQUNGN0osS0FBSyxHQUFHa1IsV0FBVyxDQUFDN0gsU0FBUyxDQUFDeUUsR0FBRyxDQUFDO0VBQ3BDLENBQUMsQ0FBQyxPQUFPd0gsU0FBUyxFQUFFO0lBQ2xCLElBQUlELE1BQU0sSUFBSW5RLFVBQVUsQ0FBQ21RLE1BQU0sQ0FBQyxFQUFFO01BQ2hDLElBQUk7UUFDRnJWLEtBQUssR0FBR3FWLE1BQU0sQ0FBQ3ZILEdBQUcsQ0FBQztNQUNyQixDQUFDLENBQUMsT0FBT3lILFdBQVcsRUFBRTtRQUNwQjFMLEtBQUssR0FBRzBMLFdBQVc7TUFDckI7SUFDRixDQUFDLE1BQU07TUFDTDFMLEtBQUssR0FBR3lMLFNBQVM7SUFDbkI7RUFDRjtFQUNBLE9BQU87SUFBRXpMLEtBQUssRUFBRUEsS0FBSztJQUFFN0osS0FBSyxFQUFFQTtFQUFNLENBQUM7QUFDdkM7QUFFQSxTQUFTd1YsV0FBV0EsQ0FBQ0MsTUFBTSxFQUFFO0VBQzNCO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBRUEsSUFBSUMsS0FBSyxHQUFHLENBQUM7RUFDYixJQUFJNVgsTUFBTSxHQUFHMlgsTUFBTSxDQUFDM1gsTUFBTTtFQUUxQixLQUFLLElBQUlELENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR0MsTUFBTSxFQUFFRCxDQUFDLEVBQUUsRUFBRTtJQUMvQixJQUFJNEosSUFBSSxHQUFHZ08sTUFBTSxDQUFDRSxVQUFVLENBQUM5WCxDQUFDLENBQUM7SUFDL0IsSUFBSTRKLElBQUksR0FBRyxHQUFHLEVBQUU7TUFDZDtNQUNBaU8sS0FBSyxHQUFHQSxLQUFLLEdBQUcsQ0FBQztJQUNuQixDQUFDLE1BQU0sSUFBSWpPLElBQUksR0FBRyxJQUFJLEVBQUU7TUFDdEI7TUFDQWlPLEtBQUssR0FBR0EsS0FBSyxHQUFHLENBQUM7SUFDbkIsQ0FBQyxNQUFNLElBQUlqTyxJQUFJLEdBQUcsS0FBSyxFQUFFO01BQ3ZCO01BQ0FpTyxLQUFLLEdBQUdBLEtBQUssR0FBRyxDQUFDO0lBQ25CO0VBQ0Y7RUFFQSxPQUFPQSxLQUFLO0FBQ2Q7QUFFQSxTQUFTRSxTQUFTQSxDQUFDQyxDQUFDLEVBQUU7RUFDcEIsSUFBSTdWLEtBQUssRUFBRTZKLEtBQUs7RUFDaEIsSUFBSTtJQUNGN0osS0FBSyxHQUFHa1IsV0FBVyxDQUFDNUgsS0FBSyxDQUFDdU0sQ0FBQyxDQUFDO0VBQzlCLENBQUMsQ0FBQyxPQUFPeFksQ0FBQyxFQUFFO0lBQ1Z3TSxLQUFLLEdBQUd4TSxDQUFDO0VBQ1g7RUFDQSxPQUFPO0lBQUV3TSxLQUFLLEVBQUVBLEtBQUs7SUFBRTdKLEtBQUssRUFBRUE7RUFBTSxDQUFDO0FBQ3ZDO0FBRUEsU0FBUzhWLHNCQUFzQkEsQ0FDN0J6TCxPQUFPLEVBQ1A3RSxHQUFHLEVBQ0h1USxNQUFNLEVBQ05DLEtBQUssRUFDTG5NLEtBQUssRUFDTG9NLElBQUksRUFDSkMsYUFBYSxFQUNiQyxXQUFXLEVBQ1g7RUFDQSxJQUFJeFMsUUFBUSxHQUFHO0lBQ2I2QixHQUFHLEVBQUVBLEdBQUcsSUFBSSxFQUFFO0lBQ2Q0USxJQUFJLEVBQUVMLE1BQU07SUFDWk0sTUFBTSxFQUFFTDtFQUNWLENBQUM7RUFDRHJTLFFBQVEsQ0FBQzJTLElBQUksR0FBR0gsV0FBVyxDQUFDSSxpQkFBaUIsQ0FBQzVTLFFBQVEsQ0FBQzZCLEdBQUcsRUFBRTdCLFFBQVEsQ0FBQ3lTLElBQUksQ0FBQztFQUMxRXpTLFFBQVEsQ0FBQzZTLE9BQU8sR0FBR0wsV0FBVyxDQUFDTSxhQUFhLENBQUM5UyxRQUFRLENBQUM2QixHQUFHLEVBQUU3QixRQUFRLENBQUN5UyxJQUFJLENBQUM7RUFDekUsSUFBSXZTLElBQUksR0FDTixPQUFPNlMsUUFBUSxLQUFLLFdBQVcsSUFDL0JBLFFBQVEsSUFDUkEsUUFBUSxDQUFDL1MsUUFBUSxJQUNqQitTLFFBQVEsQ0FBQy9TLFFBQVEsQ0FBQ0UsSUFBSTtFQUN4QixJQUFJOFMsU0FBUyxHQUNYLE9BQU8vRCxNQUFNLEtBQUssV0FBVyxJQUM3QkEsTUFBTSxJQUNOQSxNQUFNLENBQUNnRSxTQUFTLElBQ2hCaEUsTUFBTSxDQUFDZ0UsU0FBUyxDQUFDQyxTQUFTO0VBQzVCLE9BQU87SUFDTFosSUFBSSxFQUFFQSxJQUFJO0lBQ1Y1TCxPQUFPLEVBQUVSLEtBQUssR0FBR29JLE1BQU0sQ0FBQ3BJLEtBQUssQ0FBQyxHQUFHUSxPQUFPLElBQUk2TCxhQUFhO0lBQ3pEMVEsR0FBRyxFQUFFM0IsSUFBSTtJQUNUbUUsS0FBSyxFQUFFLENBQUNyRSxRQUFRLENBQUM7SUFDakJnVCxTQUFTLEVBQUVBO0VBQ2IsQ0FBQztBQUNIO0FBRUEsU0FBU0csWUFBWUEsQ0FBQ0MsTUFBTSxFQUFFcEYsQ0FBQyxFQUFFO0VBQy9CLE9BQU8sVUFBVXFGLEdBQUcsRUFBRXBPLElBQUksRUFBRTtJQUMxQixJQUFJO01BQ0YrSSxDQUFDLENBQUNxRixHQUFHLEVBQUVwTyxJQUFJLENBQUM7SUFDZCxDQUFDLENBQUMsT0FBT3ZMLENBQUMsRUFBRTtNQUNWMFosTUFBTSxDQUFDbE4sS0FBSyxDQUFDeE0sQ0FBQyxDQUFDO0lBQ2pCO0VBQ0YsQ0FBQztBQUNIO0FBRUEsU0FBUzRaLGdCQUFnQkEsQ0FBQ25KLEdBQUcsRUFBRTtFQUM3QixJQUFJK0MsSUFBSSxHQUFHLENBQUMvQyxHQUFHLENBQUM7RUFFaEIsU0FBU2hGLEtBQUtBLENBQUNnRixHQUFHLEVBQUUrQyxJQUFJLEVBQUU7SUFDeEIsSUFBSTdRLEtBQUs7TUFDUHVDLElBQUk7TUFDSjJVLE9BQU87TUFDUDNJLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFFYixJQUFJO01BQ0YsS0FBS2hNLElBQUksSUFBSXVMLEdBQUcsRUFBRTtRQUNoQjlOLEtBQUssR0FBRzhOLEdBQUcsQ0FBQ3ZMLElBQUksQ0FBQztRQUVqQixJQUFJdkMsS0FBSyxLQUFLaUQsTUFBTSxDQUFDakQsS0FBSyxFQUFFLFFBQVEsQ0FBQyxJQUFJaUQsTUFBTSxDQUFDakQsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUU7VUFDaEUsSUFBSTZRLElBQUksQ0FBQzNILFFBQVEsQ0FBQ2xKLEtBQUssQ0FBQyxFQUFFO1lBQ3hCdU8sTUFBTSxDQUFDaE0sSUFBSSxDQUFDLEdBQUcsOEJBQThCLEdBQUdpUCxRQUFRLENBQUN4UixLQUFLLENBQUM7VUFDakUsQ0FBQyxNQUFNO1lBQ0xrWCxPQUFPLEdBQUdyRyxJQUFJLENBQUMxRyxLQUFLLENBQUMsQ0FBQztZQUN0QitNLE9BQU8sQ0FBQ3RYLElBQUksQ0FBQ0ksS0FBSyxDQUFDO1lBQ25CdU8sTUFBTSxDQUFDaE0sSUFBSSxDQUFDLEdBQUd1RyxLQUFLLENBQUM5SSxLQUFLLEVBQUVrWCxPQUFPLENBQUM7VUFDdEM7VUFDQTtRQUNGO1FBRUEzSSxNQUFNLENBQUNoTSxJQUFJLENBQUMsR0FBR3ZDLEtBQUs7TUFDdEI7SUFDRixDQUFDLENBQUMsT0FBTzNDLENBQUMsRUFBRTtNQUNWa1IsTUFBTSxHQUFHLDhCQUE4QixHQUFHbFIsQ0FBQyxDQUFDZ04sT0FBTztJQUNyRDtJQUNBLE9BQU9rRSxNQUFNO0VBQ2Y7RUFDQSxPQUFPekYsS0FBSyxDQUFDZ0YsR0FBRyxFQUFFK0MsSUFBSSxDQUFDO0FBQ3pCO0FBRUEsU0FBU3NHLFVBQVVBLENBQUMvTyxJQUFJLEVBQUUyTyxNQUFNLEVBQUV4VCxRQUFRLEVBQUU2VCxXQUFXLEVBQUVDLGFBQWEsRUFBRTtFQUN0RSxJQUFJaE4sT0FBTyxFQUFFMk0sR0FBRyxFQUFFTSxNQUFNLEVBQUVDLFFBQVEsRUFBRS9RLE9BQU87RUFDM0MsSUFBSWdSLEdBQUc7RUFDUCxJQUFJQyxTQUFTLEdBQUcsRUFBRTtFQUNsQixJQUFJcFUsVUFBVSxHQUFHLENBQUMsQ0FBQztFQUNuQixJQUFJcVUsUUFBUSxHQUFHLEVBQUU7RUFFakIsS0FBSyxJQUFJN1osQ0FBQyxHQUFHLENBQUMsRUFBRTJXLENBQUMsR0FBR3BNLElBQUksQ0FBQ3RLLE1BQU0sRUFBRUQsQ0FBQyxHQUFHMlcsQ0FBQyxFQUFFLEVBQUUzVyxDQUFDLEVBQUU7SUFDM0MyWixHQUFHLEdBQUdwUCxJQUFJLENBQUN2SyxDQUFDLENBQUM7SUFFYixJQUFJOFosR0FBRyxHQUFHbkcsUUFBUSxDQUFDZ0csR0FBRyxDQUFDO0lBQ3ZCRSxRQUFRLENBQUM5WCxJQUFJLENBQUMrWCxHQUFHLENBQUM7SUFDbEIsUUFBUUEsR0FBRztNQUNULEtBQUssV0FBVztRQUNkO01BQ0YsS0FBSyxRQUFRO1FBQ1h0TixPQUFPLEdBQUdvTixTQUFTLENBQUM3WCxJQUFJLENBQUM0WCxHQUFHLENBQUMsR0FBSW5OLE9BQU8sR0FBR21OLEdBQUk7UUFDL0M7TUFDRixLQUFLLFVBQVU7UUFDYkQsUUFBUSxHQUFHVCxZQUFZLENBQUNDLE1BQU0sRUFBRVMsR0FBRyxDQUFDO1FBQ3BDO01BQ0YsS0FBSyxNQUFNO1FBQ1RDLFNBQVMsQ0FBQzdYLElBQUksQ0FBQzRYLEdBQUcsQ0FBQztRQUNuQjtNQUNGLEtBQUssT0FBTztNQUNaLEtBQUssY0FBYztNQUNuQixLQUFLLFdBQVc7UUFBRTtRQUNoQlIsR0FBRyxHQUFHUyxTQUFTLENBQUM3WCxJQUFJLENBQUM0WCxHQUFHLENBQUMsR0FBSVIsR0FBRyxHQUFHUSxHQUFJO1FBQ3ZDO01BQ0YsS0FBSyxRQUFRO01BQ2IsS0FBSyxPQUFPO1FBQ1YsSUFDRUEsR0FBRyxZQUFZdlAsS0FBSyxJQUNuQixPQUFPMlAsWUFBWSxLQUFLLFdBQVcsSUFBSUosR0FBRyxZQUFZSSxZQUFhLEVBQ3BFO1VBQ0FaLEdBQUcsR0FBR1MsU0FBUyxDQUFDN1gsSUFBSSxDQUFDNFgsR0FBRyxDQUFDLEdBQUlSLEdBQUcsR0FBR1EsR0FBSTtVQUN2QztRQUNGO1FBQ0EsSUFBSUosV0FBVyxJQUFJTyxHQUFHLEtBQUssUUFBUSxJQUFJLENBQUNuUixPQUFPLEVBQUU7VUFDL0MsS0FBSyxJQUFJcVIsQ0FBQyxHQUFHLENBQUMsRUFBRXhZLEdBQUcsR0FBRytYLFdBQVcsQ0FBQ3RaLE1BQU0sRUFBRStaLENBQUMsR0FBR3hZLEdBQUcsRUFBRSxFQUFFd1ksQ0FBQyxFQUFFO1lBQ3RELElBQUlMLEdBQUcsQ0FBQ0osV0FBVyxDQUFDUyxDQUFDLENBQUMsQ0FBQyxLQUFLdlosU0FBUyxFQUFFO2NBQ3JDa0ksT0FBTyxHQUFHZ1IsR0FBRztjQUNiO1lBQ0Y7VUFDRjtVQUNBLElBQUloUixPQUFPLEVBQUU7WUFDWDtVQUNGO1FBQ0Y7UUFDQThRLE1BQU0sR0FBR0csU0FBUyxDQUFDN1gsSUFBSSxDQUFDNFgsR0FBRyxDQUFDLEdBQUlGLE1BQU0sR0FBR0UsR0FBSTtRQUM3QztNQUNGO1FBQ0UsSUFDRUEsR0FBRyxZQUFZdlAsS0FBSyxJQUNuQixPQUFPMlAsWUFBWSxLQUFLLFdBQVcsSUFBSUosR0FBRyxZQUFZSSxZQUFhLEVBQ3BFO1VBQ0FaLEdBQUcsR0FBR1MsU0FBUyxDQUFDN1gsSUFBSSxDQUFDNFgsR0FBRyxDQUFDLEdBQUlSLEdBQUcsR0FBR1EsR0FBSTtVQUN2QztRQUNGO1FBQ0FDLFNBQVMsQ0FBQzdYLElBQUksQ0FBQzRYLEdBQUcsQ0FBQztJQUN2QjtFQUNGOztFQUVBO0VBQ0EsSUFBSUYsTUFBTSxFQUFFQSxNQUFNLEdBQUdMLGdCQUFnQixDQUFDSyxNQUFNLENBQUM7RUFFN0MsSUFBSUcsU0FBUyxDQUFDM1osTUFBTSxHQUFHLENBQUMsRUFBRTtJQUN4QixJQUFJLENBQUN3WixNQUFNLEVBQUVBLE1BQU0sR0FBR0wsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUNLLE1BQU0sQ0FBQ0csU0FBUyxHQUFHUixnQkFBZ0IsQ0FBQ1EsU0FBUyxDQUFDO0VBQ2hEO0VBRUEsSUFBSUssSUFBSSxHQUFHO0lBQ1R6TixPQUFPLEVBQUVBLE9BQU87SUFDaEIyTSxHQUFHLEVBQUVBLEdBQUc7SUFDUk0sTUFBTSxFQUFFQSxNQUFNO0lBQ2RTLFNBQVMsRUFBRWhTLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCd1IsUUFBUSxFQUFFQSxRQUFRO0lBQ2xCaFUsUUFBUSxFQUFFQSxRQUFRO0lBQ2xCRixVQUFVLEVBQUVBLFVBQVU7SUFDdEIwUCxJQUFJLEVBQUVGLEtBQUssQ0FBQztFQUNkLENBQUM7RUFFRGlGLElBQUksQ0FBQ3hSLElBQUksR0FBR3dSLElBQUksQ0FBQ3hSLElBQUksSUFBSSxDQUFDLENBQUM7RUFFM0IwUixpQkFBaUIsQ0FBQ0YsSUFBSSxFQUFFUixNQUFNLENBQUM7RUFFL0IsSUFBSUYsV0FBVyxJQUFJNVEsT0FBTyxFQUFFO0lBQzFCc1IsSUFBSSxDQUFDdFIsT0FBTyxHQUFHQSxPQUFPO0VBQ3hCO0VBQ0EsSUFBSTZRLGFBQWEsRUFBRTtJQUNqQlMsSUFBSSxDQUFDVCxhQUFhLEdBQUdBLGFBQWE7RUFDcEM7RUFDQVMsSUFBSSxDQUFDRyxhQUFhLEdBQUc3UCxJQUFJO0VBQ3pCMFAsSUFBSSxDQUFDelUsVUFBVSxDQUFDNlUsa0JBQWtCLEdBQUdSLFFBQVE7RUFDN0MsT0FBT0ksSUFBSTtBQUNiO0FBRUEsU0FBU0UsaUJBQWlCQSxDQUFDRixJQUFJLEVBQUVSLE1BQU0sRUFBRTtFQUN2QyxJQUFJQSxNQUFNLElBQUlBLE1BQU0sQ0FBQzNQLEtBQUssS0FBS3JKLFNBQVMsRUFBRTtJQUN4Q3daLElBQUksQ0FBQ25RLEtBQUssR0FBRzJQLE1BQU0sQ0FBQzNQLEtBQUs7SUFDekIsT0FBTzJQLE1BQU0sQ0FBQzNQLEtBQUs7RUFDckI7RUFDQSxJQUFJMlAsTUFBTSxJQUFJQSxNQUFNLENBQUN4TixVQUFVLEtBQUt4TCxTQUFTLEVBQUU7SUFDN0N3WixJQUFJLENBQUNoTyxVQUFVLEdBQUd3TixNQUFNLENBQUN4TixVQUFVO0lBQ25DLE9BQU93TixNQUFNLENBQUN4TixVQUFVO0VBQzFCO0FBQ0Y7QUFFQSxTQUFTcU8sZUFBZUEsQ0FBQ0wsSUFBSSxFQUFFTSxNQUFNLEVBQUU7RUFDckMsSUFBSWQsTUFBTSxHQUFHUSxJQUFJLENBQUN4UixJQUFJLENBQUNnUixNQUFNLElBQUksQ0FBQyxDQUFDO0VBQ25DLElBQUllLFlBQVksR0FBRyxLQUFLO0VBRXhCLElBQUk7SUFDRixLQUFLLElBQUl4YSxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUd1YSxNQUFNLENBQUN0YSxNQUFNLEVBQUUsRUFBRUQsQ0FBQyxFQUFFO01BQ3RDLElBQUl1YSxNQUFNLENBQUN2YSxDQUFDLENBQUMsQ0FBQ3dSLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO1FBQzlDaUksTUFBTSxHQUFHcFUsS0FBSyxDQUFDb1UsTUFBTSxFQUFFTCxnQkFBZ0IsQ0FBQ21CLE1BQU0sQ0FBQ3ZhLENBQUMsQ0FBQyxDQUFDeWEsY0FBYyxDQUFDLENBQUM7UUFDbEVELFlBQVksR0FBRyxJQUFJO01BQ3JCO0lBQ0Y7O0lBRUE7SUFDQSxJQUFJQSxZQUFZLEVBQUU7TUFDaEJQLElBQUksQ0FBQ3hSLElBQUksQ0FBQ2dSLE1BQU0sR0FBR0EsTUFBTTtJQUMzQjtFQUNGLENBQUMsQ0FBQyxPQUFPamEsQ0FBQyxFQUFFO0lBQ1Z5YSxJQUFJLENBQUN6VSxVQUFVLENBQUNrVixhQUFhLEdBQUcsVUFBVSxHQUFHbGIsQ0FBQyxDQUFDZ04sT0FBTztFQUN4RDtBQUNGO0FBRUEsSUFBSW1PLGVBQWUsR0FBRyxDQUNwQixLQUFLLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxZQUFZLEVBQ1osT0FBTyxFQUNQLFFBQVEsQ0FDVDtBQUNELElBQUlDLGdCQUFnQixHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQztBQUV4RSxTQUFTQyxhQUFhQSxDQUFDelIsR0FBRyxFQUFFMFIsR0FBRyxFQUFFO0VBQy9CLEtBQUssSUFBSWhJLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBRzFKLEdBQUcsQ0FBQ25KLE1BQU0sRUFBRSxFQUFFNlMsQ0FBQyxFQUFFO0lBQ25DLElBQUkxSixHQUFHLENBQUMwSixDQUFDLENBQUMsS0FBS2dJLEdBQUcsRUFBRTtNQUNsQixPQUFPLElBQUk7SUFDYjtFQUNGO0VBRUEsT0FBTyxLQUFLO0FBQ2Q7QUFFQSxTQUFTQyxvQkFBb0JBLENBQUN4USxJQUFJLEVBQUU7RUFDbEMsSUFBSTFLLElBQUksRUFBRTZLLFFBQVEsRUFBRVosS0FBSztFQUN6QixJQUFJNlAsR0FBRztFQUVQLEtBQUssSUFBSTNaLENBQUMsR0FBRyxDQUFDLEVBQUUyVyxDQUFDLEdBQUdwTSxJQUFJLENBQUN0SyxNQUFNLEVBQUVELENBQUMsR0FBRzJXLENBQUMsRUFBRSxFQUFFM1csQ0FBQyxFQUFFO0lBQzNDMlosR0FBRyxHQUFHcFAsSUFBSSxDQUFDdkssQ0FBQyxDQUFDO0lBRWIsSUFBSThaLEdBQUcsR0FBR25HLFFBQVEsQ0FBQ2dHLEdBQUcsQ0FBQztJQUN2QixRQUFRRyxHQUFHO01BQ1QsS0FBSyxRQUFRO1FBQ1gsSUFBSSxDQUFDamEsSUFBSSxJQUFJZ2IsYUFBYSxDQUFDRixlQUFlLEVBQUVoQixHQUFHLENBQUMsRUFBRTtVQUNoRDlaLElBQUksR0FBRzhaLEdBQUc7UUFDWixDQUFDLE1BQU0sSUFBSSxDQUFDN1AsS0FBSyxJQUFJK1EsYUFBYSxDQUFDRCxnQkFBZ0IsRUFBRWpCLEdBQUcsQ0FBQyxFQUFFO1VBQ3pEN1AsS0FBSyxHQUFHNlAsR0FBRztRQUNiO1FBQ0E7TUFDRixLQUFLLFFBQVE7UUFDWGpQLFFBQVEsR0FBR2lQLEdBQUc7UUFDZDtNQUNGO1FBQ0U7SUFDSjtFQUNGO0VBQ0EsSUFBSXFCLEtBQUssR0FBRztJQUNWbmIsSUFBSSxFQUFFQSxJQUFJLElBQUksUUFBUTtJQUN0QjZLLFFBQVEsRUFBRUEsUUFBUSxJQUFJLENBQUMsQ0FBQztJQUN4QlosS0FBSyxFQUFFQTtFQUNULENBQUM7RUFFRCxPQUFPa1IsS0FBSztBQUNkO0FBRUEsU0FBU0MsaUJBQWlCQSxDQUFDaEIsSUFBSSxFQUFFaFksVUFBVSxFQUFFO0VBQzNDZ1ksSUFBSSxDQUFDeFIsSUFBSSxDQUFDeEcsVUFBVSxHQUFHZ1ksSUFBSSxDQUFDeFIsSUFBSSxDQUFDeEcsVUFBVSxJQUFJLEVBQUU7RUFDakQsSUFBSUEsVUFBVSxFQUFFO0lBQUEsSUFBQWlaLHFCQUFBO0lBQ2QsQ0FBQUEscUJBQUEsR0FBQWpCLElBQUksQ0FBQ3hSLElBQUksQ0FBQ3hHLFVBQVUsRUFBQ0YsSUFBSSxDQUFBcUcsS0FBQSxDQUFBOFMscUJBQUEsRUFBQUMsa0JBQUEsQ0FBSWxaLFVBQVUsRUFBQztFQUMxQztBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTMkksR0FBR0EsQ0FBQ3FGLEdBQUcsRUFBRWpCLElBQUksRUFBRTtFQUN0QixJQUFJLENBQUNpQixHQUFHLEVBQUU7SUFDUixPQUFPeFAsU0FBUztFQUNsQjtFQUNBLElBQUl5UyxJQUFJLEdBQUdsRSxJQUFJLENBQUMxTSxLQUFLLENBQUMsR0FBRyxDQUFDO0VBQzFCLElBQUlvTyxNQUFNLEdBQUdULEdBQUc7RUFDaEIsSUFBSTtJQUNGLEtBQUssSUFBSWpRLENBQUMsR0FBRyxDQUFDLEVBQUV3QixHQUFHLEdBQUcwUixJQUFJLENBQUNqVCxNQUFNLEVBQUVELENBQUMsR0FBR3dCLEdBQUcsRUFBRSxFQUFFeEIsQ0FBQyxFQUFFO01BQy9DMFEsTUFBTSxHQUFHQSxNQUFNLENBQUN3QyxJQUFJLENBQUNsVCxDQUFDLENBQUMsQ0FBQztJQUMxQjtFQUNGLENBQUMsQ0FBQyxPQUFPUixDQUFDLEVBQUU7SUFDVmtSLE1BQU0sR0FBR2pRLFNBQVM7RUFDcEI7RUFDQSxPQUFPaVEsTUFBTTtBQUNmO0FBRUEsU0FBUzBLLEdBQUdBLENBQUNuTCxHQUFHLEVBQUVqQixJQUFJLEVBQUU3TSxLQUFLLEVBQUU7RUFDN0IsSUFBSSxDQUFDOE4sR0FBRyxFQUFFO0lBQ1I7RUFDRjtFQUNBLElBQUlpRCxJQUFJLEdBQUdsRSxJQUFJLENBQUMxTSxLQUFLLENBQUMsR0FBRyxDQUFDO0VBQzFCLElBQUlkLEdBQUcsR0FBRzBSLElBQUksQ0FBQ2pULE1BQU07RUFDckIsSUFBSXVCLEdBQUcsR0FBRyxDQUFDLEVBQUU7SUFDWDtFQUNGO0VBQ0EsSUFBSUEsR0FBRyxLQUFLLENBQUMsRUFBRTtJQUNieU8sR0FBRyxDQUFDaUQsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcvUSxLQUFLO0lBQ3BCO0VBQ0Y7RUFDQSxJQUFJO0lBQ0YsSUFBSWtaLElBQUksR0FBR3BMLEdBQUcsQ0FBQ2lELElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixJQUFJb0ksV0FBVyxHQUFHRCxJQUFJO0lBQ3RCLEtBQUssSUFBSXJiLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR3dCLEdBQUcsR0FBRyxDQUFDLEVBQUUsRUFBRXhCLENBQUMsRUFBRTtNQUNoQ3FiLElBQUksQ0FBQ25JLElBQUksQ0FBQ2xULENBQUMsQ0FBQyxDQUFDLEdBQUdxYixJQUFJLENBQUNuSSxJQUFJLENBQUNsVCxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUNuQ3FiLElBQUksR0FBR0EsSUFBSSxDQUFDbkksSUFBSSxDQUFDbFQsQ0FBQyxDQUFDLENBQUM7SUFDdEI7SUFDQXFiLElBQUksQ0FBQ25JLElBQUksQ0FBQzFSLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHVyxLQUFLO0lBQzNCOE4sR0FBRyxDQUFDaUQsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUdvSSxXQUFXO0VBQzVCLENBQUMsQ0FBQyxPQUFPOWIsQ0FBQyxFQUFFO0lBQ1Y7RUFDRjtBQUNGO0FBRUEsU0FBU2lOLGtCQUFrQkEsQ0FBQ2xDLElBQUksRUFBRTtFQUNoQyxJQUFJdkssQ0FBQyxFQUFFd0IsR0FBRyxFQUFFbVksR0FBRztFQUNmLElBQUlqSixNQUFNLEdBQUcsRUFBRTtFQUNmLEtBQUsxUSxDQUFDLEdBQUcsQ0FBQyxFQUFFd0IsR0FBRyxHQUFHK0ksSUFBSSxDQUFDdEssTUFBTSxFQUFFRCxDQUFDLEdBQUd3QixHQUFHLEVBQUUsRUFBRXhCLENBQUMsRUFBRTtJQUMzQzJaLEdBQUcsR0FBR3BQLElBQUksQ0FBQ3ZLLENBQUMsQ0FBQztJQUNiLFFBQVEyVCxRQUFRLENBQUNnRyxHQUFHLENBQUM7TUFDbkIsS0FBSyxRQUFRO1FBQ1hBLEdBQUcsR0FBR25PLFNBQVMsQ0FBQ21PLEdBQUcsQ0FBQztRQUNwQkEsR0FBRyxHQUFHQSxHQUFHLENBQUMzTixLQUFLLElBQUkyTixHQUFHLENBQUN4WCxLQUFLO1FBQzVCLElBQUl3WCxHQUFHLENBQUMxWixNQUFNLEdBQUcsR0FBRyxFQUFFO1VBQ3BCMFosR0FBRyxHQUFHQSxHQUFHLENBQUM0QixNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEtBQUs7UUFDbEM7UUFDQTtNQUNGLEtBQUssTUFBTTtRQUNUNUIsR0FBRyxHQUFHLE1BQU07UUFDWjtNQUNGLEtBQUssV0FBVztRQUNkQSxHQUFHLEdBQUcsV0FBVztRQUNqQjtNQUNGLEtBQUssUUFBUTtRQUNYQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQzdSLFFBQVEsQ0FBQyxDQUFDO1FBQ3BCO0lBQ0o7SUFDQTRJLE1BQU0sQ0FBQzNPLElBQUksQ0FBQzRYLEdBQUcsQ0FBQztFQUNsQjtFQUNBLE9BQU9qSixNQUFNLENBQUM5TyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ3pCO0FBRUEsU0FBU3NHLEdBQUdBLENBQUEsRUFBRztFQUNiLElBQUlzVCxJQUFJLENBQUN0VCxHQUFHLEVBQUU7SUFDWixPQUFPLENBQUNzVCxJQUFJLENBQUN0VCxHQUFHLENBQUMsQ0FBQztFQUNwQjtFQUNBLE9BQU8sQ0FBQyxJQUFJc1QsSUFBSSxDQUFDLENBQUM7QUFDcEI7QUFFQSxTQUFTQyxRQUFRQSxDQUFDQyxXQUFXLEVBQUVDLFNBQVMsRUFBRTtFQUN4QyxJQUFJLENBQUNELFdBQVcsSUFBSSxDQUFDQSxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUlDLFNBQVMsS0FBSyxJQUFJLEVBQUU7SUFDakU7RUFDRjtFQUNBLElBQUlDLEtBQUssR0FBR0YsV0FBVyxDQUFDLFNBQVMsQ0FBQztFQUNsQyxJQUFJLENBQUNDLFNBQVMsRUFBRTtJQUNkQyxLQUFLLEdBQUcsSUFBSTtFQUNkLENBQUMsTUFBTTtJQUNMLElBQUk7TUFDRixJQUFJdFMsS0FBSztNQUNULElBQUlzUyxLQUFLLENBQUMxSyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7UUFDN0I1SCxLQUFLLEdBQUdzUyxLQUFLLENBQUN0WixLQUFLLENBQUMsR0FBRyxDQUFDO1FBQ3hCZ0gsS0FBSyxDQUFDdVMsR0FBRyxDQUFDLENBQUM7UUFDWHZTLEtBQUssQ0FBQ3ZILElBQUksQ0FBQyxHQUFHLENBQUM7UUFDZjZaLEtBQUssR0FBR3RTLEtBQUssQ0FBQzFILElBQUksQ0FBQyxHQUFHLENBQUM7TUFDekIsQ0FBQyxNQUFNLElBQUlnYSxLQUFLLENBQUMxSyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7UUFDcEM1SCxLQUFLLEdBQUdzUyxLQUFLLENBQUN0WixLQUFLLENBQUMsR0FBRyxDQUFDO1FBQ3hCLElBQUlnSCxLQUFLLENBQUNySixNQUFNLEdBQUcsQ0FBQyxFQUFFO1VBQ3BCLElBQUk2YixTQUFTLEdBQUd4UyxLQUFLLENBQUNnRCxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztVQUNqQyxJQUFJeVAsUUFBUSxHQUFHRCxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM1SyxPQUFPLENBQUMsR0FBRyxDQUFDO1VBQ3hDLElBQUk2SyxRQUFRLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDbkJELFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBR0EsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDM0ssU0FBUyxDQUFDLENBQUMsRUFBRTRLLFFBQVEsQ0FBQztVQUNwRDtVQUNBLElBQUlDLFFBQVEsR0FBRywwQkFBMEI7VUFDekNKLEtBQUssR0FBR0UsU0FBUyxDQUFDRyxNQUFNLENBQUNELFFBQVEsQ0FBQyxDQUFDcGEsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUM5QztNQUNGLENBQUMsTUFBTTtRQUNMZ2EsS0FBSyxHQUFHLElBQUk7TUFDZDtJQUNGLENBQUMsQ0FBQyxPQUFPcGMsQ0FBQyxFQUFFO01BQ1ZvYyxLQUFLLEdBQUcsSUFBSTtJQUNkO0VBQ0Y7RUFDQUYsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHRSxLQUFLO0FBQ2hDO0FBRUEsU0FBU00sYUFBYUEsQ0FBQzNOLE9BQU8sRUFBRTlELEtBQUssRUFBRTBSLE9BQU8sRUFBRWpELE1BQU0sRUFBRTtFQUN0RCxJQUFJeEksTUFBTSxHQUFHckwsS0FBSyxDQUFDa0osT0FBTyxFQUFFOUQsS0FBSyxFQUFFMFIsT0FBTyxDQUFDO0VBQzNDekwsTUFBTSxHQUFHMEwsdUJBQXVCLENBQUMxTCxNQUFNLEVBQUV3SSxNQUFNLENBQUM7RUFDaEQsSUFBSSxDQUFDek8sS0FBSyxJQUFJQSxLQUFLLENBQUM0UixvQkFBb0IsRUFBRTtJQUN4QyxPQUFPM0wsTUFBTTtFQUNmO0VBQ0EsSUFBSWpHLEtBQUssQ0FBQ2xHLFdBQVcsRUFBRTtJQUNyQm1NLE1BQU0sQ0FBQ25NLFdBQVcsR0FBRyxDQUFDZ0ssT0FBTyxDQUFDaEssV0FBVyxJQUFJLEVBQUUsRUFBRTBYLE1BQU0sQ0FBQ3hSLEtBQUssQ0FBQ2xHLFdBQVcsQ0FBQztFQUM1RTtFQUNBLE9BQU9tTSxNQUFNO0FBQ2Y7QUFFQSxTQUFTMEwsdUJBQXVCQSxDQUFDdlgsT0FBTyxFQUFFcVUsTUFBTSxFQUFFO0VBQ2hELElBQUlyVSxPQUFPLENBQUN5WCxhQUFhLElBQUksQ0FBQ3pYLE9BQU8sQ0FBQzBYLFlBQVksRUFBRTtJQUNsRDFYLE9BQU8sQ0FBQzBYLFlBQVksR0FBRzFYLE9BQU8sQ0FBQ3lYLGFBQWE7SUFDNUN6WCxPQUFPLENBQUN5WCxhQUFhLEdBQUc3YixTQUFTO0lBQ2pDeVksTUFBTSxJQUFJQSxNQUFNLENBQUN6VixHQUFHLENBQUMsZ0RBQWdELENBQUM7RUFDeEU7RUFDQSxJQUFJb0IsT0FBTyxDQUFDMlgsYUFBYSxJQUFJLENBQUMzWCxPQUFPLENBQUM0WCxhQUFhLEVBQUU7SUFDbkQ1WCxPQUFPLENBQUM0WCxhQUFhLEdBQUc1WCxPQUFPLENBQUMyWCxhQUFhO0lBQzdDM1gsT0FBTyxDQUFDMlgsYUFBYSxHQUFHL2IsU0FBUztJQUNqQ3lZLE1BQU0sSUFBSUEsTUFBTSxDQUFDelYsR0FBRyxDQUFDLGlEQUFpRCxDQUFDO0VBQ3pFO0VBQ0EsT0FBT29CLE9BQU87QUFDaEI7QUFFQXRDLE1BQU0sQ0FBQ0MsT0FBTyxHQUFHO0VBQ2Z1VSw2QkFBNkIsRUFBRUEsNkJBQTZCO0VBQzVEdUMsVUFBVSxFQUFFQSxVQUFVO0VBQ3RCZ0IsZUFBZSxFQUFFQSxlQUFlO0VBQ2hDUyxvQkFBb0IsRUFBRUEsb0JBQW9CO0VBQzFDRSxpQkFBaUIsRUFBRUEsaUJBQWlCO0VBQ3BDUSxRQUFRLEVBQUVBLFFBQVE7RUFDbEJoUCxrQkFBa0IsRUFBRUEsa0JBQWtCO0VBQ3RDOEssU0FBUyxFQUFFQSxTQUFTO0VBQ3BCM00sR0FBRyxFQUFFQSxHQUFHO0VBQ1JzUixhQUFhLEVBQUVBLGFBQWE7RUFDNUJ2SCxPQUFPLEVBQUVBLE9BQU87RUFDaEJOLGNBQWMsRUFBRUEsY0FBYztFQUM5QmhOLFVBQVUsRUFBRUEsVUFBVTtFQUN0QnFOLFVBQVUsRUFBRUEsVUFBVTtFQUN0QmpCLGdCQUFnQixFQUFFQSxnQkFBZ0I7RUFDbENTLFFBQVEsRUFBRUEsUUFBUTtFQUNsQkMsUUFBUSxFQUFFQSxRQUFRO0VBQ2xCL08sTUFBTSxFQUFFQSxNQUFNO0VBQ2R3UCxTQUFTLEVBQUVBLFNBQVM7RUFDcEJFLFNBQVMsRUFBRUEsU0FBUztFQUNwQmlELFNBQVMsRUFBRUEsU0FBUztFQUNwQnpDLE1BQU0sRUFBRUEsTUFBTTtFQUNkMkMsc0JBQXNCLEVBQUVBLHNCQUFzQjtFQUM5QzVTLEtBQUssRUFBRUEsS0FBSztFQUNaNkMsR0FBRyxFQUFFQSxHQUFHO0VBQ1J3SyxNQUFNLEVBQUVBLE1BQU07RUFDZFcsV0FBVyxFQUFFQSxXQUFXO0VBQ3hCc0MsV0FBVyxFQUFFQSxXQUFXO0VBQ3hCeUYsR0FBRyxFQUFFQSxHQUFHO0VBQ1I5SCxTQUFTLEVBQUVBLFNBQVM7RUFDcEI5SCxTQUFTLEVBQUVBLFNBQVM7RUFDcEJtTSxXQUFXLEVBQUVBLFdBQVc7RUFDeEJoRSxRQUFRLEVBQUVBLFFBQVE7RUFDbEJxQixLQUFLLEVBQUVBO0FBQ1QsQ0FBQzs7Ozs7Ozs7OztBQ24wQkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTclMsT0FBT0EsQ0FBQ0EsT0FBTyxFQUFFO0VBQ3hCLElBQUksT0FBTytaLE9BQU8sS0FBSyxXQUFXLEVBQUU7SUFDbEMsT0FBTyxJQUFJQyxZQUFZLENBQUNoYSxPQUFPLENBQUM7RUFDbEM7RUFFQSxPQUFPLElBQUkrWixPQUFPLENBQUMvWixPQUFPLENBQUM7QUFDN0I7QUFFQSxTQUFTaWEsYUFBYUEsQ0FBQ2xZLElBQUksRUFBRTtFQUMzQixJQUFJLE9BQU9BLElBQUksS0FBSyxRQUFRLEVBQUU7SUFDNUJBLElBQUksR0FBRzBQLE1BQU0sQ0FBQzFQLElBQUksQ0FBQztFQUNyQjtFQUNBLE9BQU9BLElBQUksQ0FBQ2hGLFdBQVcsQ0FBQyxDQUFDO0FBQzNCO0FBRUEsU0FBU21kLGNBQWNBLENBQUMxYSxLQUFLLEVBQUU7RUFDN0IsSUFBSSxPQUFPQSxLQUFLLEtBQUssUUFBUSxFQUFFO0lBQzdCQSxLQUFLLEdBQUdpUyxNQUFNLENBQUNqUyxLQUFLLENBQUM7RUFDdkI7RUFDQSxPQUFPQSxLQUFLO0FBQ2Q7QUFFQSxTQUFTMmEsV0FBV0EsQ0FBQ0MsS0FBSyxFQUFFO0VBQzFCLElBQUlDLFFBQVEsR0FBRztJQUNibFIsSUFBSSxFQUFFLFNBQU5BLElBQUlBLENBQUEsRUFBYztNQUNoQixJQUFJM0osS0FBSyxHQUFHNGEsS0FBSyxDQUFDN1ksS0FBSyxDQUFDLENBQUM7TUFDekIsT0FBTztRQUFFNkgsSUFBSSxFQUFFNUosS0FBSyxLQUFLMUIsU0FBUztRQUFFMEIsS0FBSyxFQUFFQTtNQUFNLENBQUM7SUFDcEQ7RUFDRixDQUFDO0VBRUQsT0FBTzZhLFFBQVE7QUFDakI7QUFFQSxTQUFTTCxZQUFZQSxDQUFDaGEsT0FBTyxFQUFFO0VBQzdCLElBQUksQ0FBQ3NhLEdBQUcsR0FBRyxDQUFDLENBQUM7RUFFYixJQUFJdGEsT0FBTyxZQUFZZ2EsWUFBWSxFQUFFO0lBQ25DaGEsT0FBTyxDQUFDdWEsT0FBTyxDQUFDLFVBQVUvYSxLQUFLLEVBQUV1QyxJQUFJLEVBQUU7TUFDckMsSUFBSSxDQUFDeVksTUFBTSxDQUFDelksSUFBSSxFQUFFdkMsS0FBSyxDQUFDO0lBQzFCLENBQUMsRUFBRSxJQUFJLENBQUM7RUFDVixDQUFDLE1BQU0sSUFBSXFJLEtBQUssQ0FBQzRTLE9BQU8sQ0FBQ3phLE9BQU8sQ0FBQyxFQUFFO0lBQ2pDQSxPQUFPLENBQUN1YSxPQUFPLENBQUMsVUFBVTVVLE1BQU0sRUFBRTtNQUNoQyxJQUFJLENBQUM2VSxNQUFNLENBQUM3VSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUVBLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQyxDQUFDLEVBQUUsSUFBSSxDQUFDO0VBQ1YsQ0FBQyxNQUFNLElBQUkzRixPQUFPLEVBQUU7SUFDbEI0TyxNQUFNLENBQUM4TCxtQkFBbUIsQ0FBQzFhLE9BQU8sQ0FBQyxDQUFDdWEsT0FBTyxDQUFDLFVBQVV4WSxJQUFJLEVBQUU7TUFDMUQsSUFBSSxDQUFDeVksTUFBTSxDQUFDelksSUFBSSxFQUFFL0IsT0FBTyxDQUFDK0IsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FBQyxFQUFFLElBQUksQ0FBQztFQUNWO0FBQ0Y7QUFFQWlZLFlBQVksQ0FBQzFXLFNBQVMsQ0FBQ2tYLE1BQU0sR0FBRyxVQUFVelksSUFBSSxFQUFFdkMsS0FBSyxFQUFFO0VBQ3JEdUMsSUFBSSxHQUFHa1ksYUFBYSxDQUFDbFksSUFBSSxDQUFDO0VBQzFCdkMsS0FBSyxHQUFHMGEsY0FBYyxDQUFDMWEsS0FBSyxDQUFDO0VBQzdCLElBQUltYixRQUFRLEdBQUcsSUFBSSxDQUFDTCxHQUFHLENBQUN2WSxJQUFJLENBQUM7RUFDN0IsSUFBSSxDQUFDdVksR0FBRyxDQUFDdlksSUFBSSxDQUFDLEdBQUc0WSxRQUFRLEdBQUdBLFFBQVEsR0FBRyxJQUFJLEdBQUduYixLQUFLLEdBQUdBLEtBQUs7QUFDN0QsQ0FBQztBQUVEd2EsWUFBWSxDQUFDMVcsU0FBUyxDQUFDMkUsR0FBRyxHQUFHLFVBQVVsRyxJQUFJLEVBQUU7RUFDM0NBLElBQUksR0FBR2tZLGFBQWEsQ0FBQ2xZLElBQUksQ0FBQztFQUMxQixPQUFPLElBQUksQ0FBQzZZLEdBQUcsQ0FBQzdZLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQ3VZLEdBQUcsQ0FBQ3ZZLElBQUksQ0FBQyxHQUFHLElBQUk7QUFDL0MsQ0FBQztBQUVEaVksWUFBWSxDQUFDMVcsU0FBUyxDQUFDc1gsR0FBRyxHQUFHLFVBQVU3WSxJQUFJLEVBQUU7RUFDM0MsT0FBTyxJQUFJLENBQUN1WSxHQUFHLENBQUN6TCxjQUFjLENBQUNvTCxhQUFhLENBQUNsWSxJQUFJLENBQUMsQ0FBQztBQUNyRCxDQUFDO0FBRURpWSxZQUFZLENBQUMxVyxTQUFTLENBQUNpWCxPQUFPLEdBQUcsVUFBVXhELFFBQVEsRUFBRThELE9BQU8sRUFBRTtFQUM1RCxLQUFLLElBQUk5WSxJQUFJLElBQUksSUFBSSxDQUFDdVksR0FBRyxFQUFFO0lBQ3pCLElBQUksSUFBSSxDQUFDQSxHQUFHLENBQUN6TCxjQUFjLENBQUM5TSxJQUFJLENBQUMsRUFBRTtNQUNqQ2dWLFFBQVEsQ0FBQ25OLElBQUksQ0FBQ2lSLE9BQU8sRUFBRSxJQUFJLENBQUNQLEdBQUcsQ0FBQ3ZZLElBQUksQ0FBQyxFQUFFQSxJQUFJLEVBQUUsSUFBSSxDQUFDO0lBQ3BEO0VBQ0Y7QUFDRixDQUFDO0FBRURpWSxZQUFZLENBQUMxVyxTQUFTLENBQUMyRixPQUFPLEdBQUcsWUFBWTtFQUMzQyxJQUFJbVIsS0FBSyxHQUFHLEVBQUU7RUFDZCxJQUFJLENBQUNHLE9BQU8sQ0FBQyxVQUFVL2EsS0FBSyxFQUFFdUMsSUFBSSxFQUFFO0lBQ2xDcVksS0FBSyxDQUFDaGIsSUFBSSxDQUFDLENBQUMyQyxJQUFJLEVBQUV2QyxLQUFLLENBQUMsQ0FBQztFQUMzQixDQUFDLENBQUM7RUFDRixPQUFPMmEsV0FBVyxDQUFDQyxLQUFLLENBQUM7QUFDM0IsQ0FBQztBQUVEeGEsTUFBTSxDQUFDQyxPQUFPLEdBQUdHLE9BQU87Ozs7Ozs7Ozs7QUM3RnhCLFNBQVNDLE9BQU9BLENBQUNxTixHQUFHLEVBQUV2TCxJQUFJLEVBQUU0VyxXQUFXLEVBQUV0WCxZQUFZLEVBQUVuRSxJQUFJLEVBQUU7RUFDM0QsSUFBSXlILElBQUksR0FBRzJJLEdBQUcsQ0FBQ3ZMLElBQUksQ0FBQztFQUNwQnVMLEdBQUcsQ0FBQ3ZMLElBQUksQ0FBQyxHQUFHNFcsV0FBVyxDQUFDaFUsSUFBSSxDQUFDO0VBQzdCLElBQUl0RCxZQUFZLEVBQUU7SUFDaEJBLFlBQVksQ0FBQ25FLElBQUksQ0FBQyxDQUFDa0MsSUFBSSxDQUFDLENBQUNrTyxHQUFHLEVBQUV2TCxJQUFJLEVBQUU0QyxJQUFJLENBQUMsQ0FBQztFQUM1QztBQUNGO0FBRUEvRSxNQUFNLENBQUNDLE9BQU8sR0FBR0ksT0FBTzs7Ozs7Ozs7OztBQ1J4QixJQUFJSCxDQUFDLEdBQUdDLG1CQUFPLENBQUMsb0NBQVksQ0FBQztBQUU3QixTQUFTc1AsUUFBUUEsQ0FBQy9CLEdBQUcsRUFBRXdJLElBQUksRUFBRXpGLElBQUksRUFBRTtFQUNqQyxJQUFJRixDQUFDLEVBQUVGLENBQUMsRUFBRTVTLENBQUM7RUFDWCxJQUFJeWQsS0FBSyxHQUFHaGIsQ0FBQyxDQUFDMkMsTUFBTSxDQUFDNkssR0FBRyxFQUFFLFFBQVEsQ0FBQztFQUNuQyxJQUFJbU4sT0FBTyxHQUFHM2EsQ0FBQyxDQUFDMkMsTUFBTSxDQUFDNkssR0FBRyxFQUFFLE9BQU8sQ0FBQztFQUNwQyxJQUFJaUQsSUFBSSxHQUFHLEVBQUU7RUFDYixJQUFJd0ssU0FBUzs7RUFFYjtFQUNBMUssSUFBSSxHQUFHQSxJQUFJLElBQUk7SUFBRS9DLEdBQUcsRUFBRSxFQUFFO0lBQUUwTixNQUFNLEVBQUU7RUFBRyxDQUFDO0VBRXRDLElBQUlGLEtBQUssRUFBRTtJQUNUQyxTQUFTLEdBQUcxSyxJQUFJLENBQUMvQyxHQUFHLENBQUNpQixPQUFPLENBQUNqQixHQUFHLENBQUM7SUFFakMsSUFBSXdOLEtBQUssSUFBSUMsU0FBUyxLQUFLLENBQUMsQ0FBQyxFQUFFO01BQzdCO01BQ0EsT0FBTzFLLElBQUksQ0FBQzJLLE1BQU0sQ0FBQ0QsU0FBUyxDQUFDLElBQUkxSyxJQUFJLENBQUMvQyxHQUFHLENBQUN5TixTQUFTLENBQUM7SUFDdEQ7SUFFQTFLLElBQUksQ0FBQy9DLEdBQUcsQ0FBQ2xPLElBQUksQ0FBQ2tPLEdBQUcsQ0FBQztJQUNsQnlOLFNBQVMsR0FBRzFLLElBQUksQ0FBQy9DLEdBQUcsQ0FBQ2hRLE1BQU0sR0FBRyxDQUFDO0VBQ2pDO0VBRUEsSUFBSXdkLEtBQUssRUFBRTtJQUNULEtBQUszSyxDQUFDLElBQUk3QyxHQUFHLEVBQUU7TUFDYixJQUFJc0IsTUFBTSxDQUFDdEwsU0FBUyxDQUFDdUwsY0FBYyxDQUFDakYsSUFBSSxDQUFDMEQsR0FBRyxFQUFFNkMsQ0FBQyxDQUFDLEVBQUU7UUFDaERJLElBQUksQ0FBQ25SLElBQUksQ0FBQytRLENBQUMsQ0FBQztNQUNkO0lBQ0Y7RUFDRixDQUFDLE1BQU0sSUFBSXNLLE9BQU8sRUFBRTtJQUNsQixLQUFLcGQsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHaVEsR0FBRyxDQUFDaFEsTUFBTSxFQUFFLEVBQUVELENBQUMsRUFBRTtNQUMvQmtULElBQUksQ0FBQ25SLElBQUksQ0FBQy9CLENBQUMsQ0FBQztJQUNkO0VBQ0Y7RUFFQSxJQUFJMFEsTUFBTSxHQUFHK00sS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUU7RUFDNUIsSUFBSUcsSUFBSSxHQUFHLElBQUk7RUFDZixLQUFLNWQsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHa1QsSUFBSSxDQUFDalQsTUFBTSxFQUFFLEVBQUVELENBQUMsRUFBRTtJQUNoQzhTLENBQUMsR0FBR0ksSUFBSSxDQUFDbFQsQ0FBQyxDQUFDO0lBQ1g0UyxDQUFDLEdBQUczQyxHQUFHLENBQUM2QyxDQUFDLENBQUM7SUFDVnBDLE1BQU0sQ0FBQ29DLENBQUMsQ0FBQyxHQUFHMkYsSUFBSSxDQUFDM0YsQ0FBQyxFQUFFRixDQUFDLEVBQUVJLElBQUksQ0FBQztJQUM1QjRLLElBQUksR0FBR0EsSUFBSSxJQUFJbE4sTUFBTSxDQUFDb0MsQ0FBQyxDQUFDLEtBQUs3QyxHQUFHLENBQUM2QyxDQUFDLENBQUM7RUFDckM7RUFFQSxJQUFJMkssS0FBSyxJQUFJLENBQUNHLElBQUksRUFBRTtJQUNsQjVLLElBQUksQ0FBQzJLLE1BQU0sQ0FBQ0QsU0FBUyxDQUFDLEdBQUdoTixNQUFNO0VBQ2pDO0VBRUEsT0FBTyxDQUFDa04sSUFBSSxHQUFHbE4sTUFBTSxHQUFHVCxHQUFHO0FBQzdCO0FBRUExTixNQUFNLENBQUNDLE9BQU8sR0FBR3dQLFFBQVE7Ozs7OztVQ3BEekI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQixtQkFBTyxDQUFDLDREQUEwQjs7QUFFckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsTUFBTSxpQkFBaUI7QUFDdkIsTUFBTSwwQkFBMEI7QUFDaEMsTUFBTSxvQkFBb0IsWUFBWSxZQUFZLG9CQUFvQjtBQUN0RTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL2Jyb3dzZXIvZG9tVXRpbGl0eS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL2Jyb3dzZXIvdGVsZW1ldHJ5LmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvYnJvd3Nlci91cmwuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9tZXJnZS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3NjcnViLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvdXRpbGl0eS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3V0aWxpdHkvaGVhZGVycy5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3V0aWxpdHkvcmVwbGFjZS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3V0aWxpdHkvdHJhdmVyc2UuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vdGVzdC9icm93c2VyLnRlbGVtZXRyeS50ZXN0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwiZnVuY3Rpb24gZ2V0RWxlbWVudFR5cGUoZSkge1xuICByZXR1cm4gKGUuZ2V0QXR0cmlidXRlKCd0eXBlJykgfHwgJycpLnRvTG93ZXJDYXNlKCk7XG59XG5cbmZ1bmN0aW9uIGlzRGVzY3JpYmVkRWxlbWVudChlbGVtZW50LCB0eXBlLCBzdWJ0eXBlcykge1xuICBpZiAoZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09IHR5cGUudG9Mb3dlckNhc2UoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoIXN1YnR5cGVzKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgZWxlbWVudCA9IGdldEVsZW1lbnRUeXBlKGVsZW1lbnQpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN1YnR5cGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN1YnR5cGVzW2ldID09PSBlbGVtZW50KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBnZXRFbGVtZW50RnJvbUV2ZW50KGV2dCwgZG9jKSB7XG4gIGlmIChldnQudGFyZ2V0KSB7XG4gICAgcmV0dXJuIGV2dC50YXJnZXQ7XG4gIH1cbiAgaWYgKGRvYyAmJiBkb2MuZWxlbWVudEZyb21Qb2ludCkge1xuICAgIHJldHVybiBkb2MuZWxlbWVudEZyb21Qb2ludChldnQuY2xpZW50WCwgZXZ0LmNsaWVudFkpO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIHRyZWVUb0FycmF5KGVsZW0pIHtcbiAgdmFyIE1BWF9IRUlHSFQgPSA1O1xuICB2YXIgb3V0ID0gW107XG4gIHZhciBuZXh0RGVzY3JpcHRpb247XG4gIGZvciAodmFyIGhlaWdodCA9IDA7IGVsZW0gJiYgaGVpZ2h0IDwgTUFYX0hFSUdIVDsgaGVpZ2h0KyspIHtcbiAgICBuZXh0RGVzY3JpcHRpb24gPSBkZXNjcmliZUVsZW1lbnQoZWxlbSk7XG4gICAgaWYgKG5leHREZXNjcmlwdGlvbi50YWdOYW1lID09PSAnaHRtbCcpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBvdXQudW5zaGlmdChuZXh0RGVzY3JpcHRpb24pO1xuICAgIGVsZW0gPSBlbGVtLnBhcmVudE5vZGU7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZWxlbWVudEFycmF5VG9TdHJpbmcoYSkge1xuICB2YXIgTUFYX0xFTkdUSCA9IDgwO1xuICB2YXIgc2VwYXJhdG9yID0gJyA+ICcsXG4gICAgc2VwYXJhdG9yTGVuZ3RoID0gc2VwYXJhdG9yLmxlbmd0aDtcbiAgdmFyIG91dCA9IFtdLFxuICAgIGxlbiA9IDAsXG4gICAgbmV4dFN0cixcbiAgICB0b3RhbExlbmd0aDtcblxuICBmb3IgKHZhciBpID0gYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIG5leHRTdHIgPSBkZXNjcmlwdGlvblRvU3RyaW5nKGFbaV0pO1xuICAgIHRvdGFsTGVuZ3RoID0gbGVuICsgb3V0Lmxlbmd0aCAqIHNlcGFyYXRvckxlbmd0aCArIG5leHRTdHIubGVuZ3RoO1xuICAgIGlmIChpIDwgYS5sZW5ndGggLSAxICYmIHRvdGFsTGVuZ3RoID49IE1BWF9MRU5HVEggKyAzKSB7XG4gICAgICBvdXQudW5zaGlmdCgnLi4uJyk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgb3V0LnVuc2hpZnQobmV4dFN0cik7XG4gICAgbGVuICs9IG5leHRTdHIubGVuZ3RoO1xuICB9XG4gIHJldHVybiBvdXQuam9pbihzZXBhcmF0b3IpO1xufVxuXG5mdW5jdGlvbiBkZXNjcmlwdGlvblRvU3RyaW5nKGRlc2MpIHtcbiAgaWYgKCFkZXNjIHx8ICFkZXNjLnRhZ05hbWUpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgdmFyIG91dCA9IFtkZXNjLnRhZ05hbWVdO1xuICBpZiAoZGVzYy5pZCkge1xuICAgIG91dC5wdXNoKCcjJyArIGRlc2MuaWQpO1xuICB9XG4gIGlmIChkZXNjLmNsYXNzZXMpIHtcbiAgICBvdXQucHVzaCgnLicgKyBkZXNjLmNsYXNzZXMuam9pbignLicpKTtcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGRlc2MuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgIG91dC5wdXNoKFxuICAgICAgJ1snICsgZGVzYy5hdHRyaWJ1dGVzW2ldLmtleSArICc9XCInICsgZGVzYy5hdHRyaWJ1dGVzW2ldLnZhbHVlICsgJ1wiXScsXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBvdXQuam9pbignJyk7XG59XG5cbi8qKlxuICogSW5wdXQ6IGEgZG9tIGVsZW1lbnRcbiAqIE91dHB1dDogbnVsbCBpZiB0YWdOYW1lIGlzIGZhbHNleSBvciBpbnB1dCBpcyBmYWxzZXksIGVsc2VcbiAqICB7XG4gKiAgICB0YWdOYW1lOiBTdHJpbmcsXG4gKiAgICBpZDogU3RyaW5nIHwgdW5kZWZpbmVkLFxuICogICAgY2xhc3NlczogW1N0cmluZ10gfCB1bmRlZmluZWQsXG4gKiAgICBhdHRyaWJ1dGVzOiBbXG4gKiAgICAgIHtcbiAqICAgICAgICBrZXk6IE9uZU9mKHR5cGUsIG5hbWUsIHRpdGxlLCBhbHQpLFxuICogICAgICAgIHZhbHVlOiBTdHJpbmdcbiAqICAgICAgfVxuICogICAgXVxuICogIH1cbiAqL1xuZnVuY3Rpb24gZGVzY3JpYmVFbGVtZW50KGVsZW0pIHtcbiAgaWYgKCFlbGVtIHx8ICFlbGVtLnRhZ05hbWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2YXIgb3V0ID0ge30sXG4gICAgY2xhc3NOYW1lLFxuICAgIGtleSxcbiAgICBhdHRyLFxuICAgIGk7XG4gIG91dC50YWdOYW1lID0gZWxlbS50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChlbGVtLmlkKSB7XG4gICAgb3V0LmlkID0gZWxlbS5pZDtcbiAgfVxuICBjbGFzc05hbWUgPSBlbGVtLmNsYXNzTmFtZTtcbiAgaWYgKGNsYXNzTmFtZSAmJiB0eXBlb2YgY2xhc3NOYW1lID09PSAnc3RyaW5nJykge1xuICAgIG91dC5jbGFzc2VzID0gY2xhc3NOYW1lLnNwbGl0KC9cXHMrLyk7XG4gIH1cbiAgdmFyIGF0dHJpYnV0ZXMgPSBbJ3R5cGUnLCAnbmFtZScsICd0aXRsZScsICdhbHQnXTtcbiAgb3V0LmF0dHJpYnV0ZXMgPSBbXTtcbiAgZm9yIChpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBrZXkgPSBhdHRyaWJ1dGVzW2ldO1xuICAgIGF0dHIgPSBlbGVtLmdldEF0dHJpYnV0ZShrZXkpO1xuICAgIGlmIChhdHRyKSB7XG4gICAgICBvdXQuYXR0cmlidXRlcy5wdXNoKHsga2V5OiBrZXksIHZhbHVlOiBhdHRyIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZGVzY3JpYmVFbGVtZW50OiBkZXNjcmliZUVsZW1lbnQsXG4gIGRlc2NyaXB0aW9uVG9TdHJpbmc6IGRlc2NyaXB0aW9uVG9TdHJpbmcsXG4gIGVsZW1lbnRBcnJheVRvU3RyaW5nOiBlbGVtZW50QXJyYXlUb1N0cmluZyxcbiAgdHJlZVRvQXJyYXk6IHRyZWVUb0FycmF5LFxuICBnZXRFbGVtZW50RnJvbUV2ZW50OiBnZXRFbGVtZW50RnJvbUV2ZW50LFxuICBpc0Rlc2NyaWJlZEVsZW1lbnQ6IGlzRGVzY3JpYmVkRWxlbWVudCxcbiAgZ2V0RWxlbWVudFR5cGU6IGdldEVsZW1lbnRUeXBlLFxufTtcbiIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbGl0eScpO1xudmFyIGhlYWRlcnMgPSByZXF1aXJlKCcuLi91dGlsaXR5L2hlYWRlcnMnKTtcbnZhciByZXBsYWNlID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9yZXBsYWNlJyk7XG52YXIgc2NydWIgPSByZXF1aXJlKCcuLi9zY3J1YicpO1xudmFyIHVybHBhcnNlciA9IHJlcXVpcmUoJy4vdXJsJyk7XG52YXIgZG9tVXRpbCA9IHJlcXVpcmUoJy4vZG9tVXRpbGl0eScpO1xuXG52YXIgZGVmYXVsdHMgPSB7XG4gIG5ldHdvcms6IHRydWUsXG4gIG5ldHdvcmtSZXNwb25zZUhlYWRlcnM6IGZhbHNlLFxuICBuZXR3b3JrUmVzcG9uc2VCb2R5OiBmYWxzZSxcbiAgbmV0d29ya1JlcXVlc3RIZWFkZXJzOiBmYWxzZSxcbiAgbmV0d29ya1JlcXVlc3RCb2R5OiBmYWxzZSxcbiAgbmV0d29ya0Vycm9yT25IdHRwNXh4OiBmYWxzZSxcbiAgbmV0d29ya0Vycm9yT25IdHRwNHh4OiBmYWxzZSxcbiAgbmV0d29ya0Vycm9yT25IdHRwMDogZmFsc2UsXG4gIGxvZzogdHJ1ZSxcbiAgZG9tOiB0cnVlLFxuICBuYXZpZ2F0aW9uOiB0cnVlLFxuICBjb25uZWN0aXZpdHk6IHRydWUsXG4gIGNvbnRlbnRTZWN1cml0eVBvbGljeTogdHJ1ZSxcbiAgZXJyb3JPbkNvbnRlbnRTZWN1cml0eVBvbGljeTogZmFsc2UsXG59O1xuXG5mdW5jdGlvbiByZXN0b3JlKHJlcGxhY2VtZW50cywgdHlwZSkge1xuICB2YXIgYjtcbiAgd2hpbGUgKHJlcGxhY2VtZW50c1t0eXBlXS5sZW5ndGgpIHtcbiAgICBiID0gcmVwbGFjZW1lbnRzW3R5cGVdLnNoaWZ0KCk7XG4gICAgYlswXVtiWzFdXSA9IGJbMl07XG4gIH1cbn1cblxuZnVuY3Rpb24gbmFtZUZyb21EZXNjcmlwdGlvbihkZXNjcmlwdGlvbikge1xuICBpZiAoIWRlc2NyaXB0aW9uIHx8ICFkZXNjcmlwdGlvbi5hdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmFyIGF0dHJzID0gZGVzY3JpcHRpb24uYXR0cmlidXRlcztcbiAgZm9yICh2YXIgYSA9IDA7IGEgPCBhdHRycy5sZW5ndGg7ICsrYSkge1xuICAgIGlmIChhdHRyc1thXS5rZXkgPT09ICduYW1lJykge1xuICAgICAgcmV0dXJuIGF0dHJzW2FdLnZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFZhbHVlU2NydWJiZXIoc2NydWJGaWVsZHMpIHtcbiAgdmFyIHBhdHRlcm5zID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2NydWJGaWVsZHMubGVuZ3RoOyArK2kpIHtcbiAgICBwYXR0ZXJucy5wdXNoKG5ldyBSZWdFeHAoc2NydWJGaWVsZHNbaV0sICdpJykpO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiAoZGVzY3JpcHRpb24pIHtcbiAgICB2YXIgbmFtZSA9IG5hbWVGcm9tRGVzY3JpcHRpb24oZGVzY3JpcHRpb24pO1xuICAgIGlmICghbmFtZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdHRlcm5zLmxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAocGF0dGVybnNbaV0udGVzdChuYW1lKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufVxuXG5mdW5jdGlvbiBJbnN0cnVtZW50ZXIob3B0aW9ucywgdGVsZW1ldGVyLCByb2xsYmFyLCBfd2luZG93LCBfZG9jdW1lbnQpIHtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgdmFyIGF1dG9JbnN0cnVtZW50ID0gb3B0aW9ucy5hdXRvSW5zdHJ1bWVudDtcbiAgaWYgKG9wdGlvbnMuZW5hYmxlZCA9PT0gZmFsc2UgfHwgYXV0b0luc3RydW1lbnQgPT09IGZhbHNlKSB7XG4gICAgdGhpcy5hdXRvSW5zdHJ1bWVudCA9IHt9O1xuICB9IGVsc2Uge1xuICAgIGlmICghXy5pc1R5cGUoYXV0b0luc3RydW1lbnQsICdvYmplY3QnKSkge1xuICAgICAgYXV0b0luc3RydW1lbnQgPSBkZWZhdWx0cztcbiAgICB9XG4gICAgdGhpcy5hdXRvSW5zdHJ1bWVudCA9IF8ubWVyZ2UoZGVmYXVsdHMsIGF1dG9JbnN0cnVtZW50KTtcbiAgfVxuICB0aGlzLnNjcnViVGVsZW1ldHJ5SW5wdXRzID0gISFvcHRpb25zLnNjcnViVGVsZW1ldHJ5SW5wdXRzO1xuICB0aGlzLnRlbGVtZXRyeVNjcnViYmVyID0gb3B0aW9ucy50ZWxlbWV0cnlTY3J1YmJlcjtcbiAgdGhpcy5kZWZhdWx0VmFsdWVTY3J1YmJlciA9IGRlZmF1bHRWYWx1ZVNjcnViYmVyKG9wdGlvbnMuc2NydWJGaWVsZHMpO1xuICB0aGlzLnRlbGVtZXRlciA9IHRlbGVtZXRlcjtcbiAgdGhpcy5yb2xsYmFyID0gcm9sbGJhcjtcbiAgdGhpcy5kaWFnbm9zdGljID0gcm9sbGJhci5jbGllbnQubm90aWZpZXIuZGlhZ25vc3RpYztcbiAgdGhpcy5fd2luZG93ID0gX3dpbmRvdyB8fCB7fTtcbiAgdGhpcy5fZG9jdW1lbnQgPSBfZG9jdW1lbnQgfHwge307XG4gIHRoaXMucmVwbGFjZW1lbnRzID0ge1xuICAgIG5ldHdvcms6IFtdLFxuICAgIGxvZzogW10sXG4gICAgbmF2aWdhdGlvbjogW10sXG4gICAgY29ubmVjdGl2aXR5OiBbXSxcbiAgfTtcbiAgdGhpcy5ldmVudFJlbW92ZXJzID0ge1xuICAgIGRvbTogW10sXG4gICAgY29ubmVjdGl2aXR5OiBbXSxcbiAgICBjb250ZW50c2VjdXJpdHlwb2xpY3k6IFtdLFxuICB9O1xuXG4gIHRoaXMuX2xvY2F0aW9uID0gdGhpcy5fd2luZG93LmxvY2F0aW9uO1xuICB0aGlzLl9sYXN0SHJlZiA9IHRoaXMuX2xvY2F0aW9uICYmIHRoaXMuX2xvY2F0aW9uLmhyZWY7XG59XG5cbkluc3RydW1lbnRlci5wcm90b3R5cGUuY29uZmlndXJlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdGhpcy5vcHRpb25zID0gXy5tZXJnZSh0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICB2YXIgYXV0b0luc3RydW1lbnQgPSBvcHRpb25zLmF1dG9JbnN0cnVtZW50O1xuICB2YXIgb2xkU2V0dGluZ3MgPSBfLm1lcmdlKHRoaXMuYXV0b0luc3RydW1lbnQpO1xuICBpZiAob3B0aW9ucy5lbmFibGVkID09PSBmYWxzZSB8fCBhdXRvSW5zdHJ1bWVudCA9PT0gZmFsc2UpIHtcbiAgICB0aGlzLmF1dG9JbnN0cnVtZW50ID0ge307XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFfLmlzVHlwZShhdXRvSW5zdHJ1bWVudCwgJ29iamVjdCcpKSB7XG4gICAgICBhdXRvSW5zdHJ1bWVudCA9IGRlZmF1bHRzO1xuICAgIH1cbiAgICB0aGlzLmF1dG9JbnN0cnVtZW50ID0gXy5tZXJnZShkZWZhdWx0cywgYXV0b0luc3RydW1lbnQpO1xuICB9XG4gIHRoaXMuaW5zdHJ1bWVudChvbGRTZXR0aW5ncyk7XG4gIGlmIChvcHRpb25zLnNjcnViVGVsZW1ldHJ5SW5wdXRzICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLnNjcnViVGVsZW1ldHJ5SW5wdXRzID0gISFvcHRpb25zLnNjcnViVGVsZW1ldHJ5SW5wdXRzO1xuICB9XG4gIGlmIChvcHRpb25zLnRlbGVtZXRyeVNjcnViYmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLnRlbGVtZXRyeVNjcnViYmVyID0gb3B0aW9ucy50ZWxlbWV0cnlTY3J1YmJlcjtcbiAgfVxufTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbXBsZXhpdHlcbkluc3RydW1lbnRlci5wcm90b3R5cGUuaW5zdHJ1bWVudCA9IGZ1bmN0aW9uIChvbGRTZXR0aW5ncykge1xuICBpZiAodGhpcy5hdXRvSW5zdHJ1bWVudC5uZXR3b3JrICYmICEob2xkU2V0dGluZ3MgJiYgb2xkU2V0dGluZ3MubmV0d29yaykpIHtcbiAgICB0aGlzLmluc3RydW1lbnROZXR3b3JrKCk7XG4gIH0gZWxzZSBpZiAoXG4gICAgIXRoaXMuYXV0b0luc3RydW1lbnQubmV0d29yayAmJlxuICAgIG9sZFNldHRpbmdzICYmXG4gICAgb2xkU2V0dGluZ3MubmV0d29ya1xuICApIHtcbiAgICB0aGlzLmRlaW5zdHJ1bWVudE5ldHdvcmsoKTtcbiAgfVxuXG4gIGlmICh0aGlzLmF1dG9JbnN0cnVtZW50LmxvZyAmJiAhKG9sZFNldHRpbmdzICYmIG9sZFNldHRpbmdzLmxvZykpIHtcbiAgICB0aGlzLmluc3RydW1lbnRDb25zb2xlKCk7XG4gIH0gZWxzZSBpZiAoIXRoaXMuYXV0b0luc3RydW1lbnQubG9nICYmIG9sZFNldHRpbmdzICYmIG9sZFNldHRpbmdzLmxvZykge1xuICAgIHRoaXMuZGVpbnN0cnVtZW50Q29uc29sZSgpO1xuICB9XG5cbiAgaWYgKHRoaXMuYXV0b0luc3RydW1lbnQuZG9tICYmICEob2xkU2V0dGluZ3MgJiYgb2xkU2V0dGluZ3MuZG9tKSkge1xuICAgIHRoaXMuaW5zdHJ1bWVudERvbSgpO1xuICB9IGVsc2UgaWYgKCF0aGlzLmF1dG9JbnN0cnVtZW50LmRvbSAmJiBvbGRTZXR0aW5ncyAmJiBvbGRTZXR0aW5ncy5kb20pIHtcbiAgICB0aGlzLmRlaW5zdHJ1bWVudERvbSgpO1xuICB9XG5cbiAgaWYgKFxuICAgIHRoaXMuYXV0b0luc3RydW1lbnQubmF2aWdhdGlvbiAmJlxuICAgICEob2xkU2V0dGluZ3MgJiYgb2xkU2V0dGluZ3MubmF2aWdhdGlvbilcbiAgKSB7XG4gICAgdGhpcy5pbnN0cnVtZW50TmF2aWdhdGlvbigpO1xuICB9IGVsc2UgaWYgKFxuICAgICF0aGlzLmF1dG9JbnN0cnVtZW50Lm5hdmlnYXRpb24gJiZcbiAgICBvbGRTZXR0aW5ncyAmJlxuICAgIG9sZFNldHRpbmdzLm5hdmlnYXRpb25cbiAgKSB7XG4gICAgdGhpcy5kZWluc3RydW1lbnROYXZpZ2F0aW9uKCk7XG4gIH1cblxuICBpZiAoXG4gICAgdGhpcy5hdXRvSW5zdHJ1bWVudC5jb25uZWN0aXZpdHkgJiZcbiAgICAhKG9sZFNldHRpbmdzICYmIG9sZFNldHRpbmdzLmNvbm5lY3Rpdml0eSlcbiAgKSB7XG4gICAgdGhpcy5pbnN0cnVtZW50Q29ubmVjdGl2aXR5KCk7XG4gIH0gZWxzZSBpZiAoXG4gICAgIXRoaXMuYXV0b0luc3RydW1lbnQuY29ubmVjdGl2aXR5ICYmXG4gICAgb2xkU2V0dGluZ3MgJiZcbiAgICBvbGRTZXR0aW5ncy5jb25uZWN0aXZpdHlcbiAgKSB7XG4gICAgdGhpcy5kZWluc3RydW1lbnRDb25uZWN0aXZpdHkoKTtcbiAgfVxuXG4gIGlmIChcbiAgICB0aGlzLmF1dG9JbnN0cnVtZW50LmNvbnRlbnRTZWN1cml0eVBvbGljeSAmJlxuICAgICEob2xkU2V0dGluZ3MgJiYgb2xkU2V0dGluZ3MuY29udGVudFNlY3VyaXR5UG9saWN5KVxuICApIHtcbiAgICB0aGlzLmluc3RydW1lbnRDb250ZW50U2VjdXJpdHlQb2xpY3koKTtcbiAgfSBlbHNlIGlmIChcbiAgICAhdGhpcy5hdXRvSW5zdHJ1bWVudC5jb250ZW50U2VjdXJpdHlQb2xpY3kgJiZcbiAgICBvbGRTZXR0aW5ncyAmJlxuICAgIG9sZFNldHRpbmdzLmNvbnRlbnRTZWN1cml0eVBvbGljeVxuICApIHtcbiAgICB0aGlzLmRlaW5zdHJ1bWVudENvbnRlbnRTZWN1cml0eVBvbGljeSgpO1xuICB9XG59O1xuXG5JbnN0cnVtZW50ZXIucHJvdG90eXBlLmRlaW5zdHJ1bWVudE5ldHdvcmsgPSBmdW5jdGlvbiAoKSB7XG4gIHJlc3RvcmUodGhpcy5yZXBsYWNlbWVudHMsICduZXR3b3JrJyk7XG59O1xuXG5JbnN0cnVtZW50ZXIucHJvdG90eXBlLmluc3RydW1lbnROZXR3b3JrID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgZnVuY3Rpb24gd3JhcFByb3AocHJvcCwgeGhyKSB7XG4gICAgaWYgKHByb3AgaW4geGhyICYmIF8uaXNGdW5jdGlvbih4aHJbcHJvcF0pKSB7XG4gICAgICByZXBsYWNlKHhociwgcHJvcCwgZnVuY3Rpb24gKG9yaWcpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYucm9sbGJhci53cmFwKG9yaWcpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCdYTUxIdHRwUmVxdWVzdCcgaW4gdGhpcy5fd2luZG93KSB7XG4gICAgdmFyIHhocnAgPSB0aGlzLl93aW5kb3cuWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlO1xuICAgIHJlcGxhY2UoXG4gICAgICB4aHJwLFxuICAgICAgJ29wZW4nLFxuICAgICAgZnVuY3Rpb24gKG9yaWcpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChtZXRob2QsIHVybCkge1xuICAgICAgICAgIHZhciBpc1VybE9iamVjdCA9IF9pc1VybE9iamVjdCh1cmwpO1xuICAgICAgICAgIGlmIChfLmlzVHlwZSh1cmwsICdzdHJpbmcnKSB8fCBpc1VybE9iamVjdCkge1xuICAgICAgICAgICAgdXJsID0gaXNVcmxPYmplY3QgPyB1cmwudG9TdHJpbmcoKSA6IHVybDtcbiAgICAgICAgICAgIGlmICh0aGlzLl9fcm9sbGJhcl94aHIpIHtcbiAgICAgICAgICAgICAgdGhpcy5fX3JvbGxiYXJfeGhyLm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgICAgICAgICAgdGhpcy5fX3JvbGxiYXJfeGhyLnVybCA9IHVybDtcbiAgICAgICAgICAgICAgdGhpcy5fX3JvbGxiYXJfeGhyLnN0YXR1c19jb2RlID0gbnVsbDtcbiAgICAgICAgICAgICAgdGhpcy5fX3JvbGxiYXJfeGhyLnN0YXJ0X3RpbWVfbXMgPSBfLm5vdygpO1xuICAgICAgICAgICAgICB0aGlzLl9fcm9sbGJhcl94aHIuZW5kX3RpbWVfbXMgPSBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5fX3JvbGxiYXJfeGhyID0ge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgIHN0YXR1c19jb2RlOiBudWxsLFxuICAgICAgICAgICAgICAgIHN0YXJ0X3RpbWVfbXM6IF8ubm93KCksXG4gICAgICAgICAgICAgICAgZW5kX3RpbWVfbXM6IG51bGwsXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBvcmlnLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgdGhpcy5yZXBsYWNlbWVudHMsXG4gICAgICAnbmV0d29yaycsXG4gICAgKTtcblxuICAgIHJlcGxhY2UoXG4gICAgICB4aHJwLFxuICAgICAgJ3NldFJlcXVlc3RIZWFkZXInLFxuICAgICAgZnVuY3Rpb24gKG9yaWcpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChoZWFkZXIsIHZhbHVlKSB7XG4gICAgICAgICAgLy8gSWYgeGhyLm9wZW4gaXMgYXN5bmMsIF9fcm9sbGJhcl94aHIgbWF5IG5vdCBiZSBpbml0aWFsaXplZCB5ZXQuXG4gICAgICAgICAgaWYgKCF0aGlzLl9fcm9sbGJhcl94aHIpIHtcbiAgICAgICAgICAgIHRoaXMuX19yb2xsYmFyX3hociA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoXy5pc1R5cGUoaGVhZGVyLCAnc3RyaW5nJykgJiYgXy5pc1R5cGUodmFsdWUsICdzdHJpbmcnKSkge1xuICAgICAgICAgICAgaWYgKHNlbGYuYXV0b0luc3RydW1lbnQubmV0d29ya1JlcXVlc3RIZWFkZXJzKSB7XG4gICAgICAgICAgICAgIGlmICghdGhpcy5fX3JvbGxiYXJfeGhyLnJlcXVlc3RfaGVhZGVycykge1xuICAgICAgICAgICAgICAgIHRoaXMuX19yb2xsYmFyX3hoci5yZXF1ZXN0X2hlYWRlcnMgPSB7fTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0aGlzLl9fcm9sbGJhcl94aHIucmVxdWVzdF9oZWFkZXJzW2hlYWRlcl0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFdlIHdhbnQgdGhlIGNvbnRlbnQgdHlwZSBldmVuIGlmIHJlcXVlc3QgaGVhZGVyIHRlbGVtZXRyeSBpcyBvZmYuXG4gICAgICAgICAgICBpZiAoaGVhZGVyLnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnKSB7XG4gICAgICAgICAgICAgIHRoaXMuX19yb2xsYmFyX3hoci5yZXF1ZXN0X2NvbnRlbnRfdHlwZSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gb3JpZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIHRoaXMucmVwbGFjZW1lbnRzLFxuICAgICAgJ25ldHdvcmsnLFxuICAgICk7XG5cbiAgICByZXBsYWNlKFxuICAgICAgeGhycCxcbiAgICAgICdzZW5kJyxcbiAgICAgIGZ1bmN0aW9uIChvcmlnKSB7XG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICAgICAgICB2YXIgeGhyID0gdGhpcztcblxuICAgICAgICAgIGZ1bmN0aW9uIG9ucmVhZHlzdGF0ZWNoYW5nZUhhbmRsZXIoKSB7XG4gICAgICAgICAgICBpZiAoeGhyLl9fcm9sbGJhcl94aHIpIHtcbiAgICAgICAgICAgICAgaWYgKHhoci5fX3JvbGxiYXJfeGhyLnN0YXR1c19jb2RlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgeGhyLl9fcm9sbGJhcl94aHIuc3RhdHVzX2NvZGUgPSAwO1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmF1dG9JbnN0cnVtZW50Lm5ldHdvcmtSZXF1ZXN0Qm9keSkge1xuICAgICAgICAgICAgICAgICAgeGhyLl9fcm9sbGJhcl94aHIucmVxdWVzdCA9IGRhdGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHhoci5fX3JvbGxiYXJfZXZlbnQgPSBzZWxmLmNhcHR1cmVOZXR3b3JrKFxuICAgICAgICAgICAgICAgICAgeGhyLl9fcm9sbGJhcl94aHIsXG4gICAgICAgICAgICAgICAgICAneGhyJyxcbiAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA8IDIpIHtcbiAgICAgICAgICAgICAgICB4aHIuX19yb2xsYmFyX3hoci5zdGFydF90aW1lX21zID0gXy5ub3coKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPiAzKSB7XG4gICAgICAgICAgICAgICAgeGhyLl9fcm9sbGJhcl94aHIuZW5kX3RpbWVfbXMgPSBfLm5vdygpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGhlYWRlcnMgPSBudWxsO1xuICAgICAgICAgICAgICAgIHhoci5fX3JvbGxiYXJfeGhyLnJlc3BvbnNlX2NvbnRlbnRfdHlwZSA9XG4gICAgICAgICAgICAgICAgICB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmF1dG9JbnN0cnVtZW50Lm5ldHdvcmtSZXNwb25zZUhlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBoZWFkZXJzQ29uZmlnID1cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hdXRvSW5zdHJ1bWVudC5uZXR3b3JrUmVzcG9uc2VIZWFkZXJzO1xuICAgICAgICAgICAgICAgICAgaGVhZGVycyA9IHt9O1xuICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhlYWRlciwgaTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhlYWRlcnNDb25maWcgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgYWxsSGVhZGVycyA9IHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKTtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoYWxsSGVhZGVycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFyciA9IGFsbEhlYWRlcnMudHJpbSgpLnNwbGl0KC9bXFxyXFxuXSsvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJ0cywgdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRzID0gYXJyW2ldLnNwbGl0KCc6ICcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXIgPSBwYXJ0cy5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHBhcnRzLmpvaW4oJzogJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnNbaGVhZGVyXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaGVhZGVyc0NvbmZpZy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyID0gaGVhZGVyc0NvbmZpZ1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnNbaGVhZGVyXSA9IHhoci5nZXRSZXNwb25zZUhlYWRlcihoZWFkZXIpO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAvKiB3ZSBpZ25vcmUgdGhlIGVycm9ycyBoZXJlIHRoYXQgY291bGQgY29tZSBmcm9tIGRpZmZlcmVudFxuICAgICAgICAgICAgICAgICAgICAgKiBicm93c2VyIGlzc3VlcyB3aXRoIHRoZSB4aHIgbWV0aG9kcyAqL1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgYm9keSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuYXV0b0luc3RydW1lbnQubmV0d29ya1Jlc3BvbnNlQm9keSkge1xuICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgYm9keSA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIGlnbm9yZSBlcnJvcnMgZnJvbSByZWFkaW5nIHJlc3BvbnNlVGV4dCAqL1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIGlmIChib2R5IHx8IGhlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0ge307XG4gICAgICAgICAgICAgICAgICBpZiAoYm9keSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgc2VsZi5pc0pzb25Db250ZW50VHlwZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHhoci5fX3JvbGxiYXJfeGhyLnJlc3BvbnNlX2NvbnRlbnRfdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmJvZHkgPSBzZWxmLnNjcnViSnNvbihib2R5KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5ib2R5ID0gYm9keTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKGhlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuaGVhZGVycyA9IGhlYWRlcnM7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgeGhyLl9fcm9sbGJhcl94aHIucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIHZhciBjb2RlID0geGhyLnN0YXR1cztcbiAgICAgICAgICAgICAgICAgIGNvZGUgPSBjb2RlID09PSAxMjIzID8gMjA0IDogY29kZTtcbiAgICAgICAgICAgICAgICAgIHhoci5fX3JvbGxiYXJfeGhyLnN0YXR1c19jb2RlID0gY29kZTtcbiAgICAgICAgICAgICAgICAgIHhoci5fX3JvbGxiYXJfZXZlbnQubGV2ZWwgPVxuICAgICAgICAgICAgICAgICAgICBzZWxmLnRlbGVtZXRlci5sZXZlbEZyb21TdGF0dXMoY29kZSk7XG4gICAgICAgICAgICAgICAgICBzZWxmLmVycm9yT25IdHRwU3RhdHVzKHhoci5fX3JvbGxiYXJfeGhyKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAvKiBpZ25vcmUgcG9zc2libGUgZXhjZXB0aW9uIGZyb20geGhyLnN0YXR1cyAqL1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHdyYXBQcm9wKCdvbmxvYWQnLCB4aHIpO1xuICAgICAgICAgIHdyYXBQcm9wKCdvbmVycm9yJywgeGhyKTtcbiAgICAgICAgICB3cmFwUHJvcCgnb25wcm9ncmVzcycsIHhocik7XG5cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAnb25yZWFkeXN0YXRlY2hhbmdlJyBpbiB4aHIgJiZcbiAgICAgICAgICAgIF8uaXNGdW5jdGlvbih4aHIub25yZWFkeXN0YXRlY2hhbmdlKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmVwbGFjZSh4aHIsICdvbnJlYWR5c3RhdGVjaGFuZ2UnLCBmdW5jdGlvbiAob3JpZykge1xuICAgICAgICAgICAgICByZXR1cm4gc2VsZi5yb2xsYmFyLndyYXAoXG4gICAgICAgICAgICAgICAgb3JpZyxcbiAgICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb25yZWFkeXN0YXRlY2hhbmdlSGFuZGxlcixcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gb25yZWFkeXN0YXRlY2hhbmdlSGFuZGxlcjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHhoci5fX3JvbGxiYXJfeGhyICYmIHNlbGYudHJhY2tIdHRwRXJyb3JzKCkpIHtcbiAgICAgICAgICAgIHhoci5fX3JvbGxiYXJfeGhyLnN0YWNrID0gbmV3IEVycm9yKCkuc3RhY2s7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBvcmlnLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgdGhpcy5yZXBsYWNlbWVudHMsXG4gICAgICAnbmV0d29yaycsXG4gICAgKTtcbiAgfVxuXG4gIGlmICgnZmV0Y2gnIGluIHRoaXMuX3dpbmRvdykge1xuICAgIHJlcGxhY2UoXG4gICAgICB0aGlzLl93aW5kb3csXG4gICAgICAnZmV0Y2gnLFxuICAgICAgZnVuY3Rpb24gKG9yaWcpIHtcbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmbiwgdCkge1xuICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICAgICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJncy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGlucHV0ID0gYXJnc1swXTtcbiAgICAgICAgICB2YXIgbWV0aG9kID0gJ0dFVCc7XG4gICAgICAgICAgdmFyIHVybDtcbiAgICAgICAgICB2YXIgaXNVcmxPYmplY3QgPSBfaXNVcmxPYmplY3QoaW5wdXQpO1xuICAgICAgICAgIGlmIChfLmlzVHlwZShpbnB1dCwgJ3N0cmluZycpIHx8IGlzVXJsT2JqZWN0KSB7XG4gICAgICAgICAgICB1cmwgPSBpc1VybE9iamVjdCA/IGlucHV0LnRvU3RyaW5nKCkgOiBpbnB1dDtcbiAgICAgICAgICB9IGVsc2UgaWYgKGlucHV0KSB7XG4gICAgICAgICAgICB1cmwgPSBpbnB1dC51cmw7XG4gICAgICAgICAgICBpZiAoaW5wdXQubWV0aG9kKSB7XG4gICAgICAgICAgICAgIG1ldGhvZCA9IGlucHV0Lm1ldGhvZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFyZ3NbMV0gJiYgYXJnc1sxXS5tZXRob2QpIHtcbiAgICAgICAgICAgIG1ldGhvZCA9IGFyZ3NbMV0ubWV0aG9kO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgbWV0YWRhdGEgPSB7XG4gICAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgc3RhdHVzX2NvZGU6IG51bGwsXG4gICAgICAgICAgICBzdGFydF90aW1lX21zOiBfLm5vdygpLFxuICAgICAgICAgICAgZW5kX3RpbWVfbXM6IG51bGwsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoYXJnc1sxXSAmJiBhcmdzWzFdLmhlYWRlcnMpIHtcbiAgICAgICAgICAgIC8vIEFyZ3VtZW50IG1heSBiZSBhIEhlYWRlcnMgb2JqZWN0LCBvciBwbGFpbiBvYmplY3QuIEVuc3VyZSBoZXJlIHRoYXRcbiAgICAgICAgICAgIC8vIHdlIGFyZSB3b3JraW5nIHdpdGggYSBIZWFkZXJzIG9iamVjdCB3aXRoIGNhc2UtaW5zZW5zaXRpdmUga2V5cy5cbiAgICAgICAgICAgIHZhciByZXFIZWFkZXJzID0gaGVhZGVycyhhcmdzWzFdLmhlYWRlcnMpO1xuXG4gICAgICAgICAgICBtZXRhZGF0YS5yZXF1ZXN0X2NvbnRlbnRfdHlwZSA9IHJlcUhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKTtcblxuICAgICAgICAgICAgaWYgKHNlbGYuYXV0b0luc3RydW1lbnQubmV0d29ya1JlcXVlc3RIZWFkZXJzKSB7XG4gICAgICAgICAgICAgIG1ldGFkYXRhLnJlcXVlc3RfaGVhZGVycyA9IHNlbGYuZmV0Y2hIZWFkZXJzKFxuICAgICAgICAgICAgICAgIHJlcUhlYWRlcnMsXG4gICAgICAgICAgICAgICAgc2VsZi5hdXRvSW5zdHJ1bWVudC5uZXR3b3JrUmVxdWVzdEhlYWRlcnMsXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHNlbGYuYXV0b0luc3RydW1lbnQubmV0d29ya1JlcXVlc3RCb2R5KSB7XG4gICAgICAgICAgICBpZiAoYXJnc1sxXSAmJiBhcmdzWzFdLmJvZHkpIHtcbiAgICAgICAgICAgICAgbWV0YWRhdGEucmVxdWVzdCA9IGFyZ3NbMV0uYm9keTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgIGFyZ3NbMF0gJiZcbiAgICAgICAgICAgICAgIV8uaXNUeXBlKGFyZ3NbMF0sICdzdHJpbmcnKSAmJlxuICAgICAgICAgICAgICBhcmdzWzBdLmJvZHlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBtZXRhZGF0YS5yZXF1ZXN0ID0gYXJnc1swXS5ib2R5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxmLmNhcHR1cmVOZXR3b3JrKG1ldGFkYXRhLCAnZmV0Y2gnLCB1bmRlZmluZWQpO1xuICAgICAgICAgIGlmIChzZWxmLnRyYWNrSHR0cEVycm9ycygpKSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5zdGFjayA9IG5ldyBFcnJvcigpLnN0YWNrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFN0YXJ0IG91ciBoYW5kbGVyIGJlZm9yZSByZXR1cm5pbmcgdGhlIHByb21pc2UuIFRoaXMgYWxsb3dzIHJlc3AuY2xvbmUoKVxuICAgICAgICAgIC8vIHRvIGV4ZWN1dGUgYmVmb3JlIG90aGVyIGhhbmRsZXJzIHRvdWNoIHRoZSByZXNwb25zZS5cbiAgICAgICAgICByZXR1cm4gb3JpZy5hcHBseSh0aGlzLCBhcmdzKS50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5lbmRfdGltZV9tcyA9IF8ubm93KCk7XG4gICAgICAgICAgICBtZXRhZGF0YS5zdGF0dXNfY29kZSA9IHJlc3Auc3RhdHVzO1xuICAgICAgICAgICAgbWV0YWRhdGEucmVzcG9uc2VfY29udGVudF90eXBlID0gcmVzcC5oZWFkZXJzLmdldCgnQ29udGVudC1UeXBlJyk7XG4gICAgICAgICAgICB2YXIgaGVhZGVycyA9IG51bGw7XG4gICAgICAgICAgICBpZiAoc2VsZi5hdXRvSW5zdHJ1bWVudC5uZXR3b3JrUmVzcG9uc2VIZWFkZXJzKSB7XG4gICAgICAgICAgICAgIGhlYWRlcnMgPSBzZWxmLmZldGNoSGVhZGVycyhcbiAgICAgICAgICAgICAgICByZXNwLmhlYWRlcnMsXG4gICAgICAgICAgICAgICAgc2VsZi5hdXRvSW5zdHJ1bWVudC5uZXR3b3JrUmVzcG9uc2VIZWFkZXJzLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGJvZHkgPSBudWxsO1xuICAgICAgICAgICAgaWYgKHNlbGYuYXV0b0luc3RydW1lbnQubmV0d29ya1Jlc3BvbnNlQm9keSkge1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlc3AudGV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIC8vIFJlc3BvbnNlLnRleHQoKSBpcyBub3QgaW1wbGVtZW50ZWQgb24gc29tZSBwbGF0Zm9ybXNcbiAgICAgICAgICAgICAgICAvLyBUaGUgcmVzcG9uc2UgbXVzdCBiZSBjbG9uZWQgdG8gcHJldmVudCByZWFkaW5nIChhbmQgbG9ja2luZykgdGhlIG9yaWdpbmFsIHN0cmVhbS5cbiAgICAgICAgICAgICAgICAvLyBUaGlzIG11c3QgYmUgZG9uZSBiZWZvcmUgb3RoZXIgaGFuZGxlcnMgdG91Y2ggdGhlIHJlc3BvbnNlLlxuICAgICAgICAgICAgICAgIGJvZHkgPSByZXNwLmNsb25lKCkudGV4dCgpOyAvL3JldHVybnMgYSBQcm9taXNlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoZWFkZXJzIHx8IGJvZHkpIHtcbiAgICAgICAgICAgICAgbWV0YWRhdGEucmVzcG9uc2UgPSB7fTtcbiAgICAgICAgICAgICAgaWYgKGJvZHkpIHtcbiAgICAgICAgICAgICAgICAvLyBUZXN0IHRvIGVuc3VyZSBib2R5IGlzIGEgUHJvbWlzZSwgd2hpY2ggaXQgc2hvdWxkIGFsd2F5cyBiZS5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGJvZHkudGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgYm9keS50aGVuKGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0ICYmXG4gICAgICAgICAgICAgICAgICAgICAgc2VsZi5pc0pzb25Db250ZW50VHlwZShtZXRhZGF0YS5yZXNwb25zZV9jb250ZW50X3R5cGUpXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgIG1ldGFkYXRhLnJlc3BvbnNlLmJvZHkgPSBzZWxmLnNjcnViSnNvbih0ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICBtZXRhZGF0YS5yZXNwb25zZS5ib2R5ID0gdGV4dDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIG1ldGFkYXRhLnJlc3BvbnNlLmJvZHkgPSBib2R5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoaGVhZGVycykge1xuICAgICAgICAgICAgICAgIG1ldGFkYXRhLnJlc3BvbnNlLmhlYWRlcnMgPSBoZWFkZXJzO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmVycm9yT25IdHRwU3RhdHVzKG1ldGFkYXRhKTtcbiAgICAgICAgICAgIHJldHVybiByZXNwO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIHRoaXMucmVwbGFjZW1lbnRzLFxuICAgICAgJ25ldHdvcmsnLFxuICAgICk7XG4gIH1cbn07XG5cbkluc3RydW1lbnRlci5wcm90b3R5cGUuY2FwdHVyZU5ldHdvcmsgPSBmdW5jdGlvbiAoXG4gIG1ldGFkYXRhLFxuICBzdWJ0eXBlLFxuICByb2xsYmFyVVVJRCxcbikge1xuICBpZiAoXG4gICAgbWV0YWRhdGEucmVxdWVzdCAmJlxuICAgIHRoaXMuaXNKc29uQ29udGVudFR5cGUobWV0YWRhdGEucmVxdWVzdF9jb250ZW50X3R5cGUpXG4gICkge1xuICAgIG1ldGFkYXRhLnJlcXVlc3QgPSB0aGlzLnNjcnViSnNvbihtZXRhZGF0YS5yZXF1ZXN0KTtcbiAgfVxuICByZXR1cm4gdGhpcy50ZWxlbWV0ZXIuY2FwdHVyZU5ldHdvcmsobWV0YWRhdGEsIHN1YnR5cGUsIHJvbGxiYXJVVUlEKTtcbn07XG5cbkluc3RydW1lbnRlci5wcm90b3R5cGUuaXNKc29uQ29udGVudFR5cGUgPSBmdW5jdGlvbiAoY29udGVudFR5cGUpIHtcbiAgcmV0dXJuIGNvbnRlbnRUeXBlICYmXG4gICAgXy5pc1R5cGUoY29udGVudFR5cGUsICdzdHJpbmcnKSAmJlxuICAgIGNvbnRlbnRUeXBlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ2pzb24nKVxuICAgID8gdHJ1ZVxuICAgIDogZmFsc2U7XG59O1xuXG5JbnN0cnVtZW50ZXIucHJvdG90eXBlLnNjcnViSnNvbiA9IGZ1bmN0aW9uIChqc29uKSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShzY3J1YihKU09OLnBhcnNlKGpzb24pLCB0aGlzLm9wdGlvbnMuc2NydWJGaWVsZHMpKTtcbn07XG5cbkluc3RydW1lbnRlci5wcm90b3R5cGUuZmV0Y2hIZWFkZXJzID0gZnVuY3Rpb24gKGluSGVhZGVycywgaGVhZGVyc0NvbmZpZykge1xuICB2YXIgb3V0SGVhZGVycyA9IHt9O1xuICB0cnkge1xuICAgIHZhciBpO1xuICAgIGlmIChoZWFkZXJzQ29uZmlnID09PSB0cnVlKSB7XG4gICAgICBpZiAodHlwZW9mIGluSGVhZGVycy5lbnRyaWVzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIEhlYWRlcnMuZW50cmllcygpIGlzIG5vdCBpbXBsZW1lbnRlZCBpbiBJRVxuICAgICAgICB2YXIgYWxsSGVhZGVycyA9IGluSGVhZGVycy5lbnRyaWVzKCk7XG4gICAgICAgIHZhciBjdXJyZW50SGVhZGVyID0gYWxsSGVhZGVycy5uZXh0KCk7XG4gICAgICAgIHdoaWxlICghY3VycmVudEhlYWRlci5kb25lKSB7XG4gICAgICAgICAgb3V0SGVhZGVyc1tjdXJyZW50SGVhZGVyLnZhbHVlWzBdXSA9IGN1cnJlbnRIZWFkZXIudmFsdWVbMV07XG4gICAgICAgICAgY3VycmVudEhlYWRlciA9IGFsbEhlYWRlcnMubmV4dCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBoZWFkZXJzQ29uZmlnLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBoZWFkZXIgPSBoZWFkZXJzQ29uZmlnW2ldO1xuICAgICAgICBvdXRIZWFkZXJzW2hlYWRlcl0gPSBpbkhlYWRlcnMuZ2V0KGhlYWRlcik7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgLyogaWdub3JlIHByb2JhYmxlIElFIGVycm9ycyAqL1xuICB9XG4gIHJldHVybiBvdXRIZWFkZXJzO1xufTtcblxuSW5zdHJ1bWVudGVyLnByb3RvdHlwZS50cmFja0h0dHBFcnJvcnMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiAoXG4gICAgdGhpcy5hdXRvSW5zdHJ1bWVudC5uZXR3b3JrRXJyb3JPbkh0dHA1eHggfHxcbiAgICB0aGlzLmF1dG9JbnN0cnVtZW50Lm5ldHdvcmtFcnJvck9uSHR0cDR4eCB8fFxuICAgIHRoaXMuYXV0b0luc3RydW1lbnQubmV0d29ya0Vycm9yT25IdHRwMFxuICApO1xufTtcblxuSW5zdHJ1bWVudGVyLnByb3RvdHlwZS5lcnJvck9uSHR0cFN0YXR1cyA9IGZ1bmN0aW9uIChtZXRhZGF0YSkge1xuICB2YXIgc3RhdHVzID0gbWV0YWRhdGEuc3RhdHVzX2NvZGU7XG5cbiAgaWYgKFxuICAgIChzdGF0dXMgPj0gNTAwICYmIHRoaXMuYXV0b0luc3RydW1lbnQubmV0d29ya0Vycm9yT25IdHRwNXh4KSB8fFxuICAgIChzdGF0dXMgPj0gNDAwICYmIHRoaXMuYXV0b0luc3RydW1lbnQubmV0d29ya0Vycm9yT25IdHRwNHh4KSB8fFxuICAgIChzdGF0dXMgPT09IDAgJiYgdGhpcy5hdXRvSW5zdHJ1bWVudC5uZXR3b3JrRXJyb3JPbkh0dHAwKVxuICApIHtcbiAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IoJ0hUVFAgcmVxdWVzdCBmYWlsZWQgd2l0aCBTdGF0dXMgJyArIHN0YXR1cyk7XG4gICAgZXJyb3Iuc3RhY2sgPSBtZXRhZGF0YS5zdGFjaztcbiAgICB0aGlzLnJvbGxiYXIuZXJyb3IoZXJyb3IsIHsgc2tpcEZyYW1lczogMSB9KTtcbiAgfVxufTtcblxuSW5zdHJ1bWVudGVyLnByb3RvdHlwZS5kZWluc3RydW1lbnRDb25zb2xlID0gZnVuY3Rpb24gKCkge1xuICBpZiAoISgnY29uc29sZScgaW4gdGhpcy5fd2luZG93ICYmIHRoaXMuX3dpbmRvdy5jb25zb2xlLmxvZykpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGI7XG4gIHdoaWxlICh0aGlzLnJlcGxhY2VtZW50c1snbG9nJ10ubGVuZ3RoKSB7XG4gICAgYiA9IHRoaXMucmVwbGFjZW1lbnRzWydsb2cnXS5zaGlmdCgpO1xuICAgIHRoaXMuX3dpbmRvdy5jb25zb2xlW2JbMF1dID0gYlsxXTtcbiAgfVxufTtcblxuSW5zdHJ1bWVudGVyLnByb3RvdHlwZS5pbnN0cnVtZW50Q29uc29sZSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKCEoJ2NvbnNvbGUnIGluIHRoaXMuX3dpbmRvdyAmJiB0aGlzLl93aW5kb3cuY29uc29sZS5sb2cpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgYyA9IHRoaXMuX3dpbmRvdy5jb25zb2xlO1xuXG4gIGZ1bmN0aW9uIHdyYXBDb25zb2xlKG1ldGhvZCkge1xuICAgICd1c2Ugc3RyaWN0JzsgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9yb2xsYmFyL3JvbGxiYXIuanMvcHVsbC83NzhcblxuICAgIHZhciBvcmlnID0gY1ttZXRob2RdO1xuICAgIHZhciBvcmlnQ29uc29sZSA9IGM7XG4gICAgdmFyIGxldmVsID0gbWV0aG9kID09PSAnd2FybicgPyAnd2FybmluZycgOiBtZXRob2Q7XG4gICAgY1ttZXRob2RdID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgdmFyIG1lc3NhZ2UgPSBfLmZvcm1hdEFyZ3NBc1N0cmluZyhhcmdzKTtcbiAgICAgIHNlbGYudGVsZW1ldGVyLmNhcHR1cmVMb2cobWVzc2FnZSwgbGV2ZWwsIG51bGwsIF8ubm93KCkpO1xuICAgICAgaWYgKG9yaWcpIHtcbiAgICAgICAgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwob3JpZywgb3JpZ0NvbnNvbGUsIGFyZ3MpO1xuICAgICAgfVxuICAgIH07XG4gICAgc2VsZi5yZXBsYWNlbWVudHNbJ2xvZyddLnB1c2goW21ldGhvZCwgb3JpZ10pO1xuICB9XG4gIHZhciBtZXRob2RzID0gWydkZWJ1ZycsICdpbmZvJywgJ3dhcm4nLCAnZXJyb3InLCAnbG9nJ107XG4gIHRyeSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IG1ldGhvZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHdyYXBDb25zb2xlKG1ldGhvZHNbaV0pO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIHRoaXMuZGlhZ25vc3RpYy5pbnN0cnVtZW50Q29uc29sZSA9IHsgZXJyb3I6IGUubWVzc2FnZSB9O1xuICB9XG59O1xuXG5JbnN0cnVtZW50ZXIucHJvdG90eXBlLmRlaW5zdHJ1bWVudERvbSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKCEoJ2FkZEV2ZW50TGlzdGVuZXInIGluIHRoaXMuX3dpbmRvdyB8fCAnYXR0YWNoRXZlbnQnIGluIHRoaXMuX3dpbmRvdykpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy5yZW1vdmVMaXN0ZW5lcnMoJ2RvbScpO1xufTtcblxuSW5zdHJ1bWVudGVyLnByb3RvdHlwZS5pbnN0cnVtZW50RG9tID0gZnVuY3Rpb24gKCkge1xuICBpZiAoISgnYWRkRXZlbnRMaXN0ZW5lcicgaW4gdGhpcy5fd2luZG93IHx8ICdhdHRhY2hFdmVudCcgaW4gdGhpcy5fd2luZG93KSkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgY2xpY2tIYW5kbGVyID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpO1xuICB2YXIgYmx1ckhhbmRsZXIgPSB0aGlzLmhhbmRsZUJsdXIuYmluZCh0aGlzKTtcbiAgdGhpcy5hZGRMaXN0ZW5lcignZG9tJywgdGhpcy5fd2luZG93LCAnY2xpY2snLCAnb25jbGljaycsIGNsaWNrSGFuZGxlciwgdHJ1ZSk7XG4gIHRoaXMuYWRkTGlzdGVuZXIoXG4gICAgJ2RvbScsXG4gICAgdGhpcy5fd2luZG93LFxuICAgICdibHVyJyxcbiAgICAnb25mb2N1c291dCcsXG4gICAgYmx1ckhhbmRsZXIsXG4gICAgdHJ1ZSxcbiAgKTtcbn07XG5cbkluc3RydW1lbnRlci5wcm90b3R5cGUuaGFuZGxlQ2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gIHRyeSB7XG4gICAgdmFyIGUgPSBkb21VdGlsLmdldEVsZW1lbnRGcm9tRXZlbnQoZXZ0LCB0aGlzLl9kb2N1bWVudCk7XG4gICAgdmFyIGhhc1RhZyA9IGUgJiYgZS50YWdOYW1lO1xuICAgIHZhciBhbmNob3JPckJ1dHRvbiA9XG4gICAgICBkb21VdGlsLmlzRGVzY3JpYmVkRWxlbWVudChlLCAnYScpIHx8XG4gICAgICBkb21VdGlsLmlzRGVzY3JpYmVkRWxlbWVudChlLCAnYnV0dG9uJyk7XG4gICAgaWYgKFxuICAgICAgaGFzVGFnICYmXG4gICAgICAoYW5jaG9yT3JCdXR0b24gfHxcbiAgICAgICAgZG9tVXRpbC5pc0Rlc2NyaWJlZEVsZW1lbnQoZSwgJ2lucHV0JywgWydidXR0b24nLCAnc3VibWl0J10pKVxuICAgICkge1xuICAgICAgdGhpcy5jYXB0dXJlRG9tRXZlbnQoJ2NsaWNrJywgZSk7XG4gICAgfSBlbHNlIGlmIChkb21VdGlsLmlzRGVzY3JpYmVkRWxlbWVudChlLCAnaW5wdXQnLCBbJ2NoZWNrYm94JywgJ3JhZGlvJ10pKSB7XG4gICAgICB0aGlzLmNhcHR1cmVEb21FdmVudCgnaW5wdXQnLCBlLCBlLnZhbHVlLCBlLmNoZWNrZWQpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXhjKSB7XG4gICAgLy8gVE9ETzogTm90IHN1cmUgd2hhdCB0byBkbyBoZXJlXG4gIH1cbn07XG5cbkluc3RydW1lbnRlci5wcm90b3R5cGUuaGFuZGxlQmx1ciA9IGZ1bmN0aW9uIChldnQpIHtcbiAgdHJ5IHtcbiAgICB2YXIgZSA9IGRvbVV0aWwuZ2V0RWxlbWVudEZyb21FdmVudChldnQsIHRoaXMuX2RvY3VtZW50KTtcbiAgICBpZiAoZSAmJiBlLnRhZ05hbWUpIHtcbiAgICAgIGlmIChkb21VdGlsLmlzRGVzY3JpYmVkRWxlbWVudChlLCAndGV4dGFyZWEnKSkge1xuICAgICAgICB0aGlzLmNhcHR1cmVEb21FdmVudCgnaW5wdXQnLCBlLCBlLnZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIGRvbVV0aWwuaXNEZXNjcmliZWRFbGVtZW50KGUsICdzZWxlY3QnKSAmJlxuICAgICAgICBlLm9wdGlvbnMgJiZcbiAgICAgICAgZS5vcHRpb25zLmxlbmd0aFxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlU2VsZWN0SW5wdXRDaGFuZ2VkKGUpO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgZG9tVXRpbC5pc0Rlc2NyaWJlZEVsZW1lbnQoZSwgJ2lucHV0JykgJiZcbiAgICAgICAgIWRvbVV0aWwuaXNEZXNjcmliZWRFbGVtZW50KGUsICdpbnB1dCcsIFtcbiAgICAgICAgICAnYnV0dG9uJyxcbiAgICAgICAgICAnc3VibWl0JyxcbiAgICAgICAgICAnaGlkZGVuJyxcbiAgICAgICAgICAnY2hlY2tib3gnLFxuICAgICAgICAgICdyYWRpbycsXG4gICAgICAgIF0pXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5jYXB0dXJlRG9tRXZlbnQoJ2lucHV0JywgZSwgZS52YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChleGMpIHtcbiAgICAvLyBUT0RPOiBOb3Qgc3VyZSB3aGF0IHRvIGRvIGhlcmVcbiAgfVxufTtcblxuSW5zdHJ1bWVudGVyLnByb3RvdHlwZS5oYW5kbGVTZWxlY3RJbnB1dENoYW5nZWQgPSBmdW5jdGlvbiAoZWxlbSkge1xuICBpZiAoZWxlbS5tdWx0aXBsZSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbS5vcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoZWxlbS5vcHRpb25zW2ldLnNlbGVjdGVkKSB7XG4gICAgICAgIHRoaXMuY2FwdHVyZURvbUV2ZW50KCdpbnB1dCcsIGVsZW0sIGVsZW0ub3B0aW9uc1tpXS52YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGVsZW0uc2VsZWN0ZWRJbmRleCA+PSAwICYmIGVsZW0ub3B0aW9uc1tlbGVtLnNlbGVjdGVkSW5kZXhdKSB7XG4gICAgdGhpcy5jYXB0dXJlRG9tRXZlbnQoJ2lucHV0JywgZWxlbSwgZWxlbS5vcHRpb25zW2VsZW0uc2VsZWN0ZWRJbmRleF0udmFsdWUpO1xuICB9XG59O1xuXG5JbnN0cnVtZW50ZXIucHJvdG90eXBlLmNhcHR1cmVEb21FdmVudCA9IGZ1bmN0aW9uIChcbiAgc3VidHlwZSxcbiAgZWxlbWVudCxcbiAgdmFsdWUsXG4gIGlzQ2hlY2tlZCxcbikge1xuICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIGlmIChcbiAgICAgIHRoaXMuc2NydWJUZWxlbWV0cnlJbnB1dHMgfHxcbiAgICAgIGRvbVV0aWwuZ2V0RWxlbWVudFR5cGUoZWxlbWVudCkgPT09ICdwYXNzd29yZCdcbiAgICApIHtcbiAgICAgIHZhbHVlID0gJ1tzY3J1YmJlZF0nO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZGVzY3JpcHRpb24gPSBkb21VdGlsLmRlc2NyaWJlRWxlbWVudChlbGVtZW50KTtcbiAgICAgIGlmICh0aGlzLnRlbGVtZXRyeVNjcnViYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLnRlbGVtZXRyeVNjcnViYmVyKGRlc2NyaXB0aW9uKSkge1xuICAgICAgICAgIHZhbHVlID0gJ1tzY3J1YmJlZF0nO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZGVmYXVsdFZhbHVlU2NydWJiZXIoZGVzY3JpcHRpb24pKSB7XG4gICAgICAgIHZhbHVlID0gJ1tzY3J1YmJlZF0nO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICB2YXIgZWxlbWVudFN0cmluZyA9IGRvbVV0aWwuZWxlbWVudEFycmF5VG9TdHJpbmcoXG4gICAgZG9tVXRpbC50cmVlVG9BcnJheShlbGVtZW50KSxcbiAgKTtcbiAgdGhpcy50ZWxlbWV0ZXIuY2FwdHVyZURvbShzdWJ0eXBlLCBlbGVtZW50U3RyaW5nLCB2YWx1ZSwgaXNDaGVja2VkKTtcbn07XG5cbkluc3RydW1lbnRlci5wcm90b3R5cGUuZGVpbnN0cnVtZW50TmF2aWdhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNocm9tZSA9IHRoaXMuX3dpbmRvdy5jaHJvbWU7XG4gIHZhciBjaHJvbWVQYWNrYWdlZEFwcCA9IGNocm9tZSAmJiBjaHJvbWUuYXBwICYmIGNocm9tZS5hcHAucnVudGltZTtcbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIuanMvcHVsbC8xMzk0NS9maWxlc1xuICB2YXIgaGFzUHVzaFN0YXRlID1cbiAgICAhY2hyb21lUGFja2FnZWRBcHAgJiZcbiAgICB0aGlzLl93aW5kb3cuaGlzdG9yeSAmJlxuICAgIHRoaXMuX3dpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZTtcbiAgaWYgKCFoYXNQdXNoU3RhdGUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcmVzdG9yZSh0aGlzLnJlcGxhY2VtZW50cywgJ25hdmlnYXRpb24nKTtcbn07XG5cbkluc3RydW1lbnRlci5wcm90b3R5cGUuaW5zdHJ1bWVudE5hdmlnYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjaHJvbWUgPSB0aGlzLl93aW5kb3cuY2hyb21lO1xuICB2YXIgY2hyb21lUGFja2FnZWRBcHAgPSBjaHJvbWUgJiYgY2hyb21lLmFwcCAmJiBjaHJvbWUuYXBwLnJ1bnRpbWU7XG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL3B1bGwvMTM5NDUvZmlsZXNcbiAgdmFyIGhhc1B1c2hTdGF0ZSA9XG4gICAgIWNocm9tZVBhY2thZ2VkQXBwICYmXG4gICAgdGhpcy5fd2luZG93Lmhpc3RvcnkgJiZcbiAgICB0aGlzLl93aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGU7XG4gIGlmICghaGFzUHVzaFN0YXRlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBzZWxmID0gdGhpcztcbiAgcmVwbGFjZShcbiAgICB0aGlzLl93aW5kb3csXG4gICAgJ29ucG9wc3RhdGUnLFxuICAgIGZ1bmN0aW9uIChvcmlnKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY3VycmVudCA9IHNlbGYuX2xvY2F0aW9uLmhyZWY7XG4gICAgICAgIHNlbGYuaGFuZGxlVXJsQ2hhbmdlKHNlbGYuX2xhc3RIcmVmLCBjdXJyZW50KTtcbiAgICAgICAgaWYgKG9yaWcpIHtcbiAgICAgICAgICBvcmlnLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICB0aGlzLnJlcGxhY2VtZW50cyxcbiAgICAnbmF2aWdhdGlvbicsXG4gICk7XG5cbiAgcmVwbGFjZShcbiAgICB0aGlzLl93aW5kb3cuaGlzdG9yeSxcbiAgICAncHVzaFN0YXRlJyxcbiAgICBmdW5jdGlvbiAob3JpZykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHVybCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkO1xuICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgc2VsZi5oYW5kbGVVcmxDaGFuZ2Uoc2VsZi5fbGFzdEhyZWYsIHVybCArICcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3JpZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICB9LFxuICAgIHRoaXMucmVwbGFjZW1lbnRzLFxuICAgICduYXZpZ2F0aW9uJyxcbiAgKTtcbn07XG5cbkluc3RydW1lbnRlci5wcm90b3R5cGUuaGFuZGxlVXJsQ2hhbmdlID0gZnVuY3Rpb24gKGZyb20sIHRvKSB7XG4gIHZhciBwYXJzZWRIcmVmID0gdXJscGFyc2VyLnBhcnNlKHRoaXMuX2xvY2F0aW9uLmhyZWYpO1xuICB2YXIgcGFyc2VkVG8gPSB1cmxwYXJzZXIucGFyc2UodG8pO1xuICB2YXIgcGFyc2VkRnJvbSA9IHVybHBhcnNlci5wYXJzZShmcm9tKTtcbiAgdGhpcy5fbGFzdEhyZWYgPSB0bztcbiAgaWYgKFxuICAgIHBhcnNlZEhyZWYucHJvdG9jb2wgPT09IHBhcnNlZFRvLnByb3RvY29sICYmXG4gICAgcGFyc2VkSHJlZi5ob3N0ID09PSBwYXJzZWRUby5ob3N0XG4gICkge1xuICAgIHRvID0gcGFyc2VkVG8ucGF0aCArIChwYXJzZWRUby5oYXNoIHx8ICcnKTtcbiAgfVxuICBpZiAoXG4gICAgcGFyc2VkSHJlZi5wcm90b2NvbCA9PT0gcGFyc2VkRnJvbS5wcm90b2NvbCAmJlxuICAgIHBhcnNlZEhyZWYuaG9zdCA9PT0gcGFyc2VkRnJvbS5ob3N0XG4gICkge1xuICAgIGZyb20gPSBwYXJzZWRGcm9tLnBhdGggKyAocGFyc2VkRnJvbS5oYXNoIHx8ICcnKTtcbiAgfVxuICB0aGlzLnRlbGVtZXRlci5jYXB0dXJlTmF2aWdhdGlvbihmcm9tLCB0bywgXy5ub3coKSk7XG59O1xuXG5JbnN0cnVtZW50ZXIucHJvdG90eXBlLmRlaW5zdHJ1bWVudENvbm5lY3Rpdml0eSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKCEoJ2FkZEV2ZW50TGlzdGVuZXInIGluIHRoaXMuX3dpbmRvdyB8fCAnYm9keScgaW4gdGhpcy5fZG9jdW1lbnQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICh0aGlzLl93aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXJzKCdjb25uZWN0aXZpdHknKTtcbiAgfSBlbHNlIHtcbiAgICByZXN0b3JlKHRoaXMucmVwbGFjZW1lbnRzLCAnY29ubmVjdGl2aXR5Jyk7XG4gIH1cbn07XG5cbkluc3RydW1lbnRlci5wcm90b3R5cGUuaW5zdHJ1bWVudENvbm5lY3Rpdml0eSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKCEoJ2FkZEV2ZW50TGlzdGVuZXInIGluIHRoaXMuX3dpbmRvdyB8fCAnYm9keScgaW4gdGhpcy5fZG9jdW1lbnQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICh0aGlzLl93aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgIHRoaXMuYWRkTGlzdGVuZXIoXG4gICAgICAnY29ubmVjdGl2aXR5JyxcbiAgICAgIHRoaXMuX3dpbmRvdyxcbiAgICAgICdvbmxpbmUnLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnRlbGVtZXRlci5jYXB0dXJlQ29ubmVjdGl2aXR5Q2hhbmdlKCdvbmxpbmUnKTtcbiAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgIHRydWUsXG4gICAgKTtcbiAgICB0aGlzLmFkZExpc3RlbmVyKFxuICAgICAgJ2Nvbm5lY3Rpdml0eScsXG4gICAgICB0aGlzLl93aW5kb3csXG4gICAgICAnb2ZmbGluZScsXG4gICAgICB1bmRlZmluZWQsXG4gICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudGVsZW1ldGVyLmNhcHR1cmVDb25uZWN0aXZpdHlDaGFuZ2UoJ29mZmxpbmUnKTtcbiAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgIHRydWUsXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmVwbGFjZShcbiAgICAgIHRoaXMuX2RvY3VtZW50LmJvZHksXG4gICAgICAnb25vbmxpbmUnLFxuICAgICAgZnVuY3Rpb24gKG9yaWcpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLnRlbGVtZXRlci5jYXB0dXJlQ29ubmVjdGl2aXR5Q2hhbmdlKCdvbmxpbmUnKTtcbiAgICAgICAgICBpZiAob3JpZykge1xuICAgICAgICAgICAgb3JpZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICB0aGlzLnJlcGxhY2VtZW50cyxcbiAgICAgICdjb25uZWN0aXZpdHknLFxuICAgICk7XG4gICAgcmVwbGFjZShcbiAgICAgIHRoaXMuX2RvY3VtZW50LmJvZHksXG4gICAgICAnb25vZmZsaW5lJyxcbiAgICAgIGZ1bmN0aW9uIChvcmlnKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi50ZWxlbWV0ZXIuY2FwdHVyZUNvbm5lY3Rpdml0eUNoYW5nZSgnb2ZmbGluZScpO1xuICAgICAgICAgIGlmIChvcmlnKSB7XG4gICAgICAgICAgICBvcmlnLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIHRoaXMucmVwbGFjZW1lbnRzLFxuICAgICAgJ2Nvbm5lY3Rpdml0eScsXG4gICAgKTtcbiAgfVxufTtcblxuSW5zdHJ1bWVudGVyLnByb3RvdHlwZS5oYW5kbGVDc3BFdmVudCA9IGZ1bmN0aW9uIChjc3BFdmVudCkge1xuICB2YXIgbWVzc2FnZSA9XG4gICAgJ1NlY3VyaXR5IFBvbGljeSBWaW9sYXRpb246ICcgK1xuICAgICdibG9ja2VkVVJJOiAnICtcbiAgICBjc3BFdmVudC5ibG9ja2VkVVJJICtcbiAgICAnLCAnICtcbiAgICAndmlvbGF0ZWREaXJlY3RpdmU6ICcgK1xuICAgIGNzcEV2ZW50LnZpb2xhdGVkRGlyZWN0aXZlICtcbiAgICAnLCAnICtcbiAgICAnZWZmZWN0aXZlRGlyZWN0aXZlOiAnICtcbiAgICBjc3BFdmVudC5lZmZlY3RpdmVEaXJlY3RpdmUgK1xuICAgICcsICc7XG5cbiAgaWYgKGNzcEV2ZW50LnNvdXJjZUZpbGUpIHtcbiAgICBtZXNzYWdlICs9XG4gICAgICAnbG9jYXRpb246ICcgK1xuICAgICAgY3NwRXZlbnQuc291cmNlRmlsZSArXG4gICAgICAnLCAnICtcbiAgICAgICdsaW5lOiAnICtcbiAgICAgIGNzcEV2ZW50LmxpbmVOdW1iZXIgK1xuICAgICAgJywgJyArXG4gICAgICAnY29sOiAnICtcbiAgICAgIGNzcEV2ZW50LmNvbHVtbk51bWJlciArXG4gICAgICAnLCAnO1xuICB9XG5cbiAgbWVzc2FnZSArPSAnb3JpZ2luYWxQb2xpY3k6ICcgKyBjc3BFdmVudC5vcmlnaW5hbFBvbGljeTtcblxuICB0aGlzLnRlbGVtZXRlci5jYXB0dXJlTG9nKG1lc3NhZ2UsICdlcnJvcicsIG51bGwsIF8ubm93KCkpO1xuICB0aGlzLmhhbmRsZUNzcEVycm9yKG1lc3NhZ2UpO1xufTtcblxuSW5zdHJ1bWVudGVyLnByb3RvdHlwZS5oYW5kbGVDc3BFcnJvciA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gIGlmICh0aGlzLmF1dG9JbnN0cnVtZW50LmVycm9yT25Db250ZW50U2VjdXJpdHlQb2xpY3kpIHtcbiAgICB0aGlzLnJvbGxiYXIuZXJyb3IobWVzc2FnZSk7XG4gIH1cbn07XG5cbkluc3RydW1lbnRlci5wcm90b3R5cGUuZGVpbnN0cnVtZW50Q29udGVudFNlY3VyaXR5UG9saWN5ID0gZnVuY3Rpb24gKCkge1xuICBpZiAoISgnYWRkRXZlbnRMaXN0ZW5lcicgaW4gdGhpcy5fZG9jdW1lbnQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5yZW1vdmVMaXN0ZW5lcnMoJ2NvbnRlbnRzZWN1cml0eXBvbGljeScpO1xufTtcblxuSW5zdHJ1bWVudGVyLnByb3RvdHlwZS5pbnN0cnVtZW50Q29udGVudFNlY3VyaXR5UG9saWN5ID0gZnVuY3Rpb24gKCkge1xuICBpZiAoISgnYWRkRXZlbnRMaXN0ZW5lcicgaW4gdGhpcy5fZG9jdW1lbnQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGNzcEhhbmRsZXIgPSB0aGlzLmhhbmRsZUNzcEV2ZW50LmJpbmQodGhpcyk7XG4gIHRoaXMuYWRkTGlzdGVuZXIoXG4gICAgJ2NvbnRlbnRzZWN1cml0eXBvbGljeScsXG4gICAgdGhpcy5fZG9jdW1lbnQsXG4gICAgJ3NlY3VyaXR5cG9saWN5dmlvbGF0aW9uJyxcbiAgICBudWxsLFxuICAgIGNzcEhhbmRsZXIsXG4gICAgZmFsc2UsXG4gICk7XG59O1xuXG5JbnN0cnVtZW50ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24gKFxuICBzZWN0aW9uLFxuICBvYmosXG4gIHR5cGUsXG4gIGFsdFR5cGUsXG4gIGhhbmRsZXIsXG4gIGNhcHR1cmUsXG4pIHtcbiAgaWYgKG9iai5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgb2JqLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgaGFuZGxlciwgY2FwdHVyZSk7XG4gICAgdGhpcy5ldmVudFJlbW92ZXJzW3NlY3Rpb25dLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgb2JqLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgaGFuZGxlciwgY2FwdHVyZSk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoYWx0VHlwZSkge1xuICAgIG9iai5hdHRhY2hFdmVudChhbHRUeXBlLCBoYW5kbGVyKTtcbiAgICB0aGlzLmV2ZW50UmVtb3ZlcnNbc2VjdGlvbl0ucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICBvYmouZGV0YWNoRXZlbnQoYWx0VHlwZSwgaGFuZGxlcik7XG4gICAgfSk7XG4gIH1cbn07XG5cbkluc3RydW1lbnRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXJzID0gZnVuY3Rpb24gKHNlY3Rpb24pIHtcbiAgdmFyIHI7XG4gIHdoaWxlICh0aGlzLmV2ZW50UmVtb3ZlcnNbc2VjdGlvbl0ubGVuZ3RoKSB7XG4gICAgciA9IHRoaXMuZXZlbnRSZW1vdmVyc1tzZWN0aW9uXS5zaGlmdCgpO1xuICAgIHIoKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gX2lzVXJsT2JqZWN0KGlucHV0KSB7XG4gIHJldHVybiB0eXBlb2YgVVJMICE9PSAndW5kZWZpbmVkJyAmJiBpbnB1dCBpbnN0YW5jZW9mIFVSTDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbnN0cnVtZW50ZXI7XG4iLCIvLyBTZWUgaHR0cHM6Ly9ub2RlanMub3JnL2RvY3MvbGF0ZXN0L2FwaS91cmwuaHRtbFxuZnVuY3Rpb24gcGFyc2UodXJsKSB7XG4gIHZhciByZXN1bHQgPSB7XG4gICAgcHJvdG9jb2w6IG51bGwsXG4gICAgYXV0aDogbnVsbCxcbiAgICBob3N0OiBudWxsLFxuICAgIHBhdGg6IG51bGwsXG4gICAgaGFzaDogbnVsbCxcbiAgICBocmVmOiB1cmwsXG4gICAgaG9zdG5hbWU6IG51bGwsXG4gICAgcG9ydDogbnVsbCxcbiAgICBwYXRobmFtZTogbnVsbCxcbiAgICBzZWFyY2g6IG51bGwsXG4gICAgcXVlcnk6IG51bGwsXG4gIH07XG5cbiAgdmFyIGksIGxhc3Q7XG4gIGkgPSB1cmwuaW5kZXhPZignLy8nKTtcbiAgaWYgKGkgIT09IC0xKSB7XG4gICAgcmVzdWx0LnByb3RvY29sID0gdXJsLnN1YnN0cmluZygwLCBpKTtcbiAgICBsYXN0ID0gaSArIDI7XG4gIH0gZWxzZSB7XG4gICAgbGFzdCA9IDA7XG4gIH1cblxuICBpID0gdXJsLmluZGV4T2YoJ0AnLCBsYXN0KTtcbiAgaWYgKGkgIT09IC0xKSB7XG4gICAgcmVzdWx0LmF1dGggPSB1cmwuc3Vic3RyaW5nKGxhc3QsIGkpO1xuICAgIGxhc3QgPSBpICsgMTtcbiAgfVxuXG4gIGkgPSB1cmwuaW5kZXhPZignLycsIGxhc3QpO1xuICBpZiAoaSA9PT0gLTEpIHtcbiAgICBpID0gdXJsLmluZGV4T2YoJz8nLCBsYXN0KTtcbiAgICBpZiAoaSA9PT0gLTEpIHtcbiAgICAgIGkgPSB1cmwuaW5kZXhPZignIycsIGxhc3QpO1xuICAgICAgaWYgKGkgPT09IC0xKSB7XG4gICAgICAgIHJlc3VsdC5ob3N0ID0gdXJsLnN1YnN0cmluZyhsYXN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdC5ob3N0ID0gdXJsLnN1YnN0cmluZyhsYXN0LCBpKTtcbiAgICAgICAgcmVzdWx0Lmhhc2ggPSB1cmwuc3Vic3RyaW5nKGkpO1xuICAgICAgfVxuICAgICAgcmVzdWx0Lmhvc3RuYW1lID0gcmVzdWx0Lmhvc3Quc3BsaXQoJzonKVswXTtcbiAgICAgIHJlc3VsdC5wb3J0ID0gcmVzdWx0Lmhvc3Quc3BsaXQoJzonKVsxXTtcbiAgICAgIGlmIChyZXN1bHQucG9ydCkge1xuICAgICAgICByZXN1bHQucG9ydCA9IHBhcnNlSW50KHJlc3VsdC5wb3J0LCAxMCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQuaG9zdCA9IHVybC5zdWJzdHJpbmcobGFzdCwgaSk7XG4gICAgICByZXN1bHQuaG9zdG5hbWUgPSByZXN1bHQuaG9zdC5zcGxpdCgnOicpWzBdO1xuICAgICAgcmVzdWx0LnBvcnQgPSByZXN1bHQuaG9zdC5zcGxpdCgnOicpWzFdO1xuICAgICAgaWYgKHJlc3VsdC5wb3J0KSB7XG4gICAgICAgIHJlc3VsdC5wb3J0ID0gcGFyc2VJbnQocmVzdWx0LnBvcnQsIDEwKTtcbiAgICAgIH1cbiAgICAgIGxhc3QgPSBpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXN1bHQuaG9zdCA9IHVybC5zdWJzdHJpbmcobGFzdCwgaSk7XG4gICAgcmVzdWx0Lmhvc3RuYW1lID0gcmVzdWx0Lmhvc3Quc3BsaXQoJzonKVswXTtcbiAgICByZXN1bHQucG9ydCA9IHJlc3VsdC5ob3N0LnNwbGl0KCc6JylbMV07XG4gICAgaWYgKHJlc3VsdC5wb3J0KSB7XG4gICAgICByZXN1bHQucG9ydCA9IHBhcnNlSW50KHJlc3VsdC5wb3J0LCAxMCk7XG4gICAgfVxuICAgIGxhc3QgPSBpO1xuICB9XG5cbiAgaSA9IHVybC5pbmRleE9mKCcjJywgbGFzdCk7XG4gIGlmIChpID09PSAtMSkge1xuICAgIHJlc3VsdC5wYXRoID0gdXJsLnN1YnN0cmluZyhsYXN0KTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQucGF0aCA9IHVybC5zdWJzdHJpbmcobGFzdCwgaSk7XG4gICAgcmVzdWx0Lmhhc2ggPSB1cmwuc3Vic3RyaW5nKGkpO1xuICB9XG5cbiAgaWYgKHJlc3VsdC5wYXRoKSB7XG4gICAgdmFyIHBhdGhQYXJ0cyA9IHJlc3VsdC5wYXRoLnNwbGl0KCc/Jyk7XG4gICAgcmVzdWx0LnBhdGhuYW1lID0gcGF0aFBhcnRzWzBdO1xuICAgIHJlc3VsdC5xdWVyeSA9IHBhdGhQYXJ0c1sxXTtcbiAgICByZXN1bHQuc2VhcmNoID0gcmVzdWx0LnF1ZXJ5ID8gJz8nICsgcmVzdWx0LnF1ZXJ5IDogbnVsbDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcGFyc2U6IHBhcnNlLFxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG52YXIgaXNQbGFpbk9iamVjdCA9IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qob2JqKSB7XG4gIGlmICghb2JqIHx8IHRvU3RyLmNhbGwob2JqKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgaGFzT3duQ29uc3RydWN0b3IgPSBoYXNPd24uY2FsbChvYmosICdjb25zdHJ1Y3RvcicpO1xuICB2YXIgaGFzSXNQcm90b3R5cGVPZiA9XG4gICAgb2JqLmNvbnN0cnVjdG9yICYmXG4gICAgb2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSAmJlxuICAgIGhhc093bi5jYWxsKG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsICdpc1Byb3RvdHlwZU9mJyk7XG4gIC8vIE5vdCBvd24gY29uc3RydWN0b3IgcHJvcGVydHkgbXVzdCBiZSBPYmplY3RcbiAgaWYgKG9iai5jb25zdHJ1Y3RvciAmJiAhaGFzT3duQ29uc3RydWN0b3IgJiYgIWhhc0lzUHJvdG90eXBlT2YpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBPd24gcHJvcGVydGllcyBhcmUgZW51bWVyYXRlZCBmaXJzdGx5LCBzbyB0byBzcGVlZCB1cCxcbiAgLy8gaWYgbGFzdCBvbmUgaXMgb3duLCB0aGVuIGFsbCBwcm9wZXJ0aWVzIGFyZSBvd24uXG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIC8qKi9cbiAgfVxuXG4gIHJldHVybiB0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJyB8fCBoYXNPd24uY2FsbChvYmosIGtleSk7XG59O1xuXG5mdW5jdGlvbiBtZXJnZSgpIHtcbiAgdmFyIGksXG4gICAgc3JjLFxuICAgIGNvcHksXG4gICAgY2xvbmUsXG4gICAgbmFtZSxcbiAgICByZXN1bHQgPSB7fSxcbiAgICBjdXJyZW50ID0gbnVsbCxcbiAgICBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGN1cnJlbnQgPSBhcmd1bWVudHNbaV07XG4gICAgaWYgKGN1cnJlbnQgPT0gbnVsbCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgZm9yIChuYW1lIGluIGN1cnJlbnQpIHtcbiAgICAgIHNyYyA9IHJlc3VsdFtuYW1lXTtcbiAgICAgIGNvcHkgPSBjdXJyZW50W25hbWVdO1xuICAgICAgaWYgKHJlc3VsdCAhPT0gY29weSkge1xuICAgICAgICBpZiAoY29weSAmJiBpc1BsYWluT2JqZWN0KGNvcHkpKSB7XG4gICAgICAgICAgY2xvbmUgPSBzcmMgJiYgaXNQbGFpbk9iamVjdChzcmMpID8gc3JjIDoge307XG4gICAgICAgICAgcmVzdWx0W25hbWVdID0gbWVyZ2UoY2xvbmUsIGNvcHkpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb3B5ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IGNvcHk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZTtcbiIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsaXR5Jyk7XG52YXIgdHJhdmVyc2UgPSByZXF1aXJlKCcuL3V0aWxpdHkvdHJhdmVyc2UnKTtcblxuZnVuY3Rpb24gc2NydWIoZGF0YSwgc2NydWJGaWVsZHMsIHNjcnViUGF0aHMpIHtcbiAgc2NydWJGaWVsZHMgPSBzY3J1YkZpZWxkcyB8fCBbXTtcblxuICBpZiAoc2NydWJQYXRocykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NydWJQYXRocy5sZW5ndGg7ICsraSkge1xuICAgICAgc2NydWJQYXRoKGRhdGEsIHNjcnViUGF0aHNbaV0pO1xuICAgIH1cbiAgfVxuXG4gIHZhciBwYXJhbVJlcyA9IF9nZXRTY3J1YkZpZWxkUmVnZXhzKHNjcnViRmllbGRzKTtcbiAgdmFyIHF1ZXJ5UmVzID0gX2dldFNjcnViUXVlcnlQYXJhbVJlZ2V4cyhzY3J1YkZpZWxkcyk7XG5cbiAgZnVuY3Rpb24gcmVkYWN0UXVlcnlQYXJhbShkdW1teTAsIHBhcmFtUGFydCkge1xuICAgIHJldHVybiBwYXJhbVBhcnQgKyBfLnJlZGFjdCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyYW1TY3J1YmJlcih2KSB7XG4gICAgdmFyIGk7XG4gICAgaWYgKF8uaXNUeXBlKHYsICdzdHJpbmcnKSkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IHF1ZXJ5UmVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHYgPSB2LnJlcGxhY2UocXVlcnlSZXNbaV0sIHJlZGFjdFF1ZXJ5UGFyYW0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHZhbFNjcnViYmVyKGssIHYpIHtcbiAgICB2YXIgaTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgcGFyYW1SZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChwYXJhbVJlc1tpXS50ZXN0KGspKSB7XG4gICAgICAgIHYgPSBfLnJlZGFjdCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHY7XG4gIH1cblxuICBmdW5jdGlvbiBzY3J1YmJlcihrLCB2LCBzZWVuKSB7XG4gICAgdmFyIHRtcFYgPSB2YWxTY3J1YmJlcihrLCB2KTtcbiAgICBpZiAodG1wViA9PT0gdikge1xuICAgICAgaWYgKF8uaXNUeXBlKHYsICdvYmplY3QnKSB8fCBfLmlzVHlwZSh2LCAnYXJyYXknKSkge1xuICAgICAgICByZXR1cm4gdHJhdmVyc2Uodiwgc2NydWJiZXIsIHNlZW4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcmFtU2NydWJiZXIodG1wVik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0bXBWO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cmF2ZXJzZShkYXRhLCBzY3J1YmJlcik7XG59XG5cbmZ1bmN0aW9uIHNjcnViUGF0aChvYmosIHBhdGgpIHtcbiAgdmFyIGtleXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gIHZhciBsYXN0ID0ga2V5cy5sZW5ndGggLSAxO1xuICB0cnkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IGxhc3Q7ICsraSkge1xuICAgICAgaWYgKGkgPCBsYXN0KSB7XG4gICAgICAgIG9iaiA9IG9ialtrZXlzW2ldXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9ialtrZXlzW2ldXSA9IF8ucmVkYWN0KCk7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gTWlzc2luZyBrZXkgaXMgT0s7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2dldFNjcnViRmllbGRSZWdleHMoc2NydWJGaWVsZHMpIHtcbiAgdmFyIHJldCA9IFtdO1xuICB2YXIgcGF0O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHNjcnViRmllbGRzLmxlbmd0aDsgKytpKSB7XG4gICAgcGF0ID0gJ15cXFxcWz8oJTVbYkJdKT8nICsgc2NydWJGaWVsZHNbaV0gKyAnXFxcXFs/KCU1W2JCXSk/XFxcXF0/KCU1W2REXSk/JCc7XG4gICAgcmV0LnB1c2gobmV3IFJlZ0V4cChwYXQsICdpJykpO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIF9nZXRTY3J1YlF1ZXJ5UGFyYW1SZWdleHMoc2NydWJGaWVsZHMpIHtcbiAgdmFyIHJldCA9IFtdO1xuICB2YXIgcGF0O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHNjcnViRmllbGRzLmxlbmd0aDsgKytpKSB7XG4gICAgcGF0ID0gJ1xcXFxbPyglNVtiQl0pPycgKyBzY3J1YkZpZWxkc1tpXSArICdcXFxcWz8oJTVbYkJdKT9cXFxcXT8oJTVbZERdKT8nO1xuICAgIHJldC5wdXNoKG5ldyBSZWdFeHAoJygnICsgcGF0ICsgJz0pKFteJlxcXFxuXSspJywgJ2lnbScpKTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNjcnViO1xuIiwidmFyIG1lcmdlID0gcmVxdWlyZSgnLi9tZXJnZScpO1xuXG52YXIgUm9sbGJhckpTT04gPSB7fTtcbmZ1bmN0aW9uIHNldHVwSlNPTihwb2x5ZmlsbEpTT04pIHtcbiAgaWYgKGlzRnVuY3Rpb24oUm9sbGJhckpTT04uc3RyaW5naWZ5KSAmJiBpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnBhcnNlKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChpc0RlZmluZWQoSlNPTikpIHtcbiAgICAvLyBJZiBwb2x5ZmlsbCBpcyBwcm92aWRlZCwgcHJlZmVyIGl0IG92ZXIgZXhpc3Rpbmcgbm9uLW5hdGl2ZSBzaGltcy5cbiAgICBpZiAocG9seWZpbGxKU09OKSB7XG4gICAgICBpZiAoaXNOYXRpdmVGdW5jdGlvbihKU09OLnN0cmluZ2lmeSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04uc3RyaW5naWZ5ID0gSlNPTi5zdHJpbmdpZnk7XG4gICAgICB9XG4gICAgICBpZiAoaXNOYXRpdmVGdW5jdGlvbihKU09OLnBhcnNlKSkge1xuICAgICAgICBSb2xsYmFySlNPTi5wYXJzZSA9IEpTT04ucGFyc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGVsc2UgYWNjZXB0IGFueSBpbnRlcmZhY2UgdGhhdCBpcyBwcmVzZW50LlxuICAgICAgaWYgKGlzRnVuY3Rpb24oSlNPTi5zdHJpbmdpZnkpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnN0cmluZ2lmeSA9IEpTT04uc3RyaW5naWZ5O1xuICAgICAgfVxuICAgICAgaWYgKGlzRnVuY3Rpb24oSlNPTi5wYXJzZSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04ucGFyc2UgPSBKU09OLnBhcnNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoIWlzRnVuY3Rpb24oUm9sbGJhckpTT04uc3RyaW5naWZ5KSB8fCAhaXNGdW5jdGlvbihSb2xsYmFySlNPTi5wYXJzZSkpIHtcbiAgICBwb2x5ZmlsbEpTT04gJiYgcG9seWZpbGxKU09OKFJvbGxiYXJKU09OKTtcbiAgfVxufVxuXG4vKlxuICogaXNUeXBlIC0gR2l2ZW4gYSBKYXZhc2NyaXB0IHZhbHVlIGFuZCBhIHN0cmluZywgcmV0dXJucyB0cnVlIGlmIHRoZSB0eXBlIG9mIHRoZSB2YWx1ZSBtYXRjaGVzIHRoZVxuICogZ2l2ZW4gc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB4IC0gYW55IHZhbHVlXG4gKiBAcGFyYW0gdCAtIGEgbG93ZXJjYXNlIHN0cmluZyBjb250YWluaW5nIG9uZSBvZiB0aGUgZm9sbG93aW5nIHR5cGUgbmFtZXM6XG4gKiAgICAtIHVuZGVmaW5lZFxuICogICAgLSBudWxsXG4gKiAgICAtIGVycm9yXG4gKiAgICAtIG51bWJlclxuICogICAgLSBib29sZWFuXG4gKiAgICAtIHN0cmluZ1xuICogICAgLSBzeW1ib2xcbiAqICAgIC0gZnVuY3Rpb25cbiAqICAgIC0gb2JqZWN0XG4gKiAgICAtIGFycmF5XG4gKiBAcmV0dXJucyB0cnVlIGlmIHggaXMgb2YgdHlwZSB0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNUeXBlKHgsIHQpIHtcbiAgcmV0dXJuIHQgPT09IHR5cGVOYW1lKHgpO1xufVxuXG4vKlxuICogdHlwZU5hbWUgLSBHaXZlbiBhIEphdmFzY3JpcHQgdmFsdWUsIHJldHVybnMgdGhlIHR5cGUgb2YgdGhlIG9iamVjdCBhcyBhIHN0cmluZ1xuICovXG5mdW5jdGlvbiB0eXBlTmFtZSh4KSB7XG4gIHZhciBuYW1lID0gdHlwZW9mIHg7XG4gIGlmIChuYW1lICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBuYW1lO1xuICB9XG4gIGlmICgheCkge1xuICAgIHJldHVybiAnbnVsbCc7XG4gIH1cbiAgaWYgKHggaW5zdGFuY2VvZiBFcnJvcikge1xuICAgIHJldHVybiAnZXJyb3InO1xuICB9XG4gIHJldHVybiB7fS50b1N0cmluZ1xuICAgIC5jYWxsKHgpXG4gICAgLm1hdGNoKC9cXHMoW2EtekEtWl0rKS8pWzFdXG4gICAgLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8qIGlzRnVuY3Rpb24gLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIGEgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0gZiAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBmIGlzIGEgZnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGYpIHtcbiAgcmV0dXJuIGlzVHlwZShmLCAnZnVuY3Rpb24nKTtcbn1cblxuLyogaXNOYXRpdmVGdW5jdGlvbiAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgYSBuYXRpdmUgSlMgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0gZiAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBmIGlzIGEgbmF0aXZlIEpTIGZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOYXRpdmVGdW5jdGlvbihmKSB7XG4gIHZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG4gIHZhciBmdW5jTWF0Y2hTdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmdcbiAgICAuY2FsbChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KVxuICAgIC5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gICAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpO1xuICB2YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgKyBmdW5jTWF0Y2hTdHJpbmcgKyAnJCcpO1xuICByZXR1cm4gaXNPYmplY3QoZikgJiYgcmVJc05hdGl2ZS50ZXN0KGYpO1xufVxuXG4vKiBpc09iamVjdCAtIENoZWNrcyBpZiB0aGUgYXJndW1lbnQgaXMgYW4gb2JqZWN0XG4gKlxuICogQHBhcmFtIHZhbHVlIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlzIHZhbHVlIGlzIGFuIG9iamVjdCBmdW5jdGlvbiBpcyBhbiBvYmplY3QpXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKiBpc1N0cmluZyAtIENoZWNrcyBpZiB0aGUgYXJndW1lbnQgaXMgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0gdmFsdWUgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgdmFsdWUgaXMgYSBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgdmFsdWUgaW5zdGFuY2VvZiBTdHJpbmc7XG59XG5cbi8qKlxuICogaXNGaW5pdGVOdW1iZXIgLSBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBhIGZpbml0ZSBudW1iZXJcbiAqXG4gKiBAcGFyYW0geyp9IG4gLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgdmFsdWUgaXMgYSBmaW5pdGUgbnVtYmVyXG4gKi9cbmZ1bmN0aW9uIGlzRmluaXRlTnVtYmVyKG4pIHtcbiAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZShuKTtcbn1cblxuLypcbiAqIGlzRGVmaW5lZCAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgbm90IGVxdWFsIHRvIHVuZGVmaW5lZFxuICpcbiAqIEBwYXJhbSB1IC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIHUgaXMgYW55dGhpbmcgb3RoZXIgdGhhbiB1bmRlZmluZWRcbiAqL1xuZnVuY3Rpb24gaXNEZWZpbmVkKHUpIHtcbiAgcmV0dXJuICFpc1R5cGUodSwgJ3VuZGVmaW5lZCcpO1xufVxuXG4vKlxuICogaXNJdGVyYWJsZSAtIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGNhbiBiZSBpdGVyYXRlZCwgZXNzZW50aWFsbHlcbiAqIHdoZXRoZXIgaXQgaXMgYW4gb2JqZWN0IG9yIGFuIGFycmF5LlxuICpcbiAqIEBwYXJhbSBpIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGkgaXMgYW4gb2JqZWN0IG9yIGFuIGFycmF5IGFzIGRldGVybWluZWQgYnkgYHR5cGVOYW1lYFxuICovXG5mdW5jdGlvbiBpc0l0ZXJhYmxlKGkpIHtcbiAgdmFyIHR5cGUgPSB0eXBlTmFtZShpKTtcbiAgcmV0dXJuIHR5cGUgPT09ICdvYmplY3QnIHx8IHR5cGUgPT09ICdhcnJheSc7XG59XG5cbi8qXG4gKiBpc0Vycm9yIC0gY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgb2YgYW4gZXJyb3IgdHlwZVxuICpcbiAqIEBwYXJhbSBlIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGUgaXMgYW4gZXJyb3JcbiAqL1xuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIC8vIERldGVjdCBib3RoIEVycm9yIGFuZCBGaXJlZm94IEV4Y2VwdGlvbiB0eXBlXG4gIHJldHVybiBpc1R5cGUoZSwgJ2Vycm9yJykgfHwgaXNUeXBlKGUsICdleGNlcHRpb24nKTtcbn1cblxuLyogaXNQcm9taXNlIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBhIHByb21pc2VcbiAqXG4gKiBAcGFyYW0gcCAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBmIGlzIGEgZnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1Byb21pc2UocCkge1xuICByZXR1cm4gaXNPYmplY3QocCkgJiYgaXNUeXBlKHAudGhlbiwgJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogaXNCcm93c2VyIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgdGhlIGNvZGUgaXMgcnVubmluZyBpbiBhIGJyb3dzZXJcbiAqXG4gKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBjb2RlIGlzIHJ1bm5pbmcgaW4gYSBicm93c2VyIGVudmlyb25tZW50XG4gKi9cbmZ1bmN0aW9uIGlzQnJvd3NlcigpIHtcbiAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xufVxuXG5mdW5jdGlvbiByZWRhY3QoKSB7XG4gIHJldHVybiAnKioqKioqKionO1xufVxuXG4vLyBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzg4MDk0NzIvMTEzODE5MVxuZnVuY3Rpb24gdXVpZDQoKSB7XG4gIHZhciBkID0gbm93KCk7XG4gIHZhciB1dWlkID0gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZShcbiAgICAvW3h5XS9nLFxuICAgIGZ1bmN0aW9uIChjKSB7XG4gICAgICB2YXIgciA9IChkICsgTWF0aC5yYW5kb20oKSAqIDE2KSAlIDE2IHwgMDtcbiAgICAgIGQgPSBNYXRoLmZsb29yKGQgLyAxNik7XG4gICAgICByZXR1cm4gKGMgPT09ICd4JyA/IHIgOiAociAmIDB4NykgfCAweDgpLnRvU3RyaW5nKDE2KTtcbiAgICB9LFxuICApO1xuICByZXR1cm4gdXVpZDtcbn1cblxudmFyIExFVkVMUyA9IHtcbiAgZGVidWc6IDAsXG4gIGluZm86IDEsXG4gIHdhcm5pbmc6IDIsXG4gIGVycm9yOiAzLFxuICBjcml0aWNhbDogNCxcbn07XG5cbmZ1bmN0aW9uIHNhbml0aXplVXJsKHVybCkge1xuICB2YXIgYmFzZVVybFBhcnRzID0gcGFyc2VVcmkodXJsKTtcbiAgaWYgKCFiYXNlVXJsUGFydHMpIHtcbiAgICByZXR1cm4gJyh1bmtub3duKSc7XG4gIH1cblxuICAvLyByZW1vdmUgYSB0cmFpbGluZyAjIGlmIHRoZXJlIGlzIG5vIGFuY2hvclxuICBpZiAoYmFzZVVybFBhcnRzLmFuY2hvciA9PT0gJycpIHtcbiAgICBiYXNlVXJsUGFydHMuc291cmNlID0gYmFzZVVybFBhcnRzLnNvdXJjZS5yZXBsYWNlKCcjJywgJycpO1xuICB9XG5cbiAgdXJsID0gYmFzZVVybFBhcnRzLnNvdXJjZS5yZXBsYWNlKCc/JyArIGJhc2VVcmxQYXJ0cy5xdWVyeSwgJycpO1xuICByZXR1cm4gdXJsO1xufVxuXG52YXIgcGFyc2VVcmlPcHRpb25zID0ge1xuICBzdHJpY3RNb2RlOiBmYWxzZSxcbiAga2V5OiBbXG4gICAgJ3NvdXJjZScsXG4gICAgJ3Byb3RvY29sJyxcbiAgICAnYXV0aG9yaXR5JyxcbiAgICAndXNlckluZm8nLFxuICAgICd1c2VyJyxcbiAgICAncGFzc3dvcmQnLFxuICAgICdob3N0JyxcbiAgICAncG9ydCcsXG4gICAgJ3JlbGF0aXZlJyxcbiAgICAncGF0aCcsXG4gICAgJ2RpcmVjdG9yeScsXG4gICAgJ2ZpbGUnLFxuICAgICdxdWVyeScsXG4gICAgJ2FuY2hvcicsXG4gIF0sXG4gIHE6IHtcbiAgICBuYW1lOiAncXVlcnlLZXknLFxuICAgIHBhcnNlcjogLyg/Ol58JikoW14mPV0qKT0/KFteJl0qKS9nLFxuICB9LFxuICBwYXJzZXI6IHtcbiAgICBzdHJpY3Q6XG4gICAgICAvXig/OihbXjpcXC8/I10rKTopPyg/OlxcL1xcLygoPzooKFteOkBdKikoPzo6KFteOkBdKikpPyk/QCk/KFteOlxcLz8jXSopKD86OihcXGQqKSk/KSk/KCgoKD86W14/I1xcL10qXFwvKSopKFtePyNdKikpKD86XFw/KFteI10qKSk/KD86IyguKikpPykvLFxuICAgIGxvb3NlOlxuICAgICAgL14oPzooPyFbXjpAXSs6W146QFxcL10qQCkoW146XFwvPyMuXSspOik/KD86XFwvXFwvKT8oKD86KChbXjpAXSopKD86OihbXjpAXSopKT8pP0ApPyhbXjpcXC8/I10qKSg/OjooXFxkKikpPykoKChcXC8oPzpbXj8jXSg/IVtePyNcXC9dKlxcLltePyNcXC8uXSsoPzpbPyNdfCQpKSkqXFwvPyk/KFtePyNcXC9dKikpKD86XFw/KFteI10qKSk/KD86IyguKikpPykvLFxuICB9LFxufTtcblxuZnVuY3Rpb24gcGFyc2VVcmkoc3RyKSB7XG4gIGlmICghaXNUeXBlKHN0ciwgJ3N0cmluZycpKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHZhciBvID0gcGFyc2VVcmlPcHRpb25zO1xuICB2YXIgbSA9IG8ucGFyc2VyW28uc3RyaWN0TW9kZSA/ICdzdHJpY3QnIDogJ2xvb3NlJ10uZXhlYyhzdHIpO1xuICB2YXIgdXJpID0ge307XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBvLmtleS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICB1cmlbby5rZXlbaV1dID0gbVtpXSB8fCAnJztcbiAgfVxuXG4gIHVyaVtvLnEubmFtZV0gPSB7fTtcbiAgdXJpW28ua2V5WzEyXV0ucmVwbGFjZShvLnEucGFyc2VyLCBmdW5jdGlvbiAoJDAsICQxLCAkMikge1xuICAgIGlmICgkMSkge1xuICAgICAgdXJpW28ucS5uYW1lXVskMV0gPSAkMjtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB1cmk7XG59XG5cbmZ1bmN0aW9uIGFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoKGFjY2Vzc1Rva2VuLCBvcHRpb25zLCBwYXJhbXMpIHtcbiAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICBwYXJhbXMuYWNjZXNzX3Rva2VuID0gYWNjZXNzVG9rZW47XG4gIHZhciBwYXJhbXNBcnJheSA9IFtdO1xuICB2YXIgaztcbiAgZm9yIChrIGluIHBhcmFtcykge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyYW1zLCBrKSkge1xuICAgICAgcGFyYW1zQXJyYXkucHVzaChbaywgcGFyYW1zW2tdXS5qb2luKCc9JykpO1xuICAgIH1cbiAgfVxuICB2YXIgcXVlcnkgPSAnPycgKyBwYXJhbXNBcnJheS5zb3J0KCkuam9pbignJicpO1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBvcHRpb25zLnBhdGggPSBvcHRpb25zLnBhdGggfHwgJyc7XG4gIHZhciBxcyA9IG9wdGlvbnMucGF0aC5pbmRleE9mKCc/Jyk7XG4gIHZhciBoID0gb3B0aW9ucy5wYXRoLmluZGV4T2YoJyMnKTtcbiAgdmFyIHA7XG4gIGlmIChxcyAhPT0gLTEgJiYgKGggPT09IC0xIHx8IGggPiBxcykpIHtcbiAgICBwID0gb3B0aW9ucy5wYXRoO1xuICAgIG9wdGlvbnMucGF0aCA9IHAuc3Vic3RyaW5nKDAsIHFzKSArIHF1ZXJ5ICsgJyYnICsgcC5zdWJzdHJpbmcocXMgKyAxKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoaCAhPT0gLTEpIHtcbiAgICAgIHAgPSBvcHRpb25zLnBhdGg7XG4gICAgICBvcHRpb25zLnBhdGggPSBwLnN1YnN0cmluZygwLCBoKSArIHF1ZXJ5ICsgcC5zdWJzdHJpbmcoaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMucGF0aCA9IG9wdGlvbnMucGF0aCArIHF1ZXJ5O1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBmb3JtYXRVcmwodSwgcHJvdG9jb2wpIHtcbiAgcHJvdG9jb2wgPSBwcm90b2NvbCB8fCB1LnByb3RvY29sO1xuICBpZiAoIXByb3RvY29sICYmIHUucG9ydCkge1xuICAgIGlmICh1LnBvcnQgPT09IDgwKSB7XG4gICAgICBwcm90b2NvbCA9ICdodHRwOic7XG4gICAgfSBlbHNlIGlmICh1LnBvcnQgPT09IDQ0Mykge1xuICAgICAgcHJvdG9jb2wgPSAnaHR0cHM6JztcbiAgICB9XG4gIH1cbiAgcHJvdG9jb2wgPSBwcm90b2NvbCB8fCAnaHR0cHM6JztcblxuICBpZiAoIXUuaG9zdG5hbWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2YXIgcmVzdWx0ID0gcHJvdG9jb2wgKyAnLy8nICsgdS5ob3N0bmFtZTtcbiAgaWYgKHUucG9ydCkge1xuICAgIHJlc3VsdCA9IHJlc3VsdCArICc6JyArIHUucG9ydDtcbiAgfVxuICBpZiAodS5wYXRoKSB7XG4gICAgcmVzdWx0ID0gcmVzdWx0ICsgdS5wYXRoO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeShvYmosIGJhY2t1cCkge1xuICB2YXIgdmFsdWUsIGVycm9yO1xuICB0cnkge1xuICAgIHZhbHVlID0gUm9sbGJhckpTT04uc3RyaW5naWZ5KG9iaik7XG4gIH0gY2F0Y2ggKGpzb25FcnJvcikge1xuICAgIGlmIChiYWNrdXAgJiYgaXNGdW5jdGlvbihiYWNrdXApKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IGJhY2t1cChvYmopO1xuICAgICAgfSBjYXRjaCAoYmFja3VwRXJyb3IpIHtcbiAgICAgICAgZXJyb3IgPSBiYWNrdXBFcnJvcjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZXJyb3IgPSBqc29uRXJyb3I7XG4gICAgfVxuICB9XG4gIHJldHVybiB7IGVycm9yOiBlcnJvciwgdmFsdWU6IHZhbHVlIH07XG59XG5cbmZ1bmN0aW9uIG1heEJ5dGVTaXplKHN0cmluZykge1xuICAvLyBUaGUgdHJhbnNwb3J0IHdpbGwgdXNlIHV0Zi04LCBzbyBhc3N1bWUgdXRmLTggZW5jb2RpbmcuXG4gIC8vXG4gIC8vIFRoaXMgbWluaW1hbCBpbXBsZW1lbnRhdGlvbiB3aWxsIGFjY3VyYXRlbHkgY291bnQgYnl0ZXMgZm9yIGFsbCBVQ1MtMiBhbmRcbiAgLy8gc2luZ2xlIGNvZGUgcG9pbnQgVVRGLTE2LiBJZiBwcmVzZW50ZWQgd2l0aCBtdWx0aSBjb2RlIHBvaW50IFVURi0xNixcbiAgLy8gd2hpY2ggc2hvdWxkIGJlIHJhcmUsIGl0IHdpbGwgc2FmZWx5IG92ZXJjb3VudCwgbm90IHVuZGVyY291bnQuXG4gIC8vXG4gIC8vIFdoaWxlIHJvYnVzdCB1dGYtOCBlbmNvZGVycyBleGlzdCwgdGhpcyBpcyBmYXIgc21hbGxlciBhbmQgZmFyIG1vcmUgcGVyZm9ybWFudC5cbiAgLy8gRm9yIHF1aWNrbHkgY291bnRpbmcgcGF5bG9hZCBzaXplIGZvciB0cnVuY2F0aW9uLCBzbWFsbGVyIGlzIGJldHRlci5cblxuICB2YXIgY291bnQgPSAwO1xuICB2YXIgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGNvZGUgPSBzdHJpbmcuY2hhckNvZGVBdChpKTtcbiAgICBpZiAoY29kZSA8IDEyOCkge1xuICAgICAgLy8gdXAgdG8gNyBiaXRzXG4gICAgICBjb3VudCA9IGNvdW50ICsgMTtcbiAgICB9IGVsc2UgaWYgKGNvZGUgPCAyMDQ4KSB7XG4gICAgICAvLyB1cCB0byAxMSBiaXRzXG4gICAgICBjb3VudCA9IGNvdW50ICsgMjtcbiAgICB9IGVsc2UgaWYgKGNvZGUgPCA2NTUzNikge1xuICAgICAgLy8gdXAgdG8gMTYgYml0c1xuICAgICAgY291bnQgPSBjb3VudCArIDM7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvdW50O1xufVxuXG5mdW5jdGlvbiBqc29uUGFyc2Uocykge1xuICB2YXIgdmFsdWUsIGVycm9yO1xuICB0cnkge1xuICAgIHZhbHVlID0gUm9sbGJhckpTT04ucGFyc2Uocyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBlcnJvciA9IGU7XG4gIH1cbiAgcmV0dXJuIHsgZXJyb3I6IGVycm9yLCB2YWx1ZTogdmFsdWUgfTtcbn1cblxuZnVuY3Rpb24gbWFrZVVuaGFuZGxlZFN0YWNrSW5mbyhcbiAgbWVzc2FnZSxcbiAgdXJsLFxuICBsaW5lbm8sXG4gIGNvbG5vLFxuICBlcnJvcixcbiAgbW9kZSxcbiAgYmFja3VwTWVzc2FnZSxcbiAgZXJyb3JQYXJzZXIsXG4pIHtcbiAgdmFyIGxvY2F0aW9uID0ge1xuICAgIHVybDogdXJsIHx8ICcnLFxuICAgIGxpbmU6IGxpbmVubyxcbiAgICBjb2x1bW46IGNvbG5vLFxuICB9O1xuICBsb2NhdGlvbi5mdW5jID0gZXJyb3JQYXJzZXIuZ3Vlc3NGdW5jdGlvbk5hbWUobG9jYXRpb24udXJsLCBsb2NhdGlvbi5saW5lKTtcbiAgbG9jYXRpb24uY29udGV4dCA9IGVycm9yUGFyc2VyLmdhdGhlckNvbnRleHQobG9jYXRpb24udXJsLCBsb2NhdGlvbi5saW5lKTtcbiAgdmFyIGhyZWYgPVxuICAgIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICBkb2N1bWVudCAmJlxuICAgIGRvY3VtZW50LmxvY2F0aW9uICYmXG4gICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZjtcbiAgdmFyIHVzZXJhZ2VudCA9XG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB3aW5kb3cgJiZcbiAgICB3aW5kb3cubmF2aWdhdG9yICYmXG4gICAgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gIHJldHVybiB7XG4gICAgbW9kZTogbW9kZSxcbiAgICBtZXNzYWdlOiBlcnJvciA/IFN0cmluZyhlcnJvcikgOiBtZXNzYWdlIHx8IGJhY2t1cE1lc3NhZ2UsXG4gICAgdXJsOiBocmVmLFxuICAgIHN0YWNrOiBbbG9jYXRpb25dLFxuICAgIHVzZXJhZ2VudDogdXNlcmFnZW50LFxuICB9O1xufVxuXG5mdW5jdGlvbiB3cmFwQ2FsbGJhY2sobG9nZ2VyLCBmKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgdHJ5IHtcbiAgICAgIGYoZXJyLCByZXNwKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoZSk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBub25DaXJjdWxhckNsb25lKG9iaikge1xuICB2YXIgc2VlbiA9IFtvYmpdO1xuXG4gIGZ1bmN0aW9uIGNsb25lKG9iaiwgc2Vlbikge1xuICAgIHZhciB2YWx1ZSxcbiAgICAgIG5hbWUsXG4gICAgICBuZXdTZWVuLFxuICAgICAgcmVzdWx0ID0ge307XG5cbiAgICB0cnkge1xuICAgICAgZm9yIChuYW1lIGluIG9iaikge1xuICAgICAgICB2YWx1ZSA9IG9ialtuYW1lXTtcblxuICAgICAgICBpZiAodmFsdWUgJiYgKGlzVHlwZSh2YWx1ZSwgJ29iamVjdCcpIHx8IGlzVHlwZSh2YWx1ZSwgJ2FycmF5JykpKSB7XG4gICAgICAgICAgaWYgKHNlZW4uaW5jbHVkZXModmFsdWUpKSB7XG4gICAgICAgICAgICByZXN1bHRbbmFtZV0gPSAnUmVtb3ZlZCBjaXJjdWxhciByZWZlcmVuY2U6ICcgKyB0eXBlTmFtZSh2YWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld1NlZW4gPSBzZWVuLnNsaWNlKCk7XG4gICAgICAgICAgICBuZXdTZWVuLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgcmVzdWx0W25hbWVdID0gY2xvbmUodmFsdWUsIG5ld1NlZW4pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdFtuYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlc3VsdCA9ICdGYWlsZWQgY2xvbmluZyBjdXN0b20gZGF0YTogJyArIGUubWVzc2FnZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICByZXR1cm4gY2xvbmUob2JqLCBzZWVuKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlSXRlbShhcmdzLCBsb2dnZXIsIG5vdGlmaWVyLCByZXF1ZXN0S2V5cywgbGFtYmRhQ29udGV4dCkge1xuICB2YXIgbWVzc2FnZSwgZXJyLCBjdXN0b20sIGNhbGxiYWNrLCByZXF1ZXN0O1xuICB2YXIgYXJnO1xuICB2YXIgZXh0cmFBcmdzID0gW107XG4gIHZhciBkaWFnbm9zdGljID0ge307XG4gIHZhciBhcmdUeXBlcyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJncy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBhcmcgPSBhcmdzW2ldO1xuXG4gICAgdmFyIHR5cCA9IHR5cGVOYW1lKGFyZyk7XG4gICAgYXJnVHlwZXMucHVzaCh0eXApO1xuICAgIHN3aXRjaCAodHlwKSB7XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIG1lc3NhZ2UgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKG1lc3NhZ2UgPSBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgY2FsbGJhY2sgPSB3cmFwQ2FsbGJhY2sobG9nZ2VyLCBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICBleHRyYUFyZ3MucHVzaChhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgIGNhc2UgJ2RvbWV4Y2VwdGlvbic6XG4gICAgICBjYXNlICdleGNlcHRpb24nOiAvLyBGaXJlZm94IEV4Y2VwdGlvbiB0eXBlXG4gICAgICAgIGVyciA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoZXJyID0gYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgY2FzZSAnYXJyYXknOlxuICAgICAgICBpZiAoXG4gICAgICAgICAgYXJnIGluc3RhbmNlb2YgRXJyb3IgfHxcbiAgICAgICAgICAodHlwZW9mIERPTUV4Y2VwdGlvbiAhPT0gJ3VuZGVmaW5lZCcgJiYgYXJnIGluc3RhbmNlb2YgRE9NRXhjZXB0aW9uKVxuICAgICAgICApIHtcbiAgICAgICAgICBlcnIgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGVyciA9IGFyZyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlcXVlc3RLZXlzICYmIHR5cCA9PT0gJ29iamVjdCcgJiYgIXJlcXVlc3QpIHtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMCwgbGVuID0gcmVxdWVzdEtleXMubGVuZ3RoOyBqIDwgbGVuOyArK2opIHtcbiAgICAgICAgICAgIGlmIChhcmdbcmVxdWVzdEtleXNbal1dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgcmVxdWVzdCA9IGFyZztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXF1ZXN0KSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY3VzdG9tID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChjdXN0b20gPSBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChcbiAgICAgICAgICBhcmcgaW5zdGFuY2VvZiBFcnJvciB8fFxuICAgICAgICAgICh0eXBlb2YgRE9NRXhjZXB0aW9uICE9PSAndW5kZWZpbmVkJyAmJiBhcmcgaW5zdGFuY2VvZiBET01FeGNlcHRpb24pXG4gICAgICAgICkge1xuICAgICAgICAgIGVyciA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoZXJyID0gYXJnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBleHRyYUFyZ3MucHVzaChhcmcpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIGN1c3RvbSBpcyBhbiBhcnJheSB0aGlzIHR1cm5zIGl0IGludG8gYW4gb2JqZWN0IHdpdGggaW50ZWdlciBrZXlzXG4gIGlmIChjdXN0b20pIGN1c3RvbSA9IG5vbkNpcmN1bGFyQ2xvbmUoY3VzdG9tKTtcblxuICBpZiAoZXh0cmFBcmdzLmxlbmd0aCA+IDApIHtcbiAgICBpZiAoIWN1c3RvbSkgY3VzdG9tID0gbm9uQ2lyY3VsYXJDbG9uZSh7fSk7XG4gICAgY3VzdG9tLmV4dHJhQXJncyA9IG5vbkNpcmN1bGFyQ2xvbmUoZXh0cmFBcmdzKTtcbiAgfVxuXG4gIHZhciBpdGVtID0ge1xuICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgZXJyOiBlcnIsXG4gICAgY3VzdG9tOiBjdXN0b20sXG4gICAgdGltZXN0YW1wOiBub3coKSxcbiAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgbm90aWZpZXI6IG5vdGlmaWVyLFxuICAgIGRpYWdub3N0aWM6IGRpYWdub3N0aWMsXG4gICAgdXVpZDogdXVpZDQoKSxcbiAgfTtcblxuICBpdGVtLmRhdGEgPSBpdGVtLmRhdGEgfHwge307XG5cbiAgc2V0Q3VzdG9tSXRlbUtleXMoaXRlbSwgY3VzdG9tKTtcblxuICBpZiAocmVxdWVzdEtleXMgJiYgcmVxdWVzdCkge1xuICAgIGl0ZW0ucmVxdWVzdCA9IHJlcXVlc3Q7XG4gIH1cbiAgaWYgKGxhbWJkYUNvbnRleHQpIHtcbiAgICBpdGVtLmxhbWJkYUNvbnRleHQgPSBsYW1iZGFDb250ZXh0O1xuICB9XG4gIGl0ZW0uX29yaWdpbmFsQXJncyA9IGFyZ3M7XG4gIGl0ZW0uZGlhZ25vc3RpYy5vcmlnaW5hbF9hcmdfdHlwZXMgPSBhcmdUeXBlcztcbiAgcmV0dXJuIGl0ZW07XG59XG5cbmZ1bmN0aW9uIHNldEN1c3RvbUl0ZW1LZXlzKGl0ZW0sIGN1c3RvbSkge1xuICBpZiAoY3VzdG9tICYmIGN1c3RvbS5sZXZlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaXRlbS5sZXZlbCA9IGN1c3RvbS5sZXZlbDtcbiAgICBkZWxldGUgY3VzdG9tLmxldmVsO1xuICB9XG4gIGlmIChjdXN0b20gJiYgY3VzdG9tLnNraXBGcmFtZXMgIT09IHVuZGVmaW5lZCkge1xuICAgIGl0ZW0uc2tpcEZyYW1lcyA9IGN1c3RvbS5za2lwRnJhbWVzO1xuICAgIGRlbGV0ZSBjdXN0b20uc2tpcEZyYW1lcztcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRFcnJvckNvbnRleHQoaXRlbSwgZXJyb3JzKSB7XG4gIHZhciBjdXN0b20gPSBpdGVtLmRhdGEuY3VzdG9tIHx8IHt9O1xuICB2YXIgY29udGV4dEFkZGVkID0gZmFsc2U7XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVycm9ycy5sZW5ndGg7ICsraSkge1xuICAgICAgaWYgKGVycm9yc1tpXS5oYXNPd25Qcm9wZXJ0eSgncm9sbGJhckNvbnRleHQnKSkge1xuICAgICAgICBjdXN0b20gPSBtZXJnZShjdXN0b20sIG5vbkNpcmN1bGFyQ2xvbmUoZXJyb3JzW2ldLnJvbGxiYXJDb250ZXh0KSk7XG4gICAgICAgIGNvbnRleHRBZGRlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXZvaWQgYWRkaW5nIGFuIGVtcHR5IG9iamVjdCB0byB0aGUgZGF0YS5cbiAgICBpZiAoY29udGV4dEFkZGVkKSB7XG4gICAgICBpdGVtLmRhdGEuY3VzdG9tID0gY3VzdG9tO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGl0ZW0uZGlhZ25vc3RpYy5lcnJvcl9jb250ZXh0ID0gJ0ZhaWxlZDogJyArIGUubWVzc2FnZTtcbiAgfVxufVxuXG52YXIgVEVMRU1FVFJZX1RZUEVTID0gW1xuICAnbG9nJyxcbiAgJ25ldHdvcmsnLFxuICAnZG9tJyxcbiAgJ25hdmlnYXRpb24nLFxuICAnZXJyb3InLFxuICAnbWFudWFsJyxcbl07XG52YXIgVEVMRU1FVFJZX0xFVkVMUyA9IFsnY3JpdGljYWwnLCAnZXJyb3InLCAnd2FybmluZycsICdpbmZvJywgJ2RlYnVnJ107XG5cbmZ1bmN0aW9uIGFycmF5SW5jbHVkZXMoYXJyLCB2YWwpIHtcbiAgZm9yICh2YXIgayA9IDA7IGsgPCBhcnIubGVuZ3RoOyArK2spIHtcbiAgICBpZiAoYXJyW2tdID09PSB2YWwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVGVsZW1ldHJ5RXZlbnQoYXJncykge1xuICB2YXIgdHlwZSwgbWV0YWRhdGEsIGxldmVsO1xuICB2YXIgYXJnO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJncy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBhcmcgPSBhcmdzW2ldO1xuXG4gICAgdmFyIHR5cCA9IHR5cGVOYW1lKGFyZyk7XG4gICAgc3dpdGNoICh0eXApIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIGlmICghdHlwZSAmJiBhcnJheUluY2x1ZGVzKFRFTEVNRVRSWV9UWVBFUywgYXJnKSkge1xuICAgICAgICAgIHR5cGUgPSBhcmc7XG4gICAgICAgIH0gZWxzZSBpZiAoIWxldmVsICYmIGFycmF5SW5jbHVkZXMoVEVMRU1FVFJZX0xFVkVMUywgYXJnKSkge1xuICAgICAgICAgIGxldmVsID0gYXJnO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgbWV0YWRhdGEgPSBhcmc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHZhciBldmVudCA9IHtcbiAgICB0eXBlOiB0eXBlIHx8ICdtYW51YWwnLFxuICAgIG1ldGFkYXRhOiBtZXRhZGF0YSB8fCB7fSxcbiAgICBsZXZlbDogbGV2ZWwsXG4gIH07XG5cbiAgcmV0dXJuIGV2ZW50O1xufVxuXG5mdW5jdGlvbiBhZGRJdGVtQXR0cmlidXRlcyhpdGVtLCBhdHRyaWJ1dGVzKSB7XG4gIGl0ZW0uZGF0YS5hdHRyaWJ1dGVzID0gaXRlbS5kYXRhLmF0dHJpYnV0ZXMgfHwgW107XG4gIGlmIChhdHRyaWJ1dGVzKSB7XG4gICAgaXRlbS5kYXRhLmF0dHJpYnV0ZXMucHVzaCguLi5hdHRyaWJ1dGVzKTtcbiAgfVxufVxuXG4vKlxuICogZ2V0IC0gZ2l2ZW4gYW4gb2JqL2FycmF5IGFuZCBhIGtleXBhdGgsIHJldHVybiB0aGUgdmFsdWUgYXQgdGhhdCBrZXlwYXRoIG9yXG4gKiAgICAgICB1bmRlZmluZWQgaWYgbm90IHBvc3NpYmxlLlxuICpcbiAqIEBwYXJhbSBvYmogLSBhbiBvYmplY3Qgb3IgYXJyYXlcbiAqIEBwYXJhbSBwYXRoIC0gYSBzdHJpbmcgb2Yga2V5cyBzZXBhcmF0ZWQgYnkgJy4nIHN1Y2ggYXMgJ3BsdWdpbi5qcXVlcnkuMC5tZXNzYWdlJ1xuICogICAgd2hpY2ggd291bGQgY29ycmVzcG9uZCB0byA0MiBpbiBge3BsdWdpbjoge2pxdWVyeTogW3ttZXNzYWdlOiA0Mn1dfX1gXG4gKi9cbmZ1bmN0aW9uIGdldChvYmosIHBhdGgpIHtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHZhciBrZXlzID0gcGF0aC5zcGxpdCgnLicpO1xuICB2YXIgcmVzdWx0ID0gb2JqO1xuICB0cnkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBrZXlzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICByZXN1bHQgPSByZXN1bHRba2V5c1tpXV07XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgcmVzdWx0ID0gdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHNldChvYmosIHBhdGgsIHZhbHVlKSB7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBrZXlzID0gcGF0aC5zcGxpdCgnLicpO1xuICB2YXIgbGVuID0ga2V5cy5sZW5ndGg7XG4gIGlmIChsZW4gPCAxKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChsZW4gPT09IDEpIHtcbiAgICBvYmpba2V5c1swXV0gPSB2YWx1ZTtcbiAgICByZXR1cm47XG4gIH1cbiAgdHJ5IHtcbiAgICB2YXIgdGVtcCA9IG9ialtrZXlzWzBdXSB8fCB7fTtcbiAgICB2YXIgcmVwbGFjZW1lbnQgPSB0ZW1wO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbGVuIC0gMTsgKytpKSB7XG4gICAgICB0ZW1wW2tleXNbaV1dID0gdGVtcFtrZXlzW2ldXSB8fCB7fTtcbiAgICAgIHRlbXAgPSB0ZW1wW2tleXNbaV1dO1xuICAgIH1cbiAgICB0ZW1wW2tleXNbbGVuIC0gMV1dID0gdmFsdWU7XG4gICAgb2JqW2tleXNbMF1dID0gcmVwbGFjZW1lbnQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm47XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0QXJnc0FzU3RyaW5nKGFyZ3MpIHtcbiAgdmFyIGksIGxlbiwgYXJnO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAoaSA9IDAsIGxlbiA9IGFyZ3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBhcmcgPSBhcmdzW2ldO1xuICAgIHN3aXRjaCAodHlwZU5hbWUoYXJnKSkge1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgYXJnID0gc3RyaW5naWZ5KGFyZyk7XG4gICAgICAgIGFyZyA9IGFyZy5lcnJvciB8fCBhcmcudmFsdWU7XG4gICAgICAgIGlmIChhcmcubGVuZ3RoID4gNTAwKSB7XG4gICAgICAgICAgYXJnID0gYXJnLnN1YnN0cigwLCA0OTcpICsgJy4uLic7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdudWxsJzpcbiAgICAgICAgYXJnID0gJ251bGwnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgIGFyZyA9ICd1bmRlZmluZWQnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N5bWJvbCc6XG4gICAgICAgIGFyZyA9IGFyZy50b1N0cmluZygpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmVzdWx0LnB1c2goYXJnKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0LmpvaW4oJyAnKTtcbn1cblxuZnVuY3Rpb24gbm93KCkge1xuICBpZiAoRGF0ZS5ub3cpIHtcbiAgICByZXR1cm4gK0RhdGUubm93KCk7XG4gIH1cbiAgcmV0dXJuICtuZXcgRGF0ZSgpO1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJJcChyZXF1ZXN0RGF0YSwgY2FwdHVyZUlwKSB7XG4gIGlmICghcmVxdWVzdERhdGEgfHwgIXJlcXVlc3REYXRhWyd1c2VyX2lwJ10gfHwgY2FwdHVyZUlwID09PSB0cnVlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuZXdJcCA9IHJlcXVlc3REYXRhWyd1c2VyX2lwJ107XG4gIGlmICghY2FwdHVyZUlwKSB7XG4gICAgbmV3SXAgPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIHRyeSB7XG4gICAgICB2YXIgcGFydHM7XG4gICAgICBpZiAobmV3SXAuaW5kZXhPZignLicpICE9PSAtMSkge1xuICAgICAgICBwYXJ0cyA9IG5ld0lwLnNwbGl0KCcuJyk7XG4gICAgICAgIHBhcnRzLnBvcCgpO1xuICAgICAgICBwYXJ0cy5wdXNoKCcwJyk7XG4gICAgICAgIG5ld0lwID0gcGFydHMuam9pbignLicpO1xuICAgICAgfSBlbHNlIGlmIChuZXdJcC5pbmRleE9mKCc6JykgIT09IC0xKSB7XG4gICAgICAgIHBhcnRzID0gbmV3SXAuc3BsaXQoJzonKTtcbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICB2YXIgYmVnaW5uaW5nID0gcGFydHMuc2xpY2UoMCwgMyk7XG4gICAgICAgICAgdmFyIHNsYXNoSWR4ID0gYmVnaW5uaW5nWzJdLmluZGV4T2YoJy8nKTtcbiAgICAgICAgICBpZiAoc2xhc2hJZHggIT09IC0xKSB7XG4gICAgICAgICAgICBiZWdpbm5pbmdbMl0gPSBiZWdpbm5pbmdbMl0uc3Vic3RyaW5nKDAsIHNsYXNoSWR4KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHRlcm1pbmFsID0gJzAwMDA6MDAwMDowMDAwOjAwMDA6MDAwMCc7XG4gICAgICAgICAgbmV3SXAgPSBiZWdpbm5pbmcuY29uY2F0KHRlcm1pbmFsKS5qb2luKCc6Jyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0lwID0gbnVsbDtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBuZXdJcCA9IG51bGw7XG4gICAgfVxuICB9XG4gIHJlcXVlc3REYXRhWyd1c2VyX2lwJ10gPSBuZXdJcDtcbn1cblxuZnVuY3Rpb24gaGFuZGxlT3B0aW9ucyhjdXJyZW50LCBpbnB1dCwgcGF5bG9hZCwgbG9nZ2VyKSB7XG4gIHZhciByZXN1bHQgPSBtZXJnZShjdXJyZW50LCBpbnB1dCwgcGF5bG9hZCk7XG4gIHJlc3VsdCA9IHVwZGF0ZURlcHJlY2F0ZWRPcHRpb25zKHJlc3VsdCwgbG9nZ2VyKTtcbiAgaWYgKCFpbnB1dCB8fCBpbnB1dC5vdmVyd3JpdGVTY3J1YkZpZWxkcykge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgaWYgKGlucHV0LnNjcnViRmllbGRzKSB7XG4gICAgcmVzdWx0LnNjcnViRmllbGRzID0gKGN1cnJlbnQuc2NydWJGaWVsZHMgfHwgW10pLmNvbmNhdChpbnB1dC5zY3J1YkZpZWxkcyk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlRGVwcmVjYXRlZE9wdGlvbnMob3B0aW9ucywgbG9nZ2VyKSB7XG4gIGlmIChvcHRpb25zLmhvc3RXaGl0ZUxpc3QgJiYgIW9wdGlvbnMuaG9zdFNhZmVMaXN0KSB7XG4gICAgb3B0aW9ucy5ob3N0U2FmZUxpc3QgPSBvcHRpb25zLmhvc3RXaGl0ZUxpc3Q7XG4gICAgb3B0aW9ucy5ob3N0V2hpdGVMaXN0ID0gdW5kZWZpbmVkO1xuICAgIGxvZ2dlciAmJiBsb2dnZXIubG9nKCdob3N0V2hpdGVMaXN0IGlzIGRlcHJlY2F0ZWQuIFVzZSBob3N0U2FmZUxpc3QuJyk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaG9zdEJsYWNrTGlzdCAmJiAhb3B0aW9ucy5ob3N0QmxvY2tMaXN0KSB7XG4gICAgb3B0aW9ucy5ob3N0QmxvY2tMaXN0ID0gb3B0aW9ucy5ob3N0QmxhY2tMaXN0O1xuICAgIG9wdGlvbnMuaG9zdEJsYWNrTGlzdCA9IHVuZGVmaW5lZDtcbiAgICBsb2dnZXIgJiYgbG9nZ2VyLmxvZygnaG9zdEJsYWNrTGlzdCBpcyBkZXByZWNhdGVkLiBVc2UgaG9zdEJsb2NrTGlzdC4nKTtcbiAgfVxuICByZXR1cm4gb3B0aW9ucztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoOiBhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aCxcbiAgY3JlYXRlSXRlbTogY3JlYXRlSXRlbSxcbiAgYWRkRXJyb3JDb250ZXh0OiBhZGRFcnJvckNvbnRleHQsXG4gIGNyZWF0ZVRlbGVtZXRyeUV2ZW50OiBjcmVhdGVUZWxlbWV0cnlFdmVudCxcbiAgYWRkSXRlbUF0dHJpYnV0ZXM6IGFkZEl0ZW1BdHRyaWJ1dGVzLFxuICBmaWx0ZXJJcDogZmlsdGVySXAsXG4gIGZvcm1hdEFyZ3NBc1N0cmluZzogZm9ybWF0QXJnc0FzU3RyaW5nLFxuICBmb3JtYXRVcmw6IGZvcm1hdFVybCxcbiAgZ2V0OiBnZXQsXG4gIGhhbmRsZU9wdGlvbnM6IGhhbmRsZU9wdGlvbnMsXG4gIGlzRXJyb3I6IGlzRXJyb3IsXG4gIGlzRmluaXRlTnVtYmVyOiBpc0Zpbml0ZU51bWJlcixcbiAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgaXNJdGVyYWJsZTogaXNJdGVyYWJsZSxcbiAgaXNOYXRpdmVGdW5jdGlvbjogaXNOYXRpdmVGdW5jdGlvbixcbiAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICBpc1N0cmluZzogaXNTdHJpbmcsXG4gIGlzVHlwZTogaXNUeXBlLFxuICBpc1Byb21pc2U6IGlzUHJvbWlzZSxcbiAgaXNCcm93c2VyOiBpc0Jyb3dzZXIsXG4gIGpzb25QYXJzZToganNvblBhcnNlLFxuICBMRVZFTFM6IExFVkVMUyxcbiAgbWFrZVVuaGFuZGxlZFN0YWNrSW5mbzogbWFrZVVuaGFuZGxlZFN0YWNrSW5mbyxcbiAgbWVyZ2U6IG1lcmdlLFxuICBub3c6IG5vdyxcbiAgcmVkYWN0OiByZWRhY3QsXG4gIFJvbGxiYXJKU09OOiBSb2xsYmFySlNPTixcbiAgc2FuaXRpemVVcmw6IHNhbml0aXplVXJsLFxuICBzZXQ6IHNldCxcbiAgc2V0dXBKU09OOiBzZXR1cEpTT04sXG4gIHN0cmluZ2lmeTogc3RyaW5naWZ5LFxuICBtYXhCeXRlU2l6ZTogbWF4Qnl0ZVNpemUsXG4gIHR5cGVOYW1lOiB0eXBlTmFtZSxcbiAgdXVpZDQ6IHV1aWQ0LFxufTtcbiIsIi8qXG4gKiBoZWFkZXJzIC0gRGV0ZWN0IHdoZW4gZmV0Y2ggSGVhZGVycyBhcmUgdW5kZWZpbmVkIGFuZCB1c2UgYSBwYXJ0aWFsIHBvbHlmaWxsLlxuICpcbiAqIEEgZnVsbCBwb2x5ZmlsbCBpcyBub3QgdXNlZCBpbiBvcmRlciB0byBrZWVwIHBhY2thZ2Ugc2l6ZSBhcyBzbWFsbCBhcyBwb3NzaWJsZS5cbiAqIFNpbmNlIHRoaXMgaXMgb25seSB1c2VkIGludGVybmFsbHkgYW5kIGlzIG5vdCBhZGRlZCB0byB0aGUgd2luZG93IG9iamVjdCxcbiAqIHRoZSBmdWxsIGludGVyZmFjZSBkb2Vzbid0IG5lZWQgdG8gYmUgc3VwcG9ydGVkLlxuICpcbiAqIFRoaXMgaW1wbGVtZW50YXRpb24gaXMgbW9kaWZpZWQgZnJvbSB3aGF0d2ctZmV0Y2g6XG4gKiBodHRwczovL2dpdGh1Yi5jb20vZ2l0aHViL2ZldGNoXG4gKi9cbmZ1bmN0aW9uIGhlYWRlcnMoaGVhZGVycykge1xuICBpZiAodHlwZW9mIEhlYWRlcnMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIG5ldyBGZXRjaEhlYWRlcnMoaGVhZGVycyk7XG4gIH1cblxuICByZXR1cm4gbmV3IEhlYWRlcnMoaGVhZGVycyk7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU5hbWUobmFtZSkge1xuICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgbmFtZSA9IFN0cmluZyhuYW1lKTtcbiAgfVxuICByZXR1cm4gbmFtZS50b0xvd2VyQ2FzZSgpO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVWYWx1ZSh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XG4gIHZhciBpdGVyYXRvciA9IHtcbiAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdmFsdWUgPSBpdGVtcy5zaGlmdCgpO1xuICAgICAgcmV0dXJuIHsgZG9uZTogdmFsdWUgPT09IHVuZGVmaW5lZCwgdmFsdWU6IHZhbHVlIH07XG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4gaXRlcmF0b3I7XG59XG5cbmZ1bmN0aW9uIEZldGNoSGVhZGVycyhoZWFkZXJzKSB7XG4gIHRoaXMubWFwID0ge307XG5cbiAgaWYgKGhlYWRlcnMgaW5zdGFuY2VvZiBGZXRjaEhlYWRlcnMpIHtcbiAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBuYW1lKSB7XG4gICAgICB0aGlzLmFwcGVuZChuYW1lLCB2YWx1ZSk7XG4gICAgfSwgdGhpcyk7XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShoZWFkZXJzKSkge1xuICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGVhZGVyKSB7XG4gICAgICB0aGlzLmFwcGVuZChoZWFkZXJbMF0sIGhlYWRlclsxXSk7XG4gICAgfSwgdGhpcyk7XG4gIH0gZWxzZSBpZiAoaGVhZGVycykge1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIGhlYWRlcnNbbmFtZV0pO1xuICAgIH0sIHRoaXMpO1xuICB9XG59XG5cbkZldGNoSGVhZGVycy5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpO1xuICB2YWx1ZSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKTtcbiAgdmFyIG9sZFZhbHVlID0gdGhpcy5tYXBbbmFtZV07XG4gIHRoaXMubWFwW25hbWVdID0gb2xkVmFsdWUgPyBvbGRWYWx1ZSArICcsICcgKyB2YWx1ZSA6IHZhbHVlO1xufTtcblxuRmV0Y2hIZWFkZXJzLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAobmFtZSkge1xuICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKTtcbiAgcmV0dXJuIHRoaXMuaGFzKG5hbWUpID8gdGhpcy5tYXBbbmFtZV0gOiBudWxsO1xufTtcblxuRmV0Y2hIZWFkZXJzLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gdGhpcy5tYXAuaGFzT3duUHJvcGVydHkobm9ybWFsaXplTmFtZShuYW1lKSk7XG59O1xuXG5GZXRjaEhlYWRlcnMucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgZm9yICh2YXIgbmFtZSBpbiB0aGlzLm1hcCkge1xuICAgIGlmICh0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB0aGlzLm1hcFtuYW1lXSwgbmFtZSwgdGhpcyk7XG4gICAgfVxuICB9XG59O1xuXG5GZXRjaEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpdGVtcyA9IFtdO1xuICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBuYW1lKSB7XG4gICAgaXRlbXMucHVzaChbbmFtZSwgdmFsdWVdKTtcbiAgfSk7XG4gIHJldHVybiBpdGVyYXRvckZvcihpdGVtcyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGhlYWRlcnM7XG4iLCJmdW5jdGlvbiByZXBsYWNlKG9iaiwgbmFtZSwgcmVwbGFjZW1lbnQsIHJlcGxhY2VtZW50cywgdHlwZSkge1xuICB2YXIgb3JpZyA9IG9ialtuYW1lXTtcbiAgb2JqW25hbWVdID0gcmVwbGFjZW1lbnQob3JpZyk7XG4gIGlmIChyZXBsYWNlbWVudHMpIHtcbiAgICByZXBsYWNlbWVudHNbdHlwZV0ucHVzaChbb2JqLCBuYW1lLCBvcmlnXSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXBsYWNlO1xuIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsaXR5Jyk7XG5cbmZ1bmN0aW9uIHRyYXZlcnNlKG9iaiwgZnVuYywgc2Vlbikge1xuICB2YXIgaywgdiwgaTtcbiAgdmFyIGlzT2JqID0gXy5pc1R5cGUob2JqLCAnb2JqZWN0Jyk7XG4gIHZhciBpc0FycmF5ID0gXy5pc1R5cGUob2JqLCAnYXJyYXknKTtcbiAgdmFyIGtleXMgPSBbXTtcbiAgdmFyIHNlZW5JbmRleDtcblxuICAvLyBCZXN0IG1pZ2h0IGJlIHRvIHVzZSBNYXAgaGVyZSB3aXRoIGBvYmpgIGFzIHRoZSBrZXlzLCBidXQgd2Ugd2FudCB0byBzdXBwb3J0IElFIDwgMTEuXG4gIHNlZW4gPSBzZWVuIHx8IHsgb2JqOiBbXSwgbWFwcGVkOiBbXSB9O1xuXG4gIGlmIChpc09iaikge1xuICAgIHNlZW5JbmRleCA9IHNlZW4ub2JqLmluZGV4T2Yob2JqKTtcblxuICAgIGlmIChpc09iaiAmJiBzZWVuSW5kZXggIT09IC0xKSB7XG4gICAgICAvLyBQcmVmZXIgdGhlIG1hcHBlZCBvYmplY3QgaWYgdGhlcmUgaXMgb25lLlxuICAgICAgcmV0dXJuIHNlZW4ubWFwcGVkW3NlZW5JbmRleF0gfHwgc2Vlbi5vYmpbc2VlbkluZGV4XTtcbiAgICB9XG5cbiAgICBzZWVuLm9iai5wdXNoKG9iaik7XG4gICAgc2VlbkluZGV4ID0gc2Vlbi5vYmoubGVuZ3RoIC0gMTtcbiAgfVxuXG4gIGlmIChpc09iaikge1xuICAgIGZvciAoayBpbiBvYmopIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrKSkge1xuICAgICAgICBrZXlzLnB1c2goayk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzQXJyYXkpIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgb2JqLmxlbmd0aDsgKytpKSB7XG4gICAgICBrZXlzLnB1c2goaSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIHJlc3VsdCA9IGlzT2JqID8ge30gOiBbXTtcbiAgdmFyIHNhbWUgPSB0cnVlO1xuICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgIGsgPSBrZXlzW2ldO1xuICAgIHYgPSBvYmpba107XG4gICAgcmVzdWx0W2tdID0gZnVuYyhrLCB2LCBzZWVuKTtcbiAgICBzYW1lID0gc2FtZSAmJiByZXN1bHRba10gPT09IG9ialtrXTtcbiAgfVxuXG4gIGlmIChpc09iaiAmJiAhc2FtZSkge1xuICAgIHNlZW4ubWFwcGVkW3NlZW5JbmRleF0gPSByZXN1bHQ7XG4gIH1cblxuICByZXR1cm4gIXNhbWUgPyByZXN1bHQgOiBvYmo7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHJhdmVyc2U7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLyogZ2xvYmFscyBleHBlY3QgKi9cbi8qIGdsb2JhbHMgZGVzY3JpYmUgKi9cbi8qIGdsb2JhbHMgaXQgKi9cbi8qIGdsb2JhbHMgc2lub24gKi9cblxudmFyIEluc3RydW1lbnRlciA9IHJlcXVpcmUoJy4uL3NyYy9icm93c2VyL3RlbGVtZXRyeScpO1xuXG5kZXNjcmliZSgnaW5zdHJ1bWVudE5ldHdvcmsnLCBmdW5jdGlvbiAoKSB7XG4gIGl0KCdzaG91bGQgY2FwdHVyZSBYSFIgcmVxdWVzdHMgd2l0aCBzdHJpbmcgVVJMJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgY2FsbGJhY2sgPSBzaW5vbi5zcHkoKTtcbiAgICB2YXIgd2luZG93TW9jayA9IHtcbiAgICAgIFhNTEh0dHBSZXF1ZXN0OiBmdW5jdGlvbiAoKSB7fSxcbiAgICB9O1xuXG4gICAgd2luZG93TW9jay5YTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUub3BlbiA9IGZ1bmN0aW9uICgpIHt9O1xuICAgIHdpbmRvd01vY2suWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIHZhciBpID0gY3JlYXRlSW5zdHJ1bWVudGVyKGNhbGxiYWNrLCB3aW5kb3dNb2NrKTtcbiAgICBpLmluc3RydW1lbnROZXR3b3JrKCk7XG5cbiAgICB2YXIgeGhyID0gbmV3IHdpbmRvd01vY2suWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB4aHIub3BlbignR0VUJywgJ2h0dHA6Ly9maXJzdC5jYWxsJyk7XG4gICAgeGhyLnNlbmQoKTtcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlKCk7XG5cbiAgICBleHBlY3QoY2FsbGJhY2suY2FsbENvdW50KS50by5lcWwoMSk7XG4gICAgZXhwZWN0KGNhbGxiYWNrLmFyZ3NbMF1bMF0udXJsKS50by5lcWwoJ2h0dHA6Ly9maXJzdC5jYWxsJyk7XG5cbiAgICBpLmRlaW5zdHJ1bWVudE5ldHdvcmsoKTtcbiAgICBpID0gY3JlYXRlSW5zdHJ1bWVudGVyKGNhbGxiYWNrLCB3aW5kb3dNb2NrKTtcbiAgICBpLmluc3RydW1lbnROZXR3b3JrKCk7XG4gICAgdmFyIHhociA9IG5ldyB3aW5kb3dNb2NrLlhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oJ0dFVCcsIG5ldyBVUkwoJ2h0dHA6Ly9zZWNvbmQuY2FsbCcpKTtcbiAgICB4aHIuc2VuZCgpO1xuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UoKTtcbiAgICBleHBlY3QoY2FsbGJhY2suY2FsbENvdW50KS50by5lcWwoMik7XG4gICAgZXhwZWN0KGNhbGxiYWNrLmFyZ3NbMV1bMF0udXJsKS50by5lcWwoJ2h0dHA6Ly9zZWNvbmQuY2FsbC8nKTtcblxuICAgIGRvbmUoKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBjYXB0dXJlIFhIUiByZXF1ZXN0cyB3aXRoIHN0cmluZyBVUkwnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBjYWxsYmFjayA9IHNpbm9uLnNweSgpO1xuICAgIHZhciB3aW5kb3dNb2NrID0ge1xuICAgICAgZmV0Y2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgfSxcbiAgICB9O1xuXG4gICAgdmFyIGkgPSBjcmVhdGVJbnN0cnVtZW50ZXIoY2FsbGJhY2ssIHdpbmRvd01vY2spO1xuICAgIGkuaW5zdHJ1bWVudE5ldHdvcmsoKTtcblxuICAgIHdpbmRvd01vY2suZmV0Y2goJ2h0dHA6Ly9maXJzdC5jYWxsJyk7XG4gICAgZXhwZWN0KGNhbGxiYWNrLmNhbGxDb3VudCkudG8uZXFsKDEpO1xuICAgIGV4cGVjdChjYWxsYmFjay5hcmdzWzBdWzBdLnVybCkudG8uZXFsKCdodHRwOi8vZmlyc3QuY2FsbCcpO1xuXG4gICAgaS5kZWluc3RydW1lbnROZXR3b3JrKCk7XG4gICAgaSA9IGNyZWF0ZUluc3RydW1lbnRlcihjYWxsYmFjaywgd2luZG93TW9jayk7XG4gICAgaS5pbnN0cnVtZW50TmV0d29yaygpO1xuXG4gICAgd2luZG93TW9jay5mZXRjaChuZXcgVVJMKCdodHRwOi8vc2Vjb25kLmNhbGwnKSk7XG4gICAgZXhwZWN0KGNhbGxiYWNrLmNhbGxDb3VudCkudG8uZXFsKDIpO1xuICAgIGV4cGVjdChjYWxsYmFjay5hcmdzWzFdWzBdLnVybCkudG8uZXFsKCdodHRwOi8vc2Vjb25kLmNhbGwvJyk7XG5cbiAgICBkb25lKCk7XG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUluc3RydW1lbnRlcihjYWxsYmFjaywgd2luZG93TW9jaykge1xuICByZXR1cm4gbmV3IEluc3RydW1lbnRlcihcbiAgICB7IHNjcnViRmllbGRzOiBbXSB9LFxuICAgIHsgY2FwdHVyZU5ldHdvcms6IGNhbGxiYWNrIH0sXG4gICAgeyB3cmFwOiBmdW5jdGlvbiAoKSB7fSwgY2xpZW50OiB7IG5vdGlmaWVyOiB7IGRpYWdub3N0aWM6IHt9IH0gfSB9LFxuICAgIHdpbmRvd01vY2ssXG4gICk7XG59XG4iXSwibmFtZXMiOlsiZ2V0RWxlbWVudFR5cGUiLCJlIiwiZ2V0QXR0cmlidXRlIiwidG9Mb3dlckNhc2UiLCJpc0Rlc2NyaWJlZEVsZW1lbnQiLCJlbGVtZW50IiwidHlwZSIsInN1YnR5cGVzIiwidGFnTmFtZSIsImkiLCJsZW5ndGgiLCJnZXRFbGVtZW50RnJvbUV2ZW50IiwiZXZ0IiwiZG9jIiwidGFyZ2V0IiwiZWxlbWVudEZyb21Qb2ludCIsImNsaWVudFgiLCJjbGllbnRZIiwidW5kZWZpbmVkIiwidHJlZVRvQXJyYXkiLCJlbGVtIiwiTUFYX0hFSUdIVCIsIm91dCIsIm5leHREZXNjcmlwdGlvbiIsImhlaWdodCIsImRlc2NyaWJlRWxlbWVudCIsInVuc2hpZnQiLCJwYXJlbnROb2RlIiwiZWxlbWVudEFycmF5VG9TdHJpbmciLCJhIiwiTUFYX0xFTkdUSCIsInNlcGFyYXRvciIsInNlcGFyYXRvckxlbmd0aCIsImxlbiIsIm5leHRTdHIiLCJ0b3RhbExlbmd0aCIsImRlc2NyaXB0aW9uVG9TdHJpbmciLCJqb2luIiwiZGVzYyIsImlkIiwicHVzaCIsImNsYXNzZXMiLCJhdHRyaWJ1dGVzIiwia2V5IiwidmFsdWUiLCJjbGFzc05hbWUiLCJhdHRyIiwic3BsaXQiLCJtb2R1bGUiLCJleHBvcnRzIiwiXyIsInJlcXVpcmUiLCJoZWFkZXJzIiwicmVwbGFjZSIsInNjcnViIiwidXJscGFyc2VyIiwiZG9tVXRpbCIsImRlZmF1bHRzIiwibmV0d29yayIsIm5ldHdvcmtSZXNwb25zZUhlYWRlcnMiLCJuZXR3b3JrUmVzcG9uc2VCb2R5IiwibmV0d29ya1JlcXVlc3RIZWFkZXJzIiwibmV0d29ya1JlcXVlc3RCb2R5IiwibmV0d29ya0Vycm9yT25IdHRwNXh4IiwibmV0d29ya0Vycm9yT25IdHRwNHh4IiwibmV0d29ya0Vycm9yT25IdHRwMCIsImxvZyIsImRvbSIsIm5hdmlnYXRpb24iLCJjb25uZWN0aXZpdHkiLCJjb250ZW50U2VjdXJpdHlQb2xpY3kiLCJlcnJvck9uQ29udGVudFNlY3VyaXR5UG9saWN5IiwicmVzdG9yZSIsInJlcGxhY2VtZW50cyIsImIiLCJzaGlmdCIsIm5hbWVGcm9tRGVzY3JpcHRpb24iLCJkZXNjcmlwdGlvbiIsImF0dHJzIiwiZGVmYXVsdFZhbHVlU2NydWJiZXIiLCJzY3J1YkZpZWxkcyIsInBhdHRlcm5zIiwiUmVnRXhwIiwibmFtZSIsInRlc3QiLCJJbnN0cnVtZW50ZXIiLCJvcHRpb25zIiwidGVsZW1ldGVyIiwicm9sbGJhciIsIl93aW5kb3ciLCJfZG9jdW1lbnQiLCJhdXRvSW5zdHJ1bWVudCIsImVuYWJsZWQiLCJpc1R5cGUiLCJtZXJnZSIsInNjcnViVGVsZW1ldHJ5SW5wdXRzIiwidGVsZW1ldHJ5U2NydWJiZXIiLCJkaWFnbm9zdGljIiwiY2xpZW50Iiwibm90aWZpZXIiLCJldmVudFJlbW92ZXJzIiwiY29udGVudHNlY3VyaXR5cG9saWN5IiwiX2xvY2F0aW9uIiwibG9jYXRpb24iLCJfbGFzdEhyZWYiLCJocmVmIiwicHJvdG90eXBlIiwiY29uZmlndXJlIiwib2xkU2V0dGluZ3MiLCJpbnN0cnVtZW50IiwiaW5zdHJ1bWVudE5ldHdvcmsiLCJkZWluc3RydW1lbnROZXR3b3JrIiwiaW5zdHJ1bWVudENvbnNvbGUiLCJkZWluc3RydW1lbnRDb25zb2xlIiwiaW5zdHJ1bWVudERvbSIsImRlaW5zdHJ1bWVudERvbSIsImluc3RydW1lbnROYXZpZ2F0aW9uIiwiZGVpbnN0cnVtZW50TmF2aWdhdGlvbiIsImluc3RydW1lbnRDb25uZWN0aXZpdHkiLCJkZWluc3RydW1lbnRDb25uZWN0aXZpdHkiLCJpbnN0cnVtZW50Q29udGVudFNlY3VyaXR5UG9saWN5IiwiZGVpbnN0cnVtZW50Q29udGVudFNlY3VyaXR5UG9saWN5Iiwic2VsZiIsIndyYXBQcm9wIiwicHJvcCIsInhociIsImlzRnVuY3Rpb24iLCJvcmlnIiwid3JhcCIsInhocnAiLCJYTUxIdHRwUmVxdWVzdCIsIm1ldGhvZCIsInVybCIsImlzVXJsT2JqZWN0IiwiX2lzVXJsT2JqZWN0IiwidG9TdHJpbmciLCJfX3JvbGxiYXJfeGhyIiwic3RhdHVzX2NvZGUiLCJzdGFydF90aW1lX21zIiwibm93IiwiZW5kX3RpbWVfbXMiLCJhcHBseSIsImFyZ3VtZW50cyIsImhlYWRlciIsInJlcXVlc3RfaGVhZGVycyIsInJlcXVlc3RfY29udGVudF90eXBlIiwiZGF0YSIsIm9ucmVhZHlzdGF0ZWNoYW5nZUhhbmRsZXIiLCJyZXF1ZXN0IiwiX19yb2xsYmFyX2V2ZW50IiwiY2FwdHVyZU5ldHdvcmsiLCJyZWFkeVN0YXRlIiwicmVzcG9uc2VfY29udGVudF90eXBlIiwiZ2V0UmVzcG9uc2VIZWFkZXIiLCJoZWFkZXJzQ29uZmlnIiwiYWxsSGVhZGVycyIsImdldEFsbFJlc3BvbnNlSGVhZGVycyIsImFyciIsInRyaW0iLCJwYXJ0cyIsImJvZHkiLCJyZXNwb25zZVRleHQiLCJyZXNwb25zZSIsImlzSnNvbkNvbnRlbnRUeXBlIiwic2NydWJKc29uIiwiY29kZSIsInN0YXR1cyIsImxldmVsIiwibGV2ZWxGcm9tU3RhdHVzIiwiZXJyb3JPbkh0dHBTdGF0dXMiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJ0cmFja0h0dHBFcnJvcnMiLCJzdGFjayIsIkVycm9yIiwiZm4iLCJ0IiwiYXJncyIsIkFycmF5IiwiaW5wdXQiLCJtZXRhZGF0YSIsInJlcUhlYWRlcnMiLCJnZXQiLCJmZXRjaEhlYWRlcnMiLCJ0aGVuIiwicmVzcCIsInRleHQiLCJjbG9uZSIsInN1YnR5cGUiLCJyb2xsYmFyVVVJRCIsImNvbnRlbnRUeXBlIiwiaW5jbHVkZXMiLCJqc29uIiwiSlNPTiIsInN0cmluZ2lmeSIsInBhcnNlIiwiaW5IZWFkZXJzIiwib3V0SGVhZGVycyIsImVudHJpZXMiLCJjdXJyZW50SGVhZGVyIiwibmV4dCIsImRvbmUiLCJlcnJvciIsInNraXBGcmFtZXMiLCJjb25zb2xlIiwiYyIsIndyYXBDb25zb2xlIiwib3JpZ0NvbnNvbGUiLCJzbGljZSIsImNhbGwiLCJtZXNzYWdlIiwiZm9ybWF0QXJnc0FzU3RyaW5nIiwiY2FwdHVyZUxvZyIsIkZ1bmN0aW9uIiwibWV0aG9kcyIsInJlbW92ZUxpc3RlbmVycyIsImNsaWNrSGFuZGxlciIsImhhbmRsZUNsaWNrIiwiYmluZCIsImJsdXJIYW5kbGVyIiwiaGFuZGxlQmx1ciIsImFkZExpc3RlbmVyIiwiaGFzVGFnIiwiYW5jaG9yT3JCdXR0b24iLCJjYXB0dXJlRG9tRXZlbnQiLCJjaGVja2VkIiwiZXhjIiwiaGFuZGxlU2VsZWN0SW5wdXRDaGFuZ2VkIiwibXVsdGlwbGUiLCJzZWxlY3RlZCIsInNlbGVjdGVkSW5kZXgiLCJpc0NoZWNrZWQiLCJlbGVtZW50U3RyaW5nIiwiY2FwdHVyZURvbSIsImNocm9tZSIsImNocm9tZVBhY2thZ2VkQXBwIiwiYXBwIiwicnVudGltZSIsImhhc1B1c2hTdGF0ZSIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJjdXJyZW50IiwiaGFuZGxlVXJsQ2hhbmdlIiwiZnJvbSIsInRvIiwicGFyc2VkSHJlZiIsInBhcnNlZFRvIiwicGFyc2VkRnJvbSIsInByb3RvY29sIiwiaG9zdCIsInBhdGgiLCJoYXNoIiwiY2FwdHVyZU5hdmlnYXRpb24iLCJhZGRFdmVudExpc3RlbmVyIiwiY2FwdHVyZUNvbm5lY3Rpdml0eUNoYW5nZSIsImhhbmRsZUNzcEV2ZW50IiwiY3NwRXZlbnQiLCJibG9ja2VkVVJJIiwidmlvbGF0ZWREaXJlY3RpdmUiLCJlZmZlY3RpdmVEaXJlY3RpdmUiLCJzb3VyY2VGaWxlIiwibGluZU51bWJlciIsImNvbHVtbk51bWJlciIsIm9yaWdpbmFsUG9saWN5IiwiaGFuZGxlQ3NwRXJyb3IiLCJjc3BIYW5kbGVyIiwic2VjdGlvbiIsIm9iaiIsImFsdFR5cGUiLCJoYW5kbGVyIiwiY2FwdHVyZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJhdHRhY2hFdmVudCIsImRldGFjaEV2ZW50IiwiciIsIlVSTCIsInJlc3VsdCIsImF1dGgiLCJob3N0bmFtZSIsInBvcnQiLCJwYXRobmFtZSIsInNlYXJjaCIsInF1ZXJ5IiwibGFzdCIsImluZGV4T2YiLCJzdWJzdHJpbmciLCJwYXJzZUludCIsInBhdGhQYXJ0cyIsImhhc093biIsIk9iamVjdCIsImhhc093blByb3BlcnR5IiwidG9TdHIiLCJpc1BsYWluT2JqZWN0IiwiaGFzT3duQ29uc3RydWN0b3IiLCJoYXNJc1Byb3RvdHlwZU9mIiwiY29uc3RydWN0b3IiLCJzcmMiLCJjb3B5IiwidHJhdmVyc2UiLCJzY3J1YlBhdGhzIiwic2NydWJQYXRoIiwicGFyYW1SZXMiLCJfZ2V0U2NydWJGaWVsZFJlZ2V4cyIsInF1ZXJ5UmVzIiwiX2dldFNjcnViUXVlcnlQYXJhbVJlZ2V4cyIsInJlZGFjdFF1ZXJ5UGFyYW0iLCJkdW1teTAiLCJwYXJhbVBhcnQiLCJyZWRhY3QiLCJwYXJhbVNjcnViYmVyIiwidiIsInZhbFNjcnViYmVyIiwiayIsInNjcnViYmVyIiwic2VlbiIsInRtcFYiLCJrZXlzIiwicmV0IiwicGF0IiwiUm9sbGJhckpTT04iLCJzZXR1cEpTT04iLCJwb2x5ZmlsbEpTT04iLCJpc0RlZmluZWQiLCJpc05hdGl2ZUZ1bmN0aW9uIiwieCIsInR5cGVOYW1lIiwiX3R5cGVvZiIsIm1hdGNoIiwiZiIsInJlUmVnRXhwQ2hhciIsImZ1bmNNYXRjaFN0cmluZyIsInJlSXNOYXRpdmUiLCJpc09iamVjdCIsImlzU3RyaW5nIiwiU3RyaW5nIiwiaXNGaW5pdGVOdW1iZXIiLCJuIiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJ1IiwiaXNJdGVyYWJsZSIsImlzRXJyb3IiLCJpc1Byb21pc2UiLCJwIiwiaXNCcm93c2VyIiwid2luZG93IiwidXVpZDQiLCJkIiwidXVpZCIsIk1hdGgiLCJyYW5kb20iLCJmbG9vciIsIkxFVkVMUyIsImRlYnVnIiwiaW5mbyIsIndhcm5pbmciLCJjcml0aWNhbCIsInNhbml0aXplVXJsIiwiYmFzZVVybFBhcnRzIiwicGFyc2VVcmkiLCJhbmNob3IiLCJzb3VyY2UiLCJwYXJzZVVyaU9wdGlvbnMiLCJzdHJpY3RNb2RlIiwicSIsInBhcnNlciIsInN0cmljdCIsImxvb3NlIiwic3RyIiwibyIsIm0iLCJleGVjIiwidXJpIiwibCIsIiQwIiwiJDEiLCIkMiIsImFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoIiwiYWNjZXNzVG9rZW4iLCJwYXJhbXMiLCJhY2Nlc3NfdG9rZW4iLCJwYXJhbXNBcnJheSIsInNvcnQiLCJxcyIsImgiLCJmb3JtYXRVcmwiLCJiYWNrdXAiLCJqc29uRXJyb3IiLCJiYWNrdXBFcnJvciIsIm1heEJ5dGVTaXplIiwic3RyaW5nIiwiY291bnQiLCJjaGFyQ29kZUF0IiwianNvblBhcnNlIiwicyIsIm1ha2VVbmhhbmRsZWRTdGFja0luZm8iLCJsaW5lbm8iLCJjb2xubyIsIm1vZGUiLCJiYWNrdXBNZXNzYWdlIiwiZXJyb3JQYXJzZXIiLCJsaW5lIiwiY29sdW1uIiwiZnVuYyIsImd1ZXNzRnVuY3Rpb25OYW1lIiwiY29udGV4dCIsImdhdGhlckNvbnRleHQiLCJkb2N1bWVudCIsInVzZXJhZ2VudCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsIndyYXBDYWxsYmFjayIsImxvZ2dlciIsImVyciIsIm5vbkNpcmN1bGFyQ2xvbmUiLCJuZXdTZWVuIiwiY3JlYXRlSXRlbSIsInJlcXVlc3RLZXlzIiwibGFtYmRhQ29udGV4dCIsImN1c3RvbSIsImNhbGxiYWNrIiwiYXJnIiwiZXh0cmFBcmdzIiwiYXJnVHlwZXMiLCJ0eXAiLCJET01FeGNlcHRpb24iLCJqIiwiaXRlbSIsInRpbWVzdGFtcCIsInNldEN1c3RvbUl0ZW1LZXlzIiwiX29yaWdpbmFsQXJncyIsIm9yaWdpbmFsX2FyZ190eXBlcyIsImFkZEVycm9yQ29udGV4dCIsImVycm9ycyIsImNvbnRleHRBZGRlZCIsInJvbGxiYXJDb250ZXh0IiwiZXJyb3JfY29udGV4dCIsIlRFTEVNRVRSWV9UWVBFUyIsIlRFTEVNRVRSWV9MRVZFTFMiLCJhcnJheUluY2x1ZGVzIiwidmFsIiwiY3JlYXRlVGVsZW1ldHJ5RXZlbnQiLCJldmVudCIsImFkZEl0ZW1BdHRyaWJ1dGVzIiwiX2l0ZW0kZGF0YSRhdHRyaWJ1dGVzIiwiX3RvQ29uc3VtYWJsZUFycmF5Iiwic2V0IiwidGVtcCIsInJlcGxhY2VtZW50Iiwic3Vic3RyIiwiRGF0ZSIsImZpbHRlcklwIiwicmVxdWVzdERhdGEiLCJjYXB0dXJlSXAiLCJuZXdJcCIsInBvcCIsImJlZ2lubmluZyIsInNsYXNoSWR4IiwidGVybWluYWwiLCJjb25jYXQiLCJoYW5kbGVPcHRpb25zIiwicGF5bG9hZCIsInVwZGF0ZURlcHJlY2F0ZWRPcHRpb25zIiwib3ZlcndyaXRlU2NydWJGaWVsZHMiLCJob3N0V2hpdGVMaXN0IiwiaG9zdFNhZmVMaXN0IiwiaG9zdEJsYWNrTGlzdCIsImhvc3RCbG9ja0xpc3QiLCJIZWFkZXJzIiwiRmV0Y2hIZWFkZXJzIiwibm9ybWFsaXplTmFtZSIsIm5vcm1hbGl6ZVZhbHVlIiwiaXRlcmF0b3JGb3IiLCJpdGVtcyIsIml0ZXJhdG9yIiwibWFwIiwiZm9yRWFjaCIsImFwcGVuZCIsImlzQXJyYXkiLCJnZXRPd25Qcm9wZXJ0eU5hbWVzIiwib2xkVmFsdWUiLCJoYXMiLCJ0aGlzQXJnIiwiaXNPYmoiLCJzZWVuSW5kZXgiLCJtYXBwZWQiLCJzYW1lIl0sInNvdXJjZVJvb3QiOiIifQ==