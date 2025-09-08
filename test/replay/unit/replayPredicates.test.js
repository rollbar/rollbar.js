/**
 * Unit tests for the ReplayPredicates module
 */


import { expect } from 'chai';
import ReplayPredicates from '../../../src/browser/replay/replayPredicates.js';

describe('ReplayMap', function () {
  let replayId;
  let recorderConfig;

  describe('isEnabledForTriggerType', function () {
    describe('occurrence', function () {
      beforeEach(function () {
        replayId = 'aaaabbbbccccdddd';
        recorderConfig = {
          triggers: [
            {
              type: 'occurrence',
              level: ['error', 'critical'],
              samplingRatio: 0.5,
            },
          ],
        }
      });

      it('should return true on matching level', function () {
        const item = {
          level: 'error',
        };

        const enabled = new ReplayPredicates(
          recorderConfig,
          { item, replayId },
        ).isEnabledForTriggerType('occurrence')
        expect(enabled).to.be.true;
      });

      it('should return false on not matching level', function () {
        const item = {
          level: 'info',
        };

        const enabled = new ReplayPredicates(
          recorderConfig,
          { item, replayId },
        ).isEnabledForTriggerType('occurrence')
        expect(enabled).to.be.false;
      });

      it('should return true on no level specified', function () {
        const item = {
          level: 'info',
        };
        recorderConfig.triggers[0].level = undefined;

        const enabled = new ReplayPredicates(
          recorderConfig,
          { item, replayId },
        ).isEnabledForTriggerType('occurrence')
        expect(enabled).to.be.true;
      });

      it('should return true on matching second trigger', function () {
        const item = {
          level: 'info',
        };
        recorderConfig.triggers.push({
          type: 'occurrence',
          level: ['info'],
          samplingRatio: 0.5,
        });

        const enabled = new ReplayPredicates(
          recorderConfig,
          { item, replayId },
        ).isEnabledForTriggerType('occurrence')
        expect(enabled).to.be.true;
      });

      it('should return true on no samplingRatio specified', function () {
        const item = {
          level: 'error',
        };
        recorderConfig.triggers[0].samplingRatio = undefined;

        const enabled = new ReplayPredicates(
          recorderConfig,
          { item, replayId },
        ).isEnabledForTriggerType('occurrence')
        expect(enabled).to.be.true;
      });

      it('should return false when not sampled', function () {
        const item = {
          level: 'error',
        };
        recorderConfig.triggers[0].samplingRatio = 0.1;

        const enabled = new ReplayPredicates(
          recorderConfig,
          { item, replayId },
        ).isEnabledForTriggerType('occurrence')
        expect(enabled).to.be.false;
      });

      it('should return false with baseSamplingRatio specified and not sampled', function () {
        const item = {
          level: 'error',
        };
        recorderConfig.baseSamplingRatio = 0.1;
        recorderConfig.triggers[0].samplingRatio = undefined;

        const enabled = new ReplayPredicates(
          recorderConfig,
          { item, replayId },
        ).isEnabledForTriggerType('occurrence')
        expect(enabled).to.be.false;
      });

      it('should return true with trigger overriding baseSamplingRatio', function () {
        const item = {
          level: 'error',
        };
        recorderConfig.baseSamplingRatio = 0.1;

        const enabled = new ReplayPredicates(
          recorderConfig,
          { item, replayId },
        ).isEnabledForTriggerType('occurrence')
        expect(enabled).to.be.true;
      });

      it('should return false with no triggers', function () {
        const item = {
          level: 'error',
        };

        const enabled = new ReplayPredicates(
          null,
          { item, replayId },
        ).isEnabledForTriggerType('occurrence')
        expect(enabled).to.be.false;
      });

      it('should return false with no config', function () {
        const item = {
          level: 'error',
        };
        recorderConfig.triggers = null;

        const enabled = new ReplayPredicates(
          recorderConfig,
          { item, replayId },
        ).isEnabledForTriggerType('occurrence')
        expect(enabled).to.be.false;
      });

    });
  });
});
