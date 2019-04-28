'use strict';

angular.module('app')
.controller('VerderCtrl', ['$rootScope', '$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, Dialog, AjaxService, toastr, $window) {

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
        if (vm.Ser.VenderSN) {
            list.push({ name: "VenderSN", value: vm.Ser.VenderSN });
        }
        if (vm.Ser.ShortName) {
            list.push({ name: "ShortName", value: vm.Ser.ShortName });
        }
        if (vm.Ser.VenderName) {
            list.push({ name: "VenderName", value: vm.Ser.VenderName });
        }
        vm.promise = AjaxService.GetPlansPage("Vender", list, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });
    }
    function ExportExcel() {
        var list = [];
        if (vm.Ser.VenderSN) {
            list.push({ name: "VenderSN", value: vm.Ser.VenderSN });
        }
        if (vm.Ser.ShortName) {
            list.push({ name: "ShortName", value: vm.Ser.ShortName });
        }
        if (vm.Ser.VenderName) {
            list.push({ name: "VenderName", value: vm.Ser.VenderName });
        }
        vm.promise = AjaxService.GetPlanOwnExcel("Vender", list).then(function (data) {
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
        AjaxService.PlanDelete("Vender", item).then(function (data) {
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
        Dialog.open("VenderDialog", vm.NewItem).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }

}]);
