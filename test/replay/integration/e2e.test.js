/**
 * End-to-end integration test for the complete session replay feature
 */

/* globals describe */
/* globals it */
/* globals beforeEach */
/* globals afterEach */

import { expect } from 'chai';
import sinon from 'sinon';

import Tracing from '../../../src/tracing/tracing.js';
import Recorder from '../../../src/browser/replay/recorder.js';
import ReplayMap from '../../../src/browser/replay/replayMap.js';
import recorderDefaults from '../../../src/browser/replay/defaults.js';
import Api from '../../../src/api.js';
import Queue from '../../../src/queue.js';
import { mockRecordFn } from '../util';

const options = {
  enabled: true,
  resource: {
    attributes: {
      'service.name': 'test_service',
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
    autoStart: true,
    emitEveryNms: 50,
  },
};

describe('Session Replay E2E', function () {
  let tracing;
  let recorder;
  let api;
  let transport;
  let replayMap;
  let queue;
  let rateLimiter;

  beforeEach(function () {
    transport = {
      post: sinon
        .stub()
        .callsFake((accessToken, transportOptions, payload, callback) => {
          setTimeout(() => {
            callback(null, { err: 0, result: { id: '12345' } });
          }, 10);
        }),
      postJsonPayload: sinon.stub(),
    };
    const urlMock = { parse: sinon.stub().returns({}) };
    const truncationMock = {
      truncate: sinon.stub().returns({ error: null, value: '{}' }),
    };
    const logger = { error: sinon.spy(), log: sinon.spy() };

    tracing = new Tracing(window, options);
    tracing.initSession();
    api = new Api(
      { accessToken: 'test-token-12345' },
      transport,
      urlMock,
      truncationMock,
    );

    const mockPayload = [{
      name: 'rrweb-replay-recording',
      events: [{
        name: 'rrweb-replay-events',
        attributes: {
          eventType: 4,
          json: '{"data":{"type":"Test"}}',
        }
      }],
      attributes: {}
    }];
    recorder = new Recorder(options.recorder, mockRecordFn);
    sinon.stub(recorder, 'dump').callsFake((tracing, replayId) => {
      mockPayload[0].attributes['rollbar.replay.id'] = replayId;
      mockPayload[0].events[0].attributes['rollbar.replay.id'] = replayId;
      return mockPayload;
    });

    // Setup rateLimiter
    rateLimiter = { shouldSend: () => ({ shouldSend: true }) };

    // Setup ReplayMap with real components
    replayMap = new ReplayMap({
      recorder,
      api,
      tracing,
    });

    // Setup Queue with all components
    queue = new Queue(rateLimiter, api, logger, { transmit: true }, replayMap);
  });

  afterEach(function () {
    if (recorder && recorder.isRecording) {
      recorder.stop();
    }
    sinon.restore();
  });

  it('should handle complete session replay flow from error to API call', function (done) {
    recorder.start();

    setTimeout(() => {
      const recorderDumpSpy = recorder.dump;
      const replayMapAddSpy = sinon.spy(replayMap, 'add');
      const replayMapSendSpy = sinon.spy(replayMap, 'send');
      const apiPostItemSpy = sinon.spy(api, 'postItem');
      const apiPostSpansSpy = sinon.spy(api, 'postSpans');

      const errorItem = {
        body: {
          trace: {
            exception: {
              message: 'E2E test error',
            },
          },
        },
      };

      queue.addItem(errorItem, function (err, resp) {
        expect(errorItem).to.have.property('replayId');
        expect(replayMapAddSpy.calledOnce).to.be.true;
        expect(apiPostItemSpy.calledOnce).to.be.true;

        setTimeout(() => {
          expect(recorderDumpSpy.called).to.be.true;
          expect(recorderDumpSpy.calledWith(tracing, errorItem.replayId)).to.be.true;
          expect(replayMapSendSpy.calledWith(errorItem.replayId)).to.be.true;
          expect(apiPostSpansSpy.calledOnce).to.be.true;

          const payload = apiPostSpansSpy.firstCall.args[0];
          expect(payload).to.be.an('array');

          if (payload.length > 0) {
            const span = payload[0];
            expect(span).to.have.property('name', 'rrweb-replay-recording');
            expect(span).to.have.property('events');
            expect(span.events).to.be.an('array');
            expect(span.events[0]).to.have.property('name', 'rrweb-replay-events');
            expect(span.events[0].attributes).to.have.property('eventType');
            expect(span.events[0].attributes).to.have.property('json');
            expect(span.attributes).to.have.property('rollbar.replay.id', errorItem.replayId);
          }

          const transportArgs = transport.post.lastCall.args;
          expect(transportArgs[1].path).to.include('/api/1/session/');

          done();
        }, 200);
      });
    }, 50); // Reduced waiting time with mock recorder
  });

  it('should integrate with real components in failure scenario', function (done) {
    transport.post.callsFake(
      (accessToken, transportOptions, payload, callback) => {
        if (transportOptions.path.includes('/api/1/item/')) {
          setTimeout(() => {
            callback(null, { err: 1, message: 'API Error' });
          }, 10);
        } else {
          setTimeout(() => {
            callback(null, { err: 0, result: { id: '12345' } });
          }, 10);
        }
      },
    );

    const replayMapAddSpy = sinon.spy(replayMap, 'add');
    const replayMapDiscardSpy = sinon.spy(replayMap, 'discard');
    const apiPostSpansSpy = sinon.spy(api, 'postSpans');

    recorder.start();

    const errorItem = {
      body: {
        trace: {
          exception: {
            message: 'Error that will fail to send',
          },
        },
      },
    };

    queue.addItem(errorItem, function (err, resp) {
      expect(errorItem).to.have.property('replayId');
      expect(replayMapAddSpy.calledOnce).to.be.true;
      expect(resp).to.have.property('err', 1);

      setTimeout(() => {
        expect(replayMapDiscardSpy.calledWith(errorItem.replayId)).to.be.true;
        expect(apiPostSpansSpy.called).to.be.false;
        expect(replayMap.getSpans(errorItem.replayId)).to.be.null;

        done();
      }, 100);
    });
  });
});
