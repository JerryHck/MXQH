'use strict';

angular.module('app')
.controller('ctrl-PC', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
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
    vm.InserLiaoPin = InserLiaoPin;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Insert() {
        vm.NewItem = {};
        vm.IsInsert = true;
    }

    function SaveInsert() {
        vm.promise = AjaxService.PlanInsert("ProductNumber", vm.NewItem).then(function (data) {
            PageChange();
            toastr.success('新增成功');
            vm.IsInsert = false;
        });
    }

    function InserLiaoPin() {
        var en = {};
        en.PID = vm.NewItem.PID;
        en.CID = vm.NewItem.CID;
        vm.promise = AjaxService.ExecPlan("ProductNumber", 'insert', en).then(function (data) {
            if (data.data[0].MsgType == "Success") {
                SaveInsert();
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
        vm.promise = AjaxService.PlanDelete("ProductNumber", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.Id = vm.EditItem.Id;
        en.PID = vm.EditItem.PID;
        en.CID = vm.EditItem.CID;

        vm.promise = AjaxService.ExecPlan("ProductNumber", 'alter', en).then(function (data) {
            if (data.data[0].MsgType == "Success") {
                vm.promise = AjaxService.PlanUpdate("ProductNumber", en).then(function (data) {
                    PageChange();
                    toastr.success('更新成功');
                });
            }
            else {
                toastr.error(data.data[0].Msg);
            }

        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("ProductNumber", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("ProductNumber", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.a_PID) {
            list.push({ name: "PID", value: '%' + vm.Ser.a_PID + '%' });
        }
        if (vm.Ser.a_CID) {
            list.push({ name: "CID", value: '%' + vm.Ser.a_CID + '%' });
        }
     
        return list;
    }

}]);
