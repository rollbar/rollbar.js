
// Updated by the build process to match package.json
Notifier.NOTIFIER_VERSION = '1.0.0-rc.3';
Notifier.DEFAULT_ENDPOINT = 'api.rollbar.com/api/1/';
Notifier.DEFAULT_SCRUB_FIELDS = ["passwd","password","secret","confirm_password","password_confirmation"];
Notifier.DEFAULT_LOG_LEVEL = 'debug';
Notifier.DEFAULT_REPORT_LEVEL = 'warning';
Notifier.DEFAULT_UNCAUGHT_ERROR_LEVEL = 'warning';

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
  startTime: (new Date()).getTime()
};

var TK = computeStackTraceWrapper({remoteFetching: false, linesOfContext: 3});

function Notifier(parentNotifier) {
  var protocol = window.location.protocol;
  if (protocol.indexOf('http') !== 0) {
    protocol = 'https:';
  }
  var endpoint = protocol + '//' + Notifier.DEFAULT_ENDPOINT;
  this.options = {
    endpoint: endpoint,
    environment: 'production',
    scrubFields: Util.copy(Notifier.DEFAULT_SCRUB_FIELDS),
    itemsPerMinute: 60,
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
    if (window.console && window.console.log) {
      var args = ['Rollbar internal error:'].concat(Array.prototype.slice.call(arguments, 0));
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
      } else if (arg instanceof Error || arg.prototype === Error.prototype || arg.hasOwnProperty('stack')) {
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


Notifier.prototype._enqueuePayload = function(payload, isUncaught, callerArgs, callback) {
  // Internal checkIgnore will check the level against the minimum
  // report level from this.options
  if (this._internalCheckIgnore(isUncaught, callerArgs, payload)) {
    return;
  }

  // Users can set their own ignore criteria using this.options.checkIgnore()
  try {
    if (this.options.checkIgnore && 
        typeof this.options.checkIgnore === 'function' &&
        this.options.checkIgnore(isUncaught, callerArgs, payload)) {
      return;
    }
  } catch (e) {
    // Disable the custom checkIgnore and report errors in the checkIgnore function
    this.configure({checkIgnore: null});
    this.error('Error while calling custom checkIgnore() function. Removing custom checkIgnore().', e);
  }

  window._rollbarPayloadQueue.push({
    callback: callback,
    accessToken: this.options.accessToken,
    endpointUrl: this._route('item/'),
    payload: payload
  });
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
 */
Notifier.prototype._log = function(level, message, err, custom, callback, isUncaught) {
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
Notifier.prototype.uncaughtError = _wrapNotifierFn(function(message, url, lineNo, colNo, err) {
  if (err && err.stack) {
    this._log(this.options.uncaughtErrorLevel, message, err, null, null, true);
    return;
  }

  // NOTE(cory): sometimes users will trigger an "error" event
  // on the window object directly which will result in errMsg
  // being an Object instead of a string.
  //
  if (url && url.stack) {
    this._log(this.options.uncaughtErrorLevel, message, url, null, null, true);
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
  Util.merge(window._globalRollbarOptions, options);
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

Notifier.prototype.wrap = function(f) {
  var _this = this;

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
        f.apply(this, arguments);
      } catch(e) {
        if (!e.stack) {
          e._tkStackTrace = TK(e);
        }
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
Notifier.processPayloads = function() {
  if (!payloadProcessorTimeout) {
    _payloadProcessorTimer();
  }
};


function _payloadProcessorTimer() {
  var payloadObj;
  while ((payloadObj = window._rollbarPayloadQueue.pop())) {
    _processPayload(payloadObj.endpointUrl, payloadObj.accessToken, payloadObj.payload, payloadObj.callback);
  }
  payloadProcessorTimeout = setTimeout(_payloadProcessorTimer, 1000);
}


var rateLimitStartTime = new Date().getTime();
var rateLimitCounter = 0;
function _processPayload(url, accessToken, payload, callback) {
  callback = callback || function cb() {};
  var now = new Date().getTime();
  if (now - rateLimitStartTime >= 60000) {
    rateLimitStartTime = now;
    rateLimitCounter = 0;
  }

  // Check to see if we have a rate limit set or if
  // the rate limit has been met/exceeded.
  var globalRateLimitPerMin = window._globalRollbarOptions.itemsPerMinute;
  if (globalRateLimitPerMin !== undefined && rateLimitCounter >= globalRateLimitPerMin) {
    callback(new Error(globalRateLimitPerMin + ' items per minute reached'));
    return;
  } else {
    rateLimitCounter++;
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
