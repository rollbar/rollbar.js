/*jslint devel: true, nomen: true, plusplus: true, regexp: true, indent: 2, maxlen: 100 */

"use strict";

var logger = require('./logger');
var async = require('async');
var http = require('http');
var https = require('https');
var uuidV4 = require('uuid/v4');
var os = require('os');
var url = require('url');
var requestIp = require('request-ip');

var parser = require('./parser');
var packageJson = require('../../../package.json');
var stringify = require('json-stringify-safe');


exports.VERSION = packageJson.version;


var SETTINGS = {
  accessToken: null,
  codeVersion: null,
  host: os.hostname(),
  environment: 'development',
  framework: 'node-js',
  root: null,  // root path to your code
  branch: null,  // git branch name
  showReportedMessageTraces: false, // optionally shows manually-reported errors and a stack trace
  notifier: {
    name: 'node_rollbar',
    version: exports.VERSION
  },
  scrubHeaders: packageJson.defaults.server.scrubHeaders,
  scrubFields: packageJson.defaults.server.scrubFields,
  addRequestData: null,  // Can be set by the user or will default to addRequestData defined below
  minimumLevel: 'debug',
  enabled: true
};


var apiClient;
var initialized = false;
var pendingItems = [];
var waitCallback = null;

/** Internal **/


function genUuid() {
  var buf = new Buffer(16);
  uuidV4(null, buf);
  return buf.toString('hex');
}


function buildBaseData(extra) {
  var data, props;

  extra = extra || {};
  data = {
    timestamp: Math.floor((new Date().getTime()) / 1000),
    environment: extra.environment || SETTINGS.environment,
    level: extra.level || 'error',
    language: 'javascript',
    framework: extra.framework || SETTINGS.framework,
    uuid: genUuid(),
    notifier: JSON.parse(JSON.stringify(SETTINGS.notifier))
  };

  if (SETTINGS.codeVersion) {
    data.code_version = SETTINGS.codeVersion;
  }

  props = Object.getOwnPropertyNames(extra);
  props.forEach(function (name) {
    if (!data.hasOwnProperty(name)) {
      data[name] = extra[name];
    }
  });

  data.server = {
    host: SETTINGS.host,
    argv: process.argv.concat(),
    pid: process.pid
  };

  data.server.host = SETTINGS.host;

  if (SETTINGS.branch) {
    data.server.branch = SETTINGS.branch;
  }
  if (SETTINGS.root) {
    data.server.root = SETTINGS.root;
  }

  return data;
}


function buildErrorData(baseData, err, callback) {
  var errors = [];
  var chain = [];

  do {
    errors.push(err);
  } while((err = err.nested) !== undefined);

  baseData.body.trace_chain = chain;

  var cb = function(err) {
    if(err) {
      return callback(err);
    }

    return callback(null);
  };

  async.eachSeries(errors, _buildTraceData(chain), cb);
}

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


function charFill(char, num) {
  var a, x;

  a = [];
  x = num;
  while (x > 0) {
    a[x] = '';
    x -= 1;
  }
  return a.join(char);
}


function scrubRequestHeaders(headers, settings) {
  var obj, k;

  obj = {};
  settings = settings || SETTINGS;
  for (k in headers) {
    if (headers.hasOwnProperty(k)) {
      if (settings.scrubHeaders.indexOf(k) === -1) {
        obj[k] = headers[k];
      } else {
        obj[k] = charFill('*', headers[k].length);
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


function extractIp(req) {
  var ip = req.ip;
  if (!ip) {
    try {
      ip = requestIp.getClientIp(req)
    } catch (error) {
      // we might get here if req.headers is undefined. in that case go ahead and
      // walk through the various attributes of req that might contain an address
      // (request-ip will do this for us but wouldn't have gotten this far if
      // headers were undefined so we do it manually using the same logic from:
      // https://github.com/pbojinov/request-ip/blob/master/index.js#L36)
      if (req.connection && req.connection.remoteAddress) {
        ip = req.connection.remoteAddress;
      } else if (req.socket && req.socket.remoteAddress) {
        ip = req.socket.remoteAddress;
      } else if (req.connection && req.connection.socket && req.connection.socket.remoteAddress) {
        ip = req.connection.socket.remoteAddress;
      } else if (req.info && req.info.remoteAddress) {
        ip = req.info.remoteAddress;
      }
    }
  }
  return ip;
}


function buildRequestData(req) {
  var headers, host, proto, reqUrl, parsedUrl, data, bodyParams, k, isPlainObject, hasOwnProperty;

  headers = req.headers || {};
  host = headers.host || '<no host>';
  proto = req.protocol || ((req.socket && req.socket.encrypted) ? 'https' : 'http');
  reqUrl = proto + '://' + host + (req.url || '');
  parsedUrl = url.parse(reqUrl, true);
  data = {url: reqUrl,
    GET: parsedUrl.query,
    user_ip: extractIp(req),
    headers: scrubRequestHeaders(headers),
    method: req.method};

  if (req.body) {
    bodyParams = {};
    if (typeof req.body === 'object') {
      isPlainObject = req.body.constructor === undefined;

      for (k in req.body) {
        hasOwnProperty = typeof req.body.hasOwnProperty === 'function'
          && req.body.hasOwnProperty(k);

        if (hasOwnProperty || isPlainObject) {
          bodyParams[k] = req.body[k];
        }
      }
      data[req.method] = scrubRequestParams(bodyParams);
    } else {
      data.body = req.body;
    }
  }

  return data;
}


function addRequestData(data, req) {
  var reqData, userId;

  reqData = buildRequestData(req);
  if (reqData) {
    data.request = reqData;
  }

  if (req.route) {
    data.context = req.route.path;
  } else {
    try {
      data.context = req.app._router.matchRequest(req).path;
    } catch (ignore) {
      // ignore
    }
  }

  if (req.rollbar_person) {
    data.person = req.rollbar_person;
  } else if (req.user) {
    data.person = {id: req.user.id};
    if (req.user.username) {
      data.person.username = req.user.username;
    }
    if (req.user.email) {
      data.person.email = req.user.email;
    }
  } else if (req.user_id || req.userId) {
    userId = req.user_id || req.userId;
    if (typeof userId === 'function') {
      userId = userId();
    }
    data.person = {id: userId};
  }
}


function buildItemData(item, callback) {
  var baseData, steps;

  baseData = buildBaseData(item.payload);

  // Add the message to baseData if there is one
  function addMessageData(callback) {
    baseData.body = {};
    if (item.message !== undefined) {
      baseData.body.message = {
        body: item.message
      };
    }
    callback(null);
  }

  // Add the error trace information to baseData if there is one
  function addTraceData(callback) {
    if (item.error) {
      buildErrorData(baseData, item.error, callback);
    } else {
      callback(null);
    }
  }

  // Add the request information to baseData if there is one
  function addReqData(callback) {
    var addReqDataFn = SETTINGS.addRequestData || addRequestData;
    if (item.request) {
      addReqDataFn(baseData, item.request);
    }
    callback(null);
  }

  steps = [
    addMessageData,
    addTraceData,
    addReqData
  ];

  async.series(steps, function (err) {
    if (err) {
      return callback(err);
    }

    callback(null, baseData);
  });

}


// Is the error level of a given item greater than or equal to the configured
// minimum level?
function levelGteMinimum(item) {
  var levels, messageLevel, payload, i, length;

  levels = [
    'critical',
    'error',
    'warning',
    'info',
    'debug'
  ];
  payload = item.payload || {};
  messageLevel = payload.level === undefined ? 'error' : payload.level;

  for (i = 0, length = levels.length; i < length; i++) {
    if (levels[i] === messageLevel) {
      return true;
    }
    if (levels[i] === SETTINGS.minimumLevel) {
      return false;
    }
  }

  // At this point the minimum level was never reached and the message level
  // wasn't a known one; something is wrong
  logger.error('minimumLevel of "%s" is unknown; '
      + 'meanwhile, message level of "%s" is unknown',
      SETTINGS.minimumLevel, messageLevel);

  // Allow the message to be sent anyway
  return true;
}


function addItem(item, callback) {
  if (typeof callback !== 'function') {
    callback = function dummyCallback() { return; };
  }

  if (!initialized) {
    var message = 'Rollbar is not initialized';
    logger.error(message);
    return callback(new Error(message));
  }

  if (!SETTINGS.enabled){
    logger.log('Rollbar is disabled');
    // reporting is disabled, so it's not an error
    // let's pretend everything is fine
    return callback();
  }

  if (!levelGteMinimum(item)) {
    logger.log('Item has insufficient level');
    callback();
    return;
  }

  try {
    var pendingItem = {item:item, req:null};
    pendingItems.push(pendingItem);

    buildItemData(item, function (err, data) {
      if (err) {
        dequeuePendingItem(pendingItem);
        return callback(err);
      }

      try {
        apiClient.postItem(data, function (err, resp) {
          dequeuePendingItem(pendingItem);
          callback(err, data, resp);
        });
      } catch (e) {
        dequeuePendingItem(pendingItem);
        logger.error('Internal error while posting item: ' + e);
        callback(e);
      }
    });
  } catch (e) {
    dequeuePendingItem(pendingItem);
    logger.error('Internal error while building payload: ' + e);
    callback(e);
  }
}


/*
 * This will remove a pendingItem entry from the queue.  This should be called
 * either when there is an error, or when the item was sent successfully.
 */
function dequeuePendingItem(pendingItem) {
  for (var i=0; i < pendingItems.length; i++) {
    if (pendingItems[i] == pendingItem) {
      pendingItems.splice(i, 1);

      // If there is a registered wait callback, and we've reached the end
      // of the pendingItem queue, then call that callback.
      if (typeof waitCallback === 'function' && exports.pendingItemsCount() === 0) {
        waitCallback();
      }

      return;
    }
  }
}

/*
 * Exports for testing
 */


exports._scrubRequestHeaders = function (headersToScrub, headers) {
  return scrubRequestHeaders(headers, headersToScrub ? {scrubHeaders: headersToScrub} : undefined);
};


exports._scrubRequestParams = function (paramsToScrub, params) {
  return scrubRequestParams(params, paramsToScrub ? {scrubFields: paramsToScrub} : undefined);
};


exports._extractIp = function (req) {
  return extractIp(req);
};


exports._levelGteMinimum = function (item) {
  return levelGteMinimum(item);
};


/*
 * Public API
 */

exports.init = function (api, options) {
  var opt;

  SETTINGS.accessToken = api.accessToken;

  apiClient = api;
  options = options || {};

  for (opt in options) {
    if (options.hasOwnProperty(opt)) {
      SETTINGS[opt] = options[opt];
    }
  }
  initialized = true;
};


exports.pendingItemsCount = function() {
  return pendingItems.length;
};


/*
 * This registers a wait callback.  This callback will be called
 * when there are 0 pendingItems enqueued.  It could be called immediately
 * if there are none pending right now.  Or if there are pending items
 * then it will be called when the pendingItem queue becomes empty.
 */
exports.wait = function(callback) {
  if (exports.pendingItemsCount() === 0) {
    callback();
  } else {
    waitCallback = callback;
  }
};


exports.handleError = function (err, req, callback) {
  if (typeof req === 'function') {
    callback = req;
    req = null;
  }
  if (err instanceof Error) {
    return exports.handleErrorWithPayloadData(err, {}, req, callback);
  }

  var stringError;
  try {
    stringError = JSON.stringify(err);
  } catch (e) {
    stringError = stringify(err);
  } finally {
    return exports.reportMessage(stringError, 'error', req, callback);
  }
};


exports.handleErrorWithPayloadData = function (err, payloadData, req, callback) {
  // Allow the user to call with an optional request and callback
  // e.g. handleErrorWithPayloadData(err, payloadData, req, callback)
  //   or handleErrorWithPayloadData(err, payloadData, callback)
  //   or handleErrorPayloadData(err, payloadData)
  if (typeof req === 'function') {
    callback = req;
    req = null;
  }

  if (!(err instanceof Error)) {
    if (typeof callback === 'function') {
      return callback(new Error('handleError was passed something other than an Error: ' + err));
    }
  }
  addItem({error: err, payload: payloadData, request: req}, callback);
};


exports.reportMessage = function (message, level, req, callback) {
  return exports.reportMessageWithPayloadData(message, {level: level}, req, callback);
};


exports.reportMessageWithPayloadData = function (message, payloadData, req, callback) {
  if (SETTINGS.showReportedMessageTraces) {
    logger.log(message, new Error().stack);
  }
  addItem({message: message, payload: payloadData, request: req}, callback);
};
