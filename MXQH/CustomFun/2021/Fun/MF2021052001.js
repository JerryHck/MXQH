'use strict';

angular.module('AppSet')
.controller('MOSoftCtrl2', ['$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
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
    vm.selectWorkOrder = selectWorkOrder;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Insert() {
        vm.NewItem = { IsControl :true};
        vm.IsInsert = true;
    }
    function IsExists(aWorkOrder, aWPO) {

    }
    function SaveInsert() {
        var list = [];
        list.push({ name: "WorkOrder", value: vm.NewItem.WorkOrder, tableAs: "a" });
        list.push({ name: "WPO", value: vm.NewItem.WPO, tableAs: "a" });
        vm.promise = AjaxService.GetPlansPage("MOSoftControl", list, 1, 10).then(function (data) {
            if (data.Count == 0) {
                vm.NewItem.CreateDate = new Date().toLocaleDateString();
                vm.promise = AjaxService.PlanInsert("MOSoftControl", vm.NewItem).then(function (data) {
                    PageChange();
                    toastr.success('新增成功');
                    vm.IsInsert = false;
                });
            } else {
                toastr.error('该工单信息已存在，不可重复添加！');
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
        vm.promise = AjaxService.PlanDelete("MOSoftControl", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var list = [];
        list.push({ name: "WorkOrder", value: vm.EditItem.WorkOrder, tableAs: "a" });
        list.push({ name: "WPO", value: vm.EditItem.WPO, tableAs: "a" });
        console.log(vm.EditItem);
        vm.promise = AjaxService.GetPlansPage("MOSoftControl", list, 1, 10).then(function (data) {
            console.log(data);
            for (var i = 0; i < data.Count; i++) {
                if (data.List[i].ID != vm.EditItem.ID) {
                    toastr.error('存在相同的工单信息，修改失败！');
                    return;
                }
            }
            var en = {};
            en.ID = vm.EditItem.ID;
            en.CreateDate = vm.EditItem.CreateDate;
            en.CreateBy = vm.EditItem.CreateBy;
            en.ModifyBy = vm.EditItem.ModifyBy;
            en.ModifyDate = vm.EditItem.ModifyDate;
            en.WorkOrder = vm.EditItem.WorkOrder;
            en.WPO = vm.EditItem.WPO;
            en.DocLineNo = vm.EditItem.DocLineNo;
            en.AuVenSN = vm.EditItem.AuVenSN;
            en.IsControl = vm.EditItem.IsControl;
            vm.promise = AjaxService.PlanUpdate("MOSoftControl", en).then(function (data) {
                PageChange();
                toastr.success('更新成功');
            });
        });


    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("MOSoftControl", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("MOSoftControl", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.aWorkOrder) {
            list.push({ name: "WorkOrder", value: vm.Ser.aWorkOrder, tableAs: "a" });
        }
        if (vm.Ser.aWPO) {
            list.push({ name: "WPO", value: vm.Ser.aWPO, tableAs: "a" });
        }
        if (vm.Ser.aAuVenSN) {
            list.push({ name: "AuVenSN", value: vm.Ser.aAuVenSN, tableAs: "a" });
        }
        return list;
    }
    function selectWorkOrder(IsAdd) {
        Dialog.OpenDialog("U9MOAndWpo", {}).then(function (data) {
            if (IsAdd) {
                vm.NewItem.WorkOrder = data.DocNo;
                vm.NewItem.WPO = data.WPO == undefined ? '' : data.WPO;
                vm.NewItem.DocLineNo = data.DocLineNo == undefined ? '' : data.DocLineNo;
                vm.NewItem.Code = data.Code;
                vm.NewItem.Name = data.Name;
            } else {
                vm.EditItem.WorkOrder = data.DocNo;
                vm.EditItem.WPO = data.WPO == undefined ? '' : data.WPO;
                vm.EditItem.DocLineNo = data.DocLineNo == undefined ? '' : data.DocLineNo;
                vm.EditItem.Code = data.Code;
                vm.EditItem.Name = data.Name;
            }
        })

    }

}]);
