'use strict';
angular.module('app').run(Run);
Run.$inject = ['$rootScope', '$state', '$stateParams', '$cookieStore', '$window', '$q', 'AjaxService', 'router', 'appUrl', 'Version'];
function Run($rootScope, $state, $stateParams, $cookieStore, $window, $q, AjaxService, router, appUrl, Version) {
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

    //console.log($state.current.name)
    //檢查是否登入
    function onStateChangeStart(e, toState, toParams, fromState, fromParams) {
        if (!$cookieStore.get('user-token')) {
            $window.location.href = appUrl + 'Access.html#!/login';
        }
    }

    function onStateChangeSuccess(e, toState, toParams, fromState, fromParams) {
        AjaxService.Custom("LogBrowse");
    }

    //获取路由信息
    AjaxService.LoginAction("GetFunRoute").then(function (data) {
        angular.forEach(data, function (item) {
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
                        loadJs.push(l.LoadName + "?v=" + Version);
                    });
                    route.LazyLoad = loadJs;
                }
                router.setDataRouters(route);
                if ($cookieStore.get('active-router') == item.RouteName) {
                    $state.go(item.RouteName);
                }
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

    //Base64 编码
    var Base64 = {
        // private property
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        // public method for encoding
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = Base64._utf8_encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            }
            return output;
        },
        // public method for decoding
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = Base64._utf8_decode(output);
            return output;
        },
        // private method for UTF-8 encoding
        _utf8_encode: function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        },
        // private method for UTF-8 decoding
        _utf8_decode: function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;
            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
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
        .state('appfull', {
            abstract: true,
            controllerAs: 'vm',
            controller: 'AppCtrl',
            url: '/appfull',
            templateUrl: 'Basic/app_full.html' + "?v=" + Version
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