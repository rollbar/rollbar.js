
var Client = null;
function init(context) {
  if (context == 'server') {
    Client = require('./server/client');
  } else {
    Client = require('./browser/client');
  }
}

Notifier._topLevel = null;

/**
 * Notifier is the internal interface for interacting with Rollbar
 *
 * @param options {
 * }
 *
 * @param {Notifier} [parentNotifier] - A Notifier instance to nest this new one inside of
 */
function Notifier(options, parentNotifier) {
  Notifier._topLevel = Notifier._topLevel || this;
  this.lastError = null; 
  this.parentNotifier = parentNotifier;

  var defaultOptions = {
    enabled: true,
    endpoint: 'https://' + Notifier.DEFAULT_ENDPOINT;
    environment: 'production',
    scrubFields: extend([], Notifier.DEFAULT_SCRUB_FIELDS),
    checkIgnore: null,
    logLevel: Notifier.DEFAULT_LOG_LEVEL,
    reportLevel: Notifier.DEFAULT_REPORT_LEVEL,
    uncaughtErrorLevel: Notifier.DEFAULT_UNCAUGHT_ERROR_LEVEL,
    payload: {}
  };

  var parentOptions = parentNotifier.options || {};
  options = options || {};
  this.options = extend(true, {}, defaultOptions, parentOptions, options);

  if (parentNotifier && parentNotifier.hasOwnProperty('shimId')) {
    parentNotifier.notifier = this;
  }
}

Notifier.globalSettings = {
  startTime: (new Date()).getTime(),
  maxItems: undefined,
  itemsPerMinute: undefined
};

var rateLimitStartTime = new Date().getTime();
var rateLimitCounter = 0;
var rateLimitPerMinCounter = 0;

Notifier.prototype.log = function (level, payload, callback) {
  var now = new Date().getTime();
  if (now - rateLimitStartTime >= 60000) {
    rateLimitStartTime = now;
    rateLimitPerMinCounter = 0;
  }

  var globalRateLimit = Notifier.globalSettings.maxItems;
  var globalRateLimitPerMin = Notifier.globalSettings.itemsPerMinute;

  var checkOverRateLimit = function() {
    return !payload.ignoreRateLimit
      && globalRateLimit >= 1
      && rateLimitCounter >= globalRateLimit;
  }

  var checkOverRateLimitPerMin = function() {
    return !payload.ignoreRateLimit
      && globalRateLimitPerMin >= 1
      && rateLimitPerMinCounter >= globalRateLimitPerMin;
  }

  if (checkOverRateLimit()) {
    callback(new Error(globalRateLimit + ' max items reached'));
    return;
  } else if (checkOverRateLimitPerMin()) {
    callback(new Error(globalRateLimitPerMin + ' items per minute reached'));
    return;
  } else {
    rateLimitCounter++;
    rateLimitPerMinCounter++;

    if (checkOverRateLimit()) {
      var thisLevel = Notifier.topLevel.options.uncaughtErrorLevel;
      var thisPayload = {
        message: 'maxItems has been hit. Ignoring errors until reset.',
        err: null,
        custom: {
          maxItems: globalRateLimit
        },
        ignoreRateLimit: true
      };
      Notifier._topLevel.log(thisLevel, thisPayload, null);
    }
    if (payload.ignoreRateLimit) {
      delete payload.ignoreRateLimit;
    }
  }

  return Client.log(level, payload, callback);
}

Notifier.prototype.uncaughtError = function() {}
Notifier.prototype.unhandledRejection = function() {}


Notifier.prototype.configure = function(options, overwrite) {}

/**
 * Create a new Notifier instance which has the same options as the current notifier,
 * with the optional options parameter used to override them.
 *
 * @param {object} [options] - Notifier options to override the options that would otherwise
 *   be inherited from the current notifier.
 *
 */
Notifier.prototype.scope = function(options) {}


/*
 * Internals
 */

function _generateLogFunction(level) {
  return _wrap(function _logFunction() {
    var args = this._parseLogArguments(arguments);
    var level = level || args.level || this.options.logLevel;
    return this._log(level, args, callback);
  });
}

function _wrap(f) {
  return f;
}

Notifier.prototype._log = function(level, payload, callback) {
  if (!callback) {
    callback = function dummy() {};
  }
};


module.exports = function(context) {
  init(context);
  return Notifier;
};

/**
 * Functions for reporting errors to Rollbar
 *
 *
 * @param {...(string|function|date|error|object|array)} var_args - We introspect the arguments
 *   passed to allow for a flexible reporting format. We attempt to populate the following fields:
 *   message, error,
 *   by using the first argument that matches the corresponding type:
 *   string, Error
 *   respectively. All other arguments are used to populate an object of custom data.
 *   We use the last argument of functional type as the desired callback.
 *   For example, 
 *     log('problem',
 *         'occurred',
 *         function() { doSomething(); },
 *         function() { somethingElse(); },
 *         'stuff')
 *       message = 'problem'
 *       callback = function() { somethingElse(); }
 *       custom = {extraArgs: ['occured', 'stuff']}
 */
