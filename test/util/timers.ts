/**
 * Promises-based setTimeout.
 *
 * Based on the Node.js `timers/promises` module.
 *
 * ```ts
 * import { setTimeoutAsync } from './util/timers.ts';
 *
 * const res = await setTimeoutAsync(100, 'result');
 *
 * console.log(res); // Prints 'result'
 * ```
 * @param [delay=1] The number of millis to wait before fulfilling the promise.
 * @param [value] Optional. A value of generic type `T` with which the promise is fulfilled.
 */
export function setTimeoutAsync<T = undefined>(
  delay = 1,
  value?: T,
): Promise<T> {
  return new Promise((resolve) => globalThis.setTimeout(resolve, delay, value));
}
