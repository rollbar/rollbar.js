var _ = require('../utility');
var logger = require('./logger');

var http = require('http');
var https = require('https');
var stringify = require('json-stringify-safe');

/*
 * accessToken may be embedded in payload but that should not
 *   be assumed
 *
 * options: {
 *   hostname
 *   protocol
 *   path
 *   port
 *   method
 * }
 *
 *  params is an object containing key/value pairs to be
 *    appended to the path as 'key=value&key=value'
 */

function get(accessToken, options, params, callback) {
  _addParamsAndAccessTokenToPath(accessToken, options, params);
  options.headers = _headers(accessToken, options);
  var t = _transport(options);
  if (!t) {
    logger.error('Unknown transport based on given protocol: ' + options.protocol);
    return callback(new Error('Unknown transport'));
  }
  var req = t.request(options, function(resp) {
    _handleResponse(resp, callback);
  });
  req.end();
}

function post(accessToken, options, payload, callback) {
  if (!payload) {
    return callback(new Error('Cannot send empty request'));
  }

  var stringifyResult = _.stringify(payload, JSON, stringify);
  if (stringifyResult.error) {
    logger.error('Problem stringifying payload. Giving up');
    return callback(stringifyResult.error);
  }
  var writeData = stringifyResult.value;

  options.headers = _headers(accessToken, options, writeData);
  var t = _transport(options);
  if (!t) {
    logger.error('Unknown transport based on given protocol: ' + options.protocol);
    return callback(new Error('Unknown transport'));
  }
  var req = t.request(options, function(resp) {
    _handleResponse(resp, function(err, data) {
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
    });
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
  var headers = options.headers || {};
  headers['Content-Type'] = 'application/json';
  if (data) {
    headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
  }
  headers['X-Rollbar-Access-Token'] = accessToken;
  return headers;
}

function _addParamsAndAccessTokenToPath(accessToken, options, params) {
  params = params || {};
  params.access_token = accessToken;
  var paramsArray = [];
  for (k in params) {
    paramsArray.push([k, params[k]].join('='));
  }
  var query = '?' + paramsArray.join('&');
  var qs = options.path.indexOf('?');
  if (qs !== -1) {
    var p = options.path;
    options.path = p.substring(0,qs) + query + '&' + p.substring(qs+1);
  } else {
    var h = options.path.indexOf('#');
    if (h !== -1) {
      var p = options.path;
      options.path = p.substring(0,h) + query + p.substring(h);
    } else {
      options.path = options.path + query;
    }
  }
}

function _transport(options) {
  return {http: http, https: https}[options.protocol];  
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
  try {
    data = JSON.parse(data);
  } catch (e) {
    logger.error('Could not parse api response, err: ' + e);
    return callback(e);
  }

  if (data.err) {
    logger.error('Received error: ' + data.message);
    return callback(new Error('Api error: ' + (data.message || 'Unknown error')));
  }

  callback(null, data);
}

module.exports = {
  get: get,
  post: post
};
