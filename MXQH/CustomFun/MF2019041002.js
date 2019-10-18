'use strict';

angular.module('app')
.controller('MESWPOFunInCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
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
        if (vm.Ser.a_AucWPO) {
            list.push({ name: "AucWPO", value: vm.Ser.a_AucWPO });
        }
        if (vm.Ser.a_MO) {
            list.push({ name: "MO", value: vm.Ser.a_MO });
        }
        vm.promise = AjaxService.GetPlansPage("WPOFunIn", list, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        var list = [];
        if (vm.Ser.a_AucWPO) {
            list.push({ name: "AucWPO", value: vm.Ser.a_AucWPO });
        }
        if (vm.Ser.a_MO) {
            list.push({ name: "MO", value: vm.Ser.a_MO });
        }
        vm.promise = AjaxService.GetPlanOwnExcel("WPOFunIn", list).then(function (data) {
            $window.location.href = data.File;
        });
    }

}]);
