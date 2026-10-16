import { hasOwn } from '../utility.js';

/**
 * Adds a non-enumerable `default` property that points back at `value`.
 *
 * The CommonJS and UMD bundles export the Rollbar constructor itself as
 * `module.exports`, which is what `require('rollbar')` expects. TypeScript with
 * `esModuleInterop` off (its default for `"module": "commonjs"`) compiles
 * `import Rollbar from 'rollbar'` to `require('rollbar').default` instead, and
 * `index.d.ts` declares a default export, so that form type-checks and then
 * throws `rollbar_1.default is not a constructor` at runtime. Exposing both
 * shapes lets either form construct Rollbar.
 *
 * See https://github.com/rollbar/rollbar.js/issues/1089.
 *
 * @param {Function} value - The value a bundle exports as `module.exports`.
 * @returns {Function} The same value, for use in an `export default` statement.
 */
function withCommonJSDefault(value) {
  if (!hasOwn(value, 'default')) {
    Object.defineProperty(value, 'default', {
      value: value,
      configurable: true,
      writable: true,
    });
  }
  return value;
}

export default withCommonJSDefault;
