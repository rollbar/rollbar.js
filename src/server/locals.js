/* globals Map */
var inspector = require('inspector');
var async = require('async');

function Locals(config) {
  this.config = config;

  this.initSession();
}

Locals.prototype.initSession = function() {
  if (Locals.session) { return; }

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

  Locals.session.post('Debugger.enable', (_err, _result) => {
    Locals.session.post('Debugger.setPauseOnExceptions', { state: 'all'}, (_err, _result) => {
    });
  });
}

Locals.prototype.currentLocalsMap = function() {
  if (Locals.currentErrors.size) {
    return new Map(Locals.currentErrors);
  }
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

  getLocalScopesForFrames(matchedFrames, callback);
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

function getLocalScopesForFrames(matchedFrames, callback) {
  async.each(matchedFrames, getLocalScopeForFrame, callback);
}

function getLocalScopeForFrame(matchedFrame, callback) {
  var scopes = matchedFrame.callFrame.scopeChain;

  for (var i = 0; i < scopes.length; i++) {
    var scope = scopes[i]
    if (scope.type === 'local') {
      getProperties(scope.object.objectId, function(err, response){
        if (err) {
          return callback(err);
        }

        var locals = response.result;
        matchedFrame.stackLocation.locals = {};
        for (var local of locals) {
          matchedFrame.stackLocation.locals[local.name] = getLocalValue(local);
        }

        callback(null);
      });
    }
  }
}

function getLocalValue(local) {
  var value;

  switch (local.value.type) {
    case 'undefined': value = 'undefined'; break;
    case 'object': value = getObjectValue(local); break;
    case 'array': value = getObjectValue(local); break;
    default: value = local.value.value; break;
  }

  return value;
}

function getObjectValue(local) {
  if (local.value.className) {
    return '<' + local.value.className + ' object>'
  } else {
    return '<object>'
  }
}

function getProperties(objectId, callback) {
  Locals.session.post('Runtime.getProperties', { objectId : objectId, ownProperties: true }, callback);
}

module.exports = Locals;
