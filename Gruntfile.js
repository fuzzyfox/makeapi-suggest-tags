/* global module, grunt */
module.exports = function( grunt ) {
  grunt.initConfig({
    pkg: grunt.file.readJSON( "package.json" ),

    jshint: {
      options: {
        strict: true,
        newcap: false
      },
      files: [
        "Gruntfile.js",
        "index.js",
        "src/**/*.js",
      ]
    }
  });

  grunt.loadNpmTasks( "grunt-contrib-jshint" );

  grunt.registerTask( "default", [ "jshint" ]);
};
