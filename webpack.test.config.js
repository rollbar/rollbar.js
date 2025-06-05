const path = require('path');
const webpack = require('webpack');
const defaults = require('./defaults');
const glob = require('glob');

const defaultsPlugin = new webpack.DefinePlugin(defaults);

// Find all test files
const allTestFiles = glob.sync('test/**/*.test.js');
const browserTestFiles = allTestFiles.filter(
  (file) => !file.includes('server.'),
);
const serverTestFiles = allTestFiles.filter((file) => file.includes('server.'));

const browserEntry = {};
browserTestFiles.forEach((file) => {
  const name = file.replace('test/', '').replace('.js', '');
  browserEntry[name] = './' + file;
});

const serverEntry = {};
serverTestFiles.forEach((file) => {
  const name = file.replace('test/', '').replace('.js', '');
  serverEntry[name] = './' + file;
});

const commonConfig = {
  mode: 'development',
  plugins: [defaultsPlugin],
  devtool: 'inline-source-map',
  performance: { hints: false },
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

const browserConfig = {
  ...commonConfig,
  target: 'web',
  entry: browserEntry,
  output: {
    path: path.resolve(__dirname, 'test-dist/browser'),
    filename: '[name].js',
    library: {
      type: 'umd',
    },
  },
  resolve: {
    fallback: {
      // These Node.js modules are not available in browsers
      fs: false,
      path: false,
      http: false,
      https: false,
      os: false,
      url: false,
      assert: false,
      stream: false,
      util: false,
      buffer: false,
      process: false,
    },
  },
};

const serverConfig = {
  ...commonConfig,
  target: 'node',
  entry: serverEntry,
  output: {
    path: path.resolve(__dirname, 'test-dist/server'),
    filename: '[name].js',
    library: {
      type: 'commonjs2',
    },
  },

  // Don't bundle Node.js externals for server tests
  externalsPresets: { node: true },
};

module.exports =
  process.env.TEST_ENV === 'server' ? serverConfig : browserConfig;
