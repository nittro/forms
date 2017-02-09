_context.invoke('Nittro.Forms.Bridges.FormsPage', function(Service, DOM) {

    var FormsMixin = {
        initForms: function (formLocator) {
            this._.formLocator = formLocator;

            DOM.addListener(document, 'submit', this._handleSubmit.bind(this));
            DOM.addListener(document, 'click', this._handleButtonClick.bind(this));
            this._.snippetManager.on('before-update', this._cleanupForms.bind(this));

        },

        sendForm: function (form, evt) {
            var frm = this._.formLocator.getForm(form);

            return this.open(form.action, form.method, frm.serialize(), {
                    event: evt,
                    element: form
                })
                .then(function () {
                    frm.reset();

                });
        },

        _handleSubmit: function (evt) {
            if (evt.defaultPrevented || !(evt.target instanceof HTMLFormElement) || !this._checkForm(evt.target) || !this._checkUrl(evt.target.action)) {
                return;

            }

            this.sendForm(evt.target, evt);

        },

        _handleButtonClick: function (evt) {
            if (evt.defaultPrevented || evt.ctrlKey || evt.shiftKey || evt.altKey || evt.metaKey || evt.button > 0) {
                return;

            }

            var btn = DOM.closest(evt.target, 'button') || DOM.closest(evt.target, 'input'),
                frm;

            if (!btn || btn.type !== 'submit' || !btn.form || !this._checkForm(btn.form)) {
                return;

            }

            frm = this._.formLocator.getForm(btn.form);
            frm.setSubmittedBy(btn.name || null);

        },

        _checkForm: function (form) {
            return this._.options.whitelistForms ? DOM.hasClass(form, 'ajax') : !DOM.hasClass(form, 'noajax');

        },

        _cleanupForms: function(evt) {
            ['remove', 'update'].forEach(function(action) {
                var id, elem;

                for (id in evt.data[action]) {
                    if (evt.data[action].hasOwnProperty(id)) {
                        elem = evt.data[action][id].element;

                        if (elem.tagName.toLowerCase() === 'form') {
                            this._.formLocator.removeForm(elem);

                        } else {
                            var forms = elem.getElementsByTagName('form'),
                                i;

                            for (i = 0; i < forms.length; i++) {
                                this._.formLocator.removeForm(forms.item(i));

                            }
                        }
                    }
                }
            }.bind(this));
        }
    };

    _context.register(FormsMixin, 'FormsMixin');
    _context.mixin(Service, FormsMixin);

}, {
    Service: 'Nittro.Page.Service',
    DOM: 'Utils.DOM'
});
