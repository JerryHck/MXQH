'use strict';
angular.module('app').controller('SystemDialogCtrl', SystemDialogCtrl);

SystemDialogCtrl.$inject = ['$scope', '$uibModalInstance', 'Form', 'ItemData', 'toastr', 'AjaxService'];

function SystemDialogCtrl($scope, $uibModalInstance, Form, ItemData, toastr, AjaxService) {
    var vm = this;
    vm.form = Form[ItemData.SysNo ? 1 : 0];
    vm.Item = ItemData;
    vm.isExists = isExists;

    //获取组织信息
    if (vm.form.index == 0) {
        AjaxService.GetEntities("Company").then(function (data) {
            vm.CompanyList = data;
        });
    }

    //储存
    vm.Save = function () {
        var en = {};
        en.SysNo = vm.Item.SysNo;
        en.SysName = vm.Item.SysName;
        en.SysDesc = vm.Item.SysDesc;
        en.CompanyNo = vm.Item.Company.CompanyNo;
        en.CreateBy = "SYS";
        AjaxService.Action('Sys_System', en, vm.form.action).then(function (data) {
            toastr.success('储存成功');
            $uibModalInstance.close(en);
        });
    };

    //取消
    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //验证是否存在
    function isExists() {
        if (vm.Item.SysNo) {
            var en  = { name: "SysNo", value: vm.Item.SysNo };
            AjaxService.GetTbView('Sys_System', en).then(function (data) {
                $scope.SystemForm.No.$setValidity('unique', !data);
            });
        }
    }

}
