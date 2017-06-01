define([
    'kb_common/html',
    'knockout-plus',
    'lib/ajv'
], function (
    html,
    ko,
    Ajv
) {
    'use strict';

    var t = html.tag,
        div = t('div'),
        p = t('p'),
        h1 = t('h1'),
        h2 = t('h2'),
        form = t('form'),
        label = t('label'),
        select = t('select'),
        button = t('button'),
        textarea = t('textarea');

    function template() {
        return div([
            h2('JSON Schema Validation with AJV'),
            form({
                class: 'form'
            }, [
                div({
                    class: 'form-group'
                }, [
                    label([
                        'Choose Schema'
                    ]),
                    select({
                        dataBind: {
                            options: 'schemaList',
                            optionsText: '"label"',
                            optionsValue: '"value"',
                            optionsCaption: '"Choose a schema..."',
                            value: 'selectedSchema'
                        },
                        class: 'form-control'
                    })
                ]),
                div({
                    class: 'form-group'
                }, [
                    label([
                        'Schema'
                    ]),
                    textarea({
                        dataBind: {
                            textInput: 'schemaText'
                        },
                        class: 'form-control',
                        style: {
                            height: '10em'
                        }
                    })
                ]),
                div({
                    class: 'form-group'
                }, [
                    label([
                        'JSON: '
                    ]),
                    textarea({
                        dataBind: {
                            textInput: 'json'
                        },
                        class: 'form-control',
                        style: {
                            height: '10em'
                        }
                    })

                ]),

                div([
                    button({
                        dataBind: {
                            click: 'doValidate'
                        },
                        class: 'btn btn-primary'
                    }, 'Validate')
                ])
            ])
        ]);
    }

    function viewModel(params) {
        var runtime = params.runtime;
        var schemaText = ko.observable();
        var json = ko.observable();

        var schemas = runtime.service('schema').listSchemas();

        var schemaList = schemas.map(function (schema) {
            return {
                value: schema.name,
                label: schema.name
            };
        });

        var selectedSchema = ko.observable();

        function doValidate() {
            // runtime.send('notification', 'notify', {
            //     type: type(),
            //     message: message(),
            //     autodismiss: parseInt(autodismiss())
            // });
            var validator;
            if (selectedSchema() && selectedSchema().length > 0) {
                validator = runtime.service('schema').getSchema(selectedSchema()).validator;
            } else if (schemaText() && schemaText().length > 0) {
                var schemaObject = JSON.parse(schemaText());
                var ajv = new Ajv();
                validator = ajv.compile(schemaObject);
            } else {
                runtime.send('notification', 'notify', {
                    type: 'error',
                    message: 'You gotta choose a schema or enter one in the box',
                    autodismiss: 3000
                });
                return;
            }
            var data = JSON.parse(json());
            // console.log('compiled?', validator);
            var result = validator(data);
            console.log(result);
            runtime.send('notification', 'notify', {
                type: 'success',
                message: 'Validated successfully.<br>Check the log for details.',
                autodismiss: 3000
            });
        }
        return {
            schemaText: schemaText,
            selectedSchema: selectedSchema,
            schemaList: schemaList,
            json: json,
            doValidate: doValidate
        };
    }

    function component() {
        var temp = template();
        return {
            viewModel: viewModel,
            template: temp
        };
    }
    ko.components.register('tester-schema', component());

    function factory(config) {
        var runtime = config.runtime;
        var container;

        // SERVICE API

        function attach(node) {
            container = node.appendChild(document.createElement('div'));
        }

        function start(params) {
            container.innerHTML = div([
                h1('Testing JSON Schema Validation with AJV'),
                p([
                    ''
                ]),
                div({
                    dataBind: {
                        component: {
                            name: '"tester-schema"',
                            params: {
                                runtime: 'runtime'
                            }
                        }
                    }
                })
            ]);
            ko.applyBindings({
                runtime: runtime
            }, container);
        }

        function stop() {}

        function detach() {
            if (container) {
                container.parentNode.removeChild(container);
            }
        }

        return {
            attach: attach,
            start: start,
            stop: stop,
            detach: detach
        };
    }
    return {
        make: function (config) {
            return factory(config);
        }
    };
});