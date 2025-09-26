import { expect } from 'chai';

import { Span } from '../../src/tracing/span.js';
import { SpanExporter, spanExportQueue } from '../../src/tracing/exporter.js';
import { SpanProcessor } from '../../src/tracing/spanProcessor.js';
import { ROOT_CONTEXT } from '../../src/tracing/context.js';

const spanOptions = function (options = {}) {
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
    ...options,
  };
}

describe('SpanProcessor()', function () {
  it('should process pending spans', function (done) {
    const exporter = new SpanExporter();
    const spanProcessor = new SpanProcessor(exporter);

    expect(spanProcessor.pendingSpans.size).to.equal(0);

    const overrides = {
      spanProcessor: spanProcessor,
    };
    const span1 = new Span(spanOptions(overrides));

    Object.assign(overrides, {
      spanContext: {
        traceId: 'c7ab72d0c1457d0162d12dbed77a6cb5',
        spanId: '41990164f51f6104',
        traceFlags: 0,
        traceState: '',
      },
    });
    const span2 = new Span(spanOptions(overrides));

    expect(spanProcessor.pendingSpans.size).to.equal(2);

    span2.end();
    span1.end();

    expect(spanProcessor.pendingSpans.size).to.equal(0);

    done();
  });

  it('should transform spans', function (done) {
    const tracingOptions = {
      transformSpan: ({span}) => {
        span.attributes['test-group'] = 'blue';
        span.resource.attributes['rollbar.environment'] = 'prod-3';
      },
    };
    const exporter = new SpanExporter();
    const spanProcessor = new SpanProcessor(exporter, tracingOptions);

    expect(spanProcessor.pendingSpans.size).to.equal(0);

    const overrides = {
      spanProcessor: spanProcessor,
    };
    const span = new Span(spanOptions(overrides));

    expect(spanProcessor.pendingSpans.size).to.equal(1);

    span.end();

    expect(span.span.attributes['test-group']).to.equal('blue');
    expect(span.span.resource.attributes['rollbar.environment']).to.equal('prod-3');
    expect(spanProcessor.pendingSpans.size).to.equal(0);

    done();
  });

  it('should catch exception in transformSpan', function (done) {
    const tracingOptions = {
      transformSpan: ({span}) => {
        throw new Error('test error');
      },
    };
    const exporter = new SpanExporter();
    const spanProcessor = new SpanProcessor(exporter, tracingOptions);

    expect(spanProcessor.pendingSpans.size).to.equal(0);

    const overrides = {
      spanProcessor: spanProcessor,
    };
    const span = new Span(spanOptions(overrides));

    expect(spanProcessor.pendingSpans.size).to.equal(1);

    span.end();

    expect(spanProcessor.pendingSpans.size).to.equal(0);

    done();
  });
});
