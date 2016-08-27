/*
angular.module('myDirectives', []).directive('keypressEvents', [
    '$document',
    '$rootScope',
    function($document, $rootScope) {
        return {
            restrict: 'A',
            link: function() {
                $document.bind('keypress', function(e) {
                    console.log('Got keypress:', e.which);
                    $rootScope.$broadcast('keypress', e);
                    $rootScope.$broadcast('keypress:' + e.which, e);
                });
            }
        };
    }
]);
*/
(function () {

    'use strict';

    /** @ngInject */
    function keypress($document, $rootScope, BrandSrv, ParamsSrv) {
        var secret_active = false;
        var directive = {
            restrict: 'A',
            link: function () {
                var secret_keys = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65], secret_index = 0;
                $document.unbind('keydown')
                    .bind('keydown', function (e) {
                        if (e.target.tagName == 'INPUT') return;
                        var key = e.which;
                        console.log(key);
                        if (key === secret_keys[secret_index++]) {
                            if (secret_index === secret_keys.length && ParamsSrv.SC == 'true') {
                                secretKey();
                                secret_index = 0;
                            }
                        } else {
                            secret_index = 0;
                        }
                    });
            }
        };
        function secretKey() {
            if (secret_active) {
            } else {
                /*secret_active = true;
                console.log(BrandSrv.currentBrand.reloadURL);
                angular.element('body').css({
                    background: '#FF00BF',
                    color: '#fff'
                });
                document.title = 'Branded Login: Unicorn Style'
                angular.element('.brand-logo')
                        .attr('src', 'resources/logos/un.png')
                        .attr('ng-src', 'resources/logos/un.png')
                        .css({    
                            'position': 'fixed',
                            'height': '170px',
                            'max-height': '170px'
                        });
                angular.element('.rememberBtn span').html('Remember my rainbow');
                angular.element('.forgotPwd').html('Forgot colors?');
                angular.element('footer div p span').html('Unicorn');
                angular.element('span, button[type=button]').css({
                    color: '#fff'
                });
                angular.element('input[type=text],input[type=password]').css({
                    background: '#FF00FF',
                    border: '1px solid #8A0868',
                    color: '#000'
                });
                angular.element('button[type=submit]').css({
                    background: '#9A2EFE',
                    border: '1px solid #4B088A',
                    color: '#000'
                }).html('Taste the rainbow!');
                angular.element('body').append('<span style="display:inline-block; width: 100%; text-align: center;" class="rainbow">Amar is love</span>')
                */
            }
        }


        return directive;
    }

    angular
        .module('trunk')
        .directive('keypressEvents', keypress);

})();
