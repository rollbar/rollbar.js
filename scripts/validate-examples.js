#!/usr/bin/env node

/**
 * Validates all examples in the `examples` directory by installing dependencies
 * and building each example using the local `rollbar.tgz` package. Pass
 * example directory names to validate only those.
 *
 * Examples whose `engines.node` range excludes the running Node version are
 * skipped.
 */

import { access, readdir, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { findUp, npm, parallelMap, satisfiesRange } from './util.js';

const args = process.argv.slice(2);
const isParallelFlag = (a) => a === '--parallel' || a === '-p';
const dryRun = ['--dry-run', '-n'].some((f) => args.includes(f));
const jobsCount = (() => {
  const i = args.findIndex(isParallelFlag);
  const n = i < 0 ? 0 : parseInt(args[i + 1], 10) || os.cpus().length;
  return Math.max(n, 1);
})();
const exampleNames = args.filter(
  (a, i) =>
    !a.startsWith('-') && !(/^\d+$/.test(a) && isParallelFlag(args[i - 1])),
);

async function validateExample(exampleDir, dryRun = false) {
  const name = `examples/${path.basename(exampleDir)}`;

  if (dryRun) {
    console.log(`  - ${name} (dry run)`);
    return;
  }

  // The tarball keeps the same version across SDK rebuilds, and a lockfile
  // from an earlier install pins its old integrity, so npm would reinstall the
  // cached copy. Example lockfiles are gitignored, so removing them is safe.
  await rm(path.join(exampleDir, 'package-lock.json'), { force: true });
  await rm(path.join(exampleDir, 'node_modules', 'rollbar'), {
    recursive: true,
    force: true,
  });

  await npm(['install'], { cwd: exampleDir, id: name });
  await npm(['run', 'build'], { cwd: exampleDir, id: name });
  console.log(`  ✓ ${name}`);
}

async function validateExamples() {
  console.log('Validating examples using the local rollbar package...');
  if (jobsCount > 1) {
    console.log(`Running with ${jobsCount} parallel jobs`);
  }
  console.log();

  const cwd = path.dirname(fileURLToPath(import.meta.url));
  const root = await findUp({ fileName: 'package.json', dir: cwd });
  const examplesDir = path.join(root, 'examples');

  try {
    await access(path.join(examplesDir, 'rollbar.tgz'));
  } catch {
    throw new Error(
      `No rollbar.tgz found in ${path.relative(root, examplesDir)}. ` +
        `Please build rollbar first.`,
    );
  }

  const entries = await readdir(examplesDir, { withFileTypes: true });
  const subdirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(examplesDir, entry.name));

  let exampleDirs = [];
  const skipped = [];
  for (const subdir of subdirs) {
    let pkg;

    try {
      pkg = await readFile(path.join(subdir, 'package.json'), 'utf8');
    } catch {
      continue;
    }

    const { dependencies, engines } = JSON.parse(pkg);
    if (dependencies?.rollbar !== 'file:../rollbar.tgz') {
      continue;
    }

    // Skip examples whose toolchain cannot run on this Node version, eg.
    // the Angular example on the older Node versions in the CI matrix.
    if (engines?.node && !satisfiesRange(process.versions.node, engines.node)) {
      skipped.push({ name: path.basename(subdir), range: engines.node });
      continue;
    }

    exampleDirs.push(subdir);
  }

  if (exampleDirs.length === 0 && skipped.length === 0) {
    throw new Error('No examples found using the local rollbar package.');
  }

  if (exampleNames.length > 0) {
    const available = exampleDirs.map((dir) => path.basename(dir));
    const unknown = exampleNames.filter(
      (n) => !available.includes(n) && !skipped.some((s) => s.name === n),
    );
    if (unknown.length > 0) {
      throw new Error(
        `No example using the local rollbar package named: ` +
          `${unknown.join(', ')}. Available: ${available.join(', ')}`,
      );
    }
    exampleDirs = exampleDirs.filter((dir) =>
      exampleNames.includes(path.basename(dir)),
    );
  }

  for (const { name, range } of skipped) {
    if (exampleNames.length === 0 || exampleNames.includes(name)) {
      console.log(
        `  - examples/${name} skipped ` +
          `(requires Node ${range}, running ${process.versions.node})`,
      );
    }
  }

  await parallelMap(
    exampleDirs,
    async (dir) => validateExample(dir, dryRun),
    jobsCount,
  );

  console.log('Validation succeeded');
}

validateExamples().catch((err) => {
  console.error('Error validating examples:', err);
  console.error(
    '\nUsage: validate-examples [--dry-run|-n] [--parallel|-p <n>] [example...]',
  );
  console.error('  --parallel | -p <n>: run <n> jobs in parallel');
  console.error('                   if no <n> is given, defaults to cpu cores');
  console.error('  --dry-run | -n: do not run commands, just print');
  console.error('  example: directory name under examples/ (default: all)');
  console.error('\nExamples:');
  console.error('  validate-examples --parallel 4');
  console.error('  validate-examples --dry-run');
  console.error('  validate-examples -n -p');
  console.error('  validate-examples -p react-16 webpack');
  process.exit(1);
});
