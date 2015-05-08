var notifier = require('../notifier');
var Notifier = notifier.Notifier;

function setupJSON() {
  var JSONObject = JSON;

  if (__USE_JSON__) {
    // This adds the script to this context. We need it since this library
    // is not a CommonJs or AMD module.
    require("script!../../vendor/json2.min.js");

    var customJSON = {};
    setupCustomJSON(customJSON);
    JSONObject = customJSON;
  }

  notifier.setupJSON(JSONObject);
}

setupJSON();

if (!window._rollbarInitialized) {
  var config = window._rollbarConfig || {};
  var alias = config.globalAlias || 'Rollbar';
  var shim = window[alias];
  var fullRollbar = new Notifier(shim);

  fullRollbar._processShimQueue(window._rollbarShimQueue || []);
  window._rollbarInitialized = true;

  Notifier.processPayloads();
}

module.exports = fullRollbar;
