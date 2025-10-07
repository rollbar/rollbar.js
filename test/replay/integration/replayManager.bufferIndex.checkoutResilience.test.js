import { expect } from 'chai';
import sinon from 'sinon';

import ReplayManager from '../../../src/browser/replay/replayManager.js';
import mockRecordFn from '../util/mockRecordFn.js';
import logger from '../../../src/logger.js';

describe('ReplayManager – Buffer Index Checkout Resilience', function () {
  let options, replayManager, recorder, api, tracing, telemeter, clock;

  beforeEach(function () {
    clock = sinon.useFakeTimers();
    api = { postSpans: sinon.stub().resolves() };
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
        post: sinon.stub(),
      },
      session: { attributes: {} },
    };
    telemeter = { exportTelemetrySpan: sinon.stub() };
    options = {
      replay: {
        enabled: true,
        autoStart: true,
        maxSeconds: 10,
        postDuration: 5,
        emitEveryNms: 100,
        triggers: [
          {
            type: 'occurrence',
          },
        ],
        recordFn: mockRecordFn,
      },
    };
  });

  afterEach(function () {
    if (recorder?.isRecording) recorder.stop();
    clock.restore();
  });

  it('captures leading with no checkouts', async function () {
    replayManager = new ReplayManager({
      tracing,
      telemeter,
      options: options.replay,
    });
    recorder = replayManager.recorder;

    sinon.spy(recorder, 'exportRecordingSpan');

    recorder.start();
    await clock.tickAsync(200);

    const triggerContext = { type: 'occurrence' };
    const trigger = options.replay.triggers[0];
    const replayId = replayManager.capture(
      'test-replay-id',
      'test-uuid',
      triggerContext,
    );
    await clock.tickAsync(100);

    const cursor = replayManager._pendingLeading.get(replayId).bufferCursor;
    expect(cursor).to.be.an('object');
    expect(cursor.slot).to.equal(0);

    await clock.tickAsync(1000);

    await replayManager.send(replayId);
    await clock.tickAsync(5000);

    sinon.assert.calledTwice(recorder.exportRecordingSpan);
    expect(recorder.exportRecordingSpan.firstCall.args).to.deep.equal([
      tracing,
      {
        'rollbar.replay.id': 'test-replay-id',
        'rollbar.occurrence.uuid': 'test-uuid',
        'rollbar.replay.trigger.type': trigger.type,
        'rollbar.replay.trigger.context': JSON.stringify(triggerContext),
        'rollbar.replay.trigger': JSON.stringify(trigger),
      },
    ]);
    expect(recorder.exportRecordingSpan.secondCall.args).to.deep.equal([
      tracing,
      {
        'rollbar.replay.id': 'test-replay-id',
        'rollbar.occurrence.uuid': 'test-uuid',
      },
      { slot: 0, offset: 5 },
    ]);

    sinon.assert.calledTwice(tracing.exporter.post);
    expect(tracing.exporter.post.secondCall.args).to.deep.equal([
      { resourceSpans: [{ spanData: 'test' }] },
      { 'X-Rollbar-Replay-Id': replayId },
    ]);
    expect(replayManager._pendingLeading.size).to.equal(0);

    recorder.exportRecordingSpan.restore();
  });

  it('captures leading across a single checkout', async function () {
    replayManager = new ReplayManager({
      tracing,
      telemeter,
      options: options.replay,
    });
    recorder = replayManager.recorder;

    sinon.spy(recorder, 'exportRecordingSpan');

    recorder.start();
    await clock.tickAsync(200);

    const triggerContext = { type: 'occurrence' };
    const trigger = options.replay.triggers[0];
    const replayId = replayManager.capture(
      'test-replay-id',
      'test-uuid',
      trigger,
      triggerContext,
    );

    await clock.tickAsync(1000);

    await replayManager.send(replayId);
    await clock.tickAsync(5000);

    sinon.assert.calledTwice(recorder.exportRecordingSpan);
    expect(recorder.exportRecordingSpan.firstCall.args).to.deep.equal([
      tracing,
      {
        'rollbar.replay.id': 'test-replay-id',
        'rollbar.occurrence.uuid': 'test-uuid',
        'rollbar.replay.trigger.type': trigger.type,
        'rollbar.replay.trigger.context': JSON.stringify(triggerContext),
        'rollbar.replay.trigger': JSON.stringify(trigger),
      },
    ]);
    expect(recorder.exportRecordingSpan.secondCall.args).to.deep.equal([
      tracing,
      {
        'rollbar.replay.id': 'test-replay-id',
        'rollbar.occurrence.uuid': 'test-uuid',
      },
      { slot: 0, offset: 5 },
    ]);

    sinon.assert.calledTwice(tracing.exporter.post);
    expect(tracing.exporter.post.secondCall.args).to.deep.equal([
      { resourceSpans: [{ spanData: 'test' }] },
      { 'X-Rollbar-Replay-Id': replayId },
    ]);
    expect(replayManager._pendingLeading.size).to.equal(0);

    recorder.exportRecordingSpan.restore();
  });

  it('uses the exact captured cursor after one rotation', async function () {
    replayManager = new ReplayManager({
      tracing,
      telemeter,
      options: options.replay,
    });
    recorder = replayManager.recorder;
    recorder.configure({ ...options.replay, autoStart: false, maxSeconds: 4 });

    sinon.spy(recorder, 'exportRecordingSpan');

    recorder.start();
    await clock.tickAsync(200);

    const triggerContext = { type: 'occurrence' };
    const trigger = options.replay.triggers[0];
    const replayId = replayManager.capture(
      'test-replay-id',
      'test-uuid',
      trigger,
      triggerContext,
    );
    await clock.tickAsync(100);

    const cursor = replayManager._pendingLeading.get(replayId).bufferCursor;
    expect(cursor).to.be.an('object');

    await clock.tickAsync(2000);

    await replayManager.send(replayId);
    await clock.tickAsync(5000);

    sinon.assert.calledTwice(recorder.exportRecordingSpan);
    expect(recorder.exportRecordingSpan.firstCall.args).to.deep.equal([
      tracing,
      {
        'rollbar.replay.id': 'test-replay-id',
        'rollbar.occurrence.uuid': 'test-uuid',
        'rollbar.replay.trigger.type': trigger.type,
        'rollbar.replay.trigger.context': JSON.stringify(triggerContext),
        'rollbar.replay.trigger': JSON.stringify(trigger),
      },
    ]);
    expect(recorder.exportRecordingSpan.secondCall.args).to.deep.equal([
      tracing,
      {
        'rollbar.replay.id': 'test-replay-id',
        'rollbar.occurrence.uuid': 'test-uuid',
      },
      cursor,
    ]);

    sinon.assert.calledTwice(tracing.exporter.post);
    expect(tracing.exporter.post.secondCall.args).to.deep.equal([
      { resourceSpans: [{ spanData: 'test' }] },
      { 'X-Rollbar-Replay-Id': replayId },
    ]);
    expect(replayManager._pendingLeading.size).to.equal(0);

    recorder.exportRecordingSpan.restore();
  });

  it('resilience with multiple checkouts (best-effort still sends)', async function () {
    replayManager = new ReplayManager({
      tracing,
      telemeter,
      options: options.replay,
    });
    recorder = replayManager.recorder;
    recorder.configure({ ...options.replay, autoStart: false, maxSeconds: 2 });

    recorder.start();
    await clock.tickAsync(200);

    const triggerContext = { type: 'occurrence' };
    const trigger = options.replay.triggers[0];
    const replayId = replayManager.capture(
      'test-replay-id',
      'test-uuid',
      trigger,
      triggerContext,
    );
    await clock.tickAsync(100);

    await clock.tickAsync(2000);

    await replayManager.send(replayId);
    await clock.tickAsync(5000);

    sinon.assert.calledTwice(tracing.exporter.post);
    expect(tracing.exporter.post.secondCall.args).to.deep.equal([
      { resourceSpans: [{ spanData: 'test' }] },
      { 'X-Rollbar-Replay-Id': replayId },
    ]);
    expect(replayManager._pendingLeading.size).to.equal(0);
  });

  it('collects events strictly after the cursor', async function () {
    replayManager = new ReplayManager({
      tracing,
      telemeter,
      options: options.replay,
    });
    recorder = replayManager.recorder;
    recorder.configure({ ...options.replay, autoStart: false, maxSeconds: 4 });

    recorder.start();
    await clock.tickAsync(200);

    const triggerContext = { type: 'occurrence' };
    const trigger = options.replay.triggers[0];
    const replayId = replayManager.capture(
      'test-replay-id',
      'test-uuid',
      trigger,
      triggerContext,
    );
    await clock.tickAsync(100);

    const cursor = replayManager._pendingLeading.get(replayId).bufferCursor;

    sinon.spy(recorder, '_collectEventsFromCursor');

    await clock.tickAsync(3500);

    await replayManager.send(replayId);
    await clock.tickAsync(5000);

    sinon.assert.calledOnce(recorder._collectEventsFromCursor);
    expect(recorder._collectEventsFromCursor.firstCall.args).to.deep.equal([
      cursor,
    ]);

    const returnedEvents =
      recorder._collectEventsFromCursor.firstCall.returnValue;
    expect(returnedEvents).to.have.lengthOf(10);

    sinon.assert.calledTwice(tracing.exporter.post);
    expect(tracing.exporter.post.secondCall.args).to.deep.equal([
      { resourceSpans: [{ spanData: 'test' }] },
      { 'X-Rollbar-Replay-Id': replayId },
    ]);
    expect(replayManager._pendingLeading.size).to.equal(0);

    recorder._collectEventsFromCursor.restore();
  });

  it('no leading scheduled when trailing export throws', async function () {
    replayManager = new ReplayManager({
      tracing,
      telemeter,
      options: options.replay,
    });
    recorder = replayManager.recorder;
    recorder.configure({
      ...options.replay,
      autoStart: false,
      maxSeconds: 4,
      recordFn: () => () => {},
    });

    recorder._isReady = true;
    recorder._stopFn = () => {};

    sinon.spy(logger, 'error');

    const triggerContext = { type: 'occurrence' };
    const trigger = options.replay.triggers[0];
    const replayId = replayManager.capture(
      'test-replay-id',
      'test-uuid',
      trigger,
      triggerContext,
    );
    await clock.tickAsync(100);

    sinon.assert.calledOnce(logger.error);
    expect(logger.error.firstCall.args[0]).to.be.a('string');
    expect(logger.error.firstCall.args[1]).to.be.instanceOf(Error);
    expect(logger.error.firstCall.args[1].message).to.equal(
      'Replay recording has no events',
    );

    expect(replayManager._map.has(replayId)).to.be.false;
    expect(replayManager._pendingLeading.has(replayId)).to.be.false;
    sinon.assert.notCalled(api.postSpans);

    logger.error.restore();
  });

  it('leading post error is handled and state is cleaned', async function () {
    replayManager = new ReplayManager({
      tracing,
      telemeter,
      options: options.replay,
    });
    recorder = replayManager.recorder;
    recorder.configure({ ...options.replay, autoStart: false, maxSeconds: 4 });

    tracing.exporter.post.onFirstCall().resolves();
    tracing.exporter.post.onSecondCall().rejects(new Error('Network error'));

    recorder.start();
    await clock.tickAsync(200);

    const triggerContext = { type: 'occurrence' };
    const trigger = options.replay.triggers[0];
    const replayId = replayManager.capture(
      'test-replay-id',
      'test-uuid',
      trigger,
      triggerContext,
    );

    await clock.tickAsync(1000);

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
    expect(replayManager._pendingLeading.has(replayId)).to.be.false;
  });

  it('discard cancels timer; success clears state', async function () {
    replayManager = new ReplayManager({
      tracing,
      telemeter,
      options: options.replay,
    });
    recorder = replayManager.recorder;
    recorder.configure({ ...options.replay, autoStart: false, maxSeconds: 4 });

    recorder.start();
    await clock.tickAsync(200);

    const replayId1 = 'test-replay-id-1';
    const triggerContext = { type: 'occurrence' };
    const trigger = options.replay.triggers[0];
    replayManager.capture(replayId1, 'test-uuid-1', trigger, triggerContext);
    await clock.tickAsync(100);

    expect(replayManager._pendingLeading.has(replayId1)).to.be.true;

    replayManager.discard(replayId1);
    await clock.tickAsync(10000);

    sinon.assert.notCalled(tracing.exporter.post);

    const replayId2 = 'test-replay-id-2';
    replayManager.capture(replayId2, 'test-uuid-2', trigger, triggerContext);
    await clock.tickAsync(100);

    await replayManager.send(replayId2);
    await clock.tickAsync(5000);

    sinon.assert.calledTwice(tracing.exporter.post);
    expect(tracing.exporter.post.secondCall.args).to.deep.equal([
      { resourceSpans: [{ spanData: 'test' }] },
      { 'X-Rollbar-Replay-Id': replayId2 },
    ]);
    expect(replayManager._pendingLeading.has(replayId2)).to.be.false;
    expect(replayManager._trailingStatus.has(replayId2)).to.be.false;
  });
});
