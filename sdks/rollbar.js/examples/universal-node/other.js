const rollbar = require('rollbar');

exports.doSomeLog = function(message, req, custom, callback) {
  rollbar.log(message, req, custom, callback);
};

exports.doSomeError = function(message, req, custom, callback) {
  rollbar.error(message, req, custom, callback);
};
