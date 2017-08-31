var _ = require('../utility');
var urlparser = require('./url');

var defaults = {
  network: true,
  log: true,
  dom: true,
  navigation: true,
  connectivity: true
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

function Instrumenter(options, telemeter, rollbar, _window, _document) {
  var autoInstrument = options.autoInstrument;
  if (autoInstrument === false) {
    this.autoInstrument = {};
  } else {
    if (!_.isType(autoInstrument, 'object')) {
      autoInstrument = defaults;
    }
    this.autoInstrument = _.extend(true, {}, defaults, autoInstrument);
  }
  this.scrubTelemetryInputs = !!options.scrubTelemetryInputs;
  this.telemetryScrubber = options.telemetryScrubber;
  this.telemeter = telemeter;
  this.rollbar = rollbar;
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
    connectivity: []
  };

  this._location = this._window.location;
  this._lastHref = this._location && this._location.href;
}

Instrumenter.prototype.configure = function(options) {
  var autoInstrument = options.autoInstrument;
  var oldSettings = _.extend(true, {}, this.autoInstrument);
  if (autoInstrument === false) {
    this.autoInstrument = {};
  } else {
    if (!_.isType(autoInstrument, 'object')) {
      autoInstrument = defaults;
    }
    this.autoInstrument = _.extend(true, {}, defaults, autoInstrument);
  }
  this.instrument(oldSettings);
};

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
          this.__rollbar_xhr = {
            method: method,
            url: url,
            status_code: null,
            start_time_ms: _.now(),
            end_time_ms: null
          };
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
          if (xhr.__rollbar_xhr && (xhr.readyState === 1 || xhr.readyState === 4)) {
            if (xhr.__rollbar_xhr.status_code === null) {
              xhr.__rollbar_xhr.status_code = 0;
              xhr.__rollbar_event = self.telemeter.captureNetwork(xhr.__rollbar_xhr, 'xhr');
            }
            if (xhr.readyState === 1) {
              xhr.__rollbar_xhr.start_time_ms = _.now();
            } else {
              xhr.__rollbar_xhr.end_time_ms = _.now();
            }
            try {
              var code = xhr.status;
              code = code === 1223 ? 204 : code;
              xhr.__rollbar_xhr.status_code = code;
              xhr.__rollbar_event.level = self.telemeter.levelFromStatus(code);
            } catch (e) {
              /* ignore possible exception from xhr.status */
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
          status_code: null,
          start_time_ms: _.now(),
          end_time_ms: null
        };
        self.telemeter.captureNetwork(metadata, 'fetch');
        return orig.apply(this, args).then(function (resp) {
          metadata.end_time_ms = _.now();
          metadata.status_code = resp.status;
          return resp;
        });
      };
    }, this.replacements, 'network');
  }
};

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
  for (var i=0, len=methods.length; i < len; i++) {
    wrapConsole(methods[i]);
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
    var e = getElementFromEvent(evt, this._document);
    var hasTag = e && e.tagName;
    var anchorOrButton = isDescribedElement(e, 'a') || isDescribedElement(e, 'button');
    if (hasTag && (anchorOrButton || isDescribedElement(e, 'input', ['button', 'submit']))) {
        this.captureDomEvent('click', e);
    } else if (isDescribedElement(e, 'input', ['checkbox', 'radio'])) {
      this.captureDomEvent('input', e, e.value, e.checked);
    }
  } catch (exc) {
    // TODO: Not sure what to do here
  }
};

Instrumenter.prototype.handleBlur = function(evt) {
  try {
    var e = getElementFromEvent(evt, this._document);
    if (e && e.tagName) {
      if (isDescribedElement(e, 'textarea')) {
        this.captureDomEvent('input', e, e.value);
      } else if (isDescribedElement(e, 'select') && e.options && e.options.length) {
        this.handleSelectInputChanged(e);
      } else if (isDescribedElement(e, 'input') && !isDescribedElement(e, 'input', ['button', 'submit', 'hidden', 'checkbox', 'radio'])) {
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
    if (this.scrubTelemetryInputs || (getElementType(element) === 'password')) {
      value = '[scrubbed]';
    } else if (this.telemetryScrubber) {
      var description = describeElement(element);
      if (this.telemetryScrubber(description)) {
        value = '[scrubbed]';
      }
    }
  }
  var elementString = elementArrayToString(treeToArray(element));
  this.telemeter.captureDom(subtype, elementString, value, isChecked);
};

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
    out.push(nextDescription);
    elem = elem.parentNode;
  }
  return out.reverse();
}

function elementArrayToString(a) {
  var MAX_LENGTH = 80;
  var separator = ' > ', separatorLength = separator.length;
  var out = [], len = 0, nextStr, totalLength;

  for (var i = 0; i < a.length; i++) {
    nextStr = descriptionToString(a[i]);
    totalLength = len + (out.length * separatorLength) + nextStr.length;
    if (i > 0 && totalLength >= MAX_LENGTH) {
      break;
    }
    out.push(nextStr);
    len += nextStr.length;
  }
  return out.join(separator);
}

/**
 * Old implementation
 * Should be equivalent to: elementArrayToString(treeToArray(elem))
function treeToString(elem) {
  var MAX_HEIGHT = 5, MAX_LENGTH = 80;
  var separator = ' > ', separatorLength = separator.length;
  var out = [], len = 0, nextStr, totalLength;

  for (var height = 0; elem && height < MAX_HEIGHT; height++) {
    nextStr = elementToString(elem);
    if (nextStr === 'html') {
      break;
    }
    totalLength = len + (out.length * separatorLength) + nextStr.length;
    if (height > 1 && totalLength >= MAX_LENGTH) {
      break;
    }
    out.push(nextStr);
    len += nextStr.length;
    elem = elem.parentNode;
  }
  return out.reverse().join(separator);
}

function elementToString(elem) {
  return descriptionToString(describeElement(elem));
}
 */

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
  var out = {}, className, key, attr, i;
  out.tagName = elem.tagName.toLowerCase();
  if (elem.id) {
    out.id = elem.id;
  }
  className = elem.className;
  if (className && _.isType(className, 'string')) {
    out.classes = className.split(/\s+/);
  }
  var attributes = ['type', 'name', 'title', 'alt'];
  out.attributes = [];
  for (i = 0; i < attributes.length; i++) {
    key = attributes[i];
    attr = elem.getAttribute(key);
    if (attr) {
      out.attributes.push({key: key, value: attr});
    }
  }
  return out;
}

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
