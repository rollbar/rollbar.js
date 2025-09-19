import { expect } from 'chai';
import sinon from 'sinon';
import { EventType } from '@rrweb/types';

import { SpanExporter, spanExportQueue } from '../../src/tracing/exporter.js';
import hrtime from '../../src/tracing/hrtime.js';
import id from '../../src/tracing/id.js';
import { standardPayload } from '../fixtures/replay/payloads.fixtures.js';

describe('SpanExporter.toPayload()', function () {
  let exporter;
  let hrtimeStub;
  let idStub;

  beforeEach(function () {
    spanExportQueue.length = 0;
    exporter = new SpanExporter({});

    hrtimeStub = sinon.stub(hrtime, 'now').returns([1, 2]);
    sinon.stub(hrtime, 'toNanos').returns(1000000000);
    idStub = sinon.stub(id, 'gen').returns('1234567890abcdef');
  });

  afterEach(function () {
    spanExportQueue.length = 0;
    sinon.restore();
  });

  it('should return empty resourceSpans when queue is empty', function () {
    const payload = exporter.toPayload();
    expect(payload).to.deep.equal({ resourceSpans: [] });
  });

  it('should transform a simple span into OTLP format', function () {
    const mockSpan = {
      name: 'test-span',
      spanContext: {
        traceId: 'abcdef1234567890abcdef1234567890',
        spanId: '1234567890abcdef',
      },
      startTime: hrtime.now(),
      endTime: hrtime.now(),
      attributes: {
        'test.attribute': 'test-value',
      },
      events: [],
      resource: {
        attributes: {
          'service.name': 'test-service',
        },
      },
    };

    exporter.export([mockSpan]);
    const payload = exporter.toPayload();

    expect(payload).to.have.property('resourceSpans').that.is.an('array');
    expect(payload.resourceSpans).to.have.lengthOf(1);
    expect(payload.resourceSpans[0]).to.have.property('resource');
    expect(payload.resourceSpans[0])
      .to.have.property('scopeSpans')
      .that.is.an('array');
    expect(payload.resourceSpans[0].scopeSpans).to.have.lengthOf(1);

    const transformedSpan = payload.resourceSpans[0].scopeSpans[0].spans[0];
    expect(transformedSpan).to.have.property('name', 'test-span');
    expect(transformedSpan).to.have.property(
      'traceId',
      'abcdef1234567890abcdef1234567890',
    );
    expect(transformedSpan).to.have.property('spanId', '1234567890abcdef');

    expect(transformedSpan).to.have.property('attributes').that.is.an('array');
    const attribute = transformedSpan.attributes.find(
      (attr) => attr.key === 'test.attribute',
    );
    expect(attribute).to.exist;
    expect(attribute.value).to.have.property('stringValue', 'test-value');
  });

  it('should handle spans with different attribute types correctly', function () {
    const mockSpan = {
      name: 'attribute-test-span',
      spanContext: {
        traceId: 'abcdef1234567890abcdef1234567890',
        spanId: '1234567890abcdef',
      },
      startTime: hrtime.now(),
      endTime: hrtime.now(),
      attributes: {
        stringAttr: 'string-value',
        intAttr: 42,
        floatAttr: 3.14,
        boolAttr: true,
        nullAttr: null,
        arrayAttr: [1, 'two', true],
        objectAttr: { nested: 'value' },
      },
      events: [],
      resource: {
        attributes: {},
      },
    };

    exporter.export([mockSpan]);
    const payload = exporter.toPayload();
    const attributes =
      payload.resourceSpans[0].scopeSpans[0].spans[0].attributes;

    const stringAttr = attributes.find((a) => a.key === 'stringAttr');
    expect(stringAttr.value).to.have.property('stringValue', 'string-value');

    const intAttr = attributes.find((a) => a.key === 'intAttr');
    expect(intAttr.value).to.have.property('intValue', '42');

    const floatAttr = attributes.find((a) => a.key === 'floatAttr');
    expect(floatAttr.value).to.have.property('doubleValue', 3.14);

    const boolAttr = attributes.find((a) => a.key === 'boolAttr');
    expect(boolAttr.value).to.have.property('boolValue', true);

    const nullAttr = attributes.find((a) => a.key === 'nullAttr');
    expect(nullAttr.value).to.have.property('stringValue', '');

    const arrayAttr = attributes.find((a) => a.key === 'arrayAttr');
    expect(arrayAttr.value).to.have.property('arrayValue');
    expect(arrayAttr.value.arrayValue.values).to.have.lengthOf(3);

    const objectAttr = attributes.find((a) => a.key === 'objectAttr');
    expect(objectAttr.value).to.have.property('kvlistValue');
  });

  it('should handle spans with events correctly', function () {
    const eventTime = hrtime.now();

    const mockSpan = {
      name: 'event-test-span',
      spanContext: {
        traceId: 'abcdef1234567890abcdef1234567890',
        spanId: '1234567890abcdef',
      },
      startTime: hrtime.now(),
      endTime: hrtime.now(),
      attributes: {},
      events: [
        {
          name: 'test-event-1',
          time: eventTime,
          attributes: {
            'event.key1': 'value1',
          },
        },
        {
          name: 'test-event-2',
          time: eventTime,
          attributes: {
            'event.key2': 'value2',
          },
        },
      ],
      resource: {
        attributes: {},
      },
    };

    exporter.export([mockSpan]);
    const payload = exporter.toPayload();
    const events = payload.resourceSpans[0].scopeSpans[0].spans[0].events;

    expect(events).to.have.lengthOf(2);
    expect(events[0]).to.have.property('name', 'test-event-1');
    expect(events[1]).to.have.property('name', 'test-event-2');

    expect(events[0]).to.have.property('timeUnixNano').that.is.a('number');

    const eventAttribute = events[0].attributes.find(
      (a) => a.key === 'event.key1',
    );
    expect(eventAttribute).to.exist;
    expect(eventAttribute.value).to.have.property('stringValue', 'value1');
  });

  it('should handle multiple spans with different scopes', function () {
    const span1 = {
      name: 'span1',
      spanContext: {
        traceId: 'abcdef1234567890abcdef1234567890',
        spanId: '1111111111111111',
      },
      startTime: hrtime.now(),
      endTime: hrtime.now(),
      attributes: {},
      events: [],
      instrumentationScope: {
        name: 'scope1',
        version: '1.0.0',
      },
      resource: {
        attributes: {},
      },
    };

    const span2 = {
      name: 'span2',
      spanContext: {
        traceId: 'abcdef1234567890abcdef1234567890',
        spanId: '2222222222222222',
      },
      startTime: hrtime.now(),
      endTime: hrtime.now(),
      attributes: {},
      events: [],
      instrumentationScope: {
        name: 'scope2',
        version: '1.0.0',
      },
      resource: {
        attributes: {},
      },
    };

    const span3 = {
      name: 'span3',
      spanContext: {
        traceId: 'abcdef1234567890abcdef1234567890',
        spanId: '3333333333333333',
      },
      startTime: hrtime.now(),
      endTime: hrtime.now(),
      attributes: {},
      events: [],
      instrumentationScope: {
        name: 'scope1',
        version: '1.0.0',
      },
      resource: {
        attributes: {},
      },
    };

    exporter.export([span1, span2, span3]);
    const payload = exporter.toPayload();

    expect(payload.resourceSpans).to.have.lengthOf(1);
    expect(payload.resourceSpans[0].scopeSpans).to.have.lengthOf(2);

    const scope1 = payload.resourceSpans[0].scopeSpans.find(
      (s) => s.scope.name === 'scope1',
    );
    const scope2 = payload.resourceSpans[0].scopeSpans.find(
      (s) => s.scope.name === 'scope2',
    );

    expect(scope1).to.exist;
    expect(scope2).to.exist;

    expect(scope1.spans).to.have.lengthOf(2);
    expect(scope2.spans).to.have.lengthOf(1);
  });

  it('should use default scope for spans without instrumentation scope', function () {
    const mockSpan = {
      name: 'no-scope-span',
      spanContext: {
        traceId: 'abcdef1234567890abcdef1234567890',
        spanId: '1234567890abcdef',
      },
      startTime: hrtime.now(),
      endTime: hrtime.now(),
      attributes: {},
      events: [],
      resource: {
        attributes: {},
      },
      // No instrumentationScope property
    };

    exporter.export([mockSpan]);
    const payload = exporter.toPayload();

    const scope = payload.resourceSpans[0].scopeSpans[0].scope;
    expect(scope).to.deep.equal({
      name: 'default',
      version: '1.0.0',
      attributes: [],
    });
  });

  it('should produce a payload compatible with standardPayload fixture', function () {
    const span = {
      name: 'rrweb-replay-recording',
      spanContext: {
        traceId: 'abcdef1234567890abcdef1234567890',
        spanId: '1234567890abcdef',
      },
      startTime: hrtime.now(),
      endTime: hrtime.now(),
      attributes: {
        'rollbar.replay.id': 'test-replay-id',
      },
      events: [
        {
          name: 'rrweb-replay-events',
          time: hrtime.now(),
          attributes: {
            eventType: String(EventType.Meta),
            json: '{}',
          },
        },
        {
          name: 'rrweb-replay-events',
          time: hrtime.now(),
          attributes: {
            eventType: String(EventType.FullSnapshot),
            json: '{}',
          },
        },
      ],
      instrumentationScope: {
        name: 'rollbar.js',
        version: '1.0.0',
      },
      resource: {
        attributes: {
          'service.name': 'test_service',
          'rollbar.environment': 'testenv',
        },
      },
    };

    exporter.export([span]);
    const payload = exporter.toPayload();

    const expected = JSON.parse(JSON.stringify(standardPayload));
    const actualSpan = payload.resourceSpans[0].scopeSpans[0].spans[0];

    expect(actualSpan.traceId).to.equal('abcdef1234567890abcdef1234567890');
    expect(actualSpan.spanId).to.equal('1234567890abcdef');

    expect(actualSpan.startTimeUnixNano).to.equal(1000000000);
    expect(actualSpan.endTimeUnixNano).to.equal(1000000000);

    actualSpan.events.forEach((event) => {
      expect(event.timeUnixNano).to.equal(1000000000);
    });

    function createComparablePayload(payload) {
      const clone = JSON.parse(JSON.stringify(payload));

      // Remove fields with dynamic values that we verified separately
      const span = clone.resourceSpans[0].scopeSpans[0].spans[0];
      delete span.traceId;
      delete span.spanId;
      delete span.parentSpanId;
      delete span.startTimeUnixNano;
      delete span.endTimeUnixNano;
      delete span.kind;

      span.events.forEach((event) => {
        delete event.timeUnixNano;
      });

      return clone;
    }

    const comparablePayload = createComparablePayload(payload);
    const comparableStandard = createComparablePayload(standardPayload);

    expect(
      comparablePayload.resourceSpans[0].scopeSpans[0].spans[0].name,
    ).to.deep.equal(
      comparableStandard.resourceSpans[0].scopeSpans[0].spans[0].name,
      'Span names should match',
    );

    expect(
      comparablePayload.resourceSpans[0].scopeSpans[0].spans[0].attributes,
    ).to.deep.equal(
      comparableStandard.resourceSpans[0].scopeSpans[0].spans[0].attributes,
      'Span attributes should match',
    );

    expect(
      comparablePayload.resourceSpans[0].scopeSpans[0].spans[0].events,
    ).to.deep.equal(
      comparableStandard.resourceSpans[0].scopeSpans[0].spans[0].events,
      'Span events should match',
    );

    expect(comparablePayload).to.deep.equal(
      comparableStandard,
      'Complete payload structure should match',
    );
  });
});

describe('SpanExporter with log level', function () {
  let hrtimeStub;
  let idStub;
  let consoleLogSpy;

  beforeEach(function () {
    spanExportQueue.length = 0;
    hrtimeStub = sinon.stub(hrtime, 'now').returns([1, 2]);
    sinon.stub(hrtime, 'toNanos').returns(1000000000);
    idStub = sinon.stub(id, 'gen').returns('1234567890abcdef');
    consoleLogSpy = sinon.spy(console, 'log');
  });
  afterEach(function () {
    spanExportQueue.length = 0;
    sinon.restore();
  });

  it('should not log', function () {
    let exporter = new SpanExporter({
      debug: { logEmits: false },
    });

    const mockSpan = {
      name: 'test-span',
      spanContext: {
        traceId: 'abcdef1234567890abcdef1234567890',
        spanId: '1234567890abcdef',
      },
      startTime: hrtime.now(),
      endTime: hrtime.now(),
      attributes: {
        'test.attribute': 'test-value',
      },
      events: [],
      resource: {
        attributes: {
          'service.name': 'test-service',
        },
      },
    };

    exporter.export([mockSpan]);
    expect(consoleLogSpy.callCount).to.equal(0);
  });
  it('should log', function () {
    let exporter = new SpanExporter({
      debug: { logEmits: true },
    });

    const mockSpan = {
      name: 'test-span',
      spanContext: {
        traceId: 'abcdef1234567890abcdef1234567890',
        spanId: '1234567890abcdef',
      },
      startTime: hrtime.now(),
      endTime: hrtime.now(),
      attributes: {
        'test.attribute': 'test-value',
      },
      events: [],
      resource: {
        attributes: {
          'service.name': 'test-service',
        },
      },
    };

    exporter.export([mockSpan]);
    expect(consoleLogSpy.callCount).to.equal(1);
  });
});
