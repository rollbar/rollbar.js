/**
 * Unit tests for LeadingCapture
 */

import { expect } from 'chai';
import sinon from 'sinon';

import LeadingCapture from '../../../src/browser/replay/leadingCapture.js';
import logger from '../../../src/logger.js';

describe('LeadingCapture', function () {
  let leadingCapture;
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

    leadingCapture = new LeadingCapture({
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
      expect(leadingCapture._recorder).to.equal(mockRecorder);
      expect(leadingCapture._tracing).to.equal(mockTracing);
      expect(leadingCapture._telemeter).to.equal(mockTelemeter);
      expect(leadingCapture._shouldSend).to.equal(shouldSendStub);
      expect(leadingCapture._onComplete).to.equal(onCompleteStub);
    });

    it('should initialize with empty pending map', function () {
      expect(leadingCapture._pending).to.be.instanceOf(Map);
      expect(leadingCapture._pending.size).to.equal(0);
    });
  });

  describe('schedule', function () {
    it('should capture buffer cursor at time of scheduling', function () {
      leadingCapture.schedule('replay-1', 'uuid-1', 5);

      expect(mockRecorder.bufferCursor.calledOnce).to.be.true;
      const context = leadingCapture._pending.get('replay-1');
      expect(context.bufferCursor).to.deep.equal({ slot: 0, offset: 5 });
    });

    it('should schedule timer for specified duration', function () {
      leadingCapture.schedule('replay-1', 'uuid-1', 3);

      const context = leadingCapture._pending.get('replay-1');
      expect(context.timerId).to.be.a('number');
    });

    it('should store replay context in pending map', function () {
      leadingCapture.schedule('replay-1', 'uuid-1', 5);

      const context = leadingCapture._pending.get('replay-1');
      expect(context).to.deep.include({
        occurrenceUuid: 'uuid-1',
        bufferCursor: { slot: 0, offset: 5 },
        ready: false,
      });
      expect(context.timerId).to.exist;
    });

    it('should export and send after delay', async function () {
      sinon.spy(leadingCapture, '_export');
      sinon.spy(leadingCapture, 'sendIfReady');

      leadingCapture.schedule('replay-1', 'uuid-1', 0.1);

      await clock.tickAsync(100);

      expect(leadingCapture._export.calledOnce).to.be.true;
      expect(
        leadingCapture._export.calledWith('replay-1', 'uuid-1', {
          slot: 0,
          offset: 5,
        }),
      ).to.be.true;
      expect(leadingCapture.sendIfReady.calledWith('replay-1')).to.be.true;
    });

    it('should handle multiple scheduled captures', function () {
      leadingCapture.schedule('replay-1', 'uuid-1', 5);
      leadingCapture.schedule('replay-2', 'uuid-2', 10);

      expect(leadingCapture._pending.size).to.equal(2);
      expect(leadingCapture._pending.has('replay-1')).to.be.true;
      expect(leadingCapture._pending.has('replay-2')).to.be.true;
    });
  });

  describe('_export', function () {
    beforeEach(function () {
      leadingCapture._pending.set('replay-1', {
        timerId: 123,
        occurrenceUuid: 'uuid-1',
        bufferCursor: { slot: 0, offset: 5 },
        ready: false,
      });
    });

    it('should export recording span with cursor', async function () {
      await leadingCapture._export('replay-1', 'uuid-1', {
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
      await leadingCapture._export('replay-1', 'uuid-1', {
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
      leadingCapture._telemeter = null;

      await leadingCapture._export('replay-1', 'uuid-1', {
        slot: 0,
        offset: 5,
      });

      expect(mockRecorder.exportRecordingSpan.called).to.be.true;
      expect(mockTracing.exporter.toPayload.called).to.be.true;
    });

    it('should update context with payload and mark as ready', async function () {
      await leadingCapture._export('replay-1', 'uuid-1', {
        slot: 0,
        offset: 5,
      });

      const context = leadingCapture._pending.get('replay-1');
      expect(context.ready).to.be.true;
      expect(context.payload).to.deep.equal({
        resourceSpans: [{ spanData: 'test' }],
      });
    });

    it('should handle export error and discard', async function () {
      const exportError = new Error('Replay recording has no events');
      mockRecorder.exportRecordingSpan.throws(exportError);
      sinon.spy(logger, 'error');
      sinon.spy(leadingCapture, 'discard');

      await leadingCapture._export('replay-1', 'uuid-1', {
        slot: 0,
        offset: 5,
      });

      expect(logger.error.calledOnce).to.be.true;
      expect(
        logger.error.calledWith(
          'Error exporting leading recording span:',
          exportError,
        ),
      ).to.be.true;
      expect(leadingCapture.discard.calledWith('replay-1')).to.be.true;
      expect(mockTelemeter.exportTelemetrySpan.called).to.be.false;
    });

    it('should return early if context was already cleaned up', async function () {
      leadingCapture._pending.delete('replay-1');

      await leadingCapture._export('replay-1', 'uuid-1', {
        slot: 0,
        offset: 5,
      });

      expect(mockRecorder.exportRecordingSpan.called).to.be.false;
      expect(mockTelemeter.exportTelemetrySpan.called).to.be.false;
    });
  });

  describe('sendIfReady', function () {
    beforeEach(function () {
      leadingCapture._pending.set('replay-1', {
        timerId: 123,
        occurrenceUuid: 'uuid-1',
        bufferCursor: { slot: 0, offset: 5 },
        ready: true,
        payload: { resourceSpans: [{ spanData: 'test' }] },
      });
    });

    it('should send payload when ready and shouldSend returns true', async function () {
      shouldSendStub.returns(true);

      await leadingCapture.sendIfReady('replay-1');

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

      await leadingCapture.sendIfReady('replay-1');

      expect(shouldSendStub.calledWith('replay-1')).to.be.true;
      expect(mockTracing.exporter.post.called).to.be.false;
    });

    it('should not send when context is not ready', async function () {
      leadingCapture._pending.set('replay-1', {
        ready: false,
        payload: { resourceSpans: [] },
      });

      await leadingCapture.sendIfReady('replay-1');

      expect(mockTracing.exporter.post.called).to.be.false;
      expect(shouldSendStub.called).to.be.false;
    });

    it('should not send when payload is missing', async function () {
      leadingCapture._pending.set('replay-1', {
        ready: true,
        payload: null,
      });

      await leadingCapture.sendIfReady('replay-1');

      expect(mockTracing.exporter.post.called).to.be.false;
    });

    it('should not send when context does not exist', async function () {
      await leadingCapture.sendIfReady('nonexistent');

      expect(mockTracing.exporter.post.called).to.be.false;
      expect(shouldSendStub.called).to.be.false;
    });

    it('should discard context after sending', async function () {
      await leadingCapture.sendIfReady('replay-1');

      expect(leadingCapture._pending.has('replay-1')).to.be.false;
    });

    it('should call onComplete after sending', async function () {
      await leadingCapture.sendIfReady('replay-1');

      expect(onCompleteStub.calledOnce).to.be.true;
      expect(onCompleteStub.calledWith('replay-1')).to.be.true;
    });

    it('should handle post errors gracefully', async function () {
      const postError = new Error('Network error');
      mockTracing.exporter.post.rejects(postError);
      sinon.spy(logger, 'error');

      await leadingCapture.sendIfReady('replay-1');

      expect(logger.error.calledOnce).to.be.true;
      expect(
        logger.error.calledWith('Failed to send leading replay:', postError),
      ).to.be.true;
      expect(leadingCapture._pending.has('replay-1')).to.be.false;
      expect(onCompleteStub.calledWith('replay-1')).to.be.true;
    });

    it('should work without onComplete callback', async function () {
      leadingCapture._onComplete = null;

      await leadingCapture.sendIfReady('replay-1');

      expect(mockTracing.exporter.post.calledOnce).to.be.true;
      expect(leadingCapture._pending.has('replay-1')).to.be.false;
    });
  });

  describe('discard', function () {
    it('should cancel timer and remove context', function () {
      const timerId = setTimeout(() => {}, 5000);
      leadingCapture._pending.set('replay-1', {
        timerId,
        occurrenceUuid: 'uuid-1',
        bufferCursor: { slot: 0, offset: 5 },
        ready: false,
      });

      leadingCapture.discard('replay-1');

      expect(leadingCapture._pending.has('replay-1')).to.be.false;
    });

    it('should handle discarding non-existent replay', function () {
      leadingCapture.discard('nonexistent');

      expect(leadingCapture._pending.has('nonexistent')).to.be.false;
    });

    it('should handle context without timerId', function () {
      leadingCapture._pending.set('replay-1', {
        occurrenceUuid: 'uuid-1',
        ready: true,
      });

      leadingCapture.discard('replay-1');

      expect(leadingCapture._pending.has('replay-1')).to.be.false;
    });

    it('should prevent scheduled export from running after discard', async function () {
      sinon.spy(leadingCapture, '_export');

      leadingCapture.schedule('replay-1', 'uuid-1', 0.1);
      leadingCapture.discard('replay-1');

      await clock.tickAsync(200);

      expect(leadingCapture._export.called).to.be.false;
    });
  });

  describe('schedule and export integration', function () {
    it('should complete full cycle: schedule -> export -> sendIfReady', async function () {
      sinon.spy(leadingCapture, '_export');
      sinon.spy(leadingCapture, 'sendIfReady');

      leadingCapture.schedule('replay-1', 'uuid-1', 0.1);

      expect(leadingCapture._pending.has('replay-1')).to.be.true;
      expect(leadingCapture._pending.get('replay-1').ready).to.be.false;

      await clock.tickAsync(100);

      expect(leadingCapture._export.calledOnce).to.be.true;
      expect(leadingCapture.sendIfReady.calledOnce).to.be.true;
      expect(mockRecorder.exportRecordingSpan.calledOnce).to.be.true;
      expect(mockTracing.exporter.post.calledOnce).to.be.true;
      expect(leadingCapture._pending.has('replay-1')).to.be.false;
    });

    it('should not send if shouldSend returns false after export', async function () {
      shouldSendStub.returns(false);

      leadingCapture.schedule('replay-1', 'uuid-1', 0.1);
      await clock.tickAsync(100);

      expect(mockRecorder.exportRecordingSpan.calledOnce).to.be.true;
      expect(mockTracing.exporter.post.called).to.be.false;
      expect(onCompleteStub.called).to.be.false;
    });

    it('should preserve buffer cursor across time', async function () {
      mockRecorder.bufferCursor.onFirstCall().returns({ slot: 0, offset: 5 });
      mockRecorder.bufferCursor.onSecondCall().returns({ slot: 1, offset: 10 });

      leadingCapture.schedule('replay-1', 'uuid-1', 0.2);

      const capturedCursor =
        leadingCapture._pending.get('replay-1').bufferCursor;
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

  describe('coordination with shouldSend', function () {
    it('should wait for shouldSend to return true', async function () {
      shouldSendStub.returns(false);

      leadingCapture.schedule('replay-1', 'uuid-1', 0.05);
      await clock.tickAsync(50);

      const context = leadingCapture._pending.get('replay-1');
      expect(context.ready).to.be.true;
      expect(mockTracing.exporter.post.called).to.be.false;

      shouldSendStub.returns(true);
      await leadingCapture.sendIfReady('replay-1');

      expect(mockTracing.exporter.post.calledOnce).to.be.true;
    });

    it('should call shouldSend with replay ID', async function () {
      leadingCapture._pending.set('replay-1', {
        ready: true,
        payload: { resourceSpans: [] },
      });

      await leadingCapture.sendIfReady('replay-1');

      expect(shouldSendStub.calledOnce).to.be.true;
      expect(shouldSendStub.calledWith('replay-1')).to.be.true;
    });
  });

  describe('error handling', function () {
    it('should log errors during scheduled execution', async function () {
      const exportError = new Error('Export failed');
      mockRecorder.exportRecordingSpan.throws(exportError);
      sinon.spy(logger, 'error');

      leadingCapture.schedule('replay-1', 'uuid-1', 0.05);
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

      leadingCapture.schedule('replay-1', 'uuid-1', 0.05);
      await clock.tickAsync(50);

      expect(leadingCapture._pending.has('replay-1')).to.be.false;
    });

    it('should handle post error and still call onComplete', async function () {
      const postError = new Error('Network error');
      mockTracing.exporter.post.rejects(postError);

      leadingCapture.schedule('replay-1', 'uuid-1', 0.05);
      await clock.tickAsync(50);

      expect(onCompleteStub.calledWith('replay-1')).to.be.true;
      expect(leadingCapture._pending.has('replay-1')).to.be.false;
    });
  });

  describe('timer management', function () {
    it('should clear timer on discard', function () {
      leadingCapture.schedule('replay-1', 'uuid-1', 10);
      const context = leadingCapture._pending.get('replay-1');
      const timerId = context.timerId;

      leadingCapture.discard('replay-1');

      expect(leadingCapture._pending.has('replay-1')).to.be.false;
    });

    it('should not interfere with other timers when discarding', async function () {
      leadingCapture.schedule('replay-1', 'uuid-1', 0.1);
      leadingCapture.schedule('replay-2', 'uuid-2', 0.1);

      leadingCapture.discard('replay-1');

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

      leadingCapture.schedule('replay-1', 'uuid-1', 0.1);
      leadingCapture.schedule('replay-2', 'uuid-2', 0.2);

      const context1 = leadingCapture._pending.get('replay-1');
      const context2 = leadingCapture._pending.get('replay-2');

      expect(context1.bufferCursor).to.deep.equal({ slot: 0, offset: 5 });
      expect(context2.bufferCursor).to.deep.equal({ slot: 1, offset: 10 });

      await clock.tickAsync(100);

      expect(leadingCapture._pending.has('replay-1')).to.be.false;
      expect(leadingCapture._pending.has('replay-2')).to.be.true;

      await clock.tickAsync(100);

      expect(leadingCapture._pending.has('replay-2')).to.be.false;
    });

    it('should handle concurrent exports without interference', async function () {
      leadingCapture._pending.set('replay-1', {
        ready: true,
        payload: { resourceSpans: [{ id: '1' }] },
      });
      leadingCapture._pending.set('replay-2', {
        ready: true,
        payload: { resourceSpans: [{ id: '2' }] },
      });

      await leadingCapture.sendIfReady('replay-1');
      await leadingCapture.sendIfReady('replay-2');

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
