const path = require('path');
const webpack = require('webpack');
const defaults = require('./defaults');
const glob = require('glob');

const defaultsPlugin = new webpack.DefinePlugin(defaults);

const testFiles = glob.sync('test/**/!(requirejs)*.test.js');
const entry = {};

// Create entry points for each test file
testFiles.forEach((file) => {
  const name = file.replace('test/', '').replace('.js', '');
  entry[name] = './' + file;
});

module.exports = {
  mode: 'development',
  plugins: [defaultsPlugin],
  devtool: 'inline-source-map',
  performance: { hints: false },

  entry: entry,

  output: {
    path: path.resolve(__dirname, 'test-dist'),
    filename: '[name].js',
    library: {
      type: 'umd',
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/, /vendor/, /lib/, /dist/, /test/],
      },
    ],
  },
};
