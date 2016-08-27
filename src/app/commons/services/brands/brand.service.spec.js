/**
 @fileoverview Unit testing for the brands settings for the login.
 @author Agustin Diaz
 */
'use strict';
describe('Service :: Brand', function() {
  beforeEach(module('trunk'));
  describe(':: Env param', function() {
    var httpBackend, injector, scope;
    beforeEach(inject(function($rootScope, $injector, $httpBackend) {
      httpBackend = $httpBackend;
      injector = $injector;
      scope = $rootScope.$new();

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
      $httpBackend.whenGET(/.*\/brands\.json.*/)
        .respond({
          "loadingBar": true,
          "skin": null,
          "lgn_footer": "",
          "shell_login_welcome": "",
          "logo": "resources/logos/Barclays_Advantage_Lite.png",
          "pageTitle": "Barclays CFDs and Financial Spread Trading",
          "favicon": "resources/icons/bc-favicon.ico",
          "css": "css/compiledstylew.css",
          "defaultTheme": "light",
          "brandName": "Barclays",
          "needsOperator": false,
          "appKey": "IFE-BRC",
          "hideLangDropdown": true,
          "urlGroup": "barclayslite",
          "supportsIE8": false,
          "allowForcePassword": true
        }
      );
    }));

    it(':: With an incorrect brand should load default', function() {
      var service = injector.get('BrandSrv');
      var brand;
      service.getBrand('notabrand').then(function(_brand) {
        brand = _brand;
        expect(brand.brandName).toBe('Barclays');
      });
      scope.$broadcast('brandReady');
      httpBackend.flush();
    });

    it(':: Checking if the brand has every property', function() {
      var service = injector.get('BrandSrv');
      var brand;
      service.getBrand('cityindexlite').then(function(_brand) {
        brand = _brand;
        expect(Object.keys(brand).length).toBe(19);
      });
      httpBackend.flush();
    })

  })
});

