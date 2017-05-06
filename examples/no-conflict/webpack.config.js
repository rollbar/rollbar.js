'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = [{
  name: 'frontend',
  devtool: 'eval-source-map',
  entry: path.join(__dirname, '/tool.js'),
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: 'tool.js',
    libraryTarget: 'umd',
    library: 'tool'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        "presets": ["es2015", "stage-0"]
      }
    }]
  }
}];
