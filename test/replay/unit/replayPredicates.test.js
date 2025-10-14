/**
 * Unit tests for the ReplayPredicates module
 */

import { expect } from 'chai';
import ReplayPredicates from '../../../src/browser/replay/replayPredicates.js';

describe('Replay', function () {
  let replayId;
  let replayConfig;
  let replayPredicates;

  describe('configure', function () {
    beforeEach(function () {
      replayConfig = {
        triggerDefaults: {
          preDuration: 300,
          postDuration: 5,
          samplingRatio: 1.0,
        },
        triggers: [
          {
            type: 'occurrence',
            level: ['error', 'critical'],
          },
        ],
      };
      replayPredicates = new ReplayPredicates(replayConfig);
    });

    it('should set maxPreDuration', function () {
      replayPredicates.configure({
        ...replayConfig,
        triggers: [
          {
            type: 'occurrence',
            level: ['error', 'critical'],
            preDuration: 100,
            postDuration: 5,
          },
          {
            type: 'direct',
            tags: ['foo'],
            preDuration: 600,
            postDuration: 5,
          },
        ],
      });
      expect(replayPredicates.maxPreDuration).to.equal(600);
    });

    it('should initialize triggers with defaults', function () {
      replayPredicates.configure({
        ...replayConfig,
        triggers: [
          {
            type: 'occurrence',
            level: ['critical'],
          },
          {
            type: 'direct',
            tags: ['foo'],
            preDuration: 60,
            postDuration: 180,
          },
          {
            type: 'navigation',
            pathMatch: ['products'],
            preDuration: 0,
            postDuration: 60,
            samplingRatio: 0.1,
          },
        ],
      });
      expect(replayPredicates.triggers).to.deep.equal([
        {
          type: 'occurrence',
          level: ['critical'],
          preDuration: 300,
          postDuration: 5,
          samplingRatio: 1.0,
        },
        {
          type: 'direct',
          tags: ['foo'],
          preDuration: 60,
          postDuration: 180,
          samplingRatio: 1.0,
        },
        {
          type: 'navigation',
          pathMatch: ['products'],
          preDuration: 0,
          postDuration: 60,
          samplingRatio: 0.1,
        },
      ]);
    });

    it('should allow multiple triggers of the same type', function () {
      replayPredicates.configure({
        ...replayConfig,
        triggers: [
          {
            type: 'navigation',
            pathMatch: 'app',
            samplingRatio: 0.5,
          },
          {
            type: 'navigation',
            pathMatch: 'settings',
            preDuration: 60,
            postDuration: 180,
          },
          {
            type: 'navigation',
            pathMatch: 'user',
            preDuration: 30,
            postDuration: 60,
          },
        ],
      });
      expect(replayPredicates.triggers).to.deep.equal([
        {
          type: 'navigation',
          pathMatch: 'app',
          preDuration: 300,
          postDuration: 5,
          samplingRatio: 0.5,
        },
        {
          type: 'navigation',
          pathMatch: 'settings',
          preDuration: 60,
          postDuration: 180,
          samplingRatio: 1.0,
        },
        {
          type: 'navigation',
          pathMatch: 'user',
          preDuration: 30,
          postDuration: 60,
          samplingRatio: 1.0,
        },
      ]);
    });
  });

  describe('shouldCaptureForTriggerContext', function () {
    describe('occurrence', function () {
      beforeEach(function () {
        replayId = 'aaaabbbbccccdddd'; // fixed value for consistent sampling
        replayConfig = {
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
          replayConfig,
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
          replayConfig,
        ).shouldCaptureForTriggerContext(context);
        expect(resp).to.be.null;
      });

      it('should return true on no level specified', function () {
        const context = {
          type: 'occurrence',
          level: 'info',
          replayId,
        };
        delete replayConfig.triggers[0].level;

        const resp = new ReplayPredicates(
          replayConfig,
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
        replayConfig.triggers.push({
          type: 'occurrence',
          level: ['info'],
          samplingRatio: 0.5,
        });

        const resp = new ReplayPredicates(
          replayConfig,
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
        delete replayConfig.triggers[0].samplingRatio;

        const resp = new ReplayPredicates(
          replayConfig,
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
        replayConfig.triggers[0].samplingRatio = 0.1;

        const resp = new ReplayPredicates(
          replayConfig,
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
        replayConfig.triggerDefaults.samplingRatio = 0.1;
        delete replayConfig.triggers[0].samplingRatio;

        const resp = new ReplayPredicates(
          replayConfig,
        ).shouldCaptureForTriggerContext(context);
        expect(resp).to.be.null;
      });

      it('should return true with trigger overriding baseSamplingRatio', function () {
        const context = {
          type: 'occurrence',
          level: 'error',
          replayId,
        };
        replayConfig.triggerDefaults.samplingRatio = 0.1;

        const resp = new ReplayPredicates(
          replayConfig,
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
        replayConfig.triggers = null;

        const resp = new ReplayPredicates(
          replayConfig,
        ).shouldCaptureForTriggerContext(context);
        expect(resp).to.be.null;
      });
    });

    describe('direct', function () {
      beforeEach(function () {
        replayId = 'aaaabbbbccccdddd'; // fixed value for consistent sampling
        replayConfig = {
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
          replayConfig,
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
          replayConfig,
        ).shouldCaptureForTriggerContext(context);
        expect(resp).to.be.null;
      });

      it('should return null on no tag present', function () {
        const context = {
          type: 'direct',
          replayId,
        };

        const resp = new ReplayPredicates(
          replayConfig,
        ).shouldCaptureForTriggerContext(context);
        expect(resp).to.be.null;
      });
    });

    describe('direct', function () {
      beforeEach(function () {
        replayId = 'aaaabbbbccccdddd'; // fixed value for consistent sampling
        replayConfig = {
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
          replayConfig,
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
          replayConfig,
        ).shouldCaptureForTriggerContext(context);
        expect(resp).to.be.null;
      });
    });
  });
});
