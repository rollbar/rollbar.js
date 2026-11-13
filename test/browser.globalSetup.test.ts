import { expect } from 'chai';
import sinon from 'sinon';

import { captureUncaughtExceptions } from '../src/browser/globalSetup.js';

/**
 * Reproduces the `window.onerror` value a page sees in Firefox when a browser
 * extension (e.g. axe DevTools, Code Climate, a content script using Sentry)
 * has installed its own handler from the extension's privileged compartment.
 * The page gets an opaque `Restricted {}` wrapper that is still callable, but
 * every property read throws `Permission denied to access property "..."`.
 *
 * See https://github.com/rollbar/rollbar.js/issues/839
 */
function restrictedHandler(target: (...args: unknown[]) => unknown) {
  return new Proxy(target, {
    get(_target, prop) {
      throw new Error(`Permission denied to access property "${String(prop)}"`);
    },
  });
}

function fakeHandler() {
  return {
    handleAnonymousErrors: sinon.spy(),
    handleUncaughtException: sinon.spy(),
    _rollbarOldOnError: null,
  };
}

describe('globalSetup.captureUncaughtExceptions', function () {
  describe('when window.onerror is a Restricted extension handler (#839)', function () {
    it('does not throw while installing the handler', function () {
      const win: Record<string, unknown> = {
        onerror: restrictedHandler(sinon.spy()),
      };

      expect(() =>
        captureUncaughtExceptions(win, fakeHandler(), false),
      ).to.not.throw();
      expect(win.onerror).to.be.a('function');
    });

    it('still reports errors and chains to the extension handler', function () {
      const extensionOnError = sinon.spy();
      const restricted = restrictedHandler(extensionOnError);
      const win: Record<string, unknown> = { onerror: restricted };
      const handler = fakeHandler();

      captureUncaughtExceptions(win, handler, false);
      expect(handler._rollbarOldOnError).to.equal(restricted);

      const error = new Error('boom');
      (win.onerror as (...args: unknown[]) => void)(
        'boom',
        'http://example.com/app.js',
        1,
        2,
        error,
      );

      expect(handler.handleUncaughtException.calledOnce).to.be.true;
      expect(handler.handleUncaughtException.firstCall.args[4]).to.equal(error);
      expect(extensionOnError.calledOnce).to.be.true;
      expect(extensionOnError.firstCall.args[0]).to.equal('boom');
      expect(extensionOnError.firstCall.thisValue).to.equal(win);
    });

    it('stops walking the chain at a Restricted link', function () {
      const extensionOnError = sinon.spy();
      const restricted = restrictedHandler(extensionOnError);
      const shimOnError = Object.assign(function () {}, {
        _rollbarOldOnError: restricted,
      });
      const win: Record<string, unknown> = { onerror: shimOnError };
      const handler = fakeHandler();

      expect(() =>
        captureUncaughtExceptions(win, handler, false),
      ).to.not.throw();
      expect(handler._rollbarOldOnError).to.equal(restricted);

      (win.onerror as (...args: unknown[]) => void)('boom');
      expect(extensionOnError.calledOnce).to.be.true;
    });
  });

  it('keeps its bookkeeping when the chained handler throws', function () {
    const chainError = new Error('Permission denied to access object');
    const win: Record<string, unknown> = {
      onerror: sinon.stub().throws(chainError),
    };
    const handler = Object.assign(fakeHandler(), {
      handleUncaughtException: sinon.stub().returns('anonymous'),
      anonymousErrorsPending: 0,
    });

    captureUncaughtExceptions(win, handler, false);

    expect(() =>
      (win.onerror as (...args: unknown[]) => void)('boom'),
    ).to.throw(chainError);
    expect(handler.handleUncaughtException.calledOnce).to.be.true;
    expect(handler.anonymousErrorsPending).to.equal(1);
  });

  it('unwraps previously installed Rollbar handlers to the original onerror', function () {
    const original = sinon.spy();
    const shimOnError = Object.assign(function () {}, {
      _rollbarOldOnError: original,
    });
    const win: Record<string, unknown> = { onerror: shimOnError };
    const handler = fakeHandler();

    captureUncaughtExceptions(win, handler, false);

    expect(handler._rollbarOldOnError).to.equal(original);
    (win.onerror as (...args: unknown[]) => void)('boom');
    expect(original.calledOnce).to.be.true;
  });
});
