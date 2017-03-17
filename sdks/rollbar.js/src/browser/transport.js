var _ = require('../utility');

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
 * }
 *
 *  params is an object containing key/value pairs. These
 *    will be appended to the path as 'key=value&key=value'
 *
 * payload is an unserialized object
 */

function get(accessToken, options, params, callback) {
  if (!callback || !_.isFunction(callback)) {
    callback = function() {};
  }
  _.addParamsAndAccessTokenToPath(accessToken, options, params);

  var method = 'GET';
  var url = _.formatUrl(options);
  _makeRequest(accessToken, url, method, null, callback);
}

function post(accessToken, options, payload, callback) {
  if (!callback || !_.isFunction(callback)) {
    callback = function() {};
  }

  if (!payload) {
    return callback(new Error('Cannot send empty request'));
  }

  var stringifyResult = _.stringify(payload, RollbarJSON);
  if (stringifyResult.error) {
    return callback(stringifyResult.error);
  }

  var writeData = stringifyResult.value;
  var method = 'POST';
  var url = _.formatUrl(options);
  _makeRequest(accessToken, url, method, writeData, callback);
}

function _makeRequest(accessToken, url, method, data, callback) {
  var request = _createXMLHTTPObject();
  if (!request) {
    // Give up, no way to send requests
    return callback(new Error('No way to send a request'));
  }
  try {
    try {
      var onreadystatechange = function() {
        try {
          if (onreadystatechange && request.readyState === 4) {
            onreadystatechange = undefined;

            var jsonResponse = RollbarJSON.parse(request.responseText);
            if (_isSuccess(request)) {
              callback(null, jsonResponse);
            } else if (_isNormalFailure(request)) {
              if (request.status === 403) {
                // likely caused by using a server access token
                _.consoleError('[Rollbar]:' + jsonResponse.message);
              }
              // return valid http status codes
              callback(new Error(String(request.status)));
            } else {
              // IE will return a status 12000+ on some sort of connection failure,
              // so we return a blank error
              // http://msdn.microsoft.com/en-us/library/aa383770%28VS.85%29.aspx
              var msg = 'XHR response had no status code (likely connection failure)';
              callback(_newRetriableError(msg));
            }
          }
        } catch (ex) {
          //jquery source mentions firefox may error out while accessing the
          //request members if there is a network error
          //https://github.com/jquery/jquery/blob/a938d7b1282fc0e5c52502c225ae8f0cef219f0a/src/ajax/xhr.js#L111
          var exc;
          if (ex && ex.stack) {
            exc = ex;
          } else {
            exc = new Error(ex);
          }
          callback(exc);
        }
      };

      request.open(method, url, true);
      if (request.setRequestHeader) {
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('X-Rollbar-Access-Token', accessToken);
      }
      request.onreadystatechange = onreadystatechange;
      request.send(data);
    } catch (e1) {
      // Sending using the normal xmlhttprequest object didn't work, try XDomainRequest
      if (typeof XDomainRequest !== 'undefined') {

        // Assume we are in a really old browser which has a bunch of limitations:
        // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx

        // Extreme paranoia: if we have XDomainRequest then we have a window, but just in case
        if (!window || !window.location) {
          return callback(new Error('No window available during request, unknown environment'));
        }

        // If the current page is http, try and send over http
        if (window.location.href.substring(0, 5) === 'http:' && url.substring(0, 5) === 'https') {
          url = 'http' + url.substring(5);
        }

        var xdomainrequest = new XDomainRequest();
        xdomainrequest.onprogress = function() {};
        xdomainrequest.ontimeout = function() {
          var msg = 'Request timed out';
          var code = 'ETIMEDOUT';
          callback(_newRetriableError(msg, code));
        };
        xdomainrequest.onerror = function() {
          callback(new Error('Error during request'));
        };
        xdomainrequest.onload = function() {
          callback(null, RollbarJSON.parse(xdomainrequest.responseText));
        };
        xdomainrequest.open(method, url, true);
        xdomainrequest.send(data);
      } else {
        callback(new Error('Cannot find a method to transport a request'));
      }
    }
  } catch (e2) {
    callback(e2);
  }
}

var _XMLHttpFactories = [
function () {
    return new XMLHttpRequest();
  },
  function () {
    return new ActiveXObject('Msxml2.XMLHTTP');
  },
  function () {
    return new ActiveXObject('Msxml3.XMLHTTP');
  },
  function () {
    return new ActiveXObject('Microsoft.XMLHTTP');
  }
];

function _createXMLHTTPObject() {
  var xmlhttp;
  var factories = _XMLHttpFactories;
  var i;
  var numFactories = factories.length;
  for (i = 0; i < numFactories; i++) {
    /* eslint-disable no-empty */
    try {
      xmlhttp = factories[i]();
      break;
    } catch (e) {
      // pass
    }
    /* eslint-enable no-empty */
  }
  return xmlhttp;
};

function _isSuccess(r) {
  return r && r.status && r.status === 200;
}

function _isNormalFailure(r) {
  return r && _.isType(r.status, 'number') && r.status >= 400 && r.status < 600;
}

function _newRetriableError(message, code) {
  var err = new Error(message);
  err.code = code || 'ENOTFOUND';
  return err;
}

module.exports = {
  get: get,
  post: post
};
