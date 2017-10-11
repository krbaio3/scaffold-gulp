'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    lazy: true
});
var open = require('gulp-open');
var browserSync = require('browser-sync').create();
var gutil = require('gulp-util');
var cssnano = require('gulp-cssnano');
var plumber = require('gulp-plumber');
var watch = require('gulp-watch');
var scsslint = require('gulp-scss-lint');
var minify = require('gulp-minify');
var angularFilesort = require('gulp-angular-filesort');
var order = require('gulp-order');
var sourcemaps = require('gulp-sourcemaps');
var _ = require('gulp-lodash');
var fileExists = require('file-exists');
var args = require('yargs').argv;
var path = require('./gulp.config')();
var del = require('del');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');

// Edit this values to best suit your app
var WEB_PORT = 9898;
var APP_DIR = 'app';

//Fin Variables

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

/****
            INICIO TAREAS
******/

/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

gulp.task('build', function(done) {
    //runSequence('assets:img', 'wiredep', 'build-sass', 'inject', done);
    runSequence('compress:replace', 'build-sass', 'inject', done);
});

// Static Server + watching scss/html files
gulp.task('server', function() {
    browserSync.init({
        logLevel: 'debug',
        server: {
            baseDir: 'src',
            index: 'index.html',
            routes: {
                '/bower_components': 'bower_components'
            }
        },
        browserSync: true,
        port: WEB_PORT,
        open: 'local'
    });

    gulp.watch(['src/app/**/*.scss'], ['build-sass'], function() {
        browserSync.reload();
        log('Ha recargado SCSS');
    });

    //javascript watch. Angular 1.5
    /*gulp.watch(path.alljs, ['concatMain'], function(done) {
        browserSync.reload();
        console.log('Ha recargado JS');
        done();
    });*/

    gulp.watch(path.alljs, function(done) {
        browserSync.reload();
        log('Ha recargado JS');
    });

    //html watch
    gulp.watch('./src/app/**/*.html').on('change', browserSync.reload);
});

/***  BOWER ***/

// Inject libraries via Bower in between of blocks "bower:css" and  "bower:js" in index.html
gulp.task('wiredep', function() {
    return gulp.src(path.index)
        .pipe($.debug({
            verbose: true
        }))
        .pipe($.print())
        .pipe(plumber({
            errorHandler: function(err) {
                this.emit('end');
                console.error(err);
            }
        }))
        .pipe(wiredep(path.getWiredepDefaultOptions(), {
            onError: function(err) {
                console.log(err);
            }
        }))
        .pipe(gulp.dest(path.source))
        .pipe(browserSync.stream());
});

/*
 * wiredep:sass => Injecta los SCSS que tenga/necesite bower dentro de main.scss
 */

//NOTA: tarea en fase Beta
gulp.task('wiredep:sass', function() {
    return gulp.src('main.scss', {
            cwd: './src/app/sass'
        })
        .pipe($.debug({
            verbose: true
        }))
        .pipe(plumber({
            errorHandler: function(err) {
                this.emit('end');
                log(err);
            }
        }))
        .pipe(wiredep({
            'exclude': ['/compass-mixins/', '/bootstrap-sass/'],
            'ignorePath': '.scss',
            onError: function(err) {
                log(err);
            }
        }))
        .pipe(gulp.dest('./src/app/sass'));

});
/**** FIN BOWER ****/

/** SASS **/

gulp.task('build-sass', function(done) {
    runSequence('wiredep:sass', 'inject:scss', 'sass');
    done();
});

/*
 * Inject:scss  => injecta SCSS en main.scss con la etiqueta personalizada
 */
gulp.task('inject:scss', function() {

    var directory = '../../..';

    return gulp.src(path.sass)
        /**
         * Dynamically injects @import statements into the main main.scss file, allowing
         * .scss files to be placed around the app structure with the component
         * or page they apply to.
         */

    .pipe($.inject(gulp.src(['src/app/**/*.scss', '!./src/app/sass/main.scss'], {
            read: false
        }), {
            starttag: '// injectorSCSS',
            endtag: '// endinjectorSCSS',
            transform: function(filepath) {
                log('------------>' + filepath);
                return '@import \'' + directory + filepath.replace('.scss', '') + '\';';
            }
        }))
        //poner aquí la tarea sass para que lo compile directamente a CSS
        .pipe(gulp.dest(path.sassFolder));
});

/*
 * SASS => Tarea que transforma el main.scss a main.css
 */
gulp.task('sass', function() {
    //No se puede usar gulp SASS porque depende de librerías de compass
    return gulp.src(path.sass)
        .pipe($.debug({
            verbose: true
        }))
        .pipe(plumber({
            errorHandler: function(err) {
                this.emit('end');
                log('ERROR ==> ' + err);
            }
        }))
        .pipe(sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.sassFolder))
        //.pipe(browserSync.stream())
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Looks for code correctness errors in SASS and prints them
gulp.task('scss-lint', function() {
    return gulp.src(path.styles)
        .pipe(plumber())
        .pipe(scsslint());
});
//**JS**//

/*
 * Inject => Injecta los js/css de bower dentro de HTML. Tarea a Eliminar. Revisar
 */
gulp.task('inject', function() {

    var injectScripts = gulp.src(path.alljs)
        .pipe(angularFilesort());

    var injectStyles = gulp.src(path.css);

    var wiredepOptions = path.getWiredepDefaultOptions();

    var injectOptions = {
        //addRootSlash: false
        relative: true
    };

    gutil.log('Inyección de dependecias en el index.html');
    gutil.log('path.index ===> ' + path.index);
    gutil.log('path.css ===> ' + path.css);
    gutil.log('path.alljs ===> ' + path.alljs);

    return gulp.src(path.index)
        .pipe($.debug({
            verbose: true
        }))
        .pipe(plumber())
        .pipe($.inject(injectScripts, injectOptions))
        .pipe(gulp.dest(path.source))
        .pipe($.inject(injectStyles, injectOptions))
        .pipe(gulp.dest(path.source))
        .pipe(wiredep(wiredepOptions))
        .pipe(gulp.dest(path.source))
        .pipe(browserSync.stream());
});

//Para angular 1.5. Quitar la injeccion Gulp del html y poner el fichero main.js
gulp.task('concatMain', function() {

    if (fileExists('src/main.js')) {
        log('el archivo ' + path.mainJs + ' se ha borrado');
        del('src/main.js');
    } else {
        log('No existe el archivo' + path.mainJs);
    }

    return gulp.src('./src/app/**/*.js')
        .pipe($.debug({
            verbose: true
        }))
        .pipe(plumber())
        .pipe(order([
            '**/app.module.js',
            '**/app.routes.js',
            '**/*.module.js',
            '!**/app.bootstrapping.js',
            '**/app.bootstrapping.js'
        ]))
        .pipe(sourcemaps.init())
        .pipe($.concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./src'))
        .pipe(browserSync.stream());
});

/*
 * inject:js => Tarea a Eliminar
 */
gulp.task('inject:js', function() {

    var injectScripts = gulp.src(path.alljs)
        .pipe(angularFilesort()).on('error', this.errorHandler('AngularFilesort'));
    var wiredepOptions = path.getWiredepDefaultOptions();

    var injectOptions = {
        //addRootSlash: false
        relative: true
    };

    gutil.log('Inyección de dependecias en el index.html');
    gutil.log('path.index ===> ' + path.index);
    gutil.log('path.alljs ===> ' + path.alljs);
    //revisar
    return gulp.src(path.index)
        .pipe($.debug({
            verbose: true
        }))
        .pipe(plumber())
        .pipe($.inject(injectScripts, injectOptions))
        .pipe(gulp.dest(path.source))
        .pipe(wiredep(wiredepOptions))
        // write the injections to the src/app/index.html file
        .pipe(gulp.dest(path.source))
        .pipe(browserSync.stream());
    // so that src/app/index.html file isn't modified
    // with every commit by automatic injects
});
//Validate-Code task
gulp.task('lint', ['jshint', 'jscs']);

// Looks for code correctness errors in JS and prints them
gulp.task('jshint', function() {
    return gulp.src(path.alljs)
        .pipe($.debug({
            verbose: true
        }))
        .pipe(plumber())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});

// Looks for code style errors in JS and prints them. Reporting & fixing & failing on lint error
gulp.task('jscs', function() {
    return gulp.src(path.alljs)
        .pipe($.debug({
            verbose: true
        }))
        .pipe(plumber())
        .pipe($.jscs({
            fix: true
        }))
        .pipe($.jscs.reporter())
        .pipe($.jscs.reporter('fail'));
    //.pipe(gulp.dest('./dist'));
});

gulp.task('vet', function() {

    $.gutil.log('Analyzing source with JSHint and JSCS and FIX with JSCS');

    return gulp.src(path.alljs)
        .pipe($.debug({
            verbose: true
        }))
        .pipe(plumber())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe($.jshint.reporter('fail'))
        .pipe($.jscs({
            fix: true
        }))
        .pipe($.jscs.reporter())
        .pipe($.jscs.reporter('fail'));
});

//Tarea para probar cosas
gulp.task('prueba', function(done) {
    log('ENTRA');

    return gulp.src('./src/index.html').pipe(getHeader()).pipe(gulp.dest('/'));
});

// Generates the documentation
gulp.task('ngdocs', function() {
    var options = {
        title: 'Credit Agricole Web App Documentation',
        html5Mode: false
    };
    return gulp.src('./src/app/**/*.js')
        .pipe($.ngdocs.process(options))
        .pipe(gulp.dest('./.docs'));
});

// Starts a server with the docs
gulp.task('server-docs', ['ngdocs'], function() {
    browserSync.init({
        logLevel: 'debug',
        server: {
            baseDir: './docs'
        },
        //defaultFile: 'src/index.html',
        browserSync: true,
        port: 8081,
        //browser: 'google chromium',
        open: 'local'
    });
});

/*            PRODUCTION            */

// Production build
gulp.task('production', function(done) {
    runSequence('compress:replace', 'build-sass', 'compress',
        'templates:clean', 'bootstrapping', 'install-bower', done);
});

/*Copia la carpeta de bower en Dist*/
gulp.task('install-bower', function() {
    //var mainBowerFiles = require('main-bower-files');
    return gulp.src(['./bower_components/**/*'])
        .pipe(gulp.dest(path.build + 'bower_components/'));
    //return gulp.src(mainBowerFiles())
    //  .pipe(gulp.dest('./dist'));
});
// Compress into a single file the ones in between of blocks "build:xx" in index.html
gulp.task('compress', ['inject'], function() {
    return gulp.src('index.html', {
            cwd: path.source
        })
        .pipe($.debug({
            verbose: true
        }))
        .pipe(plumber({
            errorHandler: function(err) {
                //log(err);
                this.emit('end');
            }
        }))
        .pipe($.useref({
            searchPath: ['./', path.source]
        }))
        .pipe($.if('*/scripts.min.js', $.replaceTask({
            patterns: [{
                match: 'debugInfoEnabled',
                replacement: 'false'
            }, {
                match: 'debugLogEnabled',
                replacement: 'false'
            }]
        })))
        .pipe($.if('**/*.js', $.ngAnnotate()))
        // .pipe($.if('**/*.js', $.uglify({
        //     compress: {
        //         hoist_funs: false
        //     },
        //     //Poner a false para debugg en NEO
        //     mangle: true
        // }).on('error', $.util.log)))
        .pipe($.if('**/*.css', $.cssnano()))
        .pipe(gulp.dest(path.build));
});

gulp.task('compress:replace', function() {

    var ENV = args;
    var src = gulp.src(path.components + '/**/*.module.js');
    var mypipe;
    var regex = /creditAgricole\b.core\b.(develop|production)/g;

    if (ENV.develop) {
        log('FLAG ==> develop');
        mypipe = src.pipe($.regexReplace({
            regex: regex,
            replace: 'local'
        }));
    } else if (ENV.production) {
        log('FLAG ==> production');
        mypipe = src.pipe($.regexReplace({
            regex: regex,
            replace: 'produ'
        }));
    } else {
        log('No se ha introducido Flag, por defecto, LOCAL');
        mypipe = src.pipe($.regexReplace({
            regex: regex,
            replace: 'local'
        }));
    }

    return mypipe.pipe(gulp.dest(path.components));

});

// Static Server + watching scss/html files
gulp.task('server:dist', function() {
    log('Arrancando servidor desde la carpeta dist');
    browserSync.init({
        logLevel: 'debug',
        server: {
            baseDir: './dist',
            index: 'index.html'
        },
        browserSync: true,
        port: 9999,
        open: 'local'
    });
});

/** Coge todos los html, los mimifica, y los
 * convierte en templates.js.
 * angularTemplatecache = indica el nombre del módulo
 * e indica que es por IIFE => immediately-invoked function expression.
 * Una vez hecho esto, este templates.js es mimificado
 * @return {Stream}
 */
gulp.task('templates:build', function() {
    log('Construyendo templates');
    return gulp.src('src/app/**/*.html')
        .pipe($.debug({
            verbose: true
        }))
        .pipe(plumber({
            errorHandler: function(err) {
                //log(err);
                this.emit('end');
            }
        }))
        .pipe($.htmlmin({
            collapseWhitespace: true
        }))
        .pipe($.angularTemplatecache({
            module: 'creditAgricole',
            moduleSystem: 'IIFE',
            //comprobar qué hace standalone
            standalone: false,
            root: 'app/'
        }))
        .pipe($.uglify({
            mangle: true
        }))
        .pipe(gulp.dest(path.build));
});

gulp.task('templates:concat', ['templates:build'], function() {
    log('Concatenando templates');
    return gulp.src(['./dist/js/scripts.min.js', './dist/templates.js'])
        .pipe($.debug({
            verbose: true
        }))
        .pipe(plumber({
            errorHandler: function(err) {
                //log(err);
                this.emit('end');
            }
        }))
        .pipe($.concat('./dist/js/scripts.min.js'))
        .pipe(gulp.dest('./'));

});
/**
 * Delete all files in a given path
 */
gulp.task('templates:clean', ['templates:concat'], function() {
    log('Cleaning: ' + $.util.colors.blue('./dist/templates.js'));
    return del('./dist/templates.js');
});
//Tarea para concatenar el app.bootstrapping
gulp.task('bootstrapping', ['removeTag'], function() {
    log('Añadiendo app.bootstrapping...');
    return gulp.src(['./dist/js/scripts.min.js', './src/app/app.bootstrapping.js'])
        .pipe($.concat('scripts.min.js'))
        .pipe($.uglify({
            mangle: true
        }).on('error', $.util.log))
        .pipe(gulp.dest('./dist/js'));
});
//Tarea para eliminar el tag del html de dist
gulp.task('removeTag', function(done) {
    var bootstrapping = '<script src="app/app.bootstrapping.js"></script>';
    var ico = '<link rel="icon" href="app/assets/img/favicon.ico" type="image/x-icon"/>';
    var cabecera = '<img src="app/assets/img/cabecera.jpg" class="cabecera"/>';
    var submenu = '<img src="app/assets/img/submenu.jpg" class="cabecera"/>';
    var pie = '<img src="app/assets/img/pie.jpg" class="cabecera"/>';

    log('Eliminando tags en dist/index.html');
    log('app/bootstrapping, ico, cabe submenu y pie');

    return gulp.src(['./dist/index.html'])
        .pipe($.replace(bootstrapping, ''))
        .pipe($.replace(ico, ''))
        .pipe($.replace(cabecera, ''))
        .pipe($.replace(submenu, ''))
        .pipe($.replace(pie, ''))
        .pipe(gulp.dest('./dist'));
});

/**
 * Bump the version
 * --type=pre will bump the prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --version=1.2.3 will bump to a specific version and ignore other flags
 */
gulp.task('bump', function() {
    log(args);
    var msg = 'Bumping versions';
    var type = args.type;
    var version = args.ver;
    var options = {};
    if (version) {
        options.version = version;
        msg += ' to ' + version;
    } else {
        options.type = type;
        msg += ' for a ' + type;
    }
    log(msg);

    return gulp
        .src(path.packages)
        .pipe($.print())
        .pipe($.bump(options))
        .pipe(gulp.dest('./'));
});

/**
 * Format and return the header for files
 * @return {String}
 * Formatted file header
 */


function getHeader() {
    var pkg = require('./package.json');
    var template = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @authors <%= pkg.authors %>',
        ' * @version v<%= pkg.version %>',
        ' * @link <%= pkg.homepage %>',
        ' * @license <%= pkg.license %>',
        ' */',
        ''
    ].join('\n');


    return $.header(template, {
        pkg: pkg
    });

}

module.exports = gulp;
