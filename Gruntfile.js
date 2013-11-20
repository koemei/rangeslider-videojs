/*jshint node: true */
"use strict";


module.exports = function(grunt) {
  grunt.initConfig({
    pkg: "<json:package.json>",

    dirs: {
      app: "./"
    },

    meta: {
      name: "<%= pkg.name %>",
      banner: "/*! <%= meta.name %> - v<%= pkg.version %> - <%= grunt.template.today(\"m/d/yyyy\") %>\n" + "* <%= pkg.homepage %>\n" + "* Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>;*/"
    },


    stylus: {
      app: {
        options: {
          compress: false
        },
        files: [
          {
            expand: true,
            cwd: "<%= dirs.app %>/src/stylus",
            src: [
              "**/*.styl",
              "!node_modules/**/*.styl"
            ],
            dest: "<%= dirs.app %>/src",
            ext: ".css"
          }
        ]
      }
    },

    connect: {
      server: {
        options: {
          base: './'
        }
      }
    },

    notify: {
      compiled: {
        options: {
          message: 'Assets compiled'
        }
      }
    },

    watch: {
      options: {
        interrupt: true,
        nospawn: true
      },
      stylus: {
        files: "<%= stylus.app.files[0].cwd %>/**/*.styl",
        tasks: ["compile", "notify:compiled"]
      }
    },

    jasmine: {
      all: {
        src: 'build/*.js',
        options: {
          template: 'spec/SpecRunner.html',
          specs: 'spec/**/*.js'
        }
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask("compile", [
    "stylus",
    "jasmine"
  ]);

  grunt.registerTask("default", [
    "compile",
    "connect",
    "watch"
  ]);

  return grunt;
};
