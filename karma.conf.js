'use strict';

module.exports = function(config) {

  var configuration = {
    autoWatch : false,

    frameworks: ['jasmine'],

    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/',
      moduleName: 'gulpAngular'
    },


    //the following line breaks the test
    reporters : ['coverage', 'progress'],

    coverageReporter : {
              dir : 'coverage/',
              reporters: [
                  {type: 'html', subdir: 'report-html'},
                  {type: 'teamcity', file: 'teamcity.txt'},
                  {type: 'lcov', subdir: 'report-lcov'},
              ]
    },

    browsers : ['PhantomJS'],

    plugins : [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor',
      'karma-coverage'
    ],

    preprocessors: {
      'src/**/*.html': ['ng-html2js'],
      'src/app/**/!(*spec|*oldie|*main|*mock|*new|index|*external).js' : 'coverage'
    }
  };

  // This block is needed to execute Chrome on Travis
  // If you ever plan to use Chrome and Travis, you can keep it
  // If not, you can safely remove it
  // https://github.com/karma-runner/karma/issues/1144#issuecomment-53633076
  if(configuration.browsers[0] === 'Chrome' && process.env.TRAVIS) {
    configuration.customLaunchers = {
      'chrome-travis-ci': {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    };
    configuration.browsers = ['chrome-travis-ci'];
  }

  config.set(configuration);
};
