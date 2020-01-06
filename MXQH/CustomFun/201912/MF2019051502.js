'use strict';

angular.module('app')
.controller('ADRCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    var td = new Date();
    vm.Ser = { SD: td.toLocaleDateString(), ED: new Date(td.setDate(td.getDate() + 1)).toLocaleDateString() };
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.ExecPlanPage("MesPlanMain", "DailyReport", vm.Ser, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });
    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanExcel("MesPlanMain", "DailyReport", vm.Ser).then(function (data) {
            $window.location.href = data.File;
        });
    }

}]);
