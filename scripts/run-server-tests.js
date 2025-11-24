import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Dedicated runner to keep the npm script readable while wiring ts-node + Mocha.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const loaderPath = path.join(repoRoot, 'node_modules', 'ts-node', 'esm.mjs');
const mochaBin = path.join(
  repoRoot,
  'node_modules',
  'mocha',
  'bin',
  'mocha.js',
);

const nodeArgs = [
  '--loader',
  loaderPath,
  mochaBin,
  '--extension',
  'js',
  '--extension',
  'ts',
  'test/server.*.test.{js,ts}',
  '--reporter',
  'spec',
  // Allow extra CLI args to pass through (e.g., --grep).
  ...process.argv.slice(2),
];

const env = {
  ...process.env,
  TS_NODE_PROJECT: path.join(repoRoot, 'tsconfig.test.json'),
  TS_NODE_TRANSPILE_ONLY: '1',
};

const child = spawn(process.execPath, nodeArgs, {
  stdio: 'inherit',
  env,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});

child.on('error', (err) => {
  console.error(err);
  process.exit(1);
});
