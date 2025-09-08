import { expect } from 'chai';
import sinon from 'sinon';

import { setTimeout } from './util/timers.js';

import Rollbar from '../src/browser/rollbar.js';

describe('options.autoInstrument', function () {
  beforeEach(function () {
    window.server = sinon.createFakeServer();
  });

  afterEach(function () {
    window.rollbar.configure({ autoInstrument: false, captureUncaught: false });
    window.server.restore();
  });

  function stubResponse(server) {
    server.respondWith('POST', 'api/1/item', [
      200,
      { 'Content-Type': 'application/json' },
      '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}',
    ]);
  }

  describe('fetch', function () {
    it('should add telemetry events', async function () {
      const server = window.server;
      expect(server).to.exist;

      stubResponse(server);
      server.requests.length = 0;

      window.fetchStub = sinon.stub(window, 'fetch');

      const responseBody = JSON.stringify({ name: 'foo', password: '123456' });
      window.fetch.returns(
        Promise.resolve(
          new Response(responseBody, {
            status: 200,
            statusText: 'OK',
            headers: { 'content-type': 'application/json', password: '123456' },
          }),
        ),
      );

      const rollbar = (window.rollbar = new Rollbar({
        accessToken: 'POST_CLIENT_ITEM_TOKEN',
        autoInstrument: {
          log: false,
          network: true,
          networkResponseHeaders: true,
          networkResponseBody: true,
          networkRequestBody: true,
          networkRequestHeaders: true,
        },
      }));

      const fetchHeaders = new Headers();
      fetchHeaders.append('Content-Type', 'application/json');
      fetchHeaders.append('Secret', '123456');

      const fetchRequest = new Request('https://example.com/fetch-test');
      const fetchInit = {
        method: 'POST',
        headers: fetchHeaders,
        body: JSON.stringify({ name: 'bar', secret: 'fetch post' }),
      };

      await window
        .fetch(fetchRequest, fetchInit)
        .then((response) => {
          // Assert that the original stream reader hasn't been read.
          expect(response.bodyUsed).to.be.false;
          return response.text();
        })
        .then(async (text) => {
          expect(text).to.eql(responseBody);

          rollbar.log('test'); // generate a payload to inspect

          await setTimeout(1);

          server.respond();

          expect(window.fetchStub.called).to.be.true;
          expect(server.requests).to.have.lengthOf(1);
          const body = JSON.parse(server.requests[0].requestBody);

          // Verify request capture and scrubbing
          expect(body.data.body.telemetry[0].body.request).to.eql(
            '{"name":"bar","secret":"********"}',
          );

          // Verify request headers capture and case-insensitive scrubbing
          expect(body.data.body.telemetry[0].body.request_headers).to.eql({
            'content-type': 'application/json',
            secret: '********',
          });

          // Verify response capture and scrubbing
          expect(body.data.body.telemetry[0].body.response.body).to.eql(
            '{"name":"foo","password":"********"}',
          );

          // Verify response headers capture and case-insensitive scrubbing
          expect(body.data.body.telemetry[0].body.response.headers).to.eql({
            'content-type': 'application/json',
            password: '********',
          });

          rollbar.configure({ autoInstrument: false });
          window.fetch.restore();
        });
    });

    it('should report error for http 4xx when enabled', async function () {
      const server = window.server;
      expect(server).to.exist;

      stubResponse(server);
      server.requests.length = 0;

      window.fetchStub = sinon.stub(window, 'fetch');
      window.fetch.returns(
        Promise.resolve(
          new Response(JSON.stringify({ foo: 'bar' }), {
            status: 404,
            statusText: 'Not Found',
            headers: { 'content-type': 'application/json' },
          }),
        ),
      );

      const rollbar = (window.rollbar = new Rollbar({
        accessToken: 'POST_CLIENT_ITEM_TOKEN',
        autoInstrument: {
          log: false,
          network: true,
          networkErrorOnHttp4xx: true,
        },
      }));

      const fetchHeaders = new Headers();
      fetchHeaders.append('Content-Type', 'application/json');

      const fetchRequest = new Request('https://example.com/xhr-test');
      const fetchInit = {
        method: 'POST',
        headers: fetchHeaders,
        body: JSON.stringify({ foo: 'bar' }),
      };

      await window.fetch(fetchRequest, fetchInit).then(async (_response) => {
        await setTimeout(1);

        server.respond();

        expect(server.requests).to.have.lengthOf(1);
        const body = JSON.parse(server.requests[0].requestBody);

        expect(body.data.body.trace.exception.message).to.eql(
          'HTTP request failed with Status 404',
        );

        // Just knowing a stack is present is enough for this test.
        expect(body.data.body.trace.frames).to.have.lengthOf.above(1);

        rollbar.configure({ autoInstrument: false });
        window.fetch.restore();
      });
    });

    it('should add telemetry headers when fetch Headers object is undefined', async function () {
      const server = window.server;
      expect(server).to.exist;

      stubResponse(server);
      server.requests.length = 0;

      window.fetchStub = sinon.stub(window, 'fetch');

      const readableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            JSON.stringify({ name: 'foo', password: '123456' }),
          );
          controller.close();
        },
      });

      window.fetch.returns(
        Promise.resolve(
          new Response(readableStream, {
            status: 200,
            statusText: 'OK',
            headers: { 'content-type': 'application/json', password: '123456' },
          }),
        ),
      );

      const rollbar = (window.rollbar = new Rollbar({
        accessToken: 'POST_CLIENT_ITEM_TOKEN',
        autoInstrument: {
          log: false,
          network: true,
          networkResponseHeaders: true,
          networkRequestHeaders: true,
        },
      }));

      // Remove Headers from window object
      const originalHeaders = window.Headers;
      delete window.Headers;

      const fetchRequest = new Request('https://example.com/xhr-test');
      const fetchInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Secret: '123456' },
        body: JSON.stringify({ name: 'bar', secret: 'xhr post' }),
      };

      await window.fetch(fetchRequest, fetchInit).then(async (response) => {
        rollbar.log('test'); // generate a payload to inspect

        await setTimeout(1);

        server.respond();

        expect(server.requests).to.have.lengthOf(1);
        const body = JSON.parse(server.requests[0].requestBody);

        // Verify request headers capture and case-insensitive scrubbing
        expect(body.data.body.telemetry[0].body.request_headers).to.eql({
          'content-type': 'application/json',
          secret: '********',
        });

        // Verify response headers capture and case-insensitive scrubbing
        expect(body.data.body.telemetry[0].body.response.headers).to.eql({
          'content-type': 'application/json',
          password: '********',
        });

        // Assert that the original stream reader hasn't been read.
        expect(response.bodyUsed).to.be.false;

        rollbar.configure({ autoInstrument: false });
        window.fetch.restore();
        window.Headers = originalHeaders;
      });
    });
  });
});
