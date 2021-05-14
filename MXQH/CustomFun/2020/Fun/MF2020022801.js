'use strict';

angular.module('app')
.controller('BSNDumpCheckCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

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
        vm.promise = AjaxService.PlanInsert("MESopPlanExMainDump", vm.NewItem).then(function (data) {
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
        vm.promise = AjaxService.PlanDelete("MESopPlanExMainDump", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.WorkOrder = vm.EditItem.WorkOrder;
        en.MaterialCode = vm.EditItem.MaterialCode;
        en.MaterialName = vm.EditItem.MaterialName;
        en.InternalCode = vm.EditItem.InternalCode;
        en.Remark = vm.EditItem.Remark;
        en.Creater = vm.EditItem.Creater;
        en.CreateDate = vm.EditItem.CreateDate;
        en.CheckUser = vm.EditItem.CheckUser;
        en.CheckDate = vm.EditItem.CheckDate;
        vm.promise = AjaxService.PlanUpdate("MESopPlanExMainDump", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("MESopPlanExMainDump", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("MESopPlanExMainDump", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.a_InternalCode) {
            list.push({ name: "InternalCode", value: vm.Ser.a_InternalCode, tableAs:"a" });
        }
        if (vm.Ser.c_WorkOrder) {
            list.push({ name: "WorkOrder", value: vm.Ser.c_WorkOrder, tableAs:"c" });
        }
        return list;
    }

}]);
