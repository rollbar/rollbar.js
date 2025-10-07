/**
 * Unit tests for the ReplayPredicates module
 */

import { expect } from 'chai';
import ReplayPredicates from '../../../src/browser/replay/replayPredicates.js';

describe('ReplayManager', function () {
  let replayId;
  let recorderConfig;

  describe('isEnabledForTriggerType', function () {
    describe('occurrence', function () {
      beforeEach(function () {
        replayId = 'aaaabbbbccccdddd'; // fixed value for consistent sampling
        recorderConfig = {
          triggerDefaults: {
            preDuration: 300,
            postDuration: 5,
            samplingRatio: 1.0,
          },
          triggers: [
            {
              type: 'occurrence',
              level: ['error', 'critical'],
              samplingRatio: 0.5,
            },
            {
              type: 'direct',
              tags: ['replay', 'session'],
            },
          ],
        };
      });

      it('should return true on matching level', function () {
        const context = {
          type: 'occurrence',
          level: 'error',
          replayId,
        };

        const resp = new ReplayPredicates(
          recorderConfig,
        ).shouldCaptureForTriggerContext(context);
        expect(resp).to.deep.equal({
          type: 'occurrence',
          level: ['error', 'critical'],
          preDuration: 300,
          postDuration: 5,
          samplingRatio: 0.5,
        });
      });

      it('should return null on not matching level', function () {
        const context = {
          type: 'occurrence',
          level: 'info',
          replayId,
        };

        const resp = new ReplayPredicates(
          recorderConfig,
        ).shouldCaptureForTriggerContext(context);
        expect(resp).to.be.null;
      });

      it('should return true on no level specified', function () {
        const context = {
          type: 'occurrence',
          level: 'info',
          replayId,
        };
        delete recorderConfig.triggers[0].level;

        const resp = new ReplayPredicates(
          recorderConfig,
        ).shouldCaptureForTriggerContext(context);
        expect(resp).to.deep.equal({
          type: 'occurrence',
          preDuration: 300,
          postDuration: 5,
          samplingRatio: 0.5,
        });
      });

      it('should return true on matching second trigger', function () {
        const context = {
          type: 'occurrence',
          level: 'info',
          replayId,
        };
        recorderConfig.triggers.push({
          type: 'occurrence',
          level: ['info'],
          samplingRatio: 0.5,
        });

        const resp = new ReplayPredicates(
          recorderConfig,
        ).shouldCaptureForTriggerContext(context);
        expect(resp).to.deep.equal({
          type: 'occurrence',
          level: ['info'],
          preDuration: 300,
          postDuration: 5,
          samplingRatio: 0.5,
        });
      });

      it('should return true on no samplingRatio specified', function () {
        const context = {
          type: 'occurrence',
          level: 'error',
          replayId,
        };
        delete recorderConfig.triggers[0].samplingRatio;

        const resp = new ReplayPredicates(
          recorderConfig,
        ).shouldCaptureForTriggerContext(context);
        expect(resp).to.deep.equal({
          type: 'occurrence',
          level: ['error', 'critical'],
          preDuration: 300,
          postDuration: 5,
          samplingRatio: 1.0,
        });
      });

      it('should return null when not sampled', function () {
        const context = {
          type: 'occurrence',
          level: 'error',
          replayId,
        };
        recorderConfig.triggers[0].samplingRatio = 0.1;

        const resp = new ReplayPredicates(
          recorderConfig,
        ).shouldCaptureForTriggerContext(context);
        expect(resp).to.be.null;
      });

      it('should return null with baseSamplingRatio specified and not sampled', function () {
        const context = {
          type: 'occurrence',
          level: 'error',
          replayId,
        };
        // Note: sampling is generated from replayId, which for the test value
        // will always return not sampled here with ratio of 0.1.
        recorderConfig.triggerDefaults.samplingRatio = 0.1;
        delete recorderConfig.triggers[0].samplingRatio;

        const resp = new ReplayPredicates(
          recorderConfig,
        ).shouldCaptureForTriggerContext(context);
        expect(resp).to.be.null;
      });

      it('should return true with trigger overriding baseSamplingRatio', function () {
        const context = {
          type: 'occurrence',
          level: 'error',
          replayId,
        };
        recorderConfig.triggerDefaults.samplingRatio = 0.1;

        const resp = new ReplayPredicates(
          recorderConfig,
        ).shouldCaptureForTriggerContext(context);
        expect(resp).to.deep.equal({
          type: 'occurrence',
          level: ['error', 'critical'],
          preDuration: 300,
          postDuration: 5,
          samplingRatio: 0.5,
        });
      });

      it('should return null with no triggers', function () {
        const context = {
          type: 'occurrence',
          level: 'error',
          replayId,
        };

        const resp = new ReplayPredicates(null).shouldCaptureForTriggerContext(
          context,
        );
        expect(resp).to.be.null;
      });

      it('should return null with no config', function () {
        const context = {
          type: 'occurrence',
          level: 'error',
          replayId,
        };
        recorderConfig.triggers = null;

        const resp = new ReplayPredicates(
          recorderConfig,
        ).shouldCaptureForTriggerContext(context);
        expect(resp).to.be.null;
      });
    });

    describe('direct', function () {
      beforeEach(function () {
        replayId = 'aaaabbbbccccdddd'; // fixed value for consistent sampling
        recorderConfig = {
          triggerDefaults: {
            preDuration: 300,
            postDuration: 5,
            samplingRatio: 1.0,
          },
          triggers: [
            {
              type: 'occurrence',
              level: ['error', 'critical'],
              samplingRatio: 0.5,
            },
            {
              type: 'direct',
              tags: ['neon', 'argon'],
            },
          ],
        };
      });

      it('should return matching trigger on matching tag', function () {
        const context = {
          type: 'direct',
          tags: ['argon', 'xenon'],
          replayId,
        };

        const resp = new ReplayPredicates(
          recorderConfig,
        ).shouldCaptureForTriggerContext(context);
        expect(resp).to.deep.equal({
          type: 'direct',
          tags: ['neon', 'argon'],
          preDuration: 300,
          postDuration: 5,
          samplingRatio: 1.0,
        });
      });

      it('should return null on no matching tag', function () {
        const context = {
          type: 'direct',
          tags: ['helium', 'xenon'],
          replayId,
        };

        const resp = new ReplayPredicates(
          recorderConfig,
        ).shouldCaptureForTriggerContext(context);
        expect(resp).to.be.null;
      });

      it('should return null on no tag present', function () {
        const context = {
          type: 'direct',
          replayId,
        };

        const resp = new ReplayPredicates(
          recorderConfig,
        ).shouldCaptureForTriggerContext(context);
        expect(resp).to.be.null;
      });
    });

    describe('direct', function () {
      beforeEach(function () {
        replayId = 'aaaabbbbccccdddd'; // fixed value for consistent sampling
        recorderConfig = {
          triggerDefaults: {
            preDuration: 300,
            postDuration: 5,
            samplingRatio: 1.0,
          },
          triggers: [
            {
              type: 'navigation',
              pathMatch: 'foo',
            },
            {
              type: 'direct',
              tags: ['neon', 'argon'],
            },
          ],
        };
      });

      it('should return matching trigger on matching path', function () {
        const context = {
          type: 'navigation',
          path: '/foo/bar',
          replayId,
        };

        const resp = new ReplayPredicates(
          recorderConfig,
        ).shouldCaptureForTriggerContext(context);
        expect(resp).to.deep.equal({
          type: 'navigation',
          pathMatch: 'foo',
          preDuration: 300,
          postDuration: 5,
          samplingRatio: 1.0,
        });
      });

      it('should return null on no matching path', function () {
        const context = {
          type: 'navigation',
          path: '/bar',
          replayId,
        };

        const resp = new ReplayPredicates(
          recorderConfig,
        ).shouldCaptureForTriggerContext(context);
        expect(resp).to.be.null;
      });
    });
  });
});
