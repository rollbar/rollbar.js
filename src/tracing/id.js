/**
 * Generate a random hexadecimal ID of specified byte length
 *
 * @param {number} bytes - Number of bytes for the ID (default: 16)
 * @returns {string} - Hexadecimal string representation
 */
function gen(bytes = 16) {
  let randomBytes = new Uint8Array(bytes);
  crypto.getRandomValues(randomBytes);
  let randHex = Array.from(randomBytes, (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
  return randHex;
}

/**
 * Tracing id generation utils
 *
 * @example
 * import id from './id.js';
 *
 * const spanId = id.gen(8); // => "a1b2c3d4e5f6..."
 */
export default { gen };
