'use strict';

angular.module('app')
.controller('QCRepairSumCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.Ser.WorkOrder = "";
    vm.Ser.MateCode = "";
    //vm.Ser.Operator = $rootScope.User.UserNo;

    var curDate = new Date();
    //var preDate = new Date(curDate.getTime() - 24*60*60*1000); //前一天
    //var nextDate = new Date(curDate.getTime() + 24*60*60*1000); //后一天

    vm.Ser.StartTime = new Date((curDate).Format("yyyy-MM-dd")).Format("yyyy/MM/dd hh:mm:ss");
    vm.Ser.EndTime = curDate.Format("yyyy/MM/dd hh:mm:ss");

    console.log(vm.Ser)

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.Ser.IsExcel = "N";
        vm.Ser.Start = (vm.page.index - 1) * vm.page.size + 1;
        vm.Ser.End = vm.page.index * vm.page.size;
        vm.promise = AjaxService.ExecPlan("MESQCBad", "getSum", vm.Ser).then(function (data) {
            vm.List = data.data;
            vm.page.total = data.data1[0].Count;
            vm.Columns = data.data2;
        });

    }

    function ExportExcel() {
        vm.Ser.IsExcel = "Y";
        vm.promise = AjaxService.GetPlanExcel("MESQCBad", "getSum", vm.Ser).then(function (data) {
            $window.location.href = data.File;
        });
    }

}]);
