import { access } from 'node:fs/promises';
import { once } from 'node:events';
import { spawn } from 'node:child_process';
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

/**
 * Runs an npm command in a given directory, capturing output.
 *
 * @param {string[]} args - Arguments to pass to npm (e.g., `['install']`, `['run', 'build']`).
 * @param {Object} options - Options for the npm command.
 * @param {string} [options.cwd=process.cwd()] - Optional directory to run the command in. Defaults to `process.cwd()`.
 * @param {string} [options.id] - Optional identifier for error reporting.
 * @returns {Promise<string>} Resolves with stdout if successful.
 * @throws {Error} If the npm process fails; error includes stderr or stdout.
 * @example
 * // Install dependencies in the current directory:
 * await npm(['install']);
 *
 * // Run a custom npm script in a specific directory:
 * await npm(['run', 'build'], { cwd: '/path/to/project' });
 */
export async function npm(args, { cwd = process.cwd(), id = '' }) {
  const child = spawn('npm', args, {
    cwd,
    shell: true,
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  const std = { out: '', err: '' };
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stdout.on('data', (chunk) => (std.out += chunk));
  child.stderr.on('data', (chunk) => (std.err += chunk));

  const [code, signal] = await once(child, 'close');

  if (code !== 0 || signal) {
    const msg = std.err.trim() || std.out.trim();
    throw new Error(
      `npm ` +
        `${args.join(' ')} ` +
        `${signal ? `terminated by ${signal}` : `exited with ${code}`}` +
        `${id ? ` (${id})` : ''}` +
        `${msg ? `:\n${msg}` : ''}`,
    );
  }

  return std.out;
}
