// @ts-nocheck
import { expect } from 'chai';
import sinon from 'sinon';

import Rollbar from '../src/browser/rollbar.js';

import { fakeServer, stubResponse } from './browser.rollbar.test-utils.ts';
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
});
