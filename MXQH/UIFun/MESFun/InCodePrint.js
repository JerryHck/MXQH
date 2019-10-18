'use strict';

angular.module('app')
.controller('InCodePrintCtrl', ['$rootScope', '$scope', 'FileUrl', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, FileUrl, AjaxService, toastr, $window) {

    var vm = this;
    vm.DeleteItem = { CreateBy: $rootScope.User.UserNo };
    vm.MesList = [];
    vm.Focus = 0;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.IsAuto = true;

    vm.KeyDonwInCode = KeyDonwInCode;
    vm.PrintCode = PrintCode;
    vm.SelectTab = SelectTab;
    vm.DownExe = DownExe;


    AjaxService.GetLocalPrinters().then(function (data) {
        vm.PrintList = data;
        console.log(data);
    }, function (err) {
        console.log(err);
    });

    //内部码验证
    function KeyDonwInCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.DeleteItem.InternalCode) {
            var en = {};
            en.name = "InternalCode";
            en.value = vm.DeleteItem.InternalCode;
             if (vm.IsAuto) {
                 PrintCode();
             }
             vm.DeleteItem.InternalCode = undefined;
        }
    }

    function SelectTab(index) {
        vm.Focus = index;
    }

    function PrintCode() {
        var postData = {}, list = [];

        list.push(vm.DeleteItem.InternalCode);

        console.log(JSON.stringify(list));

        postData.ParaData = JSON.stringify({});
        postData.OutList = list;

        AjaxService.Print("1", (new Date().getDate()).toString(), postData, vm.PrinterName).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })
    }

    function DownExe() {
        $window.location.href = FileUrl + "DownLoad/打印插件.exe";
    }
}
]);