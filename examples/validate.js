#!/usr/bin/env node

import { readdir, readFile } from 'fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const compactMap = (xs, f) =>
  Promise.all(xs.map(f)).then((ys) => ys.filter((y) => y != null));

const dirsIn = async (path) =>
  await compactMap(
    await readdir(path, { withFileTypes: true }),
    (entry) => entry.isDirectory() && join(path, entry.name),
  );

const contentsOf = async (p) => await readFile(p, 'utf8').catch(() => null);

async function npm(args, cwd, id) {
  const child = spawn('npm', args, { cwd, stdio: 'inherit', shell: true });
  const [code] = await once(child, 'close');
  if (code !== 0) {
    throw new Error(`npm ${args.join(' ')} failed in ${id}`);
  }
}

async function main() {
  console.log('Validating examples using the local rollbar package...');
  const cwd = dirname(fileURLToPath(import.meta.url));
  const pat = /"rollbar"\s*:\s*"file:\.\.\/\.\."/; // "rollbar": "file:../.."
  const examples = await compactMap(
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
