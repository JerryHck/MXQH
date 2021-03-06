﻿'use strict';
angular.module('Board', [
    'appData',
    'ngAnimate',
    'toastr',
    'ngMessages',
    'ngResource',
    'ngSanitize',
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'oc.lazyLoad',
    'AjaxServiceModule',
    'AppSet',
    'FileService'
]);

var app = angular.module('Board');
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

Run.$inject = ['$rootScope', '$state', '$stateParams', 'AjaxService', 'appUrl', 'Version'];
function Run($rootScope, $state, $stateParams, AjaxService, appUrl, Version) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}

app.config(Config);
Config.$inject = ['$stateProvider', '$urlRouterProvider', "Version"];
function Config($stateProvider, $urlRouterProvider, Version) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider
        .state('login', {
            url: '/login',
            controllerAs: 'Log',
            controller: 'LoginCtrl',
            templateUrl: 'Access/login.html' + "?v=" + Version,
            resolve: {
                deps: ['$ocLazyLoad',
                  function ($ocLazyLoad) {
                      return $ocLazyLoad.load(['Content/Css/Main.css', 'Access/login.js' + "?v=" + Version]);
                  }]
            }
        })
        //找回密码
        .state('forgotPsd', {
            url: '/forgotpsd',
            controllerAs: 'psd',
            controller: 'ForgotPasswordCtrl',
            templateUrl: 'Access/ForgotPassword.html' + "?v=" + Version,
            resolve: {
                deps: ['$ocLazyLoad',
                  function ($ocLazyLoad) {
                      return $ocLazyLoad.load(['Content/Css/Main.css', 'Access/ForgotPassword.js' + "?v=" + Version]);
                  }]
            }
        })
        //修改密码
        .state('changePsd', {
            url: '/changePsd',
            controllerAs: 'psd',
            controller: 'ChangePasswordCtrl',
            templateUrl: 'Access/ChangePassword.html' + "?v=" + Version,
            resolve: {
                deps: ['$ocLazyLoad',
                  function ($ocLazyLoad) {
                      return $ocLazyLoad.load(['Access/ChangePassword.js' + "?v=" + Version]);
                  }]
            }
        })
        //注册页
        .state('signup', {
            url: '/signup',
            controllerAs: 'sign',
            controller: 'SignUpCtrl',
            templateUrl: 'Access/SignUp.html' + "?v=" + Version,
            resolve: {
                deps: ['$ocLazyLoad',
                  function ($ocLazyLoad) {
                      return $ocLazyLoad.load(['Access/SignUp.js' + "?v=" + Version]);
                  }]
            }
        })
        //SDK下载
        .state('sdkdownload', {
            url: '/sdkdownload',
            controllerAs: 'sdk',
            controller: 'SdkDownloadLinkCtrl',
            templateUrl: 'SDKFun/SdkDownloadLink.html' + "?v=" + Version,
            resolve: {
                deps: ['$ocLazyLoad',
                  function ($ocLazyLoad) {
                      return $ocLazyLoad.load(['SDKFun/SdkDownloadLink.js' + "?v=" + Version]);
                  }]
            }
        })
}