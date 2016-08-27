(function() {
  'use strict';

  describe(':: HttpSrv', function() {
    var $httpBackend, $injector, dummyHttp, $window;
    beforeEach(module('trunk'));
    beforeEach(function() {
      module(function($provide) {
        $window = {
          navigator: {
            userAgent: 'Mozilla/5.0 (Windows NT 6.3; rv:36.0) ' +
            'Gecko/20100101 Firefox/36.0'
          }
        };
        $provide.value('$window', $window);
      });

      inject(function(_$injector_, _$httpBackend_) {
        $injector = _$injector_;
        $httpBackend = _$httpBackend_;
      });

      $httpBackend.whenGET(/.*\/main\.html.*/).respond('<div></div>');
      $httpBackend.whenGET('/dummyGET/true').respond({ get: true });
      $httpBackend.whenPOST('/dummyPOST/true').respond({ post: true });
    });

    it(':: request()', function() {
      var HttpSrv = $injector.get('HttpSrv');
      HttpSrv.request({
        method: 'GET',
        url: '/dummyGET/true'
      }).then(function(res) {
        dummyHttp = res;
      });
      $httpBackend.flush();
      expect(dummyHttp).toEqual({ get: true });

      HttpSrv.request({
        method: 'POST',
        url: '/dummyPOST/true',
        responseType: 'json'
      }).then(function(res) {
        dummyHttp = res;
      });
      $httpBackend.flush();
      expect(dummyHttp).toEqual({ post: true });

      HttpSrv.request({
        url: 'http://test.com'
      });
    });

    it(':: get()', function() {
      var HttpSrv = $injector.get('HttpSrv');
      HttpSrv.get('/dummyGET/true').then(function(res) {
        dummyHttp = res;
      });
      $httpBackend.flush();
      expect(dummyHttp).toEqual({ get: true });
    });

    it(':: post()', function() {
      var HttpSrv = $injector.get('HttpSrv');
      HttpSrv.post('/dummyPOST/true').then(function(res) {
        dummyHttp = res;
      });
      $httpBackend.flush();
      expect(dummyHttp).toEqual({ post: true });
    });

    it(':: get() for IE', function() {
      $window.navigator.userAgent = 'Mozilla/5.0 (compatible; MSIE 8.0; ' +
        'Windows NT 6.1; Trident/4.0; GTB7.4; InfoPath.2; SV1; .NET CLR ' +
        '3.3.69573; WOW64; en-US)';
      var HttpSrv = $injector.get('HttpSrv');

      window.XDomainRequest = function() {
        return {
          open: function() {
          },
          send: function() {
          }
        };
      };
      HttpSrv.get('/dummyGET/true');

      expect(XDomainRequest().open).toEqual(jasmine.any(Function));
      expect(XDomainRequest().send).toEqual(jasmine.any(Function));
    });
  });
})();
