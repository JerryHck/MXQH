'use strict';

angular.module('AppSet')
.controller('UserPayCtrl', ['$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($scope, Dialog, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.OpenDtl = OpenDtl;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    //打开详细
    function OpenDtl(item) {
        Dialog.OpenDialog("BcMoLineUserPay", item).then(function (data) {

        }, function (data2) {

        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("vwBcMoUserPay", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("vwBcMoUserPay", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.aWorkDate) {
            list.push({ name: "WorkDate", value: vm.Ser.aWorkDate, tableAs:"a" });
        }
        if (vm.Ser.aHrUserNo) {
            list.push({ name: "HrUserNo", value: vm.Ser.aHrUserNo, tableAs:"a" });
        }
        if (vm.Ser.aHrUserName) {
            list.push({ name: "HrUserName", value: vm.Ser.aHrUserName, tableAs:"a" });
        }
        return list;
    }

}]);
