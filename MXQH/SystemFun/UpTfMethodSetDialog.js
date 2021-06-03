'use strict';

angular.module('AppSet')
.controller('UpTfMethodSetDialogCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
function ($scope, ItemData, $uibModalInstance, AjaxService, toastr, $window) {

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
    vm.Cancel = Cancel;
    vm.ChangeName = ChangeName;

    Search();
    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Insert() {
        vm.NewItem = { UserNo: ItemData.UserNo, Rate: 0, Sleep: 0 };
        vm.IsInsert = true;
    }

    function ChangeName() {
        vm.NewItem.Text = vm.selectItem.ClDesc;
    }

    function SaveInsert() {
        vm.promise = AjaxService.PlanInsert("UpTfMethodSet", vm.NewItem).then(function (data) {
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
        vm.promise = AjaxService.PlanDelete("UpTfMethodSet", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.Name = vm.EditItem.Name;
        en.Rate = vm.EditItem.Rate;
        en.Sleep = vm.EditItem.Sleep;
        en.Text = vm.EditItem.Text;
        vm.promise = AjaxService.PlanUpdate("UpTfMethodSet", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("UpTfMethodSet", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("UpTfMethodSet", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }

    function GetContition() {
        var list = [];
        list.push({ name: "UserNo", value: ItemData.UserNo });
        if (vm.Ser.aName) {
            list.push({ name: "Name", value: vm.Ser.aName, tableAs: "a" });
        }
        return list;
    }

    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);
