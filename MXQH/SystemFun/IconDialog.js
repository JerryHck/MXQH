'use strict';
angular.module('app').controller('IconDialogCtrl', IconDialogCtrl);

IconDialogCtrl.$inject = ['$scope', '$uibModalInstance', 'Data', 'toastr', 'AjaxService'];

function IconDialogCtrl($scope, $uibModalInstance, Data, toastr, AjaxService) {
    var vm = this;
    vm.SelectedClass = Data;

    //Route Config
    AjaxService.GetJson('Icon.json', '').then(function (data) {
        vm.Data = data;
        console.log(data)
    });

    //取消
    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}
