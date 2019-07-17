'use strict';
angular.module('app').controller('qlBadDialogCtrl', qlBadDialogCtrl);

qlBadDialogCtrl.$inject = ['$scope', '$uibModalInstance', 'Dialog', 'Form', 'ItemData', 'toastr', 'AjaxService'];

function qlBadDialogCtrl($scope, $uibModalInstance, Dialog, Form, ItemData, toastr, AjaxService) {
    var vm = this;
    vm.form = Form[ItemData.Id ? 1 : 0];
    vm.item = ItemData;
    vm.isExists = isExists;
    //vm.ChangeMonitor = ChangeMonitor;
    //vm.OpenMate = OpenMate;
    vm.SelectqlBad = SelectqlBad;
    vm.syRPoorSelect = syRPoorSelect;
    vm.Alter = Alter;


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
        en.ID = vm.item.ID;
        en.BarCode = vm.item.BarCode;
        en.WorOrder = vm.item.WorOrder;
        en.CustomerOrder = vm.item.CustomerOrder;
        en.MaterialName = vm.item.MaterialName;
        en.CustomerName = vm.item.CustomerName;
        en.FirstPoorName = vm.item.FirstPoorName;
        en.SecondPoorName = vm.item.SecondPoorName;
        en.ProcedureName = vm.AName.Name;
        en.FirstPoor = vm.AName.ID;
        en.WorkPartName = vm.BName.Name;
        en.SecondPoor = vm.BName.ID;
        en.IsRepair = vm.IsRepair;
        en.WorkPartID = vm.item.WorkPartID;
        en.WorkPartCode = vm.item.WorkPartCode;
        en.WorkPartName = vm.item.WorkPartName;
        en.ExtendOne = vm.item.ExtendOne;
        en.PoorReason = vm.PoorReason;
      
        if (vm.IsRepair == true) {
            en.IsRepair = 1;
        } else if (vm.IsRepair == false) {
            en.IsRepair = 0;
        }
        console.log(en);

        vm.promise = AjaxService.ExecPlan("MESvw_qlBadAcquisition", "update", en).then(function (data) {
            console.log(data);
            if (data.data[0].MsgType == 'Success') {
                toastr.success('更新成功');
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
