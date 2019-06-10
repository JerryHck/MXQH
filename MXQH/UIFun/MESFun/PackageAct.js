'use strict';

angular.module('app')
.controller('PackageActCtrl', ['$rootScope', '$scope', 'MyPop', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, MyPop, AjaxService, toastr, $window) {

    var vm = this;
    vm.Item = { };
    vm.MesList = [];
    vm.Focus = { SNCode: true, Order: false, SN: false };
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.IsAuto = true;

    vm.KeyDonwSnCode = KeyDonwSnCode;
    vm.KeyDonwOrder = KeyDonwOrder;
    vm.PackSave = PackSave;
    vm.SelectTab = SelectTab;
    vm.ChangeBoxNum = ChangeBoxNum;
    vm.NewPaletCode = NewPaletCode;
    vm.DeleteSn = DeleteSn;

   
    //获取包装信息-未完工的资料
    AjaxService.GetPlans("MESOrder", [{ name: "ExtendOne", type: "null" }, { name: "WorOrder", value: "AMO%", type:"not like", action:"and" }]).then(function (data) {
        vm.OrderList = data;
    })

    //内部码验证
    function KeyDonwSnCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        vm.SNList = vm.SNList || [];
        if (keycode == 13 && vm.Item.SNCode) {
            vm.ThisSnCode = vm.Item.SNCode;
            if (vm.SNList.length == vm.PackDetail.ProductCount) {
                MyPop.Confirm({ text: "包装箱已经包满， 请结束包厢" }, function () { });
                vm.Item.SNCode = undefined;
                return;
            }
            
            for (var i=0, len = vm.SNList.length; i < len; i++) {
                if (vm.Item.SNCode == vm.SNList[i].SNCode) {
                    vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: 'SN[' + vm.Item.SNCode + ']已经包含在此箱中' });
                    AjaxService.PlayVoice('3331142.mp3');
                    vm.Item.SNCode = undefined;
                    return;
                }
            }

            var en = {};
            en.Sn = vm.Item.SNCode;
            en.PackDetailID = vm.PackDetail.ID;
            AjaxService.ExecPlan("MESPackageDtl", 'checkSn', en).then(function (data) {
                if (data.data[0].MsgType == "Error") {
                    vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: data.data[0].MsgText });
                    AjaxService.PlayVoice('3331142.mp3');
                }
                else if (data.data[0].MsgType == "Success") {
                    vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].MsgText });
                    vm.SNList = data.data1;
                }
                vm.Item.SNCode = undefined;
            });
        }
    }

    //生成新卡板号
    function NewPaletCode() {
        var en = {};
        en.ID = vm.PackDetail.ID;
        en.PalletCode = "";
        var SNList = [{ name: "MesPackage", col: "PalletCode", parm: "PalletCode" }];
        en.SNColumns = JSON.stringify(SNList);
        AjaxService.PlanUpdate("MESPackageDtl", en).then(function (data) {
            ChangeBoxNum(vm.Item.BoxNumber);
        })
    }

    function DeleteSn() {

    }

    function KeyDonwOrder(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.WorOrder) {
            vm.IsEdit = false;
            var en = {};
            en.name = "WorOrder";
            en.value = vm.Item.WorOrder;
            AjaxService.GetPlan("MESPackageMain", en).then(function (data) {
                vm.ItemData = data;
                var mss = "工单 [" + vm.Item.SNCode + '] ';
                if (!data.ID) {
                    vm.Item.WorOrder = undefined;
                    vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '  不存在或未包装' });
                }
                else {
                    vm.PackMain = data;
                    vm.Item.SNCode = undefined;
                    vm.PackDetail = undefined;
                    vm.Item.BoxNumber = undefined;
                    getBoxList();
                }
            });
        }
    }

    function getBoxList() {
        AjaxService.GetPlans("MESPackDtl", { name: "PackMainID", value: vm.PackMain.ID }).then(function (data2) {
            vm.BoxList = data2;
            ChangeBoxNum(vm.Item.BoxNumber + 1);
            setTimeout(function () {
                $("#sc").scrollTop(vm.ScTop);
            }, 1000);
        });
        
    }

    function ChangeBoxNum(boxNum) {
        if (!boxNum || boxNum > vm.BoxList.length) return;
        vm.Item.BoxNumber = boxNum;
        vm.ScTop = $("#sc")[0].scrollTop + $("#sc a:first").height() + 18;
        var en = { PackMainID: vm.ItemData.ID, BoxNumber: vm.Item.BoxNumber };
        vm.promise = AjaxService.ExecPlan("MESPackageDtl", 'getdtl', en).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: data.data[0].MsgText });
                AjaxService.PlayVoice('3331142.mp3');
                vm.Item.BoxNumber = undefined;
            }
            else if (data.data[0].MsgType == "Success") {
                vm.PackDetail = data.data1[0] || {};
                vm.PackDetail.ProductCount = vm.PackDetail.ProductCount || 0;
                vm.NoList = [];
                for (var i = 0; i < vm.PackDetail.ProductCount; i++) {
                    vm.NoList.push(i + 1);
                }
                vm.SNList = data.data2
            }
        });
    }

    function SelectTab(index) {
        vm.Focus = index;
    }

    function PackSave(t) {
        getBoxList();
        var en = {};
        en.PackDetailID = vm.PackDetail.ID;
        en.PalletCode = vm.PackDetail.PalletCode;
        en.Packweight = vm.PackDetail.Packweight;
        en.CreateBy = $rootScope.User.UserNo;
        en.ActType = t;
        vm.promise = AjaxService.ExecPlan("MESPackageDtl", "save", en).then(function (data) {
            toastr.success('操作成功');
            vm.IsEdit = false;
        })
    }
}
]);