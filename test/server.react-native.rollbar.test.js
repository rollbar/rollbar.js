/**
 * React Native coverage that runs in CI.
 *
 * The `test/react-native.*` suites are not picked up by either runner, so
 * this file loads `src/react-native/rollbar.js` through the server runner
 * instead. Only `buffer/` (the React Native `buffer` polyfill imported by
 * `src/react-native/transport.js`, which is not installed here) needs
 * remapping, and Node's own Buffer provides the same `byteLength` API.
 */

import { register } from 'node:module';

import { expect } from 'chai';

register(
  'data:text/javascript,' +
    encodeURIComponent(
      'export async function resolve(specifier, context, next) {' +
        "  return next(specifier === 'buffer/' ? 'node:buffer' : specifier, context);" +
        '}',
    ),
);

const { default: Rollbar } = await import('../src/react-native/rollbar.js');

const LEVELS = ['log', 'debug', 'info', 'warn', 'warning', 'error', 'critical'];

function TestClient() {
  this.logCalls = [];
  this.notifier = { addTransform: () => this.notifier };
  this.queue = { addPredicate: () => this.queue };
  LEVELS.forEach((level) => {
    this[level] = (item) => {
      this.logCalls.push({ func: level, item });
    };
  });
}

describe('react-native Rollbar', function () {
  describe('detached level methods', function () {
    let rollbar;
    let client;

    beforeEach(function () {
      client = new TestClient();
      rollbar = new Rollbar({ accessToken: 'abc123' }, client);
    });

    it('should work when called without the instance', function () {
      LEVELS.forEach((level) => {
        const { [level]: detached } = rollbar;
        detached(`hello ${level}`);
      });

      expect(client.logCalls.map((call) => call.func)).to.deep.equal(LEVELS);
      expect(client.logCalls[5].item.message).to.equal('hello error');
    });

    it('should work as a promise rejection handler', async function () {
      const error = new Error('rejected');
      await Promise.reject(error).catch(rollbar.error);

      expect(client.logCalls[0].func).to.equal('error');
      expect(client.logCalls[0].item.err).to.equal(error);
    });
  });
});
