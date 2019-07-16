'use strict';

angular.module('app')
.controller('ctrl-baq', ['$rootScope','Dialog', '$scope', '$http', 'AjaxService', 'toastr', '$window','$filter',
function ($rootScope,Dialog, $scope, $http, AjaxService, toastr, $window,$filter) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.Insert = Insert;
    vm.SaveInsert = SaveInsert;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.SaveEdit = SaveEdit;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    //function Insert() {
    //    vm.NewItem = {};
    //    vm.IsInsert = true;
    //}

    function Insert() {
        Open({});
    }

    function Open(item) {
        Dialog.OpenDialog("qlBadDialog", item).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }

    function SaveInsert() {
        vm.promise = AjaxService.PlanInsert("MESvw_qlBadAcquisition", vm.NewItem).then(function (data) {
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
        item.IsEdit = true;
    }

    function Delete(item) {
        var en = angular.copy(item);
        en.ItemForm = undefined;
        vm.promise = AjaxService.PlanDelete("MESvw_qlBadAcquisition", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.IsRepair = vm.EditItem.IsRepair;
        en.RepairTime = vm.EditItem.RepairTime;
        en.WorOrder = vm.EditItem.WorOrder;
        en.CustomerOrder = vm.EditItem.CustomerOrder;
        en.MaterialName = vm.EditItem.MaterialName;
        en.CustomerName = vm.EditItem.CustomerName;
        en.BarCode = vm.EditItem.BarCode;
        en.CreateDate = vm.EditItem.CreateDate;
        en.FirstPoorName = vm.EditItem.FirstPoorName;
        en.SecondPoorName = vm.EditItem.SecondPoorName;
        en.CreateName = vm.EditItem.CreateName;
        vm.promise = AjaxService.PlanUpdate("MESvw_qlBadAcquisition", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("MESvw_qlBadAcquisition", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("MESvw_qlBadAcquisition", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        var startTime = new Date(vm.Ser.a_CreateDate);
        var endTime = new Date(vm.Ser.b_CreateDate);
        var start = $filter('date')(startTime, "yyyy-MM-dd hh:mm:ss");
        var end = $filter('date')(endTime, "yyyy-MM-dd hh:mm:ss");
        console.log(start + '  ' + end);
        if (start) {
            list.push({ name: "CreateDate", value: start, type: '>=' });
        }
        if (end) {
            list.push({ name: "CreateDate", value: end, type: '<=' });
        }
        return list;
    }

}]);
