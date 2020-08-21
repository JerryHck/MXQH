'use strict';

angular.module('app')
.controller('UiSelectCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window', 'Dialog',
function ($rootScope, $scope, $http, AjaxService, toastr, $window, Dialog) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.Add = Add;
    vm.Edit = Edit;
    vm.Delete = Delete;

    Search();
    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        var list = [];
        if (vm.Ser.SelectName) {
            list.push({ name: "SelectName", value: vm.Ser.SelectName });
        }
        if (vm.Ser.EntityName) {
            list.push({ name: "EntityName", value: vm.Ser.EntityName });
        }
        if (vm.Ser.ConnectName) {
            list.push({ name: "ConnectName", value: vm.Ser.ConnectName });
        }
        vm.promise = AjaxService.GetPlansPage("SysUISelect", list, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });
    }
    function ExportExcel() {
        var list = [];
        if (vm.Ser.SelectName) {
            list.push({ name: "SelectName", value: vm.Ser.SelectName });
        }
        vm.promise = AjaxService.GetPlanOwnExcel("SysUISelect", list).then(function (data) {
            $window.location.href = data.File;
        });
    }

    function Add() {
        Open({});
    }

    function Edit(item) {
        Open(item);
    }

    function Delete(item) {
        var en = {};
        en.SelectName = item.SelectName;
        AjaxService.ExecPlan("SysUISelect", "delete", en).then(function (data) {
            toastr.success('删除成功');
            PageChange();
        });
    }

    function Open(item) {
        vm.NewItem = {
            ItemData: function () {
                return item;
            }
        };
        Dialog.open("SysUISelectDialog", vm.NewItem).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }

}]);
