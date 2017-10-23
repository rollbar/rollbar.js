'use strict';

var name = 'Rollbar';

var logger = {
  log: console.log.bind(console),
  error: console.error.bind(console)
};

module.exports = logger;
