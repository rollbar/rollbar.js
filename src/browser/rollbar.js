import Rollbar from './core.js';
import Telemeter from '../telemetry.js';
import Instrumenter from './telemetry.js';
import wrapGlobals from './wrapGlobals.js';
import scrub from '../scrub.js';
import truncation from '../truncation.js';
import Tracing from '../tracing/tracing.js';
import ReplayManager from './replay/replayManager.js';

Rollbar.setComponents({
  telemeter: Telemeter,
  instrumenter: Instrumenter,
  wrapGlobals: wrapGlobals,
  scrub: scrub,
  truncation: truncation,
  tracing: Tracing,
  replayManager: ReplayManager,
});

export default Rollbar;
