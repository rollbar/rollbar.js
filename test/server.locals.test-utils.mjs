/**
 * Common test utilities for server locals tests
 */

export const nodeMajorVersion = parseInt(process.versions.node.split('.')[0]);

export async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function promiseReject() {
  const error = new Error('promise reject');
  Promise.reject(error);
  await wait(500);
}

export async function nodeThrow() {
  setTimeout(() => {
    const error = new Error('node error');
    throw error;
  }, 1);

  await wait(500);
}

export async function nodeThrowAndCatch(rollbar) {
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

export async function nodeThrowNested() {
  function nestedError(nestedMessage, _password) {
    const nestedError = new Error(nestedMessage);
    throw nestedError;
  }

  setTimeout(() => {
    const message = 'test err';
    const newMessage = `nested ${message}`;
    const password = '123456';
    const err = new Error(message);

    try {
      nestedError(newMessage, password);
    } catch (e) {
      err.nested = e;
    }

    throw err;
  }, 1);

  await wait(500);
}

export async function nodeThrowWithNestedLocals() {
  setTimeout(() => {
    const arr = [{ zero: [0, 0] }, { one: 1 }, { two: 2 }, { three: 3 }];
    const obj = { a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f' };
    const password = 'password';
    const sym = Symbol('foo');
    const error = new Error('node error');
    throw error;
  }, 1);

  await wait(500);
}

export async function nodeThrowRecursionError() {
  function recurse(curr, limit) {
    if (curr < limit) {
      recurse(curr + 1, limit);
    } else {
      throw new Error('deep stack error, limit=' + limit);
    }
  }

  setTimeout(() => recurse(0, 3), 1);
  await wait(500);
}

export function verifyRejectedPromise(addItemStub) {
  const traceChain = addItemStub.getCall(0).args[3].data.body.trace_chain;
  const frames = traceChain[0].frames;

  return {
    message: traceChain[0].exception.message,
    hasLocals: nodeMajorVersion >= 10,
    locals:
      nodeMajorVersion >= 18
        ? {
            topFrame: frames.at(-1).locals,
            secondFrame: frames.at(-2).locals,
          }
        : nodeMajorVersion >= 10
          ? {
              topFrame: frames.at(-1).locals,
              secondFrame: frames.at(-2).locals,
            }
          : {
              topFrame: undefined,
              secondFrame: undefined,
            },
  };
}
