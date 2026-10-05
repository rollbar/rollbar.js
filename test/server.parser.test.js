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

    describe('ReDoS protection (RB-01)', function () {
      // A Node Error's `.stack` begins with its (possibly attacker-influenced)
      // message. When the message contains a newline, the text after it becomes
      // a parsed "frame" line. A crafted line of the form `at <a...><)...>` used
      // to drive catastrophic backtracking in the trace regexes and block the
      // event loop for seconds. These tests assert parsing stays fast and that
      // normal frames are unaffected.
      function parseTime(stack, done) {
        const item = { diagnostic: {} };
        const start = process.hrtime.bigint();
        p.parseStack(stack, {}, item, function () {
          const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
          done(elapsedMs);
        });
      }

      it('parses a malicious tracePattern line quickly', function (done) {
        const n = 2500;
        const line = '    at ' + 'a'.repeat(n) + ')'.repeat(n);
        const stack = 'Error: boom\n' + line + '\n';
        parseTime(stack, function (elapsedMs) {
          expect(elapsedMs).to.be.lessThan(1000);
          done();
        });
      });

      it('parses a malicious jadeTracePattern line quickly', function (done) {
        const line = '    at ' + ' ( at'.repeat(2000) + 'x';
        const stack = 'Error: boom\n' + line + '\n';
        parseTime(stack, function (elapsedMs) {
          expect(elapsedMs).to.be.lessThan(1000);
          done();
        });
      });

      it('parses many malicious lines quickly', function (done) {
        const line = '    at ' + 'a'.repeat(1000) + ')'.repeat(1000);
        const stack = 'Error: boom\n' + (line + '\n').repeat(2000);
        parseTime(stack, function (elapsedMs) {
          expect(elapsedMs).to.be.lessThan(2000);
          done();
        });
      });

      it('still parses a normal frame correctly', function (done) {
        const stack =
          'ReferenceError: foo is not defined\n' +
          '  at MethodClass.method (app/server.js:62:14)\n';
        const item = { diagnostic: {} };
        p.parseStack(stack, {}, item, function (err, frames) {
          expect(err).to.be.null;
          expect(frames).to.have.lengthOf(1);
          expect(frames[0].method).to.equal('MethodClass.method');
          expect(frames[0].filename).to.equal('app/server.js');
          expect(frames[0].lineno).to.equal(62);
          expect(frames[0].colno).to.equal(14 - 1);
          done();
        });
      });
    });
  });
});
