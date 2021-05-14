'use strict';

angular.module('AppSet')
.controller('LLStart', ['$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($scope, Dialog, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Item = {};
    vm.MesList = [];
    vm.KeyDonwStart = KeyDonwStart;

    //开始备料
    function KeyDonwStart(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.PickDocNo) {
            //获取打印数据
            var en = { PickDocNo: vm.Item.PickDocNo };
            AjaxService.ExecPlan("WMSPicking", "start", en).then(function (data) {
                if (data.data[0].MsgType == "Error") {
                    showError(data.data[0].MsgText);
                    vm.Item.PickDocNo = undefined;
                    vm.isFinist = true;
                }
                else if (data.data[0].MsgType == "Success") {
                    showError(data.data[0].MsgText, true)
                    vm.Item.PickDocNo = undefined;
                }
            })
        }
    }

    function showError(mes, b) {
        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: b, Msg: mes });
        AjaxService.PlayVoice('error.mp3');
        toastr.error(mes);
    }

}]);
