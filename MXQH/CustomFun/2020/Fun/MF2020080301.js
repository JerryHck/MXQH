'use strict';

angular.module('AppSet')
.controller('AssPackInfoCtrl', ['$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($scope, $http, AjaxService, toastr, $window) {

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
        vm.promise = AjaxService.GetPlansPage("MESPackData", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("MESPackData", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.bWorkOrder) {
            list.push({ name: "WorkOrder", value: vm.Ser.bWorkOrder, tableAs:"b" });
        }
        if (vm.Ser.cMaterialCode) {
            list.push({ name: "MaterialCode", value: vm.Ser.cMaterialCode, tableAs:"c" });
        }
        if (vm.Ser.bPackNo) {
            list.push({ name: "PackNo", value: vm.Ser.bPackNo, tableAs:"b" });
        }
        if (vm.Ser.aInternalCode) {
            list.push({ name: "InternalCode", value: vm.Ser.aInternalCode, tableAs:"a" });
        }
        if (vm.Ser.aSNCode) {
            list.push({ name: "SNCode", value: vm.Ser.aSNCode, tableAs:"a" });
        }
        return list;
    }

}]);
