'use strict';
angular.module('app').controller('WPOIQCDtlDialogCtrl', MateDialogCtrl);

MateDialogCtrl.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'Form', 'ItemData', 'toastr', 'AjaxService', '$window'];

function MateDialogCtrl($rootScope, $scope, $uibModalInstance, Form, ItemData, toastr, AjaxService, $window) {
    var vm = this;
    vm.form = Form[ItemData.Id ? 1 : 0];
    vm.Item = angular.copy(ItemData);

    //WPOIQCDtlDialog
    AjaxService.GetPlans("AucPackIQCCheckDtl", { name: "IQCFormNo", value: vm.Item.IQCFormNo }).then(function (data) {
        vm.SNList = data;
    })

    //取消
    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


}
