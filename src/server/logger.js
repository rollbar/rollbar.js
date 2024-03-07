'use strict';

var verbose = true;

var logger = {
  /* eslint-disable no-console */
  log: function () {
    if (verbose) {
      console.log.apply(console, arguments);
    }
  },
  error: function () {
    if (verbose) {
      console.error.apply(console, arguments);
    }
  },
  /* eslint-enable no-console */
  setVerbose: function (val) {
    verbose = val;
  },
};

module.exports = logger;
