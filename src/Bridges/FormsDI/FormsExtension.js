_context.invoke('Nittro.Forms.Bridges.FormsDI', function(Nittro) {

    var FormsExtension = _context.extend('Nittro.DI.BuilderExtension', function(containerBuilder, config) {
        FormsExtension.Super.call(this, containerBuilder, config);
    }, {
        load: function() {
            var builder = this._getContainerBuilder();
            builder.addServiceDefinition('formLocator', 'Nittro.Forms.Locator()');

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
