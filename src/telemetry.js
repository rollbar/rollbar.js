var _ = require('./utility');

function Telemeter(options) {
  this.queue = [];
  this.options = _.extend(true, {}, options);
  var maxTelemetryEvents = this.options.maxTelemetryEvents;
  // pin the queue size to the interval [0, 100]
  this.maxQueueSize = Math.max(0, Math.min(maxTelemetryEvents || 100, 100))
}

Telemeter.prototype.copyEvents = function() {
  return Array.prototype.slice.call(this.queue, 0);
};

Telemeter.prototype.capture = function(type, metadata, level) {
  var e = {
    level: getLevel(type, level),
    type: type,
    timestamp_ms: _.now(),
    body: metadata
  };
  this.push(e);
  return e;
};

Telemeter.prototype.captureEvent = function(metadata, level) {
  return this.capture('manual', metadata, level);
}

Telemeter.prototype.captureError = function(err) {
  return this.capture('error', {
    message: err.message || String(err)
  }, 'error');
};

Telemeter.prototype.captureLog = function(message, level) {
  return this.capture('log', {
    message: message
  }, level);
};

Telemeter.prototype.captureNetwork = function(metadata, subtype) {
  subtype = subtype || 'xhr';
  metadata.subtype = metadata.subtype || subtype;
  return this.capture('network', metadata, 'info');
};

Telemeter.prototype.captureRollbar = function(item) {
  return this.capture('rollbar', {
    subtype: rollbarSubtype(item),
    message: rollbarMessage(item)
  }, item.level);
};

Telemeter.prototype.captureDom = function(subtype, element, value, checked) {
  var metadata = {
    subtype: subtype,
    element: element
  };
  if (value !== undefined) {
    metadata['value'] = value;
  }
  if (checked !== undefined) {
    metadata['checked'] = checked;
  }
  return this.capture('dom', metadata, 'info');
};

Telemeter.prototype.captureNavigation = function(from, to) {
  return this.capture('navigation', {from: from, to: to}, 'info');
};

Telemeter.prototype.captureConnectivityChange = function(type) {
  return this.capture('connectivity', {change: type}, 'info');
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
    'error': 'error',
    'manual': 'info'
  };
  return defaultLevel[type] || 'info';
}

function rollbarSubtype(item) {
  // TODO
  return item.data.body.message ? 'info' : 'error';
}

function rollbarMessage(item) {
  // TODO
  return item.data.message;
}

module.exports = Telemeter;
