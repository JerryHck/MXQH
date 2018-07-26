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
    var vm = this;
    var storage = $window.localStorage;
    vm.UserName = storage["userName"];
    vm.Pwd = storage["Pwd"] || "";
    vm.IsSave = storage["IsSave"] == 1 ? 1 : 0;

    vm.test = angular.extend(vm.test || {}, {name: "测试题"});

    //登录方法
    vm.Login = function () {
        $cookieStore.remove('user-token');
        AjaxService.Login(vm.UserName, vm.Pwd).then(function (data) {
            if (data.Name == "Error") {
                toastr.error(data.Msg);
            }
            else if (data.Name == "Login") {
                MyPop.Confirm({ text: data.Msg }, KickOut);
            }
            else if (data.Name == "Success") {
                storage["userName"] = vm.IsSave === 1? vm.UserName : "";
                storage["Pwd"] = vm.IsSave === 1 ? vm.Pwd : "";
                storage["IsSave"] = vm.IsSave;
                $cookieStore.put('user-token', data.Session);
                $window.location.href = appUrl + '/index.html';
            }
        })
    }
    //踢出
    function KickOut(){
        AjaxService.Login(vm.UserName, vm.Pwd, "K").then(function (data) {
            if (data.Name == "Error") {
                toastr.error(data.Msg);
            }
            else if (data.Name == "Success") {
                storage["userName"] = vm.IsSave === 1 ? vm.UserName : "";
                storage["Pwd"] = vm.IsSave === 1 ? vm.Pwd : "";
                storage["IsSave"] = vm.IsSave;
                $cookieStore.put('user-token', data.Session);
                $window.location.href = appUrl + '/index.html';
            }
        })
    }
}
