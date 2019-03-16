'use strict'
angular.module('app').controller('DSInfoDialogCtrl', DSInfoDialog);
DSInfoDialog.$inject = ['$scope', '$uibModalInstance', 'Form', 'ItemData', 'toastr', 'AjaxService'];
function DSInfoDialog($scope, $uibModalInstance, Form, ItemData, toastr, AjaxService) {
    var dsdialog = this;
    dsdialog.form = Form[ItemData.ID ? 1 : 0];
    dsdialog.Item = ItemData;
    dsdialog.Save = Save;
    dsdialog.Cancel = Cancel;
    dsdialog.Action = ItemData.ID ? "U" : "I";
    //dsdialog.Item.ComponentType = ItemData.ID ? ItemData.ComponentType.toString() : "0";

    //保存 新增/编辑
    function Save() {
        var en = {};
        en.Company = dsdialog.Item.Company;
        en.PlanCode = dsdialog.Item.PlanCode;
        en.Code = dsdialog.Item.Code;
        en.Name = dsdialog.Item.Name;
        en.DocNo = dsdialog.Item.DocNo;
        en.DemandCode = dsdialog.Item.DemandCode;
        en.DSType = dsdialog.Item.DSType;
        en.DocType = dsdialog.Item.DocType;
        en.NetQty = dsdialog.Item.NetQty;
        en.TradeBaseQty = dsdialog.Item.TradeBaseQty;
        en.Remark = dsdialog.Item.Remark;
        en.ID = dsdialog.Item.ID
        AjaxService.PlanUpdate('MRPDSInfoResult', en).then(function (data) {
            toastr.success('修改成功');
            $uibModalInstance.close(dsdialog.Item);
        });
    }
    //取消
    function Cancel() {
        $uibModalInstance.dismiss('Cancel');
    };

}
