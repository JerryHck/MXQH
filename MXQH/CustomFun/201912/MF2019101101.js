'use strict';

angular.module('app')
.controller('MoLinelistCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.Ser.a_ArrangeDate = "";
    vm.Ser.a_WorkOrder = "";

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    vm.DateOption = {
        format: 'Y-m-d',
        formatDate: 'Y-m-d',
        timepicker: false
    };

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("MESMoLineArrange", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("MESMoLineArrange", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.a_ArrangeDate) {
            list.push({ name: "ArrangeDate", value: vm.Ser.a_ArrangeDate, tableAs:"a" });
        }
        if (vm.Ser.a_WorkOrder) {
            list.push({ name: "WorkOrder", value: vm.Ser.a_WorkOrder, tableAs:"a" });
        }
        return list;
    }

}]);
