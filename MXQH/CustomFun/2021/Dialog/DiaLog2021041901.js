'use strict';

angular.module('AppSet')
.controller('BcEquipmentDialogCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'Form', 'AjaxService', 'toastr', '$window', 'Dialog',
function ($scope, ItemData, $uibModalInstance, Form, AjaxService, toastr, $window, Dialog) {

    var vm = this;
    vm.form = Form[ItemData.ID ? 1 : 0];    vm.Item = angular.copy(ItemData);;
    vm.Save = Save;
    vm.Cancel = Cancel;
    vm.OpenFA = OpenFA;
    vm.IsCodeExists = IsCodeExists;
    //U9FAssetCardDialog

    function OpenFA() {
        Dialog.OpenDialog("U9FAssetCardDialog", {}).then(function (data) {
            AjaxService.GetPlan("BcEquipment", { name: "Code", value: data.Code }).then(function (data1) {
                if (data1.Code) {
                    toastr.error("该设备已经添加过, 请重新选择");
                };
                vm.DialogForm.Code.$setValidity('unique', !data1.Code);
                vm.Item.Code = data.Code;
                vm.Item.Name = data.Name;
                vm.Item.UseDept = data.UseDept;
                vm.Item.Dept = data.Dept;
                vm.Item.U9CardCode = data.U9CardCode;
                vm.Item.EqSpec = data.EqSpec;
                //vm.Item.Location = data.Location;
            });
        }, function (en) { })
    }

    function Save() {
        if (vm.form.index==0) {
            vm.promise = AjaxService.PlanInsert("BcEquipment", vm.Item).then(function (data) {
                toastr.success('储存成功');
                $uibModalInstance.close(vm.Item);
            });
        }
        else {
            var en = {};
            en.ID = vm.Item.ID;
            en.Code = vm.Item.Code;
            en.Name = vm.Item.Name;
            en.TypeCode = vm.Item.TypeCode;
            en.Brand = vm.Item.Brand;
            en.EqSpec = vm.Item.EqSpec;
            en.BuyTime = vm.Item.BuyTime;
            en.BuyAmount = vm.Item.BuyAmount;
            en.UseDept = vm.Item.UseDept;
            en.Dept = vm.Item.Dept;
            en.Location = vm.Item.Location;
            en.VenderName = vm.Item.VenderName;
            en.U9CardCode = vm.Item.U9CardCode;
            en.Remark = vm.Item.Remark;
            vm.promise = AjaxService.PlanUpdate("BcEquipment", en).then(function (data) {
                toastr.success('储存成功');
                $uibModalInstance.close(en);
            });
        }
    };

    function IsCodeExists() {
        var list = [];
        list.push({ name: "Code", value: vm.Item.Code });
        AjaxService.GetPlan("BcEquipment", list).then(function (data) {
            vm.DialogForm.Code.$setValidity('unique', !data.Code);
        });
    }

    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);
