
'use strict';
angular.module('app')
.controller('EQuipMORDCtrl', ['$rootScope', '$scope', 'ItemData', '$uibModalInstance', 'Dialog', 'toastr', 'AjaxService', 'Form',
function ($rootScope, $scope, ItemData, $uibModalInstance, Dialog, toastr, AjaxService, Form) {
    var vm = this;    
    Init();
    //初始化
    function Init() {
        vm.NewItem = {};
        if (ItemData.ID) {
            vm.NewItem = angular.copy(ItemData);
        }        
        vm.Save = Save;
        vm.Cancel = Cancel;
        vm.KeyDonwInCode = KeyDonwInCode;
    }
   
    //通过设备编码查询设备信息
    function KeyDonwInCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.NewItem.Code) {
            //获取设备信息
            vm.promise = AjaxService.GetPlan("Equipment", [{ name: "Code", value: vm.NewItem.Code }]).then(function (data) {
                console.log(data, 'data');
                if (data.ID) {
                    vm.NewItem.EquipID = data.ID;
                    vm.NewItem.Code = data.Code;
                    vm.NewItem.Name = data.Name;
                    vm.NewItem.TypeID = data.TypeID;
                    vm.NewItem.Type = data.Type;
                    vm.NewItem.CheckUOM = data.CheckUOM;
                } else {
                    vm.NewItem.EquipID = undefined;
                    vm.NewItem.Code = undefined;
                    vm.NewItem.Name = undefined;
                    vm.NewItem.TypeID = undefined;
                    vm.NewItem.Type = undefined;
                    vm.NewItem.CheckUOM = undefined;
                }
            });
        }
    }

    // #region 工单设备信息


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
            vm.promise = AjaxService.ExecPlan("EquipMORelate", "Update", en).then(function (data) {
                if (data.data[0].MsgType == "0") {
                    toastr.error(data.data[0].Msg);
                } else {
                    toastr.success(data.data[0].Msg);
                    $uibModalInstance.close("1");
                }
            }).catch(function (data) {
            });
        } else {//新增操作
            vm.promise = AjaxService.ExecPlan("EquipMORelate", "Add", en).then(function (data) {
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