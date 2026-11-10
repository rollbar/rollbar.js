import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Third-party packages that must not be inlined into the built bundles.
 *
 * `@rrweb/record` 2.0.0-alpha.20 shipped a prebuilt dist with two copies of
 * postcss 8.4.38 and its `nanoid/non-secure` 3.3.7, which webpack copied into
 * every `dist/rollbar.replay*.js` (#1523). Code inlined that way never shows
 * up in `npm audit`, so this check is the only thing that would notice it
 * coming back. Each pattern is a string literal that survives minification
 * and occurs once per inlined copy.
 */
export const forbiddenPackages = [
  {
    name: 'postcss',
    pattern: /\.name\s*=\s*["']CssSyntaxError["']/g,
  },
  {
    name: 'nanoid',
    pattern:
      /useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict/g,
  },
];

/**
 * Finds inlined copies of the forbidden packages in a bundle's source.
 *
 * @param {string} source - Bundle source code.
 * @returns {{name: string, copies: number}[]} One entry per package found.
 */
export function findBundledPackages(source) {
  return forbiddenPackages
    .map(({ name, pattern }) => ({
      name,
      copies: (source.match(pattern) || []).length,
    }))
    .filter(({ copies }) => copies > 0);
}

/**
 * Checks every built `dist/*.js` bundle and exits non-zero if any of them
 * inlines a forbidden package.
 */
function main() {
  const distDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    'dist',
  );
  const bundles = fs
    .readdirSync(distDir)
    .filter((file) => file.endsWith('.js'));

  if (!bundles.some((file) => file.startsWith('rollbar.replay'))) {
    console.error(
      `No replay bundles found in ${distDir}; run the build first.`,
    );
    process.exit(1);
  }

  let failed = false;
  for (const file of bundles) {
    const source = fs.readFileSync(path.join(distDir, file), 'utf8');
    for (const { name, copies } of findBundledPackages(source)) {
      console.error(`dist/${file}: ${copies} inlined copies of ${name}`);
      failed = true;
    }
  }

  if (failed) {
    console.error(
      'Bundles must not inline third-party code that npm audit cannot see. ' +
        'See https://github.com/rollbar/rollbar.js/issues/1523.',
    );
    process.exit(1);
  }
  console.log(
    `${bundles.length} bundles checked, no inlined postcss or nanoid.`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
