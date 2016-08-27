(function () {
  'use strict';

  /**
   * {Factory} TranslateSrv
   * Translation service
   * TODO: Remove the $log
   * TODO: Set up the constants in a separated file
   * TODO: perform TODOs
   */
  angular
    .module('trunk')
    .factory('TranslateSrv', function ($q, CultureSrv, $http, $rootScope, $log) {
               var self = {},
                 pending = [],
                 ready = false;

               init();


               /**
                * @name init
                * @description Load the initial translations
                */
               function init() {
                 $http.get('./configs/translations.json').success(function (i18n) {
                   getBrandTranslation().then(function(brand) {
                     self.map = _.merge(i18n, brand);
                     ready = true;
                     _.each(pending, function (func) {
                       func();
                     });
                   });
                 }).error(function () {
                   throw {
                     error: 'Could not load translations.json'
                   };
                 });
               }


               /**
                * @name getBrandTranslation
                * @description Load the brand translations
                */
               function getBrandTranslation() {
                 var deferred = $q.defer();

                 $http.get('./configs/brands.translations.json').success(function (data) {
                   deferred.resolve(data);
                 }).error(function () {
                   deferred.resolve({});
                 });

                 return deferred.promise;
               }

               // -- Private methods -- //

               /**
                * @private
                * @name parseTranslationMap
                * @description Parse the map translation
                * @param array
                * FIXME: We aren't using this yet
                */
               function _parseTranslationMap(array) {
                 var _translation_map = {};

                 _.each(array, function (value) {
                   if (typeof _translation_map[value.Key] != 'undefined') {
                     $log.error('_parseTranslationMap', value.Key, 'duplicated');
                   }
                   _translation_map[value.Key] = value.Value;
                 });

                 self.parsed_translation_map = angular.extend(_translation_map, {});
               }


               /**
                * @private
                * @name readyTranslate
                * @description Set the flag ready to true
                */
               function _readyTranslate() {
                 ready = true;
                 $rootScope.$broadcast('translateSrv::ready');

                 if (! $rootScope.$$phase) {
                   $rootScope.$apply();
                 }
               }


               // -- Public methods -- //

               /**
                * @name onReady
                * @description Will fire the event when the translation service
                *     is ready and will return a promise object
                * @returns {Object}
                * TODO: improve
                */
               self.onReady = function () {
                 var deferred = $q.defer();
                 if (ready) {
                   deferred.resolve(true);
                 } else {
                   $rootScope.$on('translateSrv::ready', function () {
                     deferred.resolve(true);
                   });
                 }

                 return deferred.promise;
               };


               /**
                * @name getTranslationMap
                * @description Get a translation map
                * @returns {Object}
                */
               self.getTranslationMap = function () {
                 return self.translation_map;
               };


               /**
                * @name loadTranslateMap
                * @description Load the translation map - Returns a promise
                *     object
                * @returns {Object}
                * TODO: Refactor
                */
               self.loadTranslateMap = function () {
                 var cultures = CultureSrv.getCultures([]);
                 var currentCulture = cultures.selectedLang;
                 var currentCultureId = currentCulture.code;

                 var deferred = $q.defer(),
                   promise;
                 if (! ready) {
                   pending.push(function () {
                     deferred.resolve(self.map[currentCultureId]);
                   });
                 } else {
                   if (self.map.hasOwnProperty(currentCultureId)) {
                     _parseTranslationMap(self.map[currentCultureId]);
                     deferred.resolve(self.map[currentCultureId]);
                   } else {
                     deferred.reject({
                       error: 'Translations not found'
                     });
                   }
                 }

                 promise = deferred.promise;
                 promise.then(function (data) {
                   self.translation_map = data;
                   _readyTranslate();
                 });

                 return deferred.promise;
               };


               /**
                * @name _
                * @description The translation function
                * @param key
                * @returns {String}
                */
               self._ = function (key) {
                 return self.translation_map[key] || '';
               };

               return self;
             });
})();
