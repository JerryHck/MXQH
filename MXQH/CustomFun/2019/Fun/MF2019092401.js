'use strict';

angular.module('app')
.controller('Rpoorctrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
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
    vm.IsAddCodeExists = IsAddCodeExists;
    vm.IsEditCodeExists=IsEditCodeExists;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Insert() {
        vm.NewItem = {};
        vm.IsInsert = true;
    }

    function SaveInsert() {
        vm.promise = AjaxService.PlanInsert("RPoor", vm.NewItem).then(function (data) {
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
        vm.promise = AjaxService.PlanDelete("RPoor", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.ID = vm.EditItem.ID;
        en.Code = vm.EditItem.Code;
        en.PID = vm.EditItem.PID;
        en.Name = vm.EditItem.Name;
        en.Description = vm.EditItem.Description;
        en.Layer = vm.EditItem.Layer;
        vm.promise = AjaxService.PlanUpdate("RPoor", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("RPoor", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("RPoor", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function IsAddCodeExists() {
        var list = [];
        list.push({ name: "Code", value: vm.NewItem.Code });
        vm.promise = AjaxService.GetPlan("RPoor", list).then(function (data) {
            vm.InsertForm.Code.$setValidity('unique', !data.Code);
        });
    }
    function IsEditCodeExists() {
        if(vm.NowItem.Code != vm.EditItem.Code){
            var list = [];
            list.push({ name: "Code", value: vm.EditItem.Code });
            vm.promise = AjaxService.GetPlan("RPoor", list).then(function (data) {
                vm.NowItem.ItemForm.item_Code.$setValidity('unique', !data.Code);
            });
        }
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.a_Name) {
            list.push({ name: "Name", value: vm.Ser.a_Name, tableAs:"a" });
        }
        return list;
    }

}]);
