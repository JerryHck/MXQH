'use strict';
angular.module('app')
.controller('MouldDialogCtrl', ['$rootScope', '$scope', 'ItemData', '$uibModalInstance', 'Dialog', 'toastr', 'AjaxService', 'Form',
function ($rootScope, $scope, ItemData, $uibModalInstance, Dialog, toastr, AjaxService, Form) {
    var vm = this;
    vm.Item = ItemData;
    vm.Save = Save;
    vm.Cancel = Cancel;
    vm.CalDailyNum = CalDailyNum;//计算日模次
 
    if (!vm.Item.ID) {
        vm.Item.CreateBy = $rootScope.User.Name;
        vm.Item.CreateDate = new Date().toLocaleDateString();
    } else {
        vm.IsEdit = true;
        GetMouldInfo();
    }
    //根据日产能计算日模次
    function CalDailyNum() {
        vm.Item.DailyNum = Math.ceil(vm.Item.DailyCapacity/22.00);
    }
    function Save() {
        var en = {};
        var li = [];
        if (!vm.Item.SPECS) {
            vm.Item.SPECS = '';
        }
        if (!vm.Item.Remark) {
            vm.Item.Remark = '';
        }
        li.push(vm.Item);
        en.TempColumns = "Model";
        en.Model = JSON.stringify(li);
        if (!vm.Item.ID) {//新增操作
            vm.promise = AjaxService.ExecPlan("MouldInfo", "Add", en).then(function (data) {
                if (data.data[0].MsgType == "1") {
                    toastr.success(data.data[0].Msg);
                    $uibModalInstance.close('');
                } else {
                    toastr.error(data.data[0].Msg);
                }
            });
        }
    }
    function GetMouldInfo() {
        vm.promise = AjaxService.GetPlan("MouldInfo", { name: "ID", value: vm.Item.ID }).then(function (data) {
            vm.Item = data;
            vm.Item.TotalNum = vm.Item.TotalNum;
        });
    }
    //退出弹出框
    function Cancel(item) {
        $uibModalInstance.close(item);
    }
}
])