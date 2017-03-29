var Client = require('../rollbar');
var _ = require('../utility');
var logger = require('./logger');

var transforms = require('./transforms');
var predicates = require('./predicates');
var errorParser = require('./errorParser');

function Rollbar(options, client) {
  this.options = _.extend(true, defaultOptions, options);
  var context = 'browser';
  this.client = client || new Client(context, this.options);
  this.init(this.client);
}

Rollbar.prototype.global = function(options) {
  this.client.global(options);
};

Rollbar.prototype.configure = function(options) {
  this.options = _.extend(true, {}, this.options, options);
  this.client.configure(options);
};

Rollbar.prototype.init = function(client) {
  addTransformsToNotifier(client.notifier);
  addPredicatesToQueue(client.queue);
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
  if (error && _.isType(error, 'error')) {
    item = this._createItem([message, error, context]);
  } else if (url && _.isType(url, 'error')) {
    item = this._createItem([message, url, context]);
  } else {
    item = this._createItem([message, context]);
    item.stackInfo = _.makeUnhandledStackInfo(
      message,
      url,
      lineno,
      colno,
      error,
      'onerror',
      'uncaught exception',
      errorParser
    );
  }
  item.level = this.options.uncaughtErrorLevel;
  this.client.log(item);
};

Rollbar.prototype.handleUnhandledRejection = function(reason, promise) {
  var message = 'unhandled rejection was null or undefined!';
  message = reason ? (reason.message || String(reason)) : message;
  var context = (reason && reason._rollbarContext) || promise._rollbarContext;

  var item;
  if (reason && _.isType(reason, 'error')) {
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
  this.client.log(item);
}

Rollbar.prototype.wrap = function(f, context) {
  try {
    var ctxFn;
    if (typeof context === 'function') {
      ctxFn = context;
    } else {
      ctxFn = function() { return context || {}; };
    }

    if (typeof f !== 'function') {
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
          if (typeof e === 'string') {
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

  if (extraArgs.length) {
    // if custom is an array this turns it into an object with integer keys
    custom = _.extend(true, {}, custom);
    custom.extraArgs = extraArgs;
  }

  return {
    message: message,
    err: err,
    custom: custom,
    timestamp: (new Date()).getTime(),
    callback: callback,
    uuid: _.uuid4()
  };
};

var defaultOptions = {
  version: __NOTIFIER_VERSION__,
  scrubFields: __DEFAULT_BROWSER_SCRUB_FIELDS__,
  logLevel: __DEFAULT_LOG_LEVEL__,
  reportLevel: __DEFAULT_REPORT_LEVEL__,
  uncaughtErrorLevel: __DEFAULT_UNCAUGHT_ERROR_LEVEL,
  endpoint: __DEFAULT_ENDPOINT__
};

var Wrapper = require('./rollbarWrapper');
var RollbarImpl = function(options, client) {
  return new Rollbar(options, client);
};
var RollbarWrap = Wrapper.bind(null, RollbarImpl);

module.exports = RollbarWrap;
