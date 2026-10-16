/**
 * Node ESM loader for running the React Native tests under Mocha.
 *
 * `src/react-native/transport.js` imports `buffer/`, the npm `buffer` polyfill
 * that React Native apps provide themselves; rollbar.js does not depend on it.
 * Under Node the built-in `Buffer` has the same API, so resolve to that.
 *
 * @param {string} specifier - the import specifier being resolved
 * @param {object} context - resolution context from Node
 * @param {Function} nextResolve - the next resolver in the chain
 * @returns {Promise<object>} the resolution result
 */
export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'buffer/') {
    return { url: 'node:buffer', shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
