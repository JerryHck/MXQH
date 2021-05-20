'use strict';

angular.module('AppSet')
.controller('PlanNotPackBsnCtrl', ['$scope', '$http', 'AjaxService', 'toastr', '$window',
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
        vm.promise = AjaxService.GetPlansPage("opPlanNotPackBsn", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("opPlanNotPackBsn", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        list.push({ name: "WorkOrder", value: vm.Ser.bWorkOrder ||'-1', tableAs:"b" });
        if (vm.Ser.aInternalCode) {
            list.push({ name: "InternalCode", value: vm.Ser.aInternalCode, tableAs:"a" });
        }
        if (vm.Ser.aSNCode) {
            list.push({ name: "SNCode", value: vm.Ser.aSNCode, tableAs:"a" });
        }
        return list;
    }

}]);