'use strict';

describe('Directive :: Theme', function () {

  // load the directive's module
  beforeEach(module('trunk'));

  var element,scope,brandSrv, rootScope;

  beforeEach(inject(function ($injector, $httpBackend, BrandSrv) {
    rootScope = $injector.get('$rootScope');
    spyOn(rootScope, '$broadcast').and.callThrough();
    scope = rootScope.$new();
    spyOn(rootScope, '$on').and.callFake(function(event, callback) {
      callback();
    });
    var data = {
      'pageTitle': 'Cityindex'
    };
    BrandSrv.currentBrand = data;

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
            'cityindexlite': {
              'pageTitle': 'Cityindex'
            }
          });
    brandSrv = BrandSrv;
  }));

  it('Add title to element with pageTitle attribute', inject(function ($compile, $httpBackend) {
      element = angular.element('<div page-title></div>');
      element = $compile(element)(scope);
      $httpBackend.flush();
      scope.$apply();

      expect(element.html()).toBe('Cityindex');

  }));
});
