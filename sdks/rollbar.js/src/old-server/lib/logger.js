/*jslint devel: true, nomen: true, plusplus: true, regexp: true, indent: 2, maxlen: 100 */

"use strict";

var debug = require('debug');
var name = 'Rollbar';

var logger = {
  log: debug(name + ':log'),
  error: debug(name + ':error')
};

// Make logger.log log to stdout rather than stderr
logger.log.log = console.log.bind(console);

module.exports = logger;
