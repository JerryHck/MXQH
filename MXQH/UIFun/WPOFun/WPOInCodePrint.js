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
        vm.PrinterName = data[0];
        //console.log(data);
    }, function (err) {
        //console.log(err);
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
            else {
                vm.DeleteItem.InternalCode = undefined;
            }
        }
    }

    function SelectTab(index) {
        vm.Focus = index;
    }

    function PrintCode() {
        AjaxService.ExecPlan("WPOPackPrint", 'checkIn', { BSN: vm.DeleteItem.InternalCode }).then(function (data) {
            var msg = data.data[0];
            if (msg.MsgType == 'success') {
                var postData = {}, list = [];

                list.push(vm.DeleteItem.InternalCode);

                //console.log(JSON.stringify(list));

                postData.ParaData = JSON.stringify({});
                postData.OutList = list;

                AjaxService.Print("10000", (new Date().getDate()).toString(), postData, vm.PrinterName).then(function (data) {
                    //console.log(data);
                }, function (err) {
                    //console.log(err);
                })
            }
            else if (msg.MsgType == 'fail') {
                showMsg(msg.Msg, false);
            }
            vm.DeleteItem.InternalCode = undefined;
        });
    }

    function showMsg(msg, type) {
        if (type) {
            vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: msg });
            AjaxService.PlayVoice('success.mp3');
        }
        else {
            vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: msg });
            AjaxService.PlayVoice('error.mp3');
            toastr.error(msg);
        }
        ////超过100移除
        //if (vm.MesList.length > 4) {
        //    vm.MesList.splice(vm.MesList.length - 1, 1);
        //}
    }

    function DownExe() {
        $window.location.href = FileUrl + "DownLoad/打印插件.exe";
    }
}
]);