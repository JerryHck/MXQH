'use strict';

angular.module('AppSet')
.controller('MOSoftCMPTApplyCtrl', ['$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
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
        Dialog.OpenDialog("MOSoftCMPTApplyDialog", {}).then(function (data) {
            PageChange()
        }, function (em) { })
    }

    function SaveInsert() {
        vm.promise = AjaxService.PlanInsert("MOSoftCMPTApply", vm.NewItem).then(function (data) {
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
        Dialog.OpenDialog("MOSoftCMPTApplyDialog", vm.EditItem).then(function (data) {
            PageChange()
        }, function (em) { })
    }

    function Delete(item) {
        if (item.State != '0') {
            toastr.error("已经提交OA,不允许再删除");
            return;
        }
        var en = angular.copy(item);
        en.ItemForm = undefined;
        vm.promise = AjaxService.PlanDelete("MOSoftCMPTApply", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.WorkOrder = vm.EditItem.WorkOrder;
        en.MateCode = vm.EditItem.MateCode;
        en.MateName = vm.EditItem.MateName;
        en.Remark = vm.EditItem.Remark;
        en.CreateDate = vm.EditItem.CreateDate;
        en.OAFlowNO = vm.EditItem.OAFlowNO;
        vm.promise = AjaxService.PlanUpdate("MOSoftCMPTApply", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("MOSoftCMPTApply", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("MOSoftCMPTApply", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.aWorkOrder) {
            list.push({ name: "WorkOrder", value: vm.Ser.aWorkOrder, tableAs:"a" });
        }
        if (vm.Ser.aMateCode) {
            list.push({ name: "MateCode", value: vm.Ser.aMateCode, tableAs:"a" });
        }
        if (vm.Ser.aMateName) {
            list.push({ name: "MateName", value: vm.Ser.aMateName, tableAs:"a" });
        }
        return list;
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

}]);
