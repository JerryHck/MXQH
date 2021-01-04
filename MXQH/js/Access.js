'use strict';
angular.module('access', [
    'appData',
    'ngAnimate',
    'toastr',
    'ngMessages',
    'ngResource',
    'ngSanitize',
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    //'ui.load',
    'oc.lazyLoad',
    'AjaxServiceModule',
    'AppSet',
    'FileService',
]);

var app = angular.module('access');
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

Run.$inject = ['$rootScope', '$state', '$stateParams', 'AjaxService', 'appUrl', 'toastr', 'Version', 'router'];
function Run($rootScope, $state, $stateParams, AjaxService, appUrl, toastr, Version, router) {

    //获取URL中的参数 -- 路由名称后缀
    var thisUrl = window.location.href;
   
    var roName = null;
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

    //获取dialog信息
    var Con = {};
    Con.planName = "Dialog";
    Con.strJson = JSON.stringify([]);
    AjaxService.DoBefore("GetPlans", Con).then(function (data) {
        $rootScope.DialogData = data;
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    })

    //获取RouteConfig 信息
    var en = {};
    en.planName = "FunList";
    en.strJson = JSON.stringify([{ name: "IsBoard", value: true }]);
    //var data = AjaxService.DoBeforeWait("GetPlans", en);
    AjaxService.DoBefore("GetPlans", en).then(function (data) {
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
                //判断地址是否存在
                if (thisUrl.indexOf(item.RouteName.replace('.', '/')) > 0) {
                    roName = item.RouteName;
                }

                router.setDataRouters(route);
            }
        }
        if (roName) {
            $state.go(roName);
        }
    })
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
            templateUrl: 'UIFun/SDKFun/SdkDownloadLink.html' + "?v=" + Version,
            resolve: {
                deps: ['$ocLazyLoad',
                  function ($ocLazyLoad) {
                      return $ocLazyLoad.load(['UIFun/SDKFun/SdkDownloadLink.js' + "?v=" + Version]);
                  }]
            }
        })
         .state('app', {
             //表明此状态不能被显性激活，只能被子状态隐性激活
             //abstract: true,
             url: '/app',
             templateUrl: 'Basic/blank.html' + "?v=" + Version,
         })
        //---------------------------------------------MES组装看板
        .state('AssProBoard', {
            url: '/AssProBoard',
            controllerAs: 'wo',
            controller: 'WorkOrderBoardCtrl',
            templateUrl: 'UIFun/Board/WorkOrderBoard.html' + "?v=" + Version,
            resolve: {
                deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'ui.select',
                                'UIFun/Board/WorkOrderBoard.js' + "?v=" + Version,
                            ]).then(
                                function () {
                                    return $ocLazyLoad.load('UIFun/Board/WorkOrderBoardAss.js' + "?v=" + Version);
                                }
                            );
                        }]
            }
        })
}