/* jshint node: true */

"use strict";

var webpackConfig = require('./webpack.config.js');

var testFiles;

if (process.env.TEST) {
  testFiles= ['http://localhost:3000/' + process.env.TEST];
} else {
  testFiles = ['http://localhost:3000/test/util.html',
               'http://localhost:3000/test/json.html',
               'http://localhost:3000/test/xhr.html',
               'http://localhost:3000/test/notifier.html',
               'http://localhost:3000/test/notifier.ratelimit.html',
               'http://localhost:3000/test/rollbar.html',
               'http://localhost:3000/test/shim.html',
               'http://localhost:3000/test/shimalias.html',
               'http://localhost:3000/test/integrations/mootools.html',
               'http://localhost:3000/test/plugins/jquery.html'
              ];
}

module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: pkg,
    webpack: {
      options: webpackConfig,
      "build-dev": {
        devtool: "sourcemap",
        debug: true
      }
    },
    jshint: {
      options: {
        globals: {
          console: true,
          window: true,
          require: true,
          module: true
        },
        browser: true,
        curly: true,
        eqeqeq: true,
        es3: true,
        forin: true,
        freeze: true,
        futurehostile: true,
        globalstrict: true,
        noarg: true,
        nocomma: true,
        nonbsp: true,
        nonew: true,
        strict: true,
        undef: true
      },
      files: [
        'Gruntfile.js',
        'src/error_parser.js',
        'src/globalnotifier.js',
        'src/notifier.js',
        'src/shim.js',
        'src/snippet_callback.js',
        'src/util.js',
        'src/xhr.js',
        'src/shimload.js',
        'src/bundles/rollbar.snippet.js',
        'src/bundles/rollbar.umd.js'
      ]
    },
    uglify: {
      prewebpack: {
        files: {
          'vendor/json2.min.js': 'vendor/JSON-js/json2.js',
          'vendor/trace.min.js': 'vendor/TraceKit/src/trace.js'
        }
      }
    },
    mocha_phantomjs: {
      test: {
        options: {
          '--web-security' : false,
          '--local-to-remote-url-access' : true,
          run: true,
          log: true,
          urls: testFiles
        }
      }
    },
    /* Serves up responses to requests from the notifier */
    express: {
      test: {
        options: {
          server: './test/express',
          port: 3000
        }
      }
    },
    /* Serves up the static test .html files */
    connect: {
      test: {
        options: {
          base: '.',
          port: 3000
        }
      }
    },
    bumpup: ['package.json', 'bower.json'],
    tagrelease: {
      file: 'package.json',
      prefix: 'v',
      commit: false
    },
    'saucelabs-mocha': {
      all: {
        options: {
          urls: ['http://localhost:3000/test/rollbar.html'],
                 //'http://localhost:3000/test/shim.html',
                 //'http://localhost:3000/test/notifier.html',
                 //'http://localhost:3000/test/components.html'],
          tunnelTimeout: 5,
          build: process.env.TRAVIS_JOB_ID,
          concurrency: 3,
          browsers: browsers,
          testname: "mocha tests",
          username: process.env.SAUCE_USERNAME,
          key: process.env.SAUCE_ACCESS_KEY
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-bumpup');
  grunt.loadNpmTasks('grunt-tagrelease');
  grunt.loadNpmTasks('grunt-saucelabs');
  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('build', ['jshint', 'uglify:prewebpack', 'webpack']);
  grunt.registerTask('release', ['build', 'copyrelease']);

  var testjobs = ['uglify:prewebpack', 'webpack', 'express'];
  if (typeof process.env.SAUCE_ACCESS_KEY !== 'undefined'){
    testjobs.push('saucelabs-mocha');
  } else {
    testjobs.push('mocha_phantomjs');
  }
  grunt.registerTask('test', testjobs);

  // This will allow you to run "grunt test-debug" and then open your
  // browser to http://localhost:3000/test/XXX.html to run tests.
  grunt.registerTask('test-browser', function() {
    console.log('Open your browser to http://localhost:3000/test/rollbar.html');
    grunt.task.run('express');
    grunt.task.run('express-keepalive');
  });

  grunt.registerTask('default', ['build']);

  grunt.registerTask('bumpversion', function(type) {
    type = type ? type : 'patch';
    grunt.task.run('bumpup:' + type);
  });

  grunt.registerTask('copyrelease', function() {
    var version = pkg.version;
    var builds = ['umd', 'umd.nojson'];

    builds.forEach(function (buildName) {
      var js = 'dist/rollbar.' + buildName + '.js';
      var minJs = 'dist/rollbar.' + buildName + '.min.js';

      var releaseJs = 'release/rollbar.' + buildName + '-' + version + '.js';
      var releaseMinJs = 'release/rollbar.' + buildName + '-' + version + '.min.js';

      grunt.file.copy(js, releaseJs);
      grunt.file.copy(minJs, releaseMinJs);
    });
  });
};


var browsers = [
  {
    browserName: 'firefox',
    version: '19',
    platform: 'XP'
  },
  {
    browserName: 'chrome',
    platform: 'XP'
  },
  {
    browserName: 'chrome',
    platform: 'linux'
  },
  {
    browserName: 'internet explorer',
    platform: 'WIN8',
    version: '10'
  },
  {
    browserName: 'internet explorer',
    platform: 'VISTA',
    version: '9'
  },
  {
    browserName: 'internet explorer',
    platform: 'XP',
    version: '8'
  },
  {
    browserName: 'opera',
    platform: 'Windows 2008',
    version: '12'
  }
];

