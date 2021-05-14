'use strict';

angular.module('AppSet')
.controller('BLMOPKCtrl', ['$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($scope, Dialog, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.Ser.cOSNCode = "";

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    function Search() {
         if(!vm.Ser.eWorkOrder && !vm.Ser.cOSNCode)return void toastr.error("外箱ID和工单号必须有一个不为空!");
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("BLMOPKChi", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("BLMOPKChi", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.cOSNCode) {
            list.push({ name: "OSNCode", value: vm.Ser.cOSNCode, tableAs:"c" });
        }
        if (vm.Ser.eWorkOrder) {
            list.push({ name: "WorkOrder", value: vm.Ser.eWorkOrder, tableAs:"e" });
        }
         return list;
    }

}]);
