'use strict';

angular.module('app')
.controller('CompleteReportCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window','Form',
function ($rootScope, $scope, $http, AjaxService, toastr, $window,Form) {

    var vm = this;
    vm.Ser = { pageIndex: 1, pageSize: 12 };
    vm.Detail = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    var td = new Date();
    vm.Ser = { CompleteDate: td.toLocaleDateString() };

    function Search() {
        vm.Detail = {};
        vm.Ser.pageIndex = 1;
        vm.Ser.pageSize = 12;
        PageChange();
    }

    function PageChange() {        
        vm.promise = AjaxService.ExecPlan("CompleteRpt", "Report", vm.Ser).then(function (data) {
            console.log(data);
            if (data.data.length>0) {
                vm.Detail = data.data[0];
                if (data.data1) {
                    vm.List = data.data1;
                    vm.Ser.total = data.data2[0].Count;
                }
            } else {
                toastr.error('没有工单'+vm.Ser.WorkOrder+'的完工信息');
            }
            
        });

    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanExcel("CompleteRpt", "Report", vm.Ser).then(function (data) {
            $window.location.href = data.File;
        });
    }

}]);
