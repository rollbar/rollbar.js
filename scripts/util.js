import { access } from 'node:fs/promises';
import path from 'node:path';

/**
 * Walks up parent directories from the given start directory until it finds the specified file.
 *
 * @param {Object} options - The options object.
 * @param {string} options.fileName - Name of the file to search for, eg. 'package.json'.
 * @param {string} [options.dir=process.cwd()] - Directory to start from. Defaults to `process.cwd()`.
 * @returns {Promise<string>} The directory containing the file.
 * @throws {Error} If no such file is found in any ancestor.
 */
export async function findUp({ fileName, dir = process.cwd() }) {
  const origin = dir;
  let current = dir;

  while (true) {
    try {
      await access(path.join(current, fileName));
      return current;
    } catch {
      const parent = path.dirname(current);
      if (parent === current) break;
      current = parent;
    }
  }

  throw new Error(`No ${fileName} found in or above ${origin}`);
}
