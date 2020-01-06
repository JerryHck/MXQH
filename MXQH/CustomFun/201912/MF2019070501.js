'use strict';

angular.module('app')
.controller('ctrl-PT', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
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
        vm.promise = AjaxService.PlanInsert("MesProductTemplate", vm.NewItem).then(function (data) {
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
        vm.promise = AjaxService.PlanDelete("MesProductTemplate", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.ID = vm.EditItem.ID;
        en.TypeCode = vm.EditItem.TypeCode;
        en.TypeName = vm.EditItem.TypeName;
        en.MaterialCode = vm.EditItem.MaterialCode;
        en.MaterialName = vm.EditItem.MaterialName;
        en.Code = vm.EditItem.Code;
        en.Name = vm.EditItem.Name;
        en.Code = vm.EditItem.Code;
        en.Name = vm.EditItem.Name;
        vm.promise = AjaxService.PlanUpdate("MesProductTemplate", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("MesProductTemplate", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("MesProductTemplate", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.c_TypeCode) {
            list.push({ name: "TypeCode", value: vm.Ser.c_TypeCode });
        }
        if (vm.Ser.e_MaterialCode) {
            list.push({ name: "MaterialCode", value: vm.Ser.e_MaterialCode });
        }
        return list;
    }

}]);
