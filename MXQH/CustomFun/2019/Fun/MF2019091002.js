'use strict';

angular.module('app')
.controller('SystemVerCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
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
    vm.IsAddVerExists = IsAddVerExists;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Insert() {
        vm.NewItem = {};
        vm.IsInsert = true;
    }

    function SaveInsert() {
        vm.NewItem.CreateBy = '';
        vm.promise = AjaxService.PlanInsert("SysVersion", vm.NewItem).then(function (data) {
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
        vm.promise = AjaxService.PlanDelete("SysVersion", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.Id = vm.EditItem.Id;
        en.Ver = vm.EditItem.Ver;
        en.Name = vm.EditItem.Name;
        en.Remark = vm.EditItem.Remark;
        en.CreateBy = vm.EditItem.CreateBy;
        vm.promise = AjaxService.PlanUpdate("SysVersion", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("SysVersion", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            console.log(data)
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("SysVersion", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function IsAddVerExists() {
        var list = [];
        list.push({ name: "Ver", value: vm.NewItem.Ver });
        vm.promise = AjaxService.GetPlan("SysVersion", list).then(function (data) {
            vm.InsertForm.Ver.$setValidity('unique', !data.Ver);
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.a_Name) {
            list.push({ name: "Name", value: vm.Ser.a_Name, tableAs:"a" });
        }
        if (vm.Ser.a_Ver) {
            list.push({ name: "Ver", value: vm.Ser.a_Ver, tableAs:"a" });
        }
        return list;
    }

}]);
