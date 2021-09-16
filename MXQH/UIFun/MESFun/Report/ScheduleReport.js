'use strict';

angular.module('app')
.controller('ScheduleReportCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window', 'Form',
function ($rootScope, $scope, $http, AjaxService, toastr, $window, Form) {

    var vm = this;
    vm.Ser = { pageIndex: 1, pageSize:12 };

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
        en.fromConn = 'MEScon';
        en.fromProc = 'dbo.sp_GetScheduleReport';
        en.fromJson = JSON.stringify({ WorkOrder: vm.Ser.WorkOrder, pageSize: vm.Ser.pageSize, pageIndex: vm.Ser.pageIndex, LineID: vm.Ser.LineID, SD: vm.Ser.SD, ED: vm.Ser.ED });

        en.toConn = 'U9con';
        en.toProc = 'dbo.sp_mes_GetPlanData';
        en.toJson = JSON.stringify({ WorkOrder: vm.Ser.WorkOrder, MRPCategory: vm.Ser.MRPCategory });

        //en.toConn = 'MEScon';
        //en.toProc = 'dbo.sp_GetScheduleReport';
        //en.toJson = JSON.stringify({ WorkOrder: vm.Ser.WorkOrder, pageSize: vm.Ser.pageSize, pageIndex: vm.Ser.pageIndex, LineID: vm.Ser.LineID, SD: vm.Ser.SD, ED: vm.Ser.ED });
        vm.promise = AjaxService.BasicCustom("ExecProcCross", en).then(function (data) {
            vm.List = data.data;
            console.log(data);
            vm.Ser.total = data.data1[0].Count;
        });
        
    }

    function Export() {
        var enx = {};        
        var list = [];
        var en = {};
        var en2 = {};

        en.shortName = 'Schedule';
        en.planName = 'MesPlanDetail';
        en.Json = JSON.stringify({ WorkOrder: vm.Ser.WorkOrder, pageSize: 99999999, pageIndex: vm.Ser.pageIndex, LineID: vm.Ser.LineID, SD: vm.Ser.SD, ED: vm.Ser.ED });
        en.IsTrans = false;

        //en2.Conn = 'U9con';
        //en2.Proc = 'dbo.sp_mes_GetPlanData';
        //en2.Json = JSON.stringify({ WorkOrder: vm.Ser.WorkOrder, MRPCategory: vm.Ser.MRPCategory });
        //en2.IsTrans = false;
        en2.shortName = 'Schedule';
        en2.planName = 'U9MO';
        en2.Json = JSON.stringify({ WorkOrder: vm.Ser.WorkOrder, MRPCategory: vm.Ser.MRPCategory });
        en2.IsTrans = false;
        
        //en2.shortName = 'Schedule';
        //en2.planName = 'MesPlanDetail';
        //en2.Json = JSON.stringify({ WorkOrder: vm.Ser.WorkOrder, pageSize: vm.Ser.pageSize, pageIndex: vm.Ser.pageIndex, LineID: vm.Ser.LineID, SD: vm.Ser.SD, ED: vm.Ser.ED });
        //en2.IsTrans = false;

        list.push(en);
        list.push(en2);
        enx.strJson = JSON.stringify(list);
        vm.promise = AjaxService.BasicCustom("ExecProcMultiExcel", enx).then(function (data) {            
            $window.location.href = data.File;
        });
    }


}]);
