'use strict';
describe('Service :: Culture', function() {
  var cultureSrv,
    $httpBackend;

  beforeEach(module('trunk'));

  beforeEach(inject(function(_$httpBackend_, CultureSrv) {
    $httpBackend = _$httpBackend_;
    cultureSrv = CultureSrv;
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

    $httpBackend.whenGET(/.*\/main\.html.*/).respond(200, '<div></div>');    $httpBackend.whenGET(/.*\/brands\.json.*/).respond(200, {
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

    $httpBackend.flush();
  }));

  it(':: getTextDirection', function() {
    expect(cultureSrv.getTextDirection()).toBe('leftToRight');
  });

  describe(':: getCultureId()', function() {
    it('is defined', function() {
      expect(typeof cultureSrv.getCultureId).toBe('function');
    });

    it('is a number', function() {
      expect(typeof cultureSrv.getCultureId()).toBe('number');
    });
  });

  describe(':: getCultureCode()', function() {
    var cultureCode;

    it('is defined', function() {
      expect(typeof cultureSrv.getCultureCode).toBe('function');
    });

    it('is a string of length 2', function() {
      cultureCode = cultureSrv.getCultureCode();
      expect(typeof cultureCode).toBe('string');
      expect(cultureCode.length).toBe(2);
    });
  });

  describe(':: setCulture()', function() {
    var cultureCode, newLang = 'es';

    it('check change', function() {
      cultureSrv.setCulture(newLang);
      cultureCode = cultureSrv.getCultureCode();
      expect(cultureCode).toEqual(newLang);
    });
  });

  describe(':: Special cases', function() {
    var $location;

    it(':: CUID undefined', inject(function($injector) {
      $location = $injector.get('$location');
      spyOn($location, 'search').and.returnValue({ CUID: 'X' });
      expect(cultureSrv.getCultureCode()).toBe('en');
    }));

    //Not Work...
    xit(':: navigator.language null, use navigator.userLanguage', function() {
      navigator.language = false;
      navigator.userLanguage = 'en-US';
      expect(cultureSrv.getCulture().code).toBe('en');
    });
  })
});
