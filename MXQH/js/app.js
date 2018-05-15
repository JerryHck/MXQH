'use strict';
angular.module('app', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'ui.load',
    'ui.jq',
    'ui.validate',
    'oc.lazyLoad',
    'pascalprecht.translate',
    'AjaxServiceModule'
]);

angular.module('app')
//APP URL
.constant('appUrl', '../')
//Service URL
//.constant('serviceUrl', '//localhost:8080/WebService2/')
.constant('serviceUrl', '//localhost:13439/')

//Template URL
.factory('templateUrl', ['$rootScope', 'appUrl', function ($rootScope, appUrl) {
    return {
        get: function (system) {
            return appUrl;
        }
    };
}])

.provider('routeResolver', ["appUrl", function (appUrl) {
    this.$get = function () {
        return this;
    };

    this.route = function () {
        function resolve(config) {
            var ctrlPath = appUrl + config.ROUTE_PATH + config.ROUTE_FILE,
                routeDef = {
                    url: config.ROUTE_URL,
                    abstract: config.ROUTE_TYPE == 'A',
                    controller: config.CONTROLLER_NAME,
                    controllerAs: config.ROUTE_TYPE == 'A' ? undefined : config.CONTROLLER_ALIAS
                };

            if (config.ROUTE_TYPE == 'A') {
                routeDef.template = '<ui-view/>';
            }
            else {
                routeDef.templateUrl = ctrlPath + '.html';

                routeDef.resolve = {
                    load: ['$q', '$rootScope', function ($q, $rootScope) {
                        var dependencies = [ctrlPath + '.js'];

                        angular.forEach(config.COMPONENT_LIST, function (item) {
                            dependencies.push(appUrl + 'Component/Customization/' + item.COMPONTENT_FILE + '.js');

                            if (item.TEMPLATE_FILE) {
                                dependencies.push(appUrl + 'Template/' + item.TEMPLATE_FILE + '.js');
                            }
                        });

                        return resolveDependencies($q, $rootScope, dependencies);
                    }],
                    defaultSystem: [function () { return config.SYSTEM_NO; }],
                    User: ['$cookies', 'AjaxService', function ($cookies, AjaxService) {
                        if (config.FUNCTION_SN) {
                            $cookies.put('function-token', config.FUNCTION_SN);
                        }
                        return AjaxService.GetUser();
                    }]
                };
            }
            return routeDef;
        }

        //Require
        function resolveDependencies($q, $rootScope, dependencies) {
            var defer = $q.defer();

            require(dependencies, function () {
                defer.resolve();
                $rootScope.$apply()
            });

            return defer.promise;
        }

        return {
            resolve: resolve
        };
    }();
}
])

