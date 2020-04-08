'use strict';

angular.module('AppSet')
.controller('QZSODetailCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'Form', 'AjaxService', 'toastr', '$window', 'MyPop',
function ($scope, ItemData, $uibModalInstance, Form, AjaxService, toastr, $window, MyPop) {

    var vm = this;
    vm.form = Form[ItemData.ID ? 1 : 0];
    vm.page = { index: 1, size: 10 };
    vm.Item = angular.copy(ItemData);;
    //vm.Save = Save;
    vm.Search = Search;
    vm.KeyDonwSnCode = KeyDonwSnCode;
    vm.Done = Done;
    vm.ClearBSN = ClearBSN;
    vm.Cancel = Cancel;
    vm.SNList = [];//扫码列表
    vm.MesList = [];//信息提示
    Init();
    vm.IsFirst = true;

    function Init() {
        GetSODetail();
        ScanCode();
    }
    function KeyDonwSnCode(e) {
        vm.IsFirst = false;
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.BSN) {
            //超包装处理
            if (vm.Item.Quantity <= vm.Item.HavePackQty) {
                MyPop.ngConfirm({ text: "该工单已经扫够销售数量，是否继续扫码?" }).then(function (data) {
                    ScanCode();
                    Done();
                });
            }
            else {
                ScanCode();
            }
        }
    }
    //BSN扫描
    function ScanCode(bsn) {
        var en = {};
        en.SOID = vm.Item.ID;
        en.index = vm.page.index;
        en.size = vm.page.size;
        en.BSN = vm.Item.BSN;
        vm.promise = AjaxService.ExecPlan("QZSODetail", "Scan", en).then(function (data) {
            if (!vm.IsFirst) {
                if (data.data[0].MsgType == '0') {
                    toastr.error(data.data[0].Msg);
                    vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: data.data[0].Msg });
                } else {
                    toastr.success(data.data[0].Msg);
                    vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].Msg });
                }
            }

            vm.SNList = data.data1;
            vm.page.total = data.data2[0].Count;
            vm.Item.HavePackQty = data.data2[0].Count;
        });
    }

    function GetSODetail() {
        var list = [];
        if (vm.SerBSN) {
            list.push({ name: "BSN", value: vm.SerBSN });
        }
        vm.promise = AjaxService.GetPlansPage("QZSODetail", list, vm.page.index, vm.page.size).then(function (data) {
            vm.SNList = data.List;
            vm.page.total = data.Count;
        });
    }


    function Search() {
        vm.page.index = 1;
        GetSODetail();
    }


    function Done() {
        var en = {};
        en.SOID = vm.Item.ID;
        if (vm.Item.HavePackQty < vm.Item.Quantity) {
            MyPop.ngConfirm({ text: "还未扫够销售数量，是否完成销售订单?" }).then(function (data) {
                vm.promise = AjaxService.ExecPlan("QZSO", "Done", en).then(function (data) {
                    if (data.data[0].MsgType == '0') {
                        toastr.error(data.data[0].Msg);
                    } else {
                        toastr.success(data.data[0].Msg);
                    }
                });
            });
        } else {
            vm.promise = AjaxService.ExecPlan("QZSO", "Done", en).then(function (data) {
                if (data.data[0].MsgType == '0') {
                    toastr.error(data.data[0].Msg);
                } else {
                    toastr.success(data.data[0].Msg);
                }
            });
        }

    }
    //删除BSN
    function ClearBSN(bsn) {
        var en = {};
        en.SOID = vm.Item.ID;
        en.BSN = bsn;
        AjaxService.ExecPlan("QZSODetail", "Delete", en).then(function (data) {
            if (data.data[0].MsgType == '0') {
                toastr.error(data.data[0].Msg);
            }
            else {
                vm.SNList = [];
                vm.IsFirst = true;
                ScanCode();
                GetSODetail();
                toastr.success("清空完成");
            }
        })
    }
    //function Save() {
    //    if (vm.form.index==0) {
    //        vm.promise = AjaxService.PlanInsert("QZSODetail", vm.Item).then(function (data) {
    //            toastr.success('储存成功');
    //            $uibModalInstance.close(vm.Item);
    //        });
    //    }
    //    else {
    //        var en = {};
    //        en.ModifyBy = vm.Item.ModifyBy;
    //        en.ModifyDate = vm.Item.ModifyDate;
    //        en.PackageNO = vm.Item.PackageNO;
    //        vm.promise = AjaxService.PlanUpdate("QZSODetail", en).then(function (data) {
    //            toastr.success('储存成功');
    //            $uibModalInstance.close(en);
    //        });
    //    }
    //};



    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);
