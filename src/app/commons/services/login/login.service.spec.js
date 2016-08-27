'use strict';
describe('Service :: Login', function(){
  beforeEach(module('trunk'));

  describe(':: Login function',function(){
    var httpBackend,injector, loginSrv;
    beforeEach(inject(function ($injector,$httpBackend) {
      httpBackend = $httpBackend;
      injector = $injector;
      loginSrv = injector.get('LoginSrv');
      $httpBackend.whenGET(/.*\/config.*/)
        .respond(
          '<?xml version="1.0" encoding="utf-8"?>' +
          '<flexITP>' +
          '<tradingApiURL>http://tradingapi.com/API</tradingApiURL>' +
          '</flexITP>');

      $httpBackend.whenPOST('https://ciapi.cityindex.com/TradingAPI/session')
          .respond( {
                "Session":"someSession1234",
                "PasswordChangeRequired":true,
                "AllowedAccountOperator":false
             });

        }));

        it('login success', function(){
            loginSrv.login().then(function(){
              expect(data).toBe({
                "Session":"someSession1234",
                "PasswordChangeRequired":true,
                "AllowedAccountOperator":false
              });
            });

        });

        it('login fails', function(){
            //TODO
        });

  })
});