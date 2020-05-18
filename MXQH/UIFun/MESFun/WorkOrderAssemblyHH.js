'use strict';

angular.module('app')
.controller('WorkOrderAssemblyHHCtrl', ['$rootScope', '$scope', '$timeout', 'Dialog', 'toastr', 'AjaxService', 'MyPop',
function ($rootScope, $scope, $timeout, Dialog, toastr, AjaxService, MyPop) {

    var vm = this;
    vm.Item = { };
    vm.MesList = [];
    vm.Focus = { Order: false, InCode: true, SN: false };
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.IsAuto = true;
    vm.IsPrint = true;

    vm.KeyDonwInCode = KeyDonwInCode;
    vm.InCodeToDb = InCodeToDb;
    vm.NgSave = NgSave;
    vm.SelectTab = SelectTab;
    vm.ChangePro = ChangePro;
    vm.IsFisnish = true;
    vm.KeyDonwInCodeNg = KeyDonwInCodeNg;
    vm.KeyDonwBSNPrint = KeyDonwBSNPrint;

    //获取模版信息
    AjaxService.GetPlan("MESBarCodeTemplate", [{ name: "TemplateId", value: 1 }]).then(function (data) {
        vm.Template = data;
    })

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

    //bsn打印
    function KeyDonwBSNPrint(e) {
        $scope.$applyAsync(function () {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13 && vm.Item.BSNPrint) {
                var en = {};
                en.InternalCode = vm.Item.BSNPrint;
                AjaxService.ExecPlan("MesMxWOrder", 'bsnPrint', en).then(function (data) {
                    if (data.data[0].MsgType == 'Error') {
                        showError(data.data[0].Msg);
                    }
                    else if (data.data[0].MsgType == 'Success') {
                        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].Msg });
                        AjaxService.PlayVoice('success.mp3');
                        print(en.InternalCode);
                    }
                    vm.Item.BSNPrint = undefined;
                });
            }
        });
    }

    //不良条码扫描
    function KeyDonwInCodeNg(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.NgInCode) {
            var en = {};
            en.InternalCode = vm.Item.NgInCode;
            en.DataType = 'H';
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
        en.DataType = 'H';
        AjaxService.ExecPlan("MesMxWOrder", 'ass', en, false).then(function (data) {
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
        vm.Item.InCode = undefined;
        if (!vm.ProcedureItem) {
            showError("请先选择工序");
            return;
        }
        en.InternalCode = vm.InCodeControl;
        en.ProcedureID = vm.ProcedureItem.boProcedureID;
        vm.promise = AjaxService.ExecPlan("MesMxWOrder", "saveassHH", en).then(function (data) {
            if (data.data[0].MsgType == 'Success') {
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].Msg });
                //vm.PassCount = data.data1[0].ToTalCount;
                //vm.CalData = data.data1[0];
                //打印
                if (vm.ProcedureItem.IsPrint || vm.IsPrint) {
                    print(en.InternalCode);
                }
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
        en.IsHH = true;
        console.log(en)
        AjaxService.ExecPlan("MesMxWOrder", "checkNg", en).then(function (data) {
            if (data.data[0].MsgType == 'Success') {
                var e = {};
                e.RouteName = vm.ProcedureItem.RouteName;//工艺流程
                e.ProcedureName = vm.ProcedureItem.ProcedureName;//当前工序
                e.MaterialName = vm.OrderData.MaterialName;//产品名称
                e.MaterialCode = vm.OrderData.MaterialCode;//产品编号
                e.WorkOrder = vm.OrderData.WorkOrder;//工单
                e.boProcedureID = vm.ProcedureItem.boProcedureID;//工序id
                e.RoutingId = vm.ProcedureItem.ID;//当前工艺路由
                e.InCode = vm.Item.NgInCode;//内控码

                Dialog.OpenDialog("WorkOrderAssNgDialogHH", e).then(function (data) {
                        //$scope.$applyAsync();
                        ChangePro(vm.ProcedureItem);
                        vm.Item.InCode = undefined;
                        vm.InCodeControl = undefined;
                        vm.Item.NgInCode = undefined;
                    }).catch(function (reason) {
                        vm.Item.NgInCode = undefined
                        //console.log(reason);
                    });
            }
            else if (data.data[0].MsgType == 'Error') {
                showError(data.data[0].Msg);
                vm.Item.InCode = undefined;
                vm.Item.NgInCode = undefined;
                vm.InCodeControl = undefined;
            }
        })
    }


    function print(bsn) {
        var postData = {}, list = [];

        list.push(bsn);

        postData.ParaData = JSON.stringify({});
        postData.OutList = list;

        AjaxService.Print(vm.Template.TemplateId, vm.Template.TS, postData).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })
    }
}
]);