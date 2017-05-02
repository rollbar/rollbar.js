const rollbar = require('rollbar').instance;

exports.doSomeLog = function(message, req, custom, callback) {
  console.log(rollbar);
  rollbar.log(message, req, custom, callback);
};

exports.doSomeError = function(message, req, custom, callback) {
  rollbar.error(message, req, custom, callback);
};
