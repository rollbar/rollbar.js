var RateLimiter = require('./rateLimiter');
var Queue = require('./queue');
var Notifier = require('./notifier');
var Telemeter = require('./telemetry');
var _ = require('./utility');

/*
 * Rollbar - the interface to Rollbar
 *
 * @param options
 * @param api
 * @param logger
 */
function Rollbar(options, api, logger, platform) {
  this.options = _.extend(true, {}, options);
  this.logger = logger;
  Rollbar.rateLimiter.configureGlobal(this.options);
  Rollbar.rateLimiter.setPlatformOptions(platform, this.options);
  this.queue = new Queue(Rollbar.rateLimiter, api, logger, this.options);
  this.notifier = new Notifier(this.queue, this.options);
  this.telemeter = new Telemeter(this.options);
  this.lastError = null;
}

var defaultOptions = {
  maxItems: 0,
  itemsPerMinute: 60
};

Rollbar.rateLimiter = new RateLimiter(defaultOptions);

Rollbar.prototype.global = function(options) {
  Rollbar.rateLimiter.configureGlobal(options);
  return this;
};

Rollbar.prototype.configure = function(options, payloadData) {
  this.notifier && this.notifier.configure(options);
  this.telemeter && this.telemeter.configure(options);
  var oldOptions = this.options;
  var payload = {};
  if (payloadData) {
    payload = {payload: payloadData};
  }
  this.options = _.extend(true, {}, oldOptions, options, payload);
  this.global(this.options);
  return this;
};

Rollbar.prototype.log = function(item) {
  var level = this._defaultLogLevel();
  return this._log(level, item);
};

Rollbar.prototype.debug = function(item) {
  this._log('debug', item);
};

Rollbar.prototype.info = function(item) {
  this._log('info', item);
};

Rollbar.prototype.warn = function(item) {
  this._log('warning', item);
};

Rollbar.prototype.warning = function(item) {
  this._log('warning', item);
};

Rollbar.prototype.error = function(item) {
  this._log('error', item);
};

Rollbar.prototype.critical = function(item) {
  this._log('critical', item);
};

Rollbar.prototype.wait = function(callback) {
  this.queue.wait(callback);
};

Rollbar.prototype.captureEvent = function(metadata, level) {
  return this.telemeter.captureEvent(metadata, level);
};

Rollbar.prototype.captureDomContentLoaded = function(ts) {
  return this.telemeter.captureDomContentLoaded(ts);
};

Rollbar.prototype.captureLoad = function(ts) {
  return this.telemeter.captureLoad(ts);
};

/* Internal */

Rollbar.prototype._log = function(defaultLevel, item) {
  if (this._sameAsLastError(item)) {
    return;
  }
  try {
    var callback = null;
    if (item.callback) {
      callback = item.callback;
      delete item.callback;
    }
    item.level = item.level || defaultLevel;
    item.telemetryEvents = this.telemeter.copyEvents();
    this.telemeter._captureRollbarItem(item);
    this.notifier.log(item, callback);
  } catch (e) {
    this.logger.error(e)
  }
};

Rollbar.prototype._defaultLogLevel = function() {
  return this.options.logLevel || 'debug';
};

Rollbar.prototype._sameAsLastError = function(item) {
  if (this.lastError && this.lastError === item.err) {
    return true;
  }
  this.lastError = item.err;
  return false;
};

module.exports = Rollbar;
