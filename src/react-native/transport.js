var _ = require('../utility');
var truncation = require('../truncation');
var logger = require('./logger');

var Buffer = require('buffer/').Buffer;

function get(accessToken, options, params, callback) {
  var t;
  if (!callback || !_.isFunction(callback)) {
    callback = function() {};
  }
  options = options || {};
  _.addParamsAndAccessTokenToPath(accessToken, options, params);
  var headers = _headers(accessToken, options);
  fetch(_.formatUrl(options), {
    method: 'GET',
    headers: headers
  })
  .then(function(resp) {
    _handleResponse(resp, callback);
  })
  .catch(function(err) {
    callback(err);
  });
}

function post(accessToken, options, payload, callback) {
  if (!callback || !_.isFunction(callback)) {
    callback = function() {};
  }
  options = options || {};
  if (!payload) {
    return callback(new Error('Cannot send empty request'));
  }
  var stringifyResult = truncation.truncate(payload);
  if (stringifyResult.error) {
    logger.error('Problem stringifying payload. Giving up');
    return callback(stringifyResult.error);
  }
  var writeData = stringifyResult.value;
  var headers = _headers(accessToken, options, writeData);
  fetch(_.formatUrl(options), {
    method: 'POST',
    headers: headers,
    body: writeData
  })
  .then(function (resp) {
    return resp.json();
  })
  .then(function (data) {
    _handleResponse(data, _wrapPostCallback(callback));
  })
  .catch(function(err) {
    callback(err);
  });
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

function _handleResponse(data, callback) {
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
