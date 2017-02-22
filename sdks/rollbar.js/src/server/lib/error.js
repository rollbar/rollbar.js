var util = require('util');


function RollbarError(message, nested)
{
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);

  this.message = message;
  this.nested = nested;
  this.name = this.constructor.name;
}

util.inherits(RollbarError, Error);

module.exports = RollbarError;

