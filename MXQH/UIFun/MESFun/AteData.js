'use strict';
angular.module('app')
.controller('AteDataCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.NewBind = { Action: "I", CreateBy: $rootScope.User.UserNo};
    vm.MesList = [];
    vm.Focus = 0;
    vm.page = { index: 1, size: 8 };
    vm.Ser = {};
    vm.ConfigTable = { Table: "MES_ATETestSearch", Column: "Table" };

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    PageChange();

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.Ser.Start = vm.page.index <= 1 ? 1 : (vm.page.index - 1) * vm.page.size + 1;
        vm.Ser.End = vm.Ser.Start + vm.page.size;
        vm.Ser.IsExecl = false;
        vm.Ser.StartDate = vm.Ser.StartDate == '' ? undefined : vm.Ser.StartDate;
        vm.Ser.EndDate = vm.Ser.EndDate == '' ? undefined : vm.Ser.EndDate;

        vm.promise = AjaxService.ExecPlan("MESAteData", "AteBrOrder", vm.Ser).then(function (data) {
            vm.page.total = data.data[0].TotalCount;
            vm.ColumnList = data.data1;
            vm.List = data.data2;
        });
    }

    function ExportExcel() {
        vm.Ser.IsExecl = true;
        vm.Ser.StartDate = vm.Ser.StartDate == '' ? undefined : vm.Ser.StartDate;
        vm.Ser.EndDate = vm.Ser.EndDate == '' ? undefined : vm.Ser.EndDate;
        vm.promise = AjaxService.GetPlanExcel("MESAteData", "AteBrOrder", vm.Ser).then(function (data) {
            //console.log(data);
            $window.location.href = data.File;
        });
    }
}
]);