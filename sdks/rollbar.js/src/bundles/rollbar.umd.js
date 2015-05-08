var globalnotifier = require('../globalnotifier');

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

  globalnotifier.setupJSON(JSONObject);
}

setupJSON();

module.exports = globalnotifier.wrapper;
