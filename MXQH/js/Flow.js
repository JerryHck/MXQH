'use strict';
angular.module('flow', [
    'appData',
    'ngAnimate',
    'toastr',
    'cgBusy',
    'ngMessages',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ui.router',
    'FileService',
    'toggle-switch',
    'ui.bootstrap',
    'ui.load',
    'ui.jq',
    'ui.validate',
    'oc.lazyLoad',
    //'oitozero.ngSweetAlert',
    'pascalprecht.translate',
    'AjaxServiceModule',
    'ui.router.requirePolyfill',
    'AppSet',
    'FileLoad'
]);

var app = angular.module('flow');
app.config(
    ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.service = $provide.service;
        app.constant = $provide.constant;
        app.value = $provide.value;
    }
    ])

app.run(Run);

Run.$inject = ['$rootScope', '$state', '$stateParams', '$cookieStore', '$window', '$q', 'AjaxService', 'router', 'appUrl', 'Version'];
function Run($rootScope, $state, $stateParams, $cookieStore, $window, $q, AjaxService, router, appUrl, Version) {
    //获取系统license
    AjaxService.DoBefore("GetSysLic").then(function (data) {
        if (data.Type == "will") {
            toastr.warning(data.Msg);
        }
        else if (data.Type == "have") {
            toastr.error(data.Msg);
        }
        $rootScope.SysLic = data;
    });
    $rootScope.IsFlow = true;
    //获取dialog信息
    var Con = {};
    Con.planName = "Dialog";
    Con.strJson = JSON.stringify([]);
    AjaxService.DoBefore("GetPlans", Con).then(function (data) {
        $rootScope.DialogData = data;
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    })

    //获取用户信息
    AjaxService.LoginAction("GetLoginEmp").then(function (data) {
        $rootScope.User = data;
        
        //获取dialog信息
        AjaxService.GetPlans('Dialog').then(function (data) {
            $rootScope.DialogData = data;
        });
    });
}

app.config(Config);
Config.$inject = ['$stateProvider', '$urlRouterProvider', "Version"];
function Config($stateProvider, $urlRouterProvider, Version) {
    $urlRouterProvider.otherwise('/flow');
    $stateProvider
        .state('app', {
            url: '/flow',
            controllerAs: 'fo',
            controller: 'FlowMainCtrl',
            templateUrl: 'Flow/FlowMain.html' + "?v=" + Version,
            resolve: {
                deps: ['$ocLazyLoad',
                  function ($ocLazyLoad) {
                      return $ocLazyLoad.load(['js/FlowMain.js' + "?v=" + Version]);
                  }]
            }
        })
        //找回密码
        .state('app.formerr', {
            url: '/formerr',
            templateUrl: 'Flow/FlowErr.html' + "?v=" + Version,
        })
}