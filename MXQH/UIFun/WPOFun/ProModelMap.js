'use strict';

angular.module('app')
.controller('ProModelMapCtrl', ['$rootScope', '$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, Dialog, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
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
        if (vm.Ser.AuModelCode) {
            list.push({ name: "AuModelCode", value: vm.Ser.AuModelCode });
        }
        if (vm.Ser.ProItemCode) {
            list.push({ name: "ProItemCode", value: vm.Ser.ProItemCode });
        }
        if (vm.Ser.AuItemCode) {
            list.push({ name: "AuItemCode", value: vm.Ser.AuItemCode });
        }
        vm.promise = AjaxService.GetPlansPage("ProModelMap", list, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }

    function Add() {
        Open({});
    }

    function Edit(item) {
        Open(item);
    }

    function Delete(item) {
        AjaxService.PlanDelete("ProModelMap", item).then(function (data) {
            toastr.success('删除成功');
            PageChange();
        });
    }

    function ExportExcel() {
        var list = [];
        if (vm.Ser.AuModelCode) {
            list.push({ name: "AuModelCode", value: vm.Ser.AuModelCode });
        }
        if (vm.Ser.ProItemCode) {
            list.push({ name: "ProItemCode", value: vm.Ser.ProItemCode });
        }
        if (vm.Ser.AuItemCode) {
            list.push({ name: "AuItemCode", value: vm.Ser.AuItemCode });
        }
        vm.promise = AjaxService.GetPlanOwnExcel("ProModelMap", list).then(function (data) {
            $window.location.href = data.File;
        });
    }

    function Open(item) {
        vm.NewItem = {
            ItemData: function () {
                return item;
            }
        };
        Dialog.open("ProModelMapDialog", vm.NewItem).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }

}]);
