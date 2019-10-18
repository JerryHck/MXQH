'use strict';
angular.module('app').controller('WPOFunDialogCtrl', WPOFunDialogCtrl);

WPOFunDialogCtrl.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'Form', 'ItemData', 'toastr', 'AjaxService', '$window'];

function WPOFunDialogCtrl($rootScope, $scope, $uibModalInstance, Form, ItemData, toastr, AjaxService, $window) {
    var vm = this;
    vm.form = Form[ItemData.Id ? 1 : 0];
    vm.Item = angular.copy(ItemData);
    vm.isExists = isExists;

    if (ItemData.Id) {
        AjaxService.GetPlan("WPOPackage", { name: "MOId", value: ItemData.Id }).then(function (data) {
            vm.IsPack = data.Id;
        });
    }

    //储存
    vm.Save = function () {
        vm.Item.IsUpload = false;
        if (ItemData.Id) {
            AjaxService.PlanUpdate("WPOFun", vm.Item).then(function (data) {
                toastr.success('储存成功');
                $uibModalInstance.close(vm.Item);
            });
        }
        else {
            AjaxService.PlanInsert("WPOFun", vm.Item).then(function (data) {
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
        if (vm.Item.MO) {
            var en = { name: "MO", value: vm.Item.MO };
            AjaxService.GetPlan('WPOFun', en).then(function (data) {
                vm.DialogForm.MO.$setValidity('unique', !data.MO);
            });
        }
    }

}
