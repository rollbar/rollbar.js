import sinon from 'sinon';
import { expect } from 'chai';

import { setTimeout } from '../util/timers.js';
import { loadHtml } from '../util/fixtures.js';

const log =
  (window.parent &&
    window.parent.console &&
    window.parent.console.log.bind(window.parent.console)) ||
  (window.top &&
    window.top.console &&
    window.top.console.log.bind(window.top.console)) ||
  console.log.bind(console);

(function dumpAllPropNames(o) {
  const seen = new Set();
  for (let cur = o; cur; cur = Object.getPrototypeOf(cur)) {
    for (const k of Reflect.ownKeys(cur)) {
      if (seen.has(k)) continue;
      seen.add(k);
      log(typeof k === 'symbol' ? k.toString() : k);
    }
  }
})(document.defaultView.Rollbar);

describe('Rollbar loaded by snippet with replay config', function () {
  let __originalOnError = null;

  before(async function () {
    __originalOnError = window.onerror;
    window.onerror = () => false;

    await loadHtml('examples/universal-browser/test-with-replay.html');

    document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));

    await setTimeout(250);

    window.server = sinon.createFakeServer();
  });

  after(function () {
    window.server.restore();
    window.onerror = __originalOnError;
    __originalOnError = null;
  });

  it('should have Replay instance available', function () {
    const rollbar = document.defaultView.Rollbar;
    expect(rollbar).to.be.ok;
    console.log('Rollbar instance:');
    dumpAllPropNames(rollbar);
    //console.log(rollbar);
    // Object.keys(rollbar).forEach((key) => console.log(key, obj[key]));
    // Object.getOwnPropertyNames(rollbar).forEach((key) =>
    //   console.log(key, obj[key]),
    // );
    // for (const key in obj) {
    //   console.log(key, obj[key]);
    // }
    // let current = obj;
    // while (current) {
    //   Reflect.ownKeys(current).forEach((key) => console.log(key, obj[key]));
    //   current = Object.getPrototypeOf(current);
    // }
    expect(rollbar.telemeter).to.exist;
    expect(rollbar.replay).to.exist;
    expect(rollbar.replay.constructor.name).to.equal('Replay');
  });

  it('should have replay configuration available', function () {
    const rollbar = document.defaultView.Rollbar;
    expect(rollbar.options.replay).to.exist;
    expect(rollbar.options.replay.enabled).to.be.true;
  });

  it('should send a valid log event with replay', async function () {
    const server = window.server;
    const rollbar = document.defaultView.Rollbar;

    server.respondWith('POST', 'api/1/item', [
      200,
      { 'Content-Type': 'application/json' },
      '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}',
    ]);

    const ret = rollbar.info('test with replay');

    await setTimeout(1);

    server.respond();

    const body = JSON.parse(server.requests[0].requestBody);

    expect(body.access_token).to.be.undefined;
    expect(body.data.uuid).to.eql(ret.uuid);
    expect(body.data.body.message.body).to.eql('test with replay');
  });
});
