'use strict';

angular.module('app')
.controller('WorkInputReportCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
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
        if (!vm.Ser.WorkOrder) {
            toastr.error('工单号不能为空！');
            return;
        }
        vm.promise = AjaxService.ExecPlanPage("MesPlanDetail", "WorkReport", vm.Ser, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanExcel("MesPlanDetail", "WorkReport", vm.Ser).then(function (data) {
            $window.location.href = data.File;
        });
    }

}]);
