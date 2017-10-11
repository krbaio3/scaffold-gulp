'use strict';

module.exports = function() {
    var src = 'src/';
    var app = 'src/app/';
    var components = 'src/app/components';
    var assets = 'src/app/assets';
    var sass = 'src/app/sass';
    var report = './report/';
    var root = './';
    var temp = './.tmp/';
    var specRunnerFile = 'specs.html';
    var wiredep = require('wiredep');
    var bowerFiles = wiredep({
        devDependencies: true
    })['js'];
    //var dist = './dist/';
    //var wiredep = require('wiredep');
    //var bowerFiles = wiredep({devDependencies: true})['js'];
    var bower = {
        json: require('./bower.json'),
        directory: './bower_components/'
            //ignorePath: '../..'
    };
    var nodeModules = 'node_modules';

    var config = {
        /**
         * File paths
         */
        // all javascript that we want to vet
        alljs: [
            './src/**/*.js',
            '!./src/**/*spec.js',
            '!**/app.bootstrapping.js'
            //,'./*.js'
        ],
        build: './dist/',
        app: app,
        css: app + 'sass/main.css',
        fonts: bower.directory + 'font-awesome/fonts/**/*.*',
        html: app + '**/*.html',
        //images: assets + '/img/**/*.{gif,jpeg,jpeg,png,svg}',
        images: assets + '/img/**/*',
        index: src + 'index.html',
        // app js, with no specs
        js: [
            components + '**/*.module.js',
            components + '**/*.js',
            '!' + components + '**/*.spec.js'
        ],
        mainJs: src + 'main.js',
        //jsOrder: [
        //  '**/app.module.js',
        //'**/app.config.js',
        //  '**/app.routes.js',
        //  '**/*.module.js',
        //  '**/*.js'
        //],
        jsOrder: [
            '**/app.module.js',
            '**/*.module.js',
            '**/*.js'
        ],
        sass: app + 'sass/main.scss',
        sassFolder: sass,
        report: report,
        root: root,
        source: src,
        components:components,
        stubsjs: [
            bower.directory + 'angular-mocks/angular-mocks.js',
            app + 'stubs/**/*.js'
        ],
        temp: temp,

        /**
         * optimized files
         */
        optimized: {
            app: 'app.js',
            lib: 'lib.js'
        },

        /**
         * plato
         */
        plato: {
            js: app + '**/*.js'
        },

        /**
         * browser sync
         */
        browserReloadDelay: 1000,

        /**
         * template cache
         */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app.core',
                root: 'app/',
                standalone: false
            }
        },

        /**
         * Bower and NPM files
         */
        bower: bower,
        packages: [
            './package.json',
            './bower.json'
        ],
        /**
         * specs.html, our HTML spec runner
         */
        specRunner: src + specRunnerFile,
        specRunnerFile: specRunnerFile,

        /**
         * The sequence of the injections into specs.html:
         *  1 testlibraries
         *      mocha setup
         *  2 bower
         *  3 js
         *  4 spechelpers
         *  5 specs
         *  6 templates
         */
        testlibraries: [
            nodeModules + '/jasmine/bin/jasmine.js',
            //nodeModules + '/mocha/mocha.js',
            nodeModules + '/chai/chai.js',
            nodeModules + '/sinon-chai/lib/sinon-chai.js'
        ],
        specHelpers: [src + 'test-helpers/*.js'],
        specs: [app + '**/*.spec.js'],
        serverIntegrationSpecs: [src + '/tests/server-integration/**/*.spec.js'],

        /**
         * Node settings
         */
        defaultPort: '8001'
    };

    /**
     * wiredep and bower settings
     */
    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    config.getOrderInyectorBowerSCSS = function() {

        var order = [
            '/bower_components/bankia-ui-styles/variables.scss',
            '/bower_components/bankia-ui-styles/mixins-custom.scss',
            '/bower_components/nu-neo-styles/dist/sass/vendor/all.scss',
            '/bower_components/bankia-ui-styles/fonts.scss',
            '/bower_components/bankia-ui-styles/bk-icons.scss',
            '/bower_components/bankia-ui-button/src/scss/bk-button.scss',
            '/bower_components/bankia-ui-checkbox/src/scss/bk-checkbox.scss',
            '/bower_components/bankia-ui-combo/src/scss/bk-combo.scss',
            '/bower_components/bankia-ui-date/src/scss/bk-date.scss',
            '/bower_components/bankia-ui-radio/src/scss/bk-radio.scss',
            '/bower_components/nu-neo-styles/dist/sass/modules/all.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/elements/complex/bk-box.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/elements/complex/bk-button.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/elements/complex/bk-combo.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/elements/complex/bk-element-exchange.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/elements/complex/bk-general-panel.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/elements/complex/bk-hierarchic-combo.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/elements/complex/bk-legend.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/elements/complex/bk-pagination.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/elements/complex/bk-tab.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/elements/complex/bk-table.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/elements/complex/pdf-viewer.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/elements/simple/bk-check.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/elements/simple/bk-compound-icons.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/elements/simple/bk-form.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/elements/simple/bk-link.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/elements/simple/bk-radio.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/elements/simple/bk-text-input.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/elements/simple/bk-title.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/elements/complex/uib-modal.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/elements/complex/uib-tooltip.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/components/bk-date.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/components/bk-statebutton.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/components/bk-tasklist.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/components/bk-loading.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/components/bk-message.scss',
            '/bower_components/nu-neo-styles/dist/sass/partials/components/bk-snackbar.scss'
        ];

        return order;
    };

    /**
     * karma settings
     */
    config.karma = getKarmaOptions();

    return config;

    ////////////////

    function getKarmaOptions() {
        var options = {
            files: [].concat(
                //bowerFiles,
                config.specHelpers,
                app + '**/*.module.js',
                app + '**/*.js',
                temp + config.templateCache.file,
                config.serverIntegrationSpecs
            ),
            exclude: [],
            coverage: {
                dir: report + 'coverage',
                reporters: [
                    // reporters not supporting the `file` property
                    {
                        type: 'html',
                        subdir: 'report-html'
                    }, {
                        type: 'lcov',
                        subdir: 'report-lcov'
                    }, {
                        type: 'text-summary'
                    } //, subdir: '.', file: 'text-summary.txt'}
                ]
            },
            preprocessors: {}
        };
        options.preprocessors[app + '**/!(*.spec)+(.js)'] = ['coverage'];
        return options;
    }
};
