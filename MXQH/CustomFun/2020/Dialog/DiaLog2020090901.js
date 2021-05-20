'use strict';

angular.module('AppSet')
.controller('BlMOOSLabelDtlCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window', 'FileUrl',
function ($scope, ItemData, $uibModalInstance, AjaxService, toastr, $window, FileUrl) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
    vm.Ser = {};
    vm.ItemData = ItemData;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.OK = OK;
    vm.Cancel = Cancel;
    vm.CalToBox = CalToBox;
    vm.Select = Select;
    vm.Delete = Delete;
    vm.SaveEdit = SaveEdit;

    Search();
    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function CalToBox(qty, per) {
        return Math.ceil(qty / per)
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("BlMOPackOSLabelDtl", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }

    function Delete(item) {
        if (item.IsPrint) {
            toastr.error("外箱标签已经打印，不允许删除");
            return;
        }
        vm.promise = AjaxService.PlanDelete("BlMOPackOSLabelDtl", { AssemblyPlanDetailID: item.AssemblyPlanDetailID, OSNCode: item.OSNCode }).then(function (data) {
            PageChange();
            toastr.success("删除成功");
        })
    }

    function SaveEdit() {
        var en = {};
        en.AssemblyPlanDetailID = vm.ItemData.AssemblyPlanDetailID;
        en.PrintNum = vm.ItemData.PrintNum;
        en.PerPackNum = vm.ItemData.PerPackNum;
        en.ModifyBy = '';
        en.ModifyDate = '';
        vm.promise = AjaxService.PlanUpdate("BlMOPackOSLabel", en).then(function (data) {
            toastr.success("更新成功");
        })
    }

    function Select(item) {
        vm.ShowSn = FileUrl + item.UrlPath;
    }

    function GetContition() {
        var list = [];
        if (vm.Ser.aOSNCode) {
            list.push({ name: "OSNCode", value: vm.Ser.aOSNCode, tableAs:"a" });
        }
        list.push({ name: "AssemblyPlanDetailID", value: vm.ItemData.AssemblyPlanDetailID, tableAs: "a" });
        return list;
    }
    function OK(item) {
        $uibModalInstance.close(item);
    }
    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);
