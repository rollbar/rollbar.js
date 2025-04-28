/**
 * Integration tests for the Recorder and Tracing interaction
 */

/* globals describe */
/* globals it */
/* globals beforeEach */
/* globals afterEach */

import { expect } from 'chai';
import Tracing from '../../src/tracing/tracing.js';
import { Span } from '../../src/tracing/span.js';
import { Context } from '../../src/tracing/context.js';
import Recorder from '../../src/browser/replay/recorder.js';
import recorderDefaults from '../../src/browser/replay/defaults.js';
import { spanExportQueue } from '../../src/tracing/exporter.js';
import mockRecordFn from './mockRecordFn.js';
import { EventType } from '../fixtures/replay/types.js';

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

describe('Session Replay Integration', function () {
  let tracing;
  let recorder;

  beforeEach(function () {
    spanExportQueue.length = 0;

    tracing = new Tracing(mockWindow, options);
    tracing.initSession();
  });

  afterEach(function () {
    recorder.stop();
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
