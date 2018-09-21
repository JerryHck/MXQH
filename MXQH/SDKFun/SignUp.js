var app = angular.module('access').controller('SignUpCtrl', SignUpCtrl);
SignUpCtrl.$inject = ['$scope', 'AjaxService', 'toastr', 'MyPop', 'appUrl', '$window'];
function SignUpCtrl($scope, AjaxService, toastr, MyPop, appUrl, $window) {
    var vm = this;
    vm.indextab = 2;
    vm.process = 2;

    vm.ThisTap = function (index) {
        if (index <= vm.process)
        {
            vm.indextab = index;
        }
    }

    vm.Agree = function () {
        vm.process = vm.Item.IsAgree ? 1 : 0;
        vm.indextab = vm.Item.IsAgree ? 1 : 0;
    }

    vm.Next = function (index)
    {
        vm.process = index;
        vm.indextab = index;
    }

    vm.SetImg = function (index) {
        if (index - vm.process == 1) {
            return 'Content/images/process2.png'
        }
        else if (index <= vm.process) {
            return 'Content/images/process3.png'
        }
        return 'Content/images/process1.png'
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