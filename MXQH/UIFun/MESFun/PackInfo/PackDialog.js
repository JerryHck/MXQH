﻿'use strict';
angular.module('app')
.controller('PackDialogCtrl', ['$rootScope', '$scope', 'ItemData', '$uibModalInstance', 'Dialog', 'toastr', 'AjaxService', 'Form',
function ($rootScope, $scope, ItemData, $uibModalInstance, Dialog, toastr, AjaxService, Form) {
    var vm = this;
    vm.Item = ItemData;
    vm.Save = Save;
    vm.Cancel = Cancel;
    vm.Item.PackListNo = vm.Item.PackListNo == undefined ? GenerateListNo() : vm.Item.PackListNo;
    vm.IsStartAt0 = false;
    vm.GetListNo = GetListNo;
    vm.StartNum = 0;
    GetPlaces();
    if (vm.Item.MaterialID) {//新增操作才会有
        vm.Item.CountryCode = 'CN';//默认CN
        vm.promise = AjaxService.GetPlan("MesMXMaterial", { name: "Id", value: vm.Item.MaterialID }).then(function (data) {
            vm.Item.PerBoxQuantity = data.PerBoxCount;
            vm.Item.PerColorBoxQty = data.ColorBoxCount;
        });
        //Tanapa会有多条，多条时，以出货地为条件
        vm.promise = AjaxService.ExecPlan("MESbaTanapa", "Get", { MaterialID: vm.Item.MaterialID, MoID: vm.Item.MoID }).then(function (data) {
            vm.Item.Ean = data.data[0].Ean;
            vm.Item.Model = data.data[0].Model;
            vm.Item.RadioKit = data.data[0].RadioKit;
            vm.Item.PKGID = data.data[0].PKGID;
            vm.Item.Tanapa = data.data[0].Tanapa;
        });
    }
    //
    GetListNo();
    //获取包装标签号
    function GetListNo() {
        if (vm.Item.MoID) {
            vm.promise = AjaxService.ExecPlan("MESPackageMain", "GetPackListNo", { MoID: vm.Item.MoID }).then(function (data) {
                if (!vm.Item.TransID) {
                    vm.Item.TransID = data.data[0].CustomerOrder;
                }
                //创建包装标签号
                if (vm.IsStartAt0) {
                    GenerateListNo();
                }
                else {
                    if (data.data[0].PackListNo == '') {
                        GenerateListNo();
                    } else {
                        vm.Item.PackListNo = data.data[0].PackListNo;
                    }
                }
            });
        }
    }
    //保存
    function Save() {
        if (!vm.SpecifyNum) {
            vm.StartNum = 0;
        } 
        if (vm.IsStartAt0 && vm.SpecifyNum > 0) {
            toastr.error("\"箱号从头计数\"和\"起始箱号\"不能同时启用！");
            return;
        }
        
        var en = {};
        var li = [];
        vm.Item.MaxWeight = 0;
        vm.Item.MinWeight = 0;
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
        en.StartNum = vm.StartNum;
        if (vm.Item.ID) {//编辑操作
            //vm.Item.Order = undefined;
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
            en.IsStartAt0 = vm.IsStartAt0;//是否从0开始计算箱号
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
    function GenerateListNo() {
        var en = { TbName: "PackInfo", ClName: "Label", CharName: null };
        AjaxService.ExecPlan("SerialNumberSet", "preview", en).then(function (data) {
            vm.Item.PackListNo = data.data[0].SN;
        })
    }
    //退出弹出框
    function Cancel(item) {
        $uibModalInstance.close(item);
    }

    //获取线别数据
    function GetPlaces() {
        vm.promise = AjaxService.GetPlans("baSendPlace", [{ name: "IsDefault", value: 1 }]).then(function (data) {
            vm.Places = data;
        });
    }
}
])