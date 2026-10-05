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
      // A crafted frame line used to backtrack catastrophically in the frame
      // regexes and block the event loop for seconds. Each scenario is a stack
      // of 1000 crafted lines that took >1s (up to ~13s) before the fix.
      function parseTime(stack, done) {
        const item = { diagnostic: {} };
        const start = process.hrtime.bigint();
        p.parseStack(stack, {}, item, function (err) {
          expect(err).to.be.null;
          done(Number(process.hrtime.bigint() - start) / 1e6);
        });
      }

      const scenarios = {
        'trace pattern': '    at ' + 'a'.repeat(2500) + ')'.repeat(2500),
        'trace pattern, short lines':
          '    at ' + 'a'.repeat(508) + ')'.repeat(509),
        'jade pattern': '    at ' + ' ( at'.repeat(2000) + 'x',
        'jade pattern ending in ))': '    at ' + ' ( at'.repeat(202) + ')x))',
      };
      Object.keys(scenarios).forEach(function (name) {
        it('parses crafted lines quickly: ' + name, function (done) {
          const stack = 'Error: boom\n' + (scenarios[name] + '\n').repeat(1000);
          parseTime(stack, function (elapsedMs) {
            expect(elapsedMs).to.be.lessThan(500);
            done();
          });
        });
      });

      it('caps the number of parsed frames', function (done) {
        const line = '  at fn (app/server.js:1:1)\n';
        p.parseStack(
          'Error: boom\n' + line.repeat(5000),
          {},
          { diagnostic: {} },
          function (err, frames) {
            expect(err).to.be.null;
            expect(frames).to.have.lengthOf(1000);
            done();
          },
        );
      });

      it('keeps real frames after a long multi-line message', function (done) {
        const stack =
          'Error: message\n' +
          'additional message line\n'.repeat(1001) +
          '    at fn (app/server.js:1:2)';
        p.parseStack(stack, {}, { diagnostic: {} }, function (err, frames) {
          expect(err).to.be.null;
          expect(frames).to.have.lengthOf(1);
          expect(frames[0].method).to.equal('fn');
          expect(frames[0].filename).to.equal('app/server.js');
          expect(frames[0].lineno).to.equal(1);
          expect(frames[0].colno).to.equal(1);
          done();
        });
      });
    });
  });

  describe('frame matchers', function () {
    // The regexes the linear matchers replace. They are only safe to run on
    // the short strings generated here.
    const tracePattern =
      /^\s*at (?:([^(]+(?: \[\w\s+\])?(?:.*\)*)) )?\(?(.+?)(?::(\d+):(\d+)(?:, <js>:(\d+):(\d+))?)?\)?$/;
    const jadeTracePattern = /^\s*at .+ \(.+ (at[^)]+\))\)$/;

    // Deterministic PRNG (mulberry32) so failures are reproducible.
    function prng(seed) {
      return function () {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    function randomLines(alphabet, prefixes, count, seed) {
      const random = prng(seed);
      const lines = [];
      for (let i = 0; i < count; i++) {
        let line = prefixes[Math.floor(random() * prefixes.length)];
        const length = Math.floor(random() * 24);
        for (let j = 0; j < length; j++) {
          line += alphabet[Math.floor(random() * alphabet.length)];
        }
        lines.push(line);
      }
      return lines;
    }

    it('matchTraceLine matches the original regex', function () {
      const alphabet = [
        'a',
        't',
        ' ',
        ' ',
        '(',
        ')',
        ':',
        ':',
        '1',
        '2',
        '.',
        '/',
        '<',
        '>',
        '[',
        ']',
        ',',
        '\r',
        '\u2028',
        ', <js>:',
        ' at ',
      ];
      const prefixes = ['at ', '  at ', '    at (', '\tat ', 'at', ''];
      randomLines(alphabet, prefixes, 50000, 1).forEach(function (line) {
        const expected = line.match(tracePattern);
        // JSON keeps unmatched groups as null placeholders, preserving arity.
        expect(
          JSON.stringify(p.matchTraceLine(line)),
          JSON.stringify(line),
        ).to.equal(JSON.stringify(expected && expected.slice(1)));
      });
    });

    it('matchJadeTrace matches the original regex', function () {
      const alphabet = [
        'a',
        't',
        ' ',
        ' ',
        '(',
        ')',
        ')',
        'x',
        '\r',
        '\u2028',
        '\u2029',
        ' at',
        ' (',
        '))',
      ];
      const prefixes = ['at ', '  at ', 'at x (', 'at', ''];
      randomLines(alphabet, prefixes, 50000, 2).forEach(function (line) {
        const expected = line.match(jadeTracePattern);
        expect(p.matchJadeTrace(line), JSON.stringify(line)).to.equal(
          expected && expected[1],
        );
      });
    });
  });
});
