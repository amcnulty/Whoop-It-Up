module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        files: {
          './public/stylesheets/home.css': './public/scss/home.scss',
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
    watch: {
      sass: {
        files: ['public/scss/*.scss'],
        tasks: ['sass']  
      },
      concat: {
        files: ['./public/javascripts/*.js'],
        tasks: ['concat']
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