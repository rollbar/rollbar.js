import { spawn, spawnSync } from 'node:child_process';
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

function runChild(mode, { nodeArgs = [], env = process.env, variant } = {}) {
  const fixture = fileURLToPath(
    new URL('./fixtures/server/unhandled.js', import.meta.url),
  );
  const fixtureArgs = variant ? [mode, variant] : [mode];
  // spawnSync blocks the event loop, so Mocha's own timeout cannot stop a
  // child that never exits; this one turns a hang into a test failure.
  const child = spawnSync(
    process.execPath,
    [...nodeArgs, fixture, ...fixtureArgs],
    {
      encoding: 'utf8',
      env,
      timeout: 10000,
    },
  );
  expect(child.error, 'child process did not exit cleanly').to.be.undefined;
  return child;
}

// Runs the fixture with its stderr pipe already closed, as under
// `node app.js 2>&1 | head` once `head` has exited. Resolves with the exit
// status, or null if the child had to be killed.
function runChildWithClosedStderr(mode) {
  const fixture = fileURLToPath(
    new URL('./fixtures/server/unhandled.js', import.meta.url),
  );
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [fixture, mode], {
      stdio: ['ignore', 'ignore', 'pipe'],
    });
    child.stderr.destroy();
    const timer = setTimeout(() => child.kill('SIGKILL'), 10000);
    child.on('exit', (status) => {
      clearTimeout(timer);
      resolve(status);
    });
  });
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

function rollbarListeners(event) {
  return process.listeners(event).filter((l) => l._rollbarHandler);
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
        expect(rollbarListeners('uncaughtException')).to.have.length(0);

        // Rollbar no longer handles the event, so without this the throw
        // would crash the test process
        const tempHandler = () => {};
        process.on('uncaughtException', tempHandler);

        await nodeThrow();
        expect(logStub.called).to.be.false;

        process.removeListener('uncaughtException', tempHandler);
        logStub.restore();
      });
    });

    describe('with enabled: false', function () {
      it('should not install a handler, leaving Node to report the error', async function () {
        const rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUncaught: true,
          enabled: false,
        });
        const logStub = sinon.stub(rollbar.client.notifier, 'log');

        expect(rollbarListeners('uncaughtException')).to.have.length(0);

        const tempHandler = sinon.spy();
        process.on('uncaughtException', tempHandler);

        await nodeThrow();
        expect(logStub.called).to.be.false;
        expect(tempHandler.calledOnce).to.be.true;
        expect(tempHandler.getCall(0).args[0].message).to.equal('node error');

        process.removeListener('uncaughtException', tempHandler);
        logStub.restore();
      });

      it('should remove the handler when disabled in configure', function () {
        const rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUncaught: true,
        });
        expect(rollbarListeners('uncaughtException')).to.have.length(1);

        rollbar.configure({ enabled: false });
        expect(rollbarListeners('uncaughtException')).to.have.length(0);
      });

      it('should not install a handler for other falsy enabled values', function () {
        [0, '', null].forEach(function (enabled) {
          new Rollbar({
            accessToken: 'abc123',
            captureUncaught: true,
            enabled: enabled,
          });
          expect(rollbarListeners('uncaughtException')).to.have.length(0);
        });
      });

      it('should not remove a handler installed by another instance', function () {
        new Rollbar({ accessToken: 'abc123', captureUncaught: true });
        expect(rollbarListeners('uncaughtException')).to.have.length(1);

        new Rollbar({ accessToken: 'abc123', enabled: false });
        new Rollbar({ accessToken: 'abc123' });
        expect(rollbarListeners('uncaughtException')).to.have.length(1);
      });

      it('should install the handler when enabled in configure', async function () {
        const rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUncaught: true,
          enabled: false,
        });
        const logStub = sinon.stub(rollbar.client.notifier, 'log');
        expect(rollbarListeners('uncaughtException')).to.have.length(0);

        rollbar.configure({ enabled: true });
        expect(rollbarListeners('uncaughtException')).to.have.length(1);

        await nodeThrow();
        expect(logStub.called).to.be.true;
        expect(logStub.getCall(0).args[0].err.message).to.equal('node error');

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

      it('should label a thrown value that is not an error', async function () {
        const rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUncaught: true,
        });
        const logStub = sinon.stub(rollbar.client.notifier, 'log');

        setTimeout(function () {
          throw { code: 42 };
        }, 10);
        await wait(500);
        expect(written(stderrWrite)).to.contain('Uncaught { code: 42 }\n');

        logStub.restore();
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
        expect(rollbarListeners('unhandledRejection')).to.have.length(0);

        // Rollbar no longer handles the event, so without this the rejection
        // would crash the test process
        const tempHandler = () => {};
        process.on('unhandledRejection', tempHandler);

        await nodeReject();
        expect(logStub.called).to.be.false;

        process.removeListener('unhandledRejection', tempHandler);
        logStub.restore();
      });
    });

    describe('with enabled: false', function () {
      it('should not install a handler, leaving Node to report the rejection', async function () {
        const rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUnhandledRejections: true,
          enabled: false,
        });
        const logStub = sinon.stub(rollbar.client.notifier, 'log');

        expect(rollbarListeners('unhandledRejection')).to.have.length(0);

        const tempHandler = sinon.spy();
        process.on('unhandledRejection', tempHandler);

        await nodeReject();
        expect(logStub.called).to.be.false;
        expect(tempHandler.calledOnce).to.be.true;
        expect(tempHandler.getCall(0).args[0].message).to.equal('node reject');

        process.removeListener('unhandledRejection', tempHandler);
        logStub.restore();
      });

      it('should remove the handler when disabled in configure', function () {
        const rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUnhandledRejections: true,
        });
        expect(rollbarListeners('unhandledRejection')).to.have.length(1);

        rollbar.configure({ enabled: false });
        expect(rollbarListeners('unhandledRejection')).to.have.length(0);
      });

      it('should not install a handler for other falsy enabled values', function () {
        [0, '', null].forEach(function (enabled) {
          new Rollbar({
            accessToken: 'abc123',
            captureUnhandledRejections: true,
            enabled: enabled,
          });
          expect(rollbarListeners('unhandledRejection')).to.have.length(0);
        });
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

      // Node prints its own UnhandledPromiseRejection message for these.
      [
        [undefined, 'undefined'],
        ['boom', 'boom'],
        [{ code: 42 }, '{ code: 42 }'],
      ].forEach(([reason, described]) => {
        it(`should label a rejection reason that is not an error (${described})`, async function () {
          const rollbar = new Rollbar({
            accessToken: 'abc123',
            captureUnhandledRejections: true,
          });
          const logStub = sinon.stub(rollbar.client.notifier, 'log');

          Promise.reject(reason);
          await wait(500);
          const output = written(stderrWrite);
          expect(output).to.contain('UnhandledPromiseRejection: ');
          expect(output).to.contain(
            `The promise rejected with the reason "${described}".\n`,
          );

          logStub.restore();
        });
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

      // The app's once listener is gone by the time Rollbar's handler runs,
      // so this relies on the probe's snapshot matching a NaN reason.
      it('should leave printing to an app once listener for a NaN reason', async function () {
        const appHandler = sinon.spy();
        process.once('unhandledRejection', appHandler);
        const rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUnhandledRejections: true,
        });
        const logStub = sinon.stub(rollbar.client.notifier, 'log');

        Promise.reject(NaN);
        await wait(500);
        expect(appHandler.called).to.be.true;
        expect(written(stderrWrite)).to.not.contain('NaN');

        process.removeListener('unhandledRejection', appHandler);
        logStub.restore();
      });
    });
  });

  // Runs Rollbar in a real Node process, with no Mocha listeners in the way,
  // which is how the issue was reported: under nodemon the crash output
  // disappeared as soon as Rollbar was initialized.
  //
  // Counting occurrences, rather than checking that the error appears, also
  // pins the Node behaviour the fix relies on: Node stays silent once any
  // listener is installed. CI runs these on every supported Node version, so
  // a version that also printed would fail here with a count of 2.
  describe('in a separate process (#1108)', function () {
    it('should still print uncaught exceptions to stderr', function () {
      const child = runChild('throw');

      expect(child.stderr).to.contain('Error: child error\n    at ');
      expect(child.stderr).to.contain('unhandled.js');
      expect(occurrences(child.stderr, 'Error: child error')).to.equal(1);
    });

    it('should still print unhandled rejections to stderr', function () {
      const child = runChild('reject');

      expect(child.stderr).to.contain('Error: child reject\n    at ');
      expect(child.stderr).to.contain('unhandled.js');
      expect(occurrences(child.stderr, 'Error: child reject')).to.equal(1);
    });

    // Neither Node nor Rollbar prints when the app has its own listener.
    ['throw', 'reject'].forEach((mode) => {
      it(`should print nothing when the app listens too (${mode})`, function () {
        const child = runChild(mode, { variant: 'app-listener' });

        expect(child.stderr).to.not.contain('Error: child');
      });
    });

    // A listener added with `process.once` has removed itself by the time
    // Rollbar's handler runs, but it still handled the error.
    ['throw', 'reject'].forEach((mode) => {
      it(`should print nothing when the app listens with once (${mode})`, function () {
        const child = runChild(mode, { variant: 'app-once' });

        expect(child.stderr).to.not.contain('Error: child');
      });
    });

    // Loading `domain` adds a listener of Node's own next to Rollbar's; it
    // prints nothing, so Rollbar still has to.
    ['throw', 'reject'].forEach((mode) => {
      it(`should still print with the domain module loaded (${mode})`, function () {
        const child = runChild(mode, { variant: 'domain' });
        const message = mode === 'reject' ? 'child reject' : 'child error';

        expect(
          occurrences(child.stderr, `Error: ${message}\n    at `),
        ).to.equal(1);
      });
    });

    // Like Node, Rollbar ignores custom inspect methods when printing, and
    // falls back to the stack if inspecting fails.
    ['throw', 'reject'].forEach((mode) => {
      const message = mode === 'reject' ? 'child reject' : 'child error';

      it(`should print a value whose inspect method throws (${mode})`, function () {
        const child = runChild(mode, { variant: 'uninspectable' });

        expect(child.status).to.equal(0);
        expect(
          occurrences(child.stderr, `Error: ${message}\n    at `),
        ).to.equal(1);
        // Node lists the method as an ordinary property when it prints the
        // error itself; the stack fallback would leave it out.
        expect(child.stderr).to.contain('Symbol(nodejs.util.inspect.custom)');
        expect(child.stderr).to.not.contain('inspect failed');
        expect(child.stderr).to.not.contain('Failed to print');
      });

      it(`should print the stack when util.inspect throws (${mode})`, function () {
        const child = runChild(mode, { variant: 'no-inspect' });

        expect(child.status).to.equal(0);
        expect(
          occurrences(child.stderr, `Error: ${message}\n    at `),
        ).to.equal(1);
        expect(child.stderr).to.not.contain('Failed to print');
      });
    });

    // A value with no stack gets the label Node would give it, so it can
    // still be told apart from other output.
    it('should label a thrown string', function () {
      const child = runChild('throw', { variant: 'string' });

      expect(occurrences(child.stderr, "Uncaught 'child error'\n")).to.equal(1);
    });

    it('should label a string rejection reason', function () {
      const child = runChild('reject', { variant: 'string' });

      expect(
        occurrences(
          child.stderr,
          'The promise rejected with the reason "child reject".',
        ),
      ).to.equal(1);
    });

    // Under `strict`, Node wraps the reason in its own error and raises that
    // as an uncaught exception, which is printed like any other error.
    it('should print a string rejection reason once with --unhandled-rejections=strict', function () {
      const child = runChild('reject', {
        nodeArgs: ['--unhandled-rejections=strict'],
        variant: 'string',
      });

      expect(
        occurrences(
          child.stderr,
          'The promise rejected with the reason "child reject".',
        ),
      ).to.equal(1);
      expect(child.stderr).to.not.contain('Uncaught');
    });

    // Printing is best-effort: a throw from Rollbar's uncaughtException
    // listener would make Node exit with code 7, and one from its
    // unhandledRejection listener would raise a second uncaught exception.
    ['throw', 'reject'].forEach((mode) => {
      it(`should survive a value that cannot be printed (${mode})`, function () {
        const child = runChild(mode, { variant: 'unprintable' });

        expect(child.status).to.equal(0);
        expect(
          occurrences(
            child.stderr,
            'Rollbar: Failed to print unhandled error. Error: inspect failed',
          ),
        ).to.equal(1);
      });
    });

    // Otherwise each print raises an uncaught EPIPE, which Rollbar reports
    // and prints again, forever.
    ['throw', 'reject'].forEach((mode) => {
      it(`should exit when stderr is a closed pipe (${mode})`, async function () {
        this.timeout(15000);

        expect(await runChildWithClosedStderr(mode)).to.equal(0);
      });
    });

    // Node's --unhandled-rejections mode decides whether it prints a
    // rejection itself; Rollbar should never make it appear twice.
    [
      ['throw', 1],
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

    // Node accepts underscores in option names and quoted values in
    // NODE_OPTIONS; misreading either would print the rejection twice under
    // warn, or at all under none.
    it('should honour --unhandled_rejections spelled with an underscore', function () {
      const child = runChild('reject', {
        nodeArgs: ['--unhandled_rejections=warn'],
      });

      expect(occurrences(child.stderr, 'Error: child reject')).to.equal(1);
    });

    [
      '--unhandled_rejections=none',
      '--unhandled-rejections="none"',
      '"--unhandled-rejections" none',
    ].forEach((nodeOptions) => {
      it(`should honour NODE_OPTIONS=${nodeOptions}`, function () {
        const child = runChild('reject', {
          env: { ...process.env, NODE_OPTIONS: nodeOptions },
        });

        expect(child.stderr).to.not.contain('child reject');
      });
    });
  });
});
