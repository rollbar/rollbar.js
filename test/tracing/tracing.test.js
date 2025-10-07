import { expect } from 'chai';
import sinon from 'sinon';

import Api from '../../src/api.js';
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
    const t = new Tracing(window, null, options);
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

  it('should configure', function () {
    const options = tracingOptions();
    const t = new Tracing(window, null, options);
    t.initSession();

    expect(t.options.resource).to.deep.equal(options.resource);
    expect(t.options.version).to.equal(options.version);

    t.configure({
      resource: {
        'service.name': 'changed_service',
      },
      version: '0.2.0',
    });

    expect(t.options.resource).to.deep.equal({
      'service.name': 'changed_service',
    });
    expect(t.options.version).to.equal('0.2.0');
  });

  it('should create and export spans', function (done) {
    const options = tracingOptions();
    const t = new Tracing(window, null, options);
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
    expect(span.isRecording()).to.be.true;
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

    expect(span.isRecording()).to.be.false;
    expect(t.spanProcessor.pendingSpans.has(span.span.spanContext.spanId)).to.be
      .false;
    expect(spanExportQueue.length).to.equal(1);

    done();
  });

  it('should create spans with span option overrides', function () {
    const options = tracingOptions();
    const t = new Tracing(window, null, options);
    t.initSession();

    expect(t.sessionId).to.match(/^[a-f0-9]{32}$/);

    const span = t.startSpan('test.span', {
      resource: { attributes: { 'rollbar.environment': 'new-env' } },
    });

    expect(span.span.name).to.equal('test.span');
    expect(span.span.spanContext.traceId).to.match(/^[a-f0-9]{32}$/);
    expect(span.span.spanContext.spanId).to.match(/^[a-f0-9]{16}$/);
    expect(span.span.resource.attributes['service.name']).to.equal(
      'unknown_service',
    );
    expect(span.span.resource.attributes['rollbar.environment']).to.equal(
      'new-env',
    );
  });

  it('should get and set session attributes', function () {
    const options = tracingOptions();
    const t = new Tracing(window, null, options);
    t.initSession();

    t.session.setAttributes({ codeVersion: 'abc123' });
    t.session.setAttributes({
      'user.id': '12345',
      'user.email': 'aaa@bb.com',
    });

    expect(t.session.attributes).to.deep.include({
      codeVersion: 'abc123',
      'user.id': '12345',
      'user.email': 'aaa@bb.com',
    });
  });

  it('should not init session when sessionStorage is not detected', function () {
    const stub = sinon.stub(window, 'sessionStorage').value(undefined);
    const options = tracingOptions();
    const t = new Tracing(window, null, options);

    // calling initSession should be a no-op
    t.initSession();

    expect(t.session).to.be.undefined;
    stub.restore();
  });

  it('should generate ids', function (done) {
    const options = tracingOptions();
    const t = new Tracing(window, null, options);

    const replayId = t.idGen(8);

    expect(replayId).to.match(/^[a-f0-9]{16}$/);

    done();
  });

  describe('post', function () {
    let api;
    let transport;
    let tracing;

    beforeEach(function () {
      transport = {
        post: sinon
          .stub()
          .callsFake(({ accessToken, options, payload, callback }) => {
            setTimeout(() => {
              callback(null, { err: 0, result: { id: '12345' } });
            }, 1);
          }),
        postJsonPayload: sinon.stub(),
      };
      const urlMock = { parse: sinon.stub().returns({}) };
      const truncationMock = {
        truncate: sinon.stub().returns({ error: null, value: '{}' }),
      };

      api = new Api(
        { accessToken: 'test-token-12345' },
        transport,
        urlMock,
        truncationMock,
      );
      tracing = new Tracing(window, api, {});
      tracing.initSession();
    });

    afterEach(function () {
      sinon.restore();
    });

    it('should post a trace payload', function (done) {
      const span = tracing.startSpan('test.span');
      span.end();
      tracing.exporter.post(tracing.exporter.toPayload(), {
        'X-Rollbar-Session-Id': tracing.sessionId,
      });

      setTimeout(() => {
        expect(transport.post.callCount).to.equal(1);
        const call = transport.post.getCall(0);
        const { payload, headers } = call.args[0];
        expect(payload).to.have.property('resourceSpans');
        expect(headers).to.have.property(
          'X-Rollbar-Session-Id',
          tracing.sessionId,
        );

        done();
      }, 10);
    });
  });
});
