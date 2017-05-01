var _ = require('../utility');
var logger = require('./logger');

var http = require('http');
var https = require('https');
var jsonBackup = require('json-stringify-safe');

/*
 * accessToken may be embedded in payload but that should not be assumed
 *
 * options: {
 *   hostname
 *   protocol
 *   path
 *   port
 *   method
 * }
 *
 * params is an object containing key/value pairs to be
 *    appended to the path as 'key=value&key=value'
 *
 * payload is an unserialized object
 */

function get(accessToken, options, params, callback, transportFactory) {
  var t;
  if (!callback || !_.isFunction(callback)) {
    callback = function() {};
  }
  options = options || {};
  _.addParamsAndAccessTokenToPath(accessToken, options, params);
  options.headers = _headers(accessToken, options);
  if (transportFactory) {
    t = transportFactory(options);
  } else {
    t = _transport(options);
  }
  if (!t) {
    logger.error('Unknown transport based on given protocol: ' + options.protocol);
    return callback(new Error('Unknown transport'));
  }
  var req = t.request(options, function(resp) {
    _handleResponse(resp, callback);
  });
  req.on('error', function(err) {
    callback(err);
  });
  req.end();
}

function post(accessToken, options, payload, callback, transportFactory) {
  var t;
  if (!callback || !_.isFunction(callback)) {
    callback = function() {};
  }
  options = options || {};
  if (!payload) {
    return callback(new Error('Cannot send empty request'));
  }
  var stringifyResult = _.stringify(payload, jsonBackup);
  if (stringifyResult.error) {
    logger.error('Problem stringifying payload. Giving up');
    return callback(stringifyResult.error);
  }
  var writeData = stringifyResult.value;
  options.headers = _headers(accessToken, options, writeData);
  if (transportFactory) {
    t = transportFactory(options);
  } else {
    t = _transport(options);
  }
  if (!t) {
    logger.error('Unknown transport based on given protocol: ' + options.protocol);
    return callback(new Error('Unknown transport'));
  }
  var req = t.request(options, function(resp) {
    _handleResponse(resp, _wrapPostCallback(callback));
  });
  req.on('error', function(err) {
    callback(err);
  });
  if (writeData) {
    req.write(writeData);
  }
  req.end();
}

/** Helpers **/

function _headers(accessToken, options, data) {
  var headers = (options && options.headers) || {};
  headers['Content-Type'] = 'application/json';
  if (data) {
    try {
      headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
    } catch (e) {
      logger.error('Could not get the content length of the data');
    }
  }
  headers['X-Rollbar-Access-Token'] = accessToken;
  return headers;
}

function _transport(options) {
  return {'http:': http, 'https:': https}[options.protocol];
}

function _handleResponse(resp, callback) {
  var respData = [];
  resp.setEncoding('utf8');
  resp.on('data', function(chunk) {
    respData.push(chunk);
  });

  resp.on('end', function() {
    respData = respData.join('');
    _parseApiResponse(respData, callback);
  });
}

function _parseApiResponse(data, callback) {
  var parsedData = _.jsonParse(data);
  if (parsedData.error) {
    logger.error('Could not parse api response, err: ' + parsedData.error);
    return callback(parsedData.error);
  }
  data = parsedData.value;

  if (data.err) {
    logger.error('Received error: ' + data.message);
    return callback(new Error('Api error: ' + (data.message || 'Unknown error')));
  }

  callback(null, data);
}

function _wrapPostCallback(callback) {
  return function(err, data) {
    if (err) {
      return callback(err);
    }
    if (data.result && data.result.uuid) {
      logger.log([
          'Successful api response.',
          ' Link: https://rollbar.com/occurrence/uuid/?uuid=' + data.result.uuid
      ].join(''));
    } else {
      logger.log('Successful api response');
    }
    callback(null, data.result);
  }
}

module.exports = {
  get: get,
  post: post
};
