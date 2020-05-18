'use strict';

angular.module('app')
.controller('ScheduleReportCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window', 'Form',
function ($rootScope, $scope, $http, AjaxService, toastr, $window, Form) {

    var vm = this;
    vm.Ser = { pageIndex: 1, pageSize:10 };

    vm.DataBind = DataBind;
    vm.Search = Search;
    //vm.ExportExcel = ExportExcel
    vm.Export = Export;
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

    function Export() {
        var enx = {};        
        var list = [];
        var en = {};
        var en2 = {};
        en.Conn = 'U9con';
        en.Proc = 'dbo.sp_mes_GetMO';
        en.Json = JSON.stringify({ WorkOrder: vm.Ser.WorkOrder, MRPCategory: vm.Ser.MRPCategory });
        en.IsTrans = false;

        en2.shortName = 'Schedule';
        en2.planName = 'MesPlanDetail';
        en2.Json = JSON.stringify({ WorkOrder: vm.Ser.WorkOrder, pageSize: vm.Ser.pageSize, pageIndex: vm.Ser.pageIndex, LineID: vm.Ser.LineID, SD: vm.Ser.SD, ED: vm.Ser.ED });
        en2.IsTrans = false;
        list.push(en);
        list.push(en2);
        enx.strJson = JSON.stringify(list);
        console.log(enx);
        vm.promise = AjaxService.BasicCustom("ExecProcMultiExcel", enx).then(function (data) {
            console.log(data);
        });
    }


}]);
