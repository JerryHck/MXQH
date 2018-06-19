(function () {
    angular.module('AjaxServiceModule', ['ngAnimate', 'toastr', ]);

    angular.module('AjaxServiceModule').config(appConfig);

    angular.module('AjaxServiceModule').factory('httpWatch', httpWatch);

    //httpWatch.$inject = ['$cookies'];

    function httpWatch($cookies) {
        var obj = {
            'request': function (config) {
                //if ($cookies.get('user-token')) {
                //    config.headers['x-session-token'] = $cookies.get('user-token');
                //}
                //config.headers['x-function'] = $cookies.get('function-token') || '';
                config.headers['x-session-token'] = "123fasdf";
                config.headers['x-function'] = "123fasdf";
                return config;
            }
        };
        return obj;
    }

    function appConfig($httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        //$httpProvider.defaults.headers.post['Content-Type'] = 'application / x - www - form - urlencoded';
        
        $httpProvider.defaults.transformRequest = function (data) {
            if (typeof (data) == 'undefined') {
                return data;
            }
            return $.param(data);
        }
        $httpProvider.interceptors.push(httpWatch);
    }
})();