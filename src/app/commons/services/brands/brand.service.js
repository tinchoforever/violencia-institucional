(function() {
  'use strict';

  /**
   * {Factory} BrandSrv
   * Manages the brands settings for the login.
   * TODO: Set up the constants into a separated file
   */
  angular
    .module('trunk')
    .factory('BrandSrv', function($q, $http, $rootScope, ParamsSrv) {
      var self = {},
        readyBrand = false,
        readyUrls = false,
        pending = [],
        envStr;

      init();


      function setEnv() {
        /* istanbul ignore if */
        if (ParamsSrv.ENV) {
          ParamsSrv.ENV = (ParamsSrv.ENV == 'live' ?
            'PROD-INX' :
            ParamsSrv.ENV);
          envStr = '_' + ParamsSrv.ENV;
        } else {
          envStr = '';
        }
      }

      /**
       * @name init
       * @description Get the brands json
       */
      function init() {
        loadUrlGroups();
        $http.get('./configs/brands.json').success(function(brands) {
          self.brands = brands;
          readyBrand = true;
          if (readyUrls) {
            _.each(pending, function(func) {
              func();
            });
          }
          /* istanbul ignore next */
        }).error(function() {
          throw {
            error: 'Could not load brands.json'
          };
        });
      }


      /**
       * @name loadUrlGroups
       * @description Load the group urls json.
       */
      function loadUrlGroups() {
        setEnv();
        $http.get('./configs/url_groups' + envStr + '.json').success(function(groups) {
          self.urlGroups = groups;
          readyUrls = true;
          if (readyBrand) {
            _.each(pending, function(func) {
              func();
            });
          }
          /* istanbul ignore next */
        }).error(function() {
          throw {
            error: 'Could not load url_groups.json'
          };
        });
      }


      /**
       * @name getTheme
       * @description Get theme string
       * @returns {String}
       */
      self.getTheme = function() {
        return self.currentBrand.defaultTheme;
      };


      /**
       * @name onReady
       * @description Will fire the event when the translation service is
       *              ready and will return a promise object
       * @returns {Object}
       * TODO: improve
       */
      self.onReady = function() {
        var deferred = $q.defer();
        if (readyUrls && readyBrand) {
          deferred.resolve(true);
        } else {
          $rootScope.$on('brandReady', function() {
            deferred.resolve(true);
          });
        }

        return deferred.promise;
      };


      /**
       * @name addUrlToBrand
       * @description Creates the relationship between a brand an url group.
       */
      var addUrlToBrand = function(brand) {
        if (!self.brands.resolved) {
          self.brands.reloadURL = self.urlGroups[brand].reloadURL;
          self.brands.redirectUrl = self.urlGroups[brand];
          self.brands.favicon =
            self.urlGroups[brand].reloadURL + self.brands.favicon;
          self.brands.resolved = true;
        }
      };


      /**
       * @name resolveBrand
       * @description Resolve which brand will be uses.
       */
      var resolveBrand = function(key, deferred) {
        key = key.toLowerCase();
        if (typeof self.brands == 'object') {
          addUrlToBrand(self.brands.urlGroup);
          self.currentBrand = self.brands;
          deferred.resolve(self.brands);
          $rootScope.$broadcast('brandReady');
        }
      };


      /**
       * @name getBrand
       * @description Get the brand according to a key
       * @param key {String} Brand name to be returned
       * @returns {Object} Promise with the brand information
       */
      /* istanbul ignore else */
      self.getBrand = function(key) {
        var deferred = $q.defer();
        if (!readyBrand || !readyUrls) {
          pending.push(function() {
            resolveBrand(key, deferred);
          });
        } else {
          resolveBrand(key, deferred);
        }
        return deferred.promise;
      };

      return self;
    });
})();
