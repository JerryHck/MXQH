'use strict';

angular.module('AppSet')
.controller('bcEquipmentRpCtrl', ['$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
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
        Dialog.OpenDialog("EquipmentRpDialog", {}).then(function (data) {
            PageChange()
        }, function (em) { })
    }

    function SaveInsert() {
        vm.promise = AjaxService.PlanInsert("BcEquipmentRp", vm.NewItem).then(function (data) {
            PageChange();
            toastr.success('新增成功');
            vm.IsInsert = false;
        });
    }

    function Edit(item) {
        Dialog.OpenDialog("EquipmentRpDialog", item).then(function (data) {
            PageChange()
        }, function (em) { })
    }

    function Delete(item) {
        var en = angular.copy(item);
        en.ItemForm = undefined;
        vm.promise = AjaxService.PlanDelete("BcEquipmentRp", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.OAFlowNO = vm.EditItem.OAFlowNO;
        en.StartTime = vm.EditItem.StartTime;
        en.Amount = vm.EditItem.Amount;
        en.Remark = vm.EditItem.Remark;
        vm.promise = AjaxService.PlanUpdate("BcEquipmentRp", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
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

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("BcEquipmentRp", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("BcEquipmentRp", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.aCode) {
            list.push({ name: "Code", value: vm.Ser.aCode, tableAs:"a" });
        }
        if (vm.Ser.bName) {
            list.push({ name: "Name", value: vm.Ser.bName, tableAs:"b" });
        }
        if (vm.Ser.aOpType) {
            list.push({ name: "OpType", value: vm.Ser.aOpType, tableAs:"a" });
        }
        return list;
    }

}]);
