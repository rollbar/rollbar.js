/**
 * Unit tests for the Replay module
 */

import { expect } from 'chai';
import sinon from 'sinon';
import logger from '../../../src/logger.js';
import Replay from '../../../src/browser/replay/replay.js';
import id from '../../../src/tracing/id.js';

class MockRecorder {
  constructor() {
    this.exportRecordingSpan = sinon.stub();
    this.isReady = true;
  }
}

class MockApi {
  constructor() {
    this.postSpans = sinon.stub();
    this.postSpans.resolves({ success: true });
  }
}

class MockTracing {
  constructor(returnPayload = [{ id: 'span1' }, { id: 'span2' }]) {
    this.exporter = {
      toPayload: sinon.stub().returns(returnPayload),
      post: sinon.stub().resolves({ success: true }),
    };
  }

  addSpanTransform() {}
}

class MockTelemeter {
  constructor() {
    this.exportTelemetrySpan = sinon.stub();
  }
}

describe('Replay', function () {
  let replay;
  let recorder;
  let mockRecorder;
  let mockApi;
  let mockTracing;
  let mockTelemeter;

  beforeEach(function () {
    logger.init({ logLevel: 'error' });
    sinon.stub(id, 'gen').returns('1234567890abcdef');

    mockRecorder = new MockRecorder();
    mockApi = new MockApi();
    mockTracing = new MockTracing();
    mockTelemeter = new MockTelemeter();

    replay = new Replay({
      tracing: mockTracing,
      telemeter: mockTelemeter,
      options: {},
    });
    replay._recorder = mockRecorder;
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('constructor', function () {
    it('should succeed with required dependencies', function () {
      expect(
        () =>
          new Replay({
            tracing: mockTracing,
            options: {},
          }),
      ).to.not.throw();

      expect(
        () =>
          new Replay({
            tracing: mockTracing,
            telemeter: mockTelemeter,
            options: {},
          }),
      ).to.not.throw();
    });
  });

  describe('_exportSpansAndAddTracingPayload', function () {
    let trigger, triggerContext;

    beforeEach(function () {
      trigger = {
        type: 'occurrence',
        level: ['critical', 'error'],
      };
      triggerContext = {
        level: 'error',
      };
    });

    it('should export recording span and add payload to the map', async function () {
      const replayId = '1234567890abcdef';
      const occurrenceUuid = 'test-uuid';

      const expectedPayload = [{ id: 'span1' }, { id: 'span2' }];

      await replay._exportSpansAndAddTracingPayload(
        replayId,
        occurrenceUuid,
        trigger,
        triggerContext,
      );

      expect(mockTelemeter.exportTelemetrySpan.calledOnce).to.be.true;
      expect(
        mockTelemeter.exportTelemetrySpan.calledWith({
          'rollbar.replay.id': replayId,
        }),
      ).to.be.true;

      expect(mockRecorder.exportRecordingSpan.called).to.be.true;
      expect(
        mockRecorder.exportRecordingSpan.calledWith(mockTracing, {
          'rollbar.replay.id': replayId,
          'rollbar.occurrence.uuid': occurrenceUuid,
          'rollbar.replay.trigger.type': trigger.type,
          'rollbar.replay.trigger.context': JSON.stringify(triggerContext),
          'rollbar.replay.trigger': JSON.stringify(trigger),
          'rollbar.replay.url.full': 'http://localhost:8000/?********',
        }),
      ).to.be.true;

      expect(
        mockRecorder.exportRecordingSpan.calledBefore(
          mockTelemeter.exportTelemetrySpan,
        ),
      ).to.be.true;

      expect(mockTracing.exporter.toPayload.called).to.be.true;

      expect(replay.size).to.equal(1);

      const retrievedPayload = replay.getSpans(replayId);
      expect(retrievedPayload).to.deep.equal(expectedPayload);
    });

    it('should not store anything when exportRecordingSpan throws', async function () {
      mockRecorder.exportRecordingSpan.throws(
        new Error('Replay recording has no events'),
      );

      const loggerSpy = sinon.spy(logger, 'debug');
      const replayId = '1234567890abcdef';
      const occurrenceUuid = 'test-uuid';
      await replay._exportSpansAndAddTracingPayload(
        replayId,
        occurrenceUuid,
        trigger,
        triggerContext,
      );

      expect(mockRecorder.exportRecordingSpan.called).to.be.true;
      expect(
        mockRecorder.exportRecordingSpan.calledWith(mockTracing, {
          'rollbar.replay.id': replayId,
          'rollbar.occurrence.uuid': occurrenceUuid,
          'rollbar.replay.trigger.type': trigger.type,
          'rollbar.replay.trigger.context': JSON.stringify(triggerContext),
          'rollbar.replay.trigger': JSON.stringify(trigger),
          'rollbar.replay.url.full': 'http://localhost:8000/?********',
        }),
      ).to.be.true;

      expect(mockTelemeter.exportTelemetrySpan.called).to.be.false;
      expect(mockTracing.exporter.toPayload.called).to.be.false;

      expect(replay.size).to.equal(0);
      expect(replay.getSpans(replayId)).to.be.null;

      expect(loggerSpy.called).to.be.true;
      expect(loggerSpy.args[0][0]).to.include('Error exporting recording span');
    });

    it('should work when telemeter is not provided', async function () {
      replay = new Replay({
        tracing: mockTracing,
        telemeter: null,
        options: {},
      });
      replay._recorder = mockRecorder;

      const replayId = '1234567890abcdef';
      const occurrenceUuid = 'test-uuid';

      const expectedPayload = [{ id: 'span1' }, { id: 'span2' }];
      await replay._exportSpansAndAddTracingPayload(
        replayId,
        occurrenceUuid,
        trigger,
        triggerContext,
      );
      expect(mockRecorder.exportRecordingSpan.called).to.be.true;
      expect(
        mockRecorder.exportRecordingSpan.calledWith(mockTracing, {
          'rollbar.replay.id': replayId,
          'rollbar.occurrence.uuid': occurrenceUuid,
          'rollbar.replay.trigger.type': trigger.type,
          'rollbar.replay.trigger.context': JSON.stringify(triggerContext),
          'rollbar.replay.trigger': JSON.stringify(trigger),
          'rollbar.replay.url.full': 'http://localhost:8000/?********',
        }),
      ).to.be.true;

      expect(mockTracing.exporter.toPayload.called).to.be.true;

      expect(replay.size).to.equal(1);
      const retrievedPayload = replay.getSpans(replayId);
      expect(retrievedPayload).to.deep.equal(expectedPayload);
    });
  });

  describe('add', function () {
    it('should use provided replayId and process synchronously', function () {
      const replayId = '1122334455667788';
      const uuid = '12345678-1234-5678-1234-1234567890ab';
      const trigger = { type: 'occurrence' };
      const triggerContext = { level: 'error' };
      const processStub = sinon
        .stub(replay, '_exportSpansAndAddTracingPayload')
        .resolves();
      const predicatesStub = sinon
        .stub(replay._predicates, 'shouldCaptureForTriggerContext')
        .returns(trigger);

      const resp = replay.capture(replayId, uuid, triggerContext);

      expect(resp).to.equal(replayId);
      expect(id.gen.calledWith(8)).to.be.false;
      expect(processStub.calledWith(replayId, uuid)).to.be.true;
      expect(predicatesStub.calledWith({ ...triggerContext, replayId })).to.be
        .true;
    });

    it('should generate a replayId and return immediately', function () {
      const uuid = '12345678-1234-5678-1234-1234567890ab';
      const trigger = { type: 'occurrence' };
      const triggerContext = { level: 'error' };
      const processStub = sinon
        .stub(replay, '_exportSpansAndAddTracingPayload')
        .resolves();
      const predicatesStub = sinon
        .stub(replay._predicates, 'shouldCaptureForTriggerContext')
        .returns(trigger);

      const replayId = replay.capture(null, uuid, triggerContext);

      expect(replayId).to.equal('1234567890abcdef');
      expect(id.gen.calledWith(8)).to.be.true;
      expect(processStub.calledWith('1234567890abcdef', uuid)).to.be.true;
      expect(predicatesStub.calledWith({ ...triggerContext, replayId })).to.be
        .true;
    });

    it('should return without replayId when recorder is not ready', function () {
      const uuid = '12345678-1234-5678-1234-1234567890ab';
      const processStub = sinon
        .stub(replay, '_exportSpansAndAddTracingPayload')
        .resolves();
      mockRecorder.isReady = false;

      const replayId = replay.capture(null, uuid);

      expect(replayId).to.be.null;
      expect(id.gen.called).to.be.false;
      expect(processStub.called).to.be.false;
    });
  });

  describe('send', function () {
    it('should send payload and remove it from the map', async function () {
      const mockPayload = [{ id: 'payload1' }, { id: 'payload2' }];
      replay.setSpans('testReplayId', mockPayload);
      expect(replay.size).to.equal(1);

      await replay.send('testReplayId');

      expect(mockTracing.exporter.post.called).to.be.true;
      expect(mockTracing.exporter.post.firstCall.args[0]).to.deep.equal(
        mockPayload,
      );
      expect(mockTracing.exporter.post.firstCall.args[1]).to.deep.equal({
        'X-Rollbar-Replay-Id': 'testReplayId',
      });

      expect(replay.size).to.equal(0);
    });

    it('should throw when replayId parameter is missing', async function () {
      let error;
      try {
        await replay.send();
      } catch (e) {
        error = e;
      }

      expect(error).to.be.instanceof(Error);
      expect(error.message).to.equal('Replay.send: No replayId provided');
      expect(mockTracing.exporter.post.called).to.be.false;
    });

    it('should throw when replayId does not exist', async function () {
      let error;
      try {
        await replay.send('nonexistent');
      } catch (e) {
        error = e;
      }

      expect(error).to.be.instanceof(Error);
      expect(error.message).to.include('No replay found for id: nonexistent');
      expect(mockTracing.exporter.post.called).to.be.false;
    });

    it('should throw when payload is an empty array', async function () {
      replay.setSpans('emptyReplayId', []);

      let error;
      try {
        await replay.send('emptyReplayId');
      } catch (e) {
        error = e;
      }

      expect(error).to.be.instanceof(Error);
      expect(error.message).to.include(
        'No payload found for id: emptyReplayId',
      );
      expect(mockTracing.exporter.post.called).to.be.false;
    });

    it('should throw when payload is an empty OTLP object', async function () {
      replay.setSpans('emptyOTLPReplayId', { resourceSpans: [] });

      let error;
      try {
        await replay.send('emptyOTLPReplayId');
      } catch (e) {
        error = e;
      }

      expect(error).to.be.instanceof(Error);
      expect(error.message).to.include(
        'No payload found for id: emptyOTLPReplayId',
      );
      expect(mockTracing.exporter.post.called).to.be.false;
    });

    it('should propagate API errors', async function () {
      replay.setSpans('errorReplayId', [{ id: 'span1' }]);

      const apiError = new Error('API error');
      mockTracing.exporter.post.rejects(apiError);

      let error;
      try {
        await replay.send('errorReplayId');
      } catch (e) {
        error = e;
      }

      expect(error).to.equal(apiError);
      expect(mockTracing.exporter.post.called).to.be.true;

      expect(replay.size).to.equal(0);
    });
  });

  describe('discard', function () {
    it('should remove the replay from the map without sending', function () {
      replay.setSpans('discardReplayId', [{ id: 'span1' }]);
      expect(replay.size).to.equal(1);

      const result = replay.discard('discardReplayId');

      expect(result).to.be.true;
      expect(mockTracing.exporter.post.called).to.be.false;
      expect(replay.size).to.equal(0);
    });

    it('should handle missing replayId parameter', function () {
      const loggerSpy = sinon.spy(logger, 'error');

      const result = replay.discard();

      expect(result).to.be.false;
      expect(loggerSpy.called).to.be.true;
      expect(loggerSpy.args[0][0]).to.include(
        'Replay.discard: No replayId provided',
      );
    });

    it('should handle non-existent replayId', function () {
      const loggerSpy = sinon.spy(logger, 'error');

      const result = replay.discard('nonexistent');

      expect(result).to.be.false;
      expect(loggerSpy.called).to.be.true;
      expect(loggerSpy.args[0][0]).to.include(
        'No replay found for replayId: nonexistent',
      );
    });
  });

  describe('getSpans and setSpans', function () {
    it('should get spans correctly when they exist', function () {
      const testPayload = [{ id: 'testSpan1' }, { id: 'testSpan2' }];
      replay.setSpans('testReplayId', testPayload);

      const result = replay.getSpans('testReplayId');
      expect(result).to.deep.equal(testPayload);
    });

    it('should return null when getting spans for non-existent replayId', function () {
      const result = replay.getSpans('nonExistentId');
      expect(result).to.be.null;
    });

    it('should allow overwriting existing spans', function () {
      const initialPayload = [{ id: 'initialSpan' }];
      const updatedPayload = [{ id: 'updatedSpan' }];

      replay.setSpans('replayId', initialPayload);
      expect(replay.getSpans('replayId')).to.deep.equal(initialPayload);

      replay.setSpans('replayId', updatedPayload);
      expect(replay.getSpans('replayId')).to.deep.equal(updatedPayload);
    });
  });

  describe('size and clear', function () {
    it('should report correct size of the map', function () {
      expect(replay.size).to.equal(0);

      replay.setSpans('id1', [{ id: 'span1' }]);
      expect(replay.size).to.equal(1);

      replay.setSpans('id2', [{ id: 'span2' }]);
      expect(replay.size).to.equal(2);
    });

    it('should clear all entries from the map', function () {
      replay.setSpans('id1', [{ id: 'span1' }]);
      replay.setSpans('id2', [{ id: 'span2' }]);
      expect(replay.size).to.equal(2);

      replay.clear();
      expect(replay.size).to.equal(0);
    });
  });

  describe('_canSendReplay', function () {
    it('returns true when all conditions are met', function () {
      const result = Replay._canSendReplay(
        null,
        { err: 0 },
        {
          'Rollbar-Replay-Enabled': 'true',
          'Rollbar-Replay-RateLimit-Remaining': '10',
        },
      );
      expect(result).to.be.true;
    });

    it('returns false when err is truthy', function () {
      const result = Replay._canSendReplay(
        new Error('API error'),
        { err: 0 },
        { 'Rollbar-Replay-Enabled': 'true' },
      );
      expect(result).to.be.false;
    });

    it('returns false when resp.err is non-zero', function () {
      const result = Replay._canSendReplay(
        null,
        { err: 1 },
        {
          'Rollbar-Replay-Enabled': 'true',
        },
      );
      expect(result).to.be.false;
    });

    it('returns false when resp is null', function () {
      const result = Replay._canSendReplay(null, null, {
        'Rollbar-Replay-Enabled': 'true',
      });
      expect(result).to.be.false;
    });

    it('returns false when Rollbar-Replay-Enabled is not "true"', function () {
      const result = Replay._canSendReplay(
        null,
        { err: 0 },
        {
          'Rollbar-Replay-Enabled': 'false',
          'Rollbar-Replay-RateLimit-Remaining': '10',
        },
      );
      expect(result).to.be.false;
    });

    it('returns false when Rollbar-Replay-RateLimit-Remaining is "0"', function () {
      const result = Replay._canSendReplay(
        null,
        { err: 0 },
        {
          'Rollbar-Replay-Enabled': 'true',
          'Rollbar-Replay-RateLimit-Remaining': '0',
        },
      );
      expect(result).to.be.false;
    });

    it('returns false when headers are null', function () {
      const result = Replay._canSendReplay(null, { err: 0 }, null);
      expect(result).to.be.false;
    });

    it('handles case-insensitive headers', function () {
      const result = Replay._canSendReplay(
        null,
        { err: 0 },
        {
          'rollbar-replay-enabled': 'true',
          'ROLLBAR-REPLAY-RATELIMIT-REMAINING': '10',
        },
      );
      expect(result).to.be.true;
    });

    it('handles whitespace in header values', function () {
      const result = Replay._canSendReplay(
        null,
        { err: 0 },
        {
          'Rollbar-Replay-Enabled': ' true ',
          'Rollbar-Replay-RateLimit-Remaining': ' 10 ',
        },
      );
      expect(result).to.be.true;
    });
  });

  describe('sendOrDiscardReplay', function () {
    beforeEach(function () {
      replay.setSpans('test-replay', [{ id: 'span1' }]);
      sinon.stub(replay, 'send').resolves();
      sinon.stub(replay, 'discard');
    });

    describe('when all conditions are met', function () {
      it('should call send when error is null, resp.err is 0, replay enabled, and rate limit available', async function () {
        await replay.sendOrDiscardReplay(
          'test-replay',
          null,
          { err: 0 },
          {
            'Rollbar-Replay-Enabled': 'true',
            'Rollbar-Replay-RateLimit-Remaining': '10',
          },
        );

        expect(replay.send.calledOnceWith('test-replay')).to.be.true;
        expect(replay.discard.called).to.be.false;
      });
    });

    describe('when conditions are not met', function () {
      it('should discard when err is truthy', async function () {
        await replay.sendOrDiscardReplay(
          'test-replay',
          new Error('API error'),
          { err: 0 },
          { 'Rollbar-Replay-Enabled': 'true' },
        );

        expect(replay.send.called).to.be.false;
        expect(replay.discard.calledOnceWith('test-replay')).to.be.true;
      });

      it('should discard when resp.err is non-zero', async function () {
        await replay.sendOrDiscardReplay(
          'test-replay',
          null,
          { err: 1 },
          { 'Rollbar-Replay-Enabled': 'true' },
        );

        expect(replay.send.called).to.be.false;
        expect(replay.discard.calledOnceWith('test-replay')).to.be.true;
      });

      it('should discard when Rollbar-Replay-Enabled is not "true"', async function () {
        await replay.sendOrDiscardReplay(
          'test-replay',
          null,
          { err: 0 },
          { 'Rollbar-Replay-Enabled': 'false' },
        );

        expect(replay.send.called).to.be.false;
        expect(replay.discard.calledOnceWith('test-replay')).to.be.true;
      });

      it('should discard when Rollbar-Replay-RateLimit-Remaining is "0"', async function () {
        await replay.sendOrDiscardReplay(
          'test-replay',
          null,
          { err: 0 },
          {
            'Rollbar-Replay-Enabled': 'true',
            'Rollbar-Replay-RateLimit-Remaining': '0',
          },
        );

        expect(replay.send.called).to.be.false;
        expect(replay.discard.calledOnceWith('test-replay')).to.be.true;
      });

      it('should discard when response is null', async function () {
        await replay.sendOrDiscardReplay('test-replay', null, null, {
          'Rollbar-Replay-Enabled': 'true',
        });

        expect(replay.send.called).to.be.false;
        expect(replay.discard.calledOnceWith('test-replay')).to.be.true;
      });

      it('should discard when headers are null', async function () {
        await replay.sendOrDiscardReplay('test-replay', null, { err: 0 }, null);

        expect(replay.send.called).to.be.false;
        expect(replay.discard.calledOnceWith('test-replay')).to.be.true;
      });
    });

    describe('when send throws', function () {
      it('should log error and discard replay', async function () {
        const sendError = new Error('Send failed');
        replay.send.rejects(sendError);
        const loggerSpy = sinon.spy(logger, 'error');

        await replay.sendOrDiscardReplay(
          'test-replay',
          null,
          { err: 0 },
          {
            'Rollbar-Replay-Enabled': 'true',
            'Rollbar-Replay-RateLimit-Remaining': '10',
          },
        );

        expect(replay.send.calledOnce).to.be.true;
        expect(loggerSpy.calledOnce).to.be.true;
        expect(loggerSpy.firstCall.args[0]).to.equal('Failed to send replay:');
        expect(loggerSpy.firstCall.args[1]).to.equal(sendError);
        expect(replay.discard.calledOnceWith('test-replay')).to.be.true;
      });
    });
  });
});
