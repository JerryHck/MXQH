'use strict';

angular.module('app')
.controller('SnCodePrintCtrl', [ '$scope', 'FileUrl', 'AjaxService', 'toastr', '$window',
function ( $scope, FileUrl, AjaxService, toastr, $window) {

    var vm = this;
    vm.DeleteItem = {};
    vm.MesList = [];
    vm.Focus = 0;
    vm.page = { index: 1, size: 12 };

    vm.PrintType = 'G';
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

                //一般打印
                if (vm.PrintType == 'G') {
                    PrintCode(data.data2[0], data.data1[0]);
                }
                    //镭雕打印
                else if (vm.PrintType == 'L') {
                    LightPrintCode(data.data2[0], data.data1[0]);
                }
            }
            vm.DeleteItem = {};
        });
    }

    function PrintCode(temData, data) {
        var postData = {}, list = [];
        list.push(data.SnCode);
        postData.ParaData = JSON.stringify(data);
        postData.OutList =list;
        var printNum = data.ColorBoxPrintNum || 1;
        for (var i = 0; i < printNum; i++) {
            AjaxService.Print(temData.TemplateId, temData.TemplateTime, postData, vm.PrinterName).then(function (data) {
                console.log(data);
            }, function (err) {
                console.log(err);
            })
        }
    }

    //镭雕
    function LightPrintCode(teData, data) {
        if (!data || !data.SNCode || data.SNCode == null) {
            toastr.error("SN不存在或还未生成");
            AjaxService.PlayVoice('error.mp3');
            return;
        }
        if (!teData || !teData.TemplateId || teData.TemplateId == null) {
            toastr.error("打印模版获取失败");
            AjaxService.PlayVoice('error.mp3');
            return;
        }
        var postData = {}, list = [];
        list.push(data.SNCode)
        postData.ParaData = JSON.stringify(data);
        postData.OutList = list;
        //console.log(postData.ParaData);
        AjaxService.LightPrint(teData.TemplateId, teData.TemplateTime, postData).then(function (data) {
            //console.log(data);
        }, function (err) {
            //console.log(err);
        })
    }
}
]);