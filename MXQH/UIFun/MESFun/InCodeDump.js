'use strict';

angular.module('app')
.controller('InCodeDumpCtrl', ['$scope', '$http', 'AjaxService', 'toastr', '$window', 'MyPop',
function ($scope, $http, AjaxService, toastr, $window, MyPop) {

    var vm = this;
    vm.NewBind = { Action: "I", Customer:"U" };
    vm.MesList = [];
    vm.Focus = { InCode: true, SnCode: false};
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.PrintType = 'G';
    vm.isFinist = true;

    vm.KeyDonwOrder = KeyDonwOrder;
    vm.KeyDonwInCode = KeyDonwInCode;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    //PageChange();
    //未完工工单
    AjaxService.GetPlans("MesMxWOrder", [{ name: "Status", value: 4, type: "!=" }]).then(function (data) {
        vm.OrderList = data;
    })

    //所有工单
    AjaxService.GetPlans("MesMxWOrder", []).then(function (data) {
        vm.AllOrderList = data;
    })

    //工单确认
    function KeyDonwOrder(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.WorkOrder) {
            vm.OrderData = undefined;
            var en = {};
            en.WorkOrder = vm.Item.WorkOrder;
            AjaxService.ExecPlan("BindCode", "getOrder", en).then(function (data) {
                var mss = "工单 [" + vm.Item.WorkOrder + '] ';
                if (!data.data[0] || !data.data[0].WorkOrder) {
                    vm.Item.WorkOrder = undefined;
                    showError(mss + '  不存在或已完工');
                }
                else {
                    vm.OrderData = data.data[0];
                    vm.OrderCount = data.data1[0];
                    en.InternalCode = "-1";
                    AjaxService.ExecPlan("MESopPlanExMainDump", "dump", en).then(function (data) {
                        if (data.data[0].MsgType == "Init") {
                            vm.DumpData = data.data1[0];
                        }
                    });
                    $("input.SnFocus").focus();
                }
            });
        }
    }

    function Search() {
        vm.page.index = 1;
        PageChange()
    }

    function showError(mes) {
        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mes });
        AjaxService.PlayVoice('error.mp3');
        toastr.error(mes);
    }

    function PageChange() {
        var en = angular.copy(vm.Ser);
        en.IsExcel = 'N';
        en.Start = (vm.page.index - 1) * vm.page.size + 1;
        en.End = vm.page.index * vm.page.size;
        vm.promise = AjaxService.ExecPlan("MesInCodeBindSnCode", "getSn", en).then(function (data) {
            vm.BindList = data.data;
            vm.page.total = data.data1[0].Count;
        });
    }

    //

    //内部码验证
    function KeyDonwInCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.NewBind.InternalCode) {
            Action();
        }
    }
   
    //报废操作
    function Action() {
        if (!vm.OrderData) {
            showError('请先选择工单');
            return;
        }
        else if (!vm.NewBind.Remark) {
            showError('请先填写报废原因');
            return;
        }
        var en = { InternalCode: vm.NewBind.InternalCode, WorkOrder: vm.OrderData.WorkOrder, Remark: vm.NewBind.Remark };
        vm.promise = AjaxService.ExecPlan("MESopPlanExMainDump", "dump", en).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                showError(data.data[0].Msg);
                vm.NewBind.InternalCode = undefined;
            }
            else if (data.data[0].MsgType == "Success") {
                var mss = "条码[" + vm.NewBind.InternalCode + '] 报废成功';
                var Msg = { Id: vm.MesList.length + 1, IsOk: true, Msg: mss };
                vm.MesList.splice(0, 0, Msg);
                vm.NewBind = {};
                vm.DumpData = data.data1[0];
                AjaxService.PlayVoice('success.mp3');
            }

        });
    }

    function ExportExcel() {
        vm.Ser.IsExcel = 'Y';
        vm.promise = AjaxService.GetPlanExcel("MesInCodeBindSnCode", "getSn", vm.Ser).then(function (data) {
            $window.location.href = data.File;
        });
    }
}
]);