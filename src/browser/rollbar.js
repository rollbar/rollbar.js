import Rollbar from './core.js';
import Telemeter from '../telemetry.js';
import Instrumenter from './telemetry.js';
import wrapGlobals from './wrapGlobals.js';
import scrub from '../scrub.js';
import truncation from '../truncation.js';
import Tracing from '../tracing/tracing.js';
import Recorder from './replay/recorder.js';

Rollbar.setComponents({
  telemeter: Telemeter,
  instrumenter: Instrumenter,
  wrapGlobals: wrapGlobals,
  scrub: scrub,
  truncation: truncation,
  tracing: Tracing,
  recorder: Recorder,
});

export default Rollbar;
