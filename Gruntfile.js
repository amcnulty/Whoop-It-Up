module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        files: {
          './public/stylesheets/main.css': './public/scss/main.scss',
        }
      }
    },
    concat: {
      app: {
        src: [
          './public/javascripts/*.js'
        ],
        dest: './public/javascripts/dist/app.js'
      }
    },
    uglify: {
      app: {
        files: {
          './public/javascripts/dist/app.min.js': ['./public/javascripts/dist/app.js']
        }
      }
    },
    watch: {
      sass: {
        files: ['public/scss/*.scss'],
        tasks: ['sass']  
      },
      concat: {
        files: ['./public/javascripts/*.js'],
        tasks: ['concat']
      },
      uglify: {
        files: ['./public/javascripts/dist/app.js'],
        tasks: ['uglify']
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'sass', 'watch', 'concat']);

};