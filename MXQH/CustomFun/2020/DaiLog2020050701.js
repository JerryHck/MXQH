'use strict';

angular.module('AppSet')
.controller('MESMoLineArrDtlCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
function ($scope, ItemData, $uibModalInstance, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 20 };
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
        vm.promise = AjaxService.GetPlansPage("MESMoLineArrDtl", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function GetContition() {
        var list = [];
        if (vm.Ser.aHrUserNo) {
            list.push({ name: "HrUserNo", value: vm.Ser.aHrUserNo, tableAs:"a" });
        }
        if (vm.Ser.aHrUserName) {
            list.push({ name: "HrUserName", value: vm.Ser.aHrUserName, tableAs:"a" });
        }
        list.push({ name: "ArrangeId", value: ItemData.Id, tableAs: "a" });
        return list;
    }
    function OK(item) {
        $uibModalInstance.close(item);
    }
    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);
