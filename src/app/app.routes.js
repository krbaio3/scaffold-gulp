(function() {
    'use strict';

    angular
        .module('ejemplo')
        .config(configuration);
    /* @ngInject */
    function configuration($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                abstract: true
            })

            //Revisar con Jesus Problemas de nombre con el mismo estado ver dataSearch.routes.js
            .state('dataSearch', {
              url: '/dataSearch',
              templateUrl: 'app/components/dataSearch.module/dataSearch.component.html',
              controller: 'dataSearchController',
              controllerAs: 'dataSearchCtrl',
              data: {
                  pageTitle: 'Datos Busqueda'
              }
          });


        $urlRouterProvider.otherwise('/dataSearch');
    }
})();
