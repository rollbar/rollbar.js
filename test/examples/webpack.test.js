import sinon from 'sinon';
import { expect } from 'chai';

import { setTimeout } from '../util/timers.js';
import { loadHtml } from '../util/fixtures.js';

describe('webpack app', function () {
  let __originalOnError = null;

  this.timeout(4000);

  before(async function () {
    // Prevent WTR/Mocha from failing the test on uncaught errors.
    __originalOnError = window.onerror;
    window.onerror = () => false;

    // Load the HTML page.
    await loadHtml('examples/webpack/src/index.html');

    // Give the snippet time to load and init.
    await setTimeout(250);

    // Stub the xhr interface.
    window.server = sinon.createFakeServer();
  });

  after(function () {
    window.server.restore();
    window.onerror = __originalOnError;
    __originalOnError = null;
  });

  function stubResponse(server) {
    server.respondWith('POST', 'api/1/item', [
      200,
      { 'Content-Type': 'application/json' },
      '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}',
    ]);
  }

  it('should send a valid log event', function (done) {
    const server = window.server;

    stubResponse(server);
    server.requests.length = 0;

    const element = document.getElementById('rollbar-info');
    expect(element).to.be.ok;
    element.click();

    server.respond();

    const body = JSON.parse(server.requests[0].requestBody);

    expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
    expect(body.data.body.message.body).to.eql('webpack test log');

    done();
  });

  it('should report uncaught error', function (done) {
    const server = window.server;

    stubResponse(server);
    server.requests.length = 0;

    const element = document.getElementById('throw-error');
    expect(element).to.be.ok;
    element.click();

    server.respond();

    const body = JSON.parse(server.requests[0].requestBody);

    expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');

    // This has become necessary because Travis switched their Chrome stable
    // version _down_ from 76 to 62, which handles this test case differently.
    // 2020-05-06: Travis Chrome 62 is now returning the original message.
    const version = parseInt(
      window.navigator.userAgent.match(
        new RegExp('^.*HeadlessChrome/([0-9]*).*$'),
      )[1],
    );
    const message = version >= 62 ? 'webpack test error' : 'Script error.';

    expect(body.data.body.trace.exception.message).to.eql(message);

    done();
  });

  it('should store a payload and send stored payload', function (done) {
    const server = window.server;

    stubResponse(server);
    server.requests.length = 0;

    // Invoke rollbar event to be stored, not sent.
    const element = document.getElementById('rollbar-info-with-extra');
    expect(element).to.be.ok;
    element.click();

    server.respond();

    // Verify event is not sent to API
    expect(server.requests.length).to.eql(0);

    // Verify valid stored payload
    const parsedJson = JSON.parse(window.jsonPayload);
    expect(parsedJson.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
    expect(parsedJson.data.body.message.body).to.eql('webpack test log');

    // Send stored payload
    const sendJsonElement = document.getElementById('send-json');
    expect(sendJsonElement).to.be.ok;
    sendJsonElement.click();

    const body = JSON.parse(server.requests[0].requestBody);

    expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
    expect(body.data.body.message.body).to.eql('webpack test log');

    done();
  });
});
