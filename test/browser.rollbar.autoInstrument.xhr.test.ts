import { expect } from 'chai';

import Rollbar from '../src/browser/rollbar.js';

import { fakeServer } from './browser.rollbar.test-utils.ts';
import { setTimeoutAsync } from './util/timers.ts';

describe('options.autoInstrument', function () {
  beforeEach(function () {
    window.server = fakeServer.create();
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

  function initRollbarForNetworkTelemetry() {
    const options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      autoInstrument: {
        log: false,
        network: true,
        networkResponseHeaders: true,
        networkResponseBody: true,
        networkRequestBody: true,
        networkRequestHeaders: true,
      },
    };
    return new Rollbar(options);
  }

  it('should add telemetry events for POST xhr calls', async function () {
    const server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    server.respondWith('POST', 'https://example.com/xhr-test', [
      200,
      { 'Content-Type': 'application/json', Password: '123456' },
      JSON.stringify({ name: 'foo', password: '123456' }),
    ]);

    const rollbar = (window.rollbar = initRollbarForNetworkTelemetry());

    // generate a telemetry event
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://example.com/xhr-test', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Secret', 'abcdef');
    xhr.onreadystatechange = async function () {
      if (xhr.readyState === 4) {
        rollbar.log('test'); // generate a payload to inspect

        await setTimeoutAsync(1);

        server.respond();

        expect(server.requests.length).to.eql(2);
        const body = JSON.parse(server.requests[1].requestBody);

        // Verify request capture and scrubbing
        expect(body.data.body.telemetry[0].body.request).to.eql(
          '{"name":"bar","secret":"********"}',
        );

        // Verify request headers capture and case-insensitive scrubbing
        expect(body.data.body.telemetry[0].body.request_headers).to.eql({
          'Content-type': 'application/json',
          Secret: '********',
        });

        // Verify response capture and scrubbing
        expect(body.data.body.telemetry[0].body.response.body).to.eql(
          '{"name":"foo","password":"********"}',
        );
        expect(
          body.data.body.telemetry[0].body.response.headers['Password'],
        ).to.eql('********');
      }
    };
    xhr.send(JSON.stringify({ name: 'bar', secret: 'xhr post' }));
    server.respond();
  });

  it('should add baggage header when propagation enabled', async function () {
    const server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    server.respondWith('POST', 'https://example.com/xhr-test', [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify({ ok: true }),
    ]);

    const rollbar = (window.rollbar = new Rollbar({
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      tracing: {
        propagation: {
          enabledHeaders: ['baggage'],
          enabledCorsUrls: ['https://example.com/xhr-test'],
        },
      },
      autoInstrument: {
        log: false,
        network: true,
        networkRequestHeaders: true,
      },
    }));

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://example.com/xhr-test', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = async function () {
      if (xhr.readyState === 4) {
        rollbar.log('test'); // generate a payload to inspect

        await setTimeoutAsync(1);

        server.respond();

        expect(server.requests.length).to.eql(2);
        const body = JSON.parse(server.requests[1].requestBody);

        expect(body.data.body.telemetry[0].body.request_headers).to.include({
          baggage: `rollbar.session.id=${rollbar.tracing.sessionId}`,
        });
      }
    };
    xhr.send(JSON.stringify({ name: 'bar' }));
    server.respond();
  });

  it('should add telemetry events for GET xhr calls', async function () {
    const server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    server.respondWith('GET', 'https://example.com/xhr-test', [
      200,
      { 'Content-Type': 'application/json', Password: 'abcdef' },
      JSON.stringify({ name: 'foo', password: '123456' }),
    ]);

    const rollbar = (window.rollbar = initRollbarForNetworkTelemetry());

    // generate a telemetry event
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://example.com/xhr-test', true);
    xhr.setRequestHeader('Secret', 'abcdef');
    xhr.onreadystatechange = async function () {
      if (xhr.readyState === 4) {
        rollbar.log('test'); // generate a payload to inspect

        await setTimeoutAsync(1);

        server.respond();

        expect(server.requests.length).to.eql(2);
        const body = JSON.parse(server.requests[1].requestBody);

        // Verify request headers capture and case-insensitive scrubbing
        expect(body.data.body.telemetry[0].body.request_headers).to.eql({
          Secret: '********',
        });

        // Verify response capture and scrubbing
        expect(body.data.body.telemetry[0].body.response.body).to.eql(
          '{"name":"foo","password":"********"}',
        );
        expect(
          body.data.body.telemetry[0].body.response.headers['Password'],
        ).to.eql('********');
      }
    };
    xhr.send(JSON.stringify({ name: 'bar', secret: 'xhr post' }));
    server.respond();
  });

  it('should handle non-string Content-Type', async function () {
    const server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    server.respondWith('GET', 'https://example.com/xhr-test', [
      200,
      {
        'Content-Type': {}, // unexpected/invalid (non-string) content type
        Password: 'abcdef',
      },
      JSON.stringify({ name: 'foo', password: '123456' }),
    ]);

    const rollbar = (window.rollbar = initRollbarForNetworkTelemetry());

    // generate a telemetry event
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://example.com/xhr-test', true);
    xhr.setRequestHeader('Secret', 'abcdef');
    xhr.onreadystatechange = async function () {
      if (xhr.readyState === 4) {
        rollbar.log('test'); // generate a payload to inspect

        await setTimeoutAsync(1);

        server.respond();

        expect(server.requests.length).to.eql(2);
        const body = JSON.parse(server.requests[1].requestBody);

        // Verify request headers capture and case-insensitive scrubbing
        expect(body.data.body.telemetry[0].body.request_headers).to.eql({
          Secret: '********',
        });

        // Not scrubbed for unrecognized content type
        expect(body.data.body.telemetry[0].body.response.body).to.eql(
          '{"name":"foo","password":"123456"}',
        );

        expect(
          body.data.body.telemetry[0].body.response.headers['Password'],
        ).to.eql('********');
      }
    };
    xhr.send(JSON.stringify({ name: 'bar', secret: 'xhr post' }));
    server.respond();
  });

  it('should send errors for xhr http errors', async function () {
    const server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    server.respondWith('POST', 'xhr-test', [
      404,
      { 'Content-Type': 'application/json' },
      JSON.stringify({ foo: 'bar' }),
    ]);

    const options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      autoInstrument: {
        log: false,
        network: true,
        networkErrorOnHttp4xx: true,
      },
    };
    window.rollbar = new Rollbar(options);

    // generate a telemetry event
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://example.com/xhr-test', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = async function () {
      if (xhr.readyState === 4) {
        await setTimeoutAsync(1);

        server.respond();

        expect(server.requests.length).to.eql(2);
        const body = JSON.parse(server.requests[1].requestBody);

        expect(body.data.body.trace.exception.message).to.eql(
          'HTTP request failed with Status 404',
        );

        // Just knowing a stack is present is enough for this test.
        expect(body.data.body.trace.frames.length).to.be.above(1);
      }
    };
    xhr.send(JSON.stringify({ name: 'bar', secret: 'xhr post' }));
    await setTimeoutAsync(1);

    server.respond();
  });

  // https://github.com/rollbar/rollbar.js/issues/1451
  describe('when XMLHttpRequest.prototype.open is read-only', function () {
    let xhrp;
    let openDescriptor;

    beforeEach(function () {
      // Simulates the condition reported from Chrome 97 on Windows 7, where
      // XMLHttpRequest.prototype.open is non-writable on the page. The outer
      // beforeEach has already swapped in nise's FakeXMLHttpRequest as
      // window.XMLHttpRequest, so this makes the fake's open read-only, not
      // the native one. The SDK path is the same either way: instrumentNetwork
      // patches whatever window.XMLHttpRequest.prototype is when it runs.
      // configurable: true lets afterEach undo it for the rest of the suite.
      xhrp = window.XMLHttpRequest.prototype;
      openDescriptor = Object.getOwnPropertyDescriptor(xhrp, 'open');
      Object.defineProperty(xhrp, 'open', {
        value: xhrp.open,
        writable: false,
        configurable: true,
      });
    });

    afterEach(function () {
      if (openDescriptor) {
        Object.defineProperty(xhrp, 'open', openDescriptor);
      } else {
        delete xhrp.open;
      }
    });

    it('should initialize without throwing and still report items', async function () {
      const server = window.server;
      stubResponse(server);
      server.requests.length = 0;
      const open = xhrp.open;
      const send = xhrp.send;

      let rollbar;
      expect(() => {
        rollbar = window.rollbar = initRollbarForNetworkTelemetry();
      }).to.not.throw();

      // XHR is left alone rather than half-instrumented.
      expect(xhrp.open).to.equal(open);
      expect(xhrp.send).to.equal(send);

      rollbar.error('after init');
      await setTimeoutAsync(1);
      server.respond();

      // The queue may still flush an item left over from the previous test,
      // so look for this test's item rather than counting requests.
      const messages = server.requests.map(
        (r) => JSON.parse(r.requestBody).data.body.message?.body,
      );
      expect(messages).to.include('after init');

      // The skip is reported on the item so missing XHR telemetry is explained.
      const item = server.requests
        .map((r) => JSON.parse(r.requestBody).data)
        .find((d) => d.body.message?.body === 'after init');
      expect(item.notifier.diagnostic.instrumentNetwork).to.eql({
        xhr: 'skipped: XMLHttpRequest.prototype not writable (open)',
      });
    });
  });
});
