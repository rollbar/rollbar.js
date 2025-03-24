var _ = require('../utility');
var makeFetchRequest = require('./transport/fetch');
var makeXhrRequest = require('./transport/xhr');

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
 *   transport ('xhr' | 'fetch')
 * }
 *
 *  params is an object containing key/value pairs. These
 *    will be appended to the path as 'key=value&key=value'
 *
 * payload is an unserialized object
 */
function Transport(truncation) {
  this.truncation = truncation;
}

Transport.prototype.get = function (
  accessToken,
  options,
  params,
  callback,
  requestFactory,
) {
  if (!callback || !_.isFunction(callback)) {
    callback = function () {};
  }
  _.addParamsAndAccessTokenToPath(accessToken, options, params);

  var method = 'GET';
  var url = _.formatUrl(options);
  this._makeZoneRequest(
    accessToken,
    url,
    method,
    null,
    callback,
    requestFactory,
    options.timeout,
    options.transport,
  );
};

Transport.prototype.post = function (
  accessToken,
  options,
  payload,
  callback,
  requestFactory,
) {
  if (!callback || !_.isFunction(callback)) {
    callback = function () {};
  }

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
    return callback(stringifyResult.error);
  }

  var writeData = stringifyResult.value;
  var method = 'POST';
  var url = _.formatUrl(options);
  this._makeZoneRequest(
    accessToken,
    url,
    method,
    writeData,
    callback,
    requestFactory,
    options.timeout,
    options.transport,
  );
};

Transport.prototype.postJsonPayload = function (
  accessToken,
  options,
  jsonPayload,
  callback,
  requestFactory,
) {
  if (!callback || !_.isFunction(callback)) {
    callback = function () {};
  }

  var method = 'POST';
  var url = _.formatUrl(options);
  this._makeZoneRequest(
    accessToken,
    url,
    method,
    jsonPayload,
    callback,
    requestFactory,
    options.timeout,
    options.transport,
  );
};

// Wraps `_makeRequest` if zone.js is being used, ensuring that Rollbar
// API calls are not intercepted by any child forked zones.
// This is equivalent to `NgZone.runOutsideAngular` in Angular.
Transport.prototype._makeZoneRequest = function () {
  var gWindow =
    (typeof window != 'undefined' && window) ||
    (typeof self != 'undefined' && self);
  // Whenever zone.js is loaded and `Zone` is exposed globally, access
  // the root zone to ensure that requests are always made within it.
  // This approach is framework-agnostic, regardless of which
  // framework zone.js is used with.
  var rootZone = gWindow && gWindow.Zone && gWindow.Zone.root;
  var args = Array.prototype.slice.call(arguments);

  if (rootZone) {
    var self = this;
    rootZone.run(function () {
      self._makeRequest.apply(undefined, args);
    });
  } else {
    this._makeRequest.apply(undefined, args);
  }
};

Transport.prototype._makeRequest = function (
  accessToken,
  url,
  method,
  data,
  callback,
  requestFactory,
  timeout,
  transport,
) {
  if (typeof RollbarProxy !== 'undefined') {
    return _proxyRequest(data, callback);
  }

  if (transport === 'fetch') {
    makeFetchRequest(accessToken, url, method, data, callback, timeout);
  } else {
    makeXhrRequest(
      accessToken,
      url,
      method,
      data,
      callback,
      requestFactory,
      timeout,
    );
  }
};

/* global RollbarProxy */
function _proxyRequest(json, callback) {
  var rollbarProxy = new RollbarProxy();
  rollbarProxy.sendJsonPayload(
    json,
    function (_msg) {
      /* do nothing */
    }, // eslint-disable-line no-unused-vars
    function (err) {
      callback(new Error(err));
    },
  );
}

module.exports = Transport;
