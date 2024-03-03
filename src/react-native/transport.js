var _ = require('../utility');
var logger = require('./logger');

var Buffer = require('buffer/').Buffer;

function Transport(truncation) {
  this.rateLimitExpires = 0;
  this.truncation = truncation;
}

Transport.prototype.get = function (accessToken, options, params, callback) {
  if (!callback || !_.isFunction(callback)) {
    callback = function () {};
  }
  options = options || {};
  _.addParamsAndAccessTokenToPath(accessToken, options, params);
  var headers = _headers(accessToken, options);
  fetch(_.formatUrl(options), {
    method: 'GET',
    headers: headers,
  })
    .then(function (resp) {
      _handleResponse(resp, callback);
    })
    .catch(function (err) {
      callback(err);
    });
};

Transport.prototype.post = function (accessToken, options, payload, callback) {
  if (!callback || !_.isFunction(callback)) {
    callback = function () {};
  }
  options = options || {};
  if (!payload) {
    return callback(new Error('Cannot send empty request'));
  }

  var stringifyResult;
  if (this.truncation) {
    stringifyResult = this.truncation.truncate(payload);
  } else {
    stringifyResult = _.stringify(payload);
  }
  if (stringifyResult.error) {
    logger.error('Problem stringifying payload. Giving up');
    return callback(stringifyResult.error);
  }
  var writeData = stringifyResult.value;
  var headers = _headers(accessToken, options, writeData);

  _makeRequest(headers, options, writeData, callback);
};

Transport.prototype.postJsonPayload = function (
  accessToken,
  options,
  jsonPayload,
  callback,
) {
  if (!callback || !_.isFunction(callback)) {
    callback = function () {};
  }
  options = options || {};
  if (!jsonPayload) {
    return callback(new Error('Cannot send empty request'));
  }
  var headers = _headers(accessToken, options, jsonPayload);

  _makeRequest(headers, options, jsonPayload, callback);
};

/** Helpers **/
function _makeRequest(headers, options, data, callback) {
  var url = _.formatUrl(options);
  fetch(url, {
    method: 'POST',
    headers: headers,
    body: data,
  })
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      _handleResponse(data, _wrapPostCallback(callback));
    })
    .catch(function (err) {
      callback(err);
    });
}

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
    return callback(
      new Error('Api error: ' + (data.message || 'Unknown error')),
    );
  }

  callback(null, data);
}

function _wrapPostCallback(callback) {
  return function (err, data) {
    if (err) {
      return callback(err);
    }
    if (data.result && data.result.uuid) {
      logger.log(
        [
          'Successful api response.',
          ' Link: https://rollbar.com/occurrence/uuid/?uuid=' +
            data.result.uuid,
        ].join(''),
      );
    } else {
      logger.log('Successful api response');
    }
    callback(null, data.result);
  };
}

module.exports = Transport;
