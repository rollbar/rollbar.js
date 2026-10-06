import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect } from 'chai';
import ts from 'typescript';
import webpack from 'webpack';

import webpackConfig from '../webpack.config.js';

/*
 * Regression coverage for https://github.com/rollbar/rollbar.js/issues/1089:
 * `TypeError: rollbar_1.default is not a constructor`.
 *
 * `index.d.ts` declares `export default Rollbar`, so TypeScript accepts
 * `import Rollbar from 'rollbar'` in a CommonJS project. With `esModuleInterop`
 * off (TypeScript's default for `"module": "commonjs"`) that compiles to
 * `new (require('rollbar').default)(...)`. Node resolves `require('rollbar')` to
 * `dist/rollbar.cjs` and browser-condition resolvers (bundlers, Jest's jsdom
 * environment) resolve it to `dist/rollbar.umd.min.js`; both exported the
 * constructor as `module.exports` with no `default` property.
 *
 * These tests build those artifacts from source, compile consumer code with the
 * TypeScript compiler, and run it against the built bundles.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const cacheDir = path.join(repoRoot, 'node_modules', '.cache');

function isServerCJSConfig(config) {
  return (
    config.output.libraryTarget === 'commonjs2' && !config.optimization.minimize
  );
}

function isUMDConfig(config) {
  return (
    config.output.libraryTarget === 'umd' &&
    !config.optimization.minimize &&
    Boolean(config.entry['rollbar.umd'])
  );
}

function build(configs) {
  return new Promise((resolve, reject) => {
    webpack(configs, (err, stats) => {
      if (err) {
        reject(err);
      } else if (stats.hasErrors()) {
        reject(new Error(stats.toString('errors-only')));
      } else {
        resolve();
      }
    });
  });
}

/**
 * Compiles `source` the way `tsc` would for a CommonJS project and runs it,
 * resolving `require('rollbar')` to the given bundle.
 *
 * @param {string} source - TypeScript consumer code.
 * @param {object} bundle - The bundle's `module.exports`.
 * @param {object} compilerOptions - Extra TypeScript compiler options.
 * @returns {object} The compiled module's `module.exports`.
 */
function runCompiledConsumer(source, bundle, compilerOptions = {}) {
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2018,
      ...compilerOptions,
    },
  });
  const consumerRequire = (id) => {
    if (id !== 'rollbar') {
      throw new Error(`unexpected require: ${id}`);
    }
    return bundle;
  };
  const module = { exports: {} };
  new Function('require', 'module', 'exports', outputText)(
    consumerRequire,
    module,
    module.exports,
  );
  return module.exports;
}

const defaultImportSource = `
import Rollbar from 'rollbar';
export const rollbar = new Rollbar({ accessToken: 'abc123', enabled: false });
`;

const requireSource = `
const Rollbar = require('rollbar');
export const rollbar = new Rollbar({ accessToken: 'abc123', enabled: false });
`;

describe('CommonJS default export interop (#1089)', function () {
  let outDir;
  let serverBundle;
  let umdBundle;

  this.timeout(60000);

  before(async function () {
    fs.mkdirSync(cacheDir, { recursive: true });
    // Inside the repo so the server bundle's externals resolve from node_modules.
    outDir = fs.mkdtempSync(path.join(cacheDir, 'rollbar-cjs-interop-'));

    const configs = webpackConfig
      .filter((config) => isServerCJSConfig(config) || isUMDConfig(config))
      .map((config) => ({
        ...config,
        devtool: false,
        output: { ...config.output, path: outDir },
      }));
    expect(configs).to.have.lengthOf(2);
    await build(configs);

    const requireFromOutDir = createRequire(path.join(outDir, 'index.js'));
    serverBundle = requireFromOutDir('./rollbar.cjs');
    umdBundle = requireFromOutDir('./rollbar.umd.js');
  });

  after(function () {
    if (outDir) {
      fs.rmSync(outDir, { recursive: true, force: true });
    }
  });

  [
    ['server CommonJS bundle (dist/rollbar.cjs)', () => serverBundle],
    ['browser UMD bundle (dist/rollbar.umd.js)', () => umdBundle],
  ].forEach(([name, getBundle]) => {
    describe(name, function () {
      it('constructs Rollbar from a TS default import without esModuleInterop', function () {
        const bundle = getBundle();
        const { rollbar } = runCompiledConsumer(defaultImportSource, bundle, {
          esModuleInterop: false,
        });
        expect(rollbar).to.be.an.instanceof(bundle);
      });

      it('constructs Rollbar from a TS default import with esModuleInterop', function () {
        const bundle = getBundle();
        const { rollbar } = runCompiledConsumer(defaultImportSource, bundle, {
          esModuleInterop: true,
        });
        expect(rollbar).to.be.an.instanceof(bundle);
      });

      it('still exports the constructor itself for require()', function () {
        const bundle = getBundle();
        expect(bundle).to.be.a('function');
        const { rollbar } = runCompiledConsumer(requireSource, bundle);
        expect(rollbar).to.be.an.instanceof(bundle);
      });

      it('exposes default as a non-enumerable self-reference', function () {
        const bundle = getBundle();
        expect(bundle.default).to.equal(bundle);
        expect(Object.keys(bundle)).to.not.include('default');
        // Interop helpers must keep treating the bundle as plain CommonJS.
        expect(bundle.__esModule).to.equal(undefined);
      });
    });
  });
});
