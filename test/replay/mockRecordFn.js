/**
 * Mock implementation of rrweb.record for testing
 * Emits fixture events on a schedule to test the Recorder
 */

import { allEvents } from '../fixtures/replay/index.js';

/**
 * Mock implementation of rrweb's record function
 *
 * @param {Object} options Configuration options
 * @param {Function} options.emit Function that will receive events
 * @param {number} options.checkoutEveryNms Milliseconds between checkpoints
 * @param {number} options.emitEveryNms Milliseconds between events
 * @returns {Function} Stop function
 */
export default function mockRecordFn(options = {}) {
  function* cycling(xs) {
    let i = 0;
    while (true) {
      yield xs[i++ % xs.length];
    }
  }

  const systemEvents = ['domContentLoaded', 'load', 'meta', 'fullSnapshot'];
  const events = cycling(
    Object.entries(allEvents)
      .filter(([eventName]) => !systemEvents.includes(eventName))
      .map(([_, event]) => event),
  );

  const emit = options.emit;

  let lastCheckoutTime = Date.now();
  let intervalId = null;
  let stopping = false;
  let initialSnapshotDone = false;

  const emitNextEvent = () => {
    if (stopping) return;

    // Check if we need to do a checkout
    const now = Date.now();

    if (
      initialSnapshotDone &&
      options.checkoutEveryNms &&
      now - lastCheckoutTime >= options.checkoutEveryNms
    ) {
      lastCheckoutTime = now;

      // checkout:
      // rrweb sends both Meta and FullSnapshot events in the same tick
      // with isCheckout = true
      emit({ ...allEvents.meta }, true);
      emit({ ...allEvents.fullSnapshot }, true);
    }

    emit(events.next().value, false);
  };

  // Start emitting events on a regular interval
  // 1 event every 100ms is a reasonable pace for testing
  intervalId = setInterval(emitNextEvent, options.emitEveryNms);

  // Initial events: domContentLoaded, load, meta, fullSnapshot
  // Based on rrweb's implementation, the initial snapshot is NOT a checkout
  emit(allEvents.domContentLoaded, false);
  emit(allEvents.load, false);
  emit(allEvents.meta, false);
  emit(allEvents.fullSnapshot, false);
  initialSnapshotDone = true;

  // Return a stop function that cleans up the intervals
  return () => {
    stopping = true;
    clearInterval(intervalId);
    intervalId = null;
  };
}
