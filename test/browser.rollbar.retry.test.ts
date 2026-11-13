// @ts-nocheck
import { expect } from 'chai';
import sinon from 'sinon';

import Rollbar from '../src/browser/rollbar.js';

// Reproduces https://github.com/rollbar/rollbar.js/issues/681 end to end: a
// real browser request that fails at the network layer, sent through the
// public API with retries enabled. Port 1 is on Chromium's blocked-port list,
// so the request fails the same way an unreachable host or a dropped
// connection does, without depending on anything listening locally.
const UNREACHABLE_ENDPOINT = 'http://127.0.0.1:1/api/1/';

function sendError(rollbar) {
  return new Promise((resolve) => {
    rollbar.error('network retry test', (err, resp) => resolve({ err, resp }));
  });
}

function createRollbar(transport) {
  return new Rollbar({
    accessToken: 'POST_CLIENT_ITEM_TOKEN',
    endpoint: UNREACHABLE_ENDPOINT,
    defaultTransport: transport,
    retryInterval: 5,
    maxRetries: 2,
    captureUncaught: false,
    captureUnhandledRejections: false,
    autoInstrument: false,
  });
}

describe('retries on network errors (#681)', function () {
  afterEach(function () {
    sinon.restore();
  });

  it('retries a fetch request that fails with a network error', async function () {
    const fetchSpy = sinon.spy(window, 'fetch');
    const rollbar = createRollbar('fetch');

    const { err, resp } = await sendError(rollbar);

    expect(resp).to.not.be.ok;
    expect(err.code).to.eql('ENOTFOUND');
    expect(fetchSpy.callCount).to.eql(3);
  });

  it('retries an XHR request that fails with a network error', async function () {
    const sendSpy = sinon.spy(XMLHttpRequest.prototype, 'send');
    const rollbar = createRollbar('xhr');

    const { err, resp } = await sendError(rollbar);

    expect(resp).to.not.be.ok;
    expect(err.code).to.eql('ENOTFOUND');
    expect(sendSpy.callCount).to.eql(3);
  });

  it('does not retry when retryInterval is not set', async function () {
    const fetchSpy = sinon.spy(window, 'fetch');
    const rollbar = new Rollbar({
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      endpoint: UNREACHABLE_ENDPOINT,
      defaultTransport: 'fetch',
      captureUncaught: false,
      captureUnhandledRejections: false,
      autoInstrument: false,
    });

    const { err } = await sendError(rollbar);

    expect(err).to.be.ok;
    expect(fetchSpy.callCount).to.eql(1);
  });
});
