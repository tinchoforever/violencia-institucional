(function() {
  'use strict';

  /**
   * {Factory} CultureSrv
   * Service to bring the current culture
   * TODO: Set up the constants into a separated file
   */
  angular
    .module('trunk')
    .factory('CultureSrv', function($location, $rootScope, $timeout, $window, UtilsSrv, ParamsSrv, $cookies, BrandSrv) {

      var self = {},
        _currentCulture = false;

      var currentDir = UtilsSrv.location().getCurrentDir();

      var CUID = {
        7: {
          'textDirection': "leftToRight",
          'cultureId': 7,
          'code': "de",
          'fullCode': 'de-DE',
          'customFont': false,
          'name': "German"
        },
        12: {
          'textDirection': "rightToLeft",
          'cultureId': 12,
          'code': "he",
          'fullCode': 'he-HE',
          'customFont': false,
          'name': "Hebrew"
        },
        13: {
          'textDirection': "leftToRight",
          'cultureId': 13,
          'code': "hu",
          'fullCode': 'hu-HU',
          'customFont': false,
          'name': "Hungarian"
        },
        16: {
          'textDirection': "leftToRight",
          'cultureId': 16,
          'code': "ja",
          'fullCode': 'ja-JP',
          'customFont': 'meiryo',
          'name': "Japanese"
        },
        23: {
          'textDirection': "leftToRight",
          'cultureId': 23,
          'code': "ru",
          'fullCode': 'ru-RU',
          'customFont': false,
          'name': "Russian"
        },
        20: {
          'textDirection': "leftToRight",
          'cultureId': 20,
          'code': "pl",
          'fullCode': 'pl-PL',
          'customFont': false,
          'name': "Polish"
        },
        69: {
          'textDirection': "leftToRight",
          'cultureId': 69,
          'code': "en",
          'fullCode': 'en-EN',
          'customFont': false,
          'name': "English"
        },
        85: {
          'textDirection': "leftToRight",
          'cultureId': 85,
          'code': "es",
          'fullCode': 'es-ES',
          'customFont': false,
          'name': "Spanish"
        },
        161: {
          'textDirection': "leftToRight",
          'cultureId': 161,
          'code': "zh",
          'fullCode': 'zh-CHS',
          'customFont': false,
          'name': "Simplified Chinese"
        },
        162: {
          'textDirection': "rightToLeft",
          'cultureId': 162,
          'code': "ar",
          'fullCode': 'ar-AE',
          'customFont': false,
          'name': "Modern Standard Arabic"
        }
      };

      var CU = {
        de: {
          'textDirection': "leftToRight",
          'cultureId': 7,
          'code': "de",
          'fullCode': 'de-DE',
          'customFont': false,
          'name': "German"
        },
        he: {
          'textDirection': "rightToLeft",
          'cultureId': 12,
          'code': "he",
          'fullCode': 'he-HE',
          'customFont': false,
          'name': "Hebrew"
        },
        hu: {
          'textDirection': "leftToRight",
          'cultureId': 13,
          'code': "hu",
          'fullCode': 'hu-HU',
          'customFont': false,
          'name': "Hungarian"
        },
        ja: {
          'textDirection': "leftToRight",
          'cultureId': 16,
          'code': "ja",
          'fullCode': 'ja-JP',
          'customFont': 'meiryo',
          'name': "Japanese"
        },
        ru: {
          'textDirection': "leftToRight",
          'cultureId': 23,
          'code': "ru",
          'fullCode': 'ru-RU',
          'customFont': false,
          'name': "Russian"
        },
        pl: {
          'textDirection': "leftToRight",
          'cultureId': 20,
          'code': "pl",
          'fullCode': 'pl-PL',
          'customFont': false,
          'name': "Polish"
        },
        en: {
          'textDirection': "leftToRight",
          'cultureId': 69,
          'code': "en",
          'fullCode': 'en-EN',
          'customFont': false,
          'name': "English"
        },
        es: {
          'textDirection': "leftToRight",
          'cultureId': 85,
          'code': "es",
          'fullCode': 'es-ES',
          'customFont': false,
          'name': "Spanish"
        },
        zh: {
          'textDirection': "leftToRight",
          'cultureId': 161,
          'code': "zh",
          'fullCode': 'zh-CHS',
          'customFont': false,
          'name': "Simplified Chinese"
        },
        ar: {
          'textDirection': "rightToLeft",
          'cultureId': 162,
          'code': "ar",
          'fullCode': 'ar-AE',
          'customFont': false,
          'name': "Modern Standard Arabic"
        }
      };

      init();
      self.init = init;


      /**
       * @name getCulture
       * @description Loads the initial culture configuration
       */
      function init() {
        var lang = _getFirstBrowserLanguage(),
          params = $location.search(),
          defaultLang = CU.en;

        BrandSrv.getBrand(currentDir).then(function(brand) {
          /* istanbul ignore else */
          if (brand && !brand.hideLangDropdown) {
            if (!!$cookies.currentCulture) {
              lang = $cookies.currentCulture;
            } else {
              $cookies.currentCulture = lang;
            }
          }

          /* istanbul ignore else */
          if (!_currentCulture) {
            _currentCulture = typeof params.CUID === 'undefined' ?
                (CU[lang.split('-')[0]] || defaultLang) :
                (CUID[params.CUID] || defaultLang);
          }

          // Using $timeout because the child directive isn't instantiated yet
          $timeout(function() {
            $rootScope.$broadcast('cultureReady');
          });
        });
      }


      /**
       * @name setCulture
       * @description Overrides the initial culture configuration
       */
      self.setCulture = function(newLang) {
	      _currentCulture = CU[newLang];
        $rootScope.$broadcast('cultureReady');
      };


      /**
       * @name getCultureId
       * @description Get the culture ID
       * @returns {Number}
       */
      self.getCultureId = function() {
        return _currentCulture.cultureId;
      };


      /**
       * @name getCultureCode
       * @description returns the culture code
       * @returns {String}
       */
      self.getCultureCode = function() {
        return _currentCulture.code;
      };


      /**
       * @name getFullCultureCode
       * @description returns the full culture code
       * @returns {String}
       */
      self.getFullCultureCode = function() {
        return _currentCulture.fullCode;
      };


      /**
       * @name getCustomFont
       * @description Getter for the custom font.
       * @returns {Boolean|String}
       */
      self.getCustomFont = function () {
        return _currentCulture.customFont;
      };


      /**
       * @name getTextDirection
       * @description returns the culture text description
       * @returns {String}
       */
      self.getTextDirection = function() {
        return _currentCulture.textDirection;
      };

      /**
       * @name getCultures
       * @params filter {array}
       * @description returns the cultures json without the ones in the
       *   received array.
       * @returns {object}
       */
      self.getCultures = function(filter) {
        var culturesList = angular.copy(CU),
        browserLang = _getFirstBrowserLanguage();
        var currentLang = (_currentCulture) ? self.getCultureCode() : browserLang;
        culturesList = _.omit(culturesList, filter);
        var defaultLang = culturesList[currentLang] || culturesList.en;
        defaultLang.selected = true;
        return {
          list: culturesList,
          selectedLang: defaultLang
        };
      };


      /**
       * @name _getFirstBrowserLanguage
       * @description Get the user's language
       * @returns {String}
       * @private
       * TODO: remove when angular-translate is implemented
       */
      function _getFirstBrowserLanguage() {
        if (!navigator.languages && navigator.language) {
          navigator.languages = [navigator.language.split('-')[0]];
        }
       return UtilsSrv.navigator().isIE() ?
          (ParamsSrv.CUID || $window.ieLang || 'en') :
          (navigator.userLanguage || navigator.languages[0] || navigator.language);
      }

      return self;
    });
})();
