'use strict';

angular.module('AppSet')
.controller('TestCtrl', ['$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    function Search() {
        var en = {};
        en.strJson = "[{\"Conn\":\"U9con\",\"Proc\":\"dbo.sp_mes_GetMO\",\"Json\":\"{}\"},{\"shortName\":\"Schedule\",\"planName\":\"MesPlanDetail\",\"Conn\":\"MEScon\",\"Proc\":\"dbo.sp_GetScheduleReport\",\"Json\":\"{\\\"pageSize\\\":12,\\\"pageIndex\\\":1,\\\"SD\\\":\\\"\\\",\\\"ED\\\":\\\"\\\"}\"}]";

        AjaxService.BasicCustom("ExecProcMultiExcel", en)


    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("FunList", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("FunList", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.aFunNo) {
            list.push({ name: "FunNo", value: vm.Ser.aFunNo, tableAs:"a" });
        }
        return list;
    }

}]);
