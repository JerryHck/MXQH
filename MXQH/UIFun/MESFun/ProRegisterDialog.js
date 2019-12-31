'use strict';
angular.module('app').controller('ProRegisterDialogCtrl', ProRegisterDialogCtrl);

ProRegisterDialogCtrl.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'Form', 'ItemData', 'toastr', 'AjaxService'];

function ProRegisterDialogCtrl($rootScope, $scope, $uibModalInstance, Form, ItemData, toastr, AjaxService) {
    var vm = this;
    vm.form = Form[ItemData.SysNo ? 1 : 0];
    vm.Item = ItemData;
    vm.isExists = isExists;
    vm.ChangeMonitor = ChangeMonitor;
    //KeyDonwOrder
    vm.KeyDonwOrder = KeyDonwOrder;



    function KeyDonwOrder(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.SNCode) {
            var en = {};
            en.SNCode = vm.Item.SNCode;
  
            AjaxService.ExecPlan("RMOSelect", "GetSN", en).then(function (data) {
                
                if (data.data[0].MsgType == 'Error') {
                    vm.Item = undefined;
                    toastr.error(data.data[0].Msg);
                } else {
                    vm.Item.SNCode = data.data[0].SNCode;
                    vm.Item.MaterialCode = data.data[0].MaterialCode;
                    vm.Item.WorkOrder = data.data[0].WorkOrder;
                    vm.Item.MaterialName = data.data[0].MaterialName;
                    vm.Item.InternalCode = data.data[0].InternalCode;
                    vm.Item.CustomerOrder = data.data[0].CustomerOrder;
                }
                console.log(data.data);
            });
        }
    }
    //获取组织信息
    var con = [
        { name: "Layer", value: 1, },
        { name: "Layer", value: 3, action:"Or" },
        { name: "Layer", value: 5, action: "Or" },
        { name: "IsMonitor", value: 1, level: 1 }
    ];
   

    AjaxService.GetPlans("syQpoor", con).then(function (data) {
        vm.TypeList = data;
    });

    function ChangeMonitor() {
        vm.DialogItem.Ng = undefined;
        AjaxService.GetPlans("syQpoor", [{ name: "IsMonitor", value: 1 }, { name: "PID", value: vm.DialogItem.NgType }]).then(function (data) {
            vm.QpoorList = data;
        });
    }

    //储存
    vm.Save = function () {
        var en = {};
        //SNCode CustomerName MaterialName CustomerOrder InternalCode SendPlaceName

        en.SNCode = vm.Item.SNCode;//SN码
        en.WorkOrder = vm.Item.WorkOrder;//工单
        en.CustomerOrder = vm.Item.CustomerOrder;
        en.InternalCode = vm.Item.InternalCode;//内控码
        en.ProcedureCode = vm.Item.MaterialCode;
        en.ProcedureName = vm.Item.MaterialName;
        en.FirstPoor = vm.DialogItem.NgType;//不良码id
        en.SecondPoor = vm.DialogItem.Ng;//不良码id 二级
        en.PoorReason = vm.DialogItem.Reason;//不良原因
        en.CreateBy = $rootScope.User.UserNo;//
        console.log(en);
     
        vm.promise = AjaxService.ExecPlan("RMOSelect", "AddRMO", en).then(function (data) {
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
