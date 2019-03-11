'use strict';

angular.module('app')
.controller('AuctusWPOFunCtrl', ['$rootScope', '$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
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
        if (vm.Ser.AucWPO) {
            list.push({ name: "AucWPO", value: vm.Ser.AucWPO });
        }
        if (vm.Ser.MO) {
            list.push({ name: "MO", value: vm.Ser.MO });
        }
        vm.promise = AjaxService.GetPlansPage("WPOFun", list, vm.page.index, vm.page.size).then(function (data) {
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
        AjaxService.PlanDelete("WPOFun", item).then(function (data) {
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
        Dialog.open("WPOFunDialog", vm.NewItem).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }

}]);
