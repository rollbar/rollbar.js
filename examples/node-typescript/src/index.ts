export = function error() {
  class CustomError extends Error {
    constructor(message: string) {
      super(`Lorem "${message}" ipsum dolor.`);
      this.name = 'CustomError';
    }
  }
  // TypeScript code snippet will include `<Error>`
  var error = <Error>new CustomError('foo');
  throw error;
};
