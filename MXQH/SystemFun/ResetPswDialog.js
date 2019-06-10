'use strict';
angular.module('app').controller('ResetPswDialogCtrl', ResetPswDialogCtrl);

ResetPswDialogCtrl.$inject = ['$rootScope', '$scope', '$uibModalInstance', '$window', 'ItemData', 'toastr', 'AjaxService', 'appUrl'];

function ResetPswDialogCtrl($rootScope, $scope, $uibModalInstance, $window, ItemData, toastr, AjaxService, appUrl) {
    var vm = this;
    vm.Item = angular.copy(ItemData);
    //储存
    vm.Save = function () {
        var en = {};
        en.UserNo = vm.Item.UserNo;
        en.NewPsd = vm.Item.NewPwdSign;
        AjaxService.LoginAction("ResetPwd", en).then(function (data) {
            toastr.success('储存成功');
            $uibModalInstance.close(vm.Item);
        });
    };

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
