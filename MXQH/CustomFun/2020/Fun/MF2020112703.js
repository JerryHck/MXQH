'use strict';

angular.module('AppSet')
.controller('LLCheckInCtrl', ['$rootScope', '$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, Dialog, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.Open = Open;
    vm.ChangeSate = ChangeSate;

    Search();

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    //Open({});

    function Open(item) {
        Dialog.OpenDialog("U9LLCheckInDialog", item).then(function (data) {
            if (data) {
                Search();
            }
        }, function () { })
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("WMSPicking", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }

    //变更状态
    function ChangeSate(item, type) {
        var en = {ID:item.ID};
        if (type == "S") {
            en.State = "1";
            en.StPreTime = $rootScope.SysTime;
            en.PreBy = $rootScope.User.UserNo;
        }
        AjaxService.PlanUpdate("WMSPicking", en).then(function (data) {
            PageChange();
        })
        console.log(en);
    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("WMSPicking", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.NeedTime) {
            //日期加一天
            var dateTime = new Date(vm.Ser.NeedTime);
            dateTime = dateTime.setDate(dateTime.getDate() + 1);
            dateTime = new Date(dateTime);
            list.push({ name: "NeedTime", value: vm.Ser.NeedTime, type: ">=", tableAs: "a" });
            list.push({ name: "NeedTime", value: dateTime.Format("yyyy-MM-dd"), type: "<", tableAs: "a" });
        }
        if (vm.Ser.bDocNo) {
            list.push({ name: "PickDocNo", value: vm.Ser.bDocNo, tableAs: "b" });
        }
        if (vm.Ser.WorkOrder) {
            list.push({ name: "WorkOrder", value: vm.Ser.WorkOrder, tableAs: "a" });
        }
        if (vm.Ser.MateCode) {
            list.push({ name: "MateCode", value: vm.Ser.MateCode, tableAs: "a" });
        }
        return list;
    }

}]);