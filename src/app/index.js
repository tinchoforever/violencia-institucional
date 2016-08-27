(function () {
  'use strict';

  /**
   * Angular bootstrap configuration
   */
  angular
    .module('trunk', [
      'ngAnimate',
      'ngCookies',
      'ngTouch',
      'ngSanitize',
      'ngResource',
      'ui.router',
      'ui.bootstrap',
      'ng.shims.placeholder'
    ])
    .run(function ($rootScope) {
           $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

             var nav = window.navigator,
               userAgent = nav.userAgent.toLowerCase();

             function isIE() {
               var rv = false, regex;
               regex = new RegExp("(msie |trident/.*rv:)([0-9]{1,}[\.0-9]{0,})");
               rv = regex.exec(userAgent) === null ? rv : parseFloat(RegExp.$2);

               return rv === false ? rv : {
                 name: 'msie',
                 version: rv
               };
             }

             $rootScope.containerClass = toState.containerClass;
             if (isIE()) {
               $rootScope.containerClass += ' isIE';
             }
           });
         })
    .config(function ($stateProvider, $urlRouterProvider) {
              $stateProvider
                .state('home', {
                  url: '/',
                  templateUrl: 'app/main/main.html',
                  controller: 'MainCtrl',
                  containerClass: 'main-index'
                });

              $urlRouterProvider.otherwise('/');
            });
})();
