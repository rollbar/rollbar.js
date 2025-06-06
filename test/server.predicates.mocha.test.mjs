/* globals describe */
/* globals it */

import { expect } from 'chai';
import * as p from '../src/predicates.js';

describe('predicates', function () {
  describe('checkLevel', function () {
    describe('an item without a level', function () {
      const item = { body: 'nothing' };

      it('should not send with a critical reportLevel', function () {
        const settings = { reportLevel: 'critical' };
        const result = p.checkLevel(item, settings);
        expect(result).to.be.false;
      });
    });

    describe('an item with an unknown level', function () {
      const item = { level: 'wooo' };

      it('should not send with an error reportLevel', function () {
        const settings = { reportLevel: 'error' };
        const result = p.checkLevel(item, settings);
        expect(result).to.be.false;
      });

      it('should send with an unknown reportLevel', function () {
        const settings = { reportLevel: 'yesss' };
        const result = p.checkLevel(item, settings);
        expect(result).to.be.true;
      });

      it('should send with settings without a reportLevel', function () {
        const settings = { nothing: 'to see here' };
        const result = p.checkLevel(item, settings);
        expect(result).to.be.true;
      });
    });

    describe('an item with a warning level', function () {
      const item = { level: 'warning' };

      it('should not send with an error reportLevel', function () {
        const settings = { reportLevel: 'error' };
        const result = p.checkLevel(item, settings);
        expect(result).to.be.false;
      });

      it('should send with an info reportLevel', function () {
        const settings = { reportLevel: 'info' };
        const result = p.checkLevel(item, settings);
        expect(result).to.be.true;
      });

      it('should send with a warning reportLevel', function () {
        const settings = { reportLevel: 'warning' };
        const result = p.checkLevel(item, settings);
        expect(result).to.be.true;
      });
    });
  });
});
