'use strict';

angular.module('app')
.controller('WPOBSNReviewCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    function Search() {
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.ExecPlan("MESWPOPIEGateTrans", "bsnreview", vm.Ser).then(function (data) {
            vm.PieList = data.data;
            vm.SmtList = data.data1;
        });

    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanExcel("MESWPOPIEGateTrans", "bsnreview", vm.Ser).then(function (data) {
            $window.location.href = data.File;
        });
    }

}]);
