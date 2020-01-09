'use strict';

angular.module('app')
.controller('Procedurectrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.Ser.a_IsUse = "1";

    vm.Insert = Insert;
    vm.SaveInsert = SaveInsert;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.SaveEdit = SaveEdit;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.IsAddCodeExists = IsAddCodeExists;
    vm.IsAddNameExists = IsAddNameExists;
    vm.IsEditNameExists=IsEditNameExists;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Insert() {
        vm.NewItem = {};
        vm.IsInsert = true;
    }

    function SaveInsert() {
        vm.promise = AjaxService.PlanInsert("MESBoProcedure", vm.NewItem).then(function (data) {
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
        vm.promise = AjaxService.PlanDelete("MESBoProcedure", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.ID = vm.EditItem.ID;
        en.Code = vm.EditItem.Code;
        en.Name = vm.EditItem.Name;
        en.IsUse = vm.EditItem.IsUse;
        en.TimeConsume = vm.EditItem.TimeConsume;
        en.LowerFPY = vm.EditItem.LowerFPY;
        en.IsAss = vm.EditItem.IsAss;
        en.IsOutput = vm.EditItem.IsOutput;
        en.IsMonitor = vm.EditItem.IsMonitor;
        en.WorkSection = vm.EditItem.WorkSection;
        en.TS = vm.EditItem.TS;
        vm.promise = AjaxService.PlanUpdate("MESBoProcedure", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("MESBoProcedure", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("MESBoProcedure", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function IsAddCodeExists() {
        var list = [];
        list.push({ name: "Code", value: vm.NewItem.Code });
        vm.promise = AjaxService.GetPlan("MESBoProcedure", list).then(function (data) {
            vm.InsertForm.Code.$setValidity('unique', !data.Code);
        });
    }
    function IsAddNameExists() {
        var list = [];
        list.push({ name: "Name", value: vm.NewItem.Name });
        vm.promise = AjaxService.GetPlan("MESBoProcedure", list).then(function (data) {
            vm.InsertForm.Name.$setValidity('unique', !data.Name);
        });
    }
    function IsEditNameExists() {
        if(vm.NowItem.Name != vm.EditItem.Name){
            var list = [];
            list.push({ name: "Name", value: vm.EditItem.Name });
            vm.promise = AjaxService.GetPlan("MESBoProcedure", list).then(function (data) {
                vm.NowItem.ItemForm.item_Name.$setValidity('unique', !data.Name);
            });
        }
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.a_Name) {
            list.push({ name: "Name", value: vm.Ser.a_Name, tableAs:"a" });
        }
        if (vm.Ser.a_IsUse) {
            list.push({ name: "IsUse", value: vm.Ser.a_IsUse, tableAs:"a" });
        }
        return list;
    }

}]);
