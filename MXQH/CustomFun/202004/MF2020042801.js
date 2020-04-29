'use strict';

angular.module('AppSet')
.controller('SalaryCalculateCtrl', ['$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.SerDate = new Date();
    vm.Ser.Year = vm.SerDate.getFullYear();
    vm.Ser.Month = vm.SerDate.getMonth();
    vm.Ser.Day = vm.SerDate.getDate();
    vm.SerDate = new Date(vm.Ser.Year, vm.Ser.Month, vm.Ser.Day);

    vm.GetData = GetData;
    vm.SelectDay = SelectDay;
    vm.Save = Save;
    vm.ReCal = ReCal;
    vm.ReflashKq = ReflashKq;

    //验证是否具有财务管理权限
    AjaxService.CheckRole("ROLE0039").then(function (data) {
        vm.IsLockHave = data.data;
    });

    

    vm.YearList = [];
    vm.MonthList = [];
    for (var i = 2019, len = vm.Ser.Year + 3; i < len; i++) {
        vm.YearList.push({ value: i, text: i + '年' });
    }
    for (var j = 0; j < 12; j++) {
        vm.MonthList.push({ value: j, text: (j + 1) + '月' });
    }

    GetData();
    function GetData() {
        var en = {};
        en.SerDay = new Date(vm.Ser.Year, vm.Ser.Month, vm.Ser.Day);
        vm.SerDate = en.SerDay;
        AjaxService.ExecPlan("bcWorkDate", "get", en).then(function (data) {
            vm.DateData = data;
        });
    }

    function Save() {
        var en = {};
        en.WorkDate = vm.SelectItem.WorkDate;
        en.IsLock = vm.SelectItem.IsLock;
        en.ModifyBy = "";
        en.ModifyDate = "";
        AjaxService.PlanUpdate("bcWorkDate", en).then(function (data) {
            GetData();
        })
    }

    function SelectDay(item) {
        vm.SelectItem = angular.copy(item);
        var dat = new Date(item.WorkDate);
        if (vm.SerDate.getMonth() != dat.getMonth()) {
            vm.Ser.Year = dat.getFullYear();
            vm.Ser.Month = dat.getMonth();
            vm.Ser.Day = dat.getDate();
            GetData();
        }
    }

    //同步考勤
    function ReflashKq() {
        vm.promise = AjaxService.Custom("RunJob", { JobName: "考勤同步" }).then(function (data) {
            toastr.success("同步考勤完成");
        })
    }

    //重算
    function ReCal() {
        var en = { WorkDate: vm.SelectItem.WorkDate };
        vm.promise = AjaxService.ExecPlan("bcWorkDate", "cal", en).then(function (data) {
            toastr.success("重算成功");
            GetData();
        });
    }

}]);
