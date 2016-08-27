'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var preprocess = require('gulp-preprocess');
var argv = require('yargs').argv;

var wiredep = require('wiredep').stream;


module.exports = function(options) {


  gulp.task('preprocess', function(done) {
      return gulp.src([
        options.src + '/env.js'
      ])
      .pipe(preprocess({
        context: {
          REVISION: argv.revision || 'DEV'
        }
      }))
      .pipe(gulp.dest(options.src + '/app/commons/'));
  });

  gulp.task('inject', ['scripts', 'preprocess', 'styles'], function () {
    var injectStyles = gulp.src([
      options.tmp + '/serve/app/**/*.css',
      '!' + options.tmp + '/serve/app/vendor.css'
    ], { read: false });

    var injectScripts = gulp.src([
      options.src + '/app/**/*.js',
      '!' + options.src + '/app/**/*.spec.js',
      '!' + options.src + '/app/**/*.mock.js'
    ])

    .pipe($.angularFilesort()).on('error', options.errorHandler('AngularFilesort'));

    var injectOptions = {
      ignorePath: [options.src, options.tmp + '/serve'],
      addRootSlash: false
    };

    return gulp.src(options.src + '/*.html')
      .pipe($.inject(injectStyles, injectOptions))
      .pipe($.inject(injectScripts, injectOptions))
      .pipe(wiredep(options.wiredep))
      .pipe(gulp.dest(options.tmp + '/serve'));

  });
};
