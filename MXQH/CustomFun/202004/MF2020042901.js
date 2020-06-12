'use strict';

angular.module('AppSet')
.controller('bcWorkOrderDoneCtrl', ['$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($scope, Dialog, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.OpenDtl = OpenDtl;
    vm.OpenUser = OpenUser;
    vm.EditUPPH = EditUPPH;
    vm.SaveUpph = SaveUpph;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("BcWorkOrderDone", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("BcWorkOrderDone", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }

    function EditUPPH(item) {
        vm.UPItem = angular.copy(item);
        $(".new-upph").addClass("active");
        //$(".new-upph").removeClass("active");
    }

    //打开详细
    function OpenDtl(item) {
        Dialog.OpenDialog("BcWorkOrderUserDone", item).then(function (data) {

        }, function (data2) {

        });
    }

    //打开用户详细
    function OpenUser() {
        Dialog.OpenDialog("BcWorkOrderUserDone", {}).then(function (data) {

        }, function (data2) {

        });
    }

    function GetContition() {
        var list = [];
        if (vm.Ser.aWorkDate) {
            list.push({ name: "WorkDate", value: vm.Ser.aWorkDate, tableAs:"a" });
        }
        if (vm.Ser.aLineId) {
            list.push({ name: "LineId", value: vm.Ser.aLineId, tableAs:"a" });
        }
        if (vm.Ser.aWorkOrder) {
            list.push({ name: "WorkOrder", value: vm.Ser.aWorkOrder, tableAs:"a" });
        }
        return list;
    }

    function SaveUpph() {
        var en = angular.copy(vm.UPItem.Change);
        en.WorkDate = vm.UPItem.WorkDate;
        en.WorkOrder = vm.UPItem.WorkOrder;
        en.ArrangeDate = vm.UPItem.ArrangeDate;

        vm.promise = AjaxService.ExecPlan("bcMODoneChange", 'save', en).then(function (data) {
            toastr.success("保存成功");
            $(".new-upph").removeClass("active");
            PageChange();
        })
    }

}]);
