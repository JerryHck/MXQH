'use strict';

angular.module('AppSet')
.controller('WorkOrderNoDoneCtrl', ['$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = { IsNow: true };

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.ExecPlanPage("MesMxWOrder", "noDone", vm.Ser, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.OrderData = data.List[0];
            vm.page.total = data.Count;
        });

    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanExcel("MesMxWOrder", "noDone", vm.Ser).then(function (data) {
            $window.location.href = data.File;
        });
    }

}]);
