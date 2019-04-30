var _ = require('../utility');

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
    notifier: JSON.parse(JSON.stringify(options.notifier))
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
  var message = item.message || '';
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

  var err = item.err;
  var frames = _handleStack(err.stack);
  var stackInfo = {
    frames: frames,
    exception: {
      class: String(err.constructor.name || err.name || '<unknown>'),
      message: String(err.message || '<no message>')
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
  scrubFields = scrubHeaders.concat(scrubFields);
  item.data = _.scrub(item.data, scrubFields);
  callback(null, item);
}

/** Helpers **/

function _handleStack(stack) {
  var lines = (stack || '').split('\n');
  var results = [];
  var frame;
  for (var i = lines.length - 1; i >= 0; i--) {
    frame = _parseRawFrame(lines[i]);
    results.push(frame);
  }
  return results;
}

function _parseRawFrame(line) {
  var methodAndRest = line.split('@');
  var method, rest;
  if (methodAndRest.length > 1) {
    method = methodAndRest[0];
    rest = methodAndRest[1];
  } else {
    rest = methodAndRest[0];
  }
  var colIdx = rest.lastIndexOf(':');
  var colno, lineno;
  if (colIdx > -1) {
    colno = rest.substring(colIdx+1);
    rest = rest.substring(0, colIdx);
  }
  var lineIdx = rest.lastIndexOf(':');
  if (lineIdx > -1) {
    lineno = rest.substring(lineIdx+1);
    rest = rest.substring(0, lineIdx);
  }
  var iosBundleFilename = new RegExp('^.*/[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/[^/]*.app/(.*)$');
  var match = rest && rest.match && rest.match(iosBundleFilename);
  if (match && match[1]) {
    rest = 'http://reactnativehost/' + match[1];
  } else {
    rest = 'http://reactnativehost/' + rest;
  }
  return {
    method: method || '<unknown>',
    filename: rest || '<unknown>',
    lineno: Math.floor(lineno),
    colno: Math.floor(colno)
  };
}

module.exports = {
  baseData: baseData,
  handleItemWithError: handleItemWithError,
  addBody: addBody,
  scrubPayload: scrubPayload
};
