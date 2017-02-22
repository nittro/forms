_context.invoke('Nittro.Forms', function () {

    if (!window.Nette || !window.Nette.validators) {
        throw new Error('Nette/Forms vendor netteForms.js asset has not been loaded');

    }

    var VendorForms = window.Nette;
    _context.register(VendorForms, 'Vendor');

    VendorForms.validators.mimeType = function(elem, arg, val) {
        if (!val || !window.FileList || !(val instanceof window.FileList)) {
            return true;
        }

        if (!Array.isArray(arg)) {
            arg = arg.trim().split(/\s*,\s*/);
        }

        try {
            if (!val.length) return false;

            for (var i = 0; i < val.length; i++) {
                if (val.item(i).type && arg.indexOf(val.item(i).type) === -1 && arg.indexOf(val.item(i).type.replace(/\/.*/, '/*')) === -1) {
                    return false;

                }
            }
        } catch (e) {}

        return true;

    };

});
