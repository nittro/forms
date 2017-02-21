_context.invoke('Nittro.Forms.Bridges.FormsDI', function(Nittro) {

    var FormsExtension = _context.extend('Nittro.DI.BuilderExtension', function(containerBuilder, config) {
        FormsExtension.Super.call(this, containerBuilder, config);
    }, {
        STATIC: {
            defaults: {
                validateMimeType: true
            }
        },

        load: function() {
            var builder = this._getContainerBuilder(),
                config = this._getConfig(FormsExtension.defaults);

            builder.addServiceDefinition('formLocator', {
                factory: 'Nittro.Forms.Locator()',
                arguments: {
                    options: config
                }
            });

        },

        setup: function () {
            var builder = this._getContainerBuilder();

            if (builder.hasServiceDefinition('page')) {
                builder.getServiceDefinition('page')
                    .addSetup('::initForms()');

            }
        }
    });

    _context.register(FormsExtension, 'FormsExtension')

});
