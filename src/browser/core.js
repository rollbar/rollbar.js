import Client from '../rollbar.js';
import * as _ from '../utility.js';
import API from '../api.js';
import logger from '../logger.js';
import * as globals from './globalSetup.js';

import Transport from './transport.js';
import * as urllib from './url.js';

import * as transforms from './transforms.js';
import * as sharedTransforms from '../transforms.js';
import * as predicates from './predicates.js';
import * as sharedPredicates from '../predicates.js';
import errorParser from '../errorParser.js';
import replayDefaults from './replay/defaults.js';
import tracingDefaults from '../tracing/defaults.js';

// Used to support global `Rollbar` instance.
let _instance = null;

class Rollbar {
  constructor(options, client) {
    logger.init({ logLevel: options.logLevel || 'error' });
    this.options = _.handleOptions(defaultOptions, options, null, logger);
    this.options._configuredOptions = options;
    this.components = this.components || {};
    const Telemeter = this.components.telemeter;
    const Instrumenter = this.components.instrumenter;
    this.wrapGlobals = this.components.wrapGlobals;
    this.scrub = this.components.scrub;
    const truncation = this.components.truncation;
    const Tracing = this.components.tracing;
    const ReplayManager = this.components.replayManager;

    const transport = new Transport(truncation);
    const api = new API(this.options, transport, urllib, truncation);
    if (Tracing) {
      this.tracing = new Tracing(_gWindow(), api, this.options);
      this.tracing.initSession();
    }
    if (Telemeter) {
      this.telemeter = new Telemeter(this.options, this.tracing);
    }

    if (ReplayManager && _.isBrowser()) {
      const replayOptions = this.options.replay;
      this.replayManager = new ReplayManager({
        tracing: this.tracing,
        telemeter: this.telemeter,
        options: replayOptions,
      });

      if (replayOptions.enabled && replayOptions.autoStart) {
        this.replayManager.recorder.start();
      }
    }

    this.client =
      client ||
      new Client(
        this.options,
        api,
        logger,
        this.telemeter,
        this.tracing,
        this.replayManager,
        'browser',
      );
    var gWindow = _gWindow();
    var gDocument = typeof document != 'undefined' && document;
    this.isChrome = gWindow.chrome && gWindow.chrome.runtime; // check .runtime to avoid Edge browsers
    this.anonymousErrorsPending = 0;
    addTransformsToNotifier(this.client.notifier, this, gWindow);
    addPredicatesToQueue(this.client.queue);
    this.setupUnhandledCapture();
    if (Instrumenter) {
      this.instrumenter = new Instrumenter(
        this.options,
        this.client.telemeter,
        this,
        gWindow,
        gDocument,
      );
      this.instrumenter.instrument();
    }

    this.setSessionAttributesFromOptions(options);

    // Used with rollbar-react for rollbar-react-native compatibility.
    this.rollbar = this;
  }

  static init(options, client) {
    if (_instance) {
      return _instance.global(options).configure(options);
    }
    _instance = new Rollbar(options, client);
    return _instance;
  }

  static setComponents(components) {
    Rollbar.prototype.components = components;
  }

  global(options) {
    this.client.global(options);
    return this;
  }

  configure(options, payloadData) {
    if (options.logLevel) {
      logger.init({ logLevel: options.logLevel });
    }
    this.setSessionAttributesFromOptions(options);
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

    this.tracing?.configure(this.options);
    this.replayManager?.configure(this.options);
    this.client.configure(this.options, payloadData);
    this.instrumenter?.configure(this.options);
    this.setupUnhandledCapture();
    return this;
  }

  lastError() {
    return this.client.lastError;
  }

  log() {
    var item = this._createItem(arguments);
    var uuid = item.uuid;
    this.client.log(item);
    return { uuid: uuid };
  }

  debug() {
    var item = this._createItem(arguments);
    var uuid = item.uuid;
    this.client.debug(item);
    return { uuid: uuid };
  }

  info() {
    var item = this._createItem(arguments);
    var uuid = item.uuid;
    this.client.info(item);
    return { uuid: uuid };
  }

  warn() {
    var item = this._createItem(arguments);
    var uuid = item.uuid;
    this.client.warn(item);
    return { uuid: uuid };
  }

  warning() {
    var item = this._createItem(arguments);
    var uuid = item.uuid;
    this.client.warning(item);
    return { uuid: uuid };
  }

  error() {
    var item = this._createItem(arguments);
    var uuid = item.uuid;
    this.client.error(item);
    return { uuid: uuid };
  }

  critical() {
    var item = this._createItem(arguments);
    var uuid = item.uuid;
    this.client.critical(item);
    return { uuid: uuid };
  }

  buildJsonPayload(item) {
    return this.client.buildJsonPayload(item);
  }

  sendJsonPayload(jsonPayload) {
    return this.client.sendJsonPayload(jsonPayload);
  }

  setupUnhandledCapture() {
    var gWindow = _gWindow();

    if (!this.unhandledExceptionsInitialized) {
      if (
        this.options.captureUncaught ||
        this.options.handleUncaughtExceptions
      ) {
        globals.captureUncaughtExceptions(gWindow, this);
        if (this.wrapGlobals && this.options.wrapGlobalEventHandlers) {
          this.wrapGlobals(gWindow, this);
        }
        this.unhandledExceptionsInitialized = true;
      }
    }
    if (!this.unhandledRejectionsInitialized) {
      if (
        this.options.captureUnhandledRejections ||
        this.options.handleUnhandledRejections
      ) {
        globals.captureUnhandledRejections(gWindow, this);
        this.unhandledRejectionsInitialized = true;
      }
    }
  }

  handleUncaughtException(message, url, lineno, colno, error, context) {
    if (
      !this.options.captureUncaught &&
      !this.options.handleUncaughtExceptions
    ) {
      return;
    }

    // Chrome will always send 5+ arguments and error will be valid or null, not undefined.
    // If error is undefined, we have a different caller.
    // Chrome also sends errors from web workers with null error, but does not invoke
    // prepareStackTrace() for these. Test for empty url to skip them.
    if (
      this.options.inspectAnonymousErrors &&
      this.isChrome &&
      error === null &&
      url === ''
    ) {
      return 'anonymous';
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
      errorParser,
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
  }

  /**
   * Chrome only. Other browsers will ignore.
   *
   * Use Error.prepareStackTrace to extract information about errors that
   * do not have a valid error object in onerror().
   *
   * In tested version of Chrome, onerror is called first but has no way
   * to communicate with prepareStackTrace. Use a counter to let this
   * handler know which errors to send to Rollbar.
   *
   * In config options, set inspectAnonymousErrors to enable.
   */
  handleAnonymousErrors() {
    if (!this.options.inspectAnonymousErrors || !this.isChrome) {
      return;
    }

    var r = this;
    function prepareStackTrace(error, _stack) {
      if (r.options.inspectAnonymousErrors) {
        if (r.anonymousErrorsPending) {
          // This is the only known way to detect that onerror saw an anonymous error.
          // It depends on onerror reliably being called before Error.prepareStackTrace,
          // which so far holds true on tested versions of Chrome. If versions of Chrome
          // are tested that behave differently, this logic will need to be updated
          // accordingly.
          r.anonymousErrorsPending -= 1;

          if (!error) {
            // Not likely to get here, but calling handleUncaughtException from here
            // without an error object would throw off the anonymousErrorsPending counter,
            // so return now.
            return;
          }

          // Allow this to be tracked later.
          error._isAnonymous = true;

          // url, lineno, colno shouldn't be needed for these errors.
          // If that changes, update this accordingly, using the unused
          // _stack param as needed (rather than parse error.toString()).
          r.handleUncaughtException(error.message, null, null, null, error);
        }
      }

      // Workaround to ensure stack is preserved for normal errors.
      return error.stack;
    }

    // https://v8.dev/docs/stack-trace-api
    try {
      Error.prepareStackTrace = prepareStackTrace;
    } catch (e) {
      this.options.inspectAnonymousErrors = false;
      this.error('anonymous error handler failed', e);
    }
  }

  handleUnhandledRejection(reason, promise) {
    if (
      !this.options.captureUnhandledRejections &&
      !this.options.handleUnhandledRejections
    ) {
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
    var context =
      (reason && reason._rollbarContext) ||
      (promise && promise._rollbarContext);

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
        errorParser,
      );
    }
    item.level = this.options.uncaughtErrorLevel;
    item._isUncaught = true;
    item._originalArgs = item._originalArgs || [];
    item._originalArgs.push(promise);
    this.client.log(item);
  }

  wrap(f, context, _before) {
    try {
      var ctxFn;
      if (_.isFunction(context)) {
        ctxFn = context;
      } else {
        ctxFn = function () {
          return context || {};
        };
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
          } catch (exc) {
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
  }

  captureEvent() {
    var event = _.createTelemetryEvent(arguments);
    return this.client.captureEvent(event.type, event.metadata, event.level);
  }

  setSessionUser(user) {
    if (!this.tracing?.session) return;

    this.tracing.session.setUser(user);
  }

  setSessionAttributes(attrs) {
    if (!this.tracing?.session) return;

    attrs = { ...attrs };

    this.tracing.session.setAttributes(attrs);
  }

  setSessionAttributesFromOptions(options) {
    const person = options.person || options.payload?.person;
    if (person) {
      this.setSessionUser(person);
    }
    const code_version =
      options.client?.javascript?.code_version ||
      options.codeVersion ||
      options.code_version ||
      options.payload?.client?.javascript?.code_version ||
      options.payload?.code_version ||
      options.payload?.codeVersion;
    this.setSessionAttributes({
      'rollbar.codeVersion': code_version,
      'rollbar.notifier.name': 'rollbar-browser-js',
      'rollbar.notifier.version': options.version,
    });
  }

  // The following two methods are used internally and are not meant for public use
  captureDomContentLoaded(e, ts) {
    if (!ts) {
      ts = new Date();
    }
    return this.client.captureDomContentLoaded(ts);
  }

  captureLoad(e, ts) {
    if (!ts) {
      ts = new Date();
    }
    return this.client.captureLoad(ts);
  }

  loadFull() {
    logger.info(
      'Unexpected Rollbar.loadFull() called on a Notifier instance. This can happen when Rollbar is loaded multiple times.',
    );
  }

  _createItem(args) {
    return _.createItem(args, logger, this);
  }

  // Static version of instance methods support the legacy pattern of a
  // global `Rollbar` instance, where after calling `Rollbar.init()`,
  // `Rollbar` can be used as if it were an instance.
  // If support for this pattern is dropped, these static methods can be removed.
  static callInstance(method, args) {
    if (!_instance) {
      const message = 'Rollbar is not initialized';
      logger.error(message);
      const maybeCallback = _getFirstFunction(args);
      if (maybeCallback) {
        maybeCallback(new Error(message));
      }
      return;
    }
    return _instance[method].apply(_instance, args);
  }

  static global = (...args) => Rollbar.callInstance('global', args);
  static configure = (...args) => Rollbar.callInstance('configure', args);
  static lastError = (...args) => Rollbar.callInstance('lastError', args);
  static log = (...args) => Rollbar.callInstance('log', args);
  static debug = (...args) => Rollbar.callInstance('debug', args);
  static info = (...args) => Rollbar.callInstance('info', args);
  static warn = (...args) => Rollbar.callInstance('warn', args);
  static warning = (...args) => Rollbar.callInstance('warning', args);
  static error = (...args) => Rollbar.callInstance('error', args);
  static critical = (...args) => Rollbar.callInstance('critical', args);
  static buildJsonPayload = (...args) =>
    Rollbar.callInstance('buildJsonPayload', args);
  static sendJsonPayload = (...args) =>
    Rollbar.callInstance('sendJsonPayload', args);
  static wrap = (...args) => Rollbar.callInstance('wrap', args);
  static captureEvent = (...args) => Rollbar.callInstance('captureEvent', args);
}

/* Internal */

function addTransformsToNotifier(notifier, rollbar, gWindow) {
  notifier
    .addTransform(transforms.handleDomException)
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
    .addTransform(transforms.addScrubber(rollbar.scrub))
    .addTransform(sharedTransforms.addPayloadOptions)
    .addTransform(sharedTransforms.userTransform(logger))
    .addTransform(sharedTransforms.addConfiguredOptions)
    .addTransform(sharedTransforms.addDiagnosticKeys)
    .addTransform(sharedTransforms.itemToPayload);
}

function addPredicatesToQueue(queue) {
  queue
    .addPredicate(sharedPredicates.checkLevel)
    .addPredicate(predicates.checkIgnore)
    .addPredicate(sharedPredicates.userCheckIgnore(logger))
    .addPredicate(sharedPredicates.urlIsNotBlockListed(logger))
    .addPredicate(sharedPredicates.urlIsSafeListed(logger))
    .addPredicate(sharedPredicates.messageIsIgnored(logger));
}

function _getFirstFunction(args) {
  for (var i = 0, len = args.length; i < len; ++i) {
    if (_.isFunction(args[i])) {
      return args[i];
    }
  }
  return undefined;
}

function _gWindow() {
  return (
    (typeof window != 'undefined' && window) ||
    (typeof self != 'undefined' && self)
  );
}

import {
  version,
  logLevel,
  reportLevel,
  uncaughtErrorLevel,
  endpoint,
} from '../defaults.js';
import browserDefaults from './defaults.js';

const defaultOptions = {
  environment: 'unknown',
  version: version,
  scrubFields: browserDefaults.scrubFields,
  logLevel: logLevel,
  reportLevel: reportLevel,
  uncaughtErrorLevel: uncaughtErrorLevel,
  endpoint: endpoint,
  verbose: false,
  enabled: true,
  transmit: true,
  sendConfig: false,
  includeItemsInTelemetry: true,
  captureIp: true,
  inspectAnonymousErrors: true,
  ignoreDuplicateErrors: true,
  wrapGlobalEventHandlers: false,
  replay: replayDefaults,
  tracing: tracingDefaults,
};

export default Rollbar;
