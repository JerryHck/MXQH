'use strict';

angular.module('AppSet')
.controller('U9WorkOrderDialogCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
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
        vm.promise = AjaxService.GetPlansPage("U9WorkOrder", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function GetContition() {
        var list = [];
        if (vm.Ser.aDocNo) {
            list.push({ name: "DocNo", value: vm.Ser.aDocNo, tableAs:"a" });
        }
        if (vm.Ser.bCode) {
            list.push({ name: "Code", value: vm.Ser.bCode, tableAs:"b" });
        }
        if (vm.Ser.bName) {
            list.push({ name: "Name", value: vm.Ser.bName, tableAs:"b" });
        }
        if (ItemData.SerList && ItemData.SerList.length > 0) {
            for (var i = 0, len = ItemData.SerList.length; i < len; i++) {
                list.push(ItemData.SerList[i]);
            }
        }
        return list;
    }

    function Select(item) {
        vm.SerItem = angular.copy(item);
    }

    function OKClose() {
        if (!vm.SerItem) {
            toastr.error("还未选中项");
        }
        else {
            $uibModalInstance.close(vm.SerItem);
        }
    }

    function OK(item) {
        $uibModalInstance.close(item);
    }
    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);
