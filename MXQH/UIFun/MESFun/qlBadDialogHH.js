'use strict';
angular.module('app').controller('qlBadDialogHHCtrl', qlBadDialogHHCtrl);

qlBadDialogHHCtrl.$inject = ['$scope', '$uibModalInstance', 'Dialog', 'Form', 'ItemData', 'toastr', 'AjaxService'];

function qlBadDialogHHCtrl($scope, $uibModalInstance, Dialog, Form, ItemData, toastr, AjaxService) {
    var vm = this;
    vm.form = Form[ItemData.Id ? 1 : 0];
    vm.item = ItemData;
    vm.IsRepair = true;//默认勾上修复
    vm.isExists = isExists;
    //vm.ChangeMonitor = ChangeMonitor;
    //vm.OpenMate = OpenMate;
    vm.SelectqlBad = SelectqlBad;
    vm.syRPoorSelect = syRPoorSelect;
    vm.Alter = Alter;
    vm.MaintenanceTtype = '1';
    vm.ProcessingMode = '1';

    function syRPoorSelect(ID) {
        vm.BName = null;
        vm.promise = AjaxService.GetPlans("MESsyRPoor", GetContition4(ID)).then(function (data) {
            vm.syRPoorName = data;
           
        });

    }
    function GetContition4(ID) {
        var list = [];
        list.push({ name: "PID", value: ID });
        return list;
    }
   

    function SelectqlBad(e) {

        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.BarCode) {
            var bc = {};
            bc.BarCode = vm.BarCode;
            if (bc.BarCode == null || bc.BarCode == '') {
                toastr.error('内控码不能为空！');
            } else if (bc.BarCode != undefined) {
                AjaxService.GetPlan("MESvw_qlBadAcquisitionHH", [{ name: "BarCode", value: bc.BarCode }]).then(function (data) {
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
  

    function Alter() {
        var en = {};
        console.log(en);
        
        en.ID = vm.item.ID;
        en.BarCode = vm.item.BarCode;
        en.WorOrder = vm.item.WorOrder2;
        en.CustomerOrder = vm.item.CustomerOrder2;
        en.MaterialName = vm.item.MaterialName;
        en.CustomerName = vm.item.CustomerName;
        en.FirstPoorName = vm.item.FirstPoorName;
        en.SecondPoorName = vm.item.SecondPoorName;
        en.ProcedureName = vm.AName.Name;
        en.FirstPoor = vm.AName.ID;       
        en.SecondPoor = vm.BName.ID;
        en.ProcedureID = vm.item.ProcedureID;
        if (vm.IsRepair == null) {
            vm.IsRepair = 0;
        }

        en.ProcedureCode = vm.item.ProcedureCode;
        en.ProcdureName = vm.AName.Name;
        //console.log(en.ProcdureName);
        //console.log(en.ProcedureID);
        
        en.WorkPartCode = vm.item.WorkPartCode;
        en.WorkPartName = vm.BName.Name;
        console.log(en.WorkPartName);
        en.IsRepair = vm.IsRepair;
        en.WorkPartID = vm.item.WorkPartID;
        en.ExtendOne = vm.item.ExtendOne;
        en.PoorReason = vm.PoorReason;

        en.MaintenanceTtype = vm.MaintenanceTtype;//维修类型  1 功能  2 外观
        en.ProcessingMode = vm.ProcessingMode;//处理方式  1 维修 2 更换 3报废
    
        en.CreateBy;
        en.ModifyBy;    
        if (vm.IsRepair == true) {
            en.IsRepair = 1;
        } else if (vm.IsRepair == false) {
            en.IsRepair = 0;
        }
        console.log(en);

        vm.promise = AjaxService.ExecPlan("MESvw_qlBadAcquisitionHH", "update", en).then(function (data) {
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
            AjaxService.GetPlan('MESvw_qlBadAcquisitionHH', [{ name: "BarCode", value: vm.BarCode }, { name: "IsRepair", value: '1' }]).then(function (data) {
                $scope.DialogForm.BarCode.$setValidity('unique', !data.BarCode);
            });
        }
    }

}
