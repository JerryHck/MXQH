'use strict';

angular.module('app')
.controller('HHReWorkCtrl', ['$rootScope', '$scope', '$timeout', 'Dialog', 'toastr', 'AjaxService', 'MyPop',
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
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.NgInCode) {
            var en = {};
            en.InternalCode = vm.Item.NgInCode;
            en.DataType = 'H';
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
        var e = {};
        e.RouteName = vm.ProcedureItem.RouteName;//工艺流程
        e.ProcedureName = vm.ProcedureItem.ProcedureName;//当前工序
        e.MaterialName = vm.OrderData.MaterialName;//产品名称
        e.MaterialCode = vm.OrderData.MaterialCode;//产品编号
        e.WorkOrder = vm.OrderData.WorkOrder;//工单
        e.boProcedureID = vm.ProcedureItem.boProcedureID;//工序id
        e.RoutingId = vm.ProcedureItem.ID;//当前工艺路由
        e.InCode = vm.Item.NgInCode;//内控码
        Dialog.OpenDialog("HHReWorkDialog", e).then(function (data) {
            vm.Item.NgInCode = undefined;
            ChangePro(vm.ProcedureItem);
        }).catch(function (reason) {
            vm.Item.NgInCode = undefined;
        });
    }
}
]);