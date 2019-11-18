'use strict';
angular.module('app').controller('MaterialDialogCtrl', MaterialDialogCtrl);

MaterialDialogCtrl.$inject = ['$scope', '$uibModalInstance', 'Dialog', 'Form', 'ItemData', 'toastr', 'AjaxService'];

function MaterialDialogCtrl($scope, $uibModalInstance, Dialog, Form, ItemData, toastr, AjaxService) {
    var vm = this;
    vm.form = Form[ItemData.Id ? 1 : 0];
    vm.Item = ItemData;
    vm.isExists = isExists;
    vm.ChangeMonitor = ChangeMonitor;
    vm.OpenMate = OpenMate;

    vm.ConfigCodeType = { Table: 'MaterialCodeType', Column: 'CodeType' };
    vm.ConfigMaterialUnit = { Table: 'MaterialUnit', Column: 'Unit' };
    
    if (vm.Item.TbName == null & vm.Item.ClName == null) {
        vm.SerialNum = {};
    } else {
        vm.SerialNum = {};
        vm.SerialNum.TbName = vm.Item.TbName;
        vm.SerialNum.ClName = vm.Item.ClName;
    }
   
   


    //获取组织信息

    AjaxService.GetPlans("syQpoor", [{ name: "Layer", value: 1 }, { name: "IsMonitor", value: 1 }]).then(function (data) {
        vm.TypeList = data;
    });

    function ChangeMonitor() {
        vm.DialogItem.Ng = undefined;
        AjaxService.GetPlans("syQpoor", [{ name: "Layer", value: 2 }, { name: "IsMonitor", value: 1 }, { name: "PID", value: vm.DialogItem.NgType }]).then(function (data) {
            vm.QpoorList = data;
        });
    }

    function OpenMate() {
        Dialog.OpenDialog("MaterialDialog", {}).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }

    //储存或修改
    vm.Save = function () {
        var en = {};
        //vm.Item.type = 0;
        en.type = vm.Item.type;//新增 null ，更新 1
        en.Id = vm.Item.Id;
        en.MaterialCode = vm.Item.MaterialCode;//料号
        en.Spec = vm.Item.Spec;//规格
        en.MaterialName = vm.Item.MaterialName;//料品名称
        en.Unit = vm.Item.Unit;//重量
        en.MaterialTypeID = vm.Item.MaterialTypeID;//料号分类
        en.Color = vm.Item.Color;//颜色
        en.Texture = vm.Item.Texture;//
        en.LowerFPY = vm.Item.LowerFPY;//
        en.Weight = vm.Item.Weight;//
        en.PalletSumWight = vm.Item.PalletSumWight;//
        en.BoxWeight = vm.Item.BoxWeight;//盒子
        en.BoxCount = vm.Item.BoxCount;//
        en.PerBoxCount = vm.Item.PerBoxCount;//
        en.ColorBoxCount = vm.Item.ColorBoxCount;//
        en.PalletRoughWeight = vm.Item.PalletRoughWeight;//
        en.ColorBoxPrintNum = vm.Item.ColorBoxPrintNum;//
        en.UPPH = vm.Item.UPPH;//
        en.PersonCount = vm.Item.PersonCount;//
        en.ProductSwitch = vm.Item.ProductSwitch;//
        en.PassSwitch = vm.Item.PassSwitch;//
        en.Remark = vm.Item.Remark;//备注
        en.Brand = vm.Item.Brand;//品牌
        en.CreateBy = vm.Item.CreateBy;
        en.ModifyBy;
        en.ModifyDate;

        if (vm.Item.AgeingTime == null || vm.Item.AgeingTime == "") {
            en.AgeingTime = 0;
        } else { 
            en.AgeingTime = vm.Item.AgeingTime;//老化时间
        }
       
        
        en.TbName = vm.SerialNum.TbName;
        en.ClName = vm.SerialNum.ClName;
        console.log(en);
        if (vm.Item.State == false) {
            vm.Item.State = 0;
        } else if (vm.Item.State == true) {
            vm.Item.State = 1;
        }
        en.State = vm.Item.State;//是否有效

        console.log(en);
        if (en.Id != null) {
            vm.promise = AjaxService.ExecPlan("MesMXMaterial", "alter", en).then(function (data) {
                console.log(data);
                if (data.data[0].MsgType == 'Success') {
                    toastr.success('更新成功');
                    $uibModalInstance.close(en);
                }
                else if (data.data[0].MsgType == 'Error') {
                    toastr.error(data.data[0].Msg);
                }
            })
        } else if (en.Id == null) {
            vm.promise = AjaxService.ExecPlan("MesMXMaterial", "add", en).then(function (data) {
                console.log(data);
                if (data.data[0].MsgType == 'Success') {
                    toastr.success('新增成功');
                    $uibModalInstance.close(en);
                }
                else if (data.data[0].MsgType == 'Error') {
                    toastr.error(data.data[0].Msg);
                }
            })
        }
    
    };

    //取消
    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //验证是否存在
    function isExists() {
        if (vm.Item.MaterialCode) {
            var en = { name: "MaterialCode", value: vm.Item.MaterialCode };
            AjaxService.GetPlan('MesMXMaterial', en).then(function (data) {
                $scope.DialogForm.MaterialCode.$setValidity('unique', !data.MaterialCode);
            });
        }
    }

}
