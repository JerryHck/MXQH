'use strict';

angular.module('app')
.controller('QcAteCheckctrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
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
        vm.promise = AjaxService.GetPlansPage("QcAteCheck", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("QcAteCheck", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.a_BSN) {
            list.push({ name: "BSN", value: vm.Ser.a_BSN, tableAs:"a" });
        }
        if (vm.Ser.a_MODEL_NAME) {
            list.push({ name: "MODEL_NAME", value: vm.Ser.a_MODEL_NAME, tableAs:"a" });
        }
        if (vm.Ser.a_TS) {
            list.push({ name: "TS", value: vm.Ser.a_TS, tableAs:"a", type:">=" });
        }
        if (vm.Ser.a_TS1) {
            list.push({ name: "TS", value: vm.Ser.a_TS1, tableAs:"a", type:"<=" });
        }
        return list;
    }

}]);
