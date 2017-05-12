var _ = require('./utility');
var helpers = require('./apiUtility');

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
 *    accessToken: the accessToken to use for posting items to rollbar
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
function Api(options, t, u, j) {
  this.options = options;
  this.transport = t;
  this.url = u;
  this.jsonBackup = j;
  this.accessToken = options.accessToken;
  this.transportOptions = _getTransport(options, u);
}

/**
 *
 * @param data
 * @param callback
 */
Api.prototype.postItem = function(data, callback) {
  var transportOptions = helpers.transportOptions(this.transportOptions, '/item/', 'POST');
  var payload = helpers.buildPayload(this.accessToken, data, this.jsonBackup);
  this.transport.post(this.accessToken, transportOptions, payload, callback);
};

Api.prototype.configure = function(options) {
  var oldOptions = this.oldOptions;
  this.options = _.extend(true, {}, oldOptions, options);
  this.transportOptions = _getTransport(this.options, this.url);
  if (this.options.accessToken !== undefined) {
    this.accessToken = this.options.accessToken;
  }
  return this;
};

function _getTransport(options, url) {
  return helpers.getTransportFromOptions(options, defaultOptions, url);
}

module.exports = Api;
