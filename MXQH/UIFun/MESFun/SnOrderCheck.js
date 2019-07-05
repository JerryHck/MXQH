'use strict';

angular.module('app')
.controller('SnOrderCheckCtrl', ['$rootScope', '$scope', 'MyPop', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, MyPop, AjaxService, toastr, $window) {

    var vm = this;
    vm.Item = { CreateBy: $rootScope.User.UserNo };
    vm.MesList = [];
    vm.Focus = { Order: true, SN: false };
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.KeyDonwSnCode = KeyDonwSnCode;
    vm.KeyDonwOrder = KeyDonwOrder;
    vm.SelectTab = SelectTab;

    //获取工单信息
    AjaxService.GetPlans("MesMxWOrder").then(function (data) {
        vm.OrderList = data;
    })

    function KeyDonwOrder(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.WorkOrder && vm.Item.WorkOrder.ID) {
            vm.OrderData = vm.Item.WorkOrder;
        }
    }

    //内部码验证
    function KeyDonwSnCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.SNCode) {
            vm.IsEdit = false;
            var en = {};
            en.name = "SNCode";
            en.value = vm.Item.SNCode;
            AjaxService.GetPlan("MESSnOrder", en).then(function (data) {
                var mss = "SN 码 [" + vm.Item.SNCode + ']';
                vm.PackData = data;
                if (!data.SNCode) {
                    vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '  不存在或未绑定内部码' });
                }
                else if ((data.ID != vm.Item.WorkOrder.ID)) {
                    var s = mss + ', 料号[' + data.MaterialCode + ']，与当前工单[' + vm.Item.WorkOrder.WorkOrder + ']不符';
                    vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: s });
                    MyPop.Show(true, s);
                }
                else {
                    var s = mss + ', 料号[' + data.MaterialCode + ']校验通过';
                    vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: s });
                }
                vm.Item.SNCode = undefined;
            });
        }
    }

    //验证
    function check(order) {
        var en = { CreateBy: $rootScope.User.UserNo, PlanDetailId: order.ID, SNCode: vm.Item.SNCode, PackNoCode: vm.Item.Antenna };
        vm.Item.SNCode = undefined;
        AjaxService.ExecPlan("MESPackageCheck", "check", en).then(function (data) {
            if (data.data[0].MesType == 'Error') {
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: data.data[0].Msg });
            }
            else if (data.data[0].MesType == 'Success') {
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].Msg });
                vm.OrderData = data.data1[0];
            }
            else {
                vm.OrderData = data.data1[0];
            }
        })
    }

    function SelectTab(index) {
        //vm.Focus = { Order: false, Antenna: true, SN: false };
    }

}
])