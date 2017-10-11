(function() {
    'use strict';
    /* @ngInject */
    angular
        .module('ejemplo.dataSearch')
        .service('dataSearchSrv', dataSearchSrv);

    function dataSearchSrv($http, $q, END_POINTS) {

        function getEntities() {
            var defer = $q.defer();
            var filtro = '&codigo=0&codigo=8&codigo=30&codigo=4&codigo=5002&codigo=5004&codigo=5005&codigo=5018&codigo=5038&codigo=5040';
            var request = {
                method: 'GET',
                url: 'http://tabit-epd.cm.es/api/tabit?queryType=ObtenerEntidades' + filtro
            };

            function consultaSuccess(data) {
                console.log('sucess');
                defer.resolve(data);
            }

            function consultaError(error) {

                defer.reject(error);

            }

            $http(request).success(consultaSuccess).error(consultaError);
            // consultaSuccess(data);

            return defer.promise;
        }

        function getConsultarRepartosFondosInversionCliente(data) {
            var deffered = $q.defer();
            var dataToPass = {
                entidadContrato: data.entidadContrato,
                contratoFondo: data.contratoFondo
            };
            var request = {
                method: 'POST',
                URL: END_POINTS.contexts.consultarDetalleVigente,
                dataType: 'jsonp',
                headers: {
                    'Aceept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-j_gid_cod_app': 'e2'
                }
            };

            function consultaSuccess(resp) {
                deffered.resolve(resp);
            }
            //Esta funcion de error en NEO se debe de cambiar
            function consultaError(err, status) {
                if (status !== 500) {
                    err = {
                        operationResult: '404',
                        operationMessage: 'Servicio no disponible temporalmente'
                    };
                }
                deffered.reject(err);
            }

            $http(request).success(consultaSuccess).error(consultaError);
            return deffered.promise;


        }

        return {
            getConsultarRepartosFondosInversionCliente: getConsultarRepartosFondosInversionCliente,
            getEntities: getEntities
        };

    }

})();
