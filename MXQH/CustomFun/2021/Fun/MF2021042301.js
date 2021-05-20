'use strict';

angular.module('AppSet')
.controller('EquipmentHitchCtrl', ['$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($scope, Dialog, AjaxService, toastr, $window) {

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
    vm.OpenOAUrl = OpenOAUrl;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Insert() {
        vm.NewItem = {};
        vm.IsInsert = true;
        Dialog.OpenDialog("EquipmentHitchDialog", {}).then(function (data) {
            PageChange()
        }, function (em) { })
    }

    function SaveInsert() {
        vm.promise = AjaxService.PlanInsert("BcEquipmentHitch", vm.NewItem).then(function (data) {
            PageChange();
            toastr.success('新增成功');
            vm.IsInsert = false;
        });
    }

    function Edit(item) {
        Dialog.OpenDialog("EquipmentHitchDialog", item).then(function (data) {
            PageChange()
        }, function (em) { })
    }

    function Delete(item) {
        var en = angular.copy(item);
        en.ItemForm = undefined;
        vm.promise = AjaxService.PlanDelete("BcEquipmentHitch", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.Code = vm.EditItem.Code;
        en.HitchTime = vm.EditItem.HitchTime;
        en.HitchDesc = vm.EditItem.HitchDesc;
        en.StateDesc = vm.EditItem.StateDesc;
        en.Creator = vm.EditItem.Creator;
        en.CreateDate = vm.EditItem.CreateDate;
        vm.promise = AjaxService.PlanUpdate("BcEquipmentHitch", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("BcEquipmentHitch", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }

    function OpenOAUrl(item) {
        //呼叫OA接口
        var en = {};
        en.Url = "OAUrl";
        en.OAFlowID = item.OAFlowID;
        //en.CreateBy = ""; //不提供值时默认系统登录人
        vm.promise = AjaxService.Custom("GetOAWorkFlowUrl", en).then(function (data) {
            console.log(data)
            $window.open(data);
        })

    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("BcEquipmentHitch", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.bCode) {
            list.push({ name: "Code", value: vm.Ser.bCode, tableAs:"b" });
        }
        if (vm.Ser.bName) {
            list.push({ name: "Name", value: vm.Ser.bName, tableAs:"b" });
        }
        return list;
    }

}]);
