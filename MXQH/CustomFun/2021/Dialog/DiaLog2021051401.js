'use strict';

angular.module('AppSet')
.controller('EquipmentRpLogDialogCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
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
        vm.promise = AjaxService.GetPlansPage("BcEquipmentRp", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function GetContition() {
        var list = [];
        list.push({ name: "Code", value: ItemData.Code, tableAs: "b" });
        if (vm.Ser.aOpType) {
            list.push({ name: "OpType", value: vm.Ser.aOpType, tableAs:"a" });
        }
        if (vm.Ser.aStartTime) {
            list.push({ name: "StartTime", value: vm.Ser.aStartTime, tableAs:"a", type:">=" });
        }
        if (vm.Ser.aStartTime1) {
            list.push({ name: "StartTime", value: vm.Ser.aStartTime1, tableAs:"a", type:"<=" });
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
