'use strict';

angular.module('AppSet')
.controller('bcWorkOrderDoneCtrl', ['$scope', '$http', 'AjaxService', 'toastr', '$window',
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
        vm.promise = AjaxService.GetPlansPage("BcWorkOrderDone", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
            console.log(data)
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("BcWorkOrderDone", GetContition()).then(function (data) {
            $window.location.href = data.File;
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

}]);
