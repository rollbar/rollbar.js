import { expect } from 'chai';
import sinon from 'sinon';

import { setTimeout } from './util/timers.js';

import Rollbar from '../src/browser/rollbar.js';

describe('options.autoInstrument', function () {
  beforeEach(function () {
    window.server = sinon.createFakeServer();
    window.server.respondWith('POST', 'api/1/item', [
      200,
      { 'Content-Type': 'application/json' },
      '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}',
    ]);
  });

  afterEach(function () {
    if (window.rollbar) {
      window.rollbar.configure({
        autoInstrument: false,
        captureUncaught: false,
      });
    }
    window.server.restore();
  });

  it('should add telemetry events when console.log is called', async function () {
    const server = window.server;
    expect(server).to.exist;
    server.requests.length = 0;

    const rollbar = (window.rollbar = new Rollbar({
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
    }));

    console.log('console test'); // generate a telemetry event

    rollbar.log('test'); // generate a payload to inspect

    await setTimeout(1);

    server.respond();

    const body = JSON.parse(server.requests[0].requestBody);

    expect(body.data.body.telemetry[0].body.message).to.eql('console test');
  });

  it('should add a diagnostic message when wrapConsole fails', async function () {
    const server = window.server;
    expect(server).to.exist;
    server.requests.length = 0;

    const oldConsole = window.console;
    const newConsole = {};
    Object.defineProperty(newConsole, 'log', {
      get: () => (message) => {
        oldConsole.log(message);
        return message;
      },
    });
    window.console = newConsole;

    const rollbar = (window.rollbar = new Rollbar({
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
    }));

    rollbar.log('test'); // generate a payload to inspect

    await setTimeout(1);

    server.respond();

    const body = JSON.parse(server.requests[0].requestBody);
    window.console = oldConsole;

    expect(rollbar.client.notifier.diagnostic.instrumentConsole).to.exist;
    expect(body.data.notifier.diagnostic.instrumentConsole).to.exist;

    const rollbarDiagnostic = rollbar.client.notifier.diagnostic;
    const bodyDiagnostic = body.data.notifier.diagnostic;
    expect(rollbarDiagnostic.instrumentConsole).to.have.property('error');
    expect(bodyDiagnostic.instrumentConsole).to.have.property('error');
  });
});
