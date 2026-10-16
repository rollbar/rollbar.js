/**
 * Replaces `obj[name]` with `replacement(obj[name])`, optionally recording the
 * original so it can be restored later.
 *
 * Some pages (or older browsers) expose properties we instrument as read-only,
 * e.g. a non-writable `XMLHttpRequest.prototype.open` or a frozen object. In
 * strict mode assigning to those throws, and since instrumentation runs inside
 * the Rollbar constructor that would break the host page. Instead the property
 * is left untouched and nothing is recorded.
 *
 * @param {Object} obj - The object that owns (or inherits) the property.
 * @param {string} name - The property to replace.
 * @param {Function} replacement - Receives the original value, returns the new one.
 * @param {Object} [replacements] - Map of type to `[obj, name, orig]` restore entries.
 * @param {string} [type] - Key in `replacements` to record the original under.
 * @returns {boolean} Whether the property was replaced.
 */
function replace(obj, name, replacement, replacements, type) {
  var orig = obj[name];
  var wrapped = replacement(orig);
  try {
    obj[name] = wrapped;
  } catch (_e) {
    return false;
  }
  if (replacements) {
    replacements[type].push([obj, name, orig]);
  }
  return true;
}

export default replace;
