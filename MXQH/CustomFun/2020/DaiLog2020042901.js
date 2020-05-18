'use strict';

angular.module('AppSet')
.controller('BcWorkOrderUserDoneCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
function ($scope, ItemData, $uibModalInstance, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 30 };
    vm.Ser = {};
    if (ItemData.WorkDate) {
        vm.Ser = {
            WorkDate: (new Date(ItemData.WorkDate)).Format('yyyy-MM-dd'), WorkOrder: ItemData.WorkOrder
        };
    }

    vm.Item = ItemData;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.OK = OK;
    vm.Cancel = Cancel;
    vm.ExportExcel = ExportExcel;

    Search();
    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("BcWorkOrderUserDone", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("BcWorkOrderUserDone", GetContition()).then(function (data) {
            $window.location.href = data.File;
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
        list.push({ name: "WorkDate", value: vm.Ser.WorkDate, tableAs: "a" });
        list.push({ name: "WorkOrder", value: vm.Ser.WorkOrder, tableAs: "a" });
        list.push({ name: "ArrangeDate", value: ItemData.ArrangeDate, tableAs:"a" });
        return list;
    }
    function OK(item) {
        $uibModalInstance.close(item);
    }
    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);