import { expect } from 'chai';
import express from 'express';

import Rollbar from '../src/server/rollbar.js';

// Regression coverage for #1059: passing an Express 4 request as custom data,
// rather than in the request slot, printed `express deprecated req.host`.
// Cloning custom data walked inherited properties and so invoked the
// deprecated getter on Express's request prototype.

describe('express request passed as custom data', function () {
  this.timeout(5000);

  const hostDescriptor = Object.getOwnPropertyDescriptor(
    express.request,
    'host',
  );
  let hostReads;
  let deprecations;
  let onDeprecation;

  before(function () {
    // depd only prints once per call site per process, so count reads of the
    // getter directly rather than relying on the warning alone.
    Object.defineProperty(express.request, 'host', {
      ...hostDescriptor,
      get() {
        hostReads += 1;
        return hostDescriptor.get.call(this);
      },
    });
  });

  after(function () {
    Object.defineProperty(express.request, 'host', hostDescriptor);
  });

  beforeEach(function () {
    hostReads = 0;
    deprecations = [];
    // With a listener attached, depd emits the warning instead of printing it.
    onDeprecation = (err) => deprecations.push(err.message);
    process.on('deprecation', onDeprecation);
  });

  afterEach(function () {
    process.removeListener('deprecation', onDeprecation);
  });

  // Serves one request, reports it with `report(rollbar, req)` and resolves
  // with the payload data Rollbar would have sent. checkIgnore drops the item so
  // nothing leaves the process.
  async function reportFromRoute(report) {
    let captured;
    const rollbar = new Rollbar({
      accessToken: 'abc123',
      environment: 'test',
      captureUncaught: false,
      captureUnhandledRejections: false,
      autoInstrument: false,
      checkIgnore: (_isUncaught, _args, data) => {
        captured = data;
        return true;
      },
    });

    const app = express();
    app.get('/checkout', (req, res) => {
      report(rollbar, req, () => res.send('reported'));
    });
    const server = await new Promise((resolve) => {
      const s = app.listen(0, '127.0.0.1', () => resolve(s));
    });

    try {
      const { port } = server.address();
      const response = await fetch(`http://127.0.0.1:${port}/checkout?id=7`);
      expect(await response.text()).to.equal('reported');
    } finally {
      server.closeAllConnections();
      await new Promise((done) => server.close(done));
    }
    return captured;
  }

  function expectNoHostDeprecation() {
    expect(hostReads, 'req.host getter reads').to.equal(0);
    expect(deprecations).to.deep.equal([]);
  }

  it('does not read req.host for rollbar.error(err, {request: req})', async function () {
    const data = await reportFromRoute((rollbar, req, done) => {
      rollbar.error(new Error('boom'), { request: req }, done);
    });

    expectNoHostDeprecation();
    expect(data.custom.request.method).to.equal('GET');
    expect(data.custom.request.originalUrl).to.equal('/checkout?id=7');
    expect(data.custom.request).to.not.have.property('host');
  });

  it('does not read req.host for rollbar.error(err, custom, {ctx: req})', async function () {
    const data = await reportFromRoute((rollbar, req, done) => {
      rollbar.error(new Error('boom'), { foo: 1 }, { ctx: req }, done);
    });

    expectNoHostDeprecation();
    expect(data.custom.foo).to.equal(1);
    expect(data.custom.extraArgs[0].ctx.method).to.equal('GET');
  });

  it('does not read req.host for rollbar.error(err, req, req)', async function () {
    const data = await reportFromRoute((rollbar, req, done) => {
      rollbar.error(new Error('boom'), req, req, done);
    });

    expectNoHostDeprecation();
    expect(data.request.method).to.equal('GET');
    expect(data.custom.method).to.equal('GET');
  });

  it('does not read req.host for rollbar.error(err, req)', async function () {
    const data = await reportFromRoute((rollbar, req, done) => {
      rollbar.error(new Error('boom'), req, done);
    });

    expectNoHostDeprecation();
    expect(data.request.method).to.equal('GET');
  });
});
