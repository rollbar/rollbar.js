var globalnotifier = require('../globalnotifier');
var notifier = require('../notifier');


function setupJSON() {
  var JSONObject = {};

  if (typeof JSON !== 'undefined') {
    if (typeof JSON.stringify === 'function') {
      JSONObject.stringify = JSON.stringify;
    }
    if (typeof JSON.parse === 'function') {
      JSONObject.parse = JSON.parse;
    }
  }

  var setupCustomJSON = require('../../vendor/JSON-js/json2.js');
  setupCustomJSON(JSONObject);

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
