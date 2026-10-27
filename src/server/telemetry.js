import http from 'http';
import https from 'https';

import replace from '../utility/replace.js';
import * as _ from '../utility.js';

import * as urlHelpers from './telemetry/urlHelpers.js';

var defaults = {
  network: true,
  networkResponseHeaders: false,
  networkRequestHeaders: false,
  log: true,
};

function Instrumenter(options, telemeter, rollbar) {
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
  this.telemeter = telemeter;
  this.rollbar = rollbar;
  this.diagnostic = rollbar.client.notifier.diagnostic;
  this.replacements = {
    log: [],
  };
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
};

Instrumenter.prototype.instrument = function (oldSettings) {
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
};

// `http.request`, `https.request` and `fetch` are process-wide, but each
// Rollbar instance has its own Instrumenter. Wrapping them once per instance
// nested the wrappers, so every request got one `error` listener per instance
// and `MaxListenersExceededWarning` after ten (rollbar/rollbar.js#982). They are
// wrapped once instead, and each request is reported to every instrumenter in
// this set.
const networkInstrumenters = new Set();
const networkReplacements = { network: [] };

Instrumenter.prototype.deinstrumentNetwork = function () {
  networkInstrumenters.delete(this);
  if (networkInstrumenters.size === 0) {
    restore(networkReplacements, 'network');
  }
};

Instrumenter.prototype.instrumentNetwork = function () {
  networkInstrumenters.add(this);
  if (networkReplacements.network.length) {
    return;
  }
  replace(
    http,
    'request',
    (orig) => networkRequestWrapper(orig, http),
    networkReplacements,
    'network',
  );
  replace(
    https,
    'request',
    (orig) => networkRequestWrapper(orig, https),
    networkReplacements,
    'network',
  );
  if (typeof globalThis.fetch === 'function') {
    replace(
      globalThis,
      'fetch',
      fetchRequestWrapper,
      networkReplacements,
      'network',
    );
  }
};

/**
 * Wraps `http.request` or `https.request` so each request is captured by every
 * registered instrumenter, with a single response callback and a single
 * `error` listener however many instrumenters there are.
 *
 * @param {Function} orig - The original `request` function.
 * @param {Object} transport - The `http` or `https` module that owns `orig`.
 * @returns {Function} The wrapped `request` function.
 */
function networkRequestWrapper(orig, transport) {
  return (...args) => {
    const instrumenters = [...networkInstrumenters];
    if (!instrumenters.length) {
      return orig.apply(transport, args);
    }

    const [url, options, cb] = args;
    var mergedOptions = urlHelpers.mergeOptions(url, options, cb);
    const requestUrl = urlHelpers.constructUrl(mergedOptions.options);
    // Each instrumenter gets its own copy of the options: `captureHttpRequest`
    // may add a baggage header and keeps a reference to the headers, which must
    // not leak into another instance's telemetry.
    const captures = instrumenters.map((instrumenter) => ({
      autoInstrument: instrumenter.autoInstrument,
      metadata: instrumenter.captureHttpRequest(
        urlHelpers.mergeOptions(url, options, cb),
        requestUrl,
      ),
    }));

    var wrappedCallback = responseCallbackWrapper(captures, mergedOptions.cb);
    if (mergedOptions.cb) {
      args.pop();
    }
    args.push(wrappedCallback);
    var req = orig.apply(transport, args);

    req.on('error', (err) => {
      for (const { metadata } of captures) {
        metadata.status_code = 0;
        metadata.error = [err.name, err.message].join(': ');
      }
    });

    return req;
  };
}

/**
 * Records an outgoing `http`/`https` request in this instrumenter's telemetry,
 * adding the session baggage header first when tracing propagation allows it.
 *
 * @param {{options: Object, cb: Function}} mergedOptions - Output of `urlHelpers.mergeOptions`.
 * @param {string} requestUrl - The request URL.
 * @returns {Object} The telemetry metadata, completed when the response or error arrives.
 */
Instrumenter.prototype.captureHttpRequest = function (
  mergedOptions,
  requestUrl,
) {
  const sessionId = _.getSessionIdFromAsyncLocalStorage(this.rollbar.client);

  if (
    sessionId &&
    _.shouldAddBaggageHeader(this.options, { sessionId }, requestUrl)
  ) {
    if (!mergedOptions.options.headers) {
      mergedOptions.options.headers = {};
    }
    mergedOptions.options.headers.baggage = `rollbar.session.id=${sessionId}`;
  }

  var metadata = {
    method: mergedOptions.options.method || 'GET',
    url: requestUrl,
    status_code: null,
    start_time_ms: _.now(),
    end_time_ms: null,
  };

  if (this.autoInstrument.networkRequestHeaders) {
    metadata.request_headers = mergedOptions.options.headers;
  }
  this.telemeter.captureNetwork(metadata, 'http');
  return metadata;
};

function responseCallbackWrapper(captures, callback) {
  return function (res) {
    for (const { autoInstrument, metadata } of captures) {
      metadata.end_time_ms = _.now();
      metadata.status_code = res.statusCode;
      metadata.response = {};
      if (autoInstrument.networkResponseHeaders) {
        metadata.response.headers = res.headers;
      }
    }

    if (callback) {
      return callback.apply(undefined, arguments);
    }
  };
}

/**
 * Wraps `fetch` so each request is captured by every registered instrumenter.
 *
 * @param {Function} orig - The original `fetch` function.
 * @returns {Function} The wrapped `fetch` function.
 */
function fetchRequestWrapper(orig) {
  return (...args) => {
    const instrumenters = [...networkInstrumenters];
    if (!instrumenters.length) {
      return orig.apply(globalThis, args);
    }

    const captures = instrumenters.map((instrumenter) => ({
      autoInstrument: instrumenter.autoInstrument,
      metadata: instrumenter.captureFetchRequest(args),
    }));

    return orig.apply(globalThis, args).then(
      (res) => {
        for (const { autoInstrument, metadata } of captures) {
          metadata.end_time_ms = _.now();
          metadata.status_code = res.status;
          if (autoInstrument.networkResponseHeaders) {
            const responseHeaders = normalizeFetchHeaders(res.headers);
            if (responseHeaders) {
              metadata.response = metadata.response || {};
              metadata.response.headers = responseHeaders;
            }
          }
        }
        return res;
      },
      (err) => {
        for (const { metadata } of captures) {
          metadata.end_time_ms = _.now();
          metadata.status_code = 0;
          metadata.error = [err.name, err.message].join(': ');
        }
        throw err;
      },
    );
  };
}

/**
 * Records an outgoing `fetch` in this instrumenter's telemetry, adding the
 * session baggage header to `args` first when tracing propagation allows it.
 *
 * @param {Array} args - The arguments `fetch` was called with.
 * @returns {Object} The telemetry metadata, completed when the response or error arrives.
 */
Instrumenter.prototype.captureFetchRequest = function (args) {
  const input = args[0];
  const init = args[1];
  let method = 'GET';
  let url;
  const sessionId = _.getSessionIdFromAsyncLocalStorage(this.rollbar.client);

  if (_.isType(input, 'string') || input instanceof URL) {
    url = input.toString();
  } else if (input) {
    url = input.url;
    if (input.method) {
      method = input.method;
    }
  }

  if (init && init.method) {
    method = init.method;
  }

  if (sessionId && _.shouldAddBaggageHeader(this.options, { sessionId }, url)) {
    const headers = { baggage: `rollbar.session.id=${sessionId}` };

    _.addHeadersToFetch(args, headers);
  }

  const metadata = {
    method: method,
    url: url,
    status_code: null,
    start_time_ms: _.now(),
    end_time_ms: null,
  };

  if (this.autoInstrument.networkRequestHeaders) {
    const requestHeaders = normalizeFetchHeaders(
      init && init.headers ? init.headers : input && input.headers,
    );
    if (requestHeaders) {
      metadata.request_headers = requestHeaders;
    }
  }

  this.telemeter.captureNetwork(metadata, 'fetch');
  return metadata;
};

function normalizeFetchHeaders(headers) {
  if (!headers) return null;
  if (typeof headers.forEach === 'function') {
    const normalized = {};
    headers.forEach((value, key) => {
      normalized[key] = value;
    });
    return normalized;
  }
  if (Array.isArray(headers)) {
    const normalized = {};
    headers.forEach((pair) => {
      if (pair && pair.length > 1) {
        normalized[pair[0]] = pair[1];
      }
    });
    return normalized;
  }
  if (_.isType(headers, 'object')) {
    return headers;
  }
  return null;
}

Instrumenter.prototype.captureNetwork = function (
  metadata,
  subtype,
  rollbarUUID,
) {
  return this.telemeter.captureNetwork(metadata, subtype, rollbarUUID);
};

Instrumenter.prototype.deinstrumentConsole = function () {
  restore(this.replacements, 'log');
};

Instrumenter.prototype.instrumentConsole = function () {
  var telemeter = this.telemeter;

  var stdout = process.stdout;
  replace(
    stdout,
    'write',
    function (orig) {
      return function (string) {
        telemeter.captureLog(string, 'info');
        return orig.apply(stdout, arguments);
      };
    },
    this.replacements,
    'log',
  );

  var stderr = process.stderr;
  replace(
    stderr,
    'write',
    function (orig) {
      return function (string) {
        telemeter.captureLog(string, 'error');
        return orig.apply(stderr, arguments);
      };
    },
    this.replacements,
    'log',
  );
};

function restore(replacements, type) {
  var b;
  while (replacements[type].length) {
    b = replacements[type].shift();
    b[0][b[1]] = b[2];
  }
}

export default Instrumenter;
