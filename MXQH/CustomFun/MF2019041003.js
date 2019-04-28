'use strict';

angular.module('app')
.controller('MESWPOPackageInCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
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
        var list = [];
        if (vm.Ser.a_PackageSN) {
            list.push({ name: "PackageSN", value: vm.Ser.a_PackageSN });
        }
        if (vm.Ser.a_AuctusWPO) {
            list.push({ name: "AuctusWPO", value: vm.Ser.a_AuctusWPO });
        }
        vm.promise = AjaxService.GetPlansPage("MESWPOPackageIn", list, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        var list = [];
        if (vm.Ser.a_PackageSN) {
            list.push({ name: "PackageSN", value: vm.Ser.a_PackageSN });
        }
        if (vm.Ser.a_AuctusWPO) {
            list.push({ name: "AuctusWPO", value: vm.Ser.a_AuctusWPO });
        }
        vm.promise = AjaxService.GetPlanOwnExcel("MESWPOPackageIn", list).then(function (data) {
            $window.location.href = data.File;
        });
    }

}]);
