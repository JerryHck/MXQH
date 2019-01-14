'use strict';

angular.module('app')
.controller('TestCtrl', ['$rootScope', '$scope', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    vm.Text = "测试用的的功能！";
    PageChange();

    function Search() {
        vm.page.index = 1;
        PageChange()
    }

    function ExportExcel() {
        var list = [];
        vm.promise = AjaxService.GetPlanOwnExcel("PlmReplaceCode", list).then(function (data) {
            //console.log(data);
            $window.location.href = data.File;
        });
    }

    function PageChange() {
        var list = [];
        if (vm.Ser.Name) {
            list.push({ name: "name", value: vm.Ser.InternalCode });
        }
        //if (vm.Ser.DeleteBy) {
        //    list.push({ name: "DeleteBy", value: vm.Ser.DeleteBy });
        //}
        //if (vm.Ser.StartDate) {
        //    list.push({ name: "DeleteDate", value: vm.Ser.StartDate, type: ">=" });
        //}
        //if (vm.Ser.EndDate) {
        //    list.push({ name: "DeleteDate", value: vm.Ser.EndDate, type: "<=" });
        //}
        vm.promise = AjaxService.GetPlansPage("Dialog", list, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });
    }
}
]);