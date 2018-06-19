'use strict';
angular.module('app').run(Run);
Run.$inject  = ['$rootScope', '$state', '$stateParams', '$cookieStore', '$window', '$q', 'AjaxService', 'router'];
function Run($rootScope, $state, $stateParams, $cookieStore, $window, $q, AjaxService, router) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    //State Change Start
    $rootScope.$on('$stateChangeStart', onStateChangeStart);

    //檢查是否登入
    function onStateChangeStart(e, toState, toParams, fromState, fromParams) {
        $cookieStore.put('function-token', "123dfaskldfj");
    }

    AjaxService.GetTbViewList("Sys_Function").then(function (data) {
        console.log(data.data);
        console.log($cookieStore.get("function-token"));

        var route = {};
        route.Name = "app.System";
        route.Url = "/system";
        route.TempleteUrl = "SystemFun/System.html";
        route.LazyLoad = ['uiGrid', 'SystemFun/System.js']
        router.setDataRouters(route);
    });
}

angular.module('app').config(Config);
Config.$inject = ['$stateProvider', '$urlRouterProvider'];
function Config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
        .otherwise('/app/dashboard-v1');
    $stateProvider
        .state('app', {
            //表明此状态不能被显性激活，只能被子状态隐性激活
            abstract: true,
            url: '/app',
            controllerAs: 'vm',
            controller: 'AppCtrl',
            templateUrl: 'tpl/app.html',
        })

        .state('app.dashboard-v1', {
            url: '/dashboard-v1',
            templateUrl: 'tpl/app_dashboard_v1.html',
            resolve: {
                deps: ['$ocLazyLoad',
                  function ($ocLazyLoad) {
                      return $ocLazyLoad.load(['js/controllers/chart.js']);
                  }]
            }
        })
        .state('app.dashboard-v2', {
            url: '/dashboard-v2',
            templateUrl: 'tpl/app_dashboard_v2.html',
            resolve: {
                deps: ['$ocLazyLoad',
                  function ($ocLazyLoad) {
                      return $ocLazyLoad.load(['js/controllers/chart.js']);
                  }]
            }
        })
}