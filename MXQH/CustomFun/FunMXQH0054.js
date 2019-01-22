'use strict';

angular.module('app')
.controller('TestCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
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
        if (vm.Ser.a_InternalCode) {
            list.push({ name: "InternalCode", value: vm.Ser.a_InternalCode });
        }
        vm.promise = AjaxService.GetPlansPage("MESDeleteCode", list, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        var list = [];
        if (vm.Ser.a_InternalCode) {
            list.push({ name: "InternalCode", value: vm.Ser.a_InternalCode });
        }
        vm.promise = AjaxService.GetPlanOwnExcel("MESDeleteCode", list).then(function (data) {
            $window.location.href = data.File;
        });
    }

}]);
