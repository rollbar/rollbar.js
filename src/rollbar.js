var RateLimiter = require('./rateLimiter');
var Queue = require('./queue');
var Notifier = require('./notifier');
var API = require('./api');
var _ = require('./utility');

/*
 * Rollbar - the interface to Rollbar
 *
 * @param context (browser|server) - define the environment
 * @param options
 */
function Rollbar(context, options) {
  this.options = _.extend(true, {}, options);
  var api = new (API(context))(options);
  this.queue = new Queue(Rollbar.rateLimiter, api, options); 
  this.notifier = new Notifier(this.queue, options);
};

var defaultOptions = {
  maxItems: 0,
  itemsPerMinute: 60
};

Rollbar.rateLimiter = new RateLimiter(defaultOptions);

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

/* Internal */

Rollbar.prototype._log = function(defaultLevel, item) {
  _.wrapRollbarFunction(function() {
    var callback = null;
    if (item.callback) {
      callback = item.callback;
      delete item.callback;
    }
    item.level = item.level || defaultLevel;
    this.notifier.log(item, callback);
  }, this)();
};

Rollbar.prototype._defaultLogLevel = function() {
  return this.options.logLevel || 'debug';
};

module.exports = Rollbar;
