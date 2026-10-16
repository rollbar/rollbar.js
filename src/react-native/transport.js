import { Buffer } from 'buffer/';

import logger from '../logger.js';
import * as _ from '../utility.js';

function Transport(truncation) {
  this.rateLimitExpires = 0;
  this.truncation = truncation;
}

Transport.prototype.get = function (accessToken, options, params, callback) {
  if (!callback || !_.isFunction(callback)) {
    callback = () => {};
  }
  options = options || {};
  _.addParamsAndAccessTokenToPath(accessToken, options, params);
  var headers = _headers(accessToken, options);
  fetch(_.formatUrl(options), {
    method: 'GET',
    headers: headers,
  })
    .then(function (resp) {
      return _handleResponse(resp, callback);
    })
    .catch(function (err) {
      callback(err);
    });
};

Transport.prototype.post = function (accessToken, options, payload, callback) {
  if (!callback || !_.isFunction(callback)) {
    callback = () => {};
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
    callback = () => {};
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
      return _handleResponse(resp, _wrapPostCallback(callback));
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
    } catch (_e) {
      logger.error('Could not get the content length of the data');
    }
  }
  headers['X-Rollbar-Access-Token'] = accessToken;
  return headers;
}

/**
 * Reads a fetch `Response` and turns it into the `(err, data)` pair expected
 * by callers.
 *
 * @param {Response} resp - the fetch response
 * @param {Function} callback - function(err, data)
 * @returns {Promise} resolves once the callback has been called
 */
function _handleResponse(resp, callback) {
  return resp.text().then(function (text) {
    var parsedData = _.jsonParse(text);
    var body = parsedData.value;

    if (body && body.err) {
      logger.error('Received error: ' + body.message);
      return callback(_apiError(body.message || 'Unknown error', resp.status));
    }

    // Proxies and load balancers in front of the API (e.g. nginx during a 502)
    // reply with HTML or an empty body, so the status code is the only reliable
    // signal; a JSON parse error would hide it. statusText is empty over
    // HTTP/2, so it is only appended when present.
    if (resp.status >= 300) {
      var message =
        resp.status + (resp.statusText ? ' ' + resp.statusText : '');
      logger.error('Received error: ' + message);
      return callback(_apiError(message, resp.status));
    }

    if (parsedData.error) {
      logger.error('Could not parse api response, err: ' + parsedData.error);
      return callback(parsedData.error);
    }

    callback(null, body);
  });
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

export default Transport;
