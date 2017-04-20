var util = require('util');
var os = require('os');

var packageJson = require('../../package.json');
var Client = require('../rollbar');
var _ = require('../utility');
var logger = require('./logger');

var transforms = require('./transforms');
var predicates = require('./predicates');

function Rollbar(accessToken, options, client) {
  options = options || {};
  options.accessToken = accessToken;
  this.context = 'server';
  this.options = _.extend(true, {}, Rollbar.defaultOptions, options);
  this.options.environment = this.options.environment || process.env.NODE_ENV || 'unspecified';
  this.client = client || new Client(this.context, this.options);
  addTransformsToNotifier(this.client.notifier);
  addPredicatesToQueue(this.client.queue);

  if (this.options.handleUncaughtExceptions) {
    this.handleUncaughtExceptions();
  }
  if (this.options.handleUnhandledRejections) {
    this.handleUnhandledRejects();
  }
}

Rollbar.prototype.global = function(options) {
  this.client.global(options);
  return this;
};

Rollbar.prototype.configure = function(options) {
  var oldOptions = this.options;
  this.options = _.extend(true, {}, oldOptions, options);
  this.client.configure(options);
  return this;
};

Rollbar.prototype.log = function() {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.log(item);
  return {uuid: uuid};
};

Rollbar.prototype.debug = function() {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.debug(item);
  return {uuid: uuid};
};

Rollbar.prototype.info = function() {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.info(item);
  return {uuid: uuid};
};

Rollbar.prototype.warn = function() {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.warn(item);
  return {uuid: uuid};
};

Rollbar.prototype.warning = function() {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.warning(item);
  return {uuid: uuid};
};

Rollbar.prototype.error = function() {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.error(item);
  return {uuid: uuid};
};

Rollbar.prototype.critical = function() {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.critical(item);
  return {uuid: uuid};
};

Rollbar.prototype.wait = function(callback) {
  this.client.wait(callback);
};

Rollbar.prototype.errorHandler = function() {
  return function(err, request, response, next) {
    var cb = function(rollbarError) {
      if (rollbarError) {
        logger.error('Error reporting to rollbar, ignoring: ' + rollbarError);
      }
      return next(err, request, response);
    };
    if (!err) {
      return next(err, request, response);
    }

    if (err instanceof Error) {
      return this.error(err, request, cb);
    }
    return this.error('Error: ' + err, request, cb);
  }.bind(this);
};

/** DEPRECATED **/

Rollbar.prototype.reportMessage = function(message, level, request, callback) {
  logger.log('reportMessage is deprecated');
  if (_.isFunction(this[level])) {
    return this[level](message, request, callback);
  } else {
    return this.error(message, request, callback);
  }
};

Rollbar.prototype.reportMessageWithPayloadData = function(message, payloadData, request, callback) {
  logger.log('reportMessageWithPayloadData is deprecated');
  return this.error(message, request, payloadData, callback);
};

Rollbar.prototype.handleError = function(err, request, callback) {
  logger.log('handleErrorWithPayloadData is deprecated');
  return this.error(err, request, callback);
};

Rollbar.prototype.handleErrorWithPayloadData = function(err, payloadData, request, callback) {
  logger.log('handleErrorWithPayloadData is deprecated');
  return this.error(err, request, payloadData, callback);
};

/** Internal **/

function addTransformsToNotifier(notifier) {
  notifier
    .addTransform(transforms.baseData)
    .addTransform(transforms.addMessageData)
    .addTransform(transforms.buildErrorData)
    .addTransform(transforms.addRequestData)
    .addTransform(transforms.scrubPayload)
    .addTransform(transforms.convertToPayload);
}

function addPredicatesToQueue(queue) {
  queue
    .addPredicate(predicates.checkLevel);
}

/*
 * message/error, callback
 * message/error, request
 * message/error, request, callback
 * message/error, request, custom
 * message/error, request, custom, callback
 */
Rollbar.prototype._createItem = function(args) {
  var messageOrError = args[0];
  var request = args[1];
  var custom = args[2];
  var callback = args[3];

  if (_.isFunction(request) && !callback) {
    callback = request;
    request = null;
  }

  if (_.isFunction(custom) && !callback) {
    callback = custom;
    custom = null;
  }

  var message, err;
  if (_.isError(messageOrError)) {
    err = messageOrError;
  } else {
    message = messageOrError;
  }

  var item = {
    uuid: _.uuid4(),
    err: err,
    message: message,
    callback: callback,
    request: request
  };
  if (custom && custom.level !== undefined) {
    item.level = custom.level;
    delete custom.level;
  }
  item.custom = custom;
  return item;
};

Rollbar.prototype.handleUncaughtExceptions = function() {
  var exitOnUncaught = !!this.options.exitOnUncaughtException;
  delete this.options.exitOnUncaughtException;

  addOrReplaceRollbarHandler('uncaughtException', function(err) {
    this.error(err, function(err) {
      if (err) {
        logger.error('Encountered error while handling an uncaught exception.');
        logger.error(err);
      }

      if (exitOnUncaught) {
        process.exit(1);
      }
    });
  }.bind(this));
};

Rollbar.prototype.handleUnhandledRejections = function() {
  addOrReplaceRollbarHandler('unhandledRejection', function(reason) {
    this.error(reason, function(err) {
      if (err) {
        logger.error('Encountered error while handling an uncaught exception.');
        logger.error(err);
      }
    });
  }.bind(this));
};

function addOrReplaceRollbarHandler(event, action) {
  // We only support up to two arguments which is enough for how this is used
  // rather than dealing with `arguments` and `apply`
  var fn = function(a, b) {
    action(a, b);
  };
  fn._rollbarHandler = true;

  var listeners = process.listeners(event);
  var len = listeners.length;
  for (var i = 0; i < len; ++i) {
    if (listeners[i]._rollbarHandler) {
      process.removeListener(event, listeners[i]);
    }
  }
  process.on(event, fn);
}

function RollbarError(message, nested) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);

  this.message = message;
  this.nested = nested;
  this.name = this.constructor.name;
}
util.inherits(RollbarError, Error);
Rollbar.Error = RollbarError;

Rollbar.defaultOptions = {
  host: os.hostname(),
  environment: 'development',
  framework: 'node-js',
  showReportedMessageTraces: false,
  notifier: {
    name: 'node_rollbar',
    version: packageJson.version
  },
  scrubHeaders: packageJson.defaults.server.scrubHeaders,
  scrubFields: packageJson.defaults.server.scrubFields,
  addRequestData: null,
  reportLevel: packageJson.defaults.reportLevel,
  enabled: true
};

module.exports = Rollbar;
