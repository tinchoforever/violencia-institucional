'use strict';

describe('Main controller', function() {
  var scope,
    loginForm,
    changePwdForm,
    UtilsSrvMock,
    utilsSrv,
    LoginSrvMock,
    loginType,
    controller,
    $httpBackend,
    currentBrand,
    BrandSrv,
    cookies,
    TranslateSrvMock,
    translateSrv;

  LoginSrvMock = function(type) {
    switch(type) {
      case 'success':
        loginType = function() {
          return {
            then: function(callback) {
              callback('success');
            }
          }
        };
        break;
      case 'error':
        loginType = function() {
          return {
            then: function(callbackError) {
              callbackError();
            }
          }
        };
        break;
    }

    var obj = {
      login: loginType,
      changePassword: function() {
        return {
          then: function(callback) {
            return callback({
              IsPasswordChanged: true
            });
          }
        }
      }
    };

    return obj;
  };

  TranslateSrvMock = {
    _: function() {},
    loadTranslateMap: function() {
      return {
        then: function(callback) {
          callback();
        }
      }
    }
  };

  beforeEach(module('trunk'));

  describe(':: Login function', function() {

    beforeEach(inject(function($rootScope, $q, $controller, UtilsSrv, $injector, BrandSrv, $cookies) {
      scope = $rootScope.$new();
      cookies = $cookies;
      utilsSrv = UtilsSrv;
      translateSrv = TranslateSrvMock;
      controller = $controller('MainCtrl', {
        $scope: scope,
        LoginSrv: LoginSrvMock('success'),
        UtilsSrv: utilsSrv
      });
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.whenGET(/.*\/config.*/)
        .respond('');
      $httpBackend.whenGET(/.*\/main.*/)
        .respond('');
    }));

    loginForm = {
      $submitted: false
    };

    it(':: Logs OK', inject(function($controller) {

      var data = {
        'userName': 'devices@test.com',
        'sessionId': 'someSession1234',
        'currentBrand': {
          'reloadUrl': 'https://www.someUrl.com',
          'pageTitle': 'someTitle',
          'favIcon': 'resources/icons/someFavIcon',
          'appKey': 'IFE',
          'skin': {
            "color": "0x246FA2",
            "bgColor": "0xEEEDED",
            "loadingBarColor": "0x246FA2",
            "loadingBarBorderColor": "0xDCD9D9"
          },
        },
        'defaultTheme' : 'dark',
        'redirectUrl' : 'http://www.google.com/SN={1}'
      };
      var redirect = false;
      utilsSrv.formatUrl = function() {};
      scope.redirectBranded = function() {
        redirect = true;
      };
      scope.brand = data;
      scope.loginData.username = 'test@devices.com';
      scope.$digest();
      scope.login(loginForm);
      expect(scope.loading).toBe(true);
      expect(redirect).toBe(true);

    }));

    describe(':: formSwitch', function() {
      it(':: function', function() {
        scope.loginFailed = true;
        scope.formSwitch('login', loginForm);
        expect(scope.loginFailed).toBe(false);
      });
    });

    describe(':: Reset', function() {
      it(':: function', function() {
        scope.loginData.username = 'dm348630';
        scope.loginData.password = 'password';
        scope.reset('login');
        expect(scope.loginData.username).toBe('');
        expect(scope.loginData.username).toBe('');
      });
    });

    describe(':: RememberMe function', function() {
      it(':: true', function() {
        scope.loginData.rememberMe = true;
        scope.loginData.username = 'dm348630';
        scope.rememberMe();
        expect(cookies.ifeusername).toBe('dm348630');
        expect(cookies.iferememberme).toBe(true);
      });
      it(':: false', function() {
        scope.loginData.rememberMe = false;
        scope.loginData.username = 'dm348630';
        scope.rememberMe();
        expect(cookies.ifeusername).toBe('');
        expect(cookies.iferememberme).toBe('');
      });
    });
  });


  describe(':: Force change password', function() {
    beforeEach(inject(function($rootScope, $q, $controller, UtilsSrv) {
      scope = $rootScope.$new();
      utilsSrv = UtilsSrv;
      controller = $controller('MainCtrl', {
        $scope: scope,
        LoginSrv: LoginSrvMock('success'),
        UtilsSrv: utilsSrv,
        TranslateSrv: TranslateSrvMock
      });
    }));

    it(':: changePassword() :: success', function() {
      changePwdForm = {
        $submitted: false,
        oldPassword: {
          $modelValue: 'password'
        },
        newPassword: {
          $modelValue: 'password1'
        },
        reNewPassword: {
          $modelValue: 'password1'
        }
      };
      scope.loginData = {
        username: 'devices@test.com',
        oldPassword: 'password',
        newPassword: 'password1'
      };

      scope.changePassword(changePwdForm);
      expect(scope.loading).toBe(false);
      expect(scope.pwdSuccessChanged).toBe(true);
    });

    it(':: changePassword() :: error', function() {
      changePwdForm = {
        $submitted: false,
        oldPassword: {
          $modelValue: 'password'
        },
        newPassword: {
          $modelValue: 'password1'
        },
        reNewPassword: {
          $modelValue: 'password2'
        }
      };

      scope.changePassword(changePwdForm);
      expect(scope.loading).toBe(false);
      expect(scope.pwdSuccessChanged).toBe(false);
    });
  });


});
