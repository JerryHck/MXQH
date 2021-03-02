﻿'use strict';
angular.module('app').run(Run);
Run.$inject = ['$rootScope', '$state', '$stateParams', '$cookieStore', '$window', '$q', 'AjaxService', 'router', 'appUrl', 'Version'];
function Run($rootScope, $state, $stateParams, $cookieStore, $window, $q, AjaxService, router, appUrl, Version) {
    //获取地址中的token
    var token = getQueryString('token');
    //验证是否登陆
    checkLogin();

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $cookieStore.put('active-function', "Main");
    
    //State Change Start
    $rootScope.$on('$stateChangeStart', onStateChangeStart);
    $rootScope.$on('$stateChangeSuccess', onStateChangeSuccess);
    
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

    //檢查是否登入
    function onStateChangeStart(e, toState, toParams, fromState, fromParams) {
        if (!$cookieStore.get('user-token')) {
            checkLogin();
        }
    }
    function checkLogin() {
        var i = 5; var h = false;
        
        while (i > 0) {
            AjaxService.sleep(10);
            if ($cookieStore.get('user-token') && $cookieStore.get('user-token') != "") {
                h = true;
                break;
            }
            i--;
        }
        if (!h && token) {
            $cookieStore.put('user-token', token)
        }
        else if (!h) {
            $window.location.href = appUrl + 'Access.html#!/login';
        }
    }

    //获取URL中的参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }


    function onStateChangeSuccess(e, toState, toParams, fromState, fromParams) {
        AjaxService.Custom("LogBrowse");
    }

    
    //获取用户信息
    AjaxService.LoginAction("GetLoginEmp").then(function (data) {
        $rootScope.User = data;
        //获取路由信息
        AjaxService.LoginAction("GetFunRoute").then(function (data) {
            for (var i = 0, len = data.length; i < len; i++) {
                var item = data[i];
                var route = {};
                if (item.RouteName && item.RouteName != '') {
                    route.Name = item.RouteName;
                    route.Url = item.RouteUrl;
                    route.Controller = item.Controller;
                    route.ControllerAs = item.ControllerAs;
                    route.TempleteUrl = item.FunHtml + "?v=" + Version;
                    route.FunNo = item.FunNo;
                    if (item.FunLoad) {
                        var loadJs = [];
                        angular.forEach(item.FunLoad, function (l) {
                            if (l.LoadName.substr(l.LoadName.length - 3, 3).toLowerCase() == 'css' || l.LoadName.substr(l.LoadName.length - 3, 3).toLowerCase() == '.js') {
                                loadJs.push(l.LoadName + "?v=" + Version);
                            }
                            else {
                                loadJs.push(l.LoadName);
                            }
                        });
                        route.LazyLoad = loadJs;
                    }
                    router.setDataRouters(route);
                    //if ($cookieStore.get('active-router') == item.RouteName) {
                    //    $state.go(item.RouteName);
                    //}
                }
            }
            if ($cookieStore.get('active-router')) {
                $state.go($cookieStore.get('active-router'));
            }
        });

        //获取dialog信息
        AjaxService.GetPlans('Dialog').then(function (data) {
            $rootScope.DialogData = data;
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
            //abstract: true,
            url: '/app',
            controllerAs: 'vm',
            controller: 'AppCtrl',
            templateUrl: 'Basic/app.html' + "?v=" + Version,
            resolve: {
                deps: ['$ocLazyLoad',
                  function ($ocLazyLoad) {
                      return $ocLazyLoad.load(['ui.select', 'ngGrid', 'Echart']);
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
            templateUrl: 'Basic/app_mes_dashboard.html' + "?v=" + Version,
            controller: 'MesDashboardCtrl',
            controllerAs: 'mes',
            resolve: {
                //deps: ['$ocLazyLoad',
                //        function ($ocLazyLoad) {
                //            return $ocLazyLoad.load('Echart').then(
                //                function () {
                //                    return $ocLazyLoad.load('Basic/app_mes_dashboard.js');
                //                }
                //            );
                //        }],
                deps: ['$ocLazyLoad',
                  function ($ocLazyLoad) {
                      return $ocLazyLoad.load(['Basic/app_mes_dashboard.js']);
                  }]
            }
        })
        .state('app.ui', {
            url: '/ui',
            template: '<div ui-view class="fade-in-up"></div>'
        })
        //流程新增
        .state('app.flowAdd', {
          url: '/flowAdd',
          templateUrl: 'Flow/FlowAdd.html' + "?v=" + Version,
          controller: 'FlowAddCtrl',
          controllerAs: 'fo',
          resolve: {
              deps: ['$ocLazyLoad',
                function ($ocLazyLoad) {
                    return $ocLazyLoad.load(['Flow/FlowAdd.js']);
                }]
          }
        })
    ////a
    //.state('app.File', {
    //    url: '/filetest',
    //    templateUrl: 'SystemFun/FileTest.html' + "?v=" + Version,
    //    controller: "FileCtrl",
    //    controllerAs: 'file',
    //    resolve: {
    //        deps: ['$ocLazyLoad',
    //                function ($ocLazyLoad) {
    //                    return $ocLazyLoad.load([
    //                        'Scripts/SheetJs/xlsx.full.min.js',
    //                        //'Scripts/TestAngular/textAngular-rangy.min.js',
    //                        //'Scripts/modules/textAngular/textAngular-sanitize.min.js',
    //                        //'Scripts/modules/textAngular/textAngular.min.js'
    //                    ]).then(
    //                        function () {
    //                            return $ocLazyLoad.load('SystemFun/FileTest.js');
    //                        }
    //                    );
    //                }]
    //    }
    //})
}