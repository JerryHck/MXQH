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
LoginCtrl.$inject = ['$scope', 'AjaxService', 'toastr'];
function LoginCtrl($scope, AjaxService, toastr) {
    var vm = this;
    //vm.UserName = localStorage["userName"];
    //vm.Pwd = localStorage["Pwd"] || "";
    //vm.IsSave = localStorage["IsSave"] == 1 ? 1 : 0;;
    //登录方法
    vm.Login = function () {
        if (vm.UserName) {
            localStorage["userName"] = vm.UserName;
        }
        localStorage["Pwd"] = vm.IsSave === 1 ? vm.Pwd : "";
        localStorage["IsSave"] = vm.IsSave;
    }
}
