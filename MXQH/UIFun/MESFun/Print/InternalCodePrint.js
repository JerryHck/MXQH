'use strict';

angular.module('app')
.controller('InternalPrintCtrl', ['$rootScope', '$scope', 'FileUrl', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, FileUrl, AjaxService, toastr, $window) {

    var vm = this;
    vm.MsgList = [];
    vm.PrintCode = PrintCode;
    vm.KeyUp = KeyUp;
    vm.IsAuto = true;


    //获取本地打印机
    AjaxService.GetLocalPrinters().then(function (data) {        
        vm.PrintList = data;
    }, function (err) {
        console.log(err);
    });

    //SN码验证
    function KeyUp(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.SNCode) {
            var en = {};
            en.name = "InternalCode";
            en.value = vm.SNCode;
            if (vm.IsAuto) {
                PrintCode();
            }
            vm.InternalCode = undefined;
        }
    }

    function GetInternalCode(snCode) {
        vm.promise = AjaxService.ExecPlan("MESSNCode", "printInternal", { SNCode: vm.SNCode }).then(function (data) {
            console.log(data);
            if (data.data.length > 0) {
                vm.InternalCode = data.data[0].InternalCode;
            } else {
                toastr.error('找不到['+vm.SNCode+'])');
            }
        });
    }
    

    //打印条码
    function PrintCode() {
        var postData = {}, list = [];
        //根据SN码获取内控码
        vm.promise = AjaxService.ExecPlan("MESSNCode", "printInternal", { SNCode: vm.SNCode }).then(function (data) {
            if (data.data.length > 0) {
                vm.InternalCode = data.data[0].InternalCode;
                list.push(angular.copy(vm.InternalCode));
                postData.ParaData = JSON.stringify({});
                postData.OutList = list;
                AjaxService.Print(data.data[0].TemplateId, data.data[0].TemplateTime, postData, vm.PrinterName).then(function (data) {
                    vm.MsgList.push({ Id: vm.MsgList.length, IsOk: true, Msg: '[' + vm.SNCode + ']打印成功' });
                }, function (err) {
                    vm.MsgList.push({ Id: vm.MsgList.length, IsOk: false, Msg: '[' + vm.SNCode + ']打印失败' });
                })
            } else {
                toastr.error('[' + vm.SNCode + ']找不到');
                vm.MsgList.push({ Id: vm.MsgList.length, IsOk: false, Msg: '[' + vm.SNCode + ']找不到' });
            }
        });
    }

}
]);