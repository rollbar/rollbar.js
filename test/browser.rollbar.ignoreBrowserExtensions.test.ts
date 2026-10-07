// @ts-nocheck
import { expect } from 'chai';

import Rollbar from '../src/browser/rollbar.js';

import { fakeServer, stubResponse } from './browser.rollbar.test-utils.ts';
import { setTimeoutAsync } from './util/timers.ts';

// Stack reported in https://github.com/rollbar/rollbar.js/issues/1470
const EXTENSION_SCRIPT =
  'chrome-extension://hhejbopdnpbjgomhpmegemnjogflenga/injectedScript.bundle.js';

function errorWithStack(message, stackLines) {
  const err = new Error(message);
  err.stack = [`Error: ${message}`, ...stackLines].join('\n');
  return err;
}

function extensionError() {
  return errorWithStack('Key ring is empty', [
    `    at r (${EXTENSION_SCRIPT}:2:589113)`,
  ]);
}

describe('options.ignoreBrowserExtensions', function () {
  let __originalOnError = null;

  before(function () {
    // Prevent WTR/Mocha from failing the test on uncaught errors.
    __originalOnError = window.onerror;
    window.onerror = () => false;
  });

  after(function () {
    window.onerror = __originalOnError;
    __originalOnError = null;
  });

  beforeEach(function () {
    window.server = fakeServer.create();
    stubResponse(window.server);
    window.server.requests.length = 0;
  });

  afterEach(function () {
    window.rollbar.configure({ autoInstrument: false, captureUncaught: false });
    window.server.restore();
  });

  async function sentItems() {
    await setTimeoutAsync(1);
    window.server.respond();
    return window.server.requests.map((r) => JSON.parse(r.requestBody));
  }

  function newRollbar(options) {
    return (window.rollbar = new Rollbar({
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      autoInstrument: false,
      ...options,
    }));
  }

  it('reports extension errors by default (issue #1470)', async function () {
    const rollbar = newRollbar({});

    rollbar.error(extensionError());

    const items = await sentItems();
    expect(items.length).to.eql(1);
    const frames = items[0].data.body.trace.frames;
    expect(frames[frames.length - 1].filename).to.eql(EXTENSION_SCRIPT);
  });

  it('ignores extension errors when enabled', async function () {
    const rollbar = newRollbar({ ignoreBrowserExtensions: true });

    rollbar.error(extensionError());

    expect(await sentItems()).to.eql([]);
  });

  it('ignores uncaught extension errors reported to window.onerror', async function () {
    newRollbar({ ignoreBrowserExtensions: true, captureUncaught: true });

    // Some browsers call onerror without an Error object, leaving only the
    // script URL to identify where the error came from.
    window.dispatchEvent(
      new ErrorEvent('error', {
        message: 'Uncaught Error: Key ring is empty',
        filename: EXTENSION_SCRIPT,
        lineno: 2,
        colno: 589113,
        error: null,
      }),
    );

    expect(await sentItems()).to.eql([]);
  });

  it('still reports uncaught application errors when enabled', async function () {
    newRollbar({ ignoreBrowserExtensions: true, captureUncaught: true });

    window.dispatchEvent(
      new ErrorEvent('error', {
        message: 'Uncaught Error: app error',
        filename: 'https://example.com/app.js',
        lineno: 10,
        colno: 5,
        error: null,
      }),
    );

    const items = await sentItems();
    expect(items.length).to.eql(1);
  });

  it('still reports application errors called through extension wrappers', async function () {
    const rollbar = newRollbar({ ignoreBrowserExtensions: true });

    // e.g. an extension that wraps addEventListener invokes the app's handler.
    rollbar.error(
      errorWithStack('app error', [
        '    at onClick (https://example.com/app.js:10:5)',
        `    at HTMLButtonElement.wrapped (${EXTENSION_SCRIPT}:1:100)`,
      ]),
    );

    const items = await sentItems();
    expect(items.length).to.eql(1);
    expect(items[0].data.body.trace.exception.message).to.eql('app error');
  });

  it('can be enabled with configure()', async function () {
    const rollbar = newRollbar({});
    rollbar.configure({ ignoreBrowserExtensions: true });

    rollbar.error(extensionError());

    expect(await sentItems()).to.eql([]);
  });
});
