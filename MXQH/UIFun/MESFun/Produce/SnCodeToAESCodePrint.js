'use strict';

angular.module('app')
.controller('SnCodeToAESCodePrintCtrl', ['$scope', 'FileUrl', 'AjaxService', 'toastr', '$window',
function ( $scope, FileUrl, AjaxService, toastr, $window) {

    var vm = this;
    vm.DeleteItem = {};
    vm.MesList = [];
    vm.Focus = 0;
    vm.page = { index: 1, size: 12 };
    vm.PrintNum = 2;

    vm.PrintType = 'G';
    vm.Ser = {};
    vm.IsReprint = "I";
    vm.KeyDonwInCode = KeyDonwInCode;
    vm.PrintCode = PrintCode;

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;


    //内部码验证
    function KeyDonwInCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.DeleteItem.InternalCode) {
            var en = {};
            vm.ChangePrint = undefined;
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
        vm.promise = AjaxService.ExecPlan("MESopSNToAESCode", 'check', en).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                showMsg(data.data[0].MsgText, false);
            }
            else if (data.data[0].MsgType == "Success") {
                var enSave = data.data1[0];
                //调用AES dll
                AjaxService.CallDll('Auctus.AESEncoder', 'Auctus.AESEncoder', 'AesEncrypt', { str: enSave.SNCode }).then(function (aesdata) {
                    enSave.AESCode = aesdata;
                    enSave.Action = en.Action;
                    AjaxService.ExecPlan("MESopSNToAESCode", 'print', enSave).then(function (dataprit) {
                        console.log(dataprit)
                        if (dataprit.data[0].MsgType == "Error") {
                            showMsg(dataprit.data[0].MsgText, false);
                        }
                        else if (dataprit.data[0].MsgType == "Success") {
                            showMsg(dataprit.data[0].MsgText, true);
                            var num = en.Action == 'U' ? 1 : vm.PrintNum;
                            //一般打印
                            if (vm.PrintType == 'G') {
                                for (var i = 0; i < num; i++) {
                                    PrintCode(dataprit.data2[0], dataprit.data1[0]);
                                }
                            }
                        }
                    })
                });
            }
            vm.DeleteItem = {};
        });
    }

    function showMsg(mes, b) {
        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: b, Msg: mes });
        if (!b) {
            AjaxService.PlayVoice('error.mp3');
            toastr.error(mes);
        }
        else{
            AjaxService.PlayVoice('success.mp3');
            toastr.success(mes);
        }
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


    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("MESopSNToAESCode", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.BindList = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("MESopSNToAESCode", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.InternalCode) {
            list.push({ name: "InternalCode", value: vm.Ser.InternalCode, tableAs: "a" });
        }
        if (vm.Ser.SNCode) {
            list.push({ name: "SNCode", value: vm.Ser.SNCode, tableAs: "a" });
        }
        if (vm.Ser.AESCode) {
            list.push({ name: "AESCode", value: vm.Ser.AESCode, tableAs: "a" });
        }
        return list;
    }
}
]);