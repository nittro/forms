module.exports = function (grunt) {

    var files = [
        'src/js/Nittro/Forms/Vendor.js',
        'src/js/Nittro/Forms/Form.js',
        'src/js/Nittro/Forms/Locator.js',
        'src/js/Nittro/Forms/Bridges/FormsDI.js'
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            options: {
                mangle: false,
                sourceMap: false
            },
            nittro: {
                files: {
                    'dist/js/nittro-forms.min.js': files
                }
            }
        },

        concat: {
            options: {
                separator: ";\n"
            },
            nettejs: {
                files: {
                    'dist/js/nittro-forms.js': files
                }
            }
        },

        jasmine: {
            src: files,
            options: {
                vendor: [
                    'bower_components/promiz/promiz.min.js',
                    'src/js/Nittro/Forms/Bridges/netteForms.js',
                    'bower_components/nette-forms/src/assets/netteForms.js',
                    'bower_components/nittro-core/dist/js/nittro-core.min.js',
                    'bower_components/nittro-datetime/dist/js/nittro-datetime.min.js',
                    'bower_components/nittro-neon/dist/js/nittro-neon.min.js',
                    'bower_components/nittro-di/dist/js/nittro-di.min.js',
                    'bower_components/nittro-extras-flashes/dist/js/nittro-extras-flashes.min.js'
                ],
                specs: 'tests/specs/**.spec.js',
                display: 'short',
                summary: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.registerTask('default', ['uglify', 'concat']);
    grunt.registerTask('test', ['jasmine']);

};
