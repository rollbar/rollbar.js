import { expect } from 'chai';
import sinon from 'sinon';

import logger from '../../../src/logger.js';
import Replay from '../../../src/browser/replay/replay.js';
import mockRecordFn from '../util/mockRecordFn.js';

describe('Replay - Buffer Index Checkout Resilience', function () {
  let options, replay, recorder, api, tracing, telemeter, clock;

  before(function () {
    logger.init({ logLevel: 'debug' });
  });

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
      addSpanTransform() {},
    };

    telemeter = { exportTelemetrySpan: sinon.stub() };

    options = {
      replay: {
        enabled: true,
        autoStart: true,
        emitEveryNms: 100,
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
      },
    };
  });

  afterEach(function () {
    if (recorder?.isRecording) recorder.stop();
    clock.restore();
  });

  it('captures leading with no checkouts', async function () {
    replay = new Replay({
      tracing,
      telemeter,
      options: options.replay,
    });
    recorder = replay.recorder;

    sinon.spy(recorder, 'exportRecordingSpan');

    recorder.start();
    await clock.tickAsync(200);

    const triggerContext = { type: 'occurrence' };
    const replayId = replay.capture(
      'test-replay-id',
      'test-uuid',
      triggerContext,
    );
    const trigger = replay._predicates.triggers[0];
    await clock.tickAsync(100);

    const capturer = replay._scheduledCapture;
    const cursor = capturer._pending.get(replayId).cursor;
    expect(cursor).to.be.an('object');
    expect(cursor.slot).to.equal(0);

    await clock.tickAsync(1000);

    await replay.send(replayId);
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
        'rollbar.replay.url.full': 'http://localhost:8000/?********',
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
    expect(capturer._pending.size).to.equal(0);

    recorder.exportRecordingSpan.restore();
  });

  it('captures leading across a single checkout', async function () {
    replay = new Replay({
      tracing,
      telemeter,
      options: options.replay,
    });
    recorder = replay.recorder;

    sinon.spy(recorder, 'exportRecordingSpan');

    recorder.start();
    await clock.tickAsync(200);

    const triggerContext = { type: 'occurrence' };
    const replayId = replay.capture(
      'test-replay-id',
      'test-uuid',
      triggerContext,
    );
    const trigger = replay._predicates.triggers[0];

    await clock.tickAsync(1000);

    await replay.send(replayId);
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
        'rollbar.replay.url.full': 'http://localhost:8000/?********',
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
    expect(replay._scheduledCapture._pending.size).to.equal(0);

    recorder.exportRecordingSpan.restore();
  });

  it('sends exactly ceil(postDuration / checkoutInterval) leading chunks covering the window', async function () {
    const preDuration = 4; // seconds -> checkoutEveryNms = 2000
    const postDuration = 5; // seconds -> expect leading chunks at 2s,4s,5s = 3

    const replay = new Replay({
      tracing,
      telemeter,
      options: {
        ...options.replay,
        triggerDefaults: { preDuration, postDuration },
      },
    });

    const recorder = replay.recorder;

    sinon.spy(recorder, 'exportRecordingSpan');

    recorder.start();
    await clock.tickAsync(200);

    const triggerContext = { type: 'occurrence' };
    const replayId = replay.capture(
      'test-replay-id',
      'test-uuid',
      triggerContext,
    );

    await clock.tickAsync(100);

    const chunkMs = recorder.checkoutEveryNms();
    expect(chunkMs).to.equal((preDuration * 1000) / 2);

    const expectedLeadingChunks =
      replay._scheduledCapture.constructor.name === 'ScheduledCapture'
        ? 1
        : Math.ceil((postDuration * 1000) / chunkMs);

    await replay.send(replayId);
    await clock.tickAsync(postDuration * 1000 + 1);

    const calls = tracing.exporter.post.getCalls();
    expect(calls).to.have.lengthOf(
      1 + expectedLeadingChunks,
      'total POST count (trailing + leading)',
    );

    calls.forEach((c) => {
      expect(c.args[1]).to.deep.equal({ 'X-Rollbar-Replay-Id': replayId });
    });

    sinon.assert.callCount(
      recorder.exportRecordingSpan,
      1 + expectedLeadingChunks,
    );

    expect(replay._scheduledCapture._pending.size).to.equal(0);
    expect(replay._trailingStatus.has(replayId)).to.be.false;

    recorder.exportRecordingSpan.restore();
  });

  it('uses the exact captured cursor after one rotation', async function () {
    replay = new Replay({
      tracing,
      telemeter,
      options: options.replay,
    });
    recorder = replay.recorder;
    replay.configure({
      ...options.replay,
      triggerDefaults: {
        preDuration: 4, // 2s checkout
        postDuration: 5, // chunks at 2s, 4s, 6s, but should total 5s
      },
    });

    sinon.spy(recorder, 'exportRecordingSpan');

    recorder.start();
    await clock.tickAsync(200);

    const triggerContext = { type: 'occurrence' };
    const replayId = replay.capture(
      'test-replay-id',
      'test-uuid',
      triggerContext,
    );
    const trigger = replay._predicates.triggers[0];
    await clock.tickAsync(100);

    const capturer = replay._scheduledCapture;
    const cursor = capturer._pending.get(replayId).cursor;
    expect(cursor).to.deep.equal({ slot: 0, offset: 5 });

    await clock.tickAsync(2000);

    await replay.send(replayId);
    await clock.tickAsync(5000);

    expect(recorder.exportRecordingSpan.callCount).to.be.within(2, 4);
    expect(recorder.exportRecordingSpan.firstCall.args).to.deep.equal([
      tracing,
      {
        'rollbar.replay.id': 'test-replay-id',
        'rollbar.occurrence.uuid': 'test-uuid',
        'rollbar.replay.trigger.type': trigger.type,
        'rollbar.replay.trigger.context': JSON.stringify(triggerContext),
        'rollbar.replay.trigger': JSON.stringify(trigger),
        'rollbar.replay.url.full': 'http://localhost:8000/?********',
      },
    ]);

    // Rotating buffer
    const expectedCursors = [
      cursor, // slot 0, offset 5 at capture time
      { slot: 1, offset: 4 },
      { slot: 0, offset: 4 },
    ];

    recorder.exportRecordingSpan
      .getCalls()
      .slice(1)
      .forEach((call, i) => {
        expect(
          call.args,
          `exportRecordingSpan call[${i + 1}] args mismatch`,
        ).to.deep.equal([
          tracing,
          {
            'rollbar.replay.id': 'test-replay-id',
            'rollbar.occurrence.uuid': 'test-uuid',
          },
          expectedCursors[i],
        ]);
      });

    expect(tracing.exporter.post.callCount).to.be.within(2, 4);

    tracing.exporter.post
      .getCalls()
      .slice(1)
      .forEach((call) => {
        expect(call.args).to.deep.equal([
          { resourceSpans: [{ spanData: 'test' }] },
          { 'X-Rollbar-Replay-Id': replayId },
        ]);
      });

    expect(capturer._pending.size).to.equal(0);

    recorder.exportRecordingSpan.restore();
  });

  it('resilience with multiple checkouts (best-effort still sends)', async function () {
    replay = new Replay({
      tracing,
      telemeter,
      options: options.replay,
    });
    recorder = replay.recorder;
    replay.configure({
      ...options.replay,
      autoStart: false,
      triggerDefaults: {
        preDuration: 2,
        postDuration: 5,
      },
    });

    recorder.start();
    await clock.tickAsync(200);

    const triggerContext = { type: 'occurrence' };
    const replayId = replay.capture(
      'test-replay-id',
      'test-uuid',
      triggerContext,
    );
    const trigger = replay._predicates.triggers[0];
    expect(trigger).to.be.an('object');
    await clock.tickAsync(100);

    await clock.tickAsync(2000);

    await replay.send(replayId);
    await clock.tickAsync(5000);

    const posts = tracing.exporter.post.getCalls();
    expect(posts.length).to.be.greaterThan(1);
    expect(posts.every((c) => c.args[1]['X-Rollbar-Replay-Id'] === replayId)).to
      .be.true;
    expect(replay._scheduledCapture._pending.size).to.equal(0);
  });

  it('collects events strictly after the cursor', async function () {
    replay = new Replay({
      tracing,
      telemeter,
      options: options.replay,
    });
    recorder = replay.recorder;
    replay.configure({
      ...options.replay,
      autoStart: false,
      triggerDefaults: {
        preDuration: 4,
        postDuration: 5,
      },
    });

    recorder.start();
    await clock.tickAsync(200);

    const triggerContext = { type: 'occurrence' };
    const replayId = replay.capture(
      'test-replay-id',
      'test-uuid',
      triggerContext,
    );
    await clock.tickAsync(100);

    const capturer = replay._scheduledCapture;
    const cursor = capturer._pending.get(replayId).cursor;

    sinon.spy(recorder, '_collectEventsFromCursor');

    await clock.tickAsync(3500);

    await replay.send(replayId);
    await clock.tickAsync(5000);

    const calls = recorder._collectEventsFromCursor.getCalls();
    expect(calls.length).to.be.greaterThan(0);
    expect(calls[0].args[0]).to.deep.equal(cursor);
    // Prove monotonic advancement (no regress)
    for (let i = 1; i < calls.length; i++) {
      const prev = calls[i - 1].args[0];
      const cur = calls[i].args[0];
      expect(cur.slot !== prev.slot || cur.offset >= prev.offset).to.be.true;
    }

    expect(capturer._pending.size).to.equal(0);

    recorder._collectEventsFromCursor.restore();
  });

  it('no leading scheduled when trailing export throws', async function () {
    replay = new Replay({
      tracing,
      telemeter,
      options: options.replay,
    });
    recorder = replay.recorder;
    replay.configure({
      ...options.replay,
      autoStart: false,
      triggerDefaults: {
        preDuration: 4,
        postDuration: 5,
      },
      recordFn: () => () => {},
    });

    recorder._isReady = true;
    recorder._stopFn = () => {};

    sinon.spy(logger, 'debug');

    const triggerContext = { type: 'occurrence' };
    const replayId = replay.capture(
      'test-replay-id',
      'test-uuid',
      triggerContext,
    );
    await clock.tickAsync(100);

    sinon.assert.calledOnce(logger.debug);
    expect(logger.debug.firstCall.args[0]).to.be.a('string');
    expect(logger.debug.firstCall.args[1]).to.be.instanceOf(Error);
    expect(logger.debug.firstCall.args[1].message).to.equal(
      'Replay recording has no events',
    );

    expect(replay._map.has(replayId)).to.be.false;
    expect(replay._scheduledCapture._pending.has(replayId)).to.be.false;
    sinon.assert.notCalled(api.postSpans);

    logger.debug.restore();
  });

  it('leading post error is handled and state is cleaned', async function () {
    replay = new Replay({
      tracing,
      telemeter,
      options: options.replay,
    });
    recorder = replay.recorder;
    replay.configure({
      ...options.replay,
      autoStart: false,
      triggerDefaults: {
        preDuration: 4,
        postDuration: 5,
      },
    });

    tracing.exporter.post.onFirstCall().resolves();
    tracing.exporter.post.onSecondCall().rejects(new Error('Network error'));

    recorder.start();
    await clock.tickAsync(200);

    const triggerContext = { type: 'occurrence' };
    const replayId = replay.capture(
      'test-replay-id',
      'test-uuid',
      triggerContext,
    );

    await clock.tickAsync(1000);

    await replay.send(replayId);
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
    expect(replay._scheduledCapture._pending.has(replayId)).to.be.false;
  });

  it('discard cancels timer; success clears state', async function () {
    replay = new Replay({
      tracing,
      telemeter,
      options: options.replay,
    });
    recorder = replay.recorder;
    replay.configure({
      ...options.replay,
      autoStart: false,
      triggerDefaults: {
        preDuration: 4,
        postDuration: 5,
      },
    });

    recorder.start();
    await clock.tickAsync(200);

    const replayId1 = 'test-replay-id-1';
    const triggerContext = { type: 'occurrence' };
    replay.capture(replayId1, 'test-uuid-1', triggerContext);
    await clock.tickAsync(100);

    expect(replay._scheduledCapture._pending.has(replayId1)).to.be.true;

    replay.discard(replayId1);
    await clock.tickAsync(10000);

    sinon.assert.notCalled(tracing.exporter.post);

    const replayId2 = 'test-replay-id-2';
    replay.capture(replayId2, 'test-uuid-2', triggerContext);
    await clock.tickAsync(100);

    await replay.send(replayId2);
    await clock.tickAsync(5000);

    sinon.assert.called(tracing.exporter.post);
    expect(tracing.exporter.post.secondCall.args).to.deep.equal([
      { resourceSpans: [{ spanData: 'test' }] },
      { 'X-Rollbar-Replay-Id': replayId2 },
    ]);
    expect(replay._scheduledCapture._pending.has(replayId2)).to.be.false;
    expect(replay._trailingStatus.has(replayId2)).to.be.false;
  });
});
