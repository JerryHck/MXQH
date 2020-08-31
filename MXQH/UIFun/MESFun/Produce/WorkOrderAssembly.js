'use strict';

angular.module('app')
.controller('WorkOrderAssemblyCtrl', ['$rootScope', '$scope', '$timeout', 'Dialog', 'toastr', 'AjaxService', 'MyPop',
function ($rootScope, $scope, $timeout, Dialog, toastr, AjaxService, MyPop) {

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
    vm.KeyDonwInCodeNg = KeyDonwInCodeNg;

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

    //不良条码扫描
    function KeyDonwInCodeNg(e) {
        $scope.$applyAsync(function () { 
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.NgInCode) {
            var en = {};
            en.InternalCode = vm.Item.NgInCode;
            AjaxService.ExecPlan("MesMxWOrder", 'ass', en).then(function (data) {
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

    function SelectTab(index) {
        vm.Focus = index;
    }

    function InCodeToDb() {
        if (vm.InCodeControl == undefined) return;
        var en = {};
        en.InternalCode = vm.InCodeControl;
        AjaxService.ExecPlan("MesMxWOrder", 'ass', en, false).then(function (data) {
            if (data.data[0].MsgType == 'Error') {
                vm.Item.InCode = undefined;
                showError(data.data[0].Msg);
            }
            else if (data.data[0].MsgType == 'Success') {
                vm.OrderData = data.data1[0];
                vm.ProcedureList = data.data2;
                vm.ProcedureItem = vm.ThisWo == vm.OrderData.ID ? vm.ProcedureItem : undefined;
                if (vm.ProcedureItem) {
                    for (var i = 0, len = vm.ProcedureList.length; i < len; i++) {
                        if (vm.ProcedureItem.boProcedureID == vm.ProcedureList[i].boProcedureID) {
                            vm.ProcedureItem = vm.ProcedureList[i];
                        }
                    }
                }
                vm.ThisWo = vm.OrderData.ID;
                ChangePro(vm.ProcedureItem);
                if (vm.IsAuto) {
                    Save();
                }
            }
        });
        GetStep(vm.InCodeControl);
    }

    function Save() {
        var en = {};
        vm.Item.InCode = undefined;
        if (!vm.ProcedureItem) {
            showError("请先选择工序");
            return;
        }
        en.InternalCode = vm.InCodeControl;
        en.ProcedureID = vm.ProcedureItem.boProcedureID;
        vm.promise = AjaxService.ExecPlan("MesMxWOrder", "saveass", en).then(function (data) {
            if (data.data[0].MsgType == 'Success') {
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].Msg });
                //vm.PassCount = data.data1[0].ToTalCount;
                //vm.CalData = data.data1[0];

                //更新工序信息，读写分离避免死锁
                ChangePro(vm.ProcedureItem);
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

    function GetStep(bsn) {
        //流程
        vm.ProStep = { BSN: bsn };
        vm.ProStep.steps = [];
        AjaxService.GetPlans("vwOpPlanExecut", { name: "InternalCode", value: bsn }).then(function (data) {
            for (var i = 0, len = data.length; i < len; i++) {
                var en = {};
                en.title = data[i].ProcedureName;
                en.content = "";
                if (data[i].IsPass == 1) {
                    en.content = data[i].OpUser + '  操作时间：' + data[i].OperatorDate;
                    vm.ProStep.now = i + 1;
                }
                else if (data[i].IsPass == 0 && data[i].IsRepair == 1) {
                    en.content = data[i].OpUser + '  操作时间：' + data[i].OperatorDate;
                    vm.ProStep.reject = i + 1;
                }
                vm.ProStep.steps.push(en);
            }
        })
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

    //不良
    function NgSave() {
        var en = {};
        if (!vm.ProcedureItem) {
            showError("请先选择工序");
            return;
        }
        en.InternalCode = vm.Item.NgInCode;
        en.ProcedureID = vm.ProcedureItem.boProcedureID;
        en.IsHH = false;
        AjaxService.ExecPlan("MesMxWOrder", "checkNg", en).then(function (data) {
            if (data.data[0].MsgType == 'Success') {
                //打开窗体 WoAssNgDialog
                var item = { InCode: vm.Item.NgInCode, ProcedureItem: vm.ProcedureItem, OrderData: vm.OrderData };
                vm.NgItem = item;
                $(".bsn-ng").addClass("active");
                //Dialog.OpenDialog("WoAssNgDialog", item).then(function (data) {
                //    //$scope.$applyAsync();
                //    ChangePro(vm.ProcedureItem);
                //    vm.Item.InCode = undefined;
                //    vm.InCodeControl = undefined;
                //    vm.Item.NgInCode = undefined;
                //}).catch(function (reason) {
                //    vm.Item.NgInCode = undefined
                //    //console.log(reason);
                //});
            }
            else if (data.data[0].MsgType == 'Error') {
                showError(data.data[0].Msg);
                vm.Item.InCode = undefined;
                vm.Item.NgInCode = undefined;
                vm.InCodeControl = undefined;
            }
        });
        GetStep(vm.Item.NgInCode);
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
        vm.promise = AjaxService.ExecPlan("MesMxWOrder", "saveNg", en).then(function (data) {
            if (data.data[0].MsgType == 'Success') {
                toastr.success('储存成功');
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: "编码[" + en.InternalCode + "]录入不良成功" });
                //$uibModalInstance.close(en);
            }
            else if (data.data[0].MsgType == 'Error') {
                showError(data.data[0].Msg);
                toastr.error(data.data[0].Msg);
            }
            ChangePro(vm.ProcedureItem);
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