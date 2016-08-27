'use strict';

describe('Directive :: Theme', function() {

  // load the directive's module
  beforeEach(module('trunk'));

  var element, scope, brandSrv, httpBackend;

  beforeEach(inject(function($rootScope, $httpBackend, BrandSrv) {
    scope = $rootScope.$new();
    httpBackend = $httpBackend;

    $httpBackend.whenGET(/.*\/main\.html.*/).respond('<div></div>');
    $httpBackend.whenGET(/.*\/translations\.json.*/).respond({
      'en': {
        "testKey": "testVal"
      }
    });

    $httpBackend.whenGET(/.*\/brands\.json.*/).respond(
      {
        'cityindexlite': {
          "defaultTheme": "dark",
          "logo": "urllogo"
        }
      }, {
        'barclayslite': {
          "defaultTheme": "light",
          "logo": "urllogo"
        }
      }, {
        'default': {
          "defaultTheme": "light",
          "logo": "urllogo"
        }
      }
    );

    $httpBackend.whenGET(/.*\/url_groups\.json.*/).respond(
      {
        "default": {
          "default": "https://staging.loginandtrade.com/advantagelite/?SN={{sessionId}}&UN={{userName}}&AuthenticationUri={{AuthenticationUri}}&TH={{theme}}&title={{title}}&favicon={{favicon}}",
          "settings": "https://staging.loginandtrade.com/settings/#/?TA={{userName}}&SN={{sessionId}}&CUID={{cultureId}}&TH={{theme}}&UN={{userName}}&showMenu={{showMenu}}&page={{page}}",
          "charts": "https://staging.loginandtrade.com/chartslite/?TA={{userName}}&SN={{sessionId}}&CUID={{cultureId}}&UN={{userName}}{{incomingParams}}",
          "reloadURL": "https://localhost:3000/"
        },
        "cityindexlite": {
          "default": "https://staging.loginandtrade.com/advantagelite/?SN={{sessionId}}&UN={{userName}}&AuthenticationUri={{AuthenticationUri}}&TH={{theme}}&title={{title}}&favicon={{favicon}}",
          "settings": "https://staging.loginandtrade.com/settings/#/?TA={{userName}}&SN={{sessionId}}&CUID={{cultureId}}&TH={{theme}}&UN={{userName}}&showMenu={{showMenu}}&page={{page}}",
          "charts": "https://staging.loginandtrade.com/chartslite/?TA={{userName}}&SN={{sessionId}}&CUID={{cultureId}}&UN={{userName}}{{incomingParams}}",
          "reloadURL": "https://staging.loginandtrade.com/web/cityindexlite/"
        },
        "barclayslite": {
          "default": "https://staging.loginandtrade.com/advantageweb/?Session={{sessionId}}&UserName={{userName}}&AuthenticationUri={{AuthenticationUri}}&TH={{theme}}&title={{title}}&favicon={{favicon}}",
          "settings": "https://staging.loginandtrade.com/settings/#/?TA={{userName}}&SN={{sessionId}}&CUID={{cultureId}}&TH={{theme}}&UN={{userName}}&showMenu={{showMenu}}&page={{page}}",
          "charts": "https://staging.loginandtrade.com/chartslite/?TA={{userName}}&SN={{sessionId}}&CUID={{cultureId}}&UN={{userName}}{{incomingParams}}",
          "reloadURL": "https://staging.loginandtrade.com/web/cityindex/"
        }
      }
    );

    brandSrv = BrandSrv;
  }));

  it(':: Attribute', inject(function($compile) {
    spyOn(brandSrv, 'getBrand').and.returnValue({
      then: function() {
        return { 'default': { 'favicon': 'resources/icons/ci-favicon.ico' } };
      }
    });
    element = angular.element('<div favicon i18n="testKey"></div>');
    element = $compile(element)(scope);
    httpBackend.flush();
    scope.$apply();
    //expect(element.attr('href')).toBe('resources/icons/ci-favicon.ico');
  }));

  it('Add favicon to element with favicon attribute', inject(function($compile, $httpBackend) {
    spyOn(brandSrv, 'getBrand').and.returnValue({
      then: function() {
        return { 'default': { 'favicon': 'resources/icons/ci-favicon.ico' } };
      }
    });
    brandSrv.getBrand('default');

    brandSrv.onReady().then(function(a) {

      element = angular.element('<img favicon></div>');
      element = $compile(element)(scope);
      $httpBackend.flush();

      //scope.$broadcast('brandReady');
      //expect(scope.$broadcast).toHaveBeenCalledWith('brandReady');
      scope.$apply();

      expect(element.attr('href')).toBe('resources/icons/ci-favicon.ico');

    });
  }));
});
