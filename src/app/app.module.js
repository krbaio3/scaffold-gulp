(function() {
    'use strict';

    var configApp = function($compileProvider, $logProvider) {
        //Reemplazar esto con la tarea de Gulp para cuando suba a producción
        $compileProvider.debugInfoEnabled('@@debuggInfoEnabled' !== 'false');
        $logProvider.debugEnabled('@@debugLogEnabled' !== 'false');
    };
    angular
        .module('ejemplo', ['ejemplo.dataSearch', 'ui.router'])
        .component('ejemplo', {
            template: '<ui-view></ui-view>'
        })
        .config(configApp);

})();
//funcion NEO
