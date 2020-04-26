'use strict';

angular.module('app')
.controller('WorkOrderAssemblyPowerCtrl', ['$rootScope', '$scope', 'MyPop', 'AjaxService', 'toastr', '$window', 'Dialog',
function ($rootScope, $scope, MyPop, AjaxService, toastr, $window, Dialog) {

    var vm = this;
    vm.Item = { };
    vm.MesList = [];
    vm.Focus = { Order: false, InCode: true, SN: false };
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.IsAuto = true;

    vm.KeyDonwInCode = KeyDonwInCode;
    vm.InCodeToDb = InCodeToDb;
    vm.NgSave = NgSave;
    vm.SelectTab = SelectTab;
    vm.ChangePro = ChangePro;
    vm.IsFisnish = true;

    //内部码验证
    function KeyDonwInCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.InCode) {
            if (vm.IsFisnish) {
                vm.InCodeControl = angular.copy(vm.Item.InCode);
                InCodeToDb();
            }
            else {
                showError("您扫描太快了，请等待系统处理完成")
            }
        }
    }

    function showError(mes) {
        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mes });
        AjaxService.PlayVoice('error.mp3');
        toastr.error(mes);
    }

    function SelectTab(index) {
        vm.Focus = index;
    }

    function InCodeToDb() {
        if (vm.InCodeControl == undefined) return;
        var en = {};
        en.InternalCode = vm.InCodeControl;
        en.DataType = "P";
        AjaxService.ExecPlan("MesMxWOrder", 'ass', en).then(function (data) {
            if (data.data[0].MsgType == 'Error') {
                vm.Item.InCode = undefined;
                showError(data.data[0].Msg);
            }
            else if (data.data[0].MsgType == 'Success') {
                vm.OrderData = data.data1[0];
                vm.ProcedureList = data.data2;
                vm.ProcedureItem = vm.ThisWo == vm.OrderData.ID ? vm.ProcedureItem : undefined;
                vm.ThisWo = vm.OrderData.ID;
                ChangePro(vm.ProcedureItem);
                if (vm.IsAuto) {
                    Save();
                }
            }
        });
    }

    function Save() {
        var en = {};
        if (!vm.ProcedureItem) {
            showError("请先选择工序");
            return;
        }
        vm.Item.InCode = undefined;
        en.InternalCode = vm.InCodeControl;
        en.ProcedureID = vm.ProcedureItem.boProcedureID;
        vm.promise = AjaxService.ExecPlan("MesMxWOrder", "saveass", en).then(function (data) {
            if (data.data[0].MsgType == 'Success') {
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].Msg });
                ChangePro(item);
                AjaxService.PlayVoice('success.mp3');
                vm.InCodeControl = undefined;
            }
            else if (data.data[0].MsgType == 'Error') {
                showError(data.data[0].Msg);
                vm.InCodeControl = undefined;
            }
            vm.IsFisnish = true;
        })
    }

    function ChangePro(item) {
        if (item == undefined) return false;
        var en = {};
        en.WorkOrderId = vm.ThisWo;
        en.RouteId = item.ID;
        en.ProcedureID = item.boProcedureID;
        //console.log(en);
        AjaxService.ExecPlan("MesMxWOrder", "sum", en).then(function (data) {
            //console.log(data);
            //vm.PassCount = data.data[0].TotalCount;
            vm.CalData = data.data[0];
        });
    }

    //不良
    function NgSave() {
        var en = {};
        if (!vm.ProcedureItem) {
            showError("请先选择工序");
            return;
        }
        en.InternalCode = vm.Item.InCode;
        en.ProcedureID = vm.ProcedureItem.boProcedureID;
        AjaxService.ExecPlan("MesMxWOrder", "checkNg", en).then(function (data) {
            if (data.data[0].MsgType == 'Success') {
                //打开窗体 WoAssNgDialog
                var resolve = {
                    ItemData: function () {
                        var item = { InCode: vm.Item.InCode, ProcedureItem: vm.ProcedureItem, OrderData: vm.OrderData };
                        return item;
                    }
                };
                Dialog.open("MOASSPowerDialog", resolve).then(function (data) {
                    ChangePro(vm.ProcedureItem);
                    vm.Item.InCode = undefined;
                    vm.InCodeControl = undefined;
                    //console.log(data);
                }).catch(function (reason) {
                    //console.log(reason);
                });

            }
            else if (data.data[0].MsgType == 'Error') {
                showError(data.data[0].Msg);
                vm.Item.InCode = undefined;
                vm.InCodeControl = undefined;
            }
        })
    }
}
]);