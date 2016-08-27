'use strict';

angular
  .module('trunk')
  .controller('MainCtrl', function($scope) {

  
    $scope.options = {
      menuOpen: false,
      filter: 'nombre'
    };

    $scope.optionsData = [];
    $scope.optionsData['nombre'] = ['Muños Lucas', 'Bugatto Lautaro'];
    $scope.optionsData['edad'] = ['1-16', '17-26', '27-36', '37-46', '47-56', '56+'];
    $scope.optionsData['genero'] = ['Masculino', 'Femenino', 'Trans', 'Queer'];
    $scope.optionsData['fecha'] = ['1970','1971','1972','1973','1974','1975','1976','1977','1978','1979'];
    $scope.tags = [];
    $scope.items = ["nombre"];
    $scope.data = {
      victimas: '5'
    };

    $scope.dropdownToggle = function() {
      if ($scope.options.menuOpen == false) {
        angular.element('.dropdown-menu').show();
      } else {
        angular.element('.dropdown-menu').hide();
      }
      $scope.options.menuOpen = !$scope.options.menuOpen;
    };

    $scope.selectFilter = function(text) {
      $scope.options.filter = text;
      $scope.dropdownToggle();
    }
  });
