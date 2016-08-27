(function() {
  'use strict';

  /**
   * {Factory} ConfigSrv
   * Service to bring configuration files
   * TODO: Set up the constants into a separated file
   */
  angular
    .module('trunk')
    .factory('ConfigSrv', function($http, $q, ParamsSrv, UtilsSrv) {
      var self = {
          map: {}
        },
        ready = false,
        pending = [],
        envStr;
        var isIE8 = false;

        UtilsSrv.isBrowser(function(name, version) {
          return name === 'msie' && version <= 8;
        }, function($state, utils) {
          isIE8 = true;
        });

      // TODO: improve this
      if(ParamsSrv.ENV) {
        ParamsSrv.ENV = (ParamsSrv.ENV == 'live' ? 'PROD-INX' : ParamsSrv.ENV);
        envStr = '_' + ParamsSrv.ENV;
      } else {
        envStr = '';
      }

      init();


      /**
       * @name init
       * @description Loads the configuration, validates the browser and
       *              resolves each pending promises.
       */
      function init() {
        $http.get('./configs/config' + envStr + '.json').success(function(configStr) {
          var config = configStr;
          self.map['SrvUrl'] = config.flexITP.tradingApiURL;
          self.map['forgotPasswordURL'] = config.flexITP.forgotPasswordURL;
          ready = true;
          _.each(pending, function(func) {
            func();
          });
        });
      }


      /**
       * @name getKeyValue
       * @description If config file is loaded returns a promise which will
       *              resolve the value if found
       * @param key {String} Key for the xml to bring the correct value
       * @returns {Object} A promise
       */
      self.getKeyValue = function(key) {
        var deferred = $q.defer();
        if(!ready) {
          pending.push(function() {
            deferred.resolve(self.map[key]);
          });
        } else {
          deferred.resolve(self.map[key]);
        }
        return deferred.promise;
      };

      return self;
    });
})();
