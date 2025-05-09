var _ = require('./utility');
var helpers = require('./apiUtility');

var defaultOptions = {
  hostname: 'api.rollbar.com',
  path: '/api/1/item/',
  search: null,
  version: '1',
  protocol: 'https:',
  port: 443,
};

var sessionDefaultOptions = {
  hostname: 'api.rollbar.com',
  path: '/api/1/session/',
  search: null,
  version: '1',
  protocol: 'https:',
  port: 443,
};

/**
 * Api is an object that encapsulates methods of communicating with
 * the Rollbar API.  It is a standard interface with some parts implemented
 * differently for server or browser contexts.  It is an object that should
 * be instantiated when used so it can contain non-global options that may
 * be different for another instance of RollbarApi.
 *
 * @param options {
 *    accessToken: the accessToken to use for posting items to rollbar
 *    endpoint: an alternative endpoint to send errors to
 *        must be a valid, fully qualified URL.
 *        The default is: https://api.rollbar.com/api/1/item
 *    proxy: if you wish to proxy requests provide an object
 *        with the following keys:
 *          host or hostname (required): foo.example.com
 *          port (optional): 123
 *          protocol (optional): https
 * }
 */
function Api(options, transport, urllib, truncation, jsonBackup) {
  this.options = options;
  this.transport = transport;
  this.url = urllib;
  this.truncation = truncation;
  this.jsonBackup = jsonBackup;
  this.accessToken = options.accessToken;
  this.transportOptions = _getTransport(options, urllib);
  this.sessionTransportOptions = _getSessionTransport(options, urllib);
}

/**
 * Wraps transport.post in a Promise to support async/await
 * 
 * @param {Object} options - Options for the API request
 * @param {string} options.accessToken - The access token for authentication
 * @param {Object} options.transportOptions - Options for the transport
 * @param {Object} options.payload - The data payload to send
 * @returns {Promise} A promise that resolves with the response or rejects with an error
 * @private
 */
Api.prototype._postPromise = function({ accessToken, transportOptions, payload }) {
  const self = this;
  return new Promise((resolve, reject) => {
    self.transport.post(accessToken, transportOptions, payload, (err, resp) => 
      err ? reject(err) : resolve(resp)
    );
  });
};

/**
 *
 * @param data
 * @param callback
 */
Api.prototype.postItem = function (data, callback) {
  var transportOptions = helpers.transportOptions(
    this.transportOptions,
    'POST',
  );
  var payload = helpers.buildPayload(this.accessToken, data, this.jsonBackup);
  var self = this;

  // ensure the network request is scheduled after the current tick.
  setTimeout(function () {
    self.transport.post(self.accessToken, transportOptions, payload, callback);
  }, 0);
};

/**
 * Posts spans to the Rollbar API using the session endpoint
 * 
 * @param {Array} spans - The spans to send
 * @returns {Promise<Object>} A promise that resolves with the API response
 */
Api.prototype.postSpans = async function (spans) {
  const transportOptions = helpers.transportOptions(
    this.sessionTransportOptions,
    'POST',
  );
  
  const payload = helpers.buildPayload(
    this.accessToken, 
    { resourceSpans: spans }, 
    this.jsonBackup
  );

  return await this._postPromise({
    accessToken: this.accessToken, 
    transportOptions, 
    payload
  });
};

/**
 *
 * @param data
 * @param callback
 */
Api.prototype.buildJsonPayload = function (data, callback) {
  var payload = helpers.buildPayload(this.accessToken, data, this.jsonBackup);

  var stringifyResult;
  if (this.truncation) {
    stringifyResult = this.truncation.truncate(payload);
  } else {
    stringifyResult = _.stringify(payload);
  }

  if (stringifyResult.error) {
    if (callback) {
      callback(stringifyResult.error);
    }
    return null;
  }

  return stringifyResult.value;
};

/**
 *
 * @param jsonPayload
 * @param callback
 */
Api.prototype.postJsonPayload = function (jsonPayload, callback) {
  var transportOptions = helpers.transportOptions(
    this.transportOptions,
    'POST',
  );
  this.transport.postJsonPayload(
    this.accessToken,
    transportOptions,
    jsonPayload,
    callback,
  );
};

Api.prototype.configure = function (options) {
  var oldOptions = this.oldOptions;
  this.options = _.merge(oldOptions, options);
  this.transportOptions = _getTransport(this.options, this.url);
  this.sessionTransportOptions = _getSessionTransport(this.options, this.url);
  if (this.options.accessToken !== undefined) {
    this.accessToken = this.options.accessToken;
  }
  return this;
};

function _getTransport(options, url) {
  return helpers.getTransportFromOptions(options, defaultOptions, url);
}

function _getSessionTransport(options, url) {
  return helpers.getTransportFromOptions(options, sessionDefaultOptions, url);
}

module.exports = Api;
