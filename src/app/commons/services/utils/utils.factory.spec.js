describe(':: UtilsSrv', function() {

  var $window, service, $location;
  beforeEach(module('trunk'));

  beforeEach(function() {
    module(function($provide) {
      $window = {
        location: {
          protocol: 'http:',
          href: 'http://www.test.com',
          pathname: '/',
          search: ''
        },
        navigator: {
          userAgent: 'unknown'
        }
      };
      $location = {
        url: function() {
          return $window.location.href
        },
        search: function() {
          return {
            FOO: 1,
            bar: 'a'
          }
        }
      };
      $provide.value('$window', $window);
      $provide.value('$location', $location)
    });
    inject(function($injector) {
      service = $injector.get('UtilsSrv');
    });
  });

  it(':: isBrowser()', function() {
    // IE 8
    $window.navigator.userAgent = 'Mozilla/5.0 (compatible; MSIE 8.0; ' +
      'Windows NT 6.1; Trident/4.0; GTB7.4; InfoPath.2; SV1; .NET CLR ' +
      '3.3.69573; WOW64; en-US)';

    var isIE8 = false;

    service.isBrowser(function(name, version) {
      return name === 'msie' && version === 8;
    }, function() {
      isIE8 = true;
    });

    expect(typeof service.isBrowser).toEqual('function');
    expect(isIE8).toBe(true);
  });


  it(':: formatUrl()', function() {
    var objUrl = {
      default: 'http://test.com/?a={{a}}&b={{b}}'
    };

    expect(typeof service.formatUrl).toEqual('function');

    expect(service.formatUrl(objUrl, {
      a: 'foo',
      b: 'bar xzy'
    })).toEqual('http://test.com/?a=foo&b=bar%20xzy');

    expect(service.formatUrl('Hello {{name}}', {
      name: 'John'
    })).toEqual('Hello John');

    expect(function() { service.formatUrl(1, {}); })
      .toThrow('UtilsSrv.formatUrl() :: urls should be an object or string');

    expect(service.formatUrl('Hey {{url}}', {
      'url': 'https://test.com/docs?foo=á#bar&!'
    })).toEqual('Hey https%3A%2F%2Ftest.com%2Fdocs%3Ffoo%3D%C3%A1%23bar%26!');
  });


  it(':: formatUrl() with valid config', function() {
    // browser url
    $window.location.search = '?page=userSection';
    // brands.json
    objUrl = { userSection: 'http://test.com/?user={{username}}' };

    expect(service.formatUrl(objUrl, {
      username: 'foo'
    }), 'http://test.com/?user=foo');
  });


  it(':: prepareString()', function() {
    var string = 'Hello {0} {1}',
        p1 = ['John', 'Doe'],
        p2 = ['Foo', undefined],
        p3 = ['Bar'];

    expect(service.prepareString(string, p1)).toEqual('Hello John Doe');
    expect(service.prepareString(string, p2)).toEqual('Hello Foo undefined');
    expect(service.prepareString(string, p3)).toEqual('Hello Bar {1}');
    expect(service.prepareString(undefined, [])).toEqual('');
  });


  describe(':: navigator()', function() {
    it(':: Commons', function() {
      expect(typeof service.navigator).toEqual('function');
      expect(typeof service.navigator().isIE).toEqual('function');
      expect(typeof service.navigator().isChrome).toEqual('function');
      expect(typeof service.navigator().isFirefox).toEqual('function');
      expect(typeof service.navigator().get).toEqual('function');
      expect(typeof service.navigator().getName).toEqual('function');
      expect(typeof service.navigator().getVersion).toEqual('function');
    });


    it(':: IE 11', function() {
      $window.navigator.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64; ' +
        'Trident/7.0; AS; rv:11.0) like Gecko';
      var mock = {
        name: 'msie',
        version: 11
      };
      expect(service.navigator().isIE()).toEqual(mock);
      expect(service.navigator().isIE(11)).toEqual(mock);
      expect(!!service.navigator().isIE(11)).toBe(true);
      expect(service.navigator().isIE(10)).toBe(false);
      expect(service.navigator().get()).toEqual(mock);
      expect(service.navigator().getName()).toEqual('msie');
      expect(service.navigator().getVersion()).toEqual(11);
      expect(service.navigator().isChrome()).toBe(false);
      expect(service.navigator().isFirefox()).toBe(false);
    });


    it(':: IE 10', function() {
      $window.navigator.userAgent = 'Mozilla/5.0 (compatible; MSIE 10.0; ' +
        'Windows NT 6.1; WOW64; Trident/6.0)';
      var mock = {
        name: 'msie',
        version: 10
      };
      expect(service.navigator().isIE()).toEqual(mock);
      expect(service.navigator().isIE(10)).toEqual(mock);
      expect(!!service.navigator().isIE(10)).toBe(true);
      expect(service.navigator().isIE(9)).toBe(false);
      expect(service.navigator().get()).toEqual(mock);
      expect(service.navigator().getName()).toEqual('msie');
      expect(service.navigator().getVersion()).toEqual(10);
      expect(service.navigator().isChrome()).toBe(false);
      expect(service.navigator().isFirefox()).toBe(false);
    });


    it(':: IE 9', function() {
      $window.navigator.userAgent = 'Mozilla/5.0 (Windows; U; MSIE 9.0; ' +
        'WIndows NT 9.0; en-US))';
      var mock = {
        name: 'msie',
        version: 9
      };
      expect(service.navigator().isIE()).toEqual(mock);
      expect(service.navigator().isIE(9)).toEqual(mock);
      expect(!!service.navigator().isIE(9)).toBe(true);
      expect(service.navigator().isIE(8)).toBe(false);
      expect(service.navigator().get()).toEqual(mock);
      expect(service.navigator().getName()).toEqual('msie');
      expect(service.navigator().getVersion()).toEqual(9);
      expect(service.navigator().isChrome()).toBe(false);
      expect(service.navigator().isFirefox()).toBe(false);
    });


    it(':: IE 8', function() {
      $window.navigator.userAgent = 'Mozilla/5.0 (compatible; MSIE 8.0; ' +
        'Windows NT 6.1; Trident/4.0; GTB7.4; InfoPath.2; SV1; .NET CLR ' +
        '3.3.69573; WOW64; en-US)';
      var mock = {
        name: 'msie',
        version: 8
      };
      expect(service.navigator().isIE()).toEqual(mock);
      expect(service.navigator().isIE(8)).toEqual(mock);
      expect(!!service.navigator().isIE(8)).toBe(true);
      expect(service.navigator().isIE(7)).toBe(false);
      expect(service.navigator().get()).toEqual(mock);
      expect(service.navigator().getName()).toEqual('msie');
      expect(service.navigator().getVersion()).toEqual(8);
      expect(service.navigator().isChrome()).toBe(false);
      expect(service.navigator().isFirefox()).toBe(false);
    });


    it(':: Chrome v41', function() {
      $window.navigator.userAgent = 'Mozilla/5.0 (Windows NT 6.1) Apple' +
        'WebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
      $window.navigator.vendor = 'Google Inc.';
      var mock = {
        name: 'chrome',
        version: 41
      };
      expect(service.navigator().isChrome()).toEqual(mock);
      expect(service.navigator().get()).toEqual(mock);
      expect(service.navigator().getName()).toEqual('chrome');
      expect(service.navigator().getVersion()).toEqual(41);
      expect(service.navigator().isIE()).toBe(false);
      expect(service.navigator().isFirefox()).toBe(false);
    });


    it(':: Firefox v36', function() {
      $window.navigator.userAgent = 'Mozilla/5.0 (Windows NT 6.3; rv:36.0) ' +
        'Gecko/20100101 Firefox/36.0';
      var mock = {
        name: 'firefox',
        version: 36
      };
      expect(service.navigator().isFirefox()).toEqual(mock);
      expect(service.navigator().get()).toEqual(mock);
      expect(service.navigator().getName()).toEqual('firefox');
      expect(service.navigator().getVersion()).toEqual(36);
      expect(service.navigator().isIE()).toBe(false);
      expect(service.navigator().isChrome()).toBe(false);
    });
  });

  describe(':: location()', function() {
    it(':: Commons', function() {
      expect(typeof service.location).toEqual('function');
      expect(typeof service.location().setProtocol).toEqual('function');
      expect(typeof service.location().queryString).toEqual('function');
      expect(typeof service.location().getCurrentDir).toEqual('function');
    });

    it(':: setProtocol()', function() {
      service.location().setProtocol('https');
      expect($window.location.href).toEqual('https://www.test.com');
    });

    it(':: HASH queryString()', function() {
      // '' : undefined -> no!
      expect(service.location().queryString()).toEqual({FOO: 1, BAR: 'a'});
      expect(service.location().queryString('FOO')).toEqual(1);
      expect(service.location().queryString('BAR')).toEqual('a');
    });

    it(':: URL queryString()', function() {
      // www.test.com/index.html?CUID=162&C=UTF-8#/?foo=1&bar=a
      $window.location.search = '?CUID=162&C=UTF-8&bool=true&empty=';

      expect(service.location().queryString()).toEqual({
        CUID:162, C:'UTF-8', FOO: 1, BAR: 'a', BOOL: true, EMPTY: ''
      });
      expect(service.location().queryString('CUID')).toEqual(162);
      expect(service.location().queryString('c')).toEqual('UTF-8');
      expect(service.location().queryString('bool')).toBe(true);
      expect(service.location().queryString('EMptY')).toEqual('');
    });

    it(':: getCurrentDir()', function() {
      expect(service.location().getCurrentDir()).toEqual('default');

      $window.location.pathname = '////a/b/c/d///1////cityINDEX///';
      expect(service.location().getCurrentDir()).toEqual('cityindex');

      $window.location.pathname = 'test/brandedlogin/DO23/v4/';
      expect(service.location().getCurrentDir()).toEqual('v4');
    });
  });
});
