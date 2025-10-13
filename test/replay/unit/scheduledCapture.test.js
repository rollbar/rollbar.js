/**
 * Unit tests for ScheduledCapture
 */

import { expect } from 'chai';
import sinon from 'sinon';

import ScheduledCapture from '../../../src/browser/replay/scheduledCapture.js';
import logger from '../../../src/logger.js';

describe('ScheduledCapture', function () {
  let scheduledCapture;
  let mockRecorder;
  let mockTracing;
  let mockTelemeter;
  let shouldSendStub;
  let onCompleteStub;
  let clock;

  beforeEach(function () {
    clock = sinon.useFakeTimers();

    mockRecorder = {
      bufferCursor: sinon.stub().returns({ slot: 0, offset: 5 }),
      exportRecordingSpan: sinon.stub(),
    };

    mockTracing = {
      exporter: {
        toPayload: sinon
          .stub()
          .returns({ resourceSpans: [{ spanData: 'test' }] }),
        post: sinon.stub().resolves(),
      },
    };

    mockTelemeter = {
      exportTelemetrySpan: sinon.stub(),
    };

    shouldSendStub = sinon.stub().returns(true);
    onCompleteStub = sinon.stub();

    scheduledCapture = new ScheduledCapture({
      recorder: mockRecorder,
      tracing: mockTracing,
      telemeter: mockTelemeter,
      shouldSend: shouldSendStub,
      onComplete: onCompleteStub,
    });
  });

  afterEach(function () {
    clock.restore();
    sinon.restore();
  });

  describe('constructor', function () {
    it('should initialize with required dependencies', function () {
      expect(scheduledCapture._recorder).to.equal(mockRecorder);
      expect(scheduledCapture._tracing).to.equal(mockTracing);
      expect(scheduledCapture._telemeter).to.equal(mockTelemeter);
      expect(scheduledCapture._shouldSend).to.equal(shouldSendStub);
      expect(scheduledCapture._onComplete).to.equal(onCompleteStub);
      expect(scheduledCapture._pending).to.be.instanceOf(Map);
    });

    it('should initialize with empty pending map', function () {
      expect(scheduledCapture._pending).to.be.instanceOf(Map);
      expect(scheduledCapture._pending.size).to.equal(0);
    });
  });

  describe('schedule', function () {
    it('should capture buffer cursor at time of scheduling', function () {
      scheduledCapture.schedule('replay-1', 'uuid-1', 5);

      expect(mockRecorder.bufferCursor.calledOnce).to.be.true;
      const context = scheduledCapture._pending.get('replay-1');
      expect(context.cursor).to.deep.equal({ slot: 0, offset: 5 });
    });

    it('should schedule timer for specified duration', function () {
      scheduledCapture.schedule('replay-1', 'uuid-1', 3);

      const context = scheduledCapture._pending.get('replay-1');
      expect(context.timerId).to.be.a('number');
    });

    it('should store replay context in pending map', function () {
      scheduledCapture.schedule('replay-1', 'uuid-1', 5);

      const context = scheduledCapture._pending.get('replay-1');
      expect(context).to.deep.include({
        occurrenceUuid: 'uuid-1',
        cursor: { slot: 0, offset: 5 },
        ready: false,
      });
      expect(context.timerId).to.exist;
    });

    it('should export and send after delay', async function () {
      sinon.spy(scheduledCapture, '_export');
      sinon.spy(scheduledCapture, 'sendIfReady');

      scheduledCapture.schedule('replay-1', 'uuid-1', 0.1);

      await clock.tickAsync(100);

      expect(scheduledCapture._export.calledOnce).to.be.true;
      expect(
        scheduledCapture._export.calledWith('replay-1', 'uuid-1', {
          slot: 0,
          offset: 5,
        }),
      ).to.be.true;
      expect(scheduledCapture.sendIfReady.calledWith('replay-1')).to.be.true;
    });

    it('should handle multiple scheduled captures', function () {
      scheduledCapture.schedule('replay-1', 'uuid-1', 5);
      scheduledCapture.schedule('replay-2', 'uuid-2', 10);

      expect(scheduledCapture._pending.size).to.equal(2);
      expect(scheduledCapture._pending.has('replay-1')).to.be.true;
      expect(scheduledCapture._pending.has('replay-2')).to.be.true;
    });
  });

  describe('_export', function () {
    beforeEach(function () {
      scheduledCapture._pending.set('replay-1', {
        timerId: 123,
        occurrenceUuid: 'uuid-1',
        cursor: { slot: 0, offset: 5 },
        ready: false,
      });
    });

    it('should export recording span with cursor', async function () {
      scheduledCapture._export('replay-1', 'uuid-1', {
        slot: 0,
        offset: 5,
      });

      expect(mockRecorder.exportRecordingSpan.calledOnce).to.be.true;
      expect(
        mockRecorder.exportRecordingSpan.calledWith(
          mockTracing,
          {
            'rollbar.replay.id': 'replay-1',
            'rollbar.occurrence.uuid': 'uuid-1',
          },
          { slot: 0, offset: 5 },
        ),
      ).to.be.true;
    });

    it('should export telemetry span', async function () {
      scheduledCapture._export('replay-1', 'uuid-1', {
        slot: 0,
        offset: 5,
      });

      expect(mockTelemeter.exportTelemetrySpan.calledOnce).to.be.true;
      expect(
        mockTelemeter.exportTelemetrySpan.calledWith({
          'rollbar.replay.id': 'replay-1',
        }),
      ).to.be.true;
    });

    it('should work without telemeter', async function () {
      scheduledCapture._telemeter = null;

      scheduledCapture._export('replay-1', 'uuid-1', {
        slot: 0,
        offset: 5,
      });

      expect(mockRecorder.exportRecordingSpan.called).to.be.true;
      expect(mockTracing.exporter.toPayload.called).to.be.true;
    });

    it('should update context with payload and mark as ready', async function () {
      await scheduledCapture._export('replay-1', 'uuid-1', {
        slot: 0,
        offset: 5,
      });

      const context = scheduledCapture._pending.get('replay-1');
      expect(context.ready).to.be.true;
      expect(context.payload).to.deep.equal({
        resourceSpans: [{ spanData: 'test' }],
      });
    });

    it.only('should handle export error and discard', async function () {
      const exportError = new Error('Replay recording has no events');
      mockRecorder.exportRecordingSpan.throws(exportError);
      sinon.spy(logger, 'error');
      sinon.spy(scheduledCapture, 'discard');

      expect(() => {
        scheduledCapture._export('replay-1', 'uuid-1', {
          slot: 0,
          offset: 5,
        });
      }).to.throw('Leading export failed');

      expect(logger.error.calledOnce).to.be.true;
      expect(
        logger.error.calledWith(
          'Error exporting leading recording span:',
          exportError,
        ),
      ).to.be.true;
      expect(scheduledCapture.discard.calledWith('replay-1')).to.be.true;
      expect(mockTelemeter.exportTelemetrySpan.called).to.be.false;
    });

    it.only('should return early if context was already cleaned up', async function () {
      scheduledCapture._pending.delete('replay-1');

      expect(() => {
        scheduledCapture._export('replay-1', 'uuid-1', {
          slot: 0,
          offset: 5,
        });
      }).to.throw('No pending context for replayId, cleaned up?');

      expect(mockRecorder.exportRecordingSpan.called).to.be.false;
      expect(mockTelemeter.exportTelemetrySpan.called).to.be.false;
    });
  });

  describe('sendIfReady', function () {
    beforeEach(function () {
      scheduledCapture._pending.set('replay-1', {
        timerId: 123,
        occurrenceUuid: 'uuid-1',
        cursor: { slot: 0, offset: 5 },
        ready: true,
        payload: { resourceSpans: [{ spanData: 'test' }] },
      });
    });

    it('should send payload when ready and shouldSend returns true', async function () {
      shouldSendStub.returns(true);

      scheduledCapture.sendIfReady('replay-1');

      expect(shouldSendStub.calledWith('replay-1')).to.be.true;
      expect(mockTracing.exporter.post.calledOnce).to.be.true;
      expect(
        mockTracing.exporter.post.calledWith(
          { resourceSpans: [{ spanData: 'test' }] },
          { 'X-Rollbar-Replay-Id': 'replay-1' },
        ),
      ).to.be.true;
    });

    it('should not send when shouldSend returns false', async function () {
      shouldSendStub.returns(false);

      scheduledCapture.sendIfReady('replay-1');

      expect(shouldSendStub.calledWith('replay-1')).to.be.true;
      expect(mockTracing.exporter.post.called).to.be.false;
    });

    it('should not send when context is not ready', async function () {
      scheduledCapture._pending.set('replay-1', {
        ready: false,
        payload: { resourceSpans: [] },
      });

      scheduledCapture.sendIfReady('replay-1');

      expect(mockTracing.exporter.post.called).to.be.false;
      expect(shouldSendStub.called).to.be.false;
    });

    it('should not send when payload is missing', async function () {
      scheduledCapture._pending.set('replay-1', {
        ready: true,
        payload: null,
      });

      scheduledCapture.sendIfReady('replay-1');

      expect(mockTracing.exporter.post.called).to.be.false;
    });

    it('should not send when context does not exist', async function () {
      scheduledCapture.sendIfReady('nonexistent');

      expect(mockTracing.exporter.post.called).to.be.false;
      expect(shouldSendStub.called).to.be.false;
    });

    it('should discard context after sending', async function () {
      scheduledCapture.sendIfReady('replay-1');

      expect(scheduledCapture._pending.has('replay-1')).to.be.false;
    });

    it('should call onComplete after sending', async function () {
      scheduledCapture.sendIfReady('replay-1');

      expect(onCompleteStub.calledOnce).to.be.true;
      expect(onCompleteStub.calledWith('replay-1')).to.be.true;
    });

    it('should handle post errors gracefully', async function () {
      const postError = new Error('Network error');
      mockTracing.exporter.post.rejects(postError);
      sinon.spy(logger, 'error');

      scheduledCapture.sendIfReady('replay-1');

      expect(logger.error.calledOnce).to.be.true;
      expect(
        logger.error.calledWith('Failed to send leading replay:', postError),
      ).to.be.true;
      expect(scheduledCapture._pending.has('replay-1')).to.be.false;
      expect(onCompleteStub.calledWith('replay-1')).to.be.true;
    });

    it('should work without onComplete callback', async function () {
      scheduledCapture._onComplete = null;

      scheduledCapture.sendIfReady('replay-1');

      expect(mockTracing.exporter.post.calledOnce).to.be.true;
      expect(scheduledCapture._pending.has('replay-1')).to.be.false;
    });
  });

  describe('discard', function () {
    it('should cancel timer and remove context', function () {
      const timerId = setTimeout(() => {}, 5000);
      scheduledCapture._pending.set('replay-1', {
        timerId,
        occurrenceUuid: 'uuid-1',
        cursor: { slot: 0, offset: 5 },
        ready: false,
      });

      scheduledCapture.discard('replay-1');

      expect(scheduledCapture._pending.has('replay-1')).to.be.false;
    });

    it('should handle discarding non-existent replay', function () {
      scheduledCapture.discard('nonexistent');

      expect(scheduledCapture._pending.has('nonexistent')).to.be.false;
    });

    it('should handle context without timerId', function () {
      scheduledCapture._pending.set('replay-1', {
        occurrenceUuid: 'uuid-1',
        ready: true,
      });

      scheduledCapture.discard('replay-1');

      expect(scheduledCapture._pending.has('replay-1')).to.be.false;
    });

    it('should prevent scheduled export from running after discard', async function () {
      sinon.spy(scheduledCapture, '_export');

      scheduledCapture.schedule('replay-1', 'uuid-1', 0.1);
      scheduledCapture.discard('replay-1');

      await clock.tickAsync(200);

      expect(scheduledCapture._export.called).to.be.false;
    });
  });

  describe('schedule and export integration', function () {
    it('should complete full cycle: schedule -> export -> sendIfReady', async function () {
      sinon.spy(scheduledCapture, '_export');
      sinon.spy(scheduledCapture, 'sendIfReady');

      scheduledCapture.schedule('replay-1', 'uuid-1', 0.1);

      expect(scheduledCapture._pending.has('replay-1')).to.be.true;
      expect(scheduledCapture._pending.get('replay-1').ready).to.be.false;

      await clock.tickAsync(100);

      expect(scheduledCapture._export.calledOnce).to.be.true;
      expect(scheduledCapture.sendIfReady.calledOnce).to.be.true;
      expect(mockRecorder.exportRecordingSpan.calledOnce).to.be.true;
      expect(mockTracing.exporter.post.calledOnce).to.be.true;
      expect(scheduledCapture._pending.has('replay-1')).to.be.false;
    });

    it('should not send if shouldSend returns false after export', async function () {
      shouldSendStub.returns(false);

      scheduledCapture.schedule('replay-1', 'uuid-1', 0.1);
      await clock.tickAsync(100);

      expect(mockRecorder.exportRecordingSpan.calledOnce).to.be.true;
      expect(mockTracing.exporter.post.called).to.be.false;
      expect(onCompleteStub.called).to.be.false;
    });

    it('should preserve buffer cursor across time', async function () {
      mockRecorder.bufferCursor.onFirstCall().returns({ slot: 0, offset: 5 });
      mockRecorder.bufferCursor.onSecondCall().returns({ slot: 1, offset: 10 });

      scheduledCapture.schedule('replay-1', 'uuid-1', 0.2);

      const capturedCursor = scheduledCapture._pending.get('replay-1').cursor;
      expect(capturedCursor).to.deep.equal({ slot: 0, offset: 5 });

      await clock.tickAsync(100);

      expect(mockRecorder.exportRecordingSpan.called).to.be.false;

      await clock.tickAsync(100);

      expect(mockRecorder.exportRecordingSpan.calledOnce).to.be.true;
      expect(mockRecorder.exportRecordingSpan.firstCall.args[2]).to.deep.equal({
        slot: 0,
        offset: 5,
      });
    });
  });

  describe('_pendingContextIfReady', function () {
    it('should return context when ready and shouldSend returns true', function () {
      const payload = { resourceSpans: [{ spanData: 'test' }] };
      scheduledCapture._pending.set('replay-1', { ready: true, payload });
      shouldSendStub.returns(true);

      const result = scheduledCapture._pendingContextIfReady('replay-1');

      expect(shouldSendStub.calledOnce).to.be.true;
      expect(shouldSendStub.calledWith('replay-1')).to.be.true;
      expect(result).to.deep.equal({ ready: true, payload });
    });

    it('should return null when shouldSend returns false', function () {
      scheduledCapture._pending.set('replay-1', {
        ready: true,
        payload: { resourceSpans: [] },
      });
      shouldSendStub.returns(false);

      const result = scheduledCapture._pendingContextIfReady('replay-1');

      expect(shouldSendStub.calledOnce).to.be.true;
      expect(result).to.be.null;
    });

    it('should return null when context is not ready', function () {
      scheduledCapture._pending.set('replay-1', {
        ready: false,
        payload: { resourceSpans: [] },
      });

      const result = scheduledCapture._pendingContextIfReady('replay-1');

      expect(shouldSendStub.called).to.be.false;
      expect(result).to.be.null;
    });

    it('should return null when payload is missing', function () {
      scheduledCapture._pending.set('replay-1', { ready: true, payload: null });

      const result = scheduledCapture._pendingContextIfReady('replay-1');

      expect(shouldSendStub.called).to.be.false;
      expect(result).to.be.null;
    });

    it('should return null when context does not exist', function () {
      const result = scheduledCapture._pendingContextIfReady('nonexistent');

      expect(shouldSendStub.called).to.be.false;
      expect(result).to.be.null;
    });

    it('should return null when ready is not exactly true', function () {
      scheduledCapture._pending.set('replay-1', {
        ready: 1, // truthy but not true
        payload: { resourceSpans: [] },
      });

      const result = scheduledCapture._pendingContextIfReady('replay-1');

      expect(shouldSendStub.called).to.be.false;
      expect(result).to.be.null;
    });
  });

  describe('coordination with shouldSend', function () {
    it('should wait for shouldSend to return true', async function () {
      shouldSendStub.returns(false);

      scheduledCapture.schedule('replay-1', 'uuid-1', 0.05);
      await clock.tickAsync(50);

      const context = scheduledCapture._pending.get('replay-1');
      expect(context.ready).to.be.true;
      expect(mockTracing.exporter.post.called).to.be.false;

      shouldSendStub.returns(true);
      scheduledCapture.sendIfReady('replay-1');

      expect(mockTracing.exporter.post.calledOnce).to.be.true;
    });

    it('should call shouldSend with replay ID', async function () {
      scheduledCapture._pending.set('replay-1', {
        ready: true,
        payload: { resourceSpans: [] },
      });

      scheduledCapture.sendIfReady('replay-1');

      expect(shouldSendStub.calledOnce).to.be.true;
      expect(shouldSendStub.calledWith('replay-1')).to.be.true;
    });
  });

  describe('error handling', function () {
    it('should log errors during scheduled execution', async function () {
      const exportError = new Error('Export failed');
      mockRecorder.exportRecordingSpan.throws(exportError);
      sinon.spy(logger, 'error');

      scheduledCapture.schedule('replay-1', 'uuid-1', 0.05);
      await clock.tickAsync(50);

      expect(
        logger.error.calledWith(
          'Error exporting leading recording span:',
          exportError,
        ),
      ).to.be.true;
    });

    it('should clean up after export error', async function () {
      mockRecorder.exportRecordingSpan.throws(new Error('Export failed'));

      scheduledCapture.schedule('replay-1', 'uuid-1', 0.05);
      await clock.tickAsync(50);

      expect(scheduledCapture._pending.has('replay-1')).to.be.false;
    });

    it('should handle post error and still call onComplete', async function () {
      const postError = new Error('Network error');
      mockTracing.exporter.post.rejects(postError);

      scheduledCapture.schedule('replay-1', 'uuid-1', 0.05);
      await clock.tickAsync(50);

      expect(onCompleteStub.calledWith('replay-1')).to.be.true;
      expect(scheduledCapture._pending.has('replay-1')).to.be.false;
    });
  });

  describe('timer management', function () {
    it('should clear timer on discard', function () {
      scheduledCapture.schedule('replay-1', 'uuid-1', 10);
      const context = scheduledCapture._pending.get('replay-1');
      const timerId = context.timerId;

      scheduledCapture.discard('replay-1');

      expect(scheduledCapture._pending.has('replay-1')).to.be.false;
    });

    it('should not interfere with other timers when discarding', async function () {
      scheduledCapture.schedule('replay-1', 'uuid-1', 0.1);
      scheduledCapture.schedule('replay-2', 'uuid-2', 0.1);

      scheduledCapture.discard('replay-1');

      await clock.tickAsync(100);

      expect(mockRecorder.exportRecordingSpan.calledOnce).to.be.true;
      expect(
        mockRecorder.exportRecordingSpan.firstCall.args[1],
      ).to.have.property('rollbar.occurrence.uuid', 'uuid-2');
    });
  });

  describe('state management', function () {
    it('should maintain separate state for multiple replays', async function () {
      mockRecorder.bufferCursor.onFirstCall().returns({ slot: 0, offset: 5 });
      mockRecorder.bufferCursor.onSecondCall().returns({ slot: 1, offset: 10 });

      scheduledCapture.schedule('replay-1', 'uuid-1', 0.1);
      scheduledCapture.schedule('replay-2', 'uuid-2', 0.2);

      const context1 = scheduledCapture._pending.get('replay-1');
      const context2 = scheduledCapture._pending.get('replay-2');

      expect(context1.cursor).to.deep.equal({ slot: 0, offset: 5 });
      expect(context2.cursor).to.deep.equal({ slot: 1, offset: 10 });

      await clock.tickAsync(100);

      expect(scheduledCapture._pending.has('replay-1')).to.be.false;
      expect(scheduledCapture._pending.has('replay-2')).to.be.true;

      await clock.tickAsync(100);

      expect(scheduledCapture._pending.has('replay-2')).to.be.false;
    });

    it('should handle concurrent exports without interference', async function () {
      scheduledCapture._pending.set('replay-1', {
        ready: true,
        payload: { resourceSpans: [{ id: '1' }] },
      });
      scheduledCapture._pending.set('replay-2', {
        ready: true,
        payload: { resourceSpans: [{ id: '2' }] },
      });

      scheduledCapture.sendIfReady('replay-1');
      scheduledCapture.sendIfReady('replay-2');

      expect(mockTracing.exporter.post.callCount).to.equal(2);
      expect(mockTracing.exporter.post.firstCall.args[0]).to.deep.equal({
        resourceSpans: [{ id: '1' }],
      });
      expect(mockTracing.exporter.post.secondCall.args[0]).to.deep.equal({
        resourceSpans: [{ id: '2' }],
      });
    });
  });
});
