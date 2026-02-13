import scrub from '../scrub.js';
import Telemeter from '../telemetry.js';
import Tracing from '../tracing/tracing.js';
import truncation from '../truncation.js';

import Rollbar from './core.js';
import Replay from './replay/replay.js';
import Instrumenter from './telemetry.js';
import wrapGlobals from './wrapGlobals.js';

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
