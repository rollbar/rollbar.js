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
import { SpanExporter } from '../../../src/tracing/exporter.js';
import Recorder from '../../../src/browser/replay/recorder.js';
import ReplayMap from '../../../src/browser/replay/replayMap.js';
import recorderDefaults from '../../../src/browser/replay/defaults.js';
import { spanExportQueue } from '../../../src/tracing/exporter.js';
import mockRecordFn from '../mockRecordFn.js';
import Api from '../../../src/api.js';
import Queue from '../../../src/queue.js';

const mockWindow = {
  sessionStorage: {},
  document: {
    location: {
      href: 'https://example.com/test',
    },
  },
  navigator: {
    userAgent: 'Mozilla/5.0 Test',
  },
};

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
    post: sinon.stub().callsFake((accessToken, transportOptions, payload, callback) => {
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
    spanExportQueue.length = 0;

    tracing = new Tracing(mockWindow, options);
    tracing.initSession();
  });

  afterEach(function () {
    if (recorder) {
      recorder.stop();
    }
    sinon.restore();
  });

  it('dumping recording should export tracing', function (done) {
    recorder = new Recorder(tracing, options.recorder, mockRecordFn);
    recorder.start();

    const tracingContext = tracing.contextManager.active();
    expect(tracingContext).to.be.instanceOf(Context);

    const dumpRecording = () => {
      const recordingSpan = recorder.dump(tracingContext);
      expect(recordingSpan).to.be.instanceOf(Span);
      expect(recordingSpan.span.name).to.be.equal('rrweb-replay-recording');

      const events = recordingSpan.span.events;
      expect(events.length).to.be.greaterThan(0);
      expect(events.every((e) => e.name === 'rrweb-replay-events')).to.be.true;
      expect(events[0].attributes).to.have.property('eventType');
      expect(events[0].attributes).to.have.property('json');

      expect(spanExportQueue.length).to.be.equal(1);
      expect(spanExportQueue[0]).to.be.deep.equal(recordingSpan.span);
      expect(spanExportQueue[0].events.length).to.be.equal(events.length);
      expect(spanExportQueue[0].events).to.be.deep.equal(events);
      expect(spanExportQueue[0].name).to.be.equal('rrweb-replay-recording');

      done();
    };

    setTimeout(dumpRecording, 1000);
  });

  it('should handle checkouts correctly', function (done) {
    recorder = new Recorder(
      tracing,
      {
        ...options.recorder,
        checkoutEveryNms: 250,
      },
      mockRecordFn,
    );

    recorder.start();

    const dumpRecording = () => {
      const recordingSpan = recorder.dump();

      const events = recordingSpan.span.events;
      expect(
        events.filter((e) => e.attributes.eventType === EventType.Meta),
      ).to.have.lengthOf(2);
      expect(
        events.filter((e) => e.attributes.eventType === EventType.FullSnapshot),
      ).to.have.lengthOf(2);

      done();
    };

    setTimeout(dumpRecording, 1000);
  });

  it('should handle no checkouts correctly', function (done) {
    recorder = new Recorder(
      tracing,
      {
        ...options.recorder,
        checkoutEveryNms: 500,
      },
      mockRecordFn,
    );

    recorder.start();

    const dumpRecording = () => {
      const recordingSpan = recorder.dump();

      const events = recordingSpan.span.events;
      expect(
        events.filter((e) => e.attributes.eventType === EventType.Meta),
      ).to.have.lengthOf(1);
      expect(
        events.filter((e) => e.attributes.eventType === EventType.FullSnapshot),
      ).to.have.lengthOf(1);

      done();
    };

    setTimeout(dumpRecording, 250);
  });
});

describe('Session Replay Transport Integration', function() {
  let tracing;
  let recorder;
  let api;
  let transport;
  let exporter;
  let replayMap;
  let queue;
  
  beforeEach(function() {
    spanExportQueue.length = 0;
    
    transport = createMockTransport();
    const urlMock = { parse: sinon.stub().returns({}) };
    const truncationMock = { truncate: sinon.stub().returns({ error: null, value: '{}' }) };
    
    tracing = new Tracing(mockWindow, options);
    tracing.initSession();
    
    api = new Api({ accessToken: 'test-token' }, transport, urlMock, truncationMock);
    
    recorder = new Recorder(tracing, options.recorder, mockRecordFn);
    
    exporter = new SpanExporter();
    sinon.stub(exporter, 'export').callsFake(() => {
      return spanExportQueue.slice();
    });
    
    replayMap = new ReplayMap({
      recorder,
      exporter,
      api,
      tracing
    });
    
    queue = new Queue(
      { shouldSend: () => ({ shouldSend: true }) },
      api,
      console,
      { transmit: true, retryInterval: 500 },
      replayMap
    );

    recorder.start();
  });
  
  afterEach(function() {
    if (recorder) {
      recorder.stop();
    }
    sinon.restore();
  });
  
  it('should add replayId to error item and send replay on success', function(done) {
    const addSpy = sinon.spy(replayMap, 'add');
    const sendSpy = sinon.spy(replayMap, 'send');
    const postSpansSpy = sinon.spy(api, 'postSpans');
    
    const errorItem = {
      body: {
        trace: {
          exception: {
            message: 'Test error for session replay'
          }
        }
      }
    };
    
    queue.addItem(errorItem, function(err, resp) {
      expect(errorItem).to.have.property('replayId');
      expect(addSpy.calledOnce).to.be.true;
      
      expect(err).to.be.null;
      expect(resp).to.have.property('err', 0);
      
      setTimeout(function() {
        expect(sendSpy.calledWith(errorItem.replayId)).to.be.true;
        expect(postSpansSpy.calledOnce).to.be.true;
        
        done();
      }, 50);
    });
  });
  
  it('should discard replay when API returns an error', function(done) {
    transport.post.restore();
    transport.post = sinon.stub().callsFake((accessToken, transportOptions, payload, callback) => {
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
            message: 'Test error with API failure'
          }
        }
      }
    };
    
    queue.addItem(errorItem, function(err, resp) {
      expect(errorItem).to.have.property('replayId');
      expect(addSpy.calledOnce).to.be.true;
      
      setTimeout(function() {
        expect(discardSpy.calledWith(errorItem.replayId)).to.be.true;
        expect(sendSpy.called).to.be.false;
        
        done();
      }, 50);
    });
  });
  
  it('should handle full end-to-end flow from error to spans', function(done) {
    const addSpy = sinon.spy(replayMap, 'add');
    const sendSpy = sinon.spy(replayMap, 'send');
    const getSpansSpy = sinon.spy(replayMap, 'getSpans');
    const postSpansSpy = sinon.spy(api, 'postSpans');
    
    const errorItem = {
      body: {
        trace: {
          exception: {
            message: 'Test E2E flow'
          }
        }
      }
    };
    
    const mockSpans = [{ id: 'test-span', name: 'recording-span' }];
    replayMap.setSpans('fake-id', mockSpans);
    
    sinon.stub(replayMap, '_processReplay').resolves(true);
    
    queue.addItem(errorItem, function(err, resp) {
      expect(errorItem).to.have.property('replayId');
      expect(addSpy.calledOnce).to.be.true;
      
      setTimeout(function() {
        expect(sendSpy.calledOnce).to.be.true;
        expect(getSpansSpy.called).to.be.true;
        expect(postSpansSpy.calledOnce).to.be.true;
        
        const callArgs = postSpansSpy.firstCall.args;
        expect(callArgs[0]).to.be.an('array');
        
        done();
      }, 100);
    });
  });
  
  it('should not add replayId when replayMap is not provided', function(done) {
    const queueWithoutReplayMap = new Queue(
      { shouldSend: () => ({ shouldSend: true }) },
      api,
      console,
      { transmit: true }
    );
    
    const errorItem = {
      body: {
        trace: {
          exception: {
            message: 'Test without replayMap'
          }
        }
      }
    };
    
    queueWithoutReplayMap.addItem(errorItem, function(err, resp) {
      expect(errorItem).to.not.have.property('replayId');
      done();
    });
  });
});