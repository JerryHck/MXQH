﻿'use strict';
angular.module('app').controller('WorkOrderOnLineHHCtrl', WorkOrderOnLineHHCtrl);
WorkOrderOnLineHHCtrl.$inject = ['$scope', '$uibModalInstance', 'Dialog', 'Form', 'ItemData', 'toastr', 'AjaxService'];
//angular.module('app')
//.controller('WorkOrderOnLineCtrlHH', ['$rootScope', '$scope', 'MyPop', 'AjaxService', 'toastr', '$window',
//function ($rootScope, $scope, MyPop, AjaxService, toastr, $window) {
function WorkOrderOnLineHHCtrl($scope, $uibModalInstance, Dialog, Form, ItemData, toastr,AjaxService) {
    var vm = this;
    vm.form = Form[ItemData.Id ? 1 : 0];
    vm.Item = {};
    vm.Item2 = ItemData;

    vm.MesList = [];
    vm.Focus = { Order: true, SNCode: false, SN: false };
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.IsAuto = true;

    vm.KeyDonwInCode = KeyDonwInCode;
    vm.KeyDonwOrder = KeyDonwOrder;
    vm.InCodeToDb = InCodeToDb;
    vm.NgSave = NgSave;
    vm.SelectTab = SelectTab;

    var en = {};
    //en.WorkOrder = vm.Item.WorkOrder;
    en.WorkOrder = vm.Item2.WorOrder;
    AjaxService.ExecPlan("MesMxWOrderHH", "order", en).then(function (data) {
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
            vm.Item.WorkOrder = vm.Item2.WorOrder;
        }
    });


    //获取包装信息
    AjaxService.GetPlans("MesMxWOrderHH", [{ name: "Status", value: 4, type:"!=" }]).then(function (data) {
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
    //使用order
    function KeyDonwOrder(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.WorkOrder) {
            var en = {};
            en.WorkOrder = vm.Item.WorkOrder;
            
            AjaxService.ExecPlan("MesMxWOrderHH", "order", en).then(function (data) {
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
                }
            });
        }
    }

    function InCodeToDb() {
        var IsOk = true;
        if (!vm.OrderData || !vm.RoutingData) {
            showError('不存在或已完工');
            return false;
        }
        if (vm.OrderData.MaxOverCount - vm.OrderCount.ToTalCount <= 0) {
            showError('工单投入量已达最大允许值，不可再投入');
            vm.Item.InCode = undefined;
            return false;
        }
        if (vm.OrderData.Quantity - vm.OrderCount.ToTalCount == 0) {
            AjaxService.PlayVoice('5611.mp3');
            MyPop.ngConfirm({ text: "投入数量已达到生产量, 是否继续投入?" }).then(function (data) {
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
        console.log(en);
        vm.promise = AjaxService.ExecPlan("MesMxWOrderHH", "save", en).then(function (data) {
            if (data.data[0].MsgType == 'Success') {
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].Msg });
                vm.OrderCount = data.data1[0];
                AjaxService.PlayVoice('success.mp3');
                //打印
                if (vm.RoutingData.IsPrint || vm.IsPrint) {
                    var postData = {}, list = [];

                    list.push(en.InternalCode);

                    postData.ParaData = JSON.stringify({});
                    postData.OutList = list;

                    AjaxService.Print(vm.Template.TemplateId, vm.Template.TS, postData).then(function (data) {
                        console.log(data);
                    }, function (err) {
                        console.log(err);
                    })
                }
                vm.InCodeSave = undefined;

            }
            else if (data.data[0].MsgType == 'Error') {
                showError(data.data[0].Msg);
                vm.InCodeSave = undefined;
            }
        })
    }

    //不良
    function NgSave() {

    }
    //取消
    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
}
