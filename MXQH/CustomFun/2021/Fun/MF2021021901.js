'use strict';

angular.module('AppSet')
.controller('MailLogCtrl', ['$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($scope, Dialog, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.Open = Open;

    Search()
    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Open(item) {
        Dialog.OpenDialog("HtmlShowDialog", item.MailBody).then(function (data) {
        }, function () { })
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("MXMailLog", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("MXMailLog", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.aMailSubject) {
            list.push({ name: "MailSubject", value: vm.Ser.aMailSubject, tableAs:"a" });
        }
        if (vm.Ser.aSentTime) {
            list.push({ name: "SentTime", value: vm.Ser.aSentTime, tableAs:"a", type:">=" });
        }
        if (vm.Ser.aSentTime) {
            list.push({ name: "SentTime", value: vm.Ser.aSentTime1, tableAs:"a", type:"<=" });
        }
        if (vm.Ser.aMailTo) {
            list.push({ name: "MailTo", value:  vm.Ser.aMailTo, tableAs: "a" });
        }
        return list;
    }

}]);
