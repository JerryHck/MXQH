'use strict';
angular.module('app')
.controller('EquipCheckCtrl', ['$rootScope', '$scope', 'Dialog', 'toastr', 'AjaxService', 'Form',
function ($rootScope, $scope, Dialog, toastr, AjaxService, Form) {
    var vm = this;
    Init();
    //初始化
    function Init() {
        vm.Save = Save;
        vm.KeyDonwInCode = KeyDonwInCode;
        var dt = new Date().toLocaleDateString();
        vm.NewItem = { CheckDate:dt};
        $("input[name='Code']").focus();
        vm.MOChange = MOChange;
        vm.Cancel = Cancel;
    }

    //通过设备编码查询设备信息
    function KeyDonwInCode(e) {
        var keycode = window.event ? e.keyCode : e.which;        
        if (keycode == 13 && vm.NewItem.Code) {
            //获取设备信息
            vm.promise = AjaxService.GetPlan("Equipment", [{ name: "Code", value: vm.NewItem.Code }]).then(function (data) {                
                if (data.ID) {
                    vm.NewItem.EquipID = data.ID;
                    vm.NewItem.Code = data.Code;
                    vm.NewItem.Name = data.Name;
                    vm.NewItem.TypeID = data.TypeID;
                    vm.NewItem.Type = data.Type;
                    vm.NewItem.CheckUOM = data.CheckUOM;
                    vm.NewItem.CheckUOMName = data.CheckUOMData.Name;
                    vm.promise = AjaxService.ExecPlan("EquipMORelate", "GetList", { Code: data.Code ,pageSize:10000,pageIndex:1}).then(function (data) {
                        vm.WorkOrders = data.data;
                        console.log(data);
                    });
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
    //保存记录
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
        if (!vm.NewItem.ID)  {//新增操作
            vm.promise = AjaxService.ExecPlan("EquipCheck", "Add", en).then(function (data) {
                if (data.data[0].MsgType == "0") {
                    toastr.error(data.data[0].Msg);
                } else {
                    var returnData = "1";
                    toastr.success(data.data[0].Msg);
                    Cancel();
                }
            }).catch(function (data) {
            });
        }
    }
    //选择工单
    function MOChange(workorderID) {
        vm.promise = AjaxService.GetPlan("EquipMORelate", [{ name: "EquipID", value: vm.NewItem.EquipID }, { name: "WorkOrderID", value:workorderID}]).then(function(data) {
            vm.MOLowerLimit = data.LowerLimit;
            vm.MOUpperLimit = data.UpperLimit;
        })
    }
    //取消
    function Cancel() {
        var dt = new Date().toLocaleDateString();
        vm.NewItem = { CheckDate: dt };
        $("input[name='Code']").focus();
    }

}
])