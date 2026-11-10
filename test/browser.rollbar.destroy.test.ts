// @ts-nocheck
import { expect } from 'chai';
import sinon from 'sinon';

import replayDefaults from '../src/browser/replay/defaults.js';
import Replay from '../src/browser/replay/replay.js';
import Rollbar from '../src/browser/rollbar.js';
import logger from '../src/logger.js';
import RateLimiter from '../src/rateLimiter.js';

import { fakeServer, stubResponse } from './browser.rollbar.test-utils.ts';
import { allEvents } from './fixtures/replay/index.ts';
import { setTimeoutAsync } from './util/timers.ts';

function rejectionEvent(reason) {
  const promise = Promise.reject(reason);
  promise.catch(() => {});
  return new PromiseRejectionEvent('unhandledrejection', { promise, reason });
}

let instances = [];

function newInstance(accessToken, options = {}) {
  const rollbar = new Rollbar({
    accessToken,
    captureUncaught: true,
    captureUnhandledRejections: true,
    ...options,
  });
  instances.push(rollbar);
  return rollbar;
}

function requestTokens(server) {
  return server.requests.map((r) => r.requestHeaders['X-Rollbar-Access-Token']);
}

// Gives the instance a replay that stores one payload for every reported item,
// wired into the queue the way the replay bundle does it.
function attachReplay(rollbar) {
  const recordFn = () => () => {};
  recordFn.takeFullSnapshot = () => {};
  const replay = new Replay({
    tracing: rollbar.tracing,
    telemeter: rollbar.telemeter,
    options: { ...replayDefaults, enabled: true, recordFn },
  });
  let count = 0;
  sinon.stub(replay, 'capture').callsFake(() => {
    const replayId = `replay-${++count}`;
    replay.setSpans(replayId, [{ name: 'span' }]);
    return replayId;
  });
  rollbar.replay = replay;
  rollbar.client.queue.replay = replay;
  return replay;
}

function telemetryEvents(rollbar, type) {
  return rollbar.telemeter.queue.filter((e) => e.type === type);
}

describe('destroy', function () {
  let originalOnError;
  let originalFetch;
  let originalConsoleLog;
  let originalPushState;

  beforeEach(function () {
    window.server = fakeServer.create();
    stubResponse(window.server);
    originalOnError = window.onerror;
    originalFetch = window.fetch;
    originalConsoleLog = window.console.log;
    originalPushState = history.pushState;
  });

  afterEach(function () {
    instances.forEach((rollbar) => rollbar.destroy());
    instances = [];
    window.server.restore();
    window.onerror = originalOnError;
    sinon.restore();
  });

  // https://github.com/rollbar/rollbar.js/issues/1050
  it('should stop reporting unhandled rejections for a destroyed instance', async function () {
    newInstance('CONTAINER_TOKEN');
    const subApp = newInstance('SUB_APP_TOKEN');
    const subAppHandler = sinon.spy(subApp, 'handleUnhandledRejection');

    subApp.destroy();
    window.dispatchEvent(rejectionEvent(new Error('after unmount')));

    await setTimeoutAsync(100);
    window.server.respond();

    expect(subAppHandler.called).to.equal(false);
    expect(requestTokens(window.server)).to.eql(['CONTAINER_TOKEN']);
  });

  it('should restore window.onerror to the handler it chained to', function () {
    const appOnError = sinon.spy();
    window.onerror = appOnError;

    const rollbar = newInstance('TOKEN');
    expect(window.onerror).to.not.equal(appOnError);

    rollbar.destroy();

    expect(window.onerror).to.equal(appOnError);
  });

  it('should not overwrite an onerror handler installed after it', async function () {
    // Keep the test runner's own onerror out of the chain this test calls.
    window.onerror = null;
    const first = newInstance('FIRST_TOKEN');
    newInstance('SECOND_TOKEN');
    const secondOnError = window.onerror;
    const firstHandler = sinon.spy(first.client, 'log');

    first.destroy();

    expect(window.onerror).to.equal(secondOnError);

    window.onerror(
      'boom',
      'http://example.com/app.js',
      1,
      1,
      new Error('boom'),
    );
    await setTimeoutAsync(100);
    window.server.respond();

    expect(firstHandler.called).to.equal(false);
    expect(requestTokens(window.server)).to.eql(['SECOND_TOKEN']);
  });

  describe('anonymous error capture in Chrome', function () {
    let originalChrome;
    let originalPrepareStackTrace;

    beforeEach(function () {
      originalChrome = window.chrome;
      originalPrepareStackTrace = Error.prepareStackTrace;
      // ChromeHeadless doesn't expose chrome.runtime, which the check relies on.
      window.chrome = { runtime: true };
    });

    afterEach(function () {
      window.chrome = originalChrome;
      Error.prepareStackTrace = originalPrepareStackTrace;
    });

    it('should restore the page Error.prepareStackTrace', function () {
      const pagePrepareStackTrace = (error) => error.stack;
      Error.prepareStackTrace = pagePrepareStackTrace;

      const rollbar = newInstance('TOKEN', { inspectAnonymousErrors: true });
      expect(Error.prepareStackTrace).to.not.equal(pagePrepareStackTrace);

      rollbar.destroy();

      expect(Error.prepareStackTrace).to.equal(pagePrepareStackTrace);
    });

    it('should restore it after the snippet replays handleAnonymousErrors', function () {
      const pagePrepareStackTrace = (error) => error.stack;
      Error.prepareStackTrace = pagePrepareStackTrace;

      const rollbar = newInstance('TOKEN', { inspectAnonymousErrors: true });
      // What the snippet loader replays on the full instance once it loads.
      rollbar.handleAnonymousErrors();

      rollbar.destroy();

      expect(Error.prepareStackTrace).to.equal(pagePrepareStackTrace);
    });
  });

  it('should remove telemetry instrumentation', function () {
    const rollbar = newInstance('TOKEN');
    expect(window.fetch).to.not.equal(originalFetch);
    expect(window.console.log).to.not.equal(originalConsoleLog);
    expect(history.pushState).to.not.equal(originalPushState);

    rollbar.destroy();

    expect(window.fetch).to.equal(originalFetch);
    expect(window.console.log).to.equal(originalConsoleLog);
    expect(history.pushState).to.equal(originalPushState);
    expect(rollbar.instrumenter.eventRemovers.dom).to.eql([]);
  });

  it('should leave instrumentation installed by a later instance', function () {
    const first = newInstance('FIRST_TOKEN');
    newInstance('SECOND_TOKEN');
    const secondFetch = window.fetch;
    const secondConsoleLog = window.console.log;

    first.destroy();

    expect(window.fetch).to.equal(secondFetch);
    expect(window.console.log).to.equal(secondConsoleLog);
  });

  describe('turning telemetry off under a later wrapper', function () {
    afterEach(function () {
      window.console.log = originalConsoleLog;
      window.fetch = originalFetch;
    });

    it('should stop recording console calls, and record them once when turned back on', function () {
      const rollbar = newInstance('TOKEN');
      const rollbarConsoleLog = window.console.log;
      const laterConsoleLog = function (...args) {
        return rollbarConsoleLog.apply(this, args);
      };
      window.console.log = laterConsoleLog;
      const messages = () =>
        telemetryEvents(rollbar, 'log').map((e) => e.body.message);

      rollbar.configure({ autoInstrument: { log: false } });
      window.console.log('while off');

      expect(window.console.log).to.equal(laterConsoleLog);
      expect(messages()).to.not.include('while off');

      rollbar.configure({ autoInstrument: { log: true } });
      window.console.log('back on');

      expect(messages().filter((m) => m === 'back on')).to.have.length(1);
    });

    it('should stop recording fetch requests', async function () {
      window.fetch = sinon.stub().resolves(new Response('ok'));
      const rollbar = newInstance('TOKEN');
      const rollbarFetch = window.fetch;
      const laterFetch = function (...args) {
        return rollbarFetch.apply(this, args);
      };
      window.fetch = laterFetch;

      rollbar.configure({ autoInstrument: { network: false } });
      await window.fetch('https://example.com/while-off');

      expect(window.fetch).to.equal(laterFetch);
      expect(telemetryEvents(rollbar, 'network')).to.eql([]);
    });
  });

  it('should leave the rate limits shared with other instances alone', function () {
    const savedSettings = { ...RateLimiter.globalSettings };
    try {
      const subApp = newInstance('SUB_APP_TOKEN', { itemsPerMinute: 1 });
      newInstance('CONTAINER_TOKEN', { itemsPerMinute: 60 });

      subApp.destroy();

      expect(RateLimiter.globalSettings.itemsPerMinute).to.equal(60);
    } finally {
      Object.assign(RateLimiter.globalSettings, savedSettings);
    }
  });

  it('should drop items logged after destroy', async function () {
    const rollbar = newInstance('TOKEN');
    rollbar.destroy();

    const callback = sinon.spy();
    rollbar.error('after destroy', callback);

    await setTimeoutAsync(100);
    window.server.respond();

    expect(window.server.requests.length).to.equal(0);
    expect(callback.calledOnce).to.equal(true);
    expect(callback.firstCall.args[0]).to.be.an('error');
  });

  it('should ignore configure() after destroy', function () {
    const rollbar = newInstance('TOKEN');
    rollbar.destroy();

    rollbar.configure({ captureUnhandledRejections: true, enabled: true });

    expect(window.fetch).to.equal(originalFetch);
    expect(rollbar.client.notifier.options.enabled).to.equal(false);
  });

  it('should stop the replay recorder and drop its buffered recording', function () {
    const rollbar = newInstance('TOKEN');
    let emit;
    const recordFn = (options) => {
      emit = options.emit;
      return () => {};
    };
    recordFn.takeFullSnapshot = () => {};
    rollbar.replay = new Replay({
      tracing: rollbar.tracing,
      telemeter: rollbar.telemeter,
      options: { ...replayDefaults, enabled: true, recordFn },
    });
    const recorder = rollbar.replay.recorder;
    recorder.start();
    emit(allEvents.meta, false);
    emit(allEvents.fullSnapshot, false);
    expect(recorder.isReady).to.equal(true);

    rollbar.destroy();

    expect(recorder.isRecording).to.equal(false);
    expect(recorder.isReady).to.equal(false);
    expect(recorder._buffers).to.eql([[], []]);
  });

  it('should still send the replay of an item it waited for', async function () {
    window.server.respondWith('POST', /api\/1\/item/, [
      200,
      { 'Content-Type': 'application/json', 'Rollbar-Replay-Enabled': 'true' },
      '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}',
    ]);
    const rollbar = newInstance('TOKEN');
    const replay = attachReplay(rollbar);
    const postReplay = sinon.stub(rollbar.tracing.exporter, 'post').resolves();
    const loggerError = sinon.stub(logger, 'error');

    rollbar.error('before unmount');
    await setTimeoutAsync(100);
    const destroyed = new Promise((resolve) => {
      rollbar.wait(() => {
        rollbar.destroy();
        resolve();
      });
    });
    window.server.respond();
    await destroyed;
    await setTimeoutAsync(0);

    expect(postReplay.calledOnce).to.equal(true);
    expect(postReplay.firstCall.args[1]).to.eql({
      'X-Rollbar-Replay-Id': 'replay-1',
    });
    expect(replay.size).to.equal(0);
    expect(loggerError.called).to.equal(false);
  });

  it('should discard the replays of queued retries without errors', async function () {
    const rollbar = newInstance('TOKEN');
    const replay = attachReplay(rollbar);
    const queue = rollbar.client.queue;
    queue.options.retryInterval = 1000;
    const offline = Object.assign(new Error('offline'), { code: 'ENOTFOUND' });
    sinon.stub(rollbar.client.api, 'postItem').callsFake((_item, callback) => {
      callback(offline);
    });
    const loggerError = sinon.stub(logger, 'error');

    rollbar.error('while offline');
    await setTimeoutAsync(100);
    expect(queue.retryQueue.length).to.equal(1);
    expect(replay.size).to.equal(1);

    rollbar.destroy();
    await setTimeoutAsync(0);

    expect(replay.size).to.equal(0);
    expect(loggerError.called).to.equal(false);
  });

  it('should be safe to call more than once', function () {
    const rollbar = newInstance('TOKEN');
    rollbar.destroy();
    expect(() => rollbar.destroy()).to.not.throw();
  });

  it('should let Rollbar.init() create a new instance', function () {
    const first = Rollbar.init({ accessToken: 'FIRST_TOKEN' });
    Rollbar.destroy();

    const second = Rollbar.init({ accessToken: 'SECOND_TOKEN' });

    expect(second).to.not.equal(first);
    Rollbar.destroy();
    expect(() => Rollbar.destroy()).to.not.throw();
  });

  it('should fail queued retries and stop the retry timer', function () {
    const rollbar = newInstance('TOKEN');
    const queue = rollbar.client.queue;
    const callback = sinon.spy();
    queue.options.retryInterval = 1000;
    queue._retryApiRequest({}, callback);
    expect(queue.retryHandle).to.exist;

    rollbar.destroy();

    expect(queue.retryHandle).to.not.exist;
    expect(queue.retryQueue).to.eql([]);
    expect(callback.calledOnce).to.equal(true);
    expect(callback.firstCall.args[0]).to.be.an('error');
  });

  it('should not retry a send that fails after destroy', function () {
    const rollbar = newInstance('TOKEN');
    const queue = rollbar.client.queue;
    queue.options.retryInterval = 1000;
    const callback = sinon.spy();
    const offline = Object.assign(new Error('offline'), { code: 'ENOTFOUND' });

    rollbar.destroy();
    queue._maybeRetry(offline, {}, callback);

    expect(queue.retryHandle).to.not.exist;
    expect(queue.retryQueue).to.eql([]);
    expect(callback.calledOnceWithExactly(offline)).to.equal(true);
  });
});
