import sinon from 'sinon';
import { expect } from 'chai';

import { loadHtml } from '../util/fixtures.js';

describe('react app', function () {
  let __originalOnError = null;

  this.timeout(4000);

  before(async function () {
    // Prevent WTR/Mocha from failing the test on uncaught errors.
    __originalOnError = window.onerror;
    window.onerror = () => false;

    await loadHtml('examples/react/dist/index.html');

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
    expect(body.data.body.message.body).to.eql('react test log');

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
    expect(body.data.body.trace.exception.message).to.eql('react test error');

    done();
  });

  it('should not report error inside error boundary', function (done) {
    const server = window.server;

    stubResponse(server);
    server.requests.length = 0;

    const element = document.getElementById('child-error');
    expect(element).to.be.ok;
    element.click();

    server.respond();

    // Should only produce one API request.
    expect(server.requests.length).to.eql(1);
    const body = JSON.parse(server.requests[0].requestBody);

    expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');

    // Should be a log event, not an uncaught exception
    expect(body.data.body.message.body).to.eql('react child test error');

    done();
  });
});
