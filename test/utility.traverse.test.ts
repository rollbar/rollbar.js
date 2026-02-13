import { expect } from 'chai';

import traverse from '../src/utility/traverse.js';

describe('traverse', function () {
  describe('should call the func for every key,value', function () {
    it('simple object', function (done) {
      const obj = { a: 1, b: 2 };
      const expectedOutput = { a: 2, b: 3 };
      let callCount = 0;
      const result = traverse(obj, function (k, v) {
        callCount++;
        return v + 1;
      });
      expect(result).to.eql(expectedOutput);
      expect(callCount).to.eql(2);

      done();
    });
    it('nested object', function (done) {
      const obj = { a: 1, b: 2, c: { ca: 11 } };
      const expectedOutput = { a: 2, b: 3, c: { ca: 12 } };
      let callCount = 0;
      const result = traverse(obj, function (k, v) {
        callCount++;
        if (k === 'c') {
          return { ca: v.ca + 1 };
        }
        return v + 1;
      });
      expect(result).to.eql(expectedOutput);
      expect(callCount).to.eql(3);

      done();
    });
    it('array', function (done) {
      const obj = [1, 2, 3];
      const expected = [0, 1, 2];
      let callCount = 0;
      const result = traverse(
        obj,
        function (k, v) {
          callCount++;
          return v - 1;
        },
        [],
      );
      expect(result).to.eql(expected);
      expect(callCount).to.eql(3);
      done();
    });
  });
});
