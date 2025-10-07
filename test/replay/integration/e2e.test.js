/**
 * End-to-end integration test for the complete session replay feature
 */

import { expect } from 'chai';
import sinon from 'sinon';

import Tracing from '../../../src/tracing/tracing.js';
import Telemeter from '../../../src/telemetry.js';
import ReplayManager from '../../../src/browser/replay/replayManager.js';
import replayDefaults from '../../../src/browser/replay/defaults.js';
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
  replay: {
    ...replayDefaults,
    enabled: true,
    autoStart: true,
    emitEveryNms: 50,
    triggers: [
      {
        type: 'occurrence',
      },
    ],
    recordFn: mockRecordFn,
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
    const logger = { error: sinon.spy(), log: sinon.spy() };

    api = new Api(
      { accessToken: 'test-token-12345' },
      transport,
      urlMock,
      truncationMock,
    );
    tracing = new Tracing(window, api, options);
    tracing.initSession();
    telemeter = new Telemeter({}, tracing);

    rateLimiter = { shouldSend: () => ({ shouldSend: true }) };

    replayManager = new ReplayManager({
      tracing,
      telemeter,
      options: options.replay,
    });
    recorder = replayManager.recorder;

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
      const recorderExportSpy = sinon.spy(recorder, 'exportRecordingSpan');
      const replayManagerCaptureSpy = sinon.spy(replayManager, 'capture');
      const replayManagerSendSpy = sinon.spy(replayManager, 'send');
      const apiPostItemSpy = sinon.spy(api, 'postItem');
      const apiPostSpansSpy = sinon.spy(tracing.exporter, 'post');

      const errorItem = {
        data: {
          body: {
            trace: {
              exception: {
                message: 'E2E test error',
              },
            },
          },
        },
        level: 'error',
      };

      tracing.session.setAttributes({
        'user.id': '12345',
        'user.email': 'aaa@bb.com',
      });

      queue.addItem(errorItem, (err, resp) => {
        expect(errorItem).to.have.property('replayId');
        const expectedReplayId = errorItem.replayId;
        expect(expectedReplayId).to.match(/^[0-9a-fA-F]{16}$/);

        expect(replayManagerCaptureSpy.calledOnce).to.be.true;
        expect(apiPostItemSpy.calledOnce).to.be.true;

        setTimeout(() => {
          expect(recorderExportSpy.called).to.be.true;

          const exportArgs = recorderExportSpy.firstCall.args;
          expect(exportArgs[0]).to.equal(tracing);
          expect(exportArgs[1]).to.have.property(
            'rollbar.replay.id',
            errorItem.replayId,
          );
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

          const span_r = resourceSpan.scopeSpans[0].spans[0]; // recording span (exported first)
          const span_t = resourceSpan.scopeSpans[0].spans[1]; // telemetry span (exported second)

          expect(span_r).to.have.property('name', 'rrweb-replay-recording');
          expect(span_r).to.have.property('events');
          expect(span_r.events).to.be.an('array');
          expect(span_r).to.have.property('attributes').that.is.an('array');
          expect(span_r.attributes).to.have.lengthOf(12);

          expect(span_r.attributes).to.deep.include({
            key: 'rollbar.replay.id',
            value: { stringValue: expectedReplayId },
          });
          expect(span_r.attributes).to.deep.include({
            key: 'user.id',
            value: { stringValue: '12345' },
          });
          expect(span_r.attributes).to.deep.include({
            key: 'user.email',
            value: { stringValue: 'aaa@bb.com' },
          });
          expect(span_r.attributes).to.deep.include({
            key: 'browser.mobile',
            value: { boolValue: false },
          });

          const languageAttr = span_r.attributes.find(
            (attr) => attr.key === 'browser.language',
          );
          expect(languageAttr).to.exist;
          expect(languageAttr.value.stringValue).to.match(/en-US/);

          const userAgentAttr = span_r.attributes.find(
            (attr) => attr.key === 'user_agent.original',
          );
          expect(userAgentAttr).to.exist;
          expect(userAgentAttr.value.stringValue).to.match(/HeadlessChrome/);

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

  it('should handle trailing and leading replay flow', function (done) {
    this.timeout(10000);

    recorder.configure({ ...recorder.options, postDuration: 0.1 });
    recorder.start();

    setTimeout(() => {
      const recorderExportSpy = sinon.spy(recorder, 'exportRecordingSpan');
      const replayManagerCaptureSpy = sinon.spy(replayManager, 'capture');
      const replayManagerSendSpy = sinon.spy(replayManager, 'send');
      const apiPostItemSpy = sinon.spy(api, 'postItem');
      const apiPostSpansSpy = sinon.spy(tracing.exporter, 'post');

      const errorItem = {
        data: {
          body: {
            trace: {
              exception: {
                message: 'E2E test error with leading',
              },
            },
          },
        },
        level: 'error',
      };

      queue.addItem(errorItem, (err, resp) => {
        expect(err).to.be.null;
        expect(resp).to.have.property('err', 0);
        expect(errorItem).to.have.property('replayId');
        const expectedReplayId = errorItem.replayId;

        expect(replayManagerCaptureSpy.calledOnce).to.be.true;
        expect(apiPostItemSpy.calledOnce).to.be.true;

        setTimeout(() => {
          expect(recorderExportSpy.called).to.be.true;
          expect(replayManagerSendSpy.calledWith(errorItem.replayId)).to.be
            .true;

          const trailingExportCall = recorderExportSpy.firstCall;
          expect(trailingExportCall.args[2]).to.be.undefined;

          setTimeout(() => {
            expect(apiPostSpansSpy.callCount).to.equal(2);

            const trailingApiCall = apiPostSpansSpy.firstCall;
            const leadingApiCall = apiPostSpansSpy.secondCall;

            expect(trailingApiCall.args[1]).to.deep.equal({
              'X-Rollbar-Replay-Id': expectedReplayId,
            });
            expect(leadingApiCall.args[1]).to.deep.equal({
              'X-Rollbar-Replay-Id': expectedReplayId,
            });

            expect(recorderExportSpy.callCount).to.be.greaterThan(1);
            const leadingExportCall = recorderExportSpy.lastCall;
            const leadingCursor = leadingExportCall.args[2];

            expect(leadingCursor).to.be.an('object');
            expect(leadingCursor).to.have.property('slot');
            expect(leadingCursor).to.have.property('offset');
            expect(leadingCursor.slot).to.be.oneOf([0, 1]);
            expect(leadingCursor.offset).to.be.a('number');

            done();
          }, 200);
        }, 200);
      });
    }, 50);
  });

  it('should integrate with real components in failure scenario', function (done) {
    transport.post.callsFake(({ accessToken, options, payload, callback }) => {
      if (options.path.includes('/api/1/item/')) {
        setTimeout(() => {
          callback(null, { err: 1, message: 'API Error' });
        }, 10);
      } else {
        setTimeout(() => {
          callback(null, { err: 0, result: { id: '12345' } });
        }, 10);
      }
    });

    const replayManagerCaptureSpy = sinon.spy(replayManager, 'capture');
    const replayManagerDiscardSpy = sinon.spy(replayManager, 'discard');
    const apiPostSpansSpy = sinon.spy(tracing.exporter, 'post');

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
      },
      level: 'error',
    };

    queue.addItem(errorItem, (err, resp) => {
      expect(errorItem).to.have.property('replayId');
      expect(replayManagerCaptureSpy.calledOnce).to.be.true;
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
