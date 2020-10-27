'use strict';

angular.module('AppSet')
.controller('MOWasteCtrl', ['$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($scope, Dialog, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.Open = Open;

    Search();
    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("MOMateDumpMain", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    //Open({ WorkOrder: "MO-30200817007" });
    function Open(item) {
        console.log(item)
        Dialog.OpenDialog("WorkOrderWaste", item).then(function (data) {
            if (data) {
                Search();
            }
        }, function () { })
    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("MOMateDumpMain", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.aWorkOrder) {
            list.push({ name: "WorkOrder", value: vm.Ser.aWorkOrder, tableAs:"a" });
        }
        if (vm.Ser.aProCode) {
            list.push({ name: "ProCode", value: vm.Ser.aProCode, tableAs:"a" });
        }
        return list;
    }

}]);
