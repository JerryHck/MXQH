'use strict';

angular.module('AppSet')
.controller('FlowNodeSetDialogCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'Form', 'AjaxService', 'toastr', '$window',
function ($scope, ItemData, $uibModalInstance, Form, AjaxService, toastr, $window) {

    var vm = this;
    vm.form = Form[ItemData.NodeNo ? 1 : 0];
    vm.Item = angular.copy(ItemData);
    vm.Columns = ItemData.Columns;
    vm.Item.Columns = undefined;
    vm.Save = Save;
    vm.Cancel = Cancel;
    vm.AddNodeCon = AddNodeCon;
    vm.DelNodeCon = DelNodeCon;
    vm.AddNodeColCon = AddNodeColCon;
    vm.DelNodeColCon = DelNodeColCon;
    $scope.$watch(function () { return vm.Item.NodeType; }, ChangeNodeType);
    
    vm.NewCon = { ID: uuid.v1() + '-Con', NodeNo: vm.Item.NodeNo, PosOut: 'Right', ConList: [{ Associate: "", ValueType: "2", Expression: "=" }] };

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
            case "M":
                vm.Item.PosIn = "Top";
                vm.Item.AbleOkOut = false;
                vm.Item.PosNgOut = vm.Item.PosNgOut == "Top" ? "Bottom" : vm.Item.PosNgOut;
                vm.Item.Contition = vm.Item.Contition || [{ ID: uuid.v1() + '-Con', NodeNo: vm.Item.NodeNo, PosOut: 'Right', ConList: [{ Associate: "", ValueType: "2", Expression: "=" }] }];
                break;
        }
    }

    function AddNodeCon() {
        vm.Item.Contition = vm.Item.Contition || [];
        var en = { ID: uuid.v1() + '-Con', NodeNo: vm.Item.NodeNo, PosOut: 'Right', ConList: [{ Associate: "", ValueType: "2", Expression: "=" }] };;
        vm.Item.Contition.push(en);
        //if (vm.NewCon.ColumnName) {
        //    vm.Item.Contition = vm.Item.Contition || [];
        //    //var have = false;
        //    //for (var i = 0, len = vm.Item.Contition.length; i < len; i++) {
        //    //    if (vm.NewCon.ColumnName == vm.Item.Contition[i].ColumnName) {

        //    //    }
        //    //}

        //    vm.Item.Contition.push(angular.copy(vm.NewCon));
        //    vm.NewCon = { ID: uuid.v1() + '-Con', NodeNo: vm.Item.NodeNo, PosOut: 'Right', ConList: [{ Associate: "", ValueType: "2", Expression: "=" }] };
        //}
    }

    function DelNodeCon(index) {
        vm.Item.Contition.splice(index, 1);
    }

    function AddNodeColCon(item) {
        item.ConList = item.ConList || [];
        var en = { Associate: "", ValueType: "2", Expression: "=" };
        item.ConList.push(en);
    }

    function DelNodeColCon(item, index) {
        item.ConList.splice(index, 1);
    }

    function Save() {
        vm.Item.WASignBy = vm.Item.WASignBy || '';
        vm.Item.OrgLevel = vm.Item.OrgLevel || 0;
        vm.Item.Remark = vm.Item.Remark || '';
        vm.Item.Contition = vm.Item.Contition || [];
        if (vm.Item.NodeType == 'M' && vm.Item.Contition.length == 0) {
            toastr.error("还未添加条件");
            return;
        }
        $uibModalInstance.close(vm.Item);
    }

    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);
