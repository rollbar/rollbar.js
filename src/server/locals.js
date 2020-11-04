/* globals Map */
var inspector = require('inspector');
var async = require('async');

function Locals(config) {
  this.config = config;
  this.errorCounter = 0;
  this.currentErrors = new Map();

  this.initSession();
}

Locals.prototype.initSession = function() {
  this.session = new inspector.Session();
  this.session.connect();

  this.session.on('Debugger.paused', ({ params }) => {
    if (params.reason == 'promiseRejection' || params.reason == 'exception') {
      var key = params.data.description;
      this.currentErrors.set(key, params);

      if (this.currentErrors.size > 4) {
        var firstKey = this.currentErrors.keys()[0];
        this.currentErrors.delete(firstKey);
      }
    }
  });

  this.session.post('Debugger.enable', (_err, _result) => {
    this.session.post('Debugger.setPauseOnExceptions', { state: 'all'}, (_err, _result) => {
    });
  });
}

Locals.prototype.currentLocalsMap = function() {
  if (this.currentErrors.size) {
    return new Map(this.currentErrors);
  }
}

Locals.prototype.mergeLocals = function(localsMap, stack, key, callback) {
  var matchedFrames;

  try {
    var localParams = localsMap.get(key);
    matchedFrames = this.matchFrames(localParams, stack.slice().reverse());
  } catch (e) {
    return callback(e);
  }

  this.getLocalScopesForFrames(matchedFrames, function(err) {
    callback(err);
  });
}

// Finds frames in localParams that match file and line locations in stack.
Locals.prototype.matchFrames = function(localParams, stack) {
  var matchedFrames = [];
  var localIndex = 0, stackIndex = 0;
  var stackLength = stack.length;
  var callFrames = localParams.callFrames;
  var callFramesLength = callFrames.length;

  for (; stackIndex < stackLength; stackIndex++) {
    while (localIndex < callFramesLength) {
      if (this.firstFrame(localIndex, stackIndex) || this.matchedFrame(callFrames[localIndex], stack[stackIndex])) {
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

Locals.prototype.firstFrame = function(localIndex, stackIndex) {
  return !localIndex && !stackIndex;
}

Locals.prototype.matchedFrame = function(callFrame, stackLocation) {
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

Locals.prototype.getLocalScopesForFrames = function(matchedFrames, callback) {
  async.each(matchedFrames, this.getLocalScopeForFrame.bind(this), function (err) {
    callback(err);
  });
}

Locals.prototype.getLocalScopeForFrame = function(matchedFrame, callback) {
  var scopes = matchedFrame.callFrame.scopeChain;

  var _this = this;
  for (var i = 0; i < scopes.length; i++) {
    var scope = scopes[i]
    if (scope.type === 'local') {
      this.getProperties(scope.object.objectId, function(err, response){
        if (err) {
          return callback(err);
        }

        var locals = response.result;
        matchedFrame.stackLocation.locals = {};
        for (var local of locals) {
          matchedFrame.stackLocation.locals[local.name] = _this.getLocalValue(local);
        }

        callback(null);
      });
    }
  }
}

Locals.prototype.getLocalValue = function(local) {
  var value;

  switch (local.value.type) {
    case 'undefined': value = 'undefined'; break;
    case 'object': value = this.getObjectValue(local); break;
    default: value = local.value.value; break;
  }

  return value;
}

Locals.prototype.getObjectValue = function(local) {
  if (local.value.className) {
    return '<' + local.value.className + ' object>'
  } else {
    return '<object>'
  }
}

Locals.prototype.getProperties = function(objectId, callback) {
  this.session.post('Runtime.getProperties', { objectId : objectId, ownProperties: true }, callback);
}

module.exports = Locals;
