﻿'use strict';

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
    vm.Print = Print;
   
    //获取包装信息-未完工的资料
    AjaxService.GetPlans("MesMxWOrder", [{ name: "Status", value: 4, type: "!=" }, { name: "WorkOrder", value: "AMO%", type: "not like", action: "and" }]).then(function (data) {
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
                    showErr('SN[' + vm.Item.SNCode + ']已经包含在此箱中');
                    vm.Item.SNCode = undefined;
                    return;
                }
            }

            var en = {};
            en.Sn = vm.Item.SNCode;
            en.PackDetailID = vm.PackDetail.ID;
            AjaxService.ExecPlan("MESPackageDtl", 'checkSn', en).then(function (data) {
                if (data.data[0].MsgType == "Error") {
                    showErr(data.data[0].MsgText);
                }
                else if (data.data[0].MsgType == "Success") {
                    vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].MsgText });
                    vm.SNList = data.data1;
                    AjaxService.PlayVoice('success.mp3');
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
        var en = {};
        en.PackDetailID = vm.PackDetail.ID;
        vm.promise = AjaxService.ExecPlan("MESPackChi", "deleteSN", en).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                MyPop.Show(true, data.data[0].MsgText);
            }
            else if (data.data[0].MsgType == "Success") {
                toastr.success('SN清空成功');
                ChangeBoxNum(vm.Item.BoxNumber);
            }
        })
    }

    function KeyDonwOrder(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.WorkOrder) {
            vm.IsEdit = false;
            var en = {};
            en.name = "WorkOrder";
            en.value = vm.Item.WorkOrder;
            AjaxService.GetPlan("MESPackageMain", en).then(function (data) {
                vm.ItemData = data;
                var mss = "工单 [" + vm.Item.WorkOrder + '] ';
                if (!data.ID) {
                    vm.Item.WorkOrder = undefined;
                    showErr(mss + '  不存在或未进行包装登记');
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
                showErr(data.data[0].MsgText);
                vm.Item.BoxNumber = undefined;
            }
            else if (data.data[0].MsgType == "Success") {
                vm.PackDetail = data.data1[0] || {};
                vm.Weight = vm.PackDetail.Packweight && vm.PackDetail.Packweight > 0 ? vm.PackDetail.Packweight : vm.Weight;
                vm.PackDetail.ProductCount = vm.PackDetail.ProductCount || 0;
                vm.PrintDtlId = vm.PackDetail.ID;
                vm.NoList = [];
                for (var i = 0; i < vm.PackDetail.ProductCount; i++) {
                    vm.NoList.push(i + 1);
                }
                vm.SNList = data.data2;
            }
        });
    }

    function SelectTab(index) {
        vm.Focus = index;
    }

    function PackSave(t) {
        var en = {};
        en.PackDetailID = vm.PackDetail.ID;
        en.PalletCode = vm.PackDetail.PalletCode;
        en.Packweight = vm.Weight;
        vm.promise = AjaxService.ExecPlan("MESPackChi", "pack", en).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                MyPop.Show(true, data.data[0].MsgText);
            }
            else if (data.data[0].MsgType == "Success") {
                toastr.success('包装成功');
                vm.IsEdit = false;
                vm.PrintDtlId = vm.PackDetail.ID;
                //打印询问
                MyPop.ngConfirm({ text: "是否打印包装箱" }).then(function () {
                    Print("COTTONCODE");
                    getBoxList();
                }, function () {
                    getBoxList();
                });
            }
        })
    }

    function showErr(msg) {
        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: msg });
        AjaxService.PlayVoice('error.mp3');
        toastr.error(msg);
    }

    function Print(type) {

        var ef = {
            "Para": "\"{\"Box3S\":\"1/834\",\"TotalCt4S\":\"834\",\"Quantity\":6,\"BoxTotalQuantity\":5004,\"Packweight\":\"10.2KG\",\"Packweight_KG\":\"10.2KG\",\"Packweight_KGS\":\"10.2KGS\",\"Packweight_Ibs\":\"22.5Ibs\",\"Packweight_KG_Ibs\":\"10.2KG(22.5Ibs)\",\"AssemblyPlanDetailID\":3029,\"PerColorBoxQty\":6,\"PerBoxQuantity\":24,\"ShipForm\":\"\",\"MODELNUMBER\":\"B8P00811YDEMAQ\",\"Tanapa\":\"IXUE2113A\",\"Ean\":\"5031753007218\",\"TransID\":\"IT83027133\",\"COO\":\"CN\",\"BoxNumber\":1,\"ProductCount\":24,\"MODELNAME\":\"101010161\",\"ERPQuantity\":20000}\""
        }

        //console.log(JSON.stringify(ef));

        var en = {};
        en.PackDetailID = vm.PrintDtlId;
        en.TypeCode = type;
        AjaxService.ExecPlan("MESPackChi", "print", en).then(function (data) {
            if (data.data3[0].MsgType == "Error") {
                MyPop.Show(true, data.data3[0].MsgText);
            }
            else if (data.data3[0].MsgType == "Success") {
                var postData = {}, list = [];
                postData.ParaData = JSON.stringify(data.data[0]);
                for (var i = 0, len = data.data2.length; i < len; i++) {
                    list.push(data.data2[i].SNCode);
                }
                postData.OutList = list;
                var temp = data.data1[0];
                AjaxService.Print(temp.TemplateId, temp.TS, postData, vm.PrintName).then(function (data2) {
                    console.log(data2);
                }, function (err) {
                    console.log(err);
                })
            }
        })
    }
}
]);