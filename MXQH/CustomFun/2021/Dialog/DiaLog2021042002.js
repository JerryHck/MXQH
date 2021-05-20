'use strict';

angular.module('AppSet')
.controller('U9FAssetCardCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
function ($scope, ItemData, $uibModalInstance, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.OK = OK;
    vm.Select = Select;
    vm.Cancel = Cancel;

    Search();
    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Select(item) {
        vm.SelectItem = angular.copy(item);
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("vwU9FAssetCard", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function GetContition() {
        var list = [];
        if (vm.Ser.aCode) {
            list.push({ name: "Code", value: vm.Ser.aCode, tableAs:"a" });
        }
        if (vm.Ser.aU9CardCode) {
            list.push({ name: "U9CardCode", value: vm.Ser.aU9CardCode, tableAs:"a" });
        }
        return list;
    }
    function OK(item) {
        if (!item || !item.Code) {
            toastr.error("请先选择");
            return;
        }
        $uibModalInstance.close(item);
    }
    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);
