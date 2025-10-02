import { expect } from 'chai';
import sinon from 'sinon';

import ReplayManager from '../../../src/browser/replay/replayManager.js';
import Recorder from '../../../src/browser/replay/recorder.js';
import mockRecordFn from '../util/mockRecordFn.js';

describe('ReplayManager – Buffer Index Checkout Resilience', function () {
  let replayManager, recorder, api, tracing, telemeter, clock;

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
      },
      session: { attributes: {} },
    };
    telemeter = { exportTelemetrySpan: sinon.stub() };
  });

  afterEach(function () {
    if (recorder?.isRecording) recorder.stop();
    clock.restore();
  });

  it('captures leading with no checkouts', async function () {
    recorder = new Recorder(
      {
        enabled: true,
        autoStart: false,
        maxSeconds: 10,
        postDuration: 5,
        emitEveryNms: 100,
      },
      mockRecordFn,
    );
    replayManager = new ReplayManager({ recorder, api, tracing, telemeter });

    sinon.spy(recorder, 'exportRecordingSpan');

    recorder.start();
    await clock.tickAsync(200);

    const replayId = replayManager.capture('test-replay-id', 'test-uuid');
    await clock.tickAsync(100);

    const cursor = replayManager._pendingLeading.get(replayId).bufferCursor;
    expect(cursor).to.be.an('object');
    expect(cursor.slot).to.equal(0);

    await clock.tickAsync(1000);

    await replayManager.send(replayId);
    await clock.tickAsync(5000);

    const calls = recorder.exportRecordingSpan.getCalls();
    expect(calls).to.have.lengthOf(2);

    const trailingCursor = calls[0].args[2];
    expect(trailingCursor).to.be.undefined;

    const leadingCursor = calls[1].args[2];
    expect(leadingCursor).to.be.an('object');
    expect(leadingCursor).to.have.property('slot', 0);
    expect(leadingCursor).to.have.property('offset', 5);

    expect(api.postSpans.callCount).to.equal(2);
    expect(api.postSpans.secondCall.args[1]).to.deep.equal({
      'X-Rollbar-Replay-Id': replayId,
    });
    expect(replayManager._pendingLeading.size).to.equal(0);

    recorder.exportRecordingSpan.restore();
  });

  it('captures leading across a single checkout', async function () {
    recorder = new Recorder(
      {
        enabled: true,
        autoStart: false,
        maxSeconds: 4,
        postDuration: 5,
        emitEveryNms: 100,
      },
      mockRecordFn,
    );
    replayManager = new ReplayManager({ recorder, api, tracing, telemeter });

    sinon.spy(recorder, 'exportRecordingSpan');

    recorder.start();
    await clock.tickAsync(200);

    const replayId = replayManager.capture('test-replay-id', 'test-uuid');

    await clock.tickAsync(1000);

    await replayManager.send(replayId);
    await clock.tickAsync(5000);

    const calls = recorder.exportRecordingSpan.getCalls();
    expect(calls).to.have.lengthOf(2);

    const trailingCursor = calls[0].args[2];
    expect(trailingCursor).to.be.undefined;

    const leadingCursor = calls[1].args[2];
    expect(leadingCursor).to.be.an('object');
    expect(leadingCursor).to.have.property('slot', 0);
    expect(leadingCursor).to.have.property('offset', 5);

    expect(api.postSpans.callCount).to.equal(2);
    expect(api.postSpans.secondCall.args[1]).to.deep.equal({
      'X-Rollbar-Replay-Id': replayId,
    });
    expect(replayManager._pendingLeading.size).to.equal(0);

    recorder.exportRecordingSpan.restore();
  });

  it('uses the exact captured cursor after one rotation', async function () {
    recorder = new Recorder(
      {
        enabled: true,
        autoStart: false,
        maxSeconds: 4,
        postDuration: 5,
        emitEveryNms: 100,
      },
      mockRecordFn,
    );
    replayManager = new ReplayManager({ recorder, api, tracing, telemeter });

    sinon.spy(recorder, 'exportRecordingSpan');

    recorder.start();
    await clock.tickAsync(200);

    const replayId = replayManager.capture('test-replay-id', 'test-uuid');
    await clock.tickAsync(100);

    const cursor = replayManager._pendingLeading.get(replayId).bufferCursor;
    expect(cursor).to.be.an('object');

    await clock.tickAsync(2000);

    await replayManager.send(replayId);
    await clock.tickAsync(5000);

    const calls = recorder.exportRecordingSpan.getCalls();
    expect(calls).to.have.lengthOf(2);

    const trailingCursor = calls[0].args[2];
    expect(trailingCursor).to.be.undefined;

    const leadingCursor = calls[1].args[2];
    expect(leadingCursor).to.deep.equal(cursor);

    expect(api.postSpans.callCount).to.equal(2);
    expect(api.postSpans.secondCall.args[1]).to.deep.equal({
      'X-Rollbar-Replay-Id': replayId,
    });
    expect(replayManager._pendingLeading.size).to.equal(0);

    recorder.exportRecordingSpan.restore();
  });

  it('resilience with multiple checkouts (best-effort still sends)', async function () {
    recorder = new Recorder(
      {
        enabled: true,
        autoStart: false,
        maxSeconds: 2,
        postDuration: 5,
        emitEveryNms: 100,
      },
      mockRecordFn,
    );
    replayManager = new ReplayManager({ recorder, api, tracing, telemeter });

    recorder.start();
    await clock.tickAsync(200);

    const replayId = replayManager.capture('test-replay-id', 'test-uuid');
    await clock.tickAsync(100);

    await clock.tickAsync(2000);

    await replayManager.send(replayId);
    await clock.tickAsync(5000);

    expect(api.postSpans.callCount).to.equal(2);
    expect(api.postSpans.secondCall.args[1]).to.deep.equal({
      'X-Rollbar-Replay-Id': replayId,
    });
    expect(replayManager._pendingLeading.size).to.equal(0);
  });

  it('collects events strictly after the cursor', async function () {
    recorder = new Recorder(
      {
        enabled: true,
        autoStart: false,
        maxSeconds: 4,
        postDuration: 5,
        emitEveryNms: 100,
      },
      mockRecordFn,
    );
    replayManager = new ReplayManager({ recorder, api, tracing, telemeter });

    recorder.start();
    await clock.tickAsync(200);

    const replayId = replayManager.capture('test-replay-id', 'test-uuid');
    await clock.tickAsync(100);

    const cursor = replayManager._pendingLeading.get(replayId).bufferCursor;

    sinon.spy(recorder, '_collectEventsFromCursor');

    await clock.tickAsync(3500);

    await replayManager.send(replayId);
    await clock.tickAsync(5000);

    expect(recorder._collectEventsFromCursor.callCount).to.equal(1);
    expect(recorder._collectEventsFromCursor.firstCall.args[0]).to.deep.equal(
      cursor,
    );

    const returnedEvents =
      recorder._collectEventsFromCursor.firstCall.returnValue;
    expect(returnedEvents).to.have.lengthOf(10);

    expect(api.postSpans.callCount).to.equal(2);
    expect(api.postSpans.secondCall.args[1]).to.deep.equal({
      'X-Rollbar-Replay-Id': replayId,
    });
    expect(replayManager._pendingLeading.size).to.equal(0);

    recorder._collectEventsFromCursor.restore();
  });

  it('no leading scheduled when trailing export throws', async function () {
    recorder = new Recorder(
      { enabled: true, autoStart: false, maxSeconds: 4, postDuration: 5 },
      () => () => {},
    );
    replayManager = new ReplayManager({ recorder, api, tracing, telemeter });

    recorder._isReady = true;
    recorder._stopFn = () => {};

    const replayId = replayManager.capture('test-replay-id', 'test-uuid');
    await clock.tickAsync(100);

    expect(replayManager._map.has(replayId)).to.be.false;
    expect(replayManager._pendingLeading.has(replayId)).to.be.false;
    expect(api.postSpans.callCount).to.equal(0);
  });

  it('leading post error is handled and state is cleaned', async function () {
    recorder = new Recorder(
      {
        enabled: true,
        autoStart: false,
        maxSeconds: 4,
        postDuration: 5,
        emitEveryNms: 100,
      },
      mockRecordFn,
    );
    replayManager = new ReplayManager({ recorder, api, tracing, telemeter });

    api.postSpans.onFirstCall().resolves();
    api.postSpans.onSecondCall().rejects(new Error('Network error'));

    recorder.start();
    await clock.tickAsync(200);

    const replayId = replayManager.capture('test-replay-id', 'test-uuid');

    await clock.tickAsync(1000);

    await replayManager.send(replayId);
    await clock.tickAsync(5000);

    expect(api.postSpans.callCount).to.equal(2);
    expect(api.postSpans.firstCall.args[1]).to.deep.equal({
      'X-Rollbar-Replay-Id': replayId,
    });
    expect(api.postSpans.secondCall.args[1]).to.deep.equal({
      'X-Rollbar-Replay-Id': replayId,
    });
    expect(replayManager._pendingLeading.has(replayId)).to.be.false;
  });

  it('discard cancels timer; success clears state', async function () {
    recorder = new Recorder(
      {
        enabled: true,
        autoStart: false,
        maxSeconds: 4,
        postDuration: 5,
        emitEveryNms: 100,
      },
      mockRecordFn,
    );
    replayManager = new ReplayManager({ recorder, api, tracing, telemeter });

    recorder.start();
    await clock.tickAsync(200);

    const replayId1 = 'test-replay-id-1';
    replayManager.capture(replayId1, 'test-uuid-1');
    await clock.tickAsync(100);

    expect(replayManager._pendingLeading.has(replayId1)).to.be.true;

    replayManager.discard(replayId1);
    await clock.tickAsync(10000);

    expect(api.postSpans.callCount).to.equal(0);

    const replayId2 = 'test-replay-id-2';
    replayManager.capture(replayId2, 'test-uuid-2');
    await clock.tickAsync(100);

    await replayManager.send(replayId2);
    await clock.tickAsync(5000);

    expect(api.postSpans.callCount).to.equal(2);
    expect(api.postSpans.secondCall.args[1]).to.deep.equal({
      'X-Rollbar-Replay-Id': replayId2,
    });
    expect(replayManager._pendingLeading.has(replayId2)).to.be.false;
    expect(replayManager._trailingStatus.has(replayId2)).to.be.false;
  });
});
