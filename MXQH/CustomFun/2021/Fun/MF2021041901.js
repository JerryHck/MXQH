'use strict';

angular.module('AppSet')
.controller('BcEquipmentCtrl', ['$scope', '$http', 'AjaxService', 'toastr', '$window', 'Dialog',
function ($scope, $http, AjaxService, toastr, $window, Dialog) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.Insert = Insert;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.SaveEdit = SaveEdit;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.ChangeState = ChangeState;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Insert() {
        Dialog.OpenDialog("BcEquipment", {}).then(function (data) {
            PageChange();
        }, function () { })
    }

    function Edit(item) {
        for (var i = 0, len = vm.List.length; i < len; i++) {
            vm.List[i].IsEdit = false;
        }
        vm.EditItem = angular.copy(item);
        Dialog.OpenDialog("BcEquipment", vm.EditItem).then(function (data) {
            PageChange();
        }, function () { })
    }

    function Delete(item) {
        var en = angular.copy(item);
        en.ItemForm = undefined;
        vm.promise = AjaxService.PlanDelete("BcEquipment", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.ID = vm.EditItem.ID;
        en.Code = vm.EditItem.Code;
        en.Name = vm.EditItem.Name;
        en.TypeCode = vm.EditItem.TypeCode;
        en.Brand = vm.EditItem.Brand;
        en.EqSpec = vm.EditItem.EqSpec;
        en.BuyAmount = vm.EditItem.BuyAmount;
        en.UseDept = vm.EditItem.UseDept;
        en.Dept = vm.EditItem.Dept;
        en.Location = vm.EditItem.Location;
        en.State = vm.EditItem.State;
        en.VenderName = vm.EditItem.VenderName;
        en.U9CardCode = vm.EditItem.U9CardCode;
        en.Remark = vm.EditItem.Remark;
        en.CreateBy = vm.EditItem.CreateBy;
        en.CreateDate = vm.EditItem.CreateDate;
        en.ModifyBy = vm.EditItem.ModifyBy;
        vm.promise = AjaxService.PlanUpdate("BcEquipment", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function ChangeState(item, state) {
        var en = {};
        en.ID = item.ID;
        en.State = state;
        vm.promise = AjaxService.PlanUpdate("BcEquipment", en).then(function (data) {
            PageChange();
            toastr.success('变更成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("BcEquipment", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("BcEquipment", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.aCode) {
            list.push({ name: "Code", value: vm.Ser.aCode, tableAs: "a" });
        }
        if (vm.Ser.aName) {
            list.push({ name: "Name", value: vm.Ser.aName, tableAs: "a" });
        }
        return list;
    }

}]);
