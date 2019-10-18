'use strict';
angular.module('app').controller('MateDialogCtrl', MateDialogCtrl);

MateDialogCtrl.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'Form', 'ItemData', 'toastr', 'AjaxService', '$window'];

function MateDialogCtrl($rootScope, $scope, $uibModalInstance, Form, ItemData, toastr, AjaxService, $window) {
    var vm = this;
    vm.form = Form[ItemData.Id ? 1 : 0];
    vm.Item = angular.copy(ItemData);
    vm.isExists = isExists;

    //储存
    vm.Save = function () {
        vm.Item.IsUpload = false;
        if (ItemData.Id) {
            AjaxService.PlanUpdate("WPOMate", vm.Item).then(function (data) {
                toastr.success('储存成功');
                $uibModalInstance.close(vm.Item);
            });
        }
        else {
            AjaxService.PlanInsert("WPOMate", vm.Item).then(function (data) {
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
        if (vm.Item.MateCode) {
            var en = { name: "AucMateCode", value: vm.Item.MateCode };
            AjaxService.GetPlan('WPOMate', en).then(function (data) {
                vm.DialogForm.MateCode.$setValidity('unique', !data.MateCode);
            });
        }
    }

}
