'use strict';

angular.module('AppSet')
.controller('OutLabelCtrl', ['$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($scope, Dialog, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ImportExcel = ImportExcel;
    vm.CalToBox = CalToBox;
    vm.OpenDtl = OpenDtl;

    Search();
    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("BlMOPackOSLabel", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }

    function OpenDtl(item) {
        Dialog.OpenDialog("BlMOOSLabelDtl", item).then(function (data) {
            PageChange();
        })
    }

    function CalToBox(qty, per) {
        return Math.ceil(qty / per)
    }

    function ImportExcel() {
        Dialog.OpenDialog("BlMOOSLabelImport", {}).then(function (data) {
            PageChange();
        })
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.bWorkOrder) {
            list.push({ name: "WorkOrder", value: vm.Ser.bWorkOrder, tableAs:"b" });
        }
        if (vm.Ser.bMaterialCode) {
            list.push({ name: "MaterialCode", value: vm.Ser.bMaterialCode, tableAs:"b" });
        }
        return list;
    }

}]);
