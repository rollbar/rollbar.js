import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import { expect } from 'chai';

import { findBundledPackages } from '../scripts/check-bundled-dependencies.js';

// Session Replay bundles inlined postcss 8.4.38 and nanoid 3.3.7 (#1523).
describe('bundled third-party dependencies', function () {
  describe('findBundledPackages', function () {
    it('counts each inlined postcss and nanoid copy', function () {
      // Excerpts of dist/rollbar.replay.umd.min.js from rollbar@4.2.0.
      const postcssCopy =
        '(this,t,[e])).name="CssSyntaxError",s.reason=e,i&&(s.file=i);';
      const nanoidCopy =
        'var e="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";';
      const source = [postcssCopy, nanoidCopy, postcssCopy, nanoidCopy].join(
        '\n',
      );

      expect(findBundledPackages(source)).to.deep.equal([
        { name: 'postcss', copies: 2 },
        { name: 'nanoid', copies: 2 },
      ]);
    });

    it('matches the unminified build', function () {
      const source = "_this.name = 'CssSyntaxError';";

      expect(findBundledPackages(source)).to.deep.equal([
        { name: 'postcss', copies: 1 },
      ]);
    });

    it('ignores code that only refers to the error by name', function () {
      const source = 'if (e.name !== "CssSyntaxError") { throw e; }';

      expect(findBundledPackages(source)).to.deep.equal([]);
    });
  });

  describe('@rrweb/record dist', function () {
    // webpack copies whichever of these the resolver picks into the replay
    // bundles, so none of them may carry an inlined postcss or nanoid.
    const require = createRequire(import.meta.url);
    const distDir = path.dirname(require.resolve('@rrweb/record'));
    const distFiles = [
      'record.js',
      'record.cjs',
      'record.umd.cjs',
      'record.umd.min.cjs',
    ];

    for (const file of distFiles) {
      it(`${file} does not inline postcss or nanoid`, function () {
        const source = fs.readFileSync(path.join(distDir, file), 'utf8');

        expect(findBundledPackages(source)).to.deep.equal([]);
      });
    }
  });
});
