'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

module.exports = function(options) {
  gulp.task('styles', function () {
    var fs = require('fs-extra');
    var lessOptions = {
      options: [
        'bower_components',
        options.src + '/app'
      ]
    };

    var stylesJson = JSON.parse(fs.readFileSync('./gulp-configs/config-styles.json'));
    var injectFilesArray = [];
    injectFilesArray.push( options.src + '/app/**/*.less' );
    _.forEach(stylesJson.stylesFiles, function(styleType) {
      _.forEach(styleType, function(value) {
        injectFilesArray.push( '!' + options.src + value.path + value.file );
      });
    });
    var injectFiles = gulp.src(injectFilesArray, { read: false });

    var injectOptions = {
      transform: function(filePath) {
        filePath = filePath.replace(options.src + '/app/', '');
        return '@import \'' + filePath + '\';';
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false
    };

    var vendorFilter = $.filter('vendor.less');

    var filterr = _.map(stylesJson.stylesFiles.others, function(style) {
      return style.file;
    });
    var f = $.filter(filterr);

    var srcArray = [];
    _.forEach(stylesJson.stylesFiles.others, function(value) {
      srcArray.push( options.src + value.path + value.file );
    });

    _.forEach(stylesJson.stylesFiles.vendor, function(value) {
      srcArray.push( options.src + value.path + value.file );
    });

    return gulp.src(srcArray)
      .pipe(f)
      .pipe($.inject(injectFiles, injectOptions))
      .pipe(f.restore())
      .pipe(vendorFilter)
      .pipe(wiredep(options.wiredep))
      .pipe(vendorFilter.restore())
      .pipe($.sourcemaps.init())
      .pipe($.less(lessOptions)).on('error', options.errorHandler('Less'))
      .pipe($.autoprefixer()).on('error', options.errorHandler('Autoprefixer'))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(options.tmp + '/serve/app/'))
      .pipe(browserSync.reload({ stream: true }));
  });
};
