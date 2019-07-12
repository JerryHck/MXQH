'use strict';

angular.module('app')
.controller('SnCodePrintCtrl', [ '$scope', 'FileUrl', 'AjaxService', 'toastr', '$window',
function ( $scope, FileUrl, AjaxService, toastr, $window) {

    var vm = this;
    vm.DeleteItem = {};
    vm.MesList = [];
    vm.Focus = 0;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.IsReprint = "I";
    vm.KeyDonwInCode = KeyDonwInCode;
    vm.PrintCode = PrintCode;

    //内部码验证
    function KeyDonwInCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.DeleteItem.InternalCode) {
            var en = {};
            en.Code = vm.DeleteItem.InternalCode;
            en.Action = vm.IsReprint;
            CheckPrint(en);
        }
    }

    function CheckPrint(en) {
        AjaxService.ExecPlan("MESSNCode", 'snprint', en).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: data.data[0].MsgText });
                AjaxService.PlayVoice('3331142.mp3');
            }
            else if (data.data[0].MsgType == "Success") {
                AjaxService.PlayVoice('success.mp3');
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].MsgText });
                PrintCode(data.data1[0]);
            }
            vm.DeleteItem = {};
        });
    }

    function PrintCode(data) {
        var postData = {}, list = [];

        list.push(data.SnCode);

        postData.ParaData = JSON.stringify({});
        postData.OutList =list;
        //console.log(data);
        AjaxService.Print(data.TemplateId, data.TS, postData, vm.PrinterName).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })

    }
}
]);