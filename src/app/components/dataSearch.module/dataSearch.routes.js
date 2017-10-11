(function() {
  'use strict';

  angular
    .module('ejemplo.dataSearch')
    .config(configuration);

  /* @ngInject */
  function configuration($stateProvider) {
    $stateProvider
      .state('data', {
        url: '/',
        templateUrl: 'app/components/dataSearch.module/dataSearch.component.html',
        controller: 'dataSearch.controller',
        controllerAs:'dataSearchCtrl'

      });
  }
})();
