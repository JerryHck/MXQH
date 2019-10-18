(function () {
    angular.module('AjaxServiceModule', ['appData', 'ngAnimate', 'toastr', 'ngCookies']);

    angular.module('AjaxServiceModule').config(appConfig);

    angular.module('AjaxServiceModule').factory('httpWatch', httpWatch);

    //httpWatch.$inject = ['$cookies'];

    function httpWatch($cookieStore) {
        var obj = {
            'request': function (config) {
                if ($cookieStore.get('user-token')) {
                    config.headers['x-session-token'] = $cookieStore.get('user-token');
                   
                }
                config.headers['x-function'] = $cookieStore.get('active-function') || '';
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