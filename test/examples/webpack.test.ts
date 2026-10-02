import { expect } from 'chai';

import { fakeServer } from '../browser.rollbar.test-utils.ts';
import { loadExampleHtml } from '../util/fixtures.ts';
import { setTimeoutAsync } from '../util/timers.ts';

describe('webpack app', function () {
  let __originalOnError = null;

  this.timeout(4000);

  before(async function () {
    // Prevent WTR/Mocha from failing the test on uncaught errors.
    __originalOnError = window.onerror;
    window.onerror = () => false;

    // Load the HTML page.
    await loadExampleHtml('examples/webpack/src/index.html');

    // Give the snippet time to load and init.
    await setTimeoutAsync(250);

    // Stub the xhr interface.
    window.server = fakeServer.create();
  });

  after(function () {
    window.server.restore();
    window.onerror = __originalOnError;
    __originalOnError = null;
  });

  function accessToken(request) {
    return request.requestHeaders['X-Rollbar-Access-Token'];
  }

  function stubResponse(server) {
    server.respondWith('POST', 'api/1/item', [
      200,
      { 'Content-Type': 'application/json' },
      '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}',
    ]);
  }

  it('should send a valid log event', async function () {
    const server = window.server;

    stubResponse(server);
    server.requests.length = 0;

    const element = document.getElementById('rollbar-info');
    expect(element).to.exist;
    element.click();

    await setTimeoutAsync(1);
    server.respond();

    const body = JSON.parse(server.requests[0].requestBody);

    expect(accessToken(server.requests[0])).to.eql('POST_CLIENT_ITEM_TOKEN');
    expect(body.data.body.message.body).to.eql('webpack test log');
  });

  it('should report uncaught error', async function () {
    const server = window.server;

    stubResponse(server);
    server.requests.length = 0;

    const element = document.getElementById('throw-error');
    expect(element).to.exist;
    element.click();

    await setTimeoutAsync(1);
    server.respond();

    const body = JSON.parse(server.requests[0].requestBody);

    expect(accessToken(server.requests[0])).to.eql('POST_CLIENT_ITEM_TOKEN');

    expect(body.data.body.trace.exception.message).to.eql('webpack test error');
  });

  it('should store a payload and send stored payload', async function () {
    const server = window.server;

    stubResponse(server);
    server.requests.length = 0;

    // Invoke rollbar event to be stored, not sent.
    const element = document.getElementById('rollbar-info-with-extra');
    expect(element).to.exist;
    element.click();

    await setTimeoutAsync(1);
    server.respond();

    // Verify event is not sent to API
    expect(server.requests.length).to.eql(0);

    // Verify valid stored payload
    const parsedJson = JSON.parse(window.jsonPayload);
    // The token travels in a header when the payload is sent, not in it.
    expect(parsedJson.access_token).to.be.undefined;
    expect(parsedJson.data.body.message.body).to.eql('webpack test log');

    // Send stored payload
    const sendJsonElement = document.getElementById('send-json');
    expect(sendJsonElement).to.be.ok;
    sendJsonElement.click();

    const body = JSON.parse(server.requests[0].requestBody);

    expect(accessToken(server.requests[0])).to.eql('POST_CLIENT_ITEM_TOKEN');
    expect(body.data.body.message.body).to.eql('webpack test log');
  });
});
