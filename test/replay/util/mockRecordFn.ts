/**
 * Mock implementation of rrweb.record for testing
 * Emits fixture events on a schedule to test the Recorder
 */
import type { eventWithTime } from '@rrweb/types';
import sinon, { type SinonStub } from 'sinon';

import { allEvents } from '../../fixtures/replay/index.ts';

interface MockRecordFnOptions {
  emit: (event: eventWithTime, isCheckout: boolean) => void;
  checkoutEveryNms?: number;
  emitEveryNms?: number;
  errorHandler?: (error: unknown) => boolean | void;
  [key: string]: unknown;
}

interface MockRecordFn {
  (options: MockRecordFnOptions): () => void;
  takeFullSnapshot: (isCheckout?: boolean) => void;
}

interface RecordStub extends SinonStub {
  takeFullSnapshot: SinonStub;
}

function* cycling<T>(xs: T[]): Generator<T, void, unknown> {
  let i = 0;
  while (true) {
    yield xs[i++ % xs.length];
  }
}

export function stubRecordFn(): RecordStub {
  const recordFn = sinon.stub() as RecordStub;
  recordFn.takeFullSnapshot = sinon.stub();
  recordFn.callsFake(() => () => {});
  return recordFn;
}

const mockRecordFn = ((options: MockRecordFnOptions) => {
  const emit = options.emit;

  const systemEvents: (keyof typeof allEvents)[] = [
    'domContentLoaded',
    'load',
    'meta',
    'fullSnapshot',
  ];

  const events = cycling(
    Object.entries(allEvents)
      .filter(
        ([eventName]) =>
          !systemEvents.includes(eventName as keyof typeof allEvents),
      )
      .map(([, event]) => event),
  );

  let lastCheckoutTime = Date.now();
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let stopping = false;
  let initialSnapshotDone = false;

  const emitCheckoutPair = (
    emitFn: MockRecordFnOptions['emit'],
    isCheckout: boolean,
  ) => {
    // rrweb sends both Meta and FullSnapshot events
    // in the same tick on checkout
    emitFn({ ...(allEvents.meta as eventWithTime) }, isCheckout);
    emitFn({ ...(allEvents.fullSnapshot as eventWithTime) }, isCheckout);
  };

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
      emitCheckoutPair(emit, true);
    }

    emit(events.next().value as eventWithTime, false);
  };

  // Start emitting events on a regular interval
  // 1 event every 100ms is a reasonable pace for testing
  intervalId = setInterval(emitNextEvent, options.emitEveryNms ?? 0);

  // Initial events: domContentLoaded, load, meta, fullSnapshot
  // Based on rrweb's implementation, the initial snapshot is NOT a checkout
  emit(allEvents.domContentLoaded as eventWithTime, false);
  emit(allEvents.load as eventWithTime, false);
  emit(allEvents.meta as eventWithTime, false);
  emit(allEvents.fullSnapshot as eventWithTime, false);
  initialSnapshotDone = true;

  mockRecordFn.takeFullSnapshot = (isCheckout = false) => {
    lastCheckoutTime = Date.now();
    emitCheckoutPair(emit, isCheckout);
  };

  // Return a stop function that cleans up the intervals
  return () => {
    stopping = true;
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    mockRecordFn.takeFullSnapshot = () => {};
  };
}) as MockRecordFn;

mockRecordFn.takeFullSnapshot = () => {};

export default mockRecordFn;
