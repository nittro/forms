_context.invoke('Nittro.Forms', function (DOM, Arrays) {

    if (!window.Nette || !window.Nette.validators) {
        throw new Error('Nette/Forms vendor netteForms.js asset has not been loaded');

    }

    var VendorForms = window.Nette;
    _context.register(VendorForms, 'Vendor');

    VendorForms.validators.mimeType = function(elem, arg, val) {
        if (!Array.isArray(arg)) {
            arg = arg.trim().split(/\s*,\s*/);

        }

        try {
            if (!val.length) return false;

            for (var i = 0; i < val.length; i++) {
                if (arg.indexOf(val[i].type) === -1 && arg.indexOf(val[i].type.replace(/\/.*/, '/*')) === -1) {
                    return false;

                }
            }
        } catch (e) {}

        return true;

    };

}, {
    DOM: 'Utils.DOM',
    Arrays: 'Utils.Arrays'
});
;
_context.invoke('Nittro.Forms', function(undefined) {

    var FormData = _context.extend(function() {
        this._dataStorage = [];
        this._upload = false;

    }, {
        append: function(name, value) {
            if (value === undefined || value === null) {
                return this;

            }

            if (this._isFile(value)) {
                this._upload = true;

            } else if (typeof value === 'object' && 'valueOf' in value && /string|number|boolean/.test(typeof value.valueOf()) && !arguments[2]) {
                return this.append(name, value.valueOf(), true);

            } else if (!/string|number|boolean/.test(typeof value)) {
                throw new Error('Only scalar values and File/Blob objects can be appended to FormData, ' + (typeof value) + ' given');

            }

            this._dataStorage.push({ name: name, value: value });

            return this;

        },

        isUpload: function() {
            return this._upload;

        },

        _isFile: function(value) {
            return window.File !== undefined && value instanceof window.File || window.Blob !== undefined && value instanceof window.Blob;

        },

        mergeData: function(data) {
            for (var i = 0; i < data.length; i++) {
                this.append(data[i].name, data[i].value);

            }

            return this;

        },

        exportData: function(forcePlain) {
            if (!forcePlain && this.isUpload() && window.FormData !== undefined) {
                var fd = new window.FormData(),
                    i;

                for (i = 0; i < this._dataStorage.length; i++) {
                    fd.append(this._dataStorage[i].name, this._dataStorage[i].value);

                }

                return fd;

            } else {
                return this._dataStorage.filter(function(e) {
                    return !this._isFile(e.value);

                }, this);

            }
        }
    });

    _context.register(FormData, 'FormData');

});
;
_context.invoke('Nittro.Forms', function (DOM, Arrays, DateTime, FormData, Vendor, undefined) {

    var Form = _context.extend('Nittro.Object', function (form) {
        Form.Super.call(this);

        if (typeof form === 'string') {
            form = DOM.getById(form);

        }

        if (!form || !(form instanceof HTMLFormElement)) {
            throw new TypeError('Invalid argument, must be a HTMLFormElement');

        }

        this._.form = form;
        this._.form.noValidate = 'novalidate';
        this._.submittedBy = null;

        DOM.addListener(this._.form, 'submit', this._handleSubmit.bind(this));
        DOM.addListener(this._.form, 'reset', this._handleReset.bind(this));

    }, {
        getElement: function (name) {
            return name ? this._.form.elements.namedItem(name) : this._.form;

        },

        getElements: function () {
            return this._.form.elements;

        },

        setSubmittedBy: function (value) {
            this._.submittedBy = value;
            return this;

        },

        validate: function () {
            if (!Vendor.validateForm(this._.form)) {
                return false;

            }

            var evt = this.trigger('validate');
            return !evt.isDefaultPrevented();

        },

        setValues: function (values, reset) {
            var i, elem, name, value, names = [];
            values || (values = {});

            for (i = 0; i < this._.form.elements.length; i++) {
                elem = this._.form.elements.item(i);
                name = elem.name;
                value = undefined;

                if (!name || names.indexOf(name) > -1 || elem.tagName.toLowerCase() === 'button' || elem.type in {'submit':1, 'reset':1, 'button':1, 'image':1}) {
                    continue;

                }

                names.push(name);

                if (name.indexOf('[') > -1) {
                    value = values;

                    name.replace(/]/g, '').split(/\[/g).some(function (key) {
                        if (key === '') {
                            return true;

                        } else if (!(key in value)) {
                            value = undefined;
                            return true;

                        } else {
                            value = value[key];
                            return false;

                        }
                    });
                } else if (name in values) {
                    value = values[name];

                }

                if (value === undefined) {
                    if (reset) {
                        value = null;

                    } else {
                        continue;

                    }
                }

                this.setValue(name, value);

            }
        },

        setValue: function (elem, value) {
            if (typeof elem === 'string') {
                elem = this._.form.elements.namedItem(elem);

            }

            var i,
                toStr = function(v) { return '' + v; };

            if (!elem) {
                throw new TypeError('Invalid argument to setValue(), must be (the name of) an existing form element');

            } else if (!elem.tagName) {
                if ('length' in elem) {
                    for (i = 0; i < elem.length; i++) {
                        this.setValue(elem[i], value);

                    }
                }
            } else if (elem.type === 'radio') {
                elem.checked = value !== null && elem.value === toStr(value);

            } else if (elem.type === 'file') {
                if (value === null) {
                    value = elem.parentNode.innerHTML;
                    DOM.html(elem.parentNode, value);

                }
            } else if (elem.tagName.toLowerCase() === 'select') {
                var single = elem.type === 'select-one',
                    arr = Array.isArray(value),
                    v;

                if (arr) {
                    value = value.map(toStr);

                } else {
                    value = toStr(value);

                }

                for (i = 0; i < elem.options.length; i++) {
                    v = arr ? value.indexOf(elem.options.item(i).value) > -1 : value === elem.options.item(i).value;
                    elem.options.item(i).selected = v;

                    if (v && single) {
                        break;

                    }
                }
            } else if (elem.type === 'checkbox') {
                elem.checked = Array.isArray(value) ? value.map(toStr).indexOf(elem.value) > -1 : !!value;

            } else if (elem.type === 'date') {
                elem.value = value ? DateTime.from(value).format('Y-m-d') : '';

            } else if (elem.type === 'datetime-local' || elem.type === 'datetime') {
                elem.value = value ? DateTime.from(value).format('Y-m-d\\TH:i:s') : '';

            } else {
                elem.value = value !== null ? toStr(value) : '';

            }

            return this;

        },

        serialize: function () {
            var elem, i,
                data = new FormData(),
                names = [],
                value;

            for (i = 0; i < this._.form.elements.length; i++) {
                elem = this._.form.elements.item(i);

                if (elem.name && names.indexOf(elem.name) === -1 && (elem.type === 'submit' && elem.name === this._.submittedBy || !(elem.type in {submit: 1, button: 1, reset: 1}))) {
                    names.push(elem.name);

                }
            }

            for (i = 0; i < names.length; i++) {
                elem = this._.form.elements.namedItem(names[i]);

                if (Vendor.isDisabled(elem)) {
                    continue;

                }

                value = Vendor.getEffectiveValue(elem);

                if (Array.isArray(value) || value instanceof FileList) {
                    for (var j = 0; j < value.length; j++) {
                        data.append(names[i], value[j]);

                    }
                } else {
                    data.append(names[i], value);

                }
            }

            this.trigger('serialize', data);

            return data;

        },

        submit: function (by) {
            var evt;

            if (by) {
                var btn = this._.form.elements.namedItem(by);

                if (btn && btn.type === 'submit') {
                    try {
                        evt = new MouseEvent('click', {bubbles: true, cancelable: true, view: window});

                    } catch (e) {
                    evt = document.createEvent('MouseEvents');
                    evt.initMouseEvent('click', true, true, window);

                    }

                    btn.dispatchEvent(evt);
                    return this;

                } else {
                    throw new TypeError('Unknown element or not a submit button: ' + by);

                }
            }

            try {
                evt = new Event('submit', {bubbles: true, cancelable: true});

            } catch (e) {
            evt = document.createEvent('HTMLEvents');
            evt.initEvent('submit', true, true);

            }

            this._.form.dispatchEvent(evt);

            return this;

        },

        reset: function () {
            this._.form.reset();
            return this;

        },

        _handleSubmit: function (evt) {
            if (this.trigger('submit').isDefaultPrevented()) {
                evt.preventDefault();
                return;

            }

            if (!this.validate()) {
                evt.preventDefault();

            }
        },

        _handleReset: function (evt) {
            if (evt.target !== this._.form) {
                return;

            }

            var elem, i;

            for (i = 0; i < this._.form.elements.length; i++) {
                elem = this._.form.elements.item(i);

                if (elem.type === 'hidden' && elem.hasAttribute('data-default-value')) {
                    this.setValue(elem, DOM.getData(elem, 'default-value') || '');

                } else if (elem.type === 'file') {
                    this.setValue(elem, null);

                }
            }

            this.trigger('reset');

        }
    });

    _context.register(Form, 'Form');

}, {
    DOM: 'Utils.DOM',
    Arrays: 'Utils.Arrays',
    DateTime: 'Utils.DateTime'
});
;
_context.invoke('Nittro.Forms', function (Form, Vendor) {

    var Locator = _context.extend(function () {
        this._ = {
            registry: {},
            anonId: 0
        };

        Vendor.addError = this._forwardError.bind(this);

    }, {
        getForm: function (id) {
            var elem;

            if (typeof id !== 'string') {
                elem = id;

                if (!elem.getAttribute('id')) {
                    elem.setAttribute('id', 'frm-anonymous' + (++this._.anonId));

                }

                id = elem.getAttribute('id');

            }

            if (!(id in this._.registry)) {
                this._.registry[id] = new Form(elem || id);
                this._.registry[id].on('error:default', this._handleError.bind(this));

            }

            return this._.registry[id];

        },

        removeForm: function (id) {
            if (typeof id !== 'string') {
                id = id.getAttribute('id');

            }

            if (id in this._.registry) {
                delete this._.registry[id];

            }
        },

        _forwardError: function (elem, msg) {
            var frm = this.getForm(elem.form);
            frm.trigger('error', {elem: elem, message: msg});

        },

        _handleError: function (evt) {
            this.trigger('error', { elem: evt.data.elem, message: evt.data.message });

            if (evt.data.elem && typeof evt.data.elem.focus === 'function') {
                evt.data.elem.focus();

            }
        }
    });

    _context.register(Locator, 'Locator');

});
;
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
