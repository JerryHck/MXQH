'use strict';
angular.module('app').controller('RMORepairctrl', RMORepairctrl);

RMORepairctrl.$inject = ['$scope', '$uibModalInstance', 'Dialog', 'Form', 'ItemData', 'toastr', 'AjaxService'];

function RMORepairctrl($scope, $uibModalInstance, Dialog, Form, ItemData, toastr, AjaxService) {
    var vm = this;
    vm.form = Form[ItemData.Id ? 1 : 0];
    vm.item = ItemData;
    vm.IsRepair = true;//默认勾上修复
    vm.isExists = isExists;
    //vm.ChangeMonitor = ChangeMonitor;
    //vm.OpenMate = OpenMate;
    vm.SelectRMO = SelectRMO;
    vm.syRPoorSelect = syRPoorSelect;
    vm.Alter = Alter;
    vm.MaintenanceTtype = '1';
    vm.ProcessingMode = '1';
    vm.IsClick = IsClick;
    vm.AddMotherboard = AddMotherboard;

    //清除input框信息
    function IsClick() {
        if (!vm.IsMotherboard) {
            vm.Motherboard = undefined;
        }    
    }

    //扫主板条码
    function AddMotherboard(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Motherboard) {
            var bc = {};
            //alert('调用成功');
            bc.Motherboard = vm.Motherboard;
       
            }
     }
    

    function syRPoorSelect(ID) {
        vm.BName = null;
        vm.promise = AjaxService.GetPlans("MESsyRPoor", GetContition4(ID)).then(function (data) {
            vm.syRPoorName = data;
        
        });
    }
    function GetContition4(ID) {
        var list = [];
        list.push({ name: "PID", value: ID });
        //{ name: "Layer", value: 4 }, { name: "IsMonitor", value: 1 },
        //list.push({ name: "Layer", value: 4 });
        //list.push({ name: "IsMonitor", value: 1 });
        return list;
    }
   

    function SelectRMO(e) {

        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.BarCode) {
            var bc = {};
            bc.BarCode = vm.BarCode;
            if (bc.BarCode == null || bc.BarCode == '') {
                toastr.error('内控码不能为空！');
            } else if (bc.BarCode != undefined) {
                AjaxService.GetPlan("SelectProRepair", [{ name: "BarCode", value: bc.BarCode }]).then(function (data) {
                    vm.item = data;
                    if (vm.item.BarCode == null) {
                        toastr.error('内控码无效，请重新输入！');
                    } else {
                        vm.BarCode = null;
                    }
                 
                });
            }
        }
    }
  
    //客退维修登记保存执行
    function Alter() {
        var en = {};
        console.log(en);
        
        en.Registerid = vm.item.ID;
        en.BarCode = vm.item.BarCode;
        en.BSN = vm.item.SNCode;
        en.WorkOrder = vm.item.WorkOrder;
        en.CustomerOrder = vm.item.CustomerOrder;
        en.CustomerID = vm.item.CustomerID;
        en.MaterialName = vm.item.MaterialName;
        en.CustomerName = vm.item.CustomerName;
        en.FirstPoorName = vm.item.FirstPoorName;
        en.SecondPoorName = vm.item.SecondPoorName;
        en.ProcedureName = vm.AName.Name;
        en.FirstPoor = vm.AName.ID;       
        en.SecondPoor = vm.BName.ID;
        en.ProcedureID = vm.item.ProcedureID;
        en.IsRepair = vm.IsRepair;
        en.RepairReason = vm.PoorReason;
        en.MaintenanceTtype = vm.MaintenanceTtype;//维修类型  1 功能  2 外观
        en.ProcessingMode = vm.ProcessingMode;//处理方式  1 维修 2 更换 3报废
        en.IsMotherboard = vm.IsMotherboard;//是否维修主板
        en.Motherboard = vm.Motherboard;//主板条码
        en.CreateBy;
        en.ModifyBy;
        if (vm.IsRepair == null) {
            vm.IsRepair = 0;
        }


        if (vm.IsRepair == true) {
            en.IsRepair = 1;
        } else if (vm.IsRepair == false) {
            en.IsRepair = 0;
        }
        console.log(en);

        vm.promise = AjaxService.ExecPlan("SelectProRepair", "update", en).then(function (data) {
            console.log(data);
            if (data.data[0].MsgType == 'Success') {
                toastr.success('已记录');
                $uibModalInstance.close(en);
            }
            else if (data.data[0].MsgType == 'Error') {
                toastr.error(data.data[0].Msg);
            }
        })


    }


    //取消
    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //验证是否存在
    function isExists() {
        if (vm.BarCode) {  
            AjaxService.GetPlan('SelectProRepair', [{ name: "BarCode", value: vm.BarCode }, { name: "IsRepair", value: '1' }]).then(function (data) {
                $scope.DialogForm.BarCode.$setValidity('unique', !data.BarCode);
            });
        }
    }

}
