'use strict';

angular.module('app')
.controller('WeightReportCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    var td = new Date();
    vm.Ser = { SD: td.toLocaleDateString(), ED: new Date(td.setDate(td.getDate() + 1)).toLocaleDateString() };

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.ExecPlanPage("MESSnCodeWeight", "Report", vm.Ser, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanExcel("MESSnCodeWeight", "Report", vm.Ser).then(function (data) {
            $window.location.href = data.File;
        });
    }

}]);
