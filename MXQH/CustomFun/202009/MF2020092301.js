'use strict';

angular.module('AppSet')
.controller('PlanDailyRateCtrl', ['$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
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
        vm.promise = AjaxService.GetPlansPage("DailyRate", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("DailyRate", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.aPlanDate) {
            list.push({ name: "PlanDate", value: vm.Ser.aPlanDate, tableAs:"a", type:">=" });
        }
        if (vm.Ser.aPlanDate) {
            list.push({ name: "PlanDate", value: vm.Ser.aPlanDate, tableAs:"a", type:"<" });
        }
        return list;
    }

}]);
