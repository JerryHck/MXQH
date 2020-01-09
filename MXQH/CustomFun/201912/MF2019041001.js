'use strict';

angular.module('app')
.controller('MESWPOMateCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
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
        vm.promise = AjaxService.GetPlansPage("AucWPOMate_In", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("AucWPOMate_In", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }

    function GetContition() {
        var list = [];
        if (vm.Ser.a_AucMateCode) {
            list.push({ name: "AucMateCode", value: vm.Ser.a_AucMateCode });
        }
        if (vm.Ser.a_MateCode) {
            list.push({ name: "MateCode", value: vm.Ser.a_MateCode });
        }
        if (vm.Ser.a_AucModelName) {
            list.push({ name: "AucModelName", value: vm.Ser.a_AucModelName });
        }
        if (vm.Ser.AuVenSN) {
            list.push({ name: "AuVenSN", value: vm.Ser.AuVenSN });
        }
        return list;
    }

}]);
