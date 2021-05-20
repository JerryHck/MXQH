'use strict';

angular.module('AppSet')
.controller('HtmlShowDialogCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
function ($scope, ItemData, $uibModalInstance, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
    vm.Ser = {};

    vm.OK = OK;
    vm.Cancel = Cancel;

    vm.HtmlCode = ItemData;

    AjaxService.AjaxHandle("GetFileText", "123").then(function (data) {
        $("#htmlShow").html(ItemData);
    })

    
    function OK(item) {
        $uibModalInstance.close(item);
    }
    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);
