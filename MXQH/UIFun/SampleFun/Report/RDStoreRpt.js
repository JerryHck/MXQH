'use strict';

angular.module('AppSet')
.controller('RDStoreCtrl', ['$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { pageIndex: 1, pageSize: 10 };

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    function Search() {
        vm.page.pageIndex = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.ExecPlan("RDReceivement", "Report", vm.page).then(function (data) {
            vm.List = data.data;
            vm.page.total = data.data1[0].Count;
        });
    }

    function ExportExcel() {
        vm.page.pageSize = 1000000;
        vm.promise = AjaxService.GetPlanExcel("RDReceivement", "Report", vm.page).then(function (data) {
            vm.page.pageSize = 10;
            $window.location.href = data.File;
        });
    }

}]);
