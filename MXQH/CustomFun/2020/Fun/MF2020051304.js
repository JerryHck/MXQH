'use strict';

angular.module('AppSet')
.controller('RepairApplyCtrl', ['$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page1 = { index: 1, size: 12 };
    vm.Ser1 = { aState: "0" };

    vm.Insert1 = Insert1;
    vm.SaveInsert1 = SaveInsert1;
    vm.Edit1 = Edit1;
    vm.Delete1 = Delete1;
    vm.SaveEdit1 = SaveEdit1;
    vm.PageChange1 = PageChange1;
    vm.Search1 = Search1;

    $scope.$watch(function () { return vm.Ser1.aState; }, Search1);
    //Search();
    function Search1() {
        vm.page1.index = 1;
        PageChange1();
    }

    function Insert1() {
        vm.NewItem1 = { State: "0", StateText: "申请", DataType: "R" };
        vm.IsInsert1 = true;
    }

    function SaveInsert1() {
        vm.promise = AjaxService.PlanInsert("bcUnusualHour", vm.NewItem1).then(function (data) {
            PageChange1();
            toastr.success('新增成功');
            vm.IsInsert1 = false;
        });
    }

    function Edit1(item) {
        for (var i = 0, len = vm.List1.length; i < len; i++) {
            vm.List1[i].IsEdit = false;
        }
        vm.EditItem1 = angular.copy(item);
        vm.EditItem1.ApplyDate = (new Date(vm.EditItem1.ApplyDate)).Format('yyyy-MM-dd');
        vm.NowItem1 = item;
        item.IsEdit = true;
    }

    function Delete1(item) {
        var en = angular.copy(item);
        en.ItemForm = undefined;
        vm.promise = AjaxService.PlanDelete("bcUnusualHour", en).then(function (data) {
            PageChange1();
            toastr.success('删除成功');
        });
    }

    function SaveEdit1(index) {
        var en = {};
        en.Id = vm.EditItem1.Id;
        en.LineID = vm.EditItem1.LineID;
        en.ApplyDate = vm.EditItem1.ApplyDate;
        en.UnusualHour = vm.EditItem1.UnusualHour;
        en.WorkOrder = vm.EditItem1.WorkOrder;
        en.Remark = vm.EditItem1.Remark;
        vm.promise = AjaxService.PlanUpdate("bcUnusualHour", en).then(function (data) {
            PageChange1();
            toastr.success('更新成功');
        });
    }

    function PageChange1() {
        vm.promise = AjaxService.GetPlansPage("bcUnusualHour", GetContition1(), vm.page1.index, vm.page1.size).then(function (data) {
            vm.List1 = data.List;
            vm.page1.total = data.Count;
        });

    }

    function GetContition1() {
        var list = [];
        if (vm.Ser1.aState) {
            list.push({ name: "State", value: vm.Ser1.aState, tableAs: "a" });
        }
        if (vm.Ser1.LineID) {
            list.push({ name: "LineID", value: vm.Ser1.LineID, tableAs: "a" });
        }
        if (vm.Ser1.ApplyDate) {
            list.push({ name: "ApplyDate", value: vm.Ser1.ApplyDate, tableAs: "a" });
        }
        list.push({ name: "DataType", value: "R", tableAs: "a" });
        return list;
    }

}]);
