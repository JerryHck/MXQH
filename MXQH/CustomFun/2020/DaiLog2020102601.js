'use strict';

angular.module('AppSet')
.controller('WorkOrderWasteCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window', '$rootScope',
function ($scope, ItemData, $uibModalInstance, AjaxService, toastr, $window, $rootScope) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
    vm.InItem = ItemData;
    vm.IsCha = false;
    vm.OK = OK;
    vm.Cancel = Cancel;
    vm.KeyDonwOrder = KeyDonwOrder;
    vm.Save = Save;

    GetData(vm.InItem.WorkOrder, 'S');

    function KeyDonwOrder(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.ThisForm.DocNo) {
            GetData(vm.ThisForm.DocNo, 'G');
        }
    }

    function GetData(docNo, type) {
        if (!docNo) return;
        var en = {};
        en.DocNo = docNo;
        en.SerType = type
        vm.promise = AjaxService.ExecPlan("MOMateIssue", "check", en).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                toastr.error(data.data[0].MsgText);
                vm.ThisForm = {};
                vm.DtlList = [];
            }
            else if (data.data[0].MsgType == "Success") {
                if (type != 'S') {
                    toastr.success("单据扫描成功");
                }
                vm.ThisForm = data.data1[0];
                vm.DtlList = data.data2;
            }
        });
    }

    function Save() {
        var en = { MOID: vm.ThisForm.ID };

        var list = [];
        for (var i = 0, len = vm.DtlList.length; i < len; i++) {
            if (vm.DtlList[i].DumpNum) {
                if (vm.DtlList[i].DumpNum > vm.DtlList[i].IssuedQty) {
                    toastr.error("行号【" + vm.DtlList[i].RowNo + "】料号【" + vm.DtlList[i].MateCode + "】损耗数量【" + vm.DtlList[i].DumpNum + "】大于领料数量【" + vm.DtlList[i].IssuedQty + "】")
                    return;
                }
                list.push(vm.DtlList[i]);
            }
        }
        if (list.length == 0) {
            toastr.error("没有填写数据")
            return;
        }
        en.DtlList = JSON.stringify(list);
        en.TempColumns = "DtlList";
        vm.promise = AjaxService.ExecPlan("MOMateIssue", "save", en).then(function (data) {
            toastr.success("储存成功");
            $uibModalInstance.close(true);
        });
    }

    function OK(item) {
        $uibModalInstance.close(vm.IsCha);
    }
    function Cancel() {
        //$uibModalInstance.dismiss('cancel');
        $uibModalInstance.close(false);
    }

}]);
