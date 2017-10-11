(function() {
    'use strict';

    /**
     * @ngdoc overview
     * @name ejemplo.dataSearch
     * @requires ui.router
     *
     * @description
     * Module for the dataSearch section.
     */
    angular.module('ejemplo.dataSearch', [
        /*Dependecia entre Módulos*/
        'ejemplo.core',
        'ejemplo.shared',
        'ejemplo.core.produ',
        /*Fin Dependecia entre Módulos*/
        /*'bootstrap.ui.snackbar',*/
        'atmira.ui.select', //Componente atmira
        /*'ngResource',*/
        'ui.router',
        /*'ngAnimate',*/
        'ui.bootstrap'
    ]);
})();
