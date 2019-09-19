'use strict';

angular.module('access').controller('LoginCtrl', LoginCtrl);
LoginCtrl.$inject = ['$rootScope', '$scope', 'AjaxService', 'toastr', 'MyPop', 'appUrl', '$cookieStore', '$window', '$state'];
function LoginCtrl($rootScope, $scope, AjaxService, toastr, MyPop, appUrl, $cookieStore, $window, $state) {
    var vm = this;
    var storage = $window.localStorage;
    vm.UserName = storage["userName"];
    vm.Pwd = storage["Pwd"] || "";
    vm.IsSave = storage["IsSave"] == 1 ? 1 : 0;

    vm.CusCode = RndNum(15);

    vm.reflashSecCode = reflashSecCode;
    vm.CheckCode = CheckCode;
    vm.Go = Go;
    vm.KeyDonw = KeyDonw;
    vm.Login = Login;
    function RndNum(n) {
        var rnd = "";
        for (var i = 0; i < n; i++)
            rnd += Math.floor(Math.random() * 10);
        return rnd;
    }

    reflashSecCode();

    //登录方法
    function Login() {
        if ($rootScope.SysLic.Type == "have") {
            toastr.error($rootScope.SysLic.Msg);
            return;
        }
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
                reflashSecCode();
            }
            else if (data.Name == "Error2") {
                toastr.error(data.Msg);
                reflashSecCode();
            }
            else if (data.Name == "Login") {
                MyPop.Confirm({ text: data.Msg }, KickOut);
            }
            else if (data.Name == "Success") {
                saveCookie(data);
            }
        })
    };
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
        });
    }

    function saveCookie(data) {
        $window.localStorage["userName"] = vm.IsSave === 1 ? vm.UserName : "";
        $window.localStorage["Pwd"] = vm.IsSave === 1 ? vm.Pwd : "";
        $window.localStorage["IsSave"] = vm.IsSave;
        $cookieStore.remove('user-token');
        $cookieStore.put('user-token', data.Session);
        $window.location.href = appUrl + '/index.html?v=' + (new Date().getSeconds()).toString();
        // 保存唯一标识符
        $cookieStore.remove("GUID")
        $cookieStore.put("GUID", uuid());
    }

    function CheckCode() {
        if (vm.SecCode) {
            var en = {};
            en.CusCode = vm.CusCode;
            en.SecCode = vm.SecCode;
            AjaxService.DoBefore("CheckSecCode", en).then(function (data) {
                vm.IsOK = data.IsOk;
            });
        }
    }

    function reflashSecCode() {
        vm.IsOK = undefined;
        var en = {};
        en.CusCode = vm.CusCode;
        vm.SecCode = undefined;
        //验证码获取
        AjaxService.DoBefore("GenSecCodeImg", en).then(function (data) {
            vm.SecDataUrl = data.File;
        });
    }

    function KeyDonw(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.SecCode && vm.UserName && vm.Pwd) {
            Login();
        }
    }
    
    //唯一标识信息 登陆时生成与保存
    function uuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010  
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01  
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }

    function Go(name) {
        $state.go(name);
    }
}