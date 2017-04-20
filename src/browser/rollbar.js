var Client = require('../rollbar');
var _ = require('../utility');
var logger = require('./logger');
var globals = require('./globalSetup');

var transforms = require('./transforms');
var predicates = require('./predicates');
var errorParser = require('./errorParser');

function Rollbar(options, client) {
  this.options = _.extend(true, defaultOptions, options);
  var context = 'browser';
  this.client = client || new Client(context, this.options);
  addTransformsToNotifier(this.client.notifier);
  addPredicatesToQueue(this.client.queue);
  if (this.options.captureUncaught) {
    globals.captureUncaughtExceptions(window, this);
    globals.wrapGlobals(window, this);
  }
  if (this.options.captureUnhandledRejections) {
    globals.captureUnhandledRejections(window, this);
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

Rollbar.prototype.handleUncaughtException = function(message, url, lineno, colno, error, context) {
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
  var message = 'unhandled rejection was null or undefined!';
  message = reason ? (reason.message || String(reason)) : message;
  var context = (reason && reason._rollbarContext) || promise._rollbarContext;

  var item;
  if (_.isError(reason)) {
    item = this._createItem([message, reason, context]);
  } else {
    item = this._createItem([message, context]);
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
  this.client.log(item);
};

Rollbar.prototype.wrap = function(f, context) {
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

    if (!f._wrapped) {
      f._wrapped = function () {
        try {
          return f.apply(this, arguments);
        } catch(e) {
          if (_.isType(e, 'string')) {
            e = new String(e);
          }
          e._rollbarContext = ctxFn() || {};
          e._rollbarContext._wrappedSource = f.toString();

          window._rollbarWrappedError = e;
          throw e;
        }
      };

      f._wrapped._isWrap = true;

      for (var prop in f) {
        if (f.hasOwnProperty(prop)) {
          f._wrapped[prop] = f[prop];
        }
      }
    }

    return f._wrapped;
  } catch (e) {
    // Return the original function if the wrap fails.
    return f;
  }
};

/* Internal */

function addTransformsToNotifier(notifier) {
  notifier
    .addTransform(transforms.handleItemWithError)
    .addTransform(transforms.ensureItemHasSomethingToSay)
    .addTransform(transforms.addBaseInfo)
    .addTransform(transforms.addRequestInfo(window))
    .addTransform(transforms.addClientInfo(window))
    .addTransform(transforms.addPluginInfo(window))
    .addTransform(transforms.addBody)
    .addTransform(transforms.scrubPayload)
    .addTransform(transforms.userTransform)
    .addTransform(transforms.itemToPayload);
}

function addPredicatesToQueue(queue) {
  queue
    .addPredicate(predicates.checkIgnore)
    .addPredicate(predicates.userCheckIgnore)
    .addPredicate(predicates.urlIsWhitelisted)
    .addPredicate(predicates.messageIsIgnored);
}

Rollbar.prototype._createItem = function(args) {
  var message, err, custom, callback;
  var argT, arg;
  var extraArgs = [];

  for (var i = 0, l = args.length; i < l; ++i) {
    arg = args[i];

    switch (_.typeName(arg)) {
      case 'undefined':
        break;
      case 'string':
        message ? extraArgs.push(arg) : message = arg;
        break;
      case 'function':
        callback = _.wrapRollbarFunction(logger, arg, this);
        break;
      case 'date':
        extraArgs.push(arg);
        break;
      case 'error':
      case 'domexception':
        err ? extraArgs.push(arg) : err = arg;
        break;
      case 'object':
      case 'array':
        if (arg instanceof Error || (typeof DOMException !== 'undefined' && arg instanceof DOMException)) {
          err ? extraArgs.push(arg) : err = arg;
          break;
        }
        custom ? extraArgs.push(arg) : custom = arg;
        break;
      default:
        if (arg instanceof Error || (typeof DOMException !== 'undefined' && arg instanceof DOMException)) {
          err ? extraArgs.push(arg) : err = arg;
          break;
        }
        extraArgs.push(arg);
    }
  }

  if (extraArgs.length > 0) {
    // if custom is an array this turns it into an object with integer keys
    custom = _.extend(true, {}, custom);
    custom.extraArgs = extraArgs;
  }

  var item = {
    message: message,
    err: err,
    custom: custom,
    timestamp: (new Date()).getTime(),
    callback: callback,
    uuid: _.uuid4()
  };
  item._originalArgs = args;
  return item;
};

var defaultOptions = {
  version: __NOTIFIER_VERSION__,
  scrubFields: __DEFAULT_BROWSER_SCRUB_FIELDS__,
  logLevel: __DEFAULT_LOG_LEVEL__,
  reportLevel: __DEFAULT_REPORT_LEVEL__,
  uncaughtErrorLevel: __DEFAULT_UNCAUGHT_ERROR_LEVEL,
  endpoint: __DEFAULT_ENDPOINT__
};

module.exports = Rollbar;
