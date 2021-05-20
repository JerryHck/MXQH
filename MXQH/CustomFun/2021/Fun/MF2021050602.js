'use strict';

angular.module('AppSet')
.controller('BomMateVerCtrl', ['$scope', '$http', 'AjaxService', 'toastr', '$window', 'Dialog',
function ($scope, $http, AjaxService, toastr, $window, Dialog) {

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
    vm.DownLoad = DownLoad;
    vm.OpenCMPT = OpenCMPT;

    Search();
    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Insert() {
        vm.NewItem = {};
        vm.IsInsert = true;
        Dialog.OpenDialog("BomMateSoftVerDialog", {}).then(function (data) {
            PageChange()
        }, function (em) { PageChange() })
    }

    function OpenCMPT(item) {
        Dialog.OpenDialog("BomMateSoftCMPTDialog", item).then(function (data) {

        })
    }

    function SaveInsert() {
        vm.promise = AjaxService.PlanInsert("BomMateSoftVer", vm.NewItem).then(function (data) {
            PageChange();
            toastr.success('新增成功');
            vm.IsInsert = false;
        });
    }

    function Edit(item) {
        for (var i = 0, len = vm.List.length; i < len; i++) {
            vm.List[i].IsEdit = false;
        }
        //vm.EditItem = angular.copy(item);
        //vm.NowItem = item;
        //item.IsEdit = true;
        Dialog.OpenDialog("BomMateSoftVerDialog", item).then(function (data) {
            PageChange()
        }, function (em) { PageChange() })
    }

    function Delete(item) {
        var en = angular.copy(item);
        en.ItemForm = undefined;
        vm.promise = AjaxService.PlanDelete("BomMateSoftVer", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.Code = vm.EditItem.Code;
        en.Name = vm.EditItem.Name;
        en.SPECS = vm.EditItem.SPECS;
        en.SoftVersion = vm.EditItem.SoftVersion;
        en.SDKName = vm.EditItem.SDKName;
        en.SDKUrl = vm.EditItem.SDKUrl;
        en.IsConfirm = vm.EditItem.IsConfirm;
        en.IsEffective = vm.EditItem.IsEffective;
        en.Remark = vm.EditItem.Remark;
        en.CreateDate = vm.EditItem.CreateDate;
        en.ModifyDate = vm.EditItem.ModifyDate;
        vm.promise = AjaxService.PlanUpdate("BomMateSoftVer", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("BomMateSoftVer", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }

    function DownLoad(url) {
        $window.open(url);
    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("BomMateSoftVer", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        list.push({ name: "IsEffective", value: true, tableAs: "a" });
        if (vm.Ser.aCode) {
            list.push({ name: "Code", value: vm.Ser.aCode, tableAs:"a" });
        }
        if (vm.Ser.aName) {
            list.push({ name: "Name", value: vm.Ser.aName, tableAs:"a" });
        }
        if (vm.Ser.aSoftVersion) {
            list.push({ name: "SoftVersion", value: vm.Ser.aSoftVersion, tableAs:"a" });
        }
        return list;
    }

}]);
