var webpack = require('webpack');

var outputPath = './dist/';

var jsonDefines = {
  __USE_JSON__: true
};

var noJsonDefines = {
  __USE_JSON__: false
};

module.exports = [
  {
    name: 'snippet',
    entry: {
      'rollbar.snippet': './src/bundles/rollbar.snippet.js'
    },
    output: {
      path: outputPath,
      filename: '[name].js'
    },
    plugins: [new webpack.DefinePlugin(noJsonDefines)],
    failOnError: true
  },
  {
    entry: {
      'rollbar.umd': './src/bundles/rollbar.umd.js'
    },
    output: {
      library: 'Rollbar',
      path: outputPath,
      filename: '[name].nojson.js',
      libraryTarget: 'umd'
    },
    plugins: [new webpack.DefinePlugin(noJsonDefines)],
    failOnError: true
  },
  {
    entry: {
      'rollbar.umd': './src/bundles/rollbar.umd.js'
    },
    output: {
      library: 'Rollbar',
      path: outputPath,
      filename: '[name].nojson.js',
      libraryTarget: 'umd'
    },
    plugins: [new webpack.DefinePlugin(noJsonDefines)],
    failOnError: true
  },
  {
    name: 'tests',
    entry: {
      util: './test/bundles/util.js',
      json: './test/bundles/json.js',
      xhr: './test/bundles/xhr.js',
      notifier: './test/bundles/notifier.js',
      'notifier-ratelimit': './test/bundles/notifier.ratelimit.js',
      'rollbar': './test/bundles/rollbar.js',
      'shim': './test/bundles/shim.js',
      'shimalias': './test/bundles/shimalias.js',
    },
    output: {
      path: 'test/',
      filename: '[name].bundle.js',
    }
  }
];

