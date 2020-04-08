'use strict';

angular.module('AppSet')
.controller('TestDialog', ['$scope', 'ItemData', '$uibModalInstance', 'Form', 'AjaxService', 'toastr', '$window',
function ($scope, ItemData, $uibModalInstance, Form, AjaxService, toastr, $window) {

    var vm = this;
    vm.form = Form[ItemData.Id ? 1 : 0];    vm.Item = angular.copy(ItemData);;
    vm.Save = Save;
    vm.Cancel = Cancel;
    function Save() {
        if (vm.form.index==0) {
            vm.promise = AjaxService.PlanInsert("MesMXMaterial", vm.Item).then(function (data) {
                toastr.success('储存成功');
                $uibModalInstance.close(vm.Item);
            });
        }
        else {            var en = {};
            en.Id = vm.Item.Id;
            en.IMEI_ClName = vm.Item.IMEI_ClName;
            en.IMEI_TbName = vm.Item.IMEI_TbName;
            en.IsBox = vm.Item.IsBox;
            en.IsCanChangePO = vm.Item.IsCanChangePO;
            en.Layer_card = vm.Item.Layer_card;
            en.LowerFPY = vm.Item.LowerFPY;
            en.MaterialCode = vm.Item.MaterialCode;
            en.MaterialName = vm.Item.MaterialName;
            en.MaterialTypeID = vm.Item.MaterialTypeID;
            en.AgeingTime = vm.Item.AgeingTime;
            en.Box_Layer = vm.Item.Box_Layer;
            en.BoxCount = vm.Item.BoxCount;
            en.BoxWeight = vm.Item.BoxWeight;
            en.Brand = vm.Item.Brand;
            en.ClName = vm.Item.ClName;
            en.Color = vm.Item.Color;
            en.ColorBoxCount = vm.Item.ColorBoxCount;
            en.ColorBoxPrintNum = vm.Item.ColorBoxPrintNum;
            en.OverRate = vm.Item.OverRate;
            en.PalletRoughWeight = vm.Item.PalletRoughWeight;
            en.PalletSumWight = vm.Item.PalletSumWight;
            en.PassSwitch = vm.Item.PassSwitch;
            en.PerBoxCount = vm.Item.PerBoxCount;
            en.PersonCount = vm.Item.PersonCount;
            en.ProductSwitch = vm.Item.ProductSwitch;
            en.Remark = vm.Item.Remark;
            en.Spec = vm.Item.Spec;
            en.State = vm.Item.State;
            en.TbName = vm.Item.TbName;
            en.Texture = vm.Item.Texture;
            en.Unit = vm.Item.Unit;
            en.UPPH = vm.Item.UPPH;
            en.Weight = vm.Item.Weight;
            vm.promise = AjaxService.PlanUpdate("MesMXMaterial", en).then(function (data) {
                toastr.success('储存成功');
                $uibModalInstance.close(en);
            });
        }
    };

    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);
