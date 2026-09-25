import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect } from 'chai';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

/**
 * Run `tsc` against a throwaway consumer that imports `rollbar` the way
 * downstream projects do, with skipLibCheck disabled so errors in the
 * published index.d.ts are visible.
 *
 * @returns {import('node:child_process').SpawnSyncReturns<string>}
 */
function typecheckPublishedTypes() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rollbar-types-'));
  const pkgDir = path.join(tmp, 'node_modules', 'rollbar');

  fs.mkdirSync(pkgDir, { recursive: true });
  fs.writeFileSync(
    path.join(tmp, 'package.json'),
    JSON.stringify({ type: 'module' }),
  );
  fs.writeFileSync(
    path.join(pkgDir, 'package.json'),
    JSON.stringify({ name: 'rollbar', types: './index.d.ts' }),
  );
  fs.symlinkSync(
    path.join(repoRoot, 'index.d.ts'),
    path.join(pkgDir, 'index.d.ts'),
  );
  fs.writeFileSync(
    path.join(tmp, 'main.ts'),
    [
      "import Rollbar from 'rollbar';",
      "const rollbar = new Rollbar({ accessToken: 'x' });",
      "rollbar.error('test');",
      '',
    ].join('\n'),
  );

  try {
    return spawnSync(
      process.execPath,
      [
        path.join(repoRoot, 'node_modules', 'typescript', 'bin', 'tsc'),
        '--strict',
        '--skipLibCheck',
        'false',
        '--noEmit',
        '--target',
        'es2022',
        '--lib',
        'es2022,dom',
        '--module',
        'nodenext',
        '--moduleResolution',
        'nodenext',
        '--pretty',
        'false',
        'main.ts',
      ],
      { cwd: tmp, encoding: 'utf8' },
    );
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

describe('published types', function () {
  it('type-checks with skipLibCheck: false', function () {
    this.timeout(30000);

    const result = typecheckPublishedTypes();
    const output = `${result.stdout}${result.stderr}`;

    expect(result.error, output).to.equal(undefined);
    expect(output, output).to.not.match(/error TS2304/);
    expect(result.status, output).to.equal(0);
  });
});
