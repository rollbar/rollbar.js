var _ = require('./utility');

var Transport = null;
var url = null;

function init(context) {
  if (context == 'server') {
    Transport = require('./server/transport');
    url = require('url');
  } else {
    Transport = require('./browser/transport');
    url = require('./browser/url');
  }
}

var defaultOptions = {
  host: 'api.rollbar.com',
  path: '/api/1',
  version: '1',
  protocol: 'https',
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
 *    TBD
 * }
 */
function Api(accessToken, options) {
  this.transport = getTransportFromOptions(options, defaultOptions);
  this.accessToken = accessToken;
}

/**
 *
 * @param data
 * @param callback
 */
Api.prototype.postItem = function(data, callback) {
  var transportOptions = this._transportOptions('/item/', 'POST')
  var payload = buildPayload(this.accessToken, data);
  Transport.post(this.accessToken, transportOptions, payload, callback);
};

/** Helpers **/

function buildPayload(accessToken, data) {
  if (_.isType(data.context, 'object')) {
    data.context = _.stringify(data.context);
    if (data.context && data.context.length) {
      data.context = data.context.substr(0, 255);
    }
  }
  return {
    access_token: accessToken,
    data: data
  };
}

function getTransportFromOptions(options, defaults) {
  var hostname = defaults.hostname;
  var protocol = defaults.protocol;
  var port = defaults.port;
  var path = defaults.path;

  var proxy = options.proxy;
  if (options.endpoint) {
    var opts = url.parse(options.endpoint);
    hostname = opts.hostname;
    protocol = opts.protocol.split(':')[0];
    port = opts.port;
    path = opts.path;
  }
  return {
    hostname: hostname,
    protocol: protocol,
    port: port,
    path: path,
    proxy: proxy
  };
}

Api.prototype._transportOptions = function(path, method) {
  var protocol = this.transport.protocol || 'https';
  var port = this.transport.port || (protocol === 'http' ? 80 : protocol === 'https' ? 443 : undefined);
  var hostname = this.transport.hostname;
  var path = this.transport.path + path;
  if (this.transport.proxy) {
    path = protocol + '://' + hostname + path;
    hostname = this.transport.proxy.host;
    port = this.transport.proxy.port;
  }
  return {
    protocol: protocol,
    hostname: hostname,
    path: path,
    port: port,
    method: method
  };
};

module.exports = function(context) {
  init(context);
  return Api;
};
