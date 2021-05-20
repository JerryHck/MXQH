'use strict';

angular.module('app')
.controller('WPOPackDtlSerCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("WPOPackDtlSer", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("WPOPackDtlSer", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.a_BSN) {
            list.push({ name: "BSN", value: vm.Ser.a_BSN, tableAs:"a" });
        }
        if (vm.Ser.b_MO) {
            list.push({ name: "MO", value: vm.Ser.b_MO, tableAs:"b" });
        }
        if (vm.Ser.b_PackageSN) {
            list.push({ name: "PackageSN", value: vm.Ser.b_PackageSN, tableAs:"b" });
        }
        if (vm.Ser.b_AuctusWPO) {
            list.push({ name: "AuctusWPO", value: vm.Ser.b_AuctusWPO, tableAs:"b" });
        }
        return list;
    }

}]);
