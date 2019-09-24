'use strict';

angular.module('app')
.controller('TestCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
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
    vm.IsAddOrgNameExists = IsAddOrgNameExists;
    vm.IsEditOrgNameExists=IsEditOrgNameExists;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Insert() {
        vm.NewItem = {};
        vm.IsInsert = true;
    }

    function SaveInsert() {
        vm.promise = AjaxService.PlanInsert("SystemOrg", vm.NewItem).then(function (data) {
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
        vm.promise = AjaxService.PlanDelete("SystemOrg", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.OrgSn = vm.EditItem.OrgSn;
        en.OrgName = vm.EditItem.OrgName;
        en.IsUsed = vm.EditItem.IsUsed;
        en.OrgName = vm.EditItem.OrgName;
        en.CompanyName = vm.EditItem.CompanyName;
        en.OrgDesc = vm.EditItem.OrgDesc;
        vm.promise = AjaxService.PlanUpdate("SystemOrg", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("SystemOrg", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("SystemOrg", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function IsAddOrgNameExists() {
        var list = [];
        list.push({ name: "OrgName", value: vm.NewItem.OrgName });
        vm.promise = AjaxService.GetPlan("SystemOrg", list).then(function (data) {
            vm.InsertForm.OrgName.$setValidity('unique', !data.OrgName);
        });
    }
    function IsEditOrgNameExists() {
        if(vm.NowItem.OrgName != vm.EditItem.OrgName){
            var list = [];
            list.push({ name: "OrgName", value: vm.EditItem.OrgName });
            vm.promise = AjaxService.GetPlan("SystemOrg", list).then(function (data) {
                vm.NowItem.ItemForm.item_OrgName.$setValidity('unique', !data.OrgName);
            });
        }
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.a_OrgName) {
            list.push({ name: "OrgName", value: vm.Ser.a_OrgName, tableAs:"a" });
        }
        if (vm.Ser.a_OrgSn) {
            list.push({ name: "OrgSn", value: vm.Ser.a_OrgSn, tableAs:"a" });
        }
        return list;
    }

}]);
