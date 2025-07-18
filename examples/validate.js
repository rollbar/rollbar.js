#!/usr/bin/env node

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, basename } from 'path';

const cwd = dirname(fileURLToPath(import.meta.url));
const spawnOptions = { stdio: 'inherit', shell: true };

const filterMap = async (xs, fn) =>
  (await Promise.all(xs.map(fn))).filter(Boolean);

const dirsIn = async (path) =>
  await filterMap(
    await readdir(path, { withFileTypes: true }),
    async (entry) => entry.isDirectory() && join(cwd, entry.name),
  );

const contentsOf = async (f) => await readFile(f, 'utf8').catch(() => null);

const npm = async (args, dir, id) =>
  new Promise((resolve, reject) =>
    spawn('npm', args, { cwd: dir, ...spawnOptions }).on('close', (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`npm ${args.join(' ')} failed for ${id} (${code})`)),
    ),
  );

async function main() {
  console.log('Validating examples using the local rollbar package...');
  const pat = /"rollbar"\s*:\s*"file:\.\.\/\.\."/; // "rollbar": "file:../.."
  const examples = await filterMap(
    await dirsIn(cwd),
    async (dir) =>
      (await contentsOf(join(dir, 'package.json')))?.match(pat) && dir,
  );

  if (examples.length === 0) {
    throw new Error('No examples found using the local rollbar package.');
  }

  for (const example of examples) {
    const name = `examples/${basename(example)}`;
    console.log(`\n====== Validating ${name} ======`);
    await npm(['install'], example, name);
    await npm(['run', 'build'], example, name);
  }

  console.log('\n====== Validation succeeded with aplomb ======');
}

main().catch((err) => {
  console.error('\n====== Validation failed catastrophically ======');
  console.error(err);
  process.exit(1);
});
