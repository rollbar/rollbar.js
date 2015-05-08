var webpack = require('webpack');

var outputPath = './dist/bundles/';

var jsonDefines = {
  __USE_JSON__: true
};

var NoJsonDefines = {
  __USE_JSON__: false
};

module.exports = [
  // {
  //   name: 'snippet',
  //   entry: {
  //     'rollbar.snippet': './src/bundles/rollbar.snippet.js'
  //   },
  //   output: {
  //     path: outputPath
  //   },
  //   failOnError: true
  // },
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
  }
];

