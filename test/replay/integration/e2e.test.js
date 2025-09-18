/**
 * End-to-end integration test for the complete session replay feature
 */

import { expect } from 'chai';
import sinon from 'sinon';

import Tracing from '../../../src/tracing/tracing.js';
import Telemeter from '../../../src/telemetry.js';
import Recorder from '../../../src/browser/replay/recorder.js';
import ReplayManager from '../../../src/browser/replay/replayManager.js';
import recorderDefaults from '../../../src/browser/replay/defaults.js';
import Api from '../../../src/api.js';
import Queue from '../../../src/queue.js';
import mockRecordFn from '../util/mockRecordFn.js';
import * as payloads from '../../fixtures/replay/payloads.fixtures.js';

const options = {
  enabled: true,
  resource: {
    'service.name': 'test_service',
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
  payload: {
    environment: 'testenv',
  },
};

describe('Session Replay E2E', function () {
  let tracing;
  let telemeter;
  let recorder;
  let api;
  let transport;
  let replayManager;
  let queue;
  let rateLimiter;

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
    const logger = { error: sinon.spy(), log: sinon.spy() };

    tracing = new Tracing(window, options);
    tracing.initSession();
    api = new Api(
      { accessToken: 'test-token-12345' },
      transport,
      urlMock,
      truncationMock,
    );
    telemeter = new Telemeter({}, tracing);

    recorder = new Recorder(options.recorder, mockRecordFn);

    rateLimiter = { shouldSend: () => ({ shouldSend: true }) };

    replayManager = new ReplayManager({
      recorder,
      api,
      tracing,
      telemeter,
    });

    queue = new Queue(
      rateLimiter,
      api,
      logger,
      { transmit: true },
      replayManager,
    );
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
      const recorderDumpSpy = sinon.spy(recorder, 'dump');
      const replayManagerAddSpy = sinon.spy(replayManager, 'add');
      const replayManagerSendSpy = sinon.spy(replayManager, 'send');
      const apiPostItemSpy = sinon.spy(api, 'postItem');
      const apiPostSpansSpy = sinon.spy(api, 'postSpans');

      const errorItem = {
        data: {
          body: {
            trace: {
              exception: {
                message: 'E2E test error',
              },
            },
          },
          attributes: [{ key: 'replay_id', value: '1234567812345678' }],
        },
      };

      queue.addItem(errorItem, function (err, resp) {
        expect(errorItem).to.have.property('replayId');
        const expectedReplayId = errorItem.replayId;
        expect(expectedReplayId).to.match(/^[0-9a-fA-F]{16}$/);

        expect(replayManagerAddSpy.calledOnce).to.be.true;
        expect(apiPostItemSpy.calledOnce).to.be.true;

        setTimeout(() => {
          expect(recorderDumpSpy.called).to.be.true;
          expect(recorderDumpSpy.calledWith(tracing, errorItem.replayId)).to.be
            .true;
          expect(replayManagerSendSpy.calledWith(errorItem.replayId)).to.be
            .true;
          expect(apiPostSpansSpy.calledOnce).to.be.true;

          const payload = apiPostSpansSpy.firstCall.args[0];
          expect(payload).to.be.an('object');
          expect(payload).to.have.property('resourceSpans');
          expect(payload.resourceSpans).to.be.an('array');
          expect(payload.resourceSpans).to.have.length.greaterThan(0);

          const resourceSpan = payload.resourceSpans[0];
          expect(resourceSpan).to.have.property('resource');

          const resource = payload.resourceSpans[0].resource;
          expect(resource).to.deep.equal(
            payloads.standardPayload.resourceSpans[0].resource,
          );

          const span_t = resourceSpan.scopeSpans[0].spans[0]; // telemetry span
          const span_r = resourceSpan.scopeSpans[0].spans[1]; // recording span

          expect(span_r).to.have.property('name', 'rrweb-replay-recording');
          expect(span_r).to.have.property('events');
          expect(span_r.events).to.be.an('array');
          expect(span_r).to.have.property('attributes').that.is.an('array');
          expect(span_r.attributes).to.have.lengthOf(2);

          expect(span_r.attributes).to.deep.include({
            key: 'rollbar.replay.id',
            value: { stringValue: expectedReplayId },
          });

          const sessionIdAttr = span_r.attributes.find(
            (attr) => attr.key === 'session.id',
          );
          expect(sessionIdAttr).to.exist;
          expect(sessionIdAttr.value.stringValue).to.match(/^[0-9a-fA-F]{32}$/);

          expect(span_t).to.have.property('name', 'rollbar-telemetry');
          expect(span_t.attributes).to.deep.include({
            key: 'rollbar.replay.id',
            value: { stringValue: expectedReplayId },
          });
          expect(sessionIdAttr).to.deep.equal(
            span_t.attributes.find((attr) => attr.key === 'session.id'),
          );

          const transportArgs = transport.post.lastCall.args;
          expect(transportArgs[0].options.path).to.include('/api/1/session/');

          done();
        }, 200);
      });
    }, 50);
  });

  it('should integrate with real components in failure scenario', function (done) {
    transport.post.callsFake(
      ({accessToken, options, payload, callback}) => {
        if (options.path.includes('/api/1/item/')) {
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

    const replayManagerAddSpy = sinon.spy(replayManager, 'add');
    const replayManagerDiscardSpy = sinon.spy(replayManager, 'discard');
    const apiPostSpansSpy = sinon.spy(api, 'postSpans');

    recorder.start();

    const errorItem = {
      data: {
        body: {
          trace: {
            exception: {
              message: 'Error that will fail to send',
            },
          },
        },
        attributes: [{ key: 'replay_id', value: '1234567812345678' }],
      },
    };

    queue.addItem(errorItem, function (err, resp) {
      expect(errorItem).to.have.property('replayId');
      expect(replayManagerAddSpy.calledOnce).to.be.true;
      expect(resp).to.have.property('err', 1);

      setTimeout(() => {
        expect(replayManagerDiscardSpy.calledWith(errorItem.replayId)).to.be
          .true;
        expect(apiPostSpansSpy.called).to.be.false;
        expect(replayManager.getSpans(errorItem.replayId)).to.be.null;

        done();
      }, 100);
    });
  });
});
