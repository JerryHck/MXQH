'use strict';

angular.module('app')
.controller('AddDailogCtrl', ['$scope', '$http', 'Dialog', 'AjaxService', 'toastr',
function ($scope, $http, Dialog, AjaxService, toastr) {
    var vm = this;
    vm.Insert = Insert;

    vm.promise = AjaxService.GetJson('Dialog.json', '').then(function (data) {
        vm.List = data;
    })

    function Insert() {
        vm.isAdd = !vm.isAdd;
    }

    //AjaxService.AddDailog(JSON.stringify(data));
}
]);