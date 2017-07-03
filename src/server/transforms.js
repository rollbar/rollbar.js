var async = require('async');
var parser = require('./parser');
var requestIp = require('request-ip');
var url = require('url');
var _ = require('../utility');

function baseData(item, options, callback) {
  var environment = (options.payload && options.payload.environment) || options.environment;
  var data = {
    timestamp: Math.floor((new Date().getTime()) / 1000),
    environment: item.environment || environment,
    level: item.level || 'error',
    language: 'javascript',
    framework: item.framework || options.framework,
    uuid: item.uuid,
    notifier: JSON.parse(JSON.stringify(options.notifier))
  };

  if (options.codeVersion) {
    data.code_version = options.codeVersion;
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
    callback(null, item);
    return;
  }

  var err = item.err;
  var errors = [];
  var chain = [];
  do {
    errors.push(err);
  } while ((err = err.nested) !== undefined);
  item.stackInfo = chain;

  var cb = function(err) {
    if (err) {
      item.message = item.err.message || item.err.description || item.message || String(item.err);
      delete item.err;
      delete item.stackInfo;
      callback(null, item);
    }
    callback(null, item);
  };
  async.eachSeries(errors, _buildTraceData(chain), cb);
}

function addRequestData(item, options, callback) {
  item.data = item.data || {};

  var req = item.request;
  if (!req) {
    callback(null, item);
    return;
  }

  if (options.addRequestData && _.isFunction(options.addRequestData)) {
    options.addRequestData(item.data, req);
    callback(null, item);
    return;
  }

  var requestData = _buildRequestData(req);
  item.data.request = requestData;

  if (req.route) {
    item.data.context = req.route.path;
  } else {
    try {
      item.data.context = req.app._router.matchRequest(req).path;
    } catch (ignore) {
      // Ignored
    }
  }

  if (req.rollbar_person) {
    item.data.person = req.rollbar_person;
  } else if (req.user) {
    item.data.person = {id: req.user.id};
    if (req.user.username) {
      item.data.person.username = req.user.username;
    }
    if (req.user.email) {
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

function scrubPayload(item, options, callback) {
  var scrubHeaders = options.scrubHeaders || [];
  var scrubFields = options.scrubFields || [];
  scrubFields = scrubHeaders.concat(scrubFields);
  _.scrub(item.data, scrubFields);
  callback(null, item);
}

function convertToPayload(item, options, callback) {
  var payloadOptions = options.payload || {};
  if (payloadOptions.body) {
    delete payloadOptions.body;
  }

  var data = _.extend(true, {}, item.data, payloadOptions);
  callback(null, data);
}

/** Helpers **/

function _buildTraceData(chain) {
  return function(ex, cb) {
    parser.parseException(ex, function (err, errData) {
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

      return cb();
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
  var reqUrl = proto + '://' + host + (req.url || '');
  var parsedUrl = url.parse(reqUrl, true);
  var data = {
    url: reqUrl,
    GET: parsedUrl.query,
    user_ip: _extractIp(req),
    headers: headers,
    method: req.method
  };

  if (req.body) {
    var bodyParams = {};
    if (_.isIterable(req.body)) {
      for (var k in req.body) {
        if (Object.prototype.hasOwnProperty.call(req.body, k)) {
          bodyParams[k] = req.body[k];
        }
      }
      data[req.method] = bodyParams;
    } else {
      data.body = req.body;
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
  scrubPayload: scrubPayload,
  convertToPayload: convertToPayload
};

