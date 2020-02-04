var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var defaults = require('./defaults');
var webpackConfig = require('./webpack.config.js');

var outputPath = path.resolve(__dirname, 'dist');

var defaultsPlugin = new webpack.DefinePlugin(defaults);

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

function buildConfig() {
  var hash
  try {
    hash = JSON.parse(
      fs.readFileSync(path.join(
        webpackConfig.find(({entry}) => entry.rollbar).output.path, 'manifest.json',
      )),
    )['rollbar.js'].integrity;
  } catch (error) {} // eslint-disable-line no-empty

  return {
    ...snippetConfig,
    plugins: [
      ...snippetConfig.plugins,
      new webpack.DefinePlugin({
        __DEFAULT_ROLLBARJS_HASH__: JSON.stringify(hash),
      }),
    ],
  }
}


module.exports = buildConfig;
