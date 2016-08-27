'use strict';

/**
 * {Directive} favicon
 * Set up the favicon of the page
 */
angular
  .module('trunk')
  .directive('optiveScript', function(BrandSrv) {

    return {
      restrict: "EA",
      link: function(scope, element) {
        var scriptLoaded = false;
        scope.$on('brandReady', function(){
          if (!scriptLoaded) {
            var scriptTag = angular.element(
              document.createElement("script"));
            scriptTag.attr('src', 'https://cdn.optimizely.com/js/' + BrandSrv.currentBrand.optimizelyKey.toString() + '.js');
            element.append(scriptTag);
            scriptLoaded = true;
          }
        });
      }
    };
  });
