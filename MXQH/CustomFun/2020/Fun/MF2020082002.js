'use strict';

angular.module('AppSet')
.controller('APSCtrl', ['$scope', 'AjaxService', 'toastr', '$window', 'FileUrl',
function ($scope, AjaxService, toastr, $window, FileUrl) {

    var vm = this;
    //vm.page = { index: 1, size: 12 };
    //vm.Ser = {};

    //vm.PageChange = PageChange;
    //vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    //function Search() {
    //    vm.page.index = 1;
    //    PageChange();
    //}

    //function PageChange() {
    //    vm.promise = AjaxService.GetPlansPage("MesMxWOrder", GetContition(), vm.page.index, vm.page.size).then(function (data) {
    //        vm.List = data.List;
    //        vm.page.total = data.Count;
    //    });

    //}
    function ExportExcel() {
        vm.promise = AjaxService.CallDll('Mes4U9', 'Mes4U9.MOSchedule', 'GetMOSchedule', { con: "U9con" }).then(function (data) {
            console.log(data);
            $window.location.href = data;
        })
        //vm.promise = AjaxService.GetPlanOwnExcel("MesMxWOrder", GetContition()).then(function (data) {
        //    $window.location.href = data.File;
        //});
    }
    //function GetContition() {
    //    var list = [];
    //    if (vm.Ser.aCLName) {
    //        list.push({ name: "CLName", value: vm.Ser.aCLName, tableAs:"a" });
    //    }
    //    return list;
    //}

}]);
