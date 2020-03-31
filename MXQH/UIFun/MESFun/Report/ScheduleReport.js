'use strict';

angular.module('app')
.controller('ScheduleReportCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window', 'Form',
function ($rootScope, $scope, $http, AjaxService, toastr, $window, Form) {

    var vm = this;
    vm.Ser = { pageIndex: 1, pageSize:10 };

    vm.DataBind = DataBind;
    vm.Search = Search;
    //vm.ExportExcel = ExportExcel;
    var td = new Date();
    vm.Ser = { CompleteDate: td.toLocaleDateString() };

    function Search() {
        vm.Detail = {};
        vm.Ser.pageIndex = 1;
        vm.Ser.pageSize = 12;
        DataBind();
    }

    function DataBind() {
        var en = {};
        var enFrom = { WorkOrder: vm.Ser.WorkOrder ,MRPCategory:vm.Ser.MRPCategory};
        en.fromConn = 'U9con';
        en.fromProc = 'dbo.sp_mes_GetMO';
        en.fromJson = JSON.stringify(enFrom);
        en.toConn = 'MEScon';
        en.toProc = 'dbo.sp_GetScheduleReport';
        en.toJson = JSON.stringify({ WorkOrder: vm.Ser.WorkOrder, pageSize: vm.Ser.pageSize, pageIndex: vm.Ser.pageIndex, LineID: vm.Ser.LineID, SD: vm.Ser.SD, ED: vm.Ser.ED });
        vm.promise = AjaxService.BasicCustom("ExecProcCross", en).then(function (data) {
            vm.List = data.data;
            vm.Ser.total = data.data1[0].Count;
        });

        
    }


}]);
