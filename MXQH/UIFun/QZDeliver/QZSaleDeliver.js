'use strict';

angular.module('app')
.controller('QZSaleDeliverCtrl', ['$scope', 'AjaxService', 'toastr', '$uibModalInstance', 'ItemData', 'FileUrl', 'MyPop',
function ($scope, AjaxService, toastr, $uibModalInstance, ItemData, FileUrl, MyPop) {

    var vm = this;
    vm.ItemData = ItemData;
    vm.page = { index: 1, size: 10 };
    vm.Ser = {};
    vm.Item = { BSN: "login" };
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.SelectTab = SelectTab;
    vm.KeyDonwSnCode = KeyDonwSnCode;
    vm.Done = Done;
    vm.ClearBSN = ClearBSN;

    vm.KeyDonwPackSn = KeyDonwPackSn;

    vm.NumIndex = 0;
    vm.MesList = [];
    vm.SNList = [];

    AjaxService.GetPlan("QZSaleDeliver", { name: "Id", value: ItemData.Id }).then(function (data) {
        vm.ItemData = data;
    })

    Search();
    PackInCode(false);
    //取消
    vm.cancel = cancel;

    function Search() {
        vm.page.index = 1;
        PageChange()
    }

    function PageChange() {
        var list = [];
        if (vm.SerBSN) {
            list.push({ name: "BSN", value: vm.SerBSN });
        }
        list.push({ name: "MainId", value: vm.ItemData.Id });
        AjaxService.GetPlansPage("QZSaleDeliverDtl", list, vm.page.index, vm.page.size).then(function (data) {
            vm.SNList = data.List;
            vm.page.total = data.Count;
        });
    }

    function SelectTab(index) {
        vm.Focus = index;
        if (index == 1) {
            AjaxService.GetPlans("WPOPackage", [{ name: "State", value: 1 }]).then(function (data) {
                vm.PackList = data;
            })
        }
    }

    function KeyDonwSnCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.BSN) {
            //超包装处理
            if (vm.ItemData.DeliverNum <= vm.SNList.length) {
                MyPop.ngConfirm({ text: "该工单已经扫够出货单所有数量，是否继续扫码?" }).then(function (data) {
                    PackInCode(false);
                });
            }
            else {
                PackInCode(false);
            }
        }
    }

    function PackInCode(isforce) {
        vm.StaticBSN = angular.copy(vm.Item.BSN);
        var en = {};
        en.MainId = vm.ItemData.Id;
        en.BSN = vm.Item.BSN;
        en.IsForce = isforce;
        en.Size = vm.page.size;
        AjaxService.ExecPlan("QZSaleDeliver", 'scan', en).then(function (data) {
            var msg = data.data[0];
            if (msg.MsgType == "Login") {
                vm.Item.BSN = undefined;
                vm.ItemData.HavePackQty = data.data1[0].DtlCount;
            }
            else if (msg.MsgType == 'Success' || msg.MsgType == 'Finish') {
                vm.page.index = 1;
                vm.SNList = data.data1;
                vm.ItemData.State = data.data2[0].State;
                vm.page.total = data.data2[0].DtlCount;
                vm.ItemData.HavePackQty = data.data2[0].DtlCount;
                vm.ItemData.DeliverNum = data.data2[0].DeliverNum;
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: msg.Msg });
                vm.Item.BSN = undefined;
                if (msg.MsgType == 'Finish') {
                    vm.Item.BSN = undefined;
                    MyPop.ngConfirm({ text: msg.Msg }).then(function () {
                        //完成出货
                        Done(false);
                    })
                }
            }
            else if (msg.MsgType == 'Error') {
                showMsg(msg.Msg, false);
                vm.Item.BSN = undefined;
            }
            else if (msg.MsgType == 'Warnning') {
                MyPop.ngConfirm({ text: msg.Msg }).then(function () {
                    PackInCode(true);
                })
            }
        });
    }

    function KeyDonwPackSn(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.PrintItem.PackSn && vm.IsAuto) {
            RePrint();
        }
    }

    function Done(isforce) {
        var en = {};
        en.MainId = vm.ItemData.Id;
        en.IsForce = isforce;
        AjaxService.ExecPlan("QZSaleDeliver", "done", en).then(function (data) {
            var msg = data.data[0];
            if (msg.MsgType == 'Error') {
                showMsg(msg.Msg, false);
                vm.Item.BSN = undefined;
            }
            else {
                toastr.success("出货单完成成功");
                $uibModalInstance.close(vm.ItemData);
            }
        })
    }

    function showMsg(msg, type) {
        if (type) {
            vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: msg });
        }
        else {
            vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: msg });
            AjaxService.PlayVoice('error.mp3');
            toastr.error(msg);
        }
    }

    function ClearBSN(bsn) {
        var en = {};
        en.MainId = vm.ItemData.Id;
        en.BSN = bsn;
        AjaxService.ExecPlan("QZSaleDeliverDtl", "delete", en).then(function (data) {
            var msg = data.data[0];
            if (msg.MsgType == 'Error') {
                showMsg(msg.Msg, false);
            }
            else {
                vm.SNList = [];
                vm.Item = { BSN: "login" };
                PackInCode(false);
                PageChange();
                toastr.success("清空完成");
            }
        })
    }

    //关闭
    function cancel() {
        $uibModalInstance.dismiss('cancel');
    };
}
]);