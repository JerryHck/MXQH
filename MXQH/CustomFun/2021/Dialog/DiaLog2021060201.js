'use strict';

angular.module('AppSet')
.controller('mosoftcontrol', ['$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
function ($scope, ItemData, $uibModalInstance, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.OK = OK;
    vm.Cancel = Cancel;
    vm.Select = Select;
    vm.OKClose = OKClose;

    Search();
    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("MOAndWPO", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function GetContition() {
        var list = [];
        if (vm.Ser.aDocNo) {
            list.push({ name: "DocNo", value: vm.Ser.aDocNo, tableAs:"a" });
        }
        if (vm.Ser.aWPO) {
            list.push({ name: "WPO", value: vm.Ser.aWPO, tableAs:"a" });
        }
        if (vm.Ser.aCode) {
            list.push({ name: "Code", value: vm.Ser.aCode, tableAs:"a" });
        }
        if (ItemData.SerList && ItemData.SerList.length > 0) {
            for (var i = 0, len = ItemData.SerList.length; i < len; i++) {
                list.push(ItemData.SerList[i]);
            }
        }
        return list;
    }
    function OK(item) {
        $uibModalInstance.close(item);
    }
    function Select(item) {
        vm.SerItem = angular.copy(item);
    }
    function OKClose() {
        $uibModalInstance.close(vm.SerItem);
    }
    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);
