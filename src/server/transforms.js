var async = require('async');
var os = require('os');
var packageJson = require('../../package.json');
var parser = require('./parser');
var requestIp = require('request-ip');
var url = require('url');
var _ = require('../utility');

var defaultSettings = {
  host: os.hostname(),
  environment: 'development',
  framework: 'node-js',
  showReportedMessageTraces: false,
  notifier: {
    name: 'node_rollbar',
    version: packageJson.version
  },
  scrubHeaders: packageJson.defaults.server.scrubHeaders,
  scrubFields: packageJson.defaults.server.scrubFields,
  addRequestData: null,
  minimumLevel: 'debug',
  enabled: true
};

function baseData(item, options, callback) {
  var data = {
    timestamp: Math.floor((new Date().getTime()) / 1000),
    environment: item.environment || options.environment || defaultSettings.environment,
    level: item.level || 'error',
    language: 'javascript',
    framework: item.framework || options.framework || defaultSettings.framework,
    uuid: item.uuid,
    notifier: JSON.parse(JSON.stringify(options.notifier || defaultSettings.notifier))
  };

  if (options.codeVersion) {
    data.code_version = options.codeVersion;
  }
  if (item.custom) {
    var props = Object.getOwnPropertyNames(item.custom);
    props.forEach(function (name) {
      if (!data.hasOwnProperty(name)) {
        data[name] = item.custom[name];
      }
    });
  }

  data.server = {
    host: options.host || defaultSettings.host,
    argv: process.argv.concat(),
    pid: process.pid
  };

  if (options.branch || defaultSettings.branch) {
    data.server.branch = options.branch || defaultSettings.branch;
  }
  if (options.root || defaultSettings.root) {
    data.server.root = options.root || defaultSettings.root;
  }

  item.data = data;
  callback(null, item);
}

function addMessageData(item, options, callback) {
  item.data = item.data || {};
  item.data.body = item.data.body || {};
  if (item.message !== undefined) {
    item.data.body.message = {
      body: item.message
    };
  }
  callback(null, item);
}

function buildErrorData(item, options, callback) {
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

  item.data = item.data || {};
  item.data.body = item.data.body || {};
  item.data.body.trace_chain = chain;

  var cb = function(err) {
    if (err) {
      callback(e, null);
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

  var requestData = _buildRequestData(req, options);
  item.data.request = requestData;

  if (req.route) {
    item.data.context = req.route.path;
  } else {
    try {
      item.data.context = req.app.__router.matchRequest(req).path;
    } catch (ignore) {}
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

function convertToPayload(item, options, callback) {
  callback(null, item.data);
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
};

function _scrubRequestHeaders(headers, options) {
  var scrubHeaders = options.scrubHeaders || defaultSettings.scrubHeaders || [];
  return _scrubObject(headers, scrubHeaders);
}

function _scrubRequestParams(params, options) {
  var scrubFields = options.scrubFields || defaultSettings.scrubFields || [];
  return _scrubObject(params, scrubFields);
}

function _scrubObject(input, scrubKeys) {
  var obj = {};
  var k;
  for (k in input) {
    if (input.hasOwnProperty(k)) {
      obj[k] = scrubKeys.indexOf(k) === -1 ? input[k] : '******';
    }
  }
  return obj;
}

function _extractIp(req) {
  var ip = req.ip;
  if (!ip) {
    ip = requestIp.getClientIp(req);
  }
  return ip;
}

function _buildRequestData(req, options) {
  var headers = req.headers || {};
  var host = headers.host || '<no host>';
  var proto = req.protocol || ((req.socket && req.socket.encrypted) ? 'https' : 'http' );
  var reqUrl = proto + '://' + host + (req.url || '');
  var parsedUrl = url.parse(reqUrl, true);
  var data = {
    url: reqUrl,
    GET: parsedUrl.query,
    user_ip: _extractIp(req),
    headers: _scrubRequestHeaders(headers, options),
    method: req.method
  };

  if (req.body) {
    bodyParams = {};
    if (_.isType(req.body, 'object')) {
      isPlainObject = req.body.constructor === undefined;

      for (k in req.body) {
        hasOwnProperty = typeof req.body.hasOwnProperty === 'function'
          && req.body.hasOwnProperty(k);

        if (hasOwnProperty || isPlainObject) {
          bodyParams[k] = req.body[k];
        }
      }
      data[req.method] = _scrubRequestParams(bodyParams, options);
    } else {
      data.body = req.body;
    }
  }
  return data;
}

module.exports = {
  baseData: baseData,
  addMessageData: addMessageData,
  buildErrorData: buildErrorData,
  addRequestData: addRequestData,
  convertToPayload: convertToPayload
};

