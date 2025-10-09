import * as _ from '../utility.js';
import headers from '../utility/headers.js';
import replace from '../utility/replace.js';
import scrub from '../scrub.js';
import * as urlparser from './url.js';
import * as domUtil from './domUtility.js';

const defaults = {
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
  errorOnContentSecurityPolicy: false,
};

function restore(replacements, type) {
  let b;
  while (replacements[type].length) {
    b = replacements[type].shift();
    b[0][b[1]] = b[2];
  }
}

function nameFromDescription(description) {
  if (!description || !description.attributes) {
    return null;
  }
  const attrs = description.attributes;
  for (const a of attrs) {
    if (a.key === 'name') {
      return a.value;
    }
  }
  return null;
}

function defaultValueScrubber(scrubFields) {
  const patterns = [];
  for (const field of scrubFields) {
    patterns.push(new RegExp(field, 'i'));
  }
  return function (description) {
    const name = nameFromDescription(description);
    if (!name) {
      return false;
    }
    for (const p of patterns) {
      if (p.test(name)) {
        return true;
      }
    }
    return false;
  };
}

class Instrumenter {
  constructor(options, telemeter, rollbar, _window, _document) {
    this.options = options;
    let autoInstrument = options.autoInstrument;
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
      connectivity: [],
    };
    this.eventRemovers = {
      dom: [],
      connectivity: [],
      contentsecuritypolicy: [],
    };

    this._location = this._window.location;
    this._lastHref = this._location && this._location.href;
  }

  configure(options) {
    this.options = _.merge(this.options, options);
    let autoInstrument = options.autoInstrument;
    const oldSettings = _.merge(this.autoInstrument);
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
  }

  // eslint-disable-next-line complexity
  instrument(oldSettings) {
    if (this.autoInstrument.network && !(oldSettings && oldSettings.network)) {
      this.instrumentNetwork();
    } else if (
      !this.autoInstrument.network &&
      oldSettings &&
      oldSettings.network
    ) {
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

    if (
      this.autoInstrument.navigation &&
      !(oldSettings && oldSettings.navigation)
    ) {
      this.instrumentNavigation();
    } else if (
      !this.autoInstrument.navigation &&
      oldSettings &&
      oldSettings.navigation
    ) {
      this.deinstrumentNavigation();
    }

    if (
      this.autoInstrument.connectivity &&
      !(oldSettings && oldSettings.connectivity)
    ) {
      this.instrumentConnectivity();
    } else if (
      !this.autoInstrument.connectivity &&
      oldSettings &&
      oldSettings.connectivity
    ) {
      this.deinstrumentConnectivity();
    }

    if (
      this.autoInstrument.contentSecurityPolicy &&
      !(oldSettings && oldSettings.contentSecurityPolicy)
    ) {
      this.instrumentContentSecurityPolicy();
    } else if (
      !this.autoInstrument.contentSecurityPolicy &&
      oldSettings &&
      oldSettings.contentSecurityPolicy
    ) {
      this.deinstrumentContentSecurityPolicy();
    }
  }

  deinstrumentNetwork() {
    restore(this.replacements, 'network');
  }

  instrumentNetwork() {
    const self = this;

    function wrapProp(prop, xhr) {
      if (prop in xhr && _.isFunction(xhr[prop])) {
        replace(xhr, prop, function (orig) {
          return self.rollbar.wrap(orig);
        });
      }
    }

    if ('XMLHttpRequest' in this._window) {
      const xhrp = this._window.XMLHttpRequest.prototype;
      replace(
        xhrp,
        'open',
        function (orig) {
          return function (method, url) {
            const isUrlObject = _isUrlObject(url);
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
                  end_time_ms: null,
                };
              }
            }
            return orig.apply(this, arguments);
          };
        },
        this.replacements,
        'network',
      );

      replace(
        xhrp,
        'setRequestHeader',
        function (orig) {
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
        },
        this.replacements,
        'network',
      );

      replace(
        xhrp,
        'send',
        function (orig) {
          return function (data) {
            const xhr = this;

            function onreadystatechangeHandler() {
              if (xhr.__rollbar_xhr) {
                if (xhr.__rollbar_xhr.status_code === null) {
                  xhr.__rollbar_xhr.status_code = 0;
                  if (self.autoInstrument.networkRequestBody) {
                    xhr.__rollbar_xhr.request = data;
                  }
                  xhr.__rollbar_event = self.captureNetwork(
                    xhr.__rollbar_xhr,
                    'xhr',
                    undefined,
                  );
                }
                if (xhr.readyState < 2) {
                  xhr.__rollbar_xhr.start_time_ms = _.now();
                }
                if (xhr.readyState > 3) {
                  const end_time_ms = _.now();
                  xhr.__rollbar_xhr.end_time_ms = end_time_ms;

                  let headers = null;
                  xhr.__rollbar_xhr.response_content_type =
                    xhr.getResponseHeader('Content-Type');
                  if (self.autoInstrument.networkResponseHeaders) {
                    const headersConfig =
                      self.autoInstrument.networkResponseHeaders;
                    headers = {};
                    try {
                      let header;
                      if (headersConfig === true) {
                        const allHeaders = xhr.getAllResponseHeaders();
                        if (allHeaders) {
                          const arr = allHeaders.trim().split(/[\r\n]+/);
                          let parts, value;
                          for (const h of arr) {
                            parts = h.split(': ');
                            header = parts.shift();
                            value = parts.join(': ');
                            headers[header] = value;
                          }
                        }
                      } else {
                        for (const h of headersConfig) {
                          headers[h] = xhr.getResponseHeader(h);
                        }
                      }
                    } catch (e) {
                      /* we ignore the errors here that could come from different
                       * browser issues with the xhr methods */
                    }
                  }
                  let body = null;
                  if (self.autoInstrument.networkResponseBody) {
                    try {
                      body = xhr.responseText;
                    } catch (e) {
                      /* ignore errors from reading responseText */
                    }
                  }
                  let response = null;
                  if (body || headers) {
                    response = {};
                    if (body) {
                      if (
                        self.isJsonContentType(
                          xhr.__rollbar_xhr.response_content_type,
                        )
                      ) {
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
                    let code = xhr.status;
                    code = code === 1223 ? 204 : code;
                    xhr.__rollbar_xhr.status_code = code;
                    self.addOtelNetworkResponse(
                      xhr.__rollbar_event,
                      end_time_ms,
                      code,
                    );
                    xhr.__rollbar_event.level =
                      self.telemeter.levelFromStatus(code);
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

            if (
              'onreadystatechange' in xhr &&
              _.isFunction(xhr.onreadystatechange)
            ) {
              replace(xhr, 'onreadystatechange', function (orig) {
                return self.rollbar.wrap(
                  orig,
                  undefined,
                  onreadystatechangeHandler,
                );
              });
            } else {
              xhr.onreadystatechange = onreadystatechangeHandler;
            }
            if (xhr.__rollbar_xhr && self.trackHttpErrors()) {
              xhr.__rollbar_xhr.stack = new Error().stack;
            }
            return orig.apply(this, arguments);
          };
        },
        this.replacements,
        'network',
      );
    }

    if ('fetch' in this._window) {
      replace(
        this._window,
        'fetch',
        function (orig) {
          return function (fn, t) {
            const args = [...arguments];
            const input = args[0];
            let method = 'GET';
            let url;
            const isUrlObject = _isUrlObject(input);
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
            const metadata = {
              method: method,
              url: url,
              status_code: null,
              start_time_ms: _.now(),
              end_time_ms: null,
            };
            if (args[1] && args[1].headers) {
              // Argument may be a Headers object, or plain object. Ensure here that
              // we are working with a Headers object with case-insensitive keys.
              const reqHeaders = headers(args[1].headers);

              metadata.request_content_type = reqHeaders.get('Content-Type');

              if (self.autoInstrument.networkRequestHeaders) {
                metadata.request_headers = self.fetchHeaders(
                  reqHeaders,
                  self.autoInstrument.networkRequestHeaders,
                );
              }
            }

            if (self.autoInstrument.networkRequestBody) {
              if (args[1] && args[1].body) {
                metadata.request = args[1].body;
              } else if (
                args[0] &&
                !_.isType(args[0], 'string') &&
                args[0].body
              ) {
                metadata.request = args[0].body;
              }
            }
            const telemetryEvent = self.captureNetwork(
              metadata,
              'fetch',
              undefined,
            );
            if (self.trackHttpErrors()) {
              metadata.stack = new Error().stack;
            }

            // Start our handler before returning the promise. This allows resp.clone()
            // to execute before other handlers touch the response.
            return orig.apply(this, args).then(function (resp) {
              const end_time_ms = _.now();
              metadata.end_time_ms = end_time_ms;
              metadata.status_code = resp.status;
              self.addOtelNetworkResponse(
                telemetryEvent,
                end_time_ms,
                resp.status,
              );

              metadata.response_content_type = resp.headers.get('Content-Type');
              let headers = null;
              if (self.autoInstrument.networkResponseHeaders) {
                headers = self.fetchHeaders(
                  resp.headers,
                  self.autoInstrument.networkResponseHeaders,
                );
              }
              let body = null;
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
                      if (
                        text &&
                        self.isJsonContentType(metadata.response_content_type)
                      ) {
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
        },
        this.replacements,
        'network',
      );
    }
  }

  captureNetwork(metadata, subtype, rollbarUUID) {
    if (
      metadata.request &&
      this.isJsonContentType(metadata.request_content_type)
    ) {
      metadata.request = this.scrubJson(metadata.request);
    }
    return this.telemeter.captureNetwork(metadata, subtype, rollbarUUID);
  }

  isJsonContentType(contentType) {
    return contentType &&
      _.isType(contentType, 'string') &&
      contentType.toLowerCase().includes('json')
      ? true
      : false;
  }

  addOtelNetworkResponse(event, endTimeMs, statusCode) {
    if (event.otelAttributes) {
      event.otelAttributes['response.timeUnixNano'] = (
        endTimeMs * 1e6
      ).toString();
      event.otelAttributes.statusCode = statusCode;
    }
  }

  scrubJson(json) {
    return JSON.stringify(scrub(JSON.parse(json), this.options.scrubFields));
  }

  fetchHeaders(inHeaders, headersConfig) {
    const outHeaders = {};
    try {
      if (headersConfig === true) {
        if (typeof inHeaders.entries === 'function') {
          // Headers.entries() is not implemented in IE
          const allHeaders = inHeaders.entries();
          let currentHeader = allHeaders.next();
          while (!currentHeader.done) {
            outHeaders[currentHeader.value[0]] = currentHeader.value[1];
            currentHeader = allHeaders.next();
          }
        }
      } else {
        for (const h of headersConfig) {
          outHeaders[h] = inHeaders.get(h);
        }
      }
    } catch (e) {
      /* ignore probable IE errors */
    }
    return outHeaders;
  }

  trackHttpErrors() {
    return (
      this.autoInstrument.networkErrorOnHttp5xx ||
      this.autoInstrument.networkErrorOnHttp4xx ||
      this.autoInstrument.networkErrorOnHttp0
    );
  }

  errorOnHttpStatus(metadata) {
    const status = metadata.status_code;

    if (
      (status >= 500 && this.autoInstrument.networkErrorOnHttp5xx) ||
      (status >= 400 && this.autoInstrument.networkErrorOnHttp4xx) ||
      (status === 0 && this.autoInstrument.networkErrorOnHttp0)
    ) {
      const error = new Error('HTTP request failed with Status ' + status);
      error.stack = metadata.stack;
      this.rollbar.error(error, { skipFrames: 1 });
    }
  }

  deinstrumentConsole() {
    let b;
    while (this.replacements['log'].length) {
      b = this.replacements['log'].shift();
      this._window.console[b[0]] = b[1];
    }
  }

  instrumentConsole() {
    if (!this._window?.console?.log) {
      return;
    }

    const self = this;
    const c = this._window.console;

    function wrapConsole(method) {
      'use strict'; // See https://github.com/rollbar/rollbar.js/pull/778

      const orig = c[method];
      const origConsole = c;
      const level = method === 'warn' ? 'warning' : method;
      c[method] = function () {
        const args = Array.prototype.slice.call(arguments);
        const message = _.formatArgsAsString(args);
        self.telemeter.captureLog(message, level, null, _.now());
        if (orig) {
          Function.prototype.apply.call(orig, origConsole, args);
        }
      };
      self.replacements['log'].push([method, orig]);
    }
    const methods = ['debug', 'info', 'warn', 'error', 'log'];
    try {
      for (const m of methods) {
        wrapConsole(m);
      }
    } catch (e) {
      this.diagnostic.instrumentConsole = { error: e.message };
    }
  }

  deinstrumentDom() {
    this.removeListeners('dom');
  }

  instrumentDom() {
    const self = this;
    this.addListener(
      'dom',
      this._window,
      ['click', 'dblclick', 'contextmenu'],
      (e) => this.handleEvent('click', e),
    );
    this.addListener(
      'dom',
      this._window,
      ['dragstart', 'dragend', 'dragenter', 'dragleave', 'drop'],
      (e) => this.handleEvent('dragdrop', e),
    );
    this.addListener('dom', this._window, ['blur', 'focus'], (e) =>
      this.handleEvent('focus', e),
    );
    this.addListener('dom', this._window, ['submit', 'invalid'], (e) =>
      this.handleEvent('form', e),
    );
    this.addListener('dom', this._window, ['input', 'change'], (e) =>
      this.handleEvent('input', e),
    );
    this.addListener('dom', this._window, ['resize'], (e) =>
      this.handleEvent('resize', e),
    );
    this.addListener('dom', this._document, ['DOMContentLoaded'], (e) =>
      this.handleEvent('contentLoaded', e),
    );
  }

  handleEvent(name, evt) {
    try {
      return {
        click: this.handleClick,
        dragdrop: this.handleDrag,
        focus: this.handleFocus,
        form: this.handleForm,
        input: this.handleInput,
        resize: this.handleResize,
        contentLoaded: this.handleContentLoaded,
      }[name].call(this, evt);
    } catch (exc) {
      console.log(`${name} handler error`, evt, exc, exc.stack);
    }
  }

  handleContentLoaded(evt) {
    const replayId = this.rollbar.triggerReplay({
      type: 'navigation',
      path: new URL(this._location.href).pathname,
    });
  }

  handleClick(evt) {
    const tagName = evt.target?.tagName.toLowerCase();
    if (['input', 'select', 'textarea'].includes(tagName)) return;

    this.telemeter.captureClick({
      type: evt.type,
      isSynthetic: !evt.isTrusted,
      element: domUtil.elementString(evt.target),
      timestamp: _.now(),
    });
  }

  handleFocus(evt) {
    const type = evt.type;
    const element = evt.target?.window
      ? 'window'
      : domUtil.elementString(evt.target);

    this.telemeter.captureFocus({
      type: type,
      isSynthetic: !evt.isTrusted,
      element,
      timestamp: _.now(),
    });
  }

  handleForm(evt) {
    // TODO: implement form event handling
    const type = evt.type;
    const elementString = evt.target?.window
      ? 'window'
      : domUtil.elementString(evt.target);
    console.log('handleForm', type, elementString, evt);
  }

  handleResize(evt) {
    const textZoomRatio = window.screen.width / window.innerWidth;

    this.telemeter.captureResize({
      type: evt.type,
      isSynthetic: !evt.isTrusted,
      width: window.innerWidth,
      height: window.innerHeight,
      textZoomRatio: textZoomRatio,
      timestamp: _.now(),
    });
  }

  handleDrag(evt) {
    const type = evt.type;
    let kinds, mediaTypes, dropEffect, effectAllowed;

    if (type === 'drop') {
      kinds = [];
      mediaTypes = [];
      const objs = [...evt.dataTransfer.files, ...evt.dataTransfer.items];
      for (const o of objs) {
        if (o.kind && o.type) {
          kinds.push(o.kind);
          mediaTypes.push(o.type);
        }
      }
    }
    if (['drop', 'dragstart'].includes(type)) {
      dropEffect = evt.dataTransfer?.dropEffect;
      effectAllowed = evt.dataTransfer?.effectAllowed;
    }

    this.telemeter.captureDragDrop({
      type,
      isSynthetic: !evt.isTrusted,
      element: domUtil.elementString(evt.target),
      dropEffect: dropEffect,
      effectAllowed: effectAllowed,
      kinds: JSON.stringify(kinds),
      mediaTypes: JSON.stringify(mediaTypes),
      timestamp: _.now(),
    });
  }

  /*
   * Uses the `input` event for everything except radio and checkbox inputs.
   * For those, it uses the `change` event.
   */
  handleInput(evt) {
    const type = evt.type;
    const tagName = evt.target?.tagName.toLowerCase();
    let value = evt.target?.value;
    let inputType = evt.target?.attributes?.type?.value || evt.target?.type;

    switch (type) {
      case 'input':
        if (['radio', 'checkbox'].includes(inputType)) return;
        if (['select', 'textarea'].includes(tagName)) {
          inputType = tagName;
        }
        if (inputType === 'password') {
          value = null;
        }
        break;

      case 'change':
        if (!['radio', 'checkbox'].includes(inputType)) return;
        if (inputType === 'checkbox') {
          value = evt.target?.checked;
        }
        break;
    }

    this.telemeter.captureInput({
      type: inputType,
      isSynthetic: !evt.isTrusted,
      element: domUtil.elementString(evt.target),
      value,
      timestamp: _.now(),
    });
  }

  deinstrumentNavigation() {
    const chrome = this._window.chrome;
    const chromePackagedApp = chrome && chrome.app && chrome.app.runtime;
    // See https://github.com/angular/angular.js/pull/13945/files
    const hasPushState =
      !chromePackagedApp &&
      this._window.history &&
      this._window.history.pushState;
    if (!hasPushState) {
      return;
    }
    restore(this.replacements, 'navigation');
  }

  instrumentNavigation() {
    const chrome = this._window.chrome;
    const chromePackagedApp = chrome && chrome.app && chrome.app.runtime;
    // See https://github.com/angular/angular.js/pull/13945/files
    const hasPushState =
      !chromePackagedApp &&
      this._window.history &&
      this._window.history.pushState;
    if (!hasPushState) {
      return;
    }
    const self = this;
    replace(
      this._window,
      'onpopstate',
      function (orig) {
        return function () {
          const current = self._location.href;
          self.handleUrlChange(self._lastHref, current);
          if (orig) {
            orig.apply(this, arguments);
          }
        };
      },
      this.replacements,
      'navigation',
    );

    replace(
      this._window.history,
      'pushState',
      function (orig) {
        return function () {
          const url = arguments.length > 2 ? arguments[2] : undefined;
          if (url) {
            self.handleUrlChange(self._lastHref, url + '');
          }
          return orig.apply(this, arguments);
        };
      },
      this.replacements,
      'navigation',
    );
  }

  handleUrlChange(from, to) {
    const parsedHref = urlparser.parse(this._location.href);
    const parsedTo = urlparser.parse(to);
    const parsedFrom = urlparser.parse(from);
    this._lastHref = to;
    if (
      parsedHref.protocol === parsedTo.protocol &&
      parsedHref.host === parsedTo.host
    ) {
      to = parsedTo.path + (parsedTo.hash || '');
    }
    if (
      parsedHref.protocol === parsedFrom.protocol &&
      parsedHref.host === parsedFrom.host
    ) {
      from = parsedFrom.path + (parsedFrom.hash || '');
    }
    this.telemeter.captureNavigation(from, to, null, _.now());
    const replayId = this.rollbar.triggerReplay({
      type: 'navigation',
      path: to,
    });
  }

  deinstrumentConnectivity = function () {
    this.removeListeners('connectivity');
  };

  instrumentConnectivity() {
    const self = this;
    this.addListener(
      'connectivity',
      this._window,
      ['online', 'offline'],
      (evt) => self.handleConnectivity(evt),
    );
  }

  handleConnectivity(evt) {
    const type = evt.type;

    this.telemeter.captureConnectivityChange({
      type,
      isSynthetic: !evt.isTrusted,
      timestamp: _.now(),
    });
  }

  handleCspEvent(cspEvent) {
    let message =
      'Security Policy Violation: ' +
      'blockedURI: ' +
      cspEvent.blockedURI +
      ', ' +
      'violatedDirective: ' +
      cspEvent.violatedDirective +
      ', ' +
      'effectiveDirective: ' +
      cspEvent.effectiveDirective +
      ', ';

    if (cspEvent.sourceFile) {
      message +=
        'location: ' +
        cspEvent.sourceFile +
        ', ' +
        'line: ' +
        cspEvent.lineNumber +
        ', ' +
        'col: ' +
        cspEvent.columnNumber +
        ', ';
    }

    message += 'originalPolicy: ' + cspEvent.originalPolicy;

    this.telemeter.captureLog(message, 'error', null, _.now());
    this.handleCspError(message);
  }

  handleCspError(message) {
    if (this.autoInstrument.errorOnContentSecurityPolicy) {
      this.rollbar.error(message);
    }
  }

  deinstrumentContentSecurityPolicy() {
    this.removeListeners('contentsecuritypolicy');
  }

  instrumentContentSecurityPolicy() {
    if (!('addEventListener' in this._document)) {
      return;
    }

    const cspHandler = this.handleCspEvent.bind(this);
    this.addListener(
      'contentsecuritypolicy',
      this._document,
      ['securitypolicyviolation'],
      cspHandler,
    );
  }

  addListener(section, obj, types, handler) {
    if (obj.addEventListener) {
      for (const t of types) {
        const options = { capture: true, passive: true };
        obj.addEventListener(t, handler, options, true);
        this.eventRemovers[section].push(function () {
          obj.removeEventListener(t, handler, options);
        });
      }
    }
  }

  removeListeners(section) {
    let r;
    while (this.eventRemovers[section].length) {
      r = this.eventRemovers[section].shift();
      r();
    }
  }
}

function _isUrlObject(input) {
  return typeof URL !== 'undefined' && input instanceof URL;
}

export default Instrumenter;
