'use strict';

var debug = require('debug');
var name = 'Rollbar';

var logger = {
  log: debug(name + ':log'),
  error: debug(name + ':error')
};

/* eslint-disable no-console */

// Make logger.log log to stdout rather than stderr
logger.log.log = console.log.bind(console);

/* eslint-enable no-console */

module.exports = logger;
