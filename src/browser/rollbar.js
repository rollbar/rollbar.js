import Rollbar from './core.js';
import Telemeter from '../telemetry.js';
import Instrumenter from './telemetry.js';
import wrapGlobals from './wrapGlobals.js';
import scrub from '../scrub.js';
import truncation from '../truncation.js';
import Tracing from '../tracing/tracing.js';
import Replay from './replay/replay.js';

Rollbar.setComponents({
  telemeter: Telemeter,
  instrumenter: Instrumenter,
  wrapGlobals: wrapGlobals,
  scrub: scrub,
  truncation: truncation,
  tracing: Tracing,
  replay: Replay,
});

export default Rollbar;
