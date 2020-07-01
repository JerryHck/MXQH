'use strict';

angular.module('AppSet')
.controller('FlowNodeSetDialogCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'Form', 'AjaxService', 'toastr', '$window',
function ($scope, ItemData, $uibModalInstance, Form, AjaxService, toastr, $window) {

    var vm = this;
    vm.form = Form[ItemData.NodeNo ? 1 : 0];
    vm.Item = angular.copy(ItemData);;
    vm.Save = Save;
    vm.Cancel = Cancel;
    vm.ChangeNodeType = ChangeNodeType;


    function ChangeNodeType() {
        switch (vm.Item.NodeType) {
            case "A":
            case "H":
                vm.Item.AbleNgOut = false;
                break;
            case "S":
                vm.Item.AbleNgOut = true;
                vm.Item.PosIn = "Top";
                vm.Item.PosOkOut = vm.Item.PosOkOut == "Top" || vm.Item.PosOkOut == "Bottom" ? "Right" : vm.Item.PosOkOut;
                vm.Item.PosNgOut = vm.Item.PosNgOut == "Top" ? "Bottom" : vm.Item.PosNgOut;
                break;
        }
    }


    function Save() {
        vm.Item.WASignBy = vm.Item.WASignBy || '';
        vm.Item.OrgLevel = vm.Item.OrgLevel || 0;
        vm.Item.Remark = vm.Item.Remark || '';
        $uibModalInstance.close(vm.Item);
    }

    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);
