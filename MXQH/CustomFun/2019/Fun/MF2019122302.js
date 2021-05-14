'use strict';

angular.module('app')
.controller('AucInCodeListCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.page1 = { index: 1, size: 12 };
    vm.Ser1 = {};

    vm.PageChangeBSN = PageChangeBSN;
    vm.SearchBSN = SearchBSN;
    vm.ExportExcelBSN = ExportExcelBSN;

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.ExportBSN = ExportBSN;
    vm.changeTap = changeTap;

    function changeTap(index) {
        if (index = 0) {
            vm.Ser1.MainId = undefined;
        }
        else if (index = 1 && !vm.Ser1.MainId) {
            vm.tabIndex = 0;
            toastr.error("请先选择查看项次");
        }
    }

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("WPOInCodeMain", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("WPOInCodeMain", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }

    function ExportBSN(id) {
        var en = [{ name: "MainId", value: id }];
        vm.Ser1.MainId = id;
        vm.tabIndex = 1;
        SearchBSN();
        //vm.promise = AjaxService.GetPlanOwnExcel("WPOInCodeDtl", en).then(function (data) {
        //    $window.location.href = data.File;
        //});
    }

    function GetContition() {
        var list = [];
        if (vm.Ser.a_ReleaseDate) {
            list.push({ name: "ReleaseDate", value: vm.Ser.a_ReleaseDate, tableAs:"a" });
        }
        if (vm.Ser.a_ItemCode) {
            list.push({ name: "ItemCode", value: vm.Ser.a_ItemCode, tableAs:"a" });
        }
        if (vm.Ser.a_BatchNo) {
            list.push({ name: "BatchNo", value: vm.Ser.a_BatchNo, tableAs:"a" });
        }
        if (vm.Ser.a_RangNo) {
            list.push({ name: "RangNo", value: "%" + vm.Ser.a_RangNo + "%", tableAs: "a" });
        }
        return list;
    }

    function SearchBSN() {
        vm.page1.index = 1;
        PageChangeBSN();
    }

    function PageChangeBSN() {
        vm.promise = AjaxService.GetPlansPage("WPOInCodeDtl", GetContition1(), vm.page1.index, vm.page1.size).then(function (data) {
            vm.ListBSN = data.List;
            vm.page1.total = data.Count;
        });

    }
    function ExportExcelBSN() {
        vm.promise = AjaxService.GetPlanOwnExcel("WPOInCodeDtl", GetContition1()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition1() {
        var list = [];
        if (vm.Ser1.MainId) {
            list.push({ name: "MainId", value: vm.Ser1.MainId, tableAs: "a" });
        }
        if (vm.Ser1.a_InternalCode) {
            list.push({ name: "InternalCode", value: vm.Ser1.a_InternalCode, tableAs: "a" });
        }
        if (vm.Ser1.b_ItemCode) {
            list.push({ name: "ItemCode", value: vm.Ser1.b_ItemCode, tableAs: "b" });
        }
        if (vm.Ser1.b_BatchNo) {
            list.push({ name: "BatchNo", value: vm.Ser1.b_BatchNo, tableAs: "b" });
        }
        return list;
    }



}]);
