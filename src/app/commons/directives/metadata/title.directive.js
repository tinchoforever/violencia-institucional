'use strict';

/**
 * {Directive} pageTitle
 * Set up the title of the page
 */
angular
  .module('trunk')
  .directive('pageTitle', function(BrandSrv) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        scope.$on('brandReady', function(){
          return element.html(BrandSrv.currentBrand.pageTitle);
        });
      }
    };
});