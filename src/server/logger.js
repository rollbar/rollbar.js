'use strict';

var name = 'Rollbar';

var logger = {
  /* eslint-disable no-console */
  log: console.log.bind(console),
  error: console.error.bind(console)
  /* eslint-enable no-console */
};

module.exports = logger;
