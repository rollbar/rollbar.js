module.exports = function (config) {
  config.set({
    browsers: ['ChromeHeadless'],

    // The Travis environment has these specified.
    // To run BrowserStack tests locally, specify the environment variables:
    //  BROWSER_STACK_USERNAME, BROWSER_STACK_ACCESS_KEY
    browserStack: { username: null, accessKey: null },

    client: { captureConsole: true },

    // Files are specified in the grunt-karma configuration in Gruntfile.cjs
    //files: []

    frameworks: ['mocha', 'expect', 'chai', 'sinon', 'jquery-1.9.0'],

    logLevel: 'INFO',

    // Default is 1000 but we can run into rate limit issues so bump it up to 10k
    pollingTimeout: 10000,

    // run the bundle through the webpack and sourcemap plugins
    preprocessors: {
      'test/**/!(requirejs).test.js': ['webpack', 'sourcemap'],
      '**/*.html': ['html2js'],
    },

    proxies: {
      '/dist/': '/base/dist/',
      '/examples/': '/base/examples/',
      '/test/': '/base/test/',
    },

    customHeaders: [
      // Allow CSP error testing, but leave enough enabled so that karma
      // can still run correctly.
      {
        match: '\\.html',
        name: 'Content-Security-Policy',
        value: "default-src 'self' 'unsafe-inline' 'unsafe-eval';",
      },
    ],

    reporters: ['progress'],

    singleRun: true,

    // Use "polling" and JSONP for older browsers
    transports: ['polling'],
    forceJSONP: true,

    webpack: {
      devtool: 'inline-source-map',
      performance: { hints: false },
      module: {
        rules: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: [/node_modules/, /vendor/, /lib/, /dist/, /test/],
          },
          { test: /(mootootls|requirejs)\.js$/, loader: 'script' },
          {
            enforce: 'post',
            test: /\.js$/,
            exclude: [/node_modules/, /vendor/, /lib/, /dist/, /test/],
            loader: 'coverage-istanbul-loader',
          },
        ],
      },
    },

    webpackMiddleware: { noInfo: true },
  });
};
