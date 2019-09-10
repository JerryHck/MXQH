'use strict';

angular.module('app')
.controller('TestCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.Ser.a_FunNo = "";
    vm.Ser.a_SysNo = "MES";

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("Function", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("Function", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.a_FunNo) {
            list.push({ name: "FunNo", value: vm.Ser.a_FunNo, tableAs:"a" });
        }
        if (vm.Ser.a_SysNo) {
            list.push({ name: "SysNo", value: vm.Ser.a_SysNo, tableAs:"a" });
        }
        return list;
    }

}]);
