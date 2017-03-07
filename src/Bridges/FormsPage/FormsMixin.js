_context.invoke('Nittro.Forms.Bridges.FormsPage', function(Service, DOM) {

    var FormsMixin = {
        initForms: function (formLocator, options) {
            this._.formLocator = formLocator;
            this._.options.whitelistForms = options.whitelistForms;
            this._.options.autoResetForms = options.autoResetForms;

            DOM.addListener(document, 'submit', this._handleSubmit.bind(this));
            DOM.addListener(document, 'click', this._handleButtonClick.bind(this));
            this._.snippetManager.on('after-update', this._cleanupForms.bind(this));

        },

        sendForm: function (form, evt) {
            var frm = this._.formLocator.getForm(form);

            return this.open(form.action, form.method, frm.serialize(), {
                    event: evt,
                    element: form
                })
                .then(this._handleFormSuccess.bind(this, frm));
        },

        _handleFormSuccess: function (frm) {
            if (frm.getElement() && DOM.getData(frm.getElement(), 'reset', this._.options.autoResetForms)) {
                frm.reset();
            }
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
            if (form.getAttribute('target')) {
                return false;
            }

            return DOM.getData(form, 'ajax', !this._.options.whitelistForms);

        },

        _cleanupForms: function() {
            this._.formLocator.refreshForms();
        }
    };

    _context.register(FormsMixin, 'FormsMixin');
    _context.mixin(Service, FormsMixin);

    Service.defaults.whitelistForms = false;
    Service.defaults.autoResetForms = true;

}, {
    Service: 'Nittro.Page.Service',
    DOM: 'Utils.DOM'
});
