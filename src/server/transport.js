import http from 'http';
import https from 'https';

import jsonBackup from 'json-stringify-safe';

import logger from '../logger.js';
import truncation from '../truncation.js';
import * as _ from '../utility.js';

var MAX_RATE_LIMIT_INTERVAL = 60;

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
function Transport() {
  this.rateLimitExpires = 0;
}

Transport.prototype.get = function (
  accessToken,
  options,
  params,
  callback,
  transportFactory,
) {
  var t;
  if (!callback || !_.isFunction(callback)) {
    callback = () => {};
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
    logger.error(
      'Unknown transport based on given protocol: ' + options.protocol,
    );
    return callback(new Error('Unknown transport'));
  }
  var req = t.request(
    options,
    function (resp) {
      this.handleResponse(resp, callback);
    }.bind(this),
  );
  req.on('error', function (err) {
    callback(err);
  });
  req.end();
};

Transport.prototype.post = function ({
  accessToken,
  options,
  payload,
  callback,
  transportFactory,
}) {
  var t;
  if (!callback || !_.isFunction(callback)) {
    callback = () => {};
  }
  if (_currentTime() < this.rateLimitExpires) {
    return callback(new Error('Exceeded rate limit'));
  }
  options = options || {};
  if (!payload) {
    return callback(new Error('Cannot send empty request'));
  }
  var stringifyResult = truncation.truncate(payload, jsonBackup);
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
    logger.error(
      'Unknown transport based on given protocol: ' + options.protocol,
    );
    return callback(new Error('Unknown transport'));
  }
  var req = t.request(
    options,
    function (resp) {
      this.handleResponse(resp, _wrapPostCallback(callback));
    }.bind(this),
  );
  req.on('error', function (err) {
    callback(err);
  });
  if (writeData) {
    req.write(writeData);
  }
  req.end();
};

Transport.prototype.updateRateLimit = function (resp) {
  var remaining = parseInt(resp.headers['x-rate-limit-remaining'] || 0);
  var remainingSeconds = Math.min(
    MAX_RATE_LIMIT_INTERVAL,
    resp.headers['x-rate-limit-remaining-seconds'] || 0,
  );
  var currentTime = _currentTime();

  if (resp.statusCode === 429 && remaining === 0) {
    this.rateLimitExpires = currentTime + remainingSeconds;
  } else {
    this.rateLimitExpires = currentTime;
  }
};

Transport.prototype.handleResponse = function (resp, callback) {
  this.updateRateLimit(resp);

  var respData = [];
  resp.setEncoding('utf8');
  resp.on('data', function (chunk) {
    respData.push(chunk);
  });

  resp.on('end', function () {
    respData = respData.join('');
    _parseApiResponse(respData, resp.statusCode, callback);
  });
};

/** Helpers **/

function _headers(accessToken, options, data) {
  var headers = (options && options.headers) || {};
  headers['Content-Type'] = 'application/json';
  if (data) {
    try {
      headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
    } catch (_e) {
      logger.error('Could not get the content length of the data');
    }
  }
  headers['X-Rollbar-Access-Token'] = accessToken;
  return headers;
}

function _transport(options) {
  return { 'http:': http, 'https:': https }[options.protocol];
}

/**
 * Turns a raw API response into the `(err, data)` pair expected by callers.
 *
 * @param {string} data - the raw response body
 * @param {number} statusCode - the HTTP status code of the response
 * @param {Function} callback - function(err, data)
 */
function _parseApiResponse(data, statusCode, callback) {
  var parsedData = _.jsonParse(data);
  var body = parsedData.value;

  if (body && body.err) {
    logger.error('Received error: ' + body.message);
    return callback(_apiError(body.message || 'Unknown error', statusCode));
  }

  // Proxies and load balancers in front of the API (e.g. nginx during a 502)
  // reply with HTML or an empty body, so the status code is the only reliable
  // signal; a JSON parse error would hide it.
  if (statusCode >= 300) {
    var message =
      statusCode + ' ' + (http.STATUS_CODES[statusCode] || 'Unknown status');
    logger.error('Received error: ' + message);
    return callback(_apiError(message, statusCode));
  }

  if (parsedData.error) {
    logger.error('Could not parse api response, err: ' + parsedData.error);
    return callback(parsedData.error);
  }

  callback(null, body);
}

function _apiError(message, statusCode) {
  var err = new Error('Api error: ' + message);
  err.statusCode = statusCode;
  return err;
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

function _currentTime() {
  return Math.floor(Date.now() / 1000);
}

export default Transport;
