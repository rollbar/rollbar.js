var Client = require('../rollbar');
var _ = require('../utility');
var API = require('../api');
var logger = require('./logger');
var globals = require('./globalSetup');

var transport = require('./transport');
var urllib = require('./url');

var transforms = require('./transforms');
var sharedTransforms = require('../transforms');
var predicates = require('./predicates');
var sharedPredicates = require('../predicates');
var errorParser = require('./errorParser');
var Instrumenter = require('./telemetry');

function Rollbar(options, client) {
  this.options = _.handleOptions(defaultOptions, options);
  var api = new API(this.options, transport, urllib);
  this.client = client || new Client(this.options, api, logger, 'browser');

  var gWindow = _gWindow();
  var gDocument = (typeof document != 'undefined') && document;
  addTransformsToNotifier(this.client.notifier, gWindow);
  addPredicatesToQueue(this.client.queue);
  this.setupUnhandledCapture();
  this.instrumenter = new Instrumenter(this.options, this.client.telemeter, this, gWindow, gDocument);
  this.instrumenter.instrument();
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
  this.client.configure(this.options, payloadData);
  this.instrumenter.configure(this.options);
  this.setupUnhandledCapture();
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

Rollbar.prototype.setupUnhandledCapture = function() {
  var gWindow = _gWindow();

  if (!this.unhandledExceptionsInitialized) {
    if (this.options.captureUncaught || this.options.handleUncaughtExceptions) {
      globals.captureUncaughtExceptions(gWindow, this);
      globals.wrapGlobals(gWindow, this);
      this.unhandledExceptionsInitialized = true;
    }
  }
  if (!this.unhandledRejectionsInitialized) {
    if (this.options.captureUnhandledRejections || this.options.handleUnhandledRejections) {
      globals.captureUnhandledRejections(gWindow, this);
      this.unhandledRejectionsInitialized = true;
    }
  }
};

Rollbar.prototype.handleUncaughtException = function(message, url, lineno, colno, error, context) {
  if (!this.options.captureUncaught && !this.options.handleUncaughtExceptions) {
    return;
  }

  var item;
  var stackInfo = _.makeUnhandledStackInfo(
    message,
    url,
    lineno,
    colno,
    error,
    'onerror',
    'uncaught exception',
    errorParser
  );
  if (_.isError(error)) {
    item = this._createItem([message, error, context]);
    item._unhandledStackInfo = stackInfo;
  } else if (_.isError(url)) {
    item = this._createItem([message, url, context]);
    item._unhandledStackInfo = stackInfo;
  } else {
    item = this._createItem([message, context]);
    item.stackInfo = stackInfo;
  }
  item.level = this.options.uncaughtErrorLevel;
  item._isUncaught = true;
  this.client.log(item);
};

Rollbar.prototype.handleUnhandledRejection = function(reason, promise) {
  if (!this.options.captureUnhandledRejections && !this.options.handleUnhandledRejections) {
    return;
  }

  var message = 'unhandled rejection was null or undefined!';
  if (reason) {
    if (reason.message) {
      message = reason.message;
    } else {
      var reasonResult = _.stringify(reason);
      if (reasonResult.value) {
        message = reasonResult.value;
      }
    }
  }
  var context = (reason && reason._rollbarContext) || (promise && promise._rollbarContext);

  var item;
  if (_.isError(reason)) {
    item = this._createItem([message, reason, context]);
  } else {
    item = this._createItem([message, reason, context]);
    item.stackInfo = _.makeUnhandledStackInfo(
      message,
      '',
      0,
      0,
      null,
      'unhandledrejection',
      '',
      errorParser
    );
  }
  item.level = this.options.uncaughtErrorLevel;
  item._isUncaught = true;
  item._originalArgs = item._originalArgs || [];
  item._originalArgs.push(promise);
  this.client.log(item);
};

Rollbar.prototype.wrap = function(f, context, _before) {
  try {
    var ctxFn;
    if(_.isFunction(context)) {
      ctxFn = context;
    } else {
      ctxFn = function() { return context || {}; };
    }

    if (!_.isFunction(f)) {
      return f;
    }

    if (f._isWrap) {
      return f;
    }

    if (!f._rollbar_wrapped) {
      f._rollbar_wrapped = function () {
        if (_before && _.isFunction(_before)) {
          _before.apply(this, arguments);
        }
        try {
          return f.apply(this, arguments);
        } catch(exc) {
          var e = exc;
          if (e && window._rollbarWrappedError !== e) {
            if (_.isType(e, 'string')) {
              e = new String(e);
            }
            e._rollbarContext = ctxFn() || {};
            e._rollbarContext._wrappedSource = f.toString();

            window._rollbarWrappedError = e;
          }
          throw e;
        }
      };

      f._rollbar_wrapped._isWrap = true;

      if (f.hasOwnProperty) {
        for (var prop in f) {
          if (f.hasOwnProperty(prop) && prop !== '_rollbar_wrapped') {
            f._rollbar_wrapped[prop] = f[prop];
          }
        }
      }
    }

    return f._rollbar_wrapped;
  } catch (e) {
    // Return the original function if the wrap fails.
    return f;
  }
};
Rollbar.wrap = function(f, context) {
  if (_instance) {
    return _instance.wrap(f, context);
  } else {
    handleUninitialized();
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

// The following two methods are used internally and are not meant for public use
Rollbar.prototype.captureDomContentLoaded = function(e, ts) {
  if (!ts) {
    ts = new Date();
  }
  return this.client.captureDomContentLoaded(ts);
};

Rollbar.prototype.captureLoad = function(e, ts) {
  if (!ts) {
    ts = new Date();
  }
  return this.client.captureLoad(ts);
};

/* Internal */

function addTransformsToNotifier(notifier, gWindow) {
  notifier
    .addTransform(transforms.handleItemWithError)
    .addTransform(transforms.ensureItemHasSomethingToSay)
    .addTransform(transforms.addBaseInfo)
    .addTransform(transforms.addRequestInfo(gWindow))
    .addTransform(transforms.addClientInfo(gWindow))
    .addTransform(transforms.addPluginInfo(gWindow))
    .addTransform(transforms.addBody)
    .addTransform(sharedTransforms.addMessageWithError)
    .addTransform(sharedTransforms.addTelemetryData)
    .addTransform(sharedTransforms.addConfigToPayload)
    .addTransform(transforms.scrubPayload)
    .addTransform(sharedTransforms.userTransform(logger))
    .addTransform(sharedTransforms.itemToPayload);
}

function addPredicatesToQueue(queue) {
  queue
    .addPredicate(sharedPredicates.checkLevel)
    .addPredicate(predicates.checkIgnore)
    .addPredicate(sharedPredicates.userCheckIgnore(logger))
    .addPredicate(sharedPredicates.urlIsNotBlacklisted(logger))
    .addPredicate(sharedPredicates.urlIsWhitelisted(logger))
    .addPredicate(sharedPredicates.messageIsIgnored(logger));
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

function _gWindow() {
  return ((typeof window != 'undefined') && window) || ((typeof self != 'undefined') && self);
}

/* global __NOTIFIER_VERSION__:false */
/* global __DEFAULT_BROWSER_SCRUB_FIELDS__:false */
/* global __DEFAULT_LOG_LEVEL__:false */
/* global __DEFAULT_REPORT_LEVEL__:false */
/* global __DEFAULT_UNCAUGHT_ERROR_LEVEL:false */
/* global __DEFAULT_ENDPOINT__:false */

var defaultOptions = {
  version: __NOTIFIER_VERSION__,
  scrubFields: __DEFAULT_BROWSER_SCRUB_FIELDS__,
  logLevel: __DEFAULT_LOG_LEVEL__,
  reportLevel: __DEFAULT_REPORT_LEVEL__,
  uncaughtErrorLevel: __DEFAULT_UNCAUGHT_ERROR_LEVEL,
  endpoint: __DEFAULT_ENDPOINT__,
  verbose: false,
  enabled: true,
  sendConfig: false,
  includeItemsInTelemetry: true,
  captureIp: true
};

module.exports = Rollbar;
