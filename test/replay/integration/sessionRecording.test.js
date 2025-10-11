/**
 * Integration tests for the Recorder and Tracing interaction
 */

import { expect } from 'chai';
import sinon from 'sinon';

import logger from '../../../src/logger.js';
import Tracing from '../../../src/tracing/tracing.js';
import { Context } from '../../../src/tracing/context.js';
import Recorder from '../../../src/browser/replay/recorder.js';
import ReplayManager from '../../../src/browser/replay/replayManager.js';
import replayDefaults from '../../../src/browser/replay/defaults.js';
import mockRecordFn from '../util/mockRecordFn.js';
import Api from '../../../src/api.js';
import Queue from '../../../src/queue.js';
import { createPayloadWithReplayId } from '../../fixtures/replay/index.js';

const options = {
  enabled: true,
  resource: {
    attributes: {
      'service.name': 'unknown_service',
      'telemetry.sdk.language': 'webjs',
      'telemetry.sdk.name': 'rollbar',
      'telemetry.sdk.version': '0.1.0',
    },
  },
  notifier: {
    name: 'rollbar.js',
    version: '0.1.0',
  },
  replay: {
    ...replayDefaults,
    enabled: true,
    autoStart: false,
    emitEveryNms: 100, // non-rrweb, used by mockRecordFn
  },
};

const createMockTransport = () => {
  return {
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
};

const getAttributeValue = (attributes, key) => {
  const attr = attributes.find((attr) => attr.key === key);
  return attr ? attr.value : null;
};

describe('Session Replay Integration', function () {
  let tracing;
  let recorder;

  beforeEach(function () {
    logger.init({ logLevel: 'warn' });

    tracing = new Tracing(window, null, options);
    tracing.initSession();
  });

  afterEach(function () {
    if (recorder) {
      recorder.stop();
    }
    sinon.restore();
  });

  it('dumping recording should export tracing', function (done) {
    recorder = new Recorder(options.replay, mockRecordFn);
    recorder.start();

    const tracingContext = tracing.contextManager.active();
    expect(tracingContext).to.be.instanceOf(Context);

    const dumpRecording = () => {
      const replayId = 'test-replay-id';
      const uuid = 'test-uuid';
      recorder.exportRecordingSpan(tracing, {
        'rollbar.replay.id': replayId,
        'rollbar.occurrence.uuid': uuid,
      });
      const payload = tracing.exporter.toPayload();

      expect(payload).to.not.be.null;
      expect(payload).to.be.an('object');
      expect(payload).to.have.property('resourceSpans');
      expect(payload.resourceSpans).to.be.an('array');
      expect(payload.resourceSpans[0]).to.have.property('scopeSpans');
      expect(payload.resourceSpans[0].scopeSpans[0]).to.have.property('spans');

      const uuidValue = getAttributeValue(
        payload.resourceSpans[0].scopeSpans[0].spans[0].attributes,
        'rollbar.occurrence.uuid',
      );
      expect(uuidValue['stringValue']).to.equal(uuid);

      const events = payload.resourceSpans[0].scopeSpans[0].spans[0].events;
      expect(events.length).to.be.greaterThan(0);
      expect(events.every((e) => e.name === 'rrweb-replay-events')).to.be.true;

      const eventAttrs = events[0].attributes;
      const eventTypeAttr = eventAttrs.find((attr) => attr.key === 'eventType');
      const jsonAttr = eventAttrs.find((attr) => attr.key === 'json');

      expect(eventTypeAttr).to.exist;
      expect(jsonAttr).to.exist;

      done();
    };

    setTimeout(dumpRecording, 1000);
  });

  it('should handle checkouts correctly', function (done) {
    recorder = new Recorder(
      {
        ...options.recorder,
        checkoutEveryNms: 250,
      },
      mockRecordFn,
    );

    recorder.start();

    const dumpRecording = () => {
      const replayId = 'test-replay-id';
      recorder.exportRecordingSpan(tracing, {
        'rollbar.replay.id': replayId,
      });
      const payload = tracing.exporter.toPayload();

      expect(payload).to.not.be.null;
      expect(payload).to.be.an('object');
      expect(payload).to.have.property('resourceSpans');
      expect(payload.resourceSpans).to.be.an('array');
      expect(payload.resourceSpans[0]).to.have.property('scopeSpans');
      expect(payload.resourceSpans[0].scopeSpans[0]).to.have.property('spans');

      const events = payload.resourceSpans[0].scopeSpans[0].spans[0].events;
      expect(events).to.be.an('array');
      expect(events.length).to.be.greaterThan(0);

      done();
    };

    setTimeout(dumpRecording, 1000);
  });

  it('should handle no checkouts correctly', function (done) {
    recorder = new Recorder(
      {
        ...options.recorder,
        checkoutEveryNms: 500,
      },
      mockRecordFn,
    );

    recorder.start();

    const dumpRecording = () => {
      const replayId = 'test-replay-id';
      recorder.exportRecordingSpan(tracing, {
        'rollbar.replay.id': replayId,
      });
      const payload = tracing.exporter.toPayload();

      expect(payload).to.not.be.null;
      expect(payload).to.be.an('object');
      expect(payload).to.have.property('resourceSpans');
      expect(payload.resourceSpans).to.be.an('array');
      expect(payload.resourceSpans[0]).to.have.property('scopeSpans');
      expect(payload.resourceSpans[0].scopeSpans[0]).to.have.property('spans');

      const events = payload.resourceSpans[0].scopeSpans[0].spans[0].events;
      expect(events).to.be.an('array');
      expect(events.length).to.be.greaterThan(0);

      done();
    };

    setTimeout(dumpRecording, 250);
  });
});

describe('Session Replay Transport Integration', function () {
  let tracing;
  let recorder;
  let api;
  let transport;
  let replayManager;
  let queue;

  beforeEach(function () {
    logger.init({ logLevel: 'warn' });

    transport = createMockTransport();
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

    sinon.stub(tracing.exporter, 'toPayload').callsFake(() => {
      return createPayloadWithReplayId('test-replay-id');
    });

    replayManager = new ReplayManager({
      tracing,
      options: options.replay,
    });
    recorder = replayManager.recorder;
    sinon.stub(recorder, 'exportRecordingSpan');

    queue = new Queue(
      { shouldSend: () => ({ shouldSend: true }) },
      api,
      console,
      { transmit: true, retryInterval: 500 },
      replayManager,
    );

    recorder.start();
  });

  afterEach(function () {
    if (recorder) {
      recorder.stop();
    }
    sinon.restore();
  });

  it('should add replayId to error item and send replay on success', function (done) {
    const captureSpy = sinon.spy(replayManager, 'capture');
    const sendSpy = sinon.spy(replayManager, 'send');
    const postSpansSpy = sinon.spy(api, 'postSpans');

    const errorItem = {
      data: {
        body: {
          trace: {
            exception: {
              message: 'Test error for session replay',
            },
          },
        },
      },
      level: 'error',
    };

    queue.addItem(errorItem, (err, resp) => {
      expect(errorItem).to.have.property('replayId');
      expect(captureSpy.calledOnce).to.be.true;

      expect(err).to.be.null;
      expect(resp).to.have.property('err', 0);

      setTimeout(function () {
        expect(sendSpy.calledWith(errorItem.replayId)).to.be.true;
        expect(postSpansSpy.calledOnce).to.be.true;

        done();
      }, 50);
    });
  });

  it('should discard replay when API returns an error', function (done) {
    transport.post = sinon
      .stub()
      .callsFake(({ accessToken, options, payload, callback }) => {
        setTimeout(() => {
          callback(null, { err: 1, message: 'API Error' });
        }, 10);
      });

    const captureSpy = sinon.spy(replayManager, 'capture');
    const sendSpy = sinon.spy(replayManager, 'send');
    const discardSpy = sinon.spy(replayManager, 'discard');

    const errorItem = {
      data: {
        body: {
          trace: {
            exception: {
              message: 'Test error with API failure',
            },
          },
        },
      },
      level: 'error',
    };

    queue.addItem(errorItem, (err, resp) => {
      expect(errorItem).to.have.property('replayId');
      expect(captureSpy.calledOnce).to.be.true;

      setTimeout(function () {
        expect(discardSpy.calledWith(errorItem.replayId)).to.be.true;
        expect(sendSpy.called).to.be.false;

        done();
      }, 50);
    });
  });

  it('should handle full end-to-end flow from error to spans', async function () {
    const captureSpy = sinon.spy(replayManager, 'capture');
    const sendSpy = sinon.spy(replayManager, 'send');
    const postSpansSpy = sinon.spy(api, 'postSpans');

    const sendOrDiscardReplaySpy = sinon.spy(
      replayManager,
      'sendOrDiscardReplay',
    );

    const errorItem = {
      data: {
        body: {
          trace: {
            exception: {
              message: 'Test E2E flow',
            },
          },
        },
      },
      level: 'error',
    };

    const addItemPromise = new Promise((resolve, reject) => {
      queue.addItem(errorItem, (err, resp) => {
        if (err) reject(err);
        else resolve(resp);
      });
    });

    await addItemPromise;
    expect(errorItem).to.have.property('replayId');
    expect(captureSpy.calledOnce).to.be.true;

    const responsePromise = sendOrDiscardReplaySpy.returnValues[0];
    await responsePromise;
    expect(sendSpy.calledOnce).to.be.true;
    expect(sendSpy.calledWith(errorItem.replayId)).to.be.true;
    expect(postSpansSpy.calledOnce).to.be.true;

    expect(recorder.exportRecordingSpan.called).to.be.true;

    const exportArgs = recorder.exportRecordingSpan.firstCall.args;
    expect(exportArgs[1]).to.have.property(
      'rollbar.replay.id',
      errorItem.replayId,
    );
    const callArgs = postSpansSpy.firstCall.args;
    expect(callArgs[0]).to.be.an('object');
    expect(callArgs[0].resourceSpans[0].scopeSpans[0].spans[0].name).to.equal(
      'rrweb-replay-recording',
    );
  });

  it('should not add replayId when replayManager is not provided', function (done) {
    const queueWithoutReplayManager = new Queue(
      { shouldSend: () => ({ shouldSend: true }) },
      api,
      console,
      { transmit: true },
    );

    const errorItem = {
      data: {
        body: {
          trace: {
            exception: {
              message: 'Test without replayManager',
            },
          },
        },
        attributes: [{ key: 'replay_id', value: '1234567812345678' }],
      },
    };

    queueWithoutReplayManager.addItem(errorItem, (err, resp) => {
      expect(errorItem).to.not.have.property('replayId');
      done();
    });
  });
});
