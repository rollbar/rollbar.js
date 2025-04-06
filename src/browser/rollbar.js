const Rollbar = require('./core');
const telemeter = require('../telemetry');
const instrumenter = require('./telemetry');
const polyfillJSON = require('../utility/polyfillJSON');
const wrapGlobals = require('./wrapGlobals');
const scrub = require('../scrub');
const truncation = require('../truncation');
const Tracing = require('../tracing/tracing');
const replay = require('./replay');

Rollbar.setComponents({
  telemeter: telemeter,
  instrumenter: instrumenter,
  polyfillJSON: polyfillJSON,
  wrapGlobals: wrapGlobals,
  scrub: scrub,
  truncation: truncation,
  tracing: Tracing.default,
  replay: replay,
});

module.exports = Rollbar;
