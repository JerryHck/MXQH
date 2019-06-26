'use strict';
angular.module('app').controller('MaterialDialogCtrl', MaterialDialogCtrl);

MaterialDialogCtrl.$inject = ['$scope', '$uibModalInstance', 'Dialog', 'Form', 'ItemData', 'toastr', 'AjaxService'];

function MaterialDialogCtrl($scope, $uibModalInstance, Dialog, Form, ItemData, toastr, AjaxService) {
    var vm = this;
    vm.form = Form[ItemData.Id ? 1 : 0];
    vm.Item = ItemData;
    vm.isExists = isExists;
    vm.ChangeMonitor = ChangeMonitor;
    vm.OpenMate = OpenMate;

    //获取组织信息

    AjaxService.GetPlans("syQpoor", [{ name: "Layer", value: 1 }, { name: "IsMonitor", value: 1 }]).then(function (data) {
        vm.TypeList = data;
    });

    function ChangeMonitor() {
        vm.DialogItem.Ng = undefined;
        AjaxService.GetPlans("syQpoor", [{ name: "Layer", value: 2 }, { name: "IsMonitor", value: 1 }, { name: "PID", value: vm.DialogItem.NgType }]).then(function (data) {
            vm.QpoorList = data;
        });
    }

    function OpenMate() {
        Dialog.OpenDialog("MaterialDialog", {}).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }

    //储存
    vm.Save = function () {
        var en = {};
        en.InternalCode = vm.Item.InCode;
        en.ProcedureID = vm.Item.ProcedureItem.boProcedureID;
        en.FirstPoor = vm.DialogItem.NgType;
        en.SecondPoor = vm.DialogItem.Ng;
        en.ThridPoor = 0;
        en.PoorReason = vm.DialogItem.Reason;

        console.log(en);

        vm.promise = AjaxService.ExecPlan("MESOrderOnLine", "saveNg", en).then(function (data) {
            if (data.data[0].MsgType == 'Success') {
                toastr.success('储存成功');
                $uibModalInstance.close(en);
            }
            else if (data.data[0].MsgType == 'Error') {
                toastr.error(data.data[0].Msg);
            }
        })
    };

    //取消
    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //验证是否存在
    function isExists() {
        if (vm.Item.SysNo) {
            var en = { name: "SysNo", value: vm.Item.SysNo };
            AjaxService.GetPlan('System', en).then(function (data) {
                $scope.SystemForm.No.$setValidity('unique', !data.SysNo);
            });
        }
    }

}
