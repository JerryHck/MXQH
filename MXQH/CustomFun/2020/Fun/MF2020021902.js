'use strict';

angular.module('app')
.controller('qzSaleAgentCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
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
    vm.IsAddAgentNoExists = IsAddAgentNoExists;
    vm.IsEditAgentNoExists=IsEditAgentNoExists;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Insert() {
        vm.NewItem = {};
        vm.IsInsert = true;
    }

    function SaveInsert() {
        vm.promise = AjaxService.PlanInsert("QZSaleAgent", vm.NewItem).then(function (data) {
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
        AjaxService.GetPlansTop("QZSaleDeliver", { name: "AgentNo", value: en.AgentNo }, 1).then(function (data2) {
            if (data2.length == 0) {
                AjaxService.PlanDelete("QZSaleAgent", en).then(function (data) {
                    PageChange();
                    toastr.success('删除成功');
                });
            }
            else {
                toastr.error("已经和该代理商出货， 无法删除");
            }
        })
    }

    function SaveEdit(index) {
        var en = {};
        en.Id = vm.EditItem.Id;
        en.AgentNo = vm.EditItem.AgentNo;
        en.AgentName = vm.EditItem.AgentName;
        en.Remark = vm.EditItem.Remark;
        vm.promise = AjaxService.PlanUpdate("QZSaleAgent", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("QZSaleAgent", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("QZSaleAgent", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function IsAddAgentNoExists() {
        var list = [];
        list.push({ name: "AgentNo", value: vm.NewItem.AgentNo });
        vm.promise = AjaxService.GetPlan("QZSaleAgent", list).then(function (data) {
            vm.InsertForm.AgentNo.$setValidity('unique', !data.AgentNo);
        });
    }
    function IsEditAgentNoExists() {
        if(vm.NowItem.AgentNo != vm.EditItem.AgentNo){
            var list = [];
            list.push({ name: "AgentNo", value: vm.EditItem.AgentNo });
            AjaxService.GetPlan("QZSaleAgent", list).then(function (data) {
                vm.NowItem.ItemForm.item_AgentNo.$setValidity('unique', !data.AgentNo);
            });
        }
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.a_AgentNo) {
            list.push({ name: "AgentNo", value: vm.Ser.a_AgentNo, tableAs:"a" });
        }
        if (vm.Ser.a_AgentName) {
            list.push({ name: "AgentName", value: vm.Ser.a_AgentName, tableAs:"a" });
        }
        return list;
    }

}]);
