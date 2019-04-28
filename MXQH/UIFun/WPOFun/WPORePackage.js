'use strict';

angular.module('app')
.controller('WPORePackageCtrl', ['$rootScope', '$scope', 'AjaxService', 'toastr', 'FileUrl', 'MyPop', '$uibModalInstance', 'ItemData',
function ($rootScope, $scope, AjaxService, toastr, FileUrl, MyPop, $uibModalInstance, ItemData) {

    var vm = this;
    //vm.currentRouterName = angular.copy($state.current.name);

    vm.DialogItem = angular.copy(ItemData);

    vm.Ser = {};
    vm.Item = {};
    vm.KeyDonwSnCode = KeyDonwSnCode;
    vm.RemoveBSN = RemoveBSN;
    vm.Done = Done;
    vm.ClearAll = ClearAll;

    vm.PackId = -1;
    vm.PrintPackId = 1;
    vm.NumIndex = 0;
    vm.MesList = [];

    vm.MOId = vm.DialogItem.MOId;
    vm.PackId = vm.DialogItem.Id;
    vm.Item.PackNum = vm.DialogItem.PackNum;
    ChangeMO();

    //获取包装SN列表
    AjaxService.GetPlans("WPOpackageDtl", [{ name: "PackId", value: vm.PackId }]).then(function (data) {
        vm.SNList = data;
    });

    AjaxService.GetPlan("WPOPackagePara", { name: "SetName", value: "NoticeNum" }).then(function (data) {
        vm.NoticeNum = parseInt(data.SetValue);
    })

    function ChangeMO() {
        AjaxService.ExecPlan("WPOFun", 'order', { Id: vm.MOId }).then(function (data) {
            if (data.data[0]) {
                vm.OrderData = data.data[0];
                //vm.Item.PackNum = parseInt(vm.OrderData.PackNum);
                vm.NumIndex = 0;
                vm.Item.NoPackQty = vm.OrderData.AucPOQty - (data.data1[0] && data.data1[0].HavePackQty ? data.data1[0].HavePackQty : 0);
            }
        })
    }

    function KeyDonwSnCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.BSN) {
            vm.StaticBSN = angular.copy(vm.Item.BSN);
            var en = {};
            en.PackId = vm.PackId;
            en.MOId = vm.MOId;
            en.BSN = vm.Item.BSN;
            en.UserNo = $rootScope.User.UserNo;
            en.PackNum = vm.Item.PackNum;
            en.VenderSn = $rootScope.User.OrgSn;
            en.Remark = vm.Item.Remark;

            AjaxService.ExecPlan("WPOPackage", 'pack', en).then(function (data) {
                vm.Item.BSN = undefined;
                var msg = data.data[0];
                if (msg.MsgType == 'success') {
                    //
                    vm.SNList = data.data1;
                    //toastr.error(mes);
                    showMsg(msg.Msg, true);
                    var parkid = data.data2[0].PackId;
                    vm.PrintPackId = data.data2[0].OriPackId;
                    //判断打印,包装完成需要打印
                    if (parkid == -1) {
                        MyPop.ngConfirm({ text: "包装箱已经完成，是否要打印标签" }).then(function () {
                            //打印
                            PrintCode(vm.PrintPackId);
                        })
                        vm.NumIndex = 0;
                        $uibModalInstance.close(vm.Item);
                    } else {
                        vm.NumIndex++
                        if (vm.NumIndex == vm.NoticeNum) {
                            AjaxService.PlayVoice('5611.mp3');
                            MyPop.ngConfirm({ text: "已经扫描了" + vm.NumIndex + "个" });
                            vm.NumIndex = 0;
                        }
                    }
                    vm.PackId = angular.copy(data.data2[0].PackId);
                    //更新计数
                    AjaxService.ExecPlan("WPOFun", 'order', { Id: vm.MOId }).then(function (data) {
                        if (data.data[0]) {
                            vm.Item.NoPackQty = vm.OrderData.AucPOQty - (data.data1[0] && data.data1[0].HavePackQty ? data.data1[0].HavePackQty : 0);
                        }
                    })
                }
                else if (msg.MsgType == 'fail') {
                    showMsg(msg.Msg, false);
                }
            });
        }
    }

    function Done() {
        if (vm.PackId != -1 && vm.SNList && vm.SNList.length > 0) {
            var en = {};
            en.PackId = vm.PackId;
            en.UserNo = $rootScope.User.UserNo;
            en.Remark = vm.Item.Remark;
            AjaxService.ExecPlan("WPOPackage", "force", en).then(function (data) {
                //打印
                vm.PrintPackId = angular.copy(vm.PackId);
                $uibModalInstance.close(vm.Item);
                vm.PackId = -1;
                vm.Package = undefined;
                vm.SNList = [];
                toastr.success("包装成功");
            })
        }
    }

    function RemoveBSN(item) {
        if (vm.ItemData == 2) {
            showMsg('不是拆包状态， 不允许移除SN', false);
            return;
        }
        AjaxService.PlanDelete("WPOpackageDtl", item).then(function (data) {
            //更新计数
            AjaxService.ExecPlan("WPOFun", 'order', { Id: vm.MOId }).then(function (data) {
                if (data.data[0]) {
                    vm.Item.NoPackQty = vm.OrderData.AucPOQty - (data.data1[0] && data.data1[0].HavePackQty ? data.data1[0].HavePackQty : 0);
                }
            });
            //获取包装SN列表
            AjaxService.GetPlans("WPOpackageDtl", [{ name: "PackId", value: vm.PackId }]).then(function (data) {
                showMsg("SN码[" + item.BSN + "]已经成功从包装箱[" + item.PackageNO + "中移除", true);
                vm.SNList = data;
                vm.NumIndex = data.length % vm.NoticeNum;
                vm.NumIndex = vm.NumIndex || 0;
            });
        })
    }

    function PrintCode(packId) {
        AjaxService.GetPlan("WPOPackPrint", { name: "Id", value: packId }).then(function (data) {
            var postData = {}, list = [];
            list.push();
            postData.ParaData = JSON.stringify(data);
            postData.OutList = JSON.stringify(list);

            AjaxService.Print(data.TemplateId, data.TemplateVersion, postData, vm.PrinterName).then(function (data) {
                console.log(data);
            }, function (err) {
                console.log(err);
            })
        })
    }

    function showMsg(msg, type) {
        if (type) {
            vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: msg });
        }
        else {
            vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: msg });
            AjaxService.PlayVoice('3331142.mp3');
            toastr.error(msg);
        }
    }

    function ClearAll() {
        if (vm.PackId != -1 && vm.SNList && vm.SNList.length > 0) {
            var en = {};
            en.PackId = vm.PackId;
            AjaxService.ExecPlan("WPOPackage", "clear", en).then(function (data) {
                vm.SNList = [];
                toastr.success("清空完成");
                ChangeMO();
            })
        }
    }

    //取消
    vm.cancel = function () {
        $uibModalInstance.close(vm.Item);
        //$uibModalInstance.dismiss('cancel');
    };
}
]);