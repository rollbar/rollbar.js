import rollbar from '../rollbar.js';

if ((typeof window !== 'undefined') && !window._rollbarStartTime) {
  window._rollbarStartTime = (new Date()).getTime();
}

export default rollbar;
