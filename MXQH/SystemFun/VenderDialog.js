'use strict';
angular.module('app').controller('VenderDialogCtrl', VenderDialogCtrl);

VenderDialogCtrl.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'Form', 'ItemData', 'toastr', 'AjaxService', '$window'];

function VenderDialogCtrl($rootScope, $scope, $uibModalInstance, Form, ItemData, toastr, AjaxService, $window) {
    var vm = this;
    vm.form = Form[ItemData.Id ? 1 : 0];
    vm.Item = angular.copy(ItemData);
    vm.isExists = isExists;

    //储存
    vm.Save = function () {
        if (ItemData.Id) {
            AjaxService.PlanUpdate("Vender", vm.Item).then(function (data) {
                toastr.success('储存成功');
                $uibModalInstance.close(vm.Item);
            });
        }
        else {
            AjaxService.PlanInsert("Vender", vm.Item).then(function (data) {
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
        if (vm.Item.VenderSN) {
            var en = { name: "VenderSN", value: vm.Item.VenderSN };
            AjaxService.GetPlan('Vender', en).then(function (data) {
                vm.DialogForm.VenderSN.$setValidity('unique', !data.VenderSN);
            });
        }
    }

}
