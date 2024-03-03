var util = require('util');
var os = require('os');

var packageJson = require('../../package.json');
var Client = require('../rollbar');
var _ = require('../utility');
var API = require('../api');
var logger = require('./logger');

var Transport = require('./transport');
var urllib = require('url');
var jsonBackup = require('json-stringify-safe');

var Telemeter = require('../telemetry');
var Instrumenter = require('./telemetry');
var transforms = require('./transforms');
var sharedTransforms = require('../transforms');
var sharedPredicates = require('../predicates');
var truncation = require('../truncation');
var polyfillJSON = require('../../vendor/JSON-js/json3');

function Rollbar(options, client) {
  if (_.isType(options, 'string')) {
    var accessToken = options;
    options = {};
    options.accessToken = accessToken;
  }
  if (options.minimumLevel !== undefined) {
    options.reportLevel = options.minimumLevel;
    delete options.minimumLevel;
  }
  this.options = _.handleOptions(Rollbar.defaultOptions, options, null, logger);
  this.options._configuredOptions = options;
  // On the server we want to ignore any maxItems setting
  delete this.options.maxItems;
  this.options.environment = this.options.environment || 'unspecified';
  logger.setVerbose(this.options.verbose);
  this.lambdaContext = null;
  this.lambdaTimeoutHandle = null;
  var transport = new Transport();
  var api = new API(this.options, transport, urllib, truncation, jsonBackup);
  var telemeter = new Telemeter(this.options);
  this.client =
    client || new Client(this.options, api, logger, telemeter, 'server');
  this.instrumenter = new Instrumenter(
    this.options,
    this.client.telemeter,
    this,
  );
  this.instrumenter.instrument();
  if (this.options.locals) {
    this.locals = initLocals(this.options.locals, logger);
  }
  addTransformsToNotifier(this.client.notifier);
  addPredicatesToQueue(this.client.queue);
  this.setupUnhandledCapture();
  _.setupJSON(polyfillJSON);
}

function initLocals(localsOptions, logger) {
  // Capturing stack local variables is only supported in Node 10 and higher.
  var nodeMajorVersion = process.versions.node.split('.')[0];
  if (nodeMajorVersion < 10) {
    return null;
  }

  var Locals;
  if (typeof localsOptions === 'function') {
    Locals = localsOptions;
    localsOptions = null; // use defaults
  } else if (_.isType(localsOptions, 'object')) {
    Locals = localsOptions.module;
    delete localsOptions.module;
  } else {
    logger.error(
      'options.locals or options.locals.module must be a Locals module',
    );
    return null;
  }
  return new Locals(localsOptions, logger);
}

var _instance = null;
Rollbar.init = function (options, client) {
  if (_instance) {
    return _instance.global(options).configure(options);
  }
  _instance = new Rollbar(options, client);
  return _instance;
};

function handleUninitialized(maybeCallback) {
  var message = 'Rollbar is not initialized';
  logger.error(message);
  if (maybeCallback) {
    maybeCallback(new Error(message));
  }
}

Rollbar.prototype.global = function (options) {
  options = _.handleOptions(options);
  // On the server we want to ignore any maxItems setting
  delete options.maxItems;
  this.client.global(options);
  return this;
};
Rollbar.global = function (options) {
  if (_instance) {
    return _instance.global(options);
  } else {
    handleUninitialized();
  }
};

Rollbar.prototype.configure = function (options, payloadData) {
  var oldOptions = this.options;
  var payload = {};
  if (payloadData) {
    payload = { payload: payloadData };
  }
  this.options = _.handleOptions(oldOptions, options, payload, logger);
  this.options._configuredOptions = _.handleOptions(
    oldOptions._configuredOptions,
    options,
    payload,
  );
  // On the server we want to ignore any maxItems setting
  delete this.options.maxItems;
  logger.setVerbose(this.options.verbose);
  this.client.configure(options, payloadData);
  this.setupUnhandledCapture();

  if (this.options.locals) {
    if (this.locals) {
      this.locals.updateOptions(this.options.locals);
    } else {
      this.locals = initLocals(this.options.locals, logger);
    }
  }
  return this;
};
Rollbar.configure = function (options, payloadData) {
  if (_instance) {
    return _instance.configure(options, payloadData);
  } else {
    handleUninitialized();
  }
};

Rollbar.prototype.lastError = function () {
  return this.client.lastError;
};
Rollbar.lastError = function () {
  if (_instance) {
    return _instance.lastError();
  } else {
    handleUninitialized();
  }
};

Rollbar.prototype.log = function () {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.log(item);
  return { uuid: uuid };
};
Rollbar.log = function () {
  if (_instance) {
    return _instance.log.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};

Rollbar.prototype.debug = function () {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.debug(item);
  return { uuid: uuid };
};
Rollbar.debug = function () {
  if (_instance) {
    return _instance.debug.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};

Rollbar.prototype.info = function () {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.info(item);
  return { uuid: uuid };
};
Rollbar.info = function () {
  if (_instance) {
    return _instance.info.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};

Rollbar.prototype.warn = function () {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.warn(item);
  return { uuid: uuid };
};
Rollbar.warn = function () {
  if (_instance) {
    return _instance.warn.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};

Rollbar.prototype.warning = function () {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.warning(item);
  return { uuid: uuid };
};
Rollbar.warning = function () {
  if (_instance) {
    return _instance.warning.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};

Rollbar.prototype.error = function () {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.error(item);
  return { uuid: uuid };
};
Rollbar.error = function () {
  if (_instance) {
    return _instance.error.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};
Rollbar.prototype._uncaughtError = function () {
  var item = this._createItem(arguments);
  item._isUncaught = true;
  var uuid = item.uuid;
  this.client.error(item);
  return { uuid: uuid };
};

Rollbar.prototype.critical = function () {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.critical(item);
  return { uuid: uuid };
};
Rollbar.critical = function () {
  if (_instance) {
    return _instance.critical.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};

Rollbar.prototype.buildJsonPayload = function (item) {
  return this.client.buildJsonPayload(item);
};
Rollbar.buildJsonPayload = function () {
  if (_instance) {
    return _instance.buildJsonPayload.apply(_instance, arguments);
  } else {
    handleUninitialized();
  }
};

Rollbar.prototype.sendJsonPayload = function (jsonPayload) {
  return this.client.sendJsonPayload(jsonPayload);
};
Rollbar.sendJsonPayload = function () {
  if (_instance) {
    return _instance.sendJsonPayload.apply(_instance, arguments);
  } else {
    handleUninitialized();
  }
};

Rollbar.prototype.wait = function (callback) {
  this.client.wait(callback);
};
Rollbar.wait = function (callback) {
  if (_instance) {
    return _instance.wait(callback);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};

Rollbar.prototype.errorHandler = function () {
  return function (err, request, response, next) {
    var cb = function (rollbarError) {
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
Rollbar.errorHandler = function () {
  if (_instance) {
    return _instance.errorHandler();
  } else {
    handleUninitialized();
  }
};

Rollbar.prototype.lambdaHandler = function (handler, timeoutHandler) {
  if (handler.length <= 2) {
    return this.asyncLambdaHandler(handler, timeoutHandler);
  }
  return this.syncLambdaHandler(handler, timeoutHandler);
};

Rollbar.prototype.asyncLambdaHandler = function (handler, timeoutHandler) {
  var self = this;
  var _timeoutHandler = function (event, context) {
    var message = 'Function timed out';
    var custom = {
      originalEvent: event,
      originalRequestId: context.awsRequestId,
    };
    self.error(message, custom);
  };
  var shouldReportTimeouts = self.options.captureLambdaTimeouts;
  return function rollbarAsyncLambdaHandler(event, context) {
    return new Promise(function (resolve, reject) {
      self.lambdaContext = context;
      if (shouldReportTimeouts) {
        var timeoutCb = (timeoutHandler || _timeoutHandler).bind(
          null,
          event,
          context,
        );
        self.lambdaTimeoutHandle = setTimeout(
          timeoutCb,
          context.getRemainingTimeInMillis() - 1000,
        );
      }
      handler(event, context)
        .then(function (resp) {
          self.wait(function () {
            clearTimeout(self.lambdaTimeoutHandle);
            resolve(resp);
          });
        })
        .catch(function (err) {
          self.error(err);
          self.wait(function () {
            clearTimeout(self.lambdaTimeoutHandle);
            reject(err);
          });
        });
    });
  };
};
Rollbar.prototype.syncLambdaHandler = function (handler, timeoutHandler) {
  var self = this;
  var _timeoutHandler = function (event, context, _cb) {
    var message = 'Function timed out';
    var custom = {
      originalEvent: event,
      originalRequestId: context.awsRequestId,
    };
    self.error(message, custom);
  };
  var shouldReportTimeouts = self.options.captureLambdaTimeouts;
  return function (event, context, callback) {
    self.lambdaContext = context;
    if (shouldReportTimeouts) {
      var timeoutCb = (timeoutHandler || _timeoutHandler).bind(
        null,
        event,
        context,
        callback,
      );
      self.lambdaTimeoutHandle = setTimeout(
        timeoutCb,
        context.getRemainingTimeInMillis() - 1000,
      );
    }
    try {
      handler(event, context, function (err, resp) {
        if (err) {
          self.error(err);
        }
        self.wait(function () {
          clearTimeout(self.lambdaTimeoutHandle);
          callback(err, resp);
        });
      });
    } catch (err) {
      self.error(err);
      self.wait(function () {
        clearTimeout(self.lambdaTimeoutHandle);
        throw err;
      });
    }
  };
};
Rollbar.lambdaHandler = function (handler) {
  if (_instance) {
    return _instance.lambdaHandler(handler);
  } else {
    handleUninitialized();
  }
};

function wrapCallback(r, f) {
  return function () {
    var err = arguments[0];
    if (err) {
      r.error(err);
    }
    return f.apply(this, arguments);
  };
}

Rollbar.prototype.wrapCallback = function (f) {
  return wrapCallback(this, f);
};
Rollbar.wrapCallback = function (f) {
  if (_instance) {
    return _instance.wrapCallback(f);
  } else {
    handleUninitialized();
  }
};

Rollbar.prototype.captureEvent = function () {
  var event = _.createTelemetryEvent(arguments);
  return this.client.captureEvent(event.type, event.metadata, event.level);
};
Rollbar.captureEvent = function () {
  if (_instance) {
    return _instance.captureEvent.apply(_instance, arguments);
  } else {
    handleUninitialized();
  }
};

/** DEPRECATED **/

Rollbar.prototype.reportMessage = function (message, level, request, callback) {
  logger.log('reportMessage is deprecated');
  if (_.isFunction(this[level])) {
    return this[level](message, request, callback);
  } else {
    return this.error(message, request, callback);
  }
};
Rollbar.reportMessage = function (message, level, request, callback) {
  if (_instance) {
    return _instance.reportMessage(message, level, request, callback);
  } else {
    handleUninitialized(callback);
  }
};

Rollbar.prototype.reportMessageWithPayloadData = function (
  message,
  payloadData,
  request,
  callback,
) {
  logger.log('reportMessageWithPayloadData is deprecated');
  return this.error(message, request, payloadData, callback);
};
Rollbar.reportMessageWithPayloadData = function (
  message,
  payloadData,
  request,
  callback,
) {
  if (_instance) {
    return _instance.reportMessageWithPayloadData(
      message,
      payloadData,
      request,
      callback,
    );
  } else {
    handleUninitialized(callback);
  }
};

Rollbar.prototype.handleError = function (err, request, callback) {
  logger.log('handleError is deprecated');
  return this.error(err, request, callback);
};
Rollbar.handleError = function (err, request, callback) {
  if (_instance) {
    return _instance.handleError(err, request, callback);
  } else {
    handleUninitialized(callback);
  }
};

Rollbar.prototype.handleErrorWithPayloadData = function (
  err,
  payloadData,
  request,
  callback,
) {
  logger.log('handleErrorWithPayloadData is deprecated');
  return this.error(err, request, payloadData, callback);
};
Rollbar.handleErrorWithPayloadData = function (
  err,
  payloadData,
  request,
  callback,
) {
  if (_instance) {
    return _instance.handleErrorWithPayloadData(
      err,
      payloadData,
      request,
      callback,
    );
  } else {
    handleUninitialized(callback);
  }
};

Rollbar.handleUncaughtExceptions = function (accessToken, options) {
  if (_instance) {
    options = options || {};
    options.accessToken = accessToken;
    return _instance.configure(options);
  } else {
    handleUninitialized();
  }
};

Rollbar.handleUnhandledRejections = function (accessToken, options) {
  if (_instance) {
    options = options || {};
    options.accessToken = accessToken;
    return _instance.configure(options);
  } else {
    handleUninitialized();
  }
};

Rollbar.handleUncaughtExceptionsAndRejections = function (
  accessToken,
  options,
) {
  if (_instance) {
    options = options || {};
    options.accessToken = accessToken;
    return _instance.configure(options);
  } else {
    handleUninitialized();
  }
};

/** Internal **/

function addTransformsToNotifier(notifier) {
  notifier
    .addTransform(transforms.baseData)
    .addTransform(transforms.handleItemWithError)
    .addTransform(transforms.addBody)
    .addTransform(sharedTransforms.addMessageWithError)
    .addTransform(sharedTransforms.addTelemetryData)
    .addTransform(transforms.addRequestData)
    .addTransform(transforms.addLambdaData)
    .addTransform(sharedTransforms.addConfigToPayload)
    .addTransform(transforms.scrubPayload)
    .addTransform(sharedTransforms.addPayloadOptions)
    .addTransform(sharedTransforms.userTransform(logger))
    .addTransform(sharedTransforms.addConfiguredOptions)
    .addTransform(sharedTransforms.addDiagnosticKeys)
    .addTransform(sharedTransforms.itemToPayload);
}

function addPredicatesToQueue(queue) {
  queue
    .addPredicate(sharedPredicates.checkLevel)
    .addPredicate(sharedPredicates.userCheckIgnore(logger))
    .addPredicate(sharedPredicates.urlIsNotBlockListed(logger))
    .addPredicate(sharedPredicates.urlIsSafeListed(logger))
    .addPredicate(sharedPredicates.messageIsIgnored(logger));
}

Rollbar.prototype._createItem = function (args) {
  var requestKeys = ['headers', 'protocol', 'url', 'method', 'body', 'route'];
  var item = _.createItem(args, logger, this, requestKeys, this.lambdaContext);

  if (item.err && item.notifier.locals) {
    item.localsMap = item.notifier.locals.currentLocalsMap();
  }

  return item;
};

function _getFirstFunction(args) {
  for (var i = 0, len = args.length; i < len; ++i) {
    if (_.isFunction(args[i])) {
      return args[i];
    }
  }
  return undefined;
}

Rollbar.prototype.setupUnhandledCapture = function () {
  if (this.options.captureUncaught || this.options.handleUncaughtExceptions) {
    this.handleUncaughtExceptions();
  }
  if (
    this.options.captureUnhandledRejections ||
    this.options.handleUnhandledRejections
  ) {
    this.handleUnhandledRejections();
  }
};

Rollbar.prototype.handleUncaughtExceptions = function () {
  var exitOnUncaught = !!this.options.exitOnUncaughtException;
  delete this.options.exitOnUncaughtException;

  addOrReplaceRollbarHandler(
    'uncaughtException',
    function (err) {
      if (
        !this.options.captureUncaught &&
        !this.options.handleUncaughtExceptions
      ) {
        return;
      }

      this._uncaughtError(err, function (err) {
        if (err) {
          logger.error(
            'Encountered error while handling an uncaught exception.',
          );
          logger.error(err);
        }
      });
      if (exitOnUncaught) {
        setImmediate(
          function () {
            this.wait(function () {
              process.exit(1);
            });
          }.bind(this),
        );
      }
    }.bind(this),
  );
};

Rollbar.prototype.handleUnhandledRejections = function () {
  addOrReplaceRollbarHandler(
    'unhandledRejection',
    function (reason) {
      if (
        !this.options.captureUnhandledRejections &&
        !this.options.handleUnhandledRejections
      ) {
        return;
      }

      this._uncaughtError(reason, function (err) {
        if (err) {
          logger.error(
            'Encountered error while handling an uncaught exception.',
          );
          logger.error(err);
        }
      });
    }.bind(this),
  );
};

function addOrReplaceRollbarHandler(event, action) {
  // We only support up to two arguments which is enough for how this is used
  // rather than dealing with `arguments` and `apply`
  var fn = function (a, b) {
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
  environment: process.env.NODE_ENV || 'development',
  framework: 'node-js',
  showReportedMessageTraces: false,
  notifier: {
    name: 'node_rollbar',
    version: packageJson.version,
  },
  scrubHeaders: packageJson.defaults.server.scrubHeaders,
  scrubFields: packageJson.defaults.server.scrubFields,
  addRequestData: null,
  reportLevel: packageJson.defaults.reportLevel,
  verbose: false,
  enabled: true,
  transmit: true,
  sendConfig: false,
  includeItemsInTelemetry: false,
  captureEmail: false,
  captureUsername: false,
  captureIp: true,
  captureLambdaTimeouts: true,
  ignoreDuplicateErrors: true,
  scrubRequestBody: true,
  autoInstrument: false,
};

module.exports = Rollbar;
