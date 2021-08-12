'use strict';

angular.module('AppSet')
.controller('kpicontrls', ['$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($scope, Dialog, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        console.log(1);
        vm.promise = AjaxService.GetPlansPage("ProjectKPI", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            console.log(data);
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("ProjectKPI", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.aTaskPlanStartDate) {
            list.push({ name: "TaskPlanStartDate", value: vm.Ser.aTaskPlanStartDate, tableAs:"a", type:">" });
        }
        if (vm.Ser.aTaskPlanStartDate2) {
            list.push({ name: "TaskPlanStartDate", value: vm.Ser.aTaskPlanStartDate2, tableAs:"a", type:"<" });
        }
        if (vm.Ser.aTaskPlanEndDate) {
            list.push({ name: "TaskPlanEndDate", value: vm.Ser.aTaskPlanEndDate, tableAs:"a", type:">" });
        }
        if (vm.Ser.aTaskPlanEndDate2) {
            list.push({ name: "TaskPlanEndDate", value: vm.Ser.aTaskPlanEndDate2, tableAs:"a", type:"<" });
        }
        return list;
    }

}]);
