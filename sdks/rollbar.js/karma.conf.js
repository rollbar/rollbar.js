var path = require('path');
var webpack = require('webpack');
var defaults = require('./defaults');
var browserStackBrowsers = require('./browserstack.browsers');

var defaultsPlugin = new webpack.DefinePlugin(defaults);

var allBrowsers = browserStackBrowsers.filter('bs_all');
var allBrowsersByBrowser = {};
allBrowsers.forEach(function(browser) {
  allBrowsersByBrowser[browser._alias] = browser;
});


module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],

    // The Travis environment has these specified.
    // To run BrowserStack tests locally, specify the environment variables:
    //  BROWSER_STACK_USERNAME, BROWSER_STACK_ACCESS_KEY
    browserStack: {
      username: null,
      accessKey: null
    },

    client: {
      captureConsole: true
    },

    // Used for testing on BrowserStack
    customLaunchers: allBrowsersByBrowser,

    // Files are specified in the grunt-karma configuration in Gruntfile.js
    //files: []

    frameworks: ['mocha', 'expect', 'sinon', 'jquery-1.9.0'],

    logLevel: 'INFO',

    // Default is 1000 but we can run into rate limit issues so bump it up to 10k
    pollingTimeout: 10000,

    // run the bundle through the webpack and sourcemap plugins
    preprocessors: {
      'test/!(requirejs).test.js': ['webpack'],
    },

    proxies: {
      '/dist/rollbar.js': '/base/dist/rollbar.js'
    },

    reporters: ['progress'],

    singleRun: true,

    // Use "polling" and JSONP for older browsers
    transports: ['polling'],
    forceJSONP: true,

    webpack: {
      eslint: {
        configFile: path.resolve(__dirname, ".eslintrc")
      },
      plugins: [defaultsPlugin],
      module: {
        preLoaders: [
          {
            test: /\.js$/,
            loader: "strict!eslint",
            exclude: [/node_modules/, /vendor/, /lib/, /dist/]
          }
        ],
        loaders: [
          {
            test: /(mootootls|requirejs)\.js$/,
            loader: 'script'
          }
        ],
        postLoaders: [
          {
            test: /\.js$/,
            exclude: [/node_modules/, /vendor/, /lib/, /dist/, /test/],
            loader: 'istanbul-instrumenter'
          }
        ]
      }
    },

    webpackMiddleware: {
      noInfo: true
    }
  });
};
