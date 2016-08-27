(function() {
  'use strict';

  /**
   * {Factory} UtilsSrv
   * @fileOverview Service utils and helpers
   */
  angular
    .module('trunk')
    .factory('UtilsSrv', function($location, $log, $state, $window) {
      var self = {},
        currentNav;

      /**
       * @name isBrowser
       * @description Executes some function when the condition is true
       * @param condition {Function}
       * @param fn {Function}
       * @returns {*}
       */
      self.isBrowser = function(condition, fn) {
        var name = self.navigator().getName(),
            version = self.navigator().getVersion();

        return condition(name, version, self) ? fn($state, self) : false;
      };


      /**
       * @name navigator
       * @description Mod for $window.navigator adding support to identify
       *              the browser
       * @returns {Object}
       */
      self.navigator = function() {
        var nav = $window.navigator,
          userAgent = nav.userAgent.toLowerCase();

        // Initializer
        (function init() {
          if(currentNav === undefined) {
            currentNav = chrome() || firefox() || ie();
          }
        })();

        // Internet Explorer
        function ie(version) {
          var rv = false, regex;
          regex = new RegExp("(msie |trident/.*rv:)([0-9]{1,}[\.0-9]{0,})");
          rv = regex.exec(userAgent) === null ? rv : parseFloat(RegExp.$2);

          if(rv !== false &&
            angular.isDefined(version) &&
            angular.isNumber(version)
          ) {
            rv = version === rv ? rv : false;
          }

          return rv === false ? rv : {
            name: 'msie',
            version: rv
          };
        }
        // Chrome
        function chrome() {
          return (
            /chrome|chromium/.test(userAgent) &&
            /google inc/i.test(nav.vendor)
          ) ? {
            name: 'chrome',
            version: parseInt(userAgent.split('chrome/')[1])
          } : false;
        }
        // Firefox
        function firefox() {
          return userAgent.indexOf('firefox') !== -1 ? {
            name: 'firefox',
            version: parseInt(userAgent.split('firefox/')[1])
          } : false;
        }

        return {
          isIE: ie,
          isChrome: chrome,
          isFirefox: firefox,
          get: function() {
            return currentNav || {
              name: 'unknown',
              version: -1
            };
          },
          getName: function() {
            return this.get().name;
          },
          getVersion: function() {
            return this.get().version;
          }
        };
      };


      /**
       * @name formatUrl
       * @description Replace vars in string with params
       * @param urls {Object,String} With URL(s)
       * @param params {Array} Params to replace
       * @return {String}
       */
      self.formatUrl = function(urls, params) {
        var _default = 'default',
            page = self.location().queryString('page'),
            strUrl = typeof urls === 'string' ? urls : '',
            replaceWith;

        if(_.isObject(urls)) {
          if(urls.hasOwnProperty(page)) {
            strUrl = urls[page];
          } else {
            strUrl = urls[_default];
            $log.warn('Page:', page, 'not found. Redirecting to', _default);
          }
        } else {
          /* istanbul ignore else */
          if(urls !== strUrl) {
            throw 'UtilsSrv.formatUrl() :: urls should be an object or string';
          }
        }

        // Encode URI components
        var skipParam = ['INCOMINGPARAMS'];
        _.each(params, function(value, key) {
          if(_.indexOf(skipParam, key.toUpperCase()) == -1) {
            params[key] = encodeURIComponent(value);
          }
        });

        // Set {{param}} interpolation
        _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
        replaceWith = _.template(strUrl);

        return replaceWith(params);
      };


      /**
       * @name prepareString
       * @description Replace vars in string with params
       * @param str {String} Base string
       * @param params {Array} Params to replace
       * @return {String}
       */
      self.prepareString = function(str, params) {
        str = typeof str === 'string' ? str : '';
        _.each(params, function(param, i) {
          str = str.replace('{'+ i +'}', '' + param);
        });
        return str;
      };


      /**
       * @name getCorrectBrand
       * @description Gets the correct brand based on the current dir or in the
       *    subdomain used.
       * @return {String} Correct brand.
       */
       self.getCorrectBrand = function() {
        var whiteList = [
          'staging',
          'trade',
          'advantagelite',
          'advantageweb',
          'ciapi',
          'ciapipreprod',
          'ciapiqat',
          'localhost',
          'lite'
        ];

        // We grab the first subdomain.
        var host = $location.host().split('.');
        // Sometimes we have the environment also so we need to split that too.
        host = host[0].split('-');
        if (!_.includes(whiteList, host[0])) {
          return host[0];
        } else {
          return self.location().getCurrentDir();
        }

      };


      /**
       * @name location
       * @description Mod for $window.location
       * @returns {Object}
       */
      self.location = function() {
        var loc = $window.location;

        /**
         * @name setProtocol
         * @description Will set a given protocol by redirecting
         * @param np {String}
         */
        function setProtocol(np) {
          var cp = loc.protocol.replace(':', '');
          /* istanbul ignore else */
          if(cp !== np) {
            $window.location.href = np + loc.href.substring(cp.length);
          }
        }


        /**
         * @name queryString
         * @description Get the query string or finds some key
         *  Usage:
         *    UtilsSrv.location().queryString() - All params or empty object
         *    UtilsSrv.location().queryString('param') - One param or false
         * @param key {String}
         * @returns {*}
         */
        function queryString(key) {
          var query = {},
            qsSearch = $window.location.search.substr(1).split('&'),
            ngSearch = $location.search();

          key = key === undefined ? key : key.toUpperCase();

          /**
           * Will cast the value
           * true|false -> bool
           * numbers -> int
           */
          var cast = function(value) {
            value = isNaN(+value) || value === '' ? value : +value;
            if(_.includes(['true', 'false'], value)) {
              value = value === 'true';
            }
            return value;
          };

          // First check url query string
          _.each(qsSearch, function(value, key, all) {
            var param = value.split('='),
                pKey = param[0] || '';

            if(!!pKey.replace(/^\s+|\s+$/g, '')) {
              var pValue = param[1] || '';
              // Check for last element and trim last slash if exists
              if(key === all.length - 1) {
                pValue = pValue.replace(/\/$/, '');
              }
              query[pKey.toUpperCase()] = cast(pValue);
            }
          });

          // Merge url query params params to hash query params
          _.each(ngSearch, function(value, key) {
            query[key.toUpperCase()] = cast(value);
          });

          return key === undefined ? query : (
            query.hasOwnProperty(key) ? query[key] : false
          );
        }


        /**
         * @name getCurrentDir
         * @description Gets current document path
         *              and returns the current directory.
         * @return {String}
         */
        function getCurrentDir() {
          var d = loc.pathname;
          d = d.toLowerCase();
          d = d.split('/');
          d = _.without(d, '');
          d = d.pop();

          return d || 'default';
        }

        return {
          queryString: queryString,
          getCurrentDir: getCurrentDir,
          setProtocol: setProtocol
        };
      };

      return self;
    });
})();
