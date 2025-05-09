/**
 * End-to-end integration test for the complete session replay feature
 */

/* globals describe */
/* globals it */
/* globals beforeEach */
/* globals afterEach */

import { expect } from 'chai';
import sinon from 'sinon';

import Tracing from '@tracing/tracing.js';
import { SpanExporter } from '@tracing/exporter.js';
import { spanExportQueue } from '@tracing/exporter.js';
import Recorder from '@browser/replay/recorder.js';
import ReplayMap from '@browser/replay/replayMap.js';
import recorderDefaults from '@browser/replay/defaults.js';
import Api from '@rollbar/api.js';
import Queue from '@rollbar/queue.js';
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
  let exporter;
  let replayMap;
  let queue;
  let rateLimiter;

  beforeEach(function () {
    spanExportQueue.length = 0;

    // Create mock transport that tracks API calls
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

    // Create mock utils
    const urlMock = { parse: sinon.stub().returns({}) };
    const truncationMock = {
      truncate: sinon.stub().returns({ error: null, value: '{}' }),
    };
    const logger = { error: sinon.spy(), log: sinon.spy() };

    // Setup tracing
    tracing = new Tracing(window, options);
    tracing.initSession();

    // Setup API
    api = new Api(
      { accessToken: 'test-token-12345' },
      transport,
      urlMock,
      truncationMock,
    );

    // Setup recorder
    recorder = new Recorder(tracing, options.recorder, mockRecordFn);

    // Setup exporter
    exporter = new SpanExporter();

    // Setup rateLimiter
    rateLimiter = { shouldSend: () => ({ shouldSend: true }) };

    // Setup ReplayMap with real components
    replayMap = new ReplayMap({
      recorder,
      exporter,
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
    // Start test
    recorder.start();

    // Record some events by waiting
    setTimeout(() => {
      // Spy on key methods
      const recorderDumpSpy = sinon.spy(recorder, 'dump');
      const replayMapAddSpy = sinon.spy(replayMap, 'add');
      const replayMapSendSpy = sinon.spy(replayMap, 'send');
      const apiPostItemSpy = sinon.spy(api, 'postItem');
      const apiPostSpansSpy = sinon.spy(api, 'postSpans');

      // Create an error to trigger the flow
      const errorItem = {
        body: {
          trace: {
            exception: {
              message: 'E2E test error',
            },
          },
        },
      };

      // Add the error to the queue
      queue.addItem(errorItem, function (err, resp) {
        // Verify error was processed
        expect(errorItem).to.have.property('replayId');
        expect(replayMapAddSpy.calledOnce).to.be.true;
        expect(apiPostItemSpy.calledOnce).to.be.true;

        // Make sure enough time passes for async operations
        setTimeout(() => {
          // Verify recorder.dump was called by ReplayMap
          expect(recorderDumpSpy.calledOnce).to.be.true;

          // Verify ReplayMap.send was called as part of API response
          expect(replayMapSendSpy.calledWith(errorItem.replayId)).to.be.true;

          // Verify API.postSpans was called by ReplayMap.send
          expect(apiPostSpansSpy.calledOnce).to.be.true;

          // Verify spans payload format
          const spans = apiPostSpansSpy.firstCall.args[0];
          expect(spans).to.be.an('array');

          if (spans.length > 0) {
            const span = spans[0];
            expect(span).to.have.property('name', 'rrweb-replay-recording');
            expect(span).to.have.property('events');
            expect(span.events).to.be.an('array');
            expect(span.events[0]).to.have.property(
              'name',
              'rrweb-replay-events',
            );
            expect(span.events[0].attributes).to.have.property('eventType');
            expect(span.events[0].attributes).to.have.property('json');
            expect(span.attributes).to.have.property(
              'rollbar.replay.id',
              errorItem.replayId,
            );
          }

          // Verify transport details
          const transportArgs = transport.post.lastCall.args;
          expect(transportArgs[1].path).to.include('/api/1/session/');

          done();
        }, 200);
      });
    }, 500); // Wait for some events to be recorded
  });

  it('should integrate with real components in failure scenario', function (done) {
    // Configure transport to fail
    transport.post.callsFake(
      (accessToken, transportOptions, payload, callback) => {
        // Fail only for item API calls
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

    // Spy on key methods
    const replayMapAddSpy = sinon.spy(replayMap, 'add');
    const replayMapDiscardSpy = sinon.spy(replayMap, 'discard');
    const apiPostSpansSpy = sinon.spy(api, 'postSpans');

    // Start recording
    recorder.start();

    // Create an error to trigger the flow
    const errorItem = {
      body: {
        trace: {
          exception: {
            message: 'Error that will fail to send',
          },
        },
      },
    };

    // Add the error to the queue
    queue.addItem(errorItem, function (err, resp) {
      // Verify error was processed
      expect(errorItem).to.have.property('replayId');
      expect(replayMapAddSpy.calledOnce).to.be.true;

      // Error response should be returned
      expect(resp).to.have.property('err', 1);

      // Make sure enough time passes for async operations
      setTimeout(() => {
        // Verify ReplayMap.discard was called for the error response
        expect(replayMapDiscardSpy.calledWith(errorItem.replayId)).to.be.true;

        // Verify API.postSpans was NOT called
        expect(apiPostSpansSpy.called).to.be.false;

        // Verify that the replay was removed from the map
        expect(replayMap.getSpans(errorItem.replayId)).to.be.null;

        done();
      }, 100);
    });
  });
});
