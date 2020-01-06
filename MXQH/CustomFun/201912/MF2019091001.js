'use strict';

angular.module('app')
.controller('PLMCalBomCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.Ser.a_Code = "";
    vm.Ser.a_Name = "";
    vm.Ser.a_InBom = "";

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("PLMCalBom", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("PLMCalBom", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.a_Code) {
            list.push({ name: "Code", value: vm.Ser.a_Code, tableAs:"a" });
        }
        if (vm.Ser.a_Name) {
            list.push({ name: "Name", value: vm.Ser.a_Name, tableAs:"a" });
        }
        if (vm.Ser.a_InBom) {
            list.push({ name: "InBom", value: vm.Ser.a_InBom, tableAs:"a" });
        }
        return list;
    }

}]);
