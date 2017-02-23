_context.invoke('Nittro.Forms', function () {

    if (!window.Nette || !window.Nette.validators) {
        throw new Error('Nette/Forms vendor netteForms.js asset has not been loaded');

    }

    var VendorForms = window.Nette;
    _context.register(VendorForms, 'Vendor');

    VendorForms.validators.mimeType = function(elem, arg, val) {
        if (!val || !window.File || val.length && !(val[0] instanceof window.File)) {
            return true;
        }

        if (!Array.isArray(arg)) {
            arg = arg.trim().split(/\s*,\s*/g);
        }

        try {
            if (!val.length) return false;

            for (var i = 0; i < val.length; i++) {
                if (val[i].type && arg.indexOf(val[i].type) === -1 && arg.indexOf(val[i].type.replace(/\/.*/, '/*')) === -1) {
                    return false;

                }
            }
        } catch (e) {}

        return true;

    };

});
