﻿'use strict';

angular.module('app')
.controller('OrderReWorkCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.MesList = [];
   
    vm.page = { index: 1, size: 12 };

    vm.KeyDonwOrder = KeyDonwOrder;
    vm.Save = Save;

    //获取包装信息
    AjaxService.GetPlans("MESOrderReWork", { name: "Status", value: 4 }).then(function (data) {
        vm.OrderList = data;
    })

    function KeyDonwOrder(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.WorkOrder) {
            var con = [];
            con.push({ name: "ID", value: vm.WorkOrder.ID || "-100" });
            con.push({ name: "Status", value: 4 });
            AjaxService.GetPlan("MESOrderReWork", con).then(function (data) {
                vm.ItemData = data;
                if (data.ID) {
                    var mss = "已扫描 工单 [" + vm.WorkOrder.WorkOrder + '] ';
                    vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: mss });
                }
                else {
                    var mss = "工单不存在或未完工";
                    vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mss });
                }
            });
        }
    }

    function Save() {
        var en = {};
        en.ID = vm.ItemData.ID;
        en.CreateBy = $rootScope.User.UserNo;
        vm.promise = AjaxService.ExecPlan("MESOrderReWork", 'save', en).then(function (data) {
            toastr.success('操作成功');
            var mss = "已反完工 工单 [" + vm.ItemData.WorkOrder + '] ';
            vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: mss });
            vm.ItemData = {};
        })
    }
}
]);