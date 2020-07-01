'use strict';

angular.module('AppSet')
.controller('TestCtrl', ['$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($scope, $http, AjaxService, toastr, $window) {

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
        vm.promise = AjaxService.GetPlansPage("OracleTest", GetContition(), vm.page.index, vm.page.size).then(function (data) {
             console.log(data);
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("OracleTest", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.aWORKCODE) {
            list.push({ name: "WORKCODE", value: vm.Ser.aWORKCODE, tableAs:"a" });
        }
        if (vm.Ser.aLASTNAME) {
            list.push({ name: "LASTNAME", value: vm.Ser.aLASTNAME, tableAs:"a" });
        }
        return list;
    }

}]);