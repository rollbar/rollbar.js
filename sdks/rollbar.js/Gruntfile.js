module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');
  grunt.initConfig({
    pkg: pkg,
    jshint: {
      options: {
        globals: {
          console: true,
          window: true
        }
      },
      files: ['Gruntfile.js', 'src/stacktrace.js', 'src/notifier.js', 'src/util.js', 'src/xhr.js', 'src/json.js', 'src/init.js', 'src/shim.js', 'src/shimload.js']
    },
    concat: {
      options: {
        banner: '(function(window, document){\n',
        footer: '})(window, document);'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.js': ['src/notifier.js', 'src/stacktrace.js', 'src/util.js', 'src/xhr.js', 'src/json.js', 'src/init.js'],
          'dist/<%= pkg.name %>.snippet.js': ['src/shim.js', 'src/shimload.js']
        }
      }
    },
    uglify: {
      dist: {
        options: {
          sourceMap: function(path) {
            return path.replace(/.js$/, ".map");
          },
          sourceMappingURL: function(path) {
              // pkg.cdn set above initConfig() above
              var prefix = 'https://' + pkg.cdn.host + '/static/js/';
              return prefix + path.replace(/dist\//, '').replace(/.js$/, ".map");
          }
        },
        files: {
          'dist/<%= pkg.name %>.min.js': 'dist/<%= pkg.name %>.js',
          'dist/<%= pkg.name %>.snippet.min.js': 'dist/<%= pkg.name %>.snippet.js',
          'dist/plugins/jquery.min.js': 'src/plugins/jquery.js'
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
            from: /(VERSION|version) = (["'])[0-9_\.-a-zA-Z]+(["'])/g,
            to: '$1 = $2<%= pkg.version %>$3'
          },
          {
            // jquery plugin version
            from: /(JQUERY_PLUGIN_VERSION|jqueryPluginVersion) = (["'])[0-9_\.-a-zA-Z]+(["'])/g,
            to: '$1 = $2<%= pkg.plugins.jquery.version %>$3'
          }
        ]
      }
    },
    mocha: {
      test: {
        src: ['test/**/*.html'],
        options: {
          '--web-security' : false,
          '--local-to-remote-url-access' : true,
          run: true,
          log: true,
          reporter: 'Spec'
        }
      }
    },
    express: {
      dist: {
        options: {
          server: './test/express'
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'concat', 'uglify']
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-text-replace');

  grunt.registerTask('test', ['replace', 'jshint', 'express', 'mocha']);
  grunt.registerTask('default', ['replace', 'jshint', 'concat', 'uglify', 'express', 'mocha']);
};
