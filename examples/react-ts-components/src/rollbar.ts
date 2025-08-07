import Rollbar from 'rollbar/src/browser/core';
import telemeter from 'rollbar/src/telemetry';
import instrumenter from 'rollbar/src/browser/telemetry';
import wrapGlobals from 'rollbar/src/browser/wrapGlobals';
import scrub from 'rollbar/src/scrub';
import truncation from 'rollbar/src/truncation';
import tracing from 'rollbar/src/tracing/tracing';
import recorder from 'rollbar/src/browser/replay/recorder';

console.log('Testing component imports...');

Rollbar.setComponents({
  telemeter,
  instrumenter,
  wrapGlobals,
  scrub,
  truncation,
  tracing,
  recorder,
});

export default Rollbar;
