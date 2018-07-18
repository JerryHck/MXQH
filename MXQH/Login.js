
var app = angular.module('LoginApp', ['AjaxServiceModule'])

app.controller('LoginCtrl', LoginCtrl);

function LoginCtrl($scope) {
    var vm = this;
    vm.UserName = localStorage["userName"];
    vm.Pwd = localStorage["Pwd"] || "";
    vm.IsSave = localStorage["IsSave"] == 1 ? 1 : 0;;
    //登录方法
    vm.Login = function () {
        if (vm.UserName) {
            localStorage["userName"] = vm.UserName;
        }
        localStorage["Pwd"] = vm.IsSave === 1 ? vm.Pwd : "";
        localStorage["IsSave"] = vm.IsSave;
    }
}
