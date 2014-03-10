var XHR = {
  XMLHttpFactories: [
      function () {return new XMLHttpRequest();},
      function () {return new ActiveXObject("Msxml2.XMLHTTP");},
      function () {return new ActiveXObject("Msxml3.XMLHTTP");},
      function () {return new ActiveXObject("Microsoft.XMLHTTP");}
  ],
  createXMLHTTPObject: function() {
    var xmlhttp = false;
    var factories = XHR.XMLHttpFactories;
    var i;
    var numFactories = factories.length;
    for (i = 0; i < numFactories; i++) {
      try {
        xmlhttp = factories[i]();
        break;
      } catch (e) {
        // pass
      }
    }
    return xmlhttp;
  },
  post: function(url, accessToken, payload, callback) {
    if (typeof payload !== 'object') {
      throw new Error('Expected an object to POST');
    }
    payload = RollbarJSON.stringify(payload);
    callback = callback || function() {};
    var request = XHR.createXMLHTTPObject();
    if (request) {
      try {
        try {
          var onreadystatechange = function(args) {
            try {
              if (onreadystatechange && request.readyState === 4) {
                onreadystatechange = undefined;

                // TODO(cory): have the notifier log an internal error on non-200 response codes
                if (request.status === 200) {
                  callback(null, RollbarJSON.parse(request.responseText));
                } else if (typeof(request.status) === "number" &&
                            request.status >= 400  && request.status < 600) {
                  // return valid http status codes
                  callback(new Error(request.status.toString()));
                } else {
                  // IE will return a status 12000+ on some sort of connection failure,
                  // so we return a blank error
                  // http://msdn.microsoft.com/en-us/library/aa383770%28VS.85%29.aspx
                  callback(new Error());
                }
              }
            } catch (ex) {
              //jquery source mentions firefox may error out while accessing the
              //request members if there is a network error
              //https://github.com/jquery/jquery/blob/a938d7b1282fc0e5c52502c225ae8f0cef219f0a/src/ajax/xhr.js#L111
              var exc;
              if (typeof ex === 'object' && ex.stack) {
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
          if (typeof XDomainRequest !== "undefined") {
            var ontimeout = function(args) {
              callback(new Error());
            };

            var onerror = function(args) {
              callback(new Error());
            };

            var onload = function(args) {
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
