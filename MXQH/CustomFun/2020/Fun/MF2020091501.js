'use strict';

angular.module('AppSet')
.controller('u9WorkOrderPlanImportCtrl', ['$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($scope, Dialog, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.Import = Import;
    vm.OpenHis = OpenHis;

    GetLatestVer();
    function GetLatestVer() {
        AjaxService.GetPlansTop("WorkOrderPlanImport", {}, 1).then(function (data) {
            if (data[0]) {
                vm.MainId = data[0].ID;
                Search();
            }
        })
    }

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("WorkOrderPlanImportDtl", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });
    }
    function Import() {
        Dialog.OpenDialog("WorkOrderPlanImport", {}).then(function (data) {
            GetLatestVer();
        }, function (data) { })
    }

    function OpenHis() {
        Dialog.OpenDialog("WOPlanImportMain", {}).then(function (data) {
            vm.MainId = data.ID;
            Search();
        }, function (data) { })
    }

    function GetContition() {
        var list = [];
        list.push({ name: "MainID", value: vm.MainId, tableAs: "a" });
        if (vm.Ser.aWorkOrder) {
            list.push({ name: "WorkOrder", value: vm.Ser.aWorkOrder, tableAs:"a" });
        }
        if (vm.Ser.aMaterialCode) {
            list.push({ name: "MaterialCode", value: vm.Ser.aMaterialCode, tableAs:"a" });
        }
        if (vm.Ser.aPlanStDate) {
            list.push({ name: "PlanStDate", value: vm.Ser.aPlanStDate, type:'>=', tableAs:"a" });
        }
        if (vm.Ser.aPlanEdDate) {
            list.push({ name: "PlanEdDate", value: vm.Ser.aPlanEdDate, type: '<=', tableAs: "a" });
        }
        if (vm.Ser.aProduceDate) {
            list.push({ name: "ProduceDate", value: vm.Ser.aProduceDate, tableAs:"a" });
        }
        return list;
    }

}]);
