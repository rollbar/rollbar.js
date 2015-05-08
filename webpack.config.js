var webpack = require('webpack');

var outputPath = './dist/';

var jsonDefines = {
  __USE_JSON__: true
};

var NoJsonDefines = {
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
    failOnError: true
  },
  {
    entry: {
      rollbar: './src/bundles/rollbar.js',
      'rollbar.umd': './src/bundles/rollbar.umd.js'
    },
    output: {
      library: 'Rollbar',
      path: outputPath,
      filename: '[name].js',
      libraryTarget: 'umd'
    },
    plugins: [new webpack.DefinePlugin(jsonDefines)],
    failOnError: true
  },
  {
    entry: {
      rollbar: './src/bundles/rollbar.js',
      'rollbar.umd': './src/bundles/rollbar.umd.js'
    },
    output: {
      library: 'Rollbar',
      path: outputPath,
      filename: '[name].nojson.js',
      libraryTarget: 'umd'
    },
    plugins: [new webpack.DefinePlugin(NoJsonDefines)],
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
    },
    output: {
      path: 'test/',
      filename: '[name].bundle.js',
    }
  }
];

