define([
    'kb_common/html'
], function (
    html
) {
    'use strict';

    var t = html.tag,
        div = t('div'),
        ul = t('ul'),
        li = t('li'),
        a = t('a');

    function factory(config) {
        var runtime = config.runtime;
        var container;

        function attach(node) {
            container = node;
        }

        function start(params) {
            container.innerHTML = div([
                ul([
                    li(a({
                        href: '#tester/notifications'
                    }, 'Notifications')),
                    li(a({
                        href: '#tester/schema'
                    }, 'Schema'))
                ])
            ]);
        }

        function stop() {}

        function detach() {
            container.innerHTML = '';
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