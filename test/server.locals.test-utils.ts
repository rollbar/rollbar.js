/**
 * Common test utilities for server locals tests
 */
import type { SinonStub } from 'sinon';

import type Rollbar from '../src/server/rollbar.js';

export const nodeMajorVersion = parseInt(
  process.versions.node.split('.')[0],
  10,
);

export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function promiseReject(): Promise<void> {
  const error = new Error('promise reject');
  Promise.reject(error);
  await wait(500);
}

export async function nodeThrow(): Promise<void> {
  setTimeout(() => {
    const error = new Error('node error');
    throw error;
  }, 1);

  await wait(500);
}

export async function nodeThrowAndCatch(rollbar: Rollbar): Promise<void> {
  setTimeout(() => {
    const error = new Error('caught error');
    try {
      throw error;
    } catch (e) {
      rollbar.error(e);
    }
  }, 1);

  await wait(500);
}

type NestedError = Error & { nested?: unknown };

export async function nodeThrowNested(): Promise<void> {
  function nestedError(nestedMessage: string, _password: string): never {
    const nestedError = new Error(nestedMessage);
    throw nestedError;
  }

  setTimeout(() => {
    const message = 'test err';
    const newMessage = `nested ${message}`;
    const password = '123456';
    const err: NestedError = new Error(message);

    try {
      nestedError(newMessage, password);
    } catch (e) {
      err.nested = e;
    }

    throw err;
  }, 1);

  await wait(500);
}

export async function nodeThrowWithNestedLocals(): Promise<void> {
  setTimeout(() => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    // These are necessary to create locals in the stack frames
    const arr = [{ zero: [0, 0] }, { one: 1 }, { two: 2 }, { three: 3 }];
    const obj = { a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f' };
    const password = 'password';
    const sym = Symbol('foo');
    const error = new Error('node error');
    /* eslint-enable @typescript-eslint/no-unused-vars */
    throw error;
  }, 1);

  await wait(500);
}

export async function nodeThrowRecursionError(): Promise<void> {
  function recurse(curr: number, limit: number): void {
    if (curr < limit) {
      recurse(curr + 1, limit);
    } else {
      throw new Error(`deep stack error, limit=${limit}`);
    }
  }

  setTimeout(() => recurse(0, 3), 1);
  await wait(500);
}

interface TraceFrame {
  locals?: Record<string, unknown>;
}

interface TraceChainEntry {
  frames: TraceFrame[];
  exception: { message: string };
}

export function verifyRejectedPromise(addItemStub: SinonStub): {
  message: string;
  hasLocals: boolean;
  locals:
    | { topFrame: TraceFrame['locals']; secondFrame: TraceFrame['locals'] }
    | { topFrame: undefined; secondFrame: undefined };
} {
  const traceChain = addItemStub.getCall(0).args[3].data.body
    .trace_chain as TraceChainEntry[];
  const frames = traceChain[0].frames;
  const topFrame = frames[frames.length - 1];
  const secondFrame = frames[frames.length - 2];

  return {
    message: traceChain[0].exception.message,
    hasLocals: nodeMajorVersion >= 10,
    locals:
      nodeMajorVersion >= 10
        ? {
            topFrame: topFrame?.locals,
            secondFrame: secondFrame?.locals,
          }
        : {
            topFrame: undefined,
            secondFrame: undefined,
          },
  };
}
