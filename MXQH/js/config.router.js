'use strict';
angular.module('app').run(Run);
Run.$inject = ['$rootScope', '$state', '$stateParams', '$cookieStore', '$window', '$q', 'AjaxService', 'router', 'appUrl', 'Version'];
function Run($rootScope, $state, $stateParams, $cookieStore, $window, $q, AjaxService, router, appUrl, Version) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $cookieStore.put('active-function', "Main");
    
    //State Change Start
    $rootScope.$on('$stateChangeStart', onStateChangeStart);
    //console.log($state.current.name)
    //檢查是否登入
    function onStateChangeStart(e, toState, toParams, fromState, fromParams) {
        if (!$cookieStore.get('user-token')) {
            $window.location.href = appUrl + 'Access.html#!/login';
        }
    }
    //获取路由信息
    AjaxService.LoginAction("GetFunRoute").then(function (data) {
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
            if ($cookieStore.get('active-router') == item.RouteName) {
                $state.go(item.RouteName);
            }
        });
    });

    //获取用户信息
    AjaxService.LoginAction("GetLoginEmp").then(function (data) {
        $rootScope.User = data;
    });

    //获取dialog信息
    AjaxService.GetPlans('Dialog').then(function (data) {
        $rootScope.DialogData = data;
    });


    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
    // 例子： 
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
    Date.prototype.Format = function (fmt) { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }



    //去除字符串头尾空格或指定字符  
    String.prototype.Trim = function (c) {
        if (c == null || c == "") {
            var str = this.replace(/^s*/, '');
            var rg = /s/;
            var i = str.length;
            while (rg.test(str.charAt(--i)));
            return str.slice(0, i + 1);
        }
        else {
            var rg = new RegExp("^" + c + "*");
            var str = this.replace(rg, '');
            rg = new RegExp(c);
            var i = str.length;
            while (rg.test(str.charAt(--i)));
            return str.slice(0, i + 1);
        }
    }
    //去除字符串头部空格或指定字符  
    String.prototype.TrimStart = function (c) {
        if (c == null || c == "") {
            var str = this.replace(/^s*/, '');
            return str;
        }
        else {
            var rg = new RegExp("^" + c + "*");
            var str = this.replace(rg, '');
            return str;
        }
    }

    //去除字符串尾部空格或指定字符  
    String.prototype.TrimEnd = function (c) {
        if (c == null || c == "") {
            var str = this;
            var rg = /s/;
            var i = str.length;
            while (rg.test(str.charAt(--i)));
            return str.slice(0, i + 1);
        }
        else {
            var str = this;
            var rg = new RegExp(c);
            var i = str.length;
            while (rg.test(str.charAt(--i)));
            return str.slice(0, i + 1);
        }
    }

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
            templateUrl: 'Basic/app_dashboard_v1.html'+ "?v=" + Version,
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