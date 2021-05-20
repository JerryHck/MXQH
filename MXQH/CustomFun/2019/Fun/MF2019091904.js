'use strict';

angular.module('app')
.controller('qlBadAcquisitionCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window','$filter',
function ($rootScope, $scope, $http, AjaxService, toastr, $window, $filter) {

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

    function Insert() {
        vm.NewItem = {};
        vm.IsInsert = true;
    }

    function SaveInsert() {
        vm.promise = AjaxService.PlanInsert("qlbad", vm.NewItem).then(function (data) {
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
        vm.NowItem = item;
        item.IsEdit = true;
    }

    function Delete(item) {
        var en = angular.copy(item);
        en.ItemForm = undefined;
        vm.promise = AjaxService.PlanDelete("qlbad", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.CreateName = vm.EditItem.CreateName;
        en.CreateDate = vm.EditItem.CreateDate;
        en.AssemblyLineName = vm.EditItem.AssemblyLineName;
        en.MaterialName = vm.EditItem.MaterialName;
        en.WorOrder = vm.EditItem.WorOrder;
        en.Quantity = vm.EditItem.Quantity;
        en.BarCode = vm.EditItem.BarCode;
        en.name = vm.EditItem.name;
        en.ProcedureName = vm.EditItem.ProcedureName;
        en.WorkPartName = vm.EditItem.WorkPartName;
        en.ProcessingMode = vm.EditItem.ProcessingMode;
        en.RepairTime = vm.EditItem.RepairTime;
        vm.promise = AjaxService.PlanUpdate("qlbad", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("qlbad", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("qlbad", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
       
        var start1 = new Date(vm.Ser.start);
        var end1 = new Date(vm.Ser.end);
        var startTime = $filter('date')(start1, "yyyy-MM-dd HH:mm:ss");
        var endTime = $filter('date')(end1, "yyyy-MM-dd HH:mm:ss");

        if (vm.Ser.start) {
            list.push({ name: "RepairTime", value: startTime, type: '>=' });
        }
        if (vm.Ser.end) {
            list.push({ name: "RepairTime", value: endTime, type: '<=' });
        }
        if (vm.Ser.BarCode) {
            list.push({ name: "BarCode", value: '%' + vm.Ser.BarCode + '%' });
        }
        if (vm.Ser.CreateName) {
            list.push({ name: "CreateName", value: '%' + vm.Ser.CreateName + '%' });
        }
        list.push({ name: "IsRepair", value: '1' });
        return list;
    }

}]);
