angular.module('trunk')
  .factory('UserSrv', function($q,ConfigSrv,HttpSrv, $rootScope, $location, ParamsSrv) {

  var self = {};
      self.userData = false;
      self.params = false;

  self.getUserData = function() {
    var deferred = $q.defer();
    if (self.userData == false) {
      var params = '?Session=' + self.params.Session + '&UserName=' + self.params.UserName;
      getSrvUrl('UserAccount/ClientAndTradingAccount' + params).then(function(response) {
        self.userData = response;
        $rootScope.$broadcast('UserSrv::ready');
        deferred.resolve(self.userData);
      }, function(response) {
        deferred.reject(response);
      });
    } else {
      deferred.resolve(self.userData);
    }
    return deferred.promise;
  };


  /**
   * @name srvUrl
   * @description Generic function to make a http POST call obtaining the
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


  /**
   * @name initSessionParameter
   * @description Sets the Session, UN, TA for the current session.
   */
  self.initSessionParameter = function() {
    var params = $location.search();
    if (!self.params) {
      var username = ParamsSrv.UN || ParamsSrv.TA || ParamsSrv.CLC || '';
      var UNFlag = (typeof ParamsSrv.UN == 'undefined') ? false : true;
      self.params = {
        Session: ParamsSrv.SN || '',
        UserName: username,
        TradingAccount: ParamsSrv.TA ? ParamsSrv.TA : '',
        UNIsDefined: UNFlag
      };
    }
    return self.params;
  };


  /**
   * @name getSessionParameter
   * @description Gets the Session, UN, TA for the current session.
   */
  self.getSessionParameter = function() {
    return self.params;
  };


  /**
   * @name setSessionParameter
   * @description Sets the Session, UN, TA for the current session.
   */
  self.setSessionParameter = function(params) {
    if (!self.params) {
      self.params = {};
    }
    angular.forEach(params, function(value, key) {
      self.params[key] = value;
    })
  };

  return self;
});
