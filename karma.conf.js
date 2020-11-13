var path = require('path');
var webpack = require('webpack');
var defaults = require('./defaults');
var browserStackBrowsers = require('./browserstack.browsers');

var defaultsPlugin = new webpack.DefinePlugin(defaults);

var allBrowsers = browserStackBrowsers.filter('bs_all');
var allBrowsersByBrowser = {
  // Travis needs the --no-sandbox option,
  // so add as a custom launcher to be used as the default browser.
  ChromeNoSandbox: {
    base: 'ChromeHeadless',
    flags: ['--no-sandbox']
  }
};
allBrowsers.forEach(function(browser) {
  allBrowsersByBrowser[browser._alias] = browser;
});


module.exports = function (config) {
  config.set({
    browsers: ['ChromeNoSandbox'],

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

    frameworks: ['mocha', 'expect', 'chai', 'sinon', 'jquery-1.9.0'],

    logLevel: 'INFO',

    // Default is 1000 but we can run into rate limit issues so bump it up to 10k
    pollingTimeout: 10000,

    // run the bundle through the webpack and sourcemap plugins
    preprocessors: {
      'test/**/!(requirejs).test.js': ['webpack', 'sourcemap'],
      '**/*.html': ['html2js']
    },

    proxies: {
      '/dist/': '/base/dist/',
      '/examples/': '/base/examples/'
    },

    customHeaders: [
      // Allow CSP error testing, but leave enough enabled so that karma
      // can still run correctly.
      {
        match: '\\.html',
        name: 'Content-Security-Policy',
        value: "default-src 'self' 'unsafe-inline' 'unsafe-eval';"
      }
    ],

    reporters: ['progress'],

    singleRun: true,

    // Use "polling" and JSONP for older browsers
    transports: ['polling'],
    forceJSONP: true,

    webpack: {
      plugins: [defaultsPlugin],
      devtool: 'inline-source-map',
      performance: { hints: false },
      module: {
        rules: [
          {
            enforce: 'pre',
            test: /\.js$/,
            loader: 'eslint-loader',
            exclude: [/node_modules/, /vendor/, /lib/, /dist/],
            options: {
              configFile: path.resolve(__dirname, '.eslintrc')
            }
          },
          {
            test: /\.js$/,
            loader: 'strict-loader',
            exclude: [/node_modules/, /vendor/, /lib/, /dist/, /test/]
          },
          {
            test: /(mootootls|requirejs)\.js$/,
            loader: 'script'
          },
          {
            enforce: 'post',
            test: /\.js$/,
            exclude: [/node_modules/, /vendor/, /lib/, /dist/, /test/],
            loader: 'istanbul-instrumenter-loader'
          }
        ],
      }
    },

    webpackMiddleware: {
      noInfo: true
    }
  });
};
