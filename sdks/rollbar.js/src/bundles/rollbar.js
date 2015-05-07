var notifier = require('../notifier');
var Notifier = notifier.Notifier;

function initJSON() {
  // This adds the script to this context. We need it since this library
  // is not a CommonJs or AMD module.
  require("script!../../vendor/JSON-js/json2.js");

  var customJSON = {};
  setupCustomJSON(customJSON);

  notifier.init(customJSON);
}

initJSON();

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
