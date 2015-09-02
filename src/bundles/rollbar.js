/* globals __USE_JSON__ */


var globalnotifier = require('../globalnotifier');
var notifier = require('../notifier');


function setupJSON() {
  var JSONObject = typeof JSON === 'undefined' ? {} : JSON;

  if (__USE_JSON__) {
    // This adds the script to this context. We need it since this library
    // is not a CommonJs or AMD module.
    var setupCustomJSON = require('../../vendor/JSON-js/json2.js');

    var customJSON = {};
    setupCustomJSON(customJSON);

    JSONObject = customJSON;
  }

  globalnotifier.setupJSON(JSONObject);
}


setupJSON();


var config = window._rollbarConfig;
var alias = config && config.globalAlias || 'Rollbar';
var shimRunning = window[alias] && typeof window[alias].shimId !== 'undefined';


/* We must not initialize the full notifier here if the
 * shim is loaded, snippet_callback will do that for us
 */
if (!shimRunning && config) {
  globalnotifier.wrapper.init(config);
} else {
  window.Rollbar = globalnotifier.wrapper;
  // We need to expose Notifier for the snippet
  window.RollbarNotifier = notifier.Notifier;
}

module.exports = globalnotifier.wrapper;
