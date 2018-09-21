var app = angular.module('access').controller('SignUpCtrl', SignUpCtrl);
SignUpCtrl.$inject = ['$scope', 'AjaxService', 'toastr', 'MyPop', 'appUrl', '$window'];
function SignUpCtrl($scope, AjaxService, toastr, MyPop, appUrl, $window) {
    var vm = this;

    vm.indextab = 0;

    vm.Next = function (index) {
        vm.indextab = index;
    }

    vm.SetClass = function (index)
    {

    }

    vm.SetImg = function (index) {

    }

    vm.checkAccount = function () {
        var en = {}, en2 = {};
        en.Account = vm.Item.Password;
        en2.Json = JSON.stringify(en);
        AjaxService.DoBefore("CheckAccountExists", en2).then(function (data) {
            vm.OneForm.Account.$setValidity('isExists', data.data[0].Result == 0);
        });
    }

    vm.checkPwdSign = function () {
        if (vm.Item.PasswordSign) {
            vm.OneForm.PasswordSign.$setValidity('check', vm.Item.Password == vm.Item.PasswordSign);
        }
    }

}