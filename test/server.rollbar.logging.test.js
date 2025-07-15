/* globals describe */
/* globals it */
/* globals beforeEach */

import { expect } from 'chai';
import sinon from 'sinon';
import Rollbar from '../src/server/rollbar.js';
import {
  TestClient,
  ValidOpenTracingTracerStub,
  InvalidOpenTracingTracerStub,
  DUMMY_TRACE_ID,
  DUMMY_SPAN_ID,
} from './server.rollbar.test-utils.mjs';

describe('rollbar logging and tracing', function () {
  describe('addTracingInfo', function () {
    describe('with valid tracer', function () {
      let rollbar;

      beforeEach(function () {
        rollbar = new Rollbar({
          captureUncaught: true,
          environment: 'fake-env',
          tracer: ValidOpenTracingTracerStub,
        });
      });

      it('should add trace ID and span ID to custom field on item if no custom field set', function () {
        const item = { uuid: 'some-uuid', custom: null };
        rollbar.client._addTracingInfo(item);
        expect(item.custom.opentracing_trace_id).to.equal(DUMMY_TRACE_ID);
        expect(item.custom.opentracing_span_id).to.equal(DUMMY_SPAN_ID);
      });

      it('should add trace ID and span ID to custom field on item even if already has some custom fields', function () {
        const item = { uuid: 'some-uuid', custom: { foo: 'foo' } };
        rollbar.client._addTracingInfo(item);
        expect(item.custom.opentracing_trace_id).to.equal(DUMMY_TRACE_ID);
        expect(item.custom.opentracing_span_id).to.equal(DUMMY_SPAN_ID);
        expect(item.custom.foo).to.equal('foo');
      });
    });

    describe('with invalid tracer', function () {
      it('should add trace ID and span ID to custom field on item', function () {
        const rollbar = new Rollbar({
          captureUncaught: true,
          environment: 'fake-env',
          tracer: InvalidOpenTracingTracerStub,
        });
        const item = { uuid: 'some-uuid', custom: {} };
        rollbar.client._addTracingInfo(item);
        expect(item.custom.opentracing_trace_id).to.be.undefined;
        expect(item.custom.opentracing_span_id).to.be.undefined;
      });
    });
  });

  describe('log', function () {
    describe('message', function () {
      let rollbar;
      let client;

      beforeEach(function () {
        client = new TestClient();
        rollbar = new Rollbar({ accessToken: 'abc123' }, client);
      });

      describe('unordered options', function () {
        it('should work with custom, request, callback and message', function () {
          const custom = { a: 1, b: 2 };
          const request = { method: 'GET' };
          const callback = sinon.stub();
          const message = 'hello world';
          rollbar.log(custom, request, callback, message);

          const item = rollbar.client.logCalls[0].item;
          expect(item.custom).to.deep.equal(custom);
          expect(item.request).to.deep.equal(request);
          expect(item.message).to.equal(message);

          item.callback();
          expect(callback.calledOnce).to.be.true;
        });
      });

      describe('old option ordering', function () {
        it('should work with message only', function () {
          rollbar.log('hello world');
          expect(client.logCalls[0].item.message).to.equal('hello world');
          expect(client.logCalls[0].func).to.equal('log');
        });

        it('should work with message and null or undefined', function () {
          rollbar.log('hello world');
          expect(client.logCalls[0].item.message).to.equal('hello world');
          expect(client.logCalls[0].func).to.equal('log');

          rollbar.log('world hello', null);
          expect(client.logCalls[1].item.message).to.equal('world hello');
          expect(client.logCalls[1].func).to.equal('log');

          rollbar.log('olleh dlrow', undefined);
          expect(client.logCalls[2].item.message).to.equal('olleh dlrow');
          expect(client.logCalls[2].func).to.equal('log');
        });

        it('should work with message and callback', function () {
          const callback = sinon.stub();
          rollbar.log('hello world', callback);

          const item = client.logCalls[0].item;
          expect(item.message).to.equal('hello world');

          item.callback();
          expect(callback.calledOnce).to.be.true;
        });

        it('should work with message and request', function () {
          const request = { method: 'GET' };
          rollbar.log('hello world', request);

          const item = client.logCalls[0].item;
          expect(item.message).to.equal('hello world');
          expect(item.request).to.deep.equal(request);
        });

        it('should work with message, request and callback', function () {
          const request = { method: 'GET' };
          const callback = sinon.stub();
          rollbar.log('hello world', request, callback);

          const item = client.logCalls[0].item;
          expect(item.message).to.equal('hello world');
          expect(item.request).to.deep.equal(request);

          item.callback();
          expect(callback.calledOnce).to.be.true;
        });

        it('should work with message, request and custom', function () {
          const request = { method: 'GET' };
          const custom = { a: 1, b: 2 };
          rollbar.log('hello world', request, custom);

          const item = client.logCalls[0].item;
          expect(item.message).to.equal('hello world');
          expect(item.request).to.deep.equal(request);
          expect(item.custom).to.deep.equal(custom);
        });

        it('should work with message, request, custom and callback', function () {
          const request = { method: 'GET' };
          const custom = { a: 1, b: 2 };
          const callback = sinon.stub();
          rollbar.log('hello world', request, custom, callback);

          const item = client.logCalls[0].item;
          expect(item.message).to.equal('hello world');
          expect(item.request).to.deep.equal(request);
          expect(item.custom).to.deep.equal(custom);

          item.callback();
          expect(callback.calledOnce).to.be.true;
        });
      });
    });

    describe('info', function () {
      let rollbar;
      let addItemStub;

      beforeEach(function () {
        // Uses real client and stubs queue.addItem so transforms can run.
        rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUncaught: false,
        });
        addItemStub = sinon.stub(rollbar.client.notifier.queue, 'addItem');
      });

      afterEach(function () {
        addItemStub.restore();
      });

      it('should send message when called with null or undefined', function () {
        rollbar.info();
        expect(addItemStub.calledOnce).to.be.true;
        expect(addItemStub.getCall(0).args[3].data.body.message.body).to.equal(
          'Item sent with null or missing arguments.',
        );

        rollbar.info(null);
        expect(addItemStub.calledTwice).to.be.true;
        expect(addItemStub.getCall(1).args[3].data.body.message.body).to.equal(
          'Item sent with null or missing arguments.',
        );

        rollbar.info(undefined);
        expect(addItemStub.calledThrice).to.be.true;
        expect(addItemStub.getCall(2).args[3].data.body.message.body).to.equal(
          'Item sent with null or missing arguments.',
        );
      });
    });

    describe('error', function () {
      let rollbar;
      let client;

      beforeEach(function () {
        client = new TestClient();
        rollbar = new Rollbar({ accessToken: 'abc123' }, client);
      });

      describe('unordered options', function () {
        it('should work with custom, request, callback and error', function () {
          const custom = { a: 1, b: 2 };
          const request = { method: 'GET' };
          const callback = sinon.stub();
          const error = new Error('hello world');
          rollbar.log(custom, request, callback, error);

          const item = rollbar.client.logCalls[0].item;
          expect(item.custom).to.deep.equal(custom);
          expect(item.request).to.deep.equal(request);
          expect(item.err).to.equal(error);

          item.callback();
          expect(callback.calledOnce).to.be.true;
        });
      });

      describe('old option ordering', function () {
        it('should work with error only', function () {
          const error = new Error('hello world');
          rollbar.log(error);
          expect(client.logCalls[0].item.err).to.equal(error);
          expect(client.logCalls[0].func).to.equal('log');
        });

        it('should work with error and null or undefined', function () {
          let error = new Error('hello world');
          rollbar.log(error);
          expect(client.logCalls[0].item.err).to.equal(error);
          expect(client.logCalls[0].item.err.message).to.equal('hello world');

          error = new Error('world hello');
          rollbar.log(error, null);
          expect(client.logCalls[1].item.err).to.equal(error);
          expect(client.logCalls[1].item.err.message).to.equal('world hello');

          error = new Error('olleh dlrow');
          rollbar.log(error, undefined);
          expect(client.logCalls[2].item.err).to.equal(error);
          expect(client.logCalls[2].item.err.message).to.equal('olleh dlrow');
        });

        it('should work with error and callback', function () {
          const error = new Error('hello world');
          const callback = sinon.stub();
          rollbar.log(error, callback);

          const item = client.logCalls[0].item;
          expect(item.err).to.equal(error);

          item.callback();
          expect(callback.calledOnce).to.be.true;
        });

        it('should work with message and request', function () {
          const error = new Error('hello world');
          const request = { method: 'GET' };
          rollbar.log(error, request);

          const item = client.logCalls[0].item;
          expect(item.err).to.equal(error);
          expect(item.request).to.deep.equal(request);
        });

        it('should work with message, request and callback', function () {
          const error = new Error('hello world');
          const request = { method: 'GET' };
          const callback = sinon.stub();
          rollbar.log(error, request, callback);

          const item = client.logCalls[0].item;
          expect(item.err).to.equal(error);
          expect(item.request).to.deep.equal(request);

          item.callback();
          expect(callback.calledOnce).to.be.true;
        });

        it('should work with message, request and custom', function () {
          const error = new Error('hello world');
          const request = { method: 'GET' };
          const custom = { a: 1, b: 2 };
          rollbar.log(error, request, custom);

          const item = client.logCalls[0].item;
          expect(item.err).to.equal(error);
          expect(item.request).to.deep.equal(request);
          expect(item.custom).to.deep.equal(custom);
        });

        it('should work with message, request, custom and callback', function () {
          const error = new Error('hello world');
          const request = { method: 'GET' };
          const custom = { a: 1, b: 2 };
          const callback = sinon.stub();
          rollbar.log(error, request, custom, callback);

          const item = client.logCalls[0].item;
          expect(item.err).to.equal(error);
          expect(item.request).to.deep.equal(request);
          expect(item.custom).to.deep.equal(custom);

          item.callback();
          expect(callback.calledOnce).to.be.true;
        });
      });
    });
  });
});
