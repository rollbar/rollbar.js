var packageJson = require('../../package.json');
var Client = require('../rollbar');
var _ = require('../utility');
var API = require('../api');
var logger = require('./logger');

var transport = require('./transport');
var urllib = require('../browser/url');
var globals = require('../browser/globalSetup');

var transforms = require('./transforms');
var sharedTransforms = require('../transforms');
var sharedPredicates = require('../predicates');

function Rollbar(options, client) {
  if (_.isType(options, 'string')) {
    var accessToken = options;
    options = {};
    options.accessToken = accessToken;
  }
  this.options = _.handleOptions(Rollbar.defaultOptions, options);
  this.options._configuredOptions = options;
  // This makes no sense in a long running app
  delete this.options.maxItems;
  this.options.environment = this.options.environment || 'unspecified';
  var api = new API(this.options, transport, urllib);
  this.client = client || new Client(this.options, api, logger, 'react-native');
  addTransformsToNotifier(this.client.notifier);
  addPredicatesToQueue(this.client.queue);
  this.addExceptionHandlers();
}

var _instance = null;
Rollbar.init = function(options, client) {
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

Rollbar.prototype.global = function(options) {
  this.client.global(options);
  return this;
};
Rollbar.global = function(options) {
  if (_instance) {
    return _instance.global(options);
  } else {
    handleUninitialized();
  }
};

Rollbar.prototype.configure = function(options, payloadData) {
  var oldOptions = this.options;
  var payload = {};
  if (payloadData) {
    payload = {payload: payloadData};
  }
  this.options = _.handleOptions(oldOptions, options, payload);
  this.options._configuredOptions = _.handleOptions(oldOptions._configuredOptions, options, payload);
  this.client.configure(options, payloadData);
  return this;
};
Rollbar.configure = function(options, payloadData) {
  if (_instance) {
    return _instance.configure(options, payloadData);
  } else {
    handleUninitialized();
  }
};

Rollbar.prototype.lastError = function() {
  return this.client.lastError;
};
Rollbar.lastError = function() {
  if (_instance) {
    return _instance.lastError();
  } else {
    handleUninitialized();
  }
};

Rollbar.prototype.log = function() {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.log(item);
  return {uuid: uuid};
};
Rollbar.log = function() {
  if (_instance) {
    return _instance.log.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};

Rollbar.prototype.debug = function() {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.debug(item);
  return {uuid: uuid};
};
Rollbar.debug = function() {
  if (_instance) {
    return _instance.debug.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};

Rollbar.prototype.info = function() {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.info(item);
  return {uuid: uuid};
};
Rollbar.info = function() {
  if (_instance) {
    return _instance.info.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};

Rollbar.prototype.warn = function() {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.warn(item);
  return {uuid: uuid};
};
Rollbar.warn = function() {
  if (_instance) {
    return _instance.warn.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};


Rollbar.prototype.warning = function() {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.warning(item);
  return {uuid: uuid};
};
Rollbar.warning = function() {
  if (_instance) {
    return _instance.warning.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};


Rollbar.prototype.error = function() {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.error(item);
  return {uuid: uuid};
};
Rollbar.error = function() {
  if (_instance) {
    return _instance.error.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};
Rollbar.prototype._uncaughtError = function() {
  var item = this._createItem(arguments);
  item._isUncaught = true;
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
Rollbar.critical = function() {
  if (_instance) {
    return _instance.critical.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};

Rollbar.prototype.buildJsonPayload = function(item) {
  return this.client.buildJsonPayload(item);
};
Rollbar.buildJsonPayload = function() {
  if (_instance) {
    return _instance.buildJsonPayload.apply(_instance, arguments);
  } else {
    handleUninitialized();
  }
};

Rollbar.prototype.sendJsonPayload = function(jsonPayload) {
  return this.client.sendJsonPayload(jsonPayload);
};
Rollbar.sendJsonPayload = function() {
  if (_instance) {
    return _instance.sendJsonPayload.apply(_instance, arguments);
  } else {
    handleUninitialized();
  }
};

Rollbar.prototype.wait = function(callback) {
  this.client.wait(callback);
};
Rollbar.wait = function(callback) {
  if (_instance) {
    return _instance.wait(callback)
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};

Rollbar.prototype.captureEvent = function() {
  var event = _.createTelemetryEvent(arguments);
  return this.client.captureEvent(event.type, event.metadata, event.level);
};
Rollbar.captureEvent = function() {
  if (_instance) {
    return _instance.captureEvent.apply(_instance, arguments);
  } else {
    handleUninitialized();
  }
};

Rollbar.prototype.setPerson = function(personInfo) {
  this.configure({}, {person: personInfo});
};
Rollbar.setPerson = function(personInfo) {
  if (_instance) {
    return _instance.setPerson(personInfo);
  } else {
    handleUninitialized();
  }
};

Rollbar.prototype.clearPerson = function() {
  this.configure({}, {person: {}});
};
Rollbar.clearPerson = function() {
  if (_instance) {
    return _instance.clearPerson();
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
    .addTransform(sharedTransforms.addConfigToPayload)
    .addTransform(transforms.scrubPayload)
    .addTransform(sharedTransforms.userTransform(logger))
    .addTransform(sharedTransforms.addConfiguredOptions)
    .addTransform(sharedTransforms.addDiagnosticKeys)
    .addTransform(sharedTransforms.itemToPayload);
}

function addPredicatesToQueue(queue) {
  queue
    .addPredicate(sharedPredicates.checkLevel)
    .addPredicate(sharedPredicates.userCheckIgnore(logger));
}

Rollbar.prototype.addExceptionHandlers = function() {
  if (this.options.platform === 'ios' || this.options.platform === 'android') {
    this.captureJavaScriptCoreUncaughtExceptions();
  } else {
    this.captureBrowserUncaughtExceptions();
  }
}

Rollbar.prototype.captureJavaScriptCoreUncaughtExceptions = function () {
  if (ErrorUtils) {
    const previousHandler = ErrorUtils.getGlobalHandler();

    ErrorUtils.setGlobalHandler((error, isFatal) => {
      if (this.options.captureUncaught && this.options.shouldSend()) {
        this.error(error, undefined, (queued) => {
          if (previousHandler) {
            previousHandler(error, isFatal);
          }
        });
      } else if (previousHandler) {
        previousHandler(error, isFatal);
      }
    });
  }
  
  if (this.options.captureUnhandledRejections) {
    const tracking = require('promise/setimmediate/rejection-tracking');
    const client = this;
    tracking.enable({
      allRejections: true,
      onUnhandled: function(id, error) { this.error(error); },
      onHandled: function() {}
    });
  }
}

Rollbar.prototype.captureBrowserUncaughtExceptions = function () {
  var gWindow = _gWindow();

  if (!this.unhandledExceptionsInitialized) {
    if (this.options.captureUncaught || this.options.handleUncaughtExceptions) {
      globals.captureUncaughtExceptions(gWindow, this);
      if (this.options.wrapGlobalEventHandlers) {
        globals.wrapGlobals(gWindow, this);
      }
      this.unhandledExceptionsInitialized = true;
    }
  }
  if (!this.unhandledRejectionsInitialized) {
    if (this.options.captureUnhandledRejections || this.options.handleUnhandledRejections) {
      globals.captureUnhandledRejections(gWindow, this);
      this.unhandledRejectionsInitialized = true;
    }
  }
}

Rollbar.prototype._createItem = function(args) {
  return _.createItem(args, logger, this);
};

function _getFirstFunction(args) {
  for (var i = 0, len = args.length; i < len; ++i) {
    if (_.isFunction(args[i])) {
      return args[i];
    }
  }
  return undefined;
}

Rollbar.defaultOptions = {
  environment: process.env.NODE_ENV || 'development',
  platform: 'client',
  framework: 'react-native',
  showReportedMessageTraces: false,
  notifier: {
    name: 'rollbar-react-native',
    version: packageJson.version
  },
  scrubHeaders: packageJson.defaults.server.scrubHeaders,
  scrubFields: packageJson.defaults.server.scrubFields,
  reportLevel: packageJson.defaults.reportLevel,
  rewriteFilenamePatterns: packageJson.defaults.reactNative.rewriteFilenamePatterns,
  verbose: false,
  enabled: true,
  transmit: true,
  sendConfig: false,
  includeItemsInTelemetry: true,
  ignoreDuplicateErrors: true
};

module.exports = Rollbar;
