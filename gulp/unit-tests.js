'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');
var karma = require('karma');
var concat = require('concat-stream');
var _ = require('lodash');

var zip = require('gulp-zip');

module.exports = function(options) {

  function coverageReport(){
    gulp.src('coverage/report-html/**/*')
          .pipe(zip('coverage.zip'))
          .pipe(gulp.dest(''));
  }

  function listFiles(callback) {
      var bowerDeps = wiredep({
        directory: 'bower_components',
        exclude: ['bootstrap-sass-official'],
        dependencies: true,
        devDependencies: true
      });

    var specFiles = [
      options.src + '/**/*.spec.js',
      options.src + '/**/*.mock.js'
    ];

    var htmlFiles = [
      options.src + '/**/*.html'
    ];

    var srcFiles = [
      options.src + '/app/**/*.js'
    ].concat(specFiles.map(function(file) {
      return '!' + file;
    }));

    gulp.src(srcFiles)
      .pipe(concat(function(files) {
        callback(bowerDeps.js
          .concat(_.pluck(files, 'path'))
          .concat(htmlFiles)
          .concat(specFiles));
      }));
  }

  function runTests (singleRun, done) {
    listFiles(function(files) {
      karma.server.start({
        configFile: __dirname + '/../karma.conf.js',
        files: files,
        singleRun: singleRun,
        autoWatch: !singleRun
      }, function() {
        done();
      });
    });
  }

  gulp.task('test', ['scripts'], function(done) {
    runTests(true, done);
    coverageReport();
  });
  gulp.task('test:auto', ['watch'], function(done) {
    runTests(false, done);
  });
};
