  'use strict';

  /**
   * {Factory} HTTPSrv
   * Service factory to manage HTTPRequests in IE
   * TODO: Set up the constants into a separated file
   */
  angular
    .module('trunk')
    .factory('HttpSrv', function($http, $q, UtilsSrv) {
      var self = {};
      var isIE8 = false;
      UtilsSrv.isBrowser(function(name, version) {
        return name === 'msie' && version <= 9;
      }, function($state, utils) {
        isIE8 = true;
      });


      /**
       * @name request
       * @description It's a call wrapper. Performs either 'POST' or 'GET' calls
       *     according to the value setted in the configs param. If method isn't
       *     defined, it passes the request to the $http and lets it determine
       *     how to proceed.
       * @param configs {object} Expects:
       *     method: {string} One of 'POST' or 'GET'
       *     url {string} URL of the service we want to call
       *     params {object} Params to sign the URL
       *     data {Object} Object with the proper data to make the post
       *     responseType {string} If present, one of 'xml' or 'json'
       * @returns {*}
       */
      self.request = function (configs) {
        var deferred = $q.defer();
        if(typeof configs != 'undefined' && configs.hasOwnProperty('method')) {
          var url;
          var data;
          var type;

          if(configs.hasOwnProperty('responseType')) {
            type = configs.responseType;
          } else {
            type = 'default';
          }

          if(configs.hasOwnProperty('url')) {
            url = configs.url;
          }

          if(configs.hasOwnProperty('params')) {
            var params = '';
            angular.forEach(configs.params, function(value, key) {
              params += '&' + key + '=' + value;
            });
            url += '?' + params.substring(1);
          }

          if(configs.hasOwnProperty('data')) {
            data = configs.data;
          }

          if(configs.method == 'POST') {
            self.post(url, data, {'responseType': type}).then(function(response){
              deferred.resolve(response);
            }, function(response) {
              deferred.reject(response);
            });
          } else if (configs.method == 'GET') {
            self.get(url, {'responseType': type}).then(function(response){
              deferred.resolve(response);
            }, function(response) {
              deferred.reject(response);
            });
          }
        } else {
          $http(configs).then(function(response) {
            deferred.resolve(response.data);
          }, function(response) {
            deferred.reject(response.data);
          });
        }
        return deferred.promise;
      };


      /**
       * @name post
       * @description Makes a POST call using the method corresponding to the
       *     browser that makes the call
       * @param url {string} URL of the service we want to call
       * @param data {Object} Object with the proper data to make the post
       * @returns {*}
       */
      self.post = function (url, data, configs) {

        var type;
        if (configs != undefined && configs.responseType != undefined) {
          type = configs.responseType;
        } else {
          type = 'default';
        }
        var deferred = $q.defer();

        /* istanbul ignore if */
        if (isIE8) {
          var xdr = new window.XDomainRequest();
          data = JSON.stringify(data);
          if (xdr) {
            xdr.onerror = function(e) {
              deferred.reject();
            };
            xdr.onprogress = function() {
            };
            xdr.ontimeout = function() {
              deferred.reject();
            };
            //xdr.contentType = "text/plain";
            xdr.onload = function() {
              var response = parseResponse(xdr.responseText, type);
              deferred.resolve(response);
            };
            xdr.timeout = 12000;
            xdr.open('POST', url, true);
            xdr.send(data);
          }
        } else { // If it isn't IE8 or 9, it uses the Angular Provider
          $http.post(url, data)
            .then(function(response) {
              deferred.resolve(response.data);
            }, function(response) {
              deferred.reject(response.data);
            });
        }

        return deferred.promise;
      };


      /* istanbul ignore next */
      var parseResponse = function(response, type) {
        var parsedResponse;
        if (type == 'xml') {
          parsedResponse = $.parseXML(response);
        } else if (type == 'json') {
          if (typeof response != 'object') {
                parsedResponse = JSON.parse(response);
          } else {
            parsedResponse = response;
          }
        } else {
          parsedResponse = response;
        }

        return parsedResponse;
      };


      /**
       * @name get
       * @description Makes a GET call using the method corresponding to the
       *     browser that makes the call
       * @param _url {string} URL of the service we want to call
       * @param _data {Object} Object with the proper data to make the post
       * @returns {*}
       */
      self.get = function (url, configs) {
        var type = '';
        if (configs != undefined && configs.responseType != undefined) {
          type = configs.responseType;
        } else {
          type = 'default';
        }
        var deferred = $q.defer();

        /* istanbul ignore if */
        if (isIE8) {
          var xdr = new window.XDomainRequest();
          if (xdr) {
            xdr.onerror = function() {
              deferred.reject();
            };
            xdr.onprogress = function() {

            };
            xdr.ontimeout = function() {
              deferred.reject();
            };
            //xdr.contentType = "text/plain";
            xdr.onload = function() {
              var response = parseResponse(xdr.responseText, type);
              deferred.resolve(response);
            };
            xdr.timeout = 1200;
            xdr.open('get', url);
            xdr.send();
          }
        } else { // If it isn't IE8 or 9, it uses the Angular Provider
          $http.get(url)
            .then(function(response) {
              deferred.resolve(response.data);
            }, function(response) {
              deferred.reject(response.data);
            });
        }

        return deferred.promise;
      };

      return self;
    });
