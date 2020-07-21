var _ = require('../utility');
var scrub = require('../scrub');
var errorParser = require('../errorParser');

function baseData(item, options, callback) {
  var environment = (options.payload && options.payload.environment) || options.environment;
  var data = {
    timestamp: Math.round(item.timestamp / 1000),
    environment: item.environment || environment,
    level: item.level || 'error',
    platform: options.platform || 'client',
    language: 'javascript',
    framework: item.framework || options.framework,
    uuid: item.uuid,
    notifier: JSON.parse(JSON.stringify(options.notifier)),
    custom: item.custom
  };

  if (options.codeVersion) {
    data.code_version = options.codeVersion;
  } else if (options.code_version) {
    data.code_version = options.code_version;
  }

  var props = Object.getOwnPropertyNames(item.custom || {});
  props.forEach(function (name) {
    if (!data.hasOwnProperty(name)) {
      data[name] = item.custom[name];
    }
  });

  item.data = data;
  callback(null, item);
}

function addMessageData(item, options, callback) {
  item.data = item.data || {};
  item.data.body = item.data.body || {};
  var message = item.message || 'Item sent with null or missing arguments.';
  item.data.body.message = {
    body: message
  };
  callback(null, item);
}

function addErrorData(item, options, callback) {
  if (item.stackInfo) {
    item.data = item.data || {};
    item.data.body = item.data.body || {};
    item.data.body.trace = item.stackInfo;
  }
  callback(null, item);
}

function addBody(item, options, callback) {
  if (item.stackInfo) {
    addErrorData(item, options, callback);
  } else {
    addMessageData(item, options, callback);
  }
}

function handleItemWithError(item, options, callback) {
  if (!item.err) {
    return callback(null, item);
  }

  if (options.addErrorContext) {
    _.addErrorContext(item, [item.err]);
  }

  var err = item.err;
  var parsedError = errorParser.parse(err);
  var guess = errorParser.guessErrorClass(parsedError.message);
  var message = guess[1];
  var stackInfo = {
    frames: _buildFrames(parsedError.stack, options),
    exception: {
      class: _errorClass(parsedError.name, guess[0], options),
      message: message
    }
  };
  if (err.description) {
    stackInfo.exception.description = String(err.description);
  }
  item.stackInfo = stackInfo;
  callback(null, item);
}

function scrubPayload(item, options, callback) {
  var scrubHeaders = options.scrubHeaders || [];
  var scrubFields = options.scrubFields || [];
  var scrubPaths = options.scrubPaths || [];
  scrubFields = scrubHeaders.concat(scrubFields);
  item.data = scrub(item.data, scrubFields, scrubPaths);
  callback(null, item);
}

/** Helpers **/

function _errorClass(name, guess, options) {
  if (name) {
    return name;
  } else if (options.guessErrorClass) {
    return guess;
  } else {
    return '<unknown>';
  }
}

function _buildFrames(stack, options) {
  if (!stack) {
    return [];
  }

  var frames = [];
  for (var i = 0; i < stack.length; ++i) {
    var stackFrame = stack[i];
    var filename = stackFrame.url ? _.sanitizeUrl(stackFrame.url) : '<unknown>';
    var frame = {
      filename: _rewriteFilename(filename, options),
      lineno: stackFrame.line || null,
      method: (!stackFrame.func || stackFrame.func === '?') ? '[anonymous]' : stackFrame.func,
      colno: stackFrame.column
    };
    frames.push(frame);
  }
  return frames;
}

function _rewriteFilename(filename, options) {
  var match = filename && filename.match && _matchFilename(filename, options);
  if (match) {
    return 'http://reactnativehost/' + match;
  } else {
    return 'http://reactnativehost/' + filename;
  }
}

function _matchFilename(filename, options) {
  var patterns = options.rewriteFilenamePatterns || [];
  var length = patterns.length || 0;

  for(var i = 0; i < length; i++) {
    var pattern = new RegExp(patterns[i]);
    var match = filename.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

module.exports = {
  baseData: baseData,
  handleItemWithError: handleItemWithError,
  addBody: addBody,
  scrubPayload: scrubPayload,
  _matchFilename: _matchFilename // to enable unit test
};
