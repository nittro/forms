_context.invoke('Nittro.Forms', function (DOM) {

    var DefaultErrorRenderer = _context.extend(function () {

    }, {
        addError: function (form, element, message) {
            var container = this._getErrorContainer(form, element),
                elem;

            if (container) {
                if (element && element.parentNode === container) {
                    elem = DOM.create('span', {'class': 'error'});
                } else {
                    elem = DOM.create(container.tagName.match(/^(ul|ol)$/i) ? 'li' : 'p', {'class': 'error'});
                }

                elem.textContent = message;
                container.appendChild(elem);
            }
        },

        cleanupErrors: function (form, element) {
            var container = element ? this._getErrorContainer(form, element) : form;

            if (container) {
                DOM.getByClassName('error', container)
                    .forEach(function (elem) {
                        elem.parentNode.removeChild(elem);
                    });
            }
        },

        _getErrorContainer: function (form, elem) {
            var container = elem && elem.id ? DOM.getById(elem.id + '-errors') : null;
            return container || DOM.getById(form.id + '-errors') || (elem ? elem.parentNode : null);
        }
    });

    _context.register(DefaultErrorRenderer, 'DefaultErrorRenderer');

}, {
    DOM: 'Utils.DOM'
});
