import { expect } from 'chai';
import sinon from 'sinon';

import CheckoutWatchdog from '../../../src/browser/replay/checkoutWatchdog.js';

describe('CheckoutWatchdog', function () {
  let clock;
  let forceCheckout;
  let intervalStub;
  let watchdog;

  beforeEach(function () {
    clock = sinon.useFakeTimers();
    forceCheckout = sinon.stub();
    intervalStub = sinon.stub().returns(1000);
    watchdog = new CheckoutWatchdog({
      getIntervalMs: () => intervalStub(),
      forceCheckout,
      marginMs: 0,
    });
  });

  afterEach(function () {
    clock.restore();
  });

  it('forces a checkout when idle exceeds interval', function () {
    watchdog.start();
    clock.tick(1000);

    expect(forceCheckout.calledOnce).to.be.true;
  });

  it('resets timer when notified of normal checkout', function () {
    watchdog.start();
    clock.tick(500);
    watchdog.notify();
    clock.tick(900);

    expect(forceCheckout.called).to.be.false;

    clock.tick(200);
    expect(forceCheckout.calledOnce).to.be.true;
  });

  it('stops scheduling when stopped', function () {
    watchdog.start();
    watchdog.stop();
    clock.tick(2000);

    expect(forceCheckout.called).to.be.false;
  });

  it('ignores notifications when not running', function () {
    watchdog.notify();
    clock.tick(2000);

    expect(forceCheckout.called).to.be.false;
  });

  it('re-evaluates the interval dynamically', function () {
    watchdog.start();
    intervalStub.returns(2000);
    watchdog.notify();
    clock.tick(1500);

    expect(forceCheckout.called).to.be.false;

    clock.tick(500);
    expect(forceCheckout.calledOnce).to.be.true;
  });
});
