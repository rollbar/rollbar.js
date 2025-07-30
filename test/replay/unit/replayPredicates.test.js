/**
 * Unit tests for the ReplayPredicates module
 */

/* globals describe */
/* globals it */
/* globals beforeEach */

import { expect } from 'chai';
import ReplayPredicates from '../../../src/browser/replay/replayPredicates.js';

describe('ReplayMap', function () {
  let replayId;
  let triggers;

  describe('isEnabledForTriggerType', function () {
    describe('occurrence', function () {
      beforeEach(function () {
        replayId = 'aaaabbbbccccdddd';
        triggers = [
          {
            type: 'occurrence',
            level: ['error', 'critical'],
            samplingRatio: 0.5,
          },
        ];
      });

      it('should return true on matching level', function () {
        const item = {
          level: 'error',
        };

        const enabled = new ReplayPredicates(
          triggers,
          { item, replayId },
        ).isEnabledForTriggerType('occurrence')
        expect(enabled).to.be.true;
      });

      it('should return false on not matching level', function () {
        const item = {
          level: 'info',
        };

        const enabled = new ReplayPredicates(
          triggers,
          { item, replayId },
        ).isEnabledForTriggerType('occurrence')
        expect(enabled).to.be.false;
      });

      it('should return true on no level specified', function () {
        const item = {
          level: 'info',
        };
        triggers[0].level = undefined;

        const enabled = new ReplayPredicates(
          triggers,
          { item, replayId },
        ).isEnabledForTriggerType('occurrence')
        expect(enabled).to.be.true;
      });

      it('should return true on matching second trigger', function () {
        const item = {
          level: 'info',
        };
        triggers.push({
          type: 'occurrence',
          level: ['info'],
          samplingRatio: 0.5,
        });

        const enabled = new ReplayPredicates(
          triggers,
          { item, replayId },
        ).isEnabledForTriggerType('occurrence')
        expect(enabled).to.be.true;
      });

      it('should return true on no samplingRatio specified', function () {
        const item = {
          level: 'error',
        };
        triggers[0].samplingRatio = undefined;

        const enabled = new ReplayPredicates(
          triggers,
          { item, replayId },
        ).isEnabledForTriggerType('occurrence')
        expect(enabled).to.be.true;
      });

      it('should return false when not sampled', function () {
        const item = {
          level: 'error',
        };
        triggers[0].samplingRatio = 0.1;

        const enabled = new ReplayPredicates(
          triggers,
          { item, replayId },
        ).isEnabledForTriggerType('occurrence')
        expect(enabled).to.be.false;
      });
    });
  });
});
