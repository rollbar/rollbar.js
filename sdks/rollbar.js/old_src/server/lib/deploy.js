/*jslint devel: true, nomen: true, plusplus: true, regexp: true, indent: 2, maxlen: 100 */

/*
 *  This is an implementation of Rollbar's deploy feature.  It can be used and
 *  required independently from the rest of the Rollbar library.  Implementation
 *  details can be found at: https://rollbar.com/docs/api/deploys/
 */

"use strict";

var https = require('https');
var logger = require('./logger');

function handleResponse(res, callback) {
  res.setEncoding('utf8');
  var rawData = '';
  res.on('data', function(chunk){ rawData += chunk });
  res.on('end', function() {
    try {
      var parsedData = JSON.parse(rawData);
      if (parsedData.err) {
        logger.error(parsedData.message);
      }
      callback(parsedData);
    } catch (e) {
      logger.error(e);
    }
  });
};

function createRequestOpts(method, path, accessToken, postData) {
  var requestOpts = {
    protocol: 'https:',
    host: 'api.rollbar.com',
    port: 443,
    path: '/api/1/'+path,
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'X-Rollbar-Access-Token': accessToken
    }
  };

  if (postData) {
    requestOpts.headers['Content-Length'] = Buffer.byteLength(postData);
  }

  return requestOpts;
};

/**
 * Create a deploy entry.
 * This is an implementation of the API specified at:
 * https://rollbar.com/docs/api/deploys/#record-create-a-deploy
 *
 * @param accessToken - A post_server_item-scope project access token.
 * @param params - An object with some required and optional parameters
 *          environment:  Required. Name of the environment being deployed. (String up to 255 chars)
 *          revision: Required. String identifying the revision being deployed, such as a Git SHA. (String up to 255 chars). This param can also be provided under the name head_long.
 *          rollbar_username: Rollbar username of the user who deployed.
 *          local_username: Username (on your system) who deployed. (String up to 255 chars)
 *          comment: Additional text data to record with this deploy. (String up to 64kb)
 * @param opts - An object with connection options.
 * @param callback
 */
exports.createDeploy = function(accessToken, params, opts, callback) {
  if (typeof callback != 'function')
    callback = function(){};

  var requestOpts = createRequestOpts('POST', 'deploy/', accessToken);

  var req = https.request(requestOpts, function(res) {
    handleResponse(res, callback);
  });

  var writeData = {};
  try {
    try {
      writeData = JSON.stringify(params);
    } catch (e) {
      writedata = stringify(params);
    }
  } catch (e) {
    logger.error('Could not safe-stringify data.  Giving up');
    return callback(e);
  }
  req.write(writeData);
  req.end();
};

/**
 * Retrieve a single deploy entry using an ID.
 * This is an implementation of the API specified at:
 * https://rollbar.com/docs/api/deploys/#get-a-deploy-by-id
 *
 * @param accessToken - Required. A read-scope project access token.
 * @param deployId - Required.  The ID to fetch.
 * @param opts - An object with connection options
 * @param callback
 */
exports.getDeploy = function(accessToken, deployId, opts, callback) {
  if (typeof callback != 'function')
    callback = function(){};

  var params = [];
  params.push('access_token='+accessToken);
  var paramsStr = params.join('&');

  var requestOpts = createRequestOpts('GET', 'deploy/'+deployId+'/?'+paramsStr, accessToken);

  var req = https.request(requestOpts, function(res) {
    handleResponse(res, callback);
  });

  req.end();
};

/**
 * Retrieve a list of deploys.
 * This is an implementation of the API specified at:
 * https://rollbar.com/docs/api/deploys/#list-all-deploys
 *
 * @param accessToken - Required. A read-scope project access token.
 * @param pageNum - An integer page number >= 1.  If not specified, 1 will be used.
 * @param opts - An object with connection options.
 * @param callback
 */
exports.listDeploys = function(accessToken, pageNum, opts, callback) {
  if (typeof pageNum != 'number' || pageNum < 1)
    pageNum = 1;

  if (typeof callback != 'function')
    callback = function(){};

  var params = [];
  params.push('page='+pageNum);
  params.push('access_token='+accessToken);
  var paramsStr = params.join('&');

  
  var requestOpts = createRequestOpts('GET', 'deploys?'+paramsStr, accessToken);

  var req = https.request(requestOpts, function(res) {
    handleResponse(res, callback);
  });

  req.end();
};
