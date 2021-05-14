'use strict';

angular.module('app')
.controller('MOPowerOnlineListCtrl', ['$rootScope', '$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, Dialog, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.Open = Open;

    Search();
    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Open(item) {
        Dialog.OpenDialog("MOPowerOnline", item).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("MESMOForRelease", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("MESMOForRelease", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.a_WorkOrder) {
            list.push({ name: "WorkOrder", value: vm.Ser.a_WorkOrder, tableAs:"a" });
        }
        if (vm.Ser.a_MaterialCode) {
            list.push({ name: "MaterialCode", value: vm.Ser.a_MaterialCode, tableAs:"a" });
        }
        return list;
    }

}]);
