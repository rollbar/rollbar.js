/* globals ActiveXObject */

var Util = require('./util');

var RollbarJSON = null;

function setupJSON(JSON) {
  RollbarJSON = JSON;
}

function ConnectionError(message) {
  this.name = 'Connection Error';
  this.message = message;
  this.stack = (new Error()).stack;
}

ConnectionError.prototype = Object.create(Error.prototype);
ConnectionError.prototype.constructor = ConnectionError;

var XHR = {
  XMLHttpFactories: [
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
  ],
  createXMLHTTPObject: function() {
    var xmlhttp = false;
    var factories = XHR.XMLHttpFactories;
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
  },
  post: function(url, accessToken, payload, callback) {
    if (!Util.isType(payload, 'object')) {
      throw new Error('Expected an object to POST');
    }
    payload = RollbarJSON.stringify(payload);
    callback = callback || function() {};
    var request = XHR.createXMLHTTPObject();
    if (request) {
      try {
        try {
          var onreadystatechange = function() {
            try {
              if (onreadystatechange && request.readyState === 4) {
                onreadystatechange = undefined;

                // TODO(cory): have the notifier log an internal error on non-200 response codes
                var jsonResponse = RollbarJSON.parse(request.responseText);
                if (request.status === 200) {
                  callback(null, jsonResponse);
                } else if (Util.isType(request.status, 'number') &&
                  request.status >= 400 && request.status < 600) {

                  if (request.status == 403) {
                    // likely caused by using a server access token, display console message to let
                    // user know
                    console.error('[Rollbar]:' + jsonResponse.message);
                  }
                  // return valid http status codes
                  callback(new Error(String(request.status)));
                } else {
                  // IE will return a status 12000+ on some sort of connection failure,
                  // so we return a blank error
                  // http://msdn.microsoft.com/en-us/library/aa383770%28VS.85%29.aspx
                  callback(new ConnectionError('XHR response had no status code (likely connection failure)'));
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

          request.open('POST', url, true);
          if (request.setRequestHeader) {
            request.setRequestHeader('Content-Type', 'application/json');
            request.setRequestHeader('X-Rollbar-Access-Token', accessToken);
          }
          request.onreadystatechange = onreadystatechange;
          request.send(payload);
        } catch (e1) {
          // Sending using the normal xmlhttprequest object didn't work, try XDomainRequest
          if (typeof XDomainRequest !== 'undefined') {

            // Assume we are in a really old browser which has a bunch of limitations:
            // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx

            // If the current page is http, try and send over http
            if (window.location.href.substring(0, 5) === 'http:' && url.substring(0, 5) === 'https') {
              url = 'http' + url.substring(5);
            }

            var ontimeout = function() {
              callback(new ConnectionError('Request timed out'));
            };

            var onerror = function() {
              callback(new Error('Error during request'));
            };

            var onload = function() {
              callback(null, RollbarJSON.parse(request.responseText));
            };

            request = new XDomainRequest();
            request.onprogress = function() {};
            request.ontimeout = ontimeout;
            request.onerror = onerror;
            request.onload = onload;
            request.open('POST', url, true);
            request.send(payload);
          }
        }
      } catch (e2) {
        callback(e2);
      }
    }
  }
};

module.exports = {
  XHR: XHR,
  setupJSON: setupJSON,
  ConnectionError: ConnectionError
};
