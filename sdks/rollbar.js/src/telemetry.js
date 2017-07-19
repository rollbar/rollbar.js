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
    timestamp_ms: now(),
    metadata: metadata
  };
  this.push(e);
  return e;
};

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

Telemeter.prototype.captureNetwork = function(method, url, statusCode, subtype) {
  subtype = subtype || 'xhr';
  return this.capture('network', {
    subtype: subtype,
    method: method,
    url: url,
    status_code: statusCode
  }, 'info');
};

Telemeter.prototype.captureRollbar = function(item) {
  return this.capture('rollbar', {
    subtype: rollbarSubtype(item),
    message: rollbarMessage(item)
  }, item.level);
};

Telemeter.prototype.captureDom = function(subtype, element, value) {
  var metadata = {
    subtype: subtype,
    element: element
  };
  if (value) {
    metadata['value'] = value;
  }
  return this.capture('dom', metadata, 'info');
};

Telemeter.prototype.push = function(e) {
  this.queue.push(e);
  if (this.queue.length > this.maxQueueSize) {
    this.queue.shift();
  }
};

function now() {
  if (Date.now) {
    return Date.now();
  }
  return +new Date();
}

function getLevel(type, level) {
  if (level) {
    return level;
  }
  var defaultLevel = {
    'error': 'error'
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
