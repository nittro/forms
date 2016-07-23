module.exports = function (grunt) {

    var files = grunt.file.readJSON('nittro.json').files;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            options: {
                mangle: false,
                sourceMap: false
            },
            nittro: {
                files: {
                    'dist/js/nittro-forms.min.js': files.js
                }
            }
        },

        concat: {
            options: {
                separator: ";\n"
            },
            nettejs: {
                files: {
                    'dist/js/nittro-forms.js': files.js
                }
            }
        },

        jasmine: {
            src: files.js,
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
