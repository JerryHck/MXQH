'use strict';

angular.module('AppSet')
.controller('UnusualHourCtrl', ['$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.page1 = { index: 1, size: 12 };
    vm.Ser = { aState: "0" };
    vm.Ser1 = { aState: "0" };

    vm.Insert = Insert;
    vm.SaveInsert = SaveInsert;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.SaveEdit = SaveEdit;
    vm.PageChange = PageChange;
    vm.Search = Search;


    $scope.$watch(function () { return vm.Ser.aState; }, Search);
    //Search();

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Insert() {
        vm.NewItem = { State: "0", StateText: "申请", DataType: "U" };
        vm.IsInsert = true;
    }

    function SaveInsert() {
        vm.promise = AjaxService.PlanInsert("bcUnusualHour", vm.NewItem).then(function (data) {
            PageChange();
            toastr.success('新增成功');
            vm.IsInsert = false;
        });
    }

    function Edit(item) {
        for (var i = 0, len = vm.List.length; i < len; i++) {
            vm.List[i].IsEdit = false;
        }
        vm.EditItem = angular.copy(item);
        vm.EditItem.ApplyDate = (new Date(vm.EditItem.ApplyDate)).Format('yyyy-MM-dd');
        vm.NowItem = item;
        item.IsEdit = true;
    }

    function Delete(item) {
        var en = angular.copy(item);
        en.ItemForm = undefined;
        vm.promise = AjaxService.PlanDelete("bcUnusualHour", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.Id = vm.EditItem.Id;
        en.ApplyDate = vm.EditItem.ApplyDate;
        en.LineID = vm.EditItem.LineID;
        en.UnusualHour = vm.EditItem.UnusualHour;
        en.WorkOrder = vm.EditItem.WorkOrder;
        en.Remark = vm.EditItem.Remark;
        vm.promise = AjaxService.PlanUpdate("bcUnusualHour", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("bcUnusualHour", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("bcUnusualHour", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.aState) {
            list.push({ name: "State", value: vm.Ser.aState, tableAs:"a" });
        }
        list.push({ name: "DataType", value: "U", tableAs: "a" });

        return list;
    }
}]);
