'use strict';

var name = 'Rollbar';

var logger = {
  /* eslint-disable no-console */
  log: function() { console.log.apply(console, arguments) },
  error: function() { console.error.apply(console, arguments) }
  /* eslint-enable no-console */
};

module.exports = logger;
