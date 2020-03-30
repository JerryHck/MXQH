'use strict';

angular.module('app')
.controller('WorkOrderOnLineCtrl', ['$rootScope', '$scope', 'MyPop', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, MyPop, AjaxService, toastr, $window) {

    var vm = this;
    vm.Item = {};
    vm.MesList = [];
    vm.Focus = { Order: true, InCode: false, SN: false };
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.IsAuto = true;

    vm.KeyDonwInCode = KeyDonwInCode;
    vm.KeyDonwOrder = KeyDonwOrder;
    vm.InCodeToDb = InCodeToDb;
    vm.NgSave = NgSave;
    vm.SelectTab = SelectTab;
    vm.KeyDonwBSNPrint = KeyDonwBSNPrint;

    //获取包装信息
    AjaxService.GetPlans("MesMxWOrder", [{ name: "Status", value: 4, type:"!=" }]).then(function (data) {
        vm.OrderList = data;
    })

    //获取模版信息
    AjaxService.GetPlan("MESBarCodeTemplate", [{ name: "TemplateId", value: 1 }]).then(function (data) {
        vm.Template = data;
    })
    //内部码验证
    function KeyDonwInCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.InCode) {
            vm.InCodeSave = angular.copy(vm.Item.InCode);
            vm.Item.InCode = undefined;
            InCodeToDb();
        }
    }

    function KeyDonwOrder(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.WorkOrder) {
            var en = {};
            en.WorkOrder = vm.Item.WorkOrder;
            AjaxService.ExecPlan("MesMxWOrder", "order", en).then(function (data) {
                var mss = "工单 [" + vm.Item.WorkOrder + '] ';
                vm.OrderData = undefined;
                if (!data.data[0] || !data.data[0].WorkOrder) {
                    vm.Item.WorkOrder = undefined;
                    showError(mss + '  不存在或已完工');
                }
                else {
                    vm.OrderData = data.data[0];
                    vm.RoutingList = data.data1;
                    vm.RoutingData = data.data1[0];
                    vm.OrderCount = data.data2[0];
                    vm.Focus = { Order: false, InCode: true, SN: false };
                }
            });
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

    function InCodeToDb() {
        var IsOk = true;
        if (!vm.OrderData || !vm.RoutingData) {
            showError('不存在或已完工');
            return false;
        }
        //if (vm.OrderData.MaxOverCount - vm.OrderCount.ToTalCount <= 0) {
        //    showError('工单投入量已达U9开工量最大允许值，不可再投入');
        //    vm.Item.InCode = undefined;
        //    return false;
        //}
        if (vm.OrderData.Quantity - vm.OrderCount.ToTalCount == 0) {
            AjaxService.PlayVoice('error.mp3');
            MyPop.ngConfirm({ text: "投入数量已达到U9开工量, 是否继续投入?" }).then(function (data) {
                if (vm.IsAuto) {
                    Save();
                }
            });
        }
        else if (vm.IsAuto) {
            Save();
        }
    }

    function showError(mes)
    {
        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mes });
        AjaxService.PlayVoice('error.mp3');
        toastr.error(mes);
    }

    function SelectTab(index) {
        vm.Focus = index;
    }

    function Save() {
        var en = {};
        en.WorkOrder = vm.Item.WorkOrder;
        en.InternalCode = vm.InCodeSave;
        en.RoutingId = vm.RoutingData.ID;
        //console.log(en);
        vm.promise = AjaxService.ExecPlan("MesMxWOrder", "save", en).then(function (data) {
            if (data.data[0].MsgType == 'Success') {
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].Msg });
                vm.OrderCount = data.data1[0];
                AjaxService.PlayVoice('success.mp3');
                //打印
                if (vm.RoutingData.IsPrint || vm.IsPrint) {
                    print(en.InternalCode);
                }
                vm.InCodeSave = undefined;

            }
            else if (data.data[0].MsgType == 'Error') {
                showError(data.data[0].Msg);
                vm.InCodeSave = undefined;
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

    //不良
    function NgSave() {

    }
}
]);