/* globals describe */
/* globals it */

import { expect } from 'chai';

import {
  ContextManager,
  createContextKey,
} from '../../src/tracing/contextManager.js';
import { Session } from '../../src/tracing/session.js';
import { SpanExporter, spanExportQueue } from '../../src/tracing/exporter.js';
import { SpanProcessor } from '../../src/tracing/spanProcessor.js';
import { Tracer } from '../../src/tracing/tracer.js';
import { ROOT_CONTEXT } from '../../src/tracing/context.js';
import Tracing from '../../src/tracing/tracing.js';

const tracingOptions = function (options = {}) {
  return {
    resource: {
      'service.name': 'unknown_service',
      'telemetry.sdk.language': 'webjs',
      'telemetry.sdk.name': 'rollbar',
      'telemetry.sdk.version': '0.1.0',
    },
    version: '0.1.0',
    ...options,
  };
};

describe('Tracing()', function () {
  it('should initialize', function (done) {
    const options = tracingOptions();
    const t = new Tracing(window, options);
    t.initSession();

    expect(t).to.have.property('initSession').and.to.be.a('function');
    expect(t).to.have.property('createTracer').and.to.be.a('function');
    expect(t).to.have.property('getTracer').and.to.be.a('function');
    expect(t).to.have.property('getSpan').and.to.be.a('function');
    expect(t).to.have.property('setSpan').and.to.be.a('function');
    expect(t).to.have.property('with').and.to.be.a('function');
    expect(t).to.have.property('withSpan').and.to.be.a('function');

    expect(t.contextManager).to.be.an.instanceOf(ContextManager);
    expect(t.session).to.be.an.instanceOf(Session);
    expect(t.exporter).to.be.an.instanceOf(SpanExporter);
    expect(t.spanProcessor).to.be.an.instanceOf(SpanProcessor);
    expect(t.tracer).to.be.an.instanceOf(Tracer);

    expect(t.options.resource).to.deep.equal(options.resource);
    expect(t.options.version).to.equal(options.version);
    expect(t.session.session.id).to.match(/^[a-f0-9]{32}$/);
    done();
  });

  it('should create and export spans', function (done) {
    const options = tracingOptions();
    const t = new Tracing(window, options);
    t.initSession();

    expect(t.sessionId).to.match(/^[a-f0-9]{32}$/);

    const span = t.startSpan('test.span');

    expect(span.span.name).to.equal('test.span');
    expect(span.span.spanContext.traceId).to.match(/^[a-f0-9]{32}$/);
    expect(span.span.spanContext.spanId).to.match(/^[a-f0-9]{16}$/);
    expect(span.span.resource.attributes['service.name']).to.equal(
      'unknown_service',
    );
    expect(span.span.instrumentationScope.name).to.equal('rollbar-browser-js');
    expect(span.span.instrumentationScope.version).to.equal('0.1.0');
    expect(span.isRecording()).to.equal(true);
    expect(t.contextManager.active()).to.equal(ROOT_CONTEXT);

    const context = t.setSpan(t.contextManager.active(), span);

    expect(context).to.not.equal(ROOT_CONTEXT);

    const prevContext = t.contextManager.enterContext(context);

    expect(t.contextManager.active()).to.not.equal(ROOT_CONTEXT);
    expect(prevContext).to.equal(ROOT_CONTEXT);

    t.contextManager.exitContext(prevContext);

    expect(t.contextManager.active()).to.equal(ROOT_CONTEXT);
    expect(t.spanProcessor.pendingSpans.has(span.span.spanContext.spanId)).to.be
      .true;
    expect(spanExportQueue.length).to.equal(0);

    span.end();

    expect(span.isRecording()).to.equal(false);
    expect(t.spanProcessor.pendingSpans.has(span.span.spanContext.spanId)).to.be
      .false;
    expect(spanExportQueue.length).to.equal(1);

    done();
  });

  it('should generate ids', function (done) {
    const options = tracingOptions();
    const t = new Tracing(window, options);

    const replayId = t.idGen(8);

    expect(replayId).to.match(/^[a-f0-9]{16}$/);

    done();
  });
});
