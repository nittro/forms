_context.invoke('Nittro.Forms', function () {
    var Nette;

    if (typeof module === 'object' && typeof module.exports === 'object') {
        Nette = require('nette-forms');
    } else {
        Nette = window.Nette;
    }

    if (!Nette || !Nette.validators) {
        throw new Error('netteForms.js asset from Nette/Forms has not been loaded');
    }

    _context.register(Nette, 'Vendor');

});
