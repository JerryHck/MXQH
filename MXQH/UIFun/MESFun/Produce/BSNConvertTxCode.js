'use strict';

angular.module('app')
.controller('BSNConvertTxCodeCtrl', ['$rootScope', '$scope', 'MyPop', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, MyPop, AjaxService, toastr, $window) {

    var vm = this;
    vm.Item = {};
    vm.MesList = [];
    vm.Focus = { Order: true, InCode: false, SN: false };
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.IsPrint = true;

    vm.KeyDonwInCode = KeyDonwInCode;
    vm.KeyDonwOrder = KeyDonwOrder;
    vm.InCodeToDb = InCodeToDb;
    vm.NgSave = NgSave;
    vm.SelectTab = SelectTab;
    vm.KeyDonwBSNPrint = KeyDonwBSNPrint;

    //获取包装信息
    AjaxService.GetPlans("MXTestWorkOrder").then(function (data) {
        vm.OrderList = data;
    })

    //获取模版信息
    AjaxService.GetPlan("MESBarCodeTemplate", [{ name: "TemplateId", value: 1 }]).then(function (data) {
        vm.Template = data;
    })

    //内部码验证
    function KeyDonwInCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.InCode) {
            vm.InCodeSave = angular.copy(vm.Item.InCode);
            vm.Item.InCode = undefined;
            InCodeToDb();
        }
    }

    function KeyDonwOrder(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.WorkOrder) {
            GetOrder();
        }
    }

    function GetOrder() {
        var en = {};
        en.WorkOrder = vm.Item.WorkOrder;
        AjaxService.ExecPlan("MXTestWorkOrder", "get", en, false).then(function (data) {
            var mss = "工单 [" + vm.Item.WorkOrder + '] ';
            vm.OrderData = undefined;
            if (!data.data[0] || !data.data[0].WorkOrder) {
                vm.Item.WorkOrder = undefined;
                showError(mss + '  不存在或还未设置转码方式');
            }
            else {
                vm.OrderData = data.data[0];
                vm.BSNList = data.data1;
                vm.Focus = { Order: false, InCode: true, SN: false };
                Preview();
            }
        });
    }

    function Preview() {
        if (vm.OrderData.TbName && vm.OrderData.ClName) {
            var en = {};
            en.TbName = vm.OrderData.TbName;
            en.ClName = vm.OrderData.ClName;
            en.CharName = vm.OrderData.BetchNo;
            AjaxService.ExecPlan("SerialNumberSet", "preview", en).then(function (data) {
                vm.OrderData.PrevSN = data.data[0] ? data.data[0].SN : "";
            })
        }
    }

    //bsn打印
    function KeyDonwBSNPrint(e) {
        $scope.$applyAsync(function () {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13 && vm.Item.BSNPrint) {
                var en = [{ name: "BSN", value: vm.Item.BSNPrint }, { name: "TxCode", value: vm.Item.BSNPrint, action:"OR" }];
                en.InternalCode = vm.Item.BSNPrint;
                AjaxService.GetPlan("txBSNConvertTxCode", en).then(function (data) {
                    if (!data.TxCode) {
                        showError('条码【'+en.InternalCode+'】不存在或还没转换过试产码');
                    }
                    else {
                        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: '条码【' + en.InternalCode + '】打印成功' });
                        AjaxService.PlayVoice('success.mp3');
                        print(data.TxCode);
                    }
                    vm.Item.BSNPrint = undefined;
                });
            }
        });
    }

    function InCodeToDb() {
        var IsOk = true;
        if (!vm.OrderData) {
            showError('不存在或未设置转码方式');
            return false;
        }
        Save();
    }

    function showError(mes)
    {
        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mes });
        AjaxService.PlayVoice('error.mp3');
        toastr.error(mes);
    }

    function SelectTab(index) {
        vm.Focus = index;
    }

    function Save() {
        var en = { BSN: vm.InCodeSave, MOID: vm.OrderData.ID };
        vm.promise = AjaxService.ExecPlan("MXTestWorkOrder", "check", en, false).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                showError(data.data[0].Msg);
                GetOrder();
                vm.InCodeSave = undefined;
            }
            else if (data.data[0].MsgType == "Success") {
                var SNList = [{ name: vm.OrderData.TbName, col: vm.OrderData.ClName, parm: "TxCode", charName: vm.OrderData.BetchNo }];
                en.TxCode = "";
                en.SNColumns = JSON.stringify(SNList);

                AjaxService.ExecPlan("MXTestWorkOrder", "save", en).then(function (data) {
                    if (data.data[0].MsgType == 'Success') {
                        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].Msg });
                        AjaxService.PlayVoice('success.mp3');
                        //打印
                        if (vm.IsPrint) {
                            print(data.data1[0].TxCode);
                        }
                        vm.InCodeSave = undefined;

                    }
                    else if (data.data[0].MsgType == 'Error') {
                        showError(data.data[0].Msg);
                        vm.InCodeSave = undefined;
                    }
                    GetOrder();
                })
            }
        })
    }

    function print(bsn) {
        var postData = {}, list = [];

        list.push(bsn);

        postData.ParaData = JSON.stringify({});
        postData.OutList = list;

        AjaxService.Print(vm.Template.TemplateId, vm.Template.TS, postData).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })
    }

    //不良
    function NgSave() {

    }
}
]);