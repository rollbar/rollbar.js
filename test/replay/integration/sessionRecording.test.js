/**
 * Integration tests for the Recorder and Tracing interaction
 */

/* globals describe */
/* globals it */
/* globals beforeEach */
/* globals afterEach */

import { expect } from 'chai';
import { EventType } from '@rrweb/types';
import sinon from 'sinon';

import Tracing from '../../../src/tracing/tracing.js';
import { Span } from '../../../src/tracing/span.js';
import { Context } from '../../../src/tracing/context.js';
import Recorder from '../../../src/browser/replay/recorder.js';
import ReplayMap from '../../../src/browser/replay/replayMap.js';
import recorderDefaults from '../../../src/browser/replay/defaults.js';
import { mockRecordFn } from '../util';
import Api from '../../../src/api.js';
import Queue from '../../../src/queue.js';
import {
  standardPayload,
  checkpointPayload,
  singleCheckpointPayload,
  createPayloadWithReplayId,
} from '../../fixtures/replay';

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
  recorder: {
    ...recorderDefaults,
    enabled: true,
    autoStart: false,
    emitEveryNms: 100, // non-rrweb, used by mockRecordFn
  },
};

const createMockTransport = () => {
  return {
    post: sinon
      .stub()
      .callsFake((accessToken, transportOptions, payload, callback) => {
        setTimeout(() => {
          callback(null, { err: 0, result: { id: '12345' } });
        }, 10);
      }),
    postJsonPayload: sinon.stub(),
  };
};

describe('Session Replay Integration', function () {
  let tracing;
  let recorder;

  beforeEach(function () {
    tracing = new Tracing(window, options);
    tracing.initSession();

    tracing.exporter = {
      toPayload: sinon.stub().returns(standardPayload),
    };
  });

  afterEach(function () {
    if (recorder) {
      recorder.stop();
    }
    sinon.restore();
  });

  it('dumping recording should export tracing', function (done) {
    recorder = new Recorder(options.recorder, mockRecordFn);
    recorder.start();

    const tracingContext = tracing.contextManager.active();
    expect(tracingContext).to.be.instanceOf(Context);

    const dumpRecording = () => {
      const replayId = 'test-replay-id';
      const payload = recorder.dump(tracing, replayId);

      expect(payload).to.not.be.null;
      expect(payload).to.be.an('object');
      expect(payload).to.equal(standardPayload);

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
    tracing.exporter = {
      toPayload: sinon.stub().returns(checkpointPayload),
    };

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
      const payload = recorder.dump(tracing, replayId);

      expect(payload).to.not.be.null;
      expect(payload).to.equal(checkpointPayload);

      const events = payload.resourceSpans[0].scopeSpans[0].spans[0].events;

      const eventTypes = events.map((event) => {
        const eventTypeAttr = event.attributes.find(
          (attr) => attr.key === 'eventType',
        );
        return eventTypeAttr ? eventTypeAttr.value.stringValue : null;
      });

      expect(
        eventTypes.filter((type) => type === String(EventType.Meta)),
      ).to.have.lengthOf(2);
      expect(
        eventTypes.filter((type) => type === String(EventType.FullSnapshot)),
      ).to.have.lengthOf(2);

      done();
    };

    setTimeout(dumpRecording, 1000);
  });

  it('should handle no checkouts correctly', function (done) {
    tracing.exporter = {
      toPayload: sinon.stub().returns(singleCheckpointPayload),
    };

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
      const payload = recorder.dump(tracing, replayId);

      expect(payload).to.not.be.null;
      expect(payload).to.equal(singleCheckpointPayload);

      const events = payload.resourceSpans[0].scopeSpans[0].spans[0].events;

      const eventTypes = events.map((event) => {
        const eventTypeAttr = event.attributes.find(
          (attr) => attr.key === 'eventType',
        );
        return eventTypeAttr ? eventTypeAttr.value.stringValue : null;
      });

      expect(
        eventTypes.filter((type) => type === String(EventType.Meta)),
      ).to.have.lengthOf(1);
      expect(
        eventTypes.filter((type) => type === String(EventType.FullSnapshot)),
      ).to.have.lengthOf(1);

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
  let replayMap;
  let queue;

  beforeEach(function () {
    transport = createMockTransport();
    const urlMock = { parse: sinon.stub().returns({}) };
    const truncationMock = {
      truncate: sinon.stub().returns({ error: null, value: '{}' }),
    };

    tracing = new Tracing(window, options);
    tracing.initSession();

    tracing.exporter = {
      toPayload: sinon.stub().returns(standardPayload),
    };

    api = new Api(
      { accessToken: 'test-token' },
      transport,
      urlMock,
      truncationMock,
    );

    recorder = new Recorder(options.recorder, mockRecordFn);

    sinon.stub(recorder, 'dump').callsFake((tracing, replayId) => {
      return createPayloadWithReplayId(replayId);
    });

    replayMap = new ReplayMap({
      recorder,
      api,
      tracing,
    });

    queue = new Queue(
      { shouldSend: () => ({ shouldSend: true }) },
      api,
      console,
      { transmit: true, retryInterval: 500 },
      replayMap,
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
    const addSpy = sinon.spy(replayMap, 'add');
    const sendSpy = sinon.spy(replayMap, 'send');
    const postSpansSpy = sinon.spy(api, 'postSpans');

    const errorItem = {
      body: {
        trace: {
          exception: {
            message: 'Test error for session replay',
          },
        },
      },
    };

    queue.addItem(errorItem, function (err, resp) {
      expect(errorItem).to.have.property('replayId');
      expect(addSpy.calledOnce).to.be.true;

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
      .callsFake((accessToken, transportOptions, payload, callback) => {
        setTimeout(() => {
          callback(null, { err: 1, message: 'API Error' });
        }, 10);
      });

    const addSpy = sinon.spy(replayMap, 'add');
    const sendSpy = sinon.spy(replayMap, 'send');
    const discardSpy = sinon.spy(replayMap, 'discard');

    const errorItem = {
      body: {
        trace: {
          exception: {
            message: 'Test error with API failure',
          },
        },
      },
    };

    queue.addItem(errorItem, function (err, resp) {
      expect(errorItem).to.have.property('replayId');
      expect(addSpy.calledOnce).to.be.true;

      setTimeout(function () {
        expect(discardSpy.calledWith(errorItem.replayId)).to.be.true;
        expect(sendSpy.called).to.be.false;

        done();
      }, 50);
    });
  });

  it('should handle full end-to-end flow from error to spans', async function () {
    const addSpy = sinon.spy(replayMap, 'add');
    const sendSpy = sinon.spy(replayMap, 'send');
    const postSpansSpy = sinon.spy(api, 'postSpans');

    const handleReplayResponseSpy = sinon.spy(queue, '_handleReplayResponse');

    const errorItem = {
      body: {
        trace: {
          exception: {
            message: 'Test E2E flow',
          },
        },
      },
    };

    const addItemPromise = new Promise((resolve, reject) => {
      queue.addItem(errorItem, (err, resp) => {
        if (err) reject(err);
        else resolve(resp);
      });
    });

    await addItemPromise;
    expect(errorItem).to.have.property('replayId');
    expect(addSpy.calledOnce).to.be.true;

    const responsePromise = handleReplayResponseSpy.returnValues[0];
    await responsePromise;
    expect(sendSpy.calledOnce).to.be.true;
    expect(sendSpy.calledWith(errorItem.replayId)).to.be.true;
    expect(postSpansSpy.calledOnce).to.be.true;

    expect(recorder.dump.called).to.be.true;
    expect(recorder.dump.calledWith(tracing, errorItem.replayId)).to.be.true;
    const callArgs = postSpansSpy.firstCall.args;
    expect(callArgs[0]).to.be.an('object');
    expect(callArgs[0].resourceSpans[0].scopeSpans[0].spans[0].name).to.equal(
      'rrweb-replay-recording',
    );
  });

  it('should not add replayId when replayMap is not provided', function (done) {
    const queueWithoutReplayMap = new Queue(
      { shouldSend: () => ({ shouldSend: true }) },
      api,
      console,
      { transmit: true },
    );

    const errorItem = {
      body: {
        trace: {
          exception: {
            message: 'Test without replayMap',
          },
        },
      },
    };

    queueWithoutReplayMap.addItem(errorItem, function (err, resp) {
      expect(errorItem).to.not.have.property('replayId');
      done();
    });
  });
});
