module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
  
    watch: {
      files: '<%= jshint.src %>',
      tasks: ['jshint', 'mocha']
    },

    uglify: {
      options: {
        banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap: 'dist/<%= pkg.name %>.map',
        sourceMappingURL: 'https://rollbar.com/static/js/<%= pkg.name %>.map'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },

    lint: {
      files: [
        'src/rollbar.js',
        'src/plugins/jquery.js'
      ]
    },

    jshint: {
      src: [
        'src/*.js'
      ],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      }
    },

    mocha: {
      all: ['tests/index.html']
    }
  });

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-mocha');

  grunt.registerTask('default', ['jshint', 'mocha', 'uglify']);
};
