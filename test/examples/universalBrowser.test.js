import sinon from 'sinon';
import { expect } from 'chai';

import { setTimeout } from '../util/timers.js';
import { loadHtml } from '../util/fixtures.js';

describe('Rollbar loaded by snippet', function () {
  let __originalOnError = null;

  before(async function () {
    // Prevent WTR/Mocha from failing the test on uncaught errors.
    __originalOnError = window.onerror;
    window.onerror = () => false;

    // Load the HTML page.
    await loadHtml('examples/universal-browser/test.html');

    // DOMContentLoaded is not dispatched automatically in WTR/Playwright
    document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));

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

  it('should send a valid log event', async function () {
    const server = window.server;
    const rollbar = document.defaultView.Rollbar;
    expect(server).to.exist;
    expect(rollbar).to.be.ok;

    server.respondWith('POST', 'api/1/item', [
      200,
      { 'Content-Type': 'application/json' },
      '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}',
    ]);

    const ret = rollbar.info('test');

    await setTimeout(1);

    server.respond();

    const body = JSON.parse(server.requests[0].requestBody);

    expect(body.access_token).to.be.undefined;
    expect(body.data.uuid).to.eql(ret.uuid);
    expect(body.data.body.message.body).to.eql('test');

    // Assert load telemetry was added.
    expect(body.data.body.telemetry[0].type).to.eql('navigation');
    expect(body.data.body.telemetry[0].body.subtype).to.eql('DOMContentLoaded');
  });
});
