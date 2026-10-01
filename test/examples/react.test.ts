import { expect } from 'chai';

import { fakeServer } from '../browser.rollbar.test-utils.ts';
import { loadExampleHtml } from '../util/fixtures.ts';
import { setTimeoutAsync } from '../util/timers.ts';

describe('react app', function () {
  let __originalOnError = null;

  this.timeout(4000);

  before(async function () {
    // Prevent WTR/Mocha from failing the test on uncaught errors.
    __originalOnError = window.onerror;
    window.onerror = () => false;

    await loadExampleHtml('examples/react-16/dist/index.html');

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
    expect(body.data.body.message.body).to.eql('react test log');
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
    expect(body.data.body.trace.exception.message).to.eql('react test error');
  });

  it('should not report error inside error boundary', async function () {
    const server = window.server;

    stubResponse(server);
    server.requests.length = 0;

    const element = document.getElementById('child-error');
    expect(element).to.exist;
    element.click();

    await setTimeoutAsync(1);
    server.respond();

    // Should only produce one API request.
    expect(server.requests.length).to.eql(1);
    const body = JSON.parse(server.requests[0].requestBody);

    expect(accessToken(server.requests[0])).to.eql('POST_CLIENT_ITEM_TOKEN');

    // Should be a log event, not an uncaught exception
    expect(body.data.body.message.body).to.eql('react child test error');
  });
});
