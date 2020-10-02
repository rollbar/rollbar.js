var Rollbar = require('./core');
var telemeter = require('../telemetry');
var instrumenter = require('./telemetry');
var polyfillJSON = require('../utility/polyfillJSON');
var wrapGlobals = require('./wrapGlobals');
var scrub = require('../scrub');
var truncation = require('../truncation');

Rollbar.setComponents({
  telemeter: telemeter,
  instrumenter: instrumenter,
  polyfillJSON: polyfillJSON,
  wrapGlobals: wrapGlobals,
  scrub: scrub,
  truncation: truncation
});

module.exports = Rollbar;
