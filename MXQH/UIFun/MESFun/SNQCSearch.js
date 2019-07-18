'use strict';

angular.module('app')
.controller('SNQCSearchCtrl', ['$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    function Search() {
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.ExecPlan("MESSNCode", "review", vm.Ser).then(function (data) {
            vm.Data = data;
        });

    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanExcel("MESWPOPIEGateTrans", "bsnreview", vm.Ser).then(function (data) {
            $window.location.href = data.File;
        });
    }

}]);
