'use strict';
angular.module('app').controller('RoleDialogCtrl', RoleDialogCtrl);

RoleDialogCtrl.$inject = ['$scope', '$uibModalInstance', 'Form', 'ItemData', 'toastr', 'AjaxService'];

function RoleDialogCtrl($scope, $uibModalInstance, Form, ItemData, toastr, AjaxService) {
    var vm = this;
    vm.form = Form[ItemData.RoleSn ? 1 : 0];
    vm.Item = ItemData;
    vm.Item.Action = ItemData.RoleSn ? "U" : "I";
    vm.Item.State = vm.Item.State || "S";
    vm.Item.RoleSn = vm.Item.RoleSn || "-1";
    vm.Item.SNColumns = "[{col:\"RoleSn\", parm:\"RoleSn\"}]";
    //储存
    vm.Save = function () {
        if (vm.Item.Action == "I") {
            AjaxService.PlanInsert("Role", vm.Item).then(function (data) {
                toastr.success('储存成功');
                $uibModalInstance.close(vm.Item);
            });
        }
        else {
            AjaxService.PlanUpdate("Role", vm.Item).then(function (data) {
                toastr.success('储存成功');
                $uibModalInstance.close(vm.Item);
            });
        }
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
