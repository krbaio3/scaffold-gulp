# Generador de proyectos utilizando GULP

Crea la estructura para un nuevo proyecto que utilice la arquitectura de componentes Angular.

# Uso

Asegurarse de disponer Node, NPM, Bower, Gulp y Yeoman instalado. Si no estuviera instalado, bower y Yeoman, ejecutar el comando:

```
npm i -g bower yo gulp-cli
```

# Instalar dependencias

```
npm i && bower i
```

o con el comando:

```
npm run pre
```

## Construye la aplicación

```
$ gulp build
```

## Ejecutar aplicación

```
$ gulp server
```

## Para ir mas rapido (solamente si has construido anteriormente bien)

````
npm run start
````

# Resumen v1.0.2

Cómo está estructurado el proyecto:

```
+ src: donde están los fuentes de la aplicación.
            + app: carpeta principal del proyecto, contiene el código de la application. Está dividida en:
                - components: componentes de la aplicación, que a su vez están divididos en módulos,
                    * modulos:  contienen los JS, SCSS y HTML.
                - shared: componentes distribuidos
                - assets: estáticos de la aplicación (imagenes, etc)

                - app.bootstrapping.js: es el archivo que incializa la aplicación
                - app.module.js: la declaración del módulo principal (un componente)
                - app.routes.js: enrutamiento principal del aplicativo.
            + index.html: Punto de entrada principal de la aplicacion. AngularJS es un framework basado en el principio de Aplicaciones de una sola Página (Single-page application)      
            + main.js: no para Ajs 1.4.x
        + server: servidor Express para mocks
              + mocks: mocks del proyecto (json)
              + server.js: archivo de configuracion de Express
        + test:   carpeta donde están los test E2E
```

Cada archivo dentro de app/ tiene el siguiente propósito:

```
+app/sass/main.scss: Estilos SCSS de toda la aplicación.
    +app/app.module.js: Definición del módulo principal de la aplicación.
    +app/app.config.js: Configuración del módulo principal de la aplicación.
    +app/app.route.js: Rutas generales de la aplicación.
    +app/core/; Contiene los servicios y constantes que hagan parte de la lógica de negocio de la aplicación.
    +app/core/core.module.js: Define el módulo "core" de la aplicación. En algunos casos, en especial si se tienen muchas dependencias, este módulo puede referenciar las dependencias que se
      usen en los demás módulos de la aplicación, así cada módulo en lugar de referenciar cada una de estas, simplemente usa este módulo.
    +app/core/constants.js: Se tendrán las constantes que sean de uso compartido entre varios módulos de la aplicación.
    +app/core/environment/local|production/config.js: Aqui estan referenciados los END_POINTS de la aplicacion. Deberan de contener ambos archivos los mismos END_POINTS para que no falle en entornos superiores.
    +app/core/service.js: En caso de los servicios o factories, el archivo tendrá el sufijo ".service" y servirá para implementar una funcionalidad específica de la
      lógica de negocios o consultas a servicios externos.
    +app/core/service.spec.js: Cada elemento de AngularJS que se construya para la aplicación (directiva, controlador o servicio) puede tener pruebas unitarias, las cuales   
      deben estar en un archivo con el mismo nombre del elemento desarrollado, pero con el sufijo ".spec". Estas pruebas unitarias van en la misma carpeta que el elemento probado no sólo para que sea fácil de ubicar sino también para que sea más inmediato ver que al cambiar el archivo con el código de la aplicación sea más fácil recordar que se deben tener actualizados con los cambios en el código. Las pruebas de integración (end-to-end) deben ir en una carpeta por fuera de "app/", por ejemplo "tests/" o "e2e/".
    +app/components/section1|2.module: Modularizacion y componentizacion de la aplicación
        section1|2.module/sectionX.component: Componente dentro del modulo. Dentro tendrá la lógica propia: JS, SCSS y HTML
        section1|2.module/section1|2.scss: Estilos SCSS usados solamente en la sección.
        section1|2.module/section1|2.route.js: Rutas de la sección.
        section1|2.module/section1|2.controller.js: definición del controlador
        section1|2.module/section1|2.module.js: definición del módulo
        section1|2.module/section1|2.html: definición de la vista
        section1|2.module/section1|2.spec.js: test de prueba de x.js
```

## IMPORTANTE

Hay que descomentar la variable `$font-base-path` de main.scss para los pases a EPD/EPI.

## Entornos EPD/EPI

Hay definidas distintas tareas de construccion para EPD/EPI. Estas tareas se engloban en: `gulp production --production`. Es importante el flag `--production` para que los endPoints que se registren puedan ser usados en EPD/EPI. Para su uso en local se debe usar el flag `--develop` o no indicar nada.

## MOCKS

Para crear mocks que devuelven JSON, debes desarrollar la simulacion del JSON. Esto es, debes crear el json en la carpeta `./server/mocks/`, para poder usarlo, debes crear la instancia en el archivo `./server/server.js`. Para mas info : `http://expressjs.com/es/guide/routing.html`

## FAQS

### Acabo de crear un mock y no responde o siempre da un 404

Debes levantar el servidor Express. Ejecuta en otra consola `node server/server.js` para levantar el servidor de MOCKS. Recuerda, debes incluir tus mocks en la carpeta `server/mocks/` y configurar la url en `server/server.js`

## Authors

### Original Author Scaffold and Development Lead

- Jorge Carballo Alonso (jorge.carballo@atmira.com)
