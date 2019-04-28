'use strict';
angular.module('app').controller('UserDialogCtrl', UserDialogCtrl);

UserDialogCtrl.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'Form', 'ItemData', 'toastr', 'AjaxService'];

function UserDialogCtrl($rootScope, $scope, $uibModalInstance, Form, ItemData, toastr, AjaxService) {
    var vm = this;
    vm.form = Form[ItemData.UserNo ? 1 : 0];
    vm.Item = ItemData;
    vm.isExists = isExists;
    vm.Item.State = vm.Item.State || "S";
    vm.Item.Action = ItemData.UserNo ? "U" : "I";
    //储存
    vm.Save = function () {
        AjaxService.AddUser(vm.Item).then(function (data) {
            toastr.success('储存成功');
            $uibModalInstance.close(vm.Item);
        });
    };

    //取消
    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //验证是否存在
    function isExists() {
        if (vm.Item.UserNo) {
            var en = { name: "UserNo", value: vm.Item.UserNo };
            AjaxService.GetPlan('User', en).then(function (data) {
                vm.UserForm.No.$setValidity('unique', !data.UserNo);
            });
        }
    }

}
