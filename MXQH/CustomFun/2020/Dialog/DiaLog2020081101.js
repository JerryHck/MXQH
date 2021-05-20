'use strict';

angular.module('AppSet')
.controller('U9IssueCheckDialogCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
function ($scope, ItemData, $uibModalInstance, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
    vm.InItem = ItemData;
    vm.IsCha = false;
    vm.OK = OK;
    vm.Cancel = Cancel;
    vm.KeyDonwOrder = KeyDonwOrder;
    vm.Save = Save;

    GetData(vm.InItem.DocNo, 'S');

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
        vm.promise = AjaxService.ExecPlan("U9MOIssueDocCheck", "check", en).then(function (data) {
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
        vm.promise = AjaxService.ExecPlan("U9MOIssueDocCheck", "save", vm.ThisForm).then(function (data) {
            toastr.success("单据扫描成功");
            vm.ThisForm = {};
            vm.DtlList = [];
            vm.IsCha = true;
        });
    }

    function OK(item) {
        $uibModalInstance.close(vm.IsCha);
    }
    function Cancel() {
        //$uibModalInstance.dismiss('cancel');
        $uibModalInstance.close(vm.IsCha);
    }

}]);
