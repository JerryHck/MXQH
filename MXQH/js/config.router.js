'use strict';
angular.module('app').run(Run);
Run.$inject  = ['$rootScope', '$state', '$stateParams', '$cookieStore', '$window', '$q', 'AjaxService', 'router', 'appUrl', 'Version'];
function Run($rootScope, $state, $stateParams, $cookieStore, $window, $q, AjaxService, router, appUrl, Version) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    //State Change Start
    $rootScope.$on('$stateChangeStart', onStateChangeStart);

    //檢查是否登入
    function onStateChangeStart(e, toState, toParams, fromState, fromParams) {
        if (!$cookieStore.get('user-token')) {
            $window.location.href = appUrl + 'Login.html';
        }
    }

    var en = {};
    en.name = "FunType";
    en.value = 2;
    AjaxService.GetEntities("Function", en).then(function (data) {
       
        angular.forEach(data, function (item) {
            var route = {};
            route.Name = item.RouteName;
            route.Url = item.RouteUrl;
            route.Controller = item.Controller;
            route.ControllerAs = item.ControllerAs;
            route.TempleteUrl = item.FunHtml + "?v=" + Version;
            route.FunNo = item.FunNo;
            if (item.FunLoad) {
                var loadJs = [];
                angular.forEach(item.FunLoad, function (l) {
                    loadJs.push(l.LoadName + "?v=" + Version);
                });
                route.LazyLoad = loadJs;
            }
            router.setDataRouters(route);
        });
    });

}

angular.module('app').config(Config);
Config.$inject = ['$stateProvider', '$urlRouterProvider', "Version"];
function Config($stateProvider, $urlRouterProvider, Version) {
    $urlRouterProvider
        .otherwise('/app/dashboard-v1');
    $stateProvider
        .state('app', {
            //表明此状态不能被显性激活，只能被子状态隐性激活
            abstract: true,
            url: '/app',
            controllerAs: 'vm',
            controller: 'AppCtrl',
            templateUrl: 'Basic/app.html' + "?v=" + Version,
            resolve: {
                deps: ['$ocLazyLoad',
                  function ($ocLazyLoad) {
                      return $ocLazyLoad.load(['ui.select', 'ngGrid']);
                  }]
            }
        })
        .state('apps', {
            abstract: true,
            controllerAs: 'vm',
            controller: 'AppCtrl',
            url: '/apps',
            templateUrl: 'Basic/layout.html' + "?v=" + Version
        })
        //首页
        .state('app.dashboard-v1', {
            url: '/dashboard-v1',
            templateUrl: 'Basic/app_dashboard_v1.html',
            resolve: {
                deps: ['$ocLazyLoad',
                  function ($ocLazyLoad) {
                      return $ocLazyLoad.load(['js/controllers/chart.js']);
                  }]
            }
        })
        .state('app.ui', {
            url: '/ui',
            template: '<div ui-view class="fade-in-up"></div>'
        })
}