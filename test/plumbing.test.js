import { expect } from 'chai';
import Rollbar from '../src/browser/core.js';

describe('global error plumbing probe', function () {
  it('shows environment differences', function (done) {
    const beforeType = typeof window.onerror;
    console.log('[probe] before Rollbar: typeof window.onerror =', beforeType);

    // listener to log order of events
    const order = [];
    const capListener = (e) => {
      order.push('capture (ours)');
    };
    const bubListener = (e) => {
      order.push('bubble (ours)');
    };
    window.addEventListener('error', capListener, true);
    window.addEventListener('error', bubListener, false);

    // Rollbar sets window.onerror and chains old one if present
    const rb = (window.rollbar = new Rollbar({
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
    }));

    const hasOld = !!(window.onerror && window.onerror._rollbarOldOnError);
    console.log('[probe] after Rollbar: has _rollbarOldOnError =', hasOld);

    // Swallow the next error so WTR/Mocha doesn’t fail the test,
    // but still let Rollbar’s onerror run.
    const swallowOnce = (e) => {
      order.push('swallow');
      try {
        if (typeof window.onerror === 'function') {
          window.onerror(e.message, e.filename, e.lineno, e.colno, e.error);
        }
      } finally {
        e.preventDefault();
        e.stopImmediatePropagation();
        window.removeEventListener('error', swallowOnce, true);
      }
    };
    window.addEventListener('error', swallowOnce, true);

    // Trigger a real global error (outside the test stack)
    setTimeout(() => {
      throw new Error('probe error');
    }, 0);

    setTimeout(() => {
      console.log('[probe] order =', order);
      expect(order).to.include('capture (ours)');
      expect(order).to.include('bubble (ours)');
      done();
    }, 20);
  });
});
