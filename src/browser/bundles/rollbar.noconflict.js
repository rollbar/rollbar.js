var rollbar = require('../rollbar');

if (window && !window._rollbarStartTime) {
  window._rollbarStartTime = (new Date()).getTime();
}

module.exports = rollbar;
