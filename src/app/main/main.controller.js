'use strict';

angular
  .module('trunk')
  .controller('MainCtrl', function($rootScope, $scope) {

  
    $scope.options = {
      menuOpen: false,
      filter: 'nombre'
    };

    $scope.resultClass = 'col-md-1';

    $rootScope.$on('evt:tags', function(evt, data) {
      console.log('sfsdfsdfs', data, evt);

      $scope.tags = data;

      if (data.length > 0) {
        $scope.resultClass = 'col-md-2';
        $scope.listadoFiltrado = _.filter($scope.listado, function(o) {
          o.active = '';
          return o.localidad == 'Lomas de Zamora';
        });
      } else {
        $scope.listadoFiltrado = $scope.listado;
        $scope.resultClass = 'col-md-1';
      }
    });

    $scope.showActive = function(data) {
      angular.element('.result-active').removeClass('result-active');
      data.active = 'result-active';
    };

    $scope.listado = $scope.listadoFiltrado = [
      {
        nombre: 'Lucas',
        apellido: 'Muñoz',
        localidad: 'Ramos Mejia',
        fecha_des: '2016',
        genero: 'Masculino',
        accion_al_des: 'Rumbo a la comisaria donde trabajaba',
        imagen: '../resources/images/1.png',
        visible: 'col-md-1'
      },
      {
        nombre: 'Lautaro',
        apellido: 'Bugatto',
        localidad: 'Lomas de Zamora',
        fecha_des: '2012',
        genero: 'Masculino',
        accion_al_des: 'Iba a bailar',
        imagen: '../resources/images/2.png',
        visible: 'col-md-1'
      },
      {
        nombre: 'Edgardo Jose',
        apellido: 'Cicutin',
        localidad: 'Lomas de Zamora',
        fecha_des: '1994',
        genero: 'Masculino',
        accion_al_des: '',
        imagen: '../resources/images/3.png',
        visible: 'col-md-1'
      },
      {
        nombre: 'Norbeto Antonio',
        apellido: 'Corbo',
        localidad: 'Lomas de Zamora',
        fecha_des: '2004',
        genero: 'Masculino',
        accion_al_des: 'Rumbo a la comisaria donde trabajaba',
        imagen: '../resources/images/4.png',
        visible: 'col-md-1'
      },
      {
        nombre: 'Leonardo Adolfo',
        apellido: 'Rodriguez Contreras',
        localidad: 'Mendoza',
        fecha_des: '2015',
        genero: 'Masculino',
        accion_al_des: '',
        imagen: '../resources/images/4.png',
        visible: 'col-md-1'
      },
      {
        nombre: 'Sebastian',
        apellido: 'Bordon',
        localidad: 'Moreno',
        fecha_des: '1997',
        genero: 'Masculino',
        accion_al_des: 'Una excursión de su viaje de egresados.',
        imagen: '../resources/images/4.png',
        visible: 'col-md-1'
      },
      {
        nombre: 'Norbeto Antonio',
        apellido: 'Corbo',
        localidad: 'Lomas de Zamora',
        fecha_des: '2004',
        genero: 'Masculino',
        accion_al_des: 'Rumbo a la comisaria donde trabajaba',
        imagen: '../resources/images/4.png',
        visible: 'col-md-1'
      }
    ];





    $scope.optionsData = [];
    $scope.optionsData['nombre'] = ['Muños Lucas', 'Bugatto Lautaro'];
    $scope.optionsData['localidad'] = ['Lomas de Zamora', 'Ramos Mejia', 'Mendoza'];
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
