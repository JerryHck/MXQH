'use strict';
angular.module('app').controller('qlBadDialogCtrl', qlBadDialogCtrl);

qlBadDialogCtrl.$inject = ['$scope', '$uibModalInstance', 'Dialog', 'MyPop', 'Form', 'ItemData', 'toastr', 'AjaxService'];

function qlBadDialogCtrl($scope, $uibModalInstance, Dialog, MyPop, Form, ItemData, toastr, AjaxService) {

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
    vm.IsMaterialType = true;//默认是普通工单
   

    //从列表点击修改按钮时进行 功放类型判断
    if (vm.item.MaterialTypeID != 5) {
        vm.IsMaterialType = true;
        vm.AName = null;
        vm.BName = null;
    } else if (vm.item.MaterialTypeID == 5) {//工单功放类型
        vm.IsMaterialType = false;
        vm.AName = null;
        vm.BName = null;
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
                AjaxService.GetPlan("MESvw_qlBadAcquisition", [{ name: "BarCode", value: bc.BarCode }]).then(function (data) {
                    vm.item = data;

                    if (vm.item.MaterialTypeID !=5) {
                        vm.IsMaterialType = true;
                        vm.AName = null;
                        vm.BName = null;
                    } else if (vm.item.MaterialTypeID == 5) {//工单功放类型
                        vm.IsMaterialType = false;
                        vm.AName = null;
                        vm.BName = null;
                    }
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

        if (vm.ProcessingMode == '3') {
            MyPop.ngConfirm({ text: "条码报废将永久作废，不可再流线生产,确定要报废吗?" }).then(function (data) {
                save();
            })
        }
        else { save(); };
    }

    function save() {
        var en = {};
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

        en.WorkPartCode = vm.item.WorkPartCode;
        en.WorkPartName = vm.BName.Name;
        en.IsRepair = vm.IsRepair;
        en.WorkPartID = vm.item.WorkPartID;
        en.ExtendOne = vm.item.ExtendOne;
        en.PoorReason = vm.PoorReason;

        en.MaintenanceTtype = vm.MaintenanceTtype;//维修类型  1 功能  2 外观
        en.ProcessingMode = vm.ProcessingMode;//处理方式  1 维修 2 更换 3报废

        if (vm.IsRepair == true) {
            en.IsRepair = 1;
        } else if (vm.IsRepair == false) {
            en.IsRepair = 0;
        }

        vm.promise = AjaxService.ExecPlan("MESvw_qlBadAcquisition", "update", en).then(function (data) {
            if (data.data[0].MsgType == 'Success') {
                toastr.success(data.data[0].Msg);
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
            
            AjaxService.GetPlan('MESvw_qlBadAcquisition', [{ name: "BarCode", value: vm.BarCode }, { name: "IsRepair", value: '1' }]).then(function (data) {
                $scope.DialogForm.BarCode.$setValidity('unique', !data.BarCode);
            });
        }
    }

}
