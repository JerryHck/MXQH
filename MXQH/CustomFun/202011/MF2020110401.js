'use strict';

angular.module('AppSet')
.controller('PKonlineNotPKCtrl', ['$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($scope, Dialog, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    function Search() {
       if(!vm.Ser.bWorkOrder)return void toastr.error("工单号不能为空!");
       vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("PKonlineNOTPKbsn", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("PKonlineNOTPKbsn", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.bWorkOrder) {
            list.push({ name: "WorkOrder", value: vm.Ser.bWorkOrder, tableAs:"b" });
        }
      
        return list;
    }

}]);