/* jshint -W101 */
(function() {
    'use strict';

    angular.module('ejemplo.core.local', []);

})();

(function() {
    'use strict';

    angular
        .module('ejemplo.core.local')
        .constant('END_POINTS', getEndPoints())
        .constant('BASE_PREFIX', getBasePrefix());

    function getBasePrefix() {
        var basePrefix = 'http://localhost:8088';
        return basePrefix;
    }

    function getEndPoints() {
        var base = {
            URL: 'http://localhost:8088'
        };
        return {
            contexts: {
            }
        };
    }
})();
