'use strict';

angular.module('app')
.controller('SnPackageCheckCtrl', ['$rootScope', '$scope', 'MyPop', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, MyPop, AjaxService, toastr, $window) {

    var vm = this;
    vm.Item = { CreateBy: $rootScope.User.UserNo };
    vm.MesList = [];
    vm.Focus = 0;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.KeyDonwAntenna = KeyDonwAntenna;
    vm.KeyDonwSnCode = KeyDonwSnCode;
    vm.SelectTab = SelectTab;
    vm.PageChange = PageChange;

    //获取工单信息
    AjaxService.GetPlans("MESOrder").then(function (data) {
        vm.OrderList = data;
    })

    function PageChange() {
        var list = [];
        if (vm.Ser.PlanDetailId) {
            list.push({ name: "PlanDetailId", value: vm.Ser.PlanDetailId.ID });
        }
        if (vm.Ser.SNCode) {
            list.push({ name: "SNCode", value: vm.Ser.SNCode });
        }
        if (vm.Ser.PackNoCode) {
            list.push({ name: "PackNoCode", value: vm.Ser.PackNoCode });
        }
        vm.promise = AjaxService.GetPlansPage("MESSnPackCheck", list, vm.page.index, vm.page.size).then(function (data) {
            vm.BindList = data.List;
            vm.page.total = data.Count;
        });
    }

    function KeyDonwAntenna(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.Antenna) {
            var en = {};
            en.name = "Antenna";
            en.value = vm.Item.Antenna;
            AjaxService.GetPlan("MESbaTanapa", en).then(function (data) {
                var mss = "纸盒条码 [" + vm.Item.Antenna + '] ';
                if (!data.Antenna) {
                    vm.Item.Antenna = undefined;
                    vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '  在MES系统中不存在' });
                }
                else {
                    vm.Antenna = data.Antenna;
                    vm.Focus = 1;
                }
            });
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
                AjaxService.GetPlan("MESPackageCheck", en).then(function (data) {
                    var mss = "SN 码 [" + vm.Item.SNCode + '] ';
                    vm.PackData = data;
                    if (!data.SNCode) {
                        vm.Item.SNCode = undefined;
                        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '  不存在或未绑定内部码' });
                    }
                    else if ((data.Antenna != vm.Antenna)) {
                        vm.Item.SNCode = undefined;
                        var s = mss + '应该用纸盒[' + data.Antenna + ']，与当前纸盒[' + vm.Antenna + ']不符';
                        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: s });
                        MyPop.Show(true, s);
                    }
                    else {
                        check(data);
                    }
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
            vm.Focus = index;
        }

    }
])