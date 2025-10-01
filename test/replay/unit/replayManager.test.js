/**
 * Unit tests for the ReplayManager module
 */

import { expect } from 'chai';
import sinon from 'sinon';
import logger from '../../../src/logger.js';
import ReplayManager from '../../../src/browser/replay/replayManager.js';
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
    };
  }
}

class MockTelemeter {
  constructor() {
    this.exportTelemetrySpan = sinon.stub();
  }
}

describe('ReplayManager', function () {
  let replayManager;
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

    replayManager = new ReplayManager({
      recorder: mockRecorder,
      api: mockApi,
      tracing: mockTracing,
      telemeter: mockTelemeter,
    });
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('constructor', function () {
    it('should throw when required dependencies are missing', function () {
      expect(() => new ReplayManager({})).to.throw(TypeError);
      expect(() => new ReplayManager({ recorder: mockRecorder })).to.throw(
        TypeError,
      );
      expect(
        () =>
          new ReplayManager({
            recorder: mockRecorder,
            api: mockApi,
          }),
      ).to.throw(TypeError);

      expect(
        () =>
          new ReplayManager({
            recorder: mockRecorder,
            api: mockApi,
            tracing: mockTracing,
          }),
      ).to.not.throw();

      expect(
        () =>
          new ReplayManager({
            recorder: mockRecorder,
            api: mockApi,
            tracing: mockTracing,
            telemeter: mockTelemeter,
          }),
      ).to.not.throw();
    });
  });

  describe('_exportSpansAndAddTracingPayload', function () {
    it('should export recording span and add payload to the map', async function () {
      const replayId = '1234567890abcdef';
      const occurrenceUuid = 'test-uuid';

      const expectedPayload = [{ id: 'span1' }, { id: 'span2' }];

      await replayManager._exportSpansAndAddTracingPayload(
        replayId,
        occurrenceUuid,
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
        }),
      ).to.be.true;

      expect(
        mockRecorder.exportRecordingSpan.calledBefore(
          mockTelemeter.exportTelemetrySpan,
        ),
      ).to.be.true;

      expect(mockTracing.exporter.toPayload.called).to.be.true;

      expect(replayManager.size).to.equal(1);

      const retrievedPayload = replayManager.getSpans(replayId);
      expect(retrievedPayload).to.deep.equal(expectedPayload);
    });

    it('should not store anything when exportRecordingSpan throws', async function () {
      mockRecorder.exportRecordingSpan.throws(
        new Error('Replay recording cannot have less than 3 events'),
      );

      const loggerSpy = sinon.spy(logger, 'error');
      const replayId = '1234567890abcdef';
      const occurrenceUuid = 'test-uuid';
      await replayManager._exportSpansAndAddTracingPayload(
        replayId,
        occurrenceUuid,
      );

      expect(mockRecorder.exportRecordingSpan.called).to.be.true;
      expect(
        mockRecorder.exportRecordingSpan.calledWith(mockTracing, {
          'rollbar.replay.id': replayId,
          'rollbar.occurrence.uuid': occurrenceUuid,
        }),
      ).to.be.true;

      expect(mockTelemeter.exportTelemetrySpan.called).to.be.false;
      expect(mockTracing.exporter.toPayload.called).to.be.false;

      expect(replayManager.size).to.equal(0);
      expect(replayManager.getSpans(replayId)).to.be.null;

      expect(loggerSpy.called).to.be.true;
      expect(loggerSpy.args[0][0]).to.include('Error exporting recording span');
    });

    it('should work when telemeter is not provided', async function () {
      replayManager = new ReplayManager({
        recorder: mockRecorder,
        api: mockApi,
        tracing: mockTracing,
        telemeter: null,
      });

      const replayId = '1234567890abcdef';
      const occurrenceUuid = 'test-uuid';

      const expectedPayload = [{ id: 'span1' }, { id: 'span2' }];
      await replayManager._exportSpansAndAddTracingPayload(
        replayId,
        occurrenceUuid,
      );
      expect(mockRecorder.exportRecordingSpan.called).to.be.true;
      expect(
        mockRecorder.exportRecordingSpan.calledWith(mockTracing, {
          'rollbar.replay.id': replayId,
          'rollbar.occurrence.uuid': occurrenceUuid,
        }),
      ).to.be.true;

      expect(mockTracing.exporter.toPayload.called).to.be.true;

      expect(replayManager.size).to.equal(1);
      const retrievedPayload = replayManager.getSpans(replayId);
      expect(retrievedPayload).to.deep.equal(expectedPayload);
    });
  });

  describe('add', function () {
    it('should use provided replayId and process synchronously', function () {
      const replayId = '1122334455667788';
      const uuid = '12345678-1234-5678-1234-1234567890ab';
      const processStub = sinon
        .stub(replayManager, '_exportSpansAndAddTracingPayload')
        .resolves();

      const resp = replayManager.capture(replayId, uuid);

      expect(resp).to.equal(replayId);
      expect(id.gen.calledWith(8)).to.be.false;
      expect(processStub.calledWith(replayId, uuid)).to.be.true;
    });

    it('should generate a replayId and return immediately', function () {
      const uuid = '12345678-1234-5678-1234-1234567890ab';
      const processStub = sinon
        .stub(replayManager, '_exportSpansAndAddTracingPayload')
        .resolves();

      const replayId = replayManager.capture(null, uuid);

      expect(replayId).to.equal('1234567890abcdef');
      expect(id.gen.calledWith(8)).to.be.true;
      expect(processStub.calledWith('1234567890abcdef', uuid)).to.be.true;
    });

    it('should return without replayId when recorder is not ready', function () {
      const uuid = '12345678-1234-5678-1234-1234567890ab';
      const processStub = sinon
        .stub(replayManager, '_exportSpansAndAddTracingPayload')
        .resolves();
      mockRecorder.isReady = false;

      const replayId = replayManager.capture(null, uuid);

      expect(replayId).to.be.null;
      expect(id.gen.called).to.be.false;
      expect(processStub.called).to.be.false;
    });
  });

  describe('send', function () {
    it('should send payload and remove it from the map', async function () {
      const mockPayload = [{ id: 'payload1' }, { id: 'payload2' }];
      replayManager.setSpans('testReplayId', mockPayload);
      expect(replayManager.size).to.equal(1);

      await replayManager.send('testReplayId');

      expect(mockApi.postSpans.called).to.be.true;
      expect(mockApi.postSpans.firstCall.args[0]).to.deep.equal(mockPayload);
      expect(mockApi.postSpans.firstCall.args[1]).to.deep.equal({
        'X-Rollbar-Replay-Id': 'testReplayId',
      });

      expect(replayManager.size).to.equal(0);
    });

    it('should throw when replayId parameter is missing', async function () {
      let error;
      try {
        await replayManager.send();
      } catch (e) {
        error = e;
      }

      expect(error).to.be.instanceof(Error);
      expect(error.message).to.equal(
        'ReplayManager.send: No replayId provided',
      );
      expect(mockApi.postSpans.called).to.be.false;
    });

    it('should throw when replayId does not exist', async function () {
      let error;
      try {
        await replayManager.send('nonexistent');
      } catch (e) {
        error = e;
      }

      expect(error).to.be.instanceof(Error);
      expect(error.message).to.include('No replay found for id: nonexistent');
      expect(mockApi.postSpans.called).to.be.false;
    });

    it('should throw when payload is an empty array', async function () {
      replayManager.setSpans('emptyReplayId', []);

      let error;
      try {
        await replayManager.send('emptyReplayId');
      } catch (e) {
        error = e;
      }

      expect(error).to.be.instanceof(Error);
      expect(error.message).to.include(
        'No payload found for id: emptyReplayId',
      );
      expect(mockApi.postSpans.called).to.be.false;
    });

    it('should throw when payload is an empty OTLP object', async function () {
      replayManager.setSpans('emptyOTLPReplayId', { resourceSpans: [] });

      let error;
      try {
        await replayManager.send('emptyOTLPReplayId');
      } catch (e) {
        error = e;
      }

      expect(error).to.be.instanceof(Error);
      expect(error.message).to.include(
        'No payload found for id: emptyOTLPReplayId',
      );
      expect(mockApi.postSpans.called).to.be.false;
    });

    it('should propagate API errors', async function () {
      replayManager.setSpans('errorReplayId', [{ id: 'span1' }]);

      const apiError = new Error('API error');
      mockApi.postSpans.rejects(apiError);

      let error;
      try {
        await replayManager.send('errorReplayId');
      } catch (e) {
        error = e;
      }

      expect(error).to.equal(apiError);
      expect(mockApi.postSpans.called).to.be.true;

      expect(replayManager.size).to.equal(0);
    });
  });

  describe('discard', function () {
    it('should remove the replay from the map without sending', function () {
      replayManager.setSpans('discardReplayId', [{ id: 'span1' }]);
      expect(replayManager.size).to.equal(1);

      const result = replayManager.discard('discardReplayId');

      expect(result).to.be.true;
      expect(mockApi.postSpans.called).to.be.false;
      expect(replayManager.size).to.equal(0);
    });

    it('should handle missing replayId parameter', function () {
      const loggerSpy = sinon.spy(logger, 'error');

      const result = replayManager.discard();

      expect(result).to.be.false;
      expect(loggerSpy.called).to.be.true;
      expect(loggerSpy.args[0][0]).to.include(
        'ReplayManager.discard: No replayId provided',
      );
    });

    it('should handle non-existent replayId', function () {
      const loggerSpy = sinon.spy(logger, 'error');

      const result = replayManager.discard('nonexistent');

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
      replayManager.setSpans('testReplayId', testPayload);

      const result = replayManager.getSpans('testReplayId');
      expect(result).to.deep.equal(testPayload);
    });

    it('should return null when getting spans for non-existent replayId', function () {
      const result = replayManager.getSpans('nonExistentId');
      expect(result).to.be.null;
    });

    it('should allow overwriting existing spans', function () {
      const initialPayload = [{ id: 'initialSpan' }];
      const updatedPayload = [{ id: 'updatedSpan' }];

      replayManager.setSpans('replayId', initialPayload);
      expect(replayManager.getSpans('replayId')).to.deep.equal(initialPayload);

      replayManager.setSpans('replayId', updatedPayload);
      expect(replayManager.getSpans('replayId')).to.deep.equal(updatedPayload);
    });
  });

  describe('size and clear', function () {
    it('should report correct size of the map', function () {
      expect(replayManager.size).to.equal(0);

      replayManager.setSpans('id1', [{ id: 'span1' }]);
      expect(replayManager.size).to.equal(1);

      replayManager.setSpans('id2', [{ id: 'span2' }]);
      expect(replayManager.size).to.equal(2);
    });

    it('should clear all entries from the map', function () {
      replayManager.setSpans('id1', [{ id: 'span1' }]);
      replayManager.setSpans('id2', [{ id: 'span2' }]);
      expect(replayManager.size).to.equal(2);

      replayManager.clear();
      expect(replayManager.size).to.equal(0);
    });
  });

  describe('sendOrDiscardReplay', function () {
    beforeEach(function () {
      replayManager.setSpans('test-replay', [{ id: 'span1' }]);
      sinon.stub(replayManager, 'send').resolves();
      sinon.stub(replayManager, 'discard');
    });

    describe('when all conditions are met', function () {
      it('should call send when error is null, resp.err is 0, replay enabled, and rate limit available', async function () {
        await replayManager.sendOrDiscardReplay(
          'test-replay',
          null,
          { err: 0 },
          {
            'Rollbar-Replay-Enabled': 'true',
            'Rollbar-Replay-RateLimit-Remaining': '10',
          },
        );

        expect(replayManager.send.calledOnceWith('test-replay')).to.be.true;
        expect(replayManager.discard.called).to.be.false;
      });
    });

    describe('when conditions are not met', function () {
      it('should discard when err is truthy', async function () {
        await replayManager.sendOrDiscardReplay(
          'test-replay',
          new Error('API error'),
          { err: 0 },
          { 'Rollbar-Replay-Enabled': 'true' },
        );

        expect(replayManager.send.called).to.be.false;
        expect(replayManager.discard.calledOnceWith('test-replay')).to.be.true;
      });

      it('should discard when resp.err is non-zero', async function () {
        await replayManager.sendOrDiscardReplay(
          'test-replay',
          null,
          { err: 1 },
          { 'Rollbar-Replay-Enabled': 'true' },
        );

        expect(replayManager.send.called).to.be.false;
        expect(replayManager.discard.calledOnceWith('test-replay')).to.be.true;
      });

      it('should discard when Rollbar-Replay-Enabled is not "true"', async function () {
        await replayManager.sendOrDiscardReplay(
          'test-replay',
          null,
          { err: 0 },
          { 'Rollbar-Replay-Enabled': 'false' },
        );

        expect(replayManager.send.called).to.be.false;
        expect(replayManager.discard.calledOnceWith('test-replay')).to.be.true;
      });

      it('should discard when Rollbar-Replay-RateLimit-Remaining is "0"', async function () {
        await replayManager.sendOrDiscardReplay(
          'test-replay',
          null,
          { err: 0 },
          {
            'Rollbar-Replay-Enabled': 'true',
            'Rollbar-Replay-RateLimit-Remaining': '0',
          },
        );

        expect(replayManager.send.called).to.be.false;
        expect(replayManager.discard.calledOnceWith('test-replay')).to.be.true;
      });

      it('should discard when response is null', async function () {
        await replayManager.sendOrDiscardReplay('test-replay', null, null, {
          'Rollbar-Replay-Enabled': 'true',
        });

        expect(replayManager.send.called).to.be.false;
        expect(replayManager.discard.calledOnceWith('test-replay')).to.be.true;
      });

      it('should discard when headers are null', async function () {
        await replayManager.sendOrDiscardReplay(
          'test-replay',
          null,
          { err: 0 },
          null,
        );

        expect(replayManager.send.called).to.be.false;
        expect(replayManager.discard.calledOnceWith('test-replay')).to.be.true;
      });
    });

    describe('when send throws', function () {
      it('should log error and discard replay', async function () {
        const sendError = new Error('Send failed');
        replayManager.send.rejects(sendError);
        const loggerSpy = sinon.spy(logger, 'error');

        await replayManager.sendOrDiscardReplay(
          'test-replay',
          null,
          { err: 0 },
          {
            'Rollbar-Replay-Enabled': 'true',
            'Rollbar-Replay-RateLimit-Remaining': '10',
          },
        );

        expect(replayManager.send.calledOnce).to.be.true;
        expect(loggerSpy.calledOnce).to.be.true;
        expect(loggerSpy.firstCall.args[0]).to.equal('Failed to send replay:');
        expect(loggerSpy.firstCall.args[1]).to.equal(sendError);
        expect(replayManager.discard.calledOnceWith('test-replay')).to.be.true;
      });
    });
  });
});
