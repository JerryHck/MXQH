﻿'use strict';

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
            vm.DeleteItem = {};
            CheckPrint(en);
        }
    }

    function CheckPrint(en) {
        if (en.Code.length == 9) {
            vm.DeleteItem.InternalCode = undefined;
            return;
        }
        AjaxService.ExecPlan("MESSNCode", 'snprint', en).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: data.data[0].MsgText });
                AjaxService.PlayVoice('error.mp3');
            }
            else if (data.data[0].MsgType == "Success") {
                AjaxService.PlayVoice('success.mp3');
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].MsgText });
                PrintCode(data.data1[0], data.data2[0]);
            }
            vm.DeleteItem = {};
        });
    }

    function PrintCode(data, temData) {
        var postData = {}, list = [];
        list.push(data.SnCode);
        postData.ParaData = JSON.stringify(data);
        postData.OutList =list;
        //console.log(data)
        var printNum = data.ColorBoxPrintNum || 1;
        for (var i = 0; i < printNum; i++) {
            AjaxService.Print(temData.TemplateId, temData.TemplateTime, postData, vm.PrinterName).then(function (data) {
                console.log(data);
            }, function (err) {
                console.log(err);
            })
        }
    }
}
]);