/*jslint devel: true, nomen: true, plusplus: true, regexp: true, indent: 2, maxlen: 100 */

"use strict";

var logger = require('./logger');
var async = require('async');
var url = require('url');
var http = require('http');
var https = require('https');
var stringify = require('json-stringify-safe');

exports.VERSION = '1';
exports.endpoint = 'https://api.rollbar.com/api/' + exports.VERSION + '/';
exports.accessToken = null;


var SETTINGS = {
  accessToken: null,
  protocol: 'https',
  endpoint: exports.endpoint,
  proxy: null
};


/*
 * Internal
 */


function transportOpts(path, method) {
  var port;
  port = SETTINGS.port ||
      (SETTINGS.protocol === 'http' ? 80 : (SETTINGS.protocol === 'https' ? 443 : undefined));

  return {
    host: SETTINGS.endpointOpts.host,
    port: port,
    path: SETTINGS.endpointOpts.path + path,
    method: method
  };
}


function parseApiResponse(respData, callback) {
  try {
    respData = JSON.parse(respData);
  } catch (e) {
    logger.error('Could not parse api response, err: ' + e);
    return callback(e);
  }

  if (respData.err) {
    logger.error('Received error: ' + respData.message);
    return callback(new Error('Api error: ' + (respData.message || 'Unknown error')));
  }


  if (respData.result && respData.result.uuid) {
    logger.log([
      'Successful api response.',
      ' Link: https://rollbar.com/occurrence/uuid/?uuid=' + respData.result.uuid
    ].join(''));

  } else {
    logger.log('Successful api response');
  }

  callback(null, respData.result);
}


function makeApiRequest(transport, opts, bodyObj, callback) {
  var writeData, req;

  if (!bodyObj) {
    return callback(new Error('Cannot send empty request'));
  }

  try {
    try {
      writeData = JSON.stringify(bodyObj);
    } catch (e) {
      logger.error('Could not serialize to JSON - falling back to safe-stringify');
      writeData = stringify(bodyObj);
    }
  } catch (e) {
    logger.error('Could not safe-stringify data. Giving up');
    return callback(e);
  }

  opts.headers = opts.headers || {};

  opts.headers['Content-Type'] = 'application/json';
  opts.headers['Content-Length'] = Buffer.byteLength(writeData, 'utf8');
  opts.headers['X-Rollbar-Access-Token'] = exports.accessToken;

  if (SETTINGS.proxy) {
    opts.path = SETTINGS.protocol + '://' + opts.host + opts.path;
    opts.host = SETTINGS.proxy.host;
    opts.port = SETTINGS.proxy.port;
    transport = http;
  }

  req = transport.request(opts, function (resp) {
    var respData = [];

    resp.setEncoding('utf8');
    resp.on('data', function (chunk) {
      respData.push(chunk);
    });

    resp.on('end', function () {
      respData = respData.join('');
      parseApiResponse(respData, callback);
    });
  });

  req.on('error', function (err) {
    logger.error('Could not make request to rollbar, ' + err);
    callback(err);
  });

  if (writeData) {
    req.write(writeData);
  }
  req.end();
}


function postApi(path, payload, callback) {
  var transport, opts;

  transport = SETTINGS.transport;
  opts = transportOpts(path, 'POST');

  return makeApiRequest(transport, opts, payload, callback);
}


function buildPayload(data) {
  var payload;

  // The API does not allow a context to be an object.  We need to detect if an
  // object context is provided.  If so, serialize it.
  if (typeof data.context == 'object') {
    try {
      data.context = JSON.stringify(data.context);
    } catch (e) {
      data.context = stringify(data.context);
    }
    if (data.context.length > 255) {
      data.context = data.context.substr(0, 255);
    }
  }

  payload = {
    access_token: exports.accessToken,
    data: data
  };

  return payload;
}


/*
 * Public API
 */


exports.init = function (accessToken, options) {
  var opt, portCheck;

  options = options || {};
  exports.accessToken = accessToken;
  exports.endpoint = options.endpoint || exports.endpoint;

  for (opt in options) {
    if (options.hasOwnProperty(opt)) {
      SETTINGS[opt] = options[opt];
    }
  }

  SETTINGS.endpointOpts = url.parse(exports.endpoint);
  SETTINGS.protocol = SETTINGS.endpointOpts.protocol.split(':')[0];
  SETTINGS.transport = {http: http, https: https}[SETTINGS.protocol];
  SETTINGS.proxy = options.proxy;

  portCheck = SETTINGS.endpointOpts.host.split(':');
  if (portCheck.length > 1) {
    SETTINGS.endpointOpts.host = portCheck[0];
    SETTINGS.port = parseInt(portCheck[1], 10);
  }
};


exports.postItem = function (item, callback) {
  return postApi('item/', buildPayload(item), callback);
};
