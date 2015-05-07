var globalnotifier = require('../globalnotifier');

function initJSON() {
  // This adds the script to this context. We need it since this library
  // is not a CommonJs or AMD module.
  require("script!../../vendor/JSON-js/json2.js");

  var customJSON = {};
  setupCustomJSON(customJSON);

  globalnotifier.init(customJSON);
}

initJSON();

module.exports = globalnotifier.wrapper;
