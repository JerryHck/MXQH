'use strict';

angular.module('app')
.controller('TableCongfigCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
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
        vm.NewItem = { TbName: vm.Ser.a_TbName, ClName: vm.Ser.a_ClName,   ClSts: 'S'};
        vm.IsInsert = true;
    }

    function SaveInsert() {
        vm.promise = AjaxService.PlanInsert("MXTableConfig", vm.NewItem).then(function (data) {
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
        vm.promise = AjaxService.PlanDelete("MXTableConfig", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.TbName = vm.EditItem.TbName;
        en.ClName = vm.EditItem.ClName;
        en.ClInf = vm.EditItem.ClInf;
        en.ClDesc = vm.EditItem.ClDesc;
        en.ClOrder = vm.EditItem.ClOrder;
        en.ClSts = vm.EditItem.ClSts;
        vm.promise = AjaxService.PlanUpdate("MXTableConfig", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("MXTableConfig", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("MXTableConfig", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.a_TbName) {
            list.push({ name: "TbName", value: vm.Ser.a_TbName, tableAs:"a" });
        }
        if (vm.Ser.a_ClName) {
            list.push({ name: "ClName", value: vm.Ser.a_ClName, tableAs:"a" });
        }
        return list;
    }

}]);