import logger from '../../logger.js';

/**
 * Schedules forced rrweb checkouts when the recorder has been idle too long.
 *
 * Recorder notifies the watchdog whenever rrweb performs a checkout. If
 * another checkout doesn't happen within the configured window, the watchdog
 * calls `forceCheckout` so buffers stay within max pre-duration limits.
 */
export default class CheckoutWatchdog {
  _getIntervalMs;
  _forceCheckout;
  _marginMs;
  _now;

  _timerId = null;
  _lastCheckoutAt = null;
  _running = false;

  /**
   * @param {Object} params
   * @param {() => number} params.getIntervalMs - Returns checkout interval
   * @param {() => void} params.forceCheckout - Invoked to force a checkout
   * @param {number} [params.marginMs] - Safety margin before forcing checkout, default: 1000ms
   * @param {() => number} [params.now] - Clock function (primarily for tests), default: Date.now
   */
  constructor({
    getIntervalMs,
    forceCheckout,
    marginMs = 1000,
    now = () => Date.now(),
  }) {
    this._getIntervalMs = getIntervalMs;
    this._forceCheckout = forceCheckout;
    this._marginMs = marginMs;
    this._now = now;
  }

  start() {
    if (this._running) return;

    this._running = true;
    this._lastCheckoutAt = this._now();
    this._arm();
  }

  stop() {
    if (!this._running) return;

    this._running = false;
    this._lastCheckoutAt = null;
    this._clearTimer();
  }

  /**
   * Notifies the watchdog that rrweb just performed a checkout.
   *
   * @param {number} [timestamp] - Timestamp of checkout (ms)
   */
  notify(timestamp = this._now()) {
    if (!this._running) return;

    this._lastCheckoutAt = timestamp;
    this._arm();
  }

  _arm() {
    this._clearTimer();

    if (!this._running) return;

    const delay = this._getIntervalMs() + this._marginMs;
    this._timerId = setTimeout(() => this._maybeForceCheckout(), delay);
  }

  _maybeForceCheckout() {
    if (!this._running) return;

    const interval = this._getIntervalMs();
    const lastCheckoutAt = this._lastCheckoutAt ?? this._now();
    const delta = this._now() - lastCheckoutAt;

    if (delta < interval) {
      this._arm();
      return;
    }

    try {
      this._forceCheckout();
    } catch (error) {
      if (this.options.debug?.logErrors) {
        logger.error('Replay: Forced checkout failed', error);
      }
    }

    this._lastCheckoutAt = this._now();
    this._arm();
  }

  _clearTimer() {
    if (this._timerId) {
      clearTimeout(this._timerId);
      this._timerId = null;
    }
  }
}
