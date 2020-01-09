'use strict';

angular.module('app')
.controller('ctrl-SnRule', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
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
    vm.Add = Add;

   
    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Insert() {
        vm.SrMaterial = {};
        vm.NewItem = {};
        vm.NewItem.IsCreateID = false;
        vm.IsInsert = true;
    }

    function SaveInsert() {
       
        vm.promise = AjaxService.PlanInsert("BaSnRule", vm.NewItem).then(function (data) {
            PageChange();
            toastr.success('新增成功');
            vm.IsInsert = false;
        });
    }
    function Add() {
        var en = {};
        en.MaterialID = vm.SrMaterial.Id;
        en.PartA = vm.NewItem.PartA;
        en.PartB = vm.NewItem.PartB;
        en.PartC = vm.NewItem.PartC;
        en.PartD = vm.NewItem.PartD;
        en.IsValid = false;
        en.SerialNoStart = vm.NewItem.SerialNoStart;
        en.IsCreateID = vm.NewItem.IsCreateID;
        if (en.SerialNoStart == null) {
            en.SerialNoStart = '';
        }
        vm.promise = AjaxService.ExecPlan("BaSnRule", 'add', en).then(function (data) {
            if (data.data[0].MsgType == "Success") {
                PageChange();
                toastr.success('新增成功');
                vm.IsInsert = false;
            }
            else {
                toastr.error(data.data[0].Msg);
            }

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
        vm.promise = AjaxService.PlanDelete("BaSnRule", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.ID = vm.EditItem.ID;
        en.MaterialName = vm.EditItem.MaterialName;
        en.MaterialCode = vm.EditItem.MaterialCode;
        en.PartA = vm.EditItem.PartA;
        en.PartB = vm.EditItem.PartB;
        en.PartC = vm.EditItem.PartC;
        en.PartD = vm.EditItem.PartD;
        en.SerialNoStart = vm.EditItem.SerialNoStart;
        en.IsCreateID = vm.EditItem.IsCreateID;
        vm.promise = AjaxService.PlanUpdate("BaSnRule", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("BaSnRule", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("BaSnRule", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.a_MaterialID) {
            list.push({ name: "MaterialID", value: vm.Ser.a_MaterialID });
        }
        return list;
    }

}]);
