define([
    'kb_common/html',
    'knockout-plus'
], function (
    html,
    ko
) {
    'use strict';

    var t = html.tag,
        div = t('div'),
        p = t('p'),
        h1 = t('h1'),
        form = t('form'),
        label = t('label'),
        input = t('input'),
        select = t('select'),
        button = t('button');

    function template() {
        return div({}, [
            form({
                class: 'form'
            }, [
                div({
                    class: 'form-group'
                }, [
                    label(
                        'Type: '),
                    select({
                        dataBind: {
                            options: 'typeList',
                            optionsText: '"label"',
                            optionsValue: '"value"',
                            optionsCaption: '"Select a notification type..."',
                            value: 'type'
                        },
                        class: 'form-control'
                    })
                ]),
                div({
                    class: 'form-group'
                }, [
                    label('ID'),
                    input({
                        dataBind: {
                            textInput: 'id'
                        },
                        class: 'form-control'
                    })
                ]),
                div({
                    class: 'form-group'
                }, [
                    label('Message'),
                    input({
                        dataBind: {
                            textInput: 'message'
                        },
                        class: 'form-control'
                    })
                ]),
                div({
                    class: 'form-group'
                }, [
                    label('Autodismiss'),
                    input({
                        dataBind: {
                            textInput: 'autodismiss'
                        },
                        class: 'form-control'
                    })
                ]),

                div([
                    button({
                        dataBind: {
                            click: 'doSend'
                        },
                        class: 'btn btn-primary'
                    }, 'Send')
                ])
            ])
        ]);
    }

    function viewModel(params) {
        var runtime = params.runtime;
        var type = ko.observable();
        var message = ko.observable();
        var id = ko.observable();
        var autodismiss = ko.observable();

        var typeList = [{
                value: 'success',
                label: 'Success'
            },
            {
                value: 'info',
                label: 'Informational'
            },
            {
                value: 'warning',
                label: 'Warning'
            },
            {
                value: 'error',
                label: 'Error'
            },
        ];

        function doSend() {
            var autodismissValue;
            if (autodismiss()) {
                autodismissValue = parseInt(autodismiss());
            } else {
                autodismissValue = null;
            }
            runtime.send('notification', 'notify', {
                type: type(),
                id: id(),
                message: message(),
                autodismiss: autodismissValue
            });
        }
        return {
            type: type,
            id: id,
            typeList: typeList,
            message: message,
            autodismiss: autodismiss,
            doSend: doSend
        };
    }

    function component() {
        var temp = template();
        return {
            viewModel: viewModel,
            template: temp
        };
    }
    ko.components.register('tester-notifications', component());

    function factory(config) {
        var runtime = config.runtime;
        var container;



        // SERVICE API

        function attach(node) {
            container = node.appendChild(document.createElement('div'));
        }

        function start(params) {
            container.innerHTML = div({
                class: 'container-fluid'
            }, [
                div({
                    class: 'row'
                }, [
                    div({
                        class: 'col-md-12'
                    }, [
                        h1('Testing Notifications')
                    ])
                ]),
                div({
                    class: 'row'
                }, [
                    div({
                        class: 'col-md-6'
                    }, [
                        p([
                            'This page lets you send notifications to the notification widget in order ',
                            'to guage its behavior.'
                        ]),
                        p([
                            'Use the form to the right to send notification messages to the ui.'
                        ])
                    ]),
                    div({
                        class: 'col-md-6'
                    }, div({
                        dataBind: {
                            component: {
                                name: '"tester-notifications"',
                                params: {
                                    runtime: 'runtime'
                                }
                            }
                        }
                    }))
                ])
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