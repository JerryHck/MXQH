'use strict';

angular.module('AppSet')
.controller('txWorkOrderSetCtrl', ['$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.Edit = Edit;
    vm.SaveEdit = SaveEdit;
    vm.PageChange = PageChange;
    vm.Search = Search;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }


    function Edit(item) {
        for (var i = 0, len = vm.List.length; i < len; i++) {
            vm.List[i].IsEdit = false;
        }
        vm.EditItem = angular.copy(item);
        if (item.TbName && item.ClName) {
            vm.EditItem.SerialItem = { TbName: item.TbName, ClName: item.ClName };
        }
        vm.NowItem = item;
        item.IsEdit = true;
    }

    function SaveEdit(index) {
        var en = {};
        en.AssemblyPlanDetailID = vm.EditItem.AssemblyPlanDetailID;
        en.BetchNo = vm.EditItem.BetchNo;
        en.TbName = vm.EditItem.SerialItem.TbName;
        en.ClName = vm.EditItem.SerialItem.ClName;
        en.Remark = vm.EditItem.Remark;
        vm.promise = AjaxService.ExecPlan("vwTextWorkOrderSet", "save", en).then(function (data) {
            PageChange();
            toastr.success('保存成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("vwTextWorkOrderSet", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            for (var i = 0, len = vm.List.length; i < len; i++) {
                Preview(vm.List[i]);
            }
            vm.page.total = data.Count;
        });

    }

    function Preview(item) {
        if (item.TbName && item.ClName) {
            var en = {};
            en.TbName = item.TbName;
            en.ClName = item.ClName;
            en.CharName = item.BetchNo;
            AjaxService.ExecPlan("SerialNumberSet", "preview", en).then(function (data) {
                item.PrevSN = data.data[0] ? data.data[0].SN : "";
            })
        }
    }

    function GetContition() {
        var list = [];
        if (vm.Ser.aWorkOrder) {
            list.push({ name: "WorkOrder", value: vm.Ser.aWorkOrder, tableAs:"a" });
        }
        if (vm.Ser.aMaterialCode) {
            list.push({ name: "MaterialCode", value: vm.Ser.aMaterialCode, tableAs:"a" });
        }
        return list;
    }

}]);
