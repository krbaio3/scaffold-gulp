(function() {
    'use strict';
    angular.module('ejemplo')
        /**
        cut: Filtro para cortar un string y añadir un final
        Uso:
            {{fila.cadena | cut:20 }}  --> Es necesario proporcionar longitud de la cadena a mostrar. Por defecto añade los siguiente caracteres al final ' ...',
            {{fila.cadena | cut:20:' ***' }} --> En este caso modifica la cadena final.

        Devuelve:
            Cadena cortada con añadido final
        **/
        .filter('cut', function() {
            return function(value, max, tail) {
                if (!value) {
                    return '';
                }

                max = parseInt(max, 10);
                if (!max) {
                    return value;
                }
                if (value.length <= max) {
                    return value;
                }
                value = value.substr(0, max);

                return value + (tail || ' …');
            };
        })

    .filter('noCeros', function() {
        return function(value) {
            if (isNaN(value)) {
                return value;
            } else {
                return '';
            }
        };
    })

    .filter('cerosPorGuion', function() {
        return function(value) {
            if (value === 0 || value === '0') {
                return '-';
            } else {
                return value;
            }
        };
    })

    .filter('importeConSignoCurrencys', function() {
        return function(number) {
            if (!angular.isObject(number)) {
                return number;
            }
            var num, mon, con, decimales;
            var separadorMiles = '.';

            try {
                num = number.importeConSigno;
                mon = number.moneda.divisa;
                con = number.moneda.digitoControlDivisa;
                decimales = parseInt(number.numeroDecimalesImporte);

                if (num !== '-') {
                    num = parseFloat(num);
                    num = num / Math.pow(10, decimales);
                } else {
                    return '-';
                }
            } catch (e) {
                return number;
            }

            var numero = num.toFixed(decimales);
            numero = numero.toString().replace('.', ',');
            var miles = new RegExp('(-?[0-9]+)([0-9]{3})');
            while (miles.test(numero)) {
                numero = numero.replace(miles, '$1' + separadorMiles + '$2');
            }

            return numero;
        };
    })

    /**
    importeMonetario: Filtro para formatear un objeto de tipo Importe Monetario
    Uso:
        {{importeEjemplo | importeMonetario}}
    Devuelve:
        Cadena formateada de un importe
    **/
    .filter('importeMonetario', function(functionFactory) {
            return function(value) {
                var integer, decimal, str, signo;
                if (angular.isDefined(value) && angular.isDefined(value.importeConSigno) && angular.isDefined(value.numeroDecimalesImporte)) {
                    if (value.importeConSigno < 0) {
                        signo = '-';
                        str = (String(value.importeConSigno)).split('-')[1];
                    } else {
                        str = String(value.importeConSigno);
                        signo = '';
                    }
                    if (Number(value.numeroDecimalesImporte) >= str.length) {
                        integer = '0';
                        decimal = functionFactory.padLeftZeroes(str, Number(value.numeroDecimalesImporte));
                    } else {
                        integer = str.substring(0, str.length - value.numeroDecimalesImporte);
                        integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                        decimal = str.substring(str.length - value.numeroDecimalesImporte, str.length);
                    }
                    if (decimal.length > 0) {
                        return signo + integer + ',' + decimal;
                    } else {
                        return signo + integer;
                    }
                } else {
                    return '-';
                }
            };
        })
        /**
        importeMovimiento: Filtro para formatear un objeto de tipo Importe Monetario para las tablas de movimientos, devolviendo guion cuando sea 0. Es un arreglo temporal.
        Uso:
            {{importeEjemplo | importeMovimiento}}
        Devuelve:
            Cadena formateada de un importe
        **/
        .filter('importeMovimiento', function(functionFactory) {
            return function(value) {
                var integer, decimal, str, signo;
                if (angular.isDefined(value) && angular.isDefined(value.importeConSigno) && angular.isDefined(value.numeroDecimalesImporte)) {
                    if (value.importeConSigno === 0) {
                        return '-';
                    } else {
                        if (value.importeConSigno < 0) {
                            signo = '-';
                            str = (String(value.importeConSigno)).split('-')[1];
                        } else {
                            str = String(value.importeConSigno);
                            signo = '';
                        }
                        if (Number(value.numeroDecimalesImporte) >= str.length) {
                            integer = '0';
                            decimal = functionFactory.padLeftZeroes(str, Number(value.numeroDecimalesImporte));
                        } else {
                            integer = str.substring(0, str.length - value.numeroDecimalesImporte);
                            integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                            decimal = str.substring(str.length - value.numeroDecimalesImporte, str.length);
                        }
                        if (decimal.length > 0) {
                            return signo + integer + ',' + decimal + ' EUR';
                        } else {
                            return signo + integer + ' EUR';
                        }
                    }
                } else {
                    return '-';
                }
            };
        })
        /**
        porcentaje: Filtro para formatear un objeto de tipo porcentaje
        Uso:
            {{porcentajeEjemplo | porcentaje}}
        Devuelve:
            Cadena formateada de un porcentaje
        **/
        .filter('porcentaje', function(functionFactory) {
            return function(value) {
                var integer, decimal, str, signo;
                if (angular.isDefined(value) && angular.isDefined(value.porcentaje) && angular.isDefined(value.numDecimales)) {
                    if (value.porcentaje < 0) {
                        signo = '-';
                        str = (String(value.porcentaje)).split('-')[1];
                    } else {
                        str = String(value.porcentaje);
                        signo = '';
                    }
                    if (Number(value.numDecimales) >= str.length) {
                        integer = '0';
                        decimal = functionFactory.padLeftZeroes(str, Number(value.numDecimales));
                    } else {
                        integer = str.substring(0, str.length - value.numDecimales);
                        decimal = str.substring(str.length - value.numDecimales, str.length);
                    }
                    if (Math.abs(decimal) > 0) {
                        return signo + integer + ',' + decimal;
                    } else {
                        return signo + integer;
                    }
                } else {
                    return '-';
                }
            };
        })
        /**
        porcentajeMovimiento: Filtro para formatear un objeto de tipo porcentaje para la tabla movimientos, de forma que se muestre - cuando 0
        Uso:
            {{porcentajeEjemplo | porcentaje}}
        Devuelve:
            Cadena formateada de un porcentaje
        **/
        .filter('porcentajeMovimiento', function(functionFactory) {
            return function(value) {
                var integer, decimal, str, signo;
                if (angular.isDefined(value) && angular.isDefined(value.porcentaje) && angular.isDefined(value.numDecimales) && value.porcentaje !== 0) {
                    if (value.porcentaje < 0) {
                        signo = '-';
                        str = (String(value.porcentaje)).split('-')[1];
                    } else {
                        str = String(value.porcentaje);
                        signo = '';
                    }
                    if (Number(value.numDecimales) >= str.length) {
                        integer = '0';
                        decimal = functionFactory.padLeftZeroes(str, Number(value.numDecimales));
                    } else {
                        integer = str.substring(0, str.length - value.numDecimales);
                        decimal = str.substring(str.length - value.numDecimales, str.length);
                    }
                    if (decimal.length > 0) {
                        return signo + integer + ',' + decimal;
                    } else {
                        return signo + integer;
                    }
                } else {
                    return '-';
                }

            };
        })
        /**
        fechaSalida: Filtro para formatear una fecha en formato aaaa-mm-dd a dd/mm/aaa
        Uso:
            {{fechaEjemplo | fechaSalida}}
        Devuelve:
            Cadena formateada de un fecha
        **/
        .filter('fechaSalida', function() {
            return function(value) {
                if (angular.isDefined(value)) {
                    var date = value.split('-');
                    var formattedDate = date.length === 3 ? date[2] + '/' + date[1] + '/' + date[0] : ' ';
                    return formattedDate === '01/01/1600' ? ' ' : formattedDate;
                }
            };
        })
        /**
        siNo: Filtro para formatear un booleano a SÍ o a NO
        Uso:
            {{booleanoEjemplo | siNo}}
        Devuelve:
            Cadena SÍ o NO
        **/
        .filter('siNo', function() {
            return function(value) {
                if (angular.isDefined(value)) {
                    if (value) {
                        return 'SÍ';
                    } else {
                        return 'NO';
                    }
                } else {
                    return '-';
                }
            };
        })
        /**
        siNoVacio: Filtro para formatear 'S', 'N o ' ' a SÍ, a NO o a ' '
        Uso:
            {{'S' o 'N' o ' '  | siNoVacio}}
        Devuelve:
            Cadena SÍ, NO o ' '
        **/
        .filter('siNoVacio', function() {
            return function(value) {
                if (angular.isDefined(value)) {
                    if (value === 'S') {
                        return 'SÍ';
                    } else if (value === 'N') {
                        return 'NO';
                    } else {
                        return value;
                    }
                } else {
                    return '-';
                }
            };
        })
        /**
        mesesEspeciales: Filtro para formatear meses a texto
        Uso:
            {{arrayEjemplo | mesesEspeciales}}
        Devuelve:
            Cadena con los meses especiales
        **/
        .filter('mesesEspeciales', function() {
            return function(value) {
                var meses = ['-', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                if (angular.isDefined(value)) {
                    var stringMeses = '';
                    for (var i = 0; i < value.length; i++) {
                        if ((i > 0) && (i < value.length - 1)) {
                            stringMeses = stringMeses + ', ';
                        } else if (i === value.length - 1 && value.length !== 1) {
                            stringMeses = stringMeses + ' y ';
                        }
                        stringMeses = stringMeses + meses[Number(value[i])];
                    }
                    return stringMeses;
                } else {
                    return '-';
                }
            };
        })
        /**
        capitalize: formatea palabras con la primera letra en mayuscula la última en minúscula
        Uso:
            {{palabraEjemplo | capitalize}}
        Devuelve:
            Cadena Xxxxxxx
        **/
        .filter('capitalize', function() {
            return function(value) {
                if (typeof(value) === 'string') {
                    return value.charAt(0).toUpperCase() + (value.slice(1)).toLowerCase();
                } else {
                    return value;
                }
            };
        })
        /**
        unidadesTiempo: codigos de tiempo en ud medida tiempo unidad
        Uso:
            {{codigo | unidadesTiempo}}
        Devuelve:
            Cadena Xxxxxxx
        **/
        .filter('unidadesTiempo', function() {
            return function(objetoTiempo) {
                if (!objetoTiempo) {
                    return '-';
                }
                var singular = objetoTiempo.cantidad === 1;
                var unidad = '';
                switch (objetoTiempo.unidadDeMedidaDeTiempo) {
                    case '050':
                        unidad = singular ? 'AÑO' : 'AÑOS';
                        break;
                    case '100':
                        unidad = singular ? 'MES' : 'MESES';
                        break;
                    case '105':
                        unidad = singular ? 'BIMESTRE' : 'BIMESTRES';
                        break;
                    case '110':
                        unidad = singular ? 'TRIMESTRE' : 'TRIMESTRES';
                        break;
                    case '115':
                        unidad = singular ? 'CUATRIMESTRE' : 'CUATRIMESTRES';
                        break;
                    case '120':
                        unidad = singular ? 'SEMESTRE' : 'SEMESTRES';
                        break;
                    case '150':
                        unidad = singular ? 'SEMANA' : 'SEMANAS';
                        break;
                    case '200':
                        unidad = singular ? 'DÍA' : 'DÍAS';
                        break;
                    case '250':
                        unidad = singular ? 'HORA' : 'HORAS';
                        break;
                    case '300':
                        unidad = singular ? 'MINUTO' : 'MINUTOS';
                        break;
                    case '350':
                        unidad = singular ? 'SEGUNDO' : 'SEGUNDOS';
                        break;
                    case '400':
                        unidad = singular ? 'MICROSEGUNDO' : 'MICROSEGUNDOS';
                        break;
                    default:
                        unidad = '-';
                }
                return unidad;
            };
        })
        /**
        marcaRTooltip: tooltip para el icono de marcaR
        Uso:
            {{codigo | marcaRTooltip}}
        Devuelve:
            Cadena Xxxxxxx
        **/
        .filter('marcaRTooltip', function() {
            return function(codigo) {
                var tooltip;
                switch (codigo) {
                    case 'RF':
                        tooltip = 'REFINANCIACIÓN';
                        break;
                    case 'RD':
                        tooltip = 'REFINANCIADA';
                        break;
                    case 'RT':
                        tooltip = 'REESTRUCTURACIÓN';
                        break;
                    case 'QT':
                        tooltip = 'REESTRUCTURACIÓN QUITA';
                        break;
                    case 'DC':
                        tooltip = 'REESTRUCTURACIÓN DACIÓN';
                        break;
                    case 'AP':
                        tooltip = 'REESTRUCTURACIÓN AMPLIACIÓN PLAZO';
                        break;
                    case 'CA':
                        tooltip = 'REESTRUCTURACIÓN CUADRO DE AMORTIZACIÓN';
                        break;
                    case 'CR':
                        tooltip = 'REESTRUCTURACIÓN CARENCIA';
                        break;
                    case 'CRT':
                        tooltip = 'REESTRUCTURACIÓN CARENCIA TOTAL';
                        break;
                    case 'PR':
                        tooltip = 'REESTRUCTURACIÓN PRECIO';
                        break;
                    case 'OT':
                        tooltip = 'REESTRUCTURACIÓN OTROS';
                        break;
                    case 'RV':
                        tooltip = 'RENOVADA';
                        break;
                    case 'RG':
                        tooltip = 'RENEGOCIADA';
                        break;
                }
                return tooltip;
            };
        });
}());
