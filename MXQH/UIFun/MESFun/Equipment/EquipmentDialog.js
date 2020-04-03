
'use strict';
angular.module('app')
.controller('EquipmentDialogCtrl', ['$rootScope', '$scope', 'ItemData', '$uibModalInstance', 'Dialog', 'toastr', 'AjaxService', 'Form',
function ($rootScope, $scope, ItemData, $uibModalInstance, Dialog, toastr, AjaxService, Form) {
    var vm = this;
    vm.Save = Save;
    vm.Cancel = Cancel;
    Init();
    //初始化
    function Init() {
        vm.NewItem = {};
        vm.IsActive = { Table: 'AgingTestIsPass', Column: 'IsPass' };
        if (ItemData.ID) {
            vm.NewItem = angular.copy(ItemData);
        }
    }

    // #region 设备信息

    //保存
    function Save() {
        if (vm.NewItem.UpperLimit < vm.NewItem.LowerLimit) {
            toastr.error('上限数值不能小于下限数值！！');
            return;
        }
        if (!vm.NewItem.Remark) {
            vm.NewItem.Remark = '';
        }
        var en = {};
        var li = [];
        li.push(vm.NewItem);
        en.EntityInfo = JSON.stringify(li);
        en.TempColumns = "EntityInfo";
        if (vm.NewItem.ID) {//编辑操作
            vm.promise = AjaxService.ExecPlan("Equipment", "Update", en).then(function (data) {
                if (data.data[0].MsgType == "0") {
                    toastr.error(data.data[0].Msg);
                } else {
                    toastr.success(data.data[0].Msg);
                    $uibModalInstance.close("1");
                }
            }).catch(function (data) {
            });
        } else {//新增操作
            vm.promise = AjaxService.ExecPlan("Equipment", "Add", en).then(function (data) {
                if (data.data[0].MsgType == "0") {
                    toastr.error(data.data[0].Msg);
                } else {
                    var returnData = "1";
                    toastr.success(data.data[0].Msg);
                    $uibModalInstance.close("1");
                }
            }).catch(function (data) {
            });
        }
    }
    //关闭弹窗
    function Cancel() {
        $uibModalInstance.close("1");
    }

    // #endregion
}
])