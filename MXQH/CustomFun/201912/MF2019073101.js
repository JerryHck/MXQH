'use strict';

angular.module('app')
.controller('plAssemblyPlanDetailHHctrl', ['Dialog', '$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function (Dialog,$rootScope, $scope, $http, AjaxService, toastr, $window) {

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

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Insert() {
        vm.NewItem = {};
        vm.IsInsert = true;
    }

    function SaveInsert() {
        vm.promise = AjaxService.PlanInsert("VWMesMxWOrderHH", vm.NewItem).then(function (data) {
            PageChange();
            toastr.success('新增成功');
            vm.IsInsert = false;
        });
    }

    //function Edit(item) {
    //    for (var i = 0, len = vm.List.length; i < len; i++) {
    //        vm.List[i].IsEdit = false;
    //    }
    //    vm.EditItem = angular.copy(item);
    //    item.IsEdit = true;
    //}
    function Edit(item) {

        item.type = 1;
        item.IsEdit = true;
        Open(item);

    }
    function Open(item) {
        Dialog.OpenDialog("WorkOrderOnLineHH", item).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }

    function Delete(item) {
        var en = angular.copy(item);
        en.ItemForm = undefined;
        vm.promise = AjaxService.PlanDelete("VWMesMxWOrderHH", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.ID = vm.EditItem.ID;
        en.TS = vm.EditItem.TS;
        en.WorOrder = vm.EditItem.WorOrder;
        en.MaterialID = vm.EditItem.MaterialID;
        en.MaterialName = vm.EditItem.MaterialName;
        en.MaterialCode = vm.EditItem.MaterialCode;
        en.AssemblyLineName = vm.EditItem.AssemblyLineName;
        en.Quantity = vm.EditItem.Quantity;
        en.Completion = vm.EditItem.Completion;
        en.CustomerName = vm.EditItem.CustomerName;
        en.SendPlaceName = vm.EditItem.SendPlaceName;
        vm.promise = AjaxService.PlanUpdate("VWMesMxWOrderHH", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("VWMesMxWOrderHH", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("VWMesMxWOrderHH", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.WorOrder) {
            list.push({ name: "WorOrder", value: '%' + vm.Ser.WorOrder + '%' });
        }
        if (vm.Ser.MaterialName) {
            list.push({ name: "MaterialName", value: '%' + vm.Ser.MaterialName + '%' });
        }
        return list;
    }

}]);
