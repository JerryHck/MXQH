'use strict';

angular.module('AppSet')
.controller('IssueDocCtrl', ['$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($scope, Dialog, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.Open = Open;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Open(item) {
        Dialog.OpenDialog("U9IssueCheckDialog", item).then(function (data) {
            if (data) {
                Search();
            }
        }, function () { })
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("U9MOIssueDocCheck", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("U9MOIssueDocCheck", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.aCheckState) {
            list.push({ name: "CheckState", value: vm.Ser.aCheckState, tableAs:"a" });
        }
        if (vm.Ser.bDocNo) {
            list.push({ name: "DocNo", value: vm.Ser.bDocNo, tableAs:"b" });
        }
        if (vm.Ser.WorkOrder) {
            list.push({ name: "WorkOrder", value: vm.Ser.WorkOrder, tableAs: "a" });
        }
        if (vm.Ser.MateCode) {
            list.push({ name: "MateCode", value: vm.Ser.MateCode, tableAs: "a" });
        }
        return list;
    }

}]);
