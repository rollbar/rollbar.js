/* globals describe */
/* globals it */
/* globals beforeEach */

import { expect } from 'chai';
import * as p from '../src/server/parser.js';

describe('parser', function () {
  describe('parseStack', function () {
    describe('a valid stack trace', function () {
      let frames;
      let parseError;

      beforeEach(function (done) {
        const item = { diagnostic: {} };
        const stack =
          'ReferenceError: foo is not defined\n' +
          '  at MethodClass.method.<anonymous> (app/server.js:2:4)\n' +
          '  at /app/node_modules/client.js:321:23\n' +
          '  at (/app/node_modules/client.js:321:23)\n' +
          '  at MethodClass.method.(anonymous) (app/server.js:62:14)\n' +
          '  at MethodClass.method (app/server.ts:52:4)\n' +
          '  at MethodClass.method (app/server.js:62:14)\n';

        p.parseStack(stack, {}, item, function (err, parsedFrames) {
          parseError = err;
          frames = parsedFrames;
          done();
        });
      });

      it('should parse valid js frame', function () {
        const frame = frames[0];
        expect(parseError).to.be.null;
        expect(frame.method).to.equal('MethodClass.method');
        expect(frame.filename).to.equal('app/server.js');
        expect(frame.lineno).to.equal(62);
        expect(frame.colno).to.equal(14 - 1);
      });

      it('should parse valid ts frame', function () {
        const frame = frames[1];
        expect(parseError).to.be.null;
        expect(frame.method).to.equal('MethodClass.method');
        expect(frame.filename).to.equal('app/server.ts');
        expect(frame.lineno).to.equal(52);
        expect(frame.colno).to.equal(4 - 1);
      });

      it('should parse method with parens', function () {
        const frame = frames[2];
        expect(parseError).to.be.null;
        expect(frame.method).to.equal('MethodClass.method.(anonymous)');
        expect(frame.filename).to.equal('app/server.js');
        expect(frame.lineno).to.equal(62);
        expect(frame.colno).to.equal(14 - 1);
      });

      it('should parse without method and with leading slash', function () {
        const frame = frames[3];
        expect(parseError).to.be.null;
        expect(frame.method).to.equal('<unknown>');
        expect(frame.filename).to.equal('/app/node_modules/client.js');
        expect(frame.lineno).to.equal(321);
        expect(frame.colno).to.equal(23 - 1);
      });

      it('should parse without method or parens', function () {
        const frame = frames[4];
        expect(parseError).to.be.null;
        expect(frame.method).to.equal('<unknown>');
        expect(frame.filename).to.equal('/app/node_modules/client.js');
        expect(frame.lineno).to.equal(321);
        expect(frame.colno).to.equal(23 - 1);
      });

      it('should parse method with angle brackets', function () {
        const frame = frames[5];
        expect(parseError).to.be.null;
        expect(frame.method).to.equal('MethodClass.method.<anonymous>');
        expect(frame.filename).to.equal('app/server.js');
        expect(frame.lineno).to.equal(2);
        expect(frame.colno).to.equal(4 - 1);
      });
    });
  });
});
