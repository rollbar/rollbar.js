const extend = require('util')._extend;
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');

const outputPath = path.resolve(__dirname, 'dist');

// Packages that need to be transpiled to ES5
const needToTranspile = ['@rrweb', 'error-stack-parser-es'].join('|');
const excludePattern = new RegExp(
  'node_modules/(?!(' + needToTranspile + ')/)',
);

const uglifyPlugin = new TerserPlugin({
  parallel: true,
});

const snippetConfig = {
  name: 'snippet',
  entry: {
    'rollbar.snippet': './src/browser/bundles/rollbar.snippet.js',
  },
  output: {
    path: outputPath,
    filename: '[name].js',
  },
  target: ['web', 'es5'],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        loader: 'babel-loader',
        exclude: [excludePattern, /vendor/],
      },
    ],
  },
};

const pluginConfig = {
  name: 'plugins',
  entry: {
    jquery: './src/browser/plugins/jquery.js',
  },
  output: {
    path: outputPath + '/plugins/',
    filename: '[name].min.js',
  },
  target: ['web', 'es5'],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        loader: 'babel-loader',
        exclude: [excludePattern, /vendor/],
      },
    ],
  },
};

const vanillaConfigBase = {
  entry: {
    rollbar: './src/browser/bundles/rollbar.js',
  },
  output: {
    path: outputPath,
  },
  target: ['web', 'es5'],
  devtool: 'hidden-source-map',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        loader: 'babel-loader',
        exclude: [excludePattern, /vendor/],
      },
    ],
  },
};

const UMDConfigBase = {
  entry: {
    'rollbar.umd': ['./src/browser/bundles/rollbar.js'],
  },
  output: {
    path: outputPath,
    library: 'rollbar',
    libraryTarget: 'umd',
    libraryExport: 'default',
    globalObject: 'this',
  },
  target: ['web', 'es5'],
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        loader: 'babel-loader',
        exclude: [excludePattern, /vendor/],
      },
    ],
  },
};

const serverCJSConfigBase = {
  entry: {
    rollbar: './src/server/rollbar.js',
  },
  output: {
    path: outputPath,
    libraryTarget: 'commonjs2',
    libraryExport: 'default',
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        loader: 'babel-loader',
        exclude: [excludePattern, /vendor/],
      },
    ],
  },
};

const noConflictConfigBase = extend({}, UMDConfigBase);
noConflictConfigBase.entry = {
  'rollbar.noconflict.umd': ['./src/browser/bundles/rollbar.noconflict.js'],
};

const namedAMDConfigBase = extend({}, UMDConfigBase);
namedAMDConfigBase.entry = {
  'rollbar.named-amd': namedAMDConfigBase.entry['rollbar.umd'],
};
namedAMDConfigBase.output = extend({}, namedAMDConfigBase.output);
namedAMDConfigBase.output.library = 'rollbar';
namedAMDConfigBase.output.libraryTarget = 'amd';

const vanillaReplayConfigBase = extend({}, vanillaConfigBase);
vanillaReplayConfigBase.entry = {
  'rollbar.replay': './src/browser/bundles/rollbarReplay.js',
};

const UMDReplayConfigBase = extend({}, UMDConfigBase);
UMDReplayConfigBase.entry = {
  'rollbar.replay.umd': ['./src/browser/bundles/rollbarReplay.js'],
};

const noConflictReplayConfigBase = extend({}, UMDConfigBase);
noConflictReplayConfigBase.entry = {
  'rollbar.replay.noconflict.umd': [
    './src/browser/bundles/rollbarReplay.noconflict.js',
  ],
};

const config = [snippetConfig, pluginConfig];

function optimizationConfig(minimizer) {
  return {
    minimize: minimizer ? true : false,
    minimizer: minimizer ? [minimizer] : [],
  };
}

function addVanillaToConfig(webpackConfig, filename, extraPlugins, minimizer) {
  const vanillaConfig = extend({}, vanillaConfigBase);
  vanillaConfig.name = filename;

  vanillaConfig.plugins = extraPlugins;

  vanillaConfig.optimization = optimizationConfig(minimizer);

  vanillaConfig.output = extend({ filename: filename }, vanillaConfig.output);

  webpackConfig.push(vanillaConfig);
}

function addUMDToConfig(webpackConfig, filename, extraPlugins, minimizer) {
  const UMDConfig = extend({}, UMDConfigBase);

  UMDConfig.plugins = extraPlugins;

  UMDConfig.optimization = optimizationConfig(minimizer);

  UMDConfig.output = extend({ filename: filename }, UMDConfig.output);

  webpackConfig.push(UMDConfig);
}

function addNoConflictToConfig(
  webpackConfig,
  filename,
  extraPlugins,
  minimizer,
) {
  const noConflictConfig = extend({}, noConflictConfigBase);

  noConflictConfig.plugins = extraPlugins;

  noConflictConfig.optimization = optimizationConfig(minimizer);

  noConflictConfig.output = extend(
    { filename: filename },
    noConflictConfig.output,
  );

  webpackConfig.push(noConflictConfig);
}

function addNamedAMDToConfig(webpackConfig, filename, extraPlugins, minimizer) {
  const AMDConfig = extend({}, namedAMDConfigBase);

  AMDConfig.plugins = extraPlugins;

  AMDConfig.optimization = optimizationConfig(minimizer);

  AMDConfig.output = extend({ filename: filename }, AMDConfig.output);

  webpackConfig.push(AMDConfig);
}

function addServerCJSConfigBase(webpackConfig, filename, minimizer) {
  const serverConfig = extend({}, serverCJSConfigBase);
  serverConfig.optimization = optimizationConfig(minimizer);
  serverConfig.output = extend({ filename }, serverCJSConfigBase.output);
  webpackConfig.push(serverConfig);
}

function addVanillaReplayToConfig(
  webpackConfig,
  filename,
  extraPlugins,
  minimizer,
) {
  const replayConfig = extend({}, vanillaReplayConfigBase);
  replayConfig.name = filename;
  replayConfig.plugins = extraPlugins;
  replayConfig.optimization = optimizationConfig(minimizer);
  replayConfig.output = extend({ filename: filename }, replayConfig.output);
  webpackConfig.push(replayConfig);
}

function addUMDReplayToConfig(
  webpackConfig,
  filename,
  extraPlugins,
  minimizer,
) {
  const replayConfig = extend({}, UMDReplayConfigBase);
  replayConfig.plugins = extraPlugins;
  replayConfig.optimization = optimizationConfig(minimizer);
  replayConfig.output = extend({ filename: filename }, replayConfig.output);
  webpackConfig.push(replayConfig);
}

function addNoConflictReplayToConfig(
  webpackConfig,
  filename,
  extraPlugins,
  minimizer,
) {
  const replayConfig = extend({}, noConflictReplayConfigBase);
  replayConfig.plugins = extraPlugins;
  replayConfig.optimization = optimizationConfig(minimizer);
  replayConfig.output = extend({ filename: filename }, replayConfig.output);
  webpackConfig.push(replayConfig);
}

function generateBuildConfig(name, plugins, minimizer) {
  addVanillaToConfig(config, name, plugins, minimizer);
  addUMDToConfig(config, name, plugins, minimizer);
  addNamedAMDToConfig(config, name, plugins, minimizer);
  addNoConflictToConfig(config, name, plugins, minimizer);
  addServerCJSConfigBase(config, name.replace('.js', '.cjs'), minimizer);
}

function generateReplayBuildConfig(name, plugins, minimizer) {
  addVanillaReplayToConfig(config, name, plugins, minimizer);
  addUMDReplayToConfig(config, name, plugins, minimizer);
  addNoConflictReplayToConfig(config, name, plugins, minimizer);
}

generateBuildConfig('[name].js', []);
generateBuildConfig('[name].min.js', [], uglifyPlugin);

generateReplayBuildConfig('[name].js', []);
generateReplayBuildConfig('[name].min.js', [], uglifyPlugin);

module.exports = config;
