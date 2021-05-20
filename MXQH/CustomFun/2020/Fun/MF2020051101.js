'use strict';

angular.module('app')
.controller('AssReWorkCtrl', ['$rootScope', '$scope', '$timeout', 'Dialog', 'toastr', 'AjaxService', 'MyPop',
function ($rootScope, $scope, $timeout, Dialog, toastr, AjaxService, MyPop) {

    var vm = this;
    vm.Item = {};
    vm.MesList = [];
    vm.Focus = { Order: false, InCode: true, SN: false };
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.IsAuto = true;

    vm.NgSave = NgSave;
    vm.ChangePro = ChangePro;
    vm.IsFisnish = true;
    vm.KeyDonwInCodeNg = KeyDonwInCodeNg;

    //不良条码扫描
    function KeyDonwInCodeNg(e) {
        $scope.$applyAsync(function () {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13 && vm.Item.NgInCode) {
                var en = {};
                en.InternalCode = vm.Item.NgInCode;
                AjaxService.ExecPlan("MesMxWOrder", 'reWork', en).then(function (data) {
                    if (data.data[0].MsgType == 'Error') {
                        vm.Item.NgInCode = undefined;
                        showError(data.data[0].Msg);
                    }
                    else if (data.data[0].MsgType == 'Success') {
                        vm.OrderData = data.data1[0];
                        vm.ProcedureList = data.data2;
                        vm.ProcedureItem = vm.ThisWo == vm.OrderData.ID ? vm.ProcedureItem : undefined;
                        vm.ThisWo = vm.OrderData.ID;
                        ChangePro(vm.ProcedureItem);
                        NgSave();
                    }
                });
            }
        });
    }

    function showError(mes) {
        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mes });
        AjaxService.PlayVoice('error.mp3');
        toastr.error(mes);
    }

    function ChangePro(item) {
        if (item == undefined) return false;
        var en = {};
        en.WorkOrderId = vm.ThisWo;
        en.RouteId = item.ID;
        en.ProcedureID = item.boProcedureID;
        //console.log(en);
        AjaxService.ExecPlan("MesMxWOrder", "sum", en, false).then(function (data) {
            //console.log(data);
            //vm.PassCount = data.data[0].TotalCount;
            vm.CalData = data.data[0];
        });
    }

    //返工
    function NgSave() {
        var en = {};
        if (!vm.ProcedureItem) {
            showError("请先选择返工工序");
            vm.Item.InCode = undefined;
            vm.Item.NgInCode = undefined;
            vm.InCodeControl = undefined;
            return;
        }
        var item = { InCode: vm.Item.NgInCode, ProcedureItem: vm.ProcedureItem, OrderData: vm.OrderData };
        vm.NgItem = item;
        $(".bsn-ng").addClass("active");
    }

    //============================================================不良登记
    //储存
    vm.BSNngSave = BSNngSave;
    vm.ChangeMonitor = ChangeMonitor;
    //获取组织信息
    function ChangeMonitor() {
        vm.DialogItem.Ng = undefined;
        AjaxService.GetPlans("syQpoor", [{ name: "Layer", value: 2 }, { name: "IsMonitor", value: 1 }, { name: "PID", value: vm.DialogItem.NgType }]).then(function (data) {
            vm.QpoorList = data;
            BSNngSave();
        });
    }
    AjaxService.GetPlans("syQpoor", [{ name: "Layer", value: 1 }, { name: "IsMonitor", value: 1 }]).then(function (data) {
        vm.TypeList = data;
    });

    //储存
    function BSNngSave() {
        if (!vm.DialogItem || !vm.DialogItem.NgType) {
            toastr.error("还没有选择不良项");
            return;
        }

        var en = {};
        en.InternalCode = vm.NgItem.InCode;
        en.ProcedureID = vm.NgItem.ProcedureItem.boProcedureID;
        en.FirstPoor = vm.DialogItem.NgType;
        en.SecondPoor = vm.DialogItem.Ng || 0;
        en.ThridPoor = 0;
        en.PoorReason = vm.DialogItem.Reason;

        vm.promise = AjaxService.ExecPlan("MesMxWOrder", "saveReWork", en).then(function (data) {
            console.log(data)
            if (data.data[0].MsgType == 'Success') {
                toastr.success('储存成功');
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: "编码[" + en.InternalCode + "]返工不良成功" });
                //$uibModalInstance.close(en);
                //重新统计工单情况
                //AjaxService.ExecPlan("MesMxWOrder", "reCal", { WorkOrder: data.data1[0].WorkOrder });
            }
            else if (data.data[0].MsgType == 'Error') {
                showError(data.data[0].Msg);
                toastr.error(data.data[0].Msg);
            }
            vm.Item.InCode = undefined;
            vm.InCodeControl = undefined;
            vm.Item.NgInCode = undefined;
            vm.DialogItem.NgType = undefined;
            $(".bsn-ng").removeClass("active");
        })
    };

    //取消
    vm.cancel = function () {
        vm.Item.NgInCode = undefined;
        vm.DialogItem = undefined;
        //$uibModalInstance.dismiss('cancel');
    };


}
]);