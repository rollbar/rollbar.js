import http from 'node:http';

import { expect } from 'chai';
import express from 'express';

import Rollbar from '../src/server/rollbar.js';

// Integration coverage for level methods called without their instance, e.g.
// `promise.catch(rollbar.error)`. These run the real client, notifier, queue
// and HTTP transport against a local server standing in for the Rollbar API,
// so a passing test means the item was actually delivered.

function startFakeApi() {
  const items = [];
  const waiters = [];

  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      if (req.method === 'POST' && req.url === '/api/1/item/') {
        items.push(JSON.parse(body));
        waiters.forEach((check) => check());
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('{"err":0,"result":{"uuid":"d4c7acef55bf4c9ea95e4fe9428a8287"}}');
    });
  });

  // Resolves once `count` items have arrived; rejects with how many did.
  function waitForItems(count, timeoutMs = 2000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(
          new Error(`expected ${count} item(s), received ${items.length}`),
        );
      }, timeoutMs);
      const check = () => {
        if (items.length >= count) {
          clearTimeout(timer);
          resolve(items.slice(0, count));
        }
      };
      waiters.push(check);
      check();
    });
  }

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({
        endpoint: `http://127.0.0.1:${port}/api/1/item/`,
        items,
        waitForItems,
        close: () => new Promise((done) => server.close(done)),
      });
    });
  });
}

function levelsOf(items) {
  return items.map((item) => item.data.level);
}

function exceptionMessage(item) {
  const body = item.data.body;
  const trace = body.trace || body.trace_chain[0];
  return trace.exception.message;
}

describe('level methods called without their instance', function () {
  let api;
  let rollbar;

  beforeEach(async function () {
    api = await startFakeApi();
    rollbar = new Rollbar({
      accessToken: 'abc123',
      endpoint: api.endpoint,
      environment: 'test',
      captureUncaught: false,
      captureUnhandledRejections: false,
      autoInstrument: false,
    });
  });

  afterEach(async function () {
    await api.close();
  });

  it('reports a rejection passed straight to .catch(rollbar.error)', async function () {
    const failure = new Error('payment declined');

    await Promise.reject(failure).catch(rollbar.error);

    const [item] = await api.waitForItems(1);
    expect(item.data.level).to.equal('error');
    expect(exceptionMessage(item)).to.equal('payment declined');
  });

  it('reports through a logger object built from the methods', async function () {
    const logger = {
      info: rollbar.info,
      warn: rollbar.warn,
      error: rollbar.error,
    };

    logger.info('starting');
    logger.warn('slow response');
    logger.error(new Error('request failed'));

    const items = await api.waitForItems(3);
    expect(levelsOf(items).sort()).to.deep.equal(['error', 'info', 'warning']);
  });

  it('reports through destructured methods', async function () {
    const { log, debug, warning, critical } = rollbar;
    rollbar.configure({ reportLevel: 'debug' });

    log('log message');
    debug('debug message');
    warning('warning message');
    critical(new Error('disk full'));

    const items = await api.waitForItems(4);
    expect(levelsOf(items).sort()).to.deep.equal([
      'critical',
      'debug',
      'debug', // `log` defaults to the debug level
      'warning',
    ]);
  });

  it('reports from an express route that uses .catch(rollbar.error)', async function () {
    const app = express();
    app.get('/checkout', (req, res) => {
      Promise.reject(new Error('inventory unavailable'))
        .catch(rollbar.error)
        .then(
          () => res.status(500).send('reported'),
          (err) => res.status(500).send(`not reported: ${err.message}`),
        );
    });
    const server = await new Promise((resolve) => {
      const s = app.listen(0, '127.0.0.1', () => resolve(s));
    });

    try {
      const { port } = server.address();
      const response = await fetch(`http://127.0.0.1:${port}/checkout`);
      expect(await response.text()).to.equal('reported');

      const [item] = await api.waitForItems(1);
      expect(item.data.level).to.equal('error');
      expect(exceptionMessage(item)).to.equal('inventory unavailable');
    } finally {
      await new Promise((done) => server.close(done));
    }
  });
});
