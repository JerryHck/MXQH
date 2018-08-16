'use strict';
angular.module('app').controller('ChangePswDialogCtrl', ChangePswDialogCtrl);

ChangePswDialogCtrl.$inject = ['$rootScope', '$scope', '$uibModalInstance', '$window', 'ItemData', 'toastr', 'AjaxService', 'appUrl'];

function ChangePswDialogCtrl($rootScope, $scope, $uibModalInstance, $window, ItemData, toastr, AjaxService, appUrl) {
    var vm = this;
    vm.Item = angular.copy($rootScope.User);
    //储存
    vm.Save = function () {
        var en = {};
        en.pwd = vm.Item.UserPwd;
        en.newPwd = vm.Item.NewPwdSign;
        AjaxService.LoginAction("ChangePwd", en).then(function (data) {
            toastr.success('储存成功');
            setTimeout(function () {
                $window.location.href = appUrl + 'Login.html';}, 500)
        });
    };

    vm.checkPsw = function () {
        var en = {};
        en.user = vm.Item.UserNo;
        en.pwd = vm.Item.UserPwd;
        AjaxService.LoginAction("CheckPwd", en).then(function (data) {
            vm.PswForm.pwd.$setValidity('check', data.Name == 'Success');
        });
    }

    vm.checkNewPwd = function () {
        vm.PswForm.newPwd.$setValidity('check', vm.Item.UserPwd != vm.Item.NewPwd);
    }

    vm.checkNewPwdSign = function () {
        vm.PswForm.newPwdSign.$setValidity('check', vm.Item.NewPwd == vm.Item.NewPwdSign);
    }

    //取消
    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}
