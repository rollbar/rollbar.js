/**
 * Integration tests for ReplayManager with API
 */

import { expect } from 'chai';
import sinon from 'sinon';
import { record as rrwebRecordFn } from '@rrweb/record';

import ReplayManager from '../../../src/browser/replay/replayManager.js';
import Recorder from '../../../src/browser/replay/recorder.js';
import Tracing from '../../../src/tracing/tracing.js';
import Api from '../../../src/api.js';
import mockRecordFn from '../util/mockRecordFn.js';

const options = {
  enabled: true,
  replay: {
    enabled: true,
    emitEveryNms: 100,
    triggers: [
      {
        type: 'occurrence',
      },
    ],
    recordFn: mockRecordFn,
  },
};

describe('ReplayManager API Integration', function () {
  let tracing;
  let recorder;
  let api;
  let transport;
  let replayManager;

  beforeEach(function () {
    transport = {
      post: sinon
        .stub()
        .callsFake(({ accessToken, options, payload, callback }) => {
          setTimeout(() => {
            callback(
              null,
              { err: 0, result: { id: '12345' } },
              { 'Rollbar-Replay-Enabled': 'true' },
            );
          }, 10);
        }),
      postJsonPayload: sinon.stub(),
    };

    const urlMock = { parse: sinon.stub().returns({}) };
    const truncationMock = {
      truncate: sinon.stub().returns({ error: null, value: '{}' }),
    };

    api = new Api(
      { accessToken: 'test-token' },
      transport,
      urlMock,
      truncationMock,
    );

    tracing = new Tracing(window, api, options);
    tracing.initSession();

    const mockPayload = [{ id: 'span1', name: 'recording-span' }];

    replayManager = new ReplayManager({
      tracing,
      options: options.replay,
    });
    recorder = replayManager.recorder;
    sinon.stub(recorder, 'exportRecordingSpan');
    sinon.stub(tracing.exporter, 'toPayload').returns(mockPayload);

    recorder.start();
  });

  afterEach(function () {
    if (recorder) {
      recorder.stop();
    }
    sinon.restore();
  });

  it('should add replay data to map', function () {
    const uuid = 'test-uuid';
    const trigger = options.replay.triggers[0];
    const triggerContext = { type: 'occurrence', level: 'error' };

    const replayId = replayManager.capture(null, uuid, triggerContext);

    expect(replayId).to.be.a('string');
    expect(replayId.length).to.equal(16); // 8 bytes as hex = 16 characters

    expect(recorder.exportRecordingSpan.calledOnce).to.be.true;
    expect(
      recorder.exportRecordingSpan.calledWith(tracing, {
        'rollbar.replay.id': replayId,
        'rollbar.occurrence.uuid': uuid,
        'rollbar.replay.trigger.type': trigger.type,
        'rollbar.replay.trigger.context': JSON.stringify(triggerContext),
        'rollbar.replay.trigger': JSON.stringify(trigger),
        'rollbar.replay.url.full': 'http://localhost:8000/?********',
      }),
    ).to.be.true;
    expect(tracing.exporter.toPayload.calledOnce).to.be.true;

    const payload = replayManager.getSpans(replayId);
    expect(payload).to.not.be.null;
    expect(payload).to.be.an('array');
    expect(payload[0]).to.have.property('name', 'recording-span');
  });

  it('should successfully send replay to API', async function () {
    const postSpansSpy = sinon.spy(tracing.exporter, 'post');

    const replayId = 'test-replay-id';
    const mockPayload = [{ id: 'test-span', name: 'recording-span' }];
    const expectedHeaders = {
      'X-Rollbar-Replay-Id': replayId,
    };
    replayManager.setSpans(replayId, mockPayload);

    await replayManager.send(replayId);

    expect(postSpansSpy.calledOnce).to.be.true;
    expect(postSpansSpy.calledWith(mockPayload, expectedHeaders)).to.be.true;

    expect(replayManager.getSpans(replayId)).to.be.null;
  });

  it('should throw API errors during send', async function () {
    const apiError = new Error('API failure');
    sinon.stub(tracing.exporter, 'post').rejects(apiError);

    const replayId = 'error-replay-id';
    const mockPayload = [{ id: 'test-span', name: 'recording-span' }];
    replayManager.setSpans(replayId, mockPayload);

    let error;
    try {
      await replayManager.send(replayId);
    } catch (e) {
      error = e;
    }

    expect(error).to.equal(apiError);
    expect(replayManager.getSpans(replayId)).to.be.null;
  });

  it('should discard replay without sending', function () {
    const postSpansSpy = sinon.spy(tracing.exporter, 'post');

    const replayId = 'discard-replay-id';
    const mockPayload = [{ id: 'test-span', name: 'recording-span' }];
    replayManager.setSpans(replayId, mockPayload);

    const result = replayManager.discard(replayId);

    expect(result).to.be.true;
    expect(postSpansSpy.called).to.be.false;

    expect(replayManager.getSpans(replayId)).to.be.null;
  });

  it('should generate unique replay IDs', function () {
    const replayIds = new Set();
    const triggerContext = { type: 'occurrence', level: 'error' };

    sinon.stub(replayManager, '_exportSpansAndAddTracingPayload').resolves();

    for (let i = 0; i < 100; i++) {
      const replayId = replayManager.capture(null, null, triggerContext);
      expect(replayIds.has(replayId)).to.be.false;
      replayIds.add(replayId);
    }

    expect(replayIds.size).to.equal(100);
  });

  describe('sendOrDiscardReplay integration', function () {
    it('should send replay when API response is successful', async function () {
      const replayId = 'integration-test-replay';
      const mockPayload = [{ id: 'test-span', name: 'recording-span' }];
      replayManager.setSpans(replayId, mockPayload);

      const postSpansSpy = sinon.spy(tracing.exporter, 'post');

      await replayManager.sendOrDiscardReplay(
        replayId,
        null,
        { err: 0 },
        {
          'Rollbar-Replay-Enabled': 'true',
          'Rollbar-Replay-RateLimit-Remaining': '10',
        },
      );

      expect(postSpansSpy.calledOnce).to.be.true;
      expect(
        postSpansSpy.calledWith(mockPayload, {
          'X-Rollbar-Replay-Id': replayId,
        }),
      ).to.be.true;
      expect(replayManager.getSpans(replayId)).to.be.null;
    });

    it('should discard replay when API returns error', async function () {
      const replayId = 'integration-test-discard';
      const mockPayload = [{ id: 'test-span', name: 'recording-span' }];
      replayManager.setSpans(replayId, mockPayload);

      const postSpansSpy = sinon.spy(tracing.exporter, 'post');

      await replayManager.sendOrDiscardReplay(
        replayId,
        null,
        { err: 1, message: 'API Error' },
        { 'Rollbar-Replay-Enabled': 'true' },
      );

      expect(postSpansSpy.called).to.be.false;
      expect(replayManager.getSpans(replayId)).to.be.null;
    });

    it('should discard replay when Rollbar-Replay-Enabled is false', async function () {
      const replayId = 'integration-test-disabled';
      const mockPayload = [{ id: 'test-span', name: 'recording-span' }];
      replayManager.setSpans(replayId, mockPayload);

      const postSpansSpy = sinon.spy(tracing.exporter, 'post');

      await replayManager.sendOrDiscardReplay(
        replayId,
        null,
        { err: 0 },
        { 'Rollbar-Replay-Enabled': 'false' },
      );

      expect(postSpansSpy.called).to.be.false;
      expect(replayManager.getSpans(replayId)).to.be.null;
    });
  });
});
