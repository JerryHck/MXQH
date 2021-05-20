'use strict';

angular.module('app')
.controller('QCHHRepairSumCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
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

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.ExecPlanPage("MESQCBadHH", "getsum", vm.Ser, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanExcel("MESQCBadHH", "getsum", vm.Ser).then(function (data) {
            $window.location.href = data.File;
        });
    }

}]);
