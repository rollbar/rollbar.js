/**
 * Integration tests for ReplayManager with API
 */

import { expect } from 'chai';
import sinon from 'sinon';

import ReplayManager from '../../../src/browser/replay/replayManager.js';
import Recorder from '../../../src/browser/replay/recorder.js';
import Tracing from '../../../src/tracing/tracing.js';
import Api from '../../../src/api.js';
import mockRecordFn from '../util/mockRecordFn.js';

const options = {
  enabled: true,
  recorder: {
    enabled: true,
    emitEveryNms: 100,
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
        .callsFake(({accessToken, options, payload, callback}) => {
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

    tracing = new Tracing(window, options);
    tracing.initSession();

    const mockPayload = [{ id: 'span1', name: 'recording-span' }];

    api = new Api(
      { accessToken: 'test-token' },
      transport,
      urlMock,
      truncationMock,
    );

    recorder = new Recorder(options.recorder, mockRecordFn);
    sinon.stub(recorder, 'dump').returns(mockPayload);

    replayManager = new ReplayManager({
      recorder,
      api,
      tracing,
    });

    recorder.start();
  });

  afterEach(function () {
    if (recorder) {
      recorder.stop();
    }
    sinon.restore();
  });

  it('should add replay data to map', async function () {
    const uuid = 'test-uuid';
    const replayId = replayManager.add(null, uuid);
    expect(replayId).to.be.a('string');
    expect(replayId.length).to.equal(16); // 8 bytes as hex = 16 characters

    await new Promise((r) => setTimeout(r, 1000));

    expect(recorder.dump.calledOnce).to.be.true;
    expect(recorder.dump.calledWith(tracing, replayId, uuid)).to.be.true;

    const payload = replayManager.getSpans(replayId);
    expect(payload).to.not.be.null;
    expect(payload).to.be.an('array');
    expect(payload[0]).to.have.property('name', 'recording-span');
  });

  it('should successfully send replay to API', async function () {
    const postSpansSpy = sinon.spy(api, 'postSpans');

    const replayId = 'test-replay-id';
    const mockPayload = [{ id: 'test-span', name: 'recording-span' }];
    const expectedHeaders = {
      'X-Rollbar-Replay-Id': replayId,
    };
    replayManager.setSpans(replayId, mockPayload);

    const result = await replayManager.send(replayId);

    expect(result).to.be.true;
    expect(postSpansSpy.calledOnce).to.be.true;
    expect(postSpansSpy.calledWith(mockPayload, expectedHeaders)).to.be.true;

    expect(replayManager.getSpans(replayId)).to.be.null;
  });

  it('should handle API errors during send', async function () {
    const apiError = new Error('API failure');
    sinon.stub(api, 'postSpans').rejects(apiError);

    const consoleSpy = sinon.spy(console, 'error');

    const replayId = 'error-replay-id';
    const mockPayload = [{ id: 'test-span', name: 'recording-span' }];
    replayManager.setSpans(replayId, mockPayload);

    const result = await replayManager.send(replayId);

    expect(result).to.be.false;
    expect(replayManager.getSpans(replayId)).to.be.null;
  });

  it('should discard replay without sending', function () {
    const postSpansSpy = sinon.spy(api, 'postSpans');

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

    sinon.stub(replayManager, '_processReplay').resolves();

    for (let i = 0; i < 100; i++) {
      const replayId = replayManager.add();
      expect(replayIds.has(replayId)).to.be.false;
      replayIds.add(replayId);
    }

    expect(replayIds.size).to.equal(100);
  });
});
