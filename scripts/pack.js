#!/usr/bin/env node

/**
 * Pack the root package, then move the resulting .tgz file into the project’s
 * `examples` directory as `rollbar.tgz`.
 *
 * This assumes all examples point to `rollbar.tgz` in the `examples` directory
 * for their rollbar package.
 */

import { rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { findUp, npm } from './util.js';

async function pack() {
  const cwd = path.dirname(fileURLToPath(import.meta.url));
  const root = await findUp({ fileName: 'package.json', dir: cwd });

  const tgz = await npm(['pack'], { cwd: root }).then((stdout) =>
    stdout.trim().split('\n').pop(),
  );
  const src = path.join(root, tgz);
  const dest = path.join(root, 'examples', 'rollbar.tgz');

  await rename(src, dest);

  console.log(`Packaged Rollbar into ${path.relative(root, dest)}`);
}

pack().catch((err) => {
  console.error('Error packing Rollbar JS:', err);
  process.exit(1);
});
