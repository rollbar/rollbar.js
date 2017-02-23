var RollbarTransport = null;
var pendingRequests = [];
var pendingRequestCallbacks = [];

/*************************************************************************/
/** PUBLIC INTERFACE                                                    **/
/*************************************************************************/

function init(context) {
  if (context == 'server') {
    RollbarTransport = require('./server/transport');
  } else {
    RollbarTransport = require('./browser/transport');
  }
}

/**
 * RollbarApi is an object that encapsulates methods of communicating with
 * the Rollbar API.  It is a standard interface with some parts implemented
 * differently for server or browser contexts.  It is an object that should
 * be instantiated when used so it can contain non-global options that may
 * be different for another instance of RollbarApi.
 *
 * @param options {
 *    TBD
 * }
 */
function RollbarApi(options) {
}

/**
 * This will return an array of all the RollbarApiRequest objects that have
 * not yet completed successfully.  These may have not been sent to the server
 * yet, or they may have been sent and are waiting a response, or they may
 * have failed and are waiting to be retried.
 *
 * @returns RollbarApiRequest[]
 */
RollbarApi.prototype.pendingRequests = function() {
  return pendingRequests;
};

/**
 * This will execute the callback after all the pending requests have been
 * flushed.
 *
 * @param callback
 */
RollbarApi.prototype.wait = function(callback) {
  if (pendingRequests.length == 0) {
    callback();
  } else {
    pendingRequestCallbacks.push(callback);
  }
};

/**
 *
 * @param payload
 *
 * @returns RollbarApiRequest instance
 */
RollbarApi.prototype.postItem = function(payload, callback) {
  RollbarTransport.post( /* ... */ );
};


module.exports = function(context) {
  init(context);
  return RollbarApi;
};
