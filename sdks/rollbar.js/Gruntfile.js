var semver = require('semver');

module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');
  var semVer = semver.parse(pkg.version);

  require('time-grunt')(grunt);

  // Get the minimum minor version to put into the CDN URL
  semVer.patch = 0;
  semVer.prerelease = [];
  pkg.pinnedVersion = semVer.major + '.' + semVer.minor;

  grunt.initConfig({
    pkg: pkg,
    jshint: {
      options: {
        globals: {
          console: true,
          window: true
        }
      },
      files: ['Gruntfile.js', 'src/notifier.js', 'src/util.js', 'src/xhr.js', 'src/init.js', 'src/shim.js', 'src/shimload.js']
    },
    concat: {
      dist: {
        options: {
          banner: '(function(window, document){\n',
          footer: '})(window, document);'
        },
        files: {
          'dist/<%= pkg.name %>.js': ['vendor/JSON-js/json2.js', 'vendor/TraceKit/src/trace.js',
                                      'src/util.js', 'src/json.js', 'src/xhr.js', 'src/notifier.js', 'src/init.js'],
          'dist/<%= pkg.name %>.snippet.js': ['src/shim.js', 'src/loadfull.js', 'src/shimload.js']
        }
      },
      amd: {
        options: {
          banner: '/* rollbar.js for use with AMD loaders */\ndefine(function(require, exports, module) {\n',
          footer: 'module.exports = globalNotifier;\n});'
        },
        files: {
          'dist/<%= pkg.name %>.amd.js': ['vendor/JSON-js/json2.js', 'vendor/TraceKit/src/trace.js',
                                                'src/util.js', 'src/json.js', 'src/xhr.js', 'src/notifier.js', 'src/globalnotifier.js']
        }
      },
      commonjs: {
        options: {
          banner: '/* rollbar.js for use with CommonJS loaders */\n',
          footer: 'module.exports = globalNotifier'
        },
        files: {
          'dist/<%= pkg.name %>.commonjs.js': ['vendor/JSON-js/json2.js', 'vendor/TraceKit/src/trace.js',
                                               'src/util.js', 'src/json.js', 'src/xhr.js', 'src/notifier.js', 'src/globalnotifier.js']
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': 'dist/<%= pkg.name %>.js',
          'dist/<%= pkg.name %>.snippet.min.js': 'dist/<%= pkg.name %>.snippet.js',
          'dist/<%= pkg.name %>.amd.min.js': 'dist/<%= pkg.name %>.amd.js',
          'dist/<%= pkg.name %>.commonjs.min.js': 'dist/<%= pkg.name %>.commonjs.js',
          'dist/<%= pkg.name %>.shim.min.js': 'src/shim.js',
          'dist/plugins/jquery.min.js': 'src/plugins/jquery.js'
        }
      },
      amd: {
        files: {
          'dist/<%= pkg.name %>.amd.min.js': 'dist/<%= pkg.name %>.amd.js',
        }
      },
      commonjs: {
        files: {
          'dist/<%= pkg.name %>.commonjs.min.js': 'dist/<%= pkg.name %>.commonjs.js',
        }
      }
    },
    replace: {
      js: {
        src: ['src/**/*.js'],
        overwrite: true,
        replacements: [
          {
            // package version
            from: /(NOTIFIER_VERSION|notifierVersion) = (["'])[0-9_\.a-zA-Z-]+(["'])/g,
            to: '$1 = $2<%= pkg.version %>$3'
          },
          {
            // jquery plugin version
            from: /(JQUERY_PLUGIN_VERSION|jqueryPluginVersion) = (["'])[0-9_\.a-zA-Z-]+(["'])/g,
            to: '$1 = $2<%= pkg.plugins.jquery.version %>$3'
          },
          {
            // default scrub fields
            from: /(DEFAULT_SCRUB_FIELDS|defaultScrubFields) = \[.+\]/g,
            to: '$1 = <%= JSON.stringify(pkg.defaults.scrubFields) %>'
          },
          {
            // default endpoint
            from: /(DEFAULT_ENDPOINT|defaultEndpoint) = (["'])[0-9_\.a-zA-Z:\/]+(["'])/g,
            to: '$1 = $2<%= pkg.defaults.endpoint %>$3'
          },
          {
            // default log level
            from: /(DEFAULT_LOG_LEVEL|defaultLogLevel) = (["'])(debug|info|warning|error|critical)(["'])/g,
            to: '$1 = $2<%= pkg.defaults.logLevel %>$4'
          },
          {
            // default min report level
            from: /(DEFAULT_REPORT_LEVEL|defaultReportLevel) = (["'])(debug|info|warning|error|critical)(["'])/g,
            to: '$1 = $2<%= pkg.defaults.reportLevel %>$4'
          },
          {
            // default min uncaught error level
            from: /(DEFAULT_UNCAUGHT_ERROR_LEVEL|defaultUncaughtErrorLevel) = (["'])(debug|info|warning|error|critical)(["'])/g,
            to: '$1 = $2<%= pkg.defaults.uncaughtErrorLevel %>$4'
          },
          {
            // default rollbar.js CDN URL
            from: /(DEFAULT_ROLLBARJS_URL|defaultRollbarJsUrl) = (["']).*(["'])/g,
            to: '$1 = $2//<%= pkg.cdn.host %>/js/v<%= pkg.pinnedVersion %>/rollbar.min.js$3'
          },
          {
            // default max items
            from: /(DEFAULT_MAX_ITEMS) = ([0-9]+)/g,
            to: '$1 = <%= pkg.defaults.maxItems %>'
          },
          {
            // default items per min
            from: /(DEFAULT_ITEMS_PER_MIN) = ([0-9]+)/g,
            to: '$1 = <%= pkg.defaults.itemsPerMin %>'
          }
        ]
      }
    },
    mocha_phantomjs: {
      test: {
        options: {
          '--web-security' : false,
          '--local-to-remote-url-access' : true,
          run: true,
          log: true,
          urls: ['http://localhost:3000/test/components.html',
                 'http://localhost:3000/test/notifier.html',
                 'http://localhost:3000/test/notifier.ratelimit.html',
                 'http://localhost:3000/test/rollbar.html',
                 'http://localhost:3000/test/shim.html',
                 'http://localhost:3000/test/shimalias.html',
                 'http://localhost:3000/test/integrations/mootools.html',
                 'http://localhost:3000/test/plugins/jquery.html']
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
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-bumpup');
  grunt.loadNpmTasks('grunt-tagrelease');
  grunt.loadNpmTasks('grunt-saucelabs');

  grunt.registerTask('build', ['replace', 'jshint', 'concat', 'uglify']);
  grunt.registerTask('release', ['build', 'copyrelease']);

  var testjobs = ['express'];
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

    var rollbarJs = 'dist/rollbar.js';
    var releaseRollbarJs = 'release/rollbar-' + version + '.js';

    var rollbarMinJs = 'dist/rollbar.min.js';
    var releaseRollbarMinJs = 'release/rollbar-' + version + '.min.js';

    var rollbarAmdJs = 'dist/rollbar.amd.js';
    var releaseRollbarAmdJs = 'release/rollbar-' + version + '.amd.js';

    var rollbarAmdMinJs = 'dist/rollbar.amd.min.js';
    var releaseRollbarAmdMinJs = 'release/rollbar-' + version + '.amd.min.js';

    var rollbarCommonJs = 'dist/rollbar.commonjs.js';
    var releaseRollbarCommonJs = 'release/rollbar-' + version + '.commonjs.js';

    var rollbarCommonMinJs = 'dist/rollbar.commonjs.min.js';
    var releaseRollbarCommonMinJs = 'release/rollbar-' + version + '.commonjs.min.js';

    grunt.file.copy(rollbarJs, releaseRollbarJs);
    grunt.file.copy(rollbarMinJs, releaseRollbarMinJs);
    grunt.file.copy(rollbarAmdJs, releaseRollbarAmdJs);
    grunt.file.copy(rollbarAmdMinJs, releaseRollbarAmdMinJs);
    grunt.file.copy(rollbarCommonJs, releaseRollbarCommonJs);
    grunt.file.copy(rollbarCommonMinJs, releaseRollbarCommonMinJs);

    //grunt.task.run('tagrelease');
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

