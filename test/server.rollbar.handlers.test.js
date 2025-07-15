/* globals describe */
/* globals it */
/* globals beforeEach */
/* globals afterEach */

import { expect } from 'chai';
import sinon from 'sinon';
import Rollbar from '../src/server/rollbar.js';

async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function nodeReject() {
  Promise.reject(new Error('node reject'));
  await wait(500);
}

async function nodeThrow() {
  setTimeout(function () {
    throw new Error('node error');
  }, 10);
  await wait(500);
}

describe('rollbar exception handlers', function () {
  before(function () {
    // Increase max listeners to avoid warnings during tests
    // Multiple Rollbar instances are created and each adds handlers
    process.setMaxListeners(20);
  });

  after(function () {
    process.setMaxListeners(10);
  });

  describe('captureUncaught', function () {
    let mochaHandlers;

    beforeEach(function () {
      // Remove Mocha's uncaught exception handlers to prevent interference
      mochaHandlers = process.listeners('uncaughtException');
      mochaHandlers.forEach((handler) => {
        process.removeListener('uncaughtException', handler);
      });
    });

    afterEach(function () {
      // Restore Mocha's handlers
      mochaHandlers.forEach((handler) => {
        process.on('uncaughtException', handler);
      });
    });

    describe('enabled in constructor', function () {
      let rollbar;
      let logStub;

      beforeEach(async function () {
        rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUncaught: true,
        });
        logStub = sinon.stub(rollbar.client.notifier, 'log');

        await nodeThrow();
      });

      afterEach(function () {
        logStub.restore();
      });

      it('should have locals disabled', function () {
        expect(rollbar.client.notifier.locals).to.be.undefined;
      });

      it('should log', function () {
        expect(logStub.called).to.be.true;
        expect(logStub.getCall(0).args[0].err.message).to.equal('node error');
      });
    });

    describe('disabled in configure after being enabled', function () {
      it('should not log when disabled', async function () {
        const rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUncaught: true,
        });
        const logStub = sinon.stub(rollbar.client.notifier, 'log');

        await nodeThrow();
        expect(logStub.called).to.be.true;
        logStub.reset();

        rollbar.configure({ captureUncaught: false });
        await nodeThrow();
        expect(logStub.called).to.be.false;

        logStub.restore();
      });
    });

    describe('disabled in constructor', function () {
      it('should not log', async function () {
        const rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUncaught: false,
        });
        const logStub = sinon.stub(rollbar.client.notifier, 'log');

        // Install a temporary handler to prevent test crash
        const tempHandler = () => {};
        process.on('uncaughtException', tempHandler);

        await nodeThrow();
        expect(logStub.called).to.be.false;

        process.removeListener('uncaughtException', tempHandler);
        logStub.restore();
      });
    });

    describe('enabled in configure after being disabled', function () {
      it('should log when enabled', async function () {
        const rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUncaught: false,
        });
        const logStub = sinon.stub(rollbar.client.notifier, 'log');

        // Install a temporary handler to prevent test crash when disabled
        const tempHandler = () => {};
        process.on('uncaughtException', tempHandler);

        await nodeThrow();
        expect(logStub.called).to.be.false;

        process.removeListener('uncaughtException', tempHandler);

        rollbar.configure({ captureUncaught: true });
        await nodeThrow();
        expect(logStub.called).to.be.true;
        expect(logStub.getCall(0).args[0].err.message).to.equal('node error');

        logStub.restore();
      });
    });
  });

  describe('captureUnhandledRejections', function () {
    let mochaHandlers;

    beforeEach(function () {
      // Remove Mocha's unhandled rejection handlers to prevent interference
      mochaHandlers = process.listeners('unhandledRejection');
      mochaHandlers.forEach((handler) => {
        process.removeListener('unhandledRejection', handler);
      });
    });

    afterEach(function () {
      // Restore Mocha's handlers
      mochaHandlers.forEach((handler) => {
        process.on('unhandledRejection', handler);
      });
    });

    describe('enabled in constructor', function () {
      it('should log', async function () {
        const rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUnhandledRejections: true,
        });
        const logStub = sinon.stub(rollbar.client.notifier, 'log');

        await nodeReject();

        expect(logStub.called).to.be.true;
        expect(logStub.getCall(0).args[0].err.message).to.equal('node reject');

        logStub.restore();
      });
    });

    describe('disabled in configure after being enabled', function () {
      it('should not log when disabled', async function () {
        const rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUnhandledRejections: true,
        });
        const logStub = sinon.stub(rollbar.client.notifier, 'log');

        await nodeReject();
        expect(logStub.called).to.be.true;
        logStub.reset();

        rollbar.configure({ captureUnhandledRejections: false });
        await nodeReject();
        expect(logStub.called).to.be.false;

        logStub.restore();
      });
    });

    describe('disabled in constructor', function () {
      it('should not log', async function () {
        const rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUnhandledRejections: false,
        });
        const logStub = sinon.stub(rollbar.client.notifier, 'log');

        // Install a temporary handler to prevent test crash
        const tempHandler = () => {};
        process.on('unhandledRejection', tempHandler);

        await nodeReject();
        expect(logStub.called).to.be.false;

        process.removeListener('unhandledRejection', tempHandler);
        logStub.restore();
      });
    });

    describe('enabled in configure after being disabled', function () {
      it('should log when enabled', async function () {
        const rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUnhandledRejections: false,
        });
        const logStub = sinon.stub(rollbar.client.notifier, 'log');

        // Install a temporary handler to prevent test crash when disabled
        const tempHandler = () => {};
        process.on('unhandledRejection', tempHandler);

        await nodeReject();
        expect(logStub.called).to.be.false;

        process.removeListener('unhandledRejection', tempHandler);

        rollbar.configure({ captureUnhandledRejections: true });
        await nodeReject();
        expect(logStub.called).to.be.true;
        expect(logStub.getCall(0).args[0].err.message).to.equal('node reject');

        logStub.restore();
      });
    });
  });
});
