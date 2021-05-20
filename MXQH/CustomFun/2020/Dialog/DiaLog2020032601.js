'use strict';

angular.module('AppSet')
.controller('MESMODialogCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
function ($scope, ItemData, $uibModalInstance, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.OK = OK;
    vm.Cancel = Cancel;

    Search();
    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("MesMxWOrder", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function GetContition() {
        var list = [];
        if (vm.Ser.aWorkOrder) {
            list.push({ name: "WorkOrder", value: vm.Ser.aWorkOrder, tableAs:"a" });
        }
        if (vm.Ser.bAssemblyLineID) {
            list.push({ name: "AssemblyLineID", value: vm.Ser.bAssemblyLineID, tableAs:"b" });
        }
        if (vm.Ser.aMaterialCode) {
            list.push({ name: "MaterialCode", value: vm.Ser.aMaterialCode, tableAs:"a" });
        }
        return list;
    }
    function OK(item) {
        $uibModalInstance.close(item);
    }
    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);
