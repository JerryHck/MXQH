'use strict';
angular.module('app').controller('IconDialogCtrl', IconDialogCtrl);

IconDialogCtrl.$inject = ['$scope', '$uibModalInstance', 'Data', 'toastr', 'AjaxService'];

function IconDialogCtrl($scope, $uibModalInstance, Data, toastr, AjaxService) {
    var vm = this;
    vm.Class = Data;

    vm.SelectIcon = SelectIcon;
    vm.MakeSure = MakeSure;
    vm.MakeSureColor = MakeSureColor;
    vm.SelectColor = SelectColor;
    vm.Ok = Ok;

    //Route Config
    AjaxService.GetJson('Icon.json', '').then(function (data) {
        vm.IconData = data;
    });

    AjaxService.GetJson('Color.json', '').then(function (data) {
        vm.ColorData = data;
    });

    function SelectIcon(icon)
    {
        vm.Icon = icon;
        vm.Class = (vm.Icon || "") + (vm.Color || "");
    }

    function MakeSure(icon)
    {
        vm.Icon = icon;
        vm.Class = (vm.Icon || "") + (vm.Color || "");
    }

    function SelectColor(color, dtl) {
        vm.Color = color + dtl;
        vm.Class = (vm.Icon || "") + (vm.Color || "");
    }

    function MakeSureColor(color, dtl) {
        vm.Color = color + dtl;
        vm.Class = (vm.Icon || "") + (vm.Color || "");
        Ok();
    }

    function Ok()
    {
        vm.Class = (vm.Icon || "") + (vm.Color || "");
        $uibModalInstance.close(vm.Class);
    }

    //取消
    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}
