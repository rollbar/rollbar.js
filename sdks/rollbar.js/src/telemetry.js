var _ = require('./utility');

var MAX_EVENTS = 100;

function Telemeter(options) {
  this.queue = [];
  this.options = _.extend(true, {}, options);
  var maxTelemetryEvents = this.options.maxTelemetryEvents || MAX_EVENTS;
  this.maxQueueSize = Math.max(0, Math.min(maxTelemetryEvents, MAX_EVENTS));
}

Telemeter.prototype.copyEvents = function() {
  return Array.prototype.slice.call(this.queue, 0);
};

Telemeter.prototype.capture = function(type, metadata, level, rollbarUUID, timestamp) {
  var e = {
    level: getLevel(type, level),
    type: type,
    timestamp_ms: timestamp || _.now(),
    body: metadata
  };
  if (rollbarUUID) {
    e.uuid = rollbarUUID;
  }
  this.push(e);
  return e;
};

Telemeter.prototype.captureEvent = function(metadata, level, rollbarUUID) {
  return this.capture('manual', metadata, level, rollbarUUID);
};

Telemeter.prototype.captureError = function(err, level, rollbarUUID, timestamp) {
  var metadata = {
    message: err.message || String(err)
  };
  if (err.stack) {
    metadata.stack = err.stack;
  }
  return this.capture('error', metadata, level, rollbarUUID, timestamp);
};

Telemeter.prototype.captureLog = function(message, level, rollbarUUID, timestamp) {
  return this.capture('log', {
    message: message
  }, level, rollbarUUID, timestamp);
};

Telemeter.prototype.captureNetwork = function(metadata, subtype, rollbarUUID) {
  subtype = subtype || 'xhr';
  metadata.subtype = metadata.subtype || subtype;
  var level = levelFromStatus(metadata.status_code);
  return this.capture('network', metadata, level, rollbarUUID);
};

Telemeter.prototype.captureItem = function(item) {
  if (item.err) {
    return this.captureError(item.err, item.level, item.uuid, item.timestamp);
  }
  if (item.message) {
    return this.captureLog(item.message, item.level, item.uuid, item.timestamp);
  }
  if (item.custom) {
    return this.capture('log', item.custom, item.level, item.uuid, item.timestamp);
  }
};

Telemeter.prototype.captureDom = function(subtype, element, value, checked, rollbarUUID) {
  var metadata = {
    subtype: subtype,
    element: element
  };
  if (value !== undefined) {
    metadata.value = value;
  }
  if (checked !== undefined) {
    metadata.checked = checked;
  }
  return this.capture('dom', metadata, 'info', rollbarUUID);
};

Telemeter.prototype.captureNavigation = function(from, to, rollbarUUID) {
  return this.capture('navigation', {from: from, to: to}, 'info', rollbarUUID);
};

Telemeter.prototype.captureConnectivityChange = function(type, rollbarUUID) {
  return this.captureNetwork({change: type}, 'connectivity', rollbarUUID);
};

Telemeter.prototype.push = function(e) {
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
    manual: 'info'
  };
  return defaultLevel[type] || 'info';
}

function levelFromStatus(statusCode) {
  if (statusCode >= 200 && statusCode < 400) {
    return 'info';
  }
  if (statusCode >= 400) {
    return 'error';
  }
  return 'info';
}

module.exports = Telemeter;
