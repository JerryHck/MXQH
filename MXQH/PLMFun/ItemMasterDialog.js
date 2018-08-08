'use strict'
angular.module('app').controller('ItemmasterDialogCtrl', AuctusItemMasterDialog);
AuctusItemMasterDialog.$inject = ['$scope', '$uibModalInstance', 'Form', 'ItemData', 'toastr', 'AjaxService'];
function AuctusItemMasterDialog($scope, $uibModalInstance, Form, ItemData, toastr, AjaxService) {
    var itemmaster = this;
    itemmaster.form = Form[ItemData.ID ? 1 : 0];
    itemmaster.Item = ItemData;
    itemmaster.Save = Save;
    itemmaster.Cancel = Cancel;
    itemmaster.Action = ItemData.ID ? "U" : "I";
    itemmaster.Item.ComponentType = ItemData.ID ? ItemData.ComponentType.toString() : "0";
    itemmaster.ConfigComponentType = { Table: "ComponentType", Column: "ComponentType" };

    //保存 新增/编辑
    function Save() {
        var en = {};
        en.Code = itemmaster.Item.Code;
        en.Name = itemmaster.Item.Name;
        en.SPEC = itemmaster.Item.SPEC;
        en.ComponentType = itemmaster.Item.ComponentType;
        en.DocLineNo = itemmaster.Item.DocLineNo;
        if (itemmaster.Action == "I") {//新增
            AjaxService.PlanInsert('AuctusItemMaster', en).then(function (data) {
                toastr.success('储存成功');
                $uibModalInstance.close(itemmaster.Item);
            });
        }
        else {//编辑
            en.ID = itemmaster.Item.ID
            AjaxService.PlanUpdate('AuctusItemMaster', en).then(function (data) {
                toastr.success('修改成功');
                $uibModalInstance.close(itemmaster.Item);
            });
        }
    }
    //取消
    function Cancel() {
        $uibModalInstance.dismiss('Cancel');

    };

}
