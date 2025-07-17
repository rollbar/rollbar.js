import * as _ from './utility.js';

const MAX_EVENTS = 100;

// Temporary workaround while solving commonjs -> esm issues in Node 18 - 20.
function fromMillis(millis) {
  return [Math.trunc(millis / 1000), Math.round((millis % 1000) * 1e6)];
}

function Telemeter(options, tracing) {
  this.queue = [];
  this.options = _.merge(options);
  var maxTelemetryEvents = this.options.maxTelemetryEvents || MAX_EVENTS;
  this.maxQueueSize = Math.max(0, Math.min(maxTelemetryEvents, MAX_EVENTS));
  this.tracing = tracing;
  this.telemetrySpan = this.tracing?.startSpan('rollbar-telemetry', {});
}

Telemeter.prototype.configure = function (options) {
  var oldOptions = this.options;
  this.options = _.merge(oldOptions, options);
  var maxTelemetryEvents = this.options.maxTelemetryEvents || MAX_EVENTS;
  var newMaxEvents = Math.max(0, Math.min(maxTelemetryEvents, MAX_EVENTS));
  var deleteCount = 0;
  if (this.queue.length > newMaxEvents) {
    deleteCount = this.queue.length - newMaxEvents;
  }
  this.maxQueueSize = newMaxEvents;
  this.queue.splice(0, deleteCount);
};

Telemeter.prototype.copyEvents = function () {
  var events = Array.prototype.slice.call(this.queue, 0);
  if (_.isFunction(this.options.filterTelemetry)) {
    try {
      var i = events.length;
      while (i--) {
        if (this.options.filterTelemetry(events[i])) {
          events.splice(i, 1);
        }
      }
    } catch (e) {
      this.options.filterTelemetry = null;
    }
  }

  // Remove internal keys from output
  events = events.map((e) => {
    const { otelAttributes, ...event } = e;
    return event;
  });

  return events;
};

Telemeter.prototype.capture = function (
  type,
  metadata,
  level,
  rollbarUUID,
  timestamp = null,
  otelAttributes = null,
) {
  var e = {
    level: getLevel(type, level),
    type: type,
    timestamp_ms: timestamp || _.now(),
    body: metadata,
    source: 'client',
  };
  if (rollbarUUID) {
    e.uuid = rollbarUUID;
  }
  if (otelAttributes) {
    e.otelAttributes = otelAttributes;
  }

  try {
    if (
      _.isFunction(this.options.filterTelemetry) &&
      this.options.filterTelemetry(e)
    ) {
      return false;
    }
  } catch (exc) {
    this.options.filterTelemetry = null;
  }

  this.push(e);
  return e;
};

Telemeter.prototype.captureEvent = function (
  type,
  metadata,
  level,
  rollbarUUID,
) {
  return this.capture(type, metadata, level, rollbarUUID);
};

Telemeter.prototype.captureError = function (
  err,
  level,
  rollbarUUID,
  timestamp,
) {
  const message = err.message || String(err);
  var metadata = { message };
  if (err.stack) {
    metadata.stack = err.stack;
  }
  const otelAttributes = {
    message,
    level,
    type: 'error',
    uuid: rollbarUUID,
  };

  this.telemetrySpan?.addEvent(
    'rollbar-occurrence-event',
    otelAttributes,
    fromMillis(timestamp),
  );

  return this.capture(
    'error',
    metadata,
    level,
    rollbarUUID,
    timestamp,
    otelAttributes,
  );
};

Telemeter.prototype.captureLog = function (
  message,
  level,
  rollbarUUID,
  timestamp,
) {
  let otelAttributes = null;

  // If the uuid is present, this is a message occurrence.
  if (rollbarUUID) {
    otelAttributes =
    {
      message,
      level,
      type: 'message',
      uuid: rollbarUUID,
    },

    this.telemetrySpan?.addEvent(
      'rollbar-occurrence-event',
      otelAttributes,
      fromMillis(timestamp),
    );
  } else {
    otelAttributes = { message, level }
    this.telemetrySpan?.addEvent(
      'rollbar-log-event',
      otelAttributes,
      fromMillis(timestamp),
    );
  }

  return this.capture(
    'log',
    { message },
    level,
    rollbarUUID,
    timestamp,
    otelAttributes,
  );
};

Telemeter.prototype.captureNetwork = function (
  metadata,
  subtype,
  rollbarUUID,
  requestData,
) {
  subtype = subtype || 'xhr';
  metadata.subtype = metadata.subtype || subtype;
  if (requestData) {
    metadata.request = requestData;
  }
  const level = this.levelFromStatus(metadata.status_code);
  const endTimeNano = (metadata.end_time_ms || 0) * 1e6;
  const otelAttributes = {
    type: metadata.subtype,
    method: metadata.method,
    url: metadata.url,
    statusCode: metadata.status_code,
    'request.headers': JSON.stringify(metadata.request_headers || {}),
    'response.headers': JSON.stringify(metadata.response?.headers || {}),
    'response.timeUnixNano': endTimeNano.toString(),
  };

  this.telemetrySpan?.addEvent(
    'rollbar-network-event',
    otelAttributes,
    fromMillis(metadata.start_time_ms),
  );

  return this.capture(
    'network',
    metadata,
    level,
    rollbarUUID,
    metadata.start_time_ms,
    otelAttributes,
  );
};

Telemeter.prototype.levelFromStatus = function (statusCode) {
  if (statusCode >= 200 && statusCode < 400) {
    return 'info';
  }
  if (statusCode === 0 || statusCode >= 400) {
    return 'error';
  }
  return 'info';
};

Telemeter.prototype.captureDom = function (
  subtype,
  element,
  value,
  checked,
  rollbarUUID,
) {
  var metadata = {
    subtype: subtype,
    element: element,
  };
  if (value !== undefined) {
    metadata.value = value;
  }
  if (checked !== undefined) {
    metadata.checked = checked;
  }
  return this.capture('dom', metadata, 'info', rollbarUUID);
};

Telemeter.prototype.captureNavigation = function (
  from,
  to,
  rollbarUUID,
  timestamp,
) {
  this.telemetrySpan?.addEvent(
    'rollbar-navigation-event',
    { 'previous.url.full': from, 'url.full': to },
    fromMillis(timestamp),
  );

  return this.capture(
    'navigation',
    { from, to },
    'info',
    rollbarUUID,
    timestamp,
  );
};

Telemeter.prototype.captureDomContentLoaded = function (ts) {
  return this.capture(
    'navigation',
    { subtype: 'DOMContentLoaded' },
    'info',
    undefined,
    ts && ts.getTime(),
  );
  /**
   * If we decide to make this a dom event instead, then use the line below:
  return this.capture('dom', {subtype: 'DOMContentLoaded'}, 'info', undefined, ts && ts.getTime());
  */
};
Telemeter.prototype.captureLoad = function (ts) {
  return this.capture(
    'navigation',
    { subtype: 'load' },
    'info',
    undefined,
    ts && ts.getTime(),
  );
  /**
   * If we decide to make this a dom event instead, then use the line below:
  return this.capture('dom', {subtype: 'load'}, 'info', undefined, ts && ts.getTime());
  */
};

Telemeter.prototype.captureConnectivityChange = function (type, rollbarUUID) {
  return this.captureNetwork({ change: type }, 'connectivity', rollbarUUID);
};

// Only intended to be used internally by the notifier
Telemeter.prototype._captureRollbarItem = function (item) {
  if (!this.options.includeItemsInTelemetry) {
    return;
  }
  if (item.err) {
    return this.captureError(item.err, item.level, item.uuid, item.timestamp);
  }
  if (item.message) {
    return this.captureLog(item.message, item.level, item.uuid, item.timestamp);
  }
  if (item.custom) {
    return this.capture(
      'log',
      item.custom,
      item.level,
      item.uuid,
      item.timestamp,
    );
  }
};

Telemeter.prototype.push = function (e) {
  this.queue.push(e);
  if (this.queue.length > this.maxQueueSize) {
    this.queue.shift();
  }
};

function getLevel(type, level) {
  if (level) {
    return level;
  }
  var defaultLevel = {
    error: 'error',
    manual: 'info',
  };
  return defaultLevel[type] || 'info';
}

export default Telemeter;
