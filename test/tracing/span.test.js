import sinon from 'sinon';
import { expect } from 'chai';

import { Span } from '../../src/tracing/span.js';
import { SpanExporter, spanExportQueue } from '../../src/tracing/exporter.js';
import { SpanProcessor } from '../../src/tracing/spanProcessor.js';
import { ROOT_CONTEXT } from '../../src/tracing/context.js';
import hrtime from '../../src/tracing/hrtime.js';

const spanOptions = function (options = {}) {
  const exporter = new SpanExporter();
  const spanProcessor = new SpanProcessor(exporter);

  return {
    resource: {
      attributes: {
        'service.name': 'unknown_service',
        'telemetry.sdk.language': 'webjs',
        'telemetry.sdk.name': 'rollbar',
        'telemetry.sdk.version': '0.1.0',
      },
    },
    scope: {
      name: 'testScope',
      version: '0.1.0',
    },
    session: {
      id: 'ffd1f2e0e3ecaf2eaf0ac4c6c68154eb',
    },
    context: ROOT_CONTEXT,
    spanContext: {
      traceId: 'c7ab72d0c1457d0162d12dbed77a6cb4',
      spanId: 'f51f610441990163',
      traceFlags: 0,
      traceState: '',
    },
    name: 'testSpan',
    kind: 'internal',
    parentSpanId: 'c44638e654c52eff',
    spanProcessor: spanProcessor,
    ...options,
  };
};

const expectReadableSpan = function (span, overrides = {}) {
  const expected = {
    name: 'testSpan',
    kind: 'internal',
    spanContext: {
      traceId: 'c7ab72d0c1457d0162d12dbed77a6cb4',
      spanId: 'f51f610441990163',
      traceFlags: 0,
      traceState: '',
    },
    parentSpanId: 'c44638e654c52eff',
    startTime: [0, 0],
    endTime: [0, 0],
    status: { code: 0, message: '' },
    attributes: { 'session.id': 'ffd1f2e0e3ecaf2eaf0ac4c6c68154eb' },
    links: [],
    events: [],
    duration: 0,
    ended: false,
    resource: {
      attributes: {
        'service.name': 'unknown_service',
        'telemetry.sdk.language': 'webjs',
        'telemetry.sdk.name': 'rollbar',
        'telemetry.sdk.version': '0.1.0',
      },
    },
    instrumentationScope: {
      name: 'testScope',
      version: '0.1.0',
    },
    droppedAttributesCount: 0,
    droppedEventsCount: 0,
    droppedLinksCount: 0,
    ...overrides,
  };

  expect(span.span.name).to.equal(expected.name);
  expect(span.span.kind).to.equal(expected.kind);
  expect(span.span.spanContext).to.deep.equal(expected.spanContext);
  expect(span.span.parentSpanId).to.equal(expected.parentSpanId);
  expect(span.span.endTime).to.deep.equal(expected.endTime);
  expect(span.span.status).to.deep.equal(expected.status);
  expect(span.span.attributes).to.deep.equal(expected.attributes);
  expect(span.span.links).to.deep.equal(expected.links);
  expect(span.span.events).to.deep.equal(expected.events);
  expect(span.span.duration).to.equal(expected.duration);
  expect(span.span.ended).to.equal(expected.ended);
  expect(span.span.resource).to.deep.equal(expected.resource);
  expect(span.span.instrumentationScope).to.deep.equal(
    expected.instrumentationScope,
  );
  expect(span.span.droppedAttributesCount).to.equal(
    expected.droppedAttributesCount,
  );
  expect(span.span.droppedEventsCount).to.equal(expected.droppedEventsCount);
  expect(span.span.droppedLinksCount).to.equal(expected.droppedLinksCount);
};

describe('Span()', function () {
  it('should create a readable span', function (done) {
    const overrides = [];
    const span = new Span(spanOptions());

    expectReadableSpan(span);

    const attributes = {
      key1: 'value1',
      key2: 'value2',
    };
    span.setAttributes(attributes);

    const eventTime = hrtime.now();
    const events = [
      {
        name: 'event1',
        attributes: {
          key1: 'value1',
          key2: 'value2',
        },
      },
      {
        name: 'event2',
        attributes: {
          key1: 'value1',
          key2: 'value2',
        },
      },
    ];

    for (const event of events) {
      span.addEvent(event.name, event.attributes, eventTime);
      Object.assign(event, { time: eventTime, droppedAttributesCount: 0 });
    }
    Object.assign(overrides, {
      attributes: {
        'session.id': 'ffd1f2e0e3ecaf2eaf0ac4c6c68154eb',
        ...attributes,
      },
      events: events,
    });

    expectReadableSpan(span, overrides);

    const endTime = hrtime.now();
    const endAttributes = {
      key3: 'value3',
      key4: 'value4',
    };
    span.end(endAttributes, endTime);

    Object.assign(overrides, {
      attributes: {
        ...overrides.attributes,
        ...endAttributes,
      },
      endTime: endTime,
      ended: true,
    });
    expectReadableSpan(span, overrides);

    done();
  });

  it('should create a readable span without a session present', function (done) {
    const span = new Span(spanOptions({ session: undefined }));

    expectReadableSpan(span, {attributes: { 'session.id': undefined }});

    done();
  });

  it('should keep valid state', function (done) {
    const span = new Span(spanOptions());
    expect(span.isRecording()).to.be.true;
    expect(span.spanId).to.match(/^[a-f0-9]{16}$/);
    expect(span.traceId).to.match(/^[a-f0-9]{32}$/);

    span.end();
    expect(span.isRecording()).to.be.false;
    expect(span.export()).to.deep.equal(span.span);

    done();
  });

  it('should use Date.now() by default', function () {
    const nowStub = sinon.stub(Date, 'now').returns(1758315561543);

    const span = new Span(spanOptions());
    expect(span.isRecording()).to.be.true;

    span.end();
    expect(span.isRecording()).to.be.false;
    expect(span.export()).to.deep.equal(span.span);

    expect(span.span.startTime).to.deep.equal([1758315561, 543000000]);
    expect(span.span.endTime).to.deep.equal([1758315561, 543000000]);

    nowStub.restore();
  });

  it('should use the performance api when set', function () {
    const timeOriginStub = sinon.stub(
      performance, 'timeOrigin'
    ).get(() => 1758315561543);
    const nowStub = sinon.stub(performance, 'now').returns(1100.123);

    const span = new Span(spanOptions({ usePerformance: true }));
    expect(span.isRecording()).to.be.true;

    span.end();
    expect(span.isRecording()).to.be.false;
    expect(span.export()).to.deep.equal(span.span);

    expect(span.span.startTime).to.deep.equal([1758315562, 643123000]);
    expect(span.span.endTime).to.deep.equal([1758315562, 643123000]);

    timeOriginStub.restore();
    nowStub.restore();
  });
});
