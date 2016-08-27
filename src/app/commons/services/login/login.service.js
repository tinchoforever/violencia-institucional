(function() {
  'use strict';

  /**
   * {Factory} LoginSrv
   * Service factory to login the system
   */
  angular
    .module('trunk')
    .factory('LoginSrv', function(ConfigSrv, HttpSrv) {
      var self = {};

      /**
       * @name login
       * @description POST call to login
       * @param loginData {Object}
       *    {AppVersion {String}, UserName {String},
       *     Password {String}, AppKey {String}}
       * @returns {*}
       */
      self.login = function(loginData) {
        return postSrvUrl('session', loginData);
      };

      /**
       * @name checkSession
       * @description GET call check the validity of a given session
       * @param loginData {Object}
       *    {Session {String}}
       * @returns {*}
       */
      self.checkSession = function(loginData) {
        return getSrvUrl('UserAccount/ClientAndTradingAccount' + loginData);
      };


      /**
       * @name changePassword
       * @description POST call to change the password (forced by the server)
       * @param userData {Object}
       *    {UserName {String}, Password {String}, NewPassword {String}}
       * @returns promise {Object}
       */
      self.changePassword = function(userData) {
        return postSrvUrl('session/changePassword', userData);
      };


      /**
       * @name srvUrl
       * @description Generic function to make a http POST call obtaining the
       *    url from the config srv and then another call to a path provided
       * @param path {String}
       * @param data {Object} Data to POST
       * @returns {*}
       */
      function postSrvUrl(path, data) {
        return ConfigSrv.getKeyValue('SrvUrl').then(function(baseUrl) {
          return HttpSrv.post(baseUrl + path, data, {
            responseType: 'json'
          });
        });
      }


      /**
       * @name srvUrl
       * @description Generic function to make a http GET call obtaining the
       *    url from the config srv and then another call to a path provided
       * @param path {String}
       * @returns {*}
       */
      function getSrvUrl(path) {
        return ConfigSrv.getKeyValue('SrvUrl').then(function(baseUrl) {
          return HttpSrv.get(baseUrl + path, {
            responseType: 'json'
          });
        });
      }

      return self;
    });
})();
