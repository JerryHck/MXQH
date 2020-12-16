'use strict';

angular.module('app')
.controller('FlowAddCtrl', ['$scope', '$http', 'Dialog', 'AjaxService', 'toastr',
function ($scope, $http, Dialog, AjaxService, toastr) {
    var vm = this;
    vm.NewItem = { LoadFiles: [] };
    vm.page = { index: 1, size: 16 };
    vm.Ser = {};

    AjaxService.LoginAction("GetUserRoot", { RootType: "Flow" }).then(function (data) {
        vm.FlowList = data;
    })
}
]);