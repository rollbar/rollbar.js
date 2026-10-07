import { spawn } from 'node:child_process';
import { once } from 'node:events';
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
    shell: false,
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  const std = { out: '', err: '' };
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stdout.on('data', (chunk) => (std.out += chunk));
  child.stderr.on('data', (chunk) => (std.err += chunk));

  const [code, signal] = await once(child, 'close');

  if (code !== 0 || signal) {
    const stderr = std.err.trim();
    const stdout = std.out.trim();
    const msg = `\nSTDERR:\n${stderr}\nSTDOUT:\n${stdout}`;
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

/**
 * Transforms each element in a given array in parallel with a specified
 * concurrency limit, preserving the original order.
 *
 * @param {Array} xs - Array of items to transform.
 * @param {Function} f - Async transform for each item.
 * @param {number} c - Maximum number of concurrent transforms.
 * @returns {Promise<Array>} The transformed array.
 * @example
 * const results = await parallelMap(files, async (file) => {
 *   return await processFile(file);
 * }, 4);
 */
export async function parallelMap(xs, f, c) {
  if (c <= 0) {
    throw new Error('Concurrency limit must be greater than 0');
  }

  const ys = new Array(xs.length);
  const jobs = new Set();

  for (const [i, x] of xs.entries()) {
    const p = Promise.resolve()
      .then(() => f(x, i))
      .then((y) => (ys[i] = y));

    p.finally(() => jobs.delete(p));
    jobs.add(p);

    if (jobs.size >= c) {
      await Promise.race(jobs);
    }
  }

  await Promise.all(jobs);
  return ys;
}

/**
 * Checks whether a version satisfies a node-semver style range, such as a
 * package's `engines.node` field.
 *
 * Supports `||` alternatives, space-separated comparators, the `^`, `~`, `>=`,
 * `>`, `<=`, `<` and `=` operators, and partial versions (`>=18`, `^22.12`).
 * Prerelease tags are not supported.
 *
 * @param {string} version - The version to check, eg. `process.versions.node`.
 * @param {string} range - The range to check against.
 * @returns {boolean} Whether `version` satisfies `range`.
 * @throws {Error} If `range` uses syntax that is not supported.
 * @example
 * satisfiesRange('22.23.3', '^22.22.3 || ^24.15.0 || >=26.0.0'); // true
 * satisfiesRange('20.19.2', '>=18'); // true
 */
export function satisfiesRange(version, range) {
  const v = version.replace(/^v/, '').split('.').map(Number);

  return range.split('||').some((set) =>
    set
      .trim()
      .split(/\s+/)
      .every((comparator) => {
        if (comparator === '' || comparator === '*') {
          return true;
        }

        const match = /^(\^|~|>=|<=|>|<|=)?v?(\d+(?:\.\d+){0,2})$/.exec(
          comparator,
        );
        if (!match) {
          throw new Error(`Unsupported version range: ${range}`);
        }

        const [, op = '=', target] = match;
        const t = target.split('.').map(Number);
        // Compare only the parts the comparator specifies, so `>=18` matches
        // any 18.x and `<=18` excludes 19.0.0, as in node-semver.
        let cmp = 0;
        for (let i = 0; i < t.length && cmp === 0; i++) {
          cmp = Math.sign((v[i] ?? 0) - t[i]);
        }

        switch (op) {
          case '>=':
            return cmp >= 0;
          case '>':
            return cmp > 0;
          case '<=':
            return cmp <= 0;
          case '<':
            return cmp < 0;
          case '^':
            return cmp >= 0 && v[0] === t[0];
          case '~':
            return cmp >= 0 && v[0] === t[0] && (t.length < 2 || v[1] === t[1]);
          default:
            return cmp === 0;
        }
      }),
  );
}
