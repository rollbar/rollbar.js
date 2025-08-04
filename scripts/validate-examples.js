#!/usr/bin/env node

/**
 * Validates all examples in the `examples` directory by installing dependencies
 * and building each example using the local `rollbar.tgz` package.
 */

import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

import { findUp, npm, parallelMap } from './util.js';

const dryRun = ['--dry-run', '-n'].some((f) => process.argv.includes(f));
const jobsCount = (() => {
  const i = process.argv.findIndex((a) => a === '--parallel' || a === '-p');
  const n = i < 0 ? 0 : parseInt(process.argv[i + 1], 10) || os.cpus().length;
  return Math.max(n, 1);
})();

async function validateExample(exampleDir, dryRun = false) {
  const name = `examples/${path.basename(exampleDir)}`;

  if (dryRun) {
    console.log(`  - ${name} (dry run)`);
    return;
  }

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
  for (const subdir of subdirs) {
    let pkg;

    try {
      pkg = await readFile(path.join(subdir, 'package.json'), 'utf8');
    } catch {
      continue;
    }

    const { dependencies } = JSON.parse(pkg);
    if (dependencies?.rollbar === 'file:../rollbar.tgz') {
      exampleDirs.push(subdir);
    }
  }

  if (exampleDirs.length === 0) {
    throw new Error('No examples found using the local rollbar package.');
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
    '\nUsage: validate-examples [--dry-run|-n] [--parallel|-p <n>]',
  );
  console.error('  --parallel | -p <n>: run <n> jobs in parallel');
  console.error('                   if no <n> is given, defaults to cpu cores');
  console.error('  --dry-run | -n: do not run commands, just print');
  console.error('\nExamples:');
  console.error('  validate-examples --parallel 4');
  console.error('  validate-examples --dry-run');
  console.error('  validate-examples -n -p');
  process.exit(1);
});
