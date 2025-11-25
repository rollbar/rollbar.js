/**
 * Promises-based setTimeout.
 *
 * Based on the Node.js `timers/promises` module.
 *
 * ```js
 * import { setTimeout } from 'util/timers.js';
 *
 * const res = await setTimeout(100, 'result');
 *
 * console.log(res);  // Prints 'result'
 * ```
 * @param [delay=1] The number of millis to wait before fulfilling the promise.
 * @param value A value with which the promise is fulfilled.
 */
export function setTimeout(delay = 1, value) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, delay, value));
}
