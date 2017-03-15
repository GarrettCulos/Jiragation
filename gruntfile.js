module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    compass:{
      dist: {                   // Target
        options: {              // Target options
          sassDir: 'app/sass',
          cssDir: 'app/build'
        }
      }
    },

    bower_concat: {
      all: {
        dest: 'app/build/_lib.js',
        cssDest: 'app/build/_lib.css',
        dependencies: {
        },
        bowerOptions: {
          relative: false
        },
        exclude: [
          'bootstrap',
          'angular-loader',
          'angular-mocks',
          'bootstrap-sass',
          'd3',
          'grunt',
          'jquery',
          'vega',
          'vega-lite',
          'viscompass'
        ],
        mainFiles: {
          'angular':'angular.min.js',
          'angular-animate':'angular-animate.min.js',
          'angular-aria':'angular-aria.min.js',
          'angular-base64':'angular-base64.js',
          'angular-material':'angular-material.min.js',
          'angular-messages':'angular-messages.min.js',
          'angular-moment':'angular-moment.js',
          'angular-route':'angular-route.js',
          'angular-timer':['app/js/_timer.js','app/js/i18nService.js', 'app/js/progressBarService.js'],
          'html5-boilerplate':'dist/js/vendore/modernizer-2.8.3.min.js',
          'humanize-duration':'humanize-duration.js',
          'moment':'moment.js',
          'momentjs':'moment.js',
        },
      }
    },

    cssmin: {
      options: {
        sourceMap: true,
      },
      app: {
        src: './app/build/*.css',
        dest: './app/css/style.min.css'
      }
    },

    uglify: {
      options: {
        mangle: false,
        sourceMap: true,
      },
      app: {
        files: {
          'app/js/main.min.js': ['build/_lib.js', 'app/js/*.js', '!app/js/*.min.js']
        }
      },
    },
    
    watch: {
      css: {
        files: 'app/sass/**/*.scss',
        tasks: ['theme']
      },

      scripts: {
        files: ['app/js/**/*.js', '!app/js/**/*.min.js'],
        tasks: ['uglify']
      }
    }
  });

  // Load the Grunt plugins.
  require('load-grunt-tasks')(grunt);
  require('grunt-contrib-compass')(grunt);


  // Register the default tasks.
  grunt.registerTask('default', ['compass', 'bower_concat', 'cssmin', 'uglify']);
  grunt.registerTask('theme', ['compass', 'cssmin']);
};