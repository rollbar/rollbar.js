/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var notifier = __webpack_require__(1);
	var Notifier = notifier.Notifier;
	
	function setupJSON() {
	  var JSONObject = JSON;
	
	  if (false) {
	    // This adds the script to this context. We need it since this library
	    // is not a CommonJs or AMD module.
	    require("script!../../vendor/json2.min.js");
	
	    var customJSON = {};
	    setupCustomJSON(customJSON);
	    JSONObject = customJSON;
	  }
	
	  notifier.setupJSON(JSONObject);
	}
	
	setupJSON();
	
	if (!window._rollbarInitialized) {
	  var config = window._rollbarConfig || {};
	  var alias = config.globalAlias || 'Rollbar';
	  var shim = window[alias];
	
	  var fullRollbar = new Notifier(shim);
	
	  fullRollbar._processShimQueue(window._rollbarShimQueue || []);
	  window._rollbarInitialized = true;
	  window[alias] = fullRollbar;
	
	  Notifier.processPayloads();
	}
	
	module.exports = fullRollbar;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(4);
	var Util = __webpack_require__(2);
	var xhr = __webpack_require__(3);
	
	var XHR = xhr.XHR;
	var RollbarJSON = null;
	
	function setupJSON(JSON) {
	  RollbarJSON = JSON;
	  xhr.setupJSON(JSON);
	}
	
	// Updated by the build process to match package.json
	Notifier.NOTIFIER_VERSION = '1.2.2';
	Notifier.DEFAULT_ENDPOINT = 'api.rollbar.com/api/1/';
	Notifier.DEFAULT_SCRUB_FIELDS = ["pw","pass","passwd","password","secret","confirm_password","confirmPassword","password_confirmation","passwordConfirmation","access_token","accessToken","secret_key","secretKey","secretToken"];
	Notifier.DEFAULT_LOG_LEVEL = 'debug';
	Notifier.DEFAULT_REPORT_LEVEL = 'debug';
	Notifier.DEFAULT_UNCAUGHT_ERROR_LEVEL = 'warning';
	Notifier.DEFAULT_ITEMS_PER_MIN = 60;
	Notifier.DEFAULT_MAX_ITEMS = 0;
	
	Notifier.LEVELS = {
	  debug: 0,
	  info: 1,
	  warning: 2,
	  error: 3,
	  critical: 4
	};
	
	// This is the global queue where all notifiers will put their
	// payloads to be sent to Rollbar.
	window._rollbarPayloadQueue = [];
	
	// This contains global options for all Rollbar notifiers.
	window._globalRollbarOptions = {
	  startTime: (new Date()).getTime(),
	  maxItems: Notifier.DEFAULT_MAX_ITEMS,
	  itemsPerMinute: Notifier.DEFAULT_ITEMS_PER_MIN
	};
	
	var TK = computeStackTraceWrapper({remoteFetching: false, linesOfContext: 3});
	var _topLevelNotifier;
	
	function topLevelNotifier() {
	  return _topLevelNotifier;
	}
	
	function Notifier(parentNotifier) {
	  // Save the first notifier so we can use it to send system messages like
	  // when the rate limit is reached.
	  _topLevelNotifier = _topLevelNotifier || this;
	
	  var protocol = window.location.protocol;
	  if (protocol.indexOf('http') !== 0) {
	    protocol = 'https:';
	  }
	  var endpoint = protocol + '//' + Notifier.DEFAULT_ENDPOINT;
	  this.options = {
	    enabled: true,
	    endpoint: endpoint,
	    environment: 'production',
	    scrubFields: Util.copy(Notifier.DEFAULT_SCRUB_FIELDS),
	    checkIgnore: null,
	    logLevel: Notifier.DEFAULT_LOG_LEVEL,
	    reportLevel: Notifier.DEFAULT_REPORT_LEVEL,
	    uncaughtErrorLevel: Notifier.DEFAULT_UNCAUGHT_ERROR_LEVEL,
	    payload: {}
	  };
	
	  this.lastError = null;
	  this.plugins = {};
	  this.parentNotifier = parentNotifier;
	  this.logger = function() {
	    if (window.console && typeof window.console.log === 'function') {
	      var args = ['Rollbar:'].concat(Array.prototype.slice.call(arguments, 0));
	      window.console.log(args);
	    }
	  };
	
	  if (parentNotifier) {
	    // If the parent notifier has the shimId
	    // property it means that it's a Rollbar shim.
	    if (parentNotifier.hasOwnProperty('shimId')) {
	      // After we set this, the shim is just a proxy to this
	      // Notifier instance.
	      parentNotifier.notifier = this;
	    } else {
	      this.logger = parentNotifier.logger;
	      this.configure(parentNotifier.options);
	    }
	  }
	}
	
	
	Notifier._generateLogFn = function(level) {
	  return _wrapNotifierFn(function _logFn() {
	    var args = this._getLogArgs(arguments);
	
	    return this._log(level || args.level || this.options.logLevel || Notifier.DEFAULT_LOG_LEVEL,
	        args.message, args.err, args.custom, args.callback);
	  });
	};
	
	
	/*
	 * Returns an Object with keys:
	 * {
	 *  message: String,
	 *  err: Error,
	 *  custom: Object
	 * }
	 */
	Notifier.prototype._getLogArgs = function(args) {
	  var level = this.options.logLevel || Notifier.DEFAULT_LOG_LEVEL;
	  var ts;
	  var message;
	  var err;
	  var custom;
	  var callback;
	
	  var argT;
	  var arg;
	  for (var i = 0; i < args.length; ++i) {
	    arg = args[i];
	    argT = typeof arg;
	    if (argT === 'string') {
	      message = arg;
	    } else if (argT === 'function') {
	      callback = _wrapNotifierFn(arg, this);  // wrap the callback in a try/catch block
	    } else if (arg && argT === 'object') {
	      if (arg.constructor.name === 'Date') {
	        ts = arg;
	      } else if (arg instanceof Error ||
	          arg.prototype === Error.prototype ||
	          arg.hasOwnProperty('stack') ||
	          (typeof DOMException !== "undefined" && arg instanceof DOMException)) {
	        err = arg;
	      } else {
	        custom = arg;
	      }
	    }
	  }
	
	  // TODO(cory): somehow pass in timestamp too...
	
	  return {
	    level: level,
	    message: message,
	    err: err,
	    custom: custom,
	    callback: callback
	  };
	};
	
	
	Notifier.prototype._route = function(path) {
	  var endpoint = this.options.endpoint;
	
	  var endpointTrailingSlash = /\/$/.test(endpoint);
	  var pathBeginningSlash = /^\//.test(path);
	
	  if (endpointTrailingSlash && pathBeginningSlash) {
	    path = path.substring(1);
	  } else if (!endpointTrailingSlash && !pathBeginningSlash) {
	    path = '/' + path;
	  }
	
	  return endpoint + path;
	};
	
	
	/*
	 * Given a queue containing each call to the shim, call the
	 * corresponding method on this instance.
	 *
	 * shim queue contains:
	 *
	 * {shim: Rollbar, method: 'info', args: ['hello world', exc], ts: Date}
	 */
	Notifier.prototype._processShimQueue = function(shimQueue) {
	  // implement me
	  var shim;
	  var obj;
	  var tmp;
	  var method;
	  var args;
	  var shimToNotifier = {};
	  var parentShim;
	  var parentNotifier;
	  var notifier;
	
	  // For each of the messages in the shimQueue we need to:
	  // 1. get/create the notifier for that shim
	  // 2. apply the message to the notifier
	  while ((obj = shimQueue.shift())) {
	    shim = obj.shim;
	    method = obj.method;
	    args = obj.args;
	    parentShim = shim.parentShim;
	
	    // Get the current notifier based on the shimId
	    notifier = shimToNotifier[shim.shimId];
	    if (!notifier) {
	
	      // If there is no notifier associated with the shimId
	      // Check to see if there's a parent shim
	      if (parentShim) {
	
	        // If there is a parent shim, get the parent notifier
	        // and create a new notifier for the current shim.
	        parentNotifier = shimToNotifier[parentShim.shimId];
	
	        // Create a new Notifier which will process all of the shim's
	        // messages
	        notifier = new Notifier(parentNotifier);
	      } else {
	        // If there is no parent, assume the shim is the top
	        // level shim and thus, should use this as the notifier.
	        notifier = this;
	      }
	
	      // Save off the shimId->notifier mapping
	      shimToNotifier[shim.shimId] = notifier;
	    }
	
	    if (notifier[method] && typeof notifier[method] === 'function') {
	      notifier[method].apply(notifier, args);
	    }
	  }
	};
	
	
	/*
	 * Builds and returns an Object that will be enqueued onto the
	 * window._rollbarPayloadQueue array to be sent to Rollbar.
	 */
	Notifier.prototype._buildPayload = function(ts, level, message, stackInfo, custom) {
	  var accessToken = this.options.accessToken;
	
	  // NOTE(cory): DEPRECATED
	  // Pass in {payload: {environment: 'production'}} instead of just {environment: 'production'}
	  var environment = this.options.environment;
	
	  var notifierOptions = Util.copy(this.options.payload);
	  var uuid = Util.uuid4();
	
	  if (Notifier.LEVELS[level] === undefined) {
	    throw new Error('Invalid level');
	  }
	
	  if (!message && !stackInfo && !custom) {
	    throw new Error('No message, stack info or custom data');
	  }
	
	  var payloadData = {
	    environment: environment,
	    endpoint: this.options.endpoint,
	    uuid: uuid,
	    level: level,
	    platform: 'browser',
	    framework: 'browser-js',
	    language: 'javascript',
	    body: this._buildBody(message, stackInfo, custom),
	    request: {
	      url: window.location.href,
	      query_string: window.location.search,
	      user_ip: "$remote_ip"
	    },
	    client: {
	      runtime_ms: ts.getTime() - window._globalRollbarOptions.startTime,
	      timestamp: Math.round(ts.getTime() / 1000),
	      javascript: {
	        browser: window.navigator.userAgent,
	        language: window.navigator.language,
	        cookie_enabled: window.navigator.cookieEnabled,
	        screen: {
	          width: window.screen.width,
	          height: window.screen.height
	        },
	        plugins: this._getBrowserPlugins()
	      }
	    },
	    server: {},
	    notifier: {
	      name: 'rollbar-browser-js',
	      version: Notifier.NOTIFIER_VERSION
	    }
	  };
	
	  if (notifierOptions.body) {
	    delete notifierOptions.body;
	  }
	
	  // Overwrite the options from configure() with the payload
	  // data.
	  var payload = {
	    access_token: accessToken,
	    data: Util.merge(payloadData, notifierOptions)
	  };
	
	  // Only scrub the data section since we never want to scrub "access_token"
	  // even if it's in the scrub fields
	  this._scrub(payload.data);
	
	  return payload;
	};
	
	
	Notifier.prototype._buildBody = function(message, stackInfo, custom) {
	  var body;
	  if (stackInfo && stackInfo.mode !== 'failed') {
	    body = this._buildPayloadBodyTrace(message, stackInfo, custom);
	  } else {
	    body = this._buildPayloadBodyMessage(message, custom);
	  }
	  return body;
	};
	
	
	Notifier.prototype._buildPayloadBodyMessage = function(message, custom) {
	  if (!message) {
	    if (custom) {
	      message = RollbarJSON.stringify(custom);
	    } else {
	      message = '';
	    }
	  }
	  var result = {
	    body: message
	  };
	
	  if (custom) {
	    result.extra = Util.copy(custom);
	  }
	
	  return {
	    message: result
	  };
	};
	
	
	Notifier.prototype._buildPayloadBodyTrace = function(description, stackInfo, custom) {
	  var guess = _guessErrorClass(stackInfo.message);
	  var className = stackInfo.name || guess[0];
	  var message = guess[1];
	  var trace = {
	    exception: {
	      'class': className,
	      message: message
	    }
	  };
	
	  if (description) {
	    trace.exception.description = description || 'uncaught exception';
	  }
	
	  // Transform a TraceKit stackInfo object into a Rollbar trace
	  if (stackInfo.stack) {
	    var stackFrame;
	    var frame;
	    var code;
	    var pre;
	    var post;
	    var contextLength;
	    var i, j, mid;
	
	    trace.frames = [];
	    for (i = 0; i < stackInfo.stack.length; ++i) {
	      stackFrame = stackInfo.stack[i];
	      frame = {
	        filename: stackFrame.url ? Util.sanitizeUrl(stackFrame.url) : '(unknown)',
	        lineno: stackFrame.line || null,
	        method: (!stackFrame.func || stackFrame.func === '?') ? '[anonymous]' : stackFrame.func,
	        colno: stackFrame.column
	      };
	
	      code = pre = post = null;
	      contextLength = stackFrame.context ? stackFrame.context.length : 0;
	      if (contextLength) {
	        mid = Math.floor(contextLength / 2);
	        pre = stackFrame.context.slice(0, mid);
	        code = stackFrame.context[mid];
	        post = stackFrame.context.slice(mid);
	      }
	
	      if (code) {
	        frame.code = code;
	      }
	
	      if (pre || post) {
	        frame.context = {};
	        if (pre && pre.length) {
	          frame.context.pre = pre;
	        }
	        if (post && post.length) {
	          frame.context.post = post;
	        }
	      }
	
	      if (stackFrame.args) {
	        frame.args = stackFrame.args;
	      }
	
	      trace.frames.push(frame);
	    }
	    if (custom) {
	      trace.extra = Util.copy(custom);
	    }
	    return {trace: trace};
	  } else {
	    // no frames - not useful as a trace. just report as a message.
	    return this._buildPayloadBodyMessage(className + ': ' + message, custom);
	  }
	};
	
	
	Notifier.prototype._getBrowserPlugins = function() {
	  if (!this._browserPlugins) {
	    var navPlugins = (window.navigator.plugins || []);
	    var cur;
	    var numPlugins = navPlugins.length;
	    var plugins = [];
	    var i;
	    for (i = 0; i < numPlugins; ++i) {
	      cur = navPlugins[i];
	      plugins.push({name: cur.name, description: cur.description});
	    }
	    this._browserPlugins = plugins;
	  }
	  return this._browserPlugins;
	};
	
	
	/*
	 * Does an in-place modification of obj such that:
	 * 1. All keys that match the notifier's options.scrubFields
	 *    list will be normalized into all '*'
	 * 2. Any query string params that match the same criteria will have
	 *    their values normalized as well.
	 */
	Notifier.prototype._scrub = function(obj) {
	  function redactQueryParam(match, paramPart, dummy1,
	      dummy2, dummy3, valPart, offset, string) {
	    return paramPart + Util.redact(valPart);
	  }
	
	  function paramScrubber(v) {
	    var i;
	    if (typeof(v) === 'string') {
	      for (i = 0; i < queryRes.length; ++i) {
	        v = v.replace(queryRes[i], redactQueryParam);
	      }
	    }
	    return v;
	  }
	
	  function valScrubber(k, v) {
	    var i;
	    for (i = 0; i < paramRes.length; ++i) {
	      if (paramRes[i].test(k)) {
	        v = Util.redact(v);
	        break;
	      }
	    }
	    return v;
	  }
	
	  function scrubber(k, v) {
	    var tmpV = valScrubber(k, v);
	    if (tmpV === v) {
	      return paramScrubber(tmpV);
	    } else {
	      return tmpV;
	    }
	  }
	
	  var scrubFields = this.options.scrubFields;
	  var paramRes = this._getScrubFieldRegexs(scrubFields);
	  var queryRes = this._getScrubQueryParamRegexs(scrubFields);
	
	  Util.traverse(obj, scrubber);
	  return obj;
	};
	
	
	Notifier.prototype._getScrubFieldRegexs = function(scrubFields) {
	  var ret = [];
	  var pat;
	  for (var i = 0; i < scrubFields.length; ++i) {
	    pat = '\\[?(%5[bB])?' + scrubFields[i] + '\\[?(%5[bB])?\\]?(%5[dD])?';
	    ret.push(new RegExp(pat, 'i'));
	  }
	  return ret;
	};
	
	
	Notifier.prototype._getScrubQueryParamRegexs = function(scrubFields) {
	  var ret = [];
	  var pat;
	  for (var i = 0; i < scrubFields.length; ++i) {
	    pat = '\\[?(%5[bB])?' + scrubFields[i] + '\\[?(%5[bB])?\\]?(%5[dD])?';
	    ret.push(new RegExp('(' + pat + '=)([^&\\n]+)', 'igm'));
	  }
	  return ret;
	};
	
	Notifier.prototype._urlIsWhitelisted = function(payload){
	  var whitelist, trace, frame, filename, frameLength, url, listLength, urlRegex;
	  var i, j;
	
	  try {
	    whitelist = this.options.hostWhiteList;
	    trace = payload.data.body.trace;
	
	    if (!whitelist || whitelist.length === 0) { return true; }
	    if (!trace) { return true; }
	
	    listLength = whitelist.length;
	    frameLength = trace.frames.length;
	    for (i = 0; i < frameLength; i++) {
	      frame = trace.frames[i];
	      filename = frame.filename;
	      if (typeof filename !== "string") { return true; }
	      for (j = 0; j < listLength; j++) {
	        url = whitelist[j];
	        urlRegex = new RegExp(url);
	
	        if (urlRegex.test(filename)){
	          return true;
	        }
	      }
	    }
	  } catch (e) {
	    this.configure({hostWhiteList: null});
	    this.error("Error while reading your configuration's hostWhiteList option. Removing custom hostWhiteList.", e);
	    return true;
	  }
	
	  return false;
	};
	
	Notifier.prototype._messageIsIgnored = function(payload){
	  var exceptionMessage, i, ignoredMessages, len, messageIsIgnored, rIgnoredMessage, trace;
	  try {
	    messageIsIgnored = false;
	    ignoredMessages = this.options.ignoredMessages;
	    trace = payload.data.body.trace;
	
	    if(!ignoredMessages || ignoredMessages.length === 0) { return false; }
	    if(!trace) { return false; }
	    exceptionMessage = trace.exception.message;
	
	    len = ignoredMessages.length;
	    for(i=0; i < len; i++) {
	      rIgnoredMessage = new RegExp(ignoredMessages[i], "gi");
	      messageIsIgnored = rIgnoredMessage.test(exceptionMessage);
	
	      if(messageIsIgnored){
	        break;
	      }
	    }
	  }
	  catch(e) {
	    this.configure({ignoredMessages: null});
	    this.error("Error while reading your configuration's ignoredMessages option. Removing custom ignoredMessages.");
	  }
	
	  return messageIsIgnored;
	};
	
	Notifier.prototype._enqueuePayload = function(payload, isUncaught, callerArgs, callback) {
	
	  var payloadToSend = {
	    callback: callback,
	    accessToken: this.options.accessToken,
	    endpointUrl: this._route('item/'),
	    payload: payload
	  };
	
	  var ignoredCallback = function() {
	    if (callback) {
	      // If the item was ignored call the callback anyway
	      var msg = 'This item was not sent to Rollbar because it was ignored. ' +
	                'This can happen if a custom checkIgnore() function was used ' +
	                'or if the item\'s level was less than the notifier\' reportLevel. ' +
	                'See https://rollbar.com/docs/notifier/rollbar.js/configuration for more details.';
	
	      callback(null, {err: 0, result: {id: null, uuid: null, message: msg}});
	    }
	  };
	
	  // Internal checkIgnore will check the level against the minimum
	  // report level from this.options
	  if (this._internalCheckIgnore(isUncaught, callerArgs, payload)) {
	    ignoredCallback();
	    return;
	  }
	
	  // Users can set their own ignore criteria using this.options.checkIgnore()
	  try {
	    if (this.options.checkIgnore &&
	        typeof this.options.checkIgnore === 'function' &&
	        this.options.checkIgnore(isUncaught, callerArgs, payload)) {
	      ignoredCallback();
	      return;
	    }
	  } catch (e) {
	    // Disable the custom checkIgnore and report errors in the checkIgnore function
	    this.configure({checkIgnore: null});
	    this.error('Error while calling custom checkIgnore() function. Removing custom checkIgnore().', e);
	  }
	
	  if (!this._urlIsWhitelisted(payload)) {
	    return;
	  }
	
	  if (this._messageIsIgnored(payload)) {
	    return;
	  }
	
	  if (this.options.verbose) {
	    if (payload.data && payload.data.body && payload.data.body.trace) {
	      var trace = payload.data.body.trace;
	      var exceptionMessage = trace.exception.message;
	      this.logger(exceptionMessage);
	    }
	
	    // FIXME: Some browsers do not output objects as json to the console, and
	    // instead write [object Object], so let's write the message first to ensure that is logged.
	    this.logger('Sending payload -', payloadToSend);
	  }
	
	  if (typeof this.options.logFunction === "function") {
	    this.options.logFunction(payloadToSend);
	  }
	
	  try {
	    if (typeof this.options.transform === 'function') {
	      this.options.transform(payload);
	    }
	  } catch (e) {
	    this.configure({transform: null});
	    this.error('Error while calling custom transform() function. Removing custom transform().', e);
	  }
	
	  if (!!this.options.enabled) {
	    window._rollbarPayloadQueue.push(payloadToSend);
	  }
	};
	
	
	Notifier.prototype._internalCheckIgnore = function(isUncaught, callerArgs, payload) {
	  var level = callerArgs[0];
	  var levelVal = Notifier.LEVELS[level] || 0;
	  var reportLevel = Notifier.LEVELS[this.options.reportLevel] || 0;
	
	  if (levelVal < reportLevel) {
	    return true;
	  }
	
	  var plugins = this.options ? this.options.plugins : {};
	  if (plugins && plugins.jquery && plugins.jquery.ignoreAjaxErrors &&
	        payload.body.message) {
	    return payload.body.messagejquery_ajax_error;
	  }
	
	  return false;
	};
	
	
	/*
	 * Logs stuff to Rollbar using the default
	 * logging level.
	 *
	 * Can be called with the following, (order doesn't matter but type does):
	 * - message: String
	 * - err: Error object, must have a .stack property or it will be
	 *   treated as custom data
	 * - custom: Object containing custom data to be sent along with
	 *   the item
	 * - callback: Function to call once the item is reported to Rollbar
	 * - isUncaught: True if this error originated from an uncaught exception handler
	 * - ignoreRateLimit: True if this item should be allowed despite rate limit checks
	 */
	Notifier.prototype._log = function(level, message, err, custom, callback, isUncaught, ignoreRateLimit) {
	  var stackInfo = null;
	  if (err) {
	    // If we've already calculated the stack trace for the error, use it.
	    // This can happen for wrapped errors that don't have a "stack" property.
	    stackInfo = err._tkStackTrace ? err._tkStackTrace : TK(err);
	
	    // Don't report the same error more than once
	    if (err === this.lastError) {
	      return;
	    }
	
	    this.lastError = err;
	  }
	
	  var payload = this._buildPayload(new Date(), level, message, stackInfo, custom);
	  if (ignoreRateLimit) {
	    payload.ignoreRateLimit = true;
	  }
	  this._enqueuePayload(payload, isUncaught ? true : false, [level, message, err, custom], callback);
	};
	
	Notifier.prototype.log = Notifier._generateLogFn();
	Notifier.prototype.debug = Notifier._generateLogFn('debug');
	Notifier.prototype.info = Notifier._generateLogFn('info');
	Notifier.prototype.warn = Notifier._generateLogFn('warning'); // for console.warn() compatibility
	Notifier.prototype.warning = Notifier._generateLogFn('warning');
	Notifier.prototype.error = Notifier._generateLogFn('error');
	Notifier.prototype.critical = Notifier._generateLogFn('critical');
	
	// Adapted from tracekit.js
	Notifier.prototype.uncaughtError = _wrapNotifierFn(function(message, url, lineNo, colNo, err, context) {
	  context = context || null;
	  if (err && err.stack) {
	    this._log(this.options.uncaughtErrorLevel, message, err, context, null, true);
	    return;
	  }
	
	  // NOTE(cory): sometimes users will trigger an "error" event
	  // on the window object directly which will result in errMsg
	  // being an Object instead of a string.
	  //
	  if (url && url.stack) {
	    this._log(this.options.uncaughtErrorLevel, message, url, context, null, true);
	    return;
	  }
	
	  var location = {
	    'url': url || '',
	    'line': lineNo
	  };
	  location.func = TK.guessFunctionName(location.url, location.line);
	  location.context = TK.gatherContext(location.url, location.line);
	  var stack = {
	    'mode': 'onerror',
	    'message': message || 'uncaught exception',
	    'url': document.location.href,
	    'stack': [location],
	    'useragent': navigator.userAgent
	  };
	  if (err) {
	    stack = err._tkStackTrace || TK(err);
	  }
	
	  var payload = this._buildPayload(new Date(), this.options.uncaughtErrorLevel, message, stack);
	  this._enqueuePayload(payload, true, [this.options.uncaughtErrorLevel, message, url, lineNo, colNo, err]);
	});
	
	
	Notifier.prototype.global = _wrapNotifierFn(function(options) {
	  options = options || {};
	  Util.merge(window._globalRollbarOptions, options);
	  if (options.maxItems !== undefined) {
	    rateLimitCounter = 0;
	  }
	
	  if (options.itemsPerMinute !== undefined) {
	    rateLimitPerMinCounter = 0;
	  }
	});
	
	
	Notifier.prototype.configure = _wrapNotifierFn(function(options) {
	  // TODO(cory): only allow non-payload keys that we understand
	
	  // Make a copy of the options object for this notifier
	  Util.merge(this.options, options);
	});
	
	/*
	 * Create a new Notifier instance which has the same options
	 * as the current notifier + options to override them.
	 */
	Notifier.prototype.scope = _wrapNotifierFn(function(payloadOptions) {
	  var scopedNotifier = new Notifier(this);
	  Util.merge(scopedNotifier.options.payload, payloadOptions);
	  return scopedNotifier;
	});
	
	Notifier.prototype.wrap = function(f, context) {
	  var _this = this;
	  var ctxFn;
	  if (typeof context === 'function') {
	    ctxFn = context;
	  } else {
	    ctxFn = function() { return context || {}; };
	  }
	
	  if (typeof f !== 'function') {
	    return f;
	  }
	
	  // If the given function is already a wrapped function, just
	  // return it instead of wrapping twice
	  if (f._isWrap) {
	    return f;
	  }
	
	  if (!f._wrapped) {
	    f._wrapped = function () {
	      try {
	        return f.apply(this, arguments);
	      } catch(e) {
	        if (!e.stack) {
	          e._tkStackTrace = TK(e);
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
	};
	
	/***** Misc *****/
	
	function _wrapNotifierFn(fn, ctx) {
	  return function() {
	    var self = ctx || this;
	    try {
	      return fn.apply(self, arguments);
	    } catch (e) {
	      if (self) {
	        self.logger(e);
	      }
	    }
	  };
	}
	
	
	var ERR_CLASS_REGEXP = new RegExp('^(([a-zA-Z0-9-_$ ]*): *)?(Uncaught )?([a-zA-Z0-9-_$ ]*): ');
	function _guessErrorClass(errMsg) {
	  if (!errMsg) {
	    return ["Unknown error. There was no error message to display.", ""];
	  }
	  var errClassMatch = errMsg.match(ERR_CLASS_REGEXP);
	  var errClass = '(unknown)';
	
	  if (errClassMatch) {
	    errClass = errClassMatch[errClassMatch.length - 1];
	    errMsg = errMsg.replace((errClassMatch[errClassMatch.length - 2] || '') + errClass + ':', '');
	    errMsg = errMsg.replace(/(^[\s]+|[\s]+$)/g, '');
	  }
	  return [errClass, errMsg];
	}
	
	/***** Payload processor *****/
	
	var payloadProcessorTimeout;
	Notifier.processPayloads = function(immediate) {
	  if (!payloadProcessorTimeout || immediate) {
	    _payloadProcessorTimer(immediate);
	  }
	};
	
	
	function _payloadProcessorTimer(immediate) {
	  var payloadObj;
	  while ((payloadObj = window._rollbarPayloadQueue.shift())) {
	    _processPayload(payloadObj.endpointUrl, payloadObj.accessToken, payloadObj.payload, payloadObj.callback);
	  }
	  if (!immediate) {
	    payloadProcessorTimeout = setTimeout(_payloadProcessorTimer, 1000);
	  }
	}
	
	
	var rateLimitStartTime = new Date().getTime();
	var rateLimitCounter = 0;
	var rateLimitPerMinCounter = 0;
	function _processPayload(url, accessToken, payload, callback) {
	  callback = callback || function cb() {};
	  var now = new Date().getTime();
	  if (now - rateLimitStartTime >= 60000) {
	    rateLimitStartTime = now;
	    rateLimitPerMinCounter = 0;
	  }
	
	  // Check to see if we have a rate limit set or if
	  // the rate limit has been met/exceeded.
	  var globalRateLimit = window._globalRollbarOptions.maxItems;
	  var globalRateLimitPerMin = window._globalRollbarOptions.itemsPerMinute;
	  var checkOverRateLimit = function() { return !payload.ignoreRateLimit && globalRateLimit >= 1 && rateLimitCounter >= globalRateLimit; };
	  var checkOverRateLimitPerMin = function() { return !payload.ignoreRateLimit && globalRateLimitPerMin >= 1 && rateLimitPerMinCounter >= globalRateLimitPerMin; };
	
	  if (checkOverRateLimit()) {
	    callback(new Error(globalRateLimit + ' max items reached'));
	    return;
	  } else if (checkOverRateLimitPerMin()) {
	    callback(new Error(globalRateLimitPerMin + ' items per minute reached'));
	    return;
	  } else {
	    rateLimitCounter++;
	    rateLimitPerMinCounter++;
	
	    // Check to see if we have just reached the rate limit. If so, notify the customer.
	    if (checkOverRateLimit()) {
	      _topLevelNotifier._log(_topLevelNotifier.options.uncaughtErrorLevel, //level
	          'maxItems has been hit. Ignoring errors for the remainder of the current page load.', // message
	          null, // err
	          {maxItems: globalRateLimit}, // custom
	          null,  // callback
	          false, // isUncaught
	          true); // ignoreRateLimit
	    }
	    // remove this key since it's only used for internal notifier logic
	    if (payload.ignoreRateLimit) {
	      delete payload.ignoreRateLimit;
	    }
	  }
	
	  // There's either no rate limit or we haven't met it yet so
	  // go ahead and send it.
	  XHR.post(url, accessToken, payload, function xhrCallback(err, resp) {
	    if (err) {
	      return callback(err);
	    }
	
	    // TODO(cory): parse resp as JSON
	    return callback(null, resp);
	  });
	}
	
	module.exports = {
	  Notifier: Notifier,
	  setupJSON: setupJSON,
	  topLevelNotifier: topLevelNotifier
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Util = {
	  // modified from https://github.com/jquery/jquery/blob/master/src/core.js#L127
	  merge: function() {
	    var options, name, src, copy, copyIsArray, clone,
	      target = arguments[0] || {},
	      i = 1,
	      length = arguments.length,
	      deep = true;
	
	    // Handle case when target is a string or something (possible in deep copy)
	    if (typeof target !== "object" && typeof target !== 'function') {
	      target = {};
	    }
	
	    for (; i < length; i++) {
	      // Only deal with non-null/undefined values
	      if ((options = arguments[i]) !== null) {
	        // Extend the base object
	        for (name in options) {
	          // IE8 will iterate over properties of objects like "indexOf"
	          if (!options.hasOwnProperty(name)) {
	            continue;
	          }
	
	          src = target[name];
	          copy = options[name];
	
	          // Prevent never-ending loop
	          if (target === copy) {
	            continue;
	          }
	
	          // Recurse if we're merging plain objects or arrays
	          if (deep && copy && (copy.constructor == Object || (copyIsArray = (copy.constructor == Array)))) {
	            if (copyIsArray) {
	              copyIsArray = false;
	              // Overwrite the source with a copy of the array to merge in
	              clone = [];
	            } else {
	              clone = src && src.constructor == Object ? src : {};
	            }
	
	            // Never move original objects, clone them
	            target[name] = Util.merge(clone, copy);
	
	          // Don't bring in undefined values
	          } else if (copy !== undefined) {
	            target[name] = copy;
	          }
	        }
	      }
	    }
	
	    // Return the modified object
	    return target;
	  },
	
	  copy: function(obj) {
	    var dest;
	    if (typeof obj === 'object') {
	      if (obj.constructor == Object) {
	        dest = {};
	      } else if (obj.constructor == Array) {
	        dest = [];
	      }
	    }
	
	    Util.merge(dest, obj);
	    return dest;
	  },
	
	  parseUriOptions: {
	    strictMode: false,
	    key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	    q:   {
	      name:   "queryKey",
	      parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	    },
	    parser: {
	      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
	      loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	    }
	  },
	
	  parseUri: function(str) {
	    if (!str || (typeof str !== 'string' && !(str instanceof String))) {
	      throw new Error('Util.parseUri() received invalid input');
	    }
	
	    var o = Util.parseUriOptions;
	    var m = o.parser[o.strictMode ? "strict" : "loose"].exec(str);
	    var uri = {};
	    var i = 14;
	
	    while (i--) {
	      uri[o.key[i]] = m[i] || "";
	    }
	
	    uri[o.q.name] = {};
	    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
	      if ($1) {
	        uri[o.q.name][$1] = $2;
	      }
	    });
	
	    return uri;
	  },
	
	  sanitizeUrl: function(url) {
	    if (!url || (typeof url !== 'string' && !(url instanceof String))) {
	      throw new Error('Util.sanitizeUrl() received invalid input');
	    }
	
	    var baseUrlParts = Util.parseUri(url);
	    // remove a trailing # if there is no anchor
	    if (baseUrlParts.anchor === '') {
	      baseUrlParts.source = baseUrlParts.source.replace('#', '');
	    }
	
	    url = baseUrlParts.source.replace('?' + baseUrlParts.query, '');
	    return url;
	  },
	
	  traverse: function(obj, func) {
	    var k;
	    var v;
	    var i;
	    var isObj = typeof obj === 'object';
	    var keys = [];
	
	    if (isObj) {
	      if (obj.constructor === Object) {
	        for (k in obj) {
	          if (obj.hasOwnProperty(k)) {
	            keys.push(k);
	          }
	        }
	      } else if (obj.constructor === Array) {
	        for (i = 0; i < obj.length; ++i) {
	          keys.push(i);
	        }
	      }
	    }
	
	    for (i = 0; i < keys.length; ++i) {
	      k = keys[i];
	      v = obj[k];
	      isObj = typeof v === 'object';
	      if (isObj) {
	        if (v === null) {
	          obj[k] = func(k, v);
	        } else if (v.constructor === Object) {
	          obj[k] = Util.traverse(v, func);
	        } else if (v.constructor === Array) {
	          obj[k] = Util.traverse(v, func);
	        } else {
	          obj[k] = func(k, v);
	        }
	      } else {
	        obj[k] = func(k, v);
	      }
	    }
	
	    return obj;
	
	  },
	
	  redact: function(val) {
	    val = String(val);
	    return new Array(val.length + 1).join('*');
	  },
	
	  // from http://stackoverflow.com/a/8809472/1138191
	  uuid4: function() {
	    var d = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	      var r = (d + Math.random()*16)%16 | 0;
	      d = Math.floor(d/16);
	      return (c=='x' ? r : (r&0x7|0x8)).toString(16);
	    });
	    return uuid;
	  }
	};
	
	module.exports = Util;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var RollbarJSON = null;
	
	function setupJSON(JSON) {
	  RollbarJSON = JSON;
	}
	
	var XHR = {
	  XMLHttpFactories: [
	      function () {return new XMLHttpRequest();},
	      function () {return new ActiveXObject("Msxml2.XMLHTTP");},
	      function () {return new ActiveXObject("Msxml3.XMLHTTP");},
	      function () {return new ActiveXObject("Microsoft.XMLHTTP");}
	  ],
	  createXMLHTTPObject: function() {
	    var xmlhttp = false;
	    var factories = XHR.XMLHttpFactories;
	    var i;
	    var numFactories = factories.length;
	    for (i = 0; i < numFactories; i++) {
	      try {
	        xmlhttp = factories[i]();
	        break;
	      } catch (e) {
	        // pass
	      }
	    }
	    return xmlhttp;
	  },
	  post: function(url, accessToken, payload, callback) {
	    if (typeof payload !== 'object') {
	      throw new Error('Expected an object to POST');
	    }
	    payload = RollbarJSON.stringify(payload);
	    callback = callback || function() {};
	    var request = XHR.createXMLHTTPObject();
	    if (request) {
	      try {
	        try {
	          var onreadystatechange = function(args) {
	            try {
	              if (onreadystatechange && request.readyState === 4) {
	                onreadystatechange = undefined;
	
	                // TODO(cory): have the notifier log an internal error on non-200 response codes
	                if (request.status === 200) {
	                  callback(null, RollbarJSON.parse(request.responseText));
	                } else if (typeof(request.status) === "number" &&
	                            request.status >= 400  && request.status < 600) {
	                  // return valid http status codes
	                  callback(new Error(request.status.toString()));
	                } else {
	                  // IE will return a status 12000+ on some sort of connection failure,
	                  // so we return a blank error
	                  // http://msdn.microsoft.com/en-us/library/aa383770%28VS.85%29.aspx
	                  callback(new Error());
	                }
	              }
	            } catch (ex) {
	              //jquery source mentions firefox may error out while accessing the
	              //request members if there is a network error
	              //https://github.com/jquery/jquery/blob/a938d7b1282fc0e5c52502c225ae8f0cef219f0a/src/ajax/xhr.js#L111
	              var exc;
	              if (typeof ex === 'object' && ex.stack) {
	                exc = ex;
	              } else {
	                exc = new Error(ex);
	              }
	              callback(exc);
	            }
	          };
	
	          request.open('POST', url, true);
	          if (request.setRequestHeader) {
	            request.setRequestHeader('Content-Type', 'application/json');
	            request.setRequestHeader('X-Rollbar-Access-Token', accessToken);
	          }
	          request.onreadystatechange = onreadystatechange;
	          request.send(payload);
	        } catch (e1) {
	          // Sending using the normal xmlhttprequest object didn't work, try XDomainRequest
	          if (typeof XDomainRequest !== "undefined") {
	            var ontimeout = function(args) {
	              callback(new Error());
	            };
	
	            var onerror = function(args) {
	              callback(new Error());
	            };
	
	            var onload = function(args) {
	              callback(null, RollbarJSON.parse(request.responseText));
	            };
	
	            request = new XDomainRequest();
	            request.onprogress = function() {};
	            request.ontimeout = ontimeout;
	            request.onerror = onerror;
	            request.onload = onload;
	            request.open('POST', url, true);
	            request.send(payload);
	          }
	        }
	      } catch (e2) {
	        callback(e2);
	      }
	    }
	  }
	};
	
	module.exports = {
	  XHR: XHR,
	  setupJSON: setupJSON
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(5)(__webpack_require__(6)+"\n\n// SCRIPT-LOADER FOOTER\n//# sourceURL=script:///home/jon/rollbar/rollbar.js/vendor/trace.min.js")

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function(src) {
		if (typeof execScript === "function")
			execScript(src);
		else
			eval.call(null, src);
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "function _isUndefined(a){return\"undefined\"==typeof a}function computeStackTraceWrapper(a){function b(a){if(!t)return\"\";try{var b=function(){try{return new window.XMLHttpRequest}catch(a){return new window.ActiveXObject(\"Microsoft.XMLHTTP\")}},c=b();return c.open(\"GET\",a,!1),c.send(\"\"),c.responseText}catch(d){return\"\"}}function c(a){if(!s.hasOwnProperty(a)){var c=\"\";-1!==a.indexOf(document.domain)&&(c=b(a)),s[a]=c?c.split(\"\\n\"):[]}return s[a]}function d(a,b){var d,e=/function ([^(]*)\\(([^)]*)\\)/,f=/['\"]?([0-9A-Za-z$_]+)['\"]?\\s*[:=]\\s*(function|eval|new Function)/,g=\"\",h=10,i=c(a);if(!i.length)return UNKNOWN_FUNCTION;for(var j=0;h>j;++j)if(g=i[b-j]+g,!_isUndefined(g)){if(d=f.exec(g))return d[1];if(d=e.exec(g))return d[1]}return UNKNOWN_FUNCTION}function e(a,b){var d=c(a);if(!d.length)return null;var e=[],f=Math.floor(u/2),g=f+u%2,h=Math.max(0,b-f-1),i=Math.min(d.length,b+g-1);b-=1;for(var j=h;i>j;++j)_isUndefined(d[j])||e.push(d[j]);return e.length>0?e:null}function f(a){return a.replace(/[\\-\\[\\]{}()*+?.,\\\\\\^$|#]/g,\"\\\\$&\")}function g(a){return f(a).replace(\"<\",\"(?:<|&lt;)\").replace(\">\",\"(?:>|&gt;)\").replace(\"&\",\"(?:&|&amp;)\").replace('\"','(?:\"|&quot;)').replace(/\\s+/g,\"\\\\s+\")}function h(a,b){for(var d,e,f=0,g=b.length;g>f;++f)if((d=c(b[f])).length&&(d=d.join(\"\\n\"),e=a.exec(d)))return{url:b[f],line:d.substring(0,e.index).split(\"\\n\").length,column:e.index-d.lastIndexOf(\"\\n\",e.index)-1};return null}function i(a,b,d){var e,g=c(b),h=new RegExp(\"\\\\b\"+f(a)+\"\\\\b\");return d-=1,g&&g.length>d&&(e=h.exec(g[d]))?e.index:null}function j(a){for(var b,c,d,e,i=[window.location.href],j=document.getElementsByTagName(\"script\"),k=\"\"+a,l=/^function(?:\\s+([\\w$]+))?\\s*\\(([\\w\\s,]*)\\)\\s*\\{\\s*(\\S[\\s\\S]*\\S)\\s*\\}\\s*$/,m=/^function on([\\w$]+)\\s*\\(event\\)\\s*\\{\\s*(\\S[\\s\\S]*\\S)\\s*\\}\\s*$/,n=0;n<j.length;++n){var o=j[n];o.src&&i.push(o.src)}if(d=l.exec(k)){var p=d[1]?\"\\\\s+\"+d[1]:\"\",q=d[2].split(\",\").join(\"\\\\s*,\\\\s*\");b=f(d[3]).replace(/;$/,\";?\"),c=new RegExp(\"function\"+p+\"\\\\s*\\\\(\\\\s*\"+q+\"\\\\s*\\\\)\\\\s*{\\\\s*\"+b+\"\\\\s*}\")}else c=new RegExp(f(k).replace(/\\s+/g,\"\\\\s+\"));if(e=h(c,i))return e;if(d=m.exec(k)){var r=d[1];if(b=g(d[2]),c=new RegExp(\"on\"+r+\"=[\\\\'\\\"]\\\\s*\"+b+\"\\\\s*[\\\\'\\\"]\",\"i\"),e=h(c,i[0]))return e;if(c=new RegExp(b),e=h(c,i))return e}return null}function k(a){if(!a.stack)return null;for(var b,c,f=/^\\s*at (?:((?:\\[object object\\])?\\S+(?: \\[as \\S+\\])?) )?\\(?((?:file|http|https):.*?):(\\d+)(?::(\\d+))?\\)?\\s*$/i,g=/^\\s*(\\S*)(?:\\((.*?)\\))?@((?:file|http|https).*?):(\\d+)(?::(\\d+))?\\s*$/i,h=a.stack.split(\"\\n\"),j=[],k=/^(.*) is undefined$/.exec(a.message),l=0,m=h.length;m>l;++l){if(b=g.exec(h[l]))c={url:b[3],func:b[1]||UNKNOWN_FUNCTION,args:b[2]?b[2].split(\",\"):\"\",line:+b[4],column:b[5]?+b[5]:null};else{if(!(b=f.exec(h[l])))continue;c={url:b[2],func:b[1]||UNKNOWN_FUNCTION,line:+b[3],column:b[4]?+b[4]:null}}!c.func&&c.line&&(c.func=d(c.url,c.line)),c.line&&(c.context=e(c.url,c.line)),j.push(c)}return j[0]&&j[0].line&&!j[0].column&&k&&(j[0].column=i(k[1],j[0].url,j[0].line)),j.length?{mode:\"stack\",name:a.name,message:a.message,url:document.location.href,stack:j,useragent:navigator.userAgent}:null}function l(a){for(var b,c=a.stacktrace,f=/ line (\\d+), column (\\d+) in (?:<anonymous function: ([^>]+)>|([^\\)]+))\\((.*)\\) in (.*):\\s*$/i,g=c.split(\"\\n\"),h=[],i=0,j=g.length;j>i;i+=2)if(b=f.exec(g[i])){var k={line:+b[1],column:+b[2],func:b[3]||b[4],args:b[5]?b[5].split(\",\"):[],url:b[6]};if(!k.func&&k.line&&(k.func=d(k.url,k.line)),k.line)try{k.context=e(k.url,k.line)}catch(l){}k.context||(k.context=[g[i+1]]),h.push(k)}return h.length?{mode:\"stacktrace\",name:a.name,message:a.message,url:document.location.href,stack:h,useragent:navigator.userAgent}:null}function m(a){var b=a.message.split(\"\\n\");if(b.length<4)return null;var f,i,j,k,l=/^\\s*Line (\\d+) of linked script ((?:file|http|https)\\S+)(?:: in function (\\S+))?\\s*$/i,m=/^\\s*Line (\\d+) of inline#(\\d+) script in ((?:file|http|https)\\S+)(?:: in function (\\S+))?\\s*$/i,n=/^\\s*Line (\\d+) of function script\\s*$/i,o=[],p=document.getElementsByTagName(\"script\"),q=[];for(i in p)p.hasOwnProperty(i)&&!p[i].src&&q.push(p[i]);for(i=2,j=b.length;j>i;i+=2){var r=null;if(f=l.exec(b[i]))r={url:f[2],func:f[3],line:+f[1]};else if(f=m.exec(b[i])){r={url:f[3],func:f[4]};var s=+f[1],t=q[f[2]-1];if(t&&(k=c(r.url))){k=k.join(\"\\n\");var u=k.indexOf(t.innerText);u>=0&&(r.line=s+k.substring(0,u).split(\"\\n\").length)}}else if(f=n.exec(b[i])){var v=window.location.href.replace(/#.*$/,\"\"),w=f[1],x=new RegExp(g(b[i+1]));k=h(x,[v]),r={url:v,line:k?k.line:w,func:\"\"}}if(r){r.func||(r.func=d(r.url,r.line));var y=e(r.url,r.line),z=y?y[Math.floor(y.length/2)]:null;r.context=y&&z.replace(/^\\s*/,\"\")===b[i+1].replace(/^\\s*/,\"\")?y:[b[i+1]],o.push(r)}}return o.length?{mode:\"multiline\",name:a.name,message:b[0],url:document.location.href,stack:o,useragent:navigator.userAgent}:null}function n(a,b,c,f){var g={url:b,line:c};if(g.url&&g.line){a.incomplete=!1,g.func||(g.func=d(g.url,g.line)),g.context||(g.context=e(g.url,g.line));var h=/ '([^']+)' /.exec(f);if(h&&(g.column=i(h[1],g.url,g.line)),a.stack.length>0&&a.stack[0].url===g.url){if(a.stack[0].line===g.line)return!1;if(!a.stack[0].line&&a.stack[0].func===g.func)return a.stack[0].line=g.line,a.stack[0].context=g.context,!1}return a.stack.unshift(g),a.partial=!0,!0}return a.incomplete=!0,!1}function o(a,b){for(var c,e,f,g=/function\\s+([_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*)?\\s*\\(/i,h=[],k={},l=!1,m=o.caller;m&&!l;m=m.caller)if(m!==p&&m!==v){if(e={url:null,func:UNKNOWN_FUNCTION,line:null,column:null},m.name?e.func=m.name:(c=g.exec(m.toString()))&&(e.func=c[1]),f=j(m)){e.url=f.url,e.line=f.line,e.func===UNKNOWN_FUNCTION&&(e.func=d(e.url,e.line));var q=/ '([^']+)' /.exec(a.message||a.description);q&&(e.column=i(q[1],f.url,f.line))}k[\"\"+m]?l=!0:k[\"\"+m]=!0,h.push(e)}b&&h.splice(0,b);var r={mode:\"callers\",name:a.name,message:a.message,url:document.location.href,stack:h,useragent:navigator.userAgent};return n(r,a.sourceURL||a.fileName,a.line||a.lineNumber,a.message||a.description),r}function p(a,b){var c=null;b=null==b?0:+b;try{if(c=l(a))return c}catch(d){if(r)throw d}try{if(c=k(a))return c}catch(d){if(r)throw d}try{if(c=m(a))return c}catch(d){if(r)throw d}try{if(c=o(a,b+1))return c}catch(d){if(r)throw d}return{mode:\"failed\"}}function q(a){a=(null==a?0:+a)+1;try{throw new Error}catch(b){return p(b,a+1)}}var r=!1,s={},t=a.remoteFetching,u=a.linesOfContext,v=a.tracekitReport;return p.augmentStackTraceWithInitialElement=n,p.guessFunctionName=d,p.gatherContext=e,p.ofCaller=q,p}var UNKNOWN_FUNCTION=\"?\";"

/***/ }
/******/ ]);
//# sourceMappingURL=rollbar.js.map