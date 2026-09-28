import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

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

function runChild(mode, { nodeArgs = [], env = process.env } = {}) {
  const fixture = fileURLToPath(
    new URL('./fixtures/server/unhandled.js', import.meta.url),
  );
  // spawnSync blocks the event loop, so Mocha's own timeout cannot stop a
  // child that never exits; this one turns a hang into a test failure.
  const child = spawnSync(process.execPath, [...nodeArgs, fixture, mode], {
    encoding: 'utf8',
    env,
    timeout: 10000,
  });
  expect(child.error, 'child process did not exit cleanly').to.be.undefined;
  return child;
}

function occurrences(text, substring) {
  return text.split(substring).length - 1;
}

function written(stub) {
  return stub.args.map((args) => String(args[0])).join('');
}

async function nodeThrow() {
  setTimeout(function () {
    throw new Error('node error');
  }, 10);
  await wait(500);
}

describe('rollbar exception handlers', function () {
  let stderrWrite;

  beforeEach(function () {
    // Rollbar prints unhandled errors to stderr when it is the only listener;
    // capture that output instead of cluttering the test report.
    stderrWrite = sinon.stub(process.stderr, 'write');
  });

  afterEach(function () {
    stderrWrite.restore();
  });

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
    describe('printing to stderr (#1108)', function () {
      it('should print the error when Rollbar is the only listener', async function () {
        const rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUncaught: true,
        });
        const logStub = sinon.stub(rollbar.client.notifier, 'log');

        await nodeThrow();
        expect(logStub.called).to.be.true;
        expect(written(stderrWrite)).to.contain('Error: node error\n    at ');

        logStub.restore();
      });

      it('should print the error after captureUncaught is disabled in configure', async function () {
        const rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUncaught: true,
        });
        const logStub = sinon.stub(rollbar.client.notifier, 'log');
        rollbar.configure({ captureUncaught: false });

        await nodeThrow();
        expect(logStub.called).to.be.false;
        expect(written(stderrWrite)).to.contain('Error: node error');

        logStub.restore();
      });

      it('should not record the printed error as telemetry', async function () {
        const rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUncaught: true,
          autoInstrument: { log: true, network: false },
        });
        const logStub = sinon.stub(rollbar.client.notifier, 'log');

        try {
          await nodeThrow();
        } finally {
          rollbar.instrumenter.deinstrumentConsole();
          logStub.restore();
        }
        expect(written(stderrWrite)).to.contain('Error: node error');
        const logEvents = rollbar.client.telemeter
          .copyEvents()
          .filter((event) => event.type === 'log');
        expect(JSON.stringify(logEvents)).to.not.contain('node error');
      });

      it('should leave printing to the app when it has its own listener', async function () {
        const rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUncaught: true,
        });
        const logStub = sinon.stub(rollbar.client.notifier, 'log');
        const appHandler = sinon.spy();
        process.on('uncaughtException', appHandler);

        await nodeThrow();
        expect(logStub.called).to.be.true;
        expect(appHandler.called).to.be.true;
        expect(written(stderrWrite)).to.not.contain('node error');

        process.removeListener('uncaughtException', appHandler);
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

    describe('printing to stderr (#1108)', function () {
      it('should print the reason when Rollbar is the only listener', async function () {
        const rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUnhandledRejections: true,
        });
        const logStub = sinon.stub(rollbar.client.notifier, 'log');

        await nodeReject();
        expect(logStub.called).to.be.true;
        expect(written(stderrWrite)).to.contain('Error: node reject\n    at ');

        logStub.restore();
      });

      it('should leave printing to the app when it has its own listener', async function () {
        const rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUnhandledRejections: true,
        });
        const logStub = sinon.stub(rollbar.client.notifier, 'log');
        const appHandler = sinon.spy();
        process.on('unhandledRejection', appHandler);

        await nodeReject();
        expect(logStub.called).to.be.true;
        expect(appHandler.called).to.be.true;
        expect(written(stderrWrite)).to.not.contain('node reject');

        process.removeListener('unhandledRejection', appHandler);
        logStub.restore();
      });
    });
  });

  // Runs Rollbar in a real Node process, with no Mocha listeners in the way,
  // which is how the issue was reported: under nodemon the crash output
  // disappeared as soon as Rollbar was initialized.
  describe('in a separate process (#1108)', function () {
    it('should still print uncaught exceptions to stderr', function () {
      const child = runChild('throw');

      expect(child.stderr).to.contain('Error: child error\n    at ');
      expect(child.stderr).to.contain('unhandled.js');
    });

    it('should still print unhandled rejections to stderr', function () {
      const child = runChild('reject');

      expect(child.stderr).to.contain('Error: child reject\n    at ');
      expect(child.stderr).to.contain('unhandled.js');
    });

    // Node's --unhandled-rejections mode decides whether it prints a
    // rejection itself; Rollbar should never make it appear twice.
    [
      ['warn', 1],
      ['strict', 1],
      ['warn-with-error-code', 1],
      ['none', 0],
    ].forEach(([mode, expected]) => {
      it(`should print a rejection ${expected} time(s) with --unhandled-rejections=${mode}`, function () {
        const child = runChild('reject', {
          nodeArgs: [`--unhandled-rejections=${mode}`],
        });

        expect(occurrences(child.stderr, 'Error: child reject')).to.equal(
          expected,
        );
      });
    });

    it('should honour --unhandled-rejections set in NODE_OPTIONS', function () {
      const child = runChild('reject', {
        env: { ...process.env, NODE_OPTIONS: '--unhandled-rejections=none' },
      });

      expect(child.stderr).to.not.contain('child reject');
    });
  });
});
