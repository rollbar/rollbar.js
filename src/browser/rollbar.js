var Rollbar = require('./core');
var telemeter = require('../telemetry');
var instrumenter = require('./telemetry');
var polyfillJSON = require('../../vendor/JSON-js/json3');

Rollbar.setComponents({
  telemeter: telemeter,
  instrumenter: instrumenter,
  polyfillJSON: polyfillJSON
});

module.exports = Rollbar;
