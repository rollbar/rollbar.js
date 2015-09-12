// Include the webpack config we use to build the tests.
// We export an array of webpack configurations from
// webpack.config.js so we only want the one for tests
// which is the 3rd element in the array.
//
var webpackConfig = require('./webpack.config.js')[2];
webpackConfig.devtool = 'inline-source-map';
delete webpackConfig.entry;
delete webpackConfig.output;

module.exports = function (config) {
  config.set({
    browsers: ['Chrome'],

    // karma only needs to know about the test bundle
    files: [
      // Files that the tests will load
      {
        pattern: 'dist/rollbar.js',
        included: false,
        served: true,
        watched: false
      },

      'test/*.test.js',
    ],

    frameworks: ['chai', 'mocha', 'sinon', 'jquery-1.8.3'],

    plugins: [
      'karma-chai',
      'karma-chrome-launcher',
      'karma-jquery',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-phantomjs-launcher',
      'karma-sinon',
      'karma-sourcemap-loader',
      'karma-webpack',
    ],

    // run the bundle through the webpack and sourcemap plugins
    preprocessors: {
      'test/*.test.js': ['webpack', 'sourcemap']
    },

    proxies: {
      '/dist/rollbar.js': '/base/dist/rollbar.js'
    },

    reporters: ['mocha'],

    singleRun: false,

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true
    }
  });
};