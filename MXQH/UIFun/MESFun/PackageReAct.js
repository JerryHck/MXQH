'use strict';

angular.module('app')
.controller('PackageReActCtrl', ['$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.Item = {};
    vm.MesList = [];
    vm.Focus = { SNCode: true, Order: false, SN: false };
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.IsAuto = true;

    vm.KeyDonwSnCode = KeyDonwSnCode;
    vm.KeyDonwOrder = KeyDonwOrder;
    vm.Edit = Edit;
    vm.Save = Save;
    vm.SelectTab = SelectTab;
    vm.KeyDonwNum = KeyDonwNum;


    //获取包装信息
    AjaxService.GetPlans("MesMxWOrder").then(function (data) {
        vm.OrderList = data;
    })

    //内部码验证
    function KeyDonwSnCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.SNCode) {
            vm.IsEdit = false;
            var en = {};
            en.name = "SNCode";
            en.value = vm.Item.SNCode;
            AjaxService.GetPlan("vwPackageChi", en).then(function (data) {
                var mss = "SN 码 [" + vm.Item.SNCode + '] ';
                vm.List = data;
                if (!data.SNCode) {
                    vm.Item.SNCode = undefined;
                    vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '  不存在或未包装' });
                }
                else {
                    vm.Item.WorkOrder = data.PackDtl.PackMain.Order.WorkOrder;
                    vm.Item.BoxNumber = data.PackDtl.BoxNumber;
                    vm.PackMain = data.PackDtl.PackMain;
                    vm.PackDetail = data.PackDtl;
                }
            });
        }
    }

    function KeyDonwOrder(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.WorkOrder) {
            vm.IsEdit = false;
            var en = {};
            en.name = "WorkOrder";
            en.value = vm.Item.WorkOrder;
            AjaxService.GetPlan("MESPackageMain", en).then(function (data) {
                vm.ItemData = data;
                var mss = "工单 [" + vm.Item.SNCode + '] ';
                if (!data.ID) {
                    vm.Item.WorkOrder = undefined;
                    vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '  不存在或未包装' });
                }
                else {
                    vm.Item.SNCode = undefined;
                    vm.PackMain = data;
                    vm.PackDetail = undefined;
                    vm.Item.BoxNumber = undefined;
                    //获取箱号SN列表
                }
            });
        }
    }

    function KeyDonwNum(e)
    {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.BoxNumber) {
            vm.IsEdit = false;
            if (!vm.PackMain || !vm.PackMain.ID)
            {
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: '请先输入工单' });
                return;
            }
            getDtl();
        }
    }

    function getDtl() {
        var list = [];
        list.push({ name: "PackMainID", value: vm.PackMain.ID });
        list.push({ name: "BoxNumber", value: vm.Item.BoxNumber });
        vm.promise = AjaxService.GetPlan("vwPackageChi", list).then(function (data) {
            vm.ItemData = data;
            var mss = "箱号 [" + vm.Item.BoxNumber + '] ';
            if (!data.ID) {
                vm.Item.WorkOrder = undefined;
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '  不存在' });
            }
            else {
                vm.PackDetail = data;
                //获取箱号SN列表
            }
        });
    }

    function SelectTab(index) {
        vm.Focus.SNCode = index;
    }

    function Edit() {
        vm.IsEdit = true;
    }

    function Save(t) {
        var en = {};
        en.PackDetailID = vm.PackDetail.ID;
        en.PalletCode = vm.PackDetail.PalletCode;
        en.Packweight = vm.PackDetail.Packweight;
        en.ActType = t;
        vm.promise = AjaxService.ExecPlan("MESPackageDtl", "save", en).then(function (data) {
            toastr.success('操作成功');
            getDtl();
            vm.IsEdit = false;
        })
    }
}
]);