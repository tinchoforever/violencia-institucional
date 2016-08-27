'use strict';

/**
 * {Directive} favicon
 * Set up the favicon of the page
 */
angular
  .module('trunk')
  .directive('favicon', function(BrandSrv) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        scope.$on('brandReady', function(){
          return element.attr('href', BrandSrv.currentBrand.favicon);
        });
      }
    };
});