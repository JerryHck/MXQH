'use strict';

angular.module('app')
.controller('BLPrintCtrl', ['$scope', 'FileUrl', 'AjaxService', 'toastr', '$window','$rootScope',
function ($scope, FileUrl, AjaxService, toastr, $window, $rootScope) {

    var vm = this;
    vm.DeleteItem = {};
    vm.MesList = [];
    vm.Focus = 0;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.IsReprint = "I";
    vm.KeyDonwInCode = KeyDonwInCode;
    vm.PrintCode = PrintCode;
    vm.Search = Search;

    function Search() {
        vm.page.index = 1;
        DataBind();
    }
    function DataBind() {
        vm.promise = AjaxService.GetPlansPage("MESBLLog", GetCondition(), vm.page.index, vm.page.size).then(function (data) {
            vm.SerList = data.List;
            vm.page.total = data.Count;
        });
    }
    function GetCondition() {
        var list = [];
        if (vm.page.CreateBy) {
            list.push({ name: "CreateBy", value:vm.page.CreateBy });
        }
        if (vm.page.SNCode) {
            list.push({ name: "SNCode", value: vm.page.SNCode });
        }
        console.log(list);
        return list;
    }
    //内部码验证
    function KeyDonwInCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.DeleteItem.InternalCode) {
            var en = {};
            //en.Code = vm.DeleteItem.InternalCode;
            en.IsRePrint = vm.IsReprint;
            en.BLCode = vm.DeleteItem.InternalCode;
            vm.DeleteItem = {};
            CheckPrint(en);
        }
    }
    //校验SN码是否上线
    function CheckPrint(en) {
        AjaxService.ExecPlan("MESSNCode", 'BLPrint', en).then(function (data) {
            if (data.data[0].MsgType == "0") {
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: data.data[0].Msg });
                AjaxService.PlayVoice('error.mp3');
            }
            else if (data.data[0].MsgType == "1") {
                AjaxService.PlayVoice('success.mp3');
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].Msg });
                PrintCode(data.data2[0], data.data1[0]);
            }
            vm.DeleteItem = {};
        });
    }
    //打印标签
    function PrintCode(data, temData) {
        var postData = {}, list = [];
        list.push(data.SNCode);
        postData.ParaData = JSON.stringify(data);
        postData.OutList = list;
        var printNum = data.ColorBoxPrintNum || 1;
        for (var i = 0; i < printNum; i++) {
            AjaxService.Print(temData.TemplateId, temData.TemplateTime, postData, vm.PrinterName).then(function (rData) {
                if (vm.IsReprint == 'I') {//第一次打印
                    AjaxService.ExecPlan("MESBLLog", "Add", { SNCode: data.SNCode, CreateBy: $rootScope.User.Name }).then(function (returnData) {

                    });
                }               
            }, function (err) {
            })
        }
    }
}
]);