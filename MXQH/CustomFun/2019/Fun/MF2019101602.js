'use strict';

angular.module('app')
.controller('MesDailyReportCtrl', ['$rootScope', '$scope', 'MyPop', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, MyPop, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.ReCal = ReCal;

    function ReCal(item) {
        MyPop.ngConfirm({text:"重算只能在该工单没有相关生产作业的情况下进行，否则可能导致数据错误，确定要重算吗"}).then(function () {
            vm.promise = AjaxService.ExecPlan("MESPlanMain", "cal", { WorkOrder: item.WorkOrder }).then(function (data) {
                toastr.success("重算完成")
                PageChange();
            });
        }, function () { })
    }

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.ExecPlanPage("MESPlanMain", "daily", vm.Ser, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanExcel("MESPlanMain", "daily", vm.Ser).then(function (data) {
            $window.location.href = data.File;
        });
    }

}]);
