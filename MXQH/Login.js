'use strict';

angular.module('LoginApp', [
    'appData',
    'ngAnimate',
    'toastr',
    'ngCookies',
    'ngSanitize',
    'AjaxServiceModule'
])

var app = angular.module('LoginApp').controller('LoginCtrl', LoginCtrl);
LoginCtrl.$inject = ['$scope', 'AjaxService', 'toastr', 'MyPop', 'appUrl', '$cookieStore', '$window'];
function LoginCtrl($scope, AjaxService, toastr, MyPop, appUrl, $cookieStore, $window) {

    $window.location.href = appUrl + '/Acess.html#!/login';

    var vm = this;
    var storage = $window.localStorage;
    vm.UserName = storage["userName"];
    vm.Pwd = storage["Pwd"] || "";
    vm.IsSave = storage["IsSave"] == 1 ? 1 : 0;

    vm.CusCode = RndNum(15);

    vm.reflashSecCode = reflashSecCode;
    vm.CheckCode = CheckCode;

    function RndNum(n) {
        var rnd = "";
        for (var i = 0; i < n; i++)
            rnd += Math.floor(Math.random() * 10);
        return rnd;
    }


    reflashSecCode();

    //登录方法
    vm.Login = function () {
        $cookieStore.remove('user-token');
        var en = {};
        en.User = vm.UserName;
        en.Psw = vm.Pwd;
        en.CusCode = vm.CusCode;
        en.SecCode = vm.SecCode;
        en.Kicking = "N";
        AjaxService.DoBefore("Login", en).then(function (data) {
            if (data.Name == "Error") {
                toastr.error(data.Msg);
            }
            else if (data.Name == "Error2") {
                toastr.error(data.Msg);
                //reflashSecCode();
            }
            else if (data.Name == "Login") {
                MyPop.Confirm({ text: data.Msg }, KickOut);
            }
            else if (data.Name == "Success") {
                saveCookie(data);
            }
        })
    }
    //踢出
    function KickOut() {
        var en = {};
        en.User = vm.UserName;
        en.Psw = vm.Pwd;
        en.SecCode = vm.SecCode;
        en.CusCode = vm.CusCode;
        en.Kicking = "K";
        AjaxService.DoBefore("Login", en).then(function (data) {
            if (data.Name == "Error") {
                toastr.error(data.Msg);
            }
            else if (data.Name == "Success") {
                saveCookie(data);
            }
        })
    }

    function saveCookie(data) {
        $window.localStorage["userName"] = vm.IsSave === 1 ? vm.UserName : "";
        $window.localStorage["Pwd"] = vm.IsSave === 1 ? vm.Pwd : "";
        $window.localStorage["IsSave"] = vm.IsSave;
        $cookieStore.remove('user-token');
        $cookieStore.put('user-token', data.Session);
        $window.location.href = appUrl + '/index.html';
    }

    function CheckCode()
    {
        if (vm.SecCode) {
            var en = {};
            en.CusCode = vm.CusCode;
            en.SecCode = vm.SecCode;
            AjaxService.DoBefore("CheckSecCode", en).then(function (data) {
                vm.IsOK = data.IsOk;
                console.log(data)
            })
        }
    }

    function reflashSecCode()
    {
        vm.IsOK = undefined;
        var en = {};
        en.CusCode = vm.CusCode;
        vm.SecCode = undefined;
        //验证码获取
        AjaxService.DoBefore("GenSecCodeImg", en).then(function (data) {
            vm.SecDataUrl = data.File;
        })
    }
}
