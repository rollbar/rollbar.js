'use strict';

var glob = require('glob');
var path = require('path');
var pkg = require('./package.json');
var fs = require('fs');

var webpackConfig = require('./webpack.config.js');
var browserStackBrowsers = require('./browserstack.browsers');


function findTests() {
  var files = glob.sync('test/**/*.test.js');
  var mapping = {};

  files.forEach(function(file) {
    var testName = path.basename(file, '.test.js');
    mapping[testName] = file;
  });

  return mapping;
}


function buildGruntKarmaConfig(singleRun, browsers, tests, reporters) {
  var config = {
    options: {
      configFile: './karma.conf.js',
      singleRun: singleRun,
      files: [
        // Files that the tests will load
        {
          pattern: 'dist/**/*.js',
          included: false,
          served: true,
          watched: false
        },
        {
          pattern: 'src/**/*.js',
          included: false,
          served: true,
          watched: false
        }
      ]
    },
  };

  if (browsers && browsers.length) {
    config.options.browsers = browsers;
  }

  if (reporters && reporters.length) {
    config.options.reporters = reporters;
  }

  for (var testName in tests) {
    var testFile = tests[testName];
    var testConfig = config[testName] = {};

    // Special case for testing requirejs integration.
    // Include the requirejs module as a framework so
    // Karma will inclue it in the web page.
    if (testName === 'requirejs') {
      testConfig.files = [
        {src: './test/requirejs-loader.js'},
        {src: './test/requirejs.test.js', included: false},
        {src: './dist/rollbar.umd.js', included: false}
      ];
      // NOTE: requirejs should go first in case the subsequent libraries
      // check for the existence of `define()`
      testConfig.frameworks = ['requirejs', 'expect', 'mocha'];
    } else {
      testConfig.files = [{src: [testFile]}];
    }

    // Special config for BrowserStack IE tests
    if (testName.slice(0, 3) === 'bs' && testName.indexOf('ie_') >= 0) {
      // Long timeout since IE 6/7/8 is slow
      testConfig.captureTimeout = 60000 * 10;
    }
  }

  return config;
}


module.exports = function(grunt) {
  require('time-grunt')(grunt);

  function createRelease() {
    var version = pkg.version;
    var builds = ['', '.nojson', '.umd', '.umd.nojson'];

    builds.forEach(function (buildName) {
      var js = 'dist/rollbar' + buildName + '.js';
      var minJs = 'dist/rollbar' + buildName + '.min.js';

      var releaseJs = 'release/rollbar' + buildName + '-' + version + '.js';
      var releaseMinJs = 'release/rollbar' + buildName + '-' + version + '.min.js';

      grunt.file.copy(js, releaseJs);
      grunt.file.copy(minJs, releaseMinJs);
    });
  }

  var tests = findTests();
  var browsers = grunt.option('browsers');
  if (browsers) {
    browsers = browsers.split(',');

    var expandedBrowserNames = [];
    var browserStackAliases = [];
    var nonBrowserStackAliases = [];
    browsers.forEach(function(browserName) {
      if (browserName.slice(0, 3) === 'bs_') {
        browserStackAliases.push(browserName);
      } else {
        nonBrowserStackAliases.push(browserName);
      }
    });

    var expandedBrowsers = browserStackBrowsers.filter.apply(null, browserStackAliases);
    var expandedBrowserNames = [];
    expandedBrowsers.forEach(function(browser) {
      expandedBrowserNames.push(browser._alias);
    });
    browsers = nonBrowserStackAliases.concat(expandedBrowserNames);
  }

  var singleRun = grunt.option('singleRun');
  if (singleRun === undefined) {
    singleRun = true;
  }

  var reporters = grunt.option('reporters');
  if (reporters !== undefined) {
    reporters = reporters.split(',');
  }

  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-text-replace');


  grunt.initConfig({
    pkg: pkg,
    webpack: webpackConfig,
    karma: buildGruntKarmaConfig(singleRun, browsers, tests, reporters),

    // Serves up responses to requests from the tests
    express: {
      defaults: {
        options: {
          server: './test/express',
          port: 3000
        }
      }
    },

    replace: {
      snippets: {
        src: ['*.md', 'test/**/*.html', 'src/**/*.js', 'examples/*.+(html|js)', 'examples/*/*.+(html|js)', 'docs/**/*.md'],
        overwrite: true,
        replacements: [
          // Main rollbar snippet
          {
            from: new RegExp('^(.*// Rollbar Snippet)[\n\r]+([^\n\r]+)[\n\r]+(.*// End Rollbar Snippet)', 'm'),
            to: function(match, index, fullText, captures) {
              var snippet = fs.readFileSync('dist/rollbar.snippet.js');
              captures[1] = snippet;
              return captures.join('\n');
            }
          },
          // jQuery rollbar plugin snippet
          {
            from: new RegExp('^(.*// Rollbar jQuery Snippet)[\n\r]+([^\n\r]+)[\n\r]+(.*// End Rollbar jQuery Snippet)', 'm'),
            to: function(match, index, fullText, captures) {
              var snippet = fs.readFileSync('dist/plugins/jquery.min.js');
              captures[1] = snippet;
              return captures.join('\n');
            }
          },
          // README travis link
          {
            from: new RegExp('(https://api\.travis-ci\.org/rollbar/rollbar\.js\.png\\?branch=v)([0-9.]+)'),
            to: function(match, index, fullText, captures) {
              captures[1] = pkg.version;
              return captures.join('');
            }
          }
        ]
      }
    }

    // TODO: Upload assets to CDN
  });

  grunt.registerTask('build', ['webpack', 'replace:snippets']);
  grunt.registerTask('default', ['build']);
  grunt.registerTask('test', ['express', 'karma']);
  grunt.registerTask('release', ['build', createRelease]);

  grunt.registerTask('test', function(target) {
    var karmaTask = 'karma' + (target ? ':' + target : '');
    var tasks = ['express', karmaTask];
    grunt.task.run.apply(grunt.task, tasks);
  });
};

