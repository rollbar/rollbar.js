const Rollbar = require('rollbar/src/browser/core');
const telemeter = require('rollbar/src/telemetry');
const instrumenter = require('rollbar/src/browser/telemetry');
const wrapGlobals = require('rollbar/src/browser/wrapGlobals');
const scrub = require('rollbar/src/scrub');
const truncation = require('rollbar/src/truncation');
const tracing = require('rollbar/src/tracing/tracing');
const replay = require('rollbar/src/browser/replay/replay');

Rollbar.setComponents({
  telemeter: telemeter,
  instrumenter: instrumenter,
  wrapGlobals: wrapGlobals,
  scrub: scrub,
  truncation: truncation,
  tracing: tracing,
  replay: replay,
});


const rollbar = Rollbar.init({
  accessToken: 'TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true,
});
