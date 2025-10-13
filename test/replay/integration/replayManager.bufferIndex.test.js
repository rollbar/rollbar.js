import { expect } from 'chai';
import sinon from 'sinon';
import { EventType } from '@rrweb/types';

import logger from '../../../src/logger.js';
import ReplayManager from '../../../src/browser/replay/replayManager.js';
import {
  currentBuffer,
  setCurrentBuffer,
  setPreviousBuffer,
} from '../util/recorder.js';

describe('ReplayManager buffer-index integration', function () {
  let options, replayManager, recorder, api, tracing, telemeter, clock;

  beforeEach(function () {
    clock = sinon.useFakeTimers();
    logger.init({ logLevel: 'warn' });

    const mockRecordFn = () => () => {};
    options = {
      enabled: true,
      triggerDefaults: {
        preDuration: 10,
        postDuration: 5,
      },
      triggers: [
        {
          type: 'occurrence',
        },
      ],
      recordFn: mockRecordFn,
    };

    tracing = {
      startSpan: sinon.stub().returns({
        setAttributes: sinon.stub(),
        addEvent: sinon.stub(),
        end: sinon.stub(),
        span: { startTime: 0 },
      }),
      exporter: {
        toPayload: sinon
          .stub()
          .returns({ resourceSpans: [{ spanData: 'test' }] }),
        post: sinon.stub().resolves(),
      },
      session: {
        attributes: {},
      },
    };

    api = {
      postSpans: sinon.stub().resolves(),
    };

    telemeter = {
      exportTelemetrySpan: sinon.stub(),
    };

    replayManager = new ReplayManager({
      tracing,
      telemeter,
      options,
    });
    recorder = replayManager.recorder;

    recorder._isReady = true;
    recorder._stopFn = () => {};

    sinon.spy(recorder, 'exportRecordingSpan');
  });

  afterEach(function () {
    recorder.exportRecordingSpan.restore();
    clock.restore();
  });

  it('bails out if no leading events after timeout', async function () {
    setPreviousBuffer(recorder, [
      { timestamp: 1000, type: EventType.Meta, data: {} },
    ]);
    setCurrentBuffer(recorder, [
      { timestamp: 2000, type: EventType.Meta, data: {} },
    ]);

    const capturer = replayManager._scheduledCapture;
    sinon.spy(capturer, '_export');
    sinon.spy(capturer, 'sendIfReady');
    sinon.spy(capturer, '_pendingContextIfReady');

    const exportFn = capturer._export;
    const sendIfReadyFn = capturer.sendIfReady;
    const pendingContextIfReadyFn = capturer._pendingContextIfReady;

    const replayId = 'test-replay-id';
    const occurrenceUuid = 'test-uuid';
    const triggerContext = { type: 'occurrence', level: 'error' };

    replayManager.capture(replayId, occurrenceUuid, triggerContext);
    await clock.tickAsync(100);

    expect(capturer._pending.has(replayId)).to.be.true;

    sinon.assert.notCalled(exportFn);
    sinon.assert.notCalled(sendIfReadyFn);

    await replayManager.send(replayId);

    // ReplayManager calls sendIfReady immediately on send()
    sinon.assert.notCalled(exportFn);
    sinon.assert.calledOnce(sendIfReadyFn);
    expect(sendIfReadyFn.firstCall.args).to.deep.equal([replayId]);

    sinon.assert.calledOnce(pendingContextIfReadyFn);
    expect(pendingContextIfReadyFn.firstCall.args).to.deep.equal([replayId]);
    expect(pendingContextIfReadyFn.firstCall.returnValue).to.be.null;

    exportFn.resetHistory();
    sendIfReadyFn.resetHistory();
    pendingContextIfReadyFn.resetHistory();

    await clock.tickAsync(5000);

    // Scheduled capture timer fires, but no events to export
    sinon.assert.calledOnce(exportFn);
    sinon.assert.notCalled(sendIfReadyFn);
    sinon.assert.notCalled(pendingContextIfReadyFn);

    exportFn.restore();
    sendIfReadyFn.restore();
    pendingContextIfReadyFn.restore();
  });

  it('captures and sends leading replay with buffer-index', async function () {
    setPreviousBuffer(recorder, [
      { timestamp: 1000, type: EventType.Meta, data: {} },
    ]);
    setCurrentBuffer(recorder, [
      { timestamp: 2000, type: EventType.Meta, data: {} },
    ]);

    const replayId = 'test-replay-id';
    const occurrenceUuid = 'test-uuid';
    const triggerContext = { type: 'occurrence', level: 'error' };

    replayManager.capture(replayId, occurrenceUuid, triggerContext);
    const trigger = replayManager._predicates.triggers[0];
    await clock.tickAsync(100);

    sinon.assert.calledOnce(recorder.exportRecordingSpan);
    expect(recorder.exportRecordingSpan.firstCall.args).to.deep.equal([
      tracing,
      {
        'rollbar.replay.id': replayId,
        'rollbar.occurrence.uuid': occurrenceUuid,
        'rollbar.replay.trigger.type': trigger.type,
        'rollbar.replay.trigger.context': JSON.stringify(triggerContext),
        'rollbar.replay.trigger': JSON.stringify(trigger),
        'rollbar.replay.url.full': 'http://localhost:8000/?********',
      },
    ]);

    await replayManager.send(replayId);

    await clock.tickAsync(1000);

    // Push leading event
    currentBuffer(recorder).push({
      timestamp: 3000,
      type: EventType.IncrementalSnapshot,
      data: {},
    });

    await clock.tickAsync(4000);

    sinon.assert.calledTwice(recorder.exportRecordingSpan);
    expect(recorder.exportRecordingSpan.secondCall.args).to.deep.equal([
      tracing,
      {
        'rollbar.replay.id': replayId,
        'rollbar.occurrence.uuid': occurrenceUuid,
      },
      { slot: 0, offset: 0 },
    ]);

    sinon.assert.calledTwice(tracing.exporter.post);
    expect(tracing.exporter.post.secondCall.args).to.deep.equal([
      { resourceSpans: [{ spanData: 'test' }] },
      { 'X-Rollbar-Replay-Id': replayId },
    ]);
  });

  it('handles buffer rotation correctly with buffer-index', async function () {
    setPreviousBuffer(recorder, [
      { timestamp: 1000, type: EventType.Meta, data: {} },
    ]);
    setCurrentBuffer(recorder, [
      { timestamp: 2000, type: EventType.Meta, data: {} },
    ]);

    const replayId = 'test-replay-id';
    const occurrenceUuid = 'test-uuid';
    const triggerContext = { type: 'occurrence', level: 'error' };

    replayManager.capture(replayId, occurrenceUuid, triggerContext);
    const trigger = replayManager._predicates.triggers[0];
    await clock.tickAsync(100);

    const capturedCursor =
      replayManager._scheduledCapture._pending.get(replayId).cursor;
    expect(capturedCursor).to.be.an('object');
    expect(capturedCursor).to.have.property('slot', 0);
    expect(capturedCursor).to.have.property('offset', 0);

    setPreviousBuffer(recorder, currentBuffer(recorder));
    setCurrentBuffer(recorder, [
      { timestamp: 3000, type: EventType.Meta, data: {} },
      { timestamp: 4000, type: EventType.Meta, data: {} },
    ]);

    await replayManager.send(replayId);
    await clock.tickAsync(5000);

    expect(recorder.exportRecordingSpan.secondCall.args).to.deep.equal([
      tracing,
      {
        'rollbar.replay.id': replayId,
        'rollbar.occurrence.uuid': occurrenceUuid,
      },
      capturedCursor,
    ]);

    sinon.assert.calledTwice(tracing.exporter.post);
    expect(tracing.exporter.post.secondCall.args).to.deep.equal([
      { resourceSpans: [{ spanData: 'test' }] },
      { 'X-Rollbar-Replay-Id': replayId },
    ]);
    expect(replayManager._scheduledCapture._pending.has(replayId)).to.be.false;
  });

  it('discards leading when trailing fails', async function () {
    setPreviousBuffer(recorder, [
      { timestamp: 1000, type: EventType.Meta, data: {} },
    ]);
    setCurrentBuffer(recorder, [
      { timestamp: 2000, type: EventType.Meta, data: {} },
    ]);

    const replayId = 'test-replay-id';
    const occurrenceUuid = 'test-uuid';
    const triggerContext = { type: 'occurrence', level: 'error' };

    replayManager.capture(replayId, occurrenceUuid, triggerContext);
    const trigger = replayManager._predicates.triggers[0];
    await clock.tickAsync(100);

    replayManager.discard(replayId);
    await clock.tickAsync(5000);

    sinon.assert.notCalled(tracing.exporter.post);
    expect(replayManager._scheduledCapture._pending.has(replayId)).to.be.false;
  });

  it('waits while trailing is pending, then sends once trailing is SENT', async function () {
    setPreviousBuffer(recorder, [
      { timestamp: 1000, type: EventType.Meta, data: {} },
    ]);
    setCurrentBuffer(recorder, [
      { timestamp: 2000, type: EventType.Meta, data: {} },
    ]);

    const replayId = 'test-replay-id';
    const occurrenceUuid = 'test-uuid';
    const triggerContext = { type: 'occurrence', level: 'error' };

    replayManager.capture(replayId, occurrenceUuid, triggerContext);
    const trigger = replayManager._predicates.triggers[0];
    expect(trigger).to.deep.equal({
      preDuration: 10,
      postDuration: 5,
      type: 'occurrence',
    });

    await clock.tickAsync(100);

    currentBuffer(recorder).push({
      timestamp: 3000,
      type: EventType.IncrementalSnapshot,
      data: {},
    });

    await clock.tickAsync(5000);

    const capturer = replayManager._scheduledCapture;
    expect(capturer._pending.has(replayId)).to.be.true;
    expect(capturer._shouldSend(replayId)).to.be.false;
    expect(capturer._pendingContextIfReady(replayId)).to.be.null;
    sinon.assert.notCalled(tracing.exporter.post);

    await replayManager.send(replayId);

    sinon.assert.calledTwice(tracing.exporter.post);
    expect(capturer._pending.has(replayId)).to.be.false;
  });

  it('cleans up on leading post error', async function () {
    setPreviousBuffer(recorder, [
      { timestamp: 1000, type: EventType.Meta, data: {} },
    ]);
    setCurrentBuffer(recorder, [
      { timestamp: 2000, type: EventType.Meta, data: {} },
    ]);

    tracing.exporter.post.onFirstCall().resolves();
    tracing.exporter.post.onSecondCall().rejects(new Error('Network error'));

    const replayId = 'test-replay-id';
    const occurrenceUuid = 'test-uuid';
    const triggerContext = { type: 'occurrence', level: 'error' };

    replayManager.capture(replayId, occurrenceUuid, triggerContext);
    const trigger = replayManager._predicates.triggers[0];
    expect(trigger).to.exist;

    await clock.tickAsync(100);

    currentBuffer(recorder).push({
      timestamp: 3000,
      type: EventType.IncrementalSnapshot,
      data: {},
    });

    await replayManager.send(replayId);
    await clock.tickAsync(5000);

    sinon.assert.calledTwice(tracing.exporter.post);
    expect(tracing.exporter.post.firstCall.args).to.deep.equal([
      { resourceSpans: [{ spanData: 'test' }] },
      { 'X-Rollbar-Replay-Id': replayId },
    ]);
    expect(tracing.exporter.post.secondCall.args).to.deep.equal([
      { resourceSpans: [{ spanData: 'test' }] },
      { 'X-Rollbar-Replay-Id': replayId },
    ]);
    expect(replayManager._scheduledCapture._pending.has(replayId)).to.be.false;
  });

  it('does not schedule leading when trailing export throws', async function () {
    setPreviousBuffer(recorder, []);
    setCurrentBuffer(recorder, []);

    const replayId = 'test-replay-id';
    const occurrenceUuid = 'test-uuid';
    const triggerContext = { type: 'occurrence', level: 'error' };

    replayManager.capture(replayId, occurrenceUuid, triggerContext);
    const trigger = replayManager._predicates.triggers[0];
    await clock.tickAsync(100);

    expect(replayManager._map.has(replayId)).to.be.false;
    expect(replayManager._scheduledCapture._pending.has(replayId)).to.be.false;
  });

  it('cleanup: discard cancels timer; success clears state', async function () {
    setPreviousBuffer(recorder, [
      { timestamp: 1000, type: EventType.Meta, data: {} },
    ]);
    setCurrentBuffer(recorder, [
      { timestamp: 2000, type: EventType.Meta, data: {} },
    ]);

    const replayId1 = 'test-replay-id-1';
    const occurrenceUuid1 = 'test-uuid-1';
    const triggerContext = { type: 'occurrence', level: 'error' };

    replayManager.capture(replayId1, occurrenceUuid1, triggerContext);
    const trigger = replayManager._predicates.triggers[0];
    await clock.tickAsync(100);

    expect(replayManager._scheduledCapture._pending.has(replayId1)).to.be.true;

    replayManager.discard(replayId1);
    await clock.tickAsync(10000);

    sinon.assert.notCalled(tracing.exporter.post);

    const replayId2 = 'test-replay-id-2';
    const occurrenceUuid2 = 'test-uuid-2';

    setPreviousBuffer(recorder, [
      { timestamp: 5000, type: EventType.Meta, data: {} },
    ]);
    setCurrentBuffer(recorder, [
      { timestamp: 6000, type: EventType.Meta, data: {} },
    ]);

    replayManager.capture(replayId2, occurrenceUuid2, triggerContext);
    await clock.tickAsync(100);

    currentBuffer(recorder).push({
      timestamp: 7000,
      type: EventType.IncrementalSnapshot,
      data: {},
    });

    await replayManager.send(replayId2);
    await clock.tickAsync(5000);

    sinon.assert.calledTwice(tracing.exporter.post);
    expect(tracing.exporter.post.secondCall.args).to.deep.equal([
      { resourceSpans: [{ spanData: 'test' }] },
      { 'X-Rollbar-Replay-Id': replayId2 },
    ]);
    expect(replayManager._scheduledCapture._pending.has(replayId2)).to.be.false;
    expect(replayManager._trailingStatus.has(replayId2)).to.be.false;
  });
});
