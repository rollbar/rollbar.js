const { add, multiply } = require('../src/simple-commonjs.js');

describe('Simple Test', function () {
  it('should fail', function () {
    throw new Error('This test intentionally fails');
  });

  it('should pass', function () {
    const result = add(2, 3);
    if (result !== 5) {
      throw new Error('Add function failed');
    }
  });
});
