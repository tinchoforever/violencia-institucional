'use strict';

describe('Service :: User', function(){
  var service;

  beforeEach(module('trunk'));

  describe(':: getUserData()',function(){
    var httpBackend,injector;
    beforeEach(inject(function(_UserSrv_, $injector, $httpBackend) {
      httpBackend = $httpBackend;
      service = _UserSrv_;
      injector = $injector;
      httpBackend.expectGET(/.*config.json.*/).respond({
        "flexITP": {
          "tradingApiURL" : "https://ciapiqat.cityindextest9.co.uk/tradingapi/"
        }
      });
      httpBackend.expectGET(/.*main.html.*/).respond('<html></html>');
    }));

    it(':: Success',function(){
      httpBackend.expectGET(/.*UserAccount\/ClientAndTradingAccount.*/).respond({});
      var user;
      service.getUserData().then(function(_user){
        user = _user;
      });
      httpBackend.flush();
      expect(user).toEqual({});
    });

    it(':: Cached',function(done){
      httpBackend.expectGET(/.*UserAccount\/ClientAndTradingAccount.*/).respond({'call': 'first'});
      var user;
      service.getUserData().then(function(_user){
        user = _user;
        service.getUserData().then(function(_user){
          user = _user;
          expect(user.call).toBe('first');
          done();
        });
      });
      httpBackend.flush();
    });

    it(':: Error',function(done){
      httpBackend.expectGET(/.*UserAccount\/ClientAndTradingAccount.*/).respond(401,'');
      var user;
      service.getUserData().then(function(){},function(){
        done();
      });
      httpBackend.flush();
    });
  });

  var newName = 'test';
  describe(':: SessionParams',function(done){
    it(':: initSessionParameter ', function () {
      service.initSessionParameter();
      expect(service.params.UserName).toBe('');
    });

    it(':: setSessionParameter ', function () {
      service.setSessionParameter({'UserName': newName});
      expect(service.params.UserName).toBe(newName);
    });

    it(':: getSessionParameter ', function () {
      service.setSessionParameter({'UserName': newName});
      var test = service.getSessionParameter();
    expect(test.UserName).toBe(newName);
  });
  });
  xdescribe(':: updatePassword()',function(done){
    var $httpBackend;
    beforeEach(inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
    }));
    it(':: Success',function(){
      $httpBackend.expectPOST(/.*session\/changePassword.*/).respond({});
      service.updatePassword('a','a').then(done);
      $httpBackend.flush();
    })
  })

  xdescribe(':: updateEmail()',function(done){
    var $httpBackend;
    beforeEach(inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
    }));
    it(':: Success',function(){
      $httpBackend.expectPOST(/.*userAccount\/save.*/).respond({});
      service.updateEmail('a').then(done);
      $httpBackend.flush();
    })
  })
});
