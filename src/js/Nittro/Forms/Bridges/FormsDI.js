_context.invoke('Nittro.Forms.Bridges', function(Nittro) {

    if (!Nittro.DI) {
        return;
    }

    var FormsDI = _context.extend('Nittro.DI.BuilderExtension', function(containerBuilder, config) {
        FormsDI.Super.call(containerBuilder, config);
    }, {
        load: function() {
            var builder = this._getContainerBuilder();
            builder.addServiceDefinition('formLocator', 'Nittro.Forms.Locator()');

        },

        setup: function () {
            var builder = this._getContainerBuilder();

            if (builder.hasServiceDefinition('flashes')) {
                builder.getServiceDefinition('formLocator')
                    .addSetup(function(flashes) {
                        this.on('error', function(evt) {
                            flashes.add(evt.data.elem, 'warning', evt.data.message);
                        });
                    });
            }
        }
    });

    _context.register(FormsDI, 'FormsDI')

});
