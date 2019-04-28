'use strict';
angular.module('app').controller('SystemDialogCtrl', SystemDialogCtrl);

SystemDialogCtrl.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'Form', 'ItemData', 'toastr', 'AjaxService'];

function SystemDialogCtrl($rootScope, $scope, $uibModalInstance, Form, ItemData, toastr, AjaxService) {
    var vm = this;
    vm.form = Form[ItemData.SysNo ? 1 : 0];
    vm.Item = angular.copy(ItemData);
    vm.isExists = isExists;

    //储存
    vm.Save = function () {
        var en = {};
        en.SysNo = vm.Item.SysNo;
        en.SysName = vm.Item.SysName;
        en.SysDesc = vm.Item.SysDesc;
        en.CompanyNo = vm.Item.Company.CompanyNo;
        en.OrderNo = vm.Item.OrderNo;
        en.IsUsed = vm.Item.IsUsed;
        if (vm.form.index == 0) {
            AjaxService.PlanInsert('System', en).then(function (data) {
                toastr.success('储存成功');
                //更新功能基本信息
                AjaxService.LoginAction("ReInit");
                $uibModalInstance.close(en);
            });
        }
        else if(vm.form.index == 1) {
            AjaxService.PlanUpdate('System', en).then(function (data) {
                toastr.success('储存成功');
                //更新功能基本信息
                AjaxService.LoginAction("ReInit");
                $uibModalInstance.close(en);
            });
        }
        
    };

    //取消
    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //验证是否存在
    function isExists() {
        if (vm.Item.SysNo) {
            var en  = { name: "SysNo", value: vm.Item.SysNo };
            AjaxService.GetPlan('System', en).then(function (data) {
                $scope.SystemForm.No.$setValidity('unique', !data.SysNo);
            });
        }
    }

}
