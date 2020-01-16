'use strict';
angular.module('app')
.controller('QualityTDCtrl', ['$rootScope', '$scope', 'ItemData', '$uibModalInstance', 'Dialog', 'toastr', 'AjaxService', 'Form',
function ($rootScope, $scope, ItemData, $uibModalInstance, Dialog, toastr, AjaxService, Form) {
    var vm = this;
    vm.Save = Save;
    vm.Item = ItemData;
    vm.Cancel = Cancel;
    Init();
    function Init() {
        if (!vm.Item.OrderNo) {
            vm.Item.OrderNo = 0;
        }
    }
    // #region 

    //保存
    function Save() {
        var en = {};
        var li = [];
        li.push(vm.Item);
        en.EntityInfo = JSON.stringify(li);
        en.TempColumns = "EntityInfo";
        if (!vm.Item.ID) {//新增操作
            vm.promise = AjaxService.ExecPlan("QualityTemplate", "Add", en).then(function (data) {
                if (data.data[0].MsgType == "0") {
                    toastr.error(data.data[0].Msg);
                } else {
                    toastr.success(data.data[0].Msg);
                    $uibModalInstance.close("1");
                }
            });
        } else {//编辑操作
            vm.promise = AjaxService.ExecPlan("QualityTemplate", "Update", en).then(function (data) {
                if (data.data[0].MsgType == "0") {
                    toastr.error(data.data[0].Msg);
                } else {
                    toastr.success(data.data[0].Msg);
                    $uibModalInstance.close("1");
                }
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