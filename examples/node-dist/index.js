'use strict';
module.exports = function error() {
  class CustomError extends Error {
    constructor(message) {
      super(`Lorem "${message}" ipsum dolor.`);
      this.name = 'CustomError';
    }
  }
  // TypeScript code snippet will include `<Error>`
  var error = new CustomError('foo');
  throw error;
};
//# sourceMappingURL=index.js.map
