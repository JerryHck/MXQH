'use strict';

angular.module('app')
.controller('GFTest', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
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
        vm.promise = AjaxService.GetPlansPage("GFTest", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("GFTest", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.a_Sn) {
            list.push({ name: "Sn", value: vm.Ser.a_Sn, tableAs:"a" });
        }
        if (vm.Ser.a_Time) {
            list.push({ name: "Time", value: vm.Ser.a_Time, tableAs:"a", type:">=" });
        }
        if (vm.Ser.a_Time1) {
            list.push({ name: "Time", value: vm.Ser.a_Time1, tableAs:"a", type:"<=" });
        }
        return list;
    }

}]);
