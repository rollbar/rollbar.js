var extend = require('util')._extend;
var path = require('path');
var webpack = require('webpack');
var defaults = require('./defaults');
var TerserPlugin = require('terser-webpack-plugin');

var outputPath = path.resolve(__dirname, 'dist');

var defaultsPlugin = new webpack.DefinePlugin(defaults);
var uglifyPlugin = new TerserPlugin({
  sourceMap: true,
  parallel: true
});

var snippetConfig = {
  name: 'snippet',
  entry: {
    'rollbar.snippet': './src/browser/bundles/rollbar.snippet.js'
  },
  output: {
    path: outputPath,
    filename: '[name].js'
  },
  plugins: [defaultsPlugin],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: [/node_modules/, /vendor/],
        options: {
          failOnError: true,
          configFile: path.resolve(__dirname, '.eslintrc')
        }
      },
      {
        test: /\.js$/,
        loader: 'strict-loader',
        exclude: [/node_modules/, /vendor/]
      }
    ],
  }
};

var pluginConfig = {
  name: 'plugins',
  entry: {
    'jquery': './src/browser/plugins/jquery.js'
  },
  output: {
    path: outputPath + '/plugins/',
    filename: '[name].min.js'
  },
  plugins: [defaultsPlugin],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: [/node_modules/, /vendor/],
        options: {
          failOnError: true,
          configFile: path.resolve(__dirname, '.eslintrc')
        }
      },
      {
        test: /\.js$/,
        loader: 'strict-loader',
        exclude: [/node_modules/, /vendor/]
      }
    ],
  }
};

var vanillaConfigBase = {
  entry: {
    'rollbar': './src/browser/bundles/rollbar.js'
  },
  output: {
    path: outputPath
  },
  plugins: [defaultsPlugin],
  devtool: 'hidden-source-map',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: [/node_modules/, /vendor/],
        options: {
          failOnError: true,
          configFile: path.resolve(__dirname, '.eslintrc')
        }
      },
      {
        test: /\.js$/,
        loader: 'strict-loader',
        exclude: [/node_modules/, /vendor/]
      }
    ],
  }
};

var UMDConfigBase = {
  entry: {
    'rollbar.umd': ['./src/browser/bundles/rollbar.js']
  },
  output: {
    path: outputPath,
    library: 'rollbar',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: [/node_modules/, /vendor/],
        options: {
          failOnError: true,
          configFile: path.resolve(__dirname, '.eslintrc')
        }
      },
      {
        test: /\.js$/,
        loader: 'strict-loader',
        exclude: [/node_modules/, /vendor/]
      }
    ],
  }
};

var noConflictConfigBase = extend({}, UMDConfigBase);
noConflictConfigBase.entry = {
  'rollbar.noconflict.umd': ['./src/browser/bundles/rollbar.noconflict.js']
};

var namedAMDConfigBase = extend({}, UMDConfigBase);
namedAMDConfigBase.entry = {
  'rollbar.named-amd': namedAMDConfigBase.entry['rollbar.umd']
};
namedAMDConfigBase.output = extend({}, namedAMDConfigBase.output);
namedAMDConfigBase.output.library = 'rollbar';
namedAMDConfigBase.output.libraryTarget = 'amd';


var config = [snippetConfig, pluginConfig];

function optimizationConfig(minimizer) {
  return {
    minimize: minimizer ? true : false,
    minimizer: minimizer ? [minimizer] : []
  }
}

function addVanillaToConfig(webpackConfig, filename, extraPlugins, minimizer) {
  var basePlugins = [defaultsPlugin];
  var vanillaConfig = extend({}, vanillaConfigBase);
  vanillaConfig.name = filename;

  var plugins = basePlugins.concat(extraPlugins);
  vanillaConfig.plugins = plugins;

  vanillaConfig.optimization = optimizationConfig(minimizer);

  vanillaConfig.output = extend({filename: filename}, vanillaConfig.output);

  webpackConfig.push(vanillaConfig);
}

function addUMDToConfig(webpackConfig, filename, extraPlugins, minimizer) {
  var basePlugins = [defaultsPlugin];
  var UMDConfig = extend({}, UMDConfigBase);

  var plugins = basePlugins.concat(extraPlugins);
  UMDConfig.plugins = plugins;

  UMDConfig.optimization = optimizationConfig(minimizer);

  UMDConfig.output = extend({filename: filename}, UMDConfig.output);

  webpackConfig.push(UMDConfig);
}


function addNoConflictToConfig(webpackConfig, filename, extraPlugins, minimizer) {
  var basePlugins = [defaultsPlugin];
  var noConflictConfig = extend({}, noConflictConfigBase);

  var plugins = basePlugins.concat(extraPlugins);
  noConflictConfig.plugins = plugins;

  noConflictConfig.optimization = optimizationConfig(minimizer);

  noConflictConfig.output = extend({filename: filename}, noConflictConfig.output);

  webpackConfig.push(noConflictConfig);
}


function addNamedAMDToConfig(webpackConfig, filename, extraPlugins, minimizer) {
  var basePlugins = [defaultsPlugin];
  var AMDConfig = extend({}, namedAMDConfigBase);

  var plugins = basePlugins.concat(extraPlugins);
  AMDConfig.plugins = plugins;

  AMDConfig.optimization = optimizationConfig(minimizer);

  AMDConfig.output = extend({filename: filename}, AMDConfig.output);

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
