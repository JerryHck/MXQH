'use strict';

angular.module('AppSet')
.controller('ProTestctrl', ['$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
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
        vm.promise = AjaxService.GetPlansPage("PROTEST", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("PROTEST", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.aBSN) {
            list.push({ name: "BSN", value: vm.Ser.aBSN, tableAs:"a" });
        }
        if (vm.Ser.aTS) {
            list.push({ name: "TS", value: vm.Ser.aTS, tableAs:"a", type:">=" });
        }
        if (vm.Ser.aTS1) {
            list.push({ name: "TS", value: vm.Ser.aTS1, tableAs:"a", type:"<=" });
        }
        return list;
    }

}]);
