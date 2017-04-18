var _ = require('./utility');
var helpers = require('./apiUtility');

var Transport = null;
var url = null;
var jsonBackup = null;

function init(context, transport, u, j) {
  if (context === 'server') {
    Transport = require('./server/transport');
    url = require('url');
    jsonBackup = require('json-stringify-safe');
  } else if (context === 'test') {
    Transport = transport;
    url = u;
    jsonBackup = j;
  } else {
    Transport = require('./browser/transport');
    url = require('./browser/url');
  }
}

var defaultOptions = {
  hostname: 'api.rollbar.com',
  path: '/api/1',
  search: null,
  version: '1',
  protocol: 'https:',
  port: 443
};

/**
 * Api is an object that encapsulates methods of communicating with
 * the Rollbar API.  It is a standard interface with some parts implemented
 * differently for server or browser contexts.  It is an object that should
 * be instantiated when used so it can contain non-global options that may
 * be different for another instance of RollbarApi.
 *
 * @param options {
 *    endpoint: an alternative endpoint to send errors to
 *        must be a valid, fully qualified URL.
 *        The default is: https://api.rollbar.com/api/1
 *    proxy: if you wish to proxy requests provide an object
 *        with the following keys:
 *          host or hostname (required): foo.example.com
 *          port (optional): 123
 *          protocol (optional): https
 * }
 */
function Api(accessToken, options) {
  this.accessToken = accessToken;
  this.options = options;
  this.transport = _getTransport(options);
}

/**
 *
 * @param data
 * @param callback
 */
Api.prototype.postItem = function(data, callback) {
  var transportOptions = helpers.transportOptions(this.transport, '/item/', 'POST');
  var payload = helpers.buildPayload(this.accessToken, data, jsonBackup);
  Transport.post(this.accessToken, transportOptions, payload, callback);
};

Api.prototype.configure = function(options) {
  var oldOptions = this.oldOptions;
  this.options = _.extend(true, {}, oldOptions, options);
  this.transport = _getTransport(this.options);
  if (this.options.accessToken !== undefined) {
    this.accessToken = this.options.accessToken;
  }
  return this;
};

function _getTransport(options) {
  return helpers.getTransportFromOptions(options, defaultOptions, url);
}

module.exports = function(context, transport, u, j) {
  init(context, transport, u, j);
  return Api;
};
