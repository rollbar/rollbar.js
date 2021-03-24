/* globals Map */
var inspector = require('inspector');
var async = require('async');
var _ = require('../utility');

// It's helpful to have default limits, as the data expands quickly in real environments.
// depth = 1 is  enough to capture the members of top level objects and arrays.
// maxProperties limits the number of properties captured from non-array objects.
// When this value is too small, relevant values for debugging are easily omitted.
// maxArray applies to array objects, which in practice may be arbitrarily large,
// yet for debugging we usually only care about the pattern of data that is established,
// so a smaller limit is usually sufficient.
var DEFAULT_OPTIONS = {
  enabled: true,
  uncaughtOnly: true,
  depth: 1,
  maxProperties: 30,
  maxArray: 5
}

function Locals(options, logger) {
  if (!(this instanceof Locals)) {
    return new Locals(options);
  }

  options = _.isType(options, 'object') ? options : {};
  this.options = _.merge(DEFAULT_OPTIONS, options);
  this.initialized = false;
  this.logger = logger;

  this.initSession();
}

Locals.prototype.initSession = function() {
  if (Locals.session) {
    this.disconnectSession();
  }

  Locals.session = new inspector.Session();
  Locals.session.connect();
  Locals.currentErrors = new Map();

  Locals.session.on('Debugger.paused', ({ params }) => {
    if (params.reason == 'promiseRejection' || params.reason == 'exception') {
      var key = params.data.description;
      Locals.currentErrors.set(key, params);

      // Set the max size of the current errors array.
      // The value should be large enough to preserve each of the errors in
      // the current cause chain.
      var CURRENT_ERRORS_MAX_SIZE = 4;

      if (Locals.currentErrors.size > CURRENT_ERRORS_MAX_SIZE) {
        var firstKey = Locals.currentErrors.keys()[0];
        Locals.currentErrors.delete(firstKey);
      }
    }
  });

  var self = this;
  Locals.session.post('Debugger.enable', (_err, _result) => {
    self.initialized = true;
    updatePauseState(self.options, self.logger);
  });
}

Locals.prototype.disconnectSession = function() {
  if (Locals.session) {
    updatePauseState({ enabled: false }, this.logger);
    Locals.session.disconnect();
    Locals.session = null;
  }
}

Locals.prototype.updateOptions = function(options) {
  var pauseStateChanged = this.options.enabled != options.enabled || this.options.uncaughtOnly != options.uncaughtOnly;

  this.options = _.merge(this.options, options);

  if (this.initialized && pauseStateChanged) {
    updatePauseState(this.options, this.logger);
  }
}

function updatePauseState(options, logger) {
  var state = pauseStateFromOptions(options);
  Locals.session.post('Debugger.setPauseOnExceptions', { state: state}, (err, _result) => {
    if (err) {
      logger.error('error in setPauseOnExceptions', err);
    }
  });
}

function pauseStateFromOptions(options) {
  if (options.enabled) {
    if (options.uncaughtOnly) {
      return 'uncaught';
    } else {
      return 'all';
    }
  } else {
    return 'none';
  }
}

Locals.prototype.currentLocalsMap = function() {
  return new Map(Locals.currentErrors);
}

Locals.prototype.mergeLocals = function(localsMap, stack, key, callback) {
  var matchedFrames;

  try {
    var localParams = localsMap.get(key);

    // If a mapping isn't found return success without mapped locals.
    if (!localParams) {
      return callback(null);
    }

    matchedFrames = matchFrames(localParams, stack.slice().reverse());
  } catch (e) {
    return callback(e);
  }

  getLocalScopesForFrames(matchedFrames, this.options, callback);
}

// Finds frames in localParams that match file and line locations in stack.
function matchFrames(localParams, stack) {
  var matchedFrames = [];
  var localIndex = 0, stackIndex = 0;
  var stackLength = stack.length;
  var callFrames = localParams.callFrames;
  var callFramesLength = callFrames.length;

  for (; stackIndex < stackLength; stackIndex++) {
    while (localIndex < callFramesLength) {
      if (firstFrame(localIndex, stackIndex) || matchedFrame(callFrames[localIndex], stack[stackIndex])) {
        matchedFrames.push({
          stackLocation: stack[stackIndex],
          callFrame: callFrames[localIndex]
        });
        localIndex++;
        break;
      } else {
        localIndex++;
      }
    }
  }

  return matchedFrames;
}

function firstFrame(localIndex, stackIndex) {
  return !localIndex && !stackIndex;
}

function matchedFrame(callFrame, stackLocation) {
  if (!callFrame || !stackLocation) {
    return false;
  }

  var position = stackLocation.runtimePosition;

  // Node.js prefixes filename some URLs with 'file:///' in Debugger.callFrame,
  // but with only '/' in the error.stack string. Remove the prefix to facilitate a match.
  var callFrameUrl = callFrame.url.replace(/file:\/\//,'');

  // lineNumber is zero indexed, so offset it.
  var callFrameLine = callFrame.location.lineNumber + 1;
  var callFrameColumn = callFrame.location.columnNumber;

  return callFrameUrl === position.source &&
    callFrameLine === position.line &&
    callFrameColumn === position.column;
}

function getLocalScopesForFrames(matchedFrames, options, callback) {
  async.each(matchedFrames, getLocalScopeForFrame.bind({ options: options }), callback);
}

function getLocalScopeForFrame(matchedFrame, callback) {
  var options = this.options;
  var scopes = matchedFrame.callFrame.scopeChain;

  var scope = scopes.find(scope => scope.type === 'local');

  if (!scope) {
    return callback(null); // Do nothing return success.
  }

  getProperties(scope.object.objectId, function(err, response){
    if (err) {
      return callback(err);
    }

    var locals = response.result;
    matchedFrame.stackLocation.locals = {};
    var localsContext = {
      localsObject: matchedFrame.stackLocation.locals,
      options: options,
      depth: options.depth
    }
    async.each(locals, getLocalValue.bind(localsContext), callback);
  });
}

function getLocalValue(local, callback) {
  var localsObject = this.localsObject;
  var options = this.options;
  var depth = this.depth;

  function cb(error, value) {
    if (error) {
      // Add the relevant data to the error object,
      // taking care to preserve the innermost data context.
      if (!error.rollbarContext) {
        error.rollbarContext = local;
      }
      return callback(error);
    }

    if (_.typeName(localsObject) === 'array') {
      localsObject.push(value);
    } else {
      localsObject[local.name] = value;
    }
    callback(null);
  }

  if (!local.value) {
    return cb(null, '[unavailable]');
  }

  switch (local.value.type) {
    case 'undefined': cb(null, 'undefined'); break;
    case 'object': getObjectValue(local, options, depth, cb); break;
    case 'function': cb(null, getObjectType(local)); break;
    case 'symbol': cb(null, getSymbolValue(local)); break;
    default: cb(null, local.value.value); break;
  }
}

function getObjectType(local) {
  if (local.value.className) {
    return '<' + local.value.className + ' object>';
  } else {
    return '<object>';
  }
}

function getSymbolValue(local) {
  return local.value.description;
}

function getObjectValue(local, options, depth, callback) {
  if (!local.value.objectId) {
    if ('value' in local.value) {
      // Treat as immediate value. (Known example is `null`.)
      return callback(null, local.value.value);
    }
  }

  if (depth === 0) {
    return callback(null, getObjectType(local));
  }

  getProperties(local.value.objectId, function(err, response){
    if (err) {
      return callback(err);
    }

    var isArray = local.value.className === 'Array';
    var length = isArray ? options.maxArray : options.maxProperties;
    var properties = response.result.slice(0, length);
    var localsContext = {
      localsObject: isArray ? [] : {},
      options: options,
      depth: depth - 1
    }

    // For arrays, use eachSeries to ensure order is preserved.
    // Otherwise, use each for faster completion.
    var iterator = isArray ? async.eachSeries : async.each;
    iterator(properties, getLocalValue.bind(localsContext), function(error){
      if (error) {
        return callback(error);
      }

      callback(null, localsContext.localsObject);
    });
  });
}

function getProperties(objectId, callback) {
  Locals.session.post('Runtime.getProperties', { objectId : objectId, ownProperties: true }, callback);
}

module.exports = Locals;
