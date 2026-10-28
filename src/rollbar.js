import Notifier from './notifier.js';
import Queue from './queue.js';
import RateLimiter from './rateLimiter.js';
import * as _ from './utility.js';

/*
 * Rollbar - the interface to Rollbar
 *
 * @param options
 * @param api
 * @param logger
 */
function Rollbar(options, api, logger, telemeter, tracing, replay, platform) {
  this.options = _.merge(options);
  this.logger = logger;
  Rollbar.rateLimiter.configureGlobal(this.options);
  Rollbar.rateLimiter.setPlatformOptions(platform, this.options);
  this.api = api;
  this.queue = new Queue(
    Rollbar.rateLimiter,
    api,
    logger,
    this.options,
    replay,
  );

  this.tracing = tracing;

  // This must happen before the Notifier is created
  this._setTracer(this.options.tracer);

  this.notifier = new Notifier(this.queue, this.options);
  this.telemeter = telemeter;
  setStackTraceLimit(options);
  this.lastError = null;
  this.lastErrorHash = 'none';
}

var defaultOptions = {
  maxItems: 0,
  itemsPerMinute: 60,
};

Rollbar.rateLimiter = new RateLimiter(defaultOptions);

Rollbar.prototype.global = function (options) {
  Rollbar.rateLimiter.configureGlobal(options);
  return this;
};

Rollbar.prototype.configure = function (options, payloadData) {
  var oldOptions = this.options;
  var payload = {};
  if (payloadData) {
    payload = { payload: payloadData };
  }

  this.options = _.merge(oldOptions, options, payload);

  // Only a tracer passed in this call is resolved. The merged options hold
  // the placeholder string set by _setTracer, so resolving those would drop
  // the tracer on every unrelated configure() call.
  // This must happen before the Notifier is configured
  if (_.hasOwn(options, 'tracer')) {
    this._setTracer(options.tracer);
  }

  this.notifier && this.notifier.configure(this.options);
  this.telemeter && this.telemeter.configure(this.options);
  setStackTraceLimit(options);
  this.global(this.options);

  return this;
};

Rollbar.prototype.log = function (item) {
  var level = this._defaultLogLevel();
  return this._log(level, item);
};

Rollbar.prototype.debug = function (item) {
  this._log('debug', item);
};

Rollbar.prototype.info = function (item) {
  this._log('info', item);
};

Rollbar.prototype.warn = function (item) {
  this._log('warning', item);
};

Rollbar.prototype.warning = function (item) {
  this._log('warning', item);
};

Rollbar.prototype.error = function (item) {
  this._log('error', item);
};

Rollbar.prototype.critical = function (item) {
  this._log('critical', item);
};

Rollbar.prototype.wait = function (callback) {
  this.queue.wait(callback);
};

Rollbar.prototype.captureEvent = function (type, metadata, level) {
  return this.telemeter && this.telemeter.captureEvent(type, metadata, level);
};

Rollbar.prototype.captureDomContentLoaded = function (ts) {
  return this.telemeter && this.telemeter.captureDomContentLoaded(ts);
};

Rollbar.prototype.captureLoad = function (ts) {
  return this.telemeter && this.telemeter.captureLoad(ts);
};

Rollbar.prototype.buildJsonPayload = function (item) {
  return this.api.buildJsonPayload(item);
};

Rollbar.prototype.sendJsonPayload = function (jsonPayload) {
  this.api.postJsonPayload(jsonPayload);
};

/* Internal */

Rollbar.prototype._log = function (defaultLevel, item) {
  var callback;
  if (item.callback) {
    callback = item.callback;
    delete item.callback;
  }
  if (this.options.ignoreDuplicateErrors && this._sameAsLastError(item)) {
    if (callback) {
      var error = new Error('ignored identical item');
      error.item = item;
      callback(error);
    }
    return;
  }
  try {
    item.level = item.level || defaultLevel;

    this._addItemAttributes(item);

    this._addTracingInfo(item);

    const telemeter = this.telemeter;
    if (telemeter) {
      telemeter._captureRollbarItem(item);
      item.telemetryEvents = telemeter.copyEvents() || [];
    }

    this.notifier.log(item, callback);
  } catch (e) {
    if (callback) {
      callback(e);
    }
    this.logger.error(e);
  }
};

Rollbar.prototype._addItemAttributes = function (item) {
  const span = this.tracing?.getSpan();
  const asyncLocalSessionId = _.getSessionIdFromAsyncLocalStorage(this);
  const sessionId = asyncLocalSessionId || this.tracing?.sessionId;

  const attributes = [
    { key: 'session_id', value: sessionId },
    { key: 'span_id', value: span?.spanId },
    { key: 'trace_id', value: span?.traceId },
  ];
  if (item._isUncaught) {
    attributes.push({ key: 'is_uncaught', value: 'true' });
  }
  _.addItemAttributes(item.data, attributes);

  span?.addEvent('rollbar.occurrence', [
    { key: 'rollbar.occurrence.uuid', value: item.uuid },
  ]);
};

Rollbar.prototype._defaultLogLevel = function () {
  return this.options.logLevel || 'debug';
};

Rollbar.prototype._sameAsLastError = function (item) {
  if (!item._isUncaught) {
    return false;
  }
  var itemHash = generateItemHash(item);
  if (this.lastErrorHash === itemHash) {
    return true;
  }
  this.lastError = item.err;
  this.lastErrorHash = itemHash;
  return false;
};

/**
 * Sets the tracer used to link items to the caller's active span.
 *
 * Supported tracers are those exposing `scope().active()` (dd-trace and other
 * OpenTracing tracers with a scope manager) and the OpenTelemetry `trace` API
 * from `@opentelemetry/api`. Anything else is ignored and an error is logged.
 *
 * @param {object} tracer - The `tracer` option.
 */
Rollbar.prototype._setTracer = function (tracer) {
  const kind = getTracerKind(tracer);
  this.tracer = kind ? tracer : null;
  this._tracerKind = kind;

  if (kind) {
    // set to a string for api response serialization
    this.options.tracer = TRACER_PLACEHOLDERS[kind];
    this.options._configuredOptions.tracer = TRACER_PLACEHOLDERS[kind];
  } else if (tracer) {
    this.logger.error(
      'The tracer option was ignored. Pass the `trace` object from ' +
        '@opentelemetry/api for OpenTelemetry, or a tracer with ' +
        'scope().active() such as dd-trace.',
    );
  }
};

/**
 * Tags the tracer's active span with the item's uuid and adds the span's
 * trace and span IDs to `item.custom`. Does nothing without an active span.
 *
 * @param {object} item - The item being logged.
 */
Rollbar.prototype._addTracingInfo = function (item) {
  if (!this.tracer) {
    return;
  }

  const ids =
    this._tracerKind === 'opentelemetry'
      ? tagOpenTelemetrySpan(this.tracer.getActiveSpan(), item)
      : tagOpenTracingSpan(this.tracer.scope().active(), item);

  if (!ids) {
    return;
  }

  // The field names predate OpenTelemetry support and are kept for both
  // tracer kinds so existing queries on them keep working.
  item.custom = item.custom || {};
  item.custom.opentracing_span_id = ids.spanId;
  item.custom.opentracing_trace_id = ids.traceId;
};

function generateItemHash(item) {
  var message = item.message || '';
  var stack = (item.err || {}).stack || String(item.err);
  return message + '::' + stack;
}

// Node.js, Chrome, Safari, and some other browsers support this property
// which globally sets the number of stack frames returned in an Error object.
// If a browser can't use it, no harm done.
function setStackTraceLimit(options) {
  if (options.stackTraceLimit) {
    Error.stackTraceLimit = options.stackTraceLimit;
  }
}

const TRACER_PLACEHOLDERS = {
  opentracing: 'opentracing-tracer-enabled',
  opentelemetry: 'opentelemetry-tracer-enabled',
};

// SpanStatusCode.ERROR in @opentelemetry/api
const OTEL_STATUS_ERROR = 2;

/**
 * Identifies how to read the active span from a tracer.
 *
 * @param {object} tracer - The `tracer` option.
 * @returns {'opentracing'|'opentelemetry'|null} The tracer kind, or null if
 *   the active span can't be read from it.
 */
function getTracerKind(tracer) {
  if (!tracer) {
    return null;
  }

  if (typeof tracer.scope === 'function') {
    const scope = tracer.scope();
    if (scope && typeof scope.active === 'function') {
      return 'opentracing';
    }
  }

  if (typeof tracer.getActiveSpan === 'function') {
    return 'opentelemetry';
  }

  return null;
}

/**
 * Builds the span tags that link a span to a Rollbar item.
 *
 * @param {object} item - The item being logged.
 * @returns {object} Tag names mapped to values.
 */
function rollbarSpanTags(item) {
  return {
    'rollbar.error_uuid': item.uuid,
    'rollbar.has_error': true,
    'rollbar.item_url': `https://rollbar.com/item/uuid/?uuid=${item.uuid}`,
    'rollbar.occurrence_url': `https://rollbar.com/occurrence/uuid/?uuid=${item.uuid}`,
  };
}

/**
 * Tags a span from `tracer.scope().active()`.
 *
 * @param {object} span - An OpenTracing span, or null.
 * @param {object} item - The item being logged.
 * @returns {{spanId: string, traceId: string}|null} The span's IDs, or null if
 *   it isn't a usable span.
 */
function tagOpenTracingSpan(span, item) {
  if (!span || typeof span.context !== 'function') {
    return null;
  }

  const spanContext = span.context();
  if (
    !spanContext ||
    typeof spanContext.toSpanId !== 'function' ||
    typeof spanContext.toTraceId !== 'function'
  ) {
    return null;
  }

  const tags = rollbarSpanTags(item);
  for (const key of Object.keys(tags)) {
    span.setTag(key, tags[key]);
  }
  span.setTag('error', true);

  return {
    spanId: spanContext.toSpanId(),
    traceId: spanContext.toTraceId(),
  };
}

/**
 * Tags a span from OpenTelemetry's `trace.getActiveSpan()`.
 *
 * The span's status is only set to ERROR for error and critical items, since
 * OpenTelemetry treats that status as the operation having failed.
 *
 * @param {object} span - An OpenTelemetry span, or undefined.
 * @param {object} item - The item being logged.
 * @returns {{spanId: string, traceId: string}|null} The span's IDs, or null if
 *   it isn't a usable span.
 */
function tagOpenTelemetrySpan(span, item) {
  if (
    !span ||
    typeof span.spanContext !== 'function' ||
    typeof span.setAttributes !== 'function'
  ) {
    return null;
  }

  const { spanId, traceId } = span.spanContext() || {};
  if (!isValidOtelId(spanId) || !isValidOtelId(traceId)) {
    return null;
  }

  span.setAttributes(rollbarSpanTags(item));
  if (
    (item.level === 'error' || item.level === 'critical') &&
    typeof span.setStatus === 'function'
  ) {
    span.setStatus({ code: OTEL_STATUS_ERROR });
  }

  return { spanId, traceId };
}

/**
 * OpenTelemetry represents a missing span context with all-zero IDs.
 *
 * @param {string} id - A trace or span ID.
 * @returns {boolean} Whether the ID identifies a real span or trace.
 */
function isValidOtelId(id) {
  return typeof id === 'string' && /[1-9a-f]/i.test(id);
}

export default Rollbar;
