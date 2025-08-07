var extend = require('util')._extend;
var path = require('path');
var webpack = require('webpack');
var TerserPlugin = require('terser-webpack-plugin');

var outputPath = path.resolve(__dirname, 'dist');

// Packages that need to be transpiled to ES5
var needToTranspile = ['@rrweb', 'error-stack-parser-es'].join('|');
var excludePattern = new RegExp('node_modules/(?!(' + needToTranspile + ')/)');

var uglifyPlugin = new TerserPlugin({
  parallel: true,
});

var snippetConfig = {
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
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [excludePattern, /vendor/],
      },
    ],
  },
};

var pluginConfig = {
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

var vanillaConfigBase = {
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

var UMDConfigBase = {
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

var noConflictConfigBase = extend({}, UMDConfigBase);
noConflictConfigBase.entry = {
  'rollbar.noconflict.umd': ['./src/browser/bundles/rollbar.noconflict.js'],
};

var namedAMDConfigBase = extend({}, UMDConfigBase);
namedAMDConfigBase.entry = {
  'rollbar.named-amd': namedAMDConfigBase.entry['rollbar.umd'],
};
namedAMDConfigBase.output = extend({}, namedAMDConfigBase.output);
namedAMDConfigBase.output.library = 'rollbar';
namedAMDConfigBase.output.libraryTarget = 'amd';

var config = [snippetConfig, pluginConfig];

function optimizationConfig(minimizer) {
  return {
    minimize: minimizer ? true : false,
    minimizer: minimizer ? [minimizer] : [],
  };
}

function addVanillaToConfig(webpackConfig, filename, extraPlugins, minimizer) {
  var vanillaConfig = extend({}, vanillaConfigBase);
  vanillaConfig.name = filename;

  vanillaConfig.plugins = extraPlugins;

  vanillaConfig.optimization = optimizationConfig(minimizer);

  vanillaConfig.output = extend({ filename: filename }, vanillaConfig.output);

  webpackConfig.push(vanillaConfig);
}

function addUMDToConfig(webpackConfig, filename, extraPlugins, minimizer) {
  var UMDConfig = extend({}, UMDConfigBase);

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
  var noConflictConfig = extend({}, noConflictConfigBase);

  noConflictConfig.plugins = extraPlugins;

  noConflictConfig.optimization = optimizationConfig(minimizer);

  noConflictConfig.output = extend(
    { filename: filename },
    noConflictConfig.output,
  );

  webpackConfig.push(noConflictConfig);
}

function addNamedAMDToConfig(webpackConfig, filename, extraPlugins, minimizer) {
  var AMDConfig = extend({}, namedAMDConfigBase);

  AMDConfig.plugins = extraPlugins;

  AMDConfig.optimization = optimizationConfig(minimizer);

  AMDConfig.output = extend({ filename: filename }, AMDConfig.output);

  webpackConfig.push(AMDConfig);
}

function generateBuildConfig(name, plugins, minimizer) {
  addVanillaToConfig(config, name, plugins, minimizer);
  addUMDToConfig(config, name, plugins, minimizer);
  addNamedAMDToConfig(config, name, plugins, minimizer);
  addNoConflictToConfig(config, name, plugins, minimizer);
}

generateBuildConfig('[name].js', []);
generateBuildConfig('[name].min.js', [], uglifyPlugin);

module.exports = config;
