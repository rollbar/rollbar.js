var async = require('async');
var parser = require('./parser');
var requestIp = require('request-ip');
var url = require('url');
var _ = require('../utility');
var scrub = require('../scrub');

function baseData(item, options, callback) {
  var environment = (options.payload && options.payload.environment) || options.environment;
  var data = {
    timestamp: Math.round(item.timestamp / 1000),
    environment: item.environment || environment,
    level: item.level || 'error',
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

  data.server = {
    host: options.host,
    argv: process.argv.concat(),
    pid: process.pid
  };

  if (options.branch) {
    data.server.branch = options.branch;
  }
  if (options.root) {
    data.server.root = options.root;
  }

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
    item.data.body.trace_chain = item.stackInfo;
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
  var errors = [];
  var chain = [];
  do {
    errors.push(err);
    err = err.nested;
  } while (err);
  item.stackInfo = chain;

  if (options.addErrorContext) {
    _.addErrorContext(item, errors);
  }

  var cb = function(e) {
    if (e) {
      item.message = item.err.message || item.err.description || item.message || String(item.err);
      item.diagnostic.buildTraceData = e.message;
      delete item.stackInfo;
    }
    callback(null, item);
  };
  async.eachSeries(errors, _buildTraceData(chain, options, item), cb);
}

function addRequestData(item, options, callback) {
  item.data = item.data || {};

  var req = item.request;
  if (!req) {
    callback(null, item);
    return;
  }

  var baseUrl = req.baseUrl || '';

  if (options.addRequestData && _.isFunction(options.addRequestData)) {
    options.addRequestData(item.data, req);
    callback(null, item);
    return;
  }

  var requestData = _buildRequestData(req);
  _.filterIp(requestData, options.captureIp);
  item.data.request = requestData;

  var routePath;

  if (req.route) {
    routePath = req.route.path;
    item.data.context = baseUrl && baseUrl.length ? baseUrl + routePath : routePath;
  } else {
    try {
      routePath = req.app._router.matchRequest(req).path;
      item.data.context = baseUrl && baseUrl.length ? baseUrl + routePath : routePath;
    } catch (ignore) {
      // Ignored
    }
  }

  var captureEmail = options.captureEmail;
  var captureUsername = options.captureUsername;
  if (req.rollbar_person) {
    var person = req.rollbar_person;
    if (!captureEmail && person.email) {
      person.email = null;
    }
    if (!captureUsername && person.username) {
      person.username = null;
    }
    item.data.person = person;
  } else if (req.user) {
    item.data.person = {id: req.user.id};
    if (req.user.username && captureUsername) {
      item.data.person.username = req.user.username;
    }
    if (req.user.email && captureEmail) {
      item.data.person.email = req.user.email;
    }
  } else if (req.user_id || req.userId) {
    var userId = req.user_id || req.userId;
    if (_.isFunction(userId)) {
      userId = userId();
    }
    item.data.person = {id: userId};
  }

  callback(null, item);
}

function addLambdaData(item, options, callback) {
  var c = item.lambdaContext;
  if (!c) {
    callback(null, item);
    return;
  }

  var data = {
    remainingTimeInMillis: c.getRemainingTimeInMillis(),
    callbackWaitsForEmptyEventLoop: c.callbackWaitsForEmptyEventLoop,
    functionName: c.functionName,
    functionVersion: c.functionVersion,
    arn: c.invokedFunctionArn,
    requestId: c.awsRequestId
  };

  item.data = item.data || {};
  item.data.custom = item.data.custom || {};
  item.data.custom.lambda = data;

  callback(null, item);
}

function scrubPayload(item, options, callback) {
  var scrubHeaders = options.scrubHeaders || [];
  var scrubFields = options.scrubFields || [];
  var scrubPaths = options.scrubPaths || [];
  scrubFields = scrubHeaders.concat(scrubFields);

  parseRequestBody(item.data.request, options);
  item.data = scrub(item.data, scrubFields, scrubPaths);
  serializeRequestBody(item.data.request, options);

  callback(null, item);
}

function parseRequestBody(req, options) {
  if (!req || !options.scrubRequestBody) { return }

  try {
    if (_.isString(req.body) && _isJsonContentType(req)) {
      req.body = JSON.parse(req.body);
    }
  } catch (e) {
    req.body = null;
    req.error = 'request.body parse failed: ' + e.message;
  }
}

function serializeRequestBody(req, options) {
  if (!req || !options.scrubRequestBody) { return }

  try {
    if (_.isObject(req.body) && _isJsonContentType(req)) {
      req.body = JSON.stringify(req.body);
    }
  } catch (e) {
    req.body = null;
    req.error = 'request.body serialization failed: ' + e.message;
  }
}

/** Helpers **/

function _isJsonContentType(req) {
  return req.headers && req.headers['content-type'] && req.headers['content-type'].includes('json');
}

function _buildTraceData(chain, options, item) {
  return function(ex, cb) {
    parser.parseException(ex, options, item, function (err, errData) {
      if (err) {
        return cb(err);
      }

      chain.push({
        frames: errData.frames,
        exception: {
          class: errData['class'],
          message: errData.message
        }
      });

      return cb(null);
    });
  };
}

function _extractIp(req) {
  var ip = req.ip;
  if (!ip) {
    ip = requestIp.getClientIp(req);
  }
  return ip;
}

function _buildRequestData(req) {
  var headers = req.headers || {};
  var host = headers.host || '<no host>';
  var proto = req.protocol || ((req.socket && req.socket.encrypted) ? 'https' : 'http' );
  var parsedUrl;
  var baseUrl = req.baseUrl || '';
  if (_.isType(req.url, 'string')) {
    var fullUrl = baseUrl && baseUrl.length ? baseUrl + req.url : req.url
    parsedUrl = url.parse(fullUrl, true);
  } else {
    parsedUrl = req.url || {};
  }
  parsedUrl.protocol = parsedUrl.protocol || proto;
  parsedUrl.host = parsedUrl.host || host;
  var reqUrl = url.format(parsedUrl);
  var data = {
    url: reqUrl,
    user_ip: _extractIp(req),
    headers: headers,
    method: req.method
  };
  if (parsedUrl.search && parsedUrl.search.length > 0) {
    data.GET = parsedUrl.query;
  }

  var body = req.body || req.payload;
  if (body) {
    var bodyParams = {};
    if (_.isIterable(body)) {
      for (var k in body) {
        if (Object.prototype.hasOwnProperty.call(body, k)) {
          bodyParams[k] = body[k];
        }
      }
      data[req.method] = bodyParams;
    } else {
      data.body = body;
    }
  }
  return data;
}

module.exports = {
  baseData: baseData,
  handleItemWithError: handleItemWithError,
  addBody: addBody,
  addMessageData: addMessageData,
  addErrorData: addErrorData,
  addRequestData: addRequestData,
  addLambdaData: addLambdaData,
  scrubPayload: scrubPayload
};
