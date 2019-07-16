'use strict';
angular.module('app').controller('qlBadDialogCtrl', qlBadDialogCtrl);

qlBadDialogCtrl.$inject = ['$scope', '$uibModalInstance', 'Dialog', 'Form', 'ItemData', 'toastr', 'AjaxService'];

function qlBadDialogCtrl($scope, $uibModalInstance, Dialog, Form, ItemData, toastr, AjaxService) {
    var vm = this;
    vm.form = Form[ItemData.Id ? 1 : 0];
    vm.Item = ItemData;
    vm.isExists = isExists;
    vm.ChangeMonitor = ChangeMonitor;
    vm.OpenMate = OpenMate;
    vm.SelectqlBad = SelectqlBad;
    vm.syRPoorSelect = syRPoorSelect;
    vm.Alter = Alter;

   
    function syRPoorSelect(ID) {
        vm.BName = {};
        vm.promise = AjaxService.GetPlans("MESsyRPoor", GetContition4(ID)).then(function (data) {
            vm.syRPoorName = data;
            console.log(ID);
            console.log(data);
        });

    }
    function GetContition4(ID) {
        var list = [];
        list.push({ name: "PID", value: ID });
        return list;
    }
   

    function SelectqlBad() {
        var bc = {};
        bc.BarCode = vm.BarCode;
        if (bc.BarCode == null || bc.BarCode == '') {
            toastr.error('内控码不能为空！');
        } else if(bc.BarCode!=undefined){ 
            AjaxService.GetPlan("MESvw_qlBadAcquisition",[{ name: "BarCode", value:  bc.BarCode }]).then(function (data) {
                vm.item = data;
                if (vm.item.BarCode == null) {
                    toastr.error('内控码无效，请重新输入！');
                } else {
                    vm.BarCode = null;
                }
                console.log(vm.BarCode);
                console.log(vm.item);
            });
        }
    }
    //获取组织信息

    //AjaxService.GetPlans("syQpoor", [{ name: "Layer", value: 1 }, { name: "IsMonitor", value: 1 }]).then(function (data) {
    //    vm.TypeList = data;
    //});

    function ChangeMonitor() {
        vm.DialogItem.Ng = undefined;
        AjaxService.GetPlans("syQpoor", [{ name: "Layer", value: 2 }, { name: "IsMonitor", value: 1 }, { name: "PID", value: vm.DialogItem.NgType }]).then(function (data) {
            vm.QpoorList = data;
        });
    }

    function OpenMate() {
        Dialog.OpenDialog("qlBadDialog", {}).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }

    function Alter() {
        var en = {};
       
        en.BarCode = vm.item.BarCode;
        en.WorOrder = vm.item.WorOrder;
        en.CustomerOrder = vm.item.CustomerOrder;
        en.MaterialName = vm.item.MaterialName;
        en.CustomerName = vm.item.CustomerName;
        en.FirstPoorName = vm.item.FirstPoorName;
        en.SecondPoorName = vm.item.SecondPoorName;

        en.ProcedureName = vm.AName.Name;
        en.FirstPoor = vm.AName.ID;

        en.WorkPartName = vm.BName.Name;
        en.SecondPoor = vm.BName.ID;

        en.IsRepair = vm.IsRepair;

        if (vm.IsRepair == true) {
            en.IsRepair = 1;
        } else if (vm.IsRepair == false) {
            en.IsRepair = 0;
        }
        en.PoorReason = vm.PoorReason;
        //console.log(en);

        vm.promise = AjaxService.ExecPlan("MESvw_qlBadAcquisition", "update", en).then(function (data) {
            console.log(data);
            if (data.data[0].MsgType == 'Success') {
                toastr.success('更新成功');
                $uibModalInstance.close(en);
            }
            else if (data.data[0].MsgType == 'Error') {
                toastr.error(data.data[0].Msg);
            }
        })


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
        
        en.TbName = vm.SerialNum.TbName;
        en.ClName = vm.SerialNum.ClName;
        console.log(en);
        if (vm.Item.State == false) {
            vm.Item.State = 0;
        } else if (vm.Item.State == true) {
            vm.Item.State = 1;
        }
        en.State = vm.Item.State;//是否有效

        //console.log(en);
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
