var http = require('http');
var https = require('https');
var _ = require('../utility');
var urlHelpers = require('./telemetry/urlHelpers');

var defaults = {
  network: true,
  networkResponseHeaders: false,
  networkRequestHeaders: false,
  log: true
};

function Instrumenter(options, telemeter, rollbar) {
  this.options = options;
  var autoInstrument = options.autoInstrument;
  if (options.enabled === false || autoInstrument === false) {
    this.autoInstrument = {};
  } else {
    if (!_.isType(autoInstrument, 'object')) {
      autoInstrument = defaults;
    }
    this.autoInstrument = _.merge(defaults, autoInstrument);
  }
  this.telemeter = telemeter;
  this.rollbar = rollbar;
  this.diagnostic = rollbar.client.notifier.diagnostic;
  this.replacements = {
    network: [],
    log: []
  };
}

Instrumenter.prototype.configure = function(options) {
  this.options = _.merge(this.options, options);
  var autoInstrument = options.autoInstrument;
  var oldSettings = _.merge(this.autoInstrument);
  if (options.enabled === false || autoInstrument === false) {
    this.autoInstrument = {};
  } else {
    if (!_.isType(autoInstrument, 'object')) {
      autoInstrument = defaults;
    }
    this.autoInstrument = _.merge(defaults, autoInstrument);
  }
  this.instrument(oldSettings);
};

Instrumenter.prototype.instrument = function(oldSettings) {
  if (this.autoInstrument.network && !(oldSettings && oldSettings.network)) {
    this.instrumentNetwork();
  } else if (!this.autoInstrument.network && oldSettings && oldSettings.network) {
    this.deinstrumentNetwork();
  }

  if (this.autoInstrument.log && !(oldSettings && oldSettings.log)) {
    this.instrumentConsole();
  } else if (!this.autoInstrument.log && oldSettings && oldSettings.log) {
    this.deinstrumentConsole();
  }
};

Instrumenter.prototype.deinstrumentNetwork = function() {
  restore(this.replacements, 'network');
};

Instrumenter.prototype.instrumentNetwork = function() {
  replace(http, 'request', networkRequestWrapper.bind(this), this.replacements, 'network');
  replace(https, 'request', networkRequestWrapper.bind(this), this.replacements, 'network');
};

function networkRequestWrapper(orig) {
  var telemeter = this.telemeter;
  var self = this;

  return function(url, options, cb) {
    var mergedOptions = urlHelpers.mergeOptions(url, options, cb);

    var metadata = {
      method: mergedOptions.options.method || 'GET',
      url: urlHelpers.constructUrl(mergedOptions.options),
      status_code: null,
      start_time_ms: _.now(),
      end_time_ms: null
    };

    if (self.autoInstrument.networkRequestHeaders) {
      metadata.request_headers = mergedOptions.options.headers;
    }
    telemeter.captureNetwork(metadata, 'http');

    // Call the original method with the original arguments and wrapped callback.
    var wrappedArgs = Array.from(arguments);
    var wrappedCallback = responseCallbackWrapper(self.autoInstrument, metadata, mergedOptions.cb);
    if (mergedOptions.cb) {
      wrappedArgs.pop();
    }
    wrappedArgs.push(wrappedCallback);
    var req = orig.apply(https, wrappedArgs);

    req.on('error', err => {
      metadata.status_code = 0;
      metadata.error = [err.name, err.message].join(': ') ;
    });

    return req;
  }
}

function responseCallbackWrapper(options, metadata, callback) {
  return function (res) {
    metadata.end_time_ms = _.now();
    metadata.status_code = res.statusCode;
    metadata.response = {};
    if (options.networkResponseHeaders) {
      metadata.response.headers = res.headers;
    }

    if (callback) {
      return callback.apply(undefined, arguments);
    }
  }
}

Instrumenter.prototype.captureNetwork = function(metadata, subtype, rollbarUUID) {
  return this.telemeter.captureNetwork(metadata, subtype, rollbarUUID);
};

Instrumenter.prototype.deinstrumentConsole = function() {
  restore(this.replacements, 'log');
};

Instrumenter.prototype.instrumentConsole = function() {
  var telemeter = this.telemeter;

  var stdout = process.stdout;
  replace(stdout, 'write', function(orig) {
    return function(string) {
      telemeter.captureLog(string, 'info');
      return orig.apply(stdout, arguments);
    }
  }, this.replacements, 'log');

  var stderr = process.stderr;
  replace(stderr, 'write', function(orig) {
    return function(string) {
      telemeter.captureLog(string, 'error');
      return orig.apply(stderr, arguments);
    }
  }, this.replacements, 'log');
};

// TODO: These helpers are duplicated in src/browser/telemetry.js,
// and may be candidates for extraction into a shared module.
// It is recommended that before doing so, the author should allow
// for more telemetry types to be implemented for the Node target
// to ensure that the implementations of these helpers don't diverge.
// If they do diverge, there's little point in the shared module.
function replace(obj, name, replacement, replacements, type) {
  var orig = obj[name];
  obj[name] = replacement(orig);
  if (replacements) {
    replacements[type].push([obj, name, orig]);
  }
}

function restore(replacements, type) {
  var b;
  while (replacements[type].length) {
    b = replacements[type].shift();
    b[0][b[1]] = b[2];
  }
}

module.exports = Instrumenter;
