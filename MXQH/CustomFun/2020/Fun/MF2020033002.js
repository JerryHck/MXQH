'use strict';

angular.module('AppSet')
.controller('MoPlanCountCtrl', ['$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($scope, Dialog, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.Ser.a_PlanDate = '';
    vm.Ser.a_WorkOrder = '';
    vm.Ser.b_MaterialCode = '';

    vm.DateOption = {
        format: 'Y-m-d',
        formatDate: 'Y-m-d',
        timepicker: false
    };

    vm.Insert = Insert;
    vm.SaveInsert = SaveInsert;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.SaveEdit = SaveEdit;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.IsAddWorkOrderExists = IsAddWorkOrderExists;
    vm.IsEditWorkOrderExists=IsEditWorkOrderExists;

    vm.OpenMoDialog = OpenMoDialog;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Insert() {
        vm.NewItem = {};
        vm.IsInsert = true;
    }

    function SaveInsert() {
        vm.promise = AjaxService.PlanInsert("MoPlanCount", vm.NewItem).then(function (data) {
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
        vm.promise = AjaxService.PlanDelete("MoPlanCount", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.Id = vm.EditItem.Id;
        en.PlanDate = vm.EditItem.PlanDate;
        en.WorkOrder = vm.EditItem.WorkOrder;
        en.PlanCount = vm.EditItem.PlanCount;
        en.Remark = vm.EditItem.Remark;
        vm.promise = AjaxService.PlanUpdate("MoPlanCount", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("MoPlanCount", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("MoPlanCount", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function IsAddWorkOrderExists() {
        var list = [];
        list.push({ name: "WorkOrder", value: vm.NewItem.WorkOrder });
        AjaxService.GetPlan("MoPlanCount", list).then(function (data) {
            vm.InsertForm.WorkOrder.$setValidity('unique', !data.WorkOrder);
        });
    }
    function IsEditWorkOrderExists() {
        if(vm.NowItem.WorkOrder != vm.EditItem.WorkOrder){
            var list = [];
            list.push({ name: "WorkOrder", value: vm.EditItem.WorkOrder });
            vm.promise = AjaxService.GetPlan("MoPlanCount", list).then(function (data) {
                vm.NowItem.ItemForm.item_WorkOrder.$setValidity('unique', !data.WorkOrder);
            });
        }
    }


    function OpenMoDialog() {
        if (!vm.NewItem.PlanDate)
        {
            toastr.error("请先选择排产日期");
            return;
        }
        Dialog.OpenDialog("MESMODialog", {}).then(function (data) {
            vm.SelectedMo = data;
        })
    }


    function GetContition() {
        var list = [];
        if (vm.Ser.aPlanDate) {
            list.push({ name: "PlanDate", value: vm.Ser.aPlanDate, tableAs:"a" });
        }
        if (vm.Ser.aWorkOrder) {
            list.push({ name: "WorkOrder", value: vm.Ser.aWorkOrder, tableAs:"a" });
        }
        if (vm.Ser.bMaterialCode) {
            list.push({ name: "MaterialCode", value: vm.Ser.bMaterialCode, tableAs:"b" });
        }
        return list;
    }

}]);
