'use strict';
angular.module('app')
.controller('PackDialogCtrl', ['$rootScope', '$scope', 'ItemData', '$uibModalInstance', 'Dialog', 'toastr', 'AjaxService', 'Form',
function ($rootScope, $scope, ItemData, $uibModalInstance, Dialog, toastr, AjaxService, Form) {
    var vm = this;
    vm.Item = ItemData;
    vm.Save = Save;
    vm.Cancel = Cancel;
    vm.Item.PackListNo = vm.Item.PackListNo == undefined ? GetListNo() : vm.Item.PackListNo;
    if (vm.Item.MaterialID) {
        vm.promise = AjaxService.GetPlan("MesMXMaterial", { name: "Id", value: vm.Item.MaterialID }).then(function (data) {
            vm.Item.PerBoxQuantity = data.PerBoxCount;
            vm.Item.PerColorBoxQty = data.ColorBoxCount;
        });
    }
    if (vm.Item.MoID) {
        vm.promise = AjaxService.ExecPlan("MESPackageMain", "GetPackListNo", { MoID: vm.Item.MoID }).then(function (data) {
            //创建包装标签号
            if (data.data[0].PackListNo == '') {
                GetListNo();
            } else {
                vm.Item.PackListNo = data.data[0].PackListNo;
            }
        });
    }
    //保存
    function Save() {
        var en = {};
        var li = [];
        vm.Item.ShipForm = vm.Item.ShipForm == undefined ? '' : vm.Item.ShipForm;
        vm.Item.ShipInstruction = vm.Item.ShipInstruction == undefined ? '' : vm.Item.ShipInstruction;
        vm.Item.Tanapa = vm.Item.Tanapa == undefined ? '' : vm.Item.Tanapa;
        vm.Item.Model = vm.Item.Model == undefined ? '' : vm.Item.Model;
        vm.Item.PKGWT = vm.Item.PKGWT == undefined ? '' : vm.Item.PKGWT;
        vm.Item.RadioKit = vm.Item.RadioKit == undefined ? '' : vm.Item.RadioKit;
        if (vm.Item.ID) {
        vm.Item.Order = undefined;
        }
        li.push(vm.Item);
        en.Entity = JSON.stringify(li);
        en.TempColumns = "Entity";
        if (vm.Item.ID) {//编辑操作
            //vm.Item.Order = undefined;
            console.log(en);
            vm.promise = AjaxService.ExecPlan("MESPackageMain", "Update", en).then(function (data) {
                if (data.data[0].MsgType == '1') {
                    toastr.success(data.data[0].Msg);
                    $uibModalInstance.close('1');
                } else {
                    toastr.error(data.data[0].Msg);
                }
            });
        } else {//保存操作
            var SNList = [{ name: "PackInfo", col: "Label", parm: "PackListNo", charName: null }]
            en.SNColumns = JSON.stringify(SNList);
            en.PackListNo = "";
            vm.promise = AjaxService.ExecPlan("MESPackageMain", "Add", en).then(function (data) {
                if (data.data[0].MsgType == '1') {
                    toastr.success(data.data[0].Msg);
                    $uibModalInstance.close('1');
                } else {
                    toastr.error(data.data[0].Msg);
                }
            });
        }
    }

    //自动生成计划序号
    function GetListNo() {
        var en = { TbName: "PackInfo", ClName: "Label", CharName: null };
        AjaxService.ExecPlan("SerialNumberSet", "preview", en).then(function (data) {
            vm.Item.PackListNo = data.data[0].SN;
        })
    }
    //退出弹出框
    function Cancel(item) {
        $uibModalInstance.close(item);
    }
}
])