'use strict';

describe('Directive :: i18n', function() {

  // load the directive's module
  beforeEach(module('trunk'));

  var scope, translateSrv, httpBackend, cultureSrv;

  beforeEach(inject(function($rootScope, $httpBackend, TranslateSrv, CultureSrv) {
    scope = $rootScope.$new();
    translateSrv = TranslateSrv;
    cultureSrv = CultureSrv;
    httpBackend = $httpBackend;
    translateSrv.loadTranslateMap();
    $httpBackend.whenGET(/.*\/translations\.json.*/).respond({
      'en': {
        "testKey": "testVal"
      }
    });

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

    $httpBackend.whenGET(/.*\/main\.html.*/).respond('<div></div>');
    $httpBackend.whenGET(/.*\/brands\.json.*/).respond(200, {
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

  it('Key translated', inject(function($compile) {
    spyOn(cultureSrv, 'getCultureCode').and.returnValue('en');
    httpBackend.flush();
    scope.$apply();
    expect(translateSrv._('testKey')).toBe('testVal');
  }));


});
