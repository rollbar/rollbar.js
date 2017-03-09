var async = require('async');
var os = require('os');
var packageJson = require('../../package.json');
var parser = require('./parser');
var requestIp = require('request-ip');
var url = require('url');

/*
 * {
 *  uuid,
 *  err,
 *  message,
 *  level,
 *  custom
 * }
 */

var defaultSettings = {
  host: os.hostname(),
  environment: 'development',
  framework: 'node-js',
  showReportedMessageTraces: false,
  notifier: {
    name: 'node_rollbar',
    version: packageJson.version;
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
  var props = Object.getOwnPropertyNames(item.custom);
  props.forEach(function (name) {
    if (!data.hasOwnProperty(name)) {
      data[name] = item.custom[name];
    }
  });

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

  item.data.body.trace_chain = chain;

  var cb = function(err) {
    if (err) {
      callback(e, null);
    }
    callback(null, item);
  };
  async.eachSeries(errors, _buildTraceData(chain), cb);
};

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

// TODO TODO TODO
function scrubRequestHeaders(headers, settings) {
  var obj, k;

  obj = {};
  settings = settings || SETTINGS;
  for (k in headers) {
    if (headers.hasOwnProperty(k)) {
      if (settings.scrubHeaders.indexOf(k) === -1) {
        obj[k] = headers[k];
      } else {
        obj[k] = '******';
      }
    }
  }
  return obj;
}


function scrubRequestParams(params, settings) {
  var k;

  settings = settings || SETTINGS;
  for (k in params) {
    if (params.hasOwnProperty(k) && params[k] && settings.scrubFields.indexOf(k) >= 0) {
      params[k] = '******';
    }
  }

  return params;
}

