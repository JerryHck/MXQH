'use strict';

angular.module('app')
.controller('CompleteReportCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window','Form',
function ($rootScope, $scope, $http, AjaxService, toastr, $window,Form) {

    var vm = this;
    vm.Ser = { pageIndex: 1, pageSize: 5 };
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

    function GetCompleteRptList() {
        AjaxService.GetPlan("U9MO", { name: "DocNo", value: vm.Ser.WorkOrder }).then(function (data) {
            console.log(data);
            vm.CompleteList = data.CompleteRpt;
            vm.StartInfoList = data.StartInfo;
        });
    }

    function PageChange() {
        // vm.promise=AjaxService.ExecPlan("CompleteRpt")
        vm.promise = AjaxService.ExecPlan("U9MoCompleteRpt", "GetQty", { WorkOrder: vm.Ser.WorkOrder }).then(function (data) {
            vm.ActualRcvQty = data.data[0].ActualRcvQty;
            vm.TotalStartQty = data.data[0].TotalStartQty;
        })
        vm.promise = AjaxService.ExecPlan("CompleteRpt", "Report", vm.Ser).then(function (data) {
            if (data.data.length>0) {
                vm.Detail = data.data[0];
                if (data.data1) {
                    console.log(data.data1);
                    vm.List = data.data1;
                    vm.Ser.total = data.data2[0].Count;
                }
            } else {
                toastr.error('没有工单'+vm.Ser.WorkOrder+'的完工信息');
            }            
        });

        GetCompleteRptList();

    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanExcel("CompleteRpt", "Report", vm.Ser).then(function (data) {
            $window.location.href = data.File;
        });
    }

}]);
