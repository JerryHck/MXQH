'use strict';

angular.module('AppSet')
.controller('U9MateInBomCtrl', ['$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($scope, Dialog, AjaxService, toastr, $window) {

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
        vm.promise = AjaxService.GetPlansPage("U9vwMateInBom", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("U9vwMateInBom", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.aCode) {
            list.push({ name: "Code", value: vm.Ser.aCode, tableAs:"a" });
        }
        if (vm.Ser.aName) {
            list.push({ name: "Name", value: vm.Ser.aName, tableAs:"a" });
        }
        return list;
    }

}]);