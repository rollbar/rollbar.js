import { expect } from 'chai';
import sinon from 'sinon';
import { EventType } from '@rrweb/types';

import Recorder from '../../../src/browser/replay/recorder.js';
import ReplayManager from '../../../src/browser/replay/replayManager.js';
import {
  currentBuffer,
  setCurrentBuffer,
  setPreviousBuffer,
} from '../util/recorder.js';

describe('ReplayManager buffer-index integration', function () {
  let replayManager, recorder, api, tracing, telemeter, clock;

  beforeEach(function () {
    clock = sinon.useFakeTimers();

    const mockRecordFn = () => () => {};
    recorder = new Recorder(
      {
        enabled: true,
        maxSeconds: 10,
        postDuration: 5,
      },
      mockRecordFn,
    );

    recorder._isReady = true;
    recorder._stopFn = () => {};

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
      recorder,
      api,
      tracing,
      telemeter,
    });

    sinon.spy(recorder, 'exportRecordingSpan');
  });

  afterEach(function () {
    recorder.exportRecordingSpan.restore();
    clock.restore();
  });

  it('calls _sendOrDiscardLeadingReplay after timeout', async function () {
    setPreviousBuffer(recorder, [
      { timestamp: 1000, type: EventType.Meta, data: {} },
    ]);
    setCurrentBuffer(recorder, [
      { timestamp: 2000, type: EventType.Meta, data: {} },
    ]);

    sinon.spy(replayManager, '_sendOrDiscardLeadingReplay');

    const replayId = 'test-replay-id';
    const occurrenceUuid = 'test-uuid';

    replayManager.capture(replayId, occurrenceUuid);
    await clock.tickAsync(100);

    sinon.assert.notCalled(replayManager._sendOrDiscardLeadingReplay);

    await replayManager.send(replayId);
    sinon.assert.calledOnce(replayManager._sendOrDiscardLeadingReplay);

    await clock.tickAsync(5000);

    sinon.assert.calledTwice(replayManager._sendOrDiscardLeadingReplay);
    expect(
      replayManager._sendOrDiscardLeadingReplay.secondCall.args,
    ).to.deep.equal([replayId]);

    replayManager._sendOrDiscardLeadingReplay.restore();
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

    replayManager.capture(replayId, occurrenceUuid);
    await clock.tickAsync(100);

    sinon.assert.calledOnce(recorder.exportRecordingSpan);
    expect(recorder.exportRecordingSpan.firstCall.args).to.deep.equal([
      tracing,
      {
        'rollbar.replay.id': replayId,
        'rollbar.occurrence.uuid': occurrenceUuid,
      },
    ]);

    currentBuffer(recorder).push({
      timestamp: 3000,
      type: EventType.IncrementalSnapshot,
      data: {},
    });

    await replayManager.send(replayId);
    await clock.tickAsync(5000);

    sinon.assert.calledTwice(recorder.exportRecordingSpan);
    expect(recorder.exportRecordingSpan.secondCall.args).to.deep.equal([
      tracing,
      {
        'rollbar.replay.id': replayId,
        'rollbar.occurrence.uuid': occurrenceUuid,
      },
      { slot: 0, offset: 0 },
    ]);

    sinon.assert.calledTwice(api.postSpans);
    expect(api.postSpans.secondCall.args).to.deep.equal([
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

    replayManager.capture(replayId, occurrenceUuid);
    await clock.tickAsync(100);

    const capturedCursor =
      replayManager._pendingLeading.get(replayId).bufferCursor;
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

    sinon.assert.calledTwice(api.postSpans);
    expect(api.postSpans.secondCall.args).to.deep.equal([
      { resourceSpans: [{ spanData: 'test' }] },
      { 'X-Rollbar-Replay-Id': replayId },
    ]);
    expect(replayManager._pendingLeading.has(replayId)).to.be.false;
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

    replayManager.capture(replayId, occurrenceUuid);
    await clock.tickAsync(100);

    replayManager.discard(replayId);
    await clock.tickAsync(5000);

    sinon.assert.notCalled(api.postSpans);
    expect(replayManager._pendingLeading.has(replayId)).to.be.false;
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

    replayManager.capture(replayId, occurrenceUuid);
    await clock.tickAsync(100);

    currentBuffer(recorder).push({
      timestamp: 3000,
      type: EventType.IncrementalSnapshot,
      data: {},
    });

    await clock.tickAsync(5000);

    const pendingContext = replayManager._pendingLeading.get(replayId);
    expect(pendingContext.leadingReady).to.be.true;
    sinon.assert.notCalled(api.postSpans);

    await replayManager.send(replayId);

    sinon.assert.calledTwice(api.postSpans);
  });

  it('cleans up on leading post error', async function () {
    setPreviousBuffer(recorder, [
      { timestamp: 1000, type: EventType.Meta, data: {} },
    ]);
    setCurrentBuffer(recorder, [
      { timestamp: 2000, type: EventType.Meta, data: {} },
    ]);

    api.postSpans.onFirstCall().resolves();
    api.postSpans.onSecondCall().rejects(new Error('Network error'));

    const replayId = 'test-replay-id';
    const occurrenceUuid = 'test-uuid';

    replayManager.capture(replayId, occurrenceUuid);
    await clock.tickAsync(100);

    currentBuffer(recorder).push({
      timestamp: 3000,
      type: EventType.IncrementalSnapshot,
      data: {},
    });

    await replayManager.send(replayId);
    await clock.tickAsync(5000);

    sinon.assert.calledTwice(api.postSpans);
    expect(api.postSpans.firstCall.args).to.deep.equal([
      { resourceSpans: [{ spanData: 'test' }] },
      { 'X-Rollbar-Replay-Id': replayId },
    ]);
    expect(api.postSpans.secondCall.args).to.deep.equal([
      { resourceSpans: [{ spanData: 'test' }] },
      { 'X-Rollbar-Replay-Id': replayId },
    ]);
    expect(replayManager._pendingLeading.has(replayId)).to.be.false;
  });

  it('does not schedule leading when trailing export throws', async function () {
    setPreviousBuffer(recorder, []);
    setCurrentBuffer(recorder, []);

    const replayId = 'test-replay-id';
    const occurrenceUuid = 'test-uuid';

    replayManager.capture(replayId, occurrenceUuid);
    await clock.tickAsync(100);

    expect(replayManager._map.has(replayId)).to.be.false;
    expect(replayManager._pendingLeading.has(replayId)).to.be.false;
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

    replayManager.capture(replayId1, occurrenceUuid1);
    await clock.tickAsync(100);

    expect(replayManager._pendingLeading.has(replayId1)).to.be.true;

    replayManager.discard(replayId1);
    await clock.tickAsync(10000);

    sinon.assert.notCalled(api.postSpans);

    const replayId2 = 'test-replay-id-2';
    const occurrenceUuid2 = 'test-uuid-2';

    setPreviousBuffer(recorder, [
      { timestamp: 5000, type: EventType.Meta, data: {} },
    ]);
    setCurrentBuffer(recorder, [
      { timestamp: 6000, type: EventType.Meta, data: {} },
    ]);

    replayManager.capture(replayId2, occurrenceUuid2);
    await clock.tickAsync(100);

    currentBuffer(recorder).push({
      timestamp: 7000,
      type: EventType.IncrementalSnapshot,
      data: {},
    });

    await replayManager.send(replayId2);
    await clock.tickAsync(5000);

    sinon.assert.calledTwice(api.postSpans);
    expect(api.postSpans.secondCall.args).to.deep.equal([
      { resourceSpans: [{ spanData: 'test' }] },
      { 'X-Rollbar-Replay-Id': replayId2 },
    ]);
    expect(replayManager._pendingLeading.has(replayId2)).to.be.false;
    expect(replayManager._trailingStatus.has(replayId2)).to.be.false;
  });
});
